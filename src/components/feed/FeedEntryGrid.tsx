/**
 * FeedEntryGrid - 主题入口双列卡片
 * 2列网格布局，展示主题入口
 * 遵循 CLAUDE.md 组件规范
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, Image, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { FeedEntry } from '@/types/feed';

interface FeedEntryGridProps {
  entries: FeedEntry[];
  onPress: (entry: FeedEntry) => void;
}

export const FeedEntryGrid: React.FC<FeedEntryGridProps> = ({
  entries,
  onPress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  // 按2个一组分组
  const rows: FeedEntry[][] = [];
  for (let i = 0; i < entries.length; i += 2) {
    rows.push(entries.slice(i, i + 2));
  }

  return (
    <YStack gap="$2">
      {rows.map((row, rowIndex) => (
        <XStack key={rowIndex} gap="$2">
          {row.map((entry) => (
            <Pressable
              key={entry.id}
              style={styles.cardContainer}
              onPress={() => onPress(entry)}
            >
              <View
                flex={1}
                borderRadius="$5"
                overflow="hidden"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
              >
                {/* 图片 */}
                <Image
                  source={{ uri: entry.image }}
                  style={styles.image}
                  resizeMode="cover"
                />

                {/* 内容区域 */}
                <YStack padding="$2" gap="$0.5">
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color="$color12"
                    numberOfLines={1}
                  >
                    {entry.title}
                  </Text>
                  {entry.subtitle && (
                    <XStack alignItems="center" gap="$0.5">
                      <Text
                        fontSize="$2"
                        color="$color10"
                        numberOfLines={1}
                        flex={1}
                      >
                        {entry.subtitle}
                      </Text>
                      <ChevronRight size={12} color={primaryColor} />
                    </XStack>
                  )}
                </YStack>
              </View>
            </Pressable>
          ))}
          {/* 如果是奇数个，补一个占位 */}
          {row.length === 1 && <View style={styles.cardContainer} />}
        </XStack>
      ))}
    </YStack>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 100,
  },
});

export default FeedEntryGrid;
