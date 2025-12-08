/**
 * Feed入口橱窗服务
 *
 * 提供养页面Feed区域的数据
 * 包括：入口卡片、排行榜、限时活动
 * 数据来源：从各个服务的 LocalStorage 动态读取
 */

import {
  FeedEntry,
  RankingList,
  HotSalesItem,
  PopularExpertItem,
  HotTopicItem,
  NearbyServiceItem,
  Activity,
} from '@/types/feed';
import { getColumnData } from './columnService';
import { getDoctors } from './privateDoctorService';
import { groceryProducts, flashSaleProducts, GroceryProduct } from '@/data/groceryProducts';

// ==================== Mock数据 ====================

/**
 * 大Banner和入口卡片Mock数据
 */
const MOCK_FEED_ENTRIES: FeedEntry[] = [
  // 大Banner - 主打主题
  {
    id: 'banner-1',
    type: 'banner',
    title: '大雪进补季',
    subtitle: '顺时而食，温暖过冬',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    badge: '本周主题',
    targetType: 'theme',
    targetId: 'theme-daxue',
    order: 1,
  },
  // 双列卡片
  {
    id: 'card-1',
    type: 'card',
    title: '暖冬汤羹',
    subtitle: '12款家常暖汤',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    targetType: 'column',
    targetId: 'dining-hall',
    order: 2,
  },
  {
    id: 'card-2',
    type: 'card',
    title: '冬季护心课',
    subtitle: '陈医生主讲',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
    targetType: 'column',
    targetId: 'famous-doctor',
    order: 3,
  },
  {
    id: 'card-3',
    type: 'card',
    title: '居家照护手册',
    subtitle: '冬季护理要点',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400',
    targetType: 'column',
    targetId: 'care-academy',
    order: 4,
  },
  {
    id: 'card-4',
    type: 'card',
    title: '银发保障计划',
    subtitle: '健康保障规划',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    targetType: 'column',
    targetId: 'worry-free',
    order: 5,
  },
  // 中Banner - 次推主题
  {
    id: 'banner-2',
    type: 'banner',
    title: '冬季防跌倒',
    subtitle: '平安过冬指南',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    badge: '安全专题',
    targetType: 'theme',
    targetId: 'theme-fall-prevention',
    order: 10,
  },
];



/**
 * 附近商家榜Mock数据
 */
const MOCK_NEARBY_SERVICES: NearbyServiceItem[] = [
  {
    rank: 1,
    id: 'merchant-1',
    name: '悦养堂养生馆',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    merchantType: 'wellness',
    rating: 4.9,
    reviewCount: 1286,
    distance: 850,
    priceRange: '¥158-388',
    tags: ['环境好', '技师专业'],
    isOpen: true,
  },
  {
    rank: 2,
    id: 'merchant-2',
    name: '清心茶舍',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    merchantType: 'teahouse',
    rating: 4.8,
    reviewCount: 892,
    distance: 1200,
    priceRange: '¥68-168',
    tags: ['茶品正宗', '雅致环境'],
    isOpen: true,
  },
  {
    rank: 3,
    id: 'merchant-3',
    name: '舒活理疗中心',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400',
    merchantType: 'massage',
    rating: 4.8,
    reviewCount: 756,
    distance: 1800,
    priceRange: '¥128-298',
    tags: ['手法专业', '服务周到'],
    isOpen: true,
  },
  {
    rank: 4,
    id: 'merchant-4',
    name: '同仁堂国医馆',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400',
    merchantType: 'tcm',
    rating: 4.9,
    reviewCount: 2156,
    distance: 2300,
    priceRange: '¥200-500',
    tags: ['名医坐诊', '百年老店'],
    isOpen: false,
  },
  {
    rank: 5,
    id: 'merchant-5',
    name: '银龄健身中心',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    merchantType: 'fitness',
    rating: 4.7,
    reviewCount: 568,
    distance: 2800,
    priceRange: '¥99-199/月',
    tags: ['适老设施', '专业教练'],
    isOpen: true,
  },
];

/**
 * 限时活动Mock数据
 */
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'activity-1',
    title: '膏方节',
    subtitle: '名医定制膏方',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400',
    badge: '限时',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    targetType: 'theme',
    targetId: 'theme-gaofang',
  },
  {
    id: 'activity-2',
    title: '冬令体检',
    subtitle: '特惠专场',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    badge: '特惠',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    targetType: 'external',
    targetId: 'checkup',
  },
  {
    id: 'activity-3',
    title: '营养师1对1',
    subtitle: '首次免费',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    badge: '新客专享',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    targetType: 'expert',
    targetId: 'nutritionist-1',
  },
];

// ==================== 服务函数 ====================

/**
 * 获取Feed入口列表
 */
