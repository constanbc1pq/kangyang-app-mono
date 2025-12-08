/**
 * 我的监护协议页面
 * 展示和管理用户的意定监护协议
 */

import React, { useState } from 'react';
import { Alert, RefreshControl, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  User,
  Users,
  Calendar,
  CheckCircle2,
  Edit3,
  Eye,
  XCircle,
  AlertTriangle,
  Plus,
  Info,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GuardianshipAgreement } from '../types/legalService';
import {
  getGuardianshipAgreements,
  updateGuardianshipAgreement,
} from '../services/legalService';
import { TitleBar } from '@/components/TitleBar';

const GOLD_COLOR = '#D4AF37';

type AgreementStatus = 'draft' | 'notarized' | 'effective' | 'terminated';

const MyGuardianshipScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [agreements, setAgreements] = useState<GuardianshipAgreement[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadAgreements();
    }, [])
  );

  const loadAgreements = async () => {
    try {
      const data = await getGuardianshipAgreements();
      setAgreements(data);
    } catch (error) {
      console.error('Error loading guardianship agreements:', error);
      Alert.alert('错误', '加载监护协议失败');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAgreements();
    setRefreshing(false);
  };

  const handleCreateAgreement = () => {
    navigation.navigate('GuardianshipCreator' as never);
  };

  const handleViewAgreement = (agreement: GuardianshipAgreement) => {
    navigation.navigate('GuardianshipDetail' as never, { agreementId: agreement.id } as never);
  };

  const handleEditAgreement = (agreement: GuardianshipAgreement) => {
    if (agreement.status === 'effective') {
      Alert.alert('提示', '已生效的协议不能直接修改，如需修改请创建新协议');
      return;
    }
    navigation.navigate('GuardianshipCreator' as never, { agreementId: agreement.id } as never);
  };

  const handleScheduleNotary = (agreement: GuardianshipAgreement) => {
    Alert.alert(
      '预约公证',
      '意定监护协议需要经过公证才能生效。是否预约公证服务？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '预约公证',
          onPress: () => {
            navigation.navigate('NotaryAppointment' as never, {
              type: 'guardianship',
              agreementId: agreement.id,
            } as never);
          },
        },
      ]
    );
  };

  const handleTerminateAgreement = (agreement: GuardianshipAgreement) => {
    Alert.alert(
      '终止协议',
      '确定要终止这份监护协议吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定终止',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateGuardianshipAgreement(agreement.id, {
                status: 'terminated',
                terminatedAt: new Date().toISOString(),
              });
              Alert.alert('成功', '协议已终止');
              loadAgreements();
            } catch (error) {
              Alert.alert('错误', '终止协议失败');
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (status: AgreementStatus): string => {
    const labels: Record<AgreementStatus, string> = {
      draft: '草稿',
      notarized: '已公证',
      effective: '已生效',
      terminated: '已终止',
    };
    return labels[status] || '未知状态';
  };

  const getStatusColor = (status: AgreementStatus) => {
    switch (status) {
      case 'draft':
        return color10;
      case 'notarized':
        return primaryColor;
      case 'effective':
        return successColor;
      case 'terminated':
        return errorColor;
      default:
        return color10;
    }
  };

  const renderEmptyState = () => (
    <YStack alignItems="center" justifyContent="center" padding="$6">
      <ShieldCheck size={80} color={theme.color5?.val} />
      <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$2" marginBottom="$1">
        还没有监护协议
      </Text>
      <Text fontSize="$3" color="$color10" textAlign="center" lineHeight={20} marginBottom="$3">
        意定监护可以在您意识清楚时为自己指定未来的监护人，保护您的权益
      </Text>
      <Pressable onPress={handleCreateAgreement}>
        <XStack
          backgroundColor="$primary"
          borderRadius="$10"
          paddingHorizontal="$4"
          paddingVertical="$2"
          alignItems="center"
          gap="$1"
        >
          <Plus size={18} color="white" />
          <Text fontSize="$4" fontWeight="600" color="white">创建监护协议</Text>
        </XStack>
      </Pressable>
    </YStack>
  );

  const renderAgreementCard = (agreement: GuardianshipAgreement) => {
    const statusColor = getStatusColor(agreement.status);

    return (
      <Pressable key={agreement.id} onPress={() => handleViewAgreement(agreement)}>
        <View
          backgroundColor="$color2"
          borderRadius="$5"
          padding="$2"
          marginBottom="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          {/* Header */}
          <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12">意定监护协议</Text>
            <View
              style={{ backgroundColor: `${statusColor}20` }}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$2"
            >
              <Text fontSize={11} fontWeight="600" style={{ color: statusColor }}>
                {getStatusLabel(agreement.status)}
              </Text>
            </View>
          </XStack>

          {/* Info */}
          <YStack marginBottom="$2">
            <XStack alignItems="center" marginBottom="$1">
              <User size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1" marginRight="$1">被监护人：</Text>
              <Text fontSize="$2" color="$color12" flex={1}>{agreement.wardName}</Text>
            </XStack>

            <XStack alignItems="center" marginBottom="$1">
              <Users size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1" marginRight="$1">监护人：</Text>
              <Text fontSize="$2" color="$color12" flex={1}>
                {agreement.guardians.map(g => g.name).join('、')}
              </Text>
            </XStack>

            <XStack alignItems="center" marginBottom="$1">
              <Calendar size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1" marginRight="$1">创建日期：</Text>
              <Text fontSize="$2" color="$color12" flex={1}>
                {new Date(agreement.createdAt).toLocaleDateString()}
              </Text>
            </XStack>

            {agreement.notaryOffice && (
              <XStack alignItems="center" marginBottom="$1">
                <ShieldCheck size={16} color={color10} />
                <Text fontSize="$2" color="$color10" marginLeft="$1" marginRight="$1">公证机构：</Text>
                <Text fontSize="$2" color="$color12" flex={1}>{agreement.notaryOffice}</Text>
              </XStack>
            )}

            {agreement.effectiveDate && (
              <XStack alignItems="center">
                <CheckCircle2 size={16} color={color10} />
                <Text fontSize="$2" color="$color10" marginLeft="$1" marginRight="$1">生效日期：</Text>
                <Text fontSize="$2" color="$color12" flex={1}>
                  {new Date(agreement.effectiveDate).toLocaleDateString()}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Duty Tags */}
          <XStack flexWrap="wrap" gap="$1" marginBottom="$2">
            {agreement.scope.dailyCare && (
              <View backgroundColor="$color4" borderRadius="$2" paddingHorizontal="$1.5" paddingVertical="$0.5">
                <Text fontSize={11} color="$primary">生活照料</Text>
              </View>
            )}
            {agreement.scope.medicalDecision && (
              <View backgroundColor="$color4" borderRadius="$2" paddingHorizontal="$1.5" paddingVertical="$0.5">
                <Text fontSize={11} color="$primary">医疗决策</Text>
              </View>
            )}
            {agreement.scope.propertyManagement && (
              <View backgroundColor="$color4" borderRadius="$2" paddingHorizontal="$1.5" paddingVertical="$0.5">
                <Text fontSize={11} color="$primary">财产管理</Text>
              </View>
            )}
            {agreement.scope.legalRepresentation && (
              <View backgroundColor="$color4" borderRadius="$2" paddingHorizontal="$1.5" paddingVertical="$0.5">
                <Text fontSize={11} color="$primary">法律代理</Text>
              </View>
            )}
          </XStack>

          {/* Action Buttons */}
          <XStack borderTopWidth={1} borderTopColor="$color5" paddingTop="$2" gap="$3">
            {agreement.status === 'draft' && (
              <>
                <Pressable onPress={() => handleEditAgreement(agreement)}>
                  <XStack alignItems="center" gap="$0.5">
                    <Edit3 size={16} color={primaryColor} />
                    <Text fontSize="$2" color="$primary">编辑</Text>
                  </XStack>
                </Pressable>
                <Pressable onPress={() => handleScheduleNotary(agreement)}>
                  <XStack alignItems="center" gap="$0.5">
                    <ShieldCheck size={16} color={primaryColor} />
                    <Text fontSize="$2" color="$primary">预约公证</Text>
                  </XStack>
                </Pressable>
              </>
            )}

            {agreement.status === 'notarized' && (
              <Pressable onPress={() => handleViewAgreement(agreement)}>
                <XStack alignItems="center" gap="$0.5">
                  <Eye size={16} color={primaryColor} />
                  <Text fontSize="$2" color="$primary">查看详情</Text>
                </XStack>
              </Pressable>
            )}

            {agreement.status === 'effective' && (
              <>
                <Pressable onPress={() => handleViewAgreement(agreement)}>
                  <XStack alignItems="center" gap="$0.5">
                    <Eye size={16} color={primaryColor} />
                    <Text fontSize="$2" color="$primary">查看协议</Text>
                  </XStack>
                </Pressable>
                <Pressable onPress={() => handleTerminateAgreement(agreement)}>
                  <XStack alignItems="center" gap="$0.5">
                    <XCircle size={16} color={errorColor} />
                    <Text fontSize="$2" color="$error">终止</Text>
                  </XStack>
                </Pressable>
              </>
            )}
          </XStack>

          {/* Reminder Cards */}
          {agreement.status === 'draft' && (
            <XStack
              style={{ backgroundColor: `${GOLD_COLOR}15` }}
              borderRadius="$2"
              padding="$1.5"
              marginTop="$2"
              alignItems="center"
              gap="$1"
            >
              <AlertTriangle size={16} color={GOLD_COLOR} />
              <Text fontSize="$1" color="$color10" flex={1}>
                意定监护协议必须经过公证才能生效
              </Text>
            </XStack>
          )}

          {agreement.status === 'effective' && agreement.supervision?.enabled && (
            <XStack
              backgroundColor="$color4"
              borderRadius="$2"
              padding="$1.5"
              marginTop="$2"
              alignItems="center"
              gap="$1"
            >
              <Eye size={16} color={primaryColor} />
              <Text fontSize="$1" color="$color10" flex={1}>
                监督人：{agreement.supervision.supervisorName}（{agreement.supervision.supervisorRelation}）
              </Text>
            </XStack>
          )}
        </View>
      </Pressable>
    );
  };

  const faqItems = [
    {
      question: '意定监护什么时候生效？',
      answer: '意定监护协议经过公证后，在您丧失或部分丧失民事行为能力时生效。',
    },
    {
      question: '可以随时更改监护人吗？',
      answer: '在您意识清楚、有完全民事行为能力时，可以随时变更或终止意定监护协议。',
    },
    {
      question: '意定监护和法定监护有什么区别？',
      answer: '意定监护是您自主选择监护人，法定监护是法律规定的监护顺序。意定监护优先于法定监护。',
    },
  ];

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top}>
        <TitleBar title="我的监护" />
      </View>

      {/* Header Card */}
      <View backgroundColor="$color2" padding="$2" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack alignItems="center">
          <ShieldCheck size={32} color={primaryColor} />
          <YStack marginLeft="$2" flex={1}>
            <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$0.5">
              意定监护
            </Text>
            <Text fontSize="$2" color="$color10">
              为未来做好准备，保护您的权益
            </Text>
          </YStack>
        </XStack>
      </View>

      {/* Agreement List */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {agreements.length === 0 ? (
          renderEmptyState()
        ) : (
          <View padding="$2.5">
            {agreements.map(agreement => renderAgreementCard(agreement))}
          </View>
        )}

        {/* Legal Notice */}
        <View backgroundColor="$color2" borderRadius="$4" padding="$2" margin="$2.5">
          <XStack alignItems="flex-start">
            <Info size={20} color={primaryColor} />
            <YStack flex={1} marginLeft="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                什么是意定监护？
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                意定监护是指您在意识清楚时，通过书面协议指定自己的监护人，确定监护人的权利和义务。当您因疾病、年老等原因丧失或部分丧失民事行为能力时，由您指定的监护人履行监护职责。
                {'\n\n'}
                根据《民法典》规定，意定监护优先于法定监护。建议您及早规划，保护自己的权益。
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* FAQ Section */}
        <View backgroundColor="$color2" borderRadius="$4" padding="$2" margin="$2.5" marginTop={0}>
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            常见问题
          </Text>
          {faqItems.map((faq, index) => (
            <YStack key={index} marginBottom={index < faqItems.length - 1 ? '$2' : 0}>
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                Q: {faq.question}
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={20}>
                A: {faq.answer}
              </Text>
            </YStack>
          ))}
        </View>

        <View height={100} />
      </ScrollView>

      {/* FAB */}
      {agreements.length > 0 && (
        <Pressable
          onPress={handleCreateAgreement}
          style={{
            position: 'absolute',
            right: 16,
            bottom: insets.bottom + 16,
          }}
        >
          <View
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
            shadowColor="black"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={4}
            elevation={8}
          >
            <Plus size={28} color="white" />
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default MyGuardianshipScreen;
