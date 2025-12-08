/**
 * 全局订单服务
 * 管理订单创建、查询、更新、取消等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus, OrderItem, DeliveryAddress, PaymentMethod } from '@/types/commerce';
import { CartItem } from '@/types/commerce';
import { MembershipLevel, MembershipPurchaseRecord } from '@/types/membership';
import { getUserData, saveUserData } from './userDataService';

const ORDERS_STORAGE_KEY = '@kangyang_orders';

/**
 * 订单列表数据结构
 */
interface OrderList {
  orders: Order[];
  lastModified: string;
}

/**
 * 初始化空订单列表
 */
const initializeEmptyOrderList = (): OrderList => {
  return {
    orders: [],
    lastModified: new Date().toISOString(),
  };
};

/**
 * 清除所有订单数据（开发调试用）
 */
export const clearAllOrders = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
    console.log('✅ 已清除所有订单数据');
    return true;
  } catch (error) {
    console.error('❌ 清除订单数据失败:', error);
    return false;
  }
};

/**
 * 获取订单列表
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);

    if (jsonValue !== null) {
      const orderList: OrderList = JSON.parse(jsonValue);

      // 过滤掉旧版本的订单（没有itemType字段）
      const validOrders = orderList.orders.filter(order => {
        if (!order.itemType || !order.itemName) {
          console.warn('⚠️ 发现旧版本订单，已自动过滤:', order.id);
          return false;
        }
        return true;
      });

      // 按创建时间倒序排列
      return validOrders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      return [];
    }
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return [];
  }
};

/**
 * 保存订单列表
 */
const saveOrderList = async (orders: Order[]): Promise<boolean> => {
  try {
    const orderList: OrderList = {
      orders,
      lastModified: new Date().toISOString(),
    };
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orderList));
    return true;
  } catch (error) {
    console.error('保存订单列表失败:', error);
    return false;
  }
};

/**
 * 创建订单（从购物车商品）
 */
