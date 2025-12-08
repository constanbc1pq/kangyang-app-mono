/**
 * ============================================================================
 * 律师详情页面 - LawyerDetailScreen
 * ============================================================================
 *
 * Phase 33.3: 律师详情
 * Design: Following CLAUDE.md specs
 * ============================================================================
 */

import React, { useState } from 'react';
import { Alert, ActivityIndicator, Image as RNImage, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Share,
  User,
  CreditCard,
  GraduationCap,
  Trophy,
  CheckCircle,
  MessageCircle,
  Video,
  Home,
  Star,
  Briefcase,
  FileText,
  Heart,
  Users,
  FileCheck,
  ShoppingCart,
  Pill,
  Crown,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LawyerProfile, LawyerSpecialty } from '../types/legalService';
import { getLawyerById } from '../services/legalService';
import { getAvatarSource } from '@/constants/avatars';

const GOLD_COLOR = '#D4AF37';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
    };
  };
}

type MembershipTier = 'basic' | 'standard' | 'premium' | 'vip_family';

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

const MEMBERSHIP_QUOTAS: Record<MembershipTier, number | '∞'> = {
  basic: 0,
  standard: 300,
  premium: 1000,
  vip_family: '∞',
};

const MEMBERSHIP_NAMES: Record<MembershipTier, string> = {
  basic: '基础版',
  standard: '标准版',
  premium: '尊享版',
  vip_family: 'VIP家庭版',
};

const getIconForSpecialty = (specialty: LawyerSpecialty) => {
  const iconMap: Record<LawyerSpecialty, any> = {
    [LawyerSpecialty.INHERITANCE]: FileText,
    [LawyerSpecialty.ELDER_CARE]: Heart,
    [LawyerSpecialty.PROPERTY]: Home,
    [LawyerSpecialty.MARRIAGE]: Users,
    [LawyerSpecialty.CONTRACT]: FileCheck,
    [LawyerSpecialty.CONSUMER_RIGHTS]: ShoppingCart,
    [LawyerSpecialty.MEDICAL]: Pill,
    [LawyerSpecialty.LABOR]: Briefcase,
  };
  return iconMap[specialty] || FileText;
};

const SPECIALTY_LABELS: Record<LawyerSpecialty, string> = {
  [LawyerSpecialty.INHERITANCE]: '遗嘱继承',
  [LawyerSpecialty.ELDER_CARE]: '养老赡养',
  [LawyerSpecialty.PROPERTY]: '房产纠纷',
  [LawyerSpecialty.MARRIAGE]: '婚姻家庭',
  [LawyerSpecialty.CONTRACT]: '合同纠纷',
  [LawyerSpecialty.CONSUMER_RIGHTS]: '消费维权',
  [LawyerSpecialty.MEDICAL]: '医疗纠纷',
  [LawyerSpecialty.LABOR]: '劳动争议',
};

interface SuccessCase {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  consultationType: string;
}

const LawyerDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const { lawyerId } = route.params;

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'cases' | 'reviews'>('info');
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadLawyerDetail();
      loadUserMembership();
    }, [lawyerId])
  );

  const loadLawyerDetail = async () => {
    try {
      setLoading(true);
      const data = await getLawyerById(lawyerId);
      if (data) {
        setLawyer(data);
      } else {
        Alert.alert('加载失败', '未找到律师信息');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading lawyer detail:', error);
      Alert.alert('加载失败', '无法加载律师信息，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

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
            documentTemplates: 0,
            legalCheckup: 0,
            caseAnalysis: 0,
          },
        };
        setUserMembership(basicMembership);
        await AsyncStorage.setItem('user_membership', JSON.stringify(basicMembership));
      }
    } catch (error) {
      console.error('Error loading user membership:', error);
    }
  };

  const getSuccessCases = (): SuccessCase[] => [
    {
      id: 'case_1',
      title: '遗嘱继承纠纷案',
      description: '成功为委托人争取到合法遗产份额，维护了继承权益。案件涉及房产、存款等多项遗产，最终通过调解达成协议。',
      date: '2024-01-15',
    },
    {
      id: 'case_2',
      title: '赡养费追索案',
      description: '代理老年人追索子女赡养费，法院判决子女每月支付赡养费并补缴拖欠费用。',
      date: '2023-11-20',
    },
    {
      id: 'case_3',
      title: '房产过户纠纷案',
      description: '协助老人解决房产过户争议，确保房产合法过户给指定继承人。',
      date: '2023-09-08',
    },
  ];

  const getReviews = (): Review[] => [
    {
      id: 'review_1',
      userName: '李**',
      rating: 5,
      comment: '张律师非常专业，耐心解答了我关于遗嘱的所有疑问，还帮我完善了遗嘱内容。态度很好，值得推荐！',
      date: '2024-01-20',
      consultationType: '图文咨询',
    },
    {
      id: 'review_2',
      userName: '王**',
      rating: 5,
      comment: '感谢张律师帮我解决了家庭赡养纠纷，专业能力强，处理问题很到位。',
      date: '2024-01-18',
      consultationType: '电话咨询',
    },
    {
      id: 'review_3',
      userName: '赵**',
      rating: 4,
      comment: '律师很负责，回复及时，给出的建议很实用。',
      date: '2024-01-15',
      consultationType: '图文咨询',
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color={GOLD_COLOR}
          fill={i <= rating ? GOLD_COLOR : 'transparent'}
        />
      );
    }
    return <XStack gap="$0.5">{stars}</XStack>;
  };

  const getRemainingQuota = (): number | '∞' => {
    if (!userMembership) return 0;
    const totalQuota = MEMBERSHIP_QUOTAS[userMembership.tier];
    if (totalQuota === '∞') return '∞';
    return Math.max(0, totalQuota - userMembership.usedQuota.lawyerConsultation);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const renderMembershipStatusCard = () => {
    if (!userMembership) return null;

    const remaining = getRemainingQuota();
    const tierName = MEMBERSHIP_NAMES[userMembership.tier];
    const isBasic = userMembership.tier === 'basic';
    const isVIP = userMembership.tier === 'vip_family';
    const isLowQuota = typeof remaining === 'number' && remaining < 50 && remaining > 0;
    const isOutOfQuota = typeof remaining === 'number' && remaining === 0;

    if (isBasic) {
      return (
        <View
          margin="$2.5"
          marginTop={0}
          padding="$2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$warning"
          style={{ backgroundColor: `${warningColor}10` }}
        >
          <XStack alignItems="flex-start" gap="$2.5">
            <View
              width={44}
              height={44}
              borderRadius={22}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: `${warningColor}20` }}
            >
              <AlertCircle size={24} color={warningColor} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="700" color="$warning" marginBottom="$0.5">
                当前为基础版用户
              </Text>
              <Text fontSize="$2" color="$color10" marginBottom="$2" lineHeight={18}>
                您暂无律师咨询权益{'\n'}升级至标准版即可享受300分钟免费咨询
              </Text>
              <Pressable onPress={() => navigation.navigate('LegalMembership')}>
                <View
                  backgroundColor="$primary"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$10"
                  alignSelf="flex-start"
                >
                  <XStack alignItems="center" gap="$1">
                    <Crown size={16} color="white" />
                    <Text fontSize="$3" fontWeight="600" color="white">
                      立即升级会员
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </YStack>
          </XStack>
        </View>
      );
    }

    if (isVIP) {
      return (
        <View
          margin="$2.5"
          marginTop={0}
          padding="$2"
          borderRadius="$5"
          borderWidth={2}
          borderColor={GOLD_COLOR}
          style={{ backgroundColor: `${GOLD_COLOR}10` }}
        >
          <XStack alignItems="flex-start" gap="$2.5">
            <View
              width={44}
              height={44}
              borderRadius={22}
              justifyContent="center"
              alignItems="center"
              backgroundColor={GOLD_COLOR}
            >
              <Crown size={24} color="white" />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="700" color={GOLD_COLOR} marginBottom="$0.5">
                VIP家庭版会员
              </Text>
              <Text fontSize="$2" color="$color10" marginBottom="$1" lineHeight={18}>
                无限次免费咨询 · 专属律师团队服务
              </Text>
              <XStack alignItems="center" gap="$1">
                <Clock size={12} color={color10} />
                <Text fontSize="$2" color="$color10">
                  有效期至：{formatDate(userMembership.expiresAt)}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </View>
      );
    }

    if (typeof remaining === 'number' && remaining >= 50) {
      return (
        <View
          margin="$2.5"
          marginTop={0}
          padding="$2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$success"
          style={{ backgroundColor: `${successColor}10` }}
        >
          <XStack alignItems="flex-start" gap="$2.5">
            <View
              width={44}
              height={44}
              borderRadius={22}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: `${successColor}20` }}
            >
              <CheckCircle size={24} color={successColor} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="700" color="$success" marginBottom="$0.5">
                {tierName}会员
              </Text>
              <Text fontSize="$2" color="$color10" marginBottom="$1" lineHeight={18}>
                剩余咨询配额：{remaining}分钟
              </Text>
              <XStack alignItems="center" gap="$1">
                <Clock size={12} color={color10} />
                <Text fontSize="$2" color="$color10">
                  有效期至：{formatDate(userMembership.expiresAt)}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </View>
      );
    }

    if (isLowQuota || isOutOfQuota) {
      return (
        <View
          margin="$2.5"
          marginTop={0}
          padding="$2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$error"
          style={{ backgroundColor: `${errorColor}10` }}
        >
          <XStack alignItems="flex-start" gap="$2.5">
            <View
              width={44}
              height={44}
              borderRadius={22}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: `${errorColor}20` }}
            >
              <AlertCircle size={24} color={errorColor} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="700" color="$error" marginBottom="$0.5">
                {tierName}会员 - {isOutOfQuota ? '配额已用完' : '配额即将用尽'}
              </Text>
              <Text fontSize="$2" color="$color10" marginBottom="$2" lineHeight={18}>
                剩余咨询配额：{remaining}分钟
              </Text>
              <Pressable onPress={() => navigation.navigate('LegalMembership')}>
                <View
                  backgroundColor="$primary"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$10"
                  alignSelf="flex-start"
                >
                  <XStack alignItems="center" gap="$1">
                    <TrendingUp size={16} color="white" />
                    <Text fontSize="$3" fontWeight="600" color="white">
                      升级会员
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </YStack>
          </XStack>
        </View>
      );
    }

    return null;
  };

  const renderBasicInfo = () => {
    if (!lawyer) return null;

    return (
      <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
        <XStack marginBottom="$3">
          <YStack marginRight="$3" alignItems="center">
            <View width={80} height={80} borderRadius="$4" overflow="hidden">
              <RNImage
                source={getAvatarSource(lawyer.avatar, lawyer.name)}
                style={{ width: 80, height: 80 }}
                resizeMode="cover"
              />
            </View>
            {lawyer.isOnline && (
              <View
                marginTop="$1.5"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                style={{ backgroundColor: `${successColor}15` }}
              >
                <XStack alignItems="center" gap="$0.5">
                  <View width={6} height={6} borderRadius={3} backgroundColor="$success" />
                  <Text fontSize={10} color="$success" fontWeight="500">在线</Text>
                </XStack>
              </View>
            )}
          </YStack>

          <YStack flex={1}>
            <Text fontSize="$6" fontWeight="700" color="$color12" marginBottom="$0.5">
              {lawyer.name}
            </Text>
            <Text fontSize="$3" color="$color10" marginBottom="$2">
              {lawyer.lawFirm}
            </Text>

            <XStack alignItems="center" marginBottom="$2" gap="$1">
              {renderStars(Math.floor(lawyer.rating))}
              <Text fontSize="$3" fontWeight="600" color="$color12" marginLeft="$0.5">
                {lawyer.rating.toFixed(1)}
              </Text>
              <Text fontSize="$2" color="$color10">
                ({lawyer.reviewCount}评价)
              </Text>
            </XStack>

            <XStack gap="$3">
              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$primary">
                  {lawyer.yearsOfExperience}
                </Text>
                <Text fontSize="$2" color="$color10">执业年限</Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$primary">
                  {lawyer.caseCount}
                </Text>
                <Text fontSize="$2" color="$color10">办案数</Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$primary">
                  {(lawyer.successRate * 100).toFixed(0)}%
                </Text>
                <Text fontSize="$2" color="$color10">胜诉率</Text>
              </YStack>
            </XStack>
          </YStack>
        </XStack>

        <View height={1} backgroundColor="$color5" marginBottom="$2" />

        <YStack gap="$2" marginBottom="$2">
          <XStack alignItems="center" gap="$2">
            <CreditCard size={16} color={primaryColor} />
            <Text fontSize="$2" color="$color10">执业证号：</Text>
            <Text fontSize="$2" color="$color12" flex={1}>{lawyer.licenseNumber}</Text>
          </XStack>
          <XStack alignItems="center" gap="$2">
            <GraduationCap size={16} color={primaryColor} />
            <Text fontSize="$2" color="$color10">教育背景：</Text>
            <Text fontSize="$2" color="$color12" flex={1}>{lawyer.education}</Text>
          </XStack>
        </YStack>

        <View height={1} backgroundColor="$color5" marginBottom="$2" />

        <YStack>
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
            专业领域
          </Text>
          <XStack flexWrap="wrap" gap="$1.5">
            {lawyer.specialties.map(specialty => {
              const IconComponent = getIconForSpecialty(specialty);
              return (
                <View
                  key={specialty}
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                  borderRadius="$3"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <XStack alignItems="center" gap="$1">
                    <IconComponent size={14} color={primaryColor} />
                    <Text fontSize="$2" color="$primary" fontWeight="500">
                      {SPECIALTY_LABELS[specialty]}
                    </Text>
                  </XStack>
                </View>
              );
            })}
          </XStack>
        </YStack>

        <View height={1} backgroundColor="$color5" marginVertical="$2" />

        <YStack>
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
            个人简介
          </Text>
          <Text fontSize="$2" color="$color10" lineHeight={20}>
            {lawyer.introduction}
          </Text>
        </YStack>

        {lawyer.achievements && lawyer.achievements.length > 0 && (
          <>
            <View height={1} backgroundColor="$color5" marginVertical="$2" />
            <YStack>
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
                主要成就
              </Text>
              {lawyer.achievements.map((achievement, index) => (
                <XStack key={index} alignItems="center" marginBottom="$1" gap="$1.5">
                  <Trophy size={14} color={GOLD_COLOR} />
                  <Text fontSize="$2" color="$color10">{achievement}</Text>
                </XStack>
              ))}
            </YStack>
          </>
        )}
      </View>
    );
  };

  const renderSuccessCases = () => {
    const cases = getSuccessCases();

    return (
      <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
        <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
          成功案例
        </Text>
        {cases.map(caseItem => (
          <View
            key={caseItem.id}
            backgroundColor="$color4"
            borderRadius="$4"
            padding="$2"
            marginBottom="$2"
          >
            <XStack marginBottom="$1.5" gap="$2">
              <CheckCircle size={18} color={successColor} />
              <YStack flex={1}>
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                  {caseItem.title}
                </Text>
                <Text fontSize="$2" color="$color10">{caseItem.date}</Text>
              </YStack>
            </XStack>
            <Text fontSize="$2" color="$color10" lineHeight={18}>
              {caseItem.description}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReviews = () => {
    const reviews = getReviews();

    return (
      <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <Text fontSize="$3" fontWeight="600" color="$color12">用户评价</Text>
          <Text fontSize="$2" color="$color10">共{reviews.length}条</Text>
        </XStack>

        {reviews.map(review => (
          <View
            key={review.id}
            backgroundColor="$color4"
            borderRadius="$4"
            padding="$2"
            marginBottom="$2"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
              <XStack alignItems="center" gap="$2">
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  backgroundColor="$color5"
                  justifyContent="center"
                  alignItems="center"
                >
                  <User size={18} color={color10} />
                </View>
                <YStack>
                  <Text fontSize="$3" fontWeight="600" color="$color12">{review.userName}</Text>
                  <Text fontSize="$2" color="$color10">{review.date}</Text>
                </YStack>
              </XStack>
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Text fontSize={10} color="$primary">{review.consultationType}</Text>
              </View>
            </XStack>

            <View marginBottom="$1">{renderStars(review.rating)}</View>
            <Text fontSize="$2" color="$color10" lineHeight={18}>{review.comment}</Text>
          </View>
        ))}
      </View>
    );
  };

  const handleConsultationClick = (type: 'text' | 'video', quotaNeeded: number) => {
    if (!userMembership || !lawyer) return;

    const remaining = getRemainingQuota();
    const isVIP = userMembership.tier === 'vip_family';
    const hasEnoughQuota = typeof remaining === 'number' && remaining >= quotaNeeded;

    // 有权限则直接进入咨询
    if (isVIP || hasEnoughQuota || remaining === '∞') {
      const screen = type === 'text' ? 'TextConsultation' : 'VideoConsultation';
      navigation.navigate(screen, { lawyerId: lawyer.id });
      return;
    }

    // 无权限则跳转付费购买
    const price = type === 'text' ? 200 : 300;
    const serviceName = type === 'text' ? '图文咨询' : '视频咨询';

    navigation.navigate('Checkout', {
      itemType: 'legal_consultation',
      itemId: `${lawyer.id}_${type}`,
      itemName: `${lawyer.name} - ${serviceName}`,
      price: price,
      providerId: lawyer.id,
      providerName: lawyer.name,
      serviceType: type === 'text' ? 'text_consultation' : 'video_consultation',
      metadata: {
        lawyerId: lawyer.id,
        consultationType: type,
        duration: type === 'text' ? '3次追问' : '30分钟',
      },
    });
  };

  const renderPricing = () => {
    if (!lawyer || !userMembership) return null;

    const remaining = getRemainingQuota();
    const isBasic = userMembership.tier === 'basic';
    const isVIP = userMembership.tier === 'vip_family';
    const hasEnoughForText = isVIP || remaining === '∞' || (typeof remaining === 'number' && remaining >= 30);
    const hasEnoughForVideo = isVIP || remaining === '∞' || (typeof remaining === 'number' && remaining >= 30);

    return (
      <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
        <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
          咨询服务
        </Text>

        {/* 图文咨询 */}
        <View
          backgroundColor="$color4"
          borderRadius="$5"
          padding="$2"
          marginBottom="$2"
        >
          <XStack alignItems="flex-start" gap="$2.5">
            <View
              width={44}
              height={44}
              borderRadius={22}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <MessageCircle size={22} color={primaryColor} />
            </View>
            <YStack flex={1} gap="$1.5">
              <Text fontSize="$4" fontWeight="600" color="$color12">图文咨询</Text>
              {isVIP || hasEnoughForText ? (
                <Text fontSize="$2" color="$success" fontWeight="500">
                  {isVIP ? 'VIP免费' : '会员免费 (消耗30分钟配额)'}
                </Text>
              ) : (
                <Text fontSize="$2" color="$color10">
                  ¥200/次 · 包含3次追问
                </Text>
              )}

              <XStack gap="$2" marginTop="$1">
                <Pressable style={{ flex: 1 }} onPress={() => handleConsultationClick('text', 30)}>
                  <View
                    backgroundColor={isVIP || hasEnoughForText ? (isVIP ? GOLD_COLOR : '$success') : '$primary'}
                    paddingVertical="$2"
                    borderRadius="$10"
                    alignItems="center"
                  >
                    <XStack alignItems="center" gap="$1">
                      {isVIP && <Crown size={14} color="white" />}
                      {!isVIP && hasEnoughForText && <Sparkles size={14} color="white" />}
                      <Text fontSize="$3" fontWeight="500" color="white">
                        {isVIP || hasEnoughForText ? '立刻咨询' : '付费 ¥200'}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </XStack>
            </YStack>
          </XStack>
        </View>

        {/* 视频咨询 */}
        <View
          backgroundColor="$color4"
          borderRadius="$5"
          padding="$2"
        >
          <XStack alignItems="flex-start" gap="$2.5">
            <View
              width={44}
              height={44}
              borderRadius={22}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Video size={22} color={primaryColor} />
            </View>
            <YStack flex={1} gap="$1.5">
              <Text fontSize="$4" fontWeight="600" color="$color12">视频咨询</Text>
              {isVIP || hasEnoughForVideo ? (
                <Text fontSize="$2" color="$success" fontWeight="500">
                  {isVIP ? 'VIP免费' : '会员免费 (消耗实际时长)'}
                </Text>
              ) : (
                <Text fontSize="$2" color="$color10">
                  ¥300/30分钟 · 实时连线
                </Text>
              )}

              <XStack gap="$2" marginTop="$1">
                <Pressable style={{ flex: 1 }} onPress={() => handleConsultationClick('video', 30)}>
                  <View
                    backgroundColor={isVIP || hasEnoughForVideo ? (isVIP ? GOLD_COLOR : '$success') : '$primary'}
                    paddingVertical="$2"
                    borderRadius="$10"
                    alignItems="center"
                  >
                    <XStack alignItems="center" gap="$1">
                      {isVIP && <Crown size={14} color="white" />}
                      {!isVIP && hasEnoughForVideo && <Sparkles size={14} color="white" />}
                      <Text fontSize="$3" fontWeight="500" color="white">
                        {isVIP || hasEnoughForVideo ? '立刻咨询' : '付费 ¥300'}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </XStack>
            </YStack>
          </XStack>
        </View>
      </View>
    );
  };

  const renderTabBar = () => {
    const tabs = [
      { key: 'info' as const, label: '资料', icon: User },
      { key: 'cases' as const, label: '案例', icon: Briefcase },
      { key: 'reviews' as const, label: '评价', icon: Star },
    ];

    return (
      <XStack backgroundColor="$color2" paddingHorizontal="$2.5" marginBottom="$2">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <Pressable key={tab.key} style={{ flex: 1 }} onPress={() => setActiveTab(tab.key)}>
              <View
                paddingVertical="$2"
                borderBottomWidth={2}
                borderBottomColor={isActive ? '$primary' : 'transparent'}
                alignItems="center"
              >
                <XStack alignItems="center" gap="$1">
                  <IconComponent size={18} color={isActive ? primaryColor : color10} />
                  <Text
                    fontSize="$3"
                    color={isActive ? '$primary' : '$color10'}
                    fontWeight={isActive ? '600' : '400'}
                  >
                    {tab.label}
                  </Text>
                </XStack>
              </View>
            </Pressable>
          );
        })}
      </XStack>
    );
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top} backgroundColor="white">
          <TitleBar title="律师详情" />
        </View>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text marginTop="$2" fontSize="$3" color="$color10">加载中...</Text>
        </YStack>
      </View>
    );
  }

  if (!lawyer) return null;

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar
          title="律师详情"
          actions={[
            {
              icon: Share,
              onPress: () => {},
            },
          ]}
        />
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {renderBasicInfo()}
        {renderMembershipStatusCard()}
        {renderTabBar()}
        {activeTab === 'info' && renderPricing()}
        {activeTab === 'cases' && renderSuccessCases()}
        {activeTab === 'reviews' && renderReviews()}
      </ScrollView>

    </View>
  );
};

export default LawyerDetailScreen;
