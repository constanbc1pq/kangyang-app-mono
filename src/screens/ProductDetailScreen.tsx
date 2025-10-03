import React, { useState, useRef } from 'react';
import {
  Pressable,
  TouchableOpacity,
  ScrollView as RNScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, H2, H3 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  Package,
  Shield,
  Truck,
  RotateCcw,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation } from '@react-navigation/native';
import { groceryCartService } from '@/services/groceryCartService';

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
  const imageScrollRef = useRef<RNScrollView>(null);
  const productId = route?.params?.productId || 1; // 默认商品ID

  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Mock product data - 实际应该从props或API获取
  const product = {
    id: productId,
    name: '有机西兰花',
    images: [
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
      'https://images.unsplash.com/photo-1628773822990-202e8e7d2d85?w=800',
      'https://images.unsplash.com/photo-1553778256-f78276190634?w=800',
    ],
    price: 12.9,
    originalPrice: 15.9,
    unit: '500g',
    stock: 156,
    sales: 1234,
    rating: 4.8,
    tag: '新鲜',
    tags: ['有机认证', '当日采摘', '冷链配送'],
    description:
      '精选优质有机西兰花，产自山东寿光有机农场。每日清晨采摘，全程冷链配送，保证新鲜度。富含维生素C、膳食纤维和多种矿物质，营养丰富，口感鲜嫩。',
    nutrition: [
      { name: '能量', value: '34', unit: 'kcal/100g' },
      { name: '蛋白质', value: '2.8', unit: 'g/100g' },
      { name: '膳食纤维', value: '1.6', unit: 'g/100g' },
      { name: '维生素C', value: '51', unit: 'mg/100g' },
    ],
    features: [
      {
        icon: Package,
        title: '产地直采',
        desc: '山东寿光有机农场',
      },
      {
        icon: Shield,
        title: '品质保证',
        desc: '有机认证 无农药残留',
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
    reviews: [
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
    ],
    faqs: [
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
        answer: '朝阳区、海淀区、东城区、西城区支持次日达。每天下午5点前下单，次日上午送达。其他区域配送时间可能延长1-2天。',
      },
    ],
  };

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
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
        {/* Header */}
        <XStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={10}
          paddingHorizontal="$4"
          paddingVertical="$3"
          justifyContent="space-between"
          alignItems="center"
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ChevronLeft size={24} color="white" />
          </Pressable>
          <XStack space="$3">
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Share2 size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Heart size={20} color={isFavorite ? COLORS.error : 'white'} fill={isFavorite ? COLORS.error : 'none'} />
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
          <YStack padding="$4" space="$3" backgroundColor="white">
            {/* Price & Title */}
            <YStack space="$2">
              <XStack alignItems="baseline" space="$2">
                <Text fontSize="$9" fontWeight="bold" color={COLORS.error}>
                  ¥{product.price}
                </Text>
                <Text fontSize="$4" color="$textSecondary" textDecorationLine="line-through">
                  ¥{product.originalPrice}
                </Text>
                <View backgroundColor={COLORS.error} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                  <Text fontSize="$2" color="white" fontWeight="600">
                    {product.tag}
                  </Text>
                </View>
              </XStack>
              <H2 fontSize="$7" fontWeight="600" color="$text">
                {product.name}
              </H2>
              <Text fontSize="$3" color="$textSecondary">
                {product.unit}
              </Text>
            </YStack>

            {/* Tags */}
            <XStack flexWrap="wrap" gap="$2">
              {product.tags.map((tag, index) => (
                <View
                  key={index}
                  backgroundColor={`${COLORS.primary}10`}
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$3"
                >
                  <Text fontSize="$2" color={COLORS.primary} fontWeight="600">
                    {tag}
                  </Text>
                </View>
              ))}
            </XStack>

            {/* Stats */}
            <XStack space="$4" paddingVertical="$3" borderTopWidth={1} borderTopColor="$borderColor">
              <XStack space="$1" alignItems="center">
                <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                <Text fontSize="$3" fontWeight="600">
                  {product.rating}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  评分
                </Text>
              </XStack>
              <View width={1} height={16} backgroundColor="$borderColor" />
              <Text fontSize="$3" color="$textSecondary">
                已售 {product.sales}
              </Text>
              <View width={1} height={16} backgroundColor="$borderColor" />
              <Text fontSize="$3" color="$textSecondary">
                库存 {product.stock}
              </Text>
            </XStack>
          </YStack>

          {/* Features */}
          <YStack backgroundColor="white" marginTop="$3" padding="$4" space="$3">
            <H3 fontSize="$5" fontWeight="600">
              服务保障
            </H3>
            <XStack flexWrap="wrap" gap="$3">
              {product.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <XStack
                    key={index}
                    flex={1}
                    minWidth="45%"
                    space="$2"
                    alignItems="center"
                    padding="$3"
                    backgroundColor="$background"
                    borderRadius="$3"
                  >
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${COLORS.primary}10`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <IconComponent size={20} color={COLORS.primary} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600" marginBottom="$1">
                        {feature.title}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
                        {feature.desc}
                      </Text>
                    </YStack>
                  </XStack>
                );
              })}
            </XStack>
          </YStack>

          {/* Tabs */}
          <YStack backgroundColor="white" marginTop="$3">
            <XStack borderBottomWidth={1} borderBottomColor="$borderColor">
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
                    paddingVertical="$3"
                    alignItems="center"
                    borderBottomWidth={activeTab === tab.key ? 3 : 0}
                    borderBottomColor={COLORS.primary}
                    backgroundColor={activeTab === tab.key ? `${COLORS.primary}10` : 'transparent'}
                  >
                    <Text
                      fontSize="$4"
                      fontWeight={activeTab === tab.key ? '600' : 'normal'}
                      color={activeTab === tab.key ? 'white' : '$textSecondary'}
                      style={{
                        color: activeTab === tab.key ? COLORS.primary : COLORS.textSecondary,
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>

            {/* Tab Content */}
            <YStack padding="$4" space="$4" minHeight={300}>
              {activeTab === 'detail' && (
                <YStack space="$4">
                  <YStack space="$2">
                    <H3 fontSize="$5" fontWeight="600">
                      商品描述
                    </H3>
                    <Text fontSize="$4" color="$text" lineHeight={24}>
                      {product.description}
                    </Text>
                  </YStack>

                  <YStack space="$2">
                    <H3 fontSize="$5" fontWeight="600">
                      营养成分
                    </H3>
                    <YStack space="$2">
                      {product.nutrition.map((item, index) => (
                        <XStack
                          key={index}
                          justifyContent="space-between"
                          padding="$3"
                          backgroundColor="$background"
                          borderRadius="$3"
                        >
                          <Text fontSize="$4">{item.name}</Text>
                          <Text fontSize="$4" fontWeight="600">
                            {item.value}
                            <Text fontSize="$3" color="$textSecondary">
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
                <YStack space="$4">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <H3 fontSize="$5" fontWeight="600">
                      用户评价 ({product.reviews.length})
                    </H3>
                    <XStack space="$1" alignItems="center">
                      <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                      <Text fontSize="$4" fontWeight="600">
                        {product.rating}
                      </Text>
                    </XStack>
                  </XStack>

                  {product.reviews.map((review) => (
                    <Card key={review.id} padding="$4" backgroundColor="$background" borderRadius="$4">
                      <XStack space="$3" marginBottom="$3">
                        <Image
                          source={{ uri: review.avatar }}
                          style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        <YStack flex={1}>
                          <XStack justifyContent="space-between" marginBottom="$1">
                            <Text fontSize="$4" fontWeight="600">
                              {review.user}
                            </Text>
                            <XStack space="$1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  color={i < review.rating ? COLORS.warning : COLORS.textSecondary}
                                  fill={i < review.rating ? COLORS.warning : 'none'}
                                />
                              ))}
                            </XStack>
                          </XStack>
                          <Text fontSize="$2" color="$textSecondary">
                            {review.date}
                          </Text>
                        </YStack>
                      </XStack>
                      <Text fontSize="$4" color="$text" lineHeight={22} marginBottom="$3">
                        {review.content}
                      </Text>
                      {review.images.length > 0 && (
                        <XStack space="$2" marginBottom="$3">
                          {review.images.map((img, index) => (
                            <Image
                              key={index}
                              source={{ uri: img }}
                              style={{ width: 80, height: 80, borderRadius: 8 }}
                            />
                          ))}
                        </XStack>
                      )}
                      <XStack space="$4">
                        <XStack space="$1" alignItems="center">
                          <ThumbsUp size={14} color={COLORS.textSecondary} />
                          <Text fontSize="$3" color="$textSecondary">
                            {review.likes}
                          </Text>
                        </XStack>
                        <XStack space="$1" alignItems="center">
                          <MessageCircle size={14} color={COLORS.textSecondary} />
                          <Text fontSize="$3" color="$textSecondary">
                            回复
                          </Text>
                        </XStack>
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              )}

              {activeTab === 'qa' && (
                <YStack space="$3">
                  {product.faqs.map((faq, index) => (
                    <Card key={index} padding="$4" backgroundColor="$background" borderRadius="$4">
                      <XStack space="$2" alignItems="flex-start" marginBottom="$2">
                        <View
                          width={24}
                          height={24}
                          borderRadius={12}
                          backgroundColor={COLORS.primary}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize="$3" fontWeight="bold" color="white">
                            Q
                          </Text>
                        </View>
                        <Text fontSize="$4" fontWeight="600" flex={1}>
                          {faq.question}
                        </Text>
                      </XStack>
                      <XStack space="$2" alignItems="flex-start">
                        <View
                          width={24}
                          height={24}
                          borderRadius={12}
                          backgroundColor={COLORS.success}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text fontSize="$3" fontWeight="bold" color="white">
                            A
                          </Text>
                        </View>
                        <Text fontSize="$4" color="$text" flex={1} lineHeight={22}>
                          {faq.answer}
                        </Text>
                      </XStack>
                    </Card>
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
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          padding="$4"
        >
          <XStack space="$3" alignItems="center">
            {/* Quantity Selector */}
            <XStack
              space="$2"
              alignItems="center"
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor="$background"
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
                  backgroundColor={quantity <= 1 ? '$borderColor' : COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white" fontWeight="bold">
                    -
                  </Text>
                </View>
              </TouchableOpacity>
              <Text fontSize="$5" fontWeight="600" minWidth={40} textAlign="center">
                {quantity}
              </Text>
              <TouchableOpacity onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                <View
                  width={28}
                  height={28}
                  borderRadius={14}
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white" fontWeight="bold">
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            </XStack>

            {/* Action Button */}
            <TouchableOpacity style={{ flex: 1 }} onPress={handleAddToCart}>
              <View
                flex={1}
                backgroundColor={COLORS.primary}
                paddingVertical="$3"
                borderRadius="$4"
                alignItems="center"
              >
                <Text fontSize="$5" color="white" fontWeight="600">
                  加入购物车
                </Text>
              </View>
            </TouchableOpacity>
          </XStack>
        </View>
      </SafeAreaView>
    </Theme>
  );
};
