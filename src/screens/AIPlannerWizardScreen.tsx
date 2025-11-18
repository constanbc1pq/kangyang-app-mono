import React, { useState } from 'react';
import { ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Heart,
  Target,
  DollarSign,
  FileText,
  TrendingUp,
  Cpu,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface PlannerData {
  // Step 1: 基本信息
  age: string;
  gender: 'male' | 'female' | '';
  occupation: string;
  annualIncome: string;
  familyMembers: number;
  // Step 2: 健康状况
  healthStatus: 'good' | 'subhealth' | 'chronic' | '';
  existingConditions: string[];
  medications: string;
  // Step 3: 保障需求
  coverageNeeds: string[];
  // Step 4: 预算设定
  annualBudget: string;
  // Step 5: 已有保单
  existingPolicies: string;
  // Step 6: 风险偏好
  riskPreference: 'conservative' | 'balanced' | 'aggressive' | '';
}

const AIPlannerWizardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PlannerData>({
    age: '',
    gender: '',
    occupation: '',
    annualIncome: '',
    familyMembers: 3,
    healthStatus: '',
    existingConditions: [],
    medications: '',
    coverageNeeds: [],
    annualBudget: '',
    existingPolicies: '',
    riskPreference: '',
  });

  const totalSteps = 6;

  const handleNext = () => {
    // 验证当前步骤
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!data.age || !data.gender || !data.occupation) {
          Alert.alert('提示', '请完整填写基本信息');
          return false;
        }
        if (parseInt(data.age) < 18 || parseInt(data.age) > 100) {
          Alert.alert('提示', '请输入有效的年龄（18-100岁）');
          return false;
        }
        return true;
      case 2:
        if (!data.healthStatus) {
          Alert.alert('提示', '请选择健康状况');
          return false;
        }
        return true;
      case 3:
        if (data.coverageNeeds.length === 0) {
          Alert.alert('提示', '请至少选择一项保障需求');
          return false;
        }
        return true;
      case 4:
        if (!data.annualBudget) {
          Alert.alert('提示', '请输入年保费预算');
          return false;
        }
        return true;
      case 5:
        // 已有保单可以为空
        return true;
      case 6:
        if (!data.riskPreference) {
          Alert.alert('提示', '请选择风险偏好');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    // 跳转到AI方案结果页
    navigation.navigate('InsurancePlanResult' as never, {
      plannerData: data,
    } as never);
  };

  const renderProgressBar = () => (
    <XStack padding="$4" gap="$2" alignItems="center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          flex={1}
          height={4}
          borderRadius={2}
          backgroundColor={index < currentStep ? COLORS.primary : '$borderColor'}
        />
      ))}
    </XStack>
  );

  const renderStep1 = () => (
    <YStack gap="$4">
      <XStack alignItems="center" gap="$2" marginBottom="$2">
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
          <Text fontSize="$5" fontWeight="700" color="$text">
            基本信息
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            了解您的基本情况
          </Text>
        </YStack>
      </XStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          年龄 *
        </Text>
        <View
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          paddingHorizontal="$3"
        >
          <TextInput
            placeholder="请输入您的年龄"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="number-pad"
            style={{ fontSize: 14, color: COLORS.text, height: 48 }}
            value={data.age}
            onChangeText={text => setData({ ...data, age: text })}
            maxLength={3}
          />
        </View>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          性别 *
        </Text>
        <XStack gap="$3">
          <Pressable
            onPress={() => setData({ ...data, gender: 'male' })}
            style={{ flex: 1 }}
          >
            <View
              height={48}
              borderRadius="$3"
              borderWidth={1}
              borderColor={data.gender === 'male' ? COLORS.primary : '$borderColor'}
              backgroundColor={data.gender === 'male' ? `${COLORS.primary}20` : '$surface'}
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="$4"
                color={data.gender === 'male' ? COLORS.primary : '$text'}
                fontWeight={data.gender === 'male' ? '600' : '400'}
              >
                男
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setData({ ...data, gender: 'female' })}
            style={{ flex: 1 }}
          >
            <View
              height={48}
              borderRadius="$3"
              borderWidth={1}
              borderColor={data.gender === 'female' ? COLORS.primary : '$borderColor'}
              backgroundColor={data.gender === 'female' ? `${COLORS.primary}20` : '$surface'}
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="$4"
                color={data.gender === 'female' ? COLORS.primary : '$text'}
                fontWeight={data.gender === 'female' ? '600' : '400'}
              >
                女
              </Text>
            </View>
          </Pressable>
        </XStack>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          职业 *
        </Text>
        <View
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          paddingHorizontal="$3"
        >
          <TextInput
            placeholder="请输入您的职业"
            placeholderTextColor={COLORS.textSecondary}
            style={{ fontSize: 14, color: COLORS.text, height: 48 }}
            value={data.occupation}
            onChangeText={text => setData({ ...data, occupation: text })}
          />
        </View>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          年收入（选填）
        </Text>
        <View
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          paddingHorizontal="$3"
        >
          <TextInput
            placeholder="请输入年收入（万元）"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="number-pad"
            style={{ fontSize: 14, color: COLORS.text, height: 48 }}
            value={data.annualIncome}
            onChangeText={text => setData({ ...data, annualIncome: text })}
          />
        </View>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          家庭成员数量
        </Text>
        <XStack gap="$2">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <Pressable
              key={num}
              onPress={() => setData({ ...data, familyMembers: num })}
            >
              <View
                width={48}
                height={48}
                borderRadius="$3"
                borderWidth={1}
                borderColor={data.familyMembers === num ? COLORS.primary : '$borderColor'}
                backgroundColor={
                  data.familyMembers === num ? `${COLORS.primary}20` : '$surface'
                }
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize="$4"
                  color={data.familyMembers === num ? COLORS.primary : '$text'}
                  fontWeight={data.familyMembers === num ? '600' : '400'}
                >
                  {num}
                </Text>
              </View>
            </Pressable>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );

  const renderStep2 = () => {
    const conditions = [
      '高血压',
      '糖尿病',
      '心脏病',
      '甲状腺疾病',
      '肝炎',
      '肾病',
      '肺病',
      '肿瘤',
    ];

    return (
      <YStack gap="$4">
        <XStack alignItems="center" gap="$2" marginBottom="$2">
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={`${COLORS.error}20`}
            justifyContent="center"
            alignItems="center"
          >
            <Heart size={24} color={COLORS.error} />
          </View>
          <YStack flex={1}>
            <Text fontSize="$5" fontWeight="700" color="$text">
              健康状况
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              如实告知很重要
            </Text>
          </YStack>
        </XStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$text">
            整体健康状况 *
          </Text>
          <YStack gap="$2">
            {[
              { value: 'good', label: '健康良好', desc: '无既往病史，体检正常' },
              { value: 'subhealth', label: '亚健康', desc: '体检有异常指标，但未确诊' },
              { value: 'chronic', label: '慢性病', desc: '已确诊慢性疾病' },
            ].map(option => (
              <Pressable
                key={option.value}
                onPress={() => setData({ ...data, healthStatus: option.value as any })}
              >
                <View
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={
                    data.healthStatus === option.value ? COLORS.primary : '$borderColor'
                  }
                  backgroundColor={
                    data.healthStatus === option.value ? `${COLORS.primary}15` : '$surface'
                  }
                >
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color={data.healthStatus === option.value ? COLORS.primary : '$text'}
                  >
                    {option.label}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    {option.desc}
                  </Text>
                </View>
              </Pressable>
            ))}
          </YStack>
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$text">
            是否有以下疾病？（多选）
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {conditions.map(condition => (
              <Pressable
                key={condition}
                onPress={() => {
                  if (data.existingConditions.includes(condition)) {
                    setData({
                      ...data,
                      existingConditions: data.existingConditions.filter(c => c !== condition),
                    });
                  } else {
                    setData({
                      ...data,
                      existingConditions: [...data.existingConditions, condition],
                    });
                  }
                }}
              >
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$2"
                  backgroundColor={
                    data.existingConditions.includes(condition)
                      ? COLORS.error
                      : '$borderColor'
                  }
                >
                  <Text
                    fontSize="$3"
                    color={
                      data.existingConditions.includes(condition) ? 'white' : '$text'
                    }
                  >
                    {condition}
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$text">
            是否长期用药？（选填）
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$3"
          >
            <TextInput
              placeholder="请填写用药情况，如：降压药、降糖药等"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              style={{
                fontSize: 14,
                color: COLORS.text,
                textAlignVertical: 'top',
                minHeight: 60,
              }}
              value={data.medications}
              onChangeText={text => setData({ ...data, medications: text })}
            />
          </View>
        </YStack>
      </YStack>
    );
  };

  const renderStep3 = () => {
    const needs = [
      { id: 'medical', label: '医疗保障', desc: '报销医疗费用' },
      { id: 'critical_illness', label: '重疾保障', desc: '重大疾病赔付' },
      { id: 'pension', label: '养老规划', desc: '退休后的生活保障' },
      { id: 'inheritance', label: '财富传承', desc: '资产传承规划' },
      { id: 'accident', label: '意外防护', desc: '意外伤害保障' },
    ];

    return (
      <YStack gap="$4">
        <XStack alignItems="center" gap="$2" marginBottom="$2">
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={`${COLORS.success}20`}
            justifyContent="center"
            alignItems="center"
          >
            <Target size={24} color={COLORS.success} />
          </View>
          <YStack flex={1}>
            <Text fontSize="$5" fontWeight="700" color="$text">
              保障需求
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              选择您关注的保障方向
            </Text>
          </YStack>
        </XStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$text">
            您需要哪些保障？* （多选）
          </Text>
          <YStack gap="$2">
            {needs.map(need => (
              <Pressable
                key={need.id}
                onPress={() => {
                  if (data.coverageNeeds.includes(need.id)) {
                    setData({
                      ...data,
                      coverageNeeds: data.coverageNeeds.filter(n => n !== need.id),
                    });
                  } else {
                    setData({
                      ...data,
                      coverageNeeds: [...data.coverageNeeds, need.id],
                    });
                  }
                }}
              >
                <View
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={
                    data.coverageNeeds.includes(need.id) ? COLORS.success : '$borderColor'
                  }
                  backgroundColor={
                    data.coverageNeeds.includes(need.id)
                      ? `${COLORS.success}15`
                      : '$surface'
                  }
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack flex={1}>
                      <Text
                        fontSize="$4"
                        fontWeight="600"
                        color={
                          data.coverageNeeds.includes(need.id) ? COLORS.success : '$text'
                        }
                      >
                        {need.label}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                        {need.desc}
                      </Text>
                    </YStack>
                    {data.coverageNeeds.includes(need.id) && (
                      <View
                        width={24}
                        height={24}
                        borderRadius={12}
                        backgroundColor={COLORS.success}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color="white">
                          ✓
                        </Text>
                      </View>
                    )}
                  </XStack>
                </View>
              </Pressable>
            ))}
          </YStack>
        </YStack>
      </YStack>
    );
  };

  const renderStep4 = () => (
    <YStack gap="$4">
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={`${COLORS.warning}20`}
          justifyContent="center"
          alignItems="center"
        >
          <DollarSign size={24} color={COLORS.warning} />
        </View>
        <YStack flex={1}>
          <Text fontSize="$5" fontWeight="700" color="$text">
            预算设定
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            您的年保费预算范围
          </Text>
        </YStack>
      </XStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          年保费预算 * （万元）
        </Text>
        <View
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          paddingHorizontal="$3"
        >
          <TextInput
            placeholder="请输入年保费预算"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="decimal-pad"
            style={{ fontSize: 14, color: COLORS.text, height: 48 }}
            value={data.annualBudget}
            onChangeText={text => setData({ ...data, annualBudget: text })}
          />
        </View>
        <Text fontSize="$2" color="$textSecondary">
          建议年保费为家庭年收入的10%-15%
        </Text>
      </YStack>

      <View
        padding="$3"
        backgroundColor="#E0F2FE"
        borderRadius="$3"
        borderLeftWidth={3}
        borderLeftColor={COLORS.primary}
      >
        <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
          预算参考
        </Text>
        <Text fontSize="$2" color="$text" lineHeight={20}>
          • 1-3万：基础保障方案{'\n'}
          • 3-5万：全面保障方案{'\n'}
          • 5-10万：尊享保障方案{'\n'}
          • 10万以上：高端定制方案
        </Text>
      </View>
    </YStack>
  );

  const renderStep5 = () => (
    <YStack gap="$4">
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={`${COLORS.primary}20`}
          justifyContent="center"
          alignItems="center"
        >
          <FileText size={24} color={COLORS.primary} />
        </View>
        <YStack flex={1}>
          <Text fontSize="$5" fontWeight="700" color="$text">
            已有保单
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            避免重复配置
          </Text>
        </YStack>
      </XStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          现有保险情况（选填）
        </Text>
        <View
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          padding="$3"
        >
          <TextInput
            placeholder="请简要列出您已有的保险，如：&#10;• 百万医疗险&#10;• 重疾险50万&#10;• 意外险100万"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={5}
            style={{
              fontSize: 14,
              color: COLORS.text,
              textAlignVertical: 'top',
              minHeight: 100,
            }}
            value={data.existingPolicies}
            onChangeText={text => setData({ ...data, existingPolicies: text })}
          />
        </View>
        <Text fontSize="$2" color="$textSecondary">
          如果没有保险，可以跳过此步骤
        </Text>
      </YStack>
    </YStack>
  );

  const renderStep6 = () => (
    <YStack gap="$4">
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={`#8B5CF615`}
          justifyContent="center"
          alignItems="center"
        >
          <TrendingUp size={24} color="#8B5CF6" />
        </View>
        <YStack flex={1}>
          <Text fontSize="$5" fontWeight="700" color="$text">
            风险偏好
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            最后一步了
          </Text>
        </YStack>
      </XStack>

      <YStack gap="$2">
        <Text fontSize="$3" fontWeight="600" color="$text">
          投资风险偏好 *
        </Text>
        <YStack gap="$2">
          {[
            {
              value: 'conservative',
              label: '保守型',
              desc: '注重本金安全，可接受较低收益',
            },
            {
              value: 'balanced',
              label: '稳健型',
              desc: '平衡收益与风险，追求稳定增值',
            },
            {
              value: 'aggressive',
              label: '激进型',
              desc: '追求高收益，可承受较高风险',
            },
          ].map(option => (
            <Pressable
              key={option.value}
              onPress={() => setData({ ...data, riskPreference: option.value as any })}
            >
              <View
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor={
                  data.riskPreference === option.value ? '#8B5CF6' : '$borderColor'
                }
                backgroundColor={
                  data.riskPreference === option.value ? '#8B5CF615' : '$surface'
                }
              >
                <Text
                  fontSize="$4"
                  fontWeight="600"
                  color={data.riskPreference === option.value ? '#8B5CF6' : '$text'}
                >
                  {option.label}
                </Text>
                <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                  {option.desc}
                </Text>
              </View>
            </Pressable>
          ))}
        </YStack>
      </YStack>

      <View
        padding="$3"
        backgroundColor="#FFF7ED"
        borderRadius="$3"
        borderLeftWidth={3}
        borderLeftColor={COLORS.warning}
      >
        <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
          温馨提示
        </Text>
        <Text fontSize="$2" color="$text" lineHeight={20}>
          AI将根据您的情况生成个性化保险规划方案，包括产品推荐和保额建议。方案仅供参考，建议咨询专业顾问进行调整。
        </Text>
      </View>
    </YStack>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
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
        <Pressable onPress={handlePrevious}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <YStack flex={1} alignItems="center">
          <Text fontSize="$5" fontWeight="600" color="$text">
            AI保险规划
          </Text>
          <Text fontSize="$2" color="$textSecondary">
            第{currentStep}/{totalSteps}步
          </Text>
        </YStack>
        <View width={24} />
      </XStack>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View padding="$4">{renderCurrentStep()}</View>
        <View height={100} />
      </ScrollView>

      {/* Bottom Navigation */}
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$4"
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        gap="$3"
      >
        {currentStep > 1 && (
          <Pressable onPress={handlePrevious} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              borderWidth={1}
              borderColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text color={COLORS.primary} fontWeight="600">
                上一步
              </Text>
            </View>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          style={{ flex: currentStep > 1 ? 1 : undefined, flexGrow: 1 }}
        >
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
          >
            <XStack alignItems="center" gap="$2">
              {currentStep === totalSteps ? (
                <>
                  <Cpu size={20} color="white" />
                  <Text color="white" fontWeight="600">
                    生成AI方案
                  </Text>
                </>
              ) : (
                <>
                  <Text color="white" fontWeight="600">
                    下一步
                  </Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </XStack>
          </View>
        </Pressable>
      </XStack>
    </View>
  );
};

export default AIPlannerWizardScreen;
