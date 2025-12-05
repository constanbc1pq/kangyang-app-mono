/**
 * ArticleDetailScreen 文章详情页
 * 展示文章完整内容、作者信息、评论等
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Eye,
  ThumbsUp,
  Share2,
  Bookmark,
  MessageCircle,
  CheckCircle,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { Article } from '@/types/community';
import { articleService } from '@/services/articleService';
import { useFocusEffect } from '@react-navigation/native';

interface ArticleDetailScreenProps {
  route: {
    params: {
      articleId: string;
    };
  };
  navigation: any;
}

/**
 * 文章详情页
 */
export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;

  const { articleId } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticleById(articleId);
      if (data) {
        setArticle(data);
        setIsBookmarked(data.isBookmarked || false);
        setIsLiked(data.isLiked || false);
      }
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadArticle();
    }, [articleId])
  );

  const handleBookmark = async () => {
    const newState = await articleService.toggleBookmarkArticle(articleId);
    setIsBookmarked(newState);
  };

  const handleLike = async () => {
    const newState = await articleService.toggleLikeArticle(articleId);
    setIsLiked(newState);
    if (article) {
      setArticle({
        ...article,
        likes: newState ? article.likes + 1 : article.likes - 1,
      });
    }
  };

  const handleShare = () => {
    console.log('分享文章:', articleId);
  };

  // 渲染右侧操作按钮
  const renderRightActions = () => (
    <XStack gap="$2">
      <Pressable onPress={handleBookmark}>
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$color4"
          justifyContent="center"
          alignItems="center"
        >
          <Bookmark
            size={18}
            color={isBookmarked ? warningColor : color10}
            fill={isBookmarked ? warningColor : 'none'}
          />
        </View>
      </Pressable>
      <Pressable onPress={handleShare}>
        <View
          width={36}
          height={36}
          borderRadius={18}
          backgroundColor="$color4"
          justifyContent="center"
          alignItems="center"
        >
          <Share2 size={18} color={color10} />
        </View>
      </Pressable>
    </XStack>
  );

  // 渲染Markdown内容
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // H2标题
      if (line.startsWith('## ')) {
        return (
          <Text
            key={index}
            fontSize="$5"
            fontWeight="700"
            color="$color12"
            marginTop="$4"
            marginBottom="$2"
          >
            {line.replace('## ', '')}
          </Text>
        );
      }

      // H3标题
      if (line.startsWith('### ')) {
        return (
          <Text
            key={index}
            fontSize="$4"
            fontWeight="600"
            color="$color12"
            marginTop="$3"
            marginBottom="$1.5"
          >
            {line.replace('### ', '')}
          </Text>
        );
      }

      // 列表项
      if (line.startsWith('- ') || line.match(/^\d+\. /)) {
        const content = line.replace(/^[-\d]+\.\s/, '');
        const parts = content.split('**');
        return (
          <XStack key={index} marginBottom="$2" paddingLeft="$2" alignItems="flex-start">
            <Text fontSize="$3" color="$color10" marginRight="$2" marginTop={2}>
              •
            </Text>
            <Text fontSize="$3" color="$color12" flex={1} lineHeight={24}>
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <Text key={i} fontWeight="600" color="$color12">
                    {part}
                  </Text>
                ) : (
                  part
                )
              )}
            </Text>
          </XStack>
        );
      }

      // 空行
      if (line.trim() === '') {
        return <View key={index} height="$2" />;
      }

      // 普通段落
      const parts = line.split('**');
      return (
        <Text
          key={index}
          fontSize="$3"
          color="$color12"
          marginBottom="$2"
          lineHeight={24}
        >
          {parts.map((part, i) =>
            i % 2 === 1 ? (
              <Text key={i} fontWeight="600" color="$color12">
                {part}
              </Text>
            ) : (
              part
            )
          )}
        </Text>
      );
    });
  };

  // 加载中状态
  if (loading) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="文章详情" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      </View>
    );
  }

  // 文章不存在
  if (!article) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="文章详情" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <FileText size={64} color={color10} strokeWidth={1} />
          <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$4">
            文章不存在
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$1.5">
            该文章可能已被删除
          </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <View
              marginTop="$4"
              backgroundColor={primaryColor}
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius="$10"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                返回列表
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="文章详情"
          renderRight={renderRightActions}
        />
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 文章标题 */}
        <View marginHorizontal="$2.5" marginTop="$2">
          <Text fontSize="$6" fontWeight="700" color="$color12" lineHeight={32}>
            {article.title}
          </Text>
        </View>

        {/* 作者信息卡片 */}
        <Card
          marginHorizontal="$2.5"
          marginTop="$2"
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack gap="$2" alignItems="center">
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={`${primaryColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" fontWeight="600" color={primaryColor}>
                {article.author.name[0]}
              </Text>
            </View>
            <YStack flex={1}>
              <XStack gap="$1.5" alignItems="center">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {article.author.name}
                </Text>
                {article.author.verified && (
                  <CheckCircle size={14} color={primaryColor} />
                )}
              </XStack>
              <Text fontSize="$2" color="$color10">
                {article.author.title}
              </Text>
            </YStack>
          </XStack>

          {/* 统计信息 */}
          <XStack gap="$3" marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$color5">
            <XStack gap="$1" alignItems="center">
              <Calendar size={14} color={color10} />
              <Text fontSize="$2" color="$color10">
                {article.publishTime}
              </Text>
            </XStack>
            <XStack gap="$1" alignItems="center">
              <Clock size={14} color={color10} />
              <Text fontSize="$2" color="$color10">
                {article.readTime}
              </Text>
            </XStack>
            <XStack gap="$1" alignItems="center">
              <Eye size={14} color={color10} />
              <Text fontSize="$2" color="$color10">
                {article.views}
              </Text>
            </XStack>
          </XStack>
        </Card>

        {/* 分类和标签 */}
        <XStack marginHorizontal="$2.5" marginTop="$2" gap="$1.5" flexWrap="wrap">
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
          {article.tags.map((tag, index) => (
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

        {/* 文章内容 */}
        <Card
          marginHorizontal="$2.5"
          marginTop="$2"
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <YStack>
            {renderMarkdownContent(article.content)}
          </YStack>
        </Card>

        {/* 作者卡片 */}
        <Card
          marginHorizontal="$2.5"
          marginTop="$2"
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
            关于作者
          </Text>
          <XStack gap="$2" alignItems="center">
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={`${primaryColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$5" fontWeight="600" color={primaryColor}>
                {article.author.name[0]}
              </Text>
            </View>
            <YStack flex={1}>
              <XStack gap="$1.5" alignItems="center" marginBottom="$0.5">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {article.author.name}
                </Text>
                {article.author.verified && (
                  <CheckCircle size={14} color={primaryColor} />
                )}
              </XStack>
              <Text fontSize="$3" color="$color10" marginBottom="$1">
                {article.author.title}
              </Text>
              {article.author.followers && article.author.articles && (
                <XStack gap="$3">
                  <Text fontSize="$2" color="$color10">
                    {article.author.followers} 粉丝
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    {article.author.articles} 文章
                  </Text>
                </XStack>
              )}
            </YStack>
          </XStack>
        </Card>

        {/* 评论区预告 */}
        <Card
          marginHorizontal="$2.5"
          marginTop="$2"
          marginBottom="$4"
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$1.5" alignItems="center">
              <MessageCircle size={18} color={color10} />
              <Text fontSize="$4" fontWeight="600" color="$color12">
                评论 ({article.comments})
              </Text>
            </XStack>
            <View
              backgroundColor="$color4"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$10"
            >
              <Text fontSize="$2" color="$color10">
                敬请期待
              </Text>
            </View>
          </XStack>
        </Card>

        {/* 底部安全区域 */}
        <View height={80 + insets.bottom} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingTop="$2"
        paddingBottom={insets.bottom > 0 ? insets.bottom : 14}
      >
        <XStack justifyContent="space-around" alignItems="center">
          <Pressable onPress={handleLike}>
            <XStack gap="$1.5" alignItems="center">
              <ThumbsUp
                size={20}
                color={isLiked ? primaryColor : color10}
                fill={isLiked ? primaryColor : 'none'}
              />
              <Text
                fontSize="$3"
                color={isLiked ? primaryColor : '$color10'}
                fontWeight={isLiked ? '600' : '400'}
              >
                {article.likes}
              </Text>
            </XStack>
          </Pressable>

          <Pressable>
            <XStack gap="$1.5" alignItems="center">
              <MessageCircle size={20} color={color10} />
              <Text fontSize="$3" color="$color10">
                {article.comments}
              </Text>
            </XStack>
          </Pressable>

          <Pressable onPress={handleShare}>
            <XStack gap="$1.5" alignItems="center">
              <Share2 size={20} color={color10} />
              <Text fontSize="$3" color="$color10">
                {article.shares}
              </Text>
            </XStack>
          </Pressable>
        </XStack>
      </View>
    </View>
  );
};
