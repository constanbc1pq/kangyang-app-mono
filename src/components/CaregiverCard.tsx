import React from 'react';
import { Pressable, Image } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { Star, Clock, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '@/constants/app';
import type { Caregiver } from '@/types/elderly';

interface CaregiverCardProps {
  caregiver: Caregiver;
  onPress?: () => void;
  size?: 'large' | 'small' | 'compact';
  hideBookingButton?: boolean;
}

export const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  onPress,
  size = 'large',
  hideBookingButton = false,
}) => {
  const isLarge = size === 'large';
  const isCompact = size === 'compact';
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('CaregiverDetail', { caregiverId: caregiver.id });
    }
  };

  const handleViewDetails = () => {
    navigation.navigate('CaregiverDetail', { caregiverId: caregiver.id });
  };

  const handleBooking = () => {
    if (caregiver.available) {
      // TODO: Navigate to booking screen or show booking modal
      console.log('Navigate to booking for caregiver:', caregiver.id);
    }
  };

  // Compact mobile-friendly layout
  if (isCompact) {
    return (
      <Pressable onPress={handleCardPress}>
        <View
          backgroundColor="$background"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          padding="$3"
        >
          <YStack alignItems="center" gap="$2">
            {/* 头像 */}
            <View position="relative">
              <View
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor="$surface"
                overflow="hidden"
              >
                <Image
                  source={{ uri: caregiver.avatar }}
                  style={{ width: 80, height: 80 }}
                />
              </View>
              {caregiver.verified && (
                <View
                  position="absolute"
                  bottom={0}
                  right={0}
                  width={24}
                  height={24}
                  borderRadius={12}
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={2}
                  borderColor="$background"
                >
                  <CheckCircle size={14} color="white" />
                </View>
              )}
            </View>

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

            {/* 评分 */}
            <XStack alignItems="center" gap="$1">
              <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
              <Text fontSize="$3" fontWeight="600" color="$text">
                {caregiver.rating}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                ({caregiver.reviews})
              </Text>
            </XStack>

            {/* 价格 */}
            <XStack alignItems="baseline" gap="$1">
              <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                ¥{caregiver.hourlyRate}
              </Text>
              <Text fontSize="$2" color="$textSecondary">/时</Text>
            </XStack>

            {/* 专长标签 */}
            <View
              backgroundColor="rgba(99, 102, 241, 0.1)"
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius="$4"
              marginTop="$1"
            >
              <Text fontSize="$2" color={COLORS.primary} fontWeight="500">
                {caregiver.specialty}
              </Text>
            </View>

            {/* 查看详情按钮 */}
            {!hideBookingButton && (
              <Pressable
                style={{ width: '100%', marginTop: 8 }}
                onPress={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                <View
                  height={36}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
                    查看详情
                  </Text>
                </View>
              </Pressable>
            )}
          </YStack>
        </View>
      </Pressable>
    );
  }

  // Original horizontal layout for large/small sizes
  return (
    <Pressable onPress={handleCardPress}>
      <View
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
        padding={isLarge ? '$4' : '$3'}
      >
        <XStack gap={isLarge ? '$3' : '$2'} alignItems="flex-start">
          {/* 头像 */}
          <View position="relative">
            <View
              width={isLarge ? 64 : 56}
              height={isLarge ? 64 : 56}
              borderRadius={isLarge ? 32 : 28}
              backgroundColor="$surface"
              overflow="hidden"
            >
              <Image
                source={{ uri: caregiver.avatar }}
                style={{
                  width: isLarge ? 64 : 56,
                  height: isLarge ? 64 : 56,
                }}
              />
            </View>
            {caregiver.verified && (
              <View
                position="absolute"
                bottom={-2}
                right={-2}
                width={20}
                height={20}
                borderRadius={10}
                backgroundColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
                borderWidth={2}
                borderColor="$background"
              >
                <CheckCircle size={12} color="white" />
              </View>
            )}
          </View>

          {/* 信息 */}
          <YStack flex={1} gap="$1">
            {/* 姓名和年龄 */}
            <XStack alignItems="center" gap="$2">
              <Text fontSize={isLarge ? '$4' : '$3'} fontWeight="bold" color="$text">
                {caregiver.name}
              </Text>
              <Text fontSize={isLarge ? '$2' : '$1'} color="$textSecondary">
                {caregiver.age}岁
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

            {/* 价格 */}
            {isLarge ? (
              <XStack alignItems="baseline" gap="$2">
                <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                  ¥{caregiver.hourlyRate}
                </Text>
                <Text fontSize="$2" color="$textSecondary">/时</Text>
                <Text fontSize="$2" color="$textSecondary">
                  ¥{caregiver.dailyRate}/天
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  ¥{caregiver.monthlyRate}/月
                </Text>
              </XStack>
            ) : (
              <XStack alignItems="baseline" gap="$2">
                <Text fontSize="$4" fontWeight="bold" color={COLORS.primary}>
                  ¥{caregiver.hourlyRate}
                </Text>
                <Text fontSize="$1" color="$textSecondary">/时</Text>
                <Text fontSize="$1" color="$textSecondary">
                  ¥{caregiver.dailyRate}/天
                </Text>
              </XStack>
            )}

            {/* 评分和经验 */}
            <XStack alignItems="center" gap="$3">
              <XStack alignItems="center" gap="$1">
                <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                <Text fontSize={isLarge ? '$3' : '$2'} fontWeight="600" color="$text">
                  {caregiver.rating}
                </Text>
                <Text fontSize={isLarge ? '$2' : '$1'} color="$textSecondary">
                  ({caregiver.reviews}评价)
                </Text>
              </XStack>
              <Text fontSize={isLarge ? '$2' : '$1'} color="$textSecondary">
                从业{caregiver.experience}
              </Text>
              <Text fontSize={isLarge ? '$2' : '$1'} color="$textSecondary">
                {caregiver.completedJobs}单
              </Text>
            </XStack>

            {/* 专长和响应时间 */}
            <XStack alignItems="center" gap="$2" flexWrap="wrap">
              <View
                backgroundColor="rgba(99, 102, 241, 0.1)"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize={isLarge ? '$2' : '$1'} color={COLORS.primary} fontWeight="500">
                  {caregiver.specialty}
                </Text>
              </View>
              <XStack alignItems="center" gap="$1">
                <Clock size={12} color={COLORS.textSecondary} />
                <Text fontSize={isLarge ? '$2' : '$1'} color="$textSecondary">
                  {caregiver.responseTime}
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </XStack>

        {/* 简介 */}
        {isLarge && (
          <Text
            fontSize="$2"
            color="$textSecondary"
            marginTop="$3"
            numberOfLines={2}
            lineHeight={18}
          >
            {caregiver.description}
          </Text>
        )}

        {/* 技能标签 */}
        {isLarge && (
          <XStack gap="$2" marginTop="$3" flexWrap="wrap">
            {caregiver.skills.slice(0, 4).map((skill, index) => (
              <View
                key={index}
                backgroundColor="$surface"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$1" color="$textSecondary">
                  {skill}
                </Text>
              </View>
            ))}
            {caregiver.skills.length > 4 && (
              <Text fontSize="$1" color="$textSecondary">
                +{caregiver.skills.length - 4}
              </Text>
            )}
          </XStack>
        )}

        {/* 操作按钮 */}
        <XStack gap="$2" marginTop={isLarge ? '$3' : '$2'}>
          <Pressable
            style={{ flex: 1 }}
            onPress={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <View
              height={isLarge ? 36 : 32}
              borderRadius="$3"
              borderWidth={1}
              borderColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={isLarge ? '$3' : '$2'} color={COLORS.primary} fontWeight="600">
                查看详情
              </Text>
            </View>
          </Pressable>
          {!hideBookingButton && (
            <Pressable
              style={{ flex: 1 }}
              onPress={(e) => {
                e.stopPropagation();
                handleBooking();
              }}
            >
              <View
                height={isLarge ? 36 : 32}
                borderRadius="$3"
                backgroundColor={caregiver.available ? COLORS.primary : COLORS.textSecondary}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={isLarge ? '$3' : '$2'} color="white" fontWeight="600">
                  {caregiver.available ? '立即预约' : '暂不可约'}
                </Text>
              </View>
            </Pressable>
          )}
        </XStack>
      </View>
    </Pressable>
  );
};
