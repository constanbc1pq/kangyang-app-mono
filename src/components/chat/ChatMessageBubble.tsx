/**
 * ChatMessageBubble - 聊天消息气泡组件
 * 支持多种消息类型渲染
 */
import React from 'react';
import { Pressable, Image } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import {
  Mic,
  Download,
  ChevronRight,
  FileText,
  CheckCircle,
} from 'lucide-react-native';
import {
  ChatMessage,
  MessageType,
  QuoteStatus,
} from '@/types/chat';
import { getAvatarSource } from '@/constants/avatars';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isEmployer?: boolean;
  onAcceptQuote?: (quoteId: string) => void;
  onRejectQuote?: (quoteId: string) => void;
  onImagePress?: (imageUrl: string) => void;
  onVoicePress?: (message: ChatMessage) => void;
}

/**
 * 格式化时间
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isCurrentUser,
  isEmployer = false,
  onAcceptQuote,
  onRejectQuote,
  onImagePress,
  onVoicePress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color12 = theme.color12?.val;

  const isAI = message.sender === 'ai';

  // 系统消息（时间分隔符）
  if (message.type === MessageType.SYSTEM) {
    return (
      <View alignItems="center" marginVertical="$2">
        <View
          backgroundColor="$color4"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius="$2"
        >
          <Text fontSize="$2" color="$color10">
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  // 渲染头像
  const renderAvatar = () => {
    if (isCurrentUser) {
      return (
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$color4"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={16}>👤</Text>
        </View>
      );
    }

    if (isAI) {
      return (
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$warning"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="$2" color="white" fontWeight="600">
            AI
          </Text>
        </View>
      );
    }

    if (message.senderAvatar) {
      return (
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$color4"
          overflow="hidden"
        >
          <Image
            source={getAvatarSource(message.senderAvatar, message.senderName || '')}
            style={{ width: 36, height: 36 }}
            resizeMode="cover"
          />
        </View>
      );
    }

    return (
      <View
        width={36}
        height={36}
        borderRadius={18}
        backgroundColor="$color4"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="$2" color="$color10" fontWeight="600">
          {message.senderName?.[0] || '?'}
        </Text>
      </View>
    );
  };

  // 渲染文本消息
  const renderTextMessage = () => (
    <View
      padding="$2"
      borderRadius="$4"
      maxWidth="100%"
      backgroundColor={
        isAI ? '$color4' : isCurrentUser ? '$primary' : '$color4'
      }
      style={isAI ? { backgroundColor: `${warningColor}15` } : undefined}
    >
      <Text
        fontSize="$3"
        color={isCurrentUser && !isAI ? 'white' : '$color12'}
        lineHeight={20}
      >
        {message.content}
      </Text>
    </View>
  );

  // 渲染图片消息
  const renderImageMessage = () => (
    <Pressable onPress={() => message.imageUrl && onImagePress?.(message.imageUrl)}>
      <View borderRadius="$3" overflow="hidden">
        <Image
          source={{ uri: message.imageUrl }}
          style={{ width: 200, height: 200 }}
          resizeMode="cover"
        />
        {message.content && (
          <Text
            fontSize="$2"
            color="$color10"
            marginTop="$0.5"
            paddingHorizontal="$1"
          >
            {message.content}
          </Text>
        )}
      </View>
    </Pressable>
  );

  // 渲染语音消息
  const renderVoiceMessage = () => (
    <Pressable onPress={() => onVoicePress?.(message)}>
      <View
        padding="$2"
        borderRadius="$4"
        minWidth={150}
        backgroundColor={isCurrentUser ? '$primary' : '$color4'}
      >
        <XStack gap="$1.5" alignItems="center">
          <Mic size={18} color={isCurrentUser ? 'white' : color12} />
          <Text
            fontSize="$3"
            color={isCurrentUser ? 'white' : '$color12'}
            flex={1}
          >
            语音消息 {message.voiceDuration}"
          </Text>
        </XStack>
      </View>
    </Pressable>
  );

  // 渲染处方消息
  const renderPrescriptionMessage = () => {
    if (!message.prescriptionData) return null;

    return (
      <View
        padding="$2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$success"
        width="100%"
        style={{ backgroundColor: `${successColor}10` }}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$1.5"
        >
          <Text fontSize="$4" fontWeight="600" color="$success">
            电子处方
          </Text>
          <Pressable>
            <Download size={18} color={successColor} />
          </Pressable>
        </XStack>
        {message.prescriptionData.medications.map((med, idx) => (
          <YStack
            key={idx}
            padding="$1.5"
            backgroundColor="$color2"
            borderRadius="$2"
            marginBottom="$1"
          >
            <Text fontSize="$3" fontWeight="600" color="$color12">
              {med.name}
            </Text>
            <Text fontSize="$2" color="$color10">
              {med.dosage} · {med.frequency} · {med.duration}
            </Text>
          </YStack>
        ))}
        {message.prescriptionData.notes && (
          <Text fontSize="$2" color="$color10" marginTop="$1">
            医嘱：{message.prescriptionData.notes}
          </Text>
        )}
      </View>
    );
  };

  // 渲染检查建议消息
  const renderCheckupMessage = () => {
    if (!message.checkupData) return null;

    return (
      <Pressable>
        <View
          padding="$2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$primary"
          width="100%"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$1.5"
          >
            <Text fontSize="$4" fontWeight="600" color="$primary">
              检查建议
            </Text>
            <ChevronRight size={18} color={primaryColor} />
          </XStack>
          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$0.5">
            {message.checkupData.title}
          </Text>
          <Text fontSize="$2" color="$color10">
            {message.checkupData.description}
          </Text>
          {message.checkupData.appointmentLink && (
            <Text fontSize="$2" color="$primary" marginTop="$1">
              点击预约检查 →
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  // 渲染转诊推荐消息
  const renderReferralMessage = () => {
    if (!message.referralData) return null;

    return (
      <View
        padding="$2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$warning"
        width="100%"
        style={{ backgroundColor: `${warningColor}10` }}
      >
        <Text fontSize="$4" fontWeight="600" color="$warning" marginBottom="$1.5">
          转诊推荐
        </Text>
        <YStack gap="$0.5">
          <Text fontSize="$3" color="$color12">
            <Text fontWeight="600">科室：</Text>
            {message.referralData.department}
          </Text>
          <Text fontSize="$3" color="$color12">
            <Text fontWeight="600">专家：</Text>
            {message.referralData.specialist}
          </Text>
          <Text fontSize="$2" color="$color10" marginTop="$1">
            {message.referralData.reason}
          </Text>
        </YStack>
      </View>
    );
  };

  // 渲染报价消息
  const renderQuoteMessage = () => {
    if (!message.quoteData) return null;

    const quote = message.quoteData;
    const isPending = quote.status === QuoteStatus.PENDING;
    const isAccepted = quote.status === QuoteStatus.ACCEPTED;
    const isRejected = quote.status === QuoteStatus.REJECTED;

    return (
      <View
        padding="$2"
        borderRadius="$4"
        borderWidth={1}
        borderColor={isAccepted ? '$success' : isRejected ? '$error' : '$primary'}
        width="100%"
        backgroundColor="$color2"
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            服务报价
          </Text>
          {isAccepted && <CheckCircle size={18} color={successColor} />}
        </XStack>

        <Text fontSize="$3" color="$color10" marginBottom="$1">
          {quote.jobTitle}
        </Text>

        <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
          <Text fontSize="$5" fontWeight="700" color="$primary">
            ¥{quote.quotedPrice}
          </Text>
          <Text fontSize="$2" color="$color10">
            预计 {quote.duration}
          </Text>
        </XStack>

        {quote.message && (
          <Text fontSize="$2" color="$color10" marginBottom="$1.5">
            {quote.message}
          </Text>
        )}

        {/* 报价状态 */}
        {isAccepted && (
          <View
            backgroundColor="$success"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$10"
            alignSelf="flex-start"
          >
            <Text fontSize="$2" color="white" fontWeight="500">
              已接受
            </Text>
          </View>
        )}
        {isRejected && (
          <View
            backgroundColor="$error"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$10"
            alignSelf="flex-start"
          >
            <Text fontSize="$2" color="white" fontWeight="500">
              已拒绝
            </Text>
          </View>
        )}

        {/* 操作按钮 (仅雇主可见且状态为待处理) */}
        {isPending && isEmployer && !isCurrentUser && (
          <XStack gap="$2" marginTop="$2">
            <Pressable
              style={{ flex: 1 }}
              onPress={() => onRejectQuote?.(quote.id)}
            >
              <View
                backgroundColor="$color4"
                paddingVertical="$2"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  拒绝
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => onAcceptQuote?.(quote.id)}
            >
              <View
                backgroundColor="$primary"
                paddingVertical="$2"
                borderRadius="$10"
                alignItems="center"
              >
                <Text fontSize="$3" color="white" fontWeight="500">
                  接受
                </Text>
              </View>
            </Pressable>
          </XStack>
        )}
      </View>
    );
  };

  // 渲染合同消息
  const renderContractMessage = () => {
    if (!message.contractData) return null;

    return (
      <Pressable>
        <View
          padding="$2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$color5"
          backgroundColor="$color2"
        >
          <XStack gap="$2" alignItems="center">
            <View
              width={40}
              height={40}
              borderRadius="$2"
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <FileText size={20} color={primaryColor} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={1}>
                {message.contractData.fileName}
              </Text>
              <Text fontSize="$2" color="$color10">
                {message.contractData.fileSize}
              </Text>
            </YStack>
            <Download size={18} color={primaryColor} />
          </XStack>
        </View>
      </Pressable>
    );
  };

  // 渲染保险方案消息
  const renderPlanMessage = () => {
    if (!message.planData) return null;

    return (
      <Pressable>
        <View
          padding="$2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$primary"
          backgroundColor="$color2"
        >
          <Text fontSize="$4" fontWeight="600" color="$primary" marginBottom="$1">
            {message.planData.planName}
          </Text>
          <Text fontSize="$3" color="$color10" marginBottom="$1.5" numberOfLines={2}>
            {message.planData.coverageSummary}
          </Text>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              ¥{message.planData.premiumAmount}/{message.planData.premiumPeriod}
            </Text>
            <XStack gap="$0.5" alignItems="center">
              <Text fontSize="$3" color="$primary" fontWeight="500">
                查看详情
              </Text>
              <ChevronRight size={14} color={primaryColor} />
            </XStack>
          </XStack>
        </View>
      </Pressable>
    );
  };

  // 根据消息类型渲染内容
  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return renderTextMessage();
      case MessageType.IMAGE:
        return renderImageMessage();
      case MessageType.VOICE:
        return renderVoiceMessage();
      case MessageType.PRESCRIPTION:
        return renderPrescriptionMessage();
      case MessageType.CHECKUP:
        return renderCheckupMessage();
      case MessageType.REFERRAL:
        return renderReferralMessage();
      case MessageType.QUOTE:
        return renderQuoteMessage();
      case MessageType.CONTRACT:
        return renderContractMessage();
      case MessageType.PLAN:
        return renderPlanMessage();
      default:
        return renderTextMessage();
    }
  };

  return (
    <View
      paddingHorizontal="$2.5"
      paddingVertical="$1.5"
      alignItems={isCurrentUser ? 'flex-end' : 'flex-start'}
    >
      <XStack
        gap="$2"
        maxWidth="80%"
        flexDirection={isCurrentUser ? 'row-reverse' : 'row'}
      >
        {/* 头像 */}
        {!isCurrentUser && renderAvatar()}

        {/* 消息内容 */}
        <YStack
          flex={1}
          gap="$0.5"
          alignItems={isCurrentUser ? 'flex-end' : 'flex-start'}
        >
          {renderMessageContent()}

          {/* 时间戳 */}
          <Text fontSize={10} color="$color10" paddingHorizontal="$1">
            {formatTime(message.timestamp)}
          </Text>
        </YStack>
      </XStack>
    </View>
  );
};

export default ChatMessageBubble;
