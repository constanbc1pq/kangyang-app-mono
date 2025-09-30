import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DeviceEvent {
  id: number;
  timestamp: string;
  type: string;
  value: string;
  unit?: string;
  status: 'normal' | 'warning' | 'danger';
  note?: string;
}

interface Device {
  id: number;
  name: string;
  type: 'smartwatch' | 'blood-pressure' | 'glucose-meter' | 'scale' | 'thermometer' | 'smart-toilet';
  status: 'connected' | 'disconnected' | 'syncing';
  battery: number;
  lastSync: string;
  connection: 'wifi' | 'bluetooth';
  model?: string;
  syncType: 'auto' | 'manual';
  events: DeviceEvent[];
}

interface DeviceContextType {
  devices: Device[];
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: number, updates: Partial<Device>) => void;
  deleteDevice: (id: number) => void;
  syncDevice: (id: number) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | null>(null);

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevices must be used within DeviceProvider');
  }
  return context;
};

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([
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
        { id: 1, timestamp: '2024-01-15 14:30', type: '心率', value: '72', unit: 'bpm', status: 'normal' },
        { id: 2, timestamp: '2024-01-15 12:00', type: '步数', value: '8,542', unit: '步', status: 'normal' },
        { id: 3, timestamp: '2024-01-15 09:15', type: '睡眠质量', value: '85', unit: '%', status: 'normal' },
        {
          id: 4,
          timestamp: '2024-01-14 22:30',
          type: '心率',
          value: '95',
          unit: 'bpm',
          status: 'warning',
          note: '心率偏高',
        },
      ],
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
        { id: 1, timestamp: '2024-01-15 08:00', type: '血压', value: '120/80', unit: 'mmHg', status: 'normal' },
        {
          id: 2,
          timestamp: '2024-01-14 20:00',
          type: '血压',
          value: '135/85',
          unit: 'mmHg',
          status: 'warning',
          note: '血压偏高',
        },
        { id: 3, timestamp: '2024-01-14 08:00', type: '血压', value: '118/78', unit: 'mmHg', status: 'normal' },
      ],
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
        { id: 1, timestamp: '2024-01-15 07:30', type: '空腹血糖', value: '5.8', unit: 'mmol/L', status: 'normal' },
        {
          id: 2,
          timestamp: '2024-01-14 19:00',
          type: '餐后血糖',
          value: '8.2',
          unit: 'mmol/L',
          status: 'warning',
          note: '餐后血糖偏高',
        },
      ],
    },
    {
      id: 4,
      name: '智能体脂秤',
      type: 'scale',
      status: 'connected',
      battery: 90,
      lastSync: '10分钟前',
      connection: 'wifi',
      model: '华为体脂秤 3',
      syncType: 'auto',
      events: [
        { id: 1, timestamp: '2024-01-15 07:00', type: '体重', value: '68.5', unit: 'kg', status: 'normal' },
        { id: 2, timestamp: '2024-01-15 07:00', type: '体脂率', value: '22.3', unit: '%', status: 'normal' },
      ],
    },
    {
      id: 5,
      name: '智能马桶',
      type: 'smart-toilet',
      status: 'connected',
      battery: 100,
      lastSync: '1小时前',
      connection: 'wifi',
      model: 'TOTO智能马桶',
      syncType: 'auto',
      events: [
        { id: 1, timestamp: '2024-01-15 08:30', type: '尿液分析', value: '正常', status: 'normal' },
        { id: 2, timestamp: '2024-01-15 08:30', type: 'pH值', value: '6.5', status: 'normal' },
        {
          id: 3,
          timestamp: '2024-01-14 08:30',
          type: '尿液分析',
          value: '异常',
          status: 'warning',
          note: '检测到微量蛋白',
        },
      ],
    },
    {
      id: 6,
      name: '血氧仪',
      type: 'thermometer',
      status: 'connected',
      battery: 78,
      lastSync: '30分钟前',
      connection: 'bluetooth',
      model: '飞利浦血氧仪',
      syncType: 'manual',
      events: [
        { id: 1, timestamp: '2024-01-15 16:00', type: '血氧饱和度', value: '98', unit: '%', status: 'normal' },
        { id: 2, timestamp: '2024-01-15 12:00', type: '脉搏', value: '75', unit: 'bpm', status: 'normal' },
      ],
    },
    {
      id: 7,
      name: '睡眠监测器',
      type: 'smartwatch',
      status: 'syncing',
      battery: 55,
      lastSync: '同步中',
      connection: 'wifi',
      model: '华米睡眠带',
      syncType: 'auto',
      events: [
        { id: 1, timestamp: '2024-01-15 06:30', type: '深度睡眠', value: '3.2', unit: '小时', status: 'normal' },
        { id: 2, timestamp: '2024-01-15 06:30', type: '浅度睡眠', value: '4.8', unit: '小时', status: 'normal' },
      ],
    },
    {
      id: 8,
      name: '心电图仪',
      type: 'smartwatch',
      status: 'disconnected',
      battery: 25,
      lastSync: '6小时前',
      connection: 'bluetooth',
      model: 'Apple Watch ECG',
      syncType: 'manual',
      events: [
        { id: 1, timestamp: '2024-01-14 18:00', type: '心电图', value: '正常窦律', status: 'normal' },
        {
          id: 2,
          timestamp: '2024-01-14 12:00',
          type: '心率变异性',
          value: '偏低',
          status: 'warning',
          note: '建议注意休息',
        },
      ],
    },
  ]);

  const addDevice = (device: Device) => {
    setDevices(prev => [...prev, device]);
  };

  const updateDevice = (id: number, updates: Partial<Device>) => {
    setDevices(prev => prev.map(device =>
      device.id === id ? { ...device, ...updates } : device
    ));
  };

  const deleteDevice = (id: number) => {
    setDevices(prev => prev.filter(device => device.id !== id));
  };

  const syncDevice = async (id: number) => {
    // 模拟同步过程
    updateDevice(id, { status: 'syncing' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateDevice(id, { status: 'connected', lastSync: '刚刚' });
  };

  const value: DeviceContextType = {
    devices,
    setDevices,
    addDevice,
    updateDevice,
    deleteDevice,
    syncDevice,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export type { Device, DeviceEvent };