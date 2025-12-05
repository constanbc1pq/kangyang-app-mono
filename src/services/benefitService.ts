/**
 * 权益服务 - 处理会员权益检查、折扣计算等逻辑
 */

import {
  MembershipLevel,
  BenefitKey,
  BenefitValue,
  BenefitModule,
  BENEFIT_MATRIX,
  SERVICE_DISCOUNT_RATES,
  MEMBERSHIP_LEVEL_LABELS,
} from '@/types/membership';
import { getMembership } from './userDataService';

// ==================== 权益描述配置 ====================

/**
 * 权益项描述
 */
export const BENEFIT_DESCRIPTIONS: Record<BenefitKey, { name: string; description: string; module: BenefitModule }> = {
  // 康模块
  ai_question_daily: {
    name: 'AI问答',
    description: '每日AI健康问答次数',
    module: 'health',
  },
  device_bindING_limit: {
    name: '设备绑定',
    description: '可绑定的健康监测设备数量',
    module: 'health',
  },
  health_data_storage_days: {
    name: '数据存储',
    description: '健康数据历史存储天数',
    module: 'health',
  },
  health_report_export: {
    name: '报告导出',
    description: '健康报告导出周期',
    module: 'health',
  },
  ai_health_insight: {
    name: 'AI健康洞察',
    description: '个性化AI健康分析报告',
    module: 'health',
  },
  family_health_guard: {
    name: '全家健康守护',
    description: '家庭成员健康数据共享与监护',
    module: 'health',
  },
  // 养模块
  recipe_customization: {
    name: '食谱定制',
    description: '个性化食谱推荐服务',
    module: 'lifestyle',
  },
  grocery_discount_rate: {
    name: '食材折扣',
    description: '商城食材购买折扣',
    module: 'lifestyle',
  },
  meal_delivery_priority: {
    name: '送餐优先',
    description: '餐食配送优先权',
    module: 'lifestyle',
  },
  elderly_service_discount: {
    name: '养老服务折扣',
    description: '养老服务购买折扣',
    module: 'lifestyle',
  },
  lawyer_ai_monthly: {
    name: '律师AI助手',
    description: '每月律师AI咨询次数',
    module: 'lifestyle',
  },
  legal_consultation: {
    name: '法律咨询',
    description: '专业律师咨询服务',
    module: 'lifestyle',
  },
  // 社区模块
  publish_monthly_limit: {
    name: '发布次数',
    description: '每月社区发布次数',
    module: 'community',
  },
  points_multiplier: {
    name: '积分倍率',
    description: '积分获取倍率',
    module: 'community',
  },
  order_commission_discount: {
    name: '佣金减免',
    description: '订单佣金减免比例',
    module: 'community',
  },
  // 通用
  ad_free: {
    name: '无广告',
    description: '无广告体验',
    module: 'general',
  },
  device_sync_limit: {
    name: '多设备同步',
    description: '支持同步的设备数量',
    module: 'general',
  },
  voice_input: {
    name: '语音输入',
    description: '语音输入功能',
    module: 'general',
  },
};

// ==================== 权益检查方法 ====================

/**
 * 检查权益是否可用
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
 * 检查数值型权益是否达到限制
 */
export const checkNumericLimit = async (
  benefitKey: BenefitKey,
  currentUsage: number
): Promise<{ allowed: boolean; remaining: number; limit: number }> => {
  const value = await getBenefitValue(benefitKey);

  if (typeof value !== 'number') {
    return { allowed: true, remaining: -1, limit: -1 };
  }

  // -1 表示无限
  if (value === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }

  const remaining = value - currentUsage;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: value,
  };
};

/**
 * 获取按模块分组的权益列表
 */
export const getBenefitsByModule = async (): Promise<
  Record<BenefitModule, Array<{
    key: BenefitKey;
    name: string;
    description: string;
    value: BenefitValue;
    displayValue: string;
  }>>
> => {
  const membership = await getMembership();

  const result: Record<BenefitModule, Array<{
    key: BenefitKey;
    name: string;
    description: string;
    value: BenefitValue;
    displayValue: string;
  }>> = {
    health: [],
    lifestyle: [],
    community: [],
    general: [],
  };

  for (const [key, config] of Object.entries(BENEFIT_DESCRIPTIONS) as [BenefitKey, typeof BENEFIT_DESCRIPTIONS[BenefitKey]][]) {
    const value = BENEFIT_MATRIX[key][membership.level];
    const displayValue = formatBenefitValue(key, value);

    result[config.module].push({
      key,
      name: config.name,
      description: config.description,
      value,
      displayValue,
    });
  }

  return result;
};

