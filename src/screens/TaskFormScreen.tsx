import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView as RNScrollView, Alert, Platform } from 'react-native';
import { View, Text, YStack, XStack, Card, Theme, H2, Input, TextArea, Switch } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastController } from '@tamagui/toast';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  Activity,
  Utensils,
  Pill,
  Heart,
  Sunrise,
  Clock,
  Calendar,
  Bell,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useNavigation } from '@react-navigation/native';
import { getTaskById, createTask, updateTask } from '@/services/userDataService';
import { HealthTask } from '@/types/userData';

interface TaskFormScreenProps {
  route?: {
    params?: {
      taskId?: string;
    };
  };
}

// 任务类型配置
const TASK_TYPES: Array<{
  category: HealthTask['category'];
  label: string;
  icon: string;
  color: string;
}> = [
  { category: 'fitness', label: '运动健身', icon: 'Activity', color: '#10b981' },
  { category: 'nutrition', label: '饮食营养', icon: 'Utensils', color: '#3b82f6' },
  { category: 'medication', label: '用药提醒', icon: 'Pill', color: '#ef4444' },
  { category: 'monitoring', label: '健康监测', icon: 'Heart', color: '#f59e0b' },
  { category: 'lifestyle', label: '生活习惯', icon: 'Sunrise', color: '#8b5cf6' },
];

// 优先级配置
const PRIORITIES: Array<{
  value: HealthTask['priority'];
  label: string;
  color: string;
}> = [
  { value: 'low', label: '低', color: COLORS.textSecondary },
  { value: 'medium', label: '中', color: COLORS.warning },
  { value: 'high', label: '高', color: COLORS.error },
];

