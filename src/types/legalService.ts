/**
 * ============================================================================
 * 遗嘱及法律服务 - 数据类型定义
 * ============================================================================
 *
 * Phase 29: 法律服务模块数据类型
 *
 * 【服务定位】
 * 为中老年人提供遗嘱制作、意定监护、财产规划、法律咨询等服务
 * 解决老年人在遗嘱继承、赡养纠纷、财产保护、诈骗防范等方面的法律需求
 *
 * 【法律尊享计划体系】
 * - 基础版：免费（AI咨询、知识库）
 * - 标准版：¥1,980/年（图文咨询、文书模板）
 * - 尊享版：¥4,980/年（电话/视频咨询、合同审查）
 * - VIP家庭版：¥9,800/年（全家服务、案件代理）
 *
 * ============================================================================
 */

// ==================== 29.1 核心类型定义 ====================

/**
 * 遗嘱类型
 */
export enum WillType {
  SELF_WRITTEN = 'self_written', // 自书遗嘱（全部手写）
  WITNESSED = 'witnessed', // 代书遗嘱（需2名以上见证人）
  AUDIO_VIDEO = 'audio_video', // 录音录像遗嘱（需2名以上见证人）
  NOTARIZED = 'notarized', // 公证遗嘱（效力最高）
}

/**
 * 遗嘱状态
 */
export enum WillStatus {
  DRAFT = 'draft', // 草稿
  PENDING_REVIEW = 'pending_review', // 待审核（律师审核中）
  EFFECTIVE = 'effective', // 已生效
  EXECUTED = 'executed', // 已执行
  REVOKED = 'revoked', // 已作废
}

/**
 * 受益人信息
 */
export interface Beneficiary {
  id: string;
  name: string; // 姓名
  relationship: string; // 关系（配偶/子女/孙辈/其他）
  idNumber: string; // 身份证号
  phone?: string; // 联系电话
  inheritanceShare: number; // 继承份额（百分比，如：50表示50%）
  inheritanceItems?: string[]; // 特定继承物品（如：房产、车辆等）
  conditions?: string; // 继承条件（如：完成学业后继承）
}

/**
 * 见证人信息
 */
export interface Witness {
  id: string;
  name: string; // 姓名
  idNumber: string; // 身份证号
  phone: string; // 联系电话
  relationship: string; // 与立遗嘱人关系（朋友/邻居/律师等）
  signedAt?: string; // 签名时间
}

/**
 * 遗产项目
 */
export interface Estate {
  id: string;
  category: 'property' | 'deposit' | 'stock' | 'vehicle' | 'jewelry' | 'antique' | 'other'; // 资产类别
  name: string; // 名称（如：北京市海淀区XX小区X号楼X单元XXX室）
  description?: string; // 描述
  estimatedValue: number; // 估值（元）
  ownership: string; // 所有权证明（如：房产证号、存单号等）
  location?: string; // 位置/存放地点
  notes?: string; // 备注
}

/**
 * 遗嘱接口
 */
export interface Will {
  id: string;
  userId: string; // 立遗嘱人ID
  type: WillType; // 遗嘱类型
  status: WillStatus; // 状态
  title: string; // 标题

  // 立遗嘱人信息
  testatorName: string; // 立遗嘱人姓名
  testatorIdNumber: string; // 身份证号
  testatorAge: number; // 年龄

  // 遗嘱内容
  estates: Estate[]; // 遗产清单
  beneficiaries: Beneficiary[]; // 受益人列表
  executor?: string; // 遗嘱执行人姓名
  executorPhone?: string; // 执行人电话
  executorIdNumber?: string; // 执行人身份证号

  // 见证与公证
  witnesses?: Witness[]; // 见证人（代书/录音录像遗嘱需要）
  notaryOffice?: string; // 公证处名称
  notaryNumber?: string; // 公证书编号
  notaryDate?: string; // 公证日期
  notaryDocument?: string; // 公证书文件URL

  // 特殊条款
  specialClauses?: string[]; // 特殊条款（如：附条件继承、特殊安排）
  restrictions?: string; // 限制条件

