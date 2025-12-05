/**
 * SecondHandCard 二手商品卡片组件
 * 瀑布流风格，类似闲鱼商品卡片
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Image,
  useTheme,
} from 'tamagui';
import { Pressable } from 'react-native';
import { MapPin, Package } from 'lucide-react-native';
import { SecondHandItem, ItemCondition } from '@/types/community';

interface SecondHandCardProps {
  item: SecondHandItem;
  onPress: (itemId: string) => void;
}

/**
 * 二手商品卡片组件
 */
export const SecondHandCard: React.FC<SecondHandCardProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const [imageError, setImageError] = useState(false);

  // 获取商品图片
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;

  // 获取成色标签
  const getConditionLabel = (condition: ItemCondition): string => {
    const labels: { [key in ItemCondition]: string } = {
      [ItemCondition.NEW]: '全新',
      [ItemCondition.LIKE_NEW]: '99新',
      [ItemCondition.EXCELLENT]: '95新',
      [ItemCondition.GOOD]: '9成新',
      [ItemCondition.FAIR]: '8成新',
      [ItemCondition.USED]: '有痕迹',
    };
    return labels[condition] || '未知';
  };

  // 获取成色颜色
  const getConditionColor = (condition: ItemCondition): string | undefined => {
    if (condition === ItemCondition.NEW || condition === ItemCondition.LIKE_NEW) {
      return successColor;
    } else if (condition === ItemCondition.EXCELLENT || condition === ItemCondition.GOOD) {
      return primaryColor;
    } else {
      return color10;
    }
  };

  return (
    <Pressable onPress={() => onPress(item.id)}>
      <View
        borderRadius="$5"
        backgroundColor="$color2"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.08}
        elevation={2}
        overflow="hidden"
        borderWidth={1}
        borderColor="$color5"
      >
        {/* 封面图（1:1比例） */}
        <View
          width="100%"
          aspectRatio={1}
          backgroundColor="$color4"
          justifyContent="center"
          alignItems="center"
        >
          {/* 商品图片 */}
          {imageUrl && !imageError ? (
            <Image
              source={{ uri: imageUrl }}
              width="100%"
              height="100%"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Package size={40} color={color10} />
          )}

          {/* 免费赠送角标 */}
          {item.isFree && (
            <View
              position="absolute"
              top="$1.5"
              left="$1.5"
              backgroundColor={successColor}
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color="white" fontWeight="600">
                免费
              </Text>
            </View>
          )}

          {/* 成色标签 */}
          <View
            position="absolute"
            bottom="$1.5"
            right="$1.5"
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$1.5"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <Text fontSize={10} color="white">
              {getConditionLabel(item.condition)}
            </Text>
          </View>
        </View>

        {/* 商品信息 */}
        <YStack padding="$2">
          {/* 价格 */}
          <XStack gap="$1.5" alignItems="baseline" marginBottom="$1.5">
            {item.isFree ? (
              <Text fontSize="$4" fontWeight="700" color={successColor}>
                免费赠送
              </Text>
            ) : (
              <>
                <Text fontSize="$4" fontWeight="700" color={errorColor}>
                  ¥{item.currentPrice}
                </Text>
                {item.originalPrice && (
                  <Text
                    fontSize="$2"
                    color="$color10"
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
            fontSize="$3"
            color="$color12"
            numberOfLines={2}
            marginBottom="$1.5"
            lineHeight={18}
          >
            {item.title}
          </Text>

          {/* 位置和标签 */}
          <XStack gap="$1" alignItems="center" flexWrap="wrap">
            <MapPin size={12} color={color10} />
            <Text fontSize="$2" color="$color10">
              {item.location.district}
            </Text>
            {item.isNegotiable && (
              <>
                <Text fontSize="$2" color="$color10">·</Text>
                <Text fontSize="$2" color={primaryColor} fontWeight="500">
                  可议价
                </Text>
              </>
            )}
          </XStack>
        </YStack>
      </View>
    </Pressable>
  );
};
