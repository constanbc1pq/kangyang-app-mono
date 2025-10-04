import React, { useState, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H2,
  H3,
  Theme,
  ScrollView,
  Progress,
  Separator,
  H4,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Settings,
  Award,
  FileText,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  Star,
  TrendingUp,
  Activity,
  Plus,
  Edit,
  Crown,
  Gift,
  User,
  Users,
  Package,
  MessageSquare,
  Truck,
  ShoppingBag,
  Clock,
  MapPin,
  Heart,
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import {
  COLORS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/constants/app';
import { getOrders, Order } from '@/services/orderService';
import { ItemType } from '@/types/commerce';

export const PersonalCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  const userProfile = {
    name: '张健康',
    age: 45,
    gender: '男',
    phone: '138****8888',
    email: 'zhang***@email.com',
    memberLevel: '黄金会员',
    memberExpiry: '2024-12-31',
    healthScore: 85,
    joinDate: '2023-03-15',
    totalCheckIns: 156,
    achievements: 12,
  };

  const familyMembers = [
    {
      id: 1,
      name: '张妈妈',
      relationship: '母亲',
      age: 68,
      healthStatus: '良好',
      lastCheckIn: '今天',
      conditions: ['高血压', '糖尿病'],
    },
    {
      id: 2,
      name: '张爸爸',
      relationship: '父亲',
      age: 70,
      healthStatus: '注意',
      lastCheckIn: '昨天',
      conditions: ['心脏病'],
    },
    {
      id: 3,
      name: '小明',
      relationship: '儿子',
      age: 18,
      healthStatus: '优秀',
      lastCheckIn: '3天前',
      conditions: [],
    },
  ];

  const healthRecords = [
    {
      id: 1,
      date: '2024-01-15',
      type: '体检报告',
      status: '正常',
      doctor: '李医生',
      hospital: '市人民医院',
    },
    {
      id: 2,
      date: '2024-01-10',
      type: '血压监测',
      status: '偏高',
      value: '145/90 mmHg',
      note: '建议控制饮食',
    },
    {
      id: 3,
      date: '2024-01-05',
      type: '血糖检测',
      status: '正常',
      value: '5.8 mmol/L',
      note: '继续保持',
    },
  ];

  const achievements = [
    {
      id: 1,
      title: '健康达人',
      description: '连续30天完成健康打卡',
      icon: '🏆',
      earned: true,
      date: '2024-01-01',
    },
    {
      id: 2,
      title: '运动之星',
      description: '累计步数达到100万步',
      icon: '⭐',
      earned: true,
      date: '2023-12-15',
    },
    {
      id: 3,
      title: '营养专家',
      description: '完成营养知识测试',
      icon: '🥗',
      earned: false,
      progress: 75,
    },
    {
      id: 4,
      title: '社区贡献者',
      description: '发布10篇优质健康分享',
      icon: '💬',
      earned: false,
      progress: 60,
    },
  ];

  const memberBenefits = [
    {
      title: '专属健康顾问',
      description: '一对一专业健康指导',
      available: true,
    },
    {
      title: '高级体检套餐',
      description: '年度免费全面体检',
      available: true,
    },
    {
      title: '家庭健康管理',
      description: '最多管理8位家庭成员',
      available: true,
    },
    {
      title: '优先预约服务',
      description: '医疗服务优先预约权',
      available: false,
    },
  ];

  // 加载订单数据
  const loadOrders = async () => {
    try {
      const allOrders = await getOrders();
      console.log('✅ 订单数据已从localStorage(@kangyang_orders)加载:', allOrders.length, '条订单');
      setOrders(allOrders);
    } catch (error) {
      console.error('❌ 加载订单失败:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  // 按类型分类订单（修复：使用order.itemType字段）
  const getOrdersByType = (type: ItemType) => {
    const filtered = orders.filter(order => order.itemType === type);
    console.log(`✅ PersonalCenter: ${type}类型订单共${filtered.length}条，展示最新3条`);
    return filtered.slice(0, 3);
  };

  // 服务类订单（meal_plan和service）
  const serviceOrders = orders.filter(order => order.itemType === 'meal_plan' || order.itemType === 'service').slice(0, 3);
  // 养老服务订单
  const elderlyServiceOrders = getOrdersByType('elderly_service');
  // 咨询类订单
  const consultationOrders = getOrdersByType('consultation');
  // 商品类订单
  const productOrders = getOrdersByType('product');

  // 获取订单图标
  const getOrderIcon = (type: ItemType) => {
    switch (type) {
      case 'meal_plan':
        return <ShoppingBag size={20} color={COLORS.primary} />;
      case 'consultation':
        return <MessageSquare size={20} color={COLORS.primary} />;
      case 'elderly_service':
        return <Heart size={20} color={COLORS.primary} />;
      case 'product':
        return <Package size={20} color={COLORS.primary} />;
      default:
        return <Package size={20} color={COLORS.primary} />;
    }
  };

  // 状态颜色（使用全局常量）
  const getStatusColor = (status: string): string => {
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || '#6B7280';
  };

  // 状态标签（使用全局常量）
  const getStatusLabel = (status: string): string => {
    return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack space="$4" padding="$4">
            {/* User Profile Header - 移动端优化版 */}
            <View borderRadius="$4" overflow="hidden">
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 16 }}
              >
                {/* 主要信息区 - 紧凑布局 */}
                <XStack space="$3" alignItems="center" marginBottom="$3">
                  <View
                    width={50}
                    height={50}
                    backgroundColor="rgba(255,255,255,0.2)"
                    borderRadius={25}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <User size={24} color="white" />
                  </View>
                  <YStack flex={1} space="$1">
                    <XStack space="$2" alignItems="center">
                      <H2 fontSize="$6" fontWeight="bold" color="white">
                        {userProfile.name}
                      </H2>
                      <Pressable onPress={() => console.log('Edit profile')}>
                        <Edit size={14} color="rgba(255,255,255,0.8)" />
                      </Pressable>
                    </XStack>
                    <XStack space="$2" alignItems="center" flexWrap="wrap">
                      <View
                        backgroundColor="rgba(255,215,0,0.3)"
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor="rgba(255,215,0,0.5)"
                      >
                        <XStack space="$1" alignItems="center">
                          <Crown size={10} color="#FFD700" />
                          <Text fontSize="$1" color="#FFD700" fontWeight="600">
                            {userProfile.memberLevel}
                          </Text>
                        </XStack>
                      </View>
                    </XStack>
                  </YStack>
                </XStack>

                {/* 关键数据 - 精简版 */}
                <XStack justifyContent="space-around" alignItems="center">
                  <YStack alignItems="center" minWidth={60}>
                    <XStack space="$1" alignItems="center" marginBottom="$0.5">
                      <Text fontSize="$4" fontWeight="bold" color="white">
                        {userProfile.healthScore}
                      </Text>
                      <TrendingUp size={12} color="#4ADE80" />
                    </XStack>
                    <Text fontSize="$1" color="rgba(255,255,255,0.8)">健康分</Text>
                  </YStack>
                  <YStack alignItems="center" minWidth={60}>
                    <Text fontSize="$4" fontWeight="bold" color="white" marginBottom="$0.5">
                      {userProfile.totalCheckIns}
                    </Text>
                    <Text fontSize="$1" color="rgba(255,255,255,0.8)">打卡天数</Text>
                  </YStack>
                  <YStack alignItems="center" minWidth={60}>
                    <Text fontSize="$4" fontWeight="bold" color="white" marginBottom="$0.5">
                      {userProfile.achievements}
                    </Text>
                    <Text fontSize="$1" color="rgba(255,255,255,0.8)">成就</Text>
                  </YStack>
                </XStack>
              </LinearGradient>
            </View>

            {/* Tab Navigation */}
            <Card
              padding="$4"
              borderRadius="$4"
              backgroundColor="$cardBg"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
            >
              {/* Tab Buttons */}
              <XStack
                backgroundColor="$surface"
                borderRadius="$3"
                padding="$1"
                marginBottom="$4"
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('orders')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'orders' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'orders' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'orders' ? '600' : '400'}
                    >
                      订单
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('profile')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'profile' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'profile' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'profile' ? '600' : '400'}
                    >
                      个人信息
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('family')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'family' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'family' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'family' ? '600' : '400'}
                    >
                      家庭成员
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('membership')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'membership' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'membership' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'membership' ? '600' : '400'}
                    >
                      会员中心
                    </Text>
                  </View>
                </Pressable>
              </XStack>

              <Separator marginBottom="$4" />

              {/* Tab Content */}
              {activeTab === 'orders' && (
                <YStack gap="$4">
                  {/* 订单页面标题和统一的"查看全部"按钮 */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <H4 fontSize="$5" fontWeight="600" color="$text">
                      我的订单
                    </H4>
                    <Pressable onPress={() => navigation.navigate('OrderList' as never)}>
                      <XStack gap="$1" alignItems="center">
                        <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
                          查看全部
                        </Text>
                        <ChevronRight size={18} color={COLORS.primary} />
                      </XStack>
                    </Pressable>
                  </XStack>

                  {/* 服务类订单 */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="600" color="$text">
                      服务类订单
                    </H4>
                    {serviceOrders.length > 0 ? (
                      serviceOrders.map(order => (
                        <Card
                          key={order.id}
                          bordered
                          padding="$3"
                          pressStyle={{ scale: 0.98 }}
                          onPress={() => {
                            navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
                          }}
                        >
                          <XStack gap="$3" alignItems="center">
                            {getOrderIcon(order.itemType)}
                            <YStack flex={1} gap="$1">
                              <Text fontSize="$3" fontWeight="600" color="$text">
                                {order.itemName}
                              </Text>
                              <Text fontSize="$2" color="$textSecondary">
                                {order.createdAt}
                              </Text>
                            </YStack>
                            <YStack alignItems="flex-end" gap="$1">
                              <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                                ¥{order.totalAmount.toFixed(2)}
                              </Text>
                              <View
                                backgroundColor={`${getStatusColor(order.status)}20`}
                                paddingHorizontal="$2"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" color={getStatusColor(order.status)} fontWeight="600">
                                  {getStatusLabel(order.status)}
                                </Text>
                              </View>
                            </YStack>
                          </XStack>
                        </Card>
                      ))
                    ) : (
                      <View paddingVertical="$6" alignItems="center">
                        <ShoppingBag size={48} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                          暂无服务类订单
                        </Text>
                      </View>
                    )}
                  </YStack>

                  {/* 咨询类订单 */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="600" color="$text">
                      咨询类订单
                    </H4>
                    {consultationOrders.length > 0 ? (
                      consultationOrders.map(order => (
                        <Card
                          key={order.id}
                          bordered
                          padding="$3"
                          pressStyle={{ scale: 0.98 }}
                          onPress={() => {
                            navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
                          }}
                        >
                          <XStack gap="$3" alignItems="center">
                            {getOrderIcon(order.itemType)}
                            <YStack flex={1} gap="$1">
                              <Text fontSize="$3" fontWeight="600" color="$text">
                                {order.itemName}
                              </Text>
                              {order.metadata?.appointmentDate && (
                                <XStack gap="$1" alignItems="center">
                                  <Clock size={12} color={COLORS.textSecondary} />
                                  <Text fontSize="$2" color="$textSecondary">
                                    {order.metadata.appointmentDate} {order.metadata.appointmentTime}
                                  </Text>
                                </XStack>
                              )}
                            </YStack>
                            <YStack alignItems="flex-end" gap="$1">
                              <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                                ¥{order.totalAmount.toFixed(2)}
                              </Text>
                              <View
                                backgroundColor={`${getStatusColor(order.status)}20`}
                                paddingHorizontal="$2"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" color={getStatusColor(order.status)} fontWeight="600">
                                  {getStatusLabel(order.status)}
                                </Text>
                              </View>
                            </YStack>
                          </XStack>
                        </Card>
                      ))
                    ) : (
                      <View paddingVertical="$6" alignItems="center">
                        <MessageSquare size={48} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                          暂无咨询类订单
                        </Text>
                      </View>
                    )}
                  </YStack>

                  {/* 养老服务订单 */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="600" color="$text">
                      养老服务订单
                    </H4>
                    {elderlyServiceOrders.length > 0 ? (
                      elderlyServiceOrders.map(order => (
                        <Card
                          key={order.id}
                          bordered
                          padding="$3"
                          pressStyle={{ scale: 0.98 }}
                          onPress={() => {
                            navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
                          }}
                        >
                          <XStack gap="$3" alignItems="center">
                            {getOrderIcon(order.itemType)}
                            <YStack flex={1} gap="$1">
                              <Text fontSize="$3" fontWeight="600" color="$text">
                                {order.itemName}
                              </Text>
                              {order.metadata?.appointmentDate && (
                                <XStack gap="$1" alignItems="center">
                                  <Clock size={12} color={COLORS.textSecondary} />
                                  <Text fontSize="$2" color="$textSecondary">
                                    {order.metadata.appointmentDate} {order.metadata.appointmentTime}
                                  </Text>
                                </XStack>
                              )}
                            </YStack>
                            <YStack alignItems="flex-end" gap="$1">
                              <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                                ¥{order.totalAmount.toFixed(2)}
                              </Text>
                              <View
                                backgroundColor={`${getStatusColor(order.status)}20`}
                                paddingHorizontal="$2"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" color={getStatusColor(order.status)} fontWeight="600">
                                  {getStatusLabel(order.status)}
                                </Text>
                              </View>
                            </YStack>
                          </XStack>
                        </Card>
                      ))
                    ) : (
                      <View paddingVertical="$6" alignItems="center">
                        <Heart size={48} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                          暂无养老服务订单
                        </Text>
                      </View>
                    )}
                  </YStack>

                  {/* 商品类订单 */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="600" color="$text">
                      商品类订单
                    </H4>
                    {productOrders.length > 0 ? (
                      productOrders.map(order => (
                        <Card
                          key={order.id}
                          bordered
                          padding="$3"
                          pressStyle={{ scale: 0.98 }}
                          onPress={() => {
                            navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
                          }}
                        >
                          <XStack gap="$3" alignItems="center">
                            {getOrderIcon(order.itemType)}
                            <YStack flex={1} gap="$1">
                              <Text fontSize="$3" fontWeight="600" color="$text">
                                {order.itemName}
                              </Text>
                              {order.deliveryAddress && (
                                <XStack gap="$1" alignItems="center">
                                  <MapPin size={12} color={COLORS.textSecondary} />
                                  <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
                                    {order.deliveryAddress.name}
                                  </Text>
                                </XStack>
                              )}
                            </YStack>
                            <YStack alignItems="flex-end" gap="$1">
                              <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                                ¥{order.totalAmount.toFixed(2)}
                              </Text>
                              <View
                                backgroundColor={`${getStatusColor(order.status)}20`}
                                paddingHorizontal="$2"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" color={getStatusColor(order.status)} fontWeight="600">
                                  {getStatusLabel(order.status)}
                                </Text>
                              </View>
                            </YStack>
                          </XStack>
                        </Card>
                      ))
                    ) : (
                      <View paddingVertical="$6" alignItems="center">
                        <Package size={48} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                          暂无商品类订单
                        </Text>
                      </View>
                    )}
                  </YStack>
                </YStack>
              )}

              {activeTab === 'profile' && (
                <YStack space="$4">
                  {/* Quick Actions */}
                  <Card
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
                      快捷操作
                    </H3>
                    <YStack space="$2">
                      <XStack space="$2">
                        <Pressable style={{ flex: 1 }} onPress={() => console.log('账户设置')}>
                          <View
                            flex={1}
                            height={70}
                            backgroundColor="$background"
                            borderRadius="$3"
                            borderWidth={1}
                            borderColor="$borderColor"
                            justifyContent="center"
                            alignItems="center"
                            space="$2"
                          >
                            <Settings size={20} color={COLORS.primary} />
                            <Text fontSize="$2" color="$text" textAlign="center">账户设置</Text>
                          </View>
                        </Pressable>
                        <Pressable style={{ flex: 1 }} onPress={() => console.log('消息通知')}>
                          <View
                            flex={1}
                            height={70}
                            backgroundColor="$background"
                            borderRadius="$3"
                            borderWidth={1}
                            borderColor="$borderColor"
                            justifyContent="center"
                            alignItems="center"
                            space="$2"
                          >
                            <Bell size={20} color={COLORS.primary} />
                            <Text fontSize="$2" color="$text" textAlign="center">消息通知</Text>
                          </View>
                        </Pressable>
                      </XStack>
                      <XStack space="$2">
                        <Pressable style={{ flex: 1 }} onPress={() => console.log('隐私安全')}>
                          <View
                            flex={1}
                            height={70}
                            backgroundColor="$background"
                            borderRadius="$3"
                            borderWidth={1}
                            borderColor="$borderColor"
                            justifyContent="center"
                            alignItems="center"
                            space="$2"
                          >
                            <Shield size={20} color={COLORS.primary} />
                            <Text fontSize="$2" color="$text" textAlign="center">隐私安全</Text>
                          </View>
                        </Pressable>
                        <Pressable style={{ flex: 1 }} onPress={() => console.log('支付管理')}>
                          <View
                            flex={1}
                            height={70}
                            backgroundColor="$background"
                            borderRadius="$3"
                            borderWidth={1}
                            borderColor="$borderColor"
                            justifyContent="center"
                            alignItems="center"
                            space="$2"
                          >
                            <CreditCard size={20} color={COLORS.primary} />
                            <Text fontSize="$2" color="$text" textAlign="center">支付管理</Text>
                          </View>
                        </Pressable>
                      </XStack>
                    </YStack>
                  </Card>

                  {/* Achievements */}
                  <Card
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <XStack space="$2" alignItems="center" marginBottom="$4">
                      <Award size={20} color={COLORS.primary} />
                      <H3 fontSize="$6" color="$text" fontWeight="600">
                        我的成就
                      </H3>
                    </XStack>

                    <YStack space="$3">
                      {achievements.map((achievement) => (
                        <View
                          key={achievement.id}
                          padding="$4"
                          borderRadius="$3"
                          backgroundColor={achievement.earned ? '$primary' : '$background'}
                          borderWidth={achievement.earned ? 0 : 1}
                          borderColor="$borderColor"
                          opacity={achievement.earned ? 1 : 0.7}
                        >
                          <XStack space="$3" alignItems="center" marginBottom="$2">
                            <Text fontSize="$8">{achievement.icon}</Text>
                            <YStack flex={1}>
                              <XStack space="$2" alignItems="center">
                                <H3
                                  fontSize="$4"
                                  fontWeight="600"
                                  color={achievement.earned ? 'white' : '$text'}
                                >
                                  {achievement.title}
                                </H3>
                                {achievement.earned && (
                                  <View
                                    backgroundColor="rgba(255,255,255,0.2)"
                                    paddingHorizontal="$2"
                                    paddingVertical="$1"
                                    borderRadius="$2"
                                  >
                                    <Text fontSize="$2" color="white">已获得</Text>
                                  </View>
                                )}
                              </XStack>
                              <Text
                                fontSize="$3"
                                color={achievement.earned ? 'rgba(255,255,255,0.8)' : '$textSecondary'}
                              >
                                {achievement.description}
                              </Text>
                            </YStack>
                          </XStack>
                          {!achievement.earned && achievement.progress && (
                            <YStack space="$1">
                              <XStack justifyContent="space-between">
                                <Text fontSize="$3" color="$textSecondary">进度</Text>
                                <Text fontSize="$3" color="$textSecondary">
                                  {achievement.progress}%
                                </Text>
                              </XStack>
                              <Progress
                                value={achievement.progress}
                                backgroundColor="$surface"
                                marginTop="$1"
                              >
                                <Progress.Indicator
                                  backgroundColor={COLORS.primary}
                                  animation="bouncy"
                                />
                              </Progress>
                            </YStack>
                          )}
                          {achievement.earned && (
                            <Text fontSize="$3" color="rgba(255,255,255,0.8)" marginTop="$1">
                              获得时间: {achievement.date}
                            </Text>
                          )}
                        </View>
                      ))}
                    </YStack>
                  </Card>
                </YStack>
              )}

              {activeTab === 'family' && (
                <YStack space="$4">
                  {/* Add Family Member */}
                  <Card
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack>
                        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                          添加家庭成员
                        </H3>
                        <Text fontSize="$3" color="$textSecondary">
                          为家人创建健康档案，共同管理家庭健康
                        </Text>
                      </YStack>
                      <Pressable>
                        <View
                          backgroundColor={COLORS.primary}
                          borderRadius="$3"
                          paddingVertical="$3"
                          paddingHorizontal="$4"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <XStack space="$1" alignItems="center">
                            <Plus size={16} color="white" />
                            <Text fontSize="$3" color="white">添加成员</Text>
                          </XStack>
                        </View>
                      </Pressable>
                    </XStack>
                  </Card>

                  {/* Family Members */}
                  <YStack space="$3">
                    {familyMembers.map((member) => (
                      <Card
                        key={member.id}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$surface"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <XStack space="$4" alignItems="center" marginBottom="$3">
                          <View
                            width={60}
                            height={60}
                            backgroundColor="$background"
                            borderRadius={30}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <User size={24} color={COLORS.textSecondary} />
                          </View>
                          <YStack flex={1}>
                            <XStack space="$2" alignItems="center" marginBottom="$1">
                              <H3 fontSize="$5" fontWeight="600" color="$text">
                                {member.name}
                              </H3>
                              <View
                                backgroundColor="$background"
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius="$2"
                              >
                                <Text fontSize="$2" color="$textSecondary">
                                  {member.relationship}
                                </Text>
                              </View>
                            </XStack>
                            <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                              {member.age}岁 · 最后打卡: {member.lastCheckIn}
                            </Text>
                            <XStack space="$1" alignItems="center">
                              <Activity
                                size={16}
                                color={
                                  member.healthStatus === '优秀'
                                    ? COLORS.success
                                    : member.healthStatus === '良好'
                                    ? COLORS.secondary
                                    : COLORS.warning
                                }
                              />
                              <Text
                                fontSize="$3"
                                fontWeight="600"
                                color={
                                  member.healthStatus === '优秀'
                                    ? COLORS.success
                                    : member.healthStatus === '良好'
                                    ? COLORS.secondary
                                    : COLORS.warning
                                }
                              >
                                {member.healthStatus}
                              </Text>
                            </XStack>
                          </YStack>
                        </XStack>

                        {member.conditions.length > 0 && (
                          <YStack space="$2" marginBottom="$3">
                            <Text fontSize="$3" color="$textSecondary">关注疾病:</Text>
                            <XStack flexWrap="wrap" gap="$2">
                              {member.conditions.map((condition, index) => (
                                <View
                                  key={index}
                                  backgroundColor="$secondary"
                                  paddingHorizontal="$2"
                                  paddingVertical="$1"
                                  borderRadius="$2"
                                >
                                  <Text fontSize="$2" color="white">
                                    {condition}
                                  </Text>
                                </View>
                              ))}
                            </XStack>
                          </YStack>
                        )}

                        <XStack space="$2">
                          <Pressable style={{ flex: 1 }}>
                            <View
                              flex={1}
                              borderWidth={1}
                              borderColor="$borderColor"
                              backgroundColor="transparent"
                              borderRadius="$3"
                              paddingVertical="$2"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color="$text">查看详情</Text>
                            </View>
                          </Pressable>
                          <Pressable style={{ flex: 1 }}>
                            <View
                              flex={1}
                              borderWidth={1}
                              borderColor="$borderColor"
                              backgroundColor="transparent"
                              borderRadius="$3"
                              paddingVertical="$2"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color="$text">健康提醒</Text>
                            </View>
                          </Pressable>
                        </XStack>
                      </Card>
                    ))}
                  </YStack>
                </YStack>
              )}

              {activeTab === 'records' && (
                <Card
                  padding="$4"
                  borderRadius="$4"
                  backgroundColor="$surface"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <XStack space="$2" alignItems="center" marginBottom="$4">
                    <FileText size={20} color={COLORS.primary} />
                    <H3 fontSize="$6" color="$text" fontWeight="600">
                      健康档案
                    </H3>
                  </XStack>

                  <YStack space="$3">
                    {healthRecords.map((record) => (
                      <XStack
                        key={record.id}
                        justifyContent="space-between"
                        alignItems="center"
                        padding="$4"
                        borderRadius="$3"
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <YStack flex={1}>
                          <XStack space="$3" alignItems="center" marginBottom="$2">
                            <H3 fontSize="$4" fontWeight="600" color="$text">
                              {record.type}
                            </H3>
                            <View
                              backgroundColor={record.status === '正常' ? COLORS.success : COLORS.error}
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color="white">
                                {record.status}
                              </Text>
                            </View>
                          </XStack>
                          <YStack space="$1">
                            <Text fontSize="$3" color="$textSecondary">
                              日期: {record.date}
                            </Text>
                            {record.value && (
                              <Text fontSize="$3" color="$textSecondary">
                                数值: {record.value}
                              </Text>
                            )}
                            {record.doctor && (
                              <Text fontSize="$3" color="$textSecondary">
                                医生: {record.doctor}
                              </Text>
                            )}
                            {record.hospital && (
                              <Text fontSize="$3" color="$textSecondary">
                                医院: {record.hospital}
                              </Text>
                            )}
                            {record.note && (
                              <Text fontSize="$3" color="$textSecondary">
                                备注: {record.note}
                              </Text>
                            )}
                          </YStack>
                        </YStack>
                        <Pressable>
                          <View
                            paddingVertical="$2"
                            paddingHorizontal="$2"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <ChevronRight size={16} color={COLORS.textSecondary} />
                          </View>
                        </Pressable>
                      </XStack>
                    ))}
                  </YStack>
                </Card>
              )}

              {activeTab === 'membership' && (
                <YStack space="$4">
                  {/* Membership Status */}
                  <View borderRadius="$6" overflow="hidden">
                    <LinearGradient
                      colors={['#FEF3C7', '#FDE68A']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ padding: 24 }}
                    >
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                        <XStack space="$3" alignItems="center">
                          <Crown size={32} color="#D97706" />
                          <YStack>
                            <H3 fontSize="$7" fontWeight="bold" color="#92400E">
                              {userProfile.memberLevel}
                            </H3>
                            <Text fontSize="$3" color="#A16207">
                              到期时间: {userProfile.memberExpiry}
                            </Text>
                          </YStack>
                        </XStack>
                        <Pressable>
                          <View
                            backgroundColor="#D97706"
                            borderRadius="$3"
                            paddingVertical="$3"
                            paddingHorizontal="$4"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <XStack space="$1" alignItems="center">
                              <Gift size={16} color="white" />
                              <Text fontSize="$3" color="white">续费升级</Text>
                            </XStack>
                          </View>
                        </Pressable>
                      </XStack>
                      <Progress
                        value={75}
                        backgroundColor="rgba(146, 64, 14, 0.2)"
                        marginBottom="$2"
                      >
                        <Progress.Indicator backgroundColor="#D97706" animation="bouncy" />
                      </Progress>
                      <Text fontSize="$3" color="#A16207">
                        距离白金会员还需要 25 积分
                      </Text>
                    </LinearGradient>
                  </View>

                  {/* Member Benefits */}
                  <Card
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <H3 fontSize="$6" color="$text" fontWeight="600" marginBottom="$4">
                      会员权益
                    </H3>
                    <YStack space="$3">
                      {memberBenefits.map((benefit, index) => (
                        <XStack
                          key={index}
                          justifyContent="space-between"
                          alignItems="center"
                          padding="$4"
                          borderRadius="$3"
                          backgroundColor="$background"
                          borderWidth={1}
                          borderColor="$borderColor"
                        >
                          <YStack flex={1}>
                            <H3 fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                              {benefit.title}
                            </H3>
                            <Text fontSize="$3" color="$textSecondary">
                              {benefit.description}
                            </Text>
                          </YStack>
                          <View
                            backgroundColor={benefit.available ? COLORS.success : '$background'}
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                            borderWidth={benefit.available ? 0 : 1}
                            borderColor="$borderColor"
                          >
                            <Text
                              fontSize="$2"
                              color={benefit.available ? 'white' : '$textSecondary'}
                            >
                              {benefit.available ? '已开通' : '未开通'}
                            </Text>
                          </View>
                        </XStack>
                      ))}
                    </YStack>
                  </Card>

                  {/* Upgrade Options */}
                  <Card
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <H3 fontSize="$6" color="$text" fontWeight="600" marginBottom="$4">
                      升级选项
                    </H3>
                    <YStack space="$3">
                      <XStack space="$3">
                        <View
                          flex={1}
                          padding="$4"
                          borderRadius="$3"
                          backgroundColor="$background"
                          borderWidth={1}
                          borderColor="$borderColor"
                          alignItems="center"
                        >
                          <H3 fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
                            银卡会员
                          </H3>
                          <Text fontSize="$6" fontWeight="bold" color="$text" marginBottom="$2">
                            ¥99/年
                          </Text>
                          <Text fontSize="$3" color="$textSecondary" marginBottom="$3" textAlign="center">
                            基础健康服务
                          </Text>
                          <Pressable style={{ width: '100%' }}>
                            <View
                              borderWidth={1}
                              borderColor="$borderColor"
                              backgroundColor="transparent"
                              borderRadius="$3"
                              paddingVertical="$2"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color="$textSecondary">当前等级</Text>
                            </View>
                          </Pressable>
                        </View>
                        <View
                          flex={1}
                          padding="$4"
                          borderRadius="$3"
                          backgroundColor="$primary"
                          alignItems="center"
                        >
                          <XStack space="$1" alignItems="center" marginBottom="$2">
                            <Crown size={16} color="#FFD700" />
                            <H3 fontSize="$4" fontWeight="600" color="white">
                              黄金会员
                            </H3>
                          </XStack>
                          <Text fontSize="$6" fontWeight="bold" color="white" marginBottom="$2">
                            ¥299/年
                          </Text>
                          <Text fontSize="$3" color="rgba(255,255,255,0.8)" marginBottom="$3" textAlign="center">
                            专业健康管理
                          </Text>
                          <Pressable style={{ width: '100%' }}>
                            <View
                              backgroundColor="white"
                              borderRadius="$3"
                              paddingVertical="$2"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color={COLORS.primary}>当前等级</Text>
                            </View>
                          </Pressable>
                        </View>
                      </XStack>
                      <View
                        padding="$4"
                        borderRadius="$3"
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$borderColor"
                        alignItems="center"
                      >
                        <XStack space="$1" alignItems="center" marginBottom="$2">
                          <Star size={16} color="#8B5CF6" />
                          <H3 fontSize="$4" fontWeight="600" color="$text">
                            白金会员
                          </H3>
                        </XStack>
                        <Text fontSize="$6" fontWeight="bold" color="$text" marginBottom="$2">
                          ¥599/年
                        </Text>
                        <Text fontSize="$3" color="$textSecondary" marginBottom="$3" textAlign="center">
                          全方位健康服务
                        </Text>
                        <Pressable style={{ width: '100%' }}>
                          <View
                            borderWidth={1}
                            borderColor={COLORS.primary}
                            backgroundColor="transparent"
                            borderRadius="$3"
                            paddingVertical="$2"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text fontSize="$3" color={COLORS.primary}>立即升级</Text>
                          </View>
                        </Pressable>
                      </View>
                    </YStack>
                  </Card>
                </YStack>
              )}
            </Card>

            {/* Bottom padding for safe area */}
            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};