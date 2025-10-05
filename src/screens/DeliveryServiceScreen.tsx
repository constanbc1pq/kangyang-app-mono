import React, { useState, useEffect, useRef } from 'react';
import {
  Pressable,
  TouchableOpacity,
  ScrollView as RNScrollView,
  Image,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, H3, Sheet } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Search,
  MapPin,
  ChevronRight,
  Mic,
  ShoppingCart,
  Plus,
  Minus,
  SlidersHorizontal,
  Clock,
  Flame,
  X,
  Navigation,
  Trash2,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { groceryCartService } from '@/services/groceryCartService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Banner数据
const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    title: '新鲜蔬菜每日直送',
    subtitle: '产地直采 当日送达',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    title: '食疗养生专区',
    subtitle: '中医配方 科学养生',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800',
    title: '海鲜水产特惠',
    subtitle: '活鲜直达 品质保证',
  },
];

// 分类数据
const categories = [
  { id: 'all', name: '全部', icon: '🏪' },
  { id: 'vegetables', name: '蔬菜', icon: '🥬' },
  { id: 'fruits', name: '水果', icon: '🍎' },
  { id: 'meat', name: '肉禽蛋', icon: '🥩' },
  { id: 'seafood', name: '海鲜', icon: '🦐' },
  { id: 'grain', name: '粮油', icon: '🌾' },
  { id: 'therapy', name: '食疗', icon: '🍵' },
  { id: 'dairy', name: '乳品', icon: '🥛' },
];

// 限时秒杀商品
const flashSaleProducts = [
  {
    id: 101,
    name: '有机西兰花',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    price: 9.9,
    originalPrice: 15.9,
    unit: '500g',
    tag: '限时',
    stock: 23,
  },
  {
    id: 102,
    name: '野生三文鱼',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    price: 39.9,
    originalPrice: 59.9,
    unit: '300g',
    tag: '限时',
    stock: 15,
  },
  {
    id: 103,
    name: '有机蓝莓',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400',
    price: 19.9,
    originalPrice: 29.9,
    unit: '125g',
    tag: '限时',
    stock: 31,
  },
];

// 商品数据
const products = [
  // 蔬菜类 (5个)
  {
    id: 1,
    name: '有机西兰花',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    price: 12.9,
    originalPrice: 15.9,
    unit: '500g',
    tag: '新鲜',
    category: 'vegetables',
    sales: 1234,
  },
  {
    id: 8,
    name: '有机菠菜',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    price: 8.9,
    unit: '300g',
    tag: '新鲜',
    category: 'vegetables',
    sales: 2134,
  },
  {
    id: 9,
    name: '有机胡萝卜',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    price: 7.9,
    unit: '500g',
    tag: '新鲜',
    category: 'vegetables',
    sales: 1876,
  },
  {
    id: 10,
    name: '新鲜西红柿',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
    price: 9.9,
    unit: '500g',
    tag: '新鲜',
    category: 'vegetables',
    sales: 2456,
  },
  {
    id: 11,
    name: '有机黄瓜',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400',
    price: 6.9,
    unit: '500g',
    tag: '新鲜',
    category: 'vegetables',
    sales: 1987,
  },

  // 水果类 (5个)
  {
    id: 6,
    name: '有机蓝莓',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400',
    price: 25.9,
    unit: '125g',
    tag: '推荐',
    category: 'fruits',
    sales: 1567,
  },
  {
    id: 12,
    name: '新鲜草莓',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    price: 28.9,
    unit: '250g',
    tag: '新鲜',
    category: 'fruits',
    sales: 2345,
  },
  {
    id: 13,
    name: '进口奇异果',
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400',
    price: 32.9,
    unit: '6个装',
    tag: '进口',
    category: 'fruits',
    sales: 1234,
  },
  {
    id: 14,
    name: '优质苹果',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    price: 18.9,
    unit: '1kg',
    tag: '推荐',
    category: 'fruits',
    sales: 3456,
  },
  {
    id: 15,
    name: '新鲜香蕉',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
    price: 12.9,
    unit: '500g',
    tag: '新鲜',
    category: 'fruits',
    sales: 2876,
  },

  // 肉禽蛋类 (5个)
  {
    id: 5,
    name: '有机鸡蛋',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    price: 22.9,
    unit: '10枚',
    tag: '新鲜',
    category: 'meat',
    sales: 3456,
  },
  {
    id: 16,
    name: '精选鸡胸肉',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    price: 35.9,
    unit: '500g',
    tag: '新鲜',
    category: 'meat',
    sales: 1987,
  },
  {
    id: 17,
    name: '优质猪里脊',
    image: 'https://images.unsplash.com/photo-1607623488027-f6876899e3e5?w=400',
    price: 42.9,
    unit: '500g',
    tag: '新鲜',
    category: 'meat',
    sales: 1654,
  },
  {
    id: 18,
    name: '土鸭蛋',
    image: 'https://images.unsplash.com/photo-1587486937987-cc237a792d13?w=400',
    price: 28.9,
    unit: '8枚',
    tag: '推荐',
    category: 'meat',
    sales: 1234,
  },
  {
    id: 19,
    name: '精选牛肉',
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400',
    price: 68.9,
    unit: '500g',
    tag: '优质',
    category: 'meat',
    sales: 987,
  },

  // 海鲜类 (5个)
  {
    id: 3,
    name: '野生三文鱼',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    price: 45.9,
    unit: '300g',
    tag: '推荐',
    category: 'seafood',
    sales: 2341,
  },
  {
    id: 20,
    name: '鲜活基围虾',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400',
    price: 58.9,
    unit: '500g',
    tag: '新鲜',
    category: 'seafood',
    sales: 1876,
  },
  {
    id: 21,
    name: '深海鲈鱼',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400',
    price: 38.9,
    unit: '1条',
    tag: '新鲜',
    category: 'seafood',
    sales: 1543,
  },
  {
    id: 22,
    name: '优质扇贝',
    image: 'https://images.unsplash.com/photo-1559548331-f9cb98001426?w=400',
    price: 48.9,
    unit: '500g',
    tag: '推荐',
    category: 'seafood',
    sales: 1234,
  },
  {
    id: 23,
    name: '鲜活螃蟹',
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400',
    price: 88.9,
    unit: '500g',
    tag: '时令',
    category: 'seafood',
    sales: 876,
  },

  // 粮油类 (5个)
  {
    id: 24,
    name: '东北大米',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    price: 45.9,
    unit: '5kg',
    tag: '优质',
    category: 'grain',
    sales: 2345,
  },
  {
    id: 25,
    name: '五常稻花香',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
    price: 68.9,
    unit: '5kg',
    tag: '推荐',
    category: 'grain',
    sales: 1876,
  },
  {
    id: 26,
    name: '有机面粉',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400',
    price: 28.9,
    unit: '2kg',
    tag: '有机',
    category: 'grain',
    sales: 1543,
  },
  {
    id: 27,
    name: '特级橄榄油',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    price: 88.9,
    unit: '500ml',
    tag: '进口',
    category: 'grain',
    sales: 987,
  },
  {
    id: 28,
    name: '有机杂粮',
    image: 'https://images.unsplash.com/photo-1599909533704-d3e1564a4b8f?w=400',
    price: 38.9,
    unit: '1kg',
    tag: '健康',
    category: 'grain',
    sales: 1234,
  },

  // 食疗类 (5个)
  {
    id: 2,
    name: '枸杞养生茶',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    price: 28.8,
    unit: '200g',
    tag: '食疗',
    category: 'therapy',
    sales: 856,
  },
  {
    id: 4,
    name: '山药薏米粥',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    price: 18.8,
    unit: '500g',
    tag: '食疗',
    category: 'therapy',
    sales: 678,
  },
  {
    id: 7,
    name: '黑芝麻核桃粉',
    image: 'https://images.unsplash.com/photo-1587411768938-f891574e6533?w=400',
    price: 35.8,
    unit: '500g',
    tag: '食疗',
    category: 'therapy',
    sales: 923,
  },
  {
    id: 29,
    name: '红枣桂圆茶',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    price: 32.9,
    unit: '300g',
    tag: '补血',
    category: 'therapy',
    sales: 1456,
  },
  {
    id: 30,
    name: '银耳莲子羹',
    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400',
    price: 26.9,
    unit: '400g',
    tag: '养颜',
    category: 'therapy',
    sales: 1234,
  },

  // 乳品类 (5个)
  {
    id: 31,
    name: '有机纯牛奶',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    price: 48.9,
    unit: '1L×6盒',
    tag: '有机',
    category: 'dairy',
    sales: 2876,
  },
  {
    id: 32,
    name: '希腊酸奶',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    price: 18.9,
    unit: '200g×4杯',
    tag: '进口',
    category: 'dairy',
    sales: 2345,
  },
  {
    id: 33,
    name: '新鲜酸奶',
    image: 'https://images.unsplash.com/photo-1571212059005-cd3e1fc1ee30?w=400',
    price: 12.9,
    unit: '180ml×6瓶',
    tag: '新鲜',
    category: 'dairy',
    sales: 3456,
  },
  {
    id: 34,
    name: '奶酪片',
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400',
    price: 28.9,
    unit: '200g',
    tag: '优质',
    category: 'dairy',
    sales: 1234,
  },
  {
    id: 35,
    name: '豆奶饮品',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    price: 15.9,
    unit: '250ml×6盒',
    tag: '健康',
    category: 'dairy',
    sales: 1987,
  },
];

export const DeliveryServiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const bannerScrollRef = useRef<RNScrollView>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('comprehensive');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('深圳');
  const [showCartSheet, setShowCartSheet] = useState(false);

  // 热门城市/配送区域列表（深圳各区）
  const hotCities = [
    { id: '1', name: '福田区', available: true },
    { id: '2', name: '罗湖区', available: true },
    { id: '3', name: '南山区', available: true },
    { id: '4', name: '宝安区', available: true },
    { id: '5', name: '龙岗区', available: true },
    { id: '6', name: '龙华区', available: true },
    { id: '7', name: '坪山区', available: true },
    { id: '8', name: '盐田区', available: true },
    { id: '9', name: '光明区', available: true },
    { id: '10', name: '大鹏新区', available: true },
    { id: '11', name: '深圳', available: true },
    { id: '12', name: '前海', available: true },
  ];

  const handleAutoLocate = () => {
    // 模拟自动定位
    setSelectedCity('福田区');
    setShowCityModal(false);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowCityModal(false);
  };

  // 从存储加载购物车数据
  const loadCartFromStorage = async () => {
    try {
      const savedCart = await groceryCartService.getCart();
      setCart(savedCart);
    } catch (error) {
      console.error('加载购物车失败:', error);
    }
  };

  // 屏幕获得焦点时重新加载购物车（从商品详情页返回后）
  useFocusEffect(
    React.useCallback(() => {
      loadCartFromStorage();
    }, [])
  );

  // 自动轮播Banner
  useEffect(() => {
    const timer = setInterval(() => {
      const nextBanner = (currentBanner + 1) % banners.length;
      setCurrentBanner(nextBanner);
      bannerScrollRef.current?.scrollTo({
        x: nextBanner * SCREEN_WIDTH,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [currentBanner]);

  // 筛选商品
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 排序商品
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'sales') return b.sales - a.sales;
    return 0;
  });

  // 分组商品（全部分类时按分类分组）
  const groupedProducts =
    selectedCategory === 'all'
      ? categories
          .slice(1)
          .map((cat) => ({
            category: cat,
            items: sortedProducts.filter((p) => p.category === cat.id).slice(0, 4),
          }))
          .filter((group) => group.items.length > 0)
      : [
          {
            category: categories.find((c) => c.id === selectedCategory)!,
            items: sortedProducts,
          },
        ];

  // 购物车操作
  const addToCart = async (productId: number) => {
    try {
      const updatedCart = await groceryCartService.addToCart(productId, 1);
      setCart(updatedCart);
    } catch (error) {
      console.error('添加到购物车失败:', error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const updatedCart = await groceryCartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('从购物车移除失败:', error);
    }
  };

  // 购物车统计
  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const product = [...products, ...flashSaleProducts].find((p) => p.id === Number(id));
    return sum + (product?.price || 0) * count;
  }, 0);

  const handleCheckout = () => {
    if (totalItems === 0) return;

    // 构造购物车商品列表
    const cartItems = Object.entries(cart).map(([id, count]) => {
      const product = [...products, ...flashSaleProducts].find((p) => p.id === Number(id));
      return {
        id: Number(id),
        name: product?.name || '',
        price: product?.price || 0,
        unit: product?.unit || '',
        image: product?.image || '',
        quantity: count,
      };
    });

    // 跳转到生鲜商品结算页面
    navigation.navigate('GroceryCheckout', {
      items: cartItems,
      totalAmount: totalPrice,
      deliveryArea: selectedCity,
    });
  };

  const handleProductClick = (productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const clearCart = async () => {
    try {
      await groceryCartService.clearCart();
      setCart({});
      setShowCartSheet(false);
    } catch (error) {
      console.error('清空购物车失败:', error);
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
        {/* Header */}
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="white"
          space="$3"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </Pressable>

          {/* Address */}
          <Pressable onPress={() => setShowCityModal(true)}>
            <XStack alignItems="center" space="$1">
              <MapPin size={16} color={COLORS.primary} />
              <Text fontSize="$3" fontWeight="600">
                {selectedCity}
              </Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </XStack>
          </Pressable>

          {/* Search */}
          <XStack
            flex={1}
            backgroundColor="$background"
            borderRadius="$3"
            paddingHorizontal="$3"
            paddingVertical="$2"
            alignItems="center"
            space="$2"
          >
            <Search size={16} color={COLORS.textSecondary} />
            <TextInput
              placeholder="搜索商品"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: 14,
                padding: 0,
                color: COLORS.text,
              }}
              placeholderTextColor={COLORS.textSecondary}
            />
            <TouchableOpacity>
              <Mic size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </XStack>
        </XStack>

        <RNScrollView showsVerticalScrollIndicator={false}>
          {/* Banner Carousel */}
          <View height={160}>
            <RNScrollView
              ref={bannerScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentBanner(index);
              }}
            >
              {banners.map((banner) => (
                <View key={banner.id} width={SCREEN_WIDTH}>
                  <Image
                    source={{ uri: banner.image }}
                    style={{ width: SCREEN_WIDTH, height: 160 }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 80,
                      justifyContent: 'flex-end',
                      padding: 16,
                    }}
                  >
                    <Text fontSize="$6" fontWeight="bold" color="white">
                      {banner.title}
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)" marginTop="$1">
                      {banner.subtitle}
                    </Text>
                  </LinearGradient>
                </View>
              ))}
            </RNScrollView>

            {/* Indicators */}
            <XStack
              position="absolute"
              bottom={8}
              alignSelf="center"
              space="$1"
            >
              {banners.map((_, index) => (
                <View
                  key={index}
                  width={index === currentBanner ? 16 : 4}
                  height={4}
                  borderRadius={2}
                  backgroundColor={index === currentBanner ? 'white' : 'rgba(255,255,255,0.5)'}
                />
              ))}
            </XStack>
          </View>

          {/* Categories */}
          <RNScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 16 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
              >
                <YStack alignItems="center" space="$2">
                  <View
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor={
                      selectedCategory === category.id ? `${COLORS.primary}20` : '$background'
                    }
                    borderWidth={selectedCategory === category.id ? 2 : 0}
                    borderColor={COLORS.primary}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={28}>{category.icon}</Text>
                  </View>
                  <Text
                    fontSize="$2"
                    fontWeight={selectedCategory === category.id ? '600' : 'normal'}
                    color={selectedCategory === category.id ? COLORS.primary : COLORS.text}
                  >
                    {category.name}
                  </Text>
                </YStack>
              </TouchableOpacity>
            ))}
          </RNScrollView>

          {/* Filter Bar */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Text fontSize="$3" color="$textSecondary">
              共 {filteredProducts.length} 件商品
            </Text>
            <TouchableOpacity onPress={() => setShowSortSheet(true)}>
              <XStack
                alignItems="center"
                space="$2"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
              >
                <SlidersHorizontal size={16} color={COLORS.text} />
                <Text fontSize="$3">排序</Text>
              </XStack>
            </TouchableOpacity>
          </XStack>

          {/* Flash Sale Section */}
          <LinearGradient
            colors={['#FEF2F2', '#FFEDD5']}
            style={{ padding: 16 }}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <XStack space="$2" alignItems="center">
                <Flame size={20} color="#EF4444" />
                <H3 fontSize="$6" fontWeight="bold">
                  限时秒杀
                </H3>
                <XStack space="$1" alignItems="center">
                  <Clock size={16} color="#EF4444" />
                  <Text fontSize="$3" color="#EF4444" fontFamily="$mono">
                    02:34:56
                  </Text>
                </XStack>
              </XStack>
              <TouchableOpacity>
                <XStack alignItems="center" space="$1">
                  <Text fontSize="$3" color="#EF4444">
                    更多
                  </Text>
                  <ChevronRight size={16} color="#EF4444" />
                </XStack>
              </TouchableOpacity>
            </XStack>

            <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {flashSaleProducts.map((product) => (
                <Card
                  key={product.id}
                  width={128}
                  padding="$3"
                  borderRadius="$4"
                  backgroundColor="white"
                  borderWidth={2}
                  borderColor="#FCA5A5"
                >
                  <View marginBottom="$2">
                    <Image
                      source={{ uri: product.image }}
                      style={{ width: '100%', height: 96, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                    <View
                      position="absolute"
                      top={4}
                      left={4}
                      backgroundColor="#EF4444"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$1" color="white" fontWeight="600">
                        {product.tag}
                      </Text>
                    </View>
                  </View>
                  <Text fontSize="$3" fontWeight="600" numberOfLines={1} marginBottom="$1">
                    {product.name}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                    {product.unit}
                  </Text>
                  <XStack alignItems="baseline" space="$1" marginBottom="$2">
                    <Text fontSize="$5" fontWeight="bold" color="#EF4444">
                      ¥{product.price}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary" textDecorationLine="line-through">
                      ¥{product.originalPrice}
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                    仅剩 {product.stock} 件
                  </Text>
                  {cart[product.id] ? (
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      backgroundColor={`${COLORS.primary}10`}
                      borderRadius={16}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                    >
                      <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                        <View width={24} height={24} justifyContent="center" alignItems="center">
                          <Minus size={12} color={COLORS.primary} />
                        </View>
                      </TouchableOpacity>
                      <Text fontSize="$3" fontWeight="600">
                        {cart[product.id]}
                      </Text>
                      <TouchableOpacity onPress={() => addToCart(product.id)}>
                        <View width={24} height={24} justifyContent="center" alignItems="center">
                          <Plus size={12} color={COLORS.primary} />
                        </View>
                      </TouchableOpacity>
                    </XStack>
                  ) : (
                    <TouchableOpacity onPress={() => addToCart(product.id)}>
                      <View
                        backgroundColor="#EF4444"
                        paddingVertical="$2"
                        borderRadius="$3"
                        alignItems="center"
                      >
                        <Text fontSize="$2" color="white" fontWeight="600">
                          抢购
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </Card>
              ))}
            </RNScrollView>
          </LinearGradient>

          {/* Products Grid */}
          <YStack padding="$4" space="$5" paddingBottom={totalItems > 0 ? 100 : 20}>
            {groupedProducts.map((group) => (
              <YStack key={group.category.id} space="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack space="$2" alignItems="center">
                    <Text fontSize={24}>{group.category.icon}</Text>
                    <H3 fontSize="$6" fontWeight="bold">
                      {group.category.name}
                    </H3>
                  </XStack>
                  {selectedCategory === 'all' && (
                    <TouchableOpacity onPress={() => setSelectedCategory(group.category.id)}>
                      <XStack alignItems="center" space="$1">
                        <Text fontSize="$3" color="$textSecondary">
                          更多
                        </Text>
                        <ChevronRight size={16} color={COLORS.textSecondary} />
                      </XStack>
                    </TouchableOpacity>
                  )}
                </XStack>

                <XStack flexWrap="wrap" gap="$3">
                  {group.items.map((product) => (
                    <Card
                      key={product.id}
                      width="48%"
                      padding="$3"
                      borderRadius="$4"
                      backgroundColor="$surface"
                    >
                      <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                        <View marginBottom="$2">
                          <Image
                            source={{ uri: product.image }}
                            style={{ width: '100%', height: 128, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                          <View
                            position="absolute"
                            top={8}
                            left={8}
                            backgroundColor={COLORS.primary}
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" color="white" fontWeight="600">
                              {product.tag}
                            </Text>
                          </View>
                        </View>
                        <Text
                          fontSize="$4"
                          fontWeight="600"
                          numberOfLines={2}
                          marginBottom="$1"
                          minHeight={44}
                        >
                          {product.name}
                        </Text>
                      </TouchableOpacity>
                      <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                        {product.unit}
                      </Text>
                      <XStack alignItems="baseline" space="$1" marginBottom="$2">
                        <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                          ¥{product.price}
                        </Text>
                        {product.originalPrice && (
                          <Text fontSize="$2" color="$textSecondary" textDecorationLine="line-through">
                            ¥{product.originalPrice}
                          </Text>
                        )}
                      </XStack>
                      <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                        已售 {product.sales}
                      </Text>
                      {cart[product.id] ? (
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                          backgroundColor={`${COLORS.primary}10`}
                          borderRadius={20}
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                        >
                          <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                            <View width={28} height={28} justifyContent="center" alignItems="center">
                              <Minus size={16} color={COLORS.primary} />
                            </View>
                          </TouchableOpacity>
                          <Text fontSize="$4" fontWeight="600">
                            {cart[product.id]}
                          </Text>
                          <TouchableOpacity onPress={() => addToCart(product.id)}>
                            <View width={28} height={28} justifyContent="center" alignItems="center">
                              <Plus size={16} color={COLORS.primary} />
                            </View>
                          </TouchableOpacity>
                        </XStack>
                      ) : (
                        <TouchableOpacity onPress={() => addToCart(product.id)}>
                          <View
                            backgroundColor={COLORS.primary}
                            paddingVertical="$2"
                            borderRadius="$3"
                            alignItems="center"
                          >
                            <XStack space="$1" alignItems="center">
                              <Plus size={16} color="white" />
                              <Text fontSize="$3" color="white" fontWeight="600">
                                加入购物车
                              </Text>
                            </XStack>
                          </View>
                        </TouchableOpacity>
                      )}
                    </Card>
                  ))}
                </XStack>
              </YStack>
            ))}
          </YStack>
        </RNScrollView>

        {/* Floating Cart */}
        {totalItems > 0 && (
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="white"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            padding="$4"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$3" alignItems="center">
                <TouchableOpacity onPress={() => setShowCartSheet(true)}>
                  <View>
                    <ShoppingCart size={24} color={COLORS.primary} />
                    <View
                      position="absolute"
                      top={-8}
                      right={-8}
                      backgroundColor={COLORS.error}
                      width={20}
                      height={20}
                      borderRadius={10}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$1" color="white" fontWeight="bold">
                        {totalItems}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <YStack>
                  <Text fontSize="$2" color="$textSecondary">
                    总计
                  </Text>
                  <Text fontSize="$7" fontWeight="bold" color={COLORS.primary}>
                    ¥{totalPrice.toFixed(2)}
                  </Text>
                </YStack>
              </XStack>
              <TouchableOpacity onPress={handleCheckout}>
                <View
                  backgroundColor={COLORS.primary}
                  paddingHorizontal="$6"
                  paddingVertical="$3"
                  borderRadius="$4"
                >
                  <Text fontSize="$5" color="white" fontWeight="bold">
                    去结算
                  </Text>
                </View>
              </TouchableOpacity>
            </XStack>
          </View>
        )}

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
                {/* Header */}
                <XStack justifyContent="space-between" alignItems="center" padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
                  <H3 fontSize="$6" fontWeight="bold">
                    选择配送区域
                  </H3>
                  <TouchableOpacity onPress={() => setShowCityModal(false)}>
                    <X size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </XStack>

                {/* Auto Locate Button */}
                <View padding="$4">
                  <TouchableOpacity onPress={handleAutoLocate}>
                    <View
                      backgroundColor={COLORS.primary}
                      borderRadius="$3"
                      padding="$3"
                    >
                      <XStack space="$2" alignItems="center" justifyContent="center">
                        <Navigation size={20} color="white" />
                        <Text fontSize="$4" color="white" fontWeight="600">
                          自动定位当前区域
                        </Text>
                      </XStack>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Hot Cities */}
                <YStack padding="$4" paddingTop="$2">
                  <Text fontSize="$4" color="$textSecondary" marginBottom="$3" fontWeight="600">
                    配送区域
                  </Text>
                  <XStack flexWrap="wrap" gap="$3">
                    {hotCities.map((city) => (
                      <TouchableOpacity
                        key={city.id}
                        onPress={() => handleCitySelect(city.name)}
                        style={{ width: '30%' }}
                      >
                        <View
                          padding="$3"
                          borderRadius="$3"
                          backgroundColor={selectedCity === city.name ? COLORS.primary : '$surface'}
                          borderWidth={1}
                          borderColor={selectedCity === city.name ? COLORS.primary : '$borderColor'}
                          alignItems="center"
                        >
                          <Text
                            fontSize="$4"
                            color={selectedCity === city.name ? 'white' : '$text'}
                            fontWeight={selectedCity === city.name ? '600' : 'normal'}
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

        {/* Cart Sheet */}
        <Sheet
          modal
          open={showCartSheet}
          onOpenChange={setShowCartSheet}
          snapPoints={[75]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay />
          <Sheet.Frame backgroundColor="white" borderTopLeftRadius="$6" borderTopRightRadius="$6">
            <Sheet.Handle />
            <YStack flex={1}>
              {/* Header */}
              <XStack justifyContent="space-between" alignItems="center" padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
                <H3 fontSize="$6" fontWeight="bold">
                  购物车 ({totalItems})
                </H3>
                {totalItems > 0 && (
                  <TouchableOpacity onPress={clearCart}>
                    <XStack space="$2" alignItems="center">
                      <Trash2 size={16} color={COLORS.error} />
                      <Text fontSize="$3" color={COLORS.error}>
                        清空
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                )}
              </XStack>

              {/* Cart Items */}
              <RNScrollView style={{ flex: 1 }}>
                {totalItems === 0 ? (
                  <YStack padding="$6" alignItems="center" space="$3">
                    <ShoppingCart size={64} color={COLORS.textSecondary} />
                    <Text fontSize="$5" color="$textSecondary">
                      购物车是空的
                    </Text>
                    <Text fontSize="$3" color="$textSecondary">
                      快去选购新鲜好物吧
                    </Text>
                  </YStack>
                ) : (
                  <YStack padding="$4" space="$3">
                    {Object.entries(cart).map(([id, count]) => {
                      const product = [...products, ...flashSaleProducts].find((p) => p.id === Number(id));
                      if (!product) return null;

                      return (
                        <Card key={id} padding="$3" backgroundColor="$background" borderRadius="$4">
                          <XStack space="$3">
                            <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                              <Image
                                source={{ uri: product.image }}
                                style={{ width: 80, height: 80, borderRadius: 8 }}
                              />
                            </TouchableOpacity>
                            <YStack flex={1} justifyContent="space-between">
                              <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                                <Text fontSize="$4" fontWeight="600" numberOfLines={2}>
                                  {product.name}
                                </Text>
                              </TouchableOpacity>
                              <Text fontSize="$3" color="$textSecondary">
                                {product.unit}
                              </Text>
                              <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$6" fontWeight="bold" color={COLORS.error}>
                                  ¥{product.price}
                                </Text>
                                <XStack
                                  space="$2"
                                  alignItems="center"
                                  backgroundColor={`${COLORS.primary}10`}
                                  borderRadius={16}
                                  paddingHorizontal="$2"
                                  paddingVertical="$1"
                                >
                                  <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                                    <View width={24} height={24} justifyContent="center" alignItems="center">
                                      <Minus size={14} color={COLORS.primary} />
                                    </View>
                                  </TouchableOpacity>
                                  <Text fontSize="$4" fontWeight="600" minWidth={30} textAlign="center">
                                    {count}
                                  </Text>
                                  <TouchableOpacity onPress={() => addToCart(product.id)}>
                                    <View width={24} height={24} justifyContent="center" alignItems="center">
                                      <Plus size={14} color={COLORS.primary} />
                                    </View>
                                  </TouchableOpacity>
                                </XStack>
                              </XStack>
                            </YStack>
                          </XStack>
                        </Card>
                      );
                    })}
                  </YStack>
                )}
              </RNScrollView>

              {/* Bottom Action */}
              {totalItems > 0 && (
                <View padding="$4" borderTopWidth={1} borderTopColor="$borderColor">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$5" fontWeight="bold">
                      合计：
                    </Text>
                    <Text fontSize="$8" fontWeight="bold" color={COLORS.error}>
                      ¥{totalPrice.toFixed(2)}
                    </Text>
                  </XStack>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCartSheet(false);
                      handleCheckout();
                    }}
                  >
                    <View
                      backgroundColor={COLORS.primary}
                      paddingVertical="$3"
                      borderRadius="$4"
                      alignItems="center"
                    >
                      <Text fontSize="$5" color="white" fontWeight="600">
                        去结算
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </YStack>
          </Sheet.Frame>
        </Sheet>

        {/* Sort Sheet */}
        <Sheet
          modal
          open={showSortSheet}
          onOpenChange={setShowSortSheet}
          snapPoints={[40]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay />
          <Sheet.Frame backgroundColor="white" borderTopLeftRadius="$6" borderTopRightRadius="$6">
            <Sheet.Handle />
            <YStack padding="$4" space="$3">
              <H3 fontSize="$6" fontWeight="bold">
                排序方式
              </H3>
              {[
                { value: 'comprehensive', label: '综合排序' },
                { value: 'sales', label: '销量优先' },
                { value: 'price-asc', label: '价格从低到高' },
                { value: 'price-desc', label: '价格从高到低' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSortBy(option.value);
                    setShowSortSheet(false);
                  }}
                >
                  <View
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor={sortBy === option.value ? COLORS.primary : 'transparent'}
                    borderWidth={1}
                    borderColor={sortBy === option.value ? COLORS.primary : '$borderColor'}
                  >
                    <Text
                      fontSize="$4"
                      fontWeight={sortBy === option.value ? '600' : 'normal'}
                      color={sortBy === option.value ? 'white' : COLORS.text}
                    >
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </SafeAreaView>
    </Theme>
  );
};
