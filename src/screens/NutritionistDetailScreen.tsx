import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '@/constants/app';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  H2,
  H3,
  H4,
  Paragraph,
  Avatar,
  Circle,
  Separator,
} from 'tamagui';
import {
  ArrowLeft,
  Star,
  Award,
  Users,
  Calendar,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  MessageCircle,
  Video,
  Phone,
} from 'lucide-react-native';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import { getNutritionistById, Nutritionist as NutritionistType } from '@/services/nutritionistService';

interface Nutritionist {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialty: string;
  rating: number;
  consultations: number;
  avatar: string;
  description: string;
  education: string[];
  certificates: string[];
  achievements: string[];
  services: {
    type: 'consultation' | 'video' | 'phone';
    name: string;
    duration: string;
    price: number;
  }[];
  availableSlots: {
    date: string;
    slots: string[];
  }[];
  reviews: {
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

interface RouteParams {
  nutritionistId: string;
  nutritionistName?: string;
}

const NutritionistDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nutritionistId } = (route.params || { nutritionistId: '1' }) as RouteParams;

  const [isFavorited, setIsFavorited] = useState(false);
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


  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    Alert.alert(isFavorited ? '已取消收藏' : '已收藏');
  };

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

    // 跳转到订单确认页面
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
      <YStack f={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text marginTop="$3" color="$textSecondary">
          加载中...
        </Text>
      </YStack>
    );
  }

  return (
    <YStack f={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingVertical="$3"
        paddingHorizontal="$4"
        alignItems="center"
        justifyContent="space-between"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <XStack gap="$2">
          <Button
            size="$3"
            circular
            icon={() => <Heart size={20} color={isFavorited ? COLORS.primary : COLORS.textSecondary} fill={isFavorited ? COLORS.primary : 'none'} />}
            onPress={handleFavorite}
            chromeless
          />
          <Button
            size="$3"
            circular
            icon={() => <Share2 size={20} color={COLORS.textSecondary} />}
            onPress={handleShare}
            chromeless
          />
        </XStack>
      </XStack>

      <ScrollView>
        <YStack padding="$4" gap="$4">
          {/* Nutritionist Profile Card */}
          <Card bordered padding="$4">
            <XStack gap="$4" alignItems="flex-start">
              <Avatar circular size="$8">
                <Text fontSize={48}>{nutritionist.avatar}</Text>
              </Avatar>
              <YStack f={1} gap="$2">
                <XStack alignItems="center" gap="$2">
                  <H3 fontSize="$6" fontWeight="bold">
                    {nutritionist.name}
                  </H3>
                  <Card
                    backgroundColor="$green10"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color="white" fontWeight="600">
                      {nutritionist.title}
                    </Text>
                  </Card>
                </XStack>
                <Text fontSize="$3" color="$gray11">
                  {nutritionist.specialty}
                </Text>
                <XStack gap="$4" marginTop="$2">
                  <XStack gap="$1" alignItems="center">
                    <Star size={16} color="#FCD34D" fill="#FCD34D" />
                    <Text fontSize="$3" fontWeight="600">
                      {nutritionist.rating}
                    </Text>
                  </XStack>
                  <XStack gap="$1" alignItems="center">
                    <Users size={16} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$gray11">
                      {nutritionist.consultations}次咨询
                    </Text>
                  </XStack>
                  <XStack gap="$1" alignItems="center">
                    <Award size={16} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$gray11">
                      {nutritionist.experience}经验
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            </XStack>
          </Card>

          {/* Tab Navigation */}
          <XStack
            gap="$2"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            paddingBottom="$2"
          >
            <Button
              size="$3"
              theme={activeTab === 'intro' ? 'green' : undefined}
              chromeless={activeTab !== 'intro'}
              onPress={() => setActiveTab('intro')}
            >
              专家介绍
            </Button>
            <Button
              size="$3"
              theme={activeTab === 'services' ? 'green' : undefined}
              chromeless={activeTab !== 'services'}
              onPress={() => setActiveTab('services')}
            >
              服务项目
            </Button>
            <Button
              size="$3"
              theme={activeTab === 'reviews' ? 'green' : undefined}
              chromeless={activeTab !== 'reviews'}
              onPress={() => setActiveTab('reviews')}
            >
              用户评价
            </Button>
          </XStack>

          {/* Tab Content - Intro */}
          {activeTab === 'intro' && (
            <YStack gap="$4">
              {/* Description */}
              <Card bordered padding="$4">
                <H4 fontSize="$4" fontWeight="bold" marginBottom="$2">
                  专家简介
                </H4>
                <Paragraph fontSize="$3" color="$gray11" lineHeight="$5">
                  {nutritionist.description}
                </Paragraph>
              </Card>

              {/* Education */}
              <Card bordered padding="$4">
                <H4 fontSize="$4" fontWeight="bold" marginBottom="$3">
                  教育背景
                </H4>
                <YStack gap="$2">
                  {nutritionist.education.map((edu, index) => (
                    <XStack key={index} gap="$2" alignItems="flex-start">
                      <CheckCircle2 size={16} color={COLORS.success} style={{ marginTop: 2 }} />
                      <Text fontSize="$3" color="$gray11" f={1}>
                        {edu}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </Card>

              {/* Certificates */}
              <Card bordered padding="$4">
                <H4 fontSize="$4" fontWeight="bold" marginBottom="$3">
                  专业资质
                </H4>
                <YStack gap="$2">
                  {nutritionist.certificates.map((cert, index) => (
                    <XStack key={index} gap="$2" alignItems="center">
                      <Award size={16} color={COLORS.warning} />
                      <Text fontSize="$3" color="$gray11">
                        {cert}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </Card>

              {/* Achievements */}
              <Card bordered padding="$4">
                <H4 fontSize="$4" fontWeight="bold" marginBottom="$3">
                  荣誉成就
                </H4>
                <YStack gap="$2">
                  {nutritionist.achievements.map((achievement, index) => (
                    <XStack key={index} gap="$2" alignItems="flex-start">
                      <Circle size={6} backgroundColor="$green10" style={{ marginTop: 6 }} />
                      <Text fontSize="$3" color="$gray11" f={1}>
                        {achievement}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </Card>
            </YStack>
          )}

          {/* Tab Content - Services */}
          {activeTab === 'services' && (
            <YStack gap="$3">
              {nutritionist.services.map((service, index) => {
                const IconComponent = getServiceIcon(service.type);
                return (
                  <Card
                    key={index}
                    bordered
                    padding="$4"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => handleBookService(service)}
                  >
                    <XStack gap="$3" alignItems="center">
                      <Card
                        backgroundColor="$green10"
                        padding="$3"
                        borderRadius="$10"
                      >
                        <IconComponent size={24} color="white" />
                      </Card>
                      <YStack f={1} gap="$1">
                        <H4 fontSize="$4" fontWeight="bold">
                          {service.name}
                        </H4>
                        <XStack gap="$2" alignItems="center">
                          <Clock size={14} color={COLORS.textSecondary} />
                          <Text fontSize="$2" color="$gray11">
                            {service.duration}
                          </Text>
                        </XStack>
                      </YStack>
                      <YStack alignItems="flex-end" gap="$1">
                        <Text fontSize="$6" fontWeight="bold" color="$green10">
                          ¥{service.price}
                        </Text>
                        <Button size="$2" theme="green">
                          预约
                        </Button>
                      </YStack>
                    </XStack>
                  </Card>
                );
              })}

              {/* Available Slots */}
              <Card bordered padding="$4" marginTop="$2">
                <H4 fontSize="$4" fontWeight="bold" marginBottom="$3">
                  可预约时间
                </H4>
                <YStack gap="$3">
                  {nutritionist.availableSlots.map((slot, index) => (
                    <YStack key={index} gap="$2">
                      <XStack gap="$2" alignItems="center">
                        <Calendar size={16} color={COLORS.textSecondary} />
                        <Text fontSize="$3" fontWeight="600">
                          {slot.date}
                        </Text>
                      </XStack>
                      <XStack gap="$2" flexWrap="wrap">
                        {slot.slots.map((time, timeIndex) => (
                          <Card
                            key={timeIndex}
                            bordered
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$3"
                            pressStyle={{ backgroundColor: '$green10' }}
                          >
                            <Text fontSize="$2">{time}</Text>
                          </Card>
                        ))}
                      </XStack>
                    </YStack>
                  ))}
                </YStack>
              </Card>
            </YStack>
          )}

          {/* Tab Content - Reviews */}
          {activeTab === 'reviews' && (
            <YStack gap="$3">
              {/* Rating Summary */}
              <Card bordered padding="$4">
                <XStack gap="$4" alignItems="center">
                  <YStack alignItems="center" gap="$1">
                    <Text fontSize="$10" fontWeight="bold">
                      {nutritionist.rating}
                    </Text>
                    <XStack gap="$1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          color="#FCD34D"
                          fill={star <= Math.floor(nutritionist.rating) ? '#FCD34D' : 'none'}
                        />
                      ))}
                    </XStack>
                    <Text fontSize="$2" color="$gray11">
                      {nutritionist.reviews.length}条评价
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack f={1} gap="$2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = nutritionist.reviews.filter(r => Math.floor(r.rating) === rating).length;
                      const percentage = (count / nutritionist.reviews.length) * 100;
                      return (
                        <XStack key={rating} gap="$2" alignItems="center">
                          <Text fontSize="$2" color="$gray11" width={40}>
                            {rating}星
                          </Text>
                          <YStack f={1} height={8} backgroundColor="$gray5" borderRadius="$2">
                            <YStack
                              height={8}
                              width={`${percentage}%`}
                              backgroundColor="$yellow10"
                              borderRadius="$2"
                            />
                          </YStack>
                          <Text fontSize="$2" color="$gray11" width={30}>
                            {count}
                          </Text>
                        </XStack>
                      );
                    })}
                  </YStack>
                </XStack>
              </Card>

              {/* Review List */}
              {nutritionist.reviews.map((review, index) => (
                <Card key={index} bordered padding="$4">
                  <YStack gap="$2">
                    <XStack justifyContent="space-between" alignItems="center">
                      <XStack gap="$2" alignItems="center">
                        <Avatar circular size="$3">
                          <Text fontSize={16}>👤</Text>
                        </Avatar>
                        <Text fontSize="$3" fontWeight="600">
                          {review.userName}
                        </Text>
                      </XStack>
                      <Text fontSize="$2" color="$gray11">
                        {review.date}
                      </Text>
                    </XStack>
                    <XStack gap="$1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color="#FCD34D"
                          fill={star <= review.rating ? '#FCD34D' : 'none'}
                        />
                      ))}
                    </XStack>
                    <Paragraph fontSize="$3" color="$gray11" lineHeight="$4">
                      {review.comment}
                    </Paragraph>
                  </YStack>
                </Card>
              ))}
            </YStack>
          )}
        </YStack>

        {/* Bottom spacing for floating button */}
        <YStack height={80} />
      </ScrollView>

      {/* Floating Bottom Button */}
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$background"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        padding="$4"
        gap="$2"
      >
        <Button
          f={1}
          size="$4"
          theme="green"
          icon={() => <Calendar size={20} color="white" />}
          fontWeight="600"
          onPress={() => handleBookService(nutritionist.services[0])}
        >
          立即预约
        </Button>
      </XStack>

      {/* Appointment Calendar Modal */}
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