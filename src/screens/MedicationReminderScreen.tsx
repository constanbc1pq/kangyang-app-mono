import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H2,
  H3,
  Theme,
  ScrollView,
} from 'tamagui';
import {
  Pressable,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Plus,
  Clock,
  Pill,
  Bell,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Calendar,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  nextDose: string;
  status: 'upcoming' | 'taken' | 'missed';
  notes?: string;
  color: string;
}

export const MedicationReminderScreen: React.FC = () => {
  const navigation = useNavigation();
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: '阿司匹林肠溶片',
      dosage: '100mg',
      frequency: '每日一次',
      times: ['08:00'],
      nextDose: '今天 08:00',
      status: 'upcoming',
      notes: '饭后服用',
      color: COLORS.info,
    },
    {
      id: 2,
      name: '降压药',
      dosage: '5mg',
      frequency: '每日两次',
      times: ['08:00', '20:00'],
      nextDose: '今天 20:00',
      status: 'taken',
      notes: '早晚各一次',
      color: COLORS.success,
    },
    {
      id: 3,
      name: '维生素D',
      dosage: '400IU',
      frequency: '每日一次',
      times: ['12:00'],
      nextDose: '今天 12:00',
      status: 'missed',
      notes: '随餐服用',
      color: COLORS.warning,
    },
    {
      id: 4,
      name: '钙片',
      dosage: '600mg',
      frequency: '每日一次',
      times: ['21:00'],
      nextDose: '今天 21:00',
      status: 'upcoming',
      color: COLORS.primaryDark,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: '',
  });

  const getStatusBadge = (status: Medication['status']) => {
    switch (status) {
      case 'upcoming':
        return { text: '待服用', color: COLORS.info };
      case 'taken':
        return { text: '已服用', color: COLORS.success };
      case 'missed':
        return { text: '已错过', color: COLORS.error };
    }
  };

  const getStatusIcon = (status: Medication['status']) => {
    switch (status) {
      case 'upcoming':
        return <Clock size={20} color={COLORS.info} />;
      case 'taken':
        return <Check size={20} color={COLORS.success} />;
      case 'missed':
        return <AlertCircle size={20} color={COLORS.error} />;
    }
  };

  const handleMarkAsTaken = (id: number) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, status: 'taken' as const } : med
    ));
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const newMed: Medication = {
        id: medications.length + 1,
        name: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency || '每日一次',
        times: [newMedication.time || '08:00'],
        nextDose: `今天 ${newMedication.time || '08:00'}`,
        status: 'upcoming',
        notes: newMedication.notes,
        color: COLORS.primary,
      };
      setMedications([...medications, newMed]);
      setIsAddDialogOpen(false);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        time: '',
        notes: '',
      });
    }
  };

  const upcomingMeds = medications.filter(m => m.status === 'upcoming');
  const takenMeds = medications.filter(m => m.status === 'taken');
  const missedMeds = medications.filter(m => m.status === 'missed');

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* 标题栏 */}
        <View
          backgroundColor="$cardBg"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack space="$3" alignItems="center">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$surface"
                >
                  <ArrowLeft size={20} color={COLORS.text} />
                </View>
              </TouchableOpacity>
              <YStack>
                <H2 fontSize="$6" fontWeight="600" color="$text">
                  用药提醒
                </H2>
                <Text fontSize="$2" color="$textSecondary">
                  {upcomingMeds.length} 个待服用 · {takenMeds.length} 个已完成
                </Text>
              </YStack>
            </XStack>
            <Pressable onPress={() => setIsAddDialogOpen(true)}>
              <View
                backgroundColor={COLORS.primary}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$3"
              >
                <XStack space="$2" alignItems="center">
                  <Plus size={16} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="500">
                    添加
                  </Text>
                </XStack>
              </View>
            </Pressable>
          </XStack>
        </View>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <YStack padding="$4" space="$4">
            {/* 今日用药统计卡片 */}
            <View borderRadius="$4" overflow="hidden">
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 24 }}
              >
                <YStack space="$3">
                  <XStack space="$2" alignItems="center">
                    <Calendar size={20} color="white" />
                    <Text fontSize="$3" color="white" opacity={0.9}>
                      今日用药
                    </Text>
                  </XStack>
                  <XStack alignItems="baseline" space="$2">
                    <Text fontSize="$9" fontWeight="bold" color="white">
                      {medications.length}
                    </Text>
                    <Text fontSize="$5" color="white" opacity={0.9}>
                      次
                    </Text>
                  </XStack>
                  <XStack space="$4">
                    <YStack>
                      <Text fontSize="$2" color="white" opacity={0.75}>
                        已完成
                      </Text>
                      <Text fontSize="$4" fontWeight="600" color="white">
                        {takenMeds.length}
                      </Text>
                    </YStack>
                    <YStack>
                      <Text fontSize="$2" color="white" opacity={0.75}>
                        待服用
                      </Text>
                      <Text fontSize="$4" fontWeight="600" color="white">
                        {upcomingMeds.length}
                      </Text>
                    </YStack>
                    {missedMeds.length > 0 && (
                      <YStack>
                        <Text fontSize="$2" color="white" opacity={0.75}>
                          已错过
                        </Text>
                        <Text fontSize="$4" fontWeight="600" color="white">
                          {missedMeds.length}
                        </Text>
                      </YStack>
                    )}
                  </XStack>
                </YStack>
              </LinearGradient>
            </View>

            {/* 已错过的药物 */}
            {missedMeds.length > 0 && (
              <YStack space="$3">
                <XStack space="$2" alignItems="center">
                  <AlertCircle size={16} color={COLORS.error} />
                  <Text fontSize="$3" fontWeight="600" color={COLORS.error}>
                    已错过
                  </Text>
                </XStack>
                {missedMeds.map(med => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onMarkAsTaken={handleMarkAsTaken}
                    onDelete={handleDeleteMedication}
                  />
                ))}
              </YStack>
            )}

            {/* 待服用的药物 */}
            {upcomingMeds.length > 0 && (
              <YStack space="$3">
                <XStack space="$2" alignItems="center">
                  <Clock size={16} color={COLORS.text} />
                  <Text fontSize="$3" fontWeight="600" color="$text">
                    待服用
                  </Text>
                </XStack>
                {upcomingMeds.map(med => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onMarkAsTaken={handleMarkAsTaken}
                    onDelete={handleDeleteMedication}
                  />
                ))}
              </YStack>
            )}

            {/* 已完成的药物 */}
            {takenMeds.length > 0 && (
              <YStack space="$3">
                <XStack space="$2" alignItems="center">
                  <Check size={16} color={COLORS.textSecondary} />
                  <Text fontSize="$3" fontWeight="600" color="$textSecondary">
                    已完成
                  </Text>
                </XStack>
                {takenMeds.map(med => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onMarkAsTaken={handleMarkAsTaken}
                    onDelete={handleDeleteMedication}
                  />
                ))}
              </YStack>
            )}

            {/* 空状态 */}
            {medications.length === 0 && (
              <YStack alignItems="center" paddingVertical="$8" space="$4">
                <View
                  width={96}
                  height={96}
                  borderRadius={48}
                  backgroundColor={COLORS.primaryLight}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Pill size={48} color={COLORS.primary} />
                </View>
                <YStack alignItems="center" space="$2">
                  <H3 fontSize="$5" fontWeight="600" color="$text">
                    暂无用药提醒
                  </H3>
                  <Text fontSize="$3" color="$textSecondary" textAlign="center">
                    添加您的用药计划，我们会按时提醒您
                  </Text>
                </YStack>
                <Pressable onPress={() => setIsAddDialogOpen(true)}>
                  <View
                    backgroundColor={COLORS.primary}
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    borderRadius="$3"
                  >
                    <XStack space="$2" alignItems="center">
                      <Plus size={16} color="white" />
                      <Text fontSize="$3" color="white" fontWeight="500">
                        添加第一个提醒
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </YStack>
            )}
          </YStack>
        </ScrollView>

        {/* 添加用药提醒对话框 */}
        {isAddDialogOpen && (
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(0,0,0,0.5)"
            zIndex={1000}
            justifyContent="center"
            alignItems="center"
            paddingHorizontal="$4"
          >
            <Card
              width="100%"
              maxWidth={400}
              padding="$4"
              borderRadius="$6"
              backgroundColor="$cardBg"
            >
              <YStack space="$4">
                <XStack justifyContent="space-between" alignItems="center">
                  <H3 fontSize="$5" fontWeight="600" color="$text">
                    添加用药提醒
                  </H3>
                  <Pressable onPress={() => setIsAddDialogOpen(false)}>
                    <Text fontSize="$6" color="$textSecondary">×</Text>
                  </Pressable>
                </XStack>

                <YStack space="$3">
                  <YStack space="$2">
                    <Text fontSize="$3" color="$text" fontWeight="500">
                      药品名称
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="例如：阿司匹林"
                      value={newMedication.name}
                      onChangeText={(text) => setNewMedication({ ...newMedication, name: text })}
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </YStack>

                  <XStack space="$3">
                    <YStack flex={1} space="$2">
                      <Text fontSize="$3" color="$text" fontWeight="500">
                        剂量
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="例如：100mg"
                        value={newMedication.dosage}
                        onChangeText={(text) => setNewMedication({ ...newMedication, dosage: text })}
                        placeholderTextColor={COLORS.textSecondary}
                      />
                    </YStack>
                    <YStack flex={1} space="$2">
                      <Text fontSize="$3" color="$text" fontWeight="500">
                        频率
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="每日一次"
                        value={newMedication.frequency}
                        onChangeText={(text) => setNewMedication({ ...newMedication, frequency: text })}
                        placeholderTextColor={COLORS.textSecondary}
                      />
                    </YStack>
                  </XStack>

                  <YStack space="$2">
                    <Text fontSize="$3" color="$text" fontWeight="500">
                      服用时间
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="08:00"
                      value={newMedication.time}
                      onChangeText={(text) => setNewMedication({ ...newMedication, time: text })}
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </YStack>

                  <YStack space="$2">
                    <Text fontSize="$3" color="$text" fontWeight="500">
                      备注（可选）
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="例如：饭后服用"
                      value={newMedication.notes}
                      onChangeText={(text) => setNewMedication({ ...newMedication, notes: text })}
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </YStack>
                </YStack>

                <Pressable onPress={handleAddMedication}>
                  <View
                    backgroundColor={COLORS.primary}
                    paddingVertical="$3"
                    borderRadius="$3"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <XStack space="$2" alignItems="center">
                      <Bell size={16} color="white" />
                      <Text fontSize="$3" color="white" fontWeight="500">
                        创建提醒
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </YStack>
            </Card>
          </View>
        )}
      </SafeAreaView>
    </Theme>
  );
};

// 药物卡片组件
function MedicationCard({
  medication,
  onMarkAsTaken,
  onDelete,
}: {
  medication: Medication;
  onMarkAsTaken: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const getStatusIcon = (status: Medication['status']) => {
    switch (status) {
      case 'upcoming':
        return <Clock size={20} color={COLORS.info} />;
      case 'taken':
        return <Check size={20} color={COLORS.success} />;
      case 'missed':
        return <AlertCircle size={20} color={COLORS.error} />;
    }
  };

  const getStatusBadge = (status: Medication['status']) => {
    switch (status) {
      case 'upcoming':
        return { text: '待服用', color: COLORS.info };
      case 'taken':
        return { text: '已服用', color: COLORS.success };
      case 'missed':
        return { text: '已错过', color: COLORS.error };
    }
  };

  const statusBadge = getStatusBadge(medication.status);

  return (
    <Card
      padding="$4"
      borderRadius="$4"
      backgroundColor="$cardBg"
      borderLeftWidth={4}
      borderLeftColor={medication.color}
      opacity={medication.status === 'taken' ? 0.6 : 1}
    >
      <YStack space="$3">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <XStack space="$3" flex={1}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={`${medication.color}20`}
              justifyContent="center"
              alignItems="center"
            >
              <Pill size={20} color={medication.color} />
            </View>
            <YStack flex={1}>
              <H3 fontSize="$4" fontWeight="600" color="$text">
                {medication.name}
              </H3>
              <XStack space="$2" alignItems="center">
                <Text fontSize="$2" color="$textSecondary">
                  {medication.dosage}
                </Text>
                <Text fontSize="$2" color="$textSecondary">·</Text>
                <Text fontSize="$2" color="$textSecondary">
                  {medication.frequency}
                </Text>
              </XStack>
              {medication.notes && (
                <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                  {medication.notes}
                </Text>
              )}
            </YStack>
          </XStack>
          {getStatusIcon(medication.status)}
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2" alignItems="center">
            <View
              backgroundColor={statusBadge.color}
              paddingHorizontal="$2"
              paddingVertical="$0.5"
              borderRadius="$2"
            >
              <Text fontSize="$1" color="white" fontWeight="500">
                {statusBadge.text}
              </Text>
            </View>
            <Text fontSize="$2" color="$textSecondary">
              {medication.nextDose}
            </Text>
          </XStack>
          <XStack space="$1">
            {medication.status !== 'taken' && (
              <Pressable onPress={() => onMarkAsTaken(medication.id)}>
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="transparent"
                >
                  <Check size={16} color={COLORS.success} />
                </View>
              </Pressable>
            )}
            <Pressable>
              <View
                width={32}
                height={32}
                borderRadius={16}
                justifyContent="center"
                alignItems="center"
                backgroundColor="transparent"
              >
                <Edit size={16} color={COLORS.text} />
              </View>
            </Pressable>
            <Pressable onPress={() => onDelete(medication.id)}>
              <View
                width={32}
                height={32}
                borderRadius={16}
                justifyContent="center"
                alignItems="center"
                backgroundColor="transparent"
              >
                <Trash2 size={16} color={COLORS.error} />
              </View>
            </Pressable>
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
});