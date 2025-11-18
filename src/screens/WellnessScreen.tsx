import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  H1,
  H3,
  Theme,
  ScrollView,
  Card,
} from 'tamagui';
import { Pressable, Modal, TouchableOpacity, Alert } from 'react-native';
import { ToastViewport, useToastController } from '@tamagui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  MapPin,
  Navigation,
  X,
  Stethoscope,
  ChefHat,
  Truck,
  Heart,
  Users,
  Scale,
  Shield,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { privateDoctorService } from '@/services/privateDoctorService';
import { DoctorSubscription } from '@/types/privateDoctor';

// Feed组件导入
import {
  PersonalizedRecommendationBanner,
  generateRecommendation,
} from '@/components/wellness/PersonalizedRecommendationBanner';
import {
  TodayRecommendationCard,
  generateTodayRecommendation,
} from '@/components/wellness/TodayRecommendationCard';
import {
  UserStoryList,
  mockUserStories,
} from '@/components/wellness/UserStoryCard';
import { FreeTrialZone } from '@/components/wellness/FreeTrialZone';
import {
  ScenarioServiceSection,
  mockScenarioServices,
} from '@/components/wellness/ScenarioServiceCard';
import {
  ComboPackageList,
  mockComboPackages,
} from '@/components/wellness/ComboPackageCard';
import {
  ExpertTeamList,
  mockExperts,
} from '@/components/wellness/ExpertTeamCard';
import {
  CommunityDynamics,
  mockCommunityPosts,
} from '@/components/wellness/CommunityDynamics';

export const WellnessScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState('深圳');
  const [showCityModal, setShowCityModal] = useState(false);
  const [subscription, setSubscription] = useState<DoctorSubscription | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');
  const [subscriptionId, setSubscriptionId] = useState<string>('');
  const toast = useToastController();

  // 检查用户是否有私人医生订阅
  useFocusEffect(
    React.useCallback(() => {
      const checkSubscription = async () => {
        const userId = 'user_001'; // TODO: 实际应从认证状态获取

        console.log('🔍 WellnessScreen: 检查私人医生订阅, userId:', userId);

        // getMySubscription 已经统一从 @kangyang_orders 读取订阅数据
        const subscription = await privateDoctorService.getMySubscription(userId);

        if (subscription) {
          console.log('✅ WellnessScreen: 找到订阅数据, status:', subscription.status);
          setSubscription(subscription);
          setSubscriptionId(subscription.id);

          // 获取医生信息
          const doctor = await privateDoctorService.getDoctorById(subscription.doctorId);
          if (doctor) {
            setDoctorName(doctor.name);
            console.log('✅ WellnessScreen: 医生信息:', doctor.name);
          }
        } else {
          console.log('❌ WellnessScreen: 未找到私人医生订阅数据');
          setSubscription(null);
        }
      };

      checkSubscription();
    }, [])
  );

  // 显示toast提示
  const showToast = (message: string) => {
    toast.show(message, {
      duration: 2000,
      burntOptions: {
        preset: 'none',
        haptic: 'success',
      },
    });
  };

  // 6大服务导航处理
  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'nutrition') {
      navigation.navigate('NutritionService' as never);
    } else if (serviceId === 'delivery') {
      navigation.navigate('DeliveryService' as never);
    } else if (serviceId === 'elderly') {
      navigation.navigate('ElderlyService' as never);
    } else if (serviceId === 'doctor') {
      navigation.navigate('PrivateDoctorList' as never);
    } else if (serviceId === 'legal') {
      navigation.navigate('LegalServiceHome' as never);
    } else if (serviceId === 'insurance') {
      navigation.navigate('InsuranceHome' as never);
    }
  };

  // 已存在的Screen列表
  const existingScreens = [
    'NutritionService',
    'DeliveryService',
    'ElderlyService',
    'PrivateDoctorList',
    'LegalServiceHome',
    'InsuranceHome',
  ];

  // Feed组件导航处理 - 带fallback
  const handleNavigate = (screen: string, params?: any) => {
    if (existingScreens.includes(screen)) {
      navigation.navigate(screen as never, params as never);
    } else {
      toast.show(`${screen} 功能开发中，敬请期待`, { duration: 2000 });
    }
  };

  const handleConsult = (screen: string, params?: any) => {
    if (existingScreens.includes(screen)) {
      navigation.navigate(screen as never, params as never);
    } else {
      toast.show('咨询功能开发中，敬请期待', { duration: 2000 });
    }
  };

  // 社区动态交互处理
  const handleLike = (postId: string) => {
    toast.show('点赞成功', { duration: 1000 });
  };

  const handleComment = (postId: string) => {
    // 跳转到社区帖子详情页
    navigation.navigate('CommunityPostDetail' as never, { postId } as never);
  };

  const handleShare = (postId: string) => {
    toast.show('分享功能开发中', { duration: 2000 });
  };

  // 用户画像数据（实际应从用户状态获取）
  const userProfile = {
    age: 65,
    healthScore: 80,
    hasChronicDisease: false,
    isNewUser: false,
    livingAlone: true,
  };

  // 生成个性化推荐
  const recommendation = generateRecommendation(userProfile);

  // 生成今日推荐
  const todayRecommendation = generateTodayRecommendation(new Date());

  // 6大服务入口
  const services = [
    {
      id: 'nutrition',
      title: '营养配餐',
      description: 'AI定制营养方案',
      icon: ChefHat,
      color: COLORS.success,
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'delivery',
      title: '送餐上门',
      description: '健康餐品配送',
      icon: Truck,
      color: COLORS.primary,
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      id: 'elderly',
      title: '养老服务',
      description: '专业照护服务',
      icon: Heart,
      color: COLORS.error,
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      id: 'doctor',
      title: '私人医生',
      description: '1对1健康管理',
      icon: Users,
      color: COLORS.secondary,
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: 'legal',
      title: '遗嘱及法律',
      description: '法律咨询服务',
      icon: Scale,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: 'insurance',
      title: '保险规划',
      description: '健康保障方案',
      icon: Shield,
      color: COLORS.accent,
      bgColor: 'rgba(6, 182, 212, 0.1)',
    },
  ];

  // 热门城市列表
  const hotCities = [
    { id: '1', name: '深圳', available: true },
    { id: '2', name: '上海', available: true },
    { id: '3', name: '广州', available: true },
    { id: '4', name: '北京', available: true },
    { id: '5', name: '杭州', available: true },
    { id: '6', name: '成都', available: true },
    { id: '7', name: '南京', available: true },
    { id: '8', name: '武汉', available: true },
    { id: '9', name: '西安', available: true },
    { id: '10', name: '重庆', available: true },
    { id: '11', name: '天津', available: true },
    { id: '12', name: '苏州', available: true },
  ];

  const handleAutoLocate = () => {
    // 模拟自动定位
    Alert.alert('定位提示', '已定位到您当前城市：深圳', [
      {
        text: '确定',
        onPress: () => {
          setSelectedCity('深圳');
          setShowCityModal(false);
        },
      },
    ]);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowCityModal(false);
  };


  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack>
            {/* Header */}
            <View paddingHorizontal="$4" paddingTop="$4" paddingBottom="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <H1 fontSize="$9" fontWeight="bold" color="$text">
                    品质生活
                  </H1>
                  <Text fontSize="$4" color="$textSecondary">
                    场景化服务，品质养老
                  </Text>
                </YStack>
                <Pressable onPress={() => setShowCityModal(true)}>
                  <View
                    borderWidth={1}
                    borderColor={COLORS.primary}
                    backgroundColor="white"
                    borderRadius="$3"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                  >
                    <XStack space="$2" alignItems="center">
                      <MapPin size={16} color={COLORS.primary} />
                      <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
                        {selectedCity}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </XStack>
            </View>

            {/* 私人医生服务台Banner - VIP用户专属 */}
            {subscription && subscription.status === 'active' && (
              <View paddingHorizontal="$4">
                <Pressable
                  onPress={() =>
                    navigation.navigate('PrivateDoctorServiceDesk' as never, {
                      subscriptionId: subscriptionId || subscription.id,
                    } as never)
                  }
                >
                  <View borderRadius="$4" overflow="hidden" marginBottom={16}>
                    <LinearGradient
                      colors={['#0f172a', '#1e293b']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ padding: 16 }}
                    >
                      <XStack space="$3" alignItems="center">
                        <View
                          width={52}
                          height={52}
                          borderRadius={26}
                          backgroundColor="rgba(212, 175, 55, 0.15)"
                          borderWidth={2}
                          borderColor="rgba(212, 175, 55, 0.3)"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Stethoscope size={26} color="#d4af37" />
                        </View>
                        <YStack flex={1} space="$1">
                          <XStack space="$2" alignItems="center">
                            <Text fontSize="$4" fontWeight="700" color="white">
                              专属医生服务台
                            </Text>
                            <View
                              backgroundColor="#d4af37"
                              paddingHorizontal="$2"
                              paddingVertical="$0.5"
                              borderRadius="$2"
                            >
                              <Text fontSize={10} color="#0f172a" fontWeight="700">
                                VIP
                              </Text>
                            </View>
                          </XStack>
                          <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                            {doctorName} 医生为您服务
                          </Text>
                        </YStack>
                        <View
                          backgroundColor="rgba(212, 175, 55, 0.2)"
                          borderRadius="$2"
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderWidth={1}
                          borderColor="rgba(212, 175, 55, 0.4)"
                        >
                          <Text fontSize="$2" color="#d4af37" fontWeight="600">
                            进入
                          </Text>
                        </View>
                      </XStack>
                    </LinearGradient>
                  </View>
                </Pressable>
              </View>
            )}

            {/* 6大服务入口 */}
            <View paddingHorizontal="$4" marginBottom={16}>
              <YStack space="$3">
                <H3 fontSize="$6" color="$text" fontWeight="600">
                  服务分类
                </H3>
                <YStack space="$3">
                  {/* 第一行 - 2个服务 */}
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

                  {/* 第二行 - 2个服务 */}
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

                  {/* 第三行 - 2个服务 */}
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
            </View>

            {/* Feed流组件 */}
            {/* 1. 个性化智能推荐Banner */}
            <View paddingHorizontal="$4">
              <PersonalizedRecommendationBanner
                recommendation={recommendation}
                onPress={handleNavigate}
              />
            </View>

            {/* 2. 今日推荐大卡片 */}
            <View paddingHorizontal="$4">
              <TodayRecommendationCard
                recommendation={todayRecommendation}
                onPurchase={handleNavigate}
                onConsult={handleConsult}
              />
            </View>

            {/* 3. 用户故事 */}
            <UserStoryList stories={mockUserStories} onStoryPress={handleNavigate} />

            {/* 4. 免费体验区 */}
            <FreeTrialZone onServicePress={handleNavigate} />

            {/* 5. 场景化服务卡片 */}
            <ScenarioServiceSection
              services={mockScenarioServices}
              onServicePress={handleNavigate}
              onConsultPress={handleConsult}
            />

            {/* 6. 组合套餐 */}
            <ComboPackageList
              packages={mockComboPackages}
              onPurchase={handleNavigate}
              onCustomize={handleConsult}
            />

            {/* 7. 专家团队 */}
            <ExpertTeamList experts={mockExperts} onExpertPress={handleNavigate} />

            {/* 8. 社区动态 */}
            <CommunityDynamics
              posts={mockCommunityPosts}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onPostPress={handleNavigate}
              onViewAllPress={() => navigation.navigate('HomeTabs' as never, { screen: 'CommunityTab' } as never)}
            />

            {/* Bottom padding for safe area */}
            <View height={40} />
          </YStack>
        </ScrollView>

        {/* City Selection Modal */}
        <Modal
          visible={showCityModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCityModal(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
            onPress={() => setShowCityModal(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                backgroundColor="white"
                borderTopLeftRadius="$6"
                borderTopRightRadius="$6"
                paddingBottom={40}
              >
              {/* Modal Header */}
              <XStack
                justifyContent="space-between"
                alignItems="center"
                padding="$4"
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
              >
                <H3 fontSize="$6" fontWeight="600" color="$text">
                  选择城市
                </H3>
                <TouchableOpacity onPress={() => setShowCityModal(false)}>
                  <X size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </XStack>

              {/* Auto Locate Button */}
              <View padding="$4">
                <TouchableOpacity onPress={handleAutoLocate}>
                  <View
                    backgroundColor={COLORS.primaryLight}
                    borderRadius="$3"
                    padding="$3"
                  >
                    <XStack space="$2" alignItems="center" justifyContent="center">
                      <Navigation size={20} color="white" />
                      <Text fontSize="$4" color="white" fontWeight="600">
                        自动定位当前城市
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Hot Cities */}
              <YStack padding="$4" paddingTop="$2">
                <Text fontSize="$4" color="$textSecondary" marginBottom="$3" fontWeight="600">
                  热门城市
                </Text>
                <XStack flexWrap="wrap" gap="$3">
                  {hotCities.map((city) => (
                    <TouchableOpacity
                      key={city.id}
                      onPress={() => handleCitySelect(city.name)}
                      style={{ width: '30%' }}
                    >
                      <View
                        backgroundColor={selectedCity === city.name ? COLORS.primary : '$surface'}
                        borderRadius="$3"
                        padding="$3"
                        alignItems="center"
                        borderWidth={1}
                        borderColor={selectedCity === city.name ? COLORS.primary : '$borderColor'}
                      >
                        <Text
                          fontSize="$4"
                          color={selectedCity === city.name ? 'white' : '$text'}
                          fontWeight={selectedCity === city.name ? '600' : '400'}
                        >
                          {city.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </YStack>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <ToastViewport />
      </SafeAreaView>
    </Theme>
  );
};