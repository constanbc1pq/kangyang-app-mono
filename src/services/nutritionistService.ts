/**
 * 营养师服务
 * 管理营养师数据的本地存储和读取
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const NUTRITIONISTS_STORAGE_KEY = '@kangyang_nutritionists';

export interface NutritionistService {
  type: 'video' | 'phone' | 'consultation';
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface Nutritionist {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialty: string;
  rating: number;
  consultations: number;
  avatar: string;
  description: string;
  education: string[];
  certificates: string[];
  achievements: string[];
  services: NutritionistService[];
  availableSlots: {
    date: string;
    slots: string[];
  }[];
  reviews: {
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

/**
 * 默认营养师数据
 */
const DEFAULT_NUTRITIONISTS: Nutritionist[] = [
  {
    id: '1',
    name: '张医师',
    title: '主任营养师',
    experience: '10年+',
    specialty: '老年营养、慢性病管理',
    rating: 4.9,
    consultations: 856,
    avatar: '👩‍⚕️',
    description: '拥有10年以上临床营养经验，擅长老年营养管理和慢性病饮食调理。曾在多家三甲医院营养科工作，帮助超过800位老年人改善健康状况。',
    education: [
      '北京协和医学院 营养学硕士',
      '中国营养学会 注册营养师',
    ],
    certificates: [
      '国家一级营养师',
      '临床营养师资格证',
      '健康管理师',
    ],
    achievements: [
      '2023年度优秀营养师',
      '发表营养学论文15篇',
      '参与编写《老年营养指南》',
      '受邀参加央视健康节目',
    ],
    services: [
      {
        type: 'video',
        name: '在线视频对话咨询',
        duration: '30分钟',
        price: 199,
        description: '视频面对面交流，详细了解您的健康状况',
      },
      {
        type: 'phone',
        name: '电话咨询',
        duration: '20分钟',
        price: 149,
        description: '电话沟通，快速解答您的营养问题',
      },
      {
        type: 'consultation',
        name: '图文咨询',
        duration: '24小时',
        price: 49,
        description: '文字交流，随时提问，24小时内回复',
      },
    ],
    availableSlots: [
      {
        date: '2024-02-01',
        slots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      },
      {
        date: '2024-02-02',
        slots: ['09:00', '10:30', '14:00', '15:30'],
      },
      {
        date: '2024-02-03',
        slots: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      },
    ],
    reviews: [
      {
        userName: '王**',
        rating: 5,
        comment: '张医师非常专业，针对我父亲的糖尿病给出了详细的饮食方案，血糖控制得很好！',
        date: '2024-01-28',
      },
      {
        userName: '李**',
        rating: 5,
        comment: '服务态度好，讲解很细致，还给了很多实用的饮食建议。',
        date: '2024-01-25',
      },
      {
        userName: '赵**',
        rating: 4,
        comment: '很专业，就是预约有点难约，需要提前好几天。',
        date: '2024-01-22',
      },
    ],
  },
  {
    id: '2',
    name: '李医师',
    title: '高级营养师',
    experience: '8年+',
    specialty: '减重管理、运动营养',
    rating: 4.8,
    consultations: 723,
    avatar: '👨‍⚕️',
    description: '专注于体重管理和运动营养领域，曾为多位专业运动员和健身爱好者提供营养指导。擅长科学减重和增肌营养方案设计。',
    education: [
      '北京体育大学 运动营养硕士',
      '美国运动医学会 认证营养师',
    ],
    certificates: [
      '国家一级营养师',
      '运动营养师资格证',
      '私人教练证书',
    ],
    achievements: [
      '国家队运动营养顾问',
      '帮助500+人成功减重',
      '出版《科学减重指南》',
      '健身App营养顾问',
    ],
    services: [
      {
        type: 'video',
        name: '在线视频对话咨询',
        duration: '30分钟',
        price: 169,
        description: '视频面对面交流，详细了解您的健康状况',
      },
      {
        type: 'phone',
        name: '电话咨询',
        duration: '20分钟',
        price: 129,
        description: '电话沟通，快速解答您的营养问题',
      },
      {
        type: 'consultation',
        name: '图文咨询',
        duration: '24小时',
        price: 39,
        description: '文字交流，随时提问，24小时内回复',
      },
    ],
    availableSlots: [
      {
        date: '2024-02-01',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '19:00', '20:00'],
      },
      {
        date: '2024-02-02',
        slots: ['09:00', '10:00', '14:00', '15:00', '19:00', '20:00'],
      },
      {
        date: '2024-02-03',
        slots: ['10:00', '11:00', '14:00', '15:00', '16:00', '19:00'],
      },
    ],
    reviews: [
      {
        userName: '张**',
        rating: 5,
        comment: '李医师的减重方案非常科学，3个月减了20斤，没有反弹！',
        date: '2024-01-22',
      },
      {
        userName: '刘**',
        rating: 5,
        comment: '专业！作为健身爱好者，李医师给的营养建议非常实用，增肌效果明显。',
        date: '2024-01-19',
      },
      {
        userName: '陈**',
        rating: 4,
        comment: '服务很好，方案详细，就是预约有点难约。',
        date: '2024-01-16',
      },
    ],
  },
];

