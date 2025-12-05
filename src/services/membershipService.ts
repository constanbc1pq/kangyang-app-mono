/**
 * 会员服务 - 处理会员购买、续费、权益等逻辑
 */

import {
  MembershipLevel,
  PaymentCycle,
  MembershipPurchaseRecord,
  MEMBERSHIP_PRICES,
  DIAMOND_FAMILY_PRICES,
  MEMBERSHIP_LEVEL_LABELS,
  MEMBERSHIP_LEVEL_COLORS,
  BENEFIT_MATRIX,
  BenefitKey,
  BenefitValue,
} from '@/types/membership';
import {
  getMembership,
  updateMembership,
  getUserData,
  saveUserData,
} from './userDataService';

// ==================== 会员购买与续费 ====================

/**
 * 计算会员价格
 */
export const calculateMembershipPrice = (
  level: MembershipLevel,
  cycle: PaymentCycle,
  isFamilyPlan: boolean = false
): number => {
  if (level === MembershipLevel.FREE) {
    return 0;
  }

  // 钻石家庭版特殊定价
  if (level === MembershipLevel.DIAMOND && isFamilyPlan) {
    return DIAMOND_FAMILY_PRICES[cycle];
  }

  return MEMBERSHIP_PRICES[level][cycle];
};

/**
 * 计算升级价格差价
 */
export const calculateUpgradePrice = async (
  targetLevel: MembershipLevel,
  cycle: PaymentCycle
): Promise<{ originalPrice: number; upgradePrice: number; savings: number }> => {
  const membership = await getMembership();
  const targetPrice = calculateMembershipPrice(targetLevel, cycle);

  if (membership.level === MembershipLevel.FREE) {
    return {
      originalPrice: targetPrice,
      upgradePrice: targetPrice,
      savings: 0,
    };
  }

  // 已有会员，计算剩余天数对应的价值
  if (membership.endDate) {
    const endDate = new Date(membership.endDate);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // 计算当前会员每日价值
    const currentCyclePrice = MEMBERSHIP_PRICES[membership.level][membership.paymentCycle || 'monthly'];
    const cycleDays = membership.paymentCycle === 'yearly' ? 365 : membership.paymentCycle === 'quarterly' ? 90 : 30;
    const dailyValue = currentCyclePrice / cycleDays;

    // 剩余价值可用于抵扣
    const remainingValue = Math.floor(dailyValue * daysRemaining);
    const upgradePrice = Math.max(0, targetPrice - remainingValue);

    return {
      originalPrice: targetPrice,
      upgradePrice,
      savings: remainingValue,
    };
  }

  return {
    originalPrice: targetPrice,
    upgradePrice: targetPrice,
    savings: 0,
  };
};

/**
 * 购买会员
 */
