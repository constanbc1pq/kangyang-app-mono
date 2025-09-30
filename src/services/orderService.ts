/**
 * 全局订单服务
 * 管理订单创建、查询、更新、取消等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus, OrderItem, DeliveryAddress, PaymentMethod } from '@/types/commerce';
import { CartItem } from '@/types/commerce';

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

    const now = new Date().toISOString();
    orders[orderIndex].paymentMethod = paymentMethod;
    orders[orderIndex].paymentTime = now;
    orders[orderIndex].transactionId = transactionId;

    // 更新状态为已支付
    return await updateOrderStatus(orderId, 'paid', '支付成功');
  } catch (error) {
    console.error('支付订单失败:', error);
    return false;
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