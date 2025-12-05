/**
 * ExpertOrdersScreen 达人服务订单列表页
 * 展示达人接到的服务订单，支持状态筛选
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  useTheme,
} from 'tamagui';
import {
  RefreshControl,
  Pressable,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  MapPin,
  DollarSign,
  MessageCircle,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

interface ExpertOrdersScreenProps {
  navigation: any;
}

// 订单状态枚举
enum OrderStatus {
  PENDING = 'pending',       // 待确认
  ACCEPTED = 'accepted',     // 已接单
  IN_PROGRESS = 'in_progress', // 服务中
  COMPLETED = 'completed',   // 已完成
  CANCELLED = 'cancelled',   // 已取消
  DISPUTED = 'disputed',     // 有争议
}

// 订单类型
interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  price: number;
  serviceFee: number;
  income: number;
  serviceDate: string;
  serviceTime: string;
  location: {
    city: string;
    district: string;
    address: string;
  };
  employer: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
  };
  createdAt: string;
  completedAt?: string;
  hasUnreadMessage: boolean;
}

/**
 * 达人服务订单列表页
 */
export const ExpertOrdersScreen: React.FC<ExpertOrdersScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 模拟订单数据
  const mockOrders: ServiceOrder[] = [
    {
      id: 'order_001',
      title: '家庭保洁服务',
      description: '3室2厅深度清洁，包含厨房油烟机清洗',
      status: OrderStatus.IN_PROGRESS,
      price: 280,
      serviceFee: 28,
      income: 252,
      serviceDate: '2024-12-06',
      serviceTime: '09:00-12:00',
      location: {
        city: '上海',
        district: '浦东新区',
        address: '世纪大道100号',
      },
      employer: {
        id: 'user_001',
        name: '张女士',
        avatar: '👩',
        phone: '138****1234',
      },
      createdAt: '2024-12-05T10:30:00Z',
      hasUnreadMessage: true,
    },
    {
      id: 'order_002',
      title: '老人陪诊服务',
      description: '陪同老人去医院做体检，需要全程陪护',
      status: OrderStatus.PENDING,
      price: 200,
      serviceFee: 20,
      income: 180,
      serviceDate: '2024-12-07',
      serviceTime: '08:00-11:00',
      location: {
        city: '上海',
        district: '黄浦区',
        address: '仁济医院东院',
      },
      employer: {
        id: 'user_002',
        name: '李先生',
        avatar: '👨',
        phone: '139****5678',
      },
      createdAt: '2024-12-05T14:20:00Z',
      hasUnreadMessage: false,
    },
    {
      id: 'order_003',
      title: '空调清洗维修',
      description: '3台挂机空调清洗，1台检查制冷问题',
      status: OrderStatus.ACCEPTED,
      price: 350,
      serviceFee: 35,
      income: 315,
      serviceDate: '2024-12-08',
      serviceTime: '14:00-17:00',
      location: {
        city: '上海',
        district: '徐汇区',
        address: '漕溪北路88号',
      },
      employer: {
        id: 'user_003',
        name: '王先生',
        avatar: '👨‍💼',
        phone: '136****9012',
      },
      createdAt: '2024-12-04T09:15:00Z',
      hasUnreadMessage: true,
    },
    {
      id: 'order_004',
      title: '家政保洁服务',
      description: '日常保洁，2室1厅',
      status: OrderStatus.COMPLETED,
      price: 150,
      serviceFee: 15,
      income: 135,
      serviceDate: '2024-12-03',
      serviceTime: '10:00-12:00',
      location: {
        city: '上海',
        district: '静安区',
        address: '南京西路1000号',
      },
      employer: {
        id: 'user_004',
        name: '陈女士',
        avatar: '👩‍🦰',
        phone: '137****3456',
      },
      createdAt: '2024-12-01T16:40:00Z',
      completedAt: '2024-12-03T12:30:00Z',
      hasUnreadMessage: false,
    },
    {
      id: 'order_005',
      title: '搬家服务',
      description: '小型搬家，3楼无电梯',
      status: OrderStatus.CANCELLED,
      price: 400,
      serviceFee: 40,
      income: 0,
      serviceDate: '2024-12-02',
      serviceTime: '09:00-13:00',
      location: {
        city: '上海',
        district: '普陀区',
        address: '中山北路2000号',
      },
      employer: {
        id: 'user_005',
        name: '赵先生',
        avatar: '👨‍🔧',
        phone: '135****7890',
      },
      createdAt: '2024-11-30T11:00:00Z',
      hasUnreadMessage: false,
    },
  ];

  // 状态标签配置
  const statusTabs = [
    { key: 'all', label: '全部' },
    { key: OrderStatus.PENDING, label: '待确认' },
    { key: OrderStatus.ACCEPTED, label: '已接单' },
    { key: OrderStatus.IN_PROGRESS, label: '服务中' },
    { key: OrderStatus.COMPLETED, label: '已完成' },
  ];

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // 模拟加载数据
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredOrders = mockOrders;
      if (activeTab !== 'all') {
        filteredOrders = mockOrders.filter(order => order.status === activeTab);
      }
      setOrders(filteredOrders);
    } catch (error) {
      console.error('加载订单失败:', error);
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
    navigation.navigate('OrderDetail', { orderId });
  };

  const handleChatPress = (employerId: string, orderId: string) => {
    navigation.navigate('Chat', { conversationId: `order_${orderId}` });
  };

  // 获取状态颜色
  const getStatusColor = (status: OrderStatus): string | undefined => {
    switch (status) {
      case OrderStatus.PENDING:
        return warningColor;
      case OrderStatus.ACCEPTED:
        return primaryColor;
      case OrderStatus.IN_PROGRESS:
        return primaryColor;
      case OrderStatus.COMPLETED:
        return successColor;
      case OrderStatus.CANCELLED:
        return color10;
      case OrderStatus.DISPUTED:
        return errorColor;
      default:
        return color10;
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return '待确认';
      case OrderStatus.ACCEPTED:
        return '已接单';
      case OrderStatus.IN_PROGRESS:
        return '服务中';
      case OrderStatus.COMPLETED:
        return '已完成';
      case OrderStatus.CANCELLED:
        return '已取消';
      case OrderStatus.DISPUTED:
        return '有争议';
      default:
        return '未知';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: OrderStatus) => {
    const iconSize = 14;
    const iconColor = getStatusColor(status);

    switch (status) {
      case OrderStatus.PENDING:
        return <Clock size={iconSize} color={iconColor} />;
      case OrderStatus.ACCEPTED:
        return <CheckCircle size={iconSize} color={iconColor} />;
      case OrderStatus.IN_PROGRESS:
        return <Clock size={iconSize} color={iconColor} />;
      case OrderStatus.COMPLETED:
        return <CheckCircle size={iconSize} color={iconColor} />;
      case OrderStatus.CANCELLED:
        return <XCircle size={iconSize} color={iconColor} />;
      case OrderStatus.DISPUTED:
        return <AlertCircle size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  // 渲染状态标签栏
  const renderStatusTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <XStack gap="$2" paddingVertical="$2">
        {statusTabs.map(tab => (
          <Pressable key={tab.key} onPress={() => setActiveTab(tab.key as any)}>
            <View
              backgroundColor={activeTab === tab.key ? primaryColor : '$color2'}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$10"
              borderWidth={1}
              borderColor={activeTab === tab.key ? primaryColor : '$color5'}
            >
              <Text
                fontSize="$3"
                color={activeTab === tab.key ? 'white' : '$color12'}
                fontWeight={activeTab === tab.key ? '600' : '400'}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </XStack>
    </ScrollView>
  );

  // 渲染订单卡片
  const renderOrderCard = ({ item }: { item: ServiceOrder }) => (
    <Pressable onPress={() => handleOrderPress(item.id)}>
      <Card
        marginHorizontal="$2.5"
        marginBottom="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        {/* 订单头部 */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <XStack gap="$1.5" alignItems="center">
            {getStatusIcon(item.status)}
            <Text fontSize="$3" color={getStatusColor(item.status)} fontWeight="500">
              {getStatusLabel(item.status)}
            </Text>
          </XStack>
          <Text fontSize="$2" color="$color10">
            {new Date(item.createdAt).toLocaleDateString('zh-CN')}
          </Text>
        </XStack>

        {/* 订单标题 */}
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          {item.title}
        </Text>

        {/* 订单描述 */}
        <Text fontSize="$3" color="$color10" numberOfLines={2} marginBottom="$2">
          {item.description}
        </Text>

        {/* 服务时间和地点 */}
        <YStack gap="$1.5" marginBottom="$2">
          <XStack gap="$1.5" alignItems="center">
            <Calendar size={14} color={color10} />
            <Text fontSize="$3" color="$color12">
              {item.serviceDate} {item.serviceTime}
            </Text>
          </XStack>
          <XStack gap="$1.5" alignItems="center">
            <MapPin size={14} color={color10} />
            <Text fontSize="$3" color="$color10" numberOfLines={1} flex={1}>
              {item.location.district} {item.location.address}
            </Text>
          </XStack>
        </YStack>

        {/* 分割线 */}
        <View height={1} backgroundColor="$color5" marginBottom="$2" />

        {/* 雇主信息和价格 */}
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <View
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={16}>{item.employer.avatar}</Text>
            </View>
            <YStack>
              <Text fontSize="$3" color="$color12" fontWeight="500">
                {item.employer.name}
              </Text>
              <Text fontSize="$2" color="$color10">
                {item.employer.phone}
              </Text>
            </YStack>
          </XStack>

          <YStack alignItems="flex-end">
            <Text fontSize="$4" fontWeight="700" color={successColor}>
              ¥{item.income}
            </Text>
            <Text fontSize="$2" color="$color10">
              实际收入
            </Text>
          </YStack>
        </XStack>

        {/* 操作按钮 */}
        {(item.status === OrderStatus.PENDING ||
          item.status === OrderStatus.ACCEPTED ||
          item.status === OrderStatus.IN_PROGRESS) && (
          <XStack gap="$2" marginTop="$2">
            <Pressable
              style={{ flex: 1 }}
              onPress={() => handleChatPress(item.employer.id, item.id)}
            >
              <View
                flex={1}
                backgroundColor="$color4"
                paddingVertical="$2"
                borderRadius="$10"
                alignItems="center"
                borderWidth={1}
                borderColor="$color5"
              >
                <XStack gap="$1" alignItems="center">
                  <MessageCircle size={14} color={color10} />
                  <Text fontSize="$3" color="$color12">
                    联系雇主
                  </Text>
                  {item.hasUnreadMessage && (
                    <View
                      width={8}
                      height={8}
                      borderRadius={4}
                      backgroundColor={errorColor}
                    />
                  )}
                </XStack>
              </View>
            </Pressable>
            <Pressable style={{ flex: 1 }}>
              <View
                flex={1}
                backgroundColor={primaryColor}
                paddingVertical="$2"
                borderRadius="$10"
                alignItems="center"
              >
                <XStack gap="$1" alignItems="center">
                  <ChevronRight size={14} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    查看详情
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        )}
      </Card>
    </Pressable>
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
      <Text fontSize={48} marginBottom="$2">
        📋
      </Text>
      <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
        暂无订单
      </Text>
      <Text fontSize="$3" color="$color10" textAlign="center">
        {activeTab === 'all'
          ? '您还没有接到任何订单'
          : `没有${getStatusLabel(activeTab as OrderStatus)}的订单`
        }
      </Text>
    </View>
  );

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="我的服务订单" />
      </View>

      {/* 状态标签栏 */}
      {renderStatusTabs()}

      {/* 订单列表 */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      ) : orders.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={<View height={insets.bottom + 20} />}
        />
      )}
    </View>
  );
};
