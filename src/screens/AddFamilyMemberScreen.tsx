/**
 * AddFamilyMemberScreen - 添加家庭成员页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState } from 'react';
import { Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
  Input,
} from 'tamagui';
import { useToastController } from '@tamagui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  User,
  Calendar,
  Heart,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { addFamilyMember } from '@/services/userDataService';
import { FamilyMember, MemberHealthProfile } from '@/types/userData';

// 关系选项
const RELATIONSHIP_OPTIONS = [
  { value: '父亲', emoji: '👨' },
  { value: '母亲', emoji: '👩' },
  { value: '配偶', emoji: '💑' },
  { value: '儿子', emoji: '👦' },
  { value: '女儿', emoji: '👧' },
  { value: '爷爷', emoji: '👴' },
  { value: '奶奶', emoji: '👵' },
  { value: '外公', emoji: '👴' },
  { value: '外婆', emoji: '👵' },
  { value: '兄弟', emoji: '👨‍👦' },
  { value: '姐妹', emoji: '👩‍👧' },
  { value: '其他', emoji: '👤' },
];

// 头像选项
const AVATAR_OPTIONS = ['👤', '👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👱', '🧓'];

// 性别选项
const GENDER_OPTIONS = [
  { value: 'male' as const, label: '男', emoji: '👨' },
  { value: 'female' as const, label: '女', emoji: '👩' },
];

const AddFamilyMemberScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToastController();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  // 表单状态
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [avatar, setAvatar] = useState('👤');

  // UI 状态
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 表单验证
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入成员姓名');
      return false;
    }
    if (!relationship) {
      Alert.alert('提示', '请选择与您的关系');
      return false;
    }
    if (!birthYear || !birthMonth || !birthDay) {
      Alert.alert('提示', '请输入完整的出生日期');
      return false;
    }

    // 验证日期格式
    const year = parseInt(birthYear, 10);
    const month = parseInt(birthMonth, 10);
    const day = parseInt(birthDay, 10);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      Alert.alert('提示', '请输入有效的出生年份');
      return false;
    }
    if (month < 1 || month > 12) {
      Alert.alert('提示', '请输入有效的月份（1-12）');
      return false;
    }
    if (day < 1 || day > 31) {
      Alert.alert('提示', '请输入有效的日期（1-31）');
      return false;
    }

    return true;
  };

  // 计算年龄
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // 提交表单
  const handleSubmit = async () => {
    // 防止重复提交
    if (submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      const age = calculateAge(birthDate);

      // 初始化健康档案
      const healthProfile: MemberHealthProfile = {
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        age,
        healthStatus: 'good',
        healthScore: 80,
        devices: [],
        healthMetrics: [],
        medications: [],
        healthReports: [],
        consultations: [],
        tasks: [],
        lastUpdated: new Date().toISOString(),
        dataSource: [],
      };

      const memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        relationship,
        gender,
        birthDate,
        avatar,
        healthProfile,
        sharedData: {
          healthMetrics: true,
          devices: true,
          reports: true,
        },
      };

      await addFamilyMember(memberData);

      // 显示成功 Toast
      toast.show('添加成功', { message: '家庭成员已添加' });

      // 返回上一页，列表会通过 useFocusEffect 自动刷新
      navigation.goBack();
    } catch (error) {
      console.error('添加家庭成员失败:', error);
      toast.show('添加失败', { message: '请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="添加家庭成员" />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <YStack padding="$2.5" gap="$2">
            {/* 头像选择 */}
            <View
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                选择头像
              </Text>

              <Pressable onPress={() => setShowAvatarPicker(!showAvatarPicker)}>
                <XStack gap="$2" alignItems="center">
                  <View
                    width={64}
                    height={64}
                    borderRadius={32}
                    backgroundColor={`${primaryColor}15`}
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={2}
                    borderColor={primaryColor}
                  >
                    <Text fontSize={32}>{avatar}</Text>
                  </View>
                  <Text fontSize="$3" color="$primary">点击更换头像</Text>
                </XStack>
              </Pressable>

              {showAvatarPicker && (
                <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <Pressable key={emoji} onPress={() => {
                      setAvatar(emoji);
                      setShowAvatarPicker(false);
                    }}>
                      <View
                        width={48}
                        height={48}
                        borderRadius={24}
                        backgroundColor={avatar === emoji ? `${primaryColor}20` : '$color4'}
                        borderWidth={avatar === emoji ? 2 : 0}
                        borderColor={primaryColor}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize={24}>{emoji}</Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>
              )}
            </View>

            {/* 基本信息 */}
            <View
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                基本信息
              </Text>

              {/* 姓名 */}
              <YStack gap="$1" marginBottom="$2">
                <Text fontSize="$3" color="$color10">
                  姓名 <Text color={errorColor}>*</Text>
                </Text>
                <View
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$4"
                  backgroundColor="$color2"
                >
                  <Input
                    placeholder="请输入成员姓名"
                    value={name}
                    onChangeText={setName}
                    borderWidth={0}
                    backgroundColor="transparent"
                    fontSize="$4"
                    paddingHorizontal="$2"
                    height={44}
                  />
                </View>
              </YStack>

              {/* 关系 */}
              <YStack gap="$1" marginBottom="$2">
                <Text fontSize="$3" color="$color10">
                  与您的关系 <Text color={errorColor}>*</Text>
                </Text>
                <Pressable onPress={() => setShowRelationshipPicker(!showRelationshipPicker)}>
                  <View
                    height={44}
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$4"
                    backgroundColor="$color2"
                    paddingHorizontal="$2"
                    justifyContent="center"
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text
                        fontSize="$4"
                        color={relationship ? '$color12' : '$color10'}
                      >
                        {relationship || '请选择关系'}
                      </Text>
                      <ChevronDown size={18} color={color10} />
                    </XStack>
                  </View>
                </Pressable>

                {showRelationshipPicker && (
                  <View
                    marginTop="$1"
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$4"
                    backgroundColor="$color2"
                    overflow="hidden"
                  >
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          setRelationship(option.value);
                          setShowRelationshipPicker(false);
                        }}
                      >
                        <XStack
                          padding="$2"
                          gap="$2"
                          alignItems="center"
                          backgroundColor={relationship === option.value ? `${primaryColor}10` : 'transparent'}
                          borderBottomWidth={1}
                          borderBottomColor="$color5"
                        >
                          <Text fontSize="$5">{option.emoji}</Text>
                          <Text fontSize="$4" color="$color12" flex={1}>
                            {option.value}
                          </Text>
                          {relationship === option.value && (
                            <Check size={18} color={primaryColor} />
                          )}
                        </XStack>
                      </Pressable>
                    ))}
                  </View>
                )}
              </YStack>

              {/* 性别 */}
              <YStack gap="$1" marginBottom="$2">
                <Text fontSize="$3" color="$color10">
                  性别 <Text color={errorColor}>*</Text>
                </Text>
                <XStack gap="$2">
                  {GENDER_OPTIONS.map((option) => (
                    <Pressable
                      key={option.value}
                      style={{ flex: 1 }}
                      onPress={() => setGender(option.value)}
                    >
                      <View
                        height={44}
                        borderWidth={gender === option.value ? 2 : 1}
                        borderColor={gender === option.value ? primaryColor : '$color5'}
                        borderRadius="$4"
                        backgroundColor={gender === option.value ? `${primaryColor}10` : '$color2'}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <XStack gap="$1.5" alignItems="center">
                          <Text fontSize="$5">{option.emoji}</Text>
                          <Text
                            fontSize="$4"
                            color={gender === option.value ? '$primary' : '$color12'}
                            fontWeight={gender === option.value ? '600' : '400'}
                          >
                            {option.label}
                          </Text>
                        </XStack>
                      </View>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>

              {/* 出生日期 */}
              <YStack gap="$1">
                <Text fontSize="$3" color="$color10">
                  出生日期 <Text color={errorColor}>*</Text>
                </Text>
                <XStack gap="$2">
                  <View flex={2}>
                    <View
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color2"
                    >
                      <Input
                        placeholder="年"
                        value={birthYear}
                        onChangeText={setBirthYear}
                        keyboardType="number-pad"
                        maxLength={4}
                        borderWidth={0}
                        backgroundColor="transparent"
                        fontSize="$4"
                        paddingHorizontal="$2"
                        height={44}
                        textAlign="center"
                      />
                    </View>
                  </View>
                  <View flex={1}>
                    <View
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color2"
                    >
                      <Input
                        placeholder="月"
                        value={birthMonth}
                        onChangeText={setBirthMonth}
                        keyboardType="number-pad"
                        maxLength={2}
                        borderWidth={0}
                        backgroundColor="transparent"
                        fontSize="$4"
                        paddingHorizontal="$2"
                        height={44}
                        textAlign="center"
                      />
                    </View>
                  </View>
                  <View flex={1}>
                    <View
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      backgroundColor="$color2"
                    >
                      <Input
                        placeholder="日"
                        value={birthDay}
                        onChangeText={setBirthDay}
                        keyboardType="number-pad"
                        maxLength={2}
                        borderWidth={0}
                        backgroundColor="transparent"
                        fontSize="$4"
                        paddingHorizontal="$2"
                        height={44}
                        textAlign="center"
                      />
                    </View>
                  </View>
                </XStack>
              </YStack>
            </View>

            {/* 健康信息（可选） */}
            <View
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$2">
                <Heart size={18} color={primaryColor} />
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  健康信息
                </Text>
                <Text fontSize="$2" color="$color10">（可选）</Text>
              </XStack>

              <XStack gap="$2">
                <YStack flex={1} gap="$1">
                  <Text fontSize="$3" color="$color10">身高 (cm)</Text>
                  <View
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$4"
                    backgroundColor="$color2"
                  >
                    <Input
                      placeholder="例如：170"
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="decimal-pad"
                      borderWidth={0}
                      backgroundColor="transparent"
                      fontSize="$4"
                      paddingHorizontal="$2"
                      height={44}
                    />
                  </View>
                </YStack>

                <YStack flex={1} gap="$1">
                  <Text fontSize="$3" color="$color10">体重 (kg)</Text>
                  <View
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$4"
                    backgroundColor="$color2"
                  >
                    <Input
                      placeholder="例如：65"
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="decimal-pad"
                      borderWidth={0}
                      backgroundColor="transparent"
                      fontSize="$4"
                      paddingHorizontal="$2"
                      height={44}
                    />
                  </View>
                </YStack>
              </XStack>
            </View>

            {/* 提示信息 */}
            <View
              padding="$2"
              backgroundColor={`${primaryColor}10`}
              borderRadius="$4"
            >
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                添加家庭成员后，您可以为其管理健康数据、设置设备监测、查看健康报告。家庭成员的健康信息将安全存储在您的设备上。
              </Text>
            </View>
          </YStack>
        </ScrollView>

        {/* 底部提交按钮 */}
        <View
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          backgroundColor="$color2"
          borderTopWidth={1}
          borderTopColor="$color5"
          paddingHorizontal="$2.5"
          paddingTop="$2"
          paddingBottom={insets.bottom > 0 ? insets.bottom : 16}
        >
          <Pressable onPress={handleSubmit} disabled={submitting}>
            <View
              backgroundColor={submitting ? '$color5' : primaryColor}
              borderRadius="$10"
              paddingVertical="$3"
              alignItems="center"
            >
              <Text
                fontSize="$4"
                fontWeight="600"
                color={submitting ? '$color10' : 'white'}
              >
                {submitting ? '添加中...' : '确认添加'}
              </Text>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddFamilyMemberScreen;
