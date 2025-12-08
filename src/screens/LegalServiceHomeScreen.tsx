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
 * Design: Following CLAUDE.md specs
 */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Dimensions, FlatList, Image as RNImage } from 'react-native';
import {
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
  CheckCircle,
  ChevronRight,
  Crown,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getLawyers } from '@/services/legalService';
import { getAvatarSource } from '@/constants/avatars';
import { LawyerSpecialty } from '@/types/legalService';

const { width } = Dimensions.get('window');
const GOLD_COLOR = '#D4AF37';

// 律师专业领域中文映射
const SPECIALTY_LABELS: Record<string, string> = {
  [LawyerSpecialty.INHERITANCE]: '遗嘱继承',
  [LawyerSpecialty.ELDER_CARE]: '养老赡养',
  [LawyerSpecialty.PROPERTY]: '房产纠纷',
  [LawyerSpecialty.MARRIAGE]: '婚姻家庭',
  [LawyerSpecialty.CONTRACT]: '合同纠纷',
  [LawyerSpecialty.CONSUMER_RIGHTS]: '消费维权',
  [LawyerSpecialty.MEDICAL]: '医疗纠纷',
  [LawyerSpecialty.LABOR]: '劳动争议',
};

const getSpecialtyLabel = (specialty: string): string => {
  return SPECIALTY_LABELS[specialty] || specialty;
};

// ==================== Type Definitions ====================

type KnowledgeTab = 'articles' | 'videos' | 'cases';

interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colorKey: 'primary' | 'success' | 'warning' | 'color10';
  screen: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  colorKey: 'primary' | 'success' | 'warning' | 'error' | 'color10';
  screen: string;
  badge?: string;
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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const warningColor = theme.warning?.val;
  const color10 = theme.color10?.val;

  const [selectedTab, setSelectedTab] = useState<KnowledgeTab>('articles');
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(true);

  // Helper to get color by key
  const getColor = (key: string) => {
    switch (key) {
      case 'primary': return primaryColor;
      case 'success': return successColor;
      case 'warning': return warningColor;
      case 'error': return errorColor;
      case 'color10': return color10;
      default: return primaryColor;
    }
  };

  // 加载律师数据
  const loadLawyersData = async () => {
    try {
      setLoadingLawyers(true);
      const lawyersData = await getLawyers();
      setLawyers(lawyersData.slice(0, 4));
    } catch (error) {
      console.error('Failed to load lawyers:', error);
      setLawyers([]);
    } finally {
      setLoadingLawyers(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
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
      colorKey: 'primary',
      screen: 'WillCreator',
    },
    {
      id: 'lawyer_consult',
      title: '咨询律师',
      subtitle: '专业解答',
      icon: MessageCircle,
      colorKey: 'success',
      screen: 'LawyerList',
    },
    {
      id: 'legal_checkup',
      title: '法律体检',
      subtitle: '风险评估',
      icon: ClipboardCheck,
      colorKey: 'warning',
      screen: 'LegalCheckup',
    },
    {
      id: 'my_wills',
      title: '我的遗嘱',
      subtitle: '查看管理',
      icon: Shield,
      colorKey: 'color10',
      screen: 'MyWills',
    },
  ];

  const SERVICE_CATEGORIES: ServiceCategory[] = [
    {
      id: 'will_service',
      name: '遗嘱服务',
      description: '遗嘱制作、公证、保管',
      icon: FileText,
      colorKey: 'primary',
      screen: 'WillCreator',
      badge: '热门',
    },
    {
      id: 'guardianship',
      name: '意定监护',
      description: '监护人指定、协议签署',
      icon: Users,
      colorKey: 'color10',
      screen: 'GuardianshipCreator',
    },
    {
      id: 'property',
      name: '财产规划',
      description: '资产盘点、继承规划',
      icon: Home,
      colorKey: 'success',
      screen: 'PropertyInventory',
    },
    {
      id: 'support',
      name: '养老赡养',
      description: '赡养协议、权益保障',
      icon: Heart,
      colorKey: 'error',
      screen: 'DocumentTemplate',
    },
    {
      id: 'consumer',
      name: '消费维权',
      description: '合同审查、纠纷调解',
      icon: ShoppingCart,
      colorKey: 'warning',
      screen: 'ContractReview',
    },
    {
      id: 'case',
      name: '案件委托',
      description: '诉讼代理、法律援助',
      icon: Briefcase,
      colorKey: 'primary',
      screen: 'CaseDelegation',
    },
  ];

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
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top} backgroundColor="white">
        <TitleBar title="遗嘱及法律服务" />
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$3" paddingBottom="$6">
          {/* Partnership Banner */}
          <View paddingHorizontal="$2.5" paddingTop="$2">
            <View borderRadius="$5" overflow="hidden">
              <LinearGradient
                colors={[primaryColor || '#6366f1', successColor || '#10b981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 18 }}
              >
                <YStack>
                  <Text fontSize="$5" fontWeight="700" color="white" marginBottom="$1.5">
                    专业法律服务平台
                  </Text>
                  <Text fontSize="$3" color="rgba(255,255,255,0.95)" lineHeight={20} marginBottom="$2">
                    与北京大学法学院、中国政法大学、华东政法大学等顶级法学院校深度合作，联合金杜、中伦、君合等知名律所资源
                  </Text>
                  <XStack gap="$4" marginTop="$1">
                    <YStack alignItems="center">
                      <Text fontSize="$6" fontWeight="700" color="white">20+</Text>
                      <Text fontSize="$2" color="rgba(255,255,255,0.85)">合作院校</Text>
                    </YStack>
                    <YStack alignItems="center">
                      <Text fontSize="$6" fontWeight="700" color="white">50+</Text>
                      <Text fontSize="$2" color="rgba(255,255,255,0.85)">认证律所</Text>
                    </YStack>
                    <YStack alignItems="center">
                      <Text fontSize="$6" fontWeight="700" color="white">200+</Text>
                      <Text fontSize="$2" color="rgba(255,255,255,0.85)">认证律师</Text>
                    </YStack>
                  </XStack>
                </YStack>
              </LinearGradient>
            </View>
          </View>

          {/* Membership Promotion Banner */}
          <View paddingHorizontal="$2.5">
            <Pressable onPress={handleMembershipCenter}>
              <View borderRadius="$5" overflow="hidden">
                <LinearGradient
                  colors={['#fef3c7', '#fde68a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ padding: 14 }}
                >
                  <XStack alignItems="center" gap="$2.5">
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor="rgba(251, 191, 36, 0.3)"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Crown size={24} color={GOLD_COLOR} />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="700" color="#92400e" marginBottom="$0.5">
                        开通尊享计划
                      </Text>
                      <Text fontSize="$2" color="#78350f">
                        专属服务 · 优先咨询 · 无限次使用
                      </Text>
                    </YStack>
                    <ChevronRight size={20} color="#92400e" />
                  </XStack>
                </LinearGradient>
              </View>
            </Pressable>
          </View>

          {/* Quick Access Grid */}
          <YStack gap="$2" paddingHorizontal="$2.5">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              快速入口
            </Text>
            <XStack gap="$2">
              {QUICK_ACCESS.slice(0, 2).map((item) => {
                const IconComponent = item.icon;
                const itemColor = getColor(item.colorKey);
                return (
                  <Pressable key={item.id} style={{ flex: 1 }} onPress={() => handleQuickAccess(item.screen)}>
                    <View
                      flex={1}
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor="$color2"
                      borderWidth={1}
                      borderColor="$color5"
                    >
                      <View
                        width={44}
                        height={44}
                        borderRadius={22}
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="$2"
                        style={{ backgroundColor: `${itemColor}15` }}
                      >
                        <IconComponent size={22} color={itemColor} />
                      </View>
                      <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                        {item.title}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        {item.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
            <XStack gap="$2">
              {QUICK_ACCESS.slice(2, 4).map((item) => {
                const IconComponent = item.icon;
                const itemColor = getColor(item.colorKey);
                return (
                  <Pressable key={item.id} style={{ flex: 1 }} onPress={() => handleQuickAccess(item.screen)}>
                    <View
                      flex={1}
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor="$color2"
                      borderWidth={1}
                      borderColor="$color5"
                    >
                      <View
                        width={44}
                        height={44}
                        borderRadius={22}
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="$2"
                        style={{ backgroundColor: `${itemColor}15` }}
                      >
                        <IconComponent size={22} color={itemColor} />
                      </View>
                      <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$0.5">
                        {item.title}
                      </Text>
                      <Text fontSize="$2" color="$color10">
                        {item.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </XStack>
          </YStack>

          {/* Service Categories */}
          <YStack gap="$2" paddingHorizontal="$2.5">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              服务分类
            </Text>
            <YStack gap="$2">
              {SERVICE_CATEGORIES.map((service) => {
                const IconComponent = service.icon;
                const serviceColor = getColor(service.colorKey);
                return (
                  <Pressable key={service.id} onPress={() => handleServiceCategory(service.screen)}>
                    <View
                      padding="$2"
                      borderRadius="$5"
                      backgroundColor="$color2"
                      borderWidth={1}
                      borderColor="$color5"
                    >
                      <XStack alignItems="center" gap="$2.5">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          justifyContent="center"
                          alignItems="center"
                          style={{ backgroundColor: `${serviceColor}15` }}
                        >
                          <IconComponent size={24} color={serviceColor} />
                        </View>
                        <YStack flex={1}>
                          <XStack alignItems="center" gap="$1.5" marginBottom="$0.5">
                            <Text fontSize="$4" fontWeight="600" color="$color12">
                              {service.name}
                            </Text>
                            {service.badge && (
                              <View
                                backgroundColor="$error"
                                paddingHorizontal="$1.5"
                                paddingVertical="$0.5"
                                borderRadius="$2"
                              >
                                <Text fontSize={10} color="white" fontWeight="600">
                                  {service.badge}
                                </Text>
                              </View>
                            )}
                          </XStack>
                          <Text fontSize="$2" color="$color10">
                            {service.description}
                          </Text>
                        </YStack>
                        <ChevronRight size={18} color={color10} />
                      </XStack>
                    </View>
                  </Pressable>
                );
              })}
            </YStack>
          </YStack>

          {/* Recommended Lawyers */}
          <YStack gap="$2">
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$2.5"
            >
              <Text fontSize="$4" fontWeight="600" color="$color12">
                推荐律师
              </Text>
              <Pressable onPress={handleViewAllLawyers}>
                <XStack alignItems="center" gap="$0.5">
                  <Text fontSize="$3" color="$primary" fontWeight="500">
                    查看全部
                  </Text>
                  <ChevronRight size={14} color={primaryColor} />
                </XStack>
              </Pressable>
            </XStack>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={lawyers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 18 }}
              ItemSeparatorComponent={() => <View width={12} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleLawyerPress(item.id)}>
                  <View
                    width={180}
                    padding="$2"
                    borderRadius="$5"
                    backgroundColor="$color2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <YStack gap="$1.5">
                      <XStack alignItems="center" gap="$2">
                        <View
                          width={48}
                          height={48}
                          borderRadius={24}
                          overflow="hidden"
                          position="relative"
                        >
                          <RNImage
                            source={getAvatarSource(item.avatar, item.name)}
                            style={{ width: 48, height: 48 }}
                            resizeMode="cover"
                          />
                          {item.isOnline && (
                            <View
                              position="absolute"
                              bottom={-2}
                              right={-2}
                              backgroundColor="white"
                              borderRadius={10}
                              padding="$0.5"
                            >
                              <CheckCircle size={12} color={successColor} />
                            </View>
                          )}
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$3" fontWeight="600" color="$color12" numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text fontSize="$2" color="$color10" numberOfLines={1}>
                            {item.lawFirm}
                          </Text>
                        </YStack>
                      </XStack>

                      <View height={1} backgroundColor="$color5" />

                      <YStack gap="$1">
                        <Text fontSize="$2" color="$primary" numberOfLines={1}>
                          {item.specialties?.[0] ? getSpecialtyLabel(item.specialties[0]) : '法律咨询'}
                        </Text>
                        <XStack alignItems="center" justifyContent="space-between">
                          <Text fontSize="$2" color="$color10">
                            {item.yearsOfExperience}年经验
                          </Text>
                          <XStack alignItems="center" gap="$0.5">
                            <Star size={12} color={GOLD_COLOR} fill={GOLD_COLOR} />
                            <Text fontSize="$2" color="$color12" fontWeight="600">
                              {item.rating}
                            </Text>
                          </XStack>
                        </XStack>
                      </YStack>

                      <View height={1} backgroundColor="$color5" />

                      <XStack alignItems="center" justifyContent="space-between">
                        <Text fontSize="$2" color="$color10">
                          成功率: {item.successRate}%
                        </Text>
                        <Text fontSize="$3" fontWeight="600" color="$primary">
                          ¥{item.textConsultationPrice || 200}/次
                        </Text>
                      </XStack>
                    </YStack>
                  </View>
                </Pressable>
              )}
            />
          </YStack>

          {/* Knowledge Base */}
          <YStack gap="$2" paddingHorizontal="$2.5">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              知识库
            </Text>

            {/* Tabs */}
            <XStack gap="$2">
              <Pressable onPress={() => setSelectedTab('articles')}>
                <View
                  backgroundColor={selectedTab === 'articles' ? '$primary' : '$color4'}
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  borderRadius="$10"
                >
                  <Text
                    color={selectedTab === 'articles' ? 'white' : '$color12'}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    法律文章
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setSelectedTab('videos')}>
                <View
                  backgroundColor={selectedTab === 'videos' ? '$primary' : '$color4'}
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  borderRadius="$10"
                >
                  <Text
                    color={selectedTab === 'videos' ? 'white' : '$color12'}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    视频课堂
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setSelectedTab('cases')}>
                <View
                  backgroundColor={selectedTab === 'cases' ? '$primary' : '$color4'}
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  borderRadius="$10"
                >
                  <Text
                    color={selectedTab === 'cases' ? 'white' : '$color12'}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    案例分析
                  </Text>
                </View>
              </Pressable>
            </XStack>

            {/* Knowledge List */}
            <YStack gap="$2">
              {getKnowledgeData().map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleKnowledgeItem(item.id, selectedTab)}
                >
                  <View
                    padding="$2"
                    borderRadius="$5"
                    backgroundColor="$color2"
                    borderWidth={1}
                    borderColor="$color5"
                  >
                    <XStack alignItems="center" gap="$2.5">
                      <View
                        width={40}
                        height={40}
                        borderRadius={20}
                        justifyContent="center"
                        alignItems="center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        {selectedTab === 'articles' && <BookOpen size={20} color={primaryColor} />}
                        {selectedTab === 'videos' && <Video size={20} color={primaryColor} />}
                        {selectedTab === 'cases' && <FileStack size={20} color={primaryColor} />}
                      </View>
                      <YStack flex={1}>
                        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$0.5">
                          {item.title}
                        </Text>
                        <XStack alignItems="center" gap="$1.5">
                          <Text fontSize="$2" color="$color10">
                            {item.category}
                          </Text>
                          <Text fontSize="$2" color="$color10">
                            •
                          </Text>
                          <Text fontSize="$2" color="$color10">
                            {item.views} 浏览
                          </Text>
                        </XStack>
                      </YStack>
                      <ChevronRight size={16} color={color10} />
                    </XStack>
                  </View>
                </Pressable>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
};

export default LegalServiceHomeScreen;
