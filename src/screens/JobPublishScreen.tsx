/**
 * JobPublishScreen 发布服务需求页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局规范
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  TextArea,
  useTheme,
} from 'tamagui';
import { Pressable, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  User,
  Activity,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import {
  ServiceJob,
  JobType,
  ServiceType,
  JobStatus,
} from '@/types/community';
import { createJob } from '@/services/communityDataService';
import { getFamilyMembers } from '@/services/userDataService';
import { FamilyMember } from '@/types/userData';
import { usePublishLimit } from '@/hooks/useMembershipBenefit';

interface JobPublishScreenProps {
  navigation: any;
}

/**
 * 发布服务需求页面
 * 支持完整的需求发布流程，包括健康档案关联
 */
export const JobPublishScreen: React.FC<JobPublishScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  // 基本信息
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<JobType>(JobType.CARE);
  const [serviceType, setServiceType] = useState<ServiceType>(
    ServiceType.ACCOMPANY_DOCTOR
  );

  // 服务信息
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [serviceDate, setServiceDate] = useState<Date>(new Date());
  const [serviceStartTime, setServiceStartTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  // 日期时间选择器状态
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 特殊要求和健康关联
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // 健康档案关联
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(
    undefined
  );
  const [healthTags, setHealthTags] = useState<string[]>([]);
  const [newHealthTag, setNewHealthTag] = useState('');

  // 状态
  const [loading, setLoading] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  // 发布次数限制 Hook
  const {
    canPublish,
    remaining: publishRemaining,
    limit: publishLimit,
    isUnlimited: isPublishUnlimited,
    recordUsage: recordPublishUsage,
  } = usePublishLimit();

  // 显示发布限制升级提示
  const showPublishLimitAlert = useCallback(() => {
    Alert.alert(
      '本月发布次数已用完',
      `免费用户每月可发布${publishLimit}次内容。升级会员可无限发布！`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '升级会员',
          onPress: () => navigation.navigate('MembershipCenter' as never),
        },
      ]
    );
  }, [publishLimit, navigation]);

  // 加载家庭成员
  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      const members = await getFamilyMembers();
      setFamilyMembers(members);
    } catch (error) {
      console.error('加载家庭成员失败:', error);
    }
  };

  // 服务类型选项
  const jobTypeOptions = [
    { label: '陪护类', value: JobType.CARE },
    { label: '健康服务', value: JobType.HEALTH },
    { label: '生活服务', value: JobType.LIFE },
    { label: '教学类', value: JobType.EDUCATION },
    { label: '其他', value: JobType.OTHER },
  ];

  const serviceTypeOptions = {
    [JobType.CARE]: [
      { label: '陪诊', value: ServiceType.ACCOMPANY_DOCTOR },
      { label: '陪聊', value: ServiceType.ACCOMPANY_CHAT },
      { label: '照护', value: ServiceType.ACCOMPANY_CARE },
    ],
    [JobType.HEALTH]: [
      { label: '按摩', value: ServiceType.MASSAGE },
      { label: '康复', value: ServiceType.REHABILITATION },
      { label: '健康咨询', value: ServiceType.HEALTH_CONSULT },
      { label: '护理', value: ServiceType.NURSING },
    ],
    [JobType.LIFE]: [
      { label: '配餐', value: ServiceType.MEAL_PREP },
      { label: '家政', value: ServiceType.HOUSEKEEPING },
      { label: '维修', value: ServiceType.REPAIR },
      { label: '代购', value: ServiceType.SHOPPING },
    ],
    [JobType.EDUCATION]: [
      { label: '太极', value: ServiceType.TAICHI },
      { label: '广场舞', value: ServiceType.DANCE },
      { label: '手机教学', value: ServiceType.PHONE_TEACH },
      { label: '音乐', value: ServiceType.MUSIC },
    ],
    [JobType.OTHER]: [{ label: '其他', value: ServiceType.OTHER }],
  };

  // 格式化日期
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 格式化时间
  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 获取服务时间字符串
  const getServiceTimeString = (): string => {
    return `${formatDate(serviceDate)} ${formatTime(serviceStartTime)}`;
  };

  // 日期选择处理
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setServiceDate(selectedDate);
    }
  };

  // 时间选择处理
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setServiceStartTime(selectedTime);
    }
  };

  // 添加要求标签
  const handleAddRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  // 移除要求标签
  const handleRemoveRequirement = (requirement: string) => {
    setRequirements(requirements.filter((r) => r !== requirement));
  };

  // 添加健康标签
  const handleAddHealthTag = () => {
    if (newHealthTag.trim() && !healthTags.includes(newHealthTag.trim())) {
      setHealthTags([...healthTags, newHealthTag.trim()]);
      setNewHealthTag('');
    }
  };

  // 移除健康标签
  const handleRemoveHealthTag = (tag: string) => {
    setHealthTags(healthTags.filter((t) => t !== tag));
  };

  // 选择家庭成员
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowMemberSelector(false);

    // 自动填充健康标签（如果有）
    const member = familyMembers.find((m) => m.id === memberId);
    if (member?.healthProfile?.healthTags) {
      setHealthTags([...new Set([...healthTags, ...member.healthProfile.healthTags])]);
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入需求标题');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('提示', '请输入需求描述');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('提示', '请输入服务地址');
      return false;
    }
    if (!district.trim()) {
      Alert.alert('提示', '请输入所在区域');
      return false;
    }
    if (!duration.trim()) {
      Alert.alert('提示', '请输入预计时长');
      return false;
    }
    if (!minBudget || !maxBudget) {
      Alert.alert('提示', '请输入预算范围');
      return false;
    }
    if (parseInt(minBudget) > parseInt(maxBudget)) {
      Alert.alert('提示', '最低预算不能大于最高预算');
      return false;
    }
    return true;
  };

  // 发布需求
  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    // 检查发布次数限制
    if (!canPublish) {
      showPublishLimitAlert();
      return;
    }

    try {
      setLoading(true);

      const jobData: Omit<ServiceJob, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        description: description.trim(),
        jobType,
        serviceType,
        employerId: 'user_current',
        employerName: '我',
        employerAvatar: '👤',
        location: {
          address: address.trim(),
          district: district.trim(),
        },
        serviceTime: getServiceTimeString(),
        duration: duration.trim(),
        budget: {
          min: parseInt(minBudget),
          max: parseInt(maxBudget),
          currency: '¥',
        },
        requirements: requirements.length > 0 ? requirements : undefined,
        images: undefined,
        relatedMemberId: selectedMemberId,
        healthTags: healthTags.length > 0 ? healthTags : undefined,
        status: JobStatus.PUBLISHED,
        isUrgent,
        isHighReward: parseInt(maxBudget) >= 500,
        applicants: 0,
        applicantIds: [],
        views: 0,
        publishTime: '刚刚',
      };

      const newJob = await createJob(jobData);

      // 记录发布次数
      await recordPublishUsage();

      Alert.alert('发布成功', '您的需求已发布，达人看到后会来报名', [
        {
          text: '查看详情',
          onPress: () => {
            navigation.replace('JobDetail', { jobId: newJob.id });
          },
        },
        {
          text: '返回列表',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('发布失败:', error);
      Alert.alert('发布失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId);

  // 渲染表单卡片
  const renderFormCard = (cardTitle: string, icon?: React.ReactNode, children?: React.ReactNode) => (
    <View
      backgroundColor="$color2"
      padding="$2"
      borderRadius="$5"
      borderWidth={1}
      borderColor="$color5"
      marginBottom="$2"
    >
      <XStack gap="$1.5" alignItems="center" marginBottom="$2">
        {icon}
        <Text fontSize="$4" fontWeight="600" color="$color12">
          {cardTitle}
        </Text>
      </XStack>
      {children}
    </View>
  );

  // 渲染选项按钮
  const renderOptionButton = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress}>
      <View
        backgroundColor={isSelected ? primaryColor : '$color2'}
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$10"
        borderWidth={1}
        borderColor={isSelected ? primaryColor : '$color5'}
      >
        <Text
          fontSize="$3"
          color={isSelected ? 'white' : '$color12'}
          fontWeight={isSelected ? '600' : '400'}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );

  // 渲染标签
  const renderTag = (
    label: string,
    tagColor: string | undefined,
    onRemove: () => void
  ) => (
    <View
      backgroundColor="$color4"
      paddingHorizontal="$2"
      paddingVertical="$0.5"
      borderRadius="$10"
    >
      <XStack gap="$1" alignItems="center">
        <Text fontSize="$2" color="$color12" fontWeight="500">
          {label}
        </Text>
        <Pressable onPress={onRemove}>
          <X size={12} color={color12} />
        </Pressable>
      </XStack>
    </View>
  );

  return (
    <View flex={1} backgroundColor="$background">
        {/* 标准 TitleBar */}
        <View paddingTop={insets.top} backgroundColor="white">
          <TitleBar title="发布服务需求" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        >
          {/* 基本信息 */}
          {renderFormCard('基本信息', undefined,
            <YStack gap="$2">
              {/* 需求标题 */}
              <YStack gap="$1">
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  需求标题
                </Text>
                <Input
                  value={title}
                  onChangeText={setTitle}
                  placeholder="例如：需要一位护理员陪护老人去医院复查"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                  fontSize="$3"
                  maxLength={50}
                />
              </YStack>

              {/* 需求描述 */}
              <YStack gap="$1">
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  需求描述
                </Text>
                <TextArea
                  value={description}
                  onChangeText={setDescription}
                  placeholder="详细描述您的需求，包括服务对象、特殊要求等"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                  fontSize="$3"
                  numberOfLines={4}
                  maxLength={500}
                />
              </YStack>

              {/* 服务类型 */}
              <YStack gap="$1">
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  服务类型
                </Text>
                <XStack flexWrap="wrap" gap="$1.5">
                  {jobTypeOptions.map((option) => (
                    <View key={option.value}>
                      {renderOptionButton(
                        option.label,
                        jobType === option.value,
                        () => {
                          setJobType(option.value);
                          setServiceType(serviceTypeOptions[option.value][0].value);
                        }
                      )}
                    </View>
                  ))}
                </XStack>
              </YStack>

              {/* 具体服务 */}
              <YStack gap="$1">
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  具体服务
                </Text>
                <XStack flexWrap="wrap" gap="$1.5">
                  {serviceTypeOptions[jobType].map((option) => (
                    <View key={option.value}>
                      {renderOptionButton(
                        option.label,
                        serviceType === option.value,
                        () => setServiceType(option.value)
                      )}
                    </View>
                  ))}
                </XStack>
              </YStack>
            </YStack>
          )}

          {/* 服务信息 */}
          {renderFormCard('服务信息', undefined,
            <YStack gap="$2">
              {/* 服务地址 */}
              <YStack gap="$1">
                <XStack gap="$1" alignItems="center">
                  <MapPin size={14} color={color10} />
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    服务地址
                  </Text>
                </XStack>
                <Input
                  value={address}
                  onChangeText={setAddress}
                  placeholder="详细地址"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                  fontSize="$3"
                />
                <Input
                  value={district}
                  onChangeText={setDistrict}
                  placeholder="所在区域（如：南山区）"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                  fontSize="$3"
                />
              </YStack>

              {/* 服务日期 */}
              <YStack gap="$1">
                <XStack gap="$1" alignItems="center">
                  <Calendar size={14} color={color10} />
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    服务日期
                  </Text>
                </XStack>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    value={formatDate(serviceDate)}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setServiceDate(date);
                      }
                    }}
                    min={formatDate(new Date())}
                    style={{
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderColor: '#E2E6EC',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 14,
                      color: '#1F2937',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <>
                    <Pressable onPress={() => setShowDatePicker(true)}>
                      <View
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$color5"
                        borderRadius="$3"
                        paddingHorizontal="$2"
                        paddingVertical="$2"
                      >
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" color="$color12">
                            {formatDate(serviceDate)}
                          </Text>
                          <ChevronDown size={16} color={color10} />
                        </XStack>
                      </View>
                    </Pressable>
                    {showDatePicker && (
                      <View>
                        <DateTimePicker
                          value={serviceDate}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={handleDateChange}
                          minimumDate={new Date()}
                        />
                        {Platform.OS === 'ios' && (
                          <Pressable onPress={() => setShowDatePicker(false)}>
                            <View
                              backgroundColor={primaryColor}
                              paddingVertical="$2"
                              borderRadius="$3"
                              marginTop="$2"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color="white" fontWeight="500">
                                确定
                              </Text>
                            </View>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </>
                )}
              </YStack>

              {/* 服务时间 */}
              <YStack gap="$1">
                <XStack gap="$1" alignItems="center">
                  <Clock size={14} color={color10} />
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    开始时间
                  </Text>
                </XStack>
                {Platform.OS === 'web' ? (
                  <input
                    type="time"
                    value={formatTime(serviceStartTime)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newTime = new Date(serviceStartTime);
                      newTime.setHours(hours, minutes);
                      setServiceStartTime(newTime);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderColor: '#E2E6EC',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 14,
                      color: '#1F2937',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <>
                    <Pressable onPress={() => setShowTimePicker(true)}>
                      <View
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$color5"
                        borderRadius="$3"
                        paddingHorizontal="$2"
                        paddingVertical="$2"
                      >
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$3" color="$color12">
                            {formatTime(serviceStartTime)}
                          </Text>
                          <ChevronDown size={16} color={color10} />
                        </XStack>
                      </View>
                    </Pressable>
                    {showTimePicker && (
                      <View>
                        <DateTimePicker
                          value={serviceStartTime}
                          mode="time"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={handleTimeChange}
                          is24Hour={true}
                        />
                        {Platform.OS === 'ios' && (
                          <Pressable onPress={() => setShowTimePicker(false)}>
                            <View
                              backgroundColor={primaryColor}
                              paddingVertical="$2"
                              borderRadius="$3"
                              marginTop="$2"
                              alignItems="center"
                            >
                              <Text fontSize="$3" color="white" fontWeight="500">
                                确定
                              </Text>
                            </View>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </>
                )}
              </YStack>

              {/* 预计时长 */}
              <YStack gap="$1">
                <XStack gap="$1" alignItems="center">
                  <Clock size={14} color={color10} />
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    预计时长
                  </Text>
                </XStack>
                <Input
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="例如：3小时"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                  fontSize="$3"
                />
              </YStack>

              {/* 预算范围 */}
              <YStack gap="$1">
                <XStack gap="$1" alignItems="center">
                  <DollarSign size={14} color={successColor} />
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    预算范围
                  </Text>
                </XStack>
                <XStack gap="$2" alignItems="center">
                  <Input
                    value={minBudget}
                    onChangeText={setMinBudget}
                    placeholder="最低"
                    keyboardType="numeric"
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$3"
                    paddingHorizontal="$2"
                    paddingVertical="$2"
                    fontSize="$3"
                    flex={1}
                  />
                  <Text fontSize="$3" color="$color10">
                    -
                  </Text>
                  <Input
                    value={maxBudget}
                    onChangeText={setMaxBudget}
                    placeholder="最高"
                    keyboardType="numeric"
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor="$color5"
                    borderRadius="$3"
                    paddingHorizontal="$2"
                    paddingVertical="$2"
                    fontSize="$3"
                    flex={1}
                  />
                  <Text fontSize="$3" color="$color12">
                    元
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          )}

          {/* 特殊要求 */}
          {renderFormCard('特殊要求（可选）', undefined,
            <YStack gap="$2">
              {/* 要求标签输入 */}
              <XStack gap="$2" alignItems="center">
                <Input
                  value={newRequirement}
                  onChangeText={setNewRequirement}
                  placeholder="输入要求标签，如：有陪诊经验"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color5"
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$2"
                  fontSize="$3"
                  flex={1}
                />
                <Pressable onPress={handleAddRequirement}>
                  <View
                    backgroundColor={primaryColor}
                    width={40}
                    height={40}
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Plus size={20} color="white" />
                  </View>
                </Pressable>
              </XStack>

              {/* 要求标签显示 */}
              {requirements.length > 0 && (
                <XStack flexWrap="wrap" gap="$1.5">
                  {requirements.map((req, index) => (
                    <View key={index}>
                      {renderTag(req, primaryColor, () => handleRemoveRequirement(req))}
                    </View>
                  ))}
                </XStack>
              )}

              {/* 紧急需求开关 */}
              <Pressable onPress={() => setIsUrgent(!isUrgent)}>
                <XStack
                  gap="$2"
                  alignItems="center"
                  backgroundColor="$background"
                  padding="$2"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={isUrgent ? errorColor : '$color5'}
                >
                  <AlertCircle
                    size={18}
                    color={isUrgent ? errorColor : color10}
                  />
                  <Text
                    flex={1}
                    fontSize="$3"
                    color={isUrgent ? errorColor : '$color12'}
                    fontWeight={isUrgent ? '600' : '400'}
                  >
                    标记为紧急需求
                  </Text>
                  <View
                    width={22}
                    height={22}
                    borderRadius={11}
                    borderWidth={2}
                    borderColor={isUrgent ? errorColor : '$color5'}
                    backgroundColor={isUrgent ? errorColor : 'transparent'}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {isUrgent && <Check size={14} color="white" />}
                  </View>
                </XStack>
              </Pressable>
            </YStack>
          )}

          {/* 健康档案关联 */}
          {renderFormCard(
            '关联健康档案（可选）',
            <Activity size={16} color={primaryColor} />,
            <YStack gap="$2">
              <Text fontSize="$2" color="$color10">
                关联家庭成员的健康档案，帮助达人更好地了解服务对象的健康状况
              </Text>

              {/* 选择家庭成员 */}
              <Pressable onPress={() => setShowMemberSelector(!showMemberSelector)}>
                <View
                  backgroundColor="$background"
                  padding="$2"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$color5"
                >
                  <XStack gap="$2" alignItems="center">
                    <User size={16} color={color10} />
                    <Text flex={1} fontSize="$3" color={selectedMember ? '$color12' : '$color10'}>
                      {selectedMember
                        ? `${selectedMember.name}（${selectedMember.relationship}）`
                        : '选择家庭成员'}
                    </Text>
                    {showMemberSelector ? (
                      <ChevronUp size={16} color={color10} />
                    ) : (
                      <ChevronDown size={16} color={color10} />
                    )}
                  </XStack>
                </View>
              </Pressable>

              {/* 家庭成员选择器 */}
              {showMemberSelector && (
                <View
                  backgroundColor="$background"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$color5"
                  overflow="hidden"
                >
                  {familyMembers.length === 0 ? (
                    <View padding="$3">
                      <Text fontSize="$3" color="$color10" textAlign="center">
                        还没有家庭成员，去添加吧
                      </Text>
                    </View>
                  ) : (
                    familyMembers.map((member, index) => (
                      <Pressable
                        key={member.id}
                        onPress={() => handleSelectMember(member.id)}
                      >
                        <View
                          padding="$2"
                          borderBottomWidth={index < familyMembers.length - 1 ? 1 : 0}
                          borderBottomColor="$color5"
                        >
                          <XStack gap="$2" alignItems="center">
                            <View
                              width={36}
                              height={36}
                              borderRadius={18}
                              backgroundColor="$color4"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize={16}>
                                {member.avatar || '👤'}
                              </Text>
                            </View>
                            <YStack flex={1}>
                              <XStack gap="$1.5" alignItems="center">
                                <Text fontSize="$3" fontWeight="600" color="$color12">
                                  {member.name}
                                </Text>
                                <Text fontSize="$2" color="$color10">
                                  {member.relationship}
                                </Text>
                              </XStack>
                              {member.healthProfile && (
                                <Text fontSize="$2" color="$color10">
                                  健康评分: {member.healthProfile.healthScore}分
                                </Text>
                              )}
                            </YStack>
                            {selectedMemberId === member.id && (
                              <View
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor={primaryColor}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Check size={12} color="white" />
                              </View>
                            )}
                          </XStack>
                        </View>
                      </Pressable>
                    ))
                  )}
                </View>
              )}

              {/* 健康标签 */}
              {selectedMemberId && (
                <YStack gap="$1.5">
                  <Text fontSize="$3" color="$color12" fontWeight="500">
                    健康标签
                  </Text>
                  <XStack gap="$2" alignItems="center">
                    <Input
                      value={newHealthTag}
                      onChangeText={setNewHealthTag}
                      placeholder="添加健康标签，如：高血压"
                      backgroundColor="$background"
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$3"
                      paddingHorizontal="$2"
                      paddingVertical="$2"
                      fontSize="$3"
                      flex={1}
                    />
                    <Pressable onPress={handleAddHealthTag}>
                      <View
                        backgroundColor={warningColor}
                        width={40}
                        height={40}
                        borderRadius={20}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Plus size={20} color="white" />
                      </View>
                    </Pressable>
                  </XStack>

                  {healthTags.length > 0 && (
                    <XStack flexWrap="wrap" gap="$1.5">
                      {healthTags.map((tag, index) => (
                        <View key={index}>
                          {renderTag(tag, warningColor, () => handleRemoveHealthTag(tag))}
                        </View>
                      ))}
                    </XStack>
                  )}
                </YStack>
              )}
            </YStack>
          )}

          {/* 发布提示 */}
          <View
            backgroundColor="$color4"
            padding="$2"
            borderRadius="$3"
            marginBottom="$4"
          >
            <Text fontSize="$2" color="$color10" lineHeight={20}>
              发布后，平台达人会看到您的需求。您可以查看报名达人的资料，选择合适的人员提供服务。
            </Text>
          </View>
        </ScrollView>

        {/* 底部悬停发布按钮 */}
        <View
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          backgroundColor="$color2"
          paddingHorizontal="$2.5"
          paddingTop="$2"
          paddingBottom={insets.bottom + 10}
          borderTopWidth={1}
          borderTopColor="$color5"
        >
          <Pressable onPress={handlePublish} disabled={loading}>
            <View
              backgroundColor={loading ? '$color5' : primaryColor}
              paddingVertical="$3"
              borderRadius="$10"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                {loading ? '发布中...' : '发布需求'}
              </Text>
            </View>
          </Pressable>
        </View>
    </View>
  );
};
