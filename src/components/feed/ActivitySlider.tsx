/**
 * ActivitySlider - 限时活动横滑组件
 * 横向滚动展示限时活动卡片
 * 遵循 CLAUDE.md 组件规范
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Activity } from '@/types/feed';

interface ActivitySliderProps {
  activities: Activity[];
  onPress: (activity: Activity) => void;
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  activities,
  onPress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const warningColor = theme.warning?.val;

  // 计算剩余天数
  const getDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <YStack gap="$2">
      {/* 标题 */}
      <XStack alignItems="center" gap="$1">
        <Clock size={18} color={warningColor} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          限时活动
        </Text>
      </XStack>

      {/* 横滑列表 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {activities.map((activity) => {
          const daysRemaining = getDaysRemaining(activity.endDate);

          return (
            <Pressable key={activity.id} onPress={() => onPress(activity)}>
              <View
                width={200}
                borderRadius="$5"
                overflow="hidden"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
              >
                {/* 图片 */}
                <View position="relative">
                  <Image
                    source={{ uri: activity.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  {/* 角标 */}
                  {activity.badge && (
                    <View
                      position="absolute"
                      top={8}
                      left={8}
                      backgroundColor={warningColor}
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize={10} color="white" fontWeight="600">
                        {activity.badge}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 内容 */}
                <YStack padding="$2" gap="$1">
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color="$color12"
                    numberOfLines={1}
                  >
                    {activity.title}
                  </Text>
                  {activity.subtitle && (
                    <Text fontSize="$2" color="$color10" numberOfLines={1}>
                      {activity.subtitle}
                    </Text>
                  )}
                  {/* 倒计时 */}
                  <XStack alignItems="center" gap="$1">
                    <Clock size={12} color={warningColor} />
                    <Text fontSize="$2" color="$warning" fontWeight="500">
                      {daysRemaining > 0 ? `剩余${daysRemaining}天` : '即将结束'}
                    </Text>
                  </XStack>
                </YStack>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </YStack>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 100,
  },
});

export default ActivitySlider;
