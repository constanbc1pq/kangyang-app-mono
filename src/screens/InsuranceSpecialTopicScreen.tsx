import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, RefreshControl, Image } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Package,
  Users,
  Heart,
  Shield,
  TrendingUp,
  ChevronRight,
  Clock,
  Eye,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

// 专题类型
interface SpecialTopic {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  category: 'elderly' | 'family' | 'health' | 'wealth';
  articleCount: number;
  videoCount: number;
  productCount: number;
  viewCount: number;
  isHot: boolean;
  tags: string[];
  publishDate: string;
  articles: TopicArticle[];
  videos: TopicVideo[];
  products: TopicProduct[];
}

interface TopicArticle {
  id: string;
  title: string;
  readTime: number;
}

interface TopicVideo {
  id: string;
  title: string;
  duration: number;
}

interface TopicProduct {
  id: string;
  name: string;
  company: string;
  highlight: string;
}

const InsuranceSpecialTopicScreen: React.FC = () => {
  const navigation = useNavigation();
  const [topics, setTopics] = useState<SpecialTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<SpecialTopic | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 分类配置
  const categories = [
    { id: 'all', label: '全部', icon: BookOpen, color: COLORS.text },
    { id: 'elderly', label: '养老规划', icon: Heart, color: '#F59E0B' },
    { id: 'family', label: '家庭保障', icon: Users, color: '#10B981' },
    { id: 'health', label: '健康管理', icon: Shield, color: '#3B82F6' },
    { id: 'wealth', label: '财富传承', icon: TrendingUp, color: '#8B5CF6' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTopics();
  }, [selectedCategory]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock数据
      const mockTopics: SpecialTopic[] = [
        {
          id: 'topic_001',
          title: '中老年人必备保险清单',
          subtitle: '50岁以上人群的保险配置指南',
          description:
            '针对50岁以上人群，从医疗、意外、养老三个维度，详细讲解如何科学配置保险，避免踩坑，最大化保障效果。',
          coverImage: 'https://via.placeholder.com/400x200?text=中老年保险',
          category: 'elderly',
          articleCount: 5,
          videoCount: 3,
          productCount: 4,
          viewCount: 12580,
          isHot: true,
          tags: ['中老年', '健康险', '意外险', '养老规划'],
          publishDate: '2024-01-15',
          articles: [
            { id: 'art_1', title: '50岁以上还能买什么保险？', readTime: 8 },
            { id: 'art_2', title: '中老年人医疗险选购要点', readTime: 10 },
            { id: 'art_3', title: '防癌险vs重疾险，如何选择？', readTime: 12 },
            { id: 'art_4', title: '意外险配置：关注骨折和住院津贴', readTime: 6 },
            { id: 'art_5', title: '养老年金险的配置时机', readTime: 15 },
          ],
          videos: [
            { id: 'vid_1', title: '中老年人保险配置实战案例', duration: 1200 },
            { id: 'vid_2', title: '如何用有限预算买到足够保障', duration: 900 },
            { id: 'vid_3', title: '健康告知填写技巧详解', duration: 780 },
          ],
          products: [
            {
              id: 'prod_1',
              name: '好医保长期医疗（20年版）',
              company: '人保健康',
              highlight: '支持65岁投保，保证续保20年',
            },
            {
              id: 'prod_2',
              name: '平安守护百分百',
              company: '平安保险',
              highlight: '防癌医疗，三高人群可投保',
            },
            {
              id: 'prod_3',
              name: '孝欣保老年意外险',
              company: '众安保险',
              highlight: '80岁可投保，骨折保障全面',
            },
            {
              id: 'prod_4',
              name: '如意享（七金版）',
              company: '国寿养老',
              highlight: '养老年金，保证领取20年',
            },
          ],
        },
        {
          id: 'topic_002',
          title: '家庭保险配置全攻略',
          subtitle: '三口之家的保障体系构建',
          description:
            '从家庭责任出发，为不同家庭成员配置合适的保险产品，构建完整的家庭保障体系，用最少的钱买到最全面的保障。',
          coverImage: 'https://via.placeholder.com/400x200?text=家庭保障',
          category: 'family',
          articleCount: 6,
          videoCount: 4,
          productCount: 5,
          viewCount: 9850,
          isHot: true,
          tags: ['家庭保障', '寿险', '重疾险', '教育金'],
          publishDate: '2024-01-12',
          articles: [
            { id: 'art_6', title: '家庭保险配置的五大原则', readTime: 10 },
            { id: 'art_7', title: '先给谁买保险？配置顺序很重要', readTime: 8 },
            { id: 'art_8', title: '家庭支柱的寿险保额如何确定', readTime: 12 },
            { id: 'art_9', title: '重疾险：大人和小孩怎么买', readTime: 15 },
            { id: 'art_10', title: '百万医疗险的家庭版值得买吗', readTime: 7 },
            { id: 'art_11', title: '教育金保险的利与弊', readTime: 10 },
          ],
          videos: [
            { id: 'vid_4', title: '三口之家年收入20万保险配置', duration: 1500 },
            { id: 'vid_5', title: '双职工家庭的保险规划', duration: 1100 },
            { id: 'vid_6', title: '儿童保险配置全攻略', duration: 980 },
            { id: 'vid_7', title: '家庭保险每年交多少合适', duration: 750 },
          ],
          products: [
            {
              id: 'prod_5',
              name: '华贵大麦2024定期寿险',
              company: '华贵人寿',
              highlight: '家庭支柱必备，保费便宜保额高',
            },
            {
              id: 'prod_6',
              name: '达尔文8号重疾险',
              company: '复星联合',
              highlight: '保障全面，性价比高',
            },
            {
              id: 'prod_7',
              name: '好医保长期医疗（家庭版）',
              company: '人保健康',
              highlight: '全家共享免赔额，更实惠',
            },
            {
              id: 'prod_8',
              name: '平安小顽童少儿意外险',
              company: '平安保险',
              highlight: '儿童专属，意外医疗0免赔',
            },
            {
              id: 'prod_9',
              name: '金满意足教育金',
              company: '弘康人寿',
              highlight: '专款专用，强制储蓄',
            },
          ],
        },
        {
          id: 'topic_003',
          title: '慢性病人群投保指南',
          subtitle: '三高、糖尿病患者也能买保险',
          description:
            '患有高血压、高血脂、高血糖、糖尿病等慢性疾病的人群，如何成功投保？哪些产品核保宽松？详细解读健康告知技巧。',
          coverImage: 'https://via.placeholder.com/400x200?text=慢病投保',
          category: 'health',
          articleCount: 4,
          videoCount: 2,
          productCount: 3,
          viewCount: 7640,
          isHot: false,
          tags: ['健康告知', '三高', '糖尿病', '核保'],
          publishDate: '2024-01-10',
          articles: [
            { id: 'art_12', title: '三高人群能买哪些保险？', readTime: 10 },
            { id: 'art_13', title: '糖尿病患者的投保攻略', readTime: 12 },
            { id: 'art_14', title: '健康告知：如实告知的边界在哪里', readTime: 15 },
            { id: 'art_15', title: '智能核保vs人工核保，如何选择', readTime: 8 },
          ],
          videos: [
            { id: 'vid_8', title: '三高人群投保实战演示', duration: 1350 },
            { id: 'vid_9', title: '被拒保后还能怎么办', duration: 880 },
          ],
          products: [
            {
              id: 'prod_10',
              name: '平安守护百分百防癌医疗',
              company: '平安保险',
              highlight: '三高、糖尿病可投保',
            },
            {
              id: 'prod_11',
              name: '惠享e生百万医疗',
              company: '阳光财险',
              highlight: '健康告知宽松，智能核保',
            },
            {
              id: 'prod_12',
              name: '孝心安老年防癌险',
              company: '国寿财险',
              highlight: '专为慢病人群设计',
            },
          ],
        },
        {
          id: 'topic_004',
          title: '年金险投资全解析',
          subtitle: '养老规划与财富传承的利器',
          description:
            '年金险真的能养老吗？收益率到底如何？增额终身寿vs年金险如何选择？深度解析年金险的作用、收益计算和配置策略。',
          coverImage: 'https://via.placeholder.com/400x200?text=年金险',
          category: 'wealth',
          articleCount: 5,
          videoCount: 3,
          productCount: 4,
          viewCount: 6320,
          isHot: false,
          tags: ['年金险', '养老规划', '财富传承', '增额终身寿'],
          publishDate: '2024-01-08',
          articles: [
            { id: 'art_16', title: '年金险的5大作用和3大坑', readTime: 12 },
            { id: 'art_17', title: '如何计算年金险的真实收益率', readTime: 15 },
            { id: 'art_18', title: '增额终身寿vs年金险，谁更适合你', readTime: 10 },
            { id: 'art_19', title: '养老年金：什么时候买最合适', readTime: 8 },
            { id: 'art_20', title: '年金险的财富传承功能详解', readTime: 10 },
          ],
          videos: [
            { id: 'vid_10', title: '年金险收益率计算实操', duration: 1100 },
            { id: 'vid_11', title: '30岁vs50岁买年金险的差异', duration: 950 },
            { id: 'vid_12', title: '年金险产品全面测评', duration: 1680 },
          ],
          products: [
            {
              id: 'prod_13',
              name: '金满意足臻享版',
              company: '弘康人寿',
              highlight: '3.0%复利增长，现金价值高',
            },
            {
              id: 'prod_14',
              name: '如意尊3.0增额终身寿',
              company: '信泰人寿',
              highlight: '3.0%复利，支持减保',
            },
            {
              id: 'prod_15',
              name: '颐养金生养老年金',
              company: '国寿养老',
              highlight: '保证领取20年，终身领取',
            },
            {
              id: 'prod_16',
              name: '传世壹号增额终身寿',
              company: '同方全球',
              highlight: '财富传承，隔代投保',
            },
          ],
        },
        {
          id: 'topic_005',
          title: '理赔纠纷案例精选',
          subtitle: '从真实案例学会避坑',
          description:
            '精选10个理赔纠纷真实案例，分析理赔被拒的原因，总结投保和理赔的注意事项，帮你避免同样的错误。',
          coverImage: 'https://via.placeholder.com/400x200?text=理赔案例',
          category: 'health',
          articleCount: 10,
          videoCount: 5,
          productCount: 0,
          viewCount: 8950,
          isHot: false,
          tags: ['理赔', '案例分析', '避坑指南', '健康告知'],
          publishDate: '2024-01-05',
          articles: [
            { id: 'art_21', title: '案例1：未如实告知导致拒赔', readTime: 8 },
            { id: 'art_22', title: '案例2：等待期出险无法理赔', readTime: 6 },
            { id: 'art_23', title: '案例3：既往症除外条款引发纠纷', readTime: 10 },
            { id: 'art_24', title: '案例4：重疾险理赔成功案例', readTime: 12 },
            { id: 'art_25', title: '案例5：医疗险理赔的常见问题', readTime: 8 },
            { id: 'art_26', title: '案例6：意外险理赔边界争议', readTime: 10 },
            { id: 'art_27', title: '案例7：寿险受益人指定的重要性', readTime: 7 },
            { id: 'art_28', title: '案例8：保险公司拒赔后如何维权', readTime: 12 },
            { id: 'art_29', title: '案例9：理赔资料不全导致延期', readTime: 6 },
            { id: 'art_30', title: '案例10：成功理赔的5个关键点', readTime: 9 },
          ],
          videos: [
            { id: 'vid_13', title: '理赔纠纷案例1-3详解', duration: 1800 },
            { id: 'vid_14', title: '理赔纠纷案例4-6详解', duration: 1650 },
            { id: 'vid_15', title: '理赔纠纷案例7-10详解', duration: 1900 },
            { id: 'vid_16', title: '如何提高理赔成功率', duration: 1200 },
            { id: 'vid_17', title: '理赔被拒后的申诉流程', duration: 980 },
          ],
          products: [],
        },
      ];

      // 筛选逻辑
      let filtered = mockTopics;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(topic => topic.category === selectedCategory);
      }

      setTopics(filtered);
    } catch (error) {
      console.error('加载专题失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTopics();
  };

  const handleTopicPress = (topic: SpecialTopic) => {
    setSelectedTopic(topic);
  };

  const handleBackToList = () => {
    setSelectedTopic(null);
  };

  const handleConsultation = () => {
    console.log('打开咨询入口');
    // navigation.navigate('InsuranceAdvisorList' as never);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 渲染专题列表卡片
  const renderTopicCard = (topic: SpecialTopic) => {
    const categoryConfig = categories.find(c => c.id === topic.category);

    return (
      <Pressable key={topic.id} onPress={() => handleTopicPress(topic)}>
        <View
          marginBottom="$4"
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
        >
          {/* 封面图 */}
          <View position="relative">
            <View width="100%" height={180} backgroundColor="$borderColor">
              <View
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                backgroundColor="#E5E7EB"
              >
                <Text fontSize="$4" color="$textSecondary">
                  专题封面
                </Text>
              </View>
            </View>

            {/* 热门标签 */}
            {topic.isHot && (
              <View
                position="absolute"
                top={12}
                left={12}
                paddingHorizontal="$2"
                paddingVertical="$1"
                backgroundColor="#EF4444"
                borderRadius="$2"
              >
                <Text fontSize="$2" fontWeight="600" color="white">
                  热门
                </Text>
              </View>
            )}

            {/* 分类标签 */}
            <View
              position="absolute"
              bottom={12}
              left={12}
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor={`${categoryConfig?.color || COLORS.text}DD`}
              borderRadius="$2"
            >
              <Text fontSize="$2" fontWeight="600" color="white">
                {categoryConfig?.label}
              </Text>
            </View>
          </View>

          {/* 专题信息 */}
          <View padding="$4">
            <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
              {topic.title}
            </Text>
            <Text fontSize="$3" color="$textSecondary" marginBottom="$3">
              {topic.subtitle}
            </Text>
            <Text fontSize="$2" color="$textSecondary" lineHeight={20} marginBottom="$3">
              {topic.description}
            </Text>

            {/* 内容统计 */}
            <XStack gap="$4" marginBottom="$3">
              <XStack alignItems="center" gap="$1">
                <BookOpen size={16} color={COLORS.primary} />
                <Text fontSize="$2" color="$text">
                  {topic.articleCount}篇文章
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <Play size={16} color={COLORS.primary} />
                <Text fontSize="$2" color="$text">
                  {topic.videoCount}个视频
                </Text>
              </XStack>
              {topic.productCount > 0 && (
                <XStack alignItems="center" gap="$1">
                  <Package size={16} color={COLORS.primary} />
                  <Text fontSize="$2" color="$text">
                    {topic.productCount}款产品
                  </Text>
                </XStack>
              )}
            </XStack>

            {/* 标签 */}
            <XStack gap="$2" marginBottom="$3" flexWrap="wrap">
              {topic.tags.map(tag => (
                <View
                  key={tag}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor="$borderColor"
                  borderRadius="$2"
                >
                  <Text fontSize="$1" color="$textSecondary">
                    #{tag}
                  </Text>
                </View>
              ))}
            </XStack>

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$1">
                <Eye size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {topic.viewCount.toLocaleString()} 次浏览
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <Clock size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {topic.publishDate}
                </Text>
              </XStack>
            </XStack>
          </View>
        </View>
      </Pressable>
    );
  };

  // 渲染专题详情页
  const renderTopicDetail = (topic: SpecialTopic) => {
    const categoryConfig = categories.find(c => c.id === topic.category);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 专题头部 */}
        <View padding="$4" backgroundColor="$surface" borderBottomWidth={1} borderBottomColor="$borderColor">
          <View
            paddingHorizontal="$2"
            paddingVertical="$1"
            backgroundColor={`${categoryConfig?.color || COLORS.text}20`}
            borderRadius="$2"
            alignSelf="flex-start"
            marginBottom="$2"
          >
            <Text fontSize="$2" fontWeight="600" color={categoryConfig?.color || COLORS.text}>
              {categoryConfig?.label}
            </Text>
          </View>
          <Text fontSize="$6" fontWeight="700" color="$text" marginBottom="$2">
            {topic.title}
          </Text>
          <Text fontSize="$3" color="$textSecondary" marginBottom="$3">
            {topic.subtitle}
          </Text>
          <Text fontSize="$2" color="$textSecondary" lineHeight={20}>
            {topic.description}
          </Text>
        </View>

        {/* 文章列表 */}
        {topic.articles.length > 0 && (
          <View padding="$4" backgroundColor="$surface" marginTop="$3" borderTopWidth={1} borderTopColor="$borderColor">
            <XStack alignItems="center" gap="$2" marginBottom="$3">
              <BookOpen size={20} color={COLORS.primary} />
              <Text fontSize="$4" fontWeight="700" color="$text">
                精选文章 ({topic.articles.length})
              </Text>
            </XStack>
            {topic.articles.map((article, index) => (
              <Pressable key={article.id}>
                <XStack
                  paddingVertical="$3"
                  borderBottomWidth={index < topic.articles.length - 1 ? 1 : 0}
                  borderBottomColor="$borderColor"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <YStack flex={1}>
                    <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
                      {article.title}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      阅读时间 {article.readTime} 分钟
                    </Text>
                  </YStack>
                  <ChevronRight size={20} color={COLORS.textSecondary} />
                </XStack>
              </Pressable>
            ))}
          </View>
        )}

        {/* 视频列表 */}
        {topic.videos.length > 0 && (
          <View padding="$4" backgroundColor="$surface" marginTop="$3" borderTopWidth={1} borderTopColor="$borderColor">
            <XStack alignItems="center" gap="$2" marginBottom="$3">
              <Play size={20} color={COLORS.primary} />
              <Text fontSize="$4" fontWeight="700" color="$text">
                视频课程 ({topic.videos.length})
              </Text>
            </XStack>
            {topic.videos.map((video, index) => (
              <Pressable key={video.id}>
                <XStack
                  paddingVertical="$3"
                  borderBottomWidth={index < topic.videos.length - 1 ? 1 : 0}
                  borderBottomColor="$borderColor"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <YStack flex={1}>
                    <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
                      {video.title}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      时长 {formatDuration(video.duration)}
                    </Text>
                  </YStack>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={`${COLORS.primary}20`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Play size={20} color={COLORS.primary} fill={COLORS.primary} />
                  </View>
                </XStack>
              </Pressable>
            ))}
          </View>
        )}

        {/* 推荐产品 */}
        {topic.products.length > 0 && (
          <View padding="$4" backgroundColor="$surface" marginTop="$3" borderTopWidth={1} borderTopColor="$borderColor">
            <XStack alignItems="center" gap="$2" marginBottom="$3">
              <Package size={20} color={COLORS.primary} />
              <Text fontSize="$4" fontWeight="700" color="$text">
                推荐产品 ({topic.products.length})
              </Text>
            </XStack>
            {topic.products.map((product, index) => (
              <Pressable key={product.id}>
                <View
                  paddingVertical="$3"
                  borderBottomWidth={index < topic.products.length - 1 ? 1 : 0}
                  borderBottomColor="$borderColor"
                >
                  <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                        {product.name}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                        {product.company}
                      </Text>
                    </YStack>
                    <ChevronRight size={20} color={COLORS.textSecondary} />
                  </XStack>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    backgroundColor={`${COLORS.success}10`}
                    borderRadius="$2"
                    borderLeftWidth={3}
                    borderLeftColor={COLORS.success}
                  >
                    <Text fontSize="$2" color={COLORS.success} fontWeight="600">
                      {product.highlight}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* 咨询入口 */}
        <View padding="$4">
          <Pressable onPress={handleConsultation}>
            <View
              backgroundColor={COLORS.primary}
              paddingVertical="$4"
              borderRadius="$3"
              alignItems="center"
            >
              <Text fontSize="$4" fontWeight="700" color="white">
                专属顾问一对一咨询
              </Text>
            </View>
          </Pressable>
        </View>

        <View height={20} />
      </ScrollView>
    );
  };

  // 如果选中了专题，显示详情页
  if (selectedTopic) {
    return (
      <View flex={1} backgroundColor="$background">
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          paddingHorizontal="$4"
          backgroundColor="$surface"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Pressable onPress={handleBackToList}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
            专题详情
          </Text>
        </XStack>

        {renderTopicDetail(selectedTopic)}
      </View>
    );
  }

  // 显示专题列表
  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          专题策划
        </Text>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 分类标签 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
          <XStack paddingHorizontal="$4" gap="$2">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id as string)}
                >
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    backgroundColor={isSelected ? category.color : '$surface'}
                    borderWidth={1}
                    borderColor={isSelected ? category.color : '$borderColor'}
                  >
                    <XStack alignItems="center" gap="$2">
                      <Icon size={16} color={isSelected ? 'white' : category.color} />
                      <Text
                        fontSize="$3"
                        fontWeight="600"
                        color={isSelected ? 'white' : category.color}
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

        {/* 专题列表 */}
        <View paddingHorizontal="$4">
          {loading && topics.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                加载中...
              </Text>
            </View>
          ) : topics.length === 0 ? (
            <View padding="$8" alignItems="center">
              <BookOpen size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
                暂无专题
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                请选择其他分类
              </Text>
            </View>
          ) : (
            <>{topics.map(topic => renderTopicCard(topic))}</>
          )}
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsuranceSpecialTopicScreen;
