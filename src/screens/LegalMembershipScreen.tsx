import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, StatusBar } from 'react-native';
import { YStack, XStack, Text, Card, View, ScrollView, Button, H3, Theme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Trophy,
  ShoppingCart,
  Library,
  FileText,
  MessageSquare,
  Search,
  Activity,
  CheckCircle2,
  Shield,
  Zap,
  Users,
  Briefcase,
  Home,
  Phone,
  Calendar,
  Eye,
  Award,
  Edit3,
  HeartPulse,
  Crown,
  Check,
  Info,
  AlertCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/app';

const { width } = Dimensions.get('window');

/**
 * Phase 37: 法律尊享计划服务体系 - Legal Membership Screen
 *
 * Features:
 * - Membership tier definition (Basic/Standard/Premium/VIP Family)
 * - Current membership display
 * - Benefits list and usage quota
 * - Membership expiration and renewal reminder
 * - Upgrade membership
 * - Purchase and renewal process
 * - Value-added services (will witnessing, notarization, forensic, document drafting)
 */

// ==================== Type Definitions ====================

type MembershipTier = 'basic' | 'standard' | 'premium' | 'vip_family';

interface MembershipPlan {
  id: MembershipTier;
  name: string;
  price: number;
  yearlyPrice: number;
  color: string;
  icon: string;
  tagline: string;
  benefits: MembershipBenefit[];
  quota: ServiceQuota;
  features: string[];
  recommended?: boolean;
}

interface MembershipBenefit {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

interface ServiceQuota {
  willCreation: number | '∞';
  lawyerConsultation: number | '∞';
  contractReview: number | '∞';
  documentTemplates: number | '∞';
  legalCheckup: number | '∞';
  caseAnalysis: number | '∞';
  videoAccess: boolean;
  articleAccess: boolean;
  prioritySupport: boolean;
  familyMembers: number;
}

interface UserMembership {
  tier: MembershipTier;
  expiresAt: string;
  purchasedAt: string;
  autoRenew: boolean;
  usedQuota: {
    willCreation: number;
    lawyerConsultation: number;
    contractReview: number;
    documentTemplates: number;
    legalCheckup: number;
    caseAnalysis: number;
  };
}

interface ValueAddedService {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  color: string;
  features: string[];
  popular?: boolean;
}

// ==================== Mock Data ====================

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'basic',
    name: '基础版',
    price: 0,
    yearlyPrice: 0,
    color: COLORS.textSecondary,
    icon: 'users',
    tagline: '免费体验基础法律服务',
    benefits: [
      { id: 'b1', name: '法律知识库访问', description: '浏览法律文章、视频课程、案例库', icon: 'library', available: true },
      { id: 'b2', name: '文书模板下载', description: '每月限3个模板', icon: 'fileText', available: true },
      { id: 'b3', name: '在线法律体检', description: '每年1次免费体检', icon: 'activity', available: true },
      { id: 'b4', name: '律师咨询', description: '不可用', icon: 'messageSquare', available: false },
      { id: 'b5', name: '遗嘱制作', description: '不可用', icon: 'fileText', available: false },
    ],
    quota: {
      willCreation: 0,
      lawyerConsultation: 0,
      contractReview: 0,
      documentTemplates: 3,
      legalCheckup: 1,
      caseAnalysis: 0,
      videoAccess: true,
      articleAccess: true,
      prioritySupport: false,
      familyMembers: 1,
    },
    features: ['法律知识库全开放', '每月3个文书模板', '每年1次法律体检', '社区问答参与'],
  },
  {
    id: 'standard',
    name: '标准版',
    price: 1980,
    yearlyPrice: 1980,
    color: COLORS.primary,
    icon: 'award',
    tagline: '专业法律服务，守护您的权益',
    benefits: [
      { id: 'b1', name: '遗嘱制作', description: '全年3份遗嘱制作', icon: 'fileText', available: true },
      { id: 'b2', name: '律师咨询', description: '全年300分钟电话/在线咨询', icon: 'messageSquare', available: true },
      { id: 'b3', name: '合同审查', description: '全年5次AI+人工审查', icon: 'search', available: true },
      { id: 'b4', name: '文书模板', description: '无限下载所有模板', icon: 'fileText', available: true },
      { id: 'b5', name: '法律体检', description: '每季度1次专业体检', icon: 'activity', available: true },
    ],
    quota: {
      willCreation: 3,
      lawyerConsultation: 300,
      contractReview: 5,
      documentTemplates: '∞',
      legalCheckup: 4,
      caseAnalysis: 10,
      videoAccess: true,
      articleAccess: true,
      prioritySupport: false,
      familyMembers: 1,
    },
    features: ['全年3份遗嘱制作', '300分钟律师咨询', '5次合同审查服务', '无限文书模板下载', '每季度法律体检', '10次案例深度分析'],
    recommended: true,
  },
  {
    id: 'premium',
    name: '尊享版',
    price: 4980,
    yearlyPrice: 4980,
    color: COLORS.warning,
    icon: 'crown',
    tagline: '尊享VIP服务，全方位法律保障',
    benefits: [
      { id: 'b1', name: '遗嘱制作', description: '全年不限次数', icon: 'fileText', available: true },
      { id: 'b2', name: '律师咨询', description: '全年1000分钟专属律师', icon: 'messageSquare', available: true },
      { id: 'b3', name: '合同审查', description: '全年20次人工精审', icon: 'search', available: true },
      { id: 'b4', name: '意定监护协议', description: '免费制作1份', icon: 'shield', available: true },
      { id: 'b5', name: '优先服务', description: '专属客服，优先响应', icon: 'zap', available: true },
    ],
    quota: {
      willCreation: '∞',
      lawyerConsultation: 1000,
      contractReview: 20,
      documentTemplates: '∞',
      legalCheckup: '∞',
      caseAnalysis: '∞',
      videoAccess: true,
      articleAccess: true,
      prioritySupport: true,
      familyMembers: 2,
    },
    features: ['不限次数遗嘱制作', '1000分钟专属律师', '20次合同人工精审', '免费意定监护协议', '无限法律体检', '优先客服支持', '可添加1位家庭成员', '赠送遗嘱见证服务1次'],
  },
  {
    id: 'vip_family',
    name: 'VIP家庭版',
    price: 9800,
    yearlyPrice: 9800,
    color: '#722ed1',
    icon: 'users',
    tagline: '全家法律保障，安心养老无忧',
    benefits: [
      { id: 'b1', name: '全家覆盖', description: '最多5位家庭成员', icon: 'users', available: true },
      { id: 'b2', name: '专属律师', description: '指定律师团队服务', icon: 'briefcase', available: true },
      { id: 'b3', name: '上门服务', description: '全年2次上门咨询', icon: 'home', available: true },
      { id: 'b4', name: '紧急法律援助', description: '24小时应急响应', icon: 'phone', available: true },
      { id: 'b5', name: '年度法律规划', description: '家庭法律事务全面规划', icon: 'calendar', available: true },
    ],
    quota: {
      willCreation: '∞',
      lawyerConsultation: '∞',
      contractReview: '∞',
      documentTemplates: '∞',
      legalCheckup: '∞',
      caseAnalysis: '∞',
      videoAccess: true,
      articleAccess: true,
      prioritySupport: true,
      familyMembers: 5,
    },
    features: ['覆盖5位家庭成员', '无限律师咨询', '无限合同审查', '专属律师团队', '全年2次上门服务', '24小时紧急援助', '年度家庭法律规划', '赠送公证预约服务', '赠送遗嘱见证服务2次'],
  },
];

