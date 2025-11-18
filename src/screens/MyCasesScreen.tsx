/**
 * ============================================================================
 * 我的案件页面 - MyCasesScreen
 * ============================================================================
 *
 * Phase 34.2: 案件管理
 *
 * 【功能概述】
 * - 查看和管理所有委托的法律案件
 * - 跟踪案件进展和文书材料
 *
 * 【主要功能】
 * 1. 案件列表：区分进行中和已结案
 * 2. 案件详情：案情描述、证据材料、裁判结果
 * 3. 案件进度时间轴：清晰展示案件各阶段
 * 4. 律师沟通入口：快速联系代理律师
 * 5. 案件文书查看与下载：判决书、证据材料等
 *
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CaseStatus } from '../types/legalService';

interface Props {
  navigation: any;
}

// 案件信息
interface LegalCase {
  id: string;
  type: string; // 案件类型
  title: string;
  description: string;
  status: CaseStatus;
  lawyerId: string;
  lawyerName: string;
  lawFirm: string;
  createdAt: string;
  updatedAt: string;
  courtName?: string; // 法院名称
  caseNumber?: string; // 案号
  estimatedCompletionDate?: string; // 预计结案日期
  actualCompletionDate?: string; // 实际结案日期
  result?: string; // 案件结果
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
      // TODO: 从AsyncStorage加载案件数据
      // 模拟数据
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
        {
          id: 'p1',
          title: '案件委托',
          description: '已委托律师代理',
          date: caseItem.createdAt,
          status: 'completed',
        },
        {
          id: 'p2',
          title: '立案受理',
          description: '法院已受理案件',
          date: '2023-11-10T00:00:00Z',
          status: 'completed',
        },
        {
          id: 'p3',
          title: '开庭审理',
          description: '案件已开庭审理',
          date: '2023-12-15T00:00:00Z',
          status: 'completed',
        },
        {
          id: 'p4',
          title: '案件判决',
          description: '法院已作出判决',
          date: '2024-01-10T00:00:00Z',
          status: 'completed',
        },
        {
          id: 'p5',
          title: '案件结案',
          description: caseItem.result || '案件已结案',
          date: caseItem.actualCompletionDate || caseItem.updatedAt,
          status: 'completed',
        },
      ];
    } else {
      return [
        {
          id: 'p1',
          title: '案件委托',
          description: '已委托律师代理',
          date: caseItem.createdAt,
          status: 'completed',
        },
        {
          id: 'p2',
          title: '立案受理',
          description: '法院已受理案件',
          date: caseItem.updatedAt,
          status: 'completed',
        },
        {
          id: 'p3',
          title: '证据交换',
          description: '等待证据交换',
          date: '',
          status: 'current',
        },
        {
          id: 'p4',
          title: '开庭审理',
          description: '预计开庭时间待定',
          date: '',
          status: 'pending',
        },
        {
          id: 'p5',
          title: '案件判决',
          description: '等待法院判决',
          date: '',
          status: 'pending',
        },
      ];
    }
  };

  // 获取案件文书
  const getCaseDocuments = (caseItem: LegalCase): CaseDocument[] => {
    return [
      {
        id: 'doc_1',
        name: '法律服务委托合同',
        type: 'contract',
        uploadDate: caseItem.createdAt,
        size: '1.2 MB',
      },
      {
        id: 'doc_2',
        name: '起诉状',
        type: 'petition',
        uploadDate: caseItem.createdAt,
        size: '856 KB',
      },
      {
        id: 'doc_3',
        name: '证据材料清单',
        type: 'evidence',
        uploadDate: caseItem.createdAt,
        size: '3.5 MB',
      },
      ...(caseItem.status === CaseStatus.COMPLETED
        ? [
            {
              id: 'doc_4',
              name: '民事判决书',
              type: 'judgment' as const,
              uploadDate: caseItem.actualCompletionDate || caseItem.updatedAt,
              size: '2.1 MB',
            },
          ]
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
        return { text: '待处理', color: '#faad14' };
      case CaseStatus.IN_PROGRESS:
        return { text: '进行中', color: '#1890ff' };
      case CaseStatus.COMPLETED:
        return { text: '已结案', color: '#52c41a' };
      case CaseStatus.REJECTED:
        return { text: '已驳回', color: '#ff4d4f' };
      default:
        return { text: status, color: '#999' };
    }
  };

  // 获取文书类型图标和标签
  const getDocumentTypeInfo = (type: CaseDocument['type']) => {
    switch (type) {
      case 'contract':
        return { icon: 'document-text', label: '合同', color: '#1890ff' };
      case 'evidence':
        return { icon: 'folder-open', label: '证据', color: '#52c41a' };
      case 'petition':
        return { icon: 'newspaper', label: '诉状', color: '#722ed1' };
      case 'judgment':
        return { icon: 'ribbon', label: '判决', color: '#fa8c16' };
      case 'other':
        return { icon: 'document', label: '其他', color: '#999' };
    }
  };

  // 渲染案件卡片
  const renderCaseCard = (caseItem: LegalCase) => {
    const statusBadge = getStatusBadge(caseItem.status);

    return (
      <TouchableOpacity
        key={caseItem.id}
        style={styles.caseCard}
        onPress={() => {
          setSelectedCase(caseItem);
          setShowDetail(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.caseCardHeader}>
          <View style={styles.caseTypeTag}>
            <Text style={styles.caseTypeText}>{caseItem.type}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusBadge.color }]}>
              {statusBadge.text}
            </Text>
          </View>
        </View>

        <Text style={styles.caseTitle}>{caseItem.title}</Text>
        <Text style={styles.caseDescription} numberOfLines={2}>
          {caseItem.description}
        </Text>

        <View style={styles.caseMetaRow}>
          <View style={styles.caseMetaItem}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.caseMetaText}>{caseItem.lawyerName}</Text>
          </View>
          <View style={styles.caseMetaItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.caseMetaText}>{formatDate(caseItem.createdAt)}</Text>
          </View>
        </View>

        {caseItem.courtName && (
          <View style={styles.courtInfo}>
            <Ionicons name="business-outline" size={14} color="#999" />
            <Text style={styles.courtName}>{caseItem.courtName}</Text>
          </View>
        )}

        {caseItem.caseNumber && (
          <View style={styles.caseNumberContainer}>
            <Text style={styles.caseNumberLabel}>案号：</Text>
            <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // 渲染案件详情
  const renderCaseDetail = () => {
    if (!selectedCase) return null;

    const progress = getCaseProgress(selectedCase);
    const documents = getCaseDocuments(selectedCase);
    const statusBadge = getStatusBadge(selectedCase.status);

    return (
      <View style={styles.detailContainer}>
        {/* 详情头部 */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={() => setShowDetail(false)}
            style={styles.detailBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>案件详情</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TextConsultation', {
                lawyerId: selectedCase.lawyerId,
              });
            }}
            style={styles.contactLawyerButton}
          >
            <Ionicons name="chatbubble-ellipses" size={22} color="#1890ff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          {/* 基本信息 */}
          <View style={styles.detailSection}>
            <View style={styles.detailSectionHeader}>
              <Text style={styles.detailCaseTitle}>{selectedCase.title}</Text>
              <View
                style={[
                  styles.detailStatusBadge,
                  { backgroundColor: statusBadge.color + '20' },
                ]}
              >
                <Text style={[styles.detailStatusText, { color: statusBadge.color }]}>
                  {statusBadge.text}
                </Text>
              </View>
            </View>

            <View style={styles.detailInfoRow}>
              <View style={styles.detailInfoItem}>
                <Text style={styles.detailInfoLabel}>案件类型</Text>
                <Text style={styles.detailInfoValue}>{selectedCase.type}</Text>
              </View>
              <View style={styles.detailInfoItem}>
                <Text style={styles.detailInfoLabel}>委托时间</Text>
                <Text style={styles.detailInfoValue}>
                  {formatDate(selectedCase.createdAt)}
                </Text>
              </View>
            </View>

            {selectedCase.courtName && (
              <View style={styles.detailInfoRow}>
                <View style={styles.detailInfoItem}>
                  <Text style={styles.detailInfoLabel}>受理法院</Text>
                  <Text style={styles.detailInfoValue}>{selectedCase.courtName}</Text>
                </View>
              </View>
            )}

            {selectedCase.caseNumber && (
              <View style={styles.detailInfoRow}>
                <View style={styles.detailInfoItem}>
                  <Text style={styles.detailInfoLabel}>案号</Text>
                  <Text style={styles.detailInfoValue}>{selectedCase.caseNumber}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailInfoRow}>
              <View style={styles.detailInfoItem}>
                <Text style={styles.detailInfoLabel}>代理律师</Text>
                <Text style={styles.detailInfoValue}>
                  {selectedCase.lawyerName} · {selectedCase.lawFirm}
                </Text>
              </View>
            </View>

            {selectedCase.estimatedCompletionDate && (
              <View style={styles.detailInfoRow}>
                <View style={styles.detailInfoItem}>
                  <Text style={styles.detailInfoLabel}>预计结案</Text>
                  <Text style={styles.detailInfoValue}>
                    {formatDate(selectedCase.estimatedCompletionDate)}
                  </Text>
                </View>
              </View>
            )}

            {selectedCase.result && (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#52c41a" />
                  <Text style={styles.resultTitle}>案件结果</Text>
                </View>
                <Text style={styles.resultText}>{selectedCase.result}</Text>
              </View>
            )}
          </View>

          {/* 案情描述 */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>案情描述</Text>
            <Text style={styles.caseDescriptionFull}>{selectedCase.description}</Text>
          </View>

          {/* 案件进度 */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>案件进度</Text>
            <View style={styles.progressTimeline}>
              {progress.map((item, index) => (
                <View key={item.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        item.status === 'completed' && styles.timelineDotCompleted,
                        item.status === 'current' && styles.timelineDotCurrent,
                      ]}
                    >
                      {item.status === 'completed' && (
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      )}
                    </View>
                    {index < progress.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          item.status === 'completed' && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineRight}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        item.status === 'pending' && styles.timelineTitlePending,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.timelineDescription,
                        item.status === 'pending' && styles.timelineDescriptionPending,
                      ]}
                    >
                      {item.description}
                    </Text>
                    {item.date && (
                      <Text style={styles.timelineDate}>{formatDate(item.date)}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 案件文书 */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>案件文书</Text>
            <View style={styles.documentsList}>
              {documents.map(doc => {
                const typeInfo = getDocumentTypeInfo(doc.type);
                return (
                  <TouchableOpacity
                    key={doc.id}
                    style={styles.documentItem}
                    onPress={() => {
                      Alert.alert('文书预览', `正在打开《${doc.name}》...`);
                    }}
                  >
                    <View
                      style={[
                        styles.documentIcon,
                        { backgroundColor: typeInfo.color + '20' },
                      ]}
                    >
                      <Ionicons
                        name={typeInfo.icon as any}
                        size={24}
                        color={typeInfo.color}
                      />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <View style={styles.documentMeta}>
                        <Text style={styles.documentType}>{typeInfo.label}</Text>
                        <Text style={styles.documentSize}>{doc.size}</Text>
                        <Text style={styles.documentDate}>
                          {formatDate(doc.uploadDate)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        Alert.alert('下载', `正在下载《${doc.name}》...`);
                      }}
                    >
                      <Ionicons name="download-outline" size={20} color="#1890ff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* 底部操作栏 */}
        <View style={styles.detailBottomBar}>
          <TouchableOpacity
            style={styles.detailActionButton}
            onPress={() => {
              navigation.navigate('TextConsultation', {
                lawyerId: selectedCase.lawyerId,
              });
            }}
          >
            <Ionicons name="chatbubbles" size={20} color="#fff" />
            <Text style={styles.detailActionButtonText}>联系律师</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="folder-open-outline" size={80} color="#ccc" />
        <Text style={styles.emptyStateText}>
          {activeTab === 'ongoing' ? '暂无进行中的案件' : '暂无已结案的案件'}
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('CaseDelegation')}
        >
          <Text style={styles.emptyStateButtonText}>委托案件</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (showDetail) {
    return renderCaseDetail();
  }

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的案件</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CaseDelegation')}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={26} color="#1890ff" />
        </TouchableOpacity>
      </View>

      {/* Tab切换 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.tabActive]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.tabTextActive]}>
            进行中
          </Text>
          {activeTab === 'ongoing' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            已结案
          </Text>
          {activeTab === 'completed' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* 案件列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : filteredCases.length > 0 ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.casesList}>
            {filteredCases.map(c => renderCaseCard(c))}
          </View>
        </ScrollView>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 15,
    color: '#666',
  },
  tabTextActive: {
    color: '#1890ff',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1890ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  content: {
    flex: 1,
  },
  casesList: {
    padding: 16,
    gap: 12,
  },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caseTypeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
  },
  caseTypeText: {
    fontSize: 12,
    color: '#1890ff',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  caseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  caseMetaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  caseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caseMetaText: {
    fontSize: 13,
    color: '#666',
  },
  courtInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  courtName: {
    fontSize: 12,
    color: '#999',
  },
  caseNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  caseNumberLabel: {
    fontSize: 12,
    color: '#999',
  },
  caseNumber: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  emptyStateButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#1890ff',
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailBackButton: {
    padding: 4,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactLawyerButton: {
    padding: 4,
  },
  detailContent: {
    flex: 1,
  },
  detailSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailCaseTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailInfoRow: {
    marginBottom: 12,
  },
  detailInfoItem: {
    marginBottom: 8,
  },
  detailInfoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  detailInfoValue: {
    fontSize: 15,
    color: '#333',
  },
  resultContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#52c41a',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#52c41a',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  caseDescriptionFull: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  progressTimeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: '#52c41a',
  },
  timelineDotCurrent: {
    backgroundColor: '#1890ff',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#52c41a',
  },
  timelineRight: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timelineTitlePending: {
    color: '#999',
  },
  timelineDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  timelineDescriptionPending: {
    color: '#ccc',
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
  },
  documentsList: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  documentType: {
    fontSize: 12,
    color: '#1890ff',
  },
  documentSize: {
    fontSize: 12,
    color: '#999',
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
  },
  downloadButton: {
    padding: 8,
  },
  detailBottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#1890ff',
    borderRadius: 24,
    gap: 8,
  },
  detailActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MyCasesScreen;
