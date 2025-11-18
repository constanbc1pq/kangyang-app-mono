/**
 * 问诊详情界面
 * Consultation Detail Screen
 *
 * Phase 23.5: 问诊详情页
 * - 问诊基本信息（时间/类型/时长）
 * - 主诉与症状详情
 * - 医生诊断意见
 * - 处方详情（药品+剂量+用法）
 * - 检查建议列表
 * - 医嘱与注意事项
 * - 复诊时间提醒
 * - 问诊评价
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button, Avatar } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Video,
  FileText,
  Download,
  Share2,
  Star,
  AlertCircle,
  CheckCircle2,
  Pill,
  TestTube,
  Bell,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

interface CheckupItem {
  name: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface ConsultationDetail {
  id: string;
  type: 'video' | 'in_person' | 'phone';
  date: string;
  time: string;
  duration: number;
  doctor: {
    name: string;
    title: string;
    hospital: string;
    avatar: string;
  };
  chiefComplaint: string;
  symptomDuration: string;
  accompanyingSymptoms: string[];
  diagnosis: string;
  diagnosisDetails: string;
  prescriptions: Medication[];
  checkupRecommendations: CheckupItem[];
  medicalAdvice: string[];
  followUpDate?: string;
  followUpReminder?: string;
  rating?: number;
  ratingComment?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const MOCK_CONSULTATION: ConsultationDetail = {
  id: 'cons_001',
  type: 'video',
  date: '2024-11-10',
  time: '14:30',
  duration: 45,
  doctor: {
    name: '张伟',
    title: '主任医师 · 心血管内科',
    hospital: '北京协和医院',
    avatar: 'https://via.placeholder.com/100',
  },
  chiefComplaint: '近期感觉胸闷气短，偶尔心悸，运动后症状加重',
  symptomDuration: '持续约2周',
  accompanyingSymptoms: ['轻微头晕', '偶尔失眠', '食欲下降'],
  diagnosis: '疑似心律不齐',
  diagnosisDetails:
    '根据您的症状描述和既往病史，初步判断可能是心律不齐引起的症状。建议进行心电图和24小时动态心电图检查以明确诊断。目前症状较轻，暂时不需要特殊处理，但需要注意休息，避免剧烈运动。',
  prescriptions: [
    {
      name: '稳心颗粒',
      dosage: '9g/袋',
      frequency: '每日3次',
      duration: '7天',
      notes: '饭后温水冲服',
    },
    {
      name: '辅酶Q10软胶囊',
      dosage: '10mg/粒',
      frequency: '每日2次',
      duration: '14天',
      notes: '早晚各一次，餐后服用',
    },
  ],
  checkupRecommendations: [
    {
      name: '心电图检查',
      reason: '明确是否存在心律失常',
      priority: 'high',
    },
    {
      name: '24小时动态心电图',
      reason: '全面评估心脏节律情况',
      priority: 'high',
    },
    {
      name: '血常规+甲状腺功能',
      reason: '排除代谢性因素',
      priority: 'medium',
    },
  ],
  medicalAdvice: [
    '保持规律作息，避免熬夜',
    '避免剧烈运动，可进行适度散步',
    '减少咖啡因摄入，戒烟限酒',
    '保持心情舒畅，避免过度焦虑',
    '如出现持续胸痛、呼吸困难等症状，请立即就医',
  ],
  followUpDate: '2024-11-24',
  followUpReminder: '建议2周后复诊，带上检查报告',
  rating: 5,
  ratingComment: '张医生非常专业，解释详细，让我安心了很多。',
  status: 'completed',
};

const ConsultationDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { consultationId } = route.params || { consultationId: 'cons_001' };
  const [consultation] = useState<ConsultationDetail>(MOCK_CONSULTATION);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(consultation.rating || 0);
  const [ratingComment, setRatingComment] = useState(
    consultation.ratingComment || ''
  );

  const getTypeLabel = (type: string) => {
    const labels = {
      video: '视频问诊',
      in_person: '到院面诊',
      phone: '电话问诊',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: '#FF5252',
      medium: '#FF9800',
      low: '#4CAF50',
    };
    return colors[priority as keyof typeof colors] || '#999';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: '紧急',
      medium: '建议',
      low: '可选',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `问诊记录\n日期：${consultation.date} ${consultation.time}\n医生：${consultation.doctor.name}\n诊断：${consultation.diagnosis}`,
        title: '问诊记录分享',
      });
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  const handleDownload = () => {
    Alert.alert('导出成功', '问诊记录已导出为PDF格式');
  };

  const submitRating = () => {
    if (userRating === 0) {
      Alert.alert('提示', '请选择评分');
      return;
    }
    Alert.alert('评价成功', '感谢您的评价');
    setShowRating(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="600">
            问诊详情
          </Text>
          <XStack space="$3">
            <TouchableOpacity onPress={handleShare}>
              <Share2 size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload}>
              <Download size={22} color={COLORS.text} />
            </TouchableOpacity>
          </XStack>
        </XStack>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Basic Information */}
        <View
          padding="$4"
          backgroundColor="$surface"
          borderRadius="$4"
          marginBottom="$4"
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <View
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor="#E8F5E9"
              borderRadius="$2"
            >
              <Text fontSize={13} color="#2E7D32" fontWeight="600">
                {consultation.status === 'completed' ? '已完成' : '进行中'}
              </Text>
            </View>
            <XStack space="$2" alignItems="center">
              <Clock size={16} color="$gray11" />
              <Text fontSize={14} color="$gray11">
                {consultation.duration}分钟
              </Text>
            </XStack>
          </XStack>

          <XStack space="$3" marginBottom="$3">
            <Avatar circular size="$5">
              <Avatar.Image src={consultation.doctor.avatar} />
              <Avatar.Fallback backgroundColor="$blue8">
                <Text color="white">医</Text>
              </Avatar.Fallback>
            </Avatar>
            <YStack flex={1}>
              <Text fontSize={17} fontWeight="600">
                {consultation.doctor.name}
              </Text>
              <Text fontSize={14} color="$gray11">
                {consultation.doctor.title}
              </Text>
              <Text fontSize={13} color="$gray10">
                {consultation.doctor.hospital}
              </Text>
            </YStack>
          </XStack>

          <YStack space="$2">
            <XStack space="$2" alignItems="center">
              <Calendar size={16} color="$gray11" />
              <Text fontSize={14} color="$gray11">
                {consultation.date} {consultation.time}
              </Text>
            </XStack>
            <XStack space="$2" alignItems="center">
              <Video size={16} color="$gray11" />
              <Text fontSize={14} color="$gray11">
                {getTypeLabel(consultation.type)}
              </Text>
            </XStack>
          </YStack>
        </View>

        {/* Chief Complaint */}
        <View marginBottom="$4">
          <Text fontSize={17} fontWeight="600" marginBottom="$3">
            主诉症状
          </Text>
          <View
            padding="$4"
            backgroundColor="$surface"
            borderRadius="$4"
            borderLeftWidth={4}
            borderLeftColor={COLORS.primary}
          >
            <Text fontSize={15} lineHeight={24}>
              {consultation.chiefComplaint}
            </Text>
            <Text fontSize={14} color="$gray11" marginTop="$2">
              持续时间：{consultation.symptomDuration}
            </Text>
            {consultation.accompanyingSymptoms.length > 0 && (
              <YStack marginTop="$3">
                <Text fontSize={14} fontWeight="600" marginBottom="$2">
                  伴随症状：
                </Text>
                {consultation.accompanyingSymptoms.map((symptom, idx) => (
                  <Text key={idx} fontSize={14} color="$gray11" marginBottom="$1">
                    • {symptom}
                  </Text>
                ))}
              </YStack>
            )}
          </View>
        </View>

        {/* Diagnosis */}
        <View marginBottom="$4">
          <Text fontSize={17} fontWeight="600" marginBottom="$3">
            诊断意见
          </Text>
          <View
            padding="$4"
            backgroundColor="#E8F5FF"
            borderRadius="$4"
            borderWidth={1}
            borderColor="#90CAF9"
          >
            <Text fontSize={16} fontWeight="600" color="#1976D2" marginBottom="$2">
              {consultation.diagnosis}
            </Text>
            <Text fontSize={14} lineHeight={22} color={COLORS.text}>
              {consultation.diagnosisDetails}
            </Text>
          </View>
        </View>

        {/* Prescriptions */}
        {consultation.prescriptions.length > 0 && (
          <View marginBottom="$4">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Text fontSize={17} fontWeight="600">
                电子处方
              </Text>
              <TouchableOpacity>
                <Text fontSize={14} color={COLORS.primary}>
                  导出处方
                </Text>
              </TouchableOpacity>
            </XStack>
            <YStack space="$3">
              {consultation.prescriptions.map((med, idx) => (
                <View
                  key={idx}
                  padding="$4"
                  backgroundColor="#E8F5E9"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="#A5D6A7"
                >
                  <XStack space="$2" marginBottom="$2">
                    <Pill size={20} color="#2E7D32" />
                    <Text fontSize={16} fontWeight="600" color="#2E7D32">
                      {med.name}
                    </Text>
                  </XStack>
                  <YStack space="$1">
                    <Text fontSize={14} color={COLORS.text}>
                      <Text fontWeight="600">用量：</Text>
                      {med.dosage}
                    </Text>
                    <Text fontSize={14} color={COLORS.text}>
                      <Text fontWeight="600">频次：</Text>
                      {med.frequency}
                    </Text>
                    <Text fontSize={14} color={COLORS.text}>
                      <Text fontWeight="600">疗程：</Text>
                      {med.duration}
                    </Text>
                    {med.notes && (
                      <Text fontSize={13} color="$gray11" marginTop="$1">
                        💡 {med.notes}
                      </Text>
                    )}
                  </YStack>
                </View>
              ))}
            </YStack>
          </View>
        )}

        {/* Checkup Recommendations */}
        {consultation.checkupRecommendations.length > 0 && (
          <View marginBottom="$4">
            <Text fontSize={17} fontWeight="600" marginBottom="$3">
              检查建议
            </Text>
            <YStack space="$2">
              {consultation.checkupRecommendations.map((item, idx) => (
                <View
                  key={idx}
                  padding="$4"
                  backgroundColor="$surface"
                  borderRadius="$4"
                  borderLeftWidth={4}
                  borderLeftColor={getPriorityColor(item.priority)}
                >
                  <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                    <XStack space="$2" alignItems="center" flex={1}>
                      <TestTube size={18} color={getPriorityColor(item.priority)} />
                      <Text fontSize={15} fontWeight="600">
                        {item.name}
                      </Text>
                    </XStack>
                    <View
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      backgroundColor={getPriorityColor(item.priority) + '20'}
                      borderRadius="$2"
                    >
                      <Text
                        fontSize={12}
                        color={getPriorityColor(item.priority)}
                        fontWeight="600"
                      >
                        {getPriorityLabel(item.priority)}
                      </Text>
                    </View>
                  </XStack>
                  <Text fontSize={14} color="$gray11">
                    {item.reason}
                  </Text>
                </View>
              ))}
            </YStack>
          </View>
        )}

        {/* Medical Advice */}
        {consultation.medicalAdvice.length > 0 && (
          <View marginBottom="$4">
            <Text fontSize={17} fontWeight="600" marginBottom="$3">
              医嘱与注意事项
            </Text>
            <View
              padding="$4"
              backgroundColor="#FFF4E6"
              borderRadius="$4"
              borderWidth={1}
              borderColor="#FFE0B2"
            >
              <YStack space="$2">
                {consultation.medicalAdvice.map((advice, idx) => (
                  <XStack key={idx} space="$2" alignItems="flex-start">
                    <CheckCircle2
                      size={18}
                      color="#FF9800"
                      style={{ marginTop: 2 }}
                    />
                    <Text fontSize={14} flex={1} lineHeight={22}>
                      {advice}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </View>
          </View>
        )}

        {/* Follow-up Reminder */}
        {consultation.followUpDate && (
          <View marginBottom="$4">
            <View
              padding="$4"
              backgroundColor="#E3F2FD"
              borderRadius="$4"
              borderWidth={1}
              borderColor="#90CAF9"
            >
              <XStack space="$2" alignItems="flex-start">
                <Bell size={20} color="#1976D2" style={{ marginTop: 2 }} />
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color="#1976D2" marginBottom="$1">
                    复诊提醒
                  </Text>
                  <Text fontSize={14} color={COLORS.text}>
                    建议复诊时间：{consultation.followUpDate}
                  </Text>
                  {consultation.followUpReminder && (
                    <Text fontSize={14} color="$gray11" marginTop="$1">
                      {consultation.followUpReminder}
                    </Text>
                  )}
                </YStack>
              </XStack>
            </View>
          </View>
        )}

        {/* Rating Section */}
        {consultation.rating && !showRating ? (
          <View marginBottom="$4">
            <Text fontSize={17} fontWeight="600" marginBottom="$3">
              我的评价
            </Text>
            <View padding="$4" backgroundColor="$surface" borderRadius="$4">
              <XStack space="$1" marginBottom="$2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    color="#FFB300"
                    fill={star <= consultation.rating! ? '#FFB300' : 'none'}
                  />
                ))}
              </XStack>
              {consultation.ratingComment && (
                <Text fontSize={14} color="$gray11">
                  {consultation.ratingComment}
                </Text>
              )}
            </View>
          </View>
        ) : !consultation.rating ? (
          <View marginBottom="$4">
            <View padding="$4" backgroundColor="$surface" borderRadius="$4">
              <Text fontSize={16} fontWeight="600" marginBottom="$3">
                问诊评价
              </Text>
              <XStack space="$2" marginBottom="$3" justifyContent="center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                    <Star
                      size={32}
                      color="#FFB300"
                      fill={star <= userRating ? '#FFB300' : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </XStack>
              <Button
                size="$4"
                backgroundColor={COLORS.primary}
                color="white"
                borderRadius="$3"
                onPress={submitRating}
              >
                提交评价
              </Button>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Footer Actions */}
      {consultation.status === 'completed' && (
        <View
          padding="$4"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          backgroundColor="$background"
        >
          <XStack space="$3">
            <Button
              flex={1}
              size="$4"
              backgroundColor="$surface"
              color={COLORS.text}
              borderRadius="$3"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => navigation.navigate('DoctorChat', {
                doctorId: 'doctor_001',
                doctorName: consultation.doctor.name,
              })}
            >
              咨询医生
            </Button>
            <Button
              flex={1}
              size="$4"
              backgroundColor={COLORS.primary}
              color="white"
              borderRadius="$3"
              onPress={() => navigation.navigate('BookConsultation', {
                doctorId: 'doctor_001',
                doctorName: consultation.doctor.name,
              })}
            >
              预约复诊
            </Button>
          </XStack>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ConsultationDetailScreen;
