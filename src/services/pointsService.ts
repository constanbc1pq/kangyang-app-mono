/**
 * 积分服务 - 处理积分获取、消费、兑换等逻辑
 */

import {
  PointsRecord,
  PointsSource,
  MembershipLevel,
  POINTS_SOURCE_LABELS,
} from '@/types/membership';
import {
  getPoints,
  earnPoints as earnPointsBase,
  spendPoints as spendPointsBase,
  getPointsMultiplier as getPointsMultiplierBase,
  getUserData,
} from './userDataService';

// ==================== 积分获取规则常量 ====================

/**
 * 基础积分获取规则
 */
export const POINTS_EARN_RULES = {
  // 每日签到
  dailyCheckin: {
    base: 10,
    streak7: 20, // 连续7天
    streak30: 50, // 连续30天
  },
  // 数据上传
  dataUpload: {
    healthData: 5, // 上传健康数据
    deviceSync: 3, // 设备同步
  },
  // 订单购买 (每消费1元获得基础积分)
  orderPurchase: {
    pointsPerYuan: 1,
  },
  // 邀请好友
  referral: {
    perInvite: 100,
    maxMonthly: 500,
  },
};

/**
 * 积分兑换规则
 */
export const POINTS_REDEEM_RULES = {
  // 积分抵扣订单 (每100积分=1元)
  orderDeduction: {
    pointsPerYuan: 100,
    maxDeductionRate: 0.5, // 最多抵扣50%订单金额
  },
  // 兑换会员
  membershipRedeem: {
    [MembershipLevel.GOLD]: {
      monthly: 2900,
      quarterly: 7800,
      yearly: 29800,
    },
    [MembershipLevel.PLATINUM]: {
      monthly: 9900,
      quarterly: 26700,
      yearly: 99800,
    },
    [MembershipLevel.DIAMOND]: {
      monthly: 19900,
      quarterly: 53700,
      yearly: 199800,
    },
  },
};

// ==================== 积分获取方法 ====================

/**
 * 每日签到获取积分
 */
export const dailyCheckin = async (): Promise<{
  success: boolean;
  points: number;
  streak: number;
  message: string;
}> => {
  const userData = await getUserData();
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // 检查今日是否已签到
  const todayCheckin = userData.points.history.find(
    (record) =>
      record.source === 'daily_checkin' &&
      record.date.startsWith(today)
  );

  if (todayCheckin) {
    return {
      success: false,
      points: 0,
      streak: 0,
      message: '今日已签到',
    };
  }

  // 计算连续签到天数
  let streak = 1;
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const yesterdayCheckin = userData.points.history.find(
    (record) =>
      record.source === 'daily_checkin' &&
      record.date.startsWith(yesterday)
  );

  if (yesterdayCheckin) {
    // 查找之前的连续记录
    const checkinRecords = userData.points.history
      .filter((record) => record.source === 'daily_checkin')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (let i = 0; i < checkinRecords.length; i++) {
      const recordDate = new Date(checkinRecords[i].date);
      const expectedDate = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);

      if (
        recordDate.toISOString().split('T')[0] ===
        expectedDate.toISOString().split('T')[0]
      ) {
        streak++;
      } else {
        break;
      }
    }
  }

  // 计算获得积分
  let basePoints = POINTS_EARN_RULES.dailyCheckin.base;
  let bonusMessage = '';

  if (streak >= 30) {
    basePoints = POINTS_EARN_RULES.dailyCheckin.streak30;
    bonusMessage = '（连续30天奖励）';
  } else if (streak >= 7) {
    basePoints = POINTS_EARN_RULES.dailyCheckin.streak7;
    bonusMessage = '（连续7天奖励）';
  }

  const success = await earnPointsBase(
    basePoints,
    'daily_checkin',
    `每日签到${bonusMessage}`
  );

  return {
    success,
    points: success ? basePoints * (await getPointsMultiplierBase()) : 0,
    streak,
    message: success
      ? `签到成功，连续${streak}天，获得${basePoints}积分${bonusMessage}`
      : '签到失败',
  };
};

/**
 * 数据上传获取积分
 */
export const earnPointsForDataUpload = async (
  type: 'healthData' | 'deviceSync'
): Promise<boolean> => {
  const points = POINTS_EARN_RULES.dataUpload[type];
  const description =
    type === 'healthData' ? '上传健康数据' : '设备数据同步';

  return await earnPointsBase(points, 'data_upload', description);
};

/**
 * 订单购买获取积分
 */
export const earnPointsForOrder = async (
  orderAmount: number,
  orderId: string
): Promise<boolean> => {
  const points = Math.floor(
    orderAmount * POINTS_EARN_RULES.orderPurchase.pointsPerYuan
  );

  if (points <= 0) {
    return true; // 金额太小不获得积分，但不算失败
  }

  return await earnPointsBase(
    points,
    'order_purchase',
    `订单奖励（￥${orderAmount}）`,
    orderId
  );
};

/**
 * 邀请好友获取积分
 */
