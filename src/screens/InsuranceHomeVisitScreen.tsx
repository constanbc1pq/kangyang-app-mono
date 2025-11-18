import React, { useState } from 'react';
import { ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Home, Calendar, Clock, MapPin, Send } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { bookHomeVisit } from '@/services/insuranceAdvisorService';

type RouteParams = {
  InsuranceHomeVisit: {
    advisorId: string;
    advisorName: string;
  };
};

const InsuranceHomeVisitScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceHomeVisit'>>();
  const { advisorId, advisorName } = route.params;

  const [serviceDescription, setServiceDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 可预约日期（未来14天，上门服务需要更多准备时间）
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // 至少提前1天预约
    return {
      value: date.toISOString().split('T')[0],
      label:
        i === 0 ? '明天' : i === 1 ? '后天' : `${date.getMonth() + 1}月${date.getDate()}日`,
      date: date,
    };
  });

  // 可预约时间段
  const availableTimes = [
    { value: '09:00-11:00', label: '上午 09:00-11:00' },
    { value: '14:00-16:00', label: '下午 14:00-16:00' },
    { value: '16:00-18:00', label: '下午 16:00-18:00' },
    { value: '19:00-21:00', label: '晚上 19:00-21:00' },
  ];

  const serviceTypes = [
    '保单整理与分析',
    '家庭保障规划',
    '理赔协助与指导',
    '产品讲解与对比',
    '投保协助',
    '保单体检',
  ];

  const handleSubmit = async () => {
    if (!serviceDescription.trim()) {
      Alert.alert('提示', '请输入服务内容');
      return;
    }

    if (!address.trim()) {
      Alert.alert('提示', '请输入服务地址');
      return;
    }

    if (address.trim().length < 10) {
      Alert.alert('提示', '请输入详细的服务地址');
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

      const consultation = await bookHomeVisit({
        userId: 'user_001',
        advisorId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        address: address.trim(),
        serviceDescription: serviceDescription.trim(),
      });

      Alert.alert(
        '预约成功',
        `已成功预约${advisorName}顾问的上门服务。\n\n预约时间：${selectedDate} ${selectedTime}\n服务地址：${address.trim()}\n\n顾问会在预约前一天与您确认，请保持电话畅通。`,
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

  const isSubmitDisabled =
    !serviceDescription.trim() ||
    !address.trim() ||
    !selectedDate ||
    !selectedTime ||
    submitting;

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          上门服务预约
        </Text>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顾问信息 */}
        <View
          marginHorizontal="$4"
          marginTop="$4"
          padding="$3"
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <XStack alignItems="center" gap="$2">
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="#8B5CF6"
              justifyContent="center"
              alignItems="center"
            >
              <Home size={20} color="white" />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$text">
                {advisorName} 顾问
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                将上门为您提供专业服务
              </Text>
            </YStack>
            <View
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              backgroundColor="#8B5CF615"
            >
              <Text fontSize="$2" color="#8B5CF6" fontWeight="600">
                免费
              </Text>
            </View>
          </XStack>
        </View>

        {/* 服务内容 */}
        <YStack padding="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            服务内容 *
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$3"
          >
            <TextInput
              placeholder="请描述您需要的服务内容..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              style={{
                fontSize: 14,
                color: COLORS.text,
                textAlignVertical: 'top',
                minHeight: 80,
              }}
              value={serviceDescription}
              onChangeText={setServiceDescription}
              maxLength={300}
            />
            <Text fontSize="$2" color="$textSecondary" textAlign="right" marginTop="$2">
              {serviceDescription.length}/300
            </Text>
          </View>

          {/* 常见服务类型 */}
          <Text fontSize="$3" color="$textSecondary" marginTop="$2" marginBottom="$2">
            常见服务类型：
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {serviceTypes.map(type => (
              <Pressable
                key={type}
                onPress={() => {
                  if (serviceDescription.includes(type)) {
                    setServiceDescription(serviceDescription.replace(type, '').trim());
                  } else {
                    setServiceDescription(
                      serviceDescription ? `${serviceDescription}、${type}` : type
                    );
                  }
                }}
              >
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                  backgroundColor={
                    serviceDescription.includes(type) ? '#8B5CF6' : '$borderColor'
                  }
                >
                  <Text
                    fontSize="$2"
                    color={serviceDescription.includes(type) ? 'white' : '$text'}
                  >
                    {type}
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        {/* 服务地址 */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            服务地址 *
          </Text>
          <View
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$3"
          >
            <XStack alignItems="center" gap="$2" marginBottom="$2">
              <MapPin size={16} color={COLORS.primary} />
              <Text fontSize="$3" color={COLORS.primary}>
                当前定位（功能开发中）
              </Text>
            </XStack>
            <TextInput
              placeholder="请输入详细地址（如：xx区xx街道xx小区xx栋xx号）"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              style={{
                fontSize: 14,
                color: COLORS.text,
                textAlignVertical: 'top',
                minHeight: 60,
              }}
              value={address}
              onChangeText={setAddress}
              maxLength={200}
            />
          </View>
          <Text fontSize="$2" color="$textSecondary" marginTop="$1">
            请提供详细地址，方便顾问准时上门
          </Text>
        </YStack>

        {/* 预约日期 */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
            预约日期 * （至少提前1天）
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              {availableDates.map(date => (
                <Pressable
                  key={date.value}
                  onPress={() => setSelectedDate(date.value)}
                >
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$2"
                    backgroundColor={selectedDate === date.value ? '#8B5CF6' : '$borderColor'}
                    minWidth={80}
                    alignItems="center"
                  >
                    <XStack alignItems="center" gap="$1">
                      <Calendar
                        size={14}
                        color={selectedDate === date.value ? 'white' : COLORS.text}
                      />
                      <Text
                        fontSize="$3"
                        color={selectedDate === date.value ? 'white' : '$text'}
                        fontWeight={selectedDate === date.value ? '600' : '400'}
                      >
                        {date.label}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* 预约时间 */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$2">
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
                  paddingVertical="$2"
                  borderRadius="$2"
                  backgroundColor={selectedTime === time.value ? '#8B5CF6' : '$borderColor'}
                  minWidth={140}
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$1">
                    <Clock
                      size={14}
                      color={selectedTime === time.value ? 'white' : COLORS.text}
                    />
                    <Text
                      fontSize="$3"
                      color={selectedTime === time.value ? 'white' : '$text'}
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
          marginHorizontal="$4"
          marginBottom="$4"
          padding="$3"
          backgroundColor="#FFF7ED"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.warning}
        >
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
            上门服务说明
          </Text>
          <Text fontSize="$2" color="$text" lineHeight={20}>
            • 上门服务完全免费，无需购买会员{'\n'}
            • 顾问会在预约前一天与您电话确认{'\n'}
            • 服务时长约1-2小时，请预留充足时间{'\n'}
            • 请提前准备好相关保单和身份证件{'\n'}
            • 如需改期或取消，请至少提前1天联系{'\n'}
            • 顾问持证上岗，请放心接待
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
        padding="$4"
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        <Pressable onPress={handleSubmit} disabled={isSubmitDisabled} style={{ flex: 1 }}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={isSubmitDisabled ? '$borderColor' : '#8B5CF6'}
            justifyContent="center"
            alignItems="center"
          >
            <XStack alignItems="center" gap="$2">
              <Send size={20} color={isSubmitDisabled ? COLORS.textSecondary : 'white'} />
              <Text
                color={isSubmitDisabled ? COLORS.textSecondary : 'white'}
                fontSize="$4"
                fontWeight="600"
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

export default InsuranceHomeVisitScreen;
