import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_NAMES, COLORS } from '@/constants/app';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Placeholder screens - will be created later
const HealthDashboard: React.FC = () => null;
const LifestyleDashboard: React.FC = () => null;
const CommunityFeed: React.FC = () => null;
const PersonalInfo: React.FC = () => null;

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName={SCREEN_NAMES.HEALTH_TAB}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === SCREEN_NAMES.HEALTH_TAB) {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === SCREEN_NAMES.LIFESTYLE_TAB) {
            iconName = focused ? 'run' : 'run-fast';
          } else if (route.name === SCREEN_NAMES.COMMUNITY_TAB) {
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === SCREEN_NAMES.PROFILE_TAB) {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.background,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={SCREEN_NAMES.HEALTH_TAB}
        component={HealthDashboard}
        options={{ title: '康' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.LIFESTYLE_TAB}
        component={LifestyleDashboard}
        options={{ title: '养' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.COMMUNITY_TAB}
        component={CommunityFeed}
        options={{ title: '社区' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.PROFILE_TAB}
        component={PersonalInfo}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
};