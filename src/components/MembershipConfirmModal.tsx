/**
 * MembershipConfirmModal - 会员购买/续费/升降级确认弹窗
 *
 * 场景：
 * 1. 续费同等级会员：显示当前到期时间和延期后的到期时间
 * 2. 升级高级会员：立即生效，高级会员到期后自动切换回当前会员
 * 3. 购买低级会员：等当前会员到期后生效
 */

import React from 'react';
import { Modal, Pressable } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import {
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Calendar,
  Crown,
  Check,
  X,
} from 'lucide-react-native';
import {
  MembershipLevel,
  MEMBERSHIP_LEVEL_LABELS,
  MEMBERSHIP_LEVEL_COLORS,
  MEMBERSHIP_PRICES,
  PaymentCycle,
} from '@/types/membership';

export type PurchaseType = 'new' | 'renew' | 'upgrade' | 'downgrade';

interface MembershipConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  purchaseType: PurchaseType;
  currentLevel: MembershipLevel;
  targetLevel: MembershipLevel;
  currentEndDate?: string;
  newEndDate: string;
  cycle: PaymentCycle;
  price: number;
}

// 计算周期对应的天数
const getCycleDays = (cycle: PaymentCycle): number => {
  switch (cycle) {
    case 'yearly':
      return 365;
    case 'quarterly':
      return 90;
    case 'monthly':
      return 30;
  }
};

