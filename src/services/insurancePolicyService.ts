/**
 * 保单管理服务（用户手动录入）
 * Insurance Policy Management Service
 *
 * 用户可手动录入和管理自己的保险保单，方便集中查看和管理所有保障
 */

import { InsuranceCategory } from '@/types/insurance';

// 保单数据结构
export interface InsurancePolicy {
  id: string;
  userId: string;
  category: InsuranceCategory;
  policyNumber: string; // 保单号
  productName: string;
  companyName: string;
  insuredPerson: string; // 被保险人
  policyHolder: string; // 投保人
  beneficiary: string; // 受益人
  coverageAmount: number; // 保额（万元）
  annualPremium: number; // 年缴保费（元）
  paymentPeriod: string; // 缴费期限（如"20年交"）
  coveragePeriod: string; // 保障期限（如"保至70岁"、"终身"）
  policyStartDate: string; // 保单生效日期
  policyEndDate?: string; // 保单结束日期
  nextPaymentDate?: string; // 下次缴费日期
  status: 'active' | 'expired' | 'surrendered' | 'claim_pending'; // 保单状态
  notes: string; // 备注
  documents: PolicyDocument[]; // 保单文件
  createdAt: string;
  updatedAt: string;
}

// 保单文件
export interface PolicyDocument {
  id: string;
  policyId: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'other';
  fileSize: number; // 字节
  fileUrl: string;
  uploadedAt: string;
}

// 添加保单请求
export interface AddPolicyRequest {
  category: InsuranceCategory;
  policyNumber: string;
  productName: string;
  companyName: string;
  insuredPerson: string;
  policyHolder: string;
  beneficiary: string;
  coverageAmount: number;
  annualPremium: number;
  paymentPeriod: string;
  coveragePeriod: string;
  policyStartDate: string;
  policyEndDate?: string;
  nextPaymentDate?: string;
  notes: string;
}

// 更新保单请求
export interface UpdatePolicyRequest {
  productName?: string;
  companyName?: string;
  insuredPerson?: string;
  policyHolder?: string;
  beneficiary?: string;
  coverageAmount?: number;
  annualPremium?: number;
  paymentPeriod?: string;
  coveragePeriod?: string;
  policyStartDate?: string;
  policyEndDate?: string;
  nextPaymentDate?: string;
  status?: InsurancePolicy['status'];
  notes?: string;
}

// Mock数据存储
const mockPolicies: InsurancePolicy[] = [
  // 示例数据
  {
    id: 'policy_001',
    userId: 'user_001',
    category: 'medical',
    policyNumber: 'PA20240101001',
    productName: '平安e生保·长期医疗险',
    companyName: '平安人寿',
    insuredPerson: '张三',
    policyHolder: '张三',
    beneficiary: '法定',
    coverageAmount: 600,
    annualPremium: 2980,
    paymentPeriod: '年交',
    coveragePeriod: '1年（保证续保20年）',
    policyStartDate: '2024-01-15',
    nextPaymentDate: '2025-01-15',
    status: 'active',
    notes: '家庭主要医疗保障，包含质子重离子治疗',
    documents: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'policy_002',
    userId: 'user_001',
    category: 'critical_illness',
    policyNumber: 'PA20230501008',
    productName: '平安盛世福尊享版',
    companyName: '平安人寿',
    insuredPerson: '张三',
    policyHolder: '张三',
    beneficiary: '李四（配偶）',
    coverageAmount: 50,
    annualPremium: 5680,
    paymentPeriod: '20年交',
    coveragePeriod: '终身',
    policyStartDate: '2023-05-01',
    nextPaymentDate: '2025-05-01',
    status: 'active',
    notes: '重疾险，120种重疾+60种轻中症，深圳地区加10%',
    documents: [],
    createdAt: '2023-05-01T09:30:00Z',
    updatedAt: '2024-11-10T14:20:00Z',
  },
];

const mockDocuments: PolicyDocument[] = [];

/**
 * 手动添加保单
 */