export const createOrder = async (params: {
  userId: string;
  cartItems: CartItem[];
  deliveryAddress: DeliveryAddress;
  deliveryNotes?: string;
  couponAmount?: number;
  deliveryFee?: number;
}): Promise<Order | null> => {
  try {
    const {
      userId,
      cartItems,
      deliveryAddress,
      deliveryNotes,
      couponAmount = 0,
      deliveryFee = 0,
    } = params;

    const now = new Date().toISOString();

    // 转换购物车商品为订单商品
    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: `order_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemType: item.itemType,
      itemId: item.itemId,
      itemName: item.itemName,
      itemImage: item.itemImage,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      subtotal: item.price * item.quantity * (item.cycleDiscount || 1),
      cycle: item.cycle,
      deliveryTimeSlots: item.deliveryTimeSlots,
      serviceDate: item.serviceDate,
      serviceTime: item.serviceTime,
      providerId: item.providerId,
      providerName: item.providerName,
      metadata: item.metadata,
    }));

    // 计算金额
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = cartItems.reduce((sum, item) => {
      if (item.cycleDiscount) {
        return sum + (item.price * item.quantity * (1 - item.cycleDiscount));
      }
      return sum;
    }, 0);
    const totalAmount = subtotal - couponAmount + deliveryFee;

    // 生成订单号（格式：年月日时分秒+随机数）
    const orderId = `KY${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${Date.now().toString().slice(-6)}`;

    // 获取订单类型和名称（取第一个商品）
    const firstItem = orderItems[0];
    const orderItemType = firstItem.itemType;
    const orderItemName = firstItem.itemName;

    const newOrder: Order = {
      id: orderId,
      userId,
      itemType: orderItemType,
      itemName: orderItemName,
      items: orderItems,
      subtotal,
      discountAmount,
      couponAmount,
      deliveryFee,
      totalAmount,
      deliveryAddress,
      deliveryNotes,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: '订单已创建，等待支付',
        },
      ],
      isReviewed: false,
      canCancel: true,
      canRefund: false,
      createdAt: now,
      updatedAt: now,
    };

    // 保存订单
    const orders = await getOrders();
    orders.unshift(newOrder); // 添加到列表开头
    const success = await saveOrderList(orders);

    if (success) {
      console.log(`✅ 订单创建成功: ${orderId}`);
      return newOrder;
    } else {
      return null;
    }
  } catch (error) {
    console.error('创建订单失败:', error);
    return null;
  }
};

/**
 * 获取订单详情
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orders = await getOrders();
    return orders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return null;
  }
};

/**
 * 更新订单状态
 */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  note?: string
): Promise<boolean> => {
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return false;
    }

    const now = new Date().toISOString();
    orders[orderIndex].status = newStatus;
    orders[orderIndex].statusHistory.push({
      status: newStatus,
      timestamp: now,
      note,
    });
    orders[orderIndex].updatedAt = now;

    // 更新特定状态的字段
    if (newStatus === 'paid') {
      orders[orderIndex].paymentTime = now;
      orders[orderIndex].canCancel = false;
      orders[orderIndex].canRefund = true;
    } else if (newStatus === 'delivered') {
      orders[orderIndex].deliveredTime = now;
    } else if (newStatus === 'completed') {
      orders[orderIndex].canRefund = false;
    } else if (newStatus === 'cancelled') {
      orders[orderIndex].canCancel = false;
      orders[orderIndex].canRefund = false;
    }

    return await saveOrderList(orders);
  } catch (error) {
    console.error('更新订单状态失败:', error);
    return false;
  }
};

/**
 * 支付订单
 */
export const payOrder = async (
  orderId: string,
  paymentMethod: PaymentMethod,
  transactionId?: string
): Promise<boolean> => {
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1 || orders[orderIndex].status !== 'pending') {
      return false;
    }

    const order = orders[orderIndex];
    const now = new Date().toISOString();
    orders[orderIndex].paymentMethod = paymentMethod;
    orders[orderIndex].paymentTime = now;
    orders[orderIndex].transactionId = transactionId;

    // 更新状态为已支付
    const statusUpdated = await updateOrderStatus(orderId, 'paid', '支付成功');

    // 如果是会员订单，更新用户会员信息
    if (statusUpdated && order.itemType === 'membership') {
      await handleMembershipPurchase(order, paymentMethod, transactionId);
    }

    return statusUpdated;
  } catch (error) {
    console.error('支付订单失败:', error);
    return false;
  }
};

/**
 * 获取会员等级数值（用于比较）
 */
const getMembershipLevelValue = (level: MembershipLevel): number => {
  const levels = [MembershipLevel.FREE, MembershipLevel.GOLD, MembershipLevel.PLATINUM, MembershipLevel.DIAMOND];
  return levels.indexOf(level);
};

/**
 * 处理会员购买 - 更新用户会员等级
 * 支持四种场景：
 * 1. new - 新开通（免费用户或会员已过期）
 * 2. renew - 续费（同等级）
 * 3. upgrade - 升级（立即生效）
 * 4. downgrade - 降级预约（当前会员到期后生效）
 */
const handleMembershipPurchase = async (
  order: Order,
  paymentMethod: PaymentMethod,
  transactionId?: string
): Promise<void> => {
  try {
    const userData = await getUserData();
    const now = new Date();
    const nowISO = now.toISOString();

    // 从订单元数据中获取会员等级和购买类型
    const metadata = order.metadata || order.items[0]?.metadata || {};
    const targetLevel = metadata.membershipLevel as MembershipLevel;
    const purchaseType = metadata.purchaseType as 'new' | 'renew' | 'upgrade' | 'downgrade' | undefined;
    const cycle = (metadata.cycle as 'monthly' | 'quarterly' | 'yearly') || 'yearly';

    if (!targetLevel) {
      console.warn('订单中未找到会员等级信息');
      return;
    }

    // 计算周期天数
    const cycleDays = cycle === 'yearly' ? 365 : cycle === 'quarterly' ? 90 : 30;

    // 判断购买类型（如果订单中没有指定）
    let actualPurchaseType = purchaseType;
    if (!actualPurchaseType) {
      const currentLevel = userData.membership.level;
      const currentEndDate = userData.membership.endDate ? new Date(userData.membership.endDate) : null;
      const isExpired = !currentEndDate || currentEndDate <= now;

      if (currentLevel === MembershipLevel.FREE || isExpired) {
        actualPurchaseType = 'new';
      } else {
        const currentLevelValue = getMembershipLevelValue(currentLevel);
        const targetLevelValue = getMembershipLevelValue(targetLevel);
        if (targetLevelValue === currentLevelValue) {
          actualPurchaseType = 'renew';
        } else if (targetLevelValue > currentLevelValue) {
          actualPurchaseType = 'upgrade';
        } else {
          actualPurchaseType = 'downgrade';
        }
      }
    }

    // 计算新的到期时间
    let newStartDate: Date;
    let newEndDate: Date;

    switch (actualPurchaseType) {
      case 'new':
      case 'upgrade':
        // 新开通或升级：从现在开始
        newStartDate = now;
        newEndDate = new Date(now.getTime() + cycleDays * 24 * 60 * 60 * 1000);
        break;

      case 'renew':
        // 续费：从当前到期时间延长
        const currentEndDate = userData.membership.endDate ? new Date(userData.membership.endDate) : now;
        const baseDate = currentEndDate > now ? currentEndDate : now;
        newStartDate = userData.membership.startDate ? new Date(userData.membership.startDate) : now;
        newEndDate = new Date(baseDate.getTime() + cycleDays * 24 * 60 * 60 * 1000);
        break;

      case 'downgrade':
        // 降级预约：记录预约信息，当前会员到期后生效
        // 存储预约信息到 pendingMembership
        userData.membership.pendingMembership = {
          level: targetLevel,
          cycle: cycle,
          startDate: userData.membership.endDate || nowISO,
          endDate: new Date(
            (userData.membership.endDate ? new Date(userData.membership.endDate) : now).getTime() +
            cycleDays * 24 * 60 * 60 * 1000
          ).toISOString(),
          purchaseDate: nowISO,
          orderId: order.id,
        };

        // 创建购买记录
        const downgradeRecord: MembershipPurchaseRecord = {
          id: `purchase_${Date.now()}`,
          date: nowISO,
          type: 'renewal', // 预约续费记为 renewal
          fromLevel: userData.membership.level,
          toLevel: targetLevel,
          cycle: cycle,
          amount: order.totalAmount,
          paymentMethod: paymentMethod,
          transactionId: transactionId,
        };
        userData.membership.purchaseHistory = [downgradeRecord, ...userData.membership.purchaseHistory];

        await saveUserData(userData);
        console.log(`✅ 会员降级预约成功: ${targetLevel}，将在 ${userData.membership.endDate} 后生效`);
        return;

      default:
        newStartDate = now;
        newEndDate = new Date(now.getTime() + cycleDays * 24 * 60 * 60 * 1000);
    }

    // 保存原会员信息（用于升级时保留）
    const oldLevel = userData.membership.level;
    const oldEndDate = userData.membership.endDate ? new Date(userData.membership.endDate) : null;

    // 创建购买记录
    const purchaseRecord: MembershipPurchaseRecord = {
      id: `purchase_${Date.now()}`,
      date: nowISO,
      type: actualPurchaseType === 'new' ? 'purchase' : actualPurchaseType === 'upgrade' ? 'upgrade' : 'renewal',
      fromLevel: oldLevel !== MembershipLevel.FREE ? oldLevel : undefined,
      toLevel: targetLevel,
      cycle: cycle,
      amount: order.totalAmount,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
    };

    // 更新用户会员信息
    userData.membership = {
      ...userData.membership,
      level: targetLevel,
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString(),
      paymentCycle: cycle,
      purchaseHistory: [purchaseRecord, ...userData.membership.purchaseHistory],
    };

    // 如果是升级，保存原会员的剩余时间（高级会员到期后切换回）
    if (actualPurchaseType === 'upgrade' && oldLevel !== MembershipLevel.FREE) {
      if (oldEndDate && oldEndDate > now) {
        userData.membership.previousMembership = {
          level: oldLevel,
          endDate: oldEndDate.toISOString(),
        };
      }
    }

    await saveUserData(userData);
    console.log(`✅ 会员${actualPurchaseType === 'new' ? '开通' : actualPurchaseType === 'upgrade' ? '升级' : '续费'}成功: ${targetLevel}，有效期至 ${newEndDate.toISOString()}`);
  } catch (error) {
    console.error('处理会员购买失败:', error);
  }
};

/**
 * 取消订单
 */
export const cancelOrder = async (orderId: string, reason?: string): Promise<boolean> => {
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1 || !orders[orderIndex].canCancel) {
      return false;
    }

    return await updateOrderStatus(orderId, 'cancelled', reason || '用户取消订单');
  } catch (error) {
    console.error('取消订单失败:', error);
    return false;
  }
};

/**
 * 申请退款
 */
export const requestRefund = async (
  orderId: string,
  refundAmount: number,
  reason: string
): Promise<boolean> => {
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1 || !orders[orderIndex].canRefund) {
      return false;
    }

    const now = new Date().toISOString();
    orders[orderIndex].refundAmount = refundAmount;
    orders[orderIndex].refundReason = reason;
    orders[orderIndex].refundTime = now;

    return await updateOrderStatus(orderId, 'refunded', `退款申请：${reason}`);
  } catch (error) {
    console.error('申请退款失败:', error);
    return false;
  }
};

/**
 * 更新物流信息
 */
export const updateDeliveryInfo = async (
  orderId: string,
  trackingNumber: string,
  deliveryTime?: string
): Promise<boolean> => {
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return false;
    }

    orders[orderIndex].trackingNumber = trackingNumber;
    if (deliveryTime) {
      orders[orderIndex].deliveryTime = deliveryTime;
    }
    orders[orderIndex].updatedAt = new Date().toISOString();

    // 更新状态为配送中
    if (orders[orderIndex].status === 'paid' || orders[orderIndex].status === 'processing') {
      await updateOrderStatus(orderId, 'shipping', '订单已发货');
    }

    return await saveOrderList(orders);
  } catch (error) {
    console.error('更新物流信息失败:', error);
    return false;
  }
};

/**
 * 确认收货
 */
export const confirmDelivery = async (orderId: string): Promise<boolean> => {
  try {
    return await updateOrderStatus(orderId, 'delivered', '用户确认收货');
  } catch (error) {
    console.error('确认收货失败:', error);
    return false;
  }
};

/**
 * 根据状态筛选订单
 */
export const getOrdersByStatus = async (status?: OrderStatus): Promise<Order[]> => {
  try {
    const orders = await getOrders();
    if (!status) {
      return orders;
    }
    return orders.filter(order => order.status === status);
  } catch (error) {
    console.error('筛选订单失败:', error);
    return [];
  }
};

/**
 * 获取待支付订单数量
 */
export const getPendingOrderCount = async (): Promise<number> => {
  try {
    const orders = await getOrders();
    return orders.filter(order => order.status === 'pending').length;
  } catch (error) {
    console.error('获取待支付订单数量失败:', error);
    return 0;
  }
};

/**
 * 获取待评价订单数量
 */
export const getPendingReviewCount = async (): Promise<number> => {
  try {
    const orders = await getOrders();
    return orders.filter(
      order => order.status === 'delivered' && !order.isReviewed
    ).length;
  } catch (error) {
    console.error('获取待评价订单数量失败:', error);
    return 0;
  }
};

/**
 * 标记订单已评价
 */
export const markOrderReviewed = async (orderId: string, reviewId: string): Promise<boolean> => {
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return false;
    }

    orders[orderIndex].isReviewed = true;
    orders[orderIndex].reviewId = reviewId;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // 如果订单已送达且已评价，更新为已完成
    if (orders[orderIndex].status === 'delivered') {
      await updateOrderStatus(orderId, 'completed', '订单已完成');
    }

    return await saveOrderList(orders);
  } catch (error) {
    console.error('标记订单已评价失败:', error);
    return false;
  }
};

/**
 * 创建营养师咨询订单（简化版，用于CheckoutScreen）
 */
export const createNutritionistOrder = async (params: {
  userId: string;
  nutritionistId: string;
  nutritionistName: string;
  serviceName: string;
  price: number;
  appointmentDate: string;
  appointmentTime: string;
}): Promise<Order | null> => {
  try {
    const { userId, nutritionistId, nutritionistName, serviceName, price, appointmentDate, appointmentTime } = params;

    const now = new Date().toISOString();
    const orderId = `KY${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${Date.now().toString().slice(-6)}`;

    const orderItem: OrderItem = {
      id: `order_item_${Date.now()}`,
      itemType: 'consultation',
      itemId: nutritionistId,
      itemName: serviceName,
      price,
      quantity: 1,
      unit: '次',
      subtotal: price,
      providerId: nutritionistId,
      providerName: nutritionistName,
    };

    const newOrder: Order = {
      id: orderId,
      userId,
      itemType: 'consultation',
      itemName: serviceName,
      items: [orderItem],
      subtotal: price,
      discountAmount: 0,
      couponAmount: 0,
      deliveryFee: 0,
      totalAmount: price,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: '订单已创建，等待支付',
        },
      ],
      metadata: {
        appointmentDate,
        appointmentTime,
        nutritionistId,
      },
      isReviewed: false,
      canCancel: true,
      canRefund: false,
      createdAt: now,
      updatedAt: now,
    };

    const orders = await getOrders();
    orders.unshift(newOrder);
    const success = await saveOrderList(orders);

    if (success) {
      console.log(`✅ 咨询订单创建成功: ${orderId}`);
      return newOrder;
    } else {
      return null;
    }
  } catch (error) {
    console.error('创建咨询订单失败:', error);
    return null;
  }
};

/**
 * 创建私人医生订阅订单
 */
export const createPrivateDoctorOrder = async (params: {
  userId: string;
  doctorId: string;
  doctorName: string;
  packageName: string;
  packageLevel: string;
  price: number;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  subscription?: any; // 完整的订阅对象
}): Promise<Order | null> => {
  try {
    const { userId, doctorId, doctorName, packageName, packageLevel, price, subscriptionId, startDate, endDate, subscription } = params;

    const now = new Date().toISOString();
    const orderId = `KY${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${Date.now().toString().slice(-6)}`;

    const orderItem: OrderItem = {
      id: `order_item_${Date.now()}`,
      itemType: 'private_doctor',
      itemId: doctorId,
      itemName: `${doctorName} - ${packageName}`,
      price,
      quantity: 1,
      unit: '年',
      subtotal: price,
      providerId: doctorId,
      providerName: doctorName,
      metadata: {
        packageLevel,
        subscriptionId,
        startDate,
        endDate,
      },
    };

    const newOrder: Order = {
      id: orderId,
      userId,
      itemType: 'private_doctor',
      itemName: `${doctorName} - ${packageName}`,
      items: [orderItem],
      subtotal: price,
      discountAmount: 0,
      couponAmount: 0,
      deliveryFee: 0,
      totalAmount: price,
      status: 'paid',
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: '订单已创建',
        },
        {
          status: 'paid',
          timestamp: now,
          note: '支付成功，订阅已激活',
        },
      ],
      metadata: {
        doctorId,
        subscriptionId,
        packageLevel,
        startDate,
        endDate,
        subscription, // 存储完整的订阅对象
      },
      paymentTime: now,
      paidAt: now,
      isReviewed: false,
      canCancel: false,
      canRefund: false,
      createdAt: now,
      updatedAt: now,
    };

    const orders = await getOrders();
    orders.unshift(newOrder);
    const success = await saveOrderList(orders);

    if (success) {
      console.log(`✅ 私人医生订阅订单创建成功: ${orderId}`);
      return newOrder;
    } else {
      return null;
    }
  } catch (error) {
    console.error('创建私人医生订单失败:', error);
    return null;
  }
};