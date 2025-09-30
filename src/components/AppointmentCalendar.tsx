import React, { useState, useMemo } from 'react';
import { ScrollView, Pressable, Modal } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentCalendarProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  nutritionistName: string;
  serviceType: string;
  price: number;
  occupiedSlots?: Array<{ date: string; time: string }>;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  visible,
  onClose,
  onConfirm,
  nutritionistName,
  serviceType,
  price,
  occupiedSlots = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 生成日历数据
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<Date | null> = [];

    // 填充前面的空白
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }

    // 填充当月日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  // 生成时间段（半小时间隔，9:00-18:00）
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    const isToday =
      selectedDate &&
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // 检查是否已过去（今天）
        let isPast = false;
        if (isToday) {
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          isPast = hour < currentHour || (hour === currentHour && minute <= currentMinute);
        }

        // 检查是否被占用
        const dateStr = selectedDate?.toISOString().split('T')[0];
        const isOccupied = occupiedSlots.some(
          slot => slot.date === dateStr && slot.time === timeStr
        );

        slots.push({
          time: timeStr,
          available: !isPast && !isOccupied,
        });
      }
    }

    return slots;
  }, [selectedDate, occupiedSlots]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return; // 不允许选择过去的日期

    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string, available: boolean) => {
    if (!available) return;
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    onConfirm(dateStr, selectedTime);
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View flex={1} backgroundColor="rgba(0,0,0,0.5)" justifyContent="flex-end">
        <View
          backgroundColor="$background"
          borderTopLeftRadius="$5"
          borderTopRightRadius="$5"
          maxHeight="90%"
        >
          {/* Header */}
          <XStack
            height={56}
            alignItems="center"
            paddingHorizontal="$4"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Text flex={1} fontSize="$5" fontWeight="600" color="$text">
              预约{nutritionistName}
            </Text>
            <Pressable onPress={onClose}>
              <X size={24} color={COLORS.text} />
            </Pressable>
          </XStack>

          <ScrollView>
            <YStack padding="$4" gap="$4">
              {/* 月份选择 */}
              <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$2">
                <Pressable onPress={handlePrevMonth}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="$surface"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ChevronLeft size={24} color={COLORS.text} />
                  </View>
                </Pressable>
                <Text fontSize="$5" fontWeight="700" color="$text">
                  {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                </Text>
                <Pressable onPress={handleNextMonth}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="$surface"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ChevronRight size={24} color={COLORS.text} />
                  </View>
                </Pressable>
              </XStack>

              {/* 日历 */}
              <View backgroundColor="$surface" borderRadius="$4" padding="$3">
                {/* 星期标题 */}
                <XStack marginBottom="$2">
                  {weekDays.map(day => (
                    <View key={day} flex={1} alignItems="center">
                      <Text fontSize="$2" color="$textSecondary" fontWeight="600">
                        {day}
                      </Text>
                    </View>
                  ))}
                </XStack>

                {/* 日期格子 */}
                <YStack gap="$2">
                  {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
                    <XStack key={weekIndex} gap="$2">
                      {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
                        const selected = isDateSelected(date);
                        const today = isToday(date);
                        const past = isPastDate(date);

                        return (
                          <Pressable
                            key={dayIndex}
                            onPress={() => handleDateSelect(date)}
                            disabled={!date || past}
                            style={{ flex: 1 }}
                          >
                            <View
                              flex={1}
                              height={44}
                              borderRadius="$2"
                              backgroundColor={
                                selected
                                  ? COLORS.primary
                                  : today
                                  ? COLORS.primaryLight
                                  : '$background'
                              }
                              borderWidth={today && !selected ? 2 : 0}
                              borderColor={COLORS.primary}
                              justifyContent="center"
                              alignItems="center"
                              opacity={!date || past ? 0.3 : 1}
                            >
                              {date && (
                                <Text
                                  fontSize="$3"
                                  fontWeight={selected || today ? '600' : '400'}
                                  color={selected ? 'white' : '$text'}
                                >
                                  {date.getDate()}
                                </Text>
                              )}
                            </View>
                          </Pressable>
                        );
                      })}
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 时间段选择 */}
              {selectedDate && (
                <View backgroundColor="$surface" borderRadius="$4" padding="$4">
                  <XStack alignItems="center" gap="$2" marginBottom="$3">
                    <Clock size={20} color={COLORS.primary} />
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      选择时间段
                    </Text>
                  </XStack>
                  <View
                    flexDirection="row"
                    flexWrap="wrap"
                    gap="$2"
                  >
                    {timeSlots.map(slot => {
                      const selected = selectedTime === slot.time;
                      return (
                        <Pressable
                          key={slot.time}
                          onPress={() => handleTimeSelect(slot.time, slot.available)}
                          disabled={!slot.available}
                          style={{ width: '30%' }}
                        >
                          <View
                            height={40}
                            borderRadius="$2"
                            borderWidth={2}
                            borderColor={
                              selected
                                ? COLORS.primary
                                : slot.available
                                ? '$borderColor'
                                : '$background'
                            }
                            backgroundColor={
                              selected
                                ? COLORS.primary
                                : slot.available
                                ? '$background'
                                : '$borderColor'
                            }
                            justifyContent="center"
                            alignItems="center"
                            opacity={slot.available ? 1 : 0.5}
                          >
                            <Text
                              fontSize="$2"
                              fontWeight={selected ? '600' : '400'}
                              color={
                                selected
                                  ? 'white'
                                  : slot.available
                                  ? '$text'
                                  : '$textSecondary'
                              }
                            >
                              {slot.time}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 预约信息确认 */}
              {selectedDate && selectedTime && (
                <View backgroundColor="$surface" borderRadius="$4" padding="$4">
                  <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                    预约信息确认
                  </Text>
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$textSecondary">
                        服务类型
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {serviceType}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$textSecondary">
                        预约时间
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 {selectedTime}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$textSecondary">
                        诊金
                      </Text>
                      <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                        ¥{price}
                      </Text>
                    </XStack>
                  </YStack>
                </View>
              )}

              <View height={20} />
            </YStack>
          </ScrollView>

          {/* 底部确认按钮 */}
          {selectedDate && selectedTime && (
            <View
              padding="$4"
              borderTopWidth={1}
              borderTopColor="$borderColor"
              backgroundColor="$background"
            >
              <Pressable onPress={handleConfirm}>
                <View
                  height={52}
                  borderRadius="$3"
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$5" fontWeight="700" color="white">
                    确认预约 ¥{price}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentCalendar;