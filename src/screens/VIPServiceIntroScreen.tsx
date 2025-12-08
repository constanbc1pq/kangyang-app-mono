/**
 * VIPServiceIntroScreen - VIP专属服务介绍页
 * 展示可订阅的专属服务列表和权益说明
 * 遵循 CLAUDE.md 页面布局规范
 */

import React from 'react';
import { YStack, XStack, Text, View, ScrollView, Card, useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Stethoscope,
  Scale,
  Check,
  ChevronRight,
  Sparkles,
  Shield,
  Clock,
  MessageCircle,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

// 服务配置
const VIP_SERVICES = [
  {
    id: 'privateDoctor',
    name: '私人医生',
    icon: Stethoscope,
    description: '专属医生一对一健康管理',
    price: '¥49,800/年起',
    colorKey: 'success' as const,
    benefits: [
      '7×24小时健康咨询',
      '专属医生一对一服务',
      '定期健康评估报告',
      '绿色就医通道',
      '慢病管理方案',
    ],
    targetScreen: 'PrivateDoctorList',
  },
  {
    id: 'legalService',
    name: '法律顾问',
    icon: Scale,
    description: '专属律师全方位法律保障',
    price: '¥4,980/年起',
    colorKey: 'primary' as const,
    benefits: [
      '专属律师在线咨询',
      '法律文书审核',
      '遗嘱规划服务',
      '家事法律指导',
      '维权协助服务',
    ],
    targetScreen: 'LegalMembership',
  },
];

export const VIPServiceIntroScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;

  const getServiceColor = (colorKey: 'success' | 'primary') => {
    return colorKey === 'success' ? successColor : primaryColor;
  };

  const handleServicePress = (targetScreen: string) => {
    navigation.navigate(targetScreen as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      {/* 标题栏 */}
      <TitleBar title="专属服务" />

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$2.5" gap="$2">
          {/* 顶部介绍区域 */}
          <Card
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            backgroundColor={`${warningColor}10`}
          >
            <XStack gap="$2" alignItems="flex-start">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={`${warningColor}20`}
                justifyContent="center"
                alignItems="center"
              >
                <Sparkles size={24} color={warningColor} />
              </View>
              <YStack flex={1} gap="$1">
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  什么是专属服务？
                </Text>
                <Text fontSize="$3" color="$color10" lineHeight={20}>
                  专属服务是康养APP提供的一对一高端服务。订阅后，您将拥有专属的医生或律师，
                  随时为您提供个性化的健康管理和法律咨询服务。
                </Text>
              </YStack>
            </XStack>
          </Card>

          {/* 服务特点 */}
          <XStack gap="$2" marginTop="$1">
            <View flex={1} alignItems="center" gap="$1">
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Shield size={20} color={primaryColor} />
              </View>
              <Text fontSize="$2" color="$color12" fontWeight="500">
                专属专人
              </Text>
              <Text fontSize="$1" color="$color10" textAlign="center">
                一对一服务
              </Text>
            </View>
            <View flex={1} alignItems="center" gap="$1">
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Clock size={20} color={primaryColor} />
              </View>
              <Text fontSize="$2" color="$color12" fontWeight="500">
                随时响应
              </Text>
              <Text fontSize="$1" color="$color10" textAlign="center">
                优先处理
              </Text>
            </View>
            <View flex={1} alignItems="center" gap="$1">
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <MessageCircle size={20} color={primaryColor} />
              </View>
              <Text fontSize="$2" color="$color12" fontWeight="500">
                深度沟通
              </Text>
              <Text fontSize="$1" color="$color10" textAlign="center">
                了解需求
              </Text>
            </View>
          </XStack>

          {/* 服务列表标题 */}
          <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
            可订阅的专属服务
          </Text>

          {/* 服务卡片列表 */}
          {VIP_SERVICES.map((service) => {
            const ServiceIcon = service.icon;
            const serviceColor = getServiceColor(service.colorKey);

            return (
              <Card
                key={service.id}
                padding="$2"
                borderRadius="$5"
                borderWidth={1}
                borderColor="$color5"
                backgroundColor="$color2"
              >
                {/* 服务头部 */}
                <XStack gap="$2" alignItems="center" marginBottom="$2">
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
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      {service.name}
                    </Text>
                    <Text fontSize="$3" color="$color10">
                      {service.description}
                    </Text>
                  </YStack>
                  <Text fontSize="$3" fontWeight="600" color={serviceColor}>
                    {service.price}
                  </Text>
                </XStack>

                {/* 权益列表 */}
                <YStack gap="$1.5" marginBottom="$2">
                  {service.benefits.map((benefit, index) => (
                    <XStack key={index} gap="$1.5" alignItems="center">
                      <Check size={14} color={serviceColor} />
                      <Text fontSize="$3" color="$color12">
                        {benefit}
                      </Text>
                    </XStack>
                  ))}
                </YStack>

                {/* 了解更多按钮 */}
                <Pressable onPress={() => handleServicePress(service.targetScreen)}>
                  <View
                    backgroundColor={serviceColor}
                    borderRadius="$10"
                    paddingVertical="$2"
                    paddingHorizontal="$4"
                    alignItems="center"
                  >
                    <XStack gap="$1" alignItems="center">
                      <Text fontSize="$3" color="white" fontWeight="500">
                        了解详情
                      </Text>
                      <ChevronRight size={16} color="white" />
                    </XStack>
                  </View>
                </Pressable>
              </Card>
            );
          })}

          {/* 会员折扣提示 */}
          <Card
            padding="$2"
            borderRadius="$5"
            borderWidth={1}
            borderColor="$color5"
            backgroundColor="$color4"
            marginTop="$1"
          >
            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="500" color="$color12">
                会员专享折扣
              </Text>
              <Text fontSize="$3" color="$color10" lineHeight={18}>
                · 白金会员订阅专属服务享9折优惠
              </Text>
              <Text fontSize="$3" color="$color10" lineHeight={18}>
                · 钻石会员订阅专属服务享8折优惠
              </Text>
            </YStack>
          </Card>

          {/* 底部安全区域 */}
          <View height="$4" />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VIPServiceIntroScreen;
