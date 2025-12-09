/**
 * ProfileEditScreen - 个人信息编辑页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useToastController } from '@tamagui/toast';

import { getUserData, saveUserData } from '@/services/userDataService';
import { UserData } from '@/types/userData';

const ProfileEditScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const toast = useToastController();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // 表单状态
  const [surname, setSurname] = useState('');
  const [givenName, setGivenName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;

  // 加载用户数据
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);

      // 填充表单
      const profile = data.profile;
      if (profile.fullName) {
        // 尝试分离姓氏和名字
        const surnameVal = profile.surname || profile.fullName.charAt(0);
        const givenNameVal = profile.fullName.slice(surnameVal.length);
        setSurname(surnameVal);
        setGivenName(givenNameVal);
      }
      if (profile.age) setAge(profile.age.toString());
      if (profile.height) setHeight(profile.height.toString());
      if (profile.weight) setWeight(profile.weight.toString());
      if (profile.gender && (profile.gender === 'male' || profile.gender === 'female')) {
        setGender(profile.gender);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast.show('加载数据失败', { duration: 2000 });
    }
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

  // 保存修改
  const handleSave = async () => {
    if (!validateForm() || isLoading || !userData) return;

    setIsLoading(true);

    try {
      const ageNum = parseInt(age);
      const heightNum = parseInt(height);
      const weightNum = parseInt(weight);
      const fullName = surname + givenName;

      // 根据年龄计算出生日期
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - ageNum;
      const birthDate = `${birthYear}-01-01`;

      // 更新用户档案
      userData.profile = {
        ...userData.profile,
        surname,
        fullName,
        age: ageNum,
        height: heightNum,
        weight: weightNum,
        gender,
        birthDate,
        updatedAt: new Date().toISOString(),
      };

      // 同步更新家庭成员中的本人信息
      const selfMember = userData.familyMembers.find(m => m.id === 'self' || m.relationship === '本人');
      if (selfMember) {
        selfMember.name = fullName;
        selfMember.gender = gender;
        selfMember.birthDate = birthDate;
        selfMember.avatar = gender === 'male' ? '👨' : '👩';
        if (selfMember.healthProfile) {
          selfMember.healthProfile.age = ageNum;
          selfMember.healthProfile.height = heightNum;
          selfMember.healthProfile.weight = weightNum;
        }
        selfMember.updatedAt = new Date().toISOString();
      }

      // 保存数据
      await saveUserData(userData);

      toast.show('保存成功', {
        duration: 2000,
        burntOptions: {
          preset: 'done',
          haptic: 'success',
        },
      });

      // 返回上一页
      navigation.goBack();
    } catch (error) {
      console.error('保存失败:', error);
      toast.show('保存失败，请重试', { duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* 顶部导航栏 */}
        <XStack
          paddingHorizontal="$2.5"
          paddingVertical="$2"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$color5"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <ChevronLeft size={20} color={theme.color12?.val} />
            </View>
          </Pressable>
          <Text flex={1} fontSize="$5" fontWeight="600" color="$color12" textAlign="center">
            编辑个人信息
          </Text>
          <View width={36} />
        </XStack>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <YStack flex={1} padding="$2.5" gap="$2">
            {/* 头像区域 */}
            <YStack alignItems="center" marginVertical="$2">
              <View
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={40}>{gender === 'male' ? '👨' : '👩'}</Text>
              </View>
              <Text fontSize="$3" color="$color10" marginTop="$2">
                点击下方性别可切换头像
              </Text>
            </YStack>

            {/* 表单 */}
            <View
              backgroundColor="$color2"
              borderRadius="$5"
              padding="$2"
              borderWidth={1}
              borderColor="$color5"
            >
              <YStack gap="$2">
                {/* 姓名输入 */}
                <XStack gap="$2">
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$3" color="$color10" fontWeight="500">姓氏</Text>
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
                    <Text fontSize="$3" color="$color10" fontWeight="500">名字</Text>
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
                  <Text fontSize="$3" color="$color10" fontWeight="500">性别</Text>
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
                        <Text fontSize={24} marginBottom="$1">👨</Text>
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
                        <Text fontSize={24} marginBottom="$1">👩</Text>
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
                  <Text fontSize="$3" color="$color10" fontWeight="500">年龄</Text>
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
                    <Text fontSize="$3" color="$color10" fontWeight="500">身高 (cm)</Text>
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
                    <Text fontSize="$3" color="$color10" fontWeight="500">体重 (kg)</Text>
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
              </YStack>
            </View>

            {/* 提示信息 */}
            <View
              backgroundColor="$color4"
              borderRadius="$4"
              padding="$2"
            >
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                您的个人信息仅存储在本地设备中，用于生成个性化的健康建议。修改后，家庭成员中的"本人"信息也会同步更新。
              </Text>
            </View>

            {/* 保存按钮 */}
            <Pressable
              onPress={handleSave}
              disabled={isLoading}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: isLoading ? 0.7 : 1,
                marginTop: 8,
              })}
            >
              <View
                backgroundColor="$primary"
                borderRadius="$10"
                paddingVertical="$3"
                alignItems="center"
              >
                <Text fontSize="$5" fontWeight="600" color="white">
                  {isLoading ? '保存中...' : '保存修改'}
                </Text>
              </View>
            </Pressable>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

export default ProfileEditScreen;