  // 法律审核
  reviewedBy?: string; // 审核律师ID
  reviewComments?: string; // 审核意见
  reviewedAt?: string; // 审核时间

  // 版本管理
  version: number; // 版本号
  previousVersionId?: string; // 上一版本ID

  // 时间戳
  createdAt: string;
  updatedAt: string;
  effectiveDate?: string; // 生效日期
  revokedAt?: string; // 作废时间
  executedAt?: string; // 执行时间
}

// ==================== 29.2 监护与财产类型 ====================

/**
 * 监护职责类型
 */
export enum GuardianDuty {
  DAILY_CARE = 'daily_care', // 生活照料
  MEDICAL_DECISION = 'medical_decision', // 医疗决策
  PROPERTY_MANAGEMENT = 'property_management', // 财产管理
  LEGAL_REPRESENTATION = 'legal_representation', // 法律代理
}

/**
 * 监护人信息
 */
export interface Guardian {
  id: string;
  name: string; // 姓名
  relationship: string; // 关系
  idNumber: string; // 身份证号
  phone: string; // 联系电话
  address: string; // 住址
  duties: GuardianDuty[]; // 监护职责
  propertyLimit?: number; // 财产处置限额（元）
  requiresApproval: boolean; // 重大事项是否需要监督人批准
}

/**
 * 意定监护协议
 */
export interface GuardianshipAgreement {
  id: string;
  userId: string; // 被监护人ID
  status: 'draft' | 'notarized' | 'effective' | 'terminated'; // 状态

  // 被监护人信息
  wardName: string; // 被监护人姓名
  wardIdNumber: string; // 身份证号
  wardAge: number; // 年龄

  // 监护人
  guardians: Guardian[]; // 监护人（可设置多人）
  primaryGuardianId: string; // 主监护人ID

  // 监督人（可选）
  supervisorName?: string; // 监督人姓名
  supervisorPhone?: string; // 监督人电话
  supervisorIdNumber?: string; // 监督人身份证号

  // 监护范围
  scope: {
    dailyCare: boolean; // 日常生活照料
    medicalDecision: boolean; // 医疗决策权
    propertyManagement: boolean; // 财产管理权
    financialDecision: boolean; // 金融决策权
    realEstateDisposal: boolean; // 房产处置权
  };

  // 财产管理
  monthlyAllowance?: number; // 每月生活费额度
  propertyDisposalLimit?: number; // 财产处置单次限额
  accountAccessRights?: string[]; // 账户访问权限

  // 公证信息
  notaryOffice?: string; // 公证处
  notaryNumber?: string; // 公证书编号
  notaryDate?: string; // 公证日期
  notaryDocument?: string; // 公证书文件URL

  // 时间
  createdAt: string;
  updatedAt: string;
  effectiveDate?: string; // 生效日期
  terminatedAt?: string; // 终止时间
}

/**
 * 资产项
 */
export interface Asset {
  id: string;
  category: 'real_estate' | 'deposit' | 'stock' | 'fund' | 'insurance' | 'pension' | 'vehicle' | 'jewelry' | 'other';
  name: string; // 资产名称
  description?: string; // 描述
  currentValue: number; // 当前价值（元）
  ownership: string; // 所有权证明
  location?: string; // 位置
  acquiredDate?: string; // 取得日期
  notes?: string; // 备注
}

/**
 * 负债项
 */
export interface Liability {
  id: string;
  category: 'mortgage' | 'loan' | 'guarantee' | 'debt' | 'other';
  name: string; // 负债名称
  description?: string; // 描述
  amount: number; // 金额（元）
  creditor: string; // 债权人
  dueDate?: string; // 到期日
  notes?: string; // 备注
}

/**
 * 财产清单
 */
export interface PropertyInventory {
  id: string;
  userId: string;
  assets: Asset[]; // 资产列表
  liabilities: Liability[]; // 负债列表
  totalAssetValue: number; // 总资产价值
  totalLiabilityValue: number; // 总负债价值
  netWorth: number; // 净资产
  lastUpdated: string; // 最后更新时间
  createdAt: string;
}

