import { config } from '@gluestack-ui/config';

// 康养APP明亮紫色主题配置
const customConfig = {
  ...config,
  tokens: {
    ...config.tokens,
    colors: {
      ...config.tokens.colors,
      // 主色调 - 紫色系
      primary0: '#F3E8FF',
      primary50: '#E9D5FF',
      primary100: '#D8B4FE',
      primary200: '#C084FC',
      primary300: '#A855F7',
      primary400: '#9333EA',
      primary500: '#7C3AED', // 主紫色
      primary600: '#6D28D9',
      primary700: '#5B21B6',
      primary800: '#4C1D95',
      primary900: '#3C1563',
      primary950: '#1E0A33',

      // 辅助色调 - 青色系
      secondary0: '#E6FFFA',
      secondary50: '#B2F5EA',
      secondary100: '#81E6D9',
      secondary200: '#4FD1C7',
      secondary300: '#38B2AC',
      secondary400: '#319795',
      secondary500: '#2C7A7B', // 主青色
      secondary600: '#285E61',
      secondary700: '#234E52',
      secondary800: '#1D4044',
      secondary900: '#183238',

      // 功能色彩 - 明亮调色板
      success: {
        '0': '#F0FDF4',
        '50': '#DCFCE7',
        '100': '#BBF7D0',
        '200': '#86EFAC',
        '300': '#4ADE80',
        '400': '#22C55E',
        '500': '#16A34A',
        '600': '#15803D',
        '700': '#166534',
        '800': '#14532D',
        '900': '#14532D',
      },

      warning: {
        '0': '#FFFBEB',
        '50': '#FEF3C7',
        '100': '#FDE68A',
        '200': '#FCD34D',
        '300': '#FBBF24',
        '400': '#F59E0B',
        '500': '#D97706',
        '600': '#B45309',
        '700': '#92400E',
        '800': '#78350F',
        '900': '#78350F',
      },

      error: {
        '0': '#FEF2F2',
        '50': '#FECACA',
        '100': '#FCA5A5',
        '200': '#F87171',
        '300': '#EF4444',
        '400': '#DC2626',
        '500': '#B91C1C',
        '600': '#991B1B',
        '700': '#7F1D1D',
        '800': '#7F1D1D',
        '900': '#7F1D1D',
      },

      // 背景和表面颜色 - 明亮主题
      backgroundLight0: '#FFFFFF',
      backgroundLight50: '#FAFAFA',
      backgroundLight100: '#F5F5F5',
      backgroundLight200: '#E5E5E5',
      backgroundLight300: '#D4D4D4',
      backgroundLight400: '#A3A3A3',
      backgroundLight500: '#737373',
      backgroundLight600: '#525252',
      backgroundLight700: '#404040',
      backgroundLight800: '#262626',
      backgroundLight900: '#171717',
      backgroundLight950: '#0A0A0A',

      // 文字颜色
      textLight0: '#FFFFFF',
      textLight50: '#FAFAFA',
      textLight100: '#F4F4F5',
      textLight200: '#E4E4E7',
      textLight300: '#D4D4D8',
      textLight400: '#A1A1AA',
      textLight500: '#71717A',
      textLight600: '#52525B',
      textLight700: '#3F3F46',
      textLight800: '#27272A',
      textLight900: '#18181B',
      textLight950: '#09090B',

      // 边框颜色
      borderLight0: '#FFFFFF',
      borderLight50: '#F9FAFB',
      borderLight100: '#F3F4F6',
      borderLight200: '#E5E7EB',
      borderLight300: '#D1D5DB',
      borderLight400: '#9CA3AF',
      borderLight500: '#6B7280',
      borderLight600: '#4B5563',
      borderLight700: '#374151',
      borderLight800: '#1F2937',
      borderLight900: '#111827',
      borderLight950: '#030712',
    },
  },

  // 全局样式覆盖
  globalStyle: {
    variants: {
      hardShadow: {
        '1': {
          shadowColor: '#7C3AED',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        '2': {
          shadowColor: '#7C3AED',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.30,
          shadowRadius: 4.65,
          elevation: 8,
        },
        '3': {
          shadowColor: '#7C3AED',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,
          elevation: 12,
        },
      },
      softShadow: {
        '1': {
          shadowColor: '#A855F7',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        '2': {
          shadowColor: '#A855F7',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      },
    },
  },
};

export const gluestackUIConfig = {
  ...customConfig,
  tokens: {
    ...config.tokens,
    colors: {
      ...config.tokens.colors,
      // 主色调 - 紫色系
      primary500: '#7C3AED',
      primary600: '#6D28D9',

      // 辅助色调 - 青色系
      secondary500: '#2C7A7B',
      secondary600: '#285E61',

      // 背景色
      backgroundLight0: '#FFFFFF',
      backgroundLight50: '#FAFAFA',

      // 文字色
      textLight900: '#18181B',
      textLight500: '#71717A',
    },
  },
};