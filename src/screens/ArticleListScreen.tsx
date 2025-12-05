/**
 * ArticleListScreen 文章列表页
 * 邻里分享文章列表，支持分类筛选和搜索
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useMemo } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  ScrollView,
  Input,
  useTheme,
  AlertDialog,
  Button,
} from 'tamagui';
import { Pressable, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Eye,
  ThumbsUp,
  MessageCircle,
  Clock,
  CheckCircle,
  FileText,
  X,
  Plus,
  Trash2,
  User,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { Article } from '@/types/community';
import { articleService } from '@/services/articleService';
import { useFocusEffect } from '@react-navigation/native';
import { useToastController } from '@tamagui/toast';

interface ArticleListScreenProps {
  navigation: any;
}

/**
 * 文章列表页
 */
export const ArticleListScreen: React.FC<ArticleListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToastController();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);

  // 删除确认弹窗状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const categories = ['全部', '生活窍门', '美食烹饪', '育儿教育', '家居装修', '职场技能', '兴趣爱好'];

  const loadArticles = async () => {
    setLoading(true);
    try {
      let data: Article[];
      if (searchQuery) {
        data = await articleService.searchArticles(searchQuery);
      } else {
        data = await articleService.getArticlesByCategory(selectedCategory);
      }

      // 如果筛选"我的发布"
      if (showMyPosts) {
        data = data.filter(article => article.author.id === 'user_current');
      }

      setArticles(data);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadArticles();
    }, [selectedCategory, searchQuery, showMyPosts])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };

  const handleArticlePress = (articleId: string) => {
    navigation.navigate('ArticleDetail', { articleId });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  // 打开删除确认弹窗
  const handleDeleteArticle = (article: Article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (articleToDelete) {
      const success = await articleService.deleteArticle(articleToDelete.id);
      if (success) {
        toast.show('删除成功', { message: '文章已删除' });
        loadArticles();
      } else {
        toast.show('删除失败', { message: '请稍后重试' });
      }
    }
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  // 判断是否是当前用户发布的文章
  const isMyArticle = (article: Article): boolean => {
    return article.author.id === 'user_current';
  };

  // 渲染右侧按钮区域
  const renderRightButtons = () => (
    <XStack gap="$2" alignItems="center">
      {/* 我的发布按钮 */}
      <Pressable onPress={() => setShowMyPosts(!showMyPosts)}>
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor={showMyPosts ? primaryColor : '$color4'}
          justifyContent="center"
          alignItems="center"
        >
          <User size={18} color={showMyPosts ? 'white' : color10} />
        </View>
      </Pressable>
      {/* 搜索按钮 */}
      <Pressable onPress={() => setShowSearch(!showSearch)}>
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor={showSearch ? primaryColor : '$color4'}
          justifyContent="center"
          alignItems="center"
        >
          <Search size={18} color={showSearch ? 'white' : color10} />
        </View>
      </Pressable>
    </XStack>
  );

  // 渲染搜索栏
  const renderSearchBar = () => {
    if (!showSearch) return null;

    return (
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
      >
        <XStack
          backgroundColor="$color4"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$color5"
          alignItems="center"
          paddingHorizontal="$2"
          paddingVertical="$1.5"
        >
          <Search size={16} color={color10} />
          <Input
            flex={1}
            borderWidth={0}
            backgroundColor="transparent"
            placeholder="搜索文章标题、标签..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            marginLeft="$1.5"
            fontSize="$3"
          />
          {searchQuery && (
            <Pressable onPress={handleClearSearch}>
              <View
                width={24}
                height={24}
                borderRadius={12}
                backgroundColor="$color5"
                justifyContent="center"
                alignItems="center"
              >
                <X size={12} color={color10} />
              </View>
            </Pressable>
          )}
        </XStack>
      </View>
    );
  };

  // 渲染分类筛选
  const renderCategoryFilter = () => (
    <View marginTop="$2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <XStack gap="$1.5">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Pressable key={category} onPress={() => setSelectedCategory(category)}>
                <View
                  backgroundColor={isActive ? primaryColor : '$color4'}
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor={isActive ? primaryColor : '$color5'}
                >
                  <Text
                    fontSize="$3"
                    color={isActive ? 'white' : '$color12'}
                    fontWeight={isActive ? '600' : '400'}
                  >
                    {category}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </ScrollView>
    </View>
  );

  // 渲染文章卡片
  const renderArticleCard = ({ item: article }: { item: Article }) => (
    <Pressable onPress={() => handleArticlePress(article.id)}>
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <YStack gap="$2">
          {/* 标题和删除按钮 */}
          <XStack justifyContent="space-between" alignItems="flex-start" gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={2} flex={1}>
              {article.title}
            </Text>
            {isMyArticle(article) && (
              <Pressable
                onPress={() => handleDeleteArticle(article)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View
                  width={28}
                  height={28}
                  borderRadius={14}
                  backgroundColor="$color4"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Trash2 size={14} color={color10} />
                </View>
              </Pressable>
            )}
          </XStack>

          {/* 摘要 */}
          <Text
            fontSize="$3"
            color="$color10"
            numberOfLines={2}
            lineHeight={20}
          >
            {article.summary}
          </Text>

          {/* 作者信息 */}
          <XStack gap="$1.5" alignItems="center">
            <View
              width={24}
              height={24}
              borderRadius={12}
              backgroundColor={`${primaryColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$2" fontWeight="600" color={primaryColor}>
                {article.author.name[0]}
              </Text>
            </View>
            <Text fontSize="$3" color="$color12" fontWeight="500">
              {article.author.name}
            </Text>
            {article.author.verified && (
              <CheckCircle size={14} color={primaryColor} />
            )}
            <View width={4} height={4} borderRadius={2} backgroundColor="$color10" />
            <Text fontSize="$2" color="$color10">
              {article.author.title}
            </Text>
          </XStack>

          {/* 标签 */}
          <XStack flexWrap="wrap" gap="$1.5">
            <View
              backgroundColor={primaryColor}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color="white" fontWeight="500">
                {article.category}
              </Text>
            </View>
            {article.tags.slice(0, 2).map((tag, index) => (
              <View
                key={index}
                backgroundColor={`${primaryColor}15`}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color={primaryColor}>
                  #{tag}
                </Text>
              </View>
            ))}
          </XStack>

          {/* 统计信息 */}
          <XStack justifyContent="space-between" alignItems="center" paddingTop="$1">
            <XStack gap="$3" alignItems="center">
              <XStack gap="$1" alignItems="center">
                <Eye size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {article.views}
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <ThumbsUp size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {article.likes}
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <MessageCircle size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {article.comments}
                </Text>
              </XStack>
            </XStack>
            <XStack gap="$1" alignItems="center">
              <Clock size={14} color={color10} />
              <Text fontSize="$2" color="$color10">
                {article.readTime}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </Card>
    </Pressable>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <FileText size={64} color={color10} strokeWidth={1} />
        <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$4" marginBottom="$1.5">
          暂无文章
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {searchQuery
            ? '没有找到相关文章，换个关键词试试'
            : `${selectedCategory === '全部' ? '还没有文章发布' : `暂无"${selectedCategory}"分类的文章`}`
          }
        </Text>
      </View>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar
          title={showMyPosts ? '我的发布' : '邻里分享'}
          subtitle={`${articles.length} 篇文章`}
          renderRight={renderRightButtons}
        />
      </View>

      {/* 搜索栏 */}
      {renderSearchBar()}

      {/* 分类筛选 */}
      {renderCategoryFilter()}

      {/* 文章列表 */}
      {articles.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticleCard}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View height={insets.bottom + 80} />}
        />
      )}

      {/* 悬浮发布按钮 */}
      <View
        position="absolute"
        bottom={insets.bottom > 0 ? insets.bottom + 16 : 24}
        left={0}
        right={0}
        alignItems="center"
      >
        <Pressable onPress={() => navigation.navigate('PostPublish')}>
          <View
            backgroundColor={primaryColor}
            paddingHorizontal="$4"
            paddingVertical="$2.5"
            borderRadius="$10"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={8}
            elevation={6}
          >
            <XStack gap="$1.5" alignItems="center">
              <Plus size={18} color="white" />
              <Text fontSize="$3" color="white" fontWeight="600">
                发布分享
              </Text>
            </XStack>
          </View>
        </Pressable>
      </View>

      {/* 删除确认弹窗 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
            backgroundColor="white"
            borderRadius="$5"
            padding="$4"
            width="85%"
            maxWidth={340}
          >
            <YStack gap="$3">
              <AlertDialog.Title fontSize="$5" fontWeight="600" color="$color12">
                删除文章
              </AlertDialog.Title>
              <AlertDialog.Description fontSize="$3" color="$color10">
                确定要删除「{articleToDelete?.title}」吗？此操作不可恢复。
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
                <AlertDialog.Cancel asChild>
                  <Button
                    backgroundColor="$color4"
                    borderRadius="$10"
                    paddingHorizontal="$4"
                  >
                    <Text color="$color12">取消</Text>
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button
                    backgroundColor="$error"
                    borderRadius="$10"
                    paddingHorizontal="$4"
                    onPress={confirmDelete}
                  >
                    <Text color="white">删除</Text>
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </View>
  );
};
