/**
 * CaregiverDetailScreen 护理人员详情页
 * 展示简介、资质证书、工作经历、用户评价
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
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
  ChevronRight,
} from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Caregiver, CaregiverReview } from '@/types/elderly';
import { getCaregiverById, getCaregiverReviews } from '@/services/caregiverService';

type RootStackParamList = {
  CaregiverDetail: { caregiverId: string };
};

type CaregiverDetailScreenRouteProp = RouteProp<RootStackParamList, 'CaregiverDetail'>;

type TabType = 'intro' | 'certifications' | 'history' | 'reviews';

const GOLD_COLOR = '#D4AF37';

const CaregiverDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<CaregiverDetailScreenRouteProp>();
  const { caregiverId } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;
  const successColor = theme.success?.val;

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
    console.log('Share caregiver profile');
  };

  const handleBooking = () => {
    if (!caregiver) return;

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
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!caregiver) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$color10">
          护理人员信息不存在
        </Text>
      </View>
    );
  }

  const getTabIcon = (key: TabType) => {
    const isActive = activeTab === key;
    const iconColor = isActive ? 'white' : color10;

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
      {/* TitleBar - 按照CLAUDE.md规范 */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>

          <Text fontSize="$5" fontWeight="600" color="$color12">
            护理人员详情
          </Text>

          <XStack gap="$2">
            <Pressable onPress={() => setIsFavorite(!isFavorite)}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
              >
                <Heart
                  size={20}
                  color={isFavorite ? '#EF4444' : color12}
                  fill={isFavorite ? '#EF4444' : 'none'}
                />
              </View>
            </Pressable>
            <Pressable onPress={handleShare}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
              >
                <Share2 size={20} color={color12} />
              </View>
            </Pressable>
          </XStack>
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View padding="$2.5">
          <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
            <XStack gap="$2" alignItems="flex-start">
              {/* Avatar */}
              <View position="relative">
                <View
                  width={72}
                  height={72}
                  borderRadius={36}
                  backgroundColor="$color4"
                  overflow="hidden"
                >
                  <Image
                    source={{ uri: caregiver.avatar }}
                    style={{ width: 72, height: 72 }}
                  />
                </View>
                {caregiver.verified && (
                  <View
                    position="absolute"
                    bottom={-2}
                    right={-2}
                    width={22}
                    height={22}
                    borderRadius={11}
                    backgroundColor="$primary"
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={2}
                    borderColor="$color2"
                  >
                    <CheckCircle size={12} color="white" />
                  </View>
                )}
              </View>

              {/* Basic Info */}
              <YStack flex={1} gap="$1.5">
                <XStack alignItems="center" gap="$2">
                  <Text fontSize="$5" fontWeight="700" color="$color12">
                    {caregiver.name}
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    {caregiver.age}岁
                  </Text>
                  {caregiver.available && (
                    <View
                      backgroundColor="$success"
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$10"
                    >
                      <Text fontSize={10} color="white" fontWeight="500">
                        可预约
                      </Text>
                    </View>
                  )}
                </XStack>

                <View
                  backgroundColor="$primary"
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                  alignSelf="flex-start"
                >
                  <Text fontSize="$2" color="white" fontWeight="500">
                    {caregiver.qualificationBadge}
                  </Text>
                </View>

                <XStack alignItems="center" gap="$2" flexWrap="wrap">
                  <XStack alignItems="center" gap="$0.5">
                    <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {caregiver.rating}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      ({caregiver.reviews}评价)
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$color10">
                    从业{caregiver.experience}
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    {caregiver.completedJobs}单
                  </Text>
                </XStack>

                <XStack alignItems="center" gap="$1">
                  <Clock size={14} color={color10} />
                  <Text fontSize="$2" color="$color10">
                    {caregiver.responseTime}
                  </Text>
                </XStack>
              </YStack>
            </XStack>

            {/* Specialty */}
            <View
              marginTop="$2"
              borderWidth={1}
              borderColor="$primary"
              paddingHorizontal="$2"
              paddingVertical="$1.5"
              borderRadius="$10"
              alignSelf="flex-start"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <Text fontSize="$3" color="$primary" fontWeight="500">
                专长：{caregiver.specialty}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18 }}
        >
          <XStack gap="$2">
            {tabs.map((tab) => (
              <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)}>
                <View
                  paddingHorizontal="$2.5"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor={activeTab === tab.key ? '$primary' : '$color4'}
                  borderWidth={1}
                  borderColor={activeTab === tab.key ? '$primary' : '$color5'}
                >
                  <XStack alignItems="center" gap="$1">
                    {getTabIcon(tab.key)}
                    <Text
                      fontSize="$3"
                      fontWeight="500"
                      color={activeTab === tab.key ? 'white' : '$color12'}
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
        <View padding="$2.5">
          {/* 简介 Tab */}
          {activeTab === 'intro' && (
            <YStack gap="$2">
              <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
                  个人简介
                </Text>
                <Text fontSize="$3" color="$color12" lineHeight={22}>
                  {caregiver.detailedIntro}
                </Text>
              </View>

              <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
                  专业技能
                </Text>
                <XStack gap="$1.5" flexWrap="wrap">
                  {caregiver.skills.map((skill, index) => (
                    <View
                      key={index}
                      borderWidth={1}
                      borderColor="$primary"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <Text fontSize="$2" color="$primary">
                        {skill}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
                  语言能力
                </Text>
                <XStack gap="$1.5" flexWrap="wrap">
                  {caregiver.languages.map((lang, index) => (
                    <View
                      key={index}
                      backgroundColor="$color4"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor="$color5"
                    >
                      <Text fontSize="$2" color="$color12">
                        {lang}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              <View backgroundColor="$color2" borderRadius="$5" borderWidth={1} borderColor="$color5" padding="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
                  服务价格
                </Text>
                <YStack gap="$1.5">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$color10">
                      时薪
                    </Text>
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      ¥{caregiver.hourlyRate}/时
                    </Text>
                  </XStack>
                  <View height={1} backgroundColor="$color5" />
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$color10">
                      日薪
                    </Text>
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      ¥{caregiver.dailyRate}/天
                    </Text>
                  </XStack>
                  <View height={1} backgroundColor="$color5" />
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$color10">
                      月薪
                    </Text>
                    <Text fontSize="$5" fontWeight="700" color="$primary">
                      ¥{caregiver.monthlyRate}/月
                    </Text>
                  </XStack>
                </YStack>
              </View>
            </YStack>
          )}

          {/* 资质证书 Tab */}
          {activeTab === 'certifications' && (
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                资质证书
              </Text>
              {caregiver.certifications.map((cert) => (
                <View
                  key={cert.id}
                  backgroundColor="$color2"
                  borderRadius="$5"
                  padding="$2"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$1.5">
                    <YStack flex={1} gap="$1">
                      <XStack alignItems="center" gap="$2">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          {cert.name}
                        </Text>
                        {cert.verified && (
                          <View
                            backgroundColor="$success"
                            paddingHorizontal="$2"
                            paddingVertical="$0.5"
                            borderRadius="$10"
                          >
                            <Text fontSize={10} color="white" fontWeight="500">
                              已认证
                            </Text>
                          </View>
                        )}
                      </XStack>
                      <Text fontSize="$2" color="$color10">
                        证书编号：{cert.number}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        发证机构：{cert.issuer}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        发证日期：{cert.issueDate}
                      </Text>
                      {cert.expiryDate && (
                        <Text fontSize="$2" color="$color10">
                          有效期至：{cert.expiryDate}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                  {cert.image && (
                    <View
                      marginTop="$1.5"
                      borderRadius="$4"
                      overflow="hidden"
                      backgroundColor="$color4"
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
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                工作经历
              </Text>
              {caregiver.workHistory.map((work) => (
                <View
                  key={work.id}
                  backgroundColor="$color2"
                  borderRadius="$5"
                  padding="$2"
                  borderWidth={1}
                  borderColor="$color5"
                  borderLeftWidth={3}
                  borderLeftColor="$primary"
                >
                  <XStack alignItems="flex-start" gap="$2">
                    <View
                      width={36}
                      height={36}
                      borderRadius={18}
                      backgroundColor="$primary"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Briefcase size={18} color="white" />
                    </View>
                    <YStack flex={1} gap="$1">
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        {work.position}
                      </Text>
                      <Text fontSize="$3" color="$color10">
                        {work.institution}
                      </Text>
                      <XStack alignItems="center" gap="$1">
                        <Calendar size={14} color={color10} />
                        <Text fontSize="$2" color="$color10">
                          {work.startDate} - {work.endDate || '至今'}
                        </Text>
                      </XStack>
                      {work.description && (
                        <Text fontSize="$2" color="$color12" marginTop="$1" lineHeight={18}>
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
            <YStack gap="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  用户评价 ({reviews.length})
                </Text>
                <XStack alignItems="center" gap="$1">
                  <Star size={16} color={GOLD_COLOR} fill={GOLD_COLOR} />
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {caregiver.rating}
                  </Text>
                </XStack>
              </XStack>

              {reviews.length === 0 ? (
                <View
                  padding="$4"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$color2"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <Text fontSize="$3" color="$color10">
                    暂无评价
                  </Text>
                </View>
              ) : (
                reviews.map((review) => (
                  <View
                    key={review.id}
                    backgroundColor="$color2"
                    borderRadius="$5"
                    padding="$2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <XStack gap="$2" alignItems="flex-start">
                      <View
                        width={36}
                        height={36}
                        borderRadius={18}
                        backgroundColor="$color4"
                        overflow="hidden"
                      >
                        <Image
                          source={{ uri: review.userAvatar }}
                          style={{ width: 36, height: 36 }}
                        />
                      </View>
                      <YStack flex={1} gap="$1.5">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" fontWeight="600" color="$color12">
                            {review.userName}
                          </Text>
                          <Text fontSize="$2" color="$color10">
                            {review.date}
                          </Text>
                        </XStack>

                        <XStack gap="$0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              color={index < review.rating ? GOLD_COLOR : color10}
                              fill={index < review.rating ? GOLD_COLOR : 'none'}
                            />
                          ))}
                        </XStack>

                        <View
                          borderWidth={1}
                          borderColor="$primary"
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$10"
                          alignSelf="flex-start"
                          style={{ backgroundColor: `${primaryColor}10` }}
                        >
                          <Text fontSize="$2" color="$primary">
                            {review.serviceType}
                          </Text>
                        </View>

                        <Text fontSize="$3" color="$color12" lineHeight={20}>
                          {review.content}
                        </Text>

                        {review.images && review.images.length > 0 && (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <XStack gap="$1.5">
                              {review.images.map((img, index) => (
                                <View
                                  key={index}
                                  width={80}
                                  height={80}
                                  borderRadius="$4"
                                  overflow="hidden"
                                  backgroundColor="$color4"
                                >
                                  <Image
                                    source={{ uri: img }}
                                    style={{ width: 80, height: 80 }}
                                  />
                                </View>
                              ))}
                            </XStack>
                          </ScrollView>
                        )}

                        {review.reply && (
                          <View
                            backgroundColor="$color4"
                            padding="$2"
                            borderRadius="$4"
                            marginTop="$1"
                          >
                            <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                              护理人员回复：
                            </Text>
                            <Text fontSize="$2" color="$color12" lineHeight={18}>
                              {review.reply.content}
                            </Text>
                            <Text fontSize={10} color="$color10" marginTop="$0.5">
                              {review.reply.date}
                            </Text>
                          </View>
                        )}

                        <XStack alignItems="center" gap="$0.5" marginTop="$0.5">
                          <Text fontSize="$2" color="$color10">
                            有帮助 ({review.helpful})
                          </Text>
                        </XStack>
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
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        paddingBottom={insets.bottom + 8}
      >
        <XStack gap="$2" alignItems="center">
          <YStack flex={1}>
            <Text fontSize="$2" color="$color10">
              参考价格
            </Text>
            <XStack alignItems="baseline" gap="$0.5">
              <Text fontSize="$5" fontWeight="700" color="$primary">
                ¥{caregiver.hourlyRate}
              </Text>
              <Text fontSize="$2" color="$color10">
                /时起
              </Text>
            </XStack>
          </YStack>

          <Pressable onPress={handleBooking} style={{ flex: 1 }}>
            <View
              height={48}
              borderRadius="$10"
              backgroundColor="$primary"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" fontWeight="600" color="white">
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
