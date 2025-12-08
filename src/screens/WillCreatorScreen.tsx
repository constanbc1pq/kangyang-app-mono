/**
 * 遗嘱制作向导页面
 * 6步智能问答式遗嘱创建流程
 * Design: Following CLAUDE.md specs
 */

import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, TextInput as RNTextInput } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash2,
  FileText,
  Users,
  Shield,
  Video,
  Info,
  AlertTriangle,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import {
  WillType,
  WillStatus,
  Estate,
  Beneficiary,
} from '../types/legalService';
import { createWill } from '../services/legalService';
import { TitleBar } from '@/components/TitleBar';

interface WillFormData {
  willType: WillType | null;
  estates: Estate[];
  beneficiaries: Beneficiary[];
  specialClauses: string[];
  executor: string;
  executorIdNumber: string;
  executorPhone: string;
  title: string;
  testatorName: string;
  testatorIdNumber: string;
  testatorAge: number;
}

const WillCreatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WillFormData>({
    willType: null,
    estates: [],
    beneficiaries: [],
    specialClauses: [],
    executor: '',
    executorIdNumber: '',
    executorPhone: '',
    title: '',
    testatorName: '',
    testatorIdNumber: '',
    testatorAge: 0,
  });

  const [estateInput, setEstateInput] = useState({
    type: 'real_estate' as Estate['type'],
    description: '',
    location: '',
    estimatedValue: '',
  });

  const [beneficiaryInput, setBeneficiaryInput] = useState({
    name: '',
    relationship: '',
    idNumber: '',
    share: '',
  });

  const [clauseInput, setClauseInput] = useState('');

  const totalSteps = 6;
  const stepTitles = ['选择遗嘱类型', '财产清单', '受益人指定', '特殊条款', '遗嘱执行人', '确认信息'];

  const updateFormData = (updates: Partial<WillFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addEstate = () => {
    if (!estateInput.description || !estateInput.estimatedValue) {
      Alert.alert('提示', '请填写完整的财产信息');
      return;
    }
    const newEstate: Estate = {
      type: estateInput.type,
      description: estateInput.description,
      location: estateInput.location,
      estimatedValue: parseFloat(estateInput.estimatedValue),
      documentNumber: '',
    };
    updateFormData({ estates: [...formData.estates, newEstate] });
    setEstateInput({ type: 'real_estate', description: '', location: '', estimatedValue: '' });
  };

  const removeEstate = (index: number) => {
    updateFormData({ estates: formData.estates.filter((_, i) => i !== index) });
  };

  const addBeneficiary = () => {
    if (!beneficiaryInput.name || !beneficiaryInput.relationship || !beneficiaryInput.share) {
      Alert.alert('提示', '请填写完整的受益人信息');
      return;
    }
    const newBeneficiary: Beneficiary = {
      name: beneficiaryInput.name,
      relationship: beneficiaryInput.relationship,
      idNumber: beneficiaryInput.idNumber,
      share: beneficiaryInput.share,
      phone: '',
      address: '',
    };
    updateFormData({ beneficiaries: [...formData.beneficiaries, newBeneficiary] });
    setBeneficiaryInput({ name: '', relationship: '', idNumber: '', share: '' });
  };

  const removeBeneficiary = (index: number) => {
    updateFormData({ beneficiaries: formData.beneficiaries.filter((_, i) => i !== index) });
  };

  const addSpecialClause = () => {
    if (!clauseInput.trim()) {
      Alert.alert('提示', '请输入条款内容');
      return;
    }
    updateFormData({ specialClauses: [...formData.specialClauses, clauseInput.trim()] });
    setClauseInput('');
  };

  const removeClause = (index: number) => {
    updateFormData({ specialClauses: formData.specialClauses.filter((_, i) => i !== index) });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: if (!formData.willType) { Alert.alert('提示', '请选择遗嘱类型'); return false; } break;
      case 2: if (formData.estates.length === 0) { Alert.alert('提示', '请至少添加一项财产'); return false; } break;
      case 3: if (formData.beneficiaries.length === 0) { Alert.alert('提示', '请至少指定一位受益人'); return false; } break;
      case 5: if (!formData.executor) { Alert.alert('提示', '请指定遗嘱执行人'); return false; } break;
      case 6: if (!formData.testatorName || !formData.testatorIdNumber) { Alert.alert('提示', '请填写立遗嘱人信息'); return false; } break;
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
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      await createWill({
        userId: 'current_user_id',
        type: formData.willType!,
        status: WillStatus.DRAFT,
        title: formData.title || '我的遗嘱',
        testatorName: formData.testatorName,
        testatorIdNumber: formData.testatorIdNumber,
        testatorAge: formData.testatorAge,
        estates: formData.estates,
        beneficiaries: formData.beneficiaries,
        executor: formData.executor,
        specialClauses: formData.specialClauses.length > 0 ? formData.specialClauses : undefined,
        version: 1,
      });
      Alert.alert('创建成功', '遗嘱草稿已保存，建议您咨询律师进行审核。', [
        { text: '查看遗嘱', onPress: () => navigation.navigate('MyWills' as never) },
        { text: '返回首页', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('错误', '创建遗嘱失败，请重试');
    }
  };

  const willTypeOptions = [
    { type: WillType.SELF_WRITTEN, icon: FileText, title: '自书遗嘱', desc: '由立遗嘱人亲笔书写、签名并注明日期。成本低，但需注意书写规范。' },
    { type: WillType.WITNESSED, icon: Users, title: '代书遗嘱', desc: '由他人代写，需要两名以上见证人在场见证。适合不便书写的情况。' },
    { type: WillType.NOTARIZED, icon: Shield, title: '公证遗嘱', desc: '经公证机关公证的遗嘱，法律效力最高，但需支付公证费用。' },
    { type: WillType.AUDIO_VIDEO, icon: Video, title: '录音录像遗嘱', desc: '以录音或录像方式订立，需有两名以上见证人在场。' },
  ];

  const estateTypes = [
    { value: 'real_estate', label: '房产' },
    { value: 'bank_deposit', label: '存款' },
    { value: 'securities', label: '股票' },
    { value: 'vehicle', label: '车辆' },
    { value: 'other', label: '其他' },
  ];

  const getEstateTypeLabel = (type: string) => estateTypes.find(e => e.value === type)?.label || type;

  const inputStyle = {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
  };

  const renderStep1 = () => (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">请选择遗嘱类型</Text>
      <Text fontSize="$2" color="$color10" marginBottom="$2">不同类型的遗嘱有不同的法律要求和效力</Text>
      {willTypeOptions.map(opt => {
        const IconComp = opt.icon;
        const isSelected = formData.willType === opt.type;
        return (
          <Pressable key={opt.type} onPress={() => updateFormData({ willType: opt.type })}>
            <View
              padding="$2"
              borderRadius="$5"
              borderWidth={2}
              borderColor={isSelected ? '$primary' : '$color5'}
              backgroundColor={isSelected ? `${primaryColor}10` : '$color2'}
            >
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <IconComp size={20} color={isSelected ? primaryColor : color10} />
                <Text fontSize="$4" fontWeight="600" color="$color12" flex={1}>{opt.title}</Text>
                {isSelected && <View width={20} height={20} borderRadius={10} backgroundColor="$primary" />}
              </XStack>
              <Text fontSize="$2" color="$color10" marginLeft="$6">{opt.desc}</Text>
            </View>
          </Pressable>
        );
      })}
    </YStack>
  );

  const renderStep2 = () => (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">财产清单</Text>
      <Text fontSize="$2" color="$color10" marginBottom="$2">请详细列出您的财产</Text>
      {formData.estates.map((estate, i) => (
        <View key={i} padding="$2" borderRadius="$4" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1}>
              <Text fontSize="$3" fontWeight="600" color="$color12">{getEstateTypeLabel(estate.type)}</Text>
              <Text fontSize="$2" color="$color10">{estate.description}</Text>
              {estate.location && <Text fontSize="$2" color="$color10">位置：{estate.location}</Text>}
              <Text fontSize="$2" color="$primary" fontWeight="500">¥{estate.estimatedValue.toLocaleString()}</Text>
            </YStack>
            <Pressable onPress={() => removeEstate(i)}><Trash2 size={18} color={errorColor} /></Pressable>
          </XStack>
        </View>
      ))}
      <View padding="$2" borderRadius="$5" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1.5">添加财产</Text>
        <XStack flexWrap="wrap" gap="$1" marginBottom="$2">
          {estateTypes.map(et => (
            <Pressable key={et.value} onPress={() => setEstateInput({ ...estateInput, type: et.value as Estate['type'] })}>
              <View paddingHorizontal="$2" paddingVertical="$1" borderRadius="$10" backgroundColor={estateInput.type === et.value ? '$primary' : '$color4'}>
                <Text fontSize="$2" color={estateInput.type === et.value ? 'white' : '$color10'}>{et.label}</Text>
              </View>
            </Pressable>
          ))}
        </XStack>
        <RNTextInput style={inputStyle} placeholder="财产描述" value={estateInput.description} onChangeText={t => setEstateInput({ ...estateInput, description: t })} />
        <View height={8} />
        <RNTextInput style={inputStyle} placeholder="位置/账号" value={estateInput.location} onChangeText={t => setEstateInput({ ...estateInput, location: t })} />
        <View height={8} />
        <RNTextInput style={inputStyle} placeholder="估值（元）" value={estateInput.estimatedValue} onChangeText={t => setEstateInput({ ...estateInput, estimatedValue: t })} keyboardType="numeric" />
        <Pressable style={{ marginTop: 12 }} onPress={addEstate}>
          <View backgroundColor="$primary" paddingVertical="$2" borderRadius="$10" alignItems="center">
            <XStack alignItems="center" gap="$1"><PlusCircle size={16} color="white" /><Text color="white" fontWeight="500">添加财产</Text></XStack>
          </View>
        </Pressable>
      </View>
      {formData.estates.length > 0 && (
        <View padding="$2" borderRadius="$5" backgroundColor="$color2" alignItems="center">
          <Text fontSize="$2" color="$color10">财产总计</Text>
          <Text fontSize="$6" fontWeight="700" color="$primary">¥{formData.estates.reduce((s, e) => s + e.estimatedValue, 0).toLocaleString()}</Text>
        </View>
      )}
    </YStack>
  );

  const renderStep3 = () => (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">受益人指定</Text>
      <Text fontSize="$2" color="$color10" marginBottom="$2">请指定财产的受益人及其继承份额</Text>
      {formData.beneficiaries.map((b, i) => (
        <View key={i} padding="$2" borderRadius="$4" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1}>
              <Text fontSize="$3" fontWeight="600" color="$color12">{b.name}</Text>
              <Text fontSize="$2" color="$color10">关系：{b.relationship}</Text>
              <Text fontSize="$2" color="$primary">份额：{b.share}</Text>
            </YStack>
            <Pressable onPress={() => removeBeneficiary(i)}><Trash2 size={18} color={errorColor} /></Pressable>
          </XStack>
        </View>
      ))}
      <View padding="$2" borderRadius="$5" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1.5">添加受益人</Text>
        <RNTextInput style={inputStyle} placeholder="姓名 *" value={beneficiaryInput.name} onChangeText={t => setBeneficiaryInput({ ...beneficiaryInput, name: t })} />
        <View height={8} />
        <RNTextInput style={inputStyle} placeholder="与您的关系 *" value={beneficiaryInput.relationship} onChangeText={t => setBeneficiaryInput({ ...beneficiaryInput, relationship: t })} />
        <View height={8} />
        <RNTextInput style={inputStyle} placeholder="身份证号" value={beneficiaryInput.idNumber} onChangeText={t => setBeneficiaryInput({ ...beneficiaryInput, idNumber: t })} />
        <View height={8} />
        <RNTextInput style={inputStyle} placeholder="继承份额 * (如：1/2)" value={beneficiaryInput.share} onChangeText={t => setBeneficiaryInput({ ...beneficiaryInput, share: t })} />
        <Pressable style={{ marginTop: 12 }} onPress={addBeneficiary}>
          <View backgroundColor="$primary" paddingVertical="$2" borderRadius="$10" alignItems="center">
            <XStack alignItems="center" gap="$1"><PlusCircle size={16} color="white" /><Text color="white" fontWeight="500">添加受益人</Text></XStack>
          </View>
        </Pressable>
      </View>
    </YStack>
  );

  const renderStep4 = () => (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">特殊条款设置</Text>
      <Text fontSize="$2" color="$color10" marginBottom="$2">您可以设置附条件继承等特殊条款（可选）</Text>
      {formData.specialClauses.map((c, i) => (
        <View key={i} padding="$2" borderRadius="$4" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text flex={1} fontSize="$2" color="$color12">{c}</Text>
            <Pressable onPress={() => removeClause(i)}><Trash2 size={16} color={errorColor} /></Pressable>
          </XStack>
        </View>
      ))}
      <View padding="$2" borderRadius="$5" style={{ backgroundColor: `${warningColor}15` }} borderLeftWidth={3} borderLeftColor={warningColor}>
        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">常见条款示例：</Text>
        <Text fontSize="$2" color="$color10">• 房产由长子继承，但需照顾母亲至其百年归老</Text>
        <Text fontSize="$2" color="$color10">• 股票收益优先用于孙辈教育支出</Text>
        <Text fontSize="$2" color="$color10">• 若受益人先于我过世，其份额由其子女继承</Text>
      </View>
      <View padding="$2" borderRadius="$5" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
        <RNTextInput style={{ ...inputStyle, height: 80, textAlignVertical: 'top' }} placeholder="请输入特殊条款内容" value={clauseInput} onChangeText={setClauseInput} multiline />
        <Pressable style={{ marginTop: 12 }} onPress={addSpecialClause}>
          <View backgroundColor="$primary" paddingVertical="$2" borderRadius="$10" alignItems="center">
            <XStack alignItems="center" gap="$1"><PlusCircle size={16} color="white" /><Text color="white" fontWeight="500">添加条款</Text></XStack>
          </View>
        </Pressable>
      </View>
      <Pressable onPress={() => setCurrentStep(5)}>
        <Text fontSize="$3" color="$primary" textAlign="center" paddingVertical="$2">跳过此步骤</Text>
      </Pressable>
    </YStack>
  );

  const renderStep5 = () => (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="600" color="$color12">遗嘱执行人指定</Text>
      <Text fontSize="$2" color="$color10" marginBottom="$2">遗嘱执行人负责按照遗嘱内容分配财产</Text>
      <View padding="$2" borderRadius="$5" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
        <Text fontSize="$2" color="$color12" marginBottom="$1">执行人姓名 *</Text>
        <RNTextInput style={inputStyle} placeholder="请输入执行人姓名" value={formData.executor} onChangeText={t => updateFormData({ executor: t })} />
        <View height={12} />
        <Text fontSize="$2" color="$color12" marginBottom="$1">身份证号</Text>
        <RNTextInput style={inputStyle} placeholder="请输入身份证号" value={formData.executorIdNumber} onChangeText={t => updateFormData({ executorIdNumber: t })} />
        <View height={12} />
        <Text fontSize="$2" color="$color12" marginBottom="$1">联系电话</Text>
        <RNTextInput style={inputStyle} placeholder="请输入联系电话" value={formData.executorPhone} onChangeText={t => updateFormData({ executorPhone: t })} keyboardType="phone-pad" />
      </View>
      <View padding="$2" borderRadius="$5" style={{ backgroundColor: `${primaryColor}10` }}>
        <XStack gap="$2">
          <Info size={18} color={primaryColor} />
          <Text flex={1} fontSize="$2" color="$color10" lineHeight={16}>执行人的职责包括：办理继承手续、分配财产、处理债务等。请务必与执行人沟通，确保其知晓并同意担任此职。</Text>
        </XStack>
      </View>
    </YStack>
  );

  const renderStep6 = () => {
    const willTypeLabel = { [WillType.SELF_WRITTEN]: '自书遗嘱', [WillType.WITNESSED]: '代书遗嘱', [WillType.NOTARIZED]: '公证遗嘱', [WillType.AUDIO_VIDEO]: '录音录像遗嘱' };
    return (
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="600" color="$color12">确认信息</Text>
        <Text fontSize="$2" color="$color10" marginBottom="$2">请填写立遗嘱人信息并确认所有内容</Text>
        <View padding="$2" borderRadius="$5" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
          <Text fontSize="$2" color="$color12" marginBottom="$1">遗嘱标题</Text>
          <RNTextInput style={inputStyle} placeholder="例如：我的遗嘱" value={formData.title} onChangeText={t => updateFormData({ title: t })} />
          <View height={12} />
          <Text fontSize="$2" color="$color12" marginBottom="$1">立遗嘱人姓名 *</Text>
          <RNTextInput style={inputStyle} placeholder="请输入您的姓名" value={formData.testatorName} onChangeText={t => updateFormData({ testatorName: t })} />
          <View height={12} />
          <Text fontSize="$2" color="$color12" marginBottom="$1">身份证号 *</Text>
          <RNTextInput style={inputStyle} placeholder="请输入身份证号" value={formData.testatorIdNumber} onChangeText={t => updateFormData({ testatorIdNumber: t })} />
          <View height={12} />
          <Text fontSize="$2" color="$color12" marginBottom="$1">年龄 *</Text>
          <RNTextInput style={inputStyle} placeholder="请输入年龄" value={formData.testatorAge > 0 ? formData.testatorAge.toString() : ''} onChangeText={t => updateFormData({ testatorAge: parseInt(t) || 0 })} keyboardType="numeric" />
        </View>
        <View padding="$2" borderRadius="$5" backgroundColor="$color2" borderWidth={1} borderColor="$color5">
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">遗嘱摘要</Text>
          <YStack gap="$1">
            <XStack><Text fontSize="$2" color="$color10" width={80}>遗嘱类型：</Text><Text fontSize="$2" color="$color12">{formData.willType ? willTypeLabel[formData.willType] : '-'}</Text></XStack>
            <XStack><Text fontSize="$2" color="$color10" width={80}>财产项目：</Text><Text fontSize="$2" color="$color12">{formData.estates.length} 项</Text></XStack>
            <XStack><Text fontSize="$2" color="$color10" width={80}>受益人：</Text><Text fontSize="$2" color="$color12">{formData.beneficiaries.length} 位</Text></XStack>
            <XStack><Text fontSize="$2" color="$color10" width={80}>特殊条款：</Text><Text fontSize="$2" color="$color12">{formData.specialClauses.length} 条</Text></XStack>
            <XStack><Text fontSize="$2" color="$color10" width={80}>执行人：</Text><Text fontSize="$2" color="$color12">{formData.executor || '-'}</Text></XStack>
          </YStack>
        </View>
        <View padding="$2" borderRadius="$5" style={{ backgroundColor: `${warningColor}15` }} borderLeftWidth={3} borderLeftColor={warningColor}>
          <XStack gap="$2">
            <AlertTriangle size={18} color={warningColor} />
            <Text flex={1} fontSize="$2" color="$color10" lineHeight={16}>遗嘱草稿保存后，强烈建议您咨询专业律师进行审核，以确保遗嘱的法律效力。</Text>
          </XStack>
        </View>
      </YStack>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View flex={1} backgroundColor="$background">
        {/* Header */}
        <View paddingTop={insets.top}>
          <TitleBar
            title={stepTitles[currentStep - 1]}
            subtitle={`${currentStep} / ${totalSteps}`}
            showBack={true}
            onBack={() => navigation.goBack()}
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

        {/* Content */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5">
            {renderCurrentStep()}
          </YStack>
        </ScrollView>

        {/* Footer */}
        <View padding="$2.5" backgroundColor="$color2" borderTopWidth={1} borderTopColor="$color5" paddingBottom={insets.bottom + 14}>
          <XStack gap="$2">
            {currentStep > 1 && (
              <Pressable style={{ flex: 1 }} onPress={handlePrevious}>
                <View borderWidth={1} borderColor="$color5" paddingVertical="$2.5" borderRadius="$10" alignItems="center">
                  <XStack alignItems="center" gap="$1">
                    <ChevronLeft size={18} color={color10} />
                    <Text fontSize="$3" color="$color10">上一步</Text>
                  </XStack>
                </View>
              </Pressable>
            )}
            <Pressable style={{ flex: currentStep === 1 ? 1 : 2 }} onPress={handleNext}>
              <View backgroundColor="$primary" paddingVertical="$2.5" borderRadius="$10" alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Text fontSize="$3" fontWeight="600" color="white">{currentStep === totalSteps ? '生成遗嘱' : '下一步'}</Text>
                  {currentStep < totalSteps && <ChevronRight size={18} color="white" />}
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WillCreatorScreen;
