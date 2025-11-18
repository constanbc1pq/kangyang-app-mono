/**
 * ============================================================================
 * 私人医生服务 - 数据类型定义
 * ============================================================================
 *
 * Phase 19: 产品设计与定位
 * -------------------------
 *
 * 【产品定位】
 * 参考香港/新加坡/美国礼宾医疗（Concierge Medicine）模式
 * 为高净值用户提供会员制私人医生服务
 *
 * 【8大核心价值】
 * 1. 时间稀缺性 - 零等待，随时可及
 * 2. 关系持续性 - 长期跟踪，知根知底
 * 3. 服务专属性 - 一对一深度服务
 * 4. 资源稀缺性 - 顶级医生+医疗网络
 * 5. 主动管理 - 预防为主，而非被动就医
 * 6. 全家守护 - 家庭健康管理方案
 * 7. 隐私保护 - 高度私密，数据加密
 * 8. 礼宾服务 - 医疗管家全程陪同
 *
 * 【会员套餐体系】
 * - 基础版：¥19,800/年（试水用户）
 * - 标准版：¥39,800/年（主推，性价比最高）⭐推荐
 * - 尊享版：¥79,800/年（高净值个人，含健康管家）
 * - VIP家庭版：¥198,000/年（企业家/家族，全家守护）
 *
 * 【用户旅程】
 * 发现阶段 → 决策阶段 → 签约阶段 → 服务阶段 → 续费阶段
 *
 * 【信息架构】
 * 1. 医生列表（发现医生）
 * 2. 医生详情（深度了解）
 * 3. 套餐选择（会员分级）
 * 4. 签约流程（建立关系）
 * 5. 服务台（日常使用）
 * 6. 健康档案（完整病历）
 * 7. 健康计划（个性化方案）
 *
 * ============================================================================
 */

// ==================== 枚举类型定义 ====================

/**
 * 医院等级
 */
export enum HospitalLevel {
  TERTIARY_A = 'tertiary_a', // 三甲医院（如协和、华西）
  INTERNATIONAL = 'international', // 国际医院（如和睦家）
  PRIVATE = 'private', // 私立医院
}

/**
 * 医生职称
 */
export enum DoctorTitle {
  CHIEF_PHYSICIAN = 'chief_physician', // 主任医师
  ASSOCIATE_CHIEF = 'associate_chief', // 副主任医师
  ATTENDING = 'attending', // 主治医师
  RESIDENT = 'resident', // 住院医师
}

/**
 * 医生科室
 */
export enum DoctorDepartment {
  CARDIOLOGY = 'cardiology', // 心内科
  GASTROENTEROLOGY = 'gastroenterology', // 消化内科
  ENDOCRINOLOGY = 'endocrinology', // 内分泌科
  NEUROLOGY = 'neurology', // 神经内科
  RESPIRATORY = 'respiratory', // 呼吸内科
  NEPHROLOGY = 'nephrology', // 肾内科
  RHEUMATOLOGY = 'rheumatology', // 风湿免疫科
  ONCOLOGY = 'oncology', // 肿瘤科
  GENERAL_MEDICINE = 'general_medicine', // 全科医学
  NUTRITION = 'nutrition', // 营养科
  TRADITIONAL_CHINESE = 'traditional_chinese', // 中医科
  OTHER = 'other', // 其他
}

/**
 * 套餐等级
 */
export enum PackageLevel {
  BASIC = 'basic', // 基础版
  STANDARD = 'standard', // 标准版（推荐）
  PREMIUM = 'premium', // 尊享版
  VIP_FAMILY = 'vip_family', // VIP家庭版
}

/**
 * 订阅状态
 */
export enum SubscriptionStatus {
  ACTIVE = 'active', // 活跃中
  EXPIRED = 'expired', // 已过期
  CANCELLED = 'cancelled', // 已取消
  SUSPENDED = 'suspended', // 已暂停
}

/**
 * 问诊类型
 */
export enum ConsultationType {
  ONLINE_CHAT = 'online_chat', // 在线咨询（文字/图片）
  PHONE = 'phone', // 电话问诊
  VIDEO = 'video', // 视频问诊
  IN_PERSON = 'in_person', // 到院面诊
  HOME_VISIT = 'home_visit', // 上门出诊
}

/**
 * 问诊状态
 */
export enum ConsultationStatus {
  SCHEDULED = 'scheduled', // 已预约
  IN_PROGRESS = 'in_progress', // 进行中
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
  NO_SHOW = 'no_show', // 未赴约
}

/**
 * 健康计划类型
 */
export enum HealthPlanType {
  WEIGHT_LOSS = 'weight_loss', // 减重计划
  CHRONIC_DISEASE = 'chronic_disease', // 慢病管理（高血压/糖尿病）
  POST_SURGERY = 'post_surgery', // 术后康复
  PREGNANCY_PREP = 'pregnancy_prep', // 备孕调理
  ANTI_AGING = 'anti_aging', // 抗衰老管理
  OTHER = 'other', // 其他
}

// ==================== 基础数据结构 ====================

/**
 * 医生教育经历
 */
export interface DoctorEducation {
  school: string; // 学校名称（如：北京协和医学院）
  degree: string; // 学位（如：临床医学博士）
  major?: string; // 专业
  startYear: string; // 开始年份
  endYear: string; // 结束年份
}

/**
 * 医生海外培训经历
 */
export interface OverseasTraining {
  institution: string; // 机构名称（如：哈佛医学院麻省总医院）
  position: string; // 职位（如：访问学者/进修医师）
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  description?: string; // 描述
}

/**
 * 医生医院信息
 */
export interface DoctorHospital {
  name: string; // 医院名称
  level: HospitalLevel; // 医院等级
  department: string; // 科室
}

// ==================== 核心业务类型 ====================

/**
 * 私人医生
 */
export interface PrivateDoctor {
  id: string;
  name: string; // 姓名
  avatar: string; // 头像URL
  title: DoctorTitle; // 职称
  degree: string; // 学位（如：博士/硕士）
  department: DoctorDepartment; // 主要科室
  hospital: DoctorHospital; // 所属医院
  verified?: boolean; // 是否认证

  // 专业背景
  education: DoctorEducation[]; // 教育经历
  overseasTraining: OverseasTraining[]; // 海外培训
  certifications: string[]; // 资格认证
  academicPositions: string[]; // 学术职务（如：中华医学会XX分会委员）
  achievements: string[]; // 主要成就（如：发表SCI论文23篇）

  // 执业信息
  yearsOfExperience: number; // 从业年限
  specialties: string[]; // 专长领域（如：炎症性肠病诊治、消化道早癌筛查）
  philosophy: string; // 服务理念（引用格式）

  // 服务统计
  memberCount: number; // 会员数
  rating: number; // 评分（1-5）
  reviewCount: number; // 评价数
  isOnline: boolean; // 是否在线
  responseRate: number; // 响应率（0-100）

  // 服务套餐
  packages: PrivateDoctorPackage[]; // 提供的套餐列表

  createdAt: string;
  updatedAt: string;
}

/**
 * 私人医生服务套餐
 */
export interface PrivateDoctorPackage {
  id: string;
  doctorId: string; // 关联医生ID
  name: string; // 套餐名称
  level: PackageLevel; // 套餐等级
  duration: 'monthly' | 'quarterly' | 'yearly'; // 订阅周期
  price: number; // 价格
  originalPrice?: number; // 原价（用于显示优惠）
  isRecommended: boolean; // 是否推荐

  // 服务次数（-1表示不限次数）
  services: {
    onlineConsultations: number; // 在线咨询次数
    videoConsults: number; // 视频问诊次数
    phoneConsults: number; // 电话咨询次数
    inPersonVisits: number; // 到院面诊次数
    homeVisits: number; // 上门出诊次数
    healthAssessments?: number; // 健康评估次数
  };

  // 服务标准
  responseTime: string; // 响应时间承诺（如：2小时内）
  doctorDirectLine: boolean; // 是否提供医生直线
  directLineHours: string; // 直线可用时间（如：7×24 | 工作时间）

  // 附加服务
  perks: {
    annualCheckup: boolean; // 年度体检
    checkupValue?: number; // 体检价值（元）
    specialistReferral: number; // 专家会诊次数（-1不限）
    greenChannel: boolean; // 绿色通道（挂号/住院优先）
    healthManager: boolean; // 专属健康管家
    familyMembers: number; // 覆盖家庭成员数
    internationalReferral: boolean; // 国际转诊服务
  };

  description: string; // 套餐描述
  highlights: string[]; // 套餐亮点（3-5条）
}

/**
 * 用户订阅记录
 */
export interface DoctorSubscription {
  id: string;
  userId: string; // 用户ID
  doctorId: string; // 医生ID
  packageId: string; // 套餐ID

