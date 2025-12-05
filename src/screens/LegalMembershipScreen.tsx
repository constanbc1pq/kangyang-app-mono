/**
 * 法律尊享计划服务 - LegalMembershipScreen
 * Phase 37: 法律尊享计划服务体系
 *
 * 功能：
 * - 会员等级展示（基础版/标准版/尊享版/VIP家庭版）
 * - 权益列表和使用额度
 * - 会员到期和续费提醒
 * - 升级会员
 * - 增值服务购买
 */

import React, { useState } from 'react';
import { Alert, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { calculateDiscountedPrice } from '@/services/benefitService';
import { getMembershipDisplayInfo } from '@/services/membershipService';
import { MembershipLevel } from '@/types/membership';
import { LEGAL_MEMBERSHIP_PRICES } from '@/services/legalMembershipService';
import { MembershipTier as LegalTier } from '@/types/legalService';

const { width } = Dimensions.get('window');

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

// ==================== Helper Functions ====================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const calculateDaysUntilExpiration = (expiresAt: string): number => {
  const expireDate = new Date(expiresAt);
  const today = new Date();
  const diffTime = expireDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDiscountedPrice = (originalPrice: number, discountRate: number): number => {
  return Math.round(originalPrice * (1 - discountRate));
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
  };
  return iconMap[iconName] || FileText;
};

// ==================== Main Component ====================

const LegalMembershipScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [selectedTab, setSelectedTab] = useState<MembershipTier>('basic');
  const [loading, setLoading] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{
    membershipLevel: MembershipLevel;
    membershipLabel: string;
    discountRate: number;
  } | null>(null);

  // ==================== Membership Plans ====================

  const MEMBERSHIP_PLANS: MembershipPlan[] = [
    {
      id: 'basic',
      name: '基础版',
      price: LEGAL_MEMBERSHIP_PRICES[LegalTier.BASIC],
      yearlyPrice: LEGAL_MEMBERSHIP_PRICES[LegalTier.BASIC],
      color: color10 || '#666',
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
      price: LEGAL_MEMBERSHIP_PRICES[LegalTier.STANDARD],
      yearlyPrice: LEGAL_MEMBERSHIP_PRICES[LegalTier.STANDARD],
      color: primaryColor || '#6366F1',
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
      price: LEGAL_MEMBERSHIP_PRICES[LegalTier.PREMIUM],
      yearlyPrice: LEGAL_MEMBERSHIP_PRICES[LegalTier.PREMIUM],
      color: warningColor || '#D4AF37',
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
      price: LEGAL_MEMBERSHIP_PRICES[LegalTier.VIP_FAMILY],
      yearlyPrice: LEGAL_MEMBERSHIP_PRICES[LegalTier.VIP_FAMILY],
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

  // ==================== Data Loading ====================

  useFocusEffect(
    React.useCallback(() => {
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

      const memberInfo = await getMembershipDisplayInfo();
      const testDiscount = await calculateDiscountedPrice(1000);
      if (testDiscount.discountRate > 0) {
        setDiscountInfo({
          membershipLevel: memberInfo.level,
          membershipLabel: memberInfo.label,
          discountRate: testDiscount.discountRate,
        });
      } else {
        setDiscountInfo(null);
      }
    } catch (error) {
      console.error('Failed to load membership:', error);
    }
  };

  const saveUserMembership = async (membership: UserMembership) => {
    try {
      await AsyncStorage.setItem('user_membership', JSON.stringify(membership));
      setUserMembership(membership);
    } catch (error) {
      console.error('Failed to save membership:', error);
    }
  };

  // ==================== Membership Operations ====================

  const handleUpgrade = async (plan: MembershipPlan) => {
    if (!userMembership) return;

    if (plan.id === userMembership.tier) {
      Alert.alert('提示', '您已是该等级用户');
      return;
    }

    const finalPrice = discountInfo && discountInfo.discountRate > 0
      ? getDiscountedPrice(plan.price, discountInfo.discountRate)
      : plan.price;
    const priceText = discountInfo && discountInfo.discountRate > 0
      ? `原价：¥${plan.price}/年\n${discountInfo.membershipLabel}折扣价：¥${finalPrice}/年`
      : `价格：¥${plan.price}/年`;

    Alert.alert(
      '开通尊享计划',
      `确认开通${plan.name}吗？\n\n${priceText}\n有效期：12个月`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认开通',
          onPress: async () => {
            setLoading(true);

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

  const handlePurchase = () => {
    if (!selectedPlanData) return;

    if (selectedPlanData.price === 0) {
      handleUpgrade(selectedPlanData);
      return;
    }

    const finalPrice = discountInfo && discountInfo.discountRate > 0
      ? getDiscountedPrice(selectedPlanData.price, discountInfo.discountRate)
      : selectedPlanData.price;

    navigation.navigate('Checkout', {
      itemType: 'legal_membership',
      itemId: selectedPlanData.id,
      itemName: selectedPlanData.name,
      price: finalPrice,
      originalPrice: discountInfo && discountInfo.discountRate > 0 ? selectedPlanData.price : undefined,
      discountLabel: discountInfo && discountInfo.discountRate > 0 ? `${discountInfo.membershipLabel}专享` : undefined,
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

  // ==================== Render Methods ====================

  const renderQuotaProgress = (label: string, used: number, total: number | '∞', unit: string = '次') => {
    const isUnlimited = total === '∞';
    const percentage = isUnlimited ? 0 : (used / (total as number)) * 100;

    return (
      <YStack marginBottom="$3">
        <XStack justifyContent="space-between" marginBottom="$2">
          <Text fontSize="$3" color="$color10">
            {label}
          </Text>
          <Text fontSize="$3" fontWeight="500" color="$color12">
            {isUnlimited ? `已用${used}${unit}` : `${used}/${total}${unit}`}
          </Text>
        </XStack>
        {!isUnlimited && (
          <View height={6} backgroundColor="$color4" borderRadius={3} overflow="hidden">
            <View
              height="100%"
              width={`${Math.min(percentage, 100)}%`}
              backgroundColor="$primary"
              borderRadius={3}
            />
          </View>
        )}
      </YStack>
    );
  };

  // ==================== Main Render ====================

  if (!userMembership) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top} backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
          <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
            <Pressable onPress={() => navigation.goBack()}>
              <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
                <ArrowLeft size={24} color={color12} />
              </View>
            </Pressable>
            <Text fontSize="$5" fontWeight="600" color="$color12">法律尊享计划</Text>
            <View width={40} />
          </XStack>
        </View>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text fontSize="$4" color="$color10" marginTop="$3">加载中...</Text>
        </YStack>
      </View>
    );
  }

  const currentPlan = MEMBERSHIP_PLANS.find(p => p.id === userMembership.tier);
  const selectedPlanData = MEMBERSHIP_PLANS.find(p => p.id === selectedTab);

  if (!currentPlan || !selectedPlanData) return null;

  const isCurrentPlan = selectedTab === userMembership.tier;
  const IconComponent = getIconComponent(selectedPlanData.icon);

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            法律尊享计划
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* Tab Bar */}
        <View paddingHorizontal="$2.5" paddingTop="$3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {MEMBERSHIP_PLANS.map((plan) => {
              const isSelected = plan.id === selectedTab;
              return (
                <Pressable key={plan.id} onPress={() => setSelectedTab(plan.id)}>
                  <View
                    backgroundColor={isSelected ? '$primary' : '$color4'}
                    borderWidth={1}
                    borderColor={isSelected ? '$primary' : '$color5'}
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    borderRadius="$10"
                  >
                    <Text
                      fontSize="$3"
                      fontWeight={isSelected ? '600' : '400'}
                      color={isSelected ? 'white' : '$color12'}
                    >
                      {plan.name}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Plan Details */}
        <View paddingHorizontal="$2.5" paddingTop="$4">
          {/* Plan Card */}
          <View
            backgroundColor="$background"
            borderRadius="$4"
            padding="$4"
            borderWidth={2}
            borderColor={isCurrentPlan ? '$success' : selectedPlanData.color}
            position="relative"
          >
            {isCurrentPlan && (
              <View
                position="absolute"
                top={-1}
                right={16}
                backgroundColor="$success"
                paddingHorizontal="$2.5"
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
                style={{ backgroundColor: `${selectedPlanData.color}20` }}
                alignItems="center"
                justifyContent="center"
              >
                <IconComponent size={32} color={selectedPlanData.color} />
              </View>
              <YStack flex={1} marginLeft="$3">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {selectedPlanData.name}
                </Text>
                <Text fontSize="$3" color="$color10" marginTop="$1">
                  {selectedPlanData.tagline}
                </Text>
              </YStack>
            </XStack>

            <YStack
              marginBottom="$3"
              paddingVertical="$2"
              borderTopWidth={1}
              borderBottomWidth={1}
              borderColor="$color5"
            >
              {selectedPlanData.price === 0 ? (
                <Text fontSize="$8" fontWeight="700" color="$color12">免费</Text>
              ) : (
                <>
                  {discountInfo && discountInfo.discountRate > 0 && (
                    <XStack alignItems="center" marginBottom="$2">
                      <View
                        backgroundColor="$primary"
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$1"
                        marginRight="$2"
                      >
                        <Text fontSize="$2" color="white" fontWeight="600">
                          {discountInfo.membershipLabel}专享
                        </Text>
                      </View>
                      <Text fontSize="$3" color="$primary" fontWeight="500">
                        {Math.round(discountInfo.discountRate * 100)}% OFF
                      </Text>
                    </XStack>
                  )}
                  <XStack alignItems="baseline">
                    {discountInfo && discountInfo.discountRate > 0 && (
                      <Text
                        fontSize="$4"
                        color="$color10"
                        textDecorationLine="line-through"
                        marginRight="$2"
                      >
                        ¥{selectedPlanData.price}
                      </Text>
                    )}
                    <Text fontSize="$5" fontWeight="600" color="$color12">¥</Text>
                    <Text fontSize="$8" fontWeight="700" color="$color12">
                      {discountInfo && discountInfo.discountRate > 0
                        ? getDiscountedPrice(selectedPlanData.price, discountInfo.discountRate)
                        : selectedPlanData.price}
                    </Text>
                    <Text fontSize="$4" color="$color10" marginLeft="$1">/年</Text>
                  </XStack>
                </>
              )}
            </YStack>

            <YStack gap="$2" marginBottom="$3">
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                专享权益
              </Text>
              {selectedPlanData.features.map((feature, index) => (
                <XStack key={index} alignItems="flex-start">
                  <Check size={16} color={selectedPlanData.color} style={{ marginTop: 2 }} />
                  <Text fontSize="$3" color="$color10" marginLeft="$2" flex={1}>
                    {feature}
                  </Text>
                </XStack>
              ))}
            </YStack>

          </View>

          {/* Quota Usage */}
          {isCurrentPlan && userMembership.tier !== 'basic' && (
            <View backgroundColor="$background" marginTop="$4" borderRadius="$4" padding="$4" borderWidth={1} borderColor="$color5">
              <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$3">
                服务配额
              </Text>
              <YStack>
                {renderQuotaProgress('遗嘱制作', userMembership.usedQuota.willCreation, currentPlan.quota.willCreation)}
                {renderQuotaProgress('律师咨询', userMembership.usedQuota.lawyerConsultation, currentPlan.quota.lawyerConsultation, '分钟')}
                {renderQuotaProgress('合同审查', userMembership.usedQuota.contractReview, currentPlan.quota.contractReview)}
                {renderQuotaProgress('法律体检', userMembership.usedQuota.legalCheckup, currentPlan.quota.legalCheckup)}
              </YStack>
            </View>
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
          backgroundColor="$background"
          paddingHorizontal="$4"
          paddingTop="$3"
          paddingBottom={insets.bottom > 0 ? insets.bottom : 16}
          borderTopWidth={1}
          borderTopColor="$color5"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <YStack>
              <XStack alignItems="center">
                <Text fontSize="$2" color="$color10">
                  {selectedPlanData.name}
                </Text>
                {discountInfo && discountInfo.discountRate > 0 && (
                  <View
                    backgroundColor="$error"
                    paddingHorizontal="$1.5"
                    paddingVertical="$0.5"
                    borderRadius="$1"
                    marginLeft="$2"
                  >
                    <Text fontSize={10} color="white" fontWeight="600">
                      {Math.round(discountInfo.discountRate * 100)}% OFF
                    </Text>
                  </View>
                )}
              </XStack>
              <XStack alignItems="baseline">
                {discountInfo && discountInfo.discountRate > 0 && (
                  <Text
                    fontSize="$4"
                    color="$color10"
                    textDecorationLine="line-through"
                    marginRight="$1"
                  >
                    ¥{selectedPlanData.price}
                  </Text>
                )}
                <Text fontSize="$7" fontWeight="700" color="$primary">
                  ¥{discountInfo && discountInfo.discountRate > 0
                    ? getDiscountedPrice(selectedPlanData.price, discountInfo.discountRate)
                    : selectedPlanData.price}
                </Text>
                <Text fontSize="$3" color="$color10" marginLeft="$1">
                  /年
                </Text>
              </XStack>
            </YStack>

            <Pressable onPress={handlePurchase} disabled={loading}>
              <View
                style={{ backgroundColor: selectedPlanData.color }}
                paddingHorizontal="$6"
                paddingVertical="$3"
                borderRadius="$10"
                opacity={loading ? 0.6 : 1}
              >
                <Text fontSize="$5" fontWeight="600" color="white">
                  {loading ? '处理中...' : '立即开通'}
                </Text>
              </View>
            </Pressable>
          </XStack>
        </View>
      )}
    </View>
  );
};

export default LegalMembershipScreen;
