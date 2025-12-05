/**
 * 法律服务数据管理服务
 * 提供遗嘱、监护、律师咨询等数据的本地存储和管理
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Will,
  WillType,
  WillStatus,
  Beneficiary,
  Witness,
  Estate,
  GuardianshipAgreement,
  PropertyInventory,
  Asset,
  Liability,
  LawyerProfile,
  LawyerSpecialty,
  LegalConsultation,
  LegalConsultationType,
  LegalCase,
  CaseStatus,
  LegalArticle,
  LegalVideo,
  CaseStudy,
  DocumentTemplate,
  RiskAlert,
  LegalCheckup,
  LegalMembership,
  MembershipTier,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';

/**
 * 遗嘱服务
 */

// 获取所有遗嘱列表
export const getWills = async (): Promise<Will[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.WILLS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting wills:', error);
    return [];
  }
};

// 根据ID获取遗嘱详情
export const getWillById = async (id: string): Promise<Will | null> => {
  try {
    const wills = await getWills();
    return wills.find(will => will.id === id) || null;
  } catch (error) {
    console.error('Error getting will by id:', error);
    return null;
  }
};

// 根据状态获取遗嘱列表
export const getWillsByStatus = async (status: WillStatus): Promise<Will[]> => {
  try {
    const wills = await getWills();
    return wills.filter(will => will.status === status);
  } catch (error) {
    console.error('Error getting wills by status:', error);
    return [];
  }
};

// 创建新遗嘱
export const createWill = async (willData: Omit<Will, 'id' | 'createdAt' | 'updatedAt'>): Promise<Will> => {
  try {
    const newWill: Will = {
      ...willData,
      id: `will_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const wills = await getWills();
    wills.push(newWill);
    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.WILLS, JSON.stringify(wills));

    return newWill;
  } catch (error) {
    console.error('Error creating will:', error);
    throw error;
  }
};

// 更新遗嘱
export const updateWill = async (id: string, updates: Partial<Will>): Promise<Will | null> => {
  try {
    const wills = await getWills();
    const index = wills.findIndex(will => will.id === id);

    if (index === -1) {
      return null;
    }

    wills[index] = {
      ...wills[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.WILLS, JSON.stringify(wills));
    return wills[index];
  } catch (error) {
    console.error('Error updating will:', error);
    throw error;
  }
};

// 删除遗嘱
export const deleteWill = async (id: string): Promise<boolean> => {
  try {
    const wills = await getWills();
    const filteredWills = wills.filter(will => will.id !== id);

    if (filteredWills.length === wills.length) {
      return false; // 未找到要删除的遗嘱
    }

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.WILLS, JSON.stringify(filteredWills));
    return true;
  } catch (error) {
    console.error('Error deleting will:', error);
    throw error;
  }
};

// 作废遗嘱
export const revokeWill = async (id: string): Promise<Will | null> => {
  return updateWill(id, {
    status: WillStatus.REVOKED,
    revokedAt: new Date().toISOString(),
  });
};

/**
 * 意定监护服务
 */

// 获取所有监护协议
export const getGuardianshipAgreements = async (): Promise<GuardianshipAgreement[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.GUARDIANSHIP_AGREEMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting guardianship agreements:', error);
    return [];
  }
};

// 根据ID获取监护协议
export const getGuardianshipAgreementById = async (id: string): Promise<GuardianshipAgreement | null> => {
  try {
    const agreements = await getGuardianshipAgreements();
    return agreements.find(agreement => agreement.id === id) || null;
  } catch (error) {
    console.error('Error getting guardianship agreement by id:', error);
    return null;
  }
};

// 创建监护协议
export const createGuardianshipAgreement = async (
  agreementData: Omit<GuardianshipAgreement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GuardianshipAgreement> => {
  try {
    const newAgreement: GuardianshipAgreement = {
      ...agreementData,
      id: `guardianship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const agreements = await getGuardianshipAgreements();
    agreements.push(newAgreement);
    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.GUARDIANSHIP_AGREEMENTS, JSON.stringify(agreements));

    return newAgreement;
  } catch (error) {
    console.error('Error creating guardianship agreement:', error);
    throw error;
  }
};

