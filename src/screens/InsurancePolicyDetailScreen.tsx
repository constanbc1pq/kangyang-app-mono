import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Alert, Linking } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  FileText,
  Download,
  Shield,
  DollarSign,
  Calendar,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  CreditCard,
  RefreshCw,
  Edit,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface PolicyDetail {
  id: string;
  policyNumber: string;
  productName: string;
  companyName: string;
  companyPhone: string;
  category: string;
  status: string;

  // 保单信息
  policyHolder: string;
  policyHolderIdCard: string;
  insured: string;
  insuredIdCard: string;
  beneficiary: string;
  beneficiaryRelation: string;

  // 保障信息
  coverageAmount: number;
  annualPremium: number;
  paymentTerm: number;
  coverageTerm: string;
  effectiveDate: string;
  expiryDate?: string;

  // 缴费信息
  paidPeriods: number;
  nextPaymentDate?: string;
  paymentMethod: string;
  totalPaid: number;

  // 保单价值
  cashValue?: number;
  dividends?: number;

  // 保障责任
  coverages: {
    name: string;
    amount: string;
    description: string;
  }[];

  // 顾问信息
  advisorName?: string;
  advisorPhone?: string;
  advisorWeChat?: string;

  // 电子保单
  policyDocumentUrl?: string;
}

type RouteParams = {
  InsurancePolicyDetail: {
    policyId: string;
  };
};

const InsurancePolicyDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsurancePolicyDetail'>>();
  const { policyId } = route.params;

  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicyDetail();
  }, [policyId]);

  const loadPolicyDetail = async () => {
    setLoading(true);

    // Mock data
    const mockPolicy: PolicyDetail = {
      id: policyId,
      policyNumber: 'PA2024001234567',
      productName: '平安e生保长期医疗险',
      companyName: '中国平安',
      companyPhone: '95511',
      category: '医疗险',
      status: 'active',

      policyHolder: '张三',
      policyHolderIdCard: '110101199001011234',
      insured: '张三',
      insuredIdCard: '110101199001011234',
      beneficiary: '法定',
      beneficiaryRelation: '法定继承人',

      coverageAmount: 300,
      annualPremium: 1.2,
      paymentTerm: 20,
      coverageTerm: '至80岁',
      effectiveDate: '2023-01-15',
      expiryDate: '2063-01-15',

      paidPeriods: 2,
      nextPaymentDate: '2025-01-15',
      paymentMethod: '年交',
      totalPaid: 2.4,

      cashValue: 2.0,
      dividends: 0.15,

      coverages: [
        {
          name: '一般住院医疗',
          amount: '300万元',
          description: '包含住院医疗费用、特殊门诊、门诊手术等',
        },
        {
          name: '重大疾病住院医疗',
          amount: '600万元',
          description: '120种重大疾病医疗费用翻倍保障',
        },
        {
          name: '质子重离子治疗',
          amount: '300万元',
          description: '100%报销质子重离子治疗费用',
        },
        {
          name: '院外特药',
          amount: '300万元',
          description: '108种院外特定药品费用报销',
        },
      ],

      advisorName: '李明',
      advisorPhone: '13800138001',
      advisorWeChat: 'liming_insurance',

      policyDocumentUrl: 'https://example.com/policy.pdf',
    };

    setPolicy(mockPolicy);
    setLoading(false);
  };

  const handleDownloadPolicy = () => {
    if (policy?.policyDocumentUrl) {
      Alert.alert('提示', '电子保单下载功能开发中', [
        {
          text: '确定',
        },
      ]);
    }
  };

  const handleContactAdvisor = () => {
    if (policy?.advisorPhone) {
      Alert.alert('联系顾问', `拨打电话：${policy.advisorPhone}`, [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '拨打电话',
          onPress: () => {
            Linking.openURL(`tel:${policy.advisorPhone}`);
          },
        },
      ]);
    }
  };

  const handlePolicyService = (serviceType: string) => {
    const serviceMap: { [key: string]: string } = {
      change_beneficiary: '受益人变更',
      change_contact: '联系方式变更',
      change_payment: '缴费方式变更',
      policy_loan: '保单贷款',
      reinstate: '保单复效',
      surrender: '退保',
    };

    Alert.alert(
      serviceMap[serviceType],
      '该功能需要联系您的保险顾问或拨打保险公司客服热线办理',
      [
        {
          text: '联系顾问',
          onPress: handleContactAdvisor,
        },
        {
          text: '客服热线',
          onPress: () => {
            if (policy?.companyPhone) {
              Linking.openURL(`tel:${policy.companyPhone}`);
            }
          },
        },
        {
          text: '取消',
          style: 'cancel',
        },
      ]
    );
  };

  if (loading || !policy) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <RefreshCw size={32} color={COLORS.primary} />
        <Text fontSize="$4" color="$text" marginTop="$3">
          加载中...
        </Text>
      </View>
    );
  }

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      医疗险: '#EF4444',
      重疾险: '#8B5CF6',
      意外险: '#F59E0B',
      寿险: '#3B82F6',
      年金险: '#10B981',
    };
    return colorMap[category] || '#6B7280';
  };

  const categoryColor = getCategoryColor(policy.category);

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
          保单详情
        </Text>
        <View flex={1} />
        <Pressable onPress={handleDownloadPolicy}>
          <Download size={22} color={COLORS.primary} />
        </Pressable>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Policy Header */}
        <View margin="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <XStack alignItems="center" gap="$2" marginBottom="$3">
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
              backgroundColor="#D1FAE5"
              borderRadius="$2"
            >
              <XStack alignItems="center" gap="$1">
                <CheckCircle size={12} color={COLORS.success} />
                <Text fontSize="$2" color={COLORS.success} fontWeight="600">
                  正常
                </Text>
              </XStack>
            </View>
          </XStack>

          <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$2">
            {policy.productName}
          </Text>

          <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
            {policy.companyName}
          </Text>

          <Text fontSize="$2" color="$textSecondary">
            保单号：{policy.policyNumber}
          </Text>
        </View>

        {/* Coverage Amount */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <XStack justifyContent="space-around">
            <YStack alignItems="center" flex={1}>
              <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                保额
              </Text>
              <Text fontSize="$6" fontWeight="700" color={categoryColor}>
                {policy.coverageAmount}万
              </Text>
            </YStack>

            <View width={1} backgroundColor="$borderColor" />

            <YStack alignItems="center" flex={1}>
              <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                年缴保费
              </Text>
              <Text fontSize="$6" fontWeight="700" color={COLORS.warning}>
                {policy.annualPremium}万
              </Text>
            </YStack>

            <View width={1} backgroundColor="$borderColor" />

            <YStack alignItems="center" flex={1}>
              <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                已交保费
              </Text>
              <Text fontSize="$6" fontWeight="700" color={COLORS.success}>
                {policy.totalPaid}万
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* Policy Holders */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            投被保人信息
          </Text>

          <YStack gap="$2.5">
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                投保人
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {policy.policyHolder}
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                被保人
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {policy.insured}
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                受益人
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {policy.beneficiary}
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* Payment Info */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            缴费信息
          </Text>

          <YStack gap="$2.5">
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                缴费期限
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {policy.paymentTerm}年
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                已交期数
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {policy.paidPeriods}/{policy.paymentTerm}期
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                缴费方式
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {policy.paymentMethod}
              </Text>
            </XStack>

            {policy.nextPaymentDate && (
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  下次缴费日期
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                  {policy.nextPaymentDate}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Progress Bar */}
          <View marginTop="$3">
            <View height={6} backgroundColor="$borderColor" borderRadius="$2">
              <View
                width={`${(policy.paidPeriods / policy.paymentTerm) * 100}%`}
                height="100%"
                backgroundColor={COLORS.success}
                borderRadius="$2"
              />
            </View>
            <Text fontSize="$2" color="$textSecondary" marginTop="$1">
              缴费进度 {Math.round((policy.paidPeriods / policy.paymentTerm) * 100)}%
            </Text>
          </View>
        </View>

        {/* Policy Value */}
        {(policy.cashValue || policy.dividends) && (
          <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              保单价值
            </Text>

            <YStack gap="$2.5">
              {policy.cashValue && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    现金价值
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                    {policy.cashValue}万元
                  </Text>
                </XStack>
              )}

              {policy.dividends && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    累计分红
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                    {policy.dividends}万元
                  </Text>
                </XStack>
              )}

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  已交保费
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {policy.totalPaid}万元
                </Text>
              </XStack>
            </YStack>
          </View>
        )}

        {/* Coverage Details */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            保障责任
          </Text>

          <YStack gap="$3">
            {policy.coverages.map((coverage, index) => (
              <View
                key={index}
                padding="$3"
                backgroundColor="$background"
                borderRadius="$3"
                borderLeftWidth={3}
                borderLeftColor={categoryColor}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {coverage.name}
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color={categoryColor}>
                    {coverage.amount}
                  </Text>
                </XStack>
                <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                  {coverage.description}
                </Text>
              </View>
            ))}
          </YStack>
        </View>

        {/* Advisor Info */}
        {policy.advisorName && (
          <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              专属顾问
            </Text>

            <XStack alignItems="center" gap="$3" marginBottom="$3">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={`${COLORS.primary}20`}
                justifyContent="center"
                alignItems="center"
              >
                <User size={24} color={COLORS.primary} />
              </View>
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="$text">
                  {policy.advisorName}
                </Text>
                <Text fontSize="$2" color="$textSecondary" marginTop="$0.5">
                  专业保险顾问 · 持证上岗
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$2">
              <Pressable onPress={handleContactAdvisor} style={{ flex: 1 }}>
                <View
                  height={40}
                  borderRadius="$2"
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <Phone size={16} color="white" />
                    <Text color="white" fontSize="$3" fontWeight="600">
                      电话联系
                    </Text>
                  </XStack>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate('InsuranceTextConsultation' as never, {
                    advisorId: 'advisor_001',
                    advisorName: policy.advisorName,
                  } as never);
                }}
                style={{ flex: 1 }}
              >
                <View
                  height={40}
                  borderRadius="$2"
                  backgroundColor="$surface"
                  borderWidth={1.5}
                  borderColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <MessageCircle size={16} color={COLORS.primary} />
                    <Text color={COLORS.primary} fontSize="$3" fontWeight="600">
                      在线咨询
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </View>
        )}

        {/* Policy Services */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            保单服务
          </Text>

          <YStack gap="$2">
            <Pressable onPress={() => handlePolicyService('change_beneficiary')}>
              <View
                padding="$3"
                backgroundColor="$background"
                borderRadius="$3"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2">
                    <Edit size={18} color={COLORS.text} />
                    <Text fontSize="$3" color="$text">
                      受益人变更
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    联系顾问办理
                  </Text>
                </XStack>
              </View>
            </Pressable>

            <Pressable onPress={() => handlePolicyService('change_contact')}>
              <View
                padding="$3"
                backgroundColor="$background"
                borderRadius="$3"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2">
                    <Phone size={18} color={COLORS.text} />
                    <Text fontSize="$3" color="$text">
                      联系方式变更
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    联系顾问办理
                  </Text>
                </XStack>
              </View>
            </Pressable>

            <Pressable onPress={() => handlePolicyService('change_payment')}>
              <View
                padding="$3"
                backgroundColor="$background"
                borderRadius="$3"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2">
                    <CreditCard size={18} color={COLORS.text} />
                    <Text fontSize="$3" color="$text">
                      缴费方式变更
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    联系顾问办理
                  </Text>
                </XStack>
              </View>
            </Pressable>

            {policy.cashValue && policy.cashValue > 0 && (
              <Pressable onPress={() => handlePolicyService('policy_loan')}>
                <View
                  padding="$3"
                  backgroundColor="$background"
                  borderRadius="$3"
                >
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap="$2">
                      <DollarSign size={18} color={COLORS.text} />
                      <Text fontSize="$3" color="$text">
                        保单贷款
                      </Text>
                    </XStack>
                    <Text fontSize="$2" color={COLORS.primary}>
                      可贷{(policy.cashValue * 0.8).toFixed(2)}万
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            )}
          </YStack>
        </View>

        {/* Claim Button */}
        <View marginHorizontal="$4" marginBottom="$4">
          <Pressable
            onPress={() => {
              navigation.navigate('ClaimAssistance' as never, {
                policyId: policy.id,
                policyNumber: policy.policyNumber,
              } as never);
            }}
          >
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.success}
              justifyContent="center"
              alignItems="center"
            >
              <XStack alignItems="center" gap="$2">
                <FileText size={20} color="white" />
                <Text color="white" fontSize="$4" fontWeight="600">
                  申请理赔
                </Text>
              </XStack>
            </View>
          </Pressable>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsurancePolicyDetailScreen;
