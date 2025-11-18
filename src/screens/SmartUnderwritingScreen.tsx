import React, { useState } from 'react';
import { ScrollView, Pressable, Alert } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  FileCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface HealthQuestion {
  id: string;
  category: string;
  question: string;
  type: 'boolean' | 'multiselect' | 'text';
  options?: string[];
  answer: any;
  followUp?: HealthQuestion[];
}

interface UnderwritingResult {
  conclusion: 'standard' | 'extra_premium' | 'exclusion' | 'declined';
  confidenceScore: number;
  reasons: string[];
  recommendations: string[];
  alternativeProducts?: {
    name: string;
    company: string;
    note: string;
  }[];
  needsManualReview: boolean;
}

const SmartUnderwritingScreen: React.FC = () => {
  const navigation = useNavigation();

  const [currentStep, setCurrentStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<UnderwritingResult | null>(null);

  const [questions, setQuestions] = useState<HealthQuestion[]>([
    {
      id: 'q1',
      category: '基本健康状况',
      question: '过去2年内，您是否曾因疾病住院治疗？',
      type: 'boolean',
      answer: null,
    },
    {
      id: 'q2',
      category: '基本健康状况',
      question: '您目前是否正在服用任何处方药物？',
      type: 'boolean',
      answer: null,
    },
    {
      id: 'q3',
      category: '慢性疾病史',
      question: '您是否曾被诊断患有以下疾病？（可多选）',
      type: 'multiselect',
      options: [
        '高血压',
        '糖尿病',
        '心脏病',
        '脑血管疾病',
        '肝炎/肝硬化',
        '肾脏疾病',
        '甲状腺疾病',
        '肿瘤/癌症',
        '无以上疾病',
      ],
      answer: [],
    },
    {
      id: 'q4',
      category: '近期健康检查',
      question: '最近一次体检中，是否有以下异常指标？（可多选）',
      type: 'multiselect',
      options: [
        '血压异常',
        '血糖异常',
        '血脂异常',
        '肝功能异常',
        '肾功能异常',
        '肿瘤标志物异常',
        '心电图异常',
        'B超/CT发现结节/肿块',
        '无异常',
      ],
      answer: [],
    },
    {
      id: 'q5',
      category: '生活习惯',
      question: '您是否有以下生活习惯？（可多选）',
      type: 'multiselect',
      options: ['吸烟（每天10支以上）', '饮酒（每周超过3次）', '规律运动', '熬夜（经常晚于23点睡觉）', '无特殊习惯'],
      answer: [],
    },
    {
      id: 'q6',
      category: '家族病史',
      question: '您的直系亲属（父母、兄弟姐妹）中是否有人在60岁前患有以下疾病？（可多选）',
      type: 'multiselect',
      options: ['心脏病', '脑血管疾病', '糖尿病', '高血压', '恶性肿瘤', '精神疾病', '遗传性疾病', '无'],
      answer: [],
    },
    {
      id: 'q7',
      category: '女性健康（如适用）',
      question: '如果您是女性，是否有以下情况？（可多选）',
      type: 'multiselect',
      options: ['乳腺结节/增生', '子宫肌瘤', '卵巢囊肿', '甲状腺结节', '目前怀孕', '无以上情况', '不适用（男性）'],
      answer: [],
    },
    {
      id: 'q8',
      category: '其他重要信息',
      question: '您是否从事以下高风险职业或活动？（可多选）',
      type: 'multiselect',
      options: [
        '高空作业',
        '矿业/采石',
        '化工/爆破',
        '航空/航海',
        '极限运动',
        '交通运输（长途司机）',
        '无高风险职业',
      ],
      answer: [],
    },
  ]);

  const handleBooleanAnswer = (value: boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentStep].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleMultiSelectToggle = (option: string) => {
    const updatedQuestions = [...questions];
    const currentAnswer = updatedQuestions[currentStep].answer || [];

    // Handle exclusive options
    if (
      option === '无以上疾病' ||
      option === '无异常' ||
      option === '无特殊习惯' ||
      option === '无' ||
      option === '无以上情况' ||
      option === '不适用（男性）' ||
      option === '无高风险职业'
    ) {
      updatedQuestions[currentStep].answer = currentAnswer.includes(option) ? [] : [option];
    } else {
      // Remove exclusive options if selecting specific items
      const filteredAnswer = currentAnswer.filter(
        (item: string) =>
          item !== '无以上疾病' &&
          item !== '无异常' &&
          item !== '无特殊习惯' &&
          item !== '无' &&
          item !== '无以上情况' &&
          item !== '不适用（男性）' &&
          item !== '无高风险职业'
      );

      if (filteredAnswer.includes(option)) {
        updatedQuestions[currentStep].answer = filteredAnswer.filter((item: string) => item !== option);
      } else {
        updatedQuestions[currentStep].answer = [...filteredAnswer, option];
      }
    }

    setQuestions(updatedQuestions);
  };

  const validateCurrentQuestion = (): boolean => {
    const current = questions[currentStep];
    if (current.type === 'boolean' && current.answer === null) {
      Alert.alert('提示', '请选择是或否');
      return false;
    }
    if (current.type === 'multiselect' && current.answer.length === 0) {
      Alert.alert('提示', '请至少选择一项');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      performUnderwriting();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const performUnderwriting = async () => {
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    // AI underwriting logic
    let riskScore = 0;
    const riskFactors: string[] = [];

    // Analyze answers
    questions.forEach(q => {
      if (q.id === 'q1' && q.answer === true) {
        riskScore += 15;
        riskFactors.push('近期有住院史');
      }
      if (q.id === 'q2' && q.answer === true) {
        riskScore += 10;
        riskFactors.push('正在服用处方药');
      }
      if (q.id === 'q3' && q.answer.length > 0 && !q.answer.includes('无以上疾病')) {
        riskScore += q.answer.length * 15;
        riskFactors.push(`存在${q.answer.length}种慢性疾病`);
      }
      if (q.id === 'q4' && q.answer.length > 0 && !q.answer.includes('无异常')) {
        riskScore += q.answer.length * 10;
        riskFactors.push(`体检发现${q.answer.length}项异常指标`);
      }
      if (q.id === 'q5') {
        const badHabits = q.answer.filter(
          (h: string) => h !== '规律运动' && h !== '无特殊习惯'
        );
        riskScore += badHabits.length * 5;
        if (badHabits.length > 0) {
          riskFactors.push(`存在${badHabits.length}项不良生活习惯`);
        }
      }
      if (q.id === 'q6' && q.answer.length > 0 && !q.answer.includes('无')) {
        riskScore += q.answer.length * 8;
        riskFactors.push(`存在${q.answer.length}项家族病史`);
      }
      if (q.id === 'q7' && q.answer.length > 0 && !q.answer.includes('无以上情况') && !q.answer.includes('不适用（男性）')) {
        riskScore += q.answer.length * 5;
        riskFactors.push(`存在${q.answer.length}项女性健康问题`);
      }
      if (q.id === 'q8' && q.answer.length > 0 && !q.answer.includes('无高风险职业')) {
        riskScore += q.answer.length * 12;
        riskFactors.push(`从事${q.answer.length}项高风险职业/活动`);
      }
    });

    let underwritingResult: UnderwritingResult;

    if (riskScore === 0) {
      // Standard acceptance
      underwritingResult = {
        conclusion: 'standard',
        confidenceScore: 95,
        reasons: ['健康状况良好', '无既往疾病史', '无不良生活习惯', '家族史良好'],
        recommendations: [
          '可以按标准费率投保各类健康险和寿险',
          '建议优先配置重疾险和医疗险',
          '保额可根据收入情况灵活设定',
          '定期体检，保持健康生活方式',
        ],
        needsManualReview: false,
      };
    } else if (riskScore <= 30) {
      // Extra premium
      underwritingResult = {
        conclusion: 'extra_premium',
        confidenceScore: 85,
        reasons: riskFactors,
        recommendations: [
          '可以投保，但需要加费承保',
          '预计加费幅度：10%-30%',
          '建议如实告知所有健康情况',
          '可考虑选择健康告知较宽松的产品',
          '部分产品可能需要提供体检报告',
        ],
        alternativeProducts: [
          {
            name: '平安i康保医疗险',
            company: '中国平安',
            note: '健康告知宽松，三高人群可投保',
          },
          {
            name: '众安尊享e生医疗险',
            company: '众安保险',
            note: '智能核保，部分异常可除外承保',
          },
        ],
        needsManualReview: true,
      };
    } else if (riskScore <= 60) {
      // Exclusion
      underwritingResult = {
        conclusion: 'exclusion',
        confidenceScore: 80,
        reasons: riskFactors,
        recommendations: [
          '部分保险产品可以除外承保',
          '除外责任：与现有疾病相关的治疗费用不予赔付',
          '建议选择医疗险+意外险组合',
          '重疾险可能需要除外特定疾病',
          '强烈建议咨询专业顾问人工核保',
        ],
        alternativeProducts: [
          {
            name: '惠民保系列',
            company: '当地政府+保险公司',
            note: '无健康告知，既往症也可投保',
          },
          {
            name: '防癌险/防癌医疗险',
            company: '多家公司',
            note: '专注癌症保障，健康告知宽松',
          },
          {
            name: '税优健康险',
            company: '多家公司',
            note: '带病可投保，无等待期',
          },
        ],
        needsManualReview: true,
      };
    } else {
      // Declined
      underwritingResult = {
        conclusion: 'declined',
        confidenceScore: 75,
        reasons: riskFactors,
        recommendations: [
          '标准商业保险可能无法承保',
          '建议优先配置社保和补充医疗',
          '可关注惠民保、税优健康险等普惠产品',
          '积极治疗现有疾病，改善健康状况',
          '部分公司可能接受人工核保，建议多家尝试',
        ],
        alternativeProducts: [
          {
            name: '当地惠民保',
            company: '当地政府指定',
            note: '无健康告知，所有居民可参保',
          },
          {
            name: '税优健康险',
            company: '多家公司',
            note: '带病可投保，享受税收优惠',
          },
          {
            name: '意外险',
            company: '多家公司',
            note: '无健康告知要求，可正常投保',
          },
        ],
        needsManualReview: true,
      };
    }

    setResult(underwritingResult);
    setAnalyzing(false);
  };

  const renderQuestion = () => {
    const current = questions[currentStep];

    if (current.type === 'boolean') {
      return (
        <YStack gap="$3">
          <Pressable onPress={() => handleBooleanAnswer(false)}>
            <View
              padding="$4"
              backgroundColor={current.answer === false ? COLORS.success : '$surface'}
              borderRadius="$3"
              borderWidth={2}
              borderColor={current.answer === false ? COLORS.success : '$borderColor'}
            >
              <XStack alignItems="center" gap="$3">
                <CheckCircle size={24} color={current.answer === false ? 'white' : COLORS.textSecondary} />
                <Text fontSize="$4" fontWeight="600" color={current.answer === false ? 'white' : '$text'}>
                  否
                </Text>
              </XStack>
            </View>
          </Pressable>

          <Pressable onPress={() => handleBooleanAnswer(true)}>
            <View
              padding="$4"
              backgroundColor={current.answer === true ? COLORS.warning : '$surface'}
              borderRadius="$3"
              borderWidth={2}
              borderColor={current.answer === true ? COLORS.warning : '$borderColor'}
            >
              <XStack alignItems="center" gap="$3">
                <AlertTriangle size={24} color={current.answer === true ? 'white' : COLORS.textSecondary} />
                <Text fontSize="$4" fontWeight="600" color={current.answer === true ? 'white' : '$text'}>
                  是
                </Text>
              </XStack>
            </View>
          </Pressable>
        </YStack>
      );
    }

    if (current.type === 'multiselect') {
      return (
        <YStack gap="$2">
          {current.options?.map(option => {
            const isSelected = current.answer.includes(option);
            return (
              <Pressable key={option} onPress={() => handleMultiSelectToggle(option)}>
                <View
                  padding="$3"
                  backgroundColor={isSelected ? `${COLORS.primary}15` : '$surface'}
                  borderRadius="$3"
                  borderWidth={1.5}
                  borderColor={isSelected ? COLORS.primary : '$borderColor'}
                >
                  <XStack alignItems="center" gap="$2">
                    <View
                      width={20}
                      height={20}
                      borderRadius={4}
                      borderWidth={2}
                      borderColor={isSelected ? COLORS.primary : '$borderColor'}
                      backgroundColor={isSelected ? COLORS.primary : 'transparent'}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {isSelected && <CheckCircle size={14} color="white" />}
                    </View>
                    <Text fontSize="$3" color="$text" flex={1}>
                      {option}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            );
          })}
        </YStack>
      );
    }

    return null;
  };

  const renderResult = () => {
    if (!result) return null;

    const conclusionConfig = {
      standard: {
        icon: CheckCircle,
        color: COLORS.success,
        bgColor: '#F0FDF4',
        title: '标准承保',
        subtitle: '恭喜！您的健康状况良好，可以按标准费率投保',
      },
      extra_premium: {
        icon: TrendingUp,
        color: COLORS.primary,
        bgColor: '#EEF2FF',
        title: '加费承保',
        subtitle: '您可以投保，但可能需要额外支付一定保费',
      },
      exclusion: {
        icon: AlertTriangle,
        color: COLORS.warning,
        bgColor: '#FFF7ED',
        title: '除外承保',
        subtitle: '部分产品可以承保，但会除外特定疾病',
      },
      declined: {
        icon: XCircle,
        color: COLORS.error,
        bgColor: '#FEF2F2',
        title: '延期/拒保',
        subtitle: '标准商业保险可能无法承保，建议考虑其他方案',
      },
    };

    const config = conclusionConfig[result.conclusion];
    const Icon = config.icon;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Conclusion */}
        <View margin="$4" padding="$4" backgroundColor={config.bgColor} borderRadius="$4">
          <XStack alignItems="center" gap="$3" marginBottom="$3">
            <View
              width={56}
              height={56}
              borderRadius={28}
              backgroundColor="white"
              justifyContent="center"
              alignItems="center"
            >
              <Icon size={32} color={config.color} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$6" fontWeight="700" color={config.color}>
                {config.title}
              </Text>
              <Text fontSize="$3" color="$text" marginTop="$1">
                {config.subtitle}
              </Text>
            </YStack>
          </XStack>

          <View
            padding="$2"
            backgroundColor="white"
            borderRadius="$2"
            borderLeftWidth={3}
            borderLeftColor={config.color}
          >
            <Text fontSize="$2" color="$textSecondary">
              AI分析置信度：{result.confidenceScore}%
            </Text>
          </View>
        </View>

        {/* Reasons */}
        {result.reasons.length > 0 && (
          <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              核保依据
            </Text>
            <YStack gap="$2">
              {result.reasons.map((reason, index) => (
                <XStack key={index} alignItems="flex-start" gap="$2">
                  <View
                    width={6}
                    height={6}
                    borderRadius={3}
                    backgroundColor={config.color}
                    marginTop={8}
                  />
                  <Text fontSize="$3" color="$text" flex={1}>
                    {reason}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </View>
        )}

        {/* Recommendations */}
        <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            投保建议
          </Text>
          <YStack gap="$2">
            {result.recommendations.map((rec, index) => (
              <XStack key={index} alignItems="flex-start" gap="$2">
                <Text fontSize="$3" fontWeight="600" color={config.color}>
                  {index + 1}.
                </Text>
                <Text fontSize="$3" color="$text" flex={1}>
                  {rec}
                </Text>
              </XStack>
            ))}
          </YStack>
        </View>

        {/* Alternative Products */}
        {result.alternativeProducts && result.alternativeProducts.length > 0 && (
          <View marginHorizontal="$4" marginBottom="$4" padding="$4" backgroundColor="$surface" borderRadius="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              适合您的产品推荐
            </Text>
            <YStack gap="$3">
              {result.alternativeProducts.map((product, index) => (
                <View
                  key={index}
                  padding="$3"
                  backgroundColor="$background"
                  borderRadius="$3"
                  borderLeftWidth={3}
                  borderLeftColor={COLORS.primary}
                >
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {product.name}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    {product.company}
                  </Text>
                  <Text fontSize="$3" color="$text" marginTop="$2">
                    {product.note}
                  </Text>
                </View>
              ))}
            </YStack>
          </View>
        )}

        {/* Manual Review Notice */}
        {result.needsManualReview && (
          <View
            marginHorizontal="$4"
            marginBottom="$4"
            padding="$4"
            backgroundColor="#FFF7ED"
            borderRadius="$4"
            borderLeftWidth={3}
            borderLeftColor={COLORS.warning}
          >
            <XStack alignItems="flex-start" gap="$2">
              <AlertCircle size={20} color={COLORS.warning} style={{ marginTop: 2 }} />
              <YStack flex={1}>
                <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
                  建议人工核保
                </Text>
                <Text fontSize="$2" color="$text" lineHeight={20}>
                  AI智能核保结果仅供参考，具体核保结论需由保险公司专业核保人员审核。
                  我们建议您咨询专业保险顾问，进行人工核保，以获得最准确的承保结论和最优的投保方案。
                </Text>
              </YStack>
            </XStack>
          </View>
        )}

        {/* CTA Buttons */}
        <View marginHorizontal="$4" marginBottom="$4" gap="$3">
          <Pressable
            onPress={() => {
              navigation.navigate('InsuranceAdvisorList' as never);
            }}
          >
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <XStack alignItems="center" gap="$2">
                <MessageCircle size={20} color="white" />
                <Text color="white" fontSize="$4" fontWeight="600">
                  咨询专业顾问（免费）
                </Text>
              </XStack>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.navigate('InsuranceProductList' as never);
            }}
          >
            <View
              height={48}
              borderRadius="$3"
              backgroundColor="$surface"
              borderWidth={1.5}
              borderColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text color={COLORS.primary} fontSize="$4" fontWeight="600">
                浏览推荐产品
              </Text>
            </View>
          </Pressable>
        </View>

        <View height={20} />
      </ScrollView>
    );
  };

  if (analyzing) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <FileCheck size={48} color={COLORS.primary} />
        <Text fontSize="$5" fontWeight="600" color="$text" marginTop="$4">
          AI正在分析您的健康告知...
        </Text>
        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
          基于您的回答生成核保结论
        </Text>
      </View>
    );
  }

  if (result) {
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
            智能核保结果
          </Text>
          <View width={24} />
        </XStack>

        {renderResult()}
      </View>
    );
  }

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
          智能核保
        </Text>
        <View width={24} />
      </XStack>

      {/* Progress Bar */}
      <View padding="$4" backgroundColor="$surface" borderBottomWidth={1} borderBottomColor="$borderColor">
        <XStack justifyContent="space-between" marginBottom="$2">
          <Text fontSize="$2" color="$textSecondary">
            问题 {currentStep + 1}/{questions.length}
          </Text>
          <Text fontSize="$2" color={COLORS.primary} fontWeight="600">
            {Math.round(((currentStep + 1) / questions.length) * 100)}%
          </Text>
        </XStack>
        <View height={6} backgroundColor="$borderColor" borderRadius="$2">
          <View
            width={`${((currentStep + 1) / questions.length) * 100}%`}
            height="100%"
            backgroundColor={COLORS.primary}
            borderRadius="$2"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View padding="$4">
          {/* Category Badge */}
          <View alignSelf="flex-start" marginBottom="$3">
            <View paddingHorizontal="$3" paddingVertical="$1.5" backgroundColor={`${COLORS.primary}20`} borderRadius="$2">
              <Text fontSize="$2" color={COLORS.primary} fontWeight="600">
                {questions[currentStep].category}
              </Text>
            </View>
          </View>

          {/* Question */}
          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$4" lineHeight={28}>
            {questions[currentStep].question}
          </Text>

          {/* Answer Options */}
          {renderQuestion()}
        </View>

        {/* Info Box */}
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
            <AlertCircle size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
            <Text fontSize="$2" color="$text" flex={1}>
              请如实回答所有问题，这将帮助AI生成准确的核保结论。所有信息严格保密，仅用于保险规划。
            </Text>
          </XStack>
        </View>

        <View height={120} />
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
        {currentStep > 0 && (
          <Pressable onPress={handlePrevious} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              backgroundColor="$borderColor"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="$text" fontSize="$4" fontWeight="600">
                上一题
              </Text>
            </View>
          </Pressable>
        )}

        <Pressable onPress={handleNext} style={{ flex: currentStep > 0 ? 2 : 1 }}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
          >
            <Text color="white" fontSize="$4" fontWeight="600">
              {currentStep < questions.length - 1 ? '下一题' : '生成核保结论'}
            </Text>
          </View>
        </Pressable>
      </XStack>
    </View>
  );
};

export default SmartUnderwritingScreen;
