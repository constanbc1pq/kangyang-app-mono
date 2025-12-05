/**
 * Neutral Theme - 中性灰紫主题
 *
 * 使用 Tamagui Theme Builder 生成
 * 基础色: 中性灰
 * 强调色: 暗紫色 (hue 256)
 *
 * 色阶说明：
 * - color1-4: 背景色（浅）
 * - color5-8: 中间色（边框、分隔线）
 * - color9-10: 辅助文字
 * - color11-12: 主要文字（深）
 */

import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder';
import * as Colors from '@tamagui/colors';

// 暗色调色板 (用于 dark 主题)
const darkPalette = [
  'hsla(0, 15%, 1%, 1)',    // 1: 最深背景
  'hsla(0, 14%, 6%, 1)',    // 2: 次深背景
  'hsla(0, 13%, 12%, 1)',   // 3: 卡片背景
  'hsla(0, 12%, 17%, 1)',   // 4: 表面背景
  'hsla(0, 11%, 23%, 1)',   // 5: 边框暗
  'hsla(0, 11%, 28%, 1)',   // 6: 边框
  'hsla(0, 10%, 34%, 1)',   // 7: 边框亮
  'hsla(0, 9%, 39%, 1)',    // 8: 禁用文字
  'hsla(0, 8%, 45%, 1)',    // 9: 占位符
  'hsla(0, 7%, 50%, 1)',    // 10: 辅助文字
  'hsla(0, 15%, 93%, 1)',   // 11: 主要文字
  'hsla(0, 15%, 99%, 1)',   // 12: 最亮文字
];

// 亮色调色板 (用于 light 主题)
const lightPalette = [
  'hsla(0, 15%, 99%, 1)',   // 1: 最浅背景
  'hsla(0, 14%, 97%, 1)',   // 2: 次浅背景
  'hsla(0, 13%, 94%, 1)',   // 3: 卡片背景
  'hsla(0, 12%, 90%, 1)',   // 4: 表面/hover背景
  'hsla(0, 11%, 85%, 1)',   // 5: 边框浅
  'hsla(0, 11%, 80%, 1)',   // 6: 边框
  'hsla(0, 10%, 72%, 1)',   // 7: 边框深
  'hsla(0, 9%, 61%, 1)',    // 8: 禁用文字
  'hsla(0, 8%, 50%, 1)',    // 9: 占位符
  'hsla(0, 7%, 40%, 1)',    // 10: 辅助文字
  'hsla(0, 15%, 20%, 1)',   // 11: 次要文字
  'hsla(0, 15%, 5%, 1)',    // 12: 最深文字
];

// 强调色（紫色）调色板
const accentPaletteDark = [
  'hsla(256, 30%, 20%, 1)', // 1
  'hsla(256, 30%, 25%, 1)', // 2
  'hsla(256, 30%, 30%, 1)', // 3
  'hsla(256, 30%, 35%, 1)', // 4
  'hsla(256, 30%, 40%, 1)', // 5
  'hsla(256, 30%, 45%, 1)', // 6
  'hsla(256, 35%, 50%, 1)', // 7
  'hsla(256, 40%, 55%, 1)', // 8
  'hsla(256, 45%, 60%, 1)', // 9: 主强调色
  'hsla(256, 50%, 65%, 1)', // 10
  'hsla(256, 60%, 85%, 1)', // 11
  'hsla(256, 70%, 95%, 1)', // 12
];

const accentPaletteLight = [
  'hsla(256, 70%, 97%, 1)', // 1: 最浅背景
  'hsla(256, 60%, 94%, 1)', // 2
  'hsla(256, 50%, 90%, 1)', // 3
  'hsla(256, 45%, 85%, 1)', // 4
  'hsla(256, 40%, 78%, 1)', // 5
  'hsla(256, 38%, 70%, 1)', // 6
  'hsla(256, 35%, 62%, 1)', // 7
  'hsla(256, 32%, 55%, 1)', // 8
  'hsla(256, 30%, 48%, 1)', // 9: 主强调色
  'hsla(256, 28%, 42%, 1)', // 10
  'hsla(256, 25%, 30%, 1)', // 11
  'hsla(256, 22%, 20%, 1)', // 12
];

// 阴影配置 - 更大更柔和的阴影（官方风格）
const lightShadows = {
  shadow1: 'rgba(0,0,0,0.03)',
  shadow2: 'rgba(0,0,0,0.06)',
  shadow3: 'rgba(0,0,0,0.12)',
  shadow4: 'rgba(0,0,0,0.18)',
  shadow5: 'rgba(0,0,0,0.24)',
  shadow6: 'rgba(0,0,0,0.32)',
};

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.15)',
  shadow2: 'rgba(0,0,0,0.25)',
  shadow3: 'rgba(0,0,0,0.35)',
  shadow4: 'rgba(0,0,0,0.45)',
  shadow5: 'rgba(0,0,0,0.55)',
  shadow6: 'rgba(0,0,0,0.65)',
};

// 灰红色调色板 - 仅用于严重警告（低饱和度）
const mutedRedLight = {
  red1: 'hsla(0, 25%, 97%, 1)',
  red2: 'hsla(0, 25%, 94%, 1)',
  red3: 'hsla(0, 25%, 90%, 1)',
  red4: 'hsla(0, 28%, 85%, 1)',
  red5: 'hsla(0, 30%, 78%, 1)',
  red6: 'hsla(0, 32%, 70%, 1)',
  red7: 'hsla(0, 33%, 62%, 1)',
  red8: 'hsla(0, 34%, 55%, 1)',
  red9: 'hsla(0, 35%, 50%, 1)',  // 主灰红色
  red10: 'hsla(0, 33%, 45%, 1)',
  red11: 'hsla(0, 30%, 38%, 1)',
  red12: 'hsla(0, 28%, 25%, 1)',
};

const mutedRedDark = {
  red1: 'hsla(0, 25%, 12%, 1)',
  red2: 'hsla(0, 25%, 15%, 1)',
  red3: 'hsla(0, 25%, 20%, 1)',
  red4: 'hsla(0, 28%, 25%, 1)',
  red5: 'hsla(0, 30%, 32%, 1)',
  red6: 'hsla(0, 32%, 40%, 1)',
  red7: 'hsla(0, 33%, 48%, 1)',
  red8: 'hsla(0, 34%, 55%, 1)',
  red9: 'hsla(0, 35%, 60%, 1)',  // 主灰红色
  red10: 'hsla(0, 33%, 70%, 1)',
  red11: 'hsla(0, 30%, 85%, 1)',
  red12: 'hsla(0, 28%, 93%, 1)',
};

// 创建基础主题
const baseThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...mutedRedLight,
        ...lightShadows,
        shadowColor: 'rgba(0,0,0,0.08)',
      },
      dark: {
        ...mutedRedDark,
        ...darkShadows,
        shadowColor: 'rgba(0,0,0,0.25)',
      },
    },
  },

  accent: {
    palette: {
      dark: accentPaletteDark,
      light: accentPaletteLight,
    },
  },

  // 移除高饱和度子主题，改用单色系
  childrenThemes: {},
});

/**
 * 添加语义化颜色别名
 * 将 color1-12 色阶映射到语义化名称
 * 确保子主题继承父主题的 color1-12 色阶
 */
