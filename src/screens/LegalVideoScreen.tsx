import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

/**
 * Phase 36.1: 视频课堂 - Legal Video Classroom Screen
 *
 * Features:
 * - Video list with category display
 * - Video player page
 * - Course catalog (how to make valid wills, fraud prevention, etc.)
 * - Learning progress tracking
 * - Course bookmarking functionality
 */

// ==================== Type Definitions ====================

type ScreenStep = 'categories' | 'videoList' | 'videoPlayer';

interface VideoCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  videoCount: number;
  description: string;
}

interface LegalVideo {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  duration: number; // in seconds
  instructor: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views: number;
  likes: number;
  thumbnail: string;
  videoUrl: string;
  chapters: VideoChapter[];
  relatedVideos: string[];
}

interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
}

interface VideoProgress {
  videoId: string;
  watchedSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

interface Bookmark {
  videoId: string;
  bookmarkedAt: string;
}

// ==================== Mock Data ====================

const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'will',
    name: '遗嘱制作',
    icon: 'document-text',
    color: '#1890ff',
    videoCount: 12,
    description: '学习如何订立有效的遗嘱，避免法律纠纷',
  },
  {
    id: 'fraud_prevention',
    name: '防范诈骗',
    icon: 'shield-checkmark',
    color: '#52c41a',
    videoCount: 18,
    description: '识别常见养老诈骗手段，保护财产安全',
  },
  {
    id: 'inheritance',
    name: '继承法律',
    icon: 'people',
    color: '#faad14',
    videoCount: 10,
    description: '了解遗产继承规则，维护合法权益',
  },
  {
    id: 'property_rights',
    name: '财产权益',
    icon: 'home',
    color: '#722ed1',
    videoCount: 15,
    description: '保护房产、存款等财产权益',
  },
  {
    id: 'family_support',
    name: '赡养义务',
    icon: 'heart',
    color: '#eb2f96',
    videoCount: 8,
    description: '了解子女赡养义务，维护赡养权益',
  },
  {
    id: 'contract_law',
    name: '合同常识',
    icon: 'document',
    color: '#13c2c2',
    videoCount: 14,
    description: '学习合同签订注意事项，避免陷阱',
  },
];

const LEGAL_VIDEOS: LegalVideo[] = [
  // Will Making Videos
  {
    id: 'video_will_001',
    categoryId: 'will',
    title: '如何订立一份有效的遗嘱',
    description: '详细讲解遗嘱的法定形式要求、见证人规则、签字按手印注意事项等核心内容，帮助您订立合法有效的遗嘱。',
    duration: 1800, // 30 minutes
    instructor: '张明律师',
    difficulty: 'beginner',
    views: 15234,
    likes: 1289,
    thumbnail: 'will_basic',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '遗嘱的法定形式', startTime: 0 },
      { id: 'c2', title: '见证人的要求', startTime: 420 },
      { id: 'c3', title: '签字与按手印', startTime: 900 },
      { id: 'c4', title: '遗嘱的保管', startTime: 1320 },
    ],
    relatedVideos: ['video_will_002', 'video_will_003'],
  },
  {
    id: 'video_will_002',
    categoryId: 'will',
    title: '遗嘱公证全流程指南',
    description: '从准备材料、预约公证、公证流程到领取公证书，全程详解遗嘱公证的每个步骤。',
    duration: 1500,
    instructor: '王芳公证员',
    difficulty: 'intermediate',
    views: 9876,
    likes: 876,
    thumbnail: 'will_notarization',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '公证前的准备', startTime: 0 },
      { id: 'c2', title: '预约与提交材料', startTime: 360 },
      { id: 'c3', title: '公证员询问环节', startTime: 720 },
      { id: 'c4', title: '领取公证书', startTime: 1200 },
    ],
    relatedVideos: ['video_will_001', 'video_will_004'],
  },
  {
    id: 'video_will_003',
    categoryId: 'will',
    title: '遗嘱修改与撤销',
    description: '学习如何合法地修改或撤销已订立的遗嘱，避免多份遗嘱冲突。',
    duration: 1200,
    instructor: '李强律师',
    difficulty: 'intermediate',
    views: 7654,
    likes: 654,
    thumbnail: 'will_revise',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '遗嘱的法定撤销', startTime: 0 },
      { id: 'c2', title: '订立新遗嘱的注意事项', startTime: 480 },
      { id: 'c3', title: '多份遗嘱的效力判断', startTime: 840 },
    ],
    relatedVideos: ['video_will_001', 'video_will_002'],
  },
  {
    id: 'video_will_004',
    categoryId: 'will',
    title: '特殊情况下的遗嘱订立',
    description: '讲解危急情况下的口头遗嘱、录音录像遗嘱等特殊形式的遗嘱订立方法。',
    duration: 1680,
    instructor: '赵丽律师',
    difficulty: 'advanced',
    views: 5432,
    likes: 432,
    thumbnail: 'will_special',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '危急情况下的口头遗嘱', startTime: 0 },
      { id: 'c2', title: '录音录像遗嘱的要求', startTime: 600 },
      { id: 'c3', title: '特殊遗嘱的效力认定', startTime: 1200 },
    ],
    relatedVideos: ['video_will_001', 'video_will_003'],
  },

  // Fraud Prevention Videos
  {
    id: 'video_fraud_001',
    categoryId: 'fraud_prevention',
    title: '识破养老理财骗局',
    description: '揭露常见的养老理财诈骗手段：高息诱惑、养老基地投资、虚假金融产品等，教您如何识破骗局。',
    duration: 2100,
    instructor: '刘警官',
    difficulty: 'beginner',
    views: 23456,
    likes: 2145,
    thumbnail: 'fraud_financial',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '高息理财的陷阱', startTime: 0 },
      { id: 'c2', title: '养老基地投资骗局', startTime: 600 },
      { id: 'c3', title: '虚假金融产品识别', startTime: 1200 },
      { id: 'c4', title: '如何保护自己', startTime: 1680 },
    ],
    relatedVideos: ['video_fraud_002', 'video_fraud_003'],
  },
  {
    id: 'video_fraud_002',
    categoryId: 'fraud_prevention',
    title: '保健品诈骗全揭秘',
    description: '分析保健品诈骗的常见套路：免费体检、专家讲座、夸大疗效等，帮您避免上当受骗。',
    duration: 1920,
    instructor: '陈医生',
    difficulty: 'beginner',
    views: 18765,
    likes: 1654,
    thumbnail: 'fraud_health',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '免费体检的套路', startTime: 0 },
      { id: 'c2', title: '专家讲座的陷阱', startTime: 540 },
      { id: 'c3', title: '夸大疗效的识别', startTime: 1080 },
      { id: 'c4', title: '正规保健品的购买渠道', startTime: 1500 },
    ],
    relatedVideos: ['video_fraud_001', 'video_fraud_004'],
  },
  {
    id: 'video_fraud_003',
    categoryId: 'fraud_prevention',
    title: '电信网络诈骗防范',
    description: '讲解冒充公检法、冒充子女、中奖诈骗等常见电信诈骗手段及防范方法。',
    duration: 1740,
    instructor: '周警官',
    difficulty: 'beginner',
    views: 21098,
    likes: 1876,
    thumbnail: 'fraud_telecom',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '冒充公检法诈骗', startTime: 0 },
      { id: 'c2', title: '冒充子女亲友诈骗', startTime: 480 },
      { id: 'c3', title: '中奖诈骗识别', startTime: 960 },
      { id: 'c4', title: '接到可疑电话怎么办', startTime: 1380 },
    ],
    relatedVideos: ['video_fraud_001', 'video_fraud_002'],
  },
  {
    id: 'video_fraud_004',
    categoryId: 'fraud_prevention',
    title: '养老服务陷阱识别',
    description: '揭露虚假养老院、会员制养老、养老服务预付费等养老服务领域的诈骗手段。',
    duration: 1860,
    instructor: '吴律师',
    difficulty: 'intermediate',
    views: 13245,
    likes: 1123,
    thumbnail: 'fraud_eldercare',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '虚假养老院的识别', startTime: 0 },
      { id: 'c2', title: '会员制养老的风险', startTime: 540 },
      { id: 'c3', title: '预付费陷阱', startTime: 1080 },
      { id: 'c4', title: '选择正规养老机构的方法', startTime: 1500 },
    ],
    relatedVideos: ['video_fraud_001', 'video_fraud_002'],
  },

  // Inheritance Law Videos
  {
    id: 'video_inherit_001',
    categoryId: 'inheritance',
    title: '法定继承顺序详解',
    description: '详细讲解第一顺序继承人、第二顺序继承人的范围及继承份额计算方法。',
    duration: 1560,
    instructor: '郑律师',
    difficulty: 'beginner',
    views: 14567,
    likes: 1234,
    thumbnail: 'inherit_order',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '第一顺序继承人', startTime: 0 },
      { id: 'c2', title: '第二顺序继承人', startTime: 480 },
      { id: 'c3', title: '继承份额的计算', startTime: 960 },
      { id: 'c4', title: '特殊情况的处理', startTime: 1260 },
    ],
    relatedVideos: ['video_inherit_002', 'video_inherit_003'],
  },
  {
    id: 'video_inherit_002',
    categoryId: 'inheritance',
    title: '遗产分割实务',
    description: '学习如何进行遗产清点、债务清偿、遗产分割协议的签订等实务操作。',
    duration: 1980,
    instructor: '孙律师',
    difficulty: 'intermediate',
    views: 11234,
    likes: 987,
    thumbnail: 'inherit_division',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '遗产的清点', startTime: 0 },
      { id: 'c2', title: '债务的清偿', startTime: 600 },
      { id: 'c3', title: '遗产分割协议', startTime: 1200 },
      { id: 'c4', title: '房产的过户手续', startTime: 1620 },
    ],
    relatedVideos: ['video_inherit_001', 'video_inherit_004'],
  },
  {
    id: 'video_inherit_003',
    categoryId: 'inheritance',
    title: '遗嘱继承 vs 法定继承',
    description: '对比遗嘱继承与法定继承的区别，讲解遗嘱继承的优先效力及限制。',
    duration: 1440,
    instructor: '钱律师',
    difficulty: 'intermediate',
    views: 9876,
    likes: 876,
    thumbnail: 'inherit_compare',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '两种继承方式的区别', startTime: 0 },
      { id: 'c2', title: '遗嘱继承的优先性', startTime: 480 },
      { id: 'c3', title: '遗嘱的限制（必留份）', startTime: 960 },
    ],
    relatedVideos: ['video_inherit_001', 'video_will_001'],
  },
  {
    id: 'video_inherit_004',
    categoryId: 'inheritance',
    title: '继承纠纷案例分析',
    description: '通过真实案例分析继承纠纷的常见原因、解决方法及预防措施。',
    duration: 2220,
    instructor: '周律师',
    difficulty: 'advanced',
    views: 8765,
    likes: 765,
    thumbnail: 'inherit_cases',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '案例一：遗嘱效力纠纷', startTime: 0 },
      { id: 'c2', title: '案例二：房产继承纠纷', startTime: 720 },
      { id: 'c3', title: '案例三：遗产分割纠纷', startTime: 1440 },
      { id: 'c4', title: '如何预防继承纠纷', startTime: 1920 },
    ],
    relatedVideos: ['video_inherit_001', 'video_inherit_002'],
  },

  // Property Rights Videos
  {
    id: 'video_property_001',
    categoryId: 'property_rights',
    title: '房产证加名与减名',
    description: '详解房产证加减名字的法律后果、税费计算、办理流程等关键问题。',
    duration: 1620,
    instructor: '吴律师',
    difficulty: 'intermediate',
    views: 16789,
    likes: 1456,
    thumbnail: 'property_name',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '加名的法律后果', startTime: 0 },
      { id: 'c2', title: '减名的注意事项', startTime: 540 },
      { id: 'c3', title: '税费的计算', startTime: 1080 },
      { id: 'c4', title: '办理流程', startTime: 1380 },
    ],
    relatedVideos: ['video_property_002', 'video_property_003'],
  },
  {
    id: 'video_property_002',
    categoryId: 'property_rights',
    title: '老年人房产处置指南',
    description: '讲解老年人出售、赠与、抵押房产的注意事项及法律风险防范。',
    duration: 1800,
    instructor: '郑律师',
    difficulty: 'beginner',
    views: 13456,
    likes: 1178,
    thumbnail: 'property_disposal',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '房产出售的注意事项', startTime: 0 },
      { id: 'c2', title: '房产赠与的税费', startTime: 600 },
      { id: 'c3', title: '以房养老的风险', startTime: 1200 },
      { id: 'c4', title: '房产抵押贷款陷阱', startTime: 1500 },
    ],
    relatedVideos: ['video_property_001', 'video_fraud_001'],
  },
  {
    id: 'video_property_003',
    categoryId: 'property_rights',
    title: '存款与理财产品保护',
    description: '学习如何保护银行存款、理财产品等金融资产，防范非法集资。',
    duration: 1500,
    instructor: '李律师',
    difficulty: 'beginner',
    views: 12345,
    likes: 1089,
    thumbnail: 'property_savings',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '银行存款的安全保障', startTime: 0 },
      { id: 'c2', title: '正规理财产品的识别', startTime: 480 },
      { id: 'c3', title: '非法集资的识别', startTime: 960 },
      { id: 'c4', title: '受骗后的维权途径', startTime: 1260 },
    ],
    relatedVideos: ['video_fraud_001', 'video_property_002'],
  },

  // Family Support Videos
  {
    id: 'video_support_001',
    categoryId: 'family_support',
    title: '子女赡养义务法律规定',
    description: '详细讲解子女赡养父母的法定义务内容、赡养费标准及不履行的法律后果。',
    duration: 1680,
    instructor: '张律师',
    difficulty: 'beginner',
    views: 19876,
    likes: 1765,
    thumbnail: 'support_obligation',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '赡养义务的法律依据', startTime: 0 },
      { id: 'c2', title: '赡养费的计算标准', startTime: 540 },
      { id: 'c3', title: '精神赡养的要求', startTime: 1080 },
      { id: 'c4', title: '不履行赡养义务的后果', startTime: 1380 },
    ],
    relatedVideos: ['video_support_002', 'video_support_003'],
  },
  {
    id: 'video_support_002',
    categoryId: 'family_support',
    title: '赡养费追索实务',
    description: '教您如何通过法律途径追索赡养费，包括诉讼流程、证据准备等。',
    duration: 1920,
    instructor: '王律师',
    difficulty: 'intermediate',
    views: 11234,
    likes: 987,
    thumbnail: 'support_lawsuit',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '起诉前的准备', startTime: 0 },
      { id: 'c2', title: '证据的收集', startTime: 600 },
      { id: 'c3', title: '诉讼流程详解', startTime: 1200 },
      { id: 'c4', title: '判决的执行', startTime: 1620 },
    ],
    relatedVideos: ['video_support_001', 'video_support_004'],
  },
  {
    id: 'video_support_003',
    categoryId: 'family_support',
    title: '多子女赡养责任分配',
    description: '讲解多个子女如何分担赡养责任、赡养协议的签订等实际问题。',
    duration: 1440,
    instructor: '赵律师',
    difficulty: 'intermediate',
    views: 9876,
    likes: 876,
    thumbnail: 'support_multiple',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '赡养责任的法定分配', startTime: 0 },
      { id: 'c2', title: '赡养协议的签订', startTime: 540 },
      { id: 'c3', title: '轮流赡养的安排', startTime: 1020 },
    ],
    relatedVideos: ['video_support_001', 'video_support_002'],
  },
  {
    id: 'video_support_004',
    categoryId: 'family_support',
    title: '老年人居住权保护',
    description: '学习如何维护老年人的居住权，防止被子女强迫搬离住所。',
    duration: 1560,
    instructor: '刘律师',
    difficulty: 'intermediate',
    views: 8765,
    likes: 765,
    thumbnail: 'support_housing',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '居住权的法律规定', startTime: 0 },
      { id: 'c2', title: '居住权的设立', startTime: 540 },
      { id: 'c3', title: '侵犯居住权的维权', startTime: 1080 },
    ],
    relatedVideos: ['video_support_001', 'video_property_001'],
  },

  // Contract Law Videos
  {
    id: 'video_contract_001',
    categoryId: 'contract_law',
    title: '养老服务合同签订指南',
    description: '详细讲解养老院入住合同、护理服务合同的关键条款及注意事项。',
    duration: 1740,
    instructor: '陈律师',
    difficulty: 'beginner',
    views: 15678,
    likes: 1345,
    thumbnail: 'contract_eldercare',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '入住合同的必备条款', startTime: 0 },
      { id: 'c2', title: '服务标准的约定', startTime: 540 },
      { id: 'c3', title: '费用调整条款', startTime: 1080 },
      { id: 'c4', title: '退费与解约条款', startTime: 1440 },
    ],
    relatedVideos: ['video_contract_002', 'video_fraud_004'],
  },
  {
    id: 'video_contract_002',
    categoryId: 'contract_law',
    title: '房屋买卖合同陷阱',
    description: '揭露二手房买卖合同中的常见陷阱，教您如何审查合同条款。',
    duration: 1860,
    instructor: '孙律师',
    difficulty: 'intermediate',
    views: 13456,
    likes: 1178,
    thumbnail: 'contract_house',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '产权条款的审查', startTime: 0 },
      { id: 'c2', title: '价格与付款方式', startTime: 600 },
      { id: 'c3', title: '交房条件与时间', startTime: 1200 },
      { id: 'c4', title: '违约责任条款', startTime: 1560 },
    ],
    relatedVideos: ['video_contract_001', 'video_property_002'],
  },
  {
    id: 'video_contract_003',
    categoryId: 'contract_law',
    title: '借款合同的法律风险',
    description: '讲解民间借贷合同、借条、欠条的法律区别及风险防范。',
    duration: 1500,
    instructor: '周律师',
    difficulty: 'intermediate',
    views: 11234,
    likes: 987,
    thumbnail: 'contract_loan',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '借条与欠条的区别', startTime: 0 },
      { id: 'c2', title: '借款利息的法律限制', startTime: 480 },
      { id: 'c3', title: '担保条款的设置', startTime: 960 },
      { id: 'c4', title: '逾期后的法律救济', startTime: 1260 },
    ],
    relatedVideos: ['video_contract_001', 'video_contract_004'],
  },
  {
    id: 'video_contract_004',
    categoryId: 'contract_law',
    title: '保险合同解读',
    description: '帮助您理解健康险、寿险等保险合同的关键条款，避免理赔纠纷。',
    duration: 1680,
    instructor: '吴律师',
    difficulty: 'intermediate',
    views: 10123,
    likes: 898,
    thumbnail: 'contract_insurance',
    videoUrl: 'mock_url',
    chapters: [
      { id: 'c1', title: '保险责任条款', startTime: 0 },
      { id: 'c2', title: '免责条款的理解', startTime: 540 },
      { id: 'c3', title: '如实告知义务', startTime: 1080 },
      { id: 'c4', title: '理赔流程与注意事项', startTime: 1380 },
    ],
    relatedVideos: ['video_contract_001', 'video_contract_002'],
  },
];

