import React from 'react';
import { Pressable, Image } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { Star, CheckCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import type { Caregiver } from '@/types/elderly';

interface CaregiverSelectCardProps {
  caregiver: Caregiver;
  isSelected: boolean;
  onSelect: (caregiverId: string) => void;
}

export const CaregiverSelectCard: React.FC<CaregiverSelectCardProps> = ({
  caregiver,
  isSelected,
  onSelect,
}) => {
  return (
    <Pressable onPress={() => onSelect(caregiver.id)}>
      <View
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor={isSelected ? COLORS.primary : '$borderColor'}
        padding="$3"
        position="relative"
      >
        {/* 选中标识 */}
        {isSelected && (
          <View
            position="absolute"
            top={8}
            right={8}
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

        <XStack gap="$3" alignItems="center">
          {/* 头像 */}
          <View position="relative">
            <View
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor="$surface"
              overflow="hidden"
            >
              <Image
                source={{ uri: caregiver.avatar }}
                style={{ width: 60, height: 60 }}
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
                backgroundColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
                borderWidth={2}
                borderColor="$background"
              >
                <CheckCircle size={10} color="white" />
              </View>
            )}
          </View>

          {/* 信息 */}
          <YStack flex={1} gap="$1">
            {/* 姓名和资质 */}
            <XStack alignItems="center" gap="$2">
              <Text fontSize="$4" fontWeight="bold" color="$text">
                {caregiver.name}
              </Text>
              <View
                backgroundColor={COLORS.primaryLight}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$1" color="white" fontWeight="600">
                  {caregiver.qualificationBadge}
                </Text>
              </View>
            </XStack>

            {/* 评分和价格 */}
            <XStack alignItems="center" gap="$3">
              <XStack alignItems="center" gap="$1">
                <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                <Text fontSize="$2" fontWeight="600" color="$text">
                  {caregiver.rating}
                </Text>
              </XStack>
              <Text fontSize="$3" fontWeight="bold" color={COLORS.primary}>
                ¥{caregiver.hourlyRate}
                <Text fontSize="$2" color="$textSecondary">/时</Text>
              </Text>
            </XStack>

            {/* 专长 */}
            <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
              {caregiver.specialty}
            </Text>
          </YStack>
        </XStack>
      </View>
    </Pressable>
  );
};
