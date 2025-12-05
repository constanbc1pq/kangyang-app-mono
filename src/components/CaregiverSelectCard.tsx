/**
 * CaregiverSelectCard 护理人员选择卡片
 * 用于AI咨询流程中选择护理人员
 * 遵循 CLAUDE.md 组件规范
 */

import React from 'react';
import { Pressable, Image } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { Star, CheckCircle } from 'lucide-react-native';
import type { Caregiver } from '@/types/elderly';

interface CaregiverSelectCardProps {
  caregiver: Caregiver;
  isSelected: boolean;
  onSelect: (caregiverId: string) => void;
}

const GOLD_COLOR = '#D4AF37';

export const CaregiverSelectCard: React.FC<CaregiverSelectCardProps> = ({
  caregiver,
  isSelected,
  onSelect,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  return (
    <Pressable onPress={() => onSelect(caregiver.id)}>
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={2}
        borderColor={isSelected ? '$primary' : '$color5'}
        padding="$2"
        position="relative"
      >
        {/* 选中标识 */}
        {isSelected && (
          <View
            position="absolute"
            top={8}
            right={8}
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

        <XStack gap="$2" alignItems="center">
          {/* 头像 */}
          <View position="relative">
            <View
              width={56}
              height={56}
              borderRadius={28}
              backgroundColor="$color4"
              overflow="hidden"
            >
              <Image
                source={{ uri: caregiver.avatar }}
                style={{ width: 56, height: 56 }}
              />
            </View>
            {caregiver.verified && (
              <View
                position="absolute"
                bottom={-2}
                right={-2}
                width={18}
                height={18}
                borderRadius={9}
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
                borderWidth={2}
                borderColor="$color2"
              >
                <CheckCircle size={10} color="white" />
              </View>
            )}
          </View>

          {/* 信息 */}
          <YStack flex={1} gap="$1">
            {/* 姓名和资质 */}
            <XStack alignItems="center" gap="$1.5">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {caregiver.name}
              </Text>
              <View
                backgroundColor="$primary"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color="white" fontWeight="500">
                  {caregiver.qualificationBadge}
                </Text>
              </View>
            </XStack>

            {/* 评分和价格 */}
            <XStack alignItems="center" gap="$2">
              <XStack alignItems="center" gap="$0.5">
                <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                <Text fontSize="$2" fontWeight="600" color="$color12">
                  {caregiver.rating}
                </Text>
              </XStack>
              <XStack alignItems="baseline">
                <Text fontSize="$3" fontWeight="700" color="$primary">
                  ¥{caregiver.hourlyRate}
                </Text>
                <Text fontSize="$2" color="$color10">/时</Text>
              </XStack>
            </XStack>

            {/* 专长 */}
            <View
              borderWidth={1}
              borderColor="$primary"
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
              alignSelf="flex-start"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <Text fontSize="$2" color="$primary" numberOfLines={1}>
                {caregiver.specialty}
              </Text>
            </View>
          </YStack>
        </XStack>
      </View>
    </Pressable>
  );
};