/**
 * 初始化营养师数据
 */
export const initializeNutritionists = async (): Promise<boolean> => {
  try {
    const existing = await AsyncStorage.getItem(NUTRITIONISTS_STORAGE_KEY);
    if (!existing) {
      await AsyncStorage.setItem(NUTRITIONISTS_STORAGE_KEY, JSON.stringify(DEFAULT_NUTRITIONISTS));
      console.log('✅ 营养师数据初始化成功');
    }
    return true;
  } catch (error) {
    console.error('❌ 营养师数据初始化失败:', error);
    return false;
  }
};

/**
 * 获取所有营养师列表
 */
export const getNutritionists = async (): Promise<Nutritionist[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(NUTRITIONISTS_STORAGE_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      // 如果没有数据，先初始化
      await initializeNutritionists();
      return DEFAULT_NUTRITIONISTS;
    }
  } catch (error) {
    console.error('获取营养师列表失败:', error);
    return [];
  }
};

/**
 * 根据ID获取营养师详情
 */
export const getNutritionistById = async (id: string): Promise<Nutritionist | null> => {
  try {
    const nutritionists = await getNutritionists();
    return nutritionists.find(n => n.id === id) || null;
  } catch (error) {
    console.error('获取营养师详情失败:', error);
    return null;
  }
};

/**
 * 更新营养师信息（管理员功能）
 */
export const updateNutritionist = async (id: string, data: Partial<Nutritionist>): Promise<boolean> => {
  try {
    const nutritionists = await getNutritionists();
    const index = nutritionists.findIndex(n => n.id === id);

    if (index === -1) {
      return false;
    }

    nutritionists[index] = { ...nutritionists[index], ...data };
    await AsyncStorage.setItem(NUTRITIONISTS_STORAGE_KEY, JSON.stringify(nutritionists));
    return true;
  } catch (error) {
    console.error('更新营养师信息失败:', error);
    return false;
  }
};

/**
 * 添加营养师（管理员功能）
 */
export const addNutritionist = async (nutritionist: Nutritionist): Promise<boolean> => {
  try {
    const nutritionists = await getNutritionists();
    nutritionists.push(nutritionist);
    await AsyncStorage.setItem(NUTRITIONISTS_STORAGE_KEY, JSON.stringify(nutritionists));
    return true;
  } catch (error) {
    console.error('添加营养师失败:', error);
    return false;
  }
};

/**
 * 删除营养师（管理员功能）
 */
export const deleteNutritionist = async (id: string): Promise<boolean> => {
  try {
    const nutritionists = await getNutritionists();
    const filtered = nutritionists.filter(n => n.id !== id);
    await AsyncStorage.setItem(NUTRITIONISTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除营养师失败:', error);
    return false;
  }
};

/**
 * 重置营养师数据（恢复默认）
 */
export const resetNutritionists = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(NUTRITIONISTS_STORAGE_KEY, JSON.stringify(DEFAULT_NUTRITIONISTS));
    console.log('✅ 营养师数据已重置');
    return true;
  } catch (error) {
    console.error('❌ 营养师数据重置失败:', error);
    return false;
  }
};