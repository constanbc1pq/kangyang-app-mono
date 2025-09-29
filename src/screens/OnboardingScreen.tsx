import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H2,
  H3,
  Theme,
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Heart, Activity, Users, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      icon: Heart,
      title: "欢迎使用九紫康养",
      description: "AI健康生活管家，您的专属智慧健康管理平台",
      color: "$primary",
    },
    {
      icon: Activity,
      title: "智能健康监测",
      description: "连接智能设备，AI实时分析健康数据，提供个性化健康建议和预警",
      color: "$secondary",
    },
    {
      icon: Users,
      title: "品质生活服务",
      description: "营养配餐、居家养老、健康社区，全方位提升生活品质",
      color: "$primary",
    },
    {
      icon: Sparkles,
      title: "全生命周期服务",
      description: "从健康管理到财富规划，陪伴您的每一个人生阶段",
      color: "$secondary",
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
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <YStack flex={1} position="relative">
            {/* Background decoration */}
            <View
              position="absolute"
              top={60}
              left={60}
              width={180}
              height={180}
              backgroundColor="rgba(139, 92, 246, 0.2)"
              borderRadius={90}
              opacity={0.8}
            />
            <View
              position="absolute"
              bottom={100}
              right={40}
              width={220}
              height={220}
              backgroundColor="rgba(99, 102, 241, 0.15)"
              borderRadius={110}
              opacity={0.6}
            />
            <View
              position="absolute"
              top="50%"
              left="10%"
              width={120}
              height={120}
              backgroundColor="rgba(168, 139, 250, 0.25)"
              borderRadius={60}
              opacity={0.7}
            />

            {/* Header */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$6"
              paddingTop="$4"
            >
              <XStack space="$3" alignItems="center">
                <View
                  width={32}
                  height={32}
                  backgroundColor="$primary"
                  borderRadius={12}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Heart size={20} color="white" />
                </View>
                <H3 fontSize="$6" fontWeight="bold" color="white">
                  九紫康养
                </H3>
              </XStack>
              <Pressable onPress={onComplete}>
                <View
                  borderColor="rgba(255,255,255,0.2)"
                  borderWidth={1}
                  backgroundColor="transparent"
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  <Text color="rgba(255,255,255,0.8)" fontSize="$3">跳过</Text>
                </View>
              </Pressable>
            </XStack>

            {/* Progress indicator */}
            <XStack space="$2" paddingHorizontal="$6" marginTop="$6" marginBottom="$8">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  flex={1}
                  height={8}
                  borderRadius={4}
                  backgroundColor={index <= currentStep ? "$primary" : "rgba(255,255,255,0.2)"}
                />
              ))}
            </XStack>

            {/* Content */}
            <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
              <Card
                width="100%"
                maxWidth={400}
                backgroundColor="rgba(255,255,255,0.1)"
                borderColor="rgba(255,255,255,0.1)"
                borderRadius="$6"
                padding="$8"
                shadowColor="$primary"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={20}
                elevation={8}
              >
                <YStack space="$6" alignItems="center">
                  <View
                    width={80}
                    height={80}
                    borderRadius={40}
                    backgroundColor="rgba(255,255,255,0.1)"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconComponent size={40} color={currentStepData.color === "$primary" ? "#7C3AED" : "#2C7A7B"} />
                  </View>

                  <H2
                    fontSize="$8"
                    fontWeight="bold"
                    color="white"
                    textAlign="center"
                    lineHeight="$1"
                  >
                    {currentStepData.title}
                  </H2>

                  <Text
                    fontSize="$4"
                    color="rgba(255,255,255,0.8)"
                    textAlign="center"
                    lineHeight="$2"
                  >
                    {currentStepData.description}
                  </Text>
                </YStack>
              </Card>
            </YStack>

            {/* Navigation */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$6"
              paddingBottom="$6"
            >
              <Pressable
                onPress={prevStep}
                disabled={currentStep === 0}
                style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
              >
                <View
                  borderColor="rgba(255,255,255,0.2)"
                  borderWidth={1}
                  backgroundColor="transparent"
                  borderRadius="$4"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  <XStack space="$2" alignItems="center">
                    <ChevronLeft size={16} color="white" />
                    <Text color="white" fontSize="$4">上一步</Text>
                  </XStack>
                </View>
              </Pressable>

              <Pressable
                onPress={nextStep}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <View
                  backgroundColor={COLORS.primary}
                  borderRadius="$4"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  <XStack space="$2" alignItems="center">
                    <Text fontSize="$4" fontWeight="600" color="white">
                      {currentStep === onboardingSteps.length - 1 ? "开始使用" : "下一步"}
                    </Text>
                    <ChevronRight size={16} color="white" />
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