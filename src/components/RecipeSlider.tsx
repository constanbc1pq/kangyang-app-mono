/**
 * 推荐食谱轮播组件
 * 5秒自动播放，支持手动滑动
 * 点击跳转营养配餐页面
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Clock, Flame, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40; // padding 20*2
const AUTO_PLAY_INTERVAL = 5000; // 5秒自动播放

export interface SliderRecipe {
  id: string;
  name: string;
  image: ImageSourcePropType;
  cookingTime: number;
  calories: number;
  mealPlanId: string;
  mealPlanName: string;
  tags: string[];
}

interface RecipeSliderProps {
  recipes: SliderRecipe[];
  onRecipePress?: (recipe: SliderRecipe) => void;
}

export const RecipeSlider: React.FC<RecipeSliderProps> = ({
  recipes,
  onRecipePress,
}) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const accentColor = theme.accent?.val;

  // 套餐颜色映射
  const getMealPlanColor = (mealPlanId: string): string | undefined => {
    const colorMap: Record<string, string | undefined> = {
      balanced: primaryColor,
      elderly: successColor,
      'weight-loss': warningColor,
      premium: accentColor,
    };
    return colorMap[mealPlanId] || primaryColor;
  };

  // 自动播放
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    if (recipes.length <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      if (isAutoPlaying) {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % recipes.length;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }
    }, AUTO_PLAY_INTERVAL);
  }, [isAutoPlaying, recipes.length]);

  // 滚动到指定索引
  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
  };

  // 处理滚动结束
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / CARD_WIDTH);
    setCurrentIndex(newIndex);
  };

  // 处理手动滚动开始
  const handleScrollBegin = () => {
    setIsAutoPlaying(false);
  };

  // 处理手动滚动结束后恢复自动播放
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollEnd(event);
    // 延迟恢复自动播放
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 1000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [startAutoPlay]);

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <YStack gap="$2">
      {/* 标题栏 */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" color="$color12" fontWeight="600">
          今日推荐
        </Text>
        <View
          backgroundColor={`${primaryColor}15`}
          paddingHorizontal="$1.5"
          paddingVertical="$0.5"
          borderRadius="$10"
        >
          <Text fontSize="$2" color="$primary" fontWeight="500">
            AI精选
          </Text>
        </View>
      </XStack>

      {/* 轮播区域 */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
        contentContainerStyle={{ paddingRight: 0 }}
      >
        {recipes.map((recipe) => {
          const planColor = getMealPlanColor(recipe.mealPlanId);

          return (
            <Pressable
              key={recipe.id}
              onPress={() => onRecipePress?.(recipe)}
              style={{ width: CARD_WIDTH }}
            >
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                overflow="hidden"
                marginRight="$2"
              >
                {/* 图片区域 */}
                <View height={140} position="relative">
                  <Image
                    source={recipe.image}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                  {/* 套餐标签 */}
                  <View
                    position="absolute"
                    top={8}
                    left={8}
                    backgroundColor={planColor}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$10"
                  >
                    <Text fontSize="$2" color="white" fontWeight="600">
                      {recipe.mealPlanName}
                    </Text>
                  </View>
                </View>

                {/* 信息区域 */}
                <View padding="$2">
                  <XStack justifyContent="space-between" alignItems="flex-start">
                    <YStack flex={1} gap="$1">
                      <Text
                        fontSize="$4"
                        fontWeight="600"
                        color="$color12"
                        numberOfLines={1}
                      >
                        {recipe.name}
                      </Text>

                      {/* 标签 */}
                      <XStack gap="$1" flexWrap="wrap">
                        {recipe.tags.slice(0, 3).map((tag, tagIndex) => (
                          <View
                            key={tagIndex}
                            backgroundColor="$color3"
                            paddingHorizontal="$1.5"
                            paddingVertical="$0.5"
                            borderRadius="$2"
                          >
                            <Text fontSize={10} color="$color10">
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </XStack>

                      {/* 时间和热量 */}
                      <XStack gap="$3" marginTop="$0.5">
                        <XStack gap="$1" alignItems="center">
                          <Clock size={12} color={theme.color10?.val} />
                          <Text fontSize="$2" color="$color10">
                            {recipe.cookingTime}分钟
                          </Text>
                        </XStack>
                        <XStack gap="$1" alignItems="center">
                          <Flame size={12} color={theme.color10?.val} />
                          <Text fontSize="$2" color="$color10">
                            {recipe.calories}千卡
                          </Text>
                        </XStack>
                      </XStack>
                    </YStack>

                    {/* 进入按钮 */}
                    <View
                      backgroundColor={planColor}
                      width={32}
                      height={32}
                      borderRadius={16}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <ChevronRight size={18} color="white" />
                    </View>
                  </XStack>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 分页指示器 */}
      {recipes.length > 1 && (
        <XStack justifyContent="center" gap="$1">
          {recipes.map((_, index) => (
            <View
              key={index}
              width={index === currentIndex ? 16 : 6}
              height={6}
              borderRadius={3}
              backgroundColor={index === currentIndex ? '$primary' : '$color5'}
            />
          ))}
        </XStack>
      )}
    </YStack>
  );
};

export default RecipeSlider;
