// 社区相关类型定义

// 作者信息
export interface Author {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  verified: boolean;
  followers?: number;
  articles?: number;
}

// 文章
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: Author;
  publishTime: string;
  readTime: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  category: string;
  tags: string[];
  image?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

// 圈子成员
export interface CircleMember {
  id: string;
  name: string;
  avatar?: string;
  level: string;
  posts: number;
  joinDate: string;
}

// 圈子管理员
export interface CircleAdmin {
  name: string;
  avatar?: string;
  title: string;
  role: string;
}

// 圈子帖子
export interface CirclePost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    level: string;
    verified: boolean;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

// 圈子
export interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  todayPosts: number;
  image?: string;
  coverImage?: string;
  tags: string[];
  isVerified: boolean;
  createdDate: string;
  rules: string[];
  admins: CircleAdmin[];
  isJoined: boolean;
  category: string;
}

// 话题
export interface Topic {
  id: string;
  name: string;
  description: string;
  posts: number;
  participants: number;
  views: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  tags: string[];
  image?: string;
  createdDate: string;
  isFollowing: boolean;
}

// 评论
export interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

// 视频
export interface Video {
  id: string;
  title: string;
  description: string;
  author: Author;
  publishTime: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  tags: string[];
  thumbnail: string;
  videoUrl: string;
  isLiked?: boolean;
  isFollowed?: boolean;
}

// 用户社区数据（本地存储）
export interface UserCommunityData {
  bookmarkedArticles: string[]; // 收藏的文章ID列表
  likedArticles: string[]; // 点赞的文章ID列表
  joinedCircles: string[]; // 加入的圈子ID列表
  followedTopics: string[]; // 关注的话题ID列表
  circlePostLikes: string[]; // 点赞的圈子帖子ID列表
  commentLikes: string[]; // 点赞的评论ID列表
  likedVideos: string[]; // 点赞的视频ID列表
  followedAuthors: string[]; // 关注的作者ID列表
}

// ==================== 零工经济众包平台类型定义 ====================

// 零工类型（大类）
export enum JobType {
  LIFE_SERVICE = 'life_service', // 生活服务
  CARE = 'care', // 陪护照料
  SKILL = 'skill', // 技能服务
  CREATIVE = 'creative', // 创意设计
  EDUCATION = 'education', // 教学培训
  OTHER = 'other', // 其他
}

// 服务类型（具体服务）
export enum ServiceType {
  // 生活服务类
  HOUSEKEEPING = 'housekeeping', // 家政保洁
  REPAIR = 'repair', // 维修安装
  MOVING = 'moving', // 搬家运输
  DELIVERY = 'delivery', // 跑腿代购
  MEAL_PREP = 'meal_prep', // 做饭配餐
  PET_CARE = 'pet_care', // 宠物照顾
  GARDENING = 'gardening', // 园艺绿化

  // 陪护照料类
  ESCORT = 'escort', // 陪诊陪护
  CHILDCARE = 'childcare', // 儿童看护
  ELDERCARE = 'eldercare', // 老人照料
  NURSING = 'nursing', // 专业护理
  COMPANION = 'companion', // 陪伴聊天

  // 技能服务类
  TUTORING = 'tutoring', // 家教辅导
  TRANSLATION = 'translation', // 翻译服务
  PHOTOGRAPHY = 'photography', // 摄影拍照
  MAKEUP = 'makeup', // 化妆造型
  DRIVING = 'driving', // 代驾陪驾
  IT_SUPPORT = 'it_support', // 电脑维护
  PHONE_TEACH = 'phone_teach', // 手机教学

  // 创意设计类
  GRAPHIC_DESIGN = 'graphic_design', // 平面设计
  VIDEO_EDITING = 'video_editing', // 视频剪辑
  WRITING = 'writing', // 文案写作
  HANDICRAFT = 'handicraft', // 手工制作

  // 教学培训类
  FITNESS = 'fitness', // 健身教练
  YOGA = 'yoga', // 瑜伽教学
  DANCE = 'dance', // 舞蹈教学
  MUSIC = 'music', // 音乐教学
  PAINTING = 'painting', // 绘画教学
  COOKING = 'cooking', // 烹饪教学