  startDate: string; // 开始日期
  endDate: string; // 结束日期
  status: SubscriptionStatus; // 订阅状态

  // 剩余服务次数
  remainingServices: {
    onlineConsultations: number;
    videoConsults: number;
    phoneConsults: number; // 电话咨询
    inPersonVisits: number;
    homeVisits: number;
    healthAssessments?: number;
  };

  // 健康管家信息（高级套餐）
  healthManager?: {
    id: string;
    name: string;
    avatar?: string;
    phone: string;
    wechat?: string;
    background: string; // 背景介绍（如：资深护士，10年临床经验）
  };

  // 联系方式
  doctorDirectLine?: string; // 医生直线电话

  // 付款信息
  payment: {
    amount: number;
    method: string; // 支付方式
    transactionId: string;
    paidAt: string;
  };

  // 续约提醒
  renewalReminder?: {
    reminderDate: string; // 提醒日期（到期前30天）
    reminded: boolean; // 是否已提醒
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * 问诊/咨询记录
 */
export interface ConsultationRecord {
  id: string;
  subscriptionId: string; // 订阅ID
  userId: string;
  doctorId: string;

  type: ConsultationType; // 问诊类型
  status: ConsultationStatus; // 问诊状态

  // 预约信息（预约类型需要）
  appointment?: {
    scheduledTime: string; // 预约时间
    location?: string; // 地点（到院/上门地址）
    duration: number; // 预计时长（分钟）
    reminderSent: boolean; // 是否已发送提醒
  };

  // 问诊内容
  chiefComplaint: string; // 主诉
  symptoms: string[]; // 症状列表
  symptomDuration: string; // 症状持续时间（如：3天）
  attachments: string[]; // 附件（照片/报告URL）

  // 医生诊断
  diagnosis?: string; // 诊断意见
  prescription?: Prescription[]; // 处方列表
  labTests?: string[]; // 建议检查项目
  advice: string; // 医嘱
  followUpDate?: string; // 复诊时间
  referral?: {
    specialty: string; // 转诊科室
    reason: string; // 转诊原因
    hospital?: string; // 推荐医院
  };

  // 时间记录
  startTime: string; // 开始时间
  endTime?: string; // 结束时间
  actualDuration?: number; // 实际时长（分钟）

  // 评价
  rating?: {
    score: number; // 评分（1-5）
    comment: string; // 评价内容
    tags: string[]; // 评价标签（如：耐心/专业/及时）
    createdAt: string;
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * 处方信息
 */
export interface Prescription {
  id: string;
  medicationName: string; // 药品名称
  dosage: string; // 剂量（如：50mg）
  frequency: string; // 频次（如：每日3次）
  duration: string; // 疗程（如：7天）
  instructions: string; // 用法说明
  notes?: string; // 备注
}

/**
 * 健康评估报告
 */
export interface HealthAssessment {
  id: string;
  subscriptionId: string;
  userId: string;
  doctorId: string;

  assessmentDate: string; // 评估日期
  overallScore: number; // 综合评分（0-100）
  level: 'excellent' | 'good' | 'fair' | 'poor'; // 健康等级

  // 各系统评分
  scores: {
    cardiovascular: number; // 心血管健康（0-100）
    metabolic: number; // 代谢健康
    digestive: number; // 消化系统
    respiratory: number; // 呼吸系统
    sleep: number; // 睡眠质量
    mental: number; // 心理健康
  };

  // 风险因素
  risks: HealthRisk[];

  // 医生建议
  doctorAdvice: string;
  nextAssessmentDate: string; // 下次评估日期

  // 关联数据
  vitalSigns?: {
    bloodPressureSystolic: number; // 收缩压
    bloodPressureDiastolic: number; // 舒张压
    heartRate: number; // 心率
    weight: number; // 体重
    height: number; // 身高
    bmi: number; // BMI
    bloodGlucose?: number; // 血糖
    bloodLipids?: {
      totalCholesterol?: number; // 总胆固醇
      ldl?: number; // 低密度脂蛋白
      hdl?: number; // 高密度脂蛋白
      triglycerides?: number; // 甘油三酯
    };
  };

  createdAt: string;
}

/**
 * 健康风险
 */
export interface HealthRisk {
  name: string; // 风险名称（如：甘油三酯偏高）
  level: 'low' | 'medium' | 'high'; // 风险等级
  currentValue?: string; // 当前值（如：2.3 mmol/L）
  normalRange?: string; // 正常范围（如：<1.7 mmol/L）
  description: string; // 描述
  recommendations: string[]; // 建议措施
}

/**
 * 健康计划
 */
export interface HealthPlan {
  id: string;
  subscriptionId: string;
  userId: string;
  doctorId: string;

  type: HealthPlanType; // 计划类型
  title: string; // 计划标题
  description: string; // 计划描述

  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused'; // 计划状态

  // 目标设置
  goals: HealthGoal[];

  // 总体进度
  progress: number; // 进度百分比（0-100）

  // 计划内容
  plans: {
    category: 'diet' | 'exercise' | 'medication' | 'lifestyle'; // 分类
    items: HealthPlanItem[];
  }[];

  // 里程碑
  milestones: Milestone[];

  // 医生点评
  doctorComments: DoctorComment[];

  createdAt: string;
  updatedAt: string;
}

/**
 * 健康目标
 */
export interface HealthGoal {
  metric: string; // 指标名称（如：体重）
  current: number; // 当前值
  target: number; // 目标值
  unit: string; // 单位（如：kg）
  deadline: string; // 截止日期
  achieved: boolean; // 是否达成
}

/**
 * 健康计划项
 */
export interface HealthPlanItem {
  title: string; // 标题
  description: string; // 描述
  frequency: string; // 频率（如：每天/每周3次）
  reminder: boolean; // 是否设置提醒
  completed?: boolean; // 是否完成（当日任务）
}

/**
 * 里程碑
 */
export interface Milestone {
  date: string; // 日期
  achievement: string; // 成就描述
  completed: boolean; // 是否完成
}

/**
 * 医生点评
 */
export interface DoctorComment {
  date: string;
  comment: string;
  encouragement?: string; // 鼓励语
}

/**
 * 医生用户评价
 */
export interface DoctorReview {
  id: string;
  subscriptionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  doctorId: string;

  score: number; // 评分（1-5）
  professionalism: number; // 专业度评分（1-5）
  serviceQuality: number; // 服务态度评分（1-5）

  comment: string; // 评价内容
  tags: string[]; // 评价标签

  subscriptionDuration: string; // 签约时长（如：签约2年）
  verified: boolean; // 是否真实订阅用户

  createdAt: string;
}

// ==================== 本地存储Key常量 ====================

export const PRIVATE_DOCTOR_STORAGE_KEYS = {
  DOCTORS: '@kangyang_private_doctors',
  /**
   * @deprecated 已弃用 - 订阅数据现在存储在 @kangyang_orders 的 metadata.subscription 中
   * 不再使用独立的 @kangyang_my_subscription 存储
   */
  MY_SUBSCRIPTION: '@kangyang_my_subscription',
  CONSULTATION_RECORDS: '@kangyang_consultation_records',
  HEALTH_ASSESSMENTS: '@kangyang_health_assessments',
  HEALTH_PLANS: '@kangyang_health_plans',
  DOCTOR_REVIEWS: '@kangyang_doctor_reviews',
  HEALTH_RECORDS: '@kangyang_health_records', // 健康档案
};

// ==================== 健康档案系统 ====================

/**
 * 医学健康档案（Medical Health Record）
 * 遵循医疗行业标准，支持家庭成员管理
 */
export interface MedicalHealthRecord {
  id: string;
  userId: string; // 所属用户ID
  familyMemberId?: string; // 关联的家庭成员ID（如果是家人的档案）
  subscriptionId: string; // 关联的订阅ID
  doctorId: string; // 主管医生ID

  // ===== 基本信息 =====
  basicInfo: {
    name: string;
    gender: 'male' | 'female';
    birthDate: string;
    age: number;
    bloodType?: string; // 血型（A/B/AB/O/Unknown）
    idNumber?: string; // 身份证号（加密存储）
    phone?: string;
    emergencyContact?: {
      name: string;
      relation: string;
      phone: string;
    };
  };

  // ===== 过敏史 =====
  allergies: {
    drugAllergies: string[]; // 药物过敏（如：青霉素、头孢类等）
    foodAllergies: string[]; // 食物过敏
    otherAllergies: string[]; // 其他过敏（花粉、动物毛发等）
    notes?: string; // 过敏反应描述
  };

  // ===== 既往病史 =====
  medicalHistory: {
    chronicDiseases: Array<{
      disease: string; // 疾病名称（如：高血压、糖尿病）
      diagnosisDate: string; // 确诊日期
      severity: 'mild' | 'moderate' | 'severe'; // 严重程度
      status: 'controlled' | 'uncontrolled' | 'cured'; // 控制状态
      notes?: string;
    }>;
    surgeries: Array<{
      surgery: string; // 手术名称
      date: string;
      hospital: string;
      notes?: string;
    }>;
    hospitalizations: Array<{
      reason: string;
      hospital: string;
      admissionDate: string;
      dischargeDate: string;
      diagnosis: string;
      notes?: string;
    }>;
  };

  // ===== 家族病史 =====
  familyHistory: {
    geneticDiseases: string[]; // 家族遗传病（如：糖尿病、高血压、心脏病）
    cancerHistory: string[]; // 癌症史
    notes?: string;
  };

  // ===== 用药史 =====
  medicationHistory: {
    currentMedications: Array<{
      name: string; // 药品名称
      dosage: string; // 剂量
      frequency: string; // 频率（如：每日3次）
      startDate: string;
      purpose: string; // 用途/适应症
      prescribedBy?: string; // 开方医生
      notes?: string;
    }>;
    pastMedications: Array<{
      name: string;
      period: string; // 用药时期
      reason: string; // 停药原因
    }>;
  };

  // ===== 生命体征记录 =====
  vitalSigns: {
    latestRecords: {
      bloodPressure?: { systolic: number; diastolic: number; date: string; unit: 'mmHg' }; // 血压
      heartRate?: { value: number; date: string; unit: 'bpm' }; // 心率
      bloodSugar?: { value: number; date: string; unit: 'mmol/L'; testType: 'fasting' | 'postprandial' }; // 血糖
      temperature?: { value: number; date: string; unit: '°C' }; // 体温
      weight?: { value: number; date: string; unit: 'kg' }; // 体重
      height?: { value: number; date: string; unit: 'cm' }; // 身高
      bmi?: { value: number; date: string }; // BMI
    };
    trends: string[]; // 趋势分析（如："血压偏高，需注意"）
  };

  // ===== 检查报告 =====
  labReports: Array<{
    id: string;
    type: 'blood' | 'urine' | 'imaging' | 'ecg' | 'other'; // 检查类型
    name: string; // 检查名称（如：血常规、胸部CT）
    date: string;
    hospital: string;
    results: string; // 结果描述
    abnormalItems?: string[]; // 异常项目
    doctorNotes?: string; // 医生备注
    reportUrl?: string; // 报告文件URL
  }>;

  // ===== 健康评估 =====
  healthAssessment: {
    overallScore: number; // 总体健康评分（0-100）
    lastAssessmentDate: string;
    riskFactors: Array<{
      factor: string; // 风险因素（如：吸烟、肥胖）
      level: 'low' | 'medium' | 'high'; // 风险等级
      recommendation: string; // 建议
    }>;
    healthGoals: Array<{
      goal: string; // 健康目标
      targetDate: string;
      progress: number; // 进度（0-100）
      status: 'not_started' | 'in_progress' | 'achieved';
    }>;
  };

  // ===== 生活方式 =====
  lifestyle: {
    smoking: 'never' | 'former' | 'current'; // 吸烟状态
    smokingDetails?: { years: number; frequency: string };
    alcohol: 'never' | 'occasional' | 'frequent'; // 饮酒
    exercise: {
      frequency: 'none' | 'light' | 'moderate' | 'intense'; // 运动频率
      type: string[]; // 运动类型
      duration?: number; // 每次时长（分钟）
    };
    diet: {
      pattern: 'balanced' | 'vegetarian' | 'high_protein' | 'other';
      restrictions: string[]; // 饮食限制
      waterIntake?: number; // 每日饮水量（ml）
    };
    sleep: {
      averageHours: number; // 平均睡眠时长
      quality: 'poor' | 'fair' | 'good' | 'excellent';
      issues?: string[]; // 睡眠问题
    };
  };

  // ===== 医生备注 =====
  doctorNotes: Array<{
    date: string;
    doctorId: string;
    doctorName: string;
    content: string; // 备注内容
    type: 'observation' | 'recommendation' | 'warning' | 'praise'; // 备注类型
  }>;

  // ===== 元数据 =====
  createdAt: string;
  updatedAt: string;
  lastReviewedBy?: string; // 最后审阅医生
  lastReviewedAt?: string;
}
