/**
 * 主题专区Banner组件
 * 展示当前进行中的主题活动
 * 点击跳转主题详情页
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, Image } from 'react-native';
import { Calendar, ChevronRight, User } from 'lucide-react-native';
import { Theme } from '@/types/theme';

interface ThemeBannerProps {
  theme: Theme;
  onPress?: (theme: Theme) => void;
}

export const ThemeBanner: React.FC<ThemeBannerProps> = ({ theme, onPress }) => {
  const themeColors = useTheme();

  const primaryColor = themeColors.primary?.val;

  // 格式化日期范围
  const formatDateRange = () => {
    const start = new Date(theme.startDate);
    const end = new Date(theme.endDate);
    const startStr = `${start.getMonth() + 1}.${start.getDate()}`;
    const endStr = `${end.getMonth() + 1}.${end.getDate()}`;
    return `${startStr} - ${endStr}`;
  };

  return (
    <Pressable onPress={() => onPress?.(theme)}>
      <View
        borderRadius="$5"
        overflow="hidden"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        {/* 封面图 */}
        <View height={140} position="relative">
          <Image
            source={{ uri: theme.coverImage }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
          {/* 渐变遮罩 */}
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={80}
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
          {/* 标题叠加在图片上 */}
          <View
            position="absolute"
            bottom={12}
            left={12}
            right={12}
          >
            <Text
              fontSize="$6"
              fontWeight="700"
              color="white"
              marginBottom="$1"
            >
              {theme.title}
            </Text>
            <Text fontSize="$3" color="rgba(255,255,255,0.9)">
              {theme.subtitle}
            </Text>
          </View>
        </View>

        {/* 底部信息区 */}
        <View padding="$2">
          <XStack justifyContent="space-between" alignItems="center">
            {/* 主理人信息 */}
            <XStack gap="$1.5" alignItems="center">
              <View
                width={28}
                height={28}
                borderRadius={14}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <User size={14} color={primaryColor} />
              </View>
              <YStack>
                <Text fontSize="$3" fontWeight="500" color="$color12">
                  {theme.hostName}
                </Text>
                <Text fontSize={10} color="$color10">
                  {theme.hostTitle}
                </Text>
              </YStack>
            </XStack>

            {/* 日期和进入按钮 */}
            <XStack gap="$2" alignItems="center">
              <XStack gap="$1" alignItems="center">
                <Calendar size={12} color={themeColors.color10?.val} />
                <Text fontSize="$2" color="$color10">
                  {formatDateRange()}
                </Text>
              </XStack>
              <View
                backgroundColor="$primary"
                paddingHorizontal="$2"
                paddingVertical="$1.5"
                borderRadius="$10"
              >
                <XStack gap="$0.5" alignItems="center">
                  <Text fontSize="$2" color="white" fontWeight="500">
                    进入专题
                  </Text>
                  <ChevronRight size={12} color="white" />
                </XStack>
              </View>
            </XStack>
          </XStack>
        </View>
      </View>
    </Pressable>
  );
};

export default ThemeBanner;
