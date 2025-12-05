/**
 * 菜谱推荐服务
 *
 * 根据会员等级提供不同级别的菜谱推荐：
 * - 免费用户: 基础菜谱
 * - 黄金会员: AI推荐菜谱
 * - 白金会员: 私人专属搭配+营养分析
 * - 钻石会员: 全家专属搭配+一键下单
 */

import { MembershipLevel } from '@/types/membership';
import { getMembership } from '@/services/userDataService';

// 菜谱类型
export interface Recipe {
  id: string;
  name: string;
  image: string;
  description: string;
  cookingTime: number; // 分钟
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
  recommendReason?: string; // 会员专属推荐理由
  aiAnalysis?: string; // AI营养分析
  familyServings?: number; // 家庭份量
  mealPlanId: string; // 关联的营养配餐套餐ID
  mealPlanName: string; // 套餐名称
}

export interface Ingredient {
  name: string;
  amount: string;
  price?: number; // 食材价格
  discountPrice?: number; // 会员折扣价
}

export interface DailyRecommendation {
  date: string;
  recipes: Recipe[];
  membershipLevel: MembershipLevel;
  features: RecommendFeature[];
}

export type RecommendFeature =
  | 'basic' // 基础菜谱
  | 'ai_recommend' // AI推荐
  | 'nutrition_analysis' // 营养分析
  | 'personal_customize' // 个人定制
  | 'family_customize' // 全家定制
  | 'one_click_order'; // 一键下单

// 会员等级对应的推荐功能
const LEVEL_FEATURES: Record<MembershipLevel, RecommendFeature[]> = {
  [MembershipLevel.FREE]: ['basic'],
  [MembershipLevel.GOLD]: ['basic', 'ai_recommend'],
  [MembershipLevel.PLATINUM]: ['basic', 'ai_recommend', 'nutrition_analysis', 'personal_customize'],
  [MembershipLevel.DIAMOND]: ['basic', 'ai_recommend', 'nutrition_analysis', 'family_customize', 'one_click_order'],
};

