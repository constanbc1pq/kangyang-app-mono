/**
 * 主题专区服务
 * 管理养页面的限时主题活动
 * 使用AsyncStorage存储数据
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Theme,
  ThemeContent,
  ThemeProduct,
  ThemeData,
} from '@/types/theme';

const THEME_DATA_KEY = '@kangyang_theme_data';

/**
 * 初始化默认主题数据
 */
const initializeDefaultThemes = (): Theme[] => {
  const now = new Date();
  const nowISO = now.toISOString();

  // 计算大雪节气的时间范围（12月7日-12月21日左右）
  const year = now.getFullYear();
  const startDate = new Date(year, 11, 7); // 12月7日
  const endDate = new Date(year, 11, 21); // 12月21日

  return [
    {
      id: 'theme_daxue',
      title: '大雪养生专题',
      subtitle: '温补养肾，安然过冬',
      coverImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800',
      hostName: '陈医生',
      hostAvatar: 'local:doctor_001',
      hostTitle: '中医养生专家',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      description: '大雪时节，是进补的黄金期。此时阴气最盛，阳气内藏，正是"藏精养肾"的关键时期。跟着陈医生一起，学习大雪时节的养生之道。',
      relatedColumnIds: ['seasonal-wellness', 'dining-hall'],
      isActive: true,
      viewCount: 28000,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'theme_winter_bp',
      title: '冬季血压管理',
      subtitle: '稳压过冬，健康无忧',
      coverImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
      hostName: '王主任',
      hostAvatar: 'local:doctor_002',
      hostTitle: '心内科主任医师',
      startDate: new Date(year, 11, 15).toISOString(),
      endDate: new Date(year, 11, 31).toISOString(),
      description: '冬季是心血管疾病的高发期，血压波动是很多高血压患者的困扰。王主任将为您详细讲解冬季血压管理的要点。',
      relatedColumnIds: ['famous-doctor', 'care-academy'],
      isActive: true,
      viewCount: 35000,
      createdAt: nowISO,
      updatedAt: nowISO,
    },
  ];
};

/**
 * 初始化主题内容
 */
const initializeDefaultThemeContents = (): ThemeContent[] => {
  const now = new Date().toISOString();

  return [
    // 大雪养生专题内容
    {
      id: 'tc_001',
      themeId: 'theme_daxue',
      title: '大雪养生三原则',
      type: 'article',
      order: 1,
      sourceContentId: 'content_001',
      createdAt: now,
    },
    {
      id: 'tc_002',
      themeId: 'theme_daxue',
      title: '这5种食材要多吃',
      type: 'article',
      order: 2,
      createdAt: now,
    },
    {
      id: 'tc_003',
      themeId: 'theme_daxue',
      title: '名医推荐：冬季养肾方',
      type: 'video',
      order: 3,
      createdAt: now,
    },
    {
      id: 'tc_004',
      themeId: 'theme_daxue',
      title: '大雪食谱：当归羊肉汤',
      type: 'recipe',
      order: 4,
      sourceContentId: 'content_005',
      createdAt: now,
    },
    {
      id: 'tc_005',
      themeId: 'theme_daxue',
      title: '常见误区解答',
      type: 'article',
      order: 5,
      createdAt: now,
    },
    // 冬季血压管理专题内容
    {
      id: 'tc_006',
      themeId: 'theme_winter_bp',
      title: '冬季血压为什么容易波动',
      type: 'article',
      order: 1,
      sourceContentId: 'content_003',
      createdAt: now,
    },
    {
      id: 'tc_007',
      themeId: 'theme_winter_bp',
      title: '居家血压监测要点',
      type: 'video',
      order: 2,
      createdAt: now,
    },
    {
      id: 'tc_008',
      themeId: 'theme_winter_bp',
      title: '高血压患者的冬季运动指南',
      type: 'article',
      order: 3,
      createdAt: now,
    },
  ];
};

/**
 * 初始化主题商品
 */
