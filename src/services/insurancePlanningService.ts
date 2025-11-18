/**
 * AI保险规划服务
 * AI Insurance Planning Service
 *
 * 免费提供AI智能保险规划服务，帮助用户分析保障缺口，生成个性化保险配置方案
 */

// 规划请求数据结构
export interface PlanningRequest {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  userData: UserPlanningData;
  result?: InsurancePlan;
}

// 用户规划数据
export interface UserPlanningData {
  // 基本信息
  age: number;
  gender: 'male' | 'female';
  marital: 'single' | 'married' | 'divorced' | 'widowed';
  hasChildren: boolean;
  childrenCount?: number;
  childrenAges?: number[];
  occupation: string;
  occupationCategory: '1-3类' | '4类' | '5-6类';

  // 收入与资产
  annualIncome: number; // 年收入（万元）
  householdIncome: number; // 家庭年收入（万元）
  assets: number; // 总资产（万元）
  liabilities: number; // 负债（万元）
  monthlyExpense: number; // 月支出（元）

  // 健康状况
  healthStatus: 'healthy' | 'subhealth' | 'chronic_disease' | 'serious_disease';
  chronicDiseases: string[]; // 慢性病列表
  surgeryHistory: string[]; // 手术史
  familyMedicalHistory: string[]; // 家族病史
  height: number; // 身高（cm）
  weight: number; // 体重（kg）
  smoker: boolean;
  drinker: boolean;

  // 现有保障
  existingPolicies: ExistingPolicy[];
  totalCoverage: number; // 现有总保额（万元）

  // 规划需求
  planningGoals: ('family_protection' | 'retirement' | 'health' | 'child_education' | 'wealth_inheritance')[];
  budgetRange: {
    min: number; // 年预算最低（元）
    max: number; // 年预算最高（元）
  };
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  preferredCompanies?: string[]; // 偏好保险公司
}

// 现有保单
export interface ExistingPolicy {
  type: 'medical' | 'critical_illness' | 'accident' | 'life' | 'annuity' | 'other';
  coverageAmount: number; // 保额（万元）
  annualPremium: number; // 年缴保费（元）
  companyName: string;
  productName: string;
  coverageYears: string; // 保障期限
}

// 保险规划方案
export interface InsurancePlan {
  id: string;
  requestId: string;
  userId: string;
  createdAt: string;
  planName: string;
  summary: string;
  totalBudget: number; // 总年缴保费（元）
  coverageGapAnalysis: CoverageGapAnalysis;
  recommendedProducts: RecommendedProduct[];
  implementationSteps: string[];
  notes: string[];
}

// 保障缺口分析
export interface CoverageGapAnalysis {
  medicalGap: {
    current: number; // 现有保额（万元）
    recommended: number; // 建议保额（万元）
    gap: number; // 缺口（万元）
    reason: string;
  };
  criticalIllnessGap: {
    current: number;
    recommended: number;
    gap: number;
    reason: string;
  };
  lifeInsuranceGap: {
    current: number;
    recommended: number;
    gap: number;
    reason: string;
  };
  accidentGap: {
    current: number;
    recommended: number;
    gap: number;
    reason: string;
  };
  retirementGap?: {
    current: number; // 现有养老储备（万元）
    recommended: number; // 建议养老储备（万元）
    gap: number;
    reason: string;
  };
}

// 推荐产品
export interface RecommendedProduct {
  priority: 'high' | 'medium' | 'low';
  productId: string;
  productName: string;
  companyName: string;
  category: 'medical' | 'critical_illness' | 'accident' | 'life' | 'annuity' | 'long_term_care';
  coverageAmount: number; // 建议保额（万元）
  estimatedPremium: number; // 预估年缴（元）
  reason: string;
  pros: string[];
  cons: string[];
}

// 智能核保结果
export interface UnderwritingResult {
  eligible: boolean; // 是否可投保
  conclusion: 'standard' | 'substandard' | 'exclusion' | 'declined'; // 标准体/次标体/除外/拒保
  recommendations: string[];
  healthIssues: {
    issue: string;
    severity: 'low' | 'medium' | 'high';
    impact: string;
    suggestion: string;
  }[];
  alternativeProducts?: {
    productId: string;
    productName: string;
    reason: string;
  }[];
}

// Mock数据 - 规划请求记录
const mockPlanningRequests: PlanningRequest[] = [];

/**
 * 提交规划需求
 */
