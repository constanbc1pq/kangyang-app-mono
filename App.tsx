import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/components/common/LoadingScreen';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <PaperProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </PaperProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
