/**
 * PackageSelectCard 服务套餐选择卡片
 * 用于AI咨询流程中选择服务套餐
 * 遵循 CLAUDE.md 组件规范
 */

import React from 'react';
import { Pressable } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { CheckCircle, Star } from 'lucide-react-native';
import type { ServicePackage } from '@/types/elderly';

interface PackageSelectCardProps {
  package: ServicePackage;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
  qualificationType?: 'PCW' | 'HW' | 'RN';
}

export const PackageSelectCard: React.FC<PackageSelectCardProps> = ({
  package: pkg,
  isSelected,
  onSelect,
  qualificationType = 'PCW',
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  // 根据资质类型获取对应价格
  const priceInfo = pkg.prices.find(p => p.type === qualificationType) || pkg.prices[0];

  return (
    <Pressable onPress={() => onSelect(pkg.id)}>
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={2}
        borderColor={isSelected ? '$primary' : '$color5'}
        padding="$2"
        position="relative"
      >
        {/* 热门标签 */}
        {pkg.popular && (
          <View
            position="absolute"
            top={-8}
            right={16}
            backgroundColor="$warning"
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <XStack alignItems="center" gap="$0.5">
              <Star size={12} color="white" fill="white" />
              <Text fontSize={10} color="white" fontWeight="600">
                热门
              </Text>
            </XStack>
          </View>
        )}

        {/* 选中标识 */}
        {isSelected && (
          <View
            position="absolute"
            top={10}
            right={10}
            width={22}
            height={22}
            borderRadius={11}
            backgroundColor="$primary"
            justifyContent="center"
            alignItems="center"
            zIndex={10}
          >
            <CheckCircle size={14} color="white" fill="white" />
          </View>
        )}

        <YStack gap="$2">
          {/* 套餐名称 */}
          <Text fontSize="$4" fontWeight="600" color="$color12">
            {pkg.name}
          </Text>

          {/* 价格 */}
          <XStack alignItems="baseline" gap="$0.5">
            <Text fontSize="$6" fontWeight="700" color="$primary">
              ¥{priceInfo.price}
            </Text>
            <Text fontSize="$2" color="$color10">
              {priceInfo.unit}
            </Text>
            {priceInfo.save && (
              <View
                backgroundColor="$success"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                marginLeft="$1.5"
              >
                <Text fontSize={10} color="white" fontWeight="500">
                  省{priceInfo.save}
                </Text>
              </View>
            )}
          </XStack>

          {/* 套餐描述 */}
          <Text fontSize="$3" color="$color10">
            {pkg.description}
          </Text>

          {/* 服务内容 */}
          <YStack gap="$1">
            {pkg.features.map((feature, index) => (
              <XStack key={index} alignItems="center" gap="$1.5">
                <View
                  width={4}
                  height={4}
                  borderRadius={2}
                  backgroundColor="$primary"
                />
                <Text fontSize="$2" color="$color12">
                  {feature}
                </Text>
              </XStack>
            ))}
          </YStack>

          {/* 备注 */}
          {pkg.note && (
            <View
              backgroundColor="$color4"
              padding="$2"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontSize="$2" color="$color10">
                {pkg.note}
              </Text>
            </View>
          )}

          {/* 折扣信息 */}
          {pkg.discount && (
            <View
              backgroundColor="$primary"
              padding="$2"
              borderRadius="$4"
            >
              <Text fontSize="$2" color="white" fontWeight="500">
                {pkg.discount}
              </Text>
            </View>
          )}
        </YStack>
      </View>
    </Pressable>
  );
};
