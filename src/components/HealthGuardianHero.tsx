import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  useTheme,
  Paragraph,
  Image,
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, TrendingUp, ChevronDown, Users, CheckCircle } from 'lucide-react-native';
import { Pressable, StyleSheet, ImageSourcePropType } from 'react-native';
// import { Video, ResizeMode } from 'expo-av';
import { BottomSheet } from './BottomSheet';

// 健康状态图标（从低到高：1-4）
const HEALTH_ICONS = {
  1: require('../../assets/images/kang/kangyang-icon-1.png'),
  2: require('../../assets/images/kang/kangyang-icon-2.png'),
  3: require('../../assets/images/kang/kangyang-icon-3.png'),
  4: require('../../assets/images/kang/kangyang-icon-4.png'),
};

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // 关系：本人/父亲/母亲/子女等
  healthStatus: 'excellent' | 'good' | 'attention'; // 健康状态
  avatar?: string;
}

interface HealthGuardianHeroProps {
  userName: string;
  healthScore: number;
  aiInterpretation: string;
  aiSuggestion: string;
  currentMemberId?: string; // 当前查看的家庭成员ID
  familyMembers?: FamilyMember[]; // 家庭成员列表
  onReportPress: () => void;
  onAIConsultPress: () => void;
  onMemberChange?: (memberId: string) => void; // 切换家庭成员回调
}

/**
 * 智能健康守护中心 - Hero区组件
 * 展示健康评分、AI解读和行动建议
 * 使用 Tamagui 主题色系统和官方组件规范
 */