// ==================== Helper Functions ====================

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views: number): string => {
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}万`;
  }
  return views.toString();
};

const getDifficultyLabel = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
  switch (difficulty) {
    case 'beginner':
      return '入门';
    case 'intermediate':
      return '进阶';
    case 'advanced':
      return '高级';
  }
};

const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
  switch (difficulty) {
    case 'beginner':
      return '#52c41a';
    case 'intermediate':
      return '#1890ff';
    case 'advanced':
      return '#722ed1';
  }
};

// ==================== Main Component ====================

const LegalVideoScreen: React.FC<any> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<LegalVideo | null>(null);
  const [videoList, setVideoList] = useState<LegalVideo[]>([]);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // User data state
  const [videoProgress, setVideoProgress] = useState<Map<string, VideoProgress>>(new Map());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);

  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== Data Loading ====================

  useEffect(() => {
    loadUserData();
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  const loadUserData = async () => {
    try {
      // Load video progress
      const progressData = await AsyncStorage.getItem('video_progress');
      if (progressData) {
        const progressArray: VideoProgress[] = JSON.parse(progressData);
        const progressMap = new Map<string, VideoProgress>();
        progressArray.forEach(p => progressMap.set(p.videoId, p));
        setVideoProgress(progressMap);
      }

      // Load bookmarks
      const bookmarkData = await AsyncStorage.getItem('video_bookmarks');
      if (bookmarkData) {
        const bookmarkArray: Bookmark[] = JSON.parse(bookmarkData);
        const bookmarkSet = new Set<string>(bookmarkArray.map(b => b.videoId));
        setBookmarks(bookmarkSet);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveVideoProgress = async (videoId: string, watchedSeconds: number, completed: boolean) => {
    const progress: VideoProgress = {
      videoId,
      watchedSeconds,
      completed,
      lastWatchedAt: new Date().toISOString(),
    };

    const newProgressMap = new Map(videoProgress);
    newProgressMap.set(videoId, progress);
    setVideoProgress(newProgressMap);

    try {
      const progressArray = Array.from(newProgressMap.values());
      await AsyncStorage.setItem('video_progress', JSON.stringify(progressArray));
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  };

  const toggleBookmark = async (videoId: string) => {
    const newBookmarks = new Set(bookmarks);

    if (newBookmarks.has(videoId)) {
      newBookmarks.delete(videoId);
      Alert.alert('提示', '已取消收藏');
    } else {
      newBookmarks.add(videoId);
      Alert.alert('提示', '收藏成功');
    }

    setBookmarks(newBookmarks);

    try {
      const bookmarkArray: Bookmark[] = Array.from(newBookmarks).map(id => ({
        videoId: id,
        bookmarkedAt: new Date().toISOString(),
      }));
      await AsyncStorage.setItem('video_bookmarks', JSON.stringify(bookmarkArray));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  // ==================== Navigation Handlers ====================

  const handleCategoryPress = (category: VideoCategory) => {
    setSelectedCategory(category);

    // Filter videos by category
    const filteredVideos = LEGAL_VIDEOS.filter(v => v.categoryId === category.id);
    setVideoList(filteredVideos);

    setCurrentStep('videoList');
  };

  const handleVideoPress = (video: LegalVideo) => {
    setSelectedVideo(video);

    // Load saved progress if exists
    const progress = videoProgress.get(video.id);
    if (progress) {
      setCurrentTime(progress.watchedSeconds);
    } else {
      setCurrentTime(0);
    }

    setIsPlaying(false);
    setCurrentStep('videoPlayer');
  };

  const handleBackPress = () => {
    if (currentStep === 'videoPlayer') {
      // Save progress before leaving
      if (selectedVideo) {
        const completed = currentTime >= (selectedVideo.duration * 0.9); // 90% watched = completed
        saveVideoProgress(selectedVideo.id, currentTime, completed);
      }
      setCurrentStep('videoList');
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    } else if (currentStep === 'videoList') {
      setCurrentStep('categories');
      setSelectedCategory(null);
      setVideoList([]);
    } else {
      navigation.goBack();
    }
  };

  // ==================== Video Player Controls ====================

  const handlePlayPause = () => {
    if (!selectedVideo) return;

    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      // Save progress
      const completed = currentTime >= (selectedVideo.duration * 0.9);
      saveVideoProgress(selectedVideo.id, currentTime, completed);
    } else {
      // Play
      setIsPlaying(true);
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= selectedVideo.duration) {
            // Video ended
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
            }
            saveVideoProgress(selectedVideo.id, selectedVideo.duration, true);
            return selectedVideo.duration;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
    setIsSeeking(false);
  };

  const handleChapterPress = (chapter: VideoChapter) => {
    setCurrentTime(chapter.startTime);
    if (!isPlaying) {
      handlePlayPause();
    }
  };

  const handleRelatedVideoPress = (videoId: string) => {
    const video = LEGAL_VIDEOS.find(v => v.id === videoId);
    if (video) {
      // Save current video progress
      if (selectedVideo) {
        const completed = currentTime >= (selectedVideo.duration * 0.9);
        saveVideoProgress(selectedVideo.id, currentTime, completed);
      }

      handleVideoPress(video);
    }
  };

  // ==================== Render Methods ====================

  const renderCategoryCard = (category: VideoCategory) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon} size={32} color={category.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
        <View style={styles.categoryMeta}>
          <Ionicons name="play-circle" size={14} color="#666" />
          <Text style={styles.categoryVideoCount}> {category.videoCount} 个课程</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderVideoCard = (video: LegalVideo) => {
    const progress = videoProgress.get(video.id);
    const isBookmarked = bookmarks.has(video.id);
    const progressPercentage = progress ? (progress.watchedSeconds / video.duration) * 100 : 0;

    return (
      <TouchableOpacity
        key={video.id}
        style={styles.videoCard}
        onPress={() => handleVideoPress(video)}
      >
        <View style={styles.videoThumbnail}>
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="play-circle" size={48} color="#fff" />
          </View>
          <View style={styles.videoDurationBadge}>
            <Text style={styles.videoDurationText}>{formatDuration(video.duration)}</Text>
          </View>
          {isBookmarked && (
            <View style={styles.bookmarkBadge}>
              <Ionicons name="bookmark" size={16} color="#fff" />
            </View>
          )}
          {progress && progressPercentage > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
          )}
        </View>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>{video.description}</Text>
          <View style={styles.videoMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(video.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(video.difficulty) }]}>
                {getDifficultyLabel(video.difficulty)}
              </Text>
            </View>
            <View style={styles.videoMetaItem}>
              <Ionicons name="person" size={12} color="#999" />
              <Text style={styles.videoMetaText}> {video.instructor}</Text>
            </View>
            <View style={styles.videoMetaItem}>
              <Ionicons name="eye" size={12} color="#999" />
              <Text style={styles.videoMetaText}> {formatViews(video.views)}</Text>
            </View>
            <View style={styles.videoMetaItem}>
              <Ionicons name="heart" size={12} color="#999" />
              <Text style={styles.videoMetaText}> {video.likes}</Text>
            </View>
          </View>
          {progress && progress.completed && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#52c41a" />
              <Text style={styles.completedText}> 已完成</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ==================== Screen Views ====================

  const renderCategoriesView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>法律视频课堂</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Ionicons name="school" size={40} color="#1890ff" />
            <Text style={styles.bannerTitle}>学习法律知识，保护自身权益</Text>
            <Text style={styles.bannerSubtitle}>专业律师授课，案例丰富生动</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>课程分类</Text>
            <Text style={styles.sectionSubtitle}>选择您感兴趣的主题开始学习</Text>
          </View>
          {VIDEO_CATEGORIES.map(category => renderCategoryCard(category))}
        </View>

        {/* My Learning (if has progress) */}
        {videoProgress.size > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>继续学习</Text>
              <Text style={styles.sectionSubtitle}>从上次观看的地方继续</Text>
            </View>
            {Array.from(videoProgress.values())
              .filter(p => !p.completed)
              .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())
              .slice(0, 3)
              .map(progress => {
                const video = LEGAL_VIDEOS.find(v => v.id === progress.videoId);
                return video ? renderVideoCard(video) : null;
              })}
          </View>
        )}

        {/* Bookmarks */}
        {bookmarks.size > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>我的收藏</Text>
              <Text style={styles.sectionSubtitle}>{bookmarks.size} 个收藏课程</Text>
            </View>
            {Array.from(bookmarks)
              .slice(0, 3)
              .map(bookmarkId => {
                const video = LEGAL_VIDEOS.find(v => v.id === bookmarkId);
                return video ? renderVideoCard(video) : null;
              })}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );

  const renderVideoListView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory?.name}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Category Info */}
      {selectedCategory && (
        <View style={[styles.categoryBanner, { backgroundColor: selectedCategory.color + '10' }]}>
          <Ionicons name={selectedCategory.icon} size={28} color={selectedCategory.color} />
          <View style={styles.categoryBannerInfo}>
            <Text style={styles.categoryBannerTitle}>{selectedCategory.name}</Text>
            <Text style={styles.categoryBannerDescription}>{selectedCategory.description}</Text>
          </View>
        </View>
      )}

      {/* Video List */}
      <FlatList
        data={videoList}
        renderItem={({ item }) => renderVideoCard(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.videoList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderVideoPlayerView = () => {
    if (!selectedVideo) return null;

    const progress = videoProgress.get(selectedVideo.id);
    const isBookmarked = bookmarks.has(selectedVideo.id);
    const progressPercentage = (currentTime / selectedVideo.duration) * 100;
    const relatedVideos = LEGAL_VIDEOS.filter(v => selectedVideo.relatedVideos.includes(v.id));

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Video Player */}
        <View style={styles.videoPlayerContainer}>
          <TouchableOpacity style={styles.playerCloseButton} onPress={handleBackPress}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.videoPlayer}>
            <Ionicons name="videocam" size={80} color="#fff" />
            <Text style={styles.videoPlayerText}>视频播放器</Text>
          </View>

          <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={72} color="#fff" />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.videoControls}>
            <Text style={styles.timeText}>{formatDuration(currentTime)}</Text>
            <View style={styles.seekBarContainer}>
              <View style={styles.seekBarBackground}>
                <View style={[styles.seekBarProgress, { width: `${progressPercentage}%` }]} />
              </View>
              {/* Simplified seek - in real app would use Slider component */}
              <View style={[styles.seekThumb, { left: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.timeText}>{formatDuration(selectedVideo.duration)}</Text>
          </View>
        </View>

        {/* Video Info and Chapters */}
        <ScrollView style={styles.videoDetailsContainer} showsVerticalScrollIndicator={false}>
          {/* Title and Actions */}
          <View style={styles.videoHeader}>
            <Text style={styles.videoPlayerTitle}>{selectedVideo.title}</Text>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => toggleBookmark(selectedVideo.id)}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isBookmarked ? "#1890ff" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {/* Meta Info */}
          <View style={styles.videoPlayerMeta}>
            <View style={styles.videoPlayerMetaItem}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.videoPlayerMetaText}> {selectedVideo.instructor}</Text>
            </View>
            <View style={styles.videoPlayerMetaItem}>
              <Ionicons name="eye" size={16} color="#666" />
              <Text style={styles.videoPlayerMetaText}> {formatViews(selectedVideo.views)}</Text>
            </View>
            <View style={styles.videoPlayerMetaItem}>
              <Ionicons name="heart" size={16} color="#666" />
              <Text style={styles.videoPlayerMetaText}> {selectedVideo.likes}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedVideo.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(selectedVideo.difficulty) }]}>
                {getDifficultyLabel(selectedVideo.difficulty)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>课程简介</Text>
            <Text style={styles.descriptionText}>{selectedVideo.description}</Text>
          </View>

          {/* Chapters */}
          <View style={styles.chaptersSection}>
            <Text style={styles.sectionTitle}>课程章节</Text>
            {selectedVideo.chapters.map((chapter, index) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterItem}
                onPress={() => handleChapterPress(chapter)}
              >
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterTime}>{formatDuration(chapter.startTime)}</Text>
                </View>
                {currentTime >= chapter.startTime && (
                  currentTime < (selectedVideo.chapters[index + 1]?.startTime || selectedVideo.duration)
                ) && (
                  <Ionicons name="play" size={20} color="#1890ff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>相关课程</Text>
              {relatedVideos.map(video => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.relatedVideoItem}
                  onPress={() => handleRelatedVideoPress(video.id)}
                >
                  <View style={styles.relatedVideoThumbnail}>
                    <Ionicons name="play-circle" size={32} color="#fff" />
                  </View>
                  <View style={styles.relatedVideoInfo}>
                    <Text style={styles.relatedVideoTitle} numberOfLines={2}>{video.title}</Text>
                    <View style={styles.relatedVideoMeta}>
                      <Text style={styles.relatedVideoMetaText}>{video.instructor}</Text>
                      <Text style={styles.relatedVideoDuration}>{formatDuration(video.duration)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    );
  };

  // ==================== Main Render ====================

  if (currentStep === 'categories') {
    return renderCategoriesView();
  } else if (currentStep === 'videoList') {
    return renderVideoListView();
  } else if (currentStep === 'videoPlayer') {
    return renderVideoPlayerView();
  }

  return null;
};

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },

  // Content
  content: {
    flex: 1,
  },

  // Banner
  banner: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
  },

  // Category Card
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryVideoCount: {
    fontSize: 12,
    color: '#666',
  },

  // Category Banner
  categoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  categoryBannerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryBannerDescription: {
    fontSize: 13,
    color: '#666',
  },

  // Video List
  videoList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },

  // Video Card
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  bookmarkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1890ff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1890ff',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  videoMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  videoMetaText: {
    fontSize: 12,
    color: '#999',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 4,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completedText: {
    fontSize: 12,
    color: '#52c41a',
    fontWeight: '500',
  },

  // Video Player
  videoPlayerContainer: {
    backgroundColor: '#000',
    height: 300,
    position: 'relative',
  },
  playerCloseButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  videoPlayer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  videoPlayerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -36,
    marginLeft: -36,
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  seekBarContainer: {
    flex: 1,
    marginHorizontal: 12,
    position: 'relative',
  },
  seekBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
  },
  seekBarProgress: {
    height: '100%',
    backgroundColor: '#1890ff',
    borderRadius: 1.5,
  },
  seekThumb: {
    position: 'absolute',
    top: -5,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#fff',
    marginLeft: -6.5,
  },

  // Video Details
  videoDetailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  videoPlayerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 26,
  },
  bookmarkButton: {
    padding: 4,
    marginLeft: 12,
  },
  videoPlayerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  videoPlayerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  videoPlayerMetaText: {
    fontSize: 13,
    color: '#666',
  },

  // Description
  descriptionSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  // Chapters
  chaptersSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  chapterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chapterTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  chapterTime: {
    fontSize: 12,
    color: '#999',
  },

  // Related Videos
  relatedSection: {
    padding: 16,
  },
  relatedVideoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  relatedVideoThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedVideoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    lineHeight: 20,
  },
  relatedVideoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedVideoMetaText: {
    fontSize: 12,
    color: '#999',
  },
  relatedVideoDuration: {
    fontSize: 12,
    color: '#999',
  },
});

export default LegalVideoScreen;
