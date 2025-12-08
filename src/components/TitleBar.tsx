import React from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

/**
 * 右侧操作按钮配置
 */
export interface TitleBarAction {
  /** 图标组件 */
  icon: React.ComponentType<{ size: number; color: string }>;
  /** 点击回调 */
  onPress: () => void;
  /** 可选：文字标签（用于带文字的按钮） */
  label?: string;
  /** 可选：自定义颜色 */
  color?: string;
  /** 按钮类型：icon=纯图标, text=纯文字, button=图标+文字按钮 */
  variant?: 'icon' | 'text' | 'button';
}

/**
 * TitleBar 组件属性
 */
export interface TitleBarProps {
  /** 标题文字 */
  title: string;
  /** 是否显示返回按钮，默认 true */
  showBack?: boolean;
  /** 自定义返回回调，默认 navigation.goBack() */
  onBack?: () => void;
  /** 副标题 */
  subtitle?: string;
  /** 标题左侧图标/头像 */
  titleIcon?: React.ReactNode;
  /** 标题右侧徽章 */
  badge?: React.ReactNode;
  /** 右侧操作按钮列表 */
  actions?: TitleBarAction[];
  /** 完全自定义右侧内容 */
  renderRight?: () => React.ReactNode;
}

/**
 * 统一顶部标题栏组件
 * 遵循 CLAUDE.md 规范：
 * - 容器: paddingHorizontal=$2.5, paddingVertical=$0.75 (8px), backgroundColor=white
 * - 边框: borderBottomWidth=1, borderBottomColor=$color5
 * - 标题: fontSize=$5, fontWeight=600, color=$color12, 居中
 * - 副标题: fontSize=$3, color=$color10
 * - 图标按钮: 40x40, 居中
 * - 文字按钮: borderRadius=$10 (胶囊形)
 */
export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  showBack = true,
  onBack,
  subtitle,
  titleIcon,
  badge,
  actions = [],
  renderRight,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  // 主题色值
  const textColor = theme.color12?.val || '#1F2937';
  const textSecondaryColor = theme.color10?.val || '#6B7280';
  const primaryColor = theme.primary?.val || '#6366F1';

  // 处理返回按钮点击
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  // 渲染单个操作按钮
  const renderAction = (action: TitleBarAction, index: number) => {
    const IconComponent = action.icon;
    const iconColor = action.color || textColor;

    // 纯图标按钮
    if (!action.variant || action.variant === 'icon') {
      return (
        <TouchableOpacity key={index} onPress={action.onPress}>
          <View
            width={40}
            height={40}
            justifyContent="center"
            alignItems="center"
          >
            <IconComponent size={20} color={iconColor} />
          </View>
        </TouchableOpacity>
      );
    }

    // 纯文字按钮
    if (action.variant === 'text') {
      return (
        <TouchableOpacity key={index} onPress={action.onPress}>
          <View
            paddingHorizontal="$3"
            paddingVertical="$2"
          >
            <Text fontSize="$3" color={action.color || '$primary'} fontWeight="500">
              {action.label}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // 图标+文字按钮 (胶囊形)
    if (action.variant === 'button') {
      return (
        <TouchableOpacity key={index} onPress={action.onPress}>
          <View
            backgroundColor="$primary"
            borderRadius="$10"
            paddingVertical="$2"
            paddingHorizontal="$3"
          >
            <XStack gap="$1.5" alignItems="center">
              <IconComponent size={16} color="white" />
              <Text fontSize="$3" color="white" fontWeight="500">
                {action.label}
              </Text>
            </XStack>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  // 计算左右占位宽度，确保标题真正居中
  // 使用 max(左侧宽度, 右侧宽度) 作为两侧的统一宽度
  const baseLeftWidth = showBack ? 40 : 0;
  const baseRightWidth = actions.length * 40;
  // 当使用 renderRight 时，无法预知宽度，使用 'auto'
  // 当使用 actions 时，左右取最大值确保标题居中
  const balancedWidth = renderRight ? 'auto' : Math.max(baseLeftWidth, baseRightWidth);
  const leftWidth = renderRight ? baseLeftWidth : balancedWidth;
  const rightWidth = renderRight ? 'auto' : balancedWidth;

  return (
    <View
      backgroundColor="white"
      paddingHorizontal="$2.5"
      paddingVertical="$0.75"
      borderBottomWidth={1}
      borderBottomColor="$color5"
    >
      <XStack alignItems="center">
        {/* 左侧区域 - 返回按钮 */}
        <View width={leftWidth}>
          {showBack && (
            <Pressable onPress={handleBack}>
              <View
                width={40}
                height={40}
                justifyContent="center"
                alignItems="flex-start"
              >
                <ArrowLeft size={24} color={textColor} />
              </View>
            </Pressable>
          )}
        </View>

        {/* 中间区域 - 标题 (flex=1 占据剩余空间，内容居中) */}
        <View flex={1} alignItems="center" justifyContent="center">
          <XStack alignItems="center" gap="$2">
            {/* 标题图标 */}
            {titleIcon}

            {/* 标题和副标题 */}
            {subtitle ? (
              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1.5">
                  <Text fontSize="$5" fontWeight="600" color="$color12">
                    {title}
                  </Text>
                  {badge}
                </XStack>
                <Text fontSize="$3" color="$color10">
                  {subtitle}
                </Text>
              </YStack>
            ) : (
              <XStack alignItems="center" gap="$1.5">
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  {title}
                </Text>
                {badge}
              </XStack>
            )}
          </XStack>
        </View>

        {/* 右侧区域 - 操作按钮 */}
        <View width={rightWidth} alignItems="flex-end" pointerEvents="box-none">
          {renderRight ? (
            renderRight()
          ) : actions.length > 0 ? (
            <XStack alignItems="center">
              {actions.map(renderAction)}
            </XStack>
          ) : null}
        </View>
      </XStack>
    </View>
  );
};

export default TitleBar;
