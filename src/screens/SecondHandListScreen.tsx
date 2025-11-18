import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
} from 'tamagui';
import { SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { Filter, Search, ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { SecondHandItem, ItemCategory } from '@/types/community';
import { getSecondHandItems, initializeCommunityData } from '@/services/communityDataService';
import { SecondHandCard } from '@/components/SecondHandCard';
import { useFocusEffect } from '@react-navigation/native';

interface SecondHandListScreenProps {
  navigation: any;
}

/**
 * 二手交易市场列表页
 * 类似闲鱼的瀑布流布局
 */
export const SecondHandListScreen: React.FC<SecondHandListScreenProps> = ({ navigation }) => {
  const [items, setItems] = useState<SecondHandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // 筛选条件
  const [filters, setFilters] = useState<{
    category?: ItemCategory;
    isFree?: boolean;
  }>({});

  // 初始化时加载数据
  useEffect(() => {
    loadInitialData();
  }, []);

  // 页面聚焦时重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [filters])
  );

  const loadInitialData = async () => {
    try {
      // 确保社区数据已初始化
      await initializeCommunityData();
      await loadItems();
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const itemsData = await getSecondHandItems(filters);
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
    // TODO: 跳转到搜索页面
    console.log('搜索');
  };

  const handleToggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handlePublishItem = () => {
    navigation.navigate('SecondHandPublish' as never);
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <Text fontSize={48} marginBottom="$3">
          📦
        </Text>
        <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$2">
          暂无商品
        </Text>
        <Text fontSize="$3" color="$textSecondary" textAlign="center">
          {Object.keys(filters).length > 0
            ? '没有符合条件的商品，试试调整筛选条件'
            : '还没有发布的商品，来发布第一个吧'}
        </Text>
        <TouchableOpacity onPress={handlePublishItem}>
          <View
            marginTop="$4"
            backgroundColor={COLORS.primary}
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderRadius="$3"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              发布商品
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // 瀑布流布局：将商品分为左右两列
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
      <XStack space="$3" alignItems="flex-start">
        {/* 左列 */}
        <YStack flex={1} space="$3">
          {leftColumn.map(item => (
            <SecondHandCard key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </YStack>

        {/* 右列 */}
        <YStack flex={1} space="$3">
          {rightColumn.map(item => (
            <SecondHandCard key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </YStack>
      </XStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      <View
        backgroundColor="white"
        paddingTop="$3"
        paddingHorizontal="$4"
        paddingBottom="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack space="$3" alignItems="center" marginBottom="$3">
          {/* 返回按钮 */}
          <TouchableOpacity onPress={handleBack}>
            <View
              width={32}
              height={32}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={COLORS.text} />
            </View>
          </TouchableOpacity>

          {/* 标题 */}
          <YStack flex={1}>
            <Text fontSize="$6" fontWeight="bold" color="$text">
              邻里闲物
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              康养好物，闲置交易
            </Text>
          </YStack>

          {/* 发布按钮 */}
          <TouchableOpacity onPress={handlePublishItem}>
            <View
              backgroundColor={COLORS.primary}
              borderRadius="$3"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <Text fontSize="$3" color="white" fontWeight="600">
                发布
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>

        {/* 搜索和筛选栏 */}
        <XStack space="$2" alignItems="center">
          {/* 搜索按钮 */}
          <TouchableOpacity style={{ flex: 1 }} onPress={handleSearch}>
            <View
              flex={1}
              backgroundColor="$background"
              borderRadius="$3"
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack space="$2" alignItems="center">
                <Search size={18} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$textSecondary">
                  搜索康养设备、用品...
                </Text>
              </XStack>
            </View>
          </TouchableOpacity>

          {/* 筛选按钮 */}
          <TouchableOpacity onPress={handleToggleFilter}>
            <View
              backgroundColor={showFilter ? COLORS.primary : '$background'}
              borderRadius="$3"
              padding="$2"
              borderWidth={1}
              borderColor={showFilter ? COLORS.primary : '$borderColor'}
            >
              <XStack space="$1" alignItems="center">
                <Filter size={18} color={showFilter ? 'white' : COLORS.textSecondary} />
                {Object.keys(filters).length > 0 && (
                  <View
                    width={6}
                    height={6}
                    borderRadius={3}
                    backgroundColor={COLORS.error}
                    position="absolute"
                    top={2}
                    right={2}
                  />
                )}
              </XStack>
            </View>
          </TouchableOpacity>
        </XStack>

        {/* 筛选标签显示 */}
        {Object.keys(filters).length > 0 && (
          <XStack marginTop="$2" flexWrap="wrap" gap="$2">
            {filters.category && (
              <View
                backgroundColor={`${COLORS.primary}20`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={COLORS.primary}>
                  {filters.category}
                </Text>
              </View>
            )}
            {filters.isFree && (
              <View
                backgroundColor={`${COLORS.success}20`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={COLORS.success}>
                  免费赠送
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setFilters({})}>
              <View
                backgroundColor="$background"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$textSecondary">
                  清除
                </Text>
              </View>
            </TouchableOpacity>
          </XStack>
        )}
      </View>

      {/* 筛选面板 */}
      {showFilter && (
        <View
          backgroundColor="white"
          padding="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            筛选条件
          </Text>

          {/* 商品类目快捷筛选 */}
          <View marginBottom="$3">
            <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
              商品类目
            </Text>
            <XStack flexWrap="wrap" gap="$2">
              {[
                { label: '健康设备', value: ItemCategory.HEALTH_DEVICE },
                { label: '康养用品', value: ItemCategory.WELLNESS_SUPPLY },
                { label: '运动器材', value: ItemCategory.FITNESS_EQUIPMENT },
                { label: '营养保健', value: ItemCategory.NUTRITION },
                { label: '生活用品', value: ItemCategory.DAILY_SUPPLY },
                { label: '其他', value: ItemCategory.OTHER },
              ].map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => {
                    setFilters({
                      ...filters,
                      category: filters.category === cat.value ? undefined : cat.value,
                    });
                  }}
                >
                  <View
                    backgroundColor={
                      filters.category === cat.value ? COLORS.primary : '$background'
                    }
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={filters.category === cat.value ? COLORS.primary : '$borderColor'}
                  >
                    <Text
                      fontSize="$3"
                      color={filters.category === cat.value ? 'white' : '$text'}
                    >
                      {cat.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>
          </View>

          {/* 免费赠送开关 */}
          <View marginBottom="$3">
            <TouchableOpacity
              onPress={() => {
                setFilters({
                  ...filters,
                  isFree: filters.isFree ? undefined : true,
                });
              }}
            >
              <XStack space="$2" alignItems="center">
                <View
                  width={20}
                  height={20}
                  borderRadius={4}
                  borderWidth={2}
                  borderColor={filters.isFree ? COLORS.primary : '$borderColor'}
                  backgroundColor={filters.isFree ? COLORS.primary : 'transparent'}
                  justifyContent="center"
                  alignItems="center"
                >
                  {filters.isFree && <Text color="white">✓</Text>}
                </View>
                <Text fontSize="$3" color="$text">
                  只显示免费赠送
                </Text>
              </XStack>
            </TouchableOpacity>
          </View>

          {/* 操作按钮 */}
          <XStack space="$2" marginTop="$3">
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setFilters({});
                setShowFilter(false);
              }}
            >
              <View
                flex={1}
                backgroundColor="$background"
                borderRadius="$3"
                paddingVertical="$2"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$3" color="$text">
                  重置
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setShowFilter(false);
                loadItems();
              }}
            >
              <View
                flex={1}
                backgroundColor={COLORS.primary}
                borderRadius="$3"
                paddingVertical="$2"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$3" color="white" fontWeight="600">
                  确定
                </Text>
              </View>
            </TouchableOpacity>
          </XStack>
        </View>
      )}

      {/* 商品列表（瀑布流） */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View padding="$3">
          {renderWaterfallLayout()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
