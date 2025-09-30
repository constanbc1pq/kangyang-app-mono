import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, YStack } from 'tamagui';
import { Toast, ToastProvider, ToastViewport, useToastState } from '@tamagui/toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/index';
import { AppNavigator } from './src/navigation/AppNavigator';
import { DeviceProvider } from './src/contexts/DeviceContext';
import tamaguiConfig from './src/theme/tamagui.config';

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
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={tamaguiConfig}>
          <ToastProvider swipeDirection="horizontal" duration={2000}>
            <SafeAreaProvider>
              <DeviceProvider>
                <AppNavigator />
                <CurrentToast />
                <ToastViewport top="$8" left={0} right={0} />
              </DeviceProvider>
            </SafeAreaProvider>
          </ToastProvider>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}