const VALUE_ADDED_SERVICES: ValueAddedService[] = [
  {
    id: 'will_witness',
    name: '遗嘱见证服务',
    description: '专业律师上门见证遗嘱订立，确保遗嘱合法有效',
    price: 500,
    icon: 'eye',
    color: COLORS.primary,
    features: ['专业律师上门服务', '全程见证遗嘱订立', '出具律师见证书', '提供法律咨询', '遗嘱保管建议'],
    popular: true,
  },
  {
    id: 'notarization',
    name: '公证预约服务',
    description: '协助预约公证处，办理遗嘱公证、意定监护公证等',
    price: 300,
    icon: 'award',
    color: COLORS.success,
    features: ['公证处预约', '材料清单指导', '陪同办理服务', '公证流程咨询'],
  },
  {
    id: 'forensic_handwriting',
    name: '笔迹鉴定服务',
    description: '司法鉴定机构对遗嘱、借条等文件进行笔迹鉴定',
    price: 2000,
    icon: 'edit3',
    color: '#722ed1',
    features: ['司法鉴定机构', '笔迹真伪鉴定', '出具鉴定报告', '法庭证据效力'],
  },
  {
    id: 'forensic_medical',
    name: '医疗伤残鉴定',
    description: '医疗纠纷、人身损害赔偿的医疗和伤残鉴定',
    price: 1500,
    icon: 'heartPulse',
    color: '#eb2f96',
    features: ['专业医疗鉴定', '伤残等级评定', '医疗过错鉴定', '司法鉴定报告'],
  },
  {
    id: 'document_drafting',
    name: '法律文书代写',
    description: '专业律师代为起草各类法律文书（起诉状、答辩状等）',
    price: 500,
    icon: 'fileText',
    color: '#13c2c2',
    features: ['律师专业起草', '符合法律规范', '3日内交付', '免费修改1次'],
  },
  {
    id: 'litigation_representation',
    name: '诉讼代理服务',
    description: '律师代理诉讼案件，全程法律支持（费用另议）',
    price: 3000,
    icon: 'briefcase',
    color: COLORS.warning,
    features: ['律师代理出庭', '证据收集指导', '诉讼策略制定', '全程法律支持', '（起步价，复杂案件费用面议）'],
  },
];

