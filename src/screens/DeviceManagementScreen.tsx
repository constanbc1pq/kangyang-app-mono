import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { View, Text, ScrollView, YStack, XStack, Theme, Card, Progress, Input, useTheme } from 'tamagui';
import { useToastController } from '@tamagui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  Bluetooth,
  Wifi,
  Battery,
  BatteryLow,
  BatteryFull,
  Settings,
  Trash2,
  Activity,
  Watch,
  Heart,
  Scale,
  Thermometer,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Edit,
  Camera,
  Upload,
  Droplet,
  FlaskConical,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceLimit } from '@/hooks/useMembershipBenefit';
import { getDevices, addDevice, deleteDevice as deleteDeviceService } from '@/services/userDataService';
import { HealthDevice, DeviceEvent } from '@/types/userData';
import { ImagePickerModal } from '@/components/device/ImagePickerModal';
import { recognizeImageWithRetry } from '@/services/ocrService';
import { parseDeviceData } from '@/services/deviceDataParser';
import { saveDeviceData, getLatestDeviceData, DataSource } from '@/services/deviceDataService';
import { DeviceType } from '@/types/common';
import { ConfirmedData } from '@/screens/device/DataConfirmationScreen';
import { TitleBar } from '@/components/TitleBar';

interface DeviceManagementScreenProps {
  route?: {
    params?: {
      deviceId?: number;
    };
  };
}

