/**
 * OnboardingScreen 引导页
 * 首次进入应用时的欢迎滑动页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState } from 'react';
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
import { Pressable } from 'react-native';
import {
  Heart,
  Activity,
  Users,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

// 动画内容容器
const AnimatedContent = styled(YStack, {
  gap: '$2',
  alignItems: 'center',
  opacity: 1,

  variants: {
    entering: {
      true: {
        opacity: 1,
        scale: 1,
      },
    },
  } as const,
});

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  // 主题色
  const primaryColor = theme.primary?.val;
  const accentColor = theme.accent?.val;

  // 渐变色
  const gradientColors = [primaryColor, accentColor] as [string, string];

  const onboardingSteps = [
    {
      icon: Heart,
      title: '欢迎使用九紫康养',
      description: 'AI健康生活管家，您的专属智慧健康管理平台',
    },
    {
      icon: Activity,
      title: '智能健康监测',
      description: '连接智能设备，AI实时分析健康数据，提供个性化健康建议和预警',
    },
    {
      icon: Users,
      title: '品质生活服务',
      description: '营养配餐、居家养老、健康社区，全方位提升生活品质',
    },
    {
      icon: Sparkles,
      title: '全生命周期服务',
      description: '从健康管理到财富规划，陪伴您的每一个人生阶段',
    },
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <YStack flex={1} position="relative">
            {/* 背景装饰圆 */}
            <View
              position="absolute"
              top={60}
              left={60}
              width={180}
              height={180}
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius="$12"
              opacity={0.8}
            />
            <View
              position="absolute"
              bottom={100}
              right={40}
              width={220}
              height={220}
              backgroundColor="rgba(255, 255, 255, 0.08)"
              borderRadius="$12"
              opacity={0.6}
            />
            <View
              position="absolute"
              top="50%"
              left="10%"
              width={120}
              height={120}
              backgroundColor="rgba(255, 255, 255, 0.12)"
              borderRadius="$12"
              opacity={0.7}
            />

            {/* 顶部导航 */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$2.5"
              paddingTop="$2"
            >
              <XStack gap="$2" alignItems="center">
                <View
                  width={32}
                  height={32}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  borderRadius="$4"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Heart size={18} color="white" />
                </View>
                <Text fontSize="$5" fontWeight="700" color="white">
                  九紫康养
                </Text>
              </XStack>
              <Pressable onPress={onComplete}>
                <View
                  borderColor="rgba(255, 255, 255, 0.3)"
                  borderWidth={1}
                  backgroundColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="$10"
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                >
                  <Text color="rgba(255, 255, 255, 0.9)" fontSize="$3" fontWeight="500">
                    跳过
                  </Text>
                </View>
              </Pressable>
            </XStack>

            {/* 进度指示器 */}
            <XStack gap="$1.5" paddingHorizontal="$2.5" marginTop="$2" marginBottom="$4">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  flex={1}
                  height={4}
                  borderRadius="$10"
                  backgroundColor={
                    index <= currentStep
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.25)'
                  }
                />
              ))}
            </XStack>

            {/* 内容区域 */}
            <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$2.5">
              <View
                width="100%"
                maxWidth={400}
                backgroundColor="rgba(255, 255, 255, 0.12)"
                borderColor="rgba(255, 255, 255, 0.15)"
                borderWidth={1}
                borderRadius="$5"
                padding="$2"
              >
                <AnimatedContent entering animation="quick">
                  {/* 图标 */}
                  <View
                    width={80}
                    height={80}
                    borderRadius="$12"
                    backgroundColor="rgba(255, 255, 255, 0.15)"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$2"
                  >
                    <IconComponent size={40} color="white" />
                  </View>

                  {/* 标题 */}
                  <Text
                    fontSize="$7"
                    fontWeight="700"
                    color="white"
                    textAlign="center"
                    lineHeight="$1"
                  >
                    {currentStepData.title}
                  </Text>

                  {/* 描述 */}
                  <Text
                    fontSize="$4"
                    color="rgba(255, 255, 255, 0.85)"
                    textAlign="center"
                    lineHeight="$2"
                    paddingHorizontal="$2"
                  >
                    {currentStepData.description}
                  </Text>
                </AnimatedContent>
              </View>
            </YStack>

            {/* 底部导航按钮 */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$2.5"
              paddingBottom="$2.5"
            >
              {/* 上一步按钮 */}
              <Pressable
                onPress={prevStep}
                disabled={currentStep === 0}
                style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
              >
                <View
                  borderColor="rgba(255, 255, 255, 0.3)"
                  borderWidth={1}
                  backgroundColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="$10"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                >
                  <XStack gap="$1" alignItems="center">
                    <ChevronLeft size={16} color="white" />
                    <Text color="white" fontSize="$3" fontWeight="500">
                      上一步
                    </Text>
                  </XStack>
                </View>
              </Pressable>

              {/* 下一步/开始使用按钮 */}
              <Pressable
                onPress={nextStep}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <View
                  backgroundColor="white"
                  borderRadius="$10"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                >
                  <XStack gap="$1" alignItems="center">
                    <Text fontSize="$3" fontWeight="600" color={primaryColor}>
                      {currentStep === onboardingSteps.length - 1 ? '开始使用' : '下一步'}
                    </Text>
                    <ChevronRight size={16} color={primaryColor} />
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </YStack>
        </LinearGradient>
      </SafeAreaView>
    </Theme>
  );
};
