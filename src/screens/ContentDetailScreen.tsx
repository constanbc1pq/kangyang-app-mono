/**
 * ContentDetailScreen 内容详情页
 * 展示文章、视频、食谱等内容详情
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
  Image,
} from 'tamagui';
import { Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Eye,
  Heart,
  Share2,
  Clock,
  Play,
  ChefHat,
  Sparkles,
  Star,
} from 'lucide-react-native';
import { getContentById } from '@/services/columnService';
import { ColumnContent } from '@/types/column';
import { getAvatarSource } from '@/constants/avatars';

type ContentDetailRouteParams = {
  ContentDetail: {
    contentId: string;
  };
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ContentDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ContentDetailRouteParams, 'ContentDetail'>>();
  const theme = useTheme();

  const [content, setContent] = useState<ColumnContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;

  // 加载内容数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const contentId = route.params?.contentId;
        if (!contentId) return;

        const contentData = await getContentById(contentId);
        setContent(contentData);
      } catch (error) {
        console.error('加载内容数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [route.params?.contentId]);

  // 格式化数字
  const formatCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 获取内容类型图标和标签
  const getContentTypeBadge = () => {
    if (!content) return null;

    switch (content.type) {
      case 'video':
        return (
          <XStack gap="$1" alignItems="center">
            <Play size={14} color="white" fill="white" />
            <Text fontSize="$2" color="white" fontWeight="500">
              {content.duration || '视频'}
            </Text>
          </XStack>
        );
      case 'recipe':
        return (
          <XStack gap="$1" alignItems="center">
            <ChefHat size={14} color="white" />
            <Text fontSize="$2" color="white" fontWeight="500">
              {content.cookingTime}分钟
            </Text>
          </XStack>
        );
      default:
        return (
          <XStack gap="$1" alignItems="center">
            <Clock size={14} color="white" />
            <Text fontSize="$2" color="white" fontWeight="500">
              {content.readTime || '阅读'}
            </Text>
          </XStack>
        );
    }
  };

  if (isLoading || !content) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text color="$color10">加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      {/* 固定头部 */}
      <View
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={20} color={theme.color12?.val} />
            </View>
          </Pressable>
          <Pressable onPress={() => {}}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <Share2 size={18} color={theme.color10?.val} />
            </View>
          </Pressable>
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 封面图 */}
        <View position="relative">
          <Image
            source={{ uri: content.coverImage }}
            width={SCREEN_WIDTH}
            height={220}
            resizeMode="cover"
          />
          {/* 类型标签 */}
          <View
            position="absolute"
            bottom={12}
            left={16}
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$3"
          >
            {getContentTypeBadge()}
          </View>
        </View>

        {/* 内容信息 */}
        <YStack paddingHorizontal="$2.5" paddingVertical="$2" gap="$2">
          {/* 标题 */}
          <Text fontSize="$6" fontWeight="700" color="$color12" lineHeight={28}>
            {content.title}
          </Text>

          {/* 作者和统计 */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$2" alignItems="center">
              <Image
                source={getAvatarSource(content.author.avatar, content.author.name)}
                width={36}
                height={36}
                borderRadius={18}
              />
              <YStack>
                <Text fontSize="$3" fontWeight="500" color="$color12">
                  {content.author.name}
                </Text>
                <Text fontSize="$2" color="$color10">
                  {formatDate(content.publishTime)}
                </Text>
              </YStack>
            </XStack>
            <XStack gap="$3">
              <XStack gap="$1" alignItems="center">
                <Eye size={14} color={theme.color10?.val} />
                <Text fontSize="$2" color="$color10">
                  {formatCount(content.viewCount)}
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <Heart size={14} color={theme.color10?.val} />
                <Text fontSize="$2" color="$color10">
                  {formatCount(content.likeCount)}
                </Text>
              </XStack>
            </XStack>
          </XStack>

          {/* 标签 */}
          {content.tags && content.tags.length > 0 && (
            <XStack gap="$1.5" flexWrap="wrap">
              {content.tags.map((tag, index) => (
                <View
                  key={index}
                  backgroundColor="$color4"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$10"
                >
                  <Text fontSize="$2" color="$color10">
                    #{tag}
                  </Text>
                </View>
              ))}
            </XStack>
          )}

          {/* 分隔线 */}
          <View height={1} backgroundColor="$color5" marginVertical="$1" />

          {/* 正文内容 */}
          <YStack gap="$2">
            {content.summary && (
              <View
                backgroundColor="$color4"
                padding="$2"
                borderRadius="$4"
                borderLeftWidth={3}
                borderLeftColor="$primary"
              >
                <Text fontSize="$3" color="$color11" lineHeight={22}>
                  {content.summary}
                </Text>
              </View>
            )}

            {/* 正文占位 - 实际内容应从后端获取 */}
            <Text fontSize="$4" color="$color12" lineHeight={26}>
              这是{content.type === 'article' ? '文章' : content.type === 'video' ? '视频' : content.type === 'recipe' ? '食谱' : '故事'}的正文内容区域。
            </Text>
            <Text fontSize="$4" color="$color12" lineHeight={26}>
              在实际应用中，此处将展示完整的内容详情，包括文字、图片、视频等多媒体元素。
            </Text>
            <Text fontSize="$4" color="$color12" lineHeight={26}>
              内容会根据类型不同呈现不同的展示形式：文章显示富文本，视频显示播放器，食谱显示材料和步骤等。
            </Text>

            {/* 食谱特有内容 */}
            {content.type === 'recipe' && (
              <View
                backgroundColor="$color2"
                padding="$2"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$color5"
                marginTop="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  烹饪信息
                </Text>
                <XStack gap="$4">
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      {content.cookingTime}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      分钟
                    </Text>
                  </YStack>
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      2-3
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      人份
                    </Text>
                  </YStack>
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      中等
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      难度
                    </Text>
                  </YStack>
                </XStack>
              </View>
            )}
          </YStack>

          {/* 养生好物 - 相关商品/服务推荐 */}
          <View marginTop="$4">
            <XStack alignItems="center" marginBottom="$2">
              <XStack gap="$1.5" alignItems="center">
                <Sparkles size={18} color={primaryColor} />
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  养生好物
                </Text>
              </XStack>
            </XStack>

            {/* 推荐商品列表 */}
            <YStack gap="$2">
              {/* 商品卡片1 */}
              <Pressable onPress={() => {}}>
                <View
                  backgroundColor="$color2"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$color5"
                  padding="$2"
                >
                  <XStack gap="$2">
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200' }}
                      width={80}
                      height={80}
                      borderRadius={8}
                    />
                    <YStack flex={1} justifyContent="space-between">
                      <YStack gap="$0.5">
                        <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={2}>
                          内蒙古羔羊肉卷 · 冬季滋补首选
                        </Text>
                        <XStack gap="$1" alignItems="center">
                          <Star size={12} color={theme.warning?.val} fill={theme.warning?.val} />
                          <Text fontSize="$2" color="$color10">4.9 · 已售1280份</Text>
                        </XStack>
                      </YStack>
                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack gap="$1" alignItems="baseline">
                          <Text fontSize="$4" fontWeight="700" color="$error">¥68</Text>
                          <Text fontSize="$2" color="$color10" textDecorationLine="line-through">¥88</Text>
                        </XStack>
                        <View
                          backgroundColor="$primary"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$10"
                        >
                          <Text fontSize="$2" color="white" fontWeight="500">立即购买</Text>
                        </View>
                      </XStack>
                    </YStack>
                  </XStack>
                </View>
              </Pressable>

              {/* 商品卡片2 */}
              <Pressable onPress={() => {}}>
                <View
                  backgroundColor="$color2"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$color5"
                  padding="$2"
                >
                  <XStack gap="$2">
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200' }}
                      width={80}
                      height={80}
                      borderRadius={8}
                    />
                    <YStack flex={1} justifyContent="space-between">
                      <YStack gap="$0.5">
                        <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={2}>
                          宁夏中宁枸杞 · 大颗粒头茬优选
                        </Text>
                        <XStack gap="$1" alignItems="center">
                          <Star size={12} color={theme.warning?.val} fill={theme.warning?.val} />
                          <Text fontSize="$2" color="$color10">4.8 · 已售986罐</Text>
                        </XStack>
                      </YStack>
                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack gap="$1" alignItems="baseline">
                          <Text fontSize="$4" fontWeight="700" color="$error">¥39</Text>
                          <Text fontSize="$2" color="$color10" textDecorationLine="line-through">¥49</Text>
                        </XStack>
                        <View
                          backgroundColor="$primary"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$10"
                        >
                          <Text fontSize="$2" color="white" fontWeight="500">立即购买</Text>
                        </View>
                      </XStack>
                    </YStack>
                  </XStack>
                </View>
              </Pressable>

              {/* 服务卡片 */}
              <Pressable onPress={() => {}}>
                <View
                  backgroundColor="$color2"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$color5"
                  padding="$2"
                >
                  <XStack gap="$2">
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200' }}
                      width={80}
                      height={80}
                      borderRadius={8}
                    />
                    <YStack flex={1} justifyContent="space-between">
                      <YStack gap="$0.5">
                        <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={2}>
                          悦养堂 · 冬季养生调理套餐
                        </Text>
                        <XStack gap="$1" alignItems="center">
                          <Star size={12} color={theme.warning?.val} fill={theme.warning?.val} />
                          <Text fontSize="$2" color="$color10">4.9 · 850m · 环境好</Text>
                        </XStack>
                      </YStack>
                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack gap="$1" alignItems="baseline">
                          <Text fontSize="$4" fontWeight="700" color="$error">¥158</Text>
                          <Text fontSize="$2" color="$color10">起</Text>
                        </XStack>
                        <View
                          backgroundColor="$primary"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$10"
                        >
                          <Text fontSize="$2" color="white" fontWeight="500">立即预约</Text>
                        </View>
                      </XStack>
                    </YStack>
                  </XStack>
                </View>
              </Pressable>
            </YStack>
          </View>

          {/* 底部安全区域 */}
          <View height="$8" />
        </YStack>
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
      >
        <XStack justifyContent="space-around" alignItems="center">
          <Pressable onPress={() => setIsBookmarked(!isBookmarked)}>
            <XStack alignItems="center" gap="$1.5">
              <Heart
                size={22}
                color={isBookmarked ? errorColor : theme.color10?.val}
                fill={isBookmarked ? errorColor : 'transparent'}
              />
              <Text fontSize="$2" color={isBookmarked ? '$error' : '$color10'}>
                {isBookmarked ? '已收藏' : formatCount(content.likeCount)}
              </Text>
            </XStack>
          </Pressable>
          <Pressable onPress={() => {}}>
            <XStack alignItems="center" gap="$1.5">
              <Share2 size={22} color={theme.color10?.val} />
              <Text fontSize="$2" color="$color10">
                分享
              </Text>
            </XStack>
          </Pressable>
        </XStack>
      </View>
    </SafeAreaView>
  );
};

export default ContentDetailScreen;
