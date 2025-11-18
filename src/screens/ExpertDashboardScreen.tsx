import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  H3,
} from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Switch,
} from 'react-native';
import {
  ArrowLeft,
  DollarSign,
  Briefcase,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ServiceJob, JobType, JobStatus } from '@/types/community';
import { getJobs } from '@/services/communityDataService';
import { JobCard } from '@/components/JobCard';

interface ExpertDashboardScreenProps {
  navigation: any;
}

/**
 * 达人工作台
 * 展示接单统计、待接单需求、进行中订单等
 */
export const ExpertDashboardScreen: React.FC<ExpertDashboardScreenProps> = ({
  navigation,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 3,
    monthOrders: 28,
    totalOrders: 156,
    todayIncome: 450,
    monthIncome: 12500,
    totalIncome: 78600,
  });
  const [pendingJobs, setPendingJobs] = useState<ServiceJob[]>([]);
  const [activeOrders, setActiveOrders] = useState<number>(5);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 加载待接单需求（已发布的需求）
      const jobs = await getJobs({
        status: JobStatus.PUBLISHED,
      });

      // 模拟筛选：只显示匹配达人服务类型的需求
      const matchedJobs = jobs.slice(0, 10);
      setPendingJobs(matchedJobs);
    } catch (error) {
      console.error('加载工作台数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    // TODO: 调用 updateExpertStatus() 更新在线状态
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      <View
        backgroundColor="white"
        paddingTop="$3"
        paddingHorizontal="$4"
        paddingBottom="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={handleBack}>
            <View
              width={32}
              height={32}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={COLORS.text} />
            </View>
          </TouchableOpacity>

          <Text fontSize="$5" fontWeight="600" color="$text">
            达人工作台
          </Text>

          {/* 在线状态开关 */}
          <XStack space="$2" alignItems="center">
            <Text fontSize="$3" color={isOnline ? COLORS.success : '$textSecondary'}>
              {isOnline ? '在线' : '离线'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: COLORS.textSecondary, true: COLORS.success }}
              thumbColor={isOnline ? 'white' : COLORS.background}
            />
          </XStack>
        </XStack>
      </View>

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View padding="$4">
          {/* 今日统计 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              今日接单
            </H3>

            <XStack space="$3">
              <YStack
                flex={1}
                backgroundColor={`${COLORS.primary}10`}
                padding="$3"
                borderRadius="$3"
                alignItems="center"
              >
                <Briefcase size={24} color={COLORS.primary} />
                <Text fontSize="$7" fontWeight="bold" color={COLORS.primary} marginTop="$2">
                  {stats.todayOrders}
                </Text>
                <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                  订单数
                </Text>
              </YStack>

              <YStack
                flex={1}
                backgroundColor={`${COLORS.success}10`}
                padding="$3"
                borderRadius="$3"
                alignItems="center"
              >
                <DollarSign size={24} color={COLORS.success} />
                <Text fontSize="$7" fontWeight="bold" color={COLORS.success} marginTop="$2">
                  ¥{stats.todayIncome}
                </Text>
                <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                  收入
                </Text>
              </YStack>
            </XStack>
          </Card>

          {/* 总体统计 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              累计数据
            </H3>

            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2" alignItems="center">
                  <View
                    width={36}
                    height={36}
                    borderRadius={18}
                    backgroundColor={`${COLORS.primary}20`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Briefcase size={18} color={COLORS.primary} />
                  </View>
                  <YStack>
                    <Text fontSize="$3" color="$textSecondary">
                      本月订单
                    </Text>
                    <Text fontSize="$5" fontWeight="600" color="$text">
                      {stats.monthOrders}单
                    </Text>
                  </YStack>
                </XStack>
                <YStack alignItems="flex-end">
                  <Text fontSize="$3" color="$textSecondary">
                    累计订单
                  </Text>
                  <Text fontSize="$5" fontWeight="600" color="$text">
                    {stats.totalOrders}单
                  </Text>
                </YStack>
              </XStack>

              <View height={1} backgroundColor="$borderColor" />

              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2" alignItems="center">
                  <View
                    width={36}
                    height={36}
                    borderRadius={18}
                    backgroundColor={`${COLORS.success}20`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <DollarSign size={18} color={COLORS.success} />
                  </View>
                  <YStack>
                    <Text fontSize="$3" color="$textSecondary">
                      本月收入
                    </Text>
                    <Text fontSize="$5" fontWeight="600" color={COLORS.success}>
                      ¥{stats.monthIncome}
                    </Text>
                  </YStack>
                </XStack>
                <YStack alignItems="flex-end">
                  <Text fontSize="$3" color="$textSecondary">
                    累计收入
                  </Text>
                  <Text fontSize="$5" fontWeight="600" color={COLORS.success}>
                    ¥{stats.totalIncome}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>

          {/* 进行中订单 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <H3 fontSize="$5" color="$text" fontWeight="600">
                进行中订单
              </H3>
              <TouchableOpacity onPress={() => console.log('查看全部订单')}>
                <Text fontSize="$3" color={COLORS.primary}>
                  查看全部 →
                </Text>
              </TouchableOpacity>
            </XStack>

            {activeOrders > 0 ? (
              <XStack space="$3">
                <YStack
                  flex={1}
                  backgroundColor={`${COLORS.warning}10`}
                  padding="$3"
                  borderRadius="$3"
                  alignItems="center"
                >
                  <Clock size={24} color={COLORS.warning} />
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.warning} marginTop="$2">
                    {activeOrders}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    待完成
                  </Text>
                </YStack>

                <YStack
                  flex={1}
                  backgroundColor={`${COLORS.error}10`}
                  padding="$3"
                  borderRadius="$3"
                  alignItems="center"
                >
                  <AlertCircle size={24} color={COLORS.error} />
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.error} marginTop="$2">
                    2
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    需注意
                  </Text>
                </YStack>

                <YStack
                  flex={1}
                  backgroundColor={`${COLORS.success}10`}
                  padding="$3"
                  borderRadius="$3"
                  alignItems="center"
                >
                  <CheckCircle size={24} color={COLORS.success} />
                  <Text fontSize="$6" fontWeight="bold" color={COLORS.success} marginTop="$2">
                    28
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                    本月完成
                  </Text>
                </YStack>
              </XStack>
            ) : (
              <YStack alignItems="center" paddingVertical="$4">
                <Text fontSize={48}>📋</Text>
                <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                  暂无进行中的订单
                </Text>
              </YStack>
            )}
          </Card>

          {/* 待接单需求 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <H3 fontSize="$5" color="$text" fontWeight="600">
                推荐需求（为你精选）
              </H3>
              <TouchableOpacity onPress={() => navigation.navigate('JobList')}>
                <Text fontSize="$3" color={COLORS.primary}>
                  查看更多 →
                </Text>
              </TouchableOpacity>
            </XStack>

            {loading ? (
              <YStack alignItems="center" paddingVertical="$4">
                <Text fontSize="$4" color="$textSecondary">
                  加载中...
                </Text>
              </YStack>
            ) : pendingJobs.length === 0 ? (
              <YStack alignItems="center" paddingVertical="$4">
                <Text fontSize={48}>🤝</Text>
                <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                  暂无匹配的需求
                </Text>
                <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                  完善你的服务类型可以接到更多单
                </Text>
              </YStack>
            ) : (
              <YStack space="$3">
                {pendingJobs.slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} onPress={handleJobPress} />
                ))}
              </YStack>
            )}
          </Card>

          {/* 底部padding */}
          <View height={20} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
