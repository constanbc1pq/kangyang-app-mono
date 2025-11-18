/**
 * 社区数据服务 - 处理零工经济众包平台的本地数据管理
 * 使用AsyncStorage存储社区数据
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ServiceJob,
  Expert,
  ServiceOrder,
  ChatConversation,
  ChatMessage,
  SecondHandItem,
  CommunityPost,
  STORAGE_KEYS,
  JobType,
  ServiceType,
  JobStatus,
  ExpertLevel,
  ExpertCertStatus,
  OrderStatus,
  MessageType,
  ConversationRelatedType,
  QuoteStatus,
  ItemCategory,
  ItemCondition,
  TradeMethod,
  ItemStatus,
  PostCategory,
} from '@/types/community';

// ==================== 初始化模拟数据函数 ====================

/**
 * 初始化默认的零工需求数据
 */
const initializeDefaultJobs = (): ServiceJob[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  return [
    {
      id: 'job_001',
      title: '需要一位护理员陪护老人去医院复查',
      description: '母亲今年68岁，患有高血压，需要去医院复查。希望有经验的护理员陪同就医，协助挂号、取药等。',
      jobType: JobType.CARE,
      serviceType: ServiceType.ACCOMPANY_DOCTOR,
      employerId: 'user_001',
      employerName: '李明',
      employerAvatar: '👨',
      location: {
        address: '南山区科技园',
        district: '南山区',
        latitude: 39.9093,
        longitude: 116.4578,
      },
      serviceTime: '明天上午9:00-12:00',
      duration: '3小时',
      budget: {
        min: 150,
        max: 200,
        currency: '¥',
      },
      requirements: ['有陪诊经验', '熟悉医院流程', '耐心细致'],
      images: ['https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop&q=80'], // 医疗陪护场景
      relatedMemberId: 'member_002', // 关联母亲
      healthTags: ['高血压'],
      status: JobStatus.PUBLISHED,
      isUrgent: true,
      isHighReward: false,
      applicants: 3,
      applicantIds: ['expert_001', 'expert_003', 'expert_005'],
      views: 25,
      publishTime: '30分钟前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'job_002',
      title: '寻找专业按摩师上门服务',
      description: '老人腰椎不好，需要专业的按摩理疗。希望按摩师有中医推拿经验，能够上门服务。',
      jobType: JobType.HEALTH,
      serviceType: ServiceType.MASSAGE,
      employerId: 'user_002',
      employerName: '王芳',
      employerAvatar: '👩',
      location: {
        address: '福田区华强北',
        district: '福田区',
        latitude: 39.9829,
        longitude: 116.3108,
      },
      serviceTime: '本周末下午2:00-4:00',
      duration: '2小时',
      budget: {
        min: 200,
        max: 300,
        currency: '¥',
      },
      requirements: ['有按摩资质', '中医推拿经验', '上门服务'],
      images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&q=80'], // 按摩理疗场景
      relatedMemberId: 'member_003',
      healthTags: ['腰椎问题'],
      status: JobStatus.PUBLISHED,
      isUrgent: false,
      isHighReward: true,
      applicants: 5,
      applicantIds: ['expert_002', 'expert_004', 'expert_006', 'expert_007', 'expert_008'],
      views: 42,
      publishTime: '2小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'job_003',
      title: '教老人使用智能手机',
      description: '父亲60岁，想学习使用微信、支付宝等常用APP。希望有耐心的老师上门教学。',
      jobType: JobType.EDUCATION,
      serviceType: ServiceType.PHONE_TEACH,
      employerId: 'user_001',
      employerName: '李明',
      employerAvatar: '👨',
      location: {
        address: '南山区科技园',
        district: '南山区',
        latitude: 39.9093,
        longitude: 116.4578,
      },
      serviceTime: '下周工作日晚上7:00-9:00',
      duration: '2小时/次，共5次',
      budget: {
        min: 100,
        max: 150,
        currency: '¥',
      },
      requirements: ['有老年人教学经验', '耐心细致', '普通话标准'],
      images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80'], // 老人学习使用手机场景
      status: JobStatus.PUBLISHED,
      isUrgent: false,
      isHighReward: false,
      applicants: 2,
      applicantIds: ['expert_009', 'expert_010'],
      views: 18,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'job_004',
      title: '寻找陪聊师傅陪老人聊天',
      description: '母亲独居，比较孤独，希望找一位有经验、健谈的陪聊师傅定期上门聊天，排解孤独。',
      jobType: JobType.LIFE,
      serviceType: ServiceType.ACCOMPANY_CHAT,
      employerId: 'user_003',
      employerName: '赵女士',
      employerAvatar: '👩',
      location: {
        address: '罗湖区东门',
        district: '罗湖区',
        latitude: 39.9153,
        longitude: 116.4074,
      },
      serviceTime: '每周三、五下午3:00-5:00',
      duration: '2小时/次',
      budget: {
        min: 80,
        max: 120,
        currency: '¥',
      },
      requirements: ['善于沟通', '有陪伴经验', '有耐心'],
      images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80'],
      status: JobStatus.PUBLISHED,
      isUrgent: false,
      isHighReward: false,
      applicants: 1,
      applicantIds: ['expert_003'],
      views: 15,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'job_005',
      title: '寻找康复理疗师帮助术后康复',
      description: '父亲刚做完膝关节手术，需要专业的康复理疗师指导康复训练。',
      jobType: JobType.HEALTH,
      serviceType: ServiceType.REHABILITATION,
      employerId: 'user_004',
      employerName: '孙先生',
      employerAvatar: '👨',
      location: {
        address: '宝安区西乡',
        district: '宝安区',
        latitude: 39.9062,
        longitude: 116.3738,
      },
      serviceTime: '下周开始，每天上午10:00-11:30',
      duration: '1.5小时/次，持续一个月',
      budget: {
        min: 150,
        max: 250,
        currency: '¥',
      },
      requirements: ['康复师资格证', '骨科康复经验', '上门服务'],
      images: ['https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop&q=80'],
      relatedMemberId: 'member_001',
      healthTags: ['术后康复'],
      status: JobStatus.PUBLISHED,
      isUrgent: true,
      isHighReward: true,
      applicants: 7,
      applicantIds: ['expert_002', 'expert_004', 'expert_006'],
      views: 52,
      publishTime: '3小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'job_006',
      title: '寻找营养师制定健康饮食方案',
      description: '老人有糖尿病和高血压，需要专业营养师制定科学的饮食方案，并指导家属配餐。',
      jobType: JobType.HEALTH,
      serviceType: ServiceType.MEAL_PREP,
      employerId: 'user_005',
      employerName: '钱女士',
      employerAvatar: '👩',
      location: {
        address: '丰台区丰台科技园',
        district: '丰台区',
        latitude: 39.8586,
        longitude: 116.2860,
      },
      serviceTime: '本周内，可协商具体时间',
      duration: '2-3小时咨询',
      budget: {
        min: 300,
        max: 500,
        currency: '¥',
      },
      requirements: ['营养师资格证', '慢性病饮食经验', '可线上或上门'],
      images: ['https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=300&fit=crop&q=80'],
      relatedMemberId: 'member_002',
      healthTags: ['糖尿病', '高血压'],
      status: JobStatus.PUBLISHED,
      isUrgent: false,
      isHighReward: true,
      applicants: 4,
      applicantIds: ['expert_003'],
      views: 28,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

/**
 * 初始化默认的达人数据
 */
const initializeDefaultExperts = (): Expert[] => {
  const now = new Date();

  return [
    {
      id: 'expert_001',
      userId: 'user_expert_001',
      name: '张护士',
      avatar: '👩‍⚕️',
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.ACCOMPANY_DOCTOR, ServiceType.NURSING, ServiceType.ACCOMPANY_CARE],
      serviceArea: ['南山区', '罗湖区', '宝安区'],
      introduction: '退休护士，有20年临床经验，擅长老年人护理和陪诊服务。',
      skillDescription: '熟悉各大医院流程，能够协助挂号、就诊、取药等。有高血压、糖尿病等慢性病护理经验。',
      certificates: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80', // Nursing certificate
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&q=80', // Professional license
      ],
      showcaseImages: [
        'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop&q=80', // Elderly care scene
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&q=80', // Hospital accompaniment
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop&q=80', // Medical device assistance
      ],
      pricing: {
        [ServiceType.ACCOMPANY_DOCTOR]: { basePrice: 80, unit: '小时' },
        [ServiceType.NURSING]: { basePrice: 100, unit: '小时' },
        [ServiceType.ACCOMPANY_CARE]: { basePrice: 120, unit: '天' },
      },
      totalOrders: 156,
      completedOrders: 152,
      rating: 4.9,
      goodReviewRate: 97,
      responseTime: '5分钟',
      badges: ['金牌服务', '快速响应', '好评如潮'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_002',
      userId: 'user_expert_002',
      name: '刘师傅',
      avatar: '👨',
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.HALL_OF_FAME,
      serviceTypes: [ServiceType.MASSAGE, ServiceType.REHABILITATION],
      serviceArea: ['福田区', '南山区'],
      introduction: '中医推拿师，15年从业经验，擅长颈椎、腰椎等问题的理疗。',
      skillDescription: '持有高级按摩师资格证、中医推拿师证。擅长治疗颈椎病、腰椎间盘突出、肩周炎等。',
      certificates: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80', // Massage therapist license
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&q=80', // Traditional Chinese medicine certificate
        'https://images.unsplash.com/photo-1606914469633-5d96427f0e6a?w=400&h=300&fit=crop&q=80', // Professional training certificate
      ],
      showcaseImages: [
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&q=80', // Massage therapy session
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop&q=80', // Therapy room
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop&q=80', // Rehabilitation equipment
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&q=80', // Treatment area
      ],
      pricing: {
        [ServiceType.MASSAGE]: { basePrice: 150, unit: '小时' },
        [ServiceType.REHABILITATION]: { basePrice: 200, unit: '次' },
      },
      totalOrders: 328,
      completedOrders: 325,
      rating: 5.0,
      goodReviewRate: 99,
      responseTime: '2分钟',
      badges: ['殿堂级大师', '金牌服务', '快速响应', '专业认证'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_003',
      userId: 'user_expert_003',
      name: '赵阿姨',
      avatar: '👵',
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: false,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.ACCOMPANY_CHAT, ServiceType.MEAL_PREP],
      serviceArea: ['南山区'],
      introduction: '退休教师，喜欢与老年人交流，擅长聊天陪伴和营养配餐。',
      skillDescription: '有丰富的陪伴经验，善于倾听。了解老年人营养需求，能制作健康美味的餐食。',
      certificates: [
        'https://images.unsplash.com/photo-1606914469633-5d96427f0e6a?w=400&h=300&fit=crop&q=80', // Nutrition training certificate
      ],
      showcaseImages: [
        'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=300&fit=crop&q=80', // Healthy meal preparation
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80', // Elderly companionship
        'https://images.unsplash.com/photo-1577219491135-ce391730fb4c?w=400&h=300&fit=crop&q=80', // Cooking healthy food
      ],
      pricing: {
        [ServiceType.ACCOMPANY_CHAT]: { basePrice: 50, unit: '小时' },
        [ServiceType.MEAL_PREP]: { basePrice: 80, unit: '次' },
      },
      totalOrders: 45,
      completedOrders: 43,
      rating: 4.8,
      goodReviewRate: 95,
      responseTime: '10分钟',
      badges: ['优质服务', '好评如潮'],
      isOnline: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

/**
 * 初始化默认的二手商品数据
 */
const initializeDefaultSecondHandItems = (): SecondHandItem[] => {
  const now = new Date();

  return [
    {
      id: 'item_001',
      sellerId: 'user_003',
      sellerName: '陈先生',
      sellerAvatar: '👨‍💼',
      sellerRating: 4.8,
      title: '欧姆龙血压计 95成新',
      description: '家里老人用的血压计，买了3个月，几乎全新。因为换了带蓝牙的新款，这台闲置出售。',
      category: ItemCategory.HEALTH_DEVICE,
      images: [
        'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop&q=80',
      ], // 血压计产品图
      currentPrice: 180,
      originalPrice: 299,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '3个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: {
        address: '南山区科技园',
        district: '南山区',
        latitude: 39.9093,
        longitude: 116.4578,
      },
      status: ItemStatus.AVAILABLE,
      views: 32,
      favorites: 5,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_002',
      sellerId: 'user_004',
      sellerName: '李女士',
      sellerAvatar: '👩',
      sellerRating: 4.9,
      title: '轮椅免费赠送',
      description: '老人康复后不再需要，轮椅9成新，免费赠送给有需要的人。自取。',
      category: ItemCategory.ASSISTIVE,
      images: [
        'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=300&fit=crop&q=80',
      ], // 轮椅产品图
      currentPrice: 0,
      isFree: true,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: {
        address: '福田区华强北',
        district: '福田区',
        latitude: 39.9829,
        longitude: 116.3108,
      },
      status: ItemStatus.AVAILABLE,
      views: 68,
      favorites: 12,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_003',
      sellerId: 'user_005',
      sellerName: '刘阿姨',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '九成新跑步机低价出售',
      description: '健身房级跑步机，买来用了不到10次，因搬家需要处理。功能完好，配件齐全。',
      category: ItemCategory.FITNESS_EQUIPMENT,
      images: [
        'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 1200,
      originalPrice: 3500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '半年前',
      usageDuration: '不到1个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: {
        address: '石景山区',
        district: '石景山区',
        latitude: 39.9056,
        longitude: 116.2228,
      },
      status: ItemStatus.AVAILABLE,
      views: 95,
      favorites: 18,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_004',
      sellerId: 'user_006',
      sellerName: '周大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '助听器转让（全新未拆封）',
      description: '儿子买错型号了，全新未拆封的助听器，原价2800，现在低价转让。',
      category: ItemCategory.ASSISTIVE,
      images: [
        'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 1800,
      originalPrice: 2800,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: {
        address: '通州区',
        district: '通州区',
        latitude: 39.9088,
        longitude: 116.6563,
      },
      status: ItemStatus.AVAILABLE,
      views: 42,
      favorites: 8,
      publishTime: '12小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_005',
      sellerId: 'user_007',
      sellerName: '吴女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '电动按摩椅出售',
      description: '老人不习惯用，8成新按摩椅，多种按摩模式，功能正常。',
      category: ItemCategory.WELLNESS_SUPPLY,
      images: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 800,
      originalPrice: 2200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '2年前',
      usageDuration: '1年',
      tradeMethods: [TradeMethod.PICKUP],
      location: {
        address: '大兴区',
        district: '大兴区',
        latitude: 39.7289,
        longitude: 116.3421,
      },
      status: ItemStatus.AVAILABLE,
      views: 61,
      favorites: 14,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_006',
      sellerId: 'user_008',
      sellerName: '郑先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '血糖仪套装转让',
      description: '罗氏血糖仪，配50片试纸和采血针。老人已经不用了，9成新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: [
        'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 150,
      originalPrice: 380,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '4个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: {
        address: '昌平区',
        district: '昌平区',
        latitude: 40.2205,
        longitude: 116.2316,
      },
      status: ItemStatus.AVAILABLE,
      views: 38,
      favorites: 6,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_007',
      sellerId: 'user_009',
      sellerName: '孙女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '拐杖一副 全新',
      description: '买来老人不喜欢，全新未使用的拐杖，可调节高度，铝合金材质。',
      category: ItemCategory.ASSISTIVE,
      images: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 50,
      originalPrice: 120,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: {
        address: '朝阳区',
        district: '朝阳区',
        latitude: 39.9212,
        longitude: 116.4430,
      },
      status: ItemStatus.AVAILABLE,
      views: 25,
      favorites: 4,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_008',
      sellerId: 'user_010',
      sellerName: '赵先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '瑜伽垫+泡沫轴套装',
      description: '老人康复训练用的瑜伽垫和泡沫轴，8成新，厚度10mm，防滑耐用。',
      category: ItemCategory.FITNESS_EQUIPMENT,
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 80,
      originalPrice: 200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '5个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: {
        address: '海淀区',
        district: '海淀区',
        latitude: 39.9568,
        longitude: 116.3086,
      },
      status: ItemStatus.AVAILABLE,
      views: 47,
      favorites: 9,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_009',
      sellerId: 'user_011',
      sellerName: '钱女士',
      sellerAvatar: '👩',
      sellerRating: 4.8,
      title: '电子体温计免费送',
      description: '多买了一个，免费赠送给需要的朋友。全新未拆封，自取即可。',
      category: ItemCategory.HEALTH_DEVICE,
      images: [
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 0,
      isFree: true,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP],
      location: {
        address: '丰台区',
        district: '丰台区',
        latitude: 39.8589,
        longitude: 116.2866,
      },
      status: ItemStatus.AVAILABLE,
      views: 85,
      favorites: 22,
      publishTime: '3小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_010',
      sellerId: 'user_012',
      sellerName: '冯大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '哑铃套装转让 2-10kg',
      description: '家用健身哑铃套装，2kg到10kg可调节，9成新，配专用收纳架。',
      category: ItemCategory.FITNESS_EQUIPMENT,
      images: [
        'https://images.unsplash.com/photo-1517344800994-0f4189acbf02?w=400&h=300&fit=crop&q=80',
      ],
      currentPrice: 200,
      originalPrice: 450,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '8个月前',
      usageDuration: '4个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: {
        address: '西城区',
        district: '西城区',
        latitude: 39.9140,
        longitude: 116.3668,
      },
      status: ItemStatus.AVAILABLE,
      views: 72,
      favorites: 16,
      publishTime: '4天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

/**
 * 初始化默认的内容帖子数据
 */
const initializeDefaultPosts = (): CommunityPost[] => {
  const now = new Date();

  return [
    {
      id: 'post_001',
      authorId: 'expert_002',
      authorName: '刘师傅',
      authorAvatar: '👨',
      authorLevel: ExpertLevel.HALL_OF_FAME,
      authorVerified: true,
      title: '老年人腰痛的自我缓解方法',
      content: '很多老年人都有腰痛的问题，今天分享几个简单有效的自我缓解方法...',
      summary: '专业按摩师分享老年人腰痛缓解技巧',
      category: PostCategory.EXPERIENCE,
      tags: ['腰痛', '康复', '老年保健'],
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&q=80', // Back pain relief techniques
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&q=80', // Massage therapy
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop&q=80', // Rehabilitation exercises
      ],
      views: 156,
      likes: 32,
      favorites: 18,
      comments: 12,
      shares: 5,
      isPinned: true,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'post_002',
      authorId: 'expert_001',
      authorName: '张护士',
      authorAvatar: '👩‍⚕️',
      authorLevel: ExpertLevel.GOLD,
      authorVerified: true,
      title: '高血压老人日常护理注意事项',
      content: '作为有20年护理经验的护士，我总结了高血压老人日常护理的几个关键点...',
      summary: '退休护士分享高血压老人护理要点',
      category: PostCategory.EXPERIENCE,
      tags: ['高血压', '老年护理', '健康管理'],
      coverImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&h=600&fit=crop&q=80',
      ],
      views: 203,
      likes: 48,
      favorites: 25,
      comments: 18,
      shares: 8,
      isPinned: false,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'post_003',
      authorId: 'expert_003',
      authorName: '赵阿姨',
      authorAvatar: '👵',
      authorLevel: ExpertLevel.QUALITY,
      authorVerified: true,
      title: '适合糖尿病老人的一周食谱',
      content: '很多家属不知道糖尿病老人该怎么吃，我整理了一周健康食谱，供大家参考...',
      summary: '退休教师分享糖尿病老人营养食谱',
      category: PostCategory.TUTORIAL,
      tags: ['糖尿病', '营养饮食', '健康食谱'],
      coverImage: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1577219491135-ce391730fb4c?w=800&h=600&fit=crop&q=80',
      ],
      views: 178,
      likes: 41,
      favorites: 32,
      comments: 24,
      shares: 12,
      isPinned: false,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'post_004',
      authorId: 'user_009',
      authorName: '康养达人小王',
      authorAvatar: '👨‍💼',
      authorLevel: ExpertLevel.INTERMEDIATE,
      authorVerified: false,
      title: '血压计选购指南 | 如何选择适合老人的血压计',
      content: '市面上血压计种类繁多，如何选择适合老人使用的呢？我来分享一些经验...',
      summary: '血压计选购攻略，教你避坑',
      category: PostCategory.REVIEW,
      tags: ['血压计', '康养设备', '选购指南'],
      coverImage: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&h=600&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop&q=80',
      ],
      views: 132,
      likes: 28,
      favorites: 19,
      comments: 15,
      shares: 6,
      isPinned: false,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'post_005',
      authorId: 'user_010',
      authorName: '家有老小',
      authorAvatar: '👨‍👩‍👧',
      authorVerified: false,
      title: '陪伴父母的温馨时光 | 记录康养之路',
      content: '分享我陪伴父母养老的一些心得和温馨瞬间，希望能给大家一些启发...',
      summary: '用心陪伴，记录美好时光',
      category: PostCategory.LIFE,
      tags: ['陪伴', '养老', '温馨时刻'],
      coverImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop&q=80',
      ],
      views: 245,
      likes: 67,
      favorites: 38,
      comments: 31,
      shares: 15,
      isPinned: false,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

/**
 * 初始化默认的聊天会话数据
 */
const initializeDefaultConversations = (): ChatConversation[] => {
  const now = new Date();

  return [
    {
      id: 'conv_001',
      participant1Id: 'user_001',
      participant1Name: '李明',
      participant1Avatar: '👨',
      participant2Id: 'expert_001',
      participant2Name: '张护士',
      participant2Avatar: '👩‍⚕️',
      relatedType: ConversationRelatedType.JOB,
      relatedId: 'job_001',
      relatedTitle: '需要一位护理员陪护老人去医院复查',
      lastMessage: '好的，明天上午9点我准时到',
      lastMessageTime: now.toISOString(),
      unreadCount: {
        user_001: 1,
        expert_001: 0,
      },
      isPinned: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

/**
 * 初始化所有社区数据
 */
export const initializeCommunityData = async (): Promise<void> => {
  try {
    // 检查是否已初始化
    const existingJobs = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_JOBS);
    if (existingJobs) {
      console.log('社区数据已存在，跳过初始化');
      return;
    }

    // 初始化各类数据
    const jobs = initializeDefaultJobs();
    const experts = initializeDefaultExperts();
    const items = initializeDefaultSecondHandItems();
    const posts = initializeDefaultPosts();
    const conversations = initializeDefaultConversations();

    // 存储到AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_JOBS, JSON.stringify(jobs));
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_EXPERTS, JSON.stringify(experts));
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_SECONDHAND, JSON.stringify(items));
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(conversations));
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_ORDERS, JSON.stringify([]));

    console.log('社区数据初始化完成');
  } catch (error) {
    console.error('初始化社区数据失败:', error);
    throw error;
  }
};

