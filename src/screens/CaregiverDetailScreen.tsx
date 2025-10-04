import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Clock,
  CheckCircle,
  Award,
  Briefcase,
  MessageCircle,
  Calendar,
} from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '@/constants/app';
import type { Caregiver, CaregiverReview } from '@/types/elderly';
import { getCaregiverById, getCaregiverReviews } from '@/services/caregiverService';

type RootStackParamList = {
  CaregiverDetail: { caregiverId: string };
};

type CaregiverDetailScreenRouteProp = RouteProp<RootStackParamList, 'CaregiverDetail'>;

type TabType = 'intro' | 'certifications' | 'history' | 'reviews';

const CaregiverDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<CaregiverDetailScreenRouteProp>();
  const { caregiverId } = route.params;
  const { width } = useWindowDimensions();

  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [reviews, setReviews] = useState<CaregiverReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadCaregiverData();
  }, [caregiverId]);

  const loadCaregiverData = async () => {
    try {
      setLoading(true);
      const [caregiverData, reviewsData] = await Promise.all([
        getCaregiverById(caregiverId),
        getCaregiverReviews(caregiverId),
      ]);
      setCaregiver(caregiverData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to load caregiver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share caregiver profile');
  };

  const handleBooking = () => {
    if (!caregiver) return;

    // 导航到AI咨询，传递护理人员信息以跳过前面的选择步骤
    navigation.navigate('AIConsultation' as never, {
      source: 'elderly_service',
      caregiverId: caregiver.id,
      serviceType: caregiver.serviceType,
      qualification: caregiver.qualificationBadge,
    } as never);
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!caregiver) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$textSecondary">
          护理人员信息不存在
        </Text>
      </View>
    );
  }

  const getTabIcon = (key: TabType) => {
    const isActive = activeTab === key;
    const iconColor = isActive ? 'white' : COLORS.textSecondary;

    switch (key) {
      case 'intro':
        return <MessageCircle size={16} color={iconColor} />;
      case 'certifications':
        return <Award size={16} color={iconColor} />;
      case 'history':
        return <Briefcase size={16} color={iconColor} />;
      case 'reviews':
        return <Star size={16} color={iconColor} />;
    }
  };

  const tabs: Array<{ key: TabType; label: string }> = [
    { key: 'intro', label: '简介' },
    { key: 'certifications', label: '资质证书' },
    { key: 'history', label: '工作经历' },
    { key: 'reviews', label: '用户评价' },
  ];

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <View
        paddingHorizontal="$4"
        paddingTop="$4"
        paddingBottom="$3"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="$surface"
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={20} color={COLORS.text} />
            </View>
          </Pressable>

          <XStack gap="$2">
            <Pressable onPress={() => setIsFavorite(!isFavorite)}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="$surface"
                justifyContent="center"
                alignItems="center"
              >
                <Heart
                  size={20}
                  color={isFavorite ? COLORS.error : COLORS.text}
                  fill={isFavorite ? COLORS.error : 'none'}
                />
              </View>
            </Pressable>
            <Pressable onPress={handleShare}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="$surface"
                justifyContent="center"
                alignItems="center"
              >
                <Share2 size={20} color={COLORS.text} />
              </View>
            </Pressable>
          </XStack>
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View padding="$4">
          <XStack gap="$3" alignItems="flex-start">
            {/* Avatar */}
            <View position="relative">
              <View
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor="$surface"
                overflow="hidden"
              >
                <Image
                  source={{ uri: caregiver.avatar }}
                  style={{ width: 80, height: 80 }}
                />
              </View>
              {caregiver.verified && (
                <View
                  position="absolute"
                  bottom={-2}
                  right={-2}
                  width={24}
                  height={24}
                  borderRadius={12}
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={2}
                  borderColor="$background"
                >
                  <CheckCircle size={14} color="white" />
                </View>
              )}
            </View>

            {/* Basic Info */}
            <YStack flex={1} gap="$2">
              <XStack alignItems="center" gap="$2">
                <Text fontSize="$6" fontWeight="bold" color="$text">
                  {caregiver.name}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {caregiver.age}岁
                </Text>
                {caregiver.available && (
                  <View
                    backgroundColor={COLORS.successLight}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color={COLORS.success} fontWeight="600">
                      可预约
                    </Text>
                  </View>
                )}
              </XStack>

              <View
                backgroundColor={COLORS.primaryLight}
                paddingHorizontal="$3"
                paddingVertical="$1.5"
                borderRadius="$2"
                alignSelf="flex-start"
              >
                <Text fontSize="$2" color="white" fontWeight="600">
                  {caregiver.qualificationBadge}
                </Text>
              </View>

              <XStack alignItems="center" gap="$3">
                <XStack alignItems="center" gap="$1">
                  <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {caregiver.rating}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    ({caregiver.reviews}评价)
                  </Text>
                </XStack>
                <Text fontSize="$2" color="$textSecondary">
                  从业{caregiver.experience}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  {caregiver.completedJobs}单
                </Text>
              </XStack>

              <XStack alignItems="center" gap="$1">
                <Clock size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {caregiver.responseTime}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* Specialty */}
          <View
            marginTop="$3"
            backgroundColor="rgba(99, 102, 241, 0.1)"
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius="$2"
            alignSelf="flex-start"
          >
            <Text fontSize="$3" color={COLORS.primary} fontWeight="500">
              专长：{caregiver.specialty}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <XStack gap="$2">
            {tabs.map((tab) => (
              <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)}>
                <View
                  paddingHorizontal="$4"
                  paddingVertical="$2.5"
                  borderRadius="$3"
                  backgroundColor={activeTab === tab.key ? COLORS.primary : '$surface'}
                  borderWidth={1}
                  borderColor={activeTab === tab.key ? COLORS.primary : '$borderColor'}
                >
                  <XStack alignItems="center" gap="$1.5">
                    {getTabIcon(tab.key)}
                    <Text
                      fontSize="$3"
                      fontWeight="500"
                      color={activeTab === tab.key ? 'white' : '$text'}
                    >
                      {tab.label}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            ))}
          </XStack>
        </ScrollView>

        {/* Tab Content */}
        <View padding="$4">
          {/* 简介 Tab */}
          {activeTab === 'intro' && (
            <YStack gap="$4">
              <View>
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$2">
                  个人简介
                </Text>
                <Text fontSize="$3" color="$text" lineHeight={24}>
                  {caregiver.detailedIntro}
                </Text>
              </View>

              <View>
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  专业技能
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {caregiver.skills.map((skill, index) => (
                    <View
                      key={index}
                      backgroundColor="$surface"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                    >
                      <Text fontSize="$2" color="$text">
                        {skill}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              <View>
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  语言能力
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {caregiver.languages.map((lang, index) => (
                    <View
                      key={index}
                      backgroundColor="$surface"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                    >
                      <Text fontSize="$2" color="$text">
                        {lang}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              <View>
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  服务价格
                </Text>
                <YStack gap="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$textSecondary">
                      时薪
                    </Text>
                    <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                      ¥{caregiver.hourlyRate}/时
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$textSecondary">
                      日薪
                    </Text>
                    <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                      ¥{caregiver.dailyRate}/天
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$textSecondary">
                      月薪
                    </Text>
                    <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                      ¥{caregiver.monthlyRate}/月
                    </Text>
                  </XStack>
                </YStack>
              </View>
            </YStack>
          )}

          {/* 资质证书 Tab */}
          {activeTab === 'certifications' && (
            <YStack gap="$3">
              <Text fontSize="$4" fontWeight="bold" color="$text">
                资质证书
              </Text>
              {caregiver.certifications.map((cert) => (
                <View
                  key={cert.id}
                  backgroundColor="$surface"
                  borderRadius="$3"
                  padding="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                    <YStack flex={1} gap="$1">
                      <XStack alignItems="center" gap="$2">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {cert.name}
                        </Text>
                        {cert.verified && (
                          <View
                            backgroundColor={COLORS.successLight}
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" color={COLORS.success} fontWeight="600">
                              已认证
                            </Text>
                          </View>
                        )}
                      </XStack>
                      <Text fontSize="$2" color="$textSecondary">
                        证书编号：{cert.number}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        发证机构：{cert.issuer}
                      </Text>
                      <Text fontSize="$2" color="$textSecondary">
                        发证日期：{cert.issueDate}
                      </Text>
                      {cert.expiryDate && (
                        <Text fontSize="$2" color="$textSecondary">
                          有效期至：{cert.expiryDate}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                  {cert.image && (
                    <View
                      marginTop="$2"
                      borderRadius="$2"
                      overflow="hidden"
                      backgroundColor="$surface"
                    >
                      <Image
                        source={{ uri: cert.image }}
                        style={{ width: '100%', height: 200 }}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </View>
              ))}
            </YStack>
          )}

          {/* 工作经历 Tab */}
          {activeTab === 'history' && (
            <YStack gap="$3">
              <Text fontSize="$4" fontWeight="bold" color="$text">
                工作经历
              </Text>
              {caregiver.workHistory.map((work) => (
                <View
                  key={work.id}
                  backgroundColor="$surface"
                  borderRadius="$3"
                  padding="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <XStack alignItems="flex-start" gap="$3">
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={COLORS.primaryLight}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Briefcase size={20} color="white" />
                    </View>
                    <YStack flex={1} gap="$1.5">
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        {work.position}
                      </Text>
                      <Text fontSize="$3" color="$textSecondary">
                        {work.institution}
                      </Text>
                      <XStack alignItems="center" gap="$1">
                        <Calendar size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$2" color="$textSecondary">
                          {work.startDate} - {work.endDate || '至今'}
                        </Text>
                      </XStack>
                      {work.description && (
                        <Text fontSize="$2" color="$text" marginTop="$1" lineHeight={20}>
                          {work.description}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                </View>
              ))}
            </YStack>
          )}

          {/* 用户评价 Tab */}
          {activeTab === 'reviews' && (
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" fontWeight="bold" color="$text">
                  用户评价 ({reviews.length})
                </Text>
                <XStack alignItems="center" gap="$1">
                  <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {caregiver.rating}
                  </Text>
                </XStack>
              </XStack>

              {reviews.length === 0 ? (
                <View
                  padding="$8"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$surface"
                  borderRadius="$3"
                >
                  <Text fontSize="$3" color="$textSecondary">
                    暂无评价
                  </Text>
                </View>
              ) : (
                reviews.map((review) => (
                  <View
                    key={review.id}
                    backgroundColor="$surface"
                    borderRadius="$3"
                    padding="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <XStack gap="$3" alignItems="flex-start">
                      <View
                        width={40}
                        height={40}
                        borderRadius={20}
                        backgroundColor="$background"
                        overflow="hidden"
                      >
                        <Image
                          source={{ uri: review.userAvatar }}
                          style={{ width: 40, height: 40 }}
                        />
                      </View>
                      <YStack flex={1} gap="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" fontWeight="600" color="$text">
                            {review.userName}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            {review.date}
                          </Text>
                        </XStack>

                        <XStack gap="$1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              color={index < review.rating ? COLORS.warning : COLORS.border}
                              fill={index < review.rating ? COLORS.warning : 'none'}
                            />
                          ))}
                        </XStack>

                        <View
                          backgroundColor="rgba(99, 102, 241, 0.05)"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                          alignSelf="flex-start"
                        >
                          <Text fontSize="$2" color={COLORS.primary}>
                            {review.serviceType}
                          </Text>
                        </View>

                        <Text fontSize="$3" color="$text" lineHeight={20}>
                          {review.content}
                        </Text>

                        {review.images && review.images.length > 0 && (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <XStack gap="$2">
                              {review.images.map((img, index) => (
                                <View
                                  key={index}
                                  width={100}
                                  height={100}
                                  borderRadius="$2"
                                  overflow="hidden"
                                  backgroundColor="$background"
                                >
                                  <Image
                                    source={{ uri: img }}
                                    style={{ width: 100, height: 100 }}
                                  />
                                </View>
                              ))}
                            </XStack>
                          </ScrollView>
                        )}

                        {review.reply && (
                          <View
                            backgroundColor="$background"
                            padding="$2.5"
                            borderRadius="$2"
                            marginTop="$2"
                          >
                            <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                              护理人员回复：
                            </Text>
                            <Text fontSize="$2" color="$text" lineHeight={18}>
                              {review.reply.content}
                            </Text>
                            <Text fontSize="$1" color="$textSecondary" marginTop="$1">
                              {review.reply.date}
                            </Text>
                          </View>
                        )}

                        <Pressable>
                          <XStack alignItems="center" gap="$1" marginTop="$1">
                            <Text fontSize="$2" color="$textSecondary">
                              有帮助 ({review.helpful})
                            </Text>
                          </XStack>
                        </Pressable>
                      </YStack>
                    </XStack>
                  </View>
                ))
              )}
            </YStack>
          )}
        </View>

        {/* Bottom spacing for fixed action bar */}
        <View height={100} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$background"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
        shadowColor="$shadowColor"
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={8}
      >
        <XStack gap="$3" alignItems="center">
          <YStack flex={1}>
            <Text fontSize="$2" color="$textSecondary">
              参考价格
            </Text>
            <XStack alignItems="baseline" gap="$1">
              <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                ¥{caregiver.hourlyRate}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                /时起
              </Text>
            </XStack>
          </YStack>

          <Pressable
            onPress={handleBooking}
            style={{ flex: 1 }}
          >
            <View
              height={48}
              borderRadius="$4"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                在线咨询
              </Text>
            </View>
          </Pressable>
        </XStack>
      </View>
    </View>
  );
};

export default CaregiverDetailScreen;
