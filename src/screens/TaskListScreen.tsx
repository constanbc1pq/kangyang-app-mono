import React, { useState, useEffect } from 'react';
import { Pressable, TouchableOpacity, ScrollView as RNScrollView } from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, H2, H3, Progress, Select } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useToastController } from '@tamagui/toast';
import {
  ArrowLeft,
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
import { COLORS } from '@/constants/app';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getTasks, completeTask } from '@/services/userDataService';
import { HealthTask } from '@/types/userData';
import * as Icons from 'lucide-react-native';

export const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const toast = useToastController();
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
        return COLORS.success;
      case 'in_progress':
        return COLORS.primary;
      case 'overdue':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
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
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="white"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <H2 fontSize="$7" fontWeight="bold" color="$text" marginLeft="$3" flex={1}>
            健康任务
          </H2>
          <TouchableOpacity onPress={() => navigation.navigate('TaskForm')}>
            <Plus size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </XStack>

        <RNScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" space="$4">
            {/* Stats Card */}
            <View borderRadius="$6" overflow="hidden">
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 20 }}
              >
                <YStack space="$3">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text fontSize="$3" color="rgba(255,255,255,0.8)">今日任务完成度</Text>
                      <XStack alignItems="baseline" space="$2" marginTop="$1">
                        <Text fontSize="$10" fontWeight="bold" color="white">
                          {stats.completionRate}%
                        </Text>
                        <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                          {stats.completed}/{stats.total}
                        </Text>
                      </XStack>
                    </YStack>
                    <View
                      width={60}
                      height={60}
                      borderRadius={30}
                      backgroundColor="rgba(255,255,255,0.2)"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Target size={28} color="white" />
                    </View>
                  </XStack>

                  <XStack space="$4">
                    <YStack flex={1}>
                      <Text fontSize="$2" color="rgba(255,255,255,0.8)">连续完成</Text>
                      <XStack alignItems="baseline" space="$1" marginTop="$1">
                        <Text fontSize="$6" fontWeight="bold" color="white">
                          {stats.avgStreak}
                        </Text>
                        <Text fontSize="$2" color="rgba(255,255,255,0.8)">天</Text>
                      </XStack>
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize="$2" color="rgba(255,255,255,0.8)">总任务数</Text>
                      <XStack alignItems="baseline" space="$1" marginTop="$1">
                        <Text fontSize="$6" fontWeight="bold" color="white">
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
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack space="$2" alignItems="center">
                    <Filter size={16} color={COLORS.text} />
                    <Text fontSize="$4" fontWeight="600" color="$text">筛选</Text>
                  </XStack>
                  {showFilters ? (
                    <ChevronUp size={20} color={COLORS.textSecondary} />
                  ) : (
                    <ChevronDown size={20} color={COLORS.textSecondary} />
                  )}
                </XStack>
              </TouchableOpacity>

              {showFilters && (
                <YStack space="$3" marginTop="$3">
                  {/* Category Filter */}
                  <YStack space="$2">
                    <Text fontSize="$3" color="$textSecondary">任务分类</Text>
                    <XStack space="$2" flexWrap="wrap">
                      {['all', 'fitness', 'nutrition', 'medication', 'monitoring', 'lifestyle'].map(cat => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setCategoryFilter(cat)}
                        >
                          <View
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$3"
                            backgroundColor={categoryFilter === cat ? COLORS.primary : '$surface'}
                            borderWidth={1}
                            borderColor={categoryFilter === cat ? COLORS.primary : '$borderColor'}
                            marginBottom="$2"
                          >
                            <Text
                              fontSize="$3"
                              color={categoryFilter === cat ? 'white' : '$text'}
                              fontWeight={categoryFilter === cat ? '600' : 'normal'}
                            >
                              {cat === 'all' ? '全部' : getCategoryName(cat as any)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </XStack>
                  </YStack>

                  {/* Status Filter */}
                  <YStack space="$2">
                    <Text fontSize="$3" color="$textSecondary">任务状态</Text>
                    <XStack space="$2" flexWrap="wrap">
                      {['all', 'pending', 'in_progress', 'completed', 'overdue'].map(status => (
                        <TouchableOpacity
                          key={status}
                          onPress={() => setStatusFilter(status)}
                        >
                          <View
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$3"
                            backgroundColor={statusFilter === status ? COLORS.primary : '$surface'}
                            borderWidth={1}
                            borderColor={statusFilter === status ? COLORS.primary : '$borderColor'}
                            marginBottom="$2"
                          >
                            <Text
                              fontSize="$3"
                              color={statusFilter === status ? 'white' : '$text'}
                              fontWeight={statusFilter === status ? '600' : 'normal'}
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
            <YStack space="$3">
              {filteredTasks.length === 0 ? (
                <Card padding="$6" borderRadius="$4" backgroundColor="$surface" alignItems="center">
                  <Award size={48} color={COLORS.textSecondary} />
                  <Text fontSize="$5" color="$textSecondary" marginTop="$3" textAlign="center">
                    暂无任务
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('TaskForm')}>
                    <View
                      marginTop="$4"
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$3"
                      backgroundColor={COLORS.primary}
                    >
                      <Text fontSize="$3" color="white" fontWeight="600">创建第一个任务</Text>
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
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$surface"
                        borderLeftWidth={4}
                        borderLeftColor={task.color}
                      >
                        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                          <XStack space="$3" alignItems="center" flex={1}>
                            <View
                              width={44}
                              height={44}
                              borderRadius={22}
                              backgroundColor={`${task.color}20`}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconComponent size={22} color={task.color} />
                            </View>
                            <YStack flex={1}>
                              <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                                {task.title}
                              </Text>
                              <Text fontSize="$3" color="$textSecondary" numberOfLines={1}>
                                {task.description || getCategoryName(task.category)}
                              </Text>
                            </YStack>
                          </XStack>
                          <View
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                            backgroundColor={`${getStatusColor(task.status)}20`}
                          >
                            <Text fontSize="$1" color={getStatusColor(task.status)} fontWeight="600">
                              {getStatusText(task.status)}
                            </Text>
                          </View>
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack space="$4">
                            {task.startTime && (
                              <XStack space="$1" alignItems="center">
                                <Clock size={14} color={COLORS.textSecondary} />
                                <Text fontSize="$2" color="$textSecondary">{task.startTime}</Text>
                              </XStack>
                            )}
                            <XStack space="$1" alignItems="center">
                              <TrendingUp size={14} color={COLORS.success} />
                              <Text fontSize="$2" color="$textSecondary">
                                连续{task.currentStreak}天
                              </Text>
                            </XStack>
                          </XStack>
                          <TouchableOpacity onPress={() => handleTaskAction(task)}>
                            <View
                              paddingHorizontal="$3"
                              paddingVertical="$2"
                              borderRadius="$3"
                              backgroundColor={task.status === 'completed' ? COLORS.success : COLORS.primary}
                            >
                              <Text fontSize="$2" color="white" fontWeight="600">
                                {task.status === 'completed' ? '查看' : task.status === 'in_progress' ? '继续' : '开始'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </XStack>

                        {/* Progress Bar for in_progress tasks */}
                        {task.status === 'in_progress' && task.progress > 0 && (
                          <YStack marginTop="$3" space="$1">
                            <XStack justifyContent="space-between">
                              <Text fontSize="$2" color="$textSecondary">进度</Text>
                              <Text fontSize="$2" color={task.color} fontWeight="600">
                                {task.progress}%
                              </Text>
                            </XStack>
                            <Progress value={task.progress} backgroundColor="$borderColor">
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