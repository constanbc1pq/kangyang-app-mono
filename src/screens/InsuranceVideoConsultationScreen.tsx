import React, { useState } from 'react';
import { ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Video, Calendar, Clock, Send, AlertCircle } from 'lucide-react-native';
import { createConsultation } from '@/services/insuranceAdvisorService';

type RouteParams = {
  InsuranceVideoConsultation: {
    advisorId: string;
    advisorName: string;
  };
};

const InsuranceVideoConsultationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceVideoConsultation'>>();
  const { advisorId, advisorName } = route.params;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [question, setQuestion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 可预约日期（未来7天）
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: i === 0 ? '今天' : i === 1 ? '明天' : `${date.getMonth() + 1}月${date.getDate()}日`,
      date: date,
    };
  });

  // 可预约时间段
  const availableTimes = [
    { value: '09:00-10:00', label: '09:00-10:00' },
    { value: '10:00-11:00', label: '10:00-11:00' },
    { value: '14:00-15:00', label: '14:00-15:00' },
    { value: '15:00-16:00', label: '15:00-16:00' },
    { value: '16:00-17:00', label: '16:00-17:00' },
    { value: '19:00-20:00', label: '19:00-20:00' },
    { value: '20:00-21:00', label: '20:00-21:00' },
  ];

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('提示', '请输入咨询主题');
      return;
    }

    if (!selectedDate) {
      Alert.alert('提示', '请选择预约日期');
      return;
    }

    if (!selectedTime) {
      Alert.alert('提示', '请选择预约时间');
      return;
    }

    try {
      setSubmitting(true);

      const consultation = await createConsultation({
        userId: 'user_001',
        advisorId,
        type: 'video',
        question: `【视频咨询预约】${question.trim()}`,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        tags: ['视频咨询'],
      });

      Alert.alert(
        '预约成功',
        `已成功预约${advisorName}顾问的视频咨询。\n\n预约时间：${selectedDate} ${selectedTime}\n\n我们将在预约时间前10分钟通过APP推送通知提醒您，请提前准备好网络和设备。`,
        [
          {
            text: '查看咨询记录',
            onPress: () => {
              navigation.navigate('InsuranceConsultationHistory' as never);
            },
          },
          {
            text: '返回首页',
            onPress: () => {
              navigation.navigate('InsuranceHome' as never);
            },
          },
        ]
      );
    } catch (error) {
      console.error('预约失败:', error);
      Alert.alert('预约失败', '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = !question.trim() || !selectedDate || !selectedTime || submitting;

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            视频咨询预约
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顾问信息 */}
        <View
          marginHorizontal="$2.5"
          marginTop="$2.5"
          padding="$2"
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack alignItems="center" gap="$2">
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={warningColor}
              justifyContent="center"
              alignItems="center"
            >
              <Video size={20} color="white" />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {advisorName} 顾问
              </Text>
              <Text fontSize="$2" color="$color10">
                将与您进行视频面对面交流
              </Text>
            </YStack>
            <View
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
              backgroundColor={`${warningColor}15`}
            >
              <Text fontSize="$2" color={warningColor} fontWeight="600">
                免费
              </Text>
            </View>
          </XStack>
        </View>

        {/* 设备准备提醒 */}
        <View
          marginHorizontal="$2.5"
          marginTop="$2"
          padding="$2"
          backgroundColor={`${warningColor}10`}
          borderRadius="$4"
          borderLeftWidth={3}
          borderLeftColor={warningColor}
        >
          <XStack alignItems="flex-start" gap="$2">
            <AlertCircle size={18} color={warningColor} style={{ marginTop: 2 }} />
            <YStack flex={1}>
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                设备准备提醒
              </Text>
              <Text fontSize="$2" color="$color12" lineHeight={18}>
                请确保您的设备摄像头、麦克风和网络正常，建议在光线充足的环境下进行视频咨询
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* 咨询主题 */}
        <YStack padding="$2.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            咨询主题 *
          </Text>
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <TextInput
              placeholder="请简要描述您想咨询的问题..."
              placeholderTextColor={color10}
              multiline
              numberOfLines={4}
              style={{
                fontSize: 14,
                color: color12,
                textAlignVertical: 'top',
                minHeight: 80,
              }}
              value={question}
              onChangeText={setQuestion}
              maxLength={200}
            />
            <Text fontSize="$2" color="$color10" textAlign="right" marginTop="$2">
              {question.length}/200
            </Text>
          </View>
          <Text fontSize="$2" color="$color10" marginTop="$1">
            建议提前准备好相关保单或产品资料，以便顾问更好地为您解答
          </Text>
        </YStack>

        {/* 预约日期 */}
        <YStack paddingHorizontal="$2.5" marginBottom="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            预约日期 *
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {availableDates.map(date => (
              <Pressable
                key={date.value}
                onPress={() => setSelectedDate(date.value)}
                style={{ marginBottom: 8 }}
              >
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor={selectedDate === date.value ? '$warning' : '$color4'}
                  minWidth={80}
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$1">
                    <Calendar
                      size={14}
                      color={selectedDate === date.value ? 'white' : color12}
                    />
                    <Text
                      fontSize="$3"
                      color={selectedDate === date.value ? 'white' : '$color12'}
                      fontWeight={selectedDate === date.value ? '600' : '400'}
                    >
                      {date.label}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        {/* 预约时间 */}
        <YStack paddingHorizontal="$2.5" marginBottom="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            预约时间 *
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {availableTimes.map(time => (
              <Pressable
                key={time.value}
                onPress={() => setSelectedTime(time.value)}
                style={{ marginBottom: 8 }}
              >
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor={selectedTime === time.value ? '$warning' : '$color4'}
                  minWidth={100}
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$1">
                    <Clock
                      size={14}
                      color={selectedTime === time.value ? 'white' : color12}
                    />
                    <Text
                      fontSize="$3"
                      color={selectedTime === time.value ? 'white' : '$color12'}
                      fontWeight={selectedTime === time.value ? '600' : '400'}
                    >
                      {time.label}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        {/* 服务说明 */}
        <View
          marginHorizontal="$2.5"
          marginBottom="$2"
          padding="$2"
          backgroundColor={`${primaryColor}10`}
          borderRadius="$4"
          borderLeftWidth={3}
          borderLeftColor={primaryColor}
        >
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
            视频咨询说明
          </Text>
          <Text fontSize="$2" color="$color12" lineHeight={20}>
            • 视频咨询完全免费，无需购买会员{'\n'}
            • 支持屏幕共享功能，可展示产品条款{'\n'}
            • 建议使用Wi-Fi网络，保证通话质量{'\n'}
            • 我们会在预约前10分钟推送提醒{'\n'}
            • 通话时长约30-60分钟{'\n'}
            • 如需改期或取消，请提前联系顾问
          </Text>
        </View>

        <View height={100} />
      </ScrollView>

      {/* Bottom Submit Button */}
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$2.5"
        paddingBottom={insets.bottom > 0 ? insets.bottom : 16}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
      >
        <Pressable onPress={handleSubmit} disabled={isSubmitDisabled} style={{ flex: 1 }}>
          <View
            height={48}
            borderRadius="$10"
            backgroundColor={isSubmitDisabled ? '$color5' : '$warning'}
            justifyContent="center"
            alignItems="center"
          >
            <XStack alignItems="center" gap="$2">
              <Send size={20} color={isSubmitDisabled ? color10 : 'white'} />
              <Text
                color={isSubmitDisabled ? '$color10' : 'white'}
                fontSize="$4"
                fontWeight="500"
              >
                {submitting ? '提交中...' : '确认预约'}
              </Text>
            </XStack>
          </View>
        </Pressable>
      </XStack>
    </View>
  );
};

export default InsuranceVideoConsultationScreen;
