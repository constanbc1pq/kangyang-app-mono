import AsyncStorage from '@react-native-async-storage/async-storage';
import { Circle, CirclePost, CircleMember, UserCommunityData } from '@/types/community';

const STORAGE_KEY = '@kangyang_community_data';

// Mock圈子数据
const mockCircles: Circle[] = [
  {
    id: '1',
    name: '糖尿病友互助圈',
    description: '糖尿病患者经验分享与互助支持，一起科学管理血糖，提高生活质量。本圈子致力于为糖尿病患者提供一个温暖的交流平台。',
    members: 1234,
    posts: 567,
    todayPosts: 12,
    tags: ['糖尿病', '血糖管理', '互助'],
    isVerified: true,
    createdDate: '2023-06-15',
    rules: [
      '尊重他人，文明交流',
      '分享真实经验，不传播虚假信息',
      '保护隐私，不泄露他人信息',
      '禁止广告和商业推广',
      '遵守法律法规和平台规则',
    ],
    admins: [
      { name: '张医师', title: '内分泌科医师', role: '创建者' },
      { name: '李护士', title: '糖尿病专科护士', role: '管理员' },
    ],
    isJoined: false,
    category: '疾病管理',
  },
  {
    id: '2',
    name: '高血压管理群',
    description: '高血压患者日常管理经验交流，分享降压心得，互相鼓励支持，共同追求健康生活。',
    members: 987,
    posts: 432,
    todayPosts: 8,
    tags: ['高血压', '血压管理', '慢病'],
    isVerified: true,
    createdDate: '2023-07-20',
    rules: [
      '尊重他人，文明交流',
      '分享真实经验，不传播虚假信息',
      '保护隐私，不泄露他人信息',
      '禁止广告和商业推广',
      '遵守法律法规和平台规则',
    ],
    admins: [
      { name: '王医师', title: '心血管内科医师', role: '创建者' },
      { name: '赵护士', title: '心内科护士长', role: '管理员' },
    ],
    isJoined: false,
    category: '疾病管理',
  },
  {
    id: '3',
    name: '养生食疗分享',
    description: '传统养生食疗方法分享与讨论，交流各种食疗方、养生粥、药膳汤的制作经验。',
    members: 2156,
    posts: 1234,
    todayPosts: 18,
    tags: ['养生', '食疗', '中医'],
    isVerified: true,
    createdDate: '2023-05-10',
    rules: [
      '尊重他人，文明交流',
      '分享真实食谱，注明食材用量',
      '标注适宜人群和禁忌',
      '不推荐未经验证的偏方',
      '遵守法律法规和平台规则',
    ],
    admins: [
      { name: '陈医师', title: '中医养生专家', role: '创建者' },
      { name: '刘营养师', title: '中医营养师', role: '管理员' },
    ],
    isJoined: false,
    category: '养生交流',
  },
  {
    id: '4',
    name: '老年健康关爱',
    description: '关注老年人健康，分享护理经验，讨论老年常见疾病的预防和管理方法。',
    members: 876,
    posts: 345,
    todayPosts: 6,
    tags: ['老年健康', '护理', '关爱'],
    isVerified: true,
    createdDate: '2023-08-05',
    rules: [
      '尊重老人，关爱老人',
      '分享专业护理知识',
      '保护老人隐私',
      '禁止推销产品',
      '遵守法律法规和平台规则',
    ],
    admins: [
      { name: '李护士', title: '老年护理专家', role: '创建者' },
      { name: '周医师', title: '老年医学科医师', role: '管理员' },
    ],
    isJoined: false,
    category: '养生交流',
  },
  {
    id: '5',
    name: '运动健身俱乐部',
    description: '分享运动健身经验，交流科学锻炼方法，一起追求健康生活方式。',
    members: 1543,
    posts: 789,
    todayPosts: 15,
    tags: ['运动', '健身', '减肥'],
    isVerified: true,
    createdDate: '2023-09-12',
    rules: [
      '分享科学的运动方法',
      '不推荐极端锻炼方式',
      '注意运动安全',
      '尊重不同健身水平的成员',
      '遵守法律法规和平台规则',
    ],
    admins: [
      { name: '李教练', title: '康复理疗师', role: '创建者' },
      { name: '张教练', title: '健身教练', role: '管理员' },
    ],
    isJoined: false,
    category: '运动健身',
  },
  {
    id: '6',
    name: '心理健康互助',
    description: '心理健康交流平台，分享情绪管理方法，互相支持鼓励，共同维护心理健康。',
    members: 654,
    posts: 298,
    todayPosts: 7,
    tags: ['心理健康', '情绪管理', '互助'],
    isVerified: true,
    createdDate: '2023-10-18',
    rules: [
      '尊重他人感受',
      '保护隐私信息',
      '提供积极正面的支持',
      '严重心理问题请寻求专业帮助',
      '遵守法律法规和平台规则',
    ],
    admins: [
      { name: '吴医师', title: '心理咨询师', role: '创建者' },
      { name: '郑医师', title: '精神科医师', role: '管理员' },
    ],
    isJoined: false,
    category: '养生交流',
  },
];

