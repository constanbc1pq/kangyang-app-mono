import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topic, UserCommunityData } from '@/types/community';

const STORAGE_KEY = '@kangyang_community_data';

// Mock话题数据
const mockTopics: Topic[] = [
  {
    id: '1',
    name: '冬季养生',
    description: '分享冬季养生知识、食疗方法、运动建议等，帮助大家健康过冬。',
    posts: 234,
    participants: 1890,
    views: 15600,
    trend: 'up',
    trendValue: '+12%',
    tags: ['养生', '冬季', '食疗', '保健'],
    createdDate: '2024-10-01',
    isFollowing: false,
  },
  {
    id: '2',
    name: '血压管理',
    description: '高血压患者的日常管理经验、用药心得、饮食控制技巧分享。',
    posts: 189,
    participants: 1456,
    views: 12300,
    trend: 'up',
    trendValue: '+8%',
    tags: ['高血压', '慢病管理', '用药', '饮食'],
    createdDate: '2024-09-15',
    isFollowing: false,
  },
  {
    id: '3',
    name: '老年护理',
    description: '老年人居家护理技巧、照护经验、康复知识交流平台。',
    posts: 156,
    participants: 987,
    views: 9800,
    trend: 'stable',
    trendValue: '0%',
    tags: ['老年护理', '居家照护', '康复', '安全'],
    createdDate: '2024-09-01',
    isFollowing: false,
  },
  {
    id: '4',
    name: '营养搭配',
    description: '科学营养搭配、健康饮食建议、食谱分享与讨论。',
    posts: 134,
    participants: 1234,
    views: 11200,
    trend: 'up',
    trendValue: '+6%',
    tags: ['营养', '饮食', '食谱', '健康'],
    createdDate: '2024-08-20',
    isFollowing: false,
  },
  {
    id: '5',
    name: '运动康复',
    description: '运动康复方法、理疗技巧、术后恢复经验分享。',
    posts: 98,
    participants: 756,
    views: 7600,
    trend: 'down',
    trendValue: '-3%',
    tags: ['运动', '康复', '理疗', '恢复'],
    createdDate: '2024-08-10',
    isFollowing: false,
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

// 获取所有话题
export const getTopics = async (): Promise<Topic[]> => {
  const userData = await getUserCommunityData();
  return mockTopics.map(topic => ({
    ...topic,
    isFollowing: userData.followedTopics?.includes(topic.id) || false,
  }));
};

// 根据ID获取话题
export const getTopicById = async (topicId: string): Promise<Topic | null> => {
  const topics = await getTopics();
  return topics.find(topic => topic.id === topicId) || null;
};

// 搜索话题
export const searchTopics = async (query: string): Promise<Topic[]> => {
  const allTopics = await getTopics();
  const lowerQuery = query.toLowerCase();
  return allTopics.filter(
    topic =>
      topic.name.toLowerCase().includes(lowerQuery) ||
      topic.description.toLowerCase().includes(lowerQuery) ||
      topic.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// 切换关注话题
export const toggleFollowTopic = async (topicId: string): Promise<boolean> => {
  const userData = await getUserCommunityData();
  const isFollowing = userData.followedTopics?.includes(topicId) || false;

  if (isFollowing) {
    userData.followedTopics = userData.followedTopics?.filter(id => id !== topicId) || [];
  } else {
    if (!userData.followedTopics) {
      userData.followedTopics = [];
    }
    userData.followedTopics.push(topicId);
  }

  await saveUserCommunityData(userData);
  return !isFollowing;
};

export const topicService = {
  getTopics,
  getTopicById,
  searchTopics,
  toggleFollowTopic,
};
