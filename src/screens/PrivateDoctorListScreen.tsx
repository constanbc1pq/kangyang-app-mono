/**
 * Private Doctor List Screen
 * Phase 21: 私人医生列表页面 - 高端医疗服务发现
 *
 * 设计理念：
 * - 庄重、专业、高端的视觉呈现
 * - 突出医生的权威性和资历
 * - 强调服务的优质性和专属性
 * - 参考邻里帮设计：Banner + 分类 + 推荐 + 列表
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  Button,
  Theme,
  ScrollView,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  ActivityIndicator,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  Filter,
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
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  PrivateDoctor,
  DoctorDepartment,
  HospitalLevel,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface PrivateDoctorListScreenProps {
  navigation: any;
}

export const PrivateDoctorListScreen: React.FC<PrivateDoctorListScreenProps> = ({
  navigation,
}) => {
  const [doctors, setDoctors] = useState<PrivateDoctor[]>([]);
  const [featuredDoctors, setFeaturedDoctors] = useState<PrivateDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    DoctorDepartment | 'all'
  >('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<{
    hospitalLevel?: HospitalLevel;
    minPrice?: number;
    maxPrice?: number;
    isOnline?: boolean;
    hasOverseasTraining?: boolean;
  }>({});

  // 科室分类 - 使用医学图标
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
      loadDoctors();
      loadFeaturedDoctors();
    }, [selectedDepartment, filters])
  );

  const loadDoctors = async () => {
    setLoading(true);
    const filterParams =
      selectedDepartment === 'all'
        ? filters
        : { ...filters, department: selectedDepartment };

    const data = await privateDoctorService.getDoctors(filterParams);
    setDoctors(data);
    setLoading(false);
  };

  const loadFeaturedDoctors = async () => {
    // 获取评分最高的顶级医生
    const allDoctors = await privateDoctorService.getDoctors({
      hasOverseasTraining: true,
    });
    const sorted = allDoctors
      .filter((d) => d.rating >= 4.8)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    setFeaturedDoctors(sorted);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDoctors();
    await loadFeaturedDoctors();
    setRefreshing(false);
  };

  const handleDoctorPress = (doctorId: string) => {
    navigation.navigate('PrivateDoctorDetail', { doctorId });
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
      attending_physician: '主治医师',
    };
    return labels[title] || title;
  };

  // 渲染顶部Banner - 高端服务介绍
  const renderBanner = () => {
    return (
      <View
        marginHorizontal="$4"
        marginTop="$3"
        borderRadius="$4"
        overflow="hidden"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        shadowRadius={12}
        elevation={8}
      >
        <View
          backgroundColor="#1a1a2e"
          padding="$5"
          position="relative"
        >
          {/* 装饰性背景 */}
          <View
            position="absolute"
            top={-40}
            right={-40}
            width={180}
            height={180}
            borderRadius={90}
            backgroundColor="rgba(212, 175, 55, 0.1)"
          />
          <View
            position="absolute"
            bottom={-20}
            left={-20}
            width={120}
            height={120}
            borderRadius={60}
            backgroundColor="rgba(212, 175, 55, 0.08)"
          />

          <XStack space="$3" alignItems="center">
            <View
              width={64}
              height={64}
              borderRadius={32}
              backgroundColor="rgba(212, 175, 55, 0.2)"
              borderWidth={2}
              borderColor="#d4af37"
              justifyContent="center"
              alignItems="center"
            >
              <Crown size={36} color="#d4af37" />
            </View>

            <YStack flex={1} space="$2">
              <XStack space="$2" alignItems="center">
                <Text fontSize="$6" fontWeight="700" color="white">
                  私人医生服务
                </Text>
                <View
                  backgroundColor="#d4af37"
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Text fontSize={10} color="#1a1a2e" fontWeight="700">
                    VIP
                  </Text>
                </View>
              </XStack>
              <Text fontSize="$3" color="rgba(255,255,255,0.85)" lineHeight={20}>
                顶级三甲医院专家 • 1对1专属健康管理
              </Text>
              <XStack space="$3" marginTop="$1">
                <XStack space="$1" alignItems="center">
                  <Shield size={14} color="#d4af37" />
                  <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                    国际认证
                  </Text>
                </XStack>
                <XStack space="$1" alignItems="center">
                  <Award size={14} color="#d4af37" />
                  <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                    海外进修
                  </Text>
                </XStack>
                <XStack space="$1" alignItems="center">
                  <GraduationCap size={14} color="#d4af37" />
                  <Text fontSize="$2" color="rgba(255,255,255,0.7)">
                    博士学历
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          </XStack>
        </View>
      </View>
    );
  };

  // 渲染科室分类
  const renderDepartmentCategories = () => {
    return (
      <View marginTop="$4" marginBottom="$2">
        <Text
          fontSize="$5"
          fontWeight="700"
          color="$text"
          marginHorizontal="$4"
          marginBottom="$3"
        >
          选择专科
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <XStack space="$3">
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept.id}
                onPress={() =>
                  setSelectedDepartment(dept.id as DoctorDepartment | 'all')
                }
              >
                <View
                  backgroundColor={
                    selectedDepartment === dept.id ? '#1a1a2e' : 'white'
                  }
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  minWidth={90}
                  alignItems="center"
                  borderWidth={1}
                  borderColor={
                    selectedDepartment === dept.id ? '#1a1a2e' : '$borderColor'
                  }
                  shadowColor="$shadow"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={selectedDepartment === dept.id ? 0.15 : 0.05}
                  shadowRadius={4}
                  elevation={selectedDepartment === dept.id ? 4 : 2}
                >
                  <Text fontSize={32} marginBottom="$1">
                    {dept.icon}
                  </Text>
                  <Text
                    fontSize="$2"
                    color={selectedDepartment === dept.id ? 'white' : '$text'}
                    fontWeight={selectedDepartment === dept.id ? '600' : '400'}
                  >
                    {dept.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  // 渲染推荐医生 - 横向滚动卡片
  const renderFeaturedDoctors = () => {
    if (featuredDoctors.length === 0) return null;

    return (
      <View marginTop="$4" marginBottom="$2">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginHorizontal="$4"
          marginBottom="$3"
        >
          <XStack space="$2" alignItems="center">
            <TrendingUp size={20} color="#d4af37" />
            <Text fontSize="$5" fontWeight="700" color="$text">
              推荐专家
            </Text>
          </XStack>
          <TouchableOpacity onPress={() => setSelectedDepartment('all')}>
            <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
              查看全部 →
            </Text>
          </TouchableOpacity>
        </XStack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <XStack space="$3">
            {featuredDoctors.map((doctor) => {
              const lowestPrice = Math.min(
                ...doctor.packages.map((p) => p.price)
              );
              return (
                <TouchableOpacity
                  key={doctor.id}
                  onPress={() => handleDoctorPress(doctor.id)}
                >
                  <Card
                    width={200}
                    backgroundColor="white"
                    borderRadius="$4"
                    padding="$4"
                    borderWidth={1}
                    borderColor="$borderColor"
                    shadowColor="$shadow"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={0.1}
                    shadowRadius={8}
                    elevation={4}
                  >
                    {/* 顶部标签 */}
                    {doctor.overseasTraining.length > 0 && (
                      <View
                        position="absolute"
                        top={12}
                        right={12}
                        backgroundColor="#d4af37"
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text fontSize={10} color="white" fontWeight="700">
                          海外进修
                        </Text>
                      </View>
                    )}

                    {/* 医生头像 */}
                    <View alignItems="center" marginBottom="$3">
                      <View
                        width={80}
                        height={80}
                        borderRadius={40}
                        backgroundColor="$surface"
                        borderWidth={3}
                        borderColor="#d4af37"
                        overflow="hidden"
                        marginBottom="$2"
                      >
                        {doctor.avatar ? (
                          <Image
                            source={{ uri: doctor.avatar }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            flex={1}
                            justifyContent="center"
                            alignItems="center"
                            backgroundColor={COLORS.primary}
                          >
                            <Text fontSize={36} fontWeight="600" color="white">
                              {doctor.name[0]}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* 姓名和认证 */}
                      <XStack alignItems="center" space="$1" marginBottom="$1">
                        <Text
                          fontSize="$5"
                          fontWeight="700"
                          color="$text"
                          numberOfLines={1}
                        >
                          {doctor.name}
                        </Text>
                        {doctor.verified && (
                          <CheckCircle size={16} color="#d4af37" />
                        )}
                      </XStack>

                      {/* 职称 */}
                      <View
                        backgroundColor="rgba(212, 175, 55, 0.15)"
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text
                          fontSize="$2"
                          color="#b8941f"
                          fontWeight="600"
                        >
                          {getTitleLabel(doctor.title)}
                        </Text>
                      </View>
                    </View>

                    {/* 医院 */}
                    <XStack
                      alignItems="center"
                      space="$1"
                      marginBottom="$2"
                      justifyContent="center"
                    >
                      <MapPin size={12} color={COLORS.textSecondary} />
                      <Text
                        fontSize="$2"
                        color="$textSecondary"
                        numberOfLines={1}
                        textAlign="center"
                      >
                        {doctor.hospital.name}
                      </Text>
                    </XStack>

                    {/* 评分和会员数 */}
                    <XStack
                      justifyContent="center"
                      space="$3"
                      marginBottom="$3"
                    >
                      <XStack alignItems="center" space="$1">
                        <Star size={14} color="#d4af37" fill="#d4af37" />
                        <Text fontSize="$3" fontWeight="600" color="$text">
                          {doctor.rating.toFixed(1)}
                        </Text>
                      </XStack>
                      <XStack alignItems="center" space="$1">
                        <Users size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$2" color="$textSecondary">
                          {doctor.memberCount}位会员
                        </Text>
                      </XStack>
                    </XStack>

                    {/* 价格 */}
                    <View
                      backgroundColor="$surface"
                      padding="$2"
                      borderRadius="$2"
                      alignItems="center"
                    >
                      <Text fontSize="$1" color="$textSecondary" marginBottom="$0.5">
                        服务起价
                      </Text>
                      <XStack alignItems="baseline" space="$0.5">
                        <Text fontSize={10} color="#d4af37">
                          ¥
                        </Text>
                        <Text fontSize="$5" fontWeight="700" color="#d4af37">
                          {formatPrice(lowestPrice)}
                        </Text>
                        <Text fontSize={10} color="$textSecondary">
                          /年
                        </Text>
                      </XStack>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  // 渲染医生卡片 - 完整版
  const renderDoctorCard = ({ item }: { item: PrivateDoctor }) => {
    const lowestPrice = Math.min(...item.packages.map((p) => p.price));

    return (
      <TouchableOpacity
        onPress={() => handleDoctorPress(item.id)}
        style={{ marginBottom: 16 }}
      >
        <Card
          backgroundColor="white"
          padding="$4"
          borderRadius="$4"
          shadowColor="$shadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.08}
          shadowRadius={8}
          elevation={3}
        >
          <XStack space="$3">
            {/* 医生头像 */}
            <View>
              <View
                width={88}
                height={88}
                borderRadius="$4"
                overflow="hidden"
                backgroundColor="$surface"
                borderWidth={2}
                borderColor="rgba(212, 175, 55, 0.3)"
              >
                {item.avatar ? (
                  <Image
                    source={{ uri: item.avatar }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={COLORS.primary}
                  >
                    <Text fontSize={36} fontWeight="600" color="white">
                      {item.name[0]}
                    </Text>
                  </View>
                )}
              </View>

              {/* 在线状态 */}
              {item.isOnline && (
                <View
                  position="absolute"
                  bottom={-4}
                  left="50%"
                  marginLeft={-24}
                  backgroundColor={COLORS.success}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                  borderWidth={2}
                  borderColor="white"
                >
                  <Text fontSize={10} color="white" fontWeight="600">
                    在线
                  </Text>
                </View>
              )}
            </View>

            {/* 医生信息 */}
            <YStack flex={1} space="$2">
              {/* 姓名和认证 */}
              <XStack alignItems="center" space="$2">
                <Text fontSize="$6" fontWeight="700" color="$text">
                  {item.name}
                </Text>
                {item.verified && (
                  <CheckCircle size={18} color="#d4af37" />
                )}
              </XStack>

              {/* 职称和科室 */}
              <XStack alignItems="center" space="$2" flexWrap="wrap">
                <View
                  backgroundColor="rgba(212, 175, 55, 0.15)"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text
                    fontSize="$2"
                    color="#b8941f"
                    fontWeight="600"
                  >
                    {getTitleLabel(item.title)}
                  </Text>
                </View>
                <Text fontSize="$3" color="$textSecondary">
                  {getDepartmentLabel(item.department)}
                </Text>
              </XStack>

              {/* 医院 */}
              <XStack alignItems="center" space="$1">
                <MapPin size={14} color={COLORS.textSecondary} />
                <Text
                  fontSize="$3"
                  color="$textSecondary"
                  numberOfLines={1}
                  flex={1}
                >
                  {item.hospital.name}
                </Text>
              </XStack>

              {/* 亮点标签 */}
              <XStack space="$2" flexWrap="wrap">
                {item.isOnline && (
                  <XStack
                    alignItems="center"
                    space="$1"
                    backgroundColor={`${COLORS.success}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Video size={12} color={COLORS.success} />
                    <Text fontSize={11} color={COLORS.success} fontWeight="500">
                      视频咨询
                    </Text>
                  </XStack>
                )}
                {item.overseasTraining.length > 0 && (
                  <XStack
                    alignItems="center"
                    space="$1"
                    backgroundColor="rgba(212, 175, 55, 0.15)"
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                  >
                    <Award size={12} color="#d4af37" />
                    <Text fontSize={11} color="#b8941f" fontWeight="500">
                      海外进修
                    </Text>
                  </XStack>
                )}
                <XStack
                  alignItems="center"
                  space="$1"
                  backgroundColor="$surface"
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Briefcase size={12} color={COLORS.textSecondary} />
                  <Text fontSize={11} color="$textSecondary">
                    {item.yearsOfExperience}年
                  </Text>
                </XStack>
              </XStack>

              {/* 评分、会员数和价格 */}
              <XStack
                justifyContent="space-between"
                alignItems="center"
                marginTop="$1"
              >
                <XStack alignItems="center" space="$3">
                  <XStack alignItems="center" space="$1">
                    <Star size={16} color="#d4af37" fill="#d4af37" />
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      {item.rating.toFixed(1)}
                    </Text>
                  </XStack>
                  <XStack alignItems="center" space="$1">
                    <Users size={14} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$textSecondary">
                      {item.memberCount}
                    </Text>
                  </XStack>
                </XStack>

                <YStack alignItems="flex-end">
                  <Text fontSize={10} color="$textSecondary">
                    起
                  </Text>
                  <XStack alignItems="baseline" space="$0.5">
                    <Text fontSize={11} color="#d4af37">
                      ¥
                    </Text>
                    <Text fontSize="$5" fontWeight="700" color="#d4af37">
                      {formatPrice(lowestPrice)}
                    </Text>
                    <Text fontSize={11} color="$textSecondary">
                      /年
                    </Text>
                  </XStack>
                </YStack>
              </XStack>
            </YStack>
          </XStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        {/* Header */}
        <View
          backgroundColor="white"
          paddingTop="$3"
          paddingHorizontal="$4"
          paddingBottom="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <XStack space="$2" alignItems="center">
                <ArrowLeft size={24} color={COLORS.text} />
                <Text fontSize="$6" color="$text" fontWeight="700">
                  私人医生
                </Text>
              </XStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowFilterPanel(true)}>
              <XStack
                space="$1"
                alignItems="center"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$3"
                backgroundColor="$surface"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Filter size={16} color={COLORS.text} />
                <Text fontSize="$3" color="$text" fontWeight="500">
                  筛选
                </Text>
              </XStack>
            </TouchableOpacity>
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
              {/* Banner */}
              {renderBanner()}

              {/* 科室分类 */}
              {renderDepartmentCategories()}

              {/* 推荐医生 */}
              {renderFeaturedDoctors()}

              {/* 列表标题 */}
              <View marginTop="$4" marginHorizontal="$4" marginBottom="$3">
                <Text fontSize="$5" fontWeight="700" color="$text">
                  全部医生
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            loading ? (
              <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                paddingVertical="$8"
              >
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                paddingVertical="$8"
              >
                <Briefcase size={48} color={COLORS.textSecondary} />
                <Text fontSize="$5" fontWeight="600" color="$text" marginTop="$3">
                  暂无医生
                </Text>
                <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                  试试调整筛选条件
                </Text>
              </View>
            )
          }
        />
      </SafeAreaView>
    </Theme>
  );
};
