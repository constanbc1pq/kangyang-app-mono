import React, { useState } from 'react';
import { ScrollView, Pressable, Platform, Alert, TextInput } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, MapPin, Clock, ChevronRight, Edit } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { createOrder } from '@/services/orderService';
import { CartItem, DeliveryAddress } from '@/types/commerce';

interface RouteParams {
  itemType: 'meal_plan' | 'consultation';
  itemId: string;
  itemName: string;
  itemImage?: string;
  price: number;
  providerId?: string;
  providerName?: string;
  // 营养套餐专用
  packageIcon?: string;
  // 营养师预约专用
  serviceType?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  duration?: number;
}

const CYCLE_OPTIONS = [
  { days: 7, label: '7天', discount: 1 },
  { days: 14, label: '14天', discount: 0.95 },
  { days: 30, label: '30天', discount: 0.9 },
];

const TIME_SLOTS = [
  { id: 'breakfast', label: '早餐', time: '7:00-9:00' },
  { id: 'lunch', label: '午餐', time: '11:00-13:00' },
  { id: 'dinner', label: '晚餐', time: '17:00-19:00' },
];

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;

  const [selectedCycle, setSelectedCycle] = useState(7);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['breakfast', 'lunch', 'dinner']);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // 默认地址（实际应该从地址管理服务获取）
  const defaultAddress: DeliveryAddress = {
    id: 'addr_1',
    recipientName: '张先生',
    recipientPhone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detailAddress: '望京SOHO T3座 2008室',
    isDefault: true,
  };

  const isMealPlan = params.itemType === 'meal_plan';
  const isConsultation = params.itemType === 'consultation';

  // 计算价格
  const cycleOption = CYCLE_OPTIONS.find(opt => opt.days === selectedCycle) || CYCLE_OPTIONS[0];

  // 咨询订单：固定价格，不按周期计算
  // 套餐订单：价格 × 天数 × 折扣
  const subtotal = isConsultation
    ? params.price
    : params.price * selectedCycle * cycleOption.discount;

  const deliveryFee = isMealPlan ? (subtotal >= 200 ? 0 : 10) : 0;
  const totalAmount = subtotal + deliveryFee;

  const discountAmount = isMealPlan
    ? params.price * selectedCycle * (1 - cycleOption.discount)
    : 0;

  const toggleTimeSlot = (slotId: string) => {
    if (selectedTimeSlots.includes(slotId)) {
      if (selectedTimeSlots.length > 1) {
        setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== slotId));
      } else {
        Alert.alert('提示', '至少选择一个配送时段');
      }
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slotId]);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      // 构建 CartItem
      const cartItem: CartItem = {
        id: `cart_${Date.now()}`,
        itemType: params.itemType,
        itemId: params.itemId,
        itemName: params.itemName,
        itemImage: params.itemImage || params.packageIcon,
        price: params.price,
        quantity: 1,
        unit: isMealPlan ? '天' : '次',
        cycle: isMealPlan ? selectedCycle : undefined,
        cycleDiscount: isMealPlan ? cycleOption.discount : undefined,
        deliveryTimeSlots: isMealPlan ? selectedTimeSlots.map(slotId => {
          const slot = TIME_SLOTS.find(s => s.id === slotId);
          return {
            slotId,
            slotName: slot?.label || '',
            slotTime: slot?.time || '',
          };
        }) : undefined,
        serviceDate: isConsultation ? params.appointmentDate : undefined,
        serviceTime: isConsultation ? params.appointmentTime : undefined,
        providerId: params.providerId,
        providerName: params.providerName,
        metadata: isConsultation ? {
          serviceType: params.serviceType,
          duration: params.duration,
        } : undefined,
      };

      // 创建订单
      const order = await createOrder({
        userId: 'user_test01',
        cartItems: [cartItem],
        deliveryAddress: defaultAddress,
        deliveryNotes,
        deliveryFee,
      });

      if (order) {
        // 跳转到支付页面
        navigation.navigate('Payment' as never, {
          orderId: order.id,
          totalAmount: order.totalAmount,
        } as never);
      } else {
        Alert.alert('错误', '订单创建失败，请重试');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      Alert.alert('错误', '订单创建失败，请重试');
    }
  };

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
          确认订单
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView>
        <YStack padding="$4" gap="$4">
          {/* 商品信息卡片 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <XStack gap="$3" alignItems="center">
              <View
                width={60}
                height={60}
                backgroundColor={COLORS.primaryLight}
                borderRadius="$3"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={32}>{params.packageIcon || params.itemImage || '🍱'}</Text>
              </View>
              <YStack flex={1} gap="$1">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  {params.itemName}
                </Text>
                {isConsultation && params.serviceType && (
                  <Text fontSize="$2" color="$textSecondary">
                    {params.serviceType}
                  </Text>
                )}
                <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                  ¥{params.price}
                  <Text fontSize="$2" color="$textSecondary">
                    /{isMealPlan ? '天' : '次'}
                  </Text>
                </Text>
              </YStack>
            </XStack>
          </View>

          {/* 营养套餐专用：周期选择 */}
          {isMealPlan && (
            <View backgroundColor="$surface" borderRadius="$4" padding="$4">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                订购周期
              </Text>
              <XStack gap="$3">
                {CYCLE_OPTIONS.map(option => {
                  const isSelected = selectedCycle === option.days;
                  return (
                    <Pressable
                      key={option.days}
                      onPress={() => setSelectedCycle(option.days)}
                      style={{ flex: 1 }}
                    >
                      <View
                        flex={1}
                        height={72}
                        borderRadius="$3"
                        borderWidth={2}
                        borderColor={isSelected ? COLORS.primary : '$borderColor'}
                        backgroundColor={isSelected ? COLORS.primary : '$background'}
                        justifyContent="center"
                        alignItems="center"
                        gap="$1"
                      >
                        <Text
                          fontSize="$5"
                          fontWeight="700"
                          color={isSelected ? 'white' : '$text'}
                        >
                          {option.label}
                        </Text>
                        {option.discount < 1 && (
                          <Text fontSize="$2" color={isSelected ? 'white' : COLORS.primary}>
                            {((1 - option.discount) * 100).toFixed(0)}% OFF
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </XStack>
            </View>
          )}

          {/* 营养套餐专用：配送时间段 */}
          {isMealPlan && (
            <View backgroundColor="$surface" borderRadius="$4" padding="$4">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                配送时间段
              </Text>
              <YStack gap="$2">
                {TIME_SLOTS.map(slot => {
                  const isSelected = selectedTimeSlots.includes(slot.id);
                  return (
                    <Pressable key={slot.id} onPress={() => toggleTimeSlot(slot.id)}>
                      <XStack
                        height={48}
                        paddingHorizontal="$3"
                        borderRadius="$3"
                        borderWidth={2}
                        borderColor={isSelected ? COLORS.primary : '$borderColor'}
                        backgroundColor={isSelected ? COLORS.primary : '$background'}
                        alignItems="center"
                        gap="$2"
                      >
                        <Clock
                          size={20}
                          color={isSelected ? 'white' : COLORS.textSecondary}
                        />
                        <Text
                          flex={1}
                          fontSize="$3"
                          fontWeight={isSelected ? '600' : '400'}
                          color={isSelected ? 'white' : '$text'}
                        >
                          {slot.label}
                        </Text>
                        <Text
                          fontSize="$2"
                          color={isSelected ? 'white' : '$textSecondary'}
                        >
                          {slot.time}
                        </Text>
                      </XStack>
                    </Pressable>
                  );
                })}
              </YStack>
            </View>
          )}

          {/* 营养师预约专用：预约信息 */}
          {isConsultation && params.appointmentDate && (
            <View backgroundColor="$surface" borderRadius="$4" padding="$4">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                预约信息
              </Text>
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    预约日期
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {params.appointmentDate}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    预约时间
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {params.appointmentTime}
                  </Text>
                </XStack>
                {params.duration && (
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$textSecondary">
                      服务时长
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {params.duration}分钟
                    </Text>
                  </XStack>
                )}
                {params.providerName && (
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$textSecondary">
                      营养师
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {params.providerName}
                    </Text>
                  </XStack>
                )}
              </YStack>
            </View>
          )}

          {/* 收货地址 */}
          {isMealPlan && (
            <Pressable>
              <View backgroundColor="$surface" borderRadius="$4" padding="$4">
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                  <XStack gap="$2" alignItems="center">
                    <MapPin size={20} color={COLORS.primary} />
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      收货地址
                    </Text>
                  </XStack>
                  <XStack gap="$1" alignItems="center">
                    <Edit size={16} color={COLORS.primary} />
                    <Text fontSize="$2" color={COLORS.primary}>
                      修改
                    </Text>
                  </XStack>
                </XStack>
                <YStack gap="$2">
                  <XStack gap="$3">
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {defaultAddress.recipientName}
                    </Text>
                    <Text fontSize="$3" color="$textSecondary">
                      {defaultAddress.recipientPhone}
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$textSecondary" lineHeight={20}>
                    {defaultAddress.province} {defaultAddress.city} {defaultAddress.district}{' '}
                    {defaultAddress.detailAddress}
                  </Text>
                </YStack>
              </View>
            </Pressable>
          )}

          {/* 配送备注 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              {isMealPlan ? '配送备注' : '预约备注'}
            </Text>
            <View
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              backgroundColor="$background"
            >
              <TextInput
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                placeholder="请输入备注信息（选填）"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
                style={{
                  padding: 12,
                  fontSize: 14,
                  color: COLORS.text,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
              />
            </View>
          </View>

          {/* 价格明细 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              价格明细
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  {isMealPlan ? `${params.itemName} x ${selectedCycle}天` : params.itemName}
                </Text>
                <Text fontSize="$3" color="$text">
                  ¥{(params.price * (isMealPlan ? selectedCycle : 1)).toFixed(2)}
                </Text>
              </XStack>
              {discountAmount > 0 && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    周期优惠
                  </Text>
                  <Text fontSize="$3" color={COLORS.primary}>
                    -¥{discountAmount.toFixed(2)}
                  </Text>
                </XStack>
              )}
              {isMealPlan && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    配送费 {subtotal >= 200 && '（满200免运费）'}
                  </Text>
                  <Text fontSize="$3" color={deliveryFee === 0 ? COLORS.primary : '$text'}>
                    {deliveryFee === 0 ? '免费' : `¥${deliveryFee.toFixed(2)}`}
                  </Text>
                </XStack>
              )}
              <View height={1} backgroundColor="$borderColor" marginVertical="$2" />
              <XStack justifyContent="space-between">
                <Text fontSize="$4" fontWeight="700" color="$text">
                  总计
                </Text>
                <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                  ¥{totalAmount.toFixed(2)}
                </Text>
              </XStack>
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={80} />
        </YStack>
      </ScrollView>

      {/* 底部提交按钮 */}
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
        <XStack gap="$3" alignItems="center">
          <YStack flex={1}>
            <Text fontSize="$2" color="$textSecondary">
              合计
            </Text>
            <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
              ¥{totalAmount.toFixed(2)}
            </Text>
          </YStack>
          <Pressable onPress={handleSubmitOrder} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" fontWeight="600" color="white">
                提交订单
              </Text>
            </View>
          </Pressable>
        </XStack>
      </View>
    </View>
  );
};

export default CheckoutScreen;