// ==================== 零工需求服务函数 ====================

export const getJobs = async (filters?: {
  jobType?: JobType;
  serviceType?: ServiceType;
  status?: JobStatus;
  isUrgent?: boolean;
}): Promise<ServiceJob[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_JOBS);
    let jobs: ServiceJob[] = data ? JSON.parse(data) : [];

    // 应用筛选
    if (filters) {
      if (filters.jobType) {
        jobs = jobs.filter(job => job.jobType === filters.jobType);
      }
      if (filters.serviceType) {
        jobs = jobs.filter(job => job.serviceType === filters.serviceType);
      }
      if (filters.status) {
        jobs = jobs.filter(job => job.status === filters.status);
      }
      if (filters.isUrgent !== undefined) {
        jobs = jobs.filter(job => job.isUrgent === filters.isUrgent);
      }
    }

    return jobs;
  } catch (error) {
    console.error('获取零工列表失败:', error);
    return [];
  }
};

export const getJobById = async (id: string): Promise<ServiceJob | null> => {
  try {
    const jobs = await getJobs();
    return jobs.find(job => job.id === id) || null;
  } catch (error) {
    console.error('获取零工详情失败:', error);
    return null;
  }
};

export const createJob = async (jobData: Omit<ServiceJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceJob> => {
  try {
    const jobs = await getJobs();
    const now = new Date().toISOString();

    const newJob: ServiceJob = {
      ...jobData,
      id: `job_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    jobs.push(newJob);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_JOBS, JSON.stringify(jobs));

    return newJob;
  } catch (error) {
    console.error('创建零工需求失败:', error);
    throw error;
  }
};

export const updateJob = async (id: string, updates: Partial<ServiceJob>): Promise<ServiceJob | null> => {
  try {
    const jobs = await getJobs();
    const index = jobs.findIndex(job => job.id === id);

    if (index === -1) {
      return null;
    }

    const updatedJob = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    jobs[index] = updatedJob;
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_JOBS, JSON.stringify(jobs));

    return updatedJob;
  } catch (error) {
    console.error('更新零工需求失败:', error);
    return null;
  }
};

export const deleteJob = async (id: string): Promise<boolean> => {
  try {
    const jobs = await getJobs();
    const filtered = jobs.filter(job => job.id !== id);

    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_JOBS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除零工需求失败:', error);
    return false;
  }
};

// ==================== 达人服务函数 ====================

export const getExperts = async (filters?: {
  serviceType?: ServiceType;
  level?: ExpertLevel;
  isOnline?: boolean;
}): Promise<Expert[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_EXPERTS);
    let experts: Expert[] = data ? JSON.parse(data) : [];

    // 应用筛选
    if (filters) {
      if (filters.serviceType) {
        experts = experts.filter(expert => expert.serviceTypes.includes(filters.serviceType!));
      }
      if (filters.level) {
        experts = experts.filter(expert => expert.level === filters.level);
      }
      if (filters.isOnline !== undefined) {
        experts = experts.filter(expert => expert.isOnline === filters.isOnline);
      }
    }

    return experts;
  } catch (error) {
    console.error('获取达人列表失败:', error);
    return [];
  }
};

export const getExpertById = async (id: string): Promise<Expert | null> => {
  try {
    const experts = await getExperts();
    return experts.find(expert => expert.id === id) || null;
  } catch (error) {
    console.error('获取达人详情失败:', error);
    return null;
  }
};

export const createExpertProfile = async (expertData: Omit<Expert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expert> => {
  try {
    const experts = await getExperts();
    const now = new Date().toISOString();

    const newExpert: Expert = {
      ...expertData,
      id: `expert_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    experts.push(newExpert);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_EXPERTS, JSON.stringify(experts));

    // 同时保存为我的达人身份
    await AsyncStorage.setItem(STORAGE_KEYS.MY_EXPERT_PROFILE, JSON.stringify(newExpert));

    return newExpert;
  } catch (error) {
    console.error('创建达人身份失败:', error);
    throw error;
  }
};

export const updateExpertProfile = async (id: string, updates: Partial<Expert>): Promise<Expert | null> => {
  try {
    const experts = await getExperts();
    const index = experts.findIndex(expert => expert.id === id);

    if (index === -1) {
      return null;
    }

    const updatedExpert = {
      ...experts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    experts[index] = updatedExpert;
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_EXPERTS, JSON.stringify(experts));

    // 如果是我的达人身份，同步更新
    const myProfile = await AsyncStorage.getItem(STORAGE_KEYS.MY_EXPERT_PROFILE);
    if (myProfile) {
      const myExpert = JSON.parse(myProfile);
      if (myExpert.id === id) {
        await AsyncStorage.setItem(STORAGE_KEYS.MY_EXPERT_PROFILE, JSON.stringify(updatedExpert));
      }
    }

    return updatedExpert;
  } catch (error) {
    console.error('更新达人信息失败:', error);
    return null;
  }
};

export const getMyExpertProfile = async (): Promise<Expert | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MY_EXPERT_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('获取我的达人身份失败:', error);
    return null;
  }
};

