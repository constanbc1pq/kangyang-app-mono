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
  View,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastController } from '@tamagui/toast';
import {
  Pressable,
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import {
  DoctorSubscription,
} from '@/types/privateDoctor';
import { privateDoctorService } from '@/services/privateDoctorService';
import { useFocusEffect } from '@react-navigation/native';

const GOLD_COLOR = '#D4AF37';

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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const toast = useToastController();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

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
          amount: subscription.package.price || 49800,
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
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!subscription) {
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
            <Text fontSize="$5" fontWeight="600" color="$color12">合约与权益</Text>
            <View width={40} />
          </XStack>
        </View>

        <View flex={1} justifyContent="center" alignItems="center" padding="$2.5">
          <AlertCircle size={48} color={color10} />
          <Text fontSize="$4" color="$color10" marginTop="$2">
            未找到签约信息
          </Text>
        </View>
      </View>
    );
  }

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
          <Text fontSize="$5" fontWeight="600" color="$color12">合约与权益</Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <YStack padding="$2.5" gap="$3">
          {/* 服务权益概览 */}
          <View
            backgroundColor="$color2"
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                我的权益
              </Text>

              <View
                backgroundColor="$color4"
                padding="$2"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$3" color="$color10">
                    在线咨询
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color="$primary">
                    {formatServiceCount(
                      subscription.remainingServices.onlineConsultations,
                      -1
                    )}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$3" color="$color10">
                    视频咨询
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color="$success">
                    {formatServiceCount(
                      subscription.remainingServices.videoConsults,
                      -1
                    )}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$3" color="$color10">
                    电话咨询
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color="$warning">
                    {formatServiceCount(
                      subscription.remainingServices.phoneConsults,
                      -1
                    )}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$3" color="$color10">
                    线下面诊
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color="$warning">
                    {formatServiceCount(
                      subscription.remainingServices.inPersonVisits,
                      -1
                    )}
                  </Text>
                </XStack>
                <View height={1} backgroundColor="$color5" marginVertical="$1.5" />
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$color10">
                    有效期至
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {new Date(subscription.endDate).toLocaleDateString('zh-CN')}
                  </Text>
                </XStack>
              </View>
            </YStack>
          </View>

          {/* 合约管理 */}
          <View
            backgroundColor="$color2"
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
          >
            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                合约管理
              </Text>

              {/* 合约状态概览 */}
              <View
                backgroundColor="$color4"
                padding="$2"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
                  <Text fontSize="$3" color="$color10">
                    合约状态
                  </Text>
                  <View
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$2"
                    style={{
                      backgroundColor:
                        subscription.status === 'active'
                          ? `${successColor}15`
                          : `${errorColor}15`,
                    }}
                  >
                    <Text
                      fontSize={11}
                      color={
                        subscription.status === 'active'
                          ? '$success'
                          : '$error'
                      }
                      fontWeight="600"
                    >
                      {subscription.status === 'active' ? '生效中' : '已取消'}
                    </Text>
                  </View>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
                  <Text fontSize="$3" color="$color10">
                    签约日期
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {new Date(subscription.startDate).toLocaleDateString('zh-CN')}
                  </Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
                  <Text fontSize="$3" color="$color10">
                    到期日期
                  </Text>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {new Date(subscription.endDate).toLocaleDateString('zh-CN')}
                  </Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$color10">
                    剩余天数
                  </Text>
                  <Text
                    fontSize="$4"
                    fontWeight="700"
                    color={
                      getRemainingDays() < 30
                        ? '$error'
                        : getRemainingDays() < 90
                        ? '$warning'
                        : '$success'
                    }
                  >
                    {getRemainingDays()} 天
                  </Text>
                </XStack>
              </View>

              {/* 续订提醒 */}
              {getRemainingDays() < 90 && subscription.status === 'active' && (
                <View
                  padding="$2"
                  borderRadius="$4"
                  borderLeftWidth={3}
                  borderLeftColor="$warning"
                  style={{ backgroundColor: `${warningColor}10` }}
                >
                  <Text fontSize="$3" fontWeight="600" color="$warning" marginBottom="$1">
                    ⏰ 续订提醒
                  </Text>
                  <Text fontSize="$2" color="$color12">
                    您的服务将在 {getRemainingDays()} 天后到期，建议提前续订以确保服务不中断
                  </Text>
                </View>
              )}

              {/* 操作按钮 */}
              {subscription.status === 'active' && (
                <XStack gap="$2">
                  <Pressable
                    onPress={() => setShowRenewDialog(true)}
                    style={{ flex: 1 }}
                  >
                    <View
                      height={44}
                      borderRadius="$10"
                      backgroundColor="$primary"
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
                      height={44}
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor="$error"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="$error" fontWeight="600">
                        取消签约
                      </Text>
                    </View>
                  </Pressable>
                </XStack>
              )}
            </YStack>
          </View>

          {/* 底部占位 */}
          <View height={40} />
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
              backgroundColor="$color2"
              borderRadius="$5"
              padding="$2.5"
            >
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="700" color="$color12" textAlign="center">
                  确认续订
                </Text>

                <View backgroundColor="$color4" padding="$2" borderRadius="$4">
                  <YStack gap="$1.5">
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$color10">
                        续订时长
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        1年
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$color10">
                        新到期日
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color="$color12">
                        {new Date(
                          new Date(subscription.endDate).setFullYear(
                            new Date(subscription.endDate).getFullYear() + 1
                          )
                        ).toLocaleDateString('zh-CN')}
                      </Text>
                    </XStack>
                    <View height={1} backgroundColor="$color5" marginVertical="$1" />
                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        续订价格
                      </Text>
                      <Text fontSize="$5" fontWeight="700" color={GOLD_COLOR}>
                        ¥398.00
                      </Text>
                    </XStack>
                  </YStack>
                </View>

                <Text fontSize="$2" color="$color10" textAlign="center">
                  续订后服务将自动延长一年，所有权益将保持不变
                </Text>

                <XStack gap="$2">
                  <Pressable
                    onPress={() => setShowRenewDialog(false)}
                    style={{ flex: 1 }}
                  >
                    <View
                      height={44}
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor="$color5"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="$color12" fontWeight="600">
                        取消
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={handleRenewSubscription}
                    style={{ flex: 1 }}
                  >
                    <View
                      height={44}
                      borderRadius="$10"
                      backgroundColor="$primary"
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
              backgroundColor="$color2"
              borderRadius="$5"
              padding="$2.5"
            >
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="700" color="$error" textAlign="center">
                  取消签约
                </Text>

                <View
                  padding="$2"
                  borderRadius="$4"
                  borderLeftWidth={3}
                  borderLeftColor="$error"
                  style={{ backgroundColor: `${errorColor}10` }}
                >
                  <Text fontSize="$3" fontWeight="600" color="$error" marginBottom="$1.5">
                    ⚠️ 重要提示
                  </Text>
                  <Text fontSize="$2" color="$color12" lineHeight={20}>
                    取消签约后：
                    {'\n'}• 将无法继续享受专属医生服务
                    {'\n'}• 所有剩余服务次数将失效
                    {'\n'}• 健康档案将保留但无法更新
                    {'\n'}• 此操作不可撤销
                  </Text>
                </View>

                <Text fontSize="$3" color="$color10" textAlign="center">
                  您确定要取消签约吗？
                </Text>

                <XStack gap="$2">
                  <Pressable
                    onPress={() => setShowCancelDialog(false)}
                    style={{ flex: 1 }}
                  >
                    <View
                      height={44}
                      borderRadius="$10"
                      backgroundColor="$primary"
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
                      height={44}
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor="$error"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="$4" color="$error" fontWeight="600">
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
    </View>
  );
};

export default ContractManagementScreen;