  // 其他
  MASSAGE = 'massage', // 按摩理疗
  BEAUTY = 'beauty', // 美容美甲
  OTHER = 'other', // 其他服务
}

// 零工需求状态
export enum JobStatus {
  PUBLISHED = 'published', // 已发布
  IN_PROGRESS = 'in_progress', // 进行中
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
}

// 零工需求
export interface ServiceJob {
  id: string;
  title: string; // 需求标题
  description: string; // 需求描述
  jobType: JobType; // 零工类型
  serviceType: ServiceType; // 具体服务类型

  // 雇主信息
  employerId: string;
  employerName: string;
  employerAvatar?: string;

  // 服务信息
  location: {
    address: string;
    district: string;
    latitude?: number;
    longitude?: number;
  };
  serviceTime: string; // 服务时间（格式化字符串）
  duration: string; // 预计时长（如"2小时"）
  budget: {
    min: number;
    max: number;
    currency: string;
  };

  // 特殊要求
  requirements?: string[]; // 要求标签
  images?: string[]; // 图片列表

  // 关联健康数据
  relatedMemberId?: string; // 关联的家庭成员ID
  healthTags?: string[]; // 健康标签（如"高血压"、"糖尿病"）

  // 状态信息
  status: JobStatus;
  isUrgent: boolean; // 是否紧急
  isHighReward: boolean; // 是否高佣金

  // 报名信息
  applicants: number; // 报名人数
  applicantIds: string[]; // 报名达人ID列表
  selectedExpertId?: string; // 选中的达人ID

  // 统计信息
  views: number;
  publishTime: string;
  createdAt: string;
  updatedAt: string;
}

// 达人等级
export enum ExpertLevel {
  NEWBIE = 'newbie', // 新手达人 (0-10单)
  QUALITY = 'quality', // 优质达人 (10单+，好评率≥90%)
  GOLD = 'gold', // 金牌达人 (50单+，好评率≥95%)
  HALL_OF_FAME = 'hall_of_fame', // 殿堂级达人 (200单+，好评率≥98%)
}

// 达人认证状态
export enum ExpertCertStatus {
  NONE = 'none', // 未认证
  PENDING = 'pending', // 审核中
  VERIFIED = 'verified', // 已认证
  REJECTED = 'rejected', // 已拒绝
}

// 达人
export interface Expert {
  id: string;
  userId: string; // 关联用户ID
  name: string;
  avatar?: string;

  // 认证信息
  certStatus: ExpertCertStatus;
  realNameVerified: boolean; // 实名认证
  skillVerified: boolean; // 技能认证
  level: ExpertLevel;

  // 服务信息
  serviceTypes: ServiceType[]; // 提供的服务类型
  serviceArea: string[]; // 服务区域（区县列表）
  introduction: string; // 个人介绍
  skillDescription: string; // 技能描述
  certificates?: string[]; // 证书图片列表
  showcaseImages?: string[]; // 服务展示图片
  showcaseVideos?: string[]; // 服务展示视频

  // 价格信息
  pricing: {
    [key in ServiceType]?: {
      basePrice: number; // 基础价格
      unit: string; // 单位（如"小时"、"次"）
    };
  };

  // 统计信息
  totalOrders: number; // 总订单数
  completedOrders: number; // 完成订单数
  rating: number; // 评分（1-5）
  goodReviewRate: number; // 好评率（0-100）
  responseTime: string; // 平均响应时间

  // 徽章
  badges: string[]; // 徽章列表（如"金牌服务"、"快速响应"）

  // 状态
  isOnline: boolean; // 是否在线接单

  createdAt: string;
  updatedAt: string;
}

// 订单状态
export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment', // 待支付
  PENDING_SERVICE = 'pending_service', // 待服务（已支付）
  IN_SERVICE = 'in_service', // 服务中
  PENDING_CONFIRM = 'pending_confirm', // 待验收
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
  REFUNDED = 'refunded', // 已退款
}