export const purchaseMembership = async (
  level: MembershipLevel,
  cycle: PaymentCycle,
  paymentMethod: string,
  isFamilyPlan: boolean = false,
  familyMembers?: number,
  transactionId?: string
): Promise<boolean> => {
  const userData = await getUserData();
  const now = new Date();
  const price = calculateMembershipPrice(level, cycle, isFamilyPlan);

  // 计算到期时间
  let endDate: Date;
  if (cycle === 'yearly') {
    endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  } else if (cycle === 'quarterly') {
    endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  } else {
    endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  // 创建购买记录
  const purchaseRecord: MembershipPurchaseRecord = {
    id: `purchase_${Date.now()}`,
    date: now.toISOString(),
    type: userData.membership.level === MembershipLevel.FREE ? 'purchase' : 'upgrade',
    fromLevel: userData.membership.level !== MembershipLevel.FREE ? userData.membership.level : undefined,
    toLevel: level,
    cycle,
    amount: price,
    paymentMethod,
    transactionId,
  };

  // 更新会员信息
  userData.membership = {
    level,
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    autoRenew: true,
    paymentCycle: cycle,
    isFamilyPlan,
    familyMembers: isFamilyPlan ? familyMembers : undefined,
    purchaseHistory: [...userData.membership.purchaseHistory, purchaseRecord],
  };

  return await saveUserData(userData);
};

/**
 * 续费会员
 */
export const renewMembership = async (
  paymentMethod: string,
  transactionId?: string
): Promise<boolean> => {
  const userData = await getUserData();
  const membership = userData.membership;

  if (membership.level === MembershipLevel.FREE) {
    console.warn('免费用户无法续费');
    return false;
  }

  const cycle = membership.paymentCycle || 'monthly';
  const price = calculateMembershipPrice(membership.level, cycle, membership.isFamilyPlan);

  // 计算新的到期时间（从当前到期时间延长）
  const currentEndDate = membership.endDate ? new Date(membership.endDate) : new Date();
  const now = new Date();
  const baseDate = currentEndDate > now ? currentEndDate : now;

  let newEndDate: Date;
  if (cycle === 'yearly') {
    newEndDate = new Date(baseDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  } else if (cycle === 'quarterly') {
    newEndDate = new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  } else {
    newEndDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  // 创建续费记录
  const purchaseRecord: MembershipPurchaseRecord = {
    id: `renewal_${Date.now()}`,
    date: now.toISOString(),
    type: 'renewal',
    toLevel: membership.level,
    cycle,
    amount: price,
    paymentMethod,
    transactionId,
  };

  userData.membership.endDate = newEndDate.toISOString();
  userData.membership.purchaseHistory.push(purchaseRecord);

  return await saveUserData(userData);
};

/**
 * 取消自动续费
 */
export const cancelAutoRenew = async (): Promise<boolean> => {
  return await updateMembership({ autoRenew: false });
};

/**
 * 开启自动续费
 */
export const enableAutoRenew = async (): Promise<boolean> => {
  return await updateMembership({ autoRenew: true });
};

// ==================== 会员信息查询 ====================

/**
 * 获取会员等级显示信息
 */
export const getMembershipDisplayInfo = async (): Promise<{
  level: MembershipLevel;
  label: string;
  colors: { primary: string; background: string; gradient: string[] };
  daysRemaining: number | null;
  isExpired: boolean;
  autoRenew: boolean;
}> => {
  const membership = await getMembership();

  let daysRemaining: number | null = null;
  let isExpired = false;

  if (membership.endDate && membership.level !== MembershipLevel.FREE) {
    const endDate = new Date(membership.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    daysRemaining = diffDays > 0 ? diffDays : 0;
    isExpired = diffDays <= 0;
  }

  return {
    level: membership.level,
    label: MEMBERSHIP_LEVEL_LABELS[membership.level],
    colors: MEMBERSHIP_LEVEL_COLORS[membership.level],
    daysRemaining,
    isExpired,
    autoRenew: membership.autoRenew,
  };
};

/**
 * 获取会员购买历史
 */
export const getPurchaseHistory = async (): Promise<MembershipPurchaseRecord[]> => {
  const membership = await getMembership();
  return membership.purchaseHistory;
};

// ==================== 权益查询 ====================

/**
 * 检查某项权益是否可用
 */
export const checkBenefit = async (benefitKey: BenefitKey): Promise<boolean> => {
  const membership = await getMembership();
  const value = BENEFIT_MATRIX[benefitKey][membership.level];

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    return value !== 'none';
  }

  return false;
};

/**
 * 获取权益具体值
 */
export const getBenefitValue = async (benefitKey: BenefitKey): Promise<BenefitValue> => {
  const membership = await getMembership();
  return BENEFIT_MATRIX[benefitKey][membership.level];
};

/**
 * 获取所有权益列表
 */
export const getAllBenefits = async (): Promise<Record<BenefitKey, BenefitValue>> => {
  const membership = await getMembership();
  const benefits: Partial<Record<BenefitKey, BenefitValue>> = {};

  for (const key of Object.keys(BENEFIT_MATRIX) as BenefitKey[]) {
    benefits[key] = BENEFIT_MATRIX[key][membership.level];
  }

  return benefits as Record<BenefitKey, BenefitValue>;
};

/**
 * 对比当前会员与目标等级的权益差异
 */
export const compareBenefits = async (
  targetLevel: MembershipLevel
): Promise<Array<{
  key: BenefitKey;
  currentValue: BenefitValue;
  targetValue: BenefitValue;
  improved: boolean;
}>> => {
  const membership = await getMembership();
  const result: Array<{
    key: BenefitKey;
    currentValue: BenefitValue;
    targetValue: BenefitValue;
    improved: boolean;
  }> = [];

  for (const key of Object.keys(BENEFIT_MATRIX) as BenefitKey[]) {
    const currentValue = BENEFIT_MATRIX[key][membership.level];
    const targetValue = BENEFIT_MATRIX[key][targetLevel];

    let improved = false;

    if (typeof currentValue === 'number' && typeof targetValue === 'number') {
      improved = targetValue > currentValue || (targetValue === -1 && currentValue !== -1);
    } else if (typeof currentValue === 'boolean' && typeof targetValue === 'boolean') {
      improved = !currentValue && targetValue;
    } else if (typeof currentValue === 'string' && typeof targetValue === 'string') {
      improved = currentValue === 'none' && targetValue !== 'none';
    }

    result.push({ key, currentValue, targetValue, improved });
  }

  return result;
};

// ==================== 会员等级判断工具 ====================

/**
 * 检查是否为付费会员
 */
export const isPaidMember = async (): Promise<boolean> => {
  const membership = await getMembership();
  return membership.level !== MembershipLevel.FREE;
};

/**
 * 检查是否为指定等级或更高
 */
export const isAtLeastLevel = async (level: MembershipLevel): Promise<boolean> => {
  const membership = await getMembership();
  const levels = [MembershipLevel.FREE, MembershipLevel.GOLD, MembershipLevel.PLATINUM, MembershipLevel.DIAMOND];
  const currentIndex = levels.indexOf(membership.level);
  const targetIndex = levels.indexOf(level);
  return currentIndex >= targetIndex;
};

/**
 * 获取会员等级数值（用于比较）
 */
export const getMembershipLevelValue = (level: MembershipLevel): number => {
  const levels = [MembershipLevel.FREE, MembershipLevel.GOLD, MembershipLevel.PLATINUM, MembershipLevel.DIAMOND];
  return levels.indexOf(level);
};
