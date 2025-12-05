/**
 * MembershipCard - 会员卡片组件
 *
 * 用于"我的"页面显示用户会员信息
 * - 会员等级显示 (图标+名称)
 * - 到期时间显示
 * - 积分余额显示
 * - 不同等级样式 (FREE灰色/GOLD金色/PLATINUM银白/DIAMOND紫色)
 * - 免费用户升级引导文案
 * - 点击跳转会员中心
 */

import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
} from 'tamagui';
import { Crown, Star, Award, Gem, ChevronRight, Gift } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/app';
import {
  MembershipLevel,
  MEMBERSHIP_LEVEL_LABELS,
  MEMBERSHIP_LEVEL_COLORS,
  POINTS_MULTIPLIER,
} from '@/types/membership';
import { getMembershipDisplayInfo } from '@/services/membershipService';
import { getPoints } from '@/services/userDataService';

interface MembershipCardProps {
  onPress?: () => void;
}

/**
 * 获取会员等级图标
 */
const getMembershipIcon = (level: MembershipLevel) => {
  switch (level) {
    case MembershipLevel.FREE:
      return Star;
    case MembershipLevel.GOLD:
      return Award;
    case MembershipLevel.PLATINUM:
      return Crown;
    case MembershipLevel.DIAMOND:
      return Gem;
    default:
      return Star;
  }
};

/**
 * 格式化日期
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '永久有效';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

/**
 * 计算剩余天数
 */
const calculateDaysLeft = (endDate?: string): number | null => {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const MembershipCard: React.FC<MembershipCardProps> = ({ onPress }) => {
  const [membershipInfo, setMembershipInfo] = useState<{
    level: MembershipLevel;
    label: string;
    endDate?: string;
    isExpired: boolean;
  } | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const info = await getMembershipDisplayInfo();
      setMembershipInfo(info);

      const pointsInfo = await getPoints();
      setPoints(pointsInfo.balance);
    } catch (error) {
      console.error('Failed to load membership info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card
        padding="$4"
        borderRadius="$4"
        backgroundColor="$surface"
        height={120}
        justifyContent="center"
        alignItems="center"
      >
        <Text color="$textSecondary">加载中...</Text>
      </Card>
    );
  }

  if (!membershipInfo) {
    return null;
  }

  const colors = MEMBERSHIP_LEVEL_COLORS[membershipInfo.level];
  const IconComponent = getMembershipIcon(membershipInfo.level);
  const daysLeft = calculateDaysLeft(membershipInfo.endDate);
  const pointsMultiplier = POINTS_MULTIPLIER[membershipInfo.level];
  const isFree = membershipInfo.level === MembershipLevel.FREE;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 30;

  return (
    <Pressable onPress={onPress} style={{ width: '100%' }}>
      <Card
        borderRadius="$4"
        overflow="hidden"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        shadowRadius={12}
        elevation={6}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20 }}
        >
          {/* 顶部: 等级图标和名称 */}
          <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
            <XStack alignItems="center" space="$2">
              <View
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor="rgba(255,255,255,0.25)"
                justifyContent="center"
                alignItems="center"
              >
                <IconComponent size={24} color="white" />
              </View>
              <YStack>
                <Text fontSize="$5" fontWeight="bold" color="white">
                  {membershipInfo.label}
                </Text>
                {pointsMultiplier > 1 && (
                  <Text fontSize="$2" color="rgba(255,255,255,0.8)">
                    积分{pointsMultiplier}倍返
                  </Text>
                )}
              </YStack>
            </XStack>

            <View
              backgroundColor="rgba(255,255,255,0.2)"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <XStack alignItems="center" space="$1">
                <ChevronRight size={14} color="white" />
              </XStack>
            </View>
          </XStack>

          {/* 中部: 积分和有效期 */}
          <XStack justifyContent="space-between" alignItems="flex-end">
            {/* 积分信息 */}
            <YStack>
              <Text fontSize="$2" color="rgba(255,255,255,0.7)" marginBottom="$1">
                我的积分
              </Text>
              <XStack alignItems="baseline" space="$1">
                <Text fontSize="$7" fontWeight="bold" color="white">
                  {points.toLocaleString()}
                </Text>
                <Gift size={16} color="rgba(255,255,255,0.8)" />
              </XStack>
            </YStack>

            {/* 有效期 */}
            <YStack alignItems="flex-end">
              {isFree ? (
                <>
                  <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                    升级会员享更多权益
                  </Text>
                  <View
                    backgroundColor="white"
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$2"
                    marginTop="$1"
                  >
                    <Text fontSize="$3" fontWeight="600" color={colors.primary}>
                      立即开通
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                    {membershipInfo.isExpired ? '已过期' : '有效期至'}
                  </Text>
                  <Text
                    fontSize="$3"
                    fontWeight="500"
                    color={membershipInfo.isExpired || isExpiringSoon ? '#FBBF24' : 'white'}
                  >
                    {membershipInfo.isExpired
                      ? '请续费'
                      : formatDate(membershipInfo.endDate)}
                  </Text>
                  {isExpiringSoon && !membershipInfo.isExpired && (
                    <Text fontSize="$2" color="#FBBF24" marginTop="$1">
                      还剩{daysLeft}天
                    </Text>
                  )}
                </>
              )}
            </YStack>
          </XStack>
        </LinearGradient>

        {/* 底部: 权益入口 */}
        <XStack
          backgroundColor="white"
          paddingHorizontal="$4"
          paddingVertical="$3"
          justifyContent="space-around"
        >
          <YStack alignItems="center" flex={1}>
            <Text fontSize="$2" color={COLORS.textSecondary}>
              会员权益
            </Text>
          </YStack>
          <View width={1} height={24} backgroundColor={COLORS.border} />
          <YStack alignItems="center" flex={1}>
            <Text fontSize="$2" color={COLORS.textSecondary}>
              积分兑换
            </Text>
          </YStack>
          <View width={1} height={24} backgroundColor={COLORS.border} />
          <YStack alignItems="center" flex={1}>
            <Text fontSize="$2" color={COLORS.textSecondary}>
              {isFree ? '升级会员' : '续费会员'}
            </Text>
          </YStack>
        </XStack>
      </Card>
    </Pressable>
  );
};

export default MembershipCard;
