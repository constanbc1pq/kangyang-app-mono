import { config as defaultConfig } from '@tamagui/config';
import { createTamagui } from 'tamagui';
import { COLORS } from '@/constants/app';

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    // Override with custom colors for KangYang app
    light: {
      ...defaultConfig.themes.light,
      primary: COLORS.primary, // 使用COLORS常量
      primaryLight: '#A78BFA', // Violet-400 for lighter accents
      primaryDark: '#6D28D9', // Violet-700 for darker accents
      secondary: COLORS.secondary, // 使用COLORS常量
      secondaryLight: '#67E8F9', // Cyan-300 for lighter accents
      accent: COLORS.accent, // 使用COLORS常量
      success: COLORS.success, // 使用COLORS常量
      warning: COLORS.warning, // 使用COLORS常量
      error: COLORS.error, // 使用COLORS常量
      background: COLORS.background,
      surface: COLORS.surface,
      text: COLORS.text,
      textSecondary: COLORS.textSecondary,
      // Additional utility colors
      gradientStart: COLORS.primary,
      gradientEnd: COLORS.accent,
      cardBg: COLORS.surface,
      borderColor: '#E5E7EB',
      shadow: '#000000',
      outlineColor: '#E5E7EB',
    },
    dark: {
      ...defaultConfig.themes.dark,
      primary: '#818CF8', // Indigo-400 for dark mode
      primaryLight: '#A5B4FC', // Indigo-300 for lighter accents
      primaryDark: '#6366F1', // Indigo-500 for darker accents
      secondary: '#22D3EE', // Cyan-400 for secondary
      secondaryLight: '#67E8F9', // Cyan-300 for lighter accents
      accent: '#A78BFA', // Violet-400 for accent colors
      success: '#34D399', // Emerald-400
      warning: '#FBBF24', // Amber-400
      error: '#F87171', // Red-400
      background: '#0F172A', // Slate-900
      surface: '#1E293B', // Slate-800
      text: '#F8FAFC', // Slate-50
      textSecondary: '#CBD5E1', // Slate-400
      // Additional utility colors
      gradientStart: '#818CF8',
      gradientEnd: '#A78BFA',
      cardBg: '#1E293B',
      borderColor: '#475569',
      shadow: '#000000',
      outlineColor: '#475569',
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}