// ==================== 订单服务函数 ====================

export const getOrders = async (filters?: {
  employerId?: string;
  expertId?: string;
  status?: OrderStatus;
}): Promise<ServiceOrder[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_ORDERS);
    let orders: ServiceOrder[] = data ? JSON.parse(data) : [];

    // 应用筛选
    if (filters) {
      if (filters.employerId) {
        orders = orders.filter(order => order.employerId === filters.employerId);
      }
      if (filters.expertId) {
        orders = orders.filter(order => order.expertId === filters.expertId);
      }
      if (filters.status) {
        orders = orders.filter(order => order.status === filters.status);
      }
    }

    return orders;
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return [];
  }
};

export const getOrderById = async (id: string): Promise<ServiceOrder | null> => {
  try {
    const orders = await getOrders();
    return orders.find(order => order.id === id) || null;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return null;
  }
};

export const createOrder = async (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceOrder> => {
  try {
    const orders = await getOrders();
    const now = new Date().toISOString();

    const newOrder: ServiceOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    orders.push(newOrder);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_ORDERS, JSON.stringify(orders));

    return newOrder;
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<ServiceOrder | null> => {
  try {
    return await updateOrder(id, { status });
  } catch (error) {
    console.error('更新订单状态失败:', error);
    return null;
  }
};

export const updateOrder = async (id: string, updates: Partial<ServiceOrder>): Promise<ServiceOrder | null> => {
  try {
    const orders = await getOrders();
    const index = orders.findIndex(order => order.id === id);

    if (index === -1) {
      return null;
    }

    const updatedOrder = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_ORDERS, JSON.stringify(orders));

    return updatedOrder;
  } catch (error) {
    console.error('更新订单失败:', error);
    return null;
  }
};

// ==================== 聊天服务函数 ====================

export const getConversations = async (userId: string): Promise<ChatConversation[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    let conversations: ChatConversation[] = data ? JSON.parse(data) : [];

    // 筛选包含该用户的会话
    conversations = conversations.filter(
      conv => conv.participant1Id === userId || conv.participant2Id === userId
    );

    // 按置顶状态和最后消息时间排序（置顶的优先）
    conversations.sort((a, b) => {
      // 置顶的会话优先
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // 同样置顶状态下，按最后消息时间排序
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

    return conversations;
  } catch (error) {
    console.error('获取会话列表失败:', error);
    return [];
  }
};

export const createConversation = async (
  participant1Id: string,
  participant2Id: string,
  relatedType: ConversationRelatedType = ConversationRelatedType.NONE,
  relatedId?: string,
  relatedTitle?: string,
  relatedThumbnail?: string,
  participant1Name?: string,
  participant1Avatar?: string,
  participant2Name?: string,
  participant2Avatar?: string
): Promise<ChatConversation> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    const conversations: ChatConversation[] = data ? JSON.parse(data) : [];

    // 检查是否已存在会话
    const existing = conversations.find(
      conv =>
        (conv.participant1Id === participant1Id && conv.participant2Id === participant2Id) ||
        (conv.participant1Id === participant2Id && conv.participant2Id === participant1Id)
    );

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const newConversation: ChatConversation = {
      id: `conv_${Date.now()}`,
      participant1Id,
      participant1Name: participant1Name || '用户',
      participant1Avatar: participant1Avatar || '👤',
      participant2Id,
      participant2Name: participant2Name || '对方',
      participant2Avatar: participant2Avatar || '👤',
      relatedType,
      relatedId,
      relatedTitle,
      relatedThumbnail,
      lastMessage: '',
      lastMessageTime: now,
      unreadCount: {},
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };

    conversations.push(newConversation);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(conversations));

    return newConversation;
  } catch (error) {
    console.error('创建会话失败:', error);
    throw error;
  }
};

export const getConversationById = async (id: string): Promise<ChatConversation | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    const conversations: ChatConversation[] = data ? JSON.parse(data) : [];
    return conversations.find(conv => conv.id === id) || null;
  } catch (error) {
    console.error('获取会话详情失败:', error);
    return null;
  }
};

export const sendMessage = async (
  conversationId: string,
  messageData: {
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type: MessageType;
    content: string;
    quoteData?: ChatMessage['quoteData'];
    orderData?: ChatMessage['orderData'];
    voiceData?: ChatMessage['voiceData'];
  }
): Promise<ChatMessage | null> => {
  try {
    // 获取消息列表
    const messagesData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_MESSAGES);
    const messages: ChatMessage[] = messagesData ? JSON.parse(messagesData) : [];

    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderAvatar: messageData.senderAvatar,
      type: messageData.type,
      content: messageData.content,
      quoteData: messageData.quoteData,
      orderData: messageData.orderData,
      voiceData: messageData.voiceData,
      isRead: false,
      timestamp: now,
      createdAt: now,
    };

    messages.push(newMessage);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(messages));

    // 更新会话的最后消息
    const conversationsData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    const conversations: ChatConversation[] = conversationsData ? JSON.parse(conversationsData) : [];
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);

    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage = messageData.content;
      conversations[conversationIndex].lastMessageTime = now;
      conversations[conversationIndex].updatedAt = now;

      // 增加对方的未读数
      const conversation = conversations[conversationIndex];
      const receiverId = conversation.participant1Id === messageData.senderId
        ? conversation.participant2Id
        : conversation.participant1Id;

      conversations[conversationIndex].unreadCount = {
        ...conversation.unreadCount,
        [receiverId]: (conversation.unreadCount[receiverId] || 0) + 1,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(conversations));
    }

    return newMessage;
  } catch (error) {
    console.error('发送消息失败:', error);
    return null;
  }
};

