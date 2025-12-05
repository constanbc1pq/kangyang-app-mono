/**
 * Private Doctor Service Desk Screen
 * Phase 23: 服务台主页 - 私人医生服务中心
 *
 * 功能：
 * - 医生信息概览
 * - 快速咨询入口
 * - 服务用量统计
 * - 近期咨询记录
 * - 健康状态总览
 * - 快捷服务导航
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView as TamaguiScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Pressable,
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  MessageCircle,
  Video,
  Phone,
  Home,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Settings,
} from 'lucide-react-native';

const GOLD_COLOR = '#D4AF37';

import {
  PrivateDoctor,
  DoctorSubscription,
  ConsultationRecord,
  ConsultationType,
  MedicalHealthRecord,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { getAvatarSource } from '@/constants/avatars';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface PrivateDoctorServiceDeskScreenProps {
  navigation: any;
  route?: {
    params?: {
      subscriptionId?: string;
    };
  };
}

export const PrivateDoctorServiceDeskScreen: React.FC<
  PrivateDoctorServiceDeskScreenProps
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscription, setSubscription] = useState<DoctorSubscription | null>(
    null
  );
  const [doctor, setDoctor] = useState<PrivateDoctor | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<
    ConsultationRecord[]
  >([]);
  const [healthRecords, setHealthRecords] = useState<MedicalHealthRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
      loadServiceDesk();
    }, [])
  );

  const loadServiceDesk = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // 模拟用户ID - 实际应从auth context获取
      const userId = 'user_001';

      // 获取签约信息
      const subscriptionData =
        await privateDoctorService.getMySubscription(userId);
      setSubscription(subscriptionData);

      if (subscriptionData) {
        // 获取医生信息
        const doctorData = await privateDoctorService.getDoctorById(
          subscriptionData.doctorId
        );
        setDoctor(doctorData);

        // 获取近期咨询记录
        const consultations = await privateDoctorService.getConsultations(
          userId,
          { startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
        );
        setRecentConsultations(consultations.slice(0, 3));

        // 获取健康档案（包括用户自己和家庭成员）
        const records = await privateDoctorService.getHealthRecords(
          userId,
          subscriptionData.id
        );
        setHealthRecords(records);

        // 默认选择第一个档案（用户本人）
        if (records.length > 0 && !selectedRecordId) {
          setSelectedRecordId(records[0].id);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadServiceDesk(true);
  };

  const handleStartConsultation = (type: ConsultationType) => {
    if (!subscription || !doctor) return;

    // 图文咨询直接进入聊天页面
    if (type === ConsultationType.ONLINE_CHAT) {
      navigation.navigate('DoctorChat', {
        doctorId: doctor.id,
        subscriptionId: subscription.id,
      });
      return;
    }

    // 其他咨询类型进入预约/开始咨询页面
    navigation.navigate('StartConsultation', {
      doctorId: doctor.id,
      subscriptionId: subscription.id,
      consultationType: type,
    });
  };

  const getConsultationTypeLabel = (type: ConsultationType): string => {
    const labels: Record<ConsultationType, string> = {
      [ConsultationType.ONLINE_CHAT]: '图文咨询',
      [ConsultationType.PHONE]: '电话咨询',
      [ConsultationType.VIDEO]: '视频咨询',
      [ConsultationType.IN_PERSON]: '线下面诊',
      [ConsultationType.HOME_VISIT]: '上门服务',
    };
    return labels[type];
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  // 只有完全没有签约记录时才提示去签约，已取消的签约也能查看历史
  if (!subscription || !doctor) {
    return (
      <View flex={1} backgroundColor="$background">
        {/* TitleBar */}
        <View
          paddingTop={insets.top}
          backgroundColor="$color2"
          borderBottomWidth={1}
          borderBottomColor="$color5"
        >
          <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
            <Pressable onPress={() => navigation.goBack()}>
              <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
                <ArrowLeft size={24} color={color12} />
              </View>
            </Pressable>
            <Text fontSize="$5" fontWeight="600" color="$color12">专属服务台</Text>
            <View width={40} />
          </XStack>
        </View>

        <View flex={1} justifyContent="center" alignItems="center" padding="$2.5">
          <AlertCircle size={48} color={color10} />
          <Text fontSize="$4" color="$color10" marginTop="$2">
            您还没有签约私人医生服务
          </Text>
          <Pressable
            style={{ marginTop: 16 }}
            onPress={() => navigation.navigate('PrivateDoctorList')}
          >
            <View
              height={44}
              paddingHorizontal="$4"
              borderRadius="$10"
              backgroundColor="$primary"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" fontWeight="600" color="white">去签约</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  const quickActions = [
    {
      icon: MessageCircle,
      label: '图文咨询',
      type: ConsultationType.ONLINE_CHAT,
      color: primaryColor,
      remaining: subscription.remainingServices.onlineConsultations,
    },
    {
      icon: Video,
      label: '视频咨询',
      type: ConsultationType.VIDEO,
      color: successColor,
      remaining: subscription.remainingServices.videoConsults,
    },
    {
      icon: Phone,
      label: '电话咨询',
      type: ConsultationType.PHONE,
      color: warningColor,
      remaining: subscription.remainingServices.phoneConsults,
    },
    {
      icon: Home,
      label: '上门服务',
      type: ConsultationType.HOME_VISIT,
      color: errorColor,
      remaining: subscription.remainingServices.homeVisits,
    },
  ];

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => navigation.goBack()}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">专属服务台</Text>
          <Pressable
            onPress={() =>
              navigation.navigate('ContractManagement', {
                subscriptionId: subscription?.id,
              })
            }
          >
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <Settings size={24} color={color12} />
            </View>
          </Pressable>
        </XStack>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <YStack padding="$2.5" gap="$3">
          {/* Hero - 医生信息卡片 */}
          <View
            borderRadius="$5"
            overflow="hidden"
            backgroundColor="$primary"
            padding="$3"
          >
            <XStack gap="$3" alignItems="center" marginBottom="$3">
              <View
                width={72}
                height={72}
                borderRadius="$4"
                overflow="hidden"
                backgroundColor="$color4"
                borderWidth={2}
                borderColor="$color5"
              >
                <Image
                  source={getAvatarSource(doctor.avatar, doctor.name)}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>

              <YStack flex={1} gap="$1.5">
                <Text fontSize="$6" fontWeight="700" color="white">
                  {doctor.name} 医生
                </Text>
                <Text fontSize="$3" color="white" opacity={0.9}>
                  {doctor.hospital.name}
                </Text>
                <XStack alignItems="center" gap="$1.5">
                  <View
                    width={10}
                    height={10}
                    borderRadius={5}
                    backgroundColor={doctor.isOnline ? '#4ADE80' : '$color10'}
                  />
                  <Text fontSize="$3" color="white" opacity={0.9} fontWeight="600">
                    {doctor.isOnline ? '在线中' : '离线'}
                  </Text>
                </XStack>
              </YStack>
            </XStack>

            {/* 一键呼叫按钮 */}
            {doctor.isOnline && subscription.status === 'active' && (
              <Pressable onPress={() => handleStartConsultation(ConsultationType.ONLINE_CHAT)}>
                <View
                  backgroundColor="white"
                  borderRadius="$10"
                  paddingVertical="$2"
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack gap="$2" alignItems="center">
                    <MessageCircle size={20} color={primaryColor} />
                    <Text fontSize="$4" color="$primary" fontWeight="700">
                      立即咨询
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            )}
          </View>

          {/* 签约已取消提示 */}
          {subscription.status === 'cancelled' && (
            <View
              padding="$2"
              borderRadius="$4"
              borderLeftWidth={3}
              borderLeftColor="$error"
              style={{ backgroundColor: `${errorColor}10` }}
            >
              <YStack gap="$1.5">
                <XStack gap="$2" alignItems="center">
                  <AlertCircle size={20} color={errorColor} />
                  <Text fontSize="$4" fontWeight="700" color="$error">
                    签约已取消
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$color12" lineHeight={20}>
                  您的私人医生签约已取消，无法发起新的咨询和预约。历史记录和健康档案仍可查看。
                </Text>
              </YStack>
            </View>
          )}

          {/* 咨询方式选择 */}
          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              选择咨询方式
            </Text>

            <XStack gap="$2">
              {quickActions.slice(0, 3).map((action, index) => {
                const IconComponent = action.icon;
                const isAvailable =
                  subscription.status === 'active' &&
                  (action.remaining === -1 || action.remaining > 0);

                return (
                  <Pressable
                    key={index}
                    onPress={() =>
                      isAvailable && handleStartConsultation(action.type)
                    }
                    style={{ flex: 1 }}
                    disabled={subscription.status === 'cancelled'}
                  >
                    <View
                      backgroundColor="$color2"
                      padding="$2"
                      borderRadius="$5"
                      borderWidth={1}
                      borderColor="$color5"
                      opacity={isAvailable ? 1 : 0.5}
                    >
                      <YStack gap="$1.5" alignItems="center">
                        <View
                          width={44}
                          height={44}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          style={{ backgroundColor: `${action.color}15` }}
                        >
                          <IconComponent size={22} color={action.color} />
                        </View>
                        <Text
                          fontSize="$2"
                          fontWeight="600"
                          color="$color12"
                          textAlign="center"
                          numberOfLines={1}
                        >
                          {action.label}
                        </Text>
                        <Text fontSize={10} color="$color10">
                          {action.remaining === -1 ? '无限' : `剩余${action.remaining}`}
                        </Text>
                      </YStack>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
          </YStack>

          {/* 预约日程安排 - 仅在签约激活时可用 */}
          {subscription.status === 'active' && (
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                预约日程
              </Text>
              <View
                backgroundColor="$color2"
                padding="$2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
              >
                <YStack gap="$2">
                  {/* 即将到来的预约 */}
                  <XStack gap="$2" alignItems="center">
                    <View
                      width={4}
                      height={60}
                      borderRadius={2}
                      backgroundColor="$primary"
                    />
                    <YStack flex={1} gap="$1.5">
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$4" fontWeight="700" color="$color12">
                          视频咨询
                        </Text>
                        <View
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$2"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          <Text fontSize={11} color="$primary" fontWeight="600">
                            明天
                          </Text>
                        </View>
                      </XStack>
                      <XStack gap="$1.5" alignItems="center">
                        <Clock size={14} color={color10} />
                        <Text fontSize="$3" color="$color10">
                          明天 14:30 - 15:00
                        </Text>
                      </XStack>
                      <XStack gap="$1.5" alignItems="center">
                        <CheckCircle size={14} color={successColor} />
                        <Text fontSize="$3" color="$color10">
                          已确认
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>

                  <View height={1} backgroundColor="$color5" />

                  {/* 快捷预约按钮 */}
                  <Pressable
                    onPress={() =>
                      navigation.navigate('AppointmentBooking', {
                        subscriptionId: subscription.id,
                      })
                    }
                  >
                    <View
                      height={44}
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor="$primary"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <XStack gap="$2" alignItems="center">
                        <Calendar size={18} color={primaryColor} />
                        <Text fontSize="$4" color="$primary" fontWeight="600">
                          预约咨询
                        </Text>
                      </XStack>
                    </View>
                  </Pressable>
                </YStack>
              </View>
            </YStack>
          )}

          {/* 最近对话 */}
          {recentConsultations.length > 0 && (
            <YStack gap="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  最近对话
                </Text>
                <Pressable
                  onPress={() =>
                    navigation.navigate('ConsultationList', {
                      subscriptionId: subscription.id,
                    })
                  }
                >
                  <XStack gap="$0.5" alignItems="center">
                    <Text fontSize="$3" color="$primary" fontWeight="500">
                      查看全部
                    </Text>
                    <ChevronRight size={14} color={primaryColor} />
                  </XStack>
                </Pressable>
              </XStack>

              {recentConsultations.map((consultation) => (
                <Pressable
                  key={consultation.id}
                  onPress={() =>
                    navigation.navigate('ConsultationDetail', {
                      consultationId: consultation.id,
                    })
                  }
                >
                  <View
                    backgroundColor="$color2"
                    padding="$2"
                    borderRadius="$5"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <YStack gap="$1.5">
                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack gap="$2" alignItems="center">
                          <View
                            paddingHorizontal="$2"
                            paddingVertical="$0.5"
                            borderRadius="$2"
                            style={{ backgroundColor: `${primaryColor}15` }}
                          >
                            <Text
                              fontSize={11}
                              color="$primary"
                              fontWeight="600"
                            >
                              {getConsultationTypeLabel(consultation.type)}
                            </Text>
                          </View>
                          <Text fontSize="$2" color="$color10">
                            {new Date(consultation.createdAt).toLocaleDateString(
                              'zh-CN'
                            )}
                          </Text>
                        </XStack>
                        <View
                          paddingHorizontal="$2"
                          paddingVertical="$0.5"
                          borderRadius="$2"
                          style={{
                            backgroundColor:
                              consultation.status === 'completed'
                                ? `${successColor}15`
                                : `${warningColor}15`,
                          }}
                        >
                          <Text
                            fontSize={11}
                            color={
                              consultation.status === 'completed'
                                ? '$success'
                                : '$warning'
                            }
                            fontWeight="600"
                          >
                            {consultation.status === 'completed'
                              ? '已完成'
                              : '进行中'}
                          </Text>
                        </View>
                      </XStack>

                      <Text
                        fontSize="$3"
                        color="$color12"
                        numberOfLines={2}
                        lineHeight={20}
                      >
                        {consultation.chiefComplaint}
                      </Text>

                      {consultation.diagnosis && (
                        <Text fontSize="$2" color="$color10" numberOfLines={1}>
                          诊断：{consultation.diagnosis}
                        </Text>
                      )}
                    </YStack>
                  </View>
                </Pressable>
              ))}
            </YStack>
          )}

          {/* 健康档案 */}
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                健康档案
              </Text>
              {healthRecords.length > 0 && (
                <Pressable
                  onPress={() =>
                    navigation.navigate('HealthRecordDetail', {
                      recordId: selectedRecordId,
                      subscriptionId: subscription.id,
                    })
                  }
                >
                  <XStack gap="$0.5" alignItems="center">
                    <Text fontSize="$3" color="$primary" fontWeight="500">
                      管理档案
                    </Text>
                    <ChevronRight size={14} color={primaryColor} />
                  </XStack>
                </Pressable>
              )}
            </XStack>

            {healthRecords.length > 0 ? (
              <YStack gap="$2">
                {/* 家庭成员选择器 */}
                {healthRecords.length > 1 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <XStack gap="$2">
                      {healthRecords.map((record) => (
                        <Pressable
                          key={record.id}
                          onPress={() => setSelectedRecordId(record.id)}
                        >
                          <View
                            backgroundColor={
                              selectedRecordId === record.id
                                ? '$primary'
                                : '$color4'
                            }
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$10"
                            borderWidth={1}
                            borderColor={
                              selectedRecordId === record.id
                                ? '$primary'
                                : '$color5'
                            }
                          >
                            <Text
                              fontSize="$3"
                              color={
                                selectedRecordId === record.id ? 'white' : '$color12'
                              }
                              fontWeight={selectedRecordId === record.id ? '600' : '400'}
                            >
                              {record.basicInfo.name}
                              {record.familyMemberId && ' (家人)'}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </XStack>
                  </ScrollView>
                )}

                {/* 健康档案概览卡片 */}
                {healthRecords.find((r) => r.id === selectedRecordId) && (
                  <View
                    backgroundColor="$color2"
                    padding="$2"
                    borderRadius="$5"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    {(() => {
                      const record = healthRecords.find((r) => r.id === selectedRecordId)!;
                      return (
                        <YStack gap="$2">
                          {/* 基本信息 */}
                          <XStack justifyContent="space-between" alignItems="flex-start">
                            <YStack gap="$1">
                              <Text fontSize="$5" fontWeight="700" color="$color12">
                                {record.basicInfo.name}
                              </Text>
                              <XStack gap="$2">
                                <Text fontSize="$3" color="$color10">
                                  {record.basicInfo.gender === 'male' ? '男' : '女'} • {record.basicInfo.age}岁
                                </Text>
                                {record.basicInfo.bloodType && (
                                  <Text fontSize="$3" color="$color10">
                                    • {record.basicInfo.bloodType}型
                                  </Text>
                                )}
                              </XStack>
                            </YStack>
                            {record.healthAssessment && (
                              <View
                                paddingHorizontal="$3"
                                paddingVertical="$2"
                                borderRadius="$3"
                                style={{ backgroundColor: `${successColor}15` }}
                              >
                                <Text fontSize="$4" fontWeight="700" color="$success">
                                  {record.healthAssessment.overallScore}分
                                </Text>
                                <Text fontSize={10} color="$success">
                                  健康评分
                                </Text>
                              </View>
                            )}
                          </XStack>

                          {/* 关键健康指标 */}
                          {record.vitalSigns?.latestRecords && (
                            <YStack gap="$1.5">
                              <Text fontSize="$4" fontWeight="600" color="$color12">
                                生命体征
                              </Text>
                              <XStack gap="$1.5" flexWrap="wrap">
                                {record.vitalSigns.latestRecords.bloodPressure && (
                                  <View
                                    flex={1}
                                    minWidth={100}
                                    backgroundColor="$color4"
                                    padding="$2"
                                    borderRadius="$2"
                                  >
                                    <Text fontSize="$2" color="$color10">
                                      血压
                                    </Text>
                                    <Text fontSize="$3" fontWeight="600" color="$color12">
                                      {record.vitalSigns.latestRecords.bloodPressure.systolic}/
                                      {record.vitalSigns.latestRecords.bloodPressure.diastolic}
                                    </Text>
                                  </View>
                                )}
                                {record.vitalSigns.latestRecords.heartRate && (
                                  <View
                                    flex={1}
                                    minWidth={100}
                                    backgroundColor="$color4"
                                    padding="$2"
                                    borderRadius="$2"
                                  >
                                    <Text fontSize="$2" color="$color10">
                                      心率
                                    </Text>
                                    <Text fontSize="$3" fontWeight="600" color="$color12">
                                      {record.vitalSigns.latestRecords.heartRate.value} bpm
                                    </Text>
                                  </View>
                                )}
                                {record.vitalSigns.latestRecords.bloodSugar && (
                                  <View
                                    flex={1}
                                    minWidth={100}
                                    backgroundColor="$color4"
                                    padding="$2"
                                    borderRadius="$2"
                                  >
                                    <Text fontSize="$2" color="$color10">
                                      血糖
                                    </Text>
                                    <Text fontSize="$3" fontWeight="600" color="$color12">
                                      {record.vitalSigns.latestRecords.bloodSugar.value} mmol/L
                                    </Text>
                                  </View>
                                )}
                              </XStack>
                            </YStack>
                          )}

                          {/* 过敏史预警 */}
                          {(record.allergies.drugAllergies.length > 0 ||
                            record.allergies.foodAllergies.length > 0) && (
                            <View
                              padding="$2"
                              borderRadius="$3"
                              borderLeftWidth={3}
                              borderLeftColor="$error"
                              style={{ backgroundColor: `${errorColor}10` }}
                            >
                              <Text fontSize="$3" fontWeight="600" color="$error" marginBottom="$1">
                                ⚠️ 过敏提醒
                              </Text>
                              {record.allergies.drugAllergies.length > 0 && (
                                <Text fontSize="$2" color="$color12">
                                  药物过敏：{record.allergies.drugAllergies.join('、')}
                                </Text>
                              )}
                              {record.allergies.foodAllergies.length > 0 && (
                                <Text fontSize="$2" color="$color12">
                                  食物过敏：{record.allergies.foodAllergies.join('、')}
                                </Text>
                              )}
                            </View>
                          )}

                          {/* 慢性病管理 */}
                          {record.medicalHistory.chronicDiseases.length > 0 && (
                            <YStack gap="$1.5">
                              <Text fontSize="$4" fontWeight="600" color="$color12">
                                慢性病管理
                              </Text>
                              {record.medicalHistory.chronicDiseases.slice(0, 2).map((disease, index) => (
                                <XStack key={index} justifyContent="space-between" alignItems="center">
                                  <Text fontSize="$3" color="$color12">
                                    {disease.disease}
                                  </Text>
                                  <View
                                    paddingHorizontal="$2"
                                    paddingVertical="$0.5"
                                    borderRadius="$2"
                                    style={{
                                      backgroundColor:
                                        disease.status === 'controlled'
                                          ? `${successColor}15`
                                          : `${warningColor}15`,
                                    }}
                                  >
                                    <Text
                                      fontSize={11}
                                      color={
                                        disease.status === 'controlled'
                                          ? '$success'
                                          : '$warning'
                                      }
                                      fontWeight="600"
                                    >
                                      {disease.status === 'controlled'
                                        ? '已控制'
                                        : disease.status === 'cured'
                                        ? '已治愈'
                                        : '未控制'}
                                    </Text>
                                  </View>
                                </XStack>
                              ))}
                            </YStack>
                          )}
                        </YStack>
                      );
                    })()}
                  </View>
                )}
              </YStack>
            ) : (
              <View
                backgroundColor="$color2"
                padding="$4"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                alignItems="center"
              >
                <FileText size={48} color={color10} />
                <Text fontSize="$4" color="$color10" marginTop="$2">
                  暂无健康档案
                </Text>
                <Text fontSize="$2" color="$color10" marginTop="$1">
                  请联系医生建立您的健康档案
                </Text>
              </View>
            )}
          </YStack>

          {/* 底部占位 */}
          <View height={40} />
        </YStack>
      </ScrollView>
    </View>
  );
};
