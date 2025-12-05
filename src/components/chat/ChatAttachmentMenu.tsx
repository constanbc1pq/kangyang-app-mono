/**
 * ChatAttachmentMenu - 附件菜单组件
 * 显示可发送的附件类型列表
 */
import React from 'react';
import { Pressable } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { AttachmentItem } from '@/types/chat';

interface ChatAttachmentMenuProps {
  items: AttachmentItem[];
  onClose: () => void;
}

export const ChatAttachmentMenu: React.FC<ChatAttachmentMenuProps> = ({
  items,
  onClose: _onClose,
}) => {
  const handleItemPress = (item: AttachmentItem) => {
    item.onPress();
    // 不自动关闭，让回调决定是否关闭
  };

  return (
    <View
      backgroundColor="$color2"
      paddingVertical="$2"
      borderTopWidth={1}
      borderTopColor="$color5"
    >
      <XStack justifyContent="space-around" paddingHorizontal="$2.5" flexWrap="wrap">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <Pressable key={item.id} onPress={() => handleItemPress(item)}>
              <YStack alignItems="center" gap="$1" paddingVertical="$1">
                <View
                  width={52}
                  height={52}
                  borderRadius={26}
                  justifyContent="center"
                  alignItems="center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <IconComponent size={24} color={item.color} />
                </View>
                <Text fontSize="$2" color="$color10">
                  {item.label}
                </Text>
              </YStack>
            </Pressable>
          );
        })}
      </XStack>
    </View>
  );
};

export default ChatAttachmentMenu;
