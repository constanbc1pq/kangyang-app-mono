/**
 * JobDetailScreen 需求详情页
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
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
import { Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  MessageCircle,
  Activity,
  Shield,
} from 'lucide-react-native';
import { ServiceJob, ServiceType, Expert, ConversationRelatedType } from '@/types/community';
import { getJobById, getExperts, createConversation } from '@/services/communityDataService';
import { getMemberHealthProfile, getFamilyMemberById } from '@/services/userDataService';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { TitleBar } from '@/components/TitleBar';

interface JobDetailScreenProps {
  route: {
    params: {
      jobId: string;
    };
  };
  navigation: any;
}

/**
 * 需求详情页
 */
export const JobDetailScreen: React.FC<JobDetailScreenProps> = ({ route, navigation }) => {
  const { jobId } = route.params;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

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
      const currentUserId = 'current-user-id';
      const conversation = await createConversation(
        currentUserId,
        job.employerId,
        ConversationRelatedType.JOB,
        job.id,
        job.title,
        undefined, // relatedThumbnail
        '当前用户', // participant1Name
        undefined, // participant1Avatar
        job.employerName, // participant2Name
        job.employerAvatar // participant2Avatar
      );

      navigation.navigate('Chat', {
        conversationId: conversation.id,
        expertName: job.employerName,
        expertAvatar: job.employerAvatar,
        expertId: job.employerId,
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
      const currentUserId = 'current-user-id';
      const conversation = await createConversation(
        currentUserId,
        job.employerId,
        ConversationRelatedType.JOB,
        job.id,
        job.title,
        undefined, // relatedThumbnail
        '当前用户', // participant1Name
        undefined, // participant1Avatar
        job.employerName, // participant2Name
        job.employerAvatar // participant2Avatar
      );

      setShowQuoteModal(false);

      navigation.navigate('Chat', {
        conversationId: conversation.id,
        expertName: job.employerName,
        expertAvatar: job.employerAvatar,
        expertId: job.employerId,
        pendingQuote: quoteData,
      });

      Alert.alert('成功', '请在聊天中查看您的报价');
    } catch (error) {
      console.error('发送报价失败:', error);
      Alert.alert('失败', '发送报价失败，请稍后重试');
    }
  };

  const handleApplicantPress = (expertId: string) => {
    navigation.navigate('ExpertDetail', { expertId });
  };

  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      // 生活服务类
      [ServiceType.HOUSEKEEPING]: '家政保洁',
      [ServiceType.REPAIR]: '维修安装',
      [ServiceType.MOVING]: '搬家运输',
      [ServiceType.DELIVERY]: '跑腿代购',
      [ServiceType.MEAL_PREP]: '做饭配餐',
      [ServiceType.PET_CARE]: '宠物照顾',
      [ServiceType.GARDENING]: '园艺绿化',
      // 陪护照料类
      [ServiceType.ESCORT]: '陪诊陪护',
      [ServiceType.CHILDCARE]: '儿童看护',
      [ServiceType.ELDERCARE]: '老人照料',
      [ServiceType.NURSING]: '专业护理',
      [ServiceType.COMPANION]: '陪伴聊天',
      // 技能服务类
      [ServiceType.TUTORING]: '家教辅导',
      [ServiceType.TRANSLATION]: '翻译服务',
      [ServiceType.PHOTOGRAPHY]: '摄影拍照',
      [ServiceType.MAKEUP]: '化妆造型',
      [ServiceType.DRIVING]: '代驾陪驾',
      [ServiceType.IT_SUPPORT]: '电脑维护',
      [ServiceType.PHONE_TEACH]: '手机教学',
      // 创意设计类
      [ServiceType.GRAPHIC_DESIGN]: '平面设计',
      [ServiceType.VIDEO_EDITING]: '视频剪辑',
      [ServiceType.WRITING]: '文案写作',
      [ServiceType.HANDICRAFT]: '手工制作',
      // 教学培训类
      [ServiceType.FITNESS]: '健身教练',
      [ServiceType.YOGA]: '瑜伽教学',
      [ServiceType.DANCE]: '舞蹈教学',
      [ServiceType.MUSIC]: '音乐教学',
      [ServiceType.PAINTING]: '绘画教学',
      [ServiceType.COOKING]: '烹饪教学',
      // 其他
      [ServiceType.MASSAGE]: '按摩理疗',
      [ServiceType.BEAUTY]: '美容美甲',
      [ServiceType.OTHER]: '其他服务',
    };
    return labels[type] || '其他服务';
  };

  const getServiceTypeEmoji = (type: ServiceType): string => {
    const emojis: { [key in ServiceType]: string } = {
      // 生活服务类
      [ServiceType.HOUSEKEEPING]: '🧹',
      [ServiceType.REPAIR]: '🔧',
      [ServiceType.MOVING]: '🚚',
      [ServiceType.DELIVERY]: '🛒',
      [ServiceType.MEAL_PREP]: '🍱',
      [ServiceType.PET_CARE]: '🐕',
      [ServiceType.GARDENING]: '🌱',
      // 陪护照料类
      [ServiceType.ESCORT]: '🏥',
      [ServiceType.CHILDCARE]: '👶',
      [ServiceType.ELDERCARE]: '👴',
      [ServiceType.NURSING]: '👩‍⚕️',
      [ServiceType.COMPANION]: '💬',
      // 技能服务类
      [ServiceType.TUTORING]: '📚',
      [ServiceType.TRANSLATION]: '🌐',
      [ServiceType.PHOTOGRAPHY]: '📷',
      [ServiceType.MAKEUP]: '💄',
      [ServiceType.DRIVING]: '🚗',
      [ServiceType.IT_SUPPORT]: '💻',
      [ServiceType.PHONE_TEACH]: '📱',
      // 创意设计类
      [ServiceType.GRAPHIC_DESIGN]: '🎨',
      [ServiceType.VIDEO_EDITING]: '🎬',
      [ServiceType.WRITING]: '✍️',
      [ServiceType.HANDICRAFT]: '🧶',
      // 教学培训类
      [ServiceType.FITNESS]: '💪',
      [ServiceType.YOGA]: '🧘',
      [ServiceType.DANCE]: '💃',
      [ServiceType.MUSIC]: '🎵',
      [ServiceType.PAINTING]: '🖼️',
      [ServiceType.COOKING]: '👨‍🍳',
      // 其他
      [ServiceType.MASSAGE]: '💆',
      [ServiceType.BEAUTY]: '💅',
      [ServiceType.OTHER]: '📋',
    };
    return emojis[type] || '📋';
  };

  // 判断是否是自己的需求
  const isOwnJob = job?.employerId === 'user_current';

  if (loading || !job) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$color10">
          加载中...
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* 标题栏 */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="需求详情" />
      </View>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* 服务类型头部 */}
          <View
            marginHorizontal="$2.5"
            marginTop="$2"
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack gap="$2" alignItems="center" marginBottom="$2">
              <View
                width={56}
                height={56}
                borderRadius={28}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={32}>{getServiceTypeEmoji(job.serviceType)}</Text>
              </View>
              <YStack flex={1}>
                <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                  {getServiceTypeLabel(job.serviceType)}
                </Text>
                <Text fontSize="$5" fontWeight="700" color="$color12" numberOfLines={2}>
                  {job.title}
                </Text>
              </YStack>
            </XStack>

            {/* 标签 */}
            <XStack flexWrap="wrap" gap="$1.5">
              {job.isUrgent && (
                <View
                  backgroundColor={errorColor}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <XStack gap="$1" alignItems="center">
                    <AlertCircle size={10} color="white" />
                    <Text fontSize={10} color="white" fontWeight="500">
                      紧急
                    </Text>
                  </XStack>
                </View>
              )}

              {job.isHighReward && (
                <View
                  backgroundColor={warningColor}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <Text fontSize={10} color="white" fontWeight="500">
                    💰 高佣金
                  </Text>
                </View>
              )}

              {job.healthTags && job.healthTags.length > 0 && (
                <View
                  backgroundColor={`${primaryColor}15`}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <Text fontSize={10} color={primaryColor} fontWeight="500">
                    🏥 {job.healthTags.join('、')}
                  </Text>
                </View>
              )}
            </XStack>
          </View>

          {/* 预算卡片 */}
          <View
            marginHorizontal="$2.5"
            marginTop="$2"
            padding="$2"
            backgroundColor={`${successColor}15`}
            borderRadius="$5"
            borderWidth={1}
            borderColor={successColor}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1}>
                <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                  服务预算
                </Text>
                <XStack gap="$1" alignItems="baseline">
                  <Text fontSize="$7" color={successColor} fontWeight="700">
                    {job.budget.currency}{job.budget.min}
                  </Text>
                  <Text fontSize="$4" color={successColor}>
                    - {job.budget.currency}{job.budget.max}
                  </Text>
                </XStack>
              </YStack>
              <DollarSign size={40} color={successColor} opacity={0.3} />
            </XStack>
          </View>

          {/* 雇主信息卡片 */}
          <View
            marginHorizontal="$2.5"
            marginTop="$2"
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              雇主信息
            </Text>
            <XStack gap="$2" alignItems="center">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={24}>{job.employerAvatar || '👤'}</Text>
              </View>
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {job.employerName}
                </Text>
                <Text fontSize="$2" color="$color10">
                  发布于 {job.publishTime}
                </Text>
              </YStack>
              <Pressable onPress={handleConsult}>
                <View
                  backgroundColor={primaryColor}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$10"
                >
                  <XStack gap="$1" alignItems="center">
                    <MessageCircle size={14} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="500">
                      咨询
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </View>

          {/* 服务详情 */}
          <View
            marginHorizontal="$2.5"
            marginTop="$2"
            padding="$2"
            backgroundColor="$color2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              服务详情
            </Text>

            <YStack gap="$2">
              {/* 描述 */}
              <Text fontSize="$3" color="$color12" lineHeight={22}>
                {job.description}
              </Text>

              {/* 位置 */}
              <XStack gap="$2" alignItems="flex-start">
                <MapPin size={16} color={color10} style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                    服务地点
                  </Text>
                  <Text fontSize="$3" color="$color12">
                    {job.location.address}
                  </Text>
                </YStack>
              </XStack>

              {/* 时间 */}
              <XStack gap="$2" alignItems="flex-start">
                <Clock size={16} color={color10} style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize="$2" color="$color10" marginBottom="$0.5">
                    服务时间
                  </Text>
                  <Text fontSize="$3" color="$color12">
                    {job.serviceTime}
                  </Text>
                  <Text fontSize="$2" color="$color10" marginTop="$0.5">
                    预计时长：{job.duration}
                  </Text>
                </YStack>
              </XStack>

              {/* 要求 */}
              {job.requirements && job.requirements.length > 0 && (
                <View>
                  <Text fontSize="$2" color="$color10" marginBottom="$1.5">
                    特殊要求
                  </Text>
                  <XStack flexWrap="wrap" gap="$1.5">
                    {job.requirements.map((req, index) => (
                      <View
                        key={index}
                        backgroundColor={`${primaryColor}15`}
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$10"
                      >
                        <Text fontSize={10} color={primaryColor} fontWeight="500">
                          {req}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}
            </YStack>
          </View>

          {/* 健康档案关联 */}
          {relatedMemberInfo && (
            <View
              marginHorizontal="$2.5"
              marginTop="$2"
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$2">
                <Shield size={16} color={primaryColor} />
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  服务对象健康档案
                </Text>
                <View
                  backgroundColor={`${primaryColor}15`}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$10"
                >
                  <Text fontSize={10} color={primaryColor} fontWeight="500">
                    脱敏展示
                  </Text>
                </View>
              </XStack>

              <View
                backgroundColor="$color4"
                padding="$2"
                borderRadius="$4"
                marginBottom="$2"
              >
                <XStack gap="$2" alignItems="flex-start">
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={`${primaryColor}15`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={20}>
                      {relatedMemberInfo.member.avatar || '👤'}
                    </Text>
                  </View>

                  <YStack flex={1} gap="$1">
                    <XStack gap="$1.5" alignItems="center">
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {relatedMemberInfo.member.name}
                      </Text>
                      <View
                        backgroundColor="$color2"
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$10"
                        borderWidth={1}
                        borderColor="$color5"
                      >
                        <Text fontSize={10} color="$color10">
                          {relatedMemberInfo.member.relationship}
                        </Text>
                      </View>
                    </XStack>

                    <XStack gap="$2" alignItems="center">
                      <Text fontSize="$2" color="$color10">
                        {relatedMemberInfo.member.healthProfile.age}岁
                      </Text>
                      <XStack gap="$1" alignItems="center">
                        <Activity
                          size={12}
                          color={
                            relatedMemberInfo.member.healthProfile.healthStatus === 'excellent'
                              ? successColor
                              : relatedMemberInfo.member.healthProfile.healthStatus === 'good'
                              ? primaryColor
                              : warningColor
                          }
                        />
                        <Text
                          fontSize="$2"
                          fontWeight="500"
                          color={
                            relatedMemberInfo.member.healthProfile.healthStatus === 'excellent'
                              ? successColor
                              : relatedMemberInfo.member.healthProfile.healthStatus === 'good'
                              ? primaryColor
                              : warningColor
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

                    <Text fontSize="$2" color="$color12">
                      健康评分：{relatedMemberInfo.member.healthProfile.healthScore} 分
                    </Text>
                  </YStack>
                </XStack>
              </View>

              {/* 健康标签 */}
              {job.healthTags && job.healthTags.length > 0 && (
                <View>
                  <Text fontSize="$2" color="$color10" marginBottom="$1.5">
                    健康提示
                  </Text>
                  <XStack flexWrap="wrap" gap="$1.5">
                    {job.healthTags.map((tag, index) => (
                      <View
                        key={index}
                        backgroundColor={`${warningColor}15`}
                        paddingHorizontal="$2"
                        paddingVertical="$0.5"
                        borderRadius="$10"
                        borderWidth={1}
                        borderColor={warningColor}
                      >
                        <Text fontSize={10} color={warningColor} fontWeight="500">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}

              {/* 提示信息 */}
              <View
                backgroundColor={`${primaryColor}10`}
                padding="$2"
                borderRadius="$4"
                marginTop="$2"
              >
                <Text fontSize="$2" color="$color10" lineHeight={18}>
                  ℹ️ 健康档案已脱敏处理，仅展示必要信息。达人接单后可查看更详细的健康数据以提供更专业的服务。
                </Text>
              </View>
            </View>
          )}

          {/* 已报名达人 */}
          {applicants.length > 0 && (
            <View
              marginHorizontal="$2.5"
              marginTop="$2"
              padding="$2"
              backgroundColor="$color2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              overflow="hidden"
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                <XStack gap="$1.5" alignItems="center">
                  <Users size={16} color={primaryColor} />
                  <Text fontSize="$4" fontWeight="600" color="$color12">
                    已有 {applicants.length} 位达人报名
                  </Text>
                </XStack>
              </XStack>

              {/* 达人列表容器 */}
              <View position="relative">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2">
                    {applicants.map(expert => (
                      <Pressable
                        key={expert.id}
                        onPress={() => handleApplicantPress(expert.id)}
                      >
                        <YStack alignItems="center" width={72}>
                          <View
                            width={48}
                            height={48}
                            borderRadius={24}
                            backgroundColor={`${primaryColor}15`}
                            justifyContent="center"
                            alignItems="center"
                            marginBottom="$1"
                          >
                            <Text fontSize={24}>{expert.avatar || '👤'}</Text>
                          </View>
                          <Text
                            fontSize="$2"
                            color="$color12"
                            fontWeight="500"
                            textAlign="center"
                            numberOfLines={1}
                          >
                            {expert.name}
                          </Text>
                          <Text fontSize={10} color={primaryColor} marginTop="$0.5">
                            ⭐ {expert.rating.toFixed(1)}
                          </Text>
                        </YStack>
                      </Pressable>
                    ))}
                  </XStack>
                </ScrollView>

                {/* 毛玻璃装饰效果 */}
                <View
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  overflow="hidden"
                  borderRadius="$3"
                  pointerEvents="none"
                >
                  {Platform.OS === 'web' ? (
                    <View
                      flex={1}
                      style={{
                        // @ts-ignore - Web-specific CSS
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      }}
                    />
                  ) : (
                    <BlurView
                      intensity={30}
                      tint="light"
                      style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
                    />
                  )}
                </View>
              </View>
            </View>
          )}

          {/* 底部占位 - 非自己的需求时显示按钮需要占位 */}
          {!isOwnJob && <View height={100} />}
        </ScrollView>

        {/* 底部操作栏 - 只有非自己的需求才显示 */}
        {!isOwnJob && (
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="$color2"
            paddingHorizontal="$2.5"
            paddingTop="$2"
            paddingBottom={insets.bottom + 16}
            borderTopWidth={1}
            borderTopColor="$color5"
          >
            <XStack gap="$2">
              <Pressable style={{ flex: 1 }} onPress={handleConsult}>
                <View
                  flex={1}
                  backgroundColor="$color2"
                  borderRadius="$10"
                  paddingVertical="$2"
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={1.5}
                  borderColor={primaryColor}
                >
                  <XStack gap="$1.5" alignItems="center">
                    <MessageCircle size={18} color={primaryColor} />
                    <Text fontSize="$3" color={primaryColor} fontWeight="500">
                      咨询雇主
                    </Text>
                  </XStack>
                </View>
              </Pressable>

              <Pressable style={{ flex: 1 }} onPress={handleApply}>
                <View
                  flex={1}
                  backgroundColor={primaryColor}
                  borderRadius="$10"
                  paddingVertical="$2"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$3" color="white" fontWeight="500">
                    报名接单
                  </Text>
                </View>
              </Pressable>
            </XStack>
          </View>
        )}

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
    </View>
  );
};
