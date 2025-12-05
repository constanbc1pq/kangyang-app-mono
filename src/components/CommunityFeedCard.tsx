/**
 * CommunityFeedCard 社区Feed卡片组件
 * 支持多种内容类型的混合展示
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Heart, MessageCircle, MapPin } from 'lucide-react-native';
import {
  ServiceJob,
  SecondHandItem,
  CommunityPost,
  Expert,
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
 * 社区Feed卡片组件
 * 不同类型自适应高度
 */
export const CommunityFeedCard: React.FC<CommunityFeedCardProps> = ({
  feedItem,
  onPress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  // 渲染状态徽章（符合 CLAUDE.md 规范）
  const renderBadge = (
    text: string,
    color: string | undefined,
    position: 'left' | 'right' = 'left',
    bottom?: boolean
  ) => (
    <View
      position="absolute"
      top={bottom ? undefined : 8}
      bottom={bottom ? 8 : undefined}
      left={position === 'left' ? 8 : undefined}
      right={position === 'right' ? 8 : undefined}
      backgroundColor={color}
      paddingHorizontal="$2"
      paddingVertical="$0.5"
      borderRadius="$10"
    >
      <Text fontSize={10} color="white" fontWeight="500">
        {text}
      </Text>
    </View>
  );

  // 渲染服务需求卡片（邻里帮）
  const renderJobCard = (job: ServiceJob) => {
    const jobWithDistance = job as ServiceJob & { distance?: string };
    const hasImage = job.images && job.images.length > 0;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          overflow="hidden"
          marginBottom="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          {/* 封面图 */}
          {hasImage && (
            <View style={{ width: '100%', height: 160 }}>
              <Image
                source={{ uri: job.images![0] }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {/* 紧急标签 */}
              {job.isUrgent && renderBadge('紧急', errorColor, 'left')}
              {/* 高佣金标签 */}
              {job.isHighReward && renderBadge('高佣金', warningColor, 'right')}
              {/* 距离标签 */}
              {jobWithDistance.distance && renderBadge(`${jobWithDistance.distance}km`, primaryColor, 'right', true)}
            </View>
          )}

          <View padding="$2">
            {/* 标题 */}
            <Text
              fontSize="$4"
              fontWeight="600"
              color="$color12"
              marginBottom="$1.5"
              numberOfLines={2}
            >
              {job.title}
            </Text>

            {/* 描述 */}
            <Text
              fontSize="$3"
              color="$color10"
              marginBottom="$2"
              numberOfLines={2}
              lineHeight={20}
            >
              {job.description}
            </Text>

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$2" alignItems="center">
                <Text fontSize={16}>{job.employerAvatar || '👤'}</Text>
                <Text fontSize="$2" color="$color10">
                  {job.employerName}
                </Text>
              </XStack>

              <XStack gap="$2" alignItems="center">
                <XStack gap="$1" alignItems="center">
                  <MapPin size={14} color={color10} />
                  <Text fontSize="$2" color="$color10">
                    {job.location.district}
                  </Text>
                </XStack>
                <Text fontSize="$3" fontWeight="600" color={errorColor}>
                  ¥{job.budget.min}-{job.budget.max}
                </Text>
              </XStack>
            </XStack>

            {/* 健康标签 */}
            {job.healthTags && job.healthTags.length > 0 && (
              <XStack flexWrap="wrap" gap="$1.5" marginTop="$2">
                {job.healthTags.slice(0, 3).map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor="$color4"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color="$color12" fontWeight="500">
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

  // 渲染二手商品卡片（邻里闲物）
  const renderItemCard = (item: SecondHandItem) => {
    const itemWithDistance = item as SecondHandItem & { distance?: string };
    const hasImage = item.images && item.images.length > 0;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          overflow="hidden"
          marginBottom="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          {/* 封面图 */}
          {hasImage && (
            <View style={{ width: '100%', height: 180 }}>
              <Image
                source={{ uri: item.images![0] }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {/* 免费角标 */}
              {item.isFree && renderBadge('免费', successColor, 'left')}
              {/* 距离标签 */}
              {itemWithDistance.distance && renderBadge(`${itemWithDistance.distance}km`, primaryColor, 'right', true)}
            </View>
          )}

          <View padding="$2">
            {/* 标题 */}
            <Text
              fontSize="$4"
              fontWeight="600"
              color="$color12"
              marginBottom="$1.5"
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {/* 价格和互动 */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color={errorColor}>
                {item.isFree ? '免费赠送' : `¥${item.currentPrice}`}
              </Text>

              <XStack gap="$2" alignItems="center">
                <Text fontSize={14}>{item.sellerAvatar || '👤'}</Text>
                <Heart size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {item.favorites}
                </Text>
              </XStack>
            </XStack>

            {/* 位置和成色 */}
            <XStack gap="$2" alignItems="center" marginTop="$1.5">
              <XStack gap="$1" alignItems="center">
                <MapPin size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {item.location.district}
                </Text>
              </XStack>
              <View
                backgroundColor="$color4"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color="$color12" fontWeight="500">
                  {getConditionText(item.condition)}
                </Text>
              </View>
            </XStack>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染内容帖子卡片（分享）
  const renderPostCard = (post: CommunityPost) => {
    const postWithDistance = post as CommunityPost & { distance?: string };

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          overflow="hidden"
          marginBottom="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          {/* 封面图 */}
          {post.coverImage && (
            <View style={{ width: '100%', height: 160 }}>
              <Image
                source={{ uri: post.coverImage }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {/* 距离标签 */}
              {postWithDistance.distance && renderBadge(`${postWithDistance.distance}km`, primaryColor, 'right', true)}
            </View>
          )}

          <View padding="$2">
            {/* 标题 */}
            <Text
              fontSize="$4"
              fontWeight="600"
              color="$color12"
              marginBottom="$1.5"
              numberOfLines={2}
            >
              {post.title}
            </Text>

            {/* 摘要 */}
            {post.summary && (
              <Text
                fontSize="$3"
                color="$color10"
                marginBottom="$2"
                numberOfLines={2}
                lineHeight={20}
              >
                {post.summary}
              </Text>
            )}

            {/* 作者信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$2" alignItems="center">
                <Text fontSize={16}>{post.authorAvatar || '👤'}</Text>
                <Text fontSize="$2" color="$color10">
                  {post.authorName}
                </Text>
                {post.authorVerified && (
                  <View
                    width={14}
                    height={14}
                    borderRadius={7}
                    backgroundColor={primaryColor}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={8} color="white">
                      ✓
                    </Text>
                  </View>
                )}
              </XStack>

              <XStack gap="$3" alignItems="center">
                <XStack gap="$1" alignItems="center">
                  <Heart size={14} color={color10} />
                  <Text fontSize="$2" color="$color10">
                    {post.likes}
                  </Text>
                </XStack>
                <XStack gap="$1" alignItems="center">
                  <MessageCircle size={14} color={color10} />
                  <Text fontSize="$2" color="$color10">
                    {post.comments}
                  </Text>
                </XStack>
              </XStack>
            </XStack>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <XStack flexWrap="wrap" gap="$1.5" marginTop="$2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor="$color4"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color="$color10" fontWeight="500">
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

  // 渲染达人卡片（附近服务）
  const renderExpertCard = (expert: Expert) => {
    const expertWithDistance = expert as Expert & { distance?: string };

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          overflow="hidden"
          marginBottom="$2"
          borderWidth={1}
          borderColor="$color5"
          padding="$2"
        >
          <XStack gap="$2" alignItems="center" marginBottom="$2">
            {/* 头像 */}
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={28}>{expert.avatar || '👤'}</Text>
            </View>

            {/* 达人信息 */}
            <YStack flex={1} gap="$0.5">
              <XStack gap="$2" alignItems="center">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {expert.name}
                </Text>
                {expert.realNameVerified && (
                  <Text fontSize="$3">🏅</Text>
                )}
                {expertWithDistance.distance && (
                  <View
                    backgroundColor={primaryColor}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize={10} color="white" fontWeight="500">
                      {expertWithDistance.distance}km
                    </Text>
                  </View>
                )}
              </XStack>

              <Text fontSize="$2" color="$color10" numberOfLines={1}>
                {expert.introduction}
              </Text>

              {/* 评分和订单数 */}
              <XStack gap="$3" marginTop="$0.5">
                <Text fontSize="$2" color={warningColor}>
                  ⭐ {expert.rating.toFixed(1)}
                </Text>
                <Text fontSize="$2" color="$color10">
                  {expert.completedOrders}单
                </Text>
                <Text fontSize="$2" color="$color10">
                  好评{expert.goodReviewRate}%
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* 服务展示图 */}
          {expert.showcaseImages && expert.showcaseImages.length > 0 && (
            <XStack gap="$1.5">
              {expert.showcaseImages.slice(0, 3).map((image, index) => (
                <View
                  key={index}
                  flex={1}
                  height={80}
                  borderRadius="$4"
                  overflow="hidden"
                  backgroundColor="$color4"
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
            <XStack flexWrap="wrap" gap="$1.5" marginTop="$2">
              {expert.badges.slice(0, 3).map((badge, index) => (
                <View
                  key={index}
                  backgroundColor="$color4"
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <Text fontSize={10} color="$color12" fontWeight="500">
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
});
