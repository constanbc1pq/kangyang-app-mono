/**
 * JobListScreen 邻里帮 - 服务需求大厅
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
  Filter,
  Search,
  ArrowLeft,
  Zap,
  ChevronRight,
  PlusCircle,
  ChevronDown,
  User,
  X,
  Clock,
  TrendingUp,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceJob, ServiceType, JobStatus } from '@/types/community';
import {
  getJobs,
  getSecondHandItems,
  getPosts,
  getExperts,
  initializeCommunityData,
} from '@/services/communityDataService';
import { JobCard } from '@/components/JobCard';
import { JobFilters } from '@/components/JobFilterPanel';
import { BottomSheet } from '@/components/BottomSheet';
import { CommunityFeedCard, FeedItem } from '@/components/CommunityFeedCard';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY_SEARCH_HISTORY = '@kangyang_search_history';

interface JobListScreenProps {
  navigation: any;
}

/**
 * 邻里帮 - 服务需求大厅
 */
export const JobListScreen: React.FC<JobListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [urgentJobs, setUrgentJobs] = useState<ServiceJob[]>([]);
  // 排序方式
  const [sortBy, setSortBy] = useState<'default' | 'budget' | 'urgent'>('default');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceType | 'all'>('all');

  // 筛选条件
  const [filters, setFilters] = useState<JobFilters>({
    serviceTypes: [],
    jobTypes: [],
  });

  // 搜索相关状态
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<FeedItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 热门搜索标签
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

  // 服务类型分类配置
  const serviceCategories = [
    { id: 'all', label: '全部', icon: '📋', type: 'all' as const },
    { id: ServiceType.HOUSEKEEPING, label: '家政', icon: '🧹', type: ServiceType.HOUSEKEEPING },
    { id: ServiceType.REPAIR, label: '维修', icon: '🔧', type: ServiceType.REPAIR },
    { id: ServiceType.DELIVERY, label: '跑腿', icon: '🛒', type: ServiceType.DELIVERY },
    { id: ServiceType.ESCORT, label: '陪诊', icon: '🏥', type: ServiceType.ESCORT },
    { id: ServiceType.CHILDCARE, label: '看护', icon: '👶', type: ServiceType.CHILDCARE },
    { id: ServiceType.TUTORING, label: '家教', icon: '📚', type: ServiceType.TUTORING },
    { id: ServiceType.PHOTOGRAPHY, label: '摄影', icon: '📷', type: ServiceType.PHOTOGRAPHY },
    { id: ServiceType.FITNESS, label: '健身', icon: '💪', type: ServiceType.FITNESS },
  ];

  // 初始化时加载数据
  useEffect(() => {
    loadInitialData();
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
      const newHistory = [
        keyword,
        ...searchHistory.filter((item) => item !== keyword),
      ].slice(0, 5);

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
    await saveSearchHistory(keyword.trim());

    try {
      const [jobsData, items, posts, experts] = await Promise.all([
        getJobs({}),
        getSecondHandItems({}),
        getPosts(),
        getExperts({}),
      ]);

      const searchLower = keyword.toLowerCase();

      const filteredJobs = jobsData.filter(
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

  // 处理搜索结果点击
  const handleSearchResultPress = (feedItem: FeedItem) => {
    setShowSearchSheet(false);
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

  // 关闭搜索弹窗
  const handleCloseSearch = () => {
    setShowSearchSheet(false);
    setSearchText('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // 页面聚焦时重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [filters, activeCategory, sortBy])
  );

  const loadInitialData = async () => {
    try {
      await initializeCommunityData();
      await loadJobs();
      await loadSpecialJobs();
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      let jobsData = await getJobs({
        status: JobStatus.PUBLISHED,
      });

      // 根据选中的分类筛选
      if (activeCategory !== 'all') {
        jobsData = jobsData.filter(job => job.serviceType === activeCategory);
      }

      // 客户端筛选逻辑
      if (filters.serviceTypes && filters.serviceTypes.length > 0) {
        jobsData = jobsData.filter(job => filters.serviceTypes.includes(job.serviceType));
      }
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        jobsData = jobsData.filter(job => filters.jobTypes.includes(job.jobType));
      }
      if (filters.minBudget !== undefined) {
        jobsData = jobsData.filter(job => job.budget.min >= filters.minBudget!);
      }
      if (filters.maxBudget !== undefined) {
        jobsData = jobsData.filter(job => job.budget.max <= filters.maxBudget!);
      }
      if (filters.isUrgent) {
        jobsData = jobsData.filter(job => job.isUrgent);
      }
      if (filters.isHighReward) {
        jobsData = jobsData.filter(job => job.isHighReward);
      }

      // 排序逻辑
      if (sortBy === 'budget') {
        jobsData = [...jobsData].sort((a, b) => b.budget.max - a.budget.max);
      } else if (sortBy === 'urgent') {
        jobsData = [...jobsData].sort((a, b) => {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return 0;
        });
      }

      setJobs(jobsData);
    } catch (error) {
      console.error('加载需求列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialJobs = async () => {
    try {
      const allJobs = await getJobs({ status: JobStatus.PUBLISHED });
      const urgent = allJobs.filter(job => job.isUrgent).slice(0, 5);
      setUrgentJobs(urgent);
    } catch (error) {
      console.error('加载特殊需求失败:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    await loadSpecialJobs();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    setShowSearchSheet(true);
  };

  const handleToggleFilter = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handlePublish = () => {
    navigation.navigate('JobPublish' as never);
  };

  const handleCategoryPress = (category: ServiceType | 'all') => {
    setActiveCategory(category);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleMyJobs = () => {
    navigation.navigate('MyJobs' as never);
  };

  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.HOUSEKEEPING]: '家政保洁',
      [ServiceType.REPAIR]: '维修安装',
      [ServiceType.MOVING]: '搬家运输',
      [ServiceType.DELIVERY]: '跑腿代购',
      [ServiceType.MEAL_PREP]: '做饭配餐',
      [ServiceType.PET_CARE]: '宠物照顾',
      [ServiceType.GARDENING]: '园艺绿化',
      [ServiceType.ESCORT]: '陪诊陪护',
      [ServiceType.CHILDCARE]: '儿童看护',
      [ServiceType.ELDERCARE]: '老人照料',
      [ServiceType.NURSING]: '专业护理',
      [ServiceType.COMPANION]: '陪伴聊天',
      [ServiceType.TUTORING]: '家教辅导',
      [ServiceType.TRANSLATION]: '翻译服务',
      [ServiceType.PHOTOGRAPHY]: '摄影拍照',
      [ServiceType.MAKEUP]: '化妆造型',
      [ServiceType.DRIVING]: '代驾陪驾',
      [ServiceType.IT_SUPPORT]: '电脑维护',
      [ServiceType.PHONE_TEACH]: '手机教学',
      [ServiceType.GRAPHIC_DESIGN]: '平面设计',
      [ServiceType.VIDEO_EDITING]: '视频剪辑',
      [ServiceType.WRITING]: '文案写作',
      [ServiceType.HANDICRAFT]: '手工制作',
      [ServiceType.FITNESS]: '健身教练',
      [ServiceType.YOGA]: '瑜伽教学',
      [ServiceType.DANCE]: '舞蹈教学',
      [ServiceType.MUSIC]: '音乐教学',
      [ServiceType.PAINTING]: '绘画教学',
      [ServiceType.COOKING]: '烹饪教学',
      [ServiceType.MASSAGE]: '按摩理疗',
      [ServiceType.BEAUTY]: '美容美甲',
      [ServiceType.OTHER]: '其他服务',
    };
    return labels[type] || '未知服务';
  };

  // 渲染发布需求引导Banner
  // hsla(256, 30%, 48%, 0.075) 转换为 rgba
  const bannerBgColor = 'rgba(107, 91, 123, 0.075)';
  const bannerBorderColor = 'rgba(107, 91, 123, 0.23)';

  const renderBanner = () => (
    <Pressable onPress={handlePublish}>
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
        backgroundColor={bannerBgColor}
        borderRadius="$5"
        padding="$2"
        borderWidth={1}
        borderColor={bannerBorderColor}
      >
        <XStack gap="$2" alignItems="center">
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={primaryColor}
            justifyContent="center"
            alignItems="center"
          >
            <PlusCircle size={24} color="white" />
          </View>

          <YStack flex={1} gap="$0.5">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              发布服务需求
            </Text>
            <Text fontSize="$2" color="$color10" numberOfLines={1}>
              快速找到身边的服务达人
            </Text>
          </YStack>

          <ChevronRight size={20} color={primaryColor} />
        </XStack>
      </View>
    </Pressable>
  );

  // 渲染服务分类
  const renderServiceCategories = () => (
    <View marginTop="$2" marginBottom="$2">
      <Text fontSize="$4" fontWeight="600" color="$color12" marginHorizontal="$2.5" marginBottom="$2">
        服务分类
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
        <XStack gap="$2">
          {serviceCategories.map(category => (
            <Pressable key={category.id} onPress={() => handleCategoryPress(category.type)}>
              <View
                backgroundColor={activeCategory === category.type ? primaryColor : '$color2'}
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
                minWidth={70}
                alignItems="center"
                borderWidth={1}
                borderColor={activeCategory === category.type ? primaryColor : '$color5'}
              >
                <Text fontSize={24} marginBottom="$1">
                  {category.icon}
                </Text>
                <Text
                  fontSize="$2"
                  color={activeCategory === category.type ? 'white' : '$color12'}
                  fontWeight={activeCategory === category.type ? '600' : '400'}
                >
                  {category.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>
    </View>
  );

  // 渲染搜索栏
  const renderSearchBar = () => (
    <Pressable onPress={handleSearch}>
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
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
            搜索服务需求...
          </Text>
        </XStack>
      </View>
    </Pressable>
  );

  // 渲染紧急需求
  const renderUrgentJobs = () => {
    if (urgentJobs.length === 0) return null;

    return (
      <View marginTop="$2" marginBottom="$2">
        <XStack justifyContent="space-between" alignItems="center" marginHorizontal="$2.5" marginBottom="$2">
          <XStack gap="$1.5" alignItems="center">
            <Zap size={18} color={errorColor} fill={errorColor} />
            <Text fontSize="$4" fontWeight="600" color="$color12">
              紧急需求
            </Text>
          </XStack>
          <Pressable onPress={() => {
            setActiveCategory('all');
            setFilters({ ...filters, isUrgent: true });
          }}>
            <XStack alignItems="center" gap="$0.5">
              <Text fontSize="$3" color={primaryColor} fontWeight="500">
                查看全部
              </Text>
              <ChevronRight size={14} color={primaryColor} />
            </XStack>
          </Pressable>
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          <XStack gap="$2">
            {urgentJobs.map(job => (
              <Pressable key={job.id} onPress={() => handleJobPress(job.id)}>
                <View
                  width={260}
                  backgroundColor="$color2"
                  borderRadius="$5"
                  padding="$2"
                  borderWidth={1}
                  borderColor={`${errorColor}30`}
                >
                  <View
                    backgroundColor={errorColor}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                    alignSelf="flex-start"
                    marginBottom="$1.5"
                  >
                    <Text fontSize={10} color="white" fontWeight="500">
                      紧急
                    </Text>
                  </View>

                  <Text fontSize="$3" fontWeight="600" color="$color12" numberOfLines={2} marginBottom="$1.5">
                    {job.title}
                  </Text>

                  <XStack justifyContent="space-between" alignItems="center">
                    <View
                      backgroundColor={`${primaryColor}15`}
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$10"
                    >
                      <Text fontSize={10} color={primaryColor} fontWeight="500">
                        {getServiceTypeLabel(job.serviceType)}
                      </Text>
                    </View>

                    <Text fontSize="$4" fontWeight="700" color={errorColor}>
                      ¥{job.budget.min}-{job.budget.max}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            ))}
          </XStack>
        </ScrollView>
      </View>
    );
  };


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
        <Text fontSize={48} marginBottom="$2">
          📝
        </Text>
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          暂无需求
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {Object.keys(filters).length > 0 || activeCategory !== 'all'
            ? '没有符合条件的需求，试试调整筛选条件'
            : '还没有服务需求，快来发布第一个吧'}
        </Text>
        <Pressable onPress={handlePublish}>
          <View
            marginTop="$2"
            backgroundColor={primaryColor}
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$10"
          >
            <Text fontSize="$3" color="white" fontWeight="500">
              发布需求
            </Text>
          </View>
        </Pressable>
      </View>
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
              邻里帮
            </Text>
            <Pressable onPress={handleMyJobs}>
              <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
                <User size={22} color={color12} />
              </View>
            </Pressable>
          </XStack>
        </View>

        {/* 滚动内容 */}
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {/* 发布需求引导Banner */}
          {renderBanner()}

          {/* 服务分类 */}
          {renderServiceCategories()}

          {/* 搜索栏 */}
          {renderSearchBar()}

          {/* 紧急需求横向滚动 */}
          {renderUrgentJobs()}

          {/* 筛选栏 */}
          <View marginHorizontal="$2.5" marginTop="$2" marginBottom="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                全部需求 ({jobs.length})
              </Text>
              <Pressable onPress={handleToggleFilter}>
                <XStack gap="$1" alignItems="center">
                  <Filter size={16} color={primaryColor} />
                  <Text fontSize="$3" color={primaryColor} fontWeight="500">
                    筛选
                  </Text>
                  <ChevronDown size={14} color={primaryColor} />
                </XStack>
              </Pressable>
            </XStack>

            {/* 排序选项 */}
            {showFilterPanel && (
              <View
                marginTop="$2"
                backgroundColor="$color2"
                borderRadius="$4"
                padding="$2"
                borderWidth={1}
                borderColor="$color5"
              >
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
                  排序方式
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  <Pressable onPress={() => setSortBy('default')}>
                    <View
                      backgroundColor={sortBy === 'default' ? primaryColor : '$color2'}
                      paddingHorizontal="$3"
                      paddingVertical="$1.5"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={sortBy === 'default' ? primaryColor : '$color5'}
                    >
                      <Text
                        fontSize="$3"
                        color={sortBy === 'default' ? 'white' : '$color12'}
                        fontWeight={sortBy === 'default' ? '600' : '400'}
                      >
                        默认排序
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => setSortBy('budget')}>
                    <View
                      backgroundColor={sortBy === 'budget' ? primaryColor : '$color2'}
                      paddingHorizontal="$3"
                      paddingVertical="$1.5"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={sortBy === 'budget' ? primaryColor : '$color5'}
                    >
                      <Text
                        fontSize="$3"
                        color={sortBy === 'budget' ? 'white' : '$color12'}
                        fontWeight={sortBy === 'budget' ? '600' : '400'}
                      >
                        佣金最高
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => setSortBy('urgent')}>
                    <View
                      backgroundColor={sortBy === 'urgent' ? primaryColor : '$color2'}
                      paddingHorizontal="$3"
                      paddingVertical="$1.5"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={sortBy === 'urgent' ? primaryColor : '$color5'}
                    >
                      <Text
                        fontSize="$3"
                        color={sortBy === 'urgent' ? 'white' : '$color12'}
                        fontWeight={sortBy === 'urgent' ? '600' : '400'}
                      >
                        紧急优先
                      </Text>
                    </View>
                  </Pressable>
                </XStack>
              </View>
            )}

            {/* 筛选标签显示 */}
            {(filters.serviceTypes?.length > 0 || filters.jobTypes?.length > 0 || filters.isUrgent || filters.isHighReward || sortBy !== 'default') && (
              <XStack marginTop="$1.5" flexWrap="wrap" gap="$1.5">
                {sortBy !== 'default' && (
                  <View
                    backgroundColor={`${primaryColor}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color={primaryColor} fontWeight="500">
                      {sortBy === 'budget' ? '佣金最高' : '紧急优先'}
                    </Text>
                  </View>
                )}
                {filters.serviceTypes?.map(type => (
                  <View
                    key={type}
                    backgroundColor={`${primaryColor}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color={primaryColor} fontWeight="500">
                      {getServiceTypeLabel(type)}
                    </Text>
                  </View>
                ))}
                {filters.isUrgent && (
                  <View
                    backgroundColor={`${errorColor}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color={errorColor} fontWeight="500">
                      紧急
                    </Text>
                  </View>
                )}
                {filters.isHighReward && (
                  <View
                    backgroundColor={`${warningColor}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color={warningColor} fontWeight="500">
                      高佣金
                    </Text>
                  </View>
                )}
                <Pressable onPress={() => {
                  setFilters({ serviceTypes: [], jobTypes: [] });
                  setSortBy('default');
                }}>
                  <View
                    backgroundColor="$color4"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color="$color10" fontWeight="500">
                      清除
                    </Text>
                  </View>
                </Pressable>
              </XStack>
            )}
          </View>

          {/* 需求列表 */}
          <View paddingHorizontal="$2.5" marginBottom="$8">
            {jobs.length === 0 ? (
              renderEmpty()
            ) : (
              <YStack gap="$2">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} onPress={handleJobPress} />
                ))}
              </YStack>
            )}
          </View>
        </ScrollView>

        {/* 搜索 BottomSheet */}
        <BottomSheet
          visible={showSearchSheet}
          onClose={handleCloseSearch}
          title="搜索"
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
              /* 搜索前显示：历史记录 + 热门搜索 */
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
                        <Pressable
                          key={index}
                          onPress={() => handleClickSearchTag(keyword)}
                        >
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
                      <Pressable
                        key={index}
                        onPress={() => handleClickSearchTag(tag)}
                      >
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
              /* 搜索后显示：结果列表 */
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
                      未找到相关结果
                    </Text>
                    <Text fontSize="$3" color="$color10" marginTop="$1">
                      换个关键词试试吧
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={searchResults}
                    renderItem={({ item }) => (
                      <CommunityFeedCard
                        feedItem={item}
                        onPress={() => handleSearchResultPress(item)}
                      />
                    )}
                    keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View height={10} />}
                  />
                )}
              </View>
            )}
          </YStack>
        </BottomSheet>
    </View>
  );
};