// ==================== 29.3 律师服务类型 ====================

/**
 * 律师专业领域
 */
export enum LawyerSpecialty {
  INHERITANCE = 'inheritance', // 遗嘱继承
  ELDER_CARE = 'elder_care', // 养老赡养
  PROPERTY = 'property', // 房产纠纷
  MARRIAGE = 'marriage', // 婚姻家庭
  CONTRACT = 'contract', // 合同纠纷
  CONSUMER_RIGHTS = 'consumer_rights', // 消费者权益
  MEDICAL = 'medical', // 医疗纠纷
  LABOR = 'labor', // 劳动争议
}

/**
 * 咨询类型
 */
export enum LegalConsultationType {
  AI = 'ai', // AI咨询（免费）
  TEXT = 'text', // 图文咨询
  PHONE = 'phone', // 电话咨询
  VIDEO = 'video', // 视频咨询
  HOME_VISIT = 'home_visit', // 上门咨询
}

/**
 * 案件状态
 */
export enum CaseStatus {
  PENDING = 'pending', // 待接受
  ACCEPTED = 'accepted', // 已接受
  IN_PROGRESS = 'in_progress', // 进行中
  MEDIATION = 'mediation', // 调解中
  LITIGATION = 'litigation', // 诉讼中
  COMPLETED = 'completed', // 已完成
  CLOSED = 'closed', // 已关闭
}

/**
 * 律师档案
 */
export interface LawyerProfile {
  id: string;
  name: string; // 姓名
  avatar?: string; // 头像
  licenseNumber: string; // 执业证号
  lawFirm: string; // 律所名称
  specialties: LawyerSpecialty[]; // 专业领域
  yearsOfExperience: number; // 执业年限

  // 教育背景
  education: string; // 如：中国政法大学 法学硕士

  // 服务统计
  caseCount: number; // 办案数量
  successRate: number; // 胜诉率（百分比）
  rating: number; // 评分（0-5）
  reviewCount: number; // 评价数

  // 服务价格
  textConsultationPrice: number; // 图文咨询价格（元/次）
  phoneConsultationPrice: number; // 电话咨询价格（元/30分钟）
  videoConsultationPrice: number; // 视频咨询价格（元/小时）
  homeVisitPrice: number; // 上门咨询价格（元/次）

  // 在线状态
  isOnline: boolean;
  responseRate: number; // 响应率（百分比）
  averageResponseTime: number; // 平均响应时间（分钟）

  // 简介
  introduction: string; // 个人简介
  achievements?: string[]; // 主要成就

  createdAt: string;
  updatedAt: string;
}

/**
 * 咨询记录
 */
export interface LegalConsultation {
  id: string;
  userId: string; // 用户ID
  lawyerId: string; // 律师ID
  type: LegalConsultationType; // 咨询类型
  status: 'pending' | 'answered' | 'closed'; // 状态

  // 咨询内容
  category: LawyerSpecialty; // 咨询类别
  title: string; // 标题
  question: string; // 问题描述
  attachments?: string[]; // 附件（图片、文件URL）

  // 律师回复
  answer?: string; // 回复内容
  answerAttachments?: string[]; // 回复附件
  answeredAt?: string; // 回复时间

  // 追问（图文咨询支持3轮追问）
  followUps?: {
    question: string;
    answer?: string;
    askedAt: string;
    answeredAt?: string;
  }[];

  // 评价
  rating?: number; // 评分（1-5）
  review?: string; // 评价内容
  reviewedAt?: string; // 评价时间

  // 费用
  price: number; // 价格
  paid: boolean; // 是否已支付

  createdAt: string;
  updatedAt: string;
}

/**
 * 法律案件
 */
export interface LegalCase {
  id: string;
  userId: string; // 用户ID
  lawyerId: string; // 代理律师ID
  status: CaseStatus; // 案件状态

  // 案件信息
  category: LawyerSpecialty; // 案件类别
  title: string; // 案件标题
  description: string; // 案情描述

  // 当事人
  plaintiff: string; // 原告
  defendant: string; // 被告

