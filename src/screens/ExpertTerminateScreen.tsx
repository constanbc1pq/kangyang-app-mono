/**
 * ExpertTerminateScreen - 达人提前解约页面
 * 展示解约流程、费用计算、确认解约
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
  useTheme,
  TextArea,
} from 'tamagui';
import { Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle,
  FileText,
  XCircle,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { Expert, ExpertType, ExpertCertStatus } from '@/types/community';
import { getMyExpertProfile } from '@/services/communityDataService';

interface ExpertTerminateScreenProps {
  navigation: any;
}

/**
 * 达人提前解约页面
 */
export const ExpertTerminateScreen: React.FC<ExpertTerminateScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [myExpertProfile, setMyExpertProfile] = useState<Expert | null>(null);
  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(false);
      const profile = await getMyExpertProfile();
      setMyExpertProfile(profile);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算剩余天数
  const getRemainingDays = (): number => {
    if (!myExpertProfile?.certExpireDate) return 0;
    const expire = new Date(myExpertProfile.certExpireDate);
    const now = new Date();
    const diff = expire.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // 计算退款金额
  const getRefundAmount = (): { original: number; fee: number; refund: number } => {
    const remainingDays = getRemainingDays();
    const yearlyFee = myExpertProfile?.expertType === ExpertType.BUSINESS ? 2000 : 500;
    const dailyRate = yearlyFee / 365;
    const remainingValue = Math.floor(dailyRate * remainingDays);
    const fee = Math.floor(remainingValue * 0.2); // 20% 手续费
    const refund = remainingValue - fee;
    return { original: remainingValue, fee, refund: Math.max(0, refund) };
  };

  const handleTermsPress = () => {
    navigation.navigate('ExpertTerms');
  };

  const handleSubmit = () => {
    if (!agreed) {
      Alert.alert('提示', '请先阅读并同意解约须知');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('提示', '请填写解约原因');
      return;
    }

    Alert.alert(
      '确认解约',
      '提交解约申请后，您的达人资格将在审核通过后终止。确定要继续吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认提交',
          style: 'destructive',
          onPress: () => {
            // 模拟提交
            Alert.alert('提交成功', '您的解约申请已提交，预计1-3个工作日内处理完成。', [
              { text: '确定', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  const refundInfo = getRefundAmount();
  const remainingDays = getRemainingDays();

  // 解约须知
  const terminationNotes = [
    '解约申请提交后，需经平台审核，预计1-3个工作日处理完成。',
    '审核期间，您仍可正常接单服务，但无法申请新的认证。',
    '解约生效后，您的达人资格将被取消，账户转为普通用户。',
    '历史服务记录、评价信息将保留，但不再展示达人标识。',
    '解约后如需重新认证，需等待30天冷静期后方可申请。',
    '退款将在解约生效后7个工作日内退还至原支付账户。',
  ];

  // 渲染警告提示
  const renderWarning = () => (
    <View
      marginHorizontal="$2.5"
      marginTop="$2"
      backgroundColor={`${errorColor}10`}
      borderRadius="$4"
      padding="$2"
      borderWidth={1}
      borderColor={`${errorColor}30`}
    >
      <XStack gap="$2" alignItems="center">
        <AlertTriangle size={20} color={errorColor} />
        <Text fontSize="$3" color={errorColor} fontWeight="500" flex={1}>
          解约后您将失去达人资格和相关权益，请谨慎操作
        </Text>
      </XStack>
    </View>
  );

  // 渲染当前状态
  const renderCurrentStatus = () => (
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
        当前认证状态
      </Text>

      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$1.5" alignItems="center">
            <Calendar size={16} color={color10} />
            <Text fontSize="$3" color="$color10">认证类型</Text>
          </XStack>
          <Text fontSize="$3" fontWeight="600" color="$color12">
            {myExpertProfile?.expertType === ExpertType.BUSINESS ? '商家达人' : '个人达人'}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$1.5" alignItems="center">
            <Clock size={16} color={color10} />
            <Text fontSize="$3" color="$color10">到期时间</Text>
          </XStack>
          <Text fontSize="$3" fontWeight="600" color="$color12">
            {myExpertProfile?.certExpireDate
              ? new Date(myExpertProfile.certExpireDate).toLocaleDateString('zh-CN')
              : '未知'}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$1.5" alignItems="center">
            <Clock size={16} color={color10} />
            <Text fontSize="$3" color="$color10">剩余天数</Text>
          </XStack>
          <Text fontSize="$3" fontWeight="600" color={remainingDays <= 30 ? warningColor : '$color12'}>
            {remainingDays}天
          </Text>
        </XStack>
      </YStack>
    </Card>
  );

  // 渲染退款计算
  const renderRefundCalculation = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
        <Text fontSize="$4" fontWeight="600" color="$color12">
          退款计算
        </Text>
        <View
          backgroundColor="$color4"
          paddingHorizontal="$2"
          paddingVertical="$0.5"
          borderRadius="$10"
        >
          <Text fontSize={10} color="$color10">
            扣除20%手续费
          </Text>
        </View>
      </XStack>

      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$color10">剩余价值</Text>
          <Text fontSize="$3" color="$color12">¥{refundInfo.original}</Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$color10">手续费(20%)</Text>
          <Text fontSize="$3" color={errorColor}>-¥{refundInfo.fee}</Text>
        </XStack>

        <View height={1} backgroundColor="$color5" marginVertical="$1" />

        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$4" fontWeight="600" color="$color12">预计退款</Text>
          <Text fontSize="$5" fontWeight="700" color={successColor}>
            ¥{refundInfo.refund}
          </Text>
        </XStack>
      </YStack>

      <View
        marginTop="$2"
        backgroundColor="$color4"
        borderRadius="$3"
        padding="$2"
      >
        <XStack gap="$1.5" alignItems="flex-start">
          <Info size={14} color={color10} style={{ marginTop: 2 }} />
          <Text fontSize="$2" color="$color10" flex={1} lineHeight={18}>
            退款金额 = 剩余天数 × 日均费用 × 80%（扣除20%手续费）
          </Text>
        </XStack>
      </View>
    </Card>
  );

  // 渲染解约须知
  const renderTerminationNotes = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <XStack gap="$1.5" alignItems="center" marginBottom="$2">
        <FileText size={18} color={warningColor} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          解约须知
        </Text>
      </XStack>

      <YStack gap="$2">
        {terminationNotes.map((note, index) => (
          <XStack key={index} gap="$2" alignItems="flex-start">
            <Text fontSize="$3" color="$color10" marginTop={2}>
              {index + 1}.
            </Text>
            <Text fontSize="$3" color="$color12" flex={1} lineHeight={20}>
              {note}
            </Text>
          </XStack>
        ))}
      </YStack>

      <Pressable onPress={handleTermsPress}>
        <XStack
          marginTop="$2"
          paddingTop="$2"
          borderTopWidth={1}
          borderTopColor="$color5"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="$3" color={primaryColor} fontWeight="500">
            查看完整服务协议
          </Text>
          <ChevronRight size={16} color={primaryColor} />
        </XStack>
      </Pressable>
    </Card>
  );

  // 渲染解约原因
  const renderReasonInput = () => (
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
        解约原因 <Text color={errorColor}>*</Text>
      </Text>

      <TextArea
        placeholder="请填写您选择解约的原因，以便我们改进服务..."
        value={reason}
        onChangeText={setReason}
        minHeight={100}
        backgroundColor="$color4"
        borderWidth={0}
        borderRadius="$4"
        padding="$2"
        fontSize="$3"
      />

      <Text fontSize="$2" color="$color10" marginTop="$1.5" textAlign="right">
        {reason.length}/200
      </Text>
    </Card>
  );

  // 渲染同意确认
  const renderAgreement = () => (
    <Pressable onPress={() => setAgreed(!agreed)}>
      <XStack
        marginHorizontal="$2.5"
        marginTop="$3"
        gap="$2"
        alignItems="center"
      >
        <View
          width={22}
          height={22}
          borderRadius={11}
          borderWidth={2}
          borderColor={agreed ? successColor : '$color10'}
          backgroundColor={agreed ? successColor : 'transparent'}
          justifyContent="center"
          alignItems="center"
        >
          {agreed && <CheckCircle size={14} color="white" />}
        </View>
        <Text fontSize="$3" color="$color12" flex={1}>
          我已阅读并理解上述解约须知，确认申请解约
        </Text>
      </XStack>
    </Pressable>
  );

  // 渲染提交按钮
  const renderSubmitButton = () => (
    <View
      marginHorizontal="$2.5"
      marginTop="$4"
      marginBottom="$4"
    >
      <Pressable onPress={handleSubmit}>
        <View
          backgroundColor={agreed && reason.trim() ? errorColor : '$color5'}
          paddingVertical="$3"
          borderRadius="$10"
          alignItems="center"
        >
          <Text
            fontSize="$4"
            fontWeight="600"
            color={agreed && reason.trim() ? 'white' : '$color10'}
          >
            提交解约申请
          </Text>
        </View>
      </Pressable>

      <Text fontSize="$2" color="$color10" textAlign="center" marginTop="$2">
        提交后将进入审核流程，审核通过后解约生效
      </Text>
    </View>
  );

  // 未认证时显示提示
  if (!myExpertProfile || myExpertProfile.certStatus !== ExpertCertStatus.VERIFIED) {
    return (
      <View flex={1} backgroundColor="$background">
        {/* 顶部导航 */}
        <View paddingTop={insets.top}>
          <TitleBar title="提前解约" />
        </View>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <XCircle size={64} color={color10} />
          <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$4">
            暂无达人资格
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$2" textAlign="center">
            您目前不是认证达人，无法进行解约操作
          </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <View
              marginTop="$4"
              backgroundColor={primaryColor}
              paddingHorizontal="$6"
              paddingVertical="$3"
              borderRadius="$10"
            >
              <Text fontSize="$3" color="white" fontWeight="500">
                返回
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="提前解约" />
      </View>

      {/* 滚动内容 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
      >
        {/* 警告提示 */}
        {renderWarning()}

        {/* 当前状态 */}
        {renderCurrentStatus()}

        {/* 退款计算 */}
        {renderRefundCalculation()}

        {/* 解约须知 */}
        {renderTerminationNotes()}

        {/* 解约原因 */}
        {renderReasonInput()}

        {/* 同意确认 */}
        {renderAgreement()}

        {/* 提交按钮 */}
        {renderSubmitButton()}

        {/* 底部间距 */}
        <View height={insets.bottom + 20} />
      </ScrollView>
    </View>
  );
};
