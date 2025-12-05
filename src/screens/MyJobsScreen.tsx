/**
 * MyJobsScreen 我的需求页面
 * 显示用户发布的需求和正在沟通的需求
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  MessageCircle,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ServiceJob, ServiceType, JobStatus } from '@/types/community';
import { getJobs, deleteJob } from '@/services/communityDataService';
import { ConfirmModal } from '@/components/ConfirmModal';

interface MyJobsScreenProps {
  navigation: any;
}

type TabType = 'published' | 'communicating';

/**
 * 我的需求页面
 */
export const MyJobsScreen: React.FC<MyJobsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [activeTab, setActiveTab] = useState<TabType>('published');
  const [publishedJobs, setPublishedJobs] = useState<ServiceJob[]>([]);
  const [communicatingJobs, setCommunicatingJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 删除确认弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 页面聚焦时加载数据
  useFocusEffect(
    useCallback(() => {
      loadMyJobs();
    }, [])
  );

  const loadMyJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await getJobs({});

      // 筛选我发布的需求（employerId 为 'user_current'）
      const myPublished = allJobs.filter(job => job.employerId === 'user_current');
      setPublishedJobs(myPublished);

      // 筛选正在沟通的需求（有申请人的需求）
      const myCommunicating = allJobs.filter(
        job => job.employerId === 'user_current' && job.applicants > 0
      );
      setCommunicatingJobs(myCommunicating);
    } catch (error) {
      console.error('加载我的需求失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMyJobs();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  // 打开删除确认弹窗
  const handleOpenDeleteModal = (jobId: string, jobTitle: string) => {
    setDeleteTarget({ id: jobId, title: jobTitle });
    setShowDeleteModal(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteJob(deleteTarget.id);
      await loadMyJobs();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('删除需求失败:', error);
    } finally {
      setDeleting(false);
    }
  };

  // 关闭删除弹窗
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const currentJobs = activeTab === 'published' ? publishedJobs : communicatingJobs;

  // 获取服务类型的显示文本
  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '陪诊',
      [ServiceType.ACCOMPANY_CHAT]: '陪聊',
      [ServiceType.ACCOMPANY_CARE]: '照护',
      [ServiceType.MASSAGE]: '按摩',
      [ServiceType.REHABILITATION]: '康复',
      [ServiceType.HEALTH_CONSULT]: '健康咨询',
      [ServiceType.NURSING]: '护理',
      [ServiceType.MEAL_PREP]: '配餐',
      [ServiceType.HOUSEKEEPING]: '家政',
      [ServiceType.REPAIR]: '维修',
      [ServiceType.SHOPPING]: '代购',
      [ServiceType.TAICHI]: '太极',
      [ServiceType.DANCE]: '广场舞',
      [ServiceType.PHONE_TEACH]: '手机教学',
      [ServiceType.MUSIC]: '音乐',
      [ServiceType.OTHER]: '其他',
    };
    return labels[type] || '其他';
  };

  // 获取服务类型的emoji图标
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

  // 渲染带删除按钮的 Job Card
  const renderJobCard = (job: ServiceJob) => (
    <View
      key={job.id}
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.08}
      elevation={2}
      borderWidth={1}
      borderColor={job.isUrgent ? errorColor : '$color5'}
      borderLeftWidth={job.isUrgent ? 3 : 1}
      borderLeftColor={job.isUrgent ? errorColor : '$color5'}
    >
      {/* 顶部：标签区 + 删除按钮 */}
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
        <XStack flexWrap="wrap" gap="$1.5" flex={1}>
          {/* 服务类型标签 */}
          <View
            backgroundColor={primaryColor}
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <XStack gap="$1" alignItems="center">
              <Text fontSize={12}>{getServiceTypeEmoji(job.serviceType)}</Text>
              <Text fontSize={10} color="white" fontWeight="500">
                {getServiceTypeLabel(job.serviceType)}
              </Text>
            </XStack>
          </View>

          {/* 紧急标签 */}
          {job.isUrgent && (
            <View
              backgroundColor={errorColor}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <XStack gap="$0.5" alignItems="center">
                <AlertCircle size={10} color="white" />
                <Text fontSize={10} color="white" fontWeight="500">
                  紧急
                </Text>
              </XStack>
            </View>
          )}

          {/* 高佣金标签 */}
          {job.isHighReward && (
            <View
              backgroundColor={warningColor}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color="white" fontWeight="500">
                高佣金
              </Text>
            </View>
          )}
        </XStack>

        {/* 删除按钮 */}
        <Pressable onPress={() => handleOpenDeleteModal(job.id, job.title)}>
          <View
            backgroundColor="$color4"
            width={32}
            height={32}
            borderRadius={16}
            justifyContent="center"
            alignItems="center"
          >
            <Trash2 size={16} color={errorColor} />
          </View>
        </Pressable>
      </XStack>

      {/* 可点击区域 */}
      <Pressable onPress={() => handleJobPress(job.id)}>
        {/* 标题 */}
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5" numberOfLines={2}>
          {job.title}
        </Text>

        {/* 描述 */}
        <Text fontSize="$3" color="$color10" marginBottom="$2" numberOfLines={2} lineHeight={20}>
          {job.description}
        </Text>

        {/* 信息栏 */}
        <YStack gap="$1.5" marginBottom="$2">
          {/* 位置 */}
          <XStack gap="$1.5" alignItems="center">
            <MapPin size={14} color={color10} />
            <Text fontSize="$2" color="$color10" numberOfLines={1} flex={1}>
              {job.location.district} · {job.location.address}
            </Text>
          </XStack>

          {/* 时间 */}
          <XStack gap="$1.5" alignItems="center">
            <Clock size={14} color={color10} />
            <Text fontSize="$2" color="$color10">
              {job.serviceTime} · {job.duration}
            </Text>
          </XStack>

          {/* 预算 */}
          <XStack gap="$1.5" alignItems="center">
            <DollarSign size={14} color={successColor} />
            <Text fontSize="$3" color={successColor} fontWeight="600">
              {job.budget.currency}{job.budget.min}-{job.budget.max}
            </Text>
          </XStack>
        </YStack>

        {/* 底部统计信息 */}
        <XStack justifyContent="space-between" alignItems="center">
          {/* 状态 */}
          <View
            backgroundColor="$color4"
            paddingHorizontal="$2"
            paddingVertical="$0.5"
            borderRadius="$10"
          >
            <Text fontSize={10} color="$color10" fontWeight="500">
              {job.status === JobStatus.PUBLISHED ? '已发布' :
               job.status === JobStatus.IN_PROGRESS ? '进行中' :
               job.status === JobStatus.COMPLETED ? '已完成' : '已取消'}
            </Text>
          </View>

          {/* 报名人数 */}
          <XStack gap="$1.5" alignItems="center">
            <Users size={12} color={color10} />
            <Text fontSize="$2" color="$color10">
              {job.applicants}人报名
            </Text>
            <Text fontSize="$2" color="$color10">
              · {job.publishTime}
            </Text>
          </XStack>
        </XStack>
      </Pressable>
    </View>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <Text fontSize={48} marginBottom="$2">
          {activeTab === 'published' ? '📝' : '💬'}
        </Text>
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          {activeTab === 'published' ? '暂无发布的需求' : '暂无正在沟通的需求'}
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {activeTab === 'published'
            ? '去发布一个服务需求吧'
            : '发布需求后，达人会来报名'}
        </Text>
        {activeTab === 'published' && (
          <Pressable onPress={() => navigation.navigate('JobPublish' as never)}>
            <View
              marginTop="$2"
              backgroundColor={primaryColor}
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius="$10"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                发布需求
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 标准 TitleBar */}
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
          justifyContent="space-between"
        >
          <Pressable onPress={handleBack}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            我的需求
          </Text>
          <View width={40} />
        </XStack>
      </View>

      {/* Tab 切换 */}
      <View backgroundColor="$color2" paddingHorizontal="$2.5" paddingBottom="$2">
        <View
          backgroundColor="$color4"
          borderRadius="$10"
          padding="$0.5"
        >
          <XStack>
            <Pressable onPress={() => setActiveTab('published')} style={{ flex: 1 }}>
              <View
                backgroundColor={activeTab === 'published' ? '$color2' : 'transparent'}
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <XStack gap="$1.5" alignItems="center">
                  <FileText size={16} color={activeTab === 'published' ? primaryColor : color10} />
                  <Text
                    fontSize="$3"
                    fontWeight={activeTab === 'published' ? '600' : '400'}
                    color={activeTab === 'published' ? primaryColor : '$color10'}
                  >
                    我发布的 ({publishedJobs.length})
                  </Text>
                </XStack>
              </View>
            </Pressable>
            <Pressable onPress={() => setActiveTab('communicating')} style={{ flex: 1 }}>
              <View
                backgroundColor={activeTab === 'communicating' ? '$color2' : 'transparent'}
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <XStack gap="$1.5" alignItems="center">
                  <MessageCircle size={16} color={activeTab === 'communicating' ? primaryColor : color10} />
                  <Text
                    fontSize="$3"
                    fontWeight={activeTab === 'communicating' ? '600' : '400'}
                    color={activeTab === 'communicating' ? primaryColor : '$color10'}
                  >
                    沟通中 ({communicatingJobs.length})
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </View>
      </View>

      {/* 需求列表 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ padding: 10 }}
      >
        {currentJobs.length === 0 ? (
          renderEmpty()
        ) : (
          <YStack gap="$2">
            {currentJobs.map(job => renderJobCard(job))}
          </YStack>
        )}
      </ScrollView>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="删除需求"
        message={`确定要删除「${deleteTarget?.title || ''}」吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        type="danger"
        loading={deleting}
      />
    </View>
  );
};
