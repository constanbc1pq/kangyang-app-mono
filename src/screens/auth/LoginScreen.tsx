/**
 * LoginScreen 登录页
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 * 开发测试版本 - 无需登录直接体验
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
} from 'tamagui';
import { ToastViewport, useToastController } from '@tamagui/toast';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Heart, Info } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { setCurrentUser } from '@/store/slices/userSlice';

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToastController();

  // 主题色
  const primaryColor = theme.primary?.val;
  const accentColor = theme.accent?.val;
  const warningColor = theme.warning?.val;

  // 渐变色
  const gradientColors = [primaryColor, accentColor] as [string, string];

  // 直接进入体验
  const handleEnter = async () => {
    if (isLoading) return;

    setIsLoading(true);

    // 模拟短暂加载
    setTimeout(() => {
      // 直接登录成功
      dispatch(loginSuccess({
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now(),
      }));

      // 设置测试用户信息
      dispatch(setCurrentUser({
        id: 'demo-user-01',
        email: 'demo@kangyang.com',
        name: '体验用户',
        avatar: undefined,
        phone: '138****8888',
        gender: 'male',
        birthDate: '1980-01-01',
        height: 170,
        weight: 65,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      toast.show('欢迎体验九紫康养！', {
        duration: 2000,
        burntOptions: {
          preset: 'done',
          haptic: 'success',
        },
      });
    }, 800);
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View flex={1} justifyContent="center" alignItems="center" padding="$2.5">
            {/* 登录卡片 */}
            <View
              width="100%"
              maxWidth={400}
              backgroundColor="$color2"
              borderRadius="$5"
              padding="$2.5"
              borderWidth={1}
              borderColor="$color5"
            >
              <YStack gap="$2">
                {/* Logo区域 */}
                <YStack gap="$2" alignItems="center" marginBottom="$2">
                  <View
                    width={80}
                    height={80}
                    backgroundColor={`${primaryColor}15`}
                    borderRadius="$12"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Heart size={36} color={primaryColor} />
                  </View>
                  <Text fontSize="$7" fontWeight="700" color="$primary" textAlign="center">
                    九紫康养
                  </Text>
                  <Text fontSize="$3" color="$color10" textAlign="center">
                    智能健康管理平台
                  </Text>
                </YStack>

                {/* 开发版本提示 */}
                <View
                  backgroundColor={`${warningColor}10`}
                  borderRadius="$4"
                  padding="$2"
                  borderWidth={1}
                  borderColor={`${warningColor}30`}
                >
                  <XStack gap="$2" alignItems="flex-start">
                    <Info size={18} color={warningColor} style={{ marginTop: 2 }} />
                    <YStack flex={1} gap="$1.5">
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        开发测试版本
                      </Text>
                      <Text fontSize="$2" color="$color10" lineHeight={18}>
                        当前为 2025 年 12 月开发版本，应用正在持续完善中。部分数据为测试数据，您也可以自由填写任意数据进行体验。
                      </Text>
                      <Text fontSize="$2" color="$color10" lineHeight={18}>
                        欢迎体验！如遇到任何问题或有改进建议，请随时与我们联系。感谢您的包涵与指正！
                      </Text>
                    </YStack>
                  </XStack>
                </View>

                {/* 体验按钮 */}
                <YStack gap="$2" marginTop="$2">
                  <Pressable
                    onPress={handleEnter}
                    disabled={isLoading}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      opacity: isLoading ? 0.7 : 1,
                    })}
                  >
                    <View
                      backgroundColor="$primary"
                      borderRadius="$10"
                      paddingVertical="$3"
                      alignItems="center"
                    >
                      <Text fontSize="$5" fontWeight="600" color="white">
                        {isLoading ? '正在进入...' : '立即体验'}
                      </Text>
                    </View>
                  </Pressable>
                </YStack>

                {/* 版本信息 */}
                <Text fontSize="$2" color="$color10" textAlign="center" marginTop="$2">
                  Version 1.0.0 (Dev Build)
                </Text>
              </YStack>
            </View>
          </View>
        </LinearGradient>
        <ToastViewport />
      </SafeAreaView>
    </Theme>
  );
};
