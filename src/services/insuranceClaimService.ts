/**
 * 理赔协助服务
 * Insurance Claim Assistance Service
 *
 * 提供免费的理赔协助服务，帮助用户准备理赔材料、跟进理赔进度、解答理赔疑问
 * 注意：平台仅提供协助和咨询，不代理用户进行理赔
 */

// 理赔协助申请
export interface ClaimRequest {
  id: string;
  userId: string;
  policyId?: string; // 关联的保单ID（如果有）
  claimType: 'medical' | 'critical_illness' | 'accident' | 'death' | 'other';
  status: 'submitted' | 'reviewing' | 'in_progress' | 'completed' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  basicInfo: ClaimBasicInfo;
  documents: ClaimDocument[];
  progress: ClaimProgress[];
  notes: ClaimNote[];
  advisorId?: string; // 协助顾问ID
  advisorName?: string; // 协助顾问姓名
}

// 理赔基本信息
export interface ClaimBasicInfo {
  insuredPerson: string; // 被保险人
  policyNumber: string; // 保单号
  insuranceCompany: string; // 保险公司
  productName: string; // 产品名称
  incidentDate: string; // 出险日期
  incidentType: string; // 出险类型（如：疾病住院、意外伤害、确诊重疾等）
  incidentDescription: string; // 出险经过
  hospitalName?: string; // 就诊医院
  diagnosis?: string; // 诊断结果
  estimatedClaimAmount: number; // 预估理赔金额（万元）
  contactPerson: string; // 联系人
  contactPhone: string; // 联系电话
  additionalInfo?: string; // 补充说明
}

// 理赔文件
export interface ClaimDocument {
  id: string;
  requestId: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'other';
  fileSize: number;
  fileUrl: string;
  category:
    | 'claim_form' // 理赔申请书
    | 'id_document' // 身份证明
    | 'medical_record' // 病历
    | 'diagnosis_report' // 诊断报告
    | 'invoice' // 发票/费用清单
    | 'bank_info' // 银行卡信息
    | 'accident_proof' // 意外证明
    | 'death_certificate' // 死亡证明
    | 'other'; // 其他
  uploadedAt: string;
  uploadedBy: 'user' | 'advisor';
}

// 理赔进度
export interface ClaimProgress {
  id: string;
  requestId: string;
  stage: string; // 阶段名称
  status: 'pending' | 'completed' | 'rejected';
  description: string;
  timestamp: string;
  operator?: string; // 操作人
}

// 协助备注
export interface ClaimNote {
  id: string;
  requestId: string;
  content: string;
  createdBy: 'user' | 'advisor' | 'system';
  creatorName: string;
  createdAt: string;
  isImportant: boolean; // 是否重要提示
}

// 创建理赔申请请求
export interface CreateClaimRequest {
  policyId?: string;
  claimType: ClaimRequest['claimType'];
  urgency: ClaimRequest['urgency'];
  basicInfo: ClaimBasicInfo;
}

