import React, { useState, useEffect, useRef } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Input,
} from 'tamagui';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Plus,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ChatConversation, ConversationRelatedType, OrderStatus } from '@/types/community';
import {
  getConversationById,
  getMessages,
  sendMessage as sendMessageService,
  sendQuote as sendQuoteService,
  markAsRead,
  createOrder,
  getJobById,
} from '@/services/communityDataService';
import { ChatMessageBubble, ChatMessage } from '@/components/ChatMessageBubble';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { QuoteData, QuoteStatus } from '@/components/QuoteCard';
import { Alert } from 'react-native';

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      conversationId: string;
    };
  };
}

/**
 * 聊天页面
 * 展示与特定用户的聊天记录，支持发送消息
 */
export const ChatScreen: React.FC<ChatScreenProps> = ({
  navigation,
  route,
}) => {
  const { conversationId } = route.params;
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // 当前用户ID（实际应从用户状态获取）
  const currentUserId = 'current-user-id';

  // 判断当前用户是否是雇主（job类型对话中发起需求的一方）
  // participant1 通常是需求发布方/雇主
  const isEmployer = conversation?.relatedType === ConversationRelatedType.JOB &&
                     conversation.participant1Id === currentUserId;

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

        // 转换为组件需要的格式
        const formattedMessages: ChatMessage[] = chatMessages.map(msg => ({
          id: msg.id,
          senderId: msg.senderId,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isRead: msg.isRead,
          type: msg.type === 'TEXT' ? 'text' :
                msg.type === 'QUOTE' ? 'quote' :
                msg.type === 'IMAGE' ? 'image' : 'text',
          quoteData: msg.quoteData ? {
            id: msg.id,
            jobId: msg.quoteData.jobId,
            jobTitle: msg.quoteData.jobTitle,
            quotedPrice: msg.quoteData.price,
            serviceTime: '',
            duration: msg.quoteData.estimatedDuration,
            message: msg.quoteData.message,
            status: msg.quoteData.status,
            expertId: msg.senderId,
            expertName: msg.senderName,
            createdAt: new Date(msg.createdAt),
          } : undefined,
        }));

        // 添加时间分隔符
        const messagesWithTimeSeparator = insertTimeSeparators(formattedMessages);
        setMessages(messagesWithTimeSeparator);

        // 标记消息为已读
        await markAsRead(conversationId, currentUserId);
      }
    } catch (error) {
      console.error('加载对话失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 插入时间分隔符
  const insertTimeSeparators = (messages: ChatMessage[]): ChatMessage[] => {
    const result: ChatMessage[] = [];
    let lastDate: Date | null = null;

    messages.forEach((message, index) => {
      const messageDate = message.timestamp;

      // 如果是第一条消息或与上一条消息时间差超过1小时，添加时间分隔符
      if (!lastDate || messageDate.getTime() - lastDate.getTime() > 3600000) {
        result.push({
          id: `separator-${index}`,
          senderId: 'system',
          content: formatDateSeparator(messageDate),
          timestamp: messageDate,
          isRead: true,
          type: 'system',
        });
      }

      result.push(message);
      lastDate = messageDate;
    });

    return result;
  };

  // 格式化日期分隔符
  const formatDateSeparator = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMore = () => {
    // TODO: 显示更多选项（清空聊天记录、举报等）
    console.log('更多选项');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !conversation) return;

    const content = inputText.trim();

    // 清空输入框
    setInputText('');

    // 发送消息到服务器
    try {
      const sentMessage = await sendMessageService(conversationId, {
        senderId: currentUserId,
        senderName: '当前用户', // TODO: 从用户状态获取
        type: 'TEXT',
        content,
      });

      if (sentMessage) {
        // 添加到消息列表
        const newMessage: ChatMessage = {
          id: sentMessage.id,
          senderId: sentMessage.senderId,
          content: sentMessage.content,
          timestamp: new Date(sentMessage.timestamp),
          isRead: sentMessage.isRead,
          type: 'text',
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        // 滚动到底部
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      Alert.alert('发送失败', '消息发送失败，请稍后重试');
    }
  };

  // 显示报价弹窗（仅达人可用）
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

  // 发送报价
  const handleSendQuote = async (quoteData: {
    jobId: string;
    quotedPrice: number;
    serviceTime: string;
    duration: string;
    message: string;
  }) => {
    if (!conversation) return;

    // 关闭弹窗
    setShowQuoteModal(false);

    // 发送报价到服务器
    try {
      const sentMessage = await sendQuoteService(
        conversationId,
        currentUserId,
        '当前用户', // TODO: 从用户状态获取
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

      if (sentMessage && sentMessage.quoteData) {
        // 添加到消息列表
        const quote: QuoteData = {
          id: sentMessage.id,
          jobId: sentMessage.quoteData.jobId,
          jobTitle: sentMessage.quoteData.jobTitle,
          quotedPrice: sentMessage.quoteData.price,
          serviceTime: quoteData.serviceTime,
          duration: sentMessage.quoteData.estimatedDuration,
          message: sentMessage.quoteData.message,
          status: sentMessage.quoteData.status,
          expertId: currentUserId,
          expertName: '当前用户',
          createdAt: new Date(sentMessage.createdAt),
        };

        const newMessage: ChatMessage = {
          id: sentMessage.id,
          senderId: sentMessage.senderId,
          content: sentMessage.content,
          timestamp: new Date(sentMessage.timestamp),
          isRead: sentMessage.isRead,
          type: 'quote',
          quoteData: quote,
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        // 滚动到底部
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        Alert.alert('报价已发送', '等待雇主回复');
      }
    } catch (error) {
      console.error('发送报价失败:', error);
      Alert.alert('发送失败', '请稍后重试');
    }
  };

  // 接受报价
  const handleAcceptQuote = async (quoteId: string) => {
    Alert.alert(
      '确认接受报价',
      '接受后将生成订单，您需要支付相应费用',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认接受',
          onPress: async () => {
            try {
              // 查找报价信息
              const quoteMessage = messages.find(
                msg => msg.type === 'quote' && msg.quoteData?.id === quoteId
              );

              if (!quoteMessage?.quoteData || !conversation) {
                Alert.alert('错误', '报价信息不存在');
                return;
              }

              const quote = quoteMessage.quoteData;

              // 获取需求详情
              const job = await getJobById(quote.jobId);
              if (!job) {
                Alert.alert('错误', '服务需求不存在');
                return;
              }

              // 创建订单
              const orderData = {
                jobId: quote.jobId,
                employerId: currentUserId,
                employerName: '当前用户', // TODO: 从用户状态获取
                employerAvatar: undefined,
                expertId: quote.expertId,
                expertName: quote.expertName,
                expertAvatar: undefined,
                serviceType: job.serviceType,
                serviceTitle: quote.jobTitle,
                serviceDescription: job.description,
                location: {
                  address: job.location.address,
                  latitude: job.location.latitude,
                  longitude: job.location.longitude,
                },
                scheduledTime: quote.serviceTime,
                duration: quote.duration,
                quotedPrice: quote.quotedPrice,
                finalPrice: quote.quotedPrice,
                currency: '¥',
                status: OrderStatus.PENDING_PAYMENT,
              };

              const newOrder = await createOrder(orderData);

              // 更新消息中的报价状态
              setMessages(prevMessages =>
                prevMessages.map(msg => {
                  if (msg.type === 'quote' && msg.quoteData?.id === quoteId) {
                    return {
                      ...msg,
                      quoteData: {
                        ...msg.quoteData,
                        status: QuoteStatus.ACCEPTED,
                      },
                    };
                  }
                  return msg;
                })
              );

              console.log('订单创建成功:', newOrder);

              Alert.alert(
                '接受成功',
                '订单已生成，请前往支付',
                [
                  {
                    text: '立即支付',
                    onPress: () => navigation.navigate('ServiceOrderDetail', { orderId: newOrder.id }),
                  },
                  {
                    text: '稍后支付',
                    onPress: () => navigation.navigate('MyOrders'),
                  },
                ]
              );
            } catch (error) {
              console.error('创建订单失败:', error);
              Alert.alert('操作失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  // 拒绝报价
  const handleRejectQuote = async (quoteId: string) => {
    Alert.alert(
      '确认拒绝报价',
      '拒绝后达人可以重新发送报价',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认拒绝',
          style: 'destructive',
          onPress: async () => {
            // 更新消息中的报价状态
            setMessages(prevMessages =>
              prevMessages.map(msg => {
                if (msg.type === 'quote' && msg.quoteData?.id === quoteId) {
                  return {
                    ...msg,
                    quoteData: {
                      ...msg.quoteData,
                      status: QuoteStatus.REJECTED,
                    },
                  };
                }
                return msg;
              })
            );

            // TODO: 通知服务器
            try {
              console.log('拒绝报价，报价ID:', quoteId);
              Alert.alert('已拒绝报价');
            } catch (error) {
              console.error('拒绝报价失败:', error);
              Alert.alert('操作失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  if (loading || !conversation) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 顶部导航栏 */}
        <View
          backgroundColor="white"
          paddingTop="$3"
          paddingHorizontal="$4"
          paddingBottom="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack space="$3" alignItems="center" flex={1}>
              <TouchableOpacity onPress={handleBack}>
                <View
                  width={32}
                  height={32}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ArrowLeft size={24} color={COLORS.text} />
                </View>
              </TouchableOpacity>

              {/* 对方信息 */}
              <XStack space="$2" alignItems="center" flex={1}>
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
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={1}>
                    {conversation.relatedType === ConversationRelatedType.JOB ? '服务需求方' :
                     conversation.relatedType === ConversationRelatedType.ITEM ? '卖家' :
                     conversation.relatedType === ConversationRelatedType.ORDER ? '服务方' : '用户'}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {conversation.relatedType === ConversationRelatedType.JOB ? '关于服务需求' :
                     conversation.relatedType === ConversationRelatedType.ITEM ? '关于闲置物品' :
                     conversation.relatedType === ConversationRelatedType.ORDER ? '关于服务订单' : ''}
                  </Text>
                </YStack>
              </XStack>
            </XStack>

            <TouchableOpacity onPress={handleMore}>
              <View
                width={32}
                height={32}
                justifyContent="center"
                alignItems="center"
              >
                <MoreVertical size={20} color={COLORS.text} />
              </View>
            </TouchableOpacity>
          </XStack>
        </View>

        {/* 消息列表 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <ChatMessageBubble
              message={item}
              isCurrentUser={item.senderId === currentUserId}
              isEmployer={isEmployer}
              onAcceptQuote={handleAcceptQuote}
              onRejectQuote={handleRejectQuote}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* 输入框 */}
        <View
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
          <XStack space="$2" alignItems="center">
            {/* 更多按钮（报价、图片等） */}
            {conversation?.relatedType === ConversationRelatedType.JOB && !isEmployer && (
              <TouchableOpacity onPress={handleShowQuoteModal}>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="$background"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Plus size={24} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            )}

            <Input
              flex={1}
              placeholder="输入消息..."
              value={inputText}
              onChangeText={setInputText}
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              paddingHorizontal="$3"
              paddingVertical="$2"
              fontSize="$4"
              multiline
              maxHeight={100}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={inputText.trim() ? COLORS.primary : '$background'}
                justifyContent="center"
                alignItems="center"
              >
                <Send
                  size={20}
                  color={inputText.trim() ? 'white' : COLORS.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </XStack>
        </View>

        {/* 报价表单弹窗 */}
        {conversation && (
          <QuoteFormModal
            visible={showQuoteModal}
            jobTitle={conversation.relatedTitle || '服务需求'}
            jobId={conversation.relatedId || ''}
            onClose={() => setShowQuoteModal(false)}
            onSubmit={handleSendQuote}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
