import React, { useState, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H3,
  Theme,
  Sheet,
} from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Plus, Bluetooth, Wifi, Battery, Settings, Trash2, Watch, Heart, Activity, Scale, Thermometer, ChevronRight, Edit } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { getDevices } from '@/services/userDataService';
import { HealthDevice } from '@/types/userData';
import { useNavigation } from '@react-navigation/native';

interface DeviceManagerProps {
  onManageDevices?: () => void;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({ onManageDevices }) => {
  const navigation = useNavigation<any>();
  const [devices, setDevices] = useState<HealthDevice[]>([]);
  const [showAddDevice, setShowAddDevice] = useState(false);

  // 加载设备数据
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const allDevices = await getDevices();

    // 排序：置顶设备优先，然后按最后同步时间排序
    const sortedDevices = [...allDevices].sort((a, b) => {
      // 置顶设备排在前面
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // 都置顶或都不置顶，按lastSync排序
      // 注意：lastSync可能是"刚刚"、"5分钟前"等文本，这里简化处理按更新时间排序
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // 只取前5台设备
    setDevices(sortedDevices.slice(0, 5));
  };

  const getDeviceIcon = (type: HealthDevice['type']) => {
    switch (type) {
      case 'smartwatch':
        return <Watch size={20} color="white" />;
      case 'blood-pressure':
        return <Heart size={20} color="white" />;
      case 'glucose-meter':
        return <Activity size={20} color="white" />;
      case 'scale':
        return <Scale size={20} color="white" />;
      case 'thermometer':
        return <Thermometer size={20} color="white" />;
      case 'smart-toilet':
        return <Activity size={20} color="white" />;
      default:
        return <Activity size={20} color="white" />;
    }
  };

  const getStatusColor = (status: HealthDevice['status']) => {
    switch (status) {
      case 'connected':
        return COLORS.success;
      case 'disconnected':
        return COLORS.error;
      case 'syncing':
        return COLORS.warning;
    }
  };

  const getStatusText = (status: HealthDevice['status']) => {
    switch (status) {
      case 'connected':
        return '已连接';
      case 'disconnected':
        return '未连接';
      case 'syncing':
        return '同步中';
    }
  };

  // 点击设备卡片，导航到设备管理页并传递deviceId
  const handleDevicePress = (deviceId: number) => {
    navigation.navigate('DeviceManagement', { deviceId });
  };

  return (
    <Theme name="light">
      <Card
        padding="$4"
        borderRadius="$4"
        backgroundColor="$cardBg"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={4}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <H3 fontSize="$6" color="$text" fontWeight="600">
            设备管理
          </H3>
          <Button
            size="$3"
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="$borderColor"
            onPress={onManageDevices}
          >
            <XStack space="$1" alignItems="center">
              <Text fontSize="$3" color="$text">查看更多</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </XStack>
          </Button>
        </XStack>

        <YStack space="$3">
          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              onPress={() => handleDevicePress(device.id)}
              activeOpacity={0.7}
            >
              <View
                padding="$4"
                borderRadius="$3"
                backgroundColor="$surface"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack space="$4" alignItems="center" flex={1}>
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={COLORS.primaryLight}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {getDeviceIcon(device.type)}
                    </View>
                    <YStack flex={1}>
                      <XStack space="$2" alignItems="center" marginBottom="$1">
                        <H3 fontSize="$4" fontWeight="600" color="$text">
                          {device.name}
                        </H3>
                        <View
                          width={8}
                          height={8}
                          borderRadius={4}
                          backgroundColor={getStatusColor(device.status)}
                        />
                      </XStack>
                      <XStack space="$4" alignItems="center">
                        <Text fontSize="$3" color="$textSecondary">
                          最后同步: {device.lastSync}
                        </Text>
                        {device.connection !== 'manual' && device.status !== 'disconnected' && (
                          <XStack space="$1" alignItems="center">
                            {device.connection === "wifi" ?
                              <Wifi size={12} color={COLORS.textSecondary} /> :
                              device.connection === "bluetooth" ?
                              <Bluetooth size={12} color={COLORS.textSecondary} /> :
                              <Edit size={12} color={COLORS.textSecondary} />
                            }
                            <Text fontSize="$3" color="$textSecondary">
                              {device.connection === "wifi" ? "WiFi" : device.connection === "bluetooth" ? "蓝牙" : "手动"}
                            </Text>
                          </XStack>
                        )}
                      </XStack>
                      {device.connection !== 'manual' && (
                        <Text fontSize="$2" color={getStatusColor(device.status)} marginTop="$1">
                          {getStatusText(device.status)}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                  <XStack space="$2" alignItems="center">
                    {device.connection !== 'manual' && device.status !== 'disconnected' && (
                      <XStack space="$1" alignItems="center">
                        <Battery size={16} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {device.battery}%
                        </Text>
                      </XStack>
                    )}
                    <ChevronRight size={20} color={COLORS.textSecondary} />
                  </XStack>
                </XStack>
              </View>
            </TouchableOpacity>
          ))}
        </YStack>

        {/* Add Device Sheet */}
        <Sheet
          modal
          open={showAddDevice}
          onOpenChange={setShowAddDevice}
          snapPointsMode="fit"
          dismissOnSnapToBottom
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" paddingBottom="$8">
            <YStack space="$4">
              <H3 fontSize="$7" fontWeight="bold" color="$text" textAlign="center">
                添加新设备
              </H3>

              {/* Device Type Selection */}
              <YStack space="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  选择设备类型
                </Text>
                <XStack space="$3">
                  <XStack flex={1} space="$3">
                    <Button
                      flex={1}
                      height={80}
                      variant="outlined"
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      pressStyle={{ scale: 0.98 }}
                      flexDirection="column"
                      space="$2"
                    >
                      <Text fontSize="$8">🚽</Text>
                      <Text fontSize="$3" color="$text">智能马桶</Text>
                    </Button>
                    <Button
                      flex={1}
                      height={80}
                      variant="outlined"
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      pressStyle={{ scale: 0.98 }}
                      flexDirection="column"
                      space="$2"
                    >
                      <Text fontSize="$8">⌚</Text>
                      <Text fontSize="$3" color="$text">智能手环</Text>
                    </Button>
                  </XStack>
                </XStack>
                <XStack space="$3">
                  <XStack flex={1} space="$3">
                    <Button
                      flex={1}
                      height={80}
                      variant="outlined"
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      pressStyle={{ scale: 0.98 }}
                      flexDirection="column"
                      space="$2"
                    >
                      <Text fontSize="$8">🩺</Text>
                      <Text fontSize="$3" color="$text">血压计</Text>
                    </Button>
                    <Button
                      flex={1}
                      height={80}
                      variant="outlined"
                      borderColor="$borderColor"
                      backgroundColor="transparent"
                      pressStyle={{ scale: 0.98 }}
                      flexDirection="column"
                      space="$2"
                    >
                      <Text fontSize="$8">⚖️</Text>
                      <Text fontSize="$3" color="$text">体脂秤</Text>
                    </Button>
                  </XStack>
                </XStack>
              </YStack>

              {/* Connection Methods */}
              <YStack space="$3" marginTop="$4">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  连接方式
                </Text>
                <XStack space="$2">
                  <Button flex={1} backgroundColor="$primary">
                    <XStack space="$2" alignItems="center">
                      <Bluetooth size={16} color="white" />
                      <Text fontSize="$3" color="white">蓝牙搜索</Text>
                    </XStack>
                  </Button>
                  <Button
                    flex={1}
                    variant="outlined"
                    borderColor="$borderColor"
                    backgroundColor="transparent"
                  >
                    <Text fontSize="$3" color="$text">扫码添加</Text>
                  </Button>
                </XStack>
              </YStack>

              {/* Close Button */}
              <Button
                backgroundColor="$textSecondary"
                marginTop="$4"
                onPress={() => setShowAddDevice(false)}
              >
                <Text fontSize="$3" color="white">取消</Text>
              </Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </Card>
    </Theme>
  );
};