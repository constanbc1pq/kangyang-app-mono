import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { View, Text, ScrollView, YStack, XStack, Theme, Card, Progress, Input } from 'tamagui';
import { useToastController } from '@tamagui/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
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
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation } from '@react-navigation/native';
import { getDevices, addDevice, deleteDevice as deleteDeviceService } from '@/services/userDataService';
import { HealthDevice, DeviceEvent } from '@/types/userData';

export const DeviceManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const toast = useToastController();
  const [selectedDevice, setSelectedDevice] = useState<HealthDevice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState<HealthDevice['type'] | null>(null);
  const [selectedConnectionType, setSelectedConnectionType] = useState<'bluetooth' | 'wifi' | 'manual' | null>(null);
  const [devices, setDevices] = useState<HealthDevice[]>([]);
  const [loading, setLoading] = useState(true);

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
        return <Watch size={24} color={COLORS.primary} />;
      case 'blood-pressure':
        return <Heart size={24} color={COLORS.primary} />;
      case 'glucose-meter':
        return <Activity size={24} color={COLORS.primary} />;
      case 'scale':
        return <Scale size={24} color={COLORS.primary} />;
      case 'thermometer':
        return <Thermometer size={24} color={COLORS.primary} />;
      case 'smart-toilet':
        return <Activity size={24} color={COLORS.primary} />;
      default:
        return <Activity size={24} color={COLORS.primary} />;
    }
  };

  const getStatusBadge = (status: HealthDevice['status']) => {
    const statusConfig = {
      connected: { bg: COLORS.success, text: '已连接' },
      disconnected: { bg: COLORS.error, text: '未连接' },
      syncing: { bg: COLORS.warning, text: '同步中' },
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
      return <BatteryFull size={16} color={COLORS.success} />;
    } else if (battery > 20) {
      return <Battery size={16} color={COLORS.warning} />;
    } else {
      return <BatteryLow size={16} color={COLORS.error} />;
    }
  };

  const getEventStatusIcon = (status: DeviceEvent['status']) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 size={20} color={COLORS.success} />;
      case 'warning':
        return <AlertCircle size={20} color={COLORS.warning} />;
      case 'danger':
        return <AlertCircle size={20} color={COLORS.error} />;
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

  // 设备列表页面
  if (!selectedDevice) {
    return (
      <Theme name="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          {/* Header */}
          <View
            height={60}
            backgroundColor="white"
            borderBottomWidth={1}
            borderBottomColor="#e0e0e0"
            paddingHorizontal="$4"
          >
            <XStack justifyContent="space-between" alignItems="center" height="100%">
              <XStack space="$3" alignItems="center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="#f0f0f0"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ArrowLeft size={20} color="#333" />
                  </View>
                </TouchableOpacity>
                <YStack>
                  <Text fontSize="$6" fontWeight="600" color="$text">
                    设备管理
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {devices.length} 台设备
                  </Text>
                </YStack>
              </XStack>

              <TouchableOpacity onPress={() => setIsAddDialogOpen(true)}>
                <View backgroundColor={COLORS.primary} paddingHorizontal="$3" paddingVertical="$2" borderRadius="$3">
                  <XStack space="$2" alignItems="center">
                    <Plus size={16} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="600">
                      添加
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            </XStack>
          </View>

          {/* Device List */}
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack padding="$4">
              {devices.map((device, index) => (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => setSelectedDevice(device)}
                  style={{ marginBottom: index < devices.length - 1 ? 16 : 0 }}
                >
                  <Card
                    backgroundColor="white"
                    borderLeftWidth={4}
                    borderLeftColor={COLORS.primary}
                    padding="$4"
                    borderRadius="$3"
                  >
                    <XStack justifyContent="space-between" marginBottom="$3">
                      <XStack space="$3" flex={1}>
                        <View
                          padding="$3"
                          borderRadius="$3"
                          backgroundColor="#f0fdf4"
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
                            <ChevronRight size={20} color={COLORS.textSecondary} />
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary" marginBottom="$2">
                            {device.model}
                          </Text>
                          <XStack space="$2" alignItems="center" flexWrap="wrap">
                            <XStack space="$1" alignItems="center">
                              {device.connection === 'wifi' ? (
                                <Wifi size={12} color={COLORS.textSecondary} />
                              ) : device.connection === 'bluetooth' ? (
                                <Bluetooth size={12} color={COLORS.textSecondary} />
                              ) : (
                                <Edit size={12} color={COLORS.textSecondary} />
                              )}
                              <Text fontSize="$1" color="$textSecondary">
                                {device.connection === 'wifi' ? 'WiFi' : device.connection === 'bluetooth' ? '蓝牙' : '手动'}
                              </Text>
                            </XStack>
                          </XStack>
                        </YStack>
                      </XStack>
                    </XStack>

                    {/* Battery - 手动类型不显示 */}
                    {device.connection !== 'manual' && (
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
                          <Progress.Indicator backgroundColor={COLORS.primary} />
                        </Progress>
                      </YStack>
                    )}

                    {/* Last Sync */}
                    <XStack justifyContent="space-between" marginBottom="$3">
                      <Text fontSize="$2" color="$textSecondary">
                        最后同步
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
                <YStack alignItems="center" justifyContent="center" paddingVertical="$8">
                  <View
                    width={96}
                    height={96}
                    borderRadius={48}
                    backgroundColor="#f0fdf4"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$4"
                  >
                    <Watch size={48} color={COLORS.primary} />
                  </View>
                  <Text fontSize="$5" fontWeight="600" marginBottom="$2">
                    暂无设备
                  </Text>
                  <Text fontSize="$3" color="$textSecondary" textAlign="center" marginBottom="$4">
                    添加您的健康监测设备，开始记录健康数据
                  </Text>
                  <TouchableOpacity onPress={() => setIsAddDialogOpen(true)}>
                    <View backgroundColor={COLORS.primary} paddingHorizontal="$4" paddingVertical="$3" borderRadius="$3">
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
              padding="$4"
            >
              <View backgroundColor="white" borderRadius="$4" padding="$5" width="100%" maxWidth={400}>
                <Text fontSize="$6" fontWeight="600" marginBottom="$4">
                  添加新设备
                </Text>

                <YStack space="$4">
                  {/* Device Type Selection */}
                  <YStack space="$3">
                    <XStack space="$3">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('smartwatch')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'smartwatch' ? COLORS.primary : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'smartwatch' ? '#f0fdf4' : 'white'}
                        >
                          <Watch size={32} color={COLORS.primary} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2">
                            智能手环
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('blood-pressure')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'blood-pressure' ? COLORS.primary : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'blood-pressure' ? '#f0fdf4' : 'white'}
                        >
                          <Heart size={32} color={COLORS.primary} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2">
                            血压计
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </XStack>
                    <XStack space="$3">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('glucose-meter')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'glucose-meter' ? COLORS.primary : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'glucose-meter' ? '#f0fdf4' : 'white'}
                        >
                          <Activity size={32} color={COLORS.primary} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2">
                            血糖仪
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('scale')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'scale' ? COLORS.primary : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'scale' ? '#f0fdf4' : 'white'}
                        >
                          <Scale size={32} color={COLORS.primary} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2">
                            体脂秤
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </XStack>
                    <XStack space="$3">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectDeviceType('smart-toilet')}>
                        <View
                          height={96}
                          borderWidth={2}
                          borderColor={selectedDeviceType === 'smart-toilet' ? COLORS.primary : '#e0e0e0'}
                          borderRadius="$3"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={selectedDeviceType === 'smart-toilet' ? '#f0fdf4' : 'white'}
                        >
                          <Activity size={32} color={COLORS.primary} />
                          <Text fontSize="$3" fontWeight="500" marginTop="$2">
                            智能座便器
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                    </XStack>
                  </YStack>

                  {/* Device Name Input */}
                  <YStack space="$2">
                    <Text fontSize="$3" fontWeight="500" color="$text">
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
                          backgroundColor={selectedConnectionType === 'bluetooth' ? COLORS.primary : 'white'}
                          borderWidth={selectedConnectionType === 'bluetooth' ? 0 : 1}
                          borderColor="#e0e0e0"
                          paddingVertical="$3"
                          borderRadius="$3"
                          alignItems="center"
                        >
                          <XStack space="$2" alignItems="center">
                            <Bluetooth size={16} color={selectedConnectionType === 'bluetooth' ? 'white' : COLORS.text} />
                            <Text fontSize="$3" color={selectedConnectionType === 'bluetooth' ? 'white' : '$text'} fontWeight={selectedConnectionType === 'bluetooth' ? '600' : '500'}>
                              蓝牙搜索
                            </Text>
                          </XStack>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedConnectionType('wifi')}>
                        <View
                          backgroundColor={selectedConnectionType === 'wifi' ? COLORS.primary : 'white'}
                          borderWidth={selectedConnectionType === 'wifi' ? 0 : 1}
                          borderColor="#e0e0e0"
                          paddingVertical="$3"
                          borderRadius="$3"
                          alignItems="center"
                        >
                          <XStack space="$2" alignItems="center">
                            <Wifi size={16} color={selectedConnectionType === 'wifi' ? 'white' : COLORS.text} />
                            <Text fontSize="$3" color={selectedConnectionType === 'wifi' ? 'white' : '$text'} fontWeight={selectedConnectionType === 'wifi' ? '600' : '500'}>
                              WiFi连接
                            </Text>
                          </XStack>
                        </View>
                      </TouchableOpacity>
                    </XStack>
                    <TouchableOpacity onPress={() => setSelectedConnectionType('manual')}>
                      <View
                        backgroundColor={selectedConnectionType === 'manual' ? COLORS.primary : 'white'}
                        borderWidth={selectedConnectionType === 'manual' ? 0 : 1}
                        borderColor="#e0e0e0"
                        paddingVertical="$3"
                        borderRadius="$3"
                        alignItems="center"
                      >
                        <XStack space="$2" alignItems="center">
                          <Edit size={16} color={selectedConnectionType === 'manual' ? 'white' : COLORS.text} />
                          <Text fontSize="$3" color={selectedConnectionType === 'manual' ? 'white' : '$text'} fontWeight={selectedConnectionType === 'manual' ? '600' : '500'}>
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
                        borderColor="#e0e0e0"
                        paddingVertical="$3"
                        borderRadius="$3"
                        alignItems="center"
                      >
                        <Text fontSize="$3" fontWeight="500">
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
                        backgroundColor={COLORS.primary}
                        paddingVertical="$3"
                        borderRadius="$3"
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
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <View height={60} backgroundColor="white" borderBottomWidth={1} borderBottomColor="#e0e0e0" paddingHorizontal="$4">
          <XStack justifyContent="space-between" alignItems="center" height="100%">
            <XStack space="$3" alignItems="center" flex={1}>
              <TouchableOpacity onPress={() => setSelectedDevice(null)}>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="#f0f0f0"
                  justifyContent="center"
                  alignItems="center"
                >
                  <ArrowLeft size={20} color="#333" />
                </View>
              </TouchableOpacity>
              <XStack space="$2" alignItems="center" flex={1}>
                <View padding="$2" borderRadius="$2" backgroundColor="#f0fdf4">
                  {getDeviceIcon(selectedDevice.type)}
                </View>
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="600" color="$text">
                    {selectedDevice.name}
                  </Text>
                  <Text fontSize="$2" color="$textSecondary">
                    {selectedDevice.model}
                  </Text>
                </YStack>
              </XStack>
            </XStack>
            <TouchableOpacity>
              <View padding="$2">
                <Settings size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          </XStack>
        </View>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack padding="$4" space="$4">
            {/* Device Info Card */}
            <Card backgroundColor="white" borderLeftWidth={4} borderLeftColor={COLORS.primary} padding="$4">
              <XStack justifyContent="space-between" marginBottom="$4">
                <XStack space="$2" alignItems="center">
                  {/* 手动类型不显示连接状态 */}
                  {selectedDevice.connection !== 'manual' && getStatusBadge(selectedDevice.status)}
                  <View borderWidth={1} borderColor="#e0e0e0" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                    <Text fontSize="$1" color="$textSecondary">
                      {selectedDevice.syncType === 'auto' ? '自动同步' : '手动上传'}
                    </Text>
                  </View>
                </XStack>
                <XStack space="$1" alignItems="center">
                  {selectedDevice.connection === 'wifi' ? (
                    <Wifi size={16} color={COLORS.textSecondary} />
                  ) : selectedDevice.connection === 'bluetooth' ? (
                    <Bluetooth size={16} color={COLORS.textSecondary} />
                  ) : (
                    <Edit size={16} color={COLORS.textSecondary} />
                  )}
                  <Text fontSize="$2" color="$textSecondary">
                    {selectedDevice.connection === 'wifi' ? 'WiFi' : selectedDevice.connection === 'bluetooth' ? '蓝牙' : '手动'}
                  </Text>
                </XStack>
              </XStack>

              {/* 手动类型不显示电量和最后同步 */}
              {selectedDevice.connection !== 'manual' && (
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
                        <Progress.Indicator backgroundColor={COLORS.primary} />
                      </Progress>
                      <Text fontSize="$3" fontWeight="500">
                        {selectedDevice.battery}%
                      </Text>
                    </XStack>
                  </YStack>
                  <YStack flex={1} space="$1">
                    <XStack space="$1" alignItems="center">
                      <Clock size={16} color={COLORS.textSecondary} />
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

              {/* Action Buttons */}
              <XStack space="$2">
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleSync(selectedDevice)}
                  disabled={selectedDevice.status === 'disconnected' || isSyncing}
                >
                  <View
                    backgroundColor={
                      selectedDevice.status === 'disconnected' || isSyncing ? '#d0d0d0' : COLORS.primary
                    }
                    paddingVertical="$3"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <XStack space="$2" alignItems="center">
                      <RefreshCw size={16} color="white" style={{ transform: [{ rotate: isSyncing ? '180deg' : '0deg' }] }} />
                      <Text fontSize="$3" color="white" fontWeight="600">
                        {isSyncing ? '同步中...' : selectedDevice.syncType === 'auto' ? '立即同步' : '上传数据'}
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDevice(selectedDevice.id)}>
                  <View
                    borderWidth={1}
                    borderColor={COLORS.error}
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    borderRadius="$3"
                    alignItems="center"
                  >
                    <XStack space="$2" alignItems="center">
                      <Trash2 size={16} color={COLORS.error} />
                      <Text fontSize="$3" color={COLORS.error} fontWeight="600">
                        删除
                      </Text>
                    </XStack>
                  </View>
                </TouchableOpacity>
              </XStack>
            </Card>

            {/* Event Timeline */}
            <YStack space="$2">
              <XStack justifyContent="space-between" marginBottom="$2">
                <Text fontSize="$5" fontWeight="600">
                  数据记录
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {selectedDevice.events.length} 条记录
                </Text>
              </XStack>

              {selectedDevice.events.map((event) => (
                <Card key={event.id} backgroundColor="white" padding="$4">
                  <XStack space="$3">
                    <View marginTop="$1">{getEventStatusIcon(event.status)}</View>
                    <YStack flex={1}>
                      <XStack justifyContent="space-between" marginBottom="$1">
                        <YStack>
                          <Text fontSize="$4" fontWeight="600">
                            {event.type}
                          </Text>
                          <XStack space="$1" alignItems="center">
                            <Clock size={12} color={COLORS.textSecondary} />
                            <Text fontSize="$2" color="$textSecondary">
                              {event.timestamp}
                            </Text>
                          </XStack>
                        </YStack>
                        <YStack alignItems="flex-end">
                          <Text fontSize="$7" fontWeight="bold" color={COLORS.primary}>
                            {event.value}
                          </Text>
                          {event.unit && (
                            <Text fontSize="$2" color="$textSecondary">
                              {event.unit}
                            </Text>
                          )}
                        </YStack>
                      </XStack>
                      {event.note && (
                        <View
                          marginTop="$2"
                          padding="$2"
                          borderRadius="$2"
                          backgroundColor={
                            event.status === 'warning'
                              ? '#fef3c7'
                              : event.status === 'danger'
                                ? '#fee2e2'
                                : '#d1fae5'
                          }
                        >
                          <Text
                            fontSize="$3"
                            color={
                              event.status === 'warning'
                                ? '#92400e'
                                : event.status === 'danger'
                                  ? '#991b1b'
                                  : '#065f46'
                            }
                          >
                            {event.note}
                          </Text>
                        </View>
                      )}
                    </YStack>
                  </XStack>
                </Card>
              ))}

              {selectedDevice.events.length === 0 && (
                <YStack alignItems="center" justifyContent="center" paddingVertical="$8">
                  <View
                    width={64}
                    height={64}
                    borderRadius={32}
                    backgroundColor="#f0fdf4"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$3"
                  >
                    <Activity size={32} color={COLORS.primary} />
                  </View>
                  <Text fontSize="$3" color="$textSecondary">
                    暂无数据记录
                  </Text>
                </YStack>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
};