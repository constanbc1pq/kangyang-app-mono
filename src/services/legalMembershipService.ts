/**
 * 法律服务会员管理服务
 * 提供会员购买、续费、配额管理等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LegalMembership,
  MembershipTier,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';
import {
  getUserMembership,
  updateUserMembership,
} from './legalService';

/**
 * 服务类型枚举
 */
export enum ServiceType {
  WILL_CREATION = 'will_creation',
  LAWYER_CONSULTATION = 'lawyer_consultation',
  CONTRACT_REVIEW = 'contract_review',
  DOCUMENT_TEMPLATES = 'document_templates',
  LEGAL_CHECKUP = 'legal_checkup',
  CASE_ANALYSIS = 'case_analysis',
}

/**
 * 支付数据接口
 */
export interface PaymentData {
  method: 'wechat' | 'alipay' | 'unionpay' | 'credit_card';
  amount: number;
  transactionId?: string;
}

/**
 * 服务配额信息接口
 */
export interface ServiceQuota {
  tier: MembershipTier;
  quotas: {
    [ServiceType.WILL_CREATION]: number | '∞';
    [ServiceType.LAWYER_CONSULTATION]: number | '∞';
    [ServiceType.CONTRACT_REVIEW]: number | '∞';
    [ServiceType.DOCUMENT_TEMPLATES]: number | '∞';
    [ServiceType.LEGAL_CHECKUP]: number | '∞';
    [ServiceType.CASE_ANALYSIS]: number | '∞';
  };
  used: {
    [ServiceType.WILL_CREATION]: number;
    [ServiceType.LAWYER_CONSULTATION]: number;
    [ServiceType.CONTRACT_REVIEW]: number;
    [ServiceType.DOCUMENT_TEMPLATES]: number;
    [ServiceType.LEGAL_CHECKUP]: number;
    [ServiceType.CASE_ANALYSIS]: number;
  };
}

/**
 * 会员套餐配额配置
 */
const MEMBERSHIP_QUOTAS: Record<MembershipTier, Omit<ServiceQuota['quotas'], 'tier'>> = {
  [MembershipTier.BASIC]: {
    [ServiceType.WILL_CREATION]: 0,
    [ServiceType.LAWYER_CONSULTATION]: 0,
    [ServiceType.CONTRACT_REVIEW]: 0,
    [ServiceType.DOCUMENT_TEMPLATES]: 3,
    [ServiceType.LEGAL_CHECKUP]: 1,
    [ServiceType.CASE_ANALYSIS]: 0,
  },
  [MembershipTier.STANDARD]: {
    [ServiceType.WILL_CREATION]: 3,
    [ServiceType.LAWYER_CONSULTATION]: 300,
    [ServiceType.CONTRACT_REVIEW]: 5,
    [ServiceType.DOCUMENT_TEMPLATES]: '∞',
    [ServiceType.LEGAL_CHECKUP]: 4,
    [ServiceType.CASE_ANALYSIS]: 2,
  },
  [MembershipTier.PREMIUM]: {
    [ServiceType.WILL_CREATION]: '∞',
    [ServiceType.LAWYER_CONSULTATION]: 600,
    [ServiceType.CONTRACT_REVIEW]: '∞',
    [ServiceType.DOCUMENT_TEMPLATES]: '∞',
    [ServiceType.LEGAL_CHECKUP]: 12,
    [ServiceType.CASE_ANALYSIS]: 6,
  },
  [MembershipTier.VIP_FAMILY]: {
    [ServiceType.WILL_CREATION]: '∞',
    [ServiceType.LAWYER_CONSULTATION]: '∞',
    [ServiceType.CONTRACT_REVIEW]: '∞',
    [ServiceType.DOCUMENT_TEMPLATES]: '∞',
    [ServiceType.LEGAL_CHECKUP]: '∞',
    [ServiceType.CASE_ANALYSIS]: '∞',
  },
};

/**
 * 会员套餐价格配置（年费，单位：元）
 */
export const LEGAL_MEMBERSHIP_PRICES: Record<MembershipTier, number> = {
  [MembershipTier.BASIC]: 0,
  [MembershipTier.STANDARD]: 1980,
  [MembershipTier.PREMIUM]: 4980,
  [MembershipTier.VIP_FAMILY]: 9800,
};

