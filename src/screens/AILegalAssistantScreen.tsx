/**
 * AI法律助手页面
 * 提供智能法律咨询和问答服务
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MessageCircle,
  User,
  Send,
  Users,
  FileText,
  HelpCircle,
  Info,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TitleBar } from '@/components/TitleBar';

const GOLD_COLOR = '#D4AF37';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  relatedCases?: RelatedCase[];
}

interface RelatedCase {
  id: string;
  title: string;
  summary: string;
  similarity: number;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

const AILegalAssistantScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content:
        '您好！我是AI法律助手，专注为中老年人提供法律咨询服务。\n\n我可以帮您解答关于遗嘱继承、赡养纠纷、房产处理、婚姻家庭等方面的法律问题。\n\n请问有什么可以帮您的？',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const faqs: FAQ[] = [
    {
      id: 'faq_1',
      category: '遗嘱继承',
      question: '自书遗嘱需要什么条件才有效？',
      answer:
        '自书遗嘱需要满足以下条件才有效：\n\n1. 必须由立遗嘱人亲笔书写全部内容\n2. 必须注明年、月、日\n3. 必须由立遗嘱人签名\n4. 立遗嘱人必须具有完全民事行为能力\n5. 遗嘱内容必须是立遗嘱人的真实意思表示\n\n建议您在订立遗嘱后进行公证，以增强法律效力。',
      keywords: ['自书遗嘱', '遗嘱', '有效', '条件'],
    },
    {
      id: 'faq_2',
      category: '赡养纠纷',
      question: '子女不赡养老人怎么办？',
      answer:
        '如果子女不履行赡养义务，您可以采取以下措施：\n\n1. 协商解决：先尝试与子女沟通\n2. 调解：向居委会、村委会或调解组织申请调解\n3. 起诉：向法院提起赡养费纠纷诉讼\n\n法律依据：\n根据《民法典》规定，成年子女对父母负有赡养、扶助和保护的义务。子女不履行赡养义务的，缺乏劳动能力或者生活困难的父母，有要求成年子女给付赡养费的权利。\n\n建议您保留相关证据（如聊天记录、证人证言等），必要时可委托律师代理。',
      keywords: ['赡养', '子女', '不赡养', '赡养费'],
    },
    {
      id: 'faq_3',
      category: '房产纠纷',
      question: '老人房产可以过户给孙子女吗？',
      answer:
        '可以。老人的房产可以通过以下方式过户给孙子女：\n\n1. 买卖：签订房屋买卖合同，办理过户手续\n2. 赠与：签订赠与合同，到公证处公证后办理过户\n3. 遗嘱继承：在遗嘱中指定孙子女为继承人\n\n注意事项：\n• 如果子女（孙子女的父母）健在，直接赠与孙子女可能涉及较高税费\n• 建议咨询专业律师或税务师，选择最优方案\n• 赠与或买卖后，老人将失去房产所有权，需慎重考虑',
      keywords: ['房产', '过户', '孙子', '孙女'],
    },
    {
      id: 'faq_4',
      category: '婚姻家庭',
      question: '再婚后如何保护各自子女的继承权？',
      answer:
        '再婚家庭可以通过以下方式保护各自子女的继承权：\n\n1. 婚前财产协议：\n   明确婚前财产归属，约定婚后各自财产分配\n\n2. 订立遗嘱：\n   在遗嘱中明确财产继承安排，指定各自子女为继承人\n\n3. 意定监护：\n   指定信任的人作为监护人，防止失能后财产被侵占\n\n4. 家族信托：\n   对于高净值家庭，可设立家族信托保护财产\n\n建议在婚前就做好财产规划，并进行公证以确保法律效力。',
      keywords: ['再婚', '继承', '子女', '保护'],
    },
  ];

  const quickQuestions = [
    '如何订立有效的遗嘱？',
    '子女不赡养怎么办？',
    '老人房产如何处理？',
    '再婚财产如何约定？',
    '意定监护是什么？',
    '如何防范养老诈骗？',
  ];

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): Message => {
    const matchedFAQ = faqs.find(faq =>
      faq.keywords.some(keyword => question.includes(keyword))
    );

    if (matchedFAQ) {
      return {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: matchedFAQ.answer,
        timestamp: new Date().toISOString(),
        suggestions: ['我还想了解更多', '咨询专业律师', '查看相关案例'],
      };
    }

    const relatedCases: RelatedCase[] =
      question.includes('遗嘱') || question.includes('继承')
        ? [
            {
              id: 'case_1',
              title: '王某遗嘱继承纠纷案',
              summary: '本案中，法院认定自书遗嘱因缺少日期而无效...',
              similarity: 0.85,
            },
            {
              id: 'case_2',
              title: '李某遗产分配案',
              summary: '老人立有遗嘱，法院判决按遗嘱内容分配...',
              similarity: 0.78,
            },
          ]
        : [];

    return {
      id: `assistant_${Date.now()}`,
      type: 'assistant',
      content:
        '感谢您的提问。根据您描述的情况，我建议：\n\n1. 首先了解相关法律规定\n2. 收集和保留相关证据\n3. 尝试协商解决\n4. 必要时寻求专业律师帮助\n\n如果您需要更详细的法律建议，建议咨询专业律师，我可以为您推荐合适的律师。',
      timestamp: new Date().toISOString(),
      suggestions: ['咨询专业律师', '查看维权流程', '了解相关法律'],
      relatedCases: relatedCases.length > 0 ? relatedCases : undefined,
    };
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === '咨询专业律师') {
      navigation.navigate('LawyerList' as never);
    } else {
      setInputText(suggestion);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';

    return (
      <XStack
        key={message.id}
        marginBottom="$2.5"
        alignItems="flex-end"
        justifyContent={isUser ? 'flex-end' : 'flex-start'}
      >
        {!isUser && (
          <View
            width={32}
            height={32}
            marginRight="$2"
            borderRadius={16}
            backgroundColor="$color4"
            justifyContent="center"
            alignItems="center"
          >
            <MessageCircle size={18} color={primaryColor} />
          </View>
        )}

        <View
          maxWidth="75%"
          borderRadius="$4"
          padding="$2"
          backgroundColor={isUser ? '$primary' : '$color2'}
          borderWidth={isUser ? 0 : 1}
          borderColor="$color5"
        >
          <Text
            fontSize="$3"
            color={isUser ? 'white' : '$color12'}
            lineHeight={20}
          >
            {message.content}
          </Text>

          {message.relatedCases && message.relatedCases.length > 0 && (
            <YStack marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$color5">
              <Text fontSize="$2" fontWeight="600" color="$color12" marginBottom="$1">
                相关案例：
              </Text>
              {message.relatedCases.map(caseItem => (
                <Pressable key={caseItem.id}>
                  <View
                    backgroundColor="$color4"
                    borderRadius="$2"
                    padding="$1.5"
                    marginBottom="$1"
                  >
                    <Text fontSize="$2" fontWeight="600" color="$color12" marginBottom="$0.5">
                      {caseItem.title}
                    </Text>
                    <Text fontSize="$1" color="$color10" lineHeight={16}>
                      {caseItem.summary}
                    </Text>
                    <Text fontSize={10} color="$primary" marginTop="$0.5">
                      相似度：{(caseItem.similarity * 100).toFixed(0)}%
                    </Text>
                  </View>
                </Pressable>
              ))}
            </YStack>
          )}

          {message.suggestions && message.suggestions.length > 0 && (
            <XStack flexWrap="wrap" marginTop="$2" gap="$1">
              {message.suggestions.map((suggestion, index) => (
                <Pressable key={index} onPress={() => handleSuggestionClick(suggestion)}>
                  <View
                    backgroundColor="$color4"
                    borderRadius="$10"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                  >
                    <Text fontSize="$1" color="$primary">{suggestion}</Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          )}
        </View>

        {isUser && (
          <View
            width={32}
            height={32}
            marginLeft="$2"
            borderRadius={16}
            backgroundColor="$color4"
            justifyContent="center"
            alignItems="center"
          >
            <User size={18} color={color10} />
          </View>
        )}
      </XStack>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View flex={1} backgroundColor="$background">
        {/* TitleBar */}
        <TitleBar title="AI法律助手" onBack={() => navigation.goBack()} />

        {/* Header Tip */}
        <XStack
          backgroundColor="$color4"
          padding="$2"
          alignItems="center"
          gap="$1"
        >
          <Info size={18} color={primaryColor} />
          <Text fontSize="$2" color="$color10" flex={1}>
            AI助手可以帮您初步了解法律问题，如需专业建议请咨询律师
          </Text>
        </XStack>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef as any}
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {messages.map(renderMessage)}

          {isTyping && (
            <XStack marginBottom="$2.5" alignItems="flex-end">
              <View
                width={32}
                height={32}
                marginRight="$2"
                borderRadius={16}
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                <MessageCircle size={18} color={primaryColor} />
              </View>
              <View
                backgroundColor="$color2"
                borderRadius="$4"
                padding="$2"
                borderWidth={1}
                borderColor="$color5"
              >
                <XStack gap="$1">
                  <View width={8} height={8} borderRadius={4} backgroundColor="$primary" />
                  <View width={8} height={8} borderRadius={4} backgroundColor="$primary" />
                  <View width={8} height={8} borderRadius={4} backgroundColor="$primary" />
                </XStack>
              </View>
            </XStack>
          )}

          {messages.length === 1 && (
            <YStack marginTop="$3">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
                您可能想问：
              </Text>
              <YStack gap="$2">
                {quickQuestions.map((question, index) => (
                  <Pressable key={index} onPress={() => handleQuickQuestion(question)}>
                    <XStack
                      backgroundColor="$color2"
                      borderRadius="$3"
                      padding="$2"
                      borderWidth={1}
                      borderColor="$color5"
                      alignItems="center"
                      gap="$2"
                    >
                      <HelpCircle size={18} color={primaryColor} />
                      <Text fontSize="$3" color="$color12">{question}</Text>
                    </XStack>
                  </Pressable>
                ))}
              </YStack>
            </YStack>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          backgroundColor="$color2"
          borderTopWidth={1}
          borderTopColor="$color5"
          paddingHorizontal="$2.5"
          paddingVertical="$2"
          paddingBottom={insets.bottom + 8}
        >
          <XStack
            backgroundColor="$color4"
            borderRadius="$10"
            paddingHorizontal="$2.5"
            paddingVertical="$1.5"
            alignItems="flex-end"
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 14,
                color: theme.color12?.val,
                maxHeight: 100,
                paddingVertical: 8,
              }}
              placeholder="输入您的法律问题..."
              placeholderTextColor={theme.color10?.val}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable onPress={handleSend}>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
                marginLeft="$2"
              >
                <Send size={18} color="white" />
              </View>
            </Pressable>
          </XStack>

          <XStack marginTop="$2" gap="$3">
            <Pressable onPress={() => navigation.navigate('LawyerList' as never)}>
              <XStack alignItems="center" gap="$0.5">
                <Users size={16} color={primaryColor} />
                <Text fontSize="$2" color="$primary">咨询律师</Text>
              </XStack>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('CaseLibrary' as never)}>
              <XStack alignItems="center" gap="$0.5">
                <FileText size={16} color={primaryColor} />
                <Text fontSize="$2" color="$primary">查看案例</Text>
              </XStack>
            </Pressable>
          </XStack>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AILegalAssistantScreen;
