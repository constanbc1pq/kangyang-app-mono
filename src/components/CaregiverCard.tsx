/**
 * CaregiverCard 护理人员卡片组件
 * 支持大、小、紧凑三种尺寸
 * 遵循 CLAUDE.md 组件规范
 */

import React from 'react';
import { Pressable, Image } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { Star, Clock, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { Caregiver } from '@/types/elderly';

interface CaregiverCardProps {
  caregiver: Caregiver;
  onPress?: () => void;
  size?: 'large' | 'small' | 'compact';
  hideBookingButton?: boolean;
}

const GOLD_COLOR = '#D4AF37';

export const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  onPress,
  size = 'large',
  hideBookingButton = false,
}) => {
  const isLarge = size === 'large';
  const isCompact = size === 'compact';
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;

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
      navigation.navigate('AIConsultation' as never, {
        source: 'elderly_service',
        caregiverId: caregiver.id,
        serviceType: caregiver.serviceType,
        qualification: caregiver.qualificationBadge,
      } as never);
    }
  };

  // Compact mobile-friendly layout
  if (isCompact) {
    return (
      <Pressable onPress={handleCardPress}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          padding="$2"
        >
          <YStack alignItems="center" gap="$1.5">
            {/* 头像 */}
            <View position="relative">
              <View
                width={72}
                height={72}
                borderRadius={36}
                backgroundColor="$color4"
                overflow="hidden"
              >
                <Image
                  source={{ uri: caregiver.avatar }}
                  style={{ width: 72, height: 72 }}
                />
              </View>
              {caregiver.verified && (
                <View
                  position="absolute"
                  bottom={0}
                  right={0}
                  width={22}
                  height={22}
                  borderRadius={11}
                  backgroundColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={2}
                  borderColor="$color2"
                >
                  <CheckCircle size={12} color="white" />
                </View>
              )}
            </View>

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

            {/* 评分 */}
            <XStack alignItems="center" gap="$0.5">
              <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {caregiver.rating}
              </Text>
              <Text fontSize="$2" color="$color10">
                ({caregiver.reviews})
              </Text>
            </XStack>

            {/* 价格 */}
            <XStack alignItems="baseline" gap="$0.5">
              <Text fontSize="$5" fontWeight="700" color="$primary">
                ¥{caregiver.hourlyRate}
              </Text>
              <Text fontSize="$2" color="$color10">/时</Text>
            </XStack>

            {/* 专长标签 */}
            <View
              borderWidth={1}
              borderColor="$primary"
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <Text fontSize="$2" color="$primary" fontWeight="500">
                {caregiver.specialty}
              </Text>
            </View>

            {/* 查看详情按钮 */}
            {!hideBookingButton && (
              <Pressable
                style={{ width: '100%', marginTop: 6 }}
                onPress={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                <View
                  height={36}
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$3" color="$primary" fontWeight="500">
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
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={1}
        borderColor="$color5"
        padding="$2"
      >
        <XStack gap="$2" alignItems="flex-start">
          {/* 头像 */}
          <View position="relative">
            <View
              width={isLarge ? 64 : 56}
              height={isLarge ? 64 : 56}
              borderRadius={isLarge ? 32 : 28}
              backgroundColor="$color4"
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
            {/* 姓名和年龄 */}
            <XStack alignItems="center" gap="$1.5">
              <Text fontSize={isLarge ? '$4' : '$3'} fontWeight="600" color="$color12">
                {caregiver.name}
              </Text>
              <Text fontSize={isLarge ? '$2' : '$1'} color="$color10">
                {caregiver.age}岁
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

            {/* 价格 */}
            {isLarge ? (
              <XStack alignItems="baseline" gap="$1.5">
                <Text fontSize="$5" fontWeight="700" color="$primary">
                  ¥{caregiver.hourlyRate}
                </Text>
                <Text fontSize="$2" color="$color10">/时</Text>
                <Text fontSize="$2" color="$color10">
                  ¥{caregiver.dailyRate}/天
                </Text>
                <Text fontSize="$2" color="$color10">
                  ¥{caregiver.monthlyRate}/月
                </Text>
              </XStack>
            ) : (
              <XStack alignItems="baseline" gap="$1.5">
                <Text fontSize="$4" fontWeight="700" color="$primary">
                  ¥{caregiver.hourlyRate}
                </Text>
                <Text fontSize="$1" color="$color10">/时</Text>
                <Text fontSize="$1" color="$color10">
                  ¥{caregiver.dailyRate}/天
                </Text>
              </XStack>
            )}

            {/* 评分和经验 */}
            <XStack alignItems="center" gap="$2">
              <XStack alignItems="center" gap="$0.5">
                <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                <Text fontSize={isLarge ? '$3' : '$2'} fontWeight="600" color="$color12">
                  {caregiver.rating}
                </Text>
                <Text fontSize={isLarge ? '$2' : '$1'} color="$color10">
                  ({caregiver.reviews}评价)
                </Text>
              </XStack>
              <Text fontSize={isLarge ? '$2' : '$1'} color="$color10">
                从业{caregiver.experience}
              </Text>
              <Text fontSize={isLarge ? '$2' : '$1'} color="$color10">
                {caregiver.completedJobs}单
              </Text>
            </XStack>

            {/* 专长和响应时间 */}
            <XStack alignItems="center" gap="$1.5" flexWrap="wrap">
              <View
                borderWidth={1}
                borderColor="$primary"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <Text fontSize={isLarge ? '$2' : '$1'} color="$primary" fontWeight="500">
                  {caregiver.specialty}
                </Text>
              </View>
              <XStack alignItems="center" gap="$0.5">
                <Clock size={12} color={color10} />
                <Text fontSize={isLarge ? '$2' : '$1'} color="$color10">
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
            color="$color10"
            marginTop="$2"
            numberOfLines={2}
            lineHeight={18}
          >
            {caregiver.description}
          </Text>
        )}

        {/* 技能标签 */}
        {isLarge && (
          <XStack gap="$1.5" marginTop="$2" flexWrap="wrap">
            {caregiver.skills.slice(0, 4).map((skill, index) => (
              <View
                key={index}
                backgroundColor="$color4"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                borderWidth={1}
                borderColor="$color5"
              >
                <Text fontSize={10} color="$color10">
                  {skill}
                </Text>
              </View>
            ))}
            {caregiver.skills.length > 4 && (
              <Text fontSize={10} color="$color10">
                +{caregiver.skills.length - 4}
              </Text>
            )}
          </XStack>
        )}

        {/* 操作按钮 */}
        <XStack gap="$1.5" marginTop="$2">
          <Pressable
            style={{ flex: 1 }}
            onPress={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <View
              height={isLarge ? 36 : 32}
              borderRadius="$10"
              borderWidth={1}
              borderColor="$primary"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={isLarge ? '$3' : '$2'} color="$primary" fontWeight="500">
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
                borderRadius="$10"
                backgroundColor={caregiver.available ? '$primary' : '$color10'}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={isLarge ? '$3' : '$2'} color="white" fontWeight="500">
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
