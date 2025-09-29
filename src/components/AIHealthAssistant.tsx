import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H3,
  Theme,
} from 'tamagui';
import { Bot, MessageCircle, FileText, Calendar, TrendingUp } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export const AIHealthAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights');

  const healthInsights = [
    {
      type: "recommendation",
      title: "运动建议",
      content: "根据您的血压数据，建议每天进行30分钟中等强度运动，如快走或游泳。",
      priority: "medium",
    },
    {
      type: "alert",
      title: "睡眠质量",
      content: "您的深度睡眠时间偏少，建议睡前1小时避免使用电子设备。",
      priority: "high",
    },
    {
      type: "achievement",
      title: "体重管理",
      content: "恭喜！您本周体重下降0.5kg，继续保持健康的饮食习惯。",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "$error";
      case "medium": return "$warning";
      case "low": return "$success";
      default: return "$textSecondary";
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high": return "rgba(239, 68, 68, 0.1)";
      case "medium": return "rgba(245, 158, 11, 0.1)";
      case "low": return "rgba(16, 185, 129, 0.1)";
      default: return "$surface";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <TrendingUp size={16} color={COLORS.primary} />;
      case "alert":
        return <MessageCircle size={16} color={COLORS.warning} />;
      case "achievement":
        return <Calendar size={16} color={COLORS.success} />;
      default:
        return <Bot size={16} color={COLORS.primary} />;
    }
  };

  return (
    <Theme name="light">
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
        <XStack space="$2" alignItems="center" marginBottom="$4">
          <Bot size={20} color={COLORS.primary} />
          <H3 fontSize="$6" color="$text" fontWeight="600">
            AI健康助手
          </H3>
        </XStack>

        <YStack space="$3">
          {healthInsights.map((insight, index) => (
            <View
              key={index}
              padding="$4"
              borderRadius="$3"
              backgroundColor={getPriorityBgColor(insight.priority)}
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                <XStack space="$2" alignItems="center" flex={1}>
                  {getTypeIcon(insight.type)}
                  <Text fontSize="$4" fontWeight="600" color="$text" flex={1}>
                    {insight.title}
                  </Text>
                </XStack>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                  backgroundColor={getPriorityColor(insight.priority)}
                >
                  <Text fontSize="$1" color="white" fontWeight="500">
                    {insight.priority === 'high' ? '重要' :
                     insight.priority === 'medium' ? '中等' : '一般'}
                  </Text>
                </View>
              </XStack>
              <Text fontSize="$3" color="$textSecondary" lineHeight="$2">
                {insight.content}
              </Text>
            </View>
          ))}
        </YStack>

        {/* Quick Actions */}
        <XStack space="$2" marginTop="$4">
          <Button
            flex={1}
            size="$3"
            variant="outlined"
            borderColor="$primary"
            backgroundColor="transparent"
          >
            <XStack space="$2" alignItems="center">
              <MessageCircle size={16} color={COLORS.primary} />
              <Text fontSize="$3" color="$primary">咨询</Text>
            </XStack>
          </Button>
          <Button
            flex={1}
            size="$3"
            backgroundColor="$primary"
          >
            <XStack space="$2" alignItems="center">
              <FileText size={16} color="white" />
              <Text fontSize="$3" color="white">报告</Text>
            </XStack>
          </Button>
        </XStack>
      </Card>
    </Theme>
  );
};