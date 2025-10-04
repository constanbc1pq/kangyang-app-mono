/**
 * 养老服务相关类型定义
 */

// 服务类型
export type ServiceType = 'elderly-care' | 'escort' | 'medical-staff';

// 资质类型
export type QualificationType = 'pcw' | 'hw' | 'rn' | 'en' | 'doctor' | 'therapist';

// 证书信息
export interface Certification {
  id: string;
  name: string;
  number: string; // 证书编号
  issuer: string; // 发证机构
  issueDate: string;
  expiryDate?: string;
  image: string; // 证书图片
  verified: boolean;
}

// 工作经历
export interface WorkHistory {
  id: string;
  institution: string; // 机构名称
  position: string; // 职位
  startDate: string;
  endDate?: string;
  description: string;
}

// 护理人员信息
export interface Caregiver {
  id: string;
  name: string;
  age: number;
  avatar: string;
  serviceType: ServiceType; // 服务类型
  qualification: QualificationType; // 资质类型
  qualificationBadge: string; // 资质徽章文本
  specialty: string; // 专长
  experience: string; // 从业经验
  rating: number; // 评分
  reviews: number; // 评价数
  completedJobs: number; // 完成订单数
  responseTime: string; // 响应时间
  hourlyRate: number; // 时薪
  dailyRate: number; // 日薪
  monthlyRate: number; // 月薪
  certifications: Certification[]; // 证书列表
  skills: string[]; // 技能标签
  languages: string[]; // 语言能力
  verified: boolean; // 是否认证
  featured: boolean; // 是否推荐
  description: string; // 简介
  detailedIntro: string; // 详细介绍
  workHistory: WorkHistory[]; // 工作经历
  available: boolean; // 是否可预约
}

// 服务套餐
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  prices: Array<{
    type: 'PCW' | 'HW' | 'RN';
    price: number;
    unit: string;
    save?: string;
  }>;
  features: string[];
  popular: boolean;
  note: string;
  discount?: string;
}

// 资质详情
export interface QualificationDetail {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  services: string[];
  requirements: string;
  badge?: string;
}

// 评价信息
export interface CaregiverReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  caregiverId: string;
  orderId: string;
  serviceType: string;
  rating: number;
  content: string;
  images?: string[];
  date: string;
  helpful: number;
  reply?: {
    content: string;
    date: string;
  };
}

// FAQ项
export interface FAQItem {
  question: string;
  answer: string;
}

// 信任徽章
export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}
