import React from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Card,
} from 'tamagui';
import {
  TouchableOpacity,
} from 'react-native';
import {
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export enum QuoteStatus {
  PENDING = 'pending',     // 待回复
  ACCEPTED = 'accepted',   // 已接受
  REJECTED = 'rejected',   // 已拒绝
  EXPIRED = 'expired',     // 已过期
}

export interface QuoteData {
  id: string;
  jobId: string;
  jobTitle: string;
  quotedPrice: number;
  serviceTime: string;
  duration: string;
  message: string;
  status: QuoteStatus;
  expertId: string;
  expertName: string;
  createdAt: Date;
}

interface QuoteCardProps {
  quote: QuoteData;
  isEmployer: boolean; // 是否是雇主视角
  onAccept?: (quoteId: string) => void;
  onReject?: (quoteId: string) => void;
}

/**
 * 报价卡片组件
 * 在聊天中显示达人的报价信息
 */
export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isEmployer,
  onAccept,
  onReject,
}) => {
  const getStatusColor = (status: QuoteStatus): string => {
    switch (status) {
      case QuoteStatus.ACCEPTED:
        return COLORS.success;
      case QuoteStatus.REJECTED:
        return COLORS.error;
      case QuoteStatus.EXPIRED:
        return COLORS.textSecondary;
      case QuoteStatus.PENDING:
      default:
        return COLORS.warning;
    }
  };

  const getStatusText = (status: QuoteStatus): string => {
    switch (status) {
      case QuoteStatus.ACCEPTED:
        return '已接受';
      case QuoteStatus.REJECTED:
        return '已拒绝';
      case QuoteStatus.EXPIRED:
        return '已过期';
      case QuoteStatus.PENDING:
      default:
        return '待回复';
    }
  };

  const getStatusIcon = (status: QuoteStatus) => {
    const color = getStatusColor(status);
    switch (status) {
      case QuoteStatus.ACCEPTED:
        return <CheckCircle size={16} color={color} />;
      case QuoteStatus.REJECTED:
      case QuoteStatus.EXPIRED:
        return <XCircle size={16} color={color} />;
      case QuoteStatus.PENDING:
      default:
        return <Clock size={16} color={color} />;
    }
  };

  return (
    <Card
      padding="$3"
      borderRadius="$4"
      backgroundColor="$surface"
      borderWidth={1}
      borderColor={quote.status === QuoteStatus.PENDING ? COLORS.warning : '$borderColor'}
      maxWidth={280}
    >
      <YStack space="$3">
        {/* 标题和状态 */}
        <XStack justifyContent="space-between" alignItems="center">
          <View
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
            backgroundColor={`${COLORS.primary}20`}
          >
            <Text fontSize="$2" color={COLORS.primary} fontWeight="600">
              💼 服务报价
            </Text>
          </View>
          <XStack space="$1" alignItems="center">
            {getStatusIcon(quote.status)}
            <Text fontSize="$2" color={getStatusColor(quote.status)} fontWeight="600">
              {getStatusText(quote.status)}
            </Text>
          </XStack>
        </XStack>

        {/* 需求标题 */}
        <YStack>
          <Text fontSize="$2" color="$textSecondary">
            服务需求
          </Text>
          <Text fontSize="$3" color="$text" fontWeight="600" marginTop="$1">
            {quote.jobTitle}
          </Text>
        </YStack>

        {/* 报价金额 */}
        <View
          backgroundColor={`${COLORS.primary}10`}
          padding="$3"
          borderRadius="$3"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$3" color="$textSecondary">
              服务费用
            </Text>
            <XStack space="$1" alignItems="center">
              <DollarSign size={20} color={COLORS.primary} />
              <Text fontSize="$7" fontWeight="bold" color={COLORS.primary}>
                ¥{quote.quotedPrice}
              </Text>
            </XStack>
          </XStack>
        </View>

        {/* 服务时间和时长 */}
        <YStack space="$2">
          <XStack space="$2" alignItems="center">
            <Clock size={14} color={COLORS.textSecondary} />
            <Text fontSize="$2" color="$textSecondary">
              服务时间：
            </Text>
            <Text fontSize="$2" color="$text">
              {quote.serviceTime}
            </Text>
          </XStack>
          <XStack space="$2" alignItems="center">
            <FileText size={14} color={COLORS.textSecondary} />
            <Text fontSize="$2" color="$textSecondary">
              预计时长：
            </Text>
            <Text fontSize="$2" color="$text">
              {quote.duration}
            </Text>
          </XStack>
        </YStack>

        {/* 留言说明 */}
        {quote.message && (
          <View
            padding="$2"
            backgroundColor="$background"
            borderRadius="$2"
          >
            <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
              留言：
            </Text>
            <Text fontSize="$3" color="$text">
              {quote.message}
            </Text>
          </View>
        )}

        {/* 操作按钮 - 仅雇主且状态为待回复时显示 */}
        {isEmployer && quote.status === QuoteStatus.PENDING && (
          <XStack space="$2" marginTop="$2">
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onReject?.(quote.id)}
            >
              <View
                backgroundColor="white"
                borderWidth={1}
                borderColor={COLORS.error}
                borderRadius="$3"
                paddingVertical="$2"
                alignItems="center"
              >
                <Text fontSize="$3" color={COLORS.error} fontWeight="600">
                  拒绝
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onAccept?.(quote.id)}
            >
              <View
                backgroundColor={COLORS.success}
                borderRadius="$3"
                paddingVertical="$2"
                alignItems="center"
              >
                <Text fontSize="$3" color="white" fontWeight="600">
                  接受报价
                </Text>
              </View>
            </TouchableOpacity>
          </XStack>
        )}

        {/* 达人视角提示 */}
        {!isEmployer && quote.status === QuoteStatus.PENDING && (
          <View
            padding="$2"
            backgroundColor={`${COLORS.warning}10`}
            borderRadius="$2"
          >
            <Text fontSize="$2" color={COLORS.warning} textAlign="center">
              等待雇主回复...
            </Text>
          </View>
        )}

        {/* 已接受提示 */}
        {quote.status === QuoteStatus.ACCEPTED && (
          <View
            padding="$2"
            backgroundColor={`${COLORS.success}10`}
            borderRadius="$2"
          >
            <Text fontSize="$2" color={COLORS.success} textAlign="center">
              ✓ 报价已接受，订单已生成
            </Text>
          </View>
        )}

        {/* 已拒绝提示 */}
        {quote.status === QuoteStatus.REJECTED && (
          <View
            padding="$2"
            backgroundColor={`${COLORS.error}10`}
            borderRadius="$2"
          >
            <Text fontSize="$2" color={COLORS.error} textAlign="center">
              报价已被拒绝
            </Text>
          </View>
        )}
      </YStack>
    </Card>
  );
};
