/**
 * PrivateDoctorDetailScreen 私人医生详情页面
 * 医生信息展示、套餐选择、签约入口
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
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
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { getAvatarSource } from '@/constants/avatars';
import {
  PrivateDoctor,
  PrivateDoctorPackage,
  PackageLevel,
  DoctorDepartment,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';

const GOLD_COLOR = '#D4AF37';

interface PrivateDoctorDetailScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
    };
  };
}

export const PrivateDoctorDetailScreen: React.FC<PrivateDoctorDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { doctorId } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;

  const [doctor, setDoctor] = useState<PrivateDoctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PrivateDoctorPackage | null>(null);

  useEffect(() => {
    loadDoctorDetail();
  }, [doctorId]);

  const loadDoctorDetail = async () => {
    setLoading(true);
    const data = await privateDoctorService.getDoctorById(doctorId);
    setDoctor(data);
    const recommendedPackage = data?.packages.find((p) => p.level === PackageLevel.STANDARD);
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
      associate_chief: '副主任医师',
      attending_physician: '主治医师',
      attending: '主治医师',
      resident: '住院医师',
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
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$color10">医生信息未找到</Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar - 按照CLAUDE.md规范 */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="医生详情" />
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* 医生基本信息卡片 */}
          <View
            backgroundColor="$color2"
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <YStack gap="$2">
              {/* 头像和基本信息 */}
              <XStack gap="$2">
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
                    source={getAvatarSource(doctor.avatar, doctor.name)}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>

                <YStack flex={1} gap="$1" justifyContent="center">
                  <XStack alignItems="center" gap="$1.5">
                    <Text fontSize="$6" fontWeight="700" color="$color12">
                      {doctor.name}
                    </Text>
                    {doctor.verified && <CheckCircle size={18} color={GOLD_COLOR} />}
                  </XStack>

                  <XStack alignItems="center" gap="$1.5" flexWrap="wrap">
                    <View
                      backgroundColor="$color4"
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color={GOLD_COLOR} fontWeight="600">
                        {getTitleLabel(doctor.title)}
                      </Text>
                    </View>
                    <Text fontSize="$2" color="$color10">
                      {getDepartmentLabel(doctor.department)}
                    </Text>
                  </XStack>

                  <XStack alignItems="center" gap="$3">
                    <XStack alignItems="center" gap="$0.5">
                      <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {doctor.rating.toFixed(1)}
                      </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$0.5">
                      <Users size={14} color={color10} />
                      <Text fontSize="$2" color="$color10">
                        {doctor.memberCount}位会员
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>
              </XStack>

              {/* 医院信息 */}
              <XStack
                alignItems="center"
                gap="$1.5"
                padding="$2"
                backgroundColor="$color4"
                borderRadius="$3"
              >
                <MapPin size={16} color={primaryColor} />
                <Text fontSize="$3" color="$color12" flex={1}>
                  {doctor.hospital.name}
                </Text>
              </XStack>

              {/* 服务亮点 */}
              <XStack gap="$1.5" flexWrap="wrap">
                {doctor.isOnline && (
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
                      在线咨询
                    </Text>
                  </XStack>
                )}
                {doctor.overseasTraining.length > 0 && (
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
                    {doctor.yearsOfExperience}年经验
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          </View>

          {/* 医生理念 */}
          <View
            backgroundColor="$color2"
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
              医生理念
            </Text>
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              {doctor.philosophy}
            </Text>
          </View>

          {/* 专业背景 */}
          <View
            backgroundColor="$color2"
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              专业背景
            </Text>

            {/* 教育经历 */}
            <YStack gap="$1.5" marginBottom="$2">
              <XStack alignItems="center" gap="$1.5">
                <GraduationCap size={16} color={primaryColor} />
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  教育经历
                </Text>
              </XStack>
              {doctor.education.map((edu, index) => (
                <View
                  key={index}
                  paddingLeft="$2"
                  borderLeftWidth={2}
                  borderLeftColor="$primary"
                >
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {edu.degree}
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    {edu.institution}
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    {edu.year}
                  </Text>
                </View>
              ))}
            </YStack>

            {/* 海外进修 */}
            {doctor.overseasTraining.length > 0 && (
              <YStack gap="$1.5">
                <XStack alignItems="center" gap="$1.5">
                  <Globe size={16} color={GOLD_COLOR} />
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    海外进修
                  </Text>
                </XStack>
                {doctor.overseasTraining.map((training, index) => (
                  <View
                    key={index}
                    paddingLeft="$2"
                    borderLeftWidth={2}
                    borderLeftColor={GOLD_COLOR}
                  >
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {training.institution}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      {training.specialty}
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      {training.duration}
                    </Text>
                  </View>
                ))}
              </YStack>
            )}
          </View>

          {/* 擅长领域 */}
          <View
            backgroundColor="$color2"
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
              擅长领域
            </Text>
            <XStack gap="$1.5" flexWrap="wrap">
              {doctor.specialties.map((specialty, index) => (
                <View
                  key={index}
                  borderWidth={1}
                  borderColor="$primary"
                  backgroundColor="$color4"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$10"
                >
                  <Text fontSize="$2" color="$primary">
                    {specialty}
                  </Text>
                </View>
              ))}
            </XStack>
          </View>

          {/* 会员套餐选择 */}
          <View>
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              选择服务套餐
            </Text>

            <YStack gap="$2">
              {doctor.packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <Pressable key={pkg.id} onPress={() => setSelectedPackage(pkg)}>
                    <View
                      borderRadius="$5"
                      backgroundColor="$color2"
                      borderWidth={2}
                      borderColor={isSelected ? '$primary' : '$color5'}
                      padding="$2"
                      position="relative"
                    >
                      {/* 推荐标签 */}
                      {pkg.level === PackageLevel.STANDARD && (
                        <View
                          position="absolute"
                          top={-10}
                          right={16}
                          backgroundColor="$warning"
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$2"
                        >
                          <Text fontSize={10} color="white" fontWeight="600">
                            推荐
                          </Text>
                        </View>
                      )}

                      <YStack gap="$2">
                        {/* 套餐标题和价格 */}
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$4" fontWeight="700" color="$color12">
                            {getPackageLevelLabel(pkg.level)}
                          </Text>
                          <XStack alignItems="baseline" gap="$0.5">
                            <Text fontSize="$2" color={GOLD_COLOR}>¥</Text>
                            <Text fontSize="$6" fontWeight="700" color={GOLD_COLOR}>
                              {formatPrice(pkg.price)}
                            </Text>
                            <Text fontSize="$2" color="$color10">/年</Text>
                          </XStack>
                        </XStack>

                        <View height={1} backgroundColor="$color5" />

                        {/* 服务内容 */}
                        <YStack gap="$1.5">
                          <XStack justifyContent="space-between" alignItems="center">
                            <XStack alignItems="center" gap="$1.5">
                              <MessageCircle size={14} color={color10} />
                              <Text fontSize="$3" color="$color12">在线图文咨询</Text>
                            </XStack>
                            <Text fontSize="$3" fontWeight="600" color="$color12">
                              {formatServiceCount(pkg.services.onlineConsultations)}
                            </Text>
                          </XStack>

                          <XStack justifyContent="space-between" alignItems="center">
                            <XStack alignItems="center" gap="$1.5">
                              <Video size={14} color={color10} />
                              <Text fontSize="$3" color="$color12">视频咨询</Text>
                            </XStack>
                            <Text fontSize="$3" fontWeight="600" color="$color12">
                              {formatServiceCount(pkg.services.videoConsults)}
                            </Text>
                          </XStack>

                          <XStack justifyContent="space-between" alignItems="center">
                            <XStack alignItems="center" gap="$1.5">
                              <Phone size={14} color={color10} />
                              <Text fontSize="$3" color="$color12">线下面诊</Text>
                            </XStack>
                            <Text fontSize="$3" fontWeight="600" color="$color12">
                              {formatServiceCount(pkg.services.inPersonVisits)}
                            </Text>
                          </XStack>

                          <XStack justifyContent="space-between" alignItems="center">
                            <XStack alignItems="center" gap="$1.5">
                              <Home size={14} color={color10} />
                              <Text fontSize="$3" color="$color12">上门服务</Text>
                            </XStack>
                            <Text fontSize="$3" fontWeight="600" color="$color12">
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
                            <View height={1} backgroundColor="$color5" />
                            <YStack gap="$1">
                              {pkg.perks.annualCheckup && (
                                <XStack alignItems="center" gap="$1.5">
                                  <CheckCircle size={14} color={successColor} />
                                  <Text fontSize="$2" color="$color12">年度体检套餐</Text>
                                </XStack>
                              )}
                              {pkg.perks.greenChannel && (
                                <XStack alignItems="center" gap="$1.5">
                                  <CheckCircle size={14} color={successColor} />
                                  <Text fontSize="$2" color="$color12">就医绿色通道</Text>
                                </XStack>
                              )}
                              {pkg.perks.healthManager && (
                                <XStack alignItems="center" gap="$1.5">
                                  <CheckCircle size={14} color={successColor} />
                                  <Text fontSize="$2" color="$color12">专属健康管理师</Text>
                                </XStack>
                              )}
                              {pkg.perks.internationalReferral && (
                                <XStack alignItems="center" gap="$1.5">
                                  <CheckCircle size={14} color={successColor} />
                                  <Text fontSize="$2" color="$color12">国际医疗转诊</Text>
                                </XStack>
                              )}
                              {pkg.perks.familyMembers > 1 && (
                                <XStack alignItems="center" gap="$1.5">
                                  <CheckCircle size={14} color={successColor} />
                                  <Text fontSize="$2" color="$color12">
                                    覆盖{pkg.perks.familyMembers}位家庭成员
                                  </Text>
                                </XStack>
                              )}
                            </YStack>
                          </>
                        )}
                      </YStack>
                    </View>
                  </Pressable>
                );
              })}
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={80} />
        </YStack>
      </ScrollView>

      {/* 底部签约按钮 */}
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
        <Pressable onPress={handleSubscribe} disabled={!selectedPackage}>
          <View
            height={48}
            borderRadius="$10"
            backgroundColor={selectedPackage ? '$primary' : '$color10'}
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              立即签约 ¥{selectedPackage ? formatPrice(selectedPackage.price) : 0}/年
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
