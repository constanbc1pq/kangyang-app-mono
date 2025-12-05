/**
 * 个性化智能推荐Banner组件
 * 根据用户画像、健康数据、行为数据动态推荐服务
 */

import React from 'react';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { Sparkles, ArrowRight } from 'lucide-react-native';

interface RecommendationData {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  icon: string;
  targetScreen: string;
  targetParams?: any;
  badge?: string; // "免费" | "新用户专享" | "限时优惠"
}

interface PersonalizedRecommendationBannerProps {
  recommendation: RecommendationData;
  onPress: (screen: string, params?: any) => void;
}

export const PersonalizedRecommendationBanner: React.FC<PersonalizedRecommendationBannerProps> = ({
  recommendation,
  onPress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const accentColor = theme.accent?.val;
  const gradientColors = [primaryColor, accentColor] as [string, string];

  return (
    <View marginBottom="$2">
      <Pressable
        onPress={() => onPress(recommendation.targetScreen, recommendation.targetParams)}
      >
        <View borderRadius="$5" overflow="hidden">
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 16, minHeight: 140 }}
          >
            <YStack gap="$2">
              {/* 顶部标签和图标 */}
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap="$1.5">
                  <Sparkles size={20} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="600">
                    为您推荐
                  </Text>
                </XStack>
                {recommendation.badge && (
                  <View
                    backgroundColor="rgba(255,255,255,0.25)"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$2" color="white" fontWeight="600">
                      {recommendation.badge}
                    </Text>
                  </View>
                )}
              </XStack>

              {/* 标题 */}
              <Text fontSize="$6" fontWeight="700" color="white">
                {recommendation.title}
              </Text>

              {/* 描述 */}
              <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                {recommendation.description}
              </Text>

              {/* CTA按钮 */}
              <XStack
                backgroundColor="white"
                alignSelf="flex-start"
                paddingHorizontal="$2"
                paddingVertical="$1.5"
                borderRadius="$10"
                alignItems="center"
                gap="$1.5"
                marginTop="$1"
              >
                <Text color="$primary" fontWeight="600" fontSize="$3">
                  {recommendation.ctaText}
                </Text>
                <ArrowRight size={16} color={primaryColor} />
              </XStack>
            </YStack>
          </LinearGradient>
        </View>
      </Pressable>
    </View>
  );
};

/**
 * 生成个性化推荐
 * 根据用户画像返回推荐内容
 */
export const generateRecommendation = (userProfile: {
  age?: number;
  healthScore?: number;
  hasChronicDisease?: boolean;
  isNewUser?: boolean;
  livingAlone?: boolean;
}): RecommendationData => {
  const { age, healthScore, hasChronicDisease, isNewUser, livingAlone } = userProfile;

  // 新用户：推荐AI健康规划
  if (isNewUser) {
    return {
      id: 'new_user_ai',
      title: '开启您的健康管理之旅',
      description: 'AI智能分析，3分钟生成专属健康方案',
      ctaText: '立即体验',
      icon: '🤖',
      targetScreen: 'InsuranceHome',
      badge: '新用户专享',
    };
  }

  // 50-60岁 + 健康状况良好：推荐营养配餐
  if (age && age >= 50 && age <= 60 && healthScore && healthScore >= 75) {
    return {
      id: 'nutrition_50_60',
      title: '营养配餐 + 闪送到家',
      description: '营养师定制方案，每日新鲜配送，首周特惠',
      ctaText: '查看套餐',
      icon: '🍱',
      targetScreen: 'NutritionService',
      badge: '限时优惠',
    };
  }

  // 60-70岁 + 独居：推荐闪送到家
  if (age && age >= 60 && age <= 70 && livingAlone) {
    return {
      id: 'meal_delivery_senior',
      title: '子女不在身边？我们来照顾您',
      description: '营养三餐配送到家，专属营养师咨询服务',
      ctaText: '了解详情',
      icon: '🏠',
      targetScreen: 'DeliveryService',
      badge: '专属服务',
    };
  }

  // 有慢性病：推荐私人医生
  if (hasChronicDisease) {
    return {
      id: 'private_doctor_chronic',
      title: '24小时健康守护，专属医生管理',
      description: '专业医生团队，慢病管理方案，首月体验价',
      ctaText: '预约医生',
      icon: '👨‍⚕️',
      targetScreen: 'PrivateDoctorList',
      badge: '首月特惠',
    };
  }

  // 高净值人群（50岁以上）：推荐财富传承服务
  if (age && age >= 50) {
    return {
      id: 'wealth_planning',
      title: '为家人的未来，做好准备',
      description: '遗嘱法律咨询 + 保险规划，专业顾问服务',
      ctaText: '专家咨询',
      icon: '📜',
      targetScreen: 'LegalServiceHome',
      badge: '专业咨询',
    };
  }

  // 默认：推荐专家咨询
  return {
    id: 'default_expert',
    title: '专家一对一咨询服务',
    description: '营养师、医生、律师、顾问，15分钟深度沟通',
    ctaText: '立即咨询',
    icon: '💬',
    targetScreen: 'PrivateDoctorList',
    badge: '立即预约',
  };
};
