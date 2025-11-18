import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, TextInput, RefreshControl, Image } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Search,
  Play,
  Clock,
  Eye,
  BookOpen,
  TrendingUp,
  Shield,
  CheckCircle,
  Star,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

// 视频分类
type VideoCategory = 'all' | 'basics' | 'product_review' | 'claim_practice';

interface Video {
  id: string;
  title: string;
  category: VideoCategory;
  description: string;
  instructor: string;
  duration: number; // 秒
  views: number;
  thumbnail: string;
  isCompleted: boolean;
  rating: number;
  tags: string[];
  publishDate: string;
}

const InsuranceVideoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 视频分类配置
  const categories = [
    { id: 'all', label: '全部', icon: Play, color: COLORS.text },
    { id: 'basics', label: '保险基础', icon: BookOpen, color: '#3B82F6' },
    { id: 'product_review', label: '产品测评', icon: TrendingUp, color: '#10B981' },
    { id: 'claim_practice', label: '理赔实战', icon: Shield, color: '#8B5CF6' },
  ];

  useEffect(() => {
    loadVideos();
  }, [selectedCategory, searchQuery]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock数据
      const mockVideos: Video[] = [
        {
          id: 'video_001',
          title: '保险小白入门必看：5分钟读懂保险条款',
          category: 'basics',
          description: '用最简单的语言，帮你理解保险条款中的关键术语，避免投保时的常见误区。',
          instructor: '张老师',
          duration: 320, // 5分20秒
          views: 45623,
          thumbnail: 'https://via.placeholder.com/300x200?text=保险条款',
          isCompleted: false,
          rating: 4.8,
          tags: ['保险条款', '新手入门', '必看'],
          publishDate: '2024-01-15',
        },
        {
          id: 'video_002',
          title: '百万医疗险深度测评：平安vs众安vs好医保',
          category: 'product_review',
          description: '三款热销百万医疗险的全方位对比，从保障内容、免赔额、增值服务到价格，帮你选出最适合的产品。',
          instructor: '李老师',
          duration: 1260, // 21分钟
          views: 78345,
          thumbnail: 'https://via.placeholder.com/300x200?text=百万医疗',
          isCompleted: true,
          rating: 4.9,
          tags: ['医疗险', '产品对比', '测评'],
          publishDate: '2024-01-12',
        },
        {
          id: 'video_003',
          title: '理赔实战案例：重疾险理赔全流程演示',
          category: 'claim_practice',
          description: '真实案例还原重疾险理赔流程，从诊断报告到理赔到账，每一步都有详细讲解。',
          instructor: '王老师',
          duration: 1545, // 25分45秒
          views: 52134,
          thumbnail: 'https://via.placeholder.com/300x200?text=理赔流程',
          isCompleted: false,
          rating: 4.7,
          tags: ['理赔', '重疾险', '实战'],
          publishDate: '2024-01-10',
        },
        {
          id: 'video_004',
          title: '年金险真的能养老吗？收益率全面解析',
          category: 'product_review',
          description: '通过实际计算，揭示年金险的真实收益率，帮你判断是否适合作为养老规划工具。',
          instructor: '赵老师',
          duration: 950, // 15分50秒
          views: 36789,
          thumbnail: 'https://via.placeholder.com/300x200?text=年金险',
          isCompleted: false,
          rating: 4.6,
          tags: ['年金险', '养老规划', '收益分析'],
          publishDate: '2024-01-08',
        },
        {
          id: 'video_005',
          title: '健康告知怎么填？这些细节千万注意',
          category: 'basics',
          description: '健康告知是理赔成功的关键，本视频详解如何正确填写健康告知，避免理赔纠纷。',
          instructor: '刘老师',
          duration: 680, // 11分20秒
          views: 41256,
          thumbnail: 'https://via.placeholder.com/300x200?text=健康告知',
          isCompleted: false,
          rating: 4.8,
          tags: ['健康告知', '投保须知', '避坑'],
          publishDate: '2024-01-05',
        },
        {
          id: 'video_006',
          title: '医疗险理赔被拒？这5种情况要注意',
          category: 'claim_practice',
          description: '总结医疗险理赔被拒的常见原因，教你如何避免这些坑，提高理赔成功率。',
          instructor: '陈老师',
          duration: 845, // 14分5秒
          views: 29876,
          thumbnail: 'https://via.placeholder.com/300x200?text=理赔避坑',
          isCompleted: true,
          rating: 4.7,
          tags: ['医疗险', '理赔', '避坑指南'],
          publishDate: '2024-01-03',
        },
      ];

      // 筛选逻辑
      let filtered = mockVideos;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(video => video.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        filtered = filtered.filter(video =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags.some(tag => tag.includes(searchQuery))
        );
      }

      setVideos(filtered);
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const handleVideoPress = (video: Video) => {
    console.log('播放视频:', video.title);
    // navigation.navigate('InsuranceVideoPlayer' as never, { videoId: video.id } as never);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVideoCard = (video: Video) => {
    const categoryConfig = categories.find(c => c.id === video.category);

    return (
      <Pressable key={video.id} onPress={() => handleVideoPress(video)}>
        <View
          marginBottom="$3"
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
        >
          {/* 缩略图 */}
          <View position="relative">
            <View width="100%" height={200} backgroundColor="$borderColor">
              {/* 这里应该使用Image组件加载thumbnail */}
              <View
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                backgroundColor="#E5E7EB"
              >
                <Text fontSize="$4" color="$textSecondary">
                  视频缩略图
                </Text>
              </View>
            </View>

            {/* 播放按钮覆盖层 */}
            <View
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0,0,0,0.3)"
            >
              <View
                width={60}
                height={60}
                borderRadius={30}
                backgroundColor="white"
                justifyContent="center"
                alignItems="center"
              >
                <Play size={32} color={COLORS.primary} fill={COLORS.primary} />
              </View>
            </View>

            {/* 时长标签 */}
            <View
              position="absolute"
              bottom={8}
              right={8}
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="rgba(0,0,0,0.7)"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="white" fontWeight="600">
                {formatDuration(video.duration)}
              </Text>
            </View>

            {/* 已完成标记 */}
            {video.isCompleted && (
              <View
                position="absolute"
                top={8}
                right={8}
                paddingHorizontal="$2"
                paddingVertical="$1"
                backgroundColor={COLORS.success}
                borderRadius="$2"
              >
                <XStack alignItems="center" gap="$1">
                  <CheckCircle size={14} color="white" />
                  <Text fontSize="$1" color="white" fontWeight="600">
                    已学习
                  </Text>
                </XStack>
              </View>
            )}
          </View>

          {/* 视频信息 */}
          <View padding="$4">
            {/* 分类标签 */}
            <View
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor={`${categoryConfig?.color || COLORS.text}20`}
              borderRadius="$2"
              alignSelf="flex-start"
              marginBottom="$2"
            >
              <Text fontSize="$1" fontWeight="600" color={categoryConfig?.color || COLORS.text}>
                {categoryConfig?.label}
              </Text>
            </View>

            {/* 标题 */}
            <Text fontSize="$4" fontWeight="700" color="$text" marginBottom="$2" lineHeight={22}>
              {video.title}
            </Text>

            {/* 描述 */}
            <Text fontSize="$2" color="$textSecondary" lineHeight={20} marginBottom="$3">
              {video.description}
            </Text>

            {/* 讲师和评分 */}
            <XStack alignItems="center" gap="$3" marginBottom="$2">
              <Text fontSize="$2" color="$text" fontWeight="600">
                {video.instructor}
              </Text>
              <XStack alignItems="center" gap="$1">
                <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                <Text fontSize="$2" color="$text" fontWeight="600">
                  {video.rating}
                </Text>
              </XStack>
            </XStack>

            {/* 标签 */}
            <XStack gap="$2" marginBottom="$3" flexWrap="wrap">
              {video.tags.map(tag => (
                <View
                  key={tag}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor="$borderColor"
                  borderRadius="$2"
                >
                  <Text fontSize="$1" color="$textSecondary">
                    #{tag}
                  </Text>
                </View>
              ))}
            </XStack>

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap="$1">
                <Eye size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {video.views.toLocaleString()} 次观看
                </Text>
              </XStack>
              <Text fontSize="$2" color="$textSecondary">
                {video.publishDate}
              </Text>
            </XStack>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          视频课堂
        </Text>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 搜索框 */}
        <View padding="$4" paddingBottom="$2">
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
            height={44}
          >
            <XStack alignItems="center" gap="$2" height="100%">
              <Search size={20} color={COLORS.textSecondary} />
              <TextInput
                placeholder="搜索视频标题、讲师或标签"
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.text,
                  padding: 0,
                }}
              />
            </XStack>
          </View>
        </View>

        {/* 分类标签 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <XStack paddingHorizontal="$4" gap="$2">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Pressable key={category.id} onPress={() => setSelectedCategory(category.id as VideoCategory)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    backgroundColor={isSelected ? category.color : '$surface'}
                    borderWidth={1}
                    borderColor={isSelected ? category.color : '$borderColor'}
                  >
                    <XStack alignItems="center" gap="$2">
                      <Icon size={16} color={isSelected ? 'white' : category.color} />
                      <Text
                        fontSize="$3"
                        fontWeight="600"
                        color={isSelected ? 'white' : category.color}
                      >
                        {category.label}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>

        {/* 视频列表 */}
        <View paddingHorizontal="$4">
          {loading && videos.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                加载中...
              </Text>
            </View>
          ) : videos.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Play size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
                暂无视频
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                {searchQuery ? '试试其他搜索词' : '请选择其他分类'}
              </Text>
            </View>
          ) : (
            <>{videos.map(video => renderVideoCard(video))}</>
          )}
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsuranceVideoScreen;
