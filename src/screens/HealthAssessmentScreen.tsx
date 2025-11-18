/**
 * 健康评估报告界面
 * Health Assessment Screen
 *
 * Phase 24.2: 健康评估报告
 * - 综合健康评分展示（0-100分+等级）
 * - 各系统评分卡片（6大系统）
 * - 主要风险因素列表
 * - 医生建议区域
 * - 下次评估时间提醒
 * - 历史评估对比（趋势图）
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Activity,
  Pill,
  Wind,
  Moon,
  Brain,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

const { width } = Dimensions.get('window');

interface SystemScore {
  id: string;
  name: string;
  icon: any;
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'up' | 'down' | 'stable';
  details: string;
}

interface RiskFactor {
  id: string;
  name: string;
  level: 'low' | 'medium' | 'high';
  description: string;
}

interface Assessment {
  id: string;
  date: string;
  overallScore: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  systems: SystemScore[];
  riskFactors: RiskFactor[];
  doctorAdvice: string[];
  nextAssessmentDate: string;
  assessor: {
    name: string;
    title: string;
  };
}

const MOCK_ASSESSMENT: Assessment = {
  id: 'assess_001',
  date: '2024-11-12',
  overallScore: 82,
  level: 'good',
  systems: [
    {
      id: 'cardiovascular',
      name: '心血管健康',
      icon: Heart,
      score: 85,
      level: 'good',
      trend: 'stable',
      details: '心率正常，血压稳定，心脏功能良好',
    },
    {
      id: 'metabolism',
      name: '代谢健康',
      icon: Activity,
      score: 78,
      level: 'good',
      trend: 'up',
      details: '血糖、血脂基本正常，需注意体重管理',
    },
    {
      id: 'digestive',
      name: '消化系统',
      icon: Pill,
      score: 90,
      level: 'excellent',
      trend: 'stable',
      details: '消化功能良好，无明显不适',
    },
    {
      id: 'respiratory',
      name: '呼吸系统',
      icon: Wind,
      score: 88,
      level: 'excellent',
      trend: 'up',
      details: '肺功能正常，呼吸顺畅',
    },
    {
      id: 'sleep',
      name: '睡眠质量',
      icon: Moon,
      score: 65,
      level: 'fair',
      trend: 'down',
      details: '睡眠时长不足，深度睡眠偏少，建议改善',
    },
    {
      id: 'mental',
      name: '心理健康',
      icon: Brain,
      score: 75,
      level: 'good',
      trend: 'stable',
      details: '心理状态良好，偶有轻度焦虑',
    },
  ],
  riskFactors: [
    {
      id: 'r1',
      name: '睡眠不足',
      level: 'medium',
      description: '平均每日睡眠时间少于7小时，可能影响整体健康',
    },
    {
      id: 'r2',
      name: '运动不足',
      level: 'medium',
      description: '每周运动时间不足150分钟，建议增加有氧运动',
    },
    {
      id: 'r3',
      name: '工作压力',
      level: 'low',
      description: '存在一定工作压力，需要适当调节',
    },
  ],
  doctorAdvice: [
    '改善睡眠质量：建议每晚11点前入睡，保持规律作息',
    '增加运动量：每周至少进行3次有氧运动，每次30分钟以上',
    '饮食调整：减少高油高糖食物摄入，增加蔬菜水果',
    '压力管理：学习放松技巧，如冥想、瑜伽等',
    '定期复查：建议3个月后进行复查评估',
  ],
  nextAssessmentDate: '2025-02-12',
  assessor: {
    name: '张伟医生',
    title: '主任医师',
  },
};

const HISTORY_DATA = [
  { date: '5月', score: 75 },
  { date: '7月', score: 78 },
  { date: '9月', score: 80 },
  { date: '11月', score: 82 },
];

const HealthAssessmentScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [assessment] = useState<Assessment>(MOCK_ASSESSMENT);
  const [showHistory, setShowHistory] = useState(false);

  const getLevelColor = (level: string) => {
    const colors = {
      excellent: '#4CAF50',
      good: '#2196F3',
      fair: '#FF9800',
      poor: '#FF5252',
    };
    return colors[level as keyof typeof colors] || '#999';
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      excellent: '优秀',
      good: '良好',
      fair: '一般',
      poor: '较差',
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#FF5252',
    };
    return colors[level as keyof typeof colors] || '#999';
  };

  const getRiskLevelLabel = (level: string) => {
    const labels = {
      low: '低风险',
      medium: '中风险',
      high: '高风险',
    };
    return labels[level as keyof typeof labels] || level;
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
            健康评估报告
          </Text>
          <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
            <Text fontSize={14} color={COLORS.primary}>
              {showHistory ? '当前' : '历史'}
            </Text>
          </TouchableOpacity>
        </XStack>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Overall Score */}
        <View
          padding="$5"
          backgroundColor={getLevelColor(assessment.level) + '15'}
          alignItems="center"
        >
          <Text fontSize={16} color="$gray11" marginBottom="$2">
            综合健康评分
          </Text>
          <View position="relative" alignItems="center" marginBottom="$3">
            <Text fontSize={72} fontWeight="700" color={getLevelColor(assessment.level)}>
              {assessment.overallScore}
            </Text>
            <Text
              fontSize={20}
              color="$gray11"
              position="absolute"
              bottom={8}
              right={-20}
            >
              /100
            </Text>
          </View>
          <View
            paddingHorizontal="$4"
            paddingVertical="$2"
            backgroundColor={getLevelColor(assessment.level)}
            borderRadius="$5"
            marginBottom="$2"
          >
            <Text fontSize={16} fontWeight="600" color="white">
              {getLevelLabel(assessment.level)}
            </Text>
          </View>
          <Text fontSize={14} color="$gray11">
            评估日期：{assessment.date}
          </Text>
          <Text fontSize={13} color="$gray10">
            评估医生：{assessment.assessor.name} · {assessment.assessor.title}
          </Text>
        </View>

        {/* History Trend */}
        {showHistory && (
          <View padding="$4" backgroundColor="$gray1" marginBottom="$4">
            <Text fontSize={17} fontWeight="600" marginBottom="$3">
              历史评估趋势
            </Text>
            <View
              height={200}
              backgroundColor="white"
              borderRadius="$4"
              padding="$3"
              justifyContent="flex-end"
            >
              <XStack height={150} alignItems="flex-end" justifyContent="space-around">
                {HISTORY_DATA.map((item, idx) => {
                  const height = (item.score / 100) * 140;
                  return (
                    <YStack key={idx} alignItems="center" space="$2">
                      <View
                        width={50}
                        height={height}
                        backgroundColor={COLORS.primary}
                        borderTopLeftRadius={4}
                        borderTopRightRadius={4}
                        justifyContent="flex-start"
                        paddingTop="$2"
                        alignItems="center"
                      >
                        <Text fontSize={13} fontWeight="600" color="white">
                          {item.score}
                        </Text>
                      </View>
                      <Text fontSize={13} color="$gray11">
                        {item.date}
                      </Text>
                    </YStack>
                  );
                })}
              </XStack>
            </View>
          </View>
        )}

        {/* System Scores */}
        <View padding="$4">
          <Text fontSize={18} fontWeight="600" marginBottom="$3">
            各系统评分
          </Text>
          <YStack space="$3">
            {assessment.systems.map((system) => {
              const Icon = system.icon;
              const TrendIcon = system.trend === 'up' ? TrendingUp : system.trend === 'down' ? TrendingDown : null;

              return (
                <TouchableOpacity key={system.id}>
                  <View
                    padding="$4"
                    backgroundColor="$surface"
                    borderRadius="$4"
                    borderLeftWidth={4}
                    borderLeftColor={getLevelColor(system.level)}
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                      <XStack space="$2" alignItems="center" flex={1}>
                        <View
                          width={40}
                          height={40}
                          backgroundColor={getLevelColor(system.level) + '20'}
                          borderRadius={20}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Icon size={22} color={getLevelColor(system.level)} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize={16} fontWeight="600">
                            {system.name}
                          </Text>
                          <Text fontSize={13} color="$gray11">
                            {system.details}
                          </Text>
                        </YStack>
                      </XStack>
                      <YStack alignItems="flex-end" space="$1">
                        <XStack space="$1" alignItems="center">
                          <Text
                            fontSize={24}
                            fontWeight="700"
                            color={getLevelColor(system.level)}
                          >
                            {system.score}
                          </Text>
                          {TrendIcon && (
                            <TrendIcon
                              size={18}
                              color={
                                system.trend === 'up' ? '#4CAF50' : '#FF5252'
                              }
                            />
                          )}
                        </XStack>
                        <View
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          backgroundColor={getLevelColor(system.level)}
                          borderRadius="$2"
                        >
                          <Text fontSize={11} color="white" fontWeight="600">
                            {getLevelLabel(system.level)}
                          </Text>
                        </View>
                      </YStack>
                    </XStack>

                    {/* Progress Bar */}
                    <View
                      height={6}
                      backgroundColor="$gray3"
                      borderRadius={3}
                      overflow="hidden"
                    >
                      <View
                        width={`${system.score}%`}
                        height="100%"
                        backgroundColor={getLevelColor(system.level)}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </YStack>
        </View>

        {/* Risk Factors */}
        {assessment.riskFactors.length > 0 && (
          <View padding="$4" paddingTop="$0">
            <Text fontSize={18} fontWeight="600" marginBottom="$3">
              主要风险因素
            </Text>
            <YStack space="$3">
              {assessment.riskFactors.map((risk) => (
                <View
                  key={risk.id}
                  padding="$4"
                  backgroundColor={getRiskLevelColor(risk.level) + '10'}
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor={getRiskLevelColor(risk.level) + '40'}
                >
                  <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                    <XStack space="$2" alignItems="center" flex={1}>
                      <AlertTriangle
                        size={20}
                        color={getRiskLevelColor(risk.level)}
                      />
                      <Text fontSize={16} fontWeight="600">
                        {risk.name}
                      </Text>
                    </XStack>
                    <View
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      backgroundColor={getRiskLevelColor(risk.level)}
                      borderRadius="$2"
                    >
                      <Text fontSize={12} color="white" fontWeight="600">
                        {getRiskLevelLabel(risk.level)}
                      </Text>
                    </View>
                  </XStack>
                  <Text fontSize={14} color="$gray11">
                    {risk.description}
                  </Text>
                </View>
              ))}
            </YStack>
          </View>
        )}

        {/* Doctor's Advice */}
        {assessment.doctorAdvice.length > 0 && (
          <View padding="$4" paddingTop="$0">
            <Text fontSize={18} fontWeight="600" marginBottom="$3">
              医生建议
            </Text>
            <View
              padding="$4"
              backgroundColor="#E3F2FD"
              borderRadius="$4"
              borderWidth={1}
              borderColor="#90CAF9"
            >
              <YStack space="$2">
                {assessment.doctorAdvice.map((advice, idx) => (
                  <XStack key={idx} space="$2" alignItems="flex-start">
                    <CheckCircle2
                      size={18}
                      color="#1976D2"
                      style={{ marginTop: 2 }}
                    />
                    <Text fontSize={14} flex={1} lineHeight={22}>
                      {advice}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </View>
          </View>
        )}

        {/* Next Assessment Reminder */}
        <View padding="$4" paddingTop="$0">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BookConsultation', {
                assessmentReminder: true,
              });
            }}
          >
            <View
              padding="$4"
              backgroundColor="#FFF4E6"
              borderRadius="$4"
              borderWidth={1}
              borderColor="#FFE0B2"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2" alignItems="center" flex={1}>
                  <View
                    width={40}
                    height={40}
                    backgroundColor="#FF9800"
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Calendar size={22} color="white" />
                  </View>
                  <YStack flex={1}>
                    <Text fontSize={16} fontWeight="600" color="#E65100">
                      下次评估提醒
                    </Text>
                    <Text fontSize={14} color="$gray11">
                      建议评估时间：{assessment.nextAssessmentDate}
                    </Text>
                  </YStack>
                </XStack>
                <ChevronRight size={24} color="#FF9800" />
              </XStack>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View
        padding="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        <Button
          size="$4"
          backgroundColor={COLORS.primary}
          color="white"
          borderRadius="$3"
          fontWeight="600"
          onPress={() => navigation.navigate('HealthPlan')}
        >
          制定健康计划
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HealthAssessmentScreen;
