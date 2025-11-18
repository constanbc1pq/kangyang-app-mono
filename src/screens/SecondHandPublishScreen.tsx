import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  TextArea,
  Card,
  H3,
} from 'tamagui';
import { SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Tag,
  Clock,
  Image as ImageIcon,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  SecondHandItem,
  ItemCategory,
  ItemCondition,
  TradeMethod,
  ItemStatus,
} from '@/types/community';
import { createItem } from '@/services/communityDataService';

interface SecondHandPublishScreenProps {
  navigation: any;
}

/**
 * 邻里闲物发布页面
 * 支持完整的二手商品发布流程
 */
export const SecondHandPublishScreen: React.FC<SecondHandPublishScreenProps> = ({
  navigation,
}) => {
  // 基本信息
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.HEALTH_DEVICE);
  const [condition, setCondition] = useState<ItemCondition>(ItemCondition.EXCELLENT);

  // 价格信息
  const [currentPrice, setCurrentPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(true);

  // 商品状态
  const [purchaseTime, setPurchaseTime] = useState('');
  const [usageDuration, setUsageDuration] = useState('');

  // 交易信息
  const [tradeMethods, setTradeMethods] = useState<TradeMethod[]>([TradeMethod.PICKUP]);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');

  // 状态
  const [loading, setLoading] = useState(false);

  // 分类选项
  const categoryOptions = [
    { label: '健康设备', value: ItemCategory.HEALTH_DEVICE },
    { label: '健身器材', value: ItemCategory.FITNESS },
    { label: '辅助用品', value: ItemCategory.ASSISTIVE },
    { label: '日常用品', value: ItemCategory.DAILY },
    { label: '家具', value: ItemCategory.FURNITURE },
    { label: '其他', value: ItemCategory.OTHER },
  ];

  // 成色选项
  const conditionOptions = [
    { label: '全新', value: ItemCondition.NEW },
    { label: '99成新', value: ItemCondition.LIKE_NEW },
    { label: '95成新', value: ItemCondition.EXCELLENT },
    { label: '9成新', value: ItemCondition.GOOD },
    { label: '8成新', value: ItemCondition.FAIR },
    { label: '有明显使用痕迹', value: ItemCondition.USED },
  ];

  // 交易方式切换
  const handleTradeMethodToggle = (method: TradeMethod) => {
    if (tradeMethods.includes(method)) {
      setTradeMethods(tradeMethods.filter((m) => m !== method));
    } else {
      setTradeMethods([...tradeMethods, method]);
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入商品标题');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('提示', '请输入商品描述');
      return false;
    }
    if (!isFree && !currentPrice) {
      Alert.alert('提示', '请输入商品价格或选择免费赠送');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('提示', '请输入交易地址');
      return false;
    }
    if (!district.trim()) {
      Alert.alert('提示', '请输入所在区域');
      return false;
    }
    if (tradeMethods.length === 0) {
      Alert.alert('提示', '请至少选择一种交易方式');
      return false;
    }
    return true;
  };

  // 发布商品
  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const itemData: Omit<SecondHandItem, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        description: description.trim(),
        category,
        images: [], // TODO: 图片上传功能
        sellerId: 'user_current',
        sellerName: '我',
        sellerAvatar: '👤',
        currentPrice: isFree ? 0 : parseInt(currentPrice),
        originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
        isFree,
        isNegotiable,
        currency: '¥',
        condition,
        purchaseTime: purchaseTime.trim() || undefined,
        usageDuration: usageDuration.trim() || undefined,
        tradeMethods,
        location: {
          address: address.trim(),
          district: district.trim(),
        },
        status: ItemStatus.AVAILABLE,
        views: 0,
        favorites: 0,
        publishTime: '刚刚',
      };

      const newItem = await createItem(itemData);

      Alert.alert('发布成功', '您的商品已发布到邻里闲物', [
        {
          text: '查看详情',
          onPress: () => {
            navigation.replace('SecondHandDetail', { itemId: newItem.id });
          },
        },
        {
          text: '返回列表',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('发布失败:', error);
      Alert.alert('发布失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      <View
        backgroundColor="white"
        padding="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={20} color={COLORS.text} />
              <Text fontSize="$4" fontWeight="600" color="$text">
                发布闲置物品
              </Text>
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePublish} disabled={loading}>
            <View
              backgroundColor={loading ? '$borderColor' : COLORS.primary}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$3"
            >
              <Text fontSize="$3" color="white" fontWeight="600">
                {loading ? '发布中...' : '发布'}
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" space="$4">
          {/* 基本信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              基本信息
            </H3>

            {/* 商品标题 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                商品标题
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="例如：九成新血压计，品牌欧姆龙"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                maxLength={50}
              />
            </View>

            {/* 商品描述 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                商品描述
              </Text>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="详细描述商品的功能、外观、使用情况等"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                numberOfLines={5}
                maxLength={500}
              />
            </View>

            {/* 商品分类 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                商品分类
              </Text>
              <XStack flexWrap="wrap" gap="$2">
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setCategory(option.value)}
                  >
                    <View
                      backgroundColor={
                        category === option.value ? COLORS.primary : '$background'
                      }
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        category === option.value ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={category === option.value ? 'white' : '$text'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>

            {/* 商品成色 */}
            <View>
              <Text fontSize="$3" color="$text" marginBottom="$2">
                商品成色
              </Text>
              <XStack flexWrap="wrap" gap="$2">
                {conditionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setCondition(option.value)}
                  >
                    <View
                      backgroundColor={
                        condition === option.value ? COLORS.success : '$background'
                      }
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        condition === option.value ? COLORS.success : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={condition === option.value ? 'white' : '$text'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>
          </Card>

          {/* 价格信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              价格信息
            </H3>

            {/* 免费赠送开关 */}
            <TouchableOpacity onPress={() => setIsFree(!isFree)}>
              <XStack
                space="$2"
                alignItems="center"
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor={isFree ? COLORS.success : '$borderColor'}
                marginBottom="$3"
              >
                <Tag
                  size={20}
                  color={isFree ? COLORS.success : COLORS.textSecondary}
                />
                <Text
                  flex={1}
                  fontSize="$3"
                  color={isFree ? COLORS.success : '$text'}
                  fontWeight={isFree ? '600' : '400'}
                >
                  免费赠送
                </Text>
                <View
                  width={20}
                  height={20}
                  borderRadius={4}
                  borderWidth={2}
                  borderColor={isFree ? COLORS.success : '$borderColor'}
                  backgroundColor={isFree ? COLORS.success : 'transparent'}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isFree && (
                    <Text color="white" fontSize="$2">
                      ✓
                    </Text>
                  )}
                </View>
              </XStack>
            </TouchableOpacity>

            {/* 价格输入 */}
            {!isFree && (
              <>
                <View marginBottom="$3">
                  <XStack space="$2" alignItems="center" marginBottom="$2">
                    <DollarSign size={16} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$text">
                      出售价格
                    </Text>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    <Text fontSize="$4" color="$text">
                      ¥
                    </Text>
                    <Input
                      value={currentPrice}
                      onChangeText={setCurrentPrice}
                      placeholder="请输入价格"
                      keyboardType="numeric"
                      backgroundColor="$background"
                      borderWidth={1}
                      borderColor="$borderColor"
                      borderRadius="$3"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      fontSize="$3"
                      flex={1}
                    />
                  </XStack>
                </View>

                <View marginBottom="$3">
                  <Text fontSize="$3" color="$text" marginBottom="$2">
                    原价（可选）
                  </Text>
                  <XStack space="$2" alignItems="center">
                    <Text fontSize="$4" color="$text">
                      ¥
                    </Text>
                    <Input
                      value={originalPrice}
                      onChangeText={setOriginalPrice}
                      placeholder="购买时的价格"
                      keyboardType="numeric"
                      backgroundColor="$background"
                      borderWidth={1}
                      borderColor="$borderColor"
                      borderRadius="$3"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      fontSize="$3"
                      flex={1}
                    />
                  </XStack>
                </View>

                {/* 可议价开关 */}
                <TouchableOpacity onPress={() => setIsNegotiable(!isNegotiable)}>
                  <XStack space="$2" alignItems="center">
                    <View
                      width={20}
                      height={20}
                      borderRadius={4}
                      borderWidth={2}
                      borderColor={isNegotiable ? COLORS.primary : '$borderColor'}
                      backgroundColor={isNegotiable ? COLORS.primary : 'transparent'}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {isNegotiable && (
                        <Text color="white" fontSize="$2">
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text fontSize="$3" color="$text">
                      价格可议
                    </Text>
                  </XStack>
                </TouchableOpacity>
              </>
            )}
          </Card>

          {/* 使用情况 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              使用情况（可选）
            </H3>

            {/* 购买时间 */}
            <View marginBottom="$3">
              <XStack space="$2" alignItems="center" marginBottom="$2">
                <Clock size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  购买时间
                </Text>
              </XStack>
              <Input
                value={purchaseTime}
                onChangeText={setPurchaseTime}
                placeholder="例如：2023年3月"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
              />
            </View>

            {/* 使用时长 */}
            <View>
              <Text fontSize="$3" color="$text" marginBottom="$2">
                使用时长
              </Text>
              <Input
                value={usageDuration}
                onChangeText={setUsageDuration}
                placeholder="例如：使用1年"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
              />
            </View>
          </Card>

          {/* 交易信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              交易信息
            </H3>

            {/* 交易方式 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                交易方式（可多选）
              </Text>
              <XStack space="$2">
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleTradeMethodToggle(TradeMethod.PICKUP)}
                >
                  <View
                    flex={1}
                    backgroundColor={
                      tradeMethods.includes(TradeMethod.PICKUP)
                        ? COLORS.primary
                        : '$background'
                    }
                    paddingVertical="$3"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={
                      tradeMethods.includes(TradeMethod.PICKUP)
                        ? COLORS.primary
                        : '$borderColor'
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      color={
                        tradeMethods.includes(TradeMethod.PICKUP) ? 'white' : '$text'
                      }
                      fontWeight="600"
                    >
                      同城自取
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleTradeMethodToggle(TradeMethod.DELIVERY)}
                >
                  <View
                    flex={1}
                    backgroundColor={
                      tradeMethods.includes(TradeMethod.DELIVERY)
                        ? COLORS.primary
                        : '$background'
                    }
                    paddingVertical="$3"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={
                      tradeMethods.includes(TradeMethod.DELIVERY)
                        ? COLORS.primary
                        : '$borderColor'
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      color={
                        tradeMethods.includes(TradeMethod.DELIVERY) ? 'white' : '$text'
                      }
                      fontWeight="600"
                    >
                      快递邮寄
                    </Text>
                  </View>
                </TouchableOpacity>
              </XStack>
            </View>

            {/* 交易地址 */}
            <View>
              <XStack space="$2" alignItems="center" marginBottom="$2">
                <MapPin size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  交易地址
                </Text>
              </XStack>
              <Input
                value={address}
                onChangeText={setAddress}
                placeholder="详细地址"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                marginBottom="$2"
              />
              <Input
                value={district}
                onChangeText={setDistrict}
                placeholder="所在区域（如：南山区）"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
              />
            </View>
          </Card>

          {/* 发布提示 */}
          <View
            backgroundColor={`${COLORS.primary}10`}
            padding="$3"
            borderRadius="$3"
          >
            <Text fontSize="$2" color="$textSecondary" lineHeight="$1">
              💡 发布后，您的商品会展示在邻里闲物市场。感兴趣的邻居可以联系您洽谈交易。
            </Text>
          </View>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};
