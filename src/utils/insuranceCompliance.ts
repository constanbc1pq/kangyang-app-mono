/**
 * 保险合规检查机制
 * Insurance Compliance Checking Mechanism
 *
 * 确保平台运营符合银保监会相关规定，保护用户权益
 */

import CryptoJS from 'crypto-js';

// ==================== 1. 产品信息披露审核 ====================

/**
 * 产品信息完整性检查
 */
export interface ProductComplianceCheck {
  hasProductName: boolean;
  hasCompanyInfo: boolean;
  hasCoverageDetails: boolean;
  hasPremiumInfo: boolean;
  hasExclusionInfo: boolean;
  hasWaitingPeriod: boolean;
  hasPolicyDocument: boolean;
  isCompliant: boolean;
  missingFields: string[];
}

export const checkProductCompliance = (product: {
  name?: string;
  companyName?: string;
  coverageDetails?: any[];
  premiumStartFrom?: number;
  exclusions?: string[];
  waitingPeriod?: string;
  policyDocumentUrl?: string;
}): ProductComplianceCheck => {
  const checks = {
    hasProductName: !!product.name,
    hasCompanyInfo: !!product.companyName,
    hasCoverageDetails: !!product.coverageDetails && product.coverageDetails.length > 0,
    hasPremiumInfo: !!product.premiumStartFrom && product.premiumStartFrom > 0,
    hasExclusionInfo: true, // 免责条款（可选，但建议有）
    hasWaitingPeriod: true, // 等待期（部分产品无等待期）
    hasPolicyDocument: !!product.policyDocumentUrl,
  };

  const missingFields: string[] = [];
  if (!checks.hasProductName) missingFields.push('产品名称');
  if (!checks.hasCompanyInfo) missingFields.push('保险公司信息');
  if (!checks.hasCoverageDetails) missingFields.push('保障详情');
  if (!checks.hasPremiumInfo) missingFields.push('保费信息');
  if (!checks.hasPolicyDocument) missingFields.push('产品条款链接');

  return {
    ...checks,
    isCompliant: missingFields.length === 0,
    missingFields,
  };
};

/**
 * 费率透明度检查
 */
export const checkPremiumTransparency = (product: {
  premiumStartFrom?: number;
  premiumFactors?: string[];
  calculationMethod?: string;
}): {
  isTransparent: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];

  if (!product.premiumStartFrom) {
    warnings.push('缺少保费起价信息');
  }

  // 建议说明保费影响因素
  if (!product.premiumFactors || product.premiumFactors.length === 0) {
    warnings.push('建议说明影响保费的因素（如年龄、性别、保额等）');
  }

  return {
    isTransparent: warnings.length === 0,
    warnings,
  };
};

// ==================== 2. 顾问资质验证 ====================

/**
 * 顾问资质数据结构
 */
export interface AdvisorQualification {
  advisorId: string;
  name: string;
  certificateNumber: string; // 执业证号
  certificateType: '保险代理人' | '保险经纪人' | '保险公估人';
  issuingAuthority: string; // 发证机关
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'suspended' | 'revoked';
  verifiedAt?: string;
}

/**
 * 验证顾问资质
 */