  // 诉求
  claims: string; // 诉讼请求
  expectedOutcome: string; // 期望结果

  // 证据
  evidence: {
    id: string;
    name: string; // 证据名称
    type: string; // 证据类型
    fileUrl: string; // 文件URL
    uploadedAt: string;
  }[];

  // 进展
  timeline: {
    id: string;
    event: string; // 事件
    description: string; // 描述
    happenedAt: string; // 发生时间
  }[];

  // 文书
  documents: {
    id: string;
    name: string; // 文书名称（如：起诉状、答辩状）
    fileUrl: string;
    uploadedAt: string;
  }[];

  // 费用
  lawyerFee: number; // 律师费
  courtFee?: number; // 诉讼费
  totalCost: number; // 总费用

  // 结果
  verdict?: string; // 判决结果
  completedAt?: string; // 完成时间

  createdAt: string;
  updatedAt: string;
}

// ==================== 29.4 知识与服务类型 ====================

/**
 * 法律文章
 */
export interface LegalArticle {
  id: string;
  category: LawyerSpecialty; // 分类
  title: string; // 标题
  summary: string; // 摘要
  content: string; // 正文（Markdown格式）
  coverImage?: string; // 封面图
  author: string; // 作者
  authorTitle?: string; // 作者职称
  tags: string[]; // 标签
  viewCount: number; // 阅读量
  likeCount: number; // 点赞数
  collectCount: number; // 收藏数
  publishedAt: string; // 发布时间
  createdAt: string;
  updatedAt: string;
}

/**
 * 法律视频课程
 */
export interface LegalVideo {
  id: string;
  category: LawyerSpecialty; // 分类
  title: string; // 标题
  description: string; // 描述
  coverImage: string; // 封面图
  videoUrl: string; // 视频URL
  duration: number; // 时长（秒）
  lecturer: string; // 讲师
  lecturerTitle: string; // 讲师职称
  tags: string[]; // 标签
  viewCount: number; // 观看量
  likeCount: number; // 点赞数
  collectCount: number; // 收藏数

  // 课程目录
  chapters?: {
    id: string;
    title: string;
    startTime: number; // 开始时间（秒）
  }[];

  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 案例库
 */
export interface CaseStudy {
  id: string;
  category: LawyerSpecialty; // 分类
  title: string; // 案例标题
  summary: string; // 案例摘要

  // 案情
  background: string; // 案件背景
  plaintiff: string; // 原告（匿名处理）
  defendant: string; // 被告（匿名处理）
  dispute: string; // 争议焦点

  // 法律分析
  legalBasis: string[]; // 法律依据
  courtOpinion: string; // 法院观点
  verdict: string; // 判决结果

  // 警示教育
  insights: string; // 案例启示
  preventionTips: string[]; // 预防建议

  tags: string[]; // 标签
  viewCount: number; // 阅读量
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 法律文书模板
 */
export interface DocumentTemplate {
  id: string;
  category: LawyerSpecialty; // 分类
  name: string; // 模板名称（如：赡养协议、遗嘱模板）
  description: string; // 描述

  // 模板内容
  content: string; // 模板正文（支持变量替换）
  variables: {
    key: string; // 变量名（如：{{甲方姓名}}）
    label: string; // 显示名称
    type: 'text' | 'number' | 'date' | 'select';
    options?: string[]; // 选项（type为select时）
    required: boolean;
  }[];

  // 填写指引
  guide: string; // 填写说明
  notes: string[]; // 注意事项

  downloadCount: number; // 下载次数
  createdAt: string;
  updatedAt: string;
}

/**
 * 风险预警记录
 */
export interface RiskAlert {
  id: string;
  userId: string;
  level: 'low' | 'medium' | 'high' | 'critical'; // 风险等级
  category: 'scam' | 'contract' | 'investment' | 'health_product' | 'other'; // 风险类别

  // 风险信息
  title: string; // 标题
  description: string; // 描述
  triggers: string[]; // 触发因素（如：接到理财电话、准备购买保健品）

