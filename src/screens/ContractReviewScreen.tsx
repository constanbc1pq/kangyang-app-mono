/**
 * ============================================================================
 * 合同审查页面 - ContractReviewScreen
 * ============================================================================
 *
 * Phase 35.2: 合同审查服务
 *
 * 【功能概述】
 * - 为老年人提供合同风险审查服务
 * - 防止因合同条款不明确导致的经济损失
 *
 * 【主要功能】
 * 1. 合同类型选择:房产买卖、借款、养老院、保险等
 * 2. 合同文件上传:拍照识别或PDF上传
 * 3. AI初筛:智能识别风险条款
 * 4. 律师精审:申请专业律师详细审查
 * 5. 审查报告:展示风险点和修改建议
 *
 * ============================================================================
 */

import React, { useState } from 'react';
import { Alert, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Card, Button, Theme, ScrollView, View } from 'tamagui';
import {
  ArrowLeft,
  Home,
  DollarSign,
  Heart,
  Shield,
  TrendingUp,
  Users,
  Camera,
  FileText,
  Info,
  CheckCircle,
  Download,
  UserCheck,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface Props {
  navigation: any;
}

// 合同类型
const CONTRACT_TYPES = [
  {
    id: 'property_sale',
    label: '房产买卖合同',
    icon: Home,
    description: '二手房买卖、房屋租赁合同',
    riskPoints: ['价格条款', '交房时间', '违约责任'],
  },
  {
    id: 'loan',
    label: '借款合同',
    icon: DollarSign,
    description: '个人借款、抵押贷款合同',
    riskPoints: ['利率条款', '还款方式', '担保条款'],
  },
  {
    id: 'nursing_home',
    label: '养老院服务合同',
    icon: Heart,
    description: '养老机构入住服务合同',
    riskPoints: ['服务内容', '收费标准', '退费条款'],
  },
  {
    id: 'insurance',
    label: '保险合同',
    icon: Shield,
    description: '养老保险、医疗保险合同',
    riskPoints: ['保障范围', '免责条款', '理赔流程'],
  },
  {
    id: 'investment',
    label: '投资理财合同',
    icon: TrendingUp,
    description: '理财产品、投资协议',
    riskPoints: ['收益承诺', '风险提示', '赎回条款'],
  },
  {
    id: 'service',
    label: '服务合同',
    icon: Users,
    description: '家政服务、装修合同等',
    riskPoints: ['服务标准', '质量保证', '争议解决'],
  },
];

// 审查步骤
type ReviewStep = 'select_type' | 'upload' | 'ai_review' | 'report';

// 风险等级
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// 风险项
interface RiskItem {
  id: string;
  clause: string; // 条款内容
  riskLevel: RiskLevel;
  riskDescription: string;
  suggestion: string;
}

const ContractReviewScreen: React.FC<Props> = ({ navigation }) => {
  // 状态管理
  const [currentStep, setCurrentStep] = useState<ReviewStep>('select_type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [reviewing, setReviewing] = useState(false);
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);

  // 模拟文件上传
  const handleUpload = (type: 'camera' | 'file') => {
    Alert.alert(
      '上传合同',
      type === 'camera' ? '正在打开相机...' : '正在选择文件...',
      [
        {
          text: '确定',
          onPress: () => {
            setUploadedFile(
              type === 'camera'
                ? '合同照片_20240122.jpg'
                : '养老院服务合同_20240122.pdf'
            );
            setCurrentStep('ai_review');
            handleAIReview();
          },
        },
      ]
    );
  };

  // 模拟AI审查
  const handleAIReview = () => {
    setReviewing(true);

    // 模拟AI分析过程
    setTimeout(() => {
      // 模拟生成风险项
      const mockRisks: RiskItem[] = [
        {
          id: 'risk_1',
          clause: '第三条 收费标准:床位费3000元/月,护理费2000元/月,餐费1500元/月',
          riskLevel: 'medium',
          riskDescription: '未明确费用调整机制,可能存在随意涨价风险',
          suggestion:
            '建议增加"费用调整需提前30天书面通知,年度涨幅不超过5%"的条款',
        },
        {
          id: 'risk_2',
          clause: '第五条 退费条款:入住满3个月后退费,扣除50%作为违约金',
          riskLevel: 'high',
          riskDescription: '违约金比例过高,不符合公平原则',
          suggestion: '建议协商降低违约金至20%-30%,或按实际入住天数计算费用',
        },
        {
          id: 'risk_3',
          clause: '第七条 责任免除:养老院对老人因自身疾病导致的意外不承担责任',
          riskLevel: 'critical',
          riskDescription: '免责条款过于宽泛,可能导致养老院逃避应有责任',
          suggestion:
            '建议明确"因养老院未尽合理照护义务导致的意外,养老院应承担相应责任"',
        },
        {
          id: 'risk_4',
          clause: '第九条 争议解决:双方协商解决,协商不成提交北京仲裁委员会仲裁',
          riskLevel: 'low',
          riskDescription: '仲裁条款相对公平,风险较低',
          suggestion: '可接受,如需修改可改为"协商不成可向法院起诉"',
        },
      ];

      setRiskItems(mockRisks);
      setReviewing(false);
      setCurrentStep('report');
    }, 3000);
  };

  // 获取风险等级颜色
  const getRiskLevelColor = (level: RiskLevel): string => {
    switch (level) {
      case 'low':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'high':
        return '#ff7a45';
      case 'critical':
        return COLORS.error;
    }
  };

  // 获取风险等级标签
  const getRiskLevelLabel = (level: RiskLevel): string => {
    switch (level) {
      case 'low':
        return '低风险';
      case 'medium':
        return '中风险';
      case 'high':
        return '高风险';
      case 'critical':
        return '严重风险';
    }
  };

  // 渲染类型选择
  const renderTypeSelection = () => {
    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$7" fontWeight="bold" color={COLORS.text}>
              选择合同类型
            </Text>
            <Text fontSize="$4" color={COLORS.textSecondary}>
              请选择您需要审查的合同类型
            </Text>
          </YStack>

          <YStack gap="$3">
            {CONTRACT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              const IconComponent = type.icon;
              return (
                <Pressable key={type.id} onPress={() => setSelectedType(type.id)}>
                  <Card
                    padding="$4"
                    backgroundColor={isSelected ? `${COLORS.primary}10` : '$background'}
                    borderWidth={2}
                    borderColor={isSelected ? COLORS.primary : COLORS.border}
                    borderRadius="$4"
                  >
                    <XStack gap="$3" alignItems="center" marginBottom="$3">
                      <View
                        width={64}
                        height={64}
                        borderRadius="$8"
                        backgroundColor={isSelected ? '$background' : COLORS.surface}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <IconComponent
                          size={32}
                          color={isSelected ? COLORS.primary : COLORS.textSecondary}
                        />
                      </View>
                      <YStack flex={1}>
                        <Text
                          fontSize="$5"
                          fontWeight="bold"
                          color={isSelected ? COLORS.primary : COLORS.text}
                          marginBottom="$1"
                        >
                          {type.label}
                        </Text>
                        <Text fontSize="$3" color={COLORS.textSecondary}>
                          {type.description}
                        </Text>
                      </YStack>
                    </XStack>

                    <YStack
                      paddingTop="$3"
                      borderTopWidth={1}
                      borderTopColor={COLORS.border}
                      gap="$1"
                    >
                      <Text fontSize="$2" fontWeight="600" color={COLORS.textSecondary}>
                        重点审查:
                      </Text>
                      {type.riskPoints.map((point, index) => (
                        <Text key={index} fontSize="$2" color={COLORS.textSecondary}>
                          • {point}
                        </Text>
                      ))}
                    </YStack>
                  </Card>
                </Pressable>
              );
            })}
          </YStack>

          <Pressable disabled={!selectedType}>
            <View
              paddingVertical="$3"
              backgroundColor={selectedType ? COLORS.primary : COLORS.border}
              borderRadius="$6"
              alignItems="center"
              onPress={() => {
                if (selectedType) {
                  setCurrentStep('upload');
                }
              }}
            >
              <Text
                fontSize="$5"
                fontWeight="600"
                color={selectedType ? 'white' : COLORS.textSecondary}
              >
                下一步
              </Text>
            </View>
          </Pressable>
        </YStack>
      </ScrollView>
    );
  };

  // 渲染文件上传
  const renderUpload = () => {
    return (
      <YStack flex={1} padding="$4" gap="$4">
        <YStack gap="$2">
          <Text fontSize="$7" fontWeight="bold" color={COLORS.text}>
            上传合同文件
          </Text>
          <Text fontSize="$4" color={COLORS.textSecondary}>
            拍照或选择PDF文件上传
          </Text>
        </YStack>

        <XStack gap="$3">
          <Pressable onPress={() => handleUpload('camera')} style={{ flex: 1 }}>
            <Card
              flex={1}
              padding="$5"
              alignItems="center"
              borderWidth={2}
              borderColor={COLORS.primary}
              borderStyle="dashed"
              borderRadius="$4"
            >
              <Camera size={48} color={COLORS.primary} />
              <Text
                fontSize="$4"
                fontWeight="bold"
                color={COLORS.primary}
                marginTop="$3"
                marginBottom="$1"
              >
                拍照上传
              </Text>
              <Text fontSize="$2" color={COLORS.textSecondary} textAlign="center">
                拍摄合同照片{'\n'}支持多页拍摄
              </Text>
            </Card>
          </Pressable>

          <Pressable onPress={() => handleUpload('file')} style={{ flex: 1 }}>
            <Card
              flex={1}
              padding="$5"
              alignItems="center"
              borderWidth={2}
              borderColor={COLORS.primary}
              borderStyle="dashed"
              borderRadius="$4"
            >
              <FileText size={48} color={COLORS.primary} />
              <Text
                fontSize="$4"
                fontWeight="bold"
                color={COLORS.primary}
                marginTop="$3"
                marginBottom="$1"
              >
                选择文件
              </Text>
              <Text fontSize="$2" color={COLORS.textSecondary} textAlign="center">
                支持PDF、Word{'\n'}图片格式
              </Text>
            </Card>
          </Pressable>
        </XStack>

        <Card backgroundColor={`${COLORS.primary}15`} padding="$4" borderRadius="$3">
          <XStack gap="$3">
            <Info size={20} color={COLORS.primary} />
            <YStack flex={1} gap="$2">
              <Text fontSize="$4" fontWeight="600" color={COLORS.primary}>
                温馨提示:
              </Text>
              <Text fontSize="$3" color={COLORS.text} lineHeight={22}>
                1. 请确保合同文字清晰可见{'\n'}
                2. 合同页面完整,无遗漏{'\n'}
                3. 文件大小不超过10MB{'\n'}
                4. 您的合同信息将加密存储,严格保密
              </Text>
            </YStack>
          </XStack>
        </Card>

        <Pressable onPress={() => setCurrentStep('select_type')}>
          <View
            paddingVertical="$3"
            backgroundColor={COLORS.surface}
            borderRadius="$6"
            alignItems="center"
          >
            <Text fontSize="$5" fontWeight="600" color={COLORS.textSecondary}>
              返回
            </Text>
          </View>
        </Pressable>
      </YStack>
    );
  };

  // 渲染AI审查中
  const renderAIReviewing = () => {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$8">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text fontSize="$6" fontWeight="bold" color={COLORS.text} marginTop="$5">
          AI正在审查合同...
        </Text>

        <YStack gap="$4" marginTop="$6" width="100%">
          <XStack alignItems="center" gap="$3">
            <CheckCircle size={20} color={COLORS.success} />
            <Text fontSize="$4" color={COLORS.textSecondary}>
              文件上传成功
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$3">
            <CheckCircle size={20} color={COLORS.success} />
            <Text fontSize="$4" color={COLORS.textSecondary}>
              文本识别完成
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$3">
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text fontSize="$4" color={COLORS.textSecondary}>
              正在分析风险条款...
            </Text>
          </XStack>
        </YStack>

        <Text fontSize="$3" color={COLORS.textSecondary} marginTop="$6">
          预计需要30秒左右,请稍候
        </Text>
      </YStack>
    );
  };

  // 渲染审查报告
  const renderReport = () => {
    const contractType = CONTRACT_TYPES.find((t) => t.id === selectedType);
    const criticalCount = riskItems.filter((r) => r.riskLevel === 'critical').length;
    const highCount = riskItems.filter((r) => r.riskLevel === 'high').length;
    const mediumCount = riskItems.filter((r) => r.riskLevel === 'medium').length;
    const lowCount = riskItems.filter((r) => r.riskLevel === 'low').length;

    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack>
          {/* 报告头部 */}
          <Card backgroundColor="$background" padding="$5" alignItems="center">
            <Text fontSize="$7" fontWeight="bold" color={COLORS.text} marginBottom="$1">
              合同审查报告
            </Text>
            <Text fontSize="$4" color={COLORS.textSecondary}>
              {contractType?.label} · {new Date().toLocaleDateString()}
            </Text>
          </Card>

          {/* 风险概览 */}
          <Card backgroundColor="$background" padding="$4" marginTop="$2">
            <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$4">
              风险概览
            </Text>
            <XStack flexWrap="wrap" gap="$3">
              <View
                flex={1}
                minWidth="47%"
                backgroundColor={COLORS.surface}
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius="$2" backgroundColor={COLORS.error} />
                  <Text fontSize="$3" color={COLORS.textSecondary} flex={1}>
                    严重风险
                  </Text>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>
                    {criticalCount}
                  </Text>
                </XStack>
              </View>
              <View
                flex={1}
                minWidth="47%"
                backgroundColor={COLORS.surface}
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius="$2" backgroundColor="#ff7a45" />
                  <Text fontSize="$3" color={COLORS.textSecondary} flex={1}>
                    高风险
                  </Text>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>
                    {highCount}
                  </Text>
                </XStack>
              </View>
              <View
                flex={1}
                minWidth="47%"
                backgroundColor={COLORS.surface}
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius="$2" backgroundColor={COLORS.warning} />
                  <Text fontSize="$3" color={COLORS.textSecondary} flex={1}>
                    中风险
                  </Text>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>
                    {mediumCount}
                  </Text>
                </XStack>
              </View>
              <View
                flex={1}
                minWidth="47%"
                backgroundColor={COLORS.surface}
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius="$2" backgroundColor={COLORS.success} />
                  <Text fontSize="$3" color={COLORS.textSecondary} flex={1}>
                    低风险
                  </Text>
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>
                    {lowCount}
                  </Text>
                </XStack>
              </View>
            </XStack>

            {criticalCount + highCount > 0 && (
              <Card
                backgroundColor="#fff2e8"
                padding="$3"
                borderRadius="$3"
                borderLeftWidth={3}
                borderLeftColor={COLORS.error}
                marginTop="$4"
              >
                <XStack alignItems="center" gap="$3">
                  <AlertTriangle size={24} color={COLORS.error} />
                  <Text flex={1} fontSize="$3" color={COLORS.error} lineHeight={20}>
                    发现{criticalCount + highCount}处需要重点关注的风险,建议咨询专业律师
                  </Text>
                </XStack>
              </Card>
            )}
          </Card>

          {/* 风险详情 */}
          <Card backgroundColor="$background" padding="$4" marginTop="$2">
            <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$4">
              风险详情
            </Text>
            <YStack gap="$3">
              {riskItems.map((risk, index) => (
                <Card key={risk.id} backgroundColor={COLORS.surface} padding="$4" borderRadius="$4">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$4" fontWeight="bold" color={COLORS.text}>
                      风险点 {index + 1}
                    </Text>
                    <View
                      backgroundColor={`${getRiskLevelColor(risk.riskLevel)}20`}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" fontWeight="600" color={getRiskLevelColor(risk.riskLevel)}>
                        {getRiskLevelLabel(risk.riskLevel)}
                      </Text>
                    </View>
                  </XStack>

                  <YStack gap="$3">
                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color={COLORS.textSecondary}>
                        条款内容:
                      </Text>
                      <Card backgroundColor="$background" padding="$3" borderRadius="$2">
                        <Text fontSize="$4" color={COLORS.text} lineHeight={22}>
                          {risk.clause}
                        </Text>
                      </Card>
                    </YStack>

                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color={COLORS.textSecondary}>
                        风险说明:
                      </Text>
                      <Text fontSize="$4" color={COLORS.error} lineHeight={22}>
                        {risk.riskDescription}
                      </Text>
                    </YStack>

                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color={COLORS.textSecondary}>
                        修改建议:
                      </Text>
                      <Text fontSize="$4" color={COLORS.success} lineHeight={22}>
                        {risk.suggestion}
                      </Text>
                    </YStack>
                  </YStack>
                </Card>
              ))}
            </YStack>
          </Card>

          {/* 专业建议 */}
          <Card backgroundColor="$background" padding="$4" marginTop="$2">
            <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$4">
              专业建议
            </Text>
            <Card
              backgroundColor="#fffbe6"
              padding="$4"
              borderRadius="$4"
              borderLeftWidth={3}
              borderLeftColor={COLORS.warning}
            >
              <XStack gap="$3">
                <Lightbulb size={24} color={COLORS.warning} />
                <Text flex={1} fontSize="$4" color={COLORS.textSecondary} lineHeight={22}>
                  {criticalCount + highCount > 0
                    ? '您的合同存在较多风险点,强烈建议在签署前咨询专业律师进行详细审查,避免经济损失。'
                    : '合同整体风险较低,但建议仔细阅读所有条款,如有疑问可咨询专业律师。'}
                </Text>
              </XStack>
            </Card>
          </Card>

          {/* 操作按钮 */}
          <Card backgroundColor="$background" padding="$4" marginTop="$2">
            <XStack gap="$3">
              <Pressable
                onPress={() => {
                  navigation.navigate('LawyerList');
                }}
                style={{ flex: 1 }}
              >
                <View
                  flex={1}
                  paddingVertical="$3"
                  backgroundColor={COLORS.primary}
                  borderRadius="$6"
                  alignItems="center"
                >
                  <XStack gap="$2" alignItems="center">
                    <UserCheck size={20} color="white" />
                    <Text fontSize="$4" fontWeight="600" color="white">
                      申请律师精审
                    </Text>
                  </XStack>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  Alert.alert('下载报告', '正在生成PDF报告...');
                }}
                style={{ flex: 1 }}
              >
                <View
                  flex={1}
                  paddingVertical="$3"
                  backgroundColor="$background"
                  borderRadius="$6"
                  borderWidth={1}
                  borderColor={COLORS.primary}
                  alignItems="center"
                >
                  <XStack gap="$2" alignItems="center">
                    <Download size={20} color={COLORS.primary} />
                    <Text fontSize="$4" fontWeight="600" color={COLORS.primary}>
                      下载报告
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </Card>

          <View height={20} />
        </YStack>
      </ScrollView>
    );
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* 头部 */}
        <XStack
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor="$background"
          borderBottomWidth={1}
          borderBottomColor={COLORS.border}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <Text flex={1} fontSize="$6" fontWeight="bold" color={COLORS.text} marginLeft="$3">
            合同审查
          </Text>
          <View width={24} />
        </XStack>

        {/* 内容区域 */}
        {currentStep === 'select_type' && renderTypeSelection()}
        {currentStep === 'upload' && renderUpload()}
        {currentStep === 'ai_review' && reviewing && renderAIReviewing()}
        {currentStep === 'report' && renderReport()}
      </SafeAreaView>
    </Theme>
  );
};

export default ContractReviewScreen;
