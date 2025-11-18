/**
 * 案件服务
 * 提供案件委托、进展跟踪、文书管理等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LegalCase,
  CaseStatus,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';
import {
  getCases,
  getCaseById as getLegalCaseById,
  createCase as createLegalCase,
  updateCase as updateLegalCase,
} from './legalService';

/**
 * 案件进展数据接口
 */
export interface CaseProgress {
  id?: string;
  title: string;
  description: string;
  date: string;
  operator: string; // 操作人（律师姓名）
  documents?: CaseDocument[];
}

/**
 * 案件文书接口
 */
export interface CaseDocument {
  id: string;
  caseId: string;
  type: string; // 文书类型：起诉书、答辩状、证据材料等
  title: string;
  fileName: string;
  fileUri: string;
  fileSize: number;
  uploadedBy: string; // 上传人
  uploadedAt: string;
  notes?: string;
}

/**
 * 创建案件委托
 */
export const createCase = async (
  caseData: Omit<LegalCase, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LegalCase> => {
  return createLegalCase(caseData);
};

/**
 * 获取用户的案件列表
 */
export const getMyCases = async (userId: string): Promise<LegalCase[]> => {
  try {
    const allCases = await getCases();
    return allCases.filter(c => c.userId === userId);
  } catch (error) {
    console.error('Error getting my cases:', error);
    return [];
  }
};

/**
 * 根据ID获取案件详情
 */
export const getCaseById = async (caseId: string): Promise<LegalCase | null> => {
  return getLegalCaseById(caseId);
};

/**
 * 更新案件状态
 */
export const updateCaseStatus = async (
  caseId: string,
  status: CaseStatus
): Promise<LegalCase | null> => {
  try {
    const updatedCase = await updateLegalCase(caseId, {
      status,
    });
    return updatedCase;
  } catch (error) {
    console.error('Error updating case status:', error);
    throw error;
  }
};

/**
 * 更新案件进展
 */
export const updateCaseProgress = async (
  caseId: string,
  progressData: Omit<CaseProgress, 'id'>
): Promise<LegalCase | null> => {
  try {
    const caseItem = await getLegalCaseById(caseId);
    if (!caseItem) {
      throw new Error('案件不存在');
    }

    // 生成进展ID
    const newProgress: CaseProgress = {
      ...progressData,
      id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // 获取现有进展记录
    const progressHistory = caseItem.progressHistory || [];
    progressHistory.push(newProgress);

    // 更新案件
    const updatedCase = await updateLegalCase(caseId, {
      progressHistory,
      lastUpdateDate: new Date().toISOString(),
    });

    return updatedCase;
  } catch (error) {
    console.error('Error updating case progress:', error);
    throw error;
  }
};

/**
 * 上传案件文书
 */
export const uploadDocument = async (
  caseId: string,
  documentData: Omit<CaseDocument, 'id' | 'caseId' | 'uploadedAt'>
): Promise<LegalCase | null> => {
  try {
    const caseItem = await getLegalCaseById(caseId);
    if (!caseItem) {
      throw new Error('案件不存在');
    }

    // 生成文书ID
    const newDocument: CaseDocument = {
      ...documentData,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      caseId,
      uploadedAt: new Date().toISOString(),
    };

    // 保存文书到独立存储
    const documentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.CASES}_documents`;
    const documentsData = await AsyncStorage.getItem(documentsKey);
    const documents: CaseDocument[] = documentsData ? JSON.parse(documentsData) : [];
    documents.push(newDocument);
    await AsyncStorage.setItem(documentsKey, JSON.stringify(documents));

    // 更新案件的文书列表
    const caseDocuments = caseItem.documents || [];
    caseDocuments.push(newDocument);

    const updatedCase = await updateLegalCase(caseId, {
      documents: caseDocuments,
      lastUpdateDate: new Date().toISOString(),
    });

    return updatedCase;
  } catch (error) {
    console.error('Error uploading case document:', error);
    throw error;
  }
};

/**
 * 获取案件的所有文书
 */
export const getCaseDocuments = async (caseId: string): Promise<CaseDocument[]> => {
  try {
    const documentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.CASES}_documents`;
    const documentsData = await AsyncStorage.getItem(documentsKey);

    if (!documentsData) {
      return [];
    }

    const documents: CaseDocument[] = JSON.parse(documentsData);
    return documents.filter(doc => doc.caseId === caseId);
  } catch (error) {
    console.error('Error getting case documents:', error);
    return [];
  }
};

/**
 * 删除案件文书
 */
export const deleteDocument = async (caseId: string, documentId: string): Promise<boolean> => {
  try {
    const documentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.CASES}_documents`;
    const documentsData = await AsyncStorage.getItem(documentsKey);

    if (!documentsData) {
      return false;
    }

    const documents: CaseDocument[] = JSON.parse(documentsData);
    const filteredDocuments = documents.filter(doc => doc.id !== documentId);

    if (filteredDocuments.length === documents.length) {
      return false; // 未找到要删除的文书
    }

    await AsyncStorage.setItem(documentsKey, JSON.stringify(filteredDocuments));

    // 更新案件的文书列表
    const caseItem = await getLegalCaseById(caseId);
    if (caseItem && caseItem.documents) {
      const updatedDocuments = caseItem.documents.filter(doc => doc.id !== documentId);
      await updateLegalCase(caseId, {
        documents: updatedDocuments,
      });
    }

    return true;
  } catch (error) {
    console.error('Error deleting case document:', error);
    return false;
  }
};

/**
 * 获取案件进展历史
 */
export const getCaseProgressHistory = async (caseId: string): Promise<CaseProgress[]> => {
  try {
    const caseItem = await getLegalCaseById(caseId);
    if (!caseItem) {
      return [];
    }
    return caseItem.progressHistory || [];
  } catch (error) {
    console.error('Error getting case progress history:', error);
    return [];
  }
};

/**
 * 关闭案件
 */
export const closeCase = async (caseId: string, result: string): Promise<LegalCase | null> => {
  try {
    const caseItem = await getLegalCaseById(caseId);
    if (!caseItem) {
      throw new Error('案件不存在');
    }

    if (caseItem.status === CaseStatus.CLOSED) {
      throw new Error('案件已关闭');
    }

    const updatedCase = await updateLegalCase(caseId, {
      status: CaseStatus.CLOSED,
      result,
      closedDate: new Date().toISOString(),
    });

    return updatedCase;
  } catch (error) {
    console.error('Error closing case:', error);
    throw error;
  }
};

/**
 * 撤销案件
 */
export const withdrawCase = async (caseId: string, reason: string): Promise<LegalCase | null> => {
  try {
    const caseItem = await getLegalCaseById(caseId);
    if (!caseItem) {
      throw new Error('案件不存在');
    }

    // 只有委托中和进行中的案件可以撤销
    if (caseItem.status !== CaseStatus.PENDING && caseItem.status !== CaseStatus.IN_PROGRESS) {
      throw new Error('当前案件状态不允许撤销');
    }

    const updatedCase = await updateLegalCase(caseId, {
      status: CaseStatus.WITHDRAWN,
      withdrawReason: reason,
      withdrawnAt: new Date().toISOString(),
    });

    return updatedCase;
  } catch (error) {
    console.error('Error withdrawing case:', error);
    throw error;
  }
};

/**
 * 获取案件统计信息
 */
export const getCaseStatistics = async (userId: string) => {
  try {
    const cases = await getMyCases(userId);

    const statistics = {
      total: cases.length,
      byStatus: {
        [CaseStatus.PENDING]: 0,
        [CaseStatus.IN_PROGRESS]: 0,
        [CaseStatus.CLOSED]: 0,
        [CaseStatus.WITHDRAWN]: 0,
      },
      successRate: 0,
    };

    // 按状态统计
    cases.forEach(c => {
      if (statistics.byStatus[c.status] !== undefined) {
        statistics.byStatus[c.status]++;
      }
    });

    // 计算胜诉率（简化计算，实际需要根据案件结果判断）
    const closedCases = cases.filter(c => c.status === CaseStatus.CLOSED);
    if (closedCases.length > 0) {
      const successfulCases = closedCases.filter(c => c.result?.includes('胜诉') || c.result?.includes('成功'));
      statistics.successRate = (successfulCases.length / closedCases.length) * 100;
    }

    return statistics;
  } catch (error) {
    console.error('Error getting case statistics:', error);
    return {
      total: 0,
      byStatus: {},
      successRate: 0,
    };
  }
};

export default {
  createCase,
  getMyCases,
  getCaseById,
  updateCaseStatus,
  updateCaseProgress,
  uploadDocument,
  getCaseDocuments,
  deleteDocument,
  getCaseProgressHistory,
  closeCase,
  withdrawCase,
  getCaseStatistics,
};
