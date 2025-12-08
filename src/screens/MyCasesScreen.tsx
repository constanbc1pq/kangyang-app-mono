/**
 * 我的案件页面 - MyCasesScreen
 * Phase 34.2: 案件管理
 *
 * 功能：
 * - 案件列表：区分进行中和已结案
 * - 案件详情：案情描述、证据材料、裁判结果
 * - 案件进度时间轴：清晰展示案件各阶段
 * - 律师沟通入口：快速联系代理律师
 * - 案件文书查看与下载：判决书、证据材料等
 */

import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, ScrollView, View, useTheme } from 'tamagui';
import {
  PlusCircle,
  User,
  Calendar,
  Building2,
  MessageCircle,
  Check,
  FolderOpen,
  FileText,
  Folder,
  Newspaper,
  Award,
  File,
  Download,
  CheckCircle,
} from 'lucide-react-native';
import { CaseStatus } from '../types/legalService';
import { TitleBar } from '@/components/TitleBar';

interface Props {
  navigation: any;
}

// 案件信息
interface LegalCase {
  id: string;
  type: string;
  title: string;
  description: string;
  status: CaseStatus;
  lawyerId: string;
  lawyerName: string;
  lawFirm: string;
  createdAt: string;
  updatedAt: string;
  courtName?: string;
  caseNumber?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  result?: string;
}

// 案件进度节点
interface CaseProgress {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

// 案件文书
interface CaseDocument {
  id: string;
  name: string;
  type: 'contract' | 'evidence' | 'petition' | 'judgment' | 'other';
  uploadDate: string;
  size?: string;
}

// Tab类型
type CaseTab = 'ongoing' | 'completed';

const MyCasesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CaseTab>('ongoing');
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const mockCases: LegalCase[] = [
        {
          id: 'case_1',
          type: '赡养费追索',
          title: '子女拒绝支付赡养费案',
          description: '两个子女拒绝履行赡养义务，申请法院判决其支付赡养费',
          status: CaseStatus.IN_PROGRESS,
          lawyerId: 'lawyer_1',
          lawyerName: '张律师',
          lawFirm: '北京大成律师事务所',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-22T00:00:00Z',
          courtName: '北京市海淀区人民法院',
          caseNumber: '(2024)京0108民初12345号',
          estimatedCompletionDate: '2024-03-10',
        },
        {
          id: 'case_2',
          type: '遗产纠纷',
          title: '遗产分配纠纷案',
          description: '父亲去世后，兄弟姐妹对遗产分配产生争议',
          status: CaseStatus.COMPLETED,
          lawyerId: 'lawyer_2',
          lawyerName: '李律师',
          lawFirm: '上海锦天城律师事务所',
          createdAt: '2023-11-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          courtName: '上海市浦东新区人民法院',
          caseNumber: '(2023)沪0115民初67890号',
          actualCompletionDate: '2024-01-15',
          result: '判决支持原告诉讼请求，遗产按法定继承顺序分配',
        },
        {
          id: 'case_3',
          type: '房产纠纷',
          title: '房产继承过户纠纷',
          description: '母亲去世后，房产过户遇到阻碍',
          status: CaseStatus.IN_PROGRESS,
          lawyerId: 'lawyer_1',
          lawyerName: '张律师',
          lawFirm: '北京大成律师事务所',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          courtName: '北京市朝阳区人民法院',
          caseNumber: '(2024)京0105民初11111号',
          estimatedCompletionDate: '2024-04-15',
        },
      ];