// 服务订单
export interface ServiceOrder {
  id: string;
  jobId: string; // 关联需求ID

  // 双方信息
  employerId: string;
  employerName: string;
  employerAvatar?: string;
  expertId: string;
  expertName: string;
  expertAvatar?: string;

  // 服务信息
  serviceType: ServiceType;
  serviceTitle: string;
  serviceDescription: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  scheduledTime: string; // 预约时间
  duration: string; // 时长

  // 价格信息
  quotedPrice: number; // 报价
  finalPrice: number; // 最终价格
  currency: string;

  // 服务记录
  checkInTime?: string; // 签到时间
  checkInPhotos?: string[]; // 签到照片
  checkOutTime?: string; // 签退时间
  checkOutPhotos?: string[]; // 签退照片
  serviceNotes?: string; // 服务备注

  // 评价信息
  employerReview?: {
    rating: number;
    tags: string[];
    comment: string;
    images?: string[];
    createdAt: string;
  };
  expertReview?: {
    rating: number;
    tags: string[];
    comment: string;
    createdAt: string;
  };

  // 状态信息
  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}

// 聊天消息类型
export enum MessageType {
  TEXT = 'text', // 文本
  IMAGE = 'image', // 图片
  VOICE = 'voice', // 语音
  QUOTE = 'quote', // 报价卡片
  ORDER = 'order', // 订单卡片
  SYSTEM = 'system', // 系统消息
}

// 报价卡片状态
export enum QuoteStatus {
  PENDING = 'pending', // 待回复
  ACCEPTED = 'accepted', // 已接受
  REJECTED = 'rejected', // 已拒绝
  EXPIRED = 'expired', // 已过期
}

// 聊天消息
export interface ChatMessage {
  id: string;
  conversationId: string;

  // 发送者信息
  senderId: string;
  senderName: string;
  senderAvatar?: string;

  // 消息内容
  type: MessageType;
  content: string; // 文本消息内容或图片URL或语音URL

  // 报价卡片数据（当type为QUOTE时）
  quoteData?: {
    jobId: string;
    jobTitle: string;
    price: number;
    currency: string;
    message: string;
    estimatedDuration: string;
    status: QuoteStatus;
  };

  // 订单卡片数据（当type为ORDER时）
  orderData?: {
    orderId: string;
    serviceTitle: string;
    price: number;
    status: OrderStatus;
  };

  // 语音消息数据（当type为VOICE时）
  voiceData?: {
    duration: number; // 时长（秒）
    url: string;
  };

  // 状态信息
  isRead: boolean;
  timestamp: string;
  createdAt: string;
}

// 会话关联内容类型
export enum ConversationRelatedType {
  JOB = 'job', // 零工需求
  ITEM = 'item', // 二手商品
  ORDER = 'order', // 订单
  NONE = 'none', // 无关联
}

// 聊天会话
export interface ChatConversation {
  id: string;

  // 参与者信息
  participant1Id: string;
  participant1Name: string;
  participant1Avatar?: string;
  participant2Id: string;
  participant2Name: string;
  participant2Avatar?: string;

  // 关联内容（需求/商品/订单）
  relatedType: ConversationRelatedType;
  relatedId?: string;
  relatedTitle?: string;
  relatedThumbnail?: string;

  // 最后消息
  lastMessage: string;
  lastMessageTime: string;

  // 未读消息数
  unreadCount: {
    [userId: string]: number;
  };

  // 状态
  isPinned: boolean; // 是否置顶

  createdAt: string;
  updatedAt: string;
}

// 二手商品分类
export enum ItemCategory {
  ELECTRONICS = 'electronics', // 数码电子
  HOME_APPLIANCES = 'home_appliances', // 家用电器
  FURNITURE = 'furniture', // 家具家居
  CLOTHING = 'clothing', // 服装配饰
  BOOKS = 'books', // 图书文化
  SPORTS = 'sports', // 运动户外
  TOYS = 'toys', // 玩具母婴
  BEAUTY = 'beauty', // 美妆个护
  KITCHEN = 'kitchen', // 厨房用品
  TOOLS = 'tools', // 工具设备
  PLANTS = 'plants', // 花卉绿植
  PETS = 'pets', // 宠物用品
  HEALTH = 'health', // 健康器械
  OTHER = 'other', // 其他物品
}

