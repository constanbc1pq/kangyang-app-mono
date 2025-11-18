/**
 * 健康档案界面
 * Health Records Screen
 *
 * Phase 24.1: 健康档案系统
 * - 完整病历展示
 * - 处方用药史（时间轴）
 * - 检查报告库
 * - 住院记录
 * - 免疫接种记录
 * - 档案分类Tab
 * - 搜索功能
 * - 导出功能
 */

import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  Download,
  Upload,
  FileText,
  Pill,
  TestTube,
  Bed,
  Syringe,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

type RecordTab = 'all' | 'consultations' | 'prescriptions' | 'reports' | 'hospital' | 'vaccines';

interface ConsultationRecord {
  id: string;
  date: string;
  doctor: string;
  department: string;
  diagnosis: string;
  type: 'video' | 'in_person' | 'phone';
}

interface PrescriptionRecord {
  id: string;
  date: string;
  doctor: string;
  medications: { name: string; dosage: string }[];
  status: 'active' | 'completed';
}

interface ReportRecord {
  id: string;
  date: string;
  type: string;
  name: string;
  result: string;
  fileUrl?: string;
}

interface HospitalRecord {
  id: string;
  admissionDate: string;
  dischargeDate: string;
  hospital: string;
  department: string;
  diagnosis: string;
  duration: number;
}

interface VaccineRecord {
  id: string;
  date: string;
  vaccine: string;
  dose: string;
  location: string;
  nextDue?: string;
}

const MOCK_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'c1',
    date: '2024-11-10',
    doctor: '张伟',
    department: '心血管内科',
    diagnosis: '疑似心律不齐',
    type: 'video',
  },
  {
    id: 'c2',
    date: '2024-10-15',
    doctor: '李明',
    department: '内分泌科',
    diagnosis: '血糖控制良好',
    type: 'in_person',
  },
];

const MOCK_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    id: 'p1',
    date: '2024-11-10',
    doctor: '张伟',
    medications: [
      { name: '稳心颗粒', dosage: '9g/袋，每日3次' },
      { name: '辅酶Q10', dosage: '10mg/粒，每日2次' },
    ],
    status: 'active',
  },
  {
    id: 'p2',
    date: '2024-10-15',
    doctor: '李明',
    medications: [{ name: '二甲双胍', dosage: '500mg/次，每日2次' }],
    status: 'completed',
  },
];

const MOCK_REPORTS: ReportRecord[] = [
  {
    id: 'r1',
    date: '2024-11-05',
    type: '心电图',
    name: '心电图检查报告',
    result: '轻度心律不齐',
  },
  {
    id: 'r2',
    date: '2024-10-10',
    type: '血液检查',
    name: '血常规+生化全套',
    result: '各项指标基本正常',
  },
];

const MOCK_HOSPITAL_RECORDS: HospitalRecord[] = [
  {
    id: 'h1',
    admissionDate: '2023-06-15',
    dischargeDate: '2023-06-20',
    hospital: '北京协和医院',
    department: '心血管内科',
    diagnosis: '心肌梗死（已康复）',
    duration: 5,
  },
];

const MOCK_VACCINES: VaccineRecord[] = [
  {
    id: 'v1',
    date: '2024-09-01',
    vaccine: '流感疫苗',
    dose: '第1剂',
    location: '社区卫生服务中心',
    nextDue: '2025-09-01',
  },
  {
    id: 'v2',
    date: '2023-03-10',
    vaccine: '新冠疫苗（加强针）',
    dose: '第4剂',
    location: '北京朝阳医院',
  },
];

const HealthRecordsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<RecordTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: '全部', icon: FileText },
    { id: 'consultations', label: '问诊', icon: FileText },
    { id: 'prescriptions', label: '处方', icon: Pill },
    { id: 'reports', label: '检查', icon: TestTube },
    { id: 'hospital', label: '住院', icon: Bed },
    { id: 'vaccines', label: '疫苗', icon: Syringe },
  ] as const;

  const handleExport = () => {
    Alert.alert('导出健康档案', '选择导出格式', [
      {
        text: 'PDF格式',
        onPress: () => Alert.alert('成功', '健康档案已导出为PDF'),
      },
      {
        text: 'Excel格式',
        onPress: () => Alert.alert('成功', '健康档案已导出为Excel'),
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleUploadReport = () => {
    Alert.alert('上传报告', '请选择要上传的检查报告', [
      { text: '拍照', onPress: () => Alert.alert('成功', '报告已上传') },
      { text: '从相册选择', onPress: () => Alert.alert('成功', '报告已上传') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const renderConsultationRecord = (record: ConsultationRecord) => (
    <TouchableOpacity
      key={record.id}
      onPress={() => navigation.navigate('ConsultationDetail', { consultationId: record.id })}
    >
      <View
        padding="$4"
        backgroundColor="$surface"
        borderRadius="$4"
        marginBottom="$3"
        borderLeftWidth={4}
        borderLeftColor={COLORS.primary}
      >
        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
          <YStack flex={1}>
            <Text fontSize={16} fontWeight="600" marginBottom="$1">
              {record.department}
            </Text>
            <Text fontSize={14} color="$gray11">
              {record.doctor} 医生
            </Text>
          </YStack>
          <ChevronRight size={20} color="$gray10" />
        </XStack>
        <Text fontSize={14} color={COLORS.text} marginBottom="$2">
          诊断：{record.diagnosis}
        </Text>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={13} color="$gray10">
            {record.date}
          </Text>
          <View
            paddingHorizontal="$2"
            paddingVertical="$1"
            backgroundColor="#E3F2FD"
            borderRadius="$2"
          >
            <Text fontSize={12} color="#1976D2">
              {record.type === 'video' ? '视频' : record.type === 'in_person' ? '面诊' : '电话'}
            </Text>
          </View>
        </XStack>
      </View>
    </TouchableOpacity>
  );

  const renderPrescriptionRecord = (record: PrescriptionRecord) => (
    <View
      key={record.id}
      padding="$4"
      backgroundColor={record.status === 'active' ? '#E8F5E9' : '$surface'}
      borderRadius="$4"
      marginBottom="$3"
      borderLeftWidth={4}
      borderLeftColor={record.status === 'active' ? '#4CAF50' : '$gray8'}
    >
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
        <YStack flex={1}>
          <Text fontSize={16} fontWeight="600" marginBottom="$1">
            处方记录
          </Text>
          <Text fontSize={14} color="$gray11">
            {record.doctor} 医生开具
          </Text>
        </YStack>
        <View
          paddingHorizontal="$2"
          paddingVertical="$1"
          backgroundColor={record.status === 'active' ? '#4CAF50' : '$gray8'}
          borderRadius="$2"
        >
          <Text fontSize={12} color="white">
            {record.status === 'active' ? '用药中' : '已完成'}
          </Text>
        </View>
      </XStack>
      <YStack space="$1" marginBottom="$2">
        {record.medications.map((med, idx) => (
          <Text key={idx} fontSize={14} color={COLORS.text}>
            • {med.name} - {med.dosage}
          </Text>
        ))}
      </YStack>
      <Text fontSize={13} color="$gray10">
        {record.date}
      </Text>
    </View>
  );

  const renderReportRecord = (record: ReportRecord) => (
    <TouchableOpacity key={record.id}>
      <View
        padding="$4"
        backgroundColor="$surface"
        borderRadius="$4"
        marginBottom="$3"
      >
        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
          <YStack flex={1}>
            <View
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="#E3F2FD"
              borderRadius="$2"
              alignSelf="flex-start"
              marginBottom="$2"
            >
              <Text fontSize={12} color="#1976D2">
                {record.type}
              </Text>
            </View>
            <Text fontSize={16} fontWeight="600" marginBottom="$1">
              {record.name}
            </Text>
            <Text fontSize={14} color={COLORS.text}>
              结果：{record.result}
            </Text>
          </YStack>
          <TouchableOpacity>
            <View
              width={36}
              height={36}
              backgroundColor="#E3F2FD"
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
            >
              <Download size={18} color="#1976D2" />
            </View>
          </TouchableOpacity>
        </XStack>
        <Text fontSize={13} color="$gray10">
          {record.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHospitalRecord = (record: HospitalRecord) => (
    <View
      key={record.id}
      padding="$4"
      backgroundColor="$surface"
      borderRadius="$4"
      marginBottom="$3"
      borderLeftWidth={4}
      borderLeftColor="#FF9800"
    >
      <Text fontSize={16} fontWeight="600" marginBottom="$2">
        {record.hospital}
      </Text>
      <YStack space="$1" marginBottom="$2">
        <Text fontSize={14} color={COLORS.text}>
          科室：{record.department}
        </Text>
        <Text fontSize={14} color={COLORS.text}>
          诊断：{record.diagnosis}
        </Text>
        <Text fontSize={14} color={COLORS.text}>
          住院时长：{record.duration}天
        </Text>
      </YStack>
      <Text fontSize={13} color="$gray10">
        {record.admissionDate} 至 {record.dischargeDate}
      </Text>
    </View>
  );

  const renderVaccineRecord = (record: VaccineRecord) => (
    <View
      key={record.id}
      padding="$4"
      backgroundColor="$surface"
      borderRadius="$4"
      marginBottom="$3"
    >
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1}>
          <Text fontSize={16} fontWeight="600" marginBottom="$2">
            {record.vaccine}
          </Text>
          <YStack space="$1">
            <Text fontSize={14} color={COLORS.text}>
              剂次：{record.dose}
            </Text>
            <Text fontSize={14} color={COLORS.text}>
              接种地点：{record.location}
            </Text>
            <Text fontSize={13} color="$gray10" marginTop="$1">
              接种日期：{record.date}
            </Text>
            {record.nextDue && (
              <Text fontSize={13} color={COLORS.primary} marginTop="$1">
                下次接种：{record.nextDue}
              </Text>
            )}
          </YStack>
        </YStack>
      </XStack>
    </View>
  );

  const renderContent = () => {
    const allRecords = activeTab === 'all';

    return (
      <YStack space="$3">
        {(allRecords || activeTab === 'consultations') && (
          <>
            {allRecords && (
              <Text fontSize={17} fontWeight="600" marginTop="$2">
                问诊记录
              </Text>
            )}
            {MOCK_CONSULTATIONS.map(renderConsultationRecord)}
          </>
        )}

        {(allRecords || activeTab === 'prescriptions') && (
          <>
            {allRecords && (
              <Text fontSize={17} fontWeight="600" marginTop="$2">
                处方记录
              </Text>
            )}
            {MOCK_PRESCRIPTIONS.map(renderPrescriptionRecord)}
          </>
        )}

        {(allRecords || activeTab === 'reports') && (
          <>
            {allRecords && (
              <Text fontSize={17} fontWeight="600" marginTop="$2">
                检查报告
              </Text>
            )}
            {MOCK_REPORTS.map(renderReportRecord)}
          </>
        )}

        {(allRecords || activeTab === 'hospital') && (
          <>
            {allRecords && (
              <Text fontSize={17} fontWeight="600" marginTop="$2">
                住院记录
              </Text>
            )}
            {MOCK_HOSPITAL_RECORDS.map(renderHospitalRecord)}
          </>
        )}

        {(allRecords || activeTab === 'vaccines') && (
          <>
            {allRecords && (
              <Text fontSize={17} fontWeight="600" marginTop="$2">
                疫苗接种记录
              </Text>
            )}
            {MOCK_VACCINES.map(renderVaccineRecord)}
          </>
        )}
      </YStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="600">
            健康档案
          </Text>
          <XStack space="$3">
            <TouchableOpacity onPress={handleUploadReport}>
              <Upload size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExport}>
              <Download size={22} color={COLORS.text} />
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* Search */}
        <View
          backgroundColor="$gray2"
          borderRadius="$3"
          paddingHorizontal="$3"
          paddingVertical="$2"
        >
          <XStack space="$2" alignItems="center">
            <Search size={18} color="$gray10" />
            <RNTextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="搜索病历、处方、报告..."
              placeholderTextColor="#999"
              style={{ flex: 1, fontSize: 15, color: COLORS.text }}
            />
          </XStack>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 60 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <XStack space="$2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)}>
                <View
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  backgroundColor={isActive ? COLORS.primary : '$surface'}
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor={isActive ? COLORS.primary : '$borderColor'}
                >
                  <XStack space="$2" alignItems="center">
                    <Icon size={16} color={isActive ? 'white' : COLORS.text} />
                    <Text
                      fontSize={14}
                      fontWeight={isActive ? '600' : '400'}
                      color={isActive ? 'white' : COLORS.text}
                    >
                      {tab.label}
                    </Text>
                  </XStack>
                </View>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthRecordsScreen;
