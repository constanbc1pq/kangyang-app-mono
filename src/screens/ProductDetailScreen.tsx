/**
 * ProductDetailScreen 商品详情页面
 * 展示商品图片、价格、描述、评价、FAQ
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useRef } from 'react';
import {
  Pressable,
  TouchableOpacity,
  ScrollView as RNScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Package,
  Shield,
  Truck,
  RotateCcw,
  ThumbsUp,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { groceryCartService } from '@/services/groceryCartService';
import { getProductById } from '@/data/groceryProducts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductDetailScreenProps {
  route?: {
    params?: {
      productId?: number;
    };
  };
}

type TabType = 'detail' | 'reviews' | 'qa';

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const imageScrollRef = useRef<RNScrollView>(null);
  const productId = route?.params?.productId || 1;

  const primaryColor = theme.primary?.val;
  const errorColor = theme.error?.val;
  const goldColor = theme.gold?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 从数据文件获取商品信息
  const productData = getProductById(productId);

  // 如果商品不存在，使用默认商品
  const product = productData ? {
    ...productData,
    images: productData.images || [productData.image],
    stock: productData.stock || 100,
    rating: productData.rating || 4.5,
    tags: productData.tags || ['新鲜', '优质'],
    description: productData.description || `精选${productData.name}，新鲜优质，值得信赖。`,
    nutrition: productData.nutrition || [],
    features: [
      {
        icon: Package,
        title: '产地直采',
        desc: '精选产地 品质保证',
      },
      {
        icon: Shield,
        title: '品质保证',
        desc: '严格把关 安全放心',
      },
      {
        icon: Truck,
        title: '次日达',
        desc: '冷链配送 新鲜到家',
      },
      {
        icon: RotateCcw,
        title: '售后保障',
        desc: '不满意可退换',
      },
    ],
  } : {
    id: productId,
    name: '商品不存在',
    images: ['https://via.placeholder.com/800'],
    price: 0,
    unit: '',
    stock: 0,
    sales: 0,
    rating: 0,
    tag: '',
    tags: [],
    description: '该商品不存在',
    nutrition: [],
    features: [],
  };

  const reviews = [
      {
        id: 1,
        user: '张**',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        date: '2024-01-15',
        content: '西兰花很新鲜，颜色翠绿，花球紧实，没有黄叶。口感很嫩，适合清炒和焯水凉拌。',
        images: [
          'https://images.unsplash.com/photo-1628773822990-202e8e7d2d85?w=200',
          'https://images.unsplash.com/photo-1553778256-f78276190634?w=200',
        ],
        likes: 23,
      },
      {
        id: 2,
        user: '李**',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 5,
        date: '2024-01-14',
        content: '有机西兰花品质很好，500g够一家三口吃一顿。配送速度快，包装严实。',
        images: [],
        likes: 15,
      },
      {
        id: 3,
        user: '王**',
        avatar: 'https://i.pravatar.cc/150?img=3',
        rating: 4,
        date: '2024-01-13',
        content: '整体不错，就是价格稍微有点贵，不过有机蔬菜确实比普通的健康一些。',
        images: [],
        likes: 8,
      },
    ];

  const faqs = [
      {
        question: '如何判断西兰花是否新鲜？',
        answer: '新鲜的西兰花颜色翠绿，花球紧实，茎部不发黄，没有黑点。我们的西兰花都是当日采摘，冷链配送，保证新鲜度。',
      },
      {
        question: '西兰花怎么清洗和烹饪？',
        answer:
          '建议先用流水冲洗，然后浸泡在淡盐水中10分钟去除残留农药（虽然我们的有机西兰花无农药）。烹饪时可以焯水后凉拌，或者清炒，烹饪时间不宜过长以保留营养。',
      },
      {
        question: '西兰花可以保存多久？',
        answer: '建议收到后尽快食用。如需保存，可用保鲜膜包好放入冰箱冷藏，可保存3-5天。不建议冷冻，会影响口感。',
      },
      {
        question: '配送时间和范围？',
        answer: '深圳市内各区域支持次日达。每天下午5点前下单，次日上午送达。偏远区域配送时间可能延长1-2天。',
      },
    ];

  const handleAddToCart = async () => {
    try {
      // 添加到购物车
      await groceryCartService.addToCart(productId, quantity);
      // 返回商品列表页
      navigation.goBack();
    } catch (error) {
      console.error('添加到购物车失败:', error);
    }
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header - 浮动在图片上方 */}
      <XStack
        position="absolute"
        top={insets.top}
        left={0}
        right={0}
        zIndex={10}
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        justifyContent="space-between"
        alignItems="center"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <View
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="rgba(0,0,0,0.5)"
            justifyContent="center"
            alignItems="center"
          >
            <ArrowLeft size={22} color="white" />
          </View>
        </Pressable>
        <XStack gap="$2">
          <TouchableOpacity>
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="rgba(0,0,0,0.5)"
              justifyContent="center"
              alignItems="center"
            >
              <Share2 size={20} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="rgba(0,0,0,0.5)"
              justifyContent="center"
              alignItems="center"
            >
              <Heart size={20} color={isFavorite ? errorColor : 'white'} fill={isFavorite ? errorColor : 'none'} />
            </View>
          </TouchableOpacity>
        </XStack>
      </XStack>

      <RNScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images Carousel */}
        <View height={SCREEN_WIDTH}>
            <RNScrollView
              ref={imageScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentImageIndex(index);
              }}
            >
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
                  resizeMode="cover"
                />
              ))}
            </RNScrollView>

            {/* Image Indicators */}
            <XStack
              position="absolute"
              bottom={16}
              alignSelf="center"
              space="$2"
              backgroundColor="rgba(0,0,0,0.5)"
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$4"
            >
              {product.images.map((_, index) => (
                <View
                  key={index}
                  width={index === currentImageIndex ? 16 : 6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)'}
                />
              ))}
            </XStack>
          </View>

          {/* Product Info */}
          <YStack padding="$2.5" gap="$2" backgroundColor="$color2">
            {/* Price & Title */}
            <YStack gap="$1.5">
              <XStack alignItems="baseline" gap="$2">
                <Text fontSize="$8" fontWeight="700" color="$primary">
                  ¥{product.price}
                </Text>
                <Text fontSize="$3" color="$color10" textDecorationLine="line-through">
                  ¥{product.originalPrice}
                </Text>
                <View backgroundColor="$warning" paddingHorizontal="$1.5" paddingVertical="$0.5" borderRadius="$2">
                  <Text fontSize={10} color="white" fontWeight="600">
                    {product.tag}
                  </Text>
                </View>
              </XStack>
              <Text fontSize="$5" fontWeight="600" color="$color12">
                {product.name}
              </Text>
              <Text fontSize="$3" color="$color10">
                {product.unit}
              </Text>
            </YStack>

            {/* Tags */}
            <XStack flexWrap="wrap" gap="$1.5">
              {product.tags.map((tag, index) => (
                <View
                  key={index}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor="$primary"
                >
                  <Text fontSize="$2" color="$primary" fontWeight="500">
                    {tag}
                  </Text>
                </View>
              ))}
            </XStack>

            {/* Stats */}
            <XStack gap="$3" paddingTop="$2" borderTopWidth={1} borderTopColor="$color5" alignItems="center">
              <XStack gap="$1" alignItems="center">
                <Star size={14} color={goldColor} fill={goldColor} />
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {product.rating}
                </Text>
                <Text fontSize="$2" color="$color10">
                  评分
                </Text>
              </XStack>
              <View width={1} height={14} backgroundColor="$color5" />
              <Text fontSize="$2" color="$color10">
                已售 {product.sales}
              </Text>
              <View width={1} height={14} backgroundColor="$color5" />
              <Text fontSize="$2" color="$color10">
                库存 {product.stock}
              </Text>
            </XStack>
          </YStack>

          {/* Features */}
          <YStack backgroundColor="$color2" marginTop="$2" padding="$2" gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              服务保障
            </Text>
            <XStack flexWrap="wrap" gap="$2">
              {product.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <XStack
                    key={index}
                    flex={1}
                    minWidth="45%"
                    gap="$2"
                    alignItems="center"
                    padding="$2"
                    backgroundColor="$color4"
                    borderRadius="$4"
                  >
                    <View
                      width={36}
                      height={36}
                      borderRadius={18}
                      justifyContent="center"
                      alignItems="center"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <IconComponent size={18} color={primaryColor} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                        {feature.title}
                      </Text>
                      <Text fontSize="$2" color="$color10" numberOfLines={1}>
                        {feature.desc}
                      </Text>
                    </YStack>
                  </XStack>
                );
              })}
            </XStack>
          </YStack>

          {/* Tabs */}
          <YStack backgroundColor="$color2" marginTop="$2">
            <XStack borderBottomWidth={1} borderBottomColor="$color5">
              {[
                { key: 'detail', label: '商品详情' },
                { key: 'reviews', label: '用户评价' },
                { key: 'qa', label: '常见问题' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={{ flex: 1 }}
                  onPress={() => setActiveTab(tab.key as TabType)}
                >
                  <View
                    paddingVertical="$2"
                    alignItems="center"
                    borderBottomWidth={activeTab === tab.key ? 2 : 0}
                    borderBottomColor="$primary"
                  >
                    <Text
                      fontSize="$3"
                      fontWeight={activeTab === tab.key ? '600' : '400'}
                      color={activeTab === tab.key ? '$primary' : '$color10'}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>

            {/* Tab Content */}
            <YStack padding="$2" gap="$2" minHeight={300}>
              {activeTab === 'detail' && (
                <YStack gap="$2">
                  <YStack gap="$1">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      商品描述
                    </Text>
                    <Text fontSize="$3" color="$color12" lineHeight={20}>
                      {product.description}
                    </Text>
                  </YStack>

                  <YStack gap="$1">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      营养成分
                    </Text>
                    <YStack gap="$1">
                      {product.nutrition.map((item, index) => (
                        <XStack
                          key={index}
                          justifyContent="space-between"
                          padding="$2"
                          backgroundColor="$color4"
                          borderRadius="$3"
                        >
                          <Text fontSize="$3" color="$color12">{item.name}</Text>
                          <Text fontSize="$3" fontWeight="600" color="$color12">
                            {item.value}
                            <Text fontSize="$2" color="$color10">
                              {' '}
                              {item.unit}
                            </Text>
                          </Text>
                        </XStack>
                      ))}
                    </YStack>
                  </YStack>
                </YStack>
              )}

              {activeTab === 'reviews' && (
                <YStack gap="$1.5">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      用户评价 ({reviews.length})
                    </Text>
                    <XStack gap="$1" alignItems="center">
                      <Star size={14} color={goldColor} fill={goldColor} />
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {product.rating}
                      </Text>
                    </XStack>
                  </XStack>

                  {reviews.map((review) => (
                    <View key={review.id} padding="$2" backgroundColor="$color4" borderRadius="$4">
                      <XStack gap="$2" marginBottom="$1.5">
                        <Image
                          source={{ uri: review.avatar }}
                          style={{ width: 32, height: 32, borderRadius: 16 }}
                        />
                        <YStack flex={1}>
                          <XStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" fontWeight="600" color="$color12">
                              {review.user}
                            </Text>
                            <XStack gap="$0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  color={i < review.rating ? goldColor : color10}
                                  fill={i < review.rating ? goldColor : 'none'}
                                />
                              ))}
                            </XStack>
                          </XStack>
                          <Text fontSize="$2" color="$color10">
                            {review.date}
                          </Text>
                        </YStack>
                      </XStack>
                      <Text fontSize="$3" color="$color12" lineHeight={18} marginBottom="$1.5">
                        {review.content}
                      </Text>
                      {review.images.length > 0 && (
                        <XStack gap="$1.5" marginBottom="$1.5">
                          {review.images.map((img, index) => (
                            <Image
                              key={index}
                              source={{ uri: img }}
                              style={{ width: 64, height: 64, borderRadius: 6 }}
                            />
                          ))}
                        </XStack>
                      )}
                      <XStack gap="$1" alignItems="center">
                        <ThumbsUp size={12} color={color10} />
                        <Text fontSize="$2" color="$color10">
                          {review.likes}
                        </Text>
                      </XStack>
                    </View>
                  ))}
                </YStack>
              )}

              {activeTab === 'qa' && (
                <YStack gap="$1.5">
                  {faqs.map((faq, index) => (
                    <View key={index} padding="$2" backgroundColor="$color4" borderRadius="$4">
                      <XStack gap="$1.5" alignItems="flex-start" marginBottom="$1.5">
                        <View
                          width={20}
                          height={20}
                          borderRadius={10}
                          backgroundColor="$primary"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize={10} fontWeight="700" color="white">
                            Q
                          </Text>
                        </View>
                        <Text fontSize="$3" fontWeight="600" color="$color12" flex={1}>
                          {faq.question}
                        </Text>
                      </XStack>
                      <XStack gap="$1.5" alignItems="flex-start">
                        <View
                          width={20}
                          height={20}
                          borderRadius={10}
                          backgroundColor="$success"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize={10} fontWeight="700" color="white">
                            A
                          </Text>
                        </View>
                        <Text fontSize="$3" color="$color12" flex={1} lineHeight={18}>
                          {faq.answer}
                        </Text>
                      </XStack>
                    </View>
                  ))}
                </YStack>
              )}
            </YStack>
          </YStack>

          {/* Bottom Padding */}
        <View height={100} />
      </RNScrollView>

      {/* Bottom Action Bar */}
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
        <XStack gap="$2" alignItems="center">
          {/* Quantity Selector */}
          <XStack
            gap="$2"
            alignItems="center"
            paddingHorizontal="$2"
            paddingVertical="$1.5"
            backgroundColor="$color4"
            borderRadius="$3"
          >
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <View
                width={28}
                height={28}
                borderRadius={14}
                backgroundColor={quantity <= 1 ? '$color5' : '$primary'}
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontWeight="700">
                  -
                </Text>
              </View>
            </TouchableOpacity>
            <Text fontSize="$4" fontWeight="600" color="$color12" minWidth={36} textAlign="center">
              {quantity}
            </Text>
            <TouchableOpacity onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}>
              <View
                width={28}
                height={28}
                borderRadius={14}
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontWeight="700">
                  +
                </Text>
              </View>
            </TouchableOpacity>
          </XStack>

          {/* Action Button */}
          <TouchableOpacity style={{ flex: 1 }} onPress={handleAddToCart}>
            <View
              flex={1}
              backgroundColor="$primary"
              paddingVertical="$2.5"
              borderRadius="$10"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                加入购物车
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>
    </View>
  );
};
