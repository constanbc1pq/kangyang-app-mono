import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
} from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Star, Award, MapPin, Calendar } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Expert, ExpertLevel, ServiceType } from '@/types/community';

interface ExpertCardProps {
  expert: Expert;
  onPress: (expertId: string) => void;
}

/**
 * 达人卡片组件
 * 展示达人简介、技能、评分等信息
 */
export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onPress }) => {
  // 获取等级标签
  const getLevelLabel = (level: ExpertLevel): string => {
    const labels: { [key in ExpertLevel]: string } = {
      [ExpertLevel.JUNIOR]: '初级达人',
      [ExpertLevel.INTERMEDIATE]: '中级达人',
      [ExpertLevel.SENIOR]: '高级达人',
      [ExpertLevel.EXPERT]: '资深专家',
    };
    return labels[level];
  };

  // 获取等级颜色
  const getLevelColor = (level: ExpertLevel): string => {
    const colors: { [key in ExpertLevel]: string } = {
      [ExpertLevel.JUNIOR]: COLORS.textSecondary,
      [ExpertLevel.INTERMEDIATE]: COLORS.primary,
      [ExpertLevel.SENIOR]: COLORS.warning,
      [ExpertLevel.EXPERT]: COLORS.error,
    };
    return colors[level];
  };

  // 获取服务类型标签
  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.ESCORT]: '陪诊',
      [ServiceType.CARE]: '陪护',
      [ServiceType.HOUSEKEEPING]: '家政',
      [ServiceType.MEAL]: '助餐',
      [ServiceType.SHOPPING]: '代购',
      [ServiceType.TRANSPORT]: '接送',
      [ServiceType.MEDICAL]: '医疗服务',
      [ServiceType.NURSING]: '护理',
      [ServiceType.REHABILITATION]: '康复',
      [ServiceType.PSYCHOLOGICAL]: '心理咨询',
      [ServiceType.NUTRITION]: '营养指导',
      [ServiceType.FITNESS]: '健身指导',
      [ServiceType.MASSAGE]: '推拿按摩',
      [ServiceType.OTHER]: '其他',
    };
    return labels[type];
  };

  return (
    <TouchableOpacity onPress={() => onPress(expert.id)} activeOpacity={0.7}>
      <Card
        padding="$4"
        borderRadius="$4"
        backgroundColor="$surface"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={4}
        marginBottom="$3"
      >
        <XStack space="$3" alignItems="flex-start">
          {/* 头像 */}
          <View
            width={64}
            height={64}
            borderRadius={32}
            backgroundColor="$background"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Text fontSize={32}>👤</Text>

            {/* 认证标识 */}
            {expert.verified && (
              <View
                position="absolute"
                bottom={0}
                right={0}
                width={20}
                height={20}
                borderRadius={10}
                backgroundColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
                borderWidth={2}
                borderColor="white"
              >
                <Award size={12} color="white" />
              </View>
            )}
          </View>

          {/* 达人信息 */}
          <YStack flex={1}>
            {/* 姓名和等级 */}
            <XStack space="$2" alignItems="center" marginBottom="$2">
              <Text fontSize="$5" fontWeight="600" color="$text">
                {expert.name}
              </Text>
              <View
                backgroundColor={`${getLevelColor(expert.level)}20`}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={getLevelColor(expert.level)} fontWeight="600">
                  {getLevelLabel(expert.level)}
                </Text>
              </View>
            </XStack>

            {/* 评分和服务次数 */}
            <XStack space="$3" alignItems="center" marginBottom="$2">
              <XStack space="$1" alignItems="center">
                <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                <Text fontSize="$3" color="$text" fontWeight="600">
                  {expert.rating.toFixed(1)}
                </Text>
              </XStack>
              <Text fontSize="$3" color="$textSecondary">
                已服务 {expert.serviceCount} 次
              </Text>
            </XStack>

            {/* 简介 */}
            <Text
              fontSize="$3"
              color="$textSecondary"
              numberOfLines={2}
              marginBottom="$2"
            >
              {expert.bio}
            </Text>

            {/* 擅长领域（最多显示3个） */}
            <XStack space="$2" flexWrap="wrap" marginBottom="$2">
              {(expert.specialties || []).slice(0, 3).map((specialty, index) => (
                <View
                  key={index}
                  backgroundColor="$background"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.primary}>
                    {getServiceTypeLabel(specialty)}
                  </Text>
                </View>
              ))}
              {(expert.specialties || []).length > 3 && (
                <View
                  backgroundColor="$background"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="$textSecondary">
                    +{(expert.specialties || []).length - 3}
                  </Text>
                </View>
              )}
            </XStack>

            {/* 底部信息 */}
            <XStack space="$3" alignItems="center">
              {/* 位置 */}
              {expert.location && (
                <XStack space="$1" alignItems="center">
                  <MapPin size={12} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {expert.location.district}
                  </Text>
                </XStack>
              )}

              {/* 从业时间 */}
              <XStack space="$1" alignItems="center">
                <Calendar size={12} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  从业 {expert.yearsOfExperience} 年
                </Text>
              </XStack>

              {/* 价格 */}
              {expert.hourlyRate && (
                <Text fontSize="$3" color={COLORS.error} fontWeight="600">
                  ¥{expert.hourlyRate}/小时
                </Text>
              )}
            </XStack>
          </YStack>
        </XStack>
      </Card>
    </TouchableOpacity>
  );
};
