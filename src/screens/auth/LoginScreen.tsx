/**
 * LoginScreen 登录页
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  View,
  Separator,
  Theme,
  useTheme,
} from 'tamagui';
import { ToastViewport, useToastController } from '@tamagui/toast';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Pressable, Alert } from 'react-native';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { setCurrentUser } from '@/store/slices/userSlice';

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToastController();

  // 主题色
  const primaryColor = theme.primary?.val;
  const accentColor = theme.accent?.val;
  const color10 = theme.color10?.val;

  // 渐变色
  const gradientColors = [primaryColor, accentColor] as [string, string];

  // 模拟登录处理
  const handleLogin = async () => {
    // 验证输入
    if (!email.trim() || !password.trim()) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }

    setIsLoading(true);

    // 模拟API延迟
    setTimeout(() => {
      // 测试账号验证
      if (email === 'test01@gmail.com' && password === '123456') {
        // 登录成功
        dispatch(loginSuccess({
          token: 'test-jwt-token-' + Date.now(),
          refreshToken: 'test-refresh-token-' + Date.now(),
        }));

        // 保存用户信息
        dispatch(setCurrentUser({
          id: 'test-user-01',
          email: 'test01@gmail.com',
          name: '测试用户',
          avatar: undefined,
          phone: '13800000001',
          gender: 'male',
          birthDate: '1995-01-01',
          height: 175,
          weight: 70,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        toast.show('登录成功，欢迎回来！', {
          duration: 2000,
          burntOptions: {
            preset: 'done',
            haptic: 'success',
          },
        });
        // Navigation will be handled by AppNavigator based on auth state
      } else {
        // 登录失败
        Alert.alert('登录失败', '邮箱或密码错误\n\n测试账号：\n邮箱：test01@gmail.com\n密码：123456');
      }
      setIsLoading(false);
    }, 1000);
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
              padding="$2"
              borderWidth={1}
              borderColor="$color5"
            >
              <YStack gap="$2">
                {/* Logo区域 */}
                <YStack gap="$2" alignItems="center" marginBottom="$2">
                  <View
                    width={72}
                    height={72}
                    backgroundColor={`${primaryColor}15`}
                    borderRadius="$12"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Heart size={32} color={primaryColor} />
                  </View>
                  <Text fontSize="$7" fontWeight="700" color="$primary" textAlign="center">
                    九紫康养
                  </Text>
                  <Text fontSize="$3" color="$color10" textAlign="center">
                    智能健康管理平台
                  </Text>
                </YStack>

                {/* 登录表单 */}
                <YStack gap="$2">
                  {/* 邮箱输入 */}
                  <YStack gap="$1">
                    <Text fontSize="$3" color="$color12" fontWeight="500">
                      邮箱地址
                    </Text>
                    <XStack
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color1"
                      alignItems="center"
                      paddingHorizontal="$2"
                      height={44}
                    >
                      <Mail size={18} color={color10} />
                      <Input
                        flex={1}
                        borderWidth={0}
                        backgroundColor="transparent"
                        placeholder="请输入邮箱地址"
                        placeholderTextColor={color10}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        fontSize="$3"
                        paddingLeft="$1.5"
                      />
                    </XStack>
                  </YStack>

                  {/* 密码输入 */}
                  <YStack gap="$1">
                    <Text fontSize="$3" color="$color12" fontWeight="500">
                      密码
                    </Text>
                    <XStack
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color1"
                      alignItems="center"
                      paddingHorizontal="$2"
                      height={44}
                    >
                      <Lock size={18} color={color10} />
                      <Input
                        flex={1}
                        borderWidth={0}
                        backgroundColor="transparent"
                        placeholder="请输入密码"
                        placeholderTextColor={color10}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        fontSize="$3"
                        paddingLeft="$1.5"
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <View padding="$1">
                          {showPassword ? (
                            <EyeOff size={18} color={color10} />
                          ) : (
                            <Eye size={18} color={color10} />
                          )}
                        </View>
                      </Pressable>
                    </XStack>
                  </YStack>

                  {/* 辅助链接 */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <Pressable>
                      <Text fontSize="$2" color="$color10">记住密码</Text>
                    </Pressable>
                    <Pressable>
                      <Text fontSize="$2" color="$primary">忘记密码？</Text>
                    </Pressable>
                  </XStack>
                </YStack>

                {/* 登录按钮 */}
                <YStack gap="$2" marginTop="$2">
                  <Pressable
                    onPress={handleLogin}
                    disabled={isLoading}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      opacity: isLoading ? 0.7 : 1,
                    })}
                  >
                    <View
                      backgroundColor="$primary"
                      borderRadius="$10"
                      paddingVertical="$2"
                      alignItems="center"
                    >
                      <Text fontSize="$4" fontWeight="600" color="white">
                        {isLoading ? '登录中...' : '登录'}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable>
                    <View
                      borderWidth={1}
                      borderColor="$primary"
                      backgroundColor="transparent"
                      borderRadius="$10"
                      paddingVertical="$2"
                      alignItems="center"
                    >
                      <Text fontSize="$4" fontWeight="500" color="$primary">
                        注册新账号
                      </Text>
                    </View>
                  </Pressable>
                </YStack>

                <Separator marginVertical="$2" borderColor="$color5" />

                {/* 第三方登录 */}
                <YStack gap="$2" alignItems="center">
                  <Text fontSize="$2" color="$color10">
                    其他登录方式
                  </Text>
                  <XStack gap="$2">
                    <Pressable>
                      <View
                        borderWidth={1}
                        borderColor="$primary"
                        borderRadius="$10"
                        paddingVertical="$1.5"
                        paddingHorizontal="$4"
                      >
                        <Text color="$primary" fontSize="$3" fontWeight="500">Gmail</Text>
                      </View>
                    </Pressable>
                    <Pressable>
                      <View
                        borderWidth={1}
                        borderColor="$success"
                        borderRadius="$10"
                        paddingVertical="$1.5"
                        paddingHorizontal="$4"
                      >
                        <Text color="$success" fontSize="$3" fontWeight="500">微信</Text>
                      </View>
                    </Pressable>
                  </XStack>
                </YStack>
              </YStack>
            </View>
          </View>
        </LinearGradient>
        <ToastViewport />
      </SafeAreaView>
    </Theme>
  );
};
