import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/index';
import { AppNavigator } from './src/navigation/AppNavigator';
import tamaguiConfig from './src/theme/tamagui.config';


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={tamaguiConfig}>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}

