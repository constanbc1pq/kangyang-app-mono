import React, { useState } from 'react';
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
import { Plus, Bluetooth, Wifi, Battery, Settings, Trash2, Watch, Heart, Activity, Scale, Thermometer, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useDevices } from '@/contexts/DeviceContext';
import type { Device } from '@/contexts/DeviceContext';

interface DeviceManagerProps {
  onManageDevices?: () => void;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({ onManageDevices }) => {
  const { devices, deleteDevice, addDevice } = useDevices();
  const [showAddDevice, setShowAddDevice] = useState(false);

  const getDeviceIcon = (type: Device['type']) => {
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

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'connected':
        return COLORS.success;
      case 'disconnected':
        return COLORS.error;
      case 'syncing':
        return COLORS.warning;
    }
  };

  const getStatusText = (status: Device['status']) => {
    switch (status) {
      case 'connected':
        return '已连接';
      case 'disconnected':
        return '未连接';
      case 'syncing':
        return '同步中';
    }
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
          {devices.slice(0, 3).map((device) => (
            <View
              key={device.id}
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
                      {device.status !== 'disconnected' && (
                        <XStack space="$1" alignItems="center">
                          {device.connection === "wifi" ?
                            <Wifi size={12} color={COLORS.textSecondary} /> :
                            <Bluetooth size={12} color={COLORS.textSecondary} />
                          }
                          <Text fontSize="$3" color="$textSecondary">
                            {device.connection === "wifi" ? "WiFi" : "蓝牙"}
                          </Text>
                        </XStack>
                      )}
                    </XStack>
                    <Text fontSize="$2" color={getStatusColor(device.status)} marginTop="$1">
                      {getStatusText(device.status)}
                    </Text>
                  </YStack>
                </XStack>
                <XStack space="$2" alignItems="center">
                  {device.status !== 'disconnected' && (
                    <XStack space="$1" alignItems="center">
                      <Battery size={16} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {device.battery}%
                      </Text>
                    </XStack>
                  )}
                  <Button size="$3" chromeless>
                    <Settings size={16} color={COLORS.textSecondary} />
                  </Button>
                  <Button size="$3" chromeless>
                    <Trash2 size={16} color={COLORS.error} />
                  </Button>
                </XStack>
              </XStack>
            </View>
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