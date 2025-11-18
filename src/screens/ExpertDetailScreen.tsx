import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, View, ScrollView } from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Star,
  Award,
  MessageCircle,
  Shield,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Expert, ExpertLevel, ServiceType } from '@/types/community';
import { getExpertById, createConversation } from '@/services/communityDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExpertDetailScreenProps {
  navigation: any;
  route: {
    params: {
      expertId: string;
    };
  };
}

/**
 * 达人详情页
 * 展示达人完整资料、认证信息、服务详情、评价等
 */
export const ExpertDetailScreen: React.FC<ExpertDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { expertId } = route.params;
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadExpertDetail();
  }, [expertId]);

  const loadExpertDetail = async () => {
    try {
      setLoading(true);
      const expertData = await getExpertById(expertId);
      if (expertData) {
        setExpert(expertData);
      }
    } catch (error) {
      console.error('加载达人详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    console.log('分享达人:', expertId);
  };

  const handleContactExpert = async () => {
    if (!expert) return;
    const conversation = await createConversation(expert.userId, 'expert', expertId);
    navigation.navigate('Chat', { conversationId: conversation.id });
  };

  const handleBookService = () => {
    console.log('预约服务:', expertId);
  };

  const getLevelLabel = (level: ExpertLevel): string => {
    const labels: { [key in ExpertLevel]: string } = {
      [ExpertLevel.ROOKIE]: '新手达人',
      [ExpertLevel.QUALITY]: '优质达人',
      [ExpertLevel.GOLD]: '金牌达人',
      [ExpertLevel.HALL_OF_FAME]: '殿堂级大师',
    };
    return labels[level];
  };

  const getLevelColor = (level: ExpertLevel): string => {
    const colors: { [key in ExpertLevel]: string } = {
      [ExpertLevel.ROOKIE]: COLORS.textSecondary,
      [ExpertLevel.QUALITY]: COLORS.primary,
      [ExpertLevel.GOLD]: COLORS.warning,
      [ExpertLevel.HALL_OF_FAME]: COLORS.error,
    };
    return colors[level];
  };

  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '陪诊',
      [ServiceType.ACCOMPANY_CARE]: '陪护',
      [ServiceType.ACCOMPANY_CHAT]: '陪聊',
      [ServiceType.HOUSEKEEPING]: '家政',
      [ServiceType.MEAL_DELIVERY]: '配餐',
      [ServiceType.SHOPPING]: '代购',
      [ServiceType.TRANSPORT]: '接送',
      [ServiceType.NURSING]: '护理',
      [ServiceType.REHABILITATION]: '康复',
      [ServiceType.PSYCHOLOGICAL]: '心理咨询',
      [ServiceType.NUTRITION]: '营养指导',
      [ServiceType.FITNESS]: '健身指导',
      [ServiceType.MASSAGE]: '推拿按摩',
      [ServiceType.TEACHING]: '技能教学',
      [ServiceType.REPAIR]: '维修',
      [ServiceType.OTHER]: '其他',
    };
    return labels[type] || type;
  };

  if (loading || !expert) {
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
      {/* 顶部导航栏（透明覆盖在Banner上） */}
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        paddingTop="$3"
        paddingHorizontal="$4"
        paddingBottom="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={handleBack}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="rgba(0, 0, 0, 0.4)"
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="rgba(0, 0, 0, 0.4)"
              justifyContent="center"
              alignItems="center"
            >
              <Share2 size={18} color="white" />
            </View>
          </TouchableOpacity>
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 顶部Banner区域 */}
        <View style={{ width: SCREEN_WIDTH, height: 200, position: 'relative' }}>
          {/* 背景图（使用第一张服务展示图或默认渐变） */}
          {expert.showcaseImages && expert.showcaseImages.length > 0 ? (
            <Image
              source={{ uri: expert.showcaseImages[0] }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bannerImage, { backgroundColor: COLORS.primary }]} />
          )}

          {/* 渐变遮罩 */}
          <View style={styles.bannerOverlay} />

          {/* 头像和基本信息 */}
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Text fontSize={64}>{expert.avatar || '👤'}</Text>

              {/* 等级徽章 */}
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(expert.level) }]}>
                <Award size={14} color="white" />
              </View>
            </View>

            <YStack alignItems="center" marginTop="$3">
              <XStack space="$2" alignItems="center" marginBottom="$1">
                <Text fontSize="$7" fontWeight="700" color="white">
                  {expert.name}
                </Text>
                {expert.realNameVerified && (
                  <View
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor={COLORS.primary}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CheckCircle size={12} color="white" />
                  </View>
                )}
              </XStack>

              <View
                backgroundColor={`${getLevelColor(expert.level)}CC`}
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$3"
                marginBottom="$2"
              >
                <Text fontSize="$3" color="white" fontWeight="600">
                  {getLevelLabel(expert.level)}
                </Text>
              </View>

              <XStack space="$1" alignItems="center">
                <MapPin size={14} color="white" />
                <Text fontSize="$3" color="white">
                  服务区域: {expert.serviceArea.join('、')}
                </Text>
              </XStack>
            </YStack>
          </View>
        </View>

        {/* 认证信息卡片 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <XStack space="$2" alignItems="center" marginBottom="$3">
            <Shield size={20} color={COLORS.primary} />
            <Text fontSize="$5" fontWeight="600" color="$text">
              认证信息
            </Text>
          </XStack>

          <XStack space="$4">
            <XStack space="$2" alignItems="center">
              <Text fontSize="$5">
                {expert.realNameVerified ? '🏅' : '⚪'}
              </Text>
              <Text
                fontSize="$3"
                color={expert.realNameVerified ? '$text' : '$textSecondary'}
              >
                实名认证
              </Text>
            </XStack>

            <XStack space="$2" alignItems="center">
              <CheckCircle
                size={18}
                color={expert.skillVerified ? COLORS.success : COLORS.textSecondary}
              />
              <Text
                fontSize="$3"
                color={expert.skillVerified ? COLORS.success : '$textSecondary'}
              >
                技能认证
              </Text>
            </XStack>
          </XStack>
        </View>

        {/* 服务数据统计 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <XStack justifyContent="space-around">
            <YStack alignItems="center">
              <XStack space="$1" alignItems="center" marginBottom="$1">
                <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                <Text fontSize="$5" fontWeight="700" color="$text">
                  {expert.rating.toFixed(1)}
                </Text>
              </XStack>
              <Text fontSize="$2" color="$textSecondary">
                评分
              </Text>
            </YStack>

            <View width={1} backgroundColor="$borderColor" />

            <YStack alignItems="center">
              <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
                {expert.completedOrders}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                完成订单
              </Text>
            </YStack>

            <View width={1} backgroundColor="$borderColor" />

            <YStack alignItems="center">
              <Text fontSize="$5" fontWeight="700" color={COLORS.success} marginBottom="$1">
                {expert.goodReviewRate}%
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                好评率
              </Text>
            </YStack>

            <View width={1} backgroundColor="$borderColor" />

            <YStack alignItems="center">
              <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
                {expert.responseTime}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                响应时间
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* 个人介绍 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
            个人介绍
          </Text>
          <Text fontSize="$3" color="$text" lineHeight={22}>
            {expert.introduction}
          </Text>
        </View>

        {/* 技能描述 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
            专业技能
          </Text>
          <Text fontSize="$3" color="$text" lineHeight={22}>
            {expert.skillDescription}
          </Text>
        </View>

        {/* 服务类型和价格 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
            服务项目及价格
          </Text>

          <YStack space="$3">
            {expert.serviceTypes.map((serviceType, index) => {
              const price = expert.pricing[serviceType];
              return (
                <XStack
                  key={index}
                  justifyContent="space-between"
                  alignItems="center"
                  padding="$3"
                  backgroundColor="$background"
                  borderRadius="$3"
                >
                  <Text fontSize="$4" color="$text" fontWeight="500">
                    {getServiceTypeLabel(serviceType)}
                  </Text>
                  {price && (
                    <XStack space="$1" alignItems="baseline">
                      <Text fontSize="$5" fontWeight="700" color={COLORS.error}>
                        ¥{price.basePrice}
                      </Text>
                      <Text fontSize="$3" color="$textSecondary">
                        /{price.unit}
                      </Text>
                    </XStack>
                  )}
                </XStack>
              );
            })}
          </YStack>
        </View>

        {/* 服务展示 */}
        {expert.showcaseImages && expert.showcaseImages.length > 0 && (
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
              服务展示
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {expert.showcaseImages.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImageIndex(index)}>
                  <View
                    width={160}
                    height={120}
                    borderRadius="$3"
                    overflow="hidden"
                    backgroundColor="$background"
                  >
                    <Image
                      source={{ uri: image }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 资质证书 */}
        {expert.certificates && expert.certificates.length > 0 && (
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
              资质证书
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {expert.certificates.map((cert, index) => (
                <View
                  key={index}
                  width={140}
                  height={100}
                  borderRadius="$3"
                  overflow="hidden"
                  backgroundColor="$background"
                >
                  <Image
                    source={{ uri: cert }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 徽章展示 */}
        {expert.badges && expert.badges.length > 0 && (
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
              荣誉徽章
            </Text>

            <XStack flexWrap="wrap" gap="$2">
              {expert.badges.map((badge, index) => (
                <View
                  key={index}
                  backgroundColor={`${COLORS.warning}20`}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={`${COLORS.warning}40`}
                >
                  <XStack space="$1" alignItems="center">
                    <Award size={14} color={COLORS.warning} />
                    <Text fontSize="$3" color={COLORS.warning} fontWeight="600">
                      {badge}
                    </Text>
                  </XStack>
                </View>
              ))}
            </XStack>
          </View>
        )}

        {/* 服务保障 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <XStack space="$2" alignItems="center" marginBottom="$3">
            <TrendingUp size={20} color={COLORS.primary} />
            <Text fontSize="$5" fontWeight="600" color="$text">
              服务保障
            </Text>
          </XStack>

          <YStack space="$2">
            <XStack space="$2" alignItems="center">
              <Text fontSize="$3" color={COLORS.success}>✓</Text>
              <Text fontSize="$3" color="$text">
                平台认证达人，资质齐全可查
              </Text>
            </XStack>
            <XStack space="$2" alignItems="center">
              <Text fontSize="$3" color={COLORS.success}>✓</Text>
              <Text fontSize="$3" color="$text">
                {expert.completedOrders}+ 服务经验，客户好评率 {expert.goodReviewRate}%
              </Text>
            </XStack>
            <XStack space="$2" alignItems="center">
              <Text fontSize="$3" color={COLORS.success}>✓</Text>
              <Text fontSize="$3" color="$text">
                平均 {expert.responseTime} 响应，服务及时高效
              </Text>
            </XStack>
            <XStack space="$2" alignItems="center">
              <Text fontSize="$3" color={COLORS.success}>✓</Text>
              <Text fontSize="$3" color="$text">
                平台担保交易，服务质量有保障
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* 在线状态 */}
        <View backgroundColor="white" padding="$4" marginBottom="$2">
          <XStack space="$2" alignItems="center">
            <View
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={expert.isOnline ? COLORS.success : COLORS.textSecondary}
            />
            <Text fontSize="$3" color="$textSecondary">
              {expert.isOnline ? '在线接单中' : '当前离线'}
            </Text>
          </XStack>
        </View>

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
          {/* 联系达人 */}
          <TouchableOpacity style={{ flex: 1 }} onPress={handleContactExpert}>
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
                <MessageCircle size={18} color={COLORS.text} />
                <Text fontSize="$4" color="$text" fontWeight="600">
                  咨询
                </Text>
              </XStack>
            </View>
          </TouchableOpacity>

          {/* 预约服务 */}
          <TouchableOpacity style={{ flex: 1 }} onPress={handleBookService}>
            <View
              flex={1}
              backgroundColor={COLORS.primary}
              borderRadius="$3"
              paddingVertical="$3"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                预约服务
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    position: 'relative',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});