/**
 * 格式化权益值为显示文本
 */
export const formatBenefitValue = (key: BenefitKey, value: BenefitValue): string => {
  if (value === null) {
    return '不支持';
  }

  if (typeof value === 'boolean') {
    return value ? '支持' : '不支持';
  }

  if (typeof value === 'number') {
    if (value === -1) {
      return '无限';
    }
    if (value === 0) {
      return '不支持';
    }

    // 特殊处理某些权益的单位
    if (key === 'health_data_storage_days') {
      if (value >= 365) {
        return `${Math.floor(value / 365)}年`;
      }
      return `${value}天`;
    }

    if (key === 'grocery_discount_rate' || key === 'elderly_service_discount' || key === 'order_commission_discount') {
      return `${Math.round(value * 100)}%`;
    }

    if (key === 'points_multiplier') {
      return `${value}倍`;
    }

    return `${value}`;
  }

  if (typeof value === 'string') {
    // 字符串值的映射
    const stringMappings: Record<string, string> = {
      none: '不支持',
      daily: '每日报告',
      weekly_monthly: '周报/月报',
      ai_recommend: 'AI推荐',
      personal: '私人定制',
      family: '全家定制',
      text: '文字咨询',
      text_phone: '文字+电话',
    };

    return stringMappings[value] || value;
  }

  return String(value);
};

/**
 * 获取所有等级的权益对比表
 */
export const getAllLevelsBenefitsComparison = (): Array<{
  key: BenefitKey;
  name: string;
  description: string;
  module: BenefitModule;
  values: Record<MembershipLevel, { raw: BenefitValue; display: string }>;
}> => {
  const levels = [MembershipLevel.FREE, MembershipLevel.GOLD, MembershipLevel.PLATINUM, MembershipLevel.DIAMOND];

  return (Object.entries(BENEFIT_DESCRIPTIONS) as [BenefitKey, typeof BENEFIT_DESCRIPTIONS[BenefitKey]][]).map(
    ([key, config]) => ({
      key,
      name: config.name,
      description: config.description,
      module: config.module,
      values: levels.reduce(
        (acc, level) => {
          const value = BENEFIT_MATRIX[key][level];
          acc[level] = {
            raw: value,
            display: formatBenefitValue(key, value),
          };
          return acc;
        },
        {} as Record<MembershipLevel, { raw: BenefitValue; display: string }>
      ),
    })
  );
};

// ==================== 折扣计算方法 ====================

/**
 * 获取独立服务折扣率
 */
export const getServiceDiscountRate = async (): Promise<number> => {
  const membership = await getMembership();
  return SERVICE_DISCOUNT_RATES[membership.level];
};

/**
 * 计算独立服务折后价格
 */
export const calculateDiscountedPrice = async (
  originalPrice: number
): Promise<{
  originalPrice: number;
  discountRate: number;
  discountAmount: number;
  finalPrice: number;
}> => {
  const discountRate = await getServiceDiscountRate();
  const discountAmount = Math.floor(originalPrice * discountRate);
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountRate,
    discountAmount,
    finalPrice,
  };
};

/**
 * 计算食材折扣价格
 */
export const calculateGroceryDiscount = async (
  originalPrice: number
): Promise<{
  originalPrice: number;
  discountRate: number;
  discountAmount: number;
  finalPrice: number;
}> => {
  const discountRate = (await getBenefitValue('grocery_discount_rate')) as number;
  const discountAmount = Math.floor(originalPrice * discountRate);
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountRate,
    discountAmount,
    finalPrice,
  };
};

/**
 * 计算养老服务折扣价格
 */
export const calculateElderlyServiceDiscount = async (
  originalPrice: number
): Promise<{
  originalPrice: number;
  discountRate: number;
  discountAmount: number;
  finalPrice: number;
}> => {
  const discountRate = (await getBenefitValue('elderly_service_discount')) as number;
  const discountAmount = Math.floor(originalPrice * discountRate);
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountRate,
    discountAmount,
    finalPrice,
  };
};

// ==================== 权益使用检查 ====================

/**
 * AI问答使用检查
 */
