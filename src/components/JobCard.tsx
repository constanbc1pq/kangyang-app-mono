/**
 * JobCard 零工需求卡片组件
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  useTheme,
} from 'tamagui';
import { Pressable } from 'react-native';
import { MapPin, Clock, DollarSign, Users, AlertCircle } from 'lucide-react-native';
import { ServiceJob, ServiceType } from '@/types/community';

interface JobCardProps {
  job: ServiceJob;
  onPress: (jobId: string) => void;
}

/**
 * 零工需求卡片组件
 */
export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

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
    <Pressable onPress={() => onPress(job.id)}>
      <View
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.08}
        elevation={2}
        borderWidth={1}
        borderColor={job.isUrgent ? errorColor : '$color5'}
        borderLeftWidth={job.isUrgent ? 3 : 1}
        borderLeftColor={job.isUrgent ? errorColor : '$color5'}
      >
        {/* 顶部标签区 */}
        <XStack marginBottom="$2" flexWrap="wrap" gap="$1.5">
          {/* 服务类型标签 */}
          <View
            backgroundColor={primaryColor}
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <XStack gap="$1" alignItems="center">
              <Text fontSize={12}>{getServiceTypeEmoji(job.serviceType)}</Text>
              <Text fontSize={10} color="white" fontWeight="500">
                {getServiceTypeLabel(job.serviceType)}
              </Text>
            </XStack>
          </View>

          {/* 紧急标签 */}
          {job.isUrgent && (
            <View
              backgroundColor={errorColor}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <XStack gap="$0.5" alignItems="center">
                <AlertCircle size={10} color="white" />
                <Text fontSize={10} color="white" fontWeight="500">
                  紧急
                </Text>
              </XStack>
            </View>
          )}

          {/* 高佣金标签 */}
          {job.isHighReward && (
            <View
              backgroundColor={warningColor}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color="white" fontWeight="500">
                💰 高佣金
              </Text>
            </View>
          )}

          {/* 健康数据关联标签 */}
          {job.healthTags && job.healthTags.length > 0 && (
            <View
              backgroundColor={`${warningColor}15`}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color={warningColor} fontWeight="500">
                🏥 {job.healthTags[0]}
              </Text>
            </View>
          )}
        </XStack>

        {/* 标题 */}
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5" numberOfLines={2}>
          {job.title}
        </Text>

        {/* 描述 */}
        <Text fontSize="$3" color="$color10" marginBottom="$2" numberOfLines={2} lineHeight={20}>
          {job.description}
        </Text>

        {/* 信息栏 */}
        <YStack gap="$1.5" marginBottom="$2">
          {/* 位置 */}
          <XStack gap="$1.5" alignItems="center">
            <MapPin size={14} color={color10} />
            <Text fontSize="$2" color="$color10" numberOfLines={1} flex={1}>
              {job.location.district} · {job.location.address}
            </Text>
          </XStack>

          {/* 时间 */}
          <XStack gap="$1.5" alignItems="center">
            <Clock size={14} color={color10} />
            <Text fontSize="$2" color="$color10">
              {job.serviceTime} · {job.duration}
            </Text>
          </XStack>

          {/* 预算 */}
          <XStack gap="$1.5" alignItems="center">
            <DollarSign size={14} color={successColor} />
            <Text fontSize="$3" color={successColor} fontWeight="600">
              {job.budget.currency}{job.budget.min}-{job.budget.max}
            </Text>
            {job.requirements && job.requirements.length > 0 && (
              <>
                <Text fontSize="$2" color="$color10">·</Text>
                <Text fontSize="$2" color="$color10" numberOfLines={1} flex={1}>
                  {job.requirements.slice(0, 2).join('、')}
                </Text>
              </>
            )}
          </XStack>
        </YStack>

        {/* 底部统计信息 */}
        <XStack justifyContent="space-between" alignItems="center">
          {/* 雇主信息 */}
          <XStack gap="$1.5" alignItems="center">
            <Text fontSize={16}>{job.employerAvatar || '👤'}</Text>
            <Text fontSize="$2" color="$color10">
              {job.employerName}
            </Text>
          </XStack>

          {/* 报名人数 */}
          <XStack gap="$1.5" alignItems="center">
            <Users size={12} color={color10} />
            <Text fontSize="$2" color="$color10">
              {job.applicants}人报名
            </Text>
            <Text fontSize="$2" color="$color10">
              · {job.publishTime}
            </Text>
          </XStack>
        </XStack>
      </View>
    </Pressable>
  );
};
