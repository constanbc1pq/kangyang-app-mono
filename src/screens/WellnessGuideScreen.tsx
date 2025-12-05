/**
 * 养生科普页面
 * 提供节气养生、时辰养生、饮食养生等科普内容
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Sun,
  Clock,
  Utensils,
  Heart,
  Leaf,
  ChevronRight,
} from 'lucide-react-native';
import { getCalendarInfo, CalendarInfo } from '@/services/lunarCalendarService';

// 养生知识分类
const WELLNESS_CATEGORIES = [
  {
    id: 'solar_term',
    title: '节气养生',
    description: '顺应二十四节气，调养身心',
    icon: Sun,
    colorKey: 'success' as const,
  },
  {
    id: 'time',
    title: '时辰养生',
    description: '十二时辰经络养生法',
    icon: Clock,
    colorKey: 'primary' as const,
  },
  {
    id: 'diet',
    title: '饮食养生',
    description: '食疗养生，药食同源',
    icon: Utensils,
    colorKey: 'warning' as const,
  },
  {
    id: 'emotion',
    title: '情志养生',
    description: '调节情绪，养心安神',
    icon: Heart,
    colorKey: 'accent' as const,
  },
];

// 今日养生建议
const DAILY_TIPS = [
  {
    id: '1',
    title: '大雪节气养生要点',
    content: '大雪时节，宜养藏精气，温补为主。多吃温热食物如羊肉、桂圆，注意保暖防寒。',
    category: 'solar_term',
  },
  {
    id: '2',
    title: '辰时养胃',
    content: '辰时（7:00-9:00）胃经当令，是吃早餐的最佳时间。早餐宜温热、易消化。',
    category: 'time',
  },
  {
    id: '3',
    title: '冬季饮食原则',
    content: '冬季饮食宜"减咸增苦"，多吃苦味食物如苦瓜、莴笋，少吃过咸食物。',
    category: 'diet',
  },
];

const WellnessGuideScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo | null>(null);

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const accentColor = theme.accent?.val;
  const color12 = theme.color12?.val;

  const colorMap = {
    primary: primaryColor,
    success: successColor,
    warning: warningColor,
    accent: accentColor,
  };

  useEffect(() => {
    const info = getCalendarInfo(new Date());
    setCalendarInfo(info);
  }, []);

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View
        paddingTop={insets.top}
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$4"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', left: 16 }}
          >
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$6" fontWeight="600" color="$color12">
            养生科普
          </Text>
        </XStack>
      </View>

      <ScrollView>
        <YStack padding="$2.5" gap="$3">
          {/* 今日养生卡片 */}
          {calendarInfo && (
            <View
              backgroundColor="$primary"
              borderRadius="$5"
              padding="$3"
            >
              <YStack gap="$2">
                <XStack gap="$2" alignItems="center">
                  <Leaf size={20} color="white" />
                  <Text fontSize="$5" fontWeight="600" color="white">
                    今日养生
                  </Text>
                </XStack>

                <XStack gap="$3">
                  <YStack gap="$0.5">
                    <Text fontSize="$3" color="white" opacity={0.8}>
                      节气
                    </Text>
                    <Text fontSize="$5" fontWeight="600" color="white">
                      {calendarInfo.solarTerm.name}
                    </Text>
                  </YStack>
                  <View width={1} backgroundColor="rgba(255,255,255,0.3)" />
                  <YStack gap="$0.5">
                    <Text fontSize="$3" color="white" opacity={0.8}>
                      时辰
                    </Text>
                    <Text fontSize="$5" fontWeight="600" color="white">
                      {calendarInfo.chineseHour.name}
                    </Text>
                  </YStack>
                  <View width={1} backgroundColor="rgba(255,255,255,0.3)" />
                  <YStack gap="$0.5" flex={1}>
                    <Text fontSize="$3" color="white" opacity={0.8}>
                      经络
                    </Text>
                    <Text fontSize="$5" fontWeight="600" color="white">
                      {calendarInfo.chineseHour.organ}经
                    </Text>
                  </YStack>
                </XStack>

                <View
                  backgroundColor="rgba(255,255,255,0.2)"
                  borderRadius="$3"
                  padding="$2"
                >
                  <Text fontSize="$3" color="white" lineHeight={20}>
                    {calendarInfo.solarTerm.tip}
                  </Text>
                </View>
              </YStack>
            </View>
          )}

          {/* 养生分类 */}
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              养生知识
            </Text>
            <YStack gap="$2">
              {WELLNESS_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const color = colorMap[category.colorKey];

                return (
                  <Pressable
                    key={category.id}
                    onPress={() => {
                      // TODO: 跳转到具体分类页面
                    }}
                  >
                    <View
                      backgroundColor="$color2"
                      borderRadius="$5"
                      borderWidth={1}
                      borderColor="$color5"
                      padding="$2"
                    >
                      <XStack gap="$3" alignItems="center">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${color}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={24} color={color} />
                        </View>
                        <YStack flex={1} gap="$0.5">
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            {category.title}
                          </Text>
                          <Text fontSize="$3" color="$color10">
                            {category.description}
                          </Text>
                        </YStack>
                        <ChevronRight size={20} color={theme.color10?.val} />
                      </XStack>
                    </View>
                  </Pressable>
                );
              })}
            </YStack>
          </YStack>

          {/* 今日养生建议 */}
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              今日养生建议
            </Text>
            <YStack gap="$2">
              {DAILY_TIPS.map((tip) => {
                const category = WELLNESS_CATEGORIES.find(c => c.id === tip.category);
                const color = category ? colorMap[category.colorKey] : primaryColor;

                return (
                  <View
                    key={tip.id}
                    backgroundColor="$color2"
                    borderRadius="$5"
                    borderWidth={1}
                    borderColor="$color5"
                    borderLeftWidth={3}
                    borderLeftColor={color}
                    padding="$2"
                  >
                    <YStack gap="$1">
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        {tip.title}
                      </Text>
                      <Text fontSize="$3" color="$color10" lineHeight={20}>
                        {tip.content}
                      </Text>
                    </YStack>
                  </View>
                );
              })}
            </YStack>
          </YStack>

          {/* 占位提示 */}
          <View
            backgroundColor="$color3"
            borderRadius="$5"
            padding="$4"
            alignItems="center"
          >
            <Text fontSize="$4" color="$color10" textAlign="center">
              更多养生内容正在整理中...
            </Text>
          </View>

          {/* 底部间距 */}
          <View height="$4" />
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default WellnessGuideScreen;
