/**
 * PrivateDoctorListScreen 私人医生列表页面
 * 高端医疗服务发现、签约用户优先展示服务台
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import {
  Pressable,
  ActivityIndicator,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  MapPin,
  Award,
  Users,
  Video,
  CheckCircle,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  Shield,
  Crown,
  MessageCircle,
  Headphones,
} from 'lucide-react-native';
import { getAvatarSource } from '@/constants/avatars';
import {
  PrivateDoctor,
  DoctorDepartment,
  DoctorSubscription,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { useFocusEffect } from '@react-navigation/native';

const GOLD_COLOR = '#D4AF37';

interface PrivateDoctorListScreenProps {
  navigation: any;
}

export const PrivateDoctorListScreen: React.FC<PrivateDoctorListScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [doctors, setDoctors] = useState<PrivateDoctor[]>([]);
  const [featuredDoctors, setFeaturedDoctors] = useState<PrivateDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DoctorDepartment | 'all'>('all');
  // 支持多个签约
  const [subscriptions, setSubscriptions] = useState<DoctorSubscription[]>([]);
  const [subscribedDoctors, setSubscribedDoctors] = useState<PrivateDoctor[]>([]);

  // 科室分类
  const departments = [
    { id: 'all', label: '全部', icon: '🏥' },
    { id: DoctorDepartment.CARDIOLOGY, label: '心内科', icon: '❤️' },
    { id: DoctorDepartment.GASTROENTEROLOGY, label: '消化科', icon: '🫀' },
    { id: DoctorDepartment.ENDOCRINOLOGY, label: '内分泌', icon: '⚡' },
    { id: DoctorDepartment.NEUROLOGY, label: '神经科', icon: '🧠' },
    { id: DoctorDepartment.RHEUMATOLOGY, label: '风湿科', icon: '🦴' },
    { id: DoctorDepartment.ONCOLOGY, label: '肿瘤科', icon: '🎗️' },
    { id: DoctorDepartment.GENERAL_MEDICINE, label: '全科', icon: '⚕️' },
    { id: DoctorDepartment.NUTRITION, label: '营养科', icon: '🥗' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [selectedDepartment])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      // 检查用户所有的签约
      const userId = 'user_001';
      const allSubscriptions = await privateDoctorService.getAllMySubscriptions(userId);
      const activeSubscriptions = allSubscriptions.filter(s => s.status === 'active');
      setSubscriptions(activeSubscriptions);

      // 加载所有签约医生的信息
      if (activeSubscriptions.length > 0) {
        const doctorsData = await Promise.all(
          activeSubscriptions.map(s => privateDoctorService.getDoctorById(s.doctorId))
        );
        setSubscribedDoctors(doctorsData.filter(Boolean) as PrivateDoctor[]);
      } else {
        setSubscribedDoctors([]);
      }

      // 加载医生列表
      const filterParams = selectedDepartment === 'all' ? {} : { department: selectedDepartment };
      const data = await privateDoctorService.getDoctors(filterParams);
      setDoctors(data);

      // 加载推荐医生
      const allDoctors = await privateDoctorService.getDoctors({ hasOverseasTraining: true });
      const sorted = allDoctors
        .filter((d) => d.rating >= 4.8)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setFeaturedDoctors(sorted);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDoctorPress = (doctorId: string) => {
    navigation.navigate('PrivateDoctorDetail', { doctorId });
  };

  const handleGoToServiceDesk = () => {
    navigation.navigate('PrivateDoctorServiceDesk');
  };

  const formatPrice = (price: number): string => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}万`;
    }
    return price.toLocaleString();
  };

  const getDepartmentLabel = (dept: DoctorDepartment): string => {
    const labels: Record<DoctorDepartment, string> = {
      [DoctorDepartment.CARDIOLOGY]: '心血管内科',
      [DoctorDepartment.GASTROENTEROLOGY]: '消化内科',
      [DoctorDepartment.ENDOCRINOLOGY]: '内分泌科',
      [DoctorDepartment.NEUROLOGY]: '神经内科',
      [DoctorDepartment.RHEUMATOLOGY]: '风湿免疫科',
      [DoctorDepartment.ONCOLOGY]: '肿瘤科',
      [DoctorDepartment.GENERAL_MEDICINE]: '全科医学',
      [DoctorDepartment.NUTRITION]: '营养科',
    };
    return labels[dept];
  };

  const getTitleLabel = (title: string): string => {
    const labels: Record<string, string> = {
      chief_physician: '主任医师',
      associate_chief_physician: '副主任医师',
      associate_chief: '副主任医师',
      attending_physician: '主治医师',
      attending: '主治医师',
      resident: '住院医师',
    };
    return labels[title] || title;
  };

  // 渲染已签约用户的服务台入口（支持多个签约，水平滚动）
  const renderSubscribedBanner = () => {
    if (subscriptions.length === 0 || subscribedDoctors.length === 0) return null;

    // 单个签约卡片渲染
    const renderSubscriptionCard = (subscription: DoctorSubscription, doctor: PrivateDoctor, index: number) => (
      <Pressable
        key={subscription.id}
        onPress={() => navigation.navigate('PrivateDoctorServiceDesk', { subscriptionId: subscription.id })}
        style={{ width: subscriptions.length > 1 ? 300 : '100%' }}
      >
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={2}
          borderColor={GOLD_COLOR}
          padding="$2"
          style={{ backgroundColor: `${GOLD_COLOR}08` }}
        >
          <XStack gap="$2" alignItems="center">
            {/* 医生头像 */}
            <View
              width={56}
              height={56}
              borderRadius={28}
              backgroundColor="$color4"
              borderWidth={2}
              borderColor={GOLD_COLOR}
              overflow="hidden"
            >
              <Image
                source={getAvatarSource(doctor.avatar, doctor.name)}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>

            <YStack flex={1} gap="$1">
              <XStack alignItems="center" gap="$1.5">
                <Crown size={16} color={GOLD_COLOR} />
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  您已签约私人医生服务
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$2">
                <Text fontSize="$3" color="$color12" fontWeight="600">
                  {doctor.name}
                </Text>
                <Text fontSize="$2" color="$color10">
                  {getTitleLabel(doctor.title)}
                </Text>
              </XStack>
            </YStack>

            <ChevronRight size={20} color={GOLD_COLOR} />
          </XStack>

          {/* 快捷入口 */}
          <XStack gap="$2" marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$color5">
            <Pressable
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('DoctorChat', {
                doctorId: doctor.id,
                subscriptionId: subscription.id,
              })}
            >
              <View
                backgroundColor={GOLD_COLOR}
                borderRadius="$10"
                paddingVertical="$1.5"
                alignItems="center"
              >
                <XStack gap="$1" alignItems="center">
                  <MessageCircle size={14} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    立即咨询
                  </Text>
                </XStack>
              </View>
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('PrivateDoctorServiceDesk', { subscriptionId: subscription.id })}
            >
              <View
                backgroundColor="$color2"
                borderRadius="$10"
                borderWidth={1}
                borderColor={GOLD_COLOR}
                paddingVertical="$1.5"
                alignItems="center"
              >
                <XStack gap="$1" alignItems="center">
                  <Headphones size={14} color={GOLD_COLOR} />
                  <Text fontSize="$3" color={GOLD_COLOR} fontWeight="500">
                    服务台
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </View>
      </Pressable>
    );

    // 如果只有一个签约，直接展示
    if (subscriptions.length === 1) {
      return (
        <View padding="$2.5">
          {renderSubscriptionCard(subscriptions[0], subscribedDoctors[0], 0)}
        </View>
      );
    }

    // 多个签约时，水平滚动展示
    return (
      <View paddingVertical="$2.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}
        >
          {subscriptions.map((sub, index) => {
            const doctor = subscribedDoctors.find(d => d.id === sub.doctorId);
            if (!doctor) return null;
            return renderSubscriptionCard(sub, doctor, index);
          })}
        </ScrollView>
        {/* 多个签约时显示指示器 */}
        <XStack justifyContent="center" gap="$1" marginTop="$1.5">
          {subscriptions.map((_, index) => (
            <View
              key={index}
              width={6}
              height={6}
              borderRadius={3}
              backgroundColor={index === 0 ? GOLD_COLOR : '$color5'}
            />
          ))}
        </XStack>
      </View>
    );
  };

  // 渲染服务介绍Banner（未签约用户）
  const renderServiceBanner = () => {
    if (subscriptions.length > 0) return null;

    return (
      <View padding="$2.5">
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          padding="$2"
          overflow="hidden"
        >
          <XStack gap="$2" alignItems="center">
            <View
              width={56}
              height={56}
              borderRadius={28}
              borderWidth={2}
              borderColor={GOLD_COLOR}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: `${GOLD_COLOR}15` }}
            >
              <Crown size={28} color={GOLD_COLOR} />
            </View>

            <YStack flex={1} gap="$1">
              <XStack alignItems="center" gap="$1.5">
                <Text fontSize="$5" fontWeight="700" color="$color12">
                  私人医生服务
                </Text>
                <View
                  backgroundColor={GOLD_COLOR}
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Text fontSize={10} color="white" fontWeight="700">
                    VIP
                  </Text>
                </View>
              </XStack>
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                顶级三甲医院专家 · 1对1专属健康管理
              </Text>
            </YStack>
          </XStack>

          <XStack gap="$3" marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$color5">
            <XStack gap="$1" alignItems="center">
              <Shield size={14} color={GOLD_COLOR} />
              <Text fontSize="$2" color="$color10">国际认证</Text>
            </XStack>
            <XStack gap="$1" alignItems="center">
              <Award size={14} color={GOLD_COLOR} />
              <Text fontSize="$2" color="$color10">海外进修</Text>
            </XStack>
            <XStack gap="$1" alignItems="center">
              <GraduationCap size={14} color={GOLD_COLOR} />
              <Text fontSize="$2" color="$color10">博士学历</Text>
            </XStack>
          </XStack>
        </View>
      </View>
    );
  };

  // 渲染科室分类
  const renderDepartmentCategories = () => {
    return (
      <View marginBottom="$2">
        <Text
          fontSize="$4"
          fontWeight="600"
          color="$color12"
          paddingHorizontal="$2.5"
          marginBottom="$2"
        >
          选择专科
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18 }}
        >
          <XStack gap="$2">
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept.id;
              return (
                <Pressable
                  key={dept.id}
                  onPress={() => setSelectedDepartment(dept.id as DoctorDepartment | 'all')}
                >
                  <View
                    backgroundColor={isSelected ? '$primary' : '$color2'}
                    borderRadius="$4"
                    paddingHorizontal="$2.5"
                    paddingVertical="$2"
                    minWidth={80}
                    alignItems="center"
                    borderWidth={1}
                    borderColor={isSelected ? '$primary' : '$color5'}
                  >
                    <Text fontSize={24} marginBottom="$1">
                      {dept.icon}
                    </Text>
                    <Text
                      fontSize="$2"
                      color={isSelected ? 'white' : '$color12'}
                      fontWeight={isSelected ? '600' : '400'}
                    >
                      {dept.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  // 渲染推荐医生
  const renderFeaturedDoctors = () => {
    if (featuredDoctors.length === 0) return null;

    return (
      <View marginBottom="$2">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$2.5"
          marginBottom="$2"
        >
          <XStack gap="$1.5" alignItems="center">
            <TrendingUp size={18} color={GOLD_COLOR} />
            <Text fontSize="$4" fontWeight="600" color="$color12">
              推荐专家
            </Text>
          </XStack>
          <Pressable onPress={() => setSelectedDepartment('all')}>
            <XStack gap="$0.5" alignItems="center">
              <Text fontSize="$3" color="$primary" fontWeight="500">
                查看全部
              </Text>
              <ChevronRight size={14} color={primaryColor} />
            </XStack>
          </Pressable>
        </XStack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18 }}
        >
          <XStack gap="$2">
            {featuredDoctors.map((doctor) => {
              const lowestPrice = Math.min(...doctor.packages.map((p) => p.price));
              return (
                <Pressable key={doctor.id} onPress={() => handleDoctorPress(doctor.id)}>
                  <View
                    width={180}
                    backgroundColor="$color2"
                    borderRadius="$5"
                    padding="$2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    {/* 海外进修标签 */}
                    {doctor.overseasTraining.length > 0 && (
                      <View
                        position="absolute"
                        top={8}
                        right={8}
                        backgroundColor={GOLD_COLOR}
                        paddingHorizontal="$1.5"
                        paddingVertical="$0.5"
                        borderRadius="$2"
                        zIndex={10}
                      >
                        <Text fontSize={10} color="white" fontWeight="600">
                          海外进修
                        </Text>
                      </View>
                    )}

                    {/* 医生头像 */}
                    <View alignItems="center" marginBottom="$2">
                      <View
                        width={64}
                        height={64}
                        borderRadius={32}
                        backgroundColor="$color4"
                        borderWidth={2}
                        borderColor={GOLD_COLOR}
                        overflow="hidden"
                        marginBottom="$1.5"
                      >
                        <Image
                          source={getAvatarSource(doctor.avatar, doctor.name)}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      </View>

                      <XStack alignItems="center" gap="$1" marginBottom="$1">
                        <Text fontSize="$4" fontWeight="600" color="$color12" numberOfLines={1}>
                          {doctor.name}
                        </Text>
                        {doctor.verified && <CheckCircle size={14} color={GOLD_COLOR} />}
                      </XStack>

                      <View
                        backgroundColor="$color4"
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$2"
                      >
                        <Text fontSize="$2" color={GOLD_COLOR} fontWeight="500">
                          {getTitleLabel(doctor.title)}
                        </Text>
                      </View>
                    </View>

                    {/* 医院 */}
                    <XStack alignItems="center" gap="$1" marginBottom="$1.5" justifyContent="center">
                      <MapPin size={12} color={color10} />
                      <Text fontSize="$2" color="$color10" numberOfLines={1}>
                        {doctor.hospital.name}
                      </Text>
                    </XStack>

                    {/* 评分和会员数 */}
                    <XStack justifyContent="center" gap="$3" marginBottom="$2">
                      <XStack alignItems="center" gap="$0.5">
                        <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                        <Text fontSize="$3" fontWeight="600" color="$color12">
                          {doctor.rating.toFixed(1)}
                        </Text>
                      </XStack>
                      <XStack alignItems="center" gap="$0.5">
                        <Users size={14} color={color10} />
                        <Text fontSize="$2" color="$color10">
                          {doctor.memberCount}会员
                        </Text>
                      </XStack>
                    </XStack>

                    {/* 价格 */}
                    <View
                      backgroundColor="$color4"
                      padding="$1.5"
                      borderRadius="$3"
                      alignItems="center"
                    >
                      <Text fontSize={10} color="$color10">服务起价</Text>
                      <XStack alignItems="baseline" gap="$0.5">
                        <Text fontSize={10} color={GOLD_COLOR}>¥</Text>
                        <Text fontSize="$4" fontWeight="700" color={GOLD_COLOR}>
                          {formatPrice(lowestPrice)}
                        </Text>
                        <Text fontSize={10} color="$color10">/年</Text>
                      </XStack>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  // 渲染医生卡片
  const renderDoctorCard = ({ item }: { item: PrivateDoctor }) => {
    const lowestPrice = Math.min(...item.packages.map((p) => p.price));

    return (
      <Pressable onPress={() => handleDoctorPress(item.id)} style={{ marginBottom: 12 }}>
        <View
          backgroundColor="$color2"
          padding="$2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          marginHorizontal={18}
        >
          <XStack gap="$2">
            {/* 医生头像 */}
            <View>
              <View
                width={72}
                height={72}
                borderRadius="$4"
                overflow="hidden"
                backgroundColor="$color4"
                borderWidth={2}
                borderColor={GOLD_COLOR}
              >
                <Image
                  source={getAvatarSource(item.avatar, item.name)}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>

              {/* 在线状态 */}
              {item.isOnline && (
                <View
                  position="absolute"
                  bottom={-4}
                  left="50%"
                  marginLeft={-20}
                  backgroundColor="$success"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                  borderWidth={2}
                  borderColor="$color2"
                >
                  <Text fontSize={10} color="white" fontWeight="500">
                    在线
                  </Text>
                </View>
              )}
            </View>

            {/* 医生信息 */}
            <YStack flex={1} gap="$1">
              {/* 姓名和认证 */}
              <XStack alignItems="center" gap="$1.5">
                <Text fontSize="$5" fontWeight="700" color="$color12">
                  {item.name}
                </Text>
                {item.verified && <CheckCircle size={16} color={GOLD_COLOR} />}
              </XStack>

              {/* 职称和科室 */}
              <XStack alignItems="center" gap="$1.5" flexWrap="wrap">
                <View
                  backgroundColor="$color4"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={GOLD_COLOR} fontWeight="500">
                    {getTitleLabel(item.title)}
                  </Text>
                </View>
                <Text fontSize="$2" color="$color10">
                  {getDepartmentLabel(item.department)}
                </Text>
              </XStack>

              {/* 医院 */}
              <XStack alignItems="center" gap="$1">
                <MapPin size={12} color={color10} />
                <Text fontSize="$2" color="$color10" numberOfLines={1} flex={1}>
                  {item.hospital.name}
                </Text>
              </XStack>

              {/* 亮点标签 */}
              <XStack gap="$1.5" flexWrap="wrap">
                {item.isOnline && (
                  <XStack
                    alignItems="center"
                    gap="$0.5"
                    paddingHorizontal="$1.5"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                    style={{ backgroundColor: `${successColor}15` }}
                  >
                    <Video size={12} color={successColor} />
                    <Text fontSize={10} color={successColor} fontWeight="500">
                      视频咨询
                    </Text>
                  </XStack>
                )}
                {item.overseasTraining.length > 0 && (
                  <XStack
                    alignItems="center"
                    gap="$0.5"
                    paddingHorizontal="$1.5"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                    style={{ backgroundColor: `${GOLD_COLOR}15` }}
                  >
                    <Award size={12} color={GOLD_COLOR} />
                    <Text fontSize={10} color={GOLD_COLOR} fontWeight="500">
                      海外进修
                    </Text>
                  </XStack>
                )}
                <XStack
                  alignItems="center"
                  gap="$0.5"
                  backgroundColor="$color4"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Briefcase size={12} color={color10} />
                  <Text fontSize={10} color="$color10">
                    {item.yearsOfExperience}年
                  </Text>
                </XStack>
              </XStack>

              {/* 评分、会员数和价格 */}
              <XStack justifyContent="space-between" alignItems="center" marginTop="$0.5">
                <XStack alignItems="center" gap="$2">
                  <XStack alignItems="center" gap="$0.5">
                    <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {item.rating.toFixed(1)}
                    </Text>
                  </XStack>
                  <XStack alignItems="center" gap="$0.5">
                    <Users size={12} color={color10} />
                    <Text fontSize="$2" color="$color10">
                      {item.memberCount}
                    </Text>
                  </XStack>
                </XStack>

                <YStack alignItems="flex-end">
                  <Text fontSize={10} color="$color10">起</Text>
                  <XStack alignItems="baseline">
                    <Text fontSize={10} color={GOLD_COLOR}>¥</Text>
                    <Text fontSize="$4" fontWeight="700" color={GOLD_COLOR}>
                      {formatPrice(lowestPrice)}
                    </Text>
                    <Text fontSize={10} color="$color10">/年</Text>
                  </XStack>
                </YStack>
              </XStack>
            </YStack>
          </XStack>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar - 按照CLAUDE.md规范，标题居中 */}
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
            私人医生
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <>
            {/* 已签约用户显示服务台入口 */}
            {renderSubscribedBanner()}

            {/* 未签约用户显示服务介绍 */}
            {renderServiceBanner()}

            {/* 科室分类 */}
            {renderDepartmentCategories()}

            {/* 推荐医生 */}
            {renderFeaturedDoctors()}

            {/* 列表标题 */}
            <View paddingHorizontal="$2.5" marginBottom="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                全部医生
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : (
            <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
              <Briefcase size={48} color={color10} />
              <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
                暂无医生
              </Text>
              <Text fontSize="$3" color="$color10" marginTop="$1">
                试试调整筛选条件
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};
