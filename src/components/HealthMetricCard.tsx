import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  Theme,
  useTheme,
  Paragraph,
} from 'tamagui';
import { Pressable } from 'react-native';
import * as Icons from 'lucide-react-native';

interface DeviceInfo {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  lastSync: string; // e.g., "2小时前"
  status: 'online' | 'offline' | 'syncing';
}

/** 支持的主题色键名 */
type ThemeColorKey = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

/** 健康状态类型 */
type HealthStatus = 'normal' | 'warning' | 'danger';

interface HealthMetricCardProps {
  title: string;
  value: string;
  unit: string;
  change?: string;
  /** 健康状态，决定状态标签颜色 */
  status?: HealthStatus;
  trend?: 'up' | 'down' | 'stable';
  icon: keyof typeof Icons;
  /** 使用主题色键名，组件内部会从主题获取对应颜色 */
  colorKey: ThemeColorKey;
  device?: DeviceInfo;
  onPress?: () => void;
  onDevicePress?: () => void;
}

/**
 * 健康指标卡片组件（带设备标签）
 * 显示健康数据及其来源设备信息
 * 使用 Tamagui 主题色系统和官方组件规范
 */
export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  change,
  status = 'normal',
  trend,
  icon,
  colorKey,
  device,
  onPress,
  onDevicePress,
}) => {
  const theme = useTheme();
  const IconComponent = (Icons as any)[icon] || Icons.Activity;

  // 从主题获取颜色
  const color = theme[colorKey]?.val || theme.primary?.val;

  // 状态标签颜色 - 统一使用主题色，不随卡片颜色变化
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return theme.success?.val; // 深紫 - 正常
      case 'warning':
        return theme.warning?.val; // 中灰 - 需关注
      case 'danger':
        return theme.error?.val;   // 灰红 - 危险
      default:
        return theme.success?.val;
    }
  };
  const statusColor = getStatusColor();

  // 判断是否今天同步过 - 根据 lastSync 文本判断
  const isSyncedToday = (lastSync?: string) => {
    if (!lastSync) return false;
    // 如果包含"刚刚"、"分钟"、"小时"等表示今天同步过
    return lastSync.includes('刚刚') ||
           lastSync.includes('分钟') ||
           lastSync.includes('小时') ||
           lastSync.includes('秒');
  };

  // 获取同步状态颜色 - 今天同步过=主紫色，否则=灰色
  const getSyncStatusColor = (lastSync?: string) => {
    return isSyncedToday(lastSync) ? theme.primary?.val : theme.color8?.val;
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={onPress}
      disabled={!onPress}
    >
      <Card
        flex={1}
        padding="$1.5"
        borderRadius="$4"
        pressStyle={{ scale: onPress ? 0.98 : 1 }}
        borderWidth={1}
        borderColor="$color5"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.06}
        shadowRadius={4}
        elevation={1}
      >
        {/* 指标icon和变化标签 - 紧凑布局 */}
        <XStack justifyContent="space-between" alignItems="center" gap="$1" marginBottom={10}>
          <View
            width={28}
            height={28}
            borderRadius="$4"
            backgroundColor={`${color}15`}
            justifyContent="center"
            alignItems="center"
          >
            <IconComponent size={14} color={color} />
          </View>
          {change && (
            <View
              backgroundColor={statusColor}
              paddingHorizontal={5}
              paddingVertical="$0.5"
              borderRadius="$10"
            >
              <Text fontSize={10} color="white" fontWeight="500">
                {change}
              </Text>
            </View>
          )}
        </XStack>

        {/* 指标名称和单位 */}
        <YStack>
          <Text fontSize="$2" color="$color10">
            {title}
          </Text>
          <Text fontSize="$1" color="$color10">
            {unit}
          </Text>
        </YStack>

        {/* 指标数值 */}
        <Text fontSize="$5" fontWeight="700" color="$color12" marginBottom="$2">
          {value}
        </Text>

        {/* 设备来源信息 - 图标和设备名换行显示 */}
        {device && (
          <Pressable onPress={onDevicePress}>
            <View
              backgroundColor="$color2"
              paddingVertical="$1"
              paddingHorizontal="$1.5"
              borderRadius="$3"
              borderWidth={1}
              borderColor="$color5"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack alignItems="center" flex={1} gap="$0.5">
                  <Text fontSize={14}>{device.icon}</Text>
                  <Text fontSize={9} color="$color11" numberOfLines={1} textAlign="center">
                    {device.name}
                  </Text>
                </YStack>
                {/* 同步状态点：今天同步=紫色，否则=灰色 */}
                <View
                  width={6}
                  height={6}
                  borderRadius="$12"
                  backgroundColor={getSyncStatusColor(device.lastSync)}
                  position="absolute"
                  top={2}
                  right={2}
                />
              </XStack>
            </View>
          </Pressable>
        )}

        {/* 无设备数据提示 */}
        {!device && (
          <View
            backgroundColor="$color2"
            paddingVertical="$1"
            paddingHorizontal="$1.5"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$color5"
          >
            <Text fontSize={10} color="$color9" textAlign="center">
              手动输入
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
};
