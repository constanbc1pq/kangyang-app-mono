import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Award,
  MessageCircle,
  Phone,
  Video,
  Home,
  CheckCircle,
  MapPin,
} from 'lucide-react-native';
import { getAdvisorById } from '@/services/insuranceAdvisorService';
import { InsuranceAdvisor } from '@/types/insurance';

type RouteParams = {
  InsuranceAdvisorDetail: {
    advisorId: string;
  };
};

const InsuranceAdvisorDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceAdvisorDetail'>>();
  const { advisorId } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [loading, setLoading] = useState(true);
  const [advisor, setAdvisor] = useState<InsuranceAdvisor | null>(null);

  useEffect(() => {
    loadAdvisorDetail();
  }, [advisorId]);

  const loadAdvisorDetail = async () => {
    try {
      setLoading(true);
      const result = await getAdvisorById(advisorId);
      setAdvisor(result);
    } catch (error) {
      console.error('加载顾问详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOnlineStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return successColor;
      case 'busy':
        return warningColor;
      case 'offline':
        return color10;
      default:
        return color10;
    }
  };

  const getOnlineStatusLabel = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'busy':
        return '忙碌中';
      case 'offline':
        return '离线';
      default:
        return '未知';
    }
  };

  const handleConsultation = (type: 'text' | 'phone' | 'video' | 'home_visit') => {
    console.log('🔔 handleConsultation clicked:', type);
    if (!advisor) {
      console.log('❌ No advisor data');
      return;
    }

    const typeLabels = {
      text: '图文咨询',
      phone: '电话咨询',
      video: '视频咨询',
      home_visit: '上门服务',
    };

    const screenMap = {
      text: 'InsuranceTextConsultation',
      phone: 'InsurancePhoneConsultation',
      video: 'InsuranceVideoConsultation',
      home_visit: 'InsuranceHomeVisit',
    };

    console.log('✅ Preparing to navigate for:', typeLabels[type]);
    console.log('📍 Screen:', screenMap[type]);
    console.log('📍 Advisor:', advisor.id, advisor.name);

    // 在Web环境下，Alert可能不工作，直接导航
    // 如果是原生环境，可以加上确认对话框
    if (Platform.OS === 'web') {
      // Web环境：直接导航
      console.log('🌐 Web environment - navigating directly');
      navigation.navigate(screenMap[type] as never, {
        advisorId: advisor.id,
        advisorName: advisor.name,
      } as never);
    } else {
      // 原生环境：显示确认对话框
      console.log('📱 Native environment - showing alert');
      Alert.alert(
        `${typeLabels[type]}`,
        `您即将向${advisor.name}顾问发起${typeLabels[type]}，该服务完全免费。\n\n平均响应时间：${advisor.avgResponseTime}`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '继续',
            onPress: () => {
              console.log('📍 Alert confirmed - Navigating to:', screenMap[type]);
              navigation.navigate(screenMap[type] as never, {
                advisorId: advisor.id,
                advisorName: advisor.name,
              } as never);
            },
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={primaryColor} />
        <Text marginTop="$3" color="$color10">
          加载中...
        </Text>
      </View>
    );
  }

  if (!advisor) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$color10">
          顾问不存在
        </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text fontSize="$3" color="$primary" marginTop="$3">
            返回列表
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header - 标准居中TitleBar */}
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
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            顾问详情
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顾问基本信息 */}
        <YStack padding="$2.5" backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
          <XStack gap="$3" marginBottom="$3">
            {/* 头像 */}
            <View
              width={80}
              height={80}
              borderRadius={40}
              overflow="hidden"
              backgroundColor="$color5"
            >
              <View
                width={80}
                height={80}
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$8" color="white" fontWeight="600">
                  {advisor.name.charAt(0)}
                </Text>
              </View>
            </View>

            {/* 基本信息 */}
            <YStack flex={1} gap="$2">
              <XStack alignItems="center" gap="$2">
                <Text fontSize="$6" fontWeight="700" color="$color12">
                  {advisor.name}
                </Text>
                <View
                  width={10}
                  height={10}
                  borderRadius={5}
                  backgroundColor={getOnlineStatusColor(advisor.onlineStatus)}
                />
              </XStack>

              <Text fontSize="$3" color="$color10">
                {advisor.organization}
              </Text>

              <Text fontSize="$3" color="$color10">
                工号：{advisor.employeeId}
              </Text>

              <XStack alignItems="center" gap="$2">
                <Text fontSize="$3" color={getOnlineStatusColor(advisor.onlineStatus)}>
                  {getOnlineStatusLabel(advisor.onlineStatus)}
                </Text>
                <Text fontSize="$3" color="$color10">
                  · 平均{advisor.avgResponseTime}响应
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* 专业资质 */}
          <YStack gap="$2" marginBottom="$3">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              专业资质
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {advisor.certifications.map((cert, idx) => (
                <View
                  key={idx}
                  backgroundColor={`${successColor}20`}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$10"
                >
                  <XStack alignItems="center" gap="$1">
                    <Award size={14} color={successColor} />
                    <Text fontSize="$3" color="$success" fontWeight="600">
                      {cert}
                    </Text>
                  </XStack>
                </View>
              ))}
            </XStack>
          </YStack>

          {/* 服务数据 */}
          <XStack justifyContent="space-around" paddingVertical="$2">
            <YStack alignItems="center">
              <Text fontSize="$6" fontWeight="700" color="$primary">
                {advisor.yearsOfExperience}年
              </Text>
              <Text fontSize="$2" color="$color10">
                从业经验
              </Text>
            </YStack>
            <YStack alignItems="center">
              <Text fontSize="$6" fontWeight="700" color="$primary">
                {advisor.clientsServed}
              </Text>
              <Text fontSize="$2" color="$color10">
                服务客户
              </Text>
            </YStack>
            <YStack alignItems="center">
              <Text fontSize="$6" fontWeight="700" color="$warning">
                {advisor.satisfactionRate}%
              </Text>
              <Text fontSize="$2" color="$color10">
                满意度
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* 擅长领域 */}
        <YStack padding="$2.5" backgroundColor="$color2" marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            擅长领域
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {advisor.specialties.map((specialty, idx) => (
              <View
                key={idx}
                backgroundColor="$color4"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$10"
              >
                <Text fontSize="$3" color="$color12">
                  {specialty}
                </Text>
              </View>
            ))}
          </XStack>
        </YStack>

        {/* 服务区域 */}
        <YStack padding="$2.5" backgroundColor="$color2" marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            服务区域
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {advisor.serviceCities.map((city, idx) => (
              <View
                key={idx}
                backgroundColor={`${primaryColor}15`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$10"
              >
                <XStack alignItems="center" gap="$1">
                  <MapPin size={14} color={primaryColor} />
                  <Text fontSize="$3" color="$primary">
                    {city}
                  </Text>
                </XStack>
              </View>
            ))}
          </XStack>
        </YStack>

        {/* 顾问介绍 */}
        <YStack padding="$2.5" backgroundColor="$color2" marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            顾问介绍
          </Text>
          <Text fontSize="$3" color="$color12" lineHeight={24}>
            {advisor.introduction}
          </Text>
        </YStack>

        {/* 成功案例 */}
        <YStack padding="$2.5" backgroundColor="$color2" marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            成功案例
          </Text>
          <YStack gap="$2">
            {advisor.successCases.map((caseItem, idx) => (
              <XStack key={idx} gap="$2" alignItems="flex-start">
                <CheckCircle size={16} color={successColor} style={{ marginTop: 2 }} />
                <Text flex={1} fontSize="$3" color="$color12" lineHeight={22}>
                  {caseItem}
                </Text>
              </XStack>
            ))}
          </YStack>
        </YStack>

        {/* 咨询方式 */}
        <YStack padding="$2.5" backgroundColor="$color2" marginTop="$2" marginBottom="$6">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            咨询方式（完全免费）
          </Text>
          <YStack gap="$2">
            {/* 图文咨询 */}
            <Pressable onPress={() => handleConsultation('text')}>
              <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2" backgroundColor="$background">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$3" alignItems="center">
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${primaryColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <MessageCircle size={24} color={primaryColor} />
                    </View>
                    <YStack>
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        图文咨询
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        发送文字和图片，顾问在线解答
                      </Text>
                    </YStack>
                  </XStack>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor="$primary"
                  >
                    <Text fontSize="$3" color="white" fontWeight="500">
                      免费
                    </Text>
                  </View>
                </XStack>
              </View>
            </Pressable>

            {/* 电话咨询 */}
            <Pressable onPress={() => handleConsultation('phone')}>
              <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2" backgroundColor="$background">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$3" alignItems="center">
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${successColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Phone size={24} color={successColor} />
                    </View>
                    <YStack>
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        电话咨询
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        预约电话，一对一深度沟通
                      </Text>
                    </YStack>
                  </XStack>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor="$success"
                  >
                    <Text fontSize="$3" color="white" fontWeight="500">
                      免费
                    </Text>
                  </View>
                </XStack>
              </View>
            </Pressable>

            {/* 视频咨询 */}
            <Pressable onPress={() => handleConsultation('video')}>
              <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2" backgroundColor="$background">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$3" alignItems="center">
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${warningColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Video size={24} color={warningColor} />
                    </View>
                    <YStack>
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        视频咨询
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        视频通话，面对面交流更清晰
                      </Text>
                    </YStack>
                  </XStack>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor="$warning"
                  >
                    <Text fontSize="$3" color="white" fontWeight="500">
                      免费
                    </Text>
                  </View>
                </XStack>
              </View>
            </Pressable>

            {/* 上门服务 */}
            <Pressable onPress={() => handleConsultation('home_visit')}>
              <View borderWidth={1} borderColor="$color5" borderRadius="$5" padding="$2" backgroundColor="$background">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$3" alignItems="center">
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={`${primaryColor}15`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Home size={24} color={primaryColor} />
                    </View>
                    <YStack>
                      <Text fontSize="$4" fontWeight="600" color="$color12">
                        上门服务
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        预约顾问上门，提供便捷服务
                      </Text>
                    </YStack>
                  </XStack>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor="$primary"
                  >
                    <Text fontSize="$3" color="white" fontWeight="500">
                      免费
                    </Text>
                  </View>
                </XStack>
              </View>
            </Pressable>
          </YStack>
        </YStack>

        {/* 底部占位，避免被按钮遮挡 */}
        <View height={120} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
        elevation={10}
        zIndex={999}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        paddingBottom={insets.bottom}
      >
        <XStack padding="$2.5">
          <Pressable
            onPress={() => {
              console.log('🟢 Button pressed!');
              handleConsultation('text');
            }}
            style={{ flex: 1 }}
          >
            <View
              height={48}
              borderRadius="$10"
              backgroundColor="$primary"
              justifyContent="center"
              alignItems="center"
            >
              <XStack alignItems="center" gap="$2">
                <MessageCircle size={20} color="white" />
                <Text color="white" fontSize="$4" fontWeight="500">
                  立即咨询（免费）
                </Text>
              </XStack>
            </View>
          </Pressable>
        </XStack>
      </View>
    </View>
  );
};

export default InsuranceAdvisorDetailScreen;
