import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import { View, Text, XStack, YStack, Separator, useTheme } from 'tamagui';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import {
  PRODUCT_FILTER_CATEGORIES,
  PRODUCT_SORT_OPTIONS,
} from '@/constants/insurance';
import {
  getProducts,
  getCompanies,
  searchProducts,
} from '@/services/insuranceProductService';
import { InsuranceProduct, InsuranceCompany, InsuranceCategory } from '@/types/insurance';
import { BottomSheet, BottomSheetItem } from '@/components/BottomSheet';

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

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

  // 筛选标签选项
  const ageGroupOptions = [
    { id: 'all', label: '全部年龄' },
    { id: '50-60', label: '50-60岁' },
    { id: '60-70', label: '60-70岁' },
    { id: '70+', label: '70岁以上' },
  ];

  const healthStatusOptions = [
    { id: 'all', label: '全部' },
    { id: 'standard', label: '标准体' },
    { id: 'subhealth', label: '亚健康' },
    { id: 'chronic_disease', label: '慢病可投' },
  ];

  // 渲染筛选标签
  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress} key={label}>
      <View
        backgroundColor={isSelected ? primaryColor : '$color1'}
        paddingHorizontal="$2"
        paddingVertical="$1.5"
        borderRadius="$10"
        borderWidth={1}
        borderColor={isSelected ? primaryColor : '$color5'}
        marginBottom="$2"
        marginRight="$2"
      >
        <XStack gap="$1" alignItems="center">
          {isSelected && <Check size={14} color="white" />}
          <Text
            fontSize="$3"
            color={isSelected ? 'white' : '$color12'}
            fontWeight={isSelected ? '600' : '400'}
          >
            {label}
          </Text>
        </XStack>
      </View>
    </Pressable>
  );

  const renderFilterModal = () => (
    <BottomSheet
      visible={showFilterModal}
      onClose={() => setShowFilterModal(false)}
      title="筛选条件"
      variant="filter"
      headerRight={
        <Pressable onPress={resetFilters}>
          <Text fontSize="$3" color="$color10">
            重置
          </Text>
        </Pressable>
      }
      footer={
        <XStack gap="$2">
          <Pressable onPress={resetFilters} style={{ flex: 1 }}>
            <View
              height={44}
              backgroundColor="$color4"
              borderRadius="$10"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$3" color="$color12" fontWeight="500">重置</Text>
            </View>
          </Pressable>
          <Pressable onPress={applyFilters} style={{ flex: 2 }}>
            <View
              height={44}
              backgroundColor="$primary"
              borderRadius="$10"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                确定{getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
              </Text>
            </View>
          </Pressable>
        </XStack>
      }
    >
      <YStack gap="$4">
        {/* 保险类别 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            保险类别
          </Text>
          <XStack flexWrap="wrap">
            {PRODUCT_FILTER_CATEGORIES.map(cat =>
              renderFilterChip(
                cat.label,
                selectedCategory === cat.id,
                () => setSelectedCategory(cat.id)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 保险公司 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            保险公司
          </Text>
          <XStack flexWrap="wrap">
            {renderFilterChip(
              '全部公司',
              selectedCompany === 'all',
              () => setSelectedCompany('all')
            )}
            {companies.map(company =>
              renderFilterChip(
                company.name,
                selectedCompany === company.id,
                () => setSelectedCompany(company.id)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 适合年龄 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            适合年龄
          </Text>
          <XStack flexWrap="wrap">
            {ageGroupOptions.map(age =>
              renderFilterChip(
                age.label,
                selectedAgeGroup === age.id,
                () => setSelectedAgeGroup(age.id)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 健康状况 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            健康状况
          </Text>
          <XStack flexWrap="wrap">
            {healthStatusOptions.map(health =>
              renderFilterChip(
                health.label,
                selectedHealthStatus === health.id,
                () => setSelectedHealthStatus(health.id)
              )
            )}
          </XStack>
        </YStack>
      </YStack>
    </BottomSheet>
  );

  const renderSortModal = () => (
    <BottomSheet
      visible={showSortModal}
      onClose={() => setShowSortModal(false)}
      title="排序方式"
      variant="picker"
      scrollable={false}
    >
      <YStack>
        {PRODUCT_SORT_OPTIONS.map(option => (
          <BottomSheetItem
            key={option.id}
            label={option.label}
            onPress={() => applySorting(option.id)}
            selected={selectedSort === option.id}
          />
        ))}
      </YStack>
    </BottomSheet>
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
      <View
        borderWidth={1}
        borderColor="$color5"
        borderRadius="$5"
        padding="$2"
        backgroundColor="$color2"
        marginBottom="$2"
      >
        <YStack gap="$2">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {product.name}
              </Text>
              <Text fontSize="$2" color="$color10" numberOfLines={2}>
                {product.description}
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {product.highlights.slice(0, 3).map((highlight, idx) => (
                  <View
                    key={idx}
                    backgroundColor={`${primaryColor}15`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize="$1" color="$primary">
                      {highlight}
                    </Text>
                  </View>
                ))}
              </XStack>
            </YStack>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize="$2" color="$color10">
                {product.companyName}
              </Text>
              <XStack alignItems="baseline" gap="$1">
                <Text fontSize="$2" color="$primary">
                  ¥
                </Text>
                <Text fontSize="$5" fontWeight="700" color="$primary">
                  {product.premiumStartFrom}
                </Text>
                <Text fontSize="$2" color="$color10">
                  起/年
                </Text>
              </XStack>
            </YStack>
            <XStack gap="$3" alignItems="center">
              <Text fontSize="$2" color="$color10">
                ⭐ {product.rating}
              </Text>
              <Text fontSize="$2" color="$color10">
                月销 {product.monthSales}
              </Text>
              <ChevronRight size={18} color={color10} />
            </XStack>
          </XStack>
        </YStack>
      </View>
    </Pressable>
  );

  const activeFilterCount = getActiveFilterCount();
  const currentSortLabel =
    PRODUCT_SORT_OPTIONS.find(opt => opt.id === selectedSort)?.label || '综合推荐';

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
            保险产品
          </Text>
          <View width={40} />
        </XStack>
      </View>

      {/* Search Bar */}
      <View padding="$2.5" backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack
          backgroundColor="$color4"
          borderRadius="$10"
          paddingHorizontal="$3"
          alignItems="center"
          gap="$2"
        >
          <Search size={20} color={color10} />
          <TextInput
            placeholder="搜索产品名称、公司"
            placeholderTextColor={color10}
            style={{
              flex: 1,
              height: 40,
              fontSize: 14,
              color: color12,
            }}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </XStack>
      </View>

      {/* Filter and Sort Bar */}
      <XStack
        padding="$2.5"
        gap="$2"
        backgroundColor="$background"
      >
        <Pressable onPress={() => setShowFilterModal(true)} style={{ flex: 1 }}>
          <XStack
            height={36}
            backgroundColor="$color4"
            borderRadius="$10"
            paddingHorizontal="$3"
            alignItems="center"
            justifyContent="center"
            gap="$2"
          >
            <Filter size={16} color={color12} />
            <Text fontSize="$3" color="$color12">
              筛选
            </Text>
            {activeFilterCount > 0 && (
              <View
                width={18}
                height={18}
                borderRadius={9}
                backgroundColor="$primary"
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
            backgroundColor="$color4"
            borderRadius="$10"
            paddingHorizontal="$3"
            alignItems="center"
            justifyContent="center"
            gap="$2"
          >
            <Text fontSize="$3" color="$color12">
              {currentSortLabel}
            </Text>
            <ChevronDown size={16} color={color12} />
          </XStack>
        </Pressable>
      </XStack>

      {/* Product List */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text marginTop="$3" color="$color10">
            加载中...
          </Text>
        </View>
      ) : products.length === 0 ? (
        <View flex={1} justifyContent="center" alignItems="center" padding="$2.5">
          <Text fontSize="$4" color="$color10" textAlign="center">
            暂无符合条件的产品
          </Text>
          <Text fontSize="$3" color="$color10" textAlign="center" marginTop="$2">
            试试调整筛选条件
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5">
            <Text fontSize="$3" color="$color10" marginBottom="$2">
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
