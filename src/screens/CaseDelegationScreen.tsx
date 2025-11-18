/**
 * ============================================================================
 * 案件委托页面 - CaseDelegationScreen
 * ============================================================================
 *
 * Phase 34.1: 案件委托
 *
 * 【功能概述】
 * - 为用户提供法律案件委托服务
 * - 帮助老年人寻找专业律师代理案件
 *
 * 【主要功能】
 * 1. 案件类型选择：赡养费追索、遗产纠纷、房产纠纷等
 * 2. 案情描述：详细描述案件情况
 * 3. 证据材料上传：上传相关证据文件
 * 4. 律师推荐与选择：智能推荐合适的律师
 * 5. 代理费预估：根据案件类型预估费用
 * 6. 委托合同签署：电子签约确认委托关系
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
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';
import { LawyerProfile, LawyerSpecialty, CaseStatus } from '../types/legalService';
import { getLawyers } from '../services/legalService';
import { COLORS } from '@/constants/app';

interface Props {
  navigation: any;
}

// 案件类型
const CASE_TYPES = [
  {
    id: 'alimony',
    label: '赡养费追索',
    icon: 'cash',
    description: '子女不履行赡养义务，追索赡养费',
    specialty: LawyerSpecialty.ELDER_CARE,
    estimatedFee: '5000-15000',
  },
  {
    id: 'inheritance',
    label: '遗产纠纷',
    icon: 'document-text',
    description: '遗产分配争议、遗嘱效力争议',
    specialty: LawyerSpecialty.INHERITANCE,
    estimatedFee: '8000-30000',
  },
  {
    id: 'property',
    label: '房产纠纷',
    icon: 'home',
    description: '房产继承、过户、买卖纠纷',
    specialty: LawyerSpecialty.PROPERTY,
    estimatedFee: '10000-50000',
  },
  {
    id: 'marriage',
    label: '婚姻家庭',
    icon: 'people',
    description: '离婚、财产分割、抚养权',
    specialty: LawyerSpecialty.MARRIAGE,
    estimatedFee: '5000-20000',
  },
  {
    id: 'contract',
    label: '合同纠纷',
    icon: 'document',
    description: '养老合同、借款合同等纠纷',
    specialty: LawyerSpecialty.CONTRACT,
    estimatedFee: '5000-20000',
  },
  {
    id: 'consumer',
    label: '消费维权',
    icon: 'cart',
    description: '保健品欺诈、养老服务纠纷',
    specialty: LawyerSpecialty.CONSUMER_RIGHTS,
    estimatedFee: '3000-10000',
  },
];

// 证据材料
interface Evidence {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  uri: string;
  size?: number;
}

// 委托步骤
type DelegationStep = 'type' | 'description' | 'evidence' | 'lawyer' | 'contract' | 'confirm';

const CaseDelegationScreen: React.FC<Props> = ({ navigation }) => {
  // 状态管理
  const [currentStep, setCurrentStep] = useState<DelegationStep>('type');
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [selectedCaseType, setSelectedCaseType] = useState<string>('');
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'urgent' | 'very_urgent'>('normal');
  const [evidences, setEvidences] = useState<Evidence[]>([]);

  // 律师相关
  const [recommendedLawyers, setRecommendedLawyers] = useState<LawyerProfile[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);

  // 合同相关
  const [agreeToContract, setAgreeToContract] = useState(false);

  useEffect(() => {
    if (currentStep === 'lawyer' && selectedCaseType) {
      loadRecommendedLawyers();
    }
  }, [currentStep, selectedCaseType]);

  const loadRecommendedLawyers = async () => {
    try {
      setLoading(true);
      const caseType = CASE_TYPES.find(t => t.id === selectedCaseType);
      if (!caseType) return;

      const allLawyers = await getLawyers();
      // 筛选出擅长该领域的律师
      const filtered = allLawyers
        .filter(lawyer => lawyer.specialties.includes(caseType.specialty))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      setRecommendedLawyers(filtered);
    } catch (error) {
      console.error('Error loading lawyers:', error);
      Alert.alert('加载失败', '无法加载律师信息');
    } finally {
      setLoading(false);
    }
  };

  // 添加证据
  const handleAddEvidence = () => {
    Alert.alert(
      '上传证据',
      '选择证据类型',
      [
        {
          text: '拍照',
          onPress: () => {
            const mockEvidence: Evidence = {
              id: `evidence_${Date.now()}`,
              name: `照片_${evidences.length + 1}.jpg`,
              type: 'image',
              uri: `https://via.placeholder.com/300?text=Evidence${evidences.length + 1}`,
            };
            setEvidences([...evidences, mockEvidence]);
          },
        },
        {
          text: '选择文件',
          onPress: () => {
            const mockEvidence: Evidence = {
              id: `evidence_${Date.now()}`,
              name: `文档_${evidences.length + 1}.pdf`,
              type: 'document',
              uri: `file://document_${evidences.length + 1}.pdf`,
            };
            setEvidences([...evidences, mockEvidence]);
          },
        },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  // 删除证据
  const handleRemoveEvidence = (evidenceId: string) => {
    setEvidences(evidences.filter(e => e.id !== evidenceId));
  };

  // 提交委托
  const handleSubmitDelegation = () => {
    setLoading(true);

    // 模拟提交
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '委托成功',
        `您的案件已成功委托给${selectedLawyer?.name}律师\n\n律师将在24小时内与您联系确认案件细节`,
        [
          {
            text: '查看案件',
            onPress: () => navigation.navigate('MyCases'),
          },
          {
            text: '确定',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    const steps = [
      { key: 'type' as DelegationStep, label: '案件类型' },
      { key: 'description' as DelegationStep, label: '案情描述' },
      { key: 'evidence' as DelegationStep, label: '证据材料' },
      { key: 'lawyer' as DelegationStep, label: '选择律师' },
      { key: 'contract' as DelegationStep, label: '签署合同' },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step.key} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= currentIndex && styles.stepCircleActive,
                index < currentIndex && styles.stepCircleCompleted,
              ]}
            >
              {index < currentIndex ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    index <= currentIndex && styles.stepNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                index <= currentIndex && styles.stepLabelActive,
              ]}
            >
              {step.label}
            </Text>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < currentIndex && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  // 渲染案件类型选择
  const renderCaseTypeSelection = () => {
    return (
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>选择案件类型</Text>
        <Text style={styles.stepSubtitle}>请选择您需要委托的案件类型</Text>

        <View style={styles.caseTypesGrid}>
          {CASE_TYPES.map(caseType => {
            const isSelected = selectedCaseType === caseType.id;
            return (
              <TouchableOpacity
                key={caseType.id}
                style={[styles.caseTypeCard, isSelected && styles.caseTypeCardSelected]}
                onPress={() => setSelectedCaseType(caseType.id)}
              >
                <View
                  style={[
                    styles.caseTypeIcon,
                    isSelected && styles.caseTypeIconSelected,
                  ]}
                >
                  <Ionicons
                    name={caseType.icon as any}
                    size={32}
                    color={isSelected ? COLORS.primary : '#999'}
                  />
                </View>
                <Text
                  style={[
                    styles.caseTypeLabel,
                    isSelected && styles.caseTypeLabelSelected,
                  ]}
                >
                  {caseType.label}
                </Text>
                <Text style={styles.caseTypeDescription}>{caseType.description}</Text>
                <Text style={styles.caseTypeFee}>代理费：{caseType.estimatedFee}元</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedCaseType && styles.nextButtonDisabled]}
          onPress={() => {
            if (selectedCaseType) {
              setCurrentStep('description');
            }
          }}
          disabled={!selectedCaseType}
        >
          <Text style={styles.nextButtonText}>下一步</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // 渲染案情描述
  const renderCaseDescription = () => {
    return (
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>详细描述案情</Text>
        <Text style={styles.stepSubtitle}>请详细描述您的案件情况，方便律师了解</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>案件标题 *</Text>
          <TextInput
            style={styles.input}
            placeholder="如：子女拒绝支付赡养费"
            placeholderTextColor="#999"
            value={caseTitle}
            onChangeText={setCaseTitle}
            maxLength={50}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>案情描述 *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请详细描述案件的起因、经过、现状等（500字以内）"
            placeholderTextColor="#999"
            multiline
            value={caseDescription}
            onChangeText={setCaseDescription}
            maxLength={500}
          />
          <Text style={styles.charCount}>{caseDescription.length}/500</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>紧急程度 *</Text>
          <View style={styles.urgencyButtons}>
            {[
              { value: 'normal' as const, label: '一般', color: '#52c41a' },
              { value: 'urgent' as const, label: '紧急', color: '#faad14' },
              { value: 'very_urgent' as const, label: '非常紧急', color: '#ff4d4f' },
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyButton,
                  urgencyLevel === option.value && {
                    backgroundColor: option.color + '20',
                    borderColor: option.color,
                  },
                ]}
                onPress={() => setUrgencyLevel(option.value)}
              >
                <Text
                  style={[
                    styles.urgencyButtonText,
                    urgencyLevel === option.value && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep('type')}
          >
            <Text style={styles.backButtonText}>上一步</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              styles.nextButtonHalf,
              (!caseTitle.trim() || !caseDescription.trim()) &&
                styles.nextButtonDisabled,
            ]}
            onPress={() => {
              if (caseTitle.trim() && caseDescription.trim()) {
                setCurrentStep('evidence');
              }
            }}
            disabled={!caseTitle.trim() || !caseDescription.trim()}
          >
            <Text style={styles.nextButtonText}>下一步</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 渲染证据材料上传
  const renderEvidenceUpload = () => {
    return (
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>上传证据材料</Text>
        <Text style={styles.stepSubtitle}>
          请上传与案件相关的证据材料（可选，后续也可补充）
        </Text>

        <View style={styles.evidenceTips}>
          <Ionicons name="information-circle" size={20} color="COLORS.primary" />
          <View style={styles.evidenceTipsContent}>
            <Text style={styles.evidenceTipsTitle}>证据材料包括：</Text>
            <Text style={styles.evidenceTipsText}>
              • 合同、协议等书面文件{'\n'}
              • 聊天记录截图、通话录音{'\n'}
              • 银行流水、转账记录{'\n'}
              • 相关照片、视频资料
            </Text>
          </View>
        </View>

        <View style={styles.evidenceList}>
          {evidences.map((evidence, index) => (
            <View key={evidence.id} style={styles.evidenceItem}>
              <View style={styles.evidenceIconContainer}>
                <Ionicons
                  name={
                    evidence.type === 'image'
                      ? 'image'
                      : evidence.type === 'document'
                      ? 'document'
                      : evidence.type === 'audio'
                      ? 'musical-notes'
                      : 'videocam'
                  }
                  size={24}
                  color="COLORS.primary"
                />
              </View>
              <View style={styles.evidenceInfo}>
                <Text style={styles.evidenceName}>{evidence.name}</Text>
                <Text style={styles.evidenceType}>
                  {evidence.type === 'image' && '图片'}
                  {evidence.type === 'document' && '文档'}
                  {evidence.type === 'audio' && '录音'}
                  {evidence.type === 'video' && '视频'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.evidenceDeleteButton}
                onPress={() => handleRemoveEvidence(evidence.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addEvidenceButton} onPress={handleAddEvidence}>
            <Ionicons name="add-circle-outline" size={32} color="COLORS.primary" />
            <Text style={styles.addEvidenceText}>添加证据材料</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep('description')}
          >
            <Text style={styles.backButtonText}>上一步</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, styles.nextButtonHalf]}
            onPress={() => setCurrentStep('lawyer')}
          >
            <Text style={styles.nextButtonText}>下一步</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 渲染律师选择
  const renderLawyerSelection = () => {
    const caseType = CASE_TYPES.find(t => t.id === selectedCaseType);

    return (
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>选择委托律师</Text>
        <Text style={styles.stepSubtitle}>
          为您推荐{caseType?.label}领域的专业律师
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="COLORS.primary" />
            <Text style={styles.loadingText}>正在为您推荐律师...</Text>
          </View>
        ) : (
          <View style={styles.lawyersList}>
            {recommendedLawyers.map((lawyer, index) => {
              const isSelected = selectedLawyer?.id === lawyer.id;
              return (
                <TouchableOpacity
                  key={lawyer.id}
                  style={[styles.lawyerCard, isSelected && styles.lawyerCardSelected]}
                  onPress={() => setSelectedLawyer(lawyer)}
                >
                  {index === 0 && (
                    <View style={styles.recommendedBadge}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.recommendedText}>推荐</Text>
                    </View>
                  )}

                  <View style={styles.lawyerHeader}>
                    <View style={styles.lawyerAvatarPlaceholder}>
                      <Ionicons name="person" size={32} color="#999" />
                    </View>
                    <View style={styles.lawyerBasicInfo}>
                      <Text style={styles.lawyerName}>{lawyer.name}</Text>
                      <Text style={styles.lawyerFirm}>{lawyer.lawFirm}</Text>
                      <View style={styles.lawyerRating}>
                        <Ionicons name="star" size={14} color="#fadb14" />
                        <Text style={styles.lawyerRatingText}>
                          {lawyer.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.lawyerCaseCount}>
                          {lawyer.caseCount}个案件
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.lawyerStats}>
                    <View style={styles.lawyerStatItem}>
                      <Text style={styles.lawyerStatLabel}>执业年限</Text>
                      <Text style={styles.lawyerStatValue}>
                        {lawyer.yearsOfExperience}年
                      </Text>
                    </View>
                    <View style={styles.lawyerStatItem}>
                      <Text style={styles.lawyerStatLabel}>胜诉率</Text>
                      <Text style={styles.lawyerStatValue}>
                        {(lawyer.successRate * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.lawyerStatItem}>
                      <Text style={styles.lawyerStatLabel}>预估代理费</Text>
                      <Text style={styles.lawyerFeeValue}>
                        {caseType?.estimatedFee}元
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.lawyerIntro} numberOfLines={2}>
                    {lawyer.introduction}
                  </Text>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color="#52c41a" />
                      <Text style={styles.selectedText}>已选择</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep('evidence')}
          >
            <Text style={styles.backButtonText}>上一步</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              styles.nextButtonHalf,
              !selectedLawyer && styles.nextButtonDisabled,
            ]}
            onPress={() => {
              if (selectedLawyer) {
                setCurrentStep('contract');
              }
            }}
            disabled={!selectedLawyer}
          >
            <Text style={styles.nextButtonText}>下一步</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 渲染合同签署
  const renderContractSigning = () => {
    const caseType = CASE_TYPES.find(t => t.id === selectedCaseType);

    return (
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>签署委托合同</Text>
        <Text style={styles.stepSubtitle}>请仔细阅读委托合同条款</Text>

        <View style={styles.contractPreview}>
          <Text style={styles.contractTitle}>法律服务委托合同</Text>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>甲方（委托人）信息</Text>
            <Text style={styles.contractText}>
              姓名：[用户姓名]{'\n'}
              联系电话：[用户电话]
            </Text>
          </View>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>乙方（受托人）信息</Text>
            <Text style={styles.contractText}>
              律师姓名：{selectedLawyer?.name}{'\n'}
              执业证号：{selectedLawyer?.licenseNumber}{'\n'}
              所属律所：{selectedLawyer?.lawFirm}
            </Text>
          </View>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>委托事项</Text>
            <Text style={styles.contractText}>
              案件类型：{caseType?.label}{'\n'}
              案件标题：{caseTitle}{'\n'}
              紧急程度：
              {urgencyLevel === 'normal' && '一般'}
              {urgencyLevel === 'urgent' && '紧急'}
              {urgencyLevel === 'very_urgent' && '非常紧急'}
            </Text>
          </View>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>服务内容</Text>
            <Text style={styles.contractText}>
              1. 案件法律分析与咨询{'\n'}
              2. 证据材料整理与审查{'\n'}
              3. 法律文书起草与审核{'\n'}
              4. 出庭代理与辩护{'\n'}
              5. 其他法律服务
            </Text>
          </View>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>费用约定</Text>
            <Text style={styles.contractText}>
              代理费用：{caseType?.estimatedFee}元（具体费用以双方协商为准）{'\n'}
              支付方式：分期支付（预付30%，结案后支付70%）
            </Text>
          </View>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>双方权利义务</Text>
            <Text style={styles.contractText}>
              甲方权利：{'\n'}
              • 了解案件进展情况{'\n'}
              • 要求律师提供专业法律意见{'\n'}
              • 查阅案件相关材料{'\n'}
              {'\n'}
              乙方义务：{'\n'}
              • 维护委托人合法权益{'\n'}
              • 保守委托人秘密{'\n'}
              • 及时汇报案件进展
            </Text>
          </View>

          <View style={styles.contractSection}>
            <Text style={styles.contractSectionTitle}>其他约定</Text>
            <Text style={styles.contractText}>
              1. 本合同自双方签字之日起生效{'\n'}
              2. 合同有效期至案件结案{'\n'}
              3. 合同争议通过友好协商解决
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.agreementCheckbox}
          onPress={() => setAgreeToContract(!agreeToContract)}
        >
          <Ionicons
            name={agreeToContract ? 'checkbox' : 'square-outline'}
            size={24}
            color={agreeToContract ? COLORS.primary : '#999'}
          />
          <Text style={styles.agreementText}>
            我已仔细阅读并同意《法律服务委托合同》全部条款
          </Text>
        </TouchableOpacity>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep('lawyer')}
          >
            <Text style={styles.backButtonText}>上一步</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              styles.nextButtonHalf,
              !agreeToContract && styles.nextButtonDisabled,
            ]}
            onPress={() => {
              if (agreeToContract) {
                handleSubmitDelegation();
              }
            }}
            disabled={!agreeToContract || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.nextButtonText}>确认委托</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>案件委托</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 步骤指示器 */}
      {renderStepIndicator()}

      {/* 内容区域 */}
      {currentStep === 'type' && renderCaseTypeSelection()}
      {currentStep === 'description' && renderCaseDescription()}
      {currentStep === 'evidence' && renderEvidenceUpload()}
      {currentStep === 'lawyer' && renderLawyerSelection()}
      {currentStep === 'contract' && renderContractSigning()}
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
  backButtonHeader: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stepIndicator: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepCircleCompleted: {
    backgroundColor: '#52c41a',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#333',
    fontWeight: '500',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  caseTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  caseTypeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  caseTypeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  caseTypeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  caseTypeIconSelected: {
    backgroundColor: '#fff',
  },
  caseTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  caseTypeLabelSelected: {
    color: COLORS.primary,
  },
  caseTypeDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  caseTypeFee: {
    fontSize: 13,
    color: '#ff4d4f',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 6,
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  evidenceTips: {
    flexDirection: 'row',
    backgroundColor: '#f3e5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  evidenceTipsContent: {
    flex: 1,
  },
  evidenceTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  evidenceTipsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  evidenceList: {
    gap: 12,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  evidenceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  evidenceType: {
    fontSize: 12,
    color: '#999',
  },
  evidenceDeleteButton: {
    padding: 8,
  },
  addEvidenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    gap: 8,
  },
  addEvidenceText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#999',
  },
  lawyersList: {
    gap: 12,
  },
  lawyerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  lawyerCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faad14',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
  },
  recommendedText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  lawyerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  lawyerAvatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lawyerBasicInfo: {
    flex: 1,
  },
  lawyerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lawyerFirm: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  lawyerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lawyerRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  lawyerCaseCount: {
    fontSize: 12,
    color: '#999',
  },
  lawyerStats: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  lawyerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  lawyerStatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  lawyerStatValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  lawyerFeeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ff4d4f',
  },
  lawyerIntro: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52c41a',
  },
  contractPreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    maxHeight: 400,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  contractSection: {
    marginBottom: 16,
  },
  contractSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contractText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22,
  },
  agreementCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    alignItems: 'center',
  },
  nextButtonHalf: {
    flex: 1,
    paddingHorizontal: 0,
  },
  nextButtonDisabled: {
    backgroundColor: '#d9d9d9',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CaseDelegationScreen;
