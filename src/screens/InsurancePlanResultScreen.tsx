import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Alert } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Heart,
  DollarSign,
  AlertCircle,
  Check,
  Share2,
  Save,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface PlannerData {
  age: string;
  gender: 'male' | 'female' | '';
  occupation: string;
  annualIncome: string;
  familyMembers: string;
  healthStatus: 'good' | 'subhealth' | 'chronic' | '';
  existingConditions: string[];
  medications: string;
  coverageNeeds: string[];
  budget: string;
  existingPolicies: string;
  riskPreference: 'conservative' | 'balanced' | 'aggressive' | '';
}

interface InsurancePlan {
  id: string;
  tier: 'basic' | 'standard' | 'premium';
  name: string;
  annualPremium: number;
  coverage: {
    medical: string;
    criticalIllness: string;
    accident: string;
    lifeInsurance: string;
  };
  products: {
    name: string;
    company: string;
    type: string;
    annualPremium: number;
  }[];
  highlights: string[];
  suitable: string;
}

type RouteParams = {
  InsurancePlanResult: {
    plannerData: PlannerData;
  };
};

const InsurancePlanResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsurancePlanResult'>>();
  const { plannerData } = route.params;

  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [analyzing, setAnalyzing] = useState(true);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);

  useEffect(() => {
    generateInsurancePlans();
  }, []);

  const generateInsurancePlans = async () => {
    // Simulate AI analysis
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const age = parseInt(plannerData.age);
    const budget = parseInt(plannerData.budget);
    const income = parseInt(plannerData.annualIncome);

    // Calculate coverage gap
    const familyResponsibility = calculateFamilyResponsibility(plannerData);
    const existingCoverage = calculateExistingCoverage(plannerData.existingPolicies);
    const coverageGap = familyResponsibility - existingCoverage;

    setGapAnalysis({
      familyResponsibility,
      existingCoverage,
      coverageGap,
      riskLevel: coverageGap > familyResponsibility * 0.5 ? 'high' : 'medium',
    });

    // Generate 3 plan tiers
    const generatedPlans: InsurancePlan[] = [
      {
        id: 'basic',
        tier: 'basic',
        name: '基础保障方案',
        annualPremium: Math.round(budget * 0.6),
        coverage: {
          medical: age < 40 ? '300万' : '200万',
          criticalIllness: '50万',
          accident: '100万',
          lifeInsurance: '50万',
        },
        products: [
          {
            name: '平安e生保长期医疗险',
            company: '中国平安',
            type: '医疗险',
            annualPremium: Math.round(budget * 0.25),
          },
          {
            name: '国寿福重大疾病保险',
            company: '中国人寿',
            type: '重疾险',
            annualPremium: Math.round(budget * 0.25),
          },
          {
            name: '综合意外险',
            company: '太平洋保险',
            type: '意外险',
            annualPremium: Math.round(budget * 0.1),
          },
        ],
        highlights: [
          '基础医疗保障充足',
          '重疾保额覆盖基本治疗费用',
          '性价比高，预算友好',
        ],
        suitable: '适合预算有限、追求基础保障的人群',
      },
      {
        id: 'standard',
        tier: 'standard',
        name: '全面保障方案（推荐）',
        annualPremium: budget,
        coverage: {
          medical: age < 40 ? '500万' : '300万',
          criticalIllness: '100万',
          accident: '200万',
          lifeInsurance: '100万',
        },
        products: [
          {
            name: '平安e生保长期医疗险（尊享版）',
            company: '中国平安',
            type: '医疗险',
            annualPremium: Math.round(budget * 0.3),
          },
          {
            name: '国寿福至尊版重疾险',
            company: '中国人寿',
            type: '重疾险',
            annualPremium: Math.round(budget * 0.35),
          },
          {
            name: '寿险定期保障计划',
            company: '友邦保险',
            type: '定期寿险',
            annualPremium: Math.round(budget * 0.2),
          },
          {
            name: '高额意外险',
            company: '太平洋保险',
            type: '意外险',
            annualPremium: Math.round(budget * 0.15),
          },
        ],
        highlights: [
          'AI推荐最优配置',
          '保额充足，覆盖主要风险',
          '重疾多次赔付，保障全面',
          '定期寿险覆盖家庭责任',
        ],
        suitable: `适合${age}岁、年收入${income}万的${plannerData.occupation}`,
      },
      {
        id: 'premium',
        tier: 'premium',
        name: '尊享保障方案',
        annualPremium: Math.round(budget * 1.4),
        coverage: {
          medical: '600万（含特需医疗）',
          criticalIllness: '150万',
          accident: '300万',
          lifeInsurance: '200万',
        },
        products: [
          {
            name: '高端医疗险（特需/国际部）',
            company: '友邦保险',
            type: '高端医疗',
            annualPremium: Math.round(budget * 0.45),
          },
          {
            name: '终身重疾险（多次赔付）',
            company: '太平洋保险',
            type: '重疾险',
            annualPremium: Math.round(budget * 0.5),
          },
          {
            name: '终身寿险+年金组合',
            company: '招商信诺',
            type: '寿险+年金',
            annualPremium: Math.round(budget * 0.3),
          },
          {
            name: '全球旅行意外险',
            company: '中国平安',
            type: '意外险',
            annualPremium: Math.round(budget * 0.15),
          },
        ],
        highlights: [
          '高端医疗，特需/国际部就医',
          '重疾多次赔付，保障终身',
          '寿险+年金，兼顾保障与传承',
          '全球保障，出行无忧',
        ],
        suitable: '适合追求高品质医疗和全面保障的高收入人群',
      },
    ];

    setPlans(generatedPlans);
    setAnalyzing(false);
  };

  const calculateFamilyResponsibility = (data: PlannerData): number => {
    const age = parseInt(data.age);
    const income = parseInt(data.annualIncome);
    const familySize = parseInt(data.familyMembers);

    // Simplified calculation: 5 years income + family expenses
    const baseResponsibility = income * 5;
    const familyExpenses = familySize * 10; // 10万/person
    const mortgageEstimate = age < 50 ? 100 : 50; // Assume mortgage

    return baseResponsibility + familyExpenses + mortgageEstimate;
  };

  const calculateExistingCoverage = (existingPolicies: string): number => {
    if (!existingPolicies || existingPolicies.trim() === '') {
      return 0;
    }
    // Simple estimation based on text length
    return 50; // Assume some existing coverage
  };

  const handleSavePlan = () => {
    Alert.alert('保存成功', '保险规划方案已保存到"我的方案"', [
      { text: '查看我的方案' },
      { text: '继续浏览', style: 'cancel' },
    ]);
  };

  const handleSharePlan = () => {
    Alert.alert('分享方案', '选择分享方式', [
      { text: '微信好友', onPress: () => Alert.alert('提示', '分享功能开发中') },
      { text: '生成图片', onPress: () => Alert.alert('提示', '分享功能开发中') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleConsultAdvisor = () => {
    navigation.navigate('InsuranceAdvisorList' as never);
  };

  const renderPlanCard = (plan: InsurancePlan) => {
    const isSelected = selectedPlan === plan.id;
    const tierColors = {
      basic: '#10B981',
      standard: '#3B82F6',
      premium: '#8B5CF6',
    };
    const tierLabels = {
      basic: '基础',
      standard: '推荐',
      premium: '尊享',
    };

    return (
      <Pressable key={plan.id} onPress={() => setSelectedPlan(plan.id)}>
        <View
          marginBottom="$3"
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={2}
          borderColor={isSelected ? tierColors[plan.tier] : '$borderColor'}
          overflow="hidden"
        >
          {/* Plan Header */}
          <View backgroundColor={tierColors[plan.tier]} padding="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Text fontSize="$5" fontWeight="700" color="white">
                  {plan.name}
                </Text>
                <Text fontSize="$2" color="white" opacity={0.9} marginTop="$1">
                  {plan.suitable}
                </Text>
              </YStack>
              {plan.tier === 'standard' && (
                <View
                  backgroundColor="white"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={tierColors[plan.tier]} fontWeight="600">
                    AI推荐
                  </Text>
                </View>
              )}
            </XStack>
            <XStack alignItems="baseline" marginTop="$2">
              <Text fontSize="$8" fontWeight="700" color="white">
                {(plan.annualPremium / 10000).toFixed(1)}
              </Text>
              <Text fontSize="$3" color="white" marginLeft="$1">
                万元/年
              </Text>
            </XStack>
          </View>

          {/* Coverage Summary */}
          <View padding="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              保障额度
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  医疗保障
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {plan.coverage.medical}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  重疾保障
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {plan.coverage.criticalIllness}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  意外保障
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {plan.coverage.accident}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  寿险保障
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {plan.coverage.lifeInsurance}
                </Text>
              </XStack>
            </YStack>
          </View>

          {/* Highlights */}
          <View padding="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              方案亮点
            </Text>
            <YStack gap="$1.5">
              {plan.highlights.map((highlight, index) => (
                <XStack key={index} alignItems="center" gap="$2">
                  <Check size={14} color={tierColors[plan.tier]} />
                  <Text fontSize="$2" color="$text">
                    {highlight}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </View>

          {/* Products */}
          <View padding="$3">
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              推荐产品 ({plan.products.length}款)
            </Text>
            <YStack gap="$2">
              {plan.products.map((product, index) => (
                <View
                  key={index}
                  backgroundColor="$background"
                  padding="$2"
                  borderRadius="$2"
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {product.name}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$0.5">
                        {product.company} · {product.type}
                      </Text>
                    </YStack>
                    <Text fontSize="$3" fontWeight="600" color={tierColors[plan.tier]}>
                      {(product.annualPremium / 10000).toFixed(2)}万
                    </Text>
                  </XStack>
                </View>
              ))}
            </YStack>
          </View>
        </View>
      </Pressable>
    );
  };

  if (analyzing) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <TrendingUp size={48} color={COLORS.primary} />
        <Text fontSize="$5" fontWeight="600" color="$text" marginTop="$4">
          AI正在分析您的保障需求...
        </Text>
        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
          基于您的年龄、健康状况和预算生成个性化方案
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
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          AI保险规划方案
        </Text>
        <View flex={1} />
        <XStack gap="$3">
          <Pressable onPress={handleSharePlan}>
            <Share2 size={22} color={COLORS.text} />
          </Pressable>
          <Pressable onPress={handleSavePlan}>
            <Save size={22} color={COLORS.text} />
          </Pressable>
        </XStack>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Coverage Gap Analysis */}
        {gapAnalysis && (
          <View margin="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
            <XStack alignItems="center" gap="$2" marginBottom="$3">
              <Shield size={24} color={COLORS.primary} />
              <Text fontSize="$4" fontWeight="600" color="$text">
                保障缺口分析
              </Text>
            </XStack>

            <YStack gap="$3">
              <View>
                <XStack justifyContent="space-between" marginBottom="$1">
                  <Text fontSize="$2" color="$textSecondary">
                    家庭责任总额
                  </Text>
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {gapAnalysis.familyResponsibility}万
                  </Text>
                </XStack>
                <View height={8} backgroundColor="$borderColor" borderRadius="$2">
                  <View
                    width="100%"
                    height="100%"
                    backgroundColor={COLORS.primary}
                    borderRadius="$2"
                  />
                </View>
              </View>

              <View>
                <XStack justifyContent="space-between" marginBottom="$1">
                  <Text fontSize="$2" color="$textSecondary">
                    现有保障额度
                  </Text>
                  <Text fontSize="$4" fontWeight="600" color={COLORS.success}>
                    {gapAnalysis.existingCoverage}万
                  </Text>
                </XStack>
                <View height={8} backgroundColor="$borderColor" borderRadius="$2">
                  <View
                    width={`${(gapAnalysis.existingCoverage / gapAnalysis.familyResponsibility) * 100}%`}
                    height="100%"
                    backgroundColor={COLORS.success}
                    borderRadius="$2"
                  />
                </View>
              </View>

              <View>
                <XStack justifyContent="space-between" marginBottom="$1">
                  <Text fontSize="$2" color="$textSecondary">
                    保障缺口
                  </Text>
                  <Text fontSize="$4" fontWeight="600" color={COLORS.warning}>
                    {gapAnalysis.coverageGap}万
                  </Text>
                </XStack>
                <View height={8} backgroundColor="$borderColor" borderRadius="$2">
                  <View
                    width={`${(gapAnalysis.coverageGap / gapAnalysis.familyResponsibility) * 100}%`}
                    height="100%"
                    backgroundColor={COLORS.warning}
                    borderRadius="$2"
                  />
                </View>
              </View>
            </YStack>

            <View
              marginTop="$3"
              padding="$2"
              backgroundColor="#FFF7ED"
              borderRadius="$2"
              borderLeftWidth={3}
              borderLeftColor={COLORS.warning}
            >
              <XStack alignItems="flex-start" gap="$2">
                <AlertCircle size={16} color={COLORS.warning} style={{ marginTop: 2 }} />
                <Text fontSize="$2" color="$text" flex={1}>
                  您的家庭保障缺口较大，建议尽快配置充足的保险保障，避免因意外或疾病导致家庭经济压力
                </Text>
              </XStack>
            </View>
          </View>
        )}

        {/* AI Recommendation Explanation */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="#EEF2FF" borderRadius="$4">
          <XStack alignItems="center" gap="$2" marginBottom="$2">
            <TrendingUp size={20} color={COLORS.primary} />
            <Text fontSize="$4" fontWeight="600" color="$text">
              AI推荐理由
            </Text>
          </XStack>
          <Text fontSize="$3" color="$text" lineHeight={22}>
            基于您{plannerData.age}岁的年龄、{plannerData.healthStatus === 'good' ? '良好' : '一般'}的健康状况、
            {plannerData.budget}万的预算，以及{plannerData.coverageNeeds.length}项保障需求，
            AI为您量身定制了{plans.length}套方案。推荐选择「全面保障方案」，
            保额充足且性价比最优，最适合您当前的人生阶段。
          </Text>
        </View>

        {/* Plan Cards */}
        <View paddingHorizontal="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            为您推荐{plans.length}套方案
          </Text>
          {plans.map(plan => renderPlanCard(plan))}
        </View>

        {/* Consult Advisor CTA */}
        <View margin="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <XStack alignItems="center" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={`${COLORS.primary}20`}
              justifyContent="center"
              alignItems="center"
            >
              <MessageCircle size={24} color={COLORS.primary} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$text">
                需要专业顾问精细化调整？
              </Text>
              <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                预约专业顾问为您量身定制保险方案
              </Text>
            </YStack>
          </XStack>
          <Pressable onPress={handleConsultAdvisor} style={{ marginTop: 12 }}>
            <View
              height={44}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                预约顾问咨询
              </Text>
            </View>
          </Pressable>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsurancePlanResultScreen;
