/**
 * ExpertDetailScreen 达人详情页
 * 展示达人完整资料、认证信息、服务详情、评价等
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Image,
  Card,
  useTheme,
} from 'tamagui';
import {
  Pressable,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Share2,
  MapPin,
  Star,
  Award,
  MessageCircle,
  Shield,
  CheckCircle,
  TrendingUp,
  Briefcase,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
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
 */
export const ExpertDetailScreen: React.FC<ExpertDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const { expertId } = route.params;
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

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

  const handleContactExpert = async () => {
    if (!expert) return;
    const conversation = await createConversation(expert.userId, 'expert', expertId);
    // 导航到达人聊天页面，使用通用 ChatPage 组件
    navigation.navigate('ExpertChat', {
      expertId: expert.id,
      expertName: expert.name,
      conversationId: conversation.id,
    });
  };

  const handleBookService = () => {
    if (!expert) return;
    // 导航到预约服务页面
    navigation.navigate('ServiceBooking', {
      expertId: expert.id,
      expertName: expert.name,
      expertAvatar: expert.avatar,
      serviceTypes: expert.serviceTypes,
      pricing: expert.pricing,
    });
  };

  const handleShare = () => {
    console.log('分享达人:', expertId);
  };

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
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

  const getLevelColor = (level: ExpertLevel): string | undefined => {
    switch (level) {
      case ExpertLevel.ROOKIE:
        return color10;
      case ExpertLevel.QUALITY:
        return primaryColor;
      case ExpertLevel.GOLD:
        return warningColor;
      case ExpertLevel.HALL_OF_FAME:
        return errorColor;
      default:
        return color10;
    }
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

  // 渲染分享按钮（用于TitleBar右侧）
  const renderShareButton = () => (
    <Pressable onPress={handleShare}>
      <View
        width={36}
        height={36}
        borderRadius={18}
        backgroundColor="$color4"
        justifyContent="center"
        alignItems="center"
      >
        <Share2 size={18} color={color10} />
      </View>
    </Pressable>
  );

  // 渲染头部信息卡片
  const renderProfileCard = () => {
    if (!expert) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack gap="$2" alignItems="center">
          {/* 头像 */}
          <View position="relative">
            <View
              width={72}
              height={72}
              borderRadius={36}
              backgroundColor={`${primaryColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={36}>{expert.avatar || '👤'}</Text>
            </View>

            {/* 等级徽章 */}
            <View
              position="absolute"
              bottom={-2}
              right={-2}
              width={24}
              height={24}
              borderRadius={12}
              backgroundColor={getLevelColor(expert.level)}
              justifyContent="center"
              alignItems="center"
              borderWidth={2}
              borderColor="$color2"
            >
              <Award size={12} color="white" />
            </View>
          </View>

          {/* 基本信息 */}
          <YStack flex={1} gap="$1">
            <XStack gap="$1.5" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color="$color12">
                {expert.name}
              </Text>
              {expert.realNameVerified && (
                <View
                  width={18}
                  height={18}
                  borderRadius={9}
                  backgroundColor={successColor}
                  justifyContent="center"
                  alignItems="center"
                >
                  <CheckCircle size={10} color="white" />
                </View>
              )}
            </XStack>

            {/* 等级标签 */}
            <View alignSelf="flex-start">
              <View
                backgroundColor={`${getLevelColor(expert.level)}15`}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize="$2" color={getLevelColor(expert.level)} fontWeight="600">
                  {getLevelLabel(expert.level)}
                </Text>
              </View>
            </View>

            {/* 服务区域 */}
            <XStack gap="$1" alignItems="center">
              <MapPin size={12} color={color10} />
              <Text fontSize="$2" color="$color10" numberOfLines={1} flex={1}>
                {expert.serviceArea.join('、')}
              </Text>
            </XStack>

            {/* 在线状态 */}
            <XStack gap="$1" alignItems="center">
              <View
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor={expert.isOnline ? successColor : color10}
              />
              <Text fontSize="$2" color={expert.isOnline ? successColor : '$color10'}>
                {expert.isOnline ? '在线接单中' : '当前离线'}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Card>
    );
  };

  // 渲染认证信息卡片
  const renderCertification = () => {
    if (!expert) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack gap="$1.5" alignItems="center" marginBottom="$2">
          <Shield size={18} color={primaryColor} />
          <Text fontSize="$4" fontWeight="600" color="$color12">
            认证信息
          </Text>
        </XStack>

        <XStack gap="$4">
          <XStack gap="$1.5" alignItems="center">
            <Text fontSize={16}>
              {expert.realNameVerified ? '🏅' : '⚪'}
            </Text>
            <Text
              fontSize="$3"
              color={expert.realNameVerified ? '$color12' : '$color10'}
            >
              实名认证
            </Text>
          </XStack>

          <XStack gap="$1.5" alignItems="center">
            <CheckCircle
              size={16}
              color={expert.skillVerified ? successColor : color10}
            />
            <Text
              fontSize="$3"
              color={expert.skillVerified ? successColor : '$color10'}
            >
              技能认证
            </Text>
          </XStack>
        </XStack>
      </Card>
    );
  };

  // 渲染服务数据统计
  const renderStats = () => {
    if (!expert) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack justifyContent="space-around">
          <YStack alignItems="center">
            <XStack gap="$1" alignItems="center" marginBottom="$0.5">
              <Star size={14} color={warningColor} fill={warningColor} />
              <Text fontSize="$5" fontWeight="700" color="$color12">
                {expert.rating.toFixed(1)}
              </Text>
            </XStack>
            <Text fontSize="$2" color="$color10">
              评分
            </Text>
          </YStack>

          <View width={1} backgroundColor="$color5" />

          <YStack alignItems="center">
            <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$0.5">
              {expert.completedOrders}
            </Text>
            <Text fontSize="$2" color="$color10">
              完成订单
            </Text>
          </YStack>

          <View width={1} backgroundColor="$color5" />

          <YStack alignItems="center">
            <Text fontSize="$5" fontWeight="700" color={successColor} marginBottom="$0.5">
              {expert.goodReviewRate}%
            </Text>
            <Text fontSize="$2" color="$color10">
              好评率
            </Text>
          </YStack>

          <View width={1} backgroundColor="$color5" />

          <YStack alignItems="center">
            <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$0.5">
              {expert.responseTime}
            </Text>
            <Text fontSize="$2" color="$color10">
              响应时间
            </Text>
          </YStack>
        </XStack>
      </Card>
    );
  };

  // 渲染个人介绍
  const renderIntroduction = () => {
    if (!expert) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          个人介绍
        </Text>
        <Text fontSize="$3" color="$color12" lineHeight={22}>
          {expert.introduction}
        </Text>
      </Card>
    );
  };

  // 渲染专业技能
  const renderSkills = () => {
    if (!expert) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          专业技能
        </Text>
        <Text fontSize="$3" color="$color12" lineHeight={22}>
          {expert.skillDescription}
        </Text>
      </Card>
    );
  };

  // 渲染服务项目及价格
  const renderServices = () => {
    if (!expert) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          服务项目及价格
        </Text>

        <YStack gap="$2">
          {expert.serviceTypes.map((serviceType, index) => {
            const price = expert.pricing[serviceType];
            return (
              <View
                key={index}
                padding="$2"
                backgroundColor="$color4"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    {getServiceTypeLabel(serviceType)}
                  </Text>
                  {price && (
                    <XStack gap="$0.5" alignItems="baseline">
                      <Text fontSize="$4" fontWeight="700" color={errorColor}>
                        ¥{price.basePrice}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        /{price.unit}
                      </Text>
                    </XStack>
                  )}
                </XStack>
              </View>
            );
          })}
        </YStack>
      </Card>
    );
  };

  // 渲染服务展示
  const renderShowcase = () => {
    if (!expert || !expert.showcaseImages || expert.showcaseImages.length === 0) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          服务展示
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <XStack gap="$2">
            {expert.showcaseImages.map((image, index) => (
              <View
                key={index}
                width={140}
                height={100}
                borderRadius="$4"
                overflow="hidden"
                backgroundColor="$color4"
              >
                {!imageErrors[`showcase_${index}`] ? (
                  <Image
                    source={{ uri: image }}
                    width={140}
                    height={100}
                    resizeMode="cover"
                    onError={() => handleImageError(`showcase_${index}`)}
                  />
                ) : (
                  <View flex={1} justifyContent="center" alignItems="center">
                    <Briefcase size={24} color={color10} />
                  </View>
                )}
              </View>
            ))}
          </XStack>
        </ScrollView>
      </Card>
    );
  };

  // 渲染资质证书
  const renderCertificates = () => {
    if (!expert || !expert.certificates || expert.certificates.length === 0) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          资质证书
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <XStack gap="$2">
            {expert.certificates.map((cert, index) => (
              <View
                key={index}
                width={120}
                height={90}
                borderRadius="$4"
                overflow="hidden"
                backgroundColor="$color4"
              >
                {!imageErrors[`cert_${index}`] ? (
                  <Image
                    source={{ uri: cert }}
                    width={120}
                    height={90}
                    resizeMode="cover"
                    onError={() => handleImageError(`cert_${index}`)}
                  />
                ) : (
                  <View flex={1} justifyContent="center" alignItems="center">
                    <Award size={24} color={color10} />
                  </View>
                )}
              </View>
            ))}
          </XStack>
        </ScrollView>
      </Card>
    );
  };

  // 渲染荣誉徽章
  const renderBadges = () => {
    if (!expert || !expert.badges || expert.badges.length === 0) return null;

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          荣誉徽章
        </Text>

        <XStack flexWrap="wrap" gap="$1.5">
          {expert.badges.map((badge, index) => (
            <View
              key={index}
              backgroundColor={`${warningColor}15`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$4"
              borderWidth={1}
              borderColor={`${warningColor}30`}
            >
              <XStack gap="$1" alignItems="center">
                <Award size={12} color={warningColor} />
                <Text fontSize="$2" color={warningColor} fontWeight="600">
                  {badge}
                </Text>
              </XStack>
            </View>
          ))}
        </XStack>
      </Card>
    );
  };

  // 渲染服务保障
  const renderGuarantee = () => {
    if (!expert) return null;

    const guarantees = [
      '平台认证达人，资质齐全可查',
      `${expert.completedOrders}+ 服务经验，客户好评率 ${expert.goodReviewRate}%`,
      `平均 ${expert.responseTime} 响应，服务及时高效`,
      '平台担保交易，服务质量有保障',
    ];

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack gap="$1.5" alignItems="center" marginBottom="$2">
          <TrendingUp size={18} color={primaryColor} />
          <Text fontSize="$4" fontWeight="600" color="$color12">
            服务保障
          </Text>
        </XStack>

        <YStack gap="$1.5">
          {guarantees.map((text, index) => (
            <XStack key={index} gap="$1.5" alignItems="flex-start">
              <CheckCircle size={14} color={successColor} style={{ marginTop: 2 }} />
              <Text fontSize="$3" color="$color12" flex={1}>
                {text}
              </Text>
            </XStack>
          ))}
        </YStack>
      </Card>
    );
  };

  // 渲染底部操作栏
  const renderBottomBar = () => (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$color2"
      borderTopWidth={1}
      borderTopColor="$color5"
      paddingHorizontal="$2.5"
      paddingTop="$2"
      paddingBottom={insets.bottom > 0 ? insets.bottom : 14}
      shadowOffset={{ width: 0, height: -2 }}
      shadowOpacity={0.08}
      elevation={8}
    >
      <XStack gap="$2" alignItems="center">
        {/* 联系达人 */}
        <Pressable style={{ flex: 1 }} onPress={handleContactExpert}>
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
                咨询
              </Text>
            </XStack>
          </View>
        </Pressable>

        {/* 预约服务 */}
        <Pressable style={{ flex: 1 }} onPress={handleBookService}>
          <View
            flex={1}
            backgroundColor={primaryColor}
            borderRadius="$10"
            paddingVertical="$2"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$3" color="white" fontWeight="500">
              预约服务
            </Text>
          </View>
        </Pressable>
      </XStack>
    </View>
  );

  if (loading || !expert) {
    return (
      <View flex={1} backgroundColor="$background">
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="达人详情"
          subtitle={expert.name}
          renderRight={renderShareButton}
        />
      </View>

      {/* 滚动内容 */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 头部信息卡片 */}
        {renderProfileCard()}

        {/* 认证信息 */}
        {renderCertification()}

        {/* 服务数据统计 */}
        {renderStats()}

        {/* 个人介绍 */}
        {renderIntroduction()}

        {/* 专业技能 */}
        {renderSkills()}

        {/* 服务项目及价格 */}
        {renderServices()}

        {/* 服务展示 */}
        {renderShowcase()}

        {/* 资质证书 */}
        {renderCertificates()}

        {/* 荣誉徽章 */}
        {renderBadges()}

        {/* 服务保障 */}
        {renderGuarantee()}

        {/* 底部安全区域 */}
        <View height={80 + insets.bottom} />
      </ScrollView>

      {/* 底部操作栏 */}
      {renderBottomBar()}
    </View>
  );
};
