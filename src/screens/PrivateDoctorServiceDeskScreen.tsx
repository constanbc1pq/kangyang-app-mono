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
  Card,
  View,
  Button,
  H4,
  Progress,
  Theme,
  ScrollView,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  MessageCircle,
  Video,
  Phone,
  Home,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  Bell,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/app';
import {
  PrivateDoctor,
  DoctorSubscription,
  ConsultationRecord,
  ConsultationType,
  MedicalHealthRecord,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { getFamilyMembers } from '@/services/userDataService';
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

  const getServiceUsagePercentage = (remaining: number, total: number): number => {
    if (total === -1) return 100;
    return (remaining / total) * 100;
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

  // 只有完全没有签约记录时才提示去签约，已取消的签约也能查看历史
  if (!subscription || !doctor) {
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
            <Text fontSize="$5" color="$text" fontWeight="600" flex={1} textAlign="center">
              专属服务台
            </Text>
            <View width={24} />
          </XStack>

          <View flex={1} justifyContent="center" alignItems="center" padding="$4">
            <AlertCircle size={48} color={COLORS.textSecondary} />
            <Text fontSize="$4" color="$textSecondary" marginTop="$3">
              您还没有签约私人医生服务
            </Text>
            <Button
              marginTop="$4"
              backgroundColor={COLORS.primary}
              color="white"
              onPress={() => navigation.navigate('PrivateDoctorList')}
            >
              去签约
            </Button>
          </View>
        </SafeAreaView>
      </Theme>
    );
  }

  const quickActions = [
    {
      icon: MessageCircle,
      label: '图文咨询',
      type: ConsultationType.ONLINE_CHAT,
      color: COLORS.primary,
      remaining: subscription.remainingServices.onlineConsultations,
    },
    {
      icon: Video,
      label: '视频咨询',
      type: ConsultationType.VIDEO,
      color: COLORS.success,
      remaining: subscription.remainingServices.videoConsults,
    },
    {
      icon: Phone,
      label: '电话咨询',
      type: ConsultationType.PHONE,
      color: COLORS.warning,
      remaining: subscription.remainingServices.phoneConsults,
    },
    {
      icon: Home,
      label: '上门服务',
      type: ConsultationType.HOME_VISIT,
      color: COLORS.error,
      remaining: subscription.remainingServices.homeVisits,
    },
  ];

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
          <Text fontSize="$5" color="$text" fontWeight="600" flex={1} textAlign="center">
            专属服务台
          </Text>
          <Pressable
            onPress={() =>
              navigation.navigate('ContractManagement', {
                subscriptionId: subscription?.id,
              })
            }
          >
            <Settings size={24} color={COLORS.text} />
          </Pressable>
        </XStack>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <YStack padding="$4" space="$4">
            {/* Hero - 医生信息卡片 */}
            <View borderRadius="$4" overflow="hidden">
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 20 }}
              >
                <XStack space="$3" alignItems="center" marginBottom="$4">
                  <View
                    width={72}
                    height={72}
                    borderRadius="$4"
                    overflow="hidden"
                    backgroundColor="rgba(255,255,255,0.2)"
                    borderWidth={2}
                    borderColor="rgba(255,255,255,0.3)"
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
                        backgroundColor="rgba(255,255,255,0.15)"
                      >
                        <Text fontSize={32} fontWeight="600" color="white">
                          {doctor.name[0]}
                        </Text>
                      </View>
                    )}
                  </View>

                  <YStack flex={1} space="$2">
                    <Text fontSize="$6" fontWeight="700" color="white">
                      {doctor.name} 医生
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                      {doctor.hospital.name}
                    </Text>
                    <XStack alignItems="center" space="$2">
                      <View
                        width={10}
                        height={10}
                        borderRadius={5}
                        backgroundColor={doctor.isOnline ? '#4ADE80' : '#94A3B8'}
                      />
                      <Text fontSize="$3" color="rgba(255,255,255,0.9)" fontWeight="600">
                        {doctor.isOnline ? '在线中' : '离线'}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>

                {/* 一键呼叫按钮 */}
                {doctor.isOnline && (
                  <Pressable onPress={() => handleStartConsultation(ConsultationType.ONLINE_CHAT)}>
                    <View
                      backgroundColor="white"
                      borderRadius="$3"
                      paddingVertical="$3"
                      justifyContent="center"
                      alignItems="center"
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 4 }}
                      shadowOpacity={0.15}
                      shadowRadius={8}
                      elevation={4}
                    >
                      <XStack space="$2" alignItems="center">
                        <MessageCircle size={20} color={COLORS.primary} />
                        <Text fontSize="$4" color={COLORS.primary} fontWeight="700">
                          立即咨询
                        </Text>
                      </XStack>
                    </View>
                  </Pressable>
                )}
              </LinearGradient>
            </View>

            {/* 签约已取消提示 */}
            {subscription.status === 'cancelled' && (
              <Card
                backgroundColor={`${COLORS.error}10`}
                padding="$4"
                borderRadius="$4"
                borderLeftWidth={4}
                borderLeftColor={COLORS.error}
              >
                <YStack space="$2">
                  <XStack space="$2" alignItems="center">
                    <AlertCircle size={20} color={COLORS.error} />
                    <Text fontSize="$4" fontWeight="700" color={COLORS.error}>
                      签约已取消
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$text" lineHeight={20}>
                    您的私人医生签约已取消，无法发起新的咨询和预约。历史记录和健康档案仍可查看。
                  </Text>
                </YStack>
              </Card>
            )}

            {/* 咨询方式选择 */}
            <YStack space="$3">
              <H4 fontSize="$5" fontWeight="700" color="$text">
                选择咨询方式
              </H4>

              <XStack space="$3">
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
                      <Card
                        backgroundColor="$cardBg"
                        padding="$3"
                        borderRadius="$4"
                        opacity={isAvailable ? 1 : 0.5}
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.08}
                        shadowRadius={4}
                        elevation={3}
                      >
                        <YStack space="$2" alignItems="center">
                          <View
                            width={44}
                            height={44}
                            borderRadius="$3"
                            backgroundColor={`${action.color}15`}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <IconComponent size={22} color={action.color} />
                          </View>
                          <Text
                            fontSize="$2"
                            fontWeight="600"
                            color="$text"
                            textAlign="center"
                            numberOfLines={1}
                          >
                            {action.label}
                          </Text>
                          <Text fontSize={10} color="$textSecondary">
                            {action.remaining === -1 ? '无限' : `剩余${action.remaining}`}
                          </Text>
                        </YStack>
                      </Card>
                    </Pressable>
                  );
                })}
              </XStack>
            </YStack>

            {/* 预约日程安排 - 仅在签约激活时可用 */}
            {subscription.status === 'active' && (
              <YStack space="$3">
                <H4 fontSize="$5" fontWeight="700" color="$text">
                  预约日程
                </H4>
                <Card
                  backgroundColor="$cardBg"
                  padding="$4"
                  borderRadius="$4"
                  shadowColor="$shadow"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.08}
                  shadowRadius={4}
                  elevation={3}
                >
                  <YStack space="$3">
                    {/* 即将到来的预约 */}
                    <XStack space="$3" alignItems="center">
                      <View
                        width={4}
                        height={60}
                        borderRadius={2}
                        backgroundColor={COLORS.primary}
                      />
                      <YStack flex={1} space="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$4" fontWeight="700" color="$text">
                            视频咨询
                          </Text>
                          <View
                            backgroundColor={`${COLORS.primary}15`}
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize={11} color={COLORS.primary} fontWeight="600">
                              明天
                            </Text>
                          </View>
                        </XStack>
                        <XStack space="$2" alignItems="center">
                          <Clock size={14} color={COLORS.textSecondary} />
                          <Text fontSize="$3" color="$textSecondary">
                            明天 14:30 - 15:00
                          </Text>
                        </XStack>
                        <XStack space="$2" alignItems="center">
                          <CheckCircle size={14} color={COLORS.success} />
                          <Text fontSize="$3" color="$textSecondary">
                            已确认
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>

                    <View height={1} backgroundColor="$borderColor" />

                    {/* 快捷预约按钮 */}
                    <Pressable
                      onPress={() =>
                        navigation.navigate('AppointmentBooking', {
                          subscriptionId: subscription.id,
                        })
                      }
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor={COLORS.primary}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <XStack space="$2" alignItems="center">
                          <Calendar size={18} color={COLORS.primary} />
                          <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
                            预约咨询
                          </Text>
                        </XStack>
                      </View>
                    </Pressable>
                  </YStack>
                </Card>
              </YStack>
            )}

            {/* 最近对话 */}
            {recentConsultations.length > 0 && (
              <YStack space="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <H4 fontSize="$5" fontWeight="700" color="$text">
                    最近对话
                  </H4>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('ConsultationList', {
                        subscriptionId: subscription.id,
                      })
                    }
                  >
                    <XStack space="$1" alignItems="center">
                      <Text fontSize="$3" color={COLORS.primary}>
                        查看全部
                      </Text>
                      <ChevronRight size={16} color={COLORS.primary} />
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
                    <Card
                      backgroundColor="$cardBg"
                      padding="$3"
                      borderRadius="$4"
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.08}
                      shadowRadius={4}
                      elevation={3}
                    >
                      <YStack space="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack space="$2" alignItems="center">
                            <View
                              backgroundColor={COLORS.primaryLight}
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text
                                fontSize={11}
                                color={COLORS.primary}
                                fontWeight="600"
                              >
                                {getConsultationTypeLabel(consultation.type)}
                              </Text>
                            </View>
                            <Text fontSize="$2" color="$textSecondary">
                              {new Date(consultation.createdAt).toLocaleDateString(
                                'zh-CN'
                              )}
                            </Text>
                          </XStack>
                          <View
                            backgroundColor={
                              consultation.status === 'completed'
                                ? `${COLORS.success}15`
                                : `${COLORS.warning}15`
                            }
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$2"
                          >
                            <Text
                              fontSize={11}
                              color={
                                consultation.status === 'completed'
                                  ? COLORS.success
                                  : COLORS.warning
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
                          color="$text"
                          numberOfLines={2}
                          lineHeight={20}
                        >
                          {consultation.chiefComplaint}
                        </Text>

                        {consultation.diagnosis && (
                          <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
                            诊断：{consultation.diagnosis}
                          </Text>
                        )}
                      </YStack>
                    </Card>
                  </Pressable>
                ))}
              </YStack>
            )}

            {/* 健康档案 */}
            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H4 fontSize="$5" fontWeight="700" color="$text">
                  健康档案
                </H4>
                {healthRecords.length > 0 && (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('HealthRecordDetail', {
                        recordId: selectedRecordId,
                        subscriptionId: subscription.id,
                      })
                    }
                  >
                    <XStack space="$1" alignItems="center">
                      <Text fontSize="$3" color={COLORS.primary}>
                        管理档案
                      </Text>
                      <ChevronRight size={16} color={COLORS.primary} />
                    </XStack>
                  </Pressable>
                )}
              </XStack>

              {healthRecords.length > 0 ? (
                <YStack space="$3">
                  {/* 家庭成员选择器 */}
                  {healthRecords.length > 1 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <XStack space="$2">
                        {healthRecords.map((record) => (
                          <Pressable
                            key={record.id}
                            onPress={() => setSelectedRecordId(record.id)}
                          >
                            <View
                              backgroundColor={
                                selectedRecordId === record.id
                                  ? COLORS.primary
                                  : '$surface'
                              }
                              paddingHorizontal="$3"
                              paddingVertical="$2"
                              borderRadius="$3"
                              borderWidth={1}
                              borderColor={
                                selectedRecordId === record.id
                                  ? COLORS.primary
                                  : '$borderColor'
                              }
                            >
                              <Text
                                fontSize="$3"
                                color={
                                  selectedRecordId === record.id ? 'white' : '$text'
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
                    <Card
                      backgroundColor="$cardBg"
                      padding="$4"
                      borderRadius="$4"
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.08}
                      shadowRadius={4}
                      elevation={3}
                    >
                      {(() => {
                        const record = healthRecords.find((r) => r.id === selectedRecordId)!;
                        return (
                          <YStack space="$3">
                            {/* 基本信息 */}
                            <XStack justifyContent="space-between" alignItems="flex-start">
                              <YStack space="$1">
                                <Text fontSize="$5" fontWeight="700" color="$text">
                                  {record.basicInfo.name}
                                </Text>
                                <XStack space="$2">
                                  <Text fontSize="$3" color="$textSecondary">
                                    {record.basicInfo.gender === 'male' ? '男' : '女'} • {record.basicInfo.age}岁
                                  </Text>
                                  {record.basicInfo.bloodType && (
                                    <Text fontSize="$3" color="$textSecondary">
                                      • {record.basicInfo.bloodType}型
                                    </Text>
                                  )}
                                </XStack>
                              </YStack>
                              {record.healthAssessment && (
                                <View
                                  backgroundColor={`${COLORS.success}15`}
                                  paddingHorizontal="$3"
                                  paddingVertical="$2"
                                  borderRadius="$3"
                                >
                                  <Text fontSize="$4" fontWeight="700" color={COLORS.success}>
                                    {record.healthAssessment.overallScore}分
                                  </Text>
                                  <Text fontSize={10} color={COLORS.success}>
                                    健康评分
                                  </Text>
                                </View>
                              )}
                            </XStack>

                            {/* 关键健康指标 */}
                            {record.vitalSigns?.latestRecords && (
                              <YStack space="$2">
                                <Text fontSize="$4" fontWeight="600" color="$text">
                                  生命体征
                                </Text>
                                <XStack space="$2" flexWrap="wrap">
                                  {record.vitalSigns.latestRecords.bloodPressure && (
                                    <View
                                      flex={1}
                                      minWidth={100}
                                      backgroundColor="$surface"
                                      padding="$2"
                                      borderRadius="$2"
                                    >
                                      <Text fontSize="$2" color="$textSecondary">
                                        血压
                                      </Text>
                                      <Text fontSize="$3" fontWeight="600" color="$text">
                                        {record.vitalSigns.latestRecords.bloodPressure.systolic}/
                                        {record.vitalSigns.latestRecords.bloodPressure.diastolic}
                                      </Text>
                                    </View>
                                  )}
                                  {record.vitalSigns.latestRecords.heartRate && (
                                    <View
                                      flex={1}
                                      minWidth={100}
                                      backgroundColor="$surface"
                                      padding="$2"
                                      borderRadius="$2"
                                    >
                                      <Text fontSize="$2" color="$textSecondary">
                                        心率
                                      </Text>
                                      <Text fontSize="$3" fontWeight="600" color="$text">
                                        {record.vitalSigns.latestRecords.heartRate.value} bpm
                                      </Text>
                                    </View>
                                  )}
                                  {record.vitalSigns.latestRecords.bloodSugar && (
                                    <View
                                      flex={1}
                                      minWidth={100}
                                      backgroundColor="$surface"
                                      padding="$2"
                                      borderRadius="$2"
                                    >
                                      <Text fontSize="$2" color="$textSecondary">
                                        血糖
                                      </Text>
                                      <Text fontSize="$3" fontWeight="600" color="$text">
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
                                backgroundColor={`${COLORS.error}10`}
                                padding="$3"
                                borderRadius="$3"
                                borderLeftWidth={3}
                                borderLeftColor={COLORS.error}
                              >
                                <Text fontSize="$3" fontWeight="600" color={COLORS.error} marginBottom="$1">
                                  ⚠️ 过敏提醒
                                </Text>
                                {record.allergies.drugAllergies.length > 0 && (
                                  <Text fontSize="$2" color="$text">
                                    药物过敏：{record.allergies.drugAllergies.join('、')}
                                  </Text>
                                )}
                                {record.allergies.foodAllergies.length > 0 && (
                                  <Text fontSize="$2" color="$text">
                                    食物过敏：{record.allergies.foodAllergies.join('、')}
                                  </Text>
                                )}
                              </View>
                            )}

                            {/* 慢性病管理 */}
                            {record.medicalHistory.chronicDiseases.length > 0 && (
                              <YStack space="$2">
                                <Text fontSize="$4" fontWeight="600" color="$text">
                                  慢性病管理
                                </Text>
                                {record.medicalHistory.chronicDiseases.slice(0, 2).map((disease, index) => (
                                  <XStack key={index} justifyContent="space-between" alignItems="center">
                                    <Text fontSize="$3" color="$text">
                                      {disease.disease}
                                    </Text>
                                    <View
                                      backgroundColor={
                                        disease.status === 'controlled'
                                          ? `${COLORS.success}15`
                                          : `${COLORS.warning}15`
                                      }
                                      paddingHorizontal="$2"
                                      paddingVertical="$1"
                                      borderRadius="$2"
                                    >
                                      <Text
                                        fontSize={11}
                                        color={
                                          disease.status === 'controlled'
                                            ? COLORS.success
                                            : COLORS.warning
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
                    </Card>
                  )}
                </YStack>
              ) : (
                <Card
                  backgroundColor="$cardBg"
                  padding="$6"
                  borderRadius="$4"
                  alignItems="center"
                >
                  <FileText size={48} color={COLORS.textSecondary} />
                  <Text fontSize="$4" color="$textSecondary" marginTop="$3">
                    暂无健康档案
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    请联系医生建立您的健康档案
                  </Text>
                </Card>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};
