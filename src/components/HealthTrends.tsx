import React from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H4,
  useTheme,
  Paragraph,
} from 'tamagui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface HealthTrendsProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

interface ChartData {
  labels: string[];
  values: number[];
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

/**
 * 健康趋势组件
 * 使用 Tamagui 主题色系统
 */
export const HealthTrends: React.FC<HealthTrendsProps> = ({ period, onPeriodChange }) => {
  const theme = useTheme();
  // Mock data - in real app this would come from API
  const getHealthData = (): { [key: string]: ChartData } => {
    const data = {
      week: {
        weight: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [69.2, 69.0, 68.8, 68.7, 68.5, 68.6, 68.5],
          unit: 'kg',
          trend: 'down' as const,
          change: '-0.7kg',
        },
        bloodPressure: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [125, 122, 118, 120, 119, 121, 120],
          unit: 'mmHg',
          trend: 'stable' as const,
          change: '正常',
        },
        heartRate: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [68, 70, 72, 69, 71, 73, 72],
          unit: 'bpm',
          trend: 'up' as const,
          change: '+4bpm',
        },
        sleep: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [7.2, 7.8, 6.5, 8.1, 7.5, 8.3, 7.9],
          unit: '小时',
          trend: 'up' as const,
          change: '+0.7h',
        },
      },
      month: {
        weight: {
          labels: ['第1周', '第2周', '第3周', '第4周'],
          values: [69.5, 69.2, 68.9, 68.5],
          unit: 'kg',
          trend: 'down' as const,
          change: '-1.0kg',
        },
        bloodPressure: {
          labels: ['第1周', '第2周', '第3周', '第4周'],
          values: [128, 125, 122, 120],
          unit: 'mmHg',
          trend: 'down' as const,
          change: '-8mmHg',
        },
        heartRate: {
          labels: ['第1周', '第2周', '第3周', '第4周'],
          values: [70, 69, 71, 72],
          unit: 'bpm',
          trend: 'stable' as const,
          change: '+2bpm',
        },
        sleep: {
          labels: ['第1周', '第2周', '第3周', '第4周'],
          values: [7.1, 7.4, 7.6, 7.8],
          unit: '小时',
          trend: 'up' as const,
          change: '+0.7h',
        },
      },
      year: {
        weight: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          values: [70.2, 69.8, 69.5, 69.1, 68.8, 68.5],
          unit: 'kg',
          trend: 'down' as const,
          change: '-1.7kg',
        },
        bloodPressure: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          values: [132, 128, 125, 122, 120, 118],
          unit: 'mmHg',
          trend: 'down' as const,
          change: '-14mmHg',
        },
        heartRate: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          values: [68, 69, 70, 71, 72, 72],
          unit: 'bpm',
          trend: 'up' as const,
          change: '+4bpm',
        },
        sleep: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          values: [6.8, 7.0, 7.2, 7.5, 7.8, 8.0],
          unit: '小时',
          trend: 'up' as const,
          change: '+1.2h',
        },
      },
    };
    return data[period as keyof typeof data] || data.week;
  };

  const healthData = getHealthData();

  // 趋势图标 - 使用主题色
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color={theme.success?.val} />;
      case 'down':
        return <TrendingDown size={16} color={theme.success?.val} />;
      case 'stable':
        return <Minus size={16} color={theme.color9?.val} />;
      default:
        return <Minus size={16} color={theme.color9?.val} />;
    }
  };

  const SimpleBarChart: React.FC<{ data: ChartData; color: string; title: string }> = ({
    data,
    color,
    title,
  }) => {
    const maxValue = Math.max(...data.values);
    const minValue = Math.min(...data.values);
    const range = maxValue - minValue || 1;

    return (
      <Card
        padding="$2"
        borderRadius="$5"
        backgroundColor="$color2"
        borderWidth={1}
        borderColor="$color5"
        marginBottom="$2"
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            {title}
          </Text>
          <XStack gap="$2" alignItems="center">
            {getTrendIcon(data.trend)}
            <Text fontSize="$3" color="$color10" fontWeight="600">
              {data.change}
            </Text>
          </XStack>
        </XStack>

        <YStack gap="$2">
          {/* Current Value */}
          <XStack justifyContent="space-between" alignItems="baseline">
            <Paragraph size="$3" color="$color10">当前值</Paragraph>
            <Text fontSize="$6" fontWeight="700" color="$color12">
              {data.values[data.values.length - 1]} {data.unit}
            </Text>
          </XStack>

          {/* Mini Bar Chart */}
          <YStack gap="$2">
            <Paragraph size="$3" color="$color10">{period === 'week' ? '本周趋势' : period === 'month' ? '本月趋势' : '今年趋势'}</Paragraph>
            <XStack gap="$1" alignItems="flex-end" height={60}>
              {data.values.map((value, index) => {
                const height = ((value - minValue) / range) * 50 + 10;
                return (
                  <YStack key={index} alignItems="center" flex={1}>
                    <View
                      height={height}
                      backgroundColor={color}
                      borderRadius="$2"
                      width="80%"
                      marginBottom="$1"
                    />
                    <Text fontSize="$1" color="$color9">
                      {data.labels[index]}
                    </Text>
                  </YStack>
                );
              })}
            </XStack>
          </YStack>
        </YStack>
      </Card>
    );
  };

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
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
        <H4 color="$color12">
          健康趋势
        </H4>
        <XStack gap="$1" backgroundColor="$color2" borderRadius="$10" padding="$1">
          <Button
            size="$2"
            backgroundColor={period === 'week' ? '$primary' : 'transparent'}
            onPress={() => onPeriodChange('week')}
            paddingHorizontal="$3"
          >
            <Text
              fontSize="$2"
              color={period === 'week' ? 'white' : '$color10'}
              fontWeight={period === 'week' ? '600' : '400'}
            >
              周
            </Text>
          </Button>
          <Button
            size="$2"
            backgroundColor={period === 'month' ? '$primary' : 'transparent'}
            onPress={() => onPeriodChange('month')}
            paddingHorizontal="$3"
          >
            <Text
              fontSize="$2"
              color={period === 'month' ? 'white' : '$color10'}
              fontWeight={period === 'month' ? '600' : '400'}
            >
              月
            </Text>
          </Button>
          <Button
            size="$2"
            backgroundColor={period === 'year' ? '$primary' : 'transparent'}
            onPress={() => onPeriodChange('year')}
            paddingHorizontal="$3"
          >
            <Text
              fontSize="$2"
              color={period === 'year' ? 'white' : '$color10'}
              fontWeight={period === 'year' ? '600' : '400'}
            >
              年
            </Text>
          </Button>
        </XStack>
      </XStack>

      <YStack gap="$2">
        <SimpleBarChart
          data={healthData.weight}
          color={theme.primary?.val || '#6366F1'}
          title="体重趋势"
        />
        <SimpleBarChart
          data={healthData.bloodPressure}
          color={theme.secondary?.val || '#22D3EE'}
          title="血压趋势"
        />
        <SimpleBarChart
          data={healthData.heartRate}
          color={theme.error?.val || '#EF4444'}
          title="心率趋势"
        />
        <SimpleBarChart
          data={healthData.sleep}
          color={theme.accent?.val || '#A78BFA'}
          title="睡眠趋势"
        />
      </YStack>
    </Card>
  );
};