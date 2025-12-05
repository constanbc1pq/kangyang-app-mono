import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView as RNScrollView, Alert } from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, H3, Progress, useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastController } from '@tamagui/toast';
import {
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Lightbulb,
  History,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getTaskById, deleteTask, completeTask } from '@/services/userDataService';
import { HealthTask } from '@/types/userData';
import * as Icons from 'lucide-react-native';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { TitleBar } from '@/components/TitleBar';

interface TaskDetailScreenProps {
  route: {
    params: {
      taskId: string;
    };
  };
}

type TabType = 'overview' | 'history' | 'achievements';

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const toast = useToastController();
  const theme = useTheme();
  const { taskId } = route.params;
  const [task, setTask] = useState<HealthTask | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // 主题色值
  const primaryColor = theme.primary?.val || '#6366F1';
  const successColor = theme.success?.val || '#10B981';
  const errorColor = theme.error?.val || '#EF4444';
  const textColor = theme.color12?.val || '#1F2937';
  const textSecondaryColor = theme.color10?.val || '#6B7280';

  // 页面获得焦点时重新加载任务数据
  useFocusEffect(
    React.useCallback(() => {
      loadTask();
    }, [taskId])
  );

  const loadTask = async () => {
    setLoading(true);
    try {
      const loadedTask = await getTaskById(taskId);
      setTask(loadedTask);
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!task) return;

    if (task.status === 'completed') {
      toast.show('提示', {
        message: '任务已经完成啦！',
      });
      return;
    }

    try {
      const success = await completeTask(task.id);
      if (success) {
        toast.show('任务已完成！', {
          message: '继续保持，养成健康好习惯！',
        });
        await loadTask();
      } else {
        toast.show('操作失败', {
          message: '任务不存在',
        });
      }
    } catch (error) {
      console.error('完成任务失败:', error);
      toast.show('操作失败', {
        message: '请重试',
      });
    }
  };

  const handleEdit = () => {
    navigation.navigate('TaskForm', { taskId: task?.id });
  };

  const handleDelete = () => {
    Alert.alert(
      '删除任务',
      '确定要删除这个任务吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            if (task) {
              await deleteTask(task.id);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const getTaskIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.CheckCircle;
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MM月dd日 HH:mm', { locale: zhCN });
    } catch {
      return dateStr;
    }
  };

  if (loading || !task) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View flex={1} justifyContent="center" alignItems="center">
            <Text fontSize="$5" color="$textSecondary">加载中...</Text>
          </View>
        </SafeAreaView>
      </Theme>
    );
  }

  const IconComponent = getTaskIcon(task.icon);

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <TitleBar
          title="任务详情"
          actions={[
            { icon: Edit, onPress: handleEdit, color: primaryColor },
            { icon: Trash2, onPress: handleDelete, color: errorColor },
          ]}
        />

        <RNScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5" gap="$2">
            {/* Task Overview Card */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              borderLeftWidth={4}
              borderLeftColor={task.color}
            >
              <XStack gap="$2" alignItems="center" marginBottom="$2">
                <View
                  width={52}
                  height={52}
                  borderRadius="$12"
                  backgroundColor={`${task.color}20`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconComponent size={26} color={task.color} />
                </View>
                <YStack flex={1}>
                  <H3 fontSize="$6" fontWeight="bold" color="$color12" marginBottom="$0.5">
                    {task.title}
                  </H3>
                  <Text fontSize="$3" color="$color10">
                    {task.description || '暂无描述'}
                  </Text>
                </YStack>
              </XStack>

              {/* Progress */}
              <YStack gap="$1" marginBottom="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">完成进度</Text>
                  <Text fontSize="$4" color={task.color} fontWeight="bold">
                    {task.progress}%
                  </Text>
                </XStack>
                <Progress value={task.progress} backgroundColor="$color5">
                  <Progress.Indicator backgroundColor={task.color} />
                </Progress>
              </YStack>

              {/* Stats Grid */}
              <XStack gap="$2">
                <YStack flex={1} padding="$2" borderRadius="$5" backgroundColor={`${task.color}10`}>
                  <XStack gap="$1" alignItems="center" marginBottom="$0.5">
                    <TrendingUp size={14} color={task.color} />
                    <Text fontSize="$2" color="$color10">连续天数</Text>
                  </XStack>
                  <Text fontSize="$5" fontWeight="bold" color={task.color}>
                    {task.currentStreak}天
                  </Text>
                </YStack>
                <YStack flex={1} padding="$2" borderRadius="$5" backgroundColor={`${successColor}10`}>
                  <XStack gap="$1" alignItems="center" marginBottom="$0.5">
                    <CheckCircle size={14} color={successColor} />
                    <Text fontSize="$2" color="$color10">完成次数</Text>
                  </XStack>
                  <Text fontSize="$5" fontWeight="bold" color={successColor}>
                    {task.totalCompletions}次
                  </Text>
                </YStack>
                <YStack flex={1} padding="$2" borderRadius="$5" backgroundColor={`${primaryColor}10`}>
                  <XStack gap="$1" alignItems="center" marginBottom="$0.5">
                    <Award size={14} color={primaryColor} />
                    <Text fontSize="$2" color="$color10">完成率</Text>
                  </XStack>
                  <Text fontSize="$5" fontWeight="bold" color={primaryColor}>
                    {task.completionRate}%
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* Tabs */}
            <XStack
              backgroundColor="$color2"
              borderRadius="$10"
              padding="$1"
              gap="$1"
            >
              {[
                { key: 'overview', label: '概览', icon: Lightbulb },
                { key: 'history', label: '历史', icon: History },
                { key: 'achievements', label: '成就', icon: Award },
              ].map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab(tab.key as TabType)}
                >
                  <View
                    paddingVertical="$2"
                    borderRadius="$10"
                    backgroundColor={activeTab === tab.key ? '$primary' : 'transparent'}
                    alignItems="center"
                  >
                    <XStack gap="$1" alignItems="center">
                      <tab.icon size={14} color={activeTab === tab.key ? 'white' : textSecondaryColor} />
                      <Text
                        fontSize="$3"
                        fontWeight={activeTab === tab.key ? '500' : 'normal'}
                        color={activeTab === tab.key ? 'white' : '$color10'}
                      >
                        {tab.label}
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <Card padding="$2" borderRadius="$6" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
                <XStack gap="$2" alignItems="center" marginBottom="$2">
                  <Lightbulb size={18} color={primaryColor} />
                  <H3 fontSize="$5" fontWeight="600" color="$color12">健康建议</H3>
                </XStack>

                {task.healthSuggestions && task.healthSuggestions.length > 0 ? (
                  <YStack gap="$2">
                    {task.healthSuggestions.map((suggestion, index) => (
                      <XStack key={index} gap="$2" alignItems="flex-start">
                        <View
                          width={6}
                          height={6}
                          borderRadius={3}
                          backgroundColor={task.color}
                          marginTop="$1.5"
                        />
                        <Text fontSize="$3" color="$color12" flex={1} lineHeight="$2">
                          {suggestion}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                ) : (
                  <Text fontSize="$3" color="$color10" textAlign="center" paddingVertical="$2">
                    暂无健康建议
                  </Text>
                )}
              </Card>
            )}

            {activeTab === 'history' && (
              <Card padding="$2" borderRadius="$6" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
                <XStack gap="$2" alignItems="center" marginBottom="$2">
                  <History size={18} color={primaryColor} />
                  <H3 fontSize="$5" fontWeight="600" color="$color12">完成记录</H3>
                </XStack>

                {task.completionHistory.length > 0 ? (
                  <YStack gap="$2">
                    {task.completionHistory.slice().reverse().map((record, index) => (
                      <View
                        key={record.id}
                        padding="$2"
                        borderRadius="$5"
                        backgroundColor="$color2"
                        borderLeftWidth={3}
                        borderLeftColor={task.color}
                      >
                        <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
                          <XStack gap="$2" alignItems="center">
                            <CheckCircle size={14} color={successColor} />
                            <Text fontSize="$4" fontWeight="600" color="$color12">
                              {record.date}
                            </Text>
                          </XStack>
                          <Text fontSize="$3" color="$color10">
                            {record.time}
                          </Text>
                        </XStack>

                        {record.duration && (
                          <XStack gap="$1" alignItems="center" marginBottom="$0.5">
                            <Clock size={12} color={textSecondaryColor} />
                            <Text fontSize="$3" color="$color10">
                              用时 {record.duration} 分钟
                            </Text>
                          </XStack>
                        )}

                        {record.notes && (
                          <Text fontSize="$3" color="$color12" marginTop="$1">
                            备注：{record.notes}
                          </Text>
                        )}
                      </View>
                    ))}
                  </YStack>
                ) : (
                  <Text fontSize="$3" color="$color10" textAlign="center" paddingVertical="$2">
                    暂无完成记录
                  </Text>
                )}
              </Card>
            )}

            {activeTab === 'achievements' && (
              <Card padding="$2" borderRadius="$6" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
                <XStack gap="$2" alignItems="center" marginBottom="$2">
                  <Award size={18} color={primaryColor} />
                  <H3 fontSize="$5" fontWeight="600" color="$color12">相关成就</H3>
                </XStack>

                {task.achievements.length > 0 ? (
                  <YStack gap="$2">
                    {task.achievements.map(achievement => {
                      const AchievementIcon = getTaskIcon(achievement.icon);
                      return (
                        <View
                          key={achievement.id}
                          padding="$2"
                          borderRadius="$5"
                          backgroundColor={achievement.achieved ? `${achievement.color}10` : '$color2'}
                          borderWidth={1}
                          borderColor={achievement.achieved ? achievement.color : '$color5'}
                        >
                          <XStack gap="$2" alignItems="center" marginBottom="$2">
                            <View
                              width={40}
                              height={40}
                              borderRadius="$12"
                              backgroundColor={achievement.achieved ? achievement.color : '$color5'}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <AchievementIcon
                                size={20}
                                color={achievement.achieved ? 'white' : textSecondaryColor}
                              />
                            </View>
                            <YStack flex={1}>
                              <Text fontSize="$4" fontWeight="bold" color="$color12" marginBottom="$0.5">
                                {achievement.title}
                              </Text>
                              <Text fontSize="$3" color="$color10">
                                {achievement.description}
                              </Text>
                            </YStack>
                            {achievement.achieved && (
                              <CheckCircle size={20} color={successColor} />
                            )}
                          </XStack>

                          {/* Achievement Progress */}
                          <YStack gap="$1">
                            <XStack justifyContent="space-between">
                              <Text fontSize="$3" color="$color10">进度</Text>
                              <Text fontSize="$3" fontWeight="500" color={achievement.color}>
                                {achievement.current}/{achievement.target} {achievement.unit}
                              </Text>
                            </XStack>
                            <Progress
                              value={(achievement.current / achievement.target) * 100}
                              backgroundColor="$color5"
                            >
                              <Progress.Indicator backgroundColor={achievement.color} />
                            </Progress>
                          </YStack>

                          {achievement.achieved && achievement.achievedDate && (
                            <Text fontSize="$2" color="$color10" marginTop="$1">
                              达成时间：{formatDate(achievement.achievedDate)}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </YStack>
                ) : (
                  <Text fontSize="$3" color="$color10" textAlign="center" paddingVertical="$2">
                    暂无相关成就
                  </Text>
                )}
              </Card>
            )}

            {/* Action Button */}
            {task.status !== 'completed' && (
              <TouchableOpacity onPress={handleComplete}>
                <View
                  padding="$2"
                  borderRadius="$10"
                  backgroundColor={successColor}
                  alignItems="center"
                >
                  <XStack gap="$2" alignItems="center">
                    <CheckCircle size={20} color="white" />
                    <Text fontSize="$4" fontWeight="500" color="white">
                      标记为已完成
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            )}

            {/* Bottom padding */}
            <View height={20} />
          </YStack>
        </RNScrollView>
      </SafeAreaView>
    </Theme>
  );
};