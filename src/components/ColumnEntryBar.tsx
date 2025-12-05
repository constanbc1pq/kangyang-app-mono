/**
 * 栏目入口横条组件
 * 横向滚动展示6大栏目入口
 * 点击跳转栏目详情页
 */

import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import { Pressable, ScrollView } from 'react-native';
import {
  Leaf,
  Stethoscope,
  ChefHat,
  BookOpen,
  Shield,
  Sparkles,
} from 'lucide-react-native';
import { Column, ColumnIcon } from '@/types/column';

interface ColumnEntryBarProps {
  columns: Column[];
  onColumnPress?: (column: Column) => void;
}

// 图标映射
const ICON_MAP: Record<ColumnIcon, React.ElementType> = {
  Leaf: Leaf,
  Stethoscope: Stethoscope,
  ChefHat: ChefHat,
  BookOpen: BookOpen,
  Shield: Shield,
  Sparkles: Sparkles,
};

// 栏目颜色映射（使用主题色）
const getColumnColor = (columnId: string, theme: ReturnType<typeof useTheme>) => {
  const colorMap: Record<string, string | undefined> = {
    'seasonal-wellness': theme.success?.val,
    'famous-doctor': theme.primary?.val,
    'dining-hall': theme.warning?.val,
    'care-academy': theme.error?.val,
    'worry-free': theme.secondary?.val,
    'silver-life': theme.accent?.val,
  };
  return colorMap[columnId] || theme.primary?.val;
};

export const ColumnEntryBar: React.FC<ColumnEntryBarProps> = ({
  columns,
  onColumnPress,
}) => {
  const theme = useTheme();

  if (!columns || columns.length === 0) {
    return null;
  }

  return (
    <YStack gap="$2">
      {/* 标题 */}
      <Text fontSize="$5" fontWeight="600" color="$color12">
        养生频道
      </Text>

      {/* 横向滚动栏目列表 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <XStack gap="$2">
          {columns.map((column) => {
            const IconComponent = ICON_MAP[column.icon] || Leaf;
            const color = getColumnColor(column.id, theme);

            return (
              <Pressable
                key={column.id}
                onPress={() => onColumnPress?.(column)}
              >
                <View
                  width={80}
                  alignItems="center"
                  gap="$1"
                  backgroundColor="$color2"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$color5"
                  paddingVertical="$2"
                  paddingHorizontal="$1"
                >
                  {/* 图标容器 */}
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={`${color}15`}
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={1}
                    borderColor={`${color}30`}
                  >
                    <IconComponent size={22} color={color} />
                  </View>
                  {/* 栏目名称 */}
                  <Text
                    fontSize="$2"
                    fontWeight="500"
                    color="$color12"
                    textAlign="center"
                    numberOfLines={1}
                  >
                    {column.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
};

export default ColumnEntryBar;
