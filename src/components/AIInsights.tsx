import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H4,
  useTheme,
  Paragraph,
  Theme,
} from 'tamagui';
import { Pressable } from 'react-native';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react-native';

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
 * 使用 Tamagui 主题色系统和官方组件规范
 */
export const AIInsights: React.FC<AIInsightsProps> = ({
  insights,
  maxVisible = 3,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  const visibleInsights = expanded ? insights : insights.slice(0, maxVisible);
  const hasMore = insights.length > maxVisible;

  // 获取洞察类型配置 - 使用主题色
  const getInsightConfig = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return {
          icon: TrendingUp,
          iconColor: theme.primary?.val,
          accentColor: theme.primary?.val,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: theme.warning?.val,
          accentColor: theme.warning?.val,
        };
      case 'suggestion':
        return {
          icon: Lightbulb,
          iconColor: theme.secondary?.val || theme.info?.val,
          accentColor: theme.secondary?.val || theme.info?.val,
        };
      case 'positive':
        return {
          icon: CheckCircle,
          iconColor: theme.success?.val,
          accentColor: theme.success?.val,
        };
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card
      padding="$2"
      borderRadius="$6"
     
      borderWidth={1}
      borderColor="$color5"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={0.12}
      shadowRadius={16}
      elevation={4}
    >
      {/* 标题 */}
      <XStack gap="$2" alignItems="center" marginBottom="$2">
        <View
          width={32}
          height={32}
          borderRadius="$12"
          backgroundColor="$color3"
          justifyContent="center"
          alignItems="center"
        >
          <Lightbulb size={18} color={theme.primary?.val} />
        </View>
        <H4 color="$color12">
          AI为您发现
        </H4>
      </XStack>

      {/* 洞察列表 */}
      <YStack gap="$2">
        {visibleInsights.map((insight) => {
          const config = getInsightConfig(insight.type);
          const IconComponent = config.icon;

          return (
            <View
              key={insight.id}
              padding="$2"
              borderRadius="$5"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              borderLeftWidth={3}
              borderLeftColor={config.accentColor}
            >
              <XStack gap="$2" alignItems="flex-start" marginBottom="$2">
                <View
                  width={24}
                  height={24}
                  borderRadius="$12"
                  backgroundColor="$color3"
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconComponent size={14} color={config.iconColor} />
                </View>
                <YStack flex={1} gap="$1">
                  <Text fontSize="$4" fontWeight="600" color="$color12">
                    {insight.title}
                  </Text>
                  <Paragraph size="$3" color="$color10" lineHeight="$2">
                    {insight.description}
                  </Paragraph>
                </YStack>
              </XStack>

              {/* 行动按钮 - 胶囊形状 */}
              {insight.action && (
                <Pressable onPress={insight.action.onPress}>
                  <View
                    marginTop="$2"
                    paddingVertical="$1.5"
                    paddingHorizontal="$3"
                    backgroundColor="$color3"
                    borderRadius="$10"
                    alignSelf="flex-start"
                  >
                    <XStack gap="$1" alignItems="center">
                      <Text fontSize="$3" color={config.accentColor} fontWeight="500">
                        {insight.action.label}
                      </Text>
                      <ChevronRight size={14} color={config.accentColor} />
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
          <XStack
            marginTop="$3"
            paddingVertical="$2"
            justifyContent="center"
            alignItems="center"
            gap="$0.5"
          >
            <Text fontSize="$3" color="$primary" fontWeight="500">
              {expanded ? '收起' : `查看更多 (${insights.length - maxVisible})`}
            </Text>
            <ChevronRight
              size={14}
              color={theme.primary?.val}
              style={{ transform: [{ rotate: expanded ? '-90deg' : '90deg' }] }}
            />
          </XStack>
        </Pressable>
      )}
    </Card>
  );
};
