/**
 * WellnessScreen "养"页面首页
 * 养生内容平台 + 品质生活服务
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  ScrollView,
  useTheme,
} from 'tamagui';
import { Pressable, StyleSheet } from 'react-native';
import { ToastViewport, useToastController } from '@tamagui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  LayoutGrid,
  Stethoscope,
  ChefHat,
  Truck,
  Heart,
  Users,
  Scale,
  Shield,
} from 'lucide-react-native';
import { getDailyQuote } from '@/constants/wisdomQuotes';
import { privateDoctorService } from '@/services/privateDoctorService';
import { DoctorSubscription } from '@/types/privateDoctor';
import { getSliderRecipes, SliderRecipe } from '@/services/recipeRecommendService';
import { getColumns } from '@/services/columnService';
import { getCurrentTheme } from '@/services/themeService';
import { Column } from '@/types/column';
import { Theme as WellnessTheme } from '@/types/theme';
import { BottomSheet } from '@/components/BottomSheet';
import { WellnessCalendarCard } from '@/components/WellnessCalendarCard';
import { RecipeSlider } from '@/components/RecipeSlider';
import { ThemeBanner } from '@/components/ThemeBanner';
import { ColumnEntryBar } from '@/components/ColumnEntryBar';
import { VIPServiceBar } from '@/components/VIPServiceBar';

// Feed入口橱窗组件导入
import { FeedBanner, FeedEntryGrid, RankingCard, ActivitySlider } from '@/components/feed';
import {
  FeedEntry,
  RankingList,
  RankingItem,
  Activity,
  isHotSalesItem,
  isPopularExpertItem,
  isHotTopicItem,
} from '@/types/feed';
import {
  getMainBanner,
  getEntryCards,
  getHotSalesRanking,
  getPopularExpertsRanking,
  getHotTopicsRanking,
  getNearbyServicesRanking,
  getActivities,
} from '@/services/feedService';

// 服务类型定义
interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  colorKey: 'success' | 'primary' | 'error' | 'secondary' | 'accent' | 'warning';
}

export const WellnessScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [subscription, setSubscription] = useState<DoctorSubscription | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');
  const [subscriptionId, setSubscriptionId] = useState<string>('');
  const [sliderRecipes, setSliderRecipes] = useState<SliderRecipe[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [currentTheme, setCurrentTheme] = useState<WellnessTheme | null>(null);
  const toast = useToastController();

  // Feed入口橱窗数据
  const [mainBanner, setMainBanner] = useState<FeedEntry | null>(null);
  const [entryCards, setEntryCards] = useState<FeedEntry[]>([]);
  const [hotSalesRanking, setHotSalesRanking] = useState<RankingList | null>(null);
  const [popularExpertsRanking, setPopularExpertsRanking] = useState<RankingList | null>(null);
  const [hotTopicsRanking, setHotTopicsRanking] = useState<RankingList | null>(null);
  const [nearbyServicesRanking, setNearbyServicesRanking] = useState<RankingList | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  // 每日国学名句（使用useMemo保证每天相同）
  const dailyQuote = React.useMemo(() => getDailyQuote(), []);

  // 主题色
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const secondaryColor = theme.secondary?.val;
  const accentColor = theme.accent?.val;
  const warningColor = theme.warning?.val;

  // 渐变背景颜色：左上浅绿 -> 右下暗紫（与康页面保持一致）
  const gradientColors = ['#d6dece', '#e8e6eb', primaryColor] as const;

  // 服务颜色映射
  const getServiceColor = (colorKey: Service['colorKey']) => {
    const colorMap = {
      success: successColor,
      primary: primaryColor,
      error: errorColor,
      secondary: secondaryColor,
      accent: accentColor,
      warning: warningColor,
    };
    return colorMap[colorKey];
  };

  // 加载页面数据
  useFocusEffect(
    React.useCallback(() => {
      const checkSubscription = async () => {
        const userId = 'user_001'; // TODO: 实际应从认证状态获取

        console.log('🔍 WellnessScreen: 检查私人医生订阅, userId:', userId);

        const subscription = await privateDoctorService.getMySubscription(userId);

        if (subscription) {
          console.log('✅ WellnessScreen: 找到订阅数据, status:', subscription.status);
          setSubscription(subscription);
          setSubscriptionId(subscription.id);

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

      const loadSliderRecipes = async () => {
        try {
          const recipes = await getSliderRecipes();
          setSliderRecipes(recipes);
          console.log('✅ WellnessScreen: 轮播推荐菜谱已加载, 数量:', recipes.length);
        } catch (error) {
          console.error('❌ WellnessScreen: 加载轮播推荐菜谱失败:', error);
        }
      };

      const loadColumns = async () => {
        try {
          const columnList = await getColumns();
          setColumns(columnList);
          console.log('✅ WellnessScreen: 栏目数据已加载, 数量:', columnList.length);
        } catch (error) {
          console.error('❌ WellnessScreen: 加载栏目数据失败:', error);
        }
      };

      const loadCurrentTheme = async () => {
        try {
          const themeData = await getCurrentTheme();
          setCurrentTheme(themeData);
          if (themeData) {
            console.log('✅ WellnessScreen: 当前主题已加载:', themeData.title);
          }
        } catch (error) {
          console.error('❌ WellnessScreen: 加载主题数据失败:', error);
        }
      };

      // 加载Feed入口橱窗数据
      const loadFeedData = async () => {
        try {
          const [banner1, cards, hotSales, popularExperts, hotTopics, nearbyServices, acts] =
            await Promise.all([
              getMainBanner(),
              getEntryCards(),
              getHotSalesRanking(),
              getPopularExpertsRanking(),
              getHotTopicsRanking(),
              getNearbyServicesRanking(),
              getActivities(),
            ]);
          setMainBanner(banner1);
          setEntryCards(cards);
          setHotSalesRanking(hotSales);
          setPopularExpertsRanking(popularExperts);
          setHotTopicsRanking(hotTopics);
          setNearbyServicesRanking(nearbyServices);
          setActivities(acts);
          console.log('✅ WellnessScreen: Feed数据已加载');
        } catch (error) {
          console.error('❌ WellnessScreen: 加载Feed数据失败:', error);
        }
      };

      checkSubscription();
      loadSliderRecipes();
      loadColumns();
      loadCurrentTheme();
      loadFeedData();
    }, [])
  );


  // 6大服务导航处理
  const handleServiceClick = (serviceId: string) => {
    const screenMap: Record<string, string> = {
      nutrition: 'NutritionService',
      delivery: 'DeliveryService',
      elderly: 'ElderlyService',
      doctor: 'PrivateDoctorList',
      legal: 'LegalServiceHome',
      insurance: 'InsuranceHome',
    };
    const screen = screenMap[serviceId];
    if (screen) {
      navigation.navigate(screen as never);
    }
  };

  // Feed入口橱窗处理
  const handleFeedEntryPress = (entry: FeedEntry) => {
    switch (entry.targetType) {
      case 'theme':
        navigation.navigate('ThemeDetail' as never, { themeId: entry.targetId } as never);
        break;
      case 'column':
        navigation.navigate('ColumnList' as never, { columnId: entry.targetId } as never);
        break;
      case 'product':
        navigation.navigate('ProductDetail' as never, { productId: entry.targetId } as never);
        break;
      case 'expert':
        navigation.navigate('ExpertDetail' as never, { expertId: entry.targetId } as never);
        break;
      case 'article':
        navigation.navigate('ArticleDetail' as never, { articleId: entry.targetId } as never);
        break;
      default:
        toast.show('功能开发中', { duration: 1000 });
    }
  };

  const handleRankingItemPress = (item: RankingItem) => {
    if (isHotSalesItem(item)) {
      navigation.navigate('ProductDetail' as never, { productId: item.id } as never);
    } else if (isPopularExpertItem(item)) {
      navigation.navigate('ExpertDetail' as never, { expertId: item.id } as never);
    } else if (isHotTopicItem(item)) {
      if (item.type === 'theme') {
        navigation.navigate('ThemeDetail' as never, { themeId: item.id } as never);
      } else if (item.type === 'article') {
        navigation.navigate('ArticleDetail' as never, { articleId: item.id } as never);
      } else {
        navigation.navigate('ColumnList' as never, { columnId: item.id } as never);
      }
    }
  };

  const handleActivityPress = (activity: Activity) => {
    handleFeedEntryPress({
      ...activity,
      type: 'activity',
      order: 0,
    } as FeedEntry);
  };

  const handleViewMoreRanking = (type: string) => {
    navigation.navigate('RankingDetail' as never, { type } as never);
  };

  // 6大服务入口
  const services: Service[] = [
    {
      id: 'nutrition',
      title: '营养配餐',
      description: 'AI定制营养方案',
      icon: ChefHat,
      colorKey: 'success',
    },
    {
      id: 'delivery',
      title: '闪送到家',
      description: '健康餐品配送',
      icon: Truck,
      colorKey: 'primary',
    },
    {
      id: 'elderly',
      title: '养老服务',
      description: '专业照护服务',
      icon: Heart,
      colorKey: 'error',
    },
    {
      id: 'doctor',
      title: '私人医生',
      description: '1对1健康管理',
      icon: Users,
      colorKey: 'secondary',
    },
    {
      id: 'legal',
      title: '遗嘱及法律',
      description: '法律咨询服务',
      icon: Scale,
      colorKey: 'secondary',
    },
    {
      id: 'insurance',
      title: '保险规划',
      description: '健康保障方案',
      icon: Shield,
      colorKey: 'accent',
    },
  ];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <Theme name="neutral_light">
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack>
              {/* Header */}
            <View paddingHorizontal="$2.5" paddingTop="$2" paddingBottom="$2">
              <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack flex={1} gap="$0.5" marginRight="$2">
                  <Text fontSize="$6" fontWeight="700" color="$color12">
                    顺时而养，从容生活
                  </Text>
                  <Text fontSize="$2" color="$color10" numberOfLines={1}>
                    {dailyQuote.text} —{dailyQuote.source}
                  </Text>
                </YStack>
                <Pressable onPress={() => setShowServiceModal(true)}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="white"
                    justifyContent="center"
                    alignItems="center"
                    shadowColor="$color12"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={4}
                    elevation={2}
                  >
                    <LayoutGrid size={20} color={primaryColor} />
                  </View>
                </Pressable>
              </XStack>
            </View>

            {/* 主题专区Banner */}
            {currentTheme && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <ThemeBanner
                  theme={currentTheme}
                  onPress={(themeData) => {
                    // TODO: 跳转主题详情页
                    toast.show(`进入「${themeData.title}」专题`, { duration: 2000 });
                  }}
                />
              </View>
            )}

            {/* 养生日历卡片 */}
            <View paddingHorizontal="$2.5" marginBottom="$2">
              <WellnessCalendarCard
                onPress={() => navigation.navigate('WellnessGuide' as never)}
              />
            </View>

            {/* 推荐食谱轮播 */}
            {sliderRecipes.length > 0 && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <RecipeSlider
                  recipes={sliderRecipes}
                  onRecipePress={(recipe) => {
                    navigation.navigate('NutritionService' as never, {
                      selectedMealPlanId: recipe.mealPlanId,
                    } as never);
                  }}
                />
              </View>
            )}

            {/* 私人医生服务台Banner - VIP用户专属 */}
            {subscription && subscription.status === 'active' && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <Pressable
                  onPress={() =>
                    navigation.navigate('PrivateDoctorServiceDesk' as never, {
                      subscriptionId: subscriptionId || subscription.id,
                    } as never)
                  }
                >
                  <View
                    borderRadius="$5"
                    overflow="hidden"
                    backgroundColor="$color3"
                    padding="$2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <XStack gap="$2" alignItems="center">
                      <View
                        width="$4.5"
                        height="$4.5"
                        borderRadius="$12"
                        backgroundColor={`${warningColor}15`}
                        borderWidth={2}
                        borderColor={`${warningColor}30`}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Stethoscope size={24} color={warningColor} />
                      </View>
                      <YStack flex={1} gap="$0.5">
                        <XStack gap="$1.5" alignItems="center">
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            专属医生服务台
                          </Text>
                          <View
                            backgroundColor="$warning"
                            paddingHorizontal="$1.5"
                            paddingVertical="$0.25"
                            borderRadius="$2"
                          >
                            <Text fontSize="$2" color="$color1" fontWeight="700">
                              VIP
                            </Text>
                          </View>
                        </XStack>
                        <Text fontSize="$2" color="$color10">
                          {doctorName} 医生为您服务
                        </Text>
                      </YStack>
                      <View
                        backgroundColor={`${warningColor}20`}
                        borderRadius="$10"
                        paddingHorizontal="$2"
                        paddingVertical="$1.5"
                        borderWidth={1}
                        borderColor={`${warningColor}40`}
                      >
                        <Text fontSize="$2" color="$warning" fontWeight="500">
                          进入
                        </Text>
                      </View>
                    </XStack>
                  </View>
                </Pressable>
              </View>
            )}

            {/* 栏目入口 */}
            {columns.length > 0 && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <ColumnEntryBar
                  columns={columns}
                  onColumnPress={(column) => {
                    navigation.navigate('ColumnList' as never, {
                      columnId: column.id,
                    } as never);
                  }}
                />
              </View>
            )}

            {/* Feed入口橱窗 */}
            {/* 1. 大Banner - 主打主题 */}
            {mainBanner && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <FeedBanner
                  entry={mainBanner}
                  onPress={handleFeedEntryPress}
                  variant="large"
                />
              </View>
            )}

            {/* 2. 热销榜 */}
            {hotSalesRanking && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <RankingCard
                  ranking={hotSalesRanking}
                  onItemPress={handleRankingItemPress}
                  onViewMore={() => handleViewMoreRanking('hotSales')}
                />
              </View>
            )}

            {/* 3. 主题入口双列卡片 (前2个) */}
            {entryCards.length > 0 && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <FeedEntryGrid
                  entries={entryCards.slice(0, 2)}
                  onPress={handleFeedEntryPress}
                />
              </View>
            )}

            {/* 4. 预约榜 - 热门专家 */}
            {popularExpertsRanking && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <RankingCard
                  ranking={popularExpertsRanking}
                  onItemPress={handleRankingItemPress}
                  onViewMore={() => handleViewMoreRanking('popularExperts')}
                />
              </View>
            )}

            {/* 5. 主题入口双列卡片 (后2个) */}
            {entryCards.length > 2 && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <FeedEntryGrid
                  entries={entryCards.slice(2, 4)}
                  onPress={handleFeedEntryPress}
                />
              </View>
            )}

            {/* 6. 热门榜 */}
            {hotTopicsRanking && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <RankingCard
                  ranking={hotTopicsRanking}
                  onItemPress={handleRankingItemPress}
                  onViewMore={() => handleViewMoreRanking('hotTopics')}
                />
              </View>
            )}

            {/* 7. 附近服务榜 */}
            {nearbyServicesRanking && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <RankingCard
                  ranking={nearbyServicesRanking}
                  onItemPress={handleRankingItemPress}
                  onViewMore={() => handleViewMoreRanking('nearbyServices')}
                />
              </View>
            )}

            {/* 8. 限时活动 */}
            {activities.length > 0 && (
              <View paddingHorizontal="$2.5" marginBottom="$2">
                <ActivitySlider
                  activities={activities}
                  onPress={handleActivityPress}
                />
              </View>
            )}

            {/* 底部安全区域 */}
            <View height="$4" />
          </YStack>
        </ScrollView>

        {/* 品质服务 BottomSheet */}
        <BottomSheet
          visible={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          title="品质服务"
          variant="picker"
        >
          <YStack gap="$3">
            {/* 2x3 服务网格 - 强制一行3个 */}
            <XStack gap="$2">
              {services.slice(0, 3).map((service) => {
                const IconComponent = service.icon;
                const color = getServiceColor(service.colorKey);
                return (
                  <Pressable
                    key={service.id}
                    onPress={() => {
                      setShowServiceModal(false);
                      handleServiceClick(service.id);
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      alignItems="center"
                      paddingVertical="$2"
                      borderRadius="$4"
                      backgroundColor="$color2"
                      borderWidth={1}
                      borderColor="$color5"
                    >
                      <View
                        width={44}
                        height={44}
                        borderRadius={22}
                        backgroundColor={`${color}15`}
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="$1.5"
                      >
                        <IconComponent size={22} color={color} />
                      </View>
                      <Text fontSize="$3" fontWeight="500" color="$color12" textAlign="center">
                        {service.title}
                      </Text>
                      <Text fontSize="$1" color="$color10" marginTop="$0.5" textAlign="center">
                        {service.description}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
            <XStack gap="$2">
              {services.slice(3, 6).map((service) => {
                const IconComponent = service.icon;
                const color = getServiceColor(service.colorKey);
                return (
                  <Pressable
                    key={service.id}
                    onPress={() => {
                      setShowServiceModal(false);
                      handleServiceClick(service.id);
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      alignItems="center"
                      paddingVertical="$2"
                      borderRadius="$4"
                      backgroundColor="$color2"
                      borderWidth={1}
                      borderColor="$color5"
                    >
                      <View
                        width={44}
                        height={44}
                        borderRadius={22}
                        backgroundColor={`${color}15`}
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="$1.5"
                      >
                        <IconComponent size={22} color={color} />
                      </View>
                      <Text fontSize="$3" fontWeight="500" color="$color12" textAlign="center">
                        {service.title}
                      </Text>
                      <Text fontSize="$1" color="$color10" marginTop="$0.5" textAlign="center">
                        {service.description}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>

            {/* 专属服务入口 */}
            <VIPServiceBar
              onPressServiceDesk={() => {
                setShowServiceModal(false);
                navigation.navigate('VIPServiceDesk' as never);
              }}
              onPressIntro={() => {
                setShowServiceModal(false);
                navigation.navigate('VIPServiceIntro' as never);
              }}
            />
          </YStack>
        </BottomSheet>

        <ToastViewport />
      </SafeAreaView>
    </Theme>
  </LinearGradient>
  );
};
