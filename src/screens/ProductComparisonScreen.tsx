import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, CheckCircle, XCircle, Minus } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { INSURANCE_CATEGORY_LABELS, MAX_COMPARISON_PRODUCTS } from '@/constants/insurance';
import { getProductById } from '@/services/insuranceProductService';
import { InsuranceProduct } from '@/types/insurance';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

type RouteParams = {
  ProductComparison: {
    productIds: string[];
  };
};

interface ComparisonRow {
  label: string;
  values: (string | number | boolean)[];
  type?: 'text' | 'price' | 'boolean' | 'rating';
}

const ProductComparisonScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'ProductComparison'>>();
  const { productIds } = route.params;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<InsuranceProduct[]>([]);

  useEffect(() => {
    loadProducts();
  }, [productIds]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const validIds = productIds.slice(0, MAX_COMPARISON_PRODUCTS);
      const productPromises = validIds.map(id => getProductById(id));
      const loadedProducts = await Promise.all(productPromises);
      setProducts(loadedProducts.filter(p => p !== null) as InsuranceProduct[]);
    } catch (error) {
      console.error('加载产品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateComparisonData = (): ComparisonRow[] => {
    if (products.length === 0) return [];

    return [
      {
        label: '产品名称',
        values: products.map(p => p.name),
      },
      {
        label: '保险公司',
        values: products.map(p => p.companyName),
      },
      {
        label: '产品类型',
        values: products.map(p => INSURANCE_CATEGORY_LABELS[p.category]),
      },
      {
        label: '起保费用',
        values: products.map(p => p.premiumStartFrom),
        type: 'price',
      },
      {
        label: '投保年龄',
        values: products.map(p => `${p.ageRange.min}-${p.ageRange.max}岁`),
      },
      {
        label: '保障期限',
        values: products.map(p => p.coveragePeriod),
      },
      {
        label: '等待期',
        values: products.map(p => p.waitingPeriod),
      },
      {
        label: '产品评分',
        values: products.map(p => p.rating),
        type: 'rating',
      },
      {
        label: '月销量',
        values: products.map(p => `${p.monthSales}份`),
      },
      {
        label: '保证续保',
        values: products.map(p => p.features.includes('guaranteed_renewal')),
        type: 'boolean',
      },
      {
        label: '免体检',
        values: products.map(p => p.features.includes('no_medical_exam')),
        type: 'boolean',
      },
      {
        label: '快速理赔',
        values: products.map(p => p.features.includes('fast_claim')),
        type: 'boolean',
      },
    ];
  };

  const renderValue = (value: string | number | boolean, type?: string) => {
    if (type === 'boolean') {
      return value ? (
        <CheckCircle size={20} color={COLORS.success} />
      ) : (
        <XCircle size={20} color={COLORS.textSecondary} />
      );
    }

    if (type === 'price') {
      return (
        <YStack alignItems="center">
          <Text fontSize="$2" color="$textSecondary">
            ¥
          </Text>
          <Text fontSize="$4" fontWeight="700" color={COLORS.primary}>
            {value}
          </Text>
          <Text fontSize="$1" color="$textSecondary">
            起/年
          </Text>
        </YStack>
      );
    }

    if (type === 'rating') {
      return (
        <XStack alignItems="center" gap="$1" justifyContent="center">
          <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
            ⭐
          </Text>
          <Text fontSize="$3" fontWeight="600" color="$text">
            {value}
          </Text>
        </XStack>
      );
    }

    return (
      <Text
        fontSize="$2"
        color="$text"
        textAlign="center"
        numberOfLines={3}
        lineHeight={18}
      >
        {String(value)}
      </Text>
    );
  };

  const renderProductCard = (product: InsuranceProduct, index: number) => (
    <Pressable
      key={product.id}
      onPress={() =>
        navigation.navigate('InsuranceProductDetail' as never, {
          productId: product.id,
        } as never)
      }
    >
      <YStack
        width={CARD_WIDTH}
        padding="$3"
        backgroundColor="$surface"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Text
          fontSize="$3"
          fontWeight="600"
          color="$text"
          textAlign="center"
          numberOfLines={2}
          marginBottom="$2"
          minHeight={40}
        >
          {product.name}
        </Text>
        <Text
          fontSize="$2"
          color="$textSecondary"
          textAlign="center"
          numberOfLines={1}
        >
          {product.companyName}
        </Text>
      </YStack>
    </Pressable>
  );

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

  if (products.length === 0) {
    return (
      <View flex={1} backgroundColor="$background">
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
          <Text flex={1} textAlign="center" fontSize="$5" fontWeight="600" color="$text">
            产品对比
          </Text>
          <View width={24} />
        </XStack>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            暂无产品数据
          </Text>
        </View>
      </View>
    );
  }

  const comparisonData = generateComparisonData();

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
        <Text flex={1} textAlign="center" fontSize="$5" fontWeight="600" color="$text">
          产品对比 ({products.length}款)
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Product Cards Row */}
          <XStack
            padding="$4"
            gap="$3"
            backgroundColor="$surface"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <View width={100} justifyContent="center">
              <Text fontSize="$3" fontWeight="600" color="$text">
                对比项目
              </Text>
            </View>
            {products.map((product, index) => renderProductCard(product, index))}
          </XStack>

          {/* Comparison Rows */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {comparisonData.map((row, rowIndex) => (
              <XStack
                key={rowIndex}
                padding="$4"
                gap="$3"
                backgroundColor={rowIndex % 2 === 0 ? '$background' : '$surface'}
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
              >
                <View width={100} justifyContent="center">
                  <Text fontSize="$3" color="$text" fontWeight="500">
                    {row.label}
                  </Text>
                </View>
                {row.values.map((value, colIndex) => (
                  <View
                    key={colIndex}
                    width={CARD_WIDTH}
                    justifyContent="center"
                    alignItems="center"
                    paddingVertical="$2"
                  >
                    {renderValue(value, row.type)}
                  </View>
                ))}
              </XStack>
            ))}

            {/* Product Highlights */}
            <XStack
              padding="$4"
              gap="$3"
              backgroundColor="$background"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <View width={100} justifyContent="flex-start" paddingTop="$2">
                <Text fontSize="$3" color="$text" fontWeight="500">
                  产品亮点
                </Text>
              </View>
              {products.map((product, index) => (
                <YStack key={index} width={CARD_WIDTH} gap="$2">
                  {product.highlights.slice(0, 5).map((highlight, idx) => (
                    <View
                      key={idx}
                      backgroundColor={`${COLORS.primary}15`}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$1" color={COLORS.primary} textAlign="center">
                        {highlight}
                      </Text>
                    </View>
                  ))}
                </YStack>
              ))}
            </XStack>

            {/* Primary Coverage */}
            <XStack
              padding="$4"
              gap="$3"
              backgroundColor="$surface"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <View width={100} justifyContent="flex-start" paddingTop="$2">
                <Text fontSize="$3" color="$text" fontWeight="500">
                  主要保障
                </Text>
              </View>
              {products.map((product, index) => (
                <YStack key={index} width={CARD_WIDTH} gap="$2">
                  {product.coverageDetails.primaryCoverage.slice(0, 5).map((coverage, idx) => (
                    <XStack key={idx} gap="$1" alignItems="flex-start">
                      <CheckCircle size={12} color={COLORS.success} style={{ marginTop: 2 }} />
                      <Text flex={1} fontSize="$1" color="$text" lineHeight={16} numberOfLines={2}>
                        {coverage}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              ))}
            </XStack>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <XStack
        padding="$4"
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        gap="$3"
      >
        {products.map(product => (
          <Pressable
            key={product.id}
            onPress={() =>
              navigation.navigate('InsuranceProductDetail' as never, {
                productId: product.id,
              } as never)
            }
            style={{ flex: 1 }}
          >
            <View
              height={44}
              borderRadius="$3"
              backgroundColor={COLORS.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontWeight="600" fontSize="$3" numberOfLines={1}>
                查看详情
              </Text>
            </View>
          </Pressable>
        ))}
      </XStack>

      {/* Tips */}
      {products.length < MAX_COMPARISON_PRODUCTS && (
        <View
          position="absolute"
          top={70}
          left={16}
          right={16}
          padding="$3"
          backgroundColor="#FFF7ED"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.warning}
        >
          <Text fontSize="$2" color="$text">
            提示：最多可对比 {MAX_COMPARISON_PRODUCTS} 款产品，当前已选 {products.length} 款
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductComparisonScreen;