// 商品成色
export enum ItemCondition {
  NEW = 'new', // 全新
  LIKE_NEW = 'like_new', // 99成新
  EXCELLENT = 'excellent', // 95成新
  GOOD = 'good', // 9成新
  FAIR = 'fair', // 8成新
  USED = 'used', // 使用痕迹明显
}

// 交易方式
export enum TradeMethod {
  PICKUP = 'pickup', // 自取
  DELIVERY = 'delivery', // 邮寄
}

// 商品状态
export enum ItemStatus {
  AVAILABLE = 'available', // 在售
  RESERVED = 'reserved', // 已预订
  SOLD = 'sold', // 已售出
  DELETED = 'deleted', // 已删除
}

// 二手商品
export interface SecondHandItem {
  id: string;

  // 卖家信息
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerRating?: number; // 信用分

  // 商品信息
  title: string;
  description: string;
  category: ItemCategory;
  images: string[]; // 图片列表，第一张为封面

  // 价格信息
  currentPrice: number;
  originalPrice?: number; // 原价（用于显示对比）
  isFree: boolean; // 是否免费赠送
  isNegotiable: boolean; // 是否可议价
  currency: string;

  // 商品状态
  condition: ItemCondition;
  purchaseTime?: string; // 购买时间
  usageDuration?: string; // 使用时长

  // 交易信息
  tradeMethods: TradeMethod[]; // 交易方式
  location: {
    address: string;
    district: string;
    latitude?: number;
    longitude?: number;
  };

  // 状态信息
  status: ItemStatus;
  views: number;
  favorites: number; // 收藏数

  publishTime: string;
  createdAt: string;
  updatedAt: string;
}

// 内容帖子分类
export enum PostCategory {
  EXPERIENCE = 'experience', // 经验分享
  REVIEW = 'review', // 评测
  TUTORIAL = 'tutorial', // 教程
  QA = 'qa', // 问答
  DAILY = 'daily', // 日常
  OTHER = 'other', // 其他
}

// 内容帖子（统一的内容类型，整合Article/CirclePost）
export interface CommunityPost {
  id: string;

  // 作者信息
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorLevel?: ExpertLevel; // 如果是达人，显示等级
  authorVerified: boolean;

  // 内容信息
  title: string;
  content: string; // 富文本内容
  summary?: string; // 摘要
  category: PostCategory;
  tags: string[];

  // 媒体内容
  coverImage?: string; // 封面图
  images?: string[]; // 图片列表
  videos?: string[]; // 视频列表

  // 关联内容（可选）
  relatedJobId?: string; // 关联需求
  relatedItemId?: string; // 关联商品
  relatedExpertId?: string; // 关联达人

  // 互动数据
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  shares: number;

  // 状态
  isPinned: boolean; // 是否置顶

  publishTime: string;
  createdAt: string;
  updatedAt: string;
}

// 本地存储Key常量
export const STORAGE_KEYS = {
  COMMUNITY_JOBS: '@kangyang_community_jobs',
  COMMUNITY_EXPERTS: '@kangyang_community_experts',
  COMMUNITY_ORDERS: '@kangyang_community_orders',
  COMMUNITY_SECONDHAND: '@kangyang_community_secondhand',
  COMMUNITY_POSTS: '@kangyang_community_posts',
  COMMUNITY_CHATS: '@kangyang_community_chats',
  COMMUNITY_MESSAGES: '@kangyang_community_messages',
  MY_EXPERT_PROFILE: '@kangyang_my_expert_profile',
  USER_COMMUNITY_DATA: '@kangyang_user_community_data',
  POST_LIKES: '@kangyang_post_likes',
  POST_FAVORITES: '@kangyang_post_favorites',
  POST_COMMENTS: '@kangyang_post_comments',
};