// Mock菜谱数据
const MOCK_RECIPES: Recipe[] = [
  {
    id: 'recipe_001',
    name: '清蒸鲈鱼',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
    description: '低脂高蛋白，适合老年人的清淡美食',
    cookingTime: 25,
    difficulty: 'easy',
    calories: 180,
    nutrition: {
      protein: 28,
      carbs: 2,
      fat: 6,
      fiber: 0,
    },
    tags: ['低脂', '高蛋白', '清淡', '易消化'],
    ingredients: [
      { name: '鲈鱼', amount: '1条(约500g)', price: 35, discountPrice: 29.75 },
      { name: '生姜', amount: '30g', price: 2 },
      { name: '葱', amount: '2根', price: 3 },
      { name: '蒸鱼豉油', amount: '2勺', price: 5 },
    ],
    steps: [
      '鲈鱼清洗干净，在鱼身两侧划几刀',
      '姜切丝，葱切段，一半铺在盘底',
      '鱼放在葱姜上，再铺上剩余葱姜',
      '水开后蒸8-10分钟',
      '出锅淋上蒸鱼豉油即可',
    ],
    mealPlanId: 'elderly',
    mealPlanName: '老年养生',
  },
  {
    id: 'recipe_002',
    name: '番茄鸡蛋汤',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    description: '开胃暖身，富含维生素C和优质蛋白',
    cookingTime: 15,
    difficulty: 'easy',
    calories: 120,
    nutrition: {
      protein: 8,
      carbs: 10,
      fat: 5,
      fiber: 2,
    },
    tags: ['开胃', '暖身', '维生素C', '快手菜'],
    ingredients: [
      { name: '番茄', amount: '2个', price: 6, discountPrice: 5.1 },
      { name: '鸡蛋', amount: '2个', price: 4 },
      { name: '香菜', amount: '适量', price: 2 },
      { name: '盐', amount: '适量', price: 1 },
    ],
    steps: [
      '番茄切块，鸡蛋打散备用',
      '锅中加油，放入番茄翻炒出汁',
      '加入适量清水煮开',
      '淋入蛋液，轻轻搅动',
      '加盐调味，撒上香菜即可',
    ],
    mealPlanId: 'balanced',
    mealPlanName: '均衡营养',
  },
  {
    id: 'recipe_003',
    name: '养生杂粮粥',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400',
    description: '多种杂粮搭配，富含膳食纤维，有助于稳定血糖',
    cookingTime: 60,
    difficulty: 'easy',
    calories: 200,
    nutrition: {
      protein: 6,
      carbs: 40,
      fat: 2,
      fiber: 8,
    },
    tags: ['养生', '高纤维', '控糖', '早餐'],
    ingredients: [
      { name: '糙米', amount: '50g', price: 5, discountPrice: 4.25 },
      { name: '小米', amount: '30g', price: 4 },
      { name: '红豆', amount: '20g', price: 3 },
      { name: '燕麦', amount: '20g', price: 4 },
      { name: '枸杞', amount: '10g', price: 5 },
    ],
    steps: [
      '红豆提前浸泡4小时',
      '所有杂粮洗净放入锅中',
      '加入适量清水，大火煮开',
      '转小火慢煮50分钟',
      '出锅前加入枸杞焖5分钟',
    ],
    mealPlanId: 'elderly',
    mealPlanName: '老年养生',
  },
  {
    id: 'recipe_004',
    name: '蒜蓉西兰花',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    description: '抗氧化蔬菜之王，保护心血管健康',
    cookingTime: 10,
    difficulty: 'easy',
    calories: 80,
    nutrition: {
      protein: 4,
      carbs: 8,
      fat: 3,
      fiber: 4,
    },
    tags: ['抗氧化', '低卡', '快手菜', '护心'],
    ingredients: [
      { name: '西兰花', amount: '300g', price: 8, discountPrice: 6.8 },
      { name: '大蒜', amount: '5瓣', price: 2 },
      { name: '蚝油', amount: '1勺', price: 3 },
    ],
    steps: [
      '西兰花切小朵，洗净备用',
      '锅中水烧开，加少许盐和油',
      '西兰花焯水1分钟捞出',
      '热锅凉油，爆香蒜末',
      '加入西兰花和蚝油快速翻炒即可',
    ],
    mealPlanId: 'weight-loss',
    mealPlanName: '轻体健康',
  },
  {
    id: 'recipe_005',
    name: '山药排骨汤',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    description: '健脾养胃，补钙强骨，适合秋冬进补',
    cookingTime: 90,
    difficulty: 'medium',
    calories: 280,
    nutrition: {
      protein: 18,
      carbs: 20,
      fat: 12,
      fiber: 3,
    },
    tags: ['养胃', '补钙', '进补', '煲汤'],
    ingredients: [
      { name: '排骨', amount: '500g', price: 40, discountPrice: 34 },
      { name: '山药', amount: '300g', price: 12 },
      { name: '枸杞', amount: '10g', price: 5 },
      { name: '生姜', amount: '3片', price: 2 },
      { name: '料酒', amount: '1勺', price: 3 },
    ],
    steps: [
      '排骨冷水下锅焯水，去除血沫',
      '山药去皮切块',
      '砂锅加水放入排骨、姜片、料酒',
      '大火煮开后转小火炖60分钟',
      '加入山药继续炖20分钟',
      '出锅前加枸杞和盐调味',
    ],
    mealPlanId: 'premium',
    mealPlanName: '尊享私厨',
  },
];

/**
 * 获取今日推荐菜谱
 */
