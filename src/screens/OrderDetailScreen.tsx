import React, { useState, useCallback } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { View, Text, XStack, YStack, Card, Separator, H3 } from 'tamagui';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  CreditCard,
  Truck,
} from 'lucide-react-native';
import {
  COLORS,
  ORDER_STATUS_STEPS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/constants/app';
import { getOrderById, cancelOrder, confirmDelivery, Order } from '@/services/orderService';
import { OrderStatus } from '@/types/commerce';

interface RouteParams {
  orderId: string;
}

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrderDetail = async () => {
    try {
      const orderData = await getOrderById(params.orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('加载订单详情失败:', error);
      Alert.alert('错误', '订单详情加载失败');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrderDetail();
    }, [params.orderId])
  );

  // 取消订单
  const handleCancelOrder = () => {
    Alert.alert('取消订单', '确定要取消此订单吗？', [
      { text: '我再想想', style: 'cancel' },
      {
        text: '确认取消',
        style: 'destructive',
        onPress: async () => {
          const success = await cancelOrder(params.orderId);
          if (success) {
            Alert.alert('成功', '订单已取消');
            loadOrderDetail();
          } else {
            Alert.alert('错误', '取消订单失败');
          }
        },
      },
    ]);
  };

  // 确认收货
  const handleConfirmDelivery = async () => {
    const success = await confirmDelivery(params.orderId);
    if (success) {
      Alert.alert('成功', '确认收货成功');
      loadOrderDetail();
    } else {
      Alert.alert('错误', '确认收货失败');
    }
  };

  // 联系客服
  const handleContactService = () => {
    Alert.alert('联系客服', '客服电话: 400-888-9999');
  };

  // 再次购买
  const handleBuyAgain = () => {
    if (order) {
      // 根据订单类型跳转到对应页面
      if (order.itemType === 'meal_plan') {
        navigation.navigate('NutritionService' as never);
      } else if (order.itemType === 'consultation') {
        navigation.navigate('NutritionistDetail' as never, {
          nutritionistId: order.metadata?.nutritionistId,
        } as never);
      }
    }
  };

  // 去支付
  const handlePay = () => {
    if (order) {
      navigation.navigate('Payment' as never, {
        orderId: order.id,
        totalAmount: order.totalAmount,
      } as never);
    }
  };

  // 获取当前状态索引
  const getCurrentStepIndex = (status: OrderStatus): number => {
    if (status === 'cancelled' || status === 'refunded') return -1;
    return ORDER_STATUS_STEPS.findIndex(step => step.status === status);
  };

  // 渲染操作按钮
  const renderActionButtons = () => {
    if (!order) return null;

    const buttons: JSX.Element[] = [];

    switch (order.status) {
      case 'pending':
        buttons.push(
          <Pressable key="cancel" onPress={handleCancelOrder} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              borderWidth={1}
              borderColor={COLORS.textSecondary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="$text" fontWeight="600">
                取消订单
              </Text>
            </View>
          </Pressable>,
          <Pressable key="pay" onPress={handlePay} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                立即支付
              </Text>
            </View>
          </Pressable>
        );
        break;

      case 'paid':
      case 'processing':
        buttons.push(
          <Pressable key="contact" onPress={handleContactService} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              borderWidth={1}
              borderColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
                联系客服
              </Text>
            </View>
          </Pressable>
        );
        break;

      case 'shipping':
      case 'delivered':
        buttons.push(
          <Pressable key="contact" onPress={handleContactService} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              borderWidth={1}
              borderColor={COLORS.textSecondary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="$text" fontWeight="600">
                联系客服
              </Text>
            </View>
          </Pressable>,
          <Pressable key="confirm" onPress={handleConfirmDelivery} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                确认收货
              </Text>
            </View>
          </Pressable>
        );
        break;

      case 'completed':
        buttons.push(
          <Pressable key="buyAgain" onPress={handleBuyAgain} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                再次购买
              </Text>
            </View>
          </Pressable>
        );
        break;

      case 'cancelled':
      case 'refunded':
        buttons.push(
          <Pressable key="buyAgain" onPress={handleBuyAgain} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                重新下单
              </Text>
            </View>
          </Pressable>
        );
        break;
    }

    return (
      <XStack gap="$3" padding="$4" backgroundColor="$surface">
        {buttons}
      </XStack>
    );
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text marginTop="$3" color="$textSecondary">
          加载订单详情...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$textSecondary">
          订单不存在
        </Text>
      </View>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);

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
          订单详情
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView flex={1}>
        <YStack gap="$3" paddingBottom="$20">
          {/* 订单状态流程 */}
          {order.status !== 'cancelled' && order.status !== 'refunded' && (
            <Card backgroundColor="$surface" padding="$4">
              <YStack gap="$4">
                <H3 fontSize="$5" fontWeight="600">
                  订单状态
                </H3>
                <XStack justifyContent="space-between" position="relative">
                  {/* 连接线 */}
                  <View
                    position="absolute"
                    top={12}
                    left="12.5%"
                    right="12.5%"
                    height={2}
                    backgroundColor="$borderColor"
                  />
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    return (
                      <YStack key={step.status} alignItems="center" flex={1} zIndex={1}>
                        <View
                          width={24}
                          height={24}
                          borderRadius={12}
                          backgroundColor={isActive ? COLORS.primary : '$borderColor'}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$2"
                        >
                          {isActive ? (
                            <CheckCircle2 size={16} color="white" />
                          ) : (
                            <View
                              width={8}
                              height={8}
                              borderRadius={4}
                              backgroundColor="white"
                            />
                          )}
                        </View>
                        <Text
                          fontSize="$2"
                          color={isActive ? '$text' : '$textSecondary'}
                          fontWeight={isActive ? '600' : '400'}
                          textAlign="center"
                        >
                          {step.label}
                        </Text>
                      </YStack>
                    );
                  })}
                </XStack>
              </YStack>
            </Card>
          )}

          {/* 取消/退款状态 */}
          {(order.status === 'cancelled' || order.status === 'refunded') && (
            <Card backgroundColor="$surface" padding="$4">
              <XStack gap="$3" alignItems="center">
                <XCircle size={32} color={ORDER_STATUS_COLORS[order.status]} />
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="600" color={ORDER_STATUS_COLORS[order.status]}>
                    {order.status === 'cancelled' ? '订单已取消' : '订单已退款'}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    {order.status === 'cancelled'
                      ? '订单已取消，如有疑问请联系客服'
                      : '退款将在3-7个工作日内到账'}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          )}

          {/* 订单信息 */}
          <Card backgroundColor="$surface" padding="$4">
            <YStack gap="$3">
              <H3 fontSize="$5" fontWeight="600">
                订单信息
              </H3>
              <YStack gap="$3">
                <XStack gap="$3">
                  <Package size={24} color={COLORS.primary} />
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      {order.itemName}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                      订单号: {order.id}
                    </Text>
                  </YStack>
                  <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                    ¥{order.totalAmount.toFixed(2)}
                  </Text>
                </XStack>

                {order.metadata?.appointmentDate && order.metadata?.appointmentTime && (
                  <>
                    <Separator />
                    <XStack gap="$3" alignItems="center">
                      <Calendar size={20} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$text">
                        预约时间
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" flex={1} textAlign="right">
                        {order.metadata.appointmentDate} {order.metadata.appointmentTime}
                      </Text>
                    </XStack>
                  </>
                )}

                <Separator />
                <XStack gap="$3" alignItems="center">
                  <Clock size={20} color={COLORS.textSecondary} />
                  <Text fontSize="$3" color="$text">
                    下单时间
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" flex={1} textAlign="right">
                    {order.createdAt}
                  </Text>
                </XStack>

                {order.paidAt && (
                  <>
                    <Separator />
                    <XStack gap="$3" alignItems="center">
                      <CreditCard size={20} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$text">
                        支付时间
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" flex={1} textAlign="right">
                        {order.paidAt}
                      </Text>
                    </XStack>
                  </>
                )}
              </YStack>
            </YStack>
          </Card>

          {/* 收货信息 */}
          {order.deliveryAddress && (
            <Card backgroundColor="$surface" padding="$4">
              <YStack gap="$3">
                <H3 fontSize="$5" fontWeight="600">
                  收货信息
                </H3>
                <XStack gap="$3">
                  <MapPin size={20} color={COLORS.primary} />
                  <YStack flex={1} gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        {order.deliveryAddress.name}
                      </Text>
                      <Text fontSize="$3" color="$textSecondary">
                        {order.deliveryAddress.phone}
                      </Text>
                    </XStack>
                    <Text fontSize="$3" color="$textSecondary" lineHeight={20}>
                      {order.deliveryAddress.province} {order.deliveryAddress.city}{' '}
                      {order.deliveryAddress.district} {order.deliveryAddress.detail}
                    </Text>
                  </YStack>
                </XStack>
              </YStack>
            </Card>
          )}

          {/* 价格明细 */}
          <Card backgroundColor="$surface" padding="$4">
            <YStack gap="$3">
              <H3 fontSize="$5" fontWeight="600">
                价格明细
              </H3>
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    商品金额
                  </Text>
                  <Text fontSize="$3" color="$text">
                    ¥{order.totalAmount.toFixed(2)}
                  </Text>
                </XStack>
                {order.discountAmount && order.discountAmount > 0 && (
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$textSecondary">
                      优惠折扣
                    </Text>
                    <Text fontSize="$3" color={COLORS.primary}>
                      -¥{order.discountAmount.toFixed(2)}
                    </Text>
                  </XStack>
                )}
                <Separator />
                <XStack justifyContent="space-between">
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    实付金额
                  </Text>
                  <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                    ¥{order.totalAmount.toFixed(2)}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>

      {/* 底部操作按钮 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        {renderActionButtons()}
      </View>
    </View>
  );
};

export default OrderDetailScreen;