  // AI分析
  riskAnalysis: string; // 风险分析
  suggestions: string[]; // 建议措施

  // 案例参考
  relatedCases?: string[]; // 相关案例ID

  status: 'active' | 'handled' | 'dismissed'; // 状态
  handledAt?: string; // 处理时间
  createdAt: string;
  updatedAt: string;
}

/**
 * 法律体检报告
 */
export interface LegalCheckup {
  id: string;
  userId: string;

  // 体检问卷结果
  answers: {
    question: string;
    answer: string;
  }[];

  // 风险评估
  risks: {
    category: '遗嘱' | '财产' | '赡养' | '监护' | '其他';
    level: 'low' | 'medium' | 'high';
    description: string;
    suggestions: string[];
  }[];

  // 总体评分
  overallScore: number; // 0-100分
  riskLevel: 'low' | 'medium' | 'high'; // 总体风险等级

  // 改进建议
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string; // 建议行动
    reason: string; // 原因
    solutionLink?: string; // 解决方案链接（如：跳转到遗嘱制作）
  }[];

  createdAt: string;
}

// ==================== 29.5 法律尊享计划服务类型 ====================

/**
 * 尊享计划等级
 */
export enum MembershipTier {
  FREE = 'free', // 免费版
  STANDARD = 'standard', // 标准版
  PREMIUM = 'premium', // 尊享版
  VIP_FAMILY = 'vip_family', // VIP家庭版
}

/**
 * 服务配额
 */
export interface ServiceQuota {
  // AI咨询
  aiConsultations: number; // AI咨询次数（-1表示无限）

  // 律师咨询
  textConsultations: number; // 图文咨询次数
  phoneConsultations: number; // 电话咨询次数（分钟）
  videoConsultations: number; // 视频咨询次数（分钟）
  homeVisits: number; // 上门咨询次数

  // 文书服务
  contractReviews: number; // 合同审查次数
  documentCreations: number; // 文书代写次数

  // 高级服务
  caseRepresentation: boolean; // 是否支持案件代理
  priorityService: boolean; // 是否享有优先服务
  dedicatedLawyer: boolean; // 是否有专属律师

  // 家庭服务（VIP家庭版）
  familyMembers: number; // 家庭成员数量
}

/**
 * 法律尊享计划
 */
export interface LegalMembership {
  id: string;
  userId: string;
  tier: MembershipTier; // 计划等级
  status: 'active' | 'expired' | 'cancelled'; // 状态

  // 配额
  quota: ServiceQuota; // 总配额
  usedQuota: ServiceQuota; // 已用配额

  // 家庭成员（VIP家庭版）
  familyMembers?: {
    id: string;
    name: string;
    relationship: string; // 关系
    phone: string;
  }[];

  // 专属律师（尊享版及以上）
  dedicatedLawyerId?: string;

  // 订阅信息
  price: number; // 价格（元/年）
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  autoRenew: boolean; // 是否自动续费

  createdAt: string;
  updatedAt: string;
}

// ==================== 数据存储Key ====================

export const LEGAL_SERVICE_STORAGE_KEYS = {
  WILLS: '@kangyang_wills', // 遗嘱
  GUARDIANSHIP_AGREEMENTS: '@kangyang_guardianship_agreements', // 监护协议
  PROPERTY_INVENTORIES: '@kangyang_property_inventories', // 财产清单
  LAWYERS: '@kangyang_lawyers', // 律师列表
  CONSULTATIONS: '@kangyang_legal_consultations', // 咨询记录
  CASES: '@kangyang_legal_cases', // 案件
  ARTICLES: '@kangyang_legal_articles', // 文章
  VIDEOS: '@kangyang_legal_videos', // 视频
  CASE_STUDIES: '@kangyang_case_studies', // 案例
  TEMPLATES: '@kangyang_document_templates', // 文书模板
  RISK_ALERTS: '@kangyang_risk_alerts', // 风险预警
  LEGAL_CHECKUPS: '@kangyang_legal_checkups', // 法律体检
  MEMBERSHIPS: '@kangyang_legal_memberships', // 法律尊享计划
};
