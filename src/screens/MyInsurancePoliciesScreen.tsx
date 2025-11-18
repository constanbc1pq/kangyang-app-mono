import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
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
import { COLORS } from '@/constants/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const colorMap: { [key: string]: string } = {
      医疗险: '#EF4444',
      重疾险: '#8B5CF6',
      意外险: '#F59E0B',
      寿险: '#3B82F6',
      年金险: '#10B981',
      财产险: '#06B6D4',
      其他: '#6B7280',
    };
    return colorMap[category] || '#6B7280';
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        label: '正常',
        color: COLORS.success,
        bgColor: '#D1FAE5',
        icon: CheckCircle,
      },
      expiring_soon: {
        label: '即将到期',
        color: COLORS.warning,
        bgColor: '#FEF3C7',
        icon: Clock,
      },
      lapsed: {
        label: '已失效',
        color: COLORS.error,
        bgColor: '#FEE2E2',
        icon: AlertCircle,
      },
      claimed: {
        label: '已理赔',
        color: COLORS.primary,
        bgColor: '#DBEAFE',
        icon: CheckCircle,
      },
      surrendered: {
        label: '已退保',
        color: COLORS.textSecondary,
        bgColor: '#F3F4F6',
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
          marginBottom="$3"
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
        >
          {/* Header */}
          <View padding="$3" backgroundColor={`${categoryColor}15`}>
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2" flex={1}>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor={categoryColor}
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {policy.category}
                  </Text>
                </View>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor={statusConfig.bgColor}
                  borderRadius="$2"
                >
                  <XStack alignItems="center" gap="$1">
                    <StatusIcon size={12} color={statusConfig.color} />
                    <Text fontSize="$2" color={statusConfig.color} fontWeight="600">
                      {statusConfig.label}
                    </Text>
                  </XStack>
                </View>
              </XStack>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </XStack>

            <Text fontSize="$4" fontWeight="600" color="$text" marginTop="$2">
              {policy.productName}
            </Text>
            <Text fontSize="$2" color="$textSecondary" marginTop="$1">
              {policy.companyName} · {policy.policyNumber}
            </Text>
          </View>

          {/* Body */}
          <View padding="$3">
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  保额
                </Text>
                <Text fontSize="$4" fontWeight="600" color={categoryColor}>
                  {policy.coverageAmount}万元
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  年缴保费
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {policy.annualPremium}万元
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  缴费进度
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {policy.paidPeriods}/{policy.paymentTerm}期
                </Text>
              </XStack>

              {policy.nextPaymentDate && policy.status === 'active' && (
                <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
                  <XStack alignItems="center" gap="$1">
                    <Calendar size={14} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary">
                      下次缴费
                    </Text>
                  </XStack>
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={daysUntil <= 30 ? COLORS.warning : COLORS.text}
                  >
                    {policy.nextPaymentDate} ({daysUntil}天后)
                  </Text>
                </XStack>
              )}

              {policy.status === 'expiring_soon' && daysUntil > 0 && daysUntil <= 30 && (
                <View
                  marginTop="$2"
                  padding="$2"
                  backgroundColor="#FFF7ED"
                  borderRadius="$2"
                  borderLeftWidth={3}
                  borderLeftColor={COLORS.warning}
                >
                  <XStack alignItems="center" gap="$2">
                    <Clock size={14} color={COLORS.warning} />
                    <Text fontSize="$2" color="$text">
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
          我的保单
        </Text>
        <Pressable
          onPress={() => {
            // Navigate to add policy or insurance home
            navigation.navigate('InsuranceHome' as never);
          }}
        >
          <Plus size={24} color={COLORS.primary} />
        </Pressable>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Summary Card */}
        <View margin="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            保障总览
          </Text>

          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={`${COLORS.primary}20`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Shield size={18} color={COLORS.primary} />
                </View>
                <Text fontSize="$3" color="$text">
                  总保额
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                {totalCoverage}万元
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={`${COLORS.warning}20`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <DollarSign size={18} color={COLORS.warning} />
                </View>
                <Text fontSize="$3" color="$text">
                  年度保费支出
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={COLORS.warning}>
                {totalAnnualPremium.toFixed(2)}万元
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor={`${COLORS.success}20`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <FileText size={18} color={COLORS.success} />
                </View>
                <Text fontSize="$3" color="$text">
                  保单数量
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={COLORS.success}>
                {filteredPolicies.length}份
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* Filters */}
        <View marginHorizontal="$4" marginBottom="$4">
          {/* Status Filter */}
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
            保单状态
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" marginBottom="$3">
              {[
                { value: 'all', label: '全部' },
                { value: 'active', label: '正常' },
                { value: 'expiring_soon', label: '即将到期' },
                { value: 'lapsed', label: '已失效' },
              ].map(status => (
                <Pressable key={status.value} onPress={() => setSelectedStatus(status.value)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$2"
                    backgroundColor={selectedStatus === status.value ? COLORS.primary : '$borderColor'}
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="600"
                      color={selectedStatus === status.value ? 'white' : '$text'}
                    >
                      {status.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>

          {/* Category Filter */}
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
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
                    paddingVertical="$2"
                    borderRadius="$2"
                    backgroundColor={
                      selectedCategory === category.value ? COLORS.primary : '$borderColor'
                    }
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="600"
                      color={selectedCategory === category.value ? 'white' : '$text'}
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
        <View paddingHorizontal="$4">
          {filteredPolicies.length === 0 ? (
            <View padding="$8" alignItems="center">
              <FileText size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
                暂无保单记录
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2" textAlign="center">
                快去选购适合您的保险产品吧
              </Text>
              <Pressable
                onPress={() => navigation.navigate('InsuranceProductList' as never)}
                style={{ marginTop: 16 }}
              >
                <View
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  backgroundColor={COLORS.primary}
                  borderRadius="$2"
                >
                  <Text color="white" fontSize="$3" fontWeight="600">
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
        <View marginHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            快捷服务
          </Text>

          <YStack gap="$2">
            <Pressable
              onPress={() => {
                navigation.navigate('CoverageGapAnalysis' as never);
              }}
            >
              <View
                padding="$3"
                backgroundColor="$surface"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$3">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${COLORS.primary}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TrendingUp size={20} color={COLORS.primary} />
                    </View>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      保障缺口分析
                    </Text>
                  </XStack>
                  <ChevronRight size={20} color={COLORS.textSecondary} />
                </XStack>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate('ClaimAssistance' as never);
              }}
            >
              <View
                padding="$3"
                backgroundColor="$surface"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$3">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${COLORS.success}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FileText size={20} color={COLORS.success} />
                    </View>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      申请理赔
                    </Text>
                  </XStack>
                  <ChevronRight size={20} color={COLORS.textSecondary} />
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
