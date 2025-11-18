/**
 * ============================================================================
 * 保险图文咨询页面 - InsuranceTextConsultationScreen
 * ============================================================================
 *
 * 基于法律服务的TextConsultationScreen改造
 * 提供实时聊天式的保险咨询服务
 *
 * 【功能概述】
 * - 提供文字+图片的保险咨询服务
 * - 支持多轮对话，顾问专业解答
 * - 实时聊天体验
 *
 * 【主要功能】
 * 1. 实时聊天界面：类似微信的消息流
 * 2. 文字+图片支持：支持发送文字和图片
 * 3. 多轮追问：支持持续对话
 * 4. 顾问回复展示：实时消息流展示
 * 5. 咨询记录保存：自动保存到历史记录
 *
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Input,
  ScrollView,
} from 'tamagui';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ChatMessageBubble, ChatMessage } from '@/components/ChatMessageBubble';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RouteParams = {
  InsuranceTextConsultation: {
    advisorId: string;
    advisorName: string;
    consultationId?: string;
  };
};

// 咨询状态
type ConsultationStatus = 'active' | 'completed';

const InsuranceTextConsultationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceTextConsultation'>>();
  const { advisorId, advisorName, consultationId } = route.params;

  // 状态管理
  const [status, setStatus] = useState<ConsultationStatus>('active');

  // 消息列表
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  const flatListRef = useRef<FlatList>(null);

  // 当前用户ID
  const currentUserId = 'current-user-id';

  useEffect(() => {
    if (consultationId) {
      loadConsultationHistory();
    } else {
      // 新咨询，添加欢迎消息
      addWelcomeMessage();
    }
  }, [consultationId]);

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: advisorId,
      content: `您好！我是${advisorName}，很高兴为您提供保险咨询服务。请详细描述您的问题，我会尽快为您解答。`,
      timestamp: new Date(),
      isRead: true,
      type: 'text',
    };
    setMessages([welcomeMessage]);
  };

  const loadConsultationHistory = async () => {
    // TODO: 从AsyncStorage加载历史咨询记录
    console.log('Load consultation history:', consultationId);
  };

  // 插入时间分隔符
  const insertTimeSeparators = (messages: ChatMessage[]): ChatMessage[] => {
    const result: ChatMessage[] = [];
    let lastDate: Date | null = null;

    messages.forEach((message, index) => {
      const messageDate = message.timestamp;

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

  const formatDateSeparator = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (messageDate.getTime() === today.getTime()) {
      return `今天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return `昨天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: inputText.trim(),
      timestamp: new Date(),
      isRead: false,
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // 模拟顾问回复（实际应该调用API）
    setTimeout(() => {
      simulateAdvisorReply(inputText);
    }, 2000);

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const simulateAdvisorReply = (userQuestion: string) => {
    const replies = [
      `感谢您的提问。基于您的情况，我建议您考虑以下几点：\n\n1. 首先需要评估您的保障缺口\n2. 根据家庭收入选择合适的保额\n3. 优先配置重疾险和医疗险\n\n您可以告诉我更多关于您家庭的情况吗？`,
      `这是一个很好的问题。关于保险产品的选择，我们需要综合考虑以下因素：\n\n• 年龄和健康状况\n• 家庭经济状况\n• 已有保障情况\n• 未来规划\n\n您方便分享一下这些信息吗？`,
      `理解您的关注点。让我为您详细解答：\n\n保费的高低取决于多个因素，包括保额、保障期限、年龄等。建议我们先确定您的保障需求，再来讨论具体的产品和保费。\n\n您目前最关心的保障是什么？`,
    ];

    const replyMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: advisorId,
      content: replies[Math.floor(Math.random() * replies.length)],
      timestamp: new Date(),
      isRead: true,
      type: 'text',
    };

    setMessages(prev => [...prev, replyMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleImagePick = () => {
    Alert.alert('功能开发中', '图片上传功能即将上线');
  };

  const messagesWithSeparators = insertTimeSeparators(messages);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <View flex={1} backgroundColor="$background">
          {/* Header */}
          <XStack
            height={56}
            alignItems="center"
            paddingHorizontal="$4"
            backgroundColor="$surface"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color={COLORS.text} />
            </Pressable>
            <YStack flex={1} marginLeft="$3">
              <Text fontSize="$4" fontWeight="600" color="$text">
                {advisorName}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                保险顾问
              </Text>
            </YStack>
          </XStack>

          {/* 消息列表 */}
          <FlatList
            ref={flatListRef}
            data={messagesWithSeparators}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessageBubble
                message={item}
                isCurrentUser={item.senderId === currentUserId}
              />
            )}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 8,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={
              <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                paddingVertical="$8"
              >
                <Text fontSize="$3" color="$textSecondary">
                  开始您的咨询吧
                </Text>
              </View>
            }
          />

          {/* 输入框 */}
          <XStack
            padding="$3"
            backgroundColor="$surface"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            alignItems="flex-end"
          >
            <TouchableOpacity
              onPress={handleImagePick}
              style={{ marginRight: 8, padding: 8 }}
            >
              <ImageIcon size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View
              flex={1}
              backgroundColor="$background"
              borderRadius="$3"
              borderWidth={1}
              borderColor="$borderColor"
              paddingHorizontal="$3"
              paddingVertical="$2"
              maxHeight={100}
            >
              <Input
                placeholder="输入消息..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                value={inputText}
                onChangeText={setInputText}
                style={{
                  fontSize: 14,
                  color: COLORS.text,
                  minHeight: 36,
                  paddingTop: 8,
                }}
                backgroundColor="transparent"
                borderWidth={0}
                onSubmitEditing={handleSendMessage}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              style={{ marginLeft: 8, padding: 8 }}
            >
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor={
                  inputText.trim() ? COLORS.primary : '$borderColor'
                }
                justifyContent="center"
                alignItems="center"
              >
                <Send
                  size={18}
                  color={inputText.trim() ? 'white' : COLORS.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </XStack>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InsuranceTextConsultationScreen;