export const checkAIQuestionUsage = async (
  todayUsage: number
): Promise<{
  canUse: boolean;
  remaining: number;
  limit: number;
  message: string;
}> => {
  const result = await checkNumericLimit('ai_question_daily', todayUsage);

  if (result.limit === -1) {
    return {
      canUse: true,
      remaining: -1,
      limit: -1,
      message: '会员无限使用',
    };
  }

  if (result.allowed) {
    return {
      canUse: true,
      remaining: result.remaining,
      limit: result.limit,
      message: `今日剩余${result.remaining}次`,
    };
  }

  return {
    canUse: false,
    remaining: 0,
    limit: result.limit,
    message: '今日次数已用完，升级会员可无限使用',
  };
};

/**
 * 设备绑定检查
 */
export const checkDeviceBindingLimit = async (
  currentDeviceCount: number
): Promise<{
  canBind: boolean;
  remaining: number;
  limit: number;
  message: string;
}> => {
  const result = await checkNumericLimit('device_bindING_limit', currentDeviceCount);

  if (result.limit === -1) {
    return {
      canBind: true,
      remaining: -1,
      limit: -1,
      message: '会员无限绑定',
    };
  }

  if (result.allowed) {
    return {
      canBind: true,
      remaining: result.remaining,
      limit: result.limit,
      message: `还可绑定${result.remaining}个设备`,
    };
  }

  return {
    canBind: false,
    remaining: 0,
    limit: result.limit,
    message: '设备数量已达上限，升级会员可无限绑定',
  };
};

/**
 * 发布次数检查
 */
export const checkPublishLimit = async (
  monthlyPublishCount: number
): Promise<{
  canPublish: boolean;
  remaining: number;
  limit: number;
  message: string;
}> => {
  const result = await checkNumericLimit('publish_monthly_limit', monthlyPublishCount);

  if (result.limit === -1) {
    return {
      canPublish: true,
      remaining: -1,
      limit: -1,
      message: '会员无限发布',
    };
  }

  if (result.allowed) {
    return {
      canPublish: true,
      remaining: result.remaining,
      limit: result.limit,
      message: `本月剩余${result.remaining}次`,
    };
  }

  return {
    canPublish: false,
    remaining: 0,
    limit: result.limit,
    message: '本月发布次数已用完，升级会员可无限发布',
  };
};

/**
 * 律师AI使用检查
 */
export const checkLawyerAIUsage = async (
  monthlyUsage: number
): Promise<{
  canUse: boolean;
  remaining: number;
  limit: number;
  message: string;
}> => {
  const result = await checkNumericLimit('lawyer_ai_monthly', monthlyUsage);

  if (result.limit === -1) {
    return {
      canUse: true,
      remaining: -1,
      limit: -1,
      message: '会员无限使用',
    };
  }

  if (result.limit === 0) {
    return {
      canUse: false,
      remaining: 0,
      limit: 0,
      message: '此功能需要会员权限',
    };
  }

  if (result.allowed) {
    return {
      canUse: true,
      remaining: result.remaining,
      limit: result.limit,
      message: `本月剩余${result.remaining}次`,
    };
  }

  return {
    canUse: false,
    remaining: 0,
    limit: result.limit,
    message: '本月次数已用完，升级会员可无限使用',
  };
};

// ==================== 权益升级引导 ====================

/**
 * 获取升级引导信息
 */
export const getUpgradePrompt = async (
  blockedBenefit: BenefitKey
): Promise<{
  title: string;
  description: string;
  recommendedLevel: MembershipLevel;
  benefitAfterUpgrade: string;
}> => {
  const config = BENEFIT_DESCRIPTIONS[blockedBenefit];

  // 找到能解锁该权益的最低等级
  const levels = [MembershipLevel.GOLD, MembershipLevel.PLATINUM, MembershipLevel.DIAMOND];
  let recommendedLevel = MembershipLevel.GOLD;

  for (const level of levels) {
    const value = BENEFIT_MATRIX[blockedBenefit][level];
    if (
      (typeof value === 'boolean' && value) ||
      (typeof value === 'number' && (value === -1 || value > 0)) ||
      (typeof value === 'string' && value !== 'none')
    ) {
      recommendedLevel = level;
      break;
    }
  }

  const benefitAfterUpgrade = formatBenefitValue(
    blockedBenefit,
    BENEFIT_MATRIX[blockedBenefit][recommendedLevel]
  );

  return {
    title: `升级${MEMBERSHIP_LEVEL_LABELS[recommendedLevel]}解锁更多权益`,
    description: `升级后${config.name}将变为：${benefitAfterUpgrade}`,
    recommendedLevel,
    benefitAfterUpgrade,
  };
};
