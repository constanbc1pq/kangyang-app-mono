/**
 * RecipientInfoCard - 对方信息卡片组件
 * 显示医生/律师/顾问/达人等对方的详细信息
 */
import React from 'react';
import { Image } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { RecipientConfig, Badge } from '@/types/chat';
import { getAvatarSource } from '@/constants/avatars';

interface RecipientInfoCardProps {
  config: RecipientConfig;
}

const GOLD_COLOR = '#D4AF37';

export const RecipientInfoCard: React.FC<RecipientInfoCardProps> = ({ config }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  const {
    avatar,
    name,
    title,
    organization,
    department,
    badges = [],
    isOnline,
    extraInfo = [],
  } = config;

  // 渲染徽章
  const renderBadge = (badge: Badge, index: number) => {
    let bgColor = primaryColor;
    if (badge.color) {
      bgColor = badge.color;
    } else {
      switch (badge.type) {
        case 'verified':
          bgColor = successColor;
          break;
        case 'vip':
          bgColor = GOLD_COLOR;
          break;
        case 'expert':
          bgColor = primaryColor;
          break;
        case 'business':
          bgColor = '#F59E0B';
          break;
      }
    }

    return (
      <View
        key={index}
        paddingHorizontal="$1.5"
        paddingVertical="$0.5"
        borderRadius="$2"
        style={{ backgroundColor: `${bgColor}15` }}
      >
        <Text fontSize={10} fontWeight="500" style={{ color: bgColor }}>
          {badge.label}
        </Text>
      </View>
    );
  };

  return (
    <View
      backgroundColor="$color2"
      padding="$2"
      borderBottomWidth={1}
      borderBottomColor="$color5"
    >
      <XStack gap="$2" alignItems="center">
        {/* 头像 */}
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor="$color4"
          borderWidth={2}
          borderColor={badges.some(b => b.type === 'vip') ? GOLD_COLOR : '$color5'}
          overflow="hidden"
        >
          {avatar ? (
            <Image
              source={getAvatarSource(avatar, name)}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View
              flex={1}
              justifyContent="center"
              alignItems="center"
              backgroundColor="$color4"
            >
              <Text fontSize="$4" fontWeight="600" color="$color10">
                {name[0]}
              </Text>
            </View>
          )}
        </View>

        {/* 信息区域 */}
        <YStack flex={1} gap="$0.5">
          {/* 名称和徽章 */}
          <XStack gap="$1.5" alignItems="center" flexWrap="wrap">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              {name}
            </Text>
            {badges.map(renderBadge)}
          </XStack>

          {/* 职称和单位 */}
          {(title || organization || department) && (
            <Text fontSize="$2" color="$color10" numberOfLines={1}>
              {[organization, department, title].filter(Boolean).join(' · ')}
            </Text>
          )}

          {/* 扩展信息 */}
          {extraInfo.length > 0 && (
            <XStack gap="$2" flexWrap="wrap">
              {extraInfo.map((info, index) => (
                <Text key={index} fontSize="$2" color="$color10">
                  {info.label}: {info.value}
                </Text>
              ))}
            </XStack>
          )}
        </YStack>

        {/* 在线状态 */}
        {isOnline !== undefined && (
          <View
            width={10}
            height={10}
            borderRadius={5}
            backgroundColor={isOnline ? '$success' : '$color10'}
          />
        )}
      </XStack>
    </View>
  );
};

export default RecipientInfoCard;
