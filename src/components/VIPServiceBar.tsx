/**
 * VIPServiceBar - VIP服务台入口组件
 * 有订阅时显示专属服务在线状态，无订阅时显示高档占位入口
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect, useRef } from 'react';
import { XStack, YStack, Text, View, useTheme } from 'tamagui';
import { Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stethoscope, Scale, ChevronRight, Crown, Sparkles, Star } from 'lucide-react-native';
import {
  hasActiveSubscription,
  getActiveSubscriptions,
  ActiveSubscription,
} from '@/services/userDataService';

interface VIPServiceBarProps {
  onPressServiceDesk: () => void;
  onPressIntro: () => void;
}

export const VIPServiceBar: React.FC<VIPServiceBarProps> = ({
  onPressServiceDesk,
  onPressIntro,
}) => {
  const theme = useTheme();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeServices, setActiveServices] = useState<ActiveSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const primaryColor = theme.primary?.val;
  const warningColor = theme.warning?.val;
  const goldColor = theme.gold?.val || '#D4AF37';

  // 闪光动画
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSubscriptionStatus();

    // 启动闪光动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadSubscriptionStatus = async () => {
    setLoading(true);
    const hasActive = await hasActiveSubscription();
    setHasSubscription(hasActive);

    if (hasActive) {
      const services = await getActiveSubscriptions();
      setActiveServices(services);
    }
    setLoading(false);
  };

  // 加载中不显示
  if (loading) {
    return null;
  }

  // 无订阅时显示高档占位入口
  if (!hasSubscription || activeServices.length === 0) {
    const shimmerOpacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    // 使用主题色生成渐变 (基于primary暗紫色)
    const gradientColors = [
      `${primaryColor}`,
      theme.accent?.val || primaryColor,
    ] as [string, string];

    return (
      <Pressable onPress={onPressIntro}>
        <View borderRadius="$5" overflow="hidden">
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            {/* 装饰性闪光效果 */}
            <Animated.View
              style={[
                styles.shimmerOverlay,
                { opacity: shimmerOpacity, backgroundColor: 'rgba(255,255,255,0.1)' },
              ]}
            />

            <YStack padding="$2.5" gap="$2">
              {/* 第一行：图标 + 标题 + 皇冠 */}
              <XStack alignItems="center" gap="$2">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor="rgba(255,255,255,0.2)"
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={1}
                  borderColor="rgba(255,255,255,0.3)"
                >
                  <Crown size={24} color={goldColor} />
                </View>
                <YStack flex={1}>
                  <XStack alignItems="center" gap="$1.5">
                    <Text fontSize="$5" fontWeight="700" color="white">
                      专属服务
                    </Text>
                    <Star size={14} color={goldColor} fill={goldColor} />
                  </XStack>
                  <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                    尊享1对1 · 随时响应 · 全程陪伴
                  </Text>
                </YStack>
              </XStack>

              {/* 第二行：服务亮点 */}
              <XStack gap="$2" justifyContent="space-between">
                <XStack flex={1} gap="$1.5" alignItems="center">
                  <View
                    width={32}
                    height={32}
                    borderRadius={16}
                    backgroundColor="rgba(255,255,255,0.15)"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Stethoscope size={16} color="white" />
                  </View>
                  <YStack>
                    <Text fontSize="$3" fontWeight="600" color="white">
                      私人医生
                    </Text>
                    <Text fontSize="$1" color="rgba(255,255,255,0.6)">
                      专属健康管家
                    </Text>
                  </YStack>
                </XStack>
                <XStack flex={1} gap="$1.5" alignItems="center">
                  <View
                    width={32}
                    height={32}
                    borderRadius={16}
                    backgroundColor="rgba(255,255,255,0.15)"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Scale size={16} color="white" />
                  </View>
                  <YStack>
                    <Text fontSize="$3" fontWeight="600" color="white">
                      法律顾问
                    </Text>
                    <Text fontSize="$1" color="rgba(255,255,255,0.6)">
                      全程法律保障
                    </Text>
                  </YStack>
                </XStack>
              </XStack>

              {/* 第三行：了解更多按钮 */}
              <View
                backgroundColor="white"
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <XStack gap="$1" alignItems="center">
                  <Text fontSize="$3" fontWeight="600" color="$primary">
                    了解专属服务
                  </Text>
                  <ChevronRight size={16} color={primaryColor} />
                </XStack>
              </View>
            </YStack>
          </LinearGradient>
        </View>
      </Pressable>
    );
  }

  // 有订阅时显示服务台入口
  // 获取主服务（优先显示私人医生）
  const primaryService =
    activeServices.find((s) => s.type === 'privateDoctor') ||
    activeServices.find((s) => s.type === 'legalService') ||
    activeServices[0];

  // 获取服务图标
  const getServiceIcon = (type: ActiveSubscription['type']) => {
    switch (type) {
      case 'privateDoctor':
        return Stethoscope;
      case 'legalService':
        return Scale;
      default:
        return Crown;
    }
  };

  const ServiceIcon = getServiceIcon(primaryService.type);

  // 获取显示文案
  const getDisplayText = () => {
    if (primaryService.type === 'privateDoctor') {
      return `${primaryService.doctorName || '专属医生'}${primaryService.isOnline ? '在线' : '离线'}`;
    }
    if (primaryService.type === 'legalService') {
      return `${primaryService.lawyerName || '专属律师'}${primaryService.isOnline ? '在线' : '离线'}`;
    }
    return primaryService.name;
  };

  return (
    <Pressable onPress={onPressServiceDesk}>
      <View
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
        borderLeftWidth={3}
        borderLeftColor={primaryColor}
      >
        <XStack gap="$2" alignItems="center">
          {/* 服务图标 */}
          <View
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor={`${primaryColor}15`}
            justifyContent="center"
            alignItems="center"
          >
            <ServiceIcon size={20} color={primaryColor} />
          </View>

          {/* 服务信息 */}
          <YStack flex={1} gap="$0.5">
            <XStack gap="$1.5" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                专属服务台
              </Text>
              {/* 在线状态指示器 */}
              {primaryService.isOnline && (
                <View
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor="$success"
                />
              )}
            </XStack>
            <Text fontSize="$3" color="$color10">
              {getDisplayText()}
              {activeServices.length > 1 && ` 等${activeServices.length}项服务`}
            </Text>
          </YStack>

          {/* 进入按钮 */}
          <XStack gap="$0.5" alignItems="center">
            <Text fontSize="$3" color="$primary" fontWeight="500">
              进入
            </Text>
            <ChevronRight size={14} color={primaryColor} />
          </XStack>
        </XStack>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 12,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default VIPServiceBar;
