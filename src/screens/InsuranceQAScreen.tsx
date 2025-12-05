import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, TextInput, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  TrendingUp,
  Clock,
  MessageCircle,
  ThumbsUp,
  Award,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';

// 问题分类
type QuestionCategory = 'all' | 'product' | 'claim' | 'underwriting';

// 排序类型
type SortType = 'hot' | 'latest' | 'unanswered';

interface Question {
  id: string;
  title: string;
  content: string;
  category: QuestionCategory;
  askerName: string;
  askTime: string;
  viewCount: number;
  likeCount: number;
  answerCount: number;
  isAnswered: boolean;
  isFeatured: boolean; // 精华问题
  tags: string[];
  bestAnswer?: {
    advisorName: string;
    advisorTitle: string;
    content: string;
    likeCount: number;
  };
}

const InsuranceQAScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('all');
  const [sortType, setSortType] = useState<SortType>('hot');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 分类配置
  const categories = [
    { id: 'all', label: '全部', icon: HelpCircle },
    { id: 'product', label: '产品咨询', icon: MessageCircle },
    { id: 'claim', label: '理赔求助', icon: AlertCircle },
    { id: 'underwriting', label: '投保疑问', icon: CheckCircle },
  ];

  // 排序配置
  const sortOptions = [
    { id: 'hot', label: '热门', icon: TrendingUp },
    { id: 'latest', label: '最新', icon: Clock },
    { id: 'unanswered', label: '待解答', icon: MessageCircle },
  ];

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, sortType, searchQuery]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock数据
      const mockQuestions: Question[] = [
        {
          id: 'q_001',
          title: '50岁还能买重疾险吗？有什么注意事项？',
          content: '我今年50岁，身体还算健康，想给自己买份重疾险。但听说年龄大了不好买，保费也贵。请问还能买吗？有什么需要注意的？',
          category: 'product',
          askerName: '张女士',
          askTime: '2024-01-15',
          viewCount: 1523,
          likeCount: 45,
          answerCount: 3,
          isAnswered: true,
          isFeatured: true,
          tags: ['重疾险', '中老年投保', '年龄限制'],
          bestAnswer: {
            advisorName: '李明',
            advisorTitle: 'CFP持证人 | 8年从业经验',
            content: '50岁可以买重疾险，但确实需要注意几点：\n\n1. **健康告知更严格**：年龄越大，健康要求越高，需要如实告知所有病史\n2. **保费较高**：50岁的保费是30岁的2-3倍，建议保额30-50万即可\n3. **选择合适产品**：优先考虑防癌险，健康要求较宽松\n4. **注意等待期**：重疾险一般有90-180天等待期\n\n建议先做个健康测评，如果有三高等慢性病，可以考虑惠民保或税优健康险作为补充。',
            likeCount: 38,
          },
        },
        {
          id: 'q_002',
          title: '医疗险理赔需要准备哪些材料？',
          content: '父亲最近住院了，想申请医疗险理赔，但不知道需要准备什么材料。有没有详细的清单？',
          category: 'claim',
          askerName: '王先生',
          askTime: '2024-01-14',
          viewCount: 892,
          likeCount: 23,
          answerCount: 2,
          isAnswered: true,
          isFeatured: false,
          tags: ['医疗险', '理赔材料', '住院'],
          bestAnswer: {
            advisorName: '赵敏',
            advisorTitle: '理赔顾问 | 协助理赔500+案例',
            content: '医疗险理赔通常需要以下材料：\n\n**基础材料：**\n1. 身份证复印件\n2. 保单复印件\n3. 银行卡复印件\n\n**医疗材料：**\n1. 诊断证明书（医院盖章）\n2. 住院病历（出院小结）\n3. 医疗费用发票（原件）\n4. 费用明细清单\n5. 检查报告（如有）\n\n**注意事项：**\n- 所有材料需加盖医院公章\n- 发票需要原件（社保报销后提供分割单）\n- 建议拍照留底，防止遗失\n\n提交后一般3-5个工作日到账。',
            likeCount: 28,
          },
        },
        {
          id: 'q_003',
          title: '投保时体检发现结节，还能买保险吗？',
          content: '最近体检发现甲状腺结节，医生说良性的，建议观察。这种情况还能买重疾险和医疗险吗？',
          category: 'underwriting',
          askerName: '刘女士',
          askTime: '2024-01-13',
          viewCount: 2156,
          likeCount: 67,
          answerCount: 4,
          isAnswered: true,
          isFeatured: true,
          tags: ['健康告知', '甲状腺结节', '核保'],
          bestAnswer: {
            advisorName: '陈强',
            advisorTitle: 'AFP持证人 | 核保专家',
            content: '甲状腺结节是常见问题，能否投保主要看结节分级：\n\n**TI-RADS分级对应结果：**\n- **1-2级**：标准体承保，不影响投保\n- **3级**：大部分产品可以除外承保（甲状腺相关疾病不赔）\n- **4级及以上**：一般拒保或延期\n\n**建议操作：**\n1. 准备好体检报告（含超声报告）\n2. 尝试多家公司智能核保\n3. 优先选择对结节宽松的产品\n4. 如果只是3级，还可以买防癌险\n\n重要提示：一定要如实告知，不要隐瞒，否则影响后续理赔。',
            likeCount: 59,
          },
        },
        {
          id: 'q_004',
          title: '年金险真的能养老吗？收益怎么样？',
          content: '保险公司一直推荐年金险，说可以养老，但我算了一下收益好像不高。请问年金险真的适合养老规划吗？',
          category: 'product',
          askTime: '2024-01-12',
          askerName: '孙先生',
          viewCount: 1789,
          likeCount: 41,
          answerCount: 0,
          isAnswered: false,
          isFeatured: false,
          tags: ['年金险', '养老规划', '收益'],
        },
        {
          id: 'q_005',
          title: '百万医疗险和惠民保有什么区别？',
          content: '看到很多地方都在推惠民保，一年才几十块钱。和百万医疗险比有什么区别？该买哪个？',
          category: 'product',
          askerName: '周女士',
          askTime: '2024-01-11',
          viewCount: 3245,
          likeCount: 89,
          answerCount: 5,
          isAnswered: true,
          isFeatured: true,
          tags: ['百万医疗', '惠民保', '产品对比'],
          bestAnswer: {
            advisorName: '吴洋',
            advisorTitle: '保险规划师 | 产品测评专家',
            content: '两者都是医疗险，但差别很大：\n\n**百万医疗险：**\n✓ 保障更全面（住院、门诊、特殊门诊）\n✓ 报销比例高（100%报销）\n✓ 增值服务多（就医绿通、医疗垫付）\n✗ 有健康要求，不是人人能买\n✗ 价格较高（30岁约300元/年，60岁约1500元/年）\n\n**惠民保：**\n✓ 价格便宜（几十到百元）\n✓ 无健康要求，带病也能投保\n✗ 免赔额高（一般2万起）\n✗ 报销比例低（50-80%）\n✗ 保障范围有限\n\n**建议：**\n身体健康首选百万医疗险，惠民保作为补充；有既往病史买不了百万医疗，可以选惠民保。',
            likeCount: 76,
          },
        },
      ];

      // 筛选和排序
      let filtered = mockQuestions;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(q => q.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        filtered = filtered.filter(
          q =>
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.tags.some(tag => tag.includes(searchQuery))
        );
      }

      // 排序
      if (sortType === 'hot') {
        filtered.sort((a, b) => b.viewCount - a.viewCount);
      } else if (sortType === 'latest') {
        filtered.sort((a, b) => b.askTime.localeCompare(a.askTime));
      } else if (sortType === 'unanswered') {
        filtered = filtered.filter(q => !q.isAnswered);
      }

      setQuestions(filtered);
    } catch (error) {
      console.error('加载问题失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadQuestions();
  };

  const handleQuestionPress = (question: Question) => {
    console.log('查看问题:', question.title);
    // navigation.navigate('InsuranceQADetail' as never, { questionId: question.id } as never);
  };

  const handleAskQuestion = () => {
    console.log('提问');
    // navigation.navigate('InsuranceAskQuestion' as never);
  };

  const renderQuestionCard = (question: Question) => {
    const categoryConfig = categories.find(c => c.id === question.category);

    return (
      <Pressable key={question.id} onPress={() => handleQuestionPress(question)}>
        <View
          marginBottom="$2"
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          padding="$2"
        >
          {/* 顶部标签 */}
          <XStack alignItems="center" gap="$2" marginBottom="$2">
            {question.isFeatured && (
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                backgroundColor={`${warningColor}15`}
                borderRadius="$10"
              >
                <XStack alignItems="center" gap="$1">
                  <Award size={12} color={warningColor} />
                  <Text fontSize="$1" fontWeight="600" color={warningColor}>
                    精华
                  </Text>
                </XStack>
              </View>
            )}
            {categoryConfig && (
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                backgroundColor="$color4"
                borderRadius="$10"
              >
                <Text fontSize="$1" color="$color10">
                  {categoryConfig.label}
                </Text>
              </View>
            )}
            {question.isAnswered && (
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                backgroundColor={`${successColor}15`}
                borderRadius="$10"
              >
                <XStack alignItems="center" gap="$1">
                  <CheckCircle size={12} color={successColor} />
                  <Text fontSize="$1" fontWeight="600" color={successColor}>
                    已解答
                  </Text>
                </XStack>
              </View>
            )}
          </XStack>

          {/* 问题标题 */}
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2" lineHeight={24}>
            {question.title}
          </Text>

          {/* 问题内容预览 */}
          <Text
            fontSize="$3"
            color="$color10"
            lineHeight={22}
            marginBottom="$2"
            numberOfLines={2}
          >
            {question.content}
          </Text>

          {/* 标签 */}
          <XStack gap="$2" marginBottom="$2" flexWrap="wrap">
            {question.tags.map(tag => (
              <View
                key={tag}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                backgroundColor="$color4"
                borderRadius="$10"
              >
                <Text fontSize="$1" color="$color10">
                  #{tag}
                </Text>
              </View>
            ))}
          </XStack>

          {/* 最佳答案预览 */}
          {question.bestAnswer && (
            <View
              padding="$2"
              backgroundColor={`${primaryColor}10`}
              borderRadius="$4"
              borderLeftWidth={3}
              borderLeftColor={primaryColor}
              marginBottom="$2"
            >
              <XStack alignItems="center" gap="$2" marginBottom="$2">
                <Award size={14} color={primaryColor} />
                <Text fontSize="$2" fontWeight="600" color="$primary">
                  最佳答案
                </Text>
                <Text fontSize="$2" color="$color10">
                  · {question.bestAnswer.advisorName}
                </Text>
              </XStack>
              <Text fontSize="$2" color="$color12" lineHeight={20} numberOfLines={3}>
                {question.bestAnswer.content}
              </Text>
            </View>
          )}

          {/* 底部信息 */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$3">
              <XStack alignItems="center" gap="$1">
                <MessageCircle size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {question.answerCount}
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <ThumbsUp size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {question.likeCount}
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$2" color="$color10">
                  {question.viewCount} 浏览
                </Text>
              </XStack>
            </XStack>
            <Text fontSize="$2" color="$color10">
              {question.askTime}
            </Text>
          </XStack>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            保险问答
          </Text>
          <Pressable onPress={handleAskQuestion}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <Plus size={24} color={primaryColor} />
            </View>
          </Pressable>
        </XStack>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 搜索框 */}
        <View padding="$2.5" paddingBottom="$2">
          <View
            backgroundColor="$color4"
            borderRadius="$10"
            paddingHorizontal="$3"
            height={44}
          >
            <XStack alignItems="center" gap="$2" height="100%">
              <Search size={20} color={color10} />
              <TextInput
                placeholder="搜索问题或标签"
                placeholderTextColor={color10}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: color12,
                  padding: 0,
                }}
              />
            </XStack>
          </View>
        </View>

        {/* 排序标签 */}
        <XStack paddingHorizontal="$2.5" gap="$2" marginBottom="$2">
          {sortOptions.map(option => {
            const Icon = option.icon;
            const isActive = sortType === option.id;
            return (
              <Pressable key={option.id} onPress={() => setSortType(option.id as SortType)}>
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor={isActive ? '$primary' : '$color4'}
                >
                  <XStack alignItems="center" gap="$2">
                    <Icon size={14} color={isActive ? 'white' : color12} />
                    <Text fontSize="$2" fontWeight={isActive ? '600' : '400'} color={isActive ? 'white' : '$color12'}>
                      {option.label}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            );
          })}
        </XStack>

        {/* 分类标签 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <XStack paddingHorizontal="$2.5" gap="$2">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id as QuestionCategory)}
                >
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor={isSelected ? '$primary' : '$color4'}
                  >
                    <XStack alignItems="center" gap="$2">
                      <Icon size={16} color={isSelected ? 'white' : primaryColor} />
                      <Text
                        fontSize="$3"
                        fontWeight={isSelected ? '600' : '400'}
                        color={isSelected ? 'white' : '$primary'}
                      >
                        {category.label}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>

        {/* 问题列表 */}
        <View paddingHorizontal="$2.5">
          {loading && questions.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$color10">
                加载中...
              </Text>
            </View>
          ) : questions.length === 0 ? (
            <View padding="$8" alignItems="center">
              <HelpCircle size={48} color={color10} />
              <Text fontSize="$4" color="$color12" marginTop="$4">
                暂无问题
              </Text>
              <Text fontSize="$3" color="$color10" marginTop="$2">
                {searchQuery ? '试试其他搜索词' : '成为第一个提问的人'}
              </Text>
              <Pressable onPress={handleAskQuestion}>
                <View
                  marginTop="$4"
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  backgroundColor="$primary"
                  borderRadius="$10"
                >
                  <Text fontSize="$3" fontWeight="600" color="white">
                    我要提问
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <>{questions.map(q => renderQuestionCard(q))}</>
          )}
        </View>

        <View height={80} />
      </ScrollView>

      {/* 浮动提问按钮 */}
      <View position="absolute" bottom={insets.bottom > 0 ? insets.bottom + 20 : 20} right={20}>
        <Pressable onPress={handleAskQuestion}>
          <View
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor="$primary"
            justifyContent="center"
            alignItems="center"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.25}
            shadowRadius={8}
          >
            <Plus size={28} color="white" />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default InsuranceQAScreen;
