import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H1,
  H2,
  H3,
  Theme,
  ScrollView,
  Input,
  Separator,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MessageCircle,
  Search,
  TrendingUp,
  Users,
  BookOpen,
  Play,
  ThumbsUp,
  Eye,
  Star,
  Filter,
  Clock,
  UserCheck,
  Plus,
  Radio,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { COLORS } from '@/constants/app';
import { HealthNews } from '@/components/HealthNews';
import { ExpertLectures } from '@/components/ExpertLectures';
import { UserCommunity } from '@/components/UserCommunity';

export const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredContent = [
    {
      id: 1,
      type: "article",
      title: "冬季养生：如何科学进补",
      author: "张医师",
      authorTitle: "中医养生专家",
      readTime: "5分钟",
      views: 1234,
      likes: 89,
      tags: ["冬季养生", "中医", "进补"],
      summary: "冬季是进补的最佳时节，但如何科学进补却大有学问...",
    },
    {
      id: 2,
      type: "video",
      title: "老年人居家运动指南",
      author: "李教练",
      authorTitle: "康复理疗师",
      duration: "12分钟",
      views: 2156,
      likes: 156,
      tags: ["老年健康", "居家运动", "康复"],
      summary: "适合老年人的居家运动方案，安全有效提升身体机能...",
    },
    {
      id: 3,
      type: "live",
      title: "营养专家在线答疑",
      author: "王营养师",
      authorTitle: "注册营养师",
      startTime: "今晚8点",
      viewers: 456,
      status: "upcoming",
      tags: ["营养咨询", "在线答疑", "直播"],
      summary: "营养专家在线解答您的饮食健康问题...",
    },
  ];

  const trendingTopics = [
    { name: "冬季养生", posts: 234, trend: "up" },
    { name: "血压管理", posts: 189, trend: "up" },
    { name: "老年护理", posts: 156, trend: "stable" },
    { name: "营养搭配", posts: 134, trend: "up" },
    { name: "运动康复", posts: 98, trend: "down" },
  ];

  const healthCircles = [
    {
      id: 1,
      name: "糖尿病友互助圈",
      members: 1234,
      posts: 567,
      description: "糖尿病患者经验分享与互助支持",
      isJoined: true,
    },
    {
      id: 2,
      name: "高血压管理群",
      members: 987,
      posts: 432,
      description: "高血压患者日常管理经验交流",
      isJoined: false,
    },
    {
      id: 3,
      name: "养生食疗分享",
      members: 2156,
      posts: 1234,
      description: "传统养生食疗方法分享与讨论",
      isJoined: true,
    },
    {
      id: 4,
      name: "老年健康关爱",
      members: 876,
      posts: 345,
      description: "关注老年人健康，分享护理经验",
      isJoined: false,
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return COLORS.success;
      case "down": return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen size={16} color={COLORS.primary} />;
      case "video":
        return <Play size={16} color={COLORS.secondary} />;
      case "live":
        return <Radio size={16} color={COLORS.error} />;
      default:
        return <BookOpen size={16} color={COLORS.primary} />;
    }
  };

  const getContentTypeBg = (type: string) => {
    switch (type) {
      case "article": return "rgba(99, 102, 241, 0.1)";
      case "video": return "rgba(139, 92, 246, 0.1)";
      case "live": return "rgba(239, 68, 68, 0.1)";
      default: return "rgba(99, 102, 241, 0.1)";
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack space="$4" padding="$4">
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <YStack>
                <H1 fontSize="$9" fontWeight="bold" color="$text">
                  健康社区
                </H1>
                <Text fontSize="$4" color="$textSecondary">
                  分享健康知识，交流养生经验
                </Text>
              </YStack>
              <Button
                size="$3"
                variant="outlined"
                borderColor="$primary"
                backgroundColor="transparent"
              >
                <XStack space="$2" alignItems="center">
                  <Filter size={16} color={COLORS.primary} />
                  <Text fontSize="$3" color="$primary">筛选</Text>
                </XStack>
              </Button>
            </XStack>

            {/* Search Bar */}
            <XStack
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              backgroundColor="$surface"
              alignItems="center"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <Search size={16} color={COLORS.textSecondary} />
              <Input
                flex={1}
                borderWidth={0}
                backgroundColor="transparent"
                placeholder="搜索健康话题、专家、文章..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                marginLeft="$2"
              />
            </XStack>

            {/* Featured Content */}
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
                <Star size={20} color={COLORS.primary} />
                <H3 fontSize="$6" color="$text" fontWeight="600">
                  精选内容
                </H3>
              </XStack>

              <YStack space="$4">
                {featuredContent.map((content) => (
                  <Card
                    key={content.id}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    pressStyle={{ scale: 0.98 }}
                  >
                    <YStack space="$3">
                      {/* Content type badge */}
                      <XStack justifyContent="space-between" alignItems="center">
                        <View
                          backgroundColor={getContentTypeBg(content.type)}
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <XStack space="$1" alignItems="center">
                            {getContentTypeIcon(content.type)}
                            <Text fontSize="$2" color="$text" textTransform="capitalize">
                              {content.type === 'article' ? '文章' :
                               content.type === 'video' ? '视频' : '直播'}
                            </Text>
                          </XStack>
                        </View>
                        {content.type === "live" && content.status === "upcoming" && (
                          <View
                            backgroundColor="$error"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$2" color="white">即将开始</Text>
                          </View>
                        )}
                      </XStack>

                      {/* Content info */}
                      <YStack space="$2">
                        <H3 fontSize="$5" fontWeight="600" color="$text">
                          {content.title}
                        </H3>
                        <XStack space="$2" alignItems="center">
                          <Text fontSize="$3" color="$textSecondary">
                            {content.author}
                          </Text>
                          <View width={4} height={4} borderRadius={2} backgroundColor="$textSecondary" />
                          <Text fontSize="$3" color="$textSecondary">
                            {content.authorTitle}
                          </Text>
                        </XStack>
                        <Text fontSize="$3" color="$textSecondary" lineHeight="$1" numberOfLines={2}>
                          {content.summary}
                        </Text>

                        {/* Tags */}
                        <XStack flexWrap="wrap" gap="$2">
                          {content.tags.map((tag, index) => (
                            <View
                              key={index}
                              backgroundColor="rgba(99, 102, 241, 0.1)"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color="$primary">
                                {tag}
                              </Text>
                            </View>
                          ))}
                        </XStack>

                        {/* Stats */}
                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack space="$4" alignItems="center">
                            <XStack space="$1" alignItems="center">
                              <Eye size={14} color={COLORS.textSecondary} />
                              <Text fontSize="$3" color="$textSecondary">
                                {content.views || content.viewers}
                              </Text>
                            </XStack>
                            {content.likes && (
                              <XStack space="$1" alignItems="center">
                                <ThumbsUp size={14} color={COLORS.textSecondary} />
                                <Text fontSize="$3" color="$textSecondary">
                                  {content.likes}
                                </Text>
                              </XStack>
                            )}
                            {content.readTime && (
                              <XStack space="$1" alignItems="center">
                                <Clock size={14} color={COLORS.textSecondary} />
                                <Text fontSize="$3" color="$textSecondary">
                                  {content.readTime}
                                </Text>
                              </XStack>
                            )}
                          </XStack>
                        </XStack>
                      </YStack>
                    </YStack>
                  </Card>
                ))}
              </YStack>
            </Card>

            {/* Trending Topics */}
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
                <TrendingUp size={20} color={COLORS.primary} />
                <H3 fontSize="$6" color="$text" fontWeight="600">
                  热门话题
                </H3>
              </XStack>

              <YStack space="$3">
                {trendingTopics.map((topic, index) => (
                  <XStack
                    key={index}
                    justifyContent="space-between"
                    alignItems="center"
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    pressStyle={{ scale: 0.98 }}
                  >
                    <YStack flex={1}>
                      <XStack space="$2" alignItems="center" marginBottom="$1">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {topic.name}
                        </Text>
                        <TrendingUp
                          size={12}
                          color={getTrendColor(topic.trend)}
                          style={{
                            transform: topic.trend === 'down' ? [{ rotate: '180deg' }] : undefined
                          }}
                        />
                      </XStack>
                      <Text fontSize="$3" color="$textSecondary">
                        {topic.posts} 条讨论
                      </Text>
                    </YStack>
                    <Button size="$3" variant="outlined" borderColor="$primary">
                      <Text fontSize="$3" color="$primary">关注</Text>
                    </Button>
                  </XStack>
                ))}
              </YStack>
            </Card>

            {/* Health Circles */}
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
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                <XStack space="$2" alignItems="center">
                  <Users size={20} color={COLORS.primary} />
                  <H3 fontSize="$6" color="$text" fontWeight="600">
                    健康圈子
                  </H3>
                </XStack>
                <Button size="$2" chromeless>
                  <Text fontSize="$3" color="$primary">查看全部</Text>
                </Button>
              </XStack>

              <YStack space="$3">
                {healthCircles.map((circle) => (
                  <XStack
                    key={circle.id}
                    space="$4"
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <View
                      width={60}
                      height={60}
                      backgroundColor="$background"
                      borderRadius="$3"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Users size={24} color={COLORS.primary} />
                    </View>
                    <YStack flex={1}>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                        <XStack space="$2" alignItems="center">
                          <H3 fontSize="$4" fontWeight="600" color="$text">
                            {circle.name}
                          </H3>
                          {circle.isJoined && (
                            <UserCheck size={16} color={COLORS.success} />
                          )}
                        </XStack>
                        <Button
                          size="$3"
                          backgroundColor={circle.isJoined ? '$surface' : '$primary'}
                          variant={circle.isJoined ? 'outlined' : undefined}
                          borderColor={circle.isJoined ? '$borderColor' : undefined}
                        >
                          <Text
                            fontSize="$3"
                            color={circle.isJoined ? '$text' : 'white'}
                          >
                            {circle.isJoined ? '已加入' : '加入'}
                          </Text>
                        </Button>
                      </XStack>
                      <Text fontSize="$3" color="$textSecondary" marginBottom="$2" numberOfLines={2}>
                        {circle.description}
                      </Text>
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
                ))}
              </YStack>
            </Card>

            {/* Main Content Tabs */}
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
              {/* Tab Buttons */}
              <XStack
                backgroundColor="$surface"
                borderRadius="$3"
                padding="$1"
                marginBottom="$4"
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('news')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'news' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'news' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'news' ? '600' : '400'}
                    >
                      健康资讯
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('lectures')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'lectures' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'lectures' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'lectures' ? '600' : '400'}
                    >
                      专家讲堂
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('community')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'community' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'community' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'community' ? '600' : '400'}
                    >
                      用户社区
                    </Text>
                  </View>
                </Pressable>
              </XStack>

              <Separator marginBottom="$4" />

              {/* Tab Content */}
              {activeTab === 'news' && <HealthNews />}
              {activeTab === 'lectures' && <ExpertLectures />}
              {activeTab === 'community' && <UserCommunity />}
            </Card>

            {/* Bottom padding for safe area */}
            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};