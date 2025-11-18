/**
 * 数据确认页面
 * 显示OCR识别结果，允许用户编辑确认
 */

import React, { useState } from 'react';
import { View, Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Check, X, AlertCircle, Calendar, Edit2 } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { DeviceType } from '@/types/common';
import {
  ParsedDeviceData,
  ParsedField,
  getFieldDisplayName,
  formatFieldValue,
  isAbnormalValue,
  getHealthAdvice,
  getDeviceTypeDisplayName,
  getFieldRangeDescription,
} from '@/services/deviceDataParser';

interface DataConfirmationScreenProps {
  navigation: any;
  route: {
    params: {
      parsedData: ParsedDeviceData;
      imageUri: string;
      deviceId: string;
      deviceName: string;
      onDataConfirmed: (data: ConfirmedData) => void;
    };
  };
}

export interface ConfirmedData {
  deviceType: DeviceType;
  fields: Record<string, ParsedField>;
  timestamp: string;
  imageUri?: string;
}

export const DataConfirmationScreen: React.FC<DataConfirmationScreenProps> = ({
  navigation,
  route,
}) => {
  const { parsedData, imageUri, deviceId, deviceName, onDataConfirmed } = route.params;

  const [editableFields, setEditableFields] = useState<Record<string, ParsedField>>(
    parsedData.fields
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /**
   * 处理字段值编辑
   */
  const handleFieldEdit = (field: string, newValue: string) => {
    const numValue = parseFloat(newValue);
    if (isNaN(numValue)) return;

    setEditableFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: numValue,
      },
    }));
  };

  /**
   * 处理日期选择
   */
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  /**
   * 确认保存数据
   */
  const handleConfirm = async () => {
    try {
      setSaving(true);

      // 构造确认的数据
      const confirmedData: ConfirmedData = {
        deviceType: parsedData.deviceType,
        fields: editableFields,
        timestamp: selectedDate.toISOString(),
        imageUri,
      };

      // 调用回调函数
      await onDataConfirmed(confirmedData);

      Alert.alert('保存成功', '数据已保存', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('保存数据失败:', error);
      Alert.alert('保存失败', '请重试');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 重新拍摄
   */
  const handleRetake = () => {
    Alert.alert('重新拍摄', '是否放弃当前识别结果并重新拍摄？', [
      { text: '取消', style: 'cancel' },
      {
        text: '重新拍摄',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  /**
   * 渲染可编辑字段
   */
  const renderEditableField = (field: string, data: ParsedField) => {
    const displayName = getFieldDisplayName(field);
    const isAbnormal = typeof data.value === 'number' && isAbnormalValue(parsedData.deviceType, field, data.value);
    const healthAdvice = typeof data.value === 'number' ? getHealthAdvice(parsedData.deviceType, field, data.value) : '';
    const isEditing = editingField === field;
    const rangeDesc = getFieldRangeDescription(parsedData.deviceType, field);

    return (
      <View key={field} marginBottom="$3">
        <XStack
          padding="$3"
          borderRadius="$3"
          backgroundColor={isAbnormal ? `${COLORS.error}10` : '$surface'}
          borderWidth={1}
          borderColor={isAbnormal ? COLORS.error : '$borderColor'}
        >
          <YStack flex={1} space="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                {displayName}
              </Text>
              {rangeDesc && (
                <Text fontSize="$2" color="$textSecondary">
                  正常范围: {rangeDesc}
                </Text>
              )}
            </XStack>

            {isEditing ? (
              <XStack alignItems="center" space="$2">
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(data.value)}
                  onChangeText={(text) => handleFieldEdit(field, text)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                />
                <Text fontSize="$5" fontWeight="600" color="$text">
                  {data.unit}
                </Text>
              </XStack>
            ) : (
              <Pressable onPress={() => setEditingField(field)}>
                <XStack alignItems="center" space="$2">
                  <Text fontSize="$6" fontWeight="700" color={isAbnormal ? COLORS.error : '$text'}>
                    {formatFieldValue(data.value, data.unit)}
                  </Text>
                  <Edit2 size={16} color={COLORS.textSecondary} />
                </XStack>
              </Pressable>
            )}

            {isAbnormal && healthAdvice && (
              <XStack alignItems="center" space="$2" marginTop="$1">
                <AlertCircle size={14} color={COLORS.error} />
                <Text fontSize="$2" color={COLORS.error}>
                  {healthAdvice}
                </Text>
              </XStack>
            )}
          </YStack>
        </XStack>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        padding="$4"
        backgroundColor="white"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={handleRetake}>
          <XStack alignItems="center" space="$2">
            <X size={24} color={COLORS.text} />
            <Text fontSize="$4" color="$text">
              取消
            </Text>
          </XStack>
        </Pressable>

        <Text fontSize="$5" fontWeight="600" color="$text">
          确认数据
        </Text>

        <Pressable onPress={handleConfirm} disabled={saving}>
          <XStack alignItems="center" space="$2">
            <Text fontSize="$4" color={COLORS.primary} fontWeight="600">
              {saving ? '保存中...' : '保存'}
            </Text>
            {!saving && <Check size={24} color={COLORS.primary} />}
          </XStack>
        </Pressable>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" space="$4">
          {/* 设备信息 */}
          <View
            backgroundColor="white"
            padding="$4"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
              设备信息
            </Text>
            <Text fontSize="$5" fontWeight="600" color="$text">
              {deviceName}
            </Text>
            <Text fontSize="$3" color="$textSecondary" marginTop="$1">
              {getDeviceTypeDisplayName(parsedData.deviceType)}
            </Text>
          </View>

          {/* 识别到的数据 */}
          <View>
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              📊 识别到的数据
            </Text>

            {Object.entries(editableFields).map(([field, data]) =>
              renderEditableField(field, data)
            )}

            {parsedData.errors.length > 0 && (
              <View
                backgroundColor={`${COLORS.warning}15`}
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor={COLORS.warning}
                marginTop="$2"
              >
                <XStack alignItems="flex-start" space="$2">
                  <AlertCircle size={16} color={COLORS.warning} style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                      识别提示
                    </Text>
                    {parsedData.errors.map((error, index) => (
                      <Text key={index} fontSize="$2" color={COLORS.warning} marginTop="$1">
                        • {error}
                    </Text>
                    ))}
                  </YStack>
                </XStack>
              </View>
            )}

            <Text fontSize="$2" color="$textSecondary" marginTop="$3">
              💡 点击数值可以修改
            </Text>
          </View>

          {/* 测量时间 */}
          <View>
            <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
              📅 测量时间
            </Text>

            <Pressable onPress={() => setShowDatePicker(true)}>
              <XStack
                padding="$3"
                borderRadius="$3"
                backgroundColor="$surface"
                borderWidth={1}
                borderColor="$borderColor"
                alignItems="center"
                space="$3"
              >
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={COLORS.primary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Calendar size={20} color="white" />
                </View>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {selectedDate.toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                    {selectedDate.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </YStack>
                <Text fontSize="$3" color={COLORS.primary}>
                  修改
                </Text>
              </XStack>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* 提示信息 */}
          <View
            backgroundColor="$background"
            padding="$3"
            borderRadius="$3"
            marginTop="$2"
          >
            <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
              ⚠️ 请确认数据准确性：
            </Text>
            <Text fontSize="$2" color="$textSecondary" lineHeight={18} marginTop="$1">
              • 自动识别可能存在误差，请仔细核对
            </Text>
            <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
              • 异常数值会有红色提示，建议咨询医生
            </Text>
            <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
              • 数据不准确时可点击编辑修改
            </Text>
          </View>

          {/* 底部操作按钮 */}
          <YStack space="$3" marginTop="$4" marginBottom="$8">
            <Pressable onPress={handleConfirm} disabled={saving}>
              <View
                padding="$4"
                borderRadius="$3"
                backgroundColor={saving ? COLORS.borderColor : COLORS.primary}
                alignItems="center"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text fontSize="$4" fontWeight="600" color="white">
                    ✅ 确认保存
                  </Text>
                )}
              </View>
            </Pressable>

            <Pressable onPress={handleRetake}>
              <View
                padding="$4"
                borderRadius="$3"
                backgroundColor="$borderColor"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$textSecondary">
                  🔄 重新拍摄
                </Text>
              </View>
            </Pressable>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});
