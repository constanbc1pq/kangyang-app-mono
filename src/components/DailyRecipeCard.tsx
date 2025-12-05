/**
 * DailyRecipeCard - 今日推荐菜谱卡片组件
 *
 * 功能：
 * - 菜谱图片+名称
 * - 营养标签
 * - 推荐理由 (会员专属)
 * - 食材购买入口 (显示折扣)
 */

import React from 'react';
import { Pressable, Image } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  View,
  useTheme,
} from 'tamagui';
import { Clock, Flame, ShoppingCart, Sparkles, ChevronRight } from 'lucide-react-native';
import { Recipe, calculateIngredientsPrice } from '@/services/recipeRecommendService';
import { MembershipLevel } from '@/types/membership';

interface DailyRecipeCardProps {
  recipe: Recipe;
  membershipLevel: MembershipLevel;
  showDiscount?: boolean;
  onPress?: () => void;
  onBuyIngredients?: () => void;
}

const DIFFICULTY_LABELS = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const DailyRecipeCard: React.FC<DailyRecipeCardProps> = ({
  recipe,
  membershipLevel,
  showDiscount = false,
  onPress,
  onBuyIngredients,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const accentColor = theme.accent?.val;
  const color10 = theme.color10?.val;

  // 难度标签颜色映射
  const difficultyColors = {
    easy: successColor,
    medium: warningColor,
    hard: errorColor,
  };

  const hasAIFeatures = membershipLevel !== MembershipLevel.FREE;
  const { originalPrice, discountPrice } = calculateIngredientsPrice(
    recipe.ingredients,
    showDiscount
  );
  const hasDiscount = showDiscount && discountPrice < originalPrice;

  return (
    <Pressable onPress={onPress}>
      <View
        borderRadius="$5"
        backgroundColor="$color1"
        overflow="hidden"
        borderWidth={1}
        borderColor="$color5"
      >
        {/* 菜谱图片 */}
        <View height={160} position="relative">
          <Image
            source={{ uri: recipe.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* 难度标签 */}
          <View
            position="absolute"
            top={12}
            left={12}
            backgroundColor={difficultyColors[recipe.difficulty]}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <Text fontSize="$2" color="white" fontWeight="600">
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </Text>
          </View>
          {/* 烹饪时间 */}
          <View
            position="absolute"
            top={12}
            right={12}
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <XStack alignItems="center" gap="$1">
              <Clock size={12} color="white" />
              <Text fontSize="$2" color="white">
                {recipe.cookingTime}分钟
              </Text>
            </XStack>
          </View>
        </View>

        <YStack padding="$2" gap="$1.5">
          {/* 菜谱名称和卡路里 */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$color12">
              {recipe.name}
            </Text>
            <XStack alignItems="center" gap="$0.5">
              <Flame size={14} color={warningColor} />
              <Text fontSize="$3" color="$color10">
                {recipe.calories}卡
              </Text>
            </XStack>
          </XStack>

          {/* 描述 */}
          <Text fontSize="$3" color="$color10" numberOfLines={2}>
            {recipe.description}
          </Text>

          {/* 营养标签 */}
          <XStack flexWrap="wrap" gap="$1" marginTop="$0.5">
            {recipe.tags.slice(0, 4).map((tag, index) => (
              <View
                key={index}
                backgroundColor={`${primaryColor}15`}
                paddingHorizontal="$1.5"
                paddingVertical="$0.75"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$primary">
                  {tag}
                </Text>
              </View>
            ))}
          </XStack>

          {/* AI推荐理由 (会员专属) */}
          {hasAIFeatures && recipe.recommendReason && (
            <View
              backgroundColor={`${accentColor}10`}
              padding="$2"
              borderRadius="$4"
              borderLeftWidth={3}
              borderLeftColor="$accent"
              marginTop="$1"
            >
              <XStack alignItems="flex-start" gap="$1.5">
                <Sparkles size={16} color={accentColor} style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize="$2" fontWeight="600" color="$accent" marginBottom="$0.5">
                    AI推荐理由
                  </Text>
                  <Text fontSize="$3" color="$color12">
                    {recipe.recommendReason}
                  </Text>
                </YStack>
              </XStack>
            </View>
          )}

          {/* AI营养分析 (白金及以上) */}
          {recipe.aiAnalysis && (
            <View
              backgroundColor={`${successColor}10`}
              padding="$1.5"
              borderRadius="$3"
            >
              <Text fontSize="$2" color="$success">
                营养分析：{recipe.aiAnalysis}
              </Text>
            </View>
          )}

          {/* 家庭份量 (钻石会员) */}
          {recipe.familyServings && (
            <Text fontSize="$2" color="$color10">
              推荐份量：{recipe.familyServings}人份
            </Text>
          )}

          {/* 食材购买入口 */}
          <Pressable onPress={onBuyIngredients}>
            <View
              backgroundColor="$color3"
              padding="$2"
              borderRadius="$4"
              marginTop="$1"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap="$1.5">
                  <ShoppingCart size={18} color={primaryColor} />
                  <YStack>
                    <Text fontSize="$3" fontWeight="500" color="$color12">
                      一键购买食材
                    </Text>
                    <XStack alignItems="center" gap="$1.5">
                      {hasDiscount ? (
                        <>
                          <Text
                            fontSize="$2"
                            color="$color10"
                            textDecorationLine="line-through"
                          >
                            ¥{originalPrice}
                          </Text>
                          <Text fontSize="$3" fontWeight="bold" color="$primary">
                            ¥{discountPrice}
                          </Text>
                          <View
                            backgroundColor="$error"
                            paddingHorizontal="$1"
                            paddingVertical="$0.25"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" color="white" fontWeight="600">
                              会员价
                            </Text>
                          </View>
                        </>
                      ) : (
                        <Text fontSize="$3" color="$color10">
                          约¥{originalPrice}
                        </Text>
                      )}
                    </XStack>
                  </YStack>
                </XStack>
                <ChevronRight size={18} color={color10} />
              </XStack>
            </View>
          </Pressable>
        </YStack>
      </View>
    </Pressable>
  );
};

/**
 * 升级引导卡片 - 免费用户看到的升级提示
 */
export const UpgradePromptCard: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  return (
    <Pressable onPress={onUpgrade}>
      <View
        borderRadius="$5"
        padding="$2"
        backgroundColor={`${primaryColor}10`}
        borderWidth={1}
        borderColor="$primary"
        borderStyle="dashed"
      >
        <XStack alignItems="center" gap="$2">
          <View
            width="$4.5"
            height="$4.5"
            borderRadius="$12"
            backgroundColor={`${primaryColor}20`}
            justifyContent="center"
            alignItems="center"
          >
            <Sparkles size={24} color={primaryColor} />
          </View>
          <YStack flex={1}>
            <Text fontSize="$4" fontWeight="600" color="$color12">
              升级会员，解锁更多菜谱
            </Text>
            <Text fontSize="$3" color="$color10">
              获取AI个性化推荐、营养分析、食材折扣
            </Text>
          </YStack>
          <ChevronRight size={20} color={primaryColor} />
        </XStack>
      </View>
    </Pressable>
  );
};

export default DailyRecipeCard;
