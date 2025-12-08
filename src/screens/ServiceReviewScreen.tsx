import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  TextArea,
} from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {
  Star,
  Camera,
  X,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { TitleBar } from '@/components/TitleBar';
import { submitServiceReview } from '@/services/communityDataService';

interface ServiceReviewScreenProps {
  navigation: any;
  route: {
    params: {
      orderId: string;
      expertId: string;
      expertName: string;
      expertAvatar: string;
      serviceTitle: string;
    };
  };
}

interface ReviewTag {
  id: string;
  label: string;
  icon: string;
}

const REVIEW_TAGS: ReviewTag[] = [
  { id: 'professional', label: '专业', icon: '👔' },
  { id: 'on-time', label: '准时', icon: '⏰' },
  { id: 'friendly', label: '友好', icon: '😊' },
  { id: 'skilled', label: '技术好', icon: '🛠️' },
  { id: 'clean', label: '干净整洁', icon: '✨' },
  { id: 'patient', label: '耐心', icon: '🙏' },
  { id: 'careful', label: '细心', icon: '🔍' },
  { id: 'recommend', label: '值得推荐', icon: '👍' },
];

/**
 * 服务评价页面
 * 用户在服务完成后对达人进行评价
 */
export const ServiceReviewScreen: React.FC<ServiceReviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { orderId, expertId, expertName, expertAvatar, serviceTitle } = route.params;

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    if (reviewText.trim() || selectedTags.length > 0) {
      Alert.alert(
        '放弃评价',
        '确定要放弃本次评价吗？',
        [
          { text: '继续编辑', style: 'cancel' },
          { text: '放弃', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleTagPress = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      if (selectedTags.length >= 5) {
        Alert.alert('提示', '最多选择5个标签');
        return;
      }
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAddPhoto = () => {
    if (photos.length >= 9) {
      Alert.alert('提示', '最多上传9张图片');
      return;
    }
    // TODO: 实现图片选择
    Alert.alert('功能开发中', '图片上传功能正在开发中');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (reviewText.trim().length < 10) {
      Alert.alert('提示', '请至少输入10个字的评价');
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        rating,
        tags: selectedTags,
        comment: reviewText.trim(),
        images: photos,
      };

      // 提交评价并更新订单
      const updatedOrder = await submitServiceReview(orderId, reviewData);

      if (updatedOrder) {
        Alert.alert(
          '评价成功',
          '感谢您的评价！',
          [
            {
              text: '确定',
              onPress: () => {
                // 返回到订单详情或订单列表
                navigation.navigate('MyOrders');
              },
            },
          ]
        );
      } else {
        Alert.alert('提交失败', '订单不存在');
      }
    } catch (error) {
      console.error('提交评价失败:', error);
      Alert.alert('提交失败', '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1:
        return '非常不满意';
      case 2:
        return '不满意';
      case 3:
        return '一般';
      case 4:
        return '满意';
      case 5:
        return '非常满意';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TitleBar title="评价服务" onBack={handleBack} />

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
      >
        <View padding="$4">
          {/* 达人信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <XStack space="$3" alignItems="center">
              <View
                width={56}
                height={56}
                borderRadius={28}
                backgroundColor={`${COLORS.primary}20`}
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
              >
                <Text fontSize={32}>{expertAvatar}</Text>
              </View>
              <YStack flex={1}>
                <Text fontSize="$5" fontWeight="600" color="$text">
                  {expertName}
                </Text>
                <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                  {serviceTitle}
                </Text>
              </YStack>
            </XStack>
          </Card>

          {/* 评分区域 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <YStack alignItems="center" space="$3">
              <Text fontSize="$4" color="$text" fontWeight="600">
                请为本次服务打分
              </Text>

              <XStack space="$2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleStarPress(star)}
                  >
                    <Star
                      size={40}
                      color={star <= rating ? COLORS.warning : COLORS.textSecondary}
                      fill={star <= rating ? COLORS.warning : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </XStack>

              <Text fontSize="$4" color={COLORS.warning} fontWeight="600">
                {getRatingText(rating)}
              </Text>
            </YStack>
          </Card>

          {/* 评价标签 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
              选择标签（最多5个）
            </Text>

            <View flexDirection="row" flexWrap="wrap" gap="$2">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => handleTagPress(tag.id)}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$6"
                      backgroundColor={isSelected ? `${COLORS.primary}20` : '$background'}
                      borderWidth={1}
                      borderColor={isSelected ? COLORS.primary : '$borderColor'}
                    >
                      <XStack space="$1" alignItems="center">
                        <Text fontSize="$3">{tag.icon}</Text>
                        <Text
                          fontSize="$3"
                          color={isSelected ? COLORS.primary : '$text'}
                          fontWeight={isSelected ? '600' : '400'}
                        >
                          {tag.label}
                        </Text>
                      </XStack>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* 详细评价 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
              详细评价（至少10字）
            </Text>

            <TextArea
              placeholder="分享您的服务体验，帮助其他用户做出更好的选择..."
              value={reviewText}
              onChangeText={setReviewText}
              minHeight={120}
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              fontSize="$4"
              color="$text"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={500}
            />

            <Text
              fontSize="$2"
              color="$textSecondary"
              textAlign="right"
              marginTop="$2"
            >
              {reviewText.length}/500
            </Text>
          </Card>

          {/* 上传图片 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$4" color="$text" fontWeight="600" marginBottom="$3">
              上传图片（选填，最多9张）
            </Text>

            <View flexDirection="row" flexWrap="wrap" gap="$2">
              {photos.map((photo, index) => (
                <View
                  key={index}
                  width={100}
                  height={100}
                  borderRadius="$3"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    source={{ uri: photo }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {photos.length < 9 && (
                <TouchableOpacity onPress={handleAddPhoto}>
                  <View
                    width={100}
                    height={100}
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderStyle="dashed"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="$background"
                  >
                    <Camera size={32} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                      上传图片
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </Card>

          {/* 提交按钮 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || reviewText.trim().length < 10}
          >
            <View
              backgroundColor={
                submitting || reviewText.trim().length < 10
                  ? COLORS.textSecondary
                  : COLORS.primary
              }
              borderRadius="$3"
              paddingVertical="$4"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                {submitting ? '提交中...' : '提交评价'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* 底部padding */}
          <View height={20} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
