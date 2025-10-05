import React, { useState, useRef, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
  Button,
} from 'tamagui';
import {
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Mic,
  Paperclip,
  Sparkles,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Zap,
  Star,
  Shield,
  Cpu,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CaregiverSelectCard } from '@/components/CaregiverSelectCard';
import { PackageSelectCard } from '@/components/PackageSelectCard';
import { getCaregiversByServiceType, servicePackages, getCaregiverById, getPackageById } from '@/services/elderlyService';
import type { Caregiver, ServicePackage, ServiceType } from '@/types/elderly';

// 服务类型中文标签映射
const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  'elderly-care': '长者照顾',
  'escort': '陪诊服务',
  'medical-staff': '医护替补',
};

// 资质匹配辅助函数（EN登记护士使用RN的价格）
const getMatchingQualification = (qualification: string): string => {
  if (qualification === 'EN') return 'RN';  // EN使用RN的价格
  return qualification;
};

type AIConsultationScreenRouteProp = RouteProp<{
  AIConsultation: {
    initialMessage?: string;
    source?: 'elderly_service' | 'general'; // 来源标识
    caregiverId?: string;  // 护理人员ID（从详情页进入时传入）
    serviceType?: ServiceType;  // 服务类型（从详情页进入时传入）
    qualification?: 'PCW' | 'HW' | 'RN';  // 资质（从详情页进入时传入）
  }
}, 'AIConsultation'>;

interface QuickReply {
  id: string;
  label: string;
  value: string;
  icon?: any;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  typing?: boolean;
  // Interactive data support
  interactiveType?: 'caregiver_selection' | 'package_selection';
  interactiveData?: {
    caregivers?: Caregiver[];
    packages?: ServicePackage[];
    serviceType?: ServiceType;
  };
  // Quick reply buttons
  quickReplies?: QuickReply[];
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

type ConversationStep =
  | 'initial'
  | 'select_service_type'
  | 'select_qualification'
  | 'select_caregiver'
  | 'select_package'
  | 'select_date'
  | 'select_time'
  | 'confirm_order'
  | 'completed';

interface ConversationState {
  step: ConversationStep;
  serviceType?: ServiceType;
  qualification?: 'PCW' | 'HW' | 'RN';
  caregiverId?: string;
  packageId?: string;
  serviceDate?: string;
  serviceTime?: string;
}

export const AIConsultationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AIConsultationScreenRouteProp>();

  // 根据来源决定初始消息
  const getInitialMessage = (): Message => {
    if (route.params?.source === 'elderly_service') {
      return {
        id: '1',
        type: 'ai',
        content: '您好！我是康养AI助手。我可以帮您预约专业的护理服务。请问您需要哪种服务？',
        timestamp: new Date(),
        quickReplies: [
          { id: 'service_elderly', label: '养老照护', value: 'elderly-care', icon: Heart },
          { id: 'service_escort', label: '陪诊服务', value: 'escort', icon: Activity },
          { id: 'service_medical', label: '医护替补', value: 'medical-staff', icon: Shield },
        ],
      };
    }

    // 通用健康咨询初始消息
    return {
      id: '1',
      type: 'ai',
      content: '您好！我是康养AI助手。我可以为您提供健康咨询、疾病预防、养生建议等服务。请问有什么可以帮助您的吗？',
      timestamp: new Date(),
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('huatuo');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Conversation state management
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'select_service_type'
  });

  // 如果从护理人员详情页进入，直接跳到套餐选择
  useEffect(() => {
    if (route.params?.caregiverId && route.params?.serviceType && route.params?.qualification) {
      const { caregiverId, serviceType, qualification } = route.params;

      // 设置对话状态
      setConversationState({
        step: 'select_package',
        serviceType,
        qualification,
        caregiverId,
      });
      setSelectedCaregiverId(caregiverId);

      // 获取护理人员信息
      const caregiver = getCaregiverById(caregiverId);

      // 添加欢迎消息和套餐选择消息
      const welcomeMessage: Message = {
        id: 'welcome_from_detail',
        type: 'ai',
        content: `您好！您已选择了 ${caregiver?.name}（${qualification}）为您提供服务。现在请选择服务套餐：`,
        timestamp: new Date(),
        interactiveType: 'package_selection',
        interactiveData: {
          packages: servicePackages,
        },
      };

      setMessages([welcomeMessage]);
    }
  }, [route.params?.caregiverId, route.params?.serviceType, route.params?.qualification]);

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

