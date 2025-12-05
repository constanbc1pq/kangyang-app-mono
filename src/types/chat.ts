/**
 * ============================================================================
 * 通用聊天页面类型定义 - chat.ts
 * ============================================================================
 *
 * Phase 33: ChatPage 基础框架
 * 定义聊天页面的所有配置类型和数据结构
 *
 * ============================================================================
 */

/**
 * 聊天类型枚举
 */
export enum ChatType {
  /** 私人医生 */
  DOCTOR = 'DOCTOR',
  /** 律师咨询 */
  LAWYER = 'LAWYER',
  /** 保险顾问 */
  INSURANCE = 'INSURANCE',
  /** 社区买卖 */
  COMMUNITY = 'COMMUNITY',
  /** 达人咨询 */
  EXPERT = 'EXPERT',
}

/**
 * 消息类型枚举
 */
export enum MessageType {
  /** 文本消息 */
  TEXT = 'text',
  /** 图片消息 */
  IMAGE = 'image',
  /** 语音消息 */
  VOICE = 'voice',
  /** 系统消息 */
  SYSTEM = 'system',
  /** 电子处方 (医生) */
  PRESCRIPTION = 'prescription',
  /** 检查建议 (医生) */
  CHECKUP = 'checkup',
  /** 转诊推荐 (医生) */
  REFERRAL = 'referral',
  /** 服务报价 (社区) */
  QUOTE = 'quote',
  /** 合同文件 (律师) */
  CONTRACT = 'contract',
  /** 保险方案 (保险) */
  PLAN = 'plan',
}

/**
 * 消息发送者类型
 */
export type MessageSender = 'user' | 'recipient' | 'ai' | 'system';

/**
 * 处方数据 (医生专属)
 */
export interface PrescriptionData {
  id: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes: string;
}

/**
 * 检查建议数据 (医生专属)
 */
export interface CheckupData {
  title: string;
  description: string;
  appointmentLink?: string;
}

/**
 * 转诊推荐数据 (医生专属)
 */
export interface ReferralData {
  department: string;
  specialist: string;
  reason: string;
}

/**
 * 报价状态
 */
export enum QuoteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * 报价数据 (社区专属)
 */
export interface QuoteData {
  id: string;
  jobId: string;
  jobTitle: string;
  quotedPrice: number;
  serviceTime: string;
  duration: string;
  message: string;
  status: QuoteStatus;
  expertId: string;
  expertName: string;
  createdAt: Date;
}

/**
 * 合同数据 (律师专属)
 */
export interface ContractData {
  id: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: Date;
}

/**
 * 保险方案数据 (保险专属)
 */
export interface PlanData {
  id: string;
  planName: string;
  coverageSummary: string;
  premiumAmount: number;
  premiumPeriod: string;
  detailUrl: string;
}

/**
 * 聊天消息
 */
export interface ChatMessage {
  id: string;
  type: MessageType;
  sender: MessageSender;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  /** 图片URL */
  imageUrl?: string;
  /** 语音时长(秒) */
  voiceDuration?: number;
  /** 处方数据 */
  prescriptionData?: PrescriptionData;
  /** 检查建议数据 */
  checkupData?: CheckupData;
  /** 转诊推荐数据 */
  referralData?: ReferralData;
  /** 报价数据 */
  quoteData?: QuoteData;
  /** 合同数据 */
  contractData?: ContractData;
  /** 保险方案数据 */
  planData?: PlanData;
}

// ============================================================================
// 配置类型
// ============================================================================

/**
 * 基础配置
 */
export interface BasicConfig {
  /** 聊天类型 */
  chatType: ChatType;
  /** 对方ID */
  recipientId: string;
  /** 会话ID (可选，新对话时为空) */
  conversationId?: string;
}

/**
 * 标题栏配置
 */
export interface TitleBarConfig {
  /** 主标题 (对方名称) */
  title: string;
  /** 副标题 (提示文字) */
  subtitle?: string;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 自定义返回回调 */
  onBack?: () => void;
}

/**
 * 认证徽章
 */
export interface Badge {
  /** 徽章类型 */
  type: 'verified' | 'vip' | 'expert' | 'business' | 'custom';
  /** 徽章文字 */
  label: string;
  /** 徽章颜色 */
  color?: string;
}

/**
 * 对方信息配置
 */
export interface RecipientConfig {
  /** 是否显示信息卡片 */
  show: boolean;
  /** 头像 */
  avatar?: string;
  /** 名称 */
  name: string;
  /** 职称/身份 */
  title?: string;
  /** 单位/机构 */
  organization?: string;
  /** 部门/科室 */
  department?: string;
  /** 认证徽章 */
  badges?: Badge[];
  /** 在线状态 */
  isOnline?: boolean;
  /** 扩展信息 */
  extraInfo?: { label: string; value: string }[];
}

/**
 * 消息类型配置
 */
export interface MessageConfig {
  /** 支持的消息类型 */
  supportedTypes: MessageType[];
}

/**
 * 附件菜单项
 */
export interface AttachmentItem {
  /** 唯一标识 */
  id: string;
  /** 图标组件 */
  icon: React.ComponentType<{ size: number; color: string }>;
  /** 显示文字 */
  label: string;
  /** 图标背景色 */
  color: string;
  /** 点击回调 */
  onPress: () => void;
}

/**
 * 附件菜单配置
 */
export interface AttachmentConfig {
  /** 菜单项列表 */
  items: AttachmentItem[];
}

/**
 * 通话功能配置
 */
export interface CallConfig {
  /** 是否支持语音通话 */
  enableVoiceCall: boolean;
  /** 是否支持视频通话 */
  enableVideoCall: boolean;
  /** 语音通话回调 */
  onVoiceCall?: () => void;
  /** 视频通话回调 */
  onVideoCall?: () => void;
}

