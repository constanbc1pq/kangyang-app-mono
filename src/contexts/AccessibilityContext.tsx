/**
 * 无障碍/适老化设置Context
 * 提供字体大小调节、高对比度模式等适老化功能
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 字体大小枚举
 */
export enum FontSize {
  NORMAL = 'normal', // 标准字体
  LARGE = 'large', // 大字体
  EXTRA_LARGE = 'extra_large', // 超大字体
}

/**
 * 字体大小倍数映射
 */
export const FONT_SIZE_MULTIPLIERS: Record<FontSize, number> = {
  [FontSize.NORMAL]: 1.0,
  [FontSize.LARGE]: 1.3,
  [FontSize.EXTRA_LARGE]: 1.6,
};

/**
 * 颜色主题枚举
 */
export enum ColorTheme {
  LIGHT = 'light', // 浅色模式
  DARK = 'dark', // 深色模式
  HIGH_CONTRAST = 'high_contrast', // 高对比度模式（黑底白字）
}

/**
 * 无障碍设置接口
 */
export interface AccessibilitySettings {
  fontSize: FontSize;
  colorTheme: ColorTheme;
  enableVoiceInput: boolean; // 是否启用语音输入
  enableVideoTutorials: boolean; // 是否显示视频教程
  enableSimplifiedUI: boolean; // 是否启用简化UI
  enableLargeButtons: boolean; // 是否启用大按钮
  enableReadAloud: boolean; // 是否启用朗读功能
}

/**
 * Context值接口
 */
interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  updateFontSize: (size: FontSize) => Promise<void>;
  updateColorTheme: (theme: ColorTheme) => Promise<void>;
  toggleVoiceInput: () => Promise<void>;
  toggleVideoTutorials: () => Promise<void>;
  toggleSimplifiedUI: () => Promise<void>;
  toggleLargeButtons: () => Promise<void>;
  toggleReadAloud: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  getFontSizeMultiplier: () => number;
}

/**
 * 默认设置
 */
const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: FontSize.NORMAL,
  colorTheme: ColorTheme.LIGHT,
  enableVoiceInput: false,
  enableVideoTutorials: true,
  enableSimplifiedUI: false,
  enableLargeButtons: false,
  enableReadAloud: false,
};

/**
 * 存储键
 */
const STORAGE_KEY = '@accessibility_settings';

/**
 * Context
 */
const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * Provider组件
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  // 保存设置到AsyncStorage
  const saveSettings = async (newSettings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('保存无障碍设置失败:', error);
    }
  };

  // 从AsyncStorage加载设置
  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const loadedSettings = JSON.parse(data);
        setSettings({ ...DEFAULT_SETTINGS, ...loadedSettings });
      }
    } catch (error) {
      console.error('加载无障碍设置失败:', error);
    }
  };

  // 更新字体大小
  const updateFontSize = async (size: FontSize) => {
    await saveSettings({ ...settings, fontSize: size });
  };

  // 更新颜色主题
  const updateColorTheme = async (theme: ColorTheme) => {
    await saveSettings({ ...settings, colorTheme: theme });
  };

  // 切换语音输入
  const toggleVoiceInput = async () => {
    await saveSettings({ ...settings, enableVoiceInput: !settings.enableVoiceInput });
  };

  // 切换视频教程
  const toggleVideoTutorials = async () => {
    await saveSettings({ ...settings, enableVideoTutorials: !settings.enableVideoTutorials });
  };

  // 切换简化UI
  const toggleSimplifiedUI = async () => {
    await saveSettings({ ...settings, enableSimplifiedUI: !settings.enableSimplifiedUI });
  };

  // 切换大按钮
  const toggleLargeButtons = async () => {
    await saveSettings({ ...settings, enableLargeButtons: !settings.enableLargeButtons });
  };

  // 切换朗读功能
  const toggleReadAloud = async () => {
    await saveSettings({ ...settings, enableReadAloud: !settings.enableReadAloud });
  };

  // 重置为默认设置
  const resetToDefaults = async () => {
    await saveSettings(DEFAULT_SETTINGS);
  };

  // 获取字体大小倍数
  const getFontSizeMultiplier = () => {
    return FONT_SIZE_MULTIPLIERS[settings.fontSize];
  };

  const value: AccessibilityContextValue = {
    settings,
    updateFontSize,
    updateColorTheme,
    toggleVoiceInput,
    toggleVideoTutorials,
    toggleSimplifiedUI,
    toggleLargeButtons,
    toggleReadAloud,
    resetToDefaults,
    getFontSizeMultiplier,
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

/**
 * Hook
 */
export const useAccessibility = (): AccessibilityContextValue => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

/**
 * 获取主题颜色
 */
export const getThemeColors = (theme: ColorTheme) => {
  switch (theme) {
    case ColorTheme.LIGHT:
      return {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#000000',
        textSecondary: '#666666',
        primary: '#6366f1',
        border: '#E0E0E0',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
      };
    case ColorTheme.DARK:
      return {
        background: '#1A1A1A',
        surface: '#2A2A2A',
        text: '#FFFFFF',
        textSecondary: '#AAAAAA',
        primary: '#818CF8',
        border: '#404040',
        error: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
      };
    case ColorTheme.HIGH_CONTRAST:
      return {
        background: '#000000',
        surface: '#000000',
        text: '#FFFFFF',
        textSecondary: '#FFFFFF',
        primary: '#FFFF00', // 黄色，高对比度
        border: '#FFFFFF',
        error: '#FF0000',
        success: '#00FF00',
        warning: '#FFFF00',
      };
  }
};

export default AccessibilityContext;
