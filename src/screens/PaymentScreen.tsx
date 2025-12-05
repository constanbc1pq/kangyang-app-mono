/**
 * PaymentScreen 支付页面
 * 支持多种支付方式：微信、支付宝、健康积分、银行卡
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Animated, Alert } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Award,
  CheckCircle2,
} from 'lucide-react-native';
import { payOrder } from '@/services/orderService';
import { PaymentMethod } from '@/types/commerce';

interface RouteParams {
  orderId: string;
  totalAmount: number;
}

const PAYMENT_METHODS = [
  {
    id: 'wechat' as PaymentMethod,
    name: '微信支付',
    icon: 'smartphone',
    description: '使用微信余额或绑定银行卡支付',
  },
  {
    id: 'alipay' as PaymentMethod,
    name: '支付宝',
    icon: 'wallet',
    description: '使用支付宝余额或花呗支付',
  },
  {
    id: 'health_points' as PaymentMethod,
    name: '健康积分',
    icon: 'award',
    description: '当前可用积分: 8,520',
  },
  {
    id: 'card' as PaymentMethod,
    name: '银行卡',
    icon: 'card',
    description: '使用储蓄卡或信用卡支付',
  },
];

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const color12 = theme.color12?.val;
  const color10 = theme.color10?.val;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wechat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (paymentSuccess) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [paymentSuccess]);

  const getPaymentIcon = (iconName: string) => {
    const iconColor = primaryColor;
    switch (iconName) {
      case 'smartphone':
        return <Smartphone size={28} color={iconColor} />;
      case 'wallet':
        return <Wallet size={28} color={iconColor} />;
      case 'award':
        return <Award size={28} color={iconColor} />;
      case 'card':
        return <CreditCard size={28} color={iconColor} />;
      default:
        return <CreditCard size={28} color={iconColor} />;
    }
  };

  const handlePayment = async () => {
    if (!params.orderId) {
      Alert.alert('错误', '订单信息错误');
      return;
    }

    setIsProcessing(true);

    try {
      // 模拟支付处理（2秒）
      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = await payOrder(
        params.orderId,
        selectedMethod,
        `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      );

      if (success) {
        setPaymentSuccess(true);

        // 2秒后自动跳转到个人中心的订单页
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'HomeTabs' as never,
                state: {
                  routes: [
                    {
                      name: 'ProfileTab',
                      params: { initialTab: 'orders' },
                    },
                  ],
                  index: 0,
                },
              },
            ],
          });
        }, 2000);
      } else {
        throw new Error('支付失败');
      }
    } catch (error) {
      console.error('支付失败:', error);
      Alert.alert('错误', '支付失败，请重试');
      setIsProcessing(false);
    }
  };

  // 支付成功界面
  if (paymentSuccess) {
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
            backgroundColor="$success"
            justifyContent="center"
            alignItems="center"
            marginBottom="$4"
          >
            <CheckCircle2 size={64} color="white" />
          </View>
        </Animated.View>
        <Text fontSize="$6" fontWeight="700" color="$color12" marginBottom="$2">
          支付成功
        </Text>
        <Text fontSize="$3" color="$color10" marginBottom="$4">
          订单号: {params.orderId}
        </Text>
        <Text fontSize="$2" color="$color10">
          正在跳转到订单页面...
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            收银台
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* 支付金额 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$4"
            alignItems="center"
          >
            <Text fontSize="$3" color="$color10" marginBottom="$2">
              支付金额
            </Text>
            <Text fontSize="$9" fontWeight="700" color="$primary">
              ¥{params.totalAmount?.toFixed(2) || '0.00'}
            </Text>
            <Text fontSize="$2" color="$color10" marginTop="$2">
              订单号: {params.orderId}
            </Text>
          </View>

          {/* 支付方式选择 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              选择支付方式
            </Text>
            <YStack gap="$2">
              {PAYMENT_METHODS.map(method => {
                const isSelected = selectedMethod === method.id;
                return (
                  <Pressable key={method.id} onPress={() => setSelectedMethod(method.id)}>
                    <XStack
                      padding="$2"
                      borderRadius="$4"
                      borderWidth={2}
                      borderColor={isSelected ? '$primary' : '$color5'}
                      backgroundColor={isSelected ? '$primary' : '$color2'}
                      alignItems="center"
                      gap="$2"
                    >
                      <View
                        width={48}
                        height={48}
                        borderRadius={24}
                        backgroundColor={isSelected ? '$color2' : '$color4'}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {getPaymentIcon(method.icon)}
                      </View>
                      <YStack flex={1} gap="$0.5">
                        <Text
                          fontSize="$4"
                          fontWeight="600"
                          color={isSelected ? 'white' : '$color12'}
                        >
                          {method.name}
                        </Text>
                        <Text fontSize="$2" color={isSelected ? 'white' : '$color10'}>
                          {method.description}
                        </Text>
                      </YStack>
                      <View
                        width={20}
                        height={20}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={isSelected ? 'white' : '$color5'}
                        backgroundColor={isSelected ? 'white' : 'transparent'}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {isSelected && (
                          <View width={8} height={8} borderRadius={4} backgroundColor="$primary" />
                        )}
                      </View>
                    </XStack>
                  </Pressable>
                );
              })}
            </YStack>
          </View>

          {/* 支付说明 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
              支付说明
            </Text>
            <YStack gap="$1">
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                • 支付成功后，订单将自动进入处理流程
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                • 如遇支付问题，请联系客服: 400-888-9999
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                • 支付信息已加密，请放心支付
              </Text>
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={100} />
        </YStack>
      </ScrollView>

      {/* 底部支付按钮 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        paddingBottom={insets.bottom + 8}
      >
        <Pressable onPress={handlePayment} disabled={isProcessing}>
          <View
            height={52}
            borderRadius="$10"
            backgroundColor={isProcessing ? '$color10' : '$primary'}
            justifyContent="center"
            alignItems="center"
          >
            {isProcessing ? (
              <XStack gap="$2" alignItems="center">
                <ActivityIndicator color="white" />
                <Text fontSize="$4" fontWeight="600" color="white">
                  支付处理中...
                </Text>
              </XStack>
            ) : (
              <Text fontSize="$5" fontWeight="700" color="white">
                确认支付 ¥{params.totalAmount?.toFixed(2) || '0.00'}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default PaymentScreen;
