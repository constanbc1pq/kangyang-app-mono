/**
 * 个性化健康计划界面
 * Health Plan Screen
 *
 * Phase 24.3: 个性化健康计划
 * - 计划类型选择（减重/慢病管理/术后康复/备孕/抗衰老）
 * - 计划概览卡片
 * - 目标设置区域
 * - 计划详情展示（饮食/运动/用药/生活方式）
 * - 里程碑记录
 * - 医生点评区域
 * - 打卡记录功能
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  Award,
  MessageSquare,
  Plus,
  Edit3,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

type PlanType = 'weight_loss' | 'chronic_disease' | 'post_surgery' | 'pregnancy' | 'anti_aging';

interface HealthGoal {
  id: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  progress: number;
}

interface PlanDetail {
  diet: string[];
  exercise: string[];
  medication: string[];
  lifestyle: string[];
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  isCompleted: boolean;
  completedDate?: string;
  reward?: string;
}

interface DoctorComment {
  id: string;
  date: string;
  doctorName: string;
  content: string;
  rating: 'excellent' | 'good' | 'needsImprovement';
}

interface CheckInRecord {
  id: string;
  date: string;
  metrics: { name: string; value: number; unit: string }[];
  notes?: string;
}

interface HealthPlan {
  id: string;
  type: PlanType;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  goals: HealthGoal[];
  details: PlanDetail;
  milestones: Milestone[];
  doctorComments: DoctorComment[];
  checkInRecords: CheckInRecord[];
  doctorName: string;
}

const PLAN_TYPES = [
  { id: 'weight_loss', label: '减重计划', icon: '🏃', color: '#FF9800' },
  { id: 'chronic_disease', label: '慢病管理', icon: '💊', color: '#2196F3' },
  { id: 'post_surgery', label: '术后康复', icon: '🏥', color: '#4CAF50' },
  { id: 'pregnancy', label: '备孕调理', icon: '👶', color: '#E91E63' },
  { id: 'anti_aging', label: '抗衰老', icon: '✨', color: '#9C27B0' },
];

const MOCK_PLAN: HealthPlan = {
  id: 'plan_001',
  type: 'weight_loss',
  title: '3个月健康减重计划',
  description: '通过科学饮食和适度运动，实现健康减重目标',
  startDate: '2024-11-01',
  endDate: '2025-02-01',
  status: 'active',
  progress: 45,
  goals: [
    {
      id: 'g1',
      metric: '体重',
      currentValue: 75,
      targetValue: 68,
      unit: 'kg',
      deadline: '2025-02-01',
      progress: 42,
    },
    {
      id: 'g2',
      metric: 'BMI',
      currentValue: 26.5,
      targetValue: 24,
      unit: '',
      deadline: '2025-02-01',
      progress: 45,
    },
    {
      id: 'g3',
      metric: '体脂率',
      currentValue: 28,
      targetValue: 22,
      unit: '%',
      deadline: '2025-02-01',
      progress: 40,
    },
  ],
  details: {
    diet: [
      '每日摄入1500-1800千卡',
      '早餐：全麦面包+鸡蛋+牛奶',
      '午餐：糙米饭+瘦肉+蔬菜',
      '晚餐：蔬菜沙拉+鸡胸肉',
      '加餐：水果或坚果（少量）',
      '多喝水，每日2000ml以上',
    ],
    exercise: [
      '每周5次有氧运动，每次40分钟',
      '周一三五：慢跑或快走',
      '周二四：游泳或骑行',
      '每周2次力量训练（周三、周六）',
      '每日拉伸10分钟',
    ],
    medication: [],
    lifestyle: [
      '每晚23:00前入睡，保证7-8小时睡眠',
      '戒零食、戒夜宵',
      '少油少盐少糖',
      '记录每日饮食和运动',
      '每周称重1次',
    ],
  },
  milestones: [
    {
      id: 'm1',
      title: '减重3kg',
      targetDate: '2024-11-20',
      isCompleted: true,
      completedDate: '2024-11-18',
      reward: '奖励一次按摩服务',
    },
    {
      id: 'm2',
      title: '减重5kg',
      targetDate: '2024-12-10',
      isCompleted: false,
    },
    {
      id: 'm3',
      title: '达到目标体重68kg',
      targetDate: '2025-02-01',
      isCompleted: false,
      reward: '专业体能评估一次',
    },
  ],
  doctorComments: [
    {
      id: 'c1',
      date: '2024-11-20',
      doctorName: '张伟医生',
      content: '进展很好！体重下降稳定，继续保持。建议增加蛋白质摄入，每餐保证有优质蛋白。',
      rating: 'excellent',
    },
    {
      id: 'c2',
      date: '2024-11-01',
      doctorName: '张伟医生',
      content: '计划开始，目标清晰，执行力要跟上。建议每周至少打卡5次。',
      rating: 'good',
    },
  ],
  checkInRecords: [
    {
      id: 'ci1',
      date: '2024-11-20',
      metrics: [
        { name: '体重', value: 75, unit: 'kg' },
        { name: '体脂率', value: 27, unit: '%' },
      ],
      notes: '今天运动1小时，感觉良好',
    },
    {
      id: 'ci2',
      date: '2024-11-13',
      metrics: [
        { name: '体重', value: 76.5, unit: 'kg' },
        { name: '体脂率', value: 27.5, unit: '%' },
      ],
      notes: '本周坚持运动4次',
    },
  ],
  doctorName: '张伟',
};

const HealthPlanScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [plan] = useState<HealthPlan>(MOCK_PLAN);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const planTypeInfo = PLAN_TYPES.find((t) => t.id === plan.type);

  const handleCheckIn = () => {
    Alert.alert('打卡成功', '今日数据已记录');
    setShowCheckInModal(false);
  };

  const getRatingColor = (rating: string) => {
    const colors = {
      excellent: '#4CAF50',
      good: '#2196F3',
      needsImprovement: '#FF9800',
    };
    return colors[rating as keyof typeof colors] || '#999';
  };

  const getRatingLabel = (rating: string) => {
    const labels = {
      excellent: '优秀',
      good: '良好',
      needsImprovement: '需改进',
    };
    return labels[rating as keyof typeof labels] || rating;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="600">
            我的健康计划
          </Text>
          <TouchableOpacity>
            <Edit3 size={22} color={COLORS.text} />
          </TouchableOpacity>
        </XStack>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Plan Overview */}
        <View
          padding="$5"
          backgroundColor={planTypeInfo?.color + '15'}
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <View
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor={planTypeInfo?.color}
              borderRadius="$2"
            >
              <Text fontSize={13} color="white" fontWeight="600">
                {plan.status === 'active' ? '进行中' : '已完成'}
              </Text>
            </View>
            <Text fontSize={20}>{planTypeInfo?.icon}</Text>
          </XStack>

          <Text fontSize={20} fontWeight="700" marginBottom="$2">
            {plan.title}
          </Text>
          <Text fontSize={14} color="$gray11" marginBottom="$4">
            {plan.description}
          </Text>

          <XStack justifyContent="space-between" marginBottom="$3">
            <YStack>
              <Text fontSize={13} color="$gray11">
                开始日期
              </Text>
              <Text fontSize={15} fontWeight="600">
                {plan.startDate}
              </Text>
            </YStack>
            <YStack alignItems="flex-end">
              <Text fontSize={13} color="$gray11">
                结束日期
              </Text>
              <Text fontSize={15} fontWeight="600">
                {plan.endDate}
              </Text>
            </YStack>
          </XStack>

          <YStack space="$2">
            <XStack justifyContent="space-between">
              <Text fontSize={14} color="$gray11">
                总体进度
              </Text>
              <Text fontSize={16} fontWeight="600" color={planTypeInfo?.color}>
                {plan.progress}%
              </Text>
            </XStack>
            <View
              height={8}
              backgroundColor="$gray3"
              borderRadius={4}
              overflow="hidden"
            >
              <View
                width={`${plan.progress}%`}
                height="100%"
                backgroundColor={planTypeInfo?.color}
              />
            </View>
          </YStack>
        </View>

        {/* Goals */}
        <View padding="$4">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize={18} fontWeight="600">
              目标指标
            </Text>
            <TouchableOpacity>
              <Plus size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </XStack>
          <YStack space="$3">
            {plan.goals.map((goal) => (
              <View
                key={goal.id}
                padding="$4"
                backgroundColor="$surface"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" marginBottom="$3">
                  <YStack>
                    <Text fontSize={16} fontWeight="600">
                      {goal.metric}
                    </Text>
                    <XStack space="$2" alignItems="baseline" marginTop="$1">
                      <Text fontSize={24} fontWeight="700" color={COLORS.primary}>
                        {goal.currentValue}
                      </Text>
                      <Text fontSize={14} color="$gray11">
                        {goal.unit}
                      </Text>
                      <Text fontSize={14} color="$gray11">
                        →
                      </Text>
                      <Text fontSize={20} fontWeight="600">
                        {goal.targetValue}
                      </Text>
                      <Text fontSize={14} color="$gray11">
                        {goal.unit}
                      </Text>
                    </XStack>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <Text fontSize={13} color="$gray11" marginBottom="$1">
                      进度
                    </Text>
                    <Text fontSize={20} fontWeight="700" color={planTypeInfo?.color}>
                      {goal.progress}%
                    </Text>
                  </YStack>
                </XStack>
                <View
                  height={6}
                  backgroundColor="$gray3"
                  borderRadius={3}
                  overflow="hidden"
                >
                  <View
                    width={`${goal.progress}%`}
                    height="100%"
                    backgroundColor={planTypeInfo?.color}
                  />
                </View>
                <Text fontSize={12} color="$gray10" marginTop="$2">
                  截止日期：{goal.deadline}
                </Text>
              </View>
            ))}
          </YStack>
        </View>

        {/* Plan Details */}
        <View padding="$4" paddingTop="$0">
          <Text fontSize={18} fontWeight="600" marginBottom="$3">
            计划详情
          </Text>

          {/* Diet */}
          <View
            padding="$4"
            backgroundColor="#E8F5E9"
            borderRadius="$4"
            marginBottom="$3"
          >
            <Text fontSize={16} fontWeight="600" color="#2E7D32" marginBottom="$2">
              🍎 饮食计划
            </Text>
            <YStack space="$1">
              {plan.details.diet.map((item, idx) => (
                <Text key={idx} fontSize={14} lineHeight={22}>
                  • {item}
                </Text>
              ))}
            </YStack>
          </View>

          {/* Exercise */}
          <View
            padding="$4"
            backgroundColor="#E3F2FD"
            borderRadius="$4"
            marginBottom="$3"
          >
            <Text fontSize={16} fontWeight="600" color="#1976D2" marginBottom="$2">
              🏃 运动计划
            </Text>
            <YStack space="$1">
              {plan.details.exercise.map((item, idx) => (
                <Text key={idx} fontSize={14} lineHeight={22}>
                  • {item}
                </Text>
              ))}
            </YStack>
          </View>

          {/* Lifestyle */}
          <View
            padding="$4"
            backgroundColor="#FFF4E6"
            borderRadius="$4"
          >
            <Text fontSize={16} fontWeight="600" color="#E65100" marginBottom="$2">
              🌟 生活方式调整
            </Text>
            <YStack space="$1">
              {plan.details.lifestyle.map((item, idx) => (
                <Text key={idx} fontSize={14} lineHeight={22}>
                  • {item}
                </Text>
              ))}
            </YStack>
          </View>
        </View>

        {/* Milestones */}
        <View padding="$4" paddingTop="$0">
          <Text fontSize={18} fontWeight="600" marginBottom="$3">
            里程碑
          </Text>
          <YStack space="$3">
            {plan.milestones.map((milestone) => (
              <View
                key={milestone.id}
                padding="$4"
                backgroundColor={milestone.isCompleted ? '#E8F5E9' : '$surface'}
                borderRadius="$4"
                borderWidth={1}
                borderColor={milestone.isCompleted ? '#4CAF50' : '$borderColor'}
              >
                <XStack space="$3" alignItems="flex-start">
                  {milestone.isCompleted ? (
                    <CheckCircle2 size={24} color="#4CAF50" />
                  ) : (
                    <Circle size={24} color="$gray10" />
                  )}
                  <YStack flex={1}>
                    <Text
                      fontSize={16}
                      fontWeight="600"
                      textDecorationLine={milestone.isCompleted ? 'line-through' : 'none'}
                      color={milestone.isCompleted ? '#4CAF50' : COLORS.text}
                    >
                      {milestone.title}
                    </Text>
                    <Text fontSize={13} color="$gray11" marginTop="$1">
                      目标日期：{milestone.targetDate}
                    </Text>
                    {milestone.isCompleted && milestone.completedDate && (
                      <Text fontSize={13} color="#4CAF50" marginTop="$1">
                        完成日期：{milestone.completedDate}
                      </Text>
                    )}
                    {milestone.reward && (
                      <XStack space="$1" alignItems="center" marginTop="$2">
                        <Award size={16} color="#FF9800" />
                        <Text fontSize={13} color="#FF9800">
                          {milestone.reward}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </XStack>
              </View>
            ))}
          </YStack>
        </View>

        {/* Doctor Comments */}
        <View padding="$4" paddingTop="$0">
          <Text fontSize={18} fontWeight="600" marginBottom="$3">
            医生点评
          </Text>
          <YStack space="$3">
            {plan.doctorComments.map((comment) => (
              <View
                key={comment.id}
                padding="$4"
                backgroundColor={getRatingColor(comment.rating) + '10'}
                borderRadius="$4"
                borderWidth={1}
                borderColor={getRatingColor(comment.rating) + '40'}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <XStack space="$2" alignItems="center">
                    <MessageSquare size={18} color={getRatingColor(comment.rating)} />
                    <Text fontSize={15} fontWeight="600">
                      {comment.doctorName}
                    </Text>
                  </XStack>
                  <View
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    backgroundColor={getRatingColor(comment.rating)}
                    borderRadius="$2"
                  >
                    <Text fontSize={12} color="white" fontWeight="600">
                      {getRatingLabel(comment.rating)}
                    </Text>
                  </View>
                </XStack>
                <Text fontSize={14} lineHeight={22} marginBottom="$2">
                  {comment.content}
                </Text>
                <Text fontSize={12} color="$gray10">
                  {comment.date}
                </Text>
              </View>
            ))}
          </YStack>
        </View>

        {/* Check-in Records */}
        <View padding="$4" paddingTop="$0">
          <Text fontSize={18} fontWeight="600" marginBottom="$3">
            打卡记录
          </Text>
          <YStack space="$2">
            {plan.checkInRecords.map((record) => (
              <View
                key={record.id}
                padding="$3"
                backgroundColor="$surface"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize={15} fontWeight="600">
                    {record.date}
                  </Text>
                  <CheckCircle2 size={18} color="#4CAF50" />
                </XStack>
                <XStack space="$4" marginBottom="$2">
                  {record.metrics.map((metric, idx) => (
                    <Text key={idx} fontSize={14} color="$gray11">
                      {metric.name}: <Text fontWeight="600">{metric.value}{metric.unit}</Text>
                    </Text>
                  ))}
                </XStack>
                {record.notes && (
                  <Text fontSize={13} color="$gray10">
                    备注：{record.notes}
                  </Text>
                )}
              </View>
            ))}
          </YStack>
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View
        padding="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        <Button
          size="$5"
          backgroundColor={planTypeInfo?.color}
          color="white"
          borderRadius="$3"
          fontWeight="600"
          onPress={handleCheckIn}
        >
          今日打卡
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HealthPlanScreen;
