import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  Theme,
} from 'tamagui';
import { Pressable, TouchableOpacity } from 'react-native';
import { Plus, Wifi, WifiOff, Clock, AlertCircle, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
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
 */
export const DeviceStatusOverview: React.FC<DeviceStatusOverviewProps> = ({
  devices,
  onAddDevice,
  onDevicePress,
  onManageDevices,
}) => {
  // 统计设备状态
  const connectedCount = devices.filter(d => d.status === 'connected').length;
  const disconnectedCount = devices.filter(d => d.status === 'disconnected').length;
  const syncingCount = devices.filter(d => d.status === 'syncing').length;

  // 获取设备图标
  const getDeviceIcon = (type: HealthDevice['type']): string => {
    switch (type) {
      case 'smartwatch':
        return '⌚';
      case 'blood-pressure':
        return '💉';
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

  // 获取设备状态颜色
  const getStatusColor = (status: HealthDevice['status']) => {
    switch (status) {
      case 'connected':
        return COLORS.success;
      case 'syncing':
        return COLORS.primary;
      case 'disconnected':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
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

  // 判断设备是否需要关注（离线或长时间未同步）
  const needsAttention = (device: HealthDevice) => {
    if (device.status === 'disconnected') return true;
    // 可以添加更多判断逻辑，比如最后同步时间超过24小时等
    return false;
  };

  // 需要关注的设备
  const devicesNeedAttention = devices.filter(needsAttention);

  return (
    <Theme name="light">
      <Card
        padding="$4"
        borderRadius="$4"
        backgroundColor="$surface"
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={4}
      >
        {/* 标题和管理按钮 */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <H3 fontSize="$6" color="$text" fontWeight="600">
            设备状态
          </H3>
          {onManageDevices && (
            <TouchableOpacity onPress={onManageDevices}>
              <XStack space="$1" alignItems="center">
                <Text fontSize="$3" color="$primary" fontWeight="600">
                  管理
                </Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </XStack>
            </TouchableOpacity>
          )}
        </XStack>

        {/* 设备统计概览 */}
        <XStack
          space="$3"
          marginBottom="$4"
          padding="$3"
          backgroundColor="$background"
          borderRadius="$3"
        >
          <YStack flex={1} alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color={COLORS.success}>
              {connectedCount}
            </Text>
            <Text fontSize="$2" color="$textSecondary" marginTop="$1">
              在线
            </Text>
          </YStack>
          {syncingCount > 0 && (
            <YStack flex={1} alignItems="center">
              <Text fontSize="$6" fontWeight="bold" color={COLORS.primary}>
                {syncingCount}
              </Text>
              <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                同步中
              </Text>
            </YStack>
          )}
          {disconnectedCount > 0 && (
            <YStack flex={1} alignItems="center">
              <Text fontSize="$6" fontWeight="bold" color={COLORS.textSecondary}>
                {disconnectedCount}
              </Text>
              <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                离线
              </Text>
            </YStack>
          )}
        </XStack>

        {/* 需要关注的设备 */}
        {devicesNeedAttention.length > 0 && (
          <View
            backgroundColor={`${COLORS.warning}20`}
            padding="$3"
            borderRadius="$3"
            marginBottom="$4"
            borderLeftWidth={3}
            borderLeftColor={COLORS.warning}
          >
            <XStack space="$2" alignItems="center" marginBottom="$2">
              <AlertCircle size={16} color={COLORS.warning} />
              <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                {devicesNeedAttention.length} 个设备需要关注
              </Text>
            </XStack>
            <Text fontSize="$2" color="$textSecondary">
              {devicesNeedAttention.map(d => d.name).join('、')} 离线或长时间未同步
            </Text>
          </View>
        )}

        {/* 设备列表 */}
        {devices.length > 0 ? (
          <YStack>
            {devices.slice(0, 3).map((device, index) => (
              <View key={device.id} marginBottom={index < 2 ? "$3" : 0}>
                <TouchableOpacity
                  onPress={() => onDevicePress?.(device.id)}
                >
                  <View
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor={needsAttention(device) ? COLORS.warning : '$borderColor'}
                  >
                  <XStack space="$3" alignItems="center">
                    {/* 设备图标 */}
                    <View
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={`${getStatusColor(device.status)}20`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={20}>{getDeviceIcon(device.type)}</Text>
                    </View>

                    {/* 设备信息 */}
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$1">
                        {device.name}
                      </Text>
                      <XStack space="$2" alignItems="center">
                        <Clock size={12} color={COLORS.textSecondary} />
                        <Text fontSize="$2" color="$textSecondary">
                          {device.lastSync}
                        </Text>
                      </XStack>
                    </YStack>

                    {/* 状态指示器 */}
                    <XStack space="$1" alignItems="center">
                      {device.status === 'connected' ? (
                        <Wifi size={16} color={getStatusColor(device.status)} />
                      ) : device.status === 'syncing' ? (
                        <Wifi size={16} color={getStatusColor(device.status)} />
                      ) : (
                        <WifiOff size={16} color={getStatusColor(device.status)} />
                      )}
                      <Text fontSize="$2" color={getStatusColor(device.status)} fontWeight="600">
                        {getStatusText(device.status)}
                      </Text>
                    </XStack>
                  </XStack>
                </View>
              </TouchableOpacity>
              </View>
            ))}

            {/* 查看全部按钮 */}
            {devices.length > 3 && (
              <View marginTop="$3">
                <TouchableOpacity onPress={onManageDevices}>
                  <View
                    padding="$2"
                    borderRadius="$3"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize="$3" color="$primary" fontWeight="600">
                      查看全部 {devices.length} 个设备
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </YStack>
        ) : (
          /* 空状态 */
          <YStack paddingVertical="$4" alignItems="center" space="$2">
            <Text fontSize={48}>📱</Text>
            <Text fontSize="$4" color="$textSecondary">
              暂无设备
            </Text>
            {onAddDevice && (
              <TouchableOpacity onPress={onAddDevice}>
                <View
                  marginTop="$2"
                  backgroundColor={COLORS.primary}
                  borderRadius="$3"
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                >
                  <XStack space="$1" alignItems="center">
                    <Plus size={16} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="600">
                      添加设备
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            )}
          </YStack>
        )}
      </Card>
    </Theme>
  );
};
