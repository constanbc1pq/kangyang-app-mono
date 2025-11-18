/**
 * 遗嘱数据服务
 * 提供遗嘱创建、管理、审核、公证等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Will,
  WillStatus,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';
import {
  getWills,
  getWillById as getLegalWillById,
  createWill as createLegalWill,
  updateWill as updateLegalWill,
  revokeWill as revokeLegalWill,
} from './legalService';

/**
 * 公证预约数据接口
 */
export interface NotarizationAppointment {
  willId: string;
  notaryOffice: string;
  appointmentDate: string;
  appointmentTime: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  notes?: string;
}

/**
 * 公证文件数据接口
 */
export interface NotarizedDocument {
  willId: string;
  notaryOffice: string;
  notaryNumber: string;
  notarizedDate: string;
  notaryName: string;
  fileUri: string;
  fileSize: number;
  fileName: string;
}

/**
 * 创建遗嘱
 */
export const createWill = async (willData: Omit<Will, 'id' | 'createdAt' | 'updatedAt'>): Promise<Will> => {
  return createLegalWill(willData);
};

/**
 * 获取用户的所有遗嘱列表
 */
export const getMyWills = async (userId: string): Promise<Will[]> => {
  try {
    const allWills = await getWills();
    return allWills.filter(will => will.userId === userId);
  } catch (error) {
    console.error('Error getting my wills:', error);
    return [];
  }
};

/**
 * 根据ID获取遗嘱详情
 */
export const getWillById = async (willId: string): Promise<Will | null> => {
  return getLegalWillById(willId);
};

/**
 * 更新遗嘱
 */
export const updateWill = async (willId: string, data: Partial<Will>): Promise<Will | null> => {
  return updateLegalWill(willId, data);
};

/**
 * 作废遗嘱
 */
export const revokeWill = async (willId: string): Promise<Will | null> => {
  return revokeLegalWill(willId);
};

/**
 * 提交遗嘱给律师审核
 */
export const submitForReview = async (willId: string): Promise<Will | null> => {
  try {
    const will = await getWillById(willId);
    if (!will) {
      throw new Error('遗嘱不存在');
    }

    if (will.status !== WillStatus.DRAFT) {
      throw new Error('只有草稿状态的遗嘱可以提交审核');
    }

    // 更新遗嘱状态为待审核
    const updatedWill = await updateLegalWill(willId, {
      status: WillStatus.UNDER_REVIEW,
      submittedForReviewAt: new Date().toISOString(),
    });

    return updatedWill;
  } catch (error) {
    console.error('Error submitting will for review:', error);
    throw error;
  }
};

/**
 * 预约公证
 */
export const bookNotarization = async (
  willId: string,
  appointmentData: Omit<NotarizationAppointment, 'willId'>
): Promise<Will | null> => {
  try {
    const will = await getWillById(willId);
    if (!will) {
      throw new Error('遗嘱不存在');
    }

    // 只有已审核的遗嘱可以预约公证
    if (will.status !== WillStatus.REVIEWED && will.status !== WillStatus.APPROVED) {
      throw new Error('只有已审核通过的遗嘱可以预约公证');
    }

    // 保存公证预约信息
    const appointment: NotarizationAppointment = {
      willId,
      ...appointmentData,
    };

    // 获取所有预约记录
    const appointmentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_notarization_appointments`;
    const appointmentsData = await AsyncStorage.getItem(appointmentsKey);
    const appointments: NotarizationAppointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];

    // 添加新预约
    appointments.push(appointment);
    await AsyncStorage.setItem(appointmentsKey, JSON.stringify(appointments));

    // 更新遗嘱状态
    const updatedWill = await updateLegalWill(willId, {
      notarizationAppointment: appointment,
      notarizationStatus: 'scheduled',
    });

    return updatedWill;
  } catch (error) {
    console.error('Error booking notarization:', error);
    throw error;
  }
};

/**
 * 上传公证文件
 */
export const uploadNotarizedDocument = async (
  willId: string,
  documentData: Omit<NotarizedDocument, 'willId'>
): Promise<Will | null> => {
  try {
    const will = await getWillById(willId);
    if (!will) {
      throw new Error('遗嘱不存在');
    }

    // 保存公证文件信息
    const document: NotarizedDocument = {
      willId,
      ...documentData,
    };

    // 获取所有公证文件记录
    const documentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_notarized_documents`;
    const documentsData = await AsyncStorage.getItem(documentsKey);
    const documents: NotarizedDocument[] = documentsData ? JSON.parse(documentsData) : [];

    // 添加新文件
    documents.push(document);
    await AsyncStorage.setItem(documentsKey, JSON.stringify(documents));

    // 更新遗嘱状态为已公证
    const updatedWill = await updateLegalWill(willId, {
      status: WillStatus.NOTARIZED,
      notarizedAt: new Date().toISOString(),
      notarizedDocument: document,
      notarizationStatus: 'completed',
    });

    return updatedWill;
  } catch (error) {
    console.error('Error uploading notarized document:', error);
    throw error;
  }
};

/**
 * 获取遗嘱的公证预约信息
 */
export const getNotarizationAppointment = async (willId: string): Promise<NotarizationAppointment | null> => {
  try {
    const appointmentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_notarization_appointments`;
    const appointmentsData = await AsyncStorage.getItem(appointmentsKey);

    if (!appointmentsData) {
      return null;
    }

    const appointments: NotarizationAppointment[] = JSON.parse(appointmentsData);
    return appointments.find(app => app.willId === willId) || null;
  } catch (error) {
    console.error('Error getting notarization appointment:', error);
    return null;
  }
};

/**
 * 获取遗嘱的公证文件
 */
export const getNotarizedDocument = async (willId: string): Promise<NotarizedDocument | null> => {
  try {
    const documentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_notarized_documents`;
    const documentsData = await AsyncStorage.getItem(documentsKey);

    if (!documentsData) {
      return null;
    }

    const documents: NotarizedDocument[] = JSON.parse(documentsData);
    return documents.find(doc => doc.willId === willId) || null;
  } catch (error) {
    console.error('Error getting notarized document:', error);
    return null;
  }
};

/**
 * 取消公证预约
 */
export const cancelNotarizationAppointment = async (willId: string): Promise<boolean> => {
  try {
    const appointmentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_notarization_appointments`;
    const appointmentsData = await AsyncStorage.getItem(appointmentsKey);

    if (!appointmentsData) {
      return false;
    }

    const appointments: NotarizationAppointment[] = JSON.parse(appointmentsData);
    const filteredAppointments = appointments.filter(app => app.willId !== willId);

    if (filteredAppointments.length === appointments.length) {
      return false; // 未找到预约
    }

    await AsyncStorage.setItem(appointmentsKey, JSON.stringify(filteredAppointments));

    // 更新遗嘱状态
    await updateLegalWill(willId, {
      notarizationAppointment: undefined,
      notarizationStatus: 'cancelled',
    });

    return true;
  } catch (error) {
    console.error('Error cancelling notarization appointment:', error);
    return false;
  }
};

export default {
  createWill,
  getMyWills,
  getWillById,
  updateWill,
  revokeWill,
  submitForReview,
  bookNotarization,
  uploadNotarizedDocument,
  getNotarizationAppointment,
  getNotarizedDocument,
  cancelNotarizationAppointment,
};
