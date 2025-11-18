/**
 * 设备数据存储服务
 * 管理设备测量数据的本地存储
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceType } from '@/types/common';
import { ParsedField } from './deviceDataParser';

/**
 * 数据来源类型
 */
export enum DataSource {
  MANUAL_PHOTO = 'manual_photo', // 手动拍照上传
  MANUAL_INPUT = 'manual_input', // 手动输入
  AUTO_SYNC = 'auto_sync', // 自动同步
}

/**
 * 设备数据记录
 */
export interface DeviceDataRecord {
  id: string;
  deviceId: string;
  deviceType: DeviceType;
  measurements: Record<string, ParsedField>; // 测量数据
  timestamp: string; // 测量时间（ISO格式）
  source: DataSource; // 数据来源
  imageUri?: string; // 原始图片URI（可选）
  ocrRawText?: string; // OCR原始文本（调试用，可选）
  verified: boolean; // 是否用户确认
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 存储Key前缀
const STORAGE_KEY_PREFIX = '@device_data:';
const MAX_RECORDS_PER_DEVICE = 100; // 每个设备最多保存100条记录

/**
 * 生成存储Key
 */
const getStorageKey = (deviceId: string): string => {
  return `${STORAGE_KEY_PREFIX}${deviceId}`;
};

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 保存设备数据记录
 * @param deviceId 设备ID
 * @param record 数据记录
 */
export const saveDeviceData = async (
  deviceId: string,
  record: Omit<DeviceDataRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DeviceDataRecord> => {
  try {
    // 创建完整的记录
    const now = new Date().toISOString();
    const fullRecord: DeviceDataRecord = {
      ...record,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    // 获取现有数据
    const existingDataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    const existingData: DeviceDataRecord[] = existingDataJson
      ? JSON.parse(existingDataJson)
      : [];

    // 添加新数据到开头
    existingData.unshift(fullRecord);

    // 限制存储数量
    const limitedData = existingData.slice(0, MAX_RECORDS_PER_DEVICE);

    // 保存
    await AsyncStorage.setItem(getStorageKey(deviceId), JSON.stringify(limitedData));

    console.log('设备数据保存成功:', {
      deviceId,
      recordId: fullRecord.id,
      recordCount: limitedData.length,
    });

    return fullRecord;
  } catch (error) {
    console.error('保存设备数据失败:', error);
    throw new Error('数据保存失败，请重试');
  }
};

/**
 * 获取设备最新数据
 * @param deviceId 设备ID
 * @returns 最新的数据记录，如果没有则返回null
 */
export const getLatestDeviceData = async (
  deviceId: string
): Promise<DeviceDataRecord | null> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return null;

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('获取设备最新数据失败:', error);
    return null;
  }
};

/**
 * 获取设备历史数据
 * @param deviceId 设备ID
 * @param limit 返回的记录数量限制（默认30条）
 * @param offset 偏移量（用于分页，默认0）
 * @returns 数据记录数组
 */
export const getDeviceDataHistory = async (
  deviceId: string,
  limit: number = 30,
  offset: number = 0
): Promise<DeviceDataRecord[]> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return [];

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    return data.slice(offset, offset + limit);
  } catch (error) {
    console.error('获取设备历史数据失败:', error);
    return [];
  }
};

/**
 * 获取指定数据记录
 * @param deviceId 设备ID
 * @param recordId 记录ID
 * @returns 数据记录，如果没有则返回null
 */
export const getDeviceDataById = async (
  deviceId: string,
  recordId: string
): Promise<DeviceDataRecord | null> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return null;

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    return data.find((record) => record.id === recordId) || null;
  } catch (error) {
    console.error('获取设备数据失败:', error);
    return null;
  }
};

/**
 * 更新数据记录
 * @param deviceId 设备ID
 * @param recordId 记录ID
 * @param updates 要更新的字段
 */
export const updateDeviceData = async (
  deviceId: string,
  recordId: string,
  updates: Partial<DeviceDataRecord>
): Promise<boolean> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return false;

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    const index = data.findIndex((record) => record.id === recordId);

    if (index === -1) return false;

    // 更新记录
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(getStorageKey(deviceId), JSON.stringify(data));
    console.log('设备数据更新成功:', { deviceId, recordId });

    return true;
  } catch (error) {
    console.error('更新设备数据失败:', error);
    return false;
  }
};

