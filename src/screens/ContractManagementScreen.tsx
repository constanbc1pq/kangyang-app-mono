/**
 * Contract Management Screen
 * 合约与权益管理页面
 *
 * 功能：
 * - 查看服务权益详情
 * - 管理签约合约
 * - 续约服务
 * - 取消签约
 */

import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H4,
  Theme,
  ScrollView,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastController } from '@tamagui/toast';
import {
  Pressable,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  DoctorSubscription,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { useFocusEffect } from '@react-navigation/native';

interface ContractManagementScreenProps {
  navigation: any;
  route: {
    params: {
      subscriptionId: string;
    };
  };
}

export const ContractManagementScreen: React.FC<ContractManagementScreenProps> = ({
  navigation,
  route,
}) => {
  const toast = useToastController();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscription, setSubscription] = useState<DoctorSubscription | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadContract();
    }, [])
  );

  const loadContract = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const userId = 'user_001';
      const subscriptionData = await privateDoctorService.getMySubscription(userId);
      setSubscription(subscriptionData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadContract(true);
  };

  const handleRenewSubscription = async () => {
    if (!subscription) return;

    try {
      const success = await privateDoctorService.renewSubscription(
        subscription.id,
        {
          amount: 39800,
          method: 'WeChat',
          transactionId: `renew_${Date.now()}`,
        }
      );

      if (success) {
        setShowRenewDialog(false);
        toast.show('续订成功', {
          message: '服务已延长一年',
        });
        loadContract(true);
      } else {
        toast.show('续订失败', {
          message: '请稍后重试',
        });
      }
    } catch (error) {
      console.error('续订失败:', error);
      toast.show('续订失败', {
        message: '请稍后重试',
      });
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      const success = await privateDoctorService.cancelSubscription(subscription.id);

      if (success) {
        setShowCancelDialog(false);
        toast.show('签约已取消', {
          message: '感谢您的使用',
        });
        navigation.goBack();
      } else {
        toast.show('取消失败', {
          message: '请联系客服',
        });
      }
    } catch (error) {
      console.error('取消签约失败:', error);
      toast.show('取消失败', {
        message: '请稍后重试',
      });
    }
  };

  const getRemainingDays = (): number => {
    if (!subscription) return 0;
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatServiceCount = (remaining: number, total: number): string => {
    if (total === -1) return '无限次';
    return `${remaining}/${total}次`;
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

  if (!subscription) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
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
              合约与权益
            </Text>
            <View width={24} />
          </XStack>

          <View flex={1} justifyContent="center" alignItems="center" padding="$4">
            <AlertCircle size={48} color={COLORS.textSecondary} />
            <Text fontSize="$4" color="$textSecondary" marginTop="$3">
              未找到签约信息
            </Text>
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
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Pressable>
          <Text fontSize="$5" color="$text" fontWeight="600" flex={1} textAlign="center">
            合约与权益
          </Text>
          <View width={24} />
        </XStack>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <YStack padding="$4" space="$4">
            {/* 服务权益概览 */}
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
                <H4 fontSize="$5" fontWeight="700" color="$text">
                  我的权益
                </H4>

                <View
                  backgroundColor="$surface"
                  padding="$3"
                  borderRadius="$3"
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$3" color="$textSecondary">
                      在线咨询
                    </Text>
                    <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
                      {formatServiceCount(
                        subscription.remainingServices.onlineConsultations,
                        -1
                      )}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$3" color="$textSecondary">
                      视频咨询
                    </Text>
                    <Text fontSize="$4" fontWeight="700" color={COLORS.success}>
                      {formatServiceCount(
                        subscription.remainingServices.videoConsults,
                        -1
                      )}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$3" color="$textSecondary">
                      电话咨询
                    </Text>
                    <Text fontSize="$4" fontWeight="700" color={COLORS.warning}>
                      {formatServiceCount(
                        subscription.remainingServices.phoneConsults,
                        -1
                      )}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text fontSize="$3" color="$textSecondary">
                      线下面诊
                    </Text>
                    <Text fontSize="$4" fontWeight="700" color={COLORS.warning}>
                      {formatServiceCount(
                        subscription.remainingServices.inPersonVisits,
                        -1
                      )}
                    </Text>
                  </XStack>
                  <View height={1} backgroundColor="$borderColor" marginVertical="$2" />
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$textSecondary">
                      有效期至
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {new Date(subscription.endDate).toLocaleDateString('zh-CN')}
                    </Text>
                  </XStack>
                </View>
              </YStack>
            </Card>

            {/* 合约管理 */}
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
                <H4 fontSize="$5" fontWeight="700" color="$text">
                  合约管理
                </H4>

                {/* 合约状态概览 */}
                <View
                  backgroundColor="$surface"
                  padding="$3"
                  borderRadius="$3"
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$3" color="$textSecondary">
                      合约状态
                    </Text>
                    <View
                      backgroundColor={
                        subscription.status === 'active'
                          ? `${COLORS.success}15`
                          : `${COLORS.error}15`
                      }
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text
                        fontSize={11}
                        color={
                          subscription.status === 'active'
                            ? COLORS.success
                            : COLORS.error
                        }
                        fontWeight="600"
                      >
                        {subscription.status === 'active' ? '生效中' : '已取消'}
                      </Text>
                    </View>
                  </XStack>

                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$3" color="$textSecondary">
                      签约日期
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {new Date(subscription.startDate).toLocaleDateString('zh-CN')}
                    </Text>
                  </XStack>

                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$3" color="$textSecondary">
                      到期日期
                    </Text>
                    <Text fontSize="$3" fontWeight="600" color="$text">
                      {new Date(subscription.endDate).toLocaleDateString('zh-CN')}
                    </Text>
                  </XStack>

                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$3" color="$textSecondary">
                      剩余天数
                    </Text>
                    <Text
                      fontSize="$4"
                      fontWeight="700"
                      color={
                        getRemainingDays() < 30
                          ? COLORS.error
                          : getRemainingDays() < 90
                          ? COLORS.warning
                          : COLORS.success
                      }
                    >
                      {getRemainingDays()} 天
                    </Text>
                  </XStack>
                </View>

                {/* 续订提醒 */}
                {getRemainingDays() < 90 && subscription.status === 'active' && (
                  <View
                    backgroundColor={`${COLORS.warning}10`}
                    padding="$3"
                    borderRadius="$3"
                    borderLeftWidth={3}
                    borderLeftColor={COLORS.warning}
                  >
                    <Text fontSize="$3" fontWeight="600" color={COLORS.warning} marginBottom="$1">
                      ⏰ 续订提醒
                    </Text>
                    <Text fontSize="$2" color="$text">
                      您的服务将在 {getRemainingDays()} 天后到期，建议提前续订以确保服务不中断
                    </Text>
                  </View>
                )}

                {/* 操作按钮 */}
                {subscription.status === 'active' && (
                  <XStack space="$3">
                    <Pressable
                      onPress={() => setShowRenewDialog(true)}
                      style={{ flex: 1 }}
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        backgroundColor={COLORS.primary}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color="white" fontWeight="600">
                          立即续订
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={() => setShowCancelDialog(true)}
                      style={{ flex: 1 }}
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor={COLORS.error}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color={COLORS.error} fontWeight="600">
                          取消签约
                        </Text>
                      </View>
                    </Pressable>
                  </XStack>
                )}
              </YStack>
            </Card>
          </YStack>
        </ScrollView>

        {/* 续订确认对话框 */}
        <Modal
          visible={showRenewDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRenewDialog(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setShowRenewDialog(false)}
          >
            <Pressable
              style={{ width: '80%', maxWidth: 400 }}
              onPress={(e) => e.stopPropagation()}
            >
              <View
                backgroundColor="$background"
                borderRadius="$4"
                padding="$4"
              >
                <YStack space="$3">
                  <Text fontSize="$6" fontWeight="700" color="$text" textAlign="center">
                    确认续订
                  </Text>

                  <View backgroundColor="$surface" padding="$3" borderRadius="$3">
                    <YStack space="$2">
                      <XStack justifyContent="space-between">
                        <Text fontSize="$3" color="$textSecondary">
                          续订时长
                        </Text>
                        <Text fontSize="$3" fontWeight="600" color="$text">
                          1年
                        </Text>
                      </XStack>
                      <XStack justifyContent="space-between">
                        <Text fontSize="$3" color="$textSecondary">
                          新到期日
                        </Text>
                        <Text fontSize="$3" fontWeight="600" color="$text">
                          {new Date(
                            new Date(subscription.endDate).setFullYear(
                              new Date(subscription.endDate).getFullYear() + 1
                            )
                          ).toLocaleDateString('zh-CN')}
                        </Text>
                      </XStack>
                      <View height={1} backgroundColor="$borderColor" marginVertical="$1" />
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" fontWeight="600" color="$text">
                          续订价格
                        </Text>
                        <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                          ¥398.00
                        </Text>
                      </XStack>
                    </YStack>
                  </View>

                  <Text fontSize="$2" color="$textSecondary" textAlign="center">
                    续订后服务将自动延长一年，所有权益将保持不变
                  </Text>

                  <XStack space="$3">
                    <Pressable
                      onPress={() => setShowRenewDialog(false)}
                      style={{ flex: 1 }}
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor="$borderColor"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color="$text" fontWeight="600">
                          取消
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={handleRenewSubscription}
                      style={{ flex: 1 }}
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        backgroundColor={COLORS.primary}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color="white" fontWeight="600">
                          确认续订
                        </Text>
                      </View>
                    </Pressable>
                  </XStack>
                </YStack>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* 取消签约确认对话框 */}
        <Modal
          visible={showCancelDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCancelDialog(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setShowCancelDialog(false)}
          >
            <Pressable
              style={{ width: '80%', maxWidth: 400 }}
              onPress={(e) => e.stopPropagation()}
            >
              <View
                backgroundColor="$background"
                borderRadius="$4"
                padding="$4"
              >
                <YStack space="$3">
                  <Text fontSize="$6" fontWeight="700" color={COLORS.error} textAlign="center">
                    取消签约
                  </Text>

                  <View
                    backgroundColor={`${COLORS.error}10`}
                    padding="$3"
                    borderRadius="$3"
                    borderLeftWidth={3}
                    borderLeftColor={COLORS.error}
                  >
                    <Text fontSize="$3" fontWeight="600" color={COLORS.error} marginBottom="$2">
                      ⚠️ 重要提示
                    </Text>
                    <Text fontSize="$2" color="$text" lineHeight={20}>
                      取消签约后：
                      {'\n'}• 将无法继续享受专属医生服务
                      {'\n'}• 所有剩余服务次数将失效
                      {'\n'}• 健康档案将保留但无法更新
                      {'\n'}• 此操作不可撤销
                    </Text>
                  </View>

                  <Text fontSize="$3" color="$textSecondary" textAlign="center">
                    您确定要取消签约吗？
                  </Text>

                  <XStack space="$3">
                    <Pressable
                      onPress={() => setShowCancelDialog(false)}
                      style={{ flex: 1 }}
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        backgroundColor={COLORS.primary}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color="white" fontWeight="600">
                          继续使用
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={handleCancelSubscription}
                      style={{ flex: 1 }}
                    >
                      <View
                        height={48}
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor={COLORS.error}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize="$4" color={COLORS.error} fontWeight="600">
                          确认取消
                        </Text>
                      </View>
                    </Pressable>
                  </XStack>
                </YStack>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </Theme>
  );
};

export default ContractManagementScreen;