      setCases(mockCases);
    } catch (error) {
      console.error('Error loading cases:', error);
      Alert.alert('加载失败', '无法加载案件列表');
    } finally {
      setLoading(false);
    }
  };

  // 获取案件进度
  const getCaseProgress = (caseItem: LegalCase): CaseProgress[] => {
    if (caseItem.status === CaseStatus.COMPLETED) {
      return [
        { id: 'p1', title: '案件委托', description: '已委托律师代理', date: caseItem.createdAt, status: 'completed' },
        { id: 'p2', title: '立案受理', description: '法院已受理案件', date: '2023-11-10T00:00:00Z', status: 'completed' },
        { id: 'p3', title: '开庭审理', description: '案件已开庭审理', date: '2023-12-15T00:00:00Z', status: 'completed' },
        { id: 'p4', title: '案件判决', description: '法院已作出判决', date: '2024-01-10T00:00:00Z', status: 'completed' },
        { id: 'p5', title: '案件结案', description: caseItem.result || '案件已结案', date: caseItem.actualCompletionDate || caseItem.updatedAt, status: 'completed' },
      ];
    } else {
      return [
        { id: 'p1', title: '案件委托', description: '已委托律师代理', date: caseItem.createdAt, status: 'completed' },
        { id: 'p2', title: '立案受理', description: '法院已受理案件', date: caseItem.updatedAt, status: 'completed' },
        { id: 'p3', title: '证据交换', description: '等待证据交换', date: '', status: 'current' },
        { id: 'p4', title: '开庭审理', description: '预计开庭时间待定', date: '', status: 'pending' },
        { id: 'p5', title: '案件判决', description: '等待法院判决', date: '', status: 'pending' },
      ];
    }
  };

  // 获取案件文书
  const getCaseDocuments = (caseItem: LegalCase): CaseDocument[] => {
    return [
      { id: 'doc_1', name: '法律服务委托合同', type: 'contract', uploadDate: caseItem.createdAt, size: '1.2 MB' },
      { id: 'doc_2', name: '起诉状', type: 'petition', uploadDate: caseItem.createdAt, size: '856 KB' },
      { id: 'doc_3', name: '证据材料清单', type: 'evidence', uploadDate: caseItem.createdAt, size: '3.5 MB' },
      ...(caseItem.status === CaseStatus.COMPLETED
        ? [{ id: 'doc_4', name: '民事判决书', type: 'judgment' as const, uploadDate: caseItem.actualCompletionDate || caseItem.updatedAt, size: '2.1 MB' }]
        : []),
    ];
  };

  // 筛选案件
  const filteredCases = cases.filter(c => {
    if (activeTab === 'ongoing') {
      return c.status === CaseStatus.IN_PROGRESS || c.status === CaseStatus.PENDING;
    } else {
      return c.status === CaseStatus.COMPLETED;
    }
  });

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 获取状态标签
  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.PENDING:
        return { text: '待处理', color: warningColor };
      case CaseStatus.IN_PROGRESS:
        return { text: '进行中', color: primaryColor };
      case CaseStatus.COMPLETED:
        return { text: '已结案', color: successColor };
      case CaseStatus.REJECTED:
        return { text: '已驳回', color: errorColor };
      default:
        return { text: status, color: color10 };
    }
  };

  // 获取文书类型图标
  const getDocumentIcon = (type: CaseDocument['type']) => {
    switch (type) {
      case 'contract':
        return { Icon: FileText, label: '合同', color: primaryColor };
      case 'evidence':
        return { Icon: Folder, label: '证据', color: successColor };
      case 'petition':
        return { Icon: Newspaper, label: '诉状', color: '#722ed1' };
      case 'judgment':
        return { Icon: Award, label: '判决', color: warningColor };
      case 'other':
        return { Icon: File, label: '其他', color: color10 };
    }
  };

  // 渲染案件卡片
  const renderCaseCard = (caseItem: LegalCase) => {
    const statusBadge = getStatusBadge(caseItem.status);

    return (
      <Pressable
        key={caseItem.id}
        onPress={() => {
          setSelectedCase(caseItem);
          setShowDetail(true);
        }}
      >
        <View
          backgroundColor="$background"
          borderRadius="$4"
          padding="$3"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <View
              style={{ backgroundColor: `${primaryColor}15` }}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$10"
            >
              <Text fontSize="$2" color="$primary" fontWeight="500">
                {caseItem.type}
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${statusBadge.color}20` }}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$10"
            >
              <Text fontSize="$2" fontWeight="500" style={{ color: statusBadge.color }}>
                {statusBadge.text}
              </Text>
            </View>
          </XStack>

          <Text fontSize="$4" fontWeight="700" color="$color12" marginBottom="$2">
            {caseItem.title}
          </Text>
          <Text fontSize="$3" color="$color10" lineHeight={20} marginBottom="$3" numberOfLines={2}>
            {caseItem.description}
          </Text>

          <XStack gap="$4" marginBottom="$2">
            <XStack alignItems="center" gap="$1">
              <User size={14} color={color10} />
              <Text fontSize="$3" color="$color10">{caseItem.lawyerName}</Text>
            </XStack>
            <XStack alignItems="center" gap="$1">
              <Calendar size={14} color={color10} />
              <Text fontSize="$3" color="$color10">{formatDate(caseItem.createdAt)}</Text>
            </XStack>
          </XStack>

          {caseItem.courtName && (
            <XStack alignItems="center" gap="$1.5" marginBottom="$2">
              <Building2 size={14} color={color10} />
              <Text fontSize="$2" color="$color10">{caseItem.courtName}</Text>
            </XStack>
          )}

          {caseItem.caseNumber && (
            <View
              paddingTop="$2"
              borderTopWidth={1}
              borderTopColor="$color5"
            >
              <Text fontSize="$2" color="$color10">
                案号：<Text fontFamily="monospace">{caseItem.caseNumber}</Text>
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  // 渲染案件详情
  const renderCaseDetail = () => {
    if (!selectedCase) return null;

    const progress = getCaseProgress(selectedCase);
    const documents = getCaseDocuments(selectedCase);
    const statusBadge = getStatusBadge(selectedCase.status);

    return (
      <View flex={1} backgroundColor="$color4">
        {/* 详情头部 */}
        <TitleBar
          title="案件详情"
          onBack={() => setShowDetail(false)}
          rightElement={
            <Pressable
              onPress={() => {
                navigation.navigate('TextConsultation', { lawyerId: selectedCase.lawyerId });
              }}
            >
              <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
                <MessageCircle size={22} color={primaryColor} />
              </View>
            </Pressable>
          }
        />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* 基本信息 */}
          <View backgroundColor="$background" padding="$3" marginBottom="$2">
            <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$4">
              <Text flex={1} fontSize="$5" fontWeight="700" color="$color12" marginRight="$3">
                {selectedCase.title}
              </Text>
              <View
                style={{ backgroundColor: `${statusBadge.color}20` }}
                paddingHorizontal="$2.5"
                paddingVertical="$1.5"
                borderRadius="$10"
              >
                <Text fontSize="$3" fontWeight="600" style={{ color: statusBadge.color }}>
                  {statusBadge.text}
                </Text>
              </View>
            </XStack>

            <YStack gap="$3">
              <XStack>
                <YStack flex={1}>
                  <Text fontSize="$2" color="$color10" marginBottom="$1">案件类型</Text>
                  <Text fontSize="$4" color="$color12">{selectedCase.type}</Text>
                </YStack>
                <YStack flex={1}>
                  <Text fontSize="$2" color="$color10" marginBottom="$1">委托时间</Text>
                  <Text fontSize="$4" color="$color12">{formatDate(selectedCase.createdAt)}</Text>
                </YStack>
              </XStack>

              {selectedCase.courtName && (
                <YStack>
                  <Text fontSize="$2" color="$color10" marginBottom="$1">受理法院</Text>
                  <Text fontSize="$4" color="$color12">{selectedCase.courtName}</Text>
                </YStack>
              )}

              {selectedCase.caseNumber && (
                <YStack>
                  <Text fontSize="$2" color="$color10" marginBottom="$1">案号</Text>
                  <Text fontSize="$4" color="$color12">{selectedCase.caseNumber}</Text>
                </YStack>
              )}

              <YStack>
                <Text fontSize="$2" color="$color10" marginBottom="$1">代理律师</Text>
                <Text fontSize="$4" color="$color12">{selectedCase.lawyerName} · {selectedCase.lawFirm}</Text>
              </YStack>

              {selectedCase.estimatedCompletionDate && (
                <YStack>
                  <Text fontSize="$2" color="$color10" marginBottom="$1">预计结案</Text>
                  <Text fontSize="$4" color="$color12">{formatDate(selectedCase.estimatedCompletionDate)}</Text>
                </YStack>
              )}

              {selectedCase.result && (
                <View
                  style={{ backgroundColor: `${successColor}10` }}
                  padding="$3"
                  borderRadius="$3"
                  borderLeftWidth={3}
                  borderLeftColor="$success"
                >
                  <XStack alignItems="center" gap="$1.5" marginBottom="$2">
                    <CheckCircle size={18} color={successColor} />
                    <Text fontSize="$4" fontWeight="600" color="$success">案件结果</Text>
                  </XStack>
                  <Text fontSize="$3" color="$color10" lineHeight={22}>
                    {selectedCase.result}
                  </Text>
                </View>
              )}
            </YStack>
          </View>

          {/* 案情描述 */}
          <View backgroundColor="$background" padding="$3" marginBottom="$2">
            <Text fontSize="$4" fontWeight="700" color="$color12" marginBottom="$3">
              案情描述
            </Text>
            <Text fontSize="$3" color="$color10" lineHeight={24}>
              {selectedCase.description}
            </Text>
          </View>

          {/* 案件进度 */}
          <View backgroundColor="$background" padding="$3" marginBottom="$2">
            <Text fontSize="$4" fontWeight="700" color="$color12" marginBottom="$3">
              案件进度
            </Text>
            <YStack paddingLeft="$2">
              {progress.map((item, index) => (
                <XStack key={item.id} marginBottom="$4">
                  <YStack alignItems="center" marginRight="$3">
                    <View
                      width={24}
                      height={24}
                      borderRadius={12}
                      backgroundColor={
                        item.status === 'completed' ? '$success' :
                        item.status === 'current' ? '$primary' : '$color4'
                      }
                      justifyContent="center"
                      alignItems="center"
                    >
                      {item.status === 'completed' && <Check size={12} color="white" />}
                    </View>
                    {index < progress.length - 1 && (
                      <View
                        width={2}
                        flex={1}
                        backgroundColor={item.status === 'completed' ? '$success' : '$color4'}
                        marginTop="$1"
                      />
                    )}
                  </YStack>
                  <YStack flex={1}>
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={item.status === 'pending' ? '$color10' : '$color12'}
                      marginBottom="$0.5"
                    >
                      {item.title}
                    </Text>
                    <Text
                      fontSize="$3"
                      color={item.status === 'pending' ? '$color9' : '$color10'}
                      marginBottom="$0.5"
                    >
                      {item.description}
                    </Text>
                    {item.date && (
                      <Text fontSize="$2" color="$color10">
                        {formatDate(item.date)}
                      </Text>
                    )}
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </View>

          {/* 案件文书 */}
          <View backgroundColor="$background" padding="$3" marginBottom="$2">
            <Text fontSize="$4" fontWeight="700" color="$color12" marginBottom="$3">
              案件文书
            </Text>
            <YStack gap="$3">
              {documents.map(doc => {
                const typeInfo = getDocumentIcon(doc.type);
                const DocIcon = typeInfo.Icon;
                return (
                  <Pressable
                    key={doc.id}
                    onPress={() => Alert.alert('文书预览', `正在打开《${doc.name}》...`)}
                  >
                    <View
                      backgroundColor="$color4"
                      padding="$3"
                      borderRadius="$3"
                    >
                      <XStack alignItems="center">
                        <View
                          width={48}
                          height={48}
                          borderRadius="$2"
                          style={{ backgroundColor: `${typeInfo.color}20` }}
                          justifyContent="center"
                          alignItems="center"
                          marginRight="$3"
                        >
                          <DocIcon size={24} color={typeInfo.color} />
                        </View>
                        <YStack flex={1}>
                          <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                            {doc.name}
                          </Text>
                          <XStack gap="$3">
                            <Text fontSize="$2" color="$primary">{typeInfo.label}</Text>
                            <Text fontSize="$2" color="$color10">{doc.size}</Text>
                            <Text fontSize="$2" color="$color10">{formatDate(doc.uploadDate)}</Text>
                          </XStack>
                        </YStack>
                        <Pressable onPress={() => Alert.alert('下载', `正在下载《${doc.name}》...`)}>
                          <View padding="$2">
                            <Download size={20} color={primaryColor} />
                          </View>
                        </Pressable>
                      </XStack>
                    </View>
                  </Pressable>
                );
              })}
            </YStack>
          </View>

          <View height={20} />
        </ScrollView>

        {/* 底部操作栏 */}
        <View
          padding="$3"
          backgroundColor="$background"
          borderTopWidth={1}
          borderTopColor="$color5"
          paddingBottom={insets.bottom > 0 ? insets.bottom : 16}
        >
          <Pressable
            onPress={() => {
              navigation.navigate('TextConsultation', { lawyerId: selectedCase.lawyerId });
            }}
          >
            <View
              paddingVertical="$3"
              backgroundColor="$primary"
              borderRadius="$10"
              alignItems="center"
            >
              <XStack gap="$2" alignItems="center">
                <MessageCircle size={20} color="white" />
                <Text fontSize="$4" fontWeight="600" color="white">
                  联系律师
                </Text>
              </XStack>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$8">
        <FolderOpen size={64} color={color10} />
        <Text fontSize="$4" color="$color10" marginTop="$4">
          {activeTab === 'ongoing' ? '暂无进行中的案件' : '暂无已结案的案件'}
        </Text>
        <Pressable onPress={() => navigation.navigate('CaseDelegation')}>
          <View
            marginTop="$5"
            paddingHorizontal="$6"
            paddingVertical="$2.5"
            backgroundColor="$primary"
            borderRadius="$10"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              委托案件
            </Text>
          </View>
        </Pressable>
      </YStack>
    );
  };

  if (showDetail) {
    return renderCaseDetail();
  }

  return (
    <View flex={1} backgroundColor="$color4">
      {/* TitleBar */}
      <TitleBar
        title="我的案件"
        onBack={() => navigation.goBack()}
        rightElement={
          <Pressable onPress={() => navigation.navigate('CaseDelegation')}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <PlusCircle size={24} color={primaryColor} />
            </View>
          </Pressable>
        }
      />

      {/* Tab切换 */}
      <View backgroundColor="$background" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack>
          <Pressable onPress={() => setActiveTab('ongoing')} style={{ flex: 1 }}>
            <YStack paddingVertical="$3" alignItems="center" position="relative">
              <Text
                fontSize="$4"
                fontWeight={activeTab === 'ongoing' ? '600' : '400'}
                color={activeTab === 'ongoing' ? '$primary' : '$color10'}
              >
                进行中
              </Text>
              {activeTab === 'ongoing' && (
                <View
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  height={2}
                  backgroundColor="$primary"
                />
              )}
            </YStack>
          </Pressable>
          <Pressable onPress={() => setActiveTab('completed')} style={{ flex: 1 }}>
            <YStack paddingVertical="$3" alignItems="center" position="relative">
              <Text
                fontSize="$4"
                fontWeight={activeTab === 'completed' ? '600' : '400'}
                color={activeTab === 'completed' ? '$primary' : '$color10'}
              >
                已结案
              </Text>
              {activeTab === 'completed' && (
                <View
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  height={2}
                  backgroundColor="$primary"
                />
              )}
            </YStack>
          </Pressable>
        </XStack>
      </View>

      {/* 案件列表 */}
      {loading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text fontSize="$4" color="$color10" marginTop="$3">
            加载中...
          </Text>
        </YStack>
      ) : filteredCases.length > 0 ? (
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5" gap="$3">
            {filteredCases.map(c => renderCaseCard(c))}
          </YStack>
        </ScrollView>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

export default MyCasesScreen;
