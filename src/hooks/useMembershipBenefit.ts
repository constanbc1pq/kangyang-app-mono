/**
 * 会员权益检查 Hooks
 *
 * 提供 React Hooks 封装，用于检查和追踪会员权益使用情况
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BenefitKey,
  BenefitValue,
  MembershipLevel,
  BENEFIT_MATRIX,
} from '@/types/membership';
import {
  checkBenefit,
  getBenefitValue,
  checkAIQuestionUsage,
  checkDeviceBindingLimit,
  checkPublishLimit,
  checkLawyerAIUsage,
  getUpgradePrompt,
  formatBenefitValue,
} from '@/services/benefitService';
import { getMembership, getDevices } from '@/services/userDataService';

// ==================== 使用量存储 Key ====================

const USAGE_STORAGE_KEYS = {
  AI_QUESTION_DAILY: '@kangyang_ai_question_daily',
  PUBLISH_MONTHLY: '@kangyang_publish_monthly',
  LAWYER_AI_MONTHLY: '@kangyang_lawyer_ai_monthly',
};

// ==================== 工具函数 ====================

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * 获取当前月份字符串 (YYYY-MM)
 */
const getCurrentMonthString = (): string => {
  return new Date().toISOString().substring(0, 7);
};

/**
 * 获取每日使用量
 */
const getDailyUsage = async (key: string): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (!data) return 0;

    const parsed = JSON.parse(data);
    const today = getTodayDateString();

    // 如果是今天的数据，返回使用量；否则返回0
    if (parsed.date === today) {
      return parsed.count;
    }
    return 0;
  } catch {
    return 0;
  }
};

/**
 * 设置每日使用量
 */
const setDailyUsage = async (key: string, count: number): Promise<void> => {
  const today = getTodayDateString();
  await AsyncStorage.setItem(key, JSON.stringify({ date: today, count }));
};

/**
 * 获取每月使用量
 */
const getMonthlyUsage = async (key: string): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (!data) return 0;

    const parsed = JSON.parse(data);
    const currentMonth = getCurrentMonthString();

    // 如果是当月的数据，返回使用量；否则返回0
    if (parsed.month === currentMonth) {
      return parsed.count;
    }
    return 0;
  } catch {
    return 0;
  }
};

/**
 * 设置每月使用量
 */
const setMonthlyUsage = async (key: string, count: number): Promise<void> => {
  const currentMonth = getCurrentMonthString();
  await AsyncStorage.setItem(key, JSON.stringify({ month: currentMonth, count }));
};

// ==================== 通用权益 Hook ====================

interface BenefitState {
  isAvailable: boolean;
  value: BenefitValue;
  displayValue: string;
  isLoading: boolean;
  membershipLevel: MembershipLevel;
}

/**
 * 检查单项权益
 */
