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
import { getUserData } from '@/services/userDataService';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { QuoteStatus } from '@/types/chat';

interface PendingQuote {
  jobId: string;
  quotedPrice: number;
  serviceTime: string;
  duration: string;
  message: string;
}

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      conversationId: string;
      expertName?: string;
      expertAvatar?: string;
      expertId?: string;
      pendingQuote?: PendingQuote;
    };
  };
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  navigation,
  route,
}) => {
  const { conversationId, expertName, expertAvatar, expertId, pendingQuote } = route.params;
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [config, setConfig] = useState<ChatPageConfig | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('我');
  // 使用 useRef 来跟踪是否已处理 pendingQuote，避免在依赖变化时重复触发
  const pendingQuoteProcessedRef = React.useRef(false);

  const currentUserId = 'current-user-id';

  // 加载当前用户信息
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData?.name) {
          setCurrentUserName(userData.name);
        }
      } catch (error) {
        console.error('加载用户数据失败:', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  // 处理待发送的报价（从需求详情页跳转过来时）
  useEffect(() => {
    if (pendingQuote && conversation && !pendingQuoteProcessedRef.current && !loading) {
      pendingQuoteProcessedRef.current = true;
      // 使用 setTimeout 确保在渲染完成后再发送，避免状态竞争
      setTimeout(() => {
        sendPendingQuote(pendingQuote);
      }, 500);
    }
  }, [pendingQuote, conversation, loading]);

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
          type: msg.type === MessageType.QUOTE || msg.type === 'quote' ? MessageType.QUOTE : MessageType.TEXT,
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
            serviceTime: msg.quoteData.serviceTime,
            duration: msg.quoteData.estimatedDuration,
            message: msg.quoteData.message,
            status: msg.quoteData.status as QuoteStatus,
            expertName: msg.quoteData.expertName || msg.senderName,
            employerName: msg.quoteData.employerName,
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

  // 判断当前用户角色
  // 对于零工需求：participant1 是达人（发起咨询/报价的人），participant2 是雇主（发布需求的人）
  // 对于二手商品：participant1 是买家（发起咨询的人），participant2 是卖家（发布商品的人）
  const isEmployer = conversation?.relatedType === ConversationRelatedType.JOB &&
                     conversation.participant1Id === currentUserId;
  const isBuyer = conversation?.relatedType === ConversationRelatedType.ITEM &&
                  conversation.participant1Id === currentUserId;

  // 获取对方的角色标签
  const getRecipientTitle = (): string => {
    if (!conversation) return '用户';

    switch (conversation.relatedType) {
      case ConversationRelatedType.JOB:
        // 零工需求：如果我是雇主，对方是达人；如果我是达人，对方是雇主
        return isEmployer ? '达人' : '雇主';
      case ConversationRelatedType.ITEM:
        // 二手商品：如果我是买家，对方是卖家；如果我是卖家，对方是买家
        return isBuyer ? '卖家' : '买家';
      default:
        return '用户';
    }
  };

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
        title: getRecipientTitle(),
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
        senderName: currentUserName,
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

  // 发送待处理的报价（从需求详情页跳转过来时自动调用，不触发 loadConversation）
  const sendPendingQuote = async (quoteData: PendingQuote) => {
    if (!conversation) return;

    // 获取雇主名称（对方）
    const employerName = conversation.participant1Id === currentUserId
      ? conversation.participant2Name
      : conversation.participant1Name;

    try {
      await sendQuoteService(
        conversationId,
        currentUserId,
        currentUserName,
        {
          jobId: quoteData.jobId,
          jobTitle: conversation.relatedTitle || '服务需求',
          quotedPrice: quoteData.quotedPrice,
          serviceTime: quoteData.serviceTime,
          duration: quoteData.duration,
          message: quoteData.message,
          expertId: currentUserId,
          expertName: currentUserName,
          employerName: employerName || '雇主', // 添加雇主名称
        }
      );
      // 发送成功后重新加载对话
      loadConversation();
      // 延迟2秒后再次加载，获取雇主的自动回复
      setTimeout(() => {
        loadConversation();
      }, 2500);
    } catch (error) {
      console.error('发送报价失败:', error);
      Alert.alert('发送失败', '报价发送失败，请稍后重试');
    }
  };

  // 用户手动发送报价（从聊天页面的报价弹窗）
  const handleSendQuote = async (quoteData: {
    jobId: string;
    quotedPrice: number;
    serviceTime: string;
    duration: string;
    message: string;
  }) => {
    if (!conversation) return;

    setShowQuoteModal(false);

    // 获取雇主名称（对方）
    const employerName = conversation.participant1Id === currentUserId
      ? conversation.participant2Name
      : conversation.participant1Name;

    try {
      await sendQuoteService(
        conversationId,
        currentUserId,
        currentUserName,
        {
          jobId: quoteData.jobId,
          jobTitle: conversation.relatedTitle || '服务需求',
          quotedPrice: quoteData.quotedPrice,
          serviceTime: quoteData.serviceTime,
          duration: quoteData.duration,
          message: quoteData.message,
          expertId: currentUserId,
          expertName: currentUserName,
          employerName: employerName || '雇主', // 添加雇主名称
        }
      );
      // 重新加载对话以获取新消息
      loadConversation();
      // 延迟2秒后再次加载，获取雇主的自动回复
      setTimeout(() => {
        loadConversation();
      }, 2500);
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
