/**
 * 律师服务
 * 提供律师查询、咨询管理、评价等功能
 */

import {
  LawyerProfile,
  LawyerSpecialty,
  LegalConsultation,
  LegalConsultationType,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';
import {
  getLawyers as getAllLawyers,
  getLawyerById as getLegalLawyerById,
  getLawyersBySpecialty,
  searchLawyers,
  getConsultations,
  getConsultationById as getLegalConsultationById,
  createConsultation as createLegalConsultation,
  updateConsultation as updateLegalConsultation,
} from './legalService';

/**
 * 律师筛选条件接口
 */
export interface LawyerFilters {
  specialty?: LawyerSpecialty;
  city?: string;
  minRating?: number;
  maxPrice?: number;
  isOnline?: boolean;
  keyword?: string;
}

/**
 * 咨询回复接口
 */
export interface ConsultationReply {
  content: string;
  attachments?: string[];
}

/**
 * 咨询评价接口
 */
export interface ConsultationRating {
  rating: number; // 1-5星
  comment?: string;
  tags?: string[]; // 评价标签，如"专业"、"耐心"、"及时"等
}

/**
 * 获取律师列表（支持筛选）
 */
export const getLawyers = async (filters?: LawyerFilters): Promise<LawyerProfile[]> => {
  try {
    let lawyers = await getAllLawyers();

    // 应用筛选条件
    if (filters) {
      // 按专业领域筛选
      if (filters.specialty) {
        lawyers = lawyers.filter(lawyer => lawyer.specialties.includes(filters.specialty!));
      }

      // 按城市筛选
      if (filters.city) {
        lawyers = lawyers.filter(lawyer => lawyer.lawFirm.includes(filters.city!));
      }

      // 按评分筛选
      if (filters.minRating !== undefined) {
        lawyers = lawyers.filter(lawyer => lawyer.rating >= filters.minRating!);
      }

      // 按价格筛选（以图文咨询价格为基准）
      if (filters.maxPrice !== undefined) {
        lawyers = lawyers.filter(lawyer => lawyer.textConsultationPrice <= filters.maxPrice!);
      }

      // 按在线状态筛选
      if (filters.isOnline !== undefined) {
        lawyers = lawyers.filter(lawyer => lawyer.isOnline === filters.isOnline);
      }

      // 按关键词搜索
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        lawyers = lawyers.filter(
          lawyer =>
            lawyer.name.toLowerCase().includes(keyword) ||
            lawyer.lawFirm.toLowerCase().includes(keyword) ||
            lawyer.introduction?.toLowerCase().includes(keyword)
        );
      }
    }

    return lawyers;
  } catch (error) {
    console.error('Error getting lawyers with filters:', error);
    return [];
  }
};

/**
 * 根据ID获取律师详情
 */
export const getLawyerById = async (lawyerId: string): Promise<LawyerProfile | null> => {
  return getLegalLawyerById(lawyerId);
};

/**
 * 创建咨询
 */
