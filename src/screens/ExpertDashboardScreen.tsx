/**
 * ExpertDashboardScreen 达人工作台
 * 展示达人状态、接单统计、进行中订单、待接单需求
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
  Switch,
  useTheme,
} from 'tamagui';
import {
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
  Award,
  Calendar,
  User,
  Settings,
  Gift,
  Shield,
  FileText,
  CreditCard,
  UserCheck,
  TrendingUp,
  Users,
  MapPin,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { JobCard } from '@/components/JobCard';
import { ServiceJob, JobStatus } from '@/types/community';
import { Expert, ExpertType, ExpertCertStatus, ServiceType } from '@/types/community';
import { getJobs, getMyExpertProfile } from '@/services/communityDataService';

interface ExpertDashboardScreenProps {
  navigation: any;
}

/**
 * 达人工作台
 */
export const ExpertDashboardScreen: React.FC<ExpertDashboardScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [isOnline, setIsOnline] = useState(true);
  const [myExpertProfile, setMyExpertProfile] = useState<Expert | null>(null);
  const [stats, setStats] = useState({
    todayOrders: 3,
    monthOrders: 28,
    totalOrders: 156,
    todayIncome: 450,
    monthIncome: 12500,
    totalIncome: 78600,
  });
  const [pendingJobs, setPendingJobs] = useState<ServiceJob[]>([]);
  const [activeOrders, setActiveOrders] = useState({
    pending: 5,
    attention: 2,
    completed: 28,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 加载我的达人信息
      const profile = await getMyExpertProfile();
      setMyExpertProfile(profile);

      // 加载待接单需求（已发布的需求）
      const jobs = await getJobs({
        status: JobStatus.PUBLISHED,
      });

      // 模拟筛选：只显示匹配达人服务类型的需求
      const matchedJobs = jobs.slice(0, 10);
      setPendingJobs(matchedJobs);
    } catch (error) {
      console.error('加载工作台数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    // TODO: 调用 updateExpertStatus() 更新在线状态
  };

  const handleViewAllOrders = () => {
    navigation.navigate('ExpertOrders');
  };

  const handleViewSettings = () => {
    navigation.navigate('ExpertSettings');
  };

  const handleViewTerms = () => {
    navigation.navigate('ExpertTerms');
  };

  // 获取达人类型标签
  const getExpertTypeLabel = (type: ExpertType): string => {
    return type === ExpertType.BUSINESS ? '商家达人' : '个人达人';
  };

  // 获取认证状态颜色
  const getCertStatusColor = (status: ExpertCertStatus): string | undefined => {
    switch (status) {
      case ExpertCertStatus.VERIFIED:
        return successColor;
      case ExpertCertStatus.PENDING:
        return warningColor;
      case ExpertCertStatus.REJECTED:
        return errorColor;
      default:
        return color10;
    }
  };

  // 获取服务类型中文标签
  const getServiceTypeLabel = (type: ServiceType): string => {
    const labels: Record<string, string> = {
      [ServiceType.HOUSEKEEPING]: '家政保洁',
      [ServiceType.REPAIR]: '维修安装',
      [ServiceType.MOVING]: '搬家运输',
      [ServiceType.DELIVERY]: '代买代送',
      [ServiceType.MEAL_PREP]: '营养配餐',
      [ServiceType.PET_CARE]: '宠物照顾',
      [ServiceType.GARDENING]: '园艺绿化',
      [ServiceType.ESCORT]: '陪诊陪护',
      [ServiceType.CHILDCARE]: '儿童看护',
      [ServiceType.ELDERCARE]: '养老陪护',
      [ServiceType.NURSING]: '专业护理',
      [ServiceType.COMPANION]: '陪伴聊天',
      [ServiceType.TUTORING]: '家教辅导',
      [ServiceType.TRANSLATION]: '翻译服务',
      [ServiceType.PHOTOGRAPHY]: '摄影拍照',
      [ServiceType.MAKEUP]: '化妆造型',
      [ServiceType.DRIVING]: '代驾陪驾',
      [ServiceType.IT_SUPPORT]: '电脑维护',
      [ServiceType.PHONE_TEACH]: '手机教学',
      [ServiceType.GRAPHIC_DESIGN]: '平面设计',
      [ServiceType.VIDEO_EDITING]: '视频剪辑',
      [ServiceType.WRITING]: '文案写作',
      [ServiceType.HANDICRAFT]: '手工制作',
      [ServiceType.FITNESS]: '健身教练',
      [ServiceType.YOGA]: '瑜伽教学',
      [ServiceType.DANCE]: '舞蹈教学',
      [ServiceType.MUSIC]: '音乐教学',
      [ServiceType.PAINTING]: '绘画教学',
      [ServiceType.COOKING]: '烹饪教学',
      [ServiceType.MASSAGE]: '按摩理疗',
      [ServiceType.BEAUTY]: '美容美甲',
      [ServiceType.OTHER]: '其他服务',
    };
    return labels[type] || '其他服务';
  };

  // 计算剩余天数
  const getRemainingDays = (): number => {
    if (!myExpertProfile?.certExpireDate) return 0;
    const expire = new Date(myExpertProfile.certExpireDate);
    const now = new Date();
    const diff = expire.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // 渲染在线状态开关（用于TitleBar右侧）
  const renderOnlineSwitch = () => (
    <XStack gap="$2" alignItems="center">
      <Text fontSize="$3" color={isOnline ? primaryColor : color10} fontWeight="500">
        {isOnline ? '在线' : '离线'}
      </Text>
      <Switch
        checked={isOnline}
        onCheckedChange={handleToggleOnline}
        size="$3"
        backgroundColor={isOnline ? primaryColor : '$color5'}
      >
        <Switch.Thumb
          animation="quick"
          backgroundColor={isOnline ? `${primaryColor}30` : '$color6'}
          borderWidth={1}
          borderColor={isOnline ? primaryColor : '$color8'}
        />
      </Switch>
    </XStack>
  );

  // 渲染达人身份卡片
  const renderExpertProfileCard = () => {
    if (!myExpertProfile) return null;

    const remainingDays = getRemainingDays();

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
        <XStack gap="$2" alignItems="center">
          {/* 达人头像 */}
          <View
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor={`${primaryColor}15`}
            justifyContent="center"
            alignItems="center"
          >
            <Award size={28} color={primaryColor} />
          </View>

          <YStack flex={1} gap="$1">
            <XStack gap="$1.5" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {myExpertProfile.name}
              </Text>
              <View
                backgroundColor={getCertStatusColor(myExpertProfile.certStatus)}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color="white" fontWeight="500">
                  {getExpertTypeLabel(myExpertProfile.expertType)}
                </Text>
              </View>
            </XStack>

            <XStack gap="$3">
              <XStack gap="$1" alignItems="center">
                <Star size={12} color={warningColor} fill={warningColor} />
                <Text fontSize="$2" color="$color10">
                  {myExpertProfile.rating.toFixed(1)}分
                </Text>
              </XStack>
              <XStack gap="$1" alignItems="center">
                <Calendar size={12} color={color10} />
                <Text fontSize="$2" color={remainingDays <= 30 ? warningColor : '$color10'}>
                  剩余{remainingDays}天
                </Text>
              </XStack>
            </XStack>
          </YStack>

          <Pressable onPress={handleViewSettings}>
            <View
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$color4"
              justifyContent="center"
              alignItems="center"
            >
              <Settings size={18} color={color10} />
            </View>
          </Pressable>
        </XStack>

        {/* 服务技能 */}
        <View marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$color5">
          <Text fontSize="$2" color="$color10" marginBottom="$1.5">
            服务技能
          </Text>
          <XStack flexWrap="wrap" gap="$1.5">
            {myExpertProfile.serviceTypes?.map((type, index) => (
              <View
                key={index}
                backgroundColor={`${primaryColor}15`}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$10"
              >
                <Text fontSize={10} color={primaryColor} fontWeight="500">
                  {getServiceTypeLabel(type)}
                </Text>
              </View>
            ))}
          </XStack>
        </View>
      </Card>
    );
  };

  // 渲染今日统计
  const renderTodayStats = () => (
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
        今日接单
      </Text>

      <XStack gap="$2">
        <View
          flex={1}
          backgroundColor={`${primaryColor}10`}
          padding="$2"
          borderRadius="$4"
          alignItems="center"
        >
          <Briefcase size={20} color={primaryColor} />
          <Text fontSize="$5" fontWeight="700" color={primaryColor} marginTop="$1">
            {stats.todayOrders}
          </Text>
          <Text fontSize="$2" color="$color10">
            订单数
          </Text>
        </View>

        <View
          flex={1}
          backgroundColor={`${successColor}10`}
          padding="$2"
          borderRadius="$4"
          alignItems="center"
        >
          <DollarSign size={20} color={successColor} />
          <Text fontSize="$5" fontWeight="700" color={successColor} marginTop="$1">
            ¥{stats.todayIncome}
          </Text>
          <Text fontSize="$2" color="$color10">
            收入
          </Text>
        </View>
      </XStack>
    </Card>
  );

  // 渲染累计统计
  const renderTotalStats = () => (
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
        累计数据
      </Text>

      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <View
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor={`${primaryColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <Briefcase size={16} color={primaryColor} />
            </View>
            <YStack>
              <Text fontSize="$2" color="$color10">
                本月订单
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$color12">
                {stats.monthOrders}单
              </Text>
            </YStack>
          </XStack>
          <YStack alignItems="flex-end">
            <Text fontSize="$2" color="$color10">
              累计订单
            </Text>
            <Text fontSize="$4" fontWeight="600" color="$color12">
              {stats.totalOrders}单
            </Text>
          </YStack>
        </XStack>

        <View height={1} backgroundColor="$color5" />

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <View
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor={`${successColor}15`}
              justifyContent="center"
              alignItems="center"
            >
              <DollarSign size={16} color={successColor} />
            </View>
            <YStack>
              <Text fontSize="$2" color="$color10">
                本月收入
              </Text>
              <Text fontSize="$4" fontWeight="600" color={successColor}>
                ¥{stats.monthIncome}
              </Text>
            </YStack>
          </XStack>
          <YStack alignItems="flex-end">
            <Text fontSize="$2" color="$color10">
              累计收入
            </Text>
            <Text fontSize="$4" fontWeight="600" color={successColor}>
              ¥{stats.totalIncome}
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </Card>
  );

  // 渲染进行中订单
  const renderActiveOrders = () => (
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
          进行中订单
        </Text>
        <Pressable onPress={handleViewAllOrders}>
          <XStack gap="$0.5" alignItems="center">
            <Text fontSize="$3" color={primaryColor} fontWeight="500">
              查看全部
            </Text>
            <ChevronRight size={14} color={primaryColor} />
          </XStack>
        </Pressable>
      </XStack>

      <XStack gap="$2">
        <Pressable style={{ flex: 1 }} onPress={handleViewAllOrders}>
          <View
            flex={1}
            backgroundColor={`${warningColor}10`}
            padding="$2"
            borderRadius="$4"
            alignItems="center"
          >
            <Clock size={20} color={warningColor} />
            <Text fontSize="$5" fontWeight="700" color={warningColor} marginTop="$1">
              {activeOrders.pending}
            </Text>
            <Text fontSize="$2" color="$color10">
              待完成
            </Text>
          </View>
        </Pressable>

        <Pressable style={{ flex: 1 }} onPress={handleViewAllOrders}>
          <View
            flex={1}
            backgroundColor={`${errorColor}10`}
            padding="$2"
            borderRadius="$4"
            alignItems="center"
          >
            <AlertCircle size={20} color={errorColor} />
            <Text fontSize="$5" fontWeight="700" color={errorColor} marginTop="$1">
              {activeOrders.attention}
            </Text>
            <Text fontSize="$2" color="$color10">
              需注意
            </Text>
          </View>
        </Pressable>

        <Pressable style={{ flex: 1 }} onPress={handleViewAllOrders}>
          <View
            flex={1}
            backgroundColor={`${successColor}10`}
            padding="$2"
            borderRadius="$4"
            alignItems="center"
          >
            <CheckCircle size={20} color={successColor} />
            <Text fontSize="$5" fontWeight="700" color={successColor} marginTop="$1">
              {activeOrders.completed}
            </Text>
            <Text fontSize="$2" color="$color10">
              本月完成
            </Text>
          </View>
        </Pressable>
      </XStack>
    </Card>
  );

  // 渲染推荐需求
  const renderPendingJobs = () => (
    <View marginTop="$2" marginBottom="$4">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginHorizontal="$2.5"
        marginBottom="$2"
      >
        <Text fontSize="$4" fontWeight="600" color="$color12">
          推荐需求
        </Text>
        <Pressable onPress={() => navigation.navigate('JobList')}>
          <XStack gap="$0.5" alignItems="center">
            <Text fontSize="$3" color={primaryColor} fontWeight="500">
              查看更多
            </Text>
            <ChevronRight size={14} color={primaryColor} />
          </XStack>
        </Pressable>
      </XStack>

      {loading ? (
        <View
          marginHorizontal="$2.5"
          backgroundColor="$color2"
          borderRadius="$5"
          padding="$4"
          alignItems="center"
        >
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      ) : pendingJobs.length === 0 ? (
        <View
          marginHorizontal="$2.5"
          backgroundColor="$color2"
          borderRadius="$5"
          padding="$4"
          alignItems="center"
        >
          <Text fontSize={48} marginBottom="$2">
            🤝
          </Text>
          <Text fontSize="$4" fontWeight="600" color="$color12">
            暂无匹配的需求
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$1">
            完善你的服务类型可以接到更多单
          </Text>
        </View>
      ) : (
        <YStack gap="$2" paddingHorizontal="$2.5">
          {pendingJobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} onPress={handleJobPress} />
          ))}
        </YStack>
      )}
    </View>
  );

  // 达人权益数据
  const expertBenefits = [
    {
      icon: TrendingUp,
      title: '优先展示',
      description: '认证达人在列表中优先展示，获得更多曝光',
    },
    {
      icon: Users,
      title: '精准匹配',
      description: '系统根据技能自动推荐匹配的服务需求',
    },
    {
      icon: Shield,
      title: '信任认证',
      description: '官方认证标识，提升用户信任度',
    },
    {
      icon: DollarSign,
      title: '收入保障',
      description: '平台担保交易，收入安全有保障',
    },
    {
      icon: MapPin,
      title: '本地服务',
      description: '服务同小区邻居，距离近更方便',
    },
    {
      icon: Gift,
      title: '专属福利',
      description: '达人专属活动和优惠，定期派发奖励',
    },
  ];

  // 达人义务数据
  const expertObligations = [
    '遵守平台服务规范，提供优质服务',
    '按时响应用户咨询，24小时内回复',
    '真实填写个人资料和服务信息',
    '服务完成后配合用户评价',
    '保护用户隐私，不泄露个人信息',
    '接受平台监督，处理用户投诉',
  ];

  // 认证资费数据
  const certificationFees = [
    {
      type: '个人达人',
      icon: User,
      fee: '¥500/年',
      features: ['个人技能认证', '接单无限制', '基础曝光展示', '平台客服支持'],
    },
    {
      type: '商家达人',
      icon: Briefcase,
      fee: '¥2000/年',
      features: ['企业资质认证', '专属商家标识', '优先排名展示', '专属运营对接'],
    },
  ];

  // 服务协议数据
  const serviceAgreements = [
    { title: '达人服务协议', route: 'ExpertServiceAgreement' },
    { title: '隐私保护政策', route: 'PrivacyPolicy' },
    { title: '平台交易规则', route: 'TradingRules' },
    { title: '用户行为规范', route: 'UserConduct' },
  ];

  // 渲染达人权益卡片
  const renderExpertBenefitsCard = () => (
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
        <Gift size={18} color={primaryColor} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          达人权益
        </Text>
      </XStack>

      <XStack flexWrap="wrap" gap="$1.5">
        {expertBenefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <View
              key={index}
              flexBasis="48%"
              flexGrow={1}
              backgroundColor={`${primaryColor}08`}
              padding="$2"
              borderRadius="$4"
              borderWidth={1}
              borderColor={`${primaryColor}20`}
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$1">
                <View
                  width={28}
                  height={28}
                  borderRadius={14}
                  backgroundColor={`${primaryColor}15`}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconComponent size={14} color={primaryColor} />
                </View>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {benefit.title}
                </Text>
              </XStack>
              <Text fontSize="$2" color="$color10" numberOfLines={2}>
                {benefit.description}
              </Text>
            </View>
          );
        })}
      </XStack>
    </Card>
  );

  // 渲染达人义务卡片
  const renderExpertObligationsCard = () => (
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
        <Shield size={18} color={warningColor} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          达人义务
        </Text>
      </XStack>

      <YStack gap="$1.5">
        {expertObligations.map((obligation, index) => (
          <XStack key={index} gap="$2" alignItems="flex-start">
            <View
              width={20}
              height={20}
              borderRadius={10}
              backgroundColor={`${warningColor}15`}
              justifyContent="center"
              alignItems="center"
              marginTop={2}
            >
              <Text fontSize={10} color={warningColor} fontWeight="600">
                {index + 1}
              </Text>
            </View>
            <Text fontSize="$3" color="$color12" flex={1}>
              {obligation}
            </Text>
          </XStack>
        ))}
      </YStack>
    </Card>
  );

  // 渲染认证资费卡片
  const renderCertificationFeesCard = () => (
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
        <CreditCard size={18} color={successColor} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          认证资费
        </Text>
      </XStack>

      <XStack gap="$2">
        {certificationFees.map((plan, index) => {
          const IconComponent = plan.icon;
          const isRecommended = index === 0;
          return (
            <View
              key={index}
              flex={1}
              backgroundColor={isRecommended ? `${primaryColor}08` : '$color4'}
              padding="$2"
              borderRadius="$4"
              borderWidth={1}
              borderColor={isRecommended ? primaryColor : '$color5'}
            >
              <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  backgroundColor={isRecommended ? `${primaryColor}15` : '$color5'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconComponent size={16} color={isRecommended ? primaryColor : color10} />
                </View>
                <YStack>
                  <Text fontSize="$3" fontWeight="600" color="$color12">
                    {plan.type}
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color={isRecommended ? primaryColor : successColor}>
                    {plan.fee}
                  </Text>
                </YStack>
              </XStack>

              <YStack gap="$1">
                {plan.features.map((feature, fIndex) => (
                  <XStack key={fIndex} gap="$1" alignItems="center">
                    <CheckCircle size={12} color={successColor} />
                    <Text fontSize="$2" color="$color10">
                      {feature}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </View>
          );
        })}
      </XStack>
    </Card>
  );

  // 渲染服务协议卡片
  const renderServiceAgreementsCard = () => (
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
        <FileText size={18} color={color10} />
        <Text fontSize="$4" fontWeight="600" color="$color12">
          服务协议
        </Text>
      </XStack>

      <YStack gap="$1">
        {serviceAgreements.map((agreement, index) => (
          <Pressable key={index} onPress={() => Alert.alert(agreement.title, '协议内容开发中，敬请期待...')}>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingVertical="$1.5"
              borderBottomWidth={index < serviceAgreements.length - 1 ? 1 : 0}
              borderBottomColor="$color5"
            >
              <Text fontSize="$3" color="$color12">
                {agreement.title}
              </Text>
              <ChevronRight size={16} color={color10} />
            </XStack>
          </Pressable>
        ))}
      </YStack>
    </Card>
  );

  // 渲染申请认证按钮
  const renderApplyButton = () => (
    <View marginHorizontal="$2.5" marginTop="$4" marginBottom="$4">
      <Pressable onPress={() => navigation.navigate('ExpertCertification')}>
        <View
          backgroundColor={primaryColor}
          paddingVertical="$3"
          borderRadius="$10"
          alignItems="center"
        >
          <XStack gap="$2" alignItems="center">
            <UserCheck size={20} color="white" />
            <Text fontSize="$4" color="white" fontWeight="600">
              立即申请成为达人
            </Text>
          </XStack>
        </View>
      </Pressable>
      <Text fontSize="$2" color="$color10" textAlign="center" marginTop="$2">
        提交认证资料后，预计1-3个工作日内完成审核
      </Text>
    </View>
  );

  // 未认证时显示达人介绍
  if (!loading && !myExpertProfile) {
    return (
      <View flex={1} backgroundColor="$background">
        <View paddingTop={insets.top}>
          <TitleBar title="成为达人" />
        </View>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部横幅 */}
          <View
            marginHorizontal="$2.5"
            marginTop="$2"
            padding="$4"
            borderRadius="$5"
            backgroundColor={`${primaryColor}15`}
            alignItems="center"
          >
            <View
              width={72}
              height={72}
              borderRadius={36}
              backgroundColor={primaryColor}
              justifyContent="center"
              alignItems="center"
              marginBottom="$2"
            >
              <Award size={36} color="white" />
            </View>
            <Text fontSize="$5" fontWeight="700" color="$color12">
              加入邻里达人
            </Text>
            <Text fontSize="$3" color="$color10" marginTop="$1" textAlign="center">
              发挥你的专业技能，服务身边邻居，轻松赚取收入
            </Text>
          </View>

          {/* 达人权益 */}
          {renderExpertBenefitsCard()}

          {/* 达人义务 */}
          {renderExpertObligationsCard()}

          {/* 认证资费 */}
          {renderCertificationFeesCard()}

          {/* 服务协议 */}
          {renderServiceAgreementsCard()}

          {/* 申请按钮 */}
          {renderApplyButton()}

          {/* 底部间距 */}
          <View height={insets.bottom + 20} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="达人工作台"
          renderRight={renderOnlineSwitch}
        />
      </View>

      {/* 滚动内容 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 达人身份卡片 */}
        {renderExpertProfileCard()}

        {/* 今日统计 */}
        {renderTodayStats()}

        {/* 累计统计 */}
        {renderTotalStats()}

        {/* 进行中订单 */}
        {renderActiveOrders()}

        {/* 推荐需求 */}
        {renderPendingJobs()}

        {/* 底部间距 */}
        <View height={insets.bottom + 20} />
      </ScrollView>
    </View>
  );
};
