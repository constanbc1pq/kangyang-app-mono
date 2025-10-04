import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H2,
  H3,
  Theme,
  ScrollView,
  Button,
  Separator,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator } from 'react-native';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Share2,
  Settings,
  CheckCircle,
  ThumbsUp,
  Clock,
  TrendingUp,
  Shield,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Circle, CirclePost, CircleMember } from '@/types/community';
import { circleService } from '@/services/circleService';
import { useFocusEffect } from '@react-navigation/native';

interface CircleDetailScreenProps {
  route: {
    params: {
      circleId: string;
    };
  };
  navigation: any;
}

export const CircleDetailScreen: React.FC<CircleDetailScreenProps> = ({ route, navigation }) => {
  const { circleId } = route.params;
  const [circle, setCircle] = useState<Circle | null>(null);
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [activeMembers, setActiveMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'rules'>('posts');

  const loadData = async () => {
    setLoading(true);
    const circleData = await circleService.getCircleById(circleId);
    if (circleData) {
      setCircle(circleData);
      setIsJoined(circleData.isJoined);
    }

    const postsData = await circleService.getCirclePosts(circleId);
    setPosts(postsData);

    const membersData = await circleService.getActiveMembers(circleId);
    setActiveMembers(membersData);

    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [circleId])
  );

  const handleJoin = async () => {
    const newState = await circleService.toggleJoinCircle(circleId);
    setIsJoined(newState);
    if (circle) {
      setCircle({
        ...circle,
        members: newState ? circle.members + 1 : circle.members - 1,
      });
    }
  };

  const handleLikePost = async (postId: string) => {
    const newState = await circleService.toggleLikeCirclePost(postId);
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: newState ? post.likes + 1 : post.likes - 1, isLiked: newState }
        : post
    ));
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!circle) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="$textSecondary">
            圈子不存在
          </Text>
          <Button marginTop="$4" onPress={() => navigation.goBack()}>
            <Text color="white">返回</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="$background"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={24} color={COLORS.text} />
              <Text fontSize="$4" color="$text" fontWeight="500">
                返回
              </Text>
            </XStack>
          </Pressable>
          <XStack space="$3">
            <Pressable>
              <Share2 size={24} color={COLORS.textSecondary} />
            </Pressable>
            {isJoined && (
              <Pressable>
                <Settings size={24} color={COLORS.textSecondary} />
              </Pressable>
            )}
          </XStack>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack>
            {/* 圈子信息头部 */}
            <YStack padding="$4" space="$4" backgroundColor="$cardBg">
              {/* 圈子图标和基本信息 */}
              <XStack space="$4" alignItems="flex-start">
                <View
                  width={64}
                  height={64}
                  borderRadius={32}
                  backgroundColor="$surface"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Users size={32} color={COLORS.primary} />
                </View>
                <YStack flex={1} space="$2">
                  <XStack space="$2" alignItems="center">
                    <H2 fontSize="$7" fontWeight="700" color="$text">
                      {circle.name}
                    </H2>
                    {circle.isVerified && (
                      <CheckCircle size={20} color={COLORS.primary} />
                    )}
                  </XStack>
                  <XStack space="$4">
                    <XStack space="$1" alignItems="center">
                      <Users size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {circle.members} 成员
                      </Text>
                    </XStack>
                    <XStack space="$1" alignItems="center">
                      <MessageCircle size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {circle.posts} 帖子
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>
              </XStack>

              {/* 圈子描述 */}
              <Text fontSize="$3" color="$text" lineHeight="$2">
                {circle.description}
              </Text>

              {/* 标签 */}
              <XStack flexWrap="wrap" gap="$2">
                {circle.tags.map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor="rgba(99, 102, 241, 0.1)"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                  >
                    <Text fontSize="$3" color="$primary" fontWeight="500">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </XStack>

              {/* 今日动态 */}
              <View
                backgroundColor="$surface"
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <XStack justifyContent="space-around">
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      {circle.todayPosts}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      今日新帖
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700" color="$text">
                      {circle.posts}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      总帖子数
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700" color="$text">
                      {circle.members}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      圈子成员
                    </Text>
                  </YStack>
                </XStack>
              </View>

              {/* 加入按钮 */}
              <Button
                size="$4"
                backgroundColor={isJoined ? '$surface' : '$primary'}
                onPress={handleJoin}
                borderWidth={isJoined ? 1 : 0}
                borderColor="$borderColor"
              >
                <Text
                  fontSize="$4"
                  color={isJoined ? '$text' : 'white'}
                  fontWeight="600"
                >
                  {isJoined ? '已加入' : '加入圈子'}
                </Text>
              </Button>
            </YStack>

            {/* Tab导航 */}
            <XStack
              backgroundColor="$surface"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('posts')}>
                <View
                  flex={1}
                  paddingVertical="$3"
                  borderBottomWidth={2}
                  borderBottomColor={activeTab === 'posts' ? COLORS.primary : 'transparent'}
                >
                  <Text
                    fontSize="$4"
                    color={activeTab === 'posts' ? '$primary' : '$textSecondary'}
                    fontWeight={activeTab === 'posts' ? '600' : '400'}
                    textAlign="center"
                  >
                    帖子
                  </Text>
                </View>
              </Pressable>
              <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('members')}>
                <View
                  flex={1}
                  paddingVertical="$3"
                  borderBottomWidth={2}
                  borderBottomColor={activeTab === 'members' ? COLORS.primary : 'transparent'}
                >
                  <Text
                    fontSize="$4"
                    color={activeTab === 'members' ? '$primary' : '$textSecondary'}
                    fontWeight={activeTab === 'members' ? '600' : '400'}
                    textAlign="center"
                  >
                    成员
                  </Text>
                </View>
              </Pressable>
              <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('rules')}>
                <View
                  flex={1}
                  paddingVertical="$3"
                  borderBottomWidth={2}
                  borderBottomColor={activeTab === 'rules' ? COLORS.primary : 'transparent'}
                >
                  <Text
                    fontSize="$4"
                    color={activeTab === 'rules' ? '$primary' : '$textSecondary'}
                    fontWeight={activeTab === 'rules' ? '600' : '400'}
                    textAlign="center"
                  >
                    规则
                  </Text>
                </View>
              </Pressable>
            </XStack>

            {/* Tab内容 */}
            <YStack padding="$4" space="$3">
              {activeTab === 'posts' && (
                <YStack space="$3">
                  {posts.length === 0 ? (
                    <View paddingVertical="$6" alignItems="center">
                      <MessageCircle size={48} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                        暂无帖子
                      </Text>
                    </View>
                  ) : (
                    posts.map((post) => (
                      <Card
                        key={post.id}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        borderWidth={1}
                        borderColor={post.isPinned ? COLORS.warning : '$borderColor'}
                      >
                        <YStack space="$3">
                          {/* 用户信息 */}
                          <XStack justifyContent="space-between" alignItems="flex-start">
                            <XStack space="$3" flex={1}>
                              <View
                                width={40}
                                height={40}
                                borderRadius={20}
                                backgroundColor="$surface"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Text fontSize="$4" fontWeight="600" color="$primary">
                                  {post.user.name[0]}
                                </Text>
                              </View>
                              <YStack flex={1}>
                                <XStack space="$2" alignItems="center">
                                  <Text fontSize="$4" fontWeight="600" color="$text">
                                    {post.user.name}
                                  </Text>
                                  {post.user.verified && (
                                    <CheckCircle size={14} color={COLORS.primary} />
                                  )}
                                </XStack>
                                <XStack space="$2" alignItems="center">
                                  <View
                                    backgroundColor="rgba(99, 102, 241, 0.1)"
                                    paddingHorizontal="$2"
                                    paddingVertical="$1"
                                    borderRadius="$2"
                                  >
                                    <Text fontSize="$2" color="$primary">
                                      {post.user.level}
                                    </Text>
                                  </View>
                                  <Text fontSize="$3" color="$textSecondary">
                                    {post.timestamp}
                                  </Text>
                                </XStack>
                              </YStack>
                            </XStack>
                            {post.isPinned && (
                              <View
                                backgroundColor={COLORS.warning}
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius="$2"
                              >
                                <Text fontSize="$2" color="white">
                                  置顶
                                </Text>
                              </View>
                            )}
                          </XStack>

                          {/* 帖子内容 */}
                          <Text fontSize="$3" color="$text" lineHeight="$3">
                            {post.content}
                          </Text>

                          {/* 互动区域 */}
                          <XStack justifyContent="space-between" alignItems="center">
                            <Pressable onPress={() => handleLikePost(post.id)}>
                              <XStack space="$2" alignItems="center">
                                <ThumbsUp
                                  size={18}
                                  color={post.isLiked ? COLORS.primary : COLORS.textSecondary}
                                  fill={post.isLiked ? COLORS.primary : 'none'}
                                />
                                <Text
                                  fontSize="$3"
                                  color={post.isLiked ? '$primary' : '$textSecondary'}
                                >
                                  {post.likes}
                                </Text>
                              </XStack>
                            </Pressable>
                            <Pressable>
                              <XStack space="$2" alignItems="center">
                                <MessageCircle size={18} color={COLORS.textSecondary} />
                                <Text fontSize="$3" color="$textSecondary">
                                  {post.comments}
                                </Text>
                              </XStack>
                            </Pressable>
                            <Pressable>
                              <Share2 size={18} color={COLORS.textSecondary} />
                            </Pressable>
                          </XStack>
                        </YStack>
                      </Card>
                    ))
                  )}
                </YStack>
              )}

              {activeTab === 'members' && (
                <YStack space="$3">
                  {/* 管理员 */}
                  <YStack space="$2">
                    <H3 fontSize="$5" fontWeight="600" color="$text">
                      管理员
                    </H3>
                    {circle.admins.map((admin, index) => (
                      <XStack
                        key={index}
                        space="$3"
                        padding="$3"
                        borderRadius="$3"
                        backgroundColor="$surface"
                        borderWidth={1}
                        borderColor="$borderColor"
                        alignItems="center"
                      >
                        <View
                          width={40}
                          height={40}
                          borderRadius={20}
                          backgroundColor="$background"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Shield size={20} color={COLORS.warning} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$4" fontWeight="600" color="$text">
                            {admin.name}
                          </Text>
                          <Text fontSize="$3" color="$textSecondary">
                            {admin.title} • {admin.role}
                          </Text>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>

                  {/* 活跃成员 */}
                  <YStack space="$2" marginTop="$3">
                    <H3 fontSize="$5" fontWeight="600" color="$text">
                      活跃成员
                    </H3>
                    {activeMembers.map((member) => (
                      <XStack
                        key={member.id}
                        space="$3"
                        padding="$3"
                        borderRadius="$3"
                        backgroundColor="$surface"
                        borderWidth={1}
                        borderColor="$borderColor"
                        alignItems="center"
                      >
                        <View
                          width={40}
                          height={40}
                          borderRadius={20}
                          backgroundColor="$background"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize="$4" fontWeight="600" color="$primary">
                            {member.name[0]}
                          </Text>
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$4" fontWeight="600" color="$text">
                            {member.name}
                          </Text>
                          <XStack space="$2" alignItems="center">
                            <View
                              backgroundColor="rgba(99, 102, 241, 0.1)"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color="$primary">
                                {member.level}
                              </Text>
                            </View>
                            <Text fontSize="$3" color="$textSecondary">
                              {member.posts} 帖子
                            </Text>
                          </XStack>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              )}

              {activeTab === 'rules' && (
                <YStack space="$3">
                  <H3 fontSize="$5" fontWeight="600" color="$text">
                    圈子规则
                  </H3>
                  {circle.rules.map((rule, index) => (
                    <XStack key={index} space="$3" alignItems="flex-start">
                      <View
                        width={24}
                        height={24}
                        borderRadius={12}
                        backgroundColor={COLORS.primary}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$3" color="white" fontWeight="600">
                          {index + 1}
                        </Text>
                      </View>
                      <Text fontSize="$3" color="$text" flex={1} lineHeight="$3">
                        {rule}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              )}
            </YStack>

            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};
