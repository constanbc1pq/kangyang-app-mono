/**
 * 场景化服务卡片组件
 * 按生活场景展示服务，用场景化标题触达用户痛点
 */

import React, { useState } from 'react';
import { View, Text, YStack, XStack, useTheme } from 'tamagui';
import { Pressable, ScrollView } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

export type ServiceCategory = 'all' | 'daily_life' | 'health_management' | 'wealth_planning';

interface ServiceDetail {
  id: string;
  category: ServiceCategory;
  scenarioTitle: string; // "子女不在身边？我们来照顾您"
  serviceName: string; // "营养配餐 + 闪送到家"
  valuePoints: string[]; // 核心价值点
  suitableFor: string; // 适用人群
  price: string;
  priceUnit: string; // "/周" | "/月"
  socialProof: string; // "已售1.2万份" | "好评率99%"
  icon: string;
  primaryCTA: string; // "查看套餐"
  secondaryCTA: string; // "免费咨询营养师"
  targetScreen: string;
  consultScreen?: string;
}

interface ScenarioServiceCardProps {
  services: ServiceDetail[];
  onServicePress: (screen: string, params?: any) => void;
  onConsultPress: (screen: string, params?: any) => void;
}

const ServiceCardItem: React.FC<{
  service: ServiceDetail;
  onServicePress: (screen: string) => void;
  onConsultPress?: (screen: string) => void;
}> = ({ service, onServicePress, onConsultPress }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;

  return (
    <View
      backgroundColor="$color2"
      borderRadius="$5"
      padding="$2"
      borderWidth={1}
      borderColor="$color5"
      marginBottom="$2"
    >
      <YStack gap="$3">
        {/* 场景化标题 */}
        <XStack alignItems="center" gap="$3">
          <Text fontSize={32}>{service.icon}</Text>
          <YStack flex={1}>
            <Text fontSize="$5" fontWeight="700" color="$color12" lineHeight={24}>
              {service.scenarioTitle}
            </Text>
            <Text fontSize="$3" color="$color9" fontWeight="600" marginTop="$1">
              {service.serviceName}
            </Text>
          </YStack>
        </XStack>

        {/* 核心价值点 */}
        <YStack gap="$2">
          {service.valuePoints.map((point, index) => (
            <XStack key={index} alignItems="flex-start" gap="$2">
              <CheckCircle
                size={16}
                color={successColor}
                style={{ marginTop: 2 }}
              />
              <Text flex={1} fontSize="$3" color="$color12" lineHeight={20}>
                {point}
              </Text>
            </XStack>
          ))}
        </YStack>

        {/* 适用人群 */}
        <View
          backgroundColor="$color3"
          padding="$2"
          borderRadius="$2"
          borderLeftWidth={3}
          borderLeftColor={primaryColor}
        >
          <Text fontSize="$2" color="$color10">
            适合：{service.suitableFor}
          </Text>
        </View>

        {/* 价格和社交证明 */}
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <XStack alignItems="baseline" gap="$1">
              <Text fontSize="$2" color="$color9">
                ¥
              </Text>
              <Text fontSize="$7" fontWeight="700" color="$color9">
                {service.price}
              </Text>
              <Text fontSize="$3" color="$color10">
                {service.priceUnit}起
              </Text>
            </XStack>
            <Text fontSize="$2" color="$color10" marginTop="$1">
              {service.socialProof}
            </Text>
          </YStack>

          <XStack gap="$2">
            {service.consultScreen && onConsultPress && (
              <Pressable onPress={() => onConsultPress(service.consultScreen!)}>
                <View
                  paddingHorizontal="$2.5"
                  paddingVertical="$2"
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor={primaryColor}
                >
                  <Text color="$color9" fontSize="$2" fontWeight="600">
                    {service.secondaryCTA}
                  </Text>
                </View>
              </Pressable>
            )}

            <Pressable onPress={() => onServicePress(service.targetScreen)}>
              <View
                paddingHorizontal="$2.5"
                paddingVertical="$2"
                borderRadius="$10"
                backgroundColor={primaryColor}
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {service.primaryCTA}
                </Text>
              </View>
            </Pressable>
          </XStack>
        </XStack>
      </YStack>
    </View>
  );
};

