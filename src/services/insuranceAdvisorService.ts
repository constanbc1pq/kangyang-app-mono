/**
 * 保险顾问与咨询服务
 * Insurance Advisor and Consultation Service
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { InsuranceAdvisor, InsuranceConsultation, ConsultationType } from '@/types/insurance';

// Mock 数据 - 保险顾问
const mockAdvisors: InsuranceAdvisor[] = [
  {
    id: 'advisor_001',
    name: '张晓明',
    avatar: 'https://i.pravatar.cc/150?img=33',
    employeeId: 'INS2024001',
    organization: '康养保险规划中心',
    certifications: ['AFP', 'CFP', '保险代理资格证'],
    yearsOfExperience: 12,
    specialties: ['养老规划', '高净值传承', '家庭保障'],
    clientsServed: 856,
    satisfactionRate: 98.5,
    avgResponseTime: '15分钟',
    serviceCities: ['北京', '上海', '深圳'],
    onlineStatus: 'online',
    introduction:
      '12年保险从业经验，专注中老年人保险规划。持有AFP、CFP双证，擅长养老规划和高净值人群财富传承方案设计。已服务客户超过850人，客户满意度98.5%。',
    successCases: [
      '为65岁张先生设计养老年金方案，每年领取20万养老金',
      '帮助王女士家庭配置全面保障，节省保费30%',
      '协助李先生完成百万理赔，全程跟进仅用3天',
    ],
  },
  {
    id: 'advisor_002',
    name: '李慧敏',
    avatar: 'https://i.pravatar.cc/150?img=47',
    employeeId: 'INS2024002',
    organization: '康养保险规划中心',
    certifications: ['保险代理资格证', 'ChFP'],
    yearsOfExperience: 8,
    specialties: ['医疗险配置', '重疾险规划', '防癌险'],
    clientsServed: 623,
    satisfactionRate: 97.2,
    avgResponseTime: '20分钟',
    serviceCities: ['广州', '杭州', '成都'],
    onlineStatus: 'online',
    introduction:
      '8年保险行业经验，专注医疗险和重疾险配置。特别擅长为中老年人、三高人群设计合适的保障方案。持有ChFP理财规划师资格，已帮助600+家庭完成保障规划。',
    successCases: [
      '为三高客户成功投保防癌医疗险',
      '帮助60岁陈阿姨配置百万医疗险',
      '协助客户理赔重疾险，获赔50万',
    ],
  },
  {
    id: 'advisor_003',
    name: '王建国',
    avatar: 'https://i.pravatar.cc/150?img=12',
    employeeId: 'INS2024003',
    organization: '康养保险规划中心',
    certifications: ['AFP', '保险代理资格证'],
    yearsOfExperience: 10,
    specialties: ['年金险', '增额终身寿', '养老规划'],
    clientsServed: 742,
    satisfactionRate: 98.1,
    avgResponseTime: '10分钟',
    serviceCities: ['北京', '天津', '石家庄'],
    onlineStatus: 'busy',
    introduction:
      '10年金融保险从业经验，AFP持证人。专注养老金融产品规划，擅长年金险和增额终身寿险配置。已帮助700+家庭完成养老储蓄规划，累计规划资金超过2亿元。',
    successCases: [
      '为客户设计养老年金方案，退休后月领1.5万',
      '帮助企业主完成财富传承规划',
      '协助多位客户完成保单贷款和保单转换',
    ],
  },
];

/**
 * 获取顾问列表
 */
export const getAdvisors = async (filters?: {
  specialty?: string;
  city?: string;
  onlineStatus?: 'online' | 'busy' | 'offline' | 'all';
  sortBy?: string;
}): Promise<InsuranceAdvisor[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let filteredAdvisors = [...mockAdvisors];

  // 专业领域筛选
  if (filters?.specialty && filters.specialty !== 'all') {
    filteredAdvisors = filteredAdvisors.filter(a =>
      a.specialties.includes(filters.specialty!)
    );
  }

  // 服务城市筛选
  if (filters?.city) {
    filteredAdvisors = filteredAdvisors.filter(a => a.serviceCities.includes(filters.city!));
  }

  // 在线状态筛选
  if (filters?.onlineStatus && filters.onlineStatus !== 'all') {
    filteredAdvisors = filteredAdvisors.filter(a => a.onlineStatus === filters.onlineStatus);
  }

  // 排序
  switch (filters?.sortBy) {
    case 'satisfaction':
      filteredAdvisors.sort((a, b) => b.satisfactionRate - a.satisfactionRate);
      break;
    case 'experience':
      filteredAdvisors.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      break;
    case 'response_time':
      // 简单排序（实际应该转换时间字符串）
      filteredAdvisors.sort((a, b) => {
        const timeA = parseInt(a.avgResponseTime);
        const timeB = parseInt(b.avgResponseTime);
        return timeA - timeB;
      });
      break;
    default:
      // 综合推荐
      filteredAdvisors.sort((a, b) => {
        const scoreA = a.satisfactionRate * 0.4 + (100 - a.yearsOfExperience) * 0.3 + a.clientsServed / 10 * 0.3;
        const scoreB = b.satisfactionRate * 0.4 + (100 - b.yearsOfExperience) * 0.3 + b.clientsServed / 10 * 0.3;
        return scoreB - scoreA;
      });
  }

  return filteredAdvisors;
};

