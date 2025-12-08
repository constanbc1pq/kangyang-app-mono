/**
 * MySecondHandScreen 我的闲物页面
 * 显示用户发布的闲置物品和收藏的物品
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Package,
  Heart,
  Trash2,
  MapPin,
  Eye,
  MessageCircle,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SecondHandItem, ItemCondition, ItemStatus } from '@/types/community';
import { getSecondHandItems, deleteItem } from '@/services/communityDataService';
import { ConfirmModal } from '@/components/ConfirmModal';
import { TitleBar } from '@/components/TitleBar';

interface MySecondHandScreenProps {
  navigation: any;
}

type TabType = 'published' | 'favorites';

/**
 * 我的闲物页面
 */
export const MySecondHandScreen: React.FC<MySecondHandScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [activeTab, setActiveTab] = useState<TabType>('published');
  const [publishedItems, setPublishedItems] = useState<SecondHandItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<SecondHandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 删除确认弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 页面聚焦时加载数据
  useFocusEffect(
    useCallback(() => {
      loadMyItems();
    }, [])
  );

  const loadMyItems = async () => {
    try {
      setLoading(true);
      const allItems = await getSecondHandItems({});

      // 筛选我发布的物品（sellerId 为 'user_current'）
      const myPublished = allItems.filter(item => item.sellerId === 'user_current');
      setPublishedItems(myPublished);

      // 筛选收藏的物品（这里模拟，实际需要从收藏服务获取）
      // TODO: 实现真实的收藏功能
      setFavoriteItems([]);
    } catch (error) {
      console.error('加载我的闲物失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMyItems();
    setRefreshing(false);
  };

  const handleItemPress = (itemId: string) => {
    navigation.navigate('SecondHandDetail', { itemId });
  };

  // 打开删除确认弹窗
  const handleOpenDeleteModal = (itemId: string, itemTitle: string) => {
    setDeleteTarget({ id: itemId, title: itemTitle });
    setShowDeleteModal(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteItem(deleteTarget.id);
      await loadMyItems();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('删除物品失败:', error);
    } finally {
      setDeleting(false);
    }
  };

  // 关闭删除弹窗
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const currentItems = activeTab === 'published' ? publishedItems : favoriteItems;

  // 获取成色标签
  const getConditionLabel = (condition: ItemCondition): string => {
    const labels: { [key in ItemCondition]: string } = {
      [ItemCondition.NEW]: '全新',
      [ItemCondition.LIKE_NEW]: '99新',
      [ItemCondition.EXCELLENT]: '95新',
      [ItemCondition.GOOD]: '9成新',
      [ItemCondition.FAIR]: '8成新',
      [ItemCondition.USED]: '有痕迹',
    };
    return labels[condition] || '未知';
  };

  // 获取状态标签
  const getStatusLabel = (status: ItemStatus): string => {
    const labels: { [key in ItemStatus]: string } = {
      [ItemStatus.AVAILABLE]: '在售中',
      [ItemStatus.RESERVED]: '已预定',
      [ItemStatus.SOLD]: '已售出',
      [ItemStatus.REMOVED]: '已下架',
    };
    return labels[status] || '未知';
  };

  // 获取状态颜色
  const getStatusColor = (status: ItemStatus): string | undefined => {
    switch (status) {
      case ItemStatus.AVAILABLE:
        return successColor;
      case ItemStatus.RESERVED:
        return primaryColor;
      case ItemStatus.SOLD:
        return color10;
      case ItemStatus.REMOVED:
        return errorColor;
      default:
        return color10;
    }
  };

  // 渲染物品卡片
  const renderItemCard = (item: SecondHandItem) => (
    <View
      key={item.id}
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.08}
      elevation={2}
      borderWidth={1}
      borderColor="$color5"
    >
      {/* 顶部：状态标签 + 删除按钮 */}
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
        <XStack flexWrap="wrap" gap="$1.5" flex={1}>
          {/* 状态标签 */}
          <View
            backgroundColor={getStatusColor(item.status)}
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <Text fontSize={10} color="white" fontWeight="500">
              {getStatusLabel(item.status)}
            </Text>
          </View>

          {/* 成色标签 */}
          <View
            backgroundColor="$color4"
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <Text fontSize={10} color="$color10">
              {getConditionLabel(item.condition)}
            </Text>
          </View>

          {/* 免费标签 */}
          {item.isFree && (
            <View
              backgroundColor={successColor}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color="white" fontWeight="500">
                免费
              </Text>
            </View>
          )}
        </XStack>

        {/* 删除按钮（仅在发布列表显示） */}
        {activeTab === 'published' && (
          <Pressable onPress={() => handleOpenDeleteModal(item.id, item.title)}>
            <View
              backgroundColor="$color4"
              width={32}
              height={32}
              borderRadius={16}
              justifyContent="center"
              alignItems="center"
            >
              <Trash2 size={16} color={errorColor} />
            </View>
          </Pressable>
        )}
      </XStack>

      {/* 可点击区域 */}
      <Pressable onPress={() => handleItemPress(item.id)}>
        <XStack gap="$2">
          {/* 商品图片占位 */}
          <View
            width={80}
            height={80}
            borderRadius="$4"
            backgroundColor="$color4"
            justifyContent="center"
            alignItems="center"
          >
            <Package size={32} color={color10} />
          </View>

          {/* 商品信息 */}
          <YStack flex={1}>
            {/* 标题 */}
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1" numberOfLines={2}>
              {item.title}
            </Text>

            {/* 价格 */}
            <XStack gap="$1.5" alignItems="baseline" marginBottom="$1">
              {item.isFree ? (
                <Text fontSize="$4" fontWeight="700" color={successColor}>
                  免费赠送
                </Text>
              ) : (
                <>
                  <Text fontSize="$4" fontWeight="700" color={errorColor}>
                    ¥{item.currentPrice}
                  </Text>
                  {item.originalPrice && (
                    <Text
                      fontSize="$2"
                      color="$color10"
                      textDecorationLine="line-through"
                    >
                      ¥{item.originalPrice}
                    </Text>
                  )}
                </>
              )}
            </XStack>

            {/* 位置 */}
            <XStack gap="$1" alignItems="center">
              <MapPin size={12} color={color10} />
              <Text fontSize="$2" color="$color10">
                {item.location.district}
              </Text>
            </XStack>
          </YStack>
        </XStack>

        {/* 底部统计信息 */}
        <XStack justifyContent="flex-end" alignItems="center" marginTop="$1.5" gap="$4">
          {/* 浏览量 */}
          <XStack gap="$1" alignItems="center">
            <Eye size={12} color={color10} />
            <Text fontSize="$2" color="$color10">
              {item.views}次浏览
            </Text>
          </XStack>

          {/* 收藏量 */}
          <XStack gap="$1" alignItems="center">
            <Heart size={12} color={color10} />
            <Text fontSize="$2" color="$color10">
              {item.favorites}人收藏
            </Text>
          </XStack>

          {/* 发布时间 */}
          <Text fontSize="$2" color="$color10">
            {item.publishTime}
          </Text>
        </XStack>
      </Pressable>
    </View>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <Text fontSize={48} marginBottom="$2">
          {activeTab === 'published' ? '📦' : '💜'}
        </Text>
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          {activeTab === 'published' ? '暂无发布的闲置物品' : '暂无收藏的物品'}
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {activeTab === 'published'
            ? '把闲置物品分享给邻居吧'
            : '浏览闲物市场，收藏喜欢的物品'}
        </Text>
        {activeTab === 'published' && (
          <Pressable onPress={() => navigation.navigate('SecondHandPublish' as never)}>
            <View
              marginTop="$2"
              backgroundColor={primaryColor}
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius="$10"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                发布闲置
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 标准 TitleBar */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="我的闲物" />
      </View>

      {/* Tab 切换 */}
      <View backgroundColor="$color2" paddingHorizontal="$2.5" paddingBottom="$2">
        <View
          backgroundColor="$color4"
          borderRadius="$10"
          padding="$0.5"
        >
          <XStack>
            <Pressable onPress={() => setActiveTab('published')} style={{ flex: 1 }}>
              <View
                backgroundColor={activeTab === 'published' ? '$color2' : 'transparent'}
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <XStack gap="$1.5" alignItems="center">
                  <Package size={16} color={activeTab === 'published' ? primaryColor : color10} />
                  <Text
                    fontSize="$3"
                    fontWeight={activeTab === 'published' ? '600' : '400'}
                    color={activeTab === 'published' ? primaryColor : '$color10'}
                  >
                    我发布的 ({publishedItems.length})
                  </Text>
                </XStack>
              </View>
            </Pressable>
            <Pressable onPress={() => setActiveTab('favorites')} style={{ flex: 1 }}>
              <View
                backgroundColor={activeTab === 'favorites' ? '$color2' : 'transparent'}
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <XStack gap="$1.5" alignItems="center">
                  <Heart size={16} color={activeTab === 'favorites' ? primaryColor : color10} />
                  <Text
                    fontSize="$3"
                    fontWeight={activeTab === 'favorites' ? '600' : '400'}
                    color={activeTab === 'favorites' ? primaryColor : '$color10'}
                  >
                    我的收藏 ({favoriteItems.length})
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </View>
      </View>

      {/* 物品列表 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ padding: 10 }}
      >
        {currentItems.length === 0 ? (
          renderEmpty()
        ) : (
          <YStack gap="$2">
            {currentItems.map(item => renderItemCard(item))}
          </YStack>
        )}
      </ScrollView>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="删除物品"
        message={`确定要删除「${deleteTarget?.title || ''}」吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        type="danger"
        loading={deleting}
      />
    </View>
  );
};
