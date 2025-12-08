import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
} from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { TitleBar } from '@/components/TitleBar';
import { OrderStatus } from '@/types/community';
import { getOrders } from '@/services/communityDataService';

interface MyOrdersScreenProps {
  navigation: any;
}

interface OrderItem {
  id: string;
  serviceTitle: string;
  serviceType: string;
  status: OrderStatus;
  price: number;
  serviceTime: string;
  address: string;
  district: string;
  // 作为雇主时显示达人信息
  expertId?: string;
  expertName?: string;
  expertAvatar?: string;
  // 作为达人时显示雇主信息
  employerId?: string;
  employerName?: string;
  employerAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

type RoleType = 'employer' | 'expert';
type FilterType = 'all' | 'pending' | 'in_progress' | 'completed';

/**
 * 我的订单页面
 * 支持角色切换（雇主/达人）和订单状态筛选
 */
export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({ navigation }) => {
  const [role, setRole] = useState<RoleType>('employer');
  const [filter, setFilter] = useState<FilterType>('all');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 当前用户ID（实际应从认证状态获取）
  const currentUserId = 'current-user-id';

  useEffect(() => {
    loadOrders();
  }, [role, filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // 根据角色和筛选条件获取订单
      const filters: any = {};

      if (role === 'employer') {
        filters.employerId = currentUserId;
      } else {
        filters.expertId = currentUserId;
      }

      // 根据筛选条件设置状态
      if (filter === 'pending') {
        // 待处理：待支付、待服务
        // 需要分别查询
      } else if (filter === 'in_progress') {
        filters.status = OrderStatus.IN_SERVICE;
      } else if (filter === 'completed') {
        filters.status = OrderStatus.COMPLETED;
      }

      const allOrders = await getOrders(filters);

      // 如果是 pending 筛选，需要额外过滤
      let filteredOrders = allOrders;
      if (filter === 'pending') {
        filteredOrders = allOrders.filter(order =>
          order.status === OrderStatus.PENDING_PAYMENT ||
          order.status === OrderStatus.PENDING_SERVICE ||
          order.status === OrderStatus.PENDING_CONFIRM
        );
      }

      // 转换为 OrderItem 格式
      const orderItems: OrderItem[] = filteredOrders.map(order => ({
        id: order.id,
        serviceTitle: order.serviceTitle,
        serviceType: order.serviceType,
        status: order.status,
        price: order.finalPrice,
        serviceTime: order.scheduledTime,
        address: order.location.address,
        district: order.location.address.split(' ')[0] || '',
        expertId: order.expertId,
        expertName: order.expertName,
        expertAvatar: order.expertAvatar,
        employerId: order.employerId,
        employerName: order.employerName,
        employerAvatar: order.employerAvatar,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }));

      setOrders(orderItems);
    } catch (error) {
      console.error('加载订单失败:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('ServiceOrderDetail', { orderId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return '待支付';
      case OrderStatus.PENDING_SERVICE:
        return '待服务';
      case OrderStatus.IN_SERVICE:
        return '服务中';
      case OrderStatus.PENDING_CONFIRM:
        return '待验收';
      case OrderStatus.COMPLETED:
        return '已完成';
      case OrderStatus.CANCELLED:
        return '已取消';
      case OrderStatus.REFUNDED:
        return '已退款';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return COLORS.warning;
      case OrderStatus.PENDING_SERVICE:
        return COLORS.primary;
      case OrderStatus.IN_SERVICE:
        return COLORS.success;
      case OrderStatus.PENDING_CONFIRM:
        return COLORS.warning;
      case OrderStatus.COMPLETED:
        return COLORS.textSecondary;
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    const color = getStatusColor(status);
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
      case OrderStatus.PENDING_SERVICE:
        return <Clock size={16} color={color} />;
      case OrderStatus.IN_SERVICE:
      case OrderStatus.PENDING_CONFIRM:
        return <Clock size={16} color={color} />;
      case OrderStatus.COMPLETED:
        return <CheckCircle size={16} color={color} />;
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return <XCircle size={16} color={color} />;
      default:
        return <Clock size={16} color={color} />;
    }
  };

  const renderOrderCard = ({ item }: { item: OrderItem }) => {
    const displayName = role === 'employer' ? item.expertName : item.employerName;
    const displayAvatar = role === 'employer' ? item.expertAvatar : item.employerAvatar;

    return (
      <TouchableOpacity
        onPress={() => handleOrderPress(item.id)}
        style={{ marginBottom: 12 }}
      >
        <Card
          padding="$4"
          borderRadius="$4"
          backgroundColor="$surface"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <YStack space="$3">
            {/* 标题和状态 */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="600" color="$text" flex={1}>
                {item.serviceTitle}
              </Text>
              <XStack space="$1" alignItems="center">
                {getStatusIcon(item.status)}
                <Text
                  fontSize="$3"
                  fontWeight="600"
                  color={getStatusColor(item.status)}
                >
                  {getStatusText(item.status)}
                </Text>
              </XStack>
            </XStack>

            {/* 对方信息 */}
            <XStack space="$2" alignItems="center">
              <View
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={`${COLORS.primary}20`}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={20}>{displayAvatar}</Text>
              </View>
              <YStack flex={1}>
                <Text fontSize="$3" color="$text">
                  {role === 'employer' ? '达人' : '雇主'}：{displayName}
                </Text>
              </YStack>
            </XStack>

            <View height={1} backgroundColor="$borderColor" />

            {/* 服务时间 */}
            <XStack space="$2" alignItems="center">
              <Calendar size={16} color={COLORS.textSecondary} />
              <Text fontSize="$3" color="$textSecondary">
                {item.serviceTime}
              </Text>
            </XStack>

            {/* 服务地址 */}
            <XStack space="$2" alignItems="center">
              <MapPin size={16} color={COLORS.textSecondary} />
              <Text fontSize="$3" color="$textSecondary" flex={1} numberOfLines={1}>
                {item.address}
              </Text>
            </XStack>

            {/* 价格 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$1" alignItems="center">
                <DollarSign size={16} color={COLORS.primary} />
                <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                  ¥{item.price}
                </Text>
              </XStack>

              <Text fontSize="$3" color={COLORS.primary}>
                查看详情 →
              </Text>
            </XStack>
          </YStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TitleBar title="我的订单" onBack={handleBack} />

      {/* 角色切换 */}
      <View
        backgroundColor="white"
        paddingVertical="$3"
        paddingHorizontal="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack space="$2">
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setRole('employer')}
          >
            <View
              backgroundColor={role === 'employer' ? `${COLORS.primary}20` : 'transparent'}
              borderWidth={1}
              borderColor={role === 'employer' ? COLORS.primary : '$borderColor'}
              borderRadius="$3"
              paddingVertical="$2"
              alignItems="center"
            >
              <Text
                fontSize="$4"
                fontWeight={role === 'employer' ? '600' : '400'}
                color={role === 'employer' ? COLORS.primary : '$text'}
              >
                作为雇主
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setRole('expert')}
          >
            <View
              backgroundColor={role === 'expert' ? `${COLORS.primary}20` : 'transparent'}
              borderWidth={1}
              borderColor={role === 'expert' ? COLORS.primary : '$borderColor'}
              borderRadius="$3"
              paddingVertical="$2"
              alignItems="center"
            >
              <Text
                fontSize="$4"
                fontWeight={role === 'expert' ? '600' : '400'}
                color={role === 'expert' ? COLORS.primary : '$text'}
              >
                作为达人
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>

      {/* 状态筛选 */}
      <View backgroundColor="white" paddingBottom="$3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <XStack space="$2">
            {[
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待处理' },
              { key: 'in_progress', label: '进行中' },
              { key: 'completed', label: '已完成' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key as FilterType)}
              >
                <View
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  borderRadius="$6"
                  backgroundColor={
                    filter === tab.key ? COLORS.primary : 'transparent'
                  }
                >
                  <Text
                    fontSize="$3"
                    fontWeight={filter === tab.key ? '600' : '400'}
                    color={filter === tab.key ? 'white' : '$text'}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </XStack>
        </ScrollView>
      </View>

      {/* 订单列表 */}
      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <YStack alignItems="center" paddingVertical="$8">
            <Text fontSize={64}>📋</Text>
            <Text fontSize="$5" color="$textSecondary" marginTop="$3">
              {loading ? '加载中...' : '暂无订单'}
            </Text>
            {!loading && (
              <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                {role === 'employer' ? '去社区发布需求吧' : '去达人工作台接单吧'}
              </Text>
            )}
          </YStack>
        }
      />
    </SafeAreaView>
  );
};
