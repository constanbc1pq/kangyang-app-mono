import React from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Heart, MessageCircle, MapPin, Clock, Tag } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  ServiceJob,
  SecondHandItem,
  CommunityPost,
  Expert,
  ExpertLevel,
  ItemCondition,
} from '@/types/community';

export type FeedItem =
  | { type: 'job'; data: ServiceJob }
  | { type: 'item'; data: SecondHandItem }
  | { type: 'post'; data: CommunityPost }
  | { type: 'expert'; data: Expert };

interface CommunityFeedCardProps {
  feedItem: FeedItem;
  onPress: () => void;
}

/**
 * 社区Feed卡片组件（小红书风格）
 * 支持多种内容类型的混合展示
 */
// 统一卡片高度常量
const CARD_HEIGHT = 380;

export const CommunityFeedCard: React.FC<CommunityFeedCardProps> = ({
  feedItem,
  onPress,
}) => {
  // 渲染服务需求卡片
  const renderJobCard = (job: ServiceJob) => {
    const jobWithDistance = job as ServiceJob & { distance?: string };
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="white"
          borderRadius="$4"
          overflow="hidden"
          marginBottom="$3"
          borderWidth={1}
          borderColor="$borderColor"
          height={CARD_HEIGHT}
        >
          {/* 封面图 */}
          {job.images && job.images.length > 0 && (
            <View style={{ width: '100%', height: 200 }}>
              <Image
                source={{ uri: job.images[0] }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {/* 紧急标签 */}
              {job.isUrgent && (
                <View style={styles.urgentBadge}>
                  <Text fontSize="$2" color="white" fontWeight="600">
                    紧急
                  </Text>
                </View>
              )}
              {/* 高佣金标签 */}
              {job.isHighReward && (
                <View style={[styles.urgentBadge, { backgroundColor: COLORS.warning, right: 8 }]}>
                  <Text fontSize="$2" color="white" fontWeight="600">
                    高佣金
                  </Text>
                </View>
              )}
              {/* 距离标签 */}
              {jobWithDistance.distance && (
                <View style={[styles.urgentBadge, { backgroundColor: COLORS.primary, right: 8, top: 'auto', bottom: 8 }]}>
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {jobWithDistance.distance}km
                  </Text>
                </View>
              )}
            </View>
          )}

          <View padding="$3">
            {/* 标题 */}
            <Text
              fontSize="$4"
              fontWeight="600"
              color="$text"
              marginBottom="$2"
              numberOfLines={2}
            >
              {job.title}
            </Text>

            {/* 描述 */}
            <Text
              fontSize="$3"
              color="$textSecondary"
              marginBottom="$3"
              numberOfLines={2}
              lineHeight={20}
            >
              {job.description}
            </Text>

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$2" alignItems="center">
                <Text fontSize={18}>{job.employerAvatar || '👤'}</Text>
                <Text fontSize="$2" color="$textSecondary">
                  {job.employerName}
                </Text>
              </XStack>

              <XStack space="$3" alignItems="center">
                <XStack space="$1" alignItems="center">
                  <MapPin size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {job.location.district}
                  </Text>
                </XStack>
                <Text fontSize="$3" fontWeight="600" color={COLORS.error}>
                  ¥{job.budget.min}-{job.budget.max}
                </Text>
              </XStack>
            </XStack>

            {/* 健康标签 */}
            {job.healthTags && job.healthTags.length > 0 && (
              <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                {job.healthTags.slice(0, 3).map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor={`${COLORS.primary}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color={COLORS.primary}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </XStack>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染二手商品卡片
  const renderItemCard = (item: SecondHandItem) => {
    const itemWithDistance = item as SecondHandItem & { distance?: string };
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="white"
          borderRadius="$4"
          overflow="hidden"
          marginBottom="$3"
          borderWidth={1}
          borderColor="$borderColor"
          height={CARD_HEIGHT}
        >
          {/* 封面图 */}
          {item.images && item.images.length > 0 && (
            <View style={{ width: '100%', height: 200 }}>
              <Image
                source={{ uri: item.images[0] }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {/* 免费角标 */}
              {item.isFree && (
                <View style={[styles.urgentBadge, { backgroundColor: COLORS.success }]}>
                  <Text fontSize="$2" color="white" fontWeight="600">
                    免费
                  </Text>
                </View>
              )}
              {/* 距离标签 */}
              {itemWithDistance.distance && (
                <View style={[styles.urgentBadge, { backgroundColor: COLORS.primary, right: 8, top: 'auto', bottom: 8 }]}>
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {itemWithDistance.distance}km
                  </Text>
                </View>
              )}
            </View>
          )}

          <View padding="$3">
            {/* 标题 */}
            <Text
              fontSize="$4"
              fontWeight="600"
              color="$text"
              marginBottom="$2"
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color={COLORS.error}>
                {item.isFree ? '免费赠送' : `¥${item.currentPrice}`}
              </Text>

              <XStack space="$2" alignItems="center">
                <Text fontSize={16}>{item.sellerAvatar || '👤'}</Text>
                <Heart size={16} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {item.favorites}
                </Text>
              </XStack>
            </XStack>

            {/* 位置和成色 */}
            <XStack space="$3" alignItems="center" marginTop="$2">
              <XStack space="$1" alignItems="center">
                <MapPin size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {item.location.district}
                </Text>
              </XStack>
              <View
                backgroundColor={`${COLORS.success}20`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$1" color={COLORS.success}>
                  {getConditionText(item.condition)}
                </Text>
              </View>
            </XStack>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染内容帖子卡片
  const renderPostCard = (post: CommunityPost) => {
    const postWithDistance = post as CommunityPost & { distance?: string };
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="white"
          borderRadius="$4"
          overflow="hidden"
          marginBottom="$3"
          borderWidth={1}
          borderColor="$borderColor"
          height={CARD_HEIGHT}
        >
          {/* 封面图 */}
          {post.coverImage && (
            <View style={{ width: '100%', height: 200 }}>
              <Image
                source={{ uri: post.coverImage }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {/* 距离标签 */}
              {postWithDistance.distance && (
                <View style={[styles.urgentBadge, { backgroundColor: COLORS.primary, right: 8, bottom: 8, top: 'auto' }]}>
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {postWithDistance.distance}km
                  </Text>
                </View>
              )}
            </View>
          )}

          <View padding="$3">
            {/* 标题 */}
            <Text
              fontSize="$4"
              fontWeight="600"
              color="$text"
              marginBottom="$2"
              numberOfLines={2}
            >
              {post.title}
            </Text>

            {/* 摘要 */}
            {post.summary && (
              <Text
                fontSize="$3"
                color="$textSecondary"
                marginBottom="$3"
                numberOfLines={2}
                lineHeight={20}
              >
                {post.summary}
              </Text>
            )}

            {/* 作者信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$2" alignItems="center">
                <Text fontSize={18}>{post.authorAvatar || '👤'}</Text>
                <Text fontSize="$2" color="$textSecondary">
                  {post.authorName}
                </Text>
                {post.authorVerified && (
                  <View
                    width={14}
                    height={14}
                    borderRadius={7}
                    backgroundColor={COLORS.primary}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={10} color="white">
                      ✓
                    </Text>
                  </View>
                )}
              </XStack>

              <XStack space="$4" alignItems="center">
                <XStack space="$1" alignItems="center">
                  <Heart size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {post.likes}
                  </Text>
                </XStack>
                <XStack space="$1" alignItems="center">
                  <MessageCircle size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {post.comments}
                  </Text>
                </XStack>
              </XStack>
            </XStack>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor="$background"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color="$textSecondary">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </XStack>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染达人卡片
  const renderExpertCard = (expert: Expert) => {
    const expertWithDistance = expert as Expert & { distance?: string };
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="white"
          borderRadius="$4"
          overflow="hidden"
          marginBottom="$3"
          borderWidth={1}
          borderColor="$borderColor"
          padding="$4"
          height={CARD_HEIGHT}
        >
          <XStack space="$3" alignItems="center" marginBottom="$3">
            {/* 头像 */}
            <View
              width={56}
              height={56}
              borderRadius={28}
              backgroundColor="$background"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={32}>{expert.avatar || '👤'}</Text>
            </View>

            {/* 达人信息 */}
            <YStack flex={1} space="$1">
              <XStack space="$2" alignItems="center">
                <Text fontSize="$5" fontWeight="600" color="$text">
                  {expert.name}
                </Text>
                {expert.realNameVerified && (
                  <Text fontSize="$4">
                    🏅
                  </Text>
                )}
                {expertWithDistance.distance && (
                  <View
                    backgroundColor={COLORS.primary}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color="white" fontWeight="600">
                      {expertWithDistance.distance}km
                    </Text>
                  </View>
                )}
              </XStack>

              <Text fontSize="$3" color="$textSecondary" numberOfLines={2}>
                {expert.introduction}
              </Text>

              {/* 评分和订单数 */}
              <XStack space="$4" marginTop="$1">
                <Text fontSize="$2" color={COLORS.warning}>
                  ⭐ {expert.rating.toFixed(1)}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  {expert.completedOrders}单
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  好评{expert.goodReviewRate}%
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* 服务展示图 */}
          {expert.showcaseImages && expert.showcaseImages.length > 0 && (
            <XStack space="$2">
              {expert.showcaseImages.slice(0, 3).map((image, index) => (
                <View
                  key={index}
                  flex={1}
                  aspectRatio={1}
                  borderRadius="$2"
                  overflow="hidden"
                  backgroundColor="$background"
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </XStack>
          )}

          {/* 服务标签 */}
          {expert.badges && expert.badges.length > 0 && (
            <XStack flexWrap="wrap" gap="$2" marginTop="$3">
              {expert.badges.slice(0, 3).map((badge, index) => (
                <View
                  key={index}
                  backgroundColor={`${COLORS.primary}15`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$1" color={COLORS.primary}>
                    {badge}
                  </Text>
                </View>
              ))}
            </XStack>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 辅助函数：获取成色文字
  const getConditionText = (condition: ItemCondition): string => {
    const map = {
      [ItemCondition.NEW]: '全新',
      [ItemCondition.EXCELLENT]: '95成新',
      [ItemCondition.GOOD]: '8-9成新',
      [ItemCondition.FAIR]: '7-8成新',
      [ItemCondition.POOR]: '5-7成新',
      [ItemCondition.VERY_POOR]: '5成以下',
    };
    return map[condition] || '未知';
  };

  // 根据类型渲染不同卡片
  switch (feedItem.type) {
    case 'job':
      return renderJobCard(feedItem.data);
    case 'item':
      return renderItemCard(feedItem.data);
    case 'post':
      return renderPostCard(feedItem.data);
    case 'expert':
      return renderExpertCard(feedItem.data);
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
