import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
} from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { SecondHandItem, ItemCondition } from '@/types/community';

interface SecondHandCardProps {
  item: SecondHandItem;
  onPress: (itemId: string) => void;
}

/**
 * 二手商品卡片组件（瀑布流风格）
 * 类似闲鱼的商品卡片
 */
export const SecondHandCard: React.FC<SecondHandCardProps> = ({ item, onPress }) => {
  // 获取成色标签
  const getConditionLabel = (condition: ItemCondition): string => {
    const labels: { [key in ItemCondition]: string } = {
      [ItemCondition.NEW]: '全新',
      [ItemCondition.LIKE_NEW]: '99成新',
      [ItemCondition.EXCELLENT]: '95成新',
      [ItemCondition.GOOD]: '9成新',
      [ItemCondition.FAIR]: '8成新',
      [ItemCondition.USED]: '使用痕迹',
    };
    return labels[condition];
  };

  // 获取成色颜色
  const getConditionColor = (condition: ItemCondition): string => {
    if (condition === ItemCondition.NEW || condition === ItemCondition.LIKE_NEW) {
      return COLORS.success;
    } else if (condition === ItemCondition.EXCELLENT || condition === ItemCondition.GOOD) {
      return COLORS.primary;
    } else {
      return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
      <Card
        padding="$0"
        borderRadius="$4"
        backgroundColor="$surface"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={4}
        marginBottom="$3"
        overflow="hidden"
      >
        {/* 封面图占位（1:1比例） */}
        <View
          width="100%"
          aspectRatio={1}
          backgroundColor="$background"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          {/* 图片占位 */}
          <Text fontSize={48} opacity={0.3}>
            📦
          </Text>

          {/* 免费赠送角标 */}
          {item.isFree && (
            <View
              position="absolute"
              top={8}
              left={8}
              backgroundColor={COLORS.success}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="white" fontWeight="600">
                免费
              </Text>
            </View>
          )}

          {/* 成色标签 */}
          <View
            position="absolute"
            bottom={8}
            right={8}
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <Text fontSize="$2" color="white">
              {getConditionLabel(item.condition)}
            </Text>
          </View>
        </View>

        {/* 商品信息 */}
        <YStack padding="$3">
          {/* 价格 */}
          <XStack space="$2" alignItems="baseline" marginBottom="$2">
            {item.isFree ? (
              <Text fontSize="$6" fontWeight="bold" color={COLORS.success}>
                免费赠送
              </Text>
            ) : (
              <>
                <Text fontSize="$6" fontWeight="bold" color={COLORS.error}>
                  ¥{item.currentPrice}
                </Text>
                {item.originalPrice && (
                  <Text
                    fontSize="$3"
                    color="$textSecondary"
                    textDecorationLine="line-through"
                  >
                    ¥{item.originalPrice}
                  </Text>
                )}
              </>
            )}
          </XStack>

          {/* 标题 */}
          <Text
            fontSize="$4"
            color="$text"
            numberOfLines={2}
            marginBottom="$2"
            lineHeight="$1"
          >
            {item.title}
          </Text>

          {/* 位置和距离 */}
          <XStack space="$1" alignItems="center">
            <MapPin size={12} color={COLORS.textSecondary} />
            <Text fontSize="$2" color="$textSecondary">
              {item.location.district}
            </Text>
            {item.isNegotiable && (
              <>
                <Text fontSize="$2" color="$textSecondary">
                  ·
                </Text>
                <Text fontSize="$2" color={COLORS.primary}>
                  可议价
                </Text>
              </>
            )}
          </XStack>
        </YStack>
      </Card>
    </TouchableOpacity>
  );
};
