/**
 * RankingDetailScreen - 榜单详情页
 * 支持热销榜/预约榜/热门榜/附近服务榜四种类型
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronRight, Clock, Users, Star, MapPin, Flame } from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import {
  RankingType,
  RankingList,
  RankingItem,
  HotSalesItem,
  PopularExpertItem,
  HotTopicItem,
  NearbyServiceItem,
  isHotSalesItem,
  isPopularExpertItem,
  isHotTopicItem,
  isNearbyServiceItem,
} from '@/types/feed';
import {
  getHotSalesRanking,
  getPopularExpertsRanking,
  getHotTopicsRanking,
  getNearbyServicesRanking,
  formatCount,
} from '@/services/feedService';
import { getAvatarSource } from '@/constants/avatars';

// 商家类型标签
const MERCHANT_TYPE_LABELS: Record<string, string> = {
  wellness: '养生馆',
  teahouse: '茶馆',
  massage: '理疗按摩',
  tcm: '中医馆',
  fitness: '健身中心',
  spa: 'SPA会所',
};

// 榜单Tab配置
const RANKING_TABS: { type: RankingType; label: string }[] = [
  { type: 'hotSales', label: '热销榜' },
  { type: 'popularExperts', label: '预约榜' },
  { type: 'hotTopics', label: '热门榜' },
  { type: 'nearbyServices', label: '商家榜' },
];

type RouteParams = {
  RankingDetail: {
    type: RankingType;
  };
};

export const RankingDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'RankingDetail'>>();
  const initialType = route.params?.type || 'hotSales';

  const [currentType, setCurrentType] = useState<RankingType>(initialType);
  const [ranking, setRanking] = useState<RankingList | null>(null);
  const [loading, setLoading] = useState(true);

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;

  // 加载榜单数据
  const loadRanking = useCallback(async () => {
    setLoading(true);
    try {
      let data: RankingList;
      switch (currentType) {
        case 'hotSales':
          data = await getHotSalesRanking();
          break;
        case 'popularExperts':
          data = await getPopularExpertsRanking();
          break;
        case 'hotTopics':
          data = await getHotTopicsRanking();
          break;
        case 'nearbyServices':
          data = await getNearbyServicesRanking();
          break;
        default:
          data = await getHotSalesRanking();
      }
      setRanking(data);
    } catch (error) {
      console.error('加载榜单失败:', error);
    } finally {
      setLoading(false);
    }
  }, [currentType]);

  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  // 获取排名颜色
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return errorColor;
      case 2:
        return warningColor;
      case 3:
        return primaryColor;
      default:
        return theme.color10?.val;
    }
  };

  // 获取页面标题
  const getTitle = () => {
    switch (currentType) {
      case 'hotSales':
        return '热销榜';
      case 'popularExperts':
        return '预约榜';
      case 'hotTopics':
        return '热门榜';
      case 'nearbyServices':
        return '附近商家榜';
      default:
        return '排行榜';
    }
  };

  // 获取更新时间文本
  const getUpdateTimeText = () => {
    if (!ranking?.updateTime) return '';
    const updateDate = new Date(ranking.updateTime);
    const hours = updateDate.getHours();
    return `${hours}:00 更新`;
  };

  // 处理点击事件
  const handleItemPress = (item: RankingItem) => {
    if (isHotSalesItem(item)) {
      // 根据商品ID前缀跳转到对应的服务页面
      const itemId = item.id;
      if (itemId.startsWith('prod_')) {
        // 闪送到家商品 - 直接跳转到商品详情页
        const numericId = parseInt(itemId.replace('prod_', ''), 10);
        navigation.navigate('ProductDetail' as never, { productId: numericId } as never);
      } else if (itemId.startsWith('meal_')) {
        // 营养配餐套餐
        navigation.navigate('NutritionService' as never, { planId: itemId } as never);
      } else if (itemId.startsWith('service_doctor')) {
        // 私人医生服务
        navigation.navigate('PrivateDoctorList' as never);
      } else if (itemId.startsWith('service_care') || itemId.startsWith('service_respite')) {
        // 养老服务
        navigation.navigate('ElderlyService' as never, { serviceId: itemId } as never);
      } else if (itemId.startsWith('service_legal')) {
        // 法律服务
        navigation.navigate('LegalServiceHome' as never, { serviceId: itemId } as never);
      }
    } else if (isPopularExpertItem(item)) {
      // 跳转到私人医生详情页
      navigation.navigate('PrivateDoctorDetail' as never, { doctorId: item.id } as never);
    } else if (isHotTopicItem(item)) {
      // 跳转到栏目文章详情页
      navigation.navigate('ContentDetail' as never, { contentId: item.id } as never);
    } else if (isNearbyServiceItem(item)) {
      // 商家详情页暂时显示提示
      console.log('商家详情页开发中', item.id);
    }
  };

  // 获取商品类型徽章信息
  const getItemTypeBadge = (itemType?: string) => {
    switch (itemType) {
      case 'meal_plan':
        return { text: '套餐', color: successColor };
      case 'service':
        return { text: '服务', color: primaryColor };
      case 'product':
      default:
        return { text: '商品', color: warningColor };
    }
  };

  // 渲染热销榜项
  const renderHotSalesItem = (item: HotSalesItem) => {
    const badge = getItemTypeBadge(item.itemType);
    return (
      <Pressable key={item.id} onPress={() => handleItemPress(item)}>
        <XStack
          gap="$2"
          alignItems="center"
          padding="$2"
          backgroundColor="$color2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$2"
        >
          {/* 排名 */}
          <View
            width={28}
            height={28}
            borderRadius={14}
            backgroundColor={item.rank <= 3 ? `${getRankColor(item.rank)}20` : '$color4'}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontSize="$4"
              fontWeight="700"
              color={getRankColor(item.rank)}
            >
              {item.rank}
            </Text>
          </View>

          {/* 图片 */}
          <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.productImage} />

          {/* 信息 */}
          <YStack flex={1} gap="$0.5">
            <XStack gap="$1" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={1} flexShrink={1}>
                {item.name}
              </Text>
              {/* 类型徽章 */}
              <View
                backgroundColor={`${badge.color}15`}
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color={badge.color} fontWeight="500">
                  {badge.text}
                </Text>
              </View>
            </XStack>
            <XStack alignItems="baseline" gap="$1">
              <Text fontSize="$4" fontWeight="700" color="$error">
                ¥{item.price}
              </Text>
              {item.originalPrice && (
                <Text
                  fontSize="$2"
                  color="$color10"
                  textDecorationLine="line-through"
                >
                  ¥{item.originalPrice}
                </Text>
              )}
            </XStack>
          </YStack>

          {/* 销量 */}
          <YStack alignItems="flex-end">
            <Text fontSize="$3" color="$color12" fontWeight="500">
              已售{formatCount(item.salesCount)}
            </Text>
            <Text fontSize="$2" color="$color10">
              {item.unit || '件'}
            </Text>
          </YStack>

          <ChevronRight size={16} color={theme.color10?.val} />
        </XStack>
      </Pressable>
    );
  };

  // 渲染预约榜项
  const renderPopularExpertItem = (item: PopularExpertItem) => (
    <Pressable key={item.id} onPress={() => handleItemPress(item)}>
      <XStack
        gap="$2"
        alignItems="center"
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        marginBottom="$2"
      >
        {/* 排名 */}
        <View
          width={28}
          height={28}
          borderRadius={14}
          backgroundColor={item.rank <= 3 ? `${getRankColor(item.rank)}20` : '$color4'}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="$4"
            fontWeight="700"
            color={getRankColor(item.rank)}
          >
            {item.rank}
          </Text>
        </View>

        {/* 头像 */}
        <View position="relative">
          <Image
            source={getAvatarSource(item.avatar, item.name)}
            style={styles.expertAvatar}
          />
          {/* 在线状态 */}
          {item.isOnline && (
            <View
              position="absolute"
              bottom={0}
              right={0}
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor="$success"
              borderWidth={2}
              borderColor="white"
            />
          )}
        </View>

        {/* 信息 */}
        <YStack flex={1} gap="$0.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={1}>
            {item.name}
          </Text>
          <Text fontSize="$3" color="$color10">
            {item.title}
          </Text>
          {item.hospital && (
            <Text fontSize="$2" color="$color10" numberOfLines={1}>
              {item.hospital}
            </Text>
          )}
        </YStack>

        {/* 预约状态 */}
        <YStack alignItems="flex-end" gap="$1">
          <View
            backgroundColor={
              item.availableSlots === -1
                ? '$color4'
                : item.availableSlots <= 3
                ? `${warningColor}20`
                : `${successColor}20`
            }
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$10"
          >
            <Text
              fontSize="$3"
              fontWeight="500"
              color={
                item.availableSlots === -1
                  ? '$color10'
                  : item.availableSlots <= 3
                  ? '$warning'
                  : '$success'
              }
            >
              {item.availableSlots === -1 ? '约满' : `剩${item.availableSlots}位`}
            </Text>
          </View>
        </YStack>

        <ChevronRight size={16} color={theme.color10?.val} />
      </XStack>
    </Pressable>
  );

  // 渲染热门榜项
  const renderHotTopicItem = (item: HotTopicItem) => (
    <Pressable key={item.id} onPress={() => handleItemPress(item)}>
      <XStack
        gap="$2"
        alignItems="center"
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        marginBottom="$2"
      >
        {/* 排名 */}
        <View
          width={28}
          height={28}
          borderRadius={14}
          backgroundColor={item.rank <= 3 ? `${getRankColor(item.rank)}20` : '$color4'}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="$4"
            fontWeight="700"
            color={getRankColor(item.rank)}
          >
            {item.rank}
          </Text>
        </View>

        {/* 信息 */}
        <YStack flex={1} gap="$0.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={2}>
            {item.name}
          </Text>
          {item.author && (
            <Text fontSize="$3" color="$color10">
              {item.author}主讲
            </Text>
          )}
        </YStack>

        {/* 学习人数 */}
        <YStack alignItems="flex-end" gap="$0.5">
          <XStack alignItems="center" gap="$0.5">
            <Users size={14} color={theme.color10?.val} />
            <Text fontSize="$3" color="$color12" fontWeight="500">
              {formatCount(item.viewCount)}
            </Text>
          </XStack>
          <Text fontSize="$2" color="$color10">
            人学习
          </Text>
        </YStack>

        <ChevronRight size={16} color={theme.color10?.val} />
      </XStack>
    </Pressable>
  );

  // 格式化距离
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // 渲染附近商家榜项
  const renderNearbyServiceItem = (item: NearbyServiceItem) => (
    <Pressable key={item.id} onPress={() => handleItemPress(item)}>
      <XStack
        gap="$2"
        alignItems="flex-start"
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        marginBottom="$2"
      >
        {/* col1: 排名 */}
        <View
          width={28}
          height={28}
          borderRadius={14}
          backgroundColor={item.rank <= 3 ? `${getRankColor(item.rank)}20` : '$color4'}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="$4"
            fontWeight="700"
            color={getRankColor(item.rank)}
          >
            {item.rank}
          </Text>
        </View>

        {/* col2: 商家图片 */}
        <View position="relative">
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={styles.merchantImage}
          />
          {item.isOpen !== undefined && (
            <View
              position="absolute"
              bottom={0}
              right={0}
              backgroundColor={item.isOpen ? successColor : theme.color10?.val}
              paddingHorizontal={4}
              paddingVertical={2}
              borderRadius={4}
            >
              <Text fontSize={8} color="white" fontWeight="500">
                {item.isOpen ? '营业' : '休息'}
              </Text>
            </View>
          )}
        </View>

        {/* col3: 商家信息 */}
        <YStack flex={1} gap={2}>
          {/* 商家名+类型徽章 */}
          <XStack gap="$1" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={1}>
              {item.name}
            </Text>
            <View
              backgroundColor="$color4"
              paddingHorizontal="$1.5"
              paddingVertical="$0.25"
              borderRadius="$10"
            >
              <Text fontSize={10} color="$color10">
                {MERCHANT_TYPE_LABELS[item.merchantType] || item.merchantType}
              </Text>
            </View>
          </XStack>
          {/* 评分评价 */}
          <XStack gap="$0.5" alignItems="center">
            <Star size={12} color={warningColor} fill={warningColor} />
            <Text fontSize="$3" color="$color12" fontWeight="500">
              {item.rating}
            </Text>
            <Text fontSize="$2" color="$color10">
              ({item.reviewCount}评价)
            </Text>
          </XStack>
          {/* 价格区间 */}
          {item.priceRange && (
            <Text fontSize="$3" color="$color10">
              {item.priceRange}
            </Text>
          )}
          {/* 特色标签（徽章样式） */}
          {item.tags && item.tags.length > 0 && (
            <XStack gap="$1.5">
              {item.tags.slice(0, 2).map((tag, index) => (
                <View
                  key={index}
                  backgroundColor={`${primaryColor}15`}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <Text fontSize={10} color="$primary" fontWeight="500">
                    {tag}
                  </Text>
                </View>
              ))}
            </XStack>
          )}
        </YStack>

        {/* col4: 距离 */}
        <YStack alignItems="flex-end">
          <XStack gap="$0.5" alignItems="center">
            <MapPin size={14} color={primaryColor} />
            <Text fontSize="$3" color="$primary" fontWeight="500">
              {formatDistance(item.distance)}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </Pressable>
  );

  // 渲染列表项
  const renderItem = (item: RankingItem) => {
    if (isHotSalesItem(item)) return renderHotSalesItem(item);
    if (isPopularExpertItem(item)) return renderPopularExpertItem(item);
    if (isHotTopicItem(item)) return renderHotTopicItem(item);
    if (isNearbyServiceItem(item)) return renderNearbyServiceItem(item);
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color1?.val }}>
      {/* 标题栏 */}
      <TitleBar
        title="排行榜"
        titleIcon={<Flame size={20} color={errorColor} />}
        subtitle={ranking?.updateTime ? getUpdateTimeText() : undefined}
      />

      {/* Tab切换栏 */}
      <XStack
        paddingHorizontal="$2.5"
        paddingVertical="$1.5"
        gap="$2"
        backgroundColor="white"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        {RANKING_TABS.map((tab) => (
          <Pressable
            key={tab.type}
            onPress={() => setCurrentType(tab.type)}
          >
            <View
              paddingHorizontal="$2"
              paddingVertical="$1.5"
              borderRadius="$10"
              backgroundColor={currentType === tab.type ? '$primary' : '$color4'}
            >
              <Text
                fontSize="$3"
                fontWeight={currentType === tab.type ? '600' : '500'}
                color={currentType === tab.type ? 'white' : '$color10'}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </XStack>

      {/* 列表 */}
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$2.5">
          {/* 榜单说明 */}
          <View
            backgroundColor="$color2"
            borderRadius="$4"
            padding="$2"
            marginBottom="$2"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack alignItems="center" gap="$1">
              <Clock size={14} color={theme.color10?.val} />
              <Text fontSize="$3" color="$color10">
                {currentType === 'hotSales' && '榜单每小时更新，展示近7天销量TOP商品'}
                {currentType === 'popularExperts' && '榜单每小时更新，展示本周热门预约专家'}
                {currentType === 'hotTopics' && '榜单每小时更新，展示近7天热门主题内容'}
                {currentType === 'nearbyServices' && '基于您的位置，展示附近高评分养生商家'}
              </Text>
            </XStack>
          </View>

          {/* 榜单列表 */}
          {loading ? (
            <YStack alignItems="center" paddingVertical="$4">
              <Text color="$color10">加载中...</Text>
            </YStack>
          ) : ranking?.items.length === 0 ? (
            <YStack alignItems="center" paddingVertical="$4">
              <Text color="$color10">暂无数据</Text>
            </YStack>
          ) : (
            ranking?.items.map((item) => renderItem(item))
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  expertAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  merchantImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
});

export default RankingDetailScreen;
