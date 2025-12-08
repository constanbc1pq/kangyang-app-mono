/**
 * Consultation List Screen
 * Phase 23: 咨询记录列表页面 - 历史咨询记录管理
 *
 * 功能：
 * - 显示所有咨询记录
 * - 按类型和状态筛选
 * - 时间线展示
 * - 查看咨询详情
 * - 导出咨询记录
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
  FlatList,
} from 'react-native';
import {
  Filter,
  MessageCircle,
  Video,
  Phone,
  Home,
  Clock,
  CheckCircle,
  FileText,
  ChevronRight,
  Download,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  ConsultationRecord,
  ConsultationType,
  ConsultationStatus,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { useFocusEffect } from '@react-navigation/native';
import { TitleBar } from '@/components/TitleBar';

interface ConsultationListScreenProps {
  navigation: any;
  route: {
    params: {
      subscriptionId: string;
    };
  };
}

export const ConsultationListScreen: React.FC<
  ConsultationListScreenProps
> = ({ navigation, route }) => {
  const { subscriptionId } = route.params;
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ConsultationType | 'all'>(
    'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<
    ConsultationStatus | 'all'
  >('all');

  useFocusEffect(
    React.useCallback(() => {
      loadConsultations();
    }, [selectedType, selectedStatus])
  );

  const loadConsultations = async () => {
    setLoading(true);

    // 模拟用户ID
    const userId = 'user_001';

    const filters: any = {};
    if (selectedType !== 'all') filters.type = selectedType;
    if (selectedStatus !== 'all') filters.status = selectedStatus;

    const data = await privateDoctorService.getConsultations(userId, filters);
    setConsultations(data);
    setLoading(false);
  };

  const typeFilters = [
    { value: 'all', label: '全部', icon: FileText },
    { value: ConsultationType.ONLINE_CHAT, label: '图文', icon: MessageCircle },
    { value: ConsultationType.VIDEO, label: '视频', icon: Video },
    { value: ConsultationType.PHONE, label: '电话', icon: Phone },
    { value: ConsultationType.IN_PERSON, label: '面诊', icon: Clock },
    { value: ConsultationType.HOME_VISIT, label: '上门', icon: Home },
  ];

  const statusFilters = [
    { value: 'all', label: '全部' },
    { value: ConsultationStatus.SCHEDULED, label: '已预约' },
    { value: ConsultationStatus.IN_PROGRESS, label: '进行中' },
    { value: ConsultationStatus.COMPLETED, label: '已完成' },
    { value: ConsultationStatus.CANCELLED, label: '已取消' },
  ];

  const getConsultationTypeLabel = (type: ConsultationType): string => {
    const labels: Record<ConsultationType, string> = {
      [ConsultationType.ONLINE_CHAT]: '在线图文咨询',
      [ConsultationType.PHONE]: '电话咨询',
      [ConsultationType.VIDEO]: '视频咨询',
      [ConsultationType.IN_PERSON]: '线下面诊',
      [ConsultationType.HOME_VISIT]: '上门服务',
    };
    return labels[type];
  };

  const getConsultationStatusLabel = (status: ConsultationStatus): string => {
    const labels: Record<ConsultationStatus, string> = {
      [ConsultationStatus.SCHEDULED]: '已预约',
      [ConsultationStatus.IN_PROGRESS]: '进行中',
      [ConsultationStatus.COMPLETED]: '已完成',
      [ConsultationStatus.CANCELLED]: '已取消',
    };
    return labels[status];
  };

  const getStatusColor = (status: ConsultationStatus): string => {
    const colors: Record<ConsultationStatus, string> = {
      [ConsultationStatus.SCHEDULED]: COLORS.warning,
      [ConsultationStatus.IN_PROGRESS]: COLORS.primary,
      [ConsultationStatus.COMPLETED]: COLORS.success,
      [ConsultationStatus.CANCELLED]: COLORS.textSecondary,
    };
    return colors[status];
  };

  const getTypeIcon = (type: ConsultationType) => {
    const icons: Record<ConsultationType, any> = {
      [ConsultationType.ONLINE_CHAT]: MessageCircle,
      [ConsultationType.PHONE]: Phone,
      [ConsultationType.VIDEO]: Video,
      [ConsultationType.IN_PERSON]: Clock,
      [ConsultationType.HOME_VISIT]: Home,
    };
    return icons[type];
  };

  const handleExportRecords = () => {
    // 导出咨询记录功能
    alert('导出功能开发中...');
  };

  const renderConsultationCard = ({ item }: { item: ConsultationRecord }) => {
    const TypeIcon = getTypeIcon(item.type);

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('ConsultationDetail', {
            consultationId: item.id,
          })
        }
        style={{ marginBottom: 12 }}
      >
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
            {/* 头部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$2" alignItems="center">
                <View
                  width={36}
                  height={36}
                  borderRadius="$2"
                  backgroundColor={COLORS.primaryLight}
                  justifyContent="center"
                  alignItems="center"
                >
                  <TypeIcon size={20} color={COLORS.primary} />
                </View>
                <YStack>
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {getConsultationTypeLabel(item.type)}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {new Date(item.createdAt).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </YStack>
              </XStack>

              <View
                backgroundColor={`${getStatusColor(item.status)}15`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text
                  fontSize={11}
                  color={getStatusColor(item.status)}
                  fontWeight="600"
                >
                  {getConsultationStatusLabel(item.status)}
                </Text>
              </View>
            </XStack>

            {/* 主诉 */}
            <View
              backgroundColor="$surface"
              padding="$3"
              borderRadius="$3"
              borderLeftWidth={3}
              borderLeftColor={COLORS.primary}
            >
              <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                主诉
              </Text>
              <Text fontSize="$3" color="$text" lineHeight={20}>
                {item.chiefComplaint}
              </Text>
            </View>

            {/* 症状 */}
            {item.symptoms && item.symptoms.length > 0 && (
              <XStack space="$2" flexWrap="wrap">
                <Text fontSize="$2" color="$textSecondary">
                  症状：
                </Text>
                {item.symptoms.slice(0, 3).map((symptom, index) => (
                  <View
                    key={index}
                    backgroundColor="$surface"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize={11} color="$text">
                      {symptom}
                    </Text>
                  </View>
                ))}
                {item.symptoms.length > 3 && (
                  <Text fontSize={11} color="$textSecondary">
                    +{item.symptoms.length - 3}
                  </Text>
                )}
              </XStack>
            )}

            {/* 诊断 */}
            {item.diagnosis && (
              <YStack space="$1">
                <Text fontSize="$2" color="$textSecondary">
                  诊断
                </Text>
                <Text fontSize="$3" color="$text" fontWeight="600">
                  {item.diagnosis}
                </Text>
              </YStack>
            )}

            {/* 建议 */}
            {item.advice && (
              <YStack space="$1">
                <Text fontSize="$2" color="$textSecondary">
                  医嘱建议
                </Text>
                <Text fontSize="$3" color="$text" lineHeight={20} numberOfLines={2}>
                  {item.advice}
                </Text>
              </YStack>
            )}

            {/* 处方 */}
            {item.prescription && item.prescription.length > 0 && (
              <View
                backgroundColor={`${COLORS.warning}15`}
                padding="$2"
                borderRadius="$2"
              >
                <XStack alignItems="center" space="$1">
                  <FileText size={14} color={COLORS.warning} />
                  <Text fontSize="$2" color={COLORS.warning} fontWeight="600">
                    包含 {item.prescription.length} 项处方
                  </Text>
                </XStack>
              </View>
            )}

            {/* 查看详情按钮 */}
            <XStack justifyContent="flex-end">
              <Pressable
                onPress={() =>
                  navigation.navigate('ConsultationDetail', {
                    consultationId: item.id,
                  })
                }
              >
                <XStack alignItems="center" space="$1">
                  <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
                    查看详情
                  </Text>
                  <ChevronRight size={16} color={COLORS.primary} />
                </XStack>
              </Pressable>
            </XStack>
          </YStack>
        </Card>
      </Pressable>
    );
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <TitleBar
          title="咨询记录"
          onBack={() => navigation.goBack()}
          rightContent={
            <Pressable onPress={handleExportRecords}>
              <XStack
                space="$1"
                alignItems="center"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
                backgroundColor="$surface"
              >
                <Download size={16} color={COLORS.text} />
                <Text fontSize="$3" color="$text">
                  导出
                </Text>
              </XStack>
            </Pressable>
          }
        />

        <YStack flex={1}>
          {/* 类型筛选 */}
          <View paddingVertical="$3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <XStack space="$2">
                {typeFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Pressable
                      key={filter.value}
                      onPress={() =>
                        setSelectedType(
                          filter.value as ConsultationType | 'all'
                        )
                      }
                    >
                      <View
                        backgroundColor={
                          selectedType === filter.value
                            ? COLORS.primary
                            : '$surface'
                        }
                        paddingHorizontal="$3"
                        paddingVertical="$2"
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor={
                          selectedType === filter.value
                            ? COLORS.primary
                            : '$borderColor'
                        }
                      >
                        <XStack space="$1" alignItems="center">
                          <IconComponent
                            size={14}
                            color={
                              selectedType === filter.value
                                ? 'white'
                                : COLORS.text
                            }
                          />
                          <Text
                            fontSize="$3"
                            color={
                              selectedType === filter.value ? 'white' : '$text'
                            }
                            fontWeight={
                              selectedType === filter.value ? '600' : '400'
                            }
                          >
                            {filter.label}
                          </Text>
                        </XStack>
                      </View>
                    </Pressable>
                  );
                })}
              </XStack>
            </ScrollView>
          </View>

          {/* 状态筛选 */}
          <View paddingBottom="$3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <XStack space="$2">
                {statusFilters.map((filter) => (
                  <Pressable
                    key={filter.value}
                    onPress={() =>
                      setSelectedStatus(
                        filter.value as ConsultationStatus | 'all'
                      )
                    }
                  >
                    <View
                      backgroundColor={
                        selectedStatus === filter.value
                          ? COLORS.primary
                          : '$surface'
                      }
                      paddingHorizontal="$3"
                      paddingVertical="$1"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor={
                        selectedStatus === filter.value
                          ? COLORS.primary
                          : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$2"
                        color={
                          selectedStatus === filter.value ? 'white' : '$text'
                        }
                        fontWeight={
                          selectedStatus === filter.value ? '600' : '400'
                        }
                      >
                        {filter.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </ScrollView>
          </View>

          {/* 咨询列表 */}
          {loading ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : consultations.length === 0 ? (
            <View flex={1} justifyContent="center" alignItems="center" padding="$4">
              <FileText size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                暂无咨询记录
              </Text>
            </View>
          ) : (
            <FlatList
              data={consultations}
              renderItem={renderConsultationCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              onRefresh={loadConsultations}
              refreshing={loading}
            />
          )}
        </YStack>
      </SafeAreaView>
    </Theme>
  );
};
