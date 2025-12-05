/**
 * ContentCard 内容卡片组件
 * 用于在内容流中展示单个内容项
 * 支持文章、视频、食谱、故事等类型
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme, Image } from 'tamagui';
import { Pressable } from 'react-native';
import { Eye, Heart, Clock, Play, ChefHat, BookOpen } from 'lucide-react-native';
import { ColumnContent, ContentType } from '@/types/column';
import { getAvatarSource } from '@/constants/avatars';

interface ContentCardProps {
  content: ColumnContent;
  onPress?: (content: ColumnContent) => void;
  variant?: 'default' | 'compact' | 'large';
}

// 格式化数字
const formatCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
};

// 获取内容类型图标
const getContentTypeIcon = (type: ContentType, color?: string) => {
  switch (type) {
    case 'video':
      return <Play size={12} color={color || 'white'} fill={color || 'white'} />;
    case 'recipe':
      return <ChefHat size={12} color={color || 'white'} />;
    case 'story':
      return <BookOpen size={12} color={color || 'white'} />;
    default:
      return <Clock size={12} color={color || 'white'} />;
  }
};

// 获取内容类型标签
const getContentTypeLabel = (content: ColumnContent) => {
  switch (content.type) {
    case 'video':
      return content.duration || '视频';
    case 'recipe':
      return `${content.cookingTime}分钟`;
    case 'story':
      return content.readTime || '故事';
    default:
      return content.readTime || '阅读';
  }
};

// 获取内容类型中文名
const getContentTypeName = (type: ContentType) => {
  switch (type) {
    case 'video':
      return '视频';
    case 'recipe':
      return '食谱';
    case 'story':
      return '故事';
    default:
      return '文章';
  }
};

/**
 * 默认样式卡片 - 横向布局
 */
const DefaultCard: React.FC<ContentCardProps> = ({ content, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onPress?.(content)}>
      <View
        backgroundColor="$color2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        overflow="hidden"
      >
        <XStack>
          {/* 封面图 */}
          <View position="relative" width={120} height={90}>
            <Image
              source={{ uri: content.coverImage }}
              width={120}
              height={90}
              resizeMode="cover"
            />
            {/* 类型标签 */}
            <View
              position="absolute"
              bottom={6}
              right={6}
              backgroundColor="rgba(0,0,0,0.6)"
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
            >
              <XStack gap="$0.5" alignItems="center">
                {getContentTypeIcon(content.type)}
                <Text fontSize={10} color="white">
                  {getContentTypeLabel(content)}
                </Text>
              </XStack>
            </View>
          </View>
          {/* 内容信息 */}
          <YStack flex={1} padding="$2" justifyContent="space-between">
            <YStack gap="$1">
              <Text
                fontSize="$4"
                fontWeight="600"
                color="$color12"
                numberOfLines={2}
              >
                {content.title}
              </Text>
              {content.summary && (
                <Text fontSize="$2" color="$color10" numberOfLines={1}>
                  {content.summary}
                </Text>
              )}
            </YStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$2" color="$color10">
                {content.author.name}
              </Text>
              <XStack gap="$2">
                <XStack gap="$0.5" alignItems="center">
                  <Eye size={12} color={theme.color10?.val} />
                  <Text fontSize="$1" color="$color10">
                    {formatCount(content.viewCount)}
                  </Text>
                </XStack>
                <XStack gap="$0.5" alignItems="center">
                  <Heart size={12} color={theme.color10?.val} />
                  <Text fontSize="$1" color="$color10">
                    {formatCount(content.likeCount)}
                  </Text>
                </XStack>
              </XStack>
            </XStack>
          </YStack>
        </XStack>
      </View>
    </Pressable>
  );
};

/**
 * 紧凑样式卡片 - 更小的尺寸
 */
