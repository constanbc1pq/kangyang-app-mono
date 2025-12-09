/**
 * FeedBanner - 大Banner组件
 * 全宽大图，主题标题叠加，吸引用户点击进入主题
 * 角标带呼吸灯动画效果
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useEffect, useRef } from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, ImageBackground, StyleSheet, Animated, Easing } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { FeedEntry } from '@/types/feed';

interface FeedBannerProps {
  entry: FeedEntry;
  onPress: (entry: FeedEntry) => void;
  variant?: 'large' | 'medium';
}

export const FeedBanner: React.FC<FeedBannerProps> = ({
  entry,
  onPress,
  variant = 'large',
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const warningColor = theme.warning?.val;

  // 呼吸灯动画
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 计算剩余天数
  const getDaysRemaining = (): number | null => {
    if (!entry.endDate) return null;
    const end = new Date(entry.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  };

  const daysRemaining = getDaysRemaining();
  const height = variant === 'large' ? 180 : 140;

  // 呼吸灯样式
  const pulseStyle = {
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  return (
    <Pressable onPress={() => onPress(entry)}>
      <View
        borderRadius="$5"
        overflow="hidden"
        height={height}
      >
        <ImageBackground
          source={typeof entry.image === 'string' ? { uri: entry.image } : entry.image}
          style={styles.background}
          imageStyle={styles.image}
        >
          {/* 渐变遮罩 */}
          <View style={styles.overlay} />

          {/* 内容区域 */}
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding="$2"
            gap="$1"
          >
            {/* 角标行：角标 + 倒计时 */}
            <XStack gap="$1.5" alignItems="center">
              {/* 角标（带呼吸灯动画） */}
              {entry.badge && (
                <Animated.View style={pulseStyle}>
                  <View
                    backgroundColor={primaryColor}
                    paddingHorizontal="$1.5"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text fontSize={10} color="white" fontWeight="600">
                      {entry.badge}
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* 倒计时 */}
              {daysRemaining && (
                <View
                  backgroundColor="rgba(0,0,0,0.5)"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <XStack gap="$0.5" alignItems="center">
                    <Clock size={10} color="white" />
                    <Text fontSize={10} color="white" fontWeight="500">
                      还剩{daysRemaining}天
                    </Text>
                  </XStack>
                </View>
              )}
            </XStack>

            {/* 标题 */}
            <Text
              fontSize={variant === 'large' ? '$6' : '$5'}
              fontWeight="700"
              color="white"
            >
              {entry.title}
            </Text>

            {/* 副标题 */}
            {entry.subtitle && (
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                  {entry.subtitle}
                </Text>
                <ChevronRight size={14} color="rgba(255,255,255,0.9)" />
              </XStack>
            )}
          </YStack>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover', // 高度100%，宽度自适应，居中裁剪
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
});

export default FeedBanner;
