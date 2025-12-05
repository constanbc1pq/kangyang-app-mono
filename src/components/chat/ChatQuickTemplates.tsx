/**
 * ChatQuickTemplates - 快速回复模板组件
 * 横向滚动的快捷回复选项
 */
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { View, Text, XStack, useTheme } from 'tamagui';
import { X } from 'lucide-react-native';
import { QuickTemplate } from '@/types/chat';

interface ChatQuickTemplatesProps {
  templates: QuickTemplate[];
  onSelect: (template: QuickTemplate) => void;
  onClose: () => void;
}

export const ChatQuickTemplates: React.FC<ChatQuickTemplatesProps> = ({
  templates,
  onSelect,
  onClose,
}) => {
  const theme = useTheme();
  const color10 = theme.color10?.val;

  return (
    <View
      backgroundColor="$color2"
      paddingVertical="$2"
      paddingHorizontal="$2.5"
      borderTopWidth={1}
      borderTopColor="$color5"
    >
      {/* 标题栏 */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
        <Text fontSize="$3" fontWeight="600" color="$color12">
          快速模板
        </Text>
        <Pressable onPress={onClose}>
          <X size={18} color={color10} />
        </Pressable>
      </XStack>

      {/* 模板列表 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$1.5">
          {templates.map((template) => (
            <Pressable key={template.id} onPress={() => onSelect(template)}>
              <View
                backgroundColor="$color4"
                paddingHorizontal="$2"
                paddingVertical="$1.5"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$color5"
              >
                <Text fontSize="$2" color="$color12">
                  {template.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>
    </View>
  );
};

export default ChatQuickTemplates;
