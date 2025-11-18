import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Linking, Alert } from 'react-native';
import { View, Text, XStack, YStack, Card } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Shield,
  FileText,
  MessageCircle,
  Share2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { INSURANCE_CATEGORY_LABELS, INSURANCE_CATEGORY_COLORS } from '@/constants/insurance';
import { getProductById, getCompanyById } from '@/services/insuranceProductService';
import { InsuranceProduct, InsuranceCompany } from '@/types/insurance';

type RouteParams = {
  InsuranceProductDetail: {
    productId: string;
  };
};

const InsuranceProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceProductDetail'>>();
  const { productId } = route.params;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<InsuranceProduct | null>(null);
  const [company, setCompany] = useState<InsuranceCompany | null>(null);

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const productRes = await getProductById(productId);
      if (productRes) {
        setProduct(productRes);
        const companyRes = await getCompanyById(productRes.companyId);
        setCompany(companyRes);
      }
    } catch (error) {
      console.error('加载产品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExternalPurchase = async () => {
    if (!product?.purchaseUrl) {
      Alert.alert('提示', '购买链接暂不可用');
      return;
    }

    Alert.alert(
      '前往保险公司官网',
      '您将离开康养APP，前往保险公司官网购买产品。\n\n重要提示：\n1. 请仔细阅读产品条款\n2. 如实告知健康状况\n3. 保留好投保凭证\n\n如有疑问，可咨询我们的专业顾问。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '继续',
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(product.purchaseUrl);
              if (supported) {
                await Linking.openURL(product.purchaseUrl);
              } else {
                Alert.alert('错误', '无法打开购买链接');
              }
            } catch (error) {
              console.error('打开链接失败:', error);
              Alert.alert('错误', '打开链接失败，请稍后重试');
            }
          },
        },
      ]
    );
  };

  const handleConsultAdvisor = () => {
    navigation.navigate('InsuranceAdvisorList' as never);
  };

  const handleShare = () => {
    Alert.alert('分享', '分享功能开发中');
  };

  if (loading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text marginTop="$3" color="$textSecondary">
          加载中...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$textSecondary">
          产品不存在
        </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text fontSize="$3" color={COLORS.primary} marginTop="$3">
            返回列表
          </Text>
        </Pressable>
      </View>
    );
  }

  const categoryColor = INSURANCE_CATEGORY_COLORS[product.category];

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
          产品详情
        </Text>
        <View flex={1} />
        <Pressable onPress={handleShare}>
          <Share2 size={24} color={COLORS.text} />
        </Pressable>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <YStack padding="$4" backgroundColor="$surface" borderBottomWidth={1} borderBottomColor="$borderColor">
          <XStack gap="$2" marginBottom="$2">
            <View
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              backgroundColor={`${categoryColor}20`}
            >
              <Text fontSize="$2" color={categoryColor} fontWeight="600">
                {INSURANCE_CATEGORY_LABELS[product.category]}
              </Text>
            </View>
            <XStack alignItems="center" gap="$1">
              <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
              <Text fontSize="$2" color="$text" fontWeight="600">
                {product.rating}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                ({product.reviewCount}条评价)
              </Text>
            </XStack>
          </XStack>

          <Text fontSize="$6" fontWeight="700" color="$text" marginBottom="$2">
            {product.name}
          </Text>

          <Text fontSize="$3" color="$textSecondary" lineHeight={22} marginBottom="$3">
            {product.description}
          </Text>

          <XStack gap="$2" flexWrap="wrap" marginBottom="$3">
            {product.highlights.map((highlight, idx) => (
              <View
                key={idx}
                backgroundColor={`${COLORS.primary}15`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={COLORS.primary}>
                  {highlight}
                </Text>
              </View>
            ))}
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize="$2" color="$textSecondary">
                起保费用
              </Text>
              <XStack alignItems="baseline" gap="$1">
                <Text fontSize="$2" color={COLORS.primary}>
                  ¥
                </Text>
                <Text fontSize="$8" fontWeight="700" color={COLORS.primary}>
                  {product.premiumStartFrom}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  起/年
                </Text>
              </XStack>
            </YStack>
            <YStack alignItems="flex-end">
              <Text fontSize="$2" color="$textSecondary">
                本月已售
              </Text>
              <Text fontSize="$5" fontWeight="600" color="$text">
                {product.monthSales} 份
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Company Info */}
        {company && (
          <YStack padding="$4" backgroundColor="$surface" marginTop="$2">
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              承保公司
            </Text>
            <Card bordered padding="$3" backgroundColor="$background">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                    {company.name}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary" numberOfLines={2}>
                    {company.description}
                  </Text>
                  <XStack gap="$3" marginTop="$2">
                    <YStack>
                      <Text fontSize="$2" color="$textSecondary">
                        偿付能力
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                        {company.solvencyRatio}
                      </Text>
                    </YStack>
                    <YStack>
                      <Text fontSize="$2" color="$textSecondary">
                        理赔时效
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color="$text">
                        {company.claimTimeAvg}
                      </Text>
                    </YStack>
                    <YStack>
                      <Text fontSize="$2" color="$textSecondary">
                        获赔率
                      </Text>
                      <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                        {company.claimSuccessRate}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
              </XStack>
            </Card>
          </YStack>
        )}

        {/* Coverage Details */}
        <YStack padding="$4" backgroundColor="$surface" marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            保障详情
          </Text>
          <YStack gap="$3">
            {product.coverageDetails
              .filter(item => item.type === 'primary')
              .length > 0 && (
              <YStack>
                <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
                  主要保障
                </Text>
                {product.coverageDetails
                  .filter(item => item.type === 'primary')
                  .map((item, idx) => (
                    <YStack key={idx} marginBottom="$3" backgroundColor="$background" padding="$3" borderRadius="$2">
                      <XStack gap="$2" alignItems="flex-start" marginBottom="$1">
                        <CheckCircle size={16} color={COLORS.success} style={{ marginTop: 2 }} />
                        <Text flex={1} fontSize="$3" fontWeight="600" color="$text" lineHeight={20}>
                          {item.name}
                        </Text>
                      </XStack>
                      <Text fontSize="$2" color="$textSecondary" marginBottom="$1" marginLeft={24}>
                        {item.description}
                      </Text>
                      {item.coverageAmount && (
                        <XStack marginLeft={24} gap="$3" marginTop="$1">
                          <Text fontSize="$2" color="$text">
                            保额: <Text fontWeight="600">{item.coverageAmount}</Text>
                          </Text>
                          {item.claimRatio && (
                            <Text fontSize="$2" color="$text">
                              赔付: <Text fontWeight="600">{item.claimRatio}</Text>
                            </Text>
                          )}
                        </XStack>
                      )}
                      {item.waitingPeriod && (
                        <Text fontSize="$2" color="$textSecondary" marginLeft={24} marginTop="$1">
                          等待期: {item.waitingPeriod}
                        </Text>
                      )}
                    </YStack>
                  ))}
              </YStack>
            )}

            {product.coverageDetails
              .filter(item => item.type === 'additional')
              .length > 0 && (
              <YStack marginTop="$2">
                <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
                  可选保障
                </Text>
                {product.coverageDetails
                  .filter(item => item.type === 'additional')
                  .map((item, idx) => (
                    <YStack key={idx} marginBottom="$3" backgroundColor="$background" padding="$3" borderRadius="$2">
                      <XStack gap="$2" alignItems="flex-start" marginBottom="$1">
                        <CheckCircle size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
                        <Text flex={1} fontSize="$3" fontWeight="600" color="$text" lineHeight={20}>
                          {item.name}
                        </Text>
                      </XStack>
                      <Text fontSize="$2" color="$textSecondary" marginBottom="$1" marginLeft={24}>
                        {item.description}
                      </Text>
                      {item.coverageAmount && (
                        <XStack marginLeft={24} gap="$3" marginTop="$1">
                          <Text fontSize="$2" color="$text">
                            保额: <Text fontWeight="600">{item.coverageAmount}</Text>
                          </Text>
                          {item.claimRatio && (
                            <Text fontSize="$2" color="$text">
                              赔付: <Text fontWeight="600">{item.claimRatio}</Text>
                            </Text>
                          )}
                        </XStack>
                      )}
                    </YStack>
                  ))}
              </YStack>
            )}
          </YStack>
        </YStack>

        {/* Age Range and Policy Info */}
        <YStack padding="$4" backgroundColor="$surface" marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
            投保信息
          </Text>
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                投保年龄
              </Text>
              <Text fontSize="$3" color="$text">
                {product.ageRange.min}岁 - {product.ageRange.max}岁
              </Text>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                健康要求
              </Text>
              <Text fontSize="$3" color="$text" numberOfLines={2} textAlign="right" flex={1} marginLeft="$2">
                {product.healthRequirements}
              </Text>
            </XStack>
            {product.coveragePeriods && product.coveragePeriods.length > 0 && (
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$textSecondary">
                  保障期限
                </Text>
                <Text fontSize="$3" color="$text">
                  {product.coveragePeriods.join(' / ')}
                </Text>
              </XStack>
            )}
            {product.paymentPeriods && product.paymentPeriods.length > 0 && (
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$textSecondary">
                  交费期限
                </Text>
                <Text fontSize="$3" color="$text">
                  {product.paymentPeriods.join(' / ')}
                </Text>
              </XStack>
            )}
          </YStack>
        </YStack>

        {/* Important Notice */}
        <YStack padding="$4" backgroundColor="#FFF7ED" marginTop="$2">
          <XStack alignItems="center" gap="$2" marginBottom="$2">
            <AlertCircle size={20} color={COLORS.warning} />
            <Text fontSize="$4" fontWeight="600" color={COLORS.warning}>
              重要提示
            </Text>
          </XStack>
          <Text fontSize="$2" color="$text" lineHeight={20}>
            1. 本平台仅提供产品信息展示和咨询服务，不直接销售保险产品
            {'\n'}2. 购买时请前往保险公司官网或授权渠道
            {'\n'}3. 请如实告知健康状况，否则可能影响理赔
            {'\n'}4. 投保前请仔细阅读产品条款和投保须知
            {'\n'}5. 如有疑问，可免费咨询我们的专业顾问
          </Text>
        </YStack>

        <View height={100} />
      </ScrollView>

      {/* Bottom Actions */}
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$4"
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        gap="$3"
      >
        <Pressable
          onPress={handleConsultAdvisor}
          style={{ flex: 1 }}
        >
          <XStack
            height={48}
            borderRadius="$3"
            borderWidth={1}
            borderColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            gap="$2"
          >
            <MessageCircle size={20} color={COLORS.primary} />
            <Text color={COLORS.primary} fontWeight="600">
              咨询顾问
            </Text>
          </XStack>
        </Pressable>
        <Pressable
          onPress={handleExternalPurchase}
          style={{ flex: 1 }}
        >
          <XStack
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            gap="$2"
          >
            <ExternalLink size={20} color="white" />
            <Text color="white" fontWeight="600">
              前往购买
            </Text>
          </XStack>
        </Pressable>
      </XStack>
    </View>
  );
};

export default InsuranceProductDetailScreen;
