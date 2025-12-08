/**
 * 意定监护协议创建页面
 * 帮助用户创建意定监护协议
 */

import React, { useState } from 'react';
import {
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
} from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Info,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Guardian, GuardianDuty } from '../types/legalService';
import { createGuardianshipAgreement } from '../services/legalService';
import { TitleBar } from '@/components/TitleBar';

const GOLD_COLOR = '#D4AF37';

interface GuardianshipFormData {
  wardName: string;
  wardIdNumber: string;
  wardAge: number;
  guardians: Guardian[];
  scope: {
    dailyCare: boolean;
    medicalDecision: boolean;
    propertyManagement: boolean;
    legalRepresentation: boolean;
  };
  propertyRights: {
    pensionManagement: boolean;
    realEstateDisposal: boolean;
    bankAccountAccess: boolean;
    investmentDecision: boolean;
  };
  supervision: {
    enabled: boolean;
    supervisorName: string;
    supervisorRelation: string;
    supervisorPhone: string;
    reportFrequency: string;
    auditRights: boolean;
  };
  specialTerms: string[];
}

const GuardianshipCreatorScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GuardianshipFormData>({
    wardName: '',
    wardIdNumber: '',
    wardAge: 0,
    guardians: [],
    scope: {
      dailyCare: true,
      medicalDecision: true,
      propertyManagement: true,
      legalRepresentation: true,
    },
    propertyRights: {
      pensionManagement: false,
      bankAccountAccess: false,
      realEstateDisposal: false,
      investmentDecision: false,
    },
    supervision: {
      enabled: false,
      supervisorName: '',
      supervisorRelation: '',
      supervisorPhone: '',
      reportFrequency: '',
      auditRights: false,
    },
    specialTerms: [],
  });

  const [guardianInput, setGuardianInput] = useState({
    name: '',
    relation: '',
    idNumber: '',
    phone: '',
    address: '',
    type: 'individual' as 'individual' | 'institution',
  });

  const [termInput, setTermInput] = useState('');

  const totalSteps = 5;
  const stepTitles = ['被监护人信息', '监护人选定', '监护职责范围', '财产管理权限', '监督机制设置'];

  const updateFormData = (updates: Partial<GuardianshipFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addGuardian = () => {
    if (!guardianInput.name || !guardianInput.relation || !guardianInput.phone) {
      Alert.alert('提示', '请填写监护人的完整信息');
      return;
    }

    const newGuardian: Guardian = {
      name: guardianInput.name,
      relation: guardianInput.relation,
      idNumber: guardianInput.idNumber,
      phone: guardianInput.phone,
      address: guardianInput.address,
      duties: [],
    };

    updateFormData({ guardians: [...formData.guardians, newGuardian] });
    setGuardianInput({
      name: '',
      relation: '',
      idNumber: '',
      phone: '',
      address: '',
      type: 'individual',
    });
  };

  const removeGuardian = (index: number) => {
    const newGuardians = formData.guardians.filter((_, i) => i !== index);
    updateFormData({ guardians: newGuardians });
  };

  const addSpecialTerm = () => {
    if (!termInput.trim()) {
      Alert.alert('提示', '请输入条款内容');
      return;
    }
    updateFormData({ specialTerms: [...formData.specialTerms, termInput.trim()] });
    setTermInput('');
  };

  const removeSpecialTerm = (index: number) => {
    const newTerms = formData.specialTerms.filter((_, i) => i !== index);
    updateFormData({ specialTerms: newTerms });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.wardName || !formData.wardIdNumber) {
          Alert.alert('提示', '请填写被监护人基本信息');
          return false;
        }
        if (formData.wardAge < 18) {
          Alert.alert('提示', '意定监护适用于成年人，未成年人请使用法定监护');
          return false;
        }
        break;
      case 2:
        if (formData.guardians.length === 0) {
          Alert.alert('提示', '请至少指定一位监护人');
          return false;
        }
        break;
      case 3:
        if (
          !formData.scope.dailyCare &&
          !formData.scope.medicalDecision &&
          !formData.scope.propertyManagement &&
          !formData.scope.legalRepresentation
        ) {
          Alert.alert('提示', '请至少选择一项监护职责');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const duties: GuardianDuty[] = [];
      if (formData.scope.dailyCare) duties.push(GuardianDuty.DAILY_CARE);
      if (formData.scope.medicalDecision) duties.push(GuardianDuty.MEDICAL_DECISION);
      if (formData.scope.propertyManagement) duties.push(GuardianDuty.PROPERTY_MANAGEMENT);
      if (formData.scope.legalRepresentation) duties.push(GuardianDuty.LEGAL_REPRESENTATION);

      const guardiansWithDuties = formData.guardians.map(g => ({ ...g, duties }));

      const agreementData = {
        userId: 'current_user_id',
        status: 'draft' as const,
        wardName: formData.wardName,
        wardIdNumber: formData.wardIdNumber,
        wardAge: formData.wardAge,
        guardians: guardiansWithDuties,
        scope: formData.scope,
        propertyRights: formData.propertyRights,
        supervision: formData.supervision,
        specialTerms: formData.specialTerms.length > 0 ? formData.specialTerms : undefined,
        effectiveDate: undefined,
        expiryDate: undefined,
      };

      await createGuardianshipAgreement(agreementData);

      Alert.alert(
        '创建成功',
        '意定监护协议草稿已保存。建议您进行公证以增强法律效力。',
        [
          { text: '查看协议', onPress: () => navigation.navigate('MyGuardianship' as never) },
          { text: '返回', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '创建协议失败，请重试');
      console.error('Error creating guardianship agreement:', error);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.color5?.val,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: theme.color2?.val,
    color: theme.color12?.val,
  };

  // Step 1: Ward Information
  const renderStep1 = () => (
    <YStack padding="$2.5" gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">被监护人信息</Text>
      <Text fontSize="$3" color="$color10" lineHeight={20}>
        意定监护是您在意识清楚时为自己指定未来的监护人
      </Text>

      <XStack backgroundColor="$color4" borderRadius="$4" padding="$2" gap="$1.5">
        <Info size={20} color={primaryColor} />
        <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
          意定监护适用于有完全民事行为能力的成年人，用于防范未来可能出现的意识不清或行动不便的情况
        </Text>
      </XStack>

      <View backgroundColor="$color2" borderRadius="$4" padding="$2" borderWidth={1} borderColor="$color5">
        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">您的姓名 *</Text>
        <TextInput
          style={inputStyle}
          placeholder="请输入您的姓名"
          placeholderTextColor={color10}
          value={formData.wardName}
          onChangeText={text => updateFormData({ wardName: text })}
        />

        <Text fontSize="$3" fontWeight="500" color="$color12" marginTop="$2" marginBottom="$1">身份证号 *</Text>
        <TextInput
          style={inputStyle}
          placeholder="请输入身份证号"
          placeholderTextColor={color10}
          value={formData.wardIdNumber}
          onChangeText={text => updateFormData({ wardIdNumber: text })}
        />

        <Text fontSize="$3" fontWeight="500" color="$color12" marginTop="$2" marginBottom="$1">年龄 *</Text>
        <TextInput
          style={inputStyle}
          placeholder="请输入年龄"
          placeholderTextColor={color10}
          value={formData.wardAge > 0 ? formData.wardAge.toString() : ''}
          onChangeText={text => updateFormData({ wardAge: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>
    </YStack>
  );

  // Step 2: Guardian Selection
  const renderStep2 = () => (
    <YStack padding="$2.5" gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">监护人选定</Text>
      <Text fontSize="$3" color="$color10" lineHeight={20}>
        您可以指定一位或多位监护人，建议选择信任的亲友或专业机构
      </Text>

      {formData.guardians.map((guardian, index) => (
        <View
          key={index}
          backgroundColor="$color2"
          borderRadius="$4"
          padding="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$color12">{guardian.name}</Text>
              <Text fontSize="$2" color="$color10">关系：{guardian.relation}</Text>
              <Text fontSize="$2" color="$color10">电话：{guardian.phone}</Text>
              {guardian.address && (
                <Text fontSize="$2" color="$color10">地址：{guardian.address}</Text>
              )}
            </YStack>
            <Pressable onPress={() => removeGuardian(index)}>
              <Trash2 size={20} color={errorColor} />
            </Pressable>
          </XStack>
        </View>
      ))}

      <View backgroundColor="$color2" borderRadius="$4" padding="$2" borderWidth={1} borderColor="$color5">
        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1.5">监护人类型</Text>
        <XStack gap="$2" marginBottom="$2">
          <Pressable onPress={() => setGuardianInput({ ...guardianInput, type: 'individual' })}>
            <View
              paddingHorizontal="$3"
              paddingVertical="$1.5"
              borderRadius="$10"
              borderWidth={1}
              borderColor={guardianInput.type === 'individual' ? '$primary' : '$color5'}
              backgroundColor={guardianInput.type === 'individual' ? '$color4' : 'transparent'}
            >
              <Text
                fontSize="$3"
                color={guardianInput.type === 'individual' ? '$primary' : '$color10'}
                fontWeight={guardianInput.type === 'individual' ? '600' : '400'}
              >
                个人（亲友）
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setGuardianInput({ ...guardianInput, type: 'institution' })}>
            <View
              paddingHorizontal="$3"
              paddingVertical="$1.5"
              borderRadius="$10"
              borderWidth={1}
              borderColor={guardianInput.type === 'institution' ? '$primary' : '$color5'}
              backgroundColor={guardianInput.type === 'institution' ? '$color4' : 'transparent'}
            >
              <Text
                fontSize="$3"
                color={guardianInput.type === 'institution' ? '$primary' : '$color10'}
                fontWeight={guardianInput.type === 'institution' ? '600' : '400'}
              >
                专业机构
              </Text>
            </View>
          </Pressable>
        </XStack>

        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
          {guardianInput.type === 'individual' ? '监护人姓名' : '机构名称'} *
        </Text>
        <TextInput
          style={{ ...inputStyle, marginBottom: 12 }}
          placeholder={guardianInput.type === 'individual' ? '请输入监护人姓名' : '请输入机构名称'}
          placeholderTextColor={color10}
          value={guardianInput.name}
          onChangeText={text => setGuardianInput({ ...guardianInput, name: text })}
        />

        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">关系/类型 *</Text>
        <TextInput
          style={{ ...inputStyle, marginBottom: 12 }}
          placeholder={guardianInput.type === 'individual' ? '例如：子女、配偶、朋友' : '例如：养老服务机构、律师事务所'}
          placeholderTextColor={color10}
          value={guardianInput.relation}
          onChangeText={text => setGuardianInput({ ...guardianInput, relation: text })}
        />

        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
          {guardianInput.type === 'individual' ? '身份证号' : '统一社会信用代码'}
        </Text>
        <TextInput
          style={{ ...inputStyle, marginBottom: 12 }}
          placeholder={guardianInput.type === 'individual' ? '请输入身份证号' : '请输入统一社会信用代码'}
          placeholderTextColor={color10}
          value={guardianInput.idNumber}
          onChangeText={text => setGuardianInput({ ...guardianInput, idNumber: text })}
        />

        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">联系电话 *</Text>
        <TextInput
          style={{ ...inputStyle, marginBottom: 12 }}
          placeholder="请输入联系电话"
          placeholderTextColor={color10}
          value={guardianInput.phone}
          onChangeText={text => setGuardianInput({ ...guardianInput, phone: text })}
          keyboardType="phone-pad"
        />

        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">地址</Text>
        <TextInput
          style={{ ...inputStyle, marginBottom: 16 }}
          placeholder="请输入地址"
          placeholderTextColor={color10}
          value={guardianInput.address}
          onChangeText={text => setGuardianInput({ ...guardianInput, address: text })}
        />

        <Pressable onPress={addGuardian}>
          <XStack
            backgroundColor="$primary"
            borderRadius="$10"
            paddingVertical="$2"
            alignItems="center"
            justifyContent="center"
            gap="$1"
          >
            <Plus size={18} color="white" />
            <Text fontSize="$3" fontWeight="600" color="white">添加监护人</Text>
          </XStack>
        </Pressable>
      </View>

      <XStack style={{ backgroundColor: `${GOLD_COLOR}15` }} borderRadius="$4" padding="$2" gap="$1.5">
        <Lightbulb size={20} color={GOLD_COLOR} />
        <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
          建议：可以指定2-3位监护人，并明确他们的监护顺序和分工。同时建议选择年龄相对年轻、身体健康、有责任心的人选。
        </Text>
      </XStack>
    </YStack>
  );

  // Step 3: Guardian Duties
  const renderStep3 = () => {
    const scopeItems = [
      { key: 'dailyCare', title: '生活照料', description: '包括日常起居、饮食、卫生等生活方面的照料' },
      { key: 'medicalDecision', title: '医疗决策', description: '包括就医选择、治疗方案决定、手术同意等' },
      { key: 'propertyManagement', title: '财产管理', description: '包括收入支出管理、资产保值增值等（下一步可详细设置权限）' },
      { key: 'legalRepresentation', title: '法律代理', description: '包括签订合同、诉讼代理、权益维护等法律事务' },
    ];

    return (
      <YStack padding="$2.5" gap="$2">
        <Text fontSize="$5" fontWeight="600" color="$color12">监护职责范围</Text>
        <Text fontSize="$3" color="$color10" lineHeight={20}>请选择监护人的职责范围</Text>

        <View backgroundColor="$color2" borderRadius="$4" padding="$2" borderWidth={1} borderColor="$color5">
          {scopeItems.map((item, index) => (
            <XStack
              key={item.key}
              alignItems="center"
              paddingVertical="$2"
              borderBottomWidth={index < scopeItems.length - 1 ? 1 : 0}
              borderBottomColor="$color5"
            >
              <YStack flex={1} marginRight="$2">
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                  {item.title}
                </Text>
                <Text fontSize="$2" color="$color10" lineHeight={16}>
                  {item.description}
                </Text>
              </YStack>
              <Switch
                value={formData.scope[item.key as keyof typeof formData.scope]}
                onValueChange={value =>
                  updateFormData({ scope: { ...formData.scope, [item.key]: value } })
                }
                trackColor={{ false: theme.color5?.val, true: `${primaryColor}60` }}
                thumbColor={formData.scope[item.key as keyof typeof formData.scope] ? primaryColor : theme.color10?.val}
              />
            </XStack>
          ))}
        </View>
      </YStack>
    );
  };

  // Step 4: Property Rights
  const renderStep4 = () => {
    const propertyItems = [
      { key: 'pensionManagement', title: '退休金管理', description: '管理您的退休金、养老金等固定收入' },
      { key: 'bankAccountAccess', title: '银行账户管理', description: '管理您的银行存款、取款、转账等' },
      { key: 'realEstateDisposal', title: '房产处置权', description: '出售、出租您的房产（建议谨慎授权）' },
      { key: 'investmentDecision', title: '投资决策权', description: '进行理财、股票、基金等投资决策' },
    ];

    return (
      <YStack padding="$2.5" gap="$2">
        <Text fontSize="$5" fontWeight="600" color="$color12">财产管理权限</Text>
        <Text fontSize="$3" color="$color10" lineHeight={20}>请详细设置监护人对您财产的管理权限</Text>

        {!formData.scope.propertyManagement && (
          <XStack
            style={{ backgroundColor: `${GOLD_COLOR}15` }}
            borderRadius="$4"
            padding="$2"
            borderLeftWidth={3}
            borderLeftColor={GOLD_COLOR}
            gap="$1.5"
          >
            <Info size={20} color={GOLD_COLOR} />
            <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
              您在上一步未选择"财产管理"职责，以下权限设置将不生效
            </Text>
          </XStack>
        )}

        <View backgroundColor="$color2" borderRadius="$4" padding="$2" borderWidth={1} borderColor="$color5">
          {propertyItems.map((item, index) => (
            <XStack
              key={item.key}
              alignItems="center"
              paddingVertical="$2"
              borderBottomWidth={index < propertyItems.length - 1 ? 1 : 0}
              borderBottomColor="$color5"
              opacity={formData.scope.propertyManagement ? 1 : 0.5}
            >
              <YStack flex={1} marginRight="$2">
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                  {item.title}
                </Text>
                <Text fontSize="$2" color="$color10" lineHeight={16}>
                  {item.description}
                </Text>
              </YStack>
              <Switch
                value={formData.propertyRights[item.key as keyof typeof formData.propertyRights]}
                onValueChange={value =>
                  updateFormData({ propertyRights: { ...formData.propertyRights, [item.key]: value } })
                }
                trackColor={{ false: theme.color5?.val, true: `${primaryColor}60` }}
                thumbColor={formData.propertyRights[item.key as keyof typeof formData.propertyRights] ? primaryColor : theme.color10?.val}
                disabled={!formData.scope.propertyManagement}
              />
            </XStack>
          ))}
        </View>

        <XStack style={{ backgroundColor: `${errorColor}10` }} borderRadius="$4" padding="$2" gap="$1.5">
          <AlertTriangle size={20} color={errorColor} />
          <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
            重要提示：财产管理权限较大，建议设置监督机制（下一步）以防止财产被侵占
          </Text>
        </XStack>
      </YStack>
    );
  };

  // Step 5: Supervision
  const renderStep5 = () => (
    <YStack padding="$2.5" gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">监督机制设置</Text>
      <Text fontSize="$3" color="$color10" lineHeight={20}>
        设置监督人可以有效防止监护人滥用职权或侵占财产
      </Text>

      <View backgroundColor="$color2" borderRadius="$4" padding="$2" borderWidth={1} borderColor="$color5">
        <XStack alignItems="center" paddingVertical="$1">
          <YStack flex={1} marginRight="$2">
            <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
              启用监督机制
            </Text>
            <Text fontSize="$2" color="$color10" lineHeight={16}>
              指定监督人对监护人的行为进行监督
            </Text>
          </YStack>
          <Switch
            value={formData.supervision.enabled}
            onValueChange={value =>
              updateFormData({ supervision: { ...formData.supervision, enabled: value } })
            }
            trackColor={{ false: theme.color5?.val, true: `${primaryColor}60` }}
            thumbColor={formData.supervision.enabled ? primaryColor : theme.color10?.val}
          />
        </XStack>
      </View>

      {formData.supervision.enabled && (
        <View backgroundColor="$color2" borderRadius="$4" padding="$2" borderWidth={1} borderColor="$color5">
          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">监督人姓名 *</Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: 12 }}
            placeholder="请输入监督人姓名"
            placeholderTextColor={color10}
            value={formData.supervision.supervisorName}
            onChangeText={text =>
              updateFormData({ supervision: { ...formData.supervision, supervisorName: text } })
            }
          />

          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">与您的关系 *</Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: 12 }}
            placeholder="例如：亲属、律师、社工等"
            placeholderTextColor={color10}
            value={formData.supervision.supervisorRelation}
            onChangeText={text =>
              updateFormData({ supervision: { ...formData.supervision, supervisorRelation: text } })
            }
          />

          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">联系电话 *</Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: 12 }}
            placeholder="请输入联系电话"
            placeholderTextColor={color10}
            value={formData.supervision.supervisorPhone}
            onChangeText={text =>
              updateFormData({ supervision: { ...formData.supervision, supervisorPhone: text } })
            }
            keyboardType="phone-pad"
          />

          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">报告频率</Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: 16 }}
            placeholder="例如：每月、每季度、每半年"
            placeholderTextColor={color10}
            value={formData.supervision.reportFrequency}
            onChangeText={text =>
              updateFormData({ supervision: { ...formData.supervision, reportFrequency: text } })
            }
          />

          <XStack alignItems="center" paddingVertical="$1">
            <YStack flex={1} marginRight="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                审计权
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={16}>
                监督人有权审计监护人的财产管理情况
              </Text>
            </YStack>
            <Switch
              value={formData.supervision.auditRights}
              onValueChange={value =>
                updateFormData({ supervision: { ...formData.supervision, auditRights: value } })
              }
              trackColor={{ false: theme.color5?.val, true: `${primaryColor}60` }}
              thumbColor={formData.supervision.auditRights ? primaryColor : theme.color10?.val}
            />
          </XStack>
        </View>
      )}

      {/* Special Terms */}
      <YStack marginTop="$2">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          其他特殊条款（可选）
        </Text>

        {formData.specialTerms.map((term, index) => (
          <View
            key={index}
            backgroundColor="$color2"
            borderRadius="$4"
            padding="$2"
            borderWidth={1}
            borderColor="$color5"
            marginBottom="$2"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$2" color="$color10" flex={1}>{term}</Text>
              <Pressable onPress={() => removeSpecialTerm(index)}>
                <Trash2 size={18} color={errorColor} />
              </Pressable>
            </XStack>
          </View>
        ))}

        <TextInput
          style={{ ...inputStyle, height: 80, textAlignVertical: 'top', marginBottom: 12 }}
          placeholder="例如：监护人不得将我送入养老院、监护人每月需向我汇报财产状况等"
          placeholderTextColor={color10}
          value={termInput}
          onChangeText={setTermInput}
          multiline
          numberOfLines={3}
        />

        <Pressable onPress={addSpecialTerm}>
          <XStack
            backgroundColor="$primary"
            borderRadius="$10"
            paddingVertical="$2"
            alignItems="center"
            justifyContent="center"
            gap="$1"
          >
            <Plus size={18} color="white" />
            <Text fontSize="$3" fontWeight="600" color="white">添加条款</Text>
          </XStack>
        </Pressable>
      </YStack>

      <XStack backgroundColor="$color4" borderRadius="$4" padding="$2" gap="$1.5">
        <Info size={20} color={primaryColor} />
        <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
          完成后，强烈建议您到公证处办理意定监护公证，以确保协议的法律效力
        </Text>
      </XStack>
    </YStack>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View flex={1} backgroundColor="$background">
        {/* TitleBar with Progress */}
        <View paddingTop={insets.top}>
          <TitleBar
            title={stepTitles[currentStep - 1]}
            subtitle={`${currentStep} / ${totalSteps}`}
            renderRight={() => (
              <YStack flex={1} alignItems="center">
                <View
                  width="100%"
                  height={4}
                  backgroundColor="$color5"
                  borderRadius={2}
                >
                  <View
                    height={4}
                    backgroundColor="$primary"
                    borderRadius={2}
                    width={`${(currentStep / totalSteps) * 100}%`}
                  />
                </View>
              </YStack>
            )}
          />
        </View>

        {/* Step Content */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
          <View height={100} />
        </ScrollView>

        {/* Footer Buttons */}
        <View
          paddingHorizontal="$2.5"
          paddingVertical="$2"
          paddingBottom={insets.bottom + 16}
          backgroundColor="$color2"
          borderTopWidth={1}
          borderTopColor="$color5"
        >
          <XStack gap="$2">
            {currentStep > 1 && (
              <Pressable style={{ flex: 1 }} onPress={handlePrevious}>
                <XStack
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$10"
                  paddingVertical="$2"
                  alignItems="center"
                  justifyContent="center"
                  gap="$0.5"
                >
                  <ChevronLeft size={18} color={color10} />
                  <Text fontSize="$4" color="$color10">上一步</Text>
                </XStack>
              </Pressable>
            )}

            <Pressable style={{ flex: currentStep === 1 ? 1 : 2 }} onPress={handleNext}>
              <XStack
                backgroundColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
                justifyContent="center"
                gap="$0.5"
              >
                <Text fontSize="$4" fontWeight="600" color="white">
                  {currentStep === totalSteps ? '生成协议' : '下一步'}
                </Text>
                {currentStep < totalSteps && <ChevronRight size={18} color="white" />}
              </XStack>
            </Pressable>
          </XStack>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GuardianshipCreatorScreen;
