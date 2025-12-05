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
  ExpertType,
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

// ==================== 达人认证费用配置 ====================

/**
 * 达人认证费用 (年费)
 */
export const EXPERT_CERTIFICATION_PRICES = {
  [ExpertType.PERSONAL]: 500, // 个人达人 ¥500/年
  [ExpertType.BUSINESS]: 2000, // 商家达人 ¥2000/年
};

/**
 * 购买达人认证
 */
export const purchaseExpertCertification = async (
  expertId: string,
  expertType: ExpertType
): Promise<Expert> => {
  try {
    const expert = await getExpertById(expertId);
    if (!expert) {
      throw new Error('达人信息不存在');
    }

    const now = new Date();
    const expireDate = new Date(now);
    expireDate.setFullYear(expireDate.getFullYear() + 1); // 一年有效期

    const certificationFee = EXPERT_CERTIFICATION_PRICES[expertType];

    const updatedExpert = await updateExpertProfile(expertId, {
      expertType,
      certificationFee,
      certPurchaseDate: now.toISOString(),
      certExpireDate: expireDate.toISOString(),
      certStatus: ExpertCertStatus.VERIFIED,
    });

    if (!updatedExpert) {
      throw new Error('更新达人认证失败');
    }

    console.log(`达人 ${expertId} 成功购买 ${expertType} 认证，有效期至 ${expireDate.toISOString()}`);
    return updatedExpert;
  } catch (error) {
    console.error('购买达人认证失败:', error);
    throw error;
  }
};

/**
 * 续费达人认证
 */
export const renewExpertCertification = async (expertId: string): Promise<Expert> => {
  try {
    const expert = await getExpertById(expertId);
    if (!expert) {
      throw new Error('达人信息不存在');
    }

    if (!expert.expertType) {
      throw new Error('达人未认证，请先购买认证');
    }

    const now = new Date();
    const currentExpiry = expert.certExpireDate ? new Date(expert.certExpireDate) : now;
    const newExpiry = currentExpiry > now ? currentExpiry : now;
    newExpiry.setFullYear(newExpiry.getFullYear() + 1); // 延长一年

    const updatedExpert = await updateExpertProfile(expertId, {
      certExpireDate: newExpiry.toISOString(),
    });

    if (!updatedExpert) {
      throw new Error('续费达人认证失败');
    }

    console.log(`达人 ${expertId} 成功续费认证，有效期至 ${newExpiry.toISOString()}`);
    return updatedExpert;
  } catch (error) {
    console.error('续费达人认证失败:', error);
    throw error;
  }
};

/**
 * 检查达人认证是否过期
 */
