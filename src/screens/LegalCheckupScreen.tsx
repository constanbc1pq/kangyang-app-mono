/**
 * 法律体检页面
 * 为老年人提供全面的法律风险评估服务
 */

import React, { useState } from 'react';
import { Alert, ActivityIndicator, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  HeartPulse,
  FileText,
  Wallet,
  Heart,
  Users,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Lightbulb,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TitleBar } from '@/components/TitleBar';

const GOLD_COLOR = '#D4AF37';

interface Props {
  navigation: any;
}

interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: string; label: string; score: number }[];
}

type Answers = Record<string, string>;

interface RiskArea {
  category: string;
  score: number;
  level: 'safe' | 'warning' | 'danger';
  issues: string[];
  suggestions: string[];
  action?: { label: string; screen: string };
}

type CheckupStep = 'intro' | 'questionnaire' | 'analyzing' | 'report';

const LegalCheckupScreen: React.FC<Props> = ({ navigation: navProp }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState<CheckupStep>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);

  const questions: Question[] = [
    {
      id: 'q1',
      category: '遗嘱规划',
      question: '您是否已经订立了遗嘱？',
      options: [
        { value: 'yes_notarized', label: '是，已公证', score: 0 },
        { value: 'yes_not_notarized', label: '是，未公证', score: 30 },
        { value: 'no', label: '否', score: 80 },
      ],
    },
    {
      id: 'q2',
      category: '遗嘱规划',
      question: '您的遗嘱内容是否涵盖了所有重要财产？',
      options: [
        { value: 'yes', label: '是', score: 0 },
        { value: 'partial', label: '部分涵盖', score: 40 },
        { value: 'no', label: '否/未订立遗嘱', score: 80 },
      ],
    },
    {
      id: 'q3',
      category: '财产管理',
      question: '您的主要财产（房产、存款等）是否有清晰的记录？',
      options: [
        { value: 'yes', label: '是，有详细记录', score: 0 },
        { value: 'partial', label: '有部分记录', score: 40 },
        { value: 'no', label: '否，没有记录', score: 70 },
      ],
    },
    {
      id: 'q4',
      category: '财产管理',
      question: '您是否有贵重物品（珠宝、收藏品等）未明确归属？',
      options: [
        { value: 'no', label: '否，都已明确', score: 0 },
        { value: 'few', label: '有少量', score: 30 },
        { value: 'many', label: '有较多', score: 60 },
      ],
    },
    {
      id: 'q5',
      category: '赡养安排',
      question: '您与子女之间是否有明确的赡养约定？',
      options: [
        { value: 'yes_written', label: '是，有书面协议', score: 0 },
        { value: 'yes_verbal', label: '是，有口头约定', score: 40 },
        { value: 'no', label: '否，没有约定', score: 70 },
      ],
    },
    {
      id: 'q6',
      category: '赡养安排',
      question: '目前您的赡养状况如何？',
      options: [
        { value: 'good', label: '很好，子女主动照顾', score: 0 },
        { value: 'normal', label: '一般，基本能照顾', score: 30 },
        { value: 'poor', label: '不好，很少照顾', score: 80 },
      ],
    },
    {
      id: 'q7',
      category: '监护安排',
      question: '您是否指定了意定监护人？',
      options: [
        { value: 'yes', label: '是，已指定并公证', score: 0 },
        { value: 'partial', label: '考虑中，未正式指定', score: 50 },
        { value: 'no', label: '否，不了解这项制度', score: 70 },
      ],
    },
    {
      id: 'q8',
      category: '合同风险',
      question: '最近一年，您签署合同前是否咨询过律师？',
      options: [
        { value: 'always', label: '总是咨询', score: 0 },
        { value: 'sometimes', label: '有时咨询', score: 40 },
        { value: 'never', label: '从不咨询', score: 80 },
      ],
    },
    {
      id: 'q9',
      category: '防骗意识',
      question: '您是否了解常见的养老诈骗手段？',
      options: [
        { value: 'very_well', label: '非常了解', score: 0 },
        { value: 'some', label: '了解一些', score: 30 },
        { value: 'not_much', label: '不太了解', score: 70 },
      ],
    },
    {
      id: 'q10',
      category: '法律储备',
      question: '遇到法律问题时，您是否知道如何寻求帮助？',
      options: [
        { value: 'yes', label: '是，知道途径', score: 0 },
        { value: 'partial', label: '部分知道', score: 40 },
        { value: 'no', label: '否，不太清楚', score: 70 },
      ],
    },
  ];

  const analyzeRisks = () => {
    setCurrentStep('analyzing');

    setTimeout(() => {
      const categoryScores: Record<string, number[]> = {};

      questions.forEach(q => {
        const answer = answers[q.id];
        if (answer) {
          const option = q.options.find(opt => opt.value === answer);
          if (option) {
            if (!categoryScores[q.category]) {
              categoryScores[q.category] = [];
            }
            categoryScores[q.category].push(option.score);
          }
        }
      });

      const risks: RiskArea[] = [];

      // 遗嘱规划
      const willScore =
        categoryScores['遗嘱规划']?.reduce((a, b) => a + b, 0) /
        (categoryScores['遗嘱规划']?.length || 1);
      risks.push({
        category: '遗嘱规划',
        score: willScore,
        level: willScore < 30 ? 'safe' : willScore < 60 ? 'warning' : 'danger',
        issues:
          willScore >= 60
            ? ['尚未订立遗嘱', '财产分配不明确', '可能引发继承纠纷']
            : willScore >= 30
            ? ['遗嘱未公证', '部分财产未纳入遗嘱']
            : ['遗嘱规划完善'],
        suggestions:
          willScore >= 60
            ? ['立即订立遗嘱', '明确财产分配方案', '考虑公证遗嘱']
            : willScore >= 30
            ? ['建议对遗嘱进行公证', '补充遗漏财产']
            : ['定期更新遗嘱内容'],
        action: willScore >= 30 ? { label: '立即订立遗嘱', screen: 'WillCreator' } : undefined,
      });

      // 财产管理
      const propertyScore =
        categoryScores['财产管理']?.reduce((a, b) => a + b, 0) /
        (categoryScores['财产管理']?.length || 1);
      risks.push({
        category: '财产管理',
        score: propertyScore,
        level: propertyScore < 30 ? 'safe' : propertyScore < 60 ? 'warning' : 'danger',
        issues:
          propertyScore >= 60
            ? ['财产登记不清晰', '贵重物品归属不明', '容易产生争议']
            : propertyScore >= 30
            ? ['部分财产未登记', '需要完善财产清单']
            : ['财产管理规范'],
        suggestions:
          propertyScore >= 60
            ? ['建立财产清单', '明确贵重物品归属', '定期更新记录']
            : propertyScore >= 30
            ? ['补充财产登记', '整理贵重物品清单']
            : ['保持良好的财产管理习惯'],
        action:
          propertyScore >= 30 ? { label: '建立财产清单', screen: 'PropertyInventory' } : undefined,
      });

      // 赡养安排
      const supportScore =
        categoryScores['赡养安排']?.reduce((a, b) => a + b, 0) /
        (categoryScores['赡养安排']?.length || 1);
      risks.push({
        category: '赡养安排',
        score: supportScore,
        level: supportScore < 30 ? 'safe' : supportScore < 60 ? 'warning' : 'danger',
        issues:
          supportScore >= 60
            ? ['缺乏赡养约定', '赡养状况不理想', '可能存在赡养纠纷']
            : supportScore >= 30
            ? ['仅有口头约定', '需要书面化']
            : ['赡养安排合理'],
        suggestions:
          supportScore >= 60
            ? ['与子女签订赡养协议', '必要时寻求法律帮助']
            : supportScore >= 30
            ? ['将口头约定书面化', '明确赡养责任']
            : ['保持良好的家庭关系'],
        action: supportScore >= 30 ? { label: '咨询律师', screen: 'LawyerList' } : undefined,
      });

      // 监护安排
      const guardianshipScore =
        categoryScores['监护安排']?.reduce((a, b) => a + b, 0) /
        (categoryScores['监护安排']?.length || 1);
      risks.push({
        category: '监护安排',
        score: guardianshipScore,
        level: guardianshipScore < 30 ? 'safe' : guardianshipScore < 60 ? 'warning' : 'danger',
        issues:
          guardianshipScore >= 60
            ? ['未指定意定监护人', '失能后缺乏保障']
            : guardianshipScore >= 30
            ? ['监护安排不完善']
            : ['监护安排完善'],
        suggestions:
          guardianshipScore >= 60
            ? ['了解意定监护制度', '指定可信赖的监护人', '签订监护协议']
            : guardianshipScore >= 30
            ? ['完善监护安排', '考虑公证']
            : ['定期确认监护人意愿'],
        action:
          guardianshipScore >= 30
            ? { label: '设立意定监护', screen: 'GuardianshipCreator' }
            : undefined,
      });

      // 其他风险
      const otherCategories = ['合同风险', '防骗意识', '法律储备'];
      otherCategories.forEach(category => {
        const score =
          categoryScores[category]?.reduce((a, b) => a + b, 0) /
          (categoryScores[category]?.length || 1);
        if (score !== undefined) {
          risks.push({
            category,
            score,
            level: score < 30 ? 'safe' : score < 60 ? 'warning' : 'danger',
            issues:
              score >= 60
                ? [`${category}需要加强`]
                : score >= 30
                ? [`${category}有待提升`]
                : [`${category}良好`],
            suggestions:
              score >= 60
                ? [`学习${category}相关知识`, '提高防范意识']
                : score >= 30
                ? [`继续提升${category}`]
                : ['保持良好习惯'],
          });
        }
      });

      setRiskAreas(risks);
      setCurrentStep('report');
    }, 2000);
  };

  const getLevelColor = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe': return successColor;
      case 'warning': return GOLD_COLOR;
      case 'danger': return errorColor;
    }
  };

  const getLevelBgColor = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe': return `${successColor}15`;
      case 'warning': return `${GOLD_COLOR}15`;
      case 'danger': return `${errorColor}15`;
    }
  };

  const renderIntro = () => {
    const checkItems = [
      { icon: FileText, label: '遗嘱规划', description: '遗嘱订立和更新情况' },
      { icon: Wallet, label: '财产管理', description: '财产登记和保护状况' },
      { icon: Heart, label: '赡养安排', description: '赡养协议和执行情况' },
      { icon: Users, label: '监护安排', description: '意定监护设立情况' },
      { icon: Shield, label: '法律意识', description: '防骗和维权能力' },
    ];

    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$3">
          {/* Header */}
          <YStack alignItems="center" padding="$3">
            <View
              width={120}
              height={120}
              borderRadius={60}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
              marginBottom="$3"
            >
              <HeartPulse size={60} color={primaryColor} />
            </View>
            <Text fontSize="$7" fontWeight="700" color="$color12" marginBottom="$1">
              法律体检
            </Text>
            <Text fontSize="$4" color="$color10">
              全面评估您的法律风险
            </Text>
          </YStack>

          {/* What is Legal Checkup */}
          <View backgroundColor="$color2" borderRadius="$5" padding="$2.5" borderWidth={1} borderColor="$color5">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              什么是法律体检？
            </Text>
            <Text fontSize="$3" color="$color10" lineHeight={22}>
              法律体检是对您在遗嘱、财产、赡养、监护等方面的法律保障状况进行全面评估，帮助您及时发现法律风险，提前做好预防和规划。
            </Text>
          </View>

          {/* Check Items */}
          <View backgroundColor="$color2" borderRadius="$5" padding="$2.5" borderWidth={1} borderColor="$color5">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              体检包含哪些内容？
            </Text>
            <YStack gap="$2">
              {checkItems.map((item, index) => (
                <XStack key={index} alignItems="center" gap="$2">
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor="$color4"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <item.icon size={24} color={primaryColor} />
                  </View>
                  <YStack flex={1}>
                    <Text fontSize="$3" fontWeight="600" color="$color12">{item.label}</Text>
                    <Text fontSize="$2" color="$color10">{item.description}</Text>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </View>

          {/* Duration */}
          <View backgroundColor="$color2" borderRadius="$5" padding="$2.5" borderWidth={1} borderColor="$color5">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              体检需要多长时间？
            </Text>
            <Text fontSize="$3" color="$color10" lineHeight={22}>
              本次体检共{questions.length}道题，大约需要5分钟完成。请根据实际情况如实作答，以便获得准确的评估结果。
            </Text>
          </View>

          {/* Start Button */}
          <Pressable
            onPress={() => {
              setCurrentStep('questionnaire');
              setCurrentQuestionIndex(0);
            }}
          >
            <XStack
              backgroundColor="$primary"
              borderRadius="$10"
              paddingVertical="$2.5"
              alignItems="center"
              justifyContent="center"
              gap="$1"
            >
              <Text fontSize="$4" fontWeight="600" color="white">开始体检</Text>
              <ArrowRight size={20} color="white" />
            </XStack>
          </Pressable>
        </YStack>
      </ScrollView>
    );
  };

  const renderQuestionnaire = () => {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <View flex={1}>
        {/* Progress */}
        <View backgroundColor="$color2" padding="$2.5" borderBottomWidth={1} borderBottomColor="$color5">
          <View height={6} backgroundColor="$color5" borderRadius={3} marginBottom="$1.5">
            <View
              height={6}
              backgroundColor="$primary"
              borderRadius={3}
              width={`${progress}%`}
            />
          </View>
          <Text fontSize="$2" color="$color10" textAlign="center">
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
        </View>

        {/* Question */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5" gap="$3">
            <View
              alignSelf="flex-start"
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="$color4"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="$primary" fontWeight="500">{question.category}</Text>
            </View>

            <Text fontSize="$5" fontWeight="600" color="$color12" lineHeight={28}>
              {question.question}
            </Text>

            <YStack gap="$2">
              {question.options.map(option => {
                const isSelected = answers[question.id] === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setAnswers({ ...answers, [question.id]: option.value })}
                  >
                    <XStack
                      padding="$2.5"
                      backgroundColor={isSelected ? '$color4' : '$color2'}
                      borderRadius="$4"
                      borderWidth={2}
                      borderColor={isSelected ? '$primary' : '$color5'}
                      alignItems="center"
                    >
                      <View
                        width={24}
                        height={24}
                        borderRadius={12}
                        borderWidth={2}
                        borderColor={isSelected ? '$primary' : '$color5'}
                        marginRight="$2"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {isSelected && (
                          <View
                            width={12}
                            height={12}
                            borderRadius={6}
                            backgroundColor="$primary"
                          />
                        )}
                      </View>
                      <Text
                        fontSize="$3"
                        color={isSelected ? '$primary' : '$color10'}
                        fontWeight={isSelected ? '500' : '400'}
                        flex={1}
                      >
                        {option.label}
                      </Text>
                    </XStack>
                  </Pressable>
                );
              })}
            </YStack>
          </YStack>
        </ScrollView>

        {/* Navigation */}
        <View
          paddingHorizontal="$2.5"
          paddingVertical="$2"
          paddingBottom={insets.bottom + 16}
          backgroundColor="$color2"
          borderTopWidth={1}
          borderTopColor="$color5"
        >
          <XStack gap="$2">
            {currentQuestionIndex > 0 && (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                <XStack
                  backgroundColor="$color4"
                  borderRadius="$10"
                  paddingVertical="$2"
                  alignItems="center"
                  justifyContent="center"
                  gap="$0.5"
                >
                  <ArrowLeft size={18} color={color10} />
                  <Text fontSize="$3" color="$color10">上一题</Text>
                </XStack>
              </Pressable>
            )}

            <Pressable
              style={{ flex: currentQuestionIndex === 0 ? 1 : 2 }}
              onPress={() => {
                if (!answers[question.id]) {
                  Alert.alert('提示', '请选择一个选项');
                  return;
                }
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                  analyzeRisks();
                }
              }}
            >
              <XStack
                backgroundColor={answers[question.id] ? '$primary' : '$color5'}
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
                justifyContent="center"
                gap="$0.5"
              >
                <Text fontSize="$3" fontWeight="600" color="white">
                  {currentQuestionIndex === questions.length - 1 ? '完成体检' : '下一题'}
                </Text>
                <ArrowRight size={18} color="white" />
              </XStack>
            </Pressable>
          </XStack>
        </View>
      </View>
    );
  };

  const renderAnalyzing = () => (
    <View flex={1} justifyContent="center" alignItems="center" padding="$6">
      <ActivityIndicator size="large" color={primaryColor} />
      <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$4" marginBottom="$1">
        正在生成体检报告...
      </Text>
      <Text fontSize="$3" color="$color10">
        AI正在分析您的法律风险状况
      </Text>
    </View>
  );

  const renderReport = () => {
    const dangerCount = riskAreas.filter(r => r.level === 'danger').length;
    const warningCount = riskAreas.filter(r => r.level === 'warning').length;
    const safeCount = riskAreas.filter(r => r.level === 'safe').length;

    const overallLevel =
      dangerCount > 0 ? 'danger' : warningCount > 2 ? 'warning' : 'safe';

    const getOverallIcon = () => {
      switch (overallLevel) {
        case 'danger': return <XCircle size={60} color="white" />;
        case 'warning': return <AlertTriangle size={60} color="white" />;
        case 'safe': return <CheckCircle2 size={60} color="white" />;
      }
    };

    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* Overall Assessment */}
        <View backgroundColor="$color2" padding="$4" alignItems="center">
          <View
            width={120}
            height={120}
            borderRadius={60}
            backgroundColor={getLevelColor(overallLevel)}
            justifyContent="center"
            alignItems="center"
            marginBottom="$3"
          >
            {getOverallIcon()}
          </View>
          <Text fontSize="$6" fontWeight="700" color="$color12" marginBottom="$1">
            {overallLevel === 'danger' ? '风险较高' : overallLevel === 'warning' ? '存在风险' : '整体良好'}
          </Text>
          <Text fontSize="$3" color="$color10" textAlign="center" marginBottom="$3">
            {overallLevel === 'danger'
              ? '发现多处法律风险，建议尽快采取措施'
              : overallLevel === 'warning'
              ? '部分方面需要完善，建议逐步改进'
              : '法律保障较为完善，请继续保持'}
          </Text>

          <XStack gap="$6">
            <YStack alignItems="center">
              <Text fontSize="$7" fontWeight="700" color="$color12">{dangerCount}</Text>
              <Text fontSize="$2" color="$error" fontWeight="500">高风险</Text>
            </YStack>
            <YStack alignItems="center">
              <Text fontSize="$7" fontWeight="700" color="$color12">{warningCount}</Text>
              <Text fontSize="$2" style={{ color: GOLD_COLOR }} fontWeight="500">中风险</Text>
            </YStack>
            <YStack alignItems="center">
              <Text fontSize="$7" fontWeight="700" color="$color12">{safeCount}</Text>
              <Text fontSize="$2" color="$success" fontWeight="500">安全</Text>
            </YStack>
          </XStack>
        </View>

        {/* Detailed Assessment */}
        <View backgroundColor="$color2" padding="$2.5" marginTop="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            详细评估
          </Text>
          <YStack gap="$2">
            {riskAreas.map((area, index) => (
              <View
                key={index}
                backgroundColor="$color4"
                borderRadius="$4"
                padding="$2"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$4" fontWeight="600" color="$color12">{area.category}</Text>
                  <View
                    style={{ backgroundColor: getLevelBgColor(area.level) }}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text
                      fontSize="$2"
                      fontWeight="600"
                      style={{ color: getLevelColor(area.level) }}
                    >
                      {area.level === 'danger' ? '需改进' : area.level === 'warning' ? '待提升' : '良好'}
                    </Text>
                  </View>
                </XStack>

                <YStack marginBottom="$1.5">
                  <Text fontSize="$2" fontWeight="600" color="$color10" marginBottom="$0.5">
                    发现问题：
                  </Text>
                  {area.issues.map((issue, i) => (
                    <Text key={i} fontSize="$2" color="$error" lineHeight={20}>• {issue}</Text>
                  ))}
                </YStack>

                <YStack marginBottom="$1.5">
                  <Text fontSize="$2" fontWeight="600" color="$color10" marginBottom="$0.5">
                    改进建议：
                  </Text>
                  {area.suggestions.map((suggestion, i) => (
                    <Text key={i} fontSize="$2" color="$success" lineHeight={20}>• {suggestion}</Text>
                  ))}
                </YStack>

                {area.action && (
                  <Pressable onPress={() => navProp.navigate(area.action!.screen)}>
                    <XStack
                      backgroundColor="$color2"
                      borderRadius="$10"
                      paddingVertical="$1.5"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={1}
                      borderColor="$primary"
                      gap="$0.5"
                    >
                      <Text fontSize="$2" fontWeight="600" color="$primary">
                        {area.action.label}
                      </Text>
                      <ChevronRight size={14} color={primaryColor} />
                    </XStack>
                  </Pressable>
                )}
              </View>
            ))}
          </YStack>
        </View>

        {/* Summary */}
        <View backgroundColor="$color2" padding="$2.5" marginTop="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            总结与建议
          </Text>
          <XStack
            style={{ backgroundColor: `${GOLD_COLOR}15` }}
            borderRadius="$4"
            padding="$2"
            borderLeftWidth={3}
            borderLeftColor={GOLD_COLOR}
            gap="$2"
          >
            <Lightbulb size={24} color={GOLD_COLOR} />
            <Text fontSize="$3" color="$color10" flex={1} lineHeight={22}>
              {overallLevel === 'danger'
                ? '建议您优先解决高风险问题，如订立遗嘱、建立财产清单、设立意定监护等。必要时可咨询专业律师获取帮助。'
                : overallLevel === 'warning'
                ? '您的法律保障整体尚可，建议逐步完善各项安排，如公证遗嘱、书面化赡养协议等，提升法律保障水平。'
                : '您的法律保障非常完善！建议定期（每年1-2次）进行法律体检，及时更新相关文件，保持良好状态。'}
            </Text>
          </XStack>
        </View>

        {/* Actions */}
        <View backgroundColor="$color2" padding="$2.5" marginTop="$1.5">
          <XStack gap="$2">
            <Pressable style={{ flex: 1 }} onPress={() => navProp.navigate('LawyerList')}>
              <XStack
                backgroundColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
                justifyContent="center"
                gap="$1"
              >
                <Users size={18} color="white" />
                <Text fontSize="$3" fontWeight="600" color="white">咨询律师</Text>
              </XStack>
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                setCurrentStep('intro');
                setAnswers({});
                setCurrentQuestionIndex(0);
                setRiskAreas([]);
              }}
            >
              <XStack
                borderWidth={1}
                borderColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
                justifyContent="center"
                gap="$1"
              >
                <RefreshCw size={18} color={primaryColor} />
                <Text fontSize="$3" fontWeight="600" color="$primary">重新体检</Text>
              </XStack>
            </Pressable>
          </XStack>
        </View>

        <View height={insets.bottom + 20} />
      </ScrollView>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <TitleBar title="法律体检" onBack={() => navigation.goBack()} />

      {/* Content */}
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'questionnaire' && renderQuestionnaire()}
      {currentStep === 'analyzing' && renderAnalyzing()}
      {currentStep === 'report' && renderReport()}
    </View>
  );
};

export default LegalCheckupScreen;
