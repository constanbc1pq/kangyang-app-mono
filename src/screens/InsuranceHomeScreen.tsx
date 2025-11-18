import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { View, Text, XStack, YStack, Card, H3 } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Shield,
  Cpu,
  Star,
  FileText,
  MessageCircle,
  Activity,
  Heart,
  TrendingUp,
  AlertCircle,
  Users,
  Briefcase,
  ChevronRight,
  BookOpen,
  Video,
  HelpCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/app';
import {
  INSURANCE_CATEGORY_LABELS,
  INSURANCE_CATEGORY_COLORS,
  HOME_QUICK_ENTRIES,
} from '@/constants/insurance';
import { getProducts } from '@/services/insuranceProductService';
import { getAdvisors } from '@/services/insuranceAdvisorService';
import { InsuranceProduct, InsuranceAdvisor } from '@/types/insurance';

const { width } = Dimensions.get('window');

const InsuranceHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [hotProducts, setHotProducts] = useState<InsuranceProduct[]>([]);
  const [topAdvisors, setTopAdvisors] = useState<InsuranceAdvisor[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 加载热销产品
      const productsRes = await getProducts({ sortBy: 'sales', limit: 3 });
      setHotProducts(productsRes.data);

      // 加载推荐顾问
      const advisorsRes = await getAdvisors({ sortBy: 'recommended' });
      setTopAdvisors(advisorsRes.slice(0, 3));
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 保险类别配置（6个，一行3个）
  const categories = [
    { id: 'medical', label: '医疗险', icon: Activity, color: '#3B82F6' },
    { id: 'critical_illness', label: '重疾险', icon: Heart, color: '#EF4444' },
    { id: 'annuity', label: '年金险', icon: TrendingUp, color: '#10B981' },
    { id: 'life', label: '寿险', icon: Shield, color: '#8B5CF6' },
    { id: 'accident', label: '意外险', icon: AlertCircle, color: '#F59E0B' },
    { id: 'long_term_care', label: '护理险', icon: Users, color: '#EC4899' },
  ];

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text marginTop="$3" color="$textSecondary">
          加载中...
        </Text>
      </View>
    );
  }

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
        <YStack flex={1} marginLeft="$3">
          <Text fontSize="$5" fontWeight="600" color="$text">
            保险规划
          </Text>
          <Text fontSize="$2" color="$textSecondary">
            智能规划 · 专业守护
          </Text>
        </YStack>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 主Banner - 渐变背景 */}
        <View height={200} overflow="hidden" marginBottom="$4">
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, padding: 24, justifyContent: 'flex-end' }}
          >
            <XStack alignItems="center" marginBottom="$2">
              <Shield size={24} color="white" />
              <Text fontSize="$7" fontWeight="bold" color="white" marginLeft="$2">
                智能保险规划
              </Text>
            </XStack>
            <Text fontSize="$3" color="rgba(255,255,255,0.9)" marginBottom="$4">
              AI规划 · 顾问咨询 · 理赔协助 全部免费
            </Text>
            <XStack gap="$3">
              <View backgroundColor="rgba(255,255,255,0.2)" borderRadius="$3" padding="$3" flex={1}>
                <Text fontSize="$6" fontWeight="bold" color="white">1000+</Text>
                <Text fontSize="$2" color="rgba(255,255,255,0.9)">保障方案</Text>
              </View>
              <View backgroundColor="rgba(255,255,255,0.2)" borderRadius="$3" padding="$3" flex={1}>
                <Text fontSize="$6" fontWeight="bold" color="white">100+</Text>
                <Text fontSize="$2" color="rgba(255,255,255,0.9)">专业顾问</Text>
              </View>
              <View backgroundColor="rgba(255,255,255,0.2)" borderRadius="$3" padding="$3" flex={1}>
                <Text fontSize="$6" fontWeight="bold" color="white">98%</Text>
                <Text fontSize="$2" color="rgba(255,255,255,0.9)">满意度</Text>
              </View>
            </XStack>
          </LinearGradient>
        </View>

        {/* 快速入口 */}
        <YStack space="$3" paddingHorizontal="$4">
          <Text fontSize="$4" fontWeight="600" color="$text">
            快速入口
          </Text>

          {/* 第一行：前2个入口 */}
          <XStack space="$3">
            {HOME_QUICK_ENTRIES.slice(0, 2).map(entry => {
              const Icon = {
                cpu: Cpu,
                star: Star,
                'file-text': FileText,
                'message-circle': MessageCircle,
              }[entry.icon] || Shield;

              return (
                <Card
                  key={entry.id}
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
                  onPress={() => navigation.navigate(entry.route as never)}
                >
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={`${entry.color}15`}
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$3"
                  >
                    <Icon size={24} color={entry.color} />
                  </View>
                  <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                    {entry.label}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {entry.description}
                  </Text>
                </Card>
              );
            })}
          </XStack>

          {/* 第二行：后2个入口 */}
          <XStack space="$3">
            {HOME_QUICK_ENTRIES.slice(2, 4).map(entry => {
              const Icon = {
                cpu: Cpu,
                star: Star,
                'file-text': FileText,
                'message-circle': MessageCircle,
              }[entry.icon] || Shield;

              return (
                <Card
                  key={entry.id}
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
                  onPress={() => navigation.navigate(entry.route as never)}
                >
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={`${entry.color}15`}
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$3"
                  >
                    <Icon size={24} color={entry.color} />
                  </View>
                  <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                    {entry.label}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {entry.description}
                  </Text>
                </Card>
              );
            })}
          </XStack>
        </YStack>

        {/* 保险分类 */}
        <YStack padding="$4" paddingTop="$2">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$4" fontWeight="600" color="$text">
              保险分类
            </Text>
            <Pressable onPress={() => navigation.navigate('InsuranceProductList' as never)}>
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3" color={COLORS.primary}>
                  查看全部
                </Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </XStack>
            </Pressable>
          </XStack>

          <XStack gap="$3" flexWrap="wrap">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Pressable
                  key={category.id}
                  onPress={() =>
                    navigation.navigate('InsuranceProductList' as never, {
                      category: category.id,
                    } as never)
                  }
                  style={{ width: (width - 64) / 3 }}
                >
                  <YStack alignItems="center" gap="$2">
                    <View
                      width={56}
                      height={56}
                      borderRadius={28}
                      backgroundColor={`${category.color}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Icon size={28} color={category.color} />
                    </View>
                    <Text fontSize="$2" color="$text" textAlign="center">
                      {category.label}
                    </Text>
                  </YStack>
                </Pressable>
              );
            })}
          </XStack>
        </YStack>

        {/* 热销产品 */}
        <YStack padding="$4" paddingTop="$2">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$4" fontWeight="600" color="$text">
              热销产品
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate('InsuranceProductList' as never, { sortBy: 'sales' } as never)
              }
            >
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3" color={COLORS.primary}>
                  更多产品
                </Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </XStack>
            </Pressable>
          </XStack>

          <YStack gap="$3">
            {hotProducts.map(product => (
              <Pressable
                key={product.id}
                onPress={() =>
                  navigation.navigate('InsuranceProductDetail' as never, {
                    productId: product.id,
                  } as never)
                }
              >
                <Card bordered padding="$4" backgroundColor="$surface" pressStyle={{ scale: 0.98 }}>
                  <YStack gap="$3">
                    <XStack justifyContent="space-between" alignItems="flex-start">
                      <YStack flex={1} gap="$2">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {product.name}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary" numberOfLines={2}>
                          {product.description}
                        </Text>
                        <XStack gap="$2" flexWrap="wrap">
                          {product.highlights.slice(0, 2).map((highlight, idx) => (
                            <View
                              key={idx}
                              backgroundColor={`${COLORS.primary}15`}
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$1" color={COLORS.primary}>
                                {highlight}
                              </Text>
                            </View>
                          ))}
                        </XStack>
                      </YStack>
                    </XStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack>
                        <Text fontSize="$2" color="$textSecondary">
                          {product.companyName}
                        </Text>
                        <XStack alignItems="baseline" gap="$1">
                          <Text fontSize="$2" color="$textSecondary">
                            ¥
                          </Text>
                          <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                            {product.premiumStartFrom}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            起/年
                          </Text>
                        </XStack>
                      </YStack>
                      <XStack gap="$2">
                        <Text fontSize="$2" color="$textSecondary">
                          ⭐ {product.rating}
                        </Text>
                        <ChevronRight size={20} color={COLORS.textSecondary} />
                      </XStack>
                    </XStack>
                  </YStack>
                </Card>
              </Pressable>
            ))}
          </YStack>
        </YStack>

        {/* 推荐顾问 */}
        <YStack padding="$4" paddingTop="$2">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$4" fontWeight="600" color="$text">
              推荐顾问
            </Text>
            <Pressable onPress={() => navigation.navigate('InsuranceAdvisorList' as never)}>
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3" color={COLORS.primary}>
                  更多顾问
                </Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </XStack>
            </Pressable>
          </XStack>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$3">
              {topAdvisors.map(advisor => (
                <Pressable
                  key={advisor.id}
                  onPress={() =>
                    navigation.navigate('InsuranceAdvisorDetail' as never, {
                      advisorId: advisor.id,
                    } as never)
                  }
                >
                  <Card
                    bordered
                    padding="$4"
                    backgroundColor="$surface"
                    width={200}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <YStack gap="$3" alignItems="center">
                      <View
                        width={64}
                        height={64}
                        borderRadius={32}
                        overflow="hidden"
                        backgroundColor="$borderColor"
                      >
                        {/* TODO: 添加头像图片 */}
                        <View
                          width={64}
                          height={64}
                          backgroundColor={COLORS.primary}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize="$6" color="white" fontWeight="600">
                            {advisor.name.charAt(0)}
                          </Text>
                        </View>
                      </View>
                      <YStack alignItems="center" gap="$1">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {advisor.name}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary">
                          {advisor.yearsOfExperience}年经验 · {advisor.organization}
                        </Text>
                      </YStack>
                      <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                        {advisor.specialties.slice(0, 2).map((specialty, idx) => (
                          <View
                            key={idx}
                            backgroundColor="$borderColor"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" color="$text">
                              {specialty}
                            </Text>
                          </View>
                        ))}
                      </XStack>
                      <XStack justifyContent="space-between" width="100%">
                        <YStack alignItems="center">
                          <Text fontSize="$4" fontWeight="600" color={COLORS.primary}>
                            {advisor.clientsServed}
                          </Text>
                          <Text fontSize="$1" color="$textSecondary">
                            服务客户
                          </Text>
                        </YStack>
                        <YStack alignItems="center">
                          <Text fontSize="$4" fontWeight="600" color={COLORS.success}>
                            {advisor.satisfactionRate}%
                          </Text>
                          <Text fontSize="$1" color="$textSecondary">
                            满意度
                          </Text>
                        </YStack>
                      </XStack>
                    </YStack>
                  </Card>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* 知识中心 */}
        <YStack padding="$4" paddingTop="$2" paddingBottom="$6">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            知识中心
          </Text>
          <XStack gap="$3">
            {[
              { id: 'articles', label: '保险文章', icon: BookOpen, route: 'InsuranceArticle' },
              { id: 'videos', label: '视频课堂', icon: Video, route: 'InsuranceVideo' },
              { id: 'qa', label: '问答社区', icon: HelpCircle, route: 'InsuranceQA' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => navigation.navigate(item.route as never)}
                  style={{ flex: 1 }}
                >
                  <Card
                    bordered
                    padding="$3"
                    backgroundColor="$surface"
                    pressStyle={{ scale: 0.98 }}
                  >
                    <YStack alignItems="center" gap="$2">
                      <Icon size={32} color={COLORS.primary} />
                      <Text fontSize="$3" color="$text">
                        {item.label}
                      </Text>
                    </YStack>
                  </Card>
                </Pressable>
              );
            })}
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  );
};

export default InsuranceHomeScreen;
