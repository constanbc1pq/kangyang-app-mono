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
  Progress,
  ScrollView,
} from 'tamagui';
import { Plus, Target, Utensils, TrendingUp, Calendar, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export const NutritionPlanner: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('今天');

  const nutritionGoals = {
    calories: { current: 1680, target: 2000, unit: 'kcal' },
    protein: { current: 85, target: 120, unit: 'g' },
    carbs: { current: 180, target: 250, unit: 'g' },
    fat: { current: 65, target: 80, unit: 'g' },
  };

  const mealPlan = [
    {
      time: '07:30',
      meal: '早餐',
      foods: ['燕麦粥', '香蕉', '核桃'],
      calories: 420,
      status: 'completed',
    },
    {
      time: '12:00',
      meal: '午餐',
      foods: ['鸡胸肉沙拉', '糙米饭', '蒸蛋'],
      calories: 650,
      status: 'completed',
    },
    {
      time: '15:30',
      meal: '下午茶',
      foods: ['苹果', '酸奶'],
      calories: 180,
      status: 'pending',
    },
    {
      time: '18:30',
      meal: '晚餐',
      foods: ['三文鱼', '蔬菜沙拉', '红薯'],
      calories: 580,
      status: 'pending',
    },
  ];

  const weeklyRecommendations = [
    {
      day: '周一',
      theme: '高蛋白日',
      description: '增强肌肉合成',
      color: COLORS.primary,
    },
    {
      day: '周二',
      theme: '抗氧化日',
      description: '蓝莓坚果搭配',
      color: COLORS.secondary,
    },
    {
      day: '周三',
      theme: '膳食纤维日',
      description: '促进肠道健康',
      color: COLORS.accent,
    },
    {
      day: '周四',
      theme: '低GI日',
      description: '稳定血糖水平',
      color: COLORS.success,
    },
  ];

  const renderNutritionProgress = (label: string, data: { current: number; target: number; unit: string }) => {
    const percentage = (data.current / data.target) * 100;
    return (
      <View
        padding="$3"
        borderRadius="$3"
        backgroundColor="$surface"
        borderWidth={1}
        borderColor="$borderColor"
        flex={1}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <Text fontSize="$3" color="$textSecondary" fontWeight="500">
            {label}
          </Text>
          <Text fontSize="$2" color="$textSecondary">
            {data.current}/{data.target} {data.unit}
          </Text>
        </XStack>
        <Progress
          value={percentage}
          backgroundColor="$background"
          marginBottom="$2"
        >
          <Progress.Indicator
            backgroundColor={percentage >= 100 ? COLORS.success : COLORS.primary}
            animation="bouncy"
          />
        </Progress>
        <Text fontSize="$2" color={percentage >= 100 ? COLORS.success : COLORS.textSecondary}>
          {percentage.toFixed(0)}% 完成
        </Text>
      </View>
    );
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
            营养计划
          </H3>
          <XStack space="$2">
            <Button size="$3" backgroundColor="$primary">
              <XStack space="$1" alignItems="center">
                <Target size={16} color="white" />
                <Text fontSize="$3" color="white">目标</Text>
              </XStack>
            </Button>
            <Button size="$3" variant="outlined" borderColor="$borderColor">
              <Plus size={16} color={COLORS.textSecondary} />
            </Button>
          </XStack>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$4">
            {/* 每日营养目标 */}
            <View>
              <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
                今日营养摄入
              </Text>
              <XStack space="$2" marginBottom="$3">
                {renderNutritionProgress('热量', nutritionGoals.calories)}
                {renderNutritionProgress('蛋白质', nutritionGoals.protein)}
              </XStack>
              <XStack space="$2">
                {renderNutritionProgress('碳水', nutritionGoals.carbs)}
                {renderNutritionProgress('脂肪', nutritionGoals.fat)}
              </XStack>
            </View>

            {/* 今日用餐计划 */}
            <View>
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  用餐计划
                </Text>
                <XStack space="$1" backgroundColor="$surface" borderRadius="$3" padding="$1">
                  {['昨天', '今天', '明天'].map((day) => (
                    <Button
                      key={day}
                      size="$2"
                      backgroundColor={selectedDay === day ? '$primary' : 'transparent'}
                      onPress={() => setSelectedDay(day)}
                      paddingHorizontal="$3"
                    >
                      <Text
                        fontSize="$2"
                        color={selectedDay === day ? 'white' : '$textSecondary'}
                        fontWeight={selectedDay === day ? '600' : '400'}
                      >
                        {day}
                      </Text>
                    </Button>
                  ))}
                </XStack>
              </XStack>

              <YStack space="$3">
                {mealPlan.map((meal, index) => (
                  <View
                    key={index}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <XStack space="$2" alignItems="center">
                        <View
                          width={8}
                          height={8}
                          borderRadius={4}
                          backgroundColor={meal.status === 'completed' ? COLORS.success : COLORS.warning}
                        />
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {meal.meal}
                        </Text>
                        <XStack space="$1" alignItems="center">
                          <Clock size={12} color={COLORS.textSecondary} />
                          <Text fontSize="$3" color="$textSecondary">
                            {meal.time}
                          </Text>
                        </XStack>
                      </XStack>
                      <Text fontSize="$3" color="$textSecondary" fontWeight="600">
                        {meal.calories} kcal
                      </Text>
                    </XStack>
                    <XStack space="$2" flexWrap="wrap">
                      {meal.foods.map((food, foodIndex) => (
                        <View
                          key={foodIndex}
                          backgroundColor="$background"
                          borderRadius="$2"
                          paddingVertical="$1"
                          paddingHorizontal="$2"
                          marginBottom="$1"
                        >
                          <Text fontSize="$2" color="$textSecondary">
                            {food}
                          </Text>
                        </View>
                      ))}
                    </XStack>
                  </View>
                ))}
              </YStack>
            </View>

            {/* AI 营养建议 */}
            <View
              padding="$4"
              borderRadius="$3"
              backgroundColor="$surface"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack space="$2" alignItems="center" marginBottom="$3">
                <TrendingUp size={16} color={COLORS.primary} />
                <Text fontSize="$4" color="$text" fontWeight="600">
                  AI 营养建议
                </Text>
              </XStack>
              <Text fontSize="$3" color="$textSecondary" lineHeight="$1" marginBottom="$3">
                根据您的健康数据分析，建议今天增加优质蛋白质摄入，可以选择鱼类、瘦肉或豆制品。同时注意补充维生素C，推荐猕猴桃或橙子。
              </Text>
              <Button size="$3" backgroundColor="$primary">
                <Text fontSize="$3" color="white">查看详细建议</Text>
              </Button>
            </View>

            {/* 本周营养主题 */}
            <View>
              <XStack space="$2" alignItems="center" marginBottom="$3">
                <Calendar size={16} color={COLORS.accent} />
                <Text fontSize="$4" color="$text" fontWeight="600">
                  本周营养主题
                </Text>
              </XStack>
              <XStack space="$3" flexWrap="wrap">
                {weeklyRecommendations.map((rec, index) => (
                  <View
                    key={index}
                    flex={1}
                    minWidth="45%"
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor={rec.color}
                    marginBottom="$2"
                  >
                    <Text fontSize="$3" color="white" fontWeight="600" marginBottom="$1">
                      {rec.day}
                    </Text>
                    <Text fontSize="$2" color="white" fontWeight="500" marginBottom="$1">
                      {rec.theme}
                    </Text>
                    <Text fontSize="$1" color="white" opacity={0.9}>
                      {rec.description}
                    </Text>
                  </View>
                ))}
              </XStack>
            </View>
          </YStack>
        </ScrollView>
      </Card>
    </Theme>
  );
};