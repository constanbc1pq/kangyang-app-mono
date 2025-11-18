import React, { useState } from 'react';
import { ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  FileText,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Send,
  Info,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RouteParams = {
  ClaimAssistance: {
    policyId?: string;
    policyNumber?: string;
  };
};

interface ClaimMaterial {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  note?: string;
}

const ClaimAssistanceScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'ClaimAssistance'>>();
  const { policyId, policyNumber } = route.params || {};

  const [selectedPolicyId, setSelectedPolicyId] = useState(policyId || '');
  const [claimType, setClaimType] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const claimTypes = [
    { id: 'medical', label: '医疗费用报销', color: '#EF4444' },
    { id: 'critical_illness', label: '重大疾病理赔', color: '#8B5CF6' },
    { id: 'accident', label: '意外伤害理赔', color: '#F59E0B' },
    { id: 'death', label: '身故理赔', color: '#6B7280' },
    { id: 'disability', label: '伤残理赔', color: '#3B82F6' },
    { id: 'other', label: '其他理赔', color: '#10B981' },
  ];

  const [materials, setMaterials] = useState<ClaimMaterial[]>([
    {
      id: 'id_card',
      name: '身份证',
      required: true,
      uploaded: false,
      note: '被保人身份证正反面',
    },
    {
      id: 'policy',
      name: '保险合同',
      required: true,
      uploaded: false,
      note: '保险合同或保单号',
    },
    {
      id: 'diagnosis',
      name: '诊断证明',
      required: true,
      uploaded: false,
      note: '医院出具的诊断证明',
    },
    {
      id: 'medical_records',
      name: '病历资料',
      required: true,
      uploaded: false,
      note: '门诊病历/住院病历',
    },
    {
      id: 'invoices',
      name: '医疗费用发票',
      required: true,
      uploaded: false,
      note: '原始医疗费用发票',
    },
    {
      id: 'expense_list',
      name: '费用清单',
      required: true,
      uploaded: false,
      note: '医疗费用明细清单',
    },
    {
      id: 'bank_card',
      name: '银行卡',
      required: true,
      uploaded: false,
      note: '被保人本人银行卡',
    },
    {
      id: 'other_docs',
      name: '其他材料',
      required: false,
      uploaded: false,
      note: '根据案件情况补充',
    },
  ]);

  const handleUploadMaterial = (materialId: string) => {
    Alert.alert('提示', '拍照上传功能开发中', [
      {
        text: '模拟已上传',
        onPress: () => {
          setMaterials(prev =>
            prev.map(m => (m.id === materialId ? { ...m, uploaded: true } : m))
          );
        },
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const validateForm = (): boolean => {
    if (!selectedPolicyId) {
      Alert.alert('提示', '请选择理赔保单');
      return false;
    }

    if (!claimType) {
      Alert.alert('提示', '请选择理赔类型');
      return false;
    }

    if (!incidentDate) {
      Alert.alert('提示', '请填写出险日期');
      return false;
    }

    if (!incidentLocation.trim()) {
      Alert.alert('提示', '请填写出险地点');
      return false;
    }

    if (!incidentDescription.trim() || incidentDescription.trim().length < 20) {
      Alert.alert('提示', '请详细描述事故经过（至少20字）');
      return false;
    }

    if (!contactPhone.trim() || !/^1[3-9]\d{9}$/.test(contactPhone.trim())) {
      Alert.alert('提示', '请输入正确的联系电话');
      return false;
    }

    const requiredMaterials = materials.filter(m => m.required);
    const uploadedRequired = requiredMaterials.filter(m => m.uploaded);
    if (uploadedRequired.length < requiredMaterials.length) {
      Alert.alert('提示', `请上传所有必须材料（${uploadedRequired.length}/${requiredMaterials.length}）`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Create claim record
      const claimRecord = {
        id: `claim_${Date.now()}`,
        policyId: selectedPolicyId,
        policyNumber: policyNumber || 'PA2024001234567',
        claimType,
        incidentDate,
        incidentLocation,
        incidentDescription,
        contactPhone,
        claimAmount: claimAmount ? parseFloat(claimAmount) : 0,
        materials: materials.filter(m => m.uploaded).map(m => m.name),
        status: 'submitted',
        submitDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
      };

      // Save to AsyncStorage
      const existingClaims = await AsyncStorage.getItem('insurance_claims');
      const claims = existingClaims ? JSON.parse(existingClaims) : [];
      claims.unshift(claimRecord);
      await AsyncStorage.setItem('insurance_claims', JSON.stringify(claims));

      Alert.alert(
        '提交成功',
        '理赔申请已成功提交，保险公司将在3个工作日内审核您的材料。\n\n您可以在"理赔记录"中查看进度。',
        [
          {
            text: '查看理赔记录',
            onPress: () => {
              navigation.navigate('ClaimHistory' as never);
            },
          },
          {
            text: '返回首页',
            onPress: () => {
              navigation.navigate('InsuranceHome' as never);
            },
          },
        ]
      );
    } catch (error) {
      console.error('提交理赔失败:', error);
      Alert.alert('提交失败', '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !selectedPolicyId ||
    !claimType ||
    !incidentDate ||
    !incidentLocation.trim() ||
    !incidentDescription.trim() ||
    !contactPhone.trim() ||
    submitting;

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
          理赔申请
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View
          marginHorizontal="$4"
          marginTop="$4"
          padding="$3"
          backgroundColor="#E0F2FE"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.primary}
        >
          <XStack alignItems="flex-start" gap="$2">
            <Info size={18} color={COLORS.primary} style={{ marginTop: 2 }} />
            <YStack flex={1}>
              <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
                理赔小贴士
              </Text>
              <Text fontSize="$2" color="$text" lineHeight={18}>
                请如实填写理赔信息，上传完整清晰的理赔材料。如需协助，可联系您的专属顾问。
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* Claim Type */}
        <YStack padding="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            理赔类型 *
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {claimTypes.map(type => (
              <Pressable
                key={type.id}
                onPress={() => setClaimType(type.id)}
                style={{ marginBottom: 8 }}
              >
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$2"
                  backgroundColor={claimType === type.id ? type.color : '$borderColor'}
                >
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={claimType === type.id ? 'white' : '$text'}
                  >
                    {type.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        {/* Incident Date */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            出险日期 *
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
          >
            <XStack alignItems="center" gap="$2">
              <Calendar size={18} color={COLORS.textSecondary} />
              <TextInput
                placeholder="请选择出险日期（如：2024-12-15）"
                placeholderTextColor={COLORS.textSecondary}
                style={{
                  fontSize: 14,
                  color: COLORS.text,
                  height: 48,
                  flex: 1,
                }}
                value={incidentDate}
                onChangeText={setIncidentDate}
              />
            </XStack>
          </View>
        </YStack>

        {/* Incident Location */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            出险地点 *
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
          >
            <XStack alignItems="center" gap="$2">
              <MapPin size={18} color={COLORS.textSecondary} />
              <TextInput
                placeholder="请输入出险地点"
                placeholderTextColor={COLORS.textSecondary}
                style={{
                  fontSize: 14,
                  color: COLORS.text,
                  height: 48,
                  flex: 1,
                }}
                value={incidentLocation}
                onChangeText={setIncidentLocation}
              />
            </XStack>
          </View>
        </YStack>

        {/* Incident Description */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            事故经过 *
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$3"
          >
            <TextInput
              placeholder="请详细描述事故发生的经过、症状等信息..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={6}
              style={{
                fontSize: 14,
                color: COLORS.text,
                textAlignVertical: 'top',
                minHeight: 100,
              }}
              value={incidentDescription}
              onChangeText={setIncidentDescription}
              maxLength={500}
            />
            <Text fontSize="$2" color="$textSecondary" textAlign="right" marginTop="$2">
              {incidentDescription.length}/500
            </Text>
          </View>
        </YStack>

        {/* Contact Phone */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            联系电话 *
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
          >
            <XStack alignItems="center" gap="$2">
              <Phone size={18} color={COLORS.textSecondary} />
              <TextInput
                placeholder="请输入联系电话"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                style={{
                  fontSize: 14,
                  color: COLORS.text,
                  height: 48,
                  flex: 1,
                }}
                value={contactPhone}
                onChangeText={setContactPhone}
                maxLength={11}
              />
            </XStack>
          </View>
        </YStack>

        {/* Claim Amount (Optional) */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            预估理赔金额（选填）
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
          >
            <XStack alignItems="center" gap="$2">
              <Text fontSize="$4" color="$text" fontWeight="600">
                ¥
              </Text>
              <TextInput
                placeholder="请输入预估理赔金额"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="decimal-pad"
                style={{
                  fontSize: 14,
                  color: COLORS.text,
                  height: 48,
                  flex: 1,
                }}
                value={claimAmount}
                onChangeText={setClaimAmount}
              />
            </XStack>
          </View>
          <Text fontSize="$2" color="$textSecondary" marginTop="$1">
            最终理赔金额以保险公司审核为准
          </Text>
        </YStack>

        {/* Materials Checklist */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            理赔材料清单
          </Text>

          <YStack gap="$2">
            {materials.map(material => (
              <View
                key={material.id}
                padding="$3"
                backgroundColor="$surface"
                borderRadius="$3"
                borderWidth={1}
                borderColor={material.uploaded ? COLORS.success : '$borderColor'}
              >
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap="$2" flex={1}>
                    {material.uploaded ? (
                      <CheckCircle size={20} color={COLORS.success} />
                    ) : (
                      <View
                        width={20}
                        height={20}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={material.required ? COLORS.error : COLORS.textSecondary}
                      />
                    )}
                    <YStack flex={1}>
                      <XStack alignItems="center" gap="$1">
                        <Text fontSize="$3" fontWeight="600" color="$text">
                          {material.name}
                        </Text>
                        {material.required && (
                          <Text fontSize="$2" color={COLORS.error}>
                            *
                          </Text>
                        )}
                      </XStack>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$0.5">
                        {material.note}
                      </Text>
                    </YStack>
                  </XStack>

                  <Pressable onPress={() => handleUploadMaterial(material.id)}>
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$1.5"
                      backgroundColor={material.uploaded ? '$borderColor' : COLORS.primary}
                      borderRadius="$2"
                    >
                      <XStack alignItems="center" gap="$1">
                        {material.uploaded ? (
                          <CheckCircle size={14} color={COLORS.success} />
                        ) : (
                          <Upload size={14} color="white" />
                        )}
                        <Text
                          fontSize="$2"
                          fontWeight="600"
                          color={material.uploaded ? '$text' : 'white'}
                        >
                          {material.uploaded ? '已上传' : '上传'}
                        </Text>
                      </XStack>
                    </View>
                  </Pressable>
                </XStack>
              </View>
            ))}
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
                所有材料需清晰完整，请确保文字、印章清晰可见。如材料不全，保险公司会通知补充。
              </Text>
            </XStack>
          </View>
        </YStack>

        {/* Notes */}
        <View
          marginHorizontal="$4"
          marginBottom="$4"
          padding="$3"
          backgroundColor="$surface"
          borderRadius="$3"
        >
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
            理赔流程说明
          </Text>
          <Text fontSize="$2" color="$text" lineHeight={20}>
            1. 提交理赔申请和完整材料{'\\n'}
            2. 保险公司审核材料（3-5个工作日）{'\\n'}
            3. 材料齐全进入理算环节{'\\n'}
            4. 理赔结案，款项到账（1-3个工作日）{'\\n'}
            5. 全程可联系专属顾问协助
          </Text>
        </View>

        <View height={120} />
      </ScrollView>

      {/* Bottom Submit Button */}
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$4"
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        <Pressable onPress={handleSubmit} disabled={isSubmitDisabled} style={{ flex: 1 }}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={isSubmitDisabled ? '$borderColor' : COLORS.success}
            justifyContent="center"
            alignItems="center"
          >
            <XStack alignItems="center" gap="$2">
              <Send size={20} color={isSubmitDisabled ? COLORS.textSecondary : 'white'} />
              <Text
                color={isSubmitDisabled ? COLORS.textSecondary : 'white'}
                fontSize="$4"
                fontWeight="600"
              >
                {submitting ? '提交中...' : '提交理赔申请'}
              </Text>
            </XStack>
          </View>
        </Pressable>
      </XStack>
    </View>
  );
};

export default ClaimAssistanceScreen;
