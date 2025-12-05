/**
 * 免费体验区组件
 * 2×2网格展示免费服务，降低用户决策门槛
 */

import React from 'react';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { Pressable, Dimensions } from 'react-native';
import { Brain, Phone, FileText, Home } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side, 16px gap

interface FreeService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string; // "免费" | "0元体验"
  stats?: string; // "已有230人使用" | "3分钟出方案"
  targetScreen: string;
  targetParams?: any;
}

interface FreeTrialZoneProps {
  onServicePress: (screen: string, params?: any) => void;
}

export const FreeTrialZone: React.FC<FreeTrialZoneProps> = ({ onServicePress }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const secondaryColor = theme.accent?.val;

  const freeServices: FreeService[] = [
    {
      id: 'ai_health',
      title: 'AI健康规划',
      description: '3分钟出方案',
      icon: <Brain size={32} color={primaryColor} />,
      badge: '立即体验',
      stats: '已有1200+人使用',
      targetScreen: 'InsuranceHome',
    },
    {
      id: 'expert_consult',
      title: '专家咨询',
      description: '15分钟深度沟通',
      icon: <Phone size={32} color={successColor} />,
      badge: '预约体验',
      stats: '平均2分钟响应',
      targetScreen: 'PrivateDoctorList',
    },
    {
      id: 'health_report',
      title: '体检报告解读',
      description: '上传即可获取',
      icon: <FileText size={32} color={warningColor} />,
      badge: '专业解读',
      stats: '医生一对一服务',
      targetScreen: 'PrivateDoctorList',
    },
    {
      id: 'community_visit',
      title: '社区探访',
      description: '本周开放',
      icon: <Home size={32} color={secondaryColor} />,
      badge: '预约参观',
      stats: '实地考察养老社区',
      targetScreen: 'Community',
    },
  ];

  const ServiceCard: React.FC<{ service: FreeService }> = ({ service }) => (
    <Pressable
      onPress={() => onServicePress(service.targetScreen, service.targetParams)}
      style={{ width: cardWidth }}
    >
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        padding="$2"
        borderWidth={1}
        borderColor="$color5"
        height={140}
      >
        <YStack gap="$2" flex={1}>
          {/* 图标和徽章 */}
          <XStack justifyContent="space-between" alignItems="flex-start">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="$color3"
              justifyContent="center"
              alignItems="center"
            >
              {service.icon}
            </View>
            <View
              backgroundColor={`${successColor}15`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$1" color="$success" fontWeight="700">
                {service.badge}
              </Text>
            </View>
          </XStack>

          {/* 标题和描述 */}
          <YStack gap="$1" flex={1}>
            <Text fontSize="$4" fontWeight="600" color="$color12">
              {service.title}
            </Text>
            <Text fontSize="$2" color="$color10">
              {service.description}
            </Text>
          </YStack>

          {/* 统计信息 */}
          {service.stats && (
            <Text fontSize="$1" color="$color10">
              {service.stats}
            </Text>
          )}
        </YStack>
      </View>
    </Pressable>
  );

  return (
    <View marginBottom="$2">
      <YStack gap="$3">
        {/* 标题 */}
        <View paddingHorizontal="$2.5">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            先体验，再决定
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$1">
            专业服务，值得您亲身体验
          </Text>
        </View>

        {/* 2×2网格 */}
        <View paddingHorizontal="$2.5">
          <YStack gap="$3">
            {/* 第一行 */}
            <XStack gap="$3">
              <ServiceCard service={freeServices[0]} />
              <ServiceCard service={freeServices[1]} />
            </XStack>

            {/* 第二行 */}
            <XStack gap="$3">
              <ServiceCard service={freeServices[2]} />
              <ServiceCard service={freeServices[3]} />
            </XStack>
          </YStack>
        </View>
      </YStack>
    </View>
  );
};