export const sendQuote = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  quoteData: {
    jobId: string;
    jobTitle: string;
    quotedPrice: number;
    serviceTime: string;
    duration: string;
    message: string;
    expertId: string;
    expertName: string;
  }
): Promise<ChatMessage | null> => {
  try {
    const quoteMessage = await sendMessage(conversationId, {
      senderId,
      senderName,
      type: MessageType.QUOTE,
      content: `报价：¥${quoteData.quotedPrice}`,
      quoteData: {
        jobId: quoteData.jobId,
        jobTitle: quoteData.jobTitle,
        price: quoteData.quotedPrice,
        currency: '¥',
        message: quoteData.message,
        estimatedDuration: quoteData.duration,
        status: QuoteStatus.PENDING,
      },
    });

    return quoteMessage;
  } catch (error) {
    console.error('发送报价失败:', error);
    return null;
  }
};

export const markAsRead = async (conversationId: string, userId: string): Promise<boolean> => {
  try {
    // 标记消息为已读
    const messagesData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_MESSAGES);
    const messages: ChatMessage[] = messagesData ? JSON.parse(messagesData) : [];

    let hasUnread = false;
    const updatedMessages = messages.map(msg => {
      if (msg.conversationId === conversationId && msg.senderId !== userId && !msg.isRead) {
        hasUnread = true;
        return { ...msg, isRead: true };
      }
      return msg;
    });

    if (hasUnread) {
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(updatedMessages));
    }

    // 清除会话的未读数
    const conversationsData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    const conversations: ChatConversation[] = conversationsData ? JSON.parse(conversationsData) : [];
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);

    if (conversationIndex !== -1) {
      conversations[conversationIndex].unreadCount = {
        ...conversations[conversationIndex].unreadCount,
        [userId]: 0,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(conversations));
    }

    return true;
  } catch (error) {
    console.error('标记已读失败:', error);
    return false;
  }
};