export const HealthGuardianHero: React.FC<HealthGuardianHeroProps> = ({
  userName,
  healthScore,
  aiInterpretation,
  aiSuggestion,
  currentMemberId,
  familyMembers = [],
  onReportPress,
  onAIConsultPress,
  onMemberChange,
}) => {
  const theme = useTheme();
  const [showFamilySelector, setShowFamilySelector] = useState(false);

  // 根据健康评分确定状态和图标 - 使用主题色
  const getHealthStatus = (score: number) => {
    if (score >= 88) {
      return {
        iconLevel: 4,
        status: '优秀',
        colorKey: 'success' as const,
      };
    } else if (score >= 70) {
      return {
        iconLevel: 3,
        status: '良好',
        colorKey: 'primary' as const,
      };
    } else if (score >= 60) {
      return {
        iconLevel: 2,
        status: '一般',
        colorKey: 'warning' as const,
      };
    } else {
      return {
        iconLevel: 1,
        status: '需关注',
        colorKey: 'error' as const,
      };
    }
  };

  // 获取家庭成员状态颜色
  const getMemberStatusColor = (status: FamilyMember['healthStatus']) => {
    switch (status) {
      case 'excellent':
        return theme.success?.val;
      case 'good':
        return theme.primary?.val;
      case 'attention':
        return theme.warning?.val;
    }
  };

  // 获取家庭成员状态文本
  const getMemberStatusText = (status: FamilyMember['healthStatus']) => {
    switch (status) {
      case 'excellent':
        return '优秀';
      case 'good':
        return '良好';
      case 'attention':
        return '需关注';
    }
  };

  const healthStatus = getHealthStatus(healthScore);
  const statusColor = theme[healthStatus.colorKey]?.val;

  // 找到当前选中的家庭成员
  const currentMember = familyMembers.find(m => m.id === currentMemberId);
  const hasFamilyMembers = familyMembers.length > 0;

  // 获取渐变色 - 上浅下深（主色调12色阶的偏浅色到主色）
  const gradientColors = [
    theme.color9?.val,  // 偏浅色
    theme.primary?.val, // 主色
  ] as [string, string];

  return (
    <>
      <View borderRadius="$7" overflow="hidden" marginBottom="$4">
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            padding: 24,
          }}
        >
          {/* 视频背景层 - 已注释，移至 AIConsultationScreen */}
          {/* <Video
            source={require('../../assets/welcome.mp4')}
            style={styles.backgroundVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          /> */}
          {/* 问候语和家人切换 */}
          <YStack gap="$1" marginBottom="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$2" alignItems="center" flex={1}>
                {currentMember?.relationship === '本人' ? (
                  <>
                    <Paragraph size="$3" color="rgba(255,255,255,0.8)">
                      早安，{userName}
                    </Paragraph>
                    <View
                      backgroundColor="rgba(255,255,255,0.2)"
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$10"
                    >
                      <Text fontSize="$1" color="rgba(255,255,255,0.9)">
                        本人
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Paragraph size="$3" color="rgba(255,255,255,0.8)">
                      正在查看
                    </Paragraph>
                    <View
                      backgroundColor="rgba(255,255,255,0.25)"
                      paddingHorizontal="$2.5"
                      paddingVertical="$1"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor="rgba(255,255,255,0.4)"
                    >
                      <Text fontSize="$3" color="white" fontWeight="500">
                        {userName}
                      </Text>
                    </View>
                    <Paragraph size="$3" color="rgba(255,255,255,0.8)">
                      的健康
                    </Paragraph>
                  </>
                )}
              </XStack>

              {/* 家人切换按钮 - 胶囊形状 */}
              {hasFamilyMembers && onMemberChange && (
                <Pressable onPress={() => setShowFamilySelector(true)}>
                  <View
                    backgroundColor="rgba(255,255,255,0.2)"
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.3)"
                  >
                    <XStack gap="$1" alignItems="center">
                      <Users size={14} color="white" />
                      <Text fontSize="$2" color="white" fontWeight="500">
                        切换家人
                      </Text>
                      <ChevronDown size={12} color="white" />
                    </XStack>
                  </View>
                </Pressable>
              )}
            </XStack>
            <Paragraph size="$2" color="rgba(255,255,255,0.6)">
              {currentMember?.relationship === '本人'
                ? '让我们开始今天的健康之旅'
                : '关注家人健康，守护家庭幸福'}
            </Paragraph>
          </YStack>

          {/* AI虚拟形象和健康评分 */}
          <YStack alignItems="center" gap="$3" marginBottom="$4">
            {/* AI健康状态图标 */}
            <View
              width={80}
              height={80}
              justifyContent="center"
              alignItems="center"
            >
              {/* 背景圆圈 */}
              <View
                position="absolute"
                width={80}
                height={80}
                borderRadius="$12"
                backgroundColor={`${statusColor}25`}
                borderWidth={3}
                borderColor="rgba(255,255,255,0.3)"
              />
              {/* 图标在上层 */}
              <Image
                source={HEALTH_ICONS[healthStatus.iconLevel as keyof typeof HEALTH_ICONS]}
                width={100}
                height={100}
                resizeMode="contain"
                zIndex={1}
              />
            </View>

            {/* 健康状态提示 - 胶囊形状 */}
            <View
              backgroundColor="rgba(255,255,255,0.2)"
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius="$10"
            >
              <Text fontSize="$4" color="white" fontWeight="500">
                健康状态{healthStatus.status}
              </Text>
            </View>
          </YStack>

          {/* AI解读区域 */}
          <View
            backgroundColor="rgba(255,255,255,0.15)"
            padding="$2"
            borderRadius="$5"
            marginBottom="$2"
            borderWidth={1}
            borderColor="rgba(255,255,255,0.2)"
          >
            <XStack gap="$2" alignItems="flex-start" marginBottom="$2">
              <MessageCircle size={16} color="white" />
              <Text fontSize="$3" color="white" fontWeight="600">
                AI健康师说：
              </Text>
            </XStack>
            <Paragraph size="$3" color="rgba(255,255,255,0.9)" lineHeight="$2" marginBottom="$3">
              {aiInterpretation}
            </Paragraph>
            <XStack gap="$2" alignItems="flex-start">
              <TrendingUp size={16} color={theme.success?.val} />
              <Paragraph size="$3" color="rgba(255,255,255,0.9)" lineHeight="$2">
                今日建议：{aiSuggestion}
              </Paragraph>
            </XStack>
          </View>

          {/* 操作按钮 - 胶囊形状 */}
          <XStack gap="$3">
            <Pressable style={{ flex: 1 }} onPress={onReportPress}>
              <View
                flex={1}
                backgroundColor="white"
                borderRadius="$10"
                paddingVertical="$2.5"
                justifyContent="center"
                alignItems="center"
              >
                <XStack gap="$2" alignItems="center">
                  <TrendingUp size={18} color={theme.primary?.val} />
                  <Text fontSize="$3" color="$primary" fontWeight="500">
                    查看详细分析
                  </Text>
                </XStack>
              </View>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={onAIConsultPress}>
              <View
                flex={1}
                backgroundColor="rgba(255,255,255,0.2)"
                borderRadius="$10"
                paddingVertical="$2.5"
                justifyContent="center"
                alignItems="center"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.3)"
              >
                <XStack gap="$2" alignItems="center">
                  <MessageCircle size={18} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    问AI
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </LinearGradient>
      </View>

      {/* 家人选择器弹窗 */}
      <BottomSheet
        visible={showFamilySelector}
        onClose={() => setShowFamilySelector(false)}
        title="选择家庭成员"
        variant="picker"
        scrollable={false}
      >
        <YStack gap="$2">
          {familyMembers.map((member) => {
            const isSelected = member.id === currentMemberId;
            const memberStatusColor = getMemberStatusColor(member.healthStatus);
            const primaryColor = theme.primary?.val;

            return (
              <Pressable
                key={member.id}
                onPress={() => {
                  onMemberChange?.(member.id);
                  setShowFamilySelector(false);
                }}
              >
                <View
                  padding="$2"
                  borderRadius="$4"
                  backgroundColor={isSelected ? `${primaryColor}15` : '$color1'}
                  borderWidth={1}
                  borderColor={isSelected ? primaryColor : '$color5'}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <XStack gap="$2" alignItems="center" flex={1}>
                      {/* 头像 */}
                      <View
                        width={44}
                        height={44}
                        borderRadius="$10"
                        backgroundColor={`${memberStatusColor}20`}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize={22}>
                          {member.avatar || '👤'}
                        </Text>
                      </View>

                      {/* 姓名和关系 */}
                      <YStack flex={1} gap="$0.5">
                        <XStack gap="$2" alignItems="center">
                          <Text
                            fontSize="$4"
                            fontWeight={isSelected ? '600' : '500'}
                            color={isSelected ? primaryColor : '$color12'}
                          >
                            {member.name}
                          </Text>
                          <View
                            paddingHorizontal="$1.5"
                            paddingVertical="$0.5"
                            borderRadius="$10"
                            backgroundColor="$color4"
                          >
                            <Text fontSize="$2" color="$color10">
                              {member.relationship}
                            </Text>
                          </View>
                        </XStack>
                        <XStack gap="$1" alignItems="center">
                          <View
                            width={6}
                            height={6}
                            borderRadius="$10"
                            backgroundColor={memberStatusColor}
                          />
                          <Text fontSize="$2" color={memberStatusColor} fontWeight="500">
                            健康状态{getMemberStatusText(member.healthStatus)}
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>

                    {/* 选中标识 */}
                    {isSelected && (
                      <CheckCircle size={22} color={primaryColor} />
                    )}
                  </XStack>
                </View>
              </Pressable>
            );
          })}
        </YStack>
      </BottomSheet>
    </>
  );
};

// 视频样式已移至 AIConsultationScreen
// const styles = StyleSheet.create({
//   backgroundVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });
