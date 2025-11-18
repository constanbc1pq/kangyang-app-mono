/**
 * 社区Feed流主界面
 * 集成智能推荐算法，显示混合内容流
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  H1,
  Theme,
  ScrollView,
  Input,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus } from 'lucide-react-native';
import {
  Pressable,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { COLORS } from '@/constants/app';
import { BannerSlider, BannerItem } from '@/components/BannerSlider';
import {
  CircleNavigation,
  CircleNavItem,
  defaultCircleNavItems,
} from '@/components/CircleNavigation';
import { CommunityFeedCard, FeedItem } from '@/components/CommunityFeedCard';
import {
  getBanners,
  getRecommendedFeed,
  initializeCommunityData,
} from '@/services/communityDataService';
import {
  ServiceJob,
  SecondHandItem,
  CommunityPost,
  Expert,
} from '@/types/community';

interface CommunityFeedScreenProps {
  navigation: any;
  route?: any;
}

export const CommunityFeedScreen: React.FC<CommunityFeedScreenProps> = ({
  navigation,
  route,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [feedData, setFeedData] = useState<Array<ServiceJob | SecondHandItem | CommunityPost | Expert>>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showPublishMenu, setShowPublishMenu] = useState(false);

  const PAGE_SIZE = 10;
  const MOCK_USER_ID = 'user_001'; // 模拟用户ID
  const MOCK_USER_LOCATION = { latitude: 39.9093, longitude: 116.4578 }; // 模拟用户位置（北京）

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        // 初始化社区数据（如果还没有的话）
        await initializeCommunityData();

        // 加载Banner和Feed数据
        await Promise.all([
          loadBanners(),
          loadRecommendedFeed(1),
        ]);
      } catch (error) {
        console.error('初始化社区Feed失败:', error);
      }
    };

    initializeData();
  }, []);

  // 加载Banner数据
  const loadBanners = async () => {
    try {
      const bannerData = await getBanners();
      setBanners(bannerData);
    } catch (error) {
      console.error('加载Banner失败:', error);
    }
  };

  // 加载推荐Feed数据
  const loadRecommendedFeed = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      // 调用推荐算法
      const recommendedData = await getRecommendedFeed(
        MOCK_USER_ID,
        MOCK_USER_LOCATION
      );

      // 分页处理
      const startIndex = (pageNum - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedData = recommendedData.slice(startIndex, endIndex);

      // 判断是否还有更多数据
      const hasMoreData = endIndex < recommendedData.length;
      setHasMore(hasMoreData);

      // 更新数据
      if (pageNum === 1) {
        setFeedData(paginatedData);
      } else {
        setFeedData(prev => [...prev, ...paginatedData]);
      }

      setPage(pageNum);
    } catch (error) {
      console.error('加载推荐Feed失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 加载更多Feed数据
  const loadMoreFeedData = async () => {
    if (loadingMore || !hasMore || loading) return;
    await loadRecommendedFeed(page + 1);
  };

  // 处理下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);

    await Promise.all([
      loadBanners(),
      loadRecommendedFeed(1),
    ]);

    setRefreshing(false);
  }, []);

  // 处理Banner点击
  const handleBannerPress = (banner: BannerItem) => {
    if (banner.link) {
      navigation.navigate(banner.link as never, banner.linkId ? { id: banner.linkId } : undefined);
    }
  };

  // 处理圆形导航点击
  const handleNavItemPress = (item: CircleNavItem) => {
    navigation.navigate(item.route as never, item.params);
  };

  // 处理搜索
  const handleSearch = () => {
    navigation.navigate('Search');
  };

  // 打开发布菜单
  const handleOpenPublishMenu = () => {
    setShowPublishMenu(true);
  };

  // 关闭发布菜单
  const handleClosePublishMenu = () => {
    setShowPublishMenu(false);
  };

  // 发布服务需求
  const handlePublishJob = () => {
    setShowPublishMenu(false);
    navigation.navigate('JobPublish' as never);
  };

  // 发布闲置物品
  const handlePublishItem = () => {
    setShowPublishMenu(false);
    navigation.navigate('SecondHandPublish' as never);
  };

  // 发布文章
  const handlePublishPost = () => {
    setShowPublishMenu(false);
    navigation.navigate('PostPublish' as never);
  };

  // 处理Feed卡片点击
  const handleFeedItemPress = (item: ServiceJob | SecondHandItem | CommunityPost | Expert) => {
    // 判断数据类型
    if ('jobType' in item) {
      // ServiceJob
      navigation.navigate('JobDetail', { jobId: item.id });
    } else if ('category' in item && 'condition' in item) {
      // SecondHandItem
      navigation.navigate('SecondHandDetail', { itemId: item.id });
    } else if ('content' in item) {
      // CommunityPost
      navigation.navigate('PostDetail', { postId: item.id });
    } else if ('services' in item) {
      // Expert
      navigation.navigate('ExpertDetail', { expertId: item.id });
    }
  };

  // 转换数据为FeedItem格式
  const convertToFeedItem = (item: ServiceJob | SecondHandItem | CommunityPost | Expert): FeedItem => {
    if ('jobType' in item) {
      return { type: 'job', data: item };
    } else if ('category' in item && 'condition' in item) {
      return { type: 'item', data: item };
    } else if ('content' in item) {
      return { type: 'post', data: item };
    } else {
      return { type: 'expert', data: item };
    }
  };

  // 渲染Feed项
  const renderFeedItem = ({ item }: ListRenderItemInfo<ServiceJob | SecondHandItem | CommunityPost | Expert>) => {
    const feedItem = convertToFeedItem(item);
    return (
      <CommunityFeedCard
        feedItem={feedItem}
        onPress={() => handleFeedItemPress(item)}
      />
    );
  };

  // 渲染列表头部
  const renderListHeader = () => (
    <YStack>
      {/* Banner轮播图 */}
      <BannerSlider banners={banners} onBannerPress={handleBannerPress} />

      {/* 圆形功能导航区 */}
      <CircleNavigation
        items={defaultCircleNavItems}
        onItemPress={handleNavItemPress}
      />

      {/* Feed标题 */}
      <View paddingHorizontal="$4" paddingTop="$3" paddingBottom="$2">
        <Text fontSize="$5" fontWeight="600" color="$text">
          为你推荐
        </Text>
        <Text fontSize="$3" color="$textSecondary" marginTop="$1">
          基于你的兴趣和位置智能推荐
        </Text>
      </View>
    </YStack>
  );

  // 渲染列表底部（加载更多指示器）
  const renderListFooter = () => {
    if (!loadingMore) return null;

    return (
      <View paddingVertical="$4" alignItems="center">
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text fontSize="$3" color="$textSecondary" marginTop="$2">
          加载中...
        </Text>
      </View>
    );
  };

  // 渲染空状态
  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View paddingVertical="$8" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text fontSize="$4" color="$textSecondary" marginTop="$4">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <YStack
        alignItems="center"
        paddingVertical="$8"
        backgroundColor="$surface"
        borderRadius="$4"
        marginHorizontal="$4"
      >
        <Text fontSize={48} marginBottom="$3">
          🔍
        </Text>
        <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$2">
          暂无推荐内容
        </Text>
        <Text fontSize="$3" color="$textSecondary">
          下拉刷新试试吧
        </Text>
      </YStack>
    );
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$4"
          paddingTop="$3"
          paddingBottom="$2"
          backgroundColor="white"
        >
          <YStack>
            <H1 fontSize="$9" fontWeight="bold" color="$text">
              社区
            </H1>
            <Text fontSize="$4" color="$textSecondary">
              发现精彩生活
            </Text>
          </YStack>

          {/* 发布按钮 */}
          <TouchableOpacity onPress={handleOpenPublishMenu}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Plus size={24} color="white" />
            </View>
          </TouchableOpacity>
        </XStack>

        {/* Search Bar */}
        <Pressable onPress={handleSearch}>
          <View paddingHorizontal="$4" paddingBottom="$3" backgroundColor="white">
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
                placeholder="搜索服务需求、闲置物品..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                marginLeft="$2"
                editable={false}
              />
            </XStack>
          </View>
        </Pressable>

        {/* Feed列表 */}
        <FlatList
          data={feedData}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          onEndReached={loadMoreFeedData}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
        />

        {/* 发布菜单弹窗 */}
        <Modal
          visible={showPublishMenu}
          transparent
          animationType="fade"
          onRequestClose={handleClosePublishMenu}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleClosePublishMenu}
          >
            <Pressable
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 24,
                width: '80%',
                maxWidth: 400,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <YStack space="$3">
                <Text fontSize="$6" fontWeight="600" color="$text" marginBottom="$2">
                  发布内容
                </Text>

                <TouchableOpacity onPress={handlePublishJob}>
                  <XStack
                    space="$3"
                    alignItems="center"
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$surface"
                  >
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={COLORS.primary}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={20}>💼</Text>
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        发布服务需求
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        寻找邻里互助服务
                      </Text>
                    </YStack>
                  </XStack>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePublishItem}>
                  <XStack
                    space="$3"
                    alignItems="center"
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$surface"
                  >
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={COLORS.warning}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={20}>📦</Text>
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        发布闲置物品
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        分享二手好物
                      </Text>
                    </YStack>
                  </XStack>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePublishPost}>
                  <XStack
                    space="$3"
                    alignItems="center"
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$surface"
                  >
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={COLORS.success}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={20}>✍️</Text>
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        发布帖子
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        分享生活点滴
                      </Text>
                    </YStack>
                  </XStack>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleClosePublishMenu}>
                  <View
                    marginTop="$2"
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$borderColor"
                    alignItems="center"
                  >
                    <Text fontSize="$4" fontWeight="600" color="$textSecondary">
                      取消
                    </Text>
                  </View>
                </TouchableOpacity>
              </YStack>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </Theme>
  );
};

export default CommunityFeedScreen;