// ==================== Helper Functions ====================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

const calculateDaysUntilExpiration = (expiresAt: string): number => {
  const expireDate = new Date(expiresAt);
  const today = new Date();
  const diffTime = expireDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatQuota = (value: number | '∞'): string => {
  return value === '∞' ? '不限' : value.toString();
};

// ==================== Icon Mapping ====================

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    users: Users,
    award: Award,
    crown: Crown,
    library: Library,
    fileText: FileText,
    activity: Activity,
    messageSquare: MessageSquare,
    search: Search,
    shield: Shield,
    zap: Zap,
    briefcase: Briefcase,
    home: Home,
    phone: Phone,
    calendar: Calendar,
    eye: Eye,
    edit3: Edit3,
    heartPulse: HeartPulse,
    checkCircle: CheckCircle2,
    trophy: Trophy,
    shoppingCart: ShoppingCart,
    info: Info,
  };
  return iconMap[iconName] || FileText;
};

// ==================== Main Component ====================

const LegalMembershipScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [selectedTab, setSelectedTab] = useState<MembershipTier>('basic');
  const [loading, setLoading] = useState(false);

  // ==================== Data Loading ====================

  useFocusEffect(
    React.useCallback(() => {
      console.log('LegalMembershipScreen focused - refreshing membership data');
      loadUserMembership();
    }, [])
  );

  const loadUserMembership = async () => {
    try {
      const membershipData = await AsyncStorage.getItem('user_membership');
      if (membershipData) {
        setUserMembership(JSON.parse(membershipData));
      } else {
        const basicMembership: UserMembership = {
          tier: 'basic',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          purchasedAt: new Date().toISOString(),
          autoRenew: false,
          usedQuota: {
            willCreation: 0,
            lawyerConsultation: 0,
            contractReview: 0,
            documentTemplates: 1,
            legalCheckup: 0,
            caseAnalysis: 0,
          },
        };
        setUserMembership(basicMembership);
        await AsyncStorage.setItem('user_membership', JSON.stringify(basicMembership));
      }
    } catch (error) {
      console.error('Failed to load membership:', error);
    }
  };

  const saveUserMembership = async (membership: UserMembership) => {
    try {
      console.log('💾 LegalMembershipScreen - 保存会员数据:', membership);
      console.log('🎯 保存的会员等级:', membership.tier);
      await AsyncStorage.setItem('user_membership', JSON.stringify(membership));
      setUserMembership(membership);
      console.log('✅ LegalMembershipScreen - 会员数据保存成功');

      // 验证保存
      const saved = await AsyncStorage.getItem('user_membership');
      console.log('🔍 验证保存的数据:', saved);
    } catch (error) {
      console.error('❌ Failed to save membership:', error);
    }
  };

  // ==================== Membership Operations ====================

  const handleUpgrade = async (plan: MembershipPlan) => {
    if (!userMembership) return;

    if (plan.id === userMembership.tier) {
      Alert.alert('提示', '您已是该等级用户');
      return;
    }

    Alert.alert(
      '开通尊享计划',
      `确认开通${plan.name}吗？\n\n价格：¥${plan.price}/年\n有效期：12个月`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认开通',
          onPress: async () => {
            setLoading(true);

            // 模拟支付流程
            setTimeout(async () => {
              const newMembership: UserMembership = {
                tier: plan.id,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                purchasedAt: new Date().toISOString(),
                autoRenew: false,
                usedQuota: {
                  willCreation: 0,
                  lawyerConsultation: 0,
                  contractReview: 0,
                  documentTemplates: 0,
                  legalCheckup: 0,
                  caseAnalysis: 0,
                },
              };

              await saveUserMembership(newMembership);
              setSelectedTab(plan.id);
              setLoading(false);

              Alert.alert(
                '开通成功',
                `恭喜您成为${plan.name}用户！\n有效期至${formatDate(newMembership.expiresAt)}`
              );
            }, 1500);
          },
        },
      ]
    );
  };

  const handleToggleAutoRenew = async () => {
    if (!userMembership) return;

    const updated: UserMembership = {
      ...userMembership,
      autoRenew: !userMembership.autoRenew,
    };

    await saveUserMembership(updated);
    Alert.alert('提示', updated.autoRenew ? '已开启自动续费' : '已关闭自动续费');
  };

  const handlePurchase = () => {
    if (!selectedPlanData) return;

    // Skip checkout for basic (free) plan
    if (selectedPlanData.price === 0) {
      handleUpgrade(selectedPlanData);
      return;
    }

    // Navigate to checkout screen with membership plan details
    navigation.navigate('Checkout', {
      itemType: 'legal_membership',
      itemId: selectedPlanData.id,
      itemName: selectedPlanData.name,
      price: selectedPlanData.price,
      metadata: {
        tier: selectedPlanData.id,
        tagline: selectedPlanData.tagline,
        features: selectedPlanData.features,
        quota: selectedPlanData.quota,
        color: selectedPlanData.color,
        icon: selectedPlanData.icon,
      },
    });
  };

  const handlePurchaseService = (service: ValueAddedService) => {
    navigation.navigate('Checkout', {
      itemType: 'service',
      itemId: service.id,
      itemName: service.name,
      price: service.price,
      metadata: {
        description: service.description,
        features: service.features,
        color: service.color,
        icon: service.icon,
      },
    });
  };

  // ==================== Render Methods ====================

  const renderQuotaProgress = (label: string, used: number, total: number | '∞', unit: string = '次') => {
    const isUnlimited = total === '∞';
    const percentage = isUnlimited ? 0 : (used / (total as number)) * 100;

    return (
      <YStack marginBottom="$4">
        <XStack justifyContent="space-between" marginBottom="$2">
          <Text fontSize="$4" color={COLORS.textSecondary}>
            {label}
          </Text>
          <Text fontSize="$4" fontWeight="500" color={COLORS.text}>
            {isUnlimited ? `已用${used}${unit}` : `${used}/${total}${unit}`}
          </Text>
        </XStack>
        {!isUnlimited && (
          <View height={6} backgroundColor={COLORS.surface} borderRadius={3} overflow="hidden">
            <View height="100%" width={`${Math.min(percentage, 100)}%`} backgroundColor={COLORS.primary} borderRadius={3} />
          </View>
        )}
      </YStack>
    );
  };

  const renderBenefitItem = (benefit: MembershipBenefit) => {
    const IconComponent = getIconComponent(benefit.icon);
    return (
      <XStack key={benefit.id} alignItems="center" paddingVertical="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
        <View
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={benefit.available ? `${COLORS.primary}15` : COLORS.surface}
          alignItems="center"
          justifyContent="center"
        >
          <IconComponent size={20} color={benefit.available ? COLORS.primary : COLORS.textSecondary} />
        </View>
        <YStack flex={1} marginLeft="$3">
          <Text fontSize="$4" fontWeight="500" color={benefit.available ? COLORS.text : COLORS.textSecondary} marginBottom="$1">
            {benefit.name}
          </Text>
          <Text fontSize="$3" color={benefit.available ? COLORS.textSecondary : COLORS.textSecondary}>
            {benefit.description}
          </Text>
        </YStack>
        {benefit.available && <CheckCircle2 size={20} color={COLORS.success} />}
      </XStack>
    );
  };

  const renderPlanCard = (plan: MembershipPlan, isCurrentPlan: boolean) => {
    const IconComponent = getIconComponent(plan.icon);
    return (
      <Card
        key={plan.id}
        padding="$5"
        borderRadius="$4"
        marginRight="$4"
        width={width - 80}
        borderWidth={2}
        borderColor={plan.recommended ? COLORS.primary : isCurrentPlan ? COLORS.success : COLORS.border}
        backgroundColor="$cardBg"
        position="relative"
      >
        {plan.recommended && (
          <View position="absolute" top={-1} right={20} backgroundColor={COLORS.primary} paddingHorizontal="$3" paddingVertical="$1" borderBottomLeftRadius="$2" borderBottomRightRadius="$2">
            <Text fontSize="$2" color="white" fontWeight="600">推荐</Text>
          </View>
        )}
        {isCurrentPlan && (
          <View position="absolute" top={-1} right={20} backgroundColor={COLORS.success} paddingHorizontal="$3" paddingVertical="$1" borderBottomLeftRadius="$2" borderBottomRightRadius="$2">
            <Text fontSize="$2" color="white" fontWeight="600">当前</Text>
          </View>
        )}

        <View width={60} height={60} borderRadius={30} backgroundColor={`${plan.color}20`} alignItems="center" justifyContent="center" marginBottom="$4">
          <IconComponent size={32} color={plan.color} />
        </View>

        <Text fontSize="$7" fontWeight="bold" color={COLORS.text} marginBottom="$2">{plan.name}</Text>
        <Text fontSize="$3" color={COLORS.textSecondary} marginBottom="$4">{plan.tagline}</Text>

        <XStack alignItems="baseline" marginBottom="$5">
          {plan.price === 0 ? (
            <Text fontSize="$9" fontWeight="bold" color={COLORS.text}>免费</Text>
          ) : (
            <>
              <Text fontSize="$6" fontWeight="600" color={COLORS.text}>¥</Text>
              <Text fontSize="$9" fontWeight="bold" color={COLORS.text}>{plan.price}</Text>
              <Text fontSize="$4" color={COLORS.textSecondary} marginLeft="$1">/年</Text>
            </>
          )}
        </XStack>

        <YStack marginBottom="$5">
          {plan.features.map((feature, index) => (
            <XStack key={index} alignItems="center" marginBottom="$2">
              <Check size={16} color={plan.color} />
              <Text fontSize="$3" color={COLORS.textSecondary} marginLeft="$2">{feature}</Text>
            </XStack>
          ))}
        </YStack>

        <Button
          backgroundColor={isCurrentPlan ? COLORS.border : plan.color}
          paddingVertical="$3.5"
          borderRadius="$2"
          disabled={isCurrentPlan}
          opacity={isCurrentPlan ? 0.6 : 1}
          onPress={() => !isCurrentPlan && handleUpgrade(plan)}
          pressStyle={{ scale: 0.98 }}
        >
          <Text fontSize="$5" fontWeight="600" color="white">
            {isCurrentPlan ? '当前套餐' : plan.price === 0 ? '免费使用' : '立即升级'}
          </Text>
        </Button>
      </Card>
    );
  };

  const renderValueAddedServiceCard = (service: ValueAddedService) => {
    const IconComponent = getIconComponent(service.icon);
    return (
      <Card
        key={service.id}
        padding="$4"
        borderRadius="$4"
        marginBottom="$3"
        backgroundColor="$cardBg"
        position="relative"
        borderWidth={1}
        borderColor={service.popular ? service.color : COLORS.border}
      >
        {service.popular && (
          <View
            position="absolute"
            top={-1}
            right={16}
            backgroundColor={COLORS.error}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderBottomLeftRadius="$2"
            borderBottomRightRadius="$2"
          >
            <Text fontSize="$2" color="white" fontWeight="600">热门</Text>
          </View>
        )}

        <XStack alignItems="center" marginBottom="$3">
          <View
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor={`${service.color}20`}
            alignItems="center"
            justifyContent="center"
          >
            <IconComponent size={28} color={service.color} />
          </View>

          <YStack flex={1} marginLeft="$3">
            <Text fontSize="$5" fontWeight="bold" color={COLORS.text}>
              {service.name}
            </Text>
            <XStack alignItems="baseline" marginTop="$1">
              <Text fontSize="$3" fontWeight="600" color={service.color}>¥</Text>
              <Text fontSize="$6" fontWeight="bold" color={service.color}>{service.price}</Text>
              <Text fontSize="$3" color={COLORS.textSecondary} marginLeft="$1">起</Text>
            </XStack>
          </YStack>
        </XStack>

        <Text fontSize="$3" color={COLORS.textSecondary} lineHeight={20} marginBottom="$3">
          {service.description}
        </Text>

        <YStack space="$1.5" marginBottom="$3">
          {service.features.map((feature, index) => (
            <XStack key={index} alignItems="flex-start">
              <Check size={14} color={service.color} style={{ marginTop: 2 }} />
              <Text flex={1} fontSize="$3" color={COLORS.textSecondary} marginLeft="$2">
                {feature}
              </Text>
            </XStack>
          ))}
        </YStack>

        <Button
          backgroundColor={service.color}
          paddingVertical="$3"
          borderRadius="$3"
          onPress={() => handlePurchaseService(service)}
          pressStyle={{ scale: 0.98 }}
        >
          <Text fontSize="$4" fontWeight="600" color="white">立即购买</Text>
        </Button>
      </Card>
    );
  };

  // ==================== Main Render ====================

  if (!userMembership) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View flex={1} justifyContent="center" alignItems="center">
            <Text fontSize="$4" color="$textSecondary">加载中...</Text>
          </View>
        </SafeAreaView>
      </Theme>
    );
  }

  const currentPlan = MEMBERSHIP_PLANS.find(p => p.id === userMembership.tier);
  const selectedPlanData = MEMBERSHIP_PLANS.find(p => p.id === selectedTab);

  if (!currentPlan || !selectedPlanData) return null;

  const daysUntilExpiration = calculateDaysUntilExpiration(userMembership.expiresAt);
  const isExpiringSoon = daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  const isExpired = daysUntilExpiration <= 0;
  const isCurrentPlan = selectedTab === userMembership.tier;

  const IconComponent = getIconComponent(selectedPlanData.icon);

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          paddingHorizontal="$4"
          backgroundColor="white"
          borderBottomWidth={1}
          borderBottomColor={COLORS.border}
        >
          <Button
            chromeless
            padding="$1"
            onPress={() => navigation.goBack()}
            pressStyle={{ opacity: 0.6 }}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </Button>
          <Text fontSize="$5" fontWeight="600" color={COLORS.text} marginLeft="$3">
            法律尊享计划
          </Text>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* Tab Bar */}
          <View paddingHorizontal="$4" paddingTop="$4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {MEMBERSHIP_PLANS.map((plan) => {
                const isSelected = plan.id === selectedTab;
                return (
                  <Button
                    key={plan.id}
                    onPress={() => setSelectedTab(plan.id)}
                    backgroundColor={isSelected ? COLORS.primary : '$surface'}
                    borderWidth={1}
                    borderColor={isSelected ? COLORS.primary : COLORS.border}
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    borderRadius="$10"
                    pressStyle={{ scale: 0.98 }}
                  >
                    <Text
                      fontSize="$3"
                      fontWeight={isSelected ? '600' : '400'}
                      color={isSelected ? 'white' : COLORS.text}
                    >
                      {plan.name}
                    </Text>
                  </Button>
                );
              })}
            </ScrollView>
          </View>

          {/* Selected Plan Details */}
          <View paddingHorizontal="$4" paddingTop="$4">
            {/* Plan Card */}
            <Card
              backgroundColor="$cardBg"
              borderRadius="$4"
              padding="$4"
              borderWidth={2}
              borderColor={isCurrentPlan ? COLORS.success : selectedPlanData.color}
              position="relative"
            >
              {isCurrentPlan && (
                <View
                  position="absolute"
                  top={-1}
                  right={16}
                  backgroundColor={COLORS.success}
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderBottomLeftRadius="$2"
                  borderBottomRightRadius="$2"
                >
                  <Text fontSize="$2" color="white" fontWeight="600">当前计划</Text>
                </View>
              )}

              <XStack alignItems="center" marginBottom="$3">
                <View
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor={`${selectedPlanData.color}20`}
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconComponent size={32} color={selectedPlanData.color} />
                </View>
                <YStack flex={1} marginLeft="$3">
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>
                    {selectedPlanData.name}
                  </Text>
                  <Text fontSize="$3" color={COLORS.textSecondary} marginTop="$1">
                    {selectedPlanData.tagline}
                  </Text>
                </YStack>
              </XStack>

              <XStack
                alignItems="baseline"
                marginBottom="$3"
                paddingVertical="$2"
                borderTopWidth={1}
                borderBottomWidth={1}
                borderColor={COLORS.border}
              >
                {selectedPlanData.price === 0 ? (
                  <Text fontSize="$8" fontWeight="bold" color={COLORS.text}>免费</Text>
                ) : (
                  <>
                    <Text fontSize="$5" fontWeight="600" color={COLORS.text}>¥</Text>
                    <Text fontSize="$8" fontWeight="bold" color={COLORS.text}>
                      {selectedPlanData.price}
                    </Text>
                    <Text fontSize="$4" color={COLORS.textSecondary} marginLeft="$1">/年</Text>
                  </>
                )}
              </XStack>

              <YStack space="$2" marginBottom="$3">
                <Text fontSize="$4" fontWeight="600" color={COLORS.text} marginBottom="$2">
                  专享权益
                </Text>
                {selectedPlanData.features.map((feature, index) => (
                  <XStack key={index} alignItems="flex-start">
                    <Check size={16} color={selectedPlanData.color} style={{ marginTop: 2 }} />
                    <Text fontSize="$3" color={COLORS.textSecondary} marginLeft="$2" flex={1}>
                      {feature}
                    </Text>
                  </XStack>
                ))}
              </YStack>

              {!isCurrentPlan && (
                <Button
                  backgroundColor={selectedPlanData.color}
                  paddingVertical="$3"
                  borderRadius="$3"
                  onPress={() => handleUpgrade(selectedPlanData)}
                  disabled={loading}
                  opacity={loading ? 0.6 : 1}
                  pressStyle={{ scale: 0.98 }}
                >
                  <Text fontSize="$5" fontWeight="600" color="white">
                    {loading ? '处理中...' : selectedPlanData.price === 0 ? '使用此计划' : '开通此计划'}
                  </Text>
                </Button>
              )}
            </Card>

            {/* Quota Usage */}
            {isCurrentPlan && userMembership.tier !== 'basic' && (
              <Card backgroundColor="$cardBg" marginTop="$4" borderRadius="$4" padding="$4">
                <Text fontSize="$5" fontWeight="600" color={COLORS.text} marginBottom="$3">
                  服务配额
                </Text>
                <YStack>
                  {renderQuotaProgress('遗嘱制作', userMembership.usedQuota.willCreation, currentPlan.quota.willCreation)}
                  {renderQuotaProgress('律师咨询', userMembership.usedQuota.lawyerConsultation, currentPlan.quota.lawyerConsultation, '分钟')}
                  {renderQuotaProgress('合同审查', userMembership.usedQuota.contractReview, currentPlan.quota.contractReview)}
                  {renderQuotaProgress('法律体检', userMembership.usedQuota.legalCheckup, currentPlan.quota.legalCheckup)}
                </YStack>
              </Card>
            )}
          </View>

          <View height={100} />
        </ScrollView>

        {/* Bottom Floating Purchase Button */}
        {!isCurrentPlan && selectedPlanData.price > 0 && (
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="white"
            paddingHorizontal="$4"
            paddingTop="$3"
            paddingBottom={insets.bottom || 16}
            borderTopWidth={1}
            borderTopColor={COLORS.border}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <XStack alignItems="center" justifyContent="space-between">
              <YStack>
                <Text fontSize="$2" color={COLORS.textSecondary}>
                  {selectedPlanData.name}
                </Text>
                <XStack alignItems="baseline">
                  <Text fontSize="$7" fontWeight="bold" color={COLORS.primary}>
                    ¥{selectedPlanData.price}
                  </Text>
                  <Text fontSize="$3" color={COLORS.textSecondary} marginLeft="$1">
                    /年
                  </Text>
                </XStack>
              </YStack>

              <Button
                backgroundColor={selectedPlanData.color}
                paddingHorizontal="$6"
                paddingVertical="$3"
                borderRadius="$10"
                onPress={handlePurchase}
                disabled={loading}
                opacity={loading ? 0.6 : 1}
                pressStyle={{ scale: 0.98 }}
              >
                <Text fontSize="$5" fontWeight="600" color="white">
                  {loading ? '处理中...' : '立即开通'}
                </Text>
              </Button>
            </XStack>
          </View>
        )}
      </SafeAreaView>
    </Theme>
  );
};

export default LegalMembershipScreen;