// 保持内部引用兼容
const MEMBERSHIP_PRICES = LEGAL_MEMBERSHIP_PRICES;

/**
 * 获取我的会员信息
 */
export const getMyMembership = async (userId: string): Promise<LegalMembership | null> => {
  return getUserMembership(userId);
};

/**
 * 购买会员
 */
export const purchaseMembership = async (
  userId: string,
  tier: MembershipTier,
  paymentData: PaymentData
): Promise<LegalMembership> => {
  try {
    // 验证支付金额
    const expectedPrice = MEMBERSHIP_PRICES[tier];
    if (paymentData.amount !== expectedPrice) {
      throw new Error(`支付金额不匹配，期望 ¥${expectedPrice}，实际 ¥${paymentData.amount}`);
    }

    // 检查是否已有会员
    const existingMembership = await getUserMembership(userId);
    if (existingMembership && existingMembership.tier !== MembershipTier.BASIC) {
      throw new Error('您已是会员，请使用续费功能');
    }

    // 创建会员信息
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 一年有效期

    const membership: LegalMembership = {
      userId,
      tier,
      purchasedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      autoRenew: false,
      usedQuota: {
        willCreation: 0,
        lawyerConsultation: 0,
        contractReview: 0,
        documentTemplates: 0,
        legalCheckup: 0,
        caseAnalysis: 0,
      },
      paymentHistory: [
        {
          date: now.toISOString(),
          amount: paymentData.amount,
          method: paymentData.method,
          transactionId: paymentData.transactionId || `txn_${Date.now()}`,
          type: 'purchase',
        },
      ],
    };

    // 保存会员信息
    await updateUserMembership(membership);

    console.log(`用户 ${userId} 成功购买 ${tier} 会员`);
    return membership;
  } catch (error) {
    console.error('Error purchasing membership:', error);
    throw error;
  }
};

/**
 * 续费会员
 */
export const renewMembership = async (
  userId: string,
  paymentData: PaymentData
): Promise<LegalMembership> => {
  try {
    const membership = await getUserMembership(userId);
    if (!membership) {
      throw new Error('会员信息不存在，请先购买会员');
    }

    // 验证支付金额
    const expectedPrice = MEMBERSHIP_PRICES[membership.tier];
    if (paymentData.amount !== expectedPrice) {
      throw new Error(`支付金额不匹配，期望 ¥${expectedPrice}，实际 ¥${paymentData.amount}`);
    }

    // 计算新的到期时间
    const now = new Date();
    const currentExpiry = new Date(membership.expiresAt);
    const newExpiry = currentExpiry > now ? currentExpiry : now;
    newExpiry.setFullYear(newExpiry.getFullYear() + 1); // 延长一年

    // 更新会员信息
    const paymentHistory = membership.paymentHistory || [];
    paymentHistory.push({
      date: now.toISOString(),
      amount: paymentData.amount,
      method: paymentData.method,
      transactionId: paymentData.transactionId || `txn_${Date.now()}`,
      type: 'renewal',
    });

    const updatedMembership: LegalMembership = {
      ...membership,
      expiresAt: newExpiry.toISOString(),
      paymentHistory,
      updatedAt: now.toISOString(),
    };

    await updateUserMembership(updatedMembership);

    console.log(`用户 ${userId} 成功续费会员至 ${newExpiry.toISOString()}`);
    return updatedMembership;
  } catch (error) {
    console.error('Error renewing membership:', error);
    throw error;
  }
};

/**
 * 获取服务配额
 */
export const getServiceQuota = async (userId: string): Promise<ServiceQuota> => {
  try {
    const membership = await getUserMembership(userId);

    // 如果没有会员信息，返回基础版配额
    const tier = membership?.tier || MembershipTier.BASIC;
    const quotas = MEMBERSHIP_QUOTAS[tier];
    const used = membership?.usedQuota || {
      willCreation: 0,
      lawyerConsultation: 0,
      contractReview: 0,
      documentTemplates: 0,
      legalCheckup: 0,
      caseAnalysis: 0,
    };

    return {
      tier,
      quotas,
      used,
    };
  } catch (error) {
    console.error('Error getting service quota:', error);
    // 返回基础版配额
    return {
      tier: MembershipTier.BASIC,
      quotas: MEMBERSHIP_QUOTAS[MembershipTier.BASIC],
      used: {
        [ServiceType.WILL_CREATION]: 0,
        [ServiceType.LAWYER_CONSULTATION]: 0,
        [ServiceType.CONTRACT_REVIEW]: 0,
        [ServiceType.DOCUMENT_TEMPLATES]: 0,
        [ServiceType.LEGAL_CHECKUP]: 0,
        [ServiceType.CASE_ANALYSIS]: 0,
      },
    };
  }
};

