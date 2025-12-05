/**
 * CheckoutScreen 订单确认页
 * 支持多种商品类型：营养套餐、咨询预约、养老服务、法律会员
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { View, Text, XStack, YStack, useTheme, Image } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Edit, Star } from 'lucide-react-native';
import { createOrder } from '@/services/orderService';
import { CartItem, DeliveryAddress } from '@/types/commerce';
import { getCaregiverById, getPackageById } from '@/services/elderlyService';
import type { Caregiver, ServicePackage } from '@/types/elderly';

interface RouteParams {
  itemType: 'meal_plan' | 'consultation' | 'elderly_service' | 'legal_membership';
  itemId: string;
  itemName: string;
  itemImage?: string;
  price: number;
  providerId?: string;
  providerName?: string;
  packageIcon?: string;
  packageImage?: string;
  serviceType?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  duration?: number;
  caregiverId?: string;
  packageId?: string;
  elderlyServiceType?: 'elderly-care' | 'escort' | 'medical-staff';
  serviceDate?: string;
  serviceTime?: string;
  metadata?: Record<string, any>;
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

const getMatchingQualification = (qualification: string): string => {
  if (qualification === 'EN') return 'RN';
  return qualification;
};

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const color12 = theme.color12?.val;
  const color10 = theme.color10?.val;

  const GOLD_COLOR = '#D4AF37';

  const [selectedCycle, setSelectedCycle] = useState(7);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['breakfast', 'lunch', 'dinner']);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [caregiverData, setCaregiverData] = useState<Caregiver | null>(null);
  const [packageData, setPackageData] = useState<ServicePackage | null>(null);
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');

  const defaultAddress: DeliveryAddress = {
    id: 'addr_1',
    recipientName: '张先生',
    recipientPhone: '138****8888',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detailAddress: '科技园软件产业基地 T3座 2008室',
    isDefault: true,
  };

  useEffect(() => {
    if (params.itemType === 'elderly_service' && params.caregiverId && params.packageId) {
      const caregiver = getCaregiverById(params.caregiverId);
      const pkg = getPackageById(params.packageId);
      setCaregiverData(caregiver);
      setPackageData(pkg);

      if (params.serviceDate) {
        setServiceDate(params.serviceDate);
      }
      if (params.serviceTime) {
        const timeOnly = params.serviceTime.includes('|')
          ? params.serviceTime.split('|')[0]
          : params.serviceTime;
        setServiceTime(timeOnly);
      }
    }
  }, [params.caregiverId, params.packageId, params.itemType, params.serviceDate, params.serviceTime]);

  const isMealPlan = params.itemType === 'meal_plan';
  const isConsultation = params.itemType === 'consultation';
  const isElderlyService = params.itemType === 'elderly_service';
  const isLegalMembership = params.itemType === 'legal_membership';

  const getElderlyServicePrice = (): number => {
    if (!packageData || !caregiverData) return params.price;
    const matchingQualification = getMatchingQualification(caregiverData.qualificationBadge);
    const priceInfo = packageData.prices.find(p => p.type === matchingQualification);
    return priceInfo?.price || params.price;
  };

  const cycleOption = CYCLE_OPTIONS.find(opt => opt.days === selectedCycle) || CYCLE_OPTIONS[0];

  const subtotal = isConsultation || isLegalMembership
    ? params.price
    : isElderlyService && packageData
    ? getElderlyServicePrice()
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
      if (isElderlyService && (!serviceDate || !serviceTime)) {
        Alert.alert('提示', '请选择服务日期和时间');
        return;
      }

      const cartItem: CartItem = {
        id: `cart_${Date.now()}`,
        itemType: params.itemType,
        itemId: isElderlyService ? params.packageId! : params.itemId,
        itemName: params.itemName,
        itemImage: params.itemImage || params.packageImage || params.packageIcon,
        price: isElderlyService && packageData ? getElderlyServicePrice() : params.price,
        quantity: 1,
        unit: isElderlyService && packageData ? packageData.prices[0].unit : (isMealPlan ? '天' : (isLegalMembership ? '年' : '次')),
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
        serviceDate: isElderlyService ? serviceDate : (isConsultation ? params.appointmentDate : undefined),
        serviceTime: isElderlyService ? serviceTime : (isConsultation ? params.appointmentTime : undefined),
        providerId: isElderlyService ? params.caregiverId : params.providerId,
        providerName: isElderlyService && caregiverData ? caregiverData.name : params.providerName,
        metadata: isLegalMembership ? params.metadata : (isElderlyService ? {
          caregiverId: params.caregiverId,
          caregiverName: caregiverData?.name,
          qualification: caregiverData?.qualificationBadge,
          packageId: params.packageId,
          packageName: packageData?.name,
          elderlyServiceType: params.elderlyServiceType,
        } : (isConsultation ? {
          serviceType: params.serviceType,
          duration: params.duration,
        } : undefined)),
        addedAt: new Date().toISOString(),
      };

      const order = await createOrder({
        userId: 'user_test01',
        cartItems: [cartItem],
        deliveryAddress: defaultAddress,
        deliveryNotes,
        deliveryFee,
      });

      if (order) {
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
            确认订单
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* 商品信息卡片 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <XStack gap="$2" alignItems="center">
              <View
                width={60}
                height={60}
                backgroundColor="$color4"
                borderRadius="$4"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
              >
                {params.packageImage?.startsWith('http') ? (
                  <Image
                    source={{ uri: params.packageImage }}
                    width={60}
                    height={60}
                    resizeMode="cover"
                  />
                ) : (
                  <Text fontSize={32}>{params.packageIcon || params.itemImage || '🍱'}</Text>
                )}
              </View>
              <YStack flex={1} gap="$0.5">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {params.itemName}
                </Text>
                {isConsultation && params.serviceType && (
                  <Text fontSize="$2" color="$color10">
                    {params.serviceType}
                  </Text>
                )}
                <Text fontSize="$5" fontWeight="700" color="$primary">
                  ¥{params.price}
                  <Text fontSize="$2" color="$color10">
                    /{isMealPlan ? '天' : (isLegalMembership ? '年' : '次')}
                  </Text>
                </Text>
              </YStack>
            </XStack>
          </View>

          {/* 养老服务专用：护理人员和套餐信息 */}
          {isElderlyService && caregiverData && packageData && (
            <>
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  护理人员
                </Text>
                <XStack gap="$2" alignItems="center">
                  <Image source={{ uri: caregiverData.avatar }} width={60} height={60} borderRadius={30} />
                  <YStack flex={1} gap="$0.5">
                    <XStack alignItems="center" gap="$2">
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        {caregiverData.name}
                      </Text>
                      <View backgroundColor="$primary" paddingHorizontal="$2" paddingVertical="$0.5" borderRadius="$10">
                        <Text fontSize="$1" color="white" fontWeight="600">
                          {caregiverData.qualificationBadge}
                        </Text>
                      </View>
                    </XStack>
                    <XStack alignItems="center" gap="$2">
                      <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                      <Text fontSize="$2" fontWeight="600" color="$color12">
                        {caregiverData.rating}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        ({caregiverData.reviews}评价)
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>
              </View>

              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  服务套餐
                </Text>
                <YStack gap="$1">
                  <Text fontSize="$5" fontWeight="700" color="$color12">
                    {packageData.name}
                  </Text>
                  <XStack alignItems="baseline" gap="$1">
                    <Text fontSize="$6" fontWeight="700" color="$primary">
                      ¥{getElderlyServicePrice()}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      {packageData.prices.find(p => p.type === getMatchingQualification(caregiverData?.qualificationBadge || ''))?.unit || packageData.prices[0].unit}
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$color10">
                    {packageData.description}
                  </Text>
                </YStack>
              </View>

              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  预约服务时间
                </Text>
                <YStack gap="$2">
                  <View>
                    <Text fontSize="$3" color="$color10" marginBottom="$1">
                      服务日期
                    </Text>
                    <View
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color2"
                    >
                      <TextInput
                        value={serviceDate}
                        onChangeText={setServiceDate}
                        placeholder="请选择服务日期（如：2024-01-15）"
                        placeholderTextColor={color10}
                        style={{
                          padding: 12,
                          fontSize: 14,
                          color: color12,
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text fontSize="$3" color="$color10" marginBottom="$1">
                      服务时间
                    </Text>
                    <View
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color2"
                    >
                      <TextInput
                        value={serviceTime}
                        onChangeText={setServiceTime}
                        placeholder="请选择服务时间（如：09:00-17:00）"
                        placeholderTextColor={color10}
                        style={{
                          padding: 12,
                          fontSize: 14,
                          color: color12,
                        }}
                      />
                    </View>
                  </View>
                </YStack>
              </View>
            </>
          )}

          {/* 营养套餐专用：周期选择 */}
          {isMealPlan && (
            <View
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              padding="$2"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                订购周期
              </Text>
              <XStack gap="$2">
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
                        borderRadius="$4"
                        borderWidth={2}
                        borderColor={isSelected ? '$primary' : '$color5'}
                        backgroundColor={isSelected ? '$primary' : '$color2'}
                        justifyContent="center"
                        alignItems="center"
                        gap="$0.5"
                      >
                        <Text
                          fontSize="$5"
                          fontWeight="700"
                          color={isSelected ? 'white' : '$color12'}
                        >
                          {option.label}
                        </Text>
                        {option.discount < 1 && (
                          <Text fontSize="$2" color={isSelected ? 'white' : '$primary'}>
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
            <View
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              padding="$2"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                配送时间段
              </Text>
              <YStack gap="$1.5">
                {TIME_SLOTS.map(slot => {
                  const isSelected = selectedTimeSlots.includes(slot.id);
                  return (
                    <Pressable key={slot.id} onPress={() => toggleTimeSlot(slot.id)}>
                      <XStack
                        height={48}
                        paddingHorizontal="$2"
                        borderRadius="$4"
                        borderWidth={2}
                        borderColor={isSelected ? '$primary' : '$color5'}
                        backgroundColor={isSelected ? '$primary' : '$color2'}
                        alignItems="center"
                        gap="$2"
                      >
                        <Clock
                          size={20}
                          color={isSelected ? 'white' : color10}
                        />
                        <Text
                          flex={1}
                          fontSize="$3"
                          fontWeight={isSelected ? '600' : '400'}
                          color={isSelected ? 'white' : '$color12'}
                        >
                          {slot.label}
                        </Text>
                        <Text
                          fontSize="$2"
                          color={isSelected ? 'white' : '$color10'}
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
            <View
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              padding="$2"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                预约信息
              </Text>
              <YStack gap="$1.5">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">预约日期</Text>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {params.appointmentDate}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">预约时间</Text>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {params.appointmentTime}
                  </Text>
                </XStack>
                {params.duration && (
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$color10">服务时长</Text>
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {params.duration}分钟
                    </Text>
                  </XStack>
                )}
                {params.providerName && (
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$color10">营养师</Text>
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {params.providerName}
                    </Text>
                  </XStack>
                )}
              </YStack>
            </View>
          )}

          {/* 收货地址 */}
          {isMealPlan && !isElderlyService && (
            <Pressable>
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <XStack gap="$1.5" alignItems="center">
                    <MapPin size={18} color={primaryColor} />
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      收货地址
                    </Text>
                  </XStack>
                  <XStack gap="$0.5" alignItems="center">
                    <Edit size={14} color={primaryColor} />
                    <Text fontSize="$2" color="$primary">修改</Text>
                  </XStack>
                </XStack>
                <YStack gap="$1">
                  <XStack gap="$2">
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {defaultAddress.recipientName}
                    </Text>
                    <Text fontSize="$3" color="$color10">
                      {defaultAddress.recipientPhone}
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$color10" lineHeight={20}>
                    {defaultAddress.province} {defaultAddress.city} {defaultAddress.district}{' '}
                    {defaultAddress.detailAddress}
                  </Text>
                </YStack>
              </View>
            </Pressable>
          )}

          {/* 配送备注 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              {isElderlyService ? '服务备注' : (isMealPlan ? '配送备注' : '预约备注')}
            </Text>
            <View
              borderWidth={1}
              borderColor="$color5"
              borderRadius="$4"
              backgroundColor="$color2"
            >
              <TextInput
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                placeholder="请输入备注信息（选填）"
                placeholderTextColor={color10}
                multiline
                numberOfLines={3}
                style={{
                  padding: 12,
                  fontSize: 14,
                  color: color12,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
              />
            </View>
          </View>

          {/* 价格明细 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              价格明细
            </Text>
            <YStack gap="$1.5">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  {isElderlyService && packageData
                    ? packageData.name
                    : (isMealPlan ? `${params.itemName} x ${selectedCycle}天` : params.itemName)}
                </Text>
                <Text fontSize="$3" color="$color12">
                  ¥{isElderlyService && packageData
                    ? getElderlyServicePrice().toFixed(2)
                    : (params.price * (isMealPlan ? selectedCycle : 1)).toFixed(2)}
                </Text>
              </XStack>
              {discountAmount > 0 && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">周期优惠</Text>
                  <Text fontSize="$3" color="$primary">
                    -¥{discountAmount.toFixed(2)}
                  </Text>
                </XStack>
              )}
              {isMealPlan && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$color10">
                    配送费 {subtotal >= 200 && '（满200免运费）'}
                  </Text>
                  <Text fontSize="$3" color={deliveryFee === 0 ? '$primary' : '$color12'}>
                    {deliveryFee === 0 ? '免费' : `¥${deliveryFee.toFixed(2)}`}
                  </Text>
                </XStack>
              )}
              <View height={1} backgroundColor="$color5" marginVertical="$1" />
              <XStack justifyContent="space-between">
                <Text fontSize="$4" fontWeight="700" color="$color12">总计</Text>
                <Text fontSize="$6" fontWeight="700" color="$primary">
                  ¥{totalAmount.toFixed(2)}
                </Text>
              </XStack>
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={100} />
        </YStack>
      </ScrollView>

      {/* 底部提交按钮 */}
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
        <XStack gap="$2" alignItems="center">
          <YStack flex={1}>
            <Text fontSize="$2" color="$color10">合计</Text>
            <Text fontSize="$6" fontWeight="700" color="$primary">
              ¥{totalAmount.toFixed(2)}
            </Text>
          </YStack>
          <Pressable onPress={handleSubmitOrder} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              backgroundColor="$primary"
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
