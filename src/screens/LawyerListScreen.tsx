/**
 * ============================================================================
 * 律师列表页面 - LawyerListScreen
 * ============================================================================
 *
 * Phase 33.2: 律师列表与筛选
 *
 * 【功能概述】
 * - 展示专业律师列表，支持多维度筛选和排序
 * - 帮助用户快速找到合适的法律专家
 *
 * 【主要功能】
 * 1. 律师卡片展示：头像、姓名、专业领域、评分、服务人数、在线状态
 * 2. 专业领域筛选：遗嘱继承、养老赡养、房产纠纷、婚姻家庭等
 * 3. 在线状态筛选：仅显示在线律师
 * 4. 价格排序：按图文咨询价格升序/降序
 * 5. 评分排序：按评分高低排序
 * 6. 点击进入律师详情页
 *
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Alert, Image as RNImage, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Card, View, ScrollView, Button, Theme } from 'tamagui';
import {
  ArrowLeft,
  MessageSquare,
  List,
  FileText,
  Heart,
  Home,
  Users,
  FileCheck,
  ShoppingCart,
  Briefcase,
  CheckCircle,
  Star,
  User,
  MessageCircle,
  Pill
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LawyerProfile, LawyerSpecialty } from '../types/legalService';
import { getLawyers } from '../services/legalService';
import { COLORS } from '@/constants/app';

interface Props {
  navigation: any;
}

// 排序方式
type SortType = 'default' | 'price_asc' | 'price_desc' | 'rating_desc';

// Icon mapping
const getIconForSpecialty = (specialty: string) => {
  const iconMap: Record<string, any> = {
    all: List,
    [LawyerSpecialty.INHERITANCE]: FileText,
    [LawyerSpecialty.ELDER_CARE]: Heart,
    [LawyerSpecialty.PROPERTY]: Home,
    [LawyerSpecialty.MARRIAGE]: Users,
    [LawyerSpecialty.CONTRACT]: FileCheck,
    [LawyerSpecialty.CONSUMER_RIGHTS]: ShoppingCart,
    [LawyerSpecialty.MEDICAL]: Pill,
    [LawyerSpecialty.LABOR]: Briefcase,
  };
  return iconMap[specialty] || FileText;
};

// 专业领域选项
const SPECIALTY_OPTIONS = [
  { value: 'all', label: '全部', icon: 'all' },
  { value: LawyerSpecialty.INHERITANCE, label: '遗嘱继承', icon: LawyerSpecialty.INHERITANCE },
  { value: LawyerSpecialty.ELDER_CARE, label: '养老赡养', icon: LawyerSpecialty.ELDER_CARE },
  { value: LawyerSpecialty.PROPERTY, label: '房产纠纷', icon: LawyerSpecialty.PROPERTY },
  { value: LawyerSpecialty.MARRIAGE, label: '婚姻家庭', icon: LawyerSpecialty.MARRIAGE },
  { value: LawyerSpecialty.CONTRACT, label: '合同纠纷', icon: LawyerSpecialty.CONTRACT },
  { value: LawyerSpecialty.CONSUMER_RIGHTS, label: '消费维权', icon: LawyerSpecialty.CONSUMER_RIGHTS },
  { value: LawyerSpecialty.MEDICAL, label: '医疗纠纷', icon: LawyerSpecialty.MEDICAL },
  { value: LawyerSpecialty.LABOR, label: '劳动争议', icon: LawyerSpecialty.LABOR },
];

// 排序选项
const SORT_OPTIONS = [
  { value: 'default' as SortType, label: '默认排序' },
  { value: 'rating_desc' as SortType, label: '评分最高' },
  { value: 'price_asc' as SortType, label: '价格最低' },
  { value: 'price_desc' as SortType, label: '价格最高' },
];

const LawyerListScreen: React.FC<Props> = ({ navigation }) => {
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortType, setSortType] = useState<SortType>('default');

  useFocusEffect(
    React.useCallback(() => {
      console.log('LawyerListScreen focused - refreshing lawyers');
      loadLawyers();
    }, [])
  );

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const data = await getLawyers();
      setLawyers(data);
    } catch (error) {
      console.error('Error loading lawyers:', error);
      Alert.alert('加载失败', '无法加载律师列表，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedLawyers = useMemo(() => {
    let result = [...lawyers];

    if (selectedSpecialty !== 'all') {
      result = result.filter(lawyer =>
        lawyer.specialties.includes(selectedSpecialty as LawyerSpecialty)
      );
    }

    if (onlineOnly) {
      result = result.filter(lawyer => lawyer.isOnline);
    }

    switch (sortType) {
      case 'rating_desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => a.textConsultationPrice - b.textConsultationPrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.textConsultationPrice - a.textConsultationPrice);
        break;
      case 'default':
      default:
        result.sort((a, b) => {
          if (a.isOnline !== b.isOnline) {
            return a.isOnline ? -1 : 1;
          }
          return b.rating - a.rating;
        });
    }

    return result;
  }, [lawyers, selectedSpecialty, onlineOnly, sortType]);

  const renderSpecialtyBadge = (specialty: LawyerSpecialty) => {
    const option = SPECIALTY_OPTIONS.find(opt => opt.value === specialty);
    if (!option) return null;

    const IconComponent = getIconForSpecialty(option.icon);

    return (
      <XStack
        key={specialty}
        alignItems="center"
        paddingHorizontal="$2"
        paddingVertical="$0.5"
        backgroundColor={`${COLORS.primary}15`}
        borderRadius={10}
        gap="$1"
      >
        <IconComponent size={12} color={COLORS.primary} />
        <Text fontSize="$1" color={COLORS.primary}>{option.label}</Text>
      </XStack>
    );
  };

  const renderLawyerCard = (lawyer: LawyerProfile) => {
    return (
      <Card
        key={lawyer.id}
        padding="$4"
        borderRadius="$3"
        backgroundColor="$cardBg"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={4}
        elevation={2}
        pressStyle={{ scale: 0.98 }}
        onPress={() => navigation.navigate('LawyerDetail', { lawyerId: lawyer.id })}
        position="relative"
      >
        {lawyer.isOnline && (
          <View
            position="absolute"
            top={12}
            right={12}
            width={8}
            height={8}
            borderRadius={4}
            backgroundColor={COLORS.success}
          />
        )}

        <XStack>
          <View marginRight="$3" position="relative">
            {lawyer.avatar ? (
              <RNImage source={{ uri: lawyer.avatar }} style={{ width: 80, height: 80, borderRadius: 8 }} />
            ) : (
              <View
                width={80}
                height={80}
                borderRadius={8}
                backgroundColor={COLORS.surface}
                alignItems="center"
                justifyContent="center"
              >
                <User size={40} color={COLORS.textSecondary} />
              </View>
            )}
            {lawyer.isOnline && (
              <View
                position="absolute"
                bottom={-4}
                left={0}
                right={0}
                backgroundColor={COLORS.success}
                paddingVertical="$0.5"
                borderRadius={4}
              >
                <Text fontSize="$1" color="white" textAlign="center" fontWeight="500">
                  在线
                </Text>
              </View>
            )}
          </View>

          <YStack flex={1}>
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$1">
              <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>{lawyer.name}</Text>
              <XStack alignItems="center" gap="$0.5">
                <Star size={16} color="#fadb14" fill="#fadb14" />
                <Text fontSize="$4" fontWeight="600" color={COLORS.text}>{lawyer.rating.toFixed(1)}</Text>
              </XStack>
            </XStack>

            <Text fontSize="$3" color={COLORS.textSecondary} marginBottom="$2" numberOfLines={1}>
              {lawyer.lawFirm}
            </Text>

            <XStack flexWrap="wrap" gap="$1.5" marginBottom="$2">
              {lawyer.specialties.slice(0, 3).map(specialty => renderSpecialtyBadge(specialty))}
              {lawyer.specialties.length > 3 && (
                <Text fontSize="$1" color={COLORS.textSecondary} paddingHorizontal="$1.5">
                  +{lawyer.specialties.length - 3}
                </Text>
              )}
            </XStack>

            <XStack gap="$3" marginBottom="$3">
              <XStack alignItems="center" gap="$0.5">
                <Briefcase size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color={COLORS.textSecondary}>{lawyer.yearsOfExperience}年经验</Text>
              </XStack>
              <XStack alignItems="center" gap="$0.5">
                <Users size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color={COLORS.textSecondary}>{lawyer.caseCount}个案件</Text>
              </XStack>
              <XStack alignItems="center" gap="$0.5">
                <MessageCircle size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color={COLORS.textSecondary}>{lawyer.reviewCount}条评价</Text>
              </XStack>
            </XStack>

            <XStack alignItems="center" justifyContent="space-between">
              <XStack alignItems="baseline" gap="$1">
                <Text fontSize="$2" color={COLORS.textSecondary}>图文咨询</Text>
                <Text fontSize="$6" fontWeight="bold" color={COLORS.error}>¥{lawyer.textConsultationPrice}</Text>
              </XStack>
              <Button
                backgroundColor={COLORS.primary}
                paddingHorizontal="$5"
                paddingVertical="$2"
                borderRadius={16}
                onPress={() => navigation.navigate('LawyerDetail', { lawyerId: lawyer.id })}
                pressStyle={{ scale: 0.95 }}
              >
                <Text fontSize="$4" fontWeight="500" color="white">立即咨询</Text>
              </Button>
            </XStack>
          </YStack>
        </XStack>
      </Card>
    );
  };

  const renderFilters = () => {
    return (
      <YStack backgroundColor="$cardBg" paddingBottom="$3" borderBottomWidth={8} borderBottomColor={COLORS.background}>
        <Text fontSize="$4" fontWeight="600" color={COLORS.text} paddingHorizontal="$4" paddingTop="$4" paddingBottom="$3">
          专业领域
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} paddingHorizontal="$4">
          <XStack gap="$2">
            {SPECIALTY_OPTIONS.map(option => {
              const IconComponent = getIconForSpecialty(option.icon);
              const isActive = selectedSpecialty === option.value;
              return (
                <Button
                  key={option.value}
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  backgroundColor={isActive ? COLORS.primary : COLORS.surface}
                  borderRadius={16}
                  borderWidth={1}
                  borderColor={isActive ? COLORS.primary : COLORS.surface}
                  onPress={() => setSelectedSpecialty(option.value)}
                  pressStyle={{ scale: 0.95 }}
                >
                  <XStack alignItems="center" gap="$1">
                    <IconComponent size={16} color={isActive ? 'white' : COLORS.textSecondary} />
                    <Text fontSize="$3" color={isActive ? 'white' : COLORS.textSecondary} fontWeight={isActive ? '500' : '400'}>
                      {option.label}
                    </Text>
                  </XStack>
                </Button>
              );
            })}
          </XStack>
        </ScrollView>

        <XStack paddingHorizontal="$4" paddingTop="$3" gap="$3">
          <Button
            paddingHorizontal="$3"
            paddingVertical="$1.5"
            backgroundColor={onlineOnly ? '#f0f9ff' : COLORS.surface}
            borderRadius={16}
            borderWidth={1}
            borderColor={onlineOnly ? COLORS.success : COLORS.surface}
            onPress={() => setOnlineOnly(!onlineOnly)}
            pressStyle={{ scale: 0.95 }}
          >
            <XStack alignItems="center" gap="$1">
              <CheckCircle size={16} color={onlineOnly ? COLORS.success : COLORS.textSecondary} />
              <Text fontSize="$3" color={onlineOnly ? COLORS.success : COLORS.textSecondary} fontWeight={onlineOnly ? '500' : '400'}>
                仅在线
              </Text>
            </XStack>
          </Button>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              {SORT_OPTIONS.map(option => {
                const isActive = sortType === option.value;
                return (
                  <Button
                    key={option.value}
                    paddingHorizontal="$2.5"
                    paddingVertical="$1.5"
                    backgroundColor={isActive ? `${COLORS.primary}15` : COLORS.surface}
                    borderRadius={14}
                    onPress={() => setSortType(option.value)}
                    pressStyle={{ scale: 0.95 }}
                  >
                    <Text fontSize="$2" color={isActive ? COLORS.primary : COLORS.textSecondary} fontWeight={isActive ? '500' : '400'}>
                      {option.label}
                    </Text>
                  </Button>
                );
              })}
            </XStack>
          </ScrollView>
        </XStack>

        <Text fontSize="$3" color={COLORS.textSecondary} paddingHorizontal="$4" paddingTop="$3">
          共找到 {filteredAndSortedLawyers.length} 位律师
          {onlineOnly && (
            <Text color={COLORS.success}>
              {' '}({filteredAndSortedLawyers.filter(l => l.isOnline).length} 位在线)
            </Text>
          )}
        </Text>
      </YStack>
    );
  };

  const renderEmptyState = () => {
    return (
      <YStack alignItems="center" justifyContent="center" paddingVertical="$15">
        <Users size={80} color={COLORS.border} />
        <Text fontSize="$5" color={COLORS.textSecondary} marginTop="$4">暂无符合条件的律师</Text>
        <Text fontSize="$3" color={COLORS.border} marginTop="$2">尝试调整筛选条件</Text>
        <Button
          marginTop="$6"
          paddingHorizontal="$6"
          paddingVertical="$2.5"
          backgroundColor={COLORS.primary}
          borderRadius={20}
          onPress={() => {
            setSelectedSpecialty('all');
            setOnlineOnly(false);
            setSortType('default');
          }}
          pressStyle={{ scale: 0.98 }}
        >
          <Text fontSize="$4" color="white" fontWeight="500">重置筛选</Text>
        </Button>
      </YStack>
    );
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor="$cardBg"
          borderBottomWidth={1}
          borderBottomColor={COLORS.border}
        >
          <Button chromeless padding="$1" onPress={() => navigation.goBack()} pressStyle={{ opacity: 0.6 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </Button>
          <Text fontSize="$6" fontWeight="bold" color={COLORS.text}>专业律师</Text>
          <Button chromeless padding="$1" onPress={() => navigation.navigate('AILegalAssistant')} pressStyle={{ opacity: 0.6 }}>
            <MessageSquare size={22} color={COLORS.primary} />
          </Button>
        </XStack>

        {loading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text marginTop="$3" fontSize="$4" color={COLORS.textSecondary}>加载律师列表...</Text>
          </YStack>
        ) : (
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            {renderFilters()}
            {filteredAndSortedLawyers.length > 0 ? (
              <YStack padding="$4" gap="$3">
                {filteredAndSortedLawyers.map(lawyer => renderLawyerCard(lawyer))}
              </YStack>
            ) : (
              renderEmptyState()
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Theme>
  );
};

export default LawyerListScreen;
