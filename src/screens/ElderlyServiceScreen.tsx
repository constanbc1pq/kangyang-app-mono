import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { View, Text, XStack, YStack, Card } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Phone, Heart, ChevronDown, ChevronUp, CheckCircle, Info, Shield, Award, Home, Ambulance, Stethoscope, Users } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { LinearGradient } from 'expo-linear-gradient';
import {
  servicePackages,
  qualificationDetails,
  elderlyWhyNeed,
  escortWhyNeed,
  escortServiceDetails,
  escortWhyNeedDetails,
  medicalStaffWhyNeed,
  medicalStaffDetails,
  faqsByServiceType,
  getCaregiversByServiceType,
} from '@/services/elderlyService';
import type { ServiceType, Caregiver } from '@/types/elderly';
import { CaregiverCard } from '@/components/CaregiverCard';

const ElderlyServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState<ServiceType>('elderly-care');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showAllFAQ, setShowAllFAQ] = useState(false);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [showAllCaregivers, setShowAllCaregivers] = useState(false);

  const banners = [
    {
      image: '/banner-elderly-care.jpg',
      title: '专业养老护理服务',
      subtitle: '持牌护理团队 · 贴心照护每一天',
      colors: ['#f97316', '#ec4899'],
    },
    {
      image: '/banner-escort-service.jpg',
      title: '安心陪诊护送',
      subtitle: '专业陪同 · 让就医不再孤单',
      colors: ['#3b82f6', '#06b6d4'],
    },
    {
      image: '/banner-medical-staff.jpg',
      title: '医护人员替补',
      subtitle: '快速配对 · 解决人手短缺',
      colors: ['#8b5cf6', '#ec4899'],
    },
  ];

  const serviceTypes = [
    { id: 'elderly-care', name: '长者照顾', icon: Home, description: '日常起居照顾' },
    { id: 'escort', name: '陪诊服务', icon: Ambulance, description: '就医陪同护送' },
    { id: 'medical-staff', name: '医护替补', icon: Stethoscope, description: '机构人手支援' },
  ];

  // Banner自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 加载护理人员数据
  useEffect(() => {
    const loadedCaregivers = getCaregiversByServiceType(selectedService);
    setCaregivers(loadedCaregivers);
  }, [selectedService]);

  // 切换服务类型时重置状态
  useEffect(() => {
    setExpandedFAQ(null);
    setShowAllFAQ(false);
    setShowAllCaregivers(false); // 重置护理人员展开状态
  }, [selectedService]);

  const handleCaregiverPress = (caregiverId: string) => {
    navigation.navigate('CaregiverDetail' as never, {
      caregiverId,
      serviceType: selectedService,
    } as never);
  };

  const handleOnlineConsult = () => {
    // 导航到AI咨询，标记来源为养老服务
    navigation.navigate('AIConsultation' as never, { source: 'elderly_service' } as never);
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <YStack flex={1} marginLeft="$3">
          <Text fontSize="$5" fontWeight="600" color="$text">
            养老服务
          </Text>
          <Text fontSize="$2" color="$textSecondary">
            专业照护 · 温暖陪伴
          </Text>
        </YStack>
        <Pressable
          onPress={() => {/* 紧急联系 */}}
          style={{
            backgroundColor: COLORS.error,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Phone size={14} color="white" />
          <Text fontSize="$2" color="white" fontWeight="600">
            紧急联系
          </Text>
        </Pressable>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack>
          {/* Banner轮播区 */}
          <View height={200} position="relative">
            {banners.map((banner, index) => (
              <View
                key={index}
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={currentBanner === index ? 1 : 0}
                style={{ transition: 'opacity 0.5s' }}
              >
                <LinearGradient
                  colors={banner.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, padding: 24, justifyContent: 'flex-end' }}
                >
                  <XStack alignItems="center" marginBottom="$2">
                    <Heart size={20} color="white" />
                    <Text fontSize="$7" fontWeight="bold" color="white" marginLeft="$2">
                      {banner.title}
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                    {banner.subtitle}
                  </Text>
                  <YStack marginTop="$4">
                    <XStack gap="$3">
                      <View backgroundColor="rgba(255,255,255,0.2)" borderRadius="$3" padding="$3" flex={1}>
                        <Text fontSize="$6" fontWeight="bold" color="white">500+</Text>
                        <Text fontSize="$2" color="rgba(255,255,255,0.9)">服务家庭</Text>
                      </View>
                      <View backgroundColor="rgba(255,255,255,0.2)" borderRadius="$3" padding="$3" flex={1}>
                        <Text fontSize="$6" fontWeight="bold" color="white">50+</Text>
                        <Text fontSize="$2" color="rgba(255,255,255,0.9)">专业护理员</Text>
                      </View>
                      <View backgroundColor="rgba(255,255,255,0.2)" borderRadius="$3" padding="$3" flex={1}>
                        <Text fontSize="$6" fontWeight="bold" color="white">4.9</Text>
                        <Text fontSize="$2" color="rgba(255,255,255,0.9)">服务评分</Text>
                      </View>
                    </XStack>
                  </YStack>
                </LinearGradient>
              </View>
            ))}

            {/* Banner指示器 */}
            <XStack
              position="absolute"
              bottom={16}
              left={0}
              right={0}
              justifyContent="center"
              gap="$2"
            >
              {banners.map((_, index) => (
                <View
                  key={index}
                  width={currentBanner === index ? 24 : 8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={currentBanner === index ? 'white' : 'rgba(255,255,255,0.5)'}
                  style={{ transition: 'all 0.3s' }}
                />
              ))}
            </XStack>
          </View>

          {/* 服务类型Tab */}
          <View backgroundColor="$surface" padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
            <XStack gap="$3">
              {serviceTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedService(type.id as ServiceType)}
                    style={{ flex: 1 }}
                  >
                    <View
                      backgroundColor={selectedService === type.id ? COLORS.primary : '$background'}
                      borderRadius="$3"
                      padding="$3"
                      alignItems="center"
                      borderWidth={1}
                      borderColor={selectedService === type.id ? COLORS.primary : '$borderColor'}
                    >
                      <IconComponent size={24} color={selectedService === type.id ? 'white' : COLORS.text} />
                      <Text
                        fontSize="$3"
                        fontWeight={selectedService === type.id ? '600' : '400'}
                        color={selectedService === type.id ? 'white' : '$text'}
                        marginTop="$1"
                      >
                        {type.name}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
          </View>

          {/* ========== 长者照顾服务 sections ========== */}
          {selectedService === 'elderly-care' && (
            <>
              {/* 为什么需要长者照顾服务？ */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  {elderlyWhyNeed.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary" marginBottom="$3" lineHeight={22}>
                  {elderlyWhyNeed.content}
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {elderlyWhyNeed.situations.map((situation, index) => (
                    <View
                      key={index}
                      backgroundColor="rgba(99, 102, 241, 0.1)"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$6"
                    >
                      <Text fontSize="$2" color={COLORS.primary}>
                        {situation}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              {/* 服务套餐 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  服务套餐
                </Text>
                <YStack gap="$3">
                  {servicePackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      padding="$4"
                      backgroundColor={pkg.popular ? 'rgba(99, 102, 241, 0.05)' : '$background'}
                      borderRadius="$4"
                      borderWidth={pkg.popular ? 2 : 1}
                      borderColor={pkg.popular ? COLORS.primary : '$borderColor'}
                      position="relative"
                    >
                      {pkg.popular && (
                        <View
                          position="absolute"
                          top={-8}
                          right={16}
                          backgroundColor={COLORS.primary}
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          <Text fontSize="$1" color="white" fontWeight="600">
                            最受欢迎
                          </Text>
                        </View>
                      )}

                      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                        <YStack>
                          <Text fontSize="$5" fontWeight="bold" color="$text">
                            {pkg.name}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            {pkg.description}
                          </Text>
                        </YStack>
                      </XStack>

                      <YStack gap="$2" marginBottom="$3">
                        {pkg.prices.map((price, index) => (
                          <XStack key={index} justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" color="$textSecondary">
                              {price.type}
                            </Text>
                            <XStack alignItems="baseline" gap="$1">
                              <Text fontSize="$5" fontWeight="bold" color={COLORS.primary}>
                                ¥{price.price}
                              </Text>
                              <Text fontSize="$2" color="$textSecondary">
                                {price.unit}
                              </Text>
                              {price.save && (
                                <Text fontSize="$1" color={COLORS.success}>
                                  {price.save}
                                </Text>
                              )}
                            </XStack>
                          </XStack>
                        ))}
                      </YStack>

                      <YStack gap="$1" marginBottom="$3">
                        {pkg.features.map((feature, index) => (
                          <XStack key={index} alignItems="center" gap="$2">
                            <CheckCircle size={12} color={COLORS.primary} />
                            <Text fontSize="$2" color="$textSecondary">
                              {feature}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>

                      <View backgroundColor="rgba(99, 102, 241, 0.1)" padding="$2" borderRadius="$2">
                        <Text fontSize="$2" color="$text">
                          💡 {pkg.note}
                          {pkg.discount && ` · ${pkg.discount}`}
                        </Text>
                      </View>
                    </Card>
                  ))}
                </YStack>

                <View backgroundColor={COLORS.primaryLight} padding="$3" borderRadius="$3" marginTop="$3">
                  <XStack alignItems="center" gap="$2">
                    <Info size={16} color="white" />
                    <Text fontSize="$2" color="white" flex={1}>
                      深夜时段（23:00-8:00）和24小时服务价格会有所调整，具体请咨询客服
                    </Text>
                  </XStack>
                </View>
              </View>

              {/* 信任徽章 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <XStack gap="$4" justifyContent="space-around">
                  {[
                    { icon: Shield, title: '资质认证', desc: '持证上岗' },
                    { icon: Award, title: '专业培训', desc: '定期考核' },
                    { icon: Heart, title: '保险保障', desc: '意外全覆盖' },
                    { icon: CheckCircle, title: '满意保证', desc: '随时更换' },
                  ].map((badge, index) => {
                    const IconComponent = badge.icon;
                    return (
                      <YStack key={index} alignItems="center" gap="$2">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={COLORS.primaryLight}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={24} color="white" />
                        </View>
                        <Text fontSize="$2" fontWeight="600" color="$text">
                          {badge.title}
                        </Text>
                        <Text fontSize="$1" color="$textSecondary">
                          {badge.desc}
                        </Text>
                      </YStack>
                    );
                  })}
                </XStack>
              </View>
            </>
          )}

          {/* ========== 陪诊服务 sections ========== */}
          {selectedService === 'escort' && (
            <>
              {/* 什么是陪诊服务？ */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  {escortWhyNeed.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary" marginBottom="$3" lineHeight={22}>
                  {escortWhyNeed.content}
                </Text>
                <Text fontSize="$3" color="$textSecondary" lineHeight={22}>
                  {escortWhyNeed.additionalInfo}
                </Text>
              </View>

              {/* 服务内容 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  服务内容
                </Text>
                <YStack gap="$2">
                  {escortServiceDetails.services.map((service, index) => (
                    <XStack key={index} alignItems="flex-start" gap="$2">
                      <CheckCircle size={16} color={COLORS.success} />
                      <Text fontSize="$3" color="$text" flex={1}>
                        {service}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 适用人群 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  适用人群
                </Text>
                <YStack gap="$2">
                  {escortServiceDetails.suitableFor.map((person, index) => (
                    <XStack key={index} alignItems="center" gap="$2">
                      <Users size={16} color={COLORS.primary} />
                      <Text fontSize="$3" color="$text">
                        {person}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 为什么需要陪诊员？ */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  为什么需要陪诊员？
                </Text>
                <YStack gap="$4">
                  {escortWhyNeedDetails.sections.map((section, index) => (
                    <YStack key={index}>
                      <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
                        {section.title}
                      </Text>
                      <Text fontSize="$3" color="$textSecondary" lineHeight={20}>
                        {section.content}
                      </Text>
                    </YStack>
                  ))}
                </YStack>
              </View>

              {/* CTA */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <LinearGradient
                  colors={['#3b82f6', '#06b6d4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 16, padding: 24, alignItems: 'center' }}
                >
                  <Text fontSize="$6" fontWeight="bold" color="white" marginBottom="$2">
                    需要陪诊服务？
                  </Text>
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)" marginBottom="$4">
                    超过500位经专业培训的陪诊员，获9成客户给予五星好评
                  </Text>
                  <Pressable>
                    <View
                      backgroundColor="white"
                      paddingHorizontal="$6"
                      paddingVertical="$3"
                      borderRadius="$3"
                    >
                      <Text fontSize="$4" fontWeight="600" color={COLORS.primary}>
                        立即咨询预约
                      </Text>
                    </View>
                  </Pressable>
                </LinearGradient>
              </View>
            </>
          )}

          {/* ========== 医护替补 sections ========== */}
          {selectedService === 'medical-staff' && (
            <>
              {/* 什么时候需要医护人员替补？ */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  {medicalStaffWhyNeed.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary" marginBottom="$3" lineHeight={22}>
                  {medicalStaffWhyNeed.content}
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {medicalStaffWhyNeed.situations.map((situation, index) => (
                    <View
                      key={index}
                      backgroundColor="rgba(139, 92, 246, 0.1)"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$6"
                    >
                      <Text fontSize="$2" color="#8b5cf6">
                        {situation}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              {/* 医护人员类别 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  医护人员类别
                </Text>
                <YStack gap="$3">
                  {medicalStaffDetails.staffTypes.map((staff, index) => (
                    <Card key={index} padding="$4" backgroundColor="rgba(139, 92, 246, 0.05)" borderRadius="$3">
                      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          {staff.type}
                        </Text>
                        <Text fontSize="$3" fontWeight="600" color="#8b5cf6">
                          {staff.pricing}
                        </Text>
                      </XStack>
                      <YStack gap="$1">
                        {staff.services.map((service, sIndex) => (
                          <XStack key={sIndex} alignItems="center" gap="$2">
                            <CheckCircle size={12} color="#8b5cf6" />
                            <Text fontSize="$2" color="$textSecondary">
                              {service}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </Card>
                  ))}
                </YStack>
              </View>

              {/* 适用机构 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  适用机构
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {medicalStaffDetails.suitableOrganizations.map((org, index) => (
                    <View
                      key={index}
                      backgroundColor="rgba(139, 92, 246, 0.1)"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$6"
                    >
                      <Text fontSize="$2" color="#8b5cf6">
                        {org}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              {/* 服务流程 */}
              <View backgroundColor="$surface" padding="$4" marginBottom="$2">
                <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                  服务流程
                </Text>
                <YStack gap="$3">
                  {medicalStaffDetails.process.map((item) => (
                    <XStack key={item.step} gap="$3" alignItems="flex-start">
                      <View
                        width={32}
                        height={32}
                        borderRadius={16}
                        backgroundColor="#8b5cf6"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$3" fontWeight="bold" color="white">
                          {item.step}
                        </Text>
                      </View>
                      <YStack flex={1}>
                        <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
                          {item.title}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                          {item.desc}
                        </Text>
                      </YStack>
                    </XStack>
                  ))}
                </YStack>
              </View>
            </>
          )}

          {/* ========== 通用sections（护理人员、FAQ） ========== */}

          {/* 护理人员展示 - 统一双列布局 */}
          {caregivers.length > 0 && (
            <View backgroundColor="$surface" padding="$4" marginBottom="$2">
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <Text fontSize="$4" fontWeight="bold" color="$text">
                  {selectedService === 'escort' ? '专业陪诊团队' :
                   selectedService === 'medical-staff' ? '专业医护团队' : '推荐护理人员'}
                  <Text fontSize="$3" fontWeight="normal" color="$textSecondary">
                    {' '}({caregivers.length}人)
                  </Text>
                </Text>
              </XStack>
              <XStack flexDirection="row" flexWrap="wrap" gap="$3">
                {(showAllCaregivers ? caregivers : caregivers.slice(0, 6)).map((caregiver) => (
                  <View key={caregiver.id} width="48%">
                    <CaregiverCard
                      caregiver={caregiver}
                      size="compact"
                      onPress={() => handleCaregiverPress(caregiver.id)}
                    />
                  </View>
                ))}
              </XStack>
              {caregivers.length > 6 && (
                <Pressable onPress={() => setShowAllCaregivers(!showAllCaregivers)}>
                  <View
                    marginTop="$3"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={COLORS.primary}
                    paddingVertical="$2"
                    alignItems="center"
                  >
                    <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
                      {showAllCaregivers ? '收起' : `展示更多 (${caregivers.length - 6})`}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* 了解护理资质 - Only for elderly-care, moved before FAQ */}
          {selectedService === 'elderly-care' && (
            <View backgroundColor="$surface" padding="$4" marginBottom="$2">
              <Text fontSize="$4" fontWeight="bold" color="$text" marginBottom="$3">
                了解护理资质
              </Text>

              <YStack gap="$3">
                {qualificationDetails.map((detail) => (
                  <Card key={detail.id} padding="$4" backgroundColor="$background" borderRadius="$3">
                    <YStack marginBottom="$2">
                      <XStack alignItems="center" gap="$2" marginBottom="$1">
                        <Text fontSize="$4" fontWeight="bold" color="$text">
                          {detail.title}
                        </Text>
                        {detail.badge && (
                          <View
                            backgroundColor={COLORS.primary}
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" color="white" fontWeight="600">
                              {detail.badge}
                            </Text>
                          </View>
                        )}
                      </XStack>
                      <Text fontSize="$2" color="$textSecondary">
                        {detail.subtitle}
                      </Text>
                    </YStack>

                    <Text fontSize="$3" color="$text" marginBottom="$3">
                      {detail.description}
                    </Text>

                    <YStack marginBottom="$3">
                      <Text fontSize="$2" fontWeight="600" color="$text" marginBottom="$2">
                        服务范围：
                      </Text>
                      <YStack gap="$1">
                        {detail.services.map((service, index) => (
                          <XStack key={index} alignItems="center" gap="$2">
                            <CheckCircle size={12} color={COLORS.success} />
                            <Text fontSize="$2" color="$textSecondary">
                              {service}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>

                    <View backgroundColor="$surface" padding="$2" borderRadius="$2">
                      <XStack alignItems="center" gap="$1">
                        <Info size={12} color={COLORS.textSecondary} />
                        <Text fontSize="$2" color="$textSecondary" flex={1}>
                          {detail.requirements}
                        </Text>
                      </XStack>
                    </View>
                  </Card>
                ))}
              </YStack>
            </View>
          )}

          {/* 常见问题FAQ */}
          <View backgroundColor="$surface" padding="$4" marginBottom="$2">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Text fontSize="$4" fontWeight="bold" color="$text">
                常见问题
              </Text>
              <Pressable onPress={() => setShowAllFAQ(!showAllFAQ)}>
                <XStack alignItems="center" gap="$1">
                  <Text fontSize="$3" color={COLORS.primary}>
                    {showAllFAQ ? '收起' : '展开全部'}
                  </Text>
                  {showAllFAQ ? (
                    <ChevronUp size={16} color={COLORS.primary} />
                  ) : (
                    <ChevronDown size={16} color={COLORS.primary} />
                  )}
                </XStack>
              </Pressable>
            </XStack>

            <YStack gap="$2">
              {(showAllFAQ ? faqsByServiceType[selectedService] : faqsByServiceType[selectedService].slice(0, 3)).map((faq, index) => (
                <Card
                  key={index}
                  backgroundColor="$background"
                  borderRadius="$3"
                  overflow="hidden"
                >
                  <Pressable onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}>
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      padding="$3"
                    >
                      <Text fontSize="$3" fontWeight="600" color="$text" flex={1} marginRight="$2">
                        {faq.question}
                      </Text>
                      {expandedFAQ === index ? (
                        <ChevronUp size={16} color={COLORS.textSecondary} />
                      ) : (
                        <ChevronDown size={16} color={COLORS.textSecondary} />
                      )}
                    </XStack>
                  </Pressable>

                  {expandedFAQ === index && (
                    <View paddingHorizontal="$3" paddingBottom="$3">
                      <Text fontSize="$3" color="$textSecondary" lineHeight={20}>
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </Card>
              ))}
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={80} />
        </YStack>
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        padding="$4"
      >
        <Pressable onPress={handleOnlineConsult}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              在线咨询
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default ElderlyServiceScreen;
