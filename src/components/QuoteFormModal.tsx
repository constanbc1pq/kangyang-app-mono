/**
 * 报价表单弹窗组件
 * 达人填写报价信息并发送
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Input,
  TextArea,
  Button,
  useTheme,
} from 'tamagui';
import { Pressable, Alert } from 'react-native';
import { DollarSign, Clock, MessageCircle } from 'lucide-react-native';
import { BottomSheet } from './BottomSheet';

interface QuoteFormModalProps {
  visible: boolean;
  jobTitle: string;
  jobId: string;
  onClose: () => void;
  onSubmit: (quoteData: {
    jobId: string;
    quotedPrice: number;
    serviceTime: string;
    duration: string;
    message: string;
  }) => void;
}

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  visible,
  jobTitle,
  jobId,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;

  const [price, setPrice] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = () => {
    setPrice('');
    setServiceTime('');
    setDuration('');
    setMessage('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('提示', '请输入有效的报价金额');
      return;
    }

    if (!serviceTime.trim()) {
      Alert.alert('提示', '请输入服务时间');
      return;
    }

    if (!duration.trim()) {
      Alert.alert('提示', '请输入预计服务时长');
      return;
    }

    const quoteData = {
      jobId,
      quotedPrice: parseFloat(price),
      serviceTime: serviceTime.trim(),
      duration: duration.trim(),
      message: message.trim(),
    };

    setSubmitting(true);
    try {
      onSubmit(quoteData);
      handleReset();
    } catch (error) {
      console.error('发送报价失败:', error);
      Alert.alert('发送失败', '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const quickDurations = ['1小时', '2小时', '3小时', '半天', '1天'];

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="发送报价"
      variant="form"
      avoidKeyboard
      footer={
        <XStack gap="$2">
          <Button
            flex={1}
            size="$4"
            backgroundColor="$color2"
            color="$primary"
            borderWidth={1}
            borderColor="$primary"
            borderRadius="$3"
            onPress={handleClose}
          >
            取消
          </Button>
          <Button
            flex={1}
            size="$4"
            backgroundColor={submitting ? '$color6' : '$primary'}
            color="white"
            borderRadius="$3"
            fontWeight="600"
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '发送中...' : '发送报价'}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$4">
        {/* 需求标题 */}
        <View padding="$2" backgroundColor="$color4" borderRadius="$3">
          <Text fontSize="$2" color="$color10" marginBottom="$1">
            服务需求
          </Text>
          <Text fontSize="$4" color="$color12" fontWeight="600">
            {jobTitle}
          </Text>
        </View>

        {/* 报价金额 */}
        <YStack gap="$2">
          <Text fontSize="$3" color="$color12">
            报价金额 <Text color={errorColor}>*</Text>
          </Text>
          <XStack gap="$2" alignItems="center">
            <View
              width={40}
              height={44}
              backgroundColor="$color4"
              borderRadius="$3"
              justifyContent="center"
              alignItems="center"
            >
              <DollarSign size={20} color={primaryColor} />
            </View>
            <Input
              flex={1}
              value={price}
              onChangeText={setPrice}
              placeholder="请输入金额"
              keyboardType="numeric"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              borderRadius="$3"
              fontSize="$4"
              paddingHorizontal="$2"
              height={44}
            />
            <Text fontSize="$4" color="$color12">
              元
            </Text>
          </XStack>
        </YStack>

        {/* 服务时间 */}
        <YStack gap="$2">
          <Text fontSize="$3" color="$color12">
            服务时间 <Text color={errorColor}>*</Text>
          </Text>
          <XStack gap="$2" alignItems="center">
            <View
              width={40}
              height={44}
              backgroundColor="$color4"
              borderRadius="$3"
              justifyContent="center"
              alignItems="center"
            >
              <Clock size={20} color={primaryColor} />
            </View>
            <Input
              flex={1}
              value={serviceTime}
              onChangeText={setServiceTime}
              placeholder="例如：明天下午2点"
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              borderRadius="$3"
              fontSize="$4"
              paddingHorizontal="$2"
              height={44}
            />
          </XStack>
        </YStack>

        {/* 预计时长 */}
        <YStack gap="$2">
          <Text fontSize="$3" color="$color12">
            预计时长 <Text color={errorColor}>*</Text>
          </Text>
          <Input
            value={duration}
            onChangeText={setDuration}
            placeholder="例如：2小时"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$3"
            fontSize="$4"
            paddingHorizontal="$2"
            height={44}
            marginBottom="$2"
          />
          {/* 快速选择时长 */}
          <XStack flexWrap="wrap" gap="$2">
            {quickDurations.map((dur) => (
              <Pressable key={dur} onPress={() => setDuration(dur)}>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$10"
                  backgroundColor={duration === dur ? `${primaryColor}15` : '$color4'}
                  borderWidth={1}
                  borderColor={duration === dur ? primaryColor : '$color5'}
                >
                  <Text
                    fontSize="$2"
                    color={duration === dur ? primaryColor : '$color12'}
                  >
                    {dur}
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        {/* 留言说明 */}
        <YStack gap="$2">
          <Text fontSize="$3" color="$color12">
            留言说明（可选）
          </Text>
          <XStack gap="$2" alignItems="flex-start">
            <View
              width={40}
              height={44}
              backgroundColor="$color4"
              borderRadius="$3"
              justifyContent="center"
              alignItems="center"
            >
              <MessageCircle size={20} color={primaryColor} />
            </View>
            <TextArea
              flex={1}
              value={message}
              onChangeText={setMessage}
              placeholder="向雇主介绍您的服务优势..."
              minHeight={80}
              backgroundColor="$color2"
              borderWidth={1}
              borderColor="$color5"
              borderRadius="$3"
              fontSize="$4"
              paddingHorizontal="$2"
              paddingVertical="$2"
              maxLength={200}
            />
          </XStack>
          <Text fontSize="$2" color="$color10" textAlign="right">
            {message.length}/200
          </Text>
        </YStack>
      </YStack>
    </BottomSheet>
  );
};
