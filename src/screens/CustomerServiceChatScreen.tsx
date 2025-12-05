/**
 * CustomerServiceChatScreen - 客服聊天页面
 * 使用通用 ChatPage 组件，不配置视频和语音通话
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState, useEffect } from 'react';
import { View, Text, useTheme } from 'tamagui';
import { Image, FileText } from 'lucide-react-native';
import {
  ChatPage,
  ChatPageConfig,
  ChatType,
  MessageType,
  ChatMessage,
  AttachmentItem,
  QuickTemplate,
} from '@/components/chat';

// 快捷模板
const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 't1',
    title: '查询订单',
    content: '您好，我想查询我的订单状态',
  },
  {
    id: 't2',
    title: '申请退款',
    content: '您好，我想申请退款',
  },
  {
    id: 't3',
    title: '修改信息',
    content: '您好，我想修改订单信息',
  },
  {
    id: 't4',
    title: '投诉建议',
    content: '您好，我有一些投诉/建议想反馈',
  },
];

interface CustomerServiceChatScreenProps {
  route: any;
  navigation: any;
}

const CustomerServiceChatScreen: React.FC<CustomerServiceChatScreenProps> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  const { orderId, orderName } = route.params || {};

  const [config, setConfig] = useState<ChatPageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildConfig();
  }, [orderId]);

  const buildConfig = () => {
    setLoading(true);

    // 构建附件菜单
    type IconType = React.ComponentType<{ size: number; color: string }>;
    const attachmentItems: AttachmentItem[] = [
      {
        id: 'image',
        icon: Image as IconType,
        label: '发送图片',
        color: primaryColor || '#6366F1',
        onPress: () => {
          // 选择图片
          console.log('选择图片');
        },
      },
      {
        id: 'file',
        icon: FileText as IconType,
        label: '发送文件',
        color: successColor || '#10B981',
        onPress: () => {
          // 选择文件
          console.log('选择文件');
        },
      },
    ];

    const chatConfig: ChatPageConfig = {
      basic: {
        chatType: ChatType.CUSTOMER_SERVICE,
        recipientId: 'customer-service',
      },
      titleBar: {
        title: '在线客服',
        subtitle: orderId ? `订单：${orderId}` : '随时为您服务',
        showBack: true,
        onBack: () => navigation.goBack(),
      },
      recipient: {
        show: true,
        avatar: '👩‍💼',
        name: '康养客服',
        title: '在线客服',
        organization: '康养APP',
        badges: [
          { type: 'verified', label: '官方认证' },
        ],
        isOnline: true,
      },
      message: {
        supportedTypes: [
          MessageType.TEXT,
          MessageType.IMAGE,
        ],
      },
      attachment: {
        items: attachmentItems,
      },
      // 不配置 call，禁用语音和视频通话
      call: {
        enableVoiceCall: false,
        enableVideoCall: false,
      },
      workflow: {
        welcomeMessages: [
          {
            sender: 'recipient',
            content: `您好，欢迎咨询康养客服！${orderName ? `\n\n您正在咨询的订单：${orderName}` : ''}\n\n请问有什么可以帮您？`,
          },
          {
            sender: 'ai',
            content: '💡 温馨提示：您可以使用下方快捷模板快速发起咨询，或直接输入您的问题。工作时间：9:00-21:00，我们会尽快回复您。',
          },
        ],
        quickTemplates: QUICK_TEMPLATES,
        showAIAssistant: false,
        showRating: true,
      },
    };

    setConfig(chatConfig);
    setLoading(false);
  };

  // 模拟客服回复
  const simulateReply = async (userMessage: string): Promise<ChatMessage | null> => {
    // 根据用户消息内容生成不同的回复
    let response = '感谢您的咨询，客服正在为您处理中，请稍候...';

    if (userMessage.includes('订单')) {
      response = '好的，我来帮您查询订单状态。请问您能提供一下订单号吗？或者您可以在"我的订单"中查看详细信息。';
    } else if (userMessage.includes('退款')) {
      response = '关于退款申请，请您先确认订单是否符合退款条件：\n1. 未发货订单可全额退款\n2. 已发货订单需等待收货后申请\n3. 服务类订单在服务开始前可申请退款\n\n请问您的订单属于哪种情况？';
    } else if (userMessage.includes('修改')) {
      response = '好的，请问您需要修改订单的哪些信息？比如收货地址、预约时间等。部分信息在订单发货后可能无法修改，我来帮您确认。';
    } else if (userMessage.includes('投诉') || userMessage.includes('建议')) {
      response = '非常感谢您的反馈！我们非常重视每一位用户的意见。请您详细描述遇到的问题，我们会认真处理并尽快给您回复。';
    }

    return {
      id: `msg-${Date.now()}`,
      type: MessageType.TEXT,
      sender: 'recipient',
      senderId: 'customer-service',
      senderName: '康养客服',
      senderAvatar: '👩‍💼',
      content: response,
      timestamp: new Date(),
      isRead: true,
    };
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
    <ChatPage
      config={config}
      currentUserId="user_current"
      simulateReply={simulateReply}
    />
  );
};

export default CustomerServiceChatScreen;
