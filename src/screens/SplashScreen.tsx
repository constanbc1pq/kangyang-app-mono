/**
 * SplashScreen 启动页
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useEffect, useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
  styled,
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';

interface SplashScreenProps {
  onFinish?: () => void;
}

// 动画容器 - 使用 Tamagui styled 创建带动画的组件
const AnimatedContainer = styled(YStack, {
  alignItems: 'center',
  opacity: 0,
  scale: 0.5,

  variants: {
    visible: {
      true: {
        opacity: 1,
        scale: 1,
      },
    },
  } as const,
});

// 加载指示器点
const LoadingDot = styled(View, {
  width: 12,
  height: 12,
  backgroundColor: 'white',
  borderRadius: '$12',

  variants: {
    pulse: {
      true: {
        scale: 1.2,
        opacity: 1,
      },
      false: {
        scale: 1,
        opacity: 0.5,
      },
    },
  } as const,
});

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  // 主题色
  const primaryColor = theme.primary?.val;
  const accentColor = theme.accent?.val;

  // 渐变色
  const gradientColors = [primaryColor, accentColor] as [string, string];

  useEffect(() => {
    // 启动入场动画
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // 加载点动画
    const dotInterval = setInterval(() => {
      setActiveDot(prev => (prev + 1) % 3);
    }, 400);

    // 自动完成
    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(finishTimer);
      clearInterval(dotInterval);
    };
  }, [onFinish]);

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <YStack flex={1} justifyContent="center" alignItems="center" position="relative">
            {/* 背景装饰圆 */}
            <View
              position="absolute"
              top="20%"
              left="20%"
              width={180}
              height={180}
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius="$12"
              opacity={0.8}
            />
            <View
              position="absolute"
              bottom="20%"
              right="15%"
              width={220}
              height={220}
              backgroundColor="rgba(255, 255, 255, 0.08)"
              borderRadius="$12"
              opacity={0.6}
            />
            <View
              position="absolute"
              top="40%"
              right="30%"
              width={100}
              height={100}
              backgroundColor="rgba(255, 255, 255, 0.12)"
              borderRadius="$12"
              opacity={0.7}
            />

            {/* 主内容区域 */}
            <AnimatedContainer
              visible={isVisible}
              animation="bouncy"
            >
              {/* App Logo */}
              <View
                width={96}
                height={96}
                backgroundColor="rgba(255, 255, 255, 0.2)"
                borderRadius="$6"
                justifyContent="center"
                alignItems="center"
                marginBottom="$2"
                borderWidth={2}
                borderColor="rgba(255, 255, 255, 0.3)"
              >
                <Heart size={48} color="white" />
              </View>

              {/* 应用名称 */}
              <Text
                fontSize="$9"
                fontWeight="700"
                color="white"
                textAlign="center"
                marginBottom="$1"
              >
                九紫康养
              </Text>

              {/* 副标题 */}
              <Text
                fontSize="$4"
                color="rgba(255, 255, 255, 0.85)"
                textAlign="center"
                marginBottom="$4"
              >
                智慧健康管理平台
              </Text>
            </AnimatedContainer>

            {/* 加载指示器 */}
            <XStack gap="$1.5" justifyContent="center" marginTop="$4">
              <LoadingDot
                pulse={activeDot === 0}
                animation="quick"
              />
              <LoadingDot
                pulse={activeDot === 1}
                animation="quick"
              />
              <LoadingDot
                pulse={activeDot === 2}
                animation="quick"
              />
            </XStack>
          </YStack>
        </LinearGradient>
      </SafeAreaView>
    </Theme>
  );
};