export const getFeedEntries = async (): Promise<FeedEntry[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_FEED_ENTRIES.sort((a, b) => a.order - b.order);
};

/**
 * 获取主Banner
 */
export const getMainBanner = async (): Promise<FeedEntry | null> => {
  const entries = await getFeedEntries();
  return entries.find((e) => e.type === 'banner' && e.order === 1) || null;
};

/**
 * 获取次级Banner
 */
export const getSecondaryBanner = async (): Promise<FeedEntry | null> => {
  const entries = await getFeedEntries();
  return entries.find((e) => e.type === 'banner' && e.order > 1) || null;
};

/**
 * 获取入口卡片列表
 */
export const getEntryCards = async (): Promise<FeedEntry[]> => {
  const entries = await getFeedEntries();
  return entries.filter((e) => e.type === 'card');
};

/**
 * 获取热销榜
 * 从闪送到家的商品数据中读取，按销量排序
 * 数据来源：groceryProducts.ts（实际存在的商品数据）
 */
export const getHotSalesRanking = async (): Promise<RankingList> => {
  // 合并常规商品和秒杀商品
  const allProducts: GroceryProduct[] = [...groceryProducts, ...flashSaleProducts];

  // 按销量排序，取前10个
  const sortedProducts = allProducts
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 10);

  // 转换为HotSalesItem格式
  const hotSalesItems: HotSalesItem[] = sortedProducts.map((product, index) => ({
    rank: index + 1,
    id: `prod_${product.id}`,  // 添加prod_前缀以便路由识别
    name: product.name,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    salesCount: product.sales || 0,
    unit: product.unit,
    itemType: 'product',
  }));

  return {
    id: 'ranking-hot-sales',
    type: 'hotSales',
    title: '本周热销',
    items: hotSalesItems,
    updateTime: new Date().toISOString(),
    moreLink: 'RankingDetail?type=hotSales',
  };
};

/**
 * 获取预约榜
 * 从私人医生数据中读取，按会员数排序
 */
export const getPopularExpertsRanking = async (): Promise<RankingList> => {
  // 从 LocalStorage 获取医生数据
  const doctors = await getDoctors();

  // 按会员数排序，取前5个
  const sortedDoctors = doctors
    .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
    .slice(0, 5);

  // 职称映射
  const titleLabels: Record<string, string> = {
    chief_physician: '主任医师',
    associate_chief: '副主任医师',
    attending: '主治医师',
  };

  // 转换为 PopularExpertItem 格式
  const expertItems: PopularExpertItem[] = sortedDoctors.map((doctor, index) => ({
    rank: index + 1,
    id: doctor.id,
    name: doctor.name,
    avatar: doctor.avatar,
    title: titleLabels[doctor.title] || doctor.title,
    hospital: doctor.hospital.name,
    availableSlots: doctor.isOnline ? Math.floor(Math.random() * 10) + 1 : -1,
    isOnline: doctor.isOnline,
  }));

  return {
    id: 'ranking-popular-experts',
    type: 'popularExperts',
    title: '最受欢迎的专家',
    items: expertItems,
    updateTime: new Date().toISOString(),
    moreLink: 'RankingDetail?type=popularExperts',
  };
};

/**
 * 获取热门榜
 * 从栏目文章中读取，按浏览量排序
 */
export const getHotTopicsRanking = async (): Promise<RankingList> => {
  // 从 LocalStorage 获取栏目文章数据
  const columnData = await getColumnData();

  // 按浏览量排序，取前5个
  const sortedContents = columnData.contents
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  // 转换为 HotTopicItem 格式
  const topicItems: HotTopicItem[] = sortedContents.map((content, index) => ({
    rank: index + 1,
    id: content.id,
    name: content.title,
    author: content.author.name,
    viewCount: content.viewCount,
    type: 'article' as const,  // 栏目内容都是文章类型
  }));

  return {
    id: 'ranking-hot-topics',
    type: 'hotTopics',
    title: '大家都在看',
    items: topicItems,
    updateTime: new Date().toISOString(),
    moreLink: 'RankingDetail?type=hotTopics',
  };
};

/**
 * 获取附近商家榜
 */
export const getNearbyServicesRanking = async (): Promise<RankingList> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    id: 'ranking-nearby-services',
    type: 'nearbyServices',
    title: '附近好评商家',
    items: MOCK_NEARBY_SERVICES,
    updateTime: new Date().toISOString(),
    moreLink: 'RankingDetail?type=nearbyServices',
  };
};

/**
 * 获取限时活动
 */
export const getActivities = async (): Promise<Activity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const now = new Date();
  // 过滤出进行中的活动
  return MOCK_ACTIVITIES.filter((activity) => {
    const start = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    return now >= start && now <= end;
  });
};

/**
 * 格式化数字显示
 * 如: 123000 -> "12.3万"
 */
export const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
};
