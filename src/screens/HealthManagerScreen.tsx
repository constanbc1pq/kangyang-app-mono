/**
 * 健康管家服务界面（尊享版专属）
 * Health Manager Screen
 *
 * Phase 25.1: 健康管家服务
 * - 管家信息卡片（照片+姓名+背景+联系方式）
 * - 管家服务范围说明
 * - 快速联系按钮（电话/微信）
 * - 服务记录列表
 * - 预约管家服务表单
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button, Avatar } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Briefcase,
  Heart,
  FileText,
  Users,
  Activity,
  Pill,
  ClipboardList,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface HealthManager {
  id: string;
  name: string;
  avatar: string;
  title: string;
  experience: string;
  certifications: string[];
  specialties: string[];
  phone: string;
  wechat: string;
  introduction: string;
  servicesCount: number;
  rating: number;
}

interface ServiceRecord {
  id: string;
  date: string;
  serviceType: string;
  description: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  notes?: string;
}

interface ServiceScope {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const MOCK_MANAGER: HealthManager = {
  id: 'manager_001',
  name: '李静',
  avatar: 'https://via.placeholder.com/100',
  title: '高级健康管家',
  experience: '8年医疗服务经验',
  certifications: ['国家二级健康管理师', '高级营养师', '护理学学士'],
  specialties: ['慢病管理', '康复指导', '健康咨询'],
  phone: '138****8888',
  wechat: 'healthmanager_lj',
  introduction:
    '李静，毕业于北京协和医学院护理系，拥有8年三甲医院工作经验和5年健康管理经验。擅长慢性病管理、康复指导和健康咨询，曾为100+高端客户提供专业健康管家服务。',
  servicesCount: 127,
  rating: 4.9,
};

const SERVICE_SCOPES: ServiceScope[] = [
  {
    icon: Calendar,
    title: '日程管理',
    description: '协助安排就医、体检、复诊等日程，提供提醒服务',
    color: '#2196F3',
  },
  {
    icon: Users,
    title: '陪诊服务',
    description: '陪同就医，协助挂号、取药、检查等流程',
    color: '#4CAF50',
  },
  {
    icon: FileText,
    title: '资料整理',
    description: '整理病历、检查报告，建立完善的健康档案',
    color: '#FF9800',
  },
  {
    icon: Briefcase,
    title: '协调转诊',
    description: '联系专家、协调转诊、预约专家号',
    color: '#9C27B0',
  },
  {
    icon: Activity,
    title: '体检安排',
    description: '定制体检方案，预约体检机构，解读体检报告',
    color: '#FF5252',
  },
  {
    icon: Pill,
    title: '用药管理',
    description: '用药提醒、药品管理、配药协调',
    color: '#00BCD4',
  },
  {
    icon: ClipboardList,
    title: '生活指导',
    description: '饮食建议、运动计划、康复指导',
    color: '#8BC34A',
  },
];

const MOCK_RECORDS: ServiceRecord[] = [
  {
    id: 'sr1',
    date: '2024-11-20',
    serviceType: '陪诊服务',
    description: '陪同前往协和医院心内科复诊',
    status: 'completed',
    notes: '已协助完成挂号、检查和取药',
  },
  {
    id: 'sr2',
    date: '2024-11-15',
    serviceType: '体检安排',
    description: '协调安排全面体检',
    status: 'completed',
    notes: '已预约美兆体检中心，11月28日上午',
  },
  {
    id: 'sr3',
    date: '2024-11-25',
    serviceType: '专家会诊',
    description: '协调北京协和神经内科专家会诊',
    status: 'scheduled',
  },
];

const HealthManagerScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [manager] = useState<HealthManager>(MOCK_MANAGER);
  const [records] = useState<ServiceRecord[]>(MOCK_RECORDS);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [serviceRequest, setServiceRequest] = useState('');

  const handleCall = () => {
    Alert.alert('拨打电话', `确定拨打 ${manager.phone}？`, [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '拨打',
        onPress: () => {
          Linking.openURL(`tel:${manager.phone.replace(/\*/g, '')}`);
        },
      },
    ]);
  };

  const handleWeChatContact = () => {
    Alert.alert('微信联系', `微信号：${manager.wechat}\n\n已复制到剪贴板`);
    // Clipboard.setString(manager.wechat);
  };

  const handleSubmitRequest = () => {
    if (!serviceRequest.trim()) {
      Alert.alert('提示', '请填写服务需求');
      return;
    }

    Alert.alert('预约成功', '您的服务需求已提交，健康管家将在30分钟内与您联系', [
      {
        text: '确定',
        onPress: () => {
          setServiceRequest('');
          setShowBookingForm(false);
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: '#4CAF50',
      in_progress: '#2196F3',
      scheduled: '#FF9800',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: '已完成',
      in_progress: '进行中',
      scheduled: '已预约',
    };
    return labels[status as keyof typeof labels] || status;
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
            我的健康管家
          </Text>
          <View width={24} />
        </XStack>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Manager Info Card */}
        <View padding="$5" backgroundColor="#F5F5F5">
          <View
            backgroundColor="white"
            borderRadius="$4"
            padding="$4"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
            elevation={3}
          >
            <XStack space="$4" marginBottom="$4">
              <Avatar circular size="$8">
                <Avatar.Image src={manager.avatar} />
                <Avatar.Fallback backgroundColor="$blue8">
                  <Text color="white" fontSize={24}>
                    李
                  </Text>
                </Avatar.Fallback>
              </Avatar>
              <YStack flex={1}>
                <XStack space="$2" alignItems="center" marginBottom="$1">
                  <Text fontSize={20} fontWeight="700">
                    {manager.name}
                  </Text>
                  <View
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    backgroundColor="#FFD700"
                    borderRadius="$2"
                  >
                    <Text fontSize={11} fontWeight="600" color="#8B4513">
                      尊享版
                    </Text>
                  </View>
                </XStack>
                <Text fontSize={15} color="$gray11" marginBottom="$1">
                  {manager.title}
                </Text>
                <Text fontSize={14} color="$gray10">
                  {manager.experience}
                </Text>
                <XStack space="$3" marginTop="$2">
                  <XStack space="$1" alignItems="center">
                    <Award size={16} color="#FF9800" />
                    <Text fontSize={13} color="$gray11">
                      服务{manager.servicesCount}次
                    </Text>
                  </XStack>
                  <XStack space="$1" alignItems="center">
                    <Text fontSize={16} color="#FFB300">
                      ★
                    </Text>
                    <Text fontSize={13} color="$gray11">
                      {manager.rating}分
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            </XStack>

            {/* Quick Contact Buttons */}
            <XStack space="$3">
              <Button
                flex={1}
                size="$4"
                backgroundColor={COLORS.primary}
                color="white"
                borderRadius="$3"
                onPress={handleCall}
                icon={<Phone size={18} color="white" />}
              >
                电话联系
              </Button>
              <Button
                flex={1}
                size="$4"
                backgroundColor="#07C160"
                color="white"
                borderRadius="$3"
                onPress={handleWeChatContact}
                icon={<MessageCircle size={18} color="white" />}
              >
                微信联系
              </Button>
            </XStack>
          </View>
        </View>

        {/* Manager Introduction */}
        <View padding="$4">
          <Text fontSize={17} fontWeight="600" marginBottom="$3">
            管家简介
          </Text>
          <View padding="$4" backgroundColor="$surface" borderRadius="$4">
            <Text fontSize={14} lineHeight={24} color={COLORS.text}>
              {manager.introduction}
            </Text>
            {manager.certifications.length > 0 && (
              <YStack space="$2" marginTop="$3">
                <Text fontSize={14} fontWeight="600">
                  专业资质：
                </Text>
                {manager.certifications.map((cert, idx) => (
                  <XStack key={idx} space="$2" alignItems="center">
                    <CheckCircle2 size={16} color="#4CAF50" />
                    <Text fontSize={14} color="$gray11">
                      {cert}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            )}
          </View>
        </View>

        {/* Service Scope */}
        <View padding="$4" paddingTop="$0">
          <Text fontSize={17} fontWeight="600" marginBottom="$3">
            服务范围
          </Text>
          <YStack space="$3">
            {SERVICE_SCOPES.map((scope, idx) => {
              const Icon = scope.icon;
              return (
                <View
                  key={idx}
                  padding="$4"
                  backgroundColor="$surface"
                  borderRadius="$4"
                  borderLeftWidth={4}
                  borderLeftColor={scope.color}
                >
                  <XStack space="$3" alignItems="flex-start">
                    <View
                      width={40}
                      height={40}
                      backgroundColor={scope.color + '20'}
                      borderRadius={20}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Icon size={22} color={scope.color} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize={16} fontWeight="600" marginBottom="$1">
                        {scope.title}
                      </Text>
                      <Text fontSize={14} color="$gray11" lineHeight={20}>
                        {scope.description}
                      </Text>
                    </YStack>
                  </XStack>
                </View>
              );
            })}
          </YStack>
        </View>

        {/* Service Records */}
        <View padding="$4" paddingTop="$0">
          <Text fontSize={17} fontWeight="600" marginBottom="$3">
            服务记录
          </Text>
          <YStack space="$3">
            {records.map((record) => (
              <View
                key={record.id}
                padding="$4"
                backgroundColor="$surface"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                  <YStack flex={1}>
                    <XStack space="$2" alignItems="center" marginBottom="$1">
                      <Text fontSize={16} fontWeight="600">
                        {record.serviceType}
                      </Text>
                      <View
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        backgroundColor={getStatusColor(record.status)}
                        borderRadius="$2"
                      >
                        <Text fontSize={11} color="white" fontWeight="600">
                          {getStatusLabel(record.status)}
                        </Text>
                      </View>
                    </XStack>
                    <Text fontSize={14} color="$gray11" marginBottom="$1">
                      {record.description}
                    </Text>
                    {record.notes && (
                      <Text fontSize={13} color="$gray10" marginTop="$1">
                        备注：{record.notes}
                      </Text>
                    )}
                  </YStack>
                </XStack>
                <XStack space="$1" alignItems="center">
                  <Clock size={14} color="$gray10" />
                  <Text fontSize={13} color="$gray10">
                    {record.date}
                  </Text>
                </XStack>
              </View>
            ))}
          </YStack>
        </View>

        {/* Service Request Form */}
        {showBookingForm && (
          <View padding="$4" paddingTop="$0">
            <View
              padding="$4"
              backgroundColor="#E3F2FD"
              borderRadius="$4"
              borderWidth={1}
              borderColor="#90CAF9"
            >
              <Text fontSize={17} fontWeight="600" marginBottom="$3">
                预约管家服务
              </Text>
              <View
                backgroundColor="white"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                padding="$3"
                marginBottom="$3"
              >
                <RNTextInput
                  value={serviceRequest}
                  onChangeText={setServiceRequest}
                  placeholder="请详细描述您的服务需求..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={5}
                  maxLength={500}
                  style={{
                    fontSize: 15,
                    color: COLORS.text,
                    minHeight: 100,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
              <Text fontSize={12} color="$gray10" marginBottom="$3">
                {serviceRequest.length}/500
              </Text>
              <XStack space="$3">
                <Button
                  flex={1}
                  size="$4"
                  backgroundColor="$surface"
                  color={COLORS.text}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  onPress={() => setShowBookingForm(false)}
                >
                  取消
                </Button>
                <Button
                  flex={1}
                  size="$4"
                  backgroundColor={COLORS.primary}
                  color="white"
                  borderRadius="$3"
                  onPress={handleSubmitRequest}
                >
                  提交需求
                </Button>
              </XStack>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Action */}
      {!showBookingForm && (
        <View
          padding="$4"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          backgroundColor="$background"
        >
          <Button
            size="$5"
            backgroundColor={COLORS.primary}
            color="white"
            borderRadius="$3"
            fontWeight="600"
            onPress={() => setShowBookingForm(true)}
            icon={<Calendar size={20} color="white" />}
          >
            预约管家服务
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HealthManagerScreen;
