import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Heart, Activity, Users, User } from 'lucide-react-native';

// 简单的卡片组件
const Card = ({ children, style = {} }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

// 简单的按钮组件
const Button = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity
    style={[styles.button, styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// 屏幕组件
const HealthScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>康 - 健康监测</Text>
    <Card style={styles.cardMargin}>
      <Text style={styles.cardTitle}>今日健康数据</Text>
      <Text style={styles.cardText}>心率: 72 bpm</Text>
      <Text style={styles.cardText}>步数: 8,543 步</Text>
      <Text style={styles.cardText}>睡眠: 7.5 小时</Text>
    </Card>
    <Button title="查看详细报告" onPress={() => {}} />
  </View>
);

const LifestyleScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>养 - 生活方式</Text>
    <Card style={styles.cardMargin}>
      <Text style={styles.cardTitle}>今日建议</Text>
      <Text style={styles.cardText}>• 多喝水，目标2L</Text>
      <Text style={styles.cardText}>• 适量运动30分钟</Text>
      <Text style={styles.cardText}>• 保持充足睡眠</Text>
    </Card>
    <Button title="设置健康目标" variant="secondary" onPress={() => {}} />
  </View>
);

const CommunityScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>社区 - 健康分享</Text>
    <Card style={styles.cardMargin}>
      <Text style={styles.cardTitle}>热门话题</Text>
      <Text style={styles.cardText}>• 如何保持健康作息</Text>
      <Text style={styles.cardText}>• 营养搭配小技巧</Text>
      <Text style={styles.cardText}>• 运动打卡挑战</Text>
    </Card>
    <Button title="发布动态" onPress={() => {}} />
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>我的 - 个人中心</Text>
    <Card style={styles.cardMargin}>
      <Text style={styles.cardTitle}>个人信息</Text>
      <Text style={styles.cardText}>用户名: 康养用户</Text>
      <Text style={styles.cardText}>年龄: 28岁</Text>
      <Text style={styles.cardText}>健康评分: 85分</Text>
    </Card>
    <Button title="编辑资料" variant="secondary" onPress={() => {}} />
  </View>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, size }) => {
                let IconComponent = Heart;

                if (route.name === 'Health') IconComponent = Heart;
                else if (route.name === 'Lifestyle') IconComponent = Activity;
                else if (route.name === 'Community') IconComponent = Users;
                else if (route.name === 'Profile') IconComponent = User;

                return (
                  <IconComponent
                    size={size}
                    color={focused ? '#7C3AED' : '#9CA3AF'}
                  />
                );
              },
              tabBarActiveTintColor: '#7C3AED',
              tabBarInactiveTintColor: '#9CA3AF',
              tabBarStyle: styles.tabBar,
              headerShown: false,
            })}
          >
            <Tab.Screen name="Health" component={HealthScreen} options={{ title: '康' }} />
            <Tab.Screen name="Lifestyle" component={LifestyleScreen} options={{ title: '养' }} />
            <Tab.Screen name="Community" component={CommunityScreen} options={{ title: '社区' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
          </Tab.Navigator>
          <StatusBar style="dark" />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  cardMargin: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 24,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#7C3AED',
  },
  buttonSecondary: {
    backgroundColor: '#2C7A7B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
