/**
 * ElderlyServiceScreen 养老服务页面
 * 提供长者照顾、陪诊服务、医护替补三大服务
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Image } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckCircle,
  Info,
  Shield,
  Award,
  Home,
  Ambulance,
  Stethoscope,
  Users,
  BadgeCheck,
  Building2,
  FileCheck,
} from 'lucide-react-native';
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

// 合作机构数据
const partnershipInfo = {
  title: '权威合作 · 品质保障',
  description: '康养平台与多家知名护理服务机构建立战略合作，确保为您提供专业、安全、贴心的养老护理服务。',
  partners: [
    { name: '深圳市养老服务协会', type: '行业协会' },
    { name: '香港护理专业学会', type: '专业学会' },
    { name: '粤港澳大湾区健康产业联盟', type: '产业联盟' },
  ],
  certifications: [
    { name: '养老服务机构等级认证', level: 'AAA级' },
    { name: 'ISO 9001质量管理体系', level: '认证通过' },
    { name: '深圳市家政服务诚信企业', level: '五星级' },
  ],
  qualifications: [
    '深圳市民政局备案养老服务机构',
    '深圳市人力资源保障局认可培训机构',
    '商业意外险与责任险双重保障',
  ],
};

const ElderlyServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const goldColor = theme.gold?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [selectedService, setSelectedService] = useState<ServiceType>('elderly-care');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showAllFAQ, setShowAllFAQ] = useState(false);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [showAllCaregivers, setShowAllCaregivers] = useState(false);

  const serviceTypes = [
    { id: 'elderly-care', name: '长者照顾', icon: Home, description: '日常起居照顾' },
    { id: 'escort', name: '陪诊服务', icon: Ambulance, description: '就医陪同护送' },
    { id: 'medical-staff', name: '医护替补', icon: Stethoscope, description: '机构人手支援' },
  ];

  // 加载护理人员数据
  useEffect(() => {
    const loadedCaregivers = getCaregiversByServiceType(selectedService);
    setCaregivers(loadedCaregivers);
  }, [selectedService]);

  // 切换服务类型时重置状态
  useEffect(() => {
    setExpandedFAQ(null);
    setShowAllFAQ(false);
    setShowAllCaregivers(false);
  }, [selectedService]);

  const handleCaregiverPress = (caregiverId: string) => {
    navigation.navigate('CaregiverDetail' as never, {
      caregiverId,
      serviceType: selectedService,
    } as never);
  };

  const handleOnlineConsult = () => {
    navigation.navigate('AIConsultation' as never, { source: 'elderly_service' } as never);
  };

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
          <YStack flex={1} marginLeft="$2">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              养老服务
            </Text>
            <Text fontSize="$2" color="$color10">
              专业照护 · 温暖陪伴
            </Text>
          </YStack>
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack>
          {/* 顶部统计区 */}
          <View backgroundColor="$color2" padding="$2" paddingTop="$3">
            <XStack gap="$2" justifyContent="space-around">
              <YStack alignItems="center" flex={1}>
                <Text fontSize="$6" fontWeight="700" color="$primary">500+</Text>
                <Text fontSize="$2" color="$color10">服务家庭</Text>
              </YStack>
              <View width={1} backgroundColor="$color5" />
              <YStack alignItems="center" flex={1}>
                <Text fontSize="$6" fontWeight="700" color="$primary">50+</Text>
                <Text fontSize="$2" color="$color10">专业护理员</Text>
              </YStack>
              <View width={1} backgroundColor="$color5" />
              <YStack alignItems="center" flex={1}>
                <XStack alignItems="center" gap="$1">
                  <Text fontSize="$6" fontWeight="700" color="$primary">4.9</Text>
                </XStack>
                <Text fontSize="$2" color="$color10">服务评分</Text>
              </YStack>
            </XStack>
          </View>

          {/* 服务类型Tab */}
          <View backgroundColor="$color2" padding="$2" borderBottomWidth={1} borderBottomColor="$color5">
            <XStack gap="$2">
              {serviceTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedService === type.id;
                return (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedService(type.id as ServiceType)}
                    style={{ flex: 1 }}
                  >
                    <View
                      backgroundColor={isSelected ? '$primary' : '$color4'}
                      borderRadius="$4"
                      padding="$2"
                      alignItems="center"
                      borderWidth={1}
                      borderColor={isSelected ? '$primary' : '$color5'}
                    >
                      <IconComponent size={22} color={isSelected ? 'white' : color12} />
                      <Text
                        fontSize="$3"
                        fontWeight={isSelected ? '600' : '400'}
                        color={isSelected ? 'white' : '$color12'}
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

          {/* 平台合作与资质介绍 */}
          <View backgroundColor="$color2" padding="$2" marginTop="$2">
            <XStack gap="$2" alignItems="center" marginBottom="$2">
              <BadgeCheck size={20} color={primaryColor} />
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {partnershipInfo.title}
              </Text>
            </XStack>
            <Text fontSize="$3" color="$color10" lineHeight={20} marginBottom="$3">
              {partnershipInfo.description}
            </Text>

            {/* 合作机构 */}
            <YStack gap="$2" marginBottom="$3">
              <XStack gap="$1" alignItems="center">
                <Building2 size={16} color={primaryColor} />
                <Text fontSize="$3" fontWeight="600" color="$color12">合作机构</Text>
              </XStack>
              <XStack flexWrap="wrap" gap="$1.5">
                {partnershipInfo.partners.map((partner, index) => (
                  <View
                    key={index}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="$primary"
                  >
                    <Text fontSize="$2" color="$primary" fontWeight="500">
                      {partner.name}
                    </Text>
                  </View>
                ))}
              </XStack>
            </YStack>

            {/* 资质认证 */}
            <YStack gap="$2" marginBottom="$3">
              <XStack gap="$1" alignItems="center">
                <FileCheck size={16} color={successColor} />
                <Text fontSize="$3" fontWeight="600" color="$color12">资质认证</Text>
              </XStack>
              <YStack gap="$1.5">
                {partnershipInfo.certifications.map((cert, index) => (
                  <XStack key={index} justifyContent="space-between" alignItems="center" padding="$2" backgroundColor="$color4" borderRadius="$3">
                    <Text fontSize="$3" color="$color12">{cert.name}</Text>
                    <View backgroundColor="$success" paddingHorizontal="$2" paddingVertical="$0.5" borderRadius="$2">
                      <Text fontSize={10} color="white" fontWeight="600">{cert.level}</Text>
                    </View>
                  </XStack>
                ))}
              </YStack>
            </YStack>

            {/* 服务保障 */}
            <YStack gap="$1">
              {partnershipInfo.qualifications.map((qual, index) => (
                <XStack key={index} gap="$2" alignItems="center">
                  <CheckCircle size={14} color={successColor} />
                  <Text fontSize="$2" color="$color10">{qual}</Text>
                </XStack>
              ))}
            </YStack>
          </View>

          {/* ========== 长者照顾服务 sections ========== */}
          {selectedService === 'elderly-care' && (
            <>
              {/* 为什么需要长者照顾服务？ */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  {elderlyWhyNeed.title}
                </Text>
                <Text fontSize="$3" color="$color10" marginBottom="$2" lineHeight={20}>
                  {elderlyWhyNeed.content}
                </Text>
                <XStack flexWrap="wrap" gap="$1.5">
                  {elderlyWhyNeed.situations.map((situation, index) => (
                    <View
                      key={index}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Text fontSize="$2" color="$primary" fontWeight="500">
                        {situation}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              {/* 服务套餐 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  服务套餐
                </Text>
                <YStack gap="$2">
                  {servicePackages.map((pkg) => (
                    <View
                      key={pkg.id}
                      padding="$2"
                      backgroundColor={pkg.popular ? '$color4' : '$color4'}
                      borderRadius="$4"
                      borderWidth={pkg.popular ? 2 : 1}
                      borderColor={pkg.popular ? '$primary' : '$color5'}
                      position="relative"
                    >
                      {pkg.popular && (
                        <View
                          position="absolute"
                          top={-10}
                          right={12}
                          backgroundColor="$warning"
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$2"
                        >
                          <Text fontSize={10} color="white" fontWeight="600">
                            最受欢迎
                          </Text>
                        </View>
                      )}

                      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                        <YStack>
                          <Text fontSize="$4" fontWeight="600" color="$color12">
                            {pkg.name}
                          </Text>
                          <Text fontSize="$2" color="$color10">
                            {pkg.description}
                          </Text>
                        </YStack>
                      </XStack>

                      <YStack gap="$1.5" marginBottom="$2">
                        {pkg.prices.map((price, index) => (
                          <XStack key={index} justifyContent="space-between" alignItems="center">
                            <Text fontSize="$3" color="$color10">
                              {price.type}
                            </Text>
                            <XStack alignItems="baseline" gap="$1">
                              <Text fontSize="$4" fontWeight="700" color="$primary">
                                ¥{price.price}
                              </Text>
                              <Text fontSize="$2" color="$color10">
                                {price.unit}
                              </Text>
                              {price.save && (
                                <Text fontSize={10} color="$success" fontWeight="500">
                                  {price.save}
                                </Text>
                              )}
                            </XStack>
                          </XStack>
                        ))}
                      </YStack>

                      <YStack gap="$1" marginBottom="$2">
                        {pkg.features.map((feature, index) => (
                          <XStack key={index} alignItems="center" gap="$1.5">
                            <CheckCircle size={12} color={successColor} />
                            <Text fontSize="$2" color="$color10">
                              {feature}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>

                      <View backgroundColor="$color2" padding="$2" borderRadius="$3">
                        <Text fontSize="$2" color="$color12">
                          {pkg.note}
                          {pkg.discount && ` · ${pkg.discount}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </YStack>

                <View backgroundColor="$primary" padding="$2" borderRadius="$4" marginTop="$2">
                  <XStack alignItems="center" gap="$2">
                    <Info size={16} color="white" />
                    <Text fontSize="$2" color="white" flex={1}>
                      深夜时段（23:00-8:00）和24小时服务价格会有所调整，具体请咨询客服
                    </Text>
                  </XStack>
                </View>
              </View>

              {/* 信任徽章 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <XStack gap="$2" justifyContent="space-around">
                  {[
                    { icon: Shield, title: '资质认证', desc: '持证上岗' },
                    { icon: Award, title: '专业培训', desc: '定期考核' },
                    { icon: Heart, title: '保险保障', desc: '意外全覆盖' },
                    { icon: CheckCircle, title: '满意保证', desc: '随时更换' },
                  ].map((badge, index) => {
                    const IconComponent = badge.icon;
                    return (
                      <YStack key={index} alignItems="center" gap="$1">
                        <View
                          width={44}
                          height={44}
                          borderRadius={22}
                          backgroundColor="$primary"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={22} color="white" />
                        </View>
                        <Text fontSize="$2" fontWeight="600" color="$color12">
                          {badge.title}
                        </Text>
                        <Text fontSize={10} color="$color10">
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
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  {escortWhyNeed.title}
                </Text>
                <Text fontSize="$3" color="$color10" marginBottom="$2" lineHeight={20}>
                  {escortWhyNeed.content}
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={20}>
                  {escortWhyNeed.additionalInfo}
                </Text>
              </View>

              {/* 服务内容 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  服务内容
                </Text>
                <YStack gap="$1.5">
                  {escortServiceDetails.services.map((service, index) => (
                    <XStack key={index} alignItems="flex-start" gap="$2">
                      <CheckCircle size={16} color={successColor} />
                      <Text fontSize="$3" color="$color12" flex={1}>
                        {service}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 适用人群 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  适用人群
                </Text>
                <YStack gap="$1.5">
                  {escortServiceDetails.suitableFor.map((person, index) => (
                    <XStack key={index} alignItems="center" gap="$2">
                      <Users size={16} color={primaryColor} />
                      <Text fontSize="$3" color="$color12">
                        {person}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </View>

              {/* 为什么需要陪诊员？ */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  为什么需要陪诊员？
                </Text>
                <YStack gap="$2">
                  {escortWhyNeedDetails.sections.map((section, index) => (
                    <YStack key={index}>
                      <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                        {section.title}
                      </Text>
                      <Text fontSize="$3" color="$color10" lineHeight={20}>
                        {section.content}
                      </Text>
                    </YStack>
                  ))}
                </YStack>
              </View>

              {/* CTA */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <View
                  backgroundColor="$primary"
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                >
                  <Text fontSize="$5" fontWeight="600" color="white" marginBottom="$1">
                    需要陪诊服务？
                  </Text>
                  <Text fontSize="$3" color="white" opacity={0.9} marginBottom="$3">
                    超过500位经专业培训的陪诊员，获9成客户给予五星好评
                  </Text>
                  <Pressable onPress={handleOnlineConsult}>
                    <View
                      backgroundColor="white"
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$10"
                    >
                      <Text fontSize="$3" fontWeight="600" color="$primary">
                        立即咨询预约
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {/* ========== 医护替补 sections ========== */}
          {selectedService === 'medical-staff' && (
            <>
              {/* 什么时候需要医护人员替补？ */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  {medicalStaffWhyNeed.title}
                </Text>
                <Text fontSize="$3" color="$color10" marginBottom="$2" lineHeight={20}>
                  {medicalStaffWhyNeed.content}
                </Text>
                <XStack flexWrap="wrap" gap="$1.5">
                  {medicalStaffWhyNeed.situations.map((situation, index) => (
                    <View
                      key={index}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Text fontSize="$2" color="$primary" fontWeight="500">
                        {situation}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              {/* 医护人员类别 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  医护人员类别
                </Text>
                <YStack gap="$2">
                  {medicalStaffDetails.staffTypes.map((staff, index) => (
                    <View key={index} padding="$2" backgroundColor="$color4" borderRadius="$4">
                      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          {staff.type}
                        </Text>
                        <Text fontSize="$3" fontWeight="600" color="$primary">
                          {staff.pricing}
                        </Text>
                      </XStack>
                      <YStack gap="$1">
                        {staff.services.map((service, sIndex) => (
                          <XStack key={sIndex} alignItems="center" gap="$1.5">
                            <CheckCircle size={12} color={successColor} />
                            <Text fontSize="$2" color="$color10">
                              {service}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </View>
                  ))}
                </YStack>
              </View>

              {/* 适用机构 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  适用机构
                </Text>
                <XStack flexWrap="wrap" gap="$1.5">
                  {medicalStaffDetails.suitableOrganizations.map((org, index) => (
                    <View
                      key={index}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Text fontSize="$2" color="$primary" fontWeight="500">
                        {org}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>

              {/* 服务流程 */}
              <View backgroundColor="$color2" padding="$2" marginTop="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  服务流程
                </Text>
                <YStack gap="$2">
                  {medicalStaffDetails.process.map((item) => (
                    <XStack key={item.step} gap="$2" alignItems="flex-start">
                      <View
                        width={28}
                        height={28}
                        borderRadius={14}
                        backgroundColor="$primary"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$3" fontWeight="700" color="white">
                          {item.step}
                        </Text>
                      </View>
                      <YStack flex={1}>
                        <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                          {item.title}
                        </Text>
                        <Text fontSize="$2" color="$color10" lineHeight={18}>
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

          {/* 护理人员展示 */}
          {caregivers.length > 0 && (
            <View backgroundColor="$color2" padding="$2" marginTop="$2">
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {selectedService === 'escort' ? '专业陪诊团队' :
                   selectedService === 'medical-staff' ? '专业医护团队' : '推荐护理人员'}
                  <Text fontSize="$3" fontWeight="400" color="$color10">
                    {' '}({caregivers.length}人)
                  </Text>
                </Text>
              </XStack>
              <XStack flexDirection="row" flexWrap="wrap" gap="$2">
                {(showAllCaregivers ? caregivers : caregivers.slice(0, 6)).map((caregiver) => (
                  <View key={caregiver.id} flex={1} minWidth="45%" maxWidth="48%">
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
                    marginTop="$2"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor="$primary"
                    paddingVertical="$2"
                    alignItems="center"
                  >
                    <Text fontSize="$3" color="$primary" fontWeight="500">
                      {showAllCaregivers ? '收起' : `展示更多 (${caregivers.length - 6})`}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* 了解护理资质 - Only for elderly-care */}
          {selectedService === 'elderly-care' && (
            <View backgroundColor="$color2" padding="$2" marginTop="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                了解护理资质
              </Text>

              <YStack gap="$2">
                {qualificationDetails.map((detail) => (
                  <View key={detail.id} padding="$2" backgroundColor="$color4" borderRadius="$4">
                    <YStack marginBottom="$2">
                      <XStack alignItems="center" gap="$2" marginBottom="$0.5">
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          {detail.title}
                        </Text>
                        {detail.badge && (
                          <View
                            backgroundColor="$warning"
                            paddingHorizontal="$1.5"
                            paddingVertical="$0.5"
                            borderRadius="$2"
                          >
                            <Text fontSize={10} color="white" fontWeight="600">
                              {detail.badge}
                            </Text>
                          </View>
                        )}
                      </XStack>
                      <Text fontSize="$2" color="$color10">
                        {detail.subtitle}
                      </Text>
                    </YStack>

                    <Text fontSize="$3" color="$color12" marginBottom="$2">
                      {detail.description}
                    </Text>

                    <YStack marginBottom="$2">
                      <Text fontSize="$2" fontWeight="600" color="$color12" marginBottom="$1">
                        服务范围：
                      </Text>
                      <YStack gap="$1">
                        {detail.services.map((service, index) => (
                          <XStack key={index} alignItems="center" gap="$1.5">
                            <CheckCircle size={12} color={successColor} />
                            <Text fontSize="$2" color="$color10">
                              {service}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>

                    <View backgroundColor="$color2" padding="$2" borderRadius="$3">
                      <XStack alignItems="center" gap="$1">
                        <Info size={12} color={color10} />
                        <Text fontSize="$2" color="$color10" flex={1}>
                          {detail.requirements}
                        </Text>
                      </XStack>
                    </View>
                  </View>
                ))}
              </YStack>
            </View>
          )}

          {/* 常见问题FAQ */}
          <View backgroundColor="$color2" padding="$2" marginTop="$2">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                常见问题
              </Text>
              <Pressable onPress={() => setShowAllFAQ(!showAllFAQ)}>
                <XStack alignItems="center" gap="$0.5">
                  <Text fontSize="$3" color="$primary" fontWeight="500">
                    {showAllFAQ ? '收起' : '展开全部'}
                  </Text>
                  {showAllFAQ ? (
                    <ChevronUp size={14} color={primaryColor} />
                  ) : (
                    <ChevronDown size={14} color={primaryColor} />
                  )}
                </XStack>
              </Pressable>
            </XStack>

            <YStack gap="$1.5">
              {(showAllFAQ ? faqsByServiceType[selectedService] : faqsByServiceType[selectedService].slice(0, 3)).map((faq, index) => (
                <View
                  key={index}
                  backgroundColor="$color4"
                  borderRadius="$4"
                  overflow="hidden"
                >
                  <Pressable onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}>
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      padding="$2"
                    >
                      <Text fontSize="$3" fontWeight="600" color="$color12" flex={1} marginRight="$2">
                        {faq.question}
                      </Text>
                      {expandedFAQ === index ? (
                        <ChevronUp size={16} color={color10} />
                      ) : (
                        <ChevronDown size={16} color={color10} />
                      )}
                    </XStack>
                  </Pressable>

                  {expandedFAQ === index && (
                    <View paddingHorizontal="$2" paddingBottom="$2">
                      <Text fontSize="$3" color="$color10" lineHeight={20}>
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </View>
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
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        paddingBottom={insets.bottom + 8}
      >
        <Pressable onPress={handleOnlineConsult}>
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
      </View>
    </View>
  );
};

export default ElderlyServiceScreen;
