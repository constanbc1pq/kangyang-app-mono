/**
 * PrivateDoctorSubscribeScreen 签约流程页面
 * 4步签约流程：套餐确认 -> 健康档案 -> 预约时间 -> 支付确认
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
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import {
  PrivateDoctor,
  PrivateDoctorPackage,
  PackageLevel,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { calculateDiscountedPrice } from '@/services/benefitService';
import { getMembershipDisplayInfo } from '@/services/membershipService';
import { MembershipLevel } from '@/types/membership';

const GOLD_COLOR = '#D4AF37';

interface PrivateDoctorSubscribeScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
      packageId: string;
    };
  };
}

export const PrivateDoctorSubscribeScreen: React.FC<PrivateDoctorSubscribeScreenProps> = ({
  navigation,
  route,
}) => {
  const { doctorId, packageId } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState<PrivateDoctor | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PrivateDoctorPackage | null>(null);

  const [discountInfo, setDiscountInfo] = useState<{
    membershipLevel: MembershipLevel;
    membershipLabel: string;
    discountRate: number;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);

  const [healthProfile, setHealthProfile] = useState({
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    medications: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [appointmentPreference, setAppointmentPreference] = useState({
    preferredDate: '',
    preferredTime: '',
    consultationType: 'video',
    concerns: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('wechat');

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setLoading(true);
    const doctorData = await privateDoctorService.getDoctorById(doctorId);
    setDoctor(doctorData);

    if (doctorData) {
      const pkg = doctorData.packages.find((p) => p.id === packageId);
      setSelectedPackage(pkg || null);

      if (pkg) {
        const memberInfo = await getMembershipDisplayInfo();
        const discount = await calculateDiscountedPrice(pkg.price);

        if (discount.discountRate > 0) {
          setDiscountInfo({
            membershipLevel: memberInfo.level,
            membershipLabel: memberInfo.label,
            discountRate: discount.discountRate,
            discountAmount: discount.discountAmount,
            finalPrice: discount.finalPrice,
          });
        }
      }
    }

    setLoading(false);
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

  const handleNext = () => {
    if (currentStep === 2) {
      if (!healthProfile.emergencyContact || !healthProfile.emergencyPhone) {
        return;
      }
    }

    if (currentStep === 3) {
      if (!appointmentPreference.preferredDate || !appointmentPreference.preferredTime) {
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!doctor || !selectedPackage) return;

    setSubmitting(true);

    try {
      const userId = 'user_001';

      const subscription = await privateDoctorService.subscribeToDoctor(
        userId,
        doctorId,
        packageId,
        {
          amount: discountInfo ? discountInfo.finalPrice : selectedPackage.price,
          method: paymentMethod,
          transactionId: `TXN${Date.now()}`,
        }
      );

      if (subscription) {
        navigation.replace('SubscriptionSuccess', {
          subscriptionId: subscription.id,
          doctorName: doctor.name,
          packageLevel: selectedPackage.level,
        });
      } else {
        Alert.alert('签约失败', '请稍后重试');
      }
    } catch (error) {
      Alert.alert('签约失败', '发生错误，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: '套餐' },
      { number: 2, label: '档案' },
      { number: 3, label: '预约' },
      { number: 4, label: '支付' },
    ];

    return (
      <View backgroundColor="$color2" paddingVertical="$2" paddingHorizontal="$2.5">
        <XStack justifyContent="space-between" alignItems="center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <XStack gap="$1.5" alignItems="center">
                <View
                  width={28}
                  height={28}
                  borderRadius={14}
                  backgroundColor={currentStep >= step.number ? '$primary' : '$color4'}
                  borderWidth={currentStep === step.number ? 2 : 0}
                  borderColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                >
                  {currentStep > step.number ? (
                    <CheckCircle size={16} color="white" />
                  ) : (
                    <Text
                      fontSize="$2"
                      fontWeight="600"
                      color={currentStep >= step.number ? 'white' : '$color10'}
                    >
                      {step.number}
                    </Text>
                  )}
                </View>
                <Text
                  fontSize="$2"
                  color={currentStep >= step.number ? '$color12' : '$color10'}
                  fontWeight={currentStep === step.number ? '600' : '400'}
                >
                  {step.label}
                </Text>
              </XStack>
              {index < steps.length - 1 && (
                <View
                  flex={1}
                  height={2}
                  marginHorizontal="$1"
                  backgroundColor={currentStep > step.number ? '$primary' : '$color5'}
                />
              )}
            </React.Fragment>
          ))}
        </XStack>
      </View>
    );
  };

  const renderStep1 = () => {
    if (!doctor || !selectedPackage) return null;

    return (
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="700" color="$color12">
          确认签约套餐
        </Text>

        <View
          backgroundColor="$color2"
          padding="$2"
          borderRadius="$5"
          borderWidth={2}
          borderColor="$primary"
        >
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="700" color="$color12">
                {getPackageLevelLabel(selectedPackage.level)}
              </Text>
              {selectedPackage.level === PackageLevel.STANDARD && (
                <View
                  backgroundColor="$warning"
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Text fontSize={10} color="white" fontWeight="600">
                    推荐
                  </Text>
                </View>
              )}
            </XStack>

            <View height={1} backgroundColor="$color5" />

            <YStack gap="$1">
              <Text fontSize="$2" color="$color10">服务医生</Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {doctor.name} · {doctor.hospital.name}
              </Text>
            </YStack>

            <View height={1} backgroundColor="$color5" />

            <YStack gap="$1.5">
              <Text fontSize="$2" color="$color10">服务内容</Text>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color12">在线图文咨询</Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {selectedPackage.services.onlineConsultations === -1 ? '无限次' : `${selectedPackage.services.onlineConsultations}次`}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color12">视频咨询</Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {selectedPackage.services.videoConsults === -1 ? '无限次' : `${selectedPackage.services.videoConsults}次`}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color12">线下面诊</Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {selectedPackage.services.inPersonVisits === -1 ? '无限次' : `${selectedPackage.services.inPersonVisits}次`}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color12">上门服务</Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {selectedPackage.services.homeVisits === -1 ? '无限次' : `${selectedPackage.services.homeVisits}次`}
                </Text>
              </XStack>
            </YStack>

            <View height={1} backgroundColor="$color5" />

            <YStack gap="$1">
              <Text fontSize="$2" color="$color10">服务期限</Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                12个月（自签约日起）
              </Text>
            </YStack>
          </YStack>
        </View>

        <View
          padding="$2"
          borderRadius="$4"
          borderLeftWidth={3}
          borderLeftColor="$primary"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <XStack gap="$1.5" alignItems="flex-start">
            <AlertCircle size={16} color={primaryColor} />
            <YStack flex={1} gap="$0.5">
              <Text fontSize="$3" color="$color12" fontWeight="600">
                服务说明
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                · 签约后立即生效，服务期为12个月{'\n'}
                · 未使用的服务次数不支持退款{'\n'}
                · 可在到期前30天申请续约优惠
              </Text>
            </YStack>
          </XStack>
        </View>
      </YStack>
    );
  };

  const renderStep2 = () => {
    return (
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="700" color="$color12">
          完善健康档案
        </Text>

        <Text fontSize="$3" color="$color10">
          请填写基本健康信息，帮助医生更好地了解您的健康状况
        </Text>

        <View backgroundColor="$color2" padding="$2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <YStack gap="$3">
            {/* 基本信息 */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">基本信息</Text>
              <XStack gap="$2">
                <YStack flex={1} gap="$1">
                  <Text fontSize="$2" color="$color10">身高 (cm)</Text>
                  <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                    <TextInput
                      placeholder="170"
                      placeholderTextColor={color10}
                      value={healthProfile.height}
                      onChangeText={(text) => setHealthProfile({ ...healthProfile, height: text })}
                      keyboardType="numeric"
                      style={{ padding: 12, fontSize: 14, color: color12 }}
                    />
                  </View>
                </YStack>
                <YStack flex={1} gap="$1">
                  <Text fontSize="$2" color="$color10">体重 (kg)</Text>
                  <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                    <TextInput
                      placeholder="65"
                      placeholderTextColor={color10}
                      value={healthProfile.weight}
                      onChangeText={(text) => setHealthProfile({ ...healthProfile, weight: text })}
                      keyboardType="numeric"
                      style={{ padding: 12, fontSize: 14, color: color12 }}
                    />
                  </View>
                </YStack>
              </XStack>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">血型</Text>
                <XStack gap="$1.5" flexWrap="wrap">
                  {['A', 'B', 'AB', 'O', '不详'].map((type) => (
                    <Pressable key={type} onPress={() => setHealthProfile({ ...healthProfile, bloodType: type })}>
                      <View
                        paddingHorizontal="$2.5"
                        paddingVertical="$1.5"
                        borderRadius="$10"
                        borderWidth={1}
                        borderColor={healthProfile.bloodType === type ? '$primary' : '$color5'}
                        backgroundColor={healthProfile.bloodType === type ? '$primary' : '$color4'}
                      >
                        <Text
                          fontSize="$3"
                          color={healthProfile.bloodType === type ? 'white' : '$color12'}
                        >
                          {type}型
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>
            </YStack>

            <View height={1} backgroundColor="$color5" />

            {/* 健康状况 */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">健康状况（选填）</Text>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">过敏史</Text>
                <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                  <TextInput
                    placeholder="如：青霉素过敏、海鲜过敏等"
                    placeholderTextColor={color10}
                    value={healthProfile.allergies}
                    onChangeText={(text) => setHealthProfile({ ...healthProfile, allergies: text })}
                    multiline
                    numberOfLines={2}
                    style={{ padding: 12, fontSize: 14, color: color12, minHeight: 60, textAlignVertical: 'top' }}
                  />
                </View>
              </YStack>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">慢性疾病</Text>
                <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                  <TextInput
                    placeholder="如：高血压、糖尿病等"
                    placeholderTextColor={color10}
                    value={healthProfile.chronicDiseases}
                    onChangeText={(text) => setHealthProfile({ ...healthProfile, chronicDiseases: text })}
                    multiline
                    numberOfLines={2}
                    style={{ padding: 12, fontSize: 14, color: color12, minHeight: 60, textAlignVertical: 'top' }}
                  />
                </View>
              </YStack>
            </YStack>

            <View height={1} backgroundColor="$color5" />

            {/* 紧急联系人 */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                紧急联系人 <Text color="$error">*</Text>
              </Text>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">联系人姓名</Text>
                <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                  <TextInput
                    placeholder="请输入姓名"
                    placeholderTextColor={color10}
                    value={healthProfile.emergencyContact}
                    onChangeText={(text) => setHealthProfile({ ...healthProfile, emergencyContact: text })}
                    style={{ padding: 12, fontSize: 14, color: color12 }}
                  />
                </View>
              </YStack>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">联系电话</Text>
                <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                  <TextInput
                    placeholder="请输入电话号码"
                    placeholderTextColor={color10}
                    value={healthProfile.emergencyPhone}
                    onChangeText={(text) => setHealthProfile({ ...healthProfile, emergencyPhone: text })}
                    keyboardType="phone-pad"
                    style={{ padding: 12, fontSize: 14, color: color12 }}
                  />
                </View>
              </YStack>
            </YStack>
          </YStack>
        </View>
      </YStack>
    );
  };

  const renderStep3 = () => {
    return (
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="700" color="$color12">
          预约首次咨询
        </Text>

        <Text fontSize="$3" color="$color10">
          签约成功后，您可以预约首次咨询时间
        </Text>

        <View backgroundColor="$color2" padding="$2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <YStack gap="$3">
            {/* 咨询方式 */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">咨询方式</Text>
              <YStack gap="$1.5">
                {[
                  { value: 'video', label: '视频咨询', desc: '面对面沟通，更直观' },
                  { value: 'phone', label: '电话咨询', desc: '语音通话，方便快捷' },
                  { value: 'in_person', label: '线下面诊', desc: '医院面诊，深入检查' },
                ].map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => setAppointmentPreference({ ...appointmentPreference, consultationType: type.value })}
                  >
                    <XStack
                      padding="$2"
                      borderRadius="$4"
                      borderWidth={2}
                      borderColor={appointmentPreference.consultationType === type.value ? '$primary' : '$color5'}
                      backgroundColor={appointmentPreference.consultationType === type.value ? '$primary' : '$color2'}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <YStack gap="$0.5">
                        <Text
                          fontSize="$3"
                          fontWeight="600"
                          color={appointmentPreference.consultationType === type.value ? 'white' : '$color12'}
                        >
                          {type.label}
                        </Text>
                        <Text
                          fontSize="$2"
                          color={appointmentPreference.consultationType === type.value ? 'white' : '$color10'}
                        >
                          {type.desc}
                        </Text>
                      </YStack>
                      {appointmentPreference.consultationType === type.value && (
                        <CheckCircle size={20} color="white" />
                      )}
                    </XStack>
                  </Pressable>
                ))}
              </YStack>
            </YStack>

            <View height={1} backgroundColor="$color5" />

            {/* 预约时间 */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">预约时间</Text>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">日期 *</Text>
                <View
                  borderWidth={1}
                  borderColor={!appointmentPreference.preferredDate ? '$error' : '$color5'}
                  borderRadius="$3"
                  backgroundColor="$color4"
                >
                  <TextInput
                    placeholder="请输入日期，如 2025-01-15"
                    placeholderTextColor={color10}
                    value={appointmentPreference.preferredDate}
                    onChangeText={(text) => setAppointmentPreference({ ...appointmentPreference, preferredDate: text })}
                    style={{ padding: 12, fontSize: 14, color: color12 }}
                  />
                </View>
              </YStack>

              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">时间段 *</Text>
                <XStack gap="$1.5" flexWrap="wrap">
                  {['上午 9:00-12:00', '下午 14:00-17:00', '晚上 18:00-20:00'].map((time) => (
                    <Pressable
                      key={time}
                      onPress={() => setAppointmentPreference({ ...appointmentPreference, preferredTime: time })}
                    >
                      <View
                        paddingHorizontal="$2"
                        paddingVertical="$1.5"
                        borderRadius="$10"
                        borderWidth={1}
                        borderColor={appointmentPreference.preferredTime === time ? '$primary' : '$color5'}
                        backgroundColor={appointmentPreference.preferredTime === time ? '$primary' : '$color4'}
                        marginBottom="$1"
                      >
                        <Text
                          fontSize="$2"
                          color={appointmentPreference.preferredTime === time ? 'white' : '$color12'}
                        >
                          {time}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>
            </YStack>

            <View height={1} backgroundColor="$color5" />

            {/* 咨询问题 */}
            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">咨询问题（选填）</Text>
              <View borderWidth={1} borderColor="$color5" borderRadius="$3" backgroundColor="$color4">
                <TextInput
                  placeholder="请简要描述您想咨询的健康问题"
                  placeholderTextColor={color10}
                  value={appointmentPreference.concerns}
                  onChangeText={(text) => setAppointmentPreference({ ...appointmentPreference, concerns: text })}
                  multiline
                  numberOfLines={3}
                  style={{ padding: 12, fontSize: 14, color: color12, minHeight: 80, textAlignVertical: 'top' }}
                />
              </View>
            </YStack>
          </YStack>
        </View>
      </YStack>
    );
  };

  const renderStep4 = () => {
    if (!selectedPackage) return null;

    return (
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="700" color="$color12">
          确认支付
        </Text>

        {/* 订单信息 */}
        <View backgroundColor="$color2" padding="$2" borderRadius="$5" borderWidth={1} borderColor="$color5">
          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">订单信息</Text>

            <View height={1} backgroundColor="$color5" />

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">服务套餐</Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {getPackageLevelLabel(selectedPackage.level)}
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$color10">服务期限</Text>
              <Text fontSize="$3" fontWeight="600" color="$color12">12个月</Text>
            </XStack>

            <View height={1} backgroundColor="$color5" />

            {discountInfo && (
              <>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$color10">套餐原价</Text>
                  <Text fontSize="$3" color="$color10" textDecorationLine="line-through">
                    ¥{formatPrice(selectedPackage.price)}
                  </Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$1.5" alignItems="center">
                    <View
                      backgroundColor="$primary"
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize={10} color="white" fontWeight="600">
                        {discountInfo.membershipLabel}
                      </Text>
                    </View>
                    <Text fontSize="$2" color="$primary">
                      专属折扣 {Math.round(discountInfo.discountRate * 100)}%
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$primary" fontWeight="600">
                    -¥{formatPrice(discountInfo.discountAmount)}
                  </Text>
                </XStack>

                <View height={1} backgroundColor="$color5" />
              </>
            )}

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12">应付金额</Text>
              <XStack alignItems="baseline" gap="$0.5">
                <Text fontSize="$2" color={GOLD_COLOR}>¥</Text>
                <Text fontSize="$7" fontWeight="700" color={GOLD_COLOR}>
                  {formatPrice(discountInfo ? discountInfo.finalPrice : selectedPackage.price)}
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </View>

        {/* 支付方式 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">支付方式</Text>

          <YStack gap="$1.5">
            {[
              { value: 'wechat', label: '微信支付', icon: '💚' },
              { value: 'alipay', label: '支付宝', icon: '💙' },
              { value: 'card', label: '银行卡', icon: '💳' },
            ].map((method) => (
              <Pressable key={method.value} onPress={() => setPaymentMethod(method.value)}>
                <XStack
                  padding="$2"
                  borderRadius="$4"
                  borderWidth={2}
                  borderColor={paymentMethod === method.value ? '$primary' : '$color5'}
                  backgroundColor={paymentMethod === method.value ? '$primary' : '$color2'}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack gap="$2" alignItems="center">
                    <Text fontSize={20}>{method.icon}</Text>
                    <Text
                      fontSize="$3"
                      fontWeight="600"
                      color={paymentMethod === method.value ? 'white' : '$color12'}
                    >
                      {method.label}
                    </Text>
                  </XStack>
                  {paymentMethod === method.value && (
                    <CheckCircle size={20} color="white" />
                  )}
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </YStack>

        {/* 协议条款 */}
        <View
          padding="$2"
          borderRadius="$4"
          style={{ backgroundColor: `${warningColor}10` }}
        >
          <Text fontSize="$2" color="$color10">
            点击"确认支付"即表示您已阅读并同意
            <Text color="$primary" fontWeight="600">《私人医生服务协议》</Text>
            和
            <Text color="$primary" fontWeight="600">《隐私保护政策》</Text>
          </Text>
        </View>
      </YStack>
    );
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar - 按照CLAUDE.md规范 */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="签约私人医生" onBack={handleBack} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <View padding="$2.5">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* 底部占位 */}
          <View height={100} />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
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
        <XStack gap="$2">
          {currentStep > 1 && (
            <Pressable style={{ flex: 1 }} onPress={handleBack} disabled={submitting}>
              <View
                height={48}
                borderRadius="$10"
                backgroundColor="$color4"
                borderWidth={1}
                borderColor="$color5"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  上一步
                </Text>
              </View>
            </Pressable>
          )}
          <Pressable style={{ flex: 2 }} onPress={handleNext} disabled={submitting}>
            <View
              height={48}
              borderRadius="$10"
              backgroundColor="$primary"
              justifyContent="center"
              alignItems="center"
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text fontSize="$4" fontWeight="600" color="white">
                  {currentStep === 4 ? '确认支付' : '下一步'}
                </Text>
              )}
            </View>
          </Pressable>
        </XStack>
      </View>
    </View>
  );
};