export const submitPlanningRequest = async (
  userData: UserPlanningData
): Promise<PlanningRequest> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const request: PlanningRequest = {
    id: requestId,
    userId: userData.age.toString(), // 临时使用，实际应该从认证系统获取
    status: 'pending',
    createdAt: new Date().toISOString(),
    userData,
  };

  mockPlanningRequests.push(request);

  // 模拟异步生成方案（实际会调用AI服务）
  setTimeout(() => {
    generateInsurancePlan(requestId);
  }, 2000);

  return request;
};

/**
 * 生成保险方案（AI智能分析）
 */
export const generateInsurancePlan = async (requestId: string): Promise<InsurancePlan> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const request = mockPlanningRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('规划请求不存在');
  }

  const { userData } = request;

  // 1. 分析保障缺口
  const coverageGap = analyzeCoverageGapInternal(userData);

  // 2. 生成产品推荐
  const recommendedProducts = generateRecommendations(userData, coverageGap);

  // 3. 计算总预算
  const totalBudget = recommendedProducts.reduce((sum, p) => sum + p.estimatedPremium, 0);

  // 4. 生成实施步骤
  const implementationSteps = generateImplementationSteps(userData, recommendedProducts);

  // 5. 生成注意事项
  const notes = generateNotes(userData);

  const plan: InsurancePlan = {
    id: `plan_${Date.now()}`,
    requestId,
    userId: request.userId,
    createdAt: new Date().toISOString(),
    planName: `${userData.age}岁${userData.gender === 'male' ? '男性' : '女性'}保险规划方案`,
    summary: generatePlanSummary(userData, coverageGap, totalBudget),
    totalBudget,
    coverageGapAnalysis: coverageGap,
    recommendedProducts,
    implementationSteps,
    notes,
  };

  // 更新请求状态
  request.status = 'completed';
  request.completedAt = new Date().toISOString();
  request.result = plan;

  return plan;
};

/**
 * 获取我的规划方案
 */
export const getMyPlans = async (userId: string): Promise<InsurancePlan[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const completedRequests = mockPlanningRequests.filter(
    r => r.userId === userId && r.status === 'completed' && r.result
  );

  return completedRequests.map(r => r.result!).reverse(); // 最新的在前
};

/**
 * 保障缺口分析（公开接口）
 */
export const analyzeCoverageGap = async (userId: string): Promise<CoverageGapAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  // 实际应该从用户数据中获取，这里使用示例数据
  const sampleUserData: UserPlanningData = {
    age: 50,
    gender: 'male',
    marital: 'married',
    hasChildren: true,
    childrenCount: 1,
    childrenAges: [20],
    occupation: '企业高管',
    occupationCategory: '1-3类',
    annualIncome: 50,
    householdIncome: 80,
    assets: 500,
    liabilities: 200,
    monthlyExpense: 15000,
    healthStatus: 'subhealth',
    chronicDiseases: ['高血压'],
    surgeryHistory: [],
    familyMedicalHistory: ['糖尿病'],
    height: 175,
    weight: 80,
    smoker: false,
    drinker: false,
    existingPolicies: [
      {
        type: 'medical',
        coverageAmount: 200,
        annualPremium: 3000,
        companyName: '平安人寿',
        productName: '平安e生保',
        coverageYears: '1年（保证续保20年）',
      },
    ],
    totalCoverage: 200,
    planningGoals: ['family_protection', 'retirement'],
    budgetRange: { min: 10000, max: 30000 },
    riskTolerance: 'moderate',
  };

  return analyzeCoverageGapInternal(sampleUserData);
};

/**
 * 智能核保
 */
