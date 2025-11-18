import React, { useState, useEffect } from 'react';
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
import { Search, PenLine, Plus, X, FileText, Package, Briefcase } from 'lucide-react-native';
import { Pressable, FlatList, RefreshControl, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, Modal } from 'react-native';
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
  getJobs,
  getSecondHandItems,
  getPosts,
  getExperts,
  initializeCommunityData,
} from '@/services/communityDataService';

interface CommunityScreenProps {
  navigation: any;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [jobFeedItems, setJobFeedItems] = useState<FeedItem[]>([]);
  const [itemFeedItems, setItemFeedItems] = useState<FeedItem[]>([]);
  const [nearbyFeedItems, setNearbyFeedItems] = useState<FeedItem[]>([]);
  const [contentFeedItems, setContentFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const PAGE_SIZE = 10;

  // 加载Banner数据
  useEffect(() => {
    const initializeAndLoadData = async () => {
      try {
        // 首先初始化社区数据（如果还没有的话）
        await initializeCommunityData();

        // 然后加载各类数据
        await loadBanners();
        await loadFeedData();
        await loadJobFeedData();
        await loadItemFeedData();
        await loadNearbyFeedData();
        await loadContentFeedData();
      } catch (error) {
        console.error('初始化社区数据失败:', error);
      }
    };

    initializeAndLoadData();
  }, []);

  const loadBanners = async () => {
    try {
      const bannerData = await getBanners();
      setBanners(bannerData);
    } catch (error) {
      console.error('加载Banner失败:', error);
    }
  };

  // 加载Feed数据（混合内容）
  const loadFeedData = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      // 并行加载各类数据
      const [jobs, items, posts, experts] = await Promise.all([
        getJobs({}),
        getSecondHandItems({}),
        getPosts(),
        getExperts({}),
      ]);

      // 混合所有数据
      const allMixed: FeedItem[] = [
        ...jobs.map((data) => ({ type: 'job' as const, data })),
        ...items.map((data) => ({ type: 'item' as const, data })),
        ...posts.map((data) => ({ type: 'post' as const, data })),
        ...experts.map((data) => ({ type: 'expert' as const, data })),
      ];

      // 打乱顺序
      const shuffled = allMixed.sort(() => Math.random() - 0.5);

      // 分页处理
      const startIndex = (pageNum - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedData = shuffled.slice(startIndex, endIndex);

      // 判断是否还有更多数据
      const hasMoreData = endIndex < shuffled.length;
      setHasMore(hasMoreData);

      // 更新数据
      if (pageNum === 1) {
        setFeedItems(paginatedData);
      } else {
        setFeedItems(prev => [...prev, ...paginatedData]);
      }

      setPage(pageNum);
    } catch (error) {
      console.error('加载Feed数据失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 加载更多Feed数据
  const loadMoreFeedData = async () => {
    if (loadingMore || !hasMore) return;
    await loadFeedData(page + 1);
  };

  // 加载邻里帮Feed数据
  const loadJobFeedData = async () => {
    try {
      const jobs = await getJobs({});
      const jobFeeds: FeedItem[] = jobs.map((data) => ({ type: 'job' as const, data }));
      setJobFeedItems(jobFeeds);
    } catch (error) {
      console.error('加载邻里帮数据失败:', error);
    }
  };

  // 加载邻里闲物Feed数据
  const loadItemFeedData = async () => {
    try {
      const items = await getSecondHandItems({});
      const itemFeeds: FeedItem[] = items.map((data) => ({ type: 'item' as const, data }));
      setItemFeedItems(itemFeeds);
    } catch (error) {
      console.error('加载邻里闲物数据失败:', error);
    }
  };

  // 加载内容Feed数据（帖子+视频等）
  const loadContentFeedData = async () => {
    try {
      const posts = await getPosts();
      const contentFeeds: FeedItem[] = posts.map((data) => ({ type: 'post' as const, data }));
      setContentFeedItems(contentFeeds);
    } catch (error) {
      console.error('加载内容数据失败:', error);
    }
  };

  // 加载附近Feed数据（模拟距离，混合所有类型）
  const loadNearbyFeedData = async () => {
    try {
      const [jobs, items, posts, experts] = await Promise.all([
        getJobs({}),
        getSecondHandItems({}),
        getPosts(),
        getExperts({}),
      ]);

      // 模拟添加距离信息（随机0.5-3km）
      const addDistance = <T extends any>(item: T) => ({
        ...item,
        distance: (Math.random() * 2.5 + 0.5).toFixed(1), // 0.5-3.0km
      });

      // 混合所有类型，模拟附近内容
      const mixed: FeedItem[] = [
        ...jobs.slice(0, 4).map((data) => ({ type: 'job' as const, data: addDistance(data) })),
        ...items.slice(0, 4).map((data) => ({ type: 'item' as const, data: addDistance(data) })),
        ...posts.slice(0, 2).map((data) => ({ type: 'post' as const, data: addDistance(data) })),
        ...experts.slice(0, 2).map((data) => ({ type: 'expert' as const, data: addDistance(data) })),
      ];

      // 按距离排序
      const sorted = mixed.sort((a, b) => {
        const distA = parseFloat(a.data.distance || '999');
        const distB = parseFloat(b.data.distance || '999');
        return distA - distB;
      });

      setNearbyFeedItems(sorted);
    } catch (error) {
      console.error('加载附近数据失败:', error);
    }
  };

  // 处理下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);

    // 根据当前Tab刷新对应数据
    switch (activeTab) {
      case 'recommend':
        await loadFeedData(1);
        break;
      case 'jobs':
        await loadJobFeedData();
        break;
      case 'secondhand':
        await loadItemFeedData();
        break;
      case 'nearby':
        await loadNearbyFeedData();
        break;
      case 'content':
        await loadContentFeedData();
        break;
      default:
        await loadFeedData();
    }

    setRefreshing(false);
  };

  // 处理Banner点击
  const handleBannerPress = (banner: BannerItem) => {
    if (banner.link) {
      navigation.navigate(banner.link as never, banner.linkId ? { id: banner.linkId } : undefined);
    }
  };

  // 处理圆形导航点击
  const handleNavItemPress = (item: CircleNavItem) => {
    // 特殊处理：附近服务切换到附近Tab
    if (item.route === 'nearby-tab') {
      setActiveTab('nearby');
      return;
    }
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

  // 处理滚动事件（实现上拉加载更多）
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 20;

    // 检测是否接近底部
    const isCloseToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - paddingToBottom;

    if (isCloseToBottom && activeTab === 'recommend') {
      loadMoreFeedData();
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <YStack space="$4">
            {/* Header */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$4"
              paddingTop="$3"
            >
              <YStack>
                <H1 fontSize="$9" fontWeight="bold" color="$text">
                  社区
                </H1>
                <Text fontSize="$4" color="$textSecondary">
                  邻里互助，温暖生活
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
              <View paddingHorizontal="$4">
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
                  />
                </XStack>
              </View>
            </Pressable>

            {/* Banner轮播图 */}
            <BannerSlider banners={banners} onBannerPress={handleBannerPress} />

            {/* 圆形功能导航区 */}
            <CircleNavigation
              items={defaultCircleNavItems}
              onItemPress={handleNavItemPress}
            />

            {/* Tab切换栏 */}
            <View paddingHorizontal="$4">
              <XStack
                backgroundColor="$surface"
                borderRadius="$3"
                padding="$1"
                marginBottom="$4"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('recommend')}
                >
                  <View
                    flex={1}
                    height={36}
                    backgroundColor={
                      activeTab === 'recommend' ? COLORS.primary : 'transparent'
                    }
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$2"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'recommend' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'recommend' ? '600' : '400'}
                    >
                      发现
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('jobs')}
                >
                  <View
                    flex={1}
                    height={36}
                    backgroundColor={
                      activeTab === 'jobs' ? COLORS.primary : 'transparent'
                    }
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$2"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'jobs' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'jobs' ? '600' : '400'}
                    >
                      邻里帮
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('secondhand')}
                >
                  <View
                    flex={1}
                    height={36}
                    backgroundColor={
                      activeTab === 'secondhand' ? COLORS.primary : 'transparent'
                    }
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$2"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'secondhand' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'secondhand' ? '600' : '400'}
                    >
                      邻里闲物
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('nearby')}
                >
                  <View
                    flex={1}
                    height={36}
                    backgroundColor={
                      activeTab === 'nearby' ? COLORS.primary : 'transparent'
                    }
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$2"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'nearby' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'nearby' ? '600' : '400'}
                    >
                      附近
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('content')}
                >
                  <View
                    flex={1}
                    height={36}
                    backgroundColor={
                      activeTab === 'content' ? COLORS.primary : 'transparent'
                    }
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$2"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'content' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'content' ? '600' : '400'}
                    >
                      分享
                    </Text>
                  </View>
                </Pressable>
              </XStack>
            </View>

