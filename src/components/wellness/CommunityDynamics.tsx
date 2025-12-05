/**
 * 社区动态UGC组件
 * 展示用户真实分享，营造活跃氛围
 */

import React from 'react';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { Pressable, ScrollView } from 'react-native';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string; // emoji或头像URL
  userRole?: string; // "营养配餐用户" | "养老服务用户" etc.
  postType: 'check_in' | 'review' | 'sharing' | 'achievement';
  postTypeLabel: string; // "健康打卡" | "服务评价" | "经验分享" | "成就分享"
  content: string;
  images?: string[]; // 图片URL列表（最多3张）
  serviceTag?: string; // "营养配餐" | "私人医生" etc.
  likes: number;
  comments: number;
  shares: number;
  timestamp: string; // "2小时前" | "昨天" | "3天前"
  isLiked?: boolean; // 当前用户是否已点赞
  targetScreen?: string;
  targetParams?: any;
}

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onPress: (screen?: string, params?: any) => void;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onPress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  return (
    <Pressable
      onPress={() => onPress(post.targetScreen, post.targetParams)}
      style={{ width: 280, marginRight: 12 }}
    >
      <View
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={1}
        borderColor="$color5"
      >
        <YStack gap="$2">
          {/* 用户信息头部 */}
          <XStack alignItems="center" gap="$2">
            {/* 头像 */}
            <View
              width="$3.5"
              height="$3.5"
              borderRadius="$12"
              backgroundColor="$color3"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$6">{post.userAvatar}</Text>
            </View>

            {/* 用户名和时间 */}
            <YStack flex={1}>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {post.userName}
              </Text>
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$2" color="$color10">
                  {post.timestamp}
                </Text>
                {post.userRole && (
                  <>
                    <Text fontSize="$2" color="$color10">
                      ·
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      {post.userRole}
                    </Text>
                  </>
                )}
              </XStack>
            </YStack>

            {/* 内容类型标签 */}
            <View
              backgroundColor={`${primaryColor}15`}
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
            >
              <Text fontSize="$1" color="$primary" fontWeight="600">
                {post.postTypeLabel}
              </Text>
            </View>
          </XStack>

          {/* 内容 */}
          <Text fontSize="$3" color="$color12" numberOfLines={4}>
            {post.content}
          </Text>

          {/* 图片（如果有） */}
          {post.images && post.images.length > 0 && (
            <XStack gap="$1.5" flexWrap="wrap">
              {post.images.slice(0, 3).map((image, index) => (
                <View
                  key={index}
                  width={post.images!.length === 1 ? '100%' : 80}
                  height={80}
                  borderRadius="$3"
                  backgroundColor="$color3"
                  overflow="hidden"
                >
                  <View
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={`${primaryColor}10`}
                  >
                    <Text fontSize="$6">{image}</Text>
                  </View>
                </View>
              ))}
            </XStack>
          )}

          {/* 服务标签 */}
          {post.serviceTag && (
            <View
              backgroundColor="$color3"
              paddingHorizontal="$1.5"
              paddingVertical="$0.75"
              borderRadius="$2"
              alignSelf="flex-start"
            >
              <Text fontSize="$2" color="$color10">
                #{post.serviceTag}
              </Text>
            </View>
          )}

          {/* 互动按钮 */}
          <XStack
            justifyContent="space-around"
            paddingTop="$1.5"
            borderTopWidth={1}
            borderTopColor="$color5"
          >
            {/* 点赞 */}
            <Pressable onPress={() => onLike(post.id)}>
              <XStack alignItems="center" gap="$1">
                <Heart
                  size={18}
                  color={post.isLiked ? errorColor : color10}
                  fill={post.isLiked ? errorColor : 'none'}
                />
                <Text
                  fontSize="$2"
                  color={post.isLiked ? '$error' : '$color10'}
                >
                  {post.likes}
                </Text>
              </XStack>
            </Pressable>

            {/* 评论 */}
            <Pressable onPress={() => onComment(post.id)}>
              <XStack alignItems="center" gap="$1">
                <MessageCircle size={18} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {post.comments}
                </Text>
              </XStack>
            </Pressable>

            {/* 分享 */}
            <Pressable onPress={() => onShare(post.id)}>
              <XStack alignItems="center" gap="$1">
                <Share2 size={18} color={color10} />
                <Text fontSize="$2" color="$color10">
                  {post.shares}
                </Text>
              </XStack>
            </Pressable>
          </XStack>
        </YStack>
      </View>
    </Pressable>
  );
};

interface CommunityDynamicsProps {
  posts: CommunityPost[];
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onPostPress: (screen?: string, params?: any) => void;
  onViewAllPress: () => void;
}