function addSemanticColors(themes: typeof baseThemes): typeof baseThemes {
  const result = { ...themes };

  // 首先处理基础主题，收集 color1-12
  const baseThemeColors: Record<string, Record<string, string>> = {};

  Object.keys(result).forEach((themeName) => {
    // 只处理基础主题 (light, dark)，不含下划线
    if (!themeName.includes('_') && (themeName === 'light' || themeName === 'dark')) {
      const theme = result[themeName as keyof typeof result] as Record<string, string>;
      if (theme) {
        baseThemeColors[themeName] = {};
        for (let i = 1; i <= 12; i++) {
          const key = `color${i}`;
          if (theme[key]) {
            baseThemeColors[themeName][key] = theme[key];
          }
        }
      }
    }
  });

  Object.keys(result).forEach((themeName) => {
    const theme = result[themeName as keyof typeof result];
    if (!theme || typeof theme !== 'object') return;

    const isLight = themeName.includes('light');
    const isAccent = themeName.includes('accent');

    // 获取基础颜色
    const themeObj = theme as Record<string, string>;

    // 如果是子主题，继承父主题的 color1-12
    if (themeName.includes('_')) {
      const parentThemeName = isLight ? 'light' : 'dark';
      const parentColors = baseThemeColors[parentThemeName];
      if (parentColors) {
        Object.assign(themeObj, parentColors);
      }
    }

    // 语义化颜色映射 - 单色系方案
    // 使用 灰色(color) + 紫色(accent) 混合，仅保留灰红用于严重警告
    const semanticColors: Record<string, string> = {
      // 主色调 - 使用 accent9 作为主色
      primary: themeObj.accent9 || (isLight ? 'hsla(256, 30%, 48%, 1)' : 'hsla(256, 45%, 60%, 1)'),
      primaryHover: themeObj.accent8 || (isLight ? 'hsla(256, 32%, 55%, 1)' : 'hsla(256, 40%, 55%, 1)'),
      primaryPress: themeObj.accent10 || (isLight ? 'hsla(256, 28%, 42%, 1)' : 'hsla(256, 50%, 65%, 1)'),
      primaryLight: themeObj.accent3 || (isLight ? 'hsla(256, 50%, 90%, 1)' : 'hsla(256, 30%, 30%, 1)'),

      // 次要色 - 使用 accent7 (中紫)
      secondary: themeObj.accent7 || (isLight ? 'hsla(256, 35%, 62%, 1)' : 'hsla(256, 35%, 50%, 1)'),
      secondaryHover: themeObj.accent6 || (isLight ? 'hsla(256, 38%, 70%, 1)' : 'hsla(256, 30%, 45%, 1)'),
      secondaryLight: themeObj.accent2 || (isLight ? 'hsla(256, 60%, 94%, 1)' : 'hsla(256, 30%, 25%, 1)'),

      // 强调色 - 使用 accent
      accent: themeObj.accent9 || (isLight ? 'hsla(256, 30%, 48%, 1)' : 'hsla(256, 45%, 60%, 1)'),

      // 功能色 - 单色系方案（紫色+灰色混合）
      // 成功/完成 - 深紫 (accent10) 表示完成感
      success: themeObj.accent10 || (isLight ? 'hsla(256, 28%, 42%, 1)' : 'hsla(256, 50%, 65%, 1)'),
      successLight: themeObj.accent2 || (isLight ? 'hsla(256, 60%, 94%, 1)' : 'hsla(256, 30%, 25%, 1)'),

      // 信息/趋势 - 主紫 (accent9)
      info: themeObj.accent9 || (isLight ? 'hsla(256, 30%, 48%, 1)' : 'hsla(256, 45%, 60%, 1)'),
      infoLight: themeObj.accent3 || (isLight ? 'hsla(256, 50%, 90%, 1)' : 'hsla(256, 30%, 30%, 1)'),

      // 提示/建议 - 中灰 (color9) 中性提示
      warning: themeObj.color9 || (isLight ? 'hsla(0, 8%, 50%, 1)' : 'hsla(0, 8%, 45%, 1)'),
      warningLight: themeObj.color3 || (isLight ? 'hsla(0, 13%, 94%, 1)' : 'hsla(0, 13%, 12%, 1)'),

      // 严重错误 - 灰红 (仅用于特殊警告)
      error: themeObj.red9 || (isLight ? 'hsla(0, 35%, 50%, 1)' : 'hsla(0, 35%, 60%, 1)'),
      errorLight: themeObj.red3 || (isLight ? 'hsla(0, 25%, 90%, 1)' : 'hsla(0, 25%, 20%, 1)'),

      // 金色 - VIP/专属服务/高端标识
      gold: '#D4AF37',
      goldLight: isLight ? '#F5E6B8' : '#8B7322',

      // 背景色层次
      background: themeObj.color1 || (isLight ? 'hsla(0, 15%, 99%, 1)' : 'hsla(0, 15%, 1%, 1)'),
      surface: themeObj.color2 || (isLight ? 'hsla(0, 14%, 97%, 1)' : 'hsla(0, 14%, 6%, 1)'),
      surfaceHover: themeObj.color3 || (isLight ? 'hsla(0, 13%, 94%, 1)' : 'hsla(0, 13%, 12%, 1)'),
      cardBg: themeObj.color2 || (isLight ? 'hsla(0, 14%, 97%, 1)' : 'hsla(0, 14%, 6%, 1)'),

      // 文字颜色层次
      text: themeObj.color12 || (isLight ? 'hsla(0, 15%, 5%, 1)' : 'hsla(0, 15%, 99%, 1)'),
      textSecondary: themeObj.color10 || (isLight ? 'hsla(0, 7%, 40%, 1)' : 'hsla(0, 7%, 50%, 1)'),
      textTertiary: themeObj.color9 || (isLight ? 'hsla(0, 8%, 50%, 1)' : 'hsla(0, 8%, 45%, 1)'),
      textMuted: themeObj.color8 || (isLight ? 'hsla(0, 9%, 61%, 1)' : 'hsla(0, 9%, 39%, 1)'),

      // 边框颜色
      borderColor: themeObj.color6 || (isLight ? 'hsla(0, 11%, 80%, 1)' : 'hsla(0, 11%, 28%, 1)'),
      borderColorLight: themeObj.color5 || (isLight ? 'hsla(0, 11%, 85%, 1)' : 'hsla(0, 11%, 23%, 1)'),
      borderColorDark: themeObj.color7 || (isLight ? 'hsla(0, 10%, 72%, 1)' : 'hsla(0, 10%, 34%, 1)'),

      // 阴影
      shadow: themeObj.shadowColor || (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.25)'),

      // 渐变色
      gradientStart: themeObj.accent9 || (isLight ? 'hsla(256, 30%, 48%, 1)' : 'hsla(256, 45%, 60%, 1)'),
      gradientEnd: themeObj.accent7 || (isLight ? 'hsla(256, 35%, 62%, 1)' : 'hsla(256, 35%, 50%, 1)'),
    };

    // 合并语义化颜色到主题
    Object.assign(themeObj, semanticColors);
  });

  return result;
}

// 导出最终主题
export const neutralThemes = addSemanticColors(baseThemes);

export type NeutralThemes = typeof neutralThemes;
