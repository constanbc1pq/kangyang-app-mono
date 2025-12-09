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
  // Neutral 主题色 - 与 neutralTheme.ts 保持一致
  // 主色调 - 暗紫色 (hsl 256)
  primary: '#6B5B95', // accent9: hsla(256, 30%, 48%)
  primaryLight: '#D8D0E8', // accent3: hsla(256, 50%, 90%)
  primaryDark: '#554878', // accent10: hsla(256, 28%, 42%)
  secondary: '#7E6EA8', // accent7: hsla(256, 35%, 62%)
  secondaryLight: '#EBE6F4', // accent2: hsla(256, 60%, 94%)
  secondaryDark: '#6B5B95', // accent8
  accent: '#6B5B95', // 与 primary 相同

  // 中性色调
  background: '#FCFCFC', // color1
  surface: '#F7F7F7', // color2
  surfaceSecondary: '#F0F0F0', // color3
  text: '#0D0D0D', // color12
  textSecondary: '#666666', // color10
  textTertiary: '#808080', // color9

  // 功能色调 - 单色系方案
  error: '#996666', // 灰红 red9: hsla(0, 35%, 50%)
  warning: '#808080', // 中灰 color9
  success: '#554878', // 深紫 accent10
  info: '#6B5B95', // 主紫 accent9
  gold: '#D4AF37', // 金黄色 - VIP/专属服务/高端标识

  // 边框和分割
  border: '#CCCCCC', // color6
  borderLight: '#D9D9D9', // color5
  borderDark: '#B8B8B8', // color7

  // 健康数据专用颜色 - 使用主题紫色系
  heartRate: '#6B5B95', // 心率 - 主紫
  bloodPressure: '#7E6EA8', // 血压 - 次紫
  bloodSugar: '#554878', // 血糖 - 深紫
  weight: '#8B7CB5', // 体重 - 浅紫
  sleep: '#7E6EA8', // 睡眠 - 次紫
  steps: '#6B5B95', // 步数 - 主紫
  temperature: '#A99BC8', // 体温 - 更浅紫
  oxygen: '#554878', // 血氧 - 深紫

  // 渐变色组合 - 紫色系
  gradientPrimary: ['#6B5B95', '#7E6EA8'], // 主紫渐变
  gradientSecondary: ['#7E6EA8', '#A99BC8'], // 浅紫渐变
  gradientAccent: ['#554878', '#6B5B95'], // 深紫渐变
  gradientReverse: ['#A99BC8', '#6B5B95'], // 反向渐变
  gradientSubtle: ['#F7F7F7', '#FCFCFC'], // 微妙渐变

  // 阴影色调
  shadow: 'rgba(107, 91, 149, 0.1)', // 主题色阴影
  shadowSecondary: 'rgba(126, 110, 168, 0.1)', // 次要阴影
  shadowNeutral: 'rgba(0, 0, 0, 0.08)', // 中性阴影
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
  PROFILE_EDIT: 'ProfileEdit',
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
  ELDERLY_SERVICE: 'elderly_service',
  PRIVATE_DOCTOR: 'private_doctor',
  LEGAL_MEMBERSHIP: 'legal_membership',
  MEMBERSHIP: 'membership',
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
  { id: ORDER_ITEM_TYPES.ELDERLY_SERVICE, label: '养老服务' },
  { id: ORDER_ITEM_TYPES.PRODUCT, label: '商品类' },
  { id: ORDER_ITEM_TYPES.PRIVATE_DOCTOR, label: '私人医生' },
  { id: 'community', label: '社区' },
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
  [ORDER_ITEM_TYPES.ELDERLY_SERVICE]: '养老服务',
  [ORDER_ITEM_TYPES.PRODUCT]: '商品',
  [ORDER_ITEM_TYPES.SERVICE]: '服务',
  [ORDER_ITEM_TYPES.COURSE]: '课程',
  [ORDER_ITEM_TYPES.PRIVATE_DOCTOR]: '私人医生',
  [ORDER_ITEM_TYPES.LEGAL_MEMBERSHIP]: '法律尊享计划',
  [ORDER_ITEM_TYPES.MEMBERSHIP]: '会员服务',
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