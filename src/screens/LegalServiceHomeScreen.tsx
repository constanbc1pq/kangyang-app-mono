/**
 * Legal Service Home Screen
 * Phase 38.1: 法律服务首页 - Legal Service Home Screen
 *
 * Features:
 * - Video banner for legal education
 * - Quick access (4 cards: will creation, lawyer consultation, legal checkup, my wills)
 * - Service categories (will service, guardianship, property planning, elderly support, consumer rights)
 * - Recommended lawyers slider
 * - Knowledge base tabs (articles, videos, cases)
 * - Membership center entry
 *
 * Design: Following PrivateDoctor and ElderlyService patterns
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  H4,
  Theme,
  ScrollView,
  Button,
  Separator,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  Scale,
  FileText,
  MessageCircle,
  ClipboardCheck,
  Shield,
  Users,
  Home,
  Heart,
  ShoppingCart,
  Briefcase,
  BookOpen,
  Video,
  FileStack,
  Star,
  Award,
  CheckCircle,
  PlayCircle,
  ChevronRight,
  Crown,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLawyers } from '@/services/legalService';

const { width } = Dimensions.get('window');

// ==================== Type Definitions ====================

type KnowledgeTab = 'articles' | 'videos' | 'cases';

interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  screen: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  screen: string;
  badge?: string;
}

interface RecommendedLawyer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: number;
  rating: number;
  cases: number;
  verified: boolean;
}

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  views: number;
  date: string;
}

interface LegalServiceHomeScreenProps {
  navigation: any;
}

const LegalServiceHomeScreen: React.FC<LegalServiceHomeScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<KnowledgeTab>('articles');
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(true);

  // 加载律师数据
  const loadLawyersData = async () => {
    try {
      setLoadingLawyers(true);
      const lawyersData = await getLawyers();
      setLawyers(lawyersData.slice(0, 4)); // 只显示前4个律师
    } catch (error) {
      console.error('Failed to load lawyers:', error);
      setLawyers([]);
    } finally {
      setLoadingLawyers(false);
    }
  };

  // 刷新数据
  useFocusEffect(
    React.useCallback(() => {
      // 页面获得焦点时刷新数据
      console.log('LegalServiceHome focused - refreshing data');
      loadLawyersData();
    }, [])
  );

  // ==================== Data ====================

  const QUICK_ACCESS: QuickAccessItem[] = [
    {
      id: 'will_creator',
      title: '立即制作遗嘱',
      subtitle: '简单3步完成',
      icon: FileText,
      color: COLORS.primary,
      screen: 'WillCreator',
    },
    {
      id: 'lawyer_consult',
      title: '咨询律师',
      subtitle: '专业解答',
      icon: MessageCircle,
      color: COLORS.success,
      screen: 'LawyerList',
    },
    {
      id: 'legal_checkup',
      title: '法律体检',
      subtitle: '风险评估',
      icon: ClipboardCheck,
      color: COLORS.warning,
      screen: 'LegalCheckup',
    },
    {
      id: 'my_wills',
      title: '我的遗嘱',
      subtitle: '查看管理',
      icon: Shield,
      color: COLORS.secondary,
      screen: 'MyWills',
    },
  ];

  const SERVICE_CATEGORIES: ServiceCategory[] = [
    {
      id: 'will_service',
      name: '遗嘱服务',
      description: '遗嘱制作、公证、保管',
      icon: FileText,
      color: COLORS.primary,
      screen: 'WillCreator',
      badge: '热门',
    },
    {
      id: 'guardianship',
      name: '意定监护',
      description: '监护人指定、协议签署',
      icon: Users,
      color: COLORS.secondary,
      screen: 'GuardianshipCreator',
    },
    {
      id: 'property',
      name: '财产规划',
      description: '资产盘点、继承规划',
      icon: Home,
      color: COLORS.success,
      screen: 'PropertyInventory',
    },
    {
      id: 'support',
      name: '养老赡养',
      description: '赡养协议、权益保障',
      icon: Heart,
      color: COLORS.error,
      screen: 'DocumentTemplate',
    },
    {
      id: 'consumer',
      name: '消费维权',
      description: '合同审查、纠纷调解',
      icon: ShoppingCart,
      color: COLORS.warning,
      screen: 'ContractReview',
    },
    {
      id: 'case',
      name: '案件委托',
      description: '诉讼代理、法律援助',
      icon: Briefcase,
      color: COLORS.accent,
      screen: 'CaseDelegation',
    },
  ];

  // Lawyers data now loaded from @kangyang_lawyers storage
  // const RECOMMENDED_LAWYERS: RecommendedLawyer[] = [];

  const KNOWLEDGE_ARTICLES: KnowledgeItem[] = [
    {
      id: 'article_1',
      title: '如何订立一份有效的遗嘱？',
      category: '遗嘱继承',
      views: 12500,
      date: '2024-01-15',
    },
    {
      id: 'article_2',
      title: '老年人防骗指南：常见养老诈骗手段',
      category: '风险防范',
      views: 18900,
      date: '2024-01-10',
    },
    {
      id: 'article_3',
      title: '意定监护协议的法律效力',
      category: '监护制度',
      views: 8600,
      date: '2024-01-05',
    },
  ];

  const KNOWLEDGE_VIDEOS: KnowledgeItem[] = [
    {
      id: 'video_1',
      title: '遗嘱订立全流程讲解',
      category: '遗嘱继承',
      views: 8900,
      date: '2024-01-20',
    },
    {
      id: 'video_2',
      title: '如何选择合适的监护人',
      category: '监护制度',
      views: 6700,
      date: '2024-01-18',
    },
  ];

  const KNOWLEDGE_CASES: KnowledgeItem[] = [
    {
      id: 'case_1',
      title: '王某遗嘱继承纠纷案',
      category: '遗嘱纠纷',
      views: 5600,
      date: '2023-12-15',
    },
    {
      id: 'case_2',
      title: '李某意定监护案例分析',
      category: '监护纠纷',
      views: 4200,
      date: '2023-12-10',
    },
  ];

  // ==================== Handlers ====================

  const handleQuickAccess = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const handleServiceCategory = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const handleLawyerPress = (lawyerId: string) => {
    navigation.navigate('LawyerDetail' as never, { lawyerId } as never);
  };

  const handleKnowledgeItem = (itemId: string, type: KnowledgeTab) => {
    if (type === 'articles') {
      navigation.navigate('LegalArticle' as never, { articleId: itemId } as never);
    } else if (type === 'videos') {
      navigation.navigate('LegalVideo' as never, { videoId: itemId } as never);
    } else if (type === 'cases') {
      navigation.navigate('CaseLibrary' as never, { caseId: itemId } as never);
    }
  };

  const handleViewAllLawyers = () => {
    navigation.navigate('LawyerList' as never);
  };

  const handleMembershipCenter = () => {
    navigation.navigate('LegalMembership' as never);
  };

  const getKnowledgeData = (): KnowledgeItem[] => {
    if (selectedTab === 'articles') return KNOWLEDGE_ARTICLES;
    if (selectedTab === 'videos') return KNOWLEDGE_VIDEOS;
    return KNOWLEDGE_CASES;
  };

  // ==================== Render ====================

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack space="$4" paddingBottom="$6">
            {/* Header */}
            <XStack
              height={56}
              alignItems="center"
              paddingHorizontal="$4"
              backgroundColor="$background"
            >
              <Pressable onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={COLORS.text} />
              </Pressable>
              <Text fontSize="$6" fontWeight="600" color="$text" marginLeft="$3">
                遗嘱及法律服务
              </Text>
            </XStack>

            {/* Video Banner */}
            <View paddingHorizontal="$4">
              <View borderRadius="$4" overflow="hidden">
                <LinearGradient
                  colors={['#8b5cf6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ height: 180 }}
                >
                  <View flex={1} justifyContent="center" alignItems="center">
                    <View
                      width={64}
                      height={64}
                      borderRadius={32}
                      backgroundColor="rgba(255,255,255,0.3)"
                      justifyContent="center"
                      alignItems="center"
                      marginBottom="$3"
                    >
                      <PlayCircle size={32} color="white" />
                    </View>
                    <Text fontSize="$6" fontWeight="700" color="white" marginBottom="$2">
                      法律知识科普
                    </Text>
                    <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                      了解遗嘱与法律的基本知识
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Membership Promotion Banner */}
            <View paddingHorizontal="$4" marginBottom="$1">
              <Card
                padding="$0"
                borderRadius="$4"
                backgroundColor="$cardBg"
                overflow="hidden"
                pressStyle={{ scale: 0.98 }}
                shadowColor="$shadow"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={4}
                onPress={handleMembershipCenter}
              >
                <LinearGradient
                  colors={['#fef3c7', '#fde68a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ padding: 16 }}
                >
                  <XStack alignItems="center" space="$3">
                    <View
                      width={56}
                      height={56}
                      borderRadius={28}
                      backgroundColor="rgba(251, 191, 36, 0.3)"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Crown size={28} color="#f59e0b" />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$5" fontWeight="700" color="#92400e" marginBottom="$1">
                        开通尊享计划
                      </Text>
                      <Text fontSize="$3" color="#78350f">
                        专属服务 · 优先咨询 · 无限次使用
                      </Text>
                    </YStack>
                    <ChevronRight size={24} color="#92400e" />
                  </XStack>
                </LinearGradient>
              </Card>
            </View>

            {/* Quick Access Grid */}
            <YStack space="$3" paddingHorizontal="$4">
              <H3 fontSize="$6" fontWeight="600" color="$text">
                快速入口
              </H3>
              <XStack space="$3">
                <XStack flex={1} space="$3">
                  {QUICK_ACCESS.slice(0, 2).map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Card
                        key={item.id}
                        flex={1}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        pressStyle={{ scale: 0.98 }}
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={8}
                        elevation={4}
                        onPress={() => handleQuickAccess(item.screen)}
                      >
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${item.color}15`}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$3"
                        >
                          <IconComponent size={24} color={item.color} />
                        </View>
                        <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                          {item.title}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary">
                          {item.subtitle}
                        </Text>
                      </Card>
                    );
                  })}
                </XStack>
              </XStack>
              <XStack space="$3">
                <XStack flex={1} space="$3">
                  {QUICK_ACCESS.slice(2, 4).map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Card
                        key={item.id}
                        flex={1}
                        padding="$4"
                        borderRadius="$4"
                        backgroundColor="$cardBg"
                        pressStyle={{ scale: 0.98 }}
                        shadowColor="$shadow"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={8}
                        elevation={4}
                        onPress={() => handleQuickAccess(item.screen)}
                      >
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          backgroundColor={`${item.color}15`}
                          justifyContent="center"
                          alignItems="center"
                          marginBottom="$3"
                        >
                          <IconComponent size={24} color={item.color} />
                        </View>
                        <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                          {item.title}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary">
                          {item.subtitle}
                        </Text>
                      </Card>
                    );
                  })}
                </XStack>
              </XStack>
            </YStack>

            {/* Service Categories */}
            <YStack space="$3" paddingHorizontal="$4">
              <H3 fontSize="$6" fontWeight="600" color="$text">
                服务分类
              </H3>
              <YStack space="$3">
                {SERVICE_CATEGORIES.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <Card
                      key={service.id}
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$cardBg"
                      pressStyle={{ scale: 0.98 }}
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={8}
                      elevation={4}
                      onPress={() => handleServiceCategory(service.screen)}
                    >
                      <XStack alignItems="center" space="$3">
                        <View
                          width={56}
                          height={56}
                          borderRadius={28}
                          backgroundColor={`${service.color}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconComponent size={28} color={service.color} />
                        </View>
                        <YStack flex={1}>
                          <XStack alignItems="center" space="$2" marginBottom="$1">
                            <Text fontSize="$5" fontWeight="600" color="$text">
                              {service.name}
                            </Text>
                            {service.badge && (
                              <View
                                backgroundColor={COLORS.error}
                                paddingHorizontal="$2"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize={10} color="white" fontWeight="600">
                                  {service.badge}
                                </Text>
                              </View>
                            )}
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary">
                            {service.description}
                          </Text>
                        </YStack>
                        <ChevronRight size={20} color={COLORS.textSecondary} />
                      </XStack>
                    </Card>
                  );
                })}
              </YStack>
            </YStack>

            {/* Recommended Lawyers */}
            <YStack space="$3">
              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal="$4"
              >
                <H3 fontSize="$6" fontWeight="600" color="$text">
                  推荐律师
                </H3>
                <Pressable onPress={handleViewAllLawyers}>
                  <XStack alignItems="center" space="$1">
                    <Text fontSize="$3" color={COLORS.primary}>
                      查看全部
                    </Text>
                    <ChevronRight size={16} color={COLORS.primary} />
                  </XStack>
                </Pressable>
              </XStack>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={lawyers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                  <Card
                    width={200}
                    padding="$4"
                    borderRadius="$4"
                    backgroundColor="$cardBg"
                    marginRight="$3"
                    pressStyle={{ scale: 0.98 }}
                    shadowColor="$shadow"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={8}
                    elevation={4}
                    onPress={() => handleLawyerPress(item.id)}
                  >
                    <YStack space="$2">
                      <XStack alignItems="center" space="$2.5" marginBottom="$2">
                        <View
                          width={56}
                          height={56}
                          borderRadius={28}
                          backgroundColor={COLORS.primaryLight}
                          justifyContent="center"
                          alignItems="center"
                          position="relative"
                        >
                          <Text fontSize="$6" fontWeight="700" color="white">
                            {item.name.charAt(0)}
                          </Text>
                          {item.verified && (
                            <View
                              position="absolute"
                              bottom={-2}
                              right={-2}
                              backgroundColor="white"
                              borderRadius={10}
                              padding="$0.5"
                            >
                              <CheckCircle size={14} color={COLORS.success} />
                            </View>
                          )}
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$4" fontWeight="600" color="$text" numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
                            {item.title}
                          </Text>
                        </YStack>
                      </XStack>

                      <View
                        height={1}
                        backgroundColor={COLORS.border}
                        marginVertical="$1"
                      />

                      <YStack space="$1.5">
                        <Text fontSize="$3" color={COLORS.primary} numberOfLines={1}>
                          {item.specialty}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary" numberOfLines={1}>
                          {item.lawFirm || '专业律师事务所'}
                        </Text>
                        <XStack alignItems="center" justifyContent="space-between">
                          <Text fontSize="$2" color="$textSecondary">
                            {item.experience}年经验
                          </Text>
                          <XStack alignItems="center" space="$1">
                            <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                            <Text fontSize="$2" color="$text" fontWeight="600">
                              {item.rating}
                            </Text>
                          </XStack>
                        </XStack>
                      </YStack>

                      <View
                        height={1}
                        backgroundColor={COLORS.border}
                        marginVertical="$1"
                      />

                      <XStack alignItems="center" justifyContent="space-between">
                        <Text fontSize="$2" color="$textSecondary">
                          已办理 {item.cases}+ 案件
                        </Text>
                        <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                          ¥{item.consultationFee || 200}/次
                        </Text>
                      </XStack>
                    </YStack>
                  </Card>
                )}
              />
            </YStack>

            {/* Knowledge Base */}
            <YStack space="$3" paddingHorizontal="$4">
              <H3 fontSize="$6" fontWeight="600" color="$text">
                知识库
              </H3>

              {/* Tabs */}
              <XStack space="$2">
                <Button
                  size="$3"
                  backgroundColor={selectedTab === 'articles' ? COLORS.primary : '$surface'}
                  color={selectedTab === 'articles' ? 'white' : '$text'}
                  borderRadius="$3"
                  onPress={() => setSelectedTab('articles')}
                  pressStyle={{ scale: 0.98 }}
                >
                  法律文章
                </Button>
                <Button
                  size="$3"
                  backgroundColor={selectedTab === 'videos' ? COLORS.primary : '$surface'}
                  color={selectedTab === 'videos' ? 'white' : '$text'}
                  borderRadius="$3"
                  onPress={() => setSelectedTab('videos')}
                  pressStyle={{ scale: 0.98 }}
                >
                  视频课堂
                </Button>
                <Button
                  size="$3"
                  backgroundColor={selectedTab === 'cases' ? COLORS.primary : '$surface'}
                  color={selectedTab === 'cases' ? 'white' : '$text'}
                  borderRadius="$3"
                  onPress={() => setSelectedTab('cases')}
                  pressStyle={{ scale: 0.98 }}
                >
                  案例分析
                </Button>
              </XStack>

              {/* Knowledge List */}
              <YStack space="$2">
                {getKnowledgeData().map((item) => (
                  <Card
                    key={item.id}
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$cardBg"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => handleKnowledgeItem(item.id, selectedTab)}
                  >
                    <XStack alignItems="center" space="$3">
                      <View
                        width={40}
                        height={40}
                        borderRadius={20}
                        backgroundColor={`${COLORS.primary}15`}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {selectedTab === 'articles' && <BookOpen size={20} color={COLORS.primary} />}
                        {selectedTab === 'videos' && <Video size={20} color={COLORS.primary} />}
                        {selectedTab === 'cases' && <FileStack size={20} color={COLORS.primary} />}
                      </View>
                      <YStack flex={1}>
                        <Text fontSize="$4" fontWeight="500" color="$text" marginBottom="$1">
                          {item.title}
                        </Text>
                        <XStack alignItems="center" space="$2">
                          <Text fontSize="$2" color="$textSecondary">
                            {item.category}
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            •
                          </Text>
                          <Text fontSize="$2" color="$textSecondary">
                            {item.views} 浏览
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};

export default LegalServiceHomeScreen;
