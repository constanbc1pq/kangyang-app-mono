/**
 * 遗嘱执行指引页面
 * 提供遗嘱执行流程说明和律师代办服务
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const WillExecutionGuideScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    phone: '',
    relationship: '',
    deceasedName: '',
    notes: '',
  });

  const handleRequestService = () => {
    if (!serviceForm.name || !serviceForm.phone || !serviceForm.deceasedName) {
      Alert.alert('提示', '请填写必填信息');
      return;
    }

    Alert.alert(
      '提交成功',
      '我们已收到您的申请，律师将在24小时内与您联系',
      [{ text: '确定', onPress: () => setShowServiceForm(false) }]
    );

    // TODO: 调用后端API提交服务申请
  };

  const handleCallHotline = () => {
    Alert.alert(
      '遗嘱执行咨询热线',
      '400-XXX-XXXX\n\n服务时间：周一至周日 9:00-18:00',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '拨打',
          onPress: () => {
            // Linking.openURL('tel:400XXXXXXX');
            Alert.alert('提示', '拨号功能仅在真实设备上可用');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部说明卡片 */}
      <View style={styles.headerCard}>
        <Ionicons name="document-lock-outline" size={48} color="#1890ff" />
        <Text style={styles.headerTitle}>遗嘱执行服务</Text>
        <Text style={styles.headerDescription}>
          当遗嘱需要执行时，我们提供专业的法律支持和代办服务
        </Text>
      </View>

      {/* 执行流程 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>遗嘱执行流程</Text>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>确认遗嘱有效性</Text>
            <Text style={styles.stepDescription}>
              • 核实遗嘱的真实性和合法性{'\n'}
              • 确认遗嘱未被撤销或变更{'\n'}
              • 检查遗嘱是否符合法律要求
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>通知相关方</Text>
            <Text style={styles.stepDescription}>
              • 通知所有受益人{'\n'}
              • 通知遗嘱执行人{'\n'}
              • 通知法定继承人
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>财产清点与评估</Text>
            <Text style={styles.stepDescription}>
              • 清点遗产范围{'\n'}
              • 评估财产价值{'\n'}
              • 核实债权债务
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>办理继承手续</Text>
            <Text style={styles.stepDescription}>
              • 申请继承权公证{'\n'}
              • 办理房产过户{'\n'}
              • 办理存款、证券等转移手续
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>财产分配</Text>
            <Text style={styles.stepDescription}>
              • 按照遗嘱内容分配财产{'\n'}
              • 处理特殊条款要求{'\n'}
              • 完成财产交付
            </Text>
          </View>
        </View>
      </View>

      {/* 所需材料 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>办理继承所需材料</Text>

        <View style={styles.materialCard}>
          <View style={styles.materialCategory}>
            <Text style={styles.materialCategoryTitle}>基础材料</Text>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>死亡证明</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>遗嘱原件</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>立遗嘱人身份证明</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>继承人身份证明</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>亲属关系证明</Text>
            </View>
          </View>

          <View style={styles.materialCategory}>
            <Text style={styles.materialCategoryTitle}>财产相关材料</Text>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>房产证/不动产权证</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>银行存款证明</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>股票、基金账户证明</Text>
            </View>
            <View style={styles.materialItem}>
              <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
              <Text style={styles.materialText}>其他财产证明材料</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 常见问题 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>常见问题</Text>

        <View style={styles.faqCard}>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 遗嘱执行需要多长时间？</Text>
            <Text style={styles.faqAnswer}>
              A: 一般情况下，简单的遗嘱执行需要3-6个月。如涉及复杂财产或纠纷，可能需要更长时间。
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 遗嘱执行人有什么职责？</Text>
            <Text style={styles.faqAnswer}>
              A: 执行人负责管理遗产、清偿债务、按遗嘱分配财产、处理相关法律事务等。
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 继承需要缴纳税费吗？</Text>
            <Text style={styles.faqAnswer}>
              A: 目前我国没有遗产税。但办理继承可能涉及公证费、过户费等费用。
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: 如果有人对遗嘱提出异议怎么办？</Text>
            <Text style={styles.faqAnswer}>
              A: 可以先尝试协商解决。如协商不成，需要通过法院诉讼解决。建议咨询专业律师。
            </Text>
          </View>
        </View>
      </View>

      {/* 律师代办服务 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>律师代办服务</Text>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceDescription}>
            我们提供专业的遗嘱执行代办服务，由经验丰富的律师全程协助办理继承手续
          </Text>

          <View style={styles.serviceFeatures}>
            <View style={styles.serviceFeature}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#1890ff" />
              <Text style={styles.serviceFeatureText}>材料准备指导</Text>
            </View>
            <View style={styles.serviceFeature}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#1890ff" />
              <Text style={styles.serviceFeatureText}>公证手续代办</Text>
            </View>
            <View style={styles.serviceFeature}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#1890ff" />
              <Text style={styles.serviceFeatureText}>房产过户办理</Text>
            </View>
            <View style={styles.serviceFeature}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#1890ff" />
              <Text style={styles.serviceFeatureText}>纠纷调解处理</Text>
            </View>
            <View style={styles.serviceFeature}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#1890ff" />
              <Text style={styles.serviceFeatureText}>全程法律咨询</Text>
            </View>
          </View>

          <View style={styles.servicePricing}>
            <Text style={styles.servicePriceLabel}>服务费用</Text>
            <Text style={styles.servicePriceValue}>¥5,000 起</Text>
            <Text style={styles.servicePriceNote}>根据案件复杂程度确定</Text>
          </View>

          {!showServiceForm ? (
            <TouchableOpacity
              style={styles.serviceButton}
              onPress={() => setShowServiceForm(true)}
            >
              <Text style={styles.serviceButtonText}>申请律师代办</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.serviceForm}>
              <Text style={styles.formTitle}>填写申请信息</Text>

              <Text style={styles.formLabel}>您的姓名 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入您的姓名"
                value={serviceForm.name}
                onChangeText={text => setServiceForm({ ...serviceForm, name: text })}
              />

              <Text style={styles.formLabel}>联系电话 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入联系电话"
                value={serviceForm.phone}
                onChangeText={text => setServiceForm({ ...serviceForm, phone: text })}
                keyboardType="phone-pad"
              />

              <Text style={styles.formLabel}>与逝者关系 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="例如：子女、配偶等"
                value={serviceForm.relationship}
                onChangeText={text => setServiceForm({ ...serviceForm, relationship: text })}
              />

              <Text style={styles.formLabel}>逝者姓名 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入逝者姓名"
                value={serviceForm.deceasedName}
                onChangeText={text => setServiceForm({ ...serviceForm, deceasedName: text })}
              />

              <Text style={styles.formLabel}>其他说明</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="请简要说明情况"
                value={serviceForm.notes}
                onChangeText={text => setServiceForm({ ...serviceForm, notes: text })}
                multiline
                numberOfLines={4}
              />

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.formCancelButton}
                  onPress={() => setShowServiceForm(false)}
                >
                  <Text style={styles.formCancelButtonText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.formSubmitButton}
                  onPress={handleRequestService}
                >
                  <Text style={styles.formSubmitButtonText}>提交申请</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 咨询热线 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.hotlineCard} onPress={handleCallHotline}>
          <Ionicons name="call-outline" size={24} color="#1890ff" />
          <View style={styles.hotlineContent}>
            <Text style={styles.hotlineTitle}>遗嘱执行咨询热线</Text>
            <Text style={styles.hotlineNumber}>400-XXX-XXXX</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* 法律提示 */}
      <View style={styles.legalNotice}>
        <Ionicons name="information-circle-outline" size={20} color="#1890ff" />
        <View style={styles.legalNoticeContent}>
          <Text style={styles.legalNoticeTitle}>重要提示</Text>
          <Text style={styles.legalNoticeText}>
            1. 遗嘱执行应当严格按照遗嘱内容进行{'\n'}
            2. 如遇纠纷，建议及时寻求专业法律帮助{'\n'}
            3. 遗嘱执行人应当勤勉尽责，妥善管理遗产{'\n'}
            4. 继承涉及的税费和手续以当地规定为准
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
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  materialCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  materialCategory: {
    marginBottom: 16,
  },
  materialCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  materialText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  faqCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
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
  serviceCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceFeatures: {
    marginBottom: 16,
  },
  serviceFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceFeatureText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
  },
  servicePricing: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  servicePriceLabel: {
    fontSize: 13,
    color: '#666',
  },
  servicePriceValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1890ff',
    marginVertical: 8,
  },
  servicePriceNote: {
    fontSize: 12,
    color: '#999',
  },
  serviceButton: {
    backgroundColor: '#1890ff',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  serviceButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  serviceForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
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
    height: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  formCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  formCancelButtonText: {
    fontSize: 14,
    color: '#666',
  },
  formSubmitButton: {
    flex: 2,
    backgroundColor: '#1890ff',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  formSubmitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  hotlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
  },
  hotlineContent: {
    flex: 1,
    marginLeft: 12,
  },
  hotlineTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hotlineNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1890ff',
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
});

export default WillExecutionGuideScreen;
