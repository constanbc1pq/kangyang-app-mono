/**
 * 设备数据解析服务
 * 从OCR识别的文本中提取设备测量数据
 */

import { DeviceType } from '@/types/common';

/**
 * 解析到的测量字段
 */
export interface ParsedField {
  value: number | string;
  unit: string;
  confidence: number; // 置信度 0-1
}

/**
 * 解析结果
 */
export interface ParsedDeviceData {
  success: boolean;
  deviceType: DeviceType;
  fields: Record<string, ParsedField>;
  errors: string[];
  rawText: string;
}

/**
 * 识别规则配置
 */
interface RecognitionPattern {
  field: string; // 字段名
  regex: RegExp; // 匹配正则表达式
  unit: string; // 单位
  range?: [number, number]; // 有效数值范围
}

/**
 * 设备识别规则映射
 */
const DEVICE_RECOGNITION_RULES: Record<DeviceType, {
  patterns: RecognitionPattern[];
  requiredFields: string[];
}> = {
  // 血压计
  blood_pressure_monitor: {
    patterns: [
      {
        field: 'systolic',
        regex: /(?:收缩压|SYS|高压|systolic)[:\s：]*(\d{2,3})/i,
        unit: 'mmHg',
        range: [60, 200],
      },
      {
        field: 'diastolic',
        regex: /(?:舒张压|DIA|低压|diastolic)[:\s：]*(\d{2,3})/i,
        unit: 'mmHg',
        range: [40, 130],
      },
      {
        field: 'heartRate',
        regex: /(?:心率|HR|脉搏|pulse)[:\s：]*(\d{2,3})/i,
        unit: 'bpm',
        range: [40, 180],
      },
    ],
    requiredFields: ['systolic', 'diastolic'],
  },

  // 血糖仪
  glucometer: {
    patterns: [
      {
        field: 'glucose',
        regex: /(?:血糖|GLU|glucose)[:\s：]*(\d+\.?\d*)/i,
        unit: 'mmol/L',
        range: [2.0, 30.0],
      },
      {
        // 备用规则：匹配纯小数（如 5.6、6.2）
        field: 'glucose',
        regex: /^[\s]*(\d+\.\d+)[\s]*$/,
        unit: 'mmol/L',
        range: [2.0, 30.0],
      },
      {
        // 备用规则2：匹配1-2位整数+小数
        field: 'glucose',
        regex: /(\d{1,2}\.\d{1,2})/,
        unit: 'mmol/L',
        range: [2.0, 30.0],
      },
      {
        // 备用规则3：匹配任意数字（测试用，会提示数值异常）
        field: 'glucose',
        regex: /(\d+)/,
        unit: 'mmol/L',
        range: [2.0, 30.0],
      },
    ],
    requiredFields: ['glucose'],
  },

  // 智能手环/运动手表
  fitness_tracker: {
    patterns: [
      {
        field: 'heartRate',
        regex: /(?:心率|HR|bpm)[:\s：]*(\d{2,3})/i,
        unit: 'bpm',
        range: [40, 180],
      },
      {
        field: 'bloodOxygen',
        regex: /(?:血氧|SpO2|oxygen)[:\s：]*(\d{2,3})/i,
        unit: '%',
        range: [70, 100],
      },
      {
        field: 'steps',
        regex: /(?:步数|步|steps)[:\s：]*(\d+)/i,
        unit: '步',
        range: [0, 100000],
      },
      {
        field: 'calories',
        regex: /(?:卡路里|热量|calories)[:\s：]*(\d+)/i,
        unit: 'kcal',
        range: [0, 10000],
      },
    ],
    requiredFields: ['heartRate'],
  },

  // 体脂秤
  smart_scale: {
    patterns: [
      {
        field: 'weight',
        regex: /(?:体重|重量|weight)[:\s：]*(\d+\.?\d*)/i,
        unit: 'kg',
        range: [20, 300],
      },
      {
        field: 'bodyFat',
        regex: /(?:体脂|脂肪|fat)[:\s：]*(\d+\.?\d*)/i,
        unit: '%',
        range: [5, 60],
      },
      {
        field: 'bmi',
        regex: /(?:BMI|体质指数)[:\s：]*(\d+\.?\d*)/i,
        unit: '',
        range: [10, 50],
      },
      {
        field: 'muscleMass',
        regex: /(?:肌肉|muscle)[:\s：]*(\d+\.?\d*)/i,
        unit: 'kg',
        range: [10, 100],
      },
      {
        field: 'boneMass',
        regex: /(?:骨量|bone)[:\s：]*(\d+\.?\d*)/i,
        unit: 'kg',
        range: [1, 10],
      },
      {
        field: 'waterPercentage',
        regex: /(?:水分|water)[:\s：]*(\d+\.?\d*)/i,
        unit: '%',
        range: [30, 80],
      },
    ],
    requiredFields: ['weight'],
  },

  // 心率监测器
  heart_rate_monitor: {
    patterns: [
      {
        field: 'heartRate',
        regex: /(?:心率|HR|bpm)[:\s：]*(\d{2,3})/i,
        unit: 'bpm',
        range: [40, 180],
      },
    ],
    requiredFields: ['heartRate'],
  },

  // 智能座便器
  smart_toilet: {
    patterns: [
      {
        field: 'temperature',
        regex: /(?:体温|温度|TEMP|temperature)[:\s：]*(\d+\.?\d*)/i,
        unit: '°C',
        range: [35.0, 42.0],
      },
      {
        // 备用规则：匹配36-42范围的小数（体温常见范围）
        field: 'temperature',
        regex: /(3[5-9]\.\d|4[0-2]\.\d)/,
        unit: '°C',
        range: [35.0, 42.0],
      },
      {
        field: 'heartRate',
        regex: /(?:心率|HR|bpm|脉搏)[:\s：]*(\d{2,3})/i,
        unit: 'bpm',
        range: [40, 180],
      },
      {
        field: 'bloodOxygen',
        regex: /(?:血氧|SpO2|oxygen)[:\s：]*(\d{2,3})/i,
        unit: '%',
        range: [70, 100],
      },
    ],
    requiredFields: ['temperature'],
  },
};

/**
 * 解析设备数据
 * @param ocrText OCR识别的文本
 * @param deviceType 设备类型
 * @returns 解析结果
 */
export const parseDeviceData = (
  ocrText: string,
  deviceType: DeviceType
): ParsedDeviceData => {
  const rules = DEVICE_RECOGNITION_RULES[deviceType];

  if (!rules) {
    return {
      success: false,
      deviceType,
      fields: {},
      errors: [`不支持的设备类型: ${deviceType}`],
      rawText: ocrText,
    };
  }

  const fields: Record<string, ParsedField> = {};
  const errors: string[] = [];

  // 遍历识别规则
  rules.patterns.forEach((pattern) => {
    const match = ocrText.match(pattern.regex);
    if (match && match[1]) {
      const valueStr = match[1];
      const value = parseFloat(valueStr);

      // 验证数值范围
      if (pattern.range) {
        const [min, max] = pattern.range;
        if (value < min || value > max) {
          errors.push(
            `${pattern.field} 数值异常: ${value}${pattern.unit} (正常范围: ${min}-${max})`
          );
        }
      }

      fields[pattern.field] = {
        value,
        unit: pattern.unit,
        confidence: 0.9, // 简化处理，实际可根据匹配质量调整
      };
    }
  });

  // 检查必需字段
  const missingFields = rules.requiredFields.filter((field) => !fields[field]);

  if (missingFields.length > 0) {
    errors.push(`缺少必需字段: ${missingFields.join(', ')}`);
  }

  const success = errors.length === 0 && Object.keys(fields).length > 0;

  return {
    success,
    deviceType,
    fields,
    errors,
    rawText: ocrText,
  };
};

/**
 * 验证测量数据是否异常
 * @param deviceType 设备类型
 * @param field 字段名
 * @param value 数值
 * @returns 是否异常
 */
export const isAbnormalValue = (
  deviceType: DeviceType,
  field: string,
  value: number
): boolean => {
  const rules = DEVICE_RECOGNITION_RULES[deviceType];
  if (!rules) return false;

  const pattern = rules.patterns.find((p) => p.field === field);
  if (!pattern || !pattern.range) return false;

  const [min, max] = pattern.range;
  return value < min || value > max;
};

/**
 * 获取字段的正常范围描述
 * @param deviceType 设备类型
 * @param field 字段名
 * @returns 范围描述字符串
 */
export const getFieldRangeDescription = (
  deviceType: DeviceType,
  field: string
): string => {
  const rules = DEVICE_RECOGNITION_RULES[deviceType];
  if (!rules) return '';

  const pattern = rules.patterns.find((p) => p.field === field);
  if (!pattern || !pattern.range) return '';

  const [min, max] = pattern.range;
  return `${min}-${max}${pattern.unit}`;
};

/**
 * 获取字段的显示名称（中文）
 */
export const getFieldDisplayName = (field: string): string => {
  const nameMap: Record<string, string> = {
    systolic: '收缩压',
    diastolic: '舒张压',
    heartRate: '心率',
    glucose: '血糖',
    bloodOxygen: '血氧',
    steps: '步数',
    calories: '卡路里',
    weight: '体重',
    bodyFat: '体脂率',
    bmi: 'BMI',
    muscleMass: '肌肉量',
    boneMass: '骨量',
    waterPercentage: '水分',
    temperature: '体温',
  };

  return nameMap[field] || field;
};

/**
 * 格式化显示数值
 * @param value 数值
 * @param unit 单位
 * @returns 格式化后的字符串
 */
export const formatFieldValue = (value: number | string, unit: string): string => {
  if (typeof value === 'string') {
    return `${value}${unit}`;
  }

  // 保留合适的小数位数
  let formattedValue: string;
  if (value >= 100) {
    formattedValue = value.toFixed(0);
  } else if (value >= 10) {
    formattedValue = value.toFixed(1);
  } else {
    formattedValue = value.toFixed(2);
  }

  return `${formattedValue}${unit}`;
};

/**
 * 获取设备类型的显示名称
 */
export const getDeviceTypeDisplayName = (deviceType: DeviceType): string => {
  const nameMap: Record<DeviceType, string> = {
    blood_pressure_monitor: '血压计',
    glucometer: '血糖仪',
    fitness_tracker: '智能手环',
    smart_scale: '体脂秤',
    heart_rate_monitor: '心率监测器',
    smart_toilet: '智能座便器',
  };

  return nameMap[deviceType] || deviceType;
};

/**
 * 获取健康建议
 * @param deviceType 设备类型
 * @param field 字段名
 * @param value 数值
 * @returns 健康建议
 */
export const getHealthAdvice = (
  deviceType: DeviceType,
  field: string,
  value: number
): string => {
  // 血压建议
  if (deviceType === 'blood_pressure_monitor') {
    if (field === 'systolic') {
      if (value >= 140) return '收缩压偏高，建议咨询医生';
      if (value < 90) return '收缩压偏低，注意休息';
    }
    if (field === 'diastolic') {
      if (value >= 90) return '舒张压偏高，建议咨询医生';
      if (value < 60) return '舒张压偏低，注意休息';
    }
  }

  // 血糖建议
  if (deviceType === 'glucometer' && field === 'glucose') {
    if (value >= 7.0) return '血糖偏高，建议咨询医生';
    if (value < 3.9) return '血糖偏低，注意补充能量';
  }

  // 血氧建议
  if (field === 'bloodOxygen' && value < 95) {
    return '血氧偏低，建议就医检查';
  }

  // 体重建议
  if (field === 'bmi') {
    if (value >= 28) return 'BMI偏高，建议控制体重';
    if (value < 18.5) return 'BMI偏低，建议增加营养';
  }

  // 体温建议
  if (field === 'temperature') {
    if (value >= 37.3) return '体温偏高，可能发烧，建议观察或就医';
    if (value < 36.0) return '体温偏低，注意保暖';
  }

  return '';
};