// 更新监护协议
export const updateGuardianshipAgreement = async (
  id: string,
  updates: Partial<GuardianshipAgreement>
): Promise<GuardianshipAgreement | null> => {
  try {
    const agreements = await getGuardianshipAgreements();
    const index = agreements.findIndex(agreement => agreement.id === id);

    if (index === -1) {
      return null;
    }

    agreements[index] = {
      ...agreements[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.GUARDIANSHIP_AGREEMENTS, JSON.stringify(agreements));
    return agreements[index];
  } catch (error) {
    console.error('Error updating guardianship agreement:', error);
    throw error;
  }
};

/**
 * 财产清单服务
 */

// 获取所有财产清单
export const getPropertyInventories = async (): Promise<PropertyInventory[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.PROPERTY_INVENTORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting property inventories:', error);
    return [];
  }
};

// 根据ID获取财产清单
export const getPropertyInventoryById = async (id: string): Promise<PropertyInventory | null> => {
  try {
    const inventories = await getPropertyInventories();
    return inventories.find(inventory => inventory.id === id) || null;
  } catch (error) {
    console.error('Error getting property inventory by id:', error);
    return null;
  }
};

// 创建财产清单
export const createPropertyInventory = async (
  inventoryData: Omit<PropertyInventory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PropertyInventory> => {
  try {
    const newInventory: PropertyInventory = {
      ...inventoryData,
      id: `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const inventories = await getPropertyInventories();
    inventories.push(newInventory);
    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.PROPERTY_INVENTORIES, JSON.stringify(inventories));

    return newInventory;
  } catch (error) {
    console.error('Error creating property inventory:', error);
    throw error;
  }
};

// 更新财产清单
export const updatePropertyInventory = async (
  id: string,
  updates: Partial<PropertyInventory>
): Promise<PropertyInventory | null> => {
  try {
    const inventories = await getPropertyInventories();
    const index = inventories.findIndex(inventory => inventory.id === id);

    if (index === -1) {
      return null;
    }

    inventories[index] = {
      ...inventories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.PROPERTY_INVENTORIES, JSON.stringify(inventories));
    return inventories[index];
  } catch (error) {
    console.error('Error updating property inventory:', error);
    throw error;
  }
};

/**
 * 律师服务
 */

// 默认律师数据
const DEFAULT_LAWYERS: LawyerProfile[] = [
  {
    id: 'lawyer_001',
    name: '陈华',
    avatar: 'local:lawyer_001',
    licenseNumber: '14401201210345678',
    lawFirm: '广东正大联合律师事务所',
    specialties: [LawyerSpecialty.INHERITANCE, LawyerSpecialty.ELDER_CARE, LawyerSpecialty.PROPERTY],
    yearsOfExperience: 18,
    education: '中国政法大学 法学硕士',
    caseCount: 560,
    successRate: 92,
    rating: 4.9,
    reviewCount: 328,
    textConsultationPrice: 200,
    phoneConsultationPrice: 300,
    videoConsultationPrice: 500,
    homeVisitPrice: 1000,
    isOnline: true,
    responseRate: 98,
    averageResponseTime: 15,
    introduction: '专注遗嘱继承、养老赡养、房产纠纷18年，曾担任多家养老机构法律顾问。擅长处理复杂家庭财产分配案件，帮助众多老年人维护合法权益。',
  },
  {
    id: 'lawyer_002',
    name: '王丽',
    avatar: 'local:lawyer_002',
    licenseNumber: '14401201510567890',
    lawFirm: '广东华商律师事务所',
    specialties: [LawyerSpecialty.MARRIAGE, LawyerSpecialty.INHERITANCE, LawyerSpecialty.ELDER_CARE],
    yearsOfExperience: 15,
    education: '中山大学 法学硕士',
    caseCount: 420,
    successRate: 89,
    rating: 4.8,
    reviewCount: 256,
    textConsultationPrice: 180,
    phoneConsultationPrice: 280,
    videoConsultationPrice: 450,
    homeVisitPrice: 900,
    isOnline: true,
    responseRate: 96,
    averageResponseTime: 20,
    introduction: '资深婚姻家事律师，专注老年人婚姻纠纷、财产分割、赡养抚养案件。温和细致，善于调解，深受当事人信赖。',
  },
  {
    id: 'lawyer_003',
    name: '张强',
    avatar: 'local:lawyer_003',
    licenseNumber: '14401200810234567',
    lawFirm: '广东金桥百信律师事务所',
    specialties: [LawyerSpecialty.PROPERTY, LawyerSpecialty.CONTRACT, LawyerSpecialty.INHERITANCE],
    yearsOfExperience: 22,
    education: '武汉大学 法学博士',
    caseCount: 780,
    successRate: 94,
    rating: 4.95,
    reviewCount: 456,
    textConsultationPrice: 250,
    phoneConsultationPrice: 380,
    videoConsultationPrice: 600,
    homeVisitPrice: 1200,
    isOnline: false,
    responseRate: 92,
    averageResponseTime: 30,
    introduction: '房产法律专家，深耕房产买卖、继承过户、产权纠纷22年。处理过大量复杂房产案件，对老年人房产保护有丰富经验。',
  },
  {
    id: 'lawyer_004',
    name: '刘慧敏',
    avatar: 'local:lawyer_004',
    licenseNumber: '14401201710789012',
    lawFirm: '广东广信君达律师事务所',
    specialties: [LawyerSpecialty.CONSUMER_RIGHTS, LawyerSpecialty.MEDICAL, LawyerSpecialty.CONTRACT],
    yearsOfExperience: 12,
    education: '暨南大学 法学硕士',
    caseCount: 320,
    successRate: 88,
    rating: 4.7,
    reviewCount: 189,
    textConsultationPrice: 150,
    phoneConsultationPrice: 250,
    videoConsultationPrice: 400,
    homeVisitPrice: 800,
    isOnline: true,
    responseRate: 99,
    averageResponseTime: 10,
    introduction: '消费维权、医疗纠纷专家。特别关注老年人消费欺诈、养老诈骗案件，帮助众多老年人追回被骗财产。',
  },
  {
    id: 'lawyer_005',
    name: '李国栋',
    avatar: 'local:lawyer_005',
    licenseNumber: '14401201110456789',
    lawFirm: '广东法制盛邦律师事务所',
    specialties: [LawyerSpecialty.INHERITANCE, LawyerSpecialty.PROPERTY, LawyerSpecialty.MARRIAGE],
    yearsOfExperience: 20,
    education: '华东政法大学 法学硕士',
    caseCount: 650,
    successRate: 91,
    rating: 4.85,
    reviewCount: 378,
    textConsultationPrice: 220,
    phoneConsultationPrice: 320,
    videoConsultationPrice: 520,
    homeVisitPrice: 1000,
    isOnline: true,
    responseRate: 95,
    averageResponseTime: 25,
    introduction: '遗产继承资深律师，擅长处理遗嘱订立、遗产分配、继承纠纷。为众多家庭提供财产传承规划服务。',
  },
  {
    id: 'lawyer_006',
    name: '周晓燕',
    avatar: 'local:lawyer_006',
    licenseNumber: '14401201610678901',
    lawFirm: '广东信达律师事务所',
    specialties: [LawyerSpecialty.ELDER_CARE, LawyerSpecialty.LABOR, LawyerSpecialty.CONTRACT],
    yearsOfExperience: 14,
    education: '西南政法大学 法学硕士',
    caseCount: 380,
    successRate: 87,
    rating: 4.75,
    reviewCount: 212,
    textConsultationPrice: 160,
    phoneConsultationPrice: 260,
    videoConsultationPrice: 420,
    homeVisitPrice: 850,
    isOnline: false,
    responseRate: 94,
    averageResponseTime: 35,
    introduction: '专注养老赡养、劳动争议领域。对老年人权益保护有深入研究，帮助多位老人追索赡养费和工伤赔偿。',
  },
  {
    id: 'lawyer_007',
    name: '黄志远',
    avatar: 'local:lawyer_007',
    licenseNumber: '14401200910345678',
    lawFirm: '广东南国德赛律师事务所',
    specialties: [LawyerSpecialty.PROPERTY, LawyerSpecialty.INHERITANCE, LawyerSpecialty.CONTRACT],
    yearsOfExperience: 25,
    education: '北京大学 法学博士',
    caseCount: 920,
    successRate: 95,
    rating: 4.98,
    reviewCount: 567,
    textConsultationPrice: 300,
    phoneConsultationPrice: 450,
    videoConsultationPrice: 700,
    homeVisitPrice: 1500,
    isOnline: true,
    responseRate: 97,
    averageResponseTime: 20,
    introduction: '资深律师、仲裁员，房产和继承法专家。曾参与多部地方法规起草，在业内享有很高声誉。',
  },
  {
    id: 'lawyer_008',
    name: '郑美玲',
    avatar: 'local:lawyer_008',
    licenseNumber: '14401201810890123',
    lawFirm: '广东合邦律师事务所',
    specialties: [LawyerSpecialty.MEDICAL, LawyerSpecialty.CONSUMER_RIGHTS, LawyerSpecialty.ELDER_CARE],
    yearsOfExperience: 10,
    education: '中山大学 法学硕士',
    caseCount: 245,
    successRate: 86,
    rating: 4.65,
    reviewCount: 156,
    textConsultationPrice: 130,
    phoneConsultationPrice: 220,
    videoConsultationPrice: 380,
    homeVisitPrice: 750,
    isOnline: true,
    responseRate: 99,
    averageResponseTime: 8,
    introduction: '医疗纠纷专业律师，特别关注老年人医疗事故维权。响应快速，服务热情，深受老年客户好评。',
  },
  {
    id: 'lawyer_009',
    name: '吴明辉',
    avatar: 'local:lawyer_009',
    licenseNumber: '14401201310567890',
    lawFirm: '广东天穗律师事务所',
    specialties: [LawyerSpecialty.INHERITANCE, LawyerSpecialty.MARRIAGE, LawyerSpecialty.PROPERTY],
    yearsOfExperience: 16,
    education: '华南理工大学 法学硕士',
    caseCount: 480,
    successRate: 90,
    rating: 4.82,
    reviewCount: 298,
    textConsultationPrice: 190,
    phoneConsultationPrice: 290,
    videoConsultationPrice: 480,
    homeVisitPrice: 950,
    isOnline: false,
    responseRate: 93,
    averageResponseTime: 28,
    introduction: '家事律师，专注遗嘱规划、婚姻财产、子女赡养。为客户提供全面的家庭法律服务和财产规划建议。',
  },
  {
    id: 'lawyer_010',
    name: '林秀珍',
    avatar: 'local:lawyer_010',
    licenseNumber: '14401201410678901',
    lawFirm: '广东粤广律师事务所',
    specialties: [LawyerSpecialty.ELDER_CARE, LawyerSpecialty.CONSUMER_RIGHTS, LawyerSpecialty.INHERITANCE],
    yearsOfExperience: 13,
    education: '深圳大学 法学硕士',
    caseCount: 350,
    successRate: 88,
    rating: 4.78,
    reviewCount: 234,
    textConsultationPrice: 170,
    phoneConsultationPrice: 270,
    videoConsultationPrice: 440,
    homeVisitPrice: 880,
    isOnline: true,
    responseRate: 96,
    averageResponseTime: 18,
    introduction: '老年人权益保护专家，曾在社区法律援助中心工作多年。对老年人面临的各类法律问题有深入了解和丰富实战经验。',
  },
];

// 初始化律师数据
export const initializeLawyers = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.LAWYERS);
    if (existing) {
      console.log('律师数据已存在，跳过初始化');
      return;
    }

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.LAWYERS, JSON.stringify(DEFAULT_LAWYERS));
    console.log('成功初始化10位律师数据');
  } catch (error) {
    console.error('初始化律师数据失败:', error);
  }
};

// 获取所有律师列表
export const getLawyers = async (): Promise<LawyerProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.LAWYERS);
    if (data) {
      return JSON.parse(data);
    } else {
      // 没有数据时自动初始化
      await initializeLawyers();
      const newData = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.LAWYERS);
      return newData ? JSON.parse(newData) : [];
    }
  } catch (error) {
    console.error('Error getting lawyers:', error);
    return [];
  }
};

// 根据ID获取律师详情
export const getLawyerById = async (id: string): Promise<LawyerProfile | null> => {
  try {
    const lawyers = await getLawyers();
    return lawyers.find(lawyer => lawyer.id === id) || null;
  } catch (error) {
    console.error('Error getting lawyer by id:', error);
    return null;
  }
};

// 根据专业领域筛选律师
export const getLawyersBySpecialty = async (specialty: LawyerSpecialty): Promise<LawyerProfile[]> => {
  try {
    const lawyers = await getLawyers();
    return lawyers.filter(lawyer => lawyer.specialties.includes(specialty));
  } catch (error) {
    console.error('Error getting lawyers by specialty:', error);
    return [];
  }
};

// 搜索律师（按姓名或律所）
export const searchLawyers = async (keyword: string): Promise<LawyerProfile[]> => {
  try {
    const lawyers = await getLawyers();
    const lowerKeyword = keyword.toLowerCase();
    return lawyers.filter(
      lawyer =>
        lawyer.name.toLowerCase().includes(lowerKeyword) ||
        lawyer.lawFirm.toLowerCase().includes(lowerKeyword)
    );
  } catch (error) {
    console.error('Error searching lawyers:', error);
    return [];
  }
};

/**
 * 律师咨询服务
 */

// 获取所有咨询记录
export const getConsultations = async (): Promise<LegalConsultation[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.CONSULTATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting consultations:', error);
    return [];
  }
};

// 根据ID获取咨询详情
export const getConsultationById = async (id: string): Promise<LegalConsultation | null> => {
  try {
    const consultations = await getConsultations();
    return consultations.find(consultation => consultation.id === id) || null;
  } catch (error) {
    console.error('Error getting consultation by id:', error);
    return null;
  }
};

// 根据律师ID获取咨询记录
export const getConsultationsByLawyer = async (lawyerId: string): Promise<LegalConsultation[]> => {
  try {
    const consultations = await getConsultations();
    return consultations.filter(consultation => consultation.lawyerId === lawyerId);
  } catch (error) {
    console.error('Error getting consultations by lawyer:', error);
    return [];
  }
};

// 创建咨询记录
export const createConsultation = async (
  consultationData: Omit<LegalConsultation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LegalConsultation> => {
  try {
    const newConsultation: LegalConsultation = {
      ...consultationData,
      id: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const consultations = await getConsultations();
    consultations.push(newConsultation);
    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));

    return newConsultation;
  } catch (error) {
    console.error('Error creating consultation:', error);
    throw error;
  }
};

// 更新咨询记录
export const updateConsultation = async (
  id: string,
  updates: Partial<LegalConsultation>
): Promise<LegalConsultation | null> => {
  try {
    const consultations = await getConsultations();
    const index = consultations.findIndex(consultation => consultation.id === id);

    if (index === -1) {
      return null;
    }

    consultations[index] = {
      ...consultations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
    return consultations[index];
  } catch (error) {
    console.error('Error updating consultation:', error);
    throw error;
  }
};

/**
 * 法律案件服务
 */

// 获取所有案件
export const getCases = async (): Promise<LegalCase[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.CASES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cases:', error);
    return [];
  }
};

// 根据ID获取案件详情
export const getCaseById = async (id: string): Promise<LegalCase | null> => {
  try {
    const cases = await getCases();
    return cases.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Error getting case by id:', error);
    return null;
  }
};

// 根据状态获取案件
export const getCasesByStatus = async (status: CaseStatus): Promise<LegalCase[]> => {
  try {
    const cases = await getCases();
    return cases.filter(c => c.status === status);
  } catch (error) {
    console.error('Error getting cases by status:', error);
    return [];
  }
};

// 创建案件
export const createCase = async (
  caseData: Omit<LegalCase, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LegalCase> => {
  try {
    const newCase: LegalCase = {
      ...caseData,
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const cases = await getCases();
    cases.push(newCase);
    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.CASES, JSON.stringify(cases));

    return newCase;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;
  }
};

// 更新案件
export const updateCase = async (
  id: string,
  updates: Partial<LegalCase>
): Promise<LegalCase | null> => {
  try {
    const cases = await getCases();
    const index = cases.findIndex(c => c.id === id);

    if (index === -1) {
      return null;
    }

    cases[index] = {
      ...cases[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.CASES, JSON.stringify(cases));
    return cases[index];
  } catch (error) {
    console.error('Error updating case:', error);
    throw error;
  }
};

/**
 * 法律知识服务
 */

// 获取法律文章列表
export const getLegalArticles = async (): Promise<LegalArticle[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.ARTICLES);
    return data ? JSON.parse(data) : getMockLegalArticles();
  } catch (error) {
    console.error('Error getting legal articles:', error);
    return getMockLegalArticles();
  }
};

// 根据分类获取法律文章
export const getLegalArticlesByCategory = async (category: string): Promise<LegalArticle[]> => {
  try {
    const articles = await getLegalArticles();
    return articles.filter(article => article.category === category);
  } catch (error) {
    console.error('Error getting legal articles by category:', error);
    return [];
  }
};

// 获取法律视频列表
export const getLegalVideos = async (): Promise<LegalVideo[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.VIDEOS);
    return data ? JSON.parse(data) : getMockLegalVideos();
  } catch (error) {
    console.error('Error getting legal videos:', error);
    return getMockLegalVideos();
  }
};

// 获取案例库
export const getCaseStudies = async (): Promise<CaseStudy[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.CASE_STUDIES);
    return data ? JSON.parse(data) : getMockCaseStudies();
  } catch (error) {
    console.error('Error getting case studies:', error);
    return getMockCaseStudies();
  }
};

// 获取文书模板列表
export const getDocumentTemplates = async (): Promise<DocumentTemplate[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : getMockDocumentTemplates();
  } catch (error) {
    console.error('Error getting document templates:', error);
    return getMockDocumentTemplates();
  }
};

/**
 * 会员服务
 */

// 获取当前用户会员信息
export const getUserMembership = async (userId: string): Promise<LegalMembership | null> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.MEMBERSHIPS);
    if (!data) return null;

    const memberships: LegalMembership[] = JSON.parse(data);
    return memberships.find(m => m.userId === userId) || null;
  } catch (error) {
    console.error('Error getting user membership:', error);
    return null;
  }
};

// 创建或更新会员信息
export const updateUserMembership = async (membership: LegalMembership): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.MEMBERSHIPS);
    const memberships: LegalMembership[] = data ? JSON.parse(data) : [];

    const index = memberships.findIndex(m => m.userId === membership.userId);
    if (index !== -1) {
      memberships[index] = {
        ...membership,
        updatedAt: new Date().toISOString(),
      };
    } else {
      memberships.push({
        ...membership,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await AsyncStorage.setItem(LEGAL_SERVICE_STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
  } catch (error) {
    console.error('Error updating user membership:', error);
    throw error;
  }
};

/**
 * Mock数据生成函数（用于初始化和演示）
 */