// 重复频率配置
const REPEAT_OPTIONS: Array<{
  value: HealthTask['repeatFrequency'];
  label: string;
}> = [
  { value: 'none', label: '不重复' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
];

// 提醒时间选项
const REMINDER_TIMES = [5, 15, 30, 60];

export const TaskFormScreen: React.FC<TaskFormScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const toast = useToastController();
  const isEdit = !!route?.params?.taskId;
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HealthTask['category']>('fitness');
  const [priority, setPriority] = useState<HealthTask['priority']>('medium');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [repeatFrequency, setRepeatFrequency] = useState<HealthTask['repeatFrequency']>('daily');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(15);

  // Time picker state
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Load task data if editing
  useEffect(() => {
    if (isEdit && route?.params?.taskId) {
      loadTask(route.params.taskId);
    }
  }, [isEdit, route?.params?.taskId]);

  const loadTask = async (taskId: string) => {
    setLoading(true);
    try {
      const task = await getTaskById(taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setCategory(task.category);
        setPriority(task.priority);

        if (task.startTime) {
          const [hours, minutes] = task.startTime.split(':');
          const date = new Date();
          date.setHours(parseInt(hours), parseInt(minutes));
          setStartTime(date);
        }

        if (task.endTime) {
          const [hours, minutes] = task.endTime.split(':');
          const date = new Date();
          date.setHours(parseInt(hours), parseInt(minutes));
          setEndTime(date);
        }

        setRepeatFrequency(task.repeatFrequency);
        setReminder(task.reminder);
        setReminderTime(task.reminderTime || 15);
      }
    } catch (error) {
      console.error('加载任务失败:', error);
      Alert.alert('错误', '加载任务失败');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('提示', '请输入任务标题');
      return;
    }

    if (!startTime) {
      Alert.alert('提示', '请选择开始时间');
      return;
    }

    setLoading(true);
    try {
      const selectedType = TASK_TYPES.find(t => t.category === category);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        icon: selectedType?.icon || 'CheckCircle',
        color: selectedType?.color || COLORS.primary,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        repeatFrequency,
        progress: 0,
        reminder,
        reminderTime: reminder ? reminderTime : undefined,
        status: 'pending' as const,
      };

      if (isEdit && route?.params?.taskId) {
        const success = await updateTask(route.params.taskId, taskData);
        if (success) {
          toast.show('更新成功', {
            message: '任务信息已更新',
          });
          navigation.goBack();
        } else {
          toast.show('更新失败', {
            message: '任务不存在',
          });
        }
      } else {
        const newTask = await createTask(taskData);
        if (newTask) {
          toast.show('创建成功', {
            message: '任务已添加到列表',
          });
          navigation.goBack();
        } else {
          toast.show('创建失败', {
            message: '请重试',
          });
        }
      }
    } catch (error) {
      console.error('保存任务失败:', error);
      toast.show('保存失败', {
        message: '请检查输入并重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndTime(selectedDate);
    }
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="white"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <H2 fontSize="$7" fontWeight="bold" color="$text" marginLeft="$3" flex={1}>
            {isEdit ? '编辑任务' : '创建任务'}
          </H2>
        </XStack>

        <RNScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" space="$4">
            {/* Task Title */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                任务标题 *
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="例如：每日饮水目标"
                fontSize="$4"
                borderWidth={1}
                borderColor="$borderColor"
                backgroundColor="$background"
                placeholderTextColor={COLORS.textSecondary}
              />
            </Card>

            {/* Task Type */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                任务类型 *
              </Text>
              <YStack space="$2">
                <XStack space="$2">
                  {TASK_TYPES.slice(0, 3).map(type => (
                    <TouchableOpacity
                      key={type.category}
                      style={{ flex: 1 }}
                      onPress={() => setCategory(type.category)}
                    >
                      <View
                        padding="$3"
                        borderRadius="$3"
                        backgroundColor={category === type.category ? `${type.color}20` : '$background'}
                        borderWidth={2}
                        borderColor={category === type.category ? type.color : '$borderColor'}
                        alignItems="center"
                        height={80}
                        justifyContent="center"
                      >
                        <Text fontSize="$6" marginBottom="$2">{type.icon === 'Activity' ? '🏃' : type.icon === 'Utensils' ? '🍎' : '💊'}</Text>
                        <Text
                          fontSize="$3"
                          color={category === type.category ? type.color : '$text'}
                          fontWeight={category === type.category ? '600' : 'normal'}
                        >
                          {type.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </XStack>
                <XStack space="$2">
                  {TASK_TYPES.slice(3, 5).map(type => (
                    <TouchableOpacity
                      key={type.category}
                      style={{ flex: 1 }}
                      onPress={() => setCategory(type.category)}
                    >
                      <View
                        padding="$3"
                        borderRadius="$3"
                        backgroundColor={category === type.category ? `${type.color}20` : '$background'}
                        borderWidth={2}
                        borderColor={category === type.category ? type.color : '$borderColor'}
                        alignItems="center"
                        height={80}
                        justifyContent="center"
                      >
                        <Text fontSize="$6" marginBottom="$2">{type.icon === 'Heart' ? '❤️' : '🌅'}</Text>
                        <Text
                          fontSize="$3"
                          color={category === type.category ? type.color : '$text'}
                          fontWeight={category === type.category ? '600' : 'normal'}
                        >
                          {type.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </YStack>
            </Card>

            {/* Description */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                任务描述
              </Text>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="详细描述任务内容..."
                fontSize="$4"
                borderWidth={1}
                borderColor="$borderColor"
                backgroundColor="$background"
                placeholderTextColor={COLORS.textSecondary}
                numberOfLines={4}
                height={100}
              />
            </Card>

            {/* Priority */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                优先级
              </Text>
              <XStack space="$2">
                {PRIORITIES.map(p => (
                  <TouchableOpacity
                    key={p.value}
                    style={{ flex: 1 }}
                    onPress={() => setPriority(p.value)}
                  >
                    <View
                      padding="$3"
                      borderRadius="$3"
                      backgroundColor={priority === p.value ? `${p.color}20` : '$background'}
                      borderWidth={2}
                      borderColor={priority === p.value ? p.color : '$borderColor'}
                      alignItems="center"
                    >
                      <Text
                        fontSize="$4"
                        color={priority === p.value ? p.color : '$text'}
                        fontWeight={priority === p.value ? '600' : 'normal'}
                      >
                        {p.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </Card>

            {/* Time Settings */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                时间设置
              </Text>

              <YStack space="$3">
                {/* Start Time */}
                <YStack space="$2">
                  <Text fontSize="$3" color="$textSecondary">开始时间 *</Text>
                  {Platform.OS === 'web' ? (
                    <View
                      padding="$3"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor="$borderColor"
                      backgroundColor="$background"
                    >
                      <XStack space="$2" alignItems="center">
                        <Clock size={20} color={COLORS.primary} />
                        <input
                          type="time"
                          value={startTime ? formatTime(startTime) : ''}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours), parseInt(minutes));
                            setStartTime(date);
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            fontSize: '16px',
                            outline: 'none',
                            flex: 1,
                          }}
                        />
                      </XStack>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                      <View
                        padding="$3"
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor="$borderColor"
                        backgroundColor="$background"
                      >
                        <XStack space="$2" alignItems="center">
                          <Clock size={20} color={COLORS.primary} />
                          <Text fontSize="$4" color="$text">
                            {startTime ? formatTime(startTime) : '选择时间'}
                          </Text>
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  )}
                </YStack>

                {/* End Time */}
                <YStack space="$2">
                  <Text fontSize="$3" color="$textSecondary">结束时间（可选）</Text>
                  {Platform.OS === 'web' ? (
                    <View
                      padding="$3"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor="$borderColor"
                      backgroundColor="$background"
                    >
                      <XStack space="$2" alignItems="center">
                        <Clock size={20} color={COLORS.textSecondary} />
                        <input
                          type="time"
                          value={endTime ? formatTime(endTime) : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [hours, minutes] = e.target.value.split(':');
                              const date = new Date();
                              date.setHours(parseInt(hours), parseInt(minutes));
                              setEndTime(date);
                            } else {
                              setEndTime(null);
                            }
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            fontSize: '16px',
                            outline: 'none',
                            flex: 1,
                          }}
                        />
                      </XStack>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                      <View
                        padding="$3"
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor="$borderColor"
                        backgroundColor="$background"
                      >
                        <XStack space="$2" alignItems="center">
                          <Clock size={20} color={COLORS.textSecondary} />
                          <Text fontSize="$4" color="$text">
                            {endTime ? formatTime(endTime) : '选择时间'}
                          </Text>
                        </XStack>
                      </View>
                    </TouchableOpacity>
                  )}
                </YStack>
              </YStack>
            </Card>

            {/* Repeat Frequency */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
                重复频率
              </Text>
              <XStack space="$2" flexWrap="wrap">
                {REPEAT_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setRepeatFrequency(option.value)}
                  >
                    <View
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$3"
                      backgroundColor={repeatFrequency === option.value ? COLORS.primary : '$background'}
                      borderWidth={2}
                      borderColor={repeatFrequency === option.value ? COLORS.primary : '$borderColor'}
                      marginBottom="$2"
                    >
                      <Text
                        fontSize="$3"
                        color={repeatFrequency === option.value ? 'white' : '$text'}
                        fontWeight={repeatFrequency === option.value ? '600' : 'normal'}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            </Card>

            {/* Reminder */}
            <Card padding="$4" borderRadius="$4" backgroundColor="$surface">
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <XStack space="$2" alignItems="center">
                  <Bell size={20} color={COLORS.primary} />
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    提醒设置
                  </Text>
                </XStack>
                <Switch
                  checked={reminder}
                  onCheckedChange={setReminder}
                  size="$3"
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>

              {reminder && (
                <YStack space="$2">
                  <Text fontSize="$3" color="$textSecondary">提前提醒</Text>
                  <XStack space="$2">
                    {REMINDER_TIMES.map(time => (
                      <TouchableOpacity
                        key={time}
                        onPress={() => setReminderTime(time)}
                      >
                        <View
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$3"
                          backgroundColor={reminderTime === time ? COLORS.primaryLight : '$background'}
                          borderWidth={2}
                          borderColor={reminderTime === time ? COLORS.primary : '$borderColor'}
                        >
                          <Text
                            fontSize="$3"
                            color={reminderTime === time ? COLORS.primary : '$text'}
                            fontWeight={reminderTime === time ? '600' : 'normal'}
                          >
                            {time}分钟
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </XStack>
                </YStack>
              )}
            </Card>

            {/* Action Buttons */}
            <YStack space="$3">
              <TouchableOpacity onPress={handleSave} disabled={loading}>
                <View
                  padding="$4"
                  borderRadius="$4"
                  backgroundColor={loading ? COLORS.textSecondary : COLORS.success}
                  alignItems="center"
                >
                  <Text fontSize="$5" fontWeight="bold" color="white">
                    {loading ? '保存中...' : isEdit ? '保存修改' : '创建任务'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View
                  padding="$4"
                  borderRadius="$4"
                  backgroundColor="$surface"
                  borderWidth={1}
                  borderColor="$borderColor"
                  alignItems="center"
                >
                  <Text fontSize="$5" fontWeight="600" color="$text">
                    取消
                  </Text>
                </View>
              </TouchableOpacity>
            </YStack>

            {/* Bottom padding */}
            <View height={20} />
          </YStack>
        </RNScrollView>

        {/* Date Time Pickers - Only for mobile platforms */}
        {Platform.OS !== 'web' && showStartTimePicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleStartTimeChange}
          />
        )}

        {Platform.OS !== 'web' && showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleEndTimeChange}
          />
        )}
      </SafeAreaView>
    </Theme>
  );
};