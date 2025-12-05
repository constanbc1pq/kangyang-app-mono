/**
 * 社区聊天页面 - ChatScreen
 * 使用通用 ChatPage 组件实现
 * 支持服务需求对话和报价功能
 */
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, useTheme } from 'tamagui';
import { Image as ImageIcon, DollarSign } from 'lucide-react-native';
import {
  ChatPage,
  ChatPageConfig,
  ChatType,
  MessageType,
  ChatMessage,
  AttachmentItem,
} from '@/components/chat';
import { ChatConversation, ConversationRelatedType } from '@/types/community';
import {
  getConversationById,
  getMessages,
  sendMessage as sendMessageService,
  sendQuote as sendQuoteService,
  markAsRead,
  createOrder,
} from '@/services/communityDataService';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { QuoteStatus } from '@/types/chat';

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      conversationId: string;
      expertName?: string;
      expertAvatar?: string;
      expertId?: string;
    };
  };
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  navigation,
  route,
}) => {
  const { conversationId, expertName, expertAvatar, expertId } = route.params;
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [config, setConfig] = useState<ChatPageConfig | null>(null);

  const currentUserId = 'current-user-id';

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const conversationData = await getConversationById(conversationId);
      if (conversationData) {
        setConversation(conversationData);

        // 加载聊天记录
        const chatMessages = await getMessages(conversationId);

        // 转换为 ChatMessage 格式
        const formattedMessages: ChatMessage[] = chatMessages.map(msg => ({
          id: msg.id,
          type: msg.type === 'QUOTE' ? MessageType.QUOTE : MessageType.TEXT,
          sender: msg.senderId === currentUserId ? 'user' : 'recipient',
          senderId: msg.senderId,
          senderName: msg.senderName,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isRead: msg.isRead,
          quoteData: msg.quoteData ? {
            id: msg.id,
            jobId: msg.quoteData.jobId,
            jobTitle: msg.quoteData.jobTitle,
            quotedPrice: msg.quoteData.price,
            duration: msg.quoteData.estimatedDuration,
            message: msg.quoteData.message,
            status: msg.quoteData.status as QuoteStatus,
          } : undefined,
        }));

        setInitialMessages(formattedMessages);
        setConfig(buildConfig(conversationData));

        // 标记消息为已读
        await markAsRead(conversationId, currentUserId);
      }
    } catch (error) {
      console.error('加载对话失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEmployer = conversation?.relatedType === ConversationRelatedType.JOB &&
                     conversation.participant1Id === currentUserId;

  const handleImageUpload = () => {
    Alert.alert('上传图片', '选择图片', [
      { text: '拍照', onPress: () => console.log('拍照') },
      { text: '从相册选择', onPress: () => console.log('选择相册') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleShowQuoteModal = () => {
    if (isEmployer) {
      Alert.alert('提示', '只有达人可以发送报价');
      return;
    }
    if (conversation?.relatedType !== ConversationRelatedType.JOB) {
      Alert.alert('提示', '只能在服务需求对话中发送报价');
      return;
    }
    setShowQuoteModal(true);
  };

  const buildConfig = (conv: ChatConversation): ChatPageConfig => {
    const recipientName = conv.participant1Id === currentUserId
      ? conv.participant2Name
      : conv.participant1Name;
    const recipientAvatar = conv.participant1Id === currentUserId
      ? conv.participant2Avatar
      : conv.participant1Avatar;

    type IconType = React.ComponentType<{ size: number; color: string }>;
    const attachmentItems: AttachmentItem[] = [
      {
        id: 'image',
        icon: ImageIcon as IconType,
        label: '图片',
        color: primaryColor || '#6366F1',
        onPress: handleImageUpload,
      },
    ];

    // 达人可以发送报价
    if (!isEmployer && conv.relatedType === ConversationRelatedType.JOB) {
      attachmentItems.push({
        id: 'quote',
        icon: DollarSign as IconType,
        label: '发送报价',
        color: successColor || '#10B981',
        onPress: handleShowQuoteModal,
      });
    }

    return {
      basic: {
        chatType: ChatType.COMMUNITY,
        recipientId: conv.participant1Id === currentUserId ? conv.participant2Id : conv.participant1Id,
        conversationId: conv.id,
      },
      titleBar: {
        title: expertName || recipientName || '聊天',
        subtitle: conv.relatedTitle,
        showBack: true,
        onBack: () => navigation.goBack(),
      },
      recipient: {
        show: true,
        name: expertName || recipientName || '用户',
        avatar: expertAvatar || recipientAvatar,
        title: isEmployer ? '达人' : '雇主',
      },
      message: {
        supportedTypes: [
          MessageType.TEXT,
          MessageType.IMAGE,
          MessageType.QUOTE,
        ],
      },
      attachment: {
        items: attachmentItems,
      },
      call: {
        enableVoiceCall: false,
        enableVideoCall: false,
      },
      workflow: {
        showAIAssistant: false,
        showRating: false,
      },
    };
  };

  const handleSendMessage = async (content: string, type: MessageType): Promise<ChatMessage | null> => {
    if (!conversation) return null;

    try {
      const sentMessage = await sendMessageService(conversationId, {
        senderId: currentUserId,
        senderName: '当前用户',
        type: 'TEXT',
        content,
      });

      if (sentMessage) {
        return {
          id: sentMessage.id,
          type: MessageType.TEXT,
          sender: 'user',
          senderId: sentMessage.senderId,
          content: sentMessage.content,
          timestamp: new Date(sentMessage.timestamp),
          isRead: sentMessage.isRead,
        };
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      Alert.alert('发送失败', '消息发送失败，请稍后重试');
    }
    return null;
  };

  const handleSendQuote = async (quoteData: {
    jobId: string;
    quotedPrice: number;
    serviceTime: string;
    duration: string;
    message: string;
  }) => {
    if (!conversation) return;

    setShowQuoteModal(false);

    try {
      await sendQuoteService(
        conversationId,
        currentUserId,
        '当前用户',
        {
          jobId: quoteData.jobId,
          jobTitle: conversation.relatedTitle || '服务需求',
          quotedPrice: quoteData.quotedPrice,
          serviceTime: quoteData.serviceTime,
          duration: quoteData.duration,
          message: quoteData.message,
          expertId: currentUserId,
          expertName: '当前用户',
        }
      );
      // 重新加载对话以获取新消息
      loadConversation();
    } catch (error) {
      console.error('发送报价失败:', error);
      Alert.alert('发送失败', '报价发送失败，请稍后重试');
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    if (!conversation) return;

    try {
      await createOrder({
        conversationId,
        quoteId,
        employerId: currentUserId,
        expertId: conversation.participant1Id === currentUserId
          ? conversation.participant2Id
          : conversation.participant1Id,
      });
      Alert.alert('成功', '已接受报价，订单已创建');
      loadConversation();
    } catch (error) {
      console.error('接受报价失败:', error);
      Alert.alert('失败', '操作失败，请稍后重试');
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    Alert.alert('提示', '已拒绝该报价');
    loadConversation();
  };

  if (loading || !config) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text fontSize="$4" color="$color10">
          加载中...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ChatPage
        config={config}
        initialMessages={initialMessages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onAcceptQuote={handleAcceptQuote}
        onRejectQuote={handleRejectQuote}
        isEmployer={isEmployer}
      />
      {conversation && (
        <QuoteFormModal
          visible={showQuoteModal}
          jobId={conversation.relatedId || ''}
          jobTitle={conversation.relatedTitle || '服务需求'}
          onClose={() => setShowQuoteModal(false)}
          onSubmit={handleSendQuote}
        />
      )}
    </>
  );
};

export default ChatScreen;