const initializeDefaultThemeProducts = (): ThemeProduct[] => {
  return [
    // 大雪养生专题商品
    {
      id: 'tp_001',
      themeId: 'theme_daxue',
      name: '羊肉',
      image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200',
      price: 68,
      originalPrice: 78,
      unit: '斤',
      description: '新鲜羊腿肉，温补养身',
      order: 1,
    },
    {
      id: 'tp_002',
      themeId: 'theme_daxue',
      name: '当归',
      image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=200',
      price: 25,
      originalPrice: 30,
      unit: '包',
      description: '甘肃岷县当归，补血活血',
      order: 2,
    },
    {
      id: 'tp_003',
      themeId: 'theme_daxue',
      name: '枸杞',
      image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=200',
      price: 38,
      originalPrice: 45,
      unit: '罐',
      description: '宁夏中宁枸杞，滋补肝肾',
      order: 3,
    },
    {
      id: 'tp_004',
      themeId: 'theme_daxue',
      name: '黑芝麻糊',
      image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=200',
      price: 28,
      unit: '罐',
      description: '现磨黑芝麻糊，乌发养肾',
      order: 4,
    },
    // 冬季血压管理专题商品
    {
      id: 'tp_005',
      themeId: 'theme_winter_bp',
      name: '电子血压计',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
      price: 199,
      originalPrice: 259,
      unit: '台',
      description: '欧姆龙智能血压计',
      order: 1,
    },
    {
      id: 'tp_006',
      themeId: 'theme_winter_bp',
      name: '芹菜汁',
      image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=200',
      price: 15,
      unit: '瓶',
      description: '鲜榨芹菜汁，辅助降压',
      order: 2,
    },
  ];
};

/**
 * 初始化完整的主题数据
 */
const initializeDefaultThemeData = (): ThemeData => {
  return {
    themes: initializeDefaultThemes(),
    themeContents: initializeDefaultThemeContents(),
    themeProducts: initializeDefaultThemeProducts(),
    version: '1.0.0',
    lastModified: new Date().toISOString(),
  };
};

/**
 * 获取主题数据，如果不存在则初始化
 */
export const getThemeData = async (): Promise<ThemeData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(THEME_DATA_KEY);

    if (jsonValue !== null) {
      const data = JSON.parse(jsonValue);
      return data;
    } else {
      // 首次使用，初始化默认数据
      const defaultData = initializeDefaultThemeData();
      await AsyncStorage.setItem(THEME_DATA_KEY, JSON.stringify(defaultData));
      console.log('✅ 主题数据初始化完成');
      return defaultData;
    }
  } catch (error) {
    console.error('获取主题数据失败:', error);
    return initializeDefaultThemeData();
  }
};

/**
 * 保存主题数据
 */
export const saveThemeData = async (data: ThemeData): Promise<boolean> => {
  try {
    data.lastModified = new Date().toISOString();
    await AsyncStorage.setItem(THEME_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存主题数据失败:', error);
    return false;
  }
};

/**
 * 获取进行中的主题列表
 */
export const getActiveThemes = async (): Promise<Theme[]> => {
  const data = await getThemeData();
  const now = new Date();

  return data.themes.filter((theme) => {
    const startDate = new Date(theme.startDate);
    const endDate = new Date(theme.endDate);
    return theme.isActive && now >= startDate && now <= endDate;
  });
};

/**
 * 获取所有主题列表
 */
export const getAllThemes = async (): Promise<Theme[]> => {
  const data = await getThemeData();
  return data.themes;
};

/**
 * 获取主题详情
 */
export const getThemeById = async (themeId: string): Promise<Theme | null> => {
  const data = await getThemeData();
  return data.themes.find((t) => t.id === themeId) || null;
};

/**
 * 获取主题内容列表
 */
export const getThemeContents = async (themeId: string): Promise<ThemeContent[]> => {
  const data = await getThemeData();
  return data.themeContents
    .filter((tc) => tc.themeId === themeId)
    .sort((a, b) => a.order - b.order);
};

/**
 * 获取主题推荐商品
 */
export const getThemeProducts = async (themeId: string): Promise<ThemeProduct[]> => {
  const data = await getThemeData();
  return data.themeProducts
    .filter((tp) => tp.themeId === themeId)
    .sort((a, b) => a.order - b.order);
};

/**
 * 获取当前推荐的主题（用于首页Banner）
 */
export const getCurrentTheme = async (): Promise<Theme | null> => {
  const activeThemes = await getActiveThemes();
  // 返回第一个活跃主题
  return activeThemes.length > 0 ? activeThemes[0] : null;
};

/**
 * 清除主题数据（用于重置）
 */
export const clearThemeData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(THEME_DATA_KEY);
    console.log('✅ 主题数据已清除');
    return true;
  } catch (error) {
    console.error('清除主题数据失败:', error);
    return false;
  }
};

export default {
  getActiveThemes,
  getAllThemes,
  getThemeById,
  getThemeContents,
  getThemeProducts,
  getCurrentTheme,
  clearThemeData,
};
