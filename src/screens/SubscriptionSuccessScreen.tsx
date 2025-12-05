/**
 * Subscription Success Screen
 * Phase 22: 签约成功页面 - 确认和引导
 *
 * 功能：
 * - 签约成功确认
 * - 显示签约详情
 * - 自动跳转到服务台
 */

import React, { useEffect, useState } from 'react';
import { YStack, Text, View, useTheme } from 'tamagui';
import { Animated } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { PackageLevel } from '@/types/privateDoctor';

interface SubscriptionSuccessScreenProps {
  navigation: any;
  route: {
    params: {
      subscriptionId: string;
      doctorName: string;
      packageLevel: PackageLevel;
    };
  };
}

export const SubscriptionSuccessScreen: React.FC<
  SubscriptionSuccessScreenProps
> = ({ navigation, route }) => {
  const theme = useTheme();
  const { subscriptionId, doctorName, packageLevel } = route.params;
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // 成功图标动画
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // 2秒后自动跳转到服务台
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          { name: 'HomeTabs' as never },
          {
            name: 'PrivateDoctorServiceDesk' as never,
            params: { subscriptionId },
          },
        ],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, subscriptionId]);

  return (
    <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View
          width={120}
          height={120}
          borderRadius={60}
          backgroundColor="$primary"
          justifyContent="center"
          alignItems="center"
          marginBottom="$4"
        >
          <CheckCircle2 size={64} color="white" />
        </View>
      </Animated.View>
      <Text fontSize="$7" fontWeight="700" color="$color12" marginBottom="$2">
        签约成功
      </Text>
      <Text fontSize="$4" color="$color10" marginBottom="$2" textAlign="center">
        恭喜您成为 {doctorName} 医生的专属会员
      </Text>
      <Text fontSize="$3" color="$color10" marginBottom="$4">
        签约编号: {subscriptionId}
      </Text>
      <Text fontSize="$2" color="$color10">
        正在跳转到服务台...
      </Text>
    </View>
  );
};
