// Application constants for Kangyang Health App

export const APP_CONFIG = {
  name: '九紫康养',
  version: '1.0.0',
  api: {
    baseUrl: 'https://api.kangyang.com/v1',
    timeout: 30000,
  },
  storage: {
    authToken: 'auth_token',
    refreshToken: 'refresh_token',
    userProfile: 'user_profile',
    settings: 'app_settings',
  },
  cache: {
    healthData: 'health_data_cache',
    devices: 'devices_cache',
  },
};

export const COLORS = {
  // AzurePop 主题色 - 基于偏蓝紫色到 #89fffd 渐变
  primary: '#c855f0', // 主蓝紫色 (偏蓝的紫色)
  primaryLight: '#f461e0', // 浅洋红色 - Tab选中状态
  primaryDark: '#b146e8', // 深蓝紫色
  secondary: '#89fffd', // 主薄荷青色 (AzurePop终点)
  secondaryLight: '#a6ffff', // 浅薄荷色
  secondaryDark: '#5ce6e3', // 深薄荷色
  accent: '#7b6ef6', // 中间紫色 (渐变中点)

  // 中性色调 - 基于AzurePop主题优化
  background: '#fafcff', // 极浅蓝白背景
  surface: '#ffffff', // 纯白表面
  surfaceSecondary: '#f8fafc', // 次要表面
  text: '#1a1d29', // 深蓝灰文字
  textSecondary: '#64748b', // 次要文字
  textTertiary: '#94a3b8', // 三级文字

  // 功能色调 - 与主题协调
  error: '#ef4444', // 错误红色
  warning: '#f59e0b', // 警告橙色
  success: '#10b981', // 成功绿色 (薄荷色系)
  info: '#3b82f6', // 信息蓝色

  // 边框和分割
  border: '#e2e8f0', // 主要边框
  borderLight: '#f1f5f9', // 浅色边框
  borderDark: '#cbd5e1', // 深色边框

  // 健康数据专用颜色 - AzurePop风格
  heartRate: '#c855f0', // 心率 - 主蓝紫色
  bloodPressure: '#b946db', // 血压 - 紫洋红
  bloodSugar: '#7b6ef6', // 血糖 - 中间紫
  weight: '#4dabf7', // 体重 - 蓝青
  sleep: '#89fffd', // 睡眠 - 主薄荷青
  steps: '#5ce6e3', // 步数 - 深薄荷
  temperature: '#f093fb', // 体温 - 浅紫粉
  oxygen: '#4ecdc4', // 血氧 - 青绿

  // 渐变色组合 - AzurePop系列
  gradientPrimary: ['#c855f0', '#f461e0'], // 蓝紫到洋红渐变
  gradientSecondary: ['#5ce6e3', '#89fffd'], // 薄荷渐变
  gradientAccent: ['#c855f0', '#89fffd'], // 主题渐变 (AzurePop新版)
  gradientReverse: ['#89fffd', '#c855f0'], // 反向主题渐变
  gradientSubtle: ['#f8fafc', '#ffffff'], // 微妙渐变

  // 阴影色调
  shadow: 'rgba(200, 85, 240, 0.1)', // 主题色阴影 (蓝紫色)
  shadowSecondary: 'rgba(137, 255, 253, 0.1)', // 次要阴影
  shadowNeutral: 'rgba(148, 163, 184, 0.1)', // 中性阴影
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SCREEN_NAMES = {
  // Auth Stack
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  BIOMETRIC_SETUP: 'BiometricSetup',

  // Main Tab Navigation
  HEALTH_TAB: 'HealthTab',
  LIFESTYLE_TAB: 'LifestyleTab',
  COMMUNITY_TAB: 'CommunityTab',
  PROFILE_TAB: 'ProfileTab',

  // Health Stack
  HEALTH_DASHBOARD: 'HealthDashboard',
  HEALTH_DATA_INPUT: 'HealthDataInput',
  HEALTH_TRENDS: 'HealthTrends',
  AI_REPORT: 'AIReport',
  DEVICE_SYNC: 'DeviceSync',

  // Lifestyle Stack
  LIFESTYLE_DASHBOARD: 'LifestyleDashboard',
  FITNESS_TRACKING: 'FitnessTracking',
  NUTRITION_LOG: 'NutritionLog',
  SLEEP_MONITORING: 'SleepMonitoring',
  MENTAL_WELLNESS: 'MentalWellness',

  // Community Stack
  COMMUNITY_FEED: 'CommunityFeed',
  USER_PROFILE: 'UserProfile',
  CHAT: 'Chat',
  CHALLENGES: 'Challenges',

  // Profile Stack
  PERSONAL_INFO: 'PersonalInfo',
  FAMILY_MANAGEMENT: 'FamilyManagement',
  DEVICE_MANAGEMENT: 'DeviceManagement',
  SETTINGS: 'Settings',
  PRIVACY_SETTINGS: 'PrivacySettings',
};

export const HEALTH_DATA_TYPES = {
  HEART_RATE: {
    key: 'heart_rate',
    name: '心率',
    unit: 'bpm',
    icon: 'heart-pulse',
    color: COLORS.heartRate,
    normalRange: { min: 60, max: 100 },
  },
  BLOOD_PRESSURE: {
    key: 'blood_pressure',
    name: '血压',
    unit: 'mmHg',
    icon: 'medical-bag',
    color: COLORS.bloodPressure,
    normalRange: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } },
  },
  BLOOD_SUGAR: {
    key: 'blood_sugar',
    name: '血糖',
    unit: 'mg/dL',
    icon: 'water-drop',
    color: COLORS.bloodSugar,
    normalRange: { min: 80, max: 130 },
  },
  WEIGHT: {
    key: 'weight',
    name: '体重',
    unit: 'kg',
    icon: 'scale-bathroom',
    color: COLORS.weight,
    normalRange: null, // BMI-based calculation
  },
  STEPS: {
    key: 'steps',
    name: '步数',
    unit: '步',
    icon: 'walk',
    color: COLORS.steps,
    normalRange: { min: 6000, max: 10000 },
  },
  SLEEP_DURATION: {
    key: 'sleep_duration',
    name: '睡眠时长',
    unit: '小时',
    icon: 'sleep',
    color: COLORS.sleep,
    normalRange: { min: 7, max: 9 },
  },
  TEMPERATURE: {
    key: 'temperature',
    name: '体温',
    unit: '°C',
    icon: 'thermometer',
    color: COLORS.temperature,
    normalRange: { min: 36.1, max: 37.2 },
  },
  OXYGEN_SATURATION: {
    key: 'oxygen_saturation',
    name: '血氧',
    unit: '%',
    icon: 'lungs',
    color: COLORS.oxygen,
    normalRange: { min: 95, max: 100 },
  },
};

export const DEVICE_TYPES = {
  SMART_SCALE: {
    key: 'smart_scale',
    name: '智能体重秤',
    icon: 'scale-bathroom',
  },
  FITNESS_TRACKER: {
    key: 'fitness_tracker',
    name: '运动手环',
    icon: 'watch',
  },
  BLOOD_PRESSURE_MONITOR: {
    key: 'blood_pressure_monitor',
    name: '血压计',
    icon: 'medical-bag',
  },
  GLUCOMETER: {
    key: 'glucometer',
    name: '血糖仪',
    icon: 'water-drop',
  },
  SMART_TOILET: {
    key: 'smart_toilet',
    name: '智能马桶',
    icon: 'toilet',
  },
};

export const NOTIFICATION_TYPES = {
  HEALTH_ALERT: {
    key: 'health_alert',
    name: '健康警报',
    icon: 'alert-circle',
    color: COLORS.error,
  },
  MEDICATION_REMINDER: {
    key: 'medication_reminder',
    name: '用药提醒',
    icon: 'pill',
    color: COLORS.info,
  },
  APPOINTMENT_REMINDER: {
    key: 'appointment_reminder',
    name: '预约提醒',
    icon: 'calendar',
    color: COLORS.warning,
  },
  DEVICE_SYNC: {
    key: 'device_sync',
    name: '设备同步',
    icon: 'refresh',
    color: COLORS.info,
  },
  REPORT_READY: {
    key: 'report_ready',
    name: '报告生成',
    icon: 'file-document',
    color: COLORS.success,
  },
};

export const SYNC_INTERVALS = {
  IMMEDIATE: 0,
  MINUTES_5: 5 * 60 * 1000,
  MINUTES_15: 15 * 60 * 1000,
  HOURS_1: 60 * 60 * 1000,
  HOURS_6: 6 * 60 * 60 * 1000,
  DAILY: 24 * 60 * 60 * 1000,
};

export const BIOMETRIC_TYPES = {
  FINGERPRINT: 'fingerprint',
  FACE_ID: 'face_id',
  IRIS: 'iris',
  VOICE: 'voice',
};

export const PERMISSIONS = {
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  LOCATION: 'location',
  NOTIFICATIONS: 'notifications',
  HEALTH_DATA: 'health_data',
  BLUETOOTH: 'bluetooth',
};

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  SYNC_FAILED: 'SYNC_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  BIOMETRIC_NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
};

export const ANIMATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  BOUNCE: 'spring',
  EASE: 'ease-in-out',
};

// ==================== 订单系统常量 ====================

/**
 * 订单商品类型枚举
 */
export const ORDER_ITEM_TYPES = {
  MEAL_PLAN: 'meal_plan',
  SERVICE: 'service',
  PRODUCT: 'product',
  CONSULTATION: 'consultation',
  COURSE: 'course',
} as const;

/**
 * 订单状态枚举
 */
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

/**
 * 订单类型配置（用于筛选）
 */
export const ORDER_TYPE_CONFIGS = [
  { id: 'all', label: '全部' },
  { id: ORDER_ITEM_TYPES.MEAL_PLAN, label: '服务类' },
  { id: ORDER_ITEM_TYPES.CONSULTATION, label: '咨询类' },
  { id: ORDER_ITEM_TYPES.PRODUCT, label: '商品类' },
];

/**
 * 订单状态配置（用于筛选）
 */
export const ORDER_STATUS_CONFIGS = [
  { id: 'all', label: '全部' },
  { id: ORDER_STATUSES.PENDING, label: '待支付' },
  { id: ORDER_STATUSES.PAID, label: '已支付' },
  { id: ORDER_STATUSES.PROCESSING, label: '进行中' },
  { id: ORDER_STATUSES.SHIPPING, label: '配送中' },
  { id: ORDER_STATUSES.COMPLETED, label: '已完成' },
  { id: ORDER_STATUSES.CANCELLED, label: '已取消' },
];

/**
 * 订单状态颜色映射
 */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUSES.PENDING]: '#F59E0B',
  [ORDER_STATUSES.PAID]: '#10B981',
  [ORDER_STATUSES.PROCESSING]: '#3B82F6',
  [ORDER_STATUSES.SHIPPING]: '#8B5CF6',
  [ORDER_STATUSES.DELIVERED]: '#10B981',
  [ORDER_STATUSES.COMPLETED]: '#6B7280',
  [ORDER_STATUSES.CANCELLED]: '#EF4444',
  [ORDER_STATUSES.REFUNDED]: '#EC4899',
};

/**
 * 订单状态中文标签映射
 */
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.PENDING]: '待支付',
  [ORDER_STATUSES.PAID]: '已支付',
  [ORDER_STATUSES.PROCESSING]: '进行中',
  [ORDER_STATUSES.SHIPPING]: '配送中',
  [ORDER_STATUSES.DELIVERED]: '已送达',
  [ORDER_STATUSES.COMPLETED]: '已完成',
  [ORDER_STATUSES.CANCELLED]: '已取消',
  [ORDER_STATUSES.REFUNDED]: '已退款',
};

/**
 * 订单商品类型中文标签映射
 */
export const ORDER_ITEM_TYPE_LABELS = {
  [ORDER_ITEM_TYPES.MEAL_PLAN]: '营养配餐',
  [ORDER_ITEM_TYPES.CONSULTATION]: '专家咨询',
  [ORDER_ITEM_TYPES.PRODUCT]: '商品',
  [ORDER_ITEM_TYPES.SERVICE]: '服务',
  [ORDER_ITEM_TYPES.COURSE]: '课程',
};

/**
 * 订单状态流程步骤（用于详情页进度展示）
 */
export const ORDER_STATUS_STEPS = [
  { status: ORDER_STATUSES.PENDING, label: '待支付' },
  { status: ORDER_STATUSES.PAID, label: '已支付' },
  { status: ORDER_STATUSES.PROCESSING, label: '进行中' },
  { status: ORDER_STATUSES.COMPLETED, label: '已完成' },
];