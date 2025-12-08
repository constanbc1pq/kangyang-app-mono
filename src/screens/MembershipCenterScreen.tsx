/**
 * MembershipCenterScreen - 会员中心页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 *
 * 功能：
 * - 通用 TitleBar
 * - 当前会员状态卡片（无开通按钮）
 * - 会员等级选择（4个等级直接展示）
 * - 权益详情对比
 * - 独立付费服务
 * - 常见问题 FAQ
 * - 底部悬浮开通按钮
 */

import React, { useState, useCallback } from 'react';
import { Pressable } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Crown,
  Star,
  Award,
  Gem,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Stethoscope,
  Scale,
  BadgeCheck,
  HelpCircle,
  Gift,
  Sparkles,
  Shield,
  Zap,
  Users,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { MembershipConfirmModal, PurchaseType } from '@/components/MembershipConfirmModal';
import {
  MembershipLevel,
  MEMBERSHIP_LEVEL_LABELS,
  MEMBERSHIP_LEVEL_COLORS,
  MEMBERSHIP_PRICES,
  POINTS_MULTIPLIER,
  BENEFIT_MATRIX,
  BenefitKey,
  SERVICE_DISCOUNT_RATES,
  EXPERT_CERT_PRICES,
  PaymentCycle,
} from '@/types/membership';
import { getMembershipDisplayInfo, getPurchaseInfo } from '@/services/membershipService';
import { getPoints } from '@/services/userDataService';

// 会员等级图标映射
const LEVEL_ICONS = {
  [MembershipLevel.FREE]: Star,
  [MembershipLevel.GOLD]: Award,
  [MembershipLevel.PLATINUM]: Crown,
  [MembershipLevel.DIAMOND]: Gem,
};

// 权益项中文名称
const BENEFIT_LABELS: Record<BenefitKey, string> = {
  ai_question_daily: 'AI问答（每日）',
  device_bindING_limit: '设备绑定数量',
  health_data_storage_days: '健康数据存储',
  health_report_export: '健康报告导出',
  ai_health_insight: 'AI健康洞察',
  family_health_guard: '全家健康守护',
  recipe_customization: '食谱定制',
  grocery_discount_rate: '食材折扣',
  meal_delivery_priority: '送餐优先',
  elderly_service_discount: '养老服务折扣',
  lawyer_ai_monthly: '律师AI助手（每月）',
  legal_consultation: '法律咨询',
  publish_monthly_limit: '发布次数（每月）',
  points_multiplier: '积分倍率',
  order_commission_discount: '订单佣金减免',
  ad_free: '无广告',
  device_sync_limit: '多设备同步',
  voice_input: '语音输入',
};

// 权益模块分组
const BENEFIT_GROUPS = [
  {
    title: '康 - 健康管理',
    icon: Zap,
    keys: ['ai_question_daily', 'device_bindING_limit', 'health_data_storage_days', 'health_report_export', 'ai_health_insight', 'family_health_guard'] as BenefitKey[],
  },
  {
    title: '养 - 生活服务',
    icon: Shield,
    keys: ['recipe_customization', 'grocery_discount_rate', 'meal_delivery_priority', 'elderly_service_discount', 'lawyer_ai_monthly', 'legal_consultation'] as BenefitKey[],
  },
  {
    title: '社区',
    icon: Users,
    keys: ['publish_monthly_limit', 'points_multiplier', 'order_commission_discount'] as BenefitKey[],
  },
  {
    title: '通用权益',
    icon: Sparkles,
    keys: ['ad_free', 'device_sync_limit', 'voice_input'] as BenefitKey[],
  },
];

// FAQ 数据
const FAQ_DATA = [
  {
    question: '会员等级有什么区别？',
    answer: '康养APP提供四个会员等级：免费用户、黄金会员、白金会员、钻石会员。等级越高，享受的权益越多，包括更多AI问答次数、更长的数据存储期限、更高的积分倍率等。',
  },
  {
    question: '如何升级会员？',
    answer: '您可以在会员中心选择想要开通的会员等级，完成支付即可立即生效。',
  },
  {
    question: '会员到期后数据会丢失吗？',
    answer: '不会。会员到期后，您的数据仍然保留，但可能无法访问超出免费用户存储期限的历史数据。续费后即可恢复访问。',
  },
  {
    question: '积分可以做什么？',
    answer: '积分可用于兑换会员时长、商城商品、服务折扣等。不同会员等级获得积分的倍率不同，钻石会员可享受3倍积分。',
  },
  {
    question: '私人医生和法律服务是会员权益吗？',
    answer: '私人医生和法律服务是独立付费服务，不包含在会员权益内。但白金和钻石会员购买这些服务可享受10%-20%的折扣。',
  },
  {
    question: '钻石家庭版是什么？',
    answer: '钻石会员可添加3-5名家庭成员，共享部分权益（如健康数据查看），家庭版在钻石会员基础上加收50%费用。',
  },
];

// 格式化权益值
const formatBenefitValue = (key: BenefitKey, value: any): string => {
  if (value === -1) return '无限';
  if (value === true) return '支持';
  if (value === false) return '不支持';
  if (typeof value === 'number') {
    if (key === 'health_data_storage_days') {
      if (value >= 365) return `${Math.floor(value / 365)}年`;
      return `${value}天`;
    }
    if (key === 'grocery_discount_rate' || key === 'elderly_service_discount' || key === 'order_commission_discount') {
      return value === 0 ? '无' : `${Math.round(value * 100)}%`;
    }
    if (key === 'points_multiplier') {
      return `${value}x`;
    }
    return String(value);
  }
  if (value === 'none') return '无';
  if (value === 'daily') return '日报';
  if (value === 'weekly_monthly') return '周报/月报';
  if (value === 'ai_recommend') return 'AI推荐';
  if (value === 'personal') return '个人定制';
  if (value === 'family') return '全家定制';
  if (value === 'text') return '文字咨询';
  if (value === 'text_phone') return '文字+电话';
  return String(value);
};

export const MembershipCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;

  const [membershipInfo, setMembershipInfo] = useState<{
    level: MembershipLevel;
    label: string;
    startDate?: string;
    endDate?: string;
    daysRemaining: number | null;
    isExpired: boolean;
    autoRenew: boolean;
    pendingMembership?: {
      level: MembershipLevel;
      label: string;
      startDate: string;
      endDate: string;
    };
  } | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<MembershipLevel>(MembershipLevel.GOLD);
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);

  // 确认弹窗相关状态
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState<{
    purchaseType: PurchaseType;
    currentLevel: MembershipLevel;
    currentEndDate?: string;
    newEndDate: string;
    price: number;
  } | null>(null);
  const selectedCycle: PaymentCycle = 'yearly'; // 当前只支持年付

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const info = await getMembershipDisplayInfo();
      setMembershipInfo(info);
      // 默认选择比当前等级高一级，如果已经是钻石则选择钻石
      if (info.level === MembershipLevel.FREE) {
        setSelectedLevel(MembershipLevel.GOLD);
      } else if (info.level === MembershipLevel.GOLD) {
        setSelectedLevel(MembershipLevel.PLATINUM);
      } else if (info.level === MembershipLevel.PLATINUM) {
        setSelectedLevel(MembershipLevel.DIAMOND);
      } else {
        setSelectedLevel(MembershipLevel.DIAMOND);
      }

      const pointsInfo = await getPoints();
      setPoints(pointsInfo.balance);
    } catch (error) {
      console.error('Failed to load membership info:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '永久有效';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 点击购买按钮 - 显示确认弹窗
  const handlePurchase = async () => {
    if (selectedLevel === MembershipLevel.FREE) return;

    try {
      const info = await getPurchaseInfo(selectedLevel, selectedCycle);
      setPurchaseInfo(info);
      setShowConfirmModal(true);
    } catch (error) {
      console.error('获取购买信息失败:', error);
    }
  };

  // 确认购买 - 跳转到结算页面
  const handleConfirmPurchase = () => {
    if (!purchaseInfo) return;

    setShowConfirmModal(false);

    navigation.navigate('Checkout' as never, {
      itemType: 'membership',
      itemId: selectedLevel,
      itemName: MEMBERSHIP_LEVEL_LABELS[selectedLevel],
      price: purchaseInfo.price,
      metadata: {
        membershipLevel: selectedLevel,
        cycle: selectedCycle,
        purchaseType: purchaseInfo.purchaseType,
      },
    } as never);
  };

  const getButtonText = (): string => {
    if (!membershipInfo) return '加载中...';
    if (selectedLevel === MembershipLevel.FREE) return '免费用户无需开通';
    if (selectedLevel === membershipInfo.level) {
      return membershipInfo.isExpired ? '续费会员' : '续费会员';
    }
    const price = MEMBERSHIP_PRICES[selectedLevel].yearly;
    return `开通${MEMBERSHIP_LEVEL_LABELS[selectedLevel]} ¥${price}`;
  };

  if (loading || !membershipInfo) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="会员中心" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">加载中...</Text>
        </View>
      </View>
    );
  }

  const currentColors = MEMBERSHIP_LEVEL_COLORS[membershipInfo.level];
  const CurrentIcon = LEVEL_ICONS[membershipInfo.level];
  const isFree = membershipInfo.level === MembershipLevel.FREE;

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="会员中心" />
      </View>

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <YStack padding="$2.5" gap="$2">
          {/* 当前会员状态卡片 */}
          <View borderRadius="$5" overflow="hidden">
            <LinearGradient
              colors={currentColors.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16 }}
            >
              <XStack gap="$2" alignItems="center">
                <View
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor="rgba(255,255,255,0.25)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CurrentIcon size={28} color="white" />
                </View>
                <YStack flex={1}>
                  <Text fontSize="$6" fontWeight="700" color="white">
                    {membershipInfo.label}
                  </Text>
                  {!isFree && (
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      {membershipInfo.isExpired
                        ? '已过期'
                        : membershipInfo.endDate
                          ? `有效期至 ${formatDate(membershipInfo.endDate)}${membershipInfo.daysRemaining !== null ? ` (${membershipInfo.daysRemaining}天)` : ''}`
                          : '永久有效'}
                    </Text>
                  )}
                  <XStack alignItems="center" gap="$1" marginTop="$1">
                    <Gift size={14} color="rgba(255,255,255,0.8)" />
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      积分: {points.toLocaleString()}
                    </Text>
                    {POINTS_MULTIPLIER[membershipInfo.level] > 1 && (
                      <Text fontSize="$2" color="rgba(255,255,255,0.6)">
                        · {POINTS_MULTIPLIER[membershipInfo.level]}倍积分
                      </Text>
                    )}
                  </XStack>
                </YStack>
              </XStack>

              {/* 会员折扣提示 */}
              {SERVICE_DISCOUNT_RATES[membershipInfo.level] > 0 && (
                <View
                  backgroundColor="rgba(255,255,255,0.15)"
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                  borderRadius="$3"
                  marginTop="$2"
                >
                  <Text fontSize="$2" color="white">
                    专属折扣：购买私人医生/法律服务享 {Math.round(SERVICE_DISCOUNT_RATES[membershipInfo.level] * 100)}% OFF
                  </Text>
                </View>
              )}

              {/* 预约的会员提示 */}
              {membershipInfo.pendingMembership && (
                <View
                  backgroundColor="rgba(255,255,255,0.15)"
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                  borderRadius="$3"
                  marginTop="$2"
                >
                  <Text fontSize="$2" color="white">
                    已预约{membershipInfo.pendingMembership.label}，将于 {formatDate(membershipInfo.pendingMembership.startDate)} 生效
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* 会员体系介绍 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack gap="$1.5" alignItems="center" marginBottom="$2">
              <Sparkles size={18} color={primaryColor} />
              <Text fontSize="$4" fontWeight="600" color="$color12">康养会员体系</Text>
            </XStack>
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              康养APP提供4级会员体系，免费用户可体验基础功能，付费会员逐步解锁更多权益。白金/钻石会员购买私人医生、法律服务可享专属折扣。
            </Text>
          </View>

          {/* 会员等级选择 - 直接展示4个等级 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              选择会员等级
            </Text>

            <YStack gap="$2">
              {Object.values(MembershipLevel).map((level) => {
                const colors = MEMBERSHIP_LEVEL_COLORS[level];
                const Icon = LEVEL_ICONS[level];
                const isCurrentLevel = level === membershipInfo.level;
                const isSelected = level === selectedLevel;
                const price = MEMBERSHIP_PRICES[level];

                return (
                  <Pressable
                    key={level}
                    onPress={() => setSelectedLevel(level)}
                  >
                    <View
                      padding="$2"
                      borderRadius="$4"
                      borderWidth={2}
                      borderColor={isSelected ? colors.primary : '$color5'}
                      backgroundColor={isSelected ? `${colors.primary}10` : '$color2'}
                    >
                      <XStack gap="$2" alignItems="center">
                        <View
                          width={44}
                          height={44}
                          borderRadius={22}
                          backgroundColor={`${colors.primary}20`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Icon size={22} color={colors.primary} />
                        </View>

                        <YStack flex={1}>
                          <XStack gap="$1.5" alignItems="center">
                            <Text fontSize="$4" fontWeight="600" color="$color12">
                              {MEMBERSHIP_LEVEL_LABELS[level]}
                            </Text>
                            {isCurrentLevel && (
                              <View
                                backgroundColor={successColor}
                                paddingHorizontal="$1.5"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize={10} color="white" fontWeight="500">当前</Text>
                              </View>
                            )}
                          </XStack>
                          <Text fontSize="$2" color="$color10">
                            积分{POINTS_MULTIPLIER[level]}倍
                            {SERVICE_DISCOUNT_RATES[level] > 0 && ` · 服务折扣${Math.round(SERVICE_DISCOUNT_RATES[level] * 100)}%`}
                          </Text>
                        </YStack>

                        <YStack alignItems="flex-end">
                          {price.yearly === 0 ? (
                            <Text fontSize="$4" fontWeight="700" color={colors.primary}>
                              免费
                            </Text>
                          ) : (
                            <XStack alignItems="baseline">
                              <Text fontSize="$2" color={colors.primary}>¥</Text>
                              <Text fontSize="$5" fontWeight="700" color={colors.primary}>
                                {price.yearly}
                              </Text>
                            </XStack>
                          )}
                        </YStack>

                        {isSelected && (
                          <View
                            width={24}
                            height={24}
                            borderRadius={12}
                            backgroundColor={colors.primary}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Check size={14} color="white" />
                          </View>
                        )}
                      </XStack>
                    </View>
                  </Pressable>
                );
              })}
            </YStack>

          </View>

          {/* 权益对比 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              权益对比
            </Text>

            <YStack gap="$2">
              {BENEFIT_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <View
                    key={group.title}
                    padding="$2"
                    backgroundColor="$color4"
                    borderRadius="$4"
                  >
                    <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
                      <GroupIcon size={16} color={primaryColor} />
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {group.title}
                      </Text>
                    </XStack>

                    <YStack gap="$1">
                      {group.keys.map((key) => {
                        const currentValue = BENEFIT_MATRIX[key][membershipInfo.level];
                        const selectedValue = BENEFIT_MATRIX[key][selectedLevel];
                        const hasUpgrade = selectedLevel !== membershipInfo.level &&
                          formatBenefitValue(key, selectedValue) !== formatBenefitValue(key, currentValue);

                        return (
                          <XStack
                            key={key}
                            justifyContent="space-between"
                            alignItems="center"
                            paddingVertical="$1"
                          >
                            <Text fontSize="$2" color="$color10" flex={1}>
                              {BENEFIT_LABELS[key]}
                            </Text>
                            <XStack alignItems="center" gap="$1.5">
                              <Text
                                fontSize="$2"
                                fontWeight="500"
                                color={currentValue === false || currentValue === 'none' || currentValue === 0 ? '$color10' : '$color12'}
                              >
                                {formatBenefitValue(key, currentValue)}
                              </Text>
                              {hasUpgrade && (
                                <>
                                  <ChevronRight size={12} color={primaryColor} />
                                  <Text fontSize="$2" fontWeight="600" color="$primary">
                                    {formatBenefitValue(key, selectedValue)}
                                  </Text>
                                </>
                              )}
                            </XStack>
                          </XStack>
                        );
                      })}
                    </YStack>
                  </View>
                );
              })}
            </YStack>
          </View>

          {/* 独立付费服务 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
              独立付费服务
            </Text>
            <Text fontSize="$2" color="$color10" marginBottom="$2">
              {SERVICE_DISCOUNT_RATES[membershipInfo.level] > 0
                ? `${membershipInfo.label}可享${Math.round(SERVICE_DISCOUNT_RATES[membershipInfo.level] * 100)}%折扣`
                : '白金/钻石会员可享专属折扣'}
            </Text>

            <YStack gap="$2">
              {/* 私人医生 */}
              <Pressable onPress={() => navigation.navigate('PrivateDoctorHome' as never)}>
                <View
                  padding="$2"
                  backgroundColor="$color4"
                  borderRadius="$4"
                >
                  <XStack alignItems="center" gap="$2">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${primaryColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Stethoscope size={20} color={primaryColor} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        私人医生服务
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        ¥19,800起/年 · 专属健康管家
                      </Text>
                    </YStack>
                    <ChevronRight size={18} color={color10} />
                  </XStack>
                </View>
              </Pressable>

              {/* 法律服务 */}
              <Pressable onPress={() => navigation.navigate('LegalServiceHome' as never)}>
                <View
                  padding="$2"
                  backgroundColor="$color4"
                  borderRadius="$4"
                >
                  <XStack alignItems="center" gap="$2">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${warningColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Scale size={20} color={warningColor} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        法律尊享服务
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        ¥1,980起/年 · 专业律师团队
                      </Text>
                    </YStack>
                    <ChevronRight size={18} color={color10} />
                  </XStack>
                </View>
              </Pressable>

              {/* 达人认证 */}
              <Pressable onPress={() => navigation.navigate('ExpertCertification' as never)}>
                <View
                  padding="$2"
                  backgroundColor="$color4"
                  borderRadius="$4"
                >
                  <XStack alignItems="center" gap="$2">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${successColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <BadgeCheck size={20} color={successColor} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        达人认证
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        个人¥{EXPERT_CERT_PRICES.personal}/年 · 商家¥{EXPERT_CERT_PRICES.business}/年
                      </Text>
                    </YStack>
                    <ChevronRight size={18} color={color10} />
                  </XStack>
                </View>
              </Pressable>
            </YStack>
          </View>

          {/* 常见问题 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack gap="$1.5" alignItems="center" marginBottom="$2">
              <HelpCircle size={18} color={primaryColor} />
              <Text fontSize="$4" fontWeight="600" color="$color12">
                常见问题
              </Text>
            </XStack>

            <YStack>
              {FAQ_DATA.map((faq, index) => {
                const isExpanded = expandedFAQs.includes(index);
                const toggleFAQ = () => {
                  setExpandedFAQs(prev =>
                    prev.includes(index)
                      ? prev.filter(i => i !== index)
                      : [...prev, index]
                  );
                };

                return (
                  <View
                    key={index}
                    borderBottomWidth={index < FAQ_DATA.length - 1 ? 1 : 0}
                    borderBottomColor="$color5"
                  >
                    <Pressable onPress={toggleFAQ}>
                      <XStack
                        paddingVertical="$2"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text fontSize="$3" fontWeight="500" color="$color12" flex={1}>
                          {faq.question}
                        </Text>
                        <View
                          style={{
                            transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                          }}
                        >
                          <ChevronDown size={16} color={color10} />
                        </View>
                      </XStack>
                    </Pressable>
                    {isExpanded && (
                      <Text
                        fontSize="$2"
                        color="$color10"
                        lineHeight={18}
                        paddingBottom="$2"
                      >
                        {faq.answer}
                      </Text>
                    )}
                  </View>
                );
              })}
            </YStack>
          </View>
        </YStack>
      </ScrollView>

      {/* 底部悬浮开通按钮 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingTop="$2"
        paddingBottom={insets.bottom > 0 ? insets.bottom : 16}
      >
        <Pressable
          onPress={handlePurchase}
          disabled={selectedLevel === MembershipLevel.FREE}
        >
          <View
            backgroundColor={selectedLevel === MembershipLevel.FREE ? '$color5' : primaryColor}
            borderRadius="$10"
            paddingVertical="$3"
            alignItems="center"
          >
            <Text
              fontSize="$4"
              fontWeight="600"
              color={selectedLevel === MembershipLevel.FREE ? '$color10' : 'white'}
            >
              {getButtonText()}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* 会员购买确认弹窗 */}
      {purchaseInfo && (
        <MembershipConfirmModal
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmPurchase}
          purchaseType={purchaseInfo.purchaseType}
          currentLevel={purchaseInfo.currentLevel}
          targetLevel={selectedLevel}
          currentEndDate={purchaseInfo.currentEndDate}
          newEndDate={purchaseInfo.newEndDate}
          cycle={selectedCycle}
          price={purchaseInfo.price}
        />
      )}
    </View>
  );
};

export default MembershipCenterScreen;
