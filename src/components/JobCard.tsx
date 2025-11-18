import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
} from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { MapPin, Clock, DollarSign, Users, AlertCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ServiceJob, ServiceType } from '@/types/community';

interface JobCardProps {
  job: ServiceJob;
  onPress: (jobId: string) => void;
}

/**
 * 零工需求卡片组件
 * 用于在列表中展示零工需求摘要信息
 */
export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  // 获取服务类型的显示文本
  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '陪诊',
      [ServiceType.ACCOMPANY_CHAT]: '陪聊',
      [ServiceType.ACCOMPANY_CARE]: '照护',
      [ServiceType.MASSAGE]: '按摩',
      [ServiceType.REHABILITATION]: '康复',
      [ServiceType.HEALTH_CONSULT]: '健康咨询',
      [ServiceType.NURSING]: '护理',
      [ServiceType.MEAL_PREP]: '配餐',
      [ServiceType.HOUSEKEEPING]: '家政',
      [ServiceType.REPAIR]: '维修',
      [ServiceType.SHOPPING]: '代购',
      [ServiceType.TAICHI]: '太极',
      [ServiceType.DANCE]: '广场舞',
      [ServiceType.PHONE_TEACH]: '手机教学',
      [ServiceType.MUSIC]: '音乐',
      [ServiceType.OTHER]: '其他',
    };
    return labels[type] || '其他';
  };

  // 获取服务类型的emoji图标
  const getServiceTypeEmoji = (type: ServiceType): string => {
    const emojis: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '🏥',
      [ServiceType.ACCOMPANY_CHAT]: '💬',
      [ServiceType.ACCOMPANY_CARE]: '🤝',
      [ServiceType.MASSAGE]: '💆',
      [ServiceType.REHABILITATION]: '🏃',
      [ServiceType.HEALTH_CONSULT]: '👨‍⚕️',
      [ServiceType.NURSING]: '👩‍⚕️',
      [ServiceType.MEAL_PREP]: '🍱',
      [ServiceType.HOUSEKEEPING]: '🧹',
      [ServiceType.REPAIR]: '🔧',
      [ServiceType.SHOPPING]: '🛒',
      [ServiceType.TAICHI]: '🥋',
      [ServiceType.DANCE]: '💃',
      [ServiceType.PHONE_TEACH]: '📱',
      [ServiceType.MUSIC]: '🎵',
      [ServiceType.OTHER]: '📋',
    };
    return emojis[type] || '📋';
  };

  return (
    <TouchableOpacity onPress={() => onPress(job.id)} activeOpacity={0.7}>
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
        borderWidth={job.isUrgent ? 2 : 0}
        borderColor={job.isUrgent ? COLORS.error : 'transparent'}
      >
        {/* 顶部标签区 */}
        <XStack marginBottom="$3" flexWrap="wrap" gap="$2">
          {/* 服务类型标签 */}
          <View
            backgroundColor={COLORS.primary}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <XStack space="$1" alignItems="center">
              <Text fontSize={14}>{getServiceTypeEmoji(job.serviceType)}</Text>
              <Text fontSize="$2" color="white" fontWeight="600">
                {getServiceTypeLabel(job.serviceType)}
              </Text>
            </XStack>
          </View>

          {/* 紧急标签 */}
          {job.isUrgent && (
            <View
              backgroundColor={COLORS.error}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <XStack space="$1" alignItems="center">
                <AlertCircle size={12} color="white" />
                <Text fontSize="$2" color="white" fontWeight="600">
                  紧急
                </Text>
              </XStack>
            </View>
          )}

          {/* 高佣金标签 */}
          {job.isHighReward && (
            <View
              backgroundColor="#FFD700"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <XStack space="$1" alignItems="center">
                <Text fontSize="$2" color="#8B4513" fontWeight="600">
                  💰 高佣金
                </Text>
              </XStack>
            </View>
          )}

          {/* 健康数据关联标签 */}
          {job.healthTags && job.healthTags.length > 0 && (
            <View
              backgroundColor={`${COLORS.warning}30`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              borderWidth={1}
              borderColor={COLORS.warning}
            >
              <Text fontSize="$2" color={COLORS.warning} fontWeight="600">
                🏥 {job.healthTags[0]}
              </Text>
            </View>
          )}
        </XStack>

        {/* 标题 */}
        <Text fontSize="$5" fontWeight="bold" color="$text" marginBottom="$2" numberOfLines={2}>
          {job.title}
        </Text>

        {/* 描述 */}
        <Text fontSize="$3" color="$textSecondary" marginBottom="$3" numberOfLines={2}>
          {job.description}
        </Text>

        {/* 信息栏 */}
        <YStack space="$2" marginBottom="$3">
          {/* 位置 */}
          <XStack space="$2" alignItems="center">
            <MapPin size={16} color={COLORS.textSecondary} />
            <Text fontSize="$3" color="$textSecondary">
              {job.location.district} · {job.location.address}
            </Text>
          </XStack>

          {/* 时间 */}
          <XStack space="$2" alignItems="center">
            <Clock size={16} color={COLORS.textSecondary} />
            <Text fontSize="$3" color="$textSecondary">
              {job.serviceTime} · {job.duration}
            </Text>
          </XStack>

          {/* 预算 */}
          <XStack space="$2" alignItems="center">
            <DollarSign size={16} color={COLORS.success} />
            <Text fontSize="$4" color={COLORS.success} fontWeight="600">
              {job.budget.currency}{job.budget.min}-{job.budget.max}
            </Text>
            {job.requirements && job.requirements.length > 0 && (
              <>
                <Text fontSize="$3" color="$textSecondary">
                  ·
                </Text>
                <Text fontSize="$3" color="$textSecondary" numberOfLines={1}>
                  {job.requirements.slice(0, 2).join('、')}
                </Text>
              </>
            )}
          </XStack>
        </YStack>

        {/* 底部统计信息 */}
        <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
          {/* 雇主信息 */}
          <XStack space="$2" alignItems="center">
            <Text fontSize={20}>{job.employerAvatar || '👤'}</Text>
            <Text fontSize="$3" color="$textSecondary">
              {job.employerName}
            </Text>
          </XStack>

          {/* 报名人数 */}
          <XStack space="$2" alignItems="center">
            <Users size={14} color={COLORS.textSecondary} />
            <Text fontSize="$3" color="$textSecondary">
              {job.applicants}人报名
            </Text>
            <Text fontSize="$2" color="$textSecondary">
              · {job.publishTime}
            </Text>
          </XStack>
        </XStack>
      </Card>
    </TouchableOpacity>
  );
};
