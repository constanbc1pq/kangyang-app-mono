/**
 * Private Doctor Card Component
 * Phase 21: 医生卡片组件 - 可复用的医生信息展示卡片
 *
 * 功能：
 * - 紧凑的医生信息展示
 * - 支持水平/垂直布局
 * - 可点击跳转详情
 * - 显示关键信息：头像、姓名、职称、医院、评分、价格
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, Image } from 'react-native';
import {
  Star,
  MapPin,
  Users,
  CheckCircle,
  Award,
  Video,
} from 'lucide-react-native';
import { getAvatarSource } from '@/constants/avatars';
import {
  PrivateDoctor,
  DoctorDepartment,
} from '@/types/privateDoctor';

const GOLD_COLOR = '#D4AF37';

interface PrivateDoctorCardProps {
  doctor: PrivateDoctor;
  onPress?: (doctorId: string) => void;
  layout?: 'vertical' | 'horizontal';
  showPrice?: boolean;
  compact?: boolean;
}

export const PrivateDoctorCard: React.FC<PrivateDoctorCardProps> = ({
  doctor,
  onPress,
  layout = 'horizontal',
  showPrice = true,
  compact = false,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;

  const getDepartmentLabel = (dept: DoctorDepartment): string => {
    const labels: Record<DoctorDepartment, string> = {
      [DoctorDepartment.CARDIOLOGY]: '心血管内科',
      [DoctorDepartment.GASTROENTEROLOGY]: '消化内科',
      [DoctorDepartment.ENDOCRINOLOGY]: '内分泌科',
      [DoctorDepartment.NEUROLOGY]: '神经内科',
      [DoctorDepartment.RHEUMATOLOGY]: '风湿免疫科',
      [DoctorDepartment.ONCOLOGY]: '肿瘤科',
      [DoctorDepartment.GENERAL_MEDICINE]: '全科医学',
      [DoctorDepartment.NUTRITION]: '营养科',
    };
    return labels[dept];
  };

  const getTitleLabel = (title: string): string => {
    const labels: Record<string, string> = {
      chief_physician: '主任医师',
      associate_chief_physician: '副主任医师',
      associate_chief: '副主任医师',
      attending_physician: '主治医师',
      attending: '主治医师',
      resident: '住院医师',
    };
    return labels[title] || title;
  };

  const formatPrice = (price: number): string => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}万`;
    }
    return price.toLocaleString();
  };

  const lowestPrice = Math.min(...doctor.packages.map((p) => p.price));

  const renderAvatar = (size: number) => (
    <View
      width={size}
      height={size}
      borderRadius="$3"
      overflow="hidden"
      backgroundColor="$color4"
    >
      <Image
        source={getAvatarSource(doctor.avatar, doctor.name)}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </View>
  );

  const renderBadges = () => (
    <XStack gap="$1.5" flexWrap="wrap">
      {doctor.isOnline && (
        <XStack
          alignItems="center"
          gap="$0.5"
          paddingHorizontal="$1"
          paddingVertical="$0.5"
          borderRadius="$1"
          style={{ backgroundColor: `${successColor}15` }}
        >
          <Video size={10} color={successColor} />
          <Text fontSize={10} color="$success" fontWeight="500">
            在线
          </Text>
        </XStack>
      )}
      {doctor.overseasTraining.length > 0 && (
        <XStack
          alignItems="center"
          gap="$0.5"
          paddingHorizontal="$1"
          paddingVertical="$0.5"
          borderRadius="$1"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <Award size={10} color={primaryColor} />
          <Text fontSize={10} color="$primary" fontWeight="500">
            海外
          </Text>
        </XStack>
      )}
    </XStack>
  );

  if (layout === 'vertical') {
    // 垂直布局 - 适用于网格展示
    return (
      <Pressable
        onPress={() => onPress?.(doctor.id)}
        style={{ width: '100%' }}
      >
        <View
          borderRadius="$5"
          backgroundColor="$color2"
          padding="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          <YStack gap="$1.5" alignItems="center">
            {renderAvatar(compact ? 56 : 72)}

            <YStack gap="$1" alignItems="center" width="100%">
              <XStack alignItems="center" gap="$1">
                <Text
                  fontSize={compact ? '$4' : '$5'}
                  fontWeight="700"
                  color="$color12"
                  numberOfLines={1}
                >
                  {doctor.name}
                </Text>
                {doctor.verified && (
                  <CheckCircle size={12} color={GOLD_COLOR} />
                )}
              </XStack>

              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$1"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Text fontSize={11} color="$primary" fontWeight="600">
                  {getTitleLabel(doctor.title)}
                </Text>
              </View>

              <Text
                fontSize={11}
                color="$color10"
                numberOfLines={1}
                textAlign="center"
              >
                {getDepartmentLabel(doctor.department)}
              </Text>

              <XStack alignItems="center" gap="$0.5">
                <MapPin size={10} color={color10} />
                <Text
                  fontSize={10}
                  color="$color10"
                  numberOfLines={1}
                  flex={1}
                  textAlign="center"
                >
                  {doctor.hospital.name}
                </Text>
              </XStack>

              <XStack alignItems="center" gap="$2" marginTop="$0.5">
                <XStack alignItems="center" gap="$0.5">
                  <Star size={11} color={GOLD_COLOR} fill={GOLD_COLOR} />
                  <Text fontSize={11} fontWeight="600" color="$color12">
                    {doctor.rating.toFixed(1)}
                  </Text>
                </XStack>
                <XStack alignItems="center" gap="$0.5">
                  <Users size={11} color={color10} />
                  <Text fontSize={11} color="$color10">
                    {doctor.memberCount}
                  </Text>
                </XStack>
              </XStack>

              {!compact && renderBadges()}

              {showPrice && (
                <XStack alignItems="baseline" gap="$0.5" marginTop="$0.5">
                  <Text fontSize={10} color={GOLD_COLOR}>
                    ¥
                  </Text>
                  <Text fontSize="$5" fontWeight="700" color={GOLD_COLOR}>
                    {formatPrice(lowestPrice)}
                  </Text>
                  <Text fontSize={10} color="$color10">
                    /年起
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        </View>
      </Pressable>
    );
  }

  // 水平布局 - 默认布局，适用于列表展示
  return (
    <Pressable
      onPress={() => onPress?.(doctor.id)}
      style={{ width: '100%' }}
    >
      <View
        borderRadius="$5"
        backgroundColor="$color2"
        padding="$2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack gap={compact ? '$1.5' : '$2'}>
          {renderAvatar(compact ? 56 : 72)}

          <YStack flex={1} gap={compact ? '$1' : '$1.5'}>
            {/* 姓名和职称 */}
            <XStack alignItems="center" gap="$2" justifyContent="space-between">
              <XStack alignItems="center" gap="$1" flex={1}>
                <Text
                  fontSize={compact ? '$4' : '$5'}
                  fontWeight="700"
                  color="$color12"
                  numberOfLines={1}
                >
                  {doctor.name}
                </Text>
                {doctor.verified && (
                  <CheckCircle size={14} color={GOLD_COLOR} />
                )}
              </XStack>
              {!compact && renderBadges()}
            </XStack>

            {/* 职称和科室 */}
            <XStack alignItems="center" gap="$1.5" flexWrap="wrap">
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$1"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Text
                  fontSize={compact ? 10 : 11}
                  color="$primary"
                  fontWeight="600"
                >
                  {getTitleLabel(doctor.title)}
                </Text>
              </View>
              <Text fontSize={compact ? 11 : 12} color="$color10">
                {getDepartmentLabel(doctor.department)}
              </Text>
            </XStack>

            {/* 医院 */}
            <XStack alignItems="center" gap="$0.5">
              <MapPin size={12} color={color10} />
              <Text
                fontSize={compact ? 11 : 12}
                color="$color10"
                numberOfLines={1}
                flex={1}
              >
                {doctor.hospital.name}
              </Text>
            </XStack>

            {/* 评分、会员数和价格 */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginTop={compact ? '$0.5' : '$1'}
            >
              <XStack alignItems="center" gap="$2">
                <XStack alignItems="center" gap="$0.5">
                  <Star size={12} color={GOLD_COLOR} fill={GOLD_COLOR} />
                  <Text fontSize={12} fontWeight="600" color="$color12">
                    {doctor.rating.toFixed(1)}
                  </Text>
                </XStack>
                <XStack alignItems="center" gap="$0.5">
                  <Users size={12} color={color10} />
                  <Text fontSize={12} color="$color10">
                    {doctor.memberCount}
                  </Text>
                </XStack>
              </XStack>

              {showPrice && (
                <XStack alignItems="baseline" gap="$0.5">
                  <Text fontSize={10} color={GOLD_COLOR}>
                    ¥
                  </Text>
                  <Text
                    fontSize={compact ? '$4' : '$5'}
                    fontWeight="700"
                    color={GOLD_COLOR}
                  >
                    {formatPrice(lowestPrice)}
                  </Text>
                  <Text fontSize={10} color="$color10">
                    /年起
                  </Text>
                </XStack>
              )}
            </XStack>

            {/* 专长标签（非紧凑模式） */}
            {!compact && (
              <XStack gap="$1" flexWrap="wrap" marginTop="$1">
                {doctor.specialties.slice(0, 3).map((specialty, index) => (
                  <View
                    key={index}
                    backgroundColor="$color4"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$1"
                    marginBottom="$0.5"
                  >
                    <Text fontSize={10} color="$color10">
                      {specialty}
                    </Text>
                  </View>
                ))}
              </XStack>
            )}
          </YStack>
        </XStack>
      </View>
    </Pressable>
  );
};
