/**
 * OrderDetailScreen - 订单详情页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState, useCallback } from 'react';
import { Pressable, Alert } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import {
  Package,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  CreditCard,
  MessageSquare,
  RefreshCcw,
  Truck,
  ShoppingBag,
  User,
  Heart,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import {
  ORDER_STATUS_STEPS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/constants/app';
import { getOrderById, cancelOrder, confirmDelivery, Order } from '@/services/orderService';
import { OrderStatus, ItemType } from '@/types/commerce';

interface RouteParams {
  orderId: string;
}

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

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

  // 联系客服 - 跳转到 CustomerServiceChat
  const handleContactService = () => {
    if (!order) return;
    navigation.navigate('CustomerServiceChat' as never, {
      orderId: order.id,
      orderName: order.itemName,
    } as never);
  };

  // 再次购买
  const handleBuyAgain = () => {
    if (order) {
      if (order.itemType === 'meal_plan') {
        navigation.navigate('NutritionService' as never);
      } else if (order.itemType === 'consultation') {
        navigation.navigate('NutritionistDetail' as never, {
          nutritionistId: order.metadata?.nutritionistId,
        } as never);
      } else if (order.itemType === 'private_doctor') {
        navigation.navigate('PrivateDoctorList' as never);
      }
    }
  };

  // 进入私人医生服务台
  const handleGoToServiceDesk = () => {
    if (order && order.metadata?.subscriptionId) {
      navigation.navigate('PrivateDoctorServiceDesk' as never, {
        subscriptionId: order.metadata.subscriptionId,
      } as never);
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

  // 获取订单图标
  const getOrderIcon = (type: ItemType) => {
    switch (type) {
      case 'meal_plan':
        return <ShoppingBag size={24} color={primaryColor} />;
      case 'consultation':
        return <MessageSquare size={24} color={primaryColor} />;
      case 'elderly_service':
        return <Heart size={24} color={primaryColor} />;
      case 'product':
        return <Package size={24} color={primaryColor} />;
      case 'private_doctor':
        return <User size={24} color={primaryColor} />;
      default:
        return <Package size={24} color={primaryColor} />;
    }
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
              borderRadius="$10"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$color2"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="$color12" fontWeight="500">
                取消订单
              </Text>
            </View>
          </Pressable>,
          <Pressable key="pay" onPress={handlePay} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              backgroundColor={primaryColor}
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
        if (order.itemType === 'private_doctor') {
          buttons.push(
            <Pressable key="serviceDesk" onPress={handleGoToServiceDesk} style={{ flex: 1 }}>
              <View
                height={48}
                borderRadius="$10"
                backgroundColor={primaryColor}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$4" color="white" fontWeight="600">
                  进入服务台
                </Text>
              </View>
            </Pressable>
          );
        } else {
          buttons.push(
            <Pressable key="contact" onPress={handleContactService} style={{ flex: 1 }}>
              <View
                height={48}
                borderRadius="$10"
                borderWidth={1}
                borderColor={primaryColor}
                backgroundColor="$color2"
                justifyContent="center"
                alignItems="center"
              >
                <XStack gap="$1.5" alignItems="center">
                  <MessageSquare size={18} color={primaryColor} />
                  <Text fontSize="$4" color="$primary" fontWeight="500">
                    咨询客服
                  </Text>
                </XStack>
              </View>
            </Pressable>
          );
        }
        break;

      case 'shipping':
      case 'delivered':
        buttons.push(
          <Pressable key="contact" onPress={handleContactService} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$color2"
              justifyContent="center"
              alignItems="center"
            >
              <XStack gap="$1.5" alignItems="center">
                <MessageSquare size={18} color={color10} />
                <Text fontSize="$4" color="$color12" fontWeight="500">
                  咨询客服
                </Text>
              </XStack>
            </View>
          </Pressable>,
          <Pressable key="confirm" onPress={handleConfirmDelivery} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              backgroundColor={primaryColor}
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
          <Pressable key="contact" onPress={handleContactService} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$color2"
              justifyContent="center"
              alignItems="center"
            >
              <XStack gap="$1.5" alignItems="center">
                <MessageSquare size={18} color={color10} />
                <Text fontSize="$4" color="$color12" fontWeight="500">
                  咨询客服
                </Text>
              </XStack>
            </View>
          </Pressable>,
          <Pressable key="buyAgain" onPress={handleBuyAgain} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              backgroundColor={primaryColor}
              justifyContent="center"
              alignItems="center"
            >
              <XStack gap="$1.5" alignItems="center">
                <RefreshCcw size={18} color="white" />
                <Text fontSize="$4" color="white" fontWeight="600">
                  再次购买
                </Text>
              </XStack>
            </View>
          </Pressable>
        );
        break;

      case 'cancelled':
      case 'refunded':
        if (order.itemType === 'private_doctor' && order.metadata?.subscriptionId) {
          buttons.push(
            <Pressable key="serviceDesk" onPress={handleGoToServiceDesk} style={{ flex: 1 }}>
              <View
                height={48}
                borderRadius="$10"
                backgroundColor={primaryColor}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$4" color="white" fontWeight="600">
                  进入服务台
                </Text>
              </View>
            </Pressable>
          );
        } else {
          buttons.push(
            <Pressable key="contact" onPress={handleContactService} style={{ flex: 1 }}>
              <View
                height={48}
                borderRadius="$10"
                borderWidth={1}
                borderColor="$color5"
                backgroundColor="$color2"
                justifyContent="center"
                alignItems="center"
              >
                <XStack gap="$1.5" alignItems="center">
                  <MessageSquare size={18} color={color10} />
                  <Text fontSize="$4" color="$color12" fontWeight="500">
                    咨询客服
                  </Text>
                </XStack>
              </View>
            </Pressable>,
            <Pressable key="buyAgain" onPress={handleBuyAgain} style={{ flex: 1 }}>
              <View
                height={48}
                borderRadius="$10"
                backgroundColor={primaryColor}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$4" color="white" fontWeight="600">
                  重新下单
                </Text>
              </View>
            </Pressable>
          );
        }
        break;
    }

    return (
      <XStack gap="$2" paddingHorizontal="$2.5" paddingTop="$2" paddingBottom={insets.bottom > 0 ? insets.bottom : 16}>
        {buttons}
      </XStack>
    );
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="订单详情" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">加载中...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="订单详情" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center">
          <Package size={48} color={color10} />
          <Text fontSize="$4" color="$color10" marginTop="$2">
            订单不存在
          </Text>
        </View>
      </View>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);
  const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS];

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="订单详情" />
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack padding="$2.5" gap="$2">
          {/* 订单状态流程 */}
          {order.status !== 'cancelled' && order.status !== 'refunded' && (
            <View
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                订单状态
              </Text>

              <XStack justifyContent="space-between" position="relative">
                {/* 连接线 */}
                <View
                  position="absolute"
                  top={12}
                  left="12.5%"
                  right="12.5%"
                  height={2}
                  backgroundColor="$color5"
                />

                {ORDER_STATUS_STEPS.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  return (
                    <YStack key={step.status} alignItems="center" flex={1} zIndex={1}>
                      <View
                        width={24}
                        height={24}
                        borderRadius={12}
                        backgroundColor={isActive ? primaryColor : '$color5'}
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="$1.5"
                      >
                        {isActive ? (
                          <CheckCircle2 size={14} color="white" />
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
                        color={isActive ? '$color12' : '$color10'}
                        fontWeight={isActive ? '600' : '400'}
                        textAlign="center"
                      >
                        {step.label}
                      </Text>
                    </YStack>
                  );
                })}
              </XStack>
            </View>
          )}

          {/* 取消/退款状态 */}
          {(order.status === 'cancelled' || order.status === 'refunded') && (
            <View
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <XStack gap="$2" alignItems="center">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor={`${statusColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <XCircle size={24} color={statusColor} />
                </View>
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="600" color={statusColor}>
                    {order.status === 'cancelled' ? '订单已取消' : '订单已退款'}
                  </Text>
                  <Text fontSize="$2" color="$color10" marginTop="$0.5">
                    {order.status === 'cancelled'
                      ? '订单已取消，如有疑问请联系客服'
                      : '退款将在3-7个工作日内到账'}
                  </Text>
                </YStack>
              </XStack>
            </View>
          )}

          {/* 订单信息 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              订单信息
            </Text>

            <XStack gap="$2" alignItems="flex-start" marginBottom="$2">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                {getOrderIcon(order.itemType)}
              </View>
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {order.itemName}
                </Text>
                <Text fontSize="$2" color="$color10" marginTop="$0.5">
                  订单号: {order.id}
                </Text>
              </YStack>
              <Text fontSize="$5" fontWeight="700" color="$primary">
                ¥{order.totalAmount.toFixed(2)}
              </Text>
            </XStack>

            <View height={1} backgroundColor="$color5" marginVertical="$1.5" />

            {/* 预约时间 */}
            {order.metadata?.appointmentDate && order.metadata?.appointmentTime && (
              <>
                <XStack gap="$2" alignItems="center" paddingVertical="$1.5">
                  <Calendar size={18} color={color10} />
                  <Text fontSize="$3" color="$color12" flex={1}>预约时间</Text>
                  <Text fontSize="$3" color="$color10">
                    {order.metadata.appointmentDate} {order.metadata.appointmentTime}
                  </Text>
                </XStack>
                <View height={1} backgroundColor="$color5" />
              </>
            )}

            {/* 下单时间 */}
            <XStack gap="$2" alignItems="center" paddingVertical="$1.5">
              <Clock size={18} color={color10} />
              <Text fontSize="$3" color="$color12" flex={1}>下单时间</Text>
              <Text fontSize="$3" color="$color10">{order.createdAt}</Text>
            </XStack>

            {/* 支付时间 */}
            {order.paidAt && (
              <>
                <View height={1} backgroundColor="$color5" />
                <XStack gap="$2" alignItems="center" paddingVertical="$1.5">
                  <CreditCard size={18} color={color10} />
                  <Text fontSize="$3" color="$color12" flex={1}>支付时间</Text>
                  <Text fontSize="$3" color="$color10">{order.paidAt}</Text>
                </XStack>
              </>
            )}
          </View>

          {/* 收货信息 */}
          {order.deliveryAddress && (
            <View
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                收货信息
              </Text>

              <XStack gap="$2" alignItems="flex-start">
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={`${primaryColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <MapPin size={20} color={primaryColor} />
                </View>
                <YStack flex={1} gap="$1">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      {order.deliveryAddress.name}
                    </Text>
                    <Text fontSize="$3" color="$color10">
                      {order.deliveryAddress.phone}
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$color10" lineHeight={20}>
                    {order.deliveryAddress.province} {order.deliveryAddress.city}{' '}
                    {order.deliveryAddress.district} {order.deliveryAddress.detail}
                  </Text>
                </YStack>
              </XStack>
            </View>
          )}

          {/* 价格明细 */}
          <View
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              价格明细
            </Text>

            <YStack gap="$1.5">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$color10">商品金额</Text>
                <Text fontSize="$3" color="$color12">¥{order.totalAmount.toFixed(2)}</Text>
              </XStack>

              {order.discountAmount && order.discountAmount > 0 && (
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$color10">优惠折扣</Text>
                  <Text fontSize="$3" color="$primary">-¥{order.discountAmount.toFixed(2)}</Text>
                </XStack>
              )}

              <View height={1} backgroundColor="$color5" marginVertical="$1" />

              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" fontWeight="600" color="$color12">实付金额</Text>
                <Text fontSize="$6" fontWeight="700" color="$primary">
                  ¥{order.totalAmount.toFixed(2)}
                </Text>
              </XStack>
            </YStack>
          </View>
        </YStack>
      </ScrollView>

      {/* 底部操作按钮 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
      >
        {renderActionButtons()}
      </View>
    </View>
  );
};

export default OrderDetailScreen;
