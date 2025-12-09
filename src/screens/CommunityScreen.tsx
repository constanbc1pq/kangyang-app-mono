import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, FileText, Package, Briefcase, ChevronRight } from 'lucide-react-native';
import { Pressable, FlatList, RefreshControl, StyleSheet } from 'react-native';
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

// Tab 配置
const TABS = [
  { key: 'recommend', label: '发现' },
  { key: 'jobs', label: '邻里帮' },
  { key: 'secondhand', label: '闲物' },
  { key: 'nearby', label: '附近' },
  { key: 'expert', label: '达人' },
] as const;

type TabKey = typeof TABS[number]['key'];

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  // 渐变背景颜色
  const gradientColors = ['#d6dece', '#e8e6eb', primaryColor] as const;

  const [activeTab, setActiveTab] = useState<TabKey>('recommend');
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
  const [listKey, setListKey] = useState(0);
  const PAGE_SIZE = 10;

  // 页面重新获得焦点时刷新
  useFocusEffect(
    useCallback(() => {
      setListKey(prev => prev + 1);
    }, [])
  );

  // 初始化加载数据
  useEffect(() => {
    const initializeAndLoadData = async () => {
      try {
        await initializeCommunityData();
        await Promise.all([
          loadBanners(),
          loadFeedData(),
          loadJobFeedData(),
          loadItemFeedData(),
          loadNearbyFeedData(),
          loadExpertFeedData(),
          loadUnreadMessageCount(),
        ]);
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

      const [jobs, items, posts, experts] = await Promise.all([
        getJobs({}),
        getSecondHandItems({}),
        getPosts(),
        getExperts({}),
      ]);

      const allMixed: FeedItem[] = [
        ...jobs.map((data) => ({ type: 'job' as const, data })),
        ...items.map((data) => ({ type: 'item' as const, data })),
        ...posts.map((data) => ({ type: 'post' as const, data })),
        ...experts.map((data) => ({ type: 'expert' as const, data })),
      ];

      const shuffled = allMixed.sort(() => Math.random() - 0.5);
      const startIndex = (pageNum - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedData = shuffled.slice(startIndex, endIndex);
      const hasMoreData = endIndex < shuffled.length;
      setHasMore(hasMoreData);

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

  const loadMoreFeedData = async () => {
    if (loadingMore || !hasMore || activeTab !== 'recommend') return;
    await loadFeedData(page + 1);
  };

  const loadJobFeedData = async () => {
    try {
      const jobs = await getJobs({});
      setJobFeedItems(jobs.map((data) => ({ type: 'job' as const, data })));
    } catch (error) {
      console.error('加载邻里帮数据失败:', error);
    }
  };

  const loadItemFeedData = async () => {
    try {
      const items = await getSecondHandItems({});
      setItemFeedItems(items.map((data) => ({ type: 'item' as const, data })));
    } catch (error) {
      console.error('加载邻里闲物数据失败:', error);
    }
  };

  const loadExpertFeedData = async () => {
    try {
      const experts = await getExperts({});
      setExpertFeedItems(experts.map((data) => ({ type: 'expert' as const, data })));
    } catch (error) {
      console.error('加载达人数据失败:', error);
    }
  };

  const loadNearbyFeedData = async () => {
    try {
      const [jobs, items, posts, experts] = await Promise.all([
        getJobs({}),
        getSecondHandItems({}),
        getPosts(),
        getExperts({}),
      ]);

      const addDistance = <T extends object>(item: T) => ({
        ...item,
        distance: (Math.random() * 2.5 + 0.5).toFixed(1),
      });

      const mixed: FeedItem[] = [
        ...jobs.slice(0, 4).map((data) => ({ type: 'job' as const, data: addDistance(data) })),
        ...items.slice(0, 4).map((data) => ({ type: 'item' as const, data: addDistance(data) })),
        ...posts.slice(0, 2).map((data) => ({ type: 'post' as const, data: addDistance(data) })),
        ...experts.slice(0, 2).map((data) => ({ type: 'expert' as const, data: addDistance(data) })),
      ];

      const sorted = mixed.sort((a, b) => {
        const distA = parseFloat((a.data as any).distance || '999');
        const distB = parseFloat((b.data as any).distance || '999');
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
    }
    setRefreshing(false);
  };

  // 根据当前 Tab 获取数据
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'recommend':
        return feedItems;
      case 'jobs':
        return jobFeedItems;
      case 'secondhand':
        return itemFeedItems;
      case 'nearby':
        return nearbyFeedItems;
      case 'expert':
        return expertFeedItems;
      default:
        return feedItems;
    }
  }, [activeTab, feedItems, jobFeedItems, itemFeedItems, nearbyFeedItems, expertFeedItems]);

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

  // 发布菜单
  const handleOpenPublishMenu = () => setShowPublishMenu(true);
  const handleClosePublishMenu = () => setShowPublishMenu(false);

  const handlePublishJob = () => {
    setShowPublishMenu(false);
    setTimeout(() => navigation.navigate('JobPublish' as never), 100);
  };

  const handlePublishItem = () => {
    setShowPublishMenu(false);
    setTimeout(() => navigation.navigate('SecondHandPublish' as never), 100);
  };

  const handlePublishPost = () => {
    setShowPublishMenu(false);
    setTimeout(() => navigation.navigate('PostPublish' as never), 100);
  };

  // 处理Feed卡片点击
  const handleFeedItemPress = useCallback((feedItem: FeedItem) => {
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
  }, [navigation]);

  // 获取 Tab 对应的标题和链接
  const getTabHeader = () => {
    switch (activeTab) {
      case 'jobs':
        return {
          title: '邻里帮服务大厅',
          showLink: true,
          onPress: () => navigation.navigate('JobList' as never),
        };
      case 'secondhand':
        return {
          title: '邻里闲物市场',
          showLink: true,
          onPress: () => navigation.navigate('SecondHandList' as never),
        };
      case 'nearby':
        return {
          title: `附近3公里内容 (${nearbyFeedItems.length})`,
          showLink: false,
          subtitle: '按距离排序',
        };
      case 'expert':
        return {
          title: '认证达人',
          showLink: true,
          onPress: () => navigation.navigate('ExpertList' as never),
        };
      default:
        return null;
    }
  };

  // 获取空状态配置
  const getEmptyConfig = () => {
    switch (activeTab) {
      case 'recommend':
        return { emoji: '📭', title: '暂无内容', subtitle: '下拉刷新试试看' };
      case 'jobs':
        return { emoji: '🤝', title: '暂无服务需求', subtitle: '下拉刷新或发布第一个需求' };
      case 'secondhand':
        return { emoji: '🛒', title: '暂无闲置商品', subtitle: '下拉刷新或发布第一个闲置' };
      case 'nearby':
        return { emoji: '📍', title: '暂无附近内容', subtitle: '下拉刷新试试看' };
      case 'expert':
        return { emoji: '👨‍💼', title: '暂无达人', subtitle: '下拉刷新试试看' };
      default:
        return { emoji: '📭', title: '暂无内容', subtitle: '下拉刷新试试看' };
    }
  };

  // 渲染列表头部（Header + Banner + Nav + TabBar）
  const renderListHeader = () => {
    const tabHeader = getTabHeader();

    return (
      <YStack gap="$2">
        {/* Header */}
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
            {TABS.map(tab => (
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

        {/* Tab 子标题 */}
        {tabHeader && (
          <View paddingHorizontal="$2.5">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {tabHeader.title}
              </Text>
              {tabHeader.showLink ? (
                <Pressable onPress={tabHeader.onPress}>
                  <XStack alignItems="center" gap="$0.5">
                    <Text fontSize="$3" color={primaryColor} fontWeight="500">
                      查看全部
                    </Text>
                    <ChevronRight size={14} color={primaryColor} />
                  </XStack>
                </Pressable>
              ) : tabHeader.subtitle ? (
                <Text fontSize="$3" color="$color10">
                  {tabHeader.subtitle}
                </Text>
              ) : null}
            </XStack>
          </View>
        )}
      </YStack>
    );
  };

  // 渲染空状态
  const renderEmptyComponent = () => {
    if (loading && currentData.length === 0) {
      return (
        <YStack
          alignItems="center"
          paddingVertical="$8"
          backgroundColor="$color2"
          borderRadius="$5"
          marginHorizontal="$2.5"
        >
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </YStack>
      );
    }

    const config = getEmptyConfig();
    return (
      <YStack
        alignItems="center"
        paddingVertical="$8"
        backgroundColor="$color2"
        borderRadius="$5"
        marginHorizontal="$2.5"
      >
        <Text fontSize={48} marginBottom="$3">
          {config.emoji}
        </Text>
        <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">
          {config.title}
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {config.subtitle}
        </Text>
      </YStack>
    );
  };

  // 渲染列表底部
  const renderFooterComponent = () => {
    if (activeTab !== 'recommend') return <View height={100} />;

    if (loadingMore) {
      return (
        <View paddingVertical="$2" alignItems="center" marginBottom={80}>
          <Text fontSize="$3" color="$color10">
            加载更多...
          </Text>
        </View>
      );
    }

    if (!hasMore && currentData.length > 0) {
      return (
        <View paddingVertical="$2" alignItems="center" marginBottom={80}>
          <Text fontSize="$3" color="$color10">
            没有更多内容了
          </Text>
        </View>
      );
    }

    return <View height={100} />;
  };

  // 渲染卡片
  const renderItem = useCallback(({ item }: { item: FeedItem }) => (
    <View paddingHorizontal="$2.5">
      <CommunityFeedCard
        feedItem={item}
        onPress={() => handleFeedItemPress(item)}
      />
    </View>
  ), [handleFeedItemPress]);

  const keyExtractor = useCallback((item: FeedItem, index: number) =>
    `${activeTab}-${item.type}-${item.data.id}-${index}`, [activeTab]);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <View flex={1} paddingTop={insets.top}>
        <FlatList
          key={`community-list-${listKey}-${activeTab}`}
          data={currentData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooterComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={loadMoreFeedData}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={{ flexGrow: 1 }}
        />

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