// Mock数据
const mockClaimRequests: ClaimRequest[] = [
  {
    id: 'claim_001',
    userId: 'user_001',
    policyId: 'policy_001',
    claimType: 'medical',
    status: 'in_progress',
    urgency: 'medium',
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-12T14:30:00Z',
    advisorId: 'advisor_003',
    advisorName: '王老师',
    basicInfo: {
      insuredPerson: '张三',
      policyNumber: 'PA20240101001',
      insuranceCompany: '平安人寿',
      productName: '平安e生保·长期医疗险',
      incidentDate: '2024-10-28',
      incidentType: '疾病住院',
      incidentDescription:
        '因急性阑尾炎在深圳市人民医院住院治疗5天，已出院，现申请医疗费用报销',
      hospitalName: '深圳市人民医院',
      diagnosis: '急性阑尾炎',
      estimatedClaimAmount: 1.5,
      contactPerson: '张三',
      contactPhone: '138****5678',
      additionalInfo: '社保已报销部分费用',
    },
    documents: [],
    progress: [
      {
        id: 'progress_001',
        requestId: 'claim_001',
        stage: '提交申请',
        status: 'completed',
        description: '理赔协助申请已提交',
        timestamp: '2024-11-01T09:00:00Z',
      },
      {
        id: 'progress_002',
        requestId: 'claim_001',
        stage: '顾问审核',
        status: 'completed',
        description: '顾问已接受协助请求，开始提供服务',
        timestamp: '2024-11-01T10:30:00Z',
        operator: '王老师',
      },
      {
        id: 'progress_003',
        requestId: 'claim_001',
        stage: '材料准备',
        status: 'completed',
        description: '已上传理赔材料：病历、诊断报告、费用清单',
        timestamp: '2024-11-02T16:00:00Z',
        operator: '张三',
      },
      {
        id: 'progress_004',
        requestId: 'claim_001',
        stage: '保险公司受理',
        status: 'completed',
        description: '保险公司已受理理赔申请',
        timestamp: '2024-11-05T11:00:00Z',
      },
      {
        id: 'progress_005',
        requestId: 'claim_001',
        stage: '理赔审核中',
        status: 'pending',
        description: '保险公司正在审核理赔材料',
        timestamp: '2024-11-05T11:30:00Z',
      },
    ],
    notes: [
      {
        id: 'note_001',
        requestId: 'claim_001',
        content:
          '您好，我是协助顾问王老师。已查看您的资料，这是一个标准的医疗险理赔案例，预计2-3个工作日内可完成理赔。',
        createdBy: 'advisor',
        creatorName: '王老师',
        createdAt: '2024-11-01T10:35:00Z',
        isImportant: false,
      },
      {
        id: 'note_002',
        requestId: 'claim_001',
        content:
          '⚠️ 重要提示：请补充上传社保结算单，以便保险公司确认自费金额。',
        createdBy: 'advisor',
        creatorName: '王老师',
        createdAt: '2024-11-01T14:20:00Z',
        isImportant: true,
      },
      {
        id: 'note_003',
        requestId: 'claim_001',
        content: '社保结算单已上传',
        createdBy: 'user',
        creatorName: '张三',
        createdAt: '2024-11-02T16:05:00Z',
        isImportant: false,
      },
    ],
  },
];

const mockClaimDocuments: ClaimDocument[] = [];

/**
 * 创建理赔协助申请
 */
export const createClaimRequest = async (
  userId: string,
  claimData: CreateClaimRequest
): Promise<ClaimRequest> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const requestId = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const newRequest: ClaimRequest = {
    id: requestId,
    userId,
    policyId: claimData.policyId,
    claimType: claimData.claimType,
    status: 'submitted',
    urgency: claimData.urgency,
    createdAt: now,
    updatedAt: now,
    basicInfo: claimData.basicInfo,
    documents: [],
    progress: [
      {
        id: `progress_${Date.now()}`,
        requestId,
        stage: '提交申请',
        status: 'completed',
        description: '理赔协助申请已提交，我们会尽快安排顾问为您服务',
        timestamp: now,
      },
    ],
    notes: [
      {
        id: `note_${Date.now()}`,
        requestId,
        content:
          '感谢您提交理赔协助申请。我们会在2小时内安排专业顾问联系您，协助您准备理赔材料和跟进理赔进度。',
        createdBy: 'system',
        creatorName: '系统消息',
        createdAt: now,
        isImportant: false,
      },
    ],
  };

  mockClaimRequests.push(newRequest);

  // 模拟自动分配顾问
  setTimeout(() => {
    assignAdvisor(requestId);
  }, 2000);

  return newRequest;
};

/**
 * 获取理赔协助记录
 */
export const getMyClaimRequests = async (
  userId: string,
  filters?: {
    status?: ClaimRequest['status'] | 'all';
    claimType?: ClaimRequest['claimType'] | 'all';
  }
): Promise<ClaimRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let filtered = mockClaimRequests.filter(r => r.userId === userId);

  // 状态筛选
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(r => r.status === filters.status);
  }

  // 类型筛选
  if (filters?.claimType && filters.claimType !== 'all') {
    filtered = filtered.filter(r => r.claimType === filters.claimType);
  }

  // 按创建时间倒序
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return filtered;
};

/**
 * 获取协助详情
 */
export const getClaimRequestById = async (requestId: string): Promise<ClaimRequest | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const request = mockClaimRequests.find(r => r.id === requestId);
  if (!request) {
    return null;
  }

  // 加载文件列表
  const documents = mockClaimDocuments.filter(d => d.requestId === requestId);
  request.documents = documents;

  return request;
};

/**
 * 上传理赔材料
 */
