import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES, COLORS } from '@/constants/app';
import { View } from 'tamagui';
import { Heart, Activity, Users, User } from 'lucide-react-native';
import { HealthScreen } from '@/screens/HealthScreen';
import { WellnessScreen } from '@/screens/WellnessScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { PersonalCenterScreen } from '@/screens/PersonalCenterScreen';
import { AIConsultationScreen } from '@/screens/AIConsultationScreen';
import { HealthReportScreen } from '@/screens/HealthReportScreen';
import { DeviceManagementScreen } from '@/screens/DeviceManagementScreen';
import { MedicationReminderScreen } from '@/screens/MedicationReminderScreen';
import { TaskListScreen } from '@/screens/TaskListScreen';
import { TaskDetailScreen } from '@/screens/TaskDetailScreen';
import { TaskFormScreen } from '@/screens/TaskFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab导航器组件 - 包含4个主页面
const TabNavigator: React.FC = () => {
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
        component={HealthScreen}
        options={{ title: '康' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.LIFESTYLE_TAB}
        component={WellnessScreen}
        options={{ title: '养' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.COMMUNITY_TAB}
        component={CommunityScreen}
        options={{ title: '社区' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.PROFILE_TAB}
        component={PersonalCenterScreen}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
};

// 主导航器 - Stack Navigator作为根，Tab作为第一个screen，全屏页面作为其他screens
export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 全部隐藏默认header
      }}
    >
      {/* Tab导航器作为首页 - 显示底部导航栏 */}
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
      />

      {/* 全屏页面 - 不显示底部导航栏 */}
      <Stack.Screen
        name="AIConsultation"
        component={AIConsultationScreen}
      />
      <Stack.Screen
        name="HealthReport"
        component={HealthReportScreen}
      />
      <Stack.Screen
        name="DeviceManagement"
        component={DeviceManagementScreen}
      />
      <Stack.Screen
        name="MedicationReminder"
        component={MedicationReminderScreen}
      />
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
      />
    </Stack.Navigator>
  );
};