import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, UserCommunityData } from '@/types/community';

const STORAGE_KEY = '@kangyang_community_data';

// Mock视频数据 - 健康养生类短视频
const mockVideos: Video[] = [
  {
    id: '1',
    title: '5分钟办公室拉伸操，告别腰酸背痛',
    description: '久坐办公的朋友们必学！每天5分钟，轻松缓解腰背酸痛。这套动作简单易学，不需要任何器械，在办公室就能完成。#办公室健身 #拉伸运动',
    author: {
      id: 'author1',
      name: '健身教练小李',
      title: '国家认证健身教练',
      verified: true,
      followers: 12500,
    },
    publishTime: '2天前',
    duration: '05:23',
    views: 15600,
    likes: 1234,
    comments: 89,
    shares: 156,
    category: '运动健身',
    tags: ['办公室健身', '拉伸运动', '腰背护理'],
    thumbnail: 'https://placeholder.com/video1.jpg',
    videoUrl: 'https://placeholder.com/video1.mp4',
  },
  {
    id: '2',
    title: '老年人防跌倒训练，平衡力提升法',
    description: '适合中老年人的平衡训练，每天坚持练习可以有效预防跌倒。动作温和安全，由专业康复师指导。',
    author: {
      id: 'author2',
      name: '康复师王医生',
      title: '康复医学主治医师',
      verified: true,
      followers: 28900,
    },
    publishTime: '1周前',
    duration: '08:15',
    views: 23400,
    likes: 2156,
    comments: 178,
    shares: 345,
    category: '老年健康',
    tags: ['防跌倒', '平衡训练', '老年运动'],
    thumbnail: 'https://placeholder.com/video2.jpg',
    videoUrl: 'https://placeholder.com/video2.mp4',
  },
  {
    id: '3',
    title: '冬季养生汤，营养师教你这样煲',
    description: '冬天进补首选！三款简单易做的养生汤，暖胃又营养。食材都很常见，跟着视频一起做吧~',
    author: {
      id: 'author3',
      name: '营养师张姐',
      title: '注册营养师',
      verified: true,
      followers: 45600,
    },
    publishTime: '3天前',
    duration: '12:40',
    views: 34500,
    likes: 3456,
    comments: 234,
    shares: 567,
    category: '营养饮食',
    tags: ['冬季养生', '养生汤', '食疗'],
    thumbnail: 'https://placeholder.com/video3.jpg',
    videoUrl: 'https://placeholder.com/video3.mp4',
  },
  {
    id: '4',
    title: '糖尿病患者饮食指南，这些食物可以放心吃',
    description: '糖尿病不是什么都不能吃！营养专家详细讲解糖尿病饮食原则，推荐低GI食物清单。',
    author: {
      id: 'author4',
      name: '内分泌科陈医生',
      title: '内分泌科副主任医师',
      verified: true,
      followers: 56700,
    },
    publishTime: '5天前',
    duration: '10:20',
    views: 28900,
    likes: 2780,
    comments: 312,
    shares: 445,
    category: '慢病管理',
    tags: ['糖尿病', '饮食指南', '低GI食物'],
    thumbnail: 'https://placeholder.com/video4.jpg',
    videoUrl: 'https://placeholder.com/video4.mp4',
  },
  {
    id: '5',
    title: '睡前10分钟瑜伽，改善失眠质量',
    description: '失眠困扰？试试这套睡前瑜伽！温和的拉伸动作帮助放松身心，让你更容易入睡。',
    author: {
      id: 'author5',
      name: '瑜伽导师Lisa',
      title: 'RYT200认证瑜伽教练',
      verified: true,
      followers: 38900,
    },
    publishTime: '1天前',
    duration: '11:05',
    views: 19800,
    likes: 1890,
    comments: 145,
    shares: 234,
    category: '运动健身',
    tags: ['瑜伽', '改善睡眠', '睡前拉伸'],
    thumbnail: 'https://placeholder.com/video5.jpg',
    videoUrl: 'https://placeholder.com/video5.mp4',
  },
  {
    id: '6',
    title: '高血压患者日常注意事项',
    description: '高血压管理不只是吃药！医生详细讲解日常生活中需要注意的8个要点。',
    author: {
      id: 'author6',
      name: '心血管科刘医生',
      title: '心血管内科主任医师',
      verified: true,
      followers: 67800,
    },
    publishTime: '4天前',
    duration: '09:35',
    views: 31200,
    likes: 2950,
    comments: 267,
    shares: 489,
    category: '慢病管理',
    tags: ['高血压', '日常护理', '健康管理'],
    thumbnail: 'https://placeholder.com/video6.jpg',
    videoUrl: 'https://placeholder.com/video6.mp4',
  },
];

// 获取用户社区数据
async function getUserCommunityData(): Promise<UserCommunityData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load community data:', error);
  }
  return {
    bookmarkedArticles: [],
    likedArticles: [],
    joinedCircles: [],
    followedTopics: [],
    circlePostLikes: [],
    commentLikes: [],
    likedVideos: [],
    followedAuthors: [],
  };
}

// 保存用户社区数据
async function saveUserCommunityData(data: UserCommunityData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save community data:', error);
  }
}

// 获取所有视频
export const getVideos = async (): Promise<Video[]> => {
  const userData = await getUserCommunityData();
  return mockVideos.map(video => ({
    ...video,
    isLiked: userData.likedVideos?.includes(video.id) || false,
    isFollowed: userData.followedAuthors?.includes(video.author.id) || false,
  }));
};

// 根据分类获取视频
export const getVideosByCategory = async (category: string): Promise<Video[]> => {
  const allVideos = await getVideos();
  if (category === '全部') {
    return allVideos;
  }
  return allVideos.filter(video => video.category === category);
};

// 根据ID获取视频
export const getVideoById = async (videoId: string): Promise<Video | null> => {
  const videos = await getVideos();
  return videos.find(video => video.id === videoId) || null;
};

// 搜索视频
export const searchVideos = async (query: string): Promise<Video[]> => {
  const allVideos = await getVideos();
  const lowerQuery = query.toLowerCase();
  return allVideos.filter(
    video =>
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// 切换视频点赞状态
export const toggleLikeVideo = async (videoId: string): Promise<boolean> => {
  const userData = await getUserCommunityData();
  const isLiked = userData.likedVideos.includes(videoId);

  if (isLiked) {
    userData.likedVideos = userData.likedVideos.filter(id => id !== videoId);
  } else {
    userData.likedVideos.push(videoId);
  }

  await saveUserCommunityData(userData);
  return !isLiked;
};

// 切换关注作者
export const toggleFollowAuthor = async (authorId: string): Promise<boolean> => {
  const userData = await getUserCommunityData();
  const isFollowed = userData.followedAuthors.includes(authorId);

  if (isFollowed) {
    userData.followedAuthors = userData.followedAuthors.filter(id => id !== authorId);
  } else {
    userData.followedAuthors.push(authorId);
  }

  await saveUserCommunityData(userData);
  return !isFollowed;
};

export const videoService = {
  getVideos,
  getVideosByCategory,
  getVideoById,
  searchVideos,
  toggleLikeVideo,
  toggleFollowAuthor,
};
