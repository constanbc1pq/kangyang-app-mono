/**
 * Private Doctor Detail Screen
 * Phase 21: 私人医生详情页面 - 医生信息展示与签约决策
 *
 * 功能：
 * - 完整医生信息展示（背景/教育/海外经历）
 * - 4档会员套餐对比
 * - 服务内容详细说明
 * - 会员评价展示
 * - 签约流程入口
 */

import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  H4,
  Theme,
  ScrollView,
  Button,
  Separator,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
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
  Globe,
  Phone,
  MessageCircle,
  Home,
  Heart,
  Clock,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  PrivateDoctor,
  PrivateDoctorPackage,
  PackageLevel,
  DoctorDepartment,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';

const { width } = Dimensions.get('window');

interface PrivateDoctorDetailScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
    };
  };
}

export const PrivateDoctorDetailScreen: React.FC<
  PrivateDoctorDetailScreenProps
> = ({ navigation, route }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState<PrivateDoctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] =
    useState<PrivateDoctorPackage | null>(null);

  useEffect(() => {
    loadDoctorDetail();
  }, [doctorId]);

  const loadDoctorDetail = async () => {
    setLoading(true);
    const data = await privateDoctorService.getDoctorById(doctorId);
    setDoctor(data);
    // 默认选中推荐套餐（Standard）
    const recommendedPackage = data?.packages.find(
      (p) => p.level === PackageLevel.STANDARD
    );
    setSelectedPackage(recommendedPackage || data?.packages[0] || null);
    setLoading(false);
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

  const getPackageLevelLabel = (level: PackageLevel): string => {
    const labels: Record<PackageLevel, string> = {
      [PackageLevel.BASIC]: '基础版',
      [PackageLevel.STANDARD]: '标准版',
      [PackageLevel.PREMIUM]: '尊享版',
      [PackageLevel.VIP_FAMILY]: 'VIP家庭版',
    };
    return labels[level];
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString();
  };

  const formatServiceCount = (count: number): string => {
    return count === -1 ? '无限次' : `${count}次`;
  };

  const handleSubscribe = () => {
    if (!doctor || !selectedPackage) return;
    navigation.navigate('PrivateDoctorSubscribe', {
      doctorId: doctor.id,
      packageId: selectedPackage.id,
    });
  };

  if (loading) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
          <View flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </SafeAreaView>
      </Theme>
    );
  }

  if (!doctor) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
          <View flex={1} justifyContent="center" alignItems="center">
            <Text>医生信息未找到</Text>
          </View>
        </SafeAreaView>
      </Theme>
    );
  }

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          paddingHorizontal="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="$background"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <Text fontSize="$5" color="$text" fontWeight="600" marginLeft="$3">
            医生详情
          </Text>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* 医生基本信息卡片 */}
          <Card
            backgroundColor="$cardBg"
            padding="$4"
            margin="$4"
            borderRadius="$4"
            shadowColor="$shadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
          >
            <YStack space="$3">
              {/* 头像和基本信息 */}
              <XStack space="$3">
                <View
                  width={88}
                  height={88}
                  borderRadius="$4"
                  overflow="hidden"
                  backgroundColor="$surface"
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

                <YStack flex={1} space="$2" justifyContent="center">
                  <XStack alignItems="center" space="$2">
                    <Text fontSize="$7" fontWeight="700" color="$text">
                      {doctor.name}
                    </Text>
                    {doctor.verified && (
                      <CheckCircle size={18} color={COLORS.primary} />
                    )}
                  </XStack>

                  <XStack alignItems="center" space="$2" flexWrap="wrap">
                    <View
                      backgroundColor={COLORS.primaryLight}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text
                        fontSize="$3"
                        color="white"
                        fontWeight="600"
                      >
                        {getTitleLabel(doctor.title)}
                      </Text>
                    </View>
                    <Text fontSize="$3" color="$textSecondary">
                      {getDepartmentLabel(doctor.department)}
                    </Text>
                  </XStack>

                  <XStack alignItems="center" space="$3">
                    <XStack alignItems="center" space="$1">
                      <Star
                        size={16}
                        color={COLORS.warning}
                        fill={COLORS.warning}
                      />
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {doctor.rating.toFixed(1)}
                      </Text>
                    </XStack>
                    <XStack alignItems="center" space="$1">
                      <Users size={16} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {doctor.memberCount}位会员
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>
              </XStack>

              {/* 医院信息 */}
              <XStack
                alignItems="center"
                space="$2"
                padding="$3"
                backgroundColor="$surface"
                borderRadius="$3"
              >
                <MapPin size={16} color={COLORS.primary} />
                <Text fontSize="$3" color="$text" flex={1}>
                  {doctor.hospital.name}
                </Text>
              </XStack>

              {/* 服务亮点 */}
              <XStack space="$3" flexWrap="wrap">
                {doctor.isOnline && (
                  <XStack
                    alignItems="center"
                    space="$1"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    backgroundColor={`${COLORS.success}15`}
                    borderRadius="$2"
                  >
                    <Video size={14} color={COLORS.success} />
                    <Text fontSize="$2" color={COLORS.success} fontWeight="500">
                      在线咨询
                    </Text>
                  </XStack>
                )}
                {doctor.overseasTraining.length > 0 && (
                  <XStack
                    alignItems="center"
                    space="$1"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    backgroundColor={COLORS.primaryLight}
                    borderRadius="$2"
                  >
                    <Award size={14} color="white" />
                    <Text fontSize="$2" color="white" fontWeight="500">
                      海外进修
                    </Text>
                  </XStack>
                )}
                <XStack
                  alignItems="center"
                  space="$1"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor="$surface"
                  borderRadius="$2"
                >
                  <Briefcase size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$2" color="$textSecondary">
                    {doctor.yearsOfExperience}年经验
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          </Card>

          {/* 医生理念 */}
          <Card
            backgroundColor="$cardBg"
            padding="$4"
            marginHorizontal="$4"
            marginBottom="$4"
            borderRadius="$4"
            shadowColor="$shadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
          >
            <H4 fontSize="$5" fontWeight="700" color="$text" marginBottom="$3">
              医生理念
            </H4>
            <Text fontSize="$3" color="$textSecondary" lineHeight={22}>
              {doctor.philosophy}
            </Text>
          </Card>

          {/* 专业背景 */}
          <Card
            backgroundColor="$cardBg"
            padding="$4"
            marginHorizontal="$4"
            marginBottom="$4"
            borderRadius="$4"
            shadowColor="$shadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
          >
            <H4 fontSize="$5" fontWeight="700" color="$text" marginBottom="$3">
              专业背景
            </H4>

            {/* 教育经历 */}
            <YStack space="$3" marginBottom="$3">
              <XStack alignItems="center" space="$2">
                <GraduationCap size={18} color={COLORS.primary} />
                <Text fontSize="$4" fontWeight="600" color="$text">
                  教育经历
                </Text>
              </XStack>
              {doctor.education.map((edu, index) => (
                <View
                  key={index}
                  paddingLeft="$4"
                  borderLeftWidth={2}
                  borderLeftColor={COLORS.primaryLight}
                >
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {edu.degree}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {edu.institution}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {edu.year}
                  </Text>
                </View>
              ))}
            </YStack>

            {/* 海外进修 */}
            {doctor.overseasTraining.length > 0 && (
              <YStack space="$3">
                <XStack alignItems="center" space="$2">
                  <Globe size={18} color={COLORS.primary} />
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    海外进修
                  </Text>
                </XStack>
                {doctor.overseasTraining.map((training, index) => (
                  <View
                    key={index}
                    paddingLeft="$4"
                    borderLeftWidth={2}
                    borderLeftColor={COLORS.primaryLight}
                  >
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {training.institution}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      {training.specialty}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      {training.duration}
                    </Text>
                  </View>
                ))}
              </YStack>
            )}
          </Card>

          {/* 擅长领域 */}
          <Card
            backgroundColor="$cardBg"
            padding="$4"
            marginHorizontal="$4"
            marginBottom="$4"
            borderRadius="$4"
            shadowColor="$shadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
          >
            <H4 fontSize="$5" fontWeight="700" color="$text" marginBottom="$3">
              擅长领域
            </H4>
            <XStack space="$2" flexWrap="wrap">
              {doctor.specialties.map((specialty, index) => (
                <View
                  key={index}
                  backgroundColor="$surface"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$2"
                  marginBottom="$2"
                >
                  <Text fontSize="$3" color="$text">
                    {specialty}
                  </Text>
                </View>
              ))}
            </XStack>
          </Card>

          {/* 会员套餐选择 */}
          <View paddingHorizontal="$4" paddingVertical="$2">
            <H4 fontSize="$5" fontWeight="700" color="$text" marginBottom="$3">
              选择服务套餐
            </H4>

            <YStack space="$3">
              {doctor.packages.map((pkg) => (
                <Pressable
                  key={pkg.id}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  <Card
                    borderRadius="$4"
                    backgroundColor="$cardBg"
                    borderWidth={2}
                    borderColor={
                      selectedPackage?.id === pkg.id
                        ? COLORS.primary
                        : '$borderColor'
                    }
                    padding="$4"
                    shadowColor="$shadow"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.08}
                    shadowRadius={8}
                    elevation={3}
                    position="relative"
                  >
                    {/* 推荐标签 */}
                    {pkg.level === PackageLevel.STANDARD && (
                      <View
                        position="absolute"
                        top={-8}
                        right={16}
                        backgroundColor={COLORS.warning}
                        paddingHorizontal="$3"
                        paddingVertical="$1"
                        borderRadius="$3"
                      >
                        <Text fontSize={11} color="white" fontWeight="600">
                          推荐
                        </Text>
                      </View>
                    )}

                    <YStack space="$3">
                      {/* 套餐标题和价格 */}
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$5" fontWeight="700" color="$text">
                          {getPackageLevelLabel(pkg.level)}
                        </Text>
                        <XStack alignItems="baseline" space="$1">
                          <Text fontSize="$2" color={COLORS.primary}>
                            ¥
                          </Text>
                          <Text
                            fontSize="$7"
                            fontWeight="700"
                            color={COLORS.primary}
                          >
                            {formatPrice(pkg.price)}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            /年
                          </Text>
                        </XStack>
                      </XStack>

                      <Separator borderColor="$borderColor" />

                      {/* 服务内容 */}
                      <YStack space="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" space="$2">
                            <MessageCircle size={16} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$text">
                              在线图文咨询
                            </Text>
                          </XStack>
                          <Text fontSize="$3" fontWeight="600" color="$text">
                            {formatServiceCount(pkg.services.onlineConsultations)}
                          </Text>
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" space="$2">
                            <Video size={16} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$text">
                              视频咨询
                            </Text>
                          </XStack>
                          <Text fontSize="$3" fontWeight="600" color="$text">
                            {formatServiceCount(pkg.services.videoConsults)}
                          </Text>
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" space="$2">
                            <Phone size={16} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$text">
                              线下面诊
                            </Text>
                          </XStack>
                          <Text fontSize="$3" fontWeight="600" color="$text">
                            {formatServiceCount(pkg.services.inPersonVisits)}
                          </Text>
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" space="$2">
                            <Home size={16} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$text">
                              上门服务
                            </Text>
                          </XStack>
                          <Text fontSize="$3" fontWeight="600" color="$text">
                            {formatServiceCount(pkg.services.homeVisits)}
                          </Text>
                        </XStack>
                      </YStack>

                      {/* 增值权益 */}
                      {(pkg.perks.annualCheckup ||
                        pkg.perks.greenChannel ||
                        pkg.perks.healthManager ||
                        pkg.perks.internationalReferral) && (
                        <>
                          <Separator borderColor="$borderColor" />
                          <YStack space="$2">
                            {pkg.perks.annualCheckup && (
                              <XStack alignItems="center" space="$2">
                                <CheckCircle
                                  size={14}
                                  color={COLORS.success}
                                />
                                <Text fontSize="$2" color="$text">
                                  年度体检套餐
                                </Text>
                              </XStack>
                            )}
                            {pkg.perks.greenChannel && (
                              <XStack alignItems="center" space="$2">
                                <CheckCircle
                                  size={14}
                                  color={COLORS.success}
                                />
                                <Text fontSize="$2" color="$text">
                                  就医绿色通道
                                </Text>
                              </XStack>
                            )}
                            {pkg.perks.healthManager && (
                              <XStack alignItems="center" space="$2">
                                <CheckCircle
                                  size={14}
                                  color={COLORS.success}
                                />
                                <Text fontSize="$2" color="$text">
                                  专属健康管理师
                                </Text>
                              </XStack>
                            )}
                            {pkg.perks.internationalReferral && (
                              <XStack alignItems="center" space="$2">
                                <CheckCircle
                                  size={14}
                                  color={COLORS.success}
                                />
                                <Text fontSize="$2" color="$text">
                                  国际医疗转诊
                                </Text>
                              </XStack>
                            )}
                            {pkg.perks.familyMembers > 1 && (
                              <XStack alignItems="center" space="$2">
                                <CheckCircle
                                  size={14}
                                  color={COLORS.success}
                                />
                                <Text fontSize="$2" color="$text">
                                  覆盖{pkg.perks.familyMembers}位家庭成员
                                </Text>
                              </XStack>
                            )}
                          </YStack>
                        </>
                      )}
                    </YStack>
                  </Card>
                </Pressable>
              ))}
            </YStack>
          </View>

          {/* 底部占位，避免被固定按钮遮挡 */}
          <View height={100} />
        </ScrollView>

        {/* 底部签约按钮 */}
        <View
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          backgroundColor="$background"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          padding="$4"
          shadowColor="$shadow"
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={5}
        >
          <Button
            size="$5"
            backgroundColor={COLORS.primary}
            color="white"
            borderRadius="$3"
            fontWeight="600"
            onPress={handleSubscribe}
            disabled={!selectedPackage}
          >
            立即签约 ¥{selectedPackage ? formatPrice(selectedPackage.price) : 0}/年
          </Button>
        </View>
      </SafeAreaView>
    </Theme>
  );
};