export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    // 删除会话
    const conversationsData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    const conversations: ChatConversation[] = conversationsData ? JSON.parse(conversationsData) : [];
    const filteredConversations = conversations.filter(conv => conv.id !== conversationId);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(filteredConversations));

    // 删除该会话的所有消息
    const messagesData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_MESSAGES);
    const messages: ChatMessage[] = messagesData ? JSON.parse(messagesData) : [];
    const filteredMessages = messages.filter(msg => msg.conversationId !== conversationId);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(filteredMessages));

    return true;
  } catch (error) {
    console.error('删除会话失败:', error);
    return false;
  }
};

export const getMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  try {
    const messagesData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_MESSAGES);
    const messages: ChatMessage[] = messagesData ? JSON.parse(messagesData) : [];

    // 筛选属于该会话的消息
    const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);

    // 按时间排序
    conversationMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return conversationMessages;
  } catch (error) {
    console.error('获取消息列表失败:', error);
    return [];
  }
};

export const togglePinConversation = async (conversationId: string): Promise<boolean> => {
  try {
    const conversationsData = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);
    const conversations: ChatConversation[] = conversationsData ? JSON.parse(conversationsData) : [];
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);

    if (conversationIndex !== -1) {
      conversations[conversationIndex].isPinned = !conversations[conversationIndex].isPinned;
      conversations[conversationIndex].updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(conversations));
      return conversations[conversationIndex].isPinned;
    }

    return false;
  } catch (error) {
    console.error('切换置顶状态失败:', error);
    return false;
  }
};

// ==================== 推荐算法服务函数 ====================

/**
 * 获取推荐的Feed流
 * 混合内容：需求+商品+帖子+达人
 */
export const getRecommendedFeed = async (
  userId: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<Array<ServiceJob | SecondHandItem | CommunityPost | Expert>> => {
  try {
    // 加载所有数据
    const [jobs, items, posts, experts] = await Promise.all([
      getJobs(),
      getSecondHandItems(),
      getPosts(),
      getExperts(),
    ]);

    // 定义内容项的通用类型
    interface FeedItem {
      id: string;
      type: 'job' | 'item' | 'post' | 'expert';
      data: ServiceJob | SecondHandItem | CommunityPost | Expert;
      score: number; // 推荐分数
      timestamp: Date;
    }

    const feedItems: FeedItem[] = [];

    // 评分逻辑函数
    const calculateJobScore = (job: ServiceJob): number => {
      let score = 50; // 基础分数

      // 1. 关联健康数据的需求（+30分）
      if (job.relatedMemberId) {
        score += 30;
      }

      // 2. 高佣金需求（+20分）
      if (job.isHighReward) {
        score += 20;
      }

      // 3. 紧急需求（+15分）
      if (job.isUrgent) {
        score += 15;
      }

      // 4. 附近3km内容（+25分）
      if (userLocation && job.location) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          job.location.latitude,
          job.location.longitude
        );
        if (distance <= 3) {
          score += 25;
        }
      }

      // 5. 新发布的内容（+10分）
      const hoursSincePublish = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursSincePublish < 24) {
        score += 10;
      }

      // 6. 高浏览量（+5分）
      if (job.views > 50) {
        score += 5;
      }

      return score;
    };

    const calculateItemScore = (item: SecondHandItem): number => {
      let score = 40; // 基础分数

      // 1. 免费赠送（+25分）
      if (item.isFree) {
        score += 25;
      }

      // 2. 附近3km（+25分）
      if (userLocation && item.location) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.location.latitude,
          item.location.longitude
        );
        if (distance <= 3) {
          score += 25;
        }
      }

      // 3. 新发布（+10分）
      const hoursSincePublish = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursSincePublish < 24) {
        score += 10;
      }

      // 4. 高收藏量（+5分）
      if (item.favoriteCount > 10) {
        score += 5;
      }

      // 5. 九成新以上（+5分）
      if (item.condition === ItemCondition.LIKE_NEW || item.condition === ItemCondition.NEW) {
        score += 5;
      }

      return score;
    };

    const calculatePostScore = (post: CommunityPost): number => {
      let score = 45; // 基础分数

      // 1. 高互动（点赞+评论+收藏）（+30分）
      const totalInteraction = post.likeCount + post.commentCount + post.favoriteCount;
      if (totalInteraction > 50) {
        score += 30;
      } else if (totalInteraction > 20) {
        score += 15;
      }

      // 2. 新发布（+10分）
      const hoursSincePublish = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursSincePublish < 24) {
        score += 10;
      }

      // 3. 高浏览量（+10分）
      if (post.viewCount > 100) {
        score += 10;
      }

      return score;
    };

    const calculateExpertScore = (expert: Expert): number => {
      let score = 35; // 基础分数

      // 1. 高评分（+25分）
      if (expert.rating >= 4.8) {
        score += 25;
      } else if (expert.rating >= 4.5) {
        score += 15;
      }

      // 2. 已认证（+20分）
      if (expert.certificationStatus === ExpertCertStatus.APPROVED) {
        score += 20;
      }

      // 3. 附近3km（+25分）
      if (userLocation && expert.serviceAreas && expert.serviceAreas.length > 0) {
        // 简化处理：如果服务区域包含用户所在区域
        score += 15;
      }

      // 4. 高订单量（+10分）
      if (expert.orderCount > 50) {
        score += 10;
      }

      // 5. 在线状态（+5分）
      if (expert.isOnline) {
        score += 5;
      }

      return score;
    };

    // 计算所有内容的分数
    jobs.forEach(job => {
      if (job.status === JobStatus.PUBLISHED) {
        feedItems.push({
          id: job.id,
          type: 'job',
          data: job,
          score: calculateJobScore(job),
          timestamp: new Date(job.createdAt),
        });
      }
    });

    items.forEach(item => {
      if (item.status === ItemStatus.AVAILABLE) {
        feedItems.push({
          id: item.id,
          type: 'item',
          data: item,
          score: calculateItemScore(item),
          timestamp: new Date(item.createdAt),
        });
      }
    });

    posts.forEach(post => {
      feedItems.push({
        id: post.id,
        type: 'post',
        data: post,
        score: calculatePostScore(post),
        timestamp: new Date(post.createdAt),
      });
    });

    experts.forEach(expert => {
      if (expert.isActive) {
        feedItems.push({
          id: expert.id,
          type: 'expert',
          data: expert,
          score: calculateExpertScore(expert),
          timestamp: new Date(expert.createdAt),
        });
      }
    });

    // 按分数排序（高分优先），分数相同按时间排序（新的优先）
    feedItems.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // 返回数据
    return feedItems.map(item => item.data);
  } catch (error) {
    console.error('获取推荐Feed失败:', error);
    return [];
  }
};

