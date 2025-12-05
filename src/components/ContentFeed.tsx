/**
 * ContentFeed 内容流组件
 * 展示混合内容流，支持分页加载
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState, useEffect, useCallback } from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, ActivityIndicator } from 'react-native';
import { FileText, RefreshCw } from 'lucide-react-native';
import { ColumnContent, ContentType } from '@/types/column';
import { getFeedContents, getFeaturedContents } from '@/services/columnService';
import { ContentCard } from './ContentCard';

interface ContentFeedProps {
  columnId?: string;
  showFeaturedFirst?: boolean;
  onContentPress?: (content: ColumnContent) => void;
  headerComponent?: React.ReactNode;
  pageSize?: number;
}

type FilterType = 'all' | ContentType;

const FILTER_OPTIONS: { id: FilterType; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'article', label: '文章' },
  { id: 'video', label: '视频' },
  { id: 'recipe', label: '食谱' },
  { id: 'story', label: '故事' },
];

export const ContentFeed: React.FC<ContentFeedProps> = ({
  columnId,
  showFeaturedFirst = true,
  onContentPress,
  headerComponent,
  pageSize = 10,
}) => {
  const theme = useTheme();
  const [contents, setContents] = useState<ColumnContent[]>([]);
  const [featuredContents, setFeaturedContents] = useState<ColumnContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const primaryColor = theme.primary?.val;

  // 加载精选内容
  const loadFeaturedContents = useCallback(async () => {
    if (!showFeaturedFirst) return;
    try {
      const featured = await getFeaturedContents(3);
      setFeaturedContents(featured);
    } catch (error) {
      console.error('加载精选内容失败:', error);
    }
  }, [showFeaturedFirst]);

  // 加载内容列表
  const loadContents = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setContents([]);
      } else {
        setIsLoadingMore(true);
      }

      const offset = reset ? 0 : contents.length;
      const feedContents = await getFeedContents({
        columnId,
        limit: pageSize,
        offset,
      });

      if (feedContents.length < pageSize) {
        setHasMore(false);
      }

      if (reset) {
        setContents(feedContents);
      } else {
        setContents((prev) => [...prev, ...feedContents]);
      }
    } catch (error) {
      console.error('加载内容列表失败:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [columnId, pageSize, contents.length]);

  // 初始加载
  useEffect(() => {
    loadFeaturedContents();
    loadContents(true);
  }, [columnId]);

  // 筛选内容
  const filteredContents = contents.filter((content) => {
    if (activeFilter === 'all') return true;
    return content.type === activeFilter;
  });

  // 过滤掉已在精选中显示的内容
  const displayContents = showFeaturedFirst
    ? filteredContents.filter(
        (c) => !featuredContents.find((f) => f.id === c.id)
      )
    : filteredContents;

  // 加载更多
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadContents(false);
    }
  };

  // 刷新
  const handleRefresh = () => {
    setHasMore(true);
    loadFeaturedContents();
    loadContents(true);
  };

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$6">
        <ActivityIndicator size="large" color={primaryColor} />
        <Text fontSize="$3" color="$color10" marginTop="$2">
          加载中...
        </Text>
      </View>
    );
  }

  return (
    <YStack gap="$2">
      {/* 可选头部组件 */}
      {headerComponent}

      {/* 精选内容 */}
      {showFeaturedFirst && featuredContents.length > 0 && (
        <YStack gap="$2" paddingHorizontal="$2.5">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              精选推荐
            </Text>
            <Pressable onPress={handleRefresh}>
              <XStack gap="$1" alignItems="center">
                <RefreshCw size={14} color={primaryColor} />
                <Text fontSize="$3" color="$primary">
                  换一批
                </Text>
              </XStack>
            </Pressable>
          </XStack>
          {/* 第一个大卡片 */}
          {featuredContents[0] && (
            <ContentCard
              content={featuredContents[0]}
              variant="large"
              onPress={onContentPress}
            />
          )}
          {/* 其余默认卡片 */}
          {featuredContents.slice(1).map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              variant="default"
              onPress={onContentPress}
            />
          ))}
        </YStack>
      )}

      {/* 筛选标签 */}
      <View paddingHorizontal="$2.5">
        <XStack gap="$2">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
              >
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor={isActive ? '$primary' : '$color4'}
                >
                  <Text
                    fontSize="$3"
                    fontWeight="500"
                    color={isActive ? 'white' : '$color12'}
                  >
                    {filter.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </View>

      {/* 内容列表 */}
      <YStack gap="$2" paddingHorizontal="$2.5">
        {displayContents.length > 0 ? (
          <>
            {displayContents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                variant="default"
                onPress={onContentPress}
              />
            ))}

            {/* 加载更多按钮 */}
            {hasMore && (
              <Pressable onPress={handleLoadMore} disabled={isLoadingMore}>
                <View
                  paddingVertical="$2"
                  alignItems="center"
                  backgroundColor="$color4"
                  borderRadius="$4"
                >
                  {isLoadingMore ? (
                    <XStack gap="$2" alignItems="center">
                      <ActivityIndicator size="small" color={primaryColor} />
                      <Text fontSize="$3" color="$color10">
                        加载中...
                      </Text>
                    </XStack>
                  ) : (
                    <Text fontSize="$3" color="$primary" fontWeight="500">
                      加载更多
                    </Text>
                  )}
                </View>
              </Pressable>
            )}

            {/* 已加载全部 */}
            {!hasMore && (
              <View paddingVertical="$2" alignItems="center">
                <Text fontSize="$2" color="$color10">
                  已加载全部内容
                </Text>
              </View>
            )}
          </>
        ) : (
          <View paddingVertical="$6" alignItems="center">
            <FileText size={48} color={theme.color9?.val} />
            <Text fontSize="$4" color="$color10" marginTop="$2">
              暂无{activeFilter === 'all' ? '' : FILTER_OPTIONS.find((f) => f.id === activeFilter)?.label}内容
            </Text>
          </View>
        )}
      </YStack>
    </YStack>
  );
};

export default ContentFeed;