  // 快捷问题模板（用于健康咨询）
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

  // Check if this message's quick replies should still be active
  const isLatestQuickReply = (messageId: string): boolean => {
    const index = messages.findIndex(m => m.id === messageId);
    // Check if there are any user messages after this message
    for (let i = index + 1; i < messages.length; i++) {
      if (messages[i].type === 'user') {
        return false; // Already has user reply
      }
    }
    return true;
  };

  // Handle quick reply button click
  const handleQuickReply = (reply: QuickReply) => {
    // 1. Add user's selection message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: reply.label,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // 2. Determine next step based on conversation state
    setIsTyping(true);

    setTimeout(() => {
      let nextMessage: Message;
      let nextState: Partial<ConversationState> = {};

      switch (conversationState.step) {
        case 'initial':
        case 'select_service_type':
          // User selected service type
          nextState = {
            step: 'select_qualification',
            serviceType: reply.value as ServiceType,
          };
          nextMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: '很好！请问您需要什么资质的护理人员？',
            timestamp: new Date(),
            quickReplies: [
              { id: 'qual_pcw', label: '护理员 (PCW)', value: 'PCW' },
              { id: 'qual_hw', label: '保健员 (HW)', value: 'HW' },
              { id: 'qual_rn', label: '注册护士 (RN)', value: 'RN' },
            ],
          };
          break;

        case 'select_qualification':
          // User selected qualification, show caregivers
          nextState = {
            step: 'select_caregiver',
            qualification: reply.value as 'PCW' | 'HW' | 'RN',
          };

          // Filter caregivers by service type and qualification
          const caregivers = getCaregiversByServiceType(conversationState.serviceType!)
            .filter(c => c.qualificationBadge === reply.value);

          nextMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `为您推荐以下${reply.label}，请选择一位：`,
            timestamp: new Date(),
            interactiveType: 'caregiver_selection',
            interactiveData: {
              caregivers: caregivers,
              serviceType: conversationState.serviceType,
            },
          };
          break;

        case 'select_date':
          // User selected date
          nextState = {
            step: 'select_time',
            serviceDate: reply.value,
          };

          // 根据套餐类型生成不同的时段选项
          const selectedPkg = getPackageById(conversationState.packageId!);
          let timeSlotOptions: QuickReply[] = [];

          if (!selectedPkg) {
            // 如果找不到套餐，使用默认选项
            console.warn('⚠️ Package not found, using default time slots');
            timeSlotOptions = [
              { id: 'time_morning', label: '上午 (8:00-12:00)', value: '08:00-12:00' },
              { id: 'time_afternoon', label: '下午 (14:00-18:00)', value: '14:00-18:00' },
              { id: 'time_fullday', label: '全天 (8:00-18:00)', value: '08:00-18:00' },
            ];
          } else if (selectedPkg.id === 'hourly') {
            // 按小时服务：提供时段选择
            timeSlotOptions = [
              { id: 'time_morning', label: '上午 (8:00-12:00)', value: '08:00-12:00' },
              { id: 'time_afternoon', label: '下午 (14:00-18:00)', value: '14:00-18:00' },
              { id: 'time_evening', label: '晚间 (18:00-22:00)', value: '18:00-22:00' },
            ];
          } else if (selectedPkg.id === 'daily') {
            // 按天服务：8-12小时
            timeSlotOptions = [
              { id: 'time_day8', label: '白天8小时 (8:00-16:00)', value: '08:00-16:00' },
              { id: 'time_day10', label: '白天10小时 (8:00-18:00)', value: '08:00-18:00' },
              { id: 'time_day12', label: '白天12小时 (8:00-20:00)', value: '08:00-20:00' },
            ];
          } else if (selectedPkg.id === '24hour') {
            // 24小时服务：全天候
            timeSlotOptions = [
              { id: 'time_24h', label: '全天24小时 (00:00-24:00)', value: '00:00-24:00' },
            ];
          } else if (selectedPkg.id === 'monthly') {
            // 按月服务：计算服务周期
            const startDate = new Date(reply.value);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            const formatDate = (date: Date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            };

            const servicePeriod = `${formatDate(startDate)} 至 ${formatDate(endDate)}`;

            timeSlotOptions = [
              {
                id: 'time_monthly_day',
                label: `白天服务 (${servicePeriod})`,
                value: `08:00-20:00|${servicePeriod}`
              },
              {
                id: 'time_monthly_24h',
                label: `全天服务 (${servicePeriod})`,
                value: `00:00-24:00|${servicePeriod}`
              },
            ];
          } else {
            // 未知套餐类型
            console.warn('⚠️ Unknown package type:', selectedPkg.id);
            timeSlotOptions = [
              { id: 'time_morning', label: '上午 (8:00-12:00)', value: '08:00-12:00' },
              { id: 'time_afternoon', label: '下午 (14:00-18:00)', value: '14:00-18:00' },
              { id: 'time_fullday', label: '全天 (8:00-18:00)', value: '08:00-18:00' },
            ];
          }

          nextMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: selectedPkg?.id === 'monthly'
              ? '请选择每日服务时段（服务周期一个月）：'
              : '请选择服务时段：',
            timestamp: new Date(),
            quickReplies: timeSlotOptions,
          };
          break;

        case 'select_time':
          // User selected time, show confirmation
          nextState = {
            step: 'confirm_order',
            serviceTime: reply.value,
          };

          const caregiver = getCaregiverById(conversationState.caregiverId!);
          const pkg = getPackageById(conversationState.packageId!);

          // 处理包月服务的显示
          let serviceDateDisplay = conversationState.serviceDate;
          let serviceTimeDisplay = reply.value;

          if (pkg?.id === 'monthly' && reply.value.includes('|')) {
            // 包月服务格式: "08:00-20:00|2025-10-05 至 2025-11-05"
            const [timeRange, period] = reply.value.split('|');
            serviceTimeDisplay = timeRange === '00:00-24:00' ? '24小时全天' : '白天时段 (8:00-20:00)';
            serviceDateDisplay = period; // "2025-10-05 至 2025-11-05"
          }

          // 获取匹配的价格（处理EN->RN的映射）
          const matchingQualification = getMatchingQualification(caregiver?.qualificationBadge || '');
          const priceInfo = pkg?.prices.find(p => p.type === matchingQualification);
          const orderPrice = priceInfo?.price || 0;

          nextMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `📋 **订单确认**\n\n👤 护理人员：${caregiver?.name} (${caregiver?.qualificationBadge})\n📦 服务套餐：${pkg?.name}\n📅 服务${pkg?.id === 'monthly' ? '周期' : '日期'}：${serviceDateDisplay}\n⏰ 每日时段：${serviceTimeDisplay}\n💰 费用：¥${orderPrice}\n\n请确认订单信息`,
            timestamp: new Date(),
            quickReplies: [
              { id: 'confirm_yes', label: '✅ 确认下单', value: 'confirm' },
              { id: 'confirm_no', label: '↩️ 重新选择', value: 'restart' },
            ],
          };
          break;

        case 'confirm_order':
          if (reply.value === 'confirm') {
            // Navigate to Checkout
            const caregiver = getCaregiverById(conversationState.caregiverId!);
            const pkg = getPackageById(conversationState.packageId!);

            // 构建详细的订单名称：养老服务-长者照顾-包月服务-张桂芳（PCW）
            const serviceTypeLabel = conversationState.serviceType ? SERVICE_TYPE_LABELS[conversationState.serviceType] : '';
            const itemName = `养老服务-${serviceTypeLabel}-${pkg?.name}-${caregiver?.name}（${caregiver?.qualificationBadge}）`;

            // 获取匹配的价格（处理EN->RN的映射）
            const matchingQual = getMatchingQualification(caregiver?.qualificationBadge || '');
            const price = pkg?.prices.find(p => p.type === matchingQual)?.price || 0;

            (navigation as any).navigate('Checkout', {
              itemType: 'elderly_service',
              caregiverId: conversationState.caregiverId,
              packageId: conversationState.packageId,
              elderlyServiceType: conversationState.serviceType,
              itemId: conversationState.packageId,
              itemName,
              price,
              // 传递服务日期和时间
              serviceDate: conversationState.serviceDate,
              serviceTime: conversationState.serviceTime,
            });
            return;
          } else {
            // Restart conversation
            nextState = {
              step: 'select_service_type',
              serviceType: undefined,
              qualification: undefined,
              caregiverId: undefined,
              packageId: undefined,
              serviceDate: undefined,
              serviceTime: undefined,
            };
            setSelectedCaregiverId(null);
            setSelectedPackageId(null);

            nextMessage = {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: '好的，让我们重新开始。请问您需要哪种服务？',
              timestamp: new Date(),
              quickReplies: [
                { id: 'service_elderly', label: '养老照护', value: 'elderly-care', icon: Heart },
                { id: 'service_escort', label: '陪诊服务', value: 'escort', icon: Activity },
                { id: 'service_medical', label: '医护替补', value: 'medical-staff', icon: Shield },
              ],
            };
          }
          break;

        default:
          nextMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: '抱歉，出现了一些问题。让我们重新开始吧。',
            timestamp: new Date(),
            quickReplies: [
              { id: 'service_elderly', label: '养老照护', value: 'elderly-care', icon: Heart },
              { id: 'service_escort', label: '陪诊服务', value: 'escort', icon: Activity },
              { id: 'service_medical', label: '医护替补', value: 'medical-staff', icon: Shield },
            ],
          };
          nextState = { step: 'select_service_type' };
      }

      setConversationState(prev => ({ ...prev, ...nextState }));
      setMessages(prev => [...prev, nextMessage]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  // Handle caregiver selection
  const handleCaregiverSelect = (caregiverId: string) => {
    setSelectedCaregiverId(caregiverId);

    // Update conversation state
    setConversationState(prev => ({
      ...prev,
      step: 'select_package',
      caregiverId,
    }));

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `很好！现在请选择服务套餐：`,
        timestamp: new Date(),
        interactiveType: 'package_selection',
        interactiveData: {
          packages: servicePackages,
        },
      };

      setMessages(prev => [...prev, aiMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  // Handle package selection
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);

    // Update conversation state
    setConversationState(prev => ({
      ...prev,
      step: 'select_date',
      packageId,
    }));

    setTimeout(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '请选择服务开始日期：',
        timestamp: new Date(),
        quickReplies: [
          { id: 'date_today', label: `今天 (${formatDate(today)})`, value: formatDate(today) },
          { id: 'date_tomorrow', label: `明天 (${formatDate(tomorrow)})`, value: formatDate(tomorrow) },
          { id: 'date_after', label: `后天 (${formatDate(dayAfter)})`, value: formatDate(dayAfter) },
        ],
      };

      setMessages(prev => [...prev, aiMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  // 发送消息（保留用于健康咨询等传统对话）
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

  // 处理初始消息自动发送 - 已禁用，改用按钮引导流程
  // useEffect(() => {
  //   const initialMessage = route.params?.initialMessage;
  //   if (initialMessage && !initialMessageSent) {
  //     setInitialMessageSent(true);
  //     setTimeout(() => {
  //       sendMessage(initialMessage);
  //     }, 1000);
  //   }
  // }, [route.params?.initialMessage, initialMessageSent]);

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

                  <YStack maxWidth="80%" space="$2">
                    <View
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

                    {/* Quick reply buttons */}
                    {message.type === 'ai' && message.quickReplies && isLatestQuickReply(message.id) && (
                      <>
                        {/* 如果是第一条欢迎消息（服务类型选择），使用卡片样式 */}
                        {message.id === '1' ? (
                          <YStack gap="$2" paddingTop="$3" width="100%">
                            {message.quickReplies.map((reply) => {
                              const IconComponent = reply.icon;
                              return (
                                <Pressable key={reply.id} onPress={() => handleQuickReply(reply)}>
                                  <View
                                    backgroundColor="$surface"
                                    padding="$3"
                                    borderRadius="$4"
                                    borderWidth={1}
                                    borderColor="$borderColor"
                                  >
                                    <XStack alignItems="center" gap="$3">
                                      {/* 图标 */}
                                      <View
                                        width={36}
                                        height={36}
                                        backgroundColor={COLORS.primaryLight}
                                        borderRadius={18}
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        {IconComponent && <IconComponent size={18} color="white" />}
                                      </View>

                                      {/* 文本内容 */}
                                      <YStack flex={1}>
                                        <Text fontSize="$3" fontWeight="500" color="$text">
                                          {reply.label}
                                        </Text>
                                      </YStack>

                                      {/* 右侧提示 */}
                                      <View
                                        backgroundColor="rgba(200, 85, 240, 0.1)"
                                        paddingHorizontal="$2"
                                        paddingVertical="$1"
                                        borderRadius="$2"
                                      >
                                        <Text fontSize="$1" color={COLORS.primary}>
                                          点击选择
                                        </Text>
                                      </View>
                                    </XStack>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </YStack>
                        ) : (
                          // 其他消息使用小按钮样式
                          <XStack flexWrap="wrap" gap="$2" paddingTop="$2" maxWidth="100%">
                            {message.quickReplies.map((reply) => (
                              <Pressable key={reply.id} onPress={() => handleQuickReply(reply)}>
                                <View
                                  backgroundColor={COLORS.primary}
                                  paddingHorizontal="$3"
                                  paddingVertical="$2"
                                  borderRadius="$4"
                                  borderWidth={1}
                                  borderColor={COLORS.primary}
                                >
                                  <Text fontSize="$3" color="white" fontWeight="600">
                                    {reply.label}
                                  </Text>
                                </View>
                              </Pressable>
                            ))}
                          </XStack>
                        )}
                      </>
                    )}

                    {/* 交互式护理人员选择卡片 */}
                    {message.type === 'ai' && message.interactiveType === 'caregiver_selection' && message.interactiveData?.caregivers && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                      >
                        <XStack space="$3" paddingVertical="$2">
                          {message.interactiveData.caregivers.slice(0, 6).map((caregiver) => (
                            <View key={caregiver.id} width={280}>
                              <CaregiverSelectCard
                                caregiver={caregiver}
                                isSelected={selectedCaregiverId === caregiver.id}
                                onSelect={handleCaregiverSelect}
                              />
                            </View>
                          ))}
                        </XStack>
                      </ScrollView>
                    )}

                    {/* 交互式套餐选择卡片 */}
                    {message.type === 'ai' && message.interactiveType === 'package_selection' && message.interactiveData?.packages && (
                      <YStack space="$3" paddingVertical="$2" width="100%">
                        {message.interactiveData.packages.map((pkg) => {
                          // 根据已选择的护理员获取资质类型
                          const caregiver = conversationState.caregiverId
                            ? getCaregiverById(conversationState.caregiverId)
                            : null;
                          const qualificationType = caregiver?.qualificationBadge as 'PCW' | 'HW' | 'RN' || 'PCW';

                          return (
                            <PackageSelectCard
                              key={pkg.id}
                              package={pkg}
                              isSelected={selectedPackageId === pkg.id}
                              onSelect={handlePackageSelect}
                              qualificationType={qualificationType}
                            />
                          );
                        })}
                      </YStack>
                    )}
                  </YStack>

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

              {/* 快捷问题 - 仅在非养老服务来源时显示 */}
              {messages.length === 1 && route.params?.source !== 'elderly_service' && (
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
                          <Card
                            key={question.id}
                            padding="$3"
                            borderRadius="$4"
                            backgroundColor="$surface"
                            borderWidth={1}
                            borderColor="$borderColor"
                            pressStyle={{ scale: 0.98 }}
                            onPress={() => handleQuickQuestion(question)}
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
