/**
 * 国际转诊服务界面（VIP专属）
 * International Referral Screen
 *
 * Phase 25.4: 国际转诊服务
 * - 转诊申请表单（疾病类型/医院/预算）
 * - 合作医院列表展示
 * - 转诊流程展示
 * - 服务包含内容说明
 * - 案例展示
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
  Globe,
  FileText,
  DollarSign,
  Check,
  ChevronRight,
  Upload,
  Award,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface Hospital {
  id: string;
  name: string;
  country: string;
  specialty: string;
  ranking: string;
  description: string;
}

const PARTNER_HOSPITALS: Hospital[] = [
  {
    id: 'mayo',
    name: '美国梅奥诊所',
    country: '美国',
    specialty: '综合医疗',
    ranking: '全美排名第1',
    description: '世界顶级综合医疗机构，在癌症、心血管、神经等领域处于领先地位',
  },
  {
    id: 'cleveland',
    name: '克利夫兰诊所',
    country: '美国',
    specialty: '心血管',
    ranking: '心血管全美第1',
    description: '在心脏病和心血管疾病治疗方面享有全球盛誉',
  },
  {
    id: 'singapore',
    name: '新加坡中央医院',
    country: '新加坡',
    specialty: '肿瘤治疗',
    ranking: '亚洲顶级',
    description: '亚洲领先的综合医疗中心，在肿瘤治疗方面经验丰富',
  },
  {
    id: 'japan',
    name: '日本癌研有明医院',
    country: '日本',
    specialty: '癌症治疗',
    ranking: '日本癌症治疗权威',
    description: '日本最大的癌症专科医院，采用先进的精准医疗技术',
  },
];

const SERVICE_STEPS = [
  '病历资料收集与翻译',
  '医院预约与协调',
  '签证办理协助',
  '行程安排与住宿',
  '陪同翻译服务',
  '治疗期间跟进',
  '回国后续跟踪',
];

const SERVICE_INCLUDES = [
  { title: '病历翻译', description: '专业医疗翻译，完整准确' },
  { title: '预约协调', description: '直接对接医院，快速预约' },
  { title: '签证协助', description: '提供签证材料，协助办理' },
  { title: '陪同翻译', description: '全程医疗翻译陪同' },
  { title: '住宿安排', description: '医院附近优质住宿' },
  { title: '接送服务', description: '机场接送，就医接送' },
];

const InternationalReferralScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [diseaseType, setDiseaseType] = useState('');
  const [preferredHospital, setPreferredHospital] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const handleSubmit = () => {
    if (!diseaseType.trim()) {
      Alert.alert('提示', '请填写疾病类型');
      return;
    }

    if (!preferredHospital) {
      Alert.alert('提示', '请选择期望医院');
      return;
    }

    const selectedHospital = PARTNER_HOSPITALS.find((h) => h.id === preferredHospital);

    // 导航到结账页面，接入订单流程
    navigation.navigate('CheckoutScreen', {
      itemType: 'international_referral',
      itemName: `国际转诊服务 - ${selectedHospital?.name}`,
      price: 50000,
      quantity: 1,
      metadata: {
        diseaseType,
        hospitalId: preferredHospital,
        hospitalName: selectedHospital?.name,
        budgetRange,
        medicalHistory,
      },
    });
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
            国际转诊
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
              backgroundColor="#E8F5E9"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <XStack space="$3" marginBottom="$3">
                <View
                  width={48}
                  height={48}
                  backgroundColor="#4CAF50"
                  borderRadius={24}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Globe size={28} color="white" />
                </View>
                <YStack flex={1}>
                  <Text fontSize={18} fontWeight="700" marginBottom="$1" color="#2E7D32">
                    国际顶级医疗资源
                  </Text>
                  <Text fontSize={14} color="$gray11">
                    对接全球顶尖医疗机构，提供全流程转诊服务
                  </Text>
                </YStack>
              </XStack>

              <View
                padding="$3"
                backgroundColor="white"
                borderRadius="$3"
              >
                <YStack space="$2">
                  <XStack space="$2" alignItems="center">
                    <Award size={16} color="#4CAF50" />
                    <Text fontSize={14}>对接美国、日本、新加坡等顶级医院</Text>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    <Award size={16} color="#4CAF50" />
                    <Text fontSize={14}>全程医疗翻译与陪同服务</Text>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    <Award size={16} color="#4CAF50" />
                    <Text fontSize={14}>签证、住宿、交通一站式安排</Text>
                  </XStack>
                </YStack>
              </View>
            </View>

            {/* Partner Hospitals */}
            <View padding="$4">
              <Text fontSize={18} fontWeight="600" marginBottom="$3">
                合作医院
              </Text>
              <YStack space="$3">
                {PARTNER_HOSPITALS.map((hospital) => (
                  <View
                    key={hospital.id}
                    padding="$4"
                    backgroundColor="$surface"
                    borderRadius="$4"
                  >
                    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                      <YStack flex={1}>
                        <XStack space="$2" alignItems="center" marginBottom="$1">
                          <Text fontSize={16} fontWeight="700">
                            {hospital.name}
                          </Text>
                          <View
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            backgroundColor="#FFD700"
                            borderRadius="$2"
                          >
                            <Text fontSize={11} fontWeight="600" color="#8B4513">
                              {hospital.ranking}
                            </Text>
                          </View>
                        </XStack>
                        <Text fontSize={14} color="$gray11" marginBottom="$1">
                          {hospital.country} · {hospital.specialty}
                        </Text>
                        <Text fontSize={13} color="$gray10" lineHeight={20}>
                          {hospital.description}
                        </Text>
                      </YStack>
                    </XStack>
                  </View>
                ))}
              </YStack>
            </View>

            {/* Service Process */}
            <View padding="$4" paddingTop="$0">
              <Text fontSize={18} fontWeight="600" marginBottom="$3">
                转诊流程
              </Text>
              <YStack space="$2">
                {SERVICE_STEPS.map((step, idx) => (
                  <XStack key={idx} space="$3" alignItems="center">
                    <View
                      width={32}
                      height={32}
                      backgroundColor={COLORS.primary}
                      borderRadius={16}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={14} fontWeight="600" color="white">
                        {idx + 1}
                      </Text>
                    </View>
                    <Text fontSize={15} flex={1}>
                      {step}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </View>

            {/* Service Includes */}
            <View padding="$4" paddingTop="$0">
              <Text fontSize={18} fontWeight="600" marginBottom="$3">
                服务包含
              </Text>
              <View
                padding="$4"
                backgroundColor="#FFF4E6"
                borderRadius="$4"
                borderWidth={1}
                borderColor="#FFE0B2"
              >
                <YStack space="$3">
                  {SERVICE_INCLUDES.map((item, idx) => (
                    <XStack key={idx} space="$3" alignItems="flex-start">
                      <Check size={20} color="#FF9800" style={{ marginTop: 2 }} />
                      <YStack flex={1}>
                        <Text fontSize={15} fontWeight="600" marginBottom="$1">
                          {item.title}
                        </Text>
                        <Text fontSize={14} color="$gray11">
                          {item.description}
                        </Text>
                      </YStack>
                    </XStack>
                  ))}
                </YStack>
              </View>
            </View>

            {/* Success Cases */}
            <View padding="$4" paddingTop="$0">
              <Text fontSize={18} fontWeight="600" marginBottom="$3">
                成功案例
              </Text>
              <View
                padding="$4"
                backgroundColor="$surface"
                borderRadius="$4"
              >
                <Text fontSize={15} fontWeight="600" marginBottom="$2">
                  肺癌患者赴日治疗
                </Text>
                <Text fontSize={14} color="$gray11" lineHeight={22}>
                  患者张先生，58岁，确诊肺癌晚期。通过我们的服务成功转诊至日本癌研有明医院，接受最新的靶向治疗和免疫治疗。治疗效果显著，肿瘤明显缩小，生活质量大幅提升。
                </Text>
              </View>
            </View>
          </>
        ) : (
          /* Application Form */
          <View padding="$4">
            <Text fontSize={18} fontWeight="600" marginBottom="$4">
              申请国际转诊
            </Text>

            <YStack space="$4">
              <YStack space="$2">
                <XStack space="$1">
                  <Text fontSize={15} fontWeight="600">
                    疾病类型
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
                    value={diseaseType}
                    onChangeText={setDiseaseType}
                    placeholder="请输入疾病类型，例如：肺癌、心脏病"
                    placeholderTextColor="#999"
                    style={{ fontSize: 15, color: COLORS.text }}
                  />
                </View>
              </YStack>

              <YStack space="$2">
                <XStack space="$1">
                  <Text fontSize={15} fontWeight="600">
                    期望医院
                  </Text>
                  <Text fontSize={15} color="#FF5252">
                    *
                  </Text>
                </XStack>
                <YStack space="$2">
                  {PARTNER_HOSPITALS.map((hospital) => (
                    <TouchableOpacity
                      key={hospital.id}
                      onPress={() => setPreferredHospital(hospital.id)}
                    >
                      <View
                        padding="$3"
                        backgroundColor={
                          preferredHospital === hospital.id
                            ? COLORS.primary + '15'
                            : '$surface'
                        }
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor={
                          preferredHospital === hospital.id
                            ? COLORS.primary
                            : '$borderColor'
                        }
                      >
                        <XStack justifyContent="space-between" alignItems="center">
                          <YStack flex={1}>
                            <Text fontSize={15} fontWeight="600">
                              {hospital.name}
                            </Text>
                            <Text fontSize={13} color="$gray11">
                              {hospital.country} · {hospital.specialty}
                            </Text>
                          </YStack>
                          {preferredHospital === hospital.id && (
                            <View
                              width={20}
                              height={20}
                              backgroundColor={COLORS.primary}
                              borderRadius={10}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Check size={14} color="white" />
                            </View>
                          )}
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  ))}
                </YStack>
              </YStack>

              <YStack space="$2">
                <Text fontSize={15} fontWeight="600">
                  病史简述
                </Text>
                <View
                  backgroundColor="$surface"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  padding="$3"
                >
                  <RNTextInput
                    value={medicalHistory}
                    onChangeText={setMedicalHistory}
                    placeholder="请简要描述病史、已做过的治疗等"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    style={{
                      fontSize: 15,
                      color: COLORS.text,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>
              </YStack>

              <YStack space="$2">
                <Text fontSize={15} fontWeight="600">
                  预算范围
                </Text>
                <View
                  backgroundColor="$surface"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  padding="$3"
                >
                  <RNTextInput
                    value={budgetRange}
                    onChangeText={setBudgetRange}
                    placeholder="例如：50-100万元（不含治疗费用）"
                    placeholderTextColor="#999"
                    style={{ fontSize: 15, color: COLORS.text }}
                  />
                </View>
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
                      点击上传病历、检查报告等资料
                    </Text>
                  </View>
                </TouchableOpacity>
              </YStack>

              <View
                padding="$3"
                backgroundColor="#E3F2FD"
                borderRadius="$3"
                borderWidth={1}
                borderColor="#90CAF9"
              >
                <Text fontSize={14} fontWeight="600" color="#1976D2" marginBottom="$2">
                  温馨提示
                </Text>
                <YStack space="$1">
                  <Text fontSize={13} color="#1976D2">
                    • 服务费用¥50,000（不含治疗费用）
                  </Text>
                  <Text fontSize={13} color="#1976D2">
                    • 提交后我们将在24小时内联系您
                  </Text>
                  <Text fontSize={13} color="#1976D2">
                    • 专业团队将协助完成所有转诊流程
                  </Text>
                  <Text fontSize={13} color="#1976D2">
                    • 治疗费用需根据具体方案另行支付
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
            申请国际转诊
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
              提交申请 (¥50,000)
            </Button>
          </XStack>
        )}
      </View>
    </SafeAreaView>
  );
};

export default InternationalReferralScreen;
