/**
 * UserRegistrationScreen 用户注册页
 * 收集用户基本信息：姓氏、名字、年龄、身高、体重
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
} from 'tamagui';
import { ToastViewport, useToastController } from '@tamagui/toast';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, ChevronLeft } from 'lucide-react-native';
import { Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { setCurrentUser } from '@/store/slices/userSlice';
import { createUserData } from '@/services/userDataService';

interface UserRegistrationScreenProps {
  navigation: any;
}

export const UserRegistrationScreen: React.FC<UserRegistrationScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const toast = useToastController();

  const [surname, setSurname] = useState('');
  const [givenName, setGivenName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const primaryColor = theme.primary?.val;
  const accentColor = theme.accent?.val;
  const color10 = theme.color10?.val;

  const gradientColors = [primaryColor, accentColor] as [string, string];

  // 随机姓氏列表
  const SURNAMES = ['张', '王', '李', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
  // 随机名字列表
  const GIVEN_NAMES_MALE = ['伟', '强', '磊', '军', '勇', '杰', '涛', '明', '超', '华', '建', '志', '宏', '鹏', '飞'];
  const GIVEN_NAMES_FEMALE = ['芳', '娜', '敏', '静', '丽', '艳', '秀', '英', '华', '慧', '婷', '雪', '琳', '晶', '倩'];

  // 随机填写用户信息
  const handleRandomFill = () => {
    const randomGender = Math.random() > 0.5 ? 'male' : 'female';
    const randomSurname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const givenNameList = randomGender === 'male' ? GIVEN_NAMES_MALE : GIVEN_NAMES_FEMALE;
    const randomGivenName = givenNameList[Math.floor(Math.random() * givenNameList.length)];
    const randomAge = Math.floor(Math.random() * 50) + 20; // 20-70岁
    const randomHeight = Math.floor(Math.random() * 40) + 150; // 150-190cm
    const randomWeight = Math.floor(Math.random() * 50) + 45; // 45-95kg

    setGender(randomGender);
    setSurname(randomSurname);
    setGivenName(randomGivenName);
    setAge(randomAge.toString());
    setHeight(randomHeight.toString());
    setWeight(randomWeight.toString());

    toast.show('已随机生成信息', { duration: 1500 });
  };

  // 验证表单
  const validateForm = () => {
    if (!surname.trim()) {
      toast.show('请输入姓氏', { duration: 2000 });
      return false;
    }
    if (!givenName.trim()) {
      toast.show('请输入名字', { duration: 2000 });
      return false;
    }
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      toast.show('请输入有效年龄 (1-120)', { duration: 2000 });
      return false;
    }
    const heightNum = parseInt(height);
    if (!height || isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
      toast.show('请输入有效身高 (50-250cm)', { duration: 2000 });
      return false;
    }
    const weightNum = parseInt(weight);
    if (!weight || isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
      toast.show('请输入有效体重 (20-300kg)', { duration: 2000 });
      return false;
    }
    return true;
  };

  // 提交注册
  const handleSubmit = async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const ageNum = parseInt(age);
      const heightNum = parseInt(height);
      const weightNum = parseInt(weight);

      // 使用新的 createUserData 函数创建用户数据
      // 这会根据用户填写的信息生成所有 mock 数据
      const userData = await createUserData({
        surname,
        givenName,
        age: ageNum,
        height: heightNum,
        weight: weightNum,
        gender,
      });

      const fullName = userData.profile.fullName || `${surname}${givenName}`;

      // 登录成功
      dispatch(loginSuccess({
        token: 'user-token-' + Date.now(),
        refreshToken: 'user-refresh-token-' + Date.now(),
      }));

      // 设置当前用户信息
      dispatch(setCurrentUser({
        id: userData.profile.userId,
        email: `${userData.profile.userId}@kangyang.com`,
        name: fullName,
        avatar: undefined,
        phone: userData.profile.phone || '138****8888',
        gender,
        birthDate: userData.profile.birthDate,
        height: heightNum,
        weight: weightNum,
        createdAt: userData.profile.createdAt,
        updatedAt: userData.profile.updatedAt,
      }));

      toast.show(`欢迎您，${fullName}！`, {
        duration: 2000,
        burntOptions: {
          preset: 'done',
          haptic: 'success',
        },
      });
    } catch (error) {
      console.error('注册失败:', error);
      toast.show('注册失败，请重试', { duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
            >
              <View flex={1} justifyContent="center" alignItems="center" padding="$2.5">
                {/* 返回按钮 */}
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={{ position: 'absolute', top: 16, left: 16 }}
                >
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="rgba(255,255,255,0.2)"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ChevronLeft size={24} color="white" />
                  </View>
                </Pressable>

                {/* 注册卡片 */}
                <View
                  width="100%"
                  maxWidth={400}
                  backgroundColor="$color2"
                  borderRadius="$5"
                  padding="$2.5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <YStack gap="$2">
                    {/* Logo区域 */}
                    <YStack gap="$1.5" alignItems="center" marginBottom="$2">
                      <View
                        width={64}
                        height={64}
                        backgroundColor={`${primaryColor}15`}
                        borderRadius="$12"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <User size={32} color={primaryColor} />
                      </View>
                      <Text fontSize="$5" fontWeight="700" color="$primary" textAlign="center">
                        完善个人信息
                      </Text>
                      <Text fontSize="$2" color="$color10" textAlign="center">
                        为您提供更精准的健康服务
                      </Text>
                    </YStack>

                    {/* 姓名输入 */}
                    <XStack gap="$2">
                      <YStack flex={1} gap="$1">
                        <Text fontSize="$2" color="$color10" fontWeight="500">姓氏</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="张"
                          placeholderTextColor={color10}
                          value={surname}
                          onChangeText={setSurname}
                          maxLength={2}
                        />
                      </YStack>
                      <YStack flex={2} gap="$1">
                        <Text fontSize="$2" color="$color10" fontWeight="500">名字</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="健康"
                          placeholderTextColor={color10}
                          value={givenName}
                          onChangeText={setGivenName}
                          maxLength={4}
                        />
                      </YStack>
                    </XStack>

                    {/* 性别选择 */}
                    <YStack gap="$1">
                      <Text fontSize="$2" color="$color10" fontWeight="500">性别</Text>
                      <XStack gap="$2">
                        <Pressable style={{ flex: 1 }} onPress={() => setGender('male')}>
                          <View
                            backgroundColor={gender === 'male' ? `${primaryColor}15` : '$color4'}
                            borderWidth={2}
                            borderColor={gender === 'male' ? primaryColor : '$color5'}
                            borderRadius="$4"
                            paddingVertical="$2"
                            alignItems="center"
                          >
                            <Text fontSize={20} marginBottom="$1">👨</Text>
                            <Text
                              fontSize="$3"
                              fontWeight={gender === 'male' ? '600' : '400'}
                              color={gender === 'male' ? '$primary' : '$color10'}
                            >
                              男
                            </Text>
                          </View>
                        </Pressable>
                        <Pressable style={{ flex: 1 }} onPress={() => setGender('female')}>
                          <View
                            backgroundColor={gender === 'female' ? `${primaryColor}15` : '$color4'}
                            borderWidth={2}
                            borderColor={gender === 'female' ? primaryColor : '$color5'}
                            borderRadius="$4"
                            paddingVertical="$2"
                            alignItems="center"
                          >
                            <Text fontSize={20} marginBottom="$1">👩</Text>
                            <Text
                              fontSize="$3"
                              fontWeight={gender === 'female' ? '600' : '400'}
                              color={gender === 'female' ? '$primary' : '$color10'}
                            >
                              女
                            </Text>
                          </View>
                        </Pressable>
                      </XStack>
                    </YStack>

                    {/* 年龄输入 */}
                    <YStack gap="$1">
                      <Text fontSize="$2" color="$color10" fontWeight="500">年龄</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="45"
                        placeholderTextColor={color10}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="number-pad"
                        maxLength={3}
                      />
                    </YStack>

                    {/* 身高体重 */}
                    <XStack gap="$2">
                      <YStack flex={1} gap="$1">
                        <Text fontSize="$2" color="$color10" fontWeight="500">身高 (cm)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="170"
                          placeholderTextColor={color10}
                          value={height}
                          onChangeText={setHeight}
                          keyboardType="number-pad"
                          maxLength={3}
                        />
                      </YStack>
                      <YStack flex={1} gap="$1">
                        <Text fontSize="$2" color="$color10" fontWeight="500">体重 (kg)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="65"
                          placeholderTextColor={color10}
                          value={weight}
                          onChangeText={setWeight}
                          keyboardType="number-pad"
                          maxLength={3}
                        />
                      </YStack>
                    </XStack>

                    {/* 按钮区域：随机按钮(1/4) + 开始体验按钮(3/4) */}
                    <XStack gap="$2" marginTop={8}>
                      {/* 随机按钮 */}
                      <Pressable
                        onPress={handleRandomFill}
                        disabled={isLoading}
                        style={({ pressed }) => ({
                          flex: 1,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                          opacity: isLoading ? 0.7 : 1,
                        })}
                      >
                        <View
                          backgroundColor="$color4"
                          borderRadius="$10"
                          paddingVertical="$3"
                          alignItems="center"
                          borderWidth={1}
                          borderColor="$color5"
                        >
                          <Text fontSize="$4" fontWeight="500" color="$primary">模拟</Text>
                        </View>
                      </Pressable>

                      {/* 开始体验按钮 */}
                      <Pressable
                        onPress={handleSubmit}
                        disabled={isLoading}
                        style={({ pressed }) => ({
                          flex: 3,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                          opacity: isLoading ? 0.7 : 1,
                        })}
                      >
                        <View
                          backgroundColor="$primary"
                          borderRadius="$10"
                          paddingVertical="$3"
                          alignItems="center"
                        >
                          <Text fontSize="$5" fontWeight="600" color="white">
                            {isLoading ? '正在创建...' : '开始体验'}
                          </Text>
                        </View>
                      </Pressable>
                    </XStack>

                    <Text fontSize="$2" color="$color10" textAlign="center" marginTop="$1">
                      您的信息仅存储在本地设备
                    </Text>
                  </YStack>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
        <ToastViewport />
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E6EC',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FAFCFF',
    color: '#1F2937',
  },
});
