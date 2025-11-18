import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack, Card } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Video,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  CONSULTATION_TYPE_LABELS,
  CONSULTATION_STATUS_LABELS,
  CONSULTATION_STATUS_COLORS,
} from '@/constants/insurance';
import { getMyConsultations } from '@/services/insuranceAdvisorService';
import { InsuranceConsultation } from '@/types/insurance';

const InsuranceConsultationHistoryScreen: React.FC = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [consultations, setConsultations] = useState<InsuranceConsultation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      // TODO: 从用户状态获取userId
      const result = await getMyConsultations('user_001');
      setConsultations(result);
    } catch (error) {
      console.error('加载咨询记录失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadConsultations();
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'text':
        return MessageCircle;
      case 'phone':
        return Phone;
      case 'video':
        return Video;
      case 'home_visit':
        return Home;
      default:
        return MessageCircle;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (selectedStatus === 'all') return true;
    return consultation.status === selectedStatus;
  });

  const renderConsultationCard = (consultation: InsuranceConsultation) => {
    const Icon = getConsultationIcon(consultation.type);
    const StatusIcon = getStatusIcon(consultation.status);
    const statusColor =
      CONSULTATION_STATUS_COLORS[consultation.status as keyof typeof CONSULTATION_STATUS_COLORS] ||
      COLORS.textSecondary;

    return (
      <Pressable
        key={consultation.id}
        onPress={() => {
          // TODO: 跳转到咨询详情页
          console.log('查看咨询详情:', consultation.id);
        }}
      >
        <Card
          bordered
          padding="$4"
          backgroundColor="$surface"
          marginBottom="$3"
          pressStyle={{ scale: 0.98 }}
        >
          <YStack gap="$3">
            {/* 顾问信息和类型 */}
            <XStack justifyContent="space-between" alignItems="flex-start">
              <XStack gap="$2" alignItems="center" flex={1}>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$4" color="white" fontWeight="600">
                    {consultation.advisorName.charAt(0)}
                  </Text>
                </View>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {consultation.advisorName}
                  </Text>
                  <XStack alignItems="center" gap="$1">
                    <Icon size={12} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary">
                      {CONSULTATION_TYPE_LABELS[consultation.type as keyof typeof CONSULTATION_TYPE_LABELS]}
                    </Text>
                  </XStack>
                </YStack>
              </XStack>

              <View
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
                backgroundColor={`${statusColor}20`}
              >
                <XStack alignItems="center" gap="$1">
                  <StatusIcon size={12} color={statusColor} />
                  <Text fontSize="$2" color={statusColor} fontWeight="600">
                    {CONSULTATION_STATUS_LABELS[consultation.status as keyof typeof CONSULTATION_STATUS_LABELS]}
                  </Text>
                </XStack>
              </View>
            </XStack>

            {/* 问题内容 */}
            <Text fontSize="$3" color="$text" numberOfLines={2} lineHeight={20}>
              {consultation.question}
            </Text>

            {/* 标签 */}
            {consultation.tags && consultation.tags.length > 0 && (
              <XStack gap="$2" flexWrap="wrap">
                {consultation.tags.map((tag, idx) => (
                  <View
                    key={idx}
                    backgroundColor="$borderColor"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color="$text">
                      {tag}
                    </Text>
                  </View>
                ))}
              </XStack>
            )}

            {/* 回复预览 */}
            {consultation.reply && (
              <View
                backgroundColor="$borderColor"
                padding="$2"
                borderRadius="$2"
                borderLeftWidth={3}
                borderLeftColor={COLORS.primary}
              >
                <Text fontSize="$2" color="$textSecondary" marginBottom="$1">
                  顾问回复：
                </Text>
                <Text fontSize="$3" color="$text" numberOfLines={2} lineHeight={18}>
                  {consultation.reply}
                </Text>
              </View>
            )}

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$2" color="$textSecondary">
                {new Date(consultation.createdAt).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>

              {consultation.status === 'replied' && (
                <Text fontSize="$2" color={COLORS.primary}>
                  可追问 →
                </Text>
              )}
            </XStack>
          </YStack>
        </Card>
      </Pressable>
    );
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
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          咨询记录
        </Text>
      </XStack>

      {/* 状态筛选 */}
      <XStack
        padding="$3"
        gap="$2"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        {[
          { id: 'all', label: '全部' },
          { id: 'pending', label: '待回复' },
          { id: 'replied', label: '已回复' },
          { id: 'completed', label: '已完成' },
        ].map(status => (
          <Pressable key={status.id} onPress={() => setSelectedStatus(status.id)}>
            <View
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$2"
              backgroundColor={selectedStatus === status.id ? COLORS.primary : '$borderColor'}
            >
              <Text
                fontSize="$3"
                color={selectedStatus === status.id ? 'white' : '$text'}
                fontWeight={selectedStatus === status.id ? '600' : '400'}
              >
                {status.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </XStack>

      {/* 咨询列表 */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text marginTop="$3" color="$textSecondary">
            加载中...
          </Text>
        </View>
      ) : filteredConsultations.length === 0 ? (
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <MessageCircle size={48} color={COLORS.textSecondary} />
          <Text fontSize="$4" color="$textSecondary" textAlign="center" marginTop="$3">
            {selectedStatus === 'all' ? '暂无咨询记录' : '暂无该状态的咨询'}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('InsuranceAdvisorList' as never)}
            style={{ marginTop: 16 }}
          >
            <View
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius="$2"
              backgroundColor={COLORS.primary}
            >
              <Text color="white" fontWeight="600">
                咨询顾问
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <YStack padding="$4">
            <Text fontSize="$3" color="$textSecondary" marginBottom="$3">
              共 {filteredConsultations.length} 条记录
            </Text>
            {filteredConsultations.map(renderConsultationCard)}
          </YStack>
        </ScrollView>
      )}
    </View>
  );
};

export default InsuranceConsultationHistoryScreen;