/**
 * 获取顾问详情
 */
export const getAdvisorById = async (advisorId: string): Promise<InsuranceAdvisor | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAdvisors.find(a => a.id === advisorId) || null;
};

/**
 * 创建咨询（完全免费）
 */
export const createConsultation = async (consultationData: {
  userId: string;
  advisorId: string;
  type: ConsultationType;
  question: string;
  questionImages?: string[];
  tags?: string[];
  appointmentDate?: string;
  appointmentTime?: string;
  address?: string;
}): Promise<InsuranceConsultation> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const advisor = mockAdvisors.find(a => a.id === consultationData.advisorId);
  if (!advisor) {
    throw new Error('Advisor not found');
  }

  const newConsultation: InsuranceConsultation = {
    id: `consultation_${Date.now()}`,
    userId: consultationData.userId,
    advisorId: consultationData.advisorId,
    advisorName: advisor.name,
    advisorAvatar: advisor.avatar,
    type: consultationData.type,
    status: 'pending',
    question: consultationData.question,
    questionImages: consultationData.questionImages,
    tags: consultationData.tags,
    appointmentDate: consultationData.appointmentDate,
    appointmentTime: consultationData.appointmentTime,
    address: consultationData.address,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 保存到本地存储
  try {
    const existingData = await AsyncStorage.getItem('insurance_consultations');
    const consultations = existingData ? JSON.parse(existingData) : [];
    consultations.push(newConsultation);
    await AsyncStorage.setItem('insurance_consultations', JSON.stringify(consultations));
    console.log('✅ 咨询记录已保存:', newConsultation.id);
  } catch (error) {
    console.error('❌ 保存咨询记录失败:', error);
  }

  return newConsultation;
};

/**
 * 获取我的咨询记录
 */
export const getMyConsultations = async (userId: string): Promise<InsuranceConsultation[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    const data = await AsyncStorage.getItem('insurance_consultations');
    if (data) {
      const consultations: InsuranceConsultation[] = JSON.parse(data);
      return consultations
        .filter(c => c.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (error) {
    console.error('❌ 读取咨询记录失败:', error);
  }

  return [];
};

/**
 * 获取咨询详情
 */
export const getConsultationById = async (
  consultationId: string
): Promise<InsuranceConsultation | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const data = await AsyncStorage.getItem('insurance_consultations');
    if (data) {
      const consultations: InsuranceConsultation[] = JSON.parse(data);
      return consultations.find(c => c.id === consultationId) || null;
    }
  } catch (error) {
    console.error('❌ 读取咨询详情失败:', error);
  }

  return null;
};

/**
 * 回复咨询（追问）
 */
export const replyConsultation = async (
  consultationId: string,
  reply: string
): Promise<InsuranceConsultation> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    const data = await AsyncStorage.getItem('insurance_consultations');
    if (data) {
      const consultations: InsuranceConsultation[] = JSON.parse(data);
      const index = consultations.findIndex(c => c.id === consultationId);

      if (index !== -1) {
        if (!consultations[index].followUps) {
          consultations[index].followUps = [];
        }
        consultations[index].followUps!.push({
          question: reply,
          createdAt: new Date().toISOString(),
        });
        consultations[index].updatedAt = new Date().toISOString();

        await AsyncStorage.setItem('insurance_consultations', JSON.stringify(consultations));
        console.log('✅ 追问已添加');
        return consultations[index];
      }
    }
  } catch (error) {
    console.error('❌ 追问失败:', error);
  }

  throw new Error('Consultation not found');
};

/**
 * 评价咨询
 */
export const rateConsultation = async (
  consultationId: string,
  rating: number,
  review?: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const data = await AsyncStorage.getItem('insurance_consultations');
    if (data) {
      const consultations: InsuranceConsultation[] = JSON.parse(data);
      const index = consultations.findIndex(c => c.id === consultationId);

      if (index !== -1) {
        consultations[index].rating = rating;
        consultations[index].review = review;
        consultations[index].status = 'completed';
        consultations[index].updatedAt = new Date().toISOString();

        await AsyncStorage.setItem('insurance_consultations', JSON.stringify(consultations));
        console.log('✅ 评价已提交');
      }
    }
  } catch (error) {
    console.error('❌ 评价失败:', error);
  }
};

/**
 * 预约上门服务
 */
export const bookHomeVisit = async (visitData: {
  userId: string;
  advisorId: string;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  serviceDescription: string;
}): Promise<InsuranceConsultation> => {
  return createConsultation({
    userId: visitData.userId,
    advisorId: visitData.advisorId,
    type: 'home_visit',
    question: visitData.serviceDescription,
    appointmentDate: visitData.appointmentDate,
    appointmentTime: visitData.appointmentTime,
    address: visitData.address,
    tags: ['上门服务'],
  });
};
