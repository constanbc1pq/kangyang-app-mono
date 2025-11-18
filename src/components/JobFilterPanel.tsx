import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { YStack, XStack, Button } from 'tamagui';
import { X } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ServiceType, JobType } from '@/types/community';

export interface JobFilters {
  serviceTypes: ServiceType[];
  jobTypes: JobType[];
  minBudget?: number;
  maxBudget?: number;
  distance?: number; // km
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

/**
 * 零工需求筛选面板组件
 * 支持多维度筛选：服务类型、价格区间、距离、时间、排序方式等
 */
export const JobFilterPanel: React.FC<JobFilterPanelProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
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

  // 服务大类选项
  const serviceTypeOptions: { value: ServiceType; label: string }[] = [
    { value: 'COMPANION', label: '陪护陪伴' },
    { value: 'HEALTH', label: '健康服务' },
    { value: 'HOUSEKEEPING', label: '生活服务' },
    { value: 'TEACHING', label: '教学培训' },
    { value: 'OTHER', label: '其他服务' },
  ];

  // 具体服务类型选项
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

  // 距离选项
  const distanceOptions = [
    { value: 1, label: '1公里内' },
    { value: 3, label: '3公里内' },
    { value: 5, label: '5公里内' },
    { value: 10, label: '10公里内' },
    { value: 20, label: '20公里内' },
  ];

  // 价格区间选项
  const budgetOptions = [
    { min: 0, max: 50, label: '50元以下' },
    { min: 50, max: 100, label: '50-100元' },
    { min: 100, max: 200, label: '100-200元' },
    { min: 200, max: 500, label: '200-500元' },
    { min: 500, max: undefined, label: '500元以上' },
  ];

  // 排序方式选项
  const sortOptions: { value: JobFilters['sortBy']; label: string }[] = [
    { value: 'createdAt', label: '最新发布' },
    { value: 'budget', label: '价格' },
    { value: 'distance', label: '距离' },
  ];

  // 切换服务大类选择
  const toggleServiceType = (type: ServiceType) => {
    if (selectedServiceTypes.includes(type)) {
      setSelectedServiceTypes(selectedServiceTypes.filter((t) => t !== type));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, type]);
    }
  };

  // 切换具体服务类型选择
  const toggleJobType = (type: JobType) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter((t) => t !== type));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
    }
  };

  // 应用筛选
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

  // 重置筛选
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

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 顶部标题栏 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>筛选条件</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* 筛选内容 */}
          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* 服务大类 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>服务大类</Text>
              <View style={styles.optionGrid}>
                {serviceTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      selectedServiceTypes.includes(option.value) && styles.optionChipSelected,
                    ]}
                    onPress={() => toggleServiceType(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedServiceTypes.includes(option.value) &&
                          styles.optionChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 具体服务 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>具体服务</Text>
              <View style={styles.optionGrid}>
                {jobTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      selectedJobTypes.includes(option.value) && styles.optionChipSelected,
                    ]}
                    onPress={() => toggleJobType(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedJobTypes.includes(option.value) &&
                          styles.optionChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 价格区间 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>价格区间</Text>
              <View style={styles.optionGrid}>
                {budgetOptions.map((option, index) => {
                  const isSelected =
                    minBudget === option.min && maxBudget === option.max;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                      onPress={() => {
                        setMinBudget(option.min);
                        setMaxBudget(option.max);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.optionChipTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 距离筛选 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>距离范围</Text>
              <View style={styles.optionGrid}>
                {distanceOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      distance === option.value && styles.optionChipSelected,
                    ]}
                    onPress={() => setDistance(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        distance === option.value && styles.optionChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 认证筛选 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>特殊筛选</Text>
              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>仅显示紧急需求</Text>
                  <TouchableOpacity
                    style={[styles.switch, isUrgent && styles.switchActive]}
                    onPress={() => setIsUrgent(!isUrgent)}
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        isUrgent && styles.switchThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>仅显示高佣金</Text>
                  <TouchableOpacity
                    style={[styles.switch, isHighReward && styles.switchActive]}
                    onPress={() => setIsHighReward(!isHighReward)}
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        isHighReward && styles.switchThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 排序方式 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>排序方式</Text>
              <View style={styles.optionGrid}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      sortBy === option.value && styles.optionChipSelected,
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        sortBy === option.value && styles.optionChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 排序顺序 */}
              <XStack space="$2" marginTop="$2">
                <TouchableOpacity
                  style={[
                    styles.sortOrderButton,
                    sortOrder === 'desc' && styles.sortOrderButtonActive,
                  ]}
                  onPress={() => setSortOrder('desc')}
                >
                  <Text
                    style={[
                      styles.sortOrderButtonText,
                      sortOrder === 'desc' && styles.sortOrderButtonTextActive,
                    ]}
                  >
                    降序
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOrderButton,
                    sortOrder === 'asc' && styles.sortOrderButtonActive,
                  ]}
                  onPress={() => setSortOrder('asc')}
                >
                  <Text
                    style={[
                      styles.sortOrderButtonText,
                      sortOrder === 'asc' && styles.sortOrderButtonTextActive,
                    ]}
                  >
                    升序
                  </Text>
                </TouchableOpacity>
              </XStack>
            </View>
          </ScrollView>

          {/* 底部操作栏 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: 'white',
  },
  optionChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionChipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  optionChipTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  switchContainer: {
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderColor,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: COLORS.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  sortOrderButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  sortOrderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOrderButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  sortOrderButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
