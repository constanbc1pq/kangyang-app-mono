/**
 * ExpertCertificationScreen - 达人申请认证页面
 * 多步骤认证流程：选择类型 → 基础资料 → 资质证书 → 技能证书 → 身份证件 → 确认提交
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  Input,
  TextArea,
  useTheme,
} from 'tamagui';
import { Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle,
  Award,
  Camera,
  Upload,
  X,
  User,
  Briefcase,
  FileText,
  GraduationCap,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { ServiceType, ExpertType } from '@/types/community';
import {
  createExpertProfile,
  EXPERT_CERTIFICATION_PRICES,
} from '@/services/communityDataService';

interface ExpertCertificationScreenProps {
  navigation: any;
}

type CertificationStep = 'expert-type' | 'basic-info' | 'qualification-cert' | 'skill-cert' | 'id-verify' | 'review' | 'completed';

interface BasicInfo {
  realName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  introduction: string;
}

interface QualificationCert {
  certificates: UploadedFile[];
  description: string;
}

interface SkillCert {
  serviceTypes: ServiceType[];
  certificates: UploadedFile[];
  priceRange: { min: number; max: number };
  serviceRadius: number;
  showcasePhotos: UploadedFile[];
}

interface IdVerification {
  idFront: UploadedFile | null;
  idBack: UploadedFile | null;
  businessLicense: UploadedFile | null;
  verified: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  uri: string;
  type: 'image' | 'pdf';
}

/**
 * 达人认证流程页面
 */
