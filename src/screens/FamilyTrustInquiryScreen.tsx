/**
 * 家族信托咨询页面
 * 为高净值用户提供家族信托设立咨询服务
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface TrustInquiryForm {
  // 基本信息
  name: string;
  phone: string;
  email: string;

  // 财产情况
  estimatedAssets: string;
  assetTypes: string[];

  // 信托目的
  trustPurpose: string[];
  customPurpose: string;

  // 家庭情况
  familyMembers: number;
  beneficiariesCount: number;
  hasComplexInheritance: boolean;

  // 其他需求
  otherRequirements: string;
}

const FamilyTrustInquiryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<TrustInquiryForm>({
    name: '',
    phone: '',
    email: '',
    estimatedAssets: '',
    assetTypes: [],
    trustPurpose: [],
    customPurpose: '',
    familyMembers: 0,
    beneficiariesCount: 0,
    hasComplexInheritance: false,
    otherRequirements: '',
  });

  const updateFormData = (updates: Partial<TrustInquiryForm>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleAssetType = (type: string) => {
    const newTypes = formData.assetTypes.includes(type)
      ? formData.assetTypes.filter(t => t !== type)
      : [...formData.assetTypes, type];
    updateFormData({ assetTypes: newTypes });
  };

  const toggleTrustPurpose = (purpose: string) => {
    const newPurposes = formData.trustPurpose.includes(purpose)
      ? formData.trustPurpose.filter(p => p !== purpose)
      : [...formData.trustPurpose, purpose];
    updateFormData({ trustPurpose: newPurposes });
  };

  const handleSubmit = () => {
    // 验证必填项
    if (!formData.name || !formData.phone) {
      Alert.alert('提示', '请填写姓名和联系电话');
      return;
    }

    if (!formData.estimatedAssets) {
      Alert.alert('提示', '请选择资产规模');
      return;
    }

    if (formData.assetTypes.length === 0) {
      Alert.alert('提示', '请至少选择一种资产类型');
      return;
    }

    if (formData.trustPurpose.length === 0) {
      Alert.alert('提示', '请至少选择一个信托目的');
      return;
    }

    // 提交申请
    Alert.alert(
      '提交成功',
      '您的家族信托咨询申请已提交。\n\n我们的信托顾问将在1个工作日内与您联系，为您提供专业的信托规划方案。',
      [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部介绍卡片 */}
      <View style={styles.headerCard}>
        <Ionicons name="business-outline" size={48} color="#1890ff" />
        <Text style={styles.headerTitle}>家族信托服务</Text>
        <Text style={styles.headerDescription}>
          为高净值家庭提供财富传承、资产保护、税务筹划等专业服务
        </Text>
      </View>

      {/* 服务优势 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>为什么选择家族信托？</Text>

        <View style={styles.benefitCard}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#52c41a" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>资产保护</Text>
            <Text style={styles.benefitDescription}>
              隔离债务风险，保护家族财富不受侵占
            </Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="people-outline" size={24} color="#1890ff" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>财富传承</Text>
            <Text style={styles.benefitDescription}>
              科学规划财富分配，避免家族纷争，实现代际传承
            </Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="document-text-outline" size={24} color="#faad14" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>税务筹划</Text>
            <Text style={styles.benefitDescription}>
              合法合规降低税务成本，优化资产配置
            </Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="lock-closed-outline" size={24} color="#722ed1" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>隐私保密</Text>
            <Text style={styles.benefitDescription}>
              信托财产独立管理，保护家族财富隐私
            </Text>
          </View>
        </View>
      </View>

      {/* 适用人群 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>适用人群</Text>
        <View style={styles.targetCard}>
          <Text style={styles.targetItem}>• 资产规模3000万以上的高净值人士</Text>
          <Text style={styles.targetItem}>• 有复杂家庭结构的再婚家庭</Text>
          <Text style={styles.targetItem}>• 需要进行企业股权传承的企业家</Text>
          <Text style={styles.targetItem}>• 希望进行财富保值增值的投资者</Text>
          <Text style={styles.targetItem}>• 有海外资产配置需求的人群</Text>
        </View>
      </View>

      {/* 咨询申请表 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>填写咨询申请</Text>

        <View style={styles.formCard}>
          {/* 基本信息 */}
          <Text style={styles.formSubtitle}>基本信息</Text>

          <Text style={styles.formLabel}>您的姓名 *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入您的姓名"
            value={formData.name}
            onChangeText={text => updateFormData({ name: text })}
          />

          <Text style={styles.formLabel}>联系电话 *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入联系电话"
            value={formData.phone}
            onChangeText={text => updateFormData({ phone: text })}
            keyboardType="phone-pad"
          />

          <Text style={styles.formLabel}>电子邮箱</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入电子邮箱"
            value={formData.email}
            onChangeText={text => updateFormData({ email: text })}
            keyboardType="email-address"
          />

          {/* 财产情况 */}
          <Text style={styles.formSubtitle}>财产情况</Text>

          <Text style={styles.formLabel}>资产规模 *</Text>
          <View style={styles.optionGroup}>
            {[
              { value: '3000-5000万', label: '3000-5000万' },
              { value: '5000万-1亿', label: '5000万-1亿' },
              { value: '1-3亿', label: '1-3亿' },
              { value: '3亿以上', label: '3亿以上' },
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.estimatedAssets === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => updateFormData({ estimatedAssets: option.value })}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    formData.estimatedAssets === option.value && styles.optionButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>资产类型 *（可多选）</Text>
          <View style={styles.checkboxGroup}>
            {[
              { value: 'real_estate', label: '房产' },
              { value: 'securities', label: '股票证券' },
              { value: 'equity', label: '企业股权' },
              { value: 'cash', label: '现金存款' },
              { value: 'art', label: '艺术品收藏' },
              { value: 'overseas', label: '海外资产' },
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.checkboxItem}
                onPress={() => toggleAssetType(option.value)}
              >
                <Ionicons
                  name={
                    formData.assetTypes.includes(option.value)
                      ? 'checkbox'
                      : 'square-outline'
                  }
                  size={24}
                  color={formData.assetTypes.includes(option.value) ? '#1890ff' : '#d9d9d9'}
                />
                <Text style={styles.checkboxLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 信托目的 */}
          <Text style={styles.formSubtitle}>信托目的</Text>

          <Text style={styles.formLabel}>主要目的 *（可多选）</Text>
          <View style={styles.checkboxGroup}>
            {[
              { value: 'inheritance', label: '财富传承' },
              { value: 'protection', label: '资产保护' },
              { value: 'tax', label: '税务筹划' },
              { value: 'investment', label: '资产增值' },
              { value: 'charity', label: '慈善公益' },
              { value: 'privacy', label: '隐私保护' },
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.checkboxItem}
                onPress={() => toggleTrustPurpose(option.value)}
              >
                <Ionicons
                  name={
                    formData.trustPurpose.includes(option.value)
                      ? 'checkbox'
                      : 'square-outline'
                  }
                  size={24}
                  color={formData.trustPurpose.includes(option.value) ? '#1890ff' : '#d9d9d9'}
                />
                <Text style={styles.checkboxLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>其他目的说明</Text>
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder="请详细说明您的信托目的和需求"
            value={formData.customPurpose}
            onChangeText={text => updateFormData({ customPurpose: text })}
            multiline
            numberOfLines={3}
          />

          {/* 家庭情况 */}
          <Text style={styles.formSubtitle}>家庭情况</Text>

          <Text style={styles.formLabel}>家庭成员数量</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入家庭成员数量"
            value={formData.familyMembers > 0 ? formData.familyMembers.toString() : ''}
            onChangeText={text => updateFormData({ familyMembers: parseInt(text) || 0 })}
            keyboardType="numeric"
          />

          <Text style={styles.formLabel}>预期受益人数量</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入预期受益人数量"
            value={
              formData.beneficiariesCount > 0 ? formData.beneficiariesCount.toString() : ''
            }
            onChangeText={text => updateFormData({ beneficiariesCount: parseInt(text) || 0 })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.checkboxItem}
            onPress={() =>
              updateFormData({ hasComplexInheritance: !formData.hasComplexInheritance })
            }
          >
            <Ionicons
              name={formData.hasComplexInheritance ? 'checkbox' : 'square-outline'}
              size={24}
              color={formData.hasComplexInheritance ? '#1890ff' : '#d9d9d9'}
            />
            <Text style={styles.checkboxLabel}>家庭结构复杂（如再婚、多子女等）</Text>
          </TouchableOpacity>

          {/* 其他需求 */}
          <Text style={styles.formSubtitle}>其他需求</Text>

          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder="请说明您的其他需求或想了解的问题"
            value={formData.otherRequirements}
            onChangeText={text => updateFormData({ otherRequirements: text })}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* 合作机构 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>合作信托机构</Text>

        <View style={styles.partnerCard}>
          <View style={styles.partnerHeader}>
            <Ionicons name="business" size={32} color="#1890ff" />
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>XX信托有限公司</Text>
              <Text style={styles.partnerDescription}>国内领先的家族信托服务机构</Text>
            </View>
          </View>
          <Text style={styles.partnerDetail}>
            • 管理资产规模超过1000亿元{'\n'}
            • 服务高净值客户超过5000户{'\n'}
            • 专业信托管理团队100+人
          </Text>
        </View>

        <View style={styles.partnerCard}>
          <View style={styles.partnerHeader}>
            <Ionicons name="business" size={32} color="#1890ff" />
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>XX财富管理公司</Text>
              <Text style={styles.partnerDescription}>专注于高净值人群财富管理</Text>
            </View>
          </View>
          <Text style={styles.partnerDetail}>
            • 20年财富管理经验{'\n'}
            • 提供定制化信托方案{'\n'}
            • 全球化资产配置服务
          </Text>
        </View>
      </View>

      {/* 服务流程 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>服务流程</Text>

        <View style={styles.processCard}>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>1</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>提交申请</Text>
              <Text style={styles.processDescription}>填写咨询申请表</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>2</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>专家沟通</Text>
              <Text style={styles.processDescription}>信托顾问1对1沟通需求</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>3</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>方案设计</Text>
              <Text style={styles.processDescription}>定制专属信托方案</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>4</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>签约设立</Text>
              <Text style={styles.processDescription}>签署信托合同，完成设立</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>5</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>持续管理</Text>
              <Text style={styles.processDescription}>信托财产专业管理与运营</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 提交按钮 */}
      <View style={styles.submitSection}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>提交咨询申请</Text>
        </TouchableOpacity>

        <View style={styles.privacyNotice}>
          <Ionicons name="lock-closed-outline" size={16} color="#999" />
          <Text style={styles.privacyText}>
            您的信息将被严格保密，仅用于信托咨询服务
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 32,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  targetCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
  },
  targetItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  formSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  optionButtonTextSelected: {
    color: '#1890ff',
    fontWeight: '600',
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  partnerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  partnerDescription: {
    fontSize: 13,
    color: '#666',
  },
  partnerDetail: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  processCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  processNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  processContent: {
    flex: 1,
    marginLeft: 12,
  },
  processTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  processDescription: {
    fontSize: 13,
    color: '#666',
  },
  submitSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#1890ff',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});

export default FamilyTrustInquiryScreen;
