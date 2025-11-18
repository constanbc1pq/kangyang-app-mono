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

// 初始化律师数据（从localStorage读取，不再自动生成）
export const initializeLawyers = async (): Promise<void> => {
  // 律师数据应该由用户或管理后台添加到 @kangyang_lawyers
  // 不再自动生成模拟数据
  console.log('Lawyer data should be managed via @kangyang_lawyers localStorage');
};

// 获取所有律师列表
export const getLawyers = async (): Promise<LawyerProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(LEGAL_SERVICE_STORAGE_KEYS.LAWYERS);
    if (data) {
      return JSON.parse(data);
    } else {
      // 没有数据时返回空数组，需要先添加律师数据到 @kangyang_lawyers
      console.warn('No lawyers found in @kangyang_lawyers. Please add lawyer data first.');
      return [];
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

