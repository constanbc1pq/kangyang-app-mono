import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
} from 'tamagui';
import { SafeAreaView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Filter, Search, ArrowLeft, TrendingUp, Zap, DollarSign, ChevronRight, PlusCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ServiceJob, JobType, ServiceType, JobStatus } from '@/types/community';
import { getJobs, initializeCommunityData } from '@/services/communityDataService';
import { JobCard } from '@/components/JobCard';
import { JobFilterPanel, JobFilters } from '@/components/JobFilterPanel';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface JobListScreenProps {
  navigation: any;
}

/**
 * 邻里帮 - 服务需求大厅（优化版）
 * 参考竞品设计：顶部Banner、服务分类、推荐需求、需求列表
 */
export const JobListScreen: React.FC<JobListScreenProps> = ({ navigation }) => {
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [urgentJobs, setUrgentJobs] = useState<ServiceJob[]>([]);
  const [highRewardJobs, setHighRewardJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceType | 'all'>('all');

  // 筛选条件
  const [filters, setFilters] = useState<JobFilters>({
    serviceTypes: [],
    jobTypes: [],
  });

  // 服务类型分类配置 - 展示最常用的零工服务类型
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
  }, []);

  // 页面聚焦时重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [filters, activeCategory])
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

      // 紧急需求（取前5个）
      const urgent = allJobs.filter(job => job.isUrgent).slice(0, 5);
      setUrgentJobs(urgent);

      // 高佣金需求（取前5个）
      const highReward = allJobs.filter(job => job.isHighReward).slice(0, 5);
      setHighRewardJobs(highReward);
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
    // TODO: 跳转到搜索页面
    console.log('搜索');
  };

  const handleToggleFilter = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handlePublish = () => {
    // TODO: 跳转到发布需求页面
    console.log('发布需求');
  };

  const handleCategoryPress = (category: ServiceType | 'all') => {
    setActiveCategory(category);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      // 生活服务
      [ServiceType.HOUSEKEEPING]: '家政保洁',
      [ServiceType.REPAIR]: '维修安装',
      [ServiceType.MOVING]: '搬家运输',
      [ServiceType.DELIVERY]: '跑腿代购',
      [ServiceType.MEAL_PREP]: '做饭配餐',
      [ServiceType.PET_CARE]: '宠物照顾',
      [ServiceType.GARDENING]: '园艺绿化',
      // 陪护照料
      [ServiceType.ESCORT]: '陪诊陪护',
      [ServiceType.CHILDCARE]: '儿童看护',
      [ServiceType.ELDERCARE]: '老人照料',
      [ServiceType.NURSING]: '专业护理',
      [ServiceType.COMPANION]: '陪伴聊天',
      // 技能服务
      [ServiceType.TUTORING]: '家教辅导',
      [ServiceType.TRANSLATION]: '翻译服务',
      [ServiceType.PHOTOGRAPHY]: '摄影拍照',
      [ServiceType.MAKEUP]: '化妆造型',
      [ServiceType.DRIVING]: '代驾陪驾',
      [ServiceType.IT_SUPPORT]: '电脑维护',
      [ServiceType.PHONE_TEACH]: '手机教学',
      // 创意设计
      [ServiceType.GRAPHIC_DESIGN]: '平面设计',
      [ServiceType.VIDEO_EDITING]: '视频剪辑',
      [ServiceType.WRITING]: '文案写作',
      [ServiceType.HANDICRAFT]: '手工制作',
      // 教学培训
      [ServiceType.FITNESS]: '健身教练',
      [ServiceType.YOGA]: '瑜伽教学',
      [ServiceType.DANCE]: '舞蹈教学',
      [ServiceType.MUSIC]: '音乐教学',
      [ServiceType.PAINTING]: '绘画教学',
      [ServiceType.COOKING]: '烹饪教学',
      // 其他
      [ServiceType.MASSAGE]: '按摩理疗',
      [ServiceType.BEAUTY]: '美容美甲',
      [ServiceType.OTHER]: '其他服务',
    };
    return labels[type] || '未知服务';
  };

  const renderBanner = () => {
    return (
      <TouchableOpacity onPress={handlePublish}>
        <View
          marginHorizontal="$4"
          marginTop="$3"
          backgroundColor={`${COLORS.primary}15`}
          borderRadius="$4"
          padding="$4"
          borderWidth={1}
          borderColor={`${COLORS.primary}30`}
        >
          <XStack space="$3" alignItems="center">
            <View
              width={56}
              height={56}
              borderRadius={28}
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <PlusCircle size={32} color="white" />
            </View>

            <YStack flex={1} space="$1">
              <Text fontSize="$5" fontWeight="700" color="$text">
                发布服务需求
              </Text>
              <Text fontSize="$3" color="$textSecondary" numberOfLines={2}>
                快速找到身边的服务达人，解决生活难题
              </Text>
            </YStack>

            <ChevronRight size={24} color={COLORS.primary} />
          </XStack>
        </View>
      </TouchableOpacity>
    );
  };

  const renderServiceCategories = () => {
    return (
      <View marginTop="$4" marginBottom="$2">
        <Text fontSize="$5" fontWeight="600" color="$text" marginHorizontal="$4" marginBottom="$3">
          服务分类
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <XStack space="$3">
            {serviceCategories.map(category => (
              <TouchableOpacity key={category.id} onPress={() => handleCategoryPress(category.type)}>
                <View
                  backgroundColor={activeCategory === category.type ? COLORS.primary : 'white'}
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$3"
                  minWidth={80}
                  alignItems="center"
                  borderWidth={1}
                  borderColor={activeCategory === category.type ? COLORS.primary : '$borderColor'}
                >
                  <Text fontSize={28} marginBottom="$1">
                    {category.icon}
                  </Text>
                  <Text
                    fontSize="$2"
                    color={activeCategory === category.type ? 'white' : '$text'}
                    fontWeight={activeCategory === category.type ? '600' : '400'}
                  >
                    {category.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  const renderUrgentJobs = () => {
    if (urgentJobs.length === 0) return null;

    return (
      <View marginTop="$4" marginBottom="$2">
        <XStack justifyContent="space-between" alignItems="center" marginHorizontal="$4" marginBottom="$3">
          <XStack space="$2" alignItems="center">
            <Zap size={20} color={COLORS.error} fill={COLORS.error} />
            <Text fontSize="$5" fontWeight="600" color="$text">
              紧急需求
            </Text>
          </XStack>
          <TouchableOpacity onPress={() => {
            setActiveCategory('all');
            setFilters({ ...filters, isUrgent: true });
          }}>
            <Text fontSize="$3" color={COLORS.primary}>
              查看全部 →
            </Text>
          </TouchableOpacity>
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <XStack space="$3">
            {urgentJobs.map(job => (
              <TouchableOpacity key={job.id} onPress={() => handleJobPress(job.id)}>
                <View
                  width={280}
                  backgroundColor="white"
                  borderRadius="$4"
                  padding="$3"
                  borderWidth={1}
                  borderColor={`${COLORS.error}50`}
                >
                  <View
                    backgroundColor={COLORS.error}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                    alignSelf="flex-start"
                    marginBottom="$2"
                  >
                    <Text fontSize="$1" color="white" fontWeight="600">
                      紧急
                    </Text>
                  </View>

                  <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={2} marginBottom="$2">
                    {job.title}
                  </Text>

                  <XStack justifyContent="space-between" alignItems="center">
                    <View
                      backgroundColor={`${COLORS.primary}15`}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color={COLORS.primary}>
                        {getServiceTypeLabel(job.serviceType)}
                      </Text>
                    </View>

                    <Text fontSize="$5" fontWeight="700" color={COLORS.error}>
                      ¥{job.budget.min}-{job.budget.max}
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            ))}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  const renderHighRewardJobs = () => {
    if (highRewardJobs.length === 0) return null;

    return (
      <View marginTop="$4" marginBottom="$2">
        <XStack justifyContent="space-between" alignItems="center" marginHorizontal="$4" marginBottom="$3">
          <XStack space="$2" alignItems="center">
            <DollarSign size={20} color={COLORS.warning} />
            <Text fontSize="$5" fontWeight="600" color="$text">
              高佣金需求
            </Text>
          </XStack>
          <TouchableOpacity onPress={() => {
            setActiveCategory('all');
            setFilters({ ...filters, isHighReward: true });
          }}>
            <Text fontSize="$3" color={COLORS.primary}>
              查看全部 →
            </Text>
          </TouchableOpacity>
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <XStack space="$3">
            {highRewardJobs.map(job => (
              <TouchableOpacity key={job.id} onPress={() => handleJobPress(job.id)}>
                <View
                  width={280}
                  backgroundColor="white"
                  borderRadius="$4"
                  padding="$3"
                  borderWidth={1}
                  borderColor={`${COLORS.warning}50`}
                >
                  <View
                    backgroundColor={COLORS.warning}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                    alignSelf="flex-start"
                    marginBottom="$2"
                  >
                    <Text fontSize="$1" color="white" fontWeight="600">
                      高佣金
                    </Text>
                  </View>

                  <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={2} marginBottom="$2">
                    {job.title}
                  </Text>

                  <XStack justifyContent="space-between" alignItems="center">
                    <View
                      backgroundColor={`${COLORS.primary}15`}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color={COLORS.primary}>
                        {getServiceTypeLabel(job.serviceType)}
                      </Text>
                    </View>

                    <Text fontSize="$5" fontWeight="700" color={COLORS.warning}>
                      ¥{job.budget.min}-{job.budget.max}
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            ))}
          </XStack>
        </ScrollView>
      </View>
    );
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
          📝
        </Text>
        <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$2">
          暂无需求
        </Text>
        <Text fontSize="$3" color="$textSecondary" textAlign="center">
          {Object.keys(filters).length > 0 || activeCategory !== 'all'
            ? '没有符合条件的需求，试试调整筛选条件'
            : '还没有服务需求，快来发布第一个吧'}
        </Text>
        <TouchableOpacity onPress={handlePublish}>
          <View
            marginTop="$4"
            backgroundColor={COLORS.primary}
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderRadius="$3"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              发布需求
            </Text>
          </View>
        </TouchableOpacity>
      </View>
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
              邻里帮
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              互帮互助，温暖社区
            </Text>
          </YStack>

          {/* 搜索按钮 */}
          <TouchableOpacity onPress={handleSearch}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$background"
              justifyContent="center"
              alignItems="center"
            >
              <Search size={20} color={COLORS.text} />
            </View>
          </TouchableOpacity>
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

        {/* 紧急需求横向滚动 */}
        {renderUrgentJobs()}

        {/* 高佣金需求横向滚动 */}
        {renderHighRewardJobs()}

        {/* 筛选栏 */}
        <View marginHorizontal="$4" marginTop="$4" marginBottom="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="600" color="$text">
              全部需求 ({jobs.length})
            </Text>
            <TouchableOpacity onPress={handleToggleFilter}>
              <XStack space="$2" alignItems="center">
                <Filter size={18} color={COLORS.primary} />
                <Text fontSize="$3" color={COLORS.primary}>
                  筛选
                </Text>
              </XStack>
            </TouchableOpacity>
          </XStack>

          {/* 筛选标签显示 */}
          {(filters.serviceTypes?.length > 0 || filters.jobTypes?.length > 0 || filters.isUrgent || filters.isHighReward) && (
            <XStack marginTop="$2" flexWrap="wrap" gap="$2">
              {filters.serviceTypes?.map(type => (
                <View
                  key={type}
                  backgroundColor={`${COLORS.primary}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.primary}>
                    {getServiceTypeLabel(type)}
                  </Text>
                </View>
              ))}
              {filters.isUrgent && (
                <View
                  backgroundColor={`${COLORS.error}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.error}>
                    紧急
                  </Text>
                </View>
              )}
              {filters.isHighReward && (
                <View
                  backgroundColor={`${COLORS.warning}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.warning}>
                    高佣金
                  </Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setFilters({ serviceTypes: [], jobTypes: [] })}>
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
        {showFilterPanel && (
          <View marginHorizontal="$4" marginBottom="$3">
            <JobFilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilterPanel(false)}
            />
          </View>
        )}

        {/* 需求列表 */}
        <View paddingHorizontal="$4" marginBottom="$8">
          {jobs.length === 0 ? (
            renderEmpty()
          ) : (
            <YStack space="$3">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} onPress={handleJobPress} />
              ))}
            </YStack>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