/**
 * 快速模板
 */
export interface QuickTemplate {
  id: string;
  title: string;
  content: string;
  category?: string;
}

/**
 * 欢迎消息
 */
export interface WelcomeMessage {
  /** 发送者类型 */
  sender: MessageSender;
  /** 消息内容 */
  content: string;
  /** 延迟时间(毫秒) */
  delay?: number;
}

/**
 * 业务流程配置
 */
export interface WorkflowConfig {
  /** 欢迎消息列表 */
  welcomeMessages?: WelcomeMessage[];
  /** 是否显示AI助手提示 */
  showAIAssistant?: boolean;
  /** 最大追问次数 (0=无限制) */
  maxFollowUps?: number;
  /** 结束后是否显示评价 */
  showRating?: boolean;
  /** 响应时间承诺文案 */
  responseTimePromise?: string;
  /** 快速回复模板 */
  quickTemplates?: QuickTemplate[];
}

/**
 * ChatPage 完整配置
 */
export interface ChatPageConfig {
  /** 基础配置 */
  basic: BasicConfig;
  /** 标题栏配置 */
  titleBar: TitleBarConfig;
  /** 对方信息配置 */
  recipient: RecipientConfig;
  /** 消息类型配置 */
  message: MessageConfig;
  /** 附件菜单配置 */
  attachment: AttachmentConfig;
  /** 通话功能配置 */
  call: CallConfig;
  /** 业务流程配置 */
  workflow: WorkflowConfig;
}

// ============================================================================
// 预设配置工厂函数
// ============================================================================

/**
 * 获取医生聊天默认配置
 */
export const getDoctorChatConfig = (
  doctorId: string,
  doctorName: string,
  conversationId?: string
): Partial<ChatPageConfig> => ({
  basic: {
    chatType: ChatType.DOCTOR,
    recipientId: doctorId,
    conversationId,
  },
  titleBar: {
    title: doctorName,
    subtitle: '承诺30分钟内回复',
  },
  recipient: {
    show: true,
    name: doctorName,
  },
  message: {
    supportedTypes: [
      MessageType.TEXT,
      MessageType.IMAGE,
      MessageType.VOICE,
      MessageType.PRESCRIPTION,
      MessageType.CHECKUP,
      MessageType.REFERRAL,
    ],
  },
  call: {
    enableVoiceCall: true,
    enableVideoCall: true,
  },
  workflow: {
    showAIAssistant: true,
    maxFollowUps: 0,
    showRating: false,
  },
});

/**
 * 获取律师聊天默认配置
 */
export const getLawyerChatConfig = (
  lawyerId: string,
  lawyerName: string,
  lawFirm: string,
  conversationId?: string
): Partial<ChatPageConfig> => ({
  basic: {
    chatType: ChatType.LAWYER,
    recipientId: lawyerId,
    conversationId,
  },
  titleBar: {
    title: lawyerName,
    subtitle: lawFirm,
  },
  recipient: {
    show: true,
    name: lawyerName,
    organization: lawFirm,
  },
  message: {
    supportedTypes: [MessageType.TEXT, MessageType.IMAGE, MessageType.CONTRACT],
  },
  call: {
    enableVoiceCall: false,
    enableVideoCall: false,
  },
  workflow: {
    maxFollowUps: 3,
    showRating: true,
  },
});

/**
 * 获取保险顾问聊天默认配置
 */
export const getInsuranceChatConfig = (
  advisorId: string,
  advisorName: string,
  conversationId?: string
): Partial<ChatPageConfig> => ({
  basic: {
    chatType: ChatType.INSURANCE,
    recipientId: advisorId,
    conversationId,
  },
  titleBar: {
    title: advisorName,
    subtitle: '保险顾问',
  },
  recipient: {
    show: true,
    name: advisorName,
  },
  message: {
    supportedTypes: [MessageType.TEXT, MessageType.IMAGE, MessageType.PLAN],
  },
  call: {
    enableVoiceCall: true,
    enableVideoCall: false,
  },
  workflow: {
    maxFollowUps: 0,
    showRating: false,
  },
});

/**
 * 获取社区聊天默认配置
 */
export const getCommunityChatConfig = (
  recipientId: string,
  recipientName: string,
  conversationId?: string
): Partial<ChatPageConfig> => ({
  basic: {
    chatType: ChatType.COMMUNITY,
    recipientId,
    conversationId,
  },
  titleBar: {
    title: recipientName,
  },
  recipient: {
    show: false,
    name: recipientName,
  },
  message: {
    supportedTypes: [MessageType.TEXT, MessageType.IMAGE, MessageType.QUOTE],
  },
  call: {
    enableVoiceCall: false,
    enableVideoCall: false,
  },
  workflow: {
    maxFollowUps: 0,
    showRating: false,
  },
});

/**
 * 获取达人聊天默认配置
 */
export const getExpertChatConfig = (
  expertId: string,
  expertName: string,
  serviceType: string,
  conversationId?: string
): Partial<ChatPageConfig> => ({
  basic: {
    chatType: ChatType.EXPERT,
    recipientId: expertId,
    conversationId,
  },
  titleBar: {
    title: expertName,
    subtitle: serviceType,
  },
  recipient: {
    show: true,
    name: expertName,
  },
  message: {
    supportedTypes: [MessageType.TEXT, MessageType.IMAGE, MessageType.VOICE],
  },
  call: {
    enableVoiceCall: true,
    enableVideoCall: false,
  },
  workflow: {
    maxFollowUps: 0,
    showRating: false,
  },
});
