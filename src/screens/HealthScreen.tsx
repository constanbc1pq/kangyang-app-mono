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
  CheckCircle,
  Settings,
  Bell,
  Droplets,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { HealthGuardianHero, FamilyMember } from '@/components/HealthGuardianHero';
import { HealthMetricCard } from '@/components/HealthMetricCard';
import { AIInsights, AIInsight } from '@/components/AIInsights';
import { HealthTrends } from '@/components/HealthTrends';
import { DeviceStatusOverview } from '@/components/DeviceStatusOverview';
import { COLORS } from '@/constants/app';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getTodayTasks,
  getFamilyMembers,
  getMemberHealthProfile,
  getMemberAIInsights,
  getMemberDevices,
  getDevices,
  clearUserData,
} from '@/services/userDataService';
import { HealthTask, MemberHealthProfile, FamilyMember as FamilyMemberType, HealthDevice } from '@/types/userData';
import * as Icons from 'lucide-react-native';

export const HealthScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [todayTasks, setTodayTasks] = useState<HealthTask[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<string>('self'); // 当前查看的家庭成员
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentMemberProfile, setCurrentMemberProfile] = useState<MemberHealthProfile | null>(null);
  const [devices, setDevices] = useState<HealthDevice[]>([]); // 设备列表（从主数据源获取）
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<any>();

  // 获取当前成员信息
  const currentMember = familyMembers.find(m => m.id === currentMemberId) || familyMembers[0];

  // 加载家庭成员和当前成员数据
  useFocusEffect(
    React.useCallback(() => {
      loadFamilyData();
      loadTodayTasks();
      loadDevices();
    }, [])
  );

  // 加载设备列表
  const loadDevices = async () => {
    try {
      const deviceList = await getDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error('加载设备数据失败:', error);
    }
  };

  // 当切换家庭成员时，重新加载该成员的健康数据
  React.useEffect(() => {
    if (familyMembers.length > 0) {
      loadMemberHealthData(currentMemberId);
    }
  }, [currentMemberId]);

  // 加载家庭成员列表
  const loadFamilyData = async () => {
    try {
      const members = await getFamilyMembers();
      // 转换为 HealthGuardianHero 组件需要的格式
      const formattedMembers: FamilyMember[] = members.map(member => ({
        id: member.id,
        name: member.name,
        relationship: member.relationship,
        healthStatus: member.healthProfile.healthStatus,
        avatar: member.avatar,
      }));
      setFamilyMembers(formattedMembers);

      // 加载第一个成员的数据
      if (members.length > 0) {
        await loadMemberHealthData(currentMemberId);
      }
    } catch (error) {
      console.error('加载家庭成员数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载指定成员的健康数据
  const loadMemberHealthData = async (memberId: string) => {
    try {
      const profile = await getMemberHealthProfile(memberId);
      setCurrentMemberProfile(profile);
    } catch (error) {
      console.error('加载成员健康数据失败:', error);
    }
  };

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

  // 从设备获取健康指标数据
  const getHealthMetricsFromDevices = () => {
    if (!currentMemberProfile || !currentMemberProfile.devices) {
      return [];
    }

    // 将设备数据转换为健康指标卡片格式
    const metrics: any[] = [];

    currentMemberProfile.devices.forEach(device => {
      // 根据设备类型提取不同的健康指标
      if (device.type === 'smart-toilet' && device.events.length > 0) {
        const latestEvent = device.events[0];
        metrics.push({
          title: "体重",
          value: latestEvent.value,
          unit: latestEvent.unit || "kg",
          change: latestEvent.status === 'normal' ? '正常' : '需关注',
          trend: latestEvent.status === 'normal' ? 'stable' : 'warning',
          icon: "Scale",
          color: "#10B981",
          bgColor: "rgba(16, 185, 129, 0.1)",
          device: {
            id: device.id.toString(),
            name: device.name,
            icon: "🚽",
            lastSync: device.lastSync,
            status: device.status,
          },
        });
      }

      if (device.type === 'blood-pressure' && device.events.length > 0) {
        const latestEvent = device.events[0];
        metrics.push({
          title: "血压",
          value: latestEvent.value,
          unit: latestEvent.unit || "mmHg",
          change: latestEvent.status === 'normal' ? '正常' : '需关注',
          trend: latestEvent.status === 'normal' ? 'stable' : 'warning',
          icon: "Heart",
          color: "#6366F1",
          bgColor: "rgba(99, 102, 241, 0.1)",
          device: {
            id: device.id.toString(),
            name: device.name,
            icon: "💉",
            lastSync: device.lastSync,
            status: device.status,
          },
        });
      }

      if (device.type === 'smartwatch' && device.events.length > 0) {
        // 手表可能有多个数据
        device.events.forEach(event => {
          if (event.type === '心率') {
            metrics.push({
              title: "心率",
              value: event.value,
              unit: event.unit || "bpm",
              change: event.status === 'normal' ? '正常' : '需关注',
              trend: event.status === 'normal' ? 'stable' : 'warning',
              icon: "Activity",
              color: "#F59E0B",
              bgColor: "rgba(245, 158, 11, 0.1)",
              device: {
                id: device.id.toString(),
                name: device.name,
                icon: "⌚",
                lastSync: device.lastSync,
                status: device.status,
              },
            });
          } else if (event.type === '睡眠') {
            metrics.push({
              title: "睡眠",
              value: event.value,
              unit: event.unit || "小时",
              change: event.status === 'normal' ? '优质' : '需改善',
              trend: event.status === 'normal' ? 'stable' : 'warning',
              icon: "Moon",
              color: "#8B5CF6",
              bgColor: "rgba(139, 92, 246, 0.1)",
              device: {
                id: device.id.toString(),
                name: device.name,
                icon: "⌚",
                lastSync: device.lastSync,
                status: device.status,
              },
            });
          }
        });
      }

      if (device.type === 'glucose-meter' && device.events.length > 0) {
        const latestEvent = device.events[0];
        metrics.push({
          title: "血糖",
          value: latestEvent.value,
          unit: latestEvent.unit || "mmol/L",
          change: latestEvent.status === 'normal' ? '正常' : '需关注',
          trend: latestEvent.status === 'normal' ? 'stable' : 'warning',
          icon: "Droplets",
          color: "#EC4899",
          bgColor: "rgba(236, 72, 153, 0.1)",
          device: {
            id: device.id.toString(),
            name: device.name,
            icon: "💉",
            lastSync: device.lastSync,
            status: device.status,
          },
        });
      }
    });

    return metrics.slice(0, 4); // 只显示前4个指标
  };

  const healthMetrics = getHealthMetricsFromDevices();

  // 从成员健康档案获取AI洞察
  const getAIInsightsFromProfile = (): AIInsight[] => {
    if (!currentMemberProfile || !currentMemberProfile.aiInsights) {
      return [];
    }

    return currentMemberProfile.aiInsights.map(insight => ({
      id: insight.id,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      action: {
        label: insight.type === 'warning' ? '去检查' : '查看详情',
        onPress: () => navigation.navigate('HealthReport'),
      },
    }));
  };

  const aiInsights: AIInsight[] = getAIInsightsFromProfile();

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '$red10';
      case 'down': return '$green10';
      default: return '$blue10';
    }
  };


  // 显示加载状态
  if (isLoading) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
          <View flex={1} justifyContent="center" alignItems="center">
            <Text fontSize="$5" color="$textSecondary">加载中...</Text>
          </View>
        </SafeAreaView>
      </Theme>
    );
  }

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <YStack padding="$4" space="$4">
            {/* 开发调试：重置数据按钮（仅在数据异常时显示） */}
            {(!currentMember || !currentMemberProfile || familyMembers.length === 0) && (
              <Card padding="$3" borderRadius="$4" backgroundColor="$orange2" borderWidth={1} borderColor="$orange8">
                <YStack space="$2">
                  <Text fontSize="$3" fontWeight="600" color="$orange11">
                    ⚠️ 检测到数据异常
                  </Text>
                  <Text fontSize="$2" color="$orange11">
                    可能是旧版本数据，点击下方按钮重置数据
                  </Text>
                  <Pressable
                    onPress={async () => {
                      await clearUserData();
                      // 重新加载数据
                      await loadFamilyData();
                      await loadTodayTasks();
                    }}
                  >
                    <View
                      backgroundColor="$orange9"
                      padding="$2"
                      borderRadius="$3"
                      alignItems="center"
                    >
                      <Text fontSize="$3" fontWeight="600" color="white">
                        重置并重新加载数据
                      </Text>
                    </View>
                  </Pressable>
                </YStack>
              </Card>
            )}

            {/* 智能健康守护中心 - Hero区 */}
            {currentMember && currentMemberProfile && (
              <HealthGuardianHero
                userName={currentMember.name}
                healthScore={currentMemberProfile.healthScore}
                aiInterpretation={currentMemberProfile.aiInterpretation || '暂无AI健康解读'}
                aiSuggestion={currentMemberProfile.aiSuggestion || '保持良好的生活习惯'}
                currentMemberId={currentMemberId}
                familyMembers={familyMembers}
                onReportPress={() => navigation.navigate('HealthReport')}
                onAIConsultPress={() => navigation.navigate('AIConsultation')}
                onMemberChange={(memberId) => {
                  setCurrentMemberId(memberId);
                  console.log('切换到家庭成员:', memberId);
                  // 数据会通过 useEffect 自动加载
                }}
              />
            )}

            {/* 健康指标卡片（带设备标签） */}
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
              {/* 标题和设备管理入口 */}
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                <H3 fontSize="$6" color="$text" fontWeight="600">
                  健康数据
                </H3>
                <Pressable onPress={() => navigation.navigate('DeviceManagement')}>
                  <XStack space="$2" alignItems="center">
                    <Settings size={16} color={COLORS.primary} />
                    <Text fontSize="$3" color="$primary" fontWeight="600">
                      管理设备
                    </Text>
                  </XStack>
                </Pressable>
              </XStack>

              {healthMetrics.length > 0 ? (
                <YStack space="$3">
                  {/* First row - 2 metrics */}
                  <XStack space="$3">
                    {healthMetrics.slice(0, 2).map((metric, index) => (
                      <HealthMetricCard
                        key={index}
                        title={metric.title}
                        value={metric.value}
                        unit={metric.unit}
                        change={metric.change}
                        trend={metric.trend}
                        icon={metric.icon as any}
                        color={metric.color}
                        bgColor={metric.bgColor}
                        device={metric.device}
                        onDevicePress={() => navigation.navigate('DeviceManagement', { deviceId: metric.device.id })}
                      />
                    ))}
                  </XStack>

                  {/* Second row - 2 metrics */}
                  {healthMetrics.length > 2 && (
                    <XStack space="$3">
                      {healthMetrics.slice(2, 4).map((metric, index) => (
                        <HealthMetricCard
                          key={index + 2}
                          title={metric.title}
                          value={metric.value}
                          unit={metric.unit}
                          change={metric.change}
                          trend={metric.trend}
                          icon={metric.icon as any}
                          color={metric.color}
                          bgColor={metric.bgColor}
                          device={metric.device}
                          onDevicePress={() => navigation.navigate('DeviceManagement', { deviceId: metric.device.id })}
                        />
                      ))}
                    </XStack>
                  )}
                </YStack>
              ) : (
                <View paddingVertical="$4" alignItems="center">
                  <Settings size={48} color={COLORS.textSecondary} />
                  <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                    暂无健康数据，请添加设备
                  </Text>
                </View>
              )}
            </Card>

            {/* AI健康洞察 */}
            {aiInsights.length > 0 && <AIInsights insights={aiInsights} />}

            {/* 设备状态快览 */}
            <DeviceStatusOverview
              devices={devices}
              onAddDevice={() => navigation.navigate('DeviceManagement')}
              onDevicePress={(deviceId) => {
                console.log('点击设备:', deviceId);
                navigation.navigate('DeviceManagement', { deviceId });
              }}
              onManageDevices={() => navigation.navigate('DeviceManagement')}
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

            {/* Today's Tasks - 仅在查看本人时显示 */}
            {currentMemberId === 'self' && (
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
            )}

            {/* Bottom padding for safe area */}
            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};