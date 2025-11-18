import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, Linking } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
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
import { COLORS } from '@/constants/app';
import { getCompanies } from '@/services/insuranceProductService';
import { InsuranceCompany } from '@/types/insurance';

const InsuranceCompanyListScreen: React.FC = () => {
  const navigation = useNavigation();
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
    const ratingMap: { [key: string]: string } = {
      'AAA': COLORS.success,
      'AA': COLORS.primary,
      'A': COLORS.warning,
    };
    return ratingMap[rating] || COLORS.textSecondary;
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
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
        >
          {/* Header */}
          <View padding="$4">
            <XStack alignItems="center" gap="$3" marginBottom="$3">
              <View
                width={56}
                height={56}
                borderRadius={8}
                backgroundColor={`${COLORS.primary}15`}
                justifyContent="center"
                alignItems="center"
              >
                <Building2 size={28} color={COLORS.primary} />
              </View>
              <YStack flex={1}>
                <Text fontSize="$5" fontWeight="700" color="$text">
                  {company.name}
                </Text>
                <Text fontSize="$2" color="$textSecondary" marginTop="$1">
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
                <Text fontSize="$3" color="$textSecondary">
                  偿付能力充足率
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                  {company.solvencyRatio}%
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  平均理赔时效
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                  {company.avgClaimDays}天
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  获赔率
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                  {company.claimSuccessRate}%
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">
                  在售产品
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {company.productCount}款
                </Text>
              </XStack>
            </YStack>

            {/* Description */}
            <Text fontSize="$3" color="$text" lineHeight={22} marginBottom="$3">
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
                  backgroundColor="$borderColor"
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$2">
                    <Phone size={16} color={COLORS.text} />
                    <Text fontSize="$3" fontWeight="600" color="$text">
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
                  backgroundColor={COLORS.primary}
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
                  backgroundColor="$surface"
                  borderWidth={1.5}
                  borderColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap="$1">
                    <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                      产品
                    </Text>
                    <ChevronRight size={16} color={COLORS.primary} />
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
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          保险公司
        </Text>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View
          marginHorizontal="$4"
          marginTop="$4"
          padding="$3"
          backgroundColor="#E0F2FE"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.primary}
        >
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
            选择保险公司的要点
          </Text>
          <Text fontSize="$2" color="$text" lineHeight={20}>
            • 关注偿付能力充足率（≥100%为合格）{'\\n'}
            • 了解理赔时效和获赔率{'\\n'}
            • 查看银保监会评级（AAA最高）{'\\n'}
            • 优先选择知名度高、口碑好的公司
          </Text>
        </View>

        {/* Stats Summary */}
        <View marginHorizontal="$4" marginTop="$4" marginBottom="$4">
          <XStack gap="$2">
            <View flex={1} padding="$3" backgroundColor="$surface" borderRadius="$3">
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <Building2 size={16} color={COLORS.primary} />
                <Text fontSize="$2" color="$textSecondary">
                  保险公司
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                {companies.length}
              </Text>
            </View>

            <View flex={1} padding="$3" backgroundColor="$surface" borderRadius="$3">
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <Shield size={16} color={COLORS.success} />
                <Text fontSize="$2" color="$textSecondary">
                  在售产品
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="700" color={COLORS.success}>
                {companies.reduce((sum, c) => sum + c.productCount, 0)}
              </Text>
            </View>
          </XStack>
        </View>

        {/* Company List */}
        <View paddingHorizontal="$4">
          {loading ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                加载中...
              </Text>
            </View>
          ) : companies.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Building2 size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
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
          borderLeftColor={COLORS.warning}
        >
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
            温馨提示
          </Text>
          <Text fontSize="$2" color="$text" lineHeight={20}>
            所有展示的保险公司均受中国银保监会监管，保单合法有效。选择保险产品时，应综合考虑保障内容、保费、理赔服务等多方面因素。
          </Text>
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsuranceCompanyListScreen;
