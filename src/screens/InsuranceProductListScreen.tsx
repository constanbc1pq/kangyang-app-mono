import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { View, Text, XStack, YStack, Card } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Check,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  INSURANCE_CATEGORY_LABELS,
  PRODUCT_FILTER_CATEGORIES,
  PRODUCT_SORT_OPTIONS,
} from '@/constants/insurance';
import {
  getProducts,
  getCompanies,
  searchProducts,
} from '@/services/insuranceProductService';
import { InsuranceProduct, InsuranceCompany, InsuranceCategory } from '@/types/insurance';

const { width } = Dimensions.get('window');

type RouteParams = {
  InsuranceProductList: {
    category?: InsuranceCategory;
    sortBy?: string;
  };
};

const InsuranceProductListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'InsuranceProductList'>>();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route.params?.category || 'all'
  );
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedHealthStatus, setSelectedHealthStatus] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>(route.params?.sortBy || 'recommended');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedCompany, selectedAgeGroup, selectedHealthStatus, selectedSort]);

  const loadInitialData = async () => {
    try {
      const companiesRes = await getCompanies();
      setCompanies(companiesRes);
      await loadProducts();
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (selectedCategory !== 'all') {
        filters.category = selectedCategory as InsuranceCategory;
      }
      if (selectedCompany !== 'all') {
        filters.companyId = selectedCompany;
      }
      if (selectedAgeGroup !== 'all') {
        filters.ageGroup = selectedAgeGroup;
      }
      if (selectedHealthStatus !== 'all') {
        filters.healthStatus = selectedHealthStatus;
      }
      if (selectedSort !== 'recommended') {
        filters.sortBy = selectedSort;
      }

      const productsRes = await getProducts(filters);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('加载产品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const results = await searchProducts(query);
      setProducts(results);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCompany('all');
    setSelectedAgeGroup('all');
    setSelectedHealthStatus('all');
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    loadProducts();
  };

  const applySorting = (sortOption: string) => {
    setSelectedSort(sortOption);
    setShowSortModal(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedCompany !== 'all') count++;
    if (selectedAgeGroup !== 'all') count++;
    if (selectedHealthStatus !== 'all') count++;
    return count;
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View flex={1} backgroundColor="rgba(0,0,0,0.5)">
        <Pressable flex={1} onPress={() => setShowFilterModal(false)} />
        <View backgroundColor="$background" borderTopLeftRadius="$4" borderTopRightRadius="$4">
          {/* Header */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding="$4"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Text fontSize="$5" fontWeight="600" color="$text">
              筛选条件
            </Text>
            <Pressable onPress={() => setShowFilterModal(false)}>
              <X size={24} color={COLORS.text} />
            </Pressable>
          </XStack>

          <ScrollView style={{ maxHeight: 500 }}>
            {/* 保险类别 */}
            <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                保险类别
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {PRODUCT_FILTER_CATEGORIES.map(cat => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={
                        selectedCategory === cat.id ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedCategory === cat.id ? 'white' : '$text'}
                      >
                        {cat.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* 保险公司 */}
            <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                保险公司
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                <Pressable
                  onPress={() => setSelectedCompany('all')}
                  style={{ marginBottom: 8 }}
                >
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$2"
                    backgroundColor={selectedCompany === 'all' ? COLORS.primary : '$borderColor'}
                  >
                    <Text fontSize="$3" color={selectedCompany === 'all' ? 'white' : '$text'}>
                      全部公司
                    </Text>
                  </View>
                </Pressable>
                {companies.map(company => (
                  <Pressable
                    key={company.id}
                    onPress={() => setSelectedCompany(company.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={
                        selectedCompany === company.id ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedCompany === company.id ? 'white' : '$text'}
                      >
                        {company.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* 适合年龄 */}
            <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                适合年龄
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {[
                  { id: 'all', label: '全部年龄' },
                  { id: '50-60', label: '50-60岁' },
                  { id: '60-70', label: '60-70岁' },
                  { id: '70+', label: '70岁以上' },
                ].map(age => (
                  <Pressable
                    key={age.id}
                    onPress={() => setSelectedAgeGroup(age.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={
                        selectedAgeGroup === age.id ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedAgeGroup === age.id ? 'white' : '$text'}
                      >
                        {age.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* 健康状况 */}
            <YStack padding="$4">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                健康状况
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'standard', label: '标准体' },
                  { id: 'subhealth', label: '亚健康' },
                  { id: 'chronic_disease', label: '慢病可投' },
                ].map(health => (
                  <Pressable
                    key={health.id}
                    onPress={() => setSelectedHealthStatus(health.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={
                        selectedHealthStatus === health.id ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedHealthStatus === health.id ? 'white' : '$text'}
                      >
                        {health.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>
          </ScrollView>

          {/* Footer Actions */}
          <XStack
            padding="$4"
            gap="$3"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            backgroundColor="$background"
          >
            <Pressable
              onPress={resetFilters}
              style={{ flex: 1 }}
            >
              <View
                height={44}
                borderRadius="$3"
                borderWidth={1}
                borderColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
              >
                <Text color={COLORS.primary} fontWeight="600">
                  重置
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={applyFilters}
              style={{ flex: 1 }}
            >
              <View
                height={44}
                borderRadius="$3"
                backgroundColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontWeight="600">
                  确定
                </Text>
              </View>
            </Pressable>
          </XStack>
        </View>
      </View>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View flex={1} backgroundColor="rgba(0,0,0,0.5)">
        <Pressable flex={1} onPress={() => setShowSortModal(false)} />
        <View backgroundColor="$background" borderTopLeftRadius="$4" borderTopRightRadius="$4">
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding="$4"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Text fontSize="$5" fontWeight="600" color="$text">
              排序方式
            </Text>
            <Pressable onPress={() => setShowSortModal(false)}>
              <X size={24} color={COLORS.text} />
            </Pressable>
          </XStack>

          <YStack padding="$4">
            {PRODUCT_SORT_OPTIONS.map(option => (
              <Pressable
                key={option.id}
                onPress={() => applySorting(option.id)}
              >
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  paddingVertical="$3"
                  borderBottomWidth={1}
                  borderBottomColor="$borderColor"
                >
                  <Text
                    fontSize="$4"
                    color={selectedSort === option.id ? COLORS.primary : '$text'}
                    fontWeight={selectedSort === option.id ? '600' : '400'}
                  >
                    {option.label}
                  </Text>
                  {selectedSort === option.id && (
                    <Check size={20} color={COLORS.primary} />
                  )}
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </View>
      </View>
    </Modal>
  );

  const renderProductCard = (product: InsuranceProduct) => (
    <Pressable
      key={product.id}
      onPress={() =>
        navigation.navigate('InsuranceProductDetail' as never, {
          productId: product.id,
        } as never)
      }
    >
      <Card
        bordered
        padding="$4"
        backgroundColor="$surface"
        marginBottom="$3"
        pressStyle={{ scale: 0.98 }}
      >
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$text">
                {product.name}
              </Text>
              <Text fontSize="$2" color="$textSecondary" numberOfLines={2}>
                {product.description}
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {product.highlights.slice(0, 3).map((highlight, idx) => (
                  <View
                    key={idx}
                    backgroundColor={`${COLORS.primary}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color={COLORS.primary}>
                      {highlight}
                    </Text>
                  </View>
                ))}
              </XStack>
            </YStack>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize="$2" color="$textSecondary">
                {product.companyName}
              </Text>
              <XStack alignItems="baseline" gap="$1">
                <Text fontSize="$2" color="$textSecondary">
                  ¥
                </Text>
                <Text fontSize="$5" fontWeight="700" color={COLORS.primary}>
                  {product.premiumStartFrom}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  起/年
                </Text>
              </XStack>
            </YStack>
            <XStack gap="$3" alignItems="center">
              <Text fontSize="$2" color="$textSecondary">
                ⭐ {product.rating}
              </Text>
              <Text fontSize="$2" color="$textSecondary">
                月销 {product.monthSales}
              </Text>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </XStack>
          </XStack>
        </YStack>
      </Card>
    </Pressable>
  );

  const activeFilterCount = getActiveFilterCount();
  const currentSortLabel =
    PRODUCT_SORT_OPTIONS.find(opt => opt.id === selectedSort)?.label || '综合推荐';

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
          保险产品
        </Text>
      </XStack>

      {/* Search Bar */}
      <View padding="$4" backgroundColor="$surface" borderBottomWidth={1} borderBottomColor="$borderColor">
        <XStack
          backgroundColor="$borderColor"
          borderRadius="$3"
          paddingHorizontal="$3"
          alignItems="center"
          gap="$2"
        >
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="搜索产品名称、公司"
            placeholderTextColor={COLORS.textSecondary}
            style={{
              flex: 1,
              height: 40,
              fontSize: 14,
              color: COLORS.text,
            }}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </XStack>
      </View>

      {/* Filter and Sort Bar */}
      <XStack
        padding="$3"
        gap="$2"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => setShowFilterModal(true)} style={{ flex: 1 }}>
          <XStack
            height={36}
            backgroundColor="$borderColor"
            borderRadius="$2"
            paddingHorizontal="$3"
            alignItems="center"
            justifyContent="center"
            gap="$2"
          >
            <Filter size={16} color={COLORS.text} />
            <Text fontSize="$3" color="$text">
              筛选
            </Text>
            {activeFilterCount > 0 && (
              <View
                width={18}
                height={18}
                borderRadius={9}
                backgroundColor={COLORS.primary}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$1" color="white" fontWeight="600">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </XStack>
        </Pressable>

        <Pressable onPress={() => setShowSortModal(true)} style={{ flex: 1 }}>
          <XStack
            height={36}
            backgroundColor="$borderColor"
            borderRadius="$2"
            paddingHorizontal="$3"
            alignItems="center"
            justifyContent="center"
            gap="$2"
          >
            <Text fontSize="$3" color="$text">
              {currentSortLabel}
            </Text>
            <ChevronDown size={16} color={COLORS.text} />
          </XStack>
        </Pressable>
      </XStack>

      {/* Product List */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text marginTop="$3" color="$textSecondary">
            加载中...
          </Text>
        </View>
      ) : products.length === 0 ? (
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            暂无符合条件的产品
          </Text>
          <Text fontSize="$3" color="$textSecondary" textAlign="center" marginTop="$2">
            试试调整筛选条件
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4">
            <Text fontSize="$3" color="$textSecondary" marginBottom="$3">
              共找到 {products.length} 款产品
            </Text>
            {products.map(renderProductCard)}
          </YStack>
        </ScrollView>
      )}

      {/* Modals */}
      {renderFilterModal()}
      {renderSortModal()}
    </View>
  );
};

export default InsuranceProductListScreen;
