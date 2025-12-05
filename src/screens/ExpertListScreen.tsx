/**
 * ExpertListScreen - 认证达人列表页
 * 展示所有认证达人，支持分类筛选、搜索、排序
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  Input,
  useTheme,
} from 'tamagui';
import { Pressable, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  X,
  Star,
  User,
  Briefcase,
  TrendingUp,
  Award,
  Filter,
  ChevronDown,
  MapPin,
  CheckCircle,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { BottomSheet, BottomSheetItem } from '@/components/BottomSheet';
import { Expert, ExpertLevel, ExpertCertStatus, ExpertType } from '@/types/community';
import { getExperts, initializeCommunityData } from '@/services/communityDataService';
import { useFocusEffect } from '@react-navigation/native';

interface ExpertListScreenProps {
  navigation: any;
}

// 排序方式
type SortType = 'popularity' | 'orders' | 'rating';

// 达人类型筛选
type ExpertTypeFilter = 'all' | 'personal' | 'business';

/**
 * 认证达人列表页
 */
export const ExpertListScreen: React.FC<ExpertListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<ExpertTypeFilter>('all');
  const [sortType, setSortType] = useState<SortType>('popularity');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // 排序选项配置
  const sortOptions = [
    { key: 'popularity' as const, label: '按人气', icon: TrendingUp },
    { key: 'orders' as const, label: '按服务次数', icon: Award },
    { key: 'rating' as const, label: '按评分', icon: Star },
  ];

  // 类型筛选配置
  const typeOptions = [
    { key: 'all' as const, label: '全部' },
    { key: 'personal' as const, label: '个人达人' },
    { key: 'business' as const, label: '商家达人' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      await initializeCommunityData();
      await loadData();
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const allExperts = await getExperts({});
      // 只显示已认证的达人
      const verifiedExperts = allExperts.filter(
        e => e.certStatus === ExpertCertStatus.VERIFIED
      );
      setExperts(verifiedExperts);
    } catch (error) {
      console.error('加载达人列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleExpertPress = (expertId: string) => {
    navigation.navigate('ExpertDetail', { expertId });
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  // 过滤和排序达人列表
  const filteredAndSortedExperts = useMemo(() => {
    let result = [...experts];

    // 按类型筛选
    if (typeFilter === 'personal') {
      result = result.filter(e => e.expertType === ExpertType.PERSONAL);
    } else if (typeFilter === 'business') {
      result = result.filter(e => e.expertType === ExpertType.BUSINESS);
    }

    // 按搜索词筛选
    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      result = result.filter(
        e =>
          e.name.toLowerCase().includes(keyword) ||
          e.skillDescription?.toLowerCase().includes(keyword) ||
          e.serviceArea?.some(area => area.toLowerCase().includes(keyword))
      );
    }

    // 排序
    switch (sortType) {
      case 'popularity':
        // 人气 = 订单数 * 评分
        result.sort((a, b) => (b.completedOrders * b.rating) - (a.completedOrders * a.rating));
        break;
      case 'orders':
        result.sort((a, b) => b.completedOrders - a.completedOrders);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [experts, typeFilter, searchText, sortType]);

  const getLevelLabel = (level: ExpertLevel): string => {
    const labels: { [key in ExpertLevel]: string } = {
      [ExpertLevel.NEWBIE]: '新手达人',
      [ExpertLevel.QUALITY]: '优质达人',
      [ExpertLevel.GOLD]: '金牌达人',
      [ExpertLevel.HALL_OF_FAME]: '殿堂级',
    };
    return labels[level] || '新手达人';
  };

  const getLevelColor = (level: ExpertLevel): string | undefined => {
    if (level === ExpertLevel.HALL_OF_FAME) return '#FFD700';
    if (level === ExpertLevel.GOLD) return warningColor;
    if (level === ExpertLevel.QUALITY) return primaryColor;
    return color10;
  };

  // 渲染搜索栏
  const renderSearchBar = () => (
    <View
      marginHorizontal="$2.5"
      marginTop="$2"
      backgroundColor="$color2"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$color5"
      paddingHorizontal="$2"
    >
      <XStack alignItems="center" gap="$2">
        <Search size={18} color={color10} />
        <Input
          flex={1}
          placeholder="搜索达人名称、技能、服务区域"
          placeholderTextColor={color10}
          value={searchText}
          onChangeText={setSearchText}
          backgroundColor="transparent"
          borderWidth={0}
          fontSize="$3"
          paddingVertical="$2"
        />
        {searchText.length > 0 && (
          <Pressable onPress={handleClearSearch}>
            <View
              width={20}
              height={20}
              borderRadius={10}
              backgroundColor="$color5"
              justifyContent="center"
              alignItems="center"
            >
              <X size={12} color={color10} />
            </View>
          </Pressable>
        )}
      </XStack>
    </View>
  );

  // 渲染类型筛选标签
  const renderTypeFilter = () => (
    <View
      marginTop="$2"
      borderBottomWidth={1}
      borderBottomColor="$color5"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 8 }}
      >
        <XStack gap="$2">
          {typeOptions.map(option => {
            const isActive = typeFilter === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => setTypeFilter(option.key)}
              >
                <View
                  backgroundColor={isActive ? primaryColor : '$color4'}
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor={isActive ? primaryColor : '$color5'}
                >
                  <XStack gap="$1.5" alignItems="center">
                    {option.key === 'personal' && (
                      <User size={14} color={isActive ? 'white' : color10} />
                    )}
                    {option.key === 'business' && (
                      <Briefcase size={14} color={isActive ? 'white' : color10} />
                    )}
                    <Text
                      fontSize="$3"
                      color={isActive ? 'white' : '$color12'}
                      fontWeight={isActive ? '600' : '400'}
                    >
                      {option.label}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </ScrollView>
    </View>
  );

  // 渲染排序栏
  const renderSortBar = () => {
    const currentSort = sortOptions.find(o => o.key === sortType);
    const CurrentIcon = currentSort?.icon || TrendingUp;

    return (
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
        marginBottom="$2"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$color10">
            共 {filteredAndSortedExperts.length} 位达人
          </Text>

          <Pressable onPress={() => setShowSortMenu(true)}>
            <XStack
              gap="$1"
              alignItems="center"
              backgroundColor="$color2"
              paddingHorizontal="$2"
              paddingVertical="$1.5"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$color5"
            >
              <CurrentIcon size={14} color={primaryColor} />
              <Text fontSize="$3" color={primaryColor} fontWeight="500">
                {currentSort?.label}
              </Text>
              <ChevronDown size={14} color={primaryColor} />
            </XStack>
          </Pressable>
        </XStack>
      </View>
    );
  };

  // 渲染排序 BottomSheet
  const renderSortSheet = () => (
    <BottomSheet
      visible={showSortMenu}
      onClose={() => setShowSortMenu(false)}
      title="选择排序方式"
      variant="picker"
    >
      <YStack gap="$2">
        {sortOptions.map(option => {
          const isActive = sortType === option.key;
          const OptionIcon = option.icon;
          return (
            <BottomSheetItem
              key={option.key}
              selected={isActive}
              onPress={() => {
                setSortType(option.key);
                setShowSortMenu(false);
              }}
              left={
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  backgroundColor={isActive ? `${primaryColor}15` : '$color4'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <OptionIcon size={16} color={isActive ? primaryColor : color10} />
                </View>
              }
              title={option.label}
              right={isActive ? <CheckCircle size={18} color={primaryColor} /> : undefined}
            />
          );
        })}
      </YStack>
    </BottomSheet>
  );

  // 渲染达人卡片
  const renderExpertCard = ({ item }: { item: Expert }) => (
    <Pressable onPress={() => handleExpertPress(item.id)}>
      <Card
        marginHorizontal="$2.5"
        marginBottom="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack gap="$2">
          {/* 头像 */}
          <View
            width={64}
            height={64}
            borderRadius={32}
            backgroundColor="$color4"
            justifyContent="center"
            alignItems="center"
            borderWidth={2}
            borderColor={getLevelColor(item.level)}
          >
            <Text fontSize={32}>{item.avatar || '👤'}</Text>
          </View>

          {/* 信息区 */}
          <YStack flex={1} gap="$1">
            {/* 名字和标签 */}
            <XStack gap="$1.5" alignItems="center" flexWrap="wrap">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {item.name}
              </Text>
              <View
                backgroundColor={getLevelColor(item.level)}
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color="white" fontWeight="500">
                  {getLevelLabel(item.level)}
                </Text>
              </View>
              <View
                backgroundColor={item.expertType === ExpertType.BUSINESS ? `${warningColor}15` : `${primaryColor}15`}
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <XStack gap="$0.5" alignItems="center">
                  {item.expertType === ExpertType.BUSINESS ? (
                    <Briefcase size={10} color={warningColor} />
                  ) : (
                    <User size={10} color={primaryColor} />
                  )}
                  <Text
                    fontSize={10}
                    color={item.expertType === ExpertType.BUSINESS ? warningColor : primaryColor}
                    fontWeight="500"
                  >
                    {item.expertType === ExpertType.BUSINESS ? '商家' : '个人'}
                  </Text>
                </XStack>
              </View>
            </XStack>

            {/* 技能描述 */}
            <Text fontSize="$3" color="$color10" numberOfLines={1}>
              {item.skillDescription}
            </Text>

            {/* 服务区域 */}
            <XStack gap="$1" alignItems="center">
              <MapPin size={12} color={color10} />
              <Text fontSize="$2" color="$color10" numberOfLines={1}>
                {item.serviceArea?.join('、') || '全国'}
              </Text>
            </XStack>

            {/* 数据统计 */}
            <XStack gap="$3" marginTop="$0.5">
              <XStack gap="$1" alignItems="center">
                <Star size={12} color={warningColor} fill={warningColor} />
                <Text fontSize="$3" fontWeight="600" color={warningColor}>
                  {item.rating.toFixed(1)}
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <Award size={12} color={color10} />
                <Text fontSize="$3" color="$color10">
                  {item.completedOrders}单
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <TrendingUp size={12} color={successColor} />
                <Text fontSize="$3" color={successColor}>
                  {item.goodReviewRate}%好评
                </Text>
              </XStack>
            </XStack>
          </YStack>

          {/* 在线状态 */}
          <View>
            <View
              width={10}
              height={10}
              borderRadius={5}
              backgroundColor={item.isOnline ? successColor : color10}
            />
          </View>
        </XStack>
      </Card>
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
        <Award size={64} color={color10} strokeWidth={1} />
        <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$4" marginBottom="$1.5">
          暂无达人
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {searchText
            ? '没有找到匹配的达人，试试其他关键词'
            : '暂无认证达人，敬请期待'
          }
        </Text>
      </View>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="认证达人" />
      </View>

      {/* 搜索栏 */}
      {renderSearchBar()}

      {/* 类型筛选 */}
      {renderTypeFilter()}

      {/* 排序栏 */}
      {renderSortBar()}

      {/* 达人列表 */}
      {filteredAndSortedExperts.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={filteredAndSortedExperts}
          renderItem={renderExpertCard}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View height={insets.bottom + 20} />}
        />
      )}

      {/* 排序 BottomSheet */}
      {renderSortSheet()}
    </View>
  );
};
