import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Alert, Linking, ActivityIndicator } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  Download,
  DollarSign,
  User,
  Phone,
  CheckCircle,
  CreditCard,
  Edit,
  MessageCircle,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

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

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string | undefined } = {
      医疗险: errorColor,
      重疾险: primaryColor,
      意外险: warningColor,
      寿险: successColor,
      年金险: successColor,
    };
    return colorMap[category] || color10;
  };

  if (loading || !policy) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
        <Text fontSize="$4" color="$color12" marginTop="$3">
          加载中...
        </Text>
      </View>
    );
  }

  const categoryColor = getCategoryColor(policy.category);

  return (
    <View flex={1} backgroundColor="$background">
      <TitleBar
        title="保单详情"
        onBack={() => navigation.goBack()}
        rightAction={{
          icon: Download,
          onPress: handleDownloadPolicy,
          color: primaryColor,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Policy Header */}
        <View margin="$2.5" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <XStack alignItems="center" gap="$2" marginBottom="$2">
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
              backgroundColor={`${successColor}15`}
              borderRadius="$10"
            >
              <XStack alignItems="center" gap="$1">
                <CheckCircle size={12} color={successColor} />
                <Text fontSize="$2" color={successColor} fontWeight="600">
                  正常
                </Text>
              </XStack>
            </View>
          </XStack>

          <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$2">
            {policy.productName}
          </Text>

          <Text fontSize="$3" color="$color10" marginBottom="$1">
            {policy.companyName}
          </Text>

          <Text fontSize="$2" color="$color10">
            保单号：{policy.policyNumber}
          </Text>
        </View>

        {/* Coverage Amount */}
        <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <XStack justifyContent="space-around">
            <YStack alignItems="center" flex={1}>
              <Text fontSize="$2" color="$color10" marginBottom="$1">
                保额
              </Text>
              <Text fontSize="$6" fontWeight="700" color={categoryColor}>
                {policy.coverageAmount}万
              </Text>
            </YStack>

            <View width={1} backgroundColor="$color5" />

            <YStack alignItems="center" flex={1}>
              <Text fontSize="$2" color="$color10" marginBottom="$1">
                年缴保费
              </Text>
              <Text fontSize="$6" fontWeight="700" color={warningColor}>
                {policy.annualPremium}万
              </Text>
            </YStack>

            <View width={1} backgroundColor="$color5" />

            <YStack alignItems="center" flex={1}>
              <Text fontSize="$2" color="$color10" marginBottom="$1">
                已交保费
              </Text>
              <Text fontSize="$6" fontWeight="700" color={successColor}>
                {policy.totalPaid}万
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* Policy Holders */}
        <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            投被保人信息
          </Text>

          <YStack gap="$2">
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">
                投保人
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {policy.policyHolder}
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">
                被保人
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {policy.insured}
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">
                受益人
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {policy.beneficiary}
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* Payment Info */}
        <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            缴费信息
          </Text>

          <YStack gap="$2">
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">
                缴费期限
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {policy.paymentTerm}年
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">
                已交期数
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {policy.paidPeriods}/{policy.paymentTerm}期
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">
                缴费方式
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {policy.paymentMethod}
              </Text>
            </XStack>

            {policy.nextPaymentDate && (
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  下次缴费日期
                </Text>
                <Text fontSize="$3" fontWeight="600" color={warningColor}>
                  {policy.nextPaymentDate}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Progress Bar */}
          <View marginTop="$2">
            <View height={6} backgroundColor="$color5" borderRadius="$10">
              <View
                width={`${(policy.paidPeriods / policy.paymentTerm) * 100}%`}
                height="100%"
                backgroundColor={successColor}
                borderRadius="$10"
              />
            </View>
            <Text fontSize="$2" color="$color10" marginTop="$1">
              缴费进度 {Math.round((policy.paidPeriods / policy.paymentTerm) * 100)}%
            </Text>
          </View>
        </View>

        {/* Policy Value */}
        {(policy.cashValue || policy.dividends) && (
          <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              保单价值
            </Text>

            <YStack gap="$2">
              {policy.cashValue && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">
                    现金价值
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color={primaryColor}>
                    {policy.cashValue}万元
                  </Text>
                </XStack>
              )}

              {policy.dividends && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">
                    累计分红
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color={successColor}>
                    {policy.dividends}万元
                  </Text>
                </XStack>
              )}

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  已交保费
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {policy.totalPaid}万元
                </Text>
              </XStack>
            </YStack>
          </View>
        )}

        {/* Coverage Details */}
        <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            保障责任
          </Text>

          <YStack gap="$2">
            {policy.coverages.map((coverage, index) => (
              <View
                key={index}
                padding="$2"
                backgroundColor="$background"
                borderRadius="$4"
                borderLeftWidth={3}
                borderLeftColor={categoryColor}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {coverage.name}
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color={categoryColor}>
                    {coverage.amount}
                  </Text>
                </XStack>
                <Text fontSize="$2" color="$color10" lineHeight={18}>
                  {coverage.description}
                </Text>
              </View>
            ))}
          </YStack>
        </View>

        {/* Advisor Info */}
        {policy.advisorName && (
          <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              专属顾问
            </Text>

            <XStack alignItems="center" gap="$3" marginBottom="$2">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <User size={24} color={primaryColor} />
              </View>
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {policy.advisorName}
                </Text>
                <Text fontSize="$2" color="$color10" marginTop="$0.5">
                  专业保险顾问 · 持证上岗
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$2">
              <Pressable onPress={handleContactAdvisor} style={{ flex: 1 }}>
                <View
                  height={44}
                  borderRadius="$10"
                  backgroundColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <Phone size={16} color="white" />
                    <Text color="white" fontSize="$3" fontWeight="500">
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
                  height={44}
                  borderRadius="$10"
                  backgroundColor="$color2"
                  borderWidth={1.5}
                  borderColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <MessageCircle size={16} color={primaryColor} />
                    <Text color="$primary" fontSize="$3" fontWeight="500">
                      在线咨询
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </View>
        )}

        {/* Policy Services */}
        <View marginHorizontal="$2.5" marginBottom="$2" padding="$2" backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            保单服务
          </Text>

          <YStack gap="$2">
            <Pressable onPress={() => handlePolicyService('change_beneficiary')}>
              <View
                padding="$2"
                backgroundColor="$background"
                borderRadius="$4"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2">
                    <Edit size={18} color={color12} />
                    <Text fontSize="$3" color="$color12">
                      受益人变更
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$color10">
                    联系顾问办理
                  </Text>
                </XStack>
              </View>
            </Pressable>

            <Pressable onPress={() => handlePolicyService('change_contact')}>
              <View
                padding="$2"
                backgroundColor="$background"
                borderRadius="$4"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2">
                    <Phone size={18} color={color12} />
                    <Text fontSize="$3" color="$color12">
                      联系方式变更
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$color10">
                    联系顾问办理
                  </Text>
                </XStack>
              </View>
            </Pressable>

            <Pressable onPress={() => handlePolicyService('change_payment')}>
              <View
                padding="$2"
                backgroundColor="$background"
                borderRadius="$4"
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2">
                    <CreditCard size={18} color={color12} />
                    <Text fontSize="$3" color="$color12">
                      缴费方式变更
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$color10">
                    联系顾问办理
                  </Text>
                </XStack>
              </View>
            </Pressable>

            {policy.cashValue && policy.cashValue > 0 && (
              <Pressable onPress={() => handlePolicyService('policy_loan')}>
                <View
                  padding="$2"
                  backgroundColor="$background"
                  borderRadius="$4"
                >
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap="$2">
                      <DollarSign size={18} color={color12} />
                      <Text fontSize="$3" color="$color12">
                        保单贷款
                      </Text>
                    </XStack>
                    <Text fontSize="$2" color="$primary">
                      可贷{(policy.cashValue * 0.8).toFixed(2)}万
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            )}
          </YStack>
        </View>

        {/* Claim Button */}
        <View marginHorizontal="$2.5" marginBottom="$2.5">
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
              borderRadius="$10"
              backgroundColor="$success"
              justifyContent="center"
              alignItems="center"
            >
              <XStack alignItems="center" gap="$2">
                <FileText size={20} color="white" />
                <Text color="white" fontSize="$4" fontWeight="500">
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
