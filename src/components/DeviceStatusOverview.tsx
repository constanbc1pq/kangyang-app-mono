import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H4,
  useTheme,
  Paragraph,
} from 'tamagui';
import { Pressable } from 'react-native';
import { Plus, Wifi, WifiOff, Clock, AlertCircle, ChevronRight } from 'lucide-react-native';
import { HealthDevice } from '@/types/userData';

interface DeviceStatusOverviewProps {
  devices: HealthDevice[];
  onAddDevice?: () => void;
  onDevicePress?: (deviceId: number) => void;
  onManageDevices?: () => void;
}

/**
 * 设备状态快览组件
 * 展示所有设备的在线状态、同步时间等信息
 * 使用 Tamagui 主题色系统
 */
export const DeviceStatusOverview: React.FC<DeviceStatusOverviewProps> = ({
  devices,
  onAddDevice,
  onDevicePress,
  onManageDevices,
}) => {
  const theme = useTheme();
  // 统计设备状态（区分自动连接和手动录入设备）
  const autoDevices = devices.filter(d => d.connection !== 'manual');
  const manualDevices = devices.filter(d => d.connection === 'manual');

  const connectedCount = autoDevices.filter(d => d.status === 'connected').length;
  const disconnectedCount = autoDevices.filter(d => d.status === 'disconnected').length;
  const syncingCount = autoDevices.filter(d => d.status === 'syncing').length;
  const manualCount = manualDevices.length;

  // 获取设备图标
  const getDeviceIcon = (type: HealthDevice['type']): string => {
    switch (type) {
      case 'smartwatch':
        return '⌚';
      case 'blood-pressure':
        return '🌡️';
      case 'glucose-meter':
        return '💉';
      case 'scale':
        return '⚖️';
      case 'thermometer':
        return '🌡️';
      case 'smart-toilet':
        return '🚽';
      default:
        return '📱';
    }
  };

  // 获取设备状态颜色 - 使用主题色
  const getStatusColor = (status: HealthDevice['status']) => {
    switch (status) {
      case 'connected':
        return theme.success?.val;
      case 'syncing':
        return theme.primary?.val;
      case 'disconnected':
        return theme.color9?.val;
      default:
        return theme.color9?.val;
    }
  };

  // 获取设备状态文本
  const getStatusText = (status: HealthDevice['status']) => {
    switch (status) {
      case 'connected':
        return '在线';
      case 'syncing':
        return '同步中';
      case 'disconnected':
        return '离线';
      default:
        return '未知';
    }
  };

  // 判断设备是否需要关注（只对自动连接设备检查离线状态）
  const needsAttention = (device: HealthDevice) => {
    // 手动录入设备不需要关注连接状态
    if (device.connection === 'manual') return false;
    if (device.status === 'disconnected') return true;
    // 可以添加更多判断逻辑，比如最后同步时间超过24小时等
    return false;
  };

  // 获取设备连接方式文本
  const getConnectionText = (device: HealthDevice) => {
    if (device.connection === 'manual') return '手动录入';
    return getStatusText(device.status);
  };

  // 需要关注的设备
  const devicesNeedAttention = devices.filter(needsAttention);

  // 主题色值
  const primaryColor = theme.primary?.val || '#6366F1';
  const warningColor = theme.warning?.val || '#F59E0B';
  const successColor = theme.success?.val || '#10B981';
  const color9 = theme.color9?.val || '#7C818C';

  return (
    <Card
      padding="$2"
      borderRadius="$6"
     
      borderWidth={1}
      borderColor="$color5"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={0.12}
      shadowRadius={16}
      elevation={4}
    >
      {/* 标题和管理按钮 */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
        <H4 color="$color12">
          设备状态
        </H4>
        {onManageDevices && (
          <Pressable onPress={onManageDevices}>
            <XStack gap="$0.5" alignItems="center">
              <Text fontSize="$3" color="$primary" fontWeight="500">
                管理
              </Text>
              <ChevronRight size={14} color={primaryColor} />
            </XStack>
          </Pressable>
        )}
      </XStack>

      {/* 设备统计概览 */}
      <XStack
        gap="$2"
        marginBottom="$2"
        padding="$2"
        backgroundColor="$color2"
        borderRadius="$4"
      >
        {connectedCount > 0 && (
          <YStack flex={1} alignItems="center">
            <Text fontSize="$6" fontWeight="700" color={successColor}>
              {connectedCount}
            </Text>
            <Paragraph size="$2" color="$color10" marginTop="$1">
              在线
            </Paragraph>
          </YStack>
        )}
        {syncingCount > 0 && (
          <YStack flex={1} alignItems="center">
            <Text fontSize="$6" fontWeight="700" color={primaryColor}>
              {syncingCount}
            </Text>
            <Paragraph size="$2" color="$color10" marginTop="$1">
              同步中
            </Paragraph>
          </YStack>
        )}
        {manualCount > 0 && (
          <YStack flex={1} alignItems="center">
            <Text fontSize="$6" fontWeight="700" color={primaryColor}>
              {manualCount}
            </Text>
            <Paragraph size="$2" color="$color10" marginTop="$1">
              手动
            </Paragraph>
          </YStack>
        )}
        {disconnectedCount > 0 && (
          <YStack flex={1} alignItems="center">
            <Text fontSize="$6" fontWeight="700" color={color9}>
              {disconnectedCount}
            </Text>
            <Paragraph size="$2" color="$color10" marginTop="$1">
              离线
            </Paragraph>
          </YStack>
        )}
      </XStack>

      {/* 需要关注的设备 */}
      {devicesNeedAttention.length > 0 && (
        <View
          backgroundColor={`${warningColor}20`}
          padding="$2"
          borderRadius="$4"
          marginBottom="$4"
          borderWidth={1}
          borderColor={warningColor}
          borderLeftWidth={3}
          borderLeftColor={warningColor}
        >
          <XStack gap="$2" alignItems="center" marginBottom="$2">
            <AlertCircle size={16} color={warningColor} />
            <Text fontSize="$3" fontWeight="600" color={warningColor}>
              {devicesNeedAttention.length} 个设备需要关注
            </Text>
          </XStack>
          <Paragraph size="$2" color="$color10">
            {devicesNeedAttention.map(d => d.name).join('、')} 离线或长时间未同步
          </Paragraph>
        </View>
      )}

      {/* 设备列表 */}
      {devices.length > 0 ? (
        <YStack gap="$2">
          {devices.slice(0, 3).map((device) => (
            <Pressable
              key={device.id}
              onPress={() => onDevicePress?.(device.id)}
            >
              <View
                padding="$2"
                borderRadius="$4"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor={needsAttention(device) ? warningColor : '$color5'}
              >
                <XStack gap="$2" alignItems="center">
                  {/* 设备图标 */}
                  <View
                    width={40}
                    height={40}
                    borderRadius="$12"
                    backgroundColor={`${getStatusColor(device.status)}20`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={20}>{getDeviceIcon(device.type)}</Text>
                  </View>

                  {/* 设备信息 */}
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                      {device.name}
                    </Text>
                    <XStack gap="$2" alignItems="center">
                      <Clock size={12} color={color9} />
                      <Paragraph size="$2" color="$color10">
                        {device.lastSync}
                      </Paragraph>
                    </XStack>
                  </YStack>

                  {/* 状态指示器 */}
                  <XStack gap="$1" alignItems="center">
                    {device.connection === 'manual' ? (
                      // 手动录入设备显示编辑图标
                      <Text fontSize={12}>✏️</Text>
                    ) : device.status === 'connected' ? (
                      <Wifi size={16} color={getStatusColor(device.status)} />
                    ) : device.status === 'syncing' ? (
                      <Wifi size={16} color={getStatusColor(device.status)} />
                    ) : (
                      <WifiOff size={16} color={getStatusColor(device.status)} />
                    )}
                    <Text
                      fontSize="$2"
                      color={device.connection === 'manual' ? primaryColor : getStatusColor(device.status)}
                      fontWeight="600"
                    >
                      {getConnectionText(device)}
                    </Text>
                  </XStack>
                </XStack>
              </View>
            </Pressable>
          ))}

          {/* 查看全部按钮 */}
          {devices.length > 3 && (
            <Pressable onPress={onManageDevices}>
              <XStack
                padding="$2"
                justifyContent="center"
                alignItems="center"
                gap="$0.5"
              >
                <Text fontSize="$3" color="$primary" fontWeight="500">
                  查看全部 {devices.length} 个设备
                </Text>
                <ChevronRight size={14} color={primaryColor} />
              </XStack>
            </Pressable>
          )}
        </YStack>
      ) : (
        /* 空状态 */
        <YStack paddingVertical="$2" alignItems="center" gap="$2">
          <Text fontSize={48}>📱</Text>
          <Paragraph size="$4" color="$color10">
            暂无设备
          </Paragraph>
          {onAddDevice && (
            <Pressable onPress={onAddDevice}>
              <View
                marginTop="$2"
                backgroundColor="$primary"
                borderRadius="$10"
                paddingVertical="$2"
                paddingHorizontal="$2.5"
              >
                <XStack gap="$1" alignItems="center">
                  <Plus size={16} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    添加设备
                  </Text>
                </XStack>
              </View>
            </Pressable>
          )}
        </YStack>
      )}
    </Card>
  );
};
