/**
 * ConfirmModal 确认弹窗组件
 * 用于需要用户确认的操作，如删除等
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React from 'react';
import { Modal, Pressable, Dimensions } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { AlertTriangle, Trash2, Info } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ConfirmModalType = 'danger' | 'warning' | 'info';

export interface ConfirmModalProps {
  /** 是否显示 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 确认回调 */
  onConfirm: () => void;
  /** 标题 */
  title: string;
  /** 描述内容 */
  message: string;
  /** 确认按钮文字，默认"确认" */
  confirmText?: string;
  /** 取消按钮文字，默认"取消" */
  cancelText?: string;
  /** 弹窗类型，默认 danger */
  type?: ConfirmModalType;
  /** 是否显示图标，默认 true */
  showIcon?: boolean;
  /** 确认中状态 */
  loading?: boolean;
}

/**
 * ConfirmModal 确认弹窗
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger',
  showIcon = true,
  loading = false,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;

  // 根据类型获取颜色和图标
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          color: errorColor,
          icon: <Trash2 size={28} color={errorColor} />,
          bgColor: `${errorColor}15`,
        };
      case 'warning':
        return {
          color: warningColor,
          icon: <AlertTriangle size={28} color={warningColor} />,
          bgColor: `${warningColor}15`,
        };
      case 'info':
      default:
        return {
          color: primaryColor,
          icon: <Info size={28} color={primaryColor} />,
          bgColor: `${primaryColor}15`,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        flex={1}
        backgroundColor="rgba(0,0,0,0.5)"
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="$4"
      >
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          width={Math.min(SCREEN_WIDTH - 48, 320)}
          overflow="hidden"
        >
          {/* 内容区 */}
          <YStack padding="$4" alignItems="center" gap="$3">
            {/* 图标 */}
            {showIcon && (
              <View
                width={56}
                height={56}
                borderRadius={28}
                backgroundColor={config.bgColor}
                justifyContent="center"
                alignItems="center"
              >
                {config.icon}
              </View>
            )}

            {/* 标题 */}
            <Text
              fontSize="$5"
              fontWeight="600"
              color="$color12"
              textAlign="center"
            >
              {title}
            </Text>

            {/* 描述 */}
            <Text
              fontSize="$3"
              color="$color10"
              textAlign="center"
              lineHeight={22}
            >
              {message}
            </Text>
          </YStack>

          {/* 按钮区 */}
          <XStack
            borderTopWidth={1}
            borderTopColor="$color5"
          >
            {/* 取消按钮 */}
            <Pressable
              style={{ flex: 1 }}
              onPress={onClose}
              disabled={loading}
            >
              <View
                paddingVertical="$3"
                justifyContent="center"
                alignItems="center"
                borderRightWidth={1}
                borderRightColor="$color5"
              >
                <Text
                  fontSize="$4"
                  color="$color10"
                  fontWeight="500"
                >
                  {cancelText}
                </Text>
              </View>
            </Pressable>

            {/* 确认按钮 */}
            <Pressable
              style={{ flex: 1 }}
              onPress={onConfirm}
              disabled={loading}
            >
              <View
                paddingVertical="$3"
                justifyContent="center"
                alignItems="center"
                opacity={loading ? 0.6 : 1}
              >
                <Text
                  fontSize="$4"
                  color={config.color}
                  fontWeight="600"
                >
                  {loading ? '处理中...' : confirmText}
                </Text>
              </View>
            </Pressable>
          </XStack>
        </View>
      </View>
    </Modal>
  );
};
