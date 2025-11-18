import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, View, ScrollView, Input } from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Clock,
  X,
  TrendingUp,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/app';
import { CommunityFeedCard, FeedItem } from '@/components/CommunityFeedCard';
import {
  getJobs,
  getSecondHandItems,
  getPosts,
  getExperts,
} from '@/services/communityDataService';

interface SearchScreenProps {
  navigation: any;
}

const STORAGE_KEY_SEARCH_HISTORY = '@kangyang_search_history';

// 搜索结果类型
type SearchResultType = 'all' | 'job' | 'item' | 'post' | 'expert';

/**
 * 搜索页面
 * 支持全局搜索、历史记录、热门搜索
 */
export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<SearchResultType>('all');
  const [searchResults, setSearchResults] = useState<FeedItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 热门搜索标签（硬编码）
  const hotSearchTags = [
    '陪诊服务',
    '血压计',
    '按摩师',
    '康复理疗',
    '轮椅',
    '陪护',
    '高血压护理',
    '营养师',
  ];

  useEffect(() => {
    loadSearchHistory();
  }, []);

  // 加载搜索历史
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEY_SEARCH_HISTORY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };

  // 保存搜索历史
  const saveSearchHistory = async (keyword: string) => {
    try {
      // 去重，将新搜索词添加到最前面
      const newHistory = [
        keyword,
        ...searchHistory.filter((item) => item !== keyword),
      ].slice(0, 5); // 最多保存5条

      setSearchHistory(newHistory);
      await AsyncStorage.setItem(
        STORAGE_KEY_SEARCH_HISTORY,
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  // 清空搜索历史
  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(STORAGE_KEY_SEARCH_HISTORY);
    } catch (error) {
      console.error('清空搜索历史失败:', error);
    }
  };

  // 执行搜索
  const performSearch = async (keyword: string) => {
    if (!keyword.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // 保存到搜索历史
    await saveSearchHistory(keyword.trim());

    try {
      // 并行搜索所有类型的数据
      const [jobs, items, posts, experts] = await Promise.all([
        getJobs({}),
        getSecondHandItems({}),
        getPosts(),
        getExperts({}),
      ]);

      // 全文搜索过滤
      const searchLower = keyword.toLowerCase();

      const filteredJobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.healthTags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );

      const filteredItems = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );

      const filteredPosts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );

      const filteredExperts = experts.filter(
        (expert) =>
          expert.name.toLowerCase().includes(searchLower) ||
          expert.introduction.toLowerCase().includes(searchLower) ||
          expert.skillDescription.toLowerCase().includes(searchLower)
      );

      // 转换为FeedItem格式
      const allResults: FeedItem[] = [
        ...filteredJobs.map((data) => ({ type: 'job' as const, data })),
        ...filteredItems.map((data) => ({ type: 'item' as const, data })),
        ...filteredPosts.map((data) => ({ type: 'post' as const, data })),
        ...filteredExperts.map((data) => ({ type: 'expert' as const, data })),
      ];

      setSearchResults(allResults);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 处理搜索提交
  const handleSearchSubmit = () => {
    performSearch(searchText);
  };

  // 处理点击历史记录或热门搜索
  const handleClickSearchTag = (keyword: string) => {
    setSearchText(keyword);
    performSearch(keyword);
  };

  // 处理Feed项点击
  const handleFeedItemPress = (feedItem: FeedItem) => {
    switch (feedItem.type) {
      case 'job':
        navigation.navigate('JobDetail', { jobId: feedItem.data.id });
        break;
      case 'item':
        navigation.navigate('SecondHandDetail', { itemId: feedItem.data.id });
        break;
      case 'post':
        navigation.navigate('PostDetail', { postId: feedItem.data.id });
        break;
      case 'expert':
        navigation.navigate('ExpertDetail', { expertId: feedItem.data.id });
        break;
    }
  };

  // 获取当前Tab的结果
  const getFilteredResults = (): FeedItem[] => {
    if (activeTab === 'all') {
      return searchResults;
    }
    return searchResults.filter((item) => item.type === activeTab);
  };

  const filteredResults = getFilteredResults();

  // 统计各类型数量
  const getTypeCount = (type: SearchResultType): number => {
    if (type === 'all') return searchResults.length;
    return searchResults.filter((item) => item.type === type).length;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 搜索栏 */}
      <View backgroundColor="white" paddingHorizontal="$4" paddingVertical="$3">
        <XStack space="$3" alignItems="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              width={32}
              height={32}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={COLORS.text} />
            </View>
          </TouchableOpacity>

          <View
            flex={1}
            backgroundColor="$background"
            borderRadius="$6"
            paddingHorizontal="$3"
            paddingVertical="$2"
          >
            <XStack space="$2" alignItems="center">
              <Search size={18} color={COLORS.textSecondary} />
              <Input
                flex={1}
                placeholder="搜索服务、商品、内容..."
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearchSubmit}
                fontSize="$3"
                borderWidth={0}
                backgroundColor="transparent"
                paddingHorizontal={0}
                paddingVertical={0}
                returnKeyType="search"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <X size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </XStack>
          </View>

          <TouchableOpacity onPress={handleSearchSubmit}>
            <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
              搜索
            </Text>
          </TouchableOpacity>
        </XStack>
      </View>

      {!hasSearched ? (
        /* 搜索前显示：历史记录 + 热门搜索 */
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <View backgroundColor="white" padding="$4" marginBottom="$2">
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <XStack space="$2" alignItems="center">
                  <Clock size={18} color={COLORS.textSecondary} />
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    搜索历史
                  </Text>
                </XStack>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text fontSize="$3" color={COLORS.textSecondary}>
                    清空
                  </Text>
                </TouchableOpacity>
              </XStack>

              <XStack flexWrap="wrap" gap="$2">
                {searchHistory.map((keyword, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleClickSearchTag(keyword)}
                  >
                    <View
                      backgroundColor="$background"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                    >
                      <Text fontSize="$3" color="$text">
                        {keyword}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>
          )}

          {/* 热门搜索 */}
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <XStack space="$2" alignItems="center" marginBottom="$3">
              <TrendingUp size={18} color={COLORS.error} />
              <Text fontSize="$4" fontWeight="600" color="$text">
                热门搜索
              </Text>
            </XStack>

            <XStack flexWrap="wrap" gap="$2">
              {hotSearchTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClickSearchTag(tag)}
                >
                  <View
                    backgroundColor={index < 3 ? `${COLORS.error}15` : '$background'}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    borderWidth={index < 3 ? 1 : 0}
                    borderColor={index < 3 ? `${COLORS.error}40` : 'transparent'}
                  >
                    <Text
                      fontSize="$3"
                      color={index < 3 ? COLORS.error : '$text'}
                      fontWeight={index < 3 ? '600' : '400'}
                    >
                      {tag}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>
          </View>
        </ScrollView>
      ) : (
        /* 搜索后显示：分类Tab + 结果列表 */
        <View flex={1}>
          {/* 分类Tab */}
          <View backgroundColor="white" paddingVertical="$2" marginBottom="$2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack space="$3" paddingHorizontal="$4">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'job', label: '零工' },
                  { key: 'item', label: '二手' },
                  { key: 'post', label: '内容' },
                  { key: 'expert', label: '达人' },
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key as SearchResultType)}
                  >
                    <View
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$3"
                      backgroundColor={
                        activeTab === tab.key ? `${COLORS.primary}20` : 'transparent'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={activeTab === tab.key ? COLORS.primary : '$textSecondary'}
                        fontWeight={activeTab === tab.key ? '600' : '400'}
                      >
                        {tab.label} ({getTypeCount(tab.key as SearchResultType)})
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </ScrollView>
          </View>

          {/* 搜索结果列表 */}
          {isSearching ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <Text fontSize="$4" color="$textSecondary">
                搜索中...
              </Text>
            </View>
          ) : filteredResults.length === 0 ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <Search size={64} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$textSecondary" marginTop="$4">
                未找到相关结果
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                换个关键词试试吧
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredResults}
              renderItem={({ item }) => (
                <CommunityFeedCard
                  feedItem={item}
                  onPress={() => handleFeedItemPress(item)}
                />
              )}
              keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
