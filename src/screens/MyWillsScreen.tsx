/**
 * 我的遗嘱页面
 * 展示和管理用户的所有遗嘱
 */

import React, { useState } from 'react';
import { Alert, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Card, Theme, ScrollView, View, Button } from 'tamagui';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Briefcase,
  Users,
  GitBranch,
  Edit,
  CheckCheck,
  Download,
  XCircle,
  Trash2,
  Eye,
  PlusCircle,
  Info,
  AlertTriangle,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Will, WillStatus, WillType } from '../types/legalService';
import {
  getWills,
  getWillsByStatus,
  deleteWill,
  revokeWill,
} from '../services/legalService';
import { generateWillHTML } from '../services/willTemplateEngine';
import { COLORS } from '@/constants/app';

type FilterType = 'all' | WillStatus;

const MyWillsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [wills, setWills] = useState<Will[]>([]);
  const [filteredWills, setFilteredWills] = useState<Will[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadWills();
    }, [])
  );

  const loadWills = async () => {
    try {
      const willsData = await getWills();
      setWills(willsData);
      applyFilter(activeFilter, willsData);
    } catch (error) {
      console.error('Error loading wills:', error);
      Alert.alert('错误', '加载遗嘱列表失败');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWills();
    setRefreshing(false);
  };

  const applyFilter = (filter: FilterType, willsList: Will[] = wills) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredWills(willsList);
    } else {
      setFilteredWills(willsList.filter((will) => will.status === filter));
    }
  };

  const handleCreateWill = () => {
    navigation.navigate('WillCreator' as never);
  };

  const handleViewWill = (will: Will) => {
    navigation.navigate('WillDetail' as never, { willId: will.id } as never);
  };

  const handleEditWill = (will: Will) => {
    if (will.status === WillStatus.EFFECTIVE || will.status === WillStatus.EXECUTED) {
      Alert.alert(
        '提示',
        '已生效的遗嘱不能直接修改。您可以创建新版本的遗嘱,新遗嘱将自动作废旧遗嘱。',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '创建新版本',
            onPress: () => {
              navigation.navigate('WillCreator' as never, { baseWillId: will.id } as never);
            },
          },
        ]
      );
    } else {
      navigation.navigate('WillCreator' as never, { willId: will.id } as never);
    }
  };

  const handleRevokeWill = (will: Will) => {
    Alert.alert('作废遗嘱', '确定要作废这份遗嘱吗？此操作不可撤销。', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定作废',
        style: 'destructive',
        onPress: async () => {
          try {
            await revokeWill(will.id);
            Alert.alert('成功', '遗嘱已作废');
            loadWills();
          } catch (error) {
            Alert.alert('错误', '作废遗嘱失败');
          }
        },
      },
    ]);
  };

  const handleDeleteWill = (will: Will) => {
    if (will.status === WillStatus.EFFECTIVE) {
      Alert.alert('提示', '已生效的遗嘱不能删除,只能作废');
      return;
    }

    Alert.alert('删除遗嘱', '确定要删除这份遗嘱吗？此操作不可撤销。', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWill(will.id);
            Alert.alert('成功', '遗嘱已删除');
            loadWills();
          } catch (error) {
            Alert.alert('错误', '删除遗嘱失败');
          }
        },
      },
    ]);
  };

  const handleDownloadPDF = (will: Will) => {
    try {
      const html = generateWillHTML(will);
      Alert.alert('提示', '下载功能开发中,敬请期待');
    } catch (error) {
      Alert.alert('错误', '生成PDF失败');
    }
  };

  const handleRequestReview = (will: Will) => {
    navigation.navigate('WillReview' as never, { willId: will.id } as never);
  };

  const getWillTypeLabel = (type: WillType): string => {
    switch (type) {
      case WillType.SELF_WRITTEN:
        return '自书遗嘱';
      case WillType.WITNESSED:
        return '代书遗嘱';
      case WillType.AUDIO_VIDEO:
        return '录音录像遗嘱';
      case WillType.NOTARIZED:
        return '公证遗嘱';
      default:
        return '未知类型';
    }
  };

  const getStatusLabel = (status: WillStatus): string => {
    switch (status) {
      case WillStatus.DRAFT:
        return '草稿';
      case WillStatus.PENDING_REVIEW:
        return '待审核';
      case WillStatus.EFFECTIVE:
        return '已生效';
      case WillStatus.EXECUTED:
        return '已执行';
      case WillStatus.REVOKED:
        return '已作废';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = (status: WillStatus): string => {
    switch (status) {
      case WillStatus.DRAFT:
        return COLORS.textSecondary;
      case WillStatus.PENDING_REVIEW:
        return COLORS.primary;
      case WillStatus.EFFECTIVE:
        return COLORS.success;
      case WillStatus.EXECUTED:
        return '#722ed1';
      case WillStatus.REVOKED:
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const shouldShowUpdateReminder = (will: Will): boolean => {
    const createdDate = new Date(will.createdAt);
    const now = new Date();
    const daysSinceCreated = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreated > 365; // 超过一年提醒更新
  };

  const renderEmptyState = () => (
    <YStack alignItems="center" justifyContent="center" padding="$12">
      <FileText size={80} color={COLORS.border} />
      <Text fontSize="$6" fontWeight="600" color={COLORS.text} marginTop="$4" marginBottom="$2">
        还没有遗嘱
      </Text>
      <Text fontSize="$4" color={COLORS.textSecondary} textAlign="center" lineHeight={20} marginBottom="$5">
        订立遗嘱可以清晰表达您的财产分配意愿,避免家庭纠纷
      </Text>
      <Pressable onPress={handleCreateWill}>
        <View
          paddingHorizontal="$5"
          paddingVertical="$3"
          backgroundColor={COLORS.primary}
          borderRadius="$6"
        >
          <XStack alignItems="center" gap="$2">
            <PlusCircle size={20} color="white" />
            <Text fontSize="$4" fontWeight="600" color="white">
              创建遗嘱
            </Text>
          </XStack>
        </View>
      </Pressable>
    </YStack>
  );

  const renderWillCard = (will: Will) => (
    <Pressable key={will.id} onPress={() => handleViewWill(will)}>
      <Card backgroundColor="$background" padding="$4" borderRadius="$3" marginBottom="$3">
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} gap="$1">
              <Text fontSize="$5" fontWeight="600" color={COLORS.text}>
                {will.title}
              </Text>
              <Text fontSize="$3" color={COLORS.textSecondary}>
                {getWillTypeLabel(will.type)}
              </Text>
            </YStack>
            <View
              backgroundColor={`${getStatusColor(will.status)}20`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" fontWeight="600" color={getStatusColor(will.status)}>
                {getStatusLabel(will.status)}
              </Text>
            </View>
          </XStack>

          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <User size={16} color={COLORS.textSecondary} />
              <Text fontSize="$3" color={COLORS.textSecondary}>
                立遗嘱人:
              </Text>
              <Text fontSize="$3" color={COLORS.text}>
                {will.testatorName}
              </Text>
            </XStack>

            <XStack alignItems="center" gap="$2">
              <Calendar size={16} color={COLORS.textSecondary} />
              <Text fontSize="$3" color={COLORS.textSecondary}>
                创建日期:
              </Text>
              <Text fontSize="$3" color={COLORS.text}>
                {new Date(will.createdAt).toLocaleDateString()}
              </Text>
            </XStack>

            {will.estates && will.estates.length > 0 && (
              <XStack alignItems="center" gap="$2">
                <Briefcase size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color={COLORS.textSecondary}>
                  财产项目:
                </Text>
                <Text fontSize="$3" color={COLORS.text}>
                  {will.estates.length} 项
                </Text>
              </XStack>
            )}

            {will.beneficiaries && will.beneficiaries.length > 0 && (
              <XStack alignItems="center" gap="$2">
                <Users size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color={COLORS.textSecondary}>
                  受益人:
                </Text>
                <Text fontSize="$3" color={COLORS.text}>
                  {will.beneficiaries.length} 位
                </Text>
              </XStack>
            )}
          </YStack>

          {will.version > 1 && (
            <View
              backgroundColor={`${COLORS.primary}15`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              alignSelf="flex-start"
            >
              <XStack alignItems="center" gap="$1">
                <GitBranch size={14} color={COLORS.primary} />
                <Text fontSize="$2" color={COLORS.primary}>
                  版本 {will.version}
                </Text>
              </XStack>
            </View>
          )}

          {/* 操作按钮 */}
          <XStack
            borderTopWidth={1}
            borderTopColor={COLORS.border}
            paddingTop="$3"
            marginTop="$2"
            gap="$4"
          >
            {will.status === WillStatus.DRAFT && (
              <>
                <Pressable onPress={() => handleEditWill(will)}>
                  <XStack alignItems="center" gap="$1">
                    <Edit size={18} color={COLORS.primary} />
                    <Text fontSize="$3" color={COLORS.primary}>
                      编辑
                    </Text>
                  </XStack>
                </Pressable>
                <Pressable onPress={() => handleRequestReview(will)}>
                  <XStack alignItems="center" gap="$1">
                    <CheckCheck size={18} color={COLORS.primary} />
                    <Text fontSize="$3" color={COLORS.primary}>
                      审核
                    </Text>
                  </XStack>
                </Pressable>
              </>
            )}

            {will.status === WillStatus.EFFECTIVE && (
              <>
                <Pressable onPress={() => handleDownloadPDF(will)}>
                  <XStack alignItems="center" gap="$1">
                    <Download size={18} color={COLORS.primary} />
                    <Text fontSize="$3" color={COLORS.primary}>
                      下载
                    </Text>
                  </XStack>
                </Pressable>
                <Pressable onPress={() => handleRevokeWill(will)}>
                  <XStack alignItems="center" gap="$1">
                    <XCircle size={18} color={COLORS.error} />
                    <Text fontSize="$3" color={COLORS.error}>
                      作废
                    </Text>
                  </XStack>
                </Pressable>
              </>
            )}

            {will.status === WillStatus.PENDING_REVIEW && (
              <Pressable onPress={() => handleRequestReview(will)}>
                <XStack alignItems="center" gap="$1">
                  <Eye size={18} color={COLORS.primary} />
                  <Text fontSize="$3" color={COLORS.primary}>
                    查看进度
                  </Text>
                </XStack>
              </Pressable>
            )}

            {(will.status === WillStatus.DRAFT || will.status === WillStatus.REVOKED) && (
              <Pressable onPress={() => handleDeleteWill(will)}>
                <XStack alignItems="center" gap="$1">
                  <Trash2 size={18} color={COLORS.error} />
                  <Text fontSize="$3" color={COLORS.error}>
                    删除
                  </Text>
                </XStack>
              </Pressable>
            )}
          </XStack>

          {/* 更新提醒 */}
          {will.status === WillStatus.EFFECTIVE && shouldShowUpdateReminder(will) && (
            <Card backgroundColor="#fffbe6" padding="$2" borderRadius="$2" marginTop="$2">
              <XStack alignItems="center" gap="$2">
                <AlertTriangle size={16} color={COLORS.warning} />
                <Text flex={1} fontSize="$2" color={COLORS.textSecondary}>
                  建议每年检查遗嘱内容,确保与最新情况一致
                </Text>
              </XStack>
            </Card>
          )}
        </YStack>
      </Card>
    </Pressable>
  );

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Title Bar */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor="$cardBg"
          borderBottomWidth={1}
          borderBottomColor={COLORS.border}
        >
          <Button chromeless padding="$1" onPress={() => navigation.goBack()} pressStyle={{ opacity: 0.6 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Button>
          <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>我的遗嘱</Text>
          <View width={32} />
        </XStack>

        {/* 顶部统计卡片 */}
        <XStack backgroundColor="$background" padding="$4" borderBottomWidth={1} borderBottomColor={COLORS.border}>
          <View flex={1} alignItems="center">
            <Text fontSize="$7" fontWeight="600" color={COLORS.text} marginBottom="$1">
              {wills.length}
            </Text>
            <Text fontSize="$2" color={COLORS.textSecondary}>
              总遗嘱数
            </Text>
          </View>
          <View flex={1} alignItems="center">
            <Text fontSize="$7" fontWeight="600" color={COLORS.success} marginBottom="$1">
              {wills.filter((w) => w.status === WillStatus.EFFECTIVE).length}
            </Text>
            <Text fontSize="$2" color={COLORS.textSecondary}>
              已生效
            </Text>
          </View>
          <View flex={1} alignItems="center">
            <Text fontSize="$7" fontWeight="600" color={COLORS.textSecondary} marginBottom="$1">
              {wills.filter((w) => w.status === WillStatus.DRAFT).length}
            </Text>
            <Text fontSize="$2" color={COLORS.textSecondary}>
              草稿
            </Text>
          </View>
        </XStack>

        {/* 筛选按钮 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          backgroundColor="$background"
          borderBottomWidth={1}
          borderBottomColor={COLORS.border}
        >
          <XStack paddingHorizontal="$4" paddingVertical="$3" gap="$2">
            <Pressable onPress={() => applyFilter('all')}>
              <View
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$4"
                backgroundColor={activeFilter === 'all' ? `${COLORS.primary}15` : COLORS.surface}
              >
                <Text
                  fontSize="$3"
                  color={activeFilter === 'all' ? COLORS.primary : COLORS.textSecondary}
                  fontWeight={activeFilter === 'all' ? '600' : '400'}
                >
                  全部
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => applyFilter(WillStatus.DRAFT)}>
              <View
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$4"
                backgroundColor={
                  activeFilter === WillStatus.DRAFT ? `${COLORS.primary}15` : COLORS.surface
                }
              >
                <Text
                  fontSize="$3"
                  color={
                    activeFilter === WillStatus.DRAFT ? COLORS.primary : COLORS.textSecondary
                  }
                  fontWeight={activeFilter === WillStatus.DRAFT ? '600' : '400'}
                >
                  草稿
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => applyFilter(WillStatus.EFFECTIVE)}>
              <View
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$4"
                backgroundColor={
                  activeFilter === WillStatus.EFFECTIVE ? `${COLORS.primary}15` : COLORS.surface
                }
              >
                <Text
                  fontSize="$3"
                  color={
                    activeFilter === WillStatus.EFFECTIVE ? COLORS.primary : COLORS.textSecondary
                  }
                  fontWeight={activeFilter === WillStatus.EFFECTIVE ? '600' : '400'}
                >
                  已生效
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => applyFilter(WillStatus.REVOKED)}>
              <View
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$4"
                backgroundColor={
                  activeFilter === WillStatus.REVOKED ? `${COLORS.primary}15` : COLORS.surface
                }
              >
                <Text
                  fontSize="$3"
                  color={
                    activeFilter === WillStatus.REVOKED ? COLORS.primary : COLORS.textSecondary
                  }
                  fontWeight={activeFilter === WillStatus.REVOKED ? '600' : '400'}
                >
                  已作废
                </Text>
              </View>
            </Pressable>
          </XStack>
        </ScrollView>

        {/* 遗嘱列表 */}
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {filteredWills.length === 0 ? (
            renderEmptyState()
          ) : (
            <YStack padding="$4">
              {filteredWills.map((will) => renderWillCard(will))}
            </YStack>
          )}

          {/* 法律提示 */}
          <Card backgroundColor={`${COLORS.primary}15`} margin="$4" padding="$4" borderRadius="$3">
            <XStack gap="$3">
              <Info size={20} color={COLORS.primary} />
              <YStack flex={1} gap="$2">
                <Text fontSize="$4" fontWeight="600" color={COLORS.text}>
                  法律提示
                </Text>
                <Text fontSize="$3" color={COLORS.textSecondary} lineHeight={18}>
                  1. 遗嘱应当真实反映您的意愿,不受他人强迫或欺骗{'\n'}
                  2. 建议定期更新遗嘱,确保内容符合最新情况{'\n'}
                  3. 公证遗嘱具有最高法律效力{'\n'}
                  4. 遗嘱应妥善保管,并告知执行人位置
                </Text>
              </YStack>
            </XStack>
          </Card>
        </ScrollView>

        {/* 浮动创建按钮 */}
        {wills.length > 0 && (
          <Pressable
            onPress={handleCreateWill}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
            }}
          >
            <View
              width={56}
              height={56}
              borderRadius="$12"
              backgroundColor={COLORS.primary}
              alignItems="center"
              justifyContent="center"
              shadowColor={COLORS.shadow}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={4}
            >
              <PlusCircle size={28} color="white" />
            </View>
          </Pressable>
        )}
      </SafeAreaView>
    </Theme>
  );
};

export default MyWillsScreen;
