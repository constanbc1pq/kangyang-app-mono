import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H1,
  H3,
  Theme,
  ScrollView,
  Button,
  Separator,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator } from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageCircle,
  Calendar,
  Hash,
  Plus,
  Check,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { TitleBar } from '@/components/TitleBar';
import { Topic } from '@/types/community';
import { topicService } from '@/services/topicService';
import { useFocusEffect } from '@react-navigation/native';

interface TopicDetailScreenProps {
  route: {
    params: {
      topicId: string;
    };
  };
  navigation: any;
}

export const TopicDetailScreen: React.FC<TopicDetailScreenProps> = ({ route, navigation }) => {
  const { topicId } = route.params;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const loadTopic = async () => {
    setLoading(true);
    const data = await topicService.getTopicById(topicId);
    if (data) {
      setTopic(data);
      setIsFollowing(data.isFollowing);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTopic();
    }, [topicId])
  );

  const handleFollow = async () => {
    const newState = await topicService.toggleFollowTopic(topicId);
    setIsFollowing(newState);
    if (topic) {
      setTopic({
        ...topic,
        participants: newState ? topic.participants + 1 : topic.participants - 1,
      });
    }
  };

  const getTrendIcon = () => {
    if (!topic) return null;
    if (topic.trend === 'up') {
      return <TrendingUp size={16} color={COLORS.success} />;
    } else if (topic.trend === 'down') {
      return <TrendingDown size={16} color={COLORS.error} />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (!topic) return COLORS.textSecondary;
    if (topic.trend === 'up') return COLORS.success;
    if (topic.trend === 'down') return COLORS.error;
    return COLORS.textSecondary;
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

  if (!topic) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="$textSecondary">
            话题不存在
          </Text>
          <Button marginTop="$4" onPress={() => navigation.goBack()}>
            <Text color="white">返回</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Mock相关帖子数据
  const relatedPosts = [
    {
      id: '1',
      user: { name: '健康达人小王', avatar: '', verified: true },
      content: '分享一下我的冬季养生心得：早睡早起，多喝温水，适量进补。这个冬天明显感觉身体状态好了很多！',
      timestamp: '2小时前',
      likes: 45,
      comments: 12,
    },
    {
      id: '2',
      user: { name: '养生专家李医生', avatar: '', verified: true },
      content: '冬季养生要注意"藏"，不要过度运动消耗阳气。推荐一些温和的室内运动，比如八段锦、太极拳等。',
      timestamp: '5小时前',
      likes: 89,
      comments: 23,
    },
    {
      id: '3',
      user: { name: '营养师张姐', avatar: '', verified: true },
      content: '冬季进补不是盲目吃补品，要根据体质来。给大家分享几个适合不同体质的食疗方...',
      timestamp: '1天前',
      likes: 156,
      comments: 34,
    },
  ];

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <TitleBar title="返回" onBack={() => navigation.goBack()} />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack padding="$4" space="$4">
            {/* 话题头部 */}
            <Card
              padding="$5"
              borderRadius="$4"
              backgroundColor="$cardBg"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
            >
              <YStack space="$4">
                {/* 话题名称 */}
                <XStack space="$3" alignItems="center">
                  <View
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor={COLORS.primaryLight}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Hash size={28} color="white" />
                  </View>
                  <YStack flex={1}>
                    <H1 fontSize="$7" fontWeight="700" color="$text">
                      #{topic.name}
                    </H1>
                    <XStack space="$2" alignItems="center" marginTop="$1">
                      {getTrendIcon()}
                      <Text fontSize="$3" color={getTrendColor()} fontWeight="600">
                        {topic.trendValue}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>

                {/* 话题描述 */}
                <Text fontSize="$3" color="$textSecondary" lineHeight={22}>
                  {topic.description}
                </Text>

                {/* 统计数据 */}
                <XStack space="$5" flexWrap="wrap">
                  <XStack space="$2" alignItems="center">
                    <MessageCircle size={16} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$text">
                      <Text fontWeight="600">{topic.posts}</Text> 条讨论
                    </Text>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    <Users size={16} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$text">
                      <Text fontWeight="600">{topic.participants}</Text> 人参与
                    </Text>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    <Eye size={16} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$text">
                      <Text fontWeight="600">{topic.views}</Text> 次浏览
                    </Text>
                  </XStack>
                </XStack>

                {/* 标签 */}
                <XStack flexWrap="wrap" gap="$2">
                  {topic.tags.map((tag, index) => (
                    <View
                      key={index}
                      backgroundColor="rgba(99, 102, 241, 0.1)"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                    >
                      <Text fontSize="$2" color="$primary" fontWeight="500">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </XStack>

                {/* 创建时间 */}
                <XStack space="$2" alignItems="center">
                  <Calendar size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    创建于 {topic.createdDate}
                  </Text>
                </XStack>

                {/* 关注按钮 */}
                <Button
                  size="$4"
                  backgroundColor={isFollowing ? '$surface' : '$primary'}
                  onPress={handleFollow}
                  borderWidth={isFollowing ? 1 : 0}
                  borderColor="$borderColor"
                  icon={isFollowing ? <Check size={18} color={COLORS.text} /> : <Plus size={18} color="white" />}
                >
                  <Text
                    fontSize="$4"
                    color={isFollowing ? '$text' : 'white'}
                    fontWeight="600"
                  >
                    {isFollowing ? '已关注' : '关注话题'}
                  </Text>
                </Button>
              </YStack>
            </Card>

            {/* 相关讨论 */}
            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H3 fontSize="$6" fontWeight="600" color="$text">
                  相关讨论
                </H3>
                <Text fontSize="$3" color="$textSecondary">
                  {topic.posts} 条内容
                </Text>
              </XStack>

              {relatedPosts.map((post) => (
                <Card
                  key={post.id}
                  padding="$4"
                  borderRadius="$4"
                  backgroundColor="$cardBg"
                  shadowColor="$shadow"
                  shadowOffset={{ width: 0, height: 1 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                  elevation={2}
                >
                  <YStack space="$3">
                    {/* 用户信息 */}
                    <XStack space="$3" alignItems="center">
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
                          <Text fontSize="$3" fontWeight="600" color="$text">
                            {post.user.name}
                          </Text>
                          {post.user.verified && (
                            <View
                              width={16}
                              height={16}
                              borderRadius={8}
                              backgroundColor={COLORS.primary}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Check size={10} color="white" strokeWidth={3} />
                            </View>
                          )}
                        </XStack>
                        <Text fontSize="$2" color="$textSecondary">
                          {post.timestamp}
                        </Text>
                      </YStack>
                    </XStack>

                    {/* 内容 */}
                    <Text fontSize="$3" color="$text" lineHeight={22}>
                      {post.content}
                    </Text>

                    <Separator />

                    {/* 互动数据 */}
                    <XStack space="$5">
                      <XStack space="$2" alignItems="center">
                        <Text fontSize="$3" color="$textSecondary">
                          👍 {post.likes}
                        </Text>
                      </XStack>
                      <XStack space="$2" alignItems="center">
                        <MessageCircle size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {post.comments}
                        </Text>
                      </XStack>
                    </XStack>
                  </YStack>
                </Card>
              ))}

              {/* 加载更多 */}
              <View alignItems="center" paddingVertical="$3">
                <Button
                  size="$3"
                  variant="outlined"
                  borderColor="$borderColor"
                  backgroundColor="transparent"
                >
                  <Text fontSize="$3" color="$text">加载更多</Text>
                </Button>
              </View>
            </YStack>

            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};
