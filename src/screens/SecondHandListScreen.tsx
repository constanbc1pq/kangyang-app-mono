/**
 * SecondHandListScreen 邻里闲物 - 二手交易市场
 * 瀑布流商品列表、筛选、搜索
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  useTheme,
} from 'tamagui';
import { RefreshControl, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  ArrowLeft,
  PlusCircle,
  User,
  X,
  Clock,
  TrendingUp,
  Package,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecondHandItem, ItemCategory, ItemCondition } from '@/types/community';
import {
  getSecondHandItems,
  initializeCommunityData,
} from '@/services/communityDataService';
import { SecondHandCard } from '@/components/SecondHandCard';
import { BottomSheet } from '@/components/BottomSheet';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY_ITEM_SEARCH_HISTORY = '@kangyang_item_search_history';

interface SecondHandListScreenProps {
  navigation: any;
}

// 商品分类配置
const categoryOptions = [
  { id: 'all', label: '全部', icon: '📦' },
  { id: ItemCategory.HEALTH_DEVICE, label: '健康设备', icon: '🩺' },
  { id: ItemCategory.FITNESS, label: '健身器材', icon: '💪' },
  { id: ItemCategory.ASSISTIVE, label: '辅助用品', icon: '🦽' },
  { id: ItemCategory.DAILY, label: '日常用品', icon: '🏠' },
  { id: ItemCategory.FURNITURE, label: '家具', icon: '🛋️' },
  { id: ItemCategory.OTHER, label: '其他', icon: '📋' },
];

/**
 * 邻里闲物 - 二手交易市场
 */