/**
 * 删除数据记录
 * @param deviceId 设备ID
 * @param recordId 记录ID
 */
export const deleteDeviceData = async (
  deviceId: string,
  recordId: string
): Promise<boolean> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return false;

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    const filteredData = data.filter((record) => record.id !== recordId);

    if (filteredData.length === data.length) {
      // 没有找到要删除的记录
      return false;
    }

    await AsyncStorage.setItem(getStorageKey(deviceId), JSON.stringify(filteredData));
    console.log('设备数据删除成功:', { deviceId, recordId });

    return true;
  } catch (error) {
    console.error('删除设备数据失败:', error);
    return false;
  }
};

/**
 * 删除设备的所有数据
 * @param deviceId 设备ID
 */
export const clearDeviceData = async (deviceId: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(getStorageKey(deviceId));
    console.log('设备数据已清除:', deviceId);
    return true;
  } catch (error) {
    console.error('清除设备数据失败:', error);
    return false;
  }
};

/**
 * 获取设备数据统计
 * @param deviceId 设备ID
 * @returns 统计信息
 */
export const getDeviceDataStats = async (
  deviceId: string
): Promise<{
  totalCount: number;
  latestTimestamp: string | null;
  oldestTimestamp: string | null;
  sourceBreakdown: Record<DataSource, number>;
}> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) {
      return {
        totalCount: 0,
        latestTimestamp: null,
        oldestTimestamp: null,
        sourceBreakdown: {
          [DataSource.MANUAL_PHOTO]: 0,
          [DataSource.MANUAL_INPUT]: 0,
          [DataSource.AUTO_SYNC]: 0,
        },
      };
    }

    const data: DeviceDataRecord[] = JSON.parse(dataJson);

    // 统计各来源的数据数量
    const sourceBreakdown = data.reduce(
      (acc, record) => {
        acc[record.source] = (acc[record.source] || 0) + 1;
        return acc;
      },
      {
        [DataSource.MANUAL_PHOTO]: 0,
        [DataSource.MANUAL_INPUT]: 0,
        [DataSource.AUTO_SYNC]: 0,
      } as Record<DataSource, number>
    );

    return {
      totalCount: data.length,
      latestTimestamp: data.length > 0 ? data[0].timestamp : null,
      oldestTimestamp: data.length > 0 ? data[data.length - 1].timestamp : null,
      sourceBreakdown,
    };
  } catch (error) {
    console.error('获取设备数据统计失败:', error);
    return {
      totalCount: 0,
      latestTimestamp: null,
      oldestTimestamp: null,
      sourceBreakdown: {
        [DataSource.MANUAL_PHOTO]: 0,
        [DataSource.MANUAL_INPUT]: 0,
        [DataSource.AUTO_SYNC]: 0,
      },
    };
  }
};

/**
 * 按时间范围筛选数据
 * @param deviceId 设备ID
 * @param startDate 开始日期（ISO格式）
 * @param endDate 结束日期（ISO格式）
 * @returns 筛选后的数据记录
 */
export const getDeviceDataByDateRange = async (
  deviceId: string,
  startDate: string,
  endDate: string
): Promise<DeviceDataRecord[]> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return [];

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return data.filter((record) => {
      const recordTime = new Date(record.timestamp).getTime();
      return recordTime >= start && recordTime <= end;
    });
  } catch (error) {
    console.error('按时间范围筛选数据失败:', error);
    return [];
  }
};

/**
 * 按数据来源筛选
 * @param deviceId 设备ID
 * @param source 数据来源
 * @returns 筛选后的数据记录
 */
export const getDeviceDataBySource = async (
  deviceId: string,
  source: DataSource
): Promise<DeviceDataRecord[]> => {
  try {
    const dataJson = await AsyncStorage.getItem(getStorageKey(deviceId));
    if (!dataJson) return [];

    const data: DeviceDataRecord[] = JSON.parse(dataJson);
    return data.filter((record) => record.source === source);
  } catch (error) {
    console.error('按来源筛选数据失败:', error);
    return [];
  }
};