            {/* Tab Content */}
            <View paddingHorizontal="$4">
              {activeTab === 'recommend' && (
                <View marginBottom="$8">
                  {loading && feedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$surface"
                      borderRadius="$4"
                    >
                      <Text fontSize="$4" color="$textSecondary">
                        加载中...
                      </Text>
                    </YStack>
                  ) : feedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$surface"
                      borderRadius="$4"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        📭
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$text"
                        marginBottom="$2"
                      >
                        暂无内容
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" textAlign="center">
                        下拉刷新试试看
                      </Text>
                    </YStack>
                  ) : (
                    <FlatList
                      data={feedItems}
                      renderItem={({ item }) => (
                        <CommunityFeedCard
                          feedItem={item}
                          onPress={() => handleFeedItemPress(item)}
                        />
                      )}
                      keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={handleRefresh}
                        />
                      }
                      onEndReached={loadMoreFeedData}
                      onEndReachedThreshold={0.5}
                      ListFooterComponent={
                        loadingMore ? (
                          <View paddingVertical="$4" alignItems="center">
                            <Text fontSize="$3" color="$textSecondary">
                              加载更多...
                            </Text>
                          </View>
                        ) : !hasMore ? (
                          <View paddingVertical="$4" alignItems="center">
                            <Text fontSize="$3" color="$textSecondary">
                              没有更多内容了
                            </Text>
                          </View>
                        ) : null
                      }
                      scrollEnabled={false}
                      // 性能优化配置
                      initialNumToRender={5}
                      maxToRenderPerBatch={5}
                      windowSize={5}
                      removeClippedSubviews={true}
                      updateCellsBatchingPeriod={50}
                    />
                  )}
                </View>
              )}
              {activeTab === 'jobs' && (
                <View marginBottom="$8">
                  {jobFeedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$surface"
                      borderRadius="$4"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        🤝
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$text"
                        marginBottom="$2"
                      >
                        暂无服务需求
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" textAlign="center">
                        下拉刷新或发布第一个需求
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          邻里帮服务大厅
                        </Text>
                        <Pressable onPress={() => navigation.navigate('JobList' as never)}>
                          <Text fontSize="$3" color={COLORS.primary}>
                            查看全部 →
                          </Text>
                        </Pressable>
                      </XStack>
                      <FlatList
                        data={jobFeedItems}
                        renderItem={({ item }) => (
                          <CommunityFeedCard
                            feedItem={item}
                            onPress={() => handleFeedItemPress(item)}
                          />
                        )}
                        keyExtractor={(item, index) => `job-${item.data.id}-${index}`}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                          />
                        }
                        scrollEnabled={false}
                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        removeClippedSubviews={true}
                      />
                    </>
                  )}
                </View>
              )}
              {activeTab === 'secondhand' && (
                <View marginBottom="$8">
                  {itemFeedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$surface"
                      borderRadius="$4"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        🛒
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$text"
                        marginBottom="$2"
                      >
                        暂无闲置商品
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" textAlign="center">
                        下拉刷新或发布第一个闲置
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          邻里闲物市场
                        </Text>
                        <Pressable onPress={() => navigation.navigate('SecondHandList' as never)}>
                          <Text fontSize="$3" color={COLORS.primary}>
                            查看全部 →
                          </Text>
                        </Pressable>
                      </XStack>
                      <FlatList
                        data={itemFeedItems}
                        renderItem={({ item }) => (
                          <CommunityFeedCard
                            feedItem={item}
                            onPress={() => handleFeedItemPress(item)}
                          />
                        )}
                        keyExtractor={(item, index) => `item-${item.data.id}-${index}`}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                          />
                        }
                        scrollEnabled={false}
                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        removeClippedSubviews={true}
                      />
                    </>
                  )}
                </View>
              )}
              {activeTab === 'nearby' && (
                <View marginBottom="$8">
                  {nearbyFeedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$surface"
                      borderRadius="$4"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        📍
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$text"
                        marginBottom="$2"
                      >
                        暂无附近内容
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" textAlign="center">
                        下拉刷新试试看
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom="$3"
                      >
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          附近3公里内容 ({nearbyFeedItems.length})
                        </Text>
                        <Text fontSize="$3" color="$textSecondary">
                          按距离排序
                        </Text>
                      </XStack>
                      <FlatList
                        data={nearbyFeedItems}
                        renderItem={({ item }) => (
                          <CommunityFeedCard
                            feedItem={item}
                            onPress={() => handleFeedItemPress(item)}
                          />
                        )}
                        keyExtractor={(item, index) => `nearby-${item.data.id}-${index}`}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                          />
                        }
                        scrollEnabled={false}
                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        removeClippedSubviews={true}
                      />
                    </>
                  )}
                </View>
              )}
              {activeTab === 'content' && (
                <View marginBottom="$8">
                  {contentFeedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$surface"
                      borderRadius="$4"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        📖
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$text"
                        marginBottom="$2"
                      >
                        暂无内容
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" textAlign="center">
                        下拉刷新试试看
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          邻里分享
                        </Text>
                        <Pressable onPress={() => navigation.navigate('ArticleList' as never)}>
                          <Text fontSize="$3" color={COLORS.primary}>
                            查看全部 →
                          </Text>
                        </Pressable>
                      </XStack>
                      <FlatList
                        data={contentFeedItems}
                        renderItem={({ item }) => (
                          <CommunityFeedCard
                            feedItem={item}
                            onPress={() => handleFeedItemPress(item)}
                          />
                        )}
                        keyExtractor={(item, index) => `content-${item.data.id}-${index}`}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                          />
                        }
                        scrollEnabled={false}
                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        removeClippedSubviews={true}
                      />
                    </>
                  )}
                </View>
              )}
            </View>

            {/* Bottom padding for safe area */}
            <View height={20} />
          </YStack>
        </ScrollView>

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
              onPress={(e) => e.stopPropagation()}
              style={{ width: '85%' }}
            >
              <View
                backgroundColor="white"
                borderRadius="$5"
                padding="$5"
                shadowColor="black"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.25}
                shadowRadius={3.84}
              >
                {/* 关闭按钮 */}
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                  <Text fontSize="$6" fontWeight="700" color="$text">
                    发布内容
                  </Text>
                  <TouchableOpacity onPress={handleClosePublishMenu}>
                    <View
                      width={32}
                      height={32}
                      borderRadius={16}
                      backgroundColor="$background"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <X size={18} color={COLORS.textSecondary} />
                    </View>
                  </TouchableOpacity>
                </XStack>

                {/* 发布选项 */}
                <YStack space="$3">
                  {/* 发布服务需求 */}
                  <TouchableOpacity onPress={handlePublishJob}>
                    <View
                      backgroundColor="$surface"
                      borderRadius="$4"
                      padding="$4"
                      borderWidth={1}
                      borderColor="$borderColor"
                    >
                      <XStack space="$3" alignItems="center">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${COLORS.primary}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Briefcase size={24} color={COLORS.primary} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                            发布服务需求
                          </Text>
                          <Text fontSize="$3" color="$textSecondary">
                            寻找邻里帮助，发布服务需求
                          </Text>
                        </YStack>
                      </XStack>
                    </View>
                  </TouchableOpacity>

                  {/* 发布闲置物品 */}
                  <TouchableOpacity onPress={handlePublishItem}>
                    <View
                      backgroundColor="$surface"
                      borderRadius="$4"
                      padding="$4"
                      borderWidth={1}
                      borderColor="$borderColor"
                    >
                      <XStack space="$3" alignItems="center">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${COLORS.success}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Package size={24} color={COLORS.success} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                            发布闲置物品
                          </Text>
                          <Text fontSize="$3" color="$textSecondary">
                            分享闲置好物，循环利用资源
                          </Text>
                        </YStack>
                      </XStack>
                    </View>
                  </TouchableOpacity>

                  {/* 发布文章 */}
                  <TouchableOpacity onPress={handlePublishPost}>
                    <View
                      backgroundColor="$surface"
                      borderRadius="$4"
                      padding="$4"
                      borderWidth={1}
                      borderColor="$borderColor"
                    >
                      <XStack space="$3" alignItems="center">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${COLORS.warning}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <FileText size={24} color={COLORS.warning} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                            发布文章
                          </Text>
                          <Text fontSize="$3" color="$textSecondary">
                            分享生活经验，记录健康心得
                          </Text>
                        </YStack>
                      </XStack>
                    </View>
                  </TouchableOpacity>
                </YStack>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </Theme>
  );
};
