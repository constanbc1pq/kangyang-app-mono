import { config as defaultConfig } from '@tamagui/config';
import { createTamagui, createTokens } from 'tamagui';
import { COLORS } from '@/constants/app';
import { neutralThemes } from './neutralTheme';

/**
 * 主题配置
 *
 * 可用主题:
 * - light / dark: AzurePop 主题 (默认，鲜艳的蓝紫+薄荷青)
 * - neutral_light / neutral_dark: 中性灰紫主题 (柔和的灰色+暗紫)
 *
 * 子主题 (用于组件级别):
 * - xxx_accent: 强调色子主题
 * - xxx_success: 成功色子主题
 * - xxx_warning: 警告色子主题
 * - xxx_error: 错误色子主题
 * - xxx_Button, xxx_Card, xxx_Input: 组件专用子主题
 *
 * 切换主题示例:
 * <Theme name="neutral_light">...</Theme>
 * <Theme name="accent">...</Theme>  // 在 neutral_light 内使用
 */

// 自定义 tokens - 更大的圆角和阴影（官方风格）
const customTokens = createTokens({
  ...defaultConfig.tokens,

  // 自定义圆角 - 更大更现代
  radius: {
    ...defaultConfig.tokens.radius,
    0: 0,
    1: 3,
    2: 5,
    3: 8,
    4: 12,
    5: 16,
    6: 20,
    7: 24,
    8: 32,
    9: 40,
    10: 48,
    11: 56,
    12: 1000, // 圆形
    true: 12,
  },

  // 自定义尺寸
  size: {
    ...defaultConfig.tokens.size,
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 8,
    1: 20,
    1.5: 24,
    2: 28,
    2.5: 32,
    3: 36,
    3.5: 40,
    4: 44,
    4.5: 48,
    5: 52,
    6: 64,
    7: 74,
    8: 84,
    9: 94,
    10: 104,
    11: 124,
    12: 144,
    true: 44,
  },

  // 自定义间距
  space: {
    ...defaultConfig.tokens.space,
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 8,
    1: 10,
    1.5: 12,
    2: 14,
    2.5: 16,
    3: 18,
    3.5: 20,
    4: 24,
    4.5: 28,
    5: 32,
    6: 40,
    7: 48,
    8: 64,
    9: 80,
    10: 96,
    true: 16,
    '-0.25': -2,
    '-0.5': -4,
    '-0.75': -8,
    '-1': -10,
    '-1.5': -12,
    '-2': -14,
    '-2.5': -16,
    '-3': -18,
    '-3.5': -20,
    '-4': -24,
    '-true': -16,
  },
});

// AzurePop 主题 - 当前使用的鲜艳主题
const azurePopThemes = {
  light: {
    ...defaultConfig.themes.light,
    // 色阶系统
    color1: '#FFFFFF',
    color2: '#FAFCFF',
    color3: '#F5F7FA',
    color4: '#EEF2F7',
    color5: '#E5E9F0',
    color6: '#D8DCE5',
    color7: '#C4C9D4',
    color8: '#A0A5B0',
    color9: '#7C818C',
    color10: '#5C6170',
    color11: '#3C4050',
    color12: '#1A1D29',

    // 语义化颜色
    primary: COLORS.primary,
    primaryHover: '#D66EF5',
    primaryPress: '#B545E0',
    primaryLight: '#A78BFA',
    primaryDark: '#6D28D9',
    secondary: COLORS.secondary,
    secondaryHover: '#9AFFFF',
    secondaryLight: '#67E8F9',
    accent: COLORS.accent,
    success: COLORS.success,
    successLight: '#D1FAE5',
    warning: COLORS.warning,
    warningLight: '#FEF3C7',
    error: COLORS.error,
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    gold: COLORS.gold,
    goldLight: '#F5E6B8',
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceHover: '#F8FAFC',
    text: COLORS.text,
    textSecondary: COLORS.textSecondary,
    textTertiary: '#94A3B8',
    textMuted: '#CBD5E1',
    gradientStart: COLORS.primary,
    gradientEnd: COLORS.accent,
    cardBg: COLORS.surface,
    borderColor: '#E5E7EB',
    borderColorLight: '#F1F5F9',
    borderColorDark: '#CBD5E1',
    shadow: 'rgba(0,0,0,0.08)',
    shadowColor: 'rgba(0,0,0,0.08)',
    outlineColor: '#E5E7EB',
  },
  dark: {
    ...defaultConfig.themes.dark,
    // 色阶系统
    color1: '#0A0D14',
    color2: '#0F172A',
    color3: '#1E293B',
    color4: '#334155',
    color5: '#475569',
    color6: '#64748B',
    color7: '#94A3B8',
    color8: '#CBD5E1',
    color9: '#E2E8F0',
    color10: '#F1F5F9',
    color11: '#F8FAFC',
    color12: '#FFFFFF',

    // 语义化颜色
    primary: '#818CF8',
    primaryHover: '#A5B4FC',
    primaryPress: '#6366F1',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    secondary: '#22D3EE',
    secondaryHover: '#67E8F9',
    secondaryLight: '#67E8F9',
    accent: '#A78BFA',
    success: '#34D399',
    successLight: '#065F46',
    warning: '#FBBF24',
    warningLight: '#78350F',
    error: '#F87171',
    errorLight: '#7F1D1D',
    info: '#60A5FA',
    gold: '#D4AF37',
    goldLight: '#8B7322',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textMuted: '#64748B',
    gradientStart: '#818CF8',
    gradientEnd: '#A78BFA',
    cardBg: '#1E293B',
    borderColor: '#475569',
    borderColorLight: '#334155',
    borderColorDark: '#64748B',
    shadow: 'rgba(0,0,0,0.4)',
    shadowColor: 'rgba(0,0,0,0.4)',
    outlineColor: '#475569',
  },
};

// 将 neutral 主题重命名为 neutral_light / neutral_dark
const renamedNeutralThemes: Record<string, any> = {};
Object.entries(neutralThemes).forEach(([key, value]) => {
  // light -> neutral_light, dark -> neutral_dark, light_accent -> neutral_light_accent, etc.
  const newKey = key.startsWith('light')
    ? `neutral_${key}`
    : key.startsWith('dark')
      ? `neutral_${key}`
      : `neutral_${key}`;
  renamedNeutralThemes[newKey] = value;
});

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens: customTokens,
  themes: {
    ...defaultConfig.themes,
    // AzurePop 主题 (默认)
    ...azurePopThemes,
    // Neutral 主题 (可选)
    ...renamedNeutralThemes,
  },
  settings: {
    ...defaultConfig.settings,
    // 禁用基于系统 prefers-color-scheme 的自动主题切换
    // 主题完全由 App.tsx 中的 CURRENT_THEME 控制
    allowedStyleValues: 'somewhat-strict-web',
    themeClassNameOnRoot: false,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
