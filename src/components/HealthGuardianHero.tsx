import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  H2,
  Theme,
  Button,
  Sheet,
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, TrendingUp, ChevronDown, Users, CheckCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Pressable, Modal } from 'react-native';

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
  const [showFamilySelector, setShowFamilySelector] = useState(false);

  // 根据健康评分确定状态和表情
  const getHealthStatus = (score: number) => {
    if (score >= 85) {
      return {
        emoji: '😊',
        status: '优秀',
        color: COLORS.success,
        bgColor: 'rgba(16, 185, 129, 0.1)',
      };
    } else if (score >= 70) {
      return {
        emoji: '🙂',
        status: '良好',
        color: COLORS.primary,
        bgColor: 'rgba(99, 102, 241, 0.1)',
      };
    } else {
      return {
        emoji: '😐',
        status: '需关注',
        color: COLORS.warning,
        bgColor: 'rgba(245, 158, 11, 0.1)',
      };
    }
  };

  // 获取家庭成员状态颜色
  const getMemberStatusColor = (status: FamilyMember['healthStatus']) => {
    switch (status) {
      case 'excellent':
        return COLORS.success;
      case 'good':
        return COLORS.primary;
      case 'attention':
        return COLORS.warning;
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

  // 找到当前选中的家庭成员
  const currentMember = familyMembers.find(m => m.id === currentMemberId);
  const hasFamilyMembers = familyMembers.length > 0;

  return (
    <Theme name="light">
      <View borderRadius="$6" overflow="hidden" marginBottom="$4">
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 24,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 15,
            elevation: 8,
          }}
        >
          {/* 问候语和家人切换 */}
          <YStack marginBottom="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$2" alignItems="center" flex={1}>
                {currentMember?.relationship === '本人' ? (
                  <>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      早安，{userName}
                    </Text>
                    <View
                      backgroundColor="rgba(255,255,255,0.2)"
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize="$1" color="rgba(255,255,255,0.9)">
                        本人
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      正在查看
                    </Text>
                    <View
                      backgroundColor="rgba(255,255,255,0.25)"
                      paddingHorizontal="$2.5"
                      paddingVertical="$1"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="rgba(255,255,255,0.4)"
                    >
                      <Text fontSize="$3" color="white" fontWeight="600">
                        {userName}
                      </Text>
                    </View>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)">
                      的健康
                    </Text>
                  </>
                )}
              </XStack>

              {/* 家人切换按钮 */}
              {hasFamilyMembers && onMemberChange && (
                <Pressable onPress={() => setShowFamilySelector(true)}>
                  <View
                    backgroundColor="rgba(255,255,255,0.2)"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.3)"
                  >
                    <XStack space="$1" alignItems="center">
                      <Users size={14} color="white" />
                      <Text fontSize="$2" color="white" fontWeight="600">
                        切换家人
                      </Text>
                      <ChevronDown size={12} color="white" />
                    </XStack>
                  </View>
                </Pressable>
              )}
            </XStack>
            <Text fontSize="$2" color="rgba(255,255,255,0.6)" marginTop="$1">
              {currentMember?.relationship === '本人'
                ? '让我们开始今天的健康之旅'
                : '关注家人健康，守护家庭幸福'}
            </Text>
          </YStack>

          {/* AI虚拟形象和健康评分 */}
          <YStack alignItems="center" marginBottom="$4">
            {/* AI表情头像 */}
            <View
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor={healthStatus.bgColor}
              justifyContent="center"
              alignItems="center"
              marginBottom="$5"
              borderWidth={3}
              borderColor="rgba(255,255,255,0.3)"
              overflow="hidden"
            >
              <Text fontSize={40}>{healthStatus.emoji}</Text>
            </View>

            {/* 健康状态提示 */}
            <View
              backgroundColor="rgba(255,255,255,0.2)"
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius="$3"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                健康状态{healthStatus.status}
              </Text>
            </View>
          </YStack>

          {/* AI解读区域 */}
          <View
            backgroundColor="rgba(255,255,255,0.15)"
            padding="$4"
            borderRadius="$4"
            marginBottom="$4"
            borderWidth={1}
            borderColor="rgba(255,255,255,0.2)"
          >
            <XStack space="$2" alignItems="flex-start" marginBottom="$2">
              <MessageCircle size={16} color="white" />
              <Text fontSize="$3" color="white" fontWeight="600">
                AI健康师说：
              </Text>
            </XStack>
            <Text fontSize="$3" color="rgba(255,255,255,0.9)" lineHeight="$2" marginBottom="$3">
              {aiInterpretation}
            </Text>
            <XStack space="$2" alignItems="flex-start">
              <TrendingUp size={16} color="#4ADE80" />
              <Text fontSize="$3" color="rgba(255,255,255,0.9)" lineHeight="$2">
                今日建议：{aiSuggestion}
              </Text>
            </XStack>
          </View>

          {/* 操作按钮 */}
          <XStack space="$3">
            <Pressable style={{ flex: 1 }} onPress={onReportPress}>
              <View
                flex={1}
                backgroundColor="white"
                borderRadius="$3"
                paddingVertical="$3"
                justifyContent="center"
                alignItems="center"
              >
                <XStack space="$2" alignItems="center">
                  <TrendingUp size={18} color={COLORS.primary} />
                  <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
                    查看详细分析
                  </Text>
                </XStack>
              </View>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={onAIConsultPress}>
              <View
                flex={1}
                backgroundColor="rgba(255,255,255,0.2)"
                borderRadius="$3"
                paddingVertical="$3"
                justifyContent="center"
                alignItems="center"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.3)"
              >
                <XStack space="$2" alignItems="center">
                  <MessageCircle size={18} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="600">
                    问AI
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </LinearGradient>
      </View>

      {/* 家人选择器弹窗 */}
      <Modal
        visible={showFamilySelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFamilySelector(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setShowFamilySelector(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              backgroundColor="white"
              borderTopLeftRadius="$6"
              borderTopRightRadius="$6"
              padding="$4"
              paddingBottom="$8"
            >
              {/* 标题 */}
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                <XStack space="$2" alignItems="center">
                  <Users size={20} color={COLORS.primary} />
                  <Text fontSize="$5" fontWeight="600" color="$text">
                    选择家庭成员
                  </Text>
                </XStack>
                <Pressable onPress={() => setShowFamilySelector(false)}>
                  <Text fontSize="$4" color="$textSecondary">
                    关闭
                  </Text>
                </Pressable>
              </XStack>

              {/* 家人列表 */}
              <YStack space="$3">
                {familyMembers.map((member) => {
                  const isSelected = member.id === currentMemberId;
                  const statusColor = getMemberStatusColor(member.healthStatus);

                  return (
                    <Pressable
                      key={member.id}
                      onPress={() => {
                        onMemberChange?.(member.id);
                        setShowFamilySelector(false);
                      }}
                    >
                      <View
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor={isSelected ? `${COLORS.primary}10` : '$surface'}
                        borderWidth={isSelected ? 2 : 1}
                        borderColor={isSelected ? COLORS.primary : '$borderColor'}
                      >
                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack space="$3" alignItems="center" flex={1}>
                            {/* 头像占位 */}
                            <View
                              width={48}
                              height={48}
                              borderRadius={24}
                              backgroundColor={`${statusColor}20`}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize={24}>
                                {member.avatar || '👤'}
                              </Text>
                            </View>

                            {/* 姓名和关系 */}
                            <YStack flex={1}>
                              <XStack space="$2" alignItems="center" marginBottom="$1">
                                <Text fontSize="$4" fontWeight="600" color="$text">
                                  {member.name}
                                </Text>
                                <View
                                  backgroundColor="$surface"
                                  paddingHorizontal="$2"
                                  paddingVertical="$0.5"
                                  borderRadius="$2"
                                >
                                  <Text fontSize="$2" color="$textSecondary">
                                    {member.relationship}
                                  </Text>
                                </View>
                              </XStack>
                              <XStack space="$1" alignItems="center">
                                <View
                                  width={6}
                                  height={6}
                                  borderRadius={3}
                                  backgroundColor={statusColor}
                                />
                                <Text fontSize="$3" color={statusColor} fontWeight="500">
                                  健康状态{getMemberStatusText(member.healthStatus)}
                                </Text>
                              </XStack>
                            </YStack>
                          </XStack>

                          {/* 选中标识 */}
                          {isSelected && (
                            <CheckCircle size={24} color={COLORS.primary} />
                          )}
                        </XStack>
                      </View>
                    </Pressable>
                  );
                })}
              </YStack>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Theme>
  );
};
