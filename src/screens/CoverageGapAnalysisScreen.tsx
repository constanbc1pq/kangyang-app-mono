import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Dimensions } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  TrendingUp,
  Home,
  GraduationCap,
  Users,
  AlertTriangle,
  Shield,
  Heart,
  DollarSign,
  FileText,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

const { width } = Dimensions.get('window');

interface ExistingPolicy {
  type: string;
  company: string;
  coverage: number;
  annualPremium: number;
}

interface FamilyResponsibility {
  mortgage: number;
  children: number;
  parents: number;
  livingExpenses: number;
  total: number;
}

interface CoverageGap {
  category: string;
  needed: number;
  existing: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  icon: any;
  color: string;
}

const CoverageGapAnalysisScreen: React.FC = () => {
  const navigation = useNavigation();

  const [analyzing, setAnalyzing] = useState(true);
  const [existingPolicies, setExistingPolicies] = useState<ExistingPolicy[]>([]);
  const [familyResponsibility, setFamilyResponsibility] = useState<FamilyResponsibility | null>(null);
  const [coverageGaps, setCoverageGaps] = useState<CoverageGap[]>([]);
  const [totalGap, setTotalGap] = useState(0);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock existing policies (in real app, would fetch from user data)
    const policies: ExistingPolicy[] = [
      {
        type: '医疗险',
        company: '中国平安',
        coverage: 200,
        annualPremium: 1.2,
      },
      {
        type: '重疾险',
        company: '中国人寿',
        coverage: 30,
        annualPremium: 0.8,
      },
    ];
    setExistingPolicies(policies);

    // Calculate family responsibility (based on user profile - mocked here)
    const age = 35;
    const annualIncome = 30; // 30万
    const familySize = 4; // 夫妻+2个孩子

    const responsibility: FamilyResponsibility = {
      mortgage: 150, // 房贷余额
      children: 80, // 子女教育金（每个孩子40万，2个孩子）
      parents: 40, // 父母赡养费（假设需要赡养10年，每年4万）
      livingExpenses: 150, // 生活费（5年生活费，每年30万）
      total: 420,
    };
    setFamilyResponsibility(responsibility);

    // Calculate coverage gaps by category
    const existingMedical = policies.find(p => p.type === '医疗险')?.coverage || 0;
    const existingCriticalIllness = policies.find(p => p.type === '重疾险')?.coverage || 0;
    const existingAccident = policies.find(p => p.type === '意外险')?.coverage || 0;
    const existingLife = policies.find(p => p.type === '寿险')?.coverage || 0;

    const gaps: CoverageGap[] = [
      {
        category: '医疗保障',
        needed: 300,
        existing: existingMedical,
        gap: 300 - existingMedical,
        priority: existingMedical < 200 ? 'high' : 'medium',
        icon: Heart,
        color: '#EF4444',
      },
      {
        category: '重疾保障',
        needed: 100,
        existing: existingCriticalIllness,
        gap: 100 - existingCriticalIllness,
        priority: existingCriticalIllness < 50 ? 'high' : 'medium',
        icon: Shield,
        color: '#8B5CF6',
      },
      {
        category: '意外保障',
        needed: 200,
        existing: existingAccident,
        gap: 200 - existingAccident,
        priority: existingAccident < 100 ? 'high' : 'low',
        icon: AlertTriangle,
        color: '#F59E0B',
      },
      {
        category: '寿险保障',
        needed: responsibility.total,
        existing: existingLife,
        gap: responsibility.total - existingLife,
        priority: existingLife < responsibility.total * 0.5 ? 'high' : 'medium',
        icon: Users,
        color: '#3B82F6',
      },
    ];

    setCoverageGaps(gaps);
    setTotalGap(gaps.reduce((sum, g) => sum + g.gap, 0));
    setAnalyzing(false);
  };

  const renderRadarChart = () => {
    // Simplified radar chart visualization
    const categories = coverageGaps.map(g => g.category);
    const maxValue = Math.max(...coverageGaps.map(g => g.needed));

    return (
      <View alignItems="center" justifyContent="center" paddingVertical="$4">
        <View
          width={width - 80}
          height={width - 80}
          borderRadius={(width - 80) / 2}
          borderWidth={2}
          borderColor="$borderColor"
          backgroundColor="$background"
          position="relative"
          justifyContent="center"
          alignItems="center"
        >
          {/* Center label */}
          <View alignItems="center">
            <Text fontSize="$2" color="$textSecondary">
              保障缺口
            </Text>
            <Text fontSize="$8" fontWeight="700" color={COLORS.error}>
              {totalGap.toFixed(0)}万
            </Text>
          </View>

          {/* Category labels positioned around the circle */}
          {coverageGaps.map((gap, index) => {
            const angle = (index * 360) / coverageGaps.length - 90;
            const radian = (angle * Math.PI) / 180;
            const radius = (width - 80) / 2 + 40;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <View
                key={gap.category}
                position="absolute"
                style={{
                  transform: [
                    { translateX: x },
                    { translateY: y },
                  ],
                }}
              >
                <View alignItems="center">
                  <Text fontSize="$2" color="$text" fontWeight="600">
                    {gap.category}
                  </Text>
                  <Text fontSize="$2" color={gap.gap > 0 ? COLORS.error : COLORS.success}>
                    {gap.gap > 0 ? `缺${gap.gap}万` : '充足'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderFamilyResponsibility = () => {
    if (!familyResponsibility) return null;

    const items = [
      {
        label: '房贷余额',
        value: familyResponsibility.mortgage,
        icon: Home,
        color: '#3B82F6',
        description: '未还清的房屋贷款',
      },
      {
        label: '子女教育',
        value: familyResponsibility.children,
        icon: GraduationCap,
        color: '#8B5CF6',
        description: '从现在到大学毕业的教育金',
      },
      {
        label: '父母赡养',
        value: familyResponsibility.parents,
        icon: Users,
        color: '#10B981',
        description: '预计未来10年的赡养费用',
      },
      {
        label: '家庭生活',
        value: familyResponsibility.livingExpenses,
        icon: DollarSign,
        color: '#F59E0B',
        description: '至少5年的家庭生活开支',
      },
    ];

    return (
      <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
        <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
          家庭责任测算
        </Text>

        <YStack gap="$3">
          {items.map(item => {
            const Icon = item.icon;
            const percentage = (item.value / familyResponsibility.total) * 100;

            return (
              <View key={item.label}>
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <XStack alignItems="center" gap="$2">
                    <View
                      width={32}
                      height={32}
                      borderRadius={16}
                      backgroundColor={`${item.color}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Icon size={16} color={item.color} />
                    </View>
                    <YStack>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {item.label}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        {item.description}
                      </Text>
                    </YStack>
                  </XStack>
                  <Text fontSize="$4" fontWeight="700" color={item.color}>
                    {item.value}万
                  </Text>
                </XStack>

                {/* Progress bar */}
                <View height={6} backgroundColor="$borderColor" borderRadius="$2">
                  <View
                    width={`${percentage}%`}
                    height="100%"
                    backgroundColor={item.color}
                    borderRadius="$2"
                  />
                </View>
              </View>
            );
          })}

          {/* Total */}
          <View
            paddingTop="$3"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$text">
                家庭责任总额
              </Text>
              <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                {familyResponsibility.total}万
              </Text>
            </XStack>
            <Text fontSize="$2" color="$textSecondary" marginTop="$1">
              这是您需要通过保险覆盖的最低保额
            </Text>
          </View>
        </YStack>
      </View>
    );
  };

  const renderExistingPolicies = () => {
    const totalCoverage = existingPolicies.reduce((sum, p) => sum + p.coverage, 0);
    const totalPremium = existingPolicies.reduce((sum, p) => sum + p.annualPremium, 0);

    return (
      <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
        <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
          现有保单汇总
        </Text>

        {existingPolicies.length === 0 ? (
          <View padding="$4" alignItems="center">
            <FileText size={32} color={COLORS.textSecondary} />
            <Text fontSize="$3" color="$textSecondary" marginTop="$2">
              暂无保单记录
            </Text>
          </View>
        ) : (
          <>
            <YStack gap="$2" marginBottom="$3">
              {existingPolicies.map((policy, index) => (
                <View
                  key={index}
                  padding="$3"
                  backgroundColor="$background"
                  borderRadius="$3"
                  borderLeftWidth={3}
                  borderLeftColor={COLORS.primary}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {policy.type}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$0.5">
                        {policy.company}
                      </Text>
                    </YStack>
                    <YStack alignItems="flex-end">
                      <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                        {policy.coverage}万
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        {policy.annualPremium}万/年
                      </Text>
                    </YStack>
                  </XStack>
                </View>
              ))}
            </YStack>

            <View
              padding="$3"
              backgroundColor="$background"
              borderRadius="$3"
            >
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  总保额
                </Text>
                <Text fontSize="$4" fontWeight="600" color="$text">
                  {totalCoverage}万
                </Text>
              </XStack>
              <XStack justifyContent="space-between" marginTop="$2">
                <Text fontSize="$3" color="$textSecondary">
                  年缴保费
                </Text>
                <Text fontSize="$4" fontWeight="600" color="$text">
                  {totalPremium.toFixed(1)}万
                </Text>
              </XStack>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderGapDetails = () => {
    return (
      <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
        <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
          保障缺口详情
        </Text>

        <YStack gap="$3">
          {coverageGaps.map(gap => {
            const Icon = gap.icon;
            const priorityConfig = {
              high: { label: '高', color: COLORS.error, bgColor: '#FEE2E2' },
              medium: { label: '中', color: COLORS.warning, bgColor: '#FEF3C7' },
              low: { label: '低', color: COLORS.success, bgColor: '#D1FAE5' },
            };
            const priority = priorityConfig[gap.priority];

            return (
              <View
                key={gap.category}
                padding="$3"
                backgroundColor="$background"
                borderRadius="$3"
                borderLeftWidth={4}
                borderLeftColor={gap.color}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <XStack alignItems="center" gap="$2">
                    <View
                      width={36}
                      height={36}
                      borderRadius={18}
                      backgroundColor={`${gap.color}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Icon size={18} color={gap.color} />
                    </View>
                    <YStack>
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        {gap.category}
                      </Text>
                      <XStack alignItems="center" gap="$1" marginTop="$0.5">
                        <Text fontSize="$2" color="$textSecondary">
                          优先级：
                        </Text>
                        <View
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          backgroundColor={priority.bgColor}
                          borderRadius="$1"
                        >
                          <Text fontSize="$1" fontWeight="600" color={priority.color}>
                            {priority.label}
                          </Text>
                        </View>
                      </XStack>
                    </YStack>
                  </XStack>
                </XStack>

                <YStack gap="$1.5">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$2" color="$textSecondary">
                      建议保额
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {gap.needed}万
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$2" color="$textSecondary">
                      现有保额
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                      {gap.existing}万
                    </Text>
                  </XStack>
                  <View height={1} backgroundColor="$borderColor" marginVertical="$1" />
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      保障缺口
                    </Text>
                    <Text fontSize="$4" fontWeight="700" color={gap.gap > 0 ? COLORS.error : COLORS.success}>
                      {gap.gap > 0 ? `${gap.gap}万` : '已充足'}
                    </Text>
                  </XStack>
                </YStack>

                {/* Coverage bar */}
                <View marginTop="$2">
                  <View height={8} backgroundColor="$borderColor" borderRadius="$2">
                    <View
                      width={`${Math.min((gap.existing / gap.needed) * 100, 100)}%`}
                      height="100%"
                      backgroundColor={gap.existing >= gap.needed ? COLORS.success : gap.color}
                      borderRadius="$2"
                    />
                  </View>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    覆盖率：{Math.round((gap.existing / gap.needed) * 100)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </YStack>
      </View>
    );
  };

  const renderRecommendations = () => {
    const highPriorityGaps = coverageGaps.filter(g => g.priority === 'high' && g.gap > 0);

    if (highPriorityGaps.length === 0) {
      return (
        <View
          marginHorizontal="$4"
          marginBottom="$4"
          padding="$4"
          backgroundColor="#F0FDF4"
          borderRadius="$4"
          borderLeftWidth={3}
          borderLeftColor={COLORS.success}
        >
          <XStack alignItems="center" gap="$2" marginBottom="$2">
            <Shield size={20} color={COLORS.success} />
            <Text fontSize="$4" fontWeight="600" color={COLORS.success}>
              保障充足
            </Text>
          </XStack>
          <Text fontSize="$3" color="$text">
            您的保险配置较为完善，主要保障需求已覆盖。建议定期复查，根据家庭变化调整保障。
          </Text>
        </View>
      );
    }

    return (
      <View
        marginHorizontal="$4"
        marginBottom="$4"
        padding="$4"
        backgroundColor="#FFF7ED"
        borderRadius="$4"
        borderLeftWidth={3}
        borderLeftColor={COLORS.warning}
      >
        <XStack alignItems="center" gap="$2" marginBottom="$3">
          <AlertTriangle size={20} color={COLORS.warning} />
          <Text fontSize="$4" fontWeight="600" color="$text">
            保障缺口预警
          </Text>
        </XStack>

        <Text fontSize="$3" color="$text" marginBottom="$3">
          检测到{highPriorityGaps.length}项高优先级保障缺口，建议尽快补充：
        </Text>

        <YStack gap="$2">
          {highPriorityGaps.map((gap, index) => (
            <XStack key={gap.category} alignItems="flex-start" gap="$2">
              <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                {index + 1}.
              </Text>
              <Text fontSize="$3" color="$text" flex={1}>
                <Text fontWeight="600">{gap.category}</Text>：缺口{gap.gap}万，建议补充至{gap.needed}万保额
              </Text>
            </XStack>
          ))}
        </YStack>

        <View marginTop="$3" paddingTop="$3" borderTopWidth={1} borderTopColor="$borderColor">
          <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
            💡 建议：保险配置应遵循"先保障后理财"原则，优先配置医疗、重疾、意外、寿险等基础保障。
          </Text>
        </View>
      </View>
    );
  };

  if (analyzing) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <TrendingUp size={48} color={COLORS.primary} />
        <Text fontSize="$5" fontWeight="600" color="$text" marginTop="$4">
          正在分析您的保障缺口...
        </Text>
        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
          基于您的家庭情况和现有保单
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text flex={1} textAlign="center" fontSize="$5" fontWeight="600" color="$text">
          保障缺口分析
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Radar Chart */}
        {renderRadarChart()}

        {/* Family Responsibility */}
        {renderFamilyResponsibility()}

        {/* Existing Policies */}
        {renderExistingPolicies()}

        {/* Gap Details */}
        {renderGapDetails()}

        {/* Recommendations */}
        {renderRecommendations()}

        {/* CTA Buttons */}
        <View marginHorizontal="$4" marginBottom="$4" gap="$3">
          <Pressable
            onPress={() => {
              navigation.navigate('AIPlannerWizard' as never);
            }}
          >
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                生成AI保险规划方案
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.navigate('InsuranceAdvisorList' as never);
            }}
          >
            <View
              height={48}
              borderRadius="$3"
              backgroundColor="$surface"
              borderWidth={1.5}
              borderColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text color={COLORS.primary} fontSize="$4" fontWeight="600">
                咨询专业顾问
              </Text>
            </View>
          </Pressable>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default CoverageGapAnalysisScreen;
