/**
 * SecondHandDetailScreen 二手商品详情页
 * 类似闲鱼的商品详情页设计
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Separator,
  Image,
  useTheme,
} from 'tamagui';
import {
  Pressable,
  Dimensions,
  FlatList,
  View as RNView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Truck,
  Hand,
  MessageCircle,
  Heart,
  Store,
  Calendar,
  Package,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import { SecondHandItem, ItemCondition, TradeMethod } from '@/types/community';
import {
  getSecondHandItemById,
  getSecondHandItems,
  createConversation,
} from '@/services/communityDataService';
import { SecondHandCard } from '@/components/SecondHandCard';
import { TitleBar } from '@/components/TitleBar';

interface SecondHandDetailScreenProps {
  navigation: any;
  route: {
    params: {
      itemId: string;
    };
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 280; // 固定高度

/**
 * 二手商品详情页
 */
export const SecondHandDetailScreen: React.FC<SecondHandDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const { itemId } = route.params;
  const [item, setItem] = useState<SecondHandItem | null>(null);
  const [similarItems, setSimilarItems] = useState<SecondHandItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadItemDetail();
  }, [itemId]);

  const loadItemDetail = async () => {
    try {
      setLoading(true);
      const itemData = await getSecondHandItemById(itemId);
      if (itemData) {
        setItem(itemData);
        // 加载相似商品（同类目）
        const allItems = await getSecondHandItems({ category: itemData.category });
        const similar = allItems.filter(i => i.id !== itemId).slice(0, 6);
        setSimilarItems(similar);
      }
    } catch (error) {
      console.error('加载商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    // TODO: 实现分享功能
    console.log('分享商品:', itemId);
  };

  const handleContactSeller = async () => {
    if (!item) return;

    // 创建与卖家的对话
    const conversation = await createConversation(
      'current_user', // 当前用户ID
      item.sellerId,
      'item' as any, // ConversationRelatedType.ITEM
      itemId,
      item.title,
      item.images[0],
      '我', // 当前用户名称
      '👤', // 当前用户头像
      item.sellerName,
      item.sellerAvatar
    );
    navigation.navigate('Chat', {
      conversationId: conversation.id,
      expertName: item.sellerName,
      expertAvatar: item.sellerAvatar,
      expertId: item.sellerId,
    });
  };

  const handleWantItem = () => {
    // TODO: 实现"我想要"功能（直接下单或留言）
    console.log('我想要:', itemId);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: 持久化收藏状态
  };

  const handleSellerProfilePress = () => {
    if (!item) return;
    // TODO: 跳转到卖家主页
    console.log('查看卖家主页:', item.sellerId);
  };

  const getConditionLabel = (condition: ItemCondition): string => {
    const labels: { [key in ItemCondition]: string } = {
      [ItemCondition.NEW]: '全新',
      [ItemCondition.LIKE_NEW]: '99新',
      [ItemCondition.EXCELLENT]: '95新',
      [ItemCondition.GOOD]: '9成新',
      [ItemCondition.FAIR]: '8成新',
      [ItemCondition.USED]: '有痕迹',
    };
    return labels[condition];
  };

  const getConditionColor = (condition: ItemCondition): string | undefined => {
    if (condition === ItemCondition.NEW || condition === ItemCondition.LIKE_NEW) {
      return successColor;
    } else if (condition === ItemCondition.EXCELLENT || condition === ItemCondition.GOOD) {
      return primaryColor;
    } else {
      return color10;
    }
  };

  // 处理图片加载错误
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // 处理图片滚动
  const handleImageScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  // 渲染图片轮播区域
  const renderImageCarousel = () => {
    if (!item) return null;

    const images = item.images && item.images.length > 0 ? item.images : [];
    const hasImages = images.length > 0;

    return (
      <View width={SCREEN_WIDTH} height={IMAGE_HEIGHT} overflow="hidden">
        {hasImages ? (
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => `image-${index}`}
            renderItem={({ item: imageUrl, index }) => (
              <View
                width={SCREEN_WIDTH}
                height={IMAGE_HEIGHT}
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                {!imageErrors[index] ? (
                  <Image
                    source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                    width="100%"
                    height={IMAGE_HEIGHT}
                    resizeMode="contain"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <Package size={80} color={color10} />
                )}
              </View>
            )}
          />
        ) : (
          <View
            width={SCREEN_WIDTH}
            height={IMAGE_HEIGHT}
            backgroundColor="$color4"
            justifyContent="center"
            alignItems="center"
          >
            <Package size={80} color={color10} />
          </View>
        )}

        {/* 免费赠送角标 */}
        {item.isFree && (
          <View
            position="absolute"
            top={insets.top + 60}
            left={16}
            backgroundColor={successColor}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$10"
          >
            <Text fontSize="$3" color="white" fontWeight="600">
              免费赠送
            </Text>
          </View>
        )}

        {/* 图片指示器 */}
        {images.length > 1 && (
          <View
            position="absolute"
            bottom={16}
            right={16}
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <Text fontSize="$2" color="white">
              {currentImageIndex + 1}/{images.length}
            </Text>
          </View>
        )}

        {/* 顶部导航栏 */}
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          paddingTop={insets.top}
          paddingHorizontal="$2.5"
        >
          <XStack justifyContent="space-between" alignItems="center" height={56}>
            <Pressable onPress={handleBack}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="rgba(0,0,0,0.5)"
                justifyContent="center"
                alignItems="center"
              >
                <ArrowLeft size={24} color="white" />
              </View>
            </Pressable>

            <Pressable onPress={handleShare}>
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
            </Pressable>
          </XStack>
        </View>
      </View>
    );
  };

  if (loading || !item) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top} backgroundColor="white">
          <TitleBar title="商品详情" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <RNView style={styles.container}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false} backgroundColor="$background">
        {/* 图片轮播 */}
        {renderImageCarousel()}

        {/* 商品信息卡片 */}
        <View
          padding="$2"
          backgroundColor="$color2"
          marginBottom="$1.5"
        >
          {/* 价格区域 */}
          <XStack gap="$2" alignItems="baseline" marginBottom="$2">
            {item.isFree ? (
              <Text fontSize="$6" fontWeight="700" color={successColor}>
                免费赠送
              </Text>
            ) : (
              <>
                <Text fontSize="$6" fontWeight="700" color={errorColor}>
                  ¥{item.currentPrice}
                </Text>
                {item.originalPrice && (
                  <Text
                    fontSize="$3"
                    color="$color10"
                    textDecorationLine="line-through"
                  >
                    ¥{item.originalPrice}
                  </Text>
                )}
              </>
            )}
            <View
              backgroundColor="$color4"
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color={getConditionColor(item.condition)} fontWeight="500">
                {getConditionLabel(item.condition)}
              </Text>
            </View>
          </XStack>

          {/* 标题 */}
          <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">
            {item.title}
          </Text>

          {/* 标签 */}
          <XStack gap="$1.5" flexWrap="wrap" marginBottom="$2">
            {item.isNegotiable && (
              <View
                backgroundColor="$color4"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color={primaryColor} fontWeight="500">
                  可议价
                </Text>
              </View>
            )}
            {item.category && (
              <View
                backgroundColor="$color4"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color="$color10">
                  {item.category}
                </Text>
              </View>
            )}
          </XStack>

          {/* 位置 */}
          <XStack gap="$1" alignItems="center">
            <MapPin size={14} color={color10} />
            <Text fontSize="$2" color="$color10">
              {item.location.city} {item.location.district}
            </Text>
          </XStack>
        </View>

        {/* 卖家信息卡片 */}
        <Pressable onPress={handleSellerProfilePress}>
          <View
            padding="$2"
            backgroundColor="$color2"
            marginBottom="$1.5"
          >
            <XStack gap="$2" alignItems="center">
              {/* 卖家头像占位 */}
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={24}>👤</Text>
              </View>

              <YStack flex={1}>
                <XStack gap="$1.5" alignItems="center" marginBottom="$0.5">
                  <Text fontSize="$4" fontWeight="600" color="$color12">
                    {item.sellerName || '卖家昵称'}
                  </Text>
                  {item.sellerVerified && (
                    <View
                      backgroundColor={primaryColor}
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$10"
                    >
                      <Text fontSize={10} color="white" fontWeight="500">
                        认证
                      </Text>
                    </View>
                  )}
                </XStack>
                <XStack gap="$1" alignItems="center">
                  <Shield size={12} color={color10} />
                  <Text fontSize="$2" color="$color10">
                    信用良好
                  </Text>
                </XStack>
              </YStack>

              <XStack gap="$0.5" alignItems="center">
                <Store size={14} color={color10} />
                <Text fontSize="$3" color="$color10">
                  主页
                </Text>
                <ChevronRight size={14} color={color10} />
              </XStack>
            </XStack>
          </View>
        </Pressable>

        {/* 商品详情卡片 */}
        <View
          padding="$2"
          backgroundColor="$color2"
          marginBottom="$1.5"
        >
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            商品详情
          </Text>

          {/* 详情项 */}
          <YStack gap="$2">
            <XStack gap="$1.5" alignItems="flex-start">
              <Package size={16} color={color10} />
              <YStack flex={1}>
                <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                  成色描述
                </Text>
                <Text fontSize="$3" color="$color12" lineHeight={20}>
                  {item.description}
                </Text>
              </YStack>
            </XStack>

            {item.purchaseTime && (
              <XStack gap="$1.5" alignItems="flex-start">
                <Calendar size={16} color={color10} />
                <YStack>
                  <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                    购买时间
                  </Text>
                  <Text fontSize="$3" color="$color12">
                    {item.purchaseTime}
                  </Text>
                </YStack>
              </XStack>
            )}
          </YStack>
        </View>

        {/* 交易方式卡片 */}
        <View
          padding="$2"
          backgroundColor="$color2"
          marginBottom="$1.5"
        >
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            交易方式
          </Text>

          <XStack gap="$4" marginBottom="$2">
            {item.tradeMethods.includes(TradeMethod.PICKUP) && (
              <XStack gap="$1" alignItems="center">
                <Hand size={16} color={primaryColor} />
                <Text fontSize="$3" color="$color12">
                  同城自取
                </Text>
              </XStack>
            )}
            {item.tradeMethods.includes(TradeMethod.DELIVERY) && (
              <XStack gap="$1" alignItems="center">
                <Truck size={16} color={primaryColor} />
                <Text fontSize="$3" color="$color12">
                  快递邮寄
                </Text>
              </XStack>
            )}
          </XStack>

          <Separator marginVertical="$2" backgroundColor="$color5" />

          {/* 位置信息 */}
          <XStack gap="$1.5" alignItems="flex-start">
            <MapPin size={16} color={color10} />
            <YStack flex={1}>
              <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                交易地点
              </Text>
              <Text fontSize="$3" color="$color12">
                {item.location.city} {item.location.district}
              </Text>
              {item.location.address && (
                <Text fontSize="$2" color="$color10" marginTop="$0.5">
                  详细地址需联系卖家获取
                </Text>
              )}
            </YStack>
          </XStack>
        </View>

        {/* 相似推荐 */}
        {similarItems.length > 0 && (
          <View
            padding="$2"
            backgroundColor="$color2"
            marginBottom="$1.5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              相似推荐
            </Text>

            <FlatList
              data={similarItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View width={160} marginRight={10}>
                  <SecondHandCard
                    item={item}
                    onPress={(id) => {
                      navigation.push('SecondHandDetail', { itemId: id });
                    }}
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* 底部安全区域 */}
        <View height={80 + insets.bottom} />
      </ScrollView>

      {/* 底部操作栏 - 使用 RNView 确保固定定位 */}
      <RNView style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 14 }]}>
        <XStack gap="$2" alignItems="center">
          {/* 收藏按钮 */}
          <Pressable onPress={handleToggleFavorite}>
            <View
              width={48}
              height={48}
              justifyContent="center"
              alignItems="center"
            >
              <Heart
                size={24}
                color={isFavorite ? errorColor : color10}
                fill={isFavorite ? errorColor : 'none'}
              />
            </View>
          </Pressable>

          {/* 联系卖家 */}
          <Pressable style={{ flex: 1 }} onPress={handleContactSeller}>
            <View
              flex={1}
              backgroundColor="$color4"
              borderRadius="$10"
              paddingVertical="$2"
              justifyContent="center"
              alignItems="center"
              borderWidth={1}
              borderColor="$color5"
            >
              <XStack gap="$1" alignItems="center">
                <MessageCircle size={16} color={color10} />
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  联系卖家
                </Text>
              </XStack>
            </View>
          </Pressable>

          {/* 我想要 */}
          <Pressable style={{ flex: 1 }} onPress={handleWantItem}>
            <View
              flex={1}
              backgroundColor={primaryColor}
              borderRadius="$10"
              paddingVertical="$2"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                {item.isFree ? '我想要' : '立即购买'}
              </Text>
            </View>
          </Pressable>
        </XStack>
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F7F7F7',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
});