/**
 * 消耗配额
 */
export const consumeQuota = async (
  userId: string,
  serviceType: ServiceType,
  amount: number = 1
): Promise<boolean> => {
  try {
    const membership = await getUserMembership(userId);
    if (!membership) {
      throw new Error('会员信息不存在');
    }

    // 检查会员是否过期
    const now = new Date();
    const expiry = new Date(membership.expiresAt);
    if (expiry < now) {
      throw new Error('会员已过期，请续费');
    }

    // 获取配额
    const quotas = MEMBERSHIP_QUOTAS[membership.tier];
    const usedQuota = membership.usedQuota;

    // 映射服务类型到配额字段
    const quotaFieldMap: Record<ServiceType, keyof typeof usedQuota> = {
      [ServiceType.WILL_CREATION]: 'willCreation',
      [ServiceType.LAWYER_CONSULTATION]: 'lawyerConsultation',
      [ServiceType.CONTRACT_REVIEW]: 'contractReview',
      [ServiceType.DOCUMENT_TEMPLATES]: 'documentTemplates',
      [ServiceType.LEGAL_CHECKUP]: 'legalCheckup',
      [ServiceType.CASE_ANALYSIS]: 'caseAnalysis',
    };

    const quotaField = quotaFieldMap[serviceType];
    const totalQuota = quotas[serviceType];
    const currentUsed = usedQuota[quotaField];

    // 检查配额是否充足
    if (totalQuota !== '∞') {
      if (currentUsed + amount > (totalQuota as number)) {
        throw new Error('配额不足，请升级会员或等待配额重置');
      }
    }

    // 消耗配额
    usedQuota[quotaField] += amount;

    // 更新会员信息
    const updatedMembership: LegalMembership = {
      ...membership,
      usedQuota,
      updatedAt: new Date().toISOString(),
    };

    await updateUserMembership(updatedMembership);

    console.log(`用户 ${userId} 消耗 ${serviceType} 配额 ${amount}，剩余 ${totalQuota === '∞' ? '∞' : (totalQuota as number) - usedQuota[quotaField]}`);
    return true;
  } catch (error) {
    console.error('Error consuming quota:', error);
    throw error;
  }
};

/**
 * 检查配额是否充足
 */
export const checkQuotaAvailable = async (
  userId: string,
  serviceType: ServiceType,
  required: number = 1
): Promise<boolean> => {
  try {
    const quota = await getServiceQuota(userId);
    const totalQuota = quota.quotas[serviceType];
    const usedQuota = quota.used[serviceType];

    if (totalQuota === '∞') {
      return true;
    }

    return usedQuota + required <= (totalQuota as number);
  } catch (error) {
    console.error('Error checking quota availability:', error);
    return false;
  }
};

/**
 * 设置自动续费
 */
export const setAutoRenew = async (userId: string, autoRenew: boolean): Promise<void> => {
  try {
    const membership = await getUserMembership(userId);
    if (!membership) {
      throw new Error('会员信息不存在');
    }

    const updatedMembership: LegalMembership = {
      ...membership,
      autoRenew,
      updatedAt: new Date().toISOString(),
    };

    await updateUserMembership(updatedMembership);
    console.log(`用户 ${userId} ${autoRenew ? '开启' : '关闭'}自动续费`);
  } catch (error) {
    console.error('Error setting auto renew:', error);
    throw error;
  }
};

/**
 * 获取会员权益对比
 */
export const getMembershipComparison = () => {
  return Object.entries(MEMBERSHIP_QUOTAS).map(([tier, quotas]) => ({
    tier: tier as MembershipTier,
    price: MEMBERSHIP_PRICES[tier as MembershipTier],
    quotas,
  }));
};

export default {
  getMyMembership,
  purchaseMembership,
  renewMembership,
  getServiceQuota,
  consumeQuota,
  checkQuotaAvailable,
  setAutoRenew,
  getMembershipComparison,
};
