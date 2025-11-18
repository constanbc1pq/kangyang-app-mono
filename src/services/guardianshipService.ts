/**
 * 意定监护数据服务
 * 提供意定监护协议创建、管理、公证等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GuardianshipAgreement,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';
import {
  getGuardianshipAgreements,
  getGuardianshipAgreementById as getLegalGuardianshipAgreementById,
  createGuardianshipAgreement as createLegalGuardianshipAgreement,
  updateGuardianshipAgreement as updateLegalGuardianshipAgreement,
} from './legalService';

/**
 * 监护公证预约数据接口
 */
export interface GuardianshipNotarizationAppointment {
  agreementId: string;
  notaryOffice: string;
  appointmentDate: string;
  appointmentTime: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  requiresWitness: boolean;
  witnessNames?: string[];
  notes?: string;
}

/**
 * 创建监护协议
 */
export const createGuardianshipAgreement = async (
  data: Omit<GuardianshipAgreement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GuardianshipAgreement> => {
  return createLegalGuardianshipAgreement(data);
};

/**
 * 获取用户的所有监护协议
 */
export const getMyAgreements = async (userId: string): Promise<GuardianshipAgreement[]> => {
  try {
    const allAgreements = await getGuardianshipAgreements();
    return allAgreements.filter(agreement => agreement.userId === userId);
  } catch (error) {
    console.error('Error getting my guardianship agreements:', error);
    return [];
  }
};

/**
 * 根据ID获取监护协议详情
 */
export const getAgreementById = async (agreementId: string): Promise<GuardianshipAgreement | null> => {
  return getLegalGuardianshipAgreementById(agreementId);
};

/**
 * 更新监护协议
 */
export const updateAgreement = async (
  agreementId: string,
  data: Partial<GuardianshipAgreement>
): Promise<GuardianshipAgreement | null> => {
  return updateLegalGuardianshipAgreement(agreementId, data);
};

/**
 * 预约公证
 */
export const bookNotarization = async (
  agreementId: string,
  appointmentData: Omit<GuardianshipNotarizationAppointment, 'agreementId'>
): Promise<GuardianshipAgreement | null> => {
  try {
    const agreement = await getAgreementById(agreementId);
    if (!agreement) {
      throw new Error('监护协议不存在');
    }

    // 只有草稿或待公证的协议可以预约公证
    if (agreement.status !== 'draft' && agreement.status !== 'pending_notarization') {
      throw new Error('当前协议状态不允许预约公证');
    }

    // 保存公证预约信息
    const appointment: GuardianshipNotarizationAppointment = {
      agreementId,
      ...appointmentData,
    };

    // 获取所有预约记录
    const appointmentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.GUARDIANSHIP_AGREEMENTS}_notarization_appointments`;
    const appointmentsData = await AsyncStorage.getItem(appointmentsKey);
    const appointments: GuardianshipNotarizationAppointment[] = appointmentsData
      ? JSON.parse(appointmentsData)
      : [];

    // 添加新预约
    appointments.push(appointment);
    await AsyncStorage.setItem(appointmentsKey, JSON.stringify(appointments));

    // 更新协议状态
    const updatedAgreement = await updateLegalGuardianshipAgreement(agreementId, {
      status: 'pending_notarization',
      notarizationAppointment: appointment,
    });

    return updatedAgreement;
  } catch (error) {
    console.error('Error booking notarization for guardianship:', error);
    throw error;
  }
};

/**
 * 上传公证文件
 */
export const uploadNotarizedDocument = async (
  agreementId: string,
  documentData: {
    notaryOffice: string;
    notaryNumber: string;
    notarizedDate: string;
    notaryName: string;
    fileUri: string;
    fileSize: number;
    fileName: string;
  }
): Promise<GuardianshipAgreement | null> => {
  try {
    const agreement = await getAgreementById(agreementId);
    if (!agreement) {
      throw new Error('监护协议不存在');
    }

    // 更新协议状态为已公证
    const updatedAgreement = await updateLegalGuardianshipAgreement(agreementId, {
      status: 'notarized',
      notarizedAt: new Date().toISOString(),
      notarizedDocument: documentData,
    });

    return updatedAgreement;
  } catch (error) {
    console.error('Error uploading notarized document for guardianship:', error);
    throw error;
  }
};

/**
 * 获取监护协议的公证预约信息
 */
export const getNotarizationAppointment = async (
  agreementId: string
): Promise<GuardianshipNotarizationAppointment | null> => {
  try {
    const appointmentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.GUARDIANSHIP_AGREEMENTS}_notarization_appointments`;
    const appointmentsData = await AsyncStorage.getItem(appointmentsKey);

    if (!appointmentsData) {
      return null;
    }

    const appointments: GuardianshipNotarizationAppointment[] = JSON.parse(appointmentsData);
    return appointments.find(app => app.agreementId === agreementId) || null;
  } catch (error) {
    console.error('Error getting guardianship notarization appointment:', error);
    return null;
  }
};

