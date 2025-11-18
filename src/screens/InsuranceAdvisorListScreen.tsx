import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator, Modal } from 'react-native';
import { View, Text, XStack, YStack, Card } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  X,
  Check,
  Star,
  MessageCircle,
  Award,
  Clock,
  Users,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ADVISOR_SPECIALTY_OPTIONS, ADVISOR_SORT_OPTIONS } from '@/constants/insurance';
import { getAdvisors } from '@/services/insuranceAdvisorService';
import { InsuranceAdvisor } from '@/types/insurance';

const InsuranceAdvisorListScreen: React.FC = () => {
  const navigation = useNavigation();

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
        return COLORS.success;
      case 'busy':
        return COLORS.warning;
      case 'offline':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
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
            {/* 专业领域 */}
            <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                专业领域
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {ADVISOR_SPECIALTY_OPTIONS.map(option => (
                  <Pressable
                    key={option.id}
                    onPress={() => setSelectedSpecialty(option.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={
                        selectedSpecialty === option.id ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedSpecialty === option.id ? 'white' : '$text'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* 服务城市 */}
            <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                服务城市
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {[
                  { id: 'all', label: '全部城市' },
                  { id: '北京', label: '北京' },
                  { id: '上海', label: '上海' },
                  { id: '广州', label: '广州' },
                  { id: '深圳', label: '深圳' },
                  { id: '杭州', label: '杭州' },
                  { id: '成都', label: '成都' },
                ].map(city => (
                  <Pressable
                    key={city.id}
                    onPress={() => setSelectedCity(city.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={selectedCity === city.id ? COLORS.primary : '$borderColor'}
                    >
                      <Text fontSize="$3" color={selectedCity === city.id ? 'white' : '$text'}>
                        {city.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* 在线状态 */}
            <YStack padding="$4">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                在线状态
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {[
                  { id: 'all', label: '全部状态' },
                  { id: 'online', label: '在线' },
                  { id: 'busy', label: '忙碌' },
                  { id: 'offline', label: '离线' },
                ].map(status => (
                  <Pressable
                    key={status.id}
                    onPress={() => setSelectedOnlineStatus(status.id)}
                    style={{ marginBottom: 8 }}
                  >
                    <View
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$2"
                      backgroundColor={
                        selectedOnlineStatus === status.id ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedOnlineStatus === status.id ? 'white' : '$text'}
                      >
                        {status.label}
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
            <Pressable onPress={resetFilters} style={{ flex: 1 }}>
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
            <Pressable onPress={applyFilters} style={{ flex: 1 }}>
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
            {ADVISOR_SORT_OPTIONS.map(option => (
              <Pressable key={option.id} onPress={() => applySorting(option.id)}>
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
                  {selectedSort === option.id && <Check size={20} color={COLORS.primary} />}
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </View>
      </View>
    </Modal>
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
      <Card
        bordered
        padding="$4"
        backgroundColor="$surface"
        marginBottom="$3"
        pressStyle={{ scale: 0.98 }}
      >
        <YStack gap="$3">
          {/* 顾问基本信息 */}
          <XStack gap="$3" alignItems="flex-start">
            {/* 头像 */}
            <View
              width={64}
              height={64}
              borderRadius={32}
              overflow="hidden"
              backgroundColor="$borderColor"
            >
              <View
                width={64}
                height={64}
                backgroundColor={COLORS.primary}
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
                <Text fontSize="$5" fontWeight="600" color="$text">
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

              <Text fontSize="$3" color="$textSecondary">
                {advisor.organization}
              </Text>

              <XStack gap="$2" flexWrap="wrap">
                {advisor.certifications.slice(0, 3).map((cert, idx) => (
                  <View
                    key={idx}
                    backgroundColor={`${COLORS.success}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color={COLORS.success}>
                      {cert}
                    </Text>
                  </View>
                ))}
              </XStack>

              <Text fontSize="$2" color="$textSecondary">
                {advisor.yearsOfExperience}年从业经验 · {advisor.serviceCities.join('、')}
              </Text>
            </YStack>
          </XStack>

          {/* 专业领域 */}
          <XStack gap="$2" flexWrap="wrap">
            {advisor.specialties.map((specialty, idx) => (
              <View
                key={idx}
                backgroundColor="$borderColor"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$text">
                  {specialty}
                </Text>
              </View>
            ))}
          </XStack>

          {/* 服务数据 */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$4">
              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Users size={14} color={COLORS.primary} />
                  <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                    {advisor.clientsServed}
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$textSecondary">
                  服务客户
                </Text>
              </YStack>

              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Star size={14} color={COLORS.warning} />
                  <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                    {advisor.satisfactionRate}%
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$textSecondary">
                  满意度
                </Text>
              </YStack>

              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Clock size={14} color={COLORS.textSecondary} />
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    {advisor.avgResponseTime}
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$textSecondary">
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
                borderRadius="$2"
                backgroundColor={COLORS.primary}
              >
                <XStack alignItems="center" gap="$1">
                  <MessageCircle size={16} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="600">
                    免费咨询
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </Card>
    </Pressable>
  );

  const activeFilterCount = getActiveFilterCount();
  const currentSortLabel =
    ADVISOR_SORT_OPTIONS.find(opt => opt.id === selectedSort)?.label || '综合推荐';

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
          保险顾问
        </Text>
      </XStack>

      {/* 免费咨询提示 */}
      <View
        marginHorizontal="$4"
        marginTop="$4"
        padding="$3"
        backgroundColor="#E0F2FE"
        borderRadius="$3"
        borderLeftWidth={3}
        borderLeftColor={COLORS.primary}
      >
        <Text fontSize="$3" color="$text">
          所有顾问咨询服务完全免费，无需购买会员 💬
        </Text>
      </View>

      {/* Filter and Sort Bar */}
      <XStack padding="$3" gap="$2" backgroundColor="$background">
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

      {/* Advisor List */}
      {loading ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text marginTop="$3" color="$textSecondary">
            加载中...
          </Text>
        </View>
      ) : advisors.length === 0 ? (
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            暂无符合条件的顾问
          </Text>
          <Text fontSize="$3" color="$textSecondary" textAlign="center" marginTop="$2">
            试试调整筛选条件
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4">
            <Text fontSize="$3" color="$textSecondary" marginBottom="$3">
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
