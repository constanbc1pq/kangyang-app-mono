import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
} from 'tamagui';
import { Pressable } from 'react-native';
import * as Icons from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface DeviceInfo {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  lastSync: string; // e.g., "2小时前"
  status: 'online' | 'offline' | 'syncing';
}

interface HealthMetricCardProps {
  title: string;
  value: string;
  unit: string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: keyof typeof Icons;
  color: string;
  bgColor: string;
  device?: DeviceInfo;
  onPress?: () => void;
  onDevicePress?: () => void;
}

/**
 * 健康指标卡片组件（带设备标签）
 * 显示健康数据及其来源设备信息
 */
export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  icon,
  color,
  bgColor,
  device,
  onPress,
  onDevicePress,
}) => {
  const IconComponent = (Icons as any)[icon] || Icons.Activity;

  // 获取设备状态颜色
  const getDeviceStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return COLORS.success;
      case 'offline':
        return COLORS.textSecondary;
      case 'syncing':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  // 获取设备状态文本
  const getDeviceStatusText = (status?: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'syncing':
        return '同步中';
      default:
        return '未知';
    }
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={onPress}
      disabled={!onPress}
    >
      <Card
        flex={1}
        padding="$4"
        borderRadius="$4"
        backgroundColor="$cardBg"
        pressStyle={{ scale: onPress ? 0.98 : 1 }}
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={4}
      >
        {/* 指标icon和变化标签 */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <View
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor={bgColor}
            justifyContent="center"
            alignItems="center"
          >
            <IconComponent size={20} color={color} />
          </View>
          {change && (
            <View
              backgroundColor={color}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$1" color="white" fontWeight="500">
                {change}
              </Text>
            </View>
          )}
        </XStack>

        {/* 指标名称 */}
        <Text fontSize="$3" color="$textSecondary" marginBottom="$1">
          {title}
        </Text>

        {/* 指标数值 */}
        <XStack alignItems="baseline" marginBottom="$3">
          <Text fontSize="$6" fontWeight="bold" color="$text">
            {value}
          </Text>
          <Text fontSize="$2" color="$textSecondary" marginLeft="$1">
            {unit}
          </Text>
        </XStack>

        {/* 设备来源信息 */}
        {device && (
          <Pressable onPress={onDevicePress}>
            <View
              backgroundColor="$surface"
              padding="$2"
              borderRadius="$3"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2" alignItems="center" flex={1}>
                  {/* 设备icon */}
                  <Text fontSize={14}>{device.icon}</Text>
                  {/* 设备名称 */}
                  <Text fontSize="$2" color="$text" numberOfLines={1} flex={1}>
                    {device.name}
                  </Text>
                </XStack>
                {/* 在线状态指示器 */}
                <View
                  width={6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={getDeviceStatusColor(device.status)}
                  marginLeft="$2"
                />
              </XStack>
              {/* 同步时间 */}
              <Text fontSize="$1" color="$textSecondary" marginTop="$1">
                {device.lastSync}同步
              </Text>
            </View>
          </Pressable>
        )}

        {/* 无设备数据提示 */}
        {!device && (
          <View
            backgroundColor="$surface"
            padding="$2"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$2" color="$textSecondary" textAlign="center">
              手动输入
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
};
