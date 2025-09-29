import { config as defaultConfig } from '@tamagui/config';
import { createTamagui } from 'tamagui';

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    // Override with custom colors for KangYang app
    light: {
      ...defaultConfig.themes.light,
      primary: '#7C3AED', // Purple theme
      secondary: '#2C7A7B', // Cyan theme
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#374151',
      textSecondary: '#6B7280',
    },
    dark: {
      ...defaultConfig.themes.dark,
      primary: '#A78BFA', // Lighter purple for dark mode
      secondary: '#4FD1C7', // Lighter cyan for dark mode
      success: '#34D399',
      error: '#F87171',
      warning: '#FBBF24',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}