export const earnPointsForReferral = async (
  referralCode: string
): Promise<{ success: boolean; points: number; message: string }> => {
  const userData = await getUserData();
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 计算本月邀请积分
  const monthlyReferralPoints = userData.points.history
    .filter(
      (record) =>
        record.source === 'referral' && record.date.startsWith(thisMonth)
    )
    .reduce((sum, record) => sum + record.amount, 0);

  if (monthlyReferralPoints >= POINTS_EARN_RULES.referral.maxMonthly) {
    return {
      success: false,
      points: 0,
      message: '本月邀请奖励已达上限',
    };
  }

  const points = POINTS_EARN_RULES.referral.perInvite;
  const success = await earnPointsBase(
    points,
    'referral',
    `邀请好友（${referralCode}）`
  );

  return {
    success,
    points: success ? points * (await getPointsMultiplierBase()) : 0,
    message: success ? `邀请成功，获得${points}积分` : '邀请失败',
  };
};

// ==================== 积分消费方法 ====================

/**
 * 计算订单可抵扣金额
 */
export const calculateOrderDeduction = async (
  orderAmount: number
): Promise<{
  maxPoints: number;
  maxDeduction: number;
  availablePoints: number;
  actualPoints: number;
  actualDeduction: number;
}> => {
  const points = await getPoints();

  // 最大可抵扣金额（订单金额的50%）
  const maxDeduction =
    orderAmount * POINTS_REDEEM_RULES.orderDeduction.maxDeductionRate;

  // 最大需要的积分
  const maxPoints = Math.ceil(
    maxDeduction * POINTS_REDEEM_RULES.orderDeduction.pointsPerYuan
  );

  // 实际可用积分
  const actualPoints = Math.min(points.balance, maxPoints);

  // 实际抵扣金额
  const actualDeduction =
    actualPoints / POINTS_REDEEM_RULES.orderDeduction.pointsPerYuan;

  return {
    maxPoints,
    maxDeduction,
    availablePoints: points.balance,
    actualPoints,
    actualDeduction,
  };
};

/**
 * 使用积分抵扣订单
 */
export const usePointsForOrder = async (
  points: number,
  orderId: string
): Promise<boolean> => {
  const deductionAmount =
    points / POINTS_REDEEM_RULES.orderDeduction.pointsPerYuan;

  return await spendPointsBase(
    points,
    'order_deduction',
    `订单抵扣（￥${deductionAmount}）`,
    orderId
  );
};

/**
 * 使用积分兑换会员
 */
export const redeemMembership = async (
  level: MembershipLevel.GOLD | MembershipLevel.PLATINUM | MembershipLevel.DIAMOND,
  cycle: 'monthly' | 'quarterly' | 'yearly'
): Promise<{ success: boolean; message: string }> => {
  const pointsRequired = POINTS_REDEEM_RULES.membershipRedeem[level][cycle];
  const points = await getPoints();

  if (points.balance < pointsRequired) {
    return {
      success: false,
      message: `积分不足，需要${pointsRequired}积分，当前${points.balance}积分`,
    };
  }

  const success = await spendPointsBase(
    pointsRequired,
    'membership_redeem',
    `兑换${level === MembershipLevel.GOLD ? '黄金' : level === MembershipLevel.PLATINUM ? '白金' : '钻石'}会员（${cycle === 'monthly' ? '月' : cycle === 'quarterly' ? '季' : '年'}）`
  );

  return {
    success,
    message: success ? '兑换成功' : '兑换失败',
  };
};

// ==================== 积分查询方法 ====================

/**
 * 获取积分统计信息
 */
export const getPointsStats = async (): Promise<{
  balance: number;
  totalEarned: number;
  totalSpent: number;
  multiplier: number;
  monthlyEarned: number;
  monthlySpent: number;
}> => {
  const points = await getPoints();
  const multiplier = await getPointsMultiplierBase();

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthlyRecords = points.history.filter((record) =>
    record.date.startsWith(thisMonth)
  );

  const monthlyEarned = monthlyRecords
    .filter((record) => record.type === 'earn')
    .reduce((sum, record) => sum + record.amount, 0);

  const monthlySpent = monthlyRecords
    .filter((record) => record.type === 'spend')
    .reduce((sum, record) => sum + record.amount, 0);

  return {
    balance: points.balance,
    totalEarned: points.totalEarned,
    totalSpent: points.totalSpent,
    multiplier,
    monthlyEarned,
    monthlySpent,
  };
};

/**
 * 获取积分来源分布
 */
export const getPointsSourceDistribution = async (): Promise<
  Array<{
    source: PointsSource;
    label: string;
    amount: number;
    percentage: number;
  }>
> => {
  const points = await getPoints();

  const earnRecords = points.history.filter((record) => record.type === 'earn');
  const totalEarned = earnRecords.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  const sourceAmounts: Partial<Record<PointsSource, number>> = {};

  for (const record of earnRecords) {
    sourceAmounts[record.source] =
      (sourceAmounts[record.source] || 0) + record.amount;
  }

  return (Object.entries(sourceAmounts) as [PointsSource, number][]).map(
    ([source, amount]) => ({
      source,
      label: POINTS_SOURCE_LABELS[source],
      amount,
      percentage: totalEarned > 0 ? Math.round((amount / totalEarned) * 100) : 0,
    })
  );
};

/**
 * 获取分页的积分历史
 */
export const getPointsHistoryPaginated = async (
  page: number = 1,
  pageSize: number = 20,
  type?: 'earn' | 'spend'
): Promise<{
  records: PointsRecord[];
  total: number;
  hasMore: boolean;
}> => {
  const points = await getPoints();
  let records = points.history;

  if (type) {
    records = records.filter((record) => record.type === type);
  }

  const total = records.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRecords = records.slice(start, end);

  return {
    records: paginatedRecords,
    total,
    hasMore: end < total,
  };
};
