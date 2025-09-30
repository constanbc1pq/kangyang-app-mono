import React, { useState, useRef, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H2,
  H3,
  Theme,
  ScrollView,
  Separator,
} from 'tamagui';
import {
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  MessageCircle,
  Mic,
  Paperclip,
  MoreHorizontal,
  Sparkles,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  ChevronDown,
  Star,
  Shield,
  Cpu,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

interface QuickQuestion {
  id: string;
  text: string;
  category: string;
  icon: any;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
  isPremium?: boolean;
  icon: any;
  accuracy: number;
  responseTime: string;
}

export const AIConsultationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '您好！我是华佗AI健康助手，很高兴为您服务。请描述您的健康问题或症状，我会为您提供专业的建议和指导。',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('huatuo');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // AI模型配置
  const aiModels: AIModel[] = [
    {
      id: 'huatuo',
      name: '华佗专医模型',
      description: '专为中医健康咨询优化的AI模型',
      features: ['中医诊疗', '健康调理', '体质分析', '养生指导'],
      isRecommended: true,
      isPremium: false,
      icon: Star,
      accuracy: 95,
      responseTime: '1-2秒'
    },
    {
      id: 'general',
      name: '通用健康模型',
      description: '覆盖现代医学各领域的综合AI模型',
      features: ['症状分析', '疾病诊断', '用药建议', '预防保健'],
      isRecommended: false,
      isPremium: false,
      icon: Activity,
      accuracy: 92,
      responseTime: '2-3秒'
    },
    {
      id: 'specialist',
      name: '专科医学模型',
      description: '针对专科疾病深度优化的高级模型',
      features: ['专科诊断', '深度分析', '精准治疗', '康复指导'],
      isRecommended: false,
      isPremium: true,
      icon: Shield,
      accuracy: 98,
      responseTime: '1秒'
    }
  ];

  // 获取当前选中的模型
  const getCurrentModel = () => {
    return aiModels.find(model => model.id === selectedModel) || aiModels[0];
  };

  // 快捷问题模板
  const quickQuestions: QuickQuestion[] = [
    {
      id: '1',
      text: '我最近总是感觉疲劳，这是什么原因？',
      category: '症状咨询',
      icon: Zap
    },
    {
      id: '2',
      text: '血压偏高应该注意什么？',
      category: '慢病管理',
      icon: Heart
    },
    {
      id: '3',
      text: '如何改善睡眠质量？',
      category: '生活建议',
      icon: Activity
    },
    {
      id: '4',
      text: '体检报告有异常指标怎么办？',
      category: '报告解读',
      icon: AlertCircle
    }
  ];

  // 发送消息
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // 滚动到底部
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  // 生成AI回复（根据模型类型智能分析）
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const currentModel = getCurrentModel();

    // 疲劳相关问题
    if (message.includes('疲劳') || message.includes('累') || message.includes('精神不振')) {
      if (currentModel.id === 'huatuo') {
        return '【华佗专医模型分析】\n\n根据中医理论，您的疲劳症状属于"虚劳"范畴：\n\n🌿 **中医辨证分析**\n• 气血不足：面色萎黄，神疲乏力\n• 脾胃虚弱：运化失常，精微不布\n• 肾精亏虚：先天之本不足\n• 心神不宁：思虑过度，耗伤心血\n\n🍵 **中医调理方案**\n• 补中益气：黄芪、党参、白术调理\n• 养血安神：当归、熟地、酸枣仁\n• 健脾益胃：山药、茯苓、甘草\n• 滋肾填精：枸杞、山茱萸、何首乌\n\n🧘 **养生指导**\n• 子午觉：23点前睡，午时小憩\n• 情志调养：保持心情舒畅，避免过思\n• 饮食有节：三餐定时，温热适中\n\n建议配合穴位按摩：足三里、关元、气海等。';
      } else if (currentModel.id === 'specialist') {
        return '【专科医学模型深度分析】\n\n疲劳综合征的精密诊断评估：\n\n🔬 **分子医学层面**\n• 线粒体功能障碍检测\n• 神经递质水平分析\n• 免疫系统功能评估\n• 激素水平精确测定\n\n🧬 **多系统评估**\n• 神经内分泌系统：HPA轴功能\n• 免疫系统：细胞因子谱分析\n• 代谢系统：ATP生成效率\n• 心血管系统：微循环评估\n\n⚕️ **精准治疗方案**\n• 个体化营养干预\n• 靶向药物治疗\n• 认知行为疗法\n• 物理康复训练\n\n建议进行全面的疲劳相关生物标志物检测。';
      } else {
        return '您提到的疲劳症状可能与多种因素相关：\n\n🔍 **可能原因分析**\n• 睡眠质量不佳或时长不足\n• 工作压力过大，精神紧张\n• 营养摄入不均衡\n• 缺乏规律运动\n• 可能存在潜在疾病\n\n💡 **改善建议**\n1. 建立固定睡眠时间，确保7-8小时深度睡眠\n2. 适量补充维生素B群和铁质\n3. 每天进行20-30分钟轻度运动\n4. 学会压力管理和放松技巧\n\n⚠️ 如果疲劳持续2周以上，建议及时就医检查。\n\n还有其他症状需要了解吗？';
      }
    }

    // 血压相关问题
    if (message.includes('血压') || message.includes('高血压') || message.includes('低血压')) {
      return '关于血压管理，我为您提供以下专业建议：\n\n📊 **血压标准参考**\n• 正常血压：<120/80 mmHg\n• 高血压前期：120-139/80-89 mmHg\n• 高血压：≥140/90 mmHg\n\n🍎 **饮食调整**\n• 减少钠盐摄入（<6g/天）\n• 增加钾离子食物（香蕉、橙子）\n• 控制饱和脂肪酸摄入\n• 适量摄入优质蛋白质\n\n🏃‍♂️ **生活方式**\n• 每周至少150分钟中等强度运动\n• 保持健康体重（BMI 18.5-24.9）\n• 戒烟限酒，规律作息\n\n📱 建议使用APP的血压监测功能，定期记录数据。';
    }

    // 睡眠相关问题
    if (message.includes('睡眠') || message.includes('失眠') || message.includes('睡不着')) {
      return '睡眠质量问题是现代人的常见困扰，让我帮您分析：\n\n🌙 **睡眠质量评估**\n• 入睡时间：正常应在15-30分钟内\n• 夜间觉醒：2次以内属正常\n• 深度睡眠：占总睡眠时间的20-25%\n\n💤 **改善策略**\n1. **睡前准备**：提前1小时停止使用电子设备\n2. **环境优化**：保持卧室安静、黑暗、凉爽\n3. **规律作息**：固定睡眠和起床时间\n4. **放松技巧**：深呼吸、冥想、轻柔音乐\n\n☕ **注意事项**\n• 下午2点后避免摄入咖啡因\n• 睡前3小时内避免大餐\n• 适量运动但避免睡前激烈运动\n\n您可以尝试使用APP的睡眠监测功能，我会根据数据提供更精准的建议。';
    }

    // 体检报告相关
    if (message.includes('体检') || message.includes('报告') || message.includes('异常') || message.includes('指标')) {
      return '体检报告解读需要综合分析多项指标：\n\n📋 **重点关注指标**\n• 血常规：白细胞、红细胞、血小板\n• 肝功能：ALT、AST、胆红素\n• 肾功能：肌酐、尿素氮\n• 血脂：胆固醇、甘油三酯\n• 血糖：空腹血糖、糖化血红蛋白\n\n🔍 **异常指标处理**\n1. **轻微异常**：通常可通过生活方式调整改善\n2. **明显异常**：建议及时咨询专科医生\n3. **趋势变化**：持续监测，关注变化趋势\n\n💡 **APP功能推荐**\n• 上传体检报告，获得AI智能解读\n• 设置定期体检提醒\n• 查看健康指标变化趋势\n\n如果您有具体的体检报告，可以上传让我详细分析。';
    }

    // 默认回复
    const defaultResponses = [
      '感谢您的咨询！基于您的描述，我为您分析如下：\n\n🔍 **初步评估**\n您提到的情况在日常生活中较为常见，通常与生活习惯、环境因素或身体状态有关。\n\n💡 **通用建议**\n• 保持规律作息，充足睡眠\n• 均衡营养，适量运动\n• 定期体检，关注身体变化\n• 学会压力管理和情绪调节\n\n📱 建议您使用APP的健康监测功能，记录相关数据，我会提供更精准的个性化建议。\n\n还有其他问题需要咨询吗？',

      '根据您的描述，我进行了综合分析：\n\n📊 **健康数据关联**\n结合您在APP中的健康记录，您的整体健康状况良好，但需要关注几个方面的改善。\n\n🎯 **个性化建议**\n• 结合您的年龄和体质特点\n• 考虑您的生活习惯和工作环境\n• 参考您的历史健康数据\n\n⚡ **即时行动计划**\n1. 短期调整（1-2周）\n2. 中期改善（1-3个月）\n3. 长期健康管理\n\n我已为您生成详细的健康改善方案，您可以在"个人中心"查看具体执行计划。',
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // 快捷问题点击
  const handleQuickQuestion = (question: QuickQuestion) => {
    sendMessage(question.text);
  };

  useEffect(() => {
    // 组件挂载时聚焦输入框
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* 顶部导航栏 */}
        <View
          backgroundColor="$cardBg"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
            <XStack justifyContent="space-between" alignItems="center">
              {/* 返回按钮 */}
              <Pressable onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={COLORS.text} />
              </Pressable>

              {/* 标题和状态 */}
              <XStack alignItems="center" flex={1} marginHorizontal="$3" space="$2">
                <View
                  width={32}
                  height={32}
                  backgroundColor={COLORS.primary}
                  borderRadius={16}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Bot size={16} color="white" />
                </View>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={1}>
                    AI健康咨询
                  </Text>
                  <XStack space="$2" alignItems="center">
                    <View
                      backgroundColor={getCurrentModel().isRecommended ? COLORS.primary : COLORS.surface}
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text
                        fontSize="$1"
                        color={getCurrentModel().isRecommended ? "white" : "$text"}
                        fontWeight="500"
                        numberOfLines={1}
                      >
                        {getCurrentModel().name}
                      </Text>
                    </View>
                    <XStack space="$1" alignItems="center">
                      <View
                        width={6}
                        height={6}
                        backgroundColor={COLORS.success}
                        borderRadius={3}
                      />
                      <Text fontSize="$1" color="$textSecondary">
                        在线
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>
              </XStack>

              {/* 模型选择 */}
              <TouchableOpacity onPress={() => setShowModelSelector(!showModelSelector)}>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$surface"
                >
                  <Cpu size={20} color={COLORS.text} />
                </View>
              </TouchableOpacity>
            </XStack>
        </View>

        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
          >
          {/* 模型选择器 */}
          {showModelSelector && (
            <View
              position="absolute"
              top={0}
              left={0}
              right={0}
              backgroundColor="rgba(0,0,0,0.5)"
              zIndex={1000}
              paddingTop="$20"
              paddingHorizontal="$4"
            >
              <Pressable onPress={() => setShowModelSelector(false)} style={{ flex: 1 }}>
                <View />
              </Pressable>
              <Card
                padding="$4"
                borderRadius="$6"
                backgroundColor="$cardBg"
                marginBottom="$4"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                  <H3 fontSize="$5" fontWeight="600" color="$text">
                    选择AI模型
                  </H3>
                  <TouchableOpacity onPress={() => setShowModelSelector(false)}>
                    <View
                      width={32}
                      height={32}
                      borderRadius={16}
                      backgroundColor="$surface"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="$textSecondary">×</Text>
                    </View>
                  </TouchableOpacity>
                </XStack>

                <YStack space="$3">
                  {aiModels.map((model) => {
                    const IconComponent = model.icon;
                    const isSelected = selectedModel === model.id;

                    return (
                      <TouchableOpacity
                        key={model.id}
                        onPress={() => {
                          setSelectedModel(model.id);
                          setShowModelSelector(false);
                        }}
                      >
                        <View
                          padding="$4"
                          borderRadius="$4"
                          backgroundColor={isSelected ? COLORS.primaryLight : '$surface'}
                          borderWidth={2}
                          borderColor={isSelected ? COLORS.primary : '$borderColor'}
                        >
                          <XStack space="$3" alignItems="flex-start">
                            <View
                              width={48}
                              height={48}
                              backgroundColor={isSelected ? 'rgba(255,255,255,0.2)' : COLORS.primary}
                              borderRadius={24}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconComponent
                                size={24}
                                color={isSelected ? 'white' : 'white'}
                              />
                            </View>

                            <YStack flex={1} space="$2">
                              <XStack justifyContent="space-between" alignItems="center">
                                <Text
                                  fontSize="$5"
                                  fontWeight="600"
                                  color={isSelected ? 'white' : '$text'}
                                >
                                  {model.name}
                                </Text>
                                <XStack space="$2" alignItems="center">
                                  {model.isRecommended && (
                                    <View
                                      backgroundColor={COLORS.success}
                                      paddingHorizontal="$2"
                                      paddingVertical="$1"
                                      borderRadius="$2"
                                    >
                                      <Text fontSize="$1" color="white" fontWeight="500">
                                        推荐
                                      </Text>
                                    </View>
                                  )}
                                  {model.isPremium && (
                                    <View
                                      backgroundColor={COLORS.warning}
                                      paddingHorizontal="$2"
                                      paddingVertical="$1"
                                      borderRadius="$2"
                                    >
                                      <Text fontSize="$1" color="white" fontWeight="500">
                                        专业版
                                      </Text>
                                    </View>
                                  )}
                                </XStack>
                              </XStack>

                              <Text
                                fontSize="$3"
                                color={isSelected ? 'rgba(255,255,255,0.8)' : '$textSecondary'}
                                lineHeight="$2"
                              >
                                {model.description}
                              </Text>

                              <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                                {model.features.map((feature, index) => (
                                  <View
                                    key={index}
                                    backgroundColor={isSelected ? 'rgba(255,255,255,0.2)' : '$background'}
                                    paddingHorizontal="$2"
                                    paddingVertical="$1"
                                    borderRadius="$2"
                                  >
                                    <Text
                                      fontSize="$2"
                                      color={isSelected ? 'white' : '$textSecondary'}
                                    >
                                      {feature}
                                    </Text>
                                  </View>
                                ))}
                              </XStack>

                              <XStack justifyContent="space-between" marginTop="$2">
                                <Text
                                  fontSize="$2"
                                  color={isSelected ? 'rgba(255,255,255,0.8)' : '$textSecondary'}
                                >
                                  准确率: {model.accuracy}%
                                </Text>
                                <Text
                                  fontSize="$2"
                                  color={isSelected ? 'rgba(255,255,255,0.8)' : '$textSecondary'}
                                >
                                  响应: {model.responseTime}
                                </Text>
                              </XStack>
                            </YStack>
                          </XStack>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </YStack>
              </Card>
            </View>
          )}

          {/* 聊天消息区域 */}
          <ScrollView
            ref={scrollViewRef}
            flex={1}
            padding="$4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <YStack space="$5">
              {messages.map((message) => (
                <XStack
                  key={message.id}
                  justifyContent={message.type === 'user' ? 'flex-end' : 'flex-start'}
                  alignItems="flex-end"
                  space="$2"
                  marginBottom="$2"
                >
                  {message.type === 'ai' && (
                    <View
                      width={32}
                      height={32}
                      backgroundColor={COLORS.primary}
                      borderRadius={16}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Bot size={16} color="white" />
                    </View>
                  )}

                  <View
                    maxWidth="80%"
                    backgroundColor={
                      message.type === 'user' ? COLORS.primary : '$surface'
                    }
                    padding="$3"
                    borderRadius="$4"
                    borderTopLeftRadius={message.type === 'ai' ? '$1' : '$4'}
                    borderTopRightRadius={message.type === 'user' ? '$1' : '$4'}
                  >
                    <Text
                      fontSize="$3"
                      color={message.type === 'user' ? 'white' : '$text'}
                      lineHeight="$2"
                    >
                      {message.content}
                    </Text>
                    <Text
                      fontSize="$1"
                      color={
                        message.type === 'user'
                          ? 'rgba(255,255,255,0.7)'
                          : '$textSecondary'
                      }
                      marginTop="$1"
                    >
                      {message.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>

                  {message.type === 'user' && (
                    <View
                      width={32}
                      height={32}
                      backgroundColor="$surface"
                      borderRadius={16}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <User size={16} color={COLORS.textSecondary} />
                    </View>
                  )}
                </XStack>
              ))}

              {/* AI正在输入提示 */}
              {isTyping && (
                <XStack
                  justifyContent="flex-start"
                  alignItems="flex-end"
                  space="$2"
                >
                  <View
                    width={32}
                    height={32}
                    backgroundColor={COLORS.primary}
                    borderRadius={16}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Bot size={16} color="white" />
                  </View>

                  <View
                    backgroundColor="$surface"
                    padding="$3"
                    borderRadius="$4"
                    borderTopLeftRadius="$1"
                  >
                    <XStack space="$1" alignItems="center">
                      <Text fontSize="$3" color="$textSecondary">
                        AI助手正在思考
                      </Text>
                      <View
                        width={16}
                        height={16}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$3" color={COLORS.primary}>
                          ···
                        </Text>
                      </View>
                    </XStack>
                  </View>
                </XStack>
              )}

              {/* 快捷问题 */}
              {messages.length === 1 && (
                <YStack space="$3" marginTop="$4">
                  <XStack space="$2" alignItems="center">
                    <Sparkles size={16} color={COLORS.primary} />
                    <Text fontSize="$4" fontWeight="500" color="$text">
                      常见问题
                    </Text>
                  </XStack>
                  <YStack space="$2">
                    {quickQuestions.map((question) => {
                      const IconComponent = question.icon;
                      return (
                        <TouchableOpacity
                          key={question.id}
                          onPress={() => handleQuickQuestion(question)}
                        >
                          <Card
                            padding="$3"
                            borderRadius="$4"
                            backgroundColor="$surface"
                            borderWidth={1}
                            borderColor="$borderColor"
                            pressStyle={{ scale: 0.98 }}
                          >
                            <XStack space="$3" alignItems="center">
                              <View
                                width={36}
                                height={36}
                                backgroundColor={COLORS.primaryLight}
                                borderRadius={18}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <IconComponent size={18} color="white" />
                              </View>
                              <YStack flex={1}>
                                <Text fontSize="$3" fontWeight="500" color="$text">
                                  {question.text}
                                </Text>
                                <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                                  {question.category}
                                </Text>
                              </YStack>
                              <View
                                backgroundColor="rgba(200, 85, 240, 0.1)"
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" color={COLORS.primary}>
                                  点击咨询
                                </Text>
                              </View>
                            </XStack>
                          </Card>
                        </TouchableOpacity>
                      );
                    })}
                  </YStack>

                  {/* AI特色功能提示 */}
                  <Card
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="rgba(200, 85, 240, 0.05)"
                    borderWidth={1}
                    borderColor="rgba(200, 85, 240, 0.1)"
                    marginTop="$3"
                  >
                    <XStack space="$3" alignItems="center" marginBottom="$3">
                      <View
                        width={40}
                        height={40}
                        backgroundColor={COLORS.primary}
                        borderRadius={20}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Sparkles size={20} color="white" />
                      </View>
                      <YStack flex={1}>
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          AI智能诊断
                        </Text>
                        <Text fontSize="$3" color="$textSecondary">
                          基于您的健康数据提供个性化建议
                        </Text>
                      </YStack>
                    </XStack>

                    <YStack space="$2">
                      <XStack space="$2" alignItems="center">
                        <CheckCircle size={16} color={COLORS.success} />
                        <Text fontSize="$3" color="$textSecondary">
                          智能症状分析和健康评估
                        </Text>
                      </XStack>
                      <XStack space="$2" alignItems="center">
                        <CheckCircle size={16} color={COLORS.success} />
                        <Text fontSize="$3" color="$textSecondary">
                          个性化健康建议和改善方案
                        </Text>
                      </XStack>
                      <XStack space="$2" alignItems="center">
                        <CheckCircle size={16} color={COLORS.success} />
                        <Text fontSize="$3" color="$textSecondary">
                          24小时在线医疗咨询服务
                        </Text>
                      </XStack>
                    </YStack>
                  </Card>
                </YStack>
              )}

              {/* 底部空白区域 */}
              <View height={20} />
            </YStack>
          </ScrollView>

          {/* 输入区域 */}
          <View
            backgroundColor="$cardBg"
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <XStack space="$3" alignItems="center">
              {/* 附件按钮 */}
              <TouchableOpacity>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="$surface"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Paperclip size={20} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>

              {/* 输入框 */}
              <View
                flex={1}
                backgroundColor="$surface"
                borderRadius="$6"
                borderWidth={1}
                borderColor="$borderColor"
                paddingHorizontal="$3"
                height={40}
                justifyContent="center"
              >
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="请描述您的健康问题..."
                  placeholderTextColor={COLORS.textSecondary}
                  style={styles.textInput}
                  multiline
                  maxLength={500}
                  onSubmitEditing={() => sendMessage(inputText)}
                  blurOnSubmit={false}
                />
              </View>

              {/* 语音/发送按钮 */}
              {inputText.trim() ? (
                <TouchableOpacity onPress={() => sendMessage(inputText)}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={COLORS.primary}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Send size={18} color="white" />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="$surface"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Mic size={20} color={COLORS.textSecondary} />
                  </View>
                </TouchableOpacity>
              )}
            </XStack>
          </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 20,
    height: 40,
    paddingVertical: 8,
  },
});