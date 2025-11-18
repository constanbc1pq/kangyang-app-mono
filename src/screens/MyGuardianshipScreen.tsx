/**
 * 我的监护协议页面
 * 展示和管理用户的意定监护协议
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GuardianshipAgreement } from '../types/legalService';
import {
  getGuardianshipAgreements,
  getGuardianshipAgreementById,
  updateGuardianshipAgreement,
} from '../services/legalService';

type AgreementStatus = 'draft' | 'notarized' | 'effective' | 'terminated';

const MyGuardianshipScreen: React.FC = () => {
  const navigation = useNavigation();
  const [agreements, setAgreements] = useState<GuardianshipAgreement[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadAgreements();
    }, [])
  );

  const loadAgreements = async () => {
    try {
      const data = await getGuardianshipAgreements();
      setAgreements(data);
    } catch (error) {
      console.error('Error loading guardianship agreements:', error);
      Alert.alert('错误', '加载监护协议失败');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAgreements();
    setRefreshing(false);
  };

  const handleCreateAgreement = () => {
    navigation.navigate('GuardianshipCreator' as never);
  };

  const handleViewAgreement = (agreement: GuardianshipAgreement) => {
    // 显示协议详情
    navigation.navigate('GuardianshipDetail' as never, { agreementId: agreement.id } as never);
  };

  const handleEditAgreement = (agreement: GuardianshipAgreement) => {
    if (agreement.status === 'effective') {
      Alert.alert('提示', '已生效的协议不能直接修改，如需修改请创建新协议');
      return;
    }

    navigation.navigate('GuardianshipCreator' as never, { agreementId: agreement.id } as never);
  };

  const handleScheduleNotary = (agreement: GuardianshipAgreement) => {
    Alert.alert(
      '预约公证',
      '意定监护协议需要经过公证才能生效。是否预约公证服务？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '预约公证',
          onPress: () => {
            // TODO: 跳转到公证预约页面
            navigation.navigate('NotaryAppointment' as never, {
              type: 'guardianship',
              agreementId: agreement.id,
            } as never);
          },
        },
      ]
    );
  };

  const handleTerminateAgreement = (agreement: GuardianshipAgreement) => {
    Alert.alert(
      '终止协议',
      '确定要终止这份监护协议吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定终止',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateGuardianshipAgreement(agreement.id, {
                status: 'terminated',
                terminatedAt: new Date().toISOString(),
              });
              Alert.alert('成功', '协议已终止');
              loadAgreements();
            } catch (error) {
              Alert.alert('错误', '终止协议失败');
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (status: AgreementStatus): string => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'notarized':
        return '已公证';
      case 'effective':
        return '已生效';
      case 'terminated':
        return '已终止';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = (status: AgreementStatus): string => {
    switch (status) {
      case 'draft':
        return '#999';
      case 'notarized':
        return '#1890ff';
      case 'effective':
        return '#52c41a';
      case 'terminated':
        return '#ff4d4f';
      default:
        return '#999';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="shield-checkmark-outline" size={80} color="#d9d9d9" />
      <Text style={styles.emptyTitle}>还没有监护协议</Text>
      <Text style={styles.emptyDescription}>
        意定监护可以在您意识清楚时为自己指定未来的监护人，保护您的权益
      </Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateAgreement}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.createButtonText}>创建监护协议</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAgreementCard = (agreement: GuardianshipAgreement) => (
    <TouchableOpacity
      key={agreement.id}
      style={styles.agreementCard}
      onPress={() => handleViewAgreement(agreement)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>意定监护协议</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(agreement.status) + '20' },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(agreement.status) }]}>
              {getStatusLabel(agreement.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.infoLabel}>被监护人：</Text>
          <Text style={styles.infoValue}>{agreement.wardName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.infoLabel}>监护人：</Text>
          <Text style={styles.infoValue}>
            {agreement.guardians.map(g => g.name).join('、')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoLabel}>创建日期：</Text>
          <Text style={styles.infoValue}>
            {new Date(agreement.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {agreement.notaryOffice && (
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
            <Text style={styles.infoLabel}>公证机构：</Text>
            <Text style={styles.infoValue}>{agreement.notaryOffice}</Text>
          </View>
        )}

        {agreement.effectiveDate && (
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
            <Text style={styles.infoLabel}>生效日期：</Text>
            <Text style={styles.infoValue}>
              {new Date(agreement.effectiveDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* 监护职责标签 */}
      <View style={styles.dutiesContainer}>
        {agreement.scope.dailyCare && (
          <View style={styles.dutyTag}>
            <Text style={styles.dutyTagText}>生活照料</Text>
          </View>
        )}
        {agreement.scope.medicalDecision && (
          <View style={styles.dutyTag}>
            <Text style={styles.dutyTagText}>医疗决策</Text>
          </View>
        )}
        {agreement.scope.propertyManagement && (
          <View style={styles.dutyTag}>
            <Text style={styles.dutyTagText}>财产管理</Text>
          </View>
        )}
        {agreement.scope.legalRepresentation && (
          <View style={styles.dutyTag}>
            <Text style={styles.dutyTagText}>法律代理</Text>
          </View>
        )}
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionButtons}>
        {agreement.status === 'draft' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAgreement(agreement)}
            >
              <Ionicons name="create-outline" size={18} color="#1890ff" />
              <Text style={styles.actionButtonText}>编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleScheduleNotary(agreement)}
            >
              <Ionicons name="shield-checkmark-outline" size={18} color="#1890ff" />
              <Text style={styles.actionButtonText}>预约公证</Text>
            </TouchableOpacity>
          </>
        )}

        {agreement.status === 'notarized' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewAgreement(agreement)}
          >
            <Ionicons name="eye-outline" size={18} color="#1890ff" />
            <Text style={styles.actionButtonText}>查看详情</Text>
          </TouchableOpacity>
        )}

        {agreement.status === 'effective' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleViewAgreement(agreement)}
            >
              <Ionicons name="document-text-outline" size={18} color="#1890ff" />
              <Text style={styles.actionButtonText}>查看协议</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTerminateAgreement(agreement)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#ff4d4f" />
              <Text style={[styles.actionButtonText, { color: '#ff4d4f' }]}>终止</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 重要提示 */}
      {agreement.status === 'draft' && (
        <View style={styles.reminderCard}>
          <Ionicons name="warning-outline" size={16} color="#faad14" />
          <Text style={styles.reminderText}>
            意定监护协议必须经过公证才能生效
          </Text>
        </View>
      )}

      {agreement.status === 'effective' && agreement.supervision?.enabled && (
        <View style={styles.supervisionCard}>
          <Ionicons name="eye-outline" size={16} color="#1890ff" />
          <Text style={styles.supervisionText}>
            监督人：{agreement.supervision.supervisorName}（{agreement.supervision.supervisorRelation}）
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 顶部说明卡片 */}
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Ionicons name="shield-checkmark" size={32} color="#1890ff" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>意定监护</Text>
            <Text style={styles.headerDescription}>
              为未来做好准备，保护您的权益
            </Text>
          </View>
        </View>
      </View>

      {/* 协议列表 */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {agreements.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.agreementsList}>
            {agreements.map(agreement => renderAgreementCard(agreement))}
          </View>
        )}

        {/* 法律说明 */}
        <View style={styles.legalNotice}>
          <Ionicons name="information-circle-outline" size={20} color="#1890ff" />
          <View style={styles.legalNoticeContent}>
            <Text style={styles.legalNoticeTitle}>什么是意定监护？</Text>
            <Text style={styles.legalNoticeText}>
              意定监护是指您在意识清楚时，通过书面协议指定自己的监护人，确定监护人的权利和义务。当您因疾病、年老等原因丧失或部分丧失民事行为能力时，由您指定的监护人履行监护职责。
              {'\n\n'}
              根据《民法典》规定，意定监护优先于法定监护。建议您及早规划，保护自己的权益。
            </Text>
          </View>
        </View>

        {/* 常见问题 */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>常见问题</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 意定监护什么时候生效？</Text>
            <Text style={styles.faqAnswer}>
              A: 意定监护协议经过公证后，在您丧失或部分丧失民事行为能力时生效。
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 可以随时更改监护人吗？</Text>
            <Text style={styles.faqAnswer}>
              A: 在您意识清楚、有完全民事行为能力时，可以随时变更或终止意定监护协议。
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 意定监护和法定监护有什么区别？</Text>
            <Text style={styles.faqAnswer}>
              A: 意定监护是您自主选择监护人，法定监护是法律规定的监护顺序。意定监护优先于法定监护。
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 浮动创建按钮 */}
      {agreements.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleCreateAgreement}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 13,
    color: '#666',
  },
  listContainer: {
    flex: 1,
  },
  agreementsList: {
    padding: 16,
  },
  agreementCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  dutiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  dutyTag: {
    backgroundColor: '#e6f7ff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  dutyTagText: {
    fontSize: 11,
    color: '#1890ff',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#1890ff',
    marginLeft: 4,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    borderRadius: 4,
    padding: 8,
    marginTop: 12,
  },
  reminderText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  supervisionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
    borderRadius: 4,
    padding: 8,
    marginTop: 12,
  },
  supervisionText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1890ff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  legalNotice: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  legalNoticeContent: {
    flex: 1,
    marginLeft: 12,
  },
  legalNoticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  legalNoticeText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  faqSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default MyGuardianshipScreen;
