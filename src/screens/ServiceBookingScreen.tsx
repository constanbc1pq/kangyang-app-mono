/**
 * ServiceBookingScreen 预约服务页面
 * 用户预约达人服务的入口页面
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useEffect } from 'react';
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
import {
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Award,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { ServiceType, ServicePricing } from '@/types/community';

interface ServiceBookingScreenProps {
  navigation: any;
  route: {
    params: {
      expertId: string;
      expertName: string;
      expertAvatar?: string;
      serviceTypes: ServiceType[];
      pricing: { [key in ServiceType]?: ServicePricing };
    };
  };
}

/**
 * 预约服务页面
 */
export const ServiceBookingScreen: React.FC<ServiceBookingScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const { expertId, expertName, expertAvatar, serviceTypes, pricing } = route.params;

  // 表单状态
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [serviceDate, setServiceDate] = useState<Date>(new Date());
  const [serviceTime, setServiceTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState(2); // 默认2小时
  const [serviceAddress, setServiceAddress] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 服务时长选项
  const durationOptions = [1, 2, 3, 4, 6, 8];

  // 获取服务类型名称
  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: { [key in ServiceType]: string } = {
      [ServiceType.ACCOMPANY_DOCTOR]: '陪诊服务',
      [ServiceType.ACCOMPANY_CARE]: '陪护服务',
      [ServiceType.ACCOMPANY_CHAT]: '陪聊服务',
      [ServiceType.HOUSEKEEPING]: '家政服务',
      [ServiceType.MEAL_DELIVERY]: '配餐服务',
      [ServiceType.SHOPPING]: '代购服务',
      [ServiceType.TRANSPORT]: '接送服务',
      [ServiceType.NURSING]: '护理服务',
      [ServiceType.REHABILITATION]: '康复指导',
      [ServiceType.PSYCHOLOGICAL]: '心理咨询',
      [ServiceType.NUTRITION]: '营养指导',
      [ServiceType.FITNESS]: '健身指导',
      [ServiceType.MASSAGE]: '推拿按摩',
      [ServiceType.TEACHING]: '技能教学',
      [ServiceType.REPAIR]: '维修服务',
      [ServiceType.OTHER]: '其他服务',
    };
    return labels[type] || type;
  };

  // 计算预估费用
  const calculateEstimatedCost = (): number => {
    if (!selectedService || !pricing[selectedService]) return 0;
    const price = pricing[selectedService]!;
    return price.basePrice * duration;
  };

  // 格式化日期
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 格式化时间
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 处理日期选择
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setServiceDate(selectedDate);
    }
  };

  // 处理时间选择
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setServiceTime(selectedTime);
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!selectedService) {
      Alert.alert('提示', '请选择服务类型');
      return false;
    }
    if (!serviceAddress.trim()) {
      Alert.alert('提示', '请填写服务地址');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('提示', '请填写服务需求描述');
      return false;
    }
    return true;
  };

  // 提交预约
  const handleSubmitBooking = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // TODO: 调用API提交预约订单
      // const order = await createServiceOrder({
      //   expertId,
      //   serviceType: selectedService,
      //   serviceDate: formatDate(serviceDate),
      //   serviceTime: formatTime(serviceTime),
      //   duration,
      //   address: serviceAddress,
      //   description,
      //   estimatedCost: calculateEstimatedCost(),
      // });

      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        '预约成功',
        '您的预约已提交，请等待达人确认。您可以在"我的订单"中查看进度。',
        [
          {
            text: '查看订单',
            onPress: () => navigation.navigate('OrderList'),
          },
          {
            text: '返回',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('提交预约失败:', error);
      Alert.alert('提交失败', '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染达人信息
  const renderExpertInfo = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <XStack gap="$2" alignItems="center">
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={`${primaryColor}15`}
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize={24}>{expertAvatar || '👤'}</Text>
        </View>

        <YStack flex={1}>
          <XStack gap="$1.5" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              {expertName}
            </Text>
            <Award size={14} color={warningColor} />
          </XStack>
          <Text fontSize="$2" color="$color10">
            认证达人 · 服务优质
          </Text>
        </YStack>

        <View
          backgroundColor={`${successColor}15`}
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$10"
        >
          <Text fontSize="$2" color={successColor} fontWeight="500">
            可预约
          </Text>
        </View>
      </XStack>
    </Card>
  );

  // 渲染服务选择
  const renderServiceSelection = () => {
    // 过滤有效的服务类型（必须有对应的标签名称）
    const validServiceTypes = serviceTypes.filter(type => {
      const label = getServiceTypeLabel(type);
      return label && label !== type; // 确保有有效的标签
    });

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
          选择服务类型
        </Text>

        <XStack flexWrap="wrap" gap="$1.5">
          {validServiceTypes.map((type) => {
            const isSelected = selectedService === type;
            const price = pricing[type];
            const label = getServiceTypeLabel(type);

            return (
              <Pressable key={type} onPress={() => setSelectedService(type)}>
                <View
                  backgroundColor={isSelected ? primaryColor : '$color4'}
                  paddingHorizontal="$2"
                  paddingVertical="$1.5"
                  borderRadius="$4"
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
                  {price && (
                    <Text
                      fontSize="$2"
                      color={isSelected ? 'white' : '$color10'}
                      marginTop="$0.5"
                    >
                      ¥{price.basePrice}/{price.unit}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </Card>
    );
  };

  // 渲染日期时间选择
  const renderDateTimeSelection = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
        预约时间
      </Text>

      <YStack gap="$2">
        {/* 日期选择 */}
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View
            backgroundColor="$color4"
            padding="$2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$2" alignItems="center">
                <Calendar size={18} color={primaryColor} />
                <Text fontSize="$3" color="$color12">
                  服务日期
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  {formatDate(serviceDate)}
                </Text>
                <ChevronRight size={16} color={color10} />
              </XStack>
            </XStack>
          </View>
        </Pressable>

        {/* 时间选择 */}
        <Pressable onPress={() => setShowTimePicker(true)}>
          <View
            backgroundColor="$color4"
            padding="$2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$2" alignItems="center">
                <Clock size={18} color={primaryColor} />
                <Text fontSize="$3" color="$color12">
                  开始时间
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <Text fontSize="$3" color="$color12" fontWeight="500">
                  {formatTime(serviceTime)}
                </Text>
                <ChevronRight size={16} color={color10} />
              </XStack>
            </XStack>
          </View>
        </Pressable>

        {/* 时长选择 */}
        <View>
          <XStack gap="$2" alignItems="center" marginBottom="$1.5">
            <Clock size={18} color={primaryColor} />
            <Text fontSize="$3" color="$color12">
              服务时长
            </Text>
          </XStack>
          <XStack gap="$1.5" flexWrap="wrap">
            {durationOptions.map((hours) => {
              const isSelected = duration === hours;
              return (
                <Pressable key={hours} onPress={() => setDuration(hours)}>
                  <View
                    backgroundColor={isSelected ? primaryColor : '$color4'}
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor={isSelected ? primaryColor : '$color5'}
                  >
                    <Text
                      fontSize="$3"
                      color={isSelected ? 'white' : '$color12'}
                      fontWeight={isSelected ? '600' : '400'}
                    >
                      {hours}小时
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </View>
      </YStack>

      {/* 日期选择器 */}
      {showDatePicker && (
        <DateTimePicker
          value={serviceDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* 时间选择器 */}
      {showTimePicker && (
        <DateTimePicker
          value={serviceTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </Card>
  );

  // 渲染地址输入
  const renderAddressInput = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <XStack gap="$2" alignItems="center" marginBottom="$2">
        <MapPin size={18} color={primaryColor} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          服务地址
        </Text>
      </XStack>

      <Input
        placeholder="请输入详细地址"
        value={serviceAddress}
        onChangeText={setServiceAddress}
        backgroundColor="$color4"
        borderColor="$color5"
        borderRadius="$4"
        fontSize="$3"
        paddingHorizontal="$2"
        paddingVertical="$2"
      />
    </Card>
  );

  // 渲染需求描述
  const renderDescriptionInput = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
        服务需求描述
      </Text>

      <TextArea
        placeholder="请描述您的具体服务需求，以便达人更好地为您服务..."
        value={description}
        onChangeText={setDescription}
        backgroundColor="$color4"
        borderColor="$color5"
        borderRadius="$4"
        fontSize="$3"
        paddingHorizontal="$2"
        paddingVertical="$2"
        minHeight={100}
        numberOfLines={4}
      />
    </Card>
  );

  // 渲染费用预估
  const renderCostEstimate = () => {
    const estimatedCost = calculateEstimatedCost();

    return (
      <Card
        marginHorizontal="$2.5"
        marginTop="$2"
        marginBottom="$4"
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack gap="$2" alignItems="center" marginBottom="$2">
          <DollarSign size={18} color={successColor} />
          <Text fontSize="$4" fontWeight="600" color="$color12">
            费用预估
          </Text>
        </XStack>

        {selectedService && pricing[selectedService] ? (
          <YStack gap="$1.5">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="$color10">
                服务类型
              </Text>
              <Text fontSize="$3" color="$color12">
                {getServiceTypeLabel(selectedService)}
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="$color10">
                单价
              </Text>
              <Text fontSize="$3" color="$color12">
                ¥{pricing[selectedService]!.basePrice}/{pricing[selectedService]!.unit}
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="$color10">
                服务时长
              </Text>
              <Text fontSize="$3" color="$color12">
                {duration}小时
              </Text>
            </XStack>

            <View height={1} backgroundColor="$color5" marginVertical="$1" />

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                预估总价
              </Text>
              <Text fontSize="$5" fontWeight="700" color={errorColor}>
                ¥{estimatedCost}
              </Text>
            </XStack>

            <Text fontSize="$2" color="$color10">
              * 实际费用以达人确认为准
            </Text>
          </YStack>
        ) : (
          <View padding="$2" alignItems="center">
            <Text fontSize="$3" color="$color10">
              请先选择服务类型
            </Text>
          </View>
        )}
      </Card>
    );
  };

  // 渲染底部操作栏
  const renderBottomBar = () => (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$color2"
      borderTopWidth={1}
      borderTopColor="$color5"
      paddingHorizontal="$2.5"
      paddingTop="$2"
      paddingBottom={insets.bottom > 0 ? insets.bottom : 14}
    >
      <XStack gap="$2" alignItems="center">
        {/* 预估费用 */}
        <YStack flex={1}>
          <Text fontSize="$2" color="$color10">
            预估费用
          </Text>
          <Text fontSize="$5" fontWeight="700" color={errorColor}>
            ¥{calculateEstimatedCost()}
          </Text>
        </YStack>

        {/* 提交按钮 */}
        <Pressable
          style={{ flex: 1 }}
          onPress={handleSubmitBooking}
          disabled={submitting}
        >
          <View
            backgroundColor={submitting ? '$color10' : primaryColor}
            borderRadius="$10"
            paddingVertical="$2.5"
            alignItems="center"
          >
            <Text fontSize="$4" color="white" fontWeight="600">
              {submitting ? '提交中...' : '确认预约'}
            </Text>
          </View>
        </Pressable>
      </XStack>
    </View>
  );

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="预约服务" subtitle={expertName} />
      </View>

      {/* 滚动内容 */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 达人信息 */}
        {renderExpertInfo()}

        {/* 服务选择 */}
        {renderServiceSelection()}

        {/* 日期时间选择 */}
        {renderDateTimeSelection()}

        {/* 地址输入 */}
        {renderAddressInput()}

        {/* 需求描述 */}
        {renderDescriptionInput()}

        {/* 费用预估 */}
        {renderCostEstimate()}

        {/* 底部安全区域 */}
        <View height={80 + insets.bottom} />
      </ScrollView>

      {/* 底部操作栏 */}
      {renderBottomBar()}
    </View>
  );
};
