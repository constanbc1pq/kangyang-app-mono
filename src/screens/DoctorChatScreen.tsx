/**
 * 医生咨询聊天界面
 * Doctor Chat Screen
 *
 * Phase 23.2: 即时咨询功能
 * - 医疗化聊天界面
 * - 症状照片上传
 * - 化验单上传
 * - 语音消息
 * - 快速模板（引导症状描述）
 * - 电子处方卡片
 * - 检查建议链接
 * - 响应时间承诺
 * - AI预问诊辅助
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput as RNTextInput,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button, Avatar } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  FileText,
  Mic,
  Send,
  Plus,
  X,
  Download,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface Message {
  id: string;
  type: 'text' | 'image' | 'voice' | 'prescription' | 'checkup' | 'referral';
  sender: 'user' | 'doctor' | 'ai';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  voiceDuration?: number;
  prescriptionData?: PrescriptionData;
  checkupData?: CheckupData;
  referralData?: ReferralData;
}

interface PrescriptionData {
  id: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes: string;
}

interface CheckupData {
  title: string;
  description: string;
  appointmentLink?: string;
}

interface ReferralData {
  department: string;
  specialist: string;
  reason: string;
}

interface QuickTemplate {
  id: string;
  title: string;
  content: string;
  category: 'symptom' | 'duration' | 'severity';
}

const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 't1',
    title: '主要症状',
    content: '我最近出现了【症状名称】，主要表现为：',
    category: 'symptom',
  },
  {
    id: 't2',
    title: '持续时间',
    content: '这个症状已经持续了【时间】，',
    category: 'duration',
  },
  {
    id: 't3',
    title: '严重程度',
    content: '症状的严重程度：【轻度/中度/重度】，',
    category: 'severity',
  },
  {
    id: 't4',
    title: '伴随症状',
    content: '同时还伴有【其他症状】',
    category: 'symptom',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    type: 'text',
    sender: 'doctor',
    content: '您好，我是您的私人医生张伟。请问您哪里不舒服？',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'm2',
    type: 'text',
    sender: 'ai',
    content:
      '💡 AI助手提示：为了更准确地帮助您，建议您描述以下信息：\n1. 主要症状是什么？\n2. 症状持续多久了？\n3. 有没有伴随症状？\n4. 之前是否看过医生或吃过药？',
    timestamp: new Date(Date.now() - 3500000),
  },
];

const DoctorChatScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { doctorId, doctorName, doctorAvatar } = route.params || {
    doctorId: 'doctor_001',
    doctorName: '张伟医生',
    doctorAvatar: 'https://via.placeholder.com/100',
  };

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = (content: string, type: Message['type'] = 'text') => {
    if (!content.trim() && type === 'text') return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      type,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      simulateDoctorResponse(content);
    }, 2000);
  };

  const simulateDoctorResponse = (userMessage: string) => {
    const responses = [
      '我了解您的情况了。根据您的描述，这可能是...',
      '建议您注意休息，多喝水。如果症状持续，建议来院检查。',
      '我需要更详细了解您的情况。请问您目前有在服用其他药物吗？',
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const doctorMessage: Message = {
      id: `m_${Date.now()}`,
      type: 'text',
      sender: 'doctor',
      content: randomResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, doctorMessage]);
  };

  const handleQuickTemplateSelect = (template: QuickTemplate) => {
    setInputText((prev) => prev + template.content);
    setShowQuickTemplates(false);
    inputRef.current?.focus();
  };

  const handleImageUpload = () => {
    setShowAttachmentMenu(false);
    Alert.alert('上传照片', '选择症状照片或化验单', [
      {
        text: '拍照',
        onPress: () => {
          // Camera functionality
          const imageMessage: Message = {
            id: `m_${Date.now()}`,
            type: 'image',
            sender: 'user',
            content: '已上传症状照片',
            timestamp: new Date(),
            imageUrl: 'https://via.placeholder.com/300',
          };
          setMessages((prev) => [...prev, imageMessage]);
        },
      },
      {
        text: '从相册选择',
        onPress: () => {
          // Image picker functionality
          const imageMessage: Message = {
            id: `m_${Date.now()}`,
            type: 'image',
            sender: 'user',
            content: '已上传化验单',
            timestamp: new Date(),
            imageUrl: 'https://via.placeholder.com/300',
          };
          setMessages((prev) => [...prev, imageMessage]);
        },
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleDocumentUpload = () => {
    setShowAttachmentMenu(false);
    // Simulate document upload
    Alert.alert('成功', '化验单已上传');
    const docMessage: Message = {
      id: `m_${Date.now()}`,
      type: 'image',
      sender: 'user',
      content: '已上传化验报告',
      timestamp: new Date(),
      imageUrl: 'https://via.placeholder.com/300x400',
    };
    setMessages((prev) => [...prev, docMessage]);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        // Simulate recording completion
        setIsRecording(false);
        const voiceMessage: Message = {
          id: `m_${Date.now()}`,
          type: 'voice',
          sender: 'user',
          content: '语音消息',
          timestamp: new Date(),
          voiceDuration: 15,
        };
        setMessages((prev) => [...prev, voiceMessage]);
      }, 3000);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const isAI = message.sender === 'ai';

    return (
      <View
        key={message.id}
        paddingHorizontal="$4"
        paddingVertical="$2"
        alignItems={isUser ? 'flex-end' : 'flex-start'}
      >
        <XStack
          space="$2"
          maxWidth="80%"
          flexDirection={isUser ? 'row-reverse' : 'row'}
        >
          {!isUser && (
            <Avatar circular size="$3">
              <Avatar.Image src={isAI ? undefined : doctorAvatar} />
              <Avatar.Fallback backgroundColor="$blue8">
                <Text color="white">{isAI ? 'AI' : '医'}</Text>
              </Avatar.Fallback>
            </Avatar>
          )}

          <YStack
            flex={1}
            space="$1"
            alignItems={isUser ? 'flex-end' : 'flex-start'}
          >
            {/* Message Content */}
            {message.type === 'text' && (
              <View
                backgroundColor={
                  isAI ? '#FFF4E6' : isUser ? COLORS.primary : '#F5F5F5'
                }
                padding="$3"
                borderRadius="$4"
                maxWidth="100%"
              >
                <Text
                  fontSize={15}
                  color={isUser ? 'white' : COLORS.text}
                  lineHeight={22}
                >
                  {message.content}
                </Text>
              </View>
            )}

            {message.type === 'image' && (
              <TouchableOpacity>
                <View borderRadius="$3" overflow="hidden">
                  <Image
                    source={{ uri: message.imageUrl }}
                    style={{ width: 200, height: 200 }}
                    resizeMode="cover"
                  />
                  <Text
                    fontSize={12}
                    color="$gray11"
                    marginTop="$1"
                    paddingHorizontal="$2"
                  >
                    {message.content}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {message.type === 'voice' && (
              <View
                backgroundColor={isUser ? COLORS.primary : '#F5F5F5'}
                padding="$3"
                borderRadius="$4"
                minWidth={150}
              >
                <XStack space="$2" alignItems="center">
                  <Mic size={20} color={isUser ? 'white' : COLORS.text} />
                  <Text
                    fontSize={14}
                    color={isUser ? 'white' : COLORS.text}
                    flex={1}
                  >
                    语音消息 {message.voiceDuration}"
                  </Text>
                </XStack>
              </View>
            )}

            {message.type === 'prescription' && message.prescriptionData && (
              <View
                backgroundColor="#E8F5E9"
                padding="$4"
                borderRadius="$4"
                borderWidth={1}
                borderColor="#4CAF50"
                width="100%"
              >
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="$2"
                >
                  <Text fontSize={16} fontWeight="600" color="#2E7D32">
                    电子处方
                  </Text>
                  <TouchableOpacity>
                    <Download size={20} color="#2E7D32" />
                  </TouchableOpacity>
                </XStack>
                {message.prescriptionData.medications.map((med, idx) => (
                  <YStack
                    key={idx}
                    padding="$2"
                    backgroundColor="white"
                    borderRadius="$2"
                    marginBottom="$2"
                  >
                    <Text fontSize={15} fontWeight="600">
                      {med.name}
                    </Text>
                    <Text fontSize={13} color="$gray11">
                      {med.dosage} · {med.frequency} · {med.duration}
                    </Text>
                  </YStack>
                ))}
                {message.prescriptionData.notes && (
                  <Text fontSize={13} color="$gray11" marginTop="$2">
                    医嘱：{message.prescriptionData.notes}
                  </Text>
                )}
              </View>
            )}

            {message.type === 'checkup' && message.checkupData && (
              <TouchableOpacity
                onPress={() => {
                  // Navigate to booking screen
                  if (message.checkupData?.appointmentLink) {
                    navigation.navigate('BookConsultation');
                  }
                }}
              >
                <View
                  backgroundColor="#E3F2FD"
                  padding="$4"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="#2196F3"
                  width="100%"
                >
                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom="$2"
                  >
                    <Text fontSize={16} fontWeight="600" color="#1976D2">
                      检查建议
                    </Text>
                    <ChevronRight size={20} color="#1976D2" />
                  </XStack>
                  <Text fontSize={15} fontWeight="500" marginBottom="$1">
                    {message.checkupData.title}
                  </Text>
                  <Text fontSize={13} color="$gray11">
                    {message.checkupData.description}
                  </Text>
                  {message.checkupData.appointmentLink && (
                    <Text fontSize={13} color="#2196F3" marginTop="$2">
                      点击预约检查 →
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {message.type === 'referral' && message.referralData && (
              <View
                backgroundColor="#FFF3E0"
                padding="$4"
                borderRadius="$4"
                borderWidth={1}
                borderColor="#FF9800"
                width="100%"
              >
                <Text fontSize={16} fontWeight="600" color="#E65100" marginBottom="$2">
                  转诊推荐
                </Text>
                <YStack space="$1">
                  <Text fontSize={14}>
                    <Text fontWeight="600">科室：</Text>
                    {message.referralData.department}
                  </Text>
                  <Text fontSize={14}>
                    <Text fontWeight="600">专家：</Text>
                    {message.referralData.specialist}
                  </Text>
                  <Text fontSize={13} color="$gray11" marginTop="$2">
                    {message.referralData.reason}
                  </Text>
                </YStack>
              </View>
            )}

            {/* Timestamp */}
            <Text fontSize={11} color="$gray10" paddingHorizontal="$2">
              {message.timestamp.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </YStack>
        </XStack>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View
          backgroundColor="$background"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          padding="$4"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text fontSize={16} color={COLORS.primary}>
                返回
              </Text>
            </TouchableOpacity>
            <YStack alignItems="center">
              <Text fontSize={17} fontWeight="600">
                {doctorName}
              </Text>
              <Text fontSize={12} color="$gray11">
                承诺30分钟内回复
              </Text>
            </YStack>
            <View width={40} />
          </XStack>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {messages.map((message) => renderMessage(message))}
        </ScrollView>

        {/* Quick Templates */}
        {showQuickTemplates && (
          <View
            backgroundColor="#F8F9FA"
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize={14} fontWeight="600">
                快速模板
              </Text>
              <TouchableOpacity onPress={() => setShowQuickTemplates(false)}>
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </XStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack space="$2">
                {QUICK_TEMPLATES.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    onPress={() => handleQuickTemplateSelect(template)}
                  >
                    <View
                      backgroundColor="white"
                      padding="$3"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor="$borderColor"
                    >
                      <Text fontSize={13} color={COLORS.text}>
                        {template.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </ScrollView>
          </View>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <View
            backgroundColor="white"
            paddingVertical="$3"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <XStack justifyContent="space-around" paddingHorizontal="$4">
              <TouchableOpacity onPress={handleImageUpload}>
                <YStack alignItems="center" space="$1">
                  <View
                    width={56}
                    height={56}
                    backgroundColor="#E3F2FD"
                    borderRadius={28}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Camera size={28} color="#2196F3" />
                  </View>
                  <Text fontSize={12} color="$gray11">
                    症状照片
                  </Text>
                </YStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDocumentUpload}>
                <YStack alignItems="center" space="$1">
                  <View
                    width={56}
                    height={56}
                    backgroundColor="#E8F5E9"
                    borderRadius={28}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FileText size={28} color="#4CAF50" />
                  </View>
                  <Text fontSize={12} color="$gray11">
                    化验单
                  </Text>
                </YStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowQuickTemplates(true)}>
                <YStack alignItems="center" space="$1">
                  <View
                    width={56}
                    height={56}
                    backgroundColor="#FFF3E0"
                    borderRadius={28}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={24}>📋</Text>
                  </View>
                  <Text fontSize={12} color="$gray11">
                    快速模板
                  </Text>
                </YStack>
              </TouchableOpacity>
            </XStack>
          </View>
        )}

        {/* Input Area */}
        <View
          backgroundColor="$background"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          padding="$3"
        >
          <XStack space="$2" alignItems="center">
            <TouchableOpacity
              onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <View
                width={36}
                height={36}
                backgroundColor="$gray3"
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
              >
                {showAttachmentMenu ? (
                  <X size={20} color={COLORS.text} />
                ) : (
                  <Plus size={20} color={COLORS.text} />
                )}
              </View>
            </TouchableOpacity>

            <View
              flex={1}
              backgroundColor="$gray2"
              borderRadius="$5"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <RNTextInput
                ref={inputRef}
                value={inputText}
                onChangeText={setInputText}
                placeholder="输入消息..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                style={{
                  fontSize: 15,
                  color: COLORS.text,
                  maxHeight: 80,
                }}
              />
            </View>

            {inputText.trim() ? (
              <TouchableOpacity onPress={() => sendMessage(inputText)}>
                <View
                  width={36}
                  height={36}
                  backgroundColor={COLORS.primary}
                  borderRadius={18}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Send size={18} color="white" />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleVoiceRecord}>
                <View
                  width={36}
                  height={36}
                  backgroundColor={isRecording ? '#FF5252' : '$gray3'}
                  borderRadius={18}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Mic size={20} color={isRecording ? 'white' : COLORS.text} />
                </View>
              </TouchableOpacity>
            )}
          </XStack>

          {isRecording && (
            <Text
              fontSize={12}
              color="#FF5252"
              textAlign="center"
              marginTop="$2"
            >
              正在录音... 点击停止
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DoctorChatScreen;
