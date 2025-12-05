/**
 * 图文咨询页面 - TextConsultationScreen
 * 律师图文咨询，使用通用 ChatPage 组件实现
 */
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, useTheme } from 'tamagui';
import { Image as ImageIcon, FileText } from 'lucide-react-native';
import {
  ChatPage,
  ChatPageConfig,
  ChatType,
  MessageType,
  ChatMessage,
  RecipientConfig,
  AttachmentItem,
  ChatRatingModal,
} from '@/components/chat';
import { LawyerProfile } from '@/types/legalService';
import { getLawyerById } from '@/services/legalService';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
      consultationId?: string;
    };
  };
}

const TextConsultationScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  const { lawyerId, consultationId } = route.params;

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ChatPageConfig | null>(null);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    loadLawyerInfo();
  }, [lawyerId]);

  const loadLawyerInfo = async () => {
    try {
      setLoading(true);
      const data = await getLawyerById(lawyerId);
      if (data) {
        setLawyer(data);
        setConfig(buildConfig(data));
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

  const handleImageUpload = () => {
    Alert.alert('上传图片', '选择证据材料', [
      { text: '拍照', onPress: () => console.log('拍照') },
      { text: '从相册选择', onPress: () => console.log('选择相册') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleDocumentUpload = () => {
    Alert.alert('上传文件', '选择合同或文件', [
      { text: '选择文件', onPress: () => console.log('选择文件') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const buildConfig = (lawyerData: LawyerProfile): ChatPageConfig => {
    // 构建徽章
    const badges: RecipientConfig['badges'] = [
      { type: 'verified', label: '执业认证' },
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
        id: 'document',
        icon: FileText as IconType,
        label: '合同文件',
        color: successColor || '#10B981',
        onPress: handleDocumentUpload,
      },
    ];

    return {
      basic: {
        chatType: ChatType.LAWYER,
        recipientId: lawyerData.id,
        conversationId: consultationId,
      },
      titleBar: {
        title: lawyerData.name,
        subtitle: '图文咨询',
        showBack: true,
        onBack: () => navigation.goBack(),
      },
      recipient: {
        show: true,
        avatar: lawyerData.avatar,
        name: lawyerData.name,
        title: lawyerData.title,
        organization: lawyerData.lawFirm,
        badges,
        extraInfo: [
          { label: '擅长', value: lawyerData.specialties.slice(0, 2).join('、') },
        ],
      },
      message: {
        supportedTypes: [
          MessageType.TEXT,
          MessageType.IMAGE,
          MessageType.CONTRACT,
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
            content: `您好，我是${lawyerData.name}律师，专注于${lawyerData.specialties[0]}领域。请详细描述您的法律问题，我会为您提供专业解答。`,
          },
        ],
        maxFollowUps: 3,
        showRating: true,
        onComplete: () => setShowRating(true),
      },
    };
  };

  // 模拟律师回复
  const simulateReply = async (_userMessage: string): Promise<ChatMessage | null> => {
    if (!lawyer) return null;

    const responses = [
      `您好！根据您描述的情况，我为您分析如下：\n\n1. 从法律角度看，您的诉求是有依据的。\n\n2. 建议您先收集相关证据材料。\n\n3. 可以先尝试协商解决，如协商不成，可通过法律途径维权。`,
      '根据相关法律规定，您这种情况需要注意以下几点...',
      '您提供的信息很重要，我需要进一步了解一些细节。请问合同中是否有约定违约责任条款？',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: `msg-${Date.now()}`,
      type: MessageType.TEXT,
      sender: 'recipient',
      senderId: lawyer.id,
      senderName: lawyer.name,
      senderAvatar: lawyer.avatar,
      content: randomResponse,
      timestamp: new Date(),
      isRead: true,
    };
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log('Rating:', rating, 'Comment:', comment);
    setShowRating(false);
    Alert.alert('感谢您的评价', '您的反馈对我们很重要！', [
      { text: '确定', onPress: () => navigation.goBack() },
    ]);
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
        currentUserId="current-user-id"
        simulateReply={simulateReply}
      />
      {lawyer && (
        <ChatRatingModal
          visible={showRating}
          recipientName={lawyer.name}
          onClose={() => setShowRating(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
};

export default TextConsultationScreen;
