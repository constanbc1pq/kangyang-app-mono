/**
 * 组合套餐卡片组件
 * 展示服务组合套餐，提高客单价
 */

import React from 'react';
import { View, Text, YStack, XStack, Card } from 'tamagui';
import { Pressable, ScrollView } from 'react-native';
import { CheckCircle, TrendingDown } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export interface ComboPackageItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: string[]; // 包含的服务列表
  originalPrice: number;
  packagePrice: number;
  savings: number; // 节省金额
  subscriberCount?: number; // 订阅人数
  familyCount?: number; // 服务家庭数
  badge?: string; // "热销" | "限时优惠" | "免费咨询"
  isFree?: boolean; // 是否为免费咨询套餐
  primaryCTA: string;
  secondaryCTA?: string;
  targetScreen: string;
  targetParams?: any;
  consultScreen?: string;
}

interface ComboPackageCardProps {
  package: ComboPackageItem;
  onPurchase: (screen: string, params?: any) => void;
  onCustomize?: (screen: string, params?: any) => void;
}

const ComboPackageCardItem: React.FC<ComboPackageCardProps> = ({
  package: pkg,
  onPurchase,
  onCustomize,
}) => {
  const discountPercentage = Math.round((pkg.savings / pkg.originalPrice) * 100);

  return (
    <Card
      bordered
      padding="$4"
      backgroundColor="$surface"
      shadowColor="$shadow"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={6}
      elevation={3}
      marginBottom={16}
    >
      <YStack space="$3">
        {/* 顶部：标题和徽章 */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <XStack alignItems="center" space="$2" flex={1}>
            <Text fontSize={28}>{pkg.icon}</Text>
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="700" color="$text">
                {pkg.name}
              </Text>
              <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                {pkg.description}
              </Text>
            </YStack>
          </XStack>
          {pkg.badge && (
            <View
              backgroundColor={pkg.isFree ? COLORS.success : COLORS.error}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="white" fontWeight="600">
                {pkg.badge}
              </Text>
            </View>
          )}
        </XStack>

        {/* 包含的服务列表 */}
        <View
          backgroundColor="$background"
          padding="$3"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
            套餐包含：
          </Text>
          <YStack space="$2">
            {pkg.services.map((service, index) => (
              <XStack key={index} alignItems="center" space="$2">
                <CheckCircle size={16} color={COLORS.primary} />
                <Text fontSize="$3" color="$text" fontWeight="500">
                  {service}
                </Text>
              </XStack>
            ))}
          </YStack>
        </View>

        {/* 价格和节省金额 */}
        {!pkg.isFree ? (
          <XStack justifyContent="space-between" alignItems="flex-end">
            <YStack>
              <XStack alignItems="baseline" space="$1">
                <Text fontSize="$2" color={COLORS.error}>
                  ¥
                </Text>
                <Text fontSize="$7" fontWeight="700" color={COLORS.error}>
                  {pkg.packagePrice}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  /月起
                </Text>
              </XStack>
              <XStack alignItems="center" space="$1" marginTop="$1">
                <Text
                  fontSize="$3"
                  color="$textSecondary"
                  textDecorationLine="line-through"
                >
                  原价¥{pkg.originalPrice}
                </Text>
              </XStack>
            </YStack>

            {/* 节省金额标签 */}
            <View
              backgroundColor={`${COLORS.error}15`}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$3"
              flexDirection="row"
              alignItems="center"
              space="$1"
            >
              <TrendingDown size={16} color={COLORS.error} />
              <Text fontSize="$3" color={COLORS.error} fontWeight="600">
                优惠¥{pkg.savings}
              </Text>
            </View>
          </XStack>
        ) : (
          <View
            backgroundColor={`${COLORS.success}15`}
            padding="$3"
            borderRadius="$3"
            alignItems="center"
          >
            <Text fontSize="$5" color={COLORS.success} fontWeight="700">
              专业咨询服务
            </Text>
            <Text fontSize="$2" color={COLORS.success} marginTop="$1">
              资深顾问一对一服务，为您定制方案
            </Text>
          </View>
        )}

        {/* 社交证明 */}
        <View
          backgroundColor="$background"
          padding="$2"
          borderRadius="$2"
          alignItems="center"
        >
          <Text fontSize="$2" color="$textSecondary">
            {pkg.subscriberCount
              ? `已有${pkg.subscriberCount}人订阅`
              : pkg.familyCount
              ? `已为${pkg.familyCount}个家庭服务`
              : '值得信赖的服务'}
          </Text>
        </View>

        {/* 双CTA按钮 */}
        <XStack space="$2" marginTop="$2">
          {pkg.secondaryCTA && onCustomize && (
            <Pressable
              onPress={() =>
                onCustomize(pkg.consultScreen || pkg.targetScreen, pkg.targetParams)
              }
              style={{ flex: 1 }}
            >
              <View
                paddingVertical="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor={COLORS.primary}
                alignItems="center"
              >
                <Text color={COLORS.primary} fontSize="$3" fontWeight="600">
                  {pkg.secondaryCTA}
                </Text>
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={() => onPurchase(pkg.targetScreen, pkg.targetParams)}
            style={{ flex: 1 }}
          >
            <View
              paddingVertical="$3"
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              alignItems="center"
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                {pkg.primaryCTA}
              </Text>
            </View>
          </Pressable>
        </XStack>
      </YStack>
    </Card>
  );
};

interface ComboPackageListProps {
  packages: ComboPackageItem[];
  onPurchase: (screen: string, params?: any) => void;
  onCustomize?: (screen: string, params?: any) => void;
}

export const ComboPackageList: React.FC<ComboPackageListProps> = ({
  packages,
  onPurchase,
  onCustomize,
}) => {
  return (
    <View marginBottom={16}>
      <YStack space="$3">
        {/* 标题 */}
        <View paddingHorizontal="$4">
          <Text fontSize="$5" fontWeight="600" color="$text">
            超值组合套餐
          </Text>
          <Text fontSize="$3" color="$textSecondary" marginTop="$1">
            多服务组合，更省心更划算
          </Text>
        </View>

        {/* 套餐列表 */}
        <View paddingHorizontal="$4">
          <YStack>
            {packages.map((pkg) => (
              <ComboPackageCardItem
                key={pkg.id}
                package={pkg}
                onPurchase={onPurchase}
                onCustomize={onCustomize}
              />
            ))}
          </YStack>
        </View>
      </YStack>
    </View>
  );
};

/**
 * Mock组合套餐数据
 */
export const mockComboPackages: ComboPackageItem[] = [
  // 健康养老全包套餐
  {
    id: 'combo_health_elderly',
    name: '健康养老全包套餐',
    description: '全方位守护健康晚年',
    icon: '💎',
    services: [
      '营养配餐服务（每日三餐）',
      '私人医生服务（24小时在线）',
      '居家养老探访（每周1次）',
    ],
    originalPrice: 1196,
    packagePrice: 999,
    savings: 197,
    subscriberCount: 156,
    badge: '热销',
    primaryCTA: '立即订阅',
    secondaryCTA: '定制我的套餐',
    targetScreen: 'NutritionService',
    targetParams: { comboId: 'combo_health_elderly' },
    consultScreen: 'NutritionService',
  },
  // 慢病管理套餐
  {
    id: 'combo_chronic_disease',
    name: '慢病管理专属套餐',
    description: '三高糖尿病专业管理',
    icon: '🏥',
    services: [
      '营养配餐服务（三高专属食谱）',
      '私人医生服务（慢病监测）',
      '健康数据分析（AI智能报告）',
    ],
    originalPrice: 896,
    packagePrice: 699,
    savings: 197,
    subscriberCount: 342,
    badge: '限时优惠',
    primaryCTA: '立即订阅',
    secondaryCTA: '咨询医生',
    targetScreen: 'PrivateDoctorList',
    targetParams: { comboId: 'combo_chronic_disease' },
    consultScreen: 'PrivateDoctorList',
  },
  // 安心传承套餐
  {
    id: 'combo_wealth_planning',
    name: '安心传承套餐',
    description: '财富传承与保障规划',
    icon: '📜',
    services: [
      '遗嘱法律咨询（资深律师服务）',
      '保险规划方案（AI智能分析）',
      '资产配置建议（专业顾问指导）',
    ],
    originalPrice: 0,
    packagePrice: 0,
    savings: 0,
    familyCount: 890,
    badge: '专业咨询',
    isFree: true,
    primaryCTA: '获取方案',
    targetScreen: 'LegalServiceHome',
    targetParams: { source: 'combo_package' },
  },
  // 独居老人关怀套餐
  {
    id: 'combo_living_alone',
    name: '独居老人关怀套餐',
    description: '子女不在身边也安心',
    icon: '🏡',
    services: [
      '送餐上门服务（营养三餐配送）',
      '居家养老服务（每日探访陪伴）',
      '紧急呼叫服务（24小时响应）',
    ],
    originalPrice: 997,
    packagePrice: 799,
    savings: 198,
    subscriberCount: 223,
    badge: '热销',
    primaryCTA: '立即订阅',
    secondaryCTA: '预约上门评估',
    targetScreen: 'ElderlyService',
    targetParams: { comboId: 'combo_living_alone' },
    consultScreen: 'ElderlyService',
  },
];
