import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, TouchableOpacity, ImageBackground, Image, ImageSourcePropType } from 'react-native';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';

// 本地图片资源
const NUTRITION_IMAGES = {
  banner: require('../../assets/images/product/zhuanye-yingyang-peican.jpg'),
  junhengyingyang: require('../../assets/images/product/junheng-yingyang-taocan.png'),
  laonianyangsheng: require('../../assets/images/product/laonian-yangsheng-taocan.jpg'),
  zunxiangsichu: require('../../assets/images/product/zunxiang-sichu-taocan.jpg'),
};
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 路由参数类型
type NutritionServiceRouteParams = {
  NutritionService: {
    selectedMealPlanId?: string;
  };
};
import { getNutritionists } from '@/services/nutritionistService';
import {
  YStack,
  XStack,
  Text,
  View,
  useTheme,
} from 'tamagui';
import {
  ChefHat,
  Star,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

interface MealPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  calories: number;
  description: string;
  features: string[];
  image: string | ImageSourcePropType;
  rating: number;
  reviewCount: number;
  salesCount: number;
  nutritionData: {
    name: string;
    value: number;
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
}

interface Nutritionist {
  id: string;
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
  const route = useRoute<RouteProp<NutritionServiceRouteParams, 'NutritionService'>>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // 使用主色调统一所有套餐
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  const [selectedPlanId, setSelectedPlanId] = useState<string>('balanced');
  const [activeTab, setActiveTab] = useState<'intro' | 'reviews' | 'faq'>('intro');
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);

  // 处理路由参数：如果传入了 selectedMealPlanId，自动选中对应套餐
  useEffect(() => {
    const paramMealPlanId = route.params?.selectedMealPlanId;
    if (paramMealPlanId) {
      // 验证传入的套餐ID是否有效
      const validIds = ['balanced', 'elderly', 'weight-loss', 'premium'];
      if (validIds.includes(paramMealPlanId)) {
        setSelectedPlanId(paramMealPlanId);
        setActiveTab('intro');
      }
    }
  }, [route.params?.selectedMealPlanId]);

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
      image: NUTRITION_IMAGES.junhengyingyang,
      rating: 4.8,
      reviewCount: 1256,
      salesCount: 5432,
      nutritionData: [
        { name: '蛋白质', value: 25 },
        { name: '碳水化合物', value: 50 },
        { name: '脂肪', value: 20 },
        { name: '膳食纤维', value: 5 },
      ],
      weeklyMenu: [
        { day: '周一', breakfast: '燕麦粥、水煮蛋、全麦面包', lunch: '糙米饭、清蒸鲈鱼、西兰花', dinner: '小米粥、蒸蛋羹、凉拌黄瓜' },
        { day: '周二', breakfast: '豆浆、煎蛋、蔬菜包', lunch: '红薯饭、番茄炖牛肉、炒青菜', dinner: '玉米粥、清蒸鸡胸肉、拌豆腐' },
        { day: '周三', breakfast: '牛奶、全麦三明治、水果', lunch: '杂粮饭、红烧鸡腿、素炒三丝', dinner: '南瓜粥、清炒虾仁、凉拌木耳' },
        { day: '周四', breakfast: '紫薯粥、茶叶蛋、蒸玉米', lunch: '糙米饭、香菇炖鸡、蒜蓉油菜', dinner: '黑米粥、煎三文鱼、炒芦笋' },
        { day: '周五', breakfast: '八宝粥、煮鸡蛋、烤红薯', lunch: '藜麦饭、清炖排骨、炒时蔬', dinner: '绿豆粥、蒸鳕鱼、凉拌海带' },
        { day: '周六', breakfast: '豆腐脑、油条、小米粥', lunch: '五谷饭、红烧带鱼、炒豆角', dinner: '银耳莲子羹、清蒸虾、蒜蓉西兰花' },
        { day: '周日', breakfast: '南瓜粥、煎饼果子、豆浆', lunch: '糙米饭、番茄牛腩、清炒菠菜', dinner: '山药薏米粥、蒸蛋羹、拍黄瓜' },
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
      image: NUTRITION_IMAGES.laonianyangsheng,
      rating: 4.9,
      reviewCount: 985,
      salesCount: 3821,
      nutritionData: [
        { name: '蛋白质', value: 18 },
        { name: '碳水化合物', value: 58 },
        { name: '脂肪', value: 12 },
        { name: '膳食纤维', value: 12 },
      ],
      weeklyMenu: [
        { day: '周一', breakfast: '红枣小米粥、蒸蛋糕、温牛奶', lunch: '软米饭、清蒸鱼片、炖南瓜', dinner: '山药粥、肉末豆腐、炒菠菜' },
        { day: '周二', breakfast: '莲子粥、软面包、豆浆', lunch: '软饭、红烧狮子头、蒸茄子', dinner: '百合粥、清蒸鸡肉、炒西兰花' },
        { day: '周三', breakfast: '银耳羹、鸡蛋羹、馒头', lunch: '烂面条、肉丸汤、蒸南瓜', dinner: '红薯粥、豆腐脑、清炒青菜' },
        { day: '周四', breakfast: '桂圆红枣粥、蒸南瓜、温豆浆', lunch: '糯米饭、炖鸡汤、蒸胡萝卜', dinner: '淮山粥、蒸水蛋、炒冬瓜' },
        { day: '周五', breakfast: '黑芝麻糊、蒸红薯、牛奶', lunch: '软饭、清炖牛肉、烂豆角', dinner: '玉米粥、蒸鸡蛋、炒油菜' },
        { day: '周六', breakfast: '核桃粥、蒸山药、豆浆', lunch: '面片汤、肉末茄子、蒸土豆', dinner: '薏米粥、蒸鱼糕、炒西葫芦' },
        { day: '周日', breakfast: '枸杞小米粥、蒸鸡蛋糕、热牛奶', lunch: '软米饭、清炖排骨汤、蒸南瓜', dinner: '燕麦粥、豆腐羹、炒丝瓜' },
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
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
      rating: 4.7,
      reviewCount: 1532,
      salesCount: 6789,
      nutritionData: [
        { name: '蛋白质', value: 40 },
        { name: '碳水化合物', value: 35 },
        { name: '脂肪', value: 10 },
        { name: '膳食纤维', value: 15 },
      ],
      weeklyMenu: [
        { day: '周一', breakfast: '无糖酸奶、水煮蛋白、全麦面包', lunch: '鸡胸肉沙拉、糙米饭、蒸西兰花', dinner: '清炒虾仁、豆腐汤、水煮青菜' },
        { day: '周二', breakfast: '燕麦粥、蛋白、苹果', lunch: '三文鱼、藜麦饭、芦笋', dinner: '鸡胸肉、蔬菜汤、凉拌海带' },
        { day: '周三', breakfast: '希腊酸奶、坚果、蓝莓', lunch: '牛肉、红薯、生菜沙拉', dinner: '清蒸鳕鱼、豆腐、炒菠菜' },
        { day: '周四', breakfast: '蛋白奶昔、全麦吐司、奇亚籽', lunch: '烤鸡胸、紫薯、西红柿沙拉', dinner: '煮虾、冬瓜汤、水煮生菜' },
        { day: '周五', breakfast: '无糖豆浆、水煮蛋、燕麦片', lunch: '金枪鱼沙拉、糙米、水煮西兰花', dinner: '清蒸鲈鱼、豆腐、炒芹菜' },
        { day: '周六', breakfast: '脱脂牛奶、全麦面包、香蕉', lunch: '烤三文鱼、藜麦、芦笋沙拉', dinner: '白灼虾、紫菜汤、炒油菜' },
        { day: '周日', breakfast: '蛋白煎饼、蓝莓、黑咖啡', lunch: '鸡胸肉、红薯、牛油果沙拉', dinner: '清蒸鳕鱼、海带汤、水煮菜心' },
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
      image: NUTRITION_IMAGES.zunxiangsichu,
      rating: 5.0,
      reviewCount: 328,
      salesCount: 1256,
      nutritionData: [
        { name: '优质蛋白质', value: 28 },
        { name: '复合碳水', value: 42 },
        { name: '健康脂肪', value: 25 },
        { name: '膳食纤维', value: 5 },
      ],
      weeklyMenu: [
        { day: '周一', breakfast: '鲜榨果汁、班尼迪克蛋、烟熏三文鱼', lunch: '法式鹅肝、松露牛排、有机沙拉', dinner: '日式刺身拼盘、和牛寿喜锅、时令蔬菜' },
        { day: '周二', breakfast: '新鲜莓果燕麦、手工酸奶、坚果拼盘', lunch: '意式海鲜烩饭、烤鲈鱼、芝麻菜沙拉', dinner: '法式洋葱汤、香煎鸭胸、松露土豆泥' },
        { day: '周三', breakfast: '鲜榨蔬果汁、牛油果吐司、有机鸡蛋', lunch: '西班牙海鲜饭、烤章鱼、地中海沙拉', dinner: '法式蜗牛、慢烤羊排、松露野菌' },
        { day: '周四', breakfast: '松露炒蛋、鹅肝酱吐司、香槟', lunch: '波士顿龙虾、鱼子酱、凯撒沙拉', dinner: '神户牛排、红酒烩梨、芝士拼盘' },
        { day: '周五', breakfast: '有机奶昔、鲑鱼贝果、鲜果盘', lunch: '澳洲和牛、黑松露意面、芦笋', dinner: '帝王蟹、佛跳墙、清炒时蔬' },
        { day: '周六', breakfast: '法式可颂、鲜榨橙汁、伊比利亚火腿', lunch: '蓝鳍金枪鱼、鹅肝寿司、味噌汤', dinner: '法式羊排、红酒炖牛肉、黑松露' },
        { day: '周日', breakfast: '班尼迪克蛋、烟熏三文鱼、香槟', lunch: '顶级刺身、和牛烧肉、怀石料理', dinner: '法式海鲜拼盘、鹅肝慕斯、松露芝士' },
      ],
      targetAudience: ['追求极致品质的高端人群', '需要个性化定制服务的成功人士', '对食材品质有极高要求的美食家', '希望享受米其林级别用餐体验的客户'],
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

  const handleBuyNow = () => {
    navigation.navigate('Checkout' as never, {
      itemType: 'meal_plan',
      itemId: selectedPlan.id,
      itemName: selectedPlan.name,
      price: selectedPlan.price,
      packageImage: selectedPlan.image,
    } as never);
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* TitleBar - 使用全局组件 */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="营养配餐" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* Hero Section - 真实图片背景 */}
          <View borderRadius="$5" overflow="hidden" height={160}>
            <ImageBackground
              source={NUTRITION_IMAGES.banner}
              style={{ flex: 1 }}
              imageStyle={{ borderRadius: 16 }}
            >
              {/* 渐变遮罩 */}
              <View
                flex={1}
                backgroundColor="rgba(0,0,0,0.4)"
                padding="$3"
                justifyContent="space-between"
              >
                <YStack gap="$1">
                  <XStack gap="$2" alignItems="center">
                    <ChefHat size={22} color="white" />
                    <Text fontSize="$5" fontWeight="bold" color="white">
                      专业营养配餐
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="white" opacity={0.95}>
                    营养师定制 · 科学配比 · 每日三餐
                  </Text>
                </YStack>
                <XStack gap="$2">
                  <View
                    flex={1}
                    backgroundColor="rgba(255,255,255,0.25)"
                    padding="$1.5"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <Text fontSize="$4" fontWeight="bold" color="white">
                      1000+
                    </Text>
                    <Text fontSize="$1" color="white" opacity={0.9}>
                      服务用户
                    </Text>
                  </View>
                  <View
                    flex={1}
                    backgroundColor="rgba(255,255,255,0.25)"
                    padding="$1.5"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <Text fontSize="$4" fontWeight="bold" color="white">
                      4.9
                    </Text>
                    <Text fontSize="$1" color="white" opacity={0.9}>
                      评分
                    </Text>
                  </View>
                  <View
                    flex={1}
                    backgroundColor="rgba(255,255,255,0.25)"
                    padding="$1.5"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <Text fontSize="$4" fontWeight="bold" color="white">
                      98%
                    </Text>
                    <Text fontSize="$1" color="white" opacity={0.9}>
                      满意度
                    </Text>
                  </View>
                </XStack>
              </View>
            </ImageBackground>
          </View>

          {/* Meal Plan Selection - 统一样式 */}
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              选择您的套餐
            </Text>
            {/* 第一行2个套餐 */}
            <XStack gap="$2">
              {mealPlans.slice(0, 2).map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <Pressable
                    key={plan.id}
                    style={{ flex: 1 }}
                    onPress={() => handleSelectPlan(plan.id)}
                  >
                    <View
                      borderWidth={2}
                      borderColor={isSelected ? '$primary' : '$color5'}
                      borderRadius="$5"
                      overflow="hidden"
                    >
                      {/* 图片区域 - 真实食物照片 */}
                      <View height={80} position="relative">
                        <Image
                          source={typeof plan.image === 'string' ? { uri: plan.image } : plan.image}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                        {/* 选中标记 */}
                        {isSelected && (
                          <View
                            position="absolute"
                            bottom={4}
                            right={4}
                            backgroundColor="$primary"
                            width={22}
                            height={22}
                            borderRadius={11}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <CheckCircle2 size={14} color="white" />
                          </View>
                        )}
                      </View>
                      {/* 信息区域 */}
                      <YStack padding="$2" gap="$1" minHeight={72} backgroundColor="$color2">
                        <Text fontSize="$4" fontWeight="bold" color="$color12" numberOfLines={1}>
                          {plan.name}
                        </Text>
                        <XStack alignItems="baseline" gap="$1">
                          <Text fontSize="$6" fontWeight="bold" color="$primary">
                            ¥{plan.price}
                          </Text>
                          <Text fontSize="$2" color="$color10" textDecorationLine="line-through">
                            ¥{plan.originalPrice}
                          </Text>
                        </XStack>
                      </YStack>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
            {/* 第二行2个套餐 */}
            <XStack gap="$2">
              {mealPlans.slice(2, 4).map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <Pressable
                    key={plan.id}
                    style={{ flex: 1 }}
                    onPress={() => handleSelectPlan(plan.id)}
                  >
                    <View
                      borderWidth={2}
                      borderColor={isSelected ? '$primary' : '$color5'}
                      borderRadius="$5"
                      overflow="hidden"
                    >
                      {/* 图片区域 - 真实食物照片 */}
                      <View height={80} position="relative">
                        <Image
                          source={typeof plan.image === 'string' ? { uri: plan.image } : plan.image}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                        {/* 选中标记 */}
                        {isSelected && (
                          <View
                            position="absolute"
                            bottom={4}
                            right={4}
                            backgroundColor="$primary"
                            width={22}
                            height={22}
                            borderRadius={11}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <CheckCircle2 size={14} color="white" />
                          </View>
                        )}
                      </View>
                      {/* 信息区域 */}
                      <YStack padding="$2" gap="$1" minHeight={72} backgroundColor="$color2">
                        <Text fontSize="$4" fontWeight="bold" color="$color12" numberOfLines={1}>
                          {plan.name}
                        </Text>
                        <XStack alignItems="baseline" gap="$1">
                          <Text fontSize="$6" fontWeight="bold" color="$primary">
                            ¥{plan.price}
                          </Text>
                          <Text fontSize="$2" color="$color10" textDecorationLine="line-through">
                            ¥{plan.originalPrice}
                          </Text>
                        </XStack>
                      </YStack>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
          </YStack>

          {/* Selected Plan Details */}
          <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2">
            <YStack gap="$2">
              {/* Plan Header */}
              <XStack gap="$3" alignItems="center">
                <View width={72} height={72} borderRadius="$4" overflow="hidden">
                  <Image
                    source={typeof selectedPlan.image === 'string' ? { uri: selectedPlan.image } : selectedPlan.image}
                    style={{ width: 72, height: 72 }}
                    resizeMode="cover"
                  />
                </View>
                <YStack flex={1} gap="$1">
                  <Text fontSize="$5" fontWeight="bold" color="$color12">
                    {selectedPlan.name}
                  </Text>
                  <Text fontSize="$3" color="$color10">
                    {selectedPlan.description}
                  </Text>
                  <XStack gap="$3" alignItems="center">
                    <XStack gap="$1" alignItems="center">
                      <Star size={14} color={warningColor} fill={warningColor} />
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {selectedPlan.rating}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        ({selectedPlan.reviewCount}评价)
                      </Text>
                    </XStack>
                    <Text fontSize="$2" color="$color10">
                      已售{selectedPlan.salesCount}份
                    </Text>
                  </XStack>
                </YStack>
              </XStack>

              <View height={1} backgroundColor="$color5" />

              {/* Price */}
              <XStack alignItems="baseline" gap="$2">
                <Text fontSize="$7" fontWeight="bold" color="$primary">
                  ¥{selectedPlan.price}
                </Text>
                <Text fontSize="$3" color="$color10">/天</Text>
                <Text fontSize="$3" color="$color10" textDecorationLine="line-through">
                  ¥{selectedPlan.originalPrice}
                </Text>
                <Text fontSize="$2" color="$color10" marginLeft="$2">
                  约 {selectedPlan.calories} 千卡/天
                </Text>
              </XStack>

              {/* Features */}
              <XStack gap="$2" flexWrap="wrap">
                {selectedPlan.features.map((feature, index) => (
                  <View
                    key={index}
                    backgroundColor={`${primaryColor}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$10"
                  >
                    <Text fontSize="$2" color="$primary" fontWeight="600">
                      {feature}
                    </Text>
                  </View>
                ))}
              </XStack>
            </YStack>
          </View>

          {/* Tab Navigation */}
          <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2">
            <YStack gap="$2">
              {/* Tab Buttons */}
              <XStack backgroundColor="$color3" borderRadius="$3" padding="$1">
                {(['intro', 'reviews', 'faq'] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={{ flex: 1 }}
                    onPress={() => setActiveTab(tab)}
                  >
                    <View
                      height={32}
                      backgroundColor={activeTab === tab ? '$primary' : 'transparent'}
                      borderRadius="$2"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text
                        fontSize="$3"
                        color={activeTab === tab ? 'white' : '$color10'}
                        fontWeight={activeTab === tab ? '600' : '400'}
                      >
                        {tab === 'intro' ? '套餐介绍' : tab === 'reviews' ? '用户评价' : '常见问题'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>

              {/* Tab Content - Intro */}
              {activeTab === 'intro' && (
                <YStack gap="$2">
                  {/* Nutrition Analysis */}
                  <YStack gap="$2">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      营养成分分析
                    </Text>
                    {selectedPlan.nutritionData.map((item, index) => (
                      <YStack key={index} gap="$1">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" color="$color10">{item.name}</Text>
                          <Text fontSize="$3" fontWeight="600" color="$color12">{item.value}%</Text>
                        </XStack>
                        <View height={6} backgroundColor="$color5" borderRadius="$2">
                          <View
                            height={6}
                            width={`${item.value}%`}
                            backgroundColor="$primary"
                            borderRadius="$2"
                          />
                        </View>
                      </YStack>
                    ))}
                  </YStack>

                  <View height={1} backgroundColor="$color5" />

                  {/* Weekly Menu */}
                  <YStack gap="$2">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      每周菜单示例
                    </Text>
                    {selectedPlan.weeklyMenu.map((menu, index) => (
                      <View key={index} borderWidth={1} borderColor="$color5" borderRadius="$4" padding="$2">
                        <YStack gap="$1">
                          <Text fontSize="$3" fontWeight="600" color="$primary">
                            {menu.day}
                          </Text>
                          <Text fontSize="$2" color="$color10">早餐: {menu.breakfast}</Text>
                          <Text fontSize="$2" color="$color10">午餐: {menu.lunch}</Text>
                          <Text fontSize="$2" color="$color10">晚餐: {menu.dinner}</Text>
                        </YStack>
                      </View>
                    ))}
                  </YStack>

                  <View height={1} backgroundColor="$color5" />

                  {/* Target Audience */}
                  <YStack gap="$2">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      适用人群
                    </Text>
                    {selectedPlan.targetAudience.map((audience, index) => (
                      <XStack key={index} gap="$2" alignItems="flex-start">
                        <CheckCircle2 size={16} color={successColor} style={{ marginTop: 2 }} />
                        <Text fontSize="$3" color="$color10" flex={1}>{audience}</Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              )}

              {/* Tab Content - Reviews */}
              {activeTab === 'reviews' && (
                <YStack gap="$2">
                  {/* Rating Summary */}
                  <View borderWidth={1} borderColor="$color5" borderRadius="$4" padding="$2">
                    <XStack gap="$3" alignItems="center">
                      <YStack alignItems="center" gap="$1">
                        <Text fontSize="$8" fontWeight="bold" color="$color12">
                          {selectedPlan.rating}
                        </Text>
                        <XStack gap="$0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              color={warningColor}
                              fill={star <= Math.floor(selectedPlan.rating) ? warningColor : 'none'}
                            />
                          ))}
                        </XStack>
                        <Text fontSize="$2" color="$color10">
                          {selectedPlan.reviewCount}条评价
                        </Text>
                      </YStack>
                      <View width={1} height={60} backgroundColor="$color5" />
                      <YStack flex={1} gap="$1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <XStack key={rating} gap="$2" alignItems="center">
                            <Text fontSize="$2" color="$color10" width={30}>{rating}星</Text>
                            <View flex={1} height={6} backgroundColor="$color5" borderRadius="$2">
                              <View
                                height={6}
                                width={`${rating === 5 ? 80 : rating === 4 ? 15 : 5}%`}
                                backgroundColor="$warning"
                                borderRadius="$2"
                              />
                            </View>
                          </XStack>
                        ))}
                      </YStack>
                    </XStack>
                  </View>

                  {/* Sample Reviews */}
                  {[
                    { name: '李**', date: '2024-01-20', rating: 5, content: '非常满意，营养搭配合理，口味也不错。配送很准时，包装很好。' },
                    { name: '王**', date: '2024-01-18', rating: 4, content: '帮我妈妈订的，她说很好吃，食材新鲜，分量也足。会继续订购。' },
                  ].map((review, index) => (
                    <View key={index} borderWidth={1} borderColor="$color5" borderRadius="$4" padding="$2">
                      <YStack gap="$1">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" fontWeight="600" color="$color12">{review.name}</Text>
                          <Text fontSize="$2" color="$color10">{review.date}</Text>
                        </XStack>
                        <XStack gap="$0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} color={warningColor} fill={star <= review.rating ? warningColor : 'none'} />
                          ))}
                        </XStack>
                        <Text fontSize="$3" color="$color10">{review.content}</Text>
                      </YStack>
                    </View>
                  ))}
                </YStack>
              )}

              {/* Tab Content - FAQ */}
              {activeTab === 'faq' && (
                <YStack gap="$2">
                  {selectedPlan.faqs.map((faq, index) => (
                    <View key={index} borderWidth={1} borderColor="$color5" borderRadius="$4" padding="$2">
                      <YStack gap="$1">
                        <Text fontSize="$3" fontWeight="600" color="$primary">
                          Q: {faq.question}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          A: {faq.answer}
                        </Text>
                      </YStack>
                    </View>
                  ))}
                </YStack>
              )}
            </YStack>
          </View>

          {/* Nutritionists */}
          <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2">
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600" color="$color12">
                专业营养师团队
              </Text>
              {/* 合作机构介绍 */}
              <View backgroundColor="$color3" padding="$2" borderRadius="$4">
                <Text fontSize="$3" color="$color10" lineHeight={20}>
                  本平台营养师团队来自深圳市营养学会、广东省营养师协会等专业机构，均持有国家注册营养师资格证书，为您提供科学、专业的营养配餐服务。
                </Text>
              </View>
              <YStack gap="$2">
                {nutritionists.map((nutritionist) => (
                  <Pressable
                    key={nutritionist.id}
                    onPress={() => {
                      navigation.navigate('NutritionistDetail' as never, {
                        nutritionistId: nutritionist.id,
                        nutritionistName: nutritionist.name,
                      } as never);
                    }}
                  >
                    <View backgroundColor="$color3" padding="$2" borderRadius="$4">
                      <XStack gap="$3" marginBottom="$2">
                        <Text fontSize={36}>{nutritionist.avatar}</Text>
                        <YStack flex={1} gap="$0.5">
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            {nutritionist.name}
                          </Text>
                          <Text fontSize="$3" color="$color10">
                            {nutritionist.title}
                          </Text>
                          <XStack gap="$1" alignItems="center">
                            <Star size={12} color={warningColor} fill={warningColor} />
                            <Text fontSize="$3" fontWeight="600" color="$color12">
                              {nutritionist.rating}
                            </Text>
                          </XStack>
                        </YStack>
                      </XStack>
                      <YStack gap="$1">
                        <XStack gap="$2" alignItems="center">
                          <View width={6} height={6} borderRadius={3} backgroundColor="$primary" />
                          <Text fontSize="$3" color="$color10">从业 {nutritionist.experience}</Text>
                        </XStack>
                        <XStack gap="$2" alignItems="center">
                          <View width={6} height={6} borderRadius={3} backgroundColor="$primary" />
                          <Text fontSize="$3" color="$color10">擅长: {nutritionist.specialty}</Text>
                        </XStack>
                        <XStack gap="$2" alignItems="center">
                          <View width={6} height={6} borderRadius={3} backgroundColor="$primary" />
                          <Text fontSize="$3" color="$color10">已服务 {nutritionist.consultations}+ 人</Text>
                        </XStack>
                      </YStack>
                      {/* 预约咨询按钮暂时隐藏
                      <Pressable
                        onPress={(e: any) => {
                          e.stopPropagation();
                          navigation.navigate('NutritionistDetail' as never, {
                            nutritionistId: nutritionist.id,
                            nutritionistName: nutritionist.name,
                          } as never);
                        }}
                      >
                        <View
                          backgroundColor="$primary"
                          paddingVertical="$2"
                          borderRadius="$3"
                          alignItems="center"
                        >
                          <Text color="white" fontSize="$3" fontWeight="600">
                            预约咨询
                          </Text>
                        </View>
                      </Pressable>
                      */}
                    </View>
                  </Pressable>
                ))}
              </YStack>
            </YStack>
          </View>
        </YStack>

        {/* Bottom spacing for floating button */}
        <View height={80} />
      </ScrollView>

      {/* Floating Bottom Button */}
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$background"
        borderTopWidth={1}
        borderTopColor="$color5"
        padding="$2"
        paddingBottom={insets.bottom + 8}
        gap="$2"
      >
        <YStack flex={1}>
          <Text fontSize="$2" color="$color10">已选择</Text>
          <XStack alignItems="baseline" gap="$1">
            <Text fontSize="$6" fontWeight="bold" color="$primary">
              ¥{selectedPlan.price}
            </Text>
            <Text fontSize="$2" color="$color10">/天</Text>
          </XStack>
        </YStack>
        <Pressable style={{ flex: 2 }} onPress={handleBuyNow}>
          <View
            backgroundColor="$primary"
            paddingVertical="$3"
            borderRadius="$10"
            alignItems="center"
          >
            <XStack gap="$2" alignItems="center">
              <ShoppingCart size={20} color="white" />
              <Text color="white" fontSize="$4" fontWeight="600">
                立即购买
              </Text>
            </XStack>
          </View>
        </Pressable>
      </XStack>
    </YStack>
  );
};

export default NutritionServiceScreen;
