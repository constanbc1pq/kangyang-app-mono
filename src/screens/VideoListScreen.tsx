import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
  Input,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator, Dimensions } from 'react-native';
import {
  ArrowLeft,
  Search,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Video } from '@/types/community';
import { videoService } from '@/services/videoService';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2; // 2列布局: 总宽度 - (左右padding 32 + 中间gap 12) / 2列

interface VideoListScreenProps {
  navigation: any;
}

export const VideoListScreen: React.FC<VideoListScreenProps> = ({ navigation }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['全部', '运动健身', '营养饮食', '慢病管理', '老年健康'];

  const loadVideos = async () => {
    setLoading(true);
    if (searchQuery) {
      const results = await videoService.searchVideos(searchQuery);
      setVideos(results);
    } else {
      const data = await videoService.getVideosByCategory(selectedCategory);
      setVideos(data);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, [selectedCategory, searchQuery])
  );

  const handleVideoPress = (videoId: string) => {
    navigation.navigate('VideoDetail', { videoId });
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          paddingHorizontal="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="$background"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={24} color={COLORS.text} />
              <Text fontSize="$5" color="$text" fontWeight="600">
                健康视频
              </Text>
            </XStack>
          </Pressable>
        </XStack>

        <YStack flex={1}>
          {/* 搜索栏 */}
          <View padding="$4" paddingBottom="$3">
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
                placeholder="搜索健康视频..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                marginLeft="$2"
              />
            </XStack>
          </View>

          {/* 分类筛选 */}
          <View paddingBottom="$3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <XStack space="$2">
                {categories.map((category) => (
                  <Pressable key={category} onPress={() => setSelectedCategory(category)}>
                    <View
                      backgroundColor={
                        selectedCategory === category ? COLORS.primary : '$surface'
                      }
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        selectedCategory === category ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedCategory === category ? 'white' : '$text'}
                        fontWeight={selectedCategory === category ? '600' : '400'}
                      >
                        {category}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </ScrollView>
          </View>

          {/* 视频网格列表 - 类似小红书的瀑布流 */}
          {loading ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : videos.length === 0 ? (
            <View flex={1} justifyContent="center" alignItems="center" padding="$4">
              <Play size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                暂无视频
              </Text>
            </View>
          ) : (
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              <View paddingHorizontal="$4" paddingTop="$2" paddingBottom="$6">
                <XStack flexWrap="wrap" justifyContent="space-between" rowGap="$3">
                  {videos.map((video) => (
                    <Pressable
                      key={video.id}
                      onPress={() => handleVideoPress(video.id)}
                      style={{ width: CARD_WIDTH, marginBottom: 12 }}
                    >
                      <Card
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        overflow="hidden"
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={4}
                        elevation={3}
                      >
                        <YStack>
                          {/* 视频封面 */}
                          <View
                            width="100%"
                            height={CARD_WIDTH * 1.3}
                            backgroundColor="#F0F0F0"
                            position="relative"
                          >
                            {/* 播放按钮 */}
                            <View
                              position="absolute"
                              top="50%"
                              left="50%"
                              marginTop={-20}
                              marginLeft={-20}
                              width={40}
                              height={40}
                              borderRadius={20}
                              backgroundColor="rgba(0,0,0,0.5)"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Play size={20} color="white" fill="white" />
                            </View>

                            {/* 时长 */}
                            <View
                              position="absolute"
                              bottom="$2"
                              right="$2"
                              backgroundColor="rgba(0,0,0,0.7)"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize={11} color="white" fontWeight="500">
                                {video.duration}
                              </Text>
                            </View>

                            {/* 热门标签 */}
                            {video.views > 20000 && (
                              <View
                                position="absolute"
                                top="$2"
                                left="$2"
                                backgroundColor={COLORS.error}
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius="$2"
                              >
                                <XStack space="$1" alignItems="center">
                                  <TrendingUp size={10} color="white" />
                                  <Text fontSize={10} color="white" fontWeight="600">
                                    热门
                                  </Text>
                                </XStack>
                              </View>
                            )}
                          </View>

                          {/* 视频信息 */}
                          <YStack padding="$3" space="$2">
                            {/* 标题 */}
                            <Text
                              fontSize="$3"
                              fontWeight="600"
                              color="$text"
                              numberOfLines={2}
                              lineHeight="$1"
                            >
                              {video.title}
                            </Text>

                            {/* 作者信息 */}
                            <XStack space="$2" alignItems="center">
                              <View
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor="$surface"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Text fontSize={10} fontWeight="600" color="$primary">
                                  {video.author.name[0]}
                                </Text>
                              </View>
                              <Text fontSize="$2" color="$textSecondary" numberOfLines={1} flex={1}>
                                {video.author.name}
                              </Text>
                              {video.author.verified && (
                                <CheckCircle size={12} color={COLORS.primary} />
                              )}
                            </XStack>

                            {/* 统计数据 */}
                            <XStack justifyContent="space-between" alignItems="center">
                              <XStack space="$3" alignItems="center">
                                <XStack space="$1" alignItems="center">
                                  <Heart size={12} color={COLORS.textSecondary} />
                                  <Text fontSize={11} color="$textSecondary">
                                    {formatNumber(video.likes)}
                                  </Text>
                                </XStack>
                                <XStack space="$1" alignItems="center">
                                  <Eye size={12} color={COLORS.textSecondary} />
                                  <Text fontSize={11} color="$textSecondary">
                                    {formatNumber(video.views)}
                                  </Text>
                                </XStack>
                              </XStack>
                            </XStack>
                          </YStack>
                        </YStack>
                      </Card>
                    </Pressable>
                  ))}
                </XStack>
              </View>
            </ScrollView>
          )}
        </YStack>
      </SafeAreaView>
    </Theme>
  );
};
