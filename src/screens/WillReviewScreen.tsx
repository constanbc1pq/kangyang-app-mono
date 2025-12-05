/**
 * 遗嘱审核与公证页面
 * 提供律师审核和公证预约服务
 */

import React, { useState, useEffect } from 'react';
import { Alert, TextInput, ActivityIndicator, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  Hourglass,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Building2,
  Info,
  Upload,
  AlertCircle,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Will, WillStatus } from '../types/legalService';
import { getWillById, updateWill } from '../services/legalService';
import {
  generateSelfWrittenWillTemplate,
  generateWitnessedWillTemplate,
  generateAudioVideoWillGuidelines,
} from '../services/willTemplateEngine';

const GOLD_COLOR = '#D4AF37';

type RouteParams = {
  WillReview: {
    willId: string;
  };
};

type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
type NotaryStatus = 'not_started' | 'scheduled' | 'in_progress' | 'completed';

interface ReviewResult {
  status: ReviewStatus;
  reviewerName?: string;
  reviewDate?: string;
  comments?: string;
  suggestions?: string[];
  approved: boolean;
}

interface NotaryAppointment {
  status: NotaryStatus;
  notaryOffice?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  address?: string;
  contact?: string;
  documents?: string[];
  fee?: number;
}

const WillReviewScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RouteParams, 'WillReview'>>();
  const navigation = useNavigation();
  const { willId } = route.params;

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [will, setWill] = useState<Will | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'review' | 'notary'>('review');

  // 审核相关状态
  const [reviewResult, setReviewResult] = useState<ReviewResult>({
    status: 'pending',
    approved: false,
  });

  // 公证相关状态
  const [notaryAppointment, setNotaryAppointment] = useState<NotaryAppointment>({
    status: 'not_started',
  });

  const [notaryForm, setNotaryForm] = useState({
    preferredDate: '',
    preferredTime: '',
    contactPhone: '',
    notes: '',
  });

  useEffect(() => {
    loadWillData();
  }, [willId]);

  const loadWillData = async () => {
    try {
      const willData = await getWillById(willId);
      if (willData) {
        setWill(willData);
      }
    } catch (error) {
      console.error('Error loading will:', error);
      Alert.alert('错误', '加载遗嘱数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交律师审核
  const handleSubmitForReview = () => {
    Alert.alert(
      '提交审核',
      '提交后，专业律师将在1-3个工作日内完成审核。审核费用：¥500',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认提交',
          onPress: async () => {
            try {
              setReviewResult({
                status: 'in_review',
                approved: false,
              });

              await updateWill(willId, {
                status: WillStatus.PENDING_REVIEW,
              });

              Alert.alert('提交成功', '您的遗嘱已提交审核，请耐心等待');
            } catch (error) {
              Alert.alert('提交失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  // 预约公证
  const handleScheduleNotary = () => {
    if (!notaryForm.preferredDate || !notaryForm.contactPhone) {
      Alert.alert('提示', '请填写预约日期和联系电话');
      return;
    }

    Alert.alert(
      '预约公证',
      '确认预约公证服务？我们将在24小时内与您联系确认具体时间。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认预约',
          onPress: async () => {
            try {
              setNotaryAppointment({
                status: 'scheduled',
                appointmentDate: notaryForm.preferredDate,
                appointmentTime: notaryForm.preferredTime,
                notaryOffice: '市公证处',
                address: '待确认',
                contact: '待分配',
              });

              Alert.alert('预约成功', '公证处工作人员将在24小时内与您联系');
            } catch (error) {
              Alert.alert('预约失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  // 查看遗嘱内容
  const handleViewWillContent = () => {
    if (!will) return;

    let template;
    switch (will.type) {
      case 'self_written':
        template = generateSelfWrittenWillTemplate(will);
        break;
      case 'witnessed':
        template = generateWitnessedWillTemplate(will);
        break;
      case 'audio_video':
        template = generateAudioVideoWillGuidelines(will);
        break;
      default:
        template = generateSelfWrittenWillTemplate(will);
    }

    Alert.alert('遗嘱内容', template.content, [{ text: '关闭' }], {
      cancelable: true,
    });
  };

  // 获取审核状态图标
  const getReviewStatusIcon = () => {
    switch (reviewResult.status) {
      case 'pending':
        return <Clock size={32} color={primaryColor} />;
      case 'in_review':
        return <Hourglass size={32} color={primaryColor} />;
      case 'approved':
        return <CheckCircle2 size={32} color={successColor} />;
      case 'rejected':
        return <XCircle size={32} color={errorColor} />;
      default:
        return <Clock size={32} color={primaryColor} />;
    }
  };

  // 获取公证状态图标
  const getNotaryStatusIcon = () => {
    switch (notaryAppointment.status) {
      case 'not_started':
        return <FileText size={32} color={primaryColor} />;
      case 'scheduled':
        return <Calendar size={32} color={primaryColor} />;
      case 'in_progress':
        return <Clock size={32} color={primaryColor} />;
      case 'completed':
        return <CheckCircle2 size={32} color={successColor} />;
      default:
        return <FileText size={32} color={primaryColor} />;
    }
  };

  // 渲染审核标签页
  const renderReviewTab = () => (
    <YStack padding="$2.5" gap="$2">
      {/* 审核状态卡片 */}
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        padding="$2.5"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack alignItems="center" gap="$2" marginBottom="$2">
          {getReviewStatusIcon()}
          <Text fontSize="$5" fontWeight="600" color="$color12">
            {reviewResult.status === 'pending' && '待提交审核'}
            {reviewResult.status === 'in_review' && '审核中'}
            {reviewResult.status === 'approved' && '审核通过'}
            {reviewResult.status === 'rejected' && '需要修改'}
          </Text>
        </XStack>

        {reviewResult.status === 'pending' && (
          <YStack gap="$2">
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              专业律师将从以下方面审核您的遗嘱：
            </Text>
            <YStack gap="$1.5">
              {[
                '法律条款完整性',
                '财产分配合理性',
                '受益人信息准确性',
                '特殊条款合法性',
                '潜在法律风险识别',
              ].map((item, index) => (
                <XStack key={index} alignItems="center" gap="$1.5">
                  <CheckCircle2 size={16} color={successColor} />
                  <Text fontSize="$3" color="$color12">{item}</Text>
                </XStack>
              ))}
            </YStack>

            <View
              backgroundColor="$color4"
              borderRadius="$4"
              padding="$2"
              alignItems="center"
            >
              <Text fontSize="$3" color="$color10">审核费用</Text>
              <Text fontSize="$8" fontWeight="700" color="$primary" marginVertical="$1">
                ¥500
              </Text>
              <Text fontSize="$2" color="$color10">1-3个工作日完成</Text>
            </View>

            <Pressable onPress={handleSubmitForReview}>
              <View
                backgroundColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="white">提交律师审核</Text>
              </View>
            </Pressable>
          </YStack>
        )}

        {reviewResult.status === 'in_review' && (
          <YStack gap="$2">
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              您的遗嘱正在审核中，预计1-3个工作日内完成
            </Text>
            <YStack gap="$3" marginTop="$2">
              {/* 时间线 */}
              <XStack gap="$2">
                <View
                  width={12}
                  height={12}
                  borderRadius={6}
                  backgroundColor="$success"
                  marginTop={4}
                />
                <YStack flex={1}>
                  <Text fontSize="$3" fontWeight="600" color="$color12">提交审核</Text>
                  <Text fontSize="$2" color="$color10">{new Date().toLocaleDateString()}</Text>
                </YStack>
              </XStack>
              <XStack gap="$2">
                <View
                  width={12}
                  height={12}
                  borderRadius={6}
                  backgroundColor="$primary"
                  marginTop={4}
                />
                <YStack flex={1}>
                  <Text fontSize="$3" fontWeight="600" color="$color12">律师审核中</Text>
                  <Text fontSize="$2" color="$color10">审核中...</Text>
                </YStack>
              </XStack>
              <XStack gap="$2">
                <View
                  width={12}
                  height={12}
                  borderRadius={6}
                  backgroundColor="$color5"
                  marginTop={4}
                />
                <YStack flex={1}>
                  <Text fontSize="$3" fontWeight="600" color="$color12">审核完成</Text>
                  <Text fontSize="$2" color="$color10">待完成</Text>
                </YStack>
              </XStack>
            </YStack>
          </YStack>
        )}

        {reviewResult.status === 'approved' && (
          <YStack gap="$2">
            <View
              backgroundColor="$color4"
              borderRadius="$4"
              padding="$2"
              borderLeftWidth={3}
              borderLeftColor="$success"
            >
              <Text fontSize="$4" fontWeight="600" color="$success" marginBottom="$1">
                审核通过
              </Text>
              <Text fontSize="$3" color="$color10" lineHeight={20}>
                您的遗嘱已通过律师审核，符合法律要求。
              </Text>
              {reviewResult.reviewerName && (
                <Text fontSize="$2" color="$color10" marginTop="$1">
                  审核律师：{reviewResult.reviewerName}
                </Text>
              )}
              {reviewResult.reviewDate && (
                <Text fontSize="$2" color="$color10">
                  审核日期：{reviewResult.reviewDate}
                </Text>
              )}
            </View>

            {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
              <View
                style={{ backgroundColor: `${GOLD_COLOR}15` }}
                borderRadius="$4"
                padding="$2"
              >
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                  律师建议
                </Text>
                {reviewResult.suggestions.map((suggestion, index) => (
                  <Text key={index} fontSize="$2" color="$color10" lineHeight={20}>
                    • {suggestion}
                  </Text>
                ))}
              </View>
            )}

            <Pressable onPress={() => setActiveTab('notary')}>
              <View
                borderWidth={1}
                borderColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
              >
                <XStack justifyContent="center" alignItems="center" gap="$1">
                  <Text fontSize="$4" fontWeight="600" color="$primary">前往预约公证</Text>
                  <ChevronRight size={16} color={primaryColor} />
                </XStack>
              </View>
            </Pressable>
          </YStack>
        )}

        {reviewResult.status === 'rejected' && (
          <YStack gap="$2">
            <View
              style={{ backgroundColor: `${errorColor}10` }}
              borderRadius="$4"
              padding="$2"
              borderLeftWidth={3}
              borderLeftColor="$error"
            >
              <Text fontSize="$4" fontWeight="600" color="$error" marginBottom="$1">
                需要修改
              </Text>
              <Text fontSize="$3" color="$color10" lineHeight={20}>
                律师审核发现以下问题，请修改后重新提交：
              </Text>
              {reviewResult.comments && (
                <Text fontSize="$2" color="$color12" fontStyle="italic" marginTop="$1">
                  {reviewResult.comments}
                </Text>
              )}
            </View>

            {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
              <View
                style={{ backgroundColor: `${GOLD_COLOR}15` }}
                borderRadius="$4"
                padding="$2"
              >
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                  修改建议
                </Text>
                {reviewResult.suggestions.map((suggestion, index) => (
                  <Text key={index} fontSize="$2" color="$color10" lineHeight={20}>
                    {index + 1}. {suggestion}
                  </Text>
                ))}
              </View>
            )}

            <Pressable onPress={() => navigation.goBack()}>
              <View
                backgroundColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="white">返回修改遗嘱</Text>
              </View>
            </Pressable>
          </YStack>
        )}
      </View>

      {/* 遗嘱预览 */}
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        padding="$2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          遗嘱预览
        </Text>
        <Pressable onPress={handleViewWillContent}>
          <View
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$4"
            paddingVertical="$2"
          >
            <XStack justifyContent="center" alignItems="center" gap="$1">
              <FileText size={18} color={primaryColor} />
              <Text fontSize="$3" color="$primary" fontWeight="500">查看完整遗嘱</Text>
            </XStack>
          </View>
        </Pressable>
      </View>
    </YStack>
  );

  // 渲染公证标签页
  const renderNotaryTab = () => (
    <YStack padding="$2.5" gap="$2">
      {/* 公证状态卡片 */}
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        padding="$2.5"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack alignItems="center" gap="$2" marginBottom="$2">
          {getNotaryStatusIcon()}
          <Text fontSize="$5" fontWeight="600" color="$color12">
            {notaryAppointment.status === 'not_started' && '未预约'}
            {notaryAppointment.status === 'scheduled' && '已预约'}
            {notaryAppointment.status === 'in_progress' && '公证中'}
            {notaryAppointment.status === 'completed' && '公证完成'}
          </Text>
        </XStack>

        {notaryAppointment.status === 'not_started' && (
          <YStack gap="$2">
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              公证遗嘱具有最高的法律效力，建议进行公证
            </Text>

            {/* 公证说明 */}
            <View backgroundColor="$color4" borderRadius="$4" padding="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
                公证服务包括
              </Text>
              {[
                '遗嘱内容审查',
                '立遗嘱人身份确认',
                '真实意愿核实',
                '法律效力认证',
                '遗嘱档案保管（可选）',
              ].map((item, index) => (
                <Text key={index} fontSize="$2" color="$color10" lineHeight={22}>
                  ✓ {item}
                </Text>
              ))}
            </View>

            {/* 所需材料 */}
            <View
              backgroundColor="$color2"
              borderRadius="$4"
              padding="$2"
              borderWidth={1}
              borderColor="$color5"
            >
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
                所需材料
              </Text>
              {[
                '身份证原件及复印件',
                '户口本原件及复印件',
                '财产证明材料',
                '遗嘱草稿',
              ].map((item, index) => (
                <XStack key={index} alignItems="center" gap="$1.5" marginBottom="$1">
                  <FileText size={16} color={color10} />
                  <Text fontSize="$2" color="$color10">{item}</Text>
                </XStack>
              ))}
            </View>

            {/* 预约表单 */}
            <YStack gap="$1.5">
              <Text fontSize="$4" fontWeight="600" color="$color12">预约公证</Text>

              <Text fontSize="$3" fontWeight="500" color="$color12" marginTop="$1">
                期望日期 *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.color5?.val,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  backgroundColor: theme.color2?.val,
                  color: theme.color12?.val,
                }}
                placeholder="请选择期望的公证日期"
                placeholderTextColor={theme.color10?.val}
                value={notaryForm.preferredDate}
                onChangeText={text =>
                  setNotaryForm({ ...notaryForm, preferredDate: text })
                }
              />

              <Text fontSize="$3" fontWeight="500" color="$color12" marginTop="$1">
                期望时间
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.color5?.val,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  backgroundColor: theme.color2?.val,
                  color: theme.color12?.val,
                }}
                placeholder="例如：上午9:00-11:00"
                placeholderTextColor={theme.color10?.val}
                value={notaryForm.preferredTime}
                onChangeText={text =>
                  setNotaryForm({ ...notaryForm, preferredTime: text })
                }
              />

              <Text fontSize="$3" fontWeight="500" color="$color12" marginTop="$1">
                联系电话 *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.color5?.val,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  backgroundColor: theme.color2?.val,
                  color: theme.color12?.val,
                }}
                placeholder="请输入您的联系电话"
                placeholderTextColor={theme.color10?.val}
                value={notaryForm.contactPhone}
                onChangeText={text =>
                  setNotaryForm({ ...notaryForm, contactPhone: text })
                }
                keyboardType="phone-pad"
              />

              <Text fontSize="$3" fontWeight="500" color="$color12" marginTop="$1">
                备注
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.color5?.val,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  backgroundColor: theme.color2?.val,
                  color: theme.color12?.val,
                  height: 80,
                  textAlignVertical: 'top',
                }}
                placeholder="其他需要说明的事项"
                placeholderTextColor={theme.color10?.val}
                value={notaryForm.notes}
                onChangeText={text => setNotaryForm({ ...notaryForm, notes: text })}
                multiline
                numberOfLines={3}
              />

              <Pressable onPress={handleScheduleNotary}>
                <View
                  backgroundColor="$primary"
                  borderRadius="$10"
                  paddingVertical="$2"
                  alignItems="center"
                  marginTop="$1"
                >
                  <Text fontSize="$4" fontWeight="600" color="white">提交预约</Text>
                </View>
              </Pressable>
            </YStack>

            <View
              style={{ backgroundColor: `${GOLD_COLOR}15` }}
              borderRadius="$4"
              padding="$2"
              alignItems="center"
            >
              <Text fontSize="$3" color="$color10">公证费用</Text>
              <Text fontSize="$6" fontWeight="700" style={{ color: GOLD_COLOR }} marginVertical="$1">
                约 ¥300-800
              </Text>
              <Text fontSize="$2" color="$color10" textAlign="center">
                根据遗产价值确定，以公证处实际收费为准
              </Text>
            </View>
          </YStack>
        )}

        {notaryAppointment.status === 'scheduled' && (
          <YStack gap="$2">
            <Text fontSize="$3" color="$color10" lineHeight={20}>
              您已成功预约公证服务
            </Text>

            <View backgroundColor="$color4" borderRadius="$4" padding="$2">
              {[
                { icon: Building2, label: '公证处', value: notaryAppointment.notaryOffice },
                { icon: Calendar, label: '预约日期', value: notaryAppointment.appointmentDate },
                { icon: Clock, label: '预约时间', value: notaryAppointment.appointmentTime || '待确认' },
                { icon: MapPin, label: '地址', value: notaryAppointment.address || '待确认' },
                { icon: Phone, label: '联系人', value: notaryAppointment.contact || '待确认' },
              ].map((item, index) => (
                <XStack key={index} alignItems="center" marginBottom="$1.5">
                  <item.icon size={18} color={color10} />
                  <Text fontSize="$3" color="$color10" marginLeft="$1" width={70}>
                    {item.label}：
                  </Text>
                  <Text fontSize="$3" color="$color12" flex={1}>{item.value}</Text>
                </XStack>
              ))}
            </View>

            <XStack
              backgroundColor="$color4"
              borderRadius="$4"
              padding="$2"
              alignItems="center"
              gap="$1"
            >
              <Info size={18} color={primaryColor} />
              <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
                请携带所需材料，提前15分钟到达公证处
              </Text>
            </XStack>
          </YStack>
        )}

        {notaryAppointment.status === 'completed' && (
          <YStack gap="$2">
            <YStack alignItems="center" padding="$3">
              <CheckCircle2 size={48} color={successColor} />
              <Text fontSize="$5" fontWeight="600" color="$success" marginTop="$2">
                公证完成
              </Text>
              <Text fontSize="$3" color="$color10" textAlign="center" marginTop="$1">
                您的遗嘱已完成公证，具有完全的法律效力
              </Text>
            </YStack>

            <View backgroundColor="$color4" borderRadius="$4" padding="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
                公证书信息
              </Text>
              <XStack marginBottom="$1">
                <Text fontSize="$2" color="$color10" width={100}>公证书编号：</Text>
                <Text fontSize="$2" color="$color12" flex={1}>待上传</Text>
              </XStack>
              <XStack marginBottom="$2">
                <Text fontSize="$2" color="$color10" width={100}>公证日期：</Text>
                <Text fontSize="$2" color="$color12" flex={1}>待上传</Text>
              </XStack>
              <Pressable>
                <View
                  borderWidth={1}
                  borderColor="$primary"
                  borderRadius="$4"
                  paddingVertical="$2"
                >
                  <XStack justifyContent="center" alignItems="center" gap="$1">
                    <Upload size={18} color={primaryColor} />
                    <Text fontSize="$3" color="$primary" fontWeight="500">上传公证书扫描件</Text>
                  </XStack>
                </View>
              </Pressable>
            </View>
          </YStack>
        )}
      </View>
    </YStack>
  );

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!will) {
    return (
      <View flex={1} backgroundColor="$background">
        {/* TitleBar */}
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
            <Pressable onPress={() => navigation.goBack()}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
              >
                <ArrowLeft size={24} color={color12} />
              </View>
            </Pressable>
            <Text fontSize="$5" fontWeight="600" color="$color12">
              遗嘱审核与公证
            </Text>
            <View width={40} />
          </XStack>
        </View>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <AlertCircle size={48} color={errorColor} />
          <Text fontSize="$4" color="$color10" marginTop="$2">未找到遗嘱信息</Text>
        </YStack>
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
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            遗嘱审核与公证
          </Text>
          <View width={40} />
        </XStack>
      </View>

      {/* 标签页切换 */}
      <XStack backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('review')}>
          <XStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderBottomWidth={2}
            borderBottomColor={activeTab === 'review' ? '$primary' : 'transparent'}
          >
            <FileText size={18} color={activeTab === 'review' ? primaryColor : color10} />
            <Text
              fontSize="$3"
              color={activeTab === 'review' ? '$primary' : '$color10'}
              fontWeight={activeTab === 'review' ? '600' : '400'}
              marginLeft="$1"
            >
              律师审核
            </Text>
          </XStack>
        </Pressable>

        <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('notary')}>
          <XStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderBottomWidth={2}
            borderBottomColor={activeTab === 'notary' ? '$primary' : 'transparent'}
          >
            <ShieldCheck size={18} color={activeTab === 'notary' ? primaryColor : color10} />
            <Text
              fontSize="$3"
              color={activeTab === 'notary' ? '$primary' : '$color10'}
              fontWeight={activeTab === 'notary' ? '600' : '400'}
              marginLeft="$1"
            >
              公证服务
            </Text>
          </XStack>
        </Pressable>
      </XStack>

      {/* 标签页内容 */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {activeTab === 'review' ? renderReviewTab() : renderNotaryTab()}
      </ScrollView>
    </View>
  );
};

export default WillReviewScreen;
