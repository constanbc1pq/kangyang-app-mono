import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H1,
  H2,
  H3,
  Theme,
  ScrollView,
  Button,
  Separator,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator } from 'react-native';
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Share2,
  Bookmark,
  MessageCircle,
  CheckCircle,
  Calendar,
  Clock,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
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

export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const loadArticle = async () => {
    setLoading(true);
    const data = await articleService.getArticleById(articleId);
    if (data) {
      setArticle(data);
      setIsBookmarked(data.isBookmarked || false);
      setIsLiked(data.isLiked || false);
    }
    setLoading(false);
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

  const renderMarkdownContent = (content: string) => {
    // 简单的Markdown渲染（移动端优化版本 - 优质阅读体验）
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // H2标题
      if (line.startsWith('## ')) {
        return (
          <H2
            key={index}
            fontSize={22}
            fontWeight="700"
            color="#1A1A1A"
            marginTop="$6"
            marginBottom="$4"
            lineHeight={30}
            letterSpacing={-0.3}
          >
            {line.replace('## ', '')}
          </H2>
        );
      }

      // H3标题
      if (line.startsWith('### ')) {
        return (
          <H3
            key={index}
            fontSize={18}
            fontWeight="600"
            color="#1A1A1A"
            marginTop="$5"
            marginBottom="$3"
            lineHeight={26}
          >
            {line.replace('### ', '')}
          </H3>
        );
      }

      // 列表项
      if (line.startsWith('- ') || line.match(/^\d+\. /)) {
        const content = line.replace(/^[-\d]+\.\s/, '');
        // 检查是否包含粗体标记
        const parts = content.split('**');
        return (
          <XStack key={index} marginBottom="$3" paddingLeft="$4" alignItems="flex-start">
            <Text fontSize={16} color="#666666" marginRight="$3" marginTop={2}>
              •
            </Text>
            <Text fontSize={17} color="#3A3A3A" flex={1} lineHeight={28}>
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <Text key={i} fontWeight="600" color="#1A1A1A">
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
        return <View key={index} height="$3" />;
      }

      // 普通段落（处理粗体）
      const parts = line.split('**');
      return (
        <Text
          key={index}
          fontSize={17}
          color="#3A3A3A"
          marginBottom="$4"
          lineHeight={28}
          letterSpacing={0.2}
        >
          {parts.map((part, i) =>
            i % 2 === 1 ? (
              <Text key={i} fontWeight="600" color="#1A1A1A">
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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="$textSecondary">
            文章不存在
          </Text>
          <Button marginTop="$4" onPress={() => navigation.goBack()}>
            <Text color="white">返回</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          borderBottomWidth={1}
          borderBottomColor="#F0F0F0"
          backgroundColor="#FFFFFF"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={24} color={COLORS.text} />
              <Text fontSize="$4" color="$text" fontWeight="500">
                返回
              </Text>
            </XStack>
          </Pressable>
          <XStack space="$3">
            <Pressable onPress={handleBookmark}>
              <Bookmark
                size={24}
                color={isBookmarked ? COLORS.warning : COLORS.textSecondary}
                fill={isBookmarked ? COLORS.warning : 'none'}
              />
            </Pressable>
            <Pressable>
              <Share2 size={24} color={COLORS.textSecondary} />
            </Pressable>
          </XStack>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false} backgroundColor="#FFFFFF">
          <YStack paddingHorizontal="$5" paddingTop="$5" paddingBottom="$6" space="$5" backgroundColor="#FFFFFF">
            {/* 文章标题 */}
            <H1 fontSize={28} fontWeight="700" color="#1A1A1A" lineHeight={38} letterSpacing={-0.5}>
              {article.title}
            </H1>

            {/* 文章元信息 */}
            <YStack space="$3">
              {/* 作者信息 */}
              <XStack space="$3" alignItems="center">
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="$surface"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$4" fontWeight="600" color="$primary">
                    {article.author.name[0]}
                  </Text>
                </View>
                <YStack flex={1}>
                  <XStack space="$2" alignItems="center">
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      {article.author.name}
                    </Text>
                    {article.author.verified && (
                      <CheckCircle size={16} color={COLORS.primary} />
                    )}
                  </XStack>
                  <Text fontSize="$3" color="$textSecondary">
                    {article.author.title}
                  </Text>
                </YStack>
              </XStack>

              {/* 统计信息 */}
              <XStack space="$4" flexWrap="wrap">
                <XStack space="$1" alignItems="center">
                  <Calendar size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$3" color="$textSecondary">
                    {article.publishTime}
                  </Text>
                </XStack>
                <XStack space="$1" alignItems="center">
                  <Clock size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$3" color="$textSecondary">
                    {article.readTime}
                  </Text>
                </XStack>
                <XStack space="$1" alignItems="center">
                  <Eye size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$3" color="$textSecondary">
                    {article.views}
                  </Text>
                </XStack>
              </XStack>

              {/* 分类和标签 */}
              <XStack space="$2" flexWrap="wrap">
                <View
                  backgroundColor={COLORS.primary}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="white" fontWeight="500">
                    {article.category}
                  </Text>
                </View>
                {article.tags.map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor="rgba(99, 102, 241, 0.1)"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$2" color="$primary">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </XStack>
            </YStack>

            <Separator marginVertical="$2" />

            {/* 文章内容 */}
            <YStack space="$2" marginTop="$4">{renderMarkdownContent(article.content)}</YStack>

            <Separator marginVertical="$5" backgroundColor="#E5E5E5" />

            {/* 作者卡片 */}
            <Card
              padding="$5"
              borderRadius="$4"
              backgroundColor="#F8F8F8"
              borderWidth={0}
            >
              <XStack space="$3" alignItems="center">
                <View
                  width={50}
                  height={50}
                  borderRadius={25}
                  backgroundColor="$background"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$5" fontWeight="600" color="$primary">
                    {article.author.name[0]}
                  </Text>
                </View>
                <YStack flex={1}>
                  <XStack space="$2" alignItems="center" marginBottom="$1">
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      {article.author.name}
                    </Text>
                    {article.author.verified && (
                      <CheckCircle size={16} color={COLORS.primary} />
                    )}
                  </XStack>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                    {article.author.title}
                  </Text>
                  {article.author.followers && article.author.articles && (
                    <XStack space="$4">
                      <Text fontSize="$3" color="$textSecondary">
                        {article.author.followers} 粉丝
                      </Text>
                      <Text fontSize="$3" color="$textSecondary">
                        {article.author.articles} 文章
                      </Text>
                    </XStack>
                  )}
                </YStack>
              </XStack>
            </Card>

            {/* 评论区预告 */}
            <Card
              padding="$5"
              borderRadius="$4"
              backgroundColor="#F8F8F8"
              borderWidth={0}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2" alignItems="center">
                  <MessageCircle size={20} color={COLORS.textSecondary} />
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    评论 ({article.comments})
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$textSecondary">
                  敬请期待
                </Text>
              </XStack>
            </Card>

            <View height={80} />
          </YStack>
        </ScrollView>

        {/* 底部操作栏 */}
        <View
          backgroundColor="#FFFFFF"
          borderTopWidth={1}
          borderTopColor="#F0F0F0"
          paddingHorizontal="$5"
          paddingVertical="$4"
          shadowColor="#000000"
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.05}
          shadowRadius={8}
          elevation={8}
        >
          <XStack justifyContent="space-around" alignItems="center">
            <Pressable onPress={handleLike}>
              <XStack space="$2" alignItems="center">
                <ThumbsUp
                  size={22}
                  color={isLiked ? COLORS.primary : COLORS.textSecondary}
                  fill={isLiked ? COLORS.primary : 'none'}
                />
                <Text
                  fontSize="$3"
                  color={isLiked ? '$primary' : '$textSecondary'}
                  fontWeight={isLiked ? '600' : '400'}
                >
                  {article.likes}
                </Text>
              </XStack>
            </Pressable>

            <Pressable>
              <XStack space="$2" alignItems="center">
                <MessageCircle size={22} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$textSecondary">
                  {article.comments}
                </Text>
              </XStack>
            </Pressable>

            <Pressable>
              <XStack space="$2" alignItems="center">
                <Share2 size={22} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$textSecondary">
                  {article.shares}
                </Text>
              </XStack>
            </Pressable>
          </XStack>
        </View>
      </SafeAreaView>
    </Theme>
  );
};
