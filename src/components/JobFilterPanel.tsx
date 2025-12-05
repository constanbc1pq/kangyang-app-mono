/**
 * 零工需求筛选面板组件
 * 支持多维度筛选：服务类型、价格区间、距离、时间、排序方式等
 */

import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { YStack, XStack, Text, View, Button, Separator, useTheme } from 'tamagui';
import { Check } from 'lucide-react-native';
import { ServiceType, JobType } from '@/types/community';
import { BottomSheet } from './BottomSheet';

export interface JobFilters {
  serviceTypes: ServiceType[];
  jobTypes: JobType[];
  minBudget?: number;
  maxBudget?: number;
  distance?: number;
  isUrgent?: boolean;
  isHighReward?: boolean;
  sortBy?: 'createdAt' | 'budget' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

interface JobFilterPanelProps {
  visible: boolean;
  filters: JobFilters;
  onClose: () => void;
  onApply: (filters: JobFilters) => void;
  onReset: () => void;
}

export const JobFilterPanel: React.FC<JobFilterPanelProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  const [selectedServiceTypes, setSelectedServiceTypes] = useState<ServiceType[]>(
    filters.serviceTypes || []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>(
    filters.jobTypes || []
  );
  const [minBudget, setMinBudget] = useState<number | undefined>(filters.minBudget);
  const [maxBudget, setMaxBudget] = useState<number | undefined>(filters.maxBudget);
  const [distance, setDistance] = useState<number | undefined>(filters.distance);
  const [isUrgent, setIsUrgent] = useState<boolean>(filters.isUrgent || false);
  const [isHighReward, setIsHighReward] = useState<boolean>(filters.isHighReward || false);
  const [sortBy, setSortBy] = useState<JobFilters['sortBy']>(filters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState<JobFilters['sortOrder']>(
    filters.sortOrder || 'desc'
  );

  const serviceTypeOptions: { value: ServiceType; label: string }[] = [
    { value: 'COMPANION', label: '陪护陪伴' },
    { value: 'HEALTH', label: '健康服务' },
    { value: 'HOUSEKEEPING', label: '生活服务' },
    { value: 'TEACHING', label: '教学培训' },
    { value: 'OTHER', label: '其他服务' },
  ];

  const jobTypeOptions: { value: JobType; label: string }[] = [
    { value: 'MEDICAL_ESCORT', label: '陪诊就医' },
    { value: 'CHAT_COMPANION', label: '陪聊陪伴' },
    { value: 'CARE', label: '日常照护' },
    { value: 'MASSAGE', label: '按摩推拿' },
    { value: 'REHABILITATION', label: '康复理疗' },
    { value: 'HEALTH_CONSULTATION', label: '健康咨询' },
    { value: 'MEAL_PREPARATION', label: '配餐送餐' },
    { value: 'CLEANING', label: '家政保洁' },
    { value: 'REPAIR', label: '维修安装' },
    { value: 'TAICHI', label: '太极教学' },
    { value: 'DANCE', label: '广场舞教学' },
    { value: 'PHONE_TEACHING', label: '手机教学' },
    { value: 'OTHER', label: '其他' },
  ];

  const distanceOptions = [
    { value: 1, label: '1公里内' },
    { value: 3, label: '3公里内' },
    { value: 5, label: '5公里内' },
    { value: 10, label: '10公里内' },
    { value: 20, label: '20公里内' },
  ];

  const budgetOptions = [
    { min: 0, max: 50, label: '50元以下' },
    { min: 50, max: 100, label: '50-100元' },
    { min: 100, max: 200, label: '100-200元' },
    { min: 200, max: 500, label: '200-500元' },
    { min: 500, max: undefined, label: '500元以上' },
  ];

  const sortOptions: { value: JobFilters['sortBy']; label: string }[] = [
    { value: 'createdAt', label: '最新发布' },
    { value: 'budget', label: '价格' },
    { value: 'distance', label: '距离' },
  ];

  const toggleServiceType = (type: ServiceType) => {
    if (selectedServiceTypes.includes(type)) {
      setSelectedServiceTypes(selectedServiceTypes.filter((t) => t !== type));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, type]);
    }
  };

  const toggleJobType = (type: JobType) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter((t) => t !== type));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
    }
  };

  const handleApply = () => {
    const appliedFilters: JobFilters = {
      serviceTypes: selectedServiceTypes,
      jobTypes: selectedJobTypes,
      minBudget,
      maxBudget,
      distance,
      isUrgent,
      isHighReward,
      sortBy,
      sortOrder,
    };
    onApply(appliedFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedServiceTypes([]);
    setSelectedJobTypes([]);
    setMinBudget(undefined);
    setMaxBudget(undefined);
    setDistance(undefined);
    setIsUrgent(false);
    setIsHighReward(false);
    setSortBy('createdAt');
    setSortOrder('desc');
    onReset();
  };

  // 渲染筛选标签
  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress} key={label}>
      <View
        backgroundColor={isSelected ? primaryColor : '$color2'}
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

  // 渲染开关选项
  const renderSwitch = (
    label: string,
    isActive: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$3" color="$color12">
          {label}
        </Text>
        <View
          width={50}
          height={28}
          borderRadius="$10"
          backgroundColor={isActive ? primaryColor : '$color5'}
          padding={2}
          justifyContent="center"
        >
          <View
            width={24}
            height={24}
            borderRadius="$10"
            backgroundColor="white"
            alignSelf={isActive ? 'flex-end' : 'flex-start'}
          />
        </View>
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
            确认
          </Button>
        </XStack>
      }
    >
      <YStack gap="$4">
        {/* 服务大类 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            服务大类
          </Text>
          <XStack flexWrap="wrap">
            {serviceTypeOptions.map((option) =>
              renderFilterChip(
                option.label,
                selectedServiceTypes.includes(option.value),
                () => toggleServiceType(option.value)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 具体服务 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            具体服务
          </Text>
          <XStack flexWrap="wrap">
            {jobTypeOptions.map((option) =>
              renderFilterChip(
                option.label,
                selectedJobTypes.includes(option.value),
                () => toggleJobType(option.value)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 价格区间 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            价格区间
          </Text>
          <XStack flexWrap="wrap">
            {budgetOptions.map((option, index) =>
              renderFilterChip(
                option.label,
                minBudget === option.min && maxBudget === option.max,
                () => {
                  setMinBudget(option.min);
                  setMaxBudget(option.max);
                }
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 距离范围 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            距离范围
          </Text>
          <XStack flexWrap="wrap">
            {distanceOptions.map((option) =>
              renderFilterChip(
                option.label,
                distance === option.value,
                () => setDistance(option.value)
              )
            )}
          </XStack>
        </YStack>

        <Separator borderColor="$color5" />

        {/* 特殊筛选 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            特殊筛选
          </Text>
          <YStack gap="$2">
            {renderSwitch('仅显示紧急需求', isUrgent, () => setIsUrgent(!isUrgent))}
            {renderSwitch('仅显示高佣金', isHighReward, () => setIsHighReward(!isHighReward))}
          </YStack>
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
                sortBy === option.value,
                () => setSortBy(option.value)
              )
            )}
          </XStack>

          {/* 排序顺序 */}
          <XStack gap="$2" marginTop="$2">
            <Pressable onPress={() => setSortOrder('desc')} style={{ flex: 1 }}>
              <View
                padding="$2"
                borderRadius="$3"
                borderWidth={1}
                borderColor={sortOrder === 'desc' ? primaryColor : '$color5'}
                backgroundColor={sortOrder === 'desc' ? primaryColor : '$color2'}
                alignItems="center"
              >
                <Text
                  fontSize="$3"
                  color={sortOrder === 'desc' ? 'white' : '$color12'}
                  fontWeight={sortOrder === 'desc' ? '600' : '400'}
                >
                  降序
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setSortOrder('asc')} style={{ flex: 1 }}>
              <View
                padding="$2"
                borderRadius="$3"
                borderWidth={1}
                borderColor={sortOrder === 'asc' ? primaryColor : '$color5'}
                backgroundColor={sortOrder === 'asc' ? primaryColor : '$color2'}
                alignItems="center"
              >
                <Text
                  fontSize="$3"
                  color={sortOrder === 'asc' ? 'white' : '$color12'}
                  fontWeight={sortOrder === 'asc' ? '600' : '400'}
                >
                  升序
                </Text>
              </View>
            </Pressable>
          </XStack>
        </YStack>
      </YStack>
    </BottomSheet>
  );
};
