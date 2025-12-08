/**
 * ColumnListScreen 栏目详情页
 * 展示栏目信息和内容列表
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
import { Eye, FileText, Play, Clock, Heart, ArrowLeft } from 'lucide-react-native';
import { getColumnById, getColumnContents } from '@/services/columnService';
import { Column, ColumnContent, ContentType } from '@/types/column';

type ColumnListRouteParams = {
  ColumnList: {
    columnId: string;
  };
};

type TabId = 'latest' | 'featured' | 'series';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ColumnListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ColumnListRouteParams, 'ColumnList'>>();
  const theme = useTheme();

  const [column, setColumn] = useState<Column | null>(null);
  const [contents, setContents] = useState<ColumnContent[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('latest');
  const [isLoading, setIsLoading] = useState(true);

  // primaryColor available for future use if needed

  // 加载栏目数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const columnId = route.params?.columnId;
        if (!columnId) return;

        const columnData = await getColumnById(columnId);
        setColumn(columnData);

        const contentList = await getColumnContents(columnId, {
          featured: activeTab === 'featured',
        });
        setContents(contentList);
      } catch (error) {
        console.error('加载栏目数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [route.params?.columnId, activeTab]);

  // Tab 配置
  const tabs: { id: TabId; name: string }[] = [
    { id: 'latest', name: '最新' },
    { id: 'featured', name: '精选' },
    { id: 'series', name: '系列' },
  ];

  // 格式化数字
  const formatCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  // 获取内容类型图标
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video':
        return <Play size={12} color="white" fill="white" />;
      case 'recipe':
        return <Clock size={12} color="white" />;
      default:
        return null;
    }
  };

  // 获取内容类型标签
  const getContentTypeLabel = (content: ColumnContent) => {
    switch (content.type) {
      case 'video':
        return content.duration || '视频';
      case 'recipe':
        return `${content.cookingTime}分钟`;
      default:
        return content.readTime || '文章';
    }
  };

  if (isLoading || !column) {
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
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 栏目头部 */}
        <View position="relative">
          {/* 封面图 */}
          <Image
            source={{ uri: column.coverImage }}
            width={SCREEN_WIDTH}
            height={180}
            resizeMode="cover"
          />
          {/* 渐变遮罩 */}
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />
          {/* 返回按钮 */}
          <View position="absolute" top={12} left={16}>
            <Pressable onPress={() => navigation.goBack()}>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="rgba(0,0,0,0.3)"
                justifyContent="center"
                alignItems="center"
              >
                <ArrowLeft size={20} color="white" />
              </View>
            </Pressable>
          </View>
          {/* 栏目信息 */}
          <View position="absolute" bottom={16} left={16} right={16}>
            <Text fontSize="$6" fontWeight="700" color="white" marginBottom="$1">
              {column.name}
            </Text>
            <Text fontSize="$3" color="rgba(255,255,255,0.9)">
              {column.description}
            </Text>
          </View>
        </View>

        {/* Tab 切换 */}
        <View paddingHorizontal="$2.5" paddingVertical="$2" backgroundColor="$color2">
          <XStack gap="$2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}>
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
                      {tab.name}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </View>

        {/* 内容列表 */}
        <YStack paddingHorizontal="$2.5" paddingVertical="$2" gap="$2">
          {contents.length > 0 ? (
            contents.map((content) => (
              <Pressable
                key={content.id}
                onPress={() => {
                  (navigation as any).navigate('ContentDetail', {
                    contentId: content.id,
                  });
                }}
              >
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
                      {content.type !== 'article' && (
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
                      )}
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
                          <Text
                            fontSize="$2"
                            color="$color10"
                            numberOfLines={1}
                          >
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
            ))
          ) : (
            <View paddingVertical="$6" alignItems="center">
              <FileText size={48} color={theme.color9?.val} />
              <Text fontSize="$4" color="$color10" marginTop="$2">
                暂无内容
              </Text>
            </View>
          )}
        </YStack>

        {/* 底部安全区域 */}
        <View height="$4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ColumnListScreen;