export const SecondHandListScreen: React.FC<SecondHandListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [items, setItems] = useState<SecondHandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');

  // 筛选条件
  const [filters, setFilters] = useState<{
    category?: ItemCategory;
    isFree?: boolean;
  }>({});

  // 搜索相关状态
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SecondHandItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 热门搜索标签
  const hotSearchTags = [
    '血压计',
    '轮椅',
    '按摩椅',
    '血糖仪',
    '助听器',
    '护理床',
    '跑步机',
    '制氧机',
  ];

  // 初始化时加载数据
  useEffect(() => {
    loadInitialData();
    loadSearchHistory();
  }, []);

  // 页面聚焦时重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  // 分类或筛选条件变化时重新加载数据
  useEffect(() => {
    loadItems();
  }, [activeCategory, filters]);

  const loadInitialData = async () => {
    try {
      await initializeCommunityData();
      await loadItems();
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const filterParams: any = { ...filters };
      if (activeCategory !== 'all') {
        filterParams.category = activeCategory;
      }
      const itemsData = await getSecondHandItems(filterParams);
      setItems(itemsData);
    } catch (error) {
      console.error('加载商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleItemPress = (itemId: string) => {
    navigation.navigate('SecondHandDetail', { itemId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    setShowSearchSheet(true);
  };

  const handlePublish = () => {
    navigation.navigate('SecondHandPublish' as never);
  };

  const handleMyItems = () => {
    navigation.navigate('MySecondHand' as never);
  };

  const handleCategoryPress = (category: ItemCategory | 'all') => {
    setActiveCategory(category);
  };

  // 搜索相关函数
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEY_ITEM_SEARCH_HISTORY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };

  const saveSearchHistory = async (keyword: string) => {
    try {
      const newHistory = [
        keyword,
        ...searchHistory.filter((item) => item !== keyword),
      ].slice(0, 5);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(
        STORAGE_KEY_ITEM_SEARCH_HISTORY,
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(STORAGE_KEY_ITEM_SEARCH_HISTORY);
    } catch (error) {
      console.error('清空搜索历史失败:', error);
    }
  };

  const performSearch = async (keyword: string) => {
    if (!keyword.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    await saveSearchHistory(keyword.trim());

    try {
      const allItems = await getSecondHandItems({});
      const searchLower = keyword.toLowerCase();

      const filtered = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );

      setSearchResults(filtered);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    performSearch(searchText);
  };

  const handleClickSearchTag = (keyword: string) => {
    setSearchText(keyword);
    performSearch(keyword);
  };

  const handleSearchResultPress = (itemId: string) => {
    setShowSearchSheet(false);
    navigation.navigate('SecondHandDetail', { itemId });
  };

  const handleCloseSearch = () => {
    setShowSearchSheet(false);
    setSearchText('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // 获取成色标签
  const getConditionLabel = (condition: ItemCondition): string => {
    const labels: { [key in ItemCondition]: string } = {
      [ItemCondition.NEW]: '全新',
      [ItemCondition.LIKE_NEW]: '99新',
      [ItemCondition.EXCELLENT]: '95新',
      [ItemCondition.GOOD]: '9成新',
      [ItemCondition.FAIR]: '8成新',
      [ItemCondition.USED]: '有痕迹',
    };
    return labels[condition] || '未知';
  };

  // 渲染分类Tab
  const renderCategoryTabs = () => (
    <View backgroundColor="$color2" paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$color5">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2" paddingHorizontal="$2.5">
          {categoryOptions.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryPress(cat.id as ItemCategory | 'all')}
            >
              <View
                paddingHorizontal="$3"
                paddingVertical="$1.5"
                borderRadius="$10"
                backgroundColor={activeCategory === cat.id ? primaryColor : '$color4'}
              >
                <XStack gap="$1" alignItems="center">
                  <Text fontSize={12}>{cat.icon}</Text>
                  <Text
                    fontSize="$3"
                    color={activeCategory === cat.id ? 'white' : '$color12'}
                    fontWeight={activeCategory === cat.id ? '600' : '400'}
                  >
                    {cat.label}
                  </Text>
                </XStack>
              </View>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>
    </View>
  );

  // 渲染搜索栏
  const renderSearchBar = () => (
    <View paddingHorizontal="$2.5" paddingTop="$2">
      <Pressable onPress={handleSearch}>
        <View
          backgroundColor="$color2"
          borderRadius="$10"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack alignItems="center" gap="$2">
            <Search size={18} color={color10} />
            <Text fontSize="$3" color="$color10">
              搜索康养设备、用品...
            </Text>
          </XStack>
        </View>
      </Pressable>
    </View>
  );

  // 渲染发布横幅
  const renderPublishBanner = () => (
    <Pressable onPress={handlePublish}>
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
        backgroundColor="rgba(107, 91, 123, 0.075)"
        borderRadius="$5"
        padding="$3"
        borderWidth={1}
        borderColor="rgba(107, 91, 123, 0.23)"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <YStack flex={1}>
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
              发布闲置物品
            </Text>
            <Text fontSize="$2" color="$color10">
              让闲置流转起来，帮助有需要的邻居
            </Text>
          </YStack>
          <View
            backgroundColor={primaryColor}
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius="$10"
          >
            <XStack gap="$1" alignItems="center">
              <PlusCircle size={14} color="white" />
              <Text fontSize="$3" color="white" fontWeight="500">
                发布
              </Text>
            </XStack>
          </View>
        </XStack>
      </View>
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
        <Package size={48} color={color10} />
        <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
          暂无商品
        </Text>
        <Text fontSize="$3" color="$color10" marginTop="$1">
          {Object.keys(filters).length > 0
            ? '没有符合条件的商品，试试调整筛选'
            : '来发布第一个闲置物品吧'}
        </Text>
        <Pressable onPress={handlePublish}>
          <View
            marginTop="$3"
            backgroundColor={primaryColor}
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$10"
          >
            <Text fontSize="$3" color="white" fontWeight="500">
              发布商品
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  // 渲染瀑布流布局
  const renderWaterfallLayout = () => {
    if (items.length === 0) {
      return renderEmpty();
    }

    const leftColumn: SecondHandItem[] = [];
    const rightColumn: SecondHandItem[] = [];

    items.forEach((item, index) => {
      if (index % 2 === 0) {
        leftColumn.push(item);
      } else {
        rightColumn.push(item);
      }
    });

    return (
      <XStack gap="$2" alignItems="flex-start" paddingHorizontal="$2.5">
        <YStack flex={1} gap="$2">
          {leftColumn.map((item) => (
            <SecondHandCard key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </YStack>
        <YStack flex={1} gap="$2">
          {rightColumn.map((item) => (
            <SecondHandCard key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </YStack>
      </XStack>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 标准居中 TitleBar */}
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
          <Pressable onPress={handleBack}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            邻里闲物
          </Text>
          <Pressable onPress={handleMyItems}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <User size={22} color={color12} />
            </View>
          </Pressable>
        </XStack>
      </View>

      {/* 搜索栏 */}
      {renderSearchBar()}

      {/* 分类Tab */}
      {renderCategoryTabs()}

      {/* 商品列表 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 发布横幅 */}
        {renderPublishBanner()}

        {/* 全部商品 */}
        <View paddingVertical="$2">
          <XStack justifyContent="space-between" alignItems="center" marginHorizontal="$2.5" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              {activeCategory === 'all' ? '全部商品' : categoryOptions.find(c => c.id === activeCategory)?.label}
            </Text>
            <Text fontSize="$2" color="$color10">
              共{items.length}件
            </Text>
          </XStack>
          {renderWaterfallLayout()}
        </View>

        {/* 底部留白 */}
        <View height={20} />
      </ScrollView>

      {/* 搜索 BottomSheet */}
      <BottomSheet
        visible={showSearchSheet}
        onClose={handleCloseSearch}
        title="搜索闲置物品"
        maxHeight="90%"
        scrollable={false}
      >
        <YStack flex={1}>
          {/* 搜索框 */}
          <XStack gap="$2" alignItems="center" marginBottom="$3">
            <View
              flex={1}
              backgroundColor="$color4"
              borderRadius="$10"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <XStack gap="$2" alignItems="center">
                <Search size={18} color={color10} />
                <Input
                  flex={1}
                  placeholder="搜索康养设备、用品..."
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={handleSearchSubmit}
                  fontSize="$3"
                  borderWidth={0}
                  backgroundColor="transparent"
                  paddingHorizontal={0}
                  paddingVertical={0}
                  returnKeyType="search"
                  color="$color12"
                  placeholderTextColor={color10}
                />
                {searchText.length > 0 && (
                  <Pressable onPress={() => setSearchText('')}>
                    <X size={16} color={color10} />
                  </Pressable>
                )}
              </XStack>
            </View>

            <Pressable onPress={handleSearchSubmit}>
              <View
                backgroundColor={primaryColor}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$10"
              >
                <Text fontSize="$3" color="white" fontWeight="500">
                  搜索
                </Text>
              </View>
            </Pressable>
          </XStack>

          {!hasSearched ? (
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <View marginBottom="$3">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <XStack gap="$1.5" alignItems="center">
                      <Clock size={16} color={color10} />
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        搜索历史
                      </Text>
                    </XStack>
                    <Pressable onPress={clearSearchHistory}>
                      <Text fontSize="$2" color="$color10">
                        清空
                      </Text>
                    </Pressable>
                  </XStack>

                  <XStack flexWrap="wrap" gap="$1.5">
                    {searchHistory.map((keyword, index) => (
                      <Pressable key={index} onPress={() => handleClickSearchTag(keyword)}>
                        <View
                          backgroundColor="$color4"
                          paddingHorizontal="$2"
                          paddingVertical="$1.5"
                          borderRadius="$10"
                        >
                          <Text fontSize="$3" color="$color12">
                            {keyword}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </XStack>
                </View>
              )}

              {/* 热门搜索 */}
              <View>
                <XStack gap="$1.5" alignItems="center" marginBottom="$2">
                  <TrendingUp size={16} color={errorColor} />
                  <Text fontSize="$4" fontWeight="600" color="$color12">
                    热门搜索
                  </Text>
                </XStack>

                <XStack flexWrap="wrap" gap="$1.5">
                  {hotSearchTags.map((tag, index) => (
                    <Pressable key={index} onPress={() => handleClickSearchTag(tag)}>
                      <View
                        backgroundColor="$color4"
                        paddingHorizontal="$2"
                        paddingVertical="$1.5"
                        borderRadius="$10"
                        borderWidth={index < 3 ? 1 : 0}
                        borderColor={index < 3 ? errorColor : 'transparent'}
                      >
                        <Text
                          fontSize="$3"
                          color={index < 3 ? errorColor : '$color12'}
                          fontWeight={index < 3 ? '600' : '400'}
                        >
                          {tag}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>
              </View>
            </ScrollView>
          ) : (
            <View flex={1}>
              {isSearching ? (
                <View flex={1} justifyContent="center" alignItems="center">
                  <Text fontSize="$4" color="$color10">
                    搜索中...
                  </Text>
                </View>
              ) : searchResults.length === 0 ? (
                <View flex={1} justifyContent="center" alignItems="center">
                  <Search size={48} color={color10} />
                  <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
                    未找到相关商品
                  </Text>
                  <Text fontSize="$3" color="$color10" marginTop="$1">
                    换个关键词试试吧
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchResults}
                  numColumns={2}
                  columnWrapperStyle={{ gap: 8 }}
                  contentContainerStyle={{ gap: 8 }}
                  renderItem={({ item }) => (
                    <View flex={1}>
                      <SecondHandCard
                        item={item}
                        onPress={() => handleSearchResultPress(item.id)}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}
        </YStack>
      </BottomSheet>
    </View>
  );
};
