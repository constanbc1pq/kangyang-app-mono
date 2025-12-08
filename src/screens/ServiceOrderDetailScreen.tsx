import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  H3,
} from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { TitleBar } from '@/components/TitleBar';
import { OrderStatus } from '@/types/community';
import {
  getOrderById,
  updateOrderStatus,
  updateOrder,
} from '@/services/communityDataService';

// 服务订单接口（使用本地定义以保持向后兼容）
interface ServiceOrder {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  employerId: string;
  employerName: string;
  employerAvatar: string;
  employerPhone: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  expertPhone: string;
  expertLevel: string;
  status: OrderStatus;
  price: number;
  serviceTime: string;
  duration: string;
  address: string;
  district: string;
  requirements?: string[];
  healthTags?: string[];
  checkInTime?: Date;
  checkInPhotos?: string[];
  checkOutTime?: Date;
  checkOutPhotos?: string[];
  serviceNotes?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceOrderDetailScreenProps {
  navigation: any;
  route: {
    params: {
      orderId: string;
    };
  };
}

/**
 * 服务订单详情页
 * 展示订单信息、状态流转、签到签退、评价等功能
 */
export const ServiceOrderDetailScreen: React.FC<ServiceOrderDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // 当前用户角色（雇主或达人）
  const currentUserId = 'user_current';
  const isEmployer = order?.employerId === currentUserId;
  const isExpert = order?.expertId === currentUserId;

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);

      // 从本地存储加载订单数据
      const orderData = await getOrderById(orderId);

      if (orderData) {
        // 转换为本地接口格式
        const localOrder: ServiceOrder = {
          id: orderData.id,
          jobId: orderData.jobId,
          jobTitle: orderData.serviceTitle,
          jobDescription: orderData.serviceDescription,
          employerId: orderData.employerId,
          employerName: orderData.employerName,
          employerAvatar: orderData.employerAvatar || '👤',
          employerPhone: '138****1234', // TODO: 从用户数据获取
          expertId: orderData.expertId,
          expertName: orderData.expertName,
          expertAvatar: orderData.expertAvatar || '👨‍⚕️',
          expertPhone: '139****5678', // TODO: 从达人数据获取
          expertLevel: '金牌达人', // TODO: 从达人数据获取
          status: orderData.status,
          price: orderData.finalPrice,
          serviceTime: orderData.scheduledTime,
          duration: orderData.duration,
          address: orderData.location.address,
          district: orderData.location.address.split(' ')[0] || '', // 简单提取区域
          checkInTime: orderData.checkInTime ? new Date(orderData.checkInTime) : undefined,
          checkInPhotos: orderData.checkInPhotos,
          checkOutTime: orderData.checkOutTime ? new Date(orderData.checkOutTime) : undefined,
          checkOutPhotos: orderData.checkOutPhotos,
          serviceNotes: orderData.serviceNotes,
          rating: orderData.employerReview?.rating,
          review: orderData.employerReview?.comment,
          createdAt: new Date(orderData.createdAt),
          updatedAt: new Date(orderData.updatedAt),
        };

        setOrder(localOrder);
      } else {
        Alert.alert('错误', '订单不存在');
        navigation.goBack();
      }
    } catch (error) {
      console.error('加载订单详情失败:', error);
      Alert.alert('错误', '加载订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContactOther = () => {
    // 打开聊天窗口
    if (order) {
      // TODO: 创建或打开会话
      Alert.alert('提示', '聊天功能开发中...');
    }
  };

  const handleCall = (phone: string) => {
    Alert.alert('拨打电话', `是否拨打 ${phone}？`, [
      { text: '取消', style: 'cancel' },
      { text: '拨打', onPress: () => console.log('拨打电话:', phone) },
    ]);
  };

  // 达人签到
  const handleCheckIn = async () => {
    if (!order) return;

    Alert.alert('开始服务', '确认已到达服务地点，开始提供服务？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: async () => {
          try {
            const now = new Date().toISOString();
            const updatedOrder = await updateOrder(order.id, {
              status: OrderStatus.IN_SERVICE,
              checkInTime: now,
            });

            if (updatedOrder) {
              setOrder(prev => prev ? {
                ...prev,
                status: OrderStatus.IN_SERVICE,
                checkInTime: new Date(now),
              } : null);
              Alert.alert('成功', '已签到，开始服务');
            } else {
              Alert.alert('失败', '签到失败，请稍后重试');
            }
          } catch (error) {
            console.error('签到失败:', error);
            Alert.alert('失败', '签到失败，请稍后重试');
          }
        },
      },
    ]);
  };

  // 达人签退
  const handleCheckOut = async () => {
    if (!order) return;

    Alert.alert('结束服务', '确认服务已完成，准备签退？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: async () => {
          try {
            const now = new Date().toISOString();
            const updatedOrder = await updateOrder(order.id, {
              status: OrderStatus.PENDING_CONFIRM,
              checkOutTime: now,
            });

            if (updatedOrder) {
              setOrder(prev => prev ? {
                ...prev,
                status: OrderStatus.PENDING_CONFIRM,
                checkOutTime: new Date(now),
              } : null);
              Alert.alert('成功', '已签退，等待雇主验收');
            } else {
              Alert.alert('失败', '签退失败，请稍后重试');
            }
          } catch (error) {
            console.error('签退失败:', error);
            Alert.alert('失败', '签退失败，请稍后重试');
          }
        },
      },
    ]);
  };

  // 雇主确认完成
  const handleConfirmComplete = async () => {
    if (!order) return;

    Alert.alert('确认完成', '确认服务已完成？完成后将进入评价环节', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: async () => {
          try {
            const updatedOrder = await updateOrderStatus(order.id, OrderStatus.COMPLETED);

            if (updatedOrder) {
              setOrder(prev => prev ? {
                ...prev,
                status: OrderStatus.COMPLETED,
              } : null);

              // 跳转到评价页面
              navigation.navigate('ServiceReview', {
                orderId: order.id,
                expertId: order.expertId,
                expertName: order.expertName,
                expertAvatar: order.expertAvatar,
                serviceTitle: order.jobTitle,
              });
            } else {
              Alert.alert('失败', '操作失败，请稍后重试');
            }
          } catch (error) {
            console.error('确认完成失败:', error);
            Alert.alert('失败', '操作失败，请稍后重试');
          }
        },
      },
    ]);
  };

  // 取消订单
  const handleCancelOrder = async () => {
    if (!order) return;

    Alert.alert('取消订单', '确定要取消此订单吗？', [
      { text: '我再想想', style: 'cancel' },
      {
        text: '确认取消',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedOrder = await updateOrderStatus(order.id, OrderStatus.CANCELLED);

            if (updatedOrder) {
              setOrder(prev => prev ? {
                ...prev,
                status: OrderStatus.CANCELLED,
              } : null);
              Alert.alert('成功', '订单已取消');
            } else {
              Alert.alert('失败', '取消失败，请稍后重试');
            }
          } catch (error) {
            console.error('取消订单失败:', error);
            Alert.alert('失败', '取消失败，请稍后重试');
          }
        },
      },
    ]);
  };

  // 支付订单
  const handlePayOrder = async () => {
    if (!order) return;

    Alert.alert('支付订单', `确认支付 ¥${order.price}？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '确认支付',
        onPress: async () => {
          try {
            // TODO: 调用实际支付接口
            const updatedOrder = await updateOrderStatus(order.id, OrderStatus.PENDING_SERVICE);

            if (updatedOrder) {
              setOrder(prev => prev ? {
                ...prev,
                status: OrderStatus.PENDING_SERVICE,
              } : null);
              Alert.alert('支付成功', '订单已支付，等待达人服务');
            } else {
              Alert.alert('支付失败', '请稍后重试');
            }
          } catch (error) {
            console.error('支付失败:', error);
            Alert.alert('支付失败', '请稍后重试');
          }
        },
      },
    ]);
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
        return COLORS.success;
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return COLORS.textSecondary;
      default:
        return COLORS.text;
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING_PAYMENT]: '待支付',
      [OrderStatus.PENDING_SERVICE]: '待服务',
      [OrderStatus.IN_SERVICE]: '服务中',
      [OrderStatus.PENDING_CONFIRM]: '待验收',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELLED]: '已取消',
      [OrderStatus.REFUNDED]: '已退款',
    };
    return statusMap[status] || '未知状态';
  };

  if (loading || !order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TitleBar title="订单详情" onBack={handleBack} />

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <View padding="$4">
          {/* 订单状态卡片 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <XStack space="$3" alignItems="center">
              {order.status === OrderStatus.IN_SERVICE ? (
                <Clock size={32} color={getStatusColor(order.status)} />
              ) : order.status === OrderStatus.COMPLETED ? (
                <CheckCircle size={32} color={getStatusColor(order.status)} />
              ) : (
                <AlertCircle size={32} color={getStatusColor(order.status)} />
              )}
              <YStack flex={1}>
                <Text fontSize="$6" fontWeight="bold" color={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Text>
                {order.status === OrderStatus.IN_SERVICE && order.checkInTime && (
                  <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                    服务开始于 {order.checkInTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}
                {order.status === OrderStatus.PENDING_CONFIRM && (
                  <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                    等待雇主确认服务完成
                  </Text>
                )}
              </YStack>
            </XStack>
          </Card>

          {/* 服务信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              服务信息
            </H3>

            <YStack space="$3">
              <View>
                <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                  {order.jobTitle}
                </Text>
                <Text fontSize="$3" color="$textSecondary" lineHeight={20}>
                  {order.jobDescription}
                </Text>
              </View>

              <XStack space="$2" alignItems="center">
                <Clock size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  {order.serviceTime} · {order.duration}
                </Text>
              </XStack>

              <XStack space="$2" alignItems="flex-start">
                <MapPin size={16} color={COLORS.textSecondary} style={{ marginTop: 2 }} />
                <Text fontSize="$3" color="$text" flex={1}>
                  {order.address}
                </Text>
              </XStack>

              {order.requirements && order.requirements.length > 0 && (
                <View>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                    特殊要求
                  </Text>
                  <XStack flexWrap="wrap" gap="$2">
                    {order.requirements.map((req, index) => (
                      <View
                        key={index}
                        backgroundColor={`${COLORS.primary}20`}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text fontSize="$2" color={COLORS.primary}>
                          {req}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}

              {order.healthTags && order.healthTags.length > 0 && (
                <View>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                    健康标签
                  </Text>
                  <XStack flexWrap="wrap" gap="$2">
                    {order.healthTags.map((tag, index) => (
                      <View
                        key={index}
                        backgroundColor={`${COLORS.warning}20`}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text fontSize="$2" color={COLORS.warning}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}
            </YStack>
          </Card>

          {/* 对方信息（雇主看达人，达人看雇主） */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              {isEmployer ? '达人信息' : '雇主信息'}
            </H3>

            <XStack space="$3" alignItems="center" marginBottom="$3">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$background"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={32}>
                  {isEmployer ? order.expertAvatar : order.employerAvatar}
                </Text>
              </View>

              <YStack flex={1}>
                <XStack space="$2" alignItems="center">
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {isEmployer ? order.expertName : order.employerName}
                  </Text>
                  {isEmployer && (
                    <View
                      backgroundColor={`${COLORS.warning}20`}
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize="$1" color={COLORS.warning} fontWeight="600">
                        {order.expertLevel}
                      </Text>
                    </View>
                  )}
                </XStack>
                <Text fontSize="$3" color="$textSecondary">
                  {isEmployer ? order.expertPhone : order.employerPhone}
                </Text>
              </YStack>
            </XStack>

            <XStack space="$2">
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleCall(isEmployer ? order.expertPhone : order.employerPhone)}
              >
                <View
                  flex={1}
                  backgroundColor="$background"
                  borderRadius="$3"
                  paddingVertical="$2"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <XStack space="$1" justifyContent="center" alignItems="center">
                    <Phone size={16} color={COLORS.text} />
                    <Text fontSize="$3" color="$text">
                      电话
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={handleContactOther}>
                <View
                  flex={1}
                  backgroundColor={COLORS.primary}
                  borderRadius="$3"
                  paddingVertical="$2"
                >
                  <XStack space="$1" justifyContent="center" alignItems="center">
                    <MessageCircle size={16} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="600">
                      聊天
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            </XStack>
          </Card>

          {/* 费用信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              费用信息
            </H3>

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" color="$text">
                服务费用
              </Text>
              <XStack space="$1" alignItems="baseline">
                <Text fontSize="$6" fontWeight="bold" color={COLORS.error}>
                  ¥{order.price}
                </Text>
              </XStack>
            </XStack>
          </Card>

          {/* 订单信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              订单信息
            </H3>

            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  订单编号
                </Text>
                <Text fontSize="$3" color="$text">
                  {order.id}
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  创建时间
                </Text>
                <Text fontSize="$3" color="$text">
                  {order.createdAt.toLocaleString('zh-CN')}
                </Text>
              </XStack>

              {order.checkInTime && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    签到时间
                  </Text>
                  <Text fontSize="$3" color="$text">
                    {order.checkInTime.toLocaleString('zh-CN')}
                  </Text>
                </XStack>
              )}

              {order.checkOutTime && (
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    签退时间
                  </Text>
                  <Text fontSize="$3" color="$text">
                    {order.checkOutTime.toLocaleString('zh-CN')}
                  </Text>
                </XStack>
              )}
            </YStack>
          </Card>

          {/* 底部padding */}
          <View height={20} />
        </View>
      </ScrollView>

      {/* 底部操作按钮 */}
      {order.status !== OrderStatus.CANCELLED &&
        order.status !== OrderStatus.COMPLETED && (
        <View
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
          <XStack space="$2">
            {/* 达人操作按钮 */}
            {isExpert && (
              <>
                {order.status === OrderStatus.PENDING_SERVICE && (
                  <TouchableOpacity style={{ flex: 1 }} onPress={handleCheckIn}>
                    <View
                      flex={1}
                      backgroundColor={COLORS.primary}
                      borderRadius="$3"
                      paddingVertical="$3"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="white" fontWeight="600">
                        开始服务
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {order.status === OrderStatus.IN_SERVICE && (
                  <TouchableOpacity style={{ flex: 1 }} onPress={handleCheckOut}>
                    <View
                      flex={1}
                      backgroundColor={COLORS.success}
                      borderRadius="$3"
                      paddingVertical="$3"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="white" fontWeight="600">
                        完成服务
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* 雇主操作按钮 */}
            {isEmployer && (
              <>
                {order.status === OrderStatus.PENDING_PAYMENT && (
                  <>
                    <TouchableOpacity style={{ flex: 1 }} onPress={handleCancelOrder}>
                      <View
                        flex={1}
                        backgroundColor="$background"
                        borderRadius="$3"
                        paddingVertical="$3"
                        borderWidth={1}
                        borderColor="$borderColor"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color="$text">
                          取消订单
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={handlePayOrder}>
                      <View
                        flex={1}
                        backgroundColor={COLORS.primary}
                        borderRadius="$3"
                        paddingVertical="$3"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <XStack space="$1" alignItems="center">
                          <DollarSign size={20} color="white" />
                          <Text fontSize="$4" color="white" fontWeight="600">
                            立即支付
                          </Text>
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  </>
                )}

                {order.status === OrderStatus.PENDING_CONFIRM && (
                  <TouchableOpacity style={{ flex: 1 }} onPress={handleConfirmComplete}>
                    <View
                      flex={1}
                      backgroundColor={COLORS.success}
                      borderRadius="$3"
                      paddingVertical="$3"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="white" fontWeight="600">
                        确认完成
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {order.status === OrderStatus.PENDING_SERVICE && (
                  <TouchableOpacity style={{ flex: 1 }} onPress={handleCancelOrder}>
                    <View
                      flex={1}
                      backgroundColor="$background"
                      borderRadius="$3"
                      paddingVertical="$3"
                      borderWidth={1}
                      borderColor="$borderColor"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="$text">
                        取消订单
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}
          </XStack>
        </View>
      )}
    </SafeAreaView>
  );
};
