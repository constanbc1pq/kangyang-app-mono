/**
 * 今日推荐大卡片组件
 * 每日轮换展示6大板块服务
 */

import React from 'react';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import { Star, Users, TrendingUp } from 'lucide-react-native';

export interface TodayRecommendation {
  id: string;
  category: 'nutrition' | 'meal_delivery' | 'elderly' | 'private_doctor' | 'legal' | 'insurance';
  title: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string; // "限今日" | "新品" | "热销"
  stats: {
    userCount?: number; // 已服务用户数
    rating?: number; // 好评率
    salesCount?: number; // 销量
  };
  icon: string;
  targetScreen: string;
  targetParams?: any;
}

interface TodayRecommendationCardProps {
  recommendation: TodayRecommendation;
  onPurchase: (screen: string, params?: any) => void;
  onConsult: (screen: string, params?: any) => void;
}

export const TodayRecommendationCard: React.FC<TodayRecommendationCardProps> = ({
  recommendation,
  onPurchase,
  onConsult,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;
  const warningColor = theme.warning?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;

  return (
    <View marginBottom="$2">
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        padding="$2"
        borderWidth={1}
        borderColor="$color5"
      >
        <YStack gap="$3">
          {/* 顶部标签 */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <Text fontSize={24}>{recommendation.icon}</Text>
              <Text fontSize="$2" color="$color10">
                今日推荐
              </Text>
            </XStack>
            {recommendation.badge && (
              <View
                backgroundColor={errorColor}
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

          {/* 标题和副标题 */}
          <YStack gap="$1">
            <Text fontSize="$6" fontWeight="700" color="$color12">
              {recommendation.title}
            </Text>
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              {recommendation.subtitle}
            </Text>
          </YStack>

          {/* 描述 */}
          <Text fontSize="$3" color="$color12" lineHeight={22}>
            {recommendation.description}
          </Text>

          {/* 社交证明 */}
          <XStack gap="$2" flexWrap="wrap">
            {recommendation.stats.userCount && (
              <XStack alignItems="center" gap="$0.5">
                <Users size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  已服务 {recommendation.stats.userCount.toLocaleString()} 人
                </Text>
              </XStack>
            )}
            {recommendation.stats.rating && (
              <XStack alignItems="center" gap="$0.5">
                <Star size={14} color={warningColor} fill={warningColor} />
                <Text fontSize="$2" color="$color10">
                  好评率 {recommendation.stats.rating}%
                </Text>
              </XStack>
            )}
            {recommendation.stats.salesCount && (
              <XStack alignItems="center" gap="$0.5">
                <TrendingUp size={14} color={successColor} />
                <Text fontSize="$2" color="$color10">
                  本月售出 {recommendation.stats.salesCount} 份
                </Text>
              </XStack>
            )}
          </XStack>

          {/* 价格和按钮 */}
          <XStack justifyContent="space-between" alignItems="center" marginTop="$1.5">
            <YStack>
              <XStack alignItems="baseline" gap="$0.5">
                <Text fontSize="$2" color="$error">
                  ¥
                </Text>
                <Text fontSize="$7" fontWeight="700" color="$error">
                  {recommendation.price}
                </Text>
                {recommendation.originalPrice && (
                  <Text
                    fontSize="$3"
                    color="$color10"
                    textDecorationLine="line-through"
                  >
                    ¥{recommendation.originalPrice}
                  </Text>
                )}
              </XStack>
              <Text fontSize="$2" color="$color10">
                起/周
              </Text>
            </YStack>

            <XStack gap="$1.5">
              <Pressable
                onPress={() => onConsult(recommendation.targetScreen, recommendation.targetParams)}
              >
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor="$primary"
                >
                  <Text color="$primary" fontSize="$3" fontWeight="600">
                    专家咨询
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => onPurchase(recommendation.targetScreen, recommendation.targetParams)}
              >
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor="$primary"
                >
                  <Text color="white" fontSize="$3" fontWeight="600">
                    立即订购
                  </Text>
                </View>
              </Pressable>
            </XStack>
          </XStack>
        </YStack>
      </View>
    </View>
  );
};

/**
 * 生成今日推荐
 * 根据日期轮换不同服务
 */
export const generateTodayRecommendation = (date: Date = new Date()): TodayRecommendation => {
  const dayOfWeek = date.getDay(); // 0-6 (Sunday-Saturday)

  const recommendations: TodayRecommendation[] = [
    // 周日：营养配餐
    {
      id: 'nutrition_sunday',
      category: 'nutrition',
      title: '营养配餐·三高调理套餐',
      subtitle: '张营养师的专属方案',
      description: '针对三高人群定制，低盐低脂低糖，每日新鲜食材配送',
      price: '198',
      originalPrice: '298',
      badge: '限今日',
      stats: {
        userCount: 1280,
        rating: 98,
      },
      icon: '🍱',
      targetScreen: 'NutritionService',
    },
    // 周一：闪送到家
    {
      id: 'meal_monday',
      category: 'meal_delivery',
      title: '闪送到家·每日三餐',
      subtitle: '独居老人的贴心选择',
      description: '营养均衡三餐，准时送达，热乎新鲜，解决做饭难题',
      price: '258',
      originalPrice: '298',
      badge: '限今日',
      stats: {
        userCount: 890,
        rating: 99,
      },
      icon: '🚗',
      targetScreen: 'DeliveryService',
    },
    // 周二：养老服务
    {
      id: 'elderly_tuesday',
      category: 'elderly',
      title: '养老服务·居家护理',
      subtitle: '专业护理团队',
      description: '日常护理、健康监测、陪伴服务，让晚年生活更有品质',
      price: '399',
      badge: '热销',
      stats: {
        userCount: 560,
        rating: 97,
      },
      icon: '🏡',
      targetScreen: 'ElderlyService',
    },
    // 周三：私人医生
    {
      id: 'doctor_wednesday',
      category: 'private_doctor',
      title: '私人医生·全程守护',
      subtitle: '24小时专属健康管家',
      description: '专业医生团队，慢病管理，健康咨询，就医绿通',
      price: '399',
      badge: '新品',
      stats: {
        userCount: 720,
        rating: 99,
      },
      icon: '👨‍⚕️',
      targetScreen: 'PrivateDoctorList',
    },
    // 周四：法律服务
    {
      id: 'legal_thursday',
      category: 'legal',
      title: '遗嘱法律·专业咨询',
      subtitle: '资深律师一对一服务',
      description: '遗嘱起草、财产分配、法律咨询，保护您的合法权益',
      price: '咨询',
      badge: '专业服务',
      stats: {
        userCount: 1850,
        rating: 98,
      },
      icon: '📜',
      targetScreen: 'LegalServiceHome',
    },
    // 周五：保险规划
    {
      id: 'insurance_friday',
      category: 'insurance',
      title: '保险规划·AI智能方案',
      subtitle: '专业顾问一对一服务',
      description: 'AI分析保障缺口，顾问一对一规划，找到最适合您的保险',
      price: '咨询',
      badge: '智能分析',
      stats: {
        userCount: 2100,
        rating: 97,
      },
      icon: '🛡️',
      targetScreen: 'InsuranceHome',
    },
    // 周六：综合推荐
    {
      id: 'combo_saturday',
      category: 'nutrition',
      title: '健康养老全包套餐',
      subtitle: '营养配餐 + 私人医生 + 养老服务',
      description: '三合一超值组合，省心省力，全方位守护您的健康',
      price: '1980',
      originalPrice: '2680',
      badge: '限今日',
      stats: {
        userCount: 89,
        salesCount: 89,
      },
      icon: '💎',
      targetScreen: 'NutritionService',
    },
  ];

  return recommendations[dayOfWeek];
};
