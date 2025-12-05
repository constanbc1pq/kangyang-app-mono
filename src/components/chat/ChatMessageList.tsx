/**
 * ChatMessageList - 聊天消息列表组件
 * 支持消息渲染、时间分隔符、滚动到底部
 */
import React, { useRef, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { View, Text } from 'tamagui';
import { ChatMessage, MessageType } from '@/types/chat';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatMessageListProps {
  /** 消息列表 */
  messages: ChatMessage[];
  /** 当前用户ID */
  currentUserId: string;
  /** 下拉刷新回调 */
  onRefresh?: () => void;
  /** 是否正在刷新 */
  refreshing?: boolean;
  /** 报价接受回调 */
  onAcceptQuote?: (quoteId: string) => void;
  /** 报价拒绝回调 */
  onRejectQuote?: (quoteId: string) => void;
  /** 当前用户是否是雇主 (社区场景) */
  isEmployer?: boolean;
  /** 空状态提示文字 */
  emptyText?: string;
}

/**
 * 格式化时间分隔符文字
 */
const formatTimeSeparator = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor(
    (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

/**
 * 在消息列表中插入时间分隔符
 */
export const insertTimeSeparators = (messages: ChatMessage[]): ChatMessage[] => {
  const result: ChatMessage[] = [];
  let lastDate: Date | null = null;

  messages.forEach((message, index) => {
    const messageDate = message.timestamp;

    // 如果是第一条消息或与上一条消息时间差超过1小时，添加时间分隔符
    if (!lastDate || messageDate.getTime() - lastDate.getTime() > 3600000) {
      result.push({
        id: `separator-${index}`,
        type: MessageType.SYSTEM,
        sender: 'system',
        senderId: 'system',
        content: formatTimeSeparator(messageDate),
        timestamp: messageDate,
        isRead: true,
      });
    }

    result.push(message);
    lastDate = messageDate;
  });

  return result;
};

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  onRefresh,
  refreshing = false,
  onAcceptQuote,
  onRejectQuote,
  isEmployer,
  emptyText = '暂无消息',
}) => {
  const flatListRef = useRef<FlatList>(null);

  // 消息更新时滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.senderId === currentUserId;

    return (
      <ChatMessageBubble
        message={item}
        isCurrentUser={isCurrentUser}
        isEmployer={isEmployer}
        onAcceptQuote={onAcceptQuote}
        onRejectQuote={onRejectQuote}
      />
    );
  };

  const renderEmpty = () => (
    <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
      <Text fontSize="$3" color="$color10">
        {emptyText}
      </Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      ListEmptyComponent={renderEmpty}
    />
  );
};

export default ChatMessageList;
