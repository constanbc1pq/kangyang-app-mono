/**
 * ============================================================================
 * 图文咨询页面 - TextConsultationScreen
 * ============================================================================
 *
 * Phase 33.4: 图文咨询
 * 复用ChatScreen架构和ChatMessageBubble组件
 *
 * 【功能概述】
 * - 提供文字+图片的法律咨询服务
 * - 支持多轮对话，律师专业解答
 *
 * 【主要功能】
 * 1. 问题描述输入：文字描述 + 图片上传（最多9张）
 * 2. 证据材料上传：支持拍照或从相册选择
 * 3. 律师回复展示：实时消息流展示
 * 4. 3轮追问功能：每次咨询允许3次追问
 * 5. 咨询记录保存：自动保存到历史记录
 * 6. 满意度评价：咨询结束后评分和评论
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
  Button,
  ScrollView,
} from 'tamagui';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Send,
  Star,
  Image as ImageIcon,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ChatMessageBubble, ChatMessage } from '@/components/ChatMessageBubble';
import { LawyerProfile } from '../types/legalService';
import { getLawyerById } from '../services/legalService';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
      consultationId?: string;
    };
  };
}

// 咨询状态
type ConsultationStatus = 'composing' | 'submitted' | 'answered' | 'completed';

const TextConsultationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyerId, consultationId } = route.params;

  // 状态管理
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ConsultationStatus>('composing');

  // 消息列表
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // 追问计数
  const [followUpCount, setFollowUpCount] = useState(0);
  const maxFollowUps = 3;

  // 评价相关
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const flatListRef = useRef<FlatList>(null);

  // 当前用户ID
  const currentUserId = 'current-user-id';

  useEffect(() => {
    loadLawyerInfo();
    if (consultationId) {
      loadConsultationHistory();
    }
  }, [lawyerId, consultationId]);

  const loadLawyerInfo = async () => {
    try {
      setLoading(true);
      const data = await getLawyerById(lawyerId);
      if (data) {
        setLawyer(data);
      } else {
        Alert.alert('错误', '律师信息加载失败');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading lawyer:', error);
      Alert.alert('错误', '律师信息加载失败');
    } finally {
      setLoading(false);
    }
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const content = inputText.trim();
    const now = new Date();

    // 创建用户消息
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      content,
      timestamp: now,
      isRead: true,
      type: 'text',
    };

    // 添加到消息列表
    const updatedMessages = [...messages, userMessage];
    setMessages(insertTimeSeparators(updatedMessages));
    setInputText('');
    setStatus('submitted');

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // 模拟律师回复（3秒后）
    setTimeout(() => {
      simulateLawyerResponse();
    }, 3000);
  };

  const simulateLawyerResponse = () => {
    const lawyerMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: lawyerId,
      content: `您好！根据您描述的情况，我为您分析如下：\n\n1. 从法律角度看，您的诉求是有依据的。\n\n2. 建议您先收集相关证据材料，包括：\n   - 相关合同或协议\n   - 沟通记录（短信、微信等）\n   - 其他证明材料\n\n3. 可以先尝试协商解决，如协商不成，可通过法律途径维权。\n\n如有其他疑问，欢迎继续追问（剩余${maxFollowUps - followUpCount}次追问机会）。`,
      timestamp: new Date(),
      isRead: true,
      type: 'text',
    };

    setMessages(prev => insertTimeSeparators([...prev, lawyerMessage]));
    setStatus('answered');

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleFollowUp = () => {
    if (followUpCount >= maxFollowUps) {
      Alert.alert('提示', '已达到最大追问次数');
      return;
    }

    setFollowUpCount(followUpCount + 1);
    handleSendMessage();
  };

  const handleEndConsultation = () => {
    Alert.alert(
      '结束咨询',
      '确定要结束本次咨询吗？结束后将无法继续追问。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            setStatus('completed');
            setShowRating(true);
          },
        },
      ]
    );
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('提示', '请选择评分');
      return;
    }

    Alert.alert('感谢您的评价', '您的反馈对我们很重要！', [
      {
        text: '确定',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading || !lawyer) {
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

  // 评价弹窗
  if (showRating) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View flex={1} padding="$4">
          <YStack space="$4" flex={1}>
            <Text fontSize="$6" fontWeight="bold" textAlign="center">
              咨询评价
            </Text>

            <YStack space="$2" alignItems="center">
              <Text fontSize="$4" color="$textSecondary">
                请为{lawyer.name}律师的服务打分
              </Text>

              <XStack space="$2">
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Star
                      size={40}
                      color={star <= rating ? '#faad14' : '#d9d9d9'}
                      fill={star <= rating ? '#faad14' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </XStack>
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4">评价内容（可选）</Text>
              <Input
                placeholder="说说您的咨询体验..."
                value={ratingComment}
                onChangeText={setRatingComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                backgroundColor="white"
                borderWidth={1}
                borderColor="$borderColor"
              />
            </YStack>

            <Button
              backgroundColor={COLORS.primary}
              onPress={handleSubmitRating}
              marginTop="auto"
            >
              <Text color="white" fontSize="$5" fontWeight="600">
                提交评价
              </Text>
            </Button>
          </YStack>
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
                <View width={32} height={32} justifyContent="center" alignItems="center">
                  <ArrowLeft size={24} color={COLORS.text} />
                </View>
              </TouchableOpacity>

              <XStack space="$2" alignItems="center" flex={1}>
                <View
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor="$background"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={18}>⚖️</Text>
                </View>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={1}>
                    {lawyer.name}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {lawyer.lawFirm}
                  </Text>
                </YStack>
              </XStack>
            </XStack>

            {status === 'answered' && followUpCount < maxFollowUps && (
              <Text fontSize="$2" color="$textSecondary">
                剩余{maxFollowUps - followUpCount}次追问
              </Text>
            )}
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
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View padding="$4" alignItems="center">
              <Text fontSize="$3" color="$textSecondary" textAlign="center">
                请描述您的法律问题，{lawyer.name}律师将为您解答
              </Text>
            </View>
          }
        />

        {/* 输入框 */}
        <View
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
          {status === 'completed' ? (
            <Text textAlign="center" color="$textSecondary">
              咨询已结束
            </Text>
          ) : (
            <YStack space="$2">
              {status === 'answered' && (
                <XStack space="$2" justifyContent="flex-end">
                  <Button
                    size="$3"
                    variant="outlined"
                    onPress={handleEndConsultation}
                    borderColor={COLORS.primary}
                  >
                    <Text color={COLORS.primary}>结束咨询</Text>
                  </Button>
                </XStack>
              )}

              <XStack space="$2" alignItems="center">
                <Input
                  flex={1}
                  placeholder={
                    status === 'composing'
                      ? '请描述您的法律问题...'
                      : followUpCount >= maxFollowUps
                      ? '已达到最大追问次数'
                      : '继续追问...'
                  }
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
                  disabled={followUpCount >= maxFollowUps && status !== 'composing'}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />

                <TouchableOpacity
                  onPress={
                    status === 'composing' || followUpCount === 0
                      ? handleSendMessage
                      : handleFollowUp
                  }
                  disabled={!inputText.trim() || (followUpCount >= maxFollowUps && status !== 'composing')}
                >
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={
                      inputText.trim() && (status === 'composing' || followUpCount < maxFollowUps)
                        ? COLORS.primary
                        : '$background'
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Send
                      size={20}
                      color={
                        inputText.trim() && (status === 'composing' || followUpCount < maxFollowUps)
                          ? 'white'
                          : COLORS.textSecondary
                      }
                    />
                  </View>
                </TouchableOpacity>
              </XStack>
            </YStack>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TextConsultationScreen;
