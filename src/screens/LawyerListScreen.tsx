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
 * Design: Following CLAUDE.md specs
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Alert, Image as RNImage, ActivityIndicator, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
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
  MessageCircle,
  Pill,
  ChevronRight,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LawyerProfile, LawyerSpecialty } from '../types/legalService';
import { getLawyers } from '../services/legalService';
import { getAvatarSource } from '@/constants/avatars';
import { TitleBar } from '@/components/TitleBar';

const GOLD_COLOR = '#D4AF37';

interface Props {
  navigation: any;
}

type SortType = 'default' | 'price_asc' | 'price_desc' | 'rating_desc';

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

const SORT_OPTIONS = [
  { value: 'default' as SortType, label: '默认排序' },
  { value: 'rating_desc' as SortType, label: '评分最高' },
  { value: 'price_asc' as SortType, label: '价格最低' },
  { value: 'price_desc' as SortType, label: '价格最高' },
];

const LawyerListScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortType, setSortType] = useState<SortType>('default');

  useFocusEffect(
    React.useCallback(() => {
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
        paddingHorizontal="$1.5"
        paddingVertical="$0.5"
        borderRadius="$10"
        gap="$0.5"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <IconComponent size={10} color={primaryColor} />
        <Text fontSize={10} color="$primary">{option.label}</Text>
      </XStack>
    );
  };

  const renderLawyerCard = (lawyer: LawyerProfile) => {
    return (
      <Pressable
        key={lawyer.id}
        onPress={() => navigation.navigate('LawyerDetail', { lawyerId: lawyer.id })}
      >
        <View
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
          position="relative"
        >
          {lawyer.isOnline && (
            <View
              position="absolute"
              top={10}
              right={10}
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor="$success"
            />
          )}

          <XStack gap="$2.5">
            <View position="relative">
              <View width={72} height={72} borderRadius="$3" overflow="hidden">
                <RNImage
                  source={getAvatarSource(lawyer.avatar, lawyer.name)}
                  style={{ width: 72, height: 72 }}
                  resizeMode="cover"
                />
              </View>
              {lawyer.isOnline && (
                <View
                  position="absolute"
                  bottom={-4}
                  left={0}
                  right={0}
                  backgroundColor="$success"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                >
                  <Text fontSize={10} color="white" textAlign="center" fontWeight="500">
                    在线
                  </Text>
                </View>
              )}
            </View>

            <YStack flex={1} gap="$1">
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$4" fontWeight="700" color="$color12">{lawyer.name}</Text>
                <XStack alignItems="center" gap="$0.5">
                  <Star size={14} color={GOLD_COLOR} fill={GOLD_COLOR} />
                  <Text fontSize="$3" fontWeight="600" color="$color12">{lawyer.rating.toFixed(1)}</Text>
                </XStack>
              </XStack>

              <Text fontSize="$2" color="$color10" numberOfLines={1}>
                {lawyer.lawFirm}
              </Text>

              <XStack flexWrap="wrap" gap="$1">
                {lawyer.specialties.slice(0, 2).map(specialty => renderSpecialtyBadge(specialty))}
                {lawyer.specialties.length > 2 && (
                  <Text fontSize={10} color="$color10">
                    +{lawyer.specialties.length - 2}
                  </Text>
                )}
              </XStack>

              <XStack gap="$2.5">
                <XStack alignItems="center" gap="$0.5">
                  <Briefcase size={12} color={color10} />
                  <Text fontSize="$2" color="$color10">{lawyer.yearsOfExperience}年</Text>
                </XStack>
                <XStack alignItems="center" gap="$0.5">
                  <Users size={12} color={color10} />
                  <Text fontSize="$2" color="$color10">{lawyer.caseCount}案件</Text>
                </XStack>
                <XStack alignItems="center" gap="$0.5">
                  <MessageCircle size={12} color={color10} />
                  <Text fontSize="$2" color="$color10">{lawyer.reviewCount}评价</Text>
                </XStack>
              </XStack>

              <XStack alignItems="center" justifyContent="space-between" marginTop="$0.5">
                <XStack alignItems="baseline" gap="$1">
                  <Text fontSize="$2" color="$color10">图文咨询</Text>
                  <Text fontSize="$4" fontWeight="700" color="$error">¥{lawyer.textConsultationPrice}</Text>
                </XStack>
                <View
                  backgroundColor="$primary"
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                >
                  <Text fontSize="$3" fontWeight="500" color="white">立即咨询</Text>
                </View>
              </XStack>
            </YStack>
          </XStack>
        </View>
      </Pressable>
    );
  };

  const renderFilters = () => {
    return (
      <YStack backgroundColor="$color2" paddingBottom="$2" borderBottomWidth={1} borderBottomColor="$color5">
        <Text fontSize="$3" fontWeight="600" color="$color12" paddingHorizontal="$2.5" paddingTop="$2" paddingBottom="$1.5">
          专业领域
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$1.5" paddingHorizontal="$2.5">
            {SPECIALTY_OPTIONS.map(option => {
              const IconComponent = getIconForSpecialty(option.icon);
              const isActive = selectedSpecialty === option.value;
              return (
                <Pressable key={option.value} onPress={() => setSelectedSpecialty(option.value)}>
                  <View
                    paddingHorizontal="$2.5"
                    paddingVertical="$1.5"
                    backgroundColor={isActive ? '$primary' : '$color4'}
                    borderRadius="$10"
                  >
                    <XStack alignItems="center" gap="$1">
                      <IconComponent size={14} color={isActive ? 'white' : color10} />
                      <Text
                        fontSize="$2"
                        color={isActive ? 'white' : '$color10'}
                        fontWeight={isActive ? '500' : '400'}
                      >
                        {option.label}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>

        <XStack paddingHorizontal="$2.5" paddingTop="$2" gap="$2">
          <Pressable onPress={() => setOnlineOnly(!onlineOnly)}>
            <View
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              borderRadius="$10"
              borderWidth={1}
              borderColor={onlineOnly ? '$success' : '$color5'}
              style={{ backgroundColor: onlineOnly ? `${successColor}15` : undefined }}
            >
              <XStack alignItems="center" gap="$1">
                <CheckCircle size={14} color={onlineOnly ? successColor : color10} />
                <Text
                  fontSize="$2"
                  color={onlineOnly ? '$success' : '$color10'}
                  fontWeight={onlineOnly ? '500' : '400'}
                >
                  仅在线
                </Text>
              </XStack>
            </View>
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$1.5">
              {SORT_OPTIONS.map(option => {
                const isActive = sortType === option.value;
                return (
                  <Pressable key={option.value} onPress={() => setSortType(option.value)}>
                    <View
                      paddingHorizontal="$2"
                      paddingVertical="$1.5"
                      borderRadius="$10"
                      style={{ backgroundColor: isActive ? `${primaryColor}15` : undefined }}
                    >
                      <Text
                        fontSize="$2"
                        color={isActive ? '$primary' : '$color10'}
                        fontWeight={isActive ? '500' : '400'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
          </ScrollView>
        </XStack>

        <Text fontSize="$2" color="$color10" paddingHorizontal="$2.5" paddingTop="$2">
          共找到 {filteredAndSortedLawyers.length} 位律师
          {onlineOnly && (
            <Text color="$success">
              {' '}({filteredAndSortedLawyers.filter(l => l.isOnline).length} 位在线)
            </Text>
          )}
        </Text>
      </YStack>
    );
  };

  const renderEmptyState = () => {
    return (
      <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
        <Users size={64} color={color10} />
        <Text fontSize="$4" color="$color10" marginTop="$3">暂无符合条件的律师</Text>
        <Text fontSize="$2" color="$color10" marginTop="$1">尝试调整筛选条件</Text>
        <Pressable
          style={{ marginTop: 24 }}
          onPress={() => {
            setSelectedSpecialty('all');
            setOnlineOnly(false);
            setSortType('default');
          }}
        >
          <View
            paddingHorizontal="$4"
            paddingVertical="$2"
            backgroundColor="$primary"
            borderRadius="$10"
          >
            <Text fontSize="$3" color="white" fontWeight="500">重置筛选</Text>
          </View>
        </Pressable>
      </YStack>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="专业律师"
          actions={[
            {
              icon: MessageSquare,
              onPress: () => navigation.navigate('AILegalAssistant'),
            },
          ]}
        />
      </View>

      {loading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text marginTop="$2" fontSize="$3" color="$color10">加载律师列表...</Text>
        </YStack>
      ) : (
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {renderFilters()}
          {filteredAndSortedLawyers.length > 0 ? (
            <YStack padding="$2.5" gap="$2">
              {filteredAndSortedLawyers.map(lawyer => renderLawyerCard(lawyer))}
            </YStack>
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default LawyerListScreen;
