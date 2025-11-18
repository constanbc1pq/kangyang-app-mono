/**
 * ============================================================================
 * 律师详情页面 - LawyerDetailScreen
 * ============================================================================
 *
 * Phase 33.3: 律师详情
 *
 * 【功能概述】
 * - 展示律师完整资料，帮助用户全面了解律师专业能力
 * - 提供多种咨询方式入口
 *
 * 【主要功能】
 * 1. 律师资质展示：执业证号、专业领域、服务年限、成功率
 * 2. 教育背景与工作经历
 * 3. 擅长领域与成功案例展示
 * 4. 用户评价列表（星级、评论内容）
 * 5. 咨询价格明细（图文/电话/视频/上门）
 * 6. 立即咨询按钮组（快速发起咨询）
 *
 * ============================================================================
 */

import React, { useState } from 'react';
import { Alert, ActivityIndicator, Image as RNImage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Card, View, ScrollView, Button, Theme } from 'tamagui';
import {
  ArrowLeft,
  Share,
  User,
  CreditCard,
  GraduationCap,
  Trophy,
  CheckCircle,
  MessageCircle,
  Phone,
  Video,
  Home,
  Star,
  Briefcase,
  ChevronRight,
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
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LawyerProfile, LawyerSpecialty } from '../types/legalService';
import { getLawyerById } from '../services/legalService';
import { COLORS } from '@/constants/app';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
    };
  };
}

// 会员等级类型
type MembershipTier = 'basic' | 'standard' | 'premium' | 'vip_family';

// 用户会员信息
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

// 会员计划配额
const MEMBERSHIP_QUOTAS: Record<MembershipTier, number | '∞'> = {
  basic: 0,
  standard: 300,
  premium: 1000,
  vip_family: '∞',
};

// 会员计划名称
const MEMBERSHIP_NAMES: Record<MembershipTier, string> = {
  basic: '基础版',
  standard: '标准版',
  premium: '尊享版',
  vip_family: 'VIP家庭版',
};

// 会员计划颜色
const MEMBERSHIP_COLORS: Record<MembershipTier, string> = {
  basic: COLORS.textSecondary,
  standard: COLORS.primary,
  premium: COLORS.warning,
  vip_family: '#722ed1',
};

// Icon mapping for specialties
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

// Specialty labels
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

// Mock success cases data
interface SuccessCase {
  id: string;
  title: string;
  description: string;
  date: string;
}