export const performUnderwriting = async (healthData: {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  chronicDiseases: string[];
  surgeryHistory: string[];
  familyMedicalHistory: string[];
  smoker: boolean;
  currentSymptoms: string[];
}): Promise<UnderwritingResult> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  // 计算BMI
  const bmi = healthData.weight / Math.pow(healthData.height / 100, 2);

  const healthIssues: UnderwritingResult['healthIssues'] = [];

  // 检查BMI
  if (bmi > 28) {
    healthIssues.push({
      issue: '体重超标（BMI > 28）',
      severity: 'medium',
      impact: '重疾险可能加费10-30%，医疗险可能除外肥胖相关疾病',
      suggestion: '建议减重后再投保，或选择健康告知宽松的产品',
    });
  }

  // 检查慢性病
  if (healthData.chronicDiseases.includes('高血压')) {
    healthIssues.push({
      issue: '高血压',
      severity: 'medium',
      impact: '重疾险可能拒保或除外心脑血管疾病，医疗险可选择三高可保产品',
      suggestion: '建议选择健康告知宽松的医疗险，如众安尊享e生、防癌医疗险',
    });
  }

  if (healthData.chronicDiseases.includes('糖尿病')) {
    healthIssues.push({
      issue: '糖尿病',
      severity: 'high',
      impact: '重疾险通常拒保，医疗险可选择三高可保或防癌医疗险',
      suggestion: '重点配置防癌险和防癌医疗险，意外险和定期寿险可正常投保',
    });
  }

  // 检查吸烟
  if (healthData.smoker) {
    healthIssues.push({
      issue: '吸烟史',
      severity: 'low',
      impact: '重疾险和医疗险可能加费5-15%',
      suggestion: '如实告知，部分产品对轻度吸烟者友好',
    });
  }

  // 检查家族病史
  if (healthData.familyMedicalHistory.length > 0) {
    healthIssues.push({
      issue: `家族病史：${healthData.familyMedicalHistory.join('、')}`,
      severity: 'low',
      impact: '部分产品可能询问家族病史，一般不影响核保',
      suggestion: '如实告知即可',
    });
  }

  // 判断核保结论
  let conclusion: UnderwritingResult['conclusion'] = 'standard';
  let eligible = true;
  const recommendations: string[] = [];

  if (healthData.chronicDiseases.includes('糖尿病')) {
    conclusion = 'declined';
    eligible = false;
    recommendations.push('重疾险和医疗险建议选择专门的三高可保产品或防癌险');
    recommendations.push('意外险和定期寿险可正常投保');
    recommendations.push('建议配置：防癌医疗险 + 防癌险 + 意外险');
  } else if (healthData.chronicDiseases.includes('高血压') || bmi > 28) {
    conclusion = 'substandard';
    eligible = true;
    recommendations.push('选择健康告知宽松的医疗险产品');
    recommendations.push('重疾险可能需要加费或除外承保');
    recommendations.push('优先配置医疗险和意外险，再考虑防癌险');
  } else if (healthData.smoker) {
    conclusion = 'substandard';
    eligible = true;
    recommendations.push('如实告知吸烟史');
    recommendations.push('部分产品对轻度吸烟者承保条件较宽松');
  }

  // 推荐替代产品
  const alternativeProducts: UnderwritingResult['alternativeProducts'] = [];

  if (healthData.chronicDiseases.length > 0) {
    alternativeProducts.push({
      productId: 'product_002',
      productName: '众安尊享e生2024',
      reason: '三高人群可投保，健康告知宽松',
    });
    alternativeProducts.push({
      productId: 'product_010',
      productName: '众安康享一生防癌险',
      reason: '专为中老年和慢性病人群设计',
    });
  }

  return {
    eligible,
    conclusion,
    recommendations,
    healthIssues,
    alternativeProducts: alternativeProducts.length > 0 ? alternativeProducts : undefined,
  };
};

// ========== 内部辅助函数 ==========

/**
 * 内部保障缺口分析
 */
function analyzeCoverageGapInternal(userData: UserPlanningData): CoverageGapAnalysis {
  const { age, annualIncome, householdIncome, liabilities, hasChildren, existingPolicies } =
    userData;

  // 统计现有保障
  const currentMedical = existingPolicies
    .filter(p => p.type === 'medical')
    .reduce((sum, p) => sum + p.coverageAmount, 0);

  const currentCriticalIllness = existingPolicies
    .filter(p => p.type === 'critical_illness')
    .reduce((sum, p) => sum + p.coverageAmount, 0);

  const currentLife = existingPolicies
    .filter(p => p.type === 'life')
    .reduce((sum, p) => sum + p.coverageAmount, 0);

  const currentAccident = existingPolicies
    .filter(p => p.type === 'accident')
    .reduce((sum, p) => sum + p.coverageAmount, 0);

  // 医疗险缺口分析
  const recommendedMedical = 600; // 建议600万医疗保额（百万医疗险）
  const medicalGap = {
    current: currentMedical,
    recommended: recommendedMedical,
    gap: Math.max(0, recommendedMedical - currentMedical),
    reason:
      '重大疾病治疗费用高昂，建议配置至少600万医疗保额，覆盖住院、手术、特殊门诊、质子重离子等',
  };

  // 重疾险缺口分析
  const recommendedCriticalIllness = annualIncome * 3 + 30; // 年收入3倍 + 30万康复费用
  const criticalIllnessGap = {
    current: currentCriticalIllness,
    recommended: recommendedCriticalIllness,
    gap: Math.max(0, recommendedCriticalIllness - currentCriticalIllness),
    reason: `建议重疾保额为年收入的3-5倍加30-50万康复费用。您的年收入${annualIncome}万，建议保额${recommendedCriticalIllness}万`,
  };

  // 寿险缺口分析
  const familyResponsibility = liabilities + (hasChildren ? annualIncome * 10 : annualIncome * 5); // 负债 + 家庭责任
  const recommendedLife = familyResponsibility;
  const lifeInsuranceGap = {
    current: currentLife,
    recommended: recommendedLife,
    gap: Math.max(0, recommendedLife - currentLife),
    reason: `家庭经济支柱应配置寿险，保额覆盖家庭负债${liabilities}万及未来${hasChildren ? 10 : 5}年的家庭责任`,
  };

  // 意外险缺口分析
  const recommendedAccident = annualIncome * 10; // 年收入10倍
  const accidentGap = {
    current: currentAccident,
    recommended: recommendedAccident,
    gap: Math.max(0, recommendedAccident - currentAccident),
    reason: `意外险是基础保障，建议保额为年收入的5-10倍，即${recommendedAccident}万`,
  };

  // 养老缺口分析（如果有养老需求）
  const retirementGap = userData.planningGoals.includes('retirement')
    ? {
        current: 0,
        recommended: 300,
        gap: 300,
        reason: '按退休后25年生存期，每月1万元生活费计算，建议储备300万养老金',
      }
    : undefined;

  return {
    medicalGap,
    criticalIllnessGap,
    lifeInsuranceGap,
    accidentGap,
    retirementGap,
  };
}

