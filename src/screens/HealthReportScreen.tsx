import React, { useState } from 'react';
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
  useTheme,
} from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Share2,
  Download,
  Heart,
  Activity,
  Moon,
  Scale,
  Droplets,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Award,
  Calendar,
  Bot,
  Target,
  Shield,
  BarChart3,
  FileBarChart,
  Zap,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

export const HealthReportScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // 主题色值
  const primaryColor = theme.primary?.val || '#6366F1';
  const successColor = theme.success?.val || '#10B981';
  const warningColor = theme.warning?.val || '#F59E0B';
  const errorColor = theme.error?.val || '#EF4444';
  const accentColor = theme.accent?.val || '#A78BFA';
  const secondaryColor = theme.secondary?.val || '#22D3EE';
  const textColor = theme.color12?.val || '#1F2937';
  const textSecondaryColor = theme.color10?.val || '#6B7280';

  const periods = [
    { id: 'week', name: '本周' },
    { id: 'month', name: '本月' },
    { id: 'year', name: '本年' }
  ];

  // 健康维度评分数据
  const healthDimensions = [
    {
      name: '心血管健康',
      score: 95,
      trend: 'up',
      icon: Heart,
      color: errorColor
    },
    {
      name: '代谢健康',
      score: 88,
      trend: 'stable',
      icon: Activity,
      color: successColor
    },
    {
      name: '睡眠质量',
      score: 90,
      trend: 'up',
      icon: Moon,
      color: primaryColor
    },
    {
      name: '体重管理',
      score: 92,
      trend: 'down',
      icon: Scale,
      color: secondaryColor
    },
    {
      name: '血液指标',
      score: 87,
      trend: 'stable',
      icon: Droplets,
      color: accentColor
    },
    {
      name: '精神状态',
      score: 94,
      trend: 'up',
      icon: Brain,
      color: accentColor
    }
  ];

  // 重要发现数据
  const importantFindings = [
    {
      type: 'positive',
      title: '心血管健康持续改善',
      description: '您的血压和心率在过去一个月内保持在理想范围内，心血管风险评估为低风险。',
      icon: CheckCircle
    },
    {
      type: 'attention',
      title: '睡眠不规律需要关注',
      description: '检测到您的入睡时间波动较大，建议保持固定的睡眠时间以改善睡眠质量。',
      icon: AlertTriangle
    }
  ];

  // 健康趋势数据
  const healthTrends = [
    { metric: '平均心率', value: '72 bpm', change: '稳定', status: 'good' },
    { metric: '血压指标', value: '120/80', change: '理想', status: 'good' },
    { metric: '体重变化', value: '-0.5kg', change: '下降', status: 'good' },
    { metric: '睡眠时长', value: '7.5小时', change: '充足', status: 'good' }
  ];

  // 个性化建议数据
  const personalizedRecommendations = [
    {
      category: '运动建议',
      items: [
        '每周进行3-4次有氧运动，每次30-45分钟',
        '增加力量训练，每周2次，提高基础代谢率',
        '日常增加步行，目标每日8000-10000步'
      ]
    },
    {
      category: '饮食调整',
      items: [
        '减少精制糖摄入，选择复合碳水化合物',
        '增加深色蔬菜和优质蛋白质',
        '保持规律饮食时间，避免暴饮暴食'
      ]
    },
    {
      category: '生活习惯',
      items: [
        '建立固定的睡眠时间，23:00前入睡',
        '每日进行10-15分钟冥想或深呼吸练习',
        '定期体检，监测关键健康指标'
      ]
    }
  ];

  // AI健康分析数据
  const aiAnalysis = {
    overallAssessment: {
      level: '良好',
      score: 92,
      summary: '您的整体健康状况良好，各项生理指标大多在正常范围内。建议继续保持现有的健康习惯，并关注睡眠质量的改善。',
      riskLevel: 'low'
    },
    insights: [
      {
        title: '心血管系统分析',
        content: '血压和心率均在理想范围，心血管系统功能良好。坚持有氧运动有助于进一步改善心血管健康。',
        importance: 'high',
        icon: Heart
      },
      {
        title: '代谢功能评估',
        content: '血糖控制稳定，体重管理效果明显。建议继续保持均衡饮食和规律运动的生活方式。',
        importance: 'medium',
        icon: Activity
      },
      {
        title: '睡眠质量分析',
        content: '睡眠时长充足但质量有待提升。不规律的入睡时间可能影响深度睡眠，建议建立固定的睡眠习惯。',
        importance: 'high',
        icon: Moon
      }
    ]
  };

  // 健康风险评估数据
  const riskAssessment = [
    {
      category: '心血管疾病风险',
      level: 'low',
      percentage: 15,
      factors: ['血压正常', '心率稳定', '无家族史'],
      recommendations: ['继续保持运动习惯', '控制盐分摄入']
    },
    {
      category: '糖尿病风险',
      level: 'low',
      percentage: 12,
      factors: ['血糖稳定', '体重正常', 'BMI在标准范围'],
      recommendations: ['保持饮食均衡', '定期监测血糖']
    },
    {
      category: '骨质疏松风险',
      level: 'medium',
      percentage: 35,
      factors: ['年龄因素', '运动强度偏低'],
      recommendations: ['增加力量训练', '补充维生素D']
    }
  ];

  // 详细趋势数据（用于图表展示）
  const detailedTrends = {
    heartRate: {
      data: [68, 70, 72, 71, 69, 73, 72],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      unit: 'bpm',
      trend: 'stable'
    },
    bloodPressure: {
      systolic: [118, 120, 119, 121, 117, 120, 118],
      diastolic: [78, 80, 79, 81, 77, 80, 78],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      unit: 'mmHg',
      trend: 'stable'
    },
    weight: {
      data: [68.8, 68.6, 68.5, 68.4, 68.3, 68.5, 68.5],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      unit: 'kg',
      trend: 'down'
    },
    sleep: {
      data: [7.2, 7.8, 6.9, 7.5, 8.1, 7.3, 7.5],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      unit: '小时',
      trend: 'stable'
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color={successColor} />;
      case 'down':
        return <TrendingDown size={16} color={errorColor} />;
      default:
        return <Minus size={16} color={textSecondaryColor} />;
    }
  };

  // 处理报告导出
  const handleExportReport = () => {
    // TODO: 实现PDF导出功能
    console.log('导出健康报告');
    // 这里可以集成 react-native-pdf 或其他PDF生成库
  };

  // 处理报告分享
  const handleShareReport = () => {
    // TODO: 实现分享功能
    console.log('分享健康报告');
    // 这里可以使用 react-native-share 或原生分享API
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* 顶部标题栏 */}
        <TitleBar
          title="健康报告"
          actions={[
            { icon: Share2, onPress: handleShareReport },
            { icon: Download, onPress: handleExportReport },
          ]}
        />

        {/* 可滚动内容区域 */}
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <YStack gap="$2" padding="$2.5">

            {/* 综合健康评分卡片 */}
            <View borderRadius="$6" overflow="hidden">
              <LinearGradient
                colors={[primaryColor, accentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 16 }}
              >
                {/* 头部信息 */}
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <YStack>
                    <H2 fontSize="$7" fontWeight="bold" color="white" marginBottom="$1">
                      综合健康评分
                    </H2>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      2024年3月
                    </Text>
                  </YStack>
                  <YStack alignItems="center">
                    <Text fontSize="$10" fontWeight="bold" color="white">
                      92
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      优秀
                    </Text>
                  </YStack>
                </XStack>

                {/* 进度条 */}
                <Progress value={92} backgroundColor="rgba(255,255,255,0.2)" marginBottom="$2">
                  <Progress.Indicator backgroundColor="white" />
                </Progress>

                {/* 趋势信息 */}
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                    较上月
                  </Text>
                  <XStack gap="$1" alignItems="center">
                    <TrendingUp size={16} color="white" />
                    <Text fontSize="$3" fontWeight="500" color="white">
                      +3分
                    </Text>
                  </XStack>
                </XStack>
              </LinearGradient>
            </View>

            {/* 时间段选择器 */}
            <XStack backgroundColor="$color2" borderRadius="$10" padding="$1">
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  onPress={() => setSelectedPeriod(period.id)}
                  style={{ flex: 1 }}
                >
                  <View
                    backgroundColor={selectedPeriod === period.id ? '$primary' : 'transparent'}
                    borderRadius="$10"
                    paddingVertical="$2"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      color={selectedPeriod === period.id ? 'white' : '$color10'}
                      fontWeight={selectedPeriod === period.id ? '600' : '400'}
                    >
                      {period.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>

            {/* 健康维度评分卡片 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <H3 fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">
                健康维度评分
              </H3>
              <YStack gap="$2">
                {healthDimensions.map((dimension, index) => {
                  const IconComponent = dimension.icon;
                  return (
                    <YStack key={index} gap="$1">
                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack gap="$2" alignItems="center">
                          <IconComponent size={20} color={dimension.color} />
                          <Text fontSize="$3" fontWeight="500" color="$color12">
                            {dimension.name}
                          </Text>
                        </XStack>
                        <XStack gap="$2" alignItems="center">
                          <Text fontSize="$3" fontWeight="bold" color="$color12">
                            {dimension.score}分
                          </Text>
                          {getTrendIcon(dimension.trend)}
                        </XStack>
                      </XStack>
                      <Progress value={dimension.score} backgroundColor="$color5" height={8}>
                        <Progress.Indicator backgroundColor={dimension.color} />
                      </Progress>
                    </YStack>
                  );
                })}
              </YStack>
            </Card>

            {/* 重要发现卡片 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <H3 fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">
                重要发现
              </H3>
              <YStack gap="$2">
                {importantFindings.map((finding, index) => {
                  const IconComponent = finding.icon;
                  return (
                    <View
                      key={index}
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor={
                        finding.type === 'positive'
                          ? `${successColor}15`
                          : `${warningColor}15`
                      }
                      borderWidth={1}
                      borderColor={
                        finding.type === 'positive'
                          ? `${successColor}30`
                          : `${warningColor}30`
                      }
                    >
                      <XStack gap="$2" alignItems="flex-start">
                        <IconComponent
                          size={20}
                          color={finding.type === 'positive' ? successColor : warningColor}
                          style={{ marginTop: 2 }}
                        />
                        <YStack flex={1}>
                          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                            {finding.title}
                          </Text>
                          <Text fontSize="$3" color="$color10" lineHeight="$2">
                            {finding.description}
                          </Text>
                        </YStack>
                      </XStack>
                    </View>
                  );
                })}
              </YStack>
            </Card>

            {/* 健康趋势卡片 - 2x2网格布局 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <H3 fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">
                健康趋势
              </H3>
              <YStack gap="$2">
                {/* 第一行 */}
                <XStack gap="$2">
                  {healthTrends.slice(0, 2).map((trend, index) => (
                    <View
                      key={index}
                      flex={1}
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor="$color2"
                    >
                      <Text fontSize="$2" color="$color10" marginBottom="$1">
                        {trend.metric}
                      </Text>
                      <Text fontSize="$5" fontWeight="bold" color="$color12" marginBottom="$1">
                        {trend.value}
                      </Text>
                      <View
                        backgroundColor={trend.status === 'good' ? successColor : warningColor}
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$10"
                        alignSelf="flex-start"
                      >
                        <Text fontSize="$1" color="white">
                          {trend.change}
                        </Text>
                      </View>
                    </View>
                  ))}
                </XStack>
                {/* 第二行 */}
                <XStack gap="$2">
                  {healthTrends.slice(2, 4).map((trend, index) => (
                    <View
                      key={index + 2}
                      flex={1}
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor="$color2"
                    >
                      <Text fontSize="$2" color="$color10" marginBottom="$1">
                        {trend.metric}
                      </Text>
                      <Text fontSize="$5" fontWeight="bold" color="$color12" marginBottom="$1">
                        {trend.value}
                      </Text>
                      <View
                        backgroundColor={trend.status === 'good' ? successColor : warningColor}
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$10"
                        alignSelf="flex-start"
                      >
                        <Text fontSize="$1" color="white">
                          {trend.change}
                        </Text>
                      </View>
                    </View>
                  ))}
                </XStack>
              </YStack>
            </Card>

            {/* AI健康分析卡片 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <XStack gap="$2" alignItems="center" marginBottom="$2">
                <View
                  width={32}
                  height={32}
                  backgroundColor={`${primaryColor}15`}
                  borderRadius="$12"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Bot size={18} color={primaryColor} />
                </View>
                <H3 fontSize="$5" fontWeight="600" color="$color12">
                  AI健康分析
                </H3>
              </XStack>

              {/* 整体评估 */}
              <View
                padding="$2"
                borderRadius="$5"
                backgroundColor={`${primaryColor}08`}
                borderWidth={1}
                borderColor={`${primaryColor}15`}
                marginBottom="$2"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$4" fontWeight="600" color="$color12">
                    整体健康评估
                  </Text>
                  <View
                    backgroundColor={
                      aiAnalysis.overallAssessment.riskLevel === 'low'
                        ? successColor
                        : aiAnalysis.overallAssessment.riskLevel === 'medium'
                        ? warningColor
                        : errorColor
                    }
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize="$3" color="white" fontWeight="500">
                      {aiAnalysis.overallAssessment.level}
                    </Text>
                  </View>
                </XStack>
                <Text fontSize="$3" color="$color10" lineHeight="$2">
                  {aiAnalysis.overallAssessment.summary}
                </Text>
              </View>

              {/* AI洞察 */}
              <YStack gap="$2">
                {aiAnalysis.insights.map((insight, index) => {
                  const IconComponent = insight.icon;
                  return (
                    <View
                      key={index}
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor="$color2"
                      borderLeftWidth={3}
                      borderLeftColor={
                        insight.importance === 'high'
                          ? errorColor
                          : insight.importance === 'medium'
                          ? warningColor
                          : successColor
                      }
                    >
                      <XStack gap="$2" alignItems="flex-start">
                        <View
                          width={32}
                          height={32}
                          backgroundColor="$color3"
                          borderRadius="$12"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={16} color={primaryColor} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
                            {insight.title}
                          </Text>
                          <Text fontSize="$3" color="$color10" lineHeight="$2">
                            {insight.content}
                          </Text>
                        </YStack>
                      </XStack>
                    </View>
                  );
                })}
              </YStack>
            </Card>

            {/* 健康风险评估卡片 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <XStack gap="$2" alignItems="center" marginBottom="$2">
                <View
                  width={32}
                  height={32}
                  backgroundColor={`${errorColor}15`}
                  borderRadius="$12"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Shield size={18} color={errorColor} />
                </View>
                <H3 fontSize="$5" fontWeight="600" color="$color12">
                  健康风险评估
                </H3>
              </XStack>

              <YStack gap="$2">
                {riskAssessment.map((risk, index) => (
                  <View
                    key={index}
                    padding="$2"
                    borderRadius="$5"
                    backgroundColor="$color2"
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        {risk.category}
                      </Text>
                      <XStack gap="$2" alignItems="center">
                        <Text fontSize="$3" color="$color10">
                          {risk.percentage}%
                        </Text>
                        <View
                          backgroundColor={
                            risk.level === 'low'
                              ? successColor
                              : risk.level === 'medium'
                              ? warningColor
                              : errorColor
                          }
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$10"
                        >
                          <Text fontSize="$2" color="white">
                            {risk.level === 'low' ? '低风险' : risk.level === 'medium' ? '中风险' : '高风险'}
                          </Text>
                        </View>
                      </XStack>
                    </XStack>

                    {/* 风险进度条 */}
                    <View marginBottom="$2">
                      <Progress
                        value={risk.percentage}
                        backgroundColor="$color5"
                        size="$1"
                      >
                        <Progress.Indicator
                          backgroundColor={
                            risk.level === 'low'
                              ? successColor
                              : risk.level === 'medium'
                              ? warningColor
                              : errorColor
                          }
                        />
                      </Progress>
                    </View>

                    {/* 影响因素 */}
                    <YStack gap="$1" marginBottom="$2">
                      <Text fontSize="$3" fontWeight="500" color="$color12">
                        影响因素:
                      </Text>
                      <XStack flexWrap="wrap" gap="$1">
                        {risk.factors.map((factor, factorIndex) => (
                          <View
                            key={factorIndex}
                            backgroundColor="$color3"
                            paddingHorizontal="$2"
                            paddingVertical="$0.5"
                            borderRadius="$10"
                          >
                            <Text fontSize="$2" color="$color10">
                              {factor}
                            </Text>
                          </View>
                        ))}
                      </XStack>
                    </YStack>

                    {/* 改善建议 */}
                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="500" color="$color12">
                        改善建议:
                      </Text>
                      {risk.recommendations.map((rec, recIndex) => (
                        <XStack key={recIndex} gap="$2" alignItems="flex-start">
                          <Text fontSize="$2" color="$primary" marginTop="$1">
                            •
                          </Text>
                          <Text fontSize="$3" color="$color10" flex={1} lineHeight="$2">
                            {rec}
                          </Text>
                        </XStack>
                      ))}
                    </YStack>
                  </View>
                ))}
              </YStack>
            </Card>

            {/* 详细趋势图表卡片 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <XStack gap="$2" alignItems="center" marginBottom="$2">
                <View
                  width={32}
                  height={32}
                  backgroundColor={`${successColor}15`}
                  borderRadius="$12"
                  justifyContent="center"
                  alignItems="center"
                >
                  <BarChart3 size={18} color={successColor} />
                </View>
                <H3 fontSize="$5" fontWeight="600" color="$color12">
                  详细趋势分析
                </H3>
              </XStack>

              <YStack gap="$2">
                {/* 心率趋势 */}
                <View
                  padding="$2"
                  borderRadius="$5"
                  backgroundColor="$color2"
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      心率趋势 (过去7天)
                    </Text>
                    <Text fontSize="$3" color="$color10">
                      平均: 71 bpm
                    </Text>
                  </XStack>
                  <View
                    height={60}
                    backgroundColor="$color3"
                    borderRadius="$4"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$2"
                  >
                    <Text fontSize="$3" color="$color10">
                      📊 心率变化趋势图 (模拟)
                    </Text>
                  </View>
                  <XStack justifyContent="space-between">
                    {detailedTrends.heartRate.labels.map((label, index) => (
                      <Text key={index} fontSize="$2" color="$color10">
                        {label.slice(1)}
                      </Text>
                    ))}
                  </XStack>
                </View>

                {/* 血压趋势 */}
                <View
                  padding="$2"
                  borderRadius="$5"
                  backgroundColor="$color2"
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      血压趋势 (过去7天)
                    </Text>
                    <Text fontSize="$3" color="$color10">
                      平均: 119/79 mmHg
                    </Text>
                  </XStack>
                  <View
                    height={60}
                    backgroundColor="$color3"
                    borderRadius="$4"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$2"
                  >
                    <Text fontSize="$3" color="$color10">
                      📈 血压双线趋势图 (模拟)
                    </Text>
                  </View>
                  <XStack justifyContent="space-between">
                    {detailedTrends.bloodPressure.labels.map((label, index) => (
                      <Text key={index} fontSize="$2" color="$color10">
                        {label.slice(1)}
                      </Text>
                    ))}
                  </XStack>
                </View>
              </YStack>
            </Card>

            {/* 个性化建议卡片 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.12}
              shadowRadius={16}
              elevation={4}
            >
              <XStack gap="$2" alignItems="center" marginBottom="$2">
                <Award size={20} color={primaryColor} />
                <H3 fontSize="$5" fontWeight="600" color="$color12">
                  个性化建议
                </H3>
              </XStack>
              <YStack gap="$2">
                {personalizedRecommendations.map((recommendation, index) => (
                  <YStack key={index}>
                    <Text fontSize="$3" fontWeight="500" color="$primary" marginBottom="$1">
                      {recommendation.category}
                    </Text>
                    <YStack gap="$1">
                      {recommendation.items.map((item, itemIndex) => (
                        <XStack key={itemIndex} gap="$2" alignItems="flex-start">
                          <View
                            width={6}
                            height={6}
                            borderRadius={3}
                            backgroundColor="$primary"
                            marginTop="$1"
                          />
                          <Text fontSize="$3" color="$color10" flex={1} lineHeight="$2">
                            {item}
                          </Text>
                        </XStack>
                      ))}
                    </YStack>
                  </YStack>
                ))}
              </YStack>
            </Card>

            {/* 报告页脚 */}
            <Card
              padding="$2"
              borderRadius="$6"
              backgroundColor={`${primaryColor}08`}
              borderWidth={1}
              borderColor={`${primaryColor}15`}
            >
              <XStack gap="$2" alignItems="flex-start">
                <Calendar size={18} color={textSecondaryColor} style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                    下次报告生成时间
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    2024年4月1日
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* 底部间距 */}
            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};