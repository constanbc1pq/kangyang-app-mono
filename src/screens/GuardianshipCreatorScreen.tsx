/**
 * 意定监护协议创建页面
 * 帮助用户创建意定监护协议
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Guardian, GuardianDuty } from '../types/legalService';
import { createGuardianshipAgreement } from '../services/legalService';
import { COLORS } from '@/constants/app';

interface GuardianshipFormData {
  // 被监护人信息
  wardName: string;
  wardIdNumber: string;
  wardAge: number;

  // 监护人信息
  guardians: Guardian[];

  // 监护职责范围
  scope: {
    dailyCare: boolean; // 生活照料
    medicalDecision: boolean; // 医疗决策
    propertyManagement: boolean; // 财产管理
    legalRepresentation: boolean; // 法律代理
  };

  // 财产管理权限
  propertyRights: {
    pensionManagement: boolean; // 退休金管理
    realEstateDisposal: boolean; // 房产处置
    bankAccountAccess: boolean; // 银行账户
    investmentDecision: boolean; // 投资决策
  };

  // 监督机制
  supervision: {
    enabled: boolean;
    supervisorName: string;
    supervisorRelation: string;
    supervisorPhone: string;
    reportFrequency: string; // 报告频率
    auditRights: boolean; // 审计权
  };

  // 其他条款
  specialTerms: string[];
}

const GuardianshipCreatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GuardianshipFormData>({
    wardName: '',
    wardIdNumber: '',
    wardAge: 0,
    guardians: [],
    scope: {
      dailyCare: true,
      medicalDecision: true,
      propertyManagement: true,
      legalRepresentation: true,
    },
    propertyRights: {
      pensionManagement: false,
      bankAccountAccess: false,
      realEstateDisposal: false,
      investmentDecision: false,
    },
    supervision: {
      enabled: false,
      supervisorName: '',
      supervisorRelation: '',
      supervisorPhone: '',
      reportFrequency: '',
      auditRights: false,
    },
    specialTerms: [],
  });

  // 临时监护人输入
  const [guardianInput, setGuardianInput] = useState({
    name: '',
    relation: '',
    idNumber: '',
    phone: '',
    address: '',
    type: 'individual' as 'individual' | 'institution',
  });

  const [termInput, setTermInput] = useState('');

  const totalSteps = 5;
  const stepTitles = [
    '被监护人信息',
    '监护人选定',
    '监护职责范围',
    '财产管理权限',
    '监督机制设置',
  ];

  const updateFormData = (updates: Partial<GuardianshipFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // 添加监护人
  const addGuardian = () => {
    if (!guardianInput.name || !guardianInput.relation || !guardianInput.phone) {
      Alert.alert('提示', '请填写监护人的完整信息');
      return;
    }

    const newGuardian: Guardian = {
      name: guardianInput.name,
      relation: guardianInput.relation,
      idNumber: guardianInput.idNumber,
      phone: guardianInput.phone,
      address: guardianInput.address,
      duties: [],
    };

    updateFormData({ guardians: [...formData.guardians, newGuardian] });

    // 重置输入
    setGuardianInput({
      name: '',
      relation: '',
      idNumber: '',
      phone: '',
      address: '',
      type: 'individual',
    });
  };

  // 删除监护人
  const removeGuardian = (index: number) => {
    const newGuardians = formData.guardians.filter((_, i) => i !== index);
    updateFormData({ guardians: newGuardians });
  };

  // 添加特殊条款
  const addSpecialTerm = () => {
    if (!termInput.trim()) {
      Alert.alert('提示', '请输入条款内容');
      return;
    }

    updateFormData({ specialTerms: [...formData.specialTerms, termInput.trim()] });
    setTermInput('');
  };

  // 删除特殊条款
  const removeSpecialTerm = (index: number) => {
    const newTerms = formData.specialTerms.filter((_, i) => i !== index);
    updateFormData({ specialTerms: newTerms });
  };

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.wardName || !formData.wardIdNumber) {
          Alert.alert('提示', '请填写被监护人基本信息');
          return false;
        }
        if (formData.wardAge < 18) {
          Alert.alert('提示', '意定监护适用于成年人，未成年人请使用法定监护');
          return false;
        }
        break;
      case 2:
        if (formData.guardians.length === 0) {
          Alert.alert('提示', '请至少指定一位监护人');
          return false;
        }
        break;
      case 3:
        if (
          !formData.scope.dailyCare &&
          !formData.scope.medicalDecision &&
          !formData.scope.propertyManagement &&
          !formData.scope.legalRepresentation
        ) {
          Alert.alert('提示', '请至少选择一项监护职责');
          return false;
        }
        break;
    }
    return true;
  };

  // 下一步
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 提交协议
  const handleSubmit = async () => {
    try {
      // 构建监护职责列表
      const duties: GuardianDuty[] = [];
      if (formData.scope.dailyCare) duties.push(GuardianDuty.DAILY_CARE);
      if (formData.scope.medicalDecision) duties.push(GuardianDuty.MEDICAL_DECISION);
      if (formData.scope.propertyManagement) duties.push(GuardianDuty.PROPERTY_MANAGEMENT);
      if (formData.scope.legalRepresentation) duties.push(GuardianDuty.LEGAL_REPRESENTATION);

      // 更新监护人的职责
      const guardiansWithDuties = formData.guardians.map(g => ({
        ...g,
        duties,
      }));

      const agreementData = {
        userId: 'current_user_id', // TODO: 从用户状态获取
        status: 'draft' as const,
        wardName: formData.wardName,
        wardIdNumber: formData.wardIdNumber,
        wardAge: formData.wardAge,
        guardians: guardiansWithDuties,
        scope: formData.scope,
        propertyRights: formData.propertyRights,
        supervision: formData.supervision,
        specialTerms: formData.specialTerms.length > 0 ? formData.specialTerms : undefined,
        effectiveDate: undefined,
        expiryDate: undefined,
      };

      await createGuardianshipAgreement(agreementData);

      Alert.alert(
        '创建成功',
        '意定监护协议草稿已保存。建议您进行公证以增强法律效力。',
        [
          {
            text: '查看协议',
            onPress: () => navigation.navigate('MyGuardianship' as never),
          },
          {
            text: '返回',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '创建协议失败，请重试');
      console.error('Error creating guardianship agreement:', error);
    }
  };

  // 渲染步骤1：被监护人信息
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>被监护人信息</Text>
      <Text style={styles.stepDescription}>
        意定监护是您在意识清楚时为自己指定未来的监护人
      </Text>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="COLORS.primary" />
        <Text style={styles.infoText}>
          意定监护适用于有完全民事行为能力的成年人，用于防范未来可能出现的意识不清或行动不便的情况
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>您的姓名 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入您的姓名"
          value={formData.wardName}
          onChangeText={text => updateFormData({ wardName: text })}
        />

        <Text style={styles.inputLabel}>身份证号 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入身份证号"
          value={formData.wardIdNumber}
          onChangeText={text => updateFormData({ wardIdNumber: text })}
        />

        <Text style={styles.inputLabel}>年龄 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入年龄"
          value={formData.wardAge > 0 ? formData.wardAge.toString() : ''}
          onChangeText={text => updateFormData({ wardAge: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  // 渲染步骤2：监护人选定
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>监护人选定</Text>
      <Text style={styles.stepDescription}>
        您可以指定一位或多位监护人，建议选择信任的亲友或专业机构
      </Text>

      {/* 已添加的监护人列表 */}
      {formData.guardians.map((guardian, index) => (
        <View key={index} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{guardian.name}</Text>
            <Text style={styles.listItemDescription}>关系：{guardian.relation}</Text>
            <Text style={styles.listItemDetail}>电话：{guardian.phone}</Text>
            {guardian.address && (
              <Text style={styles.listItemDetail}>地址：{guardian.address}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => removeGuardian(index)}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      ))}

      {/* 添加监护人表单 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>监护人类型</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              guardianInput.type === 'individual' && styles.radioButtonSelected,
            ]}
            onPress={() => setGuardianInput({ ...guardianInput, type: 'individual' })}
          >
            <Text
              style={[
                styles.radioButtonText,
                guardianInput.type === 'individual' && styles.radioButtonTextSelected,
              ]}
            >
              个人（亲友）
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              guardianInput.type === 'institution' && styles.radioButtonSelected,
            ]}
            onPress={() => setGuardianInput({ ...guardianInput, type: 'institution' })}
          >
            <Text
              style={[
                styles.radioButtonText,
                guardianInput.type === 'institution' && styles.radioButtonTextSelected,
              ]}
            >
              专业机构
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>
          {guardianInput.type === 'individual' ? '监护人姓名' : '机构名称'} *
        </Text>
        <TextInput
          style={styles.input}
          placeholder={
            guardianInput.type === 'individual' ? '请输入监护人姓名' : '请输入机构名称'
          }
          value={guardianInput.name}
          onChangeText={text => setGuardianInput({ ...guardianInput, name: text })}
        />

        <Text style={styles.inputLabel}>关系/类型 *</Text>
        <TextInput
          style={styles.input}
          placeholder={
            guardianInput.type === 'individual'
              ? '例如：子女、配偶、朋友'
              : '例如：养老服务机构、律师事务所'
          }
          value={guardianInput.relation}
          onChangeText={text => setGuardianInput({ ...guardianInput, relation: text })}
        />

        <Text style={styles.inputLabel}>
          {guardianInput.type === 'individual' ? '身份证号' : '统一社会信用代码'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={guardianInput.type === 'individual' ? '请输入身份证号' : '请输入统一社会信用代码'}
          value={guardianInput.idNumber}
          onChangeText={text => setGuardianInput({ ...guardianInput, idNumber: text })}
        />

        <Text style={styles.inputLabel}>联系电话 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入联系电话"
          value={guardianInput.phone}
          onChangeText={text => setGuardianInput({ ...guardianInput, phone: text })}
          keyboardType="phone-pad"
        />

        <Text style={styles.inputLabel}>地址</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入地址"
          value={guardianInput.address}
          onChangeText={text => setGuardianInput({ ...guardianInput, address: text })}
        />

        <TouchableOpacity style={styles.addButton} onPress={addGuardian}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加监护人</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={20} color="#faad14" />
        <Text style={styles.tipText}>
          建议：可以指定2-3位监护人，并明确他们的监护顺序和分工。同时建议选择年龄相对年轻、身体健康、有责任心的人选。
        </Text>
      </View>
    </View>
  );

  // 渲染步骤3：监护职责范围
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>监护职责范围</Text>
      <Text style={styles.stepDescription}>
        请选择监护人的职责范围
      </Text>

      <View style={styles.switchSection}>
        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>生活照料</Text>
            <Text style={styles.switchDescription}>
              包括日常起居、饮食、卫生等生活方面的照料
            </Text>
          </View>
          <Switch
            value={formData.scope.dailyCare}
            onValueChange={value =>
              updateFormData({ scope: { ...formData.scope, dailyCare: value } })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.scope.dailyCare ? 'COLORS.primary' : '#f4f4f4'}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>医疗决策</Text>
            <Text style={styles.switchDescription}>
              包括就医选择、治疗方案决定、手术同意等
            </Text>
          </View>
          <Switch
            value={formData.scope.medicalDecision}
            onValueChange={value =>
              updateFormData({ scope: { ...formData.scope, medicalDecision: value } })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.scope.medicalDecision ? 'COLORS.primary' : '#f4f4f4'}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>财产管理</Text>
            <Text style={styles.switchDescription}>
              包括收入支出管理、资产保值增值等（下一步可详细设置权限）
            </Text>
          </View>
          <Switch
            value={formData.scope.propertyManagement}
            onValueChange={value =>
              updateFormData({ scope: { ...formData.scope, propertyManagement: value } })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.scope.propertyManagement ? 'COLORS.primary' : '#f4f4f4'}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>法律代理</Text>
            <Text style={styles.switchDescription}>
              包括签订合同、诉讼代理、权益维护等法律事务
            </Text>
          </View>
          <Switch
            value={formData.scope.legalRepresentation}
            onValueChange={value =>
              updateFormData({ scope: { ...formData.scope, legalRepresentation: value } })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.scope.legalRepresentation ? 'COLORS.primary' : '#f4f4f4'}
          />
        </View>
      </View>
    </View>
  );

  // 渲染步骤4：财产管理权限
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>财产管理权限</Text>
      <Text style={styles.stepDescription}>
        请详细设置监护人对您财产的管理权限
      </Text>

      {!formData.scope.propertyManagement && (
        <View style={styles.warningCard}>
          <Ionicons name="information-circle-outline" size={20} color="#faad14" />
          <Text style={styles.warningText}>
            您在上一步未选择"财产管理"职责，以下权限设置将不生效
          </Text>
        </View>
      )}

      <View style={styles.switchSection}>
        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>退休金管理</Text>
            <Text style={styles.switchDescription}>
              管理您的退休金、养老金等固定收入
            </Text>
          </View>
          <Switch
            value={formData.propertyRights.pensionManagement}
            onValueChange={value =>
              updateFormData({
                propertyRights: { ...formData.propertyRights, pensionManagement: value },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.propertyRights.pensionManagement ? 'COLORS.primary' : '#f4f4f4'}
            disabled={!formData.scope.propertyManagement}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>银行账户管理</Text>
            <Text style={styles.switchDescription}>
              管理您的银行存款、取款、转账等
            </Text>
          </View>
          <Switch
            value={formData.propertyRights.bankAccountAccess}
            onValueChange={value =>
              updateFormData({
                propertyRights: { ...formData.propertyRights, bankAccountAccess: value },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.propertyRights.bankAccountAccess ? 'COLORS.primary' : '#f4f4f4'}
            disabled={!formData.scope.propertyManagement}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>房产处置权</Text>
            <Text style={styles.switchDescription}>
              出售、出租您的房产（建议谨慎授权）
            </Text>
          </View>
          <Switch
            value={formData.propertyRights.realEstateDisposal}
            onValueChange={value =>
              updateFormData({
                propertyRights: { ...formData.propertyRights, realEstateDisposal: value },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.propertyRights.realEstateDisposal ? 'COLORS.primary' : '#f4f4f4'}
            disabled={!formData.scope.propertyManagement}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>投资决策权</Text>
            <Text style={styles.switchDescription}>
              进行理财、股票、基金等投资决策
            </Text>
          </View>
          <Switch
            value={formData.propertyRights.investmentDecision}
            onValueChange={value =>
              updateFormData({
                propertyRights: { ...formData.propertyRights, investmentDecision: value },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
            thumbColor={formData.propertyRights.investmentDecision ? 'COLORS.primary' : '#f4f4f4'}
            disabled={!formData.scope.propertyManagement}
          />
        </View>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="warning-outline" size={20} color="#ff4d4f" />
        <Text style={styles.tipText}>
          重要提示：财产管理权限较大，建议设置监督机制（下一步）以防止财产被侵占
        </Text>
      </View>
    </View>
  );

  // 渲染步骤5：监督机制
  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>监督机制设置</Text>
      <Text style={styles.stepDescription}>
        设置监督人可以有效防止监护人滥用职权或侵占财产
      </Text>

      <View style={styles.switchItem}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchTitle}>启用监督机制</Text>
          <Text style={styles.switchDescription}>
            指定监督人对监护人的行为进行监督
          </Text>
        </View>
        <Switch
          value={formData.supervision.enabled}
          onValueChange={value =>
            updateFormData({ supervision: { ...formData.supervision, enabled: value } })
          }
          trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
          thumbColor={formData.supervision.enabled ? 'COLORS.primary' : '#f4f4f4'}
        />
      </View>

      {formData.supervision.enabled && (
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>监督人姓名 *</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入监督人姓名"
            value={formData.supervision.supervisorName}
            onChangeText={text =>
              updateFormData({ supervision: { ...formData.supervision, supervisorName: text } })
            }
          />

          <Text style={styles.inputLabel}>与您的关系 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：亲属、律师、社工等"
            value={formData.supervision.supervisorRelation}
            onChangeText={text =>
              updateFormData({
                supervision: { ...formData.supervision, supervisorRelation: text },
              })
            }
          />

          <Text style={styles.inputLabel}>联系电话 *</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入联系电话"
            value={formData.supervision.supervisorPhone}
            onChangeText={text =>
              updateFormData({ supervision: { ...formData.supervision, supervisorPhone: text } })
            }
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>报告频率</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：每月、每季度、每半年"
            value={formData.supervision.reportFrequency}
            onChangeText={text =>
              updateFormData({
                supervision: { ...formData.supervision, reportFrequency: text },
              })
            }
          />

          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>审计权</Text>
              <Text style={styles.switchDescription}>
                监督人有权审计监护人的财产管理情况
              </Text>
            </View>
            <Switch
              value={formData.supervision.auditRights}
              onValueChange={value =>
                updateFormData({ supervision: { ...formData.supervision, auditRights: value } })
              }
              trackColor={{ false: '#d9d9d9', true: '#e1bee7' }}
              thumbColor={formData.supervision.auditRights ? 'COLORS.primary' : '#f4f4f4'}
            />
          </View>
        </View>
      )}

      {/* 特殊条款 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他特殊条款（可选）</Text>

        {formData.specialTerms.map((term, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemDescription}>{term}</Text>
            </View>
            <TouchableOpacity onPress={() => removeSpecialTerm(index)}>
              <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
            </TouchableOpacity>
          </View>
        ))}

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="例如：监护人不得将我送入养老院、监护人每月需向我汇报财产状况等"
          value={termInput}
          onChangeText={setTermInput}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.addButton} onPress={addSpecialTerm}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加条款</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="COLORS.primary" />
        <Text style={styles.infoText}>
          完成后，强烈建议您到公证处办理意定监护公证，以确保协议的法律效力
        </Text>
      </View>
    </View>
  );

  // 渲染当前步骤
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 顶部进度条 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentStep} / {totalSteps}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]}
            />
          </View>
          <Text style={styles.stepTitleText}>{stepTitles[currentStep - 1]}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* 步骤内容 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
            <Ionicons name="chevron-back" size={20} color="#666" />
            <Text style={styles.backButtonText}>上一步</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? '生成协议' : '下一步'}
          </Text>
          {currentStep < totalSteps && <Ionicons name="chevron-forward" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e8e8e8',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'COLORS.primary',
    borderRadius: 2,
  },
  stepTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginLeft: 8,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginLeft: 8,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fff7e6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#faad14',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginLeft: 8,
  },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#666',
  },
  radioButtonTextSelected: {
    color: 'COLORS.primary',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'COLORS.primary',
    borderRadius: 4,
    padding: 12,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  listItemDetail: {
    fontSize: 12,
    color: '#999',
  },
  switchSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    padding: 14,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 4,
  },
});

export default GuardianshipCreatorScreen;
