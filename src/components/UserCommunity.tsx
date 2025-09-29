import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
  TextArea,
} from 'tamagui';
import {
  MessageCircle,
  ThumbsUp,
  Share,
  MoreHorizontal,
  ImageIcon,
  Send,
  Heart,
  Bookmark,
  Flag,
  Clock,
  User,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export const UserCommunity: React.FC = () => {
  const [newPost, setNewPost] = useState('');

  const communityPosts = [
    {
      id: 1,
      user: {
        name: '健康达人小王',
        level: '活跃用户',
        verified: true,
      },
      content: '分享一下我妈妈的血压管理经验：每天定时测量，记录数据，配合清淡饮食和适量运动，三个月下来血压稳定了很多！大家有什么好的建议吗？',
      timestamp: '2小时前',
      likes: 23,
      comments: 8,
      shares: 3,
      tags: ['血压管理', '老年健康', '经验分享'],
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: 2,
      user: {
        name: '养生爱好者',
        level: '资深用户',
        verified: false,
      },
      content: '今天尝试了中医推荐的五行养生粥，用了黑豆、红豆、绿豆、黄豆、白扁豆，味道不错，据说对脾胃很好。有没有朋友试过类似的养生食谱？',
      timestamp: '4小时前',
      likes: 45,
      comments: 12,
      shares: 7,
      tags: ['中医养生', '食疗', '五行养生'],
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 3,
      user: {
        name: '康复小助手',
        level: '专业用户',
        verified: true,
      },
      content: '膝关节康复训练第30天打卡！从最初的疼痛难忍到现在可以正常行走，真的很感谢这个平台和大家的鼓励。附上今天的训练视频，希望能帮到有同样困扰的朋友。',
      timestamp: '6小时前',
      likes: 67,
      comments: 15,
      shares: 12,
      tags: ['康复训练', '膝关节', '打卡分享'],
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: 4,
      user: {
        name: '营养师小李',
        level: '专家认证',
        verified: true,
      },
      content: '冬季进补小贴士：不是所有人都适合大补，要根据个人体质来选择。体质偏热的人应该选择平补，体质偏寒的人才适合温补。大家可以先了解自己的体质再进补哦！',
      timestamp: '8小时前',
      likes: 89,
      comments: 23,
      shares: 18,
      tags: ['冬季进补', '体质调理', '专业建议'],
      isLiked: false,
      isBookmarked: false,
    },
  ];

  const challenges = [
    {
      id: 1,
      title: '21天早睡早起挑战',
      participants: 1234,
      daysLeft: 15,
      reward: '健康徽章',
      isJoined: true,
    },
    {
      id: 2,
      title: '每日万步走挑战',
      participants: 987,
      daysLeft: 8,
      reward: '运动达人称号',
      isJoined: false,
    },
    {
      id: 3,
      title: '健康饮食记录挑战',
      participants: 756,
      daysLeft: 22,
      reward: '营养专家认证',
      isJoined: true,
    },
  ];

  const handleLike = (postId: number) => {
    console.log('Liked post:', postId);
  };

  const handleBookmark = (postId: number) => {
    console.log('Bookmarked post:', postId);
  };

  const handleShare = (postId: number) => {
    console.log('Shared post:', postId);
  };

  return (
    <Theme name="light">
      <YStack space="$4">
        {/* Create Post */}
        <Card
          padding="$4"
          borderRadius="$4"
          backgroundColor="$cardBg"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <XStack space="$3">
            <View
              width={40}
              height={40}
              backgroundColor="$surface"
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <User size={20} color={COLORS.textSecondary} />
            </View>
            <YStack flex={1} space="$3">
              <TextArea
                placeholder="分享您的健康心得、经验或问题..."
                value={newPost}
                onChangeText={setNewPost}
                minHeight={80}
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                backgroundColor="$surface"
                fontSize="$3"
                padding="$3"
              />
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2">
                  <Button size="$3" chromeless>
                    <XStack space="$1" alignItems="center">
                      <ImageIcon size={16} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">图片</Text>
                    </XStack>
                  </Button>
                  <Button size="$3" chromeless>
                    <Text fontSize="$3" color="$textSecondary">话题</Text>
                  </Button>
                </XStack>
                <Button
                  size="$3"
                  backgroundColor={newPost.trim() ? '$primary' : '$textSecondary'}
                  disabled={!newPost.trim()}
                >
                  <XStack space="$1" alignItems="center">
                    <Send size={16} color="white" />
                    <Text fontSize="$3" color="white">发布</Text>
                  </XStack>
                </Button>
              </XStack>
            </YStack>
          </XStack>
        </Card>

        {/* Challenges */}
        <Card
          padding="$4"
          borderRadius="$4"
          backgroundColor="$cardBg"
          shadowColor="$shadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={4}
        >
          <XStack space="$2" alignItems="center" marginBottom="$4">
            <Heart size={20} color={COLORS.primary} />
            <H3 fontSize="$6" color="$text" fontWeight="600">
              健康挑战
            </H3>
          </XStack>

          <YStack space="$3">
            {challenges.map((challenge) => (
              <View
                key={challenge.id}
                padding="$4"
                borderRadius="$3"
                backgroundColor="$surface"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <H3 fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
                  {challenge.title}
                </H3>
                <YStack space="$2" marginBottom="$3">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$textSecondary">参与人数</Text>
                    <Text fontSize="$3" color="$text">{challenge.participants}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$textSecondary">剩余天数</Text>
                    <Text fontSize="$3" color="$text">{challenge.daysLeft}天</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$textSecondary">奖励</Text>
                    <Text fontSize="$3" color="$text">{challenge.reward}</Text>
                  </XStack>
                </YStack>
                <Button
                  size="$3"
                  backgroundColor={challenge.isJoined ? '$surface' : '$primary'}
                  variant={challenge.isJoined ? 'outlined' : undefined}
                  borderColor={challenge.isJoined ? '$borderColor' : undefined}
                >
                  <Text
                    fontSize="$3"
                    color={challenge.isJoined ? '$text' : 'white'}
                  >
                    {challenge.isJoined ? '已参与' : '参与挑战'}
                  </Text>
                </Button>
              </View>
            ))}
          </YStack>
        </Card>

        {/* Community Posts */}
        <YStack space="$3">
          {communityPosts.map((post) => (
            <Card
              key={post.id}
              padding="$4"
              borderRadius="$4"
              backgroundColor="$cardBg"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
            >
              <YStack space="$3">
                {/* User Info */}
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack space="$3" alignItems="center">
                    <View
                      width={40}
                      height={40}
                      backgroundColor="$surface"
                      borderRadius={20}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <User size={20} color={COLORS.textSecondary} />
                    </View>
                    <YStack>
                      <XStack space="$2" alignItems="center">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {post.user.name}
                        </Text>
                        {post.user.verified && (
                          <View
                            backgroundColor="$secondary"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" color="white">
                              {post.user.level}
                            </Text>
                          </View>
                        )}
                      </XStack>
                      <XStack space="$1" alignItems="center">
                        <Clock size={12} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {post.timestamp}
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>
                  <Button size="$3" chromeless>
                    <MoreHorizontal size={16} color={COLORS.textSecondary} />
                  </Button>
                </XStack>

                {/* Content */}
                <Text fontSize="$3" color="$text" lineHeight="$1">
                  {post.content}
                </Text>

                {/* Tags */}
                <XStack flexWrap="wrap" gap="$2">
                  {post.tags.map((tag, index) => (
                    <View
                      key={index}
                      backgroundColor="$surface"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color="$primary">
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </XStack>

                {/* Actions */}
                <XStack justifyContent="space-between" alignItems="center" paddingTop="$3">
                  <XStack space="$4" alignItems="center">
                    <Button
                      size="$3"
                      chromeless
                      onPress={() => handleLike(post.id)}
                    >
                      <XStack space="$1" alignItems="center">
                        <ThumbsUp
                          size={16}
                          color={post.isLiked ? COLORS.error : COLORS.textSecondary}
                        />
                        <Text
                          fontSize="$3"
                          color={post.isLiked ? COLORS.error : '$textSecondary'}
                        >
                          {post.likes}
                        </Text>
                      </XStack>
                    </Button>
                    <Button size="$3" chromeless>
                      <XStack space="$1" alignItems="center">
                        <MessageCircle size={16} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {post.comments}
                        </Text>
                      </XStack>
                    </Button>
                    <Button
                      size="$3"
                      chromeless
                      onPress={() => handleShare(post.id)}
                    >
                      <XStack space="$1" alignItems="center">
                        <Share size={16} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {post.shares}
                        </Text>
                      </XStack>
                    </Button>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    <Button
                      size="$3"
                      chromeless
                      onPress={() => handleBookmark(post.id)}
                    >
                      <Bookmark
                        size={16}
                        color={post.isBookmarked ? COLORS.primary : COLORS.textSecondary}
                      />
                    </Button>
                    <Button size="$3" chromeless>
                      <Flag size={16} color={COLORS.textSecondary} />
                    </Button>
                  </XStack>
                </XStack>
              </YStack>
            </Card>
          ))}
        </YStack>

        {/* Load More */}
        <View alignItems="center">
          <Button
            size="$4"
            variant="outlined"
            borderColor="$borderColor"
            backgroundColor="transparent"
          >
            <Text fontSize="$3" color="$text">加载更多内容</Text>
          </Button>
        </View>
      </YStack>
    </Theme>
  );
};