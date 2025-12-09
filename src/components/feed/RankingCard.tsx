/**
 * RankingCard - 排行榜组件
 * 统一支持热销榜、预约榜、热门榜、附近服务榜
 * 统一视觉样式：金银铜徽章、一致的列表项高度
 * 遵循 CLAUDE.md 组件规范
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { Trophy, ChevronRight, Star, MapPin } from 'lucide-react-native';
import {
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
import { formatCount } from '@/services/feedService';
import { getAvatarSource } from '@/constants/avatars';

// 排名徽章颜色配置（金银铜）
const RANK_COLORS = {
  1: { bg: '#FFF8E1', text: '#F9A825', border: '#FFD54F' },  // 金色
  2: { bg: '#ECEFF1', text: '#78909C', border: '#B0BEC5' },  // 银色
  3: { bg: '#FBE9E7', text: '#BF360C', border: '#FFAB91' },  // 铜色
  default: { bg: '#F5F5F5', text: '#9E9E9E', border: '#E0E0E0' },
};

// 商家类型标签
const MERCHANT_TYPE_LABELS: Record<string, string> = {
  wellness: '养生馆',
  teahouse: '茶馆',
  massage: '理疗按摩',
  tcm: '中医馆',
  fitness: '健身中心',
  spa: 'SPA会所',
};

interface RankingCardProps {
  ranking: RankingList;
  onItemPress: (item: RankingItem) => void;
  onViewMore?: () => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  ranking,
  onItemPress,
  onViewMore,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  // 获取排名徽章样式（金银铜统一）
  const getRankStyle = (rank: number) => {
    if (rank === 1) return RANK_COLORS[1];
    if (rank === 2) return RANK_COLORS[2];
    if (rank === 3) return RANK_COLORS[3];
    return RANK_COLORS.default;
  };

  // 统一的排名徽章组件
  const RankBadge = ({ rank }: { rank: number }) => {
    const style = getRankStyle(rank);
    return (
      <View
        width={28}
        height={28}
        borderRadius={14}
        backgroundColor={style.bg}
        borderWidth={1}
        borderColor={style.border}
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="$3" fontWeight="700" color={style.text}>
          {rank}
        </Text>
      </View>
    );
  };

  // 格式化距离
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
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

  // 渲染热销榜项（统一高度60px）
  const renderHotSalesItem = (item: HotSalesItem) => {
    const badge = getItemTypeBadge(item.itemType);
    return (
      <Pressable key={item.id} onPress={() => onItemPress(item)}>
        <XStack
          gap="$2"
          alignItems="center"
          height={60}
          borderBottomWidth={1}
          borderBottomColor="$color5"
        >
          {/* 排名徽章 */}
          <RankBadge rank={item.rank} />

          {/* 图片 */}
          <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.productImage} />

          {/* 信息 */}
          <YStack flex={1} gap="$0.5">
            <XStack gap="$1" alignItems="center">
              <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={1} flexShrink={1}>
                {item.name}
              </Text>
              {/* 类型徽章 */}
              <View
                backgroundColor={`${badge.color}15`}
                paddingHorizontal="$1"
                paddingVertical={2}
                borderRadius="$10"
              >
                <Text fontSize={9} color={badge.color} fontWeight="500">
                  {badge.text}
                </Text>
              </View>
            </XStack>
            <XStack alignItems="baseline" gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$error">
                ¥{item.price}
              </Text>
              {item.originalPrice && (
                <Text fontSize="$2" color="$color10" textDecorationLine="line-through">
                  ¥{item.originalPrice}
                </Text>
              )}
            </XStack>
          </YStack>

          {/* 销量 */}
          <Text fontSize="$2" color="$color10">
            已售{item.salesCount}
          </Text>
        </XStack>
      </Pressable>
    );
  };

  // 渲染预约榜项（横滑，带排名徽章）
  const renderPopularExpertItem = (item: PopularExpertItem) => (
    <Pressable key={item.id} onPress={() => onItemPress(item)}>
      <View
        width={110}
        alignItems="center"
        gap="$1"
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
      >
        {/* 头像带排名 */}
        <View position="relative">
          <Image
            source={getAvatarSource(item.avatar, item.name)}
            style={styles.expertAvatar}
          />
          {/* 排名徽章 */}
          <View position="absolute" top={-4} right={-4}>
            <View
              width={20}
              height={20}
              borderRadius={10}
              backgroundColor={getRankStyle(item.rank).bg}
              borderWidth={1}
              borderColor={getRankStyle(item.rank).border}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={10} fontWeight="700" color={getRankStyle(item.rank).text}>
                {item.rank}
              </Text>
            </View>
          </View>
          {/* 在线状态 */}
          {item.isOnline && (
            <View
              position="absolute"
              bottom={0}
              left={0}
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor="$success"
              borderWidth={2}
              borderColor="white"
            />
          )}
        </View>

        {/* 名字 */}
        <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={1}>
          {item.name}
        </Text>

        {/* 职称 */}
        <Text fontSize="$1" color="$color10" numberOfLines={1}>
          {item.title}
        </Text>

        {/* 预约状态 */}
        <View
          backgroundColor={
            item.availableSlots === -1
              ? '$color4'
              : item.availableSlots <= 3
              ? `${warningColor}20`
              : `${successColor}20`
          }
          paddingHorizontal="$1.5"
          paddingVertical="$0.5"
          borderRadius="$2"
        >
          <Text
            fontSize={10}
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
      </View>
    </Pressable>
  );

  // 渲染热门榜项（统一高度60px）
  const renderHotTopicItem = (item: HotTopicItem) => (
    <Pressable key={item.id} onPress={() => onItemPress(item)}>
      <XStack
        gap="$2"
        alignItems="center"
        height={60}
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        {/* 排名徽章 */}
        <RankBadge rank={item.rank} />

        {/* 信息 */}
        <YStack flex={1} gap="$0.5">
          <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={1}>
            {item.name}
          </Text>
          {item.author && (
            <Text fontSize="$2" color="$color10">
              {item.author}主讲
            </Text>
          )}
        </YStack>

        {/* 阅读量 */}
        <Text fontSize="$2" color="$color10">
          {formatCount(item.viewCount)}人学习
        </Text>
      </XStack>
    </Pressable>
  );

  // 渲染附近商家榜项（统一高度60px）
  const renderNearbyServiceItem = (item: NearbyServiceItem) => (
    <Pressable key={item.id} onPress={() => onItemPress(item)}>
      <XStack
        gap="$2"
        alignItems="center"
        height={60}
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        {/* 排名徽章 */}
        <RankBadge rank={item.rank} />

        {/* 商家图片 */}
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
              backgroundColor={item.isOpen ? '$success' : '$color10'}
              paddingHorizontal={4}
              paddingVertical={1}
              borderRadius={4}
            >
              <Text fontSize={8} color="white" fontWeight="500">
                {item.isOpen ? '营业' : '休息'}
              </Text>
            </View>
          )}
        </View>

        {/* 信息 */}
        <YStack flex={1} gap="$0.5">
          <XStack gap="$1" alignItems="center">
            <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={1}>
              {item.name}
            </Text>
            <View
              backgroundColor="$color4"
              paddingHorizontal="$1"
              paddingVertical="$0.25"
              borderRadius="$2"
            >
              <Text fontSize={10} color="$color10">
                {MERCHANT_TYPE_LABELS[item.merchantType] || item.merchantType}
              </Text>
            </View>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <XStack gap="$0.5" alignItems="center">
              <Star size={12} color={warningColor} fill={warningColor} />
              <Text fontSize="$2" color="$color12" fontWeight="500">
                {item.rating}
              </Text>
            </XStack>
            {item.priceRange && (
              <Text fontSize="$2" color="$color10">
                {item.priceRange}
              </Text>
            )}
          </XStack>
        </YStack>

        {/* 距离 */}
        <XStack gap="$0.5" alignItems="center">
          <MapPin size={12} color={primaryColor} />
          <Text fontSize="$2" color="$primary" fontWeight="500">
            {formatDistance(item.distance)}
          </Text>
        </XStack>
      </XStack>
    </Pressable>
  );

  // 预约榜使用横滑布局
  if (ranking.type === 'popularExperts') {
    return (
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={1}
        borderColor="$color5"
        padding="$2"
      >
        {/* 标题栏（统一样式） */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <XStack gap="$1.5" alignItems="center">
            <Trophy size={18} color={warningColor} />
            <Text fontSize="$4" fontWeight="600" color="$color12">
              {ranking.title}
            </Text>
          </XStack>
          {onViewMore && (
            <Pressable onPress={onViewMore}>
              <XStack gap="$0.5" alignItems="center">
                <Text fontSize="$3" color="$primary" fontWeight="500">
                  更多
                </Text>
                <ChevronRight size={14} color={primaryColor} />
              </XStack>
            </Pressable>
          )}
        </XStack>

        {/* 横滑列表 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {ranking.items.map((item) =>
            isPopularExpertItem(item) ? renderPopularExpertItem(item) : null
          )}
        </ScrollView>
      </View>
    );
  }

  // 热销榜、热门榜、附近服务榜使用列表布局
  return (
    <View
      backgroundColor="$color2"
      borderRadius="$5"
      borderWidth={1}
      borderColor="$color5"
      padding="$2"
    >
      {/* 标题栏（统一样式） */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
        <XStack gap="$1.5" alignItems="center">
          <Trophy size={18} color={warningColor} />
          <Text fontSize="$4" fontWeight="600" color="$color12">
            {ranking.title}
          </Text>
        </XStack>
        {onViewMore && (
          <Pressable onPress={onViewMore}>
            <XStack gap="$0.5" alignItems="center">
              <Text fontSize="$3" color="$primary" fontWeight="500">
                完整榜单
              </Text>
              <ChevronRight size={14} color={primaryColor} />
            </XStack>
          </Pressable>
        )}
      </XStack>

      {/* 列表区 */}
      <YStack>
        {ranking.items.map((item) => {
          if (isHotSalesItem(item)) return renderHotSalesItem(item);
          if (isHotTopicItem(item)) return renderHotTopicItem(item);
          if (isNearbyServiceItem(item)) return renderNearbyServiceItem(item);
          return null;
        })}
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  expertAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  merchantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
});

export default RankingCard;