export const DeviceManagementScreen: React.FC<DeviceManagementScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const toast = useToastController();
  const theme = useTheme();

  // 主题色值
  const primaryColor = theme.primary?.val || '#6366F1';
  const successColor = theme.success?.val || '#10B981';
  const warningColor = theme.warning?.val || '#F59E0B';
  const errorColor = theme.error?.val || '#EF4444';
  const textColor = theme.color12?.val || '#1F2937';
  const textSecondaryColor = theme.color10?.val || '#6B7280';
  const backgroundColor = theme.color2?.val || '#FAFCFF';

  const [selectedDevice, setSelectedDevice] = useState<HealthDevice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState<HealthDevice['type'] | null>(null);
  const [selectedConnectionType, setSelectedConnectionType] = useState<'bluetooth' | 'wifi' | 'manual' | null>(null);
  const [devices, setDevices] = useState<HealthDevice[]>([]);
  const [loading, setLoading] = useState(true);

  // 设备绑定限制 Hook
  const {
    canBind,
    remaining: deviceRemaining,
    limit: deviceLimit,
    message: deviceLimitMessage,
    isUnlimited: isDeviceUnlimited,
    isLoading: isDeviceLimitLoading,
    refresh: refreshDeviceLimit,
  } = useDeviceLimit();

  // 显示设备限制升级提示
  const showDeviceLimitToast = useCallback(() => {
    toast.show('设备绑定数量已达上限', {
      message: `免费用户最多可绑定${deviceLimit}个设备，升级会员可无限绑定`,
      duration: 3000,
    });
  }, [deviceLimit, toast]);

  // OCR上传相关状态
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);

  // 设备类型中文名称映射
  const deviceTypeNameMap: Record<HealthDevice['type'], string> = {
    smartwatch: '智能手环',
    'blood-pressure': '血压计',
    'glucose-meter': '血糖仪',
    scale: '智能体脂秤',
    thermometer: '体温计',
    'smart-toilet': '智能座便器',
  };

  // 当选中设备类型时，自动生成设备名称
  const handleSelectDeviceType = (type: HealthDevice['type']) => {
    setSelectedDeviceType(type);
    const typeName = deviceTypeNameMap[type];
    setDeviceName(`王的${typeName}`); // 默认使用"王"作为姓氏
  };

  // 从本地存储加载设备数据
  useEffect(() => {
    loadDevices();
  }, []);

  // 如果有deviceId参数，加载完设备后自动打开该设备详情
  useEffect(() => {
    if (route?.params?.deviceId && devices.length > 0) {
      const device = devices.find(d => d.id === route.params.deviceId);
      if (device) {
        setSelectedDevice(device);
      }
    }
  }, [route?.params?.deviceId, devices]);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const loadedDevices = await getDevices();
      setDevices(loadedDevices);
    } catch (error) {
      console.error('加载设备数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 显示Toast的辅助函数
  const showToast = (message: string) => {
    console.log('🍞 调用showToast:', message);
    console.log('🍞 toast对象:', toast);
    try {
      toast.show(message);
      console.log('🍞 toast.show()调用成功');
    } catch (error) {
      console.error('🍞 toast.show()调用失败:', error);
    }
  };

  const getDeviceIcon = (type: HealthDevice['type']) => {
    switch (type) {
      case 'smartwatch':
        return <Watch size={24} color={primaryColor} />;
      case 'blood-pressure':
        return <Thermometer size={24} color={primaryColor} />;
      case 'glucose-meter':
        return <Activity size={24} color={primaryColor} />;
      case 'scale':
        return <Scale size={24} color={primaryColor} />;
      case 'thermometer':
        return <Thermometer size={24} color={primaryColor} />;
      case 'smart-toilet':
        return <Text fontSize={24}>🚽</Text>;
      default:
        return <Activity size={24} color={primaryColor} />;
    }
  };

  const getStatusBadge = (status: HealthDevice['status']) => {
    const statusConfig = {
      connected: { bg: successColor, text: '已连接' },
      disconnected: { bg: errorColor, text: '未连接' },
      syncing: { bg: warningColor, text: '同步中' },
    };
    const config = statusConfig[status];
    return (
      <View backgroundColor={config.bg} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
        <Text fontSize="$2" color="white" fontWeight="500">
          {config.text}
        </Text>
      </View>
    );
  };

  const getBatteryIcon = (battery: number) => {
    if (battery > 50) {
      return <BatteryFull size={16} color={successColor} />;
    } else if (battery > 20) {
      return <Battery size={16} color={warningColor} />;
    } else {
      return <BatteryLow size={16} color={errorColor} />;
    }
  };

  const getEventStatusIcon = (status: DeviceEvent['status']) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 size={20} color={successColor} />;
      case 'warning':
        return <AlertCircle size={20} color={warningColor} />;
      case 'danger':
        return <AlertCircle size={20} color={errorColor} />;
    }
  };

  const handleDeleteDevice = async (id: number) => {
    const success = await deleteDeviceService(id);
    if (success) {
      setDevices(devices.filter((device) => device.id !== id));
      setSelectedDevice(null);
      showToast('设备已删除');
    } else {
      showToast('删除失败，请重试');
    }
  };

  const handleSync = async (device: HealthDevice) => {
    setIsSyncing(true);
    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDevices(devices.map((d) => (d.id === device.id ? { ...d, lastSync: '刚刚', status: 'connected' as const } : d)));
    if (selectedDevice) {
      setSelectedDevice({ ...selectedDevice, lastSync: '刚刚', status: 'connected' });
    }
    setIsSyncing(false);
    showToast('同步完成');
  };

  /**
   * 将HealthDevice type映射到DeviceType
   */
  const mapHealthDeviceTypeToDeviceType = (type: HealthDevice['type']): DeviceType => {
    const mapping: Record<HealthDevice['type'], DeviceType> = {
      'smartwatch': 'fitness_tracker',
      'blood-pressure': 'blood_pressure_monitor',
      'glucose-meter': 'glucometer',
      'scale': 'smart_scale',
      'thermometer': 'heart_rate_monitor', // 暂时映射到心率监测器
      'smart-toilet': 'smart_toilet',
    };
    return mapping[type] || 'fitness_tracker';
  };

  /**
   * 处理上传数据按钮点击（手动类型设备）
   */
  const handleUploadData = () => {
    if (!selectedDevice) return;

    // 打开图片选择器
    setShowImagePicker(true);
  };

  /**
   * 图片选中后的处理
   */
  const handleImageSelected = async (imageUri: string) => {
    if (!selectedDevice) return;

    try {
      setIsRecognizing(true);

      // 1. OCR识别
      const ocrResult = await recognizeImageWithRetry(imageUri);

      if (!ocrResult.success) {
        Alert.alert(
          '识别失败',
          ocrResult.error || '无法识别图片中的数据，是否手动输入？',
          [
            { text: '取消', style: 'cancel' },
            { text: '手动输入', onPress: () => {
              // TODO: 打开手动输入页面
              Alert.alert('提示', '手动输入功能开发中');
            }},
          ]
        );
        return;
      }

      // 2. 解析数据
      const deviceType = mapHealthDeviceTypeToDeviceType(selectedDevice.type);
      const parsedData = parseDeviceData(ocrResult.text, deviceType);

      if (!parsedData.success) {
        // 使用友好的toast提示
        toast.show('无法识别数据', {
          message: '请确保照片清晰，数字完整可见',
          duration: 3000,
        });
        return;
      }

      // 3. 跳转到确认页面
      (navigation as any).navigate('DataConfirmation', {
        parsedData,
        imageUri,
        deviceId: String(selectedDevice.id),
        deviceName: selectedDevice.name,
        onDataConfirmed: handleDataConfirmed,
      });

    } catch (error) {
      console.error('OCR识别错误:', error);
      Alert.alert('错误', '处理失败，请重试');
    } finally {
      setIsRecognizing(false);
    }
  };

  /**
   * 数据确认后的处理
   */
  const handleDataConfirmed = async (confirmedData: ConfirmedData) => {
    if (!selectedDevice) return;

    try {
      // 保存数据到本地存储
      const savedRecord = await saveDeviceData(String(selectedDevice.id), {
        deviceId: String(selectedDevice.id),
        deviceType: confirmedData.deviceType,
        measurements: confirmedData.fields,
        timestamp: confirmedData.timestamp,
        source: DataSource.MANUAL_PHOTO,
        imageUri: confirmedData.imageUri,
        verified: true,
      });

      console.log('数据已保存:', savedRecord);

      // 将保存的数据转换为 DeviceEvent 格式并添加到设备事件列表
      const newEvents: DeviceEvent[] = Object.entries(confirmedData.fields).map(([fieldName, fieldData], index) => {
        // 确定事件状态
        let status: DeviceEvent['status'] = 'normal';
        const value = typeof fieldData.value === 'number' ? fieldData.value : parseFloat(String(fieldData.value));

        // 根据字段类型判断状态（支持所有设备类型）
        switch (fieldName) {
          // 血糖仪
          case 'glucose':
            if (value >= 7.0 || value < 3.9) status = 'warning';
            if (value >= 11.1 || value < 2.8) status = 'danger';
            break;
          // 血压计
          case 'systolic':
            if (value >= 140 || value < 90) status = 'warning';
            if (value >= 180 || value < 70) status = 'danger';
            break;
          case 'diastolic':
            if (value >= 90 || value < 60) status = 'warning';
            if (value >= 120 || value < 50) status = 'danger';
            break;
          // 心率（手环、血压计、心率监测器）
          case 'heartRate':
            if (value >= 100 || value < 60) status = 'warning';
            if (value >= 120 || value < 50) status = 'danger';
            break;
          // 血氧（手环）
          case 'bloodOxygen':
            if (value < 95) status = 'warning';
            if (value < 90) status = 'danger';
            break;
          // 体脂秤
          case 'weight':
            // 体重无标准范围，不判断
            break;
          case 'bodyFat':
            if (value >= 30 || value < 10) status = 'warning';
            if (value >= 40 || value < 5) status = 'danger';
            break;
          case 'bmi':
            if (value >= 24 || value < 18.5) status = 'warning';
            if (value >= 28 || value < 16) status = 'danger';
            break;
          // 体温计
          case 'temperature':
            if (value >= 37.3 || value < 36) status = 'warning';
            if (value >= 38.5 || value < 35) status = 'danger';
            break;
          default:
            break;
        }

        // 字段名称映射（支持所有设备类型）
        const fieldNameMap: Record<string, string> = {
          // 血糖仪
          glucose: '血糖',
          // 血压计
          systolic: '收缩压',
          diastolic: '舒张压',
          // 心率
          heartRate: '心率',
          // 血氧
          bloodOxygen: '血氧',
          // 体脂秤
          weight: '体重',
          bodyFat: '体脂率',
          bmi: 'BMI',
          muscleMass: '肌肉量',
          boneMass: '骨量',
          waterPercentage: '水分',
          // 手环
          steps: '步数',
          calories: '卡路里',
          // 体温计
          temperature: '体温',
        };

        return {
          id: `${Date.now()}-${index}`,
          type: fieldNameMap[fieldName] || fieldName,
          value: String(fieldData.value),
          unit: fieldData.unit,
          timestamp: new Date(confirmedData.timestamp).toLocaleString('zh-CN'),
          status,
          note: status === 'warning' ? '数值偏高/偏低，请注意' : status === 'danger' ? '数值异常，建议就医' : undefined,
        };
      });

      // 更新设备的事件列表和最后同步时间
      const updatedDevice = {
        ...selectedDevice,
        lastSync: '刚刚',
        events: [...newEvents, ...selectedDevice.events], // 新数据放在前面
      };

      const updatedDevices = devices.map((d) =>
        d.id === selectedDevice.id ? updatedDevice : d
      );

      setDevices(updatedDevices);
      setSelectedDevice(updatedDevice);

      showToast('数据保存成功');
    } catch (error) {
      console.error('保存数据失败:', error);
      Alert.alert('保存失败', '请重试');
    }
  };

  /**
   * 加载设备最新数据
   */
  const loadDeviceLatestData = async (deviceId: number) => {
    try {
      const latestData = await getLatestDeviceData(String(deviceId));
      if (latestData) {
        console.log('最新设备数据:', latestData);
        // TODO: 更新UI显示最新数据
      }
    } catch (error) {
      console.error('加载最新数据失败:', error);
    }
  };

  // 设备列表页面
  if (!selectedDevice) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          {/* Header */}
          <TitleBar
            title="设备管理"
            subtitle={`${devices.length} 台设备${isDeviceUnlimited ? ' (无限)' : ` / ${deviceLimit} 上限`}`}
            renderRight={() => (
              <TouchableOpacity onPress={() => {
                // 等待加载完成后再检查设备绑定限制
                if (isDeviceLimitLoading) {
                  // 加载中，直接打开对话框
                  setIsAddDialogOpen(true);
                  return;
                }
                // 检查设备绑定限制
                if (!canBind && !isDeviceUnlimited) {
                  showDeviceLimitToast();
                  return;
                }
                setIsAddDialogOpen(true);
              }}>
                <View backgroundColor="$primary" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10">
                  <XStack gap="$1.5" alignItems="center">
                    <Plus size={16} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="500">添加</Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Device List */}
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack padding="$2.5">
              {devices.map((device, index) => (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => setSelectedDevice(device)}
                  style={{ marginBottom: index < devices.length - 1 ? 16 : 0 }}
                >
                  <Card
                    backgroundColor="white"
                    borderLeftWidth={4}
                    borderLeftColor={primaryColor}
                    padding="$2"
                    borderRadius="$3"
                  >
                    <XStack justifyContent="space-between" marginBottom="$3">
                      <XStack space="$3" flex={1}>
                        <View
                          padding="$2"
                          borderRadius="$3"
                          backgroundColor={`${primaryColor}15`}
                          justifyContent="center"
                          alignItems="center"
                        >
                          {getDeviceIcon(device.type)}
                        </View>
                        <YStack flex={1} justifyContent="center">
                          <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
                            <Text fontSize="$5" fontWeight="600" color="$text">
                              {device.name}
                            </Text>
                            <ChevronRight size={20} color={textSecondaryColor} />
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                            {device.model}
                          </Text>
                          {/* 手动上传类型设备不显示连接方式 */}
                          {device.syncType !== 'manual' && (
                            <XStack space="$2" alignItems="center" flexWrap="wrap">
                              <XStack space="$1" alignItems="center">
                                {device.connection === 'wifi' ? (
                                  <Wifi size={12} color={textSecondaryColor} />
                                ) : (
                                  <Bluetooth size={12} color={textSecondaryColor} />
                                )}
                                <Text fontSize="$1" color="$textSecondary">
                                  {device.connection === 'wifi' ? 'WiFi' : '蓝牙'}
                                </Text>
                              </XStack>
                            </XStack>
                          )}
                        </YStack>
                      </XStack>
                    </XStack>

                    {/* Battery - 手动上传类型不显示 */}
                    {device.syncType !== 'manual' && (
                      <YStack space="$1" marginBottom="$3">
                        <XStack justifyContent="space-between" alignItems="center">
                          <XStack space="$1" alignItems="center">
                            {getBatteryIcon(device.battery)}
                            <Text fontSize="$2" color="$textSecondary">
                              电量
                            </Text>
                          </XStack>
                          <Text fontSize="$3" fontWeight="500">
                            {device.battery}%
                          </Text>
                        </XStack>
                        <Progress value={device.battery} height={8} backgroundColor="#f0f0f0">
                          <Progress.Indicator backgroundColor={primaryColor} />
                        </Progress>
                      </YStack>
                    )}

                    {/* Last Sync/Upload */}
                    <XStack justifyContent="space-between" marginBottom="$3">
                      <Text fontSize="$2" color="$textSecondary">
                        {device.syncType === 'manual' ? '最后上传' : '最后同步'}
                      </Text>
                      <Text fontSize="$3" fontWeight="500">
                        {device.lastSync}
                      </Text>
                    </XStack>

                    {/* Recent Events Preview */}
                    <View paddingTop="$2" borderTopWidth={1} borderTopColor="#f0f0f0">
                      <XStack justifyContent="space-between" marginBottom="$2">
                        <Text fontSize="$3" fontWeight="500">
                          最近记录
                        </Text>
                        <Text fontSize="$2" color="$textSecondary">
                          {device.events.length} 条
                        </Text>
                      </XStack>
                      <YStack space="$1">
                        {device.events.slice(0, 2).map((event) => (
                          <XStack key={event.id} justifyContent="space-between">
                            <Text fontSize="$2" color="$textSecondary">
                              {event.type}
                            </Text>
                            <Text fontSize="$3" fontWeight="500">
                              {event.value} {event.unit}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}

              {/* Empty State */}
              {devices.length === 0 && (
                <YStack alignItems="center" justifyContent="center" paddingVertical="$2">
                  <View
                    width={96}
                    height={96}
                    borderRadius={48}
                    backgroundColor={`${primaryColor}15`}
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$4"
                  >
                    <Watch size={48} color={primaryColor} />
                  </View>
                  <Text fontSize="$5" fontWeight="600" marginBottom="$2">
                    暂无设备
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" textAlign="center" marginBottom="$4">
                    添加您的健康监测设备，开始记录健康数据
                  </Text>
                  <TouchableOpacity onPress={() => setIsAddDialogOpen(true)}>
                    <View backgroundColor={primaryColor} paddingHorizontal="$2.5" paddingVertical="$2" borderRadius="$3">
                      <XStack space="$2" alignItems="center">
                        <Plus size={16} color="white" />
                        <Text fontSize="$3" color="white" fontWeight="600">
                          添加第一台设备
                        </Text>
                      </XStack>
                    </View>
                  </TouchableOpacity>
                </YStack>
              )}
            </YStack>
          </ScrollView>

          {/* Add Device Dialog */}
          <Modal visible={isAddDialogOpen} transparent animationType="fade" onRequestClose={() => setIsAddDialogOpen(false)}>
            <View
              flex={1}
              backgroundColor="rgba(0,0,0,0.5)"
              justifyContent="center"
              alignItems="center"
              padding="$2.5"
            >
              <View backgroundColor="white" borderRadius="$5" padding="$2" width="100%" maxWidth={400}>
                <Text fontSize="$6" fontWeight="600" marginBottom="$4" color="$color12">
                  添加新设备
                </Text>

                <YStack space="$4">
                  {/* Device Type Selection */}
                  <YStack space="$3">
                    <XStack space="$3">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('smart-toilet')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'smart-toilet' ? primaryColor : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'smart-toilet' ? `${primaryColor}15` : 'white'}
                        >
                          <Activity size={32} color={primaryColor} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2" color="$color12">
                            智能座便器
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('smartwatch')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'smartwatch' ? primaryColor : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'smartwatch' ? `${primaryColor}15` : 'white'}
                        >
                          <Watch size={32} color={primaryColor} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2" color="$color12">
                            智能手环
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </XStack>
                    <XStack space="$3">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('blood-pressure')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'blood-pressure' ? primaryColor : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'blood-pressure' ? `${primaryColor}15` : 'white'}
                        >
                          <Heart size={32} color={primaryColor} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2" color="$color12">
                            血压计
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('glucose-meter')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'glucose-meter' ? primaryColor : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'glucose-meter' ? `${primaryColor}15` : 'white'}
                        >
                          <Activity size={32} color={primaryColor} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2" color="$color12">
                            血糖仪
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </XStack>
                    <XStack space="$3">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('scale')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'scale' ? primaryColor : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'scale' ? `${primaryColor}15` : 'white'}
                        >
                          <Scale size={32} color={primaryColor} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2" color="$color12">
                            体脂秤
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                    </XStack>
                  </YStack>

                  {/* Device Name Input */}
                  <YStack space="$2">
                    <Text fontSize="$3" fontWeight="500" color="$color12">
                      设备名称
                    </Text>
                    <Input
                      placeholder="输入设备名称"
                      value={deviceName}
                      onChangeText={setDeviceName}
                      fontSize="$3"
                      height={44}
                      borderWidth={1}
                      borderColor="#e0e0e0"
                      borderRadius="$3"
                      paddingHorizontal="$3"
                      backgroundColor="white"
                    />
                  </YStack>

                  {/* Connection Buttons */}
                  <YStack space="$2">
                    <XStack space="$2">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedConnectionType('bluetooth')}>
                        <View
                          backgroundColor={selectedConnectionType === 'bluetooth' ? primaryColor : 'white'}
                          borderWidth={selectedConnectionType === 'bluetooth' ? 0 : 1}
                          borderColor="#e0e0e0"
                          paddingVertical="$2"
                          borderRadius="$3"
                          alignItems="center"
                        >
                          <XStack space="$2" alignItems="center">
                            <Bluetooth size={16} color={selectedConnectionType === 'bluetooth' ? 'white' : textColor} />
                            <Text fontSize="$3" color={selectedConnectionType === 'bluetooth' ? 'white' : '$color12'} fontWeight={selectedConnectionType === 'bluetooth' ? '600' : '500'}>
                              蓝牙搜索
                            </Text>
                          </XStack>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedConnectionType('wifi')}>
                        <View
                          backgroundColor={selectedConnectionType === 'wifi' ? primaryColor : 'white'}
                          borderWidth={selectedConnectionType === 'wifi' ? 0 : 1}
                          borderColor="#e0e0e0"
                          paddingVertical="$2"
                          borderRadius="$3"
                          alignItems="center"
                        >
                          <XStack space="$2" alignItems="center">
                            <Wifi size={16} color={selectedConnectionType === 'wifi' ? 'white' : textColor} />
                            <Text fontSize="$3" color={selectedConnectionType === 'wifi' ? 'white' : '$color12'} fontWeight={selectedConnectionType === 'wifi' ? '600' : '500'}>
                              WiFi连接
                            </Text>
                          </XStack>
                        </View>
                      </TouchableOpacity>
                    </XStack>
                    <TouchableOpacity onPress={() => setSelectedConnectionType('manual')}>
                      <View
                        backgroundColor={selectedConnectionType === 'manual' ? primaryColor : 'white'}
                        borderWidth={selectedConnectionType === 'manual' ? 0 : 1}
                        borderColor="#e0e0e0"
                        paddingVertical="$2"
                        borderRadius="$3"
                        alignItems="center"
                      >
                        <XStack space="$2" alignItems="center">
                          <Edit size={16} color={selectedConnectionType === 'manual' ? 'white' : textColor} />
                          <Text fontSize="$3" color={selectedConnectionType === 'manual' ? 'white' : '$color12'} fontWeight={selectedConnectionType === 'manual' ? '600' : '500'}>
                            手动录入
                          </Text>
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  </YStack>

                  {/* Action Buttons */}
                  <XStack space="$2">
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                      setIsAddDialogOpen(false);
                      setDeviceName('');
                      setSelectedDeviceType(null);
                      setSelectedConnectionType(null);
                    }}>
                      <View
                        borderWidth={1}
                        borderColor="$color5"
                        paddingVertical="$2"
                        borderRadius="$10"
                        alignItems="center"
                      >
                        <Text fontSize="$3" fontWeight="500" color="$color12">
                          取消
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={async () => {
                        // 验证必填项
                        if (!selectedDeviceType || !selectedConnectionType || !deviceName.trim()) {
                          showToast('请选择设备类型、连接方式并输入设备名称');
                          return;
                        }

                        // 检查设备绑定数量限制（仅在加载完成且非无限时检查）
                        if (!isDeviceLimitLoading && !canBind && !isDeviceUnlimited) {
                          showDeviceLimitToast();
                          return;
                        }

                        try {
                          // 调用服务添加新设备
                          const newDevice = await addDevice({
                            name: deviceName,
                            type: selectedDeviceType,
                            status: selectedConnectionType === 'manual' ? 'disconnected' : 'connected',
                            battery: selectedConnectionType === 'manual' ? 0 : 100,
                            lastSync: '刚刚',
                            connection: selectedConnectionType,
                            model: `用户添加的${deviceTypeNameMap[selectedDeviceType]}`,
                            syncType: selectedConnectionType === 'manual' ? 'manual' : 'auto',
                            events: [],
                          });

                          // 更新本地设备列表
                          setDevices([...devices, newDevice]);

                          // 刷新设备限制状态
                          refreshDeviceLimit();

                          // 显示成功提示
                          showToast('设备添加成功');

                          // 关闭对话框并重置状态
                          setIsAddDialogOpen(false);
                          setDeviceName('');
                          setSelectedDeviceType(null);
                          setSelectedConnectionType(null);
                        } catch (error) {
                          console.error('添加设备失败:', error);
                          showToast('添加设备失败，请重试');
                        }
                      }}
                    >
                      <View
                        backgroundColor={primaryColor}
                        paddingVertical="$2"
                        borderRadius="$10"
                        alignItems="center"
                      >
                        <Text fontSize="$3" color="white" fontWeight="600">
                          保存
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </XStack>
                </YStack>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Theme>
    );
  }

  // 设备详情页面
  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        {/* Header */}
        <TitleBar
          title={selectedDevice.name}
          subtitle={selectedDevice.model}
          onBack={() => setSelectedDevice(null)}
          actions={[{ icon: Settings, onPress: () => {} }]}
        />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack padding="$2.5" space="$2">
            {/* Device Info Card */}
            <Card backgroundColor="white" borderLeftWidth={4} borderLeftColor={primaryColor} padding="$2">
              <XStack justifyContent="space-between" marginBottom="$4">
                <XStack space="$2" alignItems="center">
                  {/* 手动上传类型不显示连接状态 */}
                  {selectedDevice.syncType !== 'manual' && getStatusBadge(selectedDevice.status)}
                  <View borderWidth={1} borderColor="#e0e0e0" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                    <Text fontSize="$1" color="$textSecondary">
                      {selectedDevice.syncType === 'auto' ? '自动同步' : '手动上传'}
                    </Text>
                  </View>
                </XStack>
                {/* 手动上传类型不显示连接方式 */}
                {selectedDevice.syncType !== 'manual' && (
                  <XStack space="$1" alignItems="center">
                    {selectedDevice.connection === 'wifi' ? (
                      <Wifi size={16} color={textSecondaryColor} />
                    ) : (
                      <Bluetooth size={16} color={textSecondaryColor} />
                    )}
                    <Text fontSize="$2" color="$textSecondary">
                      {selectedDevice.connection === 'wifi' ? 'WiFi' : '蓝牙'}
                    </Text>
                  </XStack>
                )}
              </XStack>

              {/* 自动同步设备显示电量和最后同步 */}
              {selectedDevice.syncType !== 'manual' && (
                <XStack space="$4" marginBottom="$4">
                  <YStack flex={1} space="$1">
                    <XStack space="$1" alignItems="center">
                      {getBatteryIcon(selectedDevice.battery)}
                      <Text fontSize="$2" color="$textSecondary">
                        电量
                      </Text>
                    </XStack>
                    <XStack space="$2" alignItems="center">
                      <Progress value={selectedDevice.battery} height={8} flex={1} backgroundColor="#f0f0f0">
                        <Progress.Indicator backgroundColor={primaryColor} />
                      </Progress>
                      <Text fontSize="$3" fontWeight="500">
                        {selectedDevice.battery}%
                      </Text>
                    </XStack>
                  </YStack>
                  <YStack flex={1} space="$1">
                    <XStack space="$1" alignItems="center">
                      <Clock size={16} color={textSecondaryColor} />
                      <Text fontSize="$2" color="$textSecondary">
                        最后同步
                      </Text>
                    </XStack>
                    <Text fontSize="$3" fontWeight="500">
                      {selectedDevice.lastSync}
                    </Text>
                  </YStack>
                </XStack>
              )}

              {/* 手动上传设备只显示最后上传时间 */}
              {selectedDevice.syncType === 'manual' && (
                <YStack space="$1" marginBottom="$4">
                  <XStack space="$1" alignItems="center">
                    <Clock size={16} color={textSecondaryColor} />
                    <Text fontSize="$2" color="$textSecondary">
                      最后上传
                    </Text>
                  </XStack>
                  <Text fontSize="$3" fontWeight="500">
                    {selectedDevice.lastSync}
                  </Text>
                </YStack>
              )}

              {/* Action Buttons */}
              <XStack space="$2">
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    // 手动上传类型设备：使用OCR上传
                    if (selectedDevice.syncType === 'manual') {
                      handleUploadData();
                    } else {
                      // 自动同步设备：使用原有同步逻辑
                      handleSync(selectedDevice);
                    }
                  }}
                  disabled={
                    selectedDevice.syncType !== 'manual' &&
                    (selectedDevice.status === 'disconnected' || isSyncing)
                  }
                >
                  <View
                    backgroundColor={
                      selectedDevice.syncType !== 'manual' &&
                      (selectedDevice.status === 'disconnected' || isSyncing)
                        ? '#d0d0d0'
                        : primaryColor
                    }
                    paddingVertical="$2"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <XStack space="$2" alignItems="center">
                      {selectedDevice.syncType === 'manual' ? (
                        <Camera size={16} color="white" />
                      ) : (
                        <RefreshCw
                          size={16}
                          color="white"
                          style={{ transform: [{ rotate: isSyncing ? '180deg' : '0deg' }] }}
                        />
                      )}
                      <Text fontSize="$3" color="white" fontWeight="600">
                        {selectedDevice.syncType === 'manual'
                          ? '拍照上传'
                          : isSyncing
                          ? '同步中...'
                          : selectedDevice.syncType === 'auto'
                          ? '立即同步'
                          : '上传数据'}
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDevice(selectedDevice.id)}>
                  <View
                    borderWidth={1}
                    borderColor={errorColor}
                    paddingHorizontal="$2.5"
                    paddingVertical="$2"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <XStack space="$2" alignItems="center">
                      <Trash2 size={16} color={errorColor} />
                      <Text fontSize="$3" color={errorColor} fontWeight="600">
                        删除
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
              </XStack>
            </Card>

            {/* Data Records Section */}
            <Card backgroundColor="$color2" padding="$2" borderRadius="$6" borderWidth={1} borderColor="$color5">
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  数据记录
                </Text>
                <View backgroundColor="$color4" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                  <Text fontSize="$2" color="$color10">
                    {selectedDevice.events.length} 条
                  </Text>
                </View>
              </XStack>

              {selectedDevice.events.length > 0 ? (
                <YStack gap="$2">
                  {selectedDevice.events.map((event) => (
                    <View
                      key={event.id}
                      padding="$2"
                      borderRadius="$4"
                      backgroundColor="$color1"
                      borderLeftWidth={3}
                      borderLeftColor={
                        event.status === 'danger'
                          ? errorColor
                          : event.status === 'warning'
                            ? warningColor
                            : successColor
                      }
                    >
                      <XStack justifyContent="space-between" alignItems="flex-start">
                        <XStack gap="$2" alignItems="center" flex={1}>
                          <View
                            width={36}
                            height={36}
                            borderRadius="$10"
                            backgroundColor={
                              event.status === 'danger'
                                ? `${errorColor}15`
                                : event.status === 'warning'
                                  ? `${warningColor}15`
                                  : `${successColor}15`
                            }
                            justifyContent="center"
                            alignItems="center"
                          >
                            {getEventStatusIcon(event.status)}
                          </View>
                          <YStack flex={1}>
                            <Text fontSize="$4" fontWeight="600" color="$color12">
                              {event.type}
                            </Text>
                            <XStack gap="$1" alignItems="center" marginTop="$0.5">
                              <Clock size={12} color={textSecondaryColor} />
                              <Text fontSize="$2" color="$color10">
                                {event.timestamp}
                              </Text>
                            </XStack>
                          </YStack>
                        </XStack>
                        <YStack alignItems="flex-end">
                          <Text fontSize="$6" fontWeight="bold" color={primaryColor}>
                            {event.value}
                          </Text>
                          {event.unit && (
                            <Text fontSize="$2" color="$color10">
                              {event.unit}
                            </Text>
                          )}
                        </YStack>
                      </XStack>
                      {event.note && (
                        <View
                          marginTop="$2"
                          padding="$2"
                          borderRadius="$3"
                          backgroundColor={
                            event.status === 'warning'
                              ? `${warningColor}15`
                              : event.status === 'danger'
                                ? `${errorColor}15`
                                : `${successColor}15`
                          }
                        >
                          <Text
                            fontSize="$2"
                            color={
                              event.status === 'warning'
                                ? warningColor
                                : event.status === 'danger'
                                  ? errorColor
                                  : successColor
                            }
                          >
                            {event.note}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </YStack>
              ) : (
                <YStack alignItems="center" justifyContent="center" paddingVertical="$2">
                  <View
                    width={56}
                    height={56}
                    borderRadius="$10"
                    backgroundColor={`${primaryColor}15`}
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$2"
                  >
                    <Activity size={28} color={primaryColor} />
                  </View>
                  <Text fontSize="$3" color="$color10">
                    暂无数据记录
                  </Text>
                  <Text fontSize="$2" color="$color9" marginTop="$1">
                    点击上方按钮开始记录健康数据
                  </Text>
                </YStack>
              )}
            </Card>
          </YStack>
        </ScrollView>

        {/* 图片选择Modal */}
        <ImagePickerModal
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onImageSelected={handleImageSelected}
        />

        {/* OCR识别中的Loading遮罩 */}
        <Modal visible={isRecognizing} transparent animationType="fade">
          <View
            flex={1}
            backgroundColor="rgba(0,0,0,0.7)"
            justifyContent="center"
            alignItems="center"
          >
            <View
              backgroundColor="white"
              borderRadius="$4"
              padding="$2"
              alignItems="center"
              minWidth={200}
            >
              <ActivityIndicator size="large" color={primaryColor} />
              <Text fontSize="$4" fontWeight="600" marginTop="$4" color="$color12">
                正在识别...
              </Text>
              <Text fontSize="$2" color="$color10" marginTop="$2" textAlign="center">
                请稍候，正在识别图片中的数据
              </Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Theme>
  );
};