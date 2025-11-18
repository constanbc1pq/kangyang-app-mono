import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Card,
  H3,
  Input,
  TextArea,
} from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  Star,
  ShieldCheck,
  Award,
  Camera,
  Upload,
  X,
  DollarSign,
  MapPin,
  FileText,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ServiceType } from '@/types/community';
import { createExpertProfile } from '@/services/communityDataService';

interface ExpertCertificationScreenProps {
  navigation: any;
}

type CertificationStep = 'guide' | 'basic-info' | 'id-verify' | 'skill-cert' | 'review' | 'completed';

interface BasicInfo {
  realName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  introduction: string;
}

interface IdVerification {
  idFront: string | null;
  idBack: string | null;
  idNumber: string;
  realName: string;
  verified: boolean;
}

interface SkillCertification {
  serviceTypes: ServiceType[];
  certificates: string[];
  priceRange: { min: number; max: number };
  serviceRadius: number;
  showcasePhotos: string[];
}

/**
 * 达人认证流程页面
 * 多步骤认证流程
 */
export const ExpertCertificationScreen: React.FC<ExpertCertificationScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState<CertificationStep>('guide');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    realName: '',
    phone: '',
    city: '深圳市',
    district: '',
    address: '',
    introduction: '',
  });
  const [idVerification, setIdVerification] = useState<IdVerification>({
    idFront: null,
    idBack: null,
    idNumber: '',
    realName: '',
    verified: false,
  });
  const [skillCert, setSkillCert] = useState<SkillCertification>({
    serviceTypes: [],
    certificates: [],
    priceRange: { min: 50, max: 300 },
    serviceRadius: 5,
    showcasePhotos: [],
  });

  const handleBack = () => {
    if (currentStep === 'guide') {
      navigation.goBack();
    } else {
      // 返回上一步
      const steps: CertificationStep[] = ['guide', 'basic-info', 'id-verify', 'skill-cert', 'review', 'completed'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1]);
      }
    }
  };

  const handleNext = () => {
    const steps: CertificationStep[] = ['guide', 'basic-info', 'id-verify', 'skill-cert', 'review', 'completed'];
    const currentIndex = steps.indexOf(currentStep);

    // 验证当前步骤
    if (currentStep === 'basic-info') {
      if (!basicInfo.realName || !basicInfo.phone || !basicInfo.district) {
        Alert.alert('提示', '请填写完整信息');
        return;
      }
    } else if (currentStep === 'id-verify') {
      if (!idVerification.verified) {
        Alert.alert('提示', '请完成实名认证');
        return;
      }
    } else if (currentStep === 'skill-cert') {
      if (skillCert.serviceTypes.length === 0) {
        Alert.alert('提示', '请至少选择一项服务类型');
        return;
      }
    } else if (currentStep === 'review') {
      // 提交认证
      handleSubmit();
      return;
    }

    // 进入下一步
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
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
            case ServiceType.ELDERLY_CARE:
              return '养老陪护';
            case ServiceType.NUTRITION:
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
        showcasePhotos: skillCert.showcasePhotos.length > 0 ? skillCert.showcasePhotos : ['📷'],
        level: '初级达人',
        badges: ['新人达人'],
        isOnline: true,
      };

      await createExpertProfile(expertData);

      // 模拟审核通过，直接进入完成页
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

  const handleUploadIdCard = (side: 'front' | 'back') => {
    // TODO: 实现图片上传
    Alert.alert('功能开发中', '图片上传功能正在开发中');

    // 模拟OCR识别
    if (side === 'front') {
      setTimeout(() => {
        setIdVerification({
          ...idVerification,
          idFront: 'mock-image-url',
          realName: basicInfo.realName || '张三',
          idNumber: '110101199001011234',
        });
      }, 1000);
    } else {
      setTimeout(() => {
        setIdVerification({
          ...idVerification,
          idBack: 'mock-image-url',
          verified: true,
        });
      }, 1000);
    }
  };

  const handleAddShowcasePhoto = () => {
    if (skillCert.showcasePhotos.length >= 6) {
      Alert.alert('提示', '最多上传6张展示照片');
      return;
    }
    // TODO: 实现图片上传
    Alert.alert('功能开发中', '图片上传功能正在开发中');
  };

  const handleRemoveShowcasePhoto = (index: number) => {
    setSkillCert({
      ...skillCert,
      showcasePhotos: skillCert.showcasePhotos.filter((_, i) => i !== index),
    });
  };

  const renderProgressBar = () => {
    const steps = [
      { key: 'guide', label: '引导' },
      { key: 'basic-info', label: '基础' },
      { key: 'id-verify', label: '实名' },
      { key: 'skill-cert', label: '技能' },
      { key: 'review', label: '提交' },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <View paddingHorizontal="$4" paddingVertical="$3" backgroundColor="white">
        <XStack justifyContent="space-between" alignItems="center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <YStack alignItems="center" flex={1}>
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  backgroundColor={
                    index <= currentIndex ? COLORS.primary : '$borderColor'
                  }
                  justifyContent="center"
                  alignItems="center"
                >
                  {index < currentIndex ? (
                    <CheckCircle size={20} color="white" />
                  ) : (
                    <Text
                      fontSize="$3"
                      color={index === currentIndex ? 'white' : '$textSecondary'}
                      fontWeight="600"
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  fontSize="$1"
                  color={index <= currentIndex ? COLORS.primary : '$textSecondary'}
                  marginTop="$1"
                >
                  {step.label}
                </Text>
              </YStack>

              {index < steps.length - 1 && (
                <View
                  height={2}
                  flex={1}
                  backgroundColor={
                    index < currentIndex ? COLORS.primary : '$borderColor'
                  }
                  marginHorizontal="$1"
                  marginBottom={20}
                />
              )}
            </React.Fragment>
          ))}
        </XStack>
      </View>
    );
  };

  const renderGuideStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View padding="$4">
        <YStack alignItems="center" marginTop="$8">
          <View
            width={120}
            height={120}
            borderRadius={60}
            backgroundColor={`${COLORS.primary}20`}
            justifyContent="center"
            alignItems="center"
          >
            <Award size={60} color={COLORS.primary} />
          </View>

          <H3 fontSize="$7" fontWeight="bold" color="$text" marginTop="$4">
            成为认证达人
          </H3>

          <Text fontSize="$4" color="$textSecondary" textAlign="center" marginTop="$2">
            开启接单赚钱之旅
          </Text>
        </YStack>

        <YStack space="$4" marginTop="$6">
          {[
            {
              icon: DollarSign,
              title: '灵活接单，收入可观',
              desc: '自由设定服务价格，按需接单，时间自由',
            },
            {
              icon: ShieldCheck,
              title: '平台保障，安心服务',
              desc: '实名认证、服务保险，权益有保障',
            },
            {
              icon: Star,
              title: '提升技能，成就自我',
              desc: '积累经验、好评升级，成为金牌达人',
            },
          ].map((item, index) => (
            <Card
              key={index}
              padding="$4"
              borderRadius="$4"
              backgroundColor="$surface"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack space="$3" alignItems="center">
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor={`${COLORS.primary}20`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <item.icon size={24} color={COLORS.primary} />
                </View>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {item.title}
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                    {item.desc}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          ))}
        </YStack>

        <View marginTop="$6">
          <Text fontSize="$3" color="$textSecondary" textAlign="center">
            认证流程：基础信息 → 实名认证 → 技能认证 → 审核
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center" marginTop="$2">
            预计耗时：5-10分钟
          </Text>
        </View>

        <View height={120} />
      </View>
    </ScrollView>
  );

  const renderBasicInfoStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View padding="$4">
        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$4">
          完善基础信息
        </H3>

        <YStack space="$4">
          {/* 真实姓名 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              真实姓名 <Text color={COLORS.error}>*</Text>
            </Text>
            <Input
              placeholder="请输入真实姓名"
              value={basicInfo.realName}
              onChangeText={(text) => setBasicInfo({ ...basicInfo, realName: text })}
              backgroundColor="white"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              fontSize="$4"
            />
          </YStack>

          {/* 手机号 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              手机号 <Text color={COLORS.error}>*</Text>
            </Text>
            <Input
              placeholder="请输入手机号"
              value={basicInfo.phone}
              onChangeText={(text) => setBasicInfo({ ...basicInfo, phone: text })}
              keyboardType="phone-pad"
              maxLength={11}
              backgroundColor="white"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              fontSize="$4"
            />
          </YStack>

          {/* 所在地区 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              所在地区 <Text color={COLORS.error}>*</Text>
            </Text>
            <XStack space="$2">
              <Input
                value={basicInfo.city}
                editable={false}
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                fontSize="$4"
                flex={1}
              />
              <Input
                placeholder="请输入区/县"
                value={basicInfo.district}
                onChangeText={(text) => setBasicInfo({ ...basicInfo, district: text })}
                backgroundColor="white"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                fontSize="$4"
                flex={1}
              />
            </XStack>
          </YStack>

          {/* 详细地址 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              详细地址（可选）
            </Text>
            <Input
              placeholder="请输入详细地址"
              value={basicInfo.address}
              onChangeText={(text) => setBasicInfo({ ...basicInfo, address: text })}
              backgroundColor="white"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              fontSize="$4"
            />
          </YStack>

          {/* 个人介绍 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              个人介绍（可选）
            </Text>
            <TextArea
              placeholder="简要介绍您的服务经验和优势..."
              value={basicInfo.introduction}
              onChangeText={(text) => setBasicInfo({ ...basicInfo, introduction: text })}
              minHeight={100}
              backgroundColor="white"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              fontSize="$4"
              maxLength={200}
            />
            <Text
              fontSize="$2"
              color="$textSecondary"
              textAlign="right"
              marginTop="$1"
            >
              {basicInfo.introduction.length}/200
            </Text>
          </YStack>
        </YStack>

        <View height={120} />
      </View>
    </ScrollView>
  );

  const renderIdVerifyStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View padding="$4">
        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$2">
          实名认证
        </H3>
        <Text fontSize="$3" color="$textSecondary" marginBottom="$4">
          为保障交易安全，需要上传身份证进行实名认证
        </Text>

        <YStack space="$4">
          {/* 身份证正面 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              身份证正面
            </Text>
            <TouchableOpacity onPress={() => handleUploadIdCard('front')}>
              <View
                height={180}
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderColor"
                borderStyle="dashed"
                justifyContent="center"
                alignItems="center"
                backgroundColor={idVerification.idFront ? 'transparent' : '$background'}
                overflow="hidden"
              >
                {idVerification.idFront ? (
                  <View width="100%" height="100%" justifyContent="center" alignItems="center">
                    <FileText size={64} color={COLORS.success} />
                    <Text fontSize="$3" color={COLORS.success} marginTop="$2">
                      已上传
                    </Text>
                  </View>
                ) : (
                  <>
                    <Upload size={48} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                      点击上传身份证正面
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </YStack>

          {/* 身份证反面 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              身份证反面
            </Text>
            <TouchableOpacity onPress={() => handleUploadIdCard('back')}>
              <View
                height={180}
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderColor"
                borderStyle="dashed"
                justifyContent="center"
                alignItems="center"
                backgroundColor={idVerification.idBack ? 'transparent' : '$background'}
                overflow="hidden"
              >
                {idVerification.idBack ? (
                  <View width="100%" height="100%" justifyContent="center" alignItems="center">
                    <FileText size={64} color={COLORS.success} />
                    <Text fontSize="$3" color={COLORS.success} marginTop="$2">
                      已上传
                    </Text>
                  </View>
                ) : (
                  <>
                    <Upload size={48} color={COLORS.textSecondary} />
                    <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                      点击上传身份证反面
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </YStack>

          {/* OCR识别结果 */}
          {idVerification.realName && (
            <Card
              padding="$4"
              borderRadius="$4"
              backgroundColor={`${COLORS.success}10`}
              borderWidth={1}
              borderColor={COLORS.success}
            >
              <XStack space="$2" alignItems="center">
                <CheckCircle size={20} color={COLORS.success} />
                <Text fontSize="$4" fontWeight="600" color={COLORS.success}>
                  识别成功
                </Text>
              </XStack>
              <YStack space="$2" marginTop="$3">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    姓名
                  </Text>
                  <Text fontSize="$3" color="$text" fontWeight="600">
                    {idVerification.realName}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textSecondary">
                    身份证号
                  </Text>
                  <Text fontSize="$3" color="$text" fontWeight="600">
                    {idVerification.idNumber.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')}
                  </Text>
                </XStack>
              </YStack>
            </Card>
          )}

          <View
            padding="$3"
            backgroundColor="$background"
            borderRadius="$3"
          >
            <Text fontSize="$2" color="$textSecondary">
              * 您的身份信息仅用于认证，我们会严格保护您的隐私
            </Text>
          </View>
        </YStack>

        <View height={120} />
      </View>
    </ScrollView>
  );

  const renderSkillCertStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View padding="$4">
        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$4">
          技能认证
        </H3>

        <YStack space="$4">
          {/* 选择服务类型 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              服务类型 <Text color={COLORS.error}>*</Text>
              <Text fontSize="$2" color="$textSecondary">
                {' '}(最多选3项)
              </Text>
            </Text>
            <View flexDirection="row" flexWrap="wrap" gap="$2">
              {[
                { type: ServiceType.ELDERLY_CARE, label: '养老陪护' },
                { type: ServiceType.NUTRITION, label: '营养配餐' },
                { type: ServiceType.DELIVERY, label: '代买代送' },
              ].map((item) => {
                const isSelected = skillCert.serviceTypes.includes(item.type);
                return (
                  <TouchableOpacity
                    key={item.type}
                    onPress={() => handleSelectServiceType(item.type)}
                  >
                    <View
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$6"
                      backgroundColor={isSelected ? `${COLORS.primary}20` : '$background'}
                      borderWidth={1}
                      borderColor={isSelected ? COLORS.primary : '$borderColor'}
                    >
                      <Text
                        fontSize="$3"
                        color={isSelected ? COLORS.primary : '$text'}
                        fontWeight={isSelected ? '600' : '400'}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </YStack>

          {/* 服务价格 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              服务价格范围
            </Text>
            <XStack space="$2" alignItems="center">
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
                backgroundColor="white"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                fontSize="$4"
                flex={1}
              />
              <Text fontSize="$3" color="$text">-</Text>
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
                backgroundColor="white"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                fontSize="$4"
                flex={1}
              />
              <Text fontSize="$3" color="$text">元/次</Text>
            </XStack>
          </YStack>

          {/* 服务范围 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              服务范围（公里）
            </Text>
            <XStack space="$2">
              {[3, 5, 10, 20].map((km) => (
                <TouchableOpacity
                  key={km}
                  style={{ flex: 1 }}
                  onPress={() => setSkillCert({ ...skillCert, serviceRadius: km })}
                >
                  <View
                    paddingVertical="$2"
                    borderRadius="$3"
                    backgroundColor={
                      skillCert.serviceRadius === km
                        ? `${COLORS.primary}20`
                        : '$background'
                    }
                    borderWidth={1}
                    borderColor={
                      skillCert.serviceRadius === km
                        ? COLORS.primary
                        : '$borderColor'
                    }
                    alignItems="center"
                  >
                    <Text
                      fontSize="$3"
                      color={skillCert.serviceRadius === km ? COLORS.primary : '$text'}
                      fontWeight={skillCert.serviceRadius === km ? '600' : '400'}
                    >
                      {km}km
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>

          {/* 服务展示照片 */}
          <YStack>
            <Text fontSize="$3" color="$text" marginBottom="$2">
              服务展示照片（可选，最多6张）
            </Text>
            <View flexDirection="row" flexWrap="wrap" gap="$2">
              {skillCert.showcasePhotos.map((photo, index) => (
                <View
                  key={index}
                  width={100}
                  height={100}
                  borderRadius="$3"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    source={{ uri: photo }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleRemoveShowcasePhoto(index)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {skillCert.showcasePhotos.length < 6 && (
                <TouchableOpacity onPress={handleAddShowcasePhoto}>
                  <View
                    width={100}
                    height={100}
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderStyle="dashed"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="$background"
                  >
                    <Camera size={32} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                      添加照片
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </YStack>
        </YStack>

        <View height={120} />
      </View>
    </ScrollView>
  );

  const renderReviewStep = () => (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <View padding="$4">
        <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$4">
          确认信息
        </H3>

        <YStack space="$3">
          {/* 基础信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              基础信息
            </Text>
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">真实姓名</Text>
                <Text fontSize="$3" color="$text">{basicInfo.realName}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">手机号</Text>
                <Text fontSize="$3" color="$text">{basicInfo.phone}</Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">所在地</Text>
                <Text fontSize="$3" color="$text">
                  {basicInfo.city} {basicInfo.district}
                </Text>
              </XStack>
            </YStack>
          </Card>

          {/* 实名认证 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$text">
                实名认证
              </Text>
              <XStack space="$1" alignItems="center">
                <CheckCircle size={16} color={COLORS.success} />
                <Text fontSize="$3" color={COLORS.success}>已完成</Text>
              </XStack>
            </XStack>
          </Card>

          {/* 服务信息 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              服务信息
            </Text>
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">服务类型</Text>
                <Text fontSize="$3" color="$text">
                  {skillCert.serviceTypes.length}项
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">价格范围</Text>
                <Text fontSize="$3" color="$text">
                  ¥{skillCert.priceRange.min}-{skillCert.priceRange.max}/次
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$textSecondary">服务范围</Text>
                <Text fontSize="$3" color="$text">{skillCert.serviceRadius}km</Text>
              </XStack>
            </YStack>
          </Card>

          <View
            padding="$3"
            backgroundColor="$background"
            borderRadius="$3"
            marginTop="$2"
          >
            <Text fontSize="$2" color="$textSecondary" textAlign="center">
              提交后系统将自动审核，通常在1分钟内完成
            </Text>
          </View>
        </YStack>

        <View height={120} />
      </View>
    </ScrollView>
  );

  const renderCompletedStep = () => (
    <View flex={1} justifyContent="center" alignItems="center" padding="$4">
      <View
        width={120}
        height={120}
        borderRadius={60}
        backgroundColor={`${COLORS.success}20`}
        justifyContent="center"
        alignItems="center"
      >
        <CheckCircle size={60} color={COLORS.success} />
      </View>

      <H3 fontSize="$7" fontWeight="bold" color="$text" marginTop="$4">
        认证成功！
      </H3>

      <Text fontSize="$4" color="$textSecondary" textAlign="center" marginTop="$2">
        恭喜您成为康养平台认证达人
      </Text>

      <Card
        padding="$4"
        borderRadius="$4"
        backgroundColor={`${COLORS.primary}10`}
        borderWidth={1}
        borderColor={COLORS.primary}
        marginTop="$6"
        width="100%"
      >
        <YStack alignItems="center" space="$2">
          <View
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$6"
            backgroundColor={COLORS.primary}
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              初级达人
            </Text>
          </View>
          <Text fontSize="$3" color="$text" marginTop="$2">
            完成10单后可升级为中级达人
          </Text>
        </YStack>
      </Card>

      <YStack space="$3" marginTop="$6" width="100%">
        <TouchableOpacity onPress={() => navigation.navigate('ExpertDashboard')}>
          <View
            backgroundColor={COLORS.primary}
            borderRadius="$3"
            paddingVertical="$4"
            alignItems="center"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              进入工作台
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            backgroundColor="white"
            borderWidth={1}
            borderColor={COLORS.primary}
            borderRadius="$3"
            paddingVertical="$4"
            alignItems="center"
          >
            <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
              返回首页
            </Text>
          </View>
        </TouchableOpacity>
      </YStack>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'guide':
        return renderGuideStep();
      case 'basic-info':
        return renderBasicInfoStep();
      case 'id-verify':
        return renderIdVerifyStep();
      case 'skill-cert':
        return renderSkillCertStep();
      case 'review':
        return renderReviewStep();
      case 'completed':
        return renderCompletedStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      {currentStep !== 'completed' && (
        <View
          backgroundColor="white"
          paddingTop="$3"
          paddingHorizontal="$4"
          paddingBottom="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <TouchableOpacity onPress={handleBack}>
              <View
                width={32}
                height={32}
                justifyContent="center"
                alignItems="center"
              >
                <ArrowLeft size={24} color={COLORS.text} />
              </View>
            </TouchableOpacity>

            <Text fontSize="$5" fontWeight="600" color="$text">
              达人认证
            </Text>

            <View width={32} />
          </XStack>
        </View>
      )}

      {/* 进度条 */}
      {currentStep !== 'guide' && currentStep !== 'completed' && renderProgressBar()}

      {/* 步骤内容 */}
      {renderCurrentStep()}

      {/* 底部按钮 */}
      {currentStep !== 'completed' && (
        <View
          backgroundColor="white"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderTopWidth={1}
          borderTopColor="$borderColor"
        >
          <TouchableOpacity onPress={handleNext}>
            <View
              backgroundColor={COLORS.primary}
              borderRadius="$3"
              paddingVertical="$4"
              alignItems="center"
            >
              <Text fontSize="$4" color="white" fontWeight="600">
                {currentStep === 'guide'
                  ? '开始认证'
                  : currentStep === 'review'
                  ? '提交认证'
                  : '下一步'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
