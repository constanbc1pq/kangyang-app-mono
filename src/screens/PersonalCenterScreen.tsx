/**
 * PersonalCenterScreen - "我的"首页
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Settings,
  Award,
  Shield,
  CreditCard,
  ChevronRight,
  Star,
  User,
  Users,
  Package,
  MessageSquare,
  Clock,
  MapPin,
  Heart,
  Crown,
  Gift,
  Plus,
  Edit,
  CheckCircle,
  Target,
  Zap,
  ShoppingBag,
} from 'lucide-react-native';
import { Pressable, Modal } from 'react-native';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants/app';
import { getOrders, Order } from '@/services/orderService';
import { ItemType } from '@/types/commerce';
import {
  getFamilyMembers,
  deleteFamilyMember,
  getMembership,
  getTasks,
  getPoints,
} from '@/services/userDataService';
import { getMyExpertProfile } from '@/services/communityDataService';
import { FamilyMember } from '@/types/userData';
import {
  MembershipLevel,
  MEMBERSHIP_LEVEL_LABELS,
  MEMBERSHIP_LEVEL_COLORS,
  MEMBERSHIP_PRICES,
} from '@/types/membership';
import { Expert, ExpertCertStatus } from '@/types/community';

// 成就类型定义
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  target?: number;
}

// 默认成就数据
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'health_master',
    title: '健康达人',
    description: '连续完成30个健康任务',
    icon: '🏆',
    earned: true,
    earnedDate: '2024-01-15',
  },
  {
    id: 'early_bird',
    title: '早起之星',
    description: '连续7天早起打卡',
    icon: '🌅',
    earned: true,
    earnedDate: '2024-01-10',
  },
  {
    id: 'nutrition_expert',
    title: '营养专家',
    description: '完成50次膳食记录',
    icon: '🥗',
    earned: false,
    progress: 35,
    target: 50,
  },
  {
    id: 'community_star',
    title: '社区之星',
    description: '获得100个点赞',
    icon: '⭐',
    earned: false,
    progress: 68,
    target: 100,
  },
];

export const PersonalCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  // 用户数据
  const [membershipLevel, setMembershipLevel] = useState<MembershipLevel>(MembershipLevel.FREE);
  const [membershipExpiry, setMembershipExpiry] = useState<string>('');
  const [points, setPoints] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // 达人数据
  const [expertProfile, setExpertProfile] = useState<Expert | null>(null);

  const userProfile = {
    name: '张健康',
    age: 45,
    phone: '138****8888',
  };

  // 加载所有数据
  const loadData = async () => {
    try {
      // 加载会员信息
      const membership = await getMembership();
      setMembershipLevel(membership.level);
      setMembershipExpiry(membership.expireDate || '');

      // 加载积分
      const pointsInfo = await getPoints();
      setPoints(pointsInfo.balance);

      // 加载任务统计
      const tasks = await getTasks();
      const completedCount = tasks.filter(t => t.status === 'completed').length;
      setCompletedTasksCount(completedCount);

      // 加载成就统计
      const earnedAchievements = achievements.filter(a => a.earned).length;
      setAchievementsCount(earnedAchievements);

      // 加载达人资料
      const expert = await getMyExpertProfile();
      setExpertProfile(expert);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  // 加载订单数据
  const loadOrders = async () => {
    try {
      const allOrders = await getOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('加载订单失败:', error);
    }
  };

  // 加载家庭成员数据
  const loadFamilyMembers = async () => {
    try {
      const members = await getFamilyMembers();
      setFamilyMembers(members);
    } catch (error) {
      console.error('加载家庭成员失败:', error);
    }
  };

  // 删除家庭成员
  const handleDeleteMember = (memberId: string, memberName: string) => {
    setMemberToDelete({ id: memberId, name: memberName });
    setShowDeleteConfirm(true);
  };

  // 确认删除家庭成员
  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      const success = await deleteFamilyMember(memberToDelete.id);
      if (success) {
        await loadFamilyMembers();
      }
    } catch (error) {
      console.error('删除家庭成员失败:', error);
    } finally {
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadOrders();
      loadFamilyMembers();
    }, [])
  );

  // 获取订单图标
  const getOrderIcon = (type: ItemType) => {
    switch (type) {
      case 'meal_plan':
        return <ShoppingBag size={18} color={primaryColor} />;
      case 'consultation':
        return <MessageSquare size={18} color={primaryColor} />;
      case 'elderly_service':
        return <Heart size={18} color={primaryColor} />;
      case 'product':
        return <Package size={18} color={primaryColor} />;
      case 'private_doctor':
        return <User size={18} color={primaryColor} />;
      default:
        return <Package size={18} color={primaryColor} />;
    }
  };

  // 状态颜色
  const getStatusColor = (status: string): string => {
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || '#6B7280';
  };

  // 状态标签
  const getStatusLabel = (status: string): string => {
    return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
  };

  // 会员等级颜色
  const levelColors = MEMBERSHIP_LEVEL_COLORS[membershipLevel];

  // 按类型分类订单
  const serviceOrders = orders.filter(o => o.itemType === 'meal_plan' || o.itemType === 'service').slice(0, 3);
  const consultationOrders = orders.filter(o => o.itemType === 'consultation').slice(0, 3);
  const productOrders = orders.filter(o => o.itemType === 'product').slice(0, 3);

  // 渲染订单卡片
  const renderOrderCard = (order: Order) => (
    <Pressable
      key={order.id}
      onPress={() => navigation.navigate('OrderDetail' as never, { orderId: order.id } as never)}
    >
      <View
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        marginBottom="$2"
      >
        <XStack gap="$2" alignItems="center">
          {getOrderIcon(order.itemType)}
          <YStack flex={1} gap="$1">
            <Text fontSize="$3" fontWeight="600" color="$color12" numberOfLines={1}>
              {order.itemName}
            </Text>
            <Text fontSize="$2" color="$color10">
              {order.createdAt}
            </Text>
          </YStack>
          <YStack alignItems="flex-end" gap="$1">
            <Text fontSize="$4" fontWeight="700" color="$primary">
              ¥{order.totalAmount.toFixed(2)}
            </Text>
            <View
              backgroundColor={`${getStatusColor(order.status)}20`}
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
            >
              <Text fontSize={10} color={getStatusColor(order.status)} fontWeight="600">
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </YStack>
        </XStack>
      </View>
    </Pressable>
  );

  // 渐变背景颜色
  const gradientColors = ['#d6dece', '#e8e6eb', primaryColor] as const;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack padding="$2.5" gap="$2">
          {/* 个人信息 + 会员卡片融合 */}
          <View borderRadius="$5" overflow="hidden">
            <LinearGradient
              colors={levelColors.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16 }}
            >
              {/* 用户信息 */}
              <XStack gap="$2" alignItems="center" marginBottom="$2">
                <View
                  width={56}
                  height={56}
                  backgroundColor="rgba(255,255,255,0.25)"
                  borderRadius={28}
                  justifyContent="center"
                  alignItems="center"
                >
                  <User size={28} color="white" />
                </View>
                <YStack flex={1}>
                  <XStack gap="$2" alignItems="center">
                    <Text fontSize="$6" fontWeight="700" color="white">
                      {userProfile.name}
                    </Text>
                    <Pressable onPress={() => console.log('编辑资料')}>
                      <Edit size={14} color="rgba(255,255,255,0.8)" />
                    </Pressable>
                  </XStack>
                  <XStack gap="$1.5" alignItems="center" marginTop="$1">
                    <Crown size={14} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="500">
                      {MEMBERSHIP_LEVEL_LABELS[membershipLevel]}
                    </Text>
                    {membershipExpiry && membershipLevel !== MembershipLevel.FREE && (
                      <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                        · {membershipExpiry}到期
                      </Text>
                    )}
                  </XStack>
                </YStack>
                <Pressable onPress={() => navigation.navigate('MembershipCenter' as never)}>
                  <View
                    backgroundColor="rgba(255,255,255,0.25)"
                    paddingHorizontal="$2"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                  >
                    <XStack gap="$1" alignItems="center">
                      <Gift size={12} color="white" />
                      <Text fontSize="$2" color="white" fontWeight="500">
                        {membershipLevel === MembershipLevel.FREE ? '开通会员' : '会员中心'}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </XStack>

              {/* 统计数据 */}
              <XStack
                backgroundColor="rgba(255,255,255,0.15)"
                borderRadius="$4"
                padding="$2"
                justifyContent="space-around"
              >
                <YStack alignItems="center">
                  <Text fontSize="$5" fontWeight="700" color="white">
                    {points}
                  </Text>
                  <Text fontSize="$2" color="rgba(255,255,255,0.8)">积分</Text>
                </YStack>
                <View width={1} backgroundColor="rgba(255,255,255,0.2)" />
                <YStack alignItems="center">
                  <Text fontSize="$5" fontWeight="700" color="white">
                    {completedTasksCount}
                  </Text>
                  <Text fontSize="$2" color="rgba(255,255,255,0.8)">完成任务</Text>
                </YStack>
                <View width={1} backgroundColor="rgba(255,255,255,0.2)" />
                <YStack alignItems="center">
                  <Text fontSize="$5" fontWeight="700" color="white">
                    {achievementsCount}
                  </Text>
                  <Text fontSize="$2" color="rgba(255,255,255,0.8)">成就</Text>
                </YStack>
              </XStack>
            </LinearGradient>
          </View>

          {/* Tab 切换 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            padding="$2"
            borderWidth={1}
            borderColor="$color5"
          >
            {/* Tab 按钮 */}
            <XStack
              backgroundColor="$color4"
              borderRadius="$4"
              padding="$1"
              marginBottom="$2"
            >
              {['orders', 'profile', 'family', 'membership'].map((tab) => (
                <Pressable
                  key={tab}
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab(tab)}
                >
                  <View
                    height={36}
                    backgroundColor={activeTab === tab ? primaryColor : 'transparent'}
                    borderRadius="$3"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === tab ? 'white' : '$color10'}
                      fontWeight={activeTab === tab ? '600' : '400'}
                    >
                      {tab === 'orders' ? '订单' : tab === 'profile' ? '个人' : tab === 'family' ? '家庭' : '会员'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>

            {/* 订单 Tab */}
            {activeTab === 'orders' && (
              <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$4" fontWeight="600" color="$color12">我的订单</Text>
                  <Pressable onPress={() => navigation.navigate('OrderList' as never)}>
                    <XStack gap="$0.5" alignItems="center">
                      <Text fontSize="$3" color="$primary" fontWeight="500">查看全部</Text>
                      <ChevronRight size={14} color={primaryColor} />
                    </XStack>
                  </Pressable>
                </XStack>

                {orders.length > 0 ? (
                  <YStack gap="$2">
                    {serviceOrders.length > 0 && (
                      <YStack gap="$1">
                        <Text fontSize="$3" fontWeight="500" color="$color10">服务订单</Text>
                        {serviceOrders.map(renderOrderCard)}
                      </YStack>
                    )}
                    {consultationOrders.length > 0 && (
                      <YStack gap="$1">
                        <Text fontSize="$3" fontWeight="500" color="$color10">咨询订单</Text>
                        {consultationOrders.map(renderOrderCard)}
                      </YStack>
                    )}
                    {productOrders.length > 0 && (
                      <YStack gap="$1">
                        <Text fontSize="$3" fontWeight="500" color="$color10">商品订单</Text>
                        {productOrders.map(renderOrderCard)}
                      </YStack>
                    )}
                  </YStack>
                ) : (
                  <View paddingVertical="$4" alignItems="center">
                    <Package size={48} color={theme.color10?.val} />
                    <Text fontSize="$3" color="$color10" marginTop="$2">暂无订单</Text>
                  </View>
                )}
              </YStack>
            )}

            {/* 个人 Tab */}
            {activeTab === 'profile' && (
              <YStack gap="$2">
                {/* 快捷操作 - 四按钮一行 */}
                <XStack gap="$2">
                  <Pressable style={{ flex: 1 }} onPress={() => console.log('账户设置')}>
                    <View
                      height={64}
                      backgroundColor="$color2"
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$color5"
                      justifyContent="center"
                      alignItems="center"
                      gap="$1"
                    >
                      <Settings size={20} color={primaryColor} />
                      <Text fontSize="$2" color="$color12">设置</Text>
                    </View>
                  </Pressable>
                  <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('ChatList' as never)}>
                    <View
                      height={64}
                      backgroundColor="$color2"
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$color5"
                      justifyContent="center"
                      alignItems="center"
                      gap="$1"
                    >
                      <MessageSquare size={20} color={primaryColor} />
                      <Text fontSize="$2" color="$color12">消息</Text>
                    </View>
                  </Pressable>
                  <Pressable style={{ flex: 1 }} onPress={() => console.log('隐私安全')}>
                    <View
                      height={64}
                      backgroundColor="$color2"
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$color5"
                      justifyContent="center"
                      alignItems="center"
                      gap="$1"
                    >
                      <Shield size={20} color={primaryColor} />
                      <Text fontSize="$2" color="$color12">安全</Text>
                    </View>
                  </Pressable>
                  <Pressable style={{ flex: 1 }} onPress={() => console.log('支付管理')}>
                    <View
                      height={64}
                      backgroundColor="$color2"
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$color5"
                      justifyContent="center"
                      alignItems="center"
                      gap="$1"
                    >
                      <CreditCard size={20} color={primaryColor} />
                      <Text fontSize="$2" color="$color12">支付</Text>
                    </View>
                  </Pressable>
                </XStack>

                {/* 达人身份 */}
                <View
                  padding="$2"
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$4" fontWeight="600" color="$color12">我的达人身份</Text>
                    {!expertProfile && (
                      <Pressable onPress={() => navigation.navigate('ExpertCertification' as never)}>
                        <View
                          backgroundColor={`${primaryColor}15`}
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$10"
                        >
                          <Text fontSize="$2" color="$primary" fontWeight="500">立即认证</Text>
                        </View>
                      </Pressable>
                    )}
                  </XStack>

                  {expertProfile ? (
                    // 已认证达人
                    <Pressable onPress={() => navigation.navigate('ExpertDashboard' as never)}>
                      <View
                        backgroundColor={`${successColor}10`}
                        borderRadius="$4"
                        padding="$2"
                        borderWidth={1}
                        borderColor={successColor}
                      >
                        <XStack gap="$2" alignItems="center">
                          <View
                            width={48}
                            height={48}
                            borderRadius={24}
                            backgroundColor={`${successColor}20`}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text fontSize={24}>{expertProfile.avatar || '👤'}</Text>
                          </View>
                          <YStack flex={1}>
                            <XStack gap="$1.5" alignItems="center">
                              <Text fontSize="$4" fontWeight="600" color="$color12">
                                {expertProfile.name}
                              </Text>
                              {expertProfile.certStatus === ExpertCertStatus.VERIFIED && (
                                <View
                                  backgroundColor={successColor}
                                  paddingHorizontal="$1.5"
                                  paddingVertical="$0.5"
                                  borderRadius="$2"
                                >
                                  <Text fontSize={10} color="white" fontWeight="500">已认证</Text>
                                </View>
                              )}
                            </XStack>
                            <Text fontSize="$2" color="$color10" marginTop="$0.5">
                              ⭐ {expertProfile.rating?.toFixed(1) || '5.0'} · 服务 {expertProfile.completedOrders || 0} 次
                            </Text>
                          </YStack>
                          <ChevronRight size={18} color={theme.color10?.val} />
                        </XStack>
                      </View>
                    </Pressable>
                  ) : (
                    // 未认证 - 引导认证
                    <Pressable onPress={() => navigation.navigate('ExpertCertification' as never)}>
                      <View
                        backgroundColor={`${warningColor}10`}
                        borderRadius="$4"
                        padding="$2"
                        borderWidth={1}
                        borderColor={warningColor}
                        borderStyle="dashed"
                      >
                        <YStack alignItems="center" gap="$1.5">
                          <View
                            width={48}
                            height={48}
                            borderRadius={24}
                            backgroundColor={`${warningColor}20`}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Award size={24} color={warningColor} />
                          </View>
                          <Text fontSize="$4" fontWeight="600" color="$color12">成为康养达人</Text>
                          <Text fontSize="$2" color="$color10" textAlign="center">
                            认证成为达人，开启接单赚钱之旅
                          </Text>
                          <XStack gap="$4" marginTop="$1">
                            <YStack alignItems="center">
                              <Text fontSize="$4">💰</Text>
                              <Text fontSize={10} color="$color10">灵活接单</Text>
                            </YStack>
                            <YStack alignItems="center">
                              <Text fontSize="$4">💯</Text>
                              <Text fontSize={10} color="$color10">收入可观</Text>
                            </YStack>
                            <YStack alignItems="center">
                              <Text fontSize="$4">🛡️</Text>
                              <Text fontSize={10} color="$color10">平台保障</Text>
                            </YStack>
                          </XStack>
                        </YStack>
                      </View>
                    </Pressable>
                  )}
                </View>

                {/* 我的成就 */}
                <View
                  padding="$2"
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <XStack gap="$1.5" alignItems="center" marginBottom="$2">
                    <Award size={18} color={primaryColor} />
                    <Text fontSize="$4" fontWeight="600" color="$color12">我的成就</Text>
                  </XStack>

                  <YStack gap="$2">
                    {achievements.map((achievement) => (
                      <View
                        key={achievement.id}
                        padding="$2"
                        borderRadius="$4"
                        backgroundColor={achievement.earned ? primaryColor : '$color2'}
                        borderWidth={achievement.earned ? 0 : 1}
                        borderColor="$color5"
                      >
                        <XStack gap="$2" alignItems="center">
                          <Text fontSize="$6">{achievement.icon}</Text>
                          <YStack flex={1}>
                            <XStack gap="$1.5" alignItems="center">
                              <Text
                                fontSize="$3"
                                fontWeight="600"
                                color={achievement.earned ? 'white' : '$color12'}
                              >
                                {achievement.title}
                              </Text>
                              {achievement.earned && (
                                <CheckCircle size={14} color="white" />
                              )}
                            </XStack>
                            <Text
                              fontSize="$2"
                              color={achievement.earned ? 'rgba(255,255,255,0.8)' : '$color10'}
                            >
                              {achievement.description}
                            </Text>
                          </YStack>
                          {!achievement.earned && achievement.progress !== undefined && (
                            <Text fontSize="$2" color="$color10">
                              {achievement.progress}/{achievement.target}
                            </Text>
                          )}
                        </XStack>
                        {!achievement.earned && achievement.progress !== undefined && (
                          <View
                            height={4}
                            backgroundColor="$color4"
                            borderRadius={2}
                            marginTop="$1.5"
                            overflow="hidden"
                          >
                            <View
                              height={4}
                              width={`${(achievement.progress / (achievement.target || 1)) * 100}%`}
                              backgroundColor={primaryColor}
                              borderRadius={2}
                            />
                          </View>
                        )}
                      </View>
                    ))}
                  </YStack>
                </View>
              </YStack>
            )}

            {/* 家庭 Tab */}
            {activeTab === 'family' && (
              <YStack gap="$2">
                {/* 添加成员入口 */}
                <View
                  padding="$2"
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
                    添加家庭成员
                  </Text>
                  <Text fontSize="$2" color="$color10" marginBottom="$2">
                    为家人创建健康档案，共同管理家庭健康
                  </Text>
                  <Pressable onPress={() => navigation.navigate('AddFamilyMember' as never)}>
                    <View
                      backgroundColor={primaryColor}
                      borderRadius="$10"
                      paddingVertical="$2"
                      alignItems="center"
                    >
                      <XStack gap="$1" alignItems="center">
                        <Plus size={16} color="white" />
                        <Text fontSize="$3" color="white" fontWeight="500">添加成员</Text>
                      </XStack>
                    </View>
                  </Pressable>
                </View>

                {/* 家庭成员列表 */}
                {familyMembers.length > 0 ? (
                  familyMembers.map((member) => {
                    const statusColor = member.healthProfile.healthStatus === 'excellent' ? successColor :
                      member.healthProfile.healthStatus === 'good' ? primaryColor : warningColor;
                    const statusText = member.healthProfile.healthStatus === 'excellent' ? '优秀' :
                      member.healthProfile.healthStatus === 'good' ? '良好' : '需关注';

                    return (
                      <View
                        key={member.id}
                        padding="$2"
                        backgroundColor="$color2"
                        borderRadius="$5"
                        borderWidth={1}
                        borderColor="$color5"
                      >
                        <XStack gap="$2" alignItems="center" marginBottom="$2">
                          <View
                            width={48}
                            height={48}
                            borderRadius={24}
                            backgroundColor={`${statusColor}20`}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text fontSize={24}>{member.avatar || '👤'}</Text>
                          </View>
                          <YStack flex={1}>
                            <XStack gap="$1.5" alignItems="center">
                              <Text fontSize="$4" fontWeight="600" color="$color12">{member.name}</Text>
                              <View
                                backgroundColor="$color4"
                                paddingHorizontal="$1.5"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize={10} color="$color10">{member.relationship}</Text>
                              </View>
                            </XStack>
                            <Text fontSize="$2" color="$color10">
                              {member.healthProfile.age}岁 · 健康评分 {member.healthProfile.healthScore}
                            </Text>
                          </YStack>
                          <View
                            backgroundColor={`${statusColor}15`}
                            paddingHorizontal="$1.5"
                            paddingVertical="$0.5"
                            borderRadius="$2"
                          >
                            <Text fontSize={10} color={statusColor} fontWeight="500">{statusText}</Text>
                          </View>
                        </XStack>

                        <XStack gap="$2">
                          <Pressable
                            style={{ flex: 1 }}
                            onPress={() => navigation.navigate('HealthTab' as never, { memberId: member.id } as never)}
                          >
                            <View
                              backgroundColor={primaryColor}
                              borderRadius="$10"
                              paddingVertical="$2"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color="white" fontWeight="500">查看健康数据</Text>
                            </View>
                          </Pressable>
                          {member.relationship !== '本人' && (
                            <Pressable onPress={() => handleDeleteMember(member.id, member.name)}>
                              <View
                                borderWidth={1}
                                borderColor={errorColor}
                                borderRadius="$10"
                                paddingVertical="$2"
                                paddingHorizontal="$3"
                                alignItems="center"
                              >
                                <Text fontSize="$3" color={errorColor}>删除</Text>
                              </View>
                            </Pressable>
                          )}
                        </XStack>
                      </View>
                    );
                  })
                ) : (
                  <View paddingVertical="$4" alignItems="center">
                    <Users size={48} color={theme.color10?.val} />
                    <Text fontSize="$3" color="$color10" marginTop="$2">暂无家庭成员</Text>
                  </View>
                )}
              </YStack>
            )}

            {/* 会员 Tab */}
            {activeTab === 'membership' && (
              <YStack gap="$2">
                {/* 当前会员状态 */}
                <View borderRadius="$5" overflow="hidden">
                  <LinearGradient
                    colors={levelColors.gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 16 }}
                  >
                    <XStack gap="$2" alignItems="center" marginBottom="$2">
                      <Crown size={28} color="white" />
                      <YStack flex={1}>
                        <Text fontSize="$5" fontWeight="700" color="white">
                          {MEMBERSHIP_LEVEL_LABELS[membershipLevel]}
                        </Text>
                        {membershipExpiry && membershipLevel !== MembershipLevel.FREE && (
                          <Text fontSize="$2" color="rgba(255,255,255,0.8)">
                            到期时间：{membershipExpiry}
                          </Text>
                        )}
                      </YStack>
                      <Pressable onPress={() => navigation.navigate('MembershipCenter' as never)}>
                        <View
                          backgroundColor="rgba(255,255,255,0.25)"
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$10"
                        >
                          <Text fontSize="$3" color="white" fontWeight="500">
                            {membershipLevel === MembershipLevel.FREE ? '立即开通' : '续费升级'}
                          </Text>
                        </View>
                      </Pressable>
                    </XStack>

                    <View
                      backgroundColor="rgba(255,255,255,0.15)"
                      borderRadius="$3"
                      padding="$2"
                    >
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$3" color="rgba(255,255,255,0.9)">当前积分</Text>
                        <Text fontSize="$4" fontWeight="700" color="white">{points}</Text>
                      </XStack>
                    </View>
                  </LinearGradient>
                </View>

                {/* 会员等级对比 */}
                <View
                  padding="$2"
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                    会员等级
                  </Text>

                  <YStack gap="$2">
                    {[MembershipLevel.FREE, MembershipLevel.GOLD, MembershipLevel.PLATINUM, MembershipLevel.DIAMOND].map((level) => {
                      const colors = MEMBERSHIP_LEVEL_COLORS[level];
                      const prices = MEMBERSHIP_PRICES[level];
                      const isCurrent = level === membershipLevel;

                      return (
                        <View
                          key={level}
                          padding="$2"
                          borderRadius="$4"
                          backgroundColor={isCurrent ? colors.primary : '$color2'}
                          borderWidth={isCurrent ? 0 : 1}
                          borderColor="$color5"
                        >
                          <XStack justifyContent="space-between" alignItems="center">
                            <XStack gap="$2" alignItems="center">
                              <Crown size={18} color={isCurrent ? 'white' : colors.primary} />
                              <YStack>
                                <Text
                                  fontSize="$3"
                                  fontWeight="600"
                                  color={isCurrent ? 'white' : '$color12'}
                                >
                                  {MEMBERSHIP_LEVEL_LABELS[level]}
                                </Text>
                                <Text
                                  fontSize="$2"
                                  color={isCurrent ? 'rgba(255,255,255,0.8)' : '$color10'}
                                >
                                  {prices.yearly > 0 ? `¥${prices.yearly}/年` : '免费'}
                                </Text>
                              </YStack>
                            </XStack>
                            {isCurrent ? (
                              <View
                                backgroundColor="rgba(255,255,255,0.25)"
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius="$10"
                              >
                                <Text fontSize="$2" color="white" fontWeight="500">当前等级</Text>
                              </View>
                            ) : (
                              <Pressable onPress={() => navigation.navigate('MembershipCenter' as never)}>
                                <View
                                  backgroundColor={`${colors.primary}15`}
                                  paddingHorizontal="$2"
                                  paddingVertical="$1"
                                  borderRadius="$10"
                                >
                                  <Text fontSize="$2" color={colors.primary} fontWeight="500">
                                    {prices.yearly > 0 ? '立即开通' : '免费'}
                                  </Text>
                                </View>
                              </Pressable>
                            )}
                          </XStack>
                        </View>
                      );
                    })}
                  </YStack>
                </View>

                {/* 会员权益 */}
                <View
                  padding="$2"
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                    会员权益
                  </Text>

                  <YStack gap="$1.5">
                    {[
                      { icon: Target, title: 'AI问答', desc: membershipLevel === MembershipLevel.FREE ? '5次/日' : '无限次' },
                      { icon: Zap, title: '设备绑定', desc: membershipLevel === MembershipLevel.FREE ? '2个' : '无限制' },
                      { icon: Star, title: '积分倍率', desc: membershipLevel === MembershipLevel.FREE ? '1x' : membershipLevel === MembershipLevel.GOLD ? '1.5x' : membershipLevel === MembershipLevel.PLATINUM ? '2x' : '3x' },
                      { icon: Gift, title: '专属服务折扣', desc: membershipLevel === MembershipLevel.FREE ? '无' : membershipLevel === MembershipLevel.GOLD ? '5%' : membershipLevel === MembershipLevel.PLATINUM ? '10%' : '20%' },
                    ].map((benefit, index) => (
                      <XStack
                        key={index}
                        padding="$2"
                        backgroundColor="$color4"
                        borderRadius="$3"
                        alignItems="center"
                        gap="$2"
                      >
                        <benefit.icon size={18} color={primaryColor} />
                        <Text fontSize="$3" color="$color12" flex={1}>{benefit.title}</Text>
                        <Text fontSize="$3" color="$primary" fontWeight="600">{benefit.desc}</Text>
                      </XStack>
                    ))}
                  </YStack>
                </View>
              </YStack>
            )}
          </View>

          {/* 底部间距 */}
          <View height={20} />
        </YStack>
      </ScrollView>

      {/* 删除确认弹窗 */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowDeleteConfirm(false)}
        >
          <Pressable
            style={{ width: '80%', maxWidth: 400 }}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              backgroundColor="$background"
              borderRadius="$5"
              padding="$2.5"
            >
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="700" color={errorColor} textAlign="center">
                  确认删除
                </Text>
                <Text fontSize="$4" color="$color12" textAlign="center">
                  确定要删除家庭成员"{memberToDelete?.name}"吗？
                </Text>
                <Text fontSize="$3" color="$color10" textAlign="center">
                  删除后相关健康数据也将被清除
                </Text>

                <XStack gap="$2" marginTop="$2">
                  <Pressable style={{ flex: 1 }} onPress={() => setShowDeleteConfirm(false)}>
                    <View
                      height={44}
                      borderRadius="$10"
                      backgroundColor="$color4"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="$color10" fontWeight="500">取消</Text>
                    </View>
                  </Pressable>
                  <Pressable style={{ flex: 1 }} onPress={confirmDeleteMember}>
                    <View
                      height={44}
                      borderRadius="$10"
                      backgroundColor={errorColor}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="white" fontWeight="500">删除</Text>
                    </View>
                  </Pressable>
                </XStack>
              </YStack>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      </SafeAreaView>
    </LinearGradient>
  </View>
);
};
