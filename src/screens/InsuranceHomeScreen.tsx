import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Dimensions } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
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
  ChevronRight,
  BookOpen,
  Video,
  HelpCircle,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import {
  HOME_QUICK_ENTRIES,
} from '@/constants/insurance';
import { getProducts } from '@/services/insuranceProductService';
import { getAdvisors } from '@/services/insuranceAdvisorService';
import { InsuranceProduct, InsuranceAdvisor } from '@/types/insurance';

const { width } = Dimensions.get('window');

const InsuranceHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;
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
    }
  };

  // 保险类别配置（6个，一行3个）- 使用主题色和柔和色调
  const categories = [
    { id: 'medical', label: '医疗险', icon: Activity, color: primaryColor },
    { id: 'critical_illness', label: '重疾险', icon: Heart, color: theme.error?.val },
    { id: 'annuity', label: '年金险', icon: TrendingUp, color: successColor },
    { id: 'life', label: '寿险', icon: Shield, color: primaryColor },
    { id: 'accident', label: '意外险', icon: AlertCircle, color: theme.warning?.val },
    { id: 'long_term_care', label: '护理险', icon: Users, color: primaryColor },
  ];

  return (
    <View flex={1} backgroundColor="$background">
      <TitleBar title="保险规划" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 平台介绍 */}
        <View
          marginHorizontal="$2.5"
          marginTop="$2"
          marginBottom="$2"
          padding="$2"
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack alignItems="center" gap="$2" marginBottom="$2">
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={`${primaryColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <Shield size={20} color={primaryColor} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$color12">
                保险信息聚合平台
              </Text>
              <Text fontSize="$2" color="$color10">
                一站式保险产品比价与咨询
              </Text>
            </YStack>
          </XStack>
          <YStack gap="$1.5">
            <XStack gap="$2" alignItems="center">
              <View width={6} height={6} borderRadius={3} backgroundColor={successColor} />
              <Text fontSize="$2" color="$color12">
                聚合50+保险公司、1000+产品信息，方便对比选择
              </Text>
            </XStack>
            <XStack gap="$2" alignItems="center">
              <View width={6} height={6} borderRadius={3} backgroundColor={successColor} />
              <Text fontSize="$2" color="$color12">
                对接专业保险顾问，提供免费咨询服务
              </Text>
            </XStack>
            <XStack gap="$2" alignItems="center">
              <View width={6} height={6} borderRadius={3} backgroundColor={successColor} />
              <Text fontSize="$2" color="$color12">
                投保由正规保险公司承保，保单权益受法律保护
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* 快速入口 */}
        <YStack gap="$3" paddingHorizontal="$2.5">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            快速入口
          </Text>

          {/* 第一行：前2个入口 */}
          <XStack gap="$3">
            {HOME_QUICK_ENTRIES.slice(0, 2).map(entry => {
              const Icon = {
                cpu: Cpu,
                star: Star,
                'file-text': FileText,
                'message-circle': MessageCircle,
              }[entry.icon] || Shield;

              return (
                <Pressable
                  key={entry.id}
                  style={{ flex: 1 }}
                  onPress={() => navigation.navigate(entry.route as never)}
                >
                  <View
                    flex={1}
                    padding="$2"
                    borderRadius="$5"
                    backgroundColor="$color2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${primaryColor}15`}
                      justifyContent="center"
                      alignItems="center"
                      marginBottom="$2"
                    >
                      <Icon size={24} color={primaryColor} />
                    </View>
                    <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
                      {entry.label}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      {entry.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>

          {/* 第二行：后2个入口 */}
          <XStack gap="$3">
            {HOME_QUICK_ENTRIES.slice(2, 4).map(entry => {
              const Icon = {
                cpu: Cpu,
                star: Star,
                'file-text': FileText,
                'message-circle': MessageCircle,
              }[entry.icon] || Shield;

              return (
                <Pressable
                  key={entry.id}
                  style={{ flex: 1 }}
                  onPress={() => navigation.navigate(entry.route as never)}
                >
                  <View
                    flex={1}
                    padding="$2"
                    borderRadius="$5"
                    backgroundColor="$color2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${primaryColor}15`}
                      justifyContent="center"
                      alignItems="center"
                      marginBottom="$2"
                    >
                      <Icon size={24} color={primaryColor} />
                    </View>
                    <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
                      {entry.label}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      {entry.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </YStack>

        {/* 保险产品 - 分类 + 热销 */}
        <YStack padding="$2.5" paddingTop="$2">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              保险产品
            </Text>
            <Pressable onPress={() => navigation.navigate('InsuranceProductList' as never)}>
              <XStack alignItems="center" gap="$0.5">
                <Text fontSize="$3" color="$primary" fontWeight="500">
                  查看全部
                </Text>
                <ChevronRight size={14} color={primaryColor} />
              </XStack>
            </Pressable>
          </XStack>

          {/* 分类网格 - 每行3个 */}
          <XStack flexWrap="wrap" marginBottom="$3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isLastInRow = (index + 1) % 3 === 0;
              return (
                <Pressable
                  key={category.id}
                  onPress={() =>
                    navigation.navigate('InsuranceProductList' as never, {
                      category: category.id,
                    } as never)
                  }
                  style={{ width: '33.33%', paddingRight: isLastInRow ? 0 : 8, marginBottom: 12 }}
                >
                  <YStack alignItems="center" gap="$1.5">
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${category.color}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Icon size={24} color={category.color} />
                    </View>
                    <Text fontSize="$2" color="$color12" textAlign="center">
                      {category.label}
                    </Text>
                  </YStack>
                </Pressable>
              );
            })}
          </XStack>

          {/* 热销产品列表 */}
          <YStack gap="$2">
            {hotProducts.map(product => (
              <Pressable
                key={product.id}
                onPress={() =>
                  navigation.navigate('InsuranceProductDetail' as never, {
                    productId: product.id,
                  } as never)
                }
              >
                <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2" backgroundColor="$color2">
                  <YStack gap="$2">
                    <XStack justifyContent="space-between" alignItems="flex-start">
                      <YStack flex={1} gap="$2">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          {product.name}
                        </Text>
                        <Text fontSize="$2" color="$color10" numberOfLines={2}>
                          {product.description}
                        </Text>
                        <XStack gap="$2" flexWrap="wrap">
                          {product.highlights.slice(0, 2).map((highlight, idx) => (
                            <View
                              key={idx}
                              backgroundColor={`${primaryColor}15`}
                              paddingHorizontal="$2"
                              paddingVertical="$0.5"
                              borderRadius="$10"
                            >
                              <Text fontSize="$1" color="$primary">
                                {highlight}
                              </Text>
                            </View>
                          ))}
                        </XStack>
                      </YStack>
                    </XStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack>
                        <Text fontSize="$2" color="$color10">
                          {product.companyName}
                        </Text>
                        <XStack alignItems="baseline" gap="$1">
                          <Text fontSize="$2" color="$primary">
                            ¥
                          </Text>
                          <Text fontSize="$5" fontWeight="700" color="$primary">
                            {product.premiumStartFrom}
                          </Text>
                          <Text fontSize="$2" color="$color10">
                            起/年
                          </Text>
                        </XStack>
                      </YStack>
                      <XStack gap="$2" alignItems="center">
                        <Text fontSize="$2" color="$color10">
                          ⭐ {product.rating}
                        </Text>
                        <ChevronRight size={18} color={color10} />
                      </XStack>
                    </XStack>
                  </YStack>
                </View>
              </Pressable>
            ))}
          </YStack>
        </YStack>

        {/* 推荐顾问 */}
        <YStack padding="$2.5" paddingTop="$2">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              推荐顾问
            </Text>
            <Pressable onPress={() => navigation.navigate('InsuranceAdvisorList' as never)}>
              <XStack alignItems="center" gap="$0.5">
                <Text fontSize="$3" color="$primary" fontWeight="500">
                  更多顾问
                </Text>
                <ChevronRight size={14} color={primaryColor} />
              </XStack>
            </Pressable>
          </XStack>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              {topAdvisors.map(advisor => (
                <Pressable
                  key={advisor.id}
                  onPress={() =>
                    navigation.navigate('InsuranceAdvisorDetail' as never, {
                      advisorId: advisor.id,
                    } as never)
                  }
                >
                  <View
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$5"
                    padding="$2"
                    backgroundColor="$color2"
                    width={200}
                  >
                    <YStack gap="$2" alignItems="center">
                      <View
                        width={64}
                        height={64}
                        borderRadius={32}
                        overflow="hidden"
                        backgroundColor="$color5"
                      >
                        <View
                          width={64}
                          height={64}
                          backgroundColor="$primary"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize="$6" color="white" fontWeight="600">
                            {advisor.name.charAt(0)}
                          </Text>
                        </View>
                      </View>
                      <YStack alignItems="center" gap="$1">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          {advisor.name}
                        </Text>
                        <Text fontSize="$2" color="$color10">
                          {advisor.yearsOfExperience}年经验 · {advisor.organization}
                        </Text>
                      </YStack>
                      <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                        {advisor.specialties.slice(0, 2).map((specialty, idx) => (
                          <View
                            key={idx}
                            backgroundColor="$color4"
                            paddingHorizontal="$2"
                            paddingVertical="$0.5"
                            borderRadius="$10"
                          >
                            <Text fontSize="$1" color="$color12">
                              {specialty}
                            </Text>
                          </View>
                        ))}
                      </XStack>
                      <XStack justifyContent="space-between" width="100%">
                        <YStack alignItems="center">
                          <Text fontSize="$4" fontWeight="600" color="$primary">
                            {advisor.clientsServed}
                          </Text>
                          <Text fontSize="$1" color="$color10">
                            服务客户
                          </Text>
                        </YStack>
                        <YStack alignItems="center">
                          <Text fontSize="$4" fontWeight="600" color="$success">
                            {advisor.satisfactionRate}%
                          </Text>
                          <Text fontSize="$1" color="$color10">
                            满意度
                          </Text>
                        </YStack>
                      </XStack>
                    </YStack>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* 知识中心 */}
        <YStack padding="$2.5" paddingTop="$2" paddingBottom="$6">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$3">
            知识中心
          </Text>
          <XStack gap="$2">
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
                  <View
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$5"
                    padding="$2"
                    backgroundColor="$color2"
                  >
                    <YStack alignItems="center" gap="$2">
                      <Icon size={32} color={primaryColor} />
                      <Text fontSize="$3" color="$color12">
                        {item.label}
                      </Text>
                    </YStack>
                  </View>
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
