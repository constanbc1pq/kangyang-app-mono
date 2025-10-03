import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { View, Text, XStack, YStack, Card } from 'tamagui';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, MapPin, Edit, Package } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Image } from 'react-native';
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
          {/* 收货地址 */}
          {address ? (
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
                      {address.receiverName}
                    </Text>
                    <Text fontSize="$3" color="$textSecondary">
                      {address.receiverPhone}
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$textSecondary" lineHeight={20}>
                    {address.province} {address.city} {address.district} {address.address}
                  </Text>
                </YStack>
              </View>
            </Pressable>
          ) : (
            <Pressable>
              <View backgroundColor="$surface" borderRadius="$4" padding="$4" alignItems="center">
                <Text fontSize="$3" color="$textSecondary">
                  暂无收货地址，请添加
                </Text>
              </View>
            </Pressable>
          )}

          {/* 商品清单 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <XStack gap="$2" alignItems="center" marginBottom="$3">
              <Package size={20} color={COLORS.primary} />
              <Text fontSize="$4" fontWeight="600" color="$text">
                商品清单
              </Text>
              <Text fontSize="$3" color="$textSecondary">
                （共{items.reduce((sum, item) => sum + item.quantity, 0)}件）
              </Text>
            </XStack>
            <YStack gap="$3">
              {items.map((item) => (
                <Card key={item.id} padding="$3" backgroundColor="$background" borderRadius="$3">
                  <XStack gap="$3">
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 60, height: 60, borderRadius: 8 }}
                    />
                    <YStack flex={1} justifyContent="space-between">
                      <Text fontSize="$3" fontWeight="600" numberOfLines={2} color="$text">
                        {item.name}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        {item.unit}
                      </Text>
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                          ¥{item.price}
                        </Text>
                        <Text fontSize="$3" color="$textSecondary">
                          x {item.quantity}
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
          </View>

          {/* 配送备注 */}
          <View backgroundColor="$surface" borderRadius="$4" padding="$4">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              配送备注
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
                  商品小计
                </Text>
                <Text fontSize="$3" color="$text">
                  ¥{subtotal.toFixed(2)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  配送费 {subtotal >= 50 && '（满50免配送）'}
                </Text>
                <Text fontSize="$3" color={deliveryFee === 0 ? COLORS.primary : '$text'}>
                  {deliveryFee === 0 ? '免费' : `¥${deliveryFee.toFixed(2)}`}
                </Text>
              </XStack>
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

export default GroceryCheckoutScreen;