/**
 * 生成产品推荐
 */
function generateRecommendations(
  userData: UserPlanningData,
  coverageGap: CoverageGapAnalysis
): RecommendedProduct[] {
  const recommendations: RecommendedProduct[] = [];
  const { age, healthStatus, budgetRange } = userData;

  // 1. 医疗险推荐
  if (coverageGap.medicalGap.gap > 0) {
    if (healthStatus === 'chronic_disease') {
      // 慢性病人群推荐三高可保产品
      recommendations.push({
        priority: 'high',
        productId: 'product_002',
        productName: '众安尊享e生2024',
        companyName: '众安保险',
        category: 'medical',
        coverageAmount: 400,
        estimatedPremium: 3760,
        reason: '三高人群可投保，健康告知宽松，可保既往症',
        pros: ['三高可投', '既往症可保', '外购药报销', '在线理赔快'],
        cons: ['保额相对较低（400万）', '免赔额1万'],
      });
    } else {
      // 标准体推荐主流百万医疗
      recommendations.push({
        priority: 'high',
        productId: 'product_001',
        productName: '平安e生保·长期医疗险',
        companyName: '平安人寿',
        category: 'medical',
        coverageAmount: 600,
        estimatedPremium: age > 50 ? 2980 : 1980,
        reason: '600万保额，保证续保20年，含质子重离子治疗',
        pros: ['保证续保20年', '600万保额', '质子重离子', '大公司保障'],
        cons: ['保费略高', '健康告知较严'],
      });
    }
  }

  // 2. 重疾险/防癌险推荐
  if (coverageGap.criticalIllnessGap.gap > 0) {
    if (age > 60 || healthStatus === 'chronic_disease') {
      // 高龄或慢性病人群推荐防癌险
      recommendations.push({
        priority: 'high',
        productId: 'product_010',
        productName: '众安康享一生防癌险',
        companyName: '众安保险',
        category: 'critical_illness',
        coverageAmount: 40,
        estimatedPremium: 4880,
        reason: '70岁可投保，三高人群可保，保证续保终身',
        pros: ['70岁可投', '三高可保', '保证续保终身', '400万癌症医疗'],
        cons: ['仅保癌症', '不保其他重疾'],
      });
    } else {
      // 标准体推荐重疾险
      const recommendedAmount = Math.min(coverageGap.criticalIllnessGap.recommended, 50);
      recommendations.push({
        priority: 'medium',
        productId: 'product_009',
        productName: '平安盛世福尊享版',
        companyName: '平安人寿',
        category: 'critical_illness',
        coverageAmount: recommendedAmount,
        estimatedPremium: Math.round(5680 * (recommendedAmount / 50)),
        reason: '120种重疾+60种轻中症，深圳地区额外赔10%',
        pros: ['保障全面', '轻中症保障', '大公司品牌', '深圳加10%'],
        cons: ['保费较高', '健康告知严格'],
      });
    }
  }

  // 3. 意外险推荐
  if (coverageGap.accidentGap.gap > 0) {
    recommendations.push({
      priority: 'high',
      productId: 'product_023',
      productName: '众安综合意外险·全面保',
      companyName: '众安保险',
      category: 'accident',
      coverageAmount: 50,
      estimatedPremium: 298,
      reason: '50万意外保障，含猝死责任，意外医疗0免赔',
      pros: ['含猝死', '0免赔', '社保外用药', '75岁可投'],
      cons: ['保额不可调高'],
    });
  }

  // 4. 寿险推荐（有家庭责任的人群）
  if (coverageGap.lifeInsuranceGap.gap > 50 && userData.marital === 'married') {
    recommendations.push({
      priority: 'medium',
      productId: 'product_028',
      productName: '招商信诺传世壹号',
      companyName: '招商信诺',
      category: 'life',
      coverageAmount: Math.min(coverageGap.lifeInsuranceGap.recommended, 100),
      estimatedPremium: 6800,
      reason: '覆盖家庭负债和未来责任，深圳专供产品',
      pros: ['保额高', '保费低', '免责少', '深圳专供'],
      cons: ['需健康告知'],
    });
  }

  // 5. 养老年金推荐（有养老规划需求）
  if (coverageGap.retirementGap && coverageGap.retirementGap.gap > 0) {
    recommendations.push({
      priority: 'low',
      productId: 'product_017',
      productName: '平安盛世金越养老年金',
      companyName: '平安人寿',
      category: 'annuity',
      coverageAmount: 50,
      estimatedPremium: 50000,
      reason: '终身领取养老金，保证领取20年，可对接养老社区',
      pros: ['终身领取', '保证领取20年', '养老社区', '收益确定'],
      cons: ['投入较大', '流动性差'],
    });
  }

  // 按优先级排序
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations;
}