export const useBenefit = (benefitKey: BenefitKey): BenefitState => {
  const [state, setState] = useState<BenefitState>({
    isAvailable: false,
    value: null,
    displayValue: '加载中...',
    isLoading: true,
    membershipLevel: MembershipLevel.FREE,
  });

  useEffect(() => {
    let mounted = true;

    const loadBenefit = async () => {
      try {
        const [isAvailable, value, membership] = await Promise.all([
          checkBenefit(benefitKey),
          getBenefitValue(benefitKey),
          getMembership(),
        ]);

        if (mounted) {
          setState({
            isAvailable,
            value,
            displayValue: formatBenefitValue(benefitKey, value),
            isLoading: false,
            membershipLevel: membership.level,
          });
        }
      } catch (error) {
        console.error('加载权益失败:', error);
        if (mounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadBenefit();

    return () => {
      mounted = false;
    };
  }, [benefitKey]);

  return state;
};

// ==================== AI 问答限制 Hook ====================

interface AIQuestionLimitState {
  canUse: boolean;
  remaining: number;
  limit: number;
  message: string;
  isLoading: boolean;
  isUnlimited: boolean;
}

interface AIQuestionLimitActions {
  recordUsage: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * AI问答次数限制 Hook
 *
 * @example
 * const { canUse, remaining, message, recordUsage } = useAIQuestionLimit();
 *
 * if (!canUse) {
 *   showUpgradePrompt();
 *   return;
 * }
 *
 * await sendAIQuestion();
 * await recordUsage();
 */
export const useAIQuestionLimit = (): AIQuestionLimitState & AIQuestionLimitActions => {
  const [state, setState] = useState<AIQuestionLimitState>({
    canUse: false,
    remaining: 0,
    limit: 0,
    message: '加载中...',
    isLoading: true,
    isUnlimited: false,
  });

  const refresh = useCallback(async () => {
    try {
      const usage = await getDailyUsage(USAGE_STORAGE_KEYS.AI_QUESTION_DAILY);
      const result = await checkAIQuestionUsage(usage);

      setState({
        canUse: result.canUse,
        remaining: result.remaining,
        limit: result.limit,
        message: result.message,
        isLoading: false,
        isUnlimited: result.limit === -1,
      });
    } catch (error) {
      console.error('检查AI问答限制失败:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const recordUsage = useCallback(async (): Promise<boolean> => {
    try {
      // 会员无限使用时不记录
      if (state.isUnlimited) {
        return true;
      }

      const currentUsage = await getDailyUsage(USAGE_STORAGE_KEYS.AI_QUESTION_DAILY);
      await setDailyUsage(USAGE_STORAGE_KEYS.AI_QUESTION_DAILY, currentUsage + 1);

      // 刷新状态
      await refresh();
      return true;
    } catch (error) {
      console.error('记录AI问答使用失败:', error);
      return false;
    }
  }, [state.isUnlimited, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, recordUsage, refresh };
};

// ==================== 设备绑定限制 Hook ====================

interface DeviceLimitState {
  canBind: boolean;
  remaining: number;
  limit: number;
  currentCount: number;
  message: string;
  isLoading: boolean;
  isUnlimited: boolean;
}

interface DeviceLimitActions {
  refresh: () => Promise<void>;
}

/**
 * 设备绑定数量限制 Hook
 *
 * @example
 * const { canBind, remaining, message } = useDeviceLimit();
 *
 * if (!canBind) {
 *   showUpgradePrompt();
 *   return;
 * }
 *
 * await bindNewDevice();
 */
export const useDeviceLimit = (): DeviceLimitState & DeviceLimitActions => {
  const [state, setState] = useState<DeviceLimitState>({
    canBind: false,
    remaining: 0,
    limit: 0,
    currentCount: 0,
    message: '加载中...',
    isLoading: true,
    isUnlimited: false,
  });

  const refresh = useCallback(async () => {
    try {
      const devices = await getDevices();
      const currentCount = devices.length;
      const result = await checkDeviceBindingLimit(currentCount);

      setState({
        canBind: result.canBind,
        remaining: result.remaining,
        limit: result.limit,
        currentCount,
        message: result.message,
        isLoading: false,
        isUnlimited: result.limit === -1,
      });
    } catch (error) {
      console.error('检查设备绑定限制失败:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
};

// ==================== 发布次数限制 Hook ====================

interface PublishLimitState {
  canPublish: boolean;
  remaining: number;
  limit: number;
  message: string;
  isLoading: boolean;
  isUnlimited: boolean;
}

interface PublishLimitActions {
  recordUsage: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * 发布次数限制 Hook
 *
 * @example
 * const { canPublish, remaining, message, recordUsage } = usePublishLimit();
 *
 * if (!canPublish) {
 *   showUpgradePrompt();
 *   return;
 * }
 *
 * await publishPost();
 * await recordUsage();
 */
export const usePublishLimit = (): PublishLimitState & PublishLimitActions => {
  const [state, setState] = useState<PublishLimitState>({
    canPublish: false,
    remaining: 0,
    limit: 0,
    message: '加载中...',
    isLoading: true,
    isUnlimited: false,
  });

  const refresh = useCallback(async () => {
    try {
      const usage = await getMonthlyUsage(USAGE_STORAGE_KEYS.PUBLISH_MONTHLY);
      const result = await checkPublishLimit(usage);

      setState({
        canPublish: result.canPublish,
        remaining: result.remaining,
        limit: result.limit,
        message: result.message,
        isLoading: false,
        isUnlimited: result.limit === -1,
      });
    } catch (error) {
      console.error('检查发布限制失败:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const recordUsage = useCallback(async (): Promise<boolean> => {
    try {
      // 会员无限发布时不记录
      if (state.isUnlimited) {
        return true;
      }

      const currentUsage = await getMonthlyUsage(USAGE_STORAGE_KEYS.PUBLISH_MONTHLY);
      await setMonthlyUsage(USAGE_STORAGE_KEYS.PUBLISH_MONTHLY, currentUsage + 1);

      // 刷新状态
      await refresh();
      return true;
    } catch (error) {
      console.error('记录发布使用失败:', error);
      return false;
    }
  }, [state.isUnlimited, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, recordUsage, refresh };
};

// ==================== 律师AI限制 Hook ====================

interface LawyerAILimitState {
  canUse: boolean;
  remaining: number;
  limit: number;
  message: string;
  isLoading: boolean;
  isUnlimited: boolean;
}

interface LawyerAILimitActions {
  recordUsage: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * 律师AI助手使用限制 Hook
 */
export const useLawyerAILimit = (): LawyerAILimitState & LawyerAILimitActions => {
  const [state, setState] = useState<LawyerAILimitState>({
    canUse: false,
    remaining: 0,
    limit: 0,
    message: '加载中...',
    isLoading: true,
    isUnlimited: false,
  });

  const refresh = useCallback(async () => {
    try {
      const usage = await getMonthlyUsage(USAGE_STORAGE_KEYS.LAWYER_AI_MONTHLY);
      const result = await checkLawyerAIUsage(usage);

      setState({
        canUse: result.canUse,
        remaining: result.remaining,
        limit: result.limit,
        message: result.message,
        isLoading: false,
        isUnlimited: result.limit === -1,
      });
    } catch (error) {
      console.error('检查律师AI限制失败:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const recordUsage = useCallback(async (): Promise<boolean> => {
    try {
      // 会员无限使用时不记录
      if (state.isUnlimited) {
        return true;
      }

      const currentUsage = await getMonthlyUsage(USAGE_STORAGE_KEYS.LAWYER_AI_MONTHLY);
      await setMonthlyUsage(USAGE_STORAGE_KEYS.LAWYER_AI_MONTHLY, currentUsage + 1);

      // 刷新状态
      await refresh();
      return true;
    } catch (error) {
      console.error('记录律师AI使用失败:', error);
      return false;
    }
  }, [state.isUnlimited, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, recordUsage, refresh };
};

// ==================== 广告控制 Hook ====================

interface AdFreeState {
  showAds: boolean;
  isLoading: boolean;
}

/**
 * 广告显示控制 Hook
 *
 * @example
 * const { showAds } = useAdFree();
 *
 * return (
 *   <View>
 *     {showAds && <AdBanner />}
 *     <Content />
 *   </View>
 * );
 */
export const useAdFree = (): AdFreeState => {
  const [state, setState] = useState<AdFreeState>({
    showAds: true,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const checkAdFree = async () => {
      try {
        const isAdFree = await checkBenefit('ad_free');

        if (mounted) {
          setState({
            showAds: !isAdFree,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('检查广告权益失败:', error);
        if (mounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    checkAdFree();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
};

// ==================== 升级引导 Hook ====================

interface UpgradePromptState {
  title: string;
  description: string;
  recommendedLevel: MembershipLevel;
  benefitAfterUpgrade: string;
  isLoading: boolean;
}

/**
 * 升级引导信息 Hook
 *
 * @example
 * const { title, description, recommendedLevel } = useUpgradePrompt('ai_question_daily');
 */
export const useUpgradePrompt = (blockedBenefit: BenefitKey): UpgradePromptState => {
  const [state, setState] = useState<UpgradePromptState>({
    title: '',
    description: '',
    recommendedLevel: MembershipLevel.GOLD,
    benefitAfterUpgrade: '',
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const loadPrompt = async () => {
      try {
        const result = await getUpgradePrompt(blockedBenefit);

        if (mounted) {
          setState({
            ...result,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('获取升级引导失败:', error);
        if (mounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadPrompt();

    return () => {
      mounted = false;
    };
  }, [blockedBenefit]);

  return state;
};

// ==================== 权益对比 Hook ====================

interface BenefitComparisonItem {
  key: BenefitKey;
  currentValue: BenefitValue;
  currentDisplay: string;
  targetValue: BenefitValue;
  targetDisplay: string;
  isUpgrade: boolean;
}

/**
 * 获取当前等级与目标等级的权益对比
 */
export const useBenefitComparison = (
  targetLevel: MembershipLevel
): { comparisons: BenefitComparisonItem[]; isLoading: boolean } => {
  const [state, setState] = useState<{
    comparisons: BenefitComparisonItem[];
    isLoading: boolean;
  }>({
    comparisons: [],
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const loadComparison = async () => {
      try {
        const membership = await getMembership();
        const currentLevel = membership.level;

        const benefitKeys = Object.keys(BENEFIT_MATRIX) as BenefitKey[];
        const comparisons: BenefitComparisonItem[] = benefitKeys.map((key) => {
          const currentValue = BENEFIT_MATRIX[key][currentLevel];
          const targetValue = BENEFIT_MATRIX[key][targetLevel];

          // 判断是否为升级
          let isUpgrade = false;
          if (typeof currentValue === 'number' && typeof targetValue === 'number') {
            isUpgrade = targetValue > currentValue || (targetValue === -1 && currentValue !== -1);
          } else if (typeof currentValue === 'boolean' && typeof targetValue === 'boolean') {
            isUpgrade = !currentValue && targetValue;
          } else if (typeof currentValue === 'string' && typeof targetValue === 'string') {
            isUpgrade = currentValue === 'none' && targetValue !== 'none';
          }

          return {
            key,
            currentValue,
            currentDisplay: formatBenefitValue(key, currentValue),
            targetValue,
            targetDisplay: formatBenefitValue(key, targetValue),
            isUpgrade,
          };
        });

        if (mounted) {
          setState({
            comparisons,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('获取权益对比失败:', error);
        if (mounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadComparison();

    return () => {
      mounted = false;
    };
  }, [targetLevel]);

  return state;
};

// ==================== 数据存储期限 Hook ====================

interface DataStorageState {
  storageDays: number;
  displayValue: string;
  isUnlimited: boolean;
  isLoading: boolean;
}

/**
 * 健康数据存储期限 Hook
 */
export const useDataStorageLimit = (): DataStorageState => {
  const benefit = useBenefit('health_data_storage_days');

  return useMemo(() => {
    const storageDays = typeof benefit.value === 'number' ? benefit.value : 30;
    return {
      storageDays,
      displayValue: benefit.displayValue,
      isUnlimited: storageDays === -1,
      isLoading: benefit.isLoading,
    };
  }, [benefit]);
};
