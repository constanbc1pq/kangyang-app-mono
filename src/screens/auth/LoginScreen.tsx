import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Card,
  H1,
  Separator,
  Theme,
  View,
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { setCurrentUser } from '@/store/slices/userSlice';
import { Alert } from 'react-native';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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

        Alert.alert('登录成功', '欢迎回来！');
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
          colors={['#7C3AED', '#2C7A7B']}
          style={{ flex: 1 }}
        >
          <View flex={1} justifyContent="center" alignItems="center" padding="$6">
            <Card
              width="100%"
              maxWidth={400}
              backgroundColor="$surface"
              borderRadius="$6"
              padding="$8"
              shadowColor="$primary"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.15}
              shadowRadius={20}
              elevation={8}
            >
              <YStack space="$6">
                {/* Logo区域 */}
                <YStack space="$3" alignItems="center">
                  <View
                    width={80}
                    height={80}
                    backgroundColor="rgba(124, 58, 237, 0.1)"
                    borderRadius={40}
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$4"
                  >
                    <Heart size={32} color="$primary" />
                  </View>
                  <H1 fontSize="$8" fontWeight="bold" color="$primary" textAlign="center">
                    九紫康养
                  </H1>
                  <Text fontSize="$4" color="$textSecondary" textAlign="center">
                    智能健康管理平台
                  </Text>
                </YStack>

                {/* 登录表单 */}
                <YStack space="$4">
                  <YStack space="$2">
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      邮箱地址
                    </Text>
                    <XStack
                      borderWidth={1}
                      borderColor="$primary"
                      borderRadius="$3"
                      backgroundColor="$background"
                      alignItems="center"
                      paddingHorizontal="$3"
                    >
                      <View marginRight="$2">
                        <Mail size={20} color="#6B7280" />
                      </View>
                      <Input
                        flex={1}
                        borderWidth={0}
                        backgroundColor="transparent"
                        placeholder="请输入邮箱地址"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </XStack>
                  </YStack>

                  <YStack space="$2">
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      密码
                    </Text>
                    <XStack
                      borderWidth={1}
                      borderColor="$primary"
                      borderRadius="$3"
                      backgroundColor="$background"
                      alignItems="center"
                      paddingHorizontal="$3"
                    >
                      <View marginRight="$2">
                        <Lock size={20} color="#6B7280" />
                      </View>
                      <Input
                        flex={1}
                        borderWidth={0}
                        backgroundColor="transparent"
                        placeholder="请输入密码"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <Button
                        size="$2"
                        chromeless
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Eye size={20} color="#6B7280" />
                        )}
                      </Button>
                    </XStack>
                  </YStack>

                  <XStack justifyContent="space-between" alignItems="center">
                    <Button variant="outlined" size="$2" chromeless>
                      <Text fontSize="$2" color="$primary">记住密码</Text>
                    </Button>
                    <Button variant="outlined" size="$2" chromeless>
                      <Text fontSize="$2" color="$secondary">忘记密码？</Text>
                    </Button>
                  </XStack>
                </YStack>

                {/* 登录按钮 */}
                <YStack space="$3">
                  <Button
                    backgroundColor="$primary"
                    borderRadius="$3"
                    size="$5"
                    pressStyle={{ scale: 0.98 }}
                    onPress={handleLogin}
                    disabled={isLoading}
                    opacity={isLoading ? 0.7 : 1}
                  >
                    <Text fontSize="$4" fontWeight="600" color="white">
                      {isLoading ? '登录中...' : '登录'}
                    </Text>
                  </Button>

                  <Button
                    variant="outlined"
                    borderColor="$secondary"
                    borderRadius="$3"
                    size="$5"
                  >
                    <Text fontSize="$4" fontWeight="500" color="$secondary">
                      注册新账号
                    </Text>
                  </Button>
                </YStack>

                <Separator />

                {/* 第三方登录 */}
                <YStack space="$3" alignItems="center">
                  <Text fontSize="$2" color="$textSecondary">
                    其他登录方式
                  </Text>
                  <XStack space="$3">
                    <Button
                      size="$4"
                      variant="outlined"
                      borderColor="$primary"
                      borderRadius="$10"
                      paddingHorizontal="$5"
                    >
                      <Text color="$primary" fontSize="$2">Gmail</Text>
                    </Button>
                    <Button
                      size="$4"
                      variant="outlined"
                      borderColor="$success"
                      borderRadius="$10"
                      paddingHorizontal="$5"
                    >
                      <Text color="$success" fontSize="$2">微信</Text>
                    </Button>
                  </XStack>
                </YStack>
              </YStack>
            </Card>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Theme>
  );
};