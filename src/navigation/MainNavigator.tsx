import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_NAMES, COLORS } from '@/constants/app';
import { YStack, Text, Theme, View } from 'tamagui';
import { Heart, Activity, Users, User } from 'lucide-react-native';

// Placeholder screens - will be created later
const HealthDashboard: React.FC = () => (
  <Theme name="light">
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background" padding="$4">
      <Text fontSize="$6" color="$primary" fontWeight="bold">康模块 - 健康监测</Text>
    </YStack>
  </Theme>
);

const LifestyleDashboard: React.FC = () => (
  <Theme name="light">
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background" padding="$4">
      <Text fontSize="$6" color="$secondary" fontWeight="bold">养模块 - 生活方式</Text>
    </YStack>
  </Theme>
);

const CommunityFeed: React.FC = () => (
  <Theme name="light">
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background" padding="$4">
      <Text fontSize="$6" color="$primary" fontWeight="bold">社区 - 健康分享</Text>
    </YStack>
  </Theme>
);

const PersonalInfo: React.FC = () => (
  <Theme name="light">
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background" padding="$4">
      <Text fontSize="$6" color="$primary" fontWeight="bold">我的 - 个人中心</Text>
    </YStack>
  </Theme>
);

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName={SCREEN_NAMES.HEALTH_TAB}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let IconComponent = Heart;

          if (route.name === SCREEN_NAMES.HEALTH_TAB) {
            IconComponent = Heart;
          } else if (route.name === SCREEN_NAMES.LIFESTYLE_TAB) {
            IconComponent = Activity;
          } else if (route.name === SCREEN_NAMES.COMMUNITY_TAB) {
            IconComponent = Users;
          } else if (route.name === SCREEN_NAMES.PROFILE_TAB) {
            IconComponent = User;
          }

          return (
            <View>
              <IconComponent
                size={size}
                color={focused ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.background,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: COLORS.primary,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
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