/**
 * 生成实施步骤
 */
function generateImplementationSteps(
  userData: UserPlanningData,
  products: RecommendedProduct[]
): string[] {
  const steps: string[] = [];

  steps.push('第一步：优先配置基础保障（医疗险+意外险），这是最基本的风险保障');

  if (products.some(p => p.category === 'critical_illness')) {
    steps.push('第二步：配置重疾险或防癌险，补充重大疾病保障，确保确诊即有一笔现金');
  }

  if (userData.marital === 'married') {
    steps.push('第三步：家庭经济支柱需配置寿险，保障家庭经济安全');
  }

  if (products.some(p => p.category === 'annuity')) {
    steps.push('第四步：在基础保障完善后，再考虑养老规划类产品');
  }

  steps.push('第五步：每年检视保单，根据收入变化和家庭情况调整保障');

  return steps;
}

/**
 * 生成注意事项
 */
function generateNotes(userData: UserPlanningData): string[] {
  const notes: string[] = [];

  notes.push('⚠️ 本方案为AI智能分析结果，仅供参考，最终方案建议咨询专业保险顾问');
  notes.push('⚠️ 投保前务必仔细阅读产品条款，重点关注保障范围、免责条款、等待期等');
  notes.push('⚠️ 健康告知必须如实填写，隐瞒病史可能导致理赔纠纷');

  if (userData.healthStatus !== 'healthy') {
    notes.push('⚠️ 您有健康异常，部分产品可能无法投保，建议优先选择健康告知宽松的产品');
    notes.push('⚠️ 可以尝试多家公司的智能核保，选择核保结论最优的产品');
  }

  if (userData.age > 50) {
    notes.push('⚠️ 50岁以上投保重疾险保费较高，建议重点关注医疗险和防癌险');
  }

  if (userData.budgetRange.max < 10000) {
    notes.push('⚠️ 预算有限的情况下，建议优先配置医疗险和意外险，保障最基础的风险');
  }

  notes.push('💡 平台提供免费咨询服务，如有疑问可随时联系专业顾问');

  return notes;
}

/**
 * 生成方案摘要
 */
function generatePlanSummary(
  userData: UserPlanningData,
  coverageGap: CoverageGapAnalysis,
  totalBudget: number
): string {
  const { age, gender, annualIncome } = userData;
  const genderText = gender === 'male' ? '男性' : '女性';

  let summary = `您是${age}岁${genderText}，年收入${annualIncome}万元。`;

  const gaps: string[] = [];
  if (coverageGap.medicalGap.gap > 0) gaps.push('医疗保障');
  if (coverageGap.criticalIllnessGap.gap > 0) gaps.push('重疾保障');
  if (coverageGap.lifeInsuranceGap.gap > 0) gaps.push('寿险保障');
  if (coverageGap.accidentGap.gap > 0) gaps.push('意外保障');

  if (gaps.length > 0) {
    summary += `当前${gaps.join('、')}存在缺口，`;
  } else {
    summary += '当前保障较为完善，';
  }

  summary += `建议年缴保费预算${Math.round(totalBudget)}元（约占年收入的${Math.round((totalBudget / (annualIncome * 10000)) * 100)}%）。`;

  return summary;
}
