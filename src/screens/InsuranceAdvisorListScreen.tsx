import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { View, Text, XStack, YStack, Separator, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  Check,
  Star,
  MessageCircle,
  Clock,
  Users,
} from 'lucide-react-native';
import { ADVISOR_SPECIALTY_OPTIONS, ADVISOR_SORT_OPTIONS } from '@/constants/insurance';
import { getAdvisors } from '@/services/insuranceAdvisorService';
import { InsuranceAdvisor } from '@/types/insurance';
import { BottomSheet, BottomSheetItem } from '@/components/BottomSheet';

const InsuranceAdvisorListScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState<InsuranceAdvisor[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedOnlineStatus, setSelectedOnlineStatus] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('recommended');

  useEffect(() => {
    loadAdvisors();
  }, [selectedSpecialty, selectedCity, selectedOnlineStatus, selectedSort]);

  const loadAdvisors = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (selectedSpecialty !== 'all') {
        filters.specialty = selectedSpecialty;
      }
      if (selectedCity !== 'all') {
        filters.city = selectedCity;
      }
      if (selectedOnlineStatus !== 'all') {
        filters.onlineStatus = selectedOnlineStatus;
      }
      if (selectedSort !== 'recommended') {
        filters.sortBy = selectedSort;
      }

      const result = await getAdvisors(filters);
      setAdvisors(result);
    } catch (error) {
      console.error('加载顾问失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedSpecialty('all');
    setSelectedCity('all');
    setSelectedOnlineStatus('all');
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    loadAdvisors();
  };

  const applySorting = (sortOption: string) => {
    setSelectedSort(sortOption);
    setShowSortModal(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedSpecialty !== 'all') count++;
    if (selectedCity !== 'all') count++;
    if (selectedOnlineStatus !== 'all') count++;
    return count;
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
        return '忙碌';
      case 'offline':
        return '离线';
      default:
        return '未知';
    }
  };

  // 筛选标签选项
  const cityOptions = [
    { id: 'all', label: '全部城市' },
    { id: '北京', label: '北京' },
    { id: '上海', label: '上海' },
    { id: '广州', label: '广州' },
    { id: '深圳', label: '深圳' },
    { id: '杭州', label: '杭州' },
    { id: '成都', label: '成都' },
  ];

  const onlineStatusOptions = [
    { id: 'all', label: '全部状态' },
    { id: 'online', label: '在线' },
    { id: 'busy', label: '忙碌' },
    { id: 'offline', label: '离线' },
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
        {/* 专业领域 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            专业领域
          </Text>
          <XStack flexWrap="wrap">
            {ADVISOR_SPECIALTY_OPTIONS.map(option =>
              renderFilterChip(
                option.label,
                selectedSpecialty === option.id,
                () => setSelectedSpecialty(option.id)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 服务城市 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            服务城市
          </Text>
          <XStack flexWrap="wrap">
            {cityOptions.map(city =>
              renderFilterChip(
                city.label,
                selectedCity === city.id,
                () => setSelectedCity(city.id)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 在线状态 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            在线状态
          </Text>
          <XStack flexWrap="wrap">
            {onlineStatusOptions.map(status =>
              renderFilterChip(
                status.label,
                selectedOnlineStatus === status.id,
                () => setSelectedOnlineStatus(status.id)
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
        {ADVISOR_SORT_OPTIONS.map(option => (
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

  const renderAdvisorCard = (advisor: InsuranceAdvisor) => (
    <Pressable
      key={advisor.id}
      onPress={() =>
        navigation.navigate('InsuranceAdvisorDetail' as never, {
          advisorId: advisor.id,
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
          {/* 顾问基本信息 */}
          <XStack gap="$3" alignItems="flex-start">
            {/* 头像 */}
            <View
              width={64}
              height={64}
              borderRadius={32}
              overflow="hidden"
              backgroundColor="$color5"
            >
              <View
                width={64}
                height={64}
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$6" color="white" fontWeight="600">
                  {advisor.name.charAt(0)}
                </Text>
              </View>
            </View>

            {/* 基本信息 */}
            <YStack flex={1} gap="$2">
              <XStack alignItems="center" gap="$2">
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  {advisor.name}
                </Text>
                <View
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={getOnlineStatusColor(advisor.onlineStatus)}
                />
                <Text fontSize="$2" color={getOnlineStatusColor(advisor.onlineStatus)}>
                  {getOnlineStatusLabel(advisor.onlineStatus)}
                </Text>
              </XStack>

              <Text fontSize="$3" color="$color10">
                {advisor.organization}
              </Text>

              <XStack gap="$2" flexWrap="wrap">
                {advisor.certifications.slice(0, 3).map((cert, idx) => (
                  <View
                    key={idx}
                    backgroundColor={`${successColor}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$0.5"
                    borderRadius="$10"
                  >
                    <Text fontSize="$1" color="$success">
                      {cert}
                    </Text>
                  </View>
                ))}
              </XStack>

              <Text fontSize="$2" color="$color10">
                {advisor.yearsOfExperience}年从业经验 · {advisor.serviceCities.join('、')}
              </Text>
            </YStack>
          </XStack>

          {/* 专业领域 */}
          <XStack gap="$2" flexWrap="wrap">
            {advisor.specialties.map((specialty, idx) => (
              <View
                key={idx}
                backgroundColor="$color4"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize="$2" color="$color12">
                  {specialty}
                </Text>
              </View>
            ))}
          </XStack>

          {/* 服务数据 */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$3">
              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Users size={14} color={primaryColor} />
                  <Text fontSize="$3" fontWeight="600" color="$primary">
                    {advisor.clientsServed}
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$color10">
                  服务客户
                </Text>
              </YStack>

              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Star size={14} color={warningColor} />
                  <Text fontSize="$3" fontWeight="600" color="$warning">
                    {advisor.satisfactionRate}%
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$color10">
                  满意度
                </Text>
              </YStack>

              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Clock size={14} color={color10} />
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {advisor.avgResponseTime}
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$color10">
                  响应时间
                </Text>
              </YStack>
            </XStack>

            <Pressable
              onPress={() =>
                navigation.navigate('InsuranceAdvisorDetail' as never, {
                  advisorId: advisor.id,
                } as never)
              }
            >
              <View
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$10"
                backgroundColor="$primary"
              >
                <XStack alignItems="center" gap="$1">
                  <MessageCircle size={16} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    免费咨询
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </View>
    </Pressable>
  );

  const activeFilterCount = getActiveFilterCount();
  const currentSortLabel =
    ADVISOR_SORT_OPTIONS.find(opt => opt.id === selectedSort)?.label || '综合推荐';

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
            保险顾问
          </Text>
          <View width={40} />
        </XStack>
      </View>

      {/* 免费咨询提示 */}
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        backgroundColor={`${primaryColor}10`}
        borderRadius="$4"
        borderLeftWidth={3}
        borderLeftColor="$primary"
      >
        <Text fontSize="$3" color="$color12">
          所有顾问咨询服务完全免费，无需购买会员
        </Text>
      </View>

      {/* Filter and Sort Bar */}
      <XStack padding="$2.5" gap="$2" backgroundColor="$background">
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

      {/* Advisor List */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text marginTop="$3" color="$color10">
            加载中...
          </Text>
        </View>
      ) : advisors.length === 0 ? (
        <View flex={1} justifyContent="center" alignItems="center" padding="$2.5">
          <Text fontSize="$4" color="$color10" textAlign="center">
            暂无符合条件的顾问
          </Text>
          <Text fontSize="$3" color="$color10" textAlign="center" marginTop="$2">
            试试调整筛选条件
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5">
            <Text fontSize="$3" color="$color10" marginBottom="$2">
              共找到 {advisors.length} 位顾问
            </Text>
            {advisors.map(renderAdvisorCard)}
          </YStack>
        </ScrollView>
      )}

      {/* Modals */}
      {renderFilterModal()}
      {renderSortModal()}
    </View>
  );
};

export default InsuranceAdvisorListScreen;
