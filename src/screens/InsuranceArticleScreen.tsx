import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, TextInput, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Search,
  BookOpen,
  TrendingUp,
  Shield,
  AlertTriangle,
  Clock,
  Eye,
  Heart,
  Share2,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

// 文章分类
type ArticleCategory = 'all' | 'basics' | 'product_analysis' | 'claim_guide' | 'pitfall_prevention';

interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number; // 分钟
  views: number;
  likes: number;
  coverImage?: string;
  tags: string[];
  isHot: boolean;
  isBookmarked: boolean;
}

const InsuranceArticleScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 文章分类配置
  const categories = [
    { id: 'all', label: '全部', icon: BookOpen, color: COLORS.text },
    { id: 'basics', label: '保险科普', icon: BookOpen, color: '#3B82F6' },
    { id: 'product_analysis', label: '产品解读', icon: TrendingUp, color: '#10B981' },
    { id: 'claim_guide', label: '理赔指南', icon: Shield, color: '#8B5CF6' },
    { id: 'pitfall_prevention', label: '防坑避雷', icon: AlertTriangle, color: '#EF4444' },
  ];

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock数据
      const mockArticles: Article[] = [
        {
          id: 'article_001',
          title: '中老年人如何选择医疗险？这三点一定要注意',
          category: 'basics',
          summary: '医疗险是中老年人最关心的保障之一，但市面上产品众多，该如何选择？本文从保障范围、续保条件、免赔额三个关键维度，教你选择适合的医疗险。',
          content: '完整文章内容...',
          author: '资深保险规划师 王明',
          publishDate: '2024-01-15',
          readTime: 8,
          views: 15234,
          likes: 892,
          tags: ['医疗险', '中老年', '选购指南'],
          isHot: true,
          isBookmarked: false,
        },
        {
          id: 'article_002',
          title: '深度解析：平安e生保2024版与众安百万医疗对比',
          category: 'product_analysis',
          summary: '两款热销百万医疗险的全面对比，从保障责任、价格、增值服务、续保条件四个维度进行详细分析，帮助你做出明智选择。',
          content: '完整文章内容...',
          author: '产品分析师 李华',
          publishDate: '2024-01-14',
          readTime: 12,
          views: 23156,
          likes: 1456,
          tags: ['产品对比', '百万医疗', '平安', '众安'],
          isHot: true,
          isBookmarked: false,
        },
        {
          id: 'article_003',
          title: '理赔被拒？可能是这5个细节没注意',
          category: 'claim_guide',
          summary: '理赔难是很多人对保险的误解，实际上大部分理赔纠纷都源于投保时的疏忽。本文总结了5个最容易导致理赔被拒的细节。',
          content: '完整文章内容...',
          author: '理赔顾问 张强',
          publishDate: '2024-01-13',
          readTime: 6,
          views: 18923,
          likes: 1123,
          tags: ['理赔', '避坑', '注意事项'],
          isHot: false,
          isBookmarked: false,
        },
        {
          id: 'article_004',
          title: '警惕！这些保险销售话术千万别信',
          category: 'pitfall_prevention',
          summary: '保险销售常用的误导话术大揭秘，从"保本保息"到"万能险"，教你识别套路，避免踩坑。',
          content: '完整文章内容...',
          author: '消费者保护专家 刘洋',
          publishDate: '2024-01-12',
          readTime: 10,
          views: 31245,
          likes: 2134,
          tags: ['防坑', '销售误导', '消费者权益'],
          isHot: true,
          isBookmarked: false,
        },
        {
          id: 'article_005',
          title: '重疾险和医疗险的区别，很多人都搞错了',
          category: 'basics',
          summary: '重疾险和医疗险是两种完全不同的保险，但很多人容易混淆。本文详细解释两者的区别，以及如何搭配购买。',
          content: '完整文章内容...',
          author: '保险规划师 赵敏',
          publishDate: '2024-01-11',
          readTime: 7,
          views: 12456,
          likes: 678,
          tags: ['重疾险', '医疗险', '保险科普'],
          isHot: false,
          isBookmarked: false,
        },
        {
          id: 'article_006',
          title: '年金险值得买吗？收益率全面分析',
          category: 'product_analysis',
          summary: '年金险作为养老规划的重要工具，其收益率到底如何？本文通过实际案例计算，揭示年金险的真实收益。',
          content: '完整文章内容...',
          author: '理财规划师 孙丽',
          publishDate: '2024-01-10',
          readTime: 15,
          views: 9876,
          likes: 456,
          tags: ['年金险', '养老规划', '收益分析'],
          isHot: false,
          isBookmarked: false,
        },
      ];

      // 筛选逻辑
      let filtered = mockArticles;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(article => article.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some(tag => tag.includes(searchQuery))
        );
      }

      setArticles(filtered);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  const handleArticlePress = (article: Article) => {
    // 导航到文章详情页
    console.log('打开文章:', article.title);
    // navigation.navigate('InsuranceArticleDetail' as never, { articleId: article.id } as never);
  };

  const handleBookmark = (articleId: string) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === articleId ? { ...article, isBookmarked: !article.isBookmarked } : article
      )
    );
  };

  const getCategoryColor = (category: ArticleCategory) => {
    const categoryConfig = categories.find(c => c.id === category);
    return categoryConfig?.color || COLORS.text;
  };

  const renderArticleCard = (article: Article) => {
    return (
      <Pressable key={article.id} onPress={() => handleArticlePress(article)}>
        <View
          marginBottom="$3"
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
        >
          <View padding="$4">
            {/* 标签行 */}
            <XStack alignItems="center" gap="$2" marginBottom="$2">
              <View
                paddingHorizontal="$2"
                paddingVertical="$1"
                backgroundColor={`${getCategoryColor(article.category)}20`}
                borderRadius="$2"
              >
                <Text fontSize="$1" fontWeight="600" color={getCategoryColor(article.category)}>
                  {categories.find(c => c.id === article.category)?.label}
                </Text>
              </View>
              {article.isHot && (
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor="#FEF3C7"
                  borderRadius="$2"
                >
                  <Text fontSize="$1" fontWeight="600" color="#F59E0B">
                    热门
                  </Text>
                </View>
              )}
            </XStack>

            {/* 标题 */}
            <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$2" lineHeight={24}>
              {article.title}
            </Text>

            {/* 摘要 */}
            <Text fontSize="$3" color="$textSecondary" lineHeight={22} marginBottom="$3">
              {article.summary}
            </Text>

            {/* 标签 */}
            <XStack gap="$2" marginBottom="$3" flexWrap="wrap">
              {article.tags.map(tag => (
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
              <XStack alignItems="center" gap="$3">
                <XStack alignItems="center" gap="$1">
                  <Clock size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {article.readTime}分钟
                  </Text>
                </XStack>
                <XStack alignItems="center" gap="$1">
                  <Eye size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {article.views}
                  </Text>
                </XStack>
                <XStack alignItems="center" gap="$1">
                  <Heart
                    size={14}
                    color={article.likes > 1000 ? COLORS.error : COLORS.textSecondary}
                    fill={article.likes > 1000 ? COLORS.error : 'none'}
                  />
                  <Text fontSize="$2" color="$textSecondary">
                    {article.likes}
                  </Text>
                </XStack>
              </XStack>

              <Pressable onPress={() => handleBookmark(article.id)}>
                <Heart
                  size={20}
                  color={article.isBookmarked ? COLORS.error : COLORS.textSecondary}
                  fill={article.isBookmarked ? COLORS.error : 'none'}
                />
              </Pressable>
            </XStack>

            {/* 作者和日期 */}
            <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
              <Text fontSize="$2" color="$textSecondary">
                {article.author}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                {article.publishDate}
              </Text>
            </XStack>
          </View>
        </View>
      </Pressable>
    );
  };

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
          保险知识文章
        </Text>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 搜索框 */}
        <View padding="$4" paddingBottom="$2">
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
            height={44}
          >
            <XStack alignItems="center" gap="$2" height="100%">
              <Search size={20} color={COLORS.textSecondary} />
              <TextInput
                placeholder="搜索文章标题、内容或标签"
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.text,
                  padding: 0,
                }}
              />
            </XStack>
          </View>
        </View>

        {/* 分类标签 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <XStack paddingHorizontal="$4" gap="$2">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Pressable key={category.id} onPress={() => setSelectedCategory(category.id as ArticleCategory)}>
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

        {/* 文章列表 */}
        <View paddingHorizontal="$4">
          {loading && articles.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                加载中...
              </Text>
            </View>
          ) : articles.length === 0 ? (
            <View padding="$8" alignItems="center">
              <BookOpen size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
                暂无文章
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                {searchQuery ? '试试其他搜索词' : '请选择其他分类'}
              </Text>
            </View>
          ) : (
            <>{articles.map(article => renderArticleCard(article))}</>
          )}
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsuranceArticleScreen;
