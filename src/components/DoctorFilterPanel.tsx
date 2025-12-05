/**
 * Doctor Filter Panel Component
 * Phase 21: 医生筛选面板 - 多维度筛选条件
 *
 * 功能：
 * - 医院等级筛选
 * - 价格区间筛选
 * - 在线状态筛选
 * - 海外进修筛选
 * - 重置和应用筛选
 */

import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, View, Button, Separator, useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { HospitalLevel } from '@/types/privateDoctor';
import { BottomSheet } from './BottomSheet';

interface FilterOptions {
  departments?: string[];
  hospitalLevel?: HospitalLevel;
  minPrice?: number;
  maxPrice?: number;
  isOnline?: boolean;
  hasOverseasTraining?: boolean;
  specialTags?: string[];
  sortBy?: 'comprehensive' | 'price' | 'rating' | 'subscribers';
}

interface DoctorFilterPanelProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export const DoctorFilterPanel: React.FC<DoctorFilterPanelProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
  }, [visible, initialFilters]);

  const departments = [
    { value: 'cardiology', label: '心血管内科' },
    { value: 'endocrinology', label: '内分泌科' },
    { value: 'gastroenterology', label: '消化内科' },
    { value: 'neurology', label: '神经内科' },
    { value: 'orthopedics', label: '骨科' },
    { value: 'oncology', label: '肿瘤科' },
    { value: 'pediatrics', label: '儿科' },
    { value: 'gynecology', label: '妇产科' },
  ];

  const hospitalLevels = [
    { value: HospitalLevel.TERTIARY_A, label: '三甲医院' },
    { value: HospitalLevel.INTERNATIONAL, label: '国际医院' },
    { value: HospitalLevel.PRIVATE, label: '私立医院' },
  ];

  const priceRanges = [
    { minPrice: undefined, maxPrice: 20000, label: '2万以下' },
    { minPrice: 20000, maxPrice: 50000, label: '2-5万' },
    { minPrice: 50000, maxPrice: 100000, label: '5-10万' },
    { minPrice: 100000, maxPrice: undefined, label: '10万以上' },
  ];

  const specialTags = [
    { value: 'overseas', label: '海外背景' },
    { value: 'expert_consultation', label: '专家会诊' },
    { value: 'home_service', label: '上门服务' },
    { value: 'academic_leader', label: '学科带头人' },
  ];

  const sortOptions = [
    { value: 'comprehensive', label: '综合排序' },
    { value: 'price', label: '价格优先' },
    { value: 'rating', label: '评分最高' },
    { value: 'subscribers', label: '会员最多' },
  ];

  const handleHospitalLevelSelect = (level: HospitalLevel) => {
    setFilters((prev) => ({
      ...prev,
      hospitalLevel: prev.hospitalLevel === level ? undefined : level,
    }));
  };

  const handlePriceRangeSelect = (minPrice?: number, maxPrice?: number) => {
    setFilters((prev) => {
      if (prev.minPrice === minPrice && prev.maxPrice === maxPrice) {
        const { minPrice: _, maxPrice: __, ...rest } = prev;
        return rest;
      }
      return { ...prev, minPrice, maxPrice };
    });
  };

  const handleOnlineToggle = () => {
    setFilters((prev) => ({
      ...prev,
      isOnline: prev.isOnline ? undefined : true,
    }));
  };

  const handleOverseasToggle = () => {
    setFilters((prev) => ({
      ...prev,
      hasOverseasTraining: prev.hasOverseasTraining ? undefined : true,
    }));
  };

  const handleDepartmentToggle = (dept: string) => {
    setFilters((prev) => {
      const currentDepts = prev.departments || [];
      const newDepts = currentDepts.includes(dept)
        ? currentDepts.filter((d) => d !== dept)
        : [...currentDepts, dept];
      return {
        ...prev,
        departments: newDepts.length > 0 ? newDepts : undefined,
      };
    });
  };

  const handleSpecialTagToggle = (tag: string) => {
    setFilters((prev) => {
      const currentTags = prev.specialTags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return {
        ...prev,
        specialTags: newTags.length > 0 ? newTags : undefined,
      };
    });
  };

  const handleSortBySelect = (sort: FilterOptions['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === sort ? undefined : sort,
    }));
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.departments && filters.departments.length > 0) count++;
    if (filters.hospitalLevel) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.isOnline) count++;
    if (filters.hasOverseasTraining) count++;
    if (filters.specialTags && filters.specialTags.length > 0) count++;
    if (filters.sortBy) count++;
    return count;
  };

  // 渲染筛选标签
  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress}>
      <View
        backgroundColor={isSelected ? primaryColor : '$color1'}
        paddingHorizontal="$2"
        paddingVertical="$1.5"
        borderRadius="$3"
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

  // 渲染复选框选项
  const renderCheckbox = (
    label: string,
    isChecked: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        padding="$2"
        backgroundColor="$color1"
        borderRadius="$3"
        borderWidth={1}
        borderColor={isChecked ? primaryColor : '$color5'}
      >
        <XStack gap="$2" alignItems="center">
          <View
            width={20}
            height={20}
            borderRadius="$10"
            borderWidth={2}
            borderColor={isChecked ? primaryColor : '$color6'}
            backgroundColor={isChecked ? primaryColor : 'transparent'}
            justifyContent="center"
            alignItems="center"
          >
            {isChecked && <Check size={12} color="white" />}
          </View>
          <Text fontSize="$3" color="$color12">
            {label}
          </Text>
        </XStack>
      </XStack>
    </Pressable>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="筛选条件"
      variant="filter"
      headerRight={
        <Pressable onPress={handleReset}>
          <Text fontSize="$3" color="$color10">
            重置
          </Text>
        </Pressable>
      }
      footer={
        <XStack gap="$2">
          <Button
            flex={1}
            size="$4"
            backgroundColor="$color4"
            color="$color12"
            borderRadius="$3"
            onPress={handleReset}
          >
            重置
          </Button>
          <Button
            flex={2}
            size="$4"
            backgroundColor="$primary"
            color="white"
            borderRadius="$3"
            fontWeight="600"
            onPress={handleApply}
          >
            应用筛选{getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$4">
        {/* 科室分类 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            科室分类
          </Text>
          <XStack flexWrap="wrap">
            {departments.map((dept) =>
              renderFilterChip(
                dept.label,
                filters.departments?.includes(dept.value) || false,
                () => handleDepartmentToggle(dept.value)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 医院等级 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            医院等级
          </Text>
          <XStack flexWrap="wrap">
            {hospitalLevels.map((level) =>
              renderFilterChip(
                level.label,
                filters.hospitalLevel === level.value,
                () => handleHospitalLevelSelect(level.value)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 价格区间 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            年费区间
          </Text>
          <XStack flexWrap="wrap">
            {priceRanges.map((range, index) =>
              renderFilterChip(
                range.label,
                filters.minPrice === range.minPrice && filters.maxPrice === range.maxPrice,
                () => handlePriceRangeSelect(range.minPrice, range.maxPrice)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 服务特色 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            服务特色
          </Text>
          <YStack gap="$2">
            {renderCheckbox('支持在线咨询', filters.isOnline || false, handleOnlineToggle)}
            {renderCheckbox('有海外进修经历', filters.hasOverseasTraining || false, handleOverseasToggle)}
          </YStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 特殊标签筛选 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            特色服务标签
          </Text>
          <XStack flexWrap="wrap">
            {specialTags.map((tag) =>
              renderFilterChip(
                tag.label,
                filters.specialTags?.includes(tag.value) || false,
                () => handleSpecialTagToggle(tag.value)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 排序方式 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            排序方式
          </Text>
          <XStack flexWrap="wrap">
            {sortOptions.map((option) =>
              renderFilterChip(
                option.label,
                filters.sortBy === option.value,
                () => handleSortBySelect(option.value as FilterOptions['sortBy'])
              )
            )}
          </XStack>
        </YStack>
      </YStack>
    </BottomSheet>
  );
};