export const verifyAdvisorQualification = (
  qualification: AdvisorQualification
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. 检查证书号格式
  if (!qualification.certificateNumber || qualification.certificateNumber.length < 10) {
    errors.push('执业证号格式不正确');
  }

  // 2. 检查有效期
  const now = new Date();
  const expiryDate = new Date(qualification.expiryDate);

  if (expiryDate < now) {
    errors.push('执业证书已过期');
  } else {
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry < 30) {
      warnings.push(`执业证书将于${daysUntilExpiry}天后过期，请及时续期`);
    }
  }

  // 3. 检查状态
  if (qualification.status !== 'valid') {
    errors.push(`执业证书状态异常：${qualification.status}`);
  }

  // 4. 建议定期核验
  if (qualification.verifiedAt) {
    const lastVerified = new Date(qualification.verifiedAt);
    const daysSinceVerification = Math.floor(
      (now.getTime() - lastVerified.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceVerification > 180) {
      warnings.push('建议重新核验顾问资质（已超过6个月）');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ==================== 3. 销售行为监控 ====================

/**
 * 禁止的销售话术关键词
 */
const PROHIBITED_SALES_KEYWORDS = [
  '保证收益',
  '承诺回报',
  '稳赚不赔',
  '零风险',
  '保本保息',
  '高额返现',
  '必买',
  '限时优惠（虚假）',
  '夸大保障',
  '贬低竞品',
];

/**
 * 检测不当销售话术
 */
export const detectProhibitedSales = (content: string): {
  hasViolation: boolean;
  violations: { keyword: string; context: string }[];
} => {
  const violations: { keyword: string; context: string }[] = [];

  PROHIBITED_SALES_KEYWORDS.forEach(keyword => {
    const index = content.indexOf(keyword);
    if (index !== -1) {
      const start = Math.max(0, index - 20);
      const end = Math.min(content.length, index + keyword.length + 20);
      const context = content.substring(start, end);
      violations.push({ keyword, context });
    }
  });

  return {
    hasViolation: violations.length > 0,
    violations,
  };
};

/**
 * 咨询 vs 销售行为检查
 */
export const checkServiceBoundary = (action: {
  type: 'consultation' | 'direct_sale' | 'recommendation';
  description: string;
}): {
  isCompliant: boolean;
  reason?: string;
} => {
  // 平台只能提供咨询和推荐，不能直接销售
  if (action.type === 'direct_sale') {
    return {
      isCompliant: false,
      reason: '平台仅提供咨询服务，不得直接销售保险产品。请引导用户通过保险公司官方渠道购买。',
    };
  }

  // 推荐时必须客观公正
  if (action.type === 'recommendation') {
    const prohibited = detectProhibitedSales(action.description);
    if (prohibited.hasViolation) {
      return {
        isCompliant: false,
        reason: `推荐话术存在不当内容：${prohibited.violations.map(v => v.keyword).join('、')}`,
      };
    }
  }

  return {
    isCompliant: true,
  };
};

// ==================== 4. 用户隐私保护 ====================

/**
 * 加密密钥（实际应该从环境变量读取）
 */
const ENCRYPTION_KEY = 'KangYang-Insurance-2024-Secret-Key';

/**
 * 加密敏感健康数据
 */
export const encryptHealthData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

/**
 * 解密健康数据
 */
export const decryptHealthData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * 脱敏处理 - 手机号
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 脱敏处理 - 身份证号
 */
export const maskIdCard = (idCard: string): string => {
  if (!idCard || idCard.length !== 18) return idCard;
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
};

/**
 * 脱敏处理 - 姓名
 */
export const maskName = (name: string): string => {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

/**
 * 脱敏处理 - 银行卡号
 */
export const maskBankCard = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 16) return cardNumber;
  return cardNumber.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2');
};

/**
 * 健康数据使用授权检查
 */
export interface HealthDataConsent {
  userId: string;
  consentGiven: boolean;
  consentDate: string;
  purpose: string[];
  expiryDate?: string;
}

export const checkHealthDataConsent = (consent: HealthDataConsent): {
  canUse: boolean;
  reason?: string;
} => {
  if (!consent.consentGiven) {
    return {
      canUse: false,
      reason: '用户未授权使用健康数据',
    };
  }

  if (consent.expiryDate) {
    const expiry = new Date(consent.expiryDate);
    const now = new Date();
    if (expiry < now) {
      return {
        canUse: false,
        reason: '健康数据使用授权已过期',
      };
    }
  }

  return {
    canUse: true,
  };
};

// ==================== 5. 投诉处理流程 ====================

/**
 * 投诉类型
 */
export type ComplaintType =
  | 'product_misleading' // 产品误导
  | 'advisor_misconduct' // 顾问不当行为
  | 'privacy_violation' // 隐私泄露
  | 'service_quality' // 服务质量
  | 'claim_assistance' // 理赔协助
  | 'other';

/**
 * 投诉数据结构
 */
export interface Complaint {
  id: string;
  userId: string;
  type: ComplaintType;
  subject: string;
  description: string;
  evidence?: string[]; // 证据文件URL
  status: 'submitted' | 'reviewing' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  assignedTo?: string;
}

/**
 * 投诉优先级评估
 */
export const assessComplaintPriority = (complaint: {
  type: ComplaintType;
  description: string;
}): 'low' | 'medium' | 'high' | 'urgent' => {
  // 隐私泄露为最高优先级
  if (complaint.type === 'privacy_violation') {
    return 'urgent';
  }

  // 顾问不当行为为高优先级
  if (complaint.type === 'advisor_misconduct') {
    return 'high';
  }

  // 检查描述中的关键词
  const urgentKeywords = ['恶意', '欺诈', '威胁', '强制'];
  if (urgentKeywords.some(keyword => complaint.description.includes(keyword))) {
    return 'urgent';
  }

  // 默认为中等优先级
  return 'medium';
};

/**
 * 投诉处理时效要求
 */
export const getComplaintDeadline = (priority: Complaint['priority']): {
  responseDeadline: number; // 响应时限（小时）
  resolutionDeadline: number; // 解决时限（小时）
} => {
  switch (priority) {
    case 'urgent':
      return { responseDeadline: 2, resolutionDeadline: 24 };
    case 'high':
      return { responseDeadline: 4, resolutionDeadline: 48 };
    case 'medium':
      return { responseDeadline: 24, resolutionDeadline: 72 };
    case 'low':
      return { responseDeadline: 48, resolutionDeadline: 168 };
  }
};

/**
 * 检查投诉处理是否超时
 */
export const isComplaintOverdue = (complaint: Complaint): {
  isOverdue: boolean;
  overdueHours?: number;
  stage: 'response' | 'resolution';
} => {
  const deadlines = getComplaintDeadline(complaint.priority);
  const now = new Date();
  const createdAt = new Date(complaint.createdAt);
  const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  // 如果未响应且超过响应时限
  if (complaint.status === 'submitted' && hoursPassed > deadlines.responseDeadline) {
    return {
      isOverdue: true,
      overdueHours: Math.floor(hoursPassed - deadlines.responseDeadline),
      stage: 'response',
    };
  }

  // 如果未解决且超过解决时限
  if (
    (complaint.status === 'reviewing' || complaint.status === 'submitted') &&
    hoursPassed > deadlines.resolutionDeadline
  ) {
    return {
      isOverdue: true,
      overdueHours: Math.floor(hoursPassed - deadlines.resolutionDeadline),
      stage: 'resolution',
    };
  }

  return {
    isOverdue: false,
    stage: 'response',
  };
};

// ==================== 6. 合规文档与免责声明 ====================

/**
 * 隐私政策文本（符合银保监会要求）
 */
export const PRIVACY_POLICY = `
# 康养APP保险规划服务隐私政策

## 一、信息收集
我们收集以下信息以提供保险规划服务：
1. 基本信息：姓名、年龄、性别、联系方式
2. 健康信息：健康状况、病史、家族病史（仅用于保险规划建议）
3. 财务信息：收入、资产、负债（仅用于保险规划建议）

## 二、信息使用
收集的信息仅用于以下目的：
1. 提供个性化保险规划建议
2. 匹配合适的保险产品
3. 协助理赔服务
4. 改进平台服务质量

## 三、信息保护
1. 所有健康数据采用AES256加密存储
2. 敏感信息在展示时进行脱敏处理
3. 严格的访问权限控制
4. 定期安全审计

## 四、信息共享
未经用户明确授权，我们不会将用户信息共享给第三方。
在以下情况下，可能需要共享信息：
1. 用户授权的保险公司（用于投保或理赔）
2. 监管机构要求
3. 法律法规规定

## 五、用户权利
用户有权：
1. 查询个人信息
2. 更正错误信息
3. 删除个人信息
4. 撤回授权

## 六、联系方式
如有隐私相关问题，请联系：privacy@kangyang.com

本政策最后更新日期：2024年11月12日
`;

/**
 * 用户授权书模板
 */
export const AUTHORIZATION_TEMPLATE = `
# 信息使用授权书

本人（姓名）___________，身份证号___________，授权康养APP：

□ 收集本人健康信息，用于保险规划建议
□ 将本人信息提供给___________保险公司，用于投保/理赔
□ 使用本人信息进行产品推荐

授权有效期：自____年__月__日至____年__月__日

本人已充分阅读并理解《康养APP保险规划服务隐私政策》，自愿提供上述信息。

授权人签名：___________
日期：____年__月__日
`;

/**
 * 生成合规报告
 */
export const generateComplianceReport = (
  period: { start: string; end: string }
): {
  productComplianceRate: number;
  advisorComplianceRate: number;
  complaintResolutionRate: number;
  privacyIncidents: number;
  recommendations: string[];
} => {
  // Mock数据，实际应该从数据库统计
  return {
    productComplianceRate: 98.5, // 产品信息合规率
    advisorComplianceRate: 100, // 顾问资质合规率
    complaintResolutionRate: 95.2, // 投诉解决率
    privacyIncidents: 0, // 隐私事件数量
    recommendations: [
      '建议定期核验顾问资质，确保所有顾问执业证书有效',
      '加强销售话术审核，避免出现不当销售行为',
      '完善用户授权流程，确保信息使用合法合规',
    ],
  };
};