// 计算周期中文名称
const getCycleLabel = (cycle: PaymentCycle): string => {
  switch (cycle) {
    case 'yearly':
      return '年';
    case 'quarterly':
      return '季度';
    case 'monthly':
      return '月';
  }
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export const MembershipConfirmModal: React.FC<MembershipConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  purchaseType,
  currentLevel,
  targetLevel,
  currentEndDate,
  newEndDate,
  cycle,
  price,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  const targetColors = MEMBERSHIP_LEVEL_COLORS[targetLevel];
  const currentColors = MEMBERSHIP_LEVEL_COLORS[currentLevel];

  // 获取标题和图标
  const getHeaderInfo = () => {
    switch (purchaseType) {
      case 'new':
        return {
          title: '开通会员',
          icon: Crown,
          color: targetColors.primary,
          description: `即将开通 ${MEMBERSHIP_LEVEL_LABELS[targetLevel]}`,
        };
      case 'renew':
        return {
          title: '续费会员',
          icon: RefreshCw,
          color: successColor,
          description: `续费 ${MEMBERSHIP_LEVEL_LABELS[targetLevel]}`,
        };
      case 'upgrade':
        return {
          title: '升级会员',
          icon: ArrowUp,
          color: primaryColor,
          description: `升级至 ${MEMBERSHIP_LEVEL_LABELS[targetLevel]}`,
        };
      case 'downgrade':
        return {
          title: '预约续费',
          icon: ArrowDown,
          color: warningColor,
          description: `预约续费 ${MEMBERSHIP_LEVEL_LABELS[targetLevel]}`,
        };
    }
  };

  const headerInfo = getHeaderInfo();
  const HeaderIcon = headerInfo.icon;

  // 渲染内容区域
  const renderContent = () => {
    switch (purchaseType) {
      case 'new':
        return (
          <YStack gap="$2">
            <View
              backgroundColor="$color4"
              padding="$2"
              borderRadius="$4"
            >
              <XStack gap="$2" alignItems="center">
                <Calendar size={18} color={primaryColor} />
                <YStack flex={1}>
                  <Text fontSize="$2" color="$color10">会员有效期</Text>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {formatDate(newEndDate)}
                  </Text>
                </YStack>
              </XStack>
            </View>
            <Text fontSize="$2" color="$color10" textAlign="center">
              支付成功后会员权益立即生效
            </Text>
          </YStack>
        );

      case 'renew':
        return (
          <YStack gap="$2">
            <View
              backgroundColor={`${successColor}10`}
              padding="$2"
              borderRadius="$4"
              borderWidth={1}
              borderColor={successColor}
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
                <AlertCircle size={16} color={successColor} />
                <Text fontSize="$3" fontWeight="600" color={successColor}>
                  当前会员状态
                </Text>
              </XStack>
              <YStack gap="$1">
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$color10">会员等级</Text>
                  <Text fontSize="$2" fontWeight="500" color="$color12">
                    {MEMBERSHIP_LEVEL_LABELS[currentLevel]}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$color10">当前到期时间</Text>
                  <Text fontSize="$2" fontWeight="500" color="$color12">
                    {currentEndDate ? formatDate(currentEndDate) : '-'}
                  </Text>
                </XStack>
              </YStack>
            </View>

            <View
              backgroundColor="$color4"
              padding="$2"
              borderRadius="$4"
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
                <Calendar size={16} color={primaryColor} />
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  续费后
                </Text>
              </XStack>
              <YStack gap="$1">
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$color10">延长时间</Text>
                  <Text fontSize="$2" fontWeight="500" color="$primary">
                    +1{getCycleLabel(cycle)}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$color10">新到期时间</Text>
                  <Text fontSize="$2" fontWeight="600" color="$primary">
                    {formatDate(newEndDate)}
                  </Text>
                </XStack>
              </YStack>
            </View>
          </YStack>
        );

      case 'upgrade':
        return (
          <YStack gap="$2">
            <View
              backgroundColor={`${primaryColor}10`}
              padding="$2"
              borderRadius="$4"
              borderWidth={1}
              borderColor={primaryColor}
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
                <ArrowUp size={16} color={primaryColor} />
                <Text fontSize="$3" fontWeight="600" color={primaryColor}>
                  升级说明
                </Text>
              </XStack>
              <Text fontSize="$2" color="$color12" lineHeight={18}>
                {MEMBERSHIP_LEVEL_LABELS[targetLevel]}将<Text fontWeight="600" color="$primary">立即生效</Text>，
                您可以马上享受更高等级的会员权益。
              </Text>
            </View>

            <View
              backgroundColor="$color4"
              padding="$2"
              borderRadius="$4"
            >
              <YStack gap="$1.5">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">当前会员</Text>
                  <View
                    backgroundColor={`${currentColors.primary}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text fontSize="$2" fontWeight="500" color={currentColors.primary}>
                      {MEMBERSHIP_LEVEL_LABELS[currentLevel]}
                    </Text>
                  </View>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">当前到期</Text>
                  <Text fontSize="$2" color="$color12">
                    {currentEndDate ? formatDate(currentEndDate) : '-'}
                  </Text>
                </XStack>
                <View height={1} backgroundColor="$color5" marginVertical="$1" />
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">升级后等级</Text>
                  <View
                    backgroundColor={`${targetColors.primary}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text fontSize="$2" fontWeight="600" color={targetColors.primary}>
                      {MEMBERSHIP_LEVEL_LABELS[targetLevel]}
                    </Text>
                  </View>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">新到期时间</Text>
                  <Text fontSize="$2" fontWeight="600" color="$primary">
                    {formatDate(newEndDate)}
                  </Text>
                </XStack>
              </YStack>
            </View>

            <View
              backgroundColor={`${warningColor}10`}
              padding="$2"
              borderRadius="$4"
            >
              <Text fontSize="$2" color={warningColor} lineHeight={18}>
                提示：{MEMBERSHIP_LEVEL_LABELS[targetLevel]}到期后，
                将自动切换回{MEMBERSHIP_LEVEL_LABELS[currentLevel]}（剩余 {currentEndDate ? Math.ceil((new Date(currentEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0} 天）
              </Text>
            </View>
          </YStack>
        );

      case 'downgrade':
        return (
          <YStack gap="$2">
            <View
              backgroundColor={`${warningColor}10`}
              padding="$2"
              borderRadius="$4"
              borderWidth={1}
              borderColor={warningColor}
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
                <AlertCircle size={16} color={warningColor} />
                <Text fontSize="$3" fontWeight="600" color={warningColor}>
                  预约续费说明
                </Text>
              </XStack>
              <Text fontSize="$2" color="$color12" lineHeight={18}>
                您当前是{MEMBERSHIP_LEVEL_LABELS[currentLevel]}，选择的{MEMBERSHIP_LEVEL_LABELS[targetLevel]}等级较低，
                将在当前会员到期后<Text fontWeight="600" color={warningColor}>自动生效</Text>。
              </Text>
            </View>

            <View
              backgroundColor="$color4"
              padding="$2"
              borderRadius="$4"
            >
              <YStack gap="$1.5">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">当前会员</Text>
                  <View
                    backgroundColor={`${currentColors.primary}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text fontSize="$2" fontWeight="500" color={currentColors.primary}>
                      {MEMBERSHIP_LEVEL_LABELS[currentLevel]}
                    </Text>
                  </View>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">当前到期时间</Text>
                  <Text fontSize="$2" color="$color12">
                    {currentEndDate ? formatDate(currentEndDate) : '-'}
                  </Text>
                </XStack>
                <View height={1} backgroundColor="$color5" marginVertical="$1" />
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">预约等级</Text>
                  <View
                    backgroundColor={`${targetColors.primary}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text fontSize="$2" fontWeight="500" color={targetColors.primary}>
                      {MEMBERSHIP_LEVEL_LABELS[targetLevel]}
                    </Text>
                  </View>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">生效时间</Text>
                  <Text fontSize="$2" fontWeight="500" color={warningColor}>
                    {currentEndDate ? formatDate(currentEndDate) : '-'} 之后
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$2" color="$color10">预约到期时间</Text>
                  <Text fontSize="$2" fontWeight="600" color="$primary">
                    {formatDate(newEndDate)}
                  </Text>
                </XStack>
              </YStack>
            </View>

            <Text fontSize="$2" color="$color10" textAlign="center">
              在此期间您可继续享受{MEMBERSHIP_LEVEL_LABELS[currentLevel]}权益
            </Text>
          </YStack>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        flex={1}
        backgroundColor="rgba(0,0,0,0.5)"
        justifyContent="center"
        alignItems="center"
        padding="$4"
      >
        <View
          backgroundColor="$background"
          borderRadius="$5"
          width="100%"
          maxWidth={360}
          overflow="hidden"
        >
          {/* 头部 */}
          <View
            backgroundColor={`${headerInfo.color}15`}
            padding="$3"
            alignItems="center"
          >
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={`${headerInfo.color}20`}
              justifyContent="center"
              alignItems="center"
              marginBottom="$2"
            >
              <HeaderIcon size={24} color={headerInfo.color} />
            </View>
            <Text fontSize="$5" fontWeight="700" color="$color12">
              {headerInfo.title}
            </Text>
            <Text fontSize="$3" color="$color10" marginTop="$0.5">
              {headerInfo.description}
            </Text>
          </View>

          {/* 内容区域 */}
          <View padding="$3">
            {renderContent()}
          </View>

          {/* 价格和按钮 */}
          <View
            padding="$3"
            borderTopWidth={1}
            borderTopColor="$color5"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Text fontSize="$3" color="$color10">支付金额</Text>
              <XStack alignItems="baseline">
                <Text fontSize="$3" color={targetColors.primary}>¥</Text>
                <Text fontSize="$6" fontWeight="700" color={targetColors.primary}>
                  {price}
                </Text>
                <Text fontSize="$2" color="$color10">/{getCycleLabel(cycle)}</Text>
              </XStack>
            </XStack>

            <XStack gap="$2">
              <Pressable style={{ flex: 1 }} onPress={onClose}>
                <View
                  backgroundColor="$color4"
                  paddingVertical="$2.5"
                  borderRadius="$10"
                  alignItems="center"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <Text fontSize="$3" fontWeight="500" color="$color12">
                    取消
                  </Text>
                </View>
              </Pressable>
              <Pressable style={{ flex: 1 }} onPress={onConfirm}>
                <View
                  backgroundColor={targetColors.primary}
                  paddingVertical="$2.5"
                  borderRadius="$10"
                  alignItems="center"
                >
                  <Text fontSize="$3" fontWeight="600" color="white">
                    确认{purchaseType === 'downgrade' ? '预约' : '支付'}
                  </Text>
                </View>
              </Pressable>
            </XStack>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MembershipConfirmModal;
