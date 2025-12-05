/**
 * 案件委托页面 - CaseDelegationScreen
 * Phase 34.1: 案件委托
 *
 * 功能：
 * - 案件类型选择：赡养费追索、遗产纠纷、房产纠纷等
 * - 案情描述：详细描述案件情况
 * - 证据材料上传：上传相关证据文件
 * - 律师推荐与选择：智能推荐合适的律师
 * - 代理费预估：根据案件类型预估费用
 * - 委托合同签署：电子签约确认委托关系
 */

import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, ScrollView, View, useTheme } from 'tamagui';
import {
  ArrowLeft,
  Banknote,
  FileText,
  Home,
  Users,
  File,
  ShoppingCart,
  Info,
  Image,
  Music,
  Video,
  Trash2,
  PlusCircle,
  Star,
  User,
  Check,
  CheckCircle,
  Square,
  CheckSquare,
} from 'lucide-react-native';
import { LawyerProfile, LawyerSpecialty } from '../types/legalService';
import { getLawyers } from '../services/legalService';

interface Props {
  navigation: any;
}

// 案件类型
const CASE_TYPES = [
  {
    id: 'alimony',
    label: '赡养费追索',
    icon: 'Banknote',
    description: '子女不履行赡养义务，追索赡养费',
    specialty: LawyerSpecialty.ELDER_CARE,
    estimatedFee: '5000-15000',
  },
  {
    id: 'inheritance',
    label: '遗产纠纷',
    icon: 'FileText',
    description: '遗产分配争议、遗嘱效力争议',
    specialty: LawyerSpecialty.INHERITANCE,
    estimatedFee: '8000-30000',
  },
  {
    id: 'property',
    label: '房产纠纷',
    icon: 'Home',
    description: '房产继承、过户、买卖纠纷',
    specialty: LawyerSpecialty.PROPERTY,
    estimatedFee: '10000-50000',
  },
  {
    id: 'marriage',
    label: '婚姻家庭',
    icon: 'Users',
    description: '离婚、财产分割、抚养权',
    specialty: LawyerSpecialty.MARRIAGE,
    estimatedFee: '5000-20000',
  },
  {
    id: 'contract',
    label: '合同纠纷',
    icon: 'File',
    description: '养老合同、借款合同等纠纷',
    specialty: LawyerSpecialty.CONTRACT,
    estimatedFee: '5000-20000',
  },
  {
    id: 'consumer',
    label: '消费维权',
    icon: 'ShoppingCart',
    description: '保健品欺诈、养老服务纠纷',
    specialty: LawyerSpecialty.CONSUMER_RIGHTS,
    estimatedFee: '3000-10000',
  },
];

// 图标映射
const IconMap: Record<string, any> = {
  Banknote,
  FileText,
  Home,
  Users,
  File,
  ShoppingCart,
};

// 证据材料
interface Evidence {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  uri: string;
  size?: number;
}

// 委托步骤
type DelegationStep = 'type' | 'description' | 'evidence' | 'lawyer' | 'contract';

const CaseDelegationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  // 状态管理
  const [currentStep, setCurrentStep] = useState<DelegationStep>('type');
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [selectedCaseType, setSelectedCaseType] = useState<string>('');
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'urgent' | 'very_urgent'>('normal');
  const [evidences, setEvidences] = useState<Evidence[]>([]);

  // 律师相关
  const [recommendedLawyers, setRecommendedLawyers] = useState<LawyerProfile[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);

  // 合同相关
  const [agreeToContract, setAgreeToContract] = useState(false);

  useEffect(() => {
    if (currentStep === 'lawyer' && selectedCaseType) {
      loadRecommendedLawyers();
    }
  }, [currentStep, selectedCaseType]);

  const loadRecommendedLawyers = async () => {
    try {
      setLoading(true);
      const caseType = CASE_TYPES.find(t => t.id === selectedCaseType);
      if (!caseType) return;

      const allLawyers = await getLawyers();
      const filtered = allLawyers
        .filter(lawyer => lawyer.specialties.includes(caseType.specialty))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      setRecommendedLawyers(filtered);
    } catch (error) {
      console.error('Error loading lawyers:', error);
      Alert.alert('加载失败', '无法加载律师信息');
    } finally {
      setLoading(false);
    }
  };

  // 添加证据
  const handleAddEvidence = () => {
    Alert.alert(
      '上传证据',
      '选择证据类型',
      [
        {
          text: '拍照',
          onPress: () => {
            const mockEvidence: Evidence = {
              id: `evidence_${Date.now()}`,
              name: `照片_${evidences.length + 1}.jpg`,
              type: 'image',
              uri: `https://via.placeholder.com/300?text=Evidence${evidences.length + 1}`,
            };
            setEvidences([...evidences, mockEvidence]);
          },
        },
        {
          text: '选择文件',
          onPress: () => {
            const mockEvidence: Evidence = {
              id: `evidence_${Date.now()}`,
              name: `文档_${evidences.length + 1}.pdf`,
              type: 'document',
              uri: `file://document_${evidences.length + 1}.pdf`,
            };
            setEvidences([...evidences, mockEvidence]);
          },
        },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  // 删除证据
  const handleRemoveEvidence = (evidenceId: string) => {
    setEvidences(evidences.filter(e => e.id !== evidenceId));
  };

  // 提交委托
  const handleSubmitDelegation = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '委托成功',
        `您的案件已成功委托给${selectedLawyer?.name}律师\n\n律师将在24小时内与您联系确认案件细节`,
        [
          {
            text: '查看案件',
            onPress: () => navigation.navigate('MyCases'),
          },
          {
            text: '确定',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  // 返回处理
  const handleBack = () => {
    if (currentStep === 'description') {
      setCurrentStep('type');
    } else if (currentStep === 'evidence') {
      setCurrentStep('description');
    } else if (currentStep === 'lawyer') {
      setCurrentStep('evidence');
    } else if (currentStep === 'contract') {
      setCurrentStep('lawyer');
    } else {
      navigation.goBack();
    }
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    const steps = [
      { key: 'type' as DelegationStep, label: '案件类型' },
      { key: 'description' as DelegationStep, label: '案情描述' },
      { key: 'evidence' as DelegationStep, label: '证据材料' },
      { key: 'lawyer' as DelegationStep, label: '选择律师' },
      { key: 'contract' as DelegationStep, label: '签署合同' },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <XStack
        backgroundColor="$background"
        paddingHorizontal="$2.5"
        paddingVertical="$3"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        {steps.map((step, index) => (
          <YStack key={step.key} flex={1} alignItems="center" position="relative">
            <View
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor={index <= currentIndex ? (index < currentIndex ? '$success' : '$primary') : '$color4'}
              justifyContent="center"
              alignItems="center"
              marginBottom="$1.5"
              zIndex={2}
            >
              {index < currentIndex ? (
                <Check size={14} color="white" />
              ) : (
                <Text
                  fontSize={12}
                  fontWeight="700"
                  color={index <= currentIndex ? 'white' : '$color10'}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              fontSize={10}
              color={index <= currentIndex ? '$color12' : '$color10'}
              fontWeight={index <= currentIndex ? '500' : '400'}
              textAlign="center"
            >
              {step.label}
            </Text>
            {index < steps.length - 1 && (
              <View
                position="absolute"
                top={14}
                left="50%"
                right="-50%"
                height={2}
                backgroundColor={index < currentIndex ? '$primary' : '$color4'}
                zIndex={1}
              />
            )}
          </YStack>
        ))}
      </XStack>
    );
  };

  // 渲染案件类型选择
  const renderCaseTypeSelection = () => {
    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$3">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              选择案件类型
            </Text>
            <Text fontSize="$4" color="$color10">
              请选择您需要委托的案件类型
            </Text>
          </YStack>

          <XStack flexWrap="wrap" gap="$3">
            {CASE_TYPES.map(caseType => {
              const isSelected = selectedCaseType === caseType.id;
              const IconComponent = IconMap[caseType.icon];
              return (
                <Pressable
                  key={caseType.id}
                  onPress={() => setSelectedCaseType(caseType.id)}
                  style={{ width: '48%' }}
                >
                  <View
                    backgroundColor={isSelected ? '$color2' : '$background'}
                    borderRadius="$4"
                    padding="$3"
                    borderWidth={2}
                    borderColor={isSelected ? '$primary' : '$color5'}
                    alignItems="center"
                  >
                    <View
                      width={56}
                      height={56}
                      borderRadius={28}
                      backgroundColor={isSelected ? '$background' : '$color4'}
                      justifyContent="center"
                      alignItems="center"
                      marginBottom="$2"
                    >
                      {IconComponent && (
                        <IconComponent
                          size={28}
                          color={isSelected ? primaryColor : color10}
                        />
                      )}
                    </View>
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={isSelected ? '$primary' : '$color12'}
                      marginBottom="$1"
                    >
                      {caseType.label}
                    </Text>
                    <Text
                      fontSize={11}
                      color="$color10"
                      textAlign="center"
                      marginBottom="$1.5"
                      numberOfLines={2}
                    >
                      {caseType.description}
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$error">
                      代理费：{caseType.estimatedFee}元
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>

          <Pressable
            onPress={() => {
              if (selectedCaseType) {
                setCurrentStep('description');
              }
            }}
            disabled={!selectedCaseType}
          >
            <View
              paddingVertical="$3"
              backgroundColor={selectedCaseType ? '$primary' : '$color5'}
              borderRadius="$10"
              alignItems="center"
            >
              <Text
                fontSize="$5"
                fontWeight="600"
                color={selectedCaseType ? 'white' : '$color10'}
              >
                下一步
              </Text>
            </View>
          </Pressable>
        </YStack>
      </ScrollView>
    );
  };

  // 渲染案情描述
  const renderCaseDescription = () => {
    const canProceed = caseTitle.trim() && caseDescription.trim();

    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              详细描述案情
            </Text>
            <Text fontSize="$4" color="$color10">
              请详细描述您的案件情况，方便律师了解
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              案件标题 *
            </Text>
            <TextInput
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: '#fff',
                borderRadius: 8,
                fontSize: 15,
                color: '#333',
                borderWidth: 1,
                borderColor: '#E2E6EC',
              }}
              placeholder="如：子女拒绝支付赡养费"
              placeholderTextColor="#999"
              value={caseTitle}
              onChangeText={setCaseTitle}
              maxLength={50}
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              案情描述 *
            </Text>
            <TextInput
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: '#fff',
                borderRadius: 8,
                fontSize: 15,
                color: '#333',
                borderWidth: 1,
                borderColor: '#E2E6EC',
                height: 150,
                textAlignVertical: 'top',
              }}
              placeholder="请详细描述案件的起因、经过、现状等（500字以内）"
              placeholderTextColor="#999"
              multiline
              value={caseDescription}
              onChangeText={setCaseDescription}
              maxLength={500}
            />
            <Text fontSize="$2" color="$color10" textAlign="right">
              {caseDescription.length}/500
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              紧急程度 *
            </Text>
            <XStack gap="$3">
              {[
                { value: 'normal' as const, label: '一般', color: successColor },
                { value: 'urgent' as const, label: '紧急', color: warningColor },
                { value: 'very_urgent' as const, label: '非常紧急', color: errorColor },
              ].map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => setUrgencyLevel(option.value)}
                  style={{ flex: 1 }}
                >
                  <View
                    paddingVertical="$2.5"
                    backgroundColor={urgencyLevel === option.value ? `${option.color}20` : '$background'}
                    borderRadius="$3"
                    borderWidth={2}
                    borderColor={urgencyLevel === option.value ? option.color : '$color5'}
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="500"
                      style={{ color: urgencyLevel === option.value ? option.color : color10 }}
                    >
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </YStack>

          <XStack gap="$3">
            <Pressable onPress={() => setCurrentStep('type')} style={{ flex: 1 }}>
              <View
                paddingVertical="$3"
                backgroundColor="$color4"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$color10">
                  上一步
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                if (canProceed) {
                  setCurrentStep('evidence');
                }
              }}
              disabled={!canProceed}
              style={{ flex: 1 }}
            >
              <View
                paddingVertical="$3"
                backgroundColor={canProceed ? '$primary' : '$color5'}
                borderRadius="$10"
                alignItems="center"
              >
                <Text
                  fontSize="$4"
                  fontWeight="600"
                  color={canProceed ? 'white' : '$color10'}
                >
                  下一步
                </Text>
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </ScrollView>
    );
  };

  // 获取证据图标
  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'image':
        return Image;
      case 'document':
        return FileText;
      case 'audio':
        return Music;
      case 'video':
        return Video;
      default:
        return File;
    }
  };

  // 渲染证据材料上传
  const renderEvidenceUpload = () => {
    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              上传证据材料
            </Text>
            <Text fontSize="$4" color="$color10">
              请上传与案件相关的证据材料（可选，后续也可补充）
            </Text>
          </YStack>

          <View
            style={{ backgroundColor: `${primaryColor}15` }}
            padding="$3"
            borderRadius="$3"
          >
            <XStack gap="$3">
              <Info size={20} color={primaryColor} />
              <YStack flex={1} gap="$1">
                <Text fontSize="$3" fontWeight="600" color="$primary">
                  证据材料包括：
                </Text>
                <Text fontSize="$3" color="$color12" lineHeight={20}>
                  • 合同、协议等书面文件{'\n'}
                  • 聊天记录截图、通话录音{'\n'}
                  • 银行流水、转账记录{'\n'}
                  • 相关照片、视频资料
                </Text>
              </YStack>
            </XStack>
          </View>

          <YStack gap="$3">
            {evidences.map((evidence) => {
              const EvidenceIcon = getEvidenceIcon(evidence.type);
              return (
                <View
                  key={evidence.id}
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <XStack alignItems="center" gap="$3">
                    <View
                      width={48}
                      height={48}
                      borderRadius="$2"
                      style={{ backgroundColor: `${primaryColor}15` }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <EvidenceIcon size={24} color={primaryColor} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="500" color="$color12">
                        {evidence.name}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        {evidence.type === 'image' && '图片'}
                        {evidence.type === 'document' && '文档'}
                        {evidence.type === 'audio' && '录音'}
                        {evidence.type === 'video' && '视频'}
                      </Text>
                    </YStack>
                    <Pressable onPress={() => handleRemoveEvidence(evidence.id)}>
                      <View padding="$2">
                        <Trash2 size={20} color={errorColor} />
                      </View>
                    </Pressable>
                  </XStack>
                </View>
              );
            })}

            <Pressable onPress={handleAddEvidence}>
              <View
                padding="$4"
                backgroundColor="$background"
                borderRadius="$3"
                borderWidth={2}
                borderColor="$primary"
                borderStyle="dashed"
                alignItems="center"
              >
                <XStack gap="$2" alignItems="center">
                  <PlusCircle size={24} color={primaryColor} />
                  <Text fontSize="$4" fontWeight="500" color="$primary">
                    添加证据材料
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </YStack>

          <XStack gap="$3">
            <Pressable onPress={() => setCurrentStep('description')} style={{ flex: 1 }}>
              <View
                paddingVertical="$3"
                backgroundColor="$color4"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$color10">
                  上一步
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => setCurrentStep('lawyer')} style={{ flex: 1 }}>
              <View
                paddingVertical="$3"
                backgroundColor="$primary"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="white">
                  下一步
                </Text>
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </ScrollView>
    );
  };

  // 渲染律师选择
  const renderLawyerSelection = () => {
    const caseType = CASE_TYPES.find(t => t.id === selectedCaseType);

    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              选择委托律师
            </Text>
            <Text fontSize="$4" color="$color10">
              为您推荐{caseType?.label}领域的专业律师
            </Text>
          </YStack>

          {loading ? (
            <YStack paddingVertical="$8" alignItems="center">
              <ActivityIndicator size="large" color={primaryColor} />
              <Text fontSize="$4" color="$color10" marginTop="$3">
                正在为您推荐律师...
              </Text>
            </YStack>
          ) : (
            <YStack gap="$3">
              {recommendedLawyers.map((lawyer, index) => {
                const isSelected = selectedLawyer?.id === lawyer.id;
                return (
                  <Pressable key={lawyer.id} onPress={() => setSelectedLawyer(lawyer)}>
                    <View
                      backgroundColor={isSelected ? '$color2' : '$background'}
                      borderRadius="$4"
                      padding="$3"
                      borderWidth={2}
                      borderColor={isSelected ? '$primary' : '$color5'}
                      position="relative"
                    >
                      {index === 0 && (
                        <View
                          position="absolute"
                          top={12}
                          right={12}
                          backgroundColor="$warning"
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$10"
                        >
                          <XStack gap="$1" alignItems="center">
                            <Star size={10} color="white" />
                            <Text fontSize={10} color="white" fontWeight="500">
                              推荐
                            </Text>
                          </XStack>
                        </View>
                      )}

                      <XStack marginBottom="$3">
                        <View
                          width={56}
                          height={56}
                          borderRadius={28}
                          backgroundColor="$color4"
                          justifyContent="center"
                          alignItems="center"
                          marginRight="$3"
                        >
                          <User size={28} color={color10} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$0.5">
                            {lawyer.name}
                          </Text>
                          <Text fontSize="$3" color="$color10" marginBottom="$1">
                            {lawyer.lawFirm}
                          </Text>
                          <XStack alignItems="center" gap="$1">
                            <Star size={14} color={warningColor} fill={warningColor} />
                            <Text fontSize="$3" fontWeight="600" color="$color12">
                              {lawyer.rating.toFixed(1)}
                            </Text>
                            <Text fontSize="$2" color="$color10">
                              {lawyer.caseCount}个案件
                            </Text>
                          </XStack>
                        </YStack>
                      </XStack>

                      <XStack
                        backgroundColor="$color4"
                        borderRadius="$3"
                        padding="$2.5"
                        marginBottom="$2"
                      >
                        <YStack flex={1} alignItems="center">
                          <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                            执业年限
                          </Text>
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            {lawyer.yearsOfExperience}年
                          </Text>
                        </YStack>
                        <YStack flex={1} alignItems="center">
                          <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                            胜诉率
                          </Text>
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            {(lawyer.successRate * 100).toFixed(0)}%
                          </Text>
                        </YStack>
                        <YStack flex={1} alignItems="center">
                          <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                            预估代理费
                          </Text>
                          <Text fontSize="$4" fontWeight="600" color="$error">
                            {caseType?.estimatedFee}元
                          </Text>
                        </YStack>
                      </XStack>

                      <Text fontSize="$3" color="$color10" numberOfLines={2} lineHeight={20}>
                        {lawyer.introduction}
                      </Text>

                      {isSelected && (
                        <XStack
                          justifyContent="center"
                          alignItems="center"
                          marginTop="$3"
                          paddingTop="$3"
                          borderTopWidth={1}
                          borderTopColor="$color5"
                          gap="$1.5"
                        >
                          <CheckCircle size={20} color={successColor} />
                          <Text fontSize="$3" fontWeight="600" color="$success">
                            已选择
                          </Text>
                        </XStack>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </YStack>
          )}

          <XStack gap="$3">
            <Pressable onPress={() => setCurrentStep('evidence')} style={{ flex: 1 }}>
              <View
                paddingVertical="$3"
                backgroundColor="$color4"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$color10">
                  上一步
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                if (selectedLawyer) {
                  setCurrentStep('contract');
                }
              }}
              disabled={!selectedLawyer}
              style={{ flex: 1 }}
            >
              <View
                paddingVertical="$3"
                backgroundColor={selectedLawyer ? '$primary' : '$color5'}
                borderRadius="$10"
                alignItems="center"
              >
                <Text
                  fontSize="$4"
                  fontWeight="600"
                  color={selectedLawyer ? 'white' : '$color10'}
                >
                  下一步
                </Text>
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </ScrollView>
    );
  };

  // 渲染合同签署
  const renderContractSigning = () => {
    const caseType = CASE_TYPES.find(t => t.id === selectedCaseType);

    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              签署委托合同
            </Text>
            <Text fontSize="$4" color="$color10">
              请仔细阅读委托合同条款
            </Text>
          </YStack>

          <View
            backgroundColor="$background"
            borderRadius="$4"
            padding="$4"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$5" fontWeight="700" color="$color12" textAlign="center" marginBottom="$4">
              法律服务委托合同
            </Text>

            <YStack gap="$4">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  甲方（委托人）信息
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  姓名：[用户姓名]{'\n'}
                  联系电话：[用户电话]
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  乙方（受托人）信息
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  律师姓名：{selectedLawyer?.name}{'\n'}
                  执业证号：{selectedLawyer?.licenseNumber}{'\n'}
                  所属律所：{selectedLawyer?.lawFirm}
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  委托事项
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  案件类型：{caseType?.label}{'\n'}
                  案件标题：{caseTitle}{'\n'}
                  紧急程度：
                  {urgencyLevel === 'normal' && '一般'}
                  {urgencyLevel === 'urgent' && '紧急'}
                  {urgencyLevel === 'very_urgent' && '非常紧急'}
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  服务内容
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  1. 案件法律分析与咨询{'\n'}
                  2. 证据材料整理与审查{'\n'}
                  3. 法律文书起草与审核{'\n'}
                  4. 出庭代理与辩护{'\n'}
                  5. 其他法律服务
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  费用约定
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  代理费用：{caseType?.estimatedFee}元（具体费用以双方协商为准）{'\n'}
                  支付方式：分期支付（预付30%，结案后支付70%）
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  双方权利义务
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  甲方权利：{'\n'}
                  • 了解案件进展情况{'\n'}
                  • 要求律师提供专业法律意见{'\n'}
                  • 查阅案件相关材料{'\n'}
                  {'\n'}
                  乙方义务：{'\n'}
                  • 维护委托人合法权益{'\n'}
                  • 保守委托人秘密{'\n'}
                  • 及时汇报案件进展
                </Text>
              </YStack>
            </YStack>
          </View>

          <Pressable onPress={() => setAgreeToContract(!agreeToContract)}>
            <View
              backgroundColor="$background"
              padding="$3"
              borderRadius="$3"
              borderWidth={1}
              borderColor="$color5"
            >
              <XStack alignItems="center" gap="$3">
                {agreeToContract ? (
                  <CheckSquare size={24} color={primaryColor} />
                ) : (
                  <Square size={24} color={color10} />
                )}
                <Text flex={1} fontSize="$3" color="$color12" lineHeight={20}>
                  我已仔细阅读并同意《法律服务委托合同》全部条款
                </Text>
              </XStack>
            </View>
          </Pressable>

          <XStack gap="$3">
            <Pressable onPress={() => setCurrentStep('lawyer')} style={{ flex: 1 }}>
              <View
                paddingVertical="$3"
                backgroundColor="$color4"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$color10">
                  上一步
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                if (agreeToContract) {
                  handleSubmitDelegation();
                }
              }}
              disabled={!agreeToContract || loading}
              style={{ flex: 1 }}
            >
              <View
                paddingVertical="$3"
                backgroundColor={agreeToContract ? '$primary' : '$color5'}
                borderRadius="$10"
                alignItems="center"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color={agreeToContract ? 'white' : '$color10'}
                  >
                    确认委托
                  </Text>
                )}
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </ScrollView>
    );
  };

  return (
    <View flex={1} backgroundColor="$color4">
      {/* TitleBar */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={handleBack}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            案件委托
          </Text>
          <View width={40} />
        </XStack>
      </View>

      {/* 步骤指示器 */}
      {renderStepIndicator()}

      {/* 内容区域 */}
      {currentStep === 'type' && renderCaseTypeSelection()}
      {currentStep === 'description' && renderCaseDescription()}
      {currentStep === 'evidence' && renderEvidenceUpload()}
      {currentStep === 'lawyer' && renderLawyerSelection()}
      {currentStep === 'contract' && renderContractSigning()}
    </View>
  );
};

export default CaseDelegationScreen;
