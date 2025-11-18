/**
 * 预约问诊界面
 * Book Consultation Screen
 *
 * Phase 23.3: 预约问诊功能
 * - 问诊方式选择（视频/到院/上门）
 * - 医生空闲日历
 * - 时间段选择（精确到半小时）
 * - 问诊信息填写
 * - 预约确认
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Video,
  Hospital,
  Home,
  Check,
  ChevronLeft,
  Upload,
  AlertCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface ConsultationType {
  id: 'video' | 'in_person' | 'home_visit';
  title: string;
  duration: string;
  description: string;
  icon: any;
  price: number;
  available: boolean;
  badge?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ConsultationForm {
  type: ConsultationType['id'] | null;
  date: string | null;
  timeSlot: string | null;
  chiefComplaint: string;
  duration: string;
  accompanyingSymptoms: string;
  documents: string[];
}

const CONSULTATION_TYPES: ConsultationType[] = [
  {
    id: 'video',
    title: '视频问诊',
    duration: '30-45分钟',
    description: '远程视频咨询，足不出户即可获得专业医疗建议',
    icon: Video,
    price: 500,
    available: true,
  },
  {
    id: 'in_person',
    title: '到院面诊',
    duration: '60分钟',
    description: 'VIP诊区面对面咨询，享受私密舒适的就诊环境',
    icon: Hospital,
    price: 1000,
    available: true,
    badge: 'VIP诊区',
  },
  {
    id: 'home_visit',
    title: '上门出诊',
    duration: '60-90分钟',
    description: '医生上门提供诊疗服务，适合行动不便的患者',
    icon: Home,
    price: 3000,
    available: true,
    badge: '尊享版',
  },
];

// Generate next 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
        date.getDay()
      ],
      day: date.getDate(),
      isToday: i === 0,
      hasSlots: Math.random() > 0.3, // Randomly generate availability
    });
  }
  return dates;
};

const TIME_SLOTS: { period: string; slots: TimeSlot[] }[] = [
  {
    period: '上午',
    slots: [
      { time: '08:00', available: true },
      { time: '08:30', available: false },
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: false },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
    ],
  },
  {
    period: '下午',
    slots: [
      { time: '14:00', available: true },
      { time: '14:30', available: true },
      { time: '15:00', available: false },
      { time: '15:30', available: true },
      { time: '16:00', available: true },
      { time: '16:30', available: false },
      { time: '17:00', available: true },
      { time: '17:30', available: true },
    ],
  },
  {
    period: '晚上',
    slots: [
      { time: '18:00', available: true },
      { time: '18:30', available: false },
      { time: '19:00', available: true },
      { time: '19:30', available: true },
      { time: '20:00', available: false },
    ],
  },
];

const BookConsultationScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { doctorId, doctorName, doctorAvatar } = route.params || {
    doctorId: 'doctor_001',
    doctorName: '张伟医生',
    doctorAvatar: 'https://via.placeholder.com/100',
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<ConsultationForm>({
    type: null,
    date: null,
    timeSlot: null,
    chiefComplaint: '',
    duration: '',
    accompanyingSymptoms: '',
    documents: [],
  });

  const dates = generateDates();

  const handleTypeSelect = (type: ConsultationType['id']) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const handleDateSelect = (date: string) => {
    setForm((prev) => ({ ...prev, date, timeSlot: null }));
  };

  const handleTimeSlotSelect = (time: string) => {
    setForm((prev) => ({ ...prev, timeSlot: time }));
  };

  const handleDocumentUpload = () => {
    Alert.alert('上传文件', '请选择要上传的病历或报告', [
      {
        text: '拍照',
        onPress: () => {
          setForm((prev) => ({
            ...prev,
            documents: [...prev.documents, 'document_' + Date.now()],
          }));
          Alert.alert('成功', '文件已上传');
        },
      },
      {
        text: '从相册选择',
        onPress: () => {
          setForm((prev) => ({
            ...prev,
            documents: [...prev.documents, 'document_' + Date.now()],
          }));
          Alert.alert('成功', '文件已上传');
        },
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleConfirmBooking = () => {
    // Validate form
    if (!form.type || !form.date || !form.timeSlot || !form.chiefComplaint) {
      Alert.alert('提示', '请完整填写预约信息');
      return;
    }

    const selectedType = CONSULTATION_TYPES.find((t) => t.id === form.type);

    Alert.alert(
      '预约成功',
      `已成功预约${selectedType?.title}\n\n时间：${form.date} ${form.timeSlot}\n医生：${doctorName}\n\n我们将通过短信和推送通知提醒您`,
      [
        {
          text: '查看详情',
          onPress: () => {
            navigation.navigate('ConsultationList');
          },
        },
        {
          text: '返回服务台',
          onPress: () => {
            navigation.navigate('PrivateDoctorServiceDesk');
          },
        },
      ]
    );
  };

  const canProceedToStep2 = form.type !== null;
  const canProceedToStep3 = form.date !== null && form.timeSlot !== null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="600">
            预约问诊
          </Text>
          <View width={24} />
        </XStack>

        {/* Progress Indicator */}
        <XStack space="$2" marginTop="$4">
          <View flex={1} height={4} backgroundColor={COLORS.primary} borderRadius={2} />
          <View
            flex={1}
            height={4}
            backgroundColor={step >= 2 ? COLORS.primary : '$gray4'}
            borderRadius={2}
          />
          <View
            flex={1}
            height={4}
            backgroundColor={step >= 3 ? COLORS.primary : '$gray4'}
            borderRadius={2}
          />
        </XStack>
        <XStack justifyContent="space-between" marginTop="$2">
          <Text fontSize={12} color={step >= 1 ? COLORS.primary : '$gray10'}>
            选择方式
          </Text>
          <Text fontSize={12} color={step >= 2 ? COLORS.primary : '$gray10'}>
            选择时间
          </Text>
          <Text fontSize={12} color={step >= 3 ? COLORS.primary : '$gray10'}>
            填写信息
          </Text>
        </XStack>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Step 1: Select Consultation Type */}
        {step === 1 && (
          <YStack space="$4">
            <View>
              <Text fontSize={18} fontWeight="600" marginBottom="$2">
                选择问诊方式
              </Text>
              <Text fontSize={14} color="$gray11">
                根据您的需求选择合适的问诊方式
              </Text>
            </View>

            {CONSULTATION_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = form.type === type.id;

              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => handleTypeSelect(type.id)}
                  disabled={!type.available}
                >
                  <View
                    padding="$4"
                    backgroundColor={isSelected ? '#E8F5FF' : '$surface'}
                    borderRadius="$4"
                    borderWidth={2}
                    borderColor={isSelected ? COLORS.primary : '$borderColor'}
                    opacity={type.available ? 1 : 0.5}
                  >
                    <XStack justifyContent="space-between" alignItems="flex-start">
                      <XStack space="$3" flex={1}>
                        <View
                          width={48}
                          height={48}
                          backgroundColor={isSelected ? COLORS.primary : '$gray4'}
                          borderRadius={24}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Icon size={24} color={isSelected ? 'white' : COLORS.text} />
                        </View>
                        <YStack flex={1} space="$1">
                          <XStack space="$2" alignItems="center">
                            <Text fontSize={17} fontWeight="600">
                              {type.title}
                            </Text>
                            {type.badge && (
                              <View
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                backgroundColor="#FFF4E6"
                                borderRadius="$2"
                              >
                                <Text fontSize={11} color="#FF9800" fontWeight="600">
                                  {type.badge}
                                </Text>
                              </View>
                            )}
                          </XStack>
                          <Text fontSize={14} color="$gray11">
                            {type.duration}
                          </Text>
                          <Text fontSize={13} color="$gray10" marginTop="$2">
                            {type.description}
                          </Text>
                          <Text fontSize={16} fontWeight="600" color={COLORS.primary} marginTop="$2">
                            ¥{type.price}
                          </Text>
                        </YStack>
                      </XStack>
                      {isSelected && (
                        <View
                          width={24}
                          height={24}
                          backgroundColor={COLORS.primary}
                          borderRadius={12}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Check size={16} color="white" />
                        </View>
                      )}
                    </XStack>
                  </View>
                </TouchableOpacity>
              );
            })}
          </YStack>
        )}

        {/* Step 2: Select Date and Time */}
        {step === 2 && (
          <YStack space="$4">
            <View>
              <Text fontSize={18} fontWeight="600" marginBottom="$2">
                选择日期和时间
              </Text>
              <Text fontSize={14} color="$gray11">
                请选择您方便的时间进行预约
              </Text>
            </View>

            {/* Date Selector */}
            <YStack space="$3">
              <Text fontSize={16} fontWeight="600">
                选择日期
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$2">
                  {dates.slice(0, 14).map((dateObj) => {
                    const isSelected = form.date === dateObj.date;
                    return (
                      <TouchableOpacity
                        key={dateObj.date}
                        onPress={() =>
                          dateObj.hasSlots && handleDateSelect(dateObj.date)
                        }
                        disabled={!dateObj.hasSlots}
                      >
                        <View
                          width={70}
                          padding="$3"
                          backgroundColor={
                            isSelected ? COLORS.primary : dateObj.hasSlots ? '$surface' : '$gray3'
                          }
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={
                            isSelected ? COLORS.primary : '$borderColor'
                          }
                          alignItems="center"
                          opacity={dateObj.hasSlots ? 1 : 0.5}
                        >
                          <Text
                            fontSize={12}
                            color={isSelected ? 'white' : '$gray11'}
                            marginBottom="$1"
                          >
                            {dateObj.dayOfWeek}
                          </Text>
                          <Text
                            fontSize={20}
                            fontWeight="600"
                            color={isSelected ? 'white' : COLORS.text}
                          >
                            {dateObj.day}
                          </Text>
                          {dateObj.isToday && (
                            <Text fontSize={10} color={isSelected ? 'white' : COLORS.primary}>
                              今天
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </XStack>
              </ScrollView>
            </YStack>

            {/* Time Slot Selector */}
            {form.date && (
              <YStack space="$3">
                <Text fontSize={16} fontWeight="600">
                  选择时间段
                </Text>
                {TIME_SLOTS.map((period) => (
                  <YStack key={period.period} space="$2">
                    <Text fontSize={14} color="$gray11" fontWeight="500">
                      {period.period}
                    </Text>
                    <XStack space="$2" flexWrap="wrap">
                      {period.slots.map((slot) => {
                        const isSelected = form.timeSlot === slot.time;
                        return (
                          <TouchableOpacity
                            key={slot.time}
                            onPress={() =>
                              slot.available && handleTimeSlotSelect(slot.time)
                            }
                            disabled={!slot.available}
                            style={{ marginBottom: 8 }}
                          >
                            <View
                              paddingHorizontal="$4"
                              paddingVertical="$3"
                              backgroundColor={
                                isSelected
                                  ? COLORS.primary
                                  : slot.available
                                  ? '$surface'
                                  : '$gray3'
                              }
                              borderRadius="$3"
                              borderWidth={1}
                              borderColor={
                                isSelected ? COLORS.primary : '$borderColor'
                              }
                              minWidth={80}
                              alignItems="center"
                              opacity={slot.available ? 1 : 0.5}
                            >
                              <Text
                                fontSize={14}
                                fontWeight={isSelected ? '600' : '400'}
                                color={isSelected ? 'white' : COLORS.text}
                              >
                                {slot.time}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </XStack>
                  </YStack>
                ))}
              </YStack>
            )}
          </YStack>
        )}

        {/* Step 3: Fill in Details */}
        {step === 3 && (
          <YStack space="$4">
            <View>
              <Text fontSize={18} fontWeight="600" marginBottom="$2">
                填写问诊信息
              </Text>
              <Text fontSize={14} color="$gray11">
                详细的信息有助于医生更准确地了解您的情况
              </Text>
            </View>

            {/* Chief Complaint */}
            <YStack space="$2">
              <XStack space="$1">
                <Text fontSize={15} fontWeight="600">
                  主诉症状
                </Text>
                <Text fontSize={15} color="#FF5252">
                  *
                </Text>
              </XStack>
              <View
                backgroundColor="$surface"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                padding="$3"
              >
                <RNTextInput
                  value={form.chiefComplaint}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, chiefComplaint: text }))
                  }
                  placeholder="请描述您的主要症状"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  style={{
                    fontSize: 15,
                    color: COLORS.text,
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
              <Text fontSize={12} color="$gray10">
                {form.chiefComplaint.length}/500
              </Text>
            </YStack>

            {/* Duration */}
            <YStack space="$2">
              <Text fontSize={15} fontWeight="600">
                持续时间
              </Text>
              <View
                backgroundColor="$surface"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                padding="$3"
              >
                <RNTextInput
                  value={form.duration}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, duration: text }))
                  }
                  placeholder="例如：3天、1周、2个月"
                  placeholderTextColor="#999"
                  style={{ fontSize: 15, color: COLORS.text }}
                />
              </View>
            </YStack>

            {/* Accompanying Symptoms */}
            <YStack space="$2">
              <Text fontSize={15} fontWeight="600">
                伴随症状
              </Text>
              <View
                backgroundColor="$surface"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                padding="$3"
              >
                <RNTextInput
                  value={form.accompanyingSymptoms}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, accompanyingSymptoms: text }))
                  }
                  placeholder="有无其他伴随症状（可选）"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  maxLength={300}
                  style={{
                    fontSize: 15,
                    color: COLORS.text,
                    minHeight: 60,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
            </YStack>

            {/* Document Upload */}
            <YStack space="$2">
              <Text fontSize={15} fontWeight="600">
                上传资料（可选）
              </Text>
              <Text fontSize={13} color="$gray11">
                病历、检查报告等相关资料
              </Text>
              <TouchableOpacity onPress={handleDocumentUpload}>
                <View
                  padding="$4"
                  backgroundColor="$surface"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderStyle="dashed"
                  alignItems="center"
                >
                  <Upload size={32} color="$gray10" />
                  <Text fontSize={14} color="$gray11" marginTop="$2">
                    点击上传文件
                  </Text>
                </View>
              </TouchableOpacity>

              {form.documents.length > 0 && (
                <YStack space="$2" marginTop="$2">
                  {form.documents.map((doc, idx) => (
                    <XStack
                      key={doc}
                      padding="$3"
                      backgroundColor="$gray2"
                      borderRadius="$3"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <XStack space="$2" alignItems="center">
                        <FileText size={20} color={COLORS.primary} />
                        <Text fontSize={14}>文件 {idx + 1}</Text>
                      </XStack>
                      <TouchableOpacity
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== idx),
                          }));
                        }}
                      >
                        <Text fontSize={14} color="#FF5252">
                          删除
                        </Text>
                      </TouchableOpacity>
                    </XStack>
                  ))}
                </YStack>
              )}
            </YStack>

            {/* Notice */}
            <View
              padding="$3"
              backgroundColor="#FFF4E6"
              borderRadius="$3"
              borderWidth={1}
              borderColor="#FFE0B2"
            >
              <XStack space="$2" alignItems="flex-start">
                <AlertCircle size={20} color="#FF9800" style={{ marginTop: 2 }} />
                <YStack flex={1} space="$1">
                  <Text fontSize={14} fontWeight="600" color="#E65100">
                    预约须知
                  </Text>
                  <Text fontSize={13} color="#E65100" lineHeight={20}>
                    • 预约成功后将通过短信和推送通知提醒{'\n'}
                    • 请提前5分钟做好准备{'\n'}
                    • 如需取消，请至少提前2小时联系客服{'\n'}
                    • 视频问诊需确保网络通畅
                  </Text>
                </YStack>
              </XStack>
            </View>
          </YStack>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      <View
        padding="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        <XStack space="$3">
          {step > 1 && (
            <Button
              flex={1}
              size="$5"
              backgroundColor="$surface"
              color={COLORS.text}
              borderRadius="$3"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
            >
              上一步
            </Button>
          )}
          <Button
            flex={step > 1 ? 2 : 1}
            size="$5"
            backgroundColor={
              (step === 1 && !canProceedToStep2) ||
              (step === 2 && !canProceedToStep3)
                ? '$gray8'
                : COLORS.primary
            }
            color="white"
            borderRadius="$3"
            fontWeight="600"
            onPress={() => {
              if (step === 1 && canProceedToStep2) {
                setStep(2);
              } else if (step === 2 && canProceedToStep3) {
                setStep(3);
              } else if (step === 3) {
                handleConfirmBooking();
              }
            }}
            disabled={
              (step === 1 && !canProceedToStep2) ||
              (step === 2 && !canProceedToStep3)
            }
          >
            {step === 3 ? '确认预约' : '下一步'}
          </Button>
        </XStack>
      </View>
    </SafeAreaView>
  );
};

export default BookConsultationScreen;
