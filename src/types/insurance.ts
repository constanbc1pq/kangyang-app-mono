/**
 * 保险规划模块类型定义
 * Insurance Planning Module Type Definitions
 */

// ==================== 保险类别与标签 ====================

/**
 * 保险类别枚举
 */
export type InsuranceCategory =
  | 'medical' // 医疗险
  | 'critical_illness' // 重疾险
  | 'annuity' // 年金险
  | 'life' // 寿险
  | 'accident' // 意外险
  | 'long_term_care' // 长期护理险
  | 'wealth_inheritance'; // 财富传承

/**
 * 年龄段标签
 */
export type AgeGroup = '50-60' | '60-70' | '70+' | 'all';

/**
 * 健康状况标签
 */
export type HealthStatus = 'standard' | 'subhealth' | 'chronic_disease';

/**
 * 产品特色标签
 */
export type ProductFeature =
  | 'no_medical_exam' // 免体检
  | 'fast_claim' // 快速理赔
  | 'guaranteed_renewal' // 保证续保
  | 'high_value' // 高性价比
  | 'big_company' // 大公司
  | 'specialized'; // 专业化

// ==================== 保险产品 ====================

/**
 * 保险产品接口
 */
export interface InsuranceProduct {
  id: string;
  name: string; // 产品名称
  companyId: string; // 保险公司ID
  companyName: string; // 保险公司名称
  companyLogo: string; // 公司Logo
  category: InsuranceCategory; // 险种
  subCategory?: string; // 子类型

  // 基本信息
  description: string; // 产品描述
  highlights: string[]; // 产品亮点
  coverageDetails: CoverageItem[]; // 保障责任清单

  // 投保规则
  ageRange: { min: number; max: number }; // 年龄限制
  healthRequirements: string; // 健康要求
  occupationLimits?: string[]; // 职业限制
  coverageAmountRange: { min: number; max: number }; // 保额范围

  // 费率信息
  premiumStartFrom: number; // 起步价
  paymentPeriods: string[]; // 交费期限选项
  coveragePeriods: string[]; // 保障期限选项

  // 产品文件
  policyDocumentUrl?: string; // 保险条款PDF
  productManualUrl?: string; // 产品说明书

  // 购买链接
  purchaseUrl: string; // 外部购买链接
  affiliateCode?: string; // 推广代码

  // 产品标签
  tags: ProductFeature[]; // 产品特色标签
  ageGroups: AgeGroup[]; // 适用年龄段
  healthStatuses: HealthStatus[]; // 适用健康状况

  // 销售信息
  salesStatus: 'active' | 'suspended' | 'limited'; // 销售状态
  monthSales?: number; // 月度销量
  rating: number; // 评分 (0-5)
  reviewCount: number; // 评价数量

  // 时间戳
  launchDate: string; // 上线时间
  updatedAt: string; // 更新时间
}

/**
 * 保障项目
 */
export interface CoverageItem {
  name: string; // 保障项名称
  type: 'primary' | 'additional'; // 主险/附加险
  description: string; // 保障说明
  coverageAmount?: string; // 保额
  claimRatio?: string; // 赔付比例
  waitingPeriod?: string; // 等待期
}

// ==================== 保险公司 ====================

/**
 * 保险公司接口
 */
export interface InsuranceCompany {
  id: string;
  name: string; // 公司名称
  logo: string; // Logo
  foundedYear: number; // 成立年份
  registeredCapital: string; // 注册资本

  // 评级信息
  cbircRating?: string; // 银保监会评级
  thirdPartyRating?: string; // 第三方评级
  solvencyRatio: string; // 偿付能力充足率

  // 服务数据
  claimTimeAvg: string; // 平均理赔时效
  claimSuccessRate: string; // 理赔获赔率
  customerServiceHotline: string; // 客服热线

  // 产品信息
  productCount: number; // 在售产品数量

  // 公司简介
  description: string;
  website: string;
}

// ==================== 保险顾问 ====================

/**
 * 保险顾问接口
 */
export interface InsuranceAdvisor {
  id: string;
  name: string; // 姓名
  avatar: string; // 头像
  employeeId: string; // 工号
  organization: string; // 所属机构

  // 专业资质
  certifications: string[]; // 资格证书 (AFP, CFP, 保险代理资格证等)
  yearsOfExperience: number; // 从业年限
  specialties: string[]; // 擅长领域

  // 服务数据
  clientsServed: number; // 服务客户数
  satisfactionRate: number; // 好评率 (0-100)
  avgResponseTime: string; // 平均响应时间

  // 服务区域
  serviceCities: string[]; // 服务城市

  // 在线状态
  onlineStatus: 'online' | 'busy' | 'offline';

  // 简介
  introduction: string;
  successCases?: string[]; // 成功案例
}

// ==================== 咨询服务（完全免费）====================

/**
 * 咨询类型
 */
export type ConsultationType = 'text' | 'phone' | 'video' | 'home_visit';

/**
 * 咨询状态
 */
export type ConsultationStatus = 'pending' | 'replied' | 'completed' | 'cancelled';

/**
 * 咨询记录（完全免费）
 */
export interface InsuranceConsultation {
  id: string;
  userId: string;
  advisorId: string;
  advisorName: string;
  advisorAvatar: string;

  type: ConsultationType;
  status: ConsultationStatus;

  // 咨询内容
  question: string;
  questionImages?: string[];
  tags?: string[]; // 需求标签

  // 回复内容
  reply?: string;
  replyImages?: string[];
  replyAt?: string;

  // 追问
  followUps?: {
    question: string;
    reply?: string;
    createdAt: string;
  }[];

  // 评价
  rating?: number;
  review?: string;

  // 预约信息 (电话/视频/上门)
  appointmentDate?: string;
  appointmentTime?: string;
  duration?: number; // 时长(分钟)
  address?: string; // 上门地址

  createdAt: string;
  updatedAt: string;
}

// ==================== AI 规划（完全免费）====================

/**
 * 保障需求类型
 */
export type CoverageNeed = 'medical' | 'critical_illness' | 'pension' | 'inheritance' | 'accident';

/**
 * 风险偏好
 */
export type RiskPreference = 'conservative' | 'balanced' | 'aggressive';

/**
 * AI 规划请求
 */
export interface InsurancePlanningRequest {
  id: string;
  userId: string;

  // Step 1: 基本信息
  basicInfo: {
    age: number;
    gender: 'male' | 'female';
    occupation: string;
    annualIncome: number;
    familyStructure: string; // 家庭结构描述
  };

  // Step 2: 健康状况
  healthInfo: {
    hasMedicalHistory: boolean;
    medicalHistory?: string[];
    hasAbnormalCheckup: boolean;
    abnormalCheckupDetails?: string;
    isOnMedication: boolean;
    medications?: string[];
  };

  // Step 3: 保障需求
  coverageNeeds: CoverageNeed[];

  // Step 4: 预算
  budgetRange: {
    min: number;
    max: number;
  };

  // Step 5: 已有保单
  existingPolicies?: {
    productName: string;
    category: InsuranceCategory;
    coverageAmount: number;
    annualPremium: number;
  }[];

  // Step 6: 风险偏好
  riskPreference: RiskPreference;

  createdAt: string;
}

/**
 * AI 规划方案
 */
export interface InsurancePlan {
  id: string;
  requestId: string;
  userId: string;

  // 保障缺口分析
  coverageGapAnalysis: {
    category: InsuranceCategory;
    currentCoverage: number; // 当前保障
    recommendedCoverage: number; // 建议保障
    gap: number; // 缺口
    priority: 'high' | 'medium' | 'low'; // 优先级
  }[];

  // 推荐方案
  recommendations: {
    tier: 'basic' | 'standard' | 'premium'; // 方案等级
    totalAnnualPremium: number; // 年保费
    products: {
      productId: string;
      productName: string;
      category: InsuranceCategory;
      coverageAmount: number;
      annualPremium: number;
      reason: string; // 推荐理由
    }[];
  }[];

  // AI 解释
  explanation: string;

  createdAt: string;
}

/**
 * 智能核保结果
 */
export interface UnderwritingResult {
  id: string;
  userId: string;
  productId: string;

  // 健康告知
  healthDisclosures: {
    question: string;
    answer: boolean;
    details?: string;
  }[];

  // 核保结论
  conclusion: 'standard' | 'extra_premium' | 'exclusion' | 'declined';
  conclusionDetails: string;

  // 建议
  suggestions?: string[];

  createdAt: string;
}

// ==================== 保单管理 ====================

/**
 * 保单状态
 */
