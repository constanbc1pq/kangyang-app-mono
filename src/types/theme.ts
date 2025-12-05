/**
 * 主题专区类型定义
 * 养页面限时内容活动页数据结构
 */

// 主题类型
export interface Theme {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  hostName: string;
  hostAvatar: string;
  hostTitle: string;
  startDate: string;
  endDate: string;
  description?: string; // 主持人开场语
  relatedColumnIds: string[]; // 关联的栏目
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 主题内容
export interface ThemeContent {
  id: string;
  themeId: string;
  title: string;
  type: 'article' | 'video' | 'recipe';
  coverImage?: string;
  order: number; // 排序
  sourceContentId?: string; // 关联的栏目内容ID（可选）
  createdAt: string;
}

// 主题商品
export interface ThemeProduct {
  id: string;
  themeId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit: string;
  description?: string;
  order: number;
}

// 主题数据存储结构
export interface ThemeData {
  themes: Theme[];
  themeContents: ThemeContent[];
  themeProducts: ThemeProduct[];
  version: string;
  lastModified: string;
}

// 默认主题数据
export const DEFAULT_THEME_DATA: ThemeData = {
  themes: [],
  themeContents: [],
  themeProducts: [],
  version: '1.0.0',
  lastModified: new Date().toISOString(),
};