export const createConsultation = async (
  consultationData: Omit<LegalConsultation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LegalConsultation> => {
  return createLegalConsultation(consultationData);
};

/**
 * 获取用户的咨询记录
 */
export const getMyConsultations = async (userId: string): Promise<LegalConsultation[]> => {
  try {
    const allConsultations = await getConsultations();
    return allConsultations.filter(consultation => consultation.userId === userId);
  } catch (error) {
    console.error('Error getting my consultations:', error);
    return [];
  }
};

/**
 * 根据ID获取咨询详情
 */
export const getConsultationById = async (consultationId: string): Promise<LegalConsultation | null> => {
  return getLegalConsultationById(consultationId);
};

/**
 * 回复咨询（用户追问）
 */
export const replyConsultation = async (
  consultationId: string,
  reply: ConsultationReply
): Promise<LegalConsultation | null> => {
  try {
    const consultation = await getLegalConsultationById(consultationId);
    if (!consultation) {
      throw new Error('咨询不存在');
    }

    // 添加用户回复到对话记录
    const messages = consultation.messages || [];
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      content: reply.content,
      attachments: reply.attachments || [],
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // 更新咨询状态为待回复
    const updatedConsultation = await updateLegalConsultation(consultationId, {
      messages,
      status: 'pending_reply',
      lastMessageAt: new Date().toISOString(),
    });

    return updatedConsultation;
  } catch (error) {
    console.error('Error replying to consultation:', error);
    throw error;
  }
};

/**
 * 评价咨询
 */
export const rateConsultation = async (
  consultationId: string,
  rating: ConsultationRating
): Promise<LegalConsultation | null> => {
  try {
    const consultation = await getLegalConsultationById(consultationId);
    if (!consultation) {
      throw new Error('咨询不存在');
    }

    // 只有已完成的咨询可以评价
    if (consultation.status !== 'completed') {
      throw new Error('只有已完成的咨询可以评价');
    }

    // 更新咨询评价
    const updatedConsultation = await updateLegalConsultation(consultationId, {
      rating: rating.rating,
      ratingComment: rating.comment,
      ratingTags: rating.tags || [],
      ratedAt: new Date().toISOString(),
    });

    // 更新律师的平均评分和评价数量
    await updateLawyerRating(consultation.lawyerId, rating.rating);

    return updatedConsultation;
  } catch (error) {
    console.error('Error rating consultation:', error);
    throw error;
  }
};

/**
 * 更新律师的平均评分（内部辅助函数）
 */
const updateLawyerRating = async (lawyerId: string, newRating: number): Promise<void> => {
  try {
    const lawyer = await getLegalLawyerById(lawyerId);
    if (!lawyer) {
      return;
    }

    // 计算新的平均评分
    const totalRatings = lawyer.reviewCount || 0;
    const currentAverage = lawyer.rating || 0;
    const newAverage = (currentAverage * totalRatings + newRating) / (totalRatings + 1);

    // 更新律师信息（注意：这需要在 legalService 中添加 updateLawyer 函数）
    // 这里暂时不更新，因为 legalService 中的律师数据是 mock 数据
    console.log(`律师 ${lawyerId} 新评分: ${newRating}, 新平均分: ${newAverage.toFixed(1)}`);
  } catch (error) {
    console.error('Error updating lawyer rating:', error);
  }
};

/**
 * 取消咨询
 */
export const cancelConsultation = async (
  consultationId: string,
  reason: string
): Promise<LegalConsultation | null> => {
  try {
    const consultation = await getLegalConsultationById(consultationId);
    if (!consultation) {
      throw new Error('咨询不存在');
    }

    // 只有待回复或进行中的咨询可以取消
    if (consultation.status !== 'pending' && consultation.status !== 'in_progress') {
      throw new Error('当前咨询状态不允许取消');
    }

    const updatedConsultation = await updateLegalConsultation(consultationId, {
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
    });

    return updatedConsultation;
  } catch (error) {
    console.error('Error cancelling consultation:', error);
    throw error;
  }
};

/**
 * 完成咨询
 */
export const completeConsultation = async (consultationId: string): Promise<LegalConsultation | null> => {
  try {
    const consultation = await getLegalConsultationById(consultationId);
    if (!consultation) {
      throw new Error('咨询不存在');
    }

    if (consultation.status !== 'in_progress') {
      throw new Error('只有进行中的咨询可以标记为完成');
    }

    const updatedConsultation = await updateLegalConsultation(consultationId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    return updatedConsultation;
  } catch (error) {
    console.error('Error completing consultation:', error);
    throw error;
  }
};

/**
 * 获取推荐律师（基于专业领域和评分）
 */
export const getRecommendedLawyers = async (
  specialty?: LawyerSpecialty,
  limit: number = 5
): Promise<LawyerProfile[]> => {
  try {
    let lawyers = await getAllLawyers();

    // 如果指定了专业领域，按专业筛选
    if (specialty) {
      lawyers = lawyers.filter(lawyer => lawyer.specialties.includes(specialty));
    }

    // 按评分和案件数量排序
    lawyers.sort((a, b) => {
      const scoreA = a.rating * 0.7 + (a.caseCount / 1000) * 0.3;
      const scoreB = b.rating * 0.7 + (b.caseCount / 1000) * 0.3;
      return scoreB - scoreA;
    });

    // 返回前N个
    return lawyers.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommended lawyers:', error);
    return [];
  }
};

/**
 * 获取在线律师
 */
export const getOnlineLawyers = async (): Promise<LawyerProfile[]> => {
  try {
    const lawyers = await getAllLawyers();
    return lawyers.filter(lawyer => lawyer.isOnline);
  } catch (error) {
    console.error('Error getting online lawyers:', error);
    return [];
  }
};

export default {
  getLawyers,
  getLawyerById,
  createConsultation,
  getMyConsultations,
  getConsultationById,
  replyConsultation,
  rateConsultation,
  cancelConsultation,
  completeConsultation,
  getRecommendedLawyers,
  getOnlineLawyers,
};
