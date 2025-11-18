/**
 * 遗嘱审核与公证页面
 * 提供律师审核和公证预约服务
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Will, WillStatus } from '../types/legalService';
import { getWillById, updateWill } from '../services/legalService';
import {
  generateSelfWrittenWillTemplate,
  generateWitnessedWillTemplate,
  generateAudioVideoWillGuidelines,
} from '../services/willTemplateEngine';

type RouteParams = {
  WillReview: {
    willId: string;
  };
};

type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
type NotaryStatus = 'not_started' | 'scheduled' | 'in_progress' | 'completed';

interface ReviewResult {
  status: ReviewStatus;
  reviewerName?: string;
  reviewDate?: string;
  comments?: string;
  suggestions?: string[];
  approved: boolean;
}

interface NotaryAppointment {
  status: NotaryStatus;
  notaryOffice?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  address?: string;
  contact?: string;
  documents?: string[];
  fee?: number;
}

const WillReviewScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'WillReview'>>();
  const navigation = useNavigation();
  const { willId } = route.params;

  const [will, setWill] = useState<Will | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'review' | 'notary'>('review');

  // 审核相关状态
  const [reviewResult, setReviewResult] = useState<ReviewResult>({
    status: 'pending',
    approved: false,
  });

  // 公证相关状态
  const [notaryAppointment, setNotaryAppointment] = useState<NotaryAppointment>({
    status: 'not_started',
  });

  const [notaryForm, setNotaryForm] = useState({
    preferredDate: '',
    preferredTime: '',
    contactPhone: '',
    notes: '',
  });

  useEffect(() => {
    loadWillData();
  }, [willId]);

  const loadWillData = async () => {
    try {
      const willData = await getWillById(willId);
      if (willData) {
        setWill(willData);
        // TODO: 从后端加载审核和公证状态
        // loadReviewStatus(willId);
        // loadNotaryStatus(willId);
      }
    } catch (error) {
      console.error('Error loading will:', error);
      Alert.alert('错误', '加载遗嘱数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交律师审核
  const handleSubmitForReview = () => {
    Alert.alert(
      '提交审核',
      '提交后，专业律师将在1-3个工作日内完成审核。审核费用：¥500',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认提交',
          onPress: async () => {
            try {
              // TODO: 调用后端API提交审核
              setReviewResult({
                status: 'in_review',
                approved: false,
              });

              await updateWill(willId, {
                status: WillStatus.PENDING_REVIEW,
              });

              Alert.alert('提交成功', '您的遗嘱已提交审核，请耐心等待');
            } catch (error) {
              Alert.alert('提交失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  // 预约公证
  const handleScheduleNotary = () => {
    if (!notaryForm.preferredDate || !notaryForm.contactPhone) {
      Alert.alert('提示', '请填写预约日期和联系电话');
      return;
    }

    Alert.alert(
      '预约公证',
      '确认预约公证服务？我们将在24小时内与您联系确认具体时间。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认预约',
          onPress: async () => {
            try {
              // TODO: 调用后端API预约公证
              setNotaryAppointment({
                status: 'scheduled',
                appointmentDate: notaryForm.preferredDate,
                appointmentTime: notaryForm.preferredTime,
                notaryOffice: '市公证处',
                address: '待确认',
                contact: '待分配',
              });

              Alert.alert('预约成功', '公证处工作人员将在24小时内与您联系');
            } catch (error) {
              Alert.alert('预约失败', '请稍后重试');
            }
          },
        },
      ]
    );
  };

  // 查看遗嘱内容
  const handleViewWillContent = () => {
    if (!will) return;

    let template;
    switch (will.type) {
      case 'self_written':
        template = generateSelfWrittenWillTemplate(will);
        break;
      case 'witnessed':
        template = generateWitnessedWillTemplate(will);
        break;
      case 'audio_video':
        template = generateAudioVideoWillGuidelines(will);
        break;
      default:
        template = generateSelfWrittenWillTemplate(will);
    }

    Alert.alert('遗嘱内容', template.content, [{ text: '关闭' }], {
      cancelable: true,
    });
  };

  // 渲染审核标签页
  const renderReviewTab = () => (
    <View style={styles.tabContent}>
      {/* 审核状态卡片 */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons
            name={
              reviewResult.status === 'pending'
                ? 'time-outline'
                : reviewResult.status === 'in_review'
                ? 'hourglass-outline'
                : reviewResult.status === 'approved'
                ? 'checkmark-circle-outline'
                : 'close-circle-outline'
            }
            size={32}
            color={
              reviewResult.status === 'approved'
                ? '#52c41a'
                : reviewResult.status === 'rejected'
                ? '#ff4d4f'
                : '#1890ff'
            }
          />
          <Text style={styles.statusTitle}>
            {reviewResult.status === 'pending' && '待提交审核'}
            {reviewResult.status === 'in_review' && '审核中'}
            {reviewResult.status === 'approved' && '审核通过'}
            {reviewResult.status === 'rejected' && '需要修改'}
          </Text>
        </View>

        {reviewResult.status === 'pending' && (
          <View style={styles.statusBody}>
            <Text style={styles.statusDescription}>
              专业律师将从以下方面审核您的遗嘱：
            </Text>
            <View style={styles.checkList}>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
                <Text style={styles.checkText}>法律条款完整性</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
                <Text style={styles.checkText}>财产分配合理性</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
                <Text style={styles.checkText}>受益人信息准确性</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
                <Text style={styles.checkText}>特殊条款合法性</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
                <Text style={styles.checkText}>潜在法律风险识别</Text>
              </View>
            </View>

            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>审核费用</Text>
              <Text style={styles.priceValue}>¥500</Text>
              <Text style={styles.priceNote}>1-3个工作日完成</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitForReview}>
              <Text style={styles.primaryButtonText}>提交律师审核</Text>
            </TouchableOpacity>
          </View>
        )}

        {reviewResult.status === 'in_review' && (
          <View style={styles.statusBody}>
            <Text style={styles.statusDescription}>
              您的遗嘱正在审核中，预计1-3个工作日内完成
            </Text>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotCompleted]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>提交审核</Text>
                  <Text style={styles.timelineTime}>
                    {new Date().toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotActive]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>律师审核中</Text>
                  <Text style={styles.timelineTime}>审核中...</Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>审核完成</Text>
                  <Text style={styles.timelineTime}>待完成</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {reviewResult.status === 'approved' && (
          <View style={styles.statusBody}>
            <View style={styles.approvedCard}>
              <Text style={styles.approvedTitle}>审核通过</Text>
              <Text style={styles.approvedText}>
                您的遗嘱已通过律师审核，符合法律要求。
              </Text>
              {reviewResult.reviewerName && (
                <Text style={styles.reviewerInfo}>
                  审核律师：{reviewResult.reviewerName}
                </Text>
              )}
              {reviewResult.reviewDate && (
                <Text style={styles.reviewerInfo}>
                  审核日期：{reviewResult.reviewDate}
                </Text>
              )}
            </View>

            {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
              <View style={styles.suggestionsCard}>
                <Text style={styles.suggestionsTitle}>律师建议</Text>
                {reviewResult.suggestions.map((suggestion, index) => (
                  <Text key={index} style={styles.suggestionItem}>
                    • {suggestion}
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setActiveTab('notary')}
            >
              <Text style={styles.secondaryButtonText}>前往预约公证</Text>
              <Ionicons name="arrow-forward" size={16} color="#1890ff" />
            </TouchableOpacity>
          </View>
        )}

        {reviewResult.status === 'rejected' && (
          <View style={styles.statusBody}>
            <View style={styles.rejectedCard}>
              <Text style={styles.rejectedTitle}>需要修改</Text>
              <Text style={styles.rejectedText}>
                律师审核发现以下问题，请修改后重新提交：
              </Text>
              {reviewResult.comments && (
                <Text style={styles.commentText}>{reviewResult.comments}</Text>
              )}
            </View>

            {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
              <View style={styles.modificationsCard}>
                <Text style={styles.modificationsTitle}>修改建议</Text>
                {reviewResult.suggestions.map((suggestion, index) => (
                  <Text key={index} style={styles.modificationItem}>
                    {index + 1}. {suggestion}
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.primaryButtonText}>返回修改遗嘱</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 遗嘱预览 */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>遗嘱预览</Text>
        <TouchableOpacity style={styles.previewButton} onPress={handleViewWillContent}>
          <Ionicons name="document-text-outline" size={20} color="#1890ff" />
          <Text style={styles.previewButtonText}>查看完整遗嘱</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染公证标签页
  const renderNotaryTab = () => (
    <View style={styles.tabContent}>
      {/* 公证状态卡片 */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons
            name={
              notaryAppointment.status === 'not_started'
                ? 'clipboard-outline'
                : notaryAppointment.status === 'scheduled'
                ? 'calendar-outline'
                : notaryAppointment.status === 'in_progress'
                ? 'time-outline'
                : 'checkmark-circle-outline'
            }
            size={32}
            color={
              notaryAppointment.status === 'completed'
                ? '#52c41a'
                : '#1890ff'
            }
          />
          <Text style={styles.statusTitle}>
            {notaryAppointment.status === 'not_started' && '未预约'}
            {notaryAppointment.status === 'scheduled' && '已预约'}
            {notaryAppointment.status === 'in_progress' && '公证中'}
            {notaryAppointment.status === 'completed' && '公证完成'}
          </Text>
        </View>

        {notaryAppointment.status === 'not_started' && (
          <View style={styles.statusBody}>
            <Text style={styles.statusDescription}>
              公证遗嘱具有最高的法律效力，建议进行公证
            </Text>

            {/* 公证说明 */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>公证服务包括</Text>
              <View style={styles.infoList}>
                <Text style={styles.infoItem}>✓ 遗嘱内容审查</Text>
                <Text style={styles.infoItem}>✓ 立遗嘱人身份确认</Text>
                <Text style={styles.infoItem}>✓ 真实意愿核实</Text>
                <Text style={styles.infoItem}>✓ 法律效力认证</Text>
                <Text style={styles.infoItem}>✓ 遗嘱档案保管（可选）</Text>
              </View>
            </View>

            {/* 所需材料 */}
            <View style={styles.documentsCard}>
              <Text style={styles.documentsTitle}>所需材料</Text>
              <View style={styles.documentsList}>
                <View style={styles.documentItem}>
                  <Ionicons name="document-outline" size={16} color="#666" />
                  <Text style={styles.documentText}>身份证原件及复印件</Text>
                </View>
                <View style={styles.documentItem}>
                  <Ionicons name="document-outline" size={16} color="#666" />
                  <Text style={styles.documentText}>户口本原件及复印件</Text>
                </View>
                <View style={styles.documentItem}>
                  <Ionicons name="document-outline" size={16} color="#666" />
                  <Text style={styles.documentText}>财产证明材料</Text>
                </View>
                <View style={styles.documentItem}>
                  <Ionicons name="document-outline" size={16} color="#666" />
                  <Text style={styles.documentText}>遗嘱草稿</Text>
                </View>
              </View>
            </View>

            {/* 预约表单 */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>预约公证</Text>

              <Text style={styles.formLabel}>期望日期 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请选择期望的公证日期"
                value={notaryForm.preferredDate}
                onChangeText={text =>
                  setNotaryForm({ ...notaryForm, preferredDate: text })
                }
              />

              <Text style={styles.formLabel}>期望时间</Text>
              <TextInput
                style={styles.formInput}
                placeholder="例如：上午9:00-11:00"
                value={notaryForm.preferredTime}
                onChangeText={text =>
                  setNotaryForm({ ...notaryForm, preferredTime: text })
                }
              />

              <Text style={styles.formLabel}>联系电话 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入您的联系电话"
                value={notaryForm.contactPhone}
                onChangeText={text =>
                  setNotaryForm({ ...notaryForm, contactPhone: text })
                }
                keyboardType="phone-pad"
              />

              <Text style={styles.formLabel}>备注</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="其他需要说明的事项"
                value={notaryForm.notes}
                onChangeText={text => setNotaryForm({ ...notaryForm, notes: text })}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleScheduleNotary}
              >
                <Text style={styles.primaryButtonText}>提交预约</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.feeCard}>
              <Text style={styles.feeLabel}>公证费用</Text>
              <Text style={styles.feeValue}>约 ¥300-800</Text>
              <Text style={styles.feeNote}>根据遗产价值确定，以公证处实际收费为准</Text>
            </View>
          </View>
        )}

        {notaryAppointment.status === 'scheduled' && (
          <View style={styles.statusBody}>
            <Text style={styles.statusDescription}>您已成功预约公证服务</Text>

            <View style={styles.appointmentCard}>
              <View style={styles.appointmentRow}>
                <Ionicons name="business-outline" size={20} color="#666" />
                <Text style={styles.appointmentLabel}>公证处：</Text>
                <Text style={styles.appointmentValue}>
                  {notaryAppointment.notaryOffice}
                </Text>
              </View>
              <View style={styles.appointmentRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.appointmentLabel}>预约日期：</Text>
                <Text style={styles.appointmentValue}>
                  {notaryAppointment.appointmentDate}
                </Text>
              </View>
              <View style={styles.appointmentRow}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.appointmentLabel}>预约时间：</Text>
                <Text style={styles.appointmentValue}>
                  {notaryAppointment.appointmentTime || '待确认'}
                </Text>
              </View>
              <View style={styles.appointmentRow}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.appointmentLabel}>地址：</Text>
                <Text style={styles.appointmentValue}>
                  {notaryAppointment.address || '待确认'}
                </Text>
              </View>
              <View style={styles.appointmentRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.appointmentLabel}>联系人：</Text>
                <Text style={styles.appointmentValue}>
                  {notaryAppointment.contact || '待确认'}
                </Text>
              </View>
            </View>

            <View style={styles.reminderCard}>
              <Ionicons name="information-circle-outline" size={20} color="#1890ff" />
              <Text style={styles.reminderText}>
                请携带所需材料，提前15分钟到达公证处
              </Text>
            </View>
          </View>
        )}

        {notaryAppointment.status === 'completed' && (
          <View style={styles.statusBody}>
            <View style={styles.completedCard}>
              <Ionicons name="checkmark-circle" size={48} color="#52c41a" />
              <Text style={styles.completedTitle}>公证完成</Text>
              <Text style={styles.completedText}>
                您的遗嘱已完成公证，具有完全的法律效力
              </Text>
            </View>

            <View style={styles.certificateCard}>
              <Text style={styles.certificateTitle}>公证书信息</Text>
              <View style={styles.certificateRow}>
                <Text style={styles.certificateLabel}>公证书编号：</Text>
                <Text style={styles.certificateValue}>待上传</Text>
              </View>
              <View style={styles.certificateRow}>
                <Text style={styles.certificateLabel}>公证日期：</Text>
                <Text style={styles.certificateValue}>待上传</Text>
              </View>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="cloud-upload-outline" size={20} color="#1890ff" />
                <Text style={styles.uploadButtonText}>上传公证书扫描件</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1890ff" />
      </View>
    );
  }

  if (!will) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff4d4f" />
        <Text style={styles.errorText}>未找到遗嘱信息</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 标签页切换 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'review' && styles.tabActive]}
          onPress={() => setActiveTab('review')}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={activeTab === 'review' ? '#1890ff' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>
            律师审核
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'notary' && styles.tabActive]}
          onPress={() => setActiveTab('notary')}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={activeTab === 'notary' ? '#1890ff' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'notary' && styles.tabTextActive]}>
            公证服务
          </Text>
        </TouchableOpacity>
      </View>

      {/* 标签页内容 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'review' ? renderReviewTab() : renderNotaryTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#1890ff',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  tabTextActive: {
    color: '#1890ff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  statusBody: {
    marginTop: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  checkList: {
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  priceCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1890ff',
    marginVertical: 8,
  },
  priceNote: {
    fontSize: 12,
    color: '#999',
  },
  primaryButton: {
    backgroundColor: '#1890ff',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1890ff',
    borderRadius: 4,
    padding: 14,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1890ff',
    marginRight: 4,
  },
  timelineContainer: {
    marginTop: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d9d9d9',
    marginRight: 12,
    marginTop: 4,
  },
  timelineDotCompleted: {
    backgroundColor: '#52c41a',
  },
  timelineDotActive: {
    backgroundColor: '#1890ff',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: '#999',
  },
  approvedCard: {
    backgroundColor: '#f6ffed',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#52c41a',
  },
  approvedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52c41a',
    marginBottom: 8,
  },
  approvedText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewerInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  suggestionsCard: {
    backgroundColor: '#fff7e6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  rejectedCard: {
    backgroundColor: '#fff1f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4d4f',
  },
  rejectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4f',
    marginBottom: 8,
  },
  rejectedText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  modificationsCard: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  modificationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modificationItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 12,
  },
  previewButtonText: {
    fontSize: 14,
    color: '#1890ff',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoList: {},
  infoItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 24,
  },
  documentsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  documentsList: {},
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  feeCard: {
    backgroundColor: '#fff7e6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#faad14',
    marginVertical: 8,
  },
  feeNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    width: 80,
  },
  appointmentValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    padding: 16,
  },
  reminderText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    lineHeight: 18,
  },
  completedCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#52c41a',
    marginTop: 12,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  certificateCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
  },
  certificateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  certificateRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  certificateLabel: {
    fontSize: 13,
    color: '#666',
    width: 100,
  },
  certificateValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1890ff',
    borderRadius: 4,
    padding: 12,
    marginTop: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#1890ff',
    marginLeft: 8,
  },
});

export default WillReviewScreen;
