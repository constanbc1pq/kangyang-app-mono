/**
 * 专家团队卡片组件
 * 横向滚动展示专业团队，建立信任
 */

import React from 'react';
import { View, Text, YStack, XStack, Card } from 'tamagui';
import { Pressable, ScrollView } from 'react-native';
import { Star, Award, MessageCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export interface ExpertProfile {
  id: string;
  name: string;
  avatar: string; // emoji或头像URL
  title: string; // "主任医师" | "高级营养师" | "资深律师" etc.
  category: 'nutrition' | 'doctor' | 'elderly' | 'legal' | 'insurance';
  categoryLabel: string; // "营养师" | "医生" | "养老顾问" etc.
  expertise: string[]; // 专业领域
  credentials: string[]; // 资质认证
  rating: number; // 评分 (4.8, 4.9, 5.0)
  consultationCount: number; // 咨询次数
  yearsOfExperience?: number; // 从业年限
  badge?: string; // "金牌专家" | "人气专家" | "资深顾问"
  targetScreen: string;
  targetParams?: any;
}

interface ExpertCardProps {
  expert: ExpertProfile;
  onPress: (screen: string, params?: any) => void;
}

const ExpertCardItem: React.FC<ExpertCardProps> = ({ expert, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(expert.targetScreen, expert.targetParams)}
      style={{ width: 260, marginRight: 12 }}
    >
      <Card
        bordered
        padding="$4"
        backgroundColor="$surface"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        elevation={2}
        height={280}
      >
        <YStack space="$3" flex={1}>
          {/* 头像和基本信息 */}
          <XStack alignItems="flex-start" space="$3">
            {/* 头像 */}
            <View
              width={64}
              height={64}
              borderRadius={32}
              backgroundColor="$background"
              justifyContent="center"
              alignItems="center"
              borderWidth={2}
              borderColor={COLORS.primary}
            >
              <Text fontSize={36}>{expert.avatar}</Text>
            </View>

            {/* 姓名和职称 */}
            <YStack flex={1}>
              <XStack alignItems="center" space="$2">
                <Text fontSize="$4" fontWeight="700" color="$text">
                  {expert.name}
                </Text>
                {expert.badge && (
                  <View
                    backgroundColor={`${COLORS.warning}20`}
                    paddingHorizontal="$1"
                    paddingVertical={2}
                    borderRadius="$1"
                  >
                    <Text fontSize="$1" color={COLORS.warning} fontWeight="600">
                      {expert.badge}
                    </Text>
                  </View>
                )}
              </XStack>
              <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                {expert.title}
              </Text>
              <Text fontSize="$2" color={COLORS.primary} marginTop="$1" fontWeight="600">
                {expert.categoryLabel}
              </Text>
            </YStack>
          </XStack>

          {/* 评分和咨询次数 */}
          <XStack space="$3">
            <XStack alignItems="center" space="$1">
              <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
              <Text fontSize="$2" color="$text" fontWeight="600">
                {expert.rating.toFixed(1)}
              </Text>
            </XStack>
            <XStack alignItems="center" space="$1">
              <MessageCircle size={14} color={COLORS.textSecondary} />
              <Text fontSize="$2" color="$textSecondary">
                {expert.consultationCount}次咨询
              </Text>
            </XStack>
            {expert.yearsOfExperience && (
              <XStack alignItems="center" space="$1">
                <Award size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {expert.yearsOfExperience}年经验
                </Text>
              </XStack>
            )}
          </XStack>

          {/* 专业领域 */}
          <YStack space="$1" flex={1}>
            <Text fontSize="$2" color="$textSecondary">
              擅长领域：
            </Text>
            <Text fontSize="$3" color="$text" lineHeight={20} numberOfLines={2}>
              {expert.expertise.join(' · ')}
            </Text>
          </YStack>

          {/* 资质认证 */}
          <View
            backgroundColor="$background"
            padding="$2"
            borderRadius="$2"
            flexWrap="wrap"
          >
            <XStack flexWrap="wrap" gap={4}>
              {expert.credentials.slice(0, 2).map((credential, index) => (
                <View
                  key={index}
                  backgroundColor={`${COLORS.primary}15`}
                  paddingHorizontal="$2"
                  paddingVertical={2}
                  borderRadius="$1"
                >
                  <Text fontSize="$1" color={COLORS.primary}>
                    {credential}
                  </Text>
                </View>
              ))}
            </XStack>
          </View>

          {/* 预约按钮 */}
          <View
            backgroundColor={COLORS.primary}
            paddingVertical="$2"
            borderRadius="$3"
            alignItems="center"
            marginTop="auto"
          >
            <Text color="white" fontSize="$3" fontWeight="600">
              预约咨询
            </Text>
          </View>
        </YStack>
      </Card>
    </Pressable>
  );
};

interface ExpertTeamListProps {
  experts: ExpertProfile[];
  onExpertPress: (screen: string, params?: any) => void;
}

