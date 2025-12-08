/**
 * 合同审查页面 - ContractReviewScreen
 * Phase 35.2: 合同审查服务
 *
 * 功能：
 * - 合同类型选择：房产买卖、借款、养老院、保险等
 * - 合同文件上传：拍照识别或PDF上传
 * - AI初筛：智能识别风险条款
 * - 律师精审：申请专业律师详细审查
 * - 审查报告：展示风险点和修改建议
 */

import React, { useState } from 'react';
import { Alert, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, ScrollView, View, useTheme } from 'tamagui';
import {
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
import { TitleBar } from '@/components/TitleBar';

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
  clause: string;
  riskLevel: RiskLevel;
  riskDescription: string;
  suggestion: string;
}

const ContractReviewScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

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

    setTimeout(() => {
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
  const getRiskLevelColor = (level: RiskLevel): string | undefined => {
    switch (level) {
      case 'low':
        return successColor;
      case 'medium':
        return warningColor;
      case 'high':
        return '#ff7a45';
      case 'critical':
        return errorColor;
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

  // 返回处理
  const handleBack = () => {
    if (currentStep === 'upload') {
      setCurrentStep('select_type');
    } else if (currentStep === 'report') {
      setCurrentStep('select_type');
      setSelectedType('');
      setRiskItems([]);
    } else {
      navigation.goBack();
    }
  };

  // 渲染类型选择
  const renderTypeSelection = () => {
    return (
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$3">
          <YStack gap="$2">
            <Text fontSize="$7" fontWeight="700" color="$color12">
              选择合同类型
            </Text>
            <Text fontSize="$4" color="$color10">
              请选择您需要审查的合同类型
            </Text>
          </YStack>

          <YStack gap="$3">
            {CONTRACT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              const IconComponent = type.icon;
              return (
                <Pressable key={type.id} onPress={() => setSelectedType(type.id)}>
                  <View
                    padding="$4"
                    backgroundColor={isSelected ? '$color2' : '$background'}
                    borderWidth={2}
                    borderColor={isSelected ? '$primary' : '$color5'}
                    borderRadius="$4"
                  >
                    <XStack gap="$3" alignItems="center" marginBottom="$3">
                      <View
                        width={64}
                        height={64}
                        borderRadius={32}
                        backgroundColor={isSelected ? '$background' : '$color4'}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <IconComponent
                          size={32}
                          color={isSelected ? primaryColor : color10}
                        />
                      </View>
                      <YStack flex={1}>
                        <Text
                          fontSize="$5"
                          fontWeight="700"
                          color={isSelected ? '$primary' : '$color12'}
                          marginBottom="$1"
                        >
                          {type.label}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          {type.description}
                        </Text>
                      </YStack>
                    </XStack>

                    <YStack
                      paddingTop="$3"
                      borderTopWidth={1}
                      borderTopColor="$color5"
                      gap="$1"
                    >
                      <Text fontSize="$2" fontWeight="600" color="$color10">
                        重点审查:
                      </Text>
                      {type.riskPoints.map((point, index) => (
                        <Text key={index} fontSize="$2" color="$color10">
                          • {point}
                        </Text>
                      ))}
                    </YStack>
                  </View>
                </Pressable>
              );
            })}
          </YStack>

          <Pressable
            onPress={() => {
              if (selectedType) {
                setCurrentStep('upload');
              }
            }}
            disabled={!selectedType}
          >
            <View
              paddingVertical="$3"
              backgroundColor={selectedType ? '$primary' : '$color5'}
              borderRadius="$10"
              alignItems="center"
            >
              <Text
                fontSize="$5"
                fontWeight="600"
                color={selectedType ? 'white' : '$color10'}
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
      <YStack flex={1} padding="$2.5" gap="$3">
        <YStack gap="$2">
          <Text fontSize="$7" fontWeight="700" color="$color12">
            上传合同文件
          </Text>
          <Text fontSize="$4" color="$color10">
            拍照或选择PDF文件上传
          </Text>
        </YStack>

        <XStack gap="$3">
          <Pressable onPress={() => handleUpload('camera')} style={{ flex: 1 }}>
            <View
              flex={1}
              padding="$5"
              alignItems="center"
              borderWidth={2}
              borderColor="$primary"
              borderStyle="dashed"
              borderRadius="$4"
            >
              <Camera size={48} color={primaryColor} />
              <Text
                fontSize="$4"
                fontWeight="700"
                color="$primary"
                marginTop="$3"
                marginBottom="$1"
              >
                拍照上传
              </Text>
              <Text fontSize="$2" color="$color10" textAlign="center">
                拍摄合同照片{'\n'}支持多页拍摄
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => handleUpload('file')} style={{ flex: 1 }}>
            <View
              flex={1}
              padding="$5"
              alignItems="center"
              borderWidth={2}
              borderColor="$primary"
              borderStyle="dashed"
              borderRadius="$4"
            >
              <FileText size={48} color={primaryColor} />
              <Text
                fontSize="$4"
                fontWeight="700"
                color="$primary"
                marginTop="$3"
                marginBottom="$1"
              >
                选择文件
              </Text>
              <Text fontSize="$2" color="$color10" textAlign="center">
                支持PDF、Word{'\n'}图片格式
              </Text>
            </View>
          </Pressable>
        </XStack>

        <View
          style={{ backgroundColor: `${primaryColor}15` }}
          padding="$4"
          borderRadius="$3"
        >
          <XStack gap="$3">
            <Info size={20} color={primaryColor} />
            <YStack flex={1} gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$primary">
                温馨提示:
              </Text>
              <Text fontSize="$3" color="$color12" lineHeight={22}>
                1. 请确保合同文字清晰可见{'\n'}
                2. 合同页面完整,无遗漏{'\n'}
                3. 文件大小不超过10MB{'\n'}
                4. 您的合同信息将加密存储,严格保密
              </Text>
            </YStack>
          </XStack>
        </View>

        <Pressable onPress={() => setCurrentStep('select_type')}>
          <View
            paddingVertical="$3"
            backgroundColor="$color4"
            borderRadius="$10"
            alignItems="center"
          >
            <Text fontSize="$5" fontWeight="600" color="$color10">
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
        <ActivityIndicator size="large" color={primaryColor} />
        <Text fontSize="$6" fontWeight="700" color="$color12" marginTop="$5">
          AI正在审查合同...
        </Text>

        <YStack gap="$3" marginTop="$6" width="100%">
          <XStack alignItems="center" gap="$3">
            <CheckCircle size={20} color={successColor} />
            <Text fontSize="$4" color="$color10">
              文件上传成功
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$3">
            <CheckCircle size={20} color={successColor} />
            <Text fontSize="$4" color="$color10">
              文本识别完成
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$3">
            <ActivityIndicator size="small" color={primaryColor} />
            <Text fontSize="$4" color="$color10">
              正在分析风险条款...
            </Text>
          </XStack>
        </YStack>

        <Text fontSize="$3" color="$color10" marginTop="$6">
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
          <View backgroundColor="$background" padding="$5" alignItems="center">
            <Text fontSize="$7" fontWeight="700" color="$color12" marginBottom="$1">
              合同审查报告
            </Text>
            <Text fontSize="$4" color="$color10">
              {contractType?.label} · {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* 风险概览 */}
          <View backgroundColor="$background" padding="$4" marginTop="$2">
            <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$4">
              风险概览
            </Text>
            <XStack flexWrap="wrap" gap="$3">
              <View
                flex={1}
                minWidth="47%"
                backgroundColor="$color4"
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius={4} backgroundColor="$error" />
                  <Text fontSize="$3" color="$color10" flex={1}>
                    严重风险
                  </Text>
                  <Text fontSize="$6" fontWeight="700" color="$color12">
                    {criticalCount}
                  </Text>
                </XStack>
              </View>
              <View
                flex={1}
                minWidth="47%"
                backgroundColor="$color4"
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius={4} style={{ backgroundColor: '#ff7a45' }} />
                  <Text fontSize="$3" color="$color10" flex={1}>
                    高风险
                  </Text>
                  <Text fontSize="$6" fontWeight="700" color="$color12">
                    {highCount}
                  </Text>
                </XStack>
              </View>
              <View
                flex={1}
                minWidth="47%"
                backgroundColor="$color4"
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius={4} backgroundColor="$warning" />
                  <Text fontSize="$3" color="$color10" flex={1}>
                    中风险
                  </Text>
                  <Text fontSize="$6" fontWeight="700" color="$color12">
                    {mediumCount}
                  </Text>
                </XStack>
              </View>
              <View
                flex={1}
                minWidth="47%"
                backgroundColor="$color4"
                padding="$3"
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <View width={8} height={8} borderRadius={4} backgroundColor="$success" />
                  <Text fontSize="$3" color="$color10" flex={1}>
                    低风险
                  </Text>
                  <Text fontSize="$6" fontWeight="700" color="$color12">
                    {lowCount}
                  </Text>
                </XStack>
              </View>
            </XStack>

            {criticalCount + highCount > 0 && (
              <View
                style={{ backgroundColor: `${errorColor}10` }}
                padding="$3"
                borderRadius="$3"
                borderLeftWidth={3}
                borderLeftColor="$error"
                marginTop="$4"
              >
                <XStack alignItems="center" gap="$3">
                  <AlertTriangle size={24} color={errorColor} />
                  <Text flex={1} fontSize="$3" color="$error" lineHeight={20}>
                    发现{criticalCount + highCount}处需要重点关注的风险,建议咨询专业律师
                  </Text>
                </XStack>
              </View>
            )}
          </View>

          {/* 风险详情 */}
          <View backgroundColor="$background" padding="$4" marginTop="$2">
            <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$4">
              风险详情
            </Text>
            <YStack gap="$3">
              {riskItems.map((risk, index) => (
                <View key={risk.id} backgroundColor="$color4" padding="$4" borderRadius="$4">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$4" fontWeight="700" color="$color12">
                      风险点 {index + 1}
                    </Text>
                    <View
                      style={{ backgroundColor: `${getRiskLevelColor(risk.riskLevel)}20` }}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" fontWeight="600" style={{ color: getRiskLevelColor(risk.riskLevel) }}>
                        {getRiskLevelLabel(risk.riskLevel)}
                      </Text>
                    </View>
                  </XStack>

                  <YStack gap="$3">
                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$color10">
                        条款内容:
                      </Text>
                      <View backgroundColor="$background" padding="$3" borderRadius="$2">
                        <Text fontSize="$4" color="$color12" lineHeight={22}>
                          {risk.clause}
                        </Text>
                      </View>
                    </YStack>

                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$color10">
                        风险说明:
                      </Text>
                      <Text fontSize="$4" color="$error" lineHeight={22}>
                        {risk.riskDescription}
                      </Text>
                    </YStack>

                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$color10">
                        修改建议:
                      </Text>
                      <Text fontSize="$4" color="$success" lineHeight={22}>
                        {risk.suggestion}
                      </Text>
                    </YStack>
                  </YStack>
                </View>
              ))}
            </YStack>
          </View>

          {/* 专业建议 */}
          <View backgroundColor="$background" padding="$4" marginTop="$2">
            <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$4">
              专业建议
            </Text>
            <View
              style={{ backgroundColor: `${warningColor}15` }}
              padding="$4"
              borderRadius="$4"
              borderLeftWidth={3}
              borderLeftColor="$warning"
            >
              <XStack gap="$3">
                <Lightbulb size={24} color={warningColor} />
                <Text flex={1} fontSize="$4" color="$color10" lineHeight={22}>
                  {criticalCount + highCount > 0
                    ? '您的合同存在较多风险点,强烈建议在签署前咨询专业律师进行详细审查,避免经济损失。'
                    : '合同整体风险较低,但建议仔细阅读所有条款,如有疑问可咨询专业律师。'}
                </Text>
              </XStack>
            </View>
          </View>

          {/* 操作按钮 */}
          <View backgroundColor="$background" padding="$4" marginTop="$2">
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
                  backgroundColor="$primary"
                  borderRadius="$10"
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
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor="$primary"
                  alignItems="center"
                >
                  <XStack gap="$2" alignItems="center">
                    <Download size={20} color={primaryColor} />
                    <Text fontSize="$4" fontWeight="600" color="$primary">
                      下载报告
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </View>

          <View height={20} />
        </YStack>
      </ScrollView>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <TitleBar
        title="合同审查"
        onBack={handleBack}
      />

      {/* 内容区域 */}
      {currentStep === 'select_type' && renderTypeSelection()}
      {currentStep === 'upload' && renderUpload()}
      {currentStep === 'ai_review' && reviewing && renderAIReviewing()}
      {currentStep === 'report' && renderReport()}
    </View>
  );
};

export default ContractReviewScreen;
