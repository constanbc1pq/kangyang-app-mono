/**
 * GroceryCheckoutScreen 生鲜结算页面
 * 确认收货地址、商品清单、备注、价格明细
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState } from 'react';
import { ScrollView, Pressable, Alert, TextInput, Image } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Edit, Package } from 'lucide-react-native';
import { getDefaultAddress } from '@/services/addressService';
import { createOrder } from '@/services/orderService';
import { groceryCartService } from '@/services/groceryCartService';
import { Address } from '@/types/commerce';

interface GroceryCartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
}

interface RouteParams {
  items: GroceryCartItem[];
  totalAmount: number;
  deliveryArea: string;
}

const GroceryCheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [address, setAddress] = useState<Address | null>(null);

  // 加载默认地址
  const loadAddress = async () => {
    const defaultAddress = await getDefaultAddress();
    if (defaultAddress) {
      setAddress(defaultAddress);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAddress();
    }, [])
  );

  // 计算价格
  const items = params.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 50 ? 0 : 8; // 满50免配送费
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async () => {
    try {
      if (!address) {
        Alert.alert('提示', '请先设置收货地址');
        return;
      }

      if (items.length === 0) {
        Alert.alert('提示', '购物车为空');
        return;
      }

      // 构造订单商品数据
      const cartItems = items.map((item) => ({
        id: `cart_item_${Date.now()}_${item.id}`,
        itemType: 'product' as const,
        itemId: item.id.toString(),
        itemName: item.name,
        itemImage: item.image,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        addedAt: new Date().toISOString(),
      }));

      // 构造收货地址数据
      const deliveryAddress = {
        id: address.id,
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        province: address.province,
        city: address.city,
        district: address.district,
        address: address.address,
        isDefault: address.isDefault,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      };

      // 创建订单
      const order = await createOrder({
        userId: 'user_default_001',
        cartItems: cartItems,
        deliveryAddress: deliveryAddress,
        deliveryNotes: deliveryNotes,
        deliveryFee: deliveryFee,
      });

      if (order) {
        // 清空购物车
        await groceryCartService.clearCart();

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
      {/* TitleBar - 按照CLAUDE.md规范 */}
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

      <ScrollView>
        <YStack padding="$2.5" gap="$3">
          {/* 收货地址 */}
          {address ? (
            <Pressable>
              <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <XStack gap="$2" alignItems="center">
                    <MapPin size={18} color={primaryColor} />
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      收货地址
                    </Text>
                  </XStack>
                  <XStack gap="$0.5" alignItems="center">
                    <Edit size={14} color={primaryColor} />
                    <Text fontSize="$2" color="$primary" fontWeight="500">
                      修改
                    </Text>
                  </XStack>
                </XStack>
                <YStack gap="$1">
                  <XStack gap="$2">
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {address.receiverName}
                    </Text>
                    <Text fontSize="$3" color="$color10">
                      {address.receiverPhone}
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$color10" lineHeight={18}>
                    {address.province} {address.city} {address.district} {address.address}
                  </Text>
                </YStack>
              </View>
            </Pressable>
          ) : (
            <Pressable>
              <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2" alignItems="center">
                <Text fontSize="$3" color="$color10">
                  暂无收货地址，请添加
                </Text>
              </View>
            </Pressable>
          )}

          {/* 商品清单 */}
          <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
            <XStack gap="$2" alignItems="center" marginBottom="$2">
              <Package size={18} color={primaryColor} />
              <Text fontSize="$4" fontWeight="600" color="$color12">
                商品清单
              </Text>
              <Text fontSize="$2" color="$color10">
                （共{items.reduce((sum, item) => sum + item.quantity, 0)}件）
              </Text>
            </XStack>
            <YStack gap="$2">
              {items.map((item) => (
                <View key={item.id} padding="$2" backgroundColor="$color4" borderRadius="$4">
                  <XStack gap="$2">
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 56, height: 56, borderRadius: 8 }}
                    />
                    <YStack flex={1} justifyContent="space-between">
                      <Text fontSize="$3" fontWeight="600" numberOfLines={2} color="$color12">
                        {item.name}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        {item.unit}
                      </Text>
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$4" fontWeight="700" color="$primary">
                          ¥{item.price}
                        </Text>
                        <Text fontSize="$2" color="$color10">
                          x {item.quantity}
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>
                </View>
              ))}
            </YStack>
          </View>

          {/* 配送备注 */}
          <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              配送备注
            </Text>
            <View
              borderWidth={1}
              borderColor="$color5"
              borderRadius="$3"
              backgroundColor="$color4"
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
                  minHeight: 72,
                  textAlignVertical: 'top',
                }}
              />
            </View>
          </View>

          {/* 价格明细 */}
          <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              价格明细
            </Text>
            <YStack gap="$1.5">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  商品小计
                </Text>
                <Text fontSize="$3" color="$color12">
                  ¥{subtotal.toFixed(2)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  配送费 {subtotal >= 50 && '（满50免配送）'}
                </Text>
                <Text fontSize="$3" color={deliveryFee === 0 ? '$primary' : '$color12'}>
                  {deliveryFee === 0 ? '免费' : `¥${deliveryFee.toFixed(2)}`}
                </Text>
              </XStack>
              <View height={1} backgroundColor="$color5" marginVertical="$1" />
              <XStack justifyContent="space-between">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  总计
                </Text>
                <Text fontSize="$5" fontWeight="700" color="$primary">
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
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        paddingBottom={insets.bottom + 8}
      >
        <XStack gap="$3" alignItems="center">
          <YStack flex={1}>
            <Text fontSize="$2" color="$color10">
              合计
            </Text>
            <Text fontSize="$5" fontWeight="700" color="$primary">
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

export default GroceryCheckoutScreen;
