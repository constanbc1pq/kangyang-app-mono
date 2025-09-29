import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREEN_NAMES } from '@/constants/app';

// Placeholder screens - will be created later
const LoginScreen: React.FC = () => null;
const RegisterScreen: React.FC = () => null;
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
        component={RegisterScreen}
        options={{ title: '注册' }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: '忘记密码' }}
      />
    </Stack.Navigator>
  );
};