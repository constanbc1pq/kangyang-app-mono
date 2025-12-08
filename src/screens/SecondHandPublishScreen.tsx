/**
 * SecondHandPublishScreen 邻里闲物发布页面
 * 支持完整的二手商品发布流程
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  TextArea,
  useTheme,
} from 'tamagui';
import { Pressable, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  MapPin,
  DollarSign,
  Tag,
  Calendar,
  Check,
  Hand,
  Truck,
  ChevronDown,
} from 'lucide-react-native';
import {
  SecondHandItem,
  ItemCategory,
  ItemCondition,
  TradeMethod,
  ItemStatus,
} from '@/types/community';
import { createItem } from '@/services/communityDataService';
import { usePublishLimit } from '@/hooks/useMembershipBenefit';
import { TitleBar } from '@/components/TitleBar';

interface SecondHandPublishScreenProps {
  navigation: any;
}

/**
 * 邻里闲物发布页面
 */
export const SecondHandPublishScreen: React.FC<SecondHandPublishScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

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
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [usageDuration, setUsageDuration] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 交易信息
  const [tradeMethods, setTradeMethods] = useState<TradeMethod[]>([TradeMethod.PICKUP]);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');

  // 状态
  const [loading, setLoading] = useState(false);

  // 发布次数限制 Hook
  const {
    canPublish,
    remaining: publishRemaining,
    limit: publishLimit,
    isUnlimited: isPublishUnlimited,
    recordUsage: recordPublishUsage,
  } = usePublishLimit();

  // 显示发布限制升级提示
  const showPublishLimitAlert = useCallback(() => {
    Alert.alert(
      '本月发布次数已用完',
      `免费用户每月可发布${publishLimit}次内容。升级会员可无限发布！`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '升级会员',
          onPress: () => navigation.navigate('MembershipCenter' as never),
        },
      ]
    );
  }, [publishLimit, navigation]);

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
    { label: '99新', value: ItemCondition.LIKE_NEW },
    { label: '95新', value: ItemCondition.EXCELLENT },
    { label: '9成新', value: ItemCondition.GOOD },
    { label: '8成新', value: ItemCondition.FAIR },
    { label: '有痕迹', value: ItemCondition.USED },
  ];

  // 交易方式切换
  const handleTradeMethodToggle = (method: TradeMethod) => {
    if (tradeMethods.includes(method)) {
      setTradeMethods(tradeMethods.filter((m) => m !== method));
    } else {
      setTradeMethods([...tradeMethods, method]);
    }
  };

  // 日期选择处理
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setPurchaseDate(selectedDate);
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  // 格式化日期显示
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年${month}月`;
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

    // 检查发布次数限制
    if (!canPublish) {
      showPublishLimitAlert();
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
        purchaseTime: purchaseDate ? formatDate(purchaseDate) : undefined,
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

      // 记录发布次数
      await recordPublishUsage();

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

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 标题栏 */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="发布闲置物品" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack padding="$2.5" gap="$2">
          {/* 基本信息卡片 */}
          <View
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              基本信息
            </Text>

            {/* 商品标题 */}
            <YStack marginBottom="$2">
              <Text fontSize="$3" color="$color12" marginBottom="$1">
                商品标题
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="例如：九成新血压计，品牌欧姆龙"
                backgroundColor="$color4"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
                fontSize="$3"
                maxLength={50}
              />
            </YStack>

            {/* 商品描述 */}
            <YStack marginBottom="$2">
              <Text fontSize="$3" color="$color12" marginBottom="$1">
                商品描述
              </Text>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="详细描述商品的功能、外观、使用情况等"
                backgroundColor="$color4"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
                fontSize="$3"
                numberOfLines={5}
                maxLength={500}
              />
            </YStack>

            {/* 商品分类 */}
            <YStack marginBottom="$2">
              <Text fontSize="$3" color="$color12" marginBottom="$1">
                商品分类
              </Text>
              <XStack flexWrap="wrap" gap="$1.5">
                {categoryOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setCategory(option.value)}
                  >
                    <View
                      backgroundColor={category === option.value ? primaryColor : '$color4'}
                      paddingHorizontal="$2"
                      paddingVertical="$1.5"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={category === option.value ? primaryColor : '$color5'}
                    >
                      <Text
                        fontSize="$3"
                        color={category === option.value ? 'white' : '$color12'}
                        fontWeight={category === option.value ? '500' : '400'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* 商品成色 */}
            <YStack>
              <Text fontSize="$3" color="$color12" marginBottom="$1">
                商品成色
              </Text>
              <XStack flexWrap="wrap" gap="$1.5">
                {conditionOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setCondition(option.value)}
                  >
                    <View
                      backgroundColor={condition === option.value ? successColor : '$color4'}
                      paddingHorizontal="$2"
                      paddingVertical="$1.5"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={condition === option.value ? successColor : '$color5'}
                    >
                      <Text
                        fontSize="$3"
                        color={condition === option.value ? 'white' : '$color12'}
                        fontWeight={condition === option.value ? '500' : '400'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>
          </View>

          {/* 价格信息卡片 */}
          <View
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              价格信息
            </Text>

            {/* 免费赠送开关 */}
            <Pressable onPress={() => setIsFree(!isFree)}>
              <XStack
                gap="$1.5"
                alignItems="center"
                backgroundColor="$color4"
                padding="$2"
                borderRadius="$4"
                borderWidth={1}
                borderColor={isFree ? successColor : '$color5'}
                marginBottom="$2"
              >
                <Tag size={18} color={isFree ? successColor : color10} />
                <Text
                  flex={1}
                  fontSize="$3"
                  color={isFree ? successColor : '$color12'}
                  fontWeight={isFree ? '600' : '400'}
                >
                  免费赠送
                </Text>
                <View
                  width={20}
                  height={20}
                  borderRadius={10}
                  borderWidth={2}
                  borderColor={isFree ? successColor : '$color5'}
                  backgroundColor={isFree ? successColor : 'transparent'}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isFree && <Check size={12} color="white" />}
                </View>
              </XStack>
            </Pressable>

            {/* 价格输入 */}
            {!isFree && (
              <>
                <YStack marginBottom="$2">
                  <XStack gap="$1" alignItems="center" marginBottom="$1">
                    <DollarSign size={14} color={color10} />
                    <Text fontSize="$3" color="$color12">
                      出售价格
                    </Text>
                  </XStack>
                  <XStack gap="$1.5" alignItems="center">
                    <Text fontSize="$4" color="$color12" fontWeight="600">
                      ¥
                    </Text>
                    <Input
                      value={currentPrice}
                      onChangeText={setCurrentPrice}
                      placeholder="请输入价格"
                      keyboardType="numeric"
                      backgroundColor="$color4"
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      paddingHorizontal="$2"
                      paddingVertical="$2"
                      fontSize="$3"
                      flex={1}
                    />
                  </XStack>
                </YStack>

                <YStack marginBottom="$2">
                  <Text fontSize="$3" color="$color12" marginBottom="$1">
                    原价（可选）
                  </Text>
                  <XStack gap="$1.5" alignItems="center">
                    <Text fontSize="$4" color="$color12" fontWeight="600">
                      ¥
                    </Text>
                    <Input
                      value={originalPrice}
                      onChangeText={setOriginalPrice}
                      placeholder="购买时的价格"
                      keyboardType="numeric"
                      backgroundColor="$color4"
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      paddingHorizontal="$2"
                      paddingVertical="$2"
                      fontSize="$3"
                      flex={1}
                    />
                  </XStack>
                </YStack>

                {/* 可议价开关 */}
                <Pressable onPress={() => setIsNegotiable(!isNegotiable)}>
                  <XStack gap="$1.5" alignItems="center">
                    <View
                      width={20}
                      height={20}
                      borderRadius={10}
                      borderWidth={2}
                      borderColor={isNegotiable ? primaryColor : '$color5'}
                      backgroundColor={isNegotiable ? primaryColor : 'transparent'}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {isNegotiable && <Check size={12} color="white" />}
                    </View>
                    <Text fontSize="$3" color="$color12">
                      价格可议
                    </Text>
                  </XStack>
                </Pressable>
              </>
            )}
          </View>

          {/* 使用情况卡片 */}
          <View
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              使用情况（可选）
            </Text>

            {/* 购买时间 - 日期选择器 */}
            <YStack marginBottom="$2">
              <XStack gap="$1" alignItems="center" marginBottom="$1">
                <Calendar size={14} color={color10} />
                <Text fontSize="$3" color="$color12">
                  购买时间
                </Text>
              </XStack>

              {Platform.OS === 'web' ? (
                // Web端使用原生input type="month"
                <View
                  backgroundColor="$color4"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$4"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                >
                  <input
                    type="month"
                    value={purchaseDate ? `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [year, month] = e.target.value.split('-');
                        setPurchaseDate(new Date(parseInt(year), parseInt(month) - 1, 1));
                      } else {
                        setPurchaseDate(null);
                      }
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: 14,
                      color: purchaseDate ? color12 : color10,
                      width: '100%',
                      outline: 'none',
                    }}
                    placeholder="选择购买月份"
                  />
                </View>
              ) : (
                // 移动端使用原生日期选择器
                <>
                  <Pressable onPress={() => setShowDatePicker(true)}>
                    <View
                      backgroundColor="$color4"
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$4"
                      paddingHorizontal="$2"
                      paddingVertical="$2"
                    >
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$3" color={purchaseDate ? '$color12' : '$color10'}>
                          {purchaseDate ? formatDate(purchaseDate) : '选择购买月份'}
                        </Text>
                        <ChevronDown size={16} color={color10} />
                      </XStack>
                    </View>
                  </Pressable>

                  {showDatePicker && (
                    <DateTimePicker
                      value={purchaseDate || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            </YStack>

            {/* 使用时长 */}
            <YStack>
              <Text fontSize="$3" color="$color12" marginBottom="$1">
                使用时长
              </Text>
              <Input
                value={usageDuration}
                onChangeText={setUsageDuration}
                placeholder="例如：使用1年"
                backgroundColor="$color4"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
                fontSize="$3"
              />
            </YStack>
          </View>

          {/* 交易信息卡片 */}
          <View
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              交易信息
            </Text>

            {/* 交易方式 */}
            <YStack marginBottom="$2">
              <Text fontSize="$3" color="$color12" marginBottom="$1">
                交易方式（可多选）
              </Text>
              <XStack gap="$2">
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => handleTradeMethodToggle(TradeMethod.PICKUP)}
                >
                  <View
                    flex={1}
                    backgroundColor={
                      tradeMethods.includes(TradeMethod.PICKUP) ? primaryColor : '$color4'
                    }
                    paddingVertical="$2"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor={
                      tradeMethods.includes(TradeMethod.PICKUP) ? primaryColor : '$color5'
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <XStack gap="$1" alignItems="center">
                      <Hand
                        size={16}
                        color={tradeMethods.includes(TradeMethod.PICKUP) ? 'white' : color10}
                      />
                      <Text
                        fontSize="$3"
                        color={tradeMethods.includes(TradeMethod.PICKUP) ? 'white' : '$color12'}
                        fontWeight="500"
                      >
                        同城自取
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => handleTradeMethodToggle(TradeMethod.DELIVERY)}
                >
                  <View
                    flex={1}
                    backgroundColor={
                      tradeMethods.includes(TradeMethod.DELIVERY) ? primaryColor : '$color4'
                    }
                    paddingVertical="$2"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor={
                      tradeMethods.includes(TradeMethod.DELIVERY) ? primaryColor : '$color5'
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <XStack gap="$1" alignItems="center">
                      <Truck
                        size={16}
                        color={tradeMethods.includes(TradeMethod.DELIVERY) ? 'white' : color10}
                      />
                      <Text
                        fontSize="$3"
                        color={tradeMethods.includes(TradeMethod.DELIVERY) ? 'white' : '$color12'}
                        fontWeight="500"
                      >
                        快递邮寄
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </XStack>
            </YStack>

            {/* 交易地址 */}
            <YStack>
              <XStack gap="$1" alignItems="center" marginBottom="$1">
                <MapPin size={14} color={color10} />
                <Text fontSize="$3" color="$color12">
                  交易地址
                </Text>
              </XStack>
              <Input
                value={address}
                onChangeText={setAddress}
                placeholder="详细地址"
                backgroundColor="$color4"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
                fontSize="$3"
                marginBottom="$1.5"
              />
              <Input
                value={district}
                onChangeText={setDistrict}
                placeholder="所在区域（如：南山区）"
                backgroundColor="$color4"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
                fontSize="$3"
              />
            </YStack>
          </View>

          {/* 发布提示 */}
          <View
            backgroundColor="rgba(107, 91, 123, 0.075)"
            padding="$2"
            borderRadius="$4"
          >
            <Text fontSize="$2" color="$color10" lineHeight={18}>
              发布后，您的商品会展示在邻里闲物市场。感兴趣的邻居可以联系您洽谈交易。
            </Text>
          </View>
        </YStack>
      </ScrollView>

      {/* 底部悬停发布按钮 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        paddingHorizontal="$2.5"
        paddingTop="$2"
        paddingBottom={insets.bottom + 10}
        borderTopWidth={1}
        borderTopColor="$color5"
      >
        <Pressable onPress={handlePublish} disabled={loading}>
          <View
            backgroundColor={loading ? '$color5' : primaryColor}
            paddingVertical="$3"
            borderRadius="$10"
            alignItems="center"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              {loading ? '发布中...' : '发布闲置物品'}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
