import React, { useState, useCallback } from 'react';
import { ScrollView, Pressable, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { View, Text, XStack, YStack, H3, Card, Separator } from 'tamagui';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  Package,
  MessageSquare,
  Truck,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Search,
} from 'lucide-react-native';
import {
  COLORS,
  ORDER_TYPE_CONFIGS,
  ORDER_STATUS_CONFIGS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_ITEM_TYPE_LABELS,
} from '@/constants/app';
import { getOrders, Order } from '@/services/orderService';
import { ItemType, OrderStatus } from '@/types/commerce';

const OrderListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<ItemType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const allOrders = await getOrders();
      console.log('✅ OrderListScreen: 从localStorage加载订单:', allOrders.length, '条');
      setOrders(allOrders);
    } catch (error) {
      console.error('❌ OrderListScreen: 加载订单失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  // 过滤订单（修复：使用order.itemType字段）
  const filteredOrders = orders.filter(order => {
    // 类型筛选
    const typeMatch = selectedType === 'all' || order.itemType === selectedType;
    // 状态筛选
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    // 搜索筛选（订单号、商品名称）
    const searchMatch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchQuery.toLowerCase());

    return typeMatch && statusMatch && searchMatch;
  });

  // 获取订单图标
  const getOrderIcon = (type: ItemType) => {
    switch (type) {
      case 'meal_plan':
        return <ShoppingBag size={20} color={COLORS.primary} />;
      case 'consultation':
        return <MessageSquare size={20} color={COLORS.primary} />;
      case 'product':
        return <Package size={20} color={COLORS.primary} />;
      case 'service':
        return <Calendar size={20} color={COLORS.primary} />;
      case 'course':
        return <Package size={20} color={COLORS.primary} />;
      default:
        return <Package size={20} color={COLORS.primary} />;
    }
  };

  // 获取订单类型标签（使用全局常量）
  const getItemTypeLabel = (type: ItemType): string => {
    return ORDER_ITEM_TYPE_LABELS[type] || type;
  };

  // 渲染订单卡片
  const renderOrderCard = (order: Order) => {
    return (
      <Card
        key={order.id}
        bordered
        padding="$4"
        marginBottom="$3"
        pressStyle={{ scale: 0.98 }}
        onPress={() => {
          navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
        }}
      >
        <YStack gap="$3">
          {/* 订单头部 */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$2" alignItems="center">
              {getOrderIcon(order.itemType)}
              <Text fontSize="$3" fontWeight="600" color="$text">
                {getItemTypeLabel(order.itemType)}
              </Text>
            </XStack>
            <View
              backgroundColor={`${ORDER_STATUS_COLORS[order.status]}20`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" color={ORDER_STATUS_COLORS[order.status]} fontWeight="600">
                {ORDER_STATUS_LABELS[order.status]}
              </Text>
            </View>
          </XStack>

          <Separator />

          {/* 订单内容 */}
          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$text">
              {order.itemName}
            </Text>
            {order.metadata?.appointmentDate && order.metadata?.appointmentTime && (
              <XStack gap="$2" alignItems="center">
                <Clock size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  预约时间: {order.metadata.appointmentDate} {order.metadata.appointmentTime}
                </Text>
              </XStack>
            )}
            {order.deliveryAddress && (
              <XStack gap="$2" alignItems="flex-start">
                <MapPin size={14} color={COLORS.textSecondary} style={{ marginTop: 2 }} />
                <Text fontSize="$2" color="$textSecondary" flex={1}>
                  {order.deliveryAddress.name} {order.deliveryAddress.phone}
                </Text>
              </XStack>
            )}
          </YStack>

          <Separator />

          {/* 订单底部 */}
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$1">
              <Text fontSize="$2" color="$textSecondary">
                订单号: {order.id}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                下单时间: {order.createdAt}
              </Text>
            </YStack>
            <XStack gap="$2" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                ¥{order.totalAmount.toFixed(2)}
              </Text>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </XStack>
          </XStack>
        </YStack>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text marginTop="$3" color="$textSecondary">
          加载订单中...
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
          我的订单
        </Text>
        <View width={24} />
      </XStack>

      {/* 搜索栏 */}
      <View
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack
          backgroundColor="$background"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          paddingHorizontal="$3"
          paddingVertical="$2"
          alignItems="center"
          gap="$2"
        >
          <Search size={18} color={COLORS.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="搜索订单号或商品名称"
            placeholderTextColor={COLORS.textSecondary}
            style={{
              flex: 1,
              fontSize: 14,
              color: COLORS.text,
              padding: 0,
            }}
          />
        </XStack>
      </View>

      {/* 类型筛选 */}
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$2"
        flexWrap="wrap"
      >
        {ORDER_TYPE_CONFIGS.map(type => (
          <Pressable key={type.id} onPress={() => setSelectedType(type.id as any)}>
            <View
              backgroundColor={selectedType === type.id ? COLORS.primary : '$surface'}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$3"
              borderWidth={1}
              borderColor={selectedType === type.id ? COLORS.primary : '$borderColor'}
            >
              <Text
                fontSize="$3"
                color={selectedType === type.id ? 'white' : '$text'}
                fontWeight={selectedType === type.id ? '600' : '400'}
              >
                {type.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </XStack>

      {/* 状态筛选 */}
      <View
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          {ORDER_STATUS_CONFIGS.map(status => (
            <Pressable key={status.id} onPress={() => setSelectedStatus(status.id as any)}>
              <View
                backgroundColor={selectedStatus === status.id ? COLORS.primary : 'transparent'}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$2"
                minHeight={36}
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize="$3"
                  color={selectedStatus === status.id ? 'white' : '$textSecondary'}
                  fontWeight={selectedStatus === status.id ? '600' : '400'}
                >
                  {status.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 订单列表 */}
      <ScrollView
        flex={1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <YStack padding="$4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => renderOrderCard(order))
          ) : (
            <View paddingVertical="$10" alignItems="center">
              <Package size={64} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$textSecondary" marginTop="$4">
                暂无订单
              </Text>
              <Text fontSize="$2" color="$textSecondary" marginTop="$2">
                快去选购您需要的服务吧
              </Text>
            </View>
          )}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default OrderListScreen;
