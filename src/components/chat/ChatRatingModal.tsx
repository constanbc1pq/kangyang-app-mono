/**
 * ChatRatingModal - 咨询评价弹窗组件
 * 用于咨询结束后的服务评价
 */
import React, { useState } from 'react';
import { Modal, Pressable, TextInput as RNTextInput } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { Star, X } from 'lucide-react-native';

interface ChatRatingModalProps {
  visible: boolean;
  recipientName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const ChatRatingModal: React.FC<ChatRatingModalProps> = ({
  visible,
  recipientName,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(5);
    setComment('');
  };

  const getRatingText = (r: number): string => {
    switch (r) {
      case 1: return '非常不满意';
      case 2: return '不满意';
      case 3: return '一般';
      case 4: return '满意';
      case 5: return '非常满意';
      default: return '';
    }
  };

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
        padding="$2.5"
      >
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          padding="$2.5"
          width="100%"
          maxWidth={320}
        >
          {/* 标题栏 */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              服务评价
            </Text>
            <Pressable onPress={onClose}>
              <X size={20} color={color10} />
            </Pressable>
          </XStack>

          {/* 提示文字 */}
          <Text fontSize="$3" color="$color10" textAlign="center" marginBottom="$2">
            请对 {recipientName} 的服务进行评价
          </Text>

          {/* 星级评分 */}
          <YStack alignItems="center" marginBottom="$2">
            <XStack gap="$1.5" marginBottom="$1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <Star
                    size={32}
                    color={star <= rating ? warningColor : color10}
                    fill={star <= rating ? warningColor : 'transparent'}
                  />
                </Pressable>
              ))}
            </XStack>
            <Text fontSize="$3" color={warningColor} fontWeight="500">
              {getRatingText(rating)}
            </Text>
          </YStack>

          {/* 评价内容输入 */}
          <View
            backgroundColor="$color4"
            borderRadius="$4"
            padding="$2"
            marginBottom="$2"
            borderWidth={1}
            borderColor="$color5"
          >
            <RNTextInput
              value={comment}
              onChangeText={setComment}
              placeholder="请输入您的评价内容（选填）"
              placeholderTextColor={color10}
              multiline
              numberOfLines={4}
              maxLength={200}
              style={{
                fontSize: 14,
                color: color12,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* 字数提示 */}
          <Text fontSize="$2" color="$color10" textAlign="right" marginBottom="$2">
            {comment.length}/200
          </Text>

          {/* 提交按钮 */}
          <Pressable onPress={handleSubmit}>
            <View
              backgroundColor={primaryColor}
              borderRadius="$10"
              paddingVertical="$2"
              alignItems="center"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                提交评价
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ChatRatingModal;
