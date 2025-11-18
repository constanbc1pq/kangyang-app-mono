import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Input,
  TextArea,
  H3,
} from 'tamagui';
import {
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  X,
  DollarSign,
  Clock,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

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

/**
 * 报价表单弹窗组件
 * 达人填写报价信息并发送
 */
export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  visible,
  jobTitle,
  jobId,
  onClose,
  onSubmit,
}) => {
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
    // 验证必填项
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

  // 快速设置时长
  const quickDurations = ['1小时', '2小时', '3小时', '半天', '1天'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          flex={1}
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="flex-end"
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={handleClose}
          />

          <View
            backgroundColor="white"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            paddingBottom={Platform.OS === 'ios' ? 34 : 20}
          >
            {/* 顶部标题栏 */}
            <View
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <H3 fontSize="$5" fontWeight="600" color="$text">
                  发送报价
                </H3>
                <TouchableOpacity onPress={handleClose}>
                  <View
                    width={32}
                    height={32}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <X size={24} color={COLORS.text} />
                  </View>
                </TouchableOpacity>
              </XStack>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 500 }}
            >
              <View padding="$4">
                <YStack space="$4">
                  {/* 需求标题 */}
                  <View
                    padding="$3"
                    backgroundColor="$background"
                    borderRadius="$3"
                  >
                    <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                      服务需求
                    </Text>
                    <Text fontSize="$4" color="$text" fontWeight="600">
                      {jobTitle}
                    </Text>
                  </View>

                  {/* 报价金额 */}
                  <YStack>
                    <Text fontSize="$3" color="$text" marginBottom="$2">
                      报价金额 <Text color={COLORS.error}>*</Text>
                    </Text>
                    <XStack space="$2" alignItems="center">
                      <View
                        width={40}
                        height={44}
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$3"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <DollarSign size={20} color={COLORS.primary} />
                      </View>
                      <Input
                        flex={1}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="请输入金额"
                        keyboardType="numeric"
                        backgroundColor="white"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$3"
                        fontSize="$4"
                        paddingHorizontal="$3"
                        height={44}
                      />
                      <Text fontSize="$4" color="$text">
                        元
                      </Text>
                    </XStack>
                  </YStack>

                  {/* 服务时间 */}
                  <YStack>
                    <Text fontSize="$3" color="$text" marginBottom="$2">
                      服务时间 <Text color={COLORS.error}>*</Text>
                    </Text>
                    <XStack space="$2" alignItems="center">
                      <View
                        width={40}
                        height={44}
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$3"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Clock size={20} color={COLORS.primary} />
                      </View>
                      <Input
                        flex={1}
                        value={serviceTime}
                        onChangeText={setServiceTime}
                        placeholder="例如：明天下午2点"
                        backgroundColor="white"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$3"
                        fontSize="$4"
                        paddingHorizontal="$3"
                        height={44}
                      />
                    </XStack>
                  </YStack>

                  {/* 预计时长 */}
                  <YStack>
                    <Text fontSize="$3" color="$text" marginBottom="$2">
                      预计时长 <Text color={COLORS.error}>*</Text>
                    </Text>
                    <Input
                      value={duration}
                      onChangeText={setDuration}
                      placeholder="例如：2小时"
                      backgroundColor="white"
                      borderWidth={1}
                      borderColor="$borderColor"
                      borderRadius="$3"
                      fontSize="$4"
                      paddingHorizontal="$3"
                      height={44}
                      marginBottom="$2"
                    />
                    {/* 快速选择时长 */}
                    <View flexDirection="row" flexWrap="wrap" gap="$2">
                      {quickDurations.map((dur) => (
                        <TouchableOpacity
                          key={dur}
                          onPress={() => setDuration(dur)}
                        >
                          <View
                            paddingHorizontal="$3"
                            paddingVertical="$1"
                            borderRadius="$6"
                            backgroundColor={
                              duration === dur
                                ? `${COLORS.primary}20`
                                : '$background'
                            }
                            borderWidth={1}
                            borderColor={
                              duration === dur
                                ? COLORS.primary
                                : '$borderColor'
                            }
                          >
                            <Text
                              fontSize="$2"
                              color={duration === dur ? COLORS.primary : '$text'}
                            >
                              {dur}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </YStack>

                  {/* 留言说明 */}
                  <YStack>
                    <Text fontSize="$3" color="$text" marginBottom="$2">
                      留言说明（可选）
                    </Text>
                    <XStack space="$2" alignItems="flex-start">
                      <View
                        width={40}
                        height={44}
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$3"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <MessageCircle size={20} color={COLORS.primary} />
                      </View>
                      <TextArea
                        flex={1}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="向雇主介绍您的服务优势..."
                        minHeight={80}
                        backgroundColor="white"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$3"
                        fontSize="$4"
                        paddingHorizontal="$3"
                        paddingVertical="$2"
                        maxLength={200}
                      />
                    </XStack>
                    <Text
                      fontSize="$2"
                      color="$textSecondary"
                      textAlign="right"
                      marginTop="$1"
                    >
                      {message.length}/200
                    </Text>
                  </YStack>
                </YStack>
              </View>
            </ScrollView>

            {/* 底部操作按钮 */}
            <View
              paddingHorizontal="$4"
              paddingTop="$3"
              borderTopWidth={1}
              borderTopColor="$borderColor"
            >
              <XStack space="$3">
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={handleClose}
                >
                  <View
                    backgroundColor="white"
                    borderWidth={1}
                    borderColor={COLORS.primary}
                    borderRadius="$3"
                    paddingVertical="$3"
                    alignItems="center"
                  >
                    <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
                      取消
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={handleSubmit}
                  disabled={submitting}
                >
                  <View
                    backgroundColor={
                      submitting ? COLORS.textSecondary : COLORS.primary
                    }
                    borderRadius="$3"
                    paddingVertical="$3"
                    alignItems="center"
                  >
                    <Text fontSize="$4" color="white" fontWeight="600">
                      {submitting ? '发送中...' : '发送报价'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </XStack>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
