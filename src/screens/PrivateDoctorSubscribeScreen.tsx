/**
 * Private Doctor Subscribe Screen
 * Phase 22: 签约流程页面 - 4步签约流程
 *
 * 流程：
 * Step 1: 套餐确认 - 确认选择的套餐和价格
 * Step 2: 健康档案 - 填写基本健康信息
 * Step 3: 预约偏好 - 选择首次咨询时间
 * Step 4: 支付确认 - 支付方式和订单确认
 */

import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  Button,
  Input,
  TextArea,
  H4,
  Separator,
  Theme,
  ScrollView,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  CreditCard,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  PrivateDoctor,
  PrivateDoctorPackage,
  PackageLevel,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';

interface PrivateDoctorSubscribeScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
      packageId: string;
    };
  };
}

export const PrivateDoctorSubscribeScreen: React.FC<
  PrivateDoctorSubscribeScreenProps
> = ({ navigation, route }) => {
  const { doctorId, packageId } = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState<PrivateDoctor | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PrivateDoctorPackage | null>(null);

  // Step 2: 健康档案
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

  // Step 3: 预约偏好
  const [appointmentPreference, setAppointmentPreference] = useState({
    preferredDate: '',
    preferredTime: '',
    consultationType: 'video', // video, phone, in_person
    concerns: '',
  });

  // Step 4: 支付信息
  const [paymentMethod, setPaymentMethod] = useState('wechat'); // wechat, alipay, card

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
    // 验证当前步骤
    if (currentStep === 2) {
      if (!healthProfile.emergencyContact || !healthProfile.emergencyPhone) {
        console.log('验证失败：请填写紧急联系人信息');
        // Alert.alert('提示', '请填写紧急联系人信息');
        return;
      }
    }

    if (currentStep === 3) {
      if (!appointmentPreference.preferredDate || !appointmentPreference.preferredTime) {
        console.log('验证失败：日期=', appointmentPreference.preferredDate, '时间=', appointmentPreference.preferredTime);
        // Alert.alert('提示', '请选择预约时间');
        // 不跳转，让页面上的错误提示显示
        return;
      }
    }

    console.log('验证通过，进入下一步:', currentStep + 1);
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
      // 模拟用户ID - 实际应从auth context获取
      const userId = 'user_001';

      const subscription = await privateDoctorService.subscribeToDoctor(
        userId,
        doctorId,
        packageId,
        {
          amount: selectedPackage.price,
          method: paymentMethod,
          transactionId: `TXN${Date.now()}`,
        }
      );

      if (subscription) {
        // 跳转到成功页面
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
      { number: 1, label: '套餐确认' },
      { number: 2, label: '健康档案' },
      { number: 3, label: '预约时间' },
      { number: 4, label: '支付确认' },
    ];

    return (
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="$background"
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <XStack space="$2" alignItems="center" flex={1}>
              <View
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={
                  currentStep >= step.number ? COLORS.primary : '$surface'
                }
                borderWidth={currentStep === step.number ? 2 : 0}
                borderColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
              >
                {currentStep > step.number ? (
                  <CheckCircle size={20} color="white" />
                ) : (
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color={currentStep >= step.number ? 'white' : '$textSecondary'}
                  >
                    {step.number}
                  </Text>
                )}
              </View>
              <Text
                fontSize="$2"
                color={currentStep >= step.number ? '$text' : '$textSecondary'}
                fontWeight={currentStep === step.number ? '600' : '400'}
              >
                {step.label}
              </Text>
            </XStack>
            {index < steps.length - 1 && (
              <View
                flex={0.3}
                height={2}
                backgroundColor={
                  currentStep > step.number ? COLORS.primary : '$borderColor'
                }
              />
            )}
          </React.Fragment>
        ))}
      </XStack>
    );
  };

  const renderStep1 = () => {
    if (!doctor || !selectedPackage) return null;

    return (
      <YStack space="$4">
        <H4 fontSize="$6" fontWeight="700" color="$text">
          确认签约套餐
        </H4>

        <Card
          backgroundColor="$cardBg"
          padding="$4"
          borderRadius="$4"
          borderWidth={2}
          borderColor={COLORS.primary}
        >
          <YStack space="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color="$text">
                {getPackageLevelLabel(selectedPackage.level)}
              </Text>
              {selectedPackage.level === PackageLevel.STANDARD && (
                <View
                  backgroundColor={COLORS.warning}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize={11} color="white" fontWeight="600">
                    推荐
                  </Text>
                </View>
              )}
            </XStack>

            <Separator borderColor="$borderColor" />

            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary">
                服务医生
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$text">
                {doctor.name} • {doctor.hospital.name}
              </Text>
            </YStack>

            <Separator borderColor="$borderColor" />

            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary">
                服务内容
              </Text>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$text">
                  在线图文咨询
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {selectedPackage.services.onlineConsultations === -1
                    ? '无限次'
                    : `${selectedPackage.services.onlineConsultations}次`}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$text">
                  视频咨询
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {selectedPackage.services.videoConsults === -1
                    ? '无限次'
                    : `${selectedPackage.services.videoConsults}次`}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$text">
                  线下面诊
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {selectedPackage.services.inPersonVisits === -1
                    ? '无限次'
                    : `${selectedPackage.services.inPersonVisits}次`}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$text">
                  上门服务
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {selectedPackage.services.homeVisits === -1
                    ? '无限次'
                    : `${selectedPackage.services.homeVisits}次`}
                </Text>
              </XStack>
            </YStack>

            <Separator borderColor="$borderColor" />

            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary">
                服务期限
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$text">
                12个月（自签约日起）
              </Text>
            </YStack>
          </YStack>
        </Card>

        <View
          backgroundColor={`${COLORS.primary}15`}
          padding="$3"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.primary}
        >
          <XStack space="$2" alignItems="flex-start">
            <AlertCircle size={16} color={COLORS.primary} />
            <YStack flex={1}>
              <Text fontSize="$3" color="$text" fontWeight="600">
                服务说明
              </Text>
              <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                • 签约后立即生效，服务期为12个月{'\n'}
                • 未使用的服务次数不支持退款{'\n'}
                • 可在到期前30天申请续约优惠
              </Text>
            </YStack>
          </XStack>
        </View>
      </YStack>
    );
  };

  const renderStep2 = () => {
    return (
      <YStack space="$4">
        <H4 fontSize="$6" fontWeight="700" color="$text">
          完善健康档案
        </H4>

        <Text fontSize="$3" color="$textSecondary">
          请填写基本健康信息，帮助医生更好地了解您的健康状况
        </Text>

        <Card backgroundColor="$cardBg" padding="$4" borderRadius="$4">
          <YStack space="$4">
            {/* 基本信息 */}
            <YStack space="$2">
              <Text fontSize="$3" fontWeight="600" color="$text">
                基本信息
              </Text>
              <XStack space="$3">
                <YStack flex={1}>
                  <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                    身高 (cm)
                  </Text>
                  <Input
                    placeholder="170"
                    value={healthProfile.height}
                    onChangeText={(text) =>
                      setHealthProfile({ ...healthProfile, height: text })
                    }
                    keyboardType="numeric"
                    borderColor="$borderColor"
                  />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                    体重 (kg)
                  </Text>
                  <Input
                    placeholder="65"
                    value={healthProfile.weight}
                    onChangeText={(text) =>
                      setHealthProfile({ ...healthProfile, weight: text })
                    }
                    keyboardType="numeric"
                    borderColor="$borderColor"
                  />
                </YStack>
              </XStack>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  血型
                </Text>
                <XStack space="$2">
                  {['A', 'B', 'AB', 'O', '不详'].map((type) => (
                    <Pressable
                      key={type}
                      onPress={() =>
                        setHealthProfile({ ...healthProfile, bloodType: type })
                      }
                    >
                      <View
                        paddingHorizontal="$3"
                        paddingVertical="$2"
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor={
                          healthProfile.bloodType === type
                            ? COLORS.primary
                            : '$borderColor'
                        }
                        backgroundColor={
                          healthProfile.bloodType === type
                            ? COLORS.primaryLight
                            : '$surface'
                        }
                      >
                        <Text
                          fontSize="$3"
                          color={
                            healthProfile.bloodType === type
                              ? 'white'
                              : '$text'
                          }
                        >
                          {type}型
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* 健康状况 */}
            <YStack space="$3">
              <Text fontSize="$3" fontWeight="600" color="$text">
                健康状况（选填）
              </Text>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  过敏史
                </Text>
                <TextArea
                  placeholder="如：青霉素过敏、海鲜过敏等"
                  value={healthProfile.allergies}
                  onChangeText={(text) =>
                    setHealthProfile({ ...healthProfile, allergies: text })
                  }
                  borderColor="$borderColor"
                  numberOfLines={3}
                />
              </YStack>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  慢性疾病
                </Text>
                <TextArea
                  placeholder="如：高血压、糖尿病等"
                  value={healthProfile.chronicDiseases}
                  onChangeText={(text) =>
                    setHealthProfile({
                      ...healthProfile,
                      chronicDiseases: text,
                    })
                  }
                  borderColor="$borderColor"
                  numberOfLines={3}
                />
              </YStack>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  正在服用的药物
                </Text>
                <TextArea
                  placeholder="如：降压药、维生素等"
                  value={healthProfile.medications}
                  onChangeText={(text) =>
                    setHealthProfile({ ...healthProfile, medications: text })
                  }
                  borderColor="$borderColor"
                  numberOfLines={3}
                />
              </YStack>
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* 紧急联系人 */}
            <YStack space="$3">
              <Text fontSize="$3" fontWeight="600" color="$text">
                紧急联系人 <Text color={COLORS.error}>*</Text>
              </Text>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  联系人姓名
                </Text>
                <Input
                  placeholder="请输入姓名"
                  value={healthProfile.emergencyContact}
                  onChangeText={(text) =>
                    setHealthProfile({
                      ...healthProfile,
                      emergencyContact: text,
                    })
                  }
                  borderColor="$borderColor"
                />
              </YStack>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  联系电话
                </Text>
                <Input
                  placeholder="请输入电话号码"
                  value={healthProfile.emergencyPhone}
                  onChangeText={(text) =>
                    setHealthProfile({ ...healthProfile, emergencyPhone: text })
                  }
                  keyboardType="phone-pad"
                  borderColor="$borderColor"
                />
              </YStack>
            </YStack>
          </YStack>
        </Card>
      </YStack>
    );
  };

  const renderStep3 = () => {
    return (
      <YStack space="$4">
        <H4 fontSize="$6" fontWeight="700" color="$text">
          预约首次咨询
        </H4>

        <Text fontSize="$3" color="$textSecondary">
          签约成功后，您可以预约首次咨询时间
        </Text>

        <Card backgroundColor="$cardBg" padding="$4" borderRadius="$4">
          <YStack space="$4">
            {/* 咨询方式 */}
            <YStack space="$2">
              <Text fontSize="$3" fontWeight="600" color="$text">
                咨询方式
              </Text>
              <YStack space="$2">
                {[
                  { value: 'video', label: '视频咨询', desc: '面对面沟通，更直观' },
                  { value: 'phone', label: '电话咨询', desc: '语音通话，方便快捷' },
                  {
                    value: 'in_person',
                    label: '线下面诊',
                    desc: '医院面诊，深入检查',
                  },
                ].map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() =>
                      setAppointmentPreference({
                        ...appointmentPreference,
                        consultationType: type.value,
                      })
                    }
                  >
                    <XStack
                      padding="$3"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        appointmentPreference.consultationType === type.value
                          ? COLORS.primary
                          : '$borderColor'
                      }
                      backgroundColor={
                        appointmentPreference.consultationType === type.value
                          ? COLORS.primaryLight
                          : '$surface'
                      }
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <YStack>
                        <Text
                          fontSize="$4"
                          fontWeight="600"
                          color={
                            appointmentPreference.consultationType === type.value
                              ? 'white'
                              : '$text'
                          }
                        >
                          {type.label}
                        </Text>
                        <Text
                          fontSize="$2"
                          color={
                            appointmentPreference.consultationType === type.value
                              ? 'white'
                              : '$textSecondary'
                          }
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

            <Separator borderColor="$borderColor" />

            {/* 预约时间 */}
            <YStack space="$3">
              <Text fontSize="$3" fontWeight="600" color="$text">
                预约时间
              </Text>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  日期 *
                </Text>
                <Input
                  placeholder="请输入日期，如 2025-01-15"
                  value={appointmentPreference.preferredDate}
                  onChangeText={(text) =>
                    setAppointmentPreference({
                      ...appointmentPreference,
                      preferredDate: text,
                    })
                  }
                  borderColor={
                    !appointmentPreference.preferredDate && currentStep === 3
                      ? COLORS.error
                      : '$borderColor'
                  }
                />
                {!appointmentPreference.preferredDate && currentStep === 3 && (
                  <Text fontSize="$2" color={COLORS.error} marginTop="$1">
                    请输入预约日期
                  </Text>
                )}
              </YStack>

              <YStack>
                <Text fontSize="$2" color="$textSecondary" marginBottom="$2">
                  时间段 *
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {['上午 9:00-12:00', '下午 14:00-17:00', '晚上 18:00-20:00'].map(
                    (time) => (
                      <Pressable
                        key={time}
                        onPress={() =>
                          setAppointmentPreference({
                            ...appointmentPreference,
                            preferredTime: time,
                          })
                        }
                      >
                        <View
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$2"
                          borderWidth={1}
                          borderColor={
                            appointmentPreference.preferredTime === time
                              ? COLORS.primary
                              : '$borderColor'
                          }
                          backgroundColor={
                            appointmentPreference.preferredTime === time
                              ? COLORS.primaryLight
                              : '$surface'
                          }
                          marginBottom="$2"
                        >
                          <Text
                            fontSize="$3"
                            color={
                              appointmentPreference.preferredTime === time
                                ? 'white'
                                : '$text'
                            }
                          >
                            {time}
                          </Text>
                        </View>
                      </Pressable>
                    )
                  )}
                </XStack>
                {!appointmentPreference.preferredTime && currentStep === 3 && (
                  <Text fontSize="$2" color={COLORS.error} marginTop="$2">
                    请选择时间段
                  </Text>
                )}
              </YStack>
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* 咨询问题 */}
            <YStack>
              <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
                咨询问题（选填）
              </Text>
              <TextArea
                placeholder="请简要描述您想咨询的健康问题"
                value={appointmentPreference.concerns}
                onChangeText={(text) =>
                  setAppointmentPreference({
                    ...appointmentPreference,
                    concerns: text,
                  })
                }
                borderColor="$borderColor"
                numberOfLines={4}
              />
            </YStack>
          </YStack>
        </Card>
      </YStack>
    );
  };

  const renderStep4 = () => {
    if (!selectedPackage) return null;

    return (
      <YStack space="$4">
        <H4 fontSize="$6" fontWeight="700" color="$text">
          确认支付
        </H4>

        {/* 订单信息 */}
        <Card backgroundColor="$cardBg" padding="$4" borderRadius="$4">
          <YStack space="$3">
            <Text fontSize="$4" fontWeight="600" color="$text">
              订单信息
            </Text>

            <Separator borderColor="$borderColor" />

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                服务套餐
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                {getPackageLevelLabel(selectedPackage.level)}
              </Text>
            </XStack>

            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$textSecondary">
                服务期限
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$text">
                12个月
              </Text>
            </XStack>

            <Separator borderColor="$borderColor" />

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$text">
                应付金额
              </Text>
              <XStack alignItems="baseline" space="$1">
                <Text fontSize="$2" color={COLORS.primary}>
                  ¥
                </Text>
                <Text fontSize="$8" fontWeight="700" color={COLORS.primary}>
                  {formatPrice(selectedPackage.price)}
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* 支付方式 */}
        <YStack space="$2">
          <Text fontSize="$4" fontWeight="600" color="$text">
            支付方式
          </Text>

          <YStack space="$2">
            {[
              { value: 'wechat', label: '微信支付', icon: '💚' },
              { value: 'alipay', label: '支付宝', icon: '💙' },
              { value: 'card', label: '银行卡', icon: '💳' },
            ].map((method) => (
              <Pressable
                key={method.value}
                onPress={() => setPaymentMethod(method.value)}
              >
                <XStack
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={
                    paymentMethod === method.value
                      ? COLORS.primary
                      : '$borderColor'
                  }
                  backgroundColor={
                    paymentMethod === method.value
                      ? COLORS.primaryLight
                      : '$surface'
                  }
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$2" alignItems="center">
                    <Text fontSize={24}>{method.icon}</Text>
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={
                        paymentMethod === method.value
                          ? 'white'
                          : '$text'
                      }
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
          backgroundColor={`${COLORS.warning}15`}
          padding="$3"
          borderRadius="$3"
        >
          <Text fontSize="$2" color="$textSecondary">
            点击"确认支付"即表示您已阅读并同意
            <Text color={COLORS.primary} fontWeight="600">
              《私人医生服务协议》
            </Text>
            和
            <Text color={COLORS.primary} fontWeight="600">
              《隐私保护政策》
            </Text>
          </Text>
        </View>
      </YStack>
    );
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
          <Pressable onPress={handleBack}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <Text fontSize="$5" color="$text" fontWeight="600" marginLeft="$3">
            签约私人医生
          </Text>
        </XStack>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* 底部占位 */}
          <View height={100} />
        </ScrollView>

        {/* Bottom Buttons */}
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
          <XStack space="$3">
            {currentStep > 1 && (
              <Button
                flex={1}
                size="$5"
                backgroundColor="$surface"
                color="$text"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                onPress={handleBack}
                disabled={submitting}
              >
                上一步
              </Button>
            )}
            <Button
              flex={2}
              size="$5"
              backgroundColor={COLORS.primary}
              color="white"
              borderRadius="$3"
              fontWeight="600"
              onPress={handleNext}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : currentStep === 4 ? (
                '确认支付'
              ) : (
                '下一步'
              )}
            </Button>
          </XStack>
        </View>
      </SafeAreaView>
    </Theme>
  );
};
