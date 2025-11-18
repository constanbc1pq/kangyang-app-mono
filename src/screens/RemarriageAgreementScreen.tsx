/**
 * 再婚财产协议页面
 * 为再婚人士提供婚前财产协议起草服务
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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface PremaritalAsset {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  owner: 'self' | 'partner';
}

interface InheritanceArrangement {
  id: string;
  assetDescription: string;
  beneficiary: string;
  relationship: string;
  conditions?: string;
}

interface AgreementFormData {
  // 基本信息
  selfName: string;
  selfIdNumber: string;
  partnerName: string;
  partnerIdNumber: string;

  // 婚前财产
  premaritalAssets: PremaritalAsset[];

  // 婚后财产约定
  postnuptialProperty: {
    separateProperty: boolean; // 完全分离
    partialSeparation: boolean; // 部分分离
    jointProperty: boolean; // 完全共同
    customArrangement: string; // 自定义
  };

  // 债务约定
  debtArrangement: {
    premaritalDebtSeparate: boolean; // 婚前债务各自承担
    postnuptialDebtJoint: boolean; // 婚后债务共同承担
    customDebtClause: string;
  };

  // 继承安排
  inheritanceArrangements: InheritanceArrangement[];

  // 其他条款
  specialClauses: string[];
}

const RemarriageAgreementScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AgreementFormData>({
    selfName: '',
    selfIdNumber: '',
    partnerName: '',
    partnerIdNumber: '',
    premaritalAssets: [],
    postnuptialProperty: {
      separateProperty: false,
      partialSeparation: false,
      jointProperty: false,
      customArrangement: '',
    },
    debtArrangement: {
      premaritalDebtSeparate: true,
      postnuptialDebtJoint: false,
      customDebtClause: '',
    },
    inheritanceArrangements: [],
    specialClauses: [],
  });

  // 临时输入
  const [assetInput, setAssetInput] = useState({
    type: '',
    description: '',
    estimatedValue: '',
    owner: 'self' as 'self' | 'partner',
  });

  const [inheritanceInput, setInheritanceInput] = useState({
    assetDescription: '',
    beneficiary: '',
    relationship: '',
    conditions: '',
  });

  const [clauseInput, setClauseInput] = useState('');

  const totalSteps = 5;
  const stepTitles = ['基本信息', '婚前财产', '婚后财产约定', '继承安排', '确认提交'];

  const updateFormData = (updates: Partial<AgreementFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // 添加婚前财产
  const addPremaritalAsset = () => {
    if (!assetInput.type || !assetInput.description || !assetInput.estimatedValue) {
      Alert.alert('提示', '请填写完整的财产信息');
      return;
    }

    const newAsset: PremaritalAsset = {
      id: `asset_${Date.now()}`,
      type: assetInput.type,
      description: assetInput.description,
      estimatedValue: parseFloat(assetInput.estimatedValue),
      owner: assetInput.owner,
    };

    updateFormData({ premaritalAssets: [...formData.premaritalAssets, newAsset] });

    setAssetInput({
      type: '',
      description: '',
      estimatedValue: '',
      owner: 'self',
    });
  };

  // 删除婚前财产
  const removePremaritalAsset = (id: string) => {
    const newAssets = formData.premaritalAssets.filter(a => a.id !== id);
    updateFormData({ premaritalAssets: newAssets });
  };

  // 添加继承安排
  const addInheritanceArrangement = () => {
    if (!inheritanceInput.assetDescription || !inheritanceInput.beneficiary) {
      Alert.alert('提示', '请填写资产描述和受益人');
      return;
    }

    const newArrangement: InheritanceArrangement = {
      id: `inheritance_${Date.now()}`,
      assetDescription: inheritanceInput.assetDescription,
      beneficiary: inheritanceInput.beneficiary,
      relationship: inheritanceInput.relationship,
      conditions: inheritanceInput.conditions,
    };

    updateFormData({
      inheritanceArrangements: [...formData.inheritanceArrangements, newArrangement],
    });

    setInheritanceInput({
      assetDescription: '',
      beneficiary: '',
      relationship: '',
      conditions: '',
    });
  };

  // 删除继承安排
  const removeInheritanceArrangement = (id: string) => {
    const newArrangements = formData.inheritanceArrangements.filter(a => a.id !== id);
    updateFormData({ inheritanceArrangements: newArrangements });
  };

  // 添加特殊条款
  const addSpecialClause = () => {
    if (!clauseInput.trim()) {
      Alert.alert('提示', '请输入条款内容');
      return;
    }

    updateFormData({ specialClauses: [...formData.specialClauses, clauseInput.trim()] });
    setClauseInput('');
  };

  // 删除特殊条款
  const removeSpecialClause = (index: number) => {
    const newClauses = formData.specialClauses.filter((_, i) => i !== index);
    updateFormData({ specialClauses: newClauses });
  };

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (
          !formData.selfName ||
          !formData.selfIdNumber ||
          !formData.partnerName ||
          !formData.partnerIdNumber
        ) {
          Alert.alert('提示', '请填写双方基本信息');
          return false;
        }
        break;
      case 2:
        if (formData.premaritalAssets.length === 0) {
          Alert.alert('提示', '请至少添加一项婚前财产（如无财产可在描述中说明）');
          return false;
        }
        break;
      case 3:
        if (
          !formData.postnuptialProperty.separateProperty &&
          !formData.postnuptialProperty.partialSeparation &&
          !formData.postnuptialProperty.jointProperty &&
          !formData.postnuptialProperty.customArrangement
        ) {
          Alert.alert('提示', '请选择婚后财产约定方式');
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

  // 提交申请律师起草服务
  const handleSubmit = () => {
    Alert.alert(
      '申请律师服务',
      '您的财产协议草稿已保存。是否申请专业律师定制化起草服务？\n\n服务费用：¥2,000-5,000（根据复杂程度）',
      [
        {
          text: '稍后再说',
          onPress: () => {
            Alert.alert('提示', '协议草稿已保存，您可以随时申请律师服务');
            navigation.goBack();
          },
        },
        {
          text: '申请服务',
          onPress: () => {
            // TODO: 跳转到律师服务申请页面
            Alert.alert('成功', '您的申请已提交，律师将在24小时内与您联系');
            navigation.goBack();
          },
        },
      ]
    );
  };

  // 渲染步骤1：基本信息
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>双方基本信息</Text>
      <Text style={styles.stepDescription}>
        请填写准确的身份信息，以确保协议的法律效力
      </Text>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#1890ff" />
        <Text style={styles.infoText}>
          婚前财产协议需要双方自愿签订，建议在婚姻登记前完成公证
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionSubtitle}>您的信息</Text>

        <Text style={styles.inputLabel}>您的姓名 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入您的姓名"
          value={formData.selfName}
          onChangeText={text => updateFormData({ selfName: text })}
        />

        <Text style={styles.inputLabel}>身份证号 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入身份证号"
          value={formData.selfIdNumber}
          onChangeText={text => updateFormData({ selfIdNumber: text })}
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionSubtitle}>对方信息</Text>

        <Text style={styles.inputLabel}>对方姓名 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入对方姓名"
          value={formData.partnerName}
          onChangeText={text => updateFormData({ partnerName: text })}
        />

        <Text style={styles.inputLabel}>对方身份证号 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入对方身份证号"
          value={formData.partnerIdNumber}
          onChangeText={text => updateFormData({ partnerIdNumber: text })}
        />
      </View>
    </View>
  );

  // 渲染步骤2：婚前财产
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>婚前财产登记</Text>
      <Text style={styles.stepDescription}>
        请详细列出双方的婚前财产，包括房产、存款、车辆等
      </Text>

      {/* 已添加的财产列表 */}
      {formData.premaritalAssets.map(asset => (
        <View key={asset.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <View style={styles.listItemHeader}>
              <Text style={styles.listItemTitle}>{asset.type}</Text>
              <View
                style={[
                  styles.ownerBadge,
                  { backgroundColor: asset.owner === 'self' ? '#e6f7ff' : '#fff7e6' },
                ]}
              >
                <Text
                  style={[
                    styles.ownerBadgeText,
                    { color: asset.owner === 'self' ? '#1890ff' : '#faad14' },
                  ]}
                >
                  {asset.owner === 'self' ? '己方' : '对方'}
                </Text>
              </View>
            </View>
            <Text style={styles.listItemDescription}>{asset.description}</Text>
            <Text style={styles.listItemValue}>
              估值：¥{asset.estimatedValue.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removePremaritalAsset(asset.id)}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      ))}

      {/* 添加财产表单 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>归属</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              assetInput.owner === 'self' && styles.radioButtonSelected,
            ]}
            onPress={() => setAssetInput({ ...assetInput, owner: 'self' })}
          >
            <Text
              style={[
                styles.radioButtonText,
                assetInput.owner === 'self' && styles.radioButtonTextSelected,
              ]}
            >
              己方财产
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              assetInput.owner === 'partner' && styles.radioButtonSelected,
            ]}
            onPress={() => setAssetInput({ ...assetInput, owner: 'partner' })}
          >
            <Text
              style={[
                styles.radioButtonText,
                assetInput.owner === 'partner' && styles.radioButtonTextSelected,
              ]}
            >
              对方财产
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>财产类型 *</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：房产、车辆、存款、股票等"
          value={assetInput.type}
          onChangeText={text => setAssetInput({ ...assetInput, type: text })}
        />

        <Text style={styles.inputLabel}>详细描述 *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="例如：北京市朝阳区xx小区3室2厅住宅，产权证号xxxxxx"
          value={assetInput.description}
          onChangeText={text => setAssetInput({ ...assetInput, description: text })}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.inputLabel}>估值（元）*</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入估计价值"
          value={assetInput.estimatedValue}
          onChangeText={text => setAssetInput({ ...assetInput, estimatedValue: text })}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addButton} onPress={addPremaritalAsset}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加财产</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={20} color="#faad14" />
        <Text style={styles.tipText}>
          提示：建议提供财产证明文件（房产证、存款证明、车辆登记证等），以便律师起草更准确的协议
        </Text>
      </View>
    </View>
  );

  // 渲染步骤3：婚后财产约定
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>婚后财产约定</Text>
      <Text style={styles.stepDescription}>
        请选择婚后财产的归属方式
      </Text>

      <View style={styles.switchSection}>
        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>完全分离制</Text>
            <Text style={styles.switchDescription}>
              婚后各自的收入和财产归各自所有，互不共有
            </Text>
          </View>
          <Switch
            value={formData.postnuptialProperty.separateProperty}
            onValueChange={value =>
              updateFormData({
                postnuptialProperty: {
                  ...formData.postnuptialProperty,
                  separateProperty: value,
                  partialSeparation: false,
                  jointProperty: false,
                },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#91d5ff' }}
            thumbColor={formData.postnuptialProperty.separateProperty ? '#1890ff' : '#f4f4f4'}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>部分分离制</Text>
            <Text style={styles.switchDescription}>
              约定部分财产分离，其余按法定共同财产处理
            </Text>
          </View>
          <Switch
            value={formData.postnuptialProperty.partialSeparation}
            onValueChange={value =>
              updateFormData({
                postnuptialProperty: {
                  ...formData.postnuptialProperty,
                  separateProperty: false,
                  partialSeparation: value,
                  jointProperty: false,
                },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#91d5ff' }}
            thumbColor={formData.postnuptialProperty.partialSeparation ? '#1890ff' : '#f4f4f4'}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>完全共同制</Text>
            <Text style={styles.switchDescription}>
              婚后所有收入和财产均为夫妻共同财产
            </Text>
          </View>
          <Switch
            value={formData.postnuptialProperty.jointProperty}
            onValueChange={value =>
              updateFormData({
                postnuptialProperty: {
                  ...formData.postnuptialProperty,
                  separateProperty: false,
                  partialSeparation: false,
                  jointProperty: value,
                },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#91d5ff' }}
            thumbColor={formData.postnuptialProperty.jointProperty ? '#1890ff' : '#f4f4f4'}
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>自定义约定</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="如有特殊约定，请在此详细说明"
          value={formData.postnuptialProperty.customArrangement}
          onChangeText={text =>
            updateFormData({
              postnuptialProperty: {
                ...formData.postnuptialProperty,
                customArrangement: text,
              },
            })
          }
          multiline
          numberOfLines={4}
        />
      </View>

      {/* 债务约定 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>债务约定</Text>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>婚前债务各自承担</Text>
            <Text style={styles.switchDescription}>
              各自婚前的债务由各自承担，不涉及对方
            </Text>
          </View>
          <Switch
            value={formData.debtArrangement.premaritalDebtSeparate}
            onValueChange={value =>
              updateFormData({
                debtArrangement: {
                  ...formData.debtArrangement,
                  premaritalDebtSeparate: value,
                },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#91d5ff' }}
            thumbColor={formData.debtArrangement.premaritalDebtSeparate ? '#1890ff' : '#f4f4f4'}
          />
        </View>

        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>婚后债务共同承担</Text>
            <Text style={styles.switchDescription}>
              婚后产生的债务由双方共同承担
            </Text>
          </View>
          <Switch
            value={formData.debtArrangement.postnuptialDebtJoint}
            onValueChange={value =>
              updateFormData({
                debtArrangement: {
                  ...formData.debtArrangement,
                  postnuptialDebtJoint: value,
                },
              })
            }
            trackColor={{ false: '#d9d9d9', true: '#91d5ff' }}
            thumbColor={formData.debtArrangement.postnuptialDebtJoint ? '#1890ff' : '#f4f4f4'}
          />
        </View>

        <Text style={styles.inputLabel}>其他债务约定</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="如有特殊债务约定，请在此说明"
          value={formData.debtArrangement.customDebtClause}
          onChangeText={text =>
            updateFormData({
              debtArrangement: {
                ...formData.debtArrangement,
                customDebtClause: text,
              },
            })
          }
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  // 渲染步骤4：继承安排
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>继承安排设置</Text>
      <Text style={styles.stepDescription}>
        再婚家庭建议明确继承安排，保护各自子女的权益
      </Text>

      {/* 已添加的继承安排 */}
      {formData.inheritanceArrangements.map(arrangement => (
        <View key={arrangement.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{arrangement.assetDescription}</Text>
            <Text style={styles.listItemDescription}>
              受益人：{arrangement.beneficiary}（{arrangement.relationship}）
            </Text>
            {arrangement.conditions && (
              <Text style={styles.listItemDetail}>条件：{arrangement.conditions}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => removeInheritanceArrangement(arrangement.id)}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      ))}

      {/* 添加继承安排表单 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>财产描述 *</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：本人名下的xx房产"
          value={inheritanceInput.assetDescription}
          onChangeText={text =>
            setInheritanceInput({ ...inheritanceInput, assetDescription: text })
          }
        />

        <Text style={styles.inputLabel}>受益人 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入受益人姓名"
          value={inheritanceInput.beneficiary}
          onChangeText={text => setInheritanceInput({ ...inheritanceInput, beneficiary: text })}
        />

        <Text style={styles.inputLabel}>与您的关系 *</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：子女、父母、兄弟姐妹"
          value={inheritanceInput.relationship}
          onChangeText={text =>
            setInheritanceInput({ ...inheritanceInput, relationship: text })
          }
        />

        <Text style={styles.inputLabel}>继承条件（可选）</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="例如：在配偶去世后继承"
          value={inheritanceInput.conditions}
          onChangeText={text => setInheritanceInput({ ...inheritanceInput, conditions: text })}
          multiline
          numberOfLines={2}
        />

        <TouchableOpacity style={styles.addButton} onPress={addInheritanceArrangement}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加继承安排</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#1890ff" />
        <Text style={styles.infoText}>
          继承安排可以避免再婚家庭的财产纠纷，保护各自子女的合法权益
        </Text>
      </View>
    </View>
  );

  // 渲染步骤5：确认提交
  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>确认信息</Text>
      <Text style={styles.stepDescription}>
        请确认以下信息，确认无误后可申请律师定制化起草服务
      </Text>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>协议摘要</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>甲方：</Text>
          <Text style={styles.summaryText}>{formData.selfName}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>乙方：</Text>
          <Text style={styles.summaryText}>{formData.partnerName}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>婚前财产：</Text>
          <Text style={styles.summaryText}>{formData.premaritalAssets.length} 项</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>婚后财产约定：</Text>
          <Text style={styles.summaryText}>
            {formData.postnuptialProperty.separateProperty && '完全分离制'}
            {formData.postnuptialProperty.partialSeparation && '部分分离制'}
            {formData.postnuptialProperty.jointProperty && '完全共同制'}
            {formData.postnuptialProperty.customArrangement && '自定义约定'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>继承安排：</Text>
          <Text style={styles.summaryText}>
            {formData.inheritanceArrangements.length} 项
          </Text>
        </View>
      </View>

      {/* 其他特殊条款 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他特殊条款（可选）</Text>

        {formData.specialClauses.map((clause, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemDescription}>{clause}</Text>
            </View>
            <TouchableOpacity onPress={() => removeSpecialClause(index)}>
              <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
            </TouchableOpacity>
          </View>
        ))}

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="例如：房产增值部分的归属、子女抚养费约定等"
          value={clauseInput}
          onChangeText={setClauseInput}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.addButton} onPress={addSpecialClause}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加条款</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.warningCard}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#52c41a" />
        <Text style={styles.warningText}>
          建议委托专业律师起草正式协议，并在婚姻登记前完成公证，以确保协议的法律效力
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
    <View style={styles.container}>
      {/* 顶部进度条 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#333" />
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
            {currentStep === totalSteps ? '申请律师服务' : '下一步'}
          </Text>
          {currentStep < totalSteps && <Ionicons name="chevron-forward" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#1890ff',
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
    backgroundColor: '#e6f7ff',
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
    backgroundColor: '#f6ffed',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#52c41a',
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
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#666',
  },
  radioButtonTextSelected: {
    color: '#1890ff',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1890ff',
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
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  ownerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
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
  listItemValue: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: '600',
  },
  switchSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
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
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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
    backgroundColor: '#1890ff',
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

export default RemarriageAgreementScreen;