export const ExpertCertificationScreen: React.FC<ExpertCertificationScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState<CertificationStep>('expert-type');
  const [selectedExpertType, setSelectedExpertType] = useState<ExpertType>(ExpertType.PERSONAL);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    realName: '',
    phone: '',
    email: '',
    city: '深圳市',
    district: '',
    address: '',
    introduction: '',
  });
  const [qualificationCert, setQualificationCert] = useState<QualificationCert>({
    certificates: [],
    description: '',
  });
  const [skillCert, setSkillCert] = useState<SkillCert>({
    serviceTypes: [],
    certificates: [],
    priceRange: { min: 50, max: 300 },
    serviceRadius: 5,
    showcasePhotos: [],
  });
  const [idVerification, setIdVerification] = useState<IdVerification>({
    idFront: null,
    idBack: null,
    businessLicense: null,
    verified: false,
  });

  const steps: { key: CertificationStep; label: string }[] = [
    { key: 'expert-type', label: '类型' },
    { key: 'basic-info', label: '资料' },
    { key: 'qualification-cert', label: '资质' },
    { key: 'skill-cert', label: '技能' },
    { key: 'id-verify', label: '证件' },
    { key: 'review', label: '提交' },
  ];

  const handleBack = () => {
    const stepKeys = steps.map(s => s.key);
    const currentIndex = stepKeys.indexOf(currentStep);
    if (currentIndex <= 0) {
      navigation.goBack();
    } else {
      setCurrentStep(stepKeys[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const stepKeys = steps.map(s => s.key);
    const currentIndex = stepKeys.indexOf(currentStep);

    // 验证当前步骤
    if (currentStep === 'basic-info') {
      if (!basicInfo.realName || !basicInfo.phone || !basicInfo.district) {
        Alert.alert('提示', '请填写完整的必填信息');
        return;
      }
    } else if (currentStep === 'skill-cert') {
      if (skillCert.serviceTypes.length === 0) {
        Alert.alert('提示', '请至少选择一项服务类型');
        return;
      }
    } else if (currentStep === 'id-verify') {
      if (!idVerification.idFront || !idVerification.idBack) {
        Alert.alert('提示', '请上传身份证正反面');
        return;
      }
      if (selectedExpertType === ExpertType.BUSINESS && !idVerification.businessLicense) {
        Alert.alert('提示', '商家达人需上传营业执照');
        return;
      }
    } else if (currentStep === 'review') {
      handleSubmit();
      return;
    }

    // 进入下一步
    if (currentIndex < stepKeys.length - 1) {
      setCurrentStep(stepKeys[currentIndex + 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      const expertData = {
        userId: 'current-user-id',
        name: basicInfo.realName,
        avatar: '👨‍⚕️',
        bio: basicInfo.introduction,
        serviceTypes: skillCert.serviceTypes,
        skills: skillCert.serviceTypes.map(type => {
          switch (type) {
            case ServiceType.ELDERCARE:
              return '养老陪护';
            case ServiceType.MEAL_PREP:
              return '营养配餐';
            case ServiceType.DELIVERY:
              return '代买代送';
            default:
              return '综合服务';
          }
        }),
        certifications: ['🏅实名认证'],
        rating: 5.0,
        reviewCount: 0,
        completedOrders: 0,
        responseRate: 0,
        averageResponseTime: 0,
        location: {
          city: basicInfo.city,
          district: basicInfo.district,
          address: basicInfo.address,
          latitude: 39.9042,
          longitude: 116.4074,
        },
        serviceRadius: skillCert.serviceRadius,
        priceRange: `¥${skillCert.priceRange.min}-${skillCert.priceRange.max}/次`,
        showcasePhotos: skillCert.showcasePhotos.map(p => p.uri),
        level: '初级达人',
        badges: ['新人达人'],
        isOnline: true,
        expertType: selectedExpertType,
      };

      await createExpertProfile(expertData);
      setCurrentStep('completed');
    } catch (error) {
      console.error('提交认证失败:', error);
      Alert.alert('提交失败', '请稍后重试');
    }
  };

  const handleSelectServiceType = (type: ServiceType) => {
    if (skillCert.serviceTypes.includes(type)) {
      setSkillCert({
        ...skillCert,
        serviceTypes: skillCert.serviceTypes.filter(t => t !== type),
      });
    } else {
      if (skillCert.serviceTypes.length >= 3) {
        Alert.alert('提示', '最多选择3项服务类型');
        return;
      }
      setSkillCert({
        ...skillCert,
        serviceTypes: [...skillCert.serviceTypes, type],
      });
    }
  };

  const handleUpload = (
    type: 'qualification' | 'skill' | 'showcase' | 'idFront' | 'idBack' | 'businessLicense'
  ) => {
    // 模拟上传
    Alert.alert('功能开发中', '图片上传功能正在开发中，将模拟上传成功');

    const mockFile: UploadedFile = {
      id: Date.now().toString(),
      name: '证件照片.jpg',
      uri: 'mock-image-url',
      type: 'image',
    };

    setTimeout(() => {
      switch (type) {
        case 'qualification':
          if (qualificationCert.certificates.length < 5) {
            setQualificationCert({
              ...qualificationCert,
              certificates: [...qualificationCert.certificates, mockFile],
            });
          }
          break;
        case 'skill':
          if (skillCert.certificates.length < 5) {
            setSkillCert({
              ...skillCert,
              certificates: [...skillCert.certificates, mockFile],
            });
          }
          break;
        case 'showcase':
          if (skillCert.showcasePhotos.length < 6) {
            setSkillCert({
              ...skillCert,
              showcasePhotos: [...skillCert.showcasePhotos, mockFile],
            });
          }
          break;
        case 'idFront':
          setIdVerification({
            ...idVerification,
            idFront: mockFile,
            verified: idVerification.idBack !== null,
          });
          break;
        case 'idBack':
          setIdVerification({
            ...idVerification,
            idBack: mockFile,
            verified: idVerification.idFront !== null,
          });
          break;
        case 'businessLicense':
          setIdVerification({
            ...idVerification,
            businessLicense: mockFile,
          });
          break;
      }
    }, 500);
  };

  const handleRemoveFile = (
    type: 'qualification' | 'skill' | 'showcase',
    index: number
  ) => {
    switch (type) {
      case 'qualification':
        setQualificationCert({
          ...qualificationCert,
          certificates: qualificationCert.certificates.filter((_, i) => i !== index),
        });
        break;
      case 'skill':
        setSkillCert({
          ...skillCert,
          certificates: skillCert.certificates.filter((_, i) => i !== index),
        });
        break;
      case 'showcase':
        setSkillCert({
          ...skillCert,
          showcasePhotos: skillCert.showcasePhotos.filter((_, i) => i !== index),
        });
        break;
    }
  };

  const handleViewTerms = () => {
    navigation.navigate('ExpertTerms');
  };

  // 渲染进度条
  const renderProgressBar = () => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    if (currentStep === 'completed') return null;

    return (
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
        backgroundColor="$color2"
        borderRadius="$4"
        padding="$2"
      >
        <XStack justifyContent="space-between" alignItems="center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <YStack alignItems="center" flex={1}>
                <View
                  width={28}
                  height={28}
                  borderRadius={14}
                  backgroundColor={index <= currentIndex ? primaryColor : '$color5'}
                  justifyContent="center"
                  alignItems="center"
                >
                  {index < currentIndex ? (
                    <CheckCircle size={16} color="white" />
                  ) : (
                    <Text
                      fontSize={12}
                      color={index === currentIndex ? 'white' : '$color10'}
                      fontWeight="600"
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  fontSize={10}
                  color={index <= currentIndex ? primaryColor : '$color10'}
                  marginTop="$0.5"
                  fontWeight={index === currentIndex ? '600' : '400'}
                >
                  {step.label}
                </Text>
              </YStack>

              {index < steps.length - 1 && (
                <View
                  height={2}
                  flex={0.5}
                  backgroundColor={index < currentIndex ? primaryColor : '$color5'}
                  marginBottom={18}
                />
              )}
            </React.Fragment>
          ))}
        </XStack>
      </View>
    );
  };

  // 渲染选择达人类型
  const renderExpertTypeStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View paddingHorizontal="$2.5" paddingTop="$3">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          选择认证类型
        </Text>
        <Text fontSize="$3" color="$color10" marginBottom="$3">
          请根据您的身份选择合适的认证类型
        </Text>

        <YStack gap="$3">
          {/* 个人达人 */}
          <Pressable onPress={() => setSelectedExpertType(ExpertType.PERSONAL)}>
            <Card
              padding="$3"
              borderRadius="$5"
              borderWidth={2}
              borderColor={selectedExpertType === ExpertType.PERSONAL ? primaryColor : '$color5'}
              backgroundColor={selectedExpertType === ExpertType.PERSONAL ? `${primaryColor}10` : '$color2'}
            >
              <XStack gap="$3" alignItems="flex-start">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor={selectedExpertType === ExpertType.PERSONAL ? `${primaryColor}20` : '$color4'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <User size={24} color={selectedExpertType === ExpertType.PERSONAL ? primaryColor : color10} />
                </View>
                <YStack flex={1}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" fontWeight="700" color="$color12">
                      个人达人
                    </Text>
                    <Text fontSize="$5" fontWeight="700" color={primaryColor}>
                      ¥{EXPERT_CERTIFICATION_PRICES[ExpertType.PERSONAL]}/年
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$color10" marginTop="$1">
                    适合个人技能服务者，提供陪护、家政、代办等服务
                  </Text>
                  <YStack gap="$1" marginTop="$2">
                    {['个人认证标识', '优先推荐展示', '平台服务保障'].map((item, i) => (
                      <XStack key={i} gap="$1" alignItems="center">
                        <CheckCircle size={12} color={successColor} />
                        <Text fontSize="$2" color="$color10">{item}</Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              </XStack>
            </Card>
          </Pressable>

          {/* 商家达人 */}
          <Pressable onPress={() => setSelectedExpertType(ExpertType.BUSINESS)}>
            <Card
              padding="$3"
              borderRadius="$5"
              borderWidth={2}
              borderColor={selectedExpertType === ExpertType.BUSINESS ? warningColor : '$color5'}
              backgroundColor={selectedExpertType === ExpertType.BUSINESS ? `${warningColor}10` : '$color2'}
            >
              <XStack gap="$3" alignItems="flex-start">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor={selectedExpertType === ExpertType.BUSINESS ? `${warningColor}20` : '$color4'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Briefcase size={24} color={selectedExpertType === ExpertType.BUSINESS ? warningColor : color10} />
                </View>
                <YStack flex={1}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" fontWeight="700" color="$color12">
                      商家达人
                    </Text>
                    <Text fontSize="$5" fontWeight="700" color={warningColor}>
                      ¥{EXPERT_CERTIFICATION_PRICES[ExpertType.BUSINESS]}/年
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$color10" marginTop="$1">
                    适合商户/企业，提供专业养老、护理等服务
                  </Text>
                  <YStack gap="$1" marginTop="$2">
                    {['商家认证标识', '首页精选推荐', '多员工管理', '专属客服支持'].map((item, i) => (
                      <XStack key={i} gap="$1" alignItems="center">
                        <CheckCircle size={12} color={successColor} />
                        <Text fontSize="$2" color="$color10">{item}</Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              </XStack>
            </Card>
          </Pressable>
        </YStack>

        <Pressable onPress={handleViewTerms}>
          <XStack
            marginTop="$4"
            backgroundColor="$color4"
            borderRadius="$4"
            padding="$2"
            justifyContent="space-between"
            alignItems="center"
          >
            <XStack gap="$1.5" alignItems="center">
              <FileText size={16} color={primaryColor} />
              <Text fontSize="$3" color="$color12">
                查看达人服务协议
              </Text>
            </XStack>
            <ChevronRight size={16} color={color10} />
          </XStack>
        </Pressable>

        <View height={insets.bottom + 100} />
      </View>
    </ScrollView>
  );

  // 渲染基础资料
  const renderBasicInfoStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View paddingHorizontal="$2.5" paddingTop="$3">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$3">
          填写基础资料
        </Text>

        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <YStack gap="$3">
            {/* 真实姓名 */}
            <YStack gap="$1">
              <XStack gap="$0.5" alignItems="center">
                <User size={14} color={color10} />
                <Text fontSize="$3" color="$color12">真实姓名</Text>
                <Text color={errorColor}>*</Text>
              </XStack>
              <Input
                placeholder="请输入真实姓名"
                value={basicInfo.realName}
                onChangeText={(text) => setBasicInfo({ ...basicInfo, realName: text })}
                backgroundColor="$color4"
                borderWidth={0}
                borderRadius="$3"
                fontSize="$3"
              />
            </YStack>

            {/* 手机号 */}
            <YStack gap="$1">
              <XStack gap="$0.5" alignItems="center">
                <Phone size={14} color={color10} />
                <Text fontSize="$3" color="$color12">手机号</Text>
                <Text color={errorColor}>*</Text>
              </XStack>
              <Input
                placeholder="请输入手机号"
                value={basicInfo.phone}
                onChangeText={(text) => setBasicInfo({ ...basicInfo, phone: text })}
                keyboardType="phone-pad"
                maxLength={11}
                backgroundColor="$color4"
                borderWidth={0}
                borderRadius="$3"
                fontSize="$3"
              />
            </YStack>

            {/* 邮箱 */}
            <YStack gap="$1">
              <XStack gap="$0.5" alignItems="center">
                <Mail size={14} color={color10} />
                <Text fontSize="$3" color="$color12">邮箱（选填）</Text>
              </XStack>
              <Input
                placeholder="请输入邮箱"
                value={basicInfo.email}
                onChangeText={(text) => setBasicInfo({ ...basicInfo, email: text })}
                keyboardType="email-address"
                backgroundColor="$color4"
                borderWidth={0}
                borderRadius="$3"
                fontSize="$3"
              />
            </YStack>

            {/* 所在地区 */}
            <YStack gap="$1">
              <XStack gap="$0.5" alignItems="center">
                <MapPin size={14} color={color10} />
                <Text fontSize="$3" color="$color12">所在地区</Text>
                <Text color={errorColor}>*</Text>
              </XStack>
              <XStack gap="$2">
                <Input
                  value={basicInfo.city}
                  editable={false}
                  backgroundColor="$color5"
                  borderWidth={0}
                  borderRadius="$3"
                  fontSize="$3"
                  flex={1}
                />
                <Input
                  placeholder="请输入区/县"
                  value={basicInfo.district}
                  onChangeText={(text) => setBasicInfo({ ...basicInfo, district: text })}
                  backgroundColor="$color4"
                  borderWidth={0}
                  borderRadius="$3"
                  fontSize="$3"
                  flex={1}
                />
              </XStack>
            </YStack>

            {/* 详细地址 */}
            <YStack gap="$1">
              <Text fontSize="$3" color="$color12">详细地址（选填）</Text>
              <Input
                placeholder="请输入详细地址"
                value={basicInfo.address}
                onChangeText={(text) => setBasicInfo({ ...basicInfo, address: text })}
                backgroundColor="$color4"
                borderWidth={0}
                borderRadius="$3"
                fontSize="$3"
              />
            </YStack>

            {/* 个人介绍 */}
            <YStack gap="$1">
              <Text fontSize="$3" color="$color12">个人介绍（选填）</Text>
              <TextArea
                placeholder="简要介绍您的服务经验和优势..."
                value={basicInfo.introduction}
                onChangeText={(text) => setBasicInfo({ ...basicInfo, introduction: text })}
                minHeight={80}
                backgroundColor="$color4"
                borderWidth={0}
                borderRadius="$3"
                fontSize="$3"
                maxLength={200}
              />
              <Text fontSize="$2" color="$color10" textAlign="right">
                {basicInfo.introduction.length}/200
              </Text>
            </YStack>
          </YStack>
        </Card>

        <View height={insets.bottom + 100} />
      </View>
    </ScrollView>
  );

  // 渲染资质证书上传
  const renderQualificationCertStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View paddingHorizontal="$2.5" paddingTop="$3">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          上传资质证书
        </Text>
        <Text fontSize="$3" color="$color10" marginBottom="$3">
          上传您的职业资格证书、从业资格证等（选填，最多5张）
        </Text>

        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack gap="$1.5" alignItems="center" marginBottom="$2">
            <GraduationCap size={18} color={primaryColor} />
            <Text fontSize="$3" fontWeight="600" color="$color12">
              资质证书
            </Text>
          </XStack>

          <View flexDirection="row" flexWrap="wrap" gap="$2">
            {qualificationCert.certificates.map((cert, index) => (
              <View
                key={cert.id}
                width={100}
                height={100}
                borderRadius="$3"
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <FileText size={32} color={successColor} />
                <Text fontSize={10} color="$color10" marginTop="$0.5" numberOfLines={1}>
                  {cert.name}
                </Text>
                <Pressable
                  onPress={() => handleRemoveFile('qualification', index)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <X size={12} color="white" />
                </Pressable>
              </View>
            ))}

            {qualificationCert.certificates.length < 5 && (
              <Pressable onPress={() => handleUpload('qualification')}>
                <View
                  width={100}
                  height={100}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$color5"
                  borderStyle="dashed"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$color4"
                >
                  <Upload size={24} color={color10} />
                  <Text fontSize={10} color="$color10" marginTop="$0.5">
                    上传证书
                  </Text>
                </View>
              </Pressable>
            )}
          </View>

          <YStack gap="$1" marginTop="$3">
            <Text fontSize="$3" color="$color12">证书说明（选填）</Text>
            <TextArea
              placeholder="简要描述您的资质证书..."
              value={qualificationCert.description}
              onChangeText={(text) => setQualificationCert({ ...qualificationCert, description: text })}
              minHeight={60}
              backgroundColor="$color4"
              borderWidth={0}
              borderRadius="$3"
              fontSize="$3"
              maxLength={100}
            />
          </YStack>
        </Card>

        <View
          marginTop="$3"
          backgroundColor="$color4"
          borderRadius="$4"
          padding="$2"
        >
          <Text fontSize="$2" color="$color10" lineHeight={18}>
            提示：资质证书可提高您的可信度和接单成功率。支持上传护理证、康复师证、营养师证等相关证书。
          </Text>
        </View>

        <View height={insets.bottom + 100} />
      </View>
    </ScrollView>
  );

  // 渲染技能证书和服务设置
  const renderSkillCertStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View paddingHorizontal="$2.5" paddingTop="$3">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$3">
          设置服务技能
        </Text>

        {/* 服务类型选择 */}
        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$3"
        >
          <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
            服务类型 <Text color={errorColor}>*</Text>
            <Text fontSize="$2" color="$color10"> (最多选3项)</Text>
          </Text>
          <View flexDirection="row" flexWrap="wrap" gap="$2">
            {[
              { type: ServiceType.ELDERCARE, label: '养老陪护' },
              { type: ServiceType.MEAL_PREP, label: '营养配餐' },
              { type: ServiceType.DELIVERY, label: '代买代送' },
            ].map((item) => {
              const isSelected = skillCert.serviceTypes.includes(item.type);
              return (
                <Pressable key={item.type} onPress={() => handleSelectServiceType(item.type)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    backgroundColor={isSelected ? `${primaryColor}20` : '$color4'}
                    borderWidth={1}
                    borderColor={isSelected ? primaryColor : '$color5'}
                  >
                    <Text
                      fontSize="$3"
                      color={isSelected ? primaryColor : '$color12'}
                      fontWeight={isSelected ? '600' : '400'}
                    >
                      {item.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* 技能证书 */}
        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$3"
        >
          <XStack gap="$1.5" alignItems="center" marginBottom="$2">
            <Award size={18} color={warningColor} />
            <Text fontSize="$3" fontWeight="600" color="$color12">
              技能证书（选填）
            </Text>
          </XStack>

          <View flexDirection="row" flexWrap="wrap" gap="$2">
            {skillCert.certificates.map((cert, index) => (
              <View
                key={cert.id}
                width={80}
                height={80}
                borderRadius="$3"
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <FileText size={24} color={successColor} />
                <Pressable
                  onPress={() => handleRemoveFile('skill', index)}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <X size={10} color="white" />
                </Pressable>
              </View>
            ))}

            {skillCert.certificates.length < 5 && (
              <Pressable onPress={() => handleUpload('skill')}>
                <View
                  width={80}
                  height={80}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$color5"
                  borderStyle="dashed"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$color4"
                >
                  <Upload size={20} color={color10} />
                  <Text fontSize={10} color="$color10" marginTop="$0.5">
                    上传
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </Card>

        {/* 服务价格和范围 */}
        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$3"
        >
          <YStack gap="$3">
            {/* 服务价格 */}
            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">服务价格范围</Text>
              <XStack gap="$2" alignItems="center">
                <Input
                  value={skillCert.priceRange.min.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    setSkillCert({
                      ...skillCert,
                      priceRange: { ...skillCert.priceRange, min: num },
                    });
                  }}
                  keyboardType="numeric"
                  backgroundColor="$color4"
                  borderWidth={0}
                  borderRadius="$3"
                  fontSize="$3"
                  flex={1}
                />
                <Text fontSize="$3" color="$color10">-</Text>
                <Input
                  value={skillCert.priceRange.max.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    setSkillCert({
                      ...skillCert,
                      priceRange: { ...skillCert.priceRange, max: num },
                    });
                  }}
                  keyboardType="numeric"
                  backgroundColor="$color4"
                  borderWidth={0}
                  borderRadius="$3"
                  fontSize="$3"
                  flex={1}
                />
                <Text fontSize="$3" color="$color10">元/次</Text>
              </XStack>
            </YStack>

            {/* 服务范围 */}
            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">服务范围（公里）</Text>
              <XStack gap="$2">
                {[3, 5, 10, 20].map((km) => (
                  <Pressable
                    key={km}
                    style={{ flex: 1 }}
                    onPress={() => setSkillCert({ ...skillCert, serviceRadius: km })}
                  >
                    <View
                      paddingVertical="$2"
                      borderRadius="$3"
                      backgroundColor={skillCert.serviceRadius === km ? `${primaryColor}20` : '$color4'}
                      borderWidth={1}
                      borderColor={skillCert.serviceRadius === km ? primaryColor : '$color5'}
                      alignItems="center"
                    >
                      <Text
                        fontSize="$3"
                        color={skillCert.serviceRadius === km ? primaryColor : '$color12'}
                        fontWeight={skillCert.serviceRadius === km ? '600' : '400'}
                      >
                        {km}km
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </YStack>
          </YStack>
        </Card>

        {/* 服务展示照片 */}
        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack gap="$1.5" alignItems="center" marginBottom="$2">
            <Camera size={18} color={primaryColor} />
            <Text fontSize="$3" fontWeight="600" color="$color12">
              服务展示照片（选填，最多6张）
            </Text>
          </XStack>

          <View flexDirection="row" flexWrap="wrap" gap="$2">
            {skillCert.showcasePhotos.map((photo, index) => (
              <View
                key={photo.id}
                width={100}
                height={100}
                borderRadius="$3"
                backgroundColor="$color4"
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <Camera size={32} color={successColor} />
                <Pressable
                  onPress={() => handleRemoveFile('showcase', index)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <X size={12} color="white" />
                </Pressable>
              </View>
            ))}

            {skillCert.showcasePhotos.length < 6 && (
              <Pressable onPress={() => handleUpload('showcase')}>
                <View
                  width={100}
                  height={100}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$color5"
                  borderStyle="dashed"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$color4"
                >
                  <Camera size={24} color={color10} />
                  <Text fontSize={10} color="$color10" marginTop="$0.5">
                    添加照片
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </Card>

        <View height={insets.bottom + 100} />
      </View>
    </ScrollView>
  );

  // 渲染身份/营业证件
  const renderIdVerifyStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View paddingHorizontal="$2.5" paddingTop="$3">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5">
          上传证件信息
        </Text>
        <Text fontSize="$3" color="$color10" marginBottom="$3">
          为保障交易安全，需要上传证件进行实名认证
        </Text>

        {/* 身份证上传 */}
        <Card
          padding="$2"
          borderRadius="$5"
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$color5"
          marginBottom="$3"
        >
          <XStack gap="$1.5" alignItems="center" marginBottom="$2">
            <CreditCard size={18} color={primaryColor} />
            <Text fontSize="$3" fontWeight="600" color="$color12">
              身份证 <Text color={errorColor}>*</Text>
            </Text>
          </XStack>

          <XStack gap="$2">
            {/* 身份证正面 */}
            <Pressable style={{ flex: 1 }} onPress={() => handleUpload('idFront')}>
              <View
                height={120}
                borderRadius="$4"
                borderWidth={1}
                borderColor={idVerification.idFront ? successColor : '$color5'}
                borderStyle={idVerification.idFront ? 'solid' : 'dashed'}
                justifyContent="center"
                alignItems="center"
                backgroundColor={idVerification.idFront ? `${successColor}10` : '$color4'}
              >
                {idVerification.idFront ? (
                  <>
                    <CheckCircle size={32} color={successColor} />
                    <Text fontSize="$2" color={successColor} marginTop="$1">
                      已上传
                    </Text>
                  </>
                ) : (
                  <>
                    <Upload size={32} color={color10} />
                    <Text fontSize="$2" color="$color10" marginTop="$1">
                      身份证正面
                    </Text>
                  </>
                )}
              </View>
            </Pressable>

            {/* 身份证反面 */}
            <Pressable style={{ flex: 1 }} onPress={() => handleUpload('idBack')}>
              <View
                height={120}
                borderRadius="$4"
                borderWidth={1}
                borderColor={idVerification.idBack ? successColor : '$color5'}
                borderStyle={idVerification.idBack ? 'solid' : 'dashed'}
                justifyContent="center"
                alignItems="center"
                backgroundColor={idVerification.idBack ? `${successColor}10` : '$color4'}
              >
                {idVerification.idBack ? (
                  <>
                    <CheckCircle size={32} color={successColor} />
                    <Text fontSize="$2" color={successColor} marginTop="$1">
                      已上传
                    </Text>
                  </>
                ) : (
                  <>
                    <Upload size={32} color={color10} />
                    <Text fontSize="$2" color="$color10" marginTop="$1">
                      身份证反面
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </XStack>
        </Card>

        {/* 营业执照（商家达人） */}
        {selectedExpertType === ExpertType.BUSINESS && (
          <Card
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
            marginBottom="$3"
          >
            <XStack gap="$1.5" alignItems="center" marginBottom="$2">
              <Briefcase size={18} color={warningColor} />
              <Text fontSize="$3" fontWeight="600" color="$color12">
                营业执照 <Text color={errorColor}>*</Text>
              </Text>
            </XStack>

            <Pressable onPress={() => handleUpload('businessLicense')}>
              <View
                height={150}
                borderRadius="$4"
                borderWidth={1}
                borderColor={idVerification.businessLicense ? successColor : '$color5'}
                borderStyle={idVerification.businessLicense ? 'solid' : 'dashed'}
                justifyContent="center"
                alignItems="center"
                backgroundColor={idVerification.businessLicense ? `${successColor}10` : '$color4'}
              >
                {idVerification.businessLicense ? (
                  <>
                    <CheckCircle size={40} color={successColor} />
                    <Text fontSize="$3" color={successColor} marginTop="$1">
                      营业执照已上传
                    </Text>
                  </>
                ) : (
                  <>
                    <Upload size={40} color={color10} />
                    <Text fontSize="$3" color="$color10" marginTop="$1">
                      点击上传营业执照
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </Card>
        )}

        <View
          backgroundColor="$color4"
          borderRadius="$4"
          padding="$2"
        >
          <Text fontSize="$2" color="$color10" lineHeight={18}>
            您的证件信息仅用于认证，我们会严格保护您的隐私，不会泄露给第三方。
          </Text>
        </View>

        <View height={insets.bottom + 100} />
      </View>
    </ScrollView>
  );

  // 渲染确认提交
  const renderReviewStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View paddingHorizontal="$2.5" paddingTop="$3">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$3">
          确认认证信息
        </Text>

        <YStack gap="$2">
          {/* 认证类型和费用 */}
          <Card
            padding="$2"
            borderRadius="$5"
            backgroundColor={selectedExpertType === ExpertType.PERSONAL ? `${primaryColor}10` : `${warningColor}10`}
            borderWidth={1}
            borderColor={selectedExpertType === ExpertType.PERSONAL ? primaryColor : warningColor}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Text fontSize="$4" fontWeight="600" color="$color12">
                  {selectedExpertType === ExpertType.PERSONAL ? '个人达人' : '商家达人'}认证
                </Text>
                <Text fontSize="$2" color="$color10" marginTop="$0.5">
                  认证有效期：1年
                </Text>
              </YStack>
              <Text fontSize="$6" fontWeight="700" color={selectedExpertType === ExpertType.PERSONAL ? primaryColor : warningColor}>
                ¥{EXPERT_CERTIFICATION_PRICES[selectedExpertType]}
              </Text>
            </XStack>
          </Card>

          {/* 基础信息 */}
          <Card
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
              基础信息
            </Text>
            <YStack gap="$1.5">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">真实姓名</Text>
                <Text fontSize="$3" color="$color12">{basicInfo.realName}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">手机号</Text>
                <Text fontSize="$3" color="$color12">{basicInfo.phone}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">所在地</Text>
                <Text fontSize="$3" color="$color12">{basicInfo.city} {basicInfo.district}</Text>
              </XStack>
            </YStack>
          </Card>

          {/* 资质证书 */}
          <Card
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" fontWeight="600" color="$color12">资质证书</Text>
              <Text fontSize="$3" color={qualificationCert.certificates.length > 0 ? successColor : '$color10'}>
                {qualificationCert.certificates.length > 0 ? `${qualificationCert.certificates.length}张` : '未上传'}
              </Text>
            </XStack>
          </Card>

          {/* 服务信息 */}
          <Card
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$2">
              服务信息
            </Text>
            <YStack gap="$1.5">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">服务类型</Text>
                <Text fontSize="$3" color="$color12">{skillCert.serviceTypes.length}项</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">价格范围</Text>
                <Text fontSize="$3" color="$color12">¥{skillCert.priceRange.min}-{skillCert.priceRange.max}/次</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$color10">服务范围</Text>
                <Text fontSize="$3" color="$color12">{skillCert.serviceRadius}km</Text>
              </XStack>
            </YStack>
          </Card>

          {/* 实名认证 */}
          <Card
            padding="$2"
            borderRadius="$5"
            backgroundColor="$color2"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" fontWeight="600" color="$color12">证件上传</Text>
              <XStack gap="$1" alignItems="center">
                <CheckCircle size={14} color={successColor} />
                <Text fontSize="$3" color={successColor}>已完成</Text>
              </XStack>
            </XStack>
          </Card>
        </YStack>

        <View
          marginTop="$3"
          backgroundColor="$color4"
          borderRadius="$4"
          padding="$2"
        >
          <Text fontSize="$2" color="$color10" textAlign="center">
            提交后系统将自动审核，通常在1-3个工作日内完成
          </Text>
        </View>

        <View height={insets.bottom + 100} />
      </View>
    </ScrollView>
  );

  // 渲染完成页
  const renderCompletedStep = () => (
    <View flex={1} justifyContent="center" alignItems="center" padding="$4">
      <View
        width={100}
        height={100}
        borderRadius={50}
        backgroundColor={`${successColor}20`}
        justifyContent="center"
        alignItems="center"
      >
        <CheckCircle size={50} color={successColor} />
      </View>

      <Text fontSize="$6" fontWeight="700" color="$color12" marginTop="$4">
        提交成功！
      </Text>

      <Text fontSize="$3" color="$color10" textAlign="center" marginTop="$2">
        您的达人认证申请已提交{'\n'}预计1-3个工作日内审核完成
      </Text>

      <Card
        marginTop="$6"
        padding="$3"
        borderRadius="$5"
        backgroundColor={`${primaryColor}10`}
        borderWidth={1}
        borderColor={primaryColor}
        width="100%"
      >
        <YStack alignItems="center" gap="$2">
          <View
            paddingHorizontal="$4"
            paddingVertical="$1.5"
            borderRadius="$10"
            backgroundColor={primaryColor}
          >
            <Text fontSize="$3" color="white" fontWeight="600">
              {selectedExpertType === ExpertType.PERSONAL ? '个人达人' : '商家达人'}
            </Text>
          </View>
          <Text fontSize="$3" color="$color12" marginTop="$1">
            认证费用：¥{EXPERT_CERTIFICATION_PRICES[selectedExpertType]}
          </Text>
          <Text fontSize="$2" color="$color10">
            审核通过后将自动扣款
          </Text>
        </YStack>
      </Card>

      <YStack gap="$2" marginTop="$6" width="100%">
        <Pressable onPress={() => navigation.navigate('ExpertDashboard')}>
          <View
            backgroundColor={primaryColor}
            borderRadius="$10"
            paddingVertical="$3"
            alignItems="center"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              进入达人工作台
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Community')}>
          <View
            backgroundColor="$color2"
            borderWidth={1}
            borderColor={primaryColor}
            borderRadius="$10"
            paddingVertical="$3"
            alignItems="center"
          >
            <Text fontSize="$4" color={primaryColor} fontWeight="600">
              返回社区首页
            </Text>
          </View>
        </Pressable>
      </YStack>
    </View>
  );

  // 渲染当前步骤内容
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'expert-type':
        return renderExpertTypeStep();
      case 'basic-info':
        return renderBasicInfoStep();
      case 'qualification-cert':
        return renderQualificationCertStep();
      case 'skill-cert':
        return renderSkillCertStep();
      case 'id-verify':
        return renderIdVerifyStep();
      case 'review':
        return renderReviewStep();
      case 'completed':
        return renderCompletedStep();
      default:
        return null;
    }
  };

  // 渲染底部按钮
  const renderBottomButton = () => {
    if (currentStep === 'completed') return null;

    return (
      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        paddingHorizontal="$2.5"
        paddingTop="$2"
        paddingBottom={insets.bottom + 16}
        backgroundColor="rgba(255,255,255,0.95)"
        borderTopWidth={1}
        borderTopColor="$color5"
      >
        <Pressable onPress={handleNext}>
          <View
            backgroundColor={primaryColor}
            borderRadius="$10"
            paddingVertical="$3"
            alignItems="center"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              {currentStep === 'review' ? '提交认证' : '下一步'}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      {currentStep !== 'completed' && (
        <View paddingTop={insets.top}>
          <TitleBar title="达人认证" onBack={handleBack} />
        </View>
      )}

      {/* 进度条 */}
      {renderProgressBar()}

      {/* 步骤内容 */}
      {renderCurrentStep()}

      {/* 底部按钮 */}
      {renderBottomButton()}
    </View>
  );
};
