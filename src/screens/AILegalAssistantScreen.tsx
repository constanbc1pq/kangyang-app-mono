/**
 * AI法律助手页面
 * 提供智能法律咨询和问答服务
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
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

  // 常见问题库
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

  // 常见问题快捷入口
  const quickQuestions = [
    '如何订立有效的遗嘱？',
    '子女不赡养怎么办？',
    '老人房产如何处理？',
    '再婚财产如何约定？',
    '意定监护是什么？',
    '如何防范养老诈骗？',
  ];

  useEffect(() => {
    // 滚动到底部
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // 发送消息
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

    // 模拟AI回复
    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  // 生成AI回复（模拟）
  const generateAIResponse = (question: string): Message => {
    // 关键词匹配
    const matchedFAQ = faqs.find(faq =>
      faq.keywords.some(keyword => question.includes(keyword))
    );

    if (matchedFAQ) {
      return {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: matchedFAQ.answer,
        timestamp: new Date().toISOString(),
        suggestions: [
          '我还想了解更多',
          '咨询专业律师',
          '查看相关案例',
        ],
      };
    }

    // 案例匹配（模拟）
    const relatedCases: RelatedCase[] = question.includes('遗嘱') || question.includes('继承')
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

    // 默认回复
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

  // 快速提问
  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  // 点击建议
  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === '咨询专业律师') {
      navigation.navigate('LawyerList' as never);
    } else if (suggestion === '查看相关案例') {
      // TODO: 跳转到案例库
    } else if (suggestion === '查看维权流程') {
      // TODO: 显示维权流程
    } else {
      setInputText(suggestion);
    }
  };

  // 查看案例详情
  const handleCaseClick = (caseItem: RelatedCase) => {
    // TODO: 跳转到案例详情页面
    console.log('View case:', caseItem.id);
  };

  // 渲染消息
  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';

    return (
      <View
        key={message.id}
        style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="chatbubbles" size={24} color="#1890ff" />
          </View>
        )}

        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.content}
          </Text>

          {/* 相关案例 */}
          {message.relatedCases && message.relatedCases.length > 0 && (
            <View style={styles.relatedCasesContainer}>
              <Text style={styles.relatedCasesTitle}>相关案例：</Text>
              {message.relatedCases.map(caseItem => (
                <TouchableOpacity
                  key={caseItem.id}
                  style={styles.caseCard}
                  onPress={() => handleCaseClick(caseItem)}
                >
                  <Text style={styles.caseTitle}>{caseItem.title}</Text>
                  <Text style={styles.caseSummary}>{caseItem.summary}</Text>
                  <Text style={styles.caseSimilarity}>
                    相似度：{(caseItem.similarity * 100).toFixed(0)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 建议操作 */}
          {message.suggestions && message.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {message.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionClick(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={24} color="#999" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* 顶部提示 */}
      <View style={styles.header}>
        <Ionicons name="information-circle-outline" size={20} color="#1890ff" />
        <Text style={styles.headerText}>
          AI助手可以帮您初步了解法律问题，如需专业建议请咨询律师
        </Text>
      </View>

      {/* 消息列表 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}

        {isTyping && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <View style={styles.avatarContainer}>
              <Ionicons name="chatbubbles" size={24} color="#1890ff" />
            </View>
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}

        {/* 快捷问题 */}
        {messages.length === 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>您可能想问：</Text>
            <View style={styles.quickQuestionsList}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                >
                  <Ionicons name="help-circle-outline" size={16} color="#1890ff" />
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 输入框 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="输入您的法律问题..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LawyerList' as never)}
          >
            <Ionicons name="people-outline" size={18} color="#1890ff" />
            <Text style={styles.actionButtonText}>咨询律师</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={18} color="#1890ff" />
            <Text style={styles.actionButtonText}>查看案例</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
    padding: 12,
  },
  headerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    lineHeight: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 12,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#1890ff',
  },
  assistantBubble: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  relatedCasesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  relatedCasesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  caseCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  caseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  caseSummary: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  caseSimilarity: {
    fontSize: 11,
    color: '#1890ff',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#e6f7ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: '#1890ff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1890ff',
  },
  quickQuestionsContainer: {
    marginTop: 20,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickQuestionsList: {},
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    padding: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  inputActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#1890ff',
    marginLeft: 4,
  },
});

export default AILegalAssistantScreen;
