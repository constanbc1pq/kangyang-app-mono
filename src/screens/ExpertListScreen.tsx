import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
} from 'tamagui';
import { SafeAreaView, RefreshControl, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Filter, Search, ArrowLeft, TrendingUp, Award, Star, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Expert, ExpertLevel, ServiceType } from '@/types/community';
import { getExperts, initializeCommunityData } from '@/services/communityDataService';
import { ExpertCard } from '@/components/ExpertCard';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExpertListScreenProps {
  navigation: any;
}

/**
 * 达人列表页（优化版）
 * 参考竞品设计：顶部Banner、服务分类、推荐达人、达人列表
 */
export const ExpertListScreen: React.FC<ExpertListScreenProps> = ({ navigation }) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [hotExperts, setHotExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceType | 'all'>('all');

  // 筛选条件
  const [filters, setFilters] = useState<{
    level?: ExpertLevel;
    specialty?: ServiceType;
  }>({});

  // 服务分类配置 - 展示最热门的达人服务类型
  const serviceCategories = [
    { id: 'all', label: '全部', icon: '📋', type: 'all' as const },
    { id: ServiceType.HOUSEKEEPING, label: '家政', icon: '🧹', type: ServiceType.HOUSEKEEPING },
    { id: ServiceType.REPAIR, label: '维修', icon: '🔧', type: ServiceType.REPAIR },
    { id: ServiceType.DELIVERY, label: '跑腿', icon: '🛒', type: ServiceType.DELIVERY },
    { id: ServiceType.ESCORT, label: '陪诊', icon: '🏥', type: ServiceType.ESCORT },
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
      loadExperts();
    }, [filters, activeCategory])
  );

  const loadInitialData = async () => {
    try {
      await initializeCommunityData();
      await loadExperts();
      await loadHotExperts();
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

  const loadExperts = async () => {
    try {
      setLoading(true);
      const expertsData = await getExperts(filters);

      // 根据选中的分类筛选
      let filtered = expertsData;
      if (activeCategory !== 'all') {
        filtered = expertsData.filter(expert =>
          expert.specialties?.includes(activeCategory as ServiceType)
        );
      }

      setExperts(filtered);
    } catch (error) {
      console.error('加载达人列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHotExperts = async () => {
    try {
      const allExperts = await getExperts({});
      // 取评分最高的前5位达人
      const sorted = allExperts.sort((a, b) => b.rating - a.rating).slice(0, 5);
      setHotExperts(sorted);
    } catch (error) {
      console.error('加载热门达人失败:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExperts();
    await loadHotExperts();
    setRefreshing(false);
  };

  const handleExpertPress = (expertId: string) => {
    navigation.navigate('ExpertDetail', { expertId });
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

  const handleApplyExpert = () => {
    navigation.navigate('ExpertCertification');
  };

  const handleCategoryPress = (category: ServiceType | 'all') => {
    setActiveCategory(category);
  };

  const getLevelLabel = (level: ExpertLevel): string => {
    const labels: { [key in ExpertLevel]: string } = {
      [ExpertLevel.NEWBIE]: '新手达人',
      [ExpertLevel.QUALITY]: '优质达人',
      [ExpertLevel.GOLD]: '金牌达人',
      [ExpertLevel.HALL_OF_FAME]: '殿堂级',
    };
    return labels[level];
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
      <TouchableOpacity onPress={handleApplyExpert}>
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
              <Award size={32} color="white" />
            </View>

            <YStack flex={1} space="$1">
              <Text fontSize="$5" fontWeight="700" color="$text">
                成为认证达人
              </Text>
              <Text fontSize="$3" color="$textSecondary" numberOfLines={2}>
                提供专业服务，获取稳定收入，平台流量扶持
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

  const renderHotExperts = () => {
    if (hotExperts.length === 0) return null;

    return (
      <View marginTop="$4" marginBottom="$2">
        <XStack justifyContent="space-between" alignItems="center" marginHorizontal="$4" marginBottom="$3">
          <XStack space="$2" alignItems="center">
            <TrendingUp size={20} color={COLORS.error} />
            <Text fontSize="$5" fontWeight="600" color="$text">
              热门达人
            </Text>
          </XStack>
          <TouchableOpacity onPress={() => setActiveCategory('all')}>
            <Text fontSize="$3" color={COLORS.primary}>
              查看全部 →
            </Text>
          </TouchableOpacity>
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <XStack space="$3">
            {hotExperts.map(expert => (
              <TouchableOpacity key={expert.id} onPress={() => handleExpertPress(expert.id)}>
                <View
                  width={160}
                  backgroundColor="white"
                  borderRadius="$4"
                  padding="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <View alignItems="center" marginBottom="$2">
                    <View
                      width={64}
                      height={64}
                      borderRadius={32}
                      backgroundColor="$background"
                      justifyContent="center"
                      alignItems="center"
                      marginBottom="$2"
                    >
                      <Text fontSize={36}>{expert.avatar || '👤'}</Text>
                    </View>
                    <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={1}>
                      {expert.name}
                    </Text>
                  </View>

                  <XStack space="$1" alignItems="center" justifyContent="center" marginBottom="$2">
                    <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                    <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                      {expert.rating.toFixed(1)}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      ({expert.completedOrders}单)
                    </Text>
                  </XStack>

                  <View
                    backgroundColor={`${COLORS.primary}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                    alignSelf="center"
                  >
                    <Text fontSize="$1" color={COLORS.primary} fontWeight="600">
                      {expert.badges?.[0] || '优质服务'}
                    </Text>
                  </View>
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
          👥
        </Text>
        <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$2">
          暂无达人
        </Text>
        <Text fontSize="$3" color="$textSecondary" textAlign="center">
          {Object.keys(filters).length > 0 || activeCategory !== 'all'
            ? '没有符合条件的达人，试试调整筛选条件'
            : '还没有认证达人，欢迎申请加入'}
        </Text>
        <TouchableOpacity onPress={handleApplyExpert}>
          <View
            marginTop="$4"
            backgroundColor={COLORS.primary}
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderRadius="$3"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              申请成为达人
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
              认证达人
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              专业服务，品质保证
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
        {/* 成为达人引导Banner */}
        {renderBanner()}

        {/* 服务分类 */}
        {renderServiceCategories()}

        {/* 热门达人横向滚动 */}
        {renderHotExperts()}

        {/* 筛选栏 */}
        <View marginHorizontal="$4" marginTop="$4" marginBottom="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="600" color="$text">
              全部达人 ({experts.length})
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
          {Object.keys(filters).length > 0 && (
            <XStack marginTop="$2" flexWrap="wrap" gap="$2">
              {filters.level && (
                <View
                  backgroundColor={`${COLORS.primary}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.primary}>
                    {getLevelLabel(filters.level)}达人
                  </Text>
                </View>
              )}
              {filters.specialty && (
                <View
                  backgroundColor={`${COLORS.primary}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.primary}>
                    {getServiceTypeLabel(filters.specialty)}
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
            marginHorizontal="$4"
            marginBottom="$3"
            padding="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              筛选条件
            </Text>

            {/* 达人等级筛选 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                达人等级
              </Text>
              <XStack flexWrap="wrap" gap="$2">
                {[
                  { label: '初级达人', value: ExpertLevel.JUNIOR },
                  { label: '中级达人', value: ExpertLevel.INTERMEDIATE },
                  { label: '高级达人', value: ExpertLevel.SENIOR },
                  { label: '资深专家', value: ExpertLevel.EXPERT },
                ].map(level => (
                  <TouchableOpacity
                    key={level.value}
                    onPress={() => {
                      setFilters({
                        ...filters,
                        level: filters.level === level.value ? undefined : level.value,
                      });
                    }}
                  >
                    <View
                      backgroundColor={
                        filters.level === level.value ? COLORS.primary : '$background'
                      }
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={filters.level === level.value ? COLORS.primary : '$borderColor'}
                    >
                      <Text
                        fontSize="$3"
                        color={filters.level === level.value ? 'white' : '$text'}
                      >
                        {level.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>

            {/* 操作按钮 */}
            <XStack space="$2">
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setFilters({});
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
                  loadExperts();
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

        {/* 达人列表 */}
        <View paddingHorizontal="$4" marginBottom="$8">
          {experts.length === 0 ? (
            renderEmpty()
          ) : (
            <YStack space="$3">
              {experts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} onPress={handleExpertPress} />
              ))}
            </YStack>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