/**
 * 取消公证预约
 */
export const cancelNotarizationAppointment = async (agreementId: string): Promise<boolean> => {
  try {
    const appointmentsKey = `${LEGAL_SERVICE_STORAGE_KEYS.GUARDIANSHIP_AGREEMENTS}_notarization_appointments`;
    const appointmentsData = await AsyncStorage.getItem(appointmentsKey);

    if (!appointmentsData) {
      return false;
    }

    const appointments: GuardianshipNotarizationAppointment[] = JSON.parse(appointmentsData);
    const filteredAppointments = appointments.filter(app => app.agreementId !== agreementId);

    if (filteredAppointments.length === appointments.length) {
      return false; // 未找到预约
    }

    await AsyncStorage.setItem(appointmentsKey, JSON.stringify(filteredAppointments));

    // 更新协议状态
    await updateLegalGuardianshipAgreement(agreementId, {
      status: 'draft',
      notarizationAppointment: undefined,
    });

    return true;
  } catch (error) {
    console.error('Error cancelling guardianship notarization appointment:', error);
    return false;
  }
};

/**
 * 激活监护协议（公证完成后）
 */
export const activateAgreement = async (agreementId: string): Promise<GuardianshipAgreement | null> => {
  try {
    const agreement = await getAgreementById(agreementId);
    if (!agreement) {
      throw new Error('监护协议不存在');
    }

    if (agreement.status !== 'notarized') {
      throw new Error('只有已公证的协议可以激活');
    }

    const updatedAgreement = await updateLegalGuardianshipAgreement(agreementId, {
      status: 'active',
      activatedAt: new Date().toISOString(),
    });

    return updatedAgreement;
  } catch (error) {
    console.error('Error activating guardianship agreement:', error);
    throw error;
  }
};

/**
 * 终止监护协议
 */
export const terminateAgreement = async (
  agreementId: string,
  reason: string
): Promise<GuardianshipAgreement | null> => {
  try {
    const agreement = await getAgreementById(agreementId);
    if (!agreement) {
      throw new Error('监护协议不存在');
    }

    if (agreement.status !== 'active') {
      throw new Error('只有激活状态的协议可以终止');
    }

    const updatedAgreement = await updateLegalGuardianshipAgreement(agreementId, {
      status: 'terminated',
      terminatedAt: new Date().toISOString(),
      terminationReason: reason,
    });

    return updatedAgreement;
  } catch (error) {
    console.error('Error terminating guardianship agreement:', error);
    throw error;
  }
};

export default {
  createGuardianshipAgreement,
  getMyAgreements,
  getAgreementById,
  updateAgreement,
  bookNotarization,
  uploadNotarizedDocument,
  getNotarizationAppointment,
  cancelNotarizationAppointment,
  activateAgreement,
  terminateAgreement,
};
