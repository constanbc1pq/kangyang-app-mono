import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H1,
  H2,
  H3,
  Theme,
  ScrollView,
  Button,
} from 'tamagui';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  Leaf,
  Calendar,
  ChefHat,
  Truck,
  Heart,
  Users,
  Shield,
  Star,
  MapPin,
  Phone,
  ShoppingCart,
  Clock,
  Award,
  Target,
  Utensils,
  BookOpen,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { NutritionPlanner } from '@/components/NutritionPlanner';
import { WellnessCalendar } from '@/components/WellnessCalendar';
import { ServiceBooking } from '@/components/ServiceBooking';

export const WellnessScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeService, setActiveService] = useState('overview');

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'nutrition') {
      navigation.navigate('NutritionService' as never);
    } else {
      setActiveService(serviceId);
    }
  };

  const todayRecommendation = {
    season: "立冬",
    advice: "今日宜：清淡饮食，温补养生",
    foods: ["山药", "红枣", "枸杞", "银耳"],
    avoid: ["生冷食物", "辛辣刺激"],
  };

  const services = [
    {
      id: "nutrition",
      title: "营养配餐",
      description: "AI定制营养方案",
      icon: ChefHat,
      color: COLORS.success,
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      id: "delivery",
      title: "送餐上门",
      description: "健康餐品配送",
      icon: Truck,
      color: COLORS.primary,
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      id: "elderly",
      title: "养老服务",
      description: "专业照护服务",
      icon: Heart,
      color: COLORS.error,
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      id: "doctor",
      title: "私人医生",
      description: "1对1健康管理",
      icon: Users,
      color: COLORS.secondary,
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      id: "therapy",
      title: "康复理疗",
      description: "专业理疗服务",
      icon: Shield,
      color: COLORS.warning,
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      id: "insurance",
      title: "保险规划",
      description: "健康保障方案",
      icon: Shield,
      color: COLORS.accent,
      bgColor: "rgba(6, 182, 212, 0.1)",
    },
  ];

  const featuredServices = [
    {
      id: 1,
      title: "冬季养生汤品定制",
      provider: "康养厨房",
      price: "￥68/份",
      rating: 4.8,
      tags: ["温补", "养胃", "当季"],
      description: "根据个人体质定制的冬季养生汤品，温补脾胃，增强免疫力",
    },
    {
      id: 2,
      title: "老年营养餐配送",
      provider: "银龄膳食",
      price: "￥45/餐",
      rating: 4.9,
      tags: ["软糯", "易消化", "营养均衡"],
      description: "专为老年人设计的营养餐，质地软糯，营养丰富，易于消化",
    },
    {
      id: 3,
      title: "上门康复理疗",
      provider: "康复之家",
      price: "￥180/次",
      rating: 4.7,
      tags: ["专业", "上门", "个性化"],
      description: "专业理疗师上门服务，针对性康复训练，恢复身体机能",
    },
  ];

  const nearbyServices = [
    {
      name: "康养中心(朝阳店)",
      distance: "1.2km",
      services: ["体检", "理疗", "营养咨询"],
      rating: 4.6,
      phone: "400-123-4567",
    },
    {
      name: "银龄照护中心",
      distance: "2.1km",
      services: ["日间照料", "康复训练", "心理疏导"],
      rating: 4.8,
      phone: "400-234-5678",
    },
    {
      name: "健康管理诊所",
      distance: "0.8km",
      services: ["健康评估", "慢病管理", "营养指导"],
      rating: 4.5,
      phone: "400-345-6789",
    },
  ];

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack space="$4" padding="$4">
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <YStack>
                <H1 fontSize="$9" fontWeight="bold" color="$text">
                  品质生活
                </H1>
                <Text fontSize="$4" color="$textSecondary">
                  专业养生服务
                </Text>
              </YStack>
              <Pressable>
                <View
                  borderWidth={1}
                  borderColor={COLORS.primary}
                  backgroundColor="transparent"
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  <XStack space="$2" alignItems="center">
                    <Calendar size={16} color={COLORS.primary} />
                    <Text fontSize="$3" color={COLORS.primary}>预约服务</Text>
                  </XStack>
                </View>
              </Pressable>
            </XStack>

            {/* Today's Wellness Recommendation */}
            <View borderRadius="$6" overflow="hidden">
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 24 }}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                  <XStack space="$2" alignItems="center">
                    <Leaf size={24} color="white" />
                    <H2 fontSize="$7" fontWeight="bold" color="white">
                      养生日历
                    </H2>
                  </XStack>
                  <View
                    backgroundColor="rgba(255,255,255,0.2)"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.3)"
                  >
                    <Text fontSize="$3" color="white" fontWeight="500">
                      {todayRecommendation.season}
                    </Text>
                  </View>
                </XStack>

                <Text fontSize="$5" color="white" marginBottom="$4" lineHeight="$2">
                  {todayRecommendation.advice}
                </Text>

                <XStack space="$4">
                  <YStack flex={1}>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)" marginBottom="$2">
                      推荐食材
                    </Text>
                    <XStack flexWrap="wrap" gap="$2">
                      {todayRecommendation.foods.map((food, index) => (
                        <View
                          key={index}
                          backgroundColor="rgba(255,255,255,0.2)"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$2" color="white">
                            {food}
                          </Text>
                        </View>
                      ))}
                    </XStack>
                  </YStack>
                  <YStack flex={1}>
                    <Text fontSize="$3" color="rgba(255,255,255,0.8)" marginBottom="$2">
                      避免食用
                    </Text>
                    <XStack flexWrap="wrap" gap="$2">
                      {todayRecommendation.avoid.map((item, index) => (
                        <View
                          key={index}
                          borderWidth={1}
                          borderColor="rgba(255,255,255,0.3)"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$2" color="rgba(255,255,255,0.8)">
                            {item}
                          </Text>
                        </View>
                      ))}
                    </XStack>
                  </YStack>
                </XStack>
              </LinearGradient>
            </View>

            {/* Service Navigation */}
            <YStack space="$3">
              <H3 fontSize="$6" color="$text" fontWeight="600">
                服务分类
              </H3>
              <YStack space="$3">
                {/* First row - 2 services */}
                <XStack space="$3">
                  {services.slice(0, 2).map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <Card
                        key={service.id}
                        flex={1}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        pressStyle={{ scale: 0.98 }}
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={8}
                        elevation={4}
                        onPress={() => handleServiceClick(service.id)}
                      >
                        <View
                          width={48}
                          height={48}
                          borderRadius={12}
                          backgroundColor={service.bgColor}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$3"
                        >
                          <IconComponent size={24} color={service.color} />
                        </View>
                        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                          {service.title}
                        </H3>
                        <Text fontSize="$3" color="$textSecondary">
                          {service.description}
                        </Text>
                      </Card>
                    );
                  })}
                </XStack>

                {/* Second row - 2 services */}
                <XStack space="$3">
                  {services.slice(2, 4).map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <Card
                        key={service.id}
                        flex={1}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        pressStyle={{ scale: 0.98 }}
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={8}
                        elevation={4}
                        onPress={() => handleServiceClick(service.id)}
                      >
                        <View
                          width={48}
                          height={48}
                          borderRadius={12}
                          backgroundColor={service.bgColor}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$3"
                        >
                          <IconComponent size={24} color={service.color} />
                        </View>
                        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                          {service.title}
                        </H3>
                        <Text fontSize="$3" color="$textSecondary">
                          {service.description}
                        </Text>
                      </Card>
                    );
                  })}
                </XStack>

                {/* Third row - 2 services */}
                <XStack space="$3">
                  {services.slice(4, 6).map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <Card
                        key={service.id}
                        flex={1}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        pressStyle={{ scale: 0.98 }}
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={8}
                        elevation={4}
                        onPress={() => handleServiceClick(service.id)}
                      >
                        <View
                          width={48}
                          height={48}
                          borderRadius={12}
                          backgroundColor={service.bgColor}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$3"
                        >
                          <IconComponent size={24} color={service.color} />
                        </View>
                        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                          {service.title}
                        </H3>
                        <Text fontSize="$3" color="$textSecondary">
                          {service.description}
                        </Text>
                      </Card>
                    );
                  })}
                </XStack>
              </YStack>
            </YStack>

            {/* Featured Services */}
            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H3 fontSize="$6" color="$text" fontWeight="600">
                  精选服务
                </H3>
                <Button size="$2" chromeless>
                  <Text fontSize="$3" color="$primary">查看更多</Text>
                </Button>
              </XStack>

              <YStack space="$3">
                {featuredServices.map((service) => (
                  <Card
                    key={service.id}
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$cardBg"
                    pressStyle={{ scale: 0.98 }}
                    shadowColor="$shadow"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={8}
                    elevation={4}
                  >
                    <YStack space="$3">
                      <XStack justifyContent="space-between" alignItems="flex-start">
                        <YStack flex={1} marginRight="$3">
                          <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$1">
                            {service.title}
                          </H3>
                          <XStack space="$2" alignItems="center" marginBottom="$2">
                            <Text fontSize="$3" color="$textSecondary">
                              {service.provider}
                            </Text>
                            <XStack space="$1" alignItems="center">
                              <Star size={12} color={COLORS.warning} />
                              <Text fontSize="$2" color="$textSecondary">
                                {service.rating}
                              </Text>
                            </XStack>
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary" lineHeight="$1" marginBottom="$2">
                            {service.description}
                          </Text>
                          <XStack flexWrap="wrap" gap="$2">
                            {service.tags.map((tag, index) => (
                              <View
                                key={index}
                                backgroundColor="$surface"
                                paddingHorizontal="$2"
                                paddingVertical="$1"
                                borderRadius="$2"
                              >
                                <Text fontSize="$2" color="$primary">
                                  {tag}
                                </Text>
                              </View>
                            ))}
                          </XStack>
                        </YStack>
                        <YStack alignItems="flex-end">
                          <Text fontSize="$5" fontWeight="bold" color="$primary" marginBottom="$2">
                            {service.price}
                          </Text>
                          <Pressable>
                            <View
                              backgroundColor={COLORS.primary}
                              borderRadius="$3"
                              paddingHorizontal="$4"
                              paddingVertical="$2"
                            >
                              <Text fontSize="$3" color="white">预订</Text>
                            </View>
                          </Pressable>
                        </YStack>
                      </XStack>
                    </YStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

            {/* Nutrition Planner */}
            <NutritionPlanner />

            {/* Service Booking */}
            <ServiceBooking />

            {/* Wellness Calendar */}
            <WellnessCalendar />

            {/* Nearby Services */}
            <YStack space="$3">
              <H3 fontSize="$6" color="$text" fontWeight="600">
                附近服务
              </H3>
              <YStack space="$3">
                {nearbyServices.map((service, index) => (
                  <Card
                    key={index}
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$cardBg"
                    pressStyle={{ scale: 0.98 }}
                    shadowColor="$shadow"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={8}
                    elevation={4}
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack flex={1} marginRight="$3">
                        <XStack space="$2" alignItems="center" marginBottom="$1">
                          <H3 fontSize="$5" fontWeight="600" color="$text">
                            {service.name}
                          </H3>
                          <XStack space="$1" alignItems="center">
                            <MapPin size={12} color={COLORS.textSecondary} />
                            <Text fontSize="$2" color="$textSecondary">
                              {service.distance}
                            </Text>
                          </XStack>
                        </XStack>
                        <XStack space="$1" alignItems="center" marginBottom="$2">
                          <Star size={12} color={COLORS.warning} />
                          <Text fontSize="$3" color="$textSecondary">
                            {service.rating}分
                          </Text>
                        </XStack>
                        <XStack flexWrap="wrap" gap="$2">
                          {service.services.map((item, itemIndex) => (
                            <View
                              key={itemIndex}
                              backgroundColor="$surface"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color="$primary">
                                {item}
                              </Text>
                            </View>
                          ))}
                        </XStack>
                      </YStack>
                      <YStack alignItems="flex-end" space="$2">
                        <Button size="$3" variant="outlined" borderColor="$primary">
                          <XStack space="$1" alignItems="center">
                            <Phone size={14} color={COLORS.primary} />
                            <Text fontSize="$2" color="$primary">咨询</Text>
                          </XStack>
                        </Button>
                        <Pressable>
                          <View
                            backgroundColor={COLORS.primary}
                            borderRadius="$3"
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                          >
                            <Text fontSize="$2" color="white">预约</Text>
                          </View>
                        </Pressable>
                      </YStack>
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

            {/* Bottom padding for safe area */}
            <View height={20} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};