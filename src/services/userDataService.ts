/**
 * 用户数据服务 - 处理本地数据的初始化和管理
 * 使用AsyncStorage存储用户数据
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, HealthDevice, DeviceEvent, HealthTask, TaskCompletionRecord, TaskAchievement } from '@/types/userData';

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
    familyMembers: [],
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
    version: '1.0.0',
    lastModified: now,
  };
};

/**
 * 获取用户数据，如果不存在则初始化
 */
export const getUserData = async (): Promise<UserData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);

    if (jsonValue !== null) {
      // 已有数据，直接返回
      return JSON.parse(jsonValue);
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

/**
 * 清除所有用户数据（用于测试或重置）
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