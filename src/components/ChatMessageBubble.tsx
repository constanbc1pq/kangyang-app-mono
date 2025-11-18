import React from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
} from 'tamagui';
import { COLORS } from '@/constants/app';
import { QuoteCard, QuoteData } from './QuoteCard';

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'system' | 'quote';
  quoteData?: QuoteData; // 报价数据（当type为quote时）
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isEmployer?: boolean; // 是否是雇主视角（用于报价卡片）
  onAcceptQuote?: (quoteId: string) => void;
  onRejectQuote?: (quoteId: string) => void;
}

/**
 * 聊天消息气泡组件
 * 支持左右布局（当前用户和对方）
 */
// 格式化时间
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
}) => {
  // 系统消息（如时间分隔符）
  if (message.type === 'system') {
    return (
      <View alignItems="center" marginVertical="$2">
        <View
          backgroundColor="rgba(0,0,0,0.05)"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius="$2"
        >
          <Text fontSize="$2" color="$textSecondary">
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  // 报价卡片消息
  if (message.type === 'quote' && message.quoteData) {
    return (
      <XStack
        space="$2"
        marginVertical="$2"
        paddingHorizontal="$4"
        justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
      >
        {/* 对方的头像（左侧） */}
        {!isCurrentUser && (
          <View
            width={36}
            height={36}
            borderRadius={18}
            backgroundColor="$background"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize={18}>👤</Text>
          </View>
        )}

        {/* 报价卡片 */}
        <YStack alignItems={isCurrentUser ? 'flex-end' : 'flex-start'} space="$1">
          <QuoteCard
            quote={message.quoteData}
            isEmployer={isEmployer}
            onAccept={onAcceptQuote}
            onReject={onRejectQuote}
          />
          {/* 时间戳 */}
          <Text fontSize="$2" color="$textSecondary">
            {formatTime(message.timestamp)}
          </Text>
        </YStack>

        {/* 当前用户的头像（右侧） */}
        {isCurrentUser && (
          <View
            width={36}
            height={36}
            borderRadius={18}
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize={18}>😊</Text>
          </View>
        )}
      </XStack>
    );
  }

  return (
    <XStack
      space="$2"
      marginVertical="$2"
      paddingHorizontal="$4"
      justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
    >
      {/* 对方的头像（左侧） */}
      {!isCurrentUser && (
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$background"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={18}>👤</Text>
        </View>
      )}

      {/* 消息内容 */}
      <YStack
        maxWidth="70%"
        alignItems={isCurrentUser ? 'flex-end' : 'flex-start'}
        space="$1"
      >
        {/* 消息气泡 */}
        <View
          backgroundColor={isCurrentUser ? COLORS.primary : 'white'}
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$3"
          borderWidth={isCurrentUser ? 0 : 1}
          borderColor={isCurrentUser ? 'transparent' : '$borderColor'}
          shadowColor={isCurrentUser ? 'transparent' : '$shadow'}
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={isCurrentUser ? 0 : 0.1}
          shadowRadius={2}
          elevation={isCurrentUser ? 0 : 2}
        >
          <Text
            fontSize="$4"
            color={isCurrentUser ? 'white' : '$text'}
            lineHeight="$1"
          >
            {message.content}
          </Text>
        </View>

        {/* 时间戳 */}
        <Text fontSize="$2" color="$textSecondary">
          {formatTime(message.timestamp)}
          {isCurrentUser && !message.isRead && ' 未读'}
        </Text>
      </YStack>

      {/* 当前用户的头像（右侧） */}
      {isCurrentUser && (
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$background"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={18}>👤</Text>
        </View>
      )}
    </XStack>
  );
};