/**
 * 获取推荐的需求列表
 */
export const getRecommendedJobs = async (
  userId: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<ServiceJob[]> => {
  try {
    const feed = await getRecommendedFeed(userId, userLocation);
    return feed.filter(item => 'jobType' in item) as ServiceJob[];
  } catch (error) {
    console.error('获取推荐需求失败:', error);
    return [];
  }
};

/**
 * 获取推荐的达人列表
 */
export const getRecommendedExperts = async (
  userId: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<Expert[]> => {
  try {
    const feed = await getRecommendedFeed(userId, userLocation);
    return feed.filter(item => 'certificationStatus' in item) as Expert[];
  } catch (error) {
    console.error('获取推荐达人失败:', error);
    return [];
  }
};

/**
 * 获取推荐的二手商品列表
 */
export const getRecommendedItems = async (
  userId: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<SecondHandItem[]> => {
  try {
    const feed = await getRecommendedFeed(userId, userLocation);
    return feed.filter(item => 'condition' in item) as SecondHandItem[];
  } catch (error) {
    console.error('获取推荐商品失败:', error);
    return [];
  }
};

/**
 * 获取附近内容（模拟）
 */
export const getNearbyContent = async (
  lat: number,
  lng: number,
  radius: number = 3
): Promise<Array<ServiceJob | SecondHandItem | CommunityPost | Expert>> => {
  try {
    const [jobs, items, posts, experts] = await Promise.all([
      getJobs(),
      getSecondHandItems(),
      getPosts(),
      getExperts(),
    ]);

    const nearbyItems: Array<ServiceJob | SecondHandItem | CommunityPost | Expert> = [];

    // 筛选附近的需求
    jobs.forEach(job => {
      if (job.location && job.status === JobStatus.PUBLISHED) {
        const distance = calculateDistance(lat, lng, job.location.latitude, job.location.longitude);
        if (distance <= radius) {
          nearbyItems.push(job);
        }
      }
    });

    // 筛选附近的商品
    items.forEach(item => {
      if (item.location && item.status === ItemStatus.AVAILABLE) {
        const distance = calculateDistance(lat, lng, item.location.latitude, item.location.longitude);
        if (distance <= radius) {
          nearbyItems.push(item);
        }
      }
    });

    // 添加帖子（模拟：随机添加一些）
    posts.slice(0, 5).forEach(post => nearbyItems.push(post));

    // 筛选附近的达人（根据服务区域）
    experts.forEach(expert => {
      if (expert.isActive) {
        // 简化处理：都认为是附近的
        nearbyItems.push(expert);
      }
    });

    // 按距离排序（有位置信息的优先）
    return nearbyItems;
  } catch (error) {
    console.error('获取附近内容失败:', error);
    return [];
  }
};

/**
 * 计算两点之间的距离（km）
 * 使用Haversine公式
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 地球半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// ==================== 二手商品服务函数 ====================

export const getSecondHandItems = async (filters?: {
  category?: ItemCategory;
  condition?: ItemCondition;
  isFree?: boolean;
  status?: ItemStatus;
}): Promise<SecondHandItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_SECONDHAND);
    let items: SecondHandItem[] = data ? JSON.parse(data) : [];

    // 应用筛选
    if (filters) {
      if (filters.category) {
        items = items.filter(item => item.category === filters.category);
      }
      if (filters.condition) {
        items = items.filter(item => item.condition === filters.condition);
      }
      if (filters.isFree !== undefined) {
        items = items.filter(item => item.isFree === filters.isFree);
      }
      if (filters.status) {
        items = items.filter(item => item.status === filters.status);
      }
    }

    return items;
  } catch (error) {
    console.error('获取二手商品列表失败:', error);
    return [];
  }
};

export const getItemById = async (id: string): Promise<SecondHandItem | null> => {
  try {
    const items = await getSecondHandItems();
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error('获取二手商品详情失败:', error);
    return null;
  }
};

// 别名导出，兼容不同的命名
export const getSecondHandItemById = getItemById;

export const createItem = async (itemData: Omit<SecondHandItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<SecondHandItem> => {
  try {
    const items = await getSecondHandItems();
    const now = new Date().toISOString();

    const newItem: SecondHandItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    items.push(newItem);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_SECONDHAND, JSON.stringify(items));

    return newItem;
  } catch (error) {
    console.error('创建二手商品失败:', error);
    throw error;
  }
};

export const updateItem = async (id: string, updates: Partial<SecondHandItem>): Promise<SecondHandItem | null> => {
  try {
    const items = await getSecondHandItems();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_SECONDHAND, JSON.stringify(items));

    return updatedItem;
  } catch (error) {
    console.error('更新二手商品失败:', error);
    return null;
  }
};

export const markAsSold = async (id: string): Promise<SecondHandItem | null> => {
  try {
    return await updateItem(id, { status: ItemStatus.SOLD });
  } catch (error) {
    console.error('标记商品已售失败:', error);
    return null;
  }
};

// ==================== 内容帖子服务函数 ====================

export const getPosts = async (filters?: {
  category?: PostCategory;
  authorId?: string;
}): Promise<CommunityPost[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    let posts: CommunityPost[] = data ? JSON.parse(data) : [];

    // 应用筛选
    if (filters) {
      if (filters.category) {
        posts = posts.filter(post => post.category === filters.category);
      }
      if (filters.authorId) {
        posts = posts.filter(post => post.authorId === filters.authorId);
      }
    }

    // 按发布时间排序
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return posts;
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    return [];
  }
};

export const getPostById = async (id: string): Promise<CommunityPost | null> => {
  try {
    const posts = await getPosts();
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    return null;
  }
};

export const createPost = async (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost> => {
  try {
    const posts = await getPosts();
    const now = new Date().toISOString();

    const newPost: CommunityPost = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    posts.push(newPost);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));

    return newPost;
  } catch (error) {
    console.error('创建帖子失败:', error);
    throw error;
  }
};

// ==================== Banner轮播图数据 ====================

export interface BannerItem {
  id: string;
  image: string;
  title?: string;
  link?: string;
  linkType?: 'job' | 'secondhand' | 'expert' | 'article' | 'external';
  linkId?: string;
}

/**
 * 获取Banner轮播图数据（本地模拟数据）
 * 使用Unsplash的真实图片
 */
export const getBanners = async (): Promise<BannerItem[]> => {
  return [
    {
      id: 'banner_001',
      image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=400&fit=crop&q=80', // 温馨的老年人关怀场景
      title: '邻里帮 - 互助服务',
      linkType: 'job',
      link: 'JobList',
    },
    {
      id: 'banner_002',
      image: 'https://images.unsplash.com/photo-1556228841-0c04383c2e0f?w=800&h=400&fit=crop&q=80', // 二手商品/购物场景
      title: '邻里闲物 - 健康设备共享',
      linkType: 'secondhand',
      link: 'SecondHandList',
    },
    {
      id: 'banner_003',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop&q=80', // 医疗健康专业人士
      title: '认证达人 - 专业可靠',
      linkType: 'expert',
      link: 'ExpertList',
    },
    {
      id: 'banner_004',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=400&fit=crop&q=80', // 健康养生场景
      title: '健康资讯 - 科学养生',
      linkType: 'article',
      link: 'ArticleList',
    },
  ];
};

// ==================== 评价服务函数 ====================

export const submitServiceReview = async (
  orderId: string,
  reviewData: {
    rating: number;
    tags: string[];
    comment: string;
    images?: string[];
  }
): Promise<ServiceOrder | null> => {
  try {
    const orders = await getOrders();
    const index = orders.findIndex(order => order.id === orderId);

    if (index === -1) {
      console.error('订单不存在');
      return null;
    }

    const order = orders[index];

    // 更新订单评价信息
    const updatedOrder: ServiceOrder = {
      ...order,
      employerReview: {
        rating: reviewData.rating,
        tags: reviewData.tags,
        comment: reviewData.comment,
        images: reviewData.images,
        createdAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_ORDERS, JSON.stringify(orders));

    return updatedOrder;
  } catch (error) {
    console.error('提交评价失败:', error);
    throw error;
  }
};

// ==================== 帖子互动服务函数 ====================

/**
 * 点赞帖子（支持点赞/取消点赞）
 */
export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // 获取所有点赞数据
    const likesData = await AsyncStorage.getItem(STORAGE_KEYS.POST_LIKES);
    const likes: Record<string, Record<string, boolean>> = likesData ? JSON.parse(likesData) : {};

    // 初始化该帖子的点赞记录
    if (!likes[postId]) {
      likes[postId] = {};
    }

    // 切换点赞状态
    const isLiked = !likes[postId][userId];
    if (isLiked) {
      likes[postId][userId] = true;
    } else {
      delete likes[postId][userId];
    }

    // 保存点赞数据
    await AsyncStorage.setItem(STORAGE_KEYS.POST_LIKES, JSON.stringify(likes));

    // 更新帖子的点赞数
    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      const likeCount = Object.keys(likes[postId] || {}).length;
      posts[postIndex] = {
        ...posts[postIndex],
        likes: likeCount,
        likeCount: likeCount,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    }

    return isLiked;
  } catch (error) {
    console.error('点赞帖子失败:', error);
    throw error;
  }
};

/**
 * 收藏帖子（支持收藏/取消收藏）
 */
export const favoritePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // 获取所有收藏数据
    const favoritesData = await AsyncStorage.getItem(STORAGE_KEYS.POST_FAVORITES);
    const favorites: Record<string, Record<string, boolean>> = favoritesData ? JSON.parse(favoritesData) : {};

    // 初始化该帖子的收藏记录
    if (!favorites[postId]) {
      favorites[postId] = {};
    }

    // 切换收藏状态
    const isFavorited = !favorites[postId][userId];
    if (isFavorited) {
      favorites[postId][userId] = true;
    } else {
      delete favorites[postId][userId];
    }

    // 保存收藏数据
    await AsyncStorage.setItem(STORAGE_KEYS.POST_FAVORITES, JSON.stringify(favorites));

    // 更新帖子的收藏数
    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      const favoriteCount = Object.keys(favorites[postId] || {}).length;
      posts[postIndex] = {
        ...posts[postIndex],
        favorites: favoriteCount,
        favoriteCount: favoriteCount,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    }

    return isFavorited;
  } catch (error) {
    console.error('收藏帖子失败:', error);
    throw error;
  }
};

