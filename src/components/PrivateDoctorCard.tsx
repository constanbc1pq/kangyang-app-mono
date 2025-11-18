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
import { YStack, XStack, Text, Card, View } from 'tamagui';
import { Pressable, Image } from 'react-native';
import {
  Star,
  MapPin,
  Users,
  CheckCircle,
  Award,
  Video,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  PrivateDoctor,
  DoctorDepartment,
  DoctorTitle,
} from '@/types/privateDoctor';

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
      attending_physician: '主治医师',
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
      backgroundColor="$surface"
    >
      {doctor.avatar ? (
        <Image
          source={{ uri: doctor.avatar }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <View
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor={COLORS.primary}
        >
          <Text
            fontSize={size / 2.5}
            fontWeight="600"
            color="white"
          >
            {doctor.name[0]}
          </Text>
        </View>
      )}
    </View>
  );

  const renderBadges = () => (
    <XStack space="$2" flexWrap="wrap">
      {doctor.isOnline && (
        <XStack
          alignItems="center"
          space="$1"
          paddingHorizontal="$1"
          paddingVertical="$0.5"
          backgroundColor={`${COLORS.success}15`}
          borderRadius="$1"
        >
          <Video size={10} color={COLORS.success} />
          <Text fontSize={10} color={COLORS.success} fontWeight="500">
            在线
          </Text>
        </XStack>
      )}
      {doctor.overseasTraining.length > 0 && (
        <XStack
          alignItems="center"
          space="$1"
          paddingHorizontal="$1"
          paddingVertical="$0.5"
          backgroundColor={COLORS.primaryLight}
          borderRadius="$1"
        >
          <Award size={10} color={COLORS.primary} />
          <Text fontSize={10} color={COLORS.primary} fontWeight="500">
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
        <Card
          borderRadius="$4"
          backgroundColor="$cardBg"
          padding="$3"
          shadowColor="$shadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.08}
          shadowRadius={4}
          elevation={3}
        >
          <YStack space="$2" alignItems="center">
            {renderAvatar(compact ? 56 : 72)}

            <YStack space="$1" alignItems="center" width="100%">
              <XStack alignItems="center" space="$1">
                <Text
                  fontSize={compact ? '$4' : '$5'}
                  fontWeight="700"
                  color="$text"
                  numberOfLines={1}
                >
                  {doctor.name}
                </Text>
                {doctor.verified && (
                  <CheckCircle size={12} color={COLORS.primary} />
                )}
              </XStack>

              <View
                backgroundColor={COLORS.primaryLight}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$1"
              >
                <Text fontSize={11} color={COLORS.primary} fontWeight="600">
                  {getTitleLabel(doctor.title)}
                </Text>
              </View>

              <Text
                fontSize={11}
                color="$textSecondary"
                numberOfLines={1}
                textAlign="center"
              >
                {getDepartmentLabel(doctor.department)}
              </Text>

              <XStack alignItems="center" space="$1">
                <MapPin size={10} color={COLORS.textSecondary} />
                <Text
                  fontSize={10}
                  color="$textSecondary"
                  numberOfLines={1}
                  flex={1}
                  textAlign="center"
                >
                  {doctor.hospital.name}
                </Text>
              </XStack>

              <XStack alignItems="center" space="$2" marginTop="$1">
                <XStack alignItems="center" space="$0.5">
                  <Star size={11} color={COLORS.warning} fill={COLORS.warning} />
                  <Text fontSize={11} fontWeight="600" color="$text">
                    {doctor.rating.toFixed(1)}
                  </Text>
                </XStack>
                <XStack alignItems="center" space="$0.5">
                  <Users size={11} color={COLORS.textSecondary} />
                  <Text fontSize={11} color="$textSecondary">
                    {doctor.memberCount}
                  </Text>
                </XStack>
              </XStack>

              {!compact && renderBadges()}

              {showPrice && (
                <XStack alignItems="baseline" space="$0.5" marginTop="$1">
                  <Text fontSize={10} color={COLORS.primary}>
                    ¥
                  </Text>
                  <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                    {formatPrice(lowestPrice)}
                  </Text>
                  <Text fontSize={10} color="$textSecondary">
                    /年起
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        </Card>
      </Pressable>
    );
  }

  // 水平布局 - 默认布局，适用于列表展示
  return (
    <Pressable
      onPress={() => onPress?.(doctor.id)}
      style={{ width: '100%' }}
    >
      <Card
        borderRadius="$4"
        backgroundColor="$cardBg"
        padding={compact ? '$3' : '$4'}
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        elevation={3}
      >
        <XStack space={compact ? '$2' : '$3'}>
          {renderAvatar(compact ? 56 : 72)}

          <YStack flex={1} space={compact ? '$1' : '$2'}>
            {/* 姓名和职称 */}
            <XStack alignItems="center" space="$2" justifyContent="space-between">
              <XStack alignItems="center" space="$1" flex={1}>
                <Text
                  fontSize={compact ? '$4' : '$5'}
                  fontWeight="700"
                  color="$text"
                  numberOfLines={1}
                >
                  {doctor.name}
                </Text>
                {doctor.verified && (
                  <CheckCircle size={14} color={COLORS.primary} />
                )}
              </XStack>
              {!compact && renderBadges()}
            </XStack>

            {/* 职称和科室 */}
            <XStack alignItems="center" space="$2" flexWrap="wrap">
              <View
                backgroundColor={COLORS.primaryLight}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$1"
              >
                <Text
                  fontSize={compact ? 10 : 11}
                  color={COLORS.primary}
                  fontWeight="600"
                >
                  {getTitleLabel(doctor.title)}
                </Text>
              </View>
              <Text fontSize={compact ? 11 : 12} color="$textSecondary">
                {getDepartmentLabel(doctor.department)}
              </Text>
            </XStack>

            {/* 医院 */}
            <XStack alignItems="center" space="$1">
              <MapPin size={12} color={COLORS.textSecondary} />
              <Text
                fontSize={compact ? 11 : 12}
                color="$textSecondary"
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
              <XStack alignItems="center" space="$2">
                <XStack alignItems="center" space="$0.5">
                  <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                  <Text fontSize={12} fontWeight="600" color="$text">
                    {doctor.rating.toFixed(1)}
                  </Text>
                </XStack>
                <XStack alignItems="center" space="$0.5">
                  <Users size={12} color={COLORS.textSecondary} />
                  <Text fontSize={12} color="$textSecondary">
                    {doctor.memberCount}
                  </Text>
                </XStack>
              </XStack>

              {showPrice && (
                <XStack alignItems="baseline" space="$0.5">
                  <Text fontSize={10} color={COLORS.primary}>
                    ¥
                  </Text>
                  <Text
                    fontSize={compact ? '$4' : '$5'}
                    fontWeight="700"
                    color={COLORS.primary}
                  >
                    {formatPrice(lowestPrice)}
                  </Text>
                  <Text fontSize={10} color="$textSecondary">
                    /年起
                  </Text>
                </XStack>
              )}
            </XStack>

            {/* 专长标签（非紧凑模式） */}
            {!compact && (
              <XStack space="$1" flexWrap="wrap" marginTop="$1">
                {doctor.specialties.slice(0, 3).map((specialty, index) => (
                  <View
                    key={index}
                    backgroundColor="$surface"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$1"
                    marginBottom="$1"
                  >
                    <Text fontSize={10} color="$textSecondary">
                      {specialty}
                    </Text>
                  </View>
                ))}
              </XStack>
            )}
          </YStack>
        </XStack>
      </Card>
    </Pressable>
  );
};
