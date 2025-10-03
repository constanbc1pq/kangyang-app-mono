import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
  Sheet,
} from 'tamagui';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export const ServiceBooking: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const upcomingAppointments = [
    {
      id: 1,
      service: '中医推拿',
      therapist: '李医师',
      date: '今天',
      time: '14:30',
      location: '康养中心 3楼',
      status: 'confirmed',
      avatar: '👨‍⚕️',
    },
    {
      id: 2,
      service: '艾灸理疗',
      therapist: '王医师',
      date: '明天',
      time: '10:00',
      location: '康养中心 2楼',
      status: 'pending',
      avatar: '👩‍⚕️',
    },
    {
      id: 3,
      service: '营养咨询',
      therapist: '张营养师',
      date: '3月25日',
      time: '16:00',
      location: '营养咨询室',
      status: 'confirmed',
      avatar: '👨‍🍳',
    },
  ];

  const quickBookingServices = [
    {
      name: '中医推拿',
      duration: '60分钟',
      price: '168',
      available: true,
      nextSlot: '今天 15:30',
      icon: '🙌',
    },
    {
      name: '艾灸理疗',
      duration: '45分钟',
      price: '128',
      available: true,
      nextSlot: '明天 09:00',
      icon: '🔥',
    },
    {
      name: '拔罐治疗',
      duration: '30分钟',
      price: '88',
      available: false,
      nextSlot: '3月26日 14:00',
      icon: '🥽',
    },
    {
      name: '针灸治疗',
      duration: '50分钟',
      price: '188',
      available: true,
      nextSlot: '今天 17:00',
      icon: '📍',
    },
  ];

  const therapists = [
    {
      name: '李医师',
      specialty: '中医推拿',
      experience: '15年',
      rating: 4.9,
      avatar: '👨‍⚕️',
      available: true,
    },
    {
      name: '王医师',
      specialty: '艾灸理疗',
      experience: '12年',
      rating: 4.8,
      avatar: '👩‍⚕️',
      available: true,
    },
    {
      name: '张营养师',
      specialty: '营养咨询',
      experience: '8年',
      rating: 4.7,
      avatar: '👨‍🍳',
      available: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color={COLORS.success} />;
      case 'pending':
        return <AlertCircle size={16} color={COLORS.warning} />;
      case 'cancelled':
        return <XCircle size={16} color={COLORS.error} />;
      default:
        return <Clock size={16} color={COLORS.textSecondary} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '已确认';
      case 'pending':
        return '待确认';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  return (
    <Theme name="light">
      <Card
        padding="$4"
        borderRadius="$4"
        backgroundColor="$cardBg"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={4}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <H3 fontSize="$6" color="$text" fontWeight="600">
            服务预约
          </H3>
          <Button
            size="$3"
            backgroundColor="$primary"
            onPress={() => setShowBookingForm(true)}
          >
            <XStack space="$1" alignItems="center">
              <Plus size={16} color="white" />
              <Text fontSize="$3" color="white">新预约</Text>
            </XStack>
          </Button>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$4">
            {/* 即将到来的预约 */}
            <View>
              <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
                即将到来
              </Text>
              <YStack space="$3">
                {upcomingAppointments.map((appointment) => (
                  <View
                    key={appointment.id}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderLeftWidth={4}
                    borderLeftColor={getStatusColor(appointment.status)}
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                      <XStack space="$3" alignItems="center">
                        <Text fontSize="$6">{appointment.avatar}</Text>
                        <YStack>
                          <Text fontSize="$4" fontWeight="600" color="$text">
                            {appointment.service}
                          </Text>
                          <Text fontSize="$3" color="$textSecondary">
                            {appointment.therapist}
                          </Text>
                        </YStack>
                      </XStack>
                      <XStack space="$1" alignItems="center">
                        {getStatusIcon(appointment.status)}
                        <Text fontSize="$3" color={getStatusColor(appointment.status)} fontWeight="500">
                          {getStatusText(appointment.status)}
                        </Text>
                      </XStack>
                    </XStack>

                    <XStack space="$4" marginBottom="$3">
                      <XStack space="$1" alignItems="center" flex={1}>
                        <Calendar size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {appointment.date}
                        </Text>
                      </XStack>
                      <XStack space="$1" alignItems="center" flex={1}>
                        <Clock size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {appointment.time}
                        </Text>
                      </XStack>
                    </XStack>

                    <XStack space="$1" alignItems="center" marginBottom="$3">
                      <MapPin size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {appointment.location}
                      </Text>
                    </XStack>

                    <XStack space="$2">
                      <Button flex={1} size="$3" variant="outlined" borderColor="$borderColor">
                        <Text fontSize="$3" color="$textSecondary">重新预约</Text>
                      </Button>
                      <Button flex={1} size="$3" backgroundColor="$primary">
                        <Text fontSize="$3" color="white">联系医师</Text>
                      </Button>
                    </XStack>
                  </View>
                ))}
              </YStack>
            </View>

            {/* 快速预约 */}
            <View>
              <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
                快速预约
              </Text>
              <YStack space="$3">
                {quickBookingServices.map((service, index) => (
                  <View
                    key={index}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                    opacity={service.available ? 1 : 0.6}
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <XStack space="$3" alignItems="center">
                        <Text fontSize="$6">{service.icon}</Text>
                        <YStack>
                          <Text fontSize="$4" fontWeight="600" color="$text">
                            {service.name}
                          </Text>
                          <Text fontSize="$3" color="$textSecondary">
                            {service.duration} · ¥{service.price}
                          </Text>
                        </YStack>
                      </XStack>
                      <View
                        backgroundColor={service.available ? COLORS.success : COLORS.error}
                        borderRadius="$2"
                        paddingVertical="$1"
                        paddingHorizontal="$2"
                      >
                        <Text fontSize="$1" color="white" fontWeight="500">
                          {service.available ? '可预约' : '已满'}
                        </Text>
                      </View>
                    </XStack>

                    <XStack space="$1" alignItems="center" marginBottom="$3">
                      <Clock size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        最早时间: {service.nextSlot}
                      </Text>
                    </XStack>

                    <Button
                      size="$3"
                      backgroundColor={service.available ? '$primary' : '$textSecondary'}
                      disabled={!service.available}
                      onPress={() => {
                        setSelectedService(service.name);
                        setShowBookingForm(true);
                      }}
                    >
                      <Text fontSize="$3" color="white">
                        {service.available ? '立即预约' : '暂不可约'}
                      </Text>
                    </Button>
                  </View>
                ))}
              </YStack>
            </View>

            {/* 专家团队 */}
            <View>
              <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
                专家团队
              </Text>
              <YStack space="$3">
                {therapists.map((therapist, index) => (
                  <View
                    key={index}
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <XStack space="$3" alignItems="center">
                        <Text fontSize="$8">{therapist.avatar}</Text>
                        <YStack>
                          <XStack space="$2" alignItems="center">
                            <Text fontSize="$4" fontWeight="600" color="$text">
                              {therapist.name}
                            </Text>
                            <View
                              backgroundColor={therapist.available ? COLORS.success : COLORS.error}
                              width={8}
                              height={8}
                              borderRadius={4}
                            />
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary">
                            {therapist.specialty} · {therapist.experience}经验
                          </Text>
                        </YStack>
                      </XStack>
                      <YStack alignItems="flex-end">
                        <Text fontSize="$3" color={COLORS.warning} fontWeight="600">
                          ⭐ {therapist.rating}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary">
                          评分
                        </Text>
                      </YStack>
                    </XStack>

                    <XStack space="$2" marginTop="$3">
                      <Button flex={1} size="$3" variant="outlined" borderColor="$borderColor">
                        <Text fontSize="$3" color="$textSecondary">查看详情</Text>
                      </Button>
                      <Button
                        flex={1}
                        size="$3"
                        backgroundColor={therapist.available ? '$primary' : '$textSecondary'}
                        disabled={!therapist.available}
                      >
                        <Text fontSize="$3" color="white">
                          {therapist.available ? '预约' : '休息中'}
                        </Text>
                      </Button>
                    </XStack>
                  </View>
                ))}
              </YStack>
            </View>
          </YStack>
        </ScrollView>

        {/* 预约表单弹窗 */}
        <Sheet
          modal
          open={showBookingForm}
          onOpenChange={setShowBookingForm}
          snapPointsMode="fit"
          dismissOnSnapToBottom
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" paddingBottom="$8">
            <YStack space="$4">
              <H3 fontSize="$7" fontWeight="bold" color="$text" textAlign="center">
                新建预约
              </H3>

              {selectedService ? (
                <View
                  padding="$3"
                  backgroundColor="$primary"
                  borderRadius="$3"
                  marginBottom="$2"
                >
                  <Text fontSize="$3" color="white" textAlign="center">
                    已选择服务: {selectedService}
                  </Text>
                </View>
              ) : null}

              <YStack space="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  选择日期时间
                </Text>
                <XStack space="$2">
                  {['今天', '明天', '后天'].map((day) => (
                    <Button
                      key={day}
                      flex={1}
                      size="$3"
                      variant="outlined"
                      borderColor="$borderColor"
                    >
                      <Text fontSize="$3" color="$text">{day}</Text>
                    </Button>
                  ))}
                </XStack>
              </YStack>

              <YStack space="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  选择时间段
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {['09:00', '10:30', '14:00', '15:30', '17:00'].map((time) => (
                    <Button
                      key={time}
                      size="$3"
                      variant="outlined"
                      borderColor="$borderColor"
                      marginBottom="$2"
                      minWidth="30%"
                    >
                      <Text fontSize="$3" color="$text">{time}</Text>
                    </Button>
                  ))}
                </XStack>
              </YStack>

              <YStack space="$2">
                <Button backgroundColor="$primary" size="$4">
                  <Text fontSize="$4" color="white" fontWeight="600">确认预约</Text>
                </Button>
                <Button
                  size="$4"
                  backgroundColor="$textSecondary"
                  onPress={() => setShowBookingForm(false)}
                >
                  <Text fontSize="$4" color="white">取消</Text>
                </Button>
              </YStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </Card>
    </Theme>
  );
};