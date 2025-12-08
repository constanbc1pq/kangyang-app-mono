/**
 * 统一会员体系 - 类型定义
 *
 * 会员等级: FREE -> GOLD -> PLATINUM -> DIAMOND
 * 参考: 会员体系.md
 */

// ==================== 会员等级 ====================

/**
 * 会员等级枚举
 */
export enum MembershipLevel {
  FREE = 'free',           // 免费用户
  GOLD = 'gold',           // 黄金会员
  PLATINUM = 'platinum',   // 白金会员
  DIAMOND = 'diamond',     // 钻石会员
}

/**
 * 会员等级中文名称
 */
export const MEMBERSHIP_LEVEL_LABELS: Record<MembershipLevel, string> = {
  [MembershipLevel.FREE]: '免费用户',
  [MembershipLevel.GOLD]: '黄金会员',
  [MembershipLevel.PLATINUM]: '白金会员',
  [MembershipLevel.DIAMOND]: '钻石会员',
};

/**
 * 会员等级颜色配置
 */
export const MEMBERSHIP_LEVEL_COLORS: Record<MembershipLevel, { primary: string; background: string; gradient: string[] }> = {
  [MembershipLevel.FREE]: {
    primary: '#6B7280',
    background: '#F3F4F6',
    gradient: ['#9CA3AF', '#6B7280'],
  },
  [MembershipLevel.GOLD]: {
    primary: '#D97706',
    background: '#FEF3C7',
    gradient: ['#FCD34D', '#D97706'],
  },
  [MembershipLevel.PLATINUM]: {
    primary: '#6366F1',
    background: '#EEF2FF',
    gradient: ['#A5B4FC', '#6366F1'],
  },
  [MembershipLevel.DIAMOND]: {
    primary: '#7C3AED',
    background: '#F3E8FF',
    gradient: ['#C4B5FD', '#7C3AED'],
  },
};

// ==================== 会员定价 ====================

/**
 * 付费周期
 */
export type PaymentCycle = 'monthly' | 'quarterly' | 'yearly';

/**
 * 会员定价配置
 */
export interface MembershipPricing {
  monthly: number;    // 月付价格
  quarterly: number;  // 季付价格 (优惠10%)
  yearly: number;     // 年付价格 (优惠20%)
}

/**
 * 会员价格表
 */
export const MEMBERSHIP_PRICES: Record<MembershipLevel, MembershipPricing> = {
  [MembershipLevel.FREE]: {
    monthly: 0,
    quarterly: 0,
    yearly: 0,
  },
  [MembershipLevel.GOLD]: {
    monthly: 29,
    quarterly: 78,    // 原价87, 优惠10%
    yearly: 298,      // 原价348, 优惠20%
  },
  [MembershipLevel.PLATINUM]: {
    monthly: 99,
    quarterly: 267,   // 原价297, 优惠10%
    yearly: 998,      // 原价1188, 优惠20%
  },
  [MembershipLevel.DIAMOND]: {
    monthly: 199,
    quarterly: 537,   // 原价597, 优惠10%
    yearly: 1998,     // 原价2388, 优惠20%
  },
};

/**
 * 钻石家庭版价格 (+50%)
 */
export const DIAMOND_FAMILY_PRICES: MembershipPricing = {
  monthly: 299,
  quarterly: 806,
  yearly: 2998,
};

// ==================== 用户会员信息 ====================

/**
 * 用户会员信息
 */
export interface UserMembership {
  level: MembershipLevel;        // 当前等级
  startDate?: string;            // 开通日期 (ISO 8601)
  endDate?: string;              // 到期日期 (ISO 8601)
  autoRenew: boolean;            // 自动续费
  paymentCycle?: PaymentCycle;   // 付费周期
  isFamilyPlan: boolean;         // 是否家庭版 (仅钻石)
  familyMembers?: number;        // 家庭成员数 (3-5)
  purchaseHistory: MembershipPurchaseRecord[];  // 购买记录