export const uploadClaimDocument = async (
  requestId: string,
  file: {
    fileName: string;
    fileType: 'pdf' | 'image' | 'other';
    fileSize: number;
    fileData: string;
    category: ClaimDocument['category'];
  },
  uploadedBy: 'user' | 'advisor' = 'user'
): Promise<ClaimDocument> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const request = mockClaimRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('理赔协助申请不存在');
  }

  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const document: ClaimDocument = {
    id: documentId,
    requestId,
    fileName: file.fileName,
    fileType: file.fileType,
    fileSize: file.fileSize,
    fileUrl: file.fileData, // 实际应该上传到OSS
    category: file.category,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
  };

  mockClaimDocuments.push(document);
  request.documents = [...(request.documents || []), document];
  request.updatedAt = new Date().toISOString();

  console.log(`✅ 理赔材料已上传: ${file.fileName} (类型: ${file.category})`);

  return document;
};

/**
 * 更新协助进度
 */
export const updateClaimProgress = async (
  requestId: string,
  progress: {
    stage: string;
    status: ClaimProgress['status'];
    description: string;
    operator?: string;
  }
): Promise<ClaimProgress> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const request = mockClaimRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('理赔协助申请不存在');
  }

  const progressId = `progress_${Date.now()}`;
  const newProgress: ClaimProgress = {
    id: progressId,
    requestId,
    stage: progress.stage,
    status: progress.status,
    description: progress.description,
    timestamp: new Date().toISOString(),
    operator: progress.operator,
  };

  request.progress = [...request.progress, newProgress];
  request.updatedAt = new Date().toISOString();

  // 如果进度完成且为最终阶段，更新申请状态
  if (progress.stage === '理赔完成' && progress.status === 'completed') {
    request.status = 'completed';
  }

  return newProgress;
};

/**
 * 添加协助备注
 */
export const addClaimNote = async (
  requestId: string,
  note: {
    content: string;
    createdBy: ClaimNote['createdBy'];
    creatorName: string;
    isImportant?: boolean;
  }
): Promise<ClaimNote> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const request = mockClaimRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('理赔协助申请不存在');
  }

  const noteId = `note_${Date.now()}`;
  const newNote: ClaimNote = {
    id: noteId,
    requestId,
    content: note.content,
    createdBy: note.createdBy,
    creatorName: note.creatorName,
    createdAt: new Date().toISOString(),
    isImportant: note.isImportant || false,
  };

  request.notes = [...request.notes, newNote];
  request.updatedAt = new Date().toISOString();

  return newNote;
};

/**
 * 获取理赔材料清单（根据理赔类型）
 */
export const getRequiredDocuments = async (
  claimType: ClaimRequest['claimType']
): Promise<{
  category: ClaimDocument['category'];
  name: string;
  description: string;
  required: boolean;
  example?: string;
}[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const commonDocuments = [
    {
      category: 'claim_form' as const,
      name: '理赔申请书',
      description: '填写完整的理赔申请书，需本人签字',
      required: true,
      example: '可从保险公司官网下载或联系客服获取',
    },
    {
      category: 'id_document' as const,
      name: '身份证明',
      description: '被保险人身份证复印件（正反面）',
      required: true,
    },
    {
      category: 'bank_info' as const,
      name: '银行卡信息',
      description: '理赔款接收银行卡复印件',
      required: true,
    },
  ];

  switch (claimType) {
    case 'medical':
      return [
        ...commonDocuments,
        {
          category: 'medical_record',
          name: '病历资料',
          description: '完整的门诊或住院病历',
          required: true,
          example: '包括门诊病历、入院记录、出院小结等',
        },
        {
          category: 'diagnosis_report',
          name: '诊断报告',
          description: '检查报告、化验单、诊断证明',
          required: true,
        },
        {
          category: 'invoice',
          name: '医疗费用凭证',
          description: '医疗费用发票原件、费用清单',
          required: true,
          example: '社保报销后需提供社保结算单',
        },
      ];

    case 'critical_illness':
      return [
        ...commonDocuments,
        {
          category: 'medical_record',
          name: '完整病历',
          description: '从初诊到确诊的完整病历资料',
          required: true,
        },
        {
          category: 'diagnosis_report',
          name: '诊断证明',
          description: '医院出具的疾病诊断证明书',
          required: true,
          example: '需注明疾病名称、确诊日期',
        },
        {
          category: 'diagnosis_report',
          name: '病理报告',
          description: '病理检查报告、影像学检查报告',
          required: true,
          example: '如CT、MRI、病理切片等',
        },
      ];

    case 'accident':
      return [
        ...commonDocuments,
        {
          category: 'accident_proof',
          name: '意外事故证明',
          description: '事故说明、责任认定书等',
          required: true,
          example: '交警部门出具的事故责任认定书、单位证明等',
        },
        {
          category: 'medical_record',
          name: '门急诊病历',
          description: '因意外就诊的病历资料',
          required: true,
        },
        {
          category: 'invoice',
          name: '医疗费用发票',
          description: '治疗费用的原始发票和清单',
          required: true,
        },
      ];

    case 'death':
      return [
        ...commonDocuments,
        {
          category: 'death_certificate',
          name: '死亡证明',
          description: '医院或公安部门出具的死亡证明',
          required: true,
        },
        {
          category: 'death_certificate',
          name: '户籍注销证明',
          description: '派出所出具的户籍注销证明',
          required: true,
        },
        {
          category: 'medical_record',
          name: '病历资料',
          description: '疾病身故需提供完整病历',
          required: false,
          example: '意外身故可不提供',
        },
      ];

    default:
      return commonDocuments;
  }
};

