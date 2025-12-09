import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREEN_NAMES } from '@/constants/app';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { UserRegistrationScreen } from '@/screens/auth/UserRegistrationScreen';

// Placeholder screens - will be created later
const ForgotPasswordScreen: React.FC = () => null;

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAMES.LOGIN}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name={SCREEN_NAMES.LOGIN}
        component={LoginScreen}
        options={{ title: '登录' }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.REGISTER}
        component={UserRegistrationScreen}
        options={{ title: '用户注册' }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: '忘记密码' }}
      />
    </Stack.Navigator>
  );
};