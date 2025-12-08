/**
 * Feed入口橱窗 - 类型定义
 *
 * 定位: Feed是入口橱窗，吸引用户点击进入主题详情页，不是内容阅读区
 */

// ==================== 入口卡片 ====================

/**
 * 入口类型
 */
export type FeedEntryType = 'banner' | 'card' | 'activity';

/**
 * 跳转目标类型
 */
export type TargetType = 'theme' | 'column' | 'product' | 'expert' | 'article' | 'external';

/**
 * Feed入口卡片
 */
export interface FeedEntry {
  id: string;
  type: FeedEntryType;
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;              // 角标文字 "本周主题" "限时" "热门"
  targetType: TargetType;
  targetId: string;
  order: number;               // 排序
  startDate?: string;          // 开始时间 (限时活动)
  endDate?: string;            // 结束时间 (限时活动)
}

// ==================== 排行榜 ====================

/**
 * 排行榜类型
 */
export type RankingType = 'hotSales' | 'popularExperts' | 'hotTopics' | 'nearbyServices';

/**
 * 排行榜
 */
export interface RankingList {
  id: string;
  type: RankingType;
  title: string;
  icon?: string;
  items: RankingItem[];
  updateTime: string;          // 更新时间
  moreLink?: string;           // 查看更多链接
}

/**
 * 排行榜项 - 热销商品/服务
 */
export interface HotSalesItem {
  rank: number;
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  salesCount: number;          // 销量
  unit?: string;               // 单位 "份" "罐" "袋"
  itemType?: 'product' | 'meal_plan' | 'service';  // 商品类型：商品/套餐/服务
}

/**
 * 排行榜项 - 热门专家
 */
export interface PopularExpertItem {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  title: string;               // 职称/科室
  hospital?: string;
  availableSlots: number;      // 剩余预约位 (-1表示约满)
  isOnline?: boolean;
}

/**
 * 排行榜项 - 热门主题
 */
export interface HotTopicItem {
  rank: number;
  id: string;
  name: string;
  author?: string;             // 主理人
  viewCount: number;           // 阅读/学习人数
  type: 'theme' | 'article' | 'column';
}

/**
 * 排行榜项 - 附近商家
 */
export interface NearbyServiceItem {
  rank: number;
  id: string;
  name: string;
  image: string;                 // 商家封面图
  merchantType: 'wellness' | 'teahouse' | 'massage' | 'tcm' | 'fitness' | 'spa';
  rating: number;                // 评分
  reviewCount: number;           // 评价数
  distance: number;              // 距离(米)
  priceRange?: string;           // 人均消费 "¥100-200"
  tags?: string[];               // 标签 ["环境好", "服务好"]
  isOpen?: boolean;              // 是否营业中
}

/**
 * 排行榜项联合类型
 */
export type RankingItem = HotSalesItem | PopularExpertItem | HotTopicItem | NearbyServiceItem;

// ==================== 限时活动 ====================

/**
 * 限时活动
 */
export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;              // "限时" "新品" "特惠"
  startDate: string;
  endDate: string;
  targetType: TargetType;
  targetId: string;
}

// ==================== 类型守卫 ====================

export const isHotSalesItem = (item: RankingItem): item is HotSalesItem => {
  return 'salesCount' in item && 'price' in item;
};

export const isPopularExpertItem = (item: RankingItem): item is PopularExpertItem => {
  return 'availableSlots' in item && 'title' in item;
};

export const isHotTopicItem = (item: RankingItem): item is HotTopicItem => {
  return 'viewCount' in item && 'type' in item;
};

export const isNearbyServiceItem = (item: RankingItem): item is NearbyServiceItem => {
  return 'merchantType' in item && 'distance' in item;
};
