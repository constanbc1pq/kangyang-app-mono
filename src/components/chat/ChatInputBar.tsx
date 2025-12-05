/**
 * ChatInputBar - 聊天输入栏组件
 * 支持文本输入、语音录制、附件菜单
 */
import React, { useRef } from 'react';
import { Pressable, TextInput as RNTextInput, Platform, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { View, Text, XStack, useTheme } from 'tamagui';
import { Plus, X, Send, Mic } from 'lucide-react-native';

interface ChatInputBarProps {
  /** 输入文本 */
  value: string;
  /** 文本变化回调 */
  onChangeText: (text: string) => void;
  /** 发送消息回调 */
  onSend: () => void;
  /** 附件按钮点击回调 */
  onAttachmentPress?: () => void;
  /** 语音按钮点击回调 */
  onVoicePress?: () => void;
  /** 是否显示附件菜单 */
  showAttachmentMenu?: boolean;
  /** 是否正在录音 */
  isRecording?: boolean;
  /** 是否禁用输入 */
  disabled?: boolean;
  /** 禁用提示文字 */
  disabledPlaceholder?: string;
  /** 底部安全区域高度 */
  insetBottom?: number;
  /** 是否启用语音 */
  enableVoice?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  value,
  onChangeText,
  onSend,
  onAttachmentPress,
  onVoicePress,
  showAttachmentMenu = false,
  isRecording = false,
  disabled = false,
  disabledPlaceholder,
  insetBottom = 0,
  enableVoice = true,
}) => {
  const theme = useTheme();
  const inputRef = useRef<RNTextInput>(null);

  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const hasText = value.trim().length > 0;

  const handleSend = () => {
    if (hasText && !disabled) {
      onSend();
    }
  };

  // 处理按键事件 - Web 端 Enter 发送，Shift+Enter 换行
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (Platform.OS === 'web') {
      const nativeEvent = e.nativeEvent as any;
      if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <View
      backgroundColor="$color2"
      borderTopWidth={1}
      borderTopColor="$color5"
      padding="$2"
      paddingBottom={insetBottom > 0 ? insetBottom : 8}
    >
      <XStack gap="$2" alignItems="center">
        {/* 附件按钮 */}
        {onAttachmentPress && (
          <Pressable onPress={onAttachmentPress} disabled={disabled}>
            <View
              width={36}
              height={36}
              backgroundColor="$color4"
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              opacity={disabled ? 0.5 : 1}
            >
              {showAttachmentMenu ? (
                <X size={18} color={color10} />
              ) : (
                <Plus size={18} color={color10} />
              )}
            </View>
          </Pressable>
        )}

        {/* 输入框 */}
        <View
          flex={1}
          backgroundColor="$color4"
          borderRadius="$5"
          paddingHorizontal="$2"
          paddingVertical="$1.5"
          opacity={disabled ? 0.5 : 1}
        >
          <RNTextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? disabledPlaceholder : '输入消息...'}
            placeholderTextColor={color10}
            multiline
            maxLength={500}
            editable={!disabled}
            style={{
              fontSize: 14,
              color: color12,
              maxHeight: 80,
              minHeight: 24,
            }}
          />
        </View>

        {/* 发送/语音按钮 */}
        {hasText ? (
          <Pressable onPress={handleSend} disabled={disabled}>
            <View
              width={36}
              height={36}
              backgroundColor={disabled ? '$color5' : '$primary'}
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
            >
              <Send size={18} color={disabled ? color10 : 'white'} />
            </View>
          </Pressable>
        ) : enableVoice && onVoicePress ? (
          <Pressable onPress={onVoicePress} disabled={disabled}>
            <View
              width={36}
              height={36}
              backgroundColor={isRecording ? '$error' : '$color4'}
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              opacity={disabled ? 0.5 : 1}
            >
              <Mic size={18} color={isRecording ? 'white' : color10} />
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={handleSend} disabled={!hasText || disabled}>
            <View
              width={36}
              height={36}
              backgroundColor="$color4"
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              opacity={0.5}
            >
              <Send size={18} color={color10} />
            </View>
          </Pressable>
        )}
      </XStack>

      {/* 录音状态提示 */}
      {isRecording && (
        <Text
          fontSize="$2"
          color="$error"
          textAlign="center"
          marginTop="$1.5"
        >
          正在录音... 点击停止
        </Text>
      )}
    </View>
  );
};

export default ChatInputBar;
