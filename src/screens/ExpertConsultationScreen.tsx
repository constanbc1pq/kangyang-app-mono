/**
 * 专家会诊服务界面
 * Expert Consultation Screen
 *
 * Phase 25.2: 专家会诊服务
 * - 会诊申请表单（病情描述/科室/紧急程度）
 * - 会诊记录列表
 * - 会诊详情页
 * - 接入订单流程
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Users,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface ConsultationRequest {
  id: string;
  caseDescription: string;
  preferredDepartment: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'scheduled' | 'completed';
  submittedAt: string;
  experts?: { name: string; title: string }[];
  conclusion?: string;
  treatment?: string;
}

const MOCK_REQUESTS: ConsultationRequest[] = [
  {
    id: 'req_001',
    caseDescription: '心脏不适，需要心内科专家会诊',
    preferredDepartment: '心内科',
    urgency: 'urgent',
    status: 'completed',
    submittedAt: '2024-11-10',
    experts: [
      { name: '王教授', title: '心内科主任医师' },
      { name: '李教授', title: '心血管专家' },
    ],
    conclusion: '建议进行冠脉造影检查，排除冠心病可能',
    treatment: '药物治疗配合定期复查',
  },
];

const ExpertConsultationScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [caseDescription, setCaseDescription] = useState('');
  const [preferredDepartment, setPreferredDepartment] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [requests] = useState<ConsultationRequest[]>(MOCK_REQUESTS);

  const handleSubmit = async () => {
    if (!caseDescription.trim()) {
      Alert.alert('提示', '请填写病情描述');
      return;
    }

    const price = urgency === 'emergency' ? 5000 : urgency === 'urgent' ? 3000 : 2000;

    // 导航到结账页面，接入订单流程
    navigation.navigate('CheckoutScreen', {
      itemType: 'expert_consultation',
      itemName: '专家会诊服务',
      price,
      quantity: 1,
      metadata: {
        caseDescription,
        preferredDepartment,
        urgency,
      },
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#FF9800',
      scheduled: '#2196F3',
      completed: '#4CAF50',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: '待安排',
      scheduled: '已预约',
      completed: '已完成',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      normal: '普通',
      urgent: '紧急',
      emergency: '特急',
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  const getUrgencyPrice = (urgency: string) => {
    const prices = {
      normal: 2000,
      urgent: 3000,
      emergency: 5000,
    };
    return prices[urgency as keyof typeof prices] || 2000;
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
            专家会诊
          </Text>
          <View width={24} />
        </XStack>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {!showForm ? (
          <>
            {/* Service Introduction */}
            <View
              padding="$5"
              backgroundColor={COLORS.primary + '15'}
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <XStack space="$3" marginBottom="$3">
                <View
                  width={48}
                  height={48}
                  backgroundColor={COLORS.primary}
                  borderRadius={24}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Users size={28} color="white" />
                </View>
                <YStack flex={1}>
                  <Text fontSize={18} fontWeight="700" marginBottom="$1">
                    专家会诊服务
                  </Text>
                  <Text fontSize={14} color="$gray11">
                    汇聚国内顶尖专家，提供多学科联合会诊服务
                  </Text>
                </YStack>
              </XStack>

              <YStack space="$1">
                <XStack space="$2" alignItems="center">
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text fontSize={14}>三甲医院主任医师级别</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text fontSize={14}>多学科专家联合会诊</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text fontSize={14}>48小时内出具会诊意见</Text>
                </XStack>
              </YStack>
            </View>

            {/* Consultation Records */}
            <View padding="$4">
              <Text fontSize={18} fontWeight="600" marginBottom="$3">
                我的会诊记录
              </Text>

              {requests.length > 0 ? (
                <YStack space="$3">
                  {requests.map((request) => (
                    <TouchableOpacity key={request.id}>
                      <View
                        padding="$4"
                        backgroundColor="$surface"
                        borderRadius="$4"
                        borderLeftWidth={4}
                        borderLeftColor={getStatusColor(request.status)}
                      >
                        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                          <YStack flex={1}>
                            <XStack space="$2" alignItems="center" marginBottom="$2">
                              <View
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                backgroundColor={getStatusColor(request.status)}
                                borderRadius="$2"
                              >
                                <Text fontSize={11} color="white" fontWeight="600">
                                  {getStatusLabel(request.status)}
                                </Text>
                              </View>
                              <View
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                backgroundColor="$gray4"
                                borderRadius="$2"
                              >
                                <Text fontSize={11} color="$gray11" fontWeight="600">
                                  {getUrgencyLabel(request.urgency)}
                                </Text>
                              </View>
                            </XStack>
                            <Text fontSize={15} fontWeight="600" marginBottom="$1">
                              {request.preferredDepartment}
                            </Text>
                            <Text fontSize={14} color="$gray11" numberOfLines={2}>
                              {request.caseDescription}
                            </Text>
                          </YStack>
                        </XStack>

                        {request.experts && (
                          <YStack marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$borderColor">
                            <Text fontSize={13} color="$gray11" marginBottom="$1">
                              参与专家：
                            </Text>
                            <XStack space="$2" flexWrap="wrap">
                              {request.experts.map((expert, idx) => (
                                <Text key={idx} fontSize={13} color={COLORS.text}>
                                  {expert.name} ({expert.title})
                                  {idx < request.experts!.length - 1 ? '、' : ''}
                                </Text>
                              ))}
                            </XStack>
                          </YStack>
                        )}

                        <XStack space="$1" alignItems="center" marginTop="$2">
                          <Clock size={14} color="$gray10" />
                          <Text fontSize={13} color="$gray10">
                            提交时间：{request.submittedAt}
                          </Text>
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  ))}
                </YStack>
              ) : (
                <View padding="$5" alignItems="center">
                  <AlertCircle size={48} color="$gray8" />
                  <Text fontSize={14} color="$gray11" marginTop="$2">
                    暂无会诊记录
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          /* Application Form */
          <View padding="$4">
            <Text fontSize={18} fontWeight="600" marginBottom="$4">
              申请专家会诊
            </Text>

            <YStack space="$4">
              <YStack space="$2">
                <XStack space="$1">
                  <Text fontSize={15} fontWeight="600">
                    病情描述
                  </Text>
                  <Text fontSize={15} color="#FF5252">
                    *
                  </Text>
                </XStack>
                <View
                  backgroundColor="$surface"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  padding="$3"
                >
                  <RNTextInput
                    value={caseDescription}
                    onChangeText={setCaseDescription}
                    placeholder="请详细描述病情、症状、检查结果等信息"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={6}
                    maxLength={1000}
                    style={{
                      fontSize: 15,
                      color: COLORS.text,
                      minHeight: 120,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>
                <Text fontSize={12} color="$gray10">
                  {caseDescription.length}/1000
                </Text>
              </YStack>

              <YStack space="$2">
                <Text fontSize={15} fontWeight="600">
                  期望会诊科室
                </Text>
                <View
                  backgroundColor="$surface"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  padding="$3"
                >
                  <RNTextInput
                    value={preferredDepartment}
                    onChangeText={setPreferredDepartment}
                    placeholder="例如：心内科、肿瘤科、神经内科"
                    placeholderTextColor="#999"
                    style={{ fontSize: 15, color: COLORS.text }}
                  />
                </View>
              </YStack>

              <YStack space="$2">
                <Text fontSize={15} fontWeight="600">
                  紧急程度
                </Text>
                <XStack space="$2">
                  {[
                    { value: 'normal', label: '普通', price: 2000, time: '7天内' },
                    { value: 'urgent', label: '紧急', price: 3000, time: '3天内' },
                    { value: 'emergency', label: '特急', price: 5000, time: '24小时' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setUrgency(option.value as any)}
                      style={{ flex: 1 }}
                    >
                      <View
                        padding="$3"
                        backgroundColor={
                          urgency === option.value ? COLORS.primary : '$surface'
                        }
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor={
                          urgency === option.value ? COLORS.primary : '$borderColor'
                        }
                        alignItems="center"
                      >
                        <Text
                          fontSize={14}
                          fontWeight="600"
                          color={urgency === option.value ? 'white' : COLORS.text}
                        >
                          {option.label}
                        </Text>
                        <Text
                          fontSize={12}
                          color={urgency === option.value ? 'white' : '$gray11'}
                          marginTop="$1"
                        >
                          ¥{option.price}
                        </Text>
                        <Text
                          fontSize={11}
                          color={urgency === option.value ? 'white' : '$gray10'}
                        >
                          {option.time}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </YStack>

              <YStack space="$2">
                <Text fontSize={15} fontWeight="600">
                  上传病历资料（可选）
                </Text>
                <TouchableOpacity>
                  <View
                    padding="$4"
                    backgroundColor="$surface"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderStyle="dashed"
                    alignItems="center"
                  >
                    <Upload size={32} color="$gray10" />
                    <Text fontSize={14} color="$gray11" marginTop="$2">
                      点击上传病历、检查报告等
                    </Text>
                  </View>
                </TouchableOpacity>
              </YStack>

              <View
                padding="$3"
                backgroundColor="#FFF4E6"
                borderRadius="$3"
                borderWidth={1}
                borderColor="#FFE0B2"
              >
                <Text fontSize={14} fontWeight="600" color="#E65100" marginBottom="$2">
                  服务说明
                </Text>
                <YStack space="$1">
                  <Text fontSize={13} color="#E65100">
                    • 由3-5位三甲医院主任医师级专家参与
                  </Text>
                  <Text fontSize={13} color="#E65100">
                    • 根据紧急程度在约定时间内出具会诊意见
                  </Text>
                  <Text fontSize={13} color="#E65100">
                    • 提供详细的诊断建议和治疗方案
                  </Text>
                  <Text fontSize={13} color="#E65100">
                    • 会诊报告将永久保存在您的健康档案中
                  </Text>
                </YStack>
              </View>
            </YStack>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View
        padding="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        {!showForm ? (
          <Button
            size="$5"
            backgroundColor={COLORS.primary}
            color="white"
            borderRadius="$3"
            fontWeight="600"
            onPress={() => setShowForm(true)}
          >
            申请专家会诊
          </Button>
        ) : (
          <XStack space="$3">
            <Button
              flex={1}
              size="$4"
              backgroundColor="$surface"
              color={COLORS.text}
              borderRadius="$3"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => setShowForm(false)}
            >
              取消
            </Button>
            <Button
              flex={2}
              size="$4"
              backgroundColor={COLORS.primary}
              color="white"
              borderRadius="$3"
              fontWeight="600"
              onPress={handleSubmit}
            >
              提交申请 (¥{getUrgencyPrice(urgency)})
            </Button>
          </XStack>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExpertConsultationScreen;
