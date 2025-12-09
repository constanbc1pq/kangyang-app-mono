/**
 * 用户数据服务 - 处理本地数据的初始化和管理
 * 使用AsyncStorage存储用户数据
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, HealthDevice, HealthTask, TaskCompletionRecord, TaskAchievement, FamilyMember, MemberHealthProfile } from '@/types/userData';
import {
  UserMembership,
  PointsInfo,
  PointsRecord,
  PointsSource,
  ServiceSubscriptions,
  MembershipLevel,
  DEFAULT_MEMBERSHIP,
  DEFAULT_POINTS,
  DEFAULT_SUBSCRIPTIONS,
  POINTS_MULTIPLIER,
} from '@/types/membership';
import { privateDoctorService } from './privateDoctorService';

const USER_DATA_KEY = '@kangyang_user_data';

/**
 * 初始化默认的Mock设备数据
 */
const initializeDefaultDevices = (): HealthDevice[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  return [
    {
      id: 1,
      name: '智能手环',
      type: 'smartwatch',
      status: 'connected',
      battery: 85,
      lastSync: '刚刚',
      connection: 'bluetooth',
      model: '小米手环 7',
      syncType: 'auto',
      isPinned: true,
      events: [
        { id: '1', deviceId: 1, timestamp: `${today}T14:30:00`, type: '心率', value: '72', unit: 'bpm', status: 'normal' },
        { id: '2', deviceId: 1, timestamp: `${today}T12:00:00`, type: '步数', value: '8542', unit: '步', status: 'normal' },
        { id: '3', deviceId: 1, timestamp: `${today}T09:15:00`, type: '睡眠质量', value: '85', unit: '%', status: 'normal' },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 2,
      name: '血压计',
      type: 'blood-pressure',
      status: 'connected',
      battery: 65,
      lastSync: '5分钟前',
      connection: 'bluetooth',
      model: '欧姆龙 HEM-7136',
      syncType: 'manual',
      isPinned: true,
      events: [
        { id: '4', deviceId: 2, timestamp: `${today}T08:00:00`, type: '血压', value: '120/80', unit: 'mmHg', status: 'normal' },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 3,
      name: '血糖仪',
      type: 'glucose-meter',
      status: 'disconnected',
      battery: 45,
      lastSync: '2小时前',
      connection: 'bluetooth',
      model: '罗氏 Accu-Chek',
      syncType: 'manual',
      isPinned: false,
      events: [
        { id: '5', deviceId: 3, timestamp: `${today}T07:30:00`, type: '空腹血糖', value: '5.8', unit: 'mmol/L', status: 'normal' },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 4,
      name: '智能体脂秤',
      type: 'scale',
      status: 'connected',
      battery: 90,
      lastSync: '刚刚',
      connection: 'wifi',
      model: '云麦 Pro',
      syncType: 'auto',
      isPinned: false,
      events: [
        { id: '6', deviceId: 4, timestamp: `${today}T07:00:00`, type: '体重', value: '68.5', unit: 'kg', status: 'normal' },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

/**
 * 初始化默认的Mock任务数据
 */
const initializeDefaultTasks = (): HealthTask[] => {
  const now = new Date();
  const nowISO = now.toISOString();

  return [
    {
      id: 'task_001',
      title: '每日饮水目标',
      description: '每天喝足8杯水，保持身体水分充足',
      category: 'nutrition',
      status: 'in_progress',
      priority: 'high',
      icon: 'Droplets',
      color: '#3b82f6',
      startTime: '08:00',
      endTime: '22:00',
      repeatFrequency: 'daily',
      progress: 60,
      totalCompletions: 45,
      currentStreak: 7,
      bestStreak: 15,
      completionRate: 85,
      reminder: true,
      reminderTime: 30,
      completionHistory: [],
      achievements: [
        {
          id: 'ach_water_001',
          title: '饮水小能手',
          description: '连续7天完成饮水目标',
          icon: 'Trophy',
          target: 7,
          current: 7,
          unit: '天',
          achieved: true,
          achievedDate: nowISO,
          color: '#3b82f6',
        },
      ],
      healthSuggestions: [
        '早晨起床后喝一杯温水，促进肠胃蠕动',
        '餐前30分钟饮水，有助于控制食欲',
        '运动后及时补充水分，避免脱水',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastCompletedAt: new Date(now.getTime() - 86400000).toISOString(),
    },
    {
      id: 'task_002',
      title: '每日运动30分钟',
      description: '进行有氧运动，保持身体活力',
      category: 'fitness',
      status: 'pending',
      priority: 'high',
      icon: 'Activity',
      color: '#10b981',
      startTime: '07:00',
      endTime: '09:00',
      repeatFrequency: 'daily',
      progress: 0,
      totalCompletions: 30,
      currentStreak: 5,
      bestStreak: 12,
      completionRate: 78,
      reminder: true,
      reminderTime: 15,
      completionHistory: [],
      achievements: [
        {
          id: 'ach_fitness_001',
          title: '运动达人',
          description: '累计运动30次',
          icon: 'Award',
          target: 30,
          current: 30,
          unit: '次',
          achieved: true,
          achievedDate: nowISO,
          color: '#10b981',
        },
      ],
      healthSuggestions: [
        '运动前做好热身，避免运动损伤',
        '选择适合自己的运动强度，循序渐进',
        '运动后注意拉伸放松，缓解肌肉疲劳',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task_003',
      title: '早餐服药',
      description: '餐后30分钟服用降压药',
      category: 'medication',
      status: 'completed',
      priority: 'high',
      icon: 'Pill',
      color: '#ef4444',
      startTime: '08:30',
      repeatFrequency: 'daily',
      progress: 100,
      totalCompletions: 60,
      currentStreak: 10,
      bestStreak: 20,
      completionRate: 95,
      reminder: true,
      reminderTime: 5,
      completionHistory: [],
      achievements: [
        {
          id: 'ach_med_001',
          title: '按时服药',
          description: '连续10天按时服药',
          icon: 'CheckCircle',
          target: 10,
          current: 10,
          unit: '天',
          achieved: true,
          achievedDate: nowISO,
          color: '#ef4444',
        },
      ],
      healthSuggestions: [
        '按时服药对控制血压至关重要',
        '服药期间注意观察身体反应',
        '不要随意增减药量，如有不适及时就医',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastCompletedAt: nowISO,
    },
    {
      id: 'task_004',
      title: '血压监测',
      description: '每天早上测量血压并记录',
      category: 'monitoring',
      status: 'completed',
      priority: 'high',
      icon: 'Heart',
      color: '#f59e0b',
      startTime: '07:30',
      repeatFrequency: 'daily',
      progress: 100,
      totalCompletions: 55,
      currentStreak: 8,
      bestStreak: 18,
      completionRate: 92,
      reminder: true,
      reminderTime: 15,
      completionHistory: [],
      achievements: [],
      healthSuggestions: [
        '测量前静坐5分钟，保持心情平静',
        '每次测量同一时间、同一位置',
        '记录血压数值，观察变化趋势',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastCompletedAt: nowISO,
    },
    {
      id: 'task_005',
      title: '血糖检测',
      description: '空腹血糖检测',
      category: 'monitoring',
      status: 'pending',
      priority: 'medium',
      icon: 'TestTube',
      color: '#8b5cf6',
      startTime: '07:00',
      repeatFrequency: 'daily',
      progress: 0,
      totalCompletions: 50,
      currentStreak: 6,
      bestStreak: 14,
      completionRate: 88,
      reminder: true,
      reminderTime: 15,
      completionHistory: [],
      achievements: [],
      healthSuggestions: [
        '空腹血糖应在早餐前测量',
        '保持血糖仪清洁，定期校准',
        '血糖异常时及时记录并咨询医生',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task_006',
      title: '体重记录',
      description: '早起如厕后测量体重',
      category: 'monitoring',
      status: 'pending',
      priority: 'low',
      icon: 'Scale',
      color: '#06b6d4',
      startTime: '07:15',
      repeatFrequency: 'daily',
      progress: 0,
      totalCompletions: 40,
      currentStreak: 4,
      bestStreak: 10,
      completionRate: 75,
      reminder: false,
      completionHistory: [],
      achievements: [],
      healthSuggestions: [
        '每天同一时间测量体重，数据更准确',
        '体重变化需结合饮食运动综合分析',
        '健康减重速度为每周0.5-1公斤',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    {
      id: 'task_007',
      title: '冥想放松',
      description: '睡前冥想15分钟，改善睡眠质量',
      category: 'lifestyle',
      status: 'pending',
      priority: 'medium',
      icon: 'Moon',
      color: '#6366f1',
      startTime: '21:00',
      endTime: '21:15',
      repeatFrequency: 'daily',
      progress: 0,
      totalCompletions: 20,
      currentStreak: 3,
      bestStreak: 8,
      completionRate: 65,
      reminder: true,
      reminderTime: 5,
      completionHistory: [],
      achievements: [],
      healthSuggestions: [
        '冥想有助于放松身心，改善睡眠',
        '选择安静舒适的环境进行冥想',
        '初学者可使用冥想引导音频',
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
    },
  ];
};

/**
 * 初始化默认家庭成员数据
 */
const initializeDefaultFamilyMembers = (): FamilyMember[] => {
  const now = new Date();
  const nowISO = now.toISOString();
  const today = now.toISOString().split('T')[0];

  // 本人（自己）- 数据来自主Profile
  const selfMember: FamilyMember = {
    id: 'self',
    name: '王先生',
    relationship: '本人',
    gender: 'male',
    birthDate: '1960-01-01',
    avatar: '👨',
    healthProfile: {
      height: 172,
      weight: 68.5,
      age: 65,
      healthStatus: 'excellent',
      healthScore: 92,
      devices: initializeDefaultDevices(), // 使用默认设备
      healthMetrics: [],
      medications: [],
      healthReports: [],
      consultations: [],
      tasks: initializeDefaultTasks(), // 使用默认任务
      aiInterpretation: '您的血压控制良好，体重稳步下降中。整体健康状况优秀，各项指标都在正常范围内。',
      aiSuggestion: '继续保持规律运动和清淡饮食，建议增加有氧运动频率',
      aiInsights: [
        {
          id: 'insight-self-1',
          type: 'trend',
          title: '本周体重下降趋势明显',
          description: '相较上周下降0.8kg，主要归因于规律运动和饮食控制。建议继续保持当前生活方式。',
        },
        {
          id: 'insight-self-2',
          type: 'positive',
          title: '睡眠质量持续改善',
          description: '深度睡眠时长增加30分钟，睡眠效率达到91%。继续保持规律作息！',
        },
      ],
      lastUpdated: nowISO,
      dataSource: ['1', '2', '4'],
    },
    sharedData: {
      healthMetrics: true,
      devices: true,
      reports: true,
    },
    createdAt: nowISO,
    updatedAt: nowISO,
  };

  // 母亲
  const motherMember: FamilyMember = {
    id: 'mother',
    name: '张妈妈',
    relationship: '母亲',
    gender: 'female',
    birthDate: '1955-03-15',
    avatar: '👵',
    healthProfile: {
      height: 158,
      weight: 62.0,
      age: 70,
      healthStatus: 'attention',
      healthScore: 78,
      devices: [
        {
          id: 11,
          name: '血压计',
          type: 'blood-pressure',
          status: 'connected',
          battery: 75,
          lastSync: '30分钟前',
          connection: 'bluetooth',
          model: '欧姆龙 HEM-7136',
          syncType: 'manual',
          isPinned: true,
          events: [
            { id: '11', deviceId: 11, timestamp: `${today}T08:30:00`, type: '血压', value: '145/90', unit: 'mmHg', status: 'warning' },
          ],
          createdAt: nowISO,
          updatedAt: nowISO,
        },
        {
          id: 12,
          name: '血糖仪',
          type: 'glucose-meter',
          status: 'connected',
          battery: 60,
          lastSync: '1小时前',
          connection: 'bluetooth',
          model: '罗氏 Accu-Chek',
          syncType: 'manual',
          isPinned: true,
          events: [
            { id: '12', deviceId: 12, timestamp: `${today}T07:00:00`, type: '空腹血糖', value: '6.8', unit: 'mmol/L', status: 'warning' },
          ],
          createdAt: nowISO,
          updatedAt: nowISO,
        },
      ],
      healthMetrics: [],
      medications: [],
      healthReports: [],
      consultations: [],
      tasks: [],
      aiInterpretation: '血压和血糖略高于正常范围，需要注意饮食控制和定期监测。',
      aiSuggestion: '建议减少盐分摄入，控制碳水化合物，保持每日散步30分钟',
      aiInsights: [
        {
          id: 'insight-mother-1',
          type: 'warning',
          title: '血压连续3天偏高',
          description: '建议减少盐分摄入，避免油腻食物，如持续偏高请就医。',
        },
        {
          id: 'insight-mother-2',
          type: 'suggestion',
          title: '血糖需要密切关注',
          description: '空腹血糖略高，建议控制主食摄入量，增加蔬菜比例。',
        },
      ],
      lastUpdated: nowISO,
      dataSource: ['11', '12'],
    },
    sharedData: {
      healthMetrics: true,
      devices: true,
      reports: true,
    },
    createdAt: nowISO,
    updatedAt: nowISO,
  };

  // 父亲
  const fatherMember: FamilyMember = {
    id: 'father',
    name: '王爸爸',
    relationship: '父亲',
    gender: 'male',
    birthDate: '1953-07-20',
    avatar: '👴',
    healthProfile: {
      height: 170,
      weight: 72.0,
      age: 72,
      healthStatus: 'good',
      healthScore: 83,
      devices: [
        {
          id: 21,
          name: '智能手环',
          type: 'smartwatch',
          status: 'connected',
          battery: 68,
          lastSync: '5分钟前',
          connection: 'bluetooth',
          model: '华为手环 6',
          syncType: 'auto',
          isPinned: true,
          events: [
            { id: '21', deviceId: 21, timestamp: `${today}T10:00:00`, type: '心率', value: '76', unit: 'bpm', status: 'normal' },
            { id: '22', deviceId: 21, timestamp: `${today}T08:00:00`, type: '步数', value: '4823', unit: '步', status: 'normal' },
          ],
          createdAt: nowISO,
          updatedAt: nowISO,
        },
      ],
      healthMetrics: [],
      medications: [],
      healthReports: [],
      consultations: [],
      tasks: [],
      aiInterpretation: '整体健康状况良好，心率平稳，运动量适中。',
      aiSuggestion: '继续保持每日散步习惯，注意防寒保暖',
      aiInsights: [
        {
          id: 'insight-father-1',
          type: 'positive',
          title: '运动习惯保持良好',
          description: '每日步数稳定，心率正常，继续保持！',
        },
      ],
      lastUpdated: nowISO,
      dataSource: ['21'],
    },
    sharedData: {
      healthMetrics: true,
      devices: true,
      reports: true,
    },
    createdAt: nowISO,
    updatedAt: nowISO,
  };

  // 儿子
  const sonMember: FamilyMember = {
    id: 'son',
    name: '小明',
    relationship: '儿子',
    gender: 'male',
    birthDate: '2008-06-10',
    avatar: '👦',
    healthProfile: {
      height: 165,
      weight: 55.0,
      age: 17,
      healthStatus: 'excellent',
      healthScore: 95,
      devices: [
        {
          id: 31,
          name: '智能手环',
          type: 'smartwatch',
          status: 'connected',
          battery: 92,
          lastSync: '刚刚',
          connection: 'bluetooth',
          model: '小米手环 8',
          syncType: 'auto',
          isPinned: true,
          events: [
            { id: '31', deviceId: 31, timestamp: `${today}T15:00:00`, type: '心率', value: '68', unit: 'bpm', status: 'normal' },
            { id: '32', deviceId: 31, timestamp: `${today}T12:00:00`, type: '步数', value: '12543', unit: '步', status: 'normal' },
          ],
          createdAt: nowISO,
          updatedAt: nowISO,
        },
      ],
      healthMetrics: [],
      medications: [],
      healthReports: [],
      consultations: [],
      tasks: [],
      aiInterpretation: '健康状况优秀，各项指标正常。活力充沛，运动量充足。',
      aiSuggestion: '保持良好生活习惯，注意学习时的坐姿和用眼卫生',
      aiInsights: [
        {
          id: 'insight-son-1',
          type: 'positive',
          title: '运动量充足',
          description: '每日步数超过10000步，身体素质优秀！',
        },
      ],
      lastUpdated: nowISO,
      dataSource: ['31'],
    },
    sharedData: {
      healthMetrics: true,
      devices: true,
      reports: true,
    },
    createdAt: nowISO,
    updatedAt: nowISO,
  };

  return [selfMember, motherMember, fatherMember, sonMember];
};

/**
 * 初始化默认用户数据
 */
const initializeDefaultUserData = (): UserData => {
  const now = new Date().toISOString();

  return {
    profile: {
      userId: 'user_default_001',
      surname: '王',
      fullName: '王健康',
      gender: 'male',
      birthDate: '1960-01-01',
      age: 65,
      height: 172,
      weight: 68.5,
      phone: '13800138000',
      emergencyContact: {
        name: '王小明',
        phone: '13900139000',
        relationship: '子女',
      },
      createdAt: now,
      updatedAt: now,
    },
    devices: initializeDefaultDevices(),
    healthMetrics: [],
    medications: [],
    healthReports: [],
    consultations: [],
    lifestyleRecords: [],
    healthGoals: [],
    tasks: initializeDefaultTasks(),
    communityActivities: [],
    familyMembers: initializeDefaultFamilyMembers(), // 使用默认家庭成员数据
    settings: {
      theme: 'light',
      language: 'zh-CN',
      notifications: {
        medication: true,
        healthWarning: true,
        deviceSync: true,
        community: false,
      },
      privacy: {
        dataSharing: false,
        aiAnalysis: true,
      },
      dataSync: {
        autoBackup: true,
        backupFrequency: 'weekly',
        lastBackup: now,
      },
    },
    // 会员体系 (v1.1.0+)
    membership: DEFAULT_MEMBERSHIP,
    points: DEFAULT_POINTS,
    subscriptions: DEFAULT_SUBSCRIPTIONS,
    version: '1.1.0',
    lastModified: now,
  };
};

/**
 * 清除所有用户数据（用于重置）
 */
export const clearUserData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    console.log('✅ 用户数据已清除');
    return true;
  } catch (error) {
    console.error('清除用户数据失败:', error);
    return false;
  }
};

/**
 * 获取用户数据，如果不存在则初始化
 */
export const getUserData = async (): Promise<UserData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);

    if (jsonValue !== null) {
      // 已有数据，检查是否需要迁移
      const userData = JSON.parse(jsonValue);
      let needsSave = false;

      // 如果旧数据中没有 familyMembers，根据用户信息生成
      if (!userData.familyMembers || userData.familyMembers.length === 0) {
        console.log('⚠️ 检测到旧数据格式，正在添加家庭成员数据...');
        // 根据用户 profile 信息生成家庭成员
        const profile = userData.profile;
        if (profile && profile.fullName) {
          userData.familyMembers = createFamilyMembersForUser({
            fullName: profile.fullName,
            surname: profile.surname || profile.fullName.charAt(0),
            age: profile.age || 45,
            height: profile.height || 170,
            weight: profile.weight || 65,
            gender: profile.gender || 'male',
            birthDate: profile.birthDate || '1980-01-01',
          });
        } else {
          // 没有用户信息时才使用默认值
          userData.familyMembers = initializeDefaultFamilyMembers();
        }
        needsSave = true;
        console.log('✅ 家庭成员数据已添加');
      }

      // 迁移会员体系数据 (v1.1.0+)
      if (!userData.membership) {
        console.log('⚠️ 检测到旧数据格式，正在添加会员体系数据...');
        userData.membership = DEFAULT_MEMBERSHIP;
        needsSave = true;
        console.log('✅ 会员信息已添加');
      }

      if (!userData.points) {
        userData.points = DEFAULT_POINTS;
        needsSave = true;
        console.log('✅ 积分信息已添加');
      }

      if (!userData.subscriptions) {
        userData.subscriptions = DEFAULT_SUBSCRIPTIONS;
        needsSave = true;
        console.log('✅ 订阅信息已添加');
      }

      // 更新版本号
      if (userData.version !== '1.1.0') {
        userData.version = '1.1.0';
        needsSave = true;
      }

      if (needsSave) {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        console.log('✅ 用户数据迁移完成');
      }

      return userData;
    } else {
      // 首次使用，初始化默认数据
      const defaultData = initializeDefaultUserData();
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(defaultData));
      console.log('✅ 用户数据初始化完成');
      return defaultData;
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    // 出错时返回默认数据但不保存
    return initializeDefaultUserData();
  }
};

/**
 * 保存用户数据
 */
export const saveUserData = async (userData: UserData): Promise<boolean> => {
  try {
    userData.lastModified = new Date().toISOString();
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    console.log('✅ 用户数据保存成功');
    return true;
  } catch (error) {
    console.error('保存用户数据失败:', error);
    return false;
  }
};

/**
 * 用户注册信息接口
 */
export interface UserRegistrationInfo {
  surname: string;
  givenName: string;
  age: number;
  height: number;
  weight: number;
  gender?: 'male' | 'female';
}

/**
 * 根据用户注册信息创建并保存用户数据
 * 这是新用户注册时应该调用的方法
 */
export const createUserData = async (registrationInfo: UserRegistrationInfo): Promise<UserData> => {
  const {
    surname,
    givenName,
    age,
    height,
    weight,
    gender = 'male',
  } = registrationInfo;

  const now = new Date();
  const nowISO = now.toISOString();

  // 生成用户ID
  const userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const fullName = surname + givenName;

  // 根据年龄生成出生日期
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const birthDate = `${birthYear}-01-01`;

  // 根据用户信息动态生成家庭成员
  const familyMembers = createFamilyMembersForUser({
    fullName,
    surname,
    age,
    height,
    weight,
    gender,
    birthDate,
  });

  const userData: UserData = {
    profile: {
      userId,
      surname,
      fullName,
      gender,
      birthDate,
      age,
      height,
      weight,
      phone: '138****8888',
      emergencyContact: {
        name: `${surname}家人`,
        phone: '139****9999',
        relationship: '家人',
      },
      createdAt: nowISO,
      updatedAt: nowISO,
    },
    devices: initializeDefaultDevices(),
    healthMetrics: [],
    medications: [],
    healthReports: [],
    consultations: [],
    lifestyleRecords: [],
    healthGoals: [],
    tasks: initializeDefaultTasks(),
    communityActivities: [],
    familyMembers,
    settings: {
      theme: 'light',
      language: 'zh-CN',
      notifications: {
        medication: true,
        healthWarning: true,
        deviceSync: true,
        community: false,
      },
      privacy: {
        dataSharing: false,
        aiAnalysis: true,
      },
      dataSync: {
        autoBackup: true,
        backupFrequency: 'weekly',
        lastBackup: nowISO,
      },
    },
    membership: DEFAULT_MEMBERSHIP,
    points: DEFAULT_POINTS,
    subscriptions: DEFAULT_SUBSCRIPTIONS,
    version: '1.1.0',
    lastModified: nowISO,
  };

  // 保存到 AsyncStorage
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  console.log('✅ 新用户数据创建成功:', fullName);

  return userData;
};

/**
 * 根据用户信息创建家庭成员数据
 */
const createFamilyMembersForUser = (userInfo: {
  fullName: string;
  surname: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  birthDate: string;
}): FamilyMember[] => {
  const { fullName, surname, age, height, weight, gender, birthDate } = userInfo;
  const now = new Date();
  const nowISO = now.toISOString();
  const today = now.toISOString().split('T')[0];

  const members: FamilyMember[] = [];

  // 本人
  const selfMember: FamilyMember = {
    id: 'self',
    name: fullName,
    relationship: '本人',
    gender,
    birthDate,
    avatar: gender === 'male' ? '👨' : '👩',
    healthProfile: {
      height,
      weight,
      age,
      healthStatus: 'excellent',
      healthScore: Math.floor(Math.random() * 15) + 80, // 80-95
      devices: initializeDefaultDevices(),
      healthMetrics: [],
      medications: [],
      healthReports: [],
      consultations: [],
      tasks: initializeDefaultTasks(),
      aiInterpretation: '您的健康数据整体良好，各项指标处于正常范围内。',
      aiSuggestion: '建议保持规律运动和均衡饮食，注意作息规律',
      aiInsights: [
        {
          id: 'insight-self-1',
          type: 'positive',
          title: '健康状况良好',
          description: '各项基础指标正常，继续保持健康的生活方式！',
        },
      ],
      lastUpdated: nowISO,
      dataSource: ['1', '2', '4'],
    },
    sharedData: {
      healthMetrics: true,
      devices: true,
      reports: true,
    },
    createdAt: nowISO,
    updatedAt: nowISO,
  };
  members.push(selfMember);

  // 配偶（30岁以上才添加）
  if (age >= 30) {
    const spouseAge = age + (Math.random() > 0.5 ? -2 : 2);
    const spouseGender = gender === 'male' ? 'female' : 'male';
    members.push({
      id: 'spouse',
      name: '配偶',
      relationship: '配偶',
      gender: spouseGender,
      birthDate: `${new Date().getFullYear() - spouseAge}-01-01`,
      avatar: spouseGender === 'male' ? '👨' : '👩',
      healthProfile: {
        height: spouseGender === 'female' ? 162 : 175,
        weight: spouseGender === 'female' ? 55 : 72,
        age: spouseAge,
        healthStatus: 'good',
        healthScore: Math.floor(Math.random() * 15) + 75,
        devices: [],
        healthMetrics: [],
        medications: [],
        healthReports: [],
        consultations: [],
        tasks: [],
        aiInterpretation: '整体健康状况良好。',
        aiSuggestion: '建议适当增加运动量',
        aiInsights: [],
        lastUpdated: nowISO,
        dataSource: [],
      },
      sharedData: {
        healthMetrics: true,
        devices: true,
        reports: true,
      },
      createdAt: nowISO,
      updatedAt: nowISO,
    });
  }

  // 父亲（年龄比用户大 25-30 岁，最大85岁）
  const fatherAge = age + 28;
  if (fatherAge <= 85 && fatherAge >= 45) {
    members.push({
      id: 'father',
      name: `${surname}爸爸`,
      relationship: '父亲',
      gender: 'male',
      birthDate: `${new Date().getFullYear() - fatherAge}-07-20`,
      avatar: '👴',
      healthProfile: {
        height: height + 2,
        weight: 70,
        age: fatherAge,
        healthStatus: fatherAge > 70 ? 'attention' : 'good',
        healthScore: Math.floor(Math.random() * 15) + (fatherAge > 70 ? 65 : 75),
        devices: [
          {
            id: 21,
            name: '智能手环',
            type: 'smartwatch',
            status: 'connected',
            battery: 68,
            lastSync: '5分钟前',
            connection: 'bluetooth',
            model: '华为手环 6',
            syncType: 'auto',
            isPinned: true,
            events: [
              { id: '21', deviceId: 21, timestamp: `${today}T10:00:00`, type: '心率', value: '76', unit: 'bpm', status: 'normal' },
              { id: '22', deviceId: 21, timestamp: `${today}T08:00:00`, type: '步数', value: '4823', unit: '步', status: 'normal' },
            ],
            createdAt: nowISO,
            updatedAt: nowISO,
          },
        ],
        healthMetrics: [],
        medications: [],
        healthReports: [],
        consultations: [],
        tasks: [],
        aiInterpretation: fatherAge > 70 ? '血压需要关注，建议定期监测。' : '整体健康状况良好，心率平稳。',
        aiSuggestion: '继续保持每日散步习惯，注意防寒保暖',
        aiInsights: [
          {
            id: 'insight-father-1',
            type: fatherAge > 70 ? 'warning' : 'positive',
            title: fatherAge > 70 ? '血压需要关注' : '运动习惯保持良好',
            description: fatherAge > 70 ? '建议每日监测血压，保持低盐饮食。' : '每日步数稳定，继续保持！',
          },
        ],
        lastUpdated: nowISO,
        dataSource: ['21'],
      },
      sharedData: {
        healthMetrics: true,
        devices: true,
        reports: true,
      },
      createdAt: nowISO,
      updatedAt: nowISO,
    });
  }

  // 母亲（年龄比用户大 25-28 岁，最大85岁）
  const motherAge = age + 26;
  if (motherAge <= 85 && motherAge >= 43) {
    members.push({
      id: 'mother',
      name: '妈妈',
      relationship: '母亲',
      gender: 'female',
      birthDate: `${new Date().getFullYear() - motherAge}-03-15`,
      avatar: '👵',
      healthProfile: {
        height: 158,
        weight: 60,
        age: motherAge,
        healthStatus: motherAge > 70 ? 'attention' : 'good',
        healthScore: Math.floor(Math.random() * 15) + (motherAge > 70 ? 68 : 78),
        devices: [
          {
            id: 11,
            name: '血压计',
            type: 'blood-pressure',
            status: 'connected',
            battery: 75,
            lastSync: '30分钟前',
            connection: 'bluetooth',
            model: '欧姆龙 HEM-7136',
            syncType: 'manual',
            isPinned: true,
            events: [
              { id: '11', deviceId: 11, timestamp: `${today}T08:30:00`, type: '血压', value: motherAge > 70 ? '145/90' : '125/82', unit: 'mmHg', status: motherAge > 70 ? 'warning' : 'normal' },
            ],
            createdAt: nowISO,
            updatedAt: nowISO,
          },
        ],
        healthMetrics: [],
        medications: [],
        healthReports: [],
        consultations: [],
        tasks: [],
        aiInterpretation: motherAge > 70 ? '血压略高，需要注意饮食控制和定期监测。' : '整体健康状况良好。',
        aiSuggestion: '建议减少盐分摄入，保持每日散步30分钟',
        aiInsights: [
          {
            id: 'insight-mother-1',
            type: motherAge > 70 ? 'warning' : 'positive',
            title: motherAge > 70 ? '血压需要关注' : '健康状况良好',
            description: motherAge > 70 ? '建议减少盐分摄入，如持续偏高请就医。' : '各项指标正常，继续保持！',
          },
        ],
        lastUpdated: nowISO,
        dataSource: ['11'],
      },
      sharedData: {
        healthMetrics: true,
        devices: true,
        reports: true,
      },
      createdAt: nowISO,
      updatedAt: nowISO,
    });
  }

  // 子女（如果用户年龄在 35-60 之间，可能有子女）
  if (age >= 35 && age <= 60) {
    const childAge = age - 25; // 假设25岁生孩子
    if (childAge >= 10 && childAge <= 30) {
      members.push({
        id: 'child',
        name: '孩子',
        relationship: '子女',
        gender: Math.random() > 0.5 ? 'male' : 'female',
        birthDate: `${new Date().getFullYear() - childAge}-06-10`,
        avatar: childAge >= 18 ? (Math.random() > 0.5 ? '👨' : '👩') : '👦',
        healthProfile: {
          height: childAge >= 18 ? 170 : 155,
          weight: childAge >= 18 ? 60 : 45,
          age: childAge,
          healthStatus: 'excellent',
          healthScore: Math.floor(Math.random() * 10) + 88,
          devices: [
            {
              id: 31,
              name: '智能手环',
              type: 'smartwatch',
              status: 'connected',
              battery: 92,
              lastSync: '刚刚',
              connection: 'bluetooth',
              model: '小米手环 8',
              syncType: 'auto',
              isPinned: true,
              events: [
                { id: '31', deviceId: 31, timestamp: `${today}T15:00:00`, type: '心率', value: '68', unit: 'bpm', status: 'normal' },
                { id: '32', deviceId: 31, timestamp: `${today}T12:00:00`, type: '步数', value: '12543', unit: '步', status: 'normal' },
              ],
              createdAt: nowISO,
              updatedAt: nowISO,
            },
          ],
          healthMetrics: [],
          medications: [],
          healthReports: [],
          consultations: [],
          tasks: [],
          aiInterpretation: '健康状况优秀，各项指标正常。',
          aiSuggestion: '保持良好生活习惯，注意学习时的坐姿和用眼卫生',
          aiInsights: [
            {
              id: 'insight-child-1',
              type: 'positive',
              title: '运动量充足',
              description: '每日步数超过10000步，身体素质优秀！',
            },
          ],
          lastUpdated: nowISO,
          dataSource: ['31'],
        },
        sharedData: {
          healthMetrics: true,
          devices: true,
          reports: true,
        },
        createdAt: nowISO,
        updatedAt: nowISO,
      });
    }
  }

  return members;
};

/**
 * 获取设备列表
 */
export const getDevices = async (): Promise<HealthDevice[]> => {
  const userData = await getUserData();
  return userData.devices;
};

/**
 * 添加新设备
 */
export const addDevice = async (device: Omit<HealthDevice, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthDevice> => {
  const userData = await getUserData();

  // 生成新ID
  const maxId = userData.devices.length > 0
    ? Math.max(...userData.devices.map(d => d.id))
    : 0;

  const now = new Date().toISOString();
  const newDevice: HealthDevice = {
    ...device,
    id: maxId + 1,
    createdAt: now,
    updatedAt: now,
  };

  userData.devices.push(newDevice);
  await saveUserData(userData);

  return newDevice;
};

/**
 * 更新设备
 */
export const updateDevice = async (deviceId: number, updates: Partial<HealthDevice>): Promise<boolean> => {
  const userData = await getUserData();
  const deviceIndex = userData.devices.findIndex(d => d.id === deviceId);

  if (deviceIndex === -1) {
    return false;
  }

  userData.devices[deviceIndex] = {
    ...userData.devices[deviceIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return await saveUserData(userData);
};

/**
 * 删除设备
 */
export const deleteDevice = async (deviceId: number): Promise<boolean> => {
  const userData = await getUserData();
  userData.devices = userData.devices.filter(d => d.id !== deviceId);
  return await saveUserData(userData);
};
// ==================== 任务管理相关方法 ====================

/**
 * 获取所有任务
 */
export const getTasks = async (): Promise<HealthTask[]> => {
  const userData = await getUserData();
  return userData.tasks || [];
};

/**
 * 根据分类和状态筛选任务
 */
export const getFilteredTasks = async (
  category?: HealthTask['category'],
  status?: HealthTask['status']
): Promise<HealthTask[]> => {
  const tasks = await getTasks();
  return tasks.filter(task => {
    if (category && task.category !== category) return false;
    if (status && task.status !== status) return false;
    return true;
  });
};

/**
 * 获取今日任务
 */
export const getTodayTasks = async (): Promise<HealthTask[]> => {
  const tasks = await getTasks();
  const today = new Date().toISOString().split('T')[0];

  return tasks.filter(task => {
    // 只返回重复任务或今日截止的任务
    if (task.repeatFrequency !== 'none') return true;
    if (task.dueDate && task.dueDate.startsWith(today)) return true;
    return false;
  });
};

/**
 * 根据ID获取任务
 */
export const getTaskById = async (taskId: string): Promise<HealthTask | null> => {
  const tasks = await getTasks();
  return tasks.find(task => task.id === taskId) || null;
};

/**
 * 创建新任务
 */
export const createTask = async (task: Omit<HealthTask, 'id' | 'createdAt' | 'updatedAt' | 'completionHistory' | 'achievements' | 'totalCompletions' | 'currentStreak' | 'bestStreak' | 'completionRate'>): Promise<HealthTask> => {
  const userData = await getUserData();

  const now = new Date().toISOString();
  const newTask: HealthTask = {
    ...task,
    id: `task_${Date.now()}`,
    totalCompletions: 0,
    currentStreak: 0,
    bestStreak: 0,
    completionRate: 0,
    completionHistory: [],
    achievements: [],
    createdAt: now,
    updatedAt: now,
  };

  userData.tasks.push(newTask);
  await saveUserData(userData);

  return newTask;
};

/**
 * 更新任务
 */
export const updateTask = async (taskId: string, updates: Partial<HealthTask>): Promise<boolean> => {
  const userData = await getUserData();
  const taskIndex = userData.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  userData.tasks[taskIndex] = {
    ...userData.tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return await saveUserData(userData);
};

/**
 * 删除任务
 */
export const deleteTask = async (taskId: string): Promise<boolean> => {
  const userData = await getUserData();
  userData.tasks = userData.tasks.filter(t => t.id !== taskId);
  return await saveUserData(userData);
};

/**
 * 完成任务
 */
export const completeTask = async (
  taskId: string,
  completionData?: { duration?: number; notes?: string; mood?: TaskCompletionRecord['mood'] }
): Promise<boolean> => {
  const userData = await getUserData();
  const taskIndex = userData.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  const task = userData.tasks[taskIndex];
  const now = new Date();
  const nowISO = now.toISOString();
  const today = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].substring(0, 5);

  // 添加完成记录
  const completionRecord: TaskCompletionRecord = {
    id: `completion_${Date.now()}`,
    date: today,
    time: time,
    duration: completionData?.duration,
    notes: completionData?.notes,
    mood: completionData?.mood,
  };

  task.completionHistory.push(completionRecord);
  task.totalCompletions += 1;
  task.lastCompletedAt = nowISO;
  task.status = 'completed';
  task.progress = 100;

  // 更新连续天数
  if (task.lastCompletedAt) {
    const lastDate = new Date(task.lastCompletedAt).toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

    if (lastDate === yesterday || lastDate === today) {
      task.currentStreak += 1;
    } else {
      task.currentStreak = 1;
    }
  } else {
    task.currentStreak = 1;
  }

  // 更新最佳连续天数
  if (task.currentStreak > task.bestStreak) {
    task.bestStreak = task.currentStreak;
  }

  // 更新完成率
  const totalDays = Math.ceil(
    (now.getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  task.completionRate = Math.round((task.totalCompletions / Math.max(totalDays, 1)) * 100);

  task.updatedAt = nowISO;

  userData.tasks[taskIndex] = task;
  return await saveUserData(userData);
};

/**
 * 获取任务历史记录
 */
export const getTaskHistory = async (taskId: string): Promise<TaskCompletionRecord[]> => {
  const task = await getTaskById(taskId);
  return task?.completionHistory || [];
};

/**
 * 获取任务成就
 */
export const getTaskAchievements = async (taskId: string): Promise<TaskAchievement[]> => {
  const task = await getTaskById(taskId);
  return task?.achievements || [];
};

/**
 * 添加任务成就
 */
export const addTaskAchievement = async (
  taskId: string,
  achievement: Omit<TaskAchievement, 'id'>
): Promise<boolean> => {
  const userData = await getUserData();
  const taskIndex = userData.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  const newAchievement: TaskAchievement = {
    ...achievement,
    id: `ach_${Date.now()}`,
  };

  userData.tasks[taskIndex].achievements.push(newAchievement);
  userData.tasks[taskIndex].updatedAt = new Date().toISOString();

  return await saveUserData(userData);
};

// ==================== 家庭成员管理相关方法 ====================

/**
 * 获取所有家庭成员
 */
export const getFamilyMembers = async (): Promise<FamilyMember[]> => {
  const userData = await getUserData();
  return userData.familyMembers || [];
};

/**
 * 根据ID获取家庭成员
 */
export const getFamilyMemberById = async (memberId: string): Promise<FamilyMember | null> => {
  const members = await getFamilyMembers();
  return members.find(m => m.id === memberId) || null;
};

/**
 * 获取家庭成员的健康档案
 */
export const getMemberHealthProfile = async (memberId: string): Promise<MemberHealthProfile | null> => {
  const member = await getFamilyMemberById(memberId);
  return member?.healthProfile || null;
};

/**
 * 添加家庭成员
 */
export const addFamilyMember = async (
  memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FamilyMember> => {
  const userData = await getUserData();

  const now = new Date().toISOString();
  const newMember: FamilyMember = {
    ...memberData,
    id: `member_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  userData.familyMembers.push(newMember);
  await saveUserData(userData);

  return newMember;
};

/**
 * 更新家庭成员信息
 */
export const updateFamilyMember = async (
  memberId: string,
  updates: Partial<Omit<FamilyMember, 'id' | 'createdAt'>>
): Promise<boolean> => {
  const userData = await getUserData();
  const memberIndex = userData.familyMembers.findIndex(m => m.id === memberId);

  if (memberIndex === -1) {
    return false;
  }

  userData.familyMembers[memberIndex] = {
    ...userData.familyMembers[memberIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return await saveUserData(userData);
};

/**
 * 更新家庭成员的健康档案
 */
export const updateMemberHealthProfile = async (
  memberId: string,
  profileUpdates: Partial<MemberHealthProfile>
): Promise<boolean> => {
  const userData = await getUserData();
  const memberIndex = userData.familyMembers.findIndex(m => m.id === memberId);

  if (memberIndex === -1) {
    return false;
  }

  userData.familyMembers[memberIndex].healthProfile = {
    ...userData.familyMembers[memberIndex].healthProfile,
    ...profileUpdates,
    lastUpdated: new Date().toISOString(),
  };

  userData.familyMembers[memberIndex].updatedAt = new Date().toISOString();

  return await saveUserData(userData);
};

/**
 * 删除家庭成员
 */
export const deleteFamilyMember = async (memberId: string): Promise<boolean> => {
  // 不允许删除本人
  if (memberId === 'self') {
    console.warn('不能删除本人');
    return false;
  }

  const userData = await getUserData();
  userData.familyMembers = userData.familyMembers.filter(m => m.id !== memberId);
  return await saveUserData(userData);
};

/**
 * 为家庭成员添加设备
 */
export const addDeviceToMember = async (
  memberId: string,
  device: Omit<HealthDevice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<HealthDevice | null> => {
  const userData = await getUserData();
  const memberIndex = userData.familyMembers.findIndex(m => m.id === memberId);

  if (memberIndex === -1) {
    return null;
  }

  const member = userData.familyMembers[memberIndex];
  const maxId = member.healthProfile.devices.length > 0
    ? Math.max(...member.healthProfile.devices.map(d => d.id))
    : (memberId === 'self' ? 0 : memberId.charCodeAt(0) * 10);

  const now = new Date().toISOString();
  const newDevice: HealthDevice = {
    ...device,
    id: maxId + 1,
    createdAt: now,
    updatedAt: now,
  };

  member.healthProfile.devices.push(newDevice);
  member.healthProfile.lastUpdated = now;
  member.updatedAt = now;

  await saveUserData(userData);
  return newDevice;
};

/**
 * 获取家庭成员的设备列表
 */
export const getMemberDevices = async (memberId: string): Promise<HealthDevice[]> => {
  const member = await getFamilyMemberById(memberId);
  return member?.healthProfile.devices || [];
};

/**
 * 获取家庭成员的AI洞察
 */
export const getMemberAIInsights = async (memberId: string) => {
  const member = await getFamilyMemberById(memberId);
  return member?.healthProfile.aiInsights || [];
};

/**
 * 更新家庭成员的AI分析数据
 */
export const updateMemberAIAnalysis = async (
  memberId: string,
  aiData: {
    aiInterpretation?: string;
    aiSuggestion?: string;
    aiInsights?: MemberHealthProfile['aiInsights'];
  }
): Promise<boolean> => {
  const userData = await getUserData();
  const memberIndex = userData.familyMembers.findIndex(m => m.id === memberId);

  if (memberIndex === -1) {
    return false;
  }

  const member = userData.familyMembers[memberIndex];
  if (aiData.aiInterpretation !== undefined) {
    member.healthProfile.aiInterpretation = aiData.aiInterpretation;
  }
  if (aiData.aiSuggestion !== undefined) {
    member.healthProfile.aiSuggestion = aiData.aiSuggestion;
  }
  if (aiData.aiInsights !== undefined) {
    member.healthProfile.aiInsights = aiData.aiInsights;
  }

  member.healthProfile.lastUpdated = new Date().toISOString();
  member.updatedAt = new Date().toISOString();

  return await saveUserData(userData);
};

// ==================== 会员管理相关方法 ====================

/**
 * 获取会员信息
 */
export const getMembership = async (): Promise<UserMembership> => {
  const userData = await getUserData();
  return userData.membership;
};

/**
 * 更新会员信息
 */
export const updateMembership = async (
  updates: Partial<UserMembership>
): Promise<boolean> => {
  const userData = await getUserData();
  userData.membership = {
    ...userData.membership,
    ...updates,
  };
  return await saveUserData(userData);
};

/**
 * 检查会员是否过期
 */
export const checkMembershipExpiry = async (): Promise<{
  isExpired: boolean;
  daysRemaining: number | null;
}> => {
  const membership = await getMembership();

  if (membership.level === MembershipLevel.FREE || !membership.endDate) {
    return { isExpired: false, daysRemaining: null };
  }

  const endDate = new Date(membership.endDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isExpired: diffDays <= 0,
    daysRemaining: diffDays > 0 ? diffDays : 0,
  };
};

// ==================== 积分管理相关方法 ====================

/**
 * 获取积分信息
 */
export const getPoints = async (): Promise<PointsInfo> => {
  const userData = await getUserData();
  return userData.points;
};

/**
 * 更新积分信息
 */
export const updatePoints = async (
  updates: Partial<PointsInfo>
): Promise<boolean> => {
  const userData = await getUserData();
  userData.points = {
    ...userData.points,
    ...updates,
  };
  return await saveUserData(userData);
};

/**
 * 获取当前积分倍率
 */
export const getPointsMultiplier = async (): Promise<number> => {
  const membership = await getMembership();
  return POINTS_MULTIPLIER[membership.level];
};

/**
 * 获得积分
 */
export const earnPoints = async (
  amount: number,
  source: PointsSource,
  description: string,
  relatedOrderId?: string
): Promise<boolean> => {
  const userData = await getUserData();
  const multiplier = POINTS_MULTIPLIER[userData.membership.level];
  const actualAmount = Math.floor(amount * multiplier);

  const record: PointsRecord = {
    id: `points_${Date.now()}`,
    date: new Date().toISOString(),
    type: 'earn',
    amount: actualAmount,
    multiplier,
    source,
    description,
    relatedOrderId,
  };

  userData.points.balance += actualAmount;
  userData.points.totalEarned += actualAmount;
  userData.points.history.unshift(record);

  return await saveUserData(userData);
};

/**
 * 消费积分
 */
export const spendPoints = async (
  amount: number,
  source: PointsSource,
  description: string,
  relatedOrderId?: string
): Promise<boolean> => {
  const userData = await getUserData();

  if (userData.points.balance < amount) {
    console.warn('积分余额不足');
    return false;
  }

  const record: PointsRecord = {
    id: `points_${Date.now()}`,
    date: new Date().toISOString(),
    type: 'spend',
    amount,
    source,
    description,
    relatedOrderId,
  };

  userData.points.balance -= amount;
  userData.points.totalSpent += amount;
  userData.points.history.unshift(record);

  return await saveUserData(userData);
};

/**
 * 获取积分历史
 */
export const getPointsHistory = async (
  limit?: number
): Promise<PointsRecord[]> => {
  const points = await getPoints();
  if (limit) {
    return points.history.slice(0, limit);
  }
  return points.history;
};

// ==================== 独立服务订阅管理 ====================

/**
 * 获取订阅信息
 */
export const getSubscriptions = async (): Promise<ServiceSubscriptions> => {
  const userData = await getUserData();
  return userData.subscriptions;
};

/**
 * 更新订阅信息
 */
export const updateSubscriptions = async (
  updates: Partial<ServiceSubscriptions>
): Promise<boolean> => {
  const userData = await getUserData();
  userData.subscriptions = {
    ...userData.subscriptions,
    ...updates,
  };
  return await saveUserData(userData);
};

// ==================== VIP服务台相关方法 ====================

/**
 * 活跃订阅服务信息
 */
export interface ActiveSubscription {
  type: 'privateDoctor' | 'legalService' | 'expertCert';
  name: string;
  doctorName?: string;
  doctorId?: string;
  doctorAvatar?: string;
  doctorTitle?: string;
  subscriptionId?: string;
  lawyerName?: string;
  packageLevel?: string;
  endDate: string;
  daysRemaining: number;
  isOnline?: boolean;
}

/**
 * 检查是否有任何活跃订阅
 */
export const hasActiveSubscription = async (): Promise<boolean> => {
  const subscriptions = await getSubscriptions();
  const now = new Date();

  // 检查私人医生订阅
  if (subscriptions.privateDoctor) {
    const endDate = new Date(subscriptions.privateDoctor.endDate);
    if (endDate > now) return true;
  }

  // 检查法律服务订阅
  if (subscriptions.legalService) {
    const endDate = new Date(subscriptions.legalService.endDate);
    if (endDate > now) return true;
  }

  // 检查达人认证
  if (subscriptions.expertCert) {
    const endDate = new Date(subscriptions.expertCert.endDate);
    if (endDate > now) return true;
  }

  return false;
};

/**
 * 获取所有活跃订阅列表
 */
export const getActiveSubscriptions = async (): Promise<ActiveSubscription[]> => {
  const subscriptions = await getSubscriptions();
  const now = new Date();
  const activeList: ActiveSubscription[] = [];

  // 从privateDoctorService获取真实的私人医生签约数据
  const userId = 'user_001'; // TODO: 从auth context获取
  const doctorSubscriptions = await privateDoctorService.getAllMySubscriptions(userId);

  // 添加所有私人医生签约
  for (const sub of doctorSubscriptions) {
    const endDate = new Date(sub.endDate);
    if (endDate > now && sub.status === 'active') {
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      // 获取医生信息
      const doctor = await privateDoctorService.getDoctorById(sub.doctorId);
      activeList.push({
        type: 'privateDoctor',
        name: '私人医生',
        packageLevel: sub.package.level,
        doctorId: sub.doctorId,
        doctorName: doctor?.name || '专属医生',
        doctorAvatar: doctor?.avatar,
        doctorTitle: doctor?.title,
        subscriptionId: sub.id,
        endDate: sub.endDate,
        daysRemaining,
        isOnline: doctor?.isOnline || false,
      });
    }
  }

  // 如果没有从订单获取到私人医生订阅，尝试从旧的subscriptions获取
  if (activeList.filter(s => s.type === 'privateDoctor').length === 0 && subscriptions.privateDoctor) {
    const endDate = new Date(subscriptions.privateDoctor.endDate);
    if (endDate > now) {
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      activeList.push({
        type: 'privateDoctor',
        name: '私人医生',
        packageLevel: subscriptions.privateDoctor.packageLevel,
        doctorName: '专属医生',
        endDate: subscriptions.privateDoctor.endDate,
        daysRemaining,
        isOnline: true,
      });
    }
  }

  // 检查法律服务订阅
  if (subscriptions.legalService) {
    const endDate = new Date(subscriptions.legalService.endDate);
    if (endDate > now) {
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      activeList.push({
        type: 'legalService',
        name: '法律服务',
        packageLevel: subscriptions.legalService.tier,
        lawyerName: '刘律师', // Mock，实际应关联律师数据
        endDate: subscriptions.legalService.endDate,
        daysRemaining,
        isOnline: true, // Mock
      });
    }
  }

  // 检查达人认证
  if (subscriptions.expertCert) {
    const endDate = new Date(subscriptions.expertCert.endDate);
    if (endDate > now) {
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      activeList.push({
        type: 'expertCert',
        name: subscriptions.expertCert.expertType === 'personal' ? '个人达人' : '商家达人',
        endDate: subscriptions.expertCert.endDate,
        daysRemaining,
      });
    }
  }

  return activeList;
};