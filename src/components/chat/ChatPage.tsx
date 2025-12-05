/**
 * ChatPage - 通用聊天页面组件
 * 支持私人医生/律师/保险顾问/社区买卖/达人咨询等场景
 */
import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { View, Text, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChatPageConfig,
  ChatMessage,
  MessageType,
} from '@/types/chat';
import { ChatTitleBar } from './ChatTitleBar';
import { ChatInputBar } from './ChatInputBar';
import { ChatMessageList, insertTimeSeparators } from './ChatMessageList';
import { RecipientInfoCard } from './RecipientInfoCard';
import { ChatAttachmentMenu } from './ChatAttachmentMenu';
import { ChatQuickTemplates } from './ChatQuickTemplates';

interface ChatPageProps {
  /** 页面配置 */
  config: ChatPageConfig;
  /** 初始消息列表 */
  initialMessages?: ChatMessage[];
  /** 当前用户ID */
  currentUserId: string;
  /** 发送消息回调 */
  onSendMessage?: (content: string, type: MessageType) => Promise<ChatMessage | null>;
  /** 发送图片回调 (预留) */
  _onSendImage?: () => void;
  /** 发送语音回调 */
  onSendVoice?: (duration: number) => void;
  /** 报价接受回调 */
  onAcceptQuote?: (quoteId: string) => void;
  /** 报价拒绝回调 */
  onRejectQuote?: (quoteId: string) => void;
  /** 当前用户是否是雇主 */
  isEmployer?: boolean;
  /** 加载历史消息回调 */
  onLoadHistory?: () => Promise<ChatMessage[]>;
  /** 模拟对方回复 (Demo用) */
  simulateReply?: (userMessage: string) => Promise<ChatMessage | null>;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  config,
  initialMessages = [],
  currentUserId,
  onSendMessage,
  onSendVoice,
  onAcceptQuote,
  onRejectQuote,
  isEmployer = false,
  onLoadHistory,
  simulateReply,
}) => {
  const insets = useSafeAreaInsets();

  // 消息列表状态
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // UI状态
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 追问计数
  const [followUpCount, setFollowUpCount] = useState(0);

  const { basic, titleBar, recipient, message, attachment, call, workflow } = config;

  // 初始化消息
  useEffect(() => {
    initializeMessages();
  }, []);

  const initializeMessages = async () => {
    let msgs = [...initialMessages];

    // 添加欢迎消息
    if (workflow.welcomeMessages && workflow.welcomeMessages.length > 0 && msgs.length === 0) {
      const welcomeMsgs = workflow.welcomeMessages.map((wm, index) => ({
        id: `welcome-${index}`,
        type: MessageType.TEXT,
        sender: wm.sender,
        senderId: wm.sender === 'ai' ? 'ai-assistant' : basic.recipientId,
        senderName: wm.sender === 'ai' ? 'AI助手' : recipient.name,
        content: wm.content,
        timestamp: new Date(Date.now() - (workflow.welcomeMessages!.length - index) * 1000),
        isRead: true,
      } as ChatMessage));

      msgs = [...welcomeMsgs, ...msgs];
    }

    // 插入时间分隔符
    setMessages(insertTimeSeparators(msgs));
  };

  // 发送消息
  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return;

    const content = inputText.trim();
    setInputText('');
    setShowAttachmentMenu(false);
    setShowQuickTemplates(false);

    // 创建用户消息
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: MessageType.TEXT,
      sender: 'user',
      senderId: currentUserId,
      content,
      timestamp: new Date(),
      isRead: true,
    };

    // 添加到消息列表
    setMessages(prev => insertTimeSeparators([
      ...prev.filter(m => m.type !== MessageType.SYSTEM),
      userMessage,
    ]));

    // 更新追问计数
    if (workflow.maxFollowUps && workflow.maxFollowUps > 0) {
      setFollowUpCount(prev => prev + 1);
    }

    // 调用发送回调
    if (onSendMessage) {
      await onSendMessage(content, MessageType.TEXT);
    }

    // 模拟对方回复 (Demo用)
    if (simulateReply) {
      setTimeout(async () => {
        const reply = await simulateReply(content);
        if (reply) {
          setMessages(prev => insertTimeSeparators([
            ...prev.filter(m => m.type !== MessageType.SYSTEM),
            reply,
          ]));
        }
      }, 2000);
    }
  }, [inputText, currentUserId, workflow.maxFollowUps, onSendMessage, simulateReply]);

  // 处理附件按钮点击
  const handleAttachmentPress = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
    setShowQuickTemplates(false);
  };

  // 处理语音按钮
  const handleVoicePress = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      // 开始录音，3秒后自动停止（Demo）
      setTimeout(() => {
        setIsRecording(false);
        if (onSendVoice) {
          onSendVoice(3);
        }

        // 创建语音消息
        const voiceMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          type: MessageType.VOICE,
          sender: 'user',
          senderId: currentUserId,
          content: '语音消息',
          timestamp: new Date(),
          isRead: true,
          voiceDuration: 3,
        };

        setMessages(prev => insertTimeSeparators([
          ...prev.filter(m => m.type !== MessageType.SYSTEM),
          voiceMessage,
        ]));
      }, 3000);
    }
  };

  // 处理快速模板选择
  const handleTemplateSelect = (template: { id: string; content: string }) => {
    setInputText(prev => prev + template.content);
    setShowQuickTemplates(false);
  };

  // 下拉刷新加载历史
  const handleRefresh = async () => {
    if (!onLoadHistory) return;

    setRefreshing(true);
    try {
      const history = await onLoadHistory();
      if (history.length > 0) {
        setMessages(prev => insertTimeSeparators([
          ...history,
          ...prev.filter(m => m.type !== MessageType.SYSTEM),
        ]));
      }
    } finally {
      setRefreshing(false);
    }
  };

  // 检查是否达到追问上限
  const isFollowUpLimitReached =
    workflow.maxFollowUps !== undefined &&
    workflow.maxFollowUps > 0 &&
    followUpCount >= workflow.maxFollowUps;

  // 检查是否启用语音
  const enableVoice = message.supportedTypes.includes(MessageType.VOICE);

  return (
    <View flex={1} backgroundColor="$background">
      {/* 标题栏 */}
      <ChatTitleBar
        config={titleBar}
        callConfig={call}
        insetTop={insets.top}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* 对方信息卡片 */}
        {recipient.show && (
          <RecipientInfoCard config={recipient} />
        )}

        {/* 消息列表 */}
        <ChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          onRefresh={onLoadHistory ? handleRefresh : undefined}
          refreshing={refreshing}
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          isEmployer={isEmployer}
          emptyText={`请描述您的问题，${recipient.name}将为您解答`}
        />

        {/* 快速模板 */}
        {showQuickTemplates && workflow.quickTemplates && (
          <ChatQuickTemplates
            templates={workflow.quickTemplates}
            onSelect={handleTemplateSelect}
            onClose={() => setShowQuickTemplates(false)}
          />
        )}

        {/* 附件菜单 */}
        {showAttachmentMenu && (
          <ChatAttachmentMenu
            items={attachment.items}
            onClose={() => setShowAttachmentMenu(false)}
          />
        )}

        {/* 追问次数提示 */}
        {workflow.maxFollowUps !== undefined && workflow.maxFollowUps > 0 && (
          <View paddingHorizontal="$2.5" paddingVertical="$1" backgroundColor="$color2">
            <YStack alignItems="center">
              <Text
                fontSize="$2"
                color={isFollowUpLimitReached ? '$error' : '$color10'}
              >
                {isFollowUpLimitReached
                  ? '已达到最大追问次数'
                  : `剩余 ${workflow.maxFollowUps - followUpCount} 次追问机会`}
              </Text>
            </YStack>
          </View>
        )}

        {/* 输入栏 */}
        <ChatInputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onAttachmentPress={attachment.items.length > 0 ? handleAttachmentPress : undefined}
          onVoicePress={enableVoice ? handleVoicePress : undefined}
          showAttachmentMenu={showAttachmentMenu}
          isRecording={isRecording}
          disabled={isFollowUpLimitReached}
          disabledPlaceholder="已达到最大追问次数"
          insetBottom={insets.bottom}
          enableVoice={enableVoice}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatPage;
