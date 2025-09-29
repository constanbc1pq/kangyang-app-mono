import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  HStack,
  Pressable,
  LinearGradient
} from '@gluestack-ui/themed';
import { COLORS } from '@/constants/app';

export const LoginScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={COLORS.gradientAccent}
      flex={1}
    >
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        px="$6"
      >
        <VStack
          space="xl"
          width="$full"
          maxWidth="$96"
          backgroundColor={COLORS.surface}
          borderRadius="$2xl"
          p="$8"
          shadowColor={COLORS.primary}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={20}
          elevation={8}
        >
          {/* Logo区域 */}
          <VStack space="md" alignItems="center">
            <Text
              fontSize="$3xl"
              fontWeight="$bold"
              color={COLORS.primary}
              textAlign="center"
            >
              康养APP
            </Text>
            <Text
              fontSize="$md"
              color={COLORS.textSecondary}
              textAlign="center"
            >
              您的健康管理专家
            </Text>
          </VStack>

          {/* 登录表单 */}
          <VStack space="lg">
            <VStack space="sm">
              <Text fontSize="$sm" color={COLORS.text} fontWeight="$medium">
                邮箱地址
              </Text>
              <Input
                borderColor={COLORS.primary}
                borderRadius="$lg"
                backgroundColor={COLORS.background}
              >
                <InputField
                  placeholder="请输入邮箱地址"
                  placeholderTextColor={COLORS.textSecondary}
                  fontSize="$md"
                />
              </Input>
            </VStack>

            <VStack space="sm">
              <Text fontSize="$sm" color={COLORS.text} fontWeight="$medium">
                密码
              </Text>
              <Input
                borderColor={COLORS.primary}
                borderRadius="$lg"
                backgroundColor={COLORS.background}
              >
                <InputField
                  placeholder="请输入密码"
                  placeholderTextColor={COLORS.textSecondary}
                  fontSize="$md"
                  secureTextEntry
                />
              </Input>
            </VStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Pressable>
                <Text fontSize="$sm" color={COLORS.primary}>
                  记住密码
                </Text>
              </Pressable>
              <Pressable>
                <Text fontSize="$sm" color={COLORS.secondary}>
                  忘记密码？
                </Text>
              </Pressable>
            </HStack>
          </VStack>

          {/* 登录按钮 */}
          <VStack space="md">
            <Button
              backgroundColor={COLORS.primary}
              borderRadius="$lg"
              size="lg"
              shadowColor={COLORS.primary}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={8}
              elevation={4}
            >
              <ButtonText
                fontSize="$md"
                fontWeight="$semibold"
                color="$white"
              >
                登录
              </ButtonText>
            </Button>

            <Button
              variant="outline"
              borderColor={COLORS.secondary}
              borderRadius="$lg"
              size="lg"
            >
              <ButtonText
                fontSize="$md"
                fontWeight="$medium"
                color={COLORS.secondary}
              >
                注册新账号
              </ButtonText>
            </Button>
          </VStack>

          {/* 第三方登录 */}
          <VStack space="md" alignItems="center">
            <Text fontSize="$sm" color={COLORS.textSecondary}>
              或使用以下方式登录
            </Text>
            <HStack space="md">
              <Button
                size="md"
                variant="outline"
                borderColor={COLORS.accent}
                borderRadius="$full"
                px="$6"
              >
                <ButtonText color={COLORS.accent} fontSize="$sm">
                  Gmail
                </ButtonText>
              </Button>
              <Button
                size="md"
                variant="outline"
                borderColor={COLORS.success}
                borderRadius="$full"
                px="$6"
              >
                <ButtonText color={COLORS.success} fontSize="$sm">
                  微信
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </LinearGradient>
  );
};