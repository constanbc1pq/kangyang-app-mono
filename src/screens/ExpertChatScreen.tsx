/**
 * ExpertChatScreen - 达人咨询聊天页面
 * 使用通用 ChatPage 组件实现
 */
import React, { useState, useEffect } from 'react';
import { View, Text } from 'tamagui';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import {
  ChatPage,
  ChatPageConfig,
  ChatType,
  MessageType,
  ChatMessage,
  RecipientConfig,
  AttachmentItem,
} from '@/components/chat';
import { Expert, ExpertType, ExpertCertStatus } from '@/types/community';
import { getExpertById } from '@/services/communityDataService';

/**
 * 获取服务类型中文名
 */
const getServiceTypeLabel = (types: string[]): string => {
  const labels: Record<string, string> = {
    housekeeping: '家政服务',
    repair: '维修服务',
    moving: '搬家服务',
    cleaning: '清洁服务',
    cooking: '烹饪服务',
    caregiving: '照护服务',
    tutoring: '辅导服务',
    fitness: '健身指导',
    pet_care: '宠物照料',
    gardening: '园艺服务',
    driving: '驾驶服务',
    shopping: '代购服务',
    other: '其他服务',
  };
  if (types.length === 0) return '达人服务';
  return labels[types[0]] || '达人服务';
};

export const ExpertChatScreen: React.FC<{ route: any; navigation: any }> = ({
  navigation,
  route,
}) => {
  const { expertId, conversationId } = route.params as {
    expertId: string;
    conversationId?: string;
  };
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ChatPageConfig | null>(null);

  useEffect(() => {
    loadExpert();
  }, [expertId]);

  const loadExpert = async () => {
    try {
      setLoading(true);
      const expertData = await getExpertById(expertId);
      if (expertData) {
        setExpert(expertData);
        setConfig(buildConfig(expertData));
      }
    } catch (error) {
      console.error('加载达人信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildConfig = (expertData: Expert): ChatPageConfig => {
    const serviceTypeLabel = getServiceTypeLabel(expertData.serviceTypes);
    const isBusinessExpert = expertData.expertType === ExpertType.BUSINESS;

    // 构建徽章
    const badges: RecipientConfig['badges'] = [];
    if (expertData.realNameVerified) {
      badges.push({ type: 'verified', label: '实名认证' });
    }
    if (isBusinessExpert) {
      badges.push({ type: 'business', label: '商家认证' });
    } else if (expertData.certStatus === ExpertCertStatus.VERIFIED) {
      badges.push({ type: 'expert', label: '达人认证' });
    }

    // 构建附件菜单
    type IconType = React.ComponentType<{ size: number; color: string }>;
    const attachmentItems: AttachmentItem[] = [
      {
        id: 'photo',
        icon: Camera as IconType,
        label: '拍照',
        color: '#6366F1',
        onPress: () => {
          console.log('拍照');
        },
      },
      {
        id: 'album',
        icon: ImageIcon as IconType,
        label: '相册',
        color: '#10B981',
        onPress: () => {
          console.log('从相册选择');
        },
      },
    ];

    return {
      basic: {
        chatType: ChatType.EXPERT,
        recipientId: expertData.id,
        conversationId,
      },
      titleBar: {
        title: expertData.name,
        subtitle: serviceTypeLabel,
        showBack: true,
        onBack: () => navigation.goBack(),
      },
      recipient: {
        show: true,
        avatar: expertData.avatar,
        name: expertData.name,
        title: serviceTypeLabel,
        badges,
        extraInfo: [
          { label: '好评率', value: `${expertData.rating}分` },
          { label: '服务', value: `${expertData.completedOrders}次` },
        ],
      },
      message: {
        supportedTypes: [
          MessageType.TEXT,
          MessageType.IMAGE,
          MessageType.VOICE,
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
        welcomeMessages: [
          {
            sender: 'recipient',
            content: `您好！我是${expertData.name}，很高兴为您服务。请问有什么可以帮您的？`,
          },
        ],
        showAIAssistant: false,
        maxFollowUps: 0,
        showRating: false,
      },
    };
  };

  // 模拟达人回复
  const simulateReply = async (_userMessage: string): Promise<ChatMessage | null> => {
    if (!expert) return null;

    const replies = [
      `好的，我了解您的需求了。关于${getServiceTypeLabel(expert.serviceTypes)}，我可以为您提供专业的服务。`,
      `感谢您的咨询！我会根据您的具体情况，为您制定合适的服务方案。`,
      `没问题，我的服务时间比较灵活，可以根据您的时间来安排。请问您方便的时间是？`,
      `关于价格方面，需要根据具体的服务内容来确定。您能详细说说您的需求吗？`,
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    return {
      id: `msg-${Date.now()}`,
      type: MessageType.TEXT,
      sender: 'recipient',
      senderId: expert.id,
      senderName: expert.name,
      senderAvatar: expert.avatar,
      content: randomReply,
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

export default ExpertChatScreen;
