import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H2,
  ScrollView,
} from 'tamagui';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  MessageCircle,
  ArrowLeft,
  Activity,
  Shield,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ServiceJob, ServiceType, Expert, ConversationRelatedType } from '@/types/community';
import { getJobById, getExperts, createConversation } from '@/services/communityDataService';
import { getMemberHealthProfile, getFamilyMemberById } from '@/services/userDataService';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from 'react-native';
import { QuoteFormModal } from '@/components/QuoteFormModal';

interface JobDetailScreenProps {
  route: {
    params: {
      jobId: string;
    };
  };
  navigation: any;
}

/**
 * 零工需求详情页
 */
export const JobDetailScreen: React.FC<JobDetailScreenProps> = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState<ServiceJob | null>(null);
  const [applicants, setApplicants] = useState<Expert[]>([]);
  const [relatedMemberInfo, setRelatedMemberInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    loadJobDetail();
  }, [jobId]);

  const loadJobDetail = async () => {
    try {
      setLoading(true);

      // 加载需求详情
      const jobData = await getJobById(jobId);
      if (!jobData) {
        console.error('未找到需求');
        return;
      }
      setJob(jobData);

      // 加载关联家庭成员的健康档案
      if (jobData.relatedMemberId) {
        try {
          const member = await getFamilyMemberById(jobData.relatedMemberId);
          if (member) {
            const healthProfile = await getMemberHealthProfile(jobData.relatedMemberId);
            setRelatedMemberInfo({
              member,
              healthProfile,
            });
          }
        } catch (error) {
          console.error('加载健康档案失败:', error);
        }
      }

      // 加载已报名达人列表
      if (jobData.applicantIds && jobData.applicantIds.length > 0) {
        const allExperts = await getExperts();
        const applicantList = allExperts.filter(expert =>
          jobData.applicantIds.includes(expert.id)
        );
        setApplicants(applicantList);
      }
    } catch (error) {
      console.error('加载需求详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = async () => {
    if (!job) return;

    try {
      // 当前用户ID（实际应从认证状态获取）
      const currentUserId = 'current-user-id';

      // 创建或获取与雇主的会话
      const conversation = await createConversation(
        currentUserId,
        job.employerId,
        ConversationRelatedType.JOB,
        job.id,
        job.title
      );

      // 跳转到聊天页面
      navigation.navigate('Chat', {
        conversationId: conversation.id,
      });
    } catch (error) {
      console.error('打开聊天失败:', error);
      Alert.alert('提示', '打开聊天失败，请稍后重试');
    }
  };

  const handleApply = () => {
    if (!job) return;
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = async (quoteData: {
    jobId: string;
    quotedPrice: number;
    serviceTime: string;
    duration: string;
    message: string;
  }) => {
    if (!job) return;

    try {
      // 当前用户ID（实际应从认证状态获取）
      const currentUserId = 'current-user-id';

      // 创建或获取与雇主的会话
      const conversation = await createConversation(
        currentUserId,
        job.employerId,
        ConversationRelatedType.JOB,
        job.id,
        job.title
      );

      // 关闭报价弹窗
      setShowQuoteModal(false);

      // 跳转到聊天页面（报价将在聊天页面发送）
      navigation.navigate('Chat', {
        conversationId: conversation.id,
        // 可以传递报价数据，让 ChatScreen 自动发送
        pendingQuote: quoteData,
      });

      Alert.alert('成功', '请在聊天中查看您的报价');
    } catch (error) {
      console.error('发送报价失败:', error);
      Alert.alert('失败', '发送报价失败，请稍后重试');
    }
  };

  const handleApplicantPress = (expertId: string) => {
    // TODO: 跳转到达人详情页
    navigation.navigate('ExpertDetail', { expertId });
  };

  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '陪诊服务',
      [ServiceType.ACCOMPANY_CHAT]: '陪聊服务',
      [ServiceType.ACCOMPANY_CARE]: '照护服务',
      [ServiceType.MASSAGE]: '按摩服务',
      [ServiceType.REHABILITATION]: '康复服务',
      [ServiceType.HEALTH_CONSULT]: '健康咨询',
      [ServiceType.NURSING]: '护理服务',
      [ServiceType.MEAL_PREP]: '配餐服务',
      [ServiceType.HOUSEKEEPING]: '家政服务',
      [ServiceType.REPAIR]: '维修服务',
      [ServiceType.SHOPPING]: '代购服务',
      [ServiceType.TAICHI]: '太极教学',
      [ServiceType.DANCE]: '广场舞教学',
      [ServiceType.PHONE_TEACH]: '手机教学',
      [ServiceType.MUSIC]: '音乐教学',
      [ServiceType.OTHER]: '其他服务',
    };
    return labels[type] || '其他服务';
  };

  const getServiceTypeEmoji = (type: ServiceType): string => {
    const emojis: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '🏥',
      [ServiceType.ACCOMPANY_CHAT]: '💬',
      [ServiceType.ACCOMPANY_CARE]: '🤝',
      [ServiceType.MASSAGE]: '💆',
      [ServiceType.REHABILITATION]: '🏃',
      [ServiceType.HEALTH_CONSULT]: '👨‍⚕️',
      [ServiceType.NURSING]: '👩‍⚕️',
      [ServiceType.MEAL_PREP]: '🍱',
      [ServiceType.HOUSEKEEPING]: '🧹',
      [ServiceType.REPAIR]: '🔧',
      [ServiceType.SHOPPING]: '🛒',
      [ServiceType.TAICHI]: '🥋',
      [ServiceType.DANCE]: '💃',
      [ServiceType.PHONE_TEACH]: '📱',
      [ServiceType.MUSIC]: '🎵',
      [ServiceType.OTHER]: '📋',
    };
    return emojis[type] || '📋';
  };

  if (loading || !job) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* Hero区 */}
        <View position="relative">
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 24,
              paddingTop: 60,
              minHeight: 200,
            }}
          >
            {/* 返回按钮 */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 10,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 20,
                padding: 8,
              }}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            {/* 服务图标 */}
            <View alignItems="center" marginBottom="$3">
              <View
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor="rgba(255,255,255,0.2)"
                justifyContent="center"
                alignItems="center"
                marginBottom="$2"
              >
                <Text fontSize={48}>{getServiceTypeEmoji(job.serviceType)}</Text>
              </View>
              <Text fontSize="$3" color="white" opacity={0.9}>
                {getServiceTypeLabel(job.serviceType)}
              </Text>
            </View>

            {/* 标签 */}
            <XStack justifyContent="center" flexWrap="wrap" gap="$2">
              {job.isUrgent && (
                <View
                  backgroundColor={COLORS.error}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <XStack space="$1" alignItems="center">
                    <AlertCircle size={12} color="white" />
                    <Text fontSize="$2" color="white" fontWeight="600">
                      紧急
                    </Text>
                  </XStack>
                </View>
              )}

              {job.isHighReward && (
                <View
                  backgroundColor="#FFD700"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="#8B4513" fontWeight="600">
                    💰 高佣金
                  </Text>
                </View>
              )}

              {job.healthTags && job.healthTags.length > 0 && (
                <View
                  backgroundColor="rgba(255,255,255,0.3)"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="white" fontWeight="600">
                    🏥 {job.healthTags.join('、')}
                  </Text>
                </View>
              )}
            </XStack>
          </LinearGradient>
        </View>

        <View padding="$4">
          {/* 标题 */}
          <H2 fontSize="$8" fontWeight="bold" color="$text" marginBottom="$3">
            {job.title}
          </H2>

          {/* 预算卡片 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor={`${COLORS.success}20`}
            marginBottom="$4"
            borderWidth={1}
            borderColor={COLORS.success}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1}>
                <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                  服务预算
                </Text>
                <XStack space="$2" alignItems="baseline">
                  <Text fontSize="$8" color={COLORS.success} fontWeight="bold">
                    {job.budget.currency}{job.budget.min}
                  </Text>
                  <Text fontSize="$4" color={COLORS.success}>
                    - {job.budget.currency}{job.budget.max}
                  </Text>
                </XStack>
              </YStack>
              <DollarSign size={48} color={COLORS.success} opacity={0.3} />
            </XStack>
          </Card>

          {/* 雇主信息卡片 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            marginBottom="$4"
            shadowColor="$shadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
            elevation={4}
          >
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              雇主信息
            </Text>
            <XStack space="$3" alignItems="center">
              <View
                width={50}
                height={50}
                borderRadius={25}
                backgroundColor={`${COLORS.primary}20`}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={28}>{job.employerAvatar || '👤'}</Text>
              </View>
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="$text">
                  {job.employerName}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  发布于 {job.publishTime}
                </Text>
              </YStack>
              <TouchableOpacity onPress={handleConsult}>
                <View
                  backgroundColor={COLORS.primary}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$3"
                >
                  <XStack space="$1" alignItems="center">
                    <MessageCircle size={16} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="600">
                      咨询
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            </XStack>
          </Card>

          {/* 服务详情 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            marginBottom="$4"
            shadowColor="$shadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
            elevation={4}
          >
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              服务详情
            </Text>

            <YStack space="$3">
              {/* 描述 */}
              <View>
                <Text fontSize="$3" color="$text" lineHeight="$2">
                  {job.description}
                </Text>
              </View>

              {/* 位置 */}
              <XStack space="$2" alignItems="flex-start">
                <MapPin size={18} color={COLORS.textSecondary} style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                    服务地点
                  </Text>
                  <Text fontSize="$4" color="$text">
                    {job.location.address}
                  </Text>
                </YStack>
              </XStack>

              {/* 时间 */}
              <XStack space="$2" alignItems="flex-start">
                <Clock size={18} color={COLORS.textSecondary} style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
                    服务时间
                  </Text>
                  <Text fontSize="$4" color="$text">
                    {job.serviceTime}
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                    预计时长：{job.duration}
                  </Text>
                </YStack>
              </XStack>

              {/* 要求 */}
              {job.requirements && job.requirements.length > 0 && (
                <View>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                    特殊要求
                  </Text>
                  <XStack flexWrap="wrap" gap="$2">
                    {job.requirements.map((req, index) => (
                      <View
                        key={index}
                        backgroundColor={`${COLORS.primary}20`}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text fontSize="$3" color={COLORS.primary}>
                          {req}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}
            </YStack>
          </Card>

          {/* 健康档案关联 - 与康页面数据联动 */}
          {relatedMemberInfo && (
            <Card
              padding="$4"
              borderRadius="$4"
              backgroundColor="$surface"
              marginBottom="$4"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
            >
              <XStack space="$2" alignItems="center" marginBottom="$3">
                <Shield size={18} color={COLORS.primary} />
                <Text fontSize="$4" fontWeight="600" color="$text">
                  服务对象健康档案
                </Text>
                <View
                  backgroundColor={`${COLORS.primary}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color={COLORS.primary} fontWeight="600">
                    脱敏展示
                  </Text>
                </View>
              </XStack>

              <View
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
                marginBottom="$3"
              >
                <XStack space="$3" alignItems="flex-start">
                  {/* 成员头像 */}
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={`${COLORS.primary}20`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={24}>
                      {relatedMemberInfo.member.avatar || '👤'}
                    </Text>
                  </View>

                  {/* 成员信息 */}
                  <YStack flex={1} space="$2">
                    <XStack space="$2" alignItems="center">
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        {relatedMemberInfo.member.name}
                      </Text>
                      <View
                        backgroundColor="$background"
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <Text fontSize="$2" color="$textSecondary">
                          {relatedMemberInfo.member.relationship}
                        </Text>
                      </View>
                    </XStack>

                    <XStack space="$3" alignItems="center">
                      <Text fontSize="$3" color="$textSecondary">
                        {relatedMemberInfo.member.healthProfile.age}岁
                      </Text>
                      <XStack space="$1" alignItems="center">
                        <Activity
                          size={14}
                          color={
                            relatedMemberInfo.member.healthProfile.healthStatus === 'excellent'
                              ? COLORS.success
                              : relatedMemberInfo.member.healthProfile.healthStatus === 'good'
                              ? COLORS.primary
                              : COLORS.warning
                          }
                        />
                        <Text
                          fontSize="$3"
                          fontWeight="600"
                          color={
                            relatedMemberInfo.member.healthProfile.healthStatus === 'excellent'
                              ? COLORS.success
                              : relatedMemberInfo.member.healthProfile.healthStatus === 'good'
                              ? COLORS.primary
                              : COLORS.warning
                          }
                        >
                          健康状态{
                            relatedMemberInfo.member.healthProfile.healthStatus === 'excellent'
                              ? '优秀'
                              : relatedMemberInfo.member.healthProfile.healthStatus === 'good'
                              ? '良好'
                              : '需关注'
                          }
                        </Text>
                      </XStack>
                    </XStack>

                    <Text fontSize="$3" color="$text">
                      健康评分：{relatedMemberInfo.member.healthProfile.healthScore} 分
                    </Text>
                  </YStack>
                </XStack>
              </View>

              {/* 健康标签 */}
              {job.healthTags && job.healthTags.length > 0 && (
                <View>
                  <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                    健康提示
                  </Text>
                  <XStack flexWrap="wrap" gap="$2">
                    {job.healthTags.map((tag, index) => (
                      <View
                        key={index}
                        backgroundColor={`${COLORS.warning}20`}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor={COLORS.warning}
                      >
                        <Text fontSize="$3" color={COLORS.warning} fontWeight="600">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}

              {/* 提示信息 */}
              <View
                backgroundColor={`${COLORS.primary}10`}
                padding="$3"
                borderRadius="$3"
                marginTop="$3"
              >
                <Text fontSize="$2" color="$textSecondary" lineHeight="$1">
                  ℹ️ 健康档案已脱敏处理，仅展示必要信息。达人接单后可查看更详细的健康数据以提供更专业的服务。
                </Text>
              </View>
            </Card>
          )}

          {/* 已报名达人 */}
          {applicants.length > 0 && (
            <Card
              padding="$4"
              borderRadius="$4"
              backgroundColor="$surface"
              marginBottom="$4"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <XStack space="$2" alignItems="center">
                  <Users size={18} color={COLORS.primary} />
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    已有 {applicants.length} 位达人报名
                  </Text>
                </XStack>
              </XStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$3">
                  {applicants.map(expert => (
                    <TouchableOpacity
                      key={expert.id}
                      onPress={() => handleApplicantPress(expert.id)}
                    >
                      <YStack alignItems="center" width={80}>
                        <View
                          width={60}
                          height={60}
                          borderRadius={30}
                          backgroundColor={`${COLORS.primary}20`}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$2"
                        >
                          <Text fontSize={32}>{expert.avatar || '👤'}</Text>
                        </View>
                        <Text
                          fontSize="$3"
                          color="$text"
                          fontWeight="600"
                          textAlign="center"
                          numberOfLines={1}
                        >
                          {expert.name}
                        </Text>
                        <Text fontSize="$2" color={COLORS.primary} marginTop="$1">
                          ⭐ {expert.rating.toFixed(1)}
                        </Text>
                      </YStack>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </ScrollView>
            </Card>
          )}

          {/* 底部占位空间，避免被底部按钮遮挡 */}
          <View height={80} />
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="white"
        padding="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={8}
      >
        <XStack space="$3">
          <TouchableOpacity style={{ flex: 1 }} onPress={handleConsult}>
            <View
              flex={1}
              backgroundColor="white"
              borderRadius="$3"
              paddingVertical="$3"
              justifyContent="center"
              alignItems="center"
              borderWidth={1}
              borderColor={COLORS.primary}
            >
              <XStack space="$2" alignItems="center">
                <MessageCircle size={20} color={COLORS.primary} />
                <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
                  咨询雇主
                </Text>
              </XStack>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={handleApply}>
            <View
              flex={1}
              backgroundColor={COLORS.primary}
              borderRadius="$3"
              paddingVertical="$3"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                报名接单
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>

      {/* 报价表单弹窗 */}
      {job && (
        <QuoteFormModal
          visible={showQuoteModal}
          jobTitle={job.title}
          jobId={job.id}
          onClose={() => setShowQuoteModal(false)}
          onSubmit={handleSubmitQuote}
        />
      )}
    </SafeAreaView>
  );
};
