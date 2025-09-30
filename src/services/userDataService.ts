/**
 * 用户数据服务 - 处理本地数据的初始化和管理
 * 使用AsyncStorage存储用户数据
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, HealthDevice, DeviceEvent } from '@/types/userData';

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
      events: [
        { id: '6', deviceId: 4, timestamp: `${today}T07:00:00`, type: '体重', value: '68.5', unit: 'kg', status: 'normal' },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
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