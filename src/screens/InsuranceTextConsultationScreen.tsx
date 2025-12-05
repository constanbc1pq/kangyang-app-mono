/**
 * 保险图文咨询页面 - InsuranceTextConsultationScreen
 * 使用通用 ChatPage 组件实现
 */
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, useTheme } from 'tamagui';
import { Image as ImageIcon, FileText } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ChatPage,
  ChatPageConfig,
  ChatType,
  MessageType,
  ChatMessage,
  RecipientConfig,
  AttachmentItem,
} from '@/components/chat';

type RouteParams = {
  InsuranceTextConsultation: {
    advisorId: string;
    advisorName: string;
    advisorAvatar?: string;
    advisorCompany?: string;
    consultationId?: string;
  };
};

const InsuranceTextConsultationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceTextConsultation'>>();
  const { advisorId, advisorName, advisorAvatar, advisorCompany, consultationId } = route.params;

  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  const handleImageUpload = () => {
    Alert.alert('上传图片', '选择保单或相关材料', [
      { text: '拍照', onPress: () => console.log('拍照') },
      { text: '从相册选择', onPress: () => console.log('选择相册') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handlePlanUpload = () => {
    Alert.alert('发送方案', '选择保险方案', [
      { text: '选择方案', onPress: () => console.log('选择方案') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  // 构建徽章
  const badges: RecipientConfig['badges'] = [
    { type: 'verified', label: '资质认证' },
  ];

  // 构建附件菜单
  type IconType = React.ComponentType<{ size: number; color: string }>;
  const attachmentItems: AttachmentItem[] = [
    {
      id: 'image',
      icon: ImageIcon as IconType,
      label: '图片',
      color: primaryColor || '#6366F1',
      onPress: handleImageUpload,
    },
    {
      id: 'plan',
      icon: FileText as IconType,
      label: '保险方案',
      color: successColor || '#10B981',
      onPress: handlePlanUpload,
    },
  ];

  const config: ChatPageConfig = {
    basic: {
      chatType: ChatType.INSURANCE,
      recipientId: advisorId,
      conversationId: consultationId,
    },
    titleBar: {
      title: advisorName,
      subtitle: '保险咨询',
      showBack: true,
      onBack: () => navigation.goBack(),
    },
    recipient: {
      show: true,
      avatar: advisorAvatar,
      name: advisorName,
      title: '保险顾问',
      organization: advisorCompany,
      badges,
    },
    message: {
      supportedTypes: [
        MessageType.TEXT,
        MessageType.IMAGE,
        MessageType.PLAN,
      ],
    },
    attachment: {
      items: attachmentItems,
    },
    call: {
      enableVoiceCall: true,
      enableVideoCall: false,
      onVoiceCall: () => {
        Alert.alert('语音通话', '正在连接顾问...');
      },
    },
    workflow: {
      welcomeMessages: [
        {
          sender: 'recipient',
          content: `您好！我是${advisorName}，很高兴为您提供保险咨询服务。请详细描述您的问题，我会尽快为您解答。`,
        },
      ],
      showAIAssistant: false,
      showRating: false,
    },
  };

  // 模拟顾问回复
  const simulateReply = async (_userMessage: string): Promise<ChatMessage | null> => {
    const responses = [
      '根据您的情况，我推荐您了解一下我们的重疾险产品，保障范围广，性价比高。',
      '您说的这种情况，建议您可以考虑搭配医疗险和意外险，这样保障更加全面。',
      '关于保费问题，我们有多种缴费方案可选，可以根据您的预算灵活调整。',
      '这款产品的核心优势是保障额度高、等待期短，特别适合您这个年龄段。',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: `msg-${Date.now()}`,
      type: MessageType.TEXT,
      sender: 'recipient',
      senderId: advisorId,
      senderName: advisorName,
      senderAvatar: advisorAvatar,
      content: randomResponse,
      timestamp: new Date(),
      isRead: true,
    };
  };

  return (
    <ChatPage
      config={config}
      currentUserId="current-user-id"
      simulateReply={simulateReply}
    />
  );
};

export default InsuranceTextConsultationScreen;
