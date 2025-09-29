import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  Theme,
  Progress,
} from 'tamagui';
import { Pressable } from 'react-native';
import {
  Camera,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export const NutritionPlanner: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState('早餐');

  const mealTabs = ['早餐', '午餐', '晚餐'];

  const mealData = {
    '早餐': {
      title: '营养早餐',
      calories: 320,
      status: 'completed',
      foods: [
        '• 燕麦粥',
        '• 水煮蛋',
        '• 牛奶',
        '• 香蕉'
      ],
      nutrition: {
        protein: { amount: 18, unit: 'g' },
        carbs: { amount: 45, unit: 'g' },
        fat: { amount: 8, unit: 'g' },
        fiber: { amount: 6, unit: 'g' }
      }
    },
    '午餐': {
      title: '均衡午餐',
      calories: 450,
      status: 'pending',
      foods: [
        '• 鸡胸肉',
        '• 糙米饭',
        '• 西兰花',
        '• 紫菜蛋花汤'
      ],
      nutrition: {
        protein: { amount: 32, unit: 'g' },
        carbs: { amount: 52, unit: 'g' },
        fat: { amount: 12, unit: 'g' },
        fiber: { amount: 8, unit: 'g' }
      }
    },
    '晚餐': {
      title: '轻食晚餐',
      calories: 380,
      status: 'pending',
      foods: [
        '• 三文鱼',
        '• 蔬菜沙拉',
        '• 红薯',
        '• 酸奶'
      ],
      nutrition: {
        protein: { amount: 28, unit: 'g' },
        carbs: { amount: 35, unit: 'g' },
        fat: { amount: 15, unit: 'g' },
        fiber: { amount: 9, unit: 'g' }
      }
    }
  };

  const dailyGoals = [
    { name: '热量', current: 800, target: 1800, unit: 'kcal' },
    { name: '蛋白质', current: 50, target: 80, unit: 'g' },
    { name: '水分', current: 1200, target: 2000, unit: 'ml' },
    { name: '纤维', current: 14, target: 25, unit: 'g' }
  ];

  const aiSuggestions = [
    {
      type: 'increase',
      icon: TrendingUp,
      color: COLORS.success,
      title: '增加',
      content: '深色蔬菜',
      description: '补充维生素A和叶酸'
    },
    {
      type: 'decrease',
      icon: TrendingDown,
      color: COLORS.error,
      title: '减少',
      content: '精制糖',
      description: '控制血糖波动'
    },
    {
      type: 'attention',
      icon: AlertTriangle,
      color: COLORS.warning,
      title: '注意',
      content: '饮水量',
      description: '当前摄入不足'
    }
  ];

  const currentMeal = mealData[selectedMeal];

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
        <YStack space="$4">
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <H3 fontSize="$6" color="$text" fontWeight="600">
              AI营养师
            </H3>
            <Pressable>
              <View
                backgroundColor={COLORS.primaryLight}
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
              >
                <XStack space="$2" alignItems="center">
                  <Camera size={16} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    拍照识别
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>

          {/* Meal Tabs */}
          <XStack backgroundColor="$surface" borderRadius="$3" padding="$1">
            {mealTabs.map((meal) => (
              <Pressable
                key={meal}
                onPress={() => setSelectedMeal(meal)}
                style={{ flex: 1 }}
              >
                <View
                  backgroundColor={selectedMeal === meal ? COLORS.primary : 'transparent'}
                  borderRadius="$3"
                  paddingVertical="$2"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    fontSize="$3"
                    color={selectedMeal === meal ? 'white' : '$textSecondary'}
                    fontWeight={selectedMeal === meal ? '600' : '400'}
                  >
                    {meal}
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>

          {/* Meal Card */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <YStack space="$3">
              {/* Meal Header */}
              <XStack justifyContent="space-between" alignItems="center">
                <H3 fontSize="$5" color="$text" fontWeight="600">
                  {currentMeal.title}
                </H3>
                <XStack space="$3" alignItems="center">
                  <Text fontSize="$4" color="$text" fontWeight="600">
                    {currentMeal.calories} kcal
                  </Text>
                  {currentMeal.status === 'completed' && (
                    <XStack space="$1" alignItems="center">
                      <CheckCircle size={16} color={COLORS.success} />
                      <Text fontSize="$3" color={COLORS.success} fontWeight="500">
                        已完成
                      </Text>
                    </XStack>
                  )}
                </XStack>
              </XStack>

              {/* Food List */}
              <View>
                <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$2">
                  食物清单
                </Text>
                <YStack space="$1">
                  {currentMeal.foods.map((food, index) => (
                    <Text key={index} fontSize="$3" color="$textSecondary">
                      {food}
                    </Text>
                  ))}
                </YStack>
              </View>

              {/* Nutrition Facts */}
              <View>
                <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
                  营养成分
                </Text>
                <XStack space="$3">
                  <YStack flex={1} space="$2">
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="$3" color="$textSecondary">蛋白质</Text>
                      <Text fontSize="$3" color="$text" fontWeight="600">
                        {currentMeal.nutrition.protein.amount}{currentMeal.nutrition.protein.unit}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="$3" color="$textSecondary">脂肪</Text>
                      <Text fontSize="$3" color="$text" fontWeight="600">
                        {currentMeal.nutrition.fat.amount}{currentMeal.nutrition.fat.unit}
                      </Text>
                    </XStack>
                  </YStack>
                  <YStack flex={1} space="$2">
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="$3" color="$textSecondary">碳水化合物</Text>
                      <Text fontSize="$3" color="$text" fontWeight="600">
                        {currentMeal.nutrition.carbs.amount}{currentMeal.nutrition.carbs.unit}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="$3" color="$textSecondary">膳食纤维</Text>
                      <Text fontSize="$3" color="$text" fontWeight="600">
                        {currentMeal.nutrition.fiber.amount}{currentMeal.nutrition.fiber.unit}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>
              </View>
            </YStack>
          </Card>

          {/* Daily Goals */}
          <View>
            <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
              今日营养目标
            </Text>
            <YStack space="$3">
              {dailyGoals.map((goal, index) => {
                const percentage = Math.min((goal.current / goal.target) * 100, 100);
                return (
                  <View key={index}>
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <Text fontSize="$3" color="$textSecondary">
                        {goal.name}
                      </Text>
                      <Text fontSize="$3" color="$text" fontWeight="500">
                        {goal.current}/{goal.target} {goal.unit}
                      </Text>
                    </XStack>
                    <Progress
                      value={percentage}
                      backgroundColor="$borderLight"
                      height={8}
                      borderRadius="$2"
                    >
                      <Progress.Indicator
                        backgroundColor={percentage >= 80 ? COLORS.success : percentage >= 50 ? COLORS.warning : COLORS.primary}
                        animation="bouncy"
                      />
                    </Progress>
                  </View>
                );
              })}
            </YStack>
          </View>

          {/* AI Suggestions */}
          <View>
            <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
              AI营养建议
            </Text>
            <YStack space="$3">
              {aiSuggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <XStack key={index} space="$3" alignItems="center">
                    <View
                      width={32}
                      height={32}
                      borderRadius={16}
                      backgroundColor={`${suggestion.color}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <IconComponent size={16} color={suggestion.color} />
                    </View>
                    <YStack flex={1}>
                      <XStack space="$2" alignItems="center" marginBottom="$1">
                        <Text fontSize="$3" color={suggestion.color} fontWeight="600">
                          {suggestion.title}
                        </Text>
                        <Text fontSize="$3" color="$text" fontWeight="600">
                          {suggestion.content}
                        </Text>
                      </XStack>
                      <Text fontSize="$3" color="$textSecondary">
                        {suggestion.description}
                      </Text>
                    </YStack>
                  </XStack>
                );
              })}
            </YStack>
          </View>
        </YStack>
      </Card>
    </Theme>
  );
};