import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  Button,
  ScrollView,
  H2,
  H3,
  Separator,
  Card,
} from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
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
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { SecondHandItem, ItemCondition, TradeMethod } from '@/types/community';
import {
  getSecondHandItemById,
  getSecondHandItems,
  createConversation,
} from '@/services/communityDataService';
import { SecondHandCard } from '@/components/SecondHandCard';

interface SecondHandDetailScreenProps {
  navigation: any;
  route: {
    params: {
      itemId: string;
    };
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH; // 1:1 aspect ratio

/**
 * 二手商品详情页
 * 类似闲鱼的商品详情页设计
 */
export const SecondHandDetailScreen: React.FC<SecondHandDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { itemId } = route.params;
  const [item, setItem] = useState<SecondHandItem | null>(null);
  const [similarItems, setSimilarItems] = useState<SecondHandItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

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
    navigation.navigate('Chat', { conversationId: conversation.id });
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
      [ItemCondition.LIKE_NEW]: '99成新',
      [ItemCondition.EXCELLENT]: '95成新',
      [ItemCondition.GOOD]: '9成新',
      [ItemCondition.FAIR]: '8成新',
      [ItemCondition.USED]: '使用痕迹',
    };
    return labels[condition];
  };

  const getConditionColor = (condition: ItemCondition): string => {
    if (condition === ItemCondition.NEW || condition === ItemCondition.LIKE_NEW) {
      return COLORS.success;
    } else if (condition === ItemCondition.EXCELLENT || condition === ItemCondition.GOOD) {
      return COLORS.primary;
    } else {
      return COLORS.textSecondary;
    }
  };

  const renderImageCarousel = () => {
    if (!item) return null;

    // 图片占位（实际应该是可滑动的轮播图）
    return (
      <View width={SCREEN_WIDTH} height={IMAGE_HEIGHT} overflow="hidden">
        <View
          width={SCREEN_WIDTH}
          height={IMAGE_HEIGHT}
          backgroundColor="$background"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={120} opacity={0.3}>
            📦
          </Text>

          {/* 免费赠送角标 */}
          {item.isFree && (
            <View
              position="absolute"
              top={16}
              left={16}
              backgroundColor={COLORS.success}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$3"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                免费赠送
              </Text>
            </View>
          )}

          {/* 图片指示器 */}
          <View
            position="absolute"
            bottom={16}
            right={16}
            backgroundColor="rgba(0,0,0,0.6)"
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius="$3"
          >
            <Text fontSize="$3" color="white">
              1/3
            </Text>
          </View>
        </View>

        {/* 顶部导航栏 */}
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          paddingTop={50}
          paddingHorizontal="$4"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <TouchableOpacity onPress={handleBack}>
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
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare}>
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
          </XStack>
        </View>
      </View>
    );
  };

  if (loading || !item) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 图片轮播 */}
        {renderImageCarousel()}

        {/* 商品信息卡片 */}
        <Card
          padding="$4"
          borderRadius="$0"
          backgroundColor="white"
          marginBottom="$2"
        >
          {/* 价格区域 */}
          <XStack space="$3" alignItems="baseline" marginBottom="$3">
            {item.isFree ? (
              <Text fontSize="$8" fontWeight="bold" color={COLORS.success}>
                免费赠送
              </Text>
            ) : (
              <>
                <Text fontSize="$8" fontWeight="bold" color={COLORS.error}>
                  ¥{item.currentPrice}
                </Text>
                {item.originalPrice && (
                  <Text
                    fontSize="$4"
                    color="$textSecondary"
                    textDecorationLine="line-through"
                  >
                    ¥{item.originalPrice}
                  </Text>
                )}
              </>
            )}
            <View
              backgroundColor={`${getConditionColor(item.condition)}20`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$3" color={getConditionColor(item.condition)} fontWeight="600">
                {getConditionLabel(item.condition)}
              </Text>
            </View>
          </XStack>

          {/* 标题 */}
          <Text fontSize="$6" fontWeight="600" color="$text" marginBottom="$3">
            {item.title}
          </Text>

          {/* 标签 */}
          <XStack space="$2" flexWrap="wrap" marginBottom="$3">
            {item.isNegotiable && (
              <View
                backgroundColor="$background"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={COLORS.primary}>
                  可议价
                </Text>
              </View>
            )}
            {item.category && (
              <View
                backgroundColor="$background"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$textSecondary">
                  {item.category}
                </Text>
              </View>
            )}
          </XStack>

          {/* 位置 */}
          <XStack space="$2" alignItems="center">
            <MapPin size={16} color={COLORS.textSecondary} />
            <Text fontSize="$3" color="$textSecondary">
              {item.location.city} {item.location.district}
            </Text>
          </XStack>
        </Card>

        {/* 卖家信息卡片 */}
        <Card
          padding="$4"
          borderRadius="$0"
          backgroundColor="white"
          marginBottom="$2"
        >
          <TouchableOpacity onPress={handleSellerProfilePress}>
            <XStack space="$3" alignItems="center">
              {/* 卖家头像占位 */}
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$background"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={24}>👤</Text>
              </View>

              <YStack flex={1}>
                <XStack space="$2" alignItems="center" marginBottom="$1">
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    卖家昵称
                  </Text>
                  {item.sellerVerified && (
                    <View
                      backgroundColor={COLORS.primary}
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$1"
                    >
                      <Text fontSize="$1" color="white">
                        认证
                      </Text>
                    </View>
                  )}
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Shield size={12} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    信用良好
                  </Text>
                </XStack>
              </YStack>

              <View
                backgroundColor="$background"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$2"
              >
                <XStack space="$1" alignItems="center">
                  <Store size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$3" color="$textSecondary">
                    进入主页
                  </Text>
                </XStack>
              </View>
            </XStack>
          </TouchableOpacity>
        </Card>

        {/* 商品详情卡片 */}
        <Card
          padding="$4"
          borderRadius="$0"
          backgroundColor="white"
          marginBottom="$2"
        >
          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
            商品详情
          </Text>

          {/* 详情项 */}
          <YStack space="$3">
            <XStack space="$2" alignItems="flex-start">
              <Package size={18} color={COLORS.textSecondary} />
              <YStack flex={1}>
                <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                  成色描述
                </Text>
                <Text fontSize="$4" color="$text">
                  {item.description}
                </Text>
              </YStack>
            </XStack>

            {item.purchaseTime && (
              <XStack space="$2" alignItems="center">
                <Calendar size={18} color={COLORS.textSecondary} />
                <YStack>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                    购买时间
                  </Text>
                  <Text fontSize="$4" color="$text">
                    {item.purchaseTime}
                  </Text>
                </YStack>
              </XStack>
            )}
          </YStack>
        </Card>

        {/* 交易方式卡片 */}
        <Card
          padding="$4"
          borderRadius="$0"
          backgroundColor="white"
          marginBottom="$2"
        >
          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
            交易方式
          </Text>

          <XStack space="$4">
            {item.tradeMethods.includes(TradeMethod.PICKUP) && (
              <XStack space="$2" alignItems="center">
                <Hand size={18} color={COLORS.primary} />
                <Text fontSize="$4" color="$text">
                  同城自取
                </Text>
              </XStack>
            )}
            {item.tradeMethods.includes(TradeMethod.DELIVERY) && (
              <XStack space="$2" alignItems="center">
                <Truck size={18} color={COLORS.primary} />
                <Text fontSize="$4" color="$text">
                  快递邮寄
                </Text>
              </XStack>
            )}
          </XStack>

          <Separator marginVertical="$3" />

          {/* 位置信息 */}
          <XStack space="$2" alignItems="flex-start">
            <MapPin size={18} color={COLORS.textSecondary} />
            <YStack flex={1}>
              <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                交易地点
              </Text>
              <Text fontSize="$4" color="$text">
                {item.location.city} {item.location.district}
              </Text>
              {item.location.address && (
                <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                  详细地址需联系卖家获取
                </Text>
              )}
            </YStack>
          </XStack>
        </Card>

        {/* 相似推荐 */}
        {similarItems.length > 0 && (
          <Card
            padding="$4"
            borderRadius="$0"
            backgroundColor="white"
            marginBottom="$2"
          >
            <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
              相似推荐
            </Text>

            <FlatList
              data={similarItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View width={160} marginRight="$3">
                  <SecondHandCard
                    item={item}
                    onPress={(id) => {
                      navigation.push('SecondHandDetail', { itemId: id });
                    }}
                  />
                </View>
              )}
            />
          </Card>
        )}

        {/* 底部安全区域 */}
        <View height={100} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="white"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={8}
      >
        <XStack space="$3" alignItems="center">
          {/* 收藏按钮 */}
          <TouchableOpacity onPress={handleToggleFavorite}>
            <View
              width={48}
              height={48}
              justifyContent="center"
              alignItems="center"
            >
              <Heart
                size={24}
                color={isFavorite ? COLORS.error : COLORS.textSecondary}
                fill={isFavorite ? COLORS.error : 'none'}
              />
            </View>
          </TouchableOpacity>

          {/* 联系卖家 */}
          <TouchableOpacity style={{ flex: 1 }} onPress={handleContactSeller}>
            <View
              flex={1}
              backgroundColor="$background"
              borderRadius="$3"
              paddingVertical="$3"
              justifyContent="center"
              alignItems="center"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack space="$2" alignItems="center">
                <MessageCircle size={18} color={COLORS.textSecondary} />
                <Text fontSize="$4" color="$text" fontWeight="600">
                  联系卖家
                </Text>
              </XStack>
            </View>
          </TouchableOpacity>

          {/* 我想要 */}
          <TouchableOpacity style={{ flex: 1 }} onPress={handleWantItem}>
            <View
              flex={1}
              backgroundColor={COLORS.primary}
              borderRadius="$3"
              paddingVertical="$3"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                {item.isFree ? '我想要' : '立即购买'}
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>
    </SafeAreaView>
  );
};
