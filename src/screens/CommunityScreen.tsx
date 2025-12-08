import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, FileText, Package, Briefcase, ChevronRight } from 'lucide-react-native';
import { Pressable, FlatList, RefreshControl, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheet, BottomSheetItem } from '@/components/BottomSheet';
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
  getConversations,
  initializeCommunityData,
} from '@/services/communityDataService';

interface CommunityScreenProps {
  navigation: any;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;

  // 渐变背景颜色：左上浅绿 -> 右下暗紫
  const gradientColors = ['#d6dece', '#e8e6eb', primaryColor] as const;

  const [activeTab, setActiveTab] = useState('recommend');
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [jobFeedItems, setJobFeedItems] = useState<FeedItem[]>([]);
  const [itemFeedItems, setItemFeedItems] = useState<FeedItem[]>([]);
  const [nearbyFeedItems, setNearbyFeedItems] = useState<FeedItem[]>([]);
  const [expertFeedItems, setExpertFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [scrollKey, setScrollKey] = useState(0); // 用于强制刷新ScrollView
  const PAGE_SIZE = 10;

  // 页面重新获得焦点时，强制刷新ScrollView以修复滚动问题
  useFocusEffect(
    React.useCallback(() => {
      // 增加key值，强制ScrollView重新渲染
      setScrollKey(prev => prev + 1);
    }, [])
  );

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
        await loadExpertFeedData();
        await loadUnreadMessageCount();
      } catch (error) {
        console.error('初始化社区数据失败:', error);
      }
    };

    initializeAndLoadData();
  }, []);

  // 加载未读消息数量
  const loadUnreadMessageCount = async () => {
    try {
      const conversations = await getConversations();
      const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      setUnreadMessageCount(totalUnread);
    } catch (error) {
      console.error('加载未读消息数失败:', error);
    }
  };

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

  // 加载达人Feed数据
  const loadExpertFeedData = async () => {
    try {
      const experts = await getExperts({});
      const expertFeeds: FeedItem[] = experts.map((data) => ({ type: 'expert' as const, data }));
      setExpertFeedItems(expertFeeds);
    } catch (error) {
      console.error('加载达人数据失败:', error);
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
      case 'expert':
        await loadExpertFeedData();
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
    navigation.navigate(item.route as never, item.params);
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
    // 延迟导航确保modal完全关闭
    setTimeout(() => {
      navigation.navigate('JobPublish' as never);
    }, 100);
  };

  // 发布闲置物品
  const handlePublishItem = () => {
    setShowPublishMenu(false);
    setTimeout(() => {
      navigation.navigate('SecondHandPublish' as never);
    }, 100);
  };

  // 发布文章
  const handlePublishPost = () => {
    setShowPublishMenu(false);
    setTimeout(() => {
      navigation.navigate('PostPublish' as never);
    }, 100);
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
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <View flex={1}>
        <ScrollView
          key={`community-scroll-${scrollKey}`}
          flex={1}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: insets.top }}
        >
          <YStack gap="$2">
            {/* Header - 左上角主副标题样式 */}
            <View paddingHorizontal="$2.5" paddingTop="$2" paddingBottom="$2">
              <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack flex={1} gap="$0.5" marginRight="$2">
                  <Text fontSize="$6" fontWeight="700" color="$color12">
                    邻里互助，温暖生活
                  </Text>
                  <Text fontSize="$2" color="$color10" numberOfLines={1}>
                    九紫生活社区
                  </Text>
                </YStack>
                {/* 发布按钮 */}
                <Pressable onPress={handleOpenPublishMenu}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="white"
                    justifyContent="center"
                    alignItems="center"
                    shadowColor="$color12"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={4}
                    elevation={2}
                  >
                    <Plus size={20} color={primaryColor} />
                  </View>
                </Pressable>
              </XStack>
            </View>

            {/* Banner轮播图 */}
            <BannerSlider banners={banners} onBannerPress={handleBannerPress} />

            {/* 圆形功能导航区 */}
            <CircleNavigation
              items={defaultCircleNavItems.map(item =>
                item.id === 'message'
                  ? { ...item, badge: unreadMessageCount }
                  : item
              )}
              onItemPress={handleNavItemPress}
            />

            {/* Tab切换栏 */}
            <View paddingHorizontal="$2.5">
              <XStack
                backgroundColor="$color4"
                borderRadius="$10"
                padding="$1"
                marginBottom="$2"
              >
                {[
                  { key: 'recommend', label: '发现' },
                  { key: 'jobs', label: '邻里帮' },
                  { key: 'secondhand', label: '闲物' },
                  { key: 'nearby', label: '附近' },
                  { key: 'expert', label: '达人' },
                ].map(tab => (
                  <Pressable
                    key={tab.key}
                    style={{ flex: 1 }}
                    onPress={() => setActiveTab(tab.key)}
                  >
                    <View
                      flex={1}
                      height={36}
                      backgroundColor={activeTab === tab.key ? primaryColor : 'transparent'}
                      borderRadius="$10"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text
                        fontSize="$3"
                        color={activeTab === tab.key ? 'white' : '$color10'}
                        fontWeight={activeTab === tab.key ? '600' : '400'}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </View>

            {/* Tab Content */}
            <View paddingHorizontal="$2.5">
              {activeTab === 'recommend' && (
                <View marginBottom="$8">
                  {loading && feedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$color2"
                      borderRadius="$5"
                    >
                      <Text fontSize="$4" color="$color10">
                        加载中...
                      </Text>
                    </YStack>
                  ) : feedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$color2"
                      borderRadius="$5"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        📭
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$color12"
                        marginBottom="$2"
                      >
                        暂无内容
                      </Text>
                      <Text fontSize="$3" color="$color10" textAlign="center">
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
                          <View paddingVertical="$2" alignItems="center">
                            <Text fontSize="$3" color="$color10">
                              加载更多...
                            </Text>
                          </View>
                        ) : !hasMore ? (
                          <View paddingVertical="$2" alignItems="center">
                            <Text fontSize="$3" color="$color10">
                              没有更多内容了
                            </Text>
                          </View>
                        ) : null
                      }
                      scrollEnabled={false}
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
                      backgroundColor="$color2"
                      borderRadius="$5"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        🤝
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$color12"
                        marginBottom="$2"
                      >
                        暂无服务需求
                      </Text>
                      <Text fontSize="$3" color="$color10" textAlign="center">
                        下拉刷新或发布第一个需求
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          邻里帮服务大厅
                        </Text>
                        <Pressable onPress={() => navigation.navigate('JobList' as never)}>
                          <XStack alignItems="center" gap="$0.5">
                            <Text fontSize="$3" color={primaryColor} fontWeight="500">
                              查看全部
                            </Text>
                            <ChevronRight size={14} color={primaryColor} />
                          </XStack>
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
                      backgroundColor="$color2"
                      borderRadius="$5"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        🛒
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$color12"
                        marginBottom="$2"
                      >
                        暂无闲置商品
                      </Text>
                      <Text fontSize="$3" color="$color10" textAlign="center">
                        下拉刷新或发布第一个闲置
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          邻里闲物市场
                        </Text>
                        <Pressable onPress={() => navigation.navigate('SecondHandList' as never)}>
                          <XStack alignItems="center" gap="$0.5">
                            <Text fontSize="$3" color={primaryColor} fontWeight="500">
                              查看全部
                            </Text>
                            <ChevronRight size={14} color={primaryColor} />
                          </XStack>
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
                      backgroundColor="$color2"
                      borderRadius="$5"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        📍
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$color12"
                        marginBottom="$2"
                      >
                        暂无附近内容
                      </Text>
                      <Text fontSize="$3" color="$color10" textAlign="center">
                        下拉刷新试试看
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom="$2"
                      >
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          附近3公里内容 ({nearbyFeedItems.length})
                        </Text>
                        <Text fontSize="$3" color="$color10">
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
              {activeTab === 'expert' && (
                <View marginBottom="$8">
                  {expertFeedItems.length === 0 ? (
                    <YStack
                      alignItems="center"
                      paddingVertical="$8"
                      backgroundColor="$color2"
                      borderRadius="$5"
                    >
                      <Text fontSize={48} marginBottom="$3">
                        👨‍💼
                      </Text>
                      <Text
                        fontSize="$5"
                        fontWeight="600"
                        color="$color12"
                        marginBottom="$2"
                      >
                        暂无达人
                      </Text>
                      <Text fontSize="$3" color="$color10" textAlign="center">
                        下拉刷新试试看
                      </Text>
                    </YStack>
                  ) : (
                    <>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          认证达人
                        </Text>
                        <Pressable onPress={() => navigation.navigate('ExpertList' as never)}>
                          <XStack alignItems="center" gap="$0.5">
                            <Text fontSize="$3" color={primaryColor} fontWeight="500">
                              查看全部
                            </Text>
                            <ChevronRight size={14} color={primaryColor} />
                          </XStack>
                        </Pressable>
                      </XStack>
                      <FlatList
                        data={expertFeedItems}
                        renderItem={({ item }) => (
                          <CommunityFeedCard
                            feedItem={item}
                            onPress={() => handleFeedItemPress(item)}
                          />
                        )}
                        keyExtractor={(item, index) => `expert-${item.data.id}-${index}`}
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

        {/* 发布菜单 BottomSheet */}
        <BottomSheet
          visible={showPublishMenu}
          onClose={handleClosePublishMenu}
          title="发布内容"
          subtitle="选择您要发布的内容类型"
          variant="picker"
          maxHeight="50%"
        >
          <YStack gap="$2">
            {/* 发布服务需求 */}
            <BottomSheetItem
              onPress={handlePublishJob}
              left={
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={`${primaryColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Briefcase size={20} color={primaryColor} />
                </View>
              }
              title="发布服务需求"
              subtitle="寻找邻里帮助，发布服务需求"
            />

            {/* 发布闲置物品 */}
            <BottomSheetItem
              onPress={handlePublishItem}
              left={
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={`${successColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Package size={20} color={successColor} />
                </View>
              }
              title="发布闲置物品"
              subtitle="分享闲置好物，循环利用资源"
            />

            {/* 发布文章 */}
            <BottomSheetItem
              onPress={handlePublishPost}
              left={
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={`${warningColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <FileText size={20} color={warningColor} />
                </View>
              }
              title="发布文章"
              subtitle="分享生活经验，记录健康心得"
            />
          </YStack>
        </BottomSheet>
      </View>
    </LinearGradient>
  );
};
