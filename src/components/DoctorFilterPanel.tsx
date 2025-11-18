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
import { YStack, XStack, Text, View, Button, Separator, H4 } from 'tamagui';
import { Modal, Pressable, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { HospitalLevel } from '@/types/privateDoctor';

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
      // 如果点击的是当前选中的价格区间，则取消选择
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        flex={1}
        backgroundColor="rgba(0,0,0,0.5)"
        justifyContent="flex-end"
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onClose}
        />

        <View
          backgroundColor="$background"
          borderTopLeftRadius="$5"
          borderTopRightRadius="$5"
          maxHeight="80%"
        >
          {/* Header */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding="$4"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <H4 fontSize="$5" fontWeight="700" color="$text">
              筛选条件
            </H4>
            <Pressable onPress={onClose}>
              <X size={24} color={COLORS.text} />
            </Pressable>
          </XStack>

          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack padding="$4" space="$4">
              {/* 科室分类 */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  科室分类
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {departments.map((dept) => {
                    const isSelected = filters.departments?.includes(dept.value);
                    return (
                      <Pressable
                        key={dept.value}
                        onPress={() => handleDepartmentToggle(dept.value)}
                      >
                        <View
                          backgroundColor={
                            isSelected ? COLORS.primary : '$surface'
                          }
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={
                            isSelected ? COLORS.primary : '$borderColor'
                          }
                          marginBottom="$2"
                        >
                          <XStack space="$1" alignItems="center">
                            {isSelected && (
                              <Check size={14} color="white" />
                            )}
                            <Text
                              fontSize="$3"
                              color={isSelected ? 'white' : '$text'}
                              fontWeight={isSelected ? '600' : '400'}
                            >
                              {dept.label}
                            </Text>
                          </XStack>
                        </View>
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>

              <Separator borderColor="$borderColor" />

              {/* 医院等级 */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  医院等级
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {hospitalLevels.map((level) => {
                    const isSelected = filters.hospitalLevel === level.value;
                    return (
                      <Pressable
                        key={level.value}
                        onPress={() => handleHospitalLevelSelect(level.value)}
                      >
                        <View
                          backgroundColor={
                            isSelected ? COLORS.primary : '$surface'
                          }
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={
                            isSelected ? COLORS.primary : '$borderColor'
                          }
                          marginBottom="$2"
                        >
                          <XStack space="$1" alignItems="center">
                            {isSelected && (
                              <Check size={14} color="white" />
                            )}
                            <Text
                              fontSize="$3"
                              color={isSelected ? 'white' : '$text'}
                              fontWeight={isSelected ? '600' : '400'}
                            >
                              {level.label}
                            </Text>
                          </XStack>
                        </View>
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>

              <Separator borderColor="$borderColor" />

              {/* 价格区间 */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  年费区间
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {priceRanges.map((range, index) => {
                    const isSelected =
                      filters.minPrice === range.minPrice &&
                      filters.maxPrice === range.maxPrice;
                    return (
                      <Pressable
                        key={index}
                        onPress={() =>
                          handlePriceRangeSelect(range.minPrice, range.maxPrice)
                        }
                      >
                        <View
                          backgroundColor={
                            isSelected ? COLORS.primary : '$surface'
                          }
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={
                            isSelected ? COLORS.primary : '$borderColor'
                          }
                          marginBottom="$2"
                        >
                          <XStack space="$1" alignItems="center">
                            {isSelected && (
                              <Check size={14} color="white" />
                            )}
                            <Text
                              fontSize="$3"
                              color={isSelected ? 'white' : '$text'}
                              fontWeight={isSelected ? '600' : '400'}
                            >
                              {range.label}
                            </Text>
                          </XStack>
                        </View>
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>

              <Separator borderColor="$borderColor" />

              {/* 服务特色 */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  服务特色
                </Text>

                {/* 在线咨询 */}
                <Pressable onPress={handleOnlineToggle}>
                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    padding="$3"
                    backgroundColor="$surface"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={
                      filters.isOnline ? COLORS.primary : '$borderColor'
                    }
                  >
                    <XStack space="$2" alignItems="center">
                      <View
                        width={20}
                        height={20}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={
                          filters.isOnline ? COLORS.primary : '$borderColor'
                        }
                        backgroundColor={
                          filters.isOnline ? COLORS.primary : 'transparent'
                        }
                        justifyContent="center"
                        alignItems="center"
                      >
                        {filters.isOnline && (
                          <Check size={12} color="white" />
                        )}
                      </View>
                      <Text fontSize="$3" color="$text">
                        支持在线咨询
                      </Text>
                    </XStack>
                  </XStack>
                </Pressable>

                {/* 海外进修 */}
                <Pressable onPress={handleOverseasToggle}>
                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    padding="$3"
                    backgroundColor="$surface"
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor={
                      filters.hasOverseasTraining
                        ? COLORS.primary
                        : '$borderColor'
                    }
                  >
                    <XStack space="$2" alignItems="center">
                      <View
                        width={20}
                        height={20}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={
                          filters.hasOverseasTraining
                            ? COLORS.primary
                            : '$borderColor'
                        }
                        backgroundColor={
                          filters.hasOverseasTraining
                            ? COLORS.primary
                            : 'transparent'
                        }
                        justifyContent="center"
                        alignItems="center"
                      >
                        {filters.hasOverseasTraining && (
                          <Check size={12} color="white" />
                        )}
                      </View>
                      <Text fontSize="$3" color="$text">
                        有海外进修经历
                      </Text>
                    </XStack>
                  </XStack>
                </Pressable>
              </YStack>

              <Separator borderColor="$borderColor" />

              {/* 特殊标签筛选 */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  特色服务标签
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {specialTags.map((tag) => {
                    const isSelected = filters.specialTags?.includes(tag.value);
                    return (
                      <Pressable
                        key={tag.value}
                        onPress={() => handleSpecialTagToggle(tag.value)}
                      >
                        <View
                          backgroundColor={
                            isSelected ? COLORS.primary : '$surface'
                          }
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={
                            isSelected ? COLORS.primary : '$borderColor'
                          }
                          marginBottom="$2"
                        >
                          <XStack space="$1" alignItems="center">
                            {isSelected && (
                              <Check size={14} color="white" />
                            )}
                            <Text
                              fontSize="$3"
                              color={isSelected ? 'white' : '$text'}
                              fontWeight={isSelected ? '600' : '400'}
                            >
                              {tag.label}
                            </Text>
                          </XStack>
                        </View>
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>

              <Separator borderColor="$borderColor" />

              {/* 排序方式 */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="600" color="$text">
                  排序方式
                </Text>
                <XStack space="$2" flexWrap="wrap">
                  {sortOptions.map((option) => {
                    const isSelected = filters.sortBy === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => handleSortBySelect(option.value as FilterOptions['sortBy'])}
                      >
                        <View
                          backgroundColor={
                            isSelected ? COLORS.primary : '$surface'
                          }
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={
                            isSelected ? COLORS.primary : '$borderColor'
                          }
                          marginBottom="$2"
                        >
                          <XStack space="$1" alignItems="center">
                            {isSelected && (
                              <Check size={14} color="white" />
                            )}
                            <Text
                              fontSize="$3"
                              color={isSelected ? 'white' : '$text'}
                              fontWeight={isSelected ? '600' : '400'}
                            >
                              {option.label}
                            </Text>
                          </XStack>
                        </View>
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>
            </YStack>
          </ScrollView>

          {/* Footer Buttons */}
          <View
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            backgroundColor="$background"
          >
            <XStack space="$3">
              <Button
                flex={1}
                size="$4"
                backgroundColor="$surface"
                color="$text"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                onPress={handleReset}
              >
                重置
              </Button>
              <Button
                flex={2}
                size="$4"
                backgroundColor={COLORS.primary}
                color="white"
                borderRadius="$3"
                fontWeight="600"
                onPress={handleApply}
              >
                应用筛选
                {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
              </Button>
            </XStack>
          </View>
        </View>
      </View>
    </Modal>
  );
};