export const getDailyRecipes = async (): Promise<DailyRecommendation> => {
  try {
    const membership = await getMembership();
    const level = membership?.level || MembershipLevel.FREE;
    const features = LEVEL_FEATURES[level];

    // 根据会员等级筛选和增强菜谱
    let recipes = [...MOCK_RECIPES];

    // 免费用户只显示前2个基础菜谱
    if (level === MembershipLevel.FREE) {
      recipes = recipes.slice(0, 2);
    }

    // 黄金会员及以上添加AI推荐理由
    if (features.includes('ai_recommend')) {
      recipes = recipes.map(recipe => ({
        ...recipe,
        recommendReason: generateAIRecommendReason(recipe, level),
      }));
    }

    // 白金会员及以上添加营养分析
    if (features.includes('nutrition_analysis')) {
      recipes = recipes.map(recipe => ({
        ...recipe,
        aiAnalysis: generateNutritionAnalysis(recipe),
      }));
    }

    // 钻石会员添加家庭份量
    if (features.includes('family_customize')) {
      recipes = recipes.map(recipe => ({
        ...recipe,
        familyServings: 4,
      }));
    }

    return {
      date: new Date().toISOString().split('T')[0],
      recipes,
      membershipLevel: level,
      features,
    };
  } catch (error) {
    console.error('Failed to get daily recipes:', error);
    // 返回基础推荐
    return {
      date: new Date().toISOString().split('T')[0],
      recipes: MOCK_RECIPES.slice(0, 2),
      membershipLevel: MembershipLevel.FREE,
      features: ['basic'],
    };
  }
};

/**
 * 生成AI推荐理由
 */
const generateAIRecommendReason = (recipe: Recipe, level: MembershipLevel): string => {
  const reasons: Record<string, string> = {
    recipe_001: '根据您的健康数据，建议增加优质蛋白摄入，这道清蒸鲈鱼低脂高蛋白，非常适合您',
    recipe_002: '您最近维生素C摄入不足，番茄富含维生素C，搭配鸡蛋营养均衡',
    recipe_003: '监测到您的血糖波动较大，杂粮粥升糖指数低，有助于稳定血糖',
    recipe_004: '西兰花富含抗氧化物质，对您的心血管健康有益',
    recipe_005: '入秋后适合温补，山药排骨汤健脾养胃，增强体质',
  };

  return reasons[recipe.id] || '根据您的饮食偏好和健康状况精选推荐';
};

/**
 * 生成营养分析
 */
const generateNutritionAnalysis = (recipe: Recipe): string => {
  const { nutrition, calories } = recipe;
  const analysis = [];

  if (nutrition.protein > 15) {
    analysis.push('高蛋白，有助于肌肉维持');
  }
  if (nutrition.fiber > 5) {
    analysis.push('高纤维，促进肠道健康');
  }
  if (nutrition.fat < 10) {
    analysis.push('低脂肪，适合控制体重');
  }
  if (calories < 200) {
    analysis.push('低热量，不易发胖');
  }

  return analysis.length > 0 ? analysis.join('；') : '营养均衡，适合日常食用';
};

/**
 * 计算食材总价
 */
export const calculateIngredientsPrice = (
  ingredients: Ingredient[],
  applyDiscount: boolean = false
): { originalPrice: number; discountPrice: number } => {
  let originalPrice = 0;
  let discountPrice = 0;

  ingredients.forEach(item => {
    const price = item.price || 0;
    originalPrice += price;
    discountPrice += applyDiscount && item.discountPrice ? item.discountPrice : price;
  });

  return {
    originalPrice: Math.round(originalPrice * 100) / 100,
    discountPrice: Math.round(discountPrice * 100) / 100,
  };
};

/**
 * 获取单个菜谱详情
 */
export const getRecipeById = async (recipeId: string): Promise<Recipe | null> => {
  const recipe = MOCK_RECIPES.find(r => r.id === recipeId);
  return recipe || null;
};

// 轮播食谱类型（简化版，用于轮播展示）
export interface SliderRecipe {
  id: string;
  name: string;
  image: string;
  cookingTime: number;
  calories: number;
  mealPlanId: string;
  mealPlanName: string;
  tags: string[];
}

/**
 * 获取轮播推荐食谱列表
 * 用于养生页面顶部轮播展示
 */
export const getSliderRecipes = async (): Promise<SliderRecipe[]> => {
  // 返回所有菜谱的简化版本
  return MOCK_RECIPES.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    cookingTime: recipe.cookingTime,
    calories: recipe.calories,
    mealPlanId: recipe.mealPlanId,
    mealPlanName: recipe.mealPlanName,
    tags: recipe.tags,
  }));
};

export default {
  getDailyRecipes,
  calculateIngredientsPrice,
  getRecipeById,
  getSliderRecipes,
};