/**
 * 发布评论
 */
export const commentPost = async (
  postId: string,
  commentData: {
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
  }
): Promise<Comment> => {
  try {
    // 获取所有评论数据
    const commentsData = await AsyncStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
    const allComments: Record<string, Comment[]> = commentsData ? JSON.parse(commentsData) : {};

    // 初始化该帖子的评论列表
    if (!allComments[postId]) {
      allComments[postId] = [];
    }

    // 创建新评论
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      user: {
        name: commentData.userName,
        avatar: commentData.userAvatar,
        verified: false,
      },
      content: commentData.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    // 添加到评论列表
    allComments[postId].unshift(newComment);

    // 保存评论数据
    await AsyncStorage.setItem(STORAGE_KEYS.POST_COMMENTS, JSON.stringify(allComments));

    // 更新帖子的评论数
    const posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex] = {
        ...posts[postIndex],
        comments: allComments[postId].length,
        commentCount: allComments[postId].length,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    }

    return newComment;
  } catch (error) {
    console.error('发布评论失败:', error);
    throw error;
  }
};

/**
 * 获取帖子评论列表
 */
export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const commentsData = await AsyncStorage.getItem(STORAGE_KEYS.POST_COMMENTS);
    const allComments: Record<string, Comment[]> = commentsData ? JSON.parse(commentsData) : {};
    return allComments[postId] || [];
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return [];
  }
};

/**
 * 检查用户是否点赞了帖子
 */
export const isPostLiked = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const likesData = await AsyncStorage.getItem(STORAGE_KEYS.POST_LIKES);
    const likes: Record<string, Record<string, boolean>> = likesData ? JSON.parse(likesData) : {};
    return !!(likes[postId] && likes[postId][userId]);
  } catch (error) {
    console.error('检查点赞状态失败:', error);
    return false;
  }
};

/**
 * 检查用户是否收藏了帖子
 */
export const isPostFavorited = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const favoritesData = await AsyncStorage.getItem(STORAGE_KEYS.POST_FAVORITES);
    const favorites: Record<string, Record<string, boolean>> = favoritesData ? JSON.parse(favoritesData) : {};
    return !!(favorites[postId] && favorites[postId][userId]);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
};

// ==================== 清除数据函数 ====================

export const clearCommunityData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.COMMUNITY_JOBS,
      STORAGE_KEYS.COMMUNITY_EXPERTS,
      STORAGE_KEYS.COMMUNITY_ORDERS,
      STORAGE_KEYS.COMMUNITY_SECONDHAND,
      STORAGE_KEYS.COMMUNITY_POSTS,
      STORAGE_KEYS.COMMUNITY_CHATS,
      STORAGE_KEYS.MY_EXPERT_PROFILE,
      STORAGE_KEYS.POST_LIKES,
      STORAGE_KEYS.POST_FAVORITES,
      STORAGE_KEYS.POST_COMMENTS,
    ]);
    console.log('社区数据已清除');
  } catch (error) {
    console.error('清除社区数据失败:', error);
    throw error;
  }
};