// Mock圈子帖子数据
const mockCirclePosts: { [circleId: string]: CirclePost[] } = {
  '1': [
    {
      id: 'post1',
      user: {
        name: '健康达人小王',
        level: '活跃用户',
        verified: true,
      },
      content: '分享一下我的血糖管理经验：坚持每天记录血糖数据，配合饮食和运动调整，三个月下来糖化血红蛋白从8.5降到了6.8！大家一起加油！',
      timestamp: '10分钟前',
      likes: 23,
      comments: 8,
      isPinned: true,
    },
    {
      id: 'post2',
      user: {
        name: '养生爱好者',
        level: '资深用户',
        verified: false,
      },
      content: '请教一下大家，餐后血糖多久测量比较准确？我一般是餐后2小时测，不知道对不对。',
      timestamp: '30分钟前',
      likes: 12,
      comments: 15,
    },
    {
      id: 'post3',
      user: {
        name: '糖友互助',
        level: '普通用户',
        verified: false,
      },
      content: '今天分享一个降糖小妙招：苦瓜炒鸡蛋。苦瓜有辅助降血糖的作用，配合鸡蛋营养又美味。做法：苦瓜切薄片，焯水去苦味，鸡蛋炒熟后加入苦瓜翻炒即可。',
      timestamp: '1小时前',
      likes: 34,
      comments: 12,
    },
  ],
  '2': [
    {
      id: 'post4',
      user: {
        name: '血压管家',
        level: '活跃用户',
        verified: true,
      },
      content: '提醒大家：测血压前要静坐5分钟，袖带要绑对位置。我之前测量方法不对，数值总是偏高，后来纠正后数据就准确多了。',
      timestamp: '20分钟前',
      likes: 18,
      comments: 6,
      isPinned: true,
    },
    {
      id: 'post5',
      user: {
        name: '健康生活',
        level: '资深用户',
        verified: false,
      },
      content: '分享我的降压食谱：芹菜汁+苹果，每天早上一杯。坚持一个月，血压下降了10个点。当然还要配合药物治疗和运动哦！',
      timestamp: '45分钟前',
      likes: 25,
      comments: 10,
    },
  ],
  '3': [
    {
      id: 'post6',
      user: {
        name: '养生达人',
        level: '专业用户',
        verified: true,
      },
      content: '今日食疗方推荐：山药枸杞粥。材料：山药100g、枸杞15g、大米50g。功效：补脾益肾，滋阴润燥。做法：山药去皮切块，与大米同煮，粥成加枸杞即可。',
      timestamp: '15分钟前',
      likes: 42,
      comments: 18,
      isPinned: true,
    },
  ],
};

// Mock活跃成员数据
const mockActiveMembers: { [circleId: string]: CircleMember[] } = {
  '1': [
    { id: 'm1', name: '健康达人', level: '活跃用户', posts: 45, joinDate: '2023-06-20' },
    { id: 'm2', name: '养生爱好者', level: '资深用户', posts: 38, joinDate: '2023-07-01' },
    { id: 'm3', name: '康复小助手', level: '专业用户', posts: 32, joinDate: '2023-06-25' },
    { id: 'm4', name: '糖友互助', level: '活跃用户', posts: 28, joinDate: '2023-08-10' },
    { id: 'm5', name: '健康生活', level: '资深用户', posts: 25, joinDate: '2023-07-15' },
  ],
};

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

// 获取所有圈子
export async function getCircles(): Promise<Circle[]> {
  const userData = await getUserCommunityData();

  return mockCircles.map(circle => ({
    ...circle,
    isJoined: userData.joinedCircles.includes(circle.id),
  }));
}

// 根据ID获取圈子
export async function getCircleById(id: string): Promise<Circle | null> {
  const circles = await getCircles();
  return circles.find(circle => circle.id === id) || null;
}

// 根据分类获取圈子
export async function getCirclesByCategory(category: string): Promise<Circle[]> {
  const circles = await getCircles();
  if (category === '全部') {
    return circles;
  }
  return circles.filter(circle => circle.category === category);
}

// 加入/退出圈子
export async function toggleJoinCircle(circleId: string): Promise<boolean> {
  const userData = await getUserCommunityData();
  const index = userData.joinedCircles.indexOf(circleId);

  if (index > -1) {
    userData.joinedCircles.splice(index, 1);
  } else {
    userData.joinedCircles.push(circleId);
  }

  await saveUserCommunityData(userData);
  return index === -1; // 返回新的加入状态
}

// 获取圈子帖子
export async function getCirclePosts(circleId: string): Promise<CirclePost[]> {
  const userData = await getUserCommunityData();
  const posts = mockCirclePosts[circleId] || [];

  return posts.map(post => ({
    ...post,
    isLiked: userData.circlePostLikes.includes(post.id),
  }));
}

// 点赞圈子帖子
export async function toggleLikeCirclePost(postId: string): Promise<boolean> {
  const userData = await getUserCommunityData();
  const index = userData.circlePostLikes.indexOf(postId);

  if (index > -1) {
    userData.circlePostLikes.splice(index, 1);
  } else {
    userData.circlePostLikes.push(postId);
  }

  await saveUserCommunityData(userData);
  return index === -1;
}

// 获取活跃成员
export async function getActiveMembers(circleId: string): Promise<CircleMember[]> {
  return mockActiveMembers[circleId] || [];
}

// 搜索圈子
export async function searchCircles(query: string): Promise<Circle[]> {
  const circles = await getCircles();
  const lowerQuery = query.toLowerCase();

  return circles.filter(circle =>
    circle.name.toLowerCase().includes(lowerQuery) ||
    circle.description.toLowerCase().includes(lowerQuery) ||
    circle.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 获取我加入的圈子
export async function getMyCircles(): Promise<Circle[]> {
  const circles = await getCircles();
  return circles.filter(circle => circle.isJoined);
}

export const circleService = {
  getCircles,
  getCircleById,
  getCirclesByCategory,
  toggleJoinCircle,
  getCirclePosts,
  toggleLikeCirclePost,
  getActiveMembers,
  searchCircles,
  getMyCircles,
};
