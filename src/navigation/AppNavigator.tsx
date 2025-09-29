import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import {
  selectAppInitialized,
  selectHasSeenOnboarding,
  setAppInitialized,
  setHasSeenOnboarding
} from '@/store/slices/uiSlice';
import { Storage } from '@/utils/storage';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const appInitialized = useSelector(selectAppInitialized);
  const hasSeenOnboarding = useSelector(selectHasSeenOnboarding);

  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'app'>('splash');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user has seen onboarding
        const seenOnboarding = Storage.get('hasSeenOnboarding');
        if (seenOnboarding) {
          dispatch(setHasSeenOnboarding(true));
        }

        dispatch(setAppInitialized(true));

        // Determine next screen after splash
        setTimeout(() => {
          if (seenOnboarding) {
            setCurrentScreen('app');
          } else {
            setCurrentScreen('onboarding');
          }
        }, 2500);
      } catch (error) {
        console.error('App initialization error:', error);
        // Fallback to app screen
        setTimeout(() => setCurrentScreen('app'), 2500);
      }
    };

    initializeApp();
  }, [dispatch]);

  const handleOnboardingComplete = () => {
    Storage.set('hasSeenOnboarding', 'true');
    dispatch(setHasSeenOnboarding(true));
    setCurrentScreen('app');
  };

  // Show splash screen
  if (!appInitialized || currentScreen === 'splash') {
    return <SplashScreen onFinish={() => {}} />;
  }

  // Show onboarding if not seen
  if (currentScreen === 'onboarding' && !hasSeenOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show main app
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};