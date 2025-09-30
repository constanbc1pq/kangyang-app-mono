import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H1,
  H2,
  H3,
  Theme,
  ScrollView,
  Progress,
} from 'tamagui';
import { Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Activity,
  Moon,
  Scale,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Bell,
  Droplets,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { AIHealthAssistant } from '@/components/AIHealthAssistant';
import { HealthTrends } from '@/components/HealthTrends';
import { DeviceManager } from '@/components/DeviceManager';
import { COLORS } from '@/constants/app';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getTodayTasks } from '@/services/userDataService';
import { HealthTask } from '@/types/userData';
import * as Icons from 'lucide-react-native';

export const HealthScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [todayTasks, setTodayTasks] = useState<HealthTask[]>([]);
  const navigation = useNavigation<any>();

  const healthScore = 92;

  // 加载今日任务
  useFocusEffect(
    React.useCallback(() => {
      loadTodayTasks();
    }, [])
  );

  const loadTodayTasks = async () => {
    try {
      const tasks = await getTodayTasks();
      // 只取前3个未完成的任务
      const incompleteTasks = tasks.filter(t => t.status !== 'completed').slice(0, 3);
      setTodayTasks(incompleteTasks);
    } catch (error) {
      console.error('加载今日任务失败:', error);
    }
  };

  const getTaskIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.CheckCircle;
  };

  const healthMetrics = [
    {
      title: "体重",
      value: "68.5",
      unit: "kg",
      change: "-0.5",
      trend: "down",
      icon: Scale,
      color: "#10B981", // Emerald
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "血压",
      value: "120/80",
      unit: "mmHg",
      change: "正常",
      trend: "stable",
      icon: Heart,
      color: "#6366F1", // Indigo
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      title: "心率",
      value: "72",
      unit: "bpm",
      change: "+2",
      trend: "up",
      icon: Activity,
      color: "#F59E0B", // Amber
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: "睡眠",
      value: "7.5",
      unit: "小时",
      change: "优质",
      trend: "stable",
      icon: Moon,
      color: "#8B5CF6", // Violet
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      title: "血糖",
      value: "5.6",
      unit: "mmol/L",
      change: "正常",
      trend: "stable",
      icon: Droplets,
      color: "#06B6D4", // Cyan
      bgColor: "rgba(6, 182, 212, 0.1)",
    },
    {
      title: "步数",
      value: "8,543",
      unit: "步",
      change: "已达标",
      trend: "up",
      icon: Zap,
      color: "#EF4444", // Red
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
  ];

  const recentAlerts = [
    {
      type: "warning",
      message: "血压略高于正常范围，建议减少盐分摄入",
      time: "2小时前",
    },
    {
      type: "info",
      message: "今日步数已达标，继续保持！",
      time: "4小时前",
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '$red10';
      case 'down': return '$green10';
      default: return '$blue10';
    }
  };


  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <YStack padding="$4" space="$4">
            {/* Greeting Section */}
            <YStack space="$2" marginBottom="$4">
              <H1 fontSize="$9" fontWeight="bold" color="$text">
                早安，王先生
              </H1>
              <Text fontSize="$4" color="$textSecondary">
                让我们开始今天的健康之旅
              </Text>
            </YStack>

            {/* Health Score Card */}
            <View borderRadius="$6" overflow="hidden">
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 24,
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 15,
                  elevation: 8,
                }}
              >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <H2 fontSize="$11" fontWeight="bold" color="white" marginBottom="$1">
                    {healthScore}分
                  </H2>
                  <Text fontSize="$4" color="rgba(255,255,255,0.8)">
                    健康状态良好
                  </Text>
                </YStack>
                <View
                  width={64}
                  height={64}
                  borderRadius={32}
                  borderWidth={4}
                  borderColor="rgba(255,255,255,0.3)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Heart size={32} color="white" />
                </View>
              </XStack>
              <YStack marginTop="$4">
                <Progress value={healthScore} backgroundColor="rgba(255,255,255,0.2)">
                  <Progress.Indicator backgroundColor="white" />
                </Progress>
              </YStack>
              </LinearGradient>
            </View>

            {/* Health Metrics Grid */}
            <YStack space="$3">
              {/* First row - 2 metrics */}
              <XStack space="$3">
                {healthMetrics.slice(0, 2).map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card
                      key={index}
                      flex={1}
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$cardBg"
                      pressStyle={{ scale: 0.98 }}
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={8}
                      elevation={4}
                    >
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                        <View
                          width={40}
                          height={40}
                          borderRadius={20}
                          backgroundColor={metric.bgColor}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={20} color={metric.color} />
                        </View>
                        <View
                          backgroundColor={metric.color}
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$1" color="white" fontWeight="500">
                            {metric.change}
                          </Text>
                        </View>
                      </XStack>
                      <YStack>
                        <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                          {metric.title}
                        </Text>
                        <XStack alignItems="baseline">
                          <Text fontSize="$6" fontWeight="bold" color="$text">
                            {metric.value}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary" marginLeft="$1">
                            {metric.unit}
                          </Text>
                        </XStack>
                      </YStack>
                    </Card>
                  );
                })}
              </XStack>

              {/* Second row - 2 metrics */}
              <XStack space="$3">
                {healthMetrics.slice(2, 4).map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card
                      key={index + 2}
                      flex={1}
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$cardBg"
                      pressStyle={{ scale: 0.98 }}
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={8}
                      elevation={4}
                    >
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                        <View
                          width={40}
                          height={40}
                          borderRadius={20}
                          backgroundColor={metric.bgColor}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={20} color={metric.color} />
                        </View>
                        <View
                          backgroundColor={metric.color}
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$1" color="white" fontWeight="500">
                            {metric.change}
                          </Text>
                        </View>
                      </XStack>
                      <YStack>
                        <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                          {metric.title}
                        </Text>
                        <XStack alignItems="baseline">
                          <Text fontSize="$6" fontWeight="bold" color="$text">
                            {metric.value}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary" marginLeft="$1">
                            {metric.unit}
                          </Text>
                        </XStack>
                      </YStack>
                    </Card>
                  );
                })}
              </XStack>

              {/* Third row - 2 metrics */}
              <XStack space="$3">
                {healthMetrics.slice(4, 6).map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card
                      key={index + 4}
                      flex={1}
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$cardBg"
                      pressStyle={{ scale: 0.98 }}
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={8}
                      elevation={4}
                    >
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                        <View
                          width={40}
                          height={40}
                          borderRadius={20}
                          backgroundColor={metric.bgColor}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={20} color={metric.color} />
                        </View>
                        <View
                          backgroundColor={metric.color}
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$1" color="white" fontWeight="500">
                            {metric.change}
                          </Text>
                        </View>
                      </XStack>
                      <YStack>
                        <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                          {metric.title}
                        </Text>
                        <XStack alignItems="baseline">
                          <Text fontSize="$6" fontWeight="bold" color="$text">
                            {metric.value}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary" marginLeft="$1">
                            {metric.unit}
                          </Text>
                        </XStack>
                      </YStack>
                    </Card>
                  );
                })}
              </XStack>
            </YStack>

            {/* AI Health Assistant */}
            <AIHealthAssistant
              onReportPress={() => navigation.navigate('HealthReport')}
              onConsultPress={() => navigation.navigate('AIConsultation')}
            />

            {/* Health Trends */}
            <HealthTrends
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />

            {/* Quick Actions */}
            <Card
              padding="$4"
              borderRadius="$4"
              backgroundColor="$surface"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                <H3 fontSize="$6" color="$text" fontWeight="600">
                  快捷功能
                </H3>
                <Pressable>
                  <View paddingHorizontal="$3" paddingVertical="$2">
                    <XStack space="$1" alignItems="center">
                      <Plus size={16} color={COLORS.primary} />
                      <Text fontSize="$3" color="$primary">添加</Text>
                    </XStack>
                  </View>
                </Pressable>
              </XStack>
              <XStack space="$3">
                <XStack flex={1} space="$3">
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('DeviceManagement')}
                  >
                    <View
                      flex={1}
                      height={70}
                      borderWidth={1}
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      borderRadius="$4"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Settings size={20} color={COLORS.primary} />
                      <Text fontSize="$2" color="$text" marginTop="$1">设备管理</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('HealthReport')}
                  >
                    <View
                      flex={1}
                      height={70}
                      borderWidth={1}
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      borderRadius="$4"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TrendingUp size={20} color={COLORS.secondary} />
                      <Text fontSize="$2" color="$text" marginTop="$1">健康报告</Text>
                    </View>
                  </Pressable>
                </XStack>
              </XStack>
              <XStack space="$3" marginTop="$3">
                <XStack flex={1} space="$3">
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('AIConsultation')}
                  >
                    <View
                      flex={1}
                      height={70}
                      borderWidth={1}
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      borderRadius="$4"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Heart size={20} color={COLORS.error} />
                      <Text fontSize="$2" color="$text" marginTop="$1">AI问诊</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('MedicationReminder')}
                  >
                    <View
                      flex={1}
                      height={70}
                      borderWidth={1}
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      borderRadius="$4"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Bell size={20} color={COLORS.warning} />
                      <Text fontSize="$2" color="$text" marginTop="$1">用药提醒</Text>
                    </View>
                  </Pressable>
                </XStack>
              </XStack>
            </Card>

            {/* Today's Tasks */}
            <TouchableOpacity
              onPress={() => navigation.navigate('TaskList')}
              activeOpacity={0.9}
            >
              <Card
                padding="$4"
                borderRadius="$4"
                backgroundColor="$surface"
                shadowColor="$shadow"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={4}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                  <H3 fontSize="$6" color="$text" fontWeight="600">
                    今日任务
                  </H3>
                  <XStack space="$2" alignItems="center">
                    <Text fontSize="$3" color="$primary">查看全部</Text>
                    <ChevronRight size={16} color={COLORS.primary} />
                  </XStack>
                </XStack>

                {todayTasks.length > 0 ? (
                  <YStack space="$3">
                    {todayTasks.map((task) => {
                      const TaskIcon = getTaskIcon(task.icon);
                      return (
                        <TouchableOpacity
                          key={task.id}
                          onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                        >
                          <View
                            padding="$3"
                            borderRadius="$3"
                            backgroundColor="$background"
                            borderLeftWidth={3}
                            borderLeftColor={task.color}
                          >
                            <XStack space="$3" alignItems="center">
                              <View
                                width={36}
                                height={36}
                                borderRadius={18}
                                backgroundColor={`${task.color}20`}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <TaskIcon size={18} color={task.color} />
                              </View>
                              <YStack flex={1}>
                                <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                                  {task.title}
                                </Text>
                                {task.startTime && (
                                  <XStack space="$1" alignItems="center">
                                    <Clock size={12} color={COLORS.textSecondary} />
                                    <Text fontSize="$2" color="$textSecondary">
                                      {task.startTime}
                                    </Text>
                                  </XStack>
                                )}
                              </YStack>
                              <ChevronRight size={18} color={COLORS.textSecondary} />
                            </XStack>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </YStack>
                ) : (
                  <View paddingVertical="$4" alignItems="center">
                    <CheckCircle size={48} color={COLORS.success} />
                    <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                      今日任务已全部完成！
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>

            {/* Recent Alerts */}
            {recentAlerts.length > 0 && (
              <Card
                padding="$4"
                borderRadius="$4"
                backgroundColor="$surface"
                shadowColor="$shadow"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={4}
              >
                <XStack space="$2" alignItems="center" marginBottom="$4">
                  <AlertTriangle size={20} color={COLORS.warning} />
                  <H3 fontSize="$6" color="$text" fontWeight="600">
                    健康提醒
                  </H3>
                </XStack>
                <YStack space="$3">
                  {recentAlerts.map((alert, index) => (
                    <XStack key={index} space="$3" alignItems="flex-start">
                      <View
                        width={8}
                        height={8}
                        borderRadius={4}
                        backgroundColor={alert.type === "warning" ? "$orange10" : "$blue10"}
                        marginTop="$1"
                      />
                      <YStack flex={1}>
                        <Text fontSize="$3" color="$text" lineHeight="$1">
                          {alert.message}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                          {alert.time}
                        </Text>
                      </YStack>
                    </XStack>
                  ))}
                </YStack>
              </Card>
            )}

            {/* Device Manager */}
            <DeviceManager onManageDevices={() => navigation.navigate('DeviceManagement')} />

            {/* Bottom padding for safe area */}
            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};