export const ExpertTeamList: React.FC<ExpertTeamListProps> = ({
  experts,
  onExpertPress,
}) => {
  return (
    <View marginBottom={16}>
      <YStack space="$3">
        {/* 标题 */}
        <View paddingHorizontal="$4">
          <Text fontSize="$5" fontWeight="600" color="$text">
            专家团队
          </Text>
          <Text fontSize="$3" color="$textSecondary" marginTop="$1">
            专业资质认证，值得信赖
          </Text>
        </View>

        {/* 横向滚动专家列表 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
        >
          {experts.map((expert) => (
            <ExpertCardItem
              key={expert.id}
              expert={expert}
              onPress={onExpertPress}
            />
          ))}
        </ScrollView>
      </YStack>
    </View>
  );
};

/**
 * Mock专家团队数据
 */
export const mockExperts: ExpertProfile[] = [
  // 营养师
  {
    id: 'expert_nutrition_001',
    name: '张晓红',
    avatar: '👩‍⚕️',
    title: '高级营养师',
    category: 'nutrition',
    categoryLabel: '营养师',
    expertise: ['三高调理', '糖尿病饮食', '营养配餐', '慢病管理'],
    credentials: ['国家一级营养师', '临床营养师'],
    rating: 4.9,
    consultationCount: 1280,
    yearsOfExperience: 12,
    badge: '金牌专家',
    targetScreen: 'NutritionService',
    targetParams: { expertId: 'expert_nutrition_001' },
  },
  // 医生
  {
    id: 'expert_doctor_001',
    name: '李明',
    avatar: '👨‍⚕️',
    title: '主任医师',
    category: 'doctor',
    categoryLabel: '医生',
    expertise: ['慢病管理', '健康体检', '疾病预防', '用药指导'],
    credentials: ['主任医师', '医学博士'],
    rating: 5.0,
    consultationCount: 2450,
    yearsOfExperience: 18,
    badge: '金牌专家',
    targetScreen: 'PrivateDoctorList',
    targetParams: { expertId: 'expert_doctor_001' },
  },
  // 心血管医生
  {
    id: 'expert_doctor_002',
    name: '王芳',
    avatar: '👩‍⚕️',
    title: '副主任医师',
    category: 'doctor',
    categoryLabel: '医生',
    expertise: ['心血管疾病', '高血压管理', '心脏康复', '健康评估'],
    credentials: ['副主任医师', '心血管专科'],
    rating: 4.8,
    consultationCount: 1850,
    yearsOfExperience: 15,
    badge: '人气专家',
    targetScreen: 'PrivateDoctorList',
    targetParams: { expertId: 'expert_doctor_002' },
  },
  // 养老顾问
  {
    id: 'expert_elderly_001',
    name: '陈慧',
    avatar: '👩',
    title: '高级养老顾问',
    category: 'elderly',
    categoryLabel: '养老顾问',
    expertise: ['居家养老', '护理方案', '康复指导', '适老化改造'],
    credentials: ['养老护理师', '康复治疗师'],
    rating: 4.9,
    consultationCount: 890,
    yearsOfExperience: 10,
    badge: '资深顾问',
    targetScreen: 'ElderlyService',
    targetParams: { expertId: 'expert_elderly_001' },
  },
  // 律师
  {
    id: 'expert_legal_001',
    name: '刘建国',
    avatar: '👨‍💼',
    title: '资深律师',
    category: 'legal',
    categoryLabel: '律师',
    expertise: ['遗嘱继承', '财产分配', '老年法律', '家庭财富规划'],
    credentials: ['执业律师', '遗嘱规划师'],
    rating: 4.9,
    consultationCount: 1560,
    yearsOfExperience: 16,
    badge: '金牌专家',
    targetScreen: 'LegalServiceHome',
    targetParams: { expertId: 'expert_legal_001' },
  },
  // 保险顾问
  {
    id: 'expert_insurance_001',
    name: '赵雪梅',
    avatar: '👩‍💼',
    title: '高级保险顾问',
    category: 'insurance',
    categoryLabel: '保险顾问',
    expertise: ['健康险规划', '养老保险', '家庭保障', '理赔服务'],
    credentials: ['AFP金融理财师', '保险经纪人'],
    rating: 4.8,
    consultationCount: 2100,
    yearsOfExperience: 11,
    badge: '人气专家',
    targetScreen: 'InsuranceHome',
    targetParams: { expertId: 'expert_insurance_001' },
  },
  // 中医养生专家
  {
    id: 'expert_tcm_001',
    name: '孙德华',
    avatar: '👨‍⚕️',
    title: '主任中医师',
    category: 'doctor',
    categoryLabel: '中医师',
    expertise: ['中医养生', '慢病调理', '药膳食疗', '体质辨识'],
    credentials: ['主任中医师', '中医博士'],
    rating: 4.9,
    consultationCount: 1340,
    yearsOfExperience: 20,
    badge: '资深专家',
    targetScreen: 'PrivateDoctorList',
    targetParams: { expertId: 'expert_tcm_001' },
  },
  // 康复治疗师
  {
    id: 'expert_rehab_001',
    name: '周敏',
    avatar: '👩‍⚕️',
    title: '康复治疗师',
    category: 'elderly',
    categoryLabel: '康复师',
    expertise: ['术后康复', '运动康复', '功能训练', '疼痛管理'],
    credentials: ['康复治疗师', '运动医学'],
    rating: 4.8,
    consultationCount: 760,
    yearsOfExperience: 8,
    targetScreen: 'ElderlyService',
    targetParams: { expertId: 'expert_rehab_001' },
  },
];
