import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Animated, Alert } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Award,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { payOrder, getOrderById } from '@/services/orderService';
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
    color: '#07C160',
    description: '使用微信余额或绑定银行卡支付',
  },
  {
    id: 'alipay' as PaymentMethod,
    name: '支付宝',
    icon: 'wallet',
    color: '#1677FF',
    description: '使用支付宝余额或花呗支付',
  },
  {
    id: 'health_points' as PaymentMethod,
    name: '健康积分',
    icon: 'award',
    color: '#FFD700',
    description: '当前可用积分: 8,520',
  },
  {
    id: 'card' as PaymentMethod,
    name: '银行卡',
    icon: 'card',
    color: '#8B5CF6',
    description: '使用储蓄卡或信用卡支付',
  },
];

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;

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
    switch (iconName) {
      case 'smartphone':
        return <Smartphone size={28} color={COLORS.primary} />;
      case 'wallet':
        return <Wallet size={28} color={COLORS.primary} />;
      case 'award':
        return <Award size={28} color={COLORS.primary} />;
      case 'card':
        return <CreditCard size={28} color={COLORS.primary} />;
      default:
        return <CreditCard size={28} color={COLORS.primary} />;
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

      // 调用支付服务
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
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            marginBottom="$6"
          >
            <CheckCircle2 size={64} color="white" />
          </View>
        </Animated.View>
        <Text fontSize="$7" fontWeight="700" color="$text" marginBottom="$2">
          支付成功
        </Text>
        <Text fontSize="$3" color="$textSecondary" marginBottom="$6">
          订单号: {params.orderId}
        </Text>
        <Text fontSize="$2" color="$textSecondary">
          正在跳转到订单页面...
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text flex={1} textAlign="center" fontSize="$5" fontWeight="600" color="$text">
          收银台
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView>
        <YStack padding="$4" gap="$4">
          {/* 支付金额 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$5" alignItems="center">
            <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
              支付金额
            </Text>
            <Text fontSize="$10" fontWeight="700" color={COLORS.primary}>
              ¥{params.totalAmount?.toFixed(2) || '0.00'}
            </Text>
            <Text fontSize="$2" color="$textSecondary" marginTop="$2">
              订单号: {params.orderId}
            </Text>
          </View>

          {/* 支付方式选择 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              选择支付方式
            </Text>
            <YStack gap="$3">
              {PAYMENT_METHODS.map(method => {
                const isSelected = selectedMethod === method.id;
                return (
                  <Pressable key={method.id} onPress={() => setSelectedMethod(method.id)}>
                    <XStack
                      padding="$3"
                      borderRadius="$3"
                      borderWidth={2}
                      borderColor={isSelected ? COLORS.primary : '$borderColor'}
                      backgroundColor={isSelected ? COLORS.primary : '$background'}
                      alignItems="center"
                      gap="$3"
                    >
                      <View
                        width={48}
                        height={48}
                        borderRadius="$2"
                        backgroundColor={isSelected ? '$background' : '$surface'}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {getPaymentIcon(method.icon)}
                      </View>
                      <YStack flex={1} gap="$1">
                        <Text
                          fontSize="$4"
                          fontWeight="600"
                          color={isSelected ? 'white' : '$text'}
                        >
                          {method.name}
                        </Text>
                        <Text fontSize="$2" color={isSelected ? 'white' : '$textSecondary'}>
                          {method.description}
                        </Text>
                      </YStack>
                      <View
                        width={20}
                        height={20}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={isSelected ? 'white' : '$borderColor'}
                        backgroundColor={isSelected ? 'white' : 'transparent'}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {isSelected && <View width={8} height={8} borderRadius={4} backgroundColor={COLORS.primary} />}
                      </View>
                    </XStack>
                  </Pressable>
                );
              })}
            </YStack>
          </View>

          {/* 支付说明 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              支付说明
            </Text>
            <YStack gap="$1">
              <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                • 支付成功后，订单将自动进入处理流程
              </Text>
              <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                • 如遇支付问题，请联系客服: 400-888-9999
              </Text>
              <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                • 支付信息已加密，请放心支付
              </Text>
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={80} />
        </YStack>
      </ScrollView>

      {/* 底部支付按钮 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        padding="$4"
      >
        <Pressable onPress={handlePayment} disabled={isProcessing}>
          <View
            height={52}
            borderRadius="$3"
            backgroundColor={isProcessing ? COLORS.textSecondary : COLORS.primary}
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