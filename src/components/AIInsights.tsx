import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
} from 'tamagui';
import { Pressable, ScrollView } from 'react-native';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export interface AIInsight {
  id: string;
  type: 'trend' | 'warning' | 'suggestion' | 'positive';
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface AIInsightsProps {
  insights: AIInsight[];
  maxVisible?: number;
}

/**
 * AI健康洞察组件
 * 显示AI生成的健康分析、预警和建议
 */
export const AIInsights: React.FC<AIInsightsProps> = ({
  insights,
  maxVisible = 3,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const visibleInsights = expanded ? insights : insights.slice(0, maxVisible);
  const hasMore = insights.length > maxVisible;

  // 获取洞察类型配置
  const getInsightConfig = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return {
          icon: TrendingUp,
          iconColor: COLORS.primary,
          bgColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: COLORS.primary,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: COLORS.warning,
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: COLORS.warning,
        };
      case 'suggestion':
        return {
          icon: Lightbulb,
          iconColor: COLORS.secondary,
          bgColor: 'rgba(139, 92, 246, 0.1)',
          borderColor: COLORS.secondary,
        };
      case 'positive':
        return {
          icon: CheckCircle,
          iconColor: COLORS.success,
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: COLORS.success,
        };
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card
      padding="$4"
      borderRadius="$4"
      backgroundColor="$cardBg"
      shadowColor="$shadow"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={4}
    >
      {/* 标题 */}
      <XStack space="$2" alignItems="center" marginBottom="$4">
        <View
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor="rgba(99, 102, 241, 0.1)"
          justifyContent="center"
          alignItems="center"
        >
          <Lightbulb size={18} color={COLORS.primary} />
        </View>
        <H3 fontSize="$6" color="$text" fontWeight="600">
          AI为您发现
        </H3>
      </XStack>

      {/* 洞察列表 */}
      <YStack space="$3">
        {visibleInsights.map((insight) => {
          const config = getInsightConfig(insight.type);
          const IconComponent = config.icon;

          return (
            <View
              key={insight.id}
              padding="$3"
              borderRadius="$4"
              backgroundColor={config.bgColor}
              borderLeftWidth={3}
              borderLeftColor={config.borderColor}
            >
              <XStack space="$3" alignItems="flex-start" marginBottom="$2">
                <View
                  width={24}
                  height={24}
                  borderRadius={12}
                  backgroundColor="white"
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconComponent size={14} color={config.iconColor} />
                </View>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                    {insight.title}
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" lineHeight="$2">
                    {insight.description}
                  </Text>
                </YStack>
              </XStack>

              {/* 行动按钮 */}
              {insight.action && (
                <Pressable onPress={insight.action.onPress}>
                  <View
                    marginTop="$2"
                    paddingVertical="$2"
                    paddingHorizontal="$3"
                    backgroundColor="white"
                    borderRadius="$3"
                    alignSelf="flex-start"
                  >
                    <XStack space="$1" alignItems="center">
                      <Text fontSize="$3" color={config.iconColor} fontWeight="600">
                        {insight.action.label}
                      </Text>
                      <ChevronRight size={14} color={config.iconColor} />
                    </XStack>
                  </View>
                </Pressable>
              )}
            </View>
          );
        })}
      </YStack>

      {/* 展开/收起按钮 */}
      {hasMore && (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <View
            marginTop="$3"
            paddingVertical="$2"
            alignItems="center"
          >
            <Text fontSize="$3" color="$primary" fontWeight="600">
              {expanded ? '收起' : `查看更多 (${insights.length - maxVisible})`}
            </Text>
          </View>
        </Pressable>
      )}
    </Card>
  );
};
