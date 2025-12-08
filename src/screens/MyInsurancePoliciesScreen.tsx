import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Calendar,
  Plus,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

interface InsurancePolicy {
  id: string;
  policyNumber: string;
  productName: string;
  companyName: string;
  category: string;
  policyHolder: string;
  insured: string;
  coverageAmount: number;
  annualPremium: number;
  paymentTerm: number;
  coverageTerm: string;
  effectiveDate: string;
  nextPaymentDate?: string;
  paidPeriods: number;
  status: 'active' | 'expiring_soon' | 'lapsed' | 'claimed' | 'surrendered';
  advisorName?: string;
  advisorPhone?: string;
}

const MyInsurancePoliciesScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      // Mock data - in real app, would fetch from backend
      const mockPolicies: InsurancePolicy[] = [
        {
          id: 'policy_001',
          policyNumber: 'PA2024001234567',
          productName: '平安e生保长期医疗险',
          companyName: '中国平安',
          category: '医疗险',
          policyHolder: '张三',
          insured: '张三',
          coverageAmount: 300,
          annualPremium: 1.2,
          paymentTerm: 20,
          coverageTerm: '至80岁',
          effectiveDate: '2023-01-15',
          nextPaymentDate: '2025-01-15',
          paidPeriods: 2,
          status: 'active',
          advisorName: '李明',
          advisorPhone: '13800138001',
        },
        {
          id: 'policy_002',
          policyNumber: 'CL2023009876543',
          productName: '国寿福重大疾病保险',
          companyName: '中国人寿',
          category: '重疾险',
          policyHolder: '张三',
          insured: '张三',
          coverageAmount: 50,
          annualPremium: 0.8,
          paymentTerm: 20,
          coverageTerm: '终身',
          effectiveDate: '2022-06-10',
          nextPaymentDate: '2025-06-10',
          paidPeriods: 3,
          status: 'active',
          advisorName: '王芳',
          advisorPhone: '13900139002',
        },
        {
          id: 'policy_003',
          policyNumber: 'TP2024005555555',
          productName: '综合意外险',
          companyName: '太平洋保险',
          category: '意外险',
          policyHolder: '张三',
          insured: '张三',
          coverageAmount: 100,
          annualPremium: 0.05,
          paymentTerm: 1,
          coverageTerm: '1年',
          effectiveDate: '2024-12-01',
          nextPaymentDate: '2025-12-01',
          paidPeriods: 1,
          status: 'active',
        },
        {
          id: 'policy_004',
          policyNumber: 'AIA2020001234567',
          productName: '定期寿险保障计划',
          companyName: '友邦保险',
          category: '寿险',
          policyHolder: '张三',
          insured: '张三',
          coverageAmount: 200,
          annualPremium: 1.5,
          paymentTerm: 20,
          coverageTerm: '至60岁',
          effectiveDate: '2020-03-20',
          nextPaymentDate: '2025-01-05',
          paidPeriods: 5,
          status: 'expiring_soon',
          advisorName: '陈建国',
          advisorPhone: '13700137003',
        },
      ];

      setPolicies(mockPolicies);
    } catch (error) {
      console.error('Failed to load policies:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPolicies();
    setRefreshing(false);
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string | undefined } = {
      医疗险: errorColor,
      重疾险: primaryColor,
      意外险: warningColor,
      寿险: successColor,
      年金险: successColor,
      财产险: primaryColor,
      其他: color10,
    };
    return colorMap[category] || color10;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        label: '正常',
        color: successColor,
        bgColor: `${successColor}15`,
        icon: CheckCircle,
      },
      expiring_soon: {
        label: '即将到期',
        color: warningColor,
        bgColor: `${warningColor}15`,
        icon: Clock,
      },
      lapsed: {
        label: '已失效',
        color: errorColor,
        bgColor: `${errorColor}15`,
        icon: AlertCircle,
      },
      claimed: {
        label: '已理赔',
        color: primaryColor,
        bgColor: `${primaryColor}15`,
        icon: CheckCircle,
      },
      surrendered: {
        label: '已退保',
        color: color10,
        bgColor: `${color10}15`,
        icon: AlertCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const calculateDaysUntilPayment = (nextPaymentDate?: string): number => {
    if (!nextPaymentDate) return 0;
    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPolicies = policies.filter(policy => {
    if (selectedStatus !== 'all' && policy.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && policy.category !== selectedCategory) return false;
    return true;
  });

  const totalCoverage = filteredPolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
  const totalAnnualPremium = filteredPolicies.reduce((sum, p) => sum + p.annualPremium, 0);

  const renderPolicyCard = (policy: InsurancePolicy) => {
    const statusConfig = getStatusConfig(policy.status);
    const StatusIcon = statusConfig.icon;
    const categoryColor = getCategoryColor(policy.category);
    const daysUntil = calculateDaysUntilPayment(policy.nextPaymentDate);

    return (
      <Pressable
        key={policy.id}
        onPress={() => {
          navigation.navigate('InsurancePolicyDetail' as never, { policyId: policy.id } as never);
        }}
      >
        <View
          marginBottom="$2"
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          overflow="hidden"
        >
          {/* Header */}
          <View padding="$2" backgroundColor={`${categoryColor}15`}>
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2" flex={1}>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  backgroundColor={categoryColor}
                  borderRadius="$10"
                >
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {policy.category}
                  </Text>
                </View>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  backgroundColor={statusConfig.bgColor}
                  borderRadius="$10"
                >
                  <XStack alignItems="center" gap="$1">
                    <StatusIcon size={12} color={statusConfig.color} />
                    <Text fontSize="$2" color={statusConfig.color} fontWeight="600">
                      {statusConfig.label}
                    </Text>
                  </XStack>
                </View>
              </XStack>
              <ChevronRight size={20} color={color10} />
            </XStack>

            <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
              {policy.productName}
            </Text>
            <Text fontSize="$2" color="$color10" marginTop="$1">
              {policy.companyName} · {policy.policyNumber}
            </Text>
          </View>

          {/* Body */}
          <View padding="$2">
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  保额
                </Text>
                <Text fontSize="$4" fontWeight="600" color={categoryColor}>
                  {policy.coverageAmount}万元
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  年缴保费
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {policy.annualPremium}万元
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  缴费进度
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {policy.paidPeriods}/{policy.paymentTerm}期
                </Text>
              </XStack>

              {policy.nextPaymentDate && policy.status === 'active' && (
                <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
                  <XStack alignItems="center" gap="$1">
                    <Calendar size={14} color={color10} />
                    <Text fontSize="$2" color="$color10">
                      下次缴费
                    </Text>
                  </XStack>
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={daysUntil <= 30 ? warningColor : color12}
                  >
                    {policy.nextPaymentDate} ({daysUntil}天后)
                  </Text>
                </XStack>
              )}

              {policy.status === 'expiring_soon' && daysUntil > 0 && daysUntil <= 30 && (
                <View
                  marginTop="$2"
                  padding="$2"
                  backgroundColor={`${warningColor}10`}
                  borderRadius="$4"
                  borderLeftWidth={3}
                  borderLeftColor={warningColor}
                >
                  <XStack alignItems="center" gap="$2">
                    <Clock size={14} color={warningColor} />
                    <Text fontSize="$2" color="$color12">
                      距离下次缴费还有{daysUntil}天，请及时缴费避免保单失效
                    </Text>
                  </XStack>
                </View>
              )}
            </YStack>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      <TitleBar
        title="我的保单"
        onBack={() => navigation.goBack()}
        rightAction={{
          icon: Plus,
          onPress: () => navigation.navigate('InsuranceHome' as never),
          color: primaryColor,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Summary Card */}
        <View margin="$2.5" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            保障总览
          </Text>

          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={`${primaryColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Shield size={18} color={primaryColor} />
                </View>
                <Text fontSize="$3" color="$color12">
                  总保额
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={primaryColor}>
                {totalCoverage}万元
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={`${warningColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <DollarSign size={18} color={warningColor} />
                </View>
                <Text fontSize="$3" color="$color12">
                  年度保费支出
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={warningColor}>
                {totalAnnualPremium.toFixed(2)}万元
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={`${successColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <FileText size={18} color={successColor} />
                </View>
                <Text fontSize="$3" color="$color12">
                  保单数量
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={successColor}>
                {filteredPolicies.length}份
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* Filters */}
        <View marginHorizontal="$2.5" marginBottom="$2.5">
          {/* Status Filter */}
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
            保单状态
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" marginBottom="$2">
              {[
                { value: 'all', label: '全部' },
                { value: 'active', label: '正常' },
                { value: 'expiring_soon', label: '即将到期' },
                { value: 'lapsed', label: '已失效' },
              ].map(status => (
                <Pressable key={status.value} onPress={() => setSelectedStatus(status.value)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor={selectedStatus === status.value ? '$primary' : '$color4'}
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="500"
                      color={selectedStatus === status.value ? 'white' : '$color12'}
                    >
                      {status.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>

          {/* Category Filter */}
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
            险种类别
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              {[
                { value: 'all', label: '全部险种' },
                { value: '医疗险', label: '医疗险' },
                { value: '重疾险', label: '重疾险' },
                { value: '意外险', label: '意外险' },
                { value: '寿险', label: '寿险' },
                { value: '年金险', label: '年金险' },
              ].map(category => (
                <Pressable key={category.value} onPress={() => setSelectedCategory(category.value)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor={selectedCategory === category.value ? '$primary' : '$color4'}
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="500"
                      color={selectedCategory === category.value ? 'white' : '$color12'}
                    >
                      {category.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>
        </View>

        {/* Policy List */}
        <View paddingHorizontal="$2.5">
          {filteredPolicies.length === 0 ? (
            <View padding="$8" alignItems="center">
              <FileText size={48} color={color10} />
              <Text fontSize="$4" color="$color12" marginTop="$4">
                暂无保单记录
              </Text>
              <Text fontSize="$3" color="$color10" marginTop="$2" textAlign="center">
                快去选购适合您的保险产品吧
              </Text>
              <Pressable
                onPress={() => navigation.navigate('InsuranceProductList' as never)}
                style={{ marginTop: 16 }}
              >
                <View
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  backgroundColor="$primary"
                  borderRadius="$10"
                >
                  <Text color="white" fontSize="$3" fontWeight="500">
                    浏览保险产品
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <>
              {filteredPolicies.map(policy => renderPolicyCard(policy))}
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View marginHorizontal="$2.5" marginBottom="$2.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            快捷服务
          </Text>

          <YStack gap="$2">
            <Pressable
              onPress={() => {
                navigation.navigate('CoverageGapAnalysis' as never);
              }}
            >
              <View
                padding="$2"
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$3">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${primaryColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TrendingUp size={20} color={primaryColor} />
                    </View>
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      保障缺口分析
                    </Text>
                  </XStack>
                  <ChevronRight size={20} color={color10} />
                </XStack>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('ClaimAssistance' as never);
              }}
            >
              <View
                padding="$2"
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$3">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${successColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FileText size={20} color={successColor} />
                    </View>
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      申请理赔
                    </Text>
                  </XStack>
                  <ChevronRight size={20} color={color10} />
                </XStack>
              </View>
            </Pressable>
          </YStack>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default MyInsurancePoliciesScreen;
