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
  ScrollView,
} from 'tamagui';
import { ChevronLeft, ChevronRight, Calendar, Sun, Leaf, Snowflake, Flower2, Star } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export const WellnessCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const seasons = {
    spring: { name: '春季', icon: Flower2, color: COLORS.success },
    summer: { name: '夏季', icon: Sun, color: COLORS.warning },
    autumn: { name: '秋季', icon: Leaf, color: COLORS.accent },
    winter: { name: '冬季', icon: Snowflake, color: COLORS.secondary },
  };

  const getCurrentSeason = () => {
    const month = currentDate.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const currentSeason = getCurrentSeason();
  const SeasonIcon = seasons[currentSeason].icon;

  const seasonalEvents = [
    {
      date: '今天',
      title: '春季养肝黄金期',
      description: '适合喝绿茶、做拉伸运动',
      category: 'wellness',
      color: COLORS.success,
    },
    {
      date: '明天',
      title: '春季排毒日',
      description: '建议多吃绿叶蔬菜和柠檬水',
      category: 'nutrition',
      color: COLORS.primary,
    },
    {
      date: '3月22日',
      title: '春分节气',
      description: '调节作息，保持阴阳平衡',
      category: 'traditional',
      color: COLORS.accent,
    },
    {
      date: '3月25日',
      title: '户外踏青日',
      description: '适合进行户外有氧运动',
      category: 'exercise',
      color: COLORS.secondary,
    },
  ];

  const dailyTips = [
    {
      time: '06:00',
      title: '晨起养生',
      content: '喝一杯温开水，做5分钟拉伸',
      completed: true,
    },
    {
      time: '09:00',
      title: '上午茶饮',
      content: '绿茶或花茶，配合深呼吸',
      completed: true,
    },
    {
      time: '12:00',
      title: '午餐时光',
      content: '细嚼慢咽，七分饱即可',
      completed: false,
    },
    {
      time: '15:00',
      title: '下午活动',
      content: '10分钟散步或颈部运动',
      completed: false,
    },
    {
      time: '18:00',
      title: '晚餐建议',
      content: '清淡饮食，多吃蔬菜少油腻',
      completed: false,
    },
    {
      time: '21:00',
      title: '睡前准备',
      content: '泡脚15分钟，冥想5分钟',
      completed: false,
    },
  ];

  const wellnessActivities = [
    {
      title: '春季瑜伽',
      duration: '30分钟',
      difficulty: '初级',
      type: 'exercise',
      participants: 28,
    },
    {
      title: '传统茶艺',
      duration: '45分钟',
      difficulty: '中级',
      type: 'culture',
      participants: 15,
    },
    {
      title: '养生药膳',
      duration: '60分钟',
      difficulty: '初级',
      type: 'nutrition',
      participants: 32,
    },
    {
      title: '太极养生',
      duration: '40分钟',
      difficulty: '入门',
      type: 'exercise',
      participants: 45,
    },
  ];

  const getDateString = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
    });
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
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <H3 fontSize="$6" color="$text" fontWeight="600">
            养生日历
          </H3>
          <XStack space="$2" alignItems="center">
            <SeasonIcon size={20} color={seasons[currentSeason].color} />
            <Text fontSize="$3" color={seasons[currentSeason].color} fontWeight="600">
              {seasons[currentSeason].name}
            </Text>
          </XStack>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$4">
            {/* 季节性养生事件 */}
            <View>
              <XStack space="$2" alignItems="center" marginBottom="$3">
                <Calendar size={16} color={COLORS.primary} />
                <Text fontSize="$4" color="$text" fontWeight="600">
                  季节性养生
                </Text>
              </XStack>
              <YStack space="$3">
                {seasonalEvents.map((event, index) => (
                  <View
                    key={index}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderLeftWidth={4}
                    borderLeftColor={event.color}
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <Text fontSize="$3" color={event.color} fontWeight="600">
                        {event.date}
                      </Text>
                      <View
                        backgroundColor={event.color}
                        borderRadius="$2"
                        paddingVertical="$1"
                        paddingHorizontal="$2"
                      >
                        <Text fontSize="$1" color="white" fontWeight="500">
                          {event.category === 'wellness' ? '养生' :
                           event.category === 'nutrition' ? '营养' :
                           event.category === 'traditional' ? '节气' : '运动'}
                        </Text>
                      </View>
                    </XStack>
                    <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$1">
                      {event.title}
                    </Text>
                    <Text fontSize="$3" color="$textSecondary" lineHeight="$1">
                      {event.description}
                    </Text>
                  </View>
                ))}
              </YStack>
            </View>

            {/* 今日养生提醒 */}
            <View>
              <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
                今日养生提醒
              </Text>
              <YStack space="$2">
                {dailyTips.map((tip, index) => (
                  <View
                    key={index}
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                    opacity={tip.completed ? 0.6 : 1}
                  >
                    <XStack space="$3" alignItems="center">
                      <View
                        width={12}
                        height={12}
                        borderRadius={6}
                        backgroundColor={tip.completed ? COLORS.success : COLORS.warning}
                      />
                      <YStack flex={1}>
                        <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
                          <Text fontSize="$3" color="$text" fontWeight="600">
                            {tip.title}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            {tip.time}
                          </Text>
                        </XStack>
                        <Text fontSize="$3" color="$textSecondary" lineHeight="$1">
                          {tip.content}
                        </Text>
                      </YStack>
                    </XStack>
                  </View>
                ))}
              </YStack>
            </View>

            {/* 推荐养生活动 */}
            <View>
              <XStack space="$2" alignItems="center" marginBottom="$3">
                <Star size={16} color={COLORS.accent} />
                <Text fontSize="$4" color="$text" fontWeight="600">
                  推荐养生活动
                </Text>
              </XStack>
              <YStack space="$3">
                {wellnessActivities.map((activity, index) => (
                  <View
                    key={index}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <Text fontSize="$4" color="$text" fontWeight="600">
                        {activity.title}
                      </Text>
                      <Text fontSize="$3" color="$textSecondary">
                        {activity.participants} 人参与
                      </Text>
                    </XStack>
                    <XStack space="$4" alignItems="center" marginBottom="$3">
                      <XStack space="$1" alignItems="center">
                        <Text fontSize="$3" color="$textSecondary">
                          时长: {activity.duration}
                        </Text>
                      </XStack>
                      <XStack space="$1" alignItems="center">
                        <Text fontSize="$3" color="$textSecondary">
                          难度: {activity.difficulty}
                        </Text>
                      </XStack>
                    </XStack>
                    <Button size="$3" backgroundColor="$primary">
                      <Text fontSize="$3" color="white">立即参与</Text>
                    </Button>
                  </View>
                ))}
              </YStack>
            </View>

            {/* 月度养生计划 */}
            <View
              padding="$4"
              borderRadius="$3"
              backgroundColor="$surface"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  月度养生计划
                </Text>
                <XStack space="$2" alignItems="center">
                  <Button size="$2" chromeless>
                    <ChevronLeft size={16} color={COLORS.textSecondary} />
                  </Button>
                  <Text fontSize="$3" color="$text" fontWeight="500">
                    {getDateString(currentDate)}
                  </Text>
                  <Button size="$2" chromeless>
                    <ChevronRight size={16} color={COLORS.textSecondary} />
                  </Button>
                </XStack>
              </XStack>

              <YStack space="$2">
                <XStack space="$2" justifyContent="space-between">
                  <View
                    flex={1}
                    backgroundColor={COLORS.primary}
                    borderRadius="$2"
                    padding="$2"
                    alignItems="center"
                  >
                    <Text fontSize="$2" color="white" fontWeight="600">第1周</Text>
                    <Text fontSize="$1" color="white">肝脏排毒</Text>
                  </View>
                  <View
                    flex={1}
                    backgroundColor={COLORS.secondary}
                    borderRadius="$2"
                    padding="$2"
                    alignItems="center"
                  >
                    <Text fontSize="$2" color="white" fontWeight="600">第2周</Text>
                    <Text fontSize="$1" color="white">脾胃调理</Text>
                  </View>
                </XStack>
                <XStack space="$2" justifyContent="space-between">
                  <View
                    flex={1}
                    backgroundColor={COLORS.accent}
                    borderRadius="$2"
                    padding="$2"
                    alignItems="center"
                  >
                    <Text fontSize="$2" color="white" fontWeight="600">第3周</Text>
                    <Text fontSize="$1" color="white">心肺强化</Text>
                  </View>
                  <View
                    flex={1}
                    backgroundColor={COLORS.success}
                    borderRadius="$2"
                    padding="$2"
                    alignItems="center"
                  >
                    <Text fontSize="$2" color="white" fontWeight="600">第4周</Text>
                    <Text fontSize="$1" color="white">综合调养</Text>
                  </View>
                </XStack>
              </YStack>
            </View>
          </YStack>
        </ScrollView>
      </Card>
    </Theme>
  );
};