export const CommunityDynamics: React.FC<CommunityDynamicsProps> = ({
  posts,
  onLike,
  onComment,
  onShare,
  onPostPress,
  onViewAllPress,
}) => {
  return (
    <View marginBottom="$2">
      <YStack gap="$2">
        {/* 标题 */}
        <View paddingHorizontal="$2.5">
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize="$5" fontWeight="600" color="$color12">
                社区动态
              </Text>
              <Text fontSize="$3" color="$color10" marginTop="$0.5">
                看看大家都在分享什么
              </Text>
            </YStack>
            <Pressable onPress={onViewAllPress}>
              <Text fontSize="$3" color="$primary" fontWeight="600">
                查看全部 →
              </Text>
            </Pressable>
          </XStack>
        </View>

        {/* 横向滚动动态列表 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
        >
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onComment={onComment}
              onShare={onShare}
              onPress={onPostPress}
            />
          ))}
        </ScrollView>
      </YStack>
    </View>
  );
};

/**
 * Mock社区动态数据
 */
export const mockCommunityPosts: CommunityPost[] = [
  // 健康打卡
  {
    id: 'post_001',
    userId: 'user_001',
    userName: '张阿姨',
    userAvatar: '👵',
    userRole: '营养配餐用户',
    postType: 'check_in',
    postTypeLabel: '健康打卡',
    content:
      '今天是使用营养配餐服务的第30天！体重从65kg降到62kg，血压也稳定了。感谢张营养师的专业指导，每天的饭菜既营养又好吃！',
    images: ['🍱', '📊', '💪'],
    serviceTag: '营养配餐',
    likes: 128,
    comments: 23,
    shares: 8,
    timestamp: '2小时前',
    isLiked: false,
    targetScreen: 'NutritionService',
    targetParams: { postId: 'post_001' },
  },
  // 服务评价
  {
    id: 'post_002',
    userId: 'user_002',
    userName: '李先生',
    userAvatar: '👨',
    userRole: '私人医生用户',
    postType: 'review',
    postTypeLabel: '服务评价',
    content:
      '私人医生服务真的很贴心，凌晨突然不舒服，医生马上就接电话了，详细询问症状，给了专业建议。第二天还主动回访，让人很安心。五星好评！',
    serviceTag: '私人医生',
    likes: 256,
    comments: 45,
    shares: 15,
    timestamp: '昨天',
    isLiked: true,
    targetScreen: 'PrivateDoctorList',
    targetParams: { postId: 'post_002' },
  },
  // 经验分享
  {
    id: 'post_003',
    userId: 'user_003',
    userName: '王女士',
    userAvatar: '👩',
    userRole: '养老服务用户',
    postType: 'sharing',
    postTypeLabel: '经验分享',
    content:
      '给父母订了居家养老服务，护理员陈阿姨特别专业也很有耐心。每天按时上门，帮老人洗澡、做康复训练，还陪老人聊天。父母现在精神状态好多了，作为子女也放心了。推荐给同样情况的朋友们！',
    images: ['👨‍👩‍👧', '❤️'],
    serviceTag: '养老服务',
    likes: 189,
    comments: 34,
    shares: 22,
    timestamp: '2天前',
    isLiked: false,
    targetScreen: 'ElderlyService',
    targetParams: { postId: 'post_003' },
  },
  // 成就分享
  {
    id: 'post_004',
    userId: 'user_004',
    userName: '赵阿姨',
    userAvatar: '👵',
    userRole: '慢病管理用户',
    postType: 'achievement',
    postTypeLabel: '成就分享',
    content:
      '糖尿病管理100天达成！在营养师和医生的帮助下，血糖从餐后12降到了8，糖化血红蛋白从9.5%降到7.2%。最重要的是学会了科学饮食和运动，感觉找到了健康生活的方法！',
    images: ['🏆', '📈', '🎉'],
    serviceTag: '慢病管理',
    likes: 342,
    comments: 56,
    shares: 28,
    timestamp: '3天前',
    isLiked: true,
    targetScreen: 'PrivateDoctorList',
    targetParams: { postId: 'post_004' },
  },
  // 服务评价
  {
    id: 'post_005',
    userId: 'user_005',
    userName: '刘先生',
    userAvatar: '👨',
    userRole: '遗嘱法律用户',
    postType: 'review',
    postTypeLabel: '服务评价',
    content:
      '一直想立遗嘱但不知道怎么开口跟孩子说。律师很专业，帮我理清了财产分配的思路，还协调了家人的意见。整个过程很顺利，现在心里踏实多了。感谢专业服务！',
    serviceTag: '遗嘱法律',
    likes: 95,
    comments: 18,
    shares: 7,
    timestamp: '5天前',
    isLiked: false,
    targetScreen: 'LegalServiceHome',
    targetParams: { postId: 'post_005' },
  },
  // 经验分享
  {
    id: 'post_006',
    userId: 'user_006',
    userName: '陈女士',
    userAvatar: '👩',
    userRole: '保险规划用户',
    postType: 'sharing',
    postTypeLabel: '经验分享',
    content:
      '用AI保险规划分析了一下家庭保障缺口，发现之前买的保险有很多重复的，还有些重要保障没覆盖到。顾问帮我重新规划，保费反而降了，保障更全面了。建议大家都来分析一下！',
    images: ['💰', '📋'],
    serviceTag: '保险规划',
    likes: 167,
    comments: 29,
    shares: 41,
    timestamp: '1周前',
    isLiked: false,
    targetScreen: 'InsuranceHome',
    targetParams: { postId: 'post_006' },
  },
];
