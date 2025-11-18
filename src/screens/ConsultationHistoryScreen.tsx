/**
 * ============================================================================
 * 咨询记录页面 - ConsultationHistoryScreen
 * ============================================================================
 *
 * Phase 33.7: 咨询记录管理
 *
 * 【功能概述】
 * - 查看所有法律咨询历史记录
 * - 支持分类筛选和记录导出
 *
 * 【主要功能】
 * 1. 历史咨询列表：按类型分类（图文/电话/视频/上门）
 * 2. 咨询详情查看：查看完整对话记录
 * 3. 再次咨询同一律师：快速发起新咨询
 * 4. 咨询记录导出：导出为PDF或文本
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
import { LegalConsultationType } from '../types/legalService';

interface Props {
  navigation: any;
}

// 咨询记录类型
interface ConsultationRecord {
  id: string;
  type: LegalConsultationType;
  lawyerId: string;
  lawyerName: string;
  lawFirm: string;
  category: string; // 咨询类别（遗嘱继承、赡养纠纷等）
  title: string;
  status: 'pending' | 'answered' | 'completed';
  createdAt: string;
  updatedAt: string;
  price: number;
  rating?: number; // 评价星级
  hasUnread?: boolean; // 是否有未读回复
}

// 咨询类型选项
const CONSULTATION_TYPE_OPTIONS = [
  { value: 'all', label: '全部', icon: 'list' },
  { value: LegalConsultationType.TEXT, label: '图文', icon: 'chatbubbles' },
  { value: LegalConsultationType.PHONE, label: '电话', icon: 'call' },
  { value: LegalConsultationType.VIDEO, label: '视频', icon: 'videocam' },
  { value: LegalConsultationType.HOME_VISIT, label: '上门', icon: 'home' },
];

// 状态选项
const STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待回复' },
  { value: 'answered', label: '已回复' },
  { value: 'completed', label: '已完成' },
];

const ConsultationHistoryScreen: React.FC<Props> = ({ navigation }) => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadConsultationRecords();
  }, []);

  const loadConsultationRecords = async () => {
    try {
      setLoading(true);
      // TODO: 从AsyncStorage加载咨询记录
      // 模拟数据
      const mockRecords: ConsultationRecord[] = [
        {
          id: 'consult_1',
          type: LegalConsultationType.TEXT,
          lawyerId: 'lawyer_1',
          lawyerName: '张律师',
          lawFirm: '北京大成律师事务所',
          category: '遗嘱继承',
          title: '关于自书遗嘱的法律效力咨询',
          status: 'answered',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T15:20:00Z',
          price: 100,
          rating: 5,
          hasUnread: true,
        },
        {
          id: 'consult_2',
          type: LegalConsultationType.PHONE,
          lawyerId: 'lawyer_2',
          lawyerName: '李律师',
          lawFirm: '上海锦天城律师事务所',
          category: '房产纠纷',
          title: '房产继承过户问题',
          status: 'completed',
          createdAt: '2024-01-18T14:00:00Z',
          updatedAt: '2024-01-18T14:30:00Z',
          price: 250,
          rating: 4,
        },
        {
          id: 'consult_3',
          type: LegalConsultationType.VIDEO,
          lawyerId: 'lawyer_1',
          lawyerName: '张律师',
          lawFirm: '北京大成律师事务所',
          category: '赡养纠纷',
          title: '子女赡养义务咨询',
          status: 'completed',
          createdAt: '2024-01-15T16:00:00Z',
          updatedAt: '2024-01-15T17:00:00Z',
          price: 500,
          rating: 5,
        },
        {
          id: 'consult_4',
          type: LegalConsultationType.HOME_VISIT,
          lawyerId: 'lawyer_3',
          lawyerName: '王律师',
          lawFirm: '广州金桥百信律师事务所',
          category: '遗嘱继承',
          title: '遗嘱起草及公证',
          status: 'pending',
          createdAt: '2024-01-22T09:00:00Z',
          updatedAt: '2024-01-22T09:00:00Z',
          price: 2000,
        },
      ];

      setRecords(mockRecords);
    } catch (error) {
      console.error('Error loading consultation records:', error);
      Alert.alert('加载失败', '无法加载咨询记录');
    } finally {
      setLoading(false);
    }
  };

  // 筛选记录
  const filteredRecords = records.filter(record => {
    if (selectedType !== 'all' && record.type !== selectedType) {
      return false;
    }
    if (selectedStatus !== 'all' && record.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  // 获取类型图标和颜色
  const getTypeIconAndColor = (type: LegalConsultationType) => {
    switch (type) {
      case LegalConsultationType.TEXT:
        return { icon: 'chatbubbles', color: '#1890ff' };
      case LegalConsultationType.PHONE:
        return { icon: 'call', color: '#52c41a' };
      case LegalConsultationType.VIDEO:
        return { icon: 'videocam', color: '#722ed1' };
      case LegalConsultationType.HOME_VISIT:
        return { icon: 'home', color: '#fa8c16' };
      default:
        return { icon: 'help-circle', color: '#999' };
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: string): { text: string; color: string } => {
    switch (status) {
      case 'pending':
        return { text: '待回复', color: '#faad14' };
      case 'answered':
        return { text: '已回复', color: '#52c41a' };
      case 'completed':
        return { text: '已完成', color: '#999' };
      default:
        return { text: status, color: '#999' };
    }
  };

  // 导出记录
  const handleExport = (record: ConsultationRecord) => {
    Alert.alert(
      '导出记录',
      '选择导出格式',
      [
        {
          text: 'PDF',
          onPress: () => {
            Alert.alert('功能开发中', 'PDF导出功能正在开发中');
            // TODO: 实现PDF导出
          },
        },
        {
          text: '文本',
          onPress: () => {
            Alert.alert('功能开发中', '文本导出功能正在开发中');
            // TODO: 实现文本导出
          },
        },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  // 删除记录
  const handleDelete = (recordId: string) => {
    Alert.alert(
      '删除记录',
      '确定要删除这条咨询记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setRecords(records.filter(r => r.id !== recordId));
            Alert.alert('已删除', '咨询记录已删除');
          },
        },
      ]
    );
  };

  // 渲染星级
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={12}
          color="#fadb14"
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  // 渲染咨询记录卡片
  const renderRecordCard = (record: ConsultationRecord) => {
    const typeInfo = getTypeIconAndColor(record.type);
    const statusInfo = getStatusLabel(record.status);

    return (
      <TouchableOpacity
        key={record.id}
        style={styles.recordCard}
        onPress={() => {
          // 根据类型导航到不同页面
          if (record.type === LegalConsultationType.TEXT) {
            navigation.navigate('TextConsultation', {
              lawyerId: record.lawyerId,
              consultationId: record.id,
            });
          } else {
            navigation.navigate('LawyerDetail', { lawyerId: record.lawyerId });
          }
        }}
        activeOpacity={0.7}
      >
        {record.hasUnread && <View style={styles.unreadBadge} />}

        <View style={styles.recordHeader}>
          <View style={styles.recordTypeContainer}>
            <View style={[styles.typeIcon, { backgroundColor: typeInfo.color + '20' }]}>
              <Ionicons name={typeInfo.icon as any} size={18} color={typeInfo.color} />
            </View>
            <View style={styles.recordHeaderInfo}>
              <Text style={styles.recordTitle} numberOfLines={1}>
                {record.title}
              </Text>
              <Text style={styles.recordCategory}>{record.category}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View style={styles.recordBody}>
          <View style={styles.lawyerInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.lawyerInfoText}>
              {record.lawyerName} · {record.lawFirm}
            </Text>
          </View>

          <View style={styles.recordMeta}>
            <Text style={styles.recordTime}>{formatDate(record.createdAt)}</Text>
            <Text style={styles.recordPrice}>¥{record.price}</Text>
          </View>
        </View>

        {record.rating && (
          <View style={styles.recordFooter}>
            {renderStars(record.rating)}
            <Text style={styles.ratedText}>已评价</Text>
          </View>
        )}

        <View style={styles.recordActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate('LawyerDetail', { lawyerId: record.lawyerId });
            }}
          >
            <Ionicons name="refresh" size={16} color="#1890ff" />
            <Text style={styles.actionButtonText}>再次咨询</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleExport(record)}
          >
            <Ionicons name="download-outline" size={16} color="#1890ff" />
            <Text style={styles.actionButtonText}>导出</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(record.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#ff4d4f" />
            <Text style={[styles.actionButtonText, { color: '#ff4d4f' }]}>删除</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染筛选器
  const renderFilters = () => {
    return (
      <View style={styles.filtersContainer}>
        {/* 类型筛选 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilters}
        >
          {CONSULTATION_TYPE_OPTIONS.map(option => {
            const isSelected = option.value === selectedType;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setSelectedType(option.value)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={isSelected ? '#fff' : '#666'}
                />
                <Text
                  style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 状态筛选 */}
        <View style={styles.statusFilters}>
          {STATUS_OPTIONS.map(option => {
            const isSelected = option.value === selectedStatus;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusFilterButton,
                  isSelected && styles.statusFilterButtonSelected,
                ]}
                onPress={() => setSelectedStatus(option.value)}
              >
                <Text
                  style={[
                    styles.statusFilterText,
                    isSelected && styles.statusFilterTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="document-text-outline" size={80} color="#ccc" />
        <Text style={styles.emptyStateText}>暂无咨询记录</Text>
        <Text style={styles.emptyStateHint}>您可以咨询专业律师获取法律帮助</Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('LawyerList')}
        >
          <Text style={styles.emptyStateButtonText}>找律师咨询</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>咨询记录</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>咨询记录</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AILegalAssistant')}
          style={styles.aiButton}
        >
          <Ionicons name="chatbubble-ellipses" size={22} color="#1890ff" />
        </TouchableOpacity>
      </View>

      {/* 筛选器 */}
      {renderFilters()}

      {/* 记录列表 */}
      {filteredRecords.length > 0 ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.recordsList}>
            {filteredRecords.map(record => renderRecordCard(record))}
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
  aiButton: {
    padding: 4,
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
  filtersContainer: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  typeFilters: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    gap: 4,
  },
  filterChipSelected: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  filterChipText: {
    fontSize: 13,
    color: '#666',
  },
  filterChipTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  statusFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  statusFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
  },
  statusFilterButtonSelected: {
    backgroundColor: '#e6f7ff',
  },
  statusFilterText: {
    fontSize: 12,
    color: '#666',
  },
  statusFilterTextSelected: {
    color: '#1890ff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  recordsList: {
    padding: 16,
    gap: 12,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d4f',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordTypeContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordHeaderInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recordCategory: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  recordBody: {
    marginBottom: 12,
  },
  lawyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  lawyerInfoText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  recordMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordTime: {
    fontSize: 12,
    color: '#999',
  },
  recordPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  recordFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratedText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  recordActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#1890ff',
    fontWeight: '500',
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
  emptyStateHint: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
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
});

export default ConsultationHistoryScreen;
