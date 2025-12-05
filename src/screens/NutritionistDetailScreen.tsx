/**
 * NutritionistDetailScreen 营养师详情页
 * 展示营养师信息、服务项目和用户评价
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState } from 'react';
import { Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  YStack,
  XStack,
  Text,
  View,
  useTheme,
} from 'tamagui';
import {
  ArrowLeft,
  Star,
  Award,
  Users,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  MessageCircle,
  Video,
  Phone,
} from 'lucide-react-native';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import { getNutritionistById, Nutritionist as NutritionistType } from '@/services/nutritionistService';

interface RouteParams {
  nutritionistId: string;
  nutritionistName?: string;
}

const NutritionistDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { nutritionistId } = (route.params || { nutritionistId: '1' }) as RouteParams;

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color12 = theme.color12?.val;
  const color10 = theme.color10?.val;

  const [activeTab, setActiveTab] = useState<'intro' | 'services' | 'reviews'>('intro');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedService, setSelectedService] = useState<NutritionistType['services'][0] | null>(null);
  const [nutritionist, setNutritionist] = useState<NutritionistType | null>(null);
  const [loading, setLoading] = useState(true);

  // 加载营养师数据
  useFocusEffect(
    React.useCallback(() => {
      const loadNutritionist = async () => {
        setLoading(true);
        const data = await getNutritionistById(nutritionistId);
        setNutritionist(data);
        setLoading(false);
      };
      loadNutritionist();
    }, [nutritionistId])
  );

  const handleShare = () => {
    Alert.alert('分享', '分享营养师信息');
  };

  const handleBookService = (service: NutritionistType['services'][0]) => {
    setSelectedService(service);
    setShowAppointmentModal(true);
  };

  const handleAppointmentConfirm = (date: string, time: string) => {
    if (!selectedService || !nutritionist) return;

    setShowAppointmentModal(false);

    navigation.navigate('Checkout' as never, {
      itemType: 'consultation',
      itemId: `consultation_${nutritionist.id}_${Date.now()}`,
      itemName: selectedService.name,
      price: selectedService.price,
      providerId: nutritionist.id,
      providerName: nutritionist.name,
      serviceType: selectedService.name,
      appointmentDate: date,
      appointmentTime: time,
      duration: parseInt(selectedService.duration),
    } as never);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return MessageCircle;
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      default:
        return MessageCircle;
    }
  };

  // Loading state
  if (loading || !nutritionist) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
        <Text marginTop="$2" color="$color10">
          加载中...
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* TitleBar */}
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
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            营养师详情
          </Text>
          <Pressable onPress={handleShare}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <Share2 size={20} color={color10} />
            </View>
          </Pressable>
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* 营养师信息卡片 */}
          <View
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            padding="$2"
          >
            <XStack gap="$2" alignItems="flex-start">
              <View
                width={72}
                height={72}
                borderRadius={36}
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={40}>{nutritionist.avatar}</Text>
              </View>
              <YStack flex={1} gap="$1">
                <XStack alignItems="center" gap="$2">
                  <Text fontSize="$5" fontWeight="700" color="$color12">
                    {nutritionist.name}
                  </Text>
                  <View
                    backgroundColor="$primary"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize="$1" color="white" fontWeight="600">
                      {nutritionist.title}
                    </Text>
                  </View>
                </XStack>
                <Text fontSize="$3" color="$color10">
                  {nutritionist.specialty}
                </Text>
                <XStack gap="$3" marginTop="$1">
                  <XStack gap="$1" alignItems="center">
                    <Star size={14} color={warningColor} fill={warningColor} />
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {nutritionist.rating}
                    </Text>
                  </XStack>
                  <XStack gap="$1" alignItems="center">
                    <Users size={14} color={color10} />
                    <Text fontSize="$3" color="$color10">
                      {nutritionist.consultations}次咨询
                    </Text>
                  </XStack>
                  <XStack gap="$1" alignItems="center">
                    <Award size={14} color={color10} />
                    <Text fontSize="$3" color="$color10">
                      {nutritionist.experience}经验
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            </XStack>
          </View>

          {/* Tab 导航 */}
          <View
            backgroundColor="$color4"
            borderRadius="$4"
            padding="$1"
          >
            <XStack>
              {(['intro', 'services', 'reviews'] as const).map((tab) => (
                <Pressable
                  key={tab}
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab(tab)}
                >
                  <View
                    height={36}
                    backgroundColor={activeTab === tab ? '$primary' : 'transparent'}
                    borderRadius="$3"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === tab ? 'white' : '$color10'}
                      fontWeight={activeTab === tab ? '600' : '400'}
                    >
                      {tab === 'intro' ? '专家介绍' : tab === 'services' ? '服务项目' : '用户评价'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </View>

          {/* Tab 内容 - 专家介绍 */}
          {activeTab === 'intro' && (
            <YStack gap="$2">
              {/* 专家简介 */}
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  专家简介
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={22}>
                  {nutritionist.description}
                </Text>
              </View>

              {/* 教育背景 */}
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  教育背景
                </Text>
                <YStack gap="$1.5">
                  {nutritionist.education.map((edu, index) => (
                    <XStack key={index} gap="$2" alignItems="flex-start">
                      <CheckCircle2 size={16} color={successColor} style={{ marginTop: 2 }} />
                      <Text fontSize="$3" color="$color10" flex={1}>
                        {edu}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 专业资质 */}
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  专业资质
                </Text>
                <YStack gap="$1.5">
                  {nutritionist.certificates.map((cert, index) => (
                    <XStack key={index} gap="$2" alignItems="center">
                      <Award size={16} color={warningColor} />
                      <Text fontSize="$3" color="$color10">
                        {cert}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 荣誉成就 */}
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  荣誉成就
                </Text>
                <YStack gap="$1.5">
                  {nutritionist.achievements.map((achievement, index) => (
                    <XStack key={index} gap="$2" alignItems="flex-start">
                      <View
                        width={6}
                        height={6}
                        borderRadius={3}
                        backgroundColor="$primary"
                        marginTop={6}
                      />
                      <Text fontSize="$3" color="$color10" flex={1}>
                        {achievement}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>
            </YStack>
          )}

          {/* Tab 内容 - 服务项目 */}
          {activeTab === 'services' && (
            <YStack gap="$2">
              {nutritionist.services.map((service, index) => {
                const IconComponent = getServiceIcon(service.type);
                return (
                  <Pressable key={index} onPress={() => handleBookService(service)}>
                    <View
                      backgroundColor="$color2"
                      borderRadius="$5"
                      borderWidth={1}
                      borderColor="$color5"
                      padding="$2"
                    >
                      <XStack gap="$2" alignItems="center">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${primaryColor}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={24} color={primaryColor} />
                        </View>
                        <YStack flex={1} gap="$0.5">
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            {service.name}
                          </Text>
                          <XStack gap="$1" alignItems="center">
                            <Clock size={14} color={color10} />
                            <Text fontSize="$2" color="$color10">
                              {service.duration}
                            </Text>
                          </XStack>
                        </YStack>
                        <YStack alignItems="flex-end" gap="$1">
                          <Text fontSize="$5" fontWeight="700" color="$primary">
                            ¥{service.price}
                          </Text>
                          <View
                            backgroundColor="$primary"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$10"
                          >
                            <Text fontSize="$2" color="white" fontWeight="500">
                              预约
                            </Text>
                          </View>
                        </YStack>
                      </XStack>
                    </View>
                  </Pressable>
                );
              })}

              {/* 可预约时间 */}
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  可预约时间
                </Text>
                <YStack gap="$2">
                  {nutritionist.availableSlots.map((slot, index) => (
                    <YStack key={index} gap="$1.5">
                      <XStack gap="$1" alignItems="center">
                        <Calendar size={14} color={color10} />
                        <Text fontSize="$3" fontWeight="600" color="$color12">
                          {slot.date}
                        </Text>
                      </XStack>
                      <XStack gap="$1.5" flexWrap="wrap">
                        {slot.slots.map((time, timeIndex) => (
                          <View
                            key={timeIndex}
                            backgroundColor="$color4"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$3"
                          >
                            <Text fontSize="$2" color="$color10">{time}</Text>
                          </View>
                        ))}
                      </XStack>
                    </YStack>
                  ))}
                </YStack>
              </View>
            </YStack>
          )}

          {/* Tab 内容 - 用户评价 */}
          {activeTab === 'reviews' && (
            <YStack gap="$2">
              {/* 评分概览 */}
              <View
                backgroundColor="$color2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                padding="$2"
              >
                <XStack gap="$3" alignItems="center">
                  <YStack alignItems="center" gap="$1">
                    <Text fontSize="$8" fontWeight="700" color="$color12">
                      {nutritionist.rating}
                    </Text>
                    <XStack gap="$0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color={warningColor}
                          fill={star <= Math.floor(nutritionist.rating) ? warningColor : 'transparent'}
                        />
                      ))}
                    </XStack>
                    <Text fontSize="$2" color="$color10">
                      {nutritionist.reviews.length}条评价
                    </Text>
                  </YStack>
                  <View width={1} height={60} backgroundColor="$color5" />
                  <YStack flex={1} gap="$1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = nutritionist.reviews.filter(r => Math.floor(r.rating) === rating).length;
                      const percentage = nutritionist.reviews.length > 0
                        ? (count / nutritionist.reviews.length) * 100
                        : 0;
                      return (
                        <XStack key={rating} gap="$2" alignItems="center">
                          <Text fontSize="$2" color="$color10" width={30}>{rating}星</Text>
                          <View flex={1} height={6} backgroundColor="$color5" borderRadius="$2">
                            <View
                              height={6}
                              width={`${percentage}%`}
                              backgroundColor="$warning"
                              borderRadius="$2"
                            />
                          </View>
                        </XStack>
                      );
                    })}
                  </YStack>
                </XStack>
              </View>

              {/* 评价列表 */}
              {nutritionist.reviews.map((review, index) => (
                <View
                  key={index}
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                  padding="$2"
                >
                  <YStack gap="$1.5">
                    <XStack justifyContent="space-between" alignItems="center">
                      <XStack gap="$2" alignItems="center">
                        <View
                          width={32}
                          height={32}
                          borderRadius={16}
                          backgroundColor="$color4"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize={14}>👤</Text>
                        </View>
                        <Text fontSize="$3" fontWeight="600" color="$color12">
                          {review.userName}
                        </Text>
                      </XStack>
                      <Text fontSize="$2" color="$color10">
                        {review.date}
                      </Text>
                    </XStack>
                    <XStack gap="$0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          color={warningColor}
                          fill={star <= review.rating ? warningColor : 'transparent'}
                        />
                      ))}
                    </XStack>
                    <Text fontSize="$3" color="$color10" lineHeight={20}>
                      {review.comment}
                    </Text>
                  </YStack>
                </View>
              ))}
            </YStack>
          )}
        </YStack>

        {/* 底部安全区域 */}
        <View height={40} />
      </ScrollView>

      {/* 底部操作栏暂时隐藏
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        paddingBottom={insets.bottom + 8}
      >
        <Pressable onPress={() => handleBookService(nutritionist.services[0])}>
          <View
            backgroundColor="$primary"
            paddingVertical="$3"
            borderRadius="$10"
            alignItems="center"
          >
            <XStack gap="$2" alignItems="center">
              <Calendar size={20} color="white" />
              <Text color="white" fontSize="$4" fontWeight="600">
                立即预约
              </Text>
            </XStack>
          </View>
        </Pressable>
      </View>
      */}

      {/* 预约日历弹窗 */}
      {selectedService && (
        <AppointmentCalendar
          visible={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          onConfirm={handleAppointmentConfirm}
          nutritionistName={nutritionist.name}
          serviceType={selectedService.name}
          price={selectedService.price}
          occupiedSlots={[]}
        />
      )}
    </YStack>
  );
};

export default NutritionistDetailScreen;
