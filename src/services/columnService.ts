/**
 * 栏目服务
 * 管理养页面的6大内容栏目及其内容
 * 使用AsyncStorage存储数据
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Column,
  ColumnContent,
  ContentSeries,
  ColumnData,
  ContentType,
  RelatedProduct,
} from '@/types/column';

const COLUMN_DATA_KEY = '@kangyang_column_data';

/**
 * 初始化6大栏目数据
 */
const initializeDefaultColumns = (): Column[] => {
  const now = new Date().toISOString();

  return [
    {
      id: 'seasonal-wellness',
      name: '时令养生',
      icon: 'Leaf',
      description: '顺时而养，事半功倍',
      hostName: '陈医生',
      hostAvatar: 'local:doctor_001',
      hostTitle: '中医养生专家',
      catchphrase: '顺时而养，事半功倍',
      contentCount: 128,
      viewCount: 320000,
      relatedServices: ['nutrition', 'delivery'],
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'famous-doctor',
      name: '名医说',
      icon: 'Stethoscope',
      description: '三甲名医的健康课堂',
      hostName: '名医团队',
      hostAvatar: 'local:doctor_002',
      hostTitle: '各科名医轮流坐诊',
      contentCount: 256,
      viewCount: 890000,
      relatedServices: ['doctor'],
      coverImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'dining-hall',
      name: '膳食堂',
      icon: 'ChefHat',
      description: '烟火气里的健康味道',
      hostName: '李营养师',
      hostAvatar: 'local:doctor_003',
      hostTitle: '注册营养师',
      catchphrase: '好吃又健康，其实很简单',
      contentCount: 512,
      viewCount: 1200000,
      relatedServices: ['nutrition', 'delivery'],
      coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'care-academy',
      name: '照护学堂',
      icon: 'BookOpen',
      description: '照顾好自己，也是爱家人',
      hostName: '张护士长',
      hostAvatar: 'local:doctor_004',
      hostTitle: '资深护理专家',
      catchphrase: '照顾好自己，也是爱家人',
      contentCount: 86,
      viewCount: 150000,
      relatedServices: ['elderly'],
      coverImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'worry-free',
      name: '晚年无忧',
      icon: 'Shield',
      description: '有备无患，从容养老',
      hostName: '刘律师',
      hostAvatar: 'local:lawyer_001',
      hostTitle: '资深家事律师',
      contentCount: 64,
      viewCount: 98000,
      relatedServices: ['legal', 'insurance'],
      coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'silver-life',
      name: '银发生活家',
      icon: 'Sparkles',
      description: '退休后的精彩人生',
      hostName: '银发达人',
      hostAvatar: 'local:avatar_001',
      hostTitle: '真实用户故事',
      contentCount: 168,
      viewCount: 560000,
      relatedServices: [],
      coverImage: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

/**
 * 初始化栏目内容数据
 *
 * 内容话术原则：
 * - 不使用"您一定要..."、"赶紧..."等催促话术
 * - 不使用"亲"、"宝"等假亲切称呼
 * - 用陈述和分享代替推销和引导
 * - 服务露出自然融入内容末尾，点到为止
 * - 情绪价值优先，实用价值为辅
 */
const initializeDefaultContents = (): ColumnContent[] => {
  const now = new Date().toISOString();

  return [
    // ========== 时令养生栏目 (知识分享型，不带推销) ==========
    {
      id: 'content_001',
      columnId: 'seasonal-wellness',
      title: '大雪节气的身体密码',
      summary: '古人说"大雪封河"，这时节万物收藏。身体也在悄悄调整节奏，有些变化值得留意。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800',
      author: {
        id: 'author_001',
        name: '陈医生',
        avatar: 'local:doctor_001',
        title: '中医养生专家',
        verified: true,
      },
      publishTime: '2024-12-06',
      readTime: '5分钟',
      viewCount: 32000,
      likeCount: 1280,
      commentCount: 156,
      collectCount: 892,
      tags: ['大雪', '节气', '冬季'],
      expertTip: '这个时节，早睡晚起顺应自然规律，饮食温和一些，身体会舒服很多。',
      isFeatured: true,
      relatedProducts: [
        {
          id: 'rp_001',
          name: '当归生姜羊肉汤料包',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200',
          price: 38,
          originalPrice: 48,
          unit: '包',
          rating: 4.9,
          salesCount: 2680,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_soup_001',
        },
        {
          id: 'rp_002',
          name: '艾草暖宫贴',
          image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=200',
          price: 29,
          unit: '盒',
          rating: 4.8,
          salesCount: 1560,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_002',
      columnId: 'seasonal-wellness',
      title: '早上七点到九点，胃最需要你',
      summary: '中医讲"辰时胃经当令"。这个时间段，一碗温热的粥，比什么补品都管用。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800',
      author: {
        id: 'author_001',
        name: '陈医生',
        avatar: 'local:doctor_001',
        title: '中医养生专家',
        verified: true,
      },
      publishTime: '2024-12-05',
      readTime: '4分钟',
      viewCount: 28000,
      likeCount: 980,
      commentCount: 89,
      collectCount: 654,
      tags: ['时辰', '养胃', '早餐'],
      relatedProducts: [
        {
          id: 'rp_003',
          name: '养胃小米粥套餐（7日装）',
          image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=200',
          price: 128,
          originalPrice: 168,
          unit: '套',
          rating: 4.9,
          salesCount: 3200,
          isInternal: true,
          internalType: 'meal_plan',
          internalId: 'meal_stomach_care',
        },
        {
          id: 'rp_004',
          name: '山药薏米粉',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200',
          price: 45,
          unit: '罐',
          rating: 4.7,
          salesCount: 890,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_011',
      columnId: 'seasonal-wellness',
      title: '手脚冰凉这件小事',
      summary: '每年入冬，总有人说"我天生怕冷"。其实体质是可以慢慢调的，不必着急。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=800',
      author: {
        id: 'author_001',
        name: '陈医生',
        avatar: 'local:doctor_001',
        title: '中医养生专家',
        verified: true,
      },
      publishTime: '2024-12-04',
      readTime: '6分钟',
      viewCount: 24000,
      likeCount: 1100,
      commentCount: 98,
      collectCount: 720,
      tags: ['体质', '阳虚', '调理'],
      relatedProducts: [
        {
          id: 'rp_005',
          name: '红枣桂圆枸杞茶',
          image: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=200',
          price: 58,
          originalPrice: 78,
          unit: '盒',
          rating: 4.8,
          salesCount: 4560,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_tea_001',
        },
        {
          id: 'rp_006',
          name: '电热暖脚器',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
          price: 159,
          unit: '个',
          rating: 4.6,
          salesCount: 780,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },

    // ========== 名医说栏目 (专业陪伴型，循序渐进) ==========
    {
      id: 'content_003',
      columnId: 'famous-doctor',
      title: '血压在冬天会"任性"一些',
      summary: '气温下降，血管收缩，血压容易波动。了解这个规律，心里就有数了。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
      author: {
        id: 'author_002',
        name: '王主任',
        avatar: 'local:doctor_002',
        title: '心内科主任医师',
        verified: true,
      },
      publishTime: '2024-12-04',
      readTime: '6分钟',
      viewCount: 45000,
      likeCount: 2100,
      commentCount: 234,
      collectCount: 1560,
      tags: ['高血压', '冬季', '心血管'],
      expertTip: '冬天测血压，建议在温暖的室内，休息5分钟后再测。早晚各一次，记录下来，复诊时带给医生看。',
      isFeatured: true,
      relatedProducts: [
        {
          id: 'rp_007',
          name: '欧姆龙电子血压计',
          image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200',
          price: 299,
          originalPrice: 399,
          unit: '台',
          rating: 4.9,
          salesCount: 8900,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_bp_001',
        },
        {
          id: 'rp_008',
          name: '私人医生服务（心血管专项）',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
          price: 1980,
          unit: '年',
          rating: 5.0,
          salesCount: 256,
          isInternal: true,
          internalType: 'service',
          internalId: 'service_doctor_cardio',
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_004',
      columnId: 'famous-doctor',
      title: '糖友的冬天，进补也讲分寸',
      summary: '冬令进补是老传统，但血糖需要照顾。两者之间，有一些平衡的方法。',
      type: 'video',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      author: {
        id: 'author_003',
        name: '李教授',
        avatar: 'local:doctor_005',
        title: '内分泌科主任',
        verified: true,
      },
      publishTime: '2024-12-03',
      duration: '12:30',
      viewCount: 38000,
      likeCount: 1890,
      commentCount: 178,
      collectCount: 1230,
      tags: ['糖尿病', '饮食', '冬季'],
      relatedProducts: [
        {
          id: 'rp_009',
          name: '糖友专属营养套餐',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200',
          price: 198,
          originalPrice: 258,
          unit: '周',
          rating: 4.8,
          salesCount: 1560,
          isInternal: true,
          internalType: 'meal_plan',
          internalId: 'meal_diabetes_care',
        },
        {
          id: 'rp_010',
          name: '血糖监测仪',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200',
          price: 199,
          unit: '套',
          rating: 4.7,
          salesCount: 3200,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_012',
      columnId: 'famous-doctor',
      title: '膝盖疼的老朋友，冬天记得给它保暖',
      summary: '关节像一部老机器，天冷了转动会有些涩。保暖和适度活动，都是在帮它。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      author: {
        id: 'author_009',
        name: '赵主任',
        avatar: 'local:doctor_006',
        title: '骨科主任医师',
        verified: true,
      },
      publishTime: '2024-12-02',
      readTime: '5分钟',
      viewCount: 31000,
      likeCount: 1560,
      commentCount: 145,
      collectCount: 980,
      tags: ['关节', '骨科', '保暖'],
      relatedProducts: [
        {
          id: 'rp_011',
          name: '发热护膝（一对装）',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
          price: 89,
          originalPrice: 129,
          unit: '对',
          rating: 4.8,
          salesCount: 5680,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_knee_001',
        },
        {
          id: 'rp_012',
          name: '氨糖软骨素钙片',
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
          price: 168,
          unit: '瓶',
          rating: 4.6,
          salesCount: 2340,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },

    // ========== 膳食堂栏目 (生活记录型，有烟火气) ==========
    {
      id: 'content_005',
      columnId: 'dining-hall',
      title: '这碗羊肉汤，母亲每年冬天都会炖',
      summary: '当归、生姜、羊肉，简单的三样食材。炖上两个小时，整个屋子都是暖的。',
      type: 'recipe',
      coverImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      author: {
        id: 'author_004',
        name: '李营养师',
        avatar: 'local:doctor_003',
        title: '注册营养师',
        verified: true,
      },
      publishTime: '2024-12-05',
      cookingTime: 90,
      calories: 280,
      difficulty: 'medium',
      viewCount: 56000,
      likeCount: 3200,
      commentCount: 456,
      collectCount: 2890,
      tags: ['羊肉汤', '冬季', '家常'],
      isFeatured: true,
      relatedProducts: [
        {
          id: 'rp_013',
          name: '内蒙古羔羊肉卷（500g）',
          image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200',
          price: 68,
          originalPrice: 88,
          unit: '份',
          rating: 4.9,
          salesCount: 1280,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_lamb_001',
        },
        {
          id: 'rp_014',
          name: '当归生姜调料包',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
          price: 18,
          unit: '包',
          rating: 4.8,
          salesCount: 2560,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_spice_001',
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_006',
      columnId: 'dining-hall',
      title: '一个人吃饭，也值得认真对待',
      summary: '番茄炒蛋盖在米饭上，红黄白三色。十分钟，一顿有滋有味的饭。',
      type: 'recipe',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      author: {
        id: 'author_004',
        name: '李营养师',
        avatar: 'local:doctor_003',
        title: '注册营养师',
        verified: true,
      },
      publishTime: '2024-12-04',
      cookingTime: 10,
      calories: 420,
      difficulty: 'easy',
      viewCount: 42000,
      likeCount: 2560,
      commentCount: 312,
      collectCount: 1980,
      tags: ['一人食', '快手', '简单'],
      seriesId: 'series_001',
      seriesName: '一人食系列',
      relatedProducts: [
        {
          id: 'rp_015',
          name: '一人食营养套餐（5日装）',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
          price: 158,
          originalPrice: 198,
          unit: '套',
          rating: 4.9,
          salesCount: 3680,
          isInternal: true,
          internalType: 'meal_plan',
          internalId: 'meal_single_5days',
        },
        {
          id: 'rp_016',
          name: '迷你电饭煲（1-2人）',
          image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=200',
          price: 199,
          unit: '个',
          rating: 4.7,
          salesCount: 1890,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_013',
      columnId: 'dining-hall',
      title: '小米粥熬得好，是有讲究的',
      summary: '水开下米，小火慢熬，最后那层米油，才是精华。老一辈人都懂。',
      type: 'recipe',
      coverImage: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800',
      author: {
        id: 'author_004',
        name: '李营养师',
        avatar: 'local:doctor_003',
        title: '注册营养师',
        verified: true,
      },
      publishTime: '2024-12-03',
      cookingTime: 40,
      calories: 150,
      difficulty: 'easy',
      viewCount: 35000,
      likeCount: 2100,
      commentCount: 267,
      collectCount: 1650,
      tags: ['小米粥', '养胃', '早餐'],
      relatedProducts: [
        {
          id: 'rp_017',
          name: '陕北小米（2.5kg装）',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200',
          price: 49,
          originalPrice: 69,
          unit: '袋',
          rating: 4.9,
          salesCount: 6780,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_millet_001',
        },
        {
          id: 'rp_018',
          name: '养生粥料组合包',
          image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=200',
          price: 38,
          unit: '包',
          rating: 4.8,
          salesCount: 2340,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_porridge_001',
        },
      ],
      createdAt: now,
      updatedAt: now,
    },

    // ========== 照护学堂栏目 (经验分享型，真实朴素) ==========
    {
      id: 'content_007',
      columnId: 'care-academy',
      title: '老人摔倒了，先别急着扶',
      summary: '第一反应想去扶，这份心情能理解。但有时候，观察几秒钟更重要。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800',
      author: {
        id: 'author_005',
        name: '张护士长',
        avatar: 'local:doctor_004',
        title: '资深护理专家',
        verified: true,
      },
      publishTime: '2024-12-03',
      readTime: '5分钟',
      viewCount: 21000,
      likeCount: 980,
      commentCount: 67,
      collectCount: 1560,
      tags: ['跌倒', '急救', '安全'],
      isFeatured: true,
      relatedProducts: [
        {
          id: 'rp_019',
          name: '防滑拐杖（可调节高度）',
          image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=200',
          price: 128,
          originalPrice: 168,
          unit: '根',
          rating: 4.9,
          salesCount: 3450,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_cane_001',
        },
        {
          id: 'rp_020',
          name: '居家陪护服务（按天）',
          image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=200',
          price: 280,
          unit: '天',
          rating: 4.9,
          salesCount: 1260,
          isInternal: true,
          internalType: 'service',
          internalId: 'service_care_daily',
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_014',
      columnId: 'care-academy',
      title: '照顾家人，也记得照顾自己',
      summary: '长期照护是场持久战。累了就歇一歇，这不是自私，是为了走更远的路。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
      author: {
        id: 'author_005',
        name: '张护士长',
        avatar: 'local:doctor_004',
        title: '资深护理专家',
        verified: true,
      },
      publishTime: '2024-12-01',
      readTime: '6分钟',
      viewCount: 18000,
      likeCount: 1200,
      commentCount: 89,
      collectCount: 890,
      tags: ['照护者', '心理', '自我关怀'],
      relatedProducts: [
        {
          id: 'rp_021',
          name: '喘息服务（临时托护）',
          image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200',
          price: 380,
          unit: '天',
          rating: 4.8,
          salesCount: 680,
          isInternal: true,
          internalType: 'service',
          internalId: 'service_respite',
        },
        {
          id: 'rp_022',
          name: '颈椎按摩仪',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200',
          price: 299,
          unit: '台',
          rating: 4.7,
          salesCount: 2340,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },

    // ========== 晚年无忧栏目 (娓娓道来型，不贩卖焦虑) ==========
    {
      id: 'content_008',
      columnId: 'worry-free',
      title: '关于遗嘱，想说几句心里话',
      summary: '很多人觉得这是个沉重的话题。换个角度看，它其实是一份对家人的交代和心意。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      author: {
        id: 'author_006',
        name: '刘律师',
        avatar: 'local:lawyer_001',
        title: '资深家事律师',
        verified: true,
      },
      publishTime: '2024-12-02',
      readTime: '7分钟',
      viewCount: 15000,
      likeCount: 560,
      commentCount: 89,
      collectCount: 780,
      tags: ['遗嘱', '法律', '家庭'],
      relatedProducts: [
        {
          id: 'rp_023',
          name: '法律咨询服务（遗嘱专项）',
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200',
          price: 298,
          unit: '次',
          rating: 4.9,
          salesCount: 890,
          isInternal: true,
          internalType: 'service',
          internalId: 'service_legal_will',
        },
        {
          id: 'rp_024',
          name: '家庭法律顾问年卡',
          image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200',
          price: 1980,
          originalPrice: 2580,
          unit: '年',
          rating: 5.0,
          salesCount: 256,
          isInternal: true,
          internalType: 'service',
          internalId: 'service_legal_annual',
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_015',
      columnId: 'worry-free',
      title: '接到陌生电话，不妨多想三秒',
      summary: '分享几个常见的套路，知道了就不容易上当。转给家里老人看看也好。',
      type: 'article',
      coverImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800',
      author: {
        id: 'author_006',
        name: '刘律师',
        avatar: 'local:lawyer_001',
        title: '资深家事律师',
        verified: true,
      },
      publishTime: '2024-11-30',
      readTime: '5分钟',
      viewCount: 28000,
      likeCount: 1800,
      commentCount: 156,
      collectCount: 1200,
      tags: ['防骗', '安全', '常识'],
      isFeatured: true,
      relatedProducts: [
        {
          id: 'rp_025',
          name: '老年防诈骗指南（电子版）',
          image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=200',
          price: 0,
          unit: '份',
          rating: 4.9,
          salesCount: 12800,
          isInternal: true,
          internalType: 'product',
          internalId: 'prod_guide_fraud',
        },
        {
          id: 'rp_026',
          name: '来电防骚扰服务',
          image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=200',
          price: 9.9,
          unit: '月',
          rating: 4.5,
          salesCount: 3560,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },

    // ========== 银发生活家栏目 (情感共鸣型，含蓄内敛) ==========
    {
      id: 'content_009',
      columnId: 'silver-life',
      title: '六十岁那年，我报了瑜伽班',
      summary: '当时只是想活动活动筋骨。没想到，这一练就是十二年，还交到了一群好朋友。',
      type: 'story',
      coverImage: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800',
      author: {
        id: 'author_007',
        name: '王奶奶',
        avatar: 'local:avatar_002',
        title: '社区瑜伽达人',
        verified: false,
      },
      publishTime: '2024-12-01',
      readTime: '8分钟',
      viewCount: 68000,
      likeCount: 4500,
      commentCount: 678,
      collectCount: 2340,
      tags: ['瑜伽', '退休', '坚持'],
      isFeatured: true,
      relatedProducts: [
        {
          id: 'rp_027',
          name: '中老年瑜伽垫（加厚防滑）',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
          price: 89,
          originalPrice: 129,
          unit: '张',
          rating: 4.8,
          salesCount: 4560,
          isInternal: false,
        },
        {
          id: 'rp_028',
          name: '银发瑜伽入门课程',
          image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=200',
          price: 99,
          unit: '套',
          rating: 4.9,
          salesCount: 2890,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_010',
      columnId: 'silver-life',
      title: '退休后，我拿起了相机',
      summary: '年轻时忙工作，没时间看风景。现在有时间了，才发现身边处处是美。',
      type: 'story',
      coverImage: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800',
      author: {
        id: 'author_008',
        name: '张叔',
        avatar: 'local:avatar_003',
        title: '摄影爱好者',
        verified: false,
      },
      publishTime: '2024-11-28',
      readTime: '6分钟',
      viewCount: 52000,
      likeCount: 3200,
      commentCount: 456,
      collectCount: 1890,
      tags: ['摄影', '退休', '兴趣'],
      relatedProducts: [
        {
          id: 'rp_029',
          name: '手机摄影支架',
          image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=200',
          price: 49,
          unit: '个',
          rating: 4.7,
          salesCount: 3680,
          isInternal: false,
        },
        {
          id: 'rp_030',
          name: '老年大学摄影班',
          image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=200',
          price: 580,
          unit: '期',
          rating: 4.8,
          salesCount: 890,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content_016',
      columnId: 'silver-life',
      title: '和老伴吵了五十年，还是他最懂我',
      summary: '年轻时觉得他不浪漫，老了才明白，柴米油盐里的陪伴，就是最长情的告白。',
      type: 'story',
      coverImage: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?w=800',
      author: {
        id: 'author_010',
        name: '李奶奶',
        avatar: 'local:avatar_004',
        title: '退休教师',
        verified: false,
      },
      publishTime: '2024-11-25',
      readTime: '7分钟',
      viewCount: 45000,
      likeCount: 3800,
      commentCount: 520,
      collectCount: 2100,
      tags: ['婚姻', '陪伴', '生活'],
      relatedProducts: [
        {
          id: 'rp_031',
          name: '情侣款保温杯（一对装）',
          image: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?w=200',
          price: 128,
          originalPrice: 168,
          unit: '对',
          rating: 4.9,
          salesCount: 5680,
          isInternal: false,
        },
        {
          id: 'rp_032',
          name: '金婚纪念相册定制',
          image: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?w=200',
          price: 198,
          unit: '本',
          rating: 4.9,
          salesCount: 1230,
          isInternal: false,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
};

/**
 * 初始化内容系列
 */
const initializeDefaultSeries = (): ContentSeries[] => {
  const now = new Date().toISOString();

  return [
    {
      id: 'series_001',
      columnId: 'dining-hall',
      name: '一人食系列',
      description: '独居老人的简单营养餐',
      coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      contentIds: ['content_006'],
      createdAt: now,
    },
    {
      id: 'series_002',
      columnId: 'seasonal-wellness',
      name: '二十四节气养生',
      description: '跟着节气学养生',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      contentIds: ['content_001'],
      createdAt: now,
    },
  ];
};

// 当前数据版本 - 更新数据结构时需要递增此版本号
const CURRENT_DATA_VERSION = '1.1.0';

/**
 * 初始化完整的栏目数据
 */
const initializeDefaultColumnData = (): ColumnData => {
  return {
    columns: initializeDefaultColumns(),
    contents: initializeDefaultContents(),
    series: initializeDefaultSeries(),
    version: CURRENT_DATA_VERSION,
    lastModified: new Date().toISOString(),
  };
};

/**
 * 获取栏目数据，如果不存在或版本过旧则初始化
 */
export const getColumnData = async (): Promise<ColumnData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(COLUMN_DATA_KEY);

    if (jsonValue !== null) {
      const data = JSON.parse(jsonValue);
      // 检查版本号，如果版本过旧则重新初始化
      if (data.version !== CURRENT_DATA_VERSION) {
        console.log(`📦 栏目数据版本更新: ${data.version} -> ${CURRENT_DATA_VERSION}`);
        const defaultData = initializeDefaultColumnData();
        await AsyncStorage.setItem(COLUMN_DATA_KEY, JSON.stringify(defaultData));
        return defaultData;
      }
      return data;
    } else {
      // 首次使用，初始化默认数据
      const defaultData = initializeDefaultColumnData();
      await AsyncStorage.setItem(COLUMN_DATA_KEY, JSON.stringify(defaultData));
      console.log('✅ 栏目数据初始化完成');
      return defaultData;
    }
  } catch (error) {
    console.error('获取栏目数据失败:', error);
    return initializeDefaultColumnData();
  }
};

/**
 * 保存栏目数据
 */
export const saveColumnData = async (data: ColumnData): Promise<boolean> => {
  try {
    data.lastModified = new Date().toISOString();
    await AsyncStorage.setItem(COLUMN_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存栏目数据失败:', error);
    return false;
  }
};

/**
 * 获取所有栏目列表
 */
export const getColumns = async (): Promise<Column[]> => {
  const data = await getColumnData();
  return data.columns;
};

/**
 * 获取单个栏目
 */
export const getColumnById = async (columnId: string): Promise<Column | null> => {
  const data = await getColumnData();
  return data.columns.find((c) => c.id === columnId) || null;
};

/**
 * 获取栏目内容列表
 */
export const getColumnContents = async (
  columnId: string,
  options?: {
    type?: ContentType;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<ColumnContent[]> => {
  const data = await getColumnData();
  let contents = data.contents.filter((c) => c.columnId === columnId);

  if (options?.type) {
    contents = contents.filter((c) => c.type === options.type);
  }

  if (options?.featured) {
    contents = contents.filter((c) => c.isFeatured);
  }

  // 按发布时间排序
  contents.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());

  if (options?.offset) {
    contents = contents.slice(options.offset);
  }

  if (options?.limit) {
    contents = contents.slice(0, options.limit);
  }

  return contents;
};

/**
 * 获取单个内容详情
 */
export const getContentById = async (contentId: string): Promise<ColumnContent | null> => {
  const data = await getColumnData();
  return data.contents.find((c) => c.id === contentId) || null;
};

/**
 * 获取精选内容（混合内容流）
 */
export const getFeaturedContents = async (limit: number = 10): Promise<ColumnContent[]> => {
  const data = await getColumnData();
  let contents = data.contents.filter((c) => c.isFeatured);

  // 如果精选内容不够，补充最新内容
  if (contents.length < limit) {
    const remaining = data.contents
      .filter((c) => !c.isFeatured)
      .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
    contents = [...contents, ...remaining].slice(0, limit);
  }

  return contents.slice(0, limit);
};

/**
 * 获取混合内容流（分页）
 */
export const getFeedContents = async (options?: {
  columnId?: string;
  limit?: number;
  offset?: number;
}): Promise<ColumnContent[]> => {
  const data = await getColumnData();
  let contents = [...data.contents];

  if (options?.columnId) {
    contents = contents.filter((c) => c.columnId === options.columnId);
  }

  // 按发布时间排序
  contents.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());

  if (options?.offset) {
    contents = contents.slice(options.offset);
  }

  if (options?.limit) {
    contents = contents.slice(0, options.limit);
  }

  return contents;
};

/**
 * 获取内容系列
 */
export const getSeriesByColumnId = async (columnId: string): Promise<ContentSeries[]> => {
  const data = await getColumnData();
  return data.series.filter((s) => s.columnId === columnId);
};

/**
 * 清除栏目数据（用于重置）
 */
export const clearColumnData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(COLUMN_DATA_KEY);
    console.log('✅ 栏目数据已清除');
    return true;
  } catch (error) {
    console.error('清除栏目数据失败:', error);
    return false;
  }
};

export default {
  getColumns,
  getColumnById,
  getColumnContents,
  getContentById,
  getFeaturedContents,
  getFeedContents,
  getSeriesByColumnId,
  clearColumnData,
};
