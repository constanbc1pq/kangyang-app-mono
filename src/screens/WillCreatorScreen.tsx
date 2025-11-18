/**
 * 遗嘱制作向导页面
 * 6步智能问答式遗嘱创建流程
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  WillType,
  WillStatus,
  Estate,
  Beneficiary,
  Witness,
} from '../types/legalService';
import { createWill } from '../services/legalService';
import { COLORS } from '@/constants/app';

interface WillFormData {
  // Step 1: 遗嘱类型
  willType: WillType | null;

  // Step 2: 财产清单
  estates: Estate[];

  // Step 3: 受益人
  beneficiaries: Beneficiary[];

  // Step 4: 特殊条款
  specialClauses: string[];

  // Step 5: 遗嘱执行人
  executor: string;
  executorIdNumber: string;
  executorPhone: string;

  // Step 6: 基本信息
  title: string;
  testatorName: string;
  testatorIdNumber: string;
  testatorAge: number;
}

const WillCreatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WillFormData>({
    willType: null,
    estates: [],
    beneficiaries: [],
    specialClauses: [],
    executor: '',
    executorIdNumber: '',
    executorPhone: '',
    title: '',
    testatorName: '',
    testatorIdNumber: '',
    testatorAge: 0,
  });

  // 临时输入状态
  const [estateInput, setEstateInput] = useState({
    type: 'real_estate' as Estate['type'],
    description: '',
    location: '',
    estimatedValue: '',
  });

  const [beneficiaryInput, setBeneficiaryInput] = useState({
    name: '',
    relationship: '',
    idNumber: '',
    share: '',
  });

  const [clauseInput, setClauseInput] = useState('');

  const totalSteps = 6;

  // 步骤标题
  const stepTitles = [
    '选择遗嘱类型',
    '财产清单',
    '受益人指定',
    '特殊条款',
    '遗嘱执行人',
    '确认信息',
  ];

  // 更新表单数据
  const updateFormData = (updates: Partial<WillFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // 添加财产项
  const addEstate = () => {
    if (!estateInput.description || !estateInput.estimatedValue) {
      Alert.alert('提示', '请填写完整的财产信息');
      return;
    }

    const newEstate: Estate = {
      type: estateInput.type,
      description: estateInput.description,
      location: estateInput.location,
      estimatedValue: parseFloat(estateInput.estimatedValue),
      documentNumber: '',
    };

    updateFormData({ estates: [...formData.estates, newEstate] });

    // 重置输入
    setEstateInput({
      type: 'real_estate',
      description: '',
      location: '',
      estimatedValue: '',
    });
  };

  // 删除财产项
  const removeEstate = (index: number) => {
    const newEstates = formData.estates.filter((_, i) => i !== index);
    updateFormData({ estates: newEstates });
  };

  // 添加受益人
  const addBeneficiary = () => {
    if (!beneficiaryInput.name || !beneficiaryInput.relationship || !beneficiaryInput.share) {
      Alert.alert('提示', '请填写完整的受益人信息');
      return;
    }

    const newBeneficiary: Beneficiary = {
      name: beneficiaryInput.name,
      relationship: beneficiaryInput.relationship,
      idNumber: beneficiaryInput.idNumber,
      share: beneficiaryInput.share,
      phone: '',
      address: '',
    };

    updateFormData({ beneficiaries: [...formData.beneficiaries, newBeneficiary] });

    // 重置输入
    setBeneficiaryInput({
      name: '',
      relationship: '',
      idNumber: '',
      share: '',
    });
  };

  // 删除受益人
  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = formData.beneficiaries.filter((_, i) => i !== index);
    updateFormData({ beneficiaries: newBeneficiaries });
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
  const removeClause = (index: number) => {
    const newClauses = formData.specialClauses.filter((_, i) => i !== index);
    updateFormData({ specialClauses: newClauses });
  };

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.willType) {
          Alert.alert('提示', '请选择遗嘱类型');
          return false;
        }
        break;
      case 2:
        if (formData.estates.length === 0) {
          Alert.alert('提示', '请至少添加一项财产');
          return false;
        }
        break;
      case 3:
        if (formData.beneficiaries.length === 0) {
          Alert.alert('提示', '请至少指定一位受益人');
          return false;
        }
        break;
      case 5:
        if (!formData.executor) {
          Alert.alert('提示', '请指定遗嘱执行人');
          return false;
        }
        break;
      case 6:
        if (!formData.testatorName || !formData.testatorIdNumber) {
          Alert.alert('提示', '请填写立遗嘱人信息');
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

  // 提交遗嘱
  const handleSubmit = async () => {
    try {
      const willData = {
        userId: 'current_user_id', // TODO: 从用户状态获取
        type: formData.willType!,
        status: WillStatus.DRAFT,
        title: formData.title || '我的遗嘱',
        testatorName: formData.testatorName,
        testatorIdNumber: formData.testatorIdNumber,
        testatorAge: formData.testatorAge,
        estates: formData.estates,
        beneficiaries: formData.beneficiaries,
        executor: formData.executor,
        specialClauses: formData.specialClauses.length > 0 ? formData.specialClauses : undefined,
        version: 1,
      };

      await createWill(willData);

      Alert.alert(
        '创建成功',
        '遗嘱草稿已保存，建议您咨询律师进行审核。',
        [
          {
            text: '查看遗嘱',
            onPress: () => navigation.navigate('MyWills' as never),
          },
          {
            text: '返回首页',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '创建遗嘱失败，请重试');
      console.error('Error creating will:', error);
    }
  };

  // 渲染步骤1：选择遗嘱类型
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>请选择遗嘱类型</Text>
      <Text style={styles.stepDescription}>
        不同类型的遗嘱有不同的法律要求和效力
      </Text>

      <TouchableOpacity
        style={[
          styles.optionCard,
          formData.willType === WillType.SELF_WRITTEN && styles.optionCardSelected,
        ]}
        onPress={() => updateFormData({ willType: WillType.SELF_WRITTEN })}
      >
        <View style={styles.optionHeader}>
          <Ionicons
            name="create-outline"
            size={24}
            color={formData.willType === WillType.SELF_WRITTEN ? COLORS.primary : '#666'}
          />
          <Text style={styles.optionTitle}>自书遗嘱</Text>
          {formData.willType === WillType.SELF_WRITTEN && (
            <Ionicons name="checkmark-circle" size={24} color="COLORS.primary" />
          )}
        </View>
        <Text style={styles.optionDescription}>
          由立遗嘱人亲笔书写、签名并注明日期。成本低，但需注意书写规范。
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          formData.willType === WillType.WITNESSED && styles.optionCardSelected,
        ]}
        onPress={() => updateFormData({ willType: WillType.WITNESSED })}
      >
        <View style={styles.optionHeader}>
          <Ionicons
            name="people-outline"
            size={24}
            color={formData.willType === WillType.WITNESSED ? COLORS.primary : '#666'}
          />
          <Text style={styles.optionTitle}>代书遗嘱</Text>
          {formData.willType === WillType.WITNESSED && (
            <Ionicons name="checkmark-circle" size={24} color="COLORS.primary" />
          )}
        </View>
        <Text style={styles.optionDescription}>
          由他人代写，需要两名以上见证人在场见证。适合不便书写的情况。
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          formData.willType === WillType.NOTARIZED && styles.optionCardSelected,
        ]}
        onPress={() => updateFormData({ willType: WillType.NOTARIZED })}
      >
        <View style={styles.optionHeader}>
          <Ionicons
            name="shield-checkmark-outline"
            size={24}
            color={formData.willType === WillType.NOTARIZED ? COLORS.primary : '#666'}
          />
          <Text style={styles.optionTitle}>公证遗嘱</Text>
          {formData.willType === WillType.NOTARIZED && (
            <Ionicons name="checkmark-circle" size={24} color="COLORS.primary" />
          )}
        </View>
        <Text style={styles.optionDescription}>
          经公证机关公证的遗嘱，法律效力最高，但需支付公证费用。
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          formData.willType === WillType.AUDIO_VIDEO && styles.optionCardSelected,
        ]}
        onPress={() => updateFormData({ willType: WillType.AUDIO_VIDEO })}
      >
        <View style={styles.optionHeader}>
          <Ionicons
            name="videocam-outline"
            size={24}
            color={formData.willType === WillType.AUDIO_VIDEO ? COLORS.primary : '#666'}
          />
          <Text style={styles.optionTitle}>录音录像遗嘱</Text>
          {formData.willType === WillType.AUDIO_VIDEO && (
            <Ionicons name="checkmark-circle" size={24} color="COLORS.primary" />
          )}
        </View>
        <Text style={styles.optionDescription}>
          以录音或录像方式订立，需有两名以上见证人在场，并记录日期和见证人信息。
        </Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染步骤2：财产清单
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>财产清单</Text>
      <Text style={styles.stepDescription}>
        请详细列出您的财产，包括房产、存款、股票等
      </Text>

      {/* 已添加的财产列表 */}
      {formData.estates.map((estate, index) => (
        <View key={index} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>
              {estate.type === 'real_estate' && '房产'}
              {estate.type === 'bank_deposit' && '银行存款'}
              {estate.type === 'securities' && '股票证券'}
              {estate.type === 'vehicle' && '车辆'}
              {estate.type === 'other' && '其他财产'}
            </Text>
            <Text style={styles.listItemDescription}>{estate.description}</Text>
            {estate.location && (
              <Text style={styles.listItemDetail}>位置：{estate.location}</Text>
            )}
            <Text style={styles.listItemDetail}>
              估值：¥{estate.estimatedValue.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeEstate(index)}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      ))}

      {/* 添加财产表单 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>财产类型</Text>
        <View style={styles.radioGroup}>
          {[
            { value: 'real_estate', label: '房产' },
            { value: 'bank_deposit', label: '存款' },
            { value: 'securities', label: '股票' },
            { value: 'vehicle', label: '车辆' },
            { value: 'other', label: '其他' },
          ].map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.radioButton,
                estateInput.type === option.value && styles.radioButtonSelected,
              ]}
              onPress={() => setEstateInput({ ...estateInput, type: option.value as Estate['type'] })}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  estateInput.type === option.value && styles.radioButtonTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>财产描述</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：北京市朝阳区xx小区xx号楼xx单元"
          value={estateInput.description}
          onChangeText={text => setEstateInput({ ...estateInput, description: text })}
        />

        <Text style={styles.inputLabel}>位置/账号</Text>
        <TextInput
          style={styles.input}
          placeholder="房产地址或银行账号等"
          value={estateInput.location}
          onChangeText={text => setEstateInput({ ...estateInput, location: text })}
        />

        <Text style={styles.inputLabel}>估值（元）</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入估计价值"
          value={estateInput.estimatedValue}
          onChangeText={text => setEstateInput({ ...estateInput, estimatedValue: text })}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addButton} onPress={addEstate}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加财产</Text>
        </TouchableOpacity>
      </View>

      {formData.estates.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>财产总计</Text>
          <Text style={styles.summaryValue}>
            ¥
            {formData.estates
              .reduce((sum, estate) => sum + estate.estimatedValue, 0)
              .toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );

  // 渲染步骤3：受益人指定
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>受益人指定</Text>
      <Text style={styles.stepDescription}>
        请指定财产的受益人及其继承份额
      </Text>

      {/* 已添加的受益人列表 */}
      {formData.beneficiaries.map((beneficiary, index) => (
        <View key={index} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{beneficiary.name}</Text>
            <Text style={styles.listItemDescription}>
              关系：{beneficiary.relationship}
            </Text>
            {beneficiary.idNumber && (
              <Text style={styles.listItemDetail}>身份证：{beneficiary.idNumber}</Text>
            )}
            <Text style={styles.listItemDetail}>继承份额：{beneficiary.share}</Text>
          </View>
          <TouchableOpacity onPress={() => removeBeneficiary(index)}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      ))}

      {/* 添加受益人表单 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>受益人姓名 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入姓名"
          value={beneficiaryInput.name}
          onChangeText={text => setBeneficiaryInput({ ...beneficiaryInput, name: text })}
        />

        <Text style={styles.inputLabel}>与您的关系 *</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：配偶、子女、孙辈等"
          value={beneficiaryInput.relationship}
          onChangeText={text =>
            setBeneficiaryInput({ ...beneficiaryInput, relationship: text })
          }
        />

        <Text style={styles.inputLabel}>身份证号</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入身份证号"
          value={beneficiaryInput.idNumber}
          onChangeText={text => setBeneficiaryInput({ ...beneficiaryInput, idNumber: text })}
        />

        <Text style={styles.inputLabel}>继承份额 *</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：全部财产的1/2、房产的1/3等"
          value={beneficiaryInput.share}
          onChangeText={text => setBeneficiaryInput({ ...beneficiaryInput, share: text })}
        />

        <TouchableOpacity style={styles.addButton} onPress={addBeneficiary}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加受益人</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染步骤4：特殊条款
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>特殊条款设置</Text>
      <Text style={styles.stepDescription}>
        您可以设置附条件继承、特定物品归属等特殊条款（可选）
      </Text>

      {/* 已添加的条款列表 */}
      {formData.specialClauses.map((clause, index) => (
        <View key={index} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemDescription}>{clause}</Text>
          </View>
          <TouchableOpacity onPress={() => removeClause(index)}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      ))}

      {/* 条款示例 */}
      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>常见条款示例：</Text>
        <Text style={styles.exampleItem}>
          • 房产由长子继承，但需照顾母亲至其百年归老
        </Text>
        <Text style={styles.exampleItem}>
          • 股票收益优先用于孙辈教育支出
        </Text>
        <Text style={styles.exampleItem}>
          • 特定古董字画由次女继承
        </Text>
        <Text style={styles.exampleItem}>
          • 若受益人先于我过世，其份额由其子女继承
        </Text>
      </View>

      {/* 添加条款表单 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>条款内容</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="请输入特殊条款内容"
          value={clauseInput}
          onChangeText={setClauseInput}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.addButton} onPress={addSpecialClause}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加条款</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => setCurrentStep(currentStep + 1)}
      >
        <Text style={styles.skipButtonText}>跳过此步骤</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染步骤5：遗嘱执行人
  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>遗嘱执行人指定</Text>
      <Text style={styles.stepDescription}>
        遗嘱执行人负责按照遗嘱内容分配财产，建议选择信任的亲友或专业律师
      </Text>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>执行人姓名 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入执行人姓名"
          value={formData.executor}
          onChangeText={text => updateFormData({ executor: text })}
        />

        <Text style={styles.inputLabel}>身份证号 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入身份证号"
          value={formData.executorIdNumber}
          onChangeText={text => updateFormData({ executorIdNumber: text })}
        />

        <Text style={styles.inputLabel}>联系电话 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入联系电话"
          value={formData.executorPhone}
          onChangeText={text => updateFormData({ executorPhone: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="information-circle-outline" size={20} color="COLORS.primary" />
        <Text style={styles.tipText}>
          执行人的职责包括：办理继承手续、分配财产、处理债务等。请务必与执行人沟通，确保其知晓并同意担任此职。
        </Text>
      </View>
    </View>
  );

  // 渲染步骤6：确认信息
  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>确认信息</Text>
      <Text style={styles.stepDescription}>
        请填写立遗嘱人信息并确认所有内容
      </Text>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>遗嘱标题</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：我的遗嘱"
          value={formData.title}
          onChangeText={text => updateFormData({ title: text })}
        />

        <Text style={styles.inputLabel}>立遗嘱人姓名 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入您的姓名"
          value={formData.testatorName}
          onChangeText={text => updateFormData({ testatorName: text })}
        />

        <Text style={styles.inputLabel}>身份证号 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入身份证号"
          value={formData.testatorIdNumber}
          onChangeText={text => updateFormData({ testatorIdNumber: text })}
        />

        <Text style={styles.inputLabel}>年龄 *</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入年龄"
          value={formData.testatorAge > 0 ? formData.testatorAge.toString() : ''}
          onChangeText={text => updateFormData({ testatorAge: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      {/* 信息摘要 */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>遗嘱摘要</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>遗嘱类型：</Text>
          <Text style={styles.summaryText}>
            {formData.willType === WillType.SELF_WRITTEN && '自书遗嘱'}
            {formData.willType === WillType.WITNESSED && '代书遗嘱'}
            {formData.willType === WillType.NOTARIZED && '公证遗嘱'}
            {formData.willType === WillType.AUDIO_VIDEO && '录音录像遗嘱'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>财产项目：</Text>
          <Text style={styles.summaryText}>{formData.estates.length} 项</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>受益人：</Text>
          <Text style={styles.summaryText}>{formData.beneficiaries.length} 位</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>特殊条款：</Text>
          <Text style={styles.summaryText}>{formData.specialClauses.length} 条</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>执行人：</Text>
          <Text style={styles.summaryText}>{formData.executor}</Text>
        </View>
      </View>

      <View style={styles.warningCard}>
        <Ionicons name="warning-outline" size={20} color="#faad14" />
        <Text style={styles.warningText}>
          遗嘱草稿保存后，强烈建议您咨询专业律师进行审核，以确保遗嘱的法律效力。
        </Text>
      </View>
    </View>
  );

  // 渲染当前步骤内容
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
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 顶部进度指示器 */}
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
            {currentStep === totalSteps ? '生成遗嘱' : '下一步'}
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
    backgroundColor: COLORS.primary,
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
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e8e8e8',
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 32,
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
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    marginRight: 8,
    marginBottom: 8,
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
    color: COLORS.primary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
  },
  exampleCard: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#faad14',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exampleItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  skipButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 16,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f3e5f5',
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
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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
    width: 100,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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

export default WillCreatorScreen;