export const addMyPolicy = async (
  userId: string,
  policyData: AddPolicyRequest
): Promise<InsurancePolicy> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const policyId = `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newPolicy: InsurancePolicy = {
    id: policyId,
    userId,
    ...policyData,
    status: 'active',
    documents: [],
    createdAt: now,
    updatedAt: now,
  };

  mockPolicies.push(newPolicy);

  return newPolicy;
};

/**
 * 获取我的保单列表
 */
export const getMyPolicies = async (userId: string, filters?: {
  category?: InsuranceCategory | 'all';
  status?: InsurancePolicy['status'] | 'all';
}): Promise<InsurancePolicy[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let filtered = mockPolicies.filter(p => p.userId === userId);

  // 类别筛选
  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  // 状态筛选
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(p => p.status === filters.status);
  }

  // 按创建时间倒序
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return filtered;
};

/**
 * 获取保单详情
 */
export const getPolicyById = async (policyId: string): Promise<InsurancePolicy | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const policy = mockPolicies.find(p => p.id === policyId);
  if (!policy) {
    return null;
  }

  // 加载保单文件
  const documents = mockDocuments.filter(d => d.policyId === policyId);
  policy.documents = documents;

  return policy;
};

/**
 * 更新保单信息
 */
export const updatePolicy = async (
  policyId: string,
  data: UpdatePolicyRequest
): Promise<InsurancePolicy> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const policyIndex = mockPolicies.findIndex(p => p.id === policyId);
  if (policyIndex === -1) {
    throw new Error('保单不存在');
  }

  const updatedPolicy: InsurancePolicy = {
    ...mockPolicies[policyIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockPolicies[policyIndex] = updatedPolicy;

  return updatedPolicy;
};

/**
 * 删除保单记录
 */
export const deletePolicy = async (policyId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const policyIndex = mockPolicies.findIndex(p => p.id === policyId);
  if (policyIndex === -1) {
    throw new Error('保单不存在');
  }

  // 删除保单及其文件
  mockPolicies.splice(policyIndex, 1);
  const documentIndices = mockDocuments.reduce<number[]>((indices, doc, index) => {
    if (doc.policyId === policyId) {
      indices.push(index);
    }
    return indices;
  }, []);

  // 从后往前删除，避免索引变化
  documentIndices.reverse().forEach(index => {
    mockDocuments.splice(index, 1);
  });

  console.log(`✅ 保单 ${policyId} 及其附件已删除`);
};

/**
 * 上传保单文件
 */
export const uploadPolicyDocument = async (
  policyId: string,
  file: {
    fileName: string;
    fileType: 'pdf' | 'image' | 'other';
    fileSize: number;
    fileData: string; // Base64或URL
  }
): Promise<PolicyDocument> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const policy = mockPolicies.find(p => p.id === policyId);
  if (!policy) {
    throw new Error('保单不存在');
  }

  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const document: PolicyDocument = {
    id: documentId,
    policyId,
    fileName: file.fileName,
    fileType: file.fileType,
    fileSize: file.fileSize,
    fileUrl: file.fileData, // 实际应该上传到OSS等云存储
    uploadedAt: new Date().toISOString(),
  };

  mockDocuments.push(document);
  policy.documents = [...(policy.documents || []), document];

  console.log(`✅ 文件已上传: ${file.fileName} (${(file.fileSize / 1024).toFixed(2)} KB)`);

  return document;
};

/**
 * 获取保单统计信息
 */
export const getPolicyStatistics = async (userId: string): Promise<{
  totalPolicies: number;
  activePolicies: number;
  totalCoverage: number; // 总保额（万元）
  totalAnnualPremium: number; // 总年缴保费（元）
  categoryBreakdown: {
    category: InsuranceCategory;
    count: number;
    coverage: number;
    premium: number;
  }[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const userPolicies = mockPolicies.filter(p => p.userId === userId);
  const activePolicies = userPolicies.filter(p => p.status === 'active');

  const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
  const totalAnnualPremium = activePolicies.reduce((sum, p) => sum + p.annualPremium, 0);

  // 按类别统计
  const categories: InsuranceCategory[] = [
    'medical',
    'critical_illness',
    'accident',
    'life',
    'annuity',
    'long_term_care',
    'wealth_inheritance',
  ];

  const categoryBreakdown = categories.map(category => {
    const categoryPolicies = activePolicies.filter(p => p.category === category);
    return {
      category,
      count: categoryPolicies.length,
      coverage: categoryPolicies.reduce((sum, p) => sum + p.coverageAmount, 0),
      premium: categoryPolicies.reduce((sum, p) => sum + p.annualPremium, 0),
    };
  }).filter(item => item.count > 0); // 只返回有保单的类别

  return {
    totalPolicies: userPolicies.length,
    activePolicies: activePolicies.length,
    totalCoverage,
    totalAnnualPremium,
    categoryBreakdown,
  };
};

/**
 * 获取即将到期的保单（30天内需缴费）
 */
export const getUpcomingPayments = async (userId: string): Promise<InsurancePolicy[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const userPolicies = mockPolicies.filter(
    p => p.userId === userId && p.status === 'active' && p.nextPaymentDate
  );

  const upcomingPayments = userPolicies.filter(p => {
    if (!p.nextPaymentDate) return false;
    const paymentDate = new Date(p.nextPaymentDate);
    return paymentDate >= now && paymentDate <= thirtyDaysLater;
  });

  // 按缴费日期排序
  upcomingPayments.sort((a, b) => {
    const dateA = new Date(a.nextPaymentDate!).getTime();
    const dateB = new Date(b.nextPaymentDate!).getTime();
    return dateA - dateB;
  });

  return upcomingPayments;
};

/**
 * 批量导入保单（从其他平台导入）
 */
export const importPoliciesFromData = async (
  userId: string,
  policiesData: AddPolicyRequest[]
): Promise<{ success: number; failed: number; errors: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const policyData of policiesData) {
    try {
      await addMyPolicy(userId, policyData);
      successCount++;
    } catch (error) {
      failedCount++;
      errors.push(`保单号 ${policyData.policyNumber} 导入失败: ${error}`);
    }
  }

  return {
    success: successCount,
    failed: failedCount,
    errors,
  };
};

/**
 * 导出保单数据（用于备份或迁移）
 */
export const exportMyPolicies = async (userId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const userPolicies = mockPolicies.filter(p => p.userId === userId);

  // 转换为JSON格式
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalCount: userPolicies.length,
    policies: userPolicies.map(p => ({
      category: p.category,
      policyNumber: p.policyNumber,
      productName: p.productName,
      companyName: p.companyName,
      insuredPerson: p.insuredPerson,
      policyHolder: p.policyHolder,
      beneficiary: p.beneficiary,
      coverageAmount: p.coverageAmount,
      annualPremium: p.annualPremium,
      paymentPeriod: p.paymentPeriod,
      coveragePeriod: p.coveragePeriod,
      policyStartDate: p.policyStartDate,
      policyEndDate: p.policyEndDate,
      nextPaymentDate: p.nextPaymentDate,
      status: p.status,
      notes: p.notes,
    })),
  };

  return JSON.stringify(exportData, null, 2);
};
