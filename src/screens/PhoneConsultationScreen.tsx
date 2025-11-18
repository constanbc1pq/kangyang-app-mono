/**
 * ============================================================================
 * 电话咨询预约页面 - PhoneConsultationScreen
 * ============================================================================
 *
 * Phase 33.5: 电话咨询
 *
 * 【功能概述】
 * - 预约律师电话咨询服务
 * - 选择合适的时间段进行深度沟通
 *
 * 【主要功能】
 * 1. 选择时间段：展示律师可用时段
 * 2. 问题简述：输入咨询主题
 * 3. 支付与预约确认：确认订单并支付
 * 4. 电话接通提醒：预约成功后提醒
 * 5. 通话时长统计：记录咨询时长
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
import { COLORS } from '@/constants/app';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
    };
  };
}

// 时间段类型
interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
}

// 预约状态
type BookingStatus = 'selecting' | 'confirming' | 'paying' | 'booked';

const PhoneConsultationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyerId } = route.params;

  // 状态管理
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<BookingStatus>('selecting');

  // 日期和时间段
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // 表单数据
  const [phoneNumber, setPhoneNumber] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

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

  // 生成未来7天的可选日期
  const generateAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    setAvailableDates(dates);
    setSelectedDate(dates[0]);
  };

  // 生成指定日期的时间段
  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = [];
    const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00'];

    hours.forEach((hour, index) => {
      const endHour = hours[index + 1] || '21:00';
      const isAvailable = Math.random() > 0.3; // 模拟70%可用

      slots.push({
        id: `${date}_${hour}`,
        date,
        startTime: hour,
        endTime: endHour,
        available: isAvailable,
      });
    });

    setTimeSlots(slots);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateStr = dateString.split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === todayStr) {
      return `今天 ${date.getMonth() + 1}/${date.getDate()}`;
    } else if (dateStr === tomorrowStr) {
      return `明天 ${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return `${weekdays[date.getDay()]} ${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 提交预约
  const handleSubmitBooking = () => {
    if (!selectedTimeSlot) {
      Alert.alert('提示', '请选择咨询时间');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    if (phoneNumber.length !== 11) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    if (!topic.trim()) {
      Alert.alert('提示', '请输入咨询主题');
      return;
    }

    setStatus('confirming');
  };

  // 确认支付
  const handleConfirmPayment = () => {
    setStatus('paying');

    // 模拟支付过程
    setTimeout(() => {
      setStatus('booked');
      Alert.alert(
        '预约成功',
        `您已成功预约${lawyer?.name}律师的电话咨询\n\n咨询时间：${formatDate(selectedTimeSlot!.date)} ${selectedTimeSlot!.startTime}\n\n律师将准时致电您预留的手机号码`,
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

  // 渲染日期选择器
  const renderDateSelector = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>选择日期</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {availableDates.map(date => {
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
      </View>
    );
  };

  // 渲染时间段选择器
  const renderTimeSlotSelector = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>选择时间段</Text>
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map(slot => {
            const isSelected = selectedTimeSlot?.id === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlotCard,
                  !slot.available && styles.timeSlotCardDisabled,
                  isSelected && styles.timeSlotCardSelected,
                ]}
                onPress={() => {
                  if (slot.available) {
                    setSelectedTimeSlot(slot);
                  }
                }}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    !slot.available && styles.timeSlotTextDisabled,
                    isSelected && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot.startTime}
                </Text>
                {!slot.available && <Text style={styles.unavailableText}>已约</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.timeSlotsLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>可预约</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f0f0f0' }]} />
            <Text style={styles.legendText}>已约满</Text>
          </View>
        </View>
      </View>
    );
  };

  // 渲染表单
  const renderForm = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>咨询信息</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>手机号码 *</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入您的手机号"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={11}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Text style={styles.formHint}>律师将通过此号码与您联系</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>咨询主题 *</Text>
          <TextInput
            style={styles.input}
            placeholder="如：遗嘱继承纠纷"
            placeholderTextColor="#999"
            maxLength={50}
            value={topic}
            onChangeText={setTopic}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>问题描述（选填）</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="简要描述您的问题，方便律师提前了解（选填）"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </View>
    );
  };

  // 渲染价格信息
  const renderPriceInfo = () => {
    if (!lawyer) return null;

    return (
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>咨询时长</Text>
          <Text style={styles.priceValue}>30分钟</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>咨询费用</Text>
          <Text style={styles.priceAmount}>¥{lawyer.phoneConsultationPrice}</Text>
        </View>

        <View style={styles.priceNotes}>
          <View style={styles.priceNote}>
            <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
            <Text style={styles.priceNoteText}>律师准时致电</Text>
          </View>
          <View style={styles.priceNote}>
            <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
            <Text style={styles.priceNoteText}>专业法律建议</Text>
          </View>
          <View style={styles.priceNote}>
            <Ionicons name="checkmark-circle" size={16} color="#52c41a" />
            <Text style={styles.priceNoteText}>通话记录留存</Text>
          </View>
        </View>
      </View>
    );
  };

  // 渲染确认页面
  const renderConfirmation = () => {
    if (!lawyer || !selectedTimeSlot) return null;

    return (
      <ScrollView style={styles.confirmationContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>确认预约信息</Text>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>律师</Text>
            <Text style={styles.confirmationValue}>{lawyer.name}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>时间</Text>
            <Text style={styles.confirmationValue}>
              {formatDate(selectedTimeSlot.date)} {selectedTimeSlot.startTime}
            </Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>手机号</Text>
            <Text style={styles.confirmationValue}>{phoneNumber}</Text>
          </View>

          <View style={styles.confirmationItem}>
            <Text style={styles.confirmationLabel}>主题</Text>
            <Text style={styles.confirmationValue}>{topic}</Text>
          </View>

          {description && (
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>描述</Text>
              <Text style={styles.confirmationValue}>{description}</Text>
            </View>
          )}

          <View style={styles.confirmationDivider} />

          <View style={styles.confirmationTotal}>
            <Text style={styles.confirmationTotalLabel}>应付金额</Text>
            <Text style={styles.confirmationTotalAmount}>¥{lawyer.phoneConsultationPrice}</Text>
          </View>
        </View>

        <View style={styles.confirmationButtons}>
          <TouchableOpacity
            style={styles.confirmationBackButton}
            onPress={() => setStatus('selecting')}
          >
            <Text style={styles.confirmationBackButtonText}>返回修改</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmationPayButton}
            onPress={handleConfirmPayment}
          >
            <Text style={styles.confirmationPayButtonText}>确认支付</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 渲染支付中状态
  const renderPaying = () => {
    return (
      <View style={styles.payingContainer}>
        <ActivityIndicator size="large" color="COLORS.primary" />
        <Text style={styles.payingText}>支付处理中...</Text>
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
          <Text style={styles.headerTitle}>电话咨询</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="COLORS.primary" />
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
              setStatus('selecting');
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>预约电话咨询</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 内容区域 */}
      {status === 'selecting' && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 律师信息 */}
          <View style={styles.lawyerInfo}>
            <Text style={styles.lawyerName}>{lawyer?.name}</Text>
            <Text style={styles.lawyerFirm}>{lawyer?.lawFirm}</Text>
          </View>

          {/* 日期选择 */}
          {renderDateSelector()}

          {/* 时间段选择 */}
          {renderTimeSlotSelector()}

          {/* 表单 */}
          {renderForm()}

          {/* 价格信息 */}
          {renderPriceInfo()}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {status === 'confirming' && renderConfirmation()}
      {status === 'paying' && renderPaying()}

      {/* 底部按钮 */}
      {status === 'selecting' && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPriceInfo}>
            <Text style={styles.bottomPriceLabel}>总计</Text>
            <Text style={styles.bottomPriceAmount}>¥{lawyer?.phoneConsultationPrice}</Text>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitBooking}>
            <Text style={styles.submitButtonText}>提交预约</Text>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  dateScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dateCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  dateCardSelected: {
    backgroundColor: '#f3e5f5',
    borderColor: COLORS.primary,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dateTextSelected: {
    color: COLORS.primary,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlotCard: {
    width: '22%',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  timeSlotCardDisabled: {
    backgroundColor: '#fafafa',
    opacity: 0.5,
  },
  timeSlotCardSelected: {
    backgroundColor: '#f3e5f5',
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timeSlotTextDisabled: {
    color: '#999',
  },
  timeSlotTextSelected: {
    color: COLORS.primary,
  },
  unavailableText: {
    fontSize: 10,
    color: '#ff4d4f',
    marginTop: 2,
  },
  timeSlotsLegend: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
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
  formHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  priceSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 15,
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  priceNotes: {
    marginTop: 16,
    gap: 8,
  },
  priceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceNoteText: {
    fontSize: 13,
    color: '#666',
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
    backgroundColor: COLORS.primary,
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
    color: '#333',
    fontWeight: '600',
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
  confirmationPayButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    alignItems: 'center',
  },
  confirmationPayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  payingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default PhoneConsultationScreen;