export type PolicyStatus = 'active' | 'lapsed' | 'claiming' | 'claimed' | 'surrendered';

/**
 * 用户保单 (手动录入)
 */
export interface UserInsurancePolicy {
  id: string;
  userId: string;

  // 保单基本信息
  policyNumber: string; // 保单号
  productName: string; // 产品名称
  companyName: string; // 保险公司
  category: InsuranceCategory; // 险种

  // 人员信息
  policyHolder: string; // 投保人
  insured: string; // 被保人
  beneficiary: string; // 受益人

  // 保障信息
  coverageAmount: number; // 保额
  annualPremium: number; // 年保费
  paymentPeriod: string; // 交费期限
  coveragePeriod: string; // 保障期限
  effectiveDate: string; // 生效日期

  // 缴费记录
  paymentsMade: number; // 已交期数
  nextPaymentDate?: string; // 下次缴费日期
  nextPaymentAmount?: number; // 下次缴费金额

  // 保单状态
  status: PolicyStatus;

  // 电子保单
  policyDocuments?: {
    name: string;
    url: string;
    uploadedAt: string;
  }[];

  // 关联顾问
  advisorId?: string;
  advisorName?: string;

  // 备注
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

// ==================== 理赔协助 ====================

/**
 * 理赔类型
 */
export type ClaimType = 'illness' | 'accident' | 'medical' | 'death';

/**
 * 理赔协助状态
 */
export type ClaimAssistanceStatus = 'submitted' | 'reviewing' | 'additional_materials_needed' | 'completed';

/**
 * 理赔协助申请
 */
export interface ClaimAssistanceRequest {
  id: string;
  userId: string;
  policyId: string; // 关联保单ID

  // 出险信息
  claimType: ClaimType;
  incidentDate: string; // 出险时间
  incidentLocation: string; // 出险地点
  incidentDescription: string; // 事故经过

  // 理赔金额
  claimedAmount: number; // 申请金额
  approvedAmount?: number; // 核定金额
  paidAmount?: number; // 实付金额

  // 理赔材料
  documents: {
    type: string; // 材料类型 (诊断书/发票/病历/身份证明等)
    name: string;
    url: string;
    uploadedAt: string;
  }[];

  // 协助状态
  status: ClaimAssistanceStatus;

  // 协助记录
  assistanceNotes: {
    content: string;
    createdBy: string; // 顾问ID
    createdAt: string;
  }[];

  // 顾问信息
  assignedAdvisorId?: string;
  assignedAdvisorName?: string;

  createdAt: string;
  updatedAt: string;
}

// ==================== 知识库 ====================

/**
 * 文章分类
 */
export type ArticleCategory = 'basics' | 'product_review' | 'claim_guide' | 'pitfall_avoidance';

/**
 * 保险文章
 */
export interface InsuranceArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string;
  coverImage?: string;
  author: string;
  readTime: number; // 阅读时长(分钟)
  viewCount: number;
  likeCount: number;
  relatedArticles?: string[]; // 相关文章ID
  tags: string[];
  publishedAt: string;
}

/**
 * 保险视频
 */
export interface InsuranceVideo {
  id: string;
  title: string;
  category: 'basics' | 'product_test' | 'claim_practice';
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number; // 时长(秒)
  viewCount: number;
  author: string;
  tags: string[];
  publishedAt: string;
}

/**
 * 理赔案例
 */
export interface ClaimCase {
  id: string;
  title: string;
  category: InsuranceCategory;
  companyName: string;

  // 案例信息
  incidentDescription: string; // 出险经过
  claimProcess: string; // 理赔过程
  claimResult: string; // 理赔结果
  claimedAmount: number;
  paidAmount: number;
  claimDuration: string; // 理赔时效

  // 点评
  advisorComment?: string; // 顾问点评
  lessons: string[]; // 理赔启示

  tags: string[];
  publishedAt: string;
}

/**
 * 保险问答
 */
export interface InsuranceQA {
  id: string;
  category: 'product_consultation' | 'claim_help' | 'purchase_question';
  question: string;
  questionImages?: string[];
  askedBy: string;
  askedAt: string;

  // 回答
  answer?: string;
  answerImages?: string[];
  answeredBy?: string; // 顾问ID
  answeredByName?: string;
  answeredAt?: string;

  // 互动
  likeCount: number;
  commentCount: number;

  status: 'pending' | 'answered';
}