  // 预约的会员（降级时使用，当前会员到期后生效）
  pendingMembership?: {
    level: MembershipLevel;
    cycle: PaymentCycle;
    startDate: string;           // 生效日期
    endDate: string;             // 到期日期
    purchaseDate: string;        // 购买日期
    orderId: string;             // 订单ID
  };

  // 升级前的会员（升级时使用，高级会员到期后切换回）
  previousMembership?: {
    level: MembershipLevel;
    endDate: string;             // 原会员到期日期
  };
}

/**
 * 会员购买记录
 */
export interface MembershipPurchaseRecord {
  id: string;
  date: string;                  // 购买日期
  type: 'purchase' | 'renewal' | 'upgrade';  // 类型
  fromLevel?: MembershipLevel;   // 升级前等级
  toLevel: MembershipLevel;      // 购买/升级后等级
  cycle: PaymentCycle;           // 付费周期
  amount: number;                // 支付金额
  paymentMethod: string;         // 支付方式
  transactionId?: string;        // 交易ID
}

// ==================== 积分系统 ====================

/**
 * 积分信息
 */
export interface PointsInfo {
  balance: number;               // 当前积分余额
  totalEarned: number;           // 累计获得
  totalSpent: number;            // 累计消费
  history: PointsRecord[];       // 积分明细
}

/**
 * 积分记录
 */
export interface PointsRecord {
  id: string;
  date: string;                  // 日期
  type: 'earn' | 'spend';        // 类型
  amount: number;                // 积分数量
  multiplier?: number;           // 倍率 (获得时)
  source: PointsSource;          // 来源
  description: string;           // 描述
  relatedOrderId?: string;       // 关联订单ID
}

/**
 * 积分来源/用途
 */
export type PointsSource =
  | 'daily_checkin'      // 每日签到
  | 'data_upload'        // 数据上传
  | 'order_purchase'     // 订单购买
  | 'referral'           // 邀请好友
  | 'activity'           // 活动奖励
  | 'membership_redeem'  // 兑换会员
  | 'product_redeem'     // 兑换商品
  | 'order_deduction';   // 订单抵扣

/**
 * 积分来源中文名称
 */
export const POINTS_SOURCE_LABELS: Record<PointsSource, string> = {
  daily_checkin: '每日签到',
  data_upload: '数据上传',
  order_purchase: '订单奖励',
  referral: '邀请好友',
  activity: '活动奖励',
  membership_redeem: '兑换会员',
  product_redeem: '兑换商品',
  order_deduction: '订单抵扣',
};

/**
 * 会员积分倍率
 */
export const POINTS_MULTIPLIER: Record<MembershipLevel, number> = {
  [MembershipLevel.FREE]: 1,
  [MembershipLevel.GOLD]: 1.5,
  [MembershipLevel.PLATINUM]: 2,
  [MembershipLevel.DIAMOND]: 3,
};

// ==================== 独立付费服务订阅 ====================

/**
 * 独立服务订阅信息
 */
export interface ServiceSubscriptions {
  privateDoctor?: PrivateDoctorSubscription;   // 私人医生订阅
  legalService?: LegalServiceSubscription;     // 法律服务订阅
  expertCert?: ExpertCertSubscription;         // 达人认证
}

/**
 * 私人医生订阅
 */
export interface PrivateDoctorSubscription {
  packageId: string;             // 套餐ID
  packageLevel: string;          // 套餐等级
  doctorId: string;              // 医生ID
  startDate: string;             // 开始日期
  endDate: string;               // 结束日期
  originalPrice: number;         // 原价
  actualPrice: number;           // 实付 (含会员折扣)
  discountRate?: number;         // 折扣率
}

/**
 * 法律服务订阅
 */
