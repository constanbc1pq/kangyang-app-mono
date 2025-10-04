import React from 'react';
import { Pressable } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { CheckCircle, Star } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import type { ServicePackage } from '@/types/elderly';

interface PackageSelectCardProps {
  package: ServicePackage;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
  qualificationType?: 'PCW' | 'HW' | 'RN'; // 当前选择的护理员资质
}

export const PackageSelectCard: React.FC<PackageSelectCardProps> = ({
  package: pkg,
  isSelected,
  onSelect,
  qualificationType = 'PCW',
}) => {
  // 根据资质类型获取对应价格
  const priceInfo = pkg.prices.find(p => p.type === qualificationType) || pkg.prices[0];

  return (
    <Pressable onPress={() => onSelect(pkg.id)}>
      <View
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor={isSelected ? COLORS.primary : '$borderColor'}
        padding="$4"
        position="relative"
      >
        {/* 热门标签 */}
        {pkg.popular && (
          <View
            position="absolute"
            top={-8}
            right={16}
            backgroundColor={COLORS.warning}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius="$3"
          >
            <XStack alignItems="center" gap="$1">
              <Star size={12} color="white" fill="white" />
              <Text fontSize="$1" color="white" fontWeight="700">
                热门
              </Text>
            </XStack>
          </View>
        )}

        {/* 选中标识 */}
        {isSelected && (
          <View
            position="absolute"
            top={12}
            right={12}
            width={24}
            height={24}
            borderRadius={12}
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            zIndex={10}
          >
            <CheckCircle size={16} color="white" fill="white" />
          </View>
        )}

        <YStack gap="$3">
          {/* 套餐名称 */}
          <Text fontSize="$5" fontWeight="bold" color="$text">
            {pkg.name}
          </Text>

          {/* 价格 */}
          <XStack alignItems="baseline" gap="$1">
            <Text fontSize="$7" fontWeight="bold" color={COLORS.primary}>
              ¥{priceInfo.price}
            </Text>
            <Text fontSize="$2" color="$textSecondary">
              {priceInfo.unit}
            </Text>
            {priceInfo.save && (
              <View
                backgroundColor={COLORS.success}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$2"
                marginLeft="$2"
              >
                <Text fontSize="$1" color="white" fontWeight="600">
                  省{priceInfo.save}
                </Text>
              </View>
            )}
          </XStack>

          {/* 套餐描述 */}
          <Text fontSize="$3" color="$textSecondary">
            {pkg.description}
          </Text>

          {/* 服务内容 */}
          <YStack gap="$1">
            {pkg.features.map((feature, index) => (
              <XStack key={index} alignItems="center" gap="$2">
                <View
                  width={4}
                  height={4}
                  borderRadius={2}
                  backgroundColor={COLORS.primary}
                />
                <Text fontSize="$2" color="$text">
                  {feature}
                </Text>
              </XStack>
            ))}
          </YStack>

          {/* 备注 */}
          {pkg.note && (
            <View
              backgroundColor="$surface"
              padding="$2"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="$textSecondary">
                💡 {pkg.note}
              </Text>
            </View>
          )}

          {/* 折扣信息 */}
          {pkg.discount && (
            <View
              backgroundColor={COLORS.primaryLight}
              padding="$2"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="white" fontWeight="600">
                🎉 {pkg.discount}
              </Text>
            </View>
          )}
        </YStack>
      </View>
    </Pressable>
  );
};
