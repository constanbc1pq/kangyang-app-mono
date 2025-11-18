import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Calendar,
  Phone,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClaimRecord {
  id: string;
  policyNumber: string;
  productName?: string;
  claimType: string;
  incidentDate: string;
  submitDate: string;
  updateDate: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid' | 'additional_docs';
  claimAmount?: number;
  approvedAmount?: number;
  paidAmount?: number;
  reviewProgress: string;
  nextStep?: string;
  rejectReason?: string;
  additionalDocsRequired?: string[];
  estimatedCompletionDate?: string;
}

const ClaimHistoryScreen: React.FC = () => {
  const navigation = useNavigation();

  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const storedClaims = await AsyncStorage.getItem('insurance_claims');
      const parsedClaims = storedClaims ? JSON.parse(storedClaims) : [];

      // Add mock data if no claims exist
      if (parsedClaims.length === 0) {
        const mockClaims: ClaimRecord[] = [
          {
            id: 'claim_001',
            policyNumber: 'PA2024001234567',
            productName: '平安e生保长期医疗险',
            claimType: '医疗费用报销',
            incidentDate: '2024-11-20',
            submitDate: '2024-11-25',
            updateDate: '2024-12-01',
            status: 'reviewing',
            claimAmount: 5000,
            reviewProgress: '材料审核中',
            nextStep: '保险公司正在审核您提交的材料',
            estimatedCompletionDate: '2024-12-05',
          },
          {
            id: 'claim_002',
            policyNumber: 'CL2023009876543',
            productName: '国寿福重大疾病保险',
            claimType: '重大疾病理赔',
            incidentDate: '2024-10-15',
            submitDate: '2024-10-20',
            updateDate: '2024-11-15',
            status: 'paid',
            claimAmount: 500000,
            approvedAmount: 500000,
            paidAmount: 500000,
            reviewProgress: '已结案',
            nextStep: '理赔款项已到账',
          },
        ];
        setClaims(mockClaims);
      } else {
        setClaims(parsedClaims);
      }
    } catch (error) {
      console.error('Failed to load claims:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClaims();
    setRefreshing(false);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      submitted: {
        label: '已提交',
        color: COLORS.primary,
        bgColor: '#DBEAFE',
        icon: FileText,
      },
      reviewing: {
        label: '审核中',
        color: COLORS.warning,
        bgColor: '#FEF3C7',
        icon: Clock,
      },
      additional_docs: {
        label: '补充材料',
        color: COLORS.error,
        bgColor: '#FEE2E2',
        icon: AlertCircle,
      },
      approved: {
        label: '已核准',
        color: COLORS.success,
        bgColor: '#D1FAE5',
        icon: CheckCircle,
      },
      paid: {
        label: '已结案',
        color: COLORS.success,
        bgColor: '#D1FAE5',
        icon: CheckCircle,
      },
      rejected: {
        label: '已拒赔',
        color: COLORS.error,
        bgColor: '#FEE2E2',
        icon: AlertCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.submitted;
  };

  const getClaimTypeColor = (claimType: string) => {
    const colorMap: { [key: string]: string } = {
      医疗费用报销: '#EF4444',
      重大疾病理赔: '#8B5CF6',
      意外伤害理赔: '#F59E0B',
      身故理赔: '#6B7280',
      伤残理赔: '#3B82F6',
      其他理赔: '#10B981',
    };
    return colorMap[claimType] || '#6B7280';
  };

  const filteredClaims = claims.filter(claim => {
    if (selectedStatus === 'all') return true;
    return claim.status === selectedStatus;
  });

  const renderClaimCard = (claim: ClaimRecord) => {
    const statusConfig = getStatusConfig(claim.status);
    const StatusIcon = statusConfig.icon;
    const typeColor = getClaimTypeColor(claim.claimType);

    return (
      <Pressable
        key={claim.id}
        onPress={() => {
          // Navigate to claim detail if implemented
          // navigation.navigate('ClaimDetail' as never, { claimId: claim.id } as never);
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
          <View padding="$3" backgroundColor={`${typeColor}15`}>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <XStack alignItems="center" gap="$2" flex={1}>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor={typeColor}
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {claim.claimType}
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

            {claim.productName && (
              <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
                {claim.productName}
              </Text>
            )}
            <Text fontSize="$2" color="$textSecondary">
              保单号：{claim.policyNumber}
            </Text>
          </View>

          {/* Body */}
          <View padding="$3">
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  出险日期
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {claim.incidentDate}
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  申请日期
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {claim.submitDate}
                </Text>
              </XStack>

              {claim.claimAmount && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    申请金额
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color={typeColor}>
                    ¥{claim.claimAmount.toLocaleString()}
                  </Text>
                </XStack>
              )}

              {claim.paidAmount && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    实付金额
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color={COLORS.success}>
                    ¥{claim.paidAmount.toLocaleString()}
                  </Text>
                </XStack>
              )}
            </YStack>

            {/* Progress Info */}
            <View
              marginTop="$3"
              padding="$2"
              backgroundColor="$background"
              borderRadius="$2"
            >
              <XStack alignItems="center" gap="$2">
                <StatusIcon size={16} color={statusConfig.color} />
                <YStack flex={1}>
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {claim.reviewProgress}
                  </Text>
                  {claim.nextStep && (
                    <Text fontSize="$2" color="$textSecondary" marginTop="$0.5">
                      {claim.nextStep}
                    </Text>
                  )}
                </YStack>
              </XStack>
            </View>

            {/* Additional Actions */}
            {claim.status === 'additional_docs' && claim.additionalDocsRequired && (
              <View
                marginTop="$2"
                padding="$2"
                backgroundColor="#FEF3C7"
                borderRadius="$2"
                borderLeftWidth={3}
                borderLeftColor={COLORS.warning}
              >
                <XStack alignItems="flex-start" gap="$2">
                  <AlertCircle size={16} color={COLORS.warning} style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize="$2" fontWeight="600" color="$text" marginBottom="$1">
                      需要补充以下材料：
                    </Text>
                    {claim.additionalDocsRequired.map((doc, index) => (
                      <Text key={index} fontSize="$2" color="$text">
                        • {doc}
                      </Text>
                    ))}
                  </YStack>
                </XStack>
              </View>
            )}

            {claim.rejectReason && (
              <View
                marginTop="$2"
                padding="$2"
                backgroundColor="#FEE2E2"
                borderRadius="$2"
                borderLeftWidth={3}
                borderLeftColor={COLORS.error}
              >
                <XStack alignItems="flex-start" gap="$2">
                  <AlertCircle size={16} color={COLORS.error} style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize="$2" fontWeight="600" color="$text" marginBottom="$1">
                      拒赔原因：
                    </Text>
                    <Text fontSize="$2" color="$text">
                      {claim.rejectReason}
                    </Text>
                  </YStack>
                </XStack>
              </View>
            )}
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
          理赔记录
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Status Filter */}
        <View padding="$4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              {[
                { value: 'all', label: '全部' },
                { value: 'reviewing', label: '审核中' },
                { value: 'additional_docs', label: '补充材料' },
                { value: 'paid', label: '已结案' },
              ].map(status => (
                <Pressable key={status.value} onPress={() => setSelectedStatus(status.value)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$2"
                    backgroundColor={
                      selectedStatus === status.value ? COLORS.primary : '$borderColor'
                    }
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
        </View>

        {/* Claim List */}
        <View paddingHorizontal="$4">
          {filteredClaims.length === 0 ? (
            <View padding="$8" alignItems="center">
              <FileText size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
                暂无理赔记录
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2" textAlign="center">
                如有理赔需求，可在保单详情页申请
              </Text>
              <Pressable
                onPress={() => navigation.navigate('MyInsurancePolicies' as never)}
                style={{ marginTop: 16 }}
              >
                <View
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  backgroundColor={COLORS.primary}
                  borderRadius="$2"
                >
                  <Text color="white" fontSize="$3" fontWeight="600">
                    查看我的保单
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <>
              {filteredClaims.map(claim => renderClaimCard(claim))}
            </>
          )}
        </View>

        {/* Help Section */}
        {claims.length > 0 && (
          <View marginHorizontal="$4" marginBottom="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              需要帮助？
            </Text>

            <YStack gap="$2">
              <Pressable
                onPress={() => {
                  navigation.navigate('InsuranceAdvisorList' as never);
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
                        <MessageCircle size={20} color={COLORS.primary} />
                      </View>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        联系专属顾问
                      </Text>
                    </XStack>
                    <ChevronRight size={20} color={COLORS.textSecondary} />
                  </XStack>
                </View>
              </Pressable>

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
                      <Phone size={20} color={COLORS.success} />
                    </View>
                    <YStack>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        客服热线
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$0.5">
                        工作日 9:00-18:00
                      </Text>
                    </YStack>
                  </XStack>
                  <Text fontSize="$4" fontWeight="600" color={COLORS.success}>
                    400-XXX-XXXX
                  </Text>
                </XStack>
              </View>
            </YStack>
          </View>
        )}

        {/* Tips */}
        <View
          marginHorizontal="$4"
          marginBottom="$4"
          padding="$3"
          backgroundColor="#E0F2FE"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.primary}
        >
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
            理赔小贴士
          </Text>
          <Text fontSize="$2" color="$text" lineHeight={20}>
            • 及时报案，出险后3天内向保险公司报案{'\\n'}
            • 保留所有医疗费用原始单据和诊断证明{'\\n'}
            • 如实告知病情，配合保险公司调查{'\\n'}
            • 材料不全时，及时补充避免影响理赔时效{'\\n'}
            • 疑问或困难可联系专属顾问协助
          </Text>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default ClaimHistoryScreen;
