import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  TextArea,
  Card,
  H3,
} from 'tamagui';
import { SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  User,
  Activity,
  Plus,
  X,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import {
  ServiceJob,
  JobType,
  ServiceType,
  JobStatus,
} from '@/types/community';
import { createJob } from '@/services/communityDataService';
import { getFamilyMembers, FamilyMember } from '@/services/userDataService';

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
  const [serviceTime, setServiceTime] = useState('');
  const [duration, setDuration] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

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
    if (!serviceTime.trim()) {
      Alert.alert('提示', '请输入服务时间');
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
        serviceTime: serviceTime.trim(),
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      <View
        backgroundColor="white"
        padding="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={20} color={COLORS.text} />
              <Text fontSize="$4" fontWeight="600" color="$text">
                发布服务需求
              </Text>
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePublish} disabled={loading}>
            <View
              backgroundColor={loading ? '$borderColor' : COLORS.primary}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$3"
            >
              <Text fontSize="$3" color="white" fontWeight="600">
                {loading ? '发布中...' : '发布'}
              </Text>
            </View>
          </TouchableOpacity>
        </XStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" space="$4">
          {/* 基本信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              基本信息
            </H3>

            {/* 需求标题 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                需求标题
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="例如：需要一位护理员陪护老人去医院复查"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                maxLength={50}
              />
            </View>

            {/* 需求描述 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                需求描述
              </Text>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="详细描述您的需求，包括服务对象、特殊要求等"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                numberOfLines={5}
                maxLength={500}
              />
            </View>

            {/* 服务类型 */}
            <View marginBottom="$3">
              <Text fontSize="$3" color="$text" marginBottom="$2">
                服务类型
              </Text>
              <XStack flexWrap="wrap" gap="$2">
                {jobTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setJobType(option.value);
                      setServiceType(serviceTypeOptions[option.value][0].value);
                    }}
                  >
                    <View
                      backgroundColor={
                        jobType === option.value ? COLORS.primary : '$background'
                      }
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        jobType === option.value ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={jobType === option.value ? 'white' : '$text'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>

            {/* 具体服务 */}
            <View>
              <Text fontSize="$3" color="$text" marginBottom="$2">
                具体服务
              </Text>
              <XStack flexWrap="wrap" gap="$2">
                {serviceTypeOptions[jobType].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setServiceType(option.value)}
                  >
                    <View
                      backgroundColor={
                        serviceType === option.value ? COLORS.primary : '$background'
                      }
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        serviceType === option.value ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={serviceType === option.value ? 'white' : '$text'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>
          </Card>

          {/* 服务信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              服务信息
            </H3>

            {/* 服务地址 */}
            <View marginBottom="$3">
              <XStack space="$2" alignItems="center" marginBottom="$2">
                <MapPin size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  服务地址
                </Text>
              </XStack>
              <Input
                value={address}
                onChangeText={setAddress}
                placeholder="详细地址"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                marginBottom="$2"
              />
              <Input
                value={district}
                onChangeText={setDistrict}
                placeholder="所在区域（如：南山区）"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
              />
            </View>

            {/* 服务时间 */}
            <View marginBottom="$3">
              <XStack space="$2" alignItems="center" marginBottom="$2">
                <Calendar size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  服务时间
                </Text>
              </XStack>
              <Input
                value={serviceTime}
                onChangeText={setServiceTime}
                placeholder="例如：明天上午9:00-12:00"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
              />
            </View>

            {/* 预计时长 */}
            <View marginBottom="$3">
              <XStack space="$2" alignItems="center" marginBottom="$2">
                <Clock size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  预计时长
                </Text>
              </XStack>
              <Input
                value={duration}
                onChangeText={setDuration}
                placeholder="例如：3小时"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
              />
            </View>

            {/* 预算范围 */}
            <View>
              <XStack space="$2" alignItems="center" marginBottom="$2">
                <DollarSign size={16} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$text">
                  预算范围
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Input
                  value={minBudget}
                  onChangeText={setMinBudget}
                  placeholder="最低"
                  keyboardType="numeric"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  fontSize="$3"
                  flex={1}
                />
                <Text fontSize="$3" color="$textSecondary">
                  -
                </Text>
                <Input
                  value={maxBudget}
                  onChangeText={setMaxBudget}
                  placeholder="最高"
                  keyboardType="numeric"
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  fontSize="$3"
                  flex={1}
                />
                <Text fontSize="$3" color="$text">
                  元
                </Text>
              </XStack>
            </View>
          </Card>

          {/* 特殊要求 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <H3 fontSize="$5" color="$text" fontWeight="600" marginBottom="$3">
              特殊要求（可选）
            </H3>

            {/* 要求标签输入 */}
            <XStack space="$2" marginBottom="$3" alignItems="center">
              <Input
                value={newRequirement}
                onChangeText={setNewRequirement}
                placeholder="输入要求标签，如：有陪诊经验"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                flex={1}
              />
              <TouchableOpacity onPress={handleAddRequirement}>
                <View
                  backgroundColor={COLORS.primary}
                  padding="$2"
                  borderRadius="$3"
                >
                  <Plus size={20} color="white" />
                </View>
              </TouchableOpacity>
            </XStack>

            {/* 要求标签显示 */}
            {requirements.length > 0 && (
              <XStack flexWrap="wrap" gap="$2" marginBottom="$3">
                {requirements.map((req, index) => (
                  <View
                    key={index}
                    backgroundColor={`${COLORS.primary}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor={COLORS.primary}
                  >
                    <XStack space="$1" alignItems="center">
                      <Text fontSize="$3" color={COLORS.primary}>
                        {req}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveRequirement(req)}>
                        <X size={14} color={COLORS.primary} />
                      </TouchableOpacity>
                    </XStack>
                  </View>
                ))}
              </XStack>
            )}

            {/* 紧急需求开关 */}
            <TouchableOpacity onPress={() => setIsUrgent(!isUrgent)}>
              <XStack
                space="$2"
                alignItems="center"
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor={isUrgent ? COLORS.error : '$borderColor'}
              >
                <AlertCircle
                  size={20}
                  color={isUrgent ? COLORS.error : COLORS.textSecondary}
                />
                <Text
                  flex={1}
                  fontSize="$3"
                  color={isUrgent ? COLORS.error : '$text'}
                  fontWeight={isUrgent ? '600' : '400'}
                >
                  标记为紧急需求
                </Text>
                <View
                  width={20}
                  height={20}
                  borderRadius={4}
                  borderWidth={2}
                  borderColor={isUrgent ? COLORS.error : '$borderColor'}
                  backgroundColor={isUrgent ? COLORS.error : 'transparent'}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isUrgent && (
                    <Text color="white" fontSize="$2">
                      ✓
                    </Text>
                  )}
                </View>
              </XStack>
            </TouchableOpacity>
          </Card>

          {/* 健康档案关联 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <XStack space="$2" alignItems="center" marginBottom="$3">
              <Activity size={18} color={COLORS.primary} />
              <H3 fontSize="$5" color="$text" fontWeight="600">
                关联健康档案（可选）
              </H3>
            </XStack>

            <Text fontSize="$2" color="$textSecondary" marginBottom="$3">
              关联家庭成员的健康档案，帮助达人更好地了解服务对象的健康状况
            </Text>

            {/* 选择家庭成员 */}
            <TouchableOpacity
              onPress={() => setShowMemberSelector(!showMemberSelector)}
            >
              <View
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                marginBottom="$3"
              >
                <XStack space="$2" alignItems="center">
                  <User size={18} color={COLORS.textSecondary} />
                  <Text flex={1} fontSize="$3" color="$text">
                    {selectedMember
                      ? `${selectedMember.name}（${selectedMember.relationship}）`
                      : '选择家庭成员'}
                  </Text>
                  <Text fontSize="$3" color="$textSecondary">
                    {showMemberSelector ? '▲' : '▼'}
                  </Text>
                </XStack>
              </View>
            </TouchableOpacity>

            {/* 家庭成员选择器 */}
            {showMemberSelector && (
              <View
                backgroundColor="$background"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                marginBottom="$3"
              >
                {familyMembers.length === 0 ? (
                  <View padding="$3">
                    <Text fontSize="$3" color="$textSecondary" textAlign="center">
                      还没有家庭成员，去添加吧
                    </Text>
                  </View>
                ) : (
                  familyMembers.map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      onPress={() => handleSelectMember(member.id)}
                    >
                      <View
                        padding="$3"
                        borderBottomWidth={1}
                        borderBottomColor="$borderColor"
                      >
                        <XStack space="$3" alignItems="center">
                          <View
                            width={40}
                            height={40}
                            borderRadius={20}
                            backgroundColor={`${COLORS.primary}20`}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text fontSize={20}>
                              {member.avatar || '👤'}
                            </Text>
                          </View>
                          <YStack flex={1}>
                            <XStack space="$2" alignItems="center">
                              <Text fontSize="$4" fontWeight="600" color="$text">
                                {member.name}
                              </Text>
                              <Text fontSize="$3" color="$textSecondary">
                                {member.relationship}
                              </Text>
                            </XStack>
                            {member.healthProfile && (
                              <Text fontSize="$2" color="$textSecondary">
                                健康评分: {member.healthProfile.healthScore} 分
                              </Text>
                            )}
                          </YStack>
                          {selectedMemberId === member.id && (
                            <View
                              width={20}
                              height={20}
                              borderRadius={10}
                              backgroundColor={COLORS.primary}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text color="white" fontSize="$2">
                                ✓
                              </Text>
                            </View>
                          )}
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {/* 健康标签 */}
            {selectedMemberId && (
              <>
                <Text fontSize="$3" color="$text" marginBottom="$2">
                  健康标签
                </Text>
                <XStack space="$2" marginBottom="$3" alignItems="center">
                  <Input
                    value={newHealthTag}
                    onChangeText={setNewHealthTag}
                    placeholder="添加健康标签，如：高血压"
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$3"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    fontSize="$3"
                    flex={1}
                  />
                  <TouchableOpacity onPress={handleAddHealthTag}>
                    <View
                      backgroundColor={COLORS.warning}
                      padding="$2"
                      borderRadius="$3"
                    >
                      <Plus size={20} color="white" />
                    </View>
                  </TouchableOpacity>
                </XStack>

                {healthTags.length > 0 && (
                  <XStack flexWrap="wrap" gap="$2">
                    {healthTags.map((tag, index) => (
                      <View
                        key={index}
                        backgroundColor={`${COLORS.warning}20`}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor={COLORS.warning}
                      >
                        <XStack space="$1" alignItems="center">
                          <Text fontSize="$3" color={COLORS.warning}>
                            {tag}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveHealthTag(tag)}
                          >
                            <X size={14} color={COLORS.warning} />
                          </TouchableOpacity>
                        </XStack>
                      </View>
                    ))}
                  </XStack>
                )}
              </>
            )}
          </Card>

          {/* 发布提示 */}
          <View
            backgroundColor={`${COLORS.primary}10`}
            padding="$3"
            borderRadius="$3"
          >
            <Text fontSize="$2" color="$textSecondary" lineHeight="$1">
              💡 发布后，平台达人会看到您的需求。您可以查看报名达人的资料，选择合适的人员提供服务。
            </Text>
          </View>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};
