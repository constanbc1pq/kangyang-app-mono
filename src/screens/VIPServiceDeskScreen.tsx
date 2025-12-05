/**
 * VIPServiceDeskScreen - VIP服务台详情页
 * 展示用户订阅的专属服务，并解释VIP身份含义
 * 遵循 CLAUDE.md 页面布局规范
 */

import React, { useState, useEffect, useCallback } from 'react';
import { YStack, XStack, Text, View, ScrollView, Card, useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  Crown,
  Stethoscope,
  Scale,
  Award,
  MessageCircle,
  Phone,
  Video,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react-native';
import {
  getActiveSubscriptions,
  ActiveSubscription,
} from '@/services/userDataService';

export const VIPServiceDeskScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [activeServices, setActiveServices] = useState<ActiveSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [])
  );

  const loadServices = async () => {
    setLoading(true);
    const services = await getActiveSubscriptions();
    setActiveServices(services);
    setLoading(false);
  };

  // 获取服务图标
  const getServiceIcon = (type: ActiveSubscription['type']) => {
    switch (type) {
      case 'privateDoctor':
        return Stethoscope;
      case 'legalService':
        return Scale;
      case 'expertCert':
        return Award;
      default:
        return Crown;
    }
  };

  // 获取服务颜色
  const getServiceColor = (type: ActiveSubscription['type']) => {
    switch (type) {
      case 'privateDoctor':
        return theme.success?.val;
      case 'legalService':
        return theme.primary?.val;
      case 'expertCert':
        return theme.warning?.val;
      default:
        return primaryColor;
    }
  };

  // 处理服务点击
  const handleServicePress = (service: ActiveSubscription) => {
    switch (service.type) {
      case 'privateDoctor':
        navigation.navigate('PrivateDoctorServiceDesk' as never);
        break;
      case 'legalService':
        navigation.navigate('LegalServiceHome' as never);
        break;
      default:
        break;
    }
  };

  // 渲染服务卡片
  const renderServiceCard = (service: ActiveSubscription) => {
    const ServiceIcon = getServiceIcon(service.type);
    const serviceColor = getServiceColor(service.type);

    return (
      <Pressable key={service.type} onPress={() => handleServicePress(service)}>
        <Card
          padding="$2"
          borderRadius="$5"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$2"
          backgroundColor="$color2"
        >
          <XStack gap="$2" alignItems="flex-start">
            {/* 服务图标 */}
            <View
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={`${serviceColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <ServiceIcon size={24} color={serviceColor} />
            </View>

            {/* 服务信息 */}
            <YStack flex={1} gap="$1">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$1.5" alignItems="center">
                  <Text fontSize="$4" fontWeight="600" color="$color12">
                    {service.name}
                  </Text>
                  {service.packageLevel && (
                    <View
                      backgroundColor={`${serviceColor}20`}
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$10"
                    >
                      <Text fontSize={10} color={serviceColor} fontWeight="500">
                        {service.packageLevel}
                      </Text>
                    </View>
                  )}
                </XStack>
                {service.isOnline !== undefined && (
                  <XStack gap="$1" alignItems="center">
                    <View
                      width={8}
                      height={8}
                      borderRadius={4}
                      backgroundColor={service.isOnline ? '$success' : '$color8'}
                    />
                    <Text fontSize="$2" color={service.isOnline ? '$success' : '$color10'}>
                      {service.isOnline ? '在线' : '离线'}
                    </Text>
                  </XStack>
                )}
              </XStack>

              {/* 专属服务人员 */}
              {(service.doctorName || service.lawyerName) && (
                <Text fontSize="$3" color="$color10">
                  专属{service.doctorName ? '医生' : '律师'}：
                  {service.doctorName || service.lawyerName}
                </Text>
              )}

              {/* 到期时间 */}
              <XStack gap="$1" alignItems="center">
                <Clock size={12} color={theme.color10?.val} />
                <Text fontSize="$2" color="$color10">
                  剩余 {service.daysRemaining} 天
                </Text>
              </XStack>

              {/* 快捷操作 */}
              {service.type !== 'expertCert' && (
                <XStack gap="$2" marginTop="$1">
                  <Pressable onPress={() => handleServicePress(service)}>
                    <XStack
                      gap="$1"
                      alignItems="center"
                      backgroundColor="$color4"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                    >
                      <MessageCircle size={14} color={primaryColor} />
                      <Text fontSize="$2" color="$primary" fontWeight="500">
                        在线咨询
                      </Text>
                    </XStack>
                  </Pressable>
                  <Pressable>
                    <XStack
                      gap="$1"
                      alignItems="center"
                      backgroundColor="$color4"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                    >
                      <Phone size={14} color={primaryColor} />
                      <Text fontSize="$2" color="$primary" fontWeight="500">
                        电话预约
                      </Text>
                    </XStack>
                  </Pressable>
                </XStack>
              )}
            </YStack>

            {/* 进入箭头 */}
            <ChevronRight size={20} color={theme.color10?.val} />
          </XStack>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      {/* 标题栏 */}
      <XStack
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <View width={40} height={40} justifyContent="center" alignItems="flex-start">
            <ArrowLeft size={24} color={theme.color12?.val} />
          </View>
        </Pressable>
        <Text flex={1} textAlign="center" fontSize="$5" fontWeight="600" color="$color12">
          专属服务台
        </Text>
        <View width={40} />
      </XStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* VIP身份说明区域 */}
          <Card
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            backgroundColor="$color2"
          >
            <XStack gap="$2" alignItems="flex-start">
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Info size={20} color={primaryColor} />
              </View>
              <YStack flex={1} gap="$1">
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  关于专属服务
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={20}>
                  您已订阅专属服务，这里是您的服务台。订阅期间，您可以随时联系专属服务人员，享受一对一的专业服务。
                </Text>
              </YStack>
            </XStack>
          </Card>

          {/* 服务列表标题 */}
          <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              我的订阅服务
            </Text>
            <Text fontSize="$3" color="$color10">
              共 {activeServices.length} 项
            </Text>
          </XStack>

          {/* 服务列表 */}
          {loading ? (
            <Card padding="$4" borderRadius="$5" borderWidth={1} borderColor="$color5">
              <Text textAlign="center" color="$color10">
                加载中...
              </Text>
            </Card>
          ) : activeServices.length === 0 ? (
            <Card
              padding="$4"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$color2"
            >
              <YStack alignItems="center" gap="$2">
                <Crown size={48} color={theme.color8?.val} />
                <Text fontSize="$4" color="$color10" textAlign="center">
                  暂无订阅服务
                </Text>
                <Text fontSize="$3" color="$color10" textAlign="center">
                  订阅私人医生或法律服务后，可在此处快速访问
                </Text>
              </YStack>
            </Card>
          ) : (
            activeServices.map(renderServiceCard)
          )}

          {/* 服务说明 */}
          {activeServices.length > 0 && (
            <Card
              padding="$2"
              borderRadius="$5"
              borderWidth={1}
              borderColor="$color5"
              backgroundColor="$color4"
              marginTop="$1"
            >
              <YStack gap="$1.5">
                <Text fontSize="$3" fontWeight="500" color="$color12">
                  服务时间
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={18}>
                  · 在线咨询：每日 8:00 - 22:00
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={18}>
                  · 电话服务：需提前预约，服务人员会在约定时间回电
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={18}>
                  · 紧急情况请直接拨打 120 或前往医院
                </Text>
              </YStack>
            </Card>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VIPServiceDeskScreen;
