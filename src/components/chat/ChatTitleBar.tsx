/**
 * ChatTitleBar - 聊天页面标题栏组件
 * 支持主标题、副标题、通话按钮配置
 */
import React from 'react';
import { Pressable } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Phone, Video } from 'lucide-react-native';
import { TitleBarConfig, CallConfig } from '@/types/chat';

interface ChatTitleBarProps {
  config: TitleBarConfig;
  callConfig?: CallConfig;
  insetTop?: number;
}

export const ChatTitleBar: React.FC<ChatTitleBarProps> = ({
  config,
  callConfig,
  insetTop = 0,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const color12 = theme.color12?.val;
  const primaryColor = theme.primary?.val;

  const { title, subtitle, showBack = true, onBack } = config;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const hasCallButtons = callConfig?.enableVoiceCall || callConfig?.enableVideoCall;

  return (
    <View
      paddingTop={insetTop}
      backgroundColor="$color2"
      borderBottomWidth={1}
      borderBottomColor="$color5"
    >
      <XStack
        paddingVertical="$0.75"
        paddingHorizontal="$2.5"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* 左侧返回按钮 */}
        <View width={40}>
          {showBack && (
            <Pressable onPress={handleBack}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
              >
                <ArrowLeft size={24} color={color12} />
              </View>
            </Pressable>
          )}
        </View>

        {/* 中间标题区域 */}
        <YStack alignItems="center" flex={1}>
          <Text fontSize="$5" fontWeight="600" color="$color12" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="$2" color="$color10">
              {subtitle}
            </Text>
          )}
        </YStack>

        {/* 右侧通话按钮 */}
        <XStack width={hasCallButtons ? 'auto' : 40} gap="$2">
          {callConfig?.enableVoiceCall && (
            <Pressable onPress={callConfig.onVoiceCall}>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                <Phone size={18} color={primaryColor} />
              </View>
            </Pressable>
          )}
          {callConfig?.enableVideoCall && (
            <Pressable onPress={callConfig.onVideoCall}>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                <Video size={18} color={primaryColor} />
              </View>
            </Pressable>
          )}
        </XStack>
      </XStack>
    </View>
  );
};

export default ChatTitleBar;
