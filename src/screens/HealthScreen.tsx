import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H4,
  ScrollView,
  useTheme,
  Paragraph,
} from 'tamagui';
import { Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Activity,
  Moon,
  Scale,
  CheckCircle,
  Settings,
  Droplets,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { HealthGuardianHero, FamilyMember } from '@/components/HealthGuardianHero';
import { HealthMetricCard } from '@/components/HealthMetricCard';
import { AIInsights, AIInsight } from '@/components/AIInsights';
import { HealthTrends } from '@/components/HealthTrends';
import { DeviceStatusOverview } from '@/components/DeviceStatusOverview';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
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
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [todayTasks, setTodayTasks] = useState<HealthTask[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<string>('self'); // 当前查看的家庭成员
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentMemberProfile, setCurrentMemberProfile] = useState<MemberHealthProfile | null>(null);
  const [devices, setDevices] = useState<HealthDevice[]>([]); // 设备列表（从主数据源获取）
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 获取当前成员信息
  const currentMember = familyMembers.find(m => m.id === currentMemberId) || familyMembers[0];

  // 加载家庭成员和当前成员数据
  useFocusEffect(
    React.useCallback(() => {
      loadFamilyData();
      loadTodayTasks();
      loadDevices();

      // 如果传入了memberId参数，切换到对应成员
      if (route.params?.memberId) {
        setCurrentMemberId(route.params.memberId);
        // 清除参数，避免重复触发
        navigation.setParams({ memberId: undefined });
      }
    }, [route.params?.memberId])
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

  // 获取任务颜色 - 使用主题功能色替代原有饱和色
  const getTaskThemeColor = (taskColor?: string, taskType?: string) => {
    // 根据任务类型或颜色映射到主题色
    // primary (accent9) - 主要任务
    // success (accent10) - 完成/健康相关
    // secondary (accent7) - 次要任务
    // warning (color9) - 提醒类任务
    if (!taskColor && !taskType) return theme.primary?.val;

    // 根据原有颜色关键字映射
    const colorLower = taskColor?.toLowerCase() || '';
    if (colorLower.includes('green') || colorLower.includes('10b981') || colorLower.includes('success')) {
      return theme.success?.val; // 深紫
    }
    if (colorLower.includes('blue') || colorLower.includes('3b82f6') || colorLower.includes('info')) {
      return theme.info?.val; // 主紫
    }
    if (colorLower.includes('yellow') || colorLower.includes('f59e0b') || colorLower.includes('orange') || colorLower.includes('warning')) {
      return theme.warning?.val; // 中灰
    }
    if (colorLower.includes('red') || colorLower.includes('ef4444') || colorLower.includes('error') || colorLower.includes('pink')) {
      return theme.error?.val; // 灰红（仅严重情况）
    }
    if (colorLower.includes('purple') || colorLower.includes('violet') || colorLower.includes('8b5cf6')) {
      return theme.primary?.val; // 主紫
    }

    // 默认使用主紫色
    return theme.primary?.val;
  };

  // 从设备获取健康指标数据 - 使用主题色
  const getHealthMetricsFromDevices = () => {
    if (!currentMemberProfile || !currentMemberProfile.devices) {
      return [];
    }

    // 主题色配置
    const themeColors = {
      success: theme.success?.val || '#10B981',
      primary: theme.primary?.val || '#6366F1',
      warning: theme.warning?.val || '#F59E0B',
      accent: theme.accent?.val || '#8B5CF6',
      error: theme.error?.val || '#EC4899',
    };

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
          status: latestEvent.status === 'normal' ? 'normal' : 'warning',
          trend: latestEvent.status === 'normal' ? 'stable' : 'warning',
          icon: "Scale",
          colorKey: "primary",
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
          status: latestEvent.status === 'normal' ? 'normal' : 'warning',
          trend: latestEvent.status === 'normal' ? 'stable' : 'warning',
          icon: "Heart",
          colorKey: "primary",
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
              status: event.status === 'normal' ? 'normal' : 'warning',
              trend: event.status === 'normal' ? 'stable' : 'warning',
              icon: "Activity",
              colorKey: "primary",
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
              status: event.status === 'normal' ? 'normal' : 'warning',
              trend: event.status === 'normal' ? 'stable' : 'warning',
              icon: "Moon",
              colorKey: "primary",
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
          status: latestEvent.status === 'normal' ? 'normal' : 'warning',
          trend: latestEvent.status === 'normal' ? 'stable' : 'warning',
          icon: "Droplets",
          colorKey: "primary",
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


  // 渐变背景颜色：左上浅绿 -> 右下暗紫
  const gradientColors = ['#d6dece', '#e8e6eb', theme.primary?.val || '#5B4A8C'] as const;

  // 显示加载状态
  if (isLoading) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View flex={1} justifyContent="center" alignItems="center">
            <Paragraph size="$5" color="$color10">加载中...</Paragraph>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <YStack padding="$2.5" gap="$2">
            {/* 开发调试：重置数据按钮（仅在数据异常时显示） */}
            {(!currentMember || !currentMemberProfile || familyMembers.length === 0) && (
              <Card padding="$2" borderRadius="$5" backgroundColor="$orange2" borderWidth={1} borderColor="$orange8">
                <YStack gap="$2">
                  <Text fontSize="$3" fontWeight="600" color="$orange11">
                    ⚠️ 检测到数据异常
                  </Text>
                  <Paragraph size="$2" color="$orange11">
                    可能是旧版本数据，点击下方按钮重置数据
                  </Paragraph>
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
                      paddingVertical="$2"
                      paddingHorizontal="$2"
                      borderRadius="$10"
                      alignItems="center"
                    >
                      <Text fontSize="$3" fontWeight="500" color="white">
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
              padding="$2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.08}
              shadowRadius={8}
              elevation={2}
            >
              {/* 标题 */}
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                <H4 color="$color12">
                  健康数据
                </H4>
              </XStack>

              {healthMetrics.length > 0 ? (
                <XStack gap="$1.5">
                  {/* 固定一行3个，每个卡片平分宽度 */}
                  {healthMetrics.slice(0, 3).map((metric, index) => (
                    <View key={index} flex={1} minWidth={0}>
                      <HealthMetricCard
                        title={metric.title}
                        value={metric.value}
                        unit={metric.unit}
                        change={metric.change}
                        status={metric.status as any}
                        trend={metric.trend}
                        icon={metric.icon as any}
                        colorKey={metric.colorKey}
                        device={metric.device}
                        onDevicePress={() => navigation.navigate('DeviceManagement', { deviceId: metric.device.id })}
                      />
                    </View>
                  ))}
                </XStack>
              ) : (
                <View paddingVertical="$2" alignItems="center">
                  <Settings size={48} color={theme.color9?.val} />
                  <Paragraph size="$4" color="$color10" marginTop="$2">
                    暂无健康数据，请添加设备
                  </Paragraph>
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

            {/* Today's Tasks - 仅在查看本人时显示 */}
            {currentMemberId === 'self' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('TaskList')}
                activeOpacity={0.9}
              >
                <Card
                  padding="$2"
                  borderRadius="$6"
                  borderWidth={1}
                  borderColor="$color5"
                  shadowColor="$shadowColor"
                  shadowOffset={{ width: 0, height: 8 }}
                  shadowOpacity={0.12}
                  shadowRadius={16}
                  elevation={4}
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <H4 color="$color12">
                      今日任务
                    </H4>
                    <XStack gap="$0.5" alignItems="center">
                      <Text fontSize="$3" color="$primary" fontWeight="500">查看全部</Text>
                      <ChevronRight size={14} color={theme.primary?.val} />
                    </XStack>
                  </XStack>

                  {todayTasks.length > 0 ? (
                    <YStack gap="$2">
                      {todayTasks.map((task) => {
                        const TaskIcon = getTaskIcon(task.icon);
                        const taskThemeColor = getTaskThemeColor(task.color);
                        return (
                          <TouchableOpacity
                            key={task.id}
                            onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                          >
                            <View
                              padding="$2"
                              borderRadius="$4"
                              backgroundColor="$color2"
                              borderWidth={1}
                              borderColor="$color5"
                              borderLeftWidth={3}
                              borderLeftColor={taskThemeColor}
                            >
                              <XStack gap="$2" alignItems="center">
                                <View
                                  width={36}
                                  height={36}
                                  borderRadius="$12"
                                  backgroundColor={`${taskThemeColor}20`}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <TaskIcon size={18} color={taskThemeColor} />
                                </View>
                                <YStack flex={1} gap="$1">
                                  <Text fontSize="$4" fontWeight="600" color="$color12">
                                    {task.title}
                                  </Text>
                                  {task.startTime && (
                                    <XStack gap="$1" alignItems="center">
                                      <Clock size={12} color={theme.color9?.val} />
                                      <Paragraph size="$2" color="$color10">
                                        {task.startTime}
                                      </Paragraph>
                                    </XStack>
                                  )}
                                </YStack>
                                <ChevronRight size={18} color={theme.color9?.val} />
                              </XStack>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </YStack>
                  ) : (
                    <View paddingVertical="$2" alignItems="center">
                      <CheckCircle size={48} color={theme.success?.val} />
                      <Paragraph size="$4" color="$color10" marginTop="$2">
                        今日任务已全部完成！
                      </Paragraph>
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
    </LinearGradient>
  );
};