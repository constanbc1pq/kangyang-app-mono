/**
 * 医生咨询聊天界面
 * Doctor Chat Screen
 * 使用通用 ChatPage 组件实现
 */
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, useTheme } from 'tamagui';
import { Camera, FileText } from 'lucide-react-native';
import {
  ChatPage,
  ChatPageConfig,
  ChatType,
  MessageType,
  ChatMessage,
  RecipientConfig,
  AttachmentItem,
  QuickTemplate,
} from '@/components/chat';
import { privateDoctorService } from '@/services/privateDoctorService';
import { PrivateDoctor } from '@/types/privateDoctor';

const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 't1',
    title: '主要症状',
    content: '我最近出现了【症状名称】，主要表现为：',
  },
  {
    id: 't2',
    title: '持续时间',
    content: '这个症状已经持续了【时间】，',
  },
  {
    id: 't3',
    title: '严重程度',
    content: '症状的严重程度：【轻度/中度/重度】，',
  },
  {
    id: 't4',
    title: '伴随症状',
    content: '同时还伴有【其他症状】',
  },
];

/**
 * 获取职称中文名
 */
const getTitleLabel = (title: string): string => {
  const labels: Record<string, string> = {
    chief_physician: '主任医师',
    associate_chief_physician: '副主任医师',
    associate_chief: '副主任医师',
    attending_physician: '主治医师',
    attending: '主治医师',
    resident: '住院医师',
  };
  return labels[title] || title;
};

const DoctorChatScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  const { doctorId } = route.params || {};

  const [doctor, setDoctor] = useState<PrivateDoctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ChatPageConfig | null>(null);

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      if (doctorId) {
        const doctorData = await privateDoctorService.getDoctorById(doctorId);
        if (doctorData) {
          setDoctor(doctorData);
          setConfig(buildConfig(doctorData));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    Alert.alert('上传照片', '选择症状照片或化验单', [
      { text: '拍照', onPress: () => console.log('拍照') },
      { text: '从相册选择', onPress: () => console.log('选择相册') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleDocumentUpload = () => {
    Alert.alert('成功', '化验单已上传');
  };

  const buildConfig = (doctorData: PrivateDoctor): ChatPageConfig => {
    const titleLabel = getTitleLabel(doctorData.title);

    // 构建徽章
    const badges: RecipientConfig['badges'] = [
      { type: 'vip', label: titleLabel },
    ];

    // 构建附件菜单
    type IconType = React.ComponentType<{ size: number; color: string }>;
    const attachmentItems: AttachmentItem[] = [
      {
        id: 'photo',
        icon: Camera as IconType,
        label: '症状照片',
        color: primaryColor || '#6366F1',
        onPress: handleImageUpload,
      },
      {
        id: 'document',
        icon: FileText as IconType,
        label: '化验单',
        color: successColor || '#10B981',
        onPress: handleDocumentUpload,
      },
      {
        id: 'template',
        icon: FileText as IconType,
        label: '快速模板',
        color: warningColor || '#F59E0B',
        onPress: () => {
          // 会由 ChatPage 处理显示快速模板
        },
      },
    ];

    return {
      basic: {
        chatType: ChatType.DOCTOR,
        recipientId: doctorData.id,
      },
      titleBar: {
        title: doctorData.name,
        subtitle: '承诺30分钟内回复',
        showBack: true,
        onBack: () => navigation.goBack(),
      },
      recipient: {
        show: true,
        avatar: doctorData.avatar,
        name: doctorData.name,
        title: titleLabel,
        organization: doctorData.hospital.name,
        department: doctorData.department,
        badges,
        isOnline: doctorData.isOnline,
      },
      message: {
        supportedTypes: [
          MessageType.TEXT,
          MessageType.IMAGE,
          MessageType.VOICE,
          MessageType.PRESCRIPTION,
          MessageType.CHECKUP,
          MessageType.REFERRAL,
        ],
      },
      attachment: {
        items: attachmentItems,
      },
      call: {
        enableVoiceCall: true,
        enableVideoCall: true,
        onVoiceCall: () => {
          Alert.alert('语音通话', '正在连接医生...');
        },
        onVideoCall: () => {
          Alert.alert('视频通话', '正在连接医生...');
        },
      },
      workflow: {
        welcomeMessages: [
          {
            sender: 'recipient',
            content: `您好，我是您的私人医生${doctorData.name}。请问您哪里不舒服？`,
          },
          {
            sender: 'ai',
            content:
              '💡 AI助手提示：为了更准确地帮助您，建议您描述以下信息：\n1. 主要症状是什么？\n2. 症状持续多久了？\n3. 有没有伴随症状？\n4. 之前是否看过医生或吃过药？',
          },
        ],
        quickTemplates: QUICK_TEMPLATES,
        showAIAssistant: true,
        showRating: true,
      },
    };
  };

  // 模拟医生回复
  const simulateReply = async (_userMessage: string): Promise<ChatMessage | null> => {
    if (!doctor) return null;

    const responses = [
      '我了解您的情况了。根据您的描述，这可能是...',
      '建议您注意休息，多喝水。如果症状持续，建议来院检查。',
      '我需要更详细了解您的情况。请问您目前有在服用其他药物吗？',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: `msg-${Date.now()}`,
      type: MessageType.TEXT,
      sender: 'recipient',
      senderId: doctor.id,
      senderName: doctor.name,
      senderAvatar: doctor.avatar,
      content: randomResponse,
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

export default DoctorChatScreen;
