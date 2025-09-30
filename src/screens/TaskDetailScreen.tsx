import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView as RNScrollView, Alert } from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, H2, H3, Progress } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastController } from '@tamagui/toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  Lightbulb,
  History,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getTaskById, deleteTask, completeTask } from '@/services/userDataService';
import { HealthTask, TaskCompletionRecord, TaskAchievement } from '@/types/userData';
import * as Icons from 'lucide-react-native';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
  const { taskId } = route.params;
  const [task, setTask] = useState<HealthTask | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

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
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="white"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <H2 fontSize="$7" fontWeight="bold" color="$text" marginLeft="$3" flex={1}>
            任务详情
          </H2>
          <XStack space="$3">
            <TouchableOpacity onPress={handleEdit}>
              <Edit size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={22} color={COLORS.error} />
            </TouchableOpacity>
          </XStack>
        </XStack>

        <RNScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" space="$4">
            {/* Task Overview Card */}
            <Card
              padding="$5"
              borderRadius="$4"
              backgroundColor="$surface"
              borderLeftWidth={6}
              borderLeftColor={task.color}
            >
              <XStack space="$4" alignItems="center" marginBottom="$4">
                <View
                  width={64}
                  height={64}
                  borderRadius={32}
                  backgroundColor={`${task.color}20`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconComponent size={32} color={task.color} />
                </View>
                <YStack flex={1}>
                  <H3 fontSize="$7" fontWeight="bold" color="$text" marginBottom="$1">
                    {task.title}
                  </H3>
                  <Text fontSize="$3" color="$textSecondary">
                    {task.description || '暂无描述'}
                  </Text>
                </YStack>
              </XStack>

              {/* Progress */}
              <YStack space="$2" marginBottom="$4">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">完成进度</Text>
                  <Text fontSize="$4" color={task.color} fontWeight="bold">
                    {task.progress}%
                  </Text>
                </XStack>
                <Progress value={task.progress} backgroundColor="$borderColor">
                  <Progress.Indicator backgroundColor={task.color} />
                </Progress>
              </YStack>

              {/* Stats Grid */}
              <XStack space="$3">
                <YStack flex={1} padding="$3" borderRadius="$3" backgroundColor={`${task.color}10`}>
                  <XStack space="$2" alignItems="center" marginBottom="$1">
                    <TrendingUp size={16} color={task.color} />
                    <Text fontSize="$2" color="$textSecondary">连续天数</Text>
                  </XStack>
                  <Text fontSize="$6" fontWeight="bold" color={task.color}>
                    {task.currentStreak}天
                  </Text>
                </YStack>
                <YStack flex={1} padding="$3" borderRadius="$3" backgroundColor={`${COLORS.success}10`}>
                  <XStack space="$2" alignItems="center" marginBottom="$1">
                    <CheckCircle size={16} color={COLORS.success} />
                    <Text fontSize="$2" color="$textSecondary">完成次数</Text>
                  </XStack>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.success}>
                    {task.totalCompletions}次
                  </Text>
                </YStack>
                <YStack flex={1} padding="$3" borderRadius="$3" backgroundColor={`${COLORS.primary}10`}>
                  <XStack space="$2" alignItems="center" marginBottom="$1">
                    <Award size={16} color={COLORS.primary} />
                    <Text fontSize="$2" color="$textSecondary">完成率</Text>
                  </XStack>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                    {task.completionRate}%
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* Tabs */}
            <XStack
              backgroundColor="$surface"
              borderRadius="$4"
              padding="$1"
              space="$1"
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
                    borderRadius="$3"
                    backgroundColor={activeTab === tab.key ? COLORS.primary : 'transparent'}
                    alignItems="center"
                  >
                    <XStack space="$2" alignItems="center">
                      <tab.icon size={16} color={activeTab === tab.key ? 'white' : COLORS.textSecondary} />
                      <Text
                        fontSize="$3"
                        fontWeight={activeTab === tab.key ? '600' : 'normal'}
                        color={activeTab === tab.key ? 'white' : '$textSecondary'}
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
              <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
                <XStack space="$2" alignItems="center" marginBottom="$3">
                  <Lightbulb size={20} color={COLORS.primary} />
                  <H3 fontSize="$5" fontWeight="600" color="$text">健康建议</H3>
                </XStack>

                {task.healthSuggestions && task.healthSuggestions.length > 0 ? (
                  <YStack space="$3">
                    {task.healthSuggestions.map((suggestion, index) => (
                      <XStack key={index} space="$3" alignItems="flex-start">
                        <View
                          width={6}
                          height={6}
                          borderRadius={3}
                          backgroundColor={task.color}
                          marginTop="$2"
                        />
                        <Text fontSize="$4" color="$text" flex={1} lineHeight={22}>
                          {suggestion}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                ) : (
                  <Text fontSize="$3" color="$textSecondary" textAlign="center" paddingVertical="$4">
                    暂无健康建议
                  </Text>
                )}
              </Card>
            )}

            {activeTab === 'history' && (
              <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
                <XStack space="$2" alignItems="center" marginBottom="$3">
                  <History size={20} color={COLORS.primary} />
                  <H3 fontSize="$5" fontWeight="600" color="$text">完成记录</H3>
                </XStack>

                {task.completionHistory.length > 0 ? (
                  <YStack space="$3">
                    {task.completionHistory.slice().reverse().map((record, index) => (
                      <View
                        key={record.id}
                        padding="$3"
                        borderRadius="$3"
                        backgroundColor="$background"
                        borderLeftWidth={3}
                        borderLeftColor={task.color}
                      >
                        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                          <XStack space="$2" alignItems="center">
                            <CheckCircle size={16} color={COLORS.success} />
                            <Text fontSize="$4" fontWeight="600" color="$text">
                              {record.date}
                            </Text>
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary">
                            {record.time}
                          </Text>
                        </XStack>

                        {record.duration && (
                          <XStack space="$2" alignItems="center" marginBottom="$1">
                            <Clock size={14} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$textSecondary">
                              用时 {record.duration} 分钟
                            </Text>
                          </XStack>
                        )}

                        {record.notes && (
                          <Text fontSize="$3" color="$text" marginTop="$2">
                            备注：{record.notes}
                          </Text>
                        )}
                      </View>
                    ))}
                  </YStack>
                ) : (
                  <Text fontSize="$3" color="$textSecondary" textAlign="center" paddingVertical="$4">
                    暂无完成记录
                  </Text>
                )}
              </Card>
            )}

            {activeTab === 'achievements' && (
              <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
                <XStack space="$2" alignItems="center" marginBottom="$3">
                  <Award size={20} color={COLORS.primary} />
                  <H3 fontSize="$5" fontWeight="600" color="$text">相关成就</H3>
                </XStack>

                {task.achievements.length > 0 ? (
                  <YStack space="$3">
                    {task.achievements.map(achievement => {
                      const AchievementIcon = getTaskIcon(achievement.icon);
                      return (
                        <View
                          key={achievement.id}
                          padding="$4"
                          borderRadius="$4"
                          backgroundColor={achievement.achieved ? `${achievement.color}10` : '$background'}
                          borderWidth={2}
                          borderColor={achievement.achieved ? achievement.color : '$borderColor'}
                        >
                          <XStack space="$3" alignItems="center" marginBottom="$3">
                            <View
                              width={48}
                              height={48}
                              borderRadius={24}
                              backgroundColor={achievement.achieved ? achievement.color : '$borderColor'}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <AchievementIcon
                                size={24}
                                color={achievement.achieved ? 'white' : COLORS.textSecondary}
                              />
                            </View>
                            <YStack flex={1}>
                              <Text fontSize="$5" fontWeight="bold" color="$text" marginBottom="$1">
                                {achievement.title}
                              </Text>
                              <Text fontSize="$3" color="$textSecondary">
                                {achievement.description}
                              </Text>
                            </YStack>
                            {achievement.achieved && (
                              <CheckCircle size={24} color={COLORS.success} />
                            )}
                          </XStack>

                          {/* Achievement Progress */}
                          <YStack space="$2">
                            <XStack justifyContent="space-between">
                              <Text fontSize="$3" color="$textSecondary">进度</Text>
                              <Text fontSize="$3" fontWeight="600" color={achievement.color}>
                                {achievement.current}/{achievement.target} {achievement.unit}
                              </Text>
                            </XStack>
                            <Progress
                              value={(achievement.current / achievement.target) * 100}
                              backgroundColor="$borderColor"
                            >
                              <Progress.Indicator backgroundColor={achievement.color} />
                            </Progress>
                          </YStack>

                          {achievement.achieved && achievement.achievedDate && (
                            <Text fontSize="$2" color="$textSecondary" marginTop="$2">
                              达成时间：{formatDate(achievement.achievedDate)}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </YStack>
                ) : (
                  <Text fontSize="$3" color="$textSecondary" textAlign="center" paddingVertical="$4">
                    暂无相关成就
                  </Text>
                )}
              </Card>
            )}

            {/* Action Button */}
            {task.status !== 'completed' && (
              <TouchableOpacity onPress={handleComplete}>
                <View
                  padding="$4"
                  borderRadius="$4"
                  backgroundColor={COLORS.success}
                  alignItems="center"
                >
                  <XStack space="$2" alignItems="center">
                    <CheckCircle size={20} color="white" />
                    <Text fontSize="$5" fontWeight="bold" color="white">
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