export interface LegalServiceSubscription {
  tier: string;                  // 套餐等级
  startDate: string;             // 开始日期
  endDate: string;               // 结束日期
  originalPrice: number;         // 原价
  actualPrice: number;           // 实付 (含会员折扣)
  discountRate?: number;         // 折扣率
}

/**
 * 达人认证订阅
 */
export interface ExpertCertSubscription {
  expertType: 'personal' | 'business';  // 达人类型
  startDate: string;             // 开始日期
  endDate: string;               // 结束日期
  price: number;                 // 价格
}

/**
 * 独立服务会员折扣
 */
export const SERVICE_DISCOUNT_RATES: Record<MembershipLevel, number> = {
  [MembershipLevel.FREE]: 0,
  [MembershipLevel.GOLD]: 0,
  [MembershipLevel.PLATINUM]: 0.1,   // 10% off
  [MembershipLevel.DIAMOND]: 0.2,    // 20% off
};

/**
 * 达人认证费用
 */
export const EXPERT_CERT_PRICES = {
  personal: 500,    // 个人达人 ¥500/年
  business: 2000,   // 商家达人 ¥2000/年
};

// ==================== 权益配置 ====================

/**
 * 权益模块
 */
export type BenefitModule = 'health' | 'lifestyle' | 'community' | 'general';

/**
 * 权益项
 */
export type BenefitKey =
  // 康模块
  | 'ai_question_daily'          // AI问答每日次数
  | 'device_bindING_limit'       // 设备绑定数量
  | 'health_data_storage_days'   // 历史数据存储天数
  | 'health_report_export'       // 健康报告导出
  | 'ai_health_insight'          // AI健康洞察
  | 'family_health_guard'        // 全家健康守护
  // 养模块
  | 'recipe_customization'       // 食谱定制
  | 'grocery_discount_rate'      // 食材折扣率
  | 'meal_delivery_priority'     // 送餐优先
  | 'elderly_service_discount'   // 养老服务折扣
  | 'lawyer_ai_monthly'          // 律师AI助手月次数
  | 'legal_consultation'         // 法律咨询
  // 社区模块
  | 'publish_monthly_limit'      // 每月发布次数
  | 'points_multiplier'          // 积分倍率
  | 'order_commission_discount'  // 订单佣金减免
  // 通用
  | 'ad_free'                    // 无广告
  | 'device_sync_limit'          // 多设备同步数
  | 'voice_input';               // 语音输入

/**
 * 权益值类型
 */
export type BenefitValue = number | boolean | string | null;

/**
 * 权益配置矩阵
 * -1 表示无限
 */
export const BENEFIT_MATRIX: Record<BenefitKey, Record<MembershipLevel, BenefitValue>> = {
  // 康模块
  ai_question_daily: {
    [MembershipLevel.FREE]: 5,
    [MembershipLevel.GOLD]: -1,
    [MembershipLevel.PLATINUM]: -1,
    [MembershipLevel.DIAMOND]: -1,
  },
  device_bindING_limit: {
    [MembershipLevel.FREE]: 2,
    [MembershipLevel.GOLD]: -1,
    [MembershipLevel.PLATINUM]: -1,
    [MembershipLevel.DIAMOND]: -1,
  },
  health_data_storage_days: {
    [MembershipLevel.FREE]: 30,
    [MembershipLevel.GOLD]: 365,
    [MembershipLevel.PLATINUM]: 1095,  // 3年
    [MembershipLevel.DIAMOND]: -1,
  },
  health_report_export: {
    [MembershipLevel.FREE]: 'daily',
    [MembershipLevel.GOLD]: 'weekly_monthly',
    [MembershipLevel.PLATINUM]: 'weekly_monthly',
    [MembershipLevel.DIAMOND]: 'weekly_monthly',
  },
  ai_health_insight: {
    [MembershipLevel.FREE]: false,
    [MembershipLevel.GOLD]: false,
    [MembershipLevel.PLATINUM]: true,
    [MembershipLevel.DIAMOND]: true,
  },
  family_health_guard: {
    [MembershipLevel.FREE]: false,
    [MembershipLevel.GOLD]: false,
    [MembershipLevel.PLATINUM]: false,
    [MembershipLevel.DIAMOND]: true,
  },
  // 养模块
  recipe_customization: {
    [MembershipLevel.FREE]: 'none',
    [MembershipLevel.GOLD]: 'ai_recommend',
    [MembershipLevel.PLATINUM]: 'personal',
    [MembershipLevel.DIAMOND]: 'family',
  },
  grocery_discount_rate: {
    [MembershipLevel.FREE]: 0,
    [MembershipLevel.GOLD]: 0.05,
    [MembershipLevel.PLATINUM]: 0.1,
    [MembershipLevel.DIAMOND]: 0.15,
  },
  meal_delivery_priority: {
    [MembershipLevel.FREE]: false,
    [MembershipLevel.GOLD]: false,
    [MembershipLevel.PLATINUM]: true,
    [MembershipLevel.DIAMOND]: true,
  },
  elderly_service_discount: {
    [MembershipLevel.FREE]: 0,
    [MembershipLevel.GOLD]: 0,
    [MembershipLevel.PLATINUM]: 0.1,
    [MembershipLevel.DIAMOND]: 0.2,
  },
  lawyer_ai_monthly: {
    [MembershipLevel.FREE]: 0,
    [MembershipLevel.GOLD]: 10,
    [MembershipLevel.PLATINUM]: -1,
    [MembershipLevel.DIAMOND]: -1,
  },
  legal_consultation: {
    [MembershipLevel.FREE]: 'none',
    [MembershipLevel.GOLD]: 'none',
    [MembershipLevel.PLATINUM]: 'text',
    [MembershipLevel.DIAMOND]: 'text_phone',
  },
  // 社区模块
  publish_monthly_limit: {
    [MembershipLevel.FREE]: 5,
    [MembershipLevel.GOLD]: -1,
    [MembershipLevel.PLATINUM]: -1,
    [MembershipLevel.DIAMOND]: -1,
  },
  points_multiplier: {
    [MembershipLevel.FREE]: 1,
    [MembershipLevel.GOLD]: 1.5,
    [MembershipLevel.PLATINUM]: 2,
    [MembershipLevel.DIAMOND]: 3,
  },
  order_commission_discount: {
    [MembershipLevel.FREE]: 0,
    [MembershipLevel.GOLD]: 0.05,
    [MembershipLevel.PLATINUM]: 0.1,
    [MembershipLevel.DIAMOND]: 0.15,
  },
  // 通用
  ad_free: {
    [MembershipLevel.FREE]: false,
    [MembershipLevel.GOLD]: true,
    [MembershipLevel.PLATINUM]: true,
    [MembershipLevel.DIAMOND]: true,
  },
  device_sync_limit: {
    [MembershipLevel.FREE]: 2,
    [MembershipLevel.GOLD]: 3,
    [MembershipLevel.PLATINUM]: -1,
    [MembershipLevel.DIAMOND]: -1,
  },
  voice_input: {
    [MembershipLevel.FREE]: false,
    [MembershipLevel.GOLD]: true,
    [MembershipLevel.PLATINUM]: true,
    [MembershipLevel.DIAMOND]: true,
  },
};

// ==================== 默认值 ====================

/**
 * 默认会员信息 (免费用户)
 */
export const DEFAULT_MEMBERSHIP: UserMembership = {
  level: MembershipLevel.FREE,
  autoRenew: false,
  isFamilyPlan: false,
  purchaseHistory: [],
};

/**
 * 默认积分信息
 */
export const DEFAULT_POINTS: PointsInfo = {
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  history: [],
};

/**
 * 默认订阅信息（空，基于真实订单判定）
 */
export const DEFAULT_SUBSCRIPTIONS: ServiceSubscriptions = {};
