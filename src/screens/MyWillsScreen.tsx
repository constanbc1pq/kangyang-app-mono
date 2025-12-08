/**
 * 我的遗嘱页面
 * 展示和管理用户的所有遗嘱
 * Design: Following CLAUDE.md specs
 */

import React, { useState } from 'react';
import { Alert, RefreshControl, Pressable } from 'react-native';
import { YStack, XStack, Text, ScrollView, View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
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
  deleteWill,
  revokeWill,
} from '../services/legalService';
import { generateWillHTML } from '../services/willTemplateEngine';
import { TitleBar } from '@/components/TitleBar';

type FilterType = 'all' | WillStatus;

const MyWillsScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

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
      case WillType.SELF_WRITTEN: return '自书遗嘱';
      case WillType.WITNESSED: return '代书遗嘱';
      case WillType.AUDIO_VIDEO: return '录音录像遗嘱';
      case WillType.NOTARIZED: return '公证遗嘱';
      default: return '未知类型';
    }
  };

  const getStatusLabel = (status: WillStatus): string => {
    switch (status) {
      case WillStatus.DRAFT: return '草稿';
      case WillStatus.PENDING_REVIEW: return '待审核';
      case WillStatus.EFFECTIVE: return '已生效';
      case WillStatus.EXECUTED: return '已执行';
      case WillStatus.REVOKED: return '已作废';
      default: return '未知状态';
    }
  };

  const getStatusColor = (status: WillStatus): string | undefined => {
    switch (status) {
      case WillStatus.DRAFT: return color10;
      case WillStatus.PENDING_REVIEW: return primaryColor;
      case WillStatus.EFFECTIVE: return successColor;
      case WillStatus.EXECUTED: return primaryColor;
      case WillStatus.REVOKED: return errorColor;
      default: return color10;
    }
  };

  const shouldShowUpdateReminder = (will: Will): boolean => {
    const createdDate = new Date(will.createdAt);
    const now = new Date();
    const daysSinceCreated = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreated > 365;
  };

  const renderEmptyState = () => (
    <YStack alignItems="center" justifyContent="center" padding="$10">
      <FileText size={64} color={color10} />
      <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$3" marginBottom="$1">
        还没有遗嘱
      </Text>
      <Text fontSize="$3" color="$color10" textAlign="center" lineHeight={18} marginBottom="$4">
        订立遗嘱可以清晰表达您的财产分配意愿,避免家庭纠纷
      </Text>
      <Pressable onPress={handleCreateWill}>
        <View
          paddingHorizontal="$4"
          paddingVertical="$2"
          backgroundColor="$primary"
          borderRadius="$10"
        >
          <XStack alignItems="center" gap="$1.5">
            <PlusCircle size={18} color="white" />
            <Text fontSize="$3" fontWeight="500" color="white">创建遗嘱</Text>
          </XStack>
        </View>
      </Pressable>
    </YStack>
  );

  const renderWillCard = (will: Will) => {
    const statusColor = getStatusColor(will.status);
    return (
      <Pressable key={will.id} onPress={() => handleViewWill(will)}>
        <View
          backgroundColor="$color2"
          padding="$2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$2"
        >
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <YStack flex={1} gap="$0.5">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {will.title}
                </Text>
                <Text fontSize="$2" color="$color10">
                  {getWillTypeLabel(will.type)}
                </Text>
              </YStack>
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                style={{ backgroundColor: `${statusColor}20` }}
              >
                <Text fontSize={10} fontWeight="600" color={statusColor}>
                  {getStatusLabel(will.status)}
                </Text>
              </View>
            </XStack>

            <YStack gap="$1.5">
              <XStack alignItems="center" gap="$1.5">
                <User size={14} color={color10} />
                <Text fontSize="$2" color="$color10">立遗嘱人:</Text>
                <Text fontSize="$2" color="$color12">{will.testatorName}</Text>
              </XStack>

              <XStack alignItems="center" gap="$1.5">
                <Calendar size={14} color={color10} />
                <Text fontSize="$2" color="$color10">创建日期:</Text>
                <Text fontSize="$2" color="$color12">
                  {new Date(will.createdAt).toLocaleDateString()}
                </Text>
              </XStack>

              {will.estates && will.estates.length > 0 && (
                <XStack alignItems="center" gap="$1.5">
                  <Briefcase size={14} color={color10} />
                  <Text fontSize="$2" color="$color10">财产项目:</Text>
                  <Text fontSize="$2" color="$color12">{will.estates.length} 项</Text>
                </XStack>
              )}

              {will.beneficiaries && will.beneficiaries.length > 0 && (
                <XStack alignItems="center" gap="$1.5">
                  <Users size={14} color={color10} />
                  <Text fontSize="$2" color="$color10">受益人:</Text>
                  <Text fontSize="$2" color="$color12">{will.beneficiaries.length} 位</Text>
                </XStack>
              )}
            </YStack>

            {will.version > 1 && (
              <View
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
                alignSelf="flex-start"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <XStack alignItems="center" gap="$0.5">
                  <GitBranch size={12} color={primaryColor} />
                  <Text fontSize={10} color="$primary">版本 {will.version}</Text>
                </XStack>
              </View>
            )}

            <View height={1} backgroundColor="$color5" marginTop="$1" />

            <XStack gap="$3" paddingTop="$1">
              {will.status === WillStatus.DRAFT && (
                <>
                  <Pressable onPress={() => handleEditWill(will)}>
                    <XStack alignItems="center" gap="$0.5">
                      <Edit size={16} color={primaryColor} />
                      <Text fontSize="$2" color="$primary">编辑</Text>
                    </XStack>
                  </Pressable>
                  <Pressable onPress={() => handleRequestReview(will)}>
                    <XStack alignItems="center" gap="$0.5">
                      <CheckCheck size={16} color={primaryColor} />
                      <Text fontSize="$2" color="$primary">审核</Text>
                    </XStack>
                  </Pressable>
                </>
              )}

              {will.status === WillStatus.EFFECTIVE && (
                <>
                  <Pressable onPress={() => handleDownloadPDF(will)}>
                    <XStack alignItems="center" gap="$0.5">
                      <Download size={16} color={primaryColor} />
                      <Text fontSize="$2" color="$primary">下载</Text>
                    </XStack>
                  </Pressable>
                  <Pressable onPress={() => handleRevokeWill(will)}>
                    <XStack alignItems="center" gap="$0.5">
                      <XCircle size={16} color={errorColor} />
                      <Text fontSize="$2" color="$error">作废</Text>
                    </XStack>
                  </Pressable>
                </>
              )}

              {will.status === WillStatus.PENDING_REVIEW && (
                <Pressable onPress={() => handleRequestReview(will)}>
                  <XStack alignItems="center" gap="$0.5">
                    <Eye size={16} color={primaryColor} />
                    <Text fontSize="$2" color="$primary">查看进度</Text>
                  </XStack>
                </Pressable>
              )}

              {(will.status === WillStatus.DRAFT || will.status === WillStatus.REVOKED) && (
                <Pressable onPress={() => handleDeleteWill(will)}>
                  <XStack alignItems="center" gap="$0.5">
                    <Trash2 size={16} color={errorColor} />
                    <Text fontSize="$2" color="$error">删除</Text>
                  </XStack>
                </Pressable>
              )}
            </XStack>

            {will.status === WillStatus.EFFECTIVE && shouldShowUpdateReminder(will) && (
              <View
                padding="$1.5"
                borderRadius="$3"
                marginTop="$1"
                style={{ backgroundColor: `${warningColor}15` }}
              >
                <XStack alignItems="center" gap="$1.5">
                  <AlertTriangle size={14} color={warningColor} />
                  <Text flex={1} fontSize="$2" color="$color10">
                    建议每年检查遗嘱内容,确保与最新情况一致
                  </Text>
                </XStack>
              </View>
            )}
          </YStack>
        </View>
      </Pressable>
    );
  };

  const filterButtons = [
    { key: 'all' as FilterType, label: '全部' },
    { key: WillStatus.DRAFT as FilterType, label: '草稿' },
    { key: WillStatus.EFFECTIVE as FilterType, label: '已生效' },
    { key: WillStatus.REVOKED as FilterType, label: '已作废' },
  ];

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top}>
        <TitleBar title="我的遗嘱" />
      </View>

      {/* Stats */}
      <XStack backgroundColor="$color2" padding="$2.5" borderBottomWidth={1} borderBottomColor="$color5">
        <View flex={1} alignItems="center">
          <Text fontSize="$6" fontWeight="700" color="$color12" marginBottom="$0.5">
            {wills.length}
          </Text>
          <Text fontSize="$2" color="$color10">总遗嘱数</Text>
        </View>
        <View flex={1} alignItems="center">
          <Text fontSize="$6" fontWeight="700" color="$success" marginBottom="$0.5">
            {wills.filter((w) => w.status === WillStatus.EFFECTIVE).length}
          </Text>
          <Text fontSize="$2" color="$color10">已生效</Text>
        </View>
        <View flex={1} alignItems="center">
          <Text fontSize="$6" fontWeight="700" color="$color10" marginBottom="$0.5">
            {wills.filter((w) => w.status === WillStatus.DRAFT).length}
          </Text>
          <Text fontSize="$2" color="$color10">草稿</Text>
        </View>
      </XStack>

      {/* Filter buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack paddingHorizontal="$2.5" paddingVertical="$2" gap="$1.5">
          {filterButtons.map((btn) => (
            <Pressable key={btn.key} onPress={() => applyFilter(btn.key)}>
              <View
                paddingHorizontal="$3"
                paddingVertical="$1.5"
                borderRadius="$10"
                backgroundColor={activeFilter === btn.key ? '$primary' : '$color4'}
              >
                <Text
                  fontSize="$2"
                  color={activeFilter === btn.key ? 'white' : '$color10'}
                  fontWeight={activeFilter === btn.key ? '500' : '400'}
                >
                  {btn.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>

      {/* Wills list */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {filteredWills.length === 0 ? (
          renderEmptyState()
        ) : (
          <YStack padding="$2.5">
            {filteredWills.map((will) => renderWillCard(will))}
          </YStack>
        )}

        {/* Legal tips */}
        <View
          margin="$2.5"
          padding="$2"
          borderRadius="$5"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <XStack gap="$2">
            <Info size={18} color={primaryColor} />
            <YStack flex={1} gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">法律提示</Text>
              <Text fontSize="$2" color="$color10" lineHeight={16}>
                1. 遗嘱应当真实反映您的意愿,不受他人强迫或欺骗{'\n'}
                2. 建议定期更新遗嘱,确保内容符合最新情况{'\n'}
                3. 公证遗嘱具有最高法律效力{'\n'}
                4. 遗嘱应妥善保管,并告知执行人位置
              </Text>
            </YStack>
          </XStack>
        </View>
      </ScrollView>

      {/* FAB */}
      {wills.length > 0 && (
        <Pressable
          onPress={handleCreateWill}
          style={{
            position: 'absolute',
            right: 18,
            bottom: insets.bottom + 18,
          }}
        >
          <View
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={4}
            elevation={4}
          >
            <PlusCircle size={26} color="white" />
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default MyWillsScreen;