export const ScenarioServiceSection: React.FC<ScenarioServiceCardProps> = ({
  services,
  onServicePress,
  onConsultPress,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'daily_life', label: '日常生活' },
    { id: 'health_management', label: '健康管理' },
    { id: 'wealth_planning', label: '资产规划' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <View marginBottom="$2">
      <YStack gap="$3">
        {/* 标题 */}
        <View paddingHorizontal="$2.5">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            按需选择
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$1">
            找到适合您的服务方案
          </Text>
        </View>

        {/* 分类标签 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <XStack gap="$2">
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id as ServiceCategory)}
              >
                <View
                  paddingHorizontal="$2.5"
                  paddingVertical="$2"
                  borderRadius="$6"
                  backgroundColor={
                    selectedCategory === cat.id ? primaryColor : '$color3'
                  }
                  borderWidth={1}
                  borderColor={
                    selectedCategory === cat.id ? primaryColor : '$color5'
                  }
                >
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={selectedCategory === cat.id ? 'white' : '$color12'}
                  >
                    {cat.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </ScrollView>

        {/* 服务卡片列表 */}
        <View paddingHorizontal="$2.5">
          <YStack>
            {filteredServices.map((service) => (
              <ServiceCardItem
                key={service.id}
                service={service}
                onServicePress={onServicePress}
                onConsultPress={onConsultPress}
              />
            ))}
          </YStack>
        </View>
      </YStack>
    </View>
  );
};

/**
 * Mock服务数据
 */
export const mockScenarioServices: ServiceDetail[] = [
  // 日常生活场景
  {
    id: 'nutrition_meal',
    category: 'daily_life',
    scenarioTitle: '子女不在身边？我们来照顾您',
    serviceName: '营养配餐 + 闪送到家',
    valuePoints: [
      '营养师定制食谱，三高糖尿病专属方案',
      '每日新鲜食材配送，准时送达到家',
      '适合独居老人、慢病调理人群',
    ],
    suitableFor: '独居老人、慢病调理、术后康复',
    price: '298',
    priceUnit: '/周',
    socialProof: '已售1.2万份',
    icon: '🍱',
    primaryCTA: '查看套餐',
    secondaryCTA: '咨询营养师',
    targetScreen: 'NutritionService',
    consultScreen: 'NutritionService',
  },
  // 健康管理场景
  {
    id: 'private_doctor',
    category: 'health_management',
    scenarioTitle: '24小时健康守护，比子女更了解您',
    serviceName: '私人医生服务',
    valuePoints: [
      '专属家庭医生团队，24小时在线咨询',
      '健康档案持续管理，慢病监测预警',
      '就医绿色通道，三甲医院优先预约',
    ],
    suitableFor: '慢病患者、术后康复、健康管理需求',
    price: '399',
    priceUnit: '/月',
    socialProof: '好评率99%',
    icon: '👨‍⚕️',
    primaryCTA: '了解详情',
    secondaryCTA: '预约医生',
    targetScreen: 'PrivateDoctorList',
    consultScreen: 'PrivateDoctorList',
  },
  {
    id: 'elderly_service',
    category: 'health_management',
    scenarioTitle: '专业养老服务，让晚年更有尊严',
    serviceName: '居家养老服务',
    valuePoints: [
      '专业护理团队，日常生活全方位照护',
      '健康监测服务，异常及时预警',
      '陪伴聊天服务，关注心理健康',
    ],
    suitableFor: '失能半失能老人、独居老人、术后护理',
    price: '499',
    priceUnit: '/月',
    socialProof: '已服务560+家庭',
    icon: '🏡',
    primaryCTA: '查看方案',
    secondaryCTA: '预约探访',
    targetScreen: 'ElderlyService',
    consultScreen: 'ElderlyService',
  },
  // 资产规划场景
  {
    id: 'legal_insurance',
    category: 'wealth_planning',
    scenarioTitle: '为家人的未来，做好准备',
    serviceName: '遗嘱法律 + 保险规划',
    valuePoints: [
      '资深律师一对一咨询服务',
      '专业保险顾问规划方案',
      '财产分配建议，资产保障方案',
    ],
    suitableFor: '有传承需求、资产保障、家庭规划',
    price: '咨询',
    priceUnit: '',
    socialProof: '已服务3500+人',
    icon: '📜',
    primaryCTA: '立即咨询',
    secondaryCTA: 'AI智能规划',
    targetScreen: 'LegalServiceHome',
    consultScreen: 'LegalServiceHome',
  },
];