const CompactCard: React.FC<ContentCardProps> = ({ content, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onPress?.(content)}>
      <View
        backgroundColor="$color2"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$color5"
        overflow="hidden"
      >
        <XStack>
          {/* 封面图 */}
          <View position="relative" width={80} height={60}>
            <Image
              source={{ uri: content.coverImage }}
              width={80}
              height={60}
              resizeMode="cover"
            />
          </View>
          {/* 内容信息 */}
          <YStack flex={1} padding="$1.5" justifyContent="space-between">
            <Text
              fontSize="$3"
              fontWeight="500"
              color="$color12"
              numberOfLines={2}
            >
              {content.title}
            </Text>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$1" color="$color10">
                {getContentTypeName(content.type)}
              </Text>
              <XStack gap="$1" alignItems="center">
                <Eye size={10} color={theme.color10?.val} />
                <Text fontSize="$1" color="$color10">
                  {formatCount(content.viewCount)}
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </XStack>
      </View>
    </Pressable>
  );
};

/**
 * 大卡片样式 - 垂直布局，突出展示
 */
const LargeCard: React.FC<ContentCardProps> = ({ content, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onPress?.(content)}>
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={1}
        borderColor="$color5"
        overflow="hidden"
      >
        {/* 封面图 */}
        <View position="relative" width="100%" height={180}>
          <Image
            source={{ uri: content.coverImage }}
            width="100%"
            height={180}
            resizeMode="cover"
          />
          {/* 类型标签 */}
          <View
            position="absolute"
            top={12}
            left={12}
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$3"
          >
            <XStack gap="$1" alignItems="center">
              {getContentTypeIcon(content.type)}
              <Text fontSize="$2" color="white" fontWeight="500">
                {getContentTypeLabel(content)}
              </Text>
            </XStack>
          </View>
          {/* 精选标签 */}
          {content.isFeatured && (
            <View
              position="absolute"
              top={12}
              right={12}
              backgroundColor="$primary"
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize="$2" color="white" fontWeight="500">
                精选
              </Text>
            </View>
          )}
        </View>
        {/* 内容信息 */}
        <YStack padding="$2" gap="$1.5">
          <Text
            fontSize="$5"
            fontWeight="600"
            color="$color12"
            numberOfLines={2}
          >
            {content.title}
          </Text>
          {content.summary && (
            <Text fontSize="$3" color="$color10" numberOfLines={2}>
              {content.summary}
            </Text>
          )}
          {/* 作者和统计 */}
          <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
            <XStack gap="$2" alignItems="center">
              <Image
                source={getAvatarSource(content.author.avatar, content.author.name)}
                width={28}
                height={28}
                borderRadius={14}
              />
              <YStack>
                <Text fontSize="$3" fontWeight="500" color="$color12">
                  {content.author.name}
                </Text>
                {content.author.title && (
                  <Text fontSize="$1" color="$color10">
                    {content.author.title}
                  </Text>
                )}
              </YStack>
            </XStack>
            <XStack gap="$3">
              <XStack gap="$0.5" alignItems="center">
                <Eye size={14} color={theme.color10?.val} />
                <Text fontSize="$2" color="$color10">
                  {formatCount(content.viewCount)}
                </Text>
              </XStack>
              <XStack gap="$0.5" alignItems="center">
                <Heart size={14} color={theme.color10?.val} />
                <Text fontSize="$2" color="$color10">
                  {formatCount(content.likeCount)}
                </Text>
              </XStack>
            </XStack>
          </XStack>
          {/* 标签 */}
          {content.tags && content.tags.length > 0 && (
            <XStack gap="$1" marginTop="$1">
              {content.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  backgroundColor="$color4"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <Text fontSize="$1" color="$color10">
                    #{tag}
                  </Text>
                </View>
              ))}
            </XStack>
          )}
        </YStack>
      </View>
    </Pressable>
  );
};

/**
 * ContentCard 主组件
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onPress,
  variant = 'default',
}) => {
  switch (variant) {
    case 'compact':
      return <CompactCard content={content} onPress={onPress} />;
    case 'large':
      return <LargeCard content={content} onPress={onPress} />;
    default:
      return <DefaultCard content={content} onPress={onPress} />;
  }
};

export default ContentCard;
