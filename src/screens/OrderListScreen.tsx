/**
 * OrderListScreen - 订单列表页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState, useCallback } from 'react';
import { Pressable, RefreshControl, TextInput } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  Package,
  MessageSquare,
  ShoppingBag,
  Clock,
  MapPin,
  ChevronRight,
  Search,
  Heart,
  Scale,
  Users,
  Briefcase,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import {
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
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;

  const [selectedType, setSelectedType] = useState<ItemType | 'all' | 'community'>('all');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const allOrders = await getOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('加载订单失败:', error);
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

  // 社区类型订单（邻里帮、闲置物品）
  const COMMUNITY_TYPES = ['job', 'secondhand'];

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    // 类型筛选
    let typeMatch = false;
    if (selectedType === 'all') {
      typeMatch = true;
    } else if (selectedType === 'community') {
      typeMatch = COMMUNITY_TYPES.includes(order.itemType);
    } else {
      typeMatch = order.itemType === selectedType;
    }
    // 状态筛选
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    // 搜索筛选
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
        return <ShoppingBag size={20} color={primaryColor} />;
      case 'consultation':
        return <MessageSquare size={20} color={primaryColor} />;
      case 'elderly_service':
        return <Heart size={20} color={primaryColor} />;
      case 'product':
        return <Package size={20} color={primaryColor} />;
      case 'private_doctor':
        return <MessageSquare size={20} color={primaryColor} />;
      case 'legal_membership':
        return <Scale size={20} color={primaryColor} />;
      case 'job':
        return <Briefcase size={20} color={primaryColor} />;
      case 'secondhand':
        return <Package size={20} color={primaryColor} />;
      default:
        return <Package size={20} color={primaryColor} />;
    }
  };

  // 获取订单类型标签
  const getItemTypeLabel = (type: ItemType): string => {
    if (type === 'job') return '邻里帮';
    if (type === 'secondhand') return '闲置物品';
    return ORDER_ITEM_TYPE_LABELS[type] || type;
  };

  // 渲染订单卡片
  const renderOrderCard = (order: Order) => {
    const statusColor = ORDER_STATUS_COLORS[order.status] || color10;

    return (
      <Pressable
        key={order.id}
        onPress={() => navigation.navigate('OrderDetail' as never, { orderId: order.id } as never)}
      >
        <View
          padding="$2"
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$2"
        >
          {/* 订单头部 */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
            <XStack gap="$2" alignItems="center">
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                {getOrderIcon(order.itemType)}
              </View>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {getItemTypeLabel(order.itemType)}
              </Text>
            </XStack>
            <View
              backgroundColor={`${statusColor}20`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$10"
            >
              <Text fontSize="$2" color={statusColor} fontWeight="600">
                {ORDER_STATUS_LABELS[order.status]}
              </Text>
            </View>
          </XStack>

          <View height={1} backgroundColor="$color5" marginBottom="$2" />

          {/* 订单内容 */}
          <YStack gap="$1.5" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={1}>
              {order.itemName}
            </Text>
            {order.metadata?.appointmentDate && order.metadata?.appointmentTime && (
              <XStack gap="$1.5" alignItems="center">
                <Clock size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  预约: {order.metadata.appointmentDate} {order.metadata.appointmentTime}
                </Text>
              </XStack>
            )}
            {order.deliveryAddress && (
              <XStack gap="$1.5" alignItems="flex-start">
                <MapPin size={14} color={color10} style={{ marginTop: 2 }} />
                <Text fontSize="$2" color="$color10" flex={1} numberOfLines={1}>
                  {order.deliveryAddress.name} {order.deliveryAddress.phone}
                </Text>
              </XStack>
            )}
          </YStack>

          <View height={1} backgroundColor="$color5" marginBottom="$2" />

          {/* 订单底部 */}
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$0.5">
              <Text fontSize="$2" color="$color10">
                订单号: {order.id}
              </Text>
              <Text fontSize="$2" color="$color10">
                {order.createdAt}
              </Text>
            </YStack>
            <XStack gap="$2" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color="$primary">
                ¥{order.totalAmount.toFixed(2)}
              </Text>
              <ChevronRight size={18} color={color10} />
            </XStack>
          </XStack>
        </View>
      </Pressable>
    );
  };

  if (loading && !refreshing) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="我的订单" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="我的订单" subtitle={`共 ${orders.length} 个订单`} />
      </View>

      {/* 搜索栏 */}
      <View
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          backgroundColor="$color4"
          borderRadius="$4"
          paddingHorizontal="$2"
          paddingVertical="$2"
          alignItems="center"
          gap="$2"
        >
          <Search size={18} color={color10} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="搜索订单号或商品名称"
            placeholderTextColor={color10}
            style={{
              flex: 1,
              fontSize: 14,
              color: theme.color12?.val,
              padding: 0,
            }}
          />
        </XStack>
      </View>

      {/* 类型筛选 */}
      <View
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 8 }}
        >
          <XStack gap="$2">
            {ORDER_TYPE_CONFIGS.map(type => {
              const isActive = selectedType === type.id;
              return (
                <Pressable key={type.id} onPress={() => setSelectedType(type.id as any)}>
                  <View
                    backgroundColor={isActive ? primaryColor : '$color4'}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor={isActive ? primaryColor : '$color5'}
                  >
                    <Text
                      fontSize="$3"
                      color={isActive ? 'white' : '$color12'}
                      fontWeight={isActive ? '600' : '400'}
                    >
                      {type.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>
      </View>

      {/* 状态筛选 */}
      <View
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 8 }}
        >
          <XStack gap="$1.5">
            {ORDER_STATUS_CONFIGS.map(status => {
              const isActive = selectedStatus === status.id;
              return (
                <Pressable key={status.id} onPress={() => setSelectedStatus(status.id as any)}>
                  <View
                    backgroundColor={isActive ? `${primaryColor}15` : 'transparent'}
                    paddingHorizontal="$2.5"
                    paddingVertical="$1.5"
                    borderRadius="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={isActive ? '$primary' : '$color10'}
                      fontWeight={isActive ? '600' : '400'}
                    >
                      {status.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>
      </View>

      {/* 订单列表 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <YStack padding="$2.5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => renderOrderCard(order))
          ) : (
            <View paddingVertical="$8" alignItems="center">
              <Package size={48} color={color10} />
              <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
                暂无订单
              </Text>
              <Text fontSize="$3" color="$color10" marginTop="$1">
                {selectedType !== 'all' || selectedStatus !== 'all'
                  ? '尝试调整筛选条件'
                  : '快去选购您需要的服务吧'}
              </Text>
            </View>
          )}
        </YStack>
        <View height={insets.bottom + 20} />
      </ScrollView>
    </View>
  );
};

export default OrderListScreen;