export const checkCertificationExpiry = async (expertId: string): Promise<{
  isExpired: boolean;
  daysLeft: number | null;
  expireDate: string | null;
}> => {
  try {
    const expert = await getExpertById(expertId);
    if (!expert || !expert.certExpireDate) {
      return { isExpired: true, daysLeft: null, expireDate: null };
    }

    const now = new Date();
    const expiry = new Date(expert.certExpireDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isExpired: diffDays <= 0,
      daysLeft: diffDays > 0 ? diffDays : 0,
      expireDate: expert.certExpireDate,
    };
  } catch (error) {
    console.error('检查达人认证过期失败:', error);
    return { isExpired: true, daysLeft: null, expireDate: null };
  }
};

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
      images: ['https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=400'],
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
      images: ['https://images.pexels.com/photos/5794567/pexels-photo-5794567.jpeg?auto=compress&cs=tinysrgb&w=400'],
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
      images: ['https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=400'],
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
      images: ['https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=400'],
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
      images: ['https://images.pexels.com/photos/7551668/pexels-photo-7551668.jpeg?auto=compress&cs=tinysrgb&w=400'],
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
      images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'],
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
      expertType: ExpertType.PERSONAL,
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
      expertType: ExpertType.PERSONAL,
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
      expertType: ExpertType.PERSONAL,
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
    // ==================== 个人达人 (expert_004 - expert_010) ====================
    {
      id: 'expert_004',
      userId: 'user_expert_004',
      name: '王大姐',
      avatar: '👩',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.HOUSEKEEPING, ServiceType.COOKING],
      serviceArea: ['福田区', '罗湖区'],
      introduction: '专业家政服务15年，擅长家庭保洁和家常菜烹饪。',
      skillDescription: '持有家政服务员高级证书，熟悉各类清洁工具使用，擅长粤菜、川菜家常菜制作。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.HOUSEKEEPING]: { basePrice: 60, unit: '小时' },
        [ServiceType.COOKING]: { basePrice: 100, unit: '次' },
      },
      totalOrders: 89,
      completedOrders: 87,
      rating: 4.9,
      goodReviewRate: 98,
      responseTime: '3分钟',
      badges: ['金牌服务', '快速响应'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_005',
      userId: 'user_expert_005',
      name: '李师傅',
      avatar: '👨‍🔧',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.REPAIR, ServiceType.IT_SUPPORT],
      serviceArea: ['南山区', '宝安区'],
      introduction: '水电维修老师傅，同时精通电脑手机维护。',
      skillDescription: '20年水电维修经验，持有电工证。熟悉Windows/Mac系统维护，手机故障排查。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.REPAIR]: { basePrice: 80, unit: '次' },
        [ServiceType.IT_SUPPORT]: { basePrice: 50, unit: '小时' },
      },
      totalOrders: 56,
      completedOrders: 55,
      rating: 4.7,
      goodReviewRate: 96,
      responseTime: '8分钟',
      badges: ['优质服务', '专业认证'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_006',
      userId: 'user_expert_006',
      name: '陈老师',
      avatar: '👨‍🏫',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.PHONE_TEACH, ServiceType.TUTORING],
      serviceArea: ['福田区', '南山区', '罗湖区'],
      introduction: '退休中学教师，耐心教老年人使用智能手机和电脑。',
      skillDescription: '30年教学经验，擅长将复杂操作简单化，专门针对老年人的学习特点设计课程。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.PHONE_TEACH]: { basePrice: 60, unit: '小时' },
        [ServiceType.TUTORING]: { basePrice: 80, unit: '小时' },
      },
      totalOrders: 123,
      completedOrders: 120,
      rating: 4.9,
      goodReviewRate: 99,
      responseTime: '5分钟',
      badges: ['金牌服务', '好评如潮', '耐心细致'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_007',
      userId: 'user_expert_007',
      name: '周阿姨',
      avatar: '👵',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: false,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.ELDERCARE, ServiceType.COMPANION],
      serviceArea: ['罗湖区'],
      introduction: '有爱心的陪护阿姨，专门照顾行动不便的老人。',
      skillDescription: '5年养老院工作经验，了解老年人心理，擅长与老人沟通交流。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.ELDERCARE]: { basePrice: 150, unit: '天' },
        [ServiceType.COMPANION]: { basePrice: 40, unit: '小时' },
      },
      totalOrders: 34,
      completedOrders: 33,
      rating: 4.8,
      goodReviewRate: 97,
      responseTime: '15分钟',
      badges: ['优质服务', '有爱心'],
      isOnline: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_008',
      userId: 'user_expert_008',
      name: '孙大哥',
      avatar: '👨',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.NEWBIE,
      serviceTypes: [ServiceType.MOVING, ServiceType.DELIVERY],
      serviceArea: ['宝安区', '龙华区'],
      introduction: '年轻力壮，专业搬家和跑腿服务。',
      skillDescription: '有面包车，可提供小型搬家服务。跑腿代购效率高，熟悉周边商圈。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.MOVING]: { basePrice: 200, unit: '次' },
        [ServiceType.DELIVERY]: { basePrice: 20, unit: '次' },
      },
      totalOrders: 8,
      completedOrders: 8,
      rating: 5.0,
      goodReviewRate: 100,
      responseTime: '2分钟',
      badges: ['新手达人', '快速响应'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_009',
      userId: 'user_expert_009',
      name: '吴姐',
      avatar: '👩‍🍳',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.MEAL_PREP, ServiceType.COOKING],
      serviceArea: ['南山区'],
      introduction: '营养师背景，专注老年人健康饮食搭配。',
      skillDescription: '持有公共营养师证书，擅长低盐低糖、软烂易消化的老年餐制作。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.MEAL_PREP]: { basePrice: 80, unit: '餐' },
        [ServiceType.COOKING]: { basePrice: 120, unit: '次' },
      },
      totalOrders: 67,
      completedOrders: 65,
      rating: 4.8,
      goodReviewRate: 96,
      responseTime: '10分钟',
      badges: ['优质服务', '营养专家'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_010',
      userId: 'user_expert_010',
      name: '郑叔',
      avatar: '👴',
      expertType: ExpertType.PERSONAL,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: false,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.GARDENING, ServiceType.PET_CARE],
      serviceArea: ['福田区', '南山区'],
      introduction: '园艺爱好者，也喜欢小动物，提供花草养护和宠物照看。',
      skillDescription: '退休后专注园艺10年，熟悉各类花卉养护。家有猫狗，有丰富的宠物照顾经验。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.GARDENING]: { basePrice: 100, unit: '次' },
        [ServiceType.PET_CARE]: { basePrice: 50, unit: '天' },
      },
      totalOrders: 28,
      completedOrders: 27,
      rating: 4.7,
      goodReviewRate: 93,
      responseTime: '20分钟',
      badges: ['优质服务'],
      isOnline: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    // ==================== 商家达人 (expert_011 - expert_020) ====================
    {
      id: 'expert_011',
      userId: 'user_expert_011',
      name: '康养堂养生馆',
      avatar: '🏪',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.HALL_OF_FAME,
      serviceTypes: [ServiceType.MASSAGE, ServiceType.YOGA],
      serviceArea: ['福田区', '南山区', '罗湖区'],
      introduction: '专业中医养生馆，提供推拿按摩、艾灸理疗、养生瑜伽等服务。',
      skillDescription: '10年品牌，拥有多名持证技师。专注中老年人群养生保健，提供上门服务。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.MASSAGE]: { basePrice: 180, unit: '小时' },
        [ServiceType.YOGA]: { basePrice: 100, unit: '节' },
      },
      totalOrders: 456,
      completedOrders: 450,
      rating: 4.9,
      goodReviewRate: 98,
      responseTime: '5分钟',
      badges: ['殿堂级大师', '品牌商家', '专业认证'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_012',
      userId: 'user_expert_012',
      name: '金鱼世界水族馆',
      avatar: '🐠',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.PET_CARE, ServiceType.OTHER],
      serviceArea: ['南山区', '宝安区'],
      introduction: '专业观赏鱼养殖销售，提供鱼缸维护、水质调理、鱼病治疗等服务。',
      skillDescription: '15年观赏鱼行业经验，精通金鱼、锦鲤、热带鱼养殖。提供上门鱼缸清洁维护服务。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.PET_CARE]: { basePrice: 150, unit: '次' },
        [ServiceType.OTHER]: { basePrice: 200, unit: '次' },
      },
      totalOrders: 89,
      completedOrders: 88,
      rating: 4.8,
      goodReviewRate: 97,
      responseTime: '10分钟',
      badges: ['金牌服务', '品牌商家'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_013',
      userId: 'user_expert_013',
      name: '雅韵文玩阁',
      avatar: '🏺',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.HANDICRAFT, ServiceType.OTHER],
      serviceArea: ['罗湖区', '福田区'],
      introduction: '文玩古董鉴赏交流，提供核桃、菩提、玉石等文玩保养指导。',
      skillDescription: '20年文玩收藏经验，擅长各类文玩鉴定、保养、盘玩指导。定期举办文玩交流会。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.HANDICRAFT]: { basePrice: 100, unit: '小时' },
        [ServiceType.OTHER]: { basePrice: 200, unit: '次' },
      },
      totalOrders: 67,
      completedOrders: 65,
      rating: 4.9,
      goodReviewRate: 98,
      responseTime: '15分钟',
      badges: ['金牌服务', '文玩大师'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_014',
      userId: 'user_expert_014',
      name: '夕阳红舞蹈队',
      avatar: '💃',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.HALL_OF_FAME,
      serviceTypes: [ServiceType.DANCE, ServiceType.FITNESS],
      serviceArea: ['福田区', '南山区', '罗湖区', '宝安区'],
      introduction: '专业广场舞教学团队，提供广场舞、民族舞、交谊舞教学。',
      skillDescription: '市级广场舞比赛获奖团队，专业舞蹈老师授课。提供小区上门教学，可组织比赛活动。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.DANCE]: { basePrice: 50, unit: '节' },
        [ServiceType.FITNESS]: { basePrice: 40, unit: '节' },
      },
      totalOrders: 234,
      completedOrders: 230,
      rating: 5.0,
      goodReviewRate: 99,
      responseTime: '5分钟',
      badges: ['殿堂级大师', '获奖团队', '好评如潮'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_015',
      userId: 'user_expert_015',
      name: '梨园春戏曲社',
      avatar: '🎭',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.MUSIC, ServiceType.DANCE],
      serviceArea: ['罗湖区', '福田区'],
      introduction: '传统戏曲教学，京剧、粤剧、黄梅戏等剧种入门学习。',
      skillDescription: '多位专业戏曲演员授课，从基本功到唱腔身段系统教学。适合零基础老年人学习。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.MUSIC]: { basePrice: 80, unit: '节' },
        [ServiceType.DANCE]: { basePrice: 80, unit: '节' },
      },
      totalOrders: 78,
      completedOrders: 76,
      rating: 4.8,
      goodReviewRate: 96,
      responseTime: '20分钟',
      badges: ['金牌服务', '传统文化'],
      isOnline: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_016',
      userId: 'user_expert_016',
      name: '乐龄书画院',
      avatar: '🎨',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.PAINTING, ServiceType.WRITING],
      serviceArea: ['南山区'],
      introduction: '老年书法绘画培训，国画、书法、素描等课程。',
      skillDescription: '美院退休教授创办，专为老年人设计课程，进度慢、耐心足。提供画材和场地。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.PAINTING]: { basePrice: 60, unit: '节' },
        [ServiceType.WRITING]: { basePrice: 50, unit: '节' },
      },
      totalOrders: 45,
      completedOrders: 44,
      rating: 4.9,
      goodReviewRate: 98,
      responseTime: '30分钟',
      badges: ['优质服务', '名师授课'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_017',
      userId: 'user_expert_017',
      name: '福康家政服务中心',
      avatar: '🏠',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.HALL_OF_FAME,
      serviceTypes: [ServiceType.HOUSEKEEPING, ServiceType.ELDERCARE],
      serviceArea: ['福田区', '罗湖区', '南山区', '宝安区'],
      introduction: '专业家政公司，提供保洁、老人护理、月嫂等服务。',
      skillDescription: '正规注册家政公司，所有员工经过专业培训和背景调查。提供保险保障。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.HOUSEKEEPING]: { basePrice: 50, unit: '小时' },
        [ServiceType.ELDERCARE]: { basePrice: 200, unit: '天' },
      },
      totalOrders: 567,
      completedOrders: 560,
      rating: 4.8,
      goodReviewRate: 97,
      responseTime: '3分钟',
      badges: ['殿堂级大师', '品牌商家', '有保险'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_018',
      userId: 'user_expert_018',
      name: '悦动太极馆',
      avatar: '🥋',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.FITNESS, ServiceType.YOGA],
      serviceArea: ['南山区', '福田区'],
      introduction: '太极拳、八段锦、五禽戏等传统养生功法教学。',
      skillDescription: '国家级武术教练授课，专注中老年人养生运动。提供晨练班、周末班等多种班型。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.FITNESS]: { basePrice: 30, unit: '节' },
        [ServiceType.YOGA]: { basePrice: 40, unit: '节' },
      },
      totalOrders: 156,
      completedOrders: 154,
      rating: 4.9,
      goodReviewRate: 98,
      responseTime: '10分钟',
      badges: ['金牌服务', '国家级教练'],
      isOnline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_019',
      userId: 'user_expert_019',
      name: '虫趣乐园',
      avatar: '🦗',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.QUALITY,
      serviceTypes: [ServiceType.PET_CARE, ServiceType.OTHER],
      serviceArea: ['罗湖区'],
      introduction: '蟋蟀、蝈蝈、金铃子等鸣虫养殖销售，提供养护指导。',
      skillDescription: '传承三代的鸣虫世家，精通各类鸣虫挑选、饲养、调教。提供鸣虫用品和上门指导。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.PET_CARE]: { basePrice: 50, unit: '次' },
        [ServiceType.OTHER]: { basePrice: 100, unit: '次' },
      },
      totalOrders: 34,
      completedOrders: 33,
      rating: 4.7,
      goodReviewRate: 94,
      responseTime: '25分钟',
      badges: ['优质服务', '传统技艺'],
      isOnline: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'expert_020',
      userId: 'user_expert_020',
      name: '银发摄影工作室',
      avatar: '📷',
      expertType: ExpertType.BUSINESS,
      certStatus: ExpertCertStatus.VERIFIED,
      realNameVerified: true,
      skillVerified: true,
      level: ExpertLevel.GOLD,
      serviceTypes: [ServiceType.PHOTOGRAPHY, ServiceType.VIDEO_EDITING],
      serviceArea: ['福田区', '南山区', '罗湖区'],
      introduction: '专注老年人摄影服务，金婚照、全家福、个人写真等。',
      skillDescription: '专业摄影团队，提供化妆、服装、道具一站式服务。可上门拍摄，照片精修交付。',
      certificates: [],
      showcaseImages: [],
      pricing: {
        [ServiceType.PHOTOGRAPHY]: { basePrice: 300, unit: '套' },
        [ServiceType.VIDEO_EDITING]: { basePrice: 200, unit: '个' },
      },
      totalOrders: 89,
      completedOrders: 87,
      rating: 4.9,
      goodReviewRate: 99,
      responseTime: '15分钟',
      badges: ['金牌服务', '专业团队'],
      isOnline: true,
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
    // ==================== 健康设备类 (10件) ====================
    {
      id: 'item_001',
      sellerId: 'user_003',
      sellerName: '陈先生',
      sellerAvatar: '👨‍💼',
      sellerRating: 4.8,
      title: '欧姆龙血压计 95成新',
      description: '家里老人用的血压计，买了3个月，几乎全新。因为换了带蓝牙的新款，这台闲置出售。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/7904482/pexels-photo-7904482.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 180,
      originalPrice: 299,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '3个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '南山区科技园', district: '南山区' },
      status: ItemStatus.AVAILABLE,
      views: 32,
      favorites: 5,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_002',
      sellerId: 'user_008',
      sellerName: '郑先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '罗氏血糖仪套装转让',
      description: '罗氏血糖仪，配50片试纸和采血针。老人已经不用了，9成新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 380,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '4个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '昌平区回龙观', district: '昌平区' },
      status: ItemStatus.AVAILABLE,
      views: 38,
      favorites: 6,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_003',
      sellerId: 'user_011',
      sellerName: '钱女士',
      sellerAvatar: '👩',
      sellerRating: 4.8,
      title: '电子体温计免费送',
      description: '多买了一个，免费赠送给需要的朋友。全新未拆封，自取即可。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 0,
      isFree: true,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '丰台区马家堡', district: '丰台区' },
      status: ItemStatus.AVAILABLE,
      views: 85,
      favorites: 22,
      publishTime: '3小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_004',
      sellerId: 'user_013',
      sellerName: '王阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.7,
      title: '鱼跃制氧机 家用型',
      description: '老人康复后不再需要，鱼跃制氧机，可调节流量1-5L，功能正常。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 800,
      originalPrice: 2500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '8个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区望京', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 56,
      favorites: 12,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_005',
      sellerId: 'user_014',
      sellerName: '李大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '脉搏血氧仪 全新',
      description: '指夹式血氧仪，全新未使用，测量准确，适合老年人日常监测。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 50,
      originalPrice: 99,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '2周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '海淀区中关村', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 28,
      favorites: 4,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_006',
      sellerId: 'user_015',
      sellerName: '张女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '电子听诊器转让',
      description: '家用电子听诊器，可放大心肺音，适合居家健康监测，95新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 120,
      originalPrice: 280,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.DELIVERY],
      location: { address: '西城区金融街', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 19,
      favorites: 3,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_007',
      sellerId: 'user_016',
      sellerName: '刘先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '智能手环 监测心率睡眠',
      description: '小米手环7，可监测心率、血氧、睡眠，大字体适合老人，9成新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 100,
      originalPrice: 249,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '5个月前',
      usageDuration: '4个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '东城区王府井', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 45,
      favorites: 8,
      publishTime: '12小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_008',
      sellerId: 'user_017',
      sellerName: '赵阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.7,
      title: '雾化器 儿童老人通用',
      description: '欧姆龙雾化器，静音设计，操作简单，老人自己就能用，8成新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 200,
      originalPrice: 450,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '通州区梨园', district: '通州区' },
      status: ItemStatus.AVAILABLE,
      views: 33,
      favorites: 5,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_009',
      sellerId: 'user_018',
      sellerName: '孙先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '电子秤 精准体重计',
      description: '智能体重秤，可连接手机APP，记录体重变化趋势，全新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/4474052/pexels-photo-4474052.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 60,
      originalPrice: 129,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '大兴区黄村', district: '大兴区' },
      status: ItemStatus.AVAILABLE,
      views: 22,
      favorites: 3,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_010',
      sellerId: 'user_019',
      sellerName: '周女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '颈椎按摩仪 护颈神器',
      description: 'SKG颈椎按摩仪，多种模式，热敷功能，缓解颈部酸痛，95新。',
      category: ItemCategory.HEALTH_DEVICE,
      images: ['https://images.pexels.com/photos/5793687/pexels-photo-5793687.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 399,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '4个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '石景山区古城', district: '石景山区' },
      status: ItemStatus.AVAILABLE,
      views: 41,
      favorites: 7,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },

    // ==================== 健身器材类 (10件) ====================
    {
      id: 'item_011',
      sellerId: 'user_005',
      sellerName: '刘阿姨',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '九成新跑步机低价出售',
      description: '健身房级跑步机，买来用了不到10次，因搬家需要处理。功能完好，配件齐全。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 1200,
      originalPrice: 3500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '半年前',
      usageDuration: '不到1个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区建国门', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 95,
      favorites: 18,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_012',
      sellerId: 'user_010',
      sellerName: '赵先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '瑜伽垫+泡沫轴套装',
      description: '老人康复训练用的瑜伽垫和泡沫轴，8成新，厚度10mm，防滑耐用。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '5个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '海淀区五道口', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 47,
      favorites: 9,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_013',
      sellerId: 'user_012',
      sellerName: '冯大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '哑铃套装转让 2-10kg',
      description: '家用健身哑铃套装，2kg到10kg可调节，9成新，配专用收纳架。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 200,
      originalPrice: 450,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '8个月前',
      usageDuration: '4个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '西城区德胜门', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 72,
      favorites: 16,
      publishTime: '4天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_014',
      sellerId: 'user_020',
      sellerName: '吴先生',
      sellerAvatar: '👨',
      sellerRating: 4.7,
      title: '健身单车 静音款',
      description: '家用磁控健身单车，静音设计不扰邻，可调节阻力，9成新。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 500,
      originalPrice: 1200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '丰台区方庄', district: '丰台区' },
      status: ItemStatus.AVAILABLE,
      views: 63,
      favorites: 11,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_015',
      sellerId: 'user_021',
      sellerName: '郑阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.8,
      title: '弹力带套装 康复训练',
      description: '5条不同阻力弹力带，适合老年人康复训练，全新未使用。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4498155/pexels-photo-4498155.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 30,
      originalPrice: 79,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '2周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '东城区安定门', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 25,
      favorites: 4,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_016',
      sellerId: 'user_022',
      sellerName: '陈大爷',
      sellerAvatar: '👴',
      sellerRating: 4.6,
      title: '太极剑+剑穗 全新',
      description: '不锈钢太极剑，配红色剑穗，全新未使用，适合晨练太极。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/8112178/pexels-photo-8112178.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 150,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区劲松', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 18,
      favorites: 2,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_017',
      sellerId: 'user_023',
      sellerName: '林女士',
      sellerAvatar: '👩',
      sellerRating: 4.9,
      title: '脚踏器 办公桌下健身',
      description: '迷你脚踏器，可放在办公桌下或沙发前使用，老人看电视时锻炼，95新。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 100,
      originalPrice: 259,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '4个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '昌平区天通苑', district: '昌平区' },
      status: ItemStatus.AVAILABLE,
      views: 36,
      favorites: 6,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_018',
      sellerId: 'user_024',
      sellerName: '黄先生',
      sellerAvatar: '👨',
      sellerRating: 4.7,
      title: '握力器+指力器套装',
      description: '可调节握力器和指力器，锻炼手部力量，预防老年痴呆，全新。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 25,
      originalPrice: 59,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '3周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '大兴区亦庄', district: '大兴区' },
      status: ItemStatus.AVAILABLE,
      views: 14,
      favorites: 2,
      publishTime: '12小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_019',
      sellerId: 'user_025',
      sellerName: '许阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.8,
      title: '划船机 全身锻炼',
      description: '家用划船机，可折叠收纳，适合全身有氧运动，8成新。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4162579/pexels-photo-4162579.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 600,
      originalPrice: 1500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '海淀区西二旗', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 52,
      favorites: 9,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_020',
      sellerId: 'user_026',
      sellerName: '高先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '仰卧起坐板 可调节',
      description: '多功能仰卧起坐板，角度可调，适合居家锻炼，9成新。',
      category: ItemCategory.FITNESS,
      images: ['https://images.pexels.com/photos/4162452/pexels-photo-4162452.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 350,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '5个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区三里屯', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 29,
      favorites: 5,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },

    // ==================== 辅助用品类 (10件) ====================
    {
      id: 'item_021',
      sellerId: 'user_004',
      sellerName: '李女士',
      sellerAvatar: '👩',
      sellerRating: 4.9,
      title: '轮椅免费赠送',
      description: '老人康复后不再需要，轮椅9成新，免费赠送给有需要的人。自取。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 0,
      isFree: true,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '福田区华强北', district: '福田区' },
      status: ItemStatus.AVAILABLE,
      views: 68,
      favorites: 12,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_022',
      sellerId: 'user_006',
      sellerName: '周大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '助听器转让（全新未拆封）',
      description: '儿子买错型号了，全新未拆封的助听器，原价2800，现在低价转让。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 1800,
      originalPrice: 2800,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '通州区北关', district: '通州区' },
      status: ItemStatus.AVAILABLE,
      views: 42,
      favorites: 8,
      publishTime: '12小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_023',
      sellerId: 'user_009',
      sellerName: '孙女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '拐杖一副 全新',
      description: '买来老人不喜欢，全新未使用的拐杖，可调节高度，铝合金材质。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 50,
      originalPrice: 120,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '朝阳区CBD', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 25,
      favorites: 4,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_024',
      sellerId: 'user_027',
      sellerName: '马先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '护理床 电动升降',
      description: '多功能电动护理床，可调节背部和腿部角度，带护栏，8成新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 1500,
      originalPrice: 4500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '2年前',
      usageDuration: '1年',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '丰台区南苑', district: '丰台区' },
      status: ItemStatus.AVAILABLE,
      views: 78,
      favorites: 15,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_025',
      sellerId: 'user_028',
      sellerName: '谢阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.6,
      title: '助行器 四轮带座',
      description: '老人康复用助行器，四轮设计，带折叠座椅，走累了可以坐下休息，9成新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 300,
      originalPrice: 680,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '8个月前',
      usageDuration: '4个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '西城区广安门', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 34,
      favorites: 6,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_026',
      sellerId: 'user_029',
      sellerName: '韩先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '防褥疮气垫床 带泵',
      description: '医用防褥疮气垫床，自动充气，适合长期卧床老人，95新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 400,
      originalPrice: 900,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '海淀区上地', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 45,
      favorites: 8,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_027',
      sellerId: 'user_030',
      sellerName: '唐女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '坐便椅 可折叠',
      description: '老人移动坐便椅，可折叠收纳，高度可调，8成新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/6129681/pexels-photo-6129681.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区双井', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 21,
      favorites: 3,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_028',
      sellerId: 'user_031',
      sellerName: '蔡大爷',
      sellerAvatar: '👴',
      sellerRating: 4.8,
      title: '沐浴椅 防滑设计',
      description: '老人洗澡专用椅，铝合金材质，防滑脚垫，可调节高度，全新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/5645053/pexels-photo-5645053.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 100,
      originalPrice: 220,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '2周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '东城区崇文门', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 16,
      favorites: 2,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_029',
      sellerId: 'user_032',
      sellerName: '潘女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '电动轮椅 智能遥控',
      description: '老人电动轮椅，锂电池续航30公里，可折叠，遥控操作，9成新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/7551668/pexels-photo-7551668.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 2500,
      originalPrice: 6000,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '10个月前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '通州区运河', district: '通州区' },
      status: ItemStatus.AVAILABLE,
      views: 89,
      favorites: 18,
      publishTime: '4天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_030',
      sellerId: 'user_033',
      sellerName: '罗先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '起身器 辅助站立',
      description: '老人起身辅助器，床边扶手设计，帮助老人安全站立，全新。',
      category: ItemCategory.ASSISTIVE,
      images: ['https://images.pexels.com/photos/7551682/pexels-photo-7551682.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 320,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '大兴区旧宫', district: '大兴区' },
      status: ItemStatus.AVAILABLE,
      views: 27,
      favorites: 4,
      publishTime: '3小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },

    // ==================== 日常用品类 (10件) ====================
    {
      id: 'item_031',
      sellerId: 'user_034',
      sellerName: '曹阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.7,
      title: '老花镜套装 3副',
      description: '不同度数老花镜3副（150度、200度、250度），9成新，配镜盒。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/947885/pexels-photo-947885.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 50,
      originalPrice: 150,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '海淀区清河', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 23,
      favorites: 4,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_032',
      sellerId: 'user_035',
      sellerName: '邓先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '放大镜 LED带灯',
      description: '10倍放大镜，LED照明，适合老人阅读看报，全新未使用。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 30,
      originalPrice: 69,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '2周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '朝阳区高碑店', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 15,
      favorites: 2,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_033',
      sellerId: 'user_036',
      sellerName: '萧女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '智能药盒 定时提醒',
      description: '一周7格智能药盒，定时提醒吃药，语音播报，9成新。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 180,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '4个月前',
      usageDuration: '2个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '丰台区宋家庄', district: '丰台区' },
      status: ItemStatus.AVAILABLE,
      views: 32,
      favorites: 5,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_034',
      sellerId: 'user_037',
      sellerName: '田大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '老人手机 大字大声',
      description: '飞利浦老人手机，大字体大音量，SOS紧急呼叫，电池耐用，95新。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 399,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '8个月前',
      usageDuration: '5个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '西城区牛街', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 41,
      favorites: 7,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_035',
      sellerId: 'user_038',
      sellerName: '夏女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '防滑垫 浴室专用',
      description: '浴室防滑垫3块，吸盘设计，防止老人摔倒，全新未使用。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 40,
      originalPrice: 99,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '东城区和平里', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 18,
      favorites: 3,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_036',
      sellerId: 'user_039',
      sellerName: '贺先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '夜灯 人体感应',
      description: '智能感应夜灯5个，老人起夜自动亮，全新未使用。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 60,
      originalPrice: 129,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '3周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '昌平区沙河', district: '昌平区' },
      status: ItemStatus.AVAILABLE,
      views: 26,
      favorites: 4,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_037',
      sellerId: 'user_040',
      sellerName: '苏阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.6,
      title: '保温杯 大容量1L',
      description: '象印保温杯1L，保温24小时，适合老人喝温水，9成新。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '5个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '朝阳区十里堡', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 19,
      favorites: 3,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_038',
      sellerId: 'user_041',
      sellerName: '程先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '收音机 复古风格',
      description: '德生收音机，FM/AM双波段，音质清晰，老人听戏曲必备，95新。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-159613.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 60,
      originalPrice: 150,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '4个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '石景山区苹果园', district: '石景山区' },
      status: ItemStatus.AVAILABLE,
      views: 24,
      favorites: 4,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_039',
      sellerId: 'user_042',
      sellerName: '余女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '足浴盆 自动加热',
      description: '美的足浴盆，自动加热恒温，按摩滚轮，老人泡脚养生，8成新。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/3865792/pexels-photo-3865792.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 100,
      originalPrice: 280,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '8个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '通州区九棵树', district: '通州区' },
      status: ItemStatus.AVAILABLE,
      views: 35,
      favorites: 6,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_040',
      sellerId: 'user_043',
      sellerName: '袁大爷',
      sellerAvatar: '👴',
      sellerRating: 4.8,
      title: 'GPS定位器 老人防走失',
      description: '老人防走失定位器，实时定位，一键SOS，适合健忘老人，全新。',
      category: ItemCategory.DAILY,
      images: ['https://images.pexels.com/photos/4792069/pexels-photo-4792069.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 120,
      originalPrice: 299,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '大兴区西红门', district: '大兴区' },
      status: ItemStatus.AVAILABLE,
      views: 38,
      favorites: 7,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },

    // ==================== 家具类 (10件) ====================
    {
      id: 'item_041',
      sellerId: 'user_007',
      sellerName: '吴女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '电动按摩椅出售',
      description: '老人不习惯用，8成新按摩椅，多种按摩模式，功能正常。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/4156293/pexels-photo-4156293.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 800,
      originalPrice: 2200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '2年前',
      usageDuration: '1年',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '大兴区枣园', district: '大兴区' },
      status: ItemStatus.AVAILABLE,
      views: 61,
      favorites: 14,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_042',
      sellerId: 'user_044',
      sellerName: '龚先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '适老化沙发 软硬适中',
      description: '老年人专用沙发，软硬适中不塌腰，扶手宽大方便起身，9成新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 1200,
      originalPrice: 3500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '1年前',
      usageDuration: '8个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区常营', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 67,
      favorites: 12,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_043',
      sellerId: 'user_045',
      sellerName: '翟阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.7,
      title: '电动护理床 带床垫',
      description: '家用电动护理床，带床垫，可调节多种姿势，适合长期卧床老人，8成新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 2000,
      originalPrice: 5500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '2年前',
      usageDuration: '1年半',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '海淀区田村', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 82,
      favorites: 16,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_044',
      sellerId: 'user_046',
      sellerName: '康先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '老人餐桌椅 可升降',
      description: '适老化餐桌椅套装，桌子高度可调，椅子带扶手，方便老人就餐，95新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 600,
      originalPrice: 1500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '8个月前',
      usageDuration: '5个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '丰台区大红门', district: '丰台区' },
      status: ItemStatus.AVAILABLE,
      views: 43,
      favorites: 8,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_045',
      sellerId: 'user_047',
      sellerName: '邱女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '床边扶手 可折叠',
      description: '床边安全扶手，可折叠不占地方，帮助老人安全起床，全新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 120,
      originalPrice: 280,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '西城区陶然亭', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 28,
      favorites: 5,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_046',
      sellerId: 'user_048',
      sellerName: '骆大爷',
      sellerAvatar: '👴',
      sellerRating: 4.8,
      title: '老人躺椅 午休神器',
      description: '多档位可调躺椅，午休看书两相宜，质量好很结实，9成新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 200,
      originalPrice: 450,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '4个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '东城区龙潭湖', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 37,
      favorites: 6,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_047',
      sellerId: 'user_049',
      sellerName: '文女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '马桶扶手 不锈钢',
      description: '马桶两侧安全扶手，不锈钢材质，帮助老人安全如厕，全新未安装。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 180,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '2周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '昌平区北七家', district: '昌平区' },
      status: ItemStatus.AVAILABLE,
      views: 21,
      favorites: 3,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_048',
      sellerId: 'user_050',
      sellerName: '侯先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '适老化床头柜 带抽屉',
      description: '老人床头柜，高度适中，带大抽屉和开放格，方便存放药品，95新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 350,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '5个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区酒仙桥', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 25,
      favorites: 4,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_049',
      sellerId: 'user_051',
      sellerName: '尤阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.6,
      title: '电视柜 矮款适老',
      description: '低矮电视柜，老人坐着就能看到电视，不用仰头，8成新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 300,
      originalPrice: 800,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '8个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '海淀区万寿路', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 32,
      favorites: 5,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_050',
      sellerId: 'user_052',
      sellerName: '邹先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '安全扶手套装 多个',
      description: '走廊、卫生间安全扶手套装，共5根，不锈钢材质，全新。',
      category: ItemCategory.FURNITURE,
      images: ['https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 200,
      originalPrice: 450,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '通州区马驹桥', district: '通州区' },
      status: ItemStatus.AVAILABLE,
      views: 29,
      favorites: 5,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },

    // ==================== 其他类 (10件) ====================
    {
      id: 'item_051',
      sellerId: 'user_053',
      sellerName: '毛女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '养生茶具套装',
      description: '紫砂壶养生茶具一套，配6个茶杯，适合老年人喝茶养生，95新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 150,
      originalPrice: 380,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '朝阳区大望路', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 34,
      favorites: 6,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_052',
      sellerId: 'user_054',
      sellerName: '段大爷',
      sellerAvatar: '👴',
      sellerRating: 4.9,
      title: '书法练习套装',
      description: '毛笔书法练习套装，含毛笔5支、墨汁、宣纸、砚台，全新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/6621329/pexels-photo-6621329.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 200,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '2周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '西城区南礼士路', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 22,
      favorites: 4,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_053',
      sellerId: 'user_055',
      sellerName: '雷女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '国画颜料套装 18色',
      description: '马利牌国画颜料18色，含毛笔和调色盘，老人绘画爱好首选，全新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 60,
      originalPrice: 150,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '海淀区颐和园', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 18,
      favorites: 3,
      publishTime: '5小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_054',
      sellerId: 'user_056',
      sellerName: '贾先生',
      sellerAvatar: '👨',
      sellerRating: 4.8,
      title: '围棋套装 云子',
      description: '云南围棋子+实木棋盘，适合老年人益智活动，9成新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/6806738/pexels-photo-6806738.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 200,
      originalPrice: 500,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '8个月前',
      usageDuration: '5个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '东城区北新桥', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 41,
      favorites: 7,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_055',
      sellerId: 'user_057',
      sellerName: '秦阿姨',
      sellerAvatar: '👵',
      sellerRating: 4.7,
      title: '钓鱼装备一套',
      description: '老人钓鱼爱好装备，含鱼竿、鱼线、鱼钩、鱼桶、马扎，8成新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 300,
      originalPrice: 800,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.GOOD,
      purchaseTime: '1年前',
      usageDuration: '6个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '丰台区丽泽桥', district: '丰台区' },
      status: ItemStatus.AVAILABLE,
      views: 56,
      favorites: 10,
      publishTime: '1天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_056',
      sellerId: 'user_058',
      sellerName: '叶先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '老人智能电视 55寸',
      description: '海信55寸智能电视，语音遥控，大字体界面，适合老人使用，95新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 1200,
      originalPrice: 2800,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '10个月前',
      usageDuration: '8个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '朝阳区太阳宫', district: '朝阳区' },
      status: ItemStatus.AVAILABLE,
      views: 78,
      favorites: 14,
      publishTime: '3天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_057',
      sellerId: 'user_059',
      sellerName: '阎女士',
      sellerAvatar: '👩',
      sellerRating: 4.6,
      title: '老年大学教材一套',
      description: '老年大学书法、绘画、音乐教材共8本，适合老年人学习，全新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 50,
      originalPrice: 120,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '3周前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '西城区月坛', district: '西城区' },
      status: ItemStatus.AVAILABLE,
      views: 15,
      favorites: 2,
      publishTime: '6小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_058',
      sellerId: 'user_060',
      sellerName: '樊大爷',
      sellerAvatar: '👴',
      sellerRating: 4.8,
      title: '二胡 红木材质',
      description: '红木二胡，音质纯正，配琴盒和松香，适合老年人学习乐器，9成新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/6671854/pexels-photo-6671854.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 400,
      originalPrice: 1000,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '6个月前',
      usageDuration: '3个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '海淀区蓟门桥', district: '海淀区' },
      status: ItemStatus.AVAILABLE,
      views: 47,
      favorites: 8,
      publishTime: '2天前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_059',
      sellerId: 'user_061',
      sellerName: '齐女士',
      sellerAvatar: '👩',
      sellerRating: 4.7,
      title: '便携式氧气瓶',
      description: '便携式氧气瓶2个，适合老人外出携带，全新未使用。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 80,
      originalPrice: 180,
      isFree: false,
      isNegotiable: false,
      currency: '¥',
      condition: ItemCondition.NEW,
      purchaseTime: '1个月前',
      usageDuration: '未使用',
      tradeMethods: [TradeMethod.PICKUP, TradeMethod.DELIVERY],
      location: { address: '东城区东直门', district: '东城区' },
      status: ItemStatus.AVAILABLE,
      views: 24,
      favorites: 4,
      publishTime: '8小时前',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'item_060',
      sellerId: 'user_062',
      sellerName: '彭先生',
      sellerAvatar: '👨',
      sellerRating: 4.9,
      title: '老人三轮车 电动代步',
      description: '老年代步电动三轮车，适合买菜接孙子，续航40公里，9成新。',
      category: ItemCategory.OTHER,
      images: ['https://images.pexels.com/photos/3671151/pexels-photo-3671151.jpeg?auto=compress&cs=tinysrgb&w=400'],
      currentPrice: 1800,
      originalPrice: 4000,
      isFree: false,
      isNegotiable: true,
      currency: '¥',
      condition: ItemCondition.EXCELLENT,
      purchaseTime: '1年前',
      usageDuration: '8个月',
      tradeMethods: [TradeMethod.PICKUP],
      location: { address: '大兴区庞各庄', district: '大兴区' },
      status: ItemStatus.AVAILABLE,
      views: 95,
      favorites: 18,
      publishTime: '1天前',
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
    // 分别检查各类数据是否存在，不存在则初始化
    const existingJobs = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_JOBS);
    const existingExperts = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_EXPERTS);
    const existingItems = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_SECONDHAND);
    const existingPosts = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    const existingChats = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_CHATS);

    // 初始化零工需求
    if (!existingJobs) {
      const jobs = initializeDefaultJobs();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_JOBS, JSON.stringify(jobs));
      console.log('零工需求数据初始化完成');
    }

    // 初始化达人数据 - 检查数量是否需要更新
    if (!existingExperts) {
      const experts = initializeDefaultExperts();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_EXPERTS, JSON.stringify(experts));
      console.log('达人数据初始化完成');
    } else {
      // 检查达人数量，如果少于20个则重新初始化
      const currentExperts = JSON.parse(existingExperts);
      if (currentExperts.length < 20) {
        const experts = initializeDefaultExperts();
        await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_EXPERTS, JSON.stringify(experts));
        console.log('达人数据已更新到20个');
      }
    }

    // 初始化二手商品
    if (!existingItems) {
      const items = initializeDefaultSecondHandItems();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_SECONDHAND, JSON.stringify(items));
      console.log('二手商品数据初始化完成');
    }

    // 初始化社区帖子
    if (!existingPosts) {
      const posts = initializeDefaultPosts();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
      console.log('社区帖子数据初始化完成');
    }

    // 初始化聊天会话
    if (!existingChats) {
      const conversations = initializeDefaultConversations();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_CHATS, JSON.stringify(conversations));
      console.log('聊天会话数据初始化完成');
    }

    // 初始化订单（空数组）
    const existingOrders = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_ORDERS);
    if (!existingOrders) {
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_ORDERS, JSON.stringify([]));
    }

    console.log('社区数据初始化检查完成');
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
    let items: SecondHandItem[] = [];

    if (data) {
      items = JSON.parse(data);
    } else {
      // 没有本地缓存时，初始化默认数据
      items = initializeDefaultSecondHandItems();
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_SECONDHAND, JSON.stringify(items));
    }

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

export const deleteItem = async (id: string): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_SECONDHAND);
    const items: SecondHandItem[] = data ? JSON.parse(data) : [];

    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_SECONDHAND, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('删除二手商品失败:', error);
    return false;
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
