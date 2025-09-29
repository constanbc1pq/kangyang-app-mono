import React, { useState, createContext, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_NAMES, COLORS } from '@/constants/app';
import { YStack, Text, Theme, View } from 'tamagui';
import { Heart, Activity, Users, User } from 'lucide-react-native';
import { HealthScreen } from '@/screens/HealthScreen';
import { WellnessScreen } from '@/screens/WellnessScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { PersonalCenterScreen } from '@/screens/PersonalCenterScreen';
import { AIConsultationScreen } from '@/screens/AIConsultationScreen';
import { HealthReportScreen } from '@/screens/HealthReportScreen';

const Tab = createBottomTabNavigator();

// 全屏页面导航上下文
interface FullScreenNavigationContextType {
  showAIConsultation: boolean;
  setShowAIConsultation: (show: boolean) => void;
  showHealthReport: boolean;
  setShowHealthReport: (show: boolean) => void;
}

const FullScreenNavigationContext = createContext<FullScreenNavigationContextType | null>(null);

export const useFullScreenNavigation = () => {
  const context = useContext(FullScreenNavigationContext);
  if (!context) {
    throw new Error('useFullScreenNavigation must be used within FullScreenNavigationProvider');
  }
  return context;
};

// Tab导航器组件
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

// 主导航器 - 管理全屏页面
export const MainNavigator: React.FC = () => {
  const [showAIConsultation, setShowAIConsultation] = useState(false);
  const [showHealthReport, setShowHealthReport] = useState(false);

  const contextValue: FullScreenNavigationContextType = {
    showAIConsultation,
    setShowAIConsultation,
    showHealthReport,
    setShowHealthReport,
  };

  // 如果显示AI咨询页面，隐藏底部导航栏
  if (showAIConsultation) {
    return (
      <FullScreenNavigationContext.Provider value={contextValue}>
        <AIConsultationScreen onBack={() => setShowAIConsultation(false)} />
      </FullScreenNavigationContext.Provider>
    );
  }

  // 如果显示健康报告页面，隐藏底部导航栏
  if (showHealthReport) {
    return (
      <FullScreenNavigationContext.Provider value={contextValue}>
        <HealthReportScreen onBack={() => setShowHealthReport(false)} />
      </FullScreenNavigationContext.Provider>
    );
  }

  // 默认显示Tab导航器
  return (
    <FullScreenNavigationContext.Provider value={contextValue}>
      <TabNavigator />
    </FullScreenNavigationContext.Provider>
  );
};