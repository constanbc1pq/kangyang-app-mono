import React, { useState, useEffect, useRef } from 'react';
import { Pressable, FlatList, Alert, StatusBar } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronRight,
  PlayCircle,
  Bookmark,
  User,
  Eye,
  Heart,
  CheckCircle,
  X,
  Video,
  PauseCircle,
  Play,
  GraduationCap,
  FileText,
  ShieldCheck,
  Users,
  Home,
  File,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleBar } from '@/components/TitleBar';

/**
 * Phase 36.1: 视频课堂 - Legal Video Classroom Screen
 *
 * Features:
 * - Video list with category display
 * - Video player page
 * - Course catalog (how to make valid wills, fraud prevention, etc.)
 * - Learning progress tracking
 * - Course bookmarking functionality
 */

const GOLD_COLOR = '#D4AF37';

// ==================== Type Definitions ====================

type ScreenStep = 'categories' | 'videoList' | 'videoPlayer';

interface VideoCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  videoCount: number;
  description: string;
}

interface LegalVideo {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  duration: number;
  instructor: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views: number;
  likes: number;
  thumbnail: string;
  videoUrl: string;
  chapters: VideoChapter[];
  relatedVideos: string[];
}

interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
}

interface VideoProgress {
  videoId: string;
  watchedSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

interface VideoBookmark {
  videoId: string;
  bookmarkedAt: string;
}

// ==================== Helper Functions ====================

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views: number): string => {
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}万`;
  }
  return views.toString();
};

// ==================== Icon Component ====================

const CategoryIcon: React.FC<{ icon: string; color: string; size: number }> = ({ icon, color, size }) => {
  const icons: Record<string, React.ReactNode> = {
    'document-text': <FileText size={size} color={color} />,
    'shield-checkmark': <ShieldCheck size={size} color={color} />,
    'people': <Users size={size} color={color} />,
    'home': <Home size={size} color={color} />,
    'heart': <Heart size={size} color={color} />,
    'document': <File size={size} color={color} />,
  };
  return <>{icons[icon] || <FileText size={size} color={color} />}</>;
};

// ==================== Main Component ====================

const LegalVideoScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color9 = theme.color9?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState<ScreenStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<LegalVideo | null>(null);
  const [videoList, setVideoList] = useState<LegalVideo[]>([]);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // User data state
  const [videoProgress, setVideoProgress] = useState<Map<string, VideoProgress>>(new Map());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock Data with theme colors
  const VIDEO_CATEGORIES: VideoCategory[] = [
    {
      id: 'will',
      name: '遗嘱制作',
      icon: 'document-text',
      color: primaryColor || '#6366F1',
      videoCount: 12,
      description: '学习如何订立有效的遗嘱，避免法律纠纷',
    },
    {
      id: 'fraud_prevention',
      name: '防范诈骗',
      icon: 'shield-checkmark',
      color: successColor || '#10B981',
      videoCount: 18,
      description: '识别常见养老诈骗手段，保护财产安全',
    },
    {
      id: 'inheritance',
      name: '继承法律',
      icon: 'people',
      color: GOLD_COLOR,
      videoCount: 10,
      description: '了解遗产继承规则，维护合法权益',
    },
    {
      id: 'property_rights',
      name: '财产权益',
      icon: 'home',
      color: primaryColor || '#6366F1',
      videoCount: 15,
      description: '保护房产、存款等财产权益',
    },
    {
      id: 'family_support',
      name: '赡养义务',
      icon: 'heart',
      color: GOLD_COLOR,
      videoCount: 8,
      description: '了解子女赡养义务，维护赡养权益',
    },
    {
      id: 'contract_law',
      name: '合同常识',
      icon: 'document',
      color: primaryColor || '#6366F1',
      videoCount: 14,
      description: '学习合同签订注意事项，避免陷阱',
    },
  ];

  const LEGAL_VIDEOS: LegalVideo[] = [
    // Will Making Videos
    {
      id: 'video_will_001',
      categoryId: 'will',
      title: '如何订立一份有效的遗嘱',
      description: '详细讲解遗嘱的法定形式要求、见证人规则、签字按手印注意事项等核心内容，帮助您订立合法有效的遗嘱。',
      duration: 1800,
      instructor: '张明律师',
      difficulty: 'beginner',
      views: 15234,
      likes: 1289,
      thumbnail: 'will_basic',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '遗嘱的法定形式', startTime: 0 },
        { id: 'c2', title: '见证人的要求', startTime: 420 },
        { id: 'c3', title: '签字与按手印', startTime: 900 },
        { id: 'c4', title: '遗嘱的保管', startTime: 1320 },
      ],
      relatedVideos: ['video_will_002', 'video_will_003'],
    },
    {
      id: 'video_will_002',
      categoryId: 'will',
      title: '遗嘱公证全流程指南',
      description: '从准备材料、预约公证、公证流程到领取公证书，全程详解遗嘱公证的每个步骤。',
      duration: 1500,
      instructor: '王芳公证员',
      difficulty: 'intermediate',
      views: 9876,
      likes: 876,
      thumbnail: 'will_notarization',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '公证前的准备', startTime: 0 },
        { id: 'c2', title: '预约与提交材料', startTime: 360 },
        { id: 'c3', title: '公证员询问环节', startTime: 720 },
        { id: 'c4', title: '领取公证书', startTime: 1200 },
      ],
      relatedVideos: ['video_will_001', 'video_will_004'],
    },
    {
      id: 'video_will_003',
      categoryId: 'will',
      title: '遗嘱修改与撤销',
      description: '学习如何合法地修改或撤销已订立的遗嘱，避免多份遗嘱冲突。',
      duration: 1200,
      instructor: '李强律师',
      difficulty: 'intermediate',
      views: 7654,
      likes: 654,
      thumbnail: 'will_revise',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '遗嘱的法定撤销', startTime: 0 },
        { id: 'c2', title: '订立新遗嘱的注意事项', startTime: 480 },
        { id: 'c3', title: '多份遗嘱的效力判断', startTime: 840 },
      ],
      relatedVideos: ['video_will_001', 'video_will_002'],
    },
    // Fraud Prevention Videos
    {
      id: 'video_fraud_001',
      categoryId: 'fraud_prevention',
      title: '识破养老理财骗局',
      description: '揭露常见的养老理财诈骗手段：高息诱惑、养老基地投资、虚假金融产品等，教您如何识破骗局。',
      duration: 2100,
      instructor: '刘警官',
      difficulty: 'beginner',
      views: 23456,
      likes: 2145,
      thumbnail: 'fraud_financial',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '高息理财的陷阱', startTime: 0 },
        { id: 'c2', title: '养老基地投资骗局', startTime: 600 },
        { id: 'c3', title: '虚假金融产品识别', startTime: 1200 },
        { id: 'c4', title: '如何保护自己', startTime: 1680 },
      ],
      relatedVideos: ['video_fraud_002', 'video_fraud_003'],
    },
    {
      id: 'video_fraud_002',
      categoryId: 'fraud_prevention',
      title: '保健品诈骗全揭秘',
      description: '分析保健品诈骗的常见套路：免费体检、专家讲座、夸大疗效等，帮您避免上当受骗。',
      duration: 1920,
      instructor: '陈医生',
      difficulty: 'beginner',
      views: 18765,
      likes: 1654,
      thumbnail: 'fraud_health',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '免费体检的套路', startTime: 0 },
        { id: 'c2', title: '专家讲座的陷阱', startTime: 540 },
        { id: 'c3', title: '夸大疗效的识别', startTime: 1080 },
        { id: 'c4', title: '正规保健品的购买渠道', startTime: 1500 },
      ],
      relatedVideos: ['video_fraud_001', 'video_fraud_004'],
    },
    // Inheritance Videos
    {
      id: 'video_inherit_001',
      categoryId: 'inheritance',
      title: '法定继承顺序详解',
      description: '详细讲解第一顺序继承人、第二顺序继承人的范围及继承份额计算方法。',
      duration: 1560,
      instructor: '郑律师',
      difficulty: 'beginner',
      views: 14567,
      likes: 1234,
      thumbnail: 'inherit_order',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '第一顺序继承人', startTime: 0 },
        { id: 'c2', title: '第二顺序继承人', startTime: 480 },
        { id: 'c3', title: '继承份额的计算', startTime: 960 },
        { id: 'c4', title: '特殊情况的处理', startTime: 1260 },
      ],
      relatedVideos: ['video_inherit_002', 'video_inherit_003'],
    },
    // Property Videos
    {
      id: 'video_property_001',
      categoryId: 'property_rights',
      title: '房产证加名与减名',
      description: '详解房产证加减名字的法律后果、税费计算、办理流程等关键问题。',
      duration: 1620,
      instructor: '吴律师',
      difficulty: 'intermediate',
      views: 16789,
      likes: 1456,
      thumbnail: 'property_name',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '加名的法律后果', startTime: 0 },
        { id: 'c2', title: '减名的注意事项', startTime: 540 },
        { id: 'c3', title: '税费的计算', startTime: 1080 },
        { id: 'c4', title: '办理流程', startTime: 1380 },
      ],
      relatedVideos: ['video_property_002', 'video_property_003'],
    },
    // Family Support Videos
    {
      id: 'video_support_001',
      categoryId: 'family_support',
      title: '子女赡养义务法律规定',
      description: '详细讲解子女赡养父母的法定义务内容、赡养费标准及不履行的法律后果。',
      duration: 1680,
      instructor: '张律师',
      difficulty: 'beginner',
      views: 19876,
      likes: 1765,
      thumbnail: 'support_obligation',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '赡养义务的法律依据', startTime: 0 },
        { id: 'c2', title: '赡养费的计算标准', startTime: 540 },
        { id: 'c3', title: '精神赡养的要求', startTime: 1080 },
        { id: 'c4', title: '不履行赡养义务的后果', startTime: 1380 },
      ],
      relatedVideos: ['video_support_002', 'video_support_003'],
    },
    // Contract Videos
    {
      id: 'video_contract_001',
      categoryId: 'contract_law',
      title: '养老服务合同签订指南',
      description: '详细讲解养老院入住合同、护理服务合同的关键条款及注意事项。',
      duration: 1740,
      instructor: '陈律师',
      difficulty: 'beginner',
      views: 15678,
      likes: 1345,
      thumbnail: 'contract_eldercare',
      videoUrl: 'mock_url',
      chapters: [
        { id: 'c1', title: '入住合同的必备条款', startTime: 0 },
        { id: 'c2', title: '服务标准的约定', startTime: 540 },
        { id: 'c3', title: '费用调整条款', startTime: 1080 },
        { id: 'c4', title: '退费与解约条款', startTime: 1440 },
      ],
      relatedVideos: ['video_contract_002', 'video_fraud_004'],
    },
  ];

  const getDifficultyLabel = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '进阶';
      case 'advanced': return '高级';
    }
  };

  const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
    switch (difficulty) {
      case 'beginner': return successColor || '#10B981';
      case 'intermediate': return primaryColor || '#6366F1';
      case 'advanced': return GOLD_COLOR;
    }
  };

  // ==================== Data Loading ====================

  useEffect(() => {
    loadUserData();
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  const loadUserData = async () => {
    try {
      const progressData = await AsyncStorage.getItem('video_progress');
      if (progressData) {
        const progressArray: VideoProgress[] = JSON.parse(progressData);
        const progressMap = new Map<string, VideoProgress>();
        progressArray.forEach(p => progressMap.set(p.videoId, p));
        setVideoProgress(progressMap);
      }

      const bookmarkData = await AsyncStorage.getItem('video_bookmarks');
      if (bookmarkData) {
        const bookmarkArray: VideoBookmark[] = JSON.parse(bookmarkData);
        const bookmarkSet = new Set<string>(bookmarkArray.map(b => b.videoId));
        setBookmarks(bookmarkSet);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveVideoProgress = async (videoId: string, watchedSeconds: number, completed: boolean) => {
    const progress: VideoProgress = {
      videoId,
      watchedSeconds,
      completed,
      lastWatchedAt: new Date().toISOString(),
    };

    const newProgressMap = new Map(videoProgress);
    newProgressMap.set(videoId, progress);
    setVideoProgress(newProgressMap);

    try {
      const progressArray = Array.from(newProgressMap.values());
      await AsyncStorage.setItem('video_progress', JSON.stringify(progressArray));
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  };

  const toggleBookmark = async (videoId: string) => {
    const newBookmarks = new Set(bookmarks);

    if (newBookmarks.has(videoId)) {
      newBookmarks.delete(videoId);
      Alert.alert('提示', '已取消收藏');
    } else {
      newBookmarks.add(videoId);
      Alert.alert('提示', '收藏成功');
    }

    setBookmarks(newBookmarks);

    try {
      const bookmarkArray: VideoBookmark[] = Array.from(newBookmarks).map(id => ({
        videoId: id,
        bookmarkedAt: new Date().toISOString(),
      }));
      await AsyncStorage.setItem('video_bookmarks', JSON.stringify(bookmarkArray));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  // ==================== Navigation Handlers ====================

  const handleCategoryPress = (category: VideoCategory) => {
    setSelectedCategory(category);
    const filteredVideos = LEGAL_VIDEOS.filter(v => v.categoryId === category.id);
    setVideoList(filteredVideos);
    setCurrentStep('videoList');
  };

  const handleVideoPress = (video: LegalVideo) => {
    setSelectedVideo(video);
    const progress = videoProgress.get(video.id);
    if (progress) {
      setCurrentTime(progress.watchedSeconds);
    } else {
      setCurrentTime(0);
    }
    setIsPlaying(false);
    setCurrentStep('videoPlayer');
  };

  const handleBackPress = () => {
    if (currentStep === 'videoPlayer') {
      if (selectedVideo) {
        const completed = currentTime >= (selectedVideo.duration * 0.9);
        saveVideoProgress(selectedVideo.id, currentTime, completed);
      }
      setCurrentStep('videoList');
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    } else if (currentStep === 'videoList') {
      setCurrentStep('categories');
      setSelectedCategory(null);
      setVideoList([]);
    } else {
      navigation.goBack();
    }
  };

  // ==================== Video Player Controls ====================

  const handlePlayPause = () => {
    if (!selectedVideo) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      const completed = currentTime >= (selectedVideo.duration * 0.9);
      saveVideoProgress(selectedVideo.id, currentTime, completed);
    } else {
      setIsPlaying(true);
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= selectedVideo.duration) {
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
            }
            saveVideoProgress(selectedVideo.id, selectedVideo.duration, true);
            return selectedVideo.duration;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const handleChapterPress = (chapter: VideoChapter) => {
    setCurrentTime(chapter.startTime);
    if (!isPlaying) {
      handlePlayPause();
    }
  };

  const handleRelatedVideoPress = (videoId: string) => {
    const video = LEGAL_VIDEOS.find(v => v.id === videoId);
    if (video) {
      if (selectedVideo) {
        const completed = currentTime >= (selectedVideo.duration * 0.9);
        saveVideoProgress(selectedVideo.id, currentTime, completed);
      }
      handleVideoPress(video);
    }
  };

  // ==================== Render Methods ====================

  const renderCategoryCard = (category: VideoCategory) => (
    <Pressable key={category.id} onPress={() => handleCategoryPress(category)}>
      <XStack
        backgroundColor="$color2"
        marginHorizontal="$2.5"
        marginBottom="$2"
        padding="$2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        alignItems="center"
      >
        <View
          width={56}
          height={56}
          borderRadius={28}
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <CategoryIcon icon={category.icon} color={category.color} size={32} />
        </View>
        <YStack flex={1} marginLeft="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
            {category.name}
          </Text>
          <Text fontSize="$2" color="$color10" marginBottom="$1">
            {category.description}
          </Text>
          <XStack alignItems="center">
            <PlayCircle size={14} color={color10} />
            <Text fontSize="$2" color="$color10" marginLeft="$1">
              {category.videoCount} 个课程
            </Text>
          </XStack>
        </YStack>
        <ChevronRight size={20} color={color9} />
      </XStack>
    </Pressable>
  );

  const renderVideoCard = (video: LegalVideo) => {
    const progress = videoProgress.get(video.id);
    const isBookmarked = bookmarks.has(video.id);
    const progressPercentage = progress ? (progress.watchedSeconds / video.duration) * 100 : 0;

    return (
      <Pressable key={video.id} onPress={() => handleVideoPress(video)}>
        <View backgroundColor="$color2" borderRadius="$4" marginBottom="$2.5" overflow="hidden" borderWidth={1} borderColor="$color5">
          {/* Thumbnail */}
          <View width="100%" height={180} backgroundColor="black" alignItems="center" justifyContent="center">
            <PlayCircle size={48} color="white" />
            {/* Duration Badge */}
            <View
              position="absolute"
              bottom={8}
              right={8}
              backgroundColor="rgba(0,0,0,0.7)"
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
            >
              <Text fontSize={12} color="white" fontWeight="500">{formatDuration(video.duration)}</Text>
            </View>
            {/* Bookmark Badge */}
            {isBookmarked && (
              <View
                position="absolute"
                top={8}
                right={8}
                width={32}
                height={32}
                borderRadius={16}
                alignItems="center"
                justifyContent="center"
                style={{ backgroundColor: primaryColor }}
              >
                <Bookmark size={16} color="white" fill="white" />
              </View>
            )}
            {/* Progress Bar */}
            {progress && progressPercentage > 0 && (
              <View position="absolute" bottom={0} left={0} right={0} height={3} backgroundColor="rgba(255,255,255,0.3)">
                <View height="100%" backgroundColor="$primary" style={{ width: `${progressPercentage}%` }} />
              </View>
            )}
          </View>
          {/* Info */}
          <YStack padding="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5" numberOfLines={2}>
              {video.title}
            </Text>
            <Text fontSize="$3" color="$color10" marginBottom="$2" lineHeight={20} numberOfLines={2}>
              {video.description}
            </Text>
            <XStack alignItems="center" flexWrap="wrap" gap="$2">
              <View
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$2"
                style={{ backgroundColor: `${getDifficultyColor(video.difficulty)}20` }}
              >
                <Text fontSize={11} fontWeight="500" style={{ color: getDifficultyColor(video.difficulty) }}>
                  {getDifficultyLabel(video.difficulty)}
                </Text>
              </View>
              <XStack alignItems="center">
                <User size={12} color={color9} />
                <Text fontSize="$2" color="$color9" marginLeft="$0.5">{video.instructor}</Text>
              </XStack>
              <XStack alignItems="center">
                <Eye size={12} color={color9} />
                <Text fontSize="$2" color="$color9" marginLeft="$0.5">{formatViews(video.views)}</Text>
              </XStack>
              <XStack alignItems="center">
                <Heart size={12} color={color9} />
                <Text fontSize="$2" color="$color9" marginLeft="$0.5">{video.likes}</Text>
              </XStack>
            </XStack>
            {progress && progress.completed && (
              <XStack alignItems="center" marginTop="$1.5">
                <CheckCircle size={14} color={successColor} />
                <Text fontSize="$2" color="$success" marginLeft="$0.5" fontWeight="500">已完成</Text>
              </XStack>
            )}
          </YStack>
        </View>
      </Pressable>
    );
  };

  // ==================== Screen Views ====================

  const renderCategoriesView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TitleBar title="法律视频课堂" onBack={handleBackPress} />

      {/* Content */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View backgroundColor="$color2" margin="$2.5" borderRadius="$4" padding="$4" alignItems="center">
          <GraduationCap size={40} color={primaryColor} />
          <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$2">
            学习法律知识，保护自身权益
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$1">
            专业律师授课，案例丰富生动
          </Text>
        </View>

        {/* Categories */}
        <YStack marginBottom="$4">
          <YStack paddingHorizontal="$2.5" marginBottom="$2">
            <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$1">课程分类</Text>
            <Text fontSize="$3" color="$color9">选择您感兴趣的主题开始学习</Text>
          </YStack>
          {VIDEO_CATEGORIES.map(category => renderCategoryCard(category))}
        </YStack>

        {/* My Learning */}
        {videoProgress.size > 0 && (
          <YStack marginBottom="$4" paddingHorizontal="$2.5">
            <YStack marginBottom="$2">
              <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$1">继续学习</Text>
              <Text fontSize="$3" color="$color9">从上次观看的地方继续</Text>
            </YStack>
            {Array.from(videoProgress.values())
              .filter(p => !p.completed)
              .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())
              .slice(0, 3)
              .map(progress => {
                const video = LEGAL_VIDEOS.find(v => v.id === progress.videoId);
                return video ? renderVideoCard(video) : null;
              })}
          </YStack>
        )}

        {/* Bookmarks */}
        {bookmarks.size > 0 && (
          <YStack marginBottom="$4" paddingHorizontal="$2.5">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize="$5" fontWeight="600" color="$color12">我的收藏</Text>
              <Text fontSize="$3" color="$color9">{bookmarks.size} 个收藏课程</Text>
            </XStack>
            {Array.from(bookmarks)
              .slice(0, 3)
              .map(bookmarkId => {
                const video = LEGAL_VIDEOS.find(v => v.id === bookmarkId);
                return video ? renderVideoCard(video) : null;
              })}
          </YStack>
        )}

        <View height={30} />
      </ScrollView>
    </View>
  );

  const renderVideoListView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TitleBar title={selectedCategory?.name || ''} onBack={handleBackPress} />

      {/* Category Info */}
      {selectedCategory && (
        <XStack
          alignItems="center"
          padding="$2"
          marginHorizontal="$2.5"
          marginTop="$2"
          marginBottom="$1"
          borderRadius="$4"
          style={{ backgroundColor: `${selectedCategory.color}10` }}
        >
          <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size={28} />
          <YStack flex={1} marginLeft="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$0.5">
              {selectedCategory.name}
            </Text>
            <Text fontSize="$2" color="$color10">
              {selectedCategory.description}
            </Text>
          </YStack>
        </XStack>
      )}

      {/* Video List */}
      <FlatList
        data={videoList}
        renderItem={({ item }) => renderVideoCard(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 8, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderVideoPlayerView = () => {
    if (!selectedVideo) return null;

    const isBookmarked = bookmarks.has(selectedVideo.id);
    const progressPercentage = (currentTime / selectedVideo.duration) * 100;
    const relatedVideos = LEGAL_VIDEOS.filter(v => selectedVideo.relatedVideos.includes(v.id));

    return (
      <View flex={1} backgroundColor="$background">
        <StatusBar barStyle="light-content" />

        {/* Video Player */}
        <View backgroundColor="black" height={300} position="relative">
          <Pressable
            style={{ position: 'absolute', top: insets.top + 8, right: 16, zIndex: 10 }}
            onPress={handleBackPress}
          >
            <View
              width={40}
              height={40}
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              backgroundColor="rgba(0,0,0,0.5)"
            >
              <X size={28} color="white" />
            </View>
          </Pressable>

          <View flex={1} alignItems="center" justifyContent="center" backgroundColor="#1a1a1a">
            <Video size={80} color="white" />
            <Text color="white" fontSize="$4" marginTop="$2">视频播放器</Text>
          </View>

          <Pressable
            style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -36, marginLeft: -36 }}
            onPress={handlePlayPause}
          >
            {isPlaying ? (
              <PauseCircle size={72} color="white" />
            ) : (
              <PlayCircle size={72} color="white" />
            )}
          </Pressable>

          {/* Progress Bar */}
          <XStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            paddingHorizontal="$2.5"
            paddingVertical="$2"
            backgroundColor="rgba(0,0,0,0.7)"
            alignItems="center"
          >
            <Text color="white" fontSize="$2" fontWeight="500">{formatDuration(currentTime)}</Text>
            <View flex={1} marginHorizontal="$2" position="relative">
              <View height={3} backgroundColor="rgba(255,255,255,0.3)" borderRadius={1.5}>
                <View height="100%" borderRadius={1.5} backgroundColor="$primary" style={{ width: `${progressPercentage}%` }} />
              </View>
              <View
                position="absolute"
                top={-5}
                width={13}
                height={13}
                borderRadius={6.5}
                backgroundColor="white"
                style={{ left: `${progressPercentage}%`, marginLeft: -6.5 }}
              />
            </View>
            <Text color="white" fontSize="$2" fontWeight="500">{formatDuration(selectedVideo.duration)}</Text>
          </XStack>
        </View>

        {/* Video Info and Chapters */}
        <ScrollView flex={1} backgroundColor="$color2" showsVerticalScrollIndicator={false}>
          {/* Title and Actions */}
          <XStack alignItems="flex-start" justifyContent="space-between" paddingHorizontal="$2.5" paddingTop="$2.5" paddingBottom="$2">
            <Text flex={1} fontSize="$5" fontWeight="600" color="$color12" lineHeight={26}>
              {selectedVideo.title}
            </Text>
            <Pressable onPress={() => toggleBookmark(selectedVideo.id)} style={{ padding: 4, marginLeft: 12 }}>
              <Bookmark
                size={24}
                color={isBookmarked ? primaryColor : color10}
                fill={isBookmarked ? primaryColor : 'transparent'}
              />
            </Pressable>
          </XStack>

          {/* Meta Info */}
          <XStack
            alignItems="center"
            flexWrap="wrap"
            paddingHorizontal="$2.5"
            paddingBottom="$2.5"
            borderBottomWidth={1}
            borderBottomColor="$color5"
            gap="$2.5"
          >
            <XStack alignItems="center">
              <User size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1">{selectedVideo.instructor}</Text>
            </XStack>
            <XStack alignItems="center">
              <Eye size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1">{formatViews(selectedVideo.views)}</Text>
            </XStack>
            <XStack alignItems="center">
              <Heart size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1">{selectedVideo.likes}</Text>
            </XStack>
            <View
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
              style={{ backgroundColor: `${getDifficultyColor(selectedVideo.difficulty)}20` }}
            >
              <Text fontSize={11} fontWeight="500" style={{ color: getDifficultyColor(selectedVideo.difficulty) }}>
                {getDifficultyLabel(selectedVideo.difficulty)}
              </Text>
            </View>
          </XStack>

          {/* Description */}
          <YStack padding="$2.5" borderBottomWidth={1} borderBottomColor="$color5">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">课程简介</Text>
            <Text fontSize="$3" color="$color10" lineHeight={22}>{selectedVideo.description}</Text>
          </YStack>

          {/* Chapters */}
          <YStack padding="$2.5" borderBottomWidth={1} borderBottomColor="$color5">
            <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">课程章节</Text>
            {selectedVideo.chapters.map((chapter, index) => {
              const isCurrentChapter = currentTime >= chapter.startTime &&
                currentTime < (selectedVideo.chapters[index + 1]?.startTime || selectedVideo.duration);

              return (
                <Pressable key={chapter.id} onPress={() => handleChapterPress(chapter)}>
                  <XStack alignItems="center" paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$color4">
                    <View
                      width={32}
                      height={32}
                      borderRadius={16}
                      backgroundColor="$color4"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="$3" fontWeight="600" color="$color10">{index + 1}</Text>
                    </View>
                    <YStack flex={1} marginLeft="$2">
                      <Text fontSize="$3" color="$color12" marginBottom="$0.5">{chapter.title}</Text>
                      <Text fontSize="$2" color="$color9">{formatDuration(chapter.startTime)}</Text>
                    </YStack>
                    {isCurrentChapter && <Play size={20} color={primaryColor} />}
                  </XStack>
                </Pressable>
              );
            })}
          </YStack>

          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <YStack padding="$2.5">
              <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">相关课程</Text>
              {relatedVideos.map(video => (
                <Pressable key={video.id} onPress={() => handleRelatedVideoPress(video.id)}>
                  <XStack paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$color4">
                    <View
                      width={120}
                      height={80}
                      borderRadius="$3"
                      backgroundColor="black"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <PlayCircle size={32} color="white" />
                    </View>
                    <YStack flex={1} marginLeft="$2" justifyContent="space-between">
                      <Text fontSize="$3" fontWeight="500" color="$color12" lineHeight={20} numberOfLines={2}>
                        {video.title}
                      </Text>
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$2" color="$color9">{video.instructor}</Text>
                        <Text fontSize="$2" color="$color9">{formatDuration(video.duration)}</Text>
                      </XStack>
                    </YStack>
                  </XStack>
                </Pressable>
              ))}
            </YStack>
          )}

          <View height={30} />
        </ScrollView>
      </View>
    );
  };

  // ==================== Main Render ====================

  if (currentStep === 'categories') {
    return renderCategoriesView();
  } else if (currentStep === 'videoList') {
    return renderVideoListView();
  } else if (currentStep === 'videoPlayer') {
    return renderVideoPlayerView();
  }

  return null;
};

export default LegalVideoScreen;
