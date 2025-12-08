/**
 * 养生日历卡片组件
 * 显示公历、农历、节气、时辰信息
 * 点击跳转养生科普页面
 * 包含节气背景动画效果
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, LayoutChangeEvent, View as RNView } from 'react-native';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { getCalendarInfo, CalendarInfo } from '@/services/lunarCalendarService';
import { SolarTermIcon } from './SolarTermIcon';
import { SolarTermAnimation } from './SolarTermAnimation';

interface WellnessCalendarCardProps {
  onPress?: () => void;
}

export const WellnessCalendarCard: React.FC<WellnessCalendarCardProps> = ({
  onPress,
}) => {
  const theme = useTheme();
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  useEffect(() => {
    // 初始化日历信息
    updateCalendarInfo();

    // 每分钟更新时间
    const timer = setInterval(() => {
      updateCalendarInfo();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const updateCalendarInfo = () => {
    const info = getCalendarInfo(new Date());
    setCalendarInfo(info);
    setCurrentTime(info.currentTime);
  };

  // 获取卡片尺寸用于背景动画
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCardDimensions({ width, height });
  }, []);

  if (!calendarInfo) {
    return null;
  }

  const { gregorian, lunar, chineseHour, solarTerm } = calendarInfo;

  return (
    <Pressable onPress={onPress}>
      <RNView onLayout={handleLayout} style={{ overflow: 'hidden', borderRadius: 20 }}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          padding="$2"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.08}
          elevation={2}
        >
          {/* 节气背景动画层 */}
          {cardDimensions.width > 0 && cardDimensions.height > 0 && (
            <SolarTermAnimation
              solarTerm={solarTerm.name}
              width={cardDimensions.width}
              height={cardDimensions.height}
            />
          )}

          <XStack gap="$2" alignItems="stretch" zIndex={1}>
          {/* 左侧：日期大数字 */}
          <View
            backgroundColor={`${primaryColor}10`}
            borderRadius="$4"
            padding="$2"
            alignItems="center"
            justifyContent="center"
            minWidth={72}
          >
            <Text fontSize={36} fontWeight="700" color="$primary">
              {gregorian.day}
            </Text>
            <Text fontSize="$2" color="$primary" marginTop="$-1">
              {gregorian.year}.{gregorian.month.toString().padStart(2, '0')}
            </Text>
            <View
              backgroundColor="$primary"
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
              marginTop="$1"
            >
              <Text fontSize={10} color="white" fontWeight="600">
                周{gregorian.weekday}
              </Text>
            </View>
          </View>

          {/* 中间：农历和时辰信息 */}
          <YStack flex={1} gap="$1.5" justifyContent="center">
            {/* 农历日期 */}
            <XStack gap="$1.5" alignItems="center">
              <Calendar size={14} color={primaryColor} />
              <YStack>
                <Text fontSize="$2" color="$color12" fontWeight="500">
                  {lunar.monthStr}
                </Text>
                <Text fontSize="$2" color="$color10">
                  {lunar.dayStr}
                </Text>
              </YStack>
              <View
                backgroundColor={`${warningColor}15`}
                paddingHorizontal="$1.5"
                paddingVertical="$0.25"
                borderRadius="$2"
              >
                <Text fontSize={10} color="$warning" fontWeight="500">
                  {lunar.yearGanZhi}年 {lunar.zodiac}
                </Text>
              </View>
            </XStack>

            {/* 时辰 */}
            <XStack gap="$1.5" alignItems="center">
              <Clock size={14} color={primaryColor} />
              <Text fontSize="$3" color="$color12" fontWeight="500">
                {currentTime}
              </Text>
              <YStack>
                <Text fontSize="$2" color="$color12" fontWeight="500">
                  {chineseHour.name}
                </Text>
                <Text fontSize="$2" color="$color10">
                  {chineseHour.organ}经当令
                </Text>
              </YStack>
            </XStack>

            {/* 养生建议 */}
            <XStack
              backgroundColor={`${successColor}10`}
              paddingHorizontal="$1.5"
              paddingVertical="$1"
              borderRadius="$3"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="$2" color="$success" numberOfLines={1} flex={1}>
                {solarTerm.tip}
              </Text>
              <ChevronRight size={14} color={successColor} />
            </XStack>
          </YStack>

          {/* 右侧：节气动画图标 */}
          <YStack alignItems="center" justifyContent="center" gap="$1">
            <SolarTermIcon solarTerm={solarTerm.name} size={56} />
            <XStack alignItems="center" gap="$0.5">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {solarTerm.name}
              </Text>
              {solarTerm.isToday && (
                <View
                  backgroundColor="$success"
                  paddingHorizontal="$1"
                  paddingVertical="$0.25"
                  borderRadius="$2"
                >
                  <Text fontSize={8} color="white" fontWeight="500">
                    今日
                  </Text>
                </View>
              )}
            </XStack>
          </YStack>
          </XStack>
        </View>
      </RNView>
    </Pressable>
  );
};

export default WellnessCalendarCard;
