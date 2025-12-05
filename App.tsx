import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme, YStack } from 'tamagui';
import { Toast, ToastProvider, ToastViewport, useToastState } from '@tamagui/toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/index';
import { AppNavigator } from './src/navigation/AppNavigator';
import { DeviceProvider } from './src/contexts/DeviceContext';
import tamaguiConfig from './src/theme/tamagui.config';
import { neutralThemes } from './src/theme/neutralTheme';

/**
 * 主题配置 - 修改这里切换主题
 *
 * 可用主题:
 * - 'light'         : AzurePop 浅色 (默认)
 * - 'dark'          : AzurePop 深色
 * - 'neutral_light' : Neutral 浅色 (灰紫主题)
 * - 'neutral_dark'  : Neutral 深色 (灰紫主题)
 */
const CURRENT_THEME = 'neutral_light'; // <-- 修改这里切换主题

/**
 * Web 端强制覆盖 prefers-color-scheme 媒体查询的影响
 * 确保主题颜色完全由 CURRENT_THEME 控制
 */
const useForceThemeOnWeb = () => {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // 获取当前主题的颜色值
      const themeColors = CURRENT_THEME.includes('neutral')
        ? neutralThemes.light // neutral_light 使用 neutralThemes.light
        : tamaguiConfig.themes.light;

      // 创建 CSS 覆盖媒体查询 - 覆盖所有主题色包括语义色
      const style = document.createElement('style');
      style.id = 'theme-override';
      style.textContent = `
        @media (prefers-color-scheme: dark) {
          :root {
            --color1: ${themeColors.color1} !important;
            --color2: ${themeColors.color2} !important;
            --color3: ${themeColors.color3} !important;
            --color4: ${themeColors.color4} !important;
            --color5: ${themeColors.color5} !important;
            --color6: ${themeColors.color6} !important;
            --color7: ${themeColors.color7} !important;
            --color8: ${themeColors.color8} !important;
            --color9: ${themeColors.color9} !important;
            --color10: ${themeColors.color10} !important;
            --color11: ${themeColors.color11} !important;
            --color12: ${themeColors.color12} !important;
            --background: ${themeColors.background} !important;
            --borderColor: ${themeColors.borderColor} !important;
            --primary: ${themeColors.primary} !important;
            --primaryHover: ${themeColors.primaryHover} !important;
            --primaryPress: ${themeColors.primaryPress} !important;
            --primaryLight: ${themeColors.primaryLight} !important;
            --secondary: ${themeColors.secondary} !important;
            --accent: ${themeColors.accent} !important;
            --success: ${themeColors.success} !important;
            --warning: ${themeColors.warning} !important;
            --error: ${themeColors.error} !important;
            --gold: ${themeColors.gold} !important;
            --text: ${themeColors.text} !important;
            --textSecondary: ${themeColors.textSecondary} !important;
            --surface: ${themeColors.surface} !important;
          }
        }
      `;

      // 移除旧的覆盖样式（如果存在）
      const existingStyle = document.getElementById('theme-override');
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);

      return () => {
        style.remove();
      };
    }
  }, []);
};

const CurrentToast = () => {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) {
    return null;
  }

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
      viewportName={currentToast.viewportName}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
};

export default function App() {
  // Web 端强制覆盖系统暗色模式对主题的影响
  useForceThemeOnWeb();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider
          config={tamaguiConfig}
          defaultTheme={CURRENT_THEME}
          disableRootThemeClass
        >
          <Theme name={CURRENT_THEME}>
            <ToastProvider swipeDirection="horizontal" duration={2000}>
              <SafeAreaProvider>
                <DeviceProvider>
                  <AppNavigator />
                  <CurrentToast />
                  <ToastViewport top="$8" left={0} right={0} />
                </DeviceProvider>
              </SafeAreaProvider>
            </ToastProvider>
          </Theme>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}

