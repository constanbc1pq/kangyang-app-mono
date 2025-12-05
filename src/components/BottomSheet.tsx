/**
 * BottomSheet 底部弹出面板组件
 * 统一的底部弹出交互组件，支持多种变体
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 *
 * 动画效果：
 * - 遮罩层：透明度淡入/淡出（无位移）
 * - 面板：从底部升起/下沉
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, ScrollView, useTheme, H4 } from 'tamagui';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type BottomSheetVariant = 'default' | 'picker' | 'form' | 'filter';

export interface BottomSheetProps {
  /** 是否显示 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 内容 */
  children: React.ReactNode;
  /** 变体类型 */
  variant?: BottomSheetVariant;
  /** 最大高度，默认 80% */
  maxHeight?: string | number;
  /** 点击遮罩是否关闭，默认 true */
  closeOnOverlayPress?: boolean;
  /** 是否显示拖动手柄，默认 true */
  showHandle?: boolean;
  /** 是否显示头部，默认 true（有 title 时） */
  showHeader?: boolean;
  /** 头部右侧自定义内容 */
  headerRight?: React.ReactNode;
  /** 底部操作区 */
  footer?: React.ReactNode;
  /** 是否需要键盘避让（表单场景），默认 false */
  avoidKeyboard?: boolean;
  /** 内容是否可滚动，默认 true */
  scrollable?: boolean;
}

/**
 * BottomSheet 底部弹出面板
 *
 * @example
 * // 简单选择器
 * <BottomSheet
 *   visible={visible}
 *   onClose={onClose}
 *   title="选择家庭成员"
 *   variant="picker"
 * >
 *   {members.map(m => <MemberItem key={m.id} />)}
 * </BottomSheet>
 *
 * @example
 * // 筛选面板
 * <BottomSheet
 *   visible={visible}
 *   onClose={onClose}
 *   title="筛选条件"
 *   variant="filter"
 *   headerRight={<Text onPress={onReset}>重置</Text>}
 *   footer={<Button onPress={onApply}>确认</Button>}
 * >
 *   {filterContent}
 * </BottomSheet>
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  variant = 'default',
  maxHeight = '80%',
  closeOnOverlayPress = true,
  showHandle = true,
  showHeader,
  headerRight,
  footer,
  avoidKeyboard = false,
  scrollable = true,
}) => {
  const theme = useTheme();
  const textColor = theme.color12?.val;

  // 动画值
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // 动画配置
  const ANIMATION_DURATION = 300;

  useEffect(() => {
    if (visible) {
      // 显示动画：遮罩层淡入 + 面板从底部升起
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 隐藏动画：遮罩层淡出 + 面板下沉
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayOpacity, sheetTranslateY]);

  // 根据变体调整默认行为
  const shouldShowHeader = showHeader ?? !!title;
  const shouldAvoidKeyboard = avoidKeyboard || variant === 'form';

  // 内容容器
  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? { showsVerticalScrollIndicator: false, flex: 1 }
    : { flex: 1 };

  const sheetContent = (
    <View
      backgroundColor="$color2"
      borderTopLeftRadius="$6"
      borderTopRightRadius="$6"
      maxHeight={maxHeight}
      overflow="hidden"
    >
      {/* 拖动手柄 */}
      {showHandle && (
        <View alignItems="center" paddingTop="$2">
          <View
            width={36}
            height={4}
            backgroundColor="$color6"
            borderRadius="$10"
          />
        </View>
      )}

      {/* 头部 */}
      {shouldShowHeader && (
        <XStack
          justifyContent="space-between"
          alignItems="center"
          padding="$2"
          borderBottomWidth={1}
          borderBottomColor="$color5"
        >
          <YStack flex={1}>
            {title && (
              <H4 fontSize="$5" fontWeight="600" color="$color12">
                {title}
              </H4>
            )}
            {subtitle && (
              <Text fontSize="$3" color="$color10" marginTop="$1">
                {subtitle}
              </Text>
            )}
          </YStack>
          <XStack gap="$2" alignItems="center">
            {headerRight}
            <Pressable onPress={onClose}>
              <View
                width={32}
                height={32}
                borderRadius="$10"
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                <X size={18} color={textColor} />
              </View>
            </Pressable>
          </XStack>
        </XStack>
      )}

      {/* 内容区域 */}
      <ContentWrapper {...contentWrapperProps}>
        <View padding="$2">
          {children}
        </View>
      </ContentWrapper>

      {/* 底部操作区 */}
      {footer && (
        <View
          padding="$2"
          borderTopWidth={1}
          borderTopColor="$color5"
          paddingBottom={Platform.OS === 'ios' ? '$4' : '$2'}
        >
          {footer}
        </View>
      )}

      {/* iOS 底部安全区域（无 footer 时） */}
      {!footer && Platform.OS === 'ios' && (
        <View height={20} />
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* 遮罩层 - 透明度淡入/淡出 */}
      <Animated.View
        style={[
          animatedStyles.overlay,
          { opacity: overlayOpacity },
        ]}
      >
        {closeOnOverlayPress ? (
          <Pressable style={animatedStyles.overlayPressable} onPress={onClose} />
        ) : (
          <View style={animatedStyles.overlayPressable} />
        )}
      </Animated.View>

      {/* 面板 - 从底部升起/下沉 */}
      <Animated.View
        style={[
          animatedStyles.sheetContainer,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
        pointerEvents="box-none"
      >
        {shouldAvoidKeyboard ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {sheetContent}
          </KeyboardAvoidingView>
        ) : (
          sheetContent
        )}
      </Animated.View>
    </Modal>
  );
};

// 动画相关的样式
const animatedStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayPressable: {
    flex: 1,
  },
  sheetContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
});

/**
 * BottomSheetItem 列表项组件
 * 用于 picker 类型的选择列表
 */
export interface BottomSheetItemProps {
  /** 是否选中 */
  selected?: boolean;
  /** 点击回调 */
  onPress: () => void;
  /** 左侧图标/头像 */
  left?: React.ReactNode;
  /** 主标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 右侧内容 */
  right?: React.ReactNode;
  /** 禁用状态 */
  disabled?: boolean;
}

export const BottomSheetItem: React.FC<BottomSheetItemProps> = ({
  selected,
  onPress,
  left,
  title,
  subtitle,
  right,
  disabled,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        padding="$2"
        borderRadius="$4"
        backgroundColor={selected ? `${primaryColor}15` : '$color1'}
        borderWidth={1}
        borderColor={selected ? primaryColor : '$color5'}
        opacity={disabled ? 0.5 : 1}
      >
        <XStack gap="$2" alignItems="center">
          {left && (
            <View>{left}</View>
          )}
          <YStack flex={1}>
            <Text
              fontSize="$4"
              fontWeight={selected ? '600' : '500'}
              color={selected ? primaryColor : '$color12'}
            >
              {title}
            </Text>
            {subtitle && (
              <Text fontSize="$3" color="$color10" marginTop="$0.5">
                {subtitle}
              </Text>
            )}
          </YStack>
          {right && (
            <View>{right}</View>
          )}
        </XStack>
      </View>
    </Pressable>
  );
};

export default BottomSheet;
