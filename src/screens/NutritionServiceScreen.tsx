import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/app';
import { getNutritionists, Nutritionist } from '@/services/nutritionistService';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H2,
  H3,
  H4,
  Paragraph,
  Circle,
  Separator,
} from 'tamagui';
import {
  ArrowLeft,
  ChefHat,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle2,
  Crown,
  Sparkles,
} from 'lucide-react-native';

interface MealPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  calories: number;
  description: string;
  features: string[];
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  nutritionData: {
    name: string;
    value: number;
    color: string;
  }[];
  weeklyMenu: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }[];
  targetAudience: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  isVIP?: boolean;
  badge?: string;
}

interface Nutritionist {
  name: string;
  title: string;
  experience: string;
  specialty: string;
  rating: number;
  consultations: number;
  avatar: string;
}

const NutritionServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('balanced');
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'reviews' | 'faq'>('intro');
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);

  // 加载营养师数据
  useFocusEffect(
    React.useCallback(() => {
      const loadNutritionists = async () => {
        const data = await getNutritionists();
        setNutritionists(data);
      };
      loadNutritionists();
    }, [])
  );

  const mealPlans: MealPlan[] = [
    {
      id: 'balanced',
      name: '均衡营养套餐',
      price: 68,
      originalPrice: 88,
      calories: 1800,
      description: '科学配比，营养全面',
      features: ['三餐配送', '营养师定制', '每日更新菜单'],
      icon: '🥗',
      color: COLORS.primary,
      rating: 4.8,
      reviewCount: 1256,
      salesCount: 5432,
      badge: '热销',
      nutritionData: [
        { name: '蛋白质', value: 25, color: COLORS.primary },
        { name: '碳水化合物', value: 50, color: COLORS.success },
        { name: '脂肪', value: 20, color: COLORS.warning },
        { name: '膳食纤维', value: 5, color: COLORS.accent },
      ],
      weeklyMenu: [
        {
          day: '周一',
          breakfast: '燕麦粥、水煮蛋、全麦面包',
          lunch: '糙米饭、清蒸鲈鱼、西兰花',
          dinner: '小米粥、蒸蛋羹、凉拌黄瓜',
        },
        {
          day: '周二',
          breakfast: '豆浆、煎蛋、蔬菜包',
          lunch: '红薯饭、番茄炖牛肉、炒青菜',
          dinner: '玉米粥、清蒸鸡胸肉、拌豆腐',
        },
        {
          day: '周三',
          breakfast: '牛奶、全麦三明治、水果',
          lunch: '杂粮饭、红烧鸡腿、素炒三丝',
          dinner: '南瓜粥、清炒虾仁、凉拌木耳',
        },
        {
          day: '周四',
          breakfast: '紫薯粥、茶叶蛋、蒸玉米',
          lunch: '糙米饭、香菇炖鸡、蒜蓉油菜',
          dinner: '黑米粥、煎三文鱼、炒芦笋',
        },
        {
          day: '周五',
          breakfast: '八宝粥、煮鸡蛋、烤红薯',
          lunch: '藜麦饭、清炖排骨、炒时蔬',
          dinner: '绿豆粥、蒸鳕鱼、凉拌海带',
        },
        {
          day: '周六',
          breakfast: '豆腐脑、油条、小米粥',
          lunch: '五谷饭、红烧带鱼、炒豆角',
          dinner: '银耳莲子羹、清蒸虾、蒜蓉西兰花',
        },
        {
          day: '周日',
          breakfast: '南瓜粥、煎饼果子、豆浆',
          lunch: '糙米饭、番茄牛腩、清炒菠菜',
          dinner: '山药薏米粥、蒸蛋羹、拍黄瓜',
        },
      ],
      targetAudience: ['适合追求营养均衡的人群', '适合工作繁忙无暇做饭的白领', '适合需要控制饮食的健康人士'],
      faqs: [
        { question: '配送时间是什么时候？', answer: '早餐7:00-8:00，午餐11:00-12:00，晚餐17:00-18:00送达' },
        { question: '可以自定义菜单吗？', answer: '可以，您可以联系营养师根据个人口味和需求定制菜单' },
        { question: '如何保证食材新鲜？', answer: '所有食材当日采购，冷链配送，确保新鲜和安全' },
      ],
    },
    {
      id: 'elderly',
      name: '老年养生套餐',
      price: 78,
      originalPrice: 98,
      calories: 1600,
      description: '软糯易消化，温补养生',
      features: ['软糯食材', '温补配方', '低盐低脂'],
      icon: '🍲',
      color: '$orange10',
      rating: 4.9,
      reviewCount: 985,
      salesCount: 3821,
      badge: '好评',
      nutritionData: [
        { name: '蛋白质', value: 18, color: COLORS.primary },
        { name: '碳水化合物', value: 58, color: COLORS.success },
        { name: '脂肪', value: 12, color: COLORS.warning },
        { name: '膳食纤维', value: 12, color: COLORS.accent },
      ],
      weeklyMenu: [
        {
          day: '周一',
          breakfast: '红枣小米粥、蒸蛋糕、温牛奶',
          lunch: '软米饭、清蒸鱼片、炖南瓜',
          dinner: '山药粥、肉末豆腐、炒菠菜',
        },
        {
          day: '周二',
          breakfast: '莲子粥、软面包、豆浆',
          lunch: '软饭、红烧狮子头、蒸茄子',
          dinner: '百合粥、清蒸鸡肉、炒西兰花',
        },
        {
          day: '周三',
          breakfast: '银耳羹、鸡蛋羹、馒头',
          lunch: '烂面条、肉丸汤、蒸南瓜',
          dinner: '红薯粥、豆腐脑、清炒青菜',
        },
        {
          day: '周四',
          breakfast: '桂圆红枣粥、蒸南瓜、温豆浆',
          lunch: '糯米饭、炖鸡汤、蒸胡萝卜',
          dinner: '淮山粥、蒸水蛋、炒冬瓜',
        },
        {
          day: '周五',
          breakfast: '黑芝麻糊、蒸红薯、牛奶',
          lunch: '软饭、清炖牛肉、烂豆角',
          dinner: '玉米粥、蒸鸡蛋、炒油菜',
        },
        {
          day: '周六',
          breakfast: '核桃粥、蒸山药、豆浆',
          lunch: '面片汤、肉末茄子、蒸土豆',
          dinner: '薏米粥、蒸鱼糕、炒西葫芦',
        },
        {
          day: '周日',
          breakfast: '枸杞小米粥、蒸鸡蛋糕、热牛奶',
          lunch: '软米饭、清炖排骨汤、蒸南瓜',
          dinner: '燕麦粥、豆腐羹、炒丝瓜',
        },
      ],
      targetAudience: ['适合60岁以上老年人', '适合消化功能较弱的人群', '适合需要温补调理的中老年人'],
      faqs: [
        { question: '食物会不会太软？', answer: '根据老年人咀嚼能力调整，确保软糯但不失营养' },
        { question: '有无刺激性食物？', answer: '所有菜品低盐低油，避免刺激性调料' },
        { question: '适合有慢性病的老人吗？', answer: '可以，我们可根据病情定制低糖、低盐、低脂方案' },
      ],
    },
    {
      id: 'weight-loss',
      name: '轻体健康套餐',
      price: 88,
      originalPrice: 108,
      calories: 1200,
      description: '低卡高蛋白，健康减重',
      features: ['低卡路里', '高蛋白质', '饱腹感强'],
      icon: '🥙',
      color: '$purple10',
      rating: 4.7,
      reviewCount: 1532,
      salesCount: 6789,
      badge: '推荐',
      nutritionData: [
        { name: '蛋白质', value: 40, color: COLORS.primary },
        { name: '碳水化合物', value: 35, color: COLORS.success },
        { name: '脂肪', value: 10, color: COLORS.warning },
        { name: '膳食纤维', value: 15, color: COLORS.accent },
      ],
      weeklyMenu: [
        {
          day: '周一',
          breakfast: '无糖酸奶、水煮蛋白、全麦面包',
          lunch: '鸡胸肉沙拉、糙米饭、蒸西兰花',
          dinner: '清炒虾仁、豆腐汤、水煮青菜',
        },
        {
          day: '周二',
          breakfast: '燕麦粥、蛋白、苹果',
          lunch: '三文鱼、藜麦饭、芦笋',
          dinner: '鸡胸肉、蔬菜汤、凉拌海带',
        },
        {
          day: '周三',
          breakfast: '希腊酸奶、坚果、蓝莓',
          lunch: '牛肉、红薯、生菜沙拉',
          dinner: '清蒸鳕鱼、豆腐、炒菠菜',
        },
        {
          day: '周四',
          breakfast: '蛋白奶昔、全麦吐司、奇亚籽',
          lunch: '烤鸡胸、紫薯、西红柿沙拉',
          dinner: '煮虾、冬瓜汤、水煮生菜',
        },
        {
          day: '周五',
          breakfast: '无糖豆浆、水煮蛋、燕麦片',
          lunch: '金枪鱼沙拉、糙米、水煮西兰花',
          dinner: '清蒸鲈鱼、豆腐、炒芹菜',
        },
        {
          day: '周六',
          breakfast: '脱脂牛奶、全麦面包、香蕉',
          lunch: '烤三文鱼、藜麦、芦笋沙拉',
          dinner: '白灼虾、紫菜汤、炒油菜',
        },
        {
          day: '周日',
          breakfast: '蛋白煎饼、蓝莓、黑咖啡',
          lunch: '鸡胸肉、红薯、牛油果沙拉',
          dinner: '清蒸鳕鱼、海带汤、水煮菜心',
        },
      ],
      targetAudience: ['适合需要健康减重的人群', '适合健身塑形的运动爱好者', '适合想要控制体重的上班族'],
      faqs: [
        { question: '会不会饿？', answer: '高蛋白搭配膳食纤维，饱腹感强，不会感到饥饿' },
        { question: '能减多少斤？', answer: '配合适当运动，每月健康减重4-6斤' },
        { question: '停用后会反弹吗？', answer: '通过调整饮食习惯，停用后也能保持体重' },
      ],
    },
    {
      id: 'premium',
      name: '尊享私厨套餐',
      price: 198,
      originalPrice: 298,
      calories: 2000,
      description: '米其林大厨定制，尊享品质',
      features: ['米其林主厨', '有机食材', '一对一营养师', '24小时服务', '免费试吃'],
      icon: '👨‍🍳',
      color: '$gold11',
      rating: 5.0,
      reviewCount: 328,
      salesCount: 1256,
      isVIP: true,
      badge: 'VIP',
      nutritionData: [
        { name: '优质蛋白质', value: 28, color: COLORS.primary },
        { name: '复合碳水', value: 42, color: COLORS.success },
        { name: '健康脂肪', value: 25, color: COLORS.warning },
        { name: '膳食纤维', value: 5, color: COLORS.accent },
      ],
      weeklyMenu: [
        {
          day: '周一',
          breakfast: '鲜榨果汁、班尼迪克蛋、烟熏三文鱼',
          lunch: '法式鹅肝、松露牛排、有机沙拉',
          dinner: '日式刺身拼盘、和牛寿喜锅、时令蔬菜',
        },
        {
          day: '周二',
          breakfast: '新鲜莓果燕麦、手工酸奶、坚果拼盘',
          lunch: '意式海鲜烩饭、烤鲈鱼、芝麻菜沙拉',
          dinner: '法式洋葱汤、香煎鸭胸、松露土豆泥',
        },
        {
          day: '周三',
          breakfast: '鲜榨蔬果汁、牛油果吐司、有机鸡蛋',
          lunch: '西班牙海鲜饭、烤章鱼、地中海沙拉',
          dinner: '法式蜗牛、慢烤羊排、松露野菌',
        },
        {
          day: '周四',
          breakfast: '松露炒蛋、鹅肝酱吐司、香槟',
          lunch: '波士顿龙虾、鱼子酱、凯撒沙拉',
          dinner: '神户牛排、红酒烩梨、芝士拼盘',
        },
        {
          day: '周五',
          breakfast: '有机奶昔、鲑鱼贝果、鲜果盘',
          lunch: '澳洲和牛、黑松露意面、芦笋',
          dinner: '帝王蟹、佛跳墙、清炒时蔬',
        },
        {
          day: '周六',
          breakfast: '法式可颂、鲜榨橙汁、伊比利亚火腿',
          lunch: '蓝鳍金枪鱼、鹅肝寿司、味噌汤',
          dinner: '法式羊排、红酒炖牛肉、黑松露',
        },
        {
          day: '周日',
          breakfast: '班尼迪克蛋、烟熏三文鱼、香槟',
          lunch: '顶级刺身、和牛烧肉、怀石料理',
          dinner: '法式海鲜拼盘、鹅肝慕斯、松露芝士',
        },
      ],
      targetAudience: [
        '追求极致品质的高端人群',
        '需要个性化定制服务的成功人士',
        '对食材品质有极高要求的美食家',
        '希望享受米其林级别用餐体验的客户',
      ],
      faqs: [
        { question: '和普通套餐有什么区别？', answer: '米其林星级大厨团队定制，采用全球精选有机食材，配备专属营养师一对一服务，享受24小时管家式服务' },
        { question: '可以指定菜品吗？', answer: '完全可以，我们提供100%个性化定制服务，根据您的口味偏好和营养需求量身打造专属菜单' },
        { question: '配送方式有何不同？', answer: '专车专人配送，保温箱全程恒温，配送员均经过专业礼仪培训，确保用餐体验的每个细节都完美无瑕' },
        { question: '是否提供试吃服务？', answer: '是的，尊享套餐客户可享受免费上门试吃服务，满意后再订购，7天无理由退款保障' },
      ],
    },
  ];

  const selectedPlan = mealPlans.find(p => p.id === selectedPlanId) || mealPlans[0];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setActiveTab('intro');
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    Alert.alert(isFavorited ? '已取消收藏' : '已收藏');
  };

  const handleShare = () => {
    Alert.alert('分享', '分享套餐信息');
  };

  const handleBuyNow = () => {
    navigation.navigate('Checkout' as never, {
      itemType: 'meal_plan',
      itemId: selectedPlan.id,
      itemName: selectedPlan.name,
      price: selectedPlan.price,
      packageIcon: selectedPlan.icon,
    } as never);
  };

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
        <XStack gap="$3" alignItems="center">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <YStack>
            <H3 fontSize="$6" fontWeight="bold">
              营养配餐
            </H3>
            <Text fontSize="$2" color="$gray10">
              专业营养方案定制
            </Text>
          </YStack>
        </XStack>
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
          {/* Hero Section */}
          <Card backgroundColor={COLORS.primary} padding="$5" borderRadius="$6">
            <YStack gap="$3">
              <XStack gap="$2" alignItems="center">
                <ChefHat size={24} color="white" />
                <H2 fontSize="$7" fontWeight="bold" color="white">
                  专业营养配餐服务
                </H2>
              </XStack>
              <Paragraph fontSize="$3" color="white" opacity={0.9}>
                由专业营养师团队定制，根据您的健康状况和饮食偏好，提供科学营养的每日三餐
              </Paragraph>
              <XStack gap="$3">
                <Card
                  f={1}
                  backgroundColor="rgba(255,255,255,0.2)"
                  padding="$3"
                  borderRadius="$4"
                >
                  <Text fontSize="$7" fontWeight="bold" color="white">
                    1000+
                  </Text>
                  <Text fontSize="$2" color="white" opacity={0.9}>
                    服务用户
                  </Text>
                </Card>
                <Card
                  f={1}
                  backgroundColor="rgba(255,255,255,0.2)"
                  padding="$3"
                  borderRadius="$4"
                >
                  <Text fontSize="$7" fontWeight="bold" color="white">
                    4.9
                  </Text>
                  <Text fontSize="$2" color="white" opacity={0.9}>
                    用户评分
                  </Text>
                </Card>
                <Card
                  f={1}
                  backgroundColor="rgba(255,255,255,0.2)"
                  padding="$3"
                  borderRadius="$4"
                >
                  <Text fontSize="$7" fontWeight="bold" color="white">
                    98%
                  </Text>
                  <Text fontSize="$2" color="white" opacity={0.9}>
                    满意度
                  </Text>
                </Card>
              </XStack>
            </YStack>
          </Card>

          {/* Meal Plan Selection */}
          <YStack gap="$3">
            <H3 fontSize="$5" fontWeight="bold">
              选择您的套餐
            </H3>
            <XStack gap="$3" flexWrap="wrap">
              {mealPlans.map((plan) => (
                <Card
                  key={plan.id}
                  flex={1}
                  minWidth="45%"
                  maxWidth="48%"
                  bordered
                  borderWidth={2}
                  borderColor={selectedPlanId === plan.id ? COLORS.primary : '$borderColor'}
                  pressStyle={{ scale: 0.95 }}
                  onPress={() => handleSelectPlan(plan.id)}
                  overflow="hidden"
                  marginBottom="$3"
                >
                  <Card
                    backgroundColor={plan.color}
                    padding="$3"
                    alignItems="center"
                    position="relative"
                  >
                    <Text fontSize={32}>{plan.icon}</Text>
                    {plan.badge && (
                      <View
                        position="absolute"
                        top={4}
                        right={4}
                        backgroundColor={plan.isVIP ? '#FFD700' : '$red10'}
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$2"
                      >
                        <XStack gap="$1" alignItems="center">
                          {plan.isVIP && <Crown size={10} color="white" />}
                          <Text fontSize="$1" color="white" fontWeight="700">
                            {plan.badge}
                          </Text>
                        </XStack>
                      </View>
                    )}
                    {selectedPlanId === plan.id && (
                      <View
                        position="absolute"
                        bottom={4}
                        right={4}
                        backgroundColor={COLORS.primary}
                        width={20}
                        height={20}
                        borderRadius={10}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CheckCircle2 size={14} color={COLORS.primary} fill="white" strokeWidth={0} />
                      </View>
                    )}
                  </Card>
                  <YStack padding="$3" gap="$2" minHeight={85}>
                    <H4 fontSize="$4" fontWeight="bold" numberOfLines={1}>
                      {plan.name}
                    </H4>
                    <XStack alignItems="baseline" gap="$1">
                      <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                        ¥{plan.price}
                      </Text>
                      <Text fontSize="$2" color="$gray10" textDecorationLine="line-through">
                        ¥{plan.originalPrice}
                      </Text>
                    </XStack>
                  </YStack>
                </Card>
              ))}
            </XStack>
          </YStack>

          {/* Selected Plan Details */}
          <Card bordered padding="$4">
            <YStack gap="$3">
              {/* Plan Header */}
              <XStack gap="$3" alignItems="center">
                <Card backgroundColor={selectedPlan.color} padding="$4" borderRadius="$10">
                  <Text fontSize={48}>{selectedPlan.icon}</Text>
                </Card>
                <YStack f={1} gap="$2">
                  <XStack gap="$2" alignItems="center">
                    <H3 fontSize="$6" fontWeight="bold">
                      {selectedPlan.name}
                    </H3>
                    {selectedPlan.isVIP && (
                      <Sparkles size={20} color="#FFD700" />
                    )}
                  </XStack>
                  <Paragraph fontSize="$3" color="$gray11">
                    {selectedPlan.description}
                  </Paragraph>
                  <XStack gap="$3" alignItems="center">
                    <XStack gap="$1" alignItems="center">
                      <Star size={14} color="#FCD34D" fill="#FCD34D" />
                      <Text fontSize="$3" fontWeight="600">
                        {selectedPlan.rating}
                      </Text>
                      <Text fontSize="$2" color="$gray11">
                        ({selectedPlan.reviewCount}评价)
                      </Text>
                    </XStack>
                    <Text fontSize="$2" color="$gray11">
                      已售{selectedPlan.salesCount}份
                    </Text>
                  </XStack>
                </YStack>
              </XStack>

              <Separator />

              {/* Price & Features */}
              <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$1">
                  <XStack alignItems="baseline" gap="$2">
                    <Text fontSize="$8" fontWeight="bold" color={selectedPlan.isVIP ? '#FFD700' : COLORS.primary}>
                      ¥{selectedPlan.price}
                    </Text>
                    <Text fontSize="$3" color="$gray10">
                      /天
                    </Text>
                    <Text fontSize="$3" color="$gray10" textDecorationLine="line-through">
                      ¥{selectedPlan.originalPrice}
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$gray11">
                    约 {selectedPlan.calories} 千卡/天
                  </Text>
                </YStack>
              </XStack>

              {/* Features */}
              <XStack gap="$2" flexWrap="wrap">
                {selectedPlan.features.map((feature, index) => (
                  <Card
                    key={index}
                    backgroundColor={selectedPlan.isVIP ? 'rgba(255, 215, 0, 0.1)' : `${COLORS.primary}20`}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$10"
                    borderWidth={selectedPlan.isVIP ? 1 : 0}
                    borderColor={selectedPlan.isVIP ? '#FFD700' : 'transparent'}
                  >
                    <Text fontSize="$2" color={selectedPlan.isVIP ? '#B8860B' : COLORS.primary} fontWeight="600">
                      {feature}
                    </Text>
                  </Card>
                ))}
              </XStack>
            </YStack>
          </Card>

          {/* Tab Navigation - 使用与PersonalCenterScreen相同的方式 */}
          <Card bordered padding="$4">
            <YStack gap="$4">
              {/* Tab Buttons */}
              <XStack
                backgroundColor="$surface"
                borderRadius="$3"
                padding="$1"
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('intro')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'intro' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'intro' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'intro' ? '600' : '400'}
                    >
                      套餐介绍
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('reviews')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'reviews' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'reviews' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'reviews' ? '600' : '400'}
                    >
                      用户评价
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab('faq')}
                >
                  <View
                    flex={1}
                    height={32}
                    backgroundColor={activeTab === 'faq' ? COLORS.primary : 'transparent'}
                    borderRadius="$2"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$3"
                  >
                    <Text
                      fontSize="$3"
                      color={activeTab === 'faq' ? 'white' : '$textSecondary'}
                      fontWeight={activeTab === 'faq' ? '600' : '400'}
                    >
                      常见问题
                    </Text>
                  </View>
                </TouchableOpacity>
              </XStack>

              {/* Tab Content - Intro */}
              {activeTab === 'intro' && (
                <YStack gap="$4">
                  {/* Nutrition Analysis */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="bold">
                      营养成分分析
                    </H4>
                    {selectedPlan.nutritionData.map((item, index) => (
                      <YStack key={index} gap="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" color="$gray11">
                            {item.name}
                          </Text>
                          <Text fontSize="$3" fontWeight="600">
                            {item.value}%
                          </Text>
                        </XStack>
                        <YStack height={8} backgroundColor="$gray5" borderRadius="$2">
                          <YStack
                            height={8}
                            width={`${item.value}%`}
                            backgroundColor={item.color}
                            borderRadius="$2"
                          />
                        </YStack>
                      </YStack>
                    ))}
                  </YStack>

                  <Separator />

                  {/* Weekly Menu */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="bold">
                      每周菜单示例
                    </H4>
                    {selectedPlan.weeklyMenu.map((menu, index) => (
                      <Card key={index} bordered padding="$3">
                        <YStack gap="$2">
                          <Text fontSize="$3" fontWeight="bold" color={COLORS.primary}>
                            {menu.day}
                          </Text>
                          <YStack gap="$1">
                            <Text fontSize="$2" color="$gray11">
                              早餐: {menu.breakfast}
                            </Text>
                            <Text fontSize="$2" color="$gray11">
                              午餐: {menu.lunch}
                            </Text>
                            <Text fontSize="$2" color="$gray11">
                              晚餐: {menu.dinner}
                            </Text>
                          </YStack>
                        </YStack>
                      </Card>
                    ))}
                  </YStack>

                  <Separator />

                  {/* Target Audience */}
                  <YStack gap="$3">
                    <H4 fontSize="$4" fontWeight="bold">
                      适用人群
                    </H4>
                    {selectedPlan.targetAudience.map((audience, index) => (
                      <XStack key={index} gap="$2" alignItems="flex-start">
                        <CheckCircle2 size={16} color={COLORS.success} style={{ marginTop: 2 }} />
                        <Text fontSize="$3" color="$gray11" f={1}>
                          {audience}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              )}

              {/* Tab Content - Reviews */}
              {activeTab === 'reviews' && (
                <YStack gap="$4">
                  {/* Rating Summary */}
                  <Card bordered padding="$4">
                    <XStack gap="$4" alignItems="center">
                      <YStack alignItems="center" gap="$1">
                        <Text fontSize="$10" fontWeight="bold">
                          {selectedPlan.rating}
                        </Text>
                        <XStack gap="$1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              color="#FCD34D"
                              fill={star <= Math.floor(selectedPlan.rating) ? '#FCD34D' : 'none'}
                            />
                          ))}
                        </XStack>
                        <Text fontSize="$2" color="$gray11">
                          {selectedPlan.reviewCount}条评价
                        </Text>
                      </YStack>
                      <Separator vertical />
                      <YStack f={1} gap="$2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <XStack key={rating} gap="$2" alignItems="center">
                            <Text fontSize="$2" color="$gray11" width={40}>
                              {rating}星
                            </Text>
                            <YStack f={1} height={8} backgroundColor="$gray5" borderRadius="$2">
                              <YStack
                                height={8}
                                width={`${rating === 5 ? 80 : rating === 4 ? 15 : 5}%`}
                                backgroundColor="$yellow10"
                                borderRadius="$2"
                              />
                            </YStack>
                          </XStack>
                        ))}
                      </YStack>
                    </XStack>
                  </Card>

                  {/* Sample Reviews */}
                  <Card bordered padding="$4">
                    <YStack gap="$3">
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$3" fontWeight="600">
                          李**
                        </Text>
                        <Text fontSize="$2" color="$gray11">
                          2024-01-20
                        </Text>
                      </XStack>
                      <XStack gap="$1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} color="#FCD34D" fill="#FCD34D" />
                        ))}
                      </XStack>
                      <Paragraph fontSize="$3" color="$gray11" lineHeight="$4">
                        非常满意，营养搭配合理，口味也不错。配送很准时，包装很好。
                      </Paragraph>
                    </YStack>
                  </Card>

                  <Card bordered padding="$4">
                    <YStack gap="$3">
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$3" fontWeight="600">
                          王**
                        </Text>
                        <Text fontSize="$2" color="$gray11">
                          2024-01-18
                        </Text>
                      </XStack>
                      <XStack gap="$1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} color="#FCD34D" fill={star <= 4 ? '#FCD34D' : 'none'} />
                        ))}
                      </XStack>
                      <Paragraph fontSize="$3" color="$gray11" lineHeight="$4">
                        帮我妈妈订的，她说很好吃，食材新鲜，分量也足。会继续订购。
                      </Paragraph>
                    </YStack>
                  </Card>
                </YStack>
              )}

              {/* Tab Content - FAQ */}
              {activeTab === 'faq' && (
                <YStack gap="$3">
                  {selectedPlan.faqs.map((faq, index) => (
                    <Card key={index} bordered padding="$4">
                      <YStack gap="$2">
                        <Text fontSize="$3" fontWeight="bold" color={COLORS.primary}>
                          Q: {faq.question}
                        </Text>
                        <Paragraph fontSize="$3" color="$gray11" lineHeight="$4">
                          A: {faq.answer}
                        </Paragraph>
                      </YStack>
                    </Card>
                  ))}
                </YStack>
              )}
            </YStack>
          </Card>

          {/* Nutritionists */}
          <Card bordered padding="$4">
            <YStack gap="$3">
              <H3 fontSize="$5" fontWeight="bold">
                专业营养师团队
              </H3>
              <YStack gap="$3">
                {nutritionists.map((nutritionist) => (
                  <Card
                    key={nutritionist.id}
                    backgroundColor="$gray2"
                    padding="$4"
                    borderRadius="$4"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => {
                      navigation.navigate('NutritionistDetail' as never, {
                        nutritionistId: nutritionist.id,
                        nutritionistName: nutritionist.name,
                      } as never);
                    }}
                  >
                    <XStack gap="$3" marginBottom="$3">
                      <Text fontSize={40}>{nutritionist.avatar}</Text>
                      <YStack f={1} gap="$1">
                        <H4 fontSize="$4" fontWeight="600">
                          {nutritionist.name}
                        </H4>
                        <Text fontSize="$3" color="$gray11">
                          {nutritionist.title}
                        </Text>
                        <XStack gap="$1" alignItems="center">
                          <Star size={12} color="#FCD34D" fill="#FCD34D" />
                          <Text fontSize="$3" fontWeight="600">
                            {nutritionist.rating}
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>
                    <YStack gap="$2" marginBottom="$3">
                      <XStack gap="$2" alignItems="center">
                        <Circle size={6} backgroundColor={COLORS.primary} />
                        <Text fontSize="$3" color="$gray11">
                          从业 {nutritionist.experience}
                        </Text>
                      </XStack>
                      <XStack gap="$2" alignItems="center">
                        <Circle size={6} backgroundColor={COLORS.primary} />
                        <Text fontSize="$3" color="$gray11">
                          擅长: {nutritionist.specialty}
                        </Text>
                      </XStack>
                      <XStack gap="$2" alignItems="center">
                        <Circle size={6} backgroundColor={COLORS.primary} />
                        <Text fontSize="$3" color="$gray11">
                          已服务 {nutritionist.consultations}+ 人
                        </Text>
                      </XStack>
                    </YStack>
                    <Button
                      backgroundColor={COLORS.primary}
                      color="white"
                      size="$3"
                      onPress={(e) => {
                        e.stopPropagation();
                        navigation.navigate('NutritionistDetail' as never, {
                          nutritionistId: index + 1,
                          nutritionistName: nutritionist.name,
                        } as never);
                      }}
                    >
                      预约咨询
                    </Button>
                  </Card>
                ))}
              </YStack>
            </YStack>
          </Card>
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
        paddingBottom={insets.bottom + 16}
        gap="$2"
      >
        <YStack f={1}>
          <Text fontSize="$2" color="$gray11">
            已选择
          </Text>
          <XStack alignItems="baseline" gap="$1">
            <Text fontSize="$6" fontWeight="bold" color={selectedPlan.isVIP ? '#FFD700' : COLORS.primary}>
              ¥{selectedPlan.price}
            </Text>
            <Text fontSize="$2" color="$gray11">
              /天
            </Text>
          </XStack>
        </YStack>
        <Button
          f={2}
          size="$4"
          backgroundColor={selectedPlan.isVIP ? '#FFD700' : COLORS.primary}
          color="white"
          fontWeight="600"
          icon={() => <ShoppingCart size={20} color="white" />}
          pressStyle={{ opacity: 0.9 }}
          onPress={handleBuyNow}
        >
          立即购买
        </Button>
      </XStack>
    </YStack>
  );
};

export default NutritionServiceScreen;