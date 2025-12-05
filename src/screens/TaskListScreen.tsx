import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView as RNScrollView } from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, Progress, useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useToastController } from '@tamagui/toast';
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  TrendingUp,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getTasks, completeTask } from '@/services/userDataService';
import { HealthTask } from '@/types/userData';
import * as Icons from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

export const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const toast = useToastController();
  const theme = useTheme();

  // 主题色值
  const primaryColor = theme.primary?.val || '#6366F1';
  const successColor = theme.success?.val || '#10B981';
  const errorColor = theme.error?.val || '#EF4444';
  const accentColor = theme.accent?.val || '#A78BFA';
  const textColor = theme.color12?.val || '#1F2937';
  const textSecondaryColor = theme.color10?.val || '#6B7280';
  const [tasks, setTasks] = useState<HealthTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<HealthTask[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // 页面获得焦点时重新加载任务数据
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  // 过滤任务
  useEffect(() => {
    filterTasks();
  }, [tasks, categoryFilter, statusFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    // 按分类筛选
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // 按状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  // 计算统计数据
  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => {
      if (t.repeatFrequency !== 'none') return true;
      if (t.dueDate && t.dueDate.startsWith(today)) return true;
      return false;
    });

    const completed = todayTasks.filter(t => t.status === 'completed').length;
    const total = todayTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 计算平均连续天数
    const avgStreak = tasks.length > 0
      ? Math.round(tasks.reduce((sum, t) => sum + t.currentStreak, 0) / tasks.length)
      : 0;

    return { completed, total, completionRate, avgStreak };
  };

  const stats = getTodayStats();

  // 获取任务图标
  const getTaskIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.CheckCircle;
  };

  // 获取分类中文名
  const getCategoryName = (category: HealthTask['category']) => {
    const map = {
      fitness: '运动健身',
      nutrition: '饮食营养',
      medication: '用药提醒',
      monitoring: '健康监测',
      lifestyle: '生活习惯',
    };
    return map[category];
  };

  // 获取状态badge颜色
  const getStatusColor = (status: HealthTask['status']) => {
    switch (status) {
      case 'completed':
        return successColor;
      case 'in_progress':
        return primaryColor;
      case 'overdue':
        return errorColor;
      default:
        return textSecondaryColor;
    }
  };

  // 获取状态文本
  const getStatusText = (status: HealthTask['status']) => {
    const map = {
      pending: '待开始',
      in_progress: '进行中',
      completed: '已完成',
      overdue: '已逾期',
    };
    return map[status];
  };

  // 处理任务卡片操作
  const handleTaskAction = async (task: HealthTask) => {
    if (task.status === 'completed') {
      // 已完成，点击进入详情
      navigation.navigate('TaskDetail', { taskId: task.id });
    } else {
      // 未完成，标记为完成
      try {
        const success = await completeTask(task.id);
        if (success) {
          toast.show('任务已完成！', {
            message: '继续保持，养成健康好习惯！',
          });
          await loadTasks(); // 重新加载任务列表
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
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <TitleBar
          title="健康任务"
          actions={[{ icon: Plus, onPress: () => navigation.navigate('TaskForm') }]}
        />

        <RNScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5" gap="$2">
            {/* Stats Card */}
            <View borderRadius="$6" overflow="hidden">
              <LinearGradient
                colors={[primaryColor, accentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 16 }}
              >
                <YStack gap="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text fontSize="$3" color="rgba(255,255,255,0.8)">今日任务完成度</Text>
                      <XStack alignItems="baseline" gap="$2" marginTop="$1">
                        <Text fontSize="$9" fontWeight="bold" color="white">
                          {stats.completionRate}%
                        </Text>
                        <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                          {stats.completed}/{stats.total}
                        </Text>
                      </XStack>
                    </YStack>
                    <View
                      width={52}
                      height={52}
                      borderRadius={26}
                      backgroundColor="rgba(255,255,255,0.2)"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Target size={24} color="white" />
                    </View>
                  </XStack>

                  <XStack gap="$2">
                    <YStack flex={1}>
                      <Text fontSize="$2" color="rgba(255,255,255,0.8)">连续完成</Text>
                      <XStack alignItems="baseline" gap="$1" marginTop="$1">
                        <Text fontSize="$5" fontWeight="bold" color="white">
                          {stats.avgStreak}
                        </Text>
                        <Text fontSize="$2" color="rgba(255,255,255,0.8)">天</Text>
                      </XStack>
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize="$2" color="rgba(255,255,255,0.8)">总任务数</Text>
                      <XStack alignItems="baseline" gap="$1" marginTop="$1">
                        <Text fontSize="$5" fontWeight="bold" color="white">
                          {tasks.length}
                        </Text>
                        <Text fontSize="$2" color="rgba(255,255,255,0.8)">个</Text>
                      </XStack>
                    </YStack>
                  </XStack>
                </YStack>
              </LinearGradient>
            </View>

            {/* Filters */}
            <Card padding="$2" borderRadius="$6" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$2" alignItems="center">
                    <Filter size={16} color={textColor} />
                    <Text fontSize="$4" fontWeight="600" color="$color12">筛选</Text>
                  </XStack>
                  {showFilters ? (
                    <ChevronUp size={20} color={textSecondaryColor} />
                  ) : (
                    <ChevronDown size={20} color={textSecondaryColor} />
                  )}
                </XStack>
              </TouchableOpacity>

              {showFilters && (
                <YStack gap="$2" marginTop="$2">
                  {/* Category Filter */}
                  <YStack gap="$1">
                    <Text fontSize="$3" color="$color10">任务分类</Text>
                    <XStack gap="$1" flexWrap="wrap">
                      {['all', 'fitness', 'nutrition', 'medication', 'monitoring', 'lifestyle'].map(cat => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setCategoryFilter(cat)}
                        >
                          <View
                            paddingHorizontal="$2"
                            paddingVertical="$1.5"
                            borderRadius="$10"
                            backgroundColor={categoryFilter === cat ? '$primary' : '$color2'}
                            borderWidth={1}
                            borderColor={categoryFilter === cat ? '$primary' : '$color5'}
                            marginBottom="$1"
                          >
                            <Text
                              fontSize="$3"
                              color={categoryFilter === cat ? 'white' : '$color12'}
                              fontWeight={categoryFilter === cat ? '500' : 'normal'}
                            >
                              {cat === 'all' ? '全部' : getCategoryName(cat as any)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </XStack>
                  </YStack>

                  {/* Status Filter */}
                  <YStack gap="$1">
                    <Text fontSize="$3" color="$color10">任务状态</Text>
                    <XStack gap="$1" flexWrap="wrap">
                      {['all', 'pending', 'in_progress', 'completed', 'overdue'].map(status => (
                        <TouchableOpacity
                          key={status}
                          onPress={() => setStatusFilter(status)}
                        >
                          <View
                            paddingHorizontal="$2"
                            paddingVertical="$1.5"
                            borderRadius="$10"
                            backgroundColor={statusFilter === status ? '$primary' : '$color2'}
                            borderWidth={1}
                            borderColor={statusFilter === status ? '$primary' : '$color5'}
                            marginBottom="$1"
                          >
                            <Text
                              fontSize="$3"
                              color={statusFilter === status ? 'white' : '$color12'}
                              fontWeight={statusFilter === status ? '500' : 'normal'}
                            >
                              {status === 'all' ? '全部' : getStatusText(status as any)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </XStack>
                  </YStack>
                </YStack>
              )}
            </Card>

            {/* Task List */}
            <YStack gap="$2">
              {filteredTasks.length === 0 ? (
                <Card padding="$2" borderRadius="$6" backgroundColor="$color2" borderWidth={1} borderColor="$color5" alignItems="center">
                  <Award size={48} color={textSecondaryColor} />
                  <Text fontSize="$5" color="$color10" marginTop="$2" textAlign="center">
                    暂无任务
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('TaskForm')}>
                    <View
                      marginTop="$2"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$10"
                      backgroundColor="$primary"
                    >
                      <Text fontSize="$3" color="white" fontWeight="500">创建第一个任务</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              ) : (
                filteredTasks.map(task => {
                  const IconComponent = getTaskIcon(task.icon);
                  return (
                    <TouchableOpacity
                      key={task.id}
                      onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                      activeOpacity={0.7}
                    >
                      <Card
                        padding="$2"
                        borderRadius="$6"
                        backgroundColor="$color2"
                        borderWidth={1}
                        borderColor="$color5"
                        borderLeftWidth={4}
                        borderLeftColor={task.color}
                      >
                        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                          <XStack gap="$2" alignItems="center" flex={1}>
                            <View
                              width={40}
                              height={40}
                              borderRadius="$12"
                              backgroundColor={`${task.color}20`}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconComponent size={20} color={task.color} />
                            </View>
                            <YStack flex={1}>
                              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$0.5">
                                {task.title}
                              </Text>
                              <Text fontSize="$3" color="$color10" numberOfLines={1}>
                                {task.description || getCategoryName(task.category)}
                              </Text>
                            </YStack>
                          </XStack>
                          <View
                            paddingHorizontal="$2"
                            paddingVertical="$0.5"
                            borderRadius="$10"
                            backgroundColor={`${getStatusColor(task.status)}20`}
                          >
                            <Text fontSize="$1" color={getStatusColor(task.status)} fontWeight="500">
                              {getStatusText(task.status)}
                            </Text>
                          </View>
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack gap="$2">
                            {task.startTime && (
                              <XStack gap="$1" alignItems="center">
                                <Clock size={14} color={textSecondaryColor} />
                                <Text fontSize="$2" color="$color10">{task.startTime}</Text>
                              </XStack>
                            )}
                            <XStack gap="$1" alignItems="center">
                              <TrendingUp size={14} color={successColor} />
                              <Text fontSize="$2" color="$color10">
                                连续{task.currentStreak}天
                              </Text>
                            </XStack>
                          </XStack>
                          <TouchableOpacity onPress={() => handleTaskAction(task)}>
                            <View
                              paddingHorizontal="$3"
                              paddingVertical="$1.5"
                              borderRadius="$10"
                              backgroundColor={task.status === 'completed' ? successColor : primaryColor}
                            >
                              <Text fontSize="$2" color="white" fontWeight="500">
                                {task.status === 'completed' ? '查看' : task.status === 'in_progress' ? '继续' : '开始'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </XStack>

                        {/* Progress Bar for in_progress tasks */}
                        {task.status === 'in_progress' && task.progress > 0 && (
                          <YStack marginTop="$2" gap="$1">
                            <XStack justifyContent="space-between">
                              <Text fontSize="$2" color="$color10">进度</Text>
                              <Text fontSize="$2" color={task.color} fontWeight="500">
                                {task.progress}%
                              </Text>
                            </XStack>
                            <Progress value={task.progress} backgroundColor="$color5">
                              <Progress.Indicator backgroundColor={task.color} />
                            </Progress>
                          </YStack>
                        )}
                      </Card>
                    </TouchableOpacity>
                  );
                })
              )}
            </YStack>

            {/* Bottom padding */}
            <View height={20} />
          </YStack>
        </RNScrollView>
      </SafeAreaView>
    </Theme>
  );
};