/**
 * ============================================================================
 * 上门服务申请页面 - HomeServiceRequestScreen
 * ============================================================================
 *
 * Phase 33.6: 上门服务
 *
 * 【功能概述】
 * - 申请律师上门提供法律服务
 * - 适合行动不便的老年人
 *
 * 【主要功能】
 * 1. 地址填写：详细地址、联系方式
 * 2. 预约时间选择：选择合适的上门时间
 * 3. 服务内容说明：选择服务类型和需求
 * 4. 价格预估：根据服务内容计算费用
 * 5. 律师确认与上门：律师确认后上门服务
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
import { LawyerProfile } from '../types/legalService';
import { getLawyerById } from '../services/legalService';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
    };
  };
}

// 服务类型
const SERVICE_TYPES = [
  { id: 'will_drafting', label: '遗嘱起草', icon: 'document-text', basePrice: 500 },
  { id: 'contract_review', label: '合同审查', icon: 'document', basePrice: 300 },
  { id: 'legal_consultation', label: '法律咨询', icon: 'chatbubbles', basePrice: 0 }, // 基础价格
  { id: 'notarization', label: '公证见证', icon: 'checkmark-done', basePrice: 800 },
  { id: 'property_planning', label: '财产规划', icon: 'briefcase', basePrice: 1000 },
  { id: 'dispute_mediation', label: '纠纷调解', icon: 'people', basePrice: 600 },
];

// 时间段
interface TimeSlot {
  id: string;
  date: string;
  period: '上午' | '下午' | '晚上';
  timeRange: string;
  available: boolean;
}

// 申请状态
type RequestStatus = 'filling' | 'confirming' | 'submitting' | 'submitted';

const HomeServiceRequestScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyerId } = route.params;

  // 状态管理
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<RequestStatus>('filling');

  // 表单数据
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [serviceDescription, setServiceDescription] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // 可选日期和时段
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    loadLawyerInfo();
    generateAvailableDates();
  }, [lawyerId]);

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadLawyerInfo = async () => {
    try {
      setLoading(true);
      const data = await getLawyerById(lawyerId);
      if (data) {
        setLawyer(data);
      } else {
        Alert.alert('错误', '律师信息加载失败');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading lawyer:', error);
      Alert.alert('错误', '律师信息加载失败');
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();

    // 生成未来14天
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    setAvailableDates(dates);
  };

  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = [
      {
        id: `${date}_morning`,
        date,
        period: '上午',
        timeRange: '09:00-12:00',
        available: Math.random() > 0.4,
      },
      {
        id: `${date}_afternoon`,
        date,
        period: '下午',
        timeRange: '14:00-17:00',
        available: Math.random() > 0.3,
      },
      {
        id: `${date}_evening`,
        date,
        period: '晚上',
        timeRange: '19:00-21:00',
        available: Math.random() > 0.5,
      },
    ];

    setTimeSlots(slots);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
  };

  // 切换服务选择
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // 计算总价
  const calculateTotalPrice = (): number => {
    if (!lawyer) return 0;

    let basePrice = lawyer.homeVisitPrice; // 基础上门费
    let servicePrice = 0;

    selectedServices.forEach(serviceId => {
      const service = SERVICE_TYPES.find(s => s.id === serviceId);
      if (service) {
        servicePrice += service.basePrice;
      }
    });

    return basePrice + servicePrice;
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (selectedServices.length === 0) {
      Alert.alert('提示', '请选择服务类型');
      return false;
    }

    if (!contactName.trim()) {
      Alert.alert('提示', '请输入联系人姓名');
      return false;
    }

    if (!contactPhone.trim() || contactPhone.length !== 11) {
      Alert.alert('提示', '请输入正确的联系电话');
      return false;
    }

    if (!province.trim() || !city.trim() || !detailAddress.trim()) {
      Alert.alert('提示', '请填写完整地址');
      return false;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert('提示', '请选择上门时间');
      return false;
    }

    if (!serviceDescription.trim()) {
      Alert.alert('提示', '请描述您的服务需求');
      return false;
    }

    return true;
  };

  // 提交申请
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setStatus('confirming');
  };

  // 确认提交
  const handleConfirmSubmit = () => {
    setStatus('submitting');

    // 模拟提交
    setTimeout(() => {
      setStatus('submitted');
      Alert.alert(
        '申请成功',
        `您的上门服务申请已提交\n\n律师将在24小时内与您联系确认具体时间\n\n上门地址：${province}${city}${district}${detailAddress}\n预约时间：${formatDate(selectedDate)} ${selectedTime?.period}`,
        [
          {
            text: '查看订单',
            onPress: () => navigation.navigate('ConsultationHistory'),
          },
          {
            text: '确定',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  // 渲染服务选择
  const renderServiceSelection = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>服务类型 *</Text>
        <Text style={styles.sectionHint}>可多选，价格会累加</Text>

        <View style={styles.servicesGrid}>
          {SERVICE_TYPES.map(service => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                onPress={() => toggleService(service.id)}
              >
                <Ionicons
                  name={service.icon as any}
                  size={32}
                  color={isSelected ? '#1890ff' : '#999'}
                />
                <Text style={[styles.serviceLabel, isSelected && styles.serviceLabelSelected]}>
                  {service.label}
                </Text>
                {service.basePrice > 0 && (
                  <Text style={[styles.servicePrice, isSelected && styles.servicePriceSelected]}>
                    +¥{service.basePrice}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // 渲染地址填写
  const renderAddressForm = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>上门地址 *</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>联系人</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入联系人姓名"
            placeholderTextColor="#999"
            value={contactName}
            onChangeText={setContactName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>联系电话</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入联系电话"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={11}
            value={contactPhone}
            onChangeText={setContactPhone}
          />
        </View>

        <View style={styles.addressRow}>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="省份"
            placeholderTextColor="#999"
            value={province}
            onChangeText={setProvince}
          />
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="城市"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="区县"
            placeholderTextColor="#999"
            value={district}
            onChangeText={setDistrict}
          />
        </View>

        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="详细地址（街道、门牌号等）"
            placeholderTextColor="#999"
            value={detailAddress}
            onChangeText={setDetailAddress}
          />
        </View>
      </View>
    );
  };

  // 渲染时间选择
  const renderTimeSelection = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>预约时间 *</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {availableDates.slice(0, 7).map(date => {
            const isSelected = date === selectedDate;
            return (
              <TouchableOpacity
                key={date}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedDate && (
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map(slot => {
              const isSelected = selectedTime?.id === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.timeSlotDisabled,
                    isSelected && styles.timeSlotSelected,
                  ]}
                  onPress={() => {
                    if (slot.available) {
                      setSelectedTime(slot);
                    }
                  }}
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.timePeriod,
                      !slot.available && styles.timePeriodDisabled,
                      isSelected && styles.timePeriodSelected,
                    ]}
                  >
                    {slot.period}
                  </Text>
                  <Text
                    style={[
                      styles.timeRange,
                      !slot.available && styles.timeRangeDisabled,
                      isSelected && styles.timeRangeSelected,
                    ]}
                  >
                    {slot.timeRange}
                  </Text>
                  {!slot.available && <Text style={styles.unavailableLabel}>不可用</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  // 渲染需求描述
  const renderDescriptionForm = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>服务需求 *</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>需求描述</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请详细描述您的服务需求，方便律师提前准备"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            value={serviceDescription}
            onChangeText={setServiceDescription}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>特殊要求（选填）</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="如：需要带公证设备、携带相关法律文件等"
            placeholderTextColor="#999"
            multiline
            maxLength={300}
            value={specialRequirements}
            onChangeText={setSpecialRequirements}
          />
        </View>
      </View>
    );
  };

  // 渲染价格预估
  const renderPriceEstimate = () => {
    if (!lawyer) return null;

    const totalPrice = calculateTotalPrice();

    return (
      <View style={styles.priceSection}>
        <Text style={styles.sectionTitle}>费用预估</Text>

        <View style={styles.priceItem}>
          <Text style={styles.priceItemLabel}>上门服务费</Text>
          <Text style={styles.priceItemValue}>¥{lawyer.homeVisitPrice}</Text>
        </View>

        {selectedServices.map(serviceId => {
          const service = SERVICE_TYPES.find(s => s.id === serviceId);
          if (!service || service.basePrice === 0) return null;
          return (
            <View key={serviceId} style={styles.priceItem}>
              <Text style={styles.priceItemLabel}>{service.label}</Text>
              <Text style={styles.priceItemValue}>¥{service.basePrice}</Text>
            </View>
          );
        })}

        <View style={styles.priceDivider} />

        <View style={styles.priceTotal}>
          <Text style={styles.priceTotalLabel}>预估总计</Text>
          <Text style={styles.priceTotalValue}>¥{totalPrice}</Text>
        </View>

        <Text style={styles.priceNote}>
          * 最终费用以律师确认为准，可能根据实际服务内容调整
        </Text>
      </View>
    );
  };

  // 渲染确认页面
  const renderConfirmation = () => {
    if (!lawyer) return null;

    const fullAddress = `${province}${city}${district}${detailAddress}`;
    const selectedServiceNames = SERVICE_TYPES.filter(s => selectedServices.includes(s.id))
      .map(s => s.label)
      .join('、');

    return (
      <ScrollView style={styles.confirmationContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>确认服务申请</Text>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>律师</Text>
            <Text style={styles.confirmationValue}>{lawyer.name}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>服务类型</Text>
            <Text style={styles.confirmationValue}>{selectedServiceNames}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>联系人</Text>
            <Text style={styles.confirmationValue}>{contactName} {contactPhone}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>上门地址</Text>
            <Text style={styles.confirmationValue}>{fullAddress}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>预约时间</Text>
            <Text style={styles.confirmationValue}>
              {formatDate(selectedDate)} {selectedTime?.period} {selectedTime?.timeRange}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>服务需求</Text>
            <Text style={styles.confirmationValue}>{serviceDescription}</Text>
          </View>

          {specialRequirements && (
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>特殊要求</Text>
              <Text style={styles.confirmationValue}>{specialRequirements}</Text>
            </View>
          )}

          <View style={styles.confirmationDivider} />

          <View style={styles.confirmationTotal}>
            <Text style={styles.confirmationTotalLabel}>预估费用</Text>
            <Text style={styles.confirmationTotalAmount}>¥{calculateTotalPrice()}</Text>
          </View>
        </View>

        <View style={styles.confirmationButtons}>
          <TouchableOpacity
            style={styles.confirmationBackButton}
            onPress={() => setStatus('filling')}
          >
            <Text style={styles.confirmationBackButtonText}>返回修改</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmationSubmitButton}
            onPress={handleConfirmSubmit}
          >
            <Text style={styles.confirmationSubmitButtonText}>确认提交</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>上门服务</Text>
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
        <TouchableOpacity
          onPress={() => {
            if (status === 'confirming') {
              setStatus('filling');
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>申请上门服务</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 内容 */}
      {status === 'filling' && (
        <>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 律师信息 */}
            <View style={styles.lawyerInfo}>
              <Text style={styles.lawyerName}>{lawyer?.name}</Text>
              <Text style={styles.lawyerFirm}>{lawyer?.lawFirm}</Text>
            </View>

            {/* 服务选择 */}
            {renderServiceSelection()}

            {/* 地址填写 */}
            {renderAddressForm()}

            {/* 时间选择 */}
            {renderTimeSelection()}

            {/* 需求描述 */}
            {renderDescriptionForm()}

            {/* 价格预估 */}
            {renderPriceEstimate()}

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomPriceInfo}>
              <Text style={styles.bottomPriceLabel}>预估总计</Text>
              <Text style={styles.bottomPriceAmount}>¥{calculateTotalPrice()}</Text>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>提交申请</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {status === 'confirming' && renderConfirmation()}

      {status === 'submitting' && (
        <View style={styles.submittingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.submittingText}>提交中...</Text>
        </View>
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
  lawyerInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  lawyerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lawyerFirm: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47%',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  serviceCardSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 8,
  },
  serviceLabelSelected: {
    color: '#1890ff',
  },
  servicePrice: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  servicePriceSelected: {
    color: '#1890ff',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  addressInput: {
    flex: 1,
  },
  dateScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  dateCardSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  dateTextSelected: {
    color: '#1890ff',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeSlot: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  timeSlotDisabled: {
    opacity: 0.5,
  },
  timeSlotSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  timePeriod: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  timePeriodDisabled: {
    color: '#999',
  },
  timePeriodSelected: {
    color: '#1890ff',
  },
  timeRange: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  timeRangeDisabled: {
    color: '#999',
  },
  timeRangeSelected: {
    color: '#1890ff',
  },
  unavailableLabel: {
    fontSize: 11,
    color: '#ff4d4f',
    marginTop: 4,
  },
  priceSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceItemLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceItemValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  priceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  priceNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    lineHeight: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomPriceInfo: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 13,
    color: '#666',
  },
  bottomPriceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  submitButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    backgroundColor: '#1890ff',
    borderRadius: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  confirmationContainer: {
    flex: 1,
    padding: 16,
  },
  confirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  confirmationLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
  },
  confirmationValue: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  confirmationTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmationTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  confirmationTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationBackButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    alignItems: 'center',
  },
  confirmationBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmationSubmitButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#1890ff',
    borderRadius: 24,
    alignItems: 'center',
  },
  confirmationSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  submittingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeServiceRequestScreen;
