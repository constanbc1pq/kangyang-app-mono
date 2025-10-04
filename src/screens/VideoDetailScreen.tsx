import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  ScrollView,
  Button,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator, Dimensions } from 'react-native';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Play,
  CheckCircle,
  Eye,
  MoreHorizontal,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Video } from '@/types/community';
import { videoService } from '@/services/videoService';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface VideoDetailScreenProps {
  route: {
    params: {
      videoId: string;
    };
  };
  navigation: any;
}

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({ route, navigation }) => {
  const { videoId } = route.params;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const loadVideo = async () => {
    setLoading(true);
    const data = await videoService.getVideoById(videoId);
    if (data) {
      setVideo(data);
      setIsLiked(data.isLiked || false);
      setIsFollowed(data.isFollowed || false);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadVideo();
    }, [videoId])
  );

  const handleLike = async () => {
    const newState = await videoService.toggleLikeVideo(videoId);
    setIsLiked(newState);
    if (video) {
      setVideo({
        ...video,
        likes: newState ? video.likes + 1 : video.likes - 1,
      });
    }
  };

  const handleFollow = async () => {
    if (!video) return;
    const newState = await videoService.toggleFollowAuthor(video.author.id);
    setIsFollowed(newState);
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!video) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="white">
            视频不存在
          </Text>
          <Button marginTop="$4" onPress={() => navigation.goBack()}>
            <Text color="white">返回</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Theme name="dark">
      <View flex={1} backgroundColor="#000000">
        {/* 视频播放区域 */}
        <View
          width={width}
          height={height}
          backgroundColor="#1A1A1A"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          {/* 播放按钮 */}
          <Pressable style={{ position: 'absolute', zIndex: 10 }}>
            <View
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor="rgba(255,255,255,0.2)"
              justifyContent="center"
              alignItems="center"
            >
              <Play size={40} color="white" fill="white" />
            </View>
          </Pressable>

          {/* 视频封面占位 */}
          <Text fontSize="$6" color="white" opacity={0.5}>
            视频播放器占位
          </Text>
        </View>

        {/* 顶部返回按钮 */}
        <View
          position="absolute"
          top={50}
          left="$4"
          right="$4"
          zIndex={20}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Pressable onPress={() => navigation.goBack()}>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="rgba(0,0,0,0.5)"
                justifyContent="center"
                alignItems="center"
              >
                <ArrowLeft size={20} color="white" />
              </View>
            </Pressable>
            <Pressable>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="rgba(0,0,0,0.5)"
                justifyContent="center"
                alignItems="center"
              >
                <MoreHorizontal size={20} color="white" />
              </View>
            </Pressable>
          </XStack>
        </View>

        {/* 右侧互动按钮 - 抖音风格 */}
        <View
          position="absolute"
          right="$4"
          bottom={120}
          zIndex={20}
        >
          <YStack space="$5" alignItems="center">
            {/* 作者头像+关注 */}
            <View position="relative">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="#F0F0F0"
                borderWidth={2}
                borderColor="white"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$5" fontWeight="600" color="$primary">
                  {video.author.name[0]}
                </Text>
              </View>
              {!isFollowed && (
                <Pressable
                  onPress={handleFollow}
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    marginLeft: -10,
                  }}
                >
                  <View
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor={COLORS.error}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Plus size={14} color="white" strokeWidth={3} />
                  </View>
                </Pressable>
              )}
            </View>

            {/* 点赞 */}
            <Pressable onPress={handleLike}>
              <YStack space="$1" alignItems="center">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor="rgba(0,0,0,0.3)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Heart
                    size={28}
                    color={isLiked ? COLORS.error : 'white'}
                    fill={isLiked ? COLORS.error : 'none'}
                  />
                </View>
                <Text fontSize={12} color="white" fontWeight="600">
                  {formatNumber(video.likes)}
                </Text>
              </YStack>
            </Pressable>

            {/* 评论 */}
            <Pressable>
              <YStack space="$1" alignItems="center">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor="rgba(0,0,0,0.3)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MessageCircle size={28} color="white" />
                </View>
                <Text fontSize={12} color="white" fontWeight="600">
                  {formatNumber(video.comments)}
                </Text>
              </YStack>
            </Pressable>

            {/* 分享 */}
            <Pressable>
              <YStack space="$1" alignItems="center">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor="rgba(0,0,0,0.3)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Share2 size={26} color="white" />
                </View>
                <Text fontSize={12} color="white" fontWeight="600">
                  {formatNumber(video.shares)}
                </Text>
              </YStack>
            </Pressable>
          </YStack>
        </View>

        {/* 底部视频信息 */}
        <View
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          paddingHorizontal="$4"
          paddingBottom="$6"
          paddingTop="$8"
          zIndex={15}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          }}
        >
          <YStack space="$3">
            {/* 作者信息 */}
            <XStack space="$3" alignItems="center">
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="#F0F0F0"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$primary">
                  {video.author.name[0]}
                </Text>
              </View>
              <YStack flex={1}>
                <XStack space="$2" alignItems="center">
                  <Text fontSize="$4" fontWeight="600" color="white">
                    {video.author.name}
                  </Text>
                  {video.author.verified && (
                    <CheckCircle size={14} color={COLORS.primary} />
                  )}
                </XStack>
                <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                  {video.author.title}
                </Text>
              </YStack>
              {!isFollowed && (
                <Button
                  size="$3"
                  backgroundColor={COLORS.error}
                  borderWidth={0}
                  onPress={handleFollow}
                >
                  <Text fontSize="$3" color="white" fontWeight="600">
                    关注
                  </Text>
                </Button>
              )}
            </XStack>

            {/* 视频标题 */}
            <Pressable onPress={() => setShowDescription(!showDescription)}>
              <Text
                fontSize="$4"
                color="white"
                lineHeight={22}
                numberOfLines={showDescription ? undefined : 2}
              >
                {video.title}
              </Text>
            </Pressable>

            {/* 详细描述 */}
            {showDescription && (
              <Text fontSize="$3" color="rgba(255,255,255,0.8)" lineHeight={20}>
                {video.description}
              </Text>
            )}

            {/* 标签 */}
            <XStack flexWrap="wrap" gap="$2">
              {video.tags.map((tag, index) => (
                <View
                  key={index}
                  backgroundColor="rgba(99, 102, 241, 0.3)"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize={12} color="white">
                    #{tag}
                  </Text>
                </View>
              ))}
            </XStack>

            {/* 统计信息 */}
            <XStack space="$4" alignItems="center">
              <XStack space="$1" alignItems="center">
                <Eye size={14} color="rgba(255,255,255,0.7)" />
                <Text fontSize={12} color="rgba(255,255,255,0.7)">
                  {formatNumber(video.views)} 次观看
                </Text>
              </XStack>
              <Text fontSize={12} color="rgba(255,255,255,0.7)">
                {video.publishTime}
              </Text>
            </XStack>
          </YStack>
        </View>
      </View>
    </Theme>
  );
};
