// Application constants for Kangyang Health App

export const APP_CONFIG = {
  name: '康养APP',
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
  primary: '#7C3AED', // 主紫色
  secondary: '#2C7A7B', // 主青色
  accent: '#A855F7', // 亮紫色
  background: '#FAFAFA', // 明亮背景
  surface: '#FFFFFF', // 纯白表面
  text: '#18181B', // 深色文字
  textSecondary: '#71717A', // 次要文字
  error: '#DC2626', // 错误红色
  warning: '#F59E0B', // 警告橙色
  success: '#16A34A', // 成功绿色
  info: '#0EA5E9', // 信息蓝色

  // 健康数据专用颜色 - 紫青色调
  heartRate: '#EC4899', // 粉紫色心率
  bloodPressure: '#8B5CF6', // 紫色血压
  bloodSugar: '#06B6D4', // 青色血糖
  weight: '#3B82F6', // 蓝色体重
  sleep: '#6366F1', // 靛紫色睡眠
  steps: '#10B981', // 绿青色步数

  // 渐变色
  gradientPrimary: ['#7C3AED', '#A855F7'], // 紫色渐变
  gradientSecondary: ['#0891B2', '#06B6D4'], // 青色渐变
  gradientAccent: ['#7C3AED', '#06B6D4'], // 紫青渐变
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