/**
 * DeliveryServiceScreen 闪送到家页面
 * 生鲜商品列表、分类、搜索、秒杀、购物车功能
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Pressable,
  TouchableOpacity,
  ScrollView as RNScrollView,
  Image,
  TextInput,
  Dimensions,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  ChevronRight,
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
import { TitleBar } from '@/components/TitleBar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { groceryCartService } from '@/services/groceryCartService';
import { BottomSheet } from '@/components/BottomSheet';
import { flashSaleProducts as importedFlashSaleProducts, groceryProducts as importedGroceryProducts } from '@/data/groceryProducts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 分类本地图片
const CATEGORY_IMAGES = {
  rouqindan: require('../../assets/images/product/rouqindan.jpg'),
};

// Banner本地图片
const BANNER_IMAGES = {
  xinxianshucai: require('../../assets/images/product/xinxian-shucai-banner.jpeg'),
  shiliaoyangsheng: require('../../assets/images/product/shiliao-yangsheng-banner.jpg'),
  haixiantehui: require('../../assets/images/product/haixian-tehui-banner.jpg'),
};

// Banner数据
const banners = [
  {
    id: 1,
    image: BANNER_IMAGES.xinxianshucai,
    title: '新鲜蔬菜每日直送',
    subtitle: '产地直采 当日送达',
  },
  {
    id: 2,
    image: BANNER_IMAGES.shiliaoyangsheng,
    title: '食疗养生专区',
    subtitle: '中医配方 科学养生',
  },
  {
    id: 3,
    image: BANNER_IMAGES.haixiantehui,
    title: '海鲜水产特惠',
    subtitle: '活鲜直达 品质保证',
  },
];

// 分类数据 - 使用真实图片
const categories = [
  { id: 'all', name: '全部', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100' },
  { id: 'vegetables', name: '蔬菜', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100' },
  { id: 'fruits', name: '水果', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=100' },
  { id: 'meat', name: '肉禽蛋', image: CATEGORY_IMAGES.rouqindan },
  { id: 'seafood', name: '海鲜', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100' },
  { id: 'grain', name: '粮油', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
  { id: 'therapy', name: '食疗', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=100' },
  { id: 'dairy', name: '乳品', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100' },
];

// 使用导入的限时秒杀商品
const flashSaleProducts = importedFlashSaleProducts;

// 使用导入的商品数据
const products = importedGroceryProducts;

export const DeliveryServiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const bannerScrollRef = useRef<RNScrollView>(null);

  // 计算商品卡片宽度：容器padding 16*2 + gap 8 = 40，每行2个
  const productCardWidth = (windowWidth - 40) / 2;

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
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="闪送到家"
          renderRight={() => (
            <Pressable onPress={() => setShowCityModal(true)}>
              <XStack alignItems="center" gap="$1">
                <MapPin size={16} color={primaryColor} />
                <Text fontSize="$3" fontWeight="500" color="$color12" numberOfLines={1} maxWidth={80}>
                  {selectedCity}
                </Text>
                <ChevronRight size={14} color={color10} />
              </XStack>
            </Pressable>
          )}
        />
      </View>

      <RNScrollView showsVerticalScrollIndicator={false}>
        {/* 搜索栏 - 独立于TitleBar */}
        <View padding="$2.5" backgroundColor="$color2">
          <XStack
            backgroundColor="$color4"
            borderRadius="$3"
            paddingHorizontal="$3"
            paddingVertical="$2"
            alignItems="center"
            gap="$2"
          >
            <Search size={18} color={color10} />
            <TextInput
              placeholder="搜索新鲜好物..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: 14,
                padding: 0,
                color: theme.color12?.val,
              }}
              placeholderTextColor={color10}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={16} color={color10} />
              </Pressable>
            )}
          </XStack>
        </View>

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
                    source={typeof banner.image === 'string' ? { uri: banner.image } : banner.image}
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

        {/* Categories - 使用真实图片 */}
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
              >
                <YStack alignItems="center" gap="$1.5">
                  <View
                    width={60}
                    height={60}
                    borderRadius={30}
                    borderWidth={2}
                    borderColor={isSelected ? '$primary' : '$color5'}
                    overflow="hidden"
                  >
                    <Image
                      source={typeof category.image === 'string' ? { uri: category.image } : category.image}
                      style={{ width: 60, height: 60 }}
                      resizeMode="cover"
                    />
                  </View>
                  <Text
                    fontSize="$2"
                    fontWeight={isSelected ? '600' : '400'}
                    color={isSelected ? '$primary' : '$color12'}
                  >
                    {category.name}
                  </Text>
                </YStack>
              </TouchableOpacity>
            );
          })}
        </RNScrollView>

          {/* Flash Sale Section */}
          <View backgroundColor="$color4" padding="$2">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <XStack gap="$2" alignItems="center">
                <Flame size={20} color={primaryColor} />
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  限时秒杀
                </Text>
                <XStack gap="$1" alignItems="center">
                  <Clock size={16} color={primaryColor} />
                  <Text fontSize="$3" color="$primary" fontFamily="$mono">
                    02:34:56
                  </Text>
                </XStack>
              </XStack>
              <TouchableOpacity>
                <XStack alignItems="center" gap="$0.5">
                  <Text fontSize="$3" color="$primary" fontWeight="500">
                    更多
                  </Text>
                  <ChevronRight size={14} color={primaryColor} />
                </XStack>
              </TouchableOpacity>
            </XStack>

            <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {flashSaleProducts.map((product) => (
                <View
                  key={product.id}
                  width={128}
                  padding="$2"
                  borderRadius="$4"
                  backgroundColor="$color2"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <View marginBottom="$2">
                    <Image
                      source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                      style={{ width: '100%', height: 96, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                    <View
                      position="absolute"
                      top={4}
                      left={4}
                      backgroundColor="$warning"
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize={10} color="white" fontWeight="600">
                        {product.tag}
                      </Text>
                    </View>
                  </View>
                  <Text fontSize="$3" fontWeight="600" color="$color12" numberOfLines={1} marginBottom="$1">
                    {product.name}
                  </Text>
                  <Text fontSize="$2" color="$color10" marginBottom="$2">
                    {product.unit}
                  </Text>
                  <XStack alignItems="baseline" gap="$1" marginBottom="$2">
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      ¥{product.price}
                    </Text>
                    <Text fontSize="$2" color="$color10" textDecorationLine="line-through">
                      ¥{product.originalPrice}
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$color10" marginBottom="$2">
                    仅剩 {product.stock} 件
                  </Text>
                  {cart[product.id] ? (
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ backgroundColor: `${primaryColor}10` }}
                      borderRadius="$10"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                    >
                      <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                        <View width={24} height={24} justifyContent="center" alignItems="center">
                          <Minus size={12} color={primaryColor} />
                        </View>
                      </TouchableOpacity>
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {cart[product.id]}
                      </Text>
                      <TouchableOpacity onPress={() => addToCart(product.id)}>
                        <View width={24} height={24} justifyContent="center" alignItems="center">
                          <Plus size={12} color={primaryColor} />
                        </View>
                      </TouchableOpacity>
                    </XStack>
                  ) : (
                    <TouchableOpacity onPress={() => addToCart(product.id)}>
                      <View
                        backgroundColor="$primary"
                        paddingVertical="$2"
                        borderRadius="$10"
                        alignItems="center"
                      >
                        <Text fontSize="$2" color="white" fontWeight="600">
                          抢购
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </RNScrollView>
          </View>

          {/* Filter Bar - moved below Flash Sale */}
          <XStack
            justifyContent="flex-end"
            alignItems="center"
            paddingHorizontal="$2.5"
            paddingVertical="$2"
            borderBottomWidth={1}
            borderBottomColor="$color5"
          >
            <TouchableOpacity onPress={() => setShowSortSheet(true)}>
              <XStack
                alignItems="center"
                gap="$2"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
              >
                <SlidersHorizontal size={16} color={theme.color12?.val} />
                <Text fontSize="$3" color="$color12">排序</Text>
              </XStack>
            </TouchableOpacity>
          </XStack>

        {/* Products Grid */}
        <YStack padding="$2.5" gap="$4" paddingBottom={totalItems > 0 ? 100 : 20}>
          {groupedProducts.map((group) => (
            <YStack key={group.category.id} gap="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <View width={28} height={28} borderRadius={14} overflow="hidden">
                    <Image
                      source={typeof group.category.image === 'string' ? { uri: group.category.image } : group.category.image}
                      style={{ width: 28, height: 28 }}
                      resizeMode="cover"
                    />
                  </View>
                  <Text fontSize="$5" fontWeight="600" color="$color12">
                    {group.category.name}
                  </Text>
                </XStack>
                {selectedCategory === 'all' && (
                  <TouchableOpacity onPress={() => setSelectedCategory(group.category.id)}>
                    <XStack alignItems="center" gap="$0.5">
                      <Text fontSize="$3" color="$primary" fontWeight="500">
                        更多
                      </Text>
                      <ChevronRight size={14} color={primaryColor} />
                    </XStack>
                  </TouchableOpacity>
                )}
              </XStack>

              <XStack flexWrap="wrap">
                {group.items.map((product) => (
                  <View
                    key={product.id}
                    width="50%"
                    padding="$1"
                  >
                    <View
                      backgroundColor="$color2"
                      borderRadius="$5"
                      borderWidth={1}
                      borderColor="$color5"
                      overflow="hidden"
                    >
                    <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                      <View>
                        <Image
                          source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                          style={{ width: '100%', height: 120 }}
                          resizeMode="cover"
                        />
                        <View
                          position="absolute"
                          top={8}
                          left={8}
                          backgroundColor="$primary"
                          paddingHorizontal="$1.5"
                          paddingVertical="$0.5"
                          borderRadius="$2"
                        >
                          <Text fontSize={10} color="white" fontWeight="600">
                            {product.tag}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <YStack padding="$2" gap="$1">
                      <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                        <Text
                          fontSize="$3"
                          fontWeight="600"
                          color="$color12"
                          numberOfLines={2}
                          minHeight={36}
                        >
                          {product.name}
                        </Text>
                      </TouchableOpacity>
                      <Text fontSize="$2" color="$color10">
                        {product.unit} · 已售{product.sales}
                      </Text>
                      <XStack alignItems="baseline" gap="$1">
                        <Text fontSize="$5" fontWeight="700" color="$primary">
                          ¥{product.price}
                        </Text>
                        {product.originalPrice && (
                          <Text fontSize="$1" color="$color10" textDecorationLine="line-through">
                            ¥{product.originalPrice}
                          </Text>
                        )}
                      </XStack>
                      {cart[product.id] ? (
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ backgroundColor: `${primaryColor}15` }}
                          borderRadius="$10"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                        >
                          <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                            <View width={26} height={26} justifyContent="center" alignItems="center">
                              <Minus size={14} color={primaryColor} />
                            </View>
                          </TouchableOpacity>
                          <Text fontSize="$3" fontWeight="600" color="$color12">
                            {cart[product.id]}
                          </Text>
                          <TouchableOpacity onPress={() => addToCart(product.id)}>
                            <View width={26} height={26} justifyContent="center" alignItems="center">
                              <Plus size={14} color={primaryColor} />
                            </View>
                          </TouchableOpacity>
                        </XStack>
                      ) : (
                        <TouchableOpacity onPress={() => addToCart(product.id)}>
                          <View
                            backgroundColor="$primary"
                            paddingVertical="$2"
                            borderRadius="$10"
                            alignItems="center"
                          >
                            <XStack gap="$1" alignItems="center">
                              <Plus size={14} color="white" />
                              <Text fontSize="$3" color="white" fontWeight="500">
                                加入购物车
                              </Text>
                            </XStack>
                          </View>
                        </TouchableOpacity>
                      )}
                    </YStack>
                    </View>
                  </View>
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
          backgroundColor="$color2"
          borderTopWidth={1}
          borderTopColor="$color5"
          paddingHorizontal="$2.5"
          paddingVertical="$2"
          paddingBottom={insets.bottom + 8}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$3" alignItems="center">
              <TouchableOpacity onPress={() => setShowCartSheet(true)}>
                <View>
                  <ShoppingCart size={24} color={primaryColor} />
                  <View
                    position="absolute"
                    top={-8}
                    right={-8}
                    backgroundColor="$error"
                    width={20}
                    height={20}
                    borderRadius={10}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={10} color="white" fontWeight="700">
                      {totalItems}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <YStack>
                <Text fontSize="$2" color="$color10">
                  总计
                </Text>
                <Text fontSize="$6" fontWeight="700" color="$primary">
                  ¥{totalPrice.toFixed(2)}
                </Text>
              </YStack>
            </XStack>
            <TouchableOpacity onPress={handleCheckout}>
              <View
                backgroundColor="$primary"
                paddingHorizontal="$5"
                paddingVertical="$2.5"
                borderRadius="$10"
              >
                <Text fontSize="$4" color="white" fontWeight="600">
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
              backgroundColor="$color2"
              borderTopLeftRadius="$5"
              borderTopRightRadius="$5"
              paddingBottom={insets.bottom + 16}
            >
              {/* Header */}
              <XStack justifyContent="space-between" alignItems="center" padding="$2.5" borderBottomWidth={1} borderBottomColor="$color5">
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  选择配送区域
                </Text>
                <TouchableOpacity onPress={() => setShowCityModal(false)}>
                  <X size={22} color={color10} />
                </TouchableOpacity>
              </XStack>

              {/* Auto Locate Button */}
              <View padding="$2.5">
                <TouchableOpacity onPress={handleAutoLocate}>
                  <View
                    backgroundColor="$primary"
                    borderRadius="$10"
                    padding="$2.5"
                  >
                    <XStack gap="$2" alignItems="center" justifyContent="center">
                      <Navigation size={18} color="white" />
                      <Text fontSize="$4" color="white" fontWeight="600">
                        自动定位当前区域
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Hot Cities */}
              <YStack padding="$2.5" paddingTop="$1">
                <Text fontSize="$3" color="$color10" marginBottom="$2" fontWeight="500">
                  配送区域
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {hotCities.map((city) => (
                    <TouchableOpacity
                      key={city.id}
                      onPress={() => handleCitySelect(city.name)}
                      style={{ width: '30%' }}
                    >
                      <View
                        padding="$2"
                        borderRadius="$3"
                        backgroundColor={selectedCity === city.name ? '$primary' : '$color4'}
                        alignItems="center"
                      >
                        <Text
                          fontSize="$3"
                          color={selectedCity === city.name ? 'white' : '$color12'}
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

      {/* Cart BottomSheet */}
      <BottomSheet
        visible={showCartSheet}
        onClose={() => setShowCartSheet(false)}
        title={`购物车 (${totalItems})`}
        maxHeight="75%"
        headerRight={
          totalItems > 0 ? (
            <TouchableOpacity onPress={clearCart}>
              <XStack gap="$1" alignItems="center">
                <Trash2 size={16} color={errorColor} />
                <Text fontSize="$3" color="$error">
                  清空
                </Text>
              </XStack>
            </TouchableOpacity>
          ) : undefined
        }
        footer={
          totalItems > 0 ? (
            <YStack gap="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  合计：
                </Text>
                <Text fontSize="$6" fontWeight="700" color="$primary">
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
                  backgroundColor="$primary"
                  paddingVertical="$2.5"
                  borderRadius="$10"
                  alignItems="center"
                >
                  <Text fontSize="$4" color="white" fontWeight="600">
                    去结算
                  </Text>
                </View>
              </TouchableOpacity>
            </YStack>
          ) : undefined
        }
      >
        {totalItems === 0 ? (
          <YStack padding="$6" alignItems="center" gap="$3">
            <ShoppingCart size={64} color={color10} />
            <Text fontSize="$5" color="$color10">
              购物车是空的
            </Text>
            <Text fontSize="$3" color="$color10">
              快去选购新鲜好物吧
            </Text>
          </YStack>
        ) : (
          <YStack gap="$2">
            {Object.entries(cart).map(([id, count]) => {
              const product = [...products, ...flashSaleProducts].find((p) => p.id === Number(id));
              if (!product) return null;

              return (
                <View key={id} padding="$2" backgroundColor="$color4" borderRadius="$4">
                  <XStack gap="$2">
                    <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                      <Image
                        source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                        style={{ width: 72, height: 72, borderRadius: 8 }}
                      />
                    </TouchableOpacity>
                    <YStack flex={1} justifyContent="space-between">
                      <TouchableOpacity onPress={() => handleProductClick(product.id)}>
                        <Text fontSize="$3" fontWeight="600" color="$color12" numberOfLines={2}>
                          {product.name}
                        </Text>
                      </TouchableOpacity>
                      <Text fontSize="$2" color="$color10">
                        {product.unit}
                      </Text>
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$5" fontWeight="700" color="$primary">
                          ¥{product.price}
                        </Text>
                        <XStack
                          gap="$1"
                          alignItems="center"
                          borderRadius="$10"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                            <View width={24} height={24} justifyContent="center" alignItems="center">
                              <Minus size={14} color={primaryColor} />
                            </View>
                          </TouchableOpacity>
                          <Text fontSize="$3" fontWeight="600" color="$color12" minWidth={24} textAlign="center">
                            {count}
                          </Text>
                          <TouchableOpacity onPress={() => addToCart(product.id)}>
                            <View width={24} height={24} justifyContent="center" alignItems="center">
                              <Plus size={14} color={primaryColor} />
                            </View>
                          </TouchableOpacity>
                        </XStack>
                      </XStack>
                    </YStack>
                  </XStack>
                </View>
              );
            })}
          </YStack>
        )}
      </BottomSheet>

      {/* Sort BottomSheet */}
      <BottomSheet
        visible={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        title="排序方式"
        variant="picker"
        maxHeight="40%"
      >
        <YStack gap="$2">
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
                padding="$2"
                borderRadius="$3"
                backgroundColor={sortBy === option.value ? '$primary' : '$color4'}
              >
                <Text
                  fontSize="$4"
                  fontWeight={sortBy === option.value ? '600' : '400'}
                  color={sortBy === option.value ? 'white' : '$color12'}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </YStack>
      </BottomSheet>
      </View>
  );
};