// Mock review data
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
  const { lawyerId } = route.params;

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'cases' | 'reviews'>('info');
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      console.log('LawyerDetailScreen focused - loading lawyer:', lawyerId);
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
      console.log('📱 LawyerDetailScreen - 读取会员数据:', membershipData);

      if (membershipData) {
        const parsedData = JSON.parse(membershipData);
        console.log('✅ LawyerDetailScreen - 解析后的会员数据:', parsedData);
        console.log('🎯 当前会员等级:', parsedData.tier);
        console.log('⏰ 到期时间:', parsedData.expiresAt);
        console.log('📊 已用配额:', parsedData.usedQuota?.lawyerConsultation || 0);
        setUserMembership(parsedData);
      } else {
        console.warn('⚠️ LawyerDetailScreen - 未找到会员数据，创建基础版');
        // 默认为基础版
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
      console.error('❌ Error loading user membership:', error);
    }
  };

  const getSuccessCases = (): SuccessCase[] => {
    return [
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
  };

  const getReviews = (): Review[] => {
    return [
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
      {
        id: 'review_4',
        userName: '刘**',
        rating: 5,
        comment: '非常满意！律师专业素养高，帮我成功解决了房产继承问题。',
        date: '2024-01-10',
        consultationType: '视频咨询',
      },
    ];
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color="#fadb14"
          fill={i <= rating ? '#fadb14' : 'transparent'}
        />
      );
    }
    return <XStack gap="$0.5">{stars}</XStack>;
  };

  // 获取剩余配额
  const getRemainingQuota = (): number | '∞' => {
    if (!userMembership) return 0;
    const totalQuota = MEMBERSHIP_QUOTAS[userMembership.tier];
    if (totalQuota === '∞') return '∞';
    return Math.max(0, totalQuota - userMembership.usedQuota.lawyerConsultation);
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // 渲染会员权益状态卡片
  const renderMembershipStatusCard = () => {
    if (!userMembership) return null;

    const remaining = getRemainingQuota();
    const tierColor = MEMBERSHIP_COLORS[userMembership.tier];
    const tierName = MEMBERSHIP_NAMES[userMembership.tier];
    const isBasic = userMembership.tier === 'basic';
    const isVIP = userMembership.tier === 'vip_family';
    const isLowQuota = typeof remaining === 'number' && remaining < 50 && remaining > 0;
    const isOutOfQuota = typeof remaining === 'number' && remaining === 0;

    // 基础版用户
    if (isBasic) {
      return (
        <Card backgroundColor="#fff7e6" padding="$4" marginBottom="$2" borderRadius={0} borderWidth={1} borderColor="#ffa940">
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#ffe7ba"
              alignItems="center"
              justifyContent="center"
            >
              <AlertCircle size={28} color="#fa8c16" />
            </View>
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="bold" color="#d46b08" marginBottom="$1">
                当前为基础版用户
              </Text>
              <Text fontSize="$3" color="#ad6800" marginBottom="$3" lineHeight={20}>
                您暂无律师咨询权益{'\n'}升级至标准版即可享受300分钟免费咨询
              </Text>
              <Button
                backgroundColor={COLORS.primary}
                paddingHorizontal="$4"
                paddingVertical="$2.5"
                borderRadius="$10"
                onPress={() => navigation.navigate('LegalMembership')}
                pressStyle={{ scale: 0.98 }}
                alignSelf="flex-start"
              >
                <XStack alignItems="center" gap="$1.5">
                  <Crown size={18} color="white" />
                  <Text fontSize="$4" fontWeight="600" color="white">
                    立即升级会员
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </XStack>
        </Card>
      );
    }

    // VIP家庭版用户
    if (isVIP) {
      return (
        <Card
          backgroundColor="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
          padding="$4"
          marginBottom="$2"
          borderRadius={0}
          borderWidth={2}
          borderColor="#9333ea"
        >
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#a855f7"
              alignItems="center"
              justifyContent="center"
            >
              <Crown size={28} color="white" />
            </View>
            <YStack flex={1}>
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <Text fontSize="$5" fontWeight="bold" color="#7e22ce">
                  ⭐ VIP家庭版会员
                </Text>
              </XStack>
              <Text fontSize="$3" color="#6b21a8" marginBottom="$2" lineHeight={20}>
                ♾️ 无限次免费咨询{'\n'}
                🎖️ 专属律师团队服务 · 🏠 全年2次上门服务{'\n'}
                📞 24小时紧急法律援助
              </Text>
              <XStack alignItems="center" gap="$1.5">
                <Clock size={14} color="#7e22ce" />
                <Text fontSize="$2" color="#7e22ce">
                  有效期至：{formatDate(userMembership.expiresAt)}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </Card>
      );
    }

    // 标准版/尊享版 - 配额充足
    if (typeof remaining === 'number' && remaining >= 50) {
      return (
        <Card backgroundColor="#e6f7ff" padding="$4" marginBottom="$2" borderRadius={0} borderWidth={1} borderColor={tierColor}>
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={`${tierColor}20`}
              alignItems="center"
              justifyContent="center"
            >
              <CheckCircle size={28} color={tierColor} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="bold" color={tierColor} marginBottom="$1">
                ✅ {tierName}会员
              </Text>
              <Text fontSize="$3" color={COLORS.text} marginBottom="$2" lineHeight={20}>
                📊 剩余咨询配额：<Text fontWeight="bold">{remaining}分钟</Text>{'\n'}
                ≈ 可进行{Math.floor(remaining / 30)}次图文咨询或{Math.floor(remaining / 30)}-{Math.floor(remaining / 15)}次视频咨询
              </Text>
              <XStack alignItems="center" gap="$1.5">
                <Clock size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color={COLORS.textSecondary}>
                  有效期至：{formatDate(userMembership.expiresAt)}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </Card>
      );
    }

    // 配额不足（1-49分钟）
    if (isLowQuota) {
      return (
        <Card backgroundColor="#fff7e6" padding="$4" marginBottom="$2" borderRadius={0} borderWidth={1} borderColor="#ffa940">
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#ffe7ba"
              alignItems="center"
              justifyContent="center"
            >
              <AlertCircle size={28} color="#fa8c16" />
            </View>
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="bold" color="#d46b08" marginBottom="$1">
                ⚠️ {tierName}会员 - 配额即将用尽
              </Text>
              <Text fontSize="$3" color="#ad6800" marginBottom="$3" lineHeight={20}>
                📊 剩余咨询配额：<Text fontWeight="bold">{remaining}分钟</Text>{'\n'}
                不足单次咨询使用{'\n\n'}
                💡 建议：升级至{userMembership.tier === 'standard' ? '尊享版' : 'VIP家庭版'}或单次付费
              </Text>
              <Button
                backgroundColor={COLORS.primary}
                paddingHorizontal="$4"
                paddingVertical="$2.5"
                borderRadius="$10"
                onPress={() => navigation.navigate('LegalMembership')}
                pressStyle={{ scale: 0.98 }}
                alignSelf="flex-start"
              >
                <XStack alignItems="center" gap="$1.5">
                  <TrendingUp size={18} color="white" />
                  <Text fontSize="$4" fontWeight="600" color="white">
                    升级{userMembership.tier === 'standard' ? '尊享版' : 'VIP家庭版'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </XStack>
        </Card>
      );
    }

    // 配额已用完
    if (isOutOfQuota) {
      return (
        <Card backgroundColor="#fff1f0" padding="$4" marginBottom="$2" borderRadius={0} borderWidth={1} borderColor="#ff7875">
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#ffccc7"
              alignItems="center"
              justifyContent="center"
            >
              <AlertCircle size={28} color="#f5222d" />
            </View>
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="bold" color="#cf1322" marginBottom="$1">
                📛 {tierName}会员 - 配额已用完
              </Text>
              <Text fontSize="$3" color="#a8071a" marginBottom="$3" lineHeight={20}>
                📊 剩余咨询配额：<Text fontWeight="bold">0分钟</Text>{'\n'}
                今年度配额已全部使用{'\n\n'}
                📅 配额将于{formatDate(userMembership.expiresAt)}重置{'\n'}
                💡 升级{userMembership.tier === 'standard' ? '尊享版享1000分钟配额' : 'VIP家庭版享无限配额'}
              </Text>
              <Button
                backgroundColor={COLORS.primary}
                paddingHorizontal="$4"
                paddingVertical="$2.5"
                borderRadius="$10"
                onPress={() => navigation.navigate('LegalMembership')}
                pressStyle={{ scale: 0.98 }}
                alignSelf="flex-start"
              >
                <XStack alignItems="center" gap="$1.5">
                  <Crown size={18} color="white" />
                  <Text fontSize="$4" fontWeight="600" color="white">
                    升级{userMembership.tier === 'standard' ? '尊享版' : 'VIP家庭版'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </XStack>
        </Card>
      );
    }

    return null;
  };

  const renderBasicInfo = () => {
    if (!lawyer) return null;

    return (
      <Card backgroundColor="$cardBg" padding="$4" marginBottom="$2" borderRadius={0}>
        {/* Avatar and basic info */}
        <XStack marginBottom="$5">
          <YStack marginRight="$4" alignItems="center">
            {lawyer.avatar ? (
              <RNImage source={{ uri: lawyer.avatar }} style={{ width: 100, height: 100, borderRadius: 12 }} />
            ) : (
              <View
                width={100}
                height={100}
                borderRadius={12}
                backgroundColor={COLORS.surface}
                alignItems="center"
                justifyContent="center"
              >
                <User size={60} color={COLORS.textSecondary} />
              </View>
            )}
            {lawyer.isOnline && (
              <XStack
                alignItems="center"
                marginTop="$2"
                paddingHorizontal="$2"
                paddingVertical="$1"
                backgroundColor="#f0f9ff"
                borderRadius={12}
                gap="$1"
              >
                <View width={6} height={6} borderRadius={3} backgroundColor={COLORS.success} />
                <Text fontSize="$2" color={COLORS.success} fontWeight="500">在线</Text>
              </XStack>
            )}
          </YStack>

          <YStack flex={1}>
            <Text fontSize="$8" fontWeight="bold" color={COLORS.text} marginBottom="$1">
              {lawyer.name}
            </Text>
            <Text fontSize="$4" color={COLORS.textSecondary} marginBottom="$2">
              {lawyer.lawFirm}
            </Text>

            <XStack alignItems="center" marginBottom="$3" gap="$1">
              {renderStars(Math.floor(lawyer.rating))}
              <Text fontSize="$4" fontWeight="600" color={COLORS.text} marginLeft="$1">
                {lawyer.rating.toFixed(1)}
              </Text>
              <Text fontSize="$3" color={COLORS.textSecondary}>
                ({lawyer.reviewCount}条评价)
              </Text>
            </XStack>

            <XStack gap="$4">
              <YStack alignItems="center">
                <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                  {lawyer.yearsOfExperience}
                </Text>
                <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$0.5">
                  执业年限
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                  {lawyer.caseCount}
                </Text>
                <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$0.5">
                  办案数
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                  {(lawyer.successRate * 100).toFixed(0)}%
                </Text>
                <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$0.5">
                  胜诉率
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </XStack>

        {/* Credentials */}
        <YStack
          paddingVertical="$4"
          borderTopWidth={1}
          borderTopColor={COLORS.border}
          gap="$3"
        >
          <XStack alignItems="center">
            <CreditCard size={18} color={COLORS.primary} />
            <Text fontSize="$4" color={COLORS.textSecondary} marginLeft="$2">
              执业证号：
            </Text>
            <Text fontSize="$4" color={COLORS.text} flex={1}>
              {lawyer.licenseNumber}
            </Text>
          </XStack>
          <XStack alignItems="center">
            <GraduationCap size={18} color={COLORS.primary} />
            <Text fontSize="$4" color={COLORS.textSecondary} marginLeft="$2">
              教育背景：
            </Text>
            <Text fontSize="$4" color={COLORS.text} flex={1}>
              {lawyer.education}
            </Text>
          </XStack>
        </YStack>

        {/* Specialties */}
        <YStack paddingTop="$4" borderTopWidth={1} borderTopColor={COLORS.border}>
          <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$3">
            专业领域
          </Text>
          <XStack flexWrap="wrap" gap="$3">
            {lawyer.specialties.map(specialty => {
              const IconComponent = getIconForSpecialty(specialty);
              return (
                <YStack
                  key={specialty}
                  width="30%"
                  alignItems="center"
                  padding="$3"
                  backgroundColor="#f0f9ff"
                  borderRadius={8}
                >
                  <IconComponent size={24} color={COLORS.primary} />
                  <Text fontSize="$3" color={COLORS.primary} marginTop="$1.5" fontWeight="500">
                    {SPECIALTY_LABELS[specialty]}
                  </Text>
                </YStack>
              );
            })}
          </XStack>
        </YStack>

        {/* Introduction */}
        <YStack paddingTop="$4" borderTopWidth={1} borderTopColor={COLORS.border}>
          <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$3">
            个人简介
          </Text>
          <Text fontSize="$4" color={COLORS.textSecondary} lineHeight={22}>
            {lawyer.introduction}
          </Text>
        </YStack>

        {/* Achievements */}
        {lawyer.achievements && lawyer.achievements.length > 0 && (
          <YStack paddingTop="$4" borderTopWidth={1} borderTopColor={COLORS.border}>
            <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$3">
              主要成就
            </Text>
            {lawyer.achievements.map((achievement, index) => (
              <XStack key={index} alignItems="center" marginBottom="$2">
                <Trophy size={16} color="#fadb14" />
                <Text fontSize="$4" color={COLORS.textSecondary} marginLeft="$2">
                  {achievement}
                </Text>
              </XStack>
            ))}
          </YStack>
        )}
      </Card>
    );
  };

  const renderSuccessCases = () => {
    const cases = getSuccessCases();

    return (
      <Card backgroundColor="$cardBg" padding="$4" marginBottom="$2" borderRadius={0}>
        <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$3">
          成功案例
        </Text>
        {cases.map(caseItem => (
          <Card
            key={caseItem.id}
            backgroundColor={COLORS.surface}
            borderRadius={12}
            padding="$4"
            marginBottom="$3"
          >
            <XStack marginBottom="$3">
              <CheckCircle size={20} color={COLORS.success} style={{ marginRight: 12 }} />
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color={COLORS.text} marginBottom="$1">
                  {caseItem.title}
                </Text>
                <Text fontSize="$2" color={COLORS.textSecondary}>
                  {caseItem.date}
                </Text>
              </YStack>
            </XStack>
            <Text fontSize="$4" color={COLORS.textSecondary} lineHeight={22}>
              {caseItem.description}
            </Text>
          </Card>
        ))}
      </Card>
    );
  };

  const renderReviews = () => {
    const reviews = getReviews();

    return (
      <Card backgroundColor="$cardBg" padding="$4" marginBottom="$2" borderRadius={0}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <Text fontSize="$5" fontWeight="bold" color={COLORS.text}>
            用户评价
          </Text>
          <Text fontSize="$3" color={COLORS.textSecondary}>
            共{reviews.length}条
          </Text>
        </XStack>

        {reviews.map(review => (
          <Card
            key={review.id}
            backgroundColor={COLORS.surface}
            borderRadius={12}
            padding="$4"
            marginBottom="$3"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <XStack alignItems="center">
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor="#e6e6e6"
                  alignItems="center"
                  justifyContent="center"
                  marginRight="$2.5"
                >
                  <User size={20} color={COLORS.textSecondary} />
                </View>
                <YStack>
                  <Text fontSize="$4" fontWeight="600" color={COLORS.text}>
                    {review.userName}
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$0.5">
                    {review.date}
                  </Text>
                </YStack>
              </XStack>
              <View
                paddingHorizontal="$2.5"
                paddingVertical="$1"
                backgroundColor="#e6f7ff"
                borderRadius={10}
              >
                <Text fontSize="$1" color={COLORS.primary}>
                  {review.consultationType}
                </Text>
              </View>
            </XStack>

            <View marginBottom="$2">
              {renderStars(review.rating)}
            </View>

            <Text fontSize="$4" color={COLORS.textSecondary} lineHeight={22}>
              {review.comment}
            </Text>
          </Card>
        ))}
      </Card>
    );
  };

  // 处理咨询按钮点击
  const handleConsultationClick = (type: 'text' | 'video', quotaNeeded: number) => {
    if (!userMembership || !lawyer) return;

    const remaining = getRemainingQuota();
    const isBasic = userMembership.tier === 'basic';
    const isVIP = userMembership.tier === 'vip_family';
    const hasEnoughQuota = typeof remaining === 'number' && remaining >= quotaNeeded;
    const hasPartialQuota = typeof remaining === 'number' && remaining > 0 && remaining < quotaNeeded;

    // VIP用户 - 直接免费咨询
    if (isVIP) {
      const screen = type === 'text' ? 'TextConsultation' : 'VideoConsultation';
      navigation.navigate(screen, { lawyerId: lawyer.id });
      return;
    }

    // 有足够配额的会员 - 直接免费咨询
    if (hasEnoughQuota || remaining === '∞') {
      const screen = type === 'text' ? 'TextConsultation' : 'VideoConsultation';
      navigation.navigate(screen, { lawyerId: lawyer.id });
      return;
    }

    // 基础版或配额不足/用完 - 显示选择对话框
    const price = type === 'text' ? 200 : 300;
    const partialQuota = typeof remaining === 'number' ? remaining : 0;
    const deficit = quotaNeeded - partialQuota;
    const deficitPrice = Math.round((deficit / quotaNeeded) * price);

    const options = [];

    if (hasPartialQuota) {
      options.push({
        text: `使用${partialQuota}分钟配额+补¥${deficitPrice}`,
        onPress: () => {
          // TODO: 进入支付页面，支付补差价
          Alert.alert('开发中', '补差价功能开发中');
        },
      });
    }

    options.push(
      {
        text: `单次付费 ¥${price}`,
        onPress: () => {
          // TODO: 进入支付页面，单次付费
          Alert.alert('开发中', '单次付费功能开发中');
        },
      },
      {
        text: isBasic ? '升级会员更划算 👑' : '升级会员',
        onPress: () => {
          navigation.navigate('LegalMembership');
        },
      },
      {
        text: '取消',
        style: 'cancel',
      }
    );

    Alert.alert(
      hasPartialQuota ? '配额不足' : (isBasic ? '升级会员享免费咨询' : '配额已用完'),
      hasPartialQuota
        ? `本次咨询需要${quotaNeeded}分钟配额，您剩余${partialQuota}分钟\n\n请选择支付方式：`
        : isBasic
        ? `单次咨询¥${price}，升级标准版会员可享300分钟免费配额\n\n请选择：`
        : `本次咨询需要¥${price}，或升级享更多配额\n\n请选择：`,
      options
    );
  };

  const renderPricing = () => {
    if (!lawyer || !userMembership) return null;

    const remaining = getRemainingQuota();
    const isBasic = userMembership.tier === 'basic';
    const isVIP = userMembership.tier === 'vip_family';
    const tierName = MEMBERSHIP_NAMES[userMembership.tier];

    // 图文咨询配置
    const textConsultationQuota = 30; // 30分钟配额
    const hasEnoughForText = isVIP || remaining === '∞' || (typeof remaining === 'number' && remaining >= textConsultationQuota);
    const textPartialQuota = typeof remaining === 'number' && remaining > 0 && remaining < textConsultationQuota;

    // 视频咨询配置
    const videoConsultationQuota = 30; // 30分钟配额
    const hasEnoughForVideo = isVIP || remaining === '∞' || (typeof remaining === 'number' && remaining >= videoConsultationQuota);
    const videoPartialQuota = typeof remaining === 'number' && remaining > 0 && remaining < videoConsultationQuota;

    return (
      <Card backgroundColor="$cardBg" padding="$4" marginBottom="$2" borderRadius={0}>
        <Text fontSize="$5" fontWeight="bold" color={COLORS.text} marginBottom="$3">
          咨询服务
        </Text>

        {/* 图文咨询卡片 */}
        <Card
          backgroundColor={COLORS.surface}
          borderRadius={12}
          padding="$4"
          marginBottom="$3"
        >
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#e6f7ff"
              alignItems="center"
              justifyContent="center"
            >
              <MessageCircle size={28} color={COLORS.primary} />
            </View>
            <YStack flex={1} gap="$2">
              <Text fontSize="$5" fontWeight="600" color={COLORS.text}>
                📝 图文咨询
              </Text>

              {isVIP ? (
                <YStack gap="$1">
                  <Text fontSize="$3" color="#6b21a8" fontWeight="600">
                    ⭐ VIP会员专享 · 免费咨询
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    无限次使用，无时长限制 · 专属律师优先响应
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$1">
                    💰 非会员价格：¥200/次
                  </Text>
                </YStack>
              ) : hasEnoughForText ? (
                <YStack gap="$1">
                  <Text fontSize="$3" color={COLORS.success} fontWeight="600">
                    ✅ 会员免费 (消耗30分钟配额)
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    包含：1个法律问题 + 3次追问 · 律师48小时内回复
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$1">
                    💰 非会员价格：¥200/次
                  </Text>
                </YStack>
              ) : textPartialQuota ? (
                <YStack gap="$1">
                  <Text fontSize="$3" color="#d46b08" fontWeight="600">
                    ⚠️ 配额不足单次使用
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    本次咨询需要30分钟配额{'\n'}
                    您剩余{remaining}分钟，需补¥{Math.round(((30 - (remaining as number)) / 30) * 200)}差价
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$1">
                    💰 或直接单次付费：¥200/次
                  </Text>
                </YStack>
              ) : (
                <YStack gap="$1">
                  <Text fontSize="$3" color={COLORS.textSecondary}>
                    {isBasic ? '包含：1个法律问题 + 3次追问' : '💰 ¥200/次（会员配额已用完）'}
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    {isBasic ? '律师48小时内回复' : '包含：1个法律问题 + 3次追问 · 律师48小时内回复'}
                  </Text>
                  <Text fontSize="$2" color={isBasic ? COLORS.primary : COLORS.textSecondary} marginTop="$1" fontWeight={isBasic ? '600' : '400'}>
                    {isBasic ? '💡 升级标准版会员可免费咨询（省¥200）' : '💡 升级尊享版可获得1000分钟配额'}
                  </Text>
                </YStack>
              )}

              <XStack gap="$2" marginTop="$2">
                {isVIP || hasEnoughForText ? (
                  <Button
                    flex={1}
                    backgroundColor={isVIP ? '#a855f7' : COLORS.success}
                    borderRadius="$3"
                    paddingVertical="$2.5"
                    onPress={() => handleConsultationClick('text', 30)}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <XStack alignItems="center" gap="$1.5">
                      {isVIP && <Crown size={16} color="white" />}
                      {!isVIP && <Sparkles size={16} color="white" />}
                      <Text fontSize="$3" fontWeight="600" color="white">
                        {isVIP ? 'VIP免费咨询' : '会员免费咨询'}
                      </Text>
                    </XStack>
                  </Button>
                ) : (
                  <>
                    <Button
                      flex={1}
                      backgroundColor={COLORS.surface}
                      borderWidth={1}
                      borderColor={COLORS.primary}
                      borderRadius="$3"
                      paddingVertical="$2.5"
                      onPress={() => handleConsultationClick('text', 30)}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                        {textPartialQuota ? `补¥${Math.round(((30 - (remaining as number)) / 30) * 200)}咨询` : '单次付费 ¥200'}
                      </Text>
                    </Button>
                    <Button
                      flex={1}
                      backgroundColor={COLORS.primary}
                      borderRadius="$3"
                      paddingVertical="$2.5"
                      onPress={() => navigation.navigate('LegalMembership')}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <XStack alignItems="center" gap="$1.5">
                        <Crown size={16} color="white" />
                        <Text fontSize="$3" fontWeight="600" color="white">
                          升级会员
                        </Text>
                      </XStack>
                    </Button>
                  </>
                )}
              </XStack>
            </YStack>
          </XStack>
        </Card>

        {/* 视频咨询卡片 */}
        <Card
          backgroundColor={COLORS.surface}
          borderRadius={12}
          padding="$4"
          marginBottom="$3"
        >
          <XStack alignItems="flex-start" gap="$3">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#e6f7ff"
              alignItems="center"
              justifyContent="center"
            >
              <Video size={28} color={COLORS.primary} />
            </View>
            <YStack flex={1} gap="$2">
              <Text fontSize="$5" fontWeight="600" color={COLORS.text}>
                📹 视频咨询
              </Text>

              {isVIP ? (
                <YStack gap="$1">
                  <Text fontSize="$3" color="#6b21a8" fontWeight="600">
                    ⭐ VIP会员专享 · 免费通话
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    无限次使用，无时长限制 · 专属律师团队实时连线
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$1">
                    💰 非会员价格：¥300/30分钟
                  </Text>
                </YStack>
              ) : hasEnoughForVideo ? (
                <YStack gap="$1">
                  <Text fontSize="$3" color={COLORS.success} fontWeight="600">
                    ✅ 会员免费 (消耗实际通话时长)
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    实时连线律师，面对面沟通 · 建议通话时长：30分钟内
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$1">
                    💰 非会员价格：¥300/30分钟
                  </Text>
                </YStack>
              ) : videoPartialQuota ? (
                <YStack gap="$1">
                  <Text fontSize="$3" color="#d46b08" fontWeight="600">
                    ⚠️ 配额不足
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    您剩余{remaining}分钟配额{'\n'}
                    建议通话时长30分钟，需补¥{Math.round(((30 - (remaining as number)) / 30) * 300)}差价
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary} marginTop="$1">
                    💰 或直接单次付费：¥300/30分钟
                  </Text>
                </YStack>
              ) : (
                <YStack gap="$1">
                  <Text fontSize="$3" color={COLORS.textSecondary}>
                    {isBasic ? '实时连线律师，面对面沟通' : '💰 ¥300/30分钟（会员配额已用完）'}
                  </Text>
                  <Text fontSize="$2" color={COLORS.textSecondary}>
                    {isBasic ? '超出30分钟按¥10/分钟计费' : '实时连线律师，面对面沟通 · 超时按¥10/分钟计费'}
                  </Text>
                  <Text fontSize="$2" color={isBasic ? COLORS.primary : COLORS.textSecondary} marginTop="$1" fontWeight={isBasic ? '600' : '400'}>
                    {isBasic ? '💡 升级标准版会员可免费咨询（省¥300）' : '💡 升级尊享版可获得1000分钟配额'}
                  </Text>
                </YStack>
              )}

              <XStack gap="$2" marginTop="$2">
                {isVIP || hasEnoughForVideo ? (
                  <Button
                    flex={1}
                    backgroundColor={isVIP ? '#a855f7' : COLORS.success}
                    borderRadius="$3"
                    paddingVertical="$2.5"
                    onPress={() => handleConsultationClick('video', 30)}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <XStack alignItems="center" gap="$1.5">
                      {isVIP && <Crown size={16} color="white" />}
                      {!isVIP && <Sparkles size={16} color="white" />}
                      <Text fontSize="$3" fontWeight="600" color="white">
                        {isVIP ? 'VIP免费通话' : '会员免费通话'}
                      </Text>
                    </XStack>
                  </Button>
                ) : (
                  <>
                    <Button
                      flex={1}
                      backgroundColor={COLORS.surface}
                      borderWidth={1}
                      borderColor={COLORS.primary}
                      borderRadius="$3"
                      paddingVertical="$2.5"
                      onPress={() => handleConsultationClick('video', 30)}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                        {videoPartialQuota ? `补¥${Math.round(((30 - (remaining as number)) / 30) * 300)}通话` : '单次付费 ¥300'}
                      </Text>
                    </Button>
                    <Button
                      flex={1}
                      backgroundColor={COLORS.primary}
                      borderRadius="$3"
                      paddingVertical="$2.5"
                      onPress={() => navigation.navigate('LegalMembership')}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <XStack alignItems="center" gap="$1.5">
                        <Crown size={16} color="white" />
                        <Text fontSize="$3" fontWeight="600" color="white">
                          升级会员
                        </Text>
                      </XStack>
                    </Button>
                  </>
                )}
              </XStack>
            </YStack>
          </XStack>
        </Card>
      </Card>
    );
  };

  const renderTabBar = () => {
    const tabs = [
      { key: 'info' as const, label: '资料', icon: User },
      { key: 'cases' as const, label: '案例', icon: Briefcase },
      { key: 'reviews' as const, label: '评价', icon: Star },
    ];

    return (
      <XStack backgroundColor="$cardBg" paddingHorizontal="$4" marginBottom="$2">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              flex={1}
              backgroundColor="transparent"
              borderBottomWidth={2}
              borderBottomColor={isActive ? COLORS.primary : 'transparent'}
              borderRadius={0}
              paddingVertical="$3"
              onPress={() => setActiveTab(tab.key)}
              pressStyle={{ opacity: 0.7 }}
            >
              <XStack alignItems="center" gap="$1">
                <IconComponent
                  size={20}
                  color={isActive ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  fontSize="$4"
                  color={isActive ? COLORS.primary : COLORS.textSecondary}
                  fontWeight={isActive ? '600' : '400'}
                >
                  {tab.label}
                </Text>
              </XStack>
            </Button>
          );
        })}
      </XStack>
    );
  };

  if (loading) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="$4"
            paddingVertical="$3"
            backgroundColor="$cardBg"
            borderBottomWidth={1}
            borderBottomColor={COLORS.border}
          >
            <Button chromeless padding="$1" onPress={() => navigation.goBack()} pressStyle={{ opacity: 0.6 }}>
              <ArrowLeft size={24} color={COLORS.text} />
            </Button>
            <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>律师详情</Text>
            <View width={40} />
          </XStack>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text marginTop="$3" fontSize="$4" color={COLORS.textSecondary}>加载中...</Text>
          </YStack>
        </SafeAreaView>
      </Theme>
    );
  }

  if (!lawyer) {
    return null;
  }

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor="$cardBg"
          borderBottomWidth={1}
          borderBottomColor={COLORS.border}
        >
          <Button chromeless padding="$1" onPress={() => navigation.goBack()} pressStyle={{ opacity: 0.6 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Button>
          <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>律师详情</Text>
          <Button chromeless padding="$1" pressStyle={{ opacity: 0.6 }}>
            <Share size={22} color={COLORS.text} />
          </Button>
        </XStack>

        {/* Content */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {renderBasicInfo()}
          {renderMembershipStatusCard()}
          {renderTabBar()}
          {activeTab === 'info' && renderPricing()}
          {activeTab === 'cases' && renderSuccessCases()}
          {activeTab === 'reviews' && renderReviews()}
        </ScrollView>

        {/* Bottom bar */}
        <XStack
          padding="$4"
          backgroundColor="$cardBg"
          borderTopWidth={1}
          borderTopColor={COLORS.border}
          paddingBottom={insets.bottom + 16}
        >
          <Button
            flex={1}
            backgroundColor={COLORS.primary}
            borderRadius={24}
            paddingVertical="$3.5"
            onPress={() => {
              navigation.navigate('Checkout', {
                itemType: 'legal_consultation',
                itemId: lawyer.id,
                itemName: `${lawyer.name} 律师咨询服务`,
                price: 100,
                providerId: lawyer.id,
                providerName: lawyer.name,
                serviceType: 'legal_consultation',
              });
            }}
            pressStyle={{ scale: 0.98 }}
          >
            <XStack alignItems="center" gap="$2" justifyContent="center">
              <Text fontSize="$6" fontWeight="bold" color="white">充值咨询费</Text>
            </XStack>
          </Button>
        </XStack>
      </SafeAreaView>
    </Theme>
  );
};

export default LawyerDetailScreen;
