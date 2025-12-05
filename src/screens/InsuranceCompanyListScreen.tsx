import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Linking } from 'react-native';
import { View, Text, XStack, YStack, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building2,
  Star,
  Phone,
  ExternalLink,
  TrendingUp,
  Shield,
  Award,
  ChevronRight,
} from 'lucide-react-native';
import { getCompanies } from '@/services/insuranceProductService';
import { InsuranceCompany } from '@/types/insurance';

const InsuranceCompanyListScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const result = await getCompanies();
      setCompanies(result);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallCompany = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleVisitWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const getRatingColor = (rating: string) => {
    const ratingMap: { [key: string]: string | undefined } = {
      'AAA': successColor,
      'AA': primaryColor,
      'A': warningColor,
    };
    return ratingMap[rating] || color10;
  };

  const renderCompanyCard = (company: InsuranceCompany) => {
    const ratingColor = getRatingColor(company.rating);

    return (
      <Pressable
        key={company.id}
        onPress={() => {
          // Can navigate to company detail if needed
        }}
      >
        <View
          marginBottom="$3"
          backgroundColor="$color2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$color5"
          overflow="hidden"
        >
          {/* Header */}
          <View padding="$4">
            <XStack alignItems="center" gap="$3" marginBottom="$3">
              <View
                width={56}
                height={56}
                borderRadius={8}
                backgroundColor={`${primaryColor}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Building2 size={28} color={primaryColor} />
              </View>
              <YStack flex={1}>
                <Text fontSize="$5" fontWeight="700" color="$color12">
                  {company.name}
                </Text>
                <Text fontSize="$2" color="$color10" marginTop="$1">
                  成立 {company.foundedYear}年 · 注册资本{company.registeredCapital}亿
                </Text>
              </YStack>
              <View
                paddingHorizontal="$2"
                paddingVertical="$1"
                backgroundColor={`${ratingColor}20`}
                borderRadius="$2"
              >
                <Text fontSize="$3" fontWeight="700" color={ratingColor}>
                  {company.rating}
                </Text>
              </View>
            </XStack>

            {/* Stats Grid */}
            <YStack gap="$2" marginBottom="$3">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  偿付能力充足率
                </Text>
                <Text fontSize="$3" fontWeight="600" color={successColor}>
                  {company.solvencyRatio}%
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  平均理赔时效
                </Text>
                <Text fontSize="$3" fontWeight="600" color={primaryColor}>
                  {company.avgClaimDays}天
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  获赔率
                </Text>
                <Text fontSize="$3" fontWeight="600" color={successColor}>
                  {company.claimSuccessRate}%
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">
                  在售产品
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {company.productCount}款
                </Text>
              </XStack>
            </YStack>

            {/* Description */}
            <Text fontSize="$3" color="$color12" lineHeight={22} marginBottom="$3">
              {company.description}
            </Text>

            {/* Actions */}
            <XStack gap="$2">
              <Pressable
                onPress={() => handleCallCompany(company.customerServicePhone)}
                style={{ flex: 1 }}
              >
                <View
                  height={40}
                  borderRadius="$2"
                  backgroundColor="$color5"
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <Phone size={16} color={color12} />
                    <Text fontSize="$3" fontWeight="600" color="$color12">
                      {company.customerServicePhone}
                    </Text>
                  </XStack>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleVisitWebsite(company.website)}
                style={{ flex: 1 }}
              >
                <View
                  height={40}
                  borderRadius="$2"
                  backgroundColor={primaryColor}
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <ExternalLink size={16} color="white" />
                    <Text fontSize="$3" fontWeight="600" color="white">
                      官网
                    </Text>
                  </XStack>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate('InsuranceProductList' as never, {
                    company: company.name,
                  } as never);
                }}
              >
                <View
                  height={40}
                  paddingHorizontal="$3"
                  borderRadius="$2"
                  backgroundColor="$color2"
                  borderWidth={1.5}
                  borderColor={primaryColor}
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$1">
                    <Text fontSize="$3" fontWeight="600" color={primaryColor}>
                      产品
                    </Text>
                    <ChevronRight size={16} color={primaryColor} />
                  </XStack>
                </View>
              </Pressable>
            </XStack>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
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
            保险公司
          </Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View
          marginHorizontal="$4"
          marginTop="$4"
          padding="$3"
          backgroundColor="#E0F2FE"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={primaryColor}
        >
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
            选择保险公司的要点
          </Text>
          <Text fontSize="$2" color="$color12" lineHeight={20}>
            • 关注偿付能力充足率（≥100%为合格）{'\\n'}
            • 了解理赔时效和获赔率{'\\n'}
            • 查看银保监会评级（AAA最高）{'\\n'}
            • 优先选择知名度高、口碑好的公司
          </Text>
        </View>

        {/* Stats Summary */}
        <View marginHorizontal="$4" marginTop="$4" marginBottom="$4">
          <XStack gap="$2">
            <View flex={1} padding="$3" backgroundColor="$color2" borderRadius="$3">
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <Building2 size={16} color={primaryColor} />
                <Text fontSize="$2" color="$color10">
                  保险公司
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={primaryColor}>
                {companies.length}
              </Text>
            </View>

            <View flex={1} padding="$3" backgroundColor="$color2" borderRadius="$3">
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <Shield size={16} color={successColor} />
                <Text fontSize="$2" color="$color10">
                  在售产品
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={successColor}>
                {companies.reduce((sum, c) => sum + c.productCount, 0)}
              </Text>
            </View>
          </XStack>
        </View>

        {/* Company List */}
        <View paddingHorizontal="$4">
          {loading ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$color10">
                加载中...
              </Text>
            </View>
          ) : companies.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Building2 size={48} color={color10} />
              <Text fontSize="$4" color="$color12" marginTop="$4">
                暂无保险公司信息
              </Text>
            </View>
          ) : (
            <>
              {companies.map(company => renderCompanyCard(company))}
            </>
          )}
        </View>

        {/* Tips */}
        <View
          marginHorizontal="$4"
          marginBottom="$4"
          padding="$3"
          backgroundColor="#FFF7ED"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={warningColor}
        >
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
            温馨提示
          </Text>
          <Text fontSize="$2" color="$color12" lineHeight={20}>
            所有展示的保险公司均受中国银保监会监管，保单合法有效。选择保险产品时，应综合考虑保障内容、保费、理赔服务等多方面因素。
          </Text>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsuranceCompanyListScreen;
