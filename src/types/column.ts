/**
 * 栏目类型定义
 * 养页面内容平台核心数据结构
 */

// 内容类型枚举
export type ContentType = 'article' | 'video' | 'recipe' | 'story';

// 栏目图标类型
export type ColumnIcon =
  | 'Leaf' // 时令养生
  | 'Stethoscope' // 名医说
  | 'ChefHat' // 膳食堂
  | 'BookOpen' // 照护学堂
  | 'Shield' // 晚年无忧
  | 'Sparkles'; // 银发生活家

// 栏目定义
export interface Column {
  id: string;
  name: string;
  icon: ColumnIcon;
  description: string;
  hostName: string;
  hostAvatar: string;
  hostTitle: string;
  catchphrase?: string; // 口头禅
  contentCount: number;
  viewCount: number;
  relatedServices: string[]; // 关联服务ID
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// 内容作者
export interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  verified: boolean;
}

// 栏目内容
export interface ColumnContent {
  id: string;
  columnId: string;
  title: string;
  summary: string;
  type: ContentType;
  coverImage: string;
  author: ContentAuthor;
  publishTime: string;
  readTime?: string; // 阅读时长
  duration?: string; // 视频时长
  viewCount: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  tags: string[];
  // 关联商品/服务
  relatedProducts?: RelatedProduct[];
  relatedServiceId?: string;
  // 食谱专属字段
  cookingTime?: number;
  calories?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  // 内容详情
  content?: string;
  expertTip?: string; // 专家观点
  isFeatured?: boolean;
  seriesId?: string; // 所属系列
  seriesName?: string;
  createdAt: string;
  updatedAt: string;
}

// 关联商品
export interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating?: number;        // 评分
  salesCount?: number;    // 销量
  isInternal: boolean;    // 是否为本app内商品（可跳转购买）
  internalType?: 'product' | 'meal_plan' | 'service';  // 内部商品类型
  internalId?: string;    // 内部商品ID，用于跳转
}

// 内容系列
export interface ContentSeries {
  id: string;
  columnId: string;
  name: string;
  description: string;
  coverImage: string;
  contentIds: string[];
  createdAt: string;
}

// 栏目数据存储结构
export interface ColumnData {
  columns: Column[];
  contents: ColumnContent[];
  series: ContentSeries[];
  version: string;
  lastModified: string;
}

// 默认栏目数据
export const DEFAULT_COLUMN_DATA: ColumnData = {
  columns: [],
  contents: [],
  series: [],
  version: '1.0.0',
  lastModified: new Date().toISOString(),
};