/**
 * 获取理赔知识库（常见问题）
 */
export const getClaimFAQ = async (): Promise<
  {
    question: string;
    answer: string;
    category: string;
  }[]
> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      category: '理赔流程',
      question: '理赔需要多久？',
      answer:
        '一般情况下，资料齐全的医疗险理赔3-5个工作日到账，重疾险理赔7-15个工作日。复杂案件可能需要30天。',
    },
    {
      category: '理赔流程',
      question: '理赔会不会影响续保？',
      answer:
        '不会。保证续保的产品，理赔不影响续保权利。非保证续保产品，理赔后保险公司可能调整费率或拒绝续保。',
    },
    {
      category: '材料准备',
      question: '发票丢了怎么办？',
      answer: '可到医院补打发票，或申请发票复印件并加盖医院公章。部分保险公司接受发票分割单。',
    },
    {
      category: '材料准备',
      question: '社保报销后还能理赔吗？',
      answer:
        '可以。商业医疗险通常报销社保报销后的自费部分。理赔时需提供社保结算单。',
    },
    {
      category: '理赔被拒',
      question: '理赔被拒了怎么办？',
      answer:
        '收到拒赔通知后，可以：1）仔细阅读拒赔理由；2）准备补充材料申请复核；3）向保险公司投诉；4）向监管部门投诉；5）申请仲裁或诉讼。',
    },
    {
      category: '理赔被拒',
      question: '未如实告知会影响理赔吗？',
      answer:
        '会。如果未如实告知与理赔事故有直接关联，保险公司可能拒赔并解除合同。如无关联，不影响理赔。',
    },
  ];
};

// ========== 内部辅助函数 ==========

/**
 * 自动分配顾问（内部函数）
 */
function assignAdvisor(requestId: string): void {
  const request = mockClaimRequests.find(r => r.id === requestId);
  if (!request) return;

  // 模拟分配顾问
  const advisors = [
    { id: 'advisor_001', name: '张老师' },
    { id: 'advisor_002', name: '李老师' },
    { id: 'advisor_003', name: '王老师' },
  ];

  const assignedAdvisor = advisors[Math.floor(Math.random() * advisors.length)];

  request.advisorId = assignedAdvisor.id;
  request.advisorName = assignedAdvisor.name;
  request.status = 'reviewing';
  request.updatedAt = new Date().toISOString();

  // 添加进度
  request.progress.push({
    id: `progress_${Date.now()}`,
    requestId,
    stage: '顾问审核',
    status: 'completed',
    description: `已分配协助顾问：${assignedAdvisor.name}`,
    timestamp: new Date().toISOString(),
    operator: assignedAdvisor.name,
  });

  // 添加备注
  request.notes.push({
    id: `note_${Date.now()}`,
    requestId,
    content: `您好，我是${assignedAdvisor.name}，已接受您的理赔协助申请。我会尽快审核您的资料并提供专业建议。`,
    createdBy: 'advisor',
    creatorName: assignedAdvisor.name,
    createdAt: new Date().toISOString(),
    isImportant: false,
  });
}
