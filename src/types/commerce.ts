/**
 * 电商系统数据类型定义
 * 支持多种商品类型：套餐、服务、商品等
 */

// ==================== 通用类型 ====================

export type ItemType = 'meal_plan' | 'service' | 'product' | 'consultation' | 'course' | 'elderly_service';

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'refunded';

export type PaymentMethod = 'wechat' | 'alipay' | 'health_points' | 'card';

export type DeliveryTimeSlot = 'breakfast' | 'lunch' | 'dinner' | 'anytime';

// ==================== 购物车 ====================

export interface CartItem {
  id: string;                    // 购物车项ID
  itemType: ItemType;            // 商品类型
  itemId: string;                // 商品ID
  itemName: string;              // 商品名称
  itemImage?: string;            // 商品图片
  itemDescription?: string;      // 商品描述
  price: number;                 // 单价
  quantity: number;              // 数量
  unit?: string;                 // 单位（份/次/件）
  // 套餐特定字段
  cycle?: number;                // 订购周期（天数）
  cycleDiscount?: number;        // 周期折扣（如7天95折、30天9折）
  deliveryTimeSlots?: DeliveryTimeSlot[]; // 配送时间段
  // 服务特定字段
  serviceDate?: string;          // 服务日期
  serviceTime?: string;          // 服务时间
  providerId?: string;           // 服务提供者ID
  providerName?: string;         // 服务提供者姓名
  // 元数据
  metadata?: Record<string, any>; // 额外信息（如套餐详情、服务备注）
  addedAt: string;               // 加入时间
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;            // 总金额
  totalDiscount: number;          // 总折扣
  lastModified: string;
}

// ==================== 订单 ====================

export interface OrderItem {
  id: string;
  itemType: ItemType;
  itemId: string;
  itemName: string;
  itemImage?: string;
  price: number;
  quantity: number;
  unit?: string;
  subtotal: number;               // 小计
  // 套餐/服务特定字段
  cycle?: number;
  deliveryTimeSlots?: DeliveryTimeSlot[];
  serviceDate?: string;
  serviceTime?: string;
  providerId?: string;
  providerName?: string;
  metadata?: Record<string, any>;
}

export interface DeliveryAddress {
  id: string;
  receiverName: string;           // 收货人姓名
  receiverPhone: string;          // 收货人电话
  province: string;               // 省
  city: string;                   // 市
  district: string;               // 区
  address: string;                // 详细地址
  isDefault: boolean;             // 是否默认地址
  label?: string;                 // 地址标签（家/公司）
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;                     // 订单号
  userId: string;                 // 用户ID
  itemType: ItemType;             // 订单类型（取items中第一个商品的类型，用于分类筛选）
  itemName: string;               // 订单名称（取items中第一个商品的名称，用于显示）
  items: OrderItem[];             // 订单商品
  // 金额信息
  subtotal: number;               // 小计
  discountAmount: number;         // 折扣金额
  couponAmount: number;           // 优惠券金额
  deliveryFee: number;            // 配送费
  totalAmount: number;            // 总金额
  // 收货信息
  deliveryAddress?: DeliveryAddress; // 收货地址（服务类订单可能没有）
  deliveryNotes?: string;         // 配送备注
  // 支付信息
  paymentMethod?: PaymentMethod;
  paymentTime?: string;
  transactionId?: string;         // 交易单号
  // 订单状态
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  // 配送信息
  trackingNumber?: string;        // 物流单号
  deliveryTime?: string;          // 配送时间
  deliveredTime?: string;         // 签收时间
  // 评价信息
  isReviewed: boolean;
  reviewId?: string;
  // 售后信息
  canCancel: boolean;
  canRefund: boolean;
  refundReason?: string;
  refundAmount?: number;
  refundTime?: string;
  // 元数据
  metadata?: {
    appointmentDate?: string;     // 预约日期（咨询类订单）
    appointmentTime?: string;     // 预约时间（咨询类订单）
    nutritionistId?: string;      // 营养师ID（咨询类订单）
    [key: string]: any;           // 其他扩展字段
  };
  createdAt: string;
  updatedAt: string;
  paidAt?: string;                // 支付时间（用于显示）
}

// ==================== 收货地址 ====================

export interface Address {
  id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postalCode?: string;            // 邮编
  isDefault: boolean;
  label?: 'home' | 'company' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface AddressList {
  addresses: Address[];
  defaultAddressId?: string;
  lastModified: string;
}

// ==================== 收藏 ====================

export interface FavoriteItem {
  id: string;                     // 收藏ID
  itemType: ItemType;             // 类型
  itemId: string;                 // 商品/服务ID
  itemName: string;
  itemImage?: string;
  itemDescription?: string;
  price?: number;
  rating?: number;
  // 营养师特定字段
  nutritionistTitle?: string;     // 职称
  nutritionistSpecialty?: string; // 擅长领域
  // 课程特定字段
  courseInstructor?: string;      // 讲师
  courseDuration?: string;        // 课程时长
  // 元数据
  metadata?: Record<string, any>;
  favoritedAt: string;
}

export interface Favorites {
  items: FavoriteItem[];
  lastModified: string;
}

// ==================== 优惠券 ====================

export interface Coupon {
  id: string;
  code: string;                   // 优惠券码
  name: string;                   // 优惠券名称
  type: 'discount' | 'fixed' | 'free_delivery'; // 类型
  value: number;                  // 折扣值（如0.9表示9折，50表示减50元）
  minAmount?: number;             // 最低消费金额
  maxDiscount?: number;           // 最大优惠金额
  validFrom: string;              // 有效期开始
  validUntil: string;             // 有效期结束
  isUsed: boolean;
  usedAt?: string;
  orderId?: string;               // 使用的订单ID
  applicableTypes?: ItemType[];   // 适用商品类型
  createdAt: string;
}

export interface CouponList {
  coupons: Coupon[];
  lastModified: string;
}

// ==================== 评价 ====================

export interface Review {
  id: string;
  orderId: string;
  orderItemId: string;
  itemType: ItemType;
  itemId: string;
  itemName: string;
  rating: number;                 // 1-5星
  // 多维度评分
  ratings?: {
    quality?: number;             // 质量
    service?: number;             // 服务
    delivery?: number;            // 配送
    value?: number;               // 性价比
  };
  content: string;                // 评价内容
  images?: string[];              // 评价图片
  tags?: string[];                // 标签（如"味道好"、"配送快"）
  isAnonymous: boolean;           // 是否匿名
  // 追加评价
  appendContent?: string;
  appendImages?: string[];
  appendedAt?: string;
  // 回复
  reply?: {
    content: string;
    repliedAt: string;
  };
  // 点赞
  likes: number;
  isHelpful: boolean;             // 是否有帮助
  createdAt: string;
  updatedAt: string;
}