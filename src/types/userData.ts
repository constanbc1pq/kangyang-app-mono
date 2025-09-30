/**
 * 康养APP - 用户数据结构定义
 * 本地存储方案，无需后端支持
 */

// ==================== 基础类型定义 ====================

/**
 * 用户基本信息
 */
export interface UserProfile {
  userId: string; // 用户唯一ID（使用UUID）
  surname: string; // 姓氏（如"王"）
  fullName?: string; // 完整姓名（可选）
  gender: 'male' | 'female' | 'other';
  birthDate: string; // ISO 8601格式: "1990-01-01"
  age?: number; // 年龄（根据出生日期计算）
  height?: number; // 身高(cm)
  weight?: number; // 体重(kg)
  avatar?: string; // 头像URL或base64
  phone?: string; // 手机号
  email?: string; // 邮箱
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string; // 关系：配偶、子女、父母等
  };
  createdAt: string; // 账号创建时间
  updatedAt: string; // 最后更新时间
}

/**
 * 设备事件/数据记录
 */
export interface DeviceEvent {
  id: string;
  deviceId: number;
  timestamp: string; // ISO 8601格式
  type: string; // 测量类型：心率、血压、血糖、体重等
  value: string; // 测量值
  unit?: string; // 单位：bpm、mmHg、mmol/L等
  status: 'normal' | 'warning' | 'danger'; // 健康状态
  note?: string; // 备注
  photos?: string[]; // 照片(base64或URL)
}

/**
 * 健康监测设备
 */
export interface HealthDevice {
  id: number;
  name: string; // 设备名称
  type: 'smartwatch' | 'blood-pressure' | 'glucose-meter' | 'scale' | 'thermometer' | 'smart-toilet';
  status: 'connected' | 'disconnected' | 'syncing';
  battery: number; // 电量百分比(0-100)
  lastSync: string; // 最后同步时间
  connection: 'wifi' | 'bluetooth' | 'manual'; // 连接方式
  model?: string; // 设备型号
  syncType: 'auto' | 'manual'; // 同步类型
  events: DeviceEvent[]; // 该设备的所有数据记录
  createdAt: string; // 添加时间
  updatedAt: string; // 更新时间
}

/**
 * 健康指标趋势数据
 */
export interface HealthMetric {
  type: string; // 指标类型：heartRate、bloodPressure、bloodSugar、weight等
  name: string; // 指标名称
  unit: string; // 单位
  latestValue: string; // 最新值
  latestDate: string; // 最新测量日期
  trend: 'up' | 'down' | 'stable'; // 趋势
  dataPoints: Array<{
    date: string;
    value: number;
    status: 'normal' | 'warning' | 'danger';
  }>; // 历史数据点
}

/**
 * 用药记录
 */
export interface Medication {
  id: string;
  name: string; // 药品名称
  dosage: string; // 剂量
  frequency: string; // 频率：每日一次、每日两次等
  times: string[]; // 用药时间：['08:00', '20:00']
  startDate: string; // 开始日期
  endDate?: string; // 结束日期（可选，长期用药可为空）
  purpose?: string; // 用药目的/治疗疾病
  notes?: string; // 备注
  reminders: boolean; // 是否开启提醒
  color: string; // 标识颜色
  records: Array<{
    // 用药记录
    date: string;
    time: string;
    taken: boolean; // 是否已服用
    takenAt?: string; // 实际服用时间
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * AI健康报告
 */
export interface HealthReport {
  id: string;
  generateDate: string; // 生成日期
  period: 'week' | 'month' | 'year'; // 报告周期
  overallScore: number; // 综合健康评分(0-100)
  dimensions: Array<{
    // 健康维度评分
    name: string; // 维度名称：心血管、代谢、睡眠等
    score: number;
    trend: 'up' | 'down' | 'stable';
    suggestions: string[];
  }>;
  insights: string[]; // AI分析洞察
  warnings: string[]; // 健康警告
  recommendations: string[]; // 建议
  dataSource: string[]; // 数据来源设备
}

/**
 * AI咨询对话
 */
export interface AIConsultation {
  id: string;
  startDate: string;
  lastMessageDate: string;
  messages: Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>;
  topic?: string; // 对话主题
  tags?: string[]; // 标签
}

/**
 * 养生/生活方式记录
 */
export interface LifestyleRecord {
  id: string;
  date: string;
  category: 'fitness' | 'nutrition' | 'sleep' | 'mental'; // 类别
  activity: string; // 活动名称
  duration?: number; // 时长(分钟)
  intensity?: 'low' | 'medium' | 'high'; // 强度
  calories?: number; // 卡路里
  notes?: string;
  mood?: 'excellent' | 'good' | 'normal' | 'bad' | 'terrible'; // 心情
  tags?: string[];
  photos?: string[];
}

/**
 * 健康目标
 */
export interface HealthGoal {
  id: string;
  type: 'weight' | 'exercise' | 'sleep' | 'medication' | 'custom'; // 目标类型
  name: string; // 目标名称
  target: string | number; // 目标值
  current: string | number; // 当前值
  unit: string; // 单位
  startDate: string;
  targetDate: string; // 目标日期
  progress: number; // 进度百分比(0-100)
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  milestones: Array<{
    // 里程碑
    date: string;
    description: string;
    achieved: boolean;
  }>;
  reminders: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 社区互动记录
 */
export interface CommunityActivity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'share'; // 活动类型
  contentId: string; // 内容ID
  content?: string; // 内容
  timestamp: string;
  tags?: string[];
}

/**
 * 家庭成员信息
 */
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // 关系
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  avatar?: string;
  sharedData: {
    // 共享数据权限
    healthMetrics: boolean;
    devices: boolean;
    reports: boolean;
  };
  linkedUserId?: string; // 如果该成员也是APP用户
}

/**
 * APP设置
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  notifications: {
    medication: boolean;
    healthWarning: boolean;
    deviceSync: boolean;
    community: boolean;
  };
  privacy: {
    dataSharing: boolean;
    aiAnalysis: boolean;
  };
  dataSync: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    lastBackup?: string;
  };
}

// ==================== 完整用户数据结构 ====================

/**
 * 完整的用户数据结构
 * 这是存储在本地的完整数据对象
 */
export interface UserData {
  profile: UserProfile; // 用户基本信息
  devices: HealthDevice[]; // 健康监测设备
  healthMetrics: HealthMetric[]; // 健康指标趋势
  medications: Medication[]; // 用药记录
  healthReports: HealthReport[]; // AI健康报告
  consultations: AIConsultation[]; // AI咨询历史
  lifestyleRecords: LifestyleRecord[]; // 养生生活记录
  healthGoals: HealthGoal[]; // 健康目标
  communityActivities: CommunityActivity[]; // 社区活动
  familyMembers: FamilyMember[]; // 家庭成员
  settings: AppSettings; // APP设置

  // 元数据
  version: string; // 数据结构版本号（用于未来迁移）
  lastModified: string; // 最后修改时间
}

// ==================== 工具类型 ====================

/**
 * 数据同步状态
 */
export interface SyncStatus {
  lastSync: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

/**
 * 数据导出格式
 */
export interface ExportData {
  userData: UserData;
  exportDate: string;
  appVersion: string;
}