import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
  Input,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator } from 'react-native';
import {
  ArrowLeft,
  Search,
  Eye,
  ThumbsUp,
  MessageCircle,
  Clock,
  CheckCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Article } from '@/types/community';
import { articleService } from '@/services/articleService';
import { useFocusEffect } from '@react-navigation/native';

interface ArticleListScreenProps {
  navigation: any;
}

export const ArticleListScreen: React.FC<ArticleListScreenProps> = ({ navigation }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['全部', '疾病预防', '慢病管理', '老年健康', '营养饮食', '中医养生'];

  const loadArticles = async () => {
    setLoading(true);
    if (searchQuery) {
      const results = await articleService.searchArticles(searchQuery);
      setArticles(results);
    } else {
      const data = await articleService.getArticlesByCategory(selectedCategory);
      setArticles(data);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadArticles();
    }, [selectedCategory, searchQuery])
  );

  const handleArticlePress = (articleId: string) => {
    navigation.navigate('ArticleDetail', { articleId });
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          paddingHorizontal="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="$background"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={24} color={COLORS.text} />
              <Text fontSize="$5" color="$text" fontWeight="600">
                健康资讯
              </Text>
            </XStack>
          </Pressable>
        </XStack>

        <YStack flex={1}>
          {/* 搜索栏 */}
          <View padding="$4" paddingBottom="$3">
            <XStack
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              backgroundColor="$surface"
              alignItems="center"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <Search size={16} color={COLORS.textSecondary} />
              <Input
                flex={1}
                borderWidth={0}
                backgroundColor="transparent"
                placeholder="搜索文章标题、标签..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                marginLeft="$2"
              />
            </XStack>
          </View>

          {/* 分类筛选 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            paddingHorizontal="$4"
            paddingBottom="$3"
          >
            <XStack space="$2">
              {categories.map((category) => (
                <Pressable key={category} onPress={() => setSelectedCategory(category)}>
                  <View
                    backgroundColor={
                      selectedCategory === category ? COLORS.primary : '$surface'
                    }
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={selectedCategory === category ? COLORS.primary : '$borderColor'}
                  >
                    <Text
                      fontSize="$3"
                      color={selectedCategory === category ? 'white' : '$text'}
                      fontWeight={selectedCategory === category ? '600' : '400'}
                    >
                      {category}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>

          {/* 文章列表 */}
          {loading ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : articles.length === 0 ? (
            <View flex={1} justifyContent="center" alignItems="center" padding="$4">
              <Text fontSize="$4" color="$textSecondary">
                暂无文章
              </Text>
            </View>
          ) : (
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              <YStack padding="$4" paddingTop="$2" space="$3">
                {articles.map((article) => (
                  <Pressable key={article.id} onPress={() => handleArticlePress(article.id)}>
                    <Card
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$cardBg"
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 1 }}
                      shadowOpacity={0.1}
                      shadowRadius={4}
                      elevation={2}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <YStack space="$3">
                        {/* 标题 */}
                        <H3 fontSize="$5" fontWeight="600" color="$text" lineHeight="$5">
                          {article.title}
                        </H3>

                        {/* 摘要 */}
                        <Text
                          fontSize="$3"
                          color="$textSecondary"
                          lineHeight="$2"
                          numberOfLines={2}
                        >
                          {article.summary}
                        </Text>

                        {/* 作者信息 */}
                        <XStack space="$2" alignItems="center">
                          <View
                            width={24}
                            height={24}
                            borderRadius={12}
                            backgroundColor="$surface"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text fontSize="$2" fontWeight="600" color="$primary">
                              {article.author.name[0]}
                            </Text>
                          </View>
                          <Text fontSize="$3" color="$text" fontWeight="500">
                            {article.author.name}
                          </Text>
                          {article.author.verified && (
                            <CheckCircle size={14} color={COLORS.primary} />
                          )}
                          <View width={4} height={4} borderRadius={2} backgroundColor="$textSecondary" />
                          <Text fontSize="$3" color="$textSecondary">
                            {article.author.title}
                          </Text>
                        </XStack>

                        {/* 标签 */}
                        <XStack flexWrap="wrap" gap="$2">
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
                          {article.tags.slice(0, 3).map((tag, index) => (
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

                        {/* 统计信息 */}
                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack space="$3" alignItems="center">
                            <XStack space="$1" alignItems="center">
                              <Eye size={14} color={COLORS.textSecondary} />
                              <Text fontSize="$3" color="$textSecondary">
                                {article.views}
                              </Text>
                            </XStack>
                            <XStack space="$1" alignItems="center">
                              <ThumbsUp size={14} color={COLORS.textSecondary} />
                              <Text fontSize="$3" color="$textSecondary">
                                {article.likes}
                              </Text>
                            </XStack>
                            <XStack space="$1" alignItems="center">
                              <MessageCircle size={14} color={COLORS.textSecondary} />
                              <Text fontSize="$3" color="$textSecondary">
                                {article.comments}
                              </Text>
                            </XStack>
                          </XStack>
                          <XStack space="$1" alignItems="center">
                            <Clock size={14} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$textSecondary">
                              {article.readTime}
                            </Text>
                          </XStack>
                        </XStack>
                      </YStack>
                    </Card>
                  </Pressable>
                ))}

                <View height={20} />
              </YStack>
            </ScrollView>
          )}
        </YStack>
      </SafeAreaView>
    </Theme